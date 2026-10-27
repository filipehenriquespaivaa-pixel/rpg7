/* js/extras/mapa-global.js
 * MAPA GLOBAL (Modo Desenvolvedor): versão expandida do minimapa/radar, em tela cheia, com
 * ARRASTAR (mouse/toque), ZOOM (roda do mouse, pinça, botões +/-, teclas) e legenda de biomas.
 * Serve para ver como os biomas estão sendo construídos no mundo inteiro (superfície).
 *
 * Marca as cidades (Picos Gelados, Deserto, Porto) com centro e raio do territorio.
 * Como abrir: botão "🗺️ Mapa Global" na barra do Modo Desenvolvedor, clique no Radar (minimapa),
 * ou window.toggleMapaGlobal() / window.openMapaGlobal() / window.closeMapaGlobal().
 *
 * Como funciona: lê o mundo em window.__worldEngine (World) e o jogador em window.__playerRef
 * (definidos em game-main.js). Usa SOMENTE World._computeSurfaceBaseBiome(tx, ty), que é pura (só ruído +
 * áreas das cidades): não grava nada no tileCache do jogo, não mexe em props e não depende de o jogador
 * estar na superfície ou numa caverna.
 * O desenho é progressivo: o mundo é dividido em blocos de 64x64 amostras, calculados aos poucos
 * (orçamento de ~10 ms por quadro) e guardados em cache por nível de zoom (1 amostra = 2^k tiles).
 * Cada bloco guarda o índice do bioma de cada amostra, então destacar um bioma não recalcula nada.
 * Sem dependências além de World/BIOMES (escopo global). Sem import/export.
 */
(function () {
  "use strict";
  if (window.__mapaGlobalInit) return;
  window.__mapaGlobalInit = true;

  const BS = 64; // amostras por lado de cada bloco
  const MIN_PX = 4; // tamanho minimo (px na tela) de uma amostra
  const Z_MIN = 0.004; // px por tile (maximo afastado)
  const Z_MAX = 24; // px por tile (maximo aproximado)
  const MAX_K = 12;
  const MAX_BLOCKS = 700; // limite do cache (~11 MB)
  const BUDGET_MS = 10; // tempo de calculo por quadro
  const UNKNOWN = 255;

  const st = {
    open: false,
    cx: 0, // centro da vista, em tiles
    cy: 0,
    z: 1, // px por tile
    w: 0,
    h: 0,
    dpr: 1,
    grid: true,
    legend: true,
    hl: new Set(), // indices de biomas destacados
    mouse: null, // {x, y} em px de tela
    frame: 0,
  };
  let ui = null; // elementos do DOM
  let raf = 0;
  const cache = new Map(); // "k|bx|by" -> bloco
  let cacheKey = "";
  let palette = null; // {list, idToIndex, rgb}
  const pointers = new Map();
  let pinch = null;

  // ------------------------------------------------------------------ utilidades
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function getWorld() {
    return window.__worldEngine || null;
  }
  function levelFor(z) {
    return z >= MIN_PX ? 0 : clamp(Math.ceil(Math.log2(MIN_PX / z)), 0, MAX_K);
  }
  function hexToRgb(hex) {
    let h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return Number.isNaN(n) || h.length !== 6 ? [100, 116, 139] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function buildPalette() {
    if (palette) return palette;
    const list = typeof BIOMES !== "undefined" ? Object.values(BIOMES) : [];
    const idToIndex = new Map();
    const rgb = [];
    list.forEach((b, i) => {
      idToIndex.set(b.id, i);
      rgb.push(hexToRgb(b.groundColor));
    });
    palette = { list, idToIndex, rgb };
    return palette;
  }
  function biomeName(b) {
    return (b && (b.namePt || b.name || b.id)) || "?";
  }
  function playerTile() {
    const w = getWorld();
    const ref = window.__playerRef;
    const p = ref && ref.current;
    if (!w || !p || typeof p.x !== "number") return null;
    return { x: p.x / w.tileSize, y: p.y / w.tileSize };
  }
  function sampleBiomeAt(tx, ty) {
    const w = getWorld();
    if (!w || typeof w._computeSurfaceBaseBiome !== "function") return null;
    try {
      return w._computeSurfaceBaseBiome(Math.floor(tx), Math.floor(ty));
    } catch (e) {
      return null;
    }
  }

  // ------------------------------------------------------------------ cache de blocos
  function checkWorldChanged() {
    const w = getWorld();
    const key = w ? String(w.seed) + ":" + (w.tileSize || 0) : "";
    if (key !== cacheKey) {
      cacheKey = key;
      cache.clear();
    }
  }
  function getBlock(k, bx, by, create) {
    const key = k + "|" + bx + "|" + by;
    let b = cache.get(key);
    if (!b && create) {
      const c = document.createElement("canvas");
      c.width = BS;
      c.height = BS;
      const cctx = c.getContext("2d");
      b = {
        k,
        bx,
        by,
        cv: c,
        ctx: cctx,
        img: cctx ? cctx.createImageData(BS, BS) : null,
        idx: new Uint8Array(BS * BS).fill(UNKNOWN),
        row: 0,
        done: false,
        used: st.frame,
      };
      cache.set(key, b);
      if (cache.size > MAX_BLOCKS) evict();
    }
    if (b) b.used = st.frame;
    return b;
  }
  function evict() {
    const arr = Array.from(cache.entries()).sort((a, b) => a[1].used - b[1].used);
    let n = cache.size - Math.floor(MAX_BLOCKS * 0.8);
    for (let i = 0; i < arr.length && n > 0; i++) {
      if (arr[i][1].used === st.frame) continue; // nunca remove o que esta na tela agora
      cache.delete(arr[i][0]);
      n--;
    }
  }
  function paintBlock(b) {
    if (!b.img || !b.ctx) return;
    const pal = buildPalette();
    const d = b.img.data;
    const hasHl = st.hl.size > 0;
    const rows = b.done ? BS : b.row;
    for (let i = 0; i < rows * BS; i++) {
      const id = b.idx[i];
      let r = 30,
        g = 41,
        bl = 59;
      if (id !== UNKNOWN && pal.rgb[id]) {
        r = pal.rgb[id][0];
        g = pal.rgb[id][1];
        bl = pal.rgb[id][2];
        if (hasHl && !st.hl.has(id)) {
          r = (r * 0.22 + 8) | 0;
          g = (g * 0.22 + 10) | 0;
          bl = (bl * 0.22 + 18) | 0;
        }
      }
      const o = i * 4;
      d[o] = r;
      d[o + 1] = g;
      d[o + 2] = bl;
      d[o + 3] = 255;
    }
    b.ctx.putImageData(b.img, 0, 0);
  }
  function repaintAll() {
    cache.forEach((b) => paintBlock(b));
  }
  // calcula linhas do bloco ate acabar o tempo; devolve true se calculou algo
  function workBlock(b, deadline) {
    const w = getWorld();
    if (!w || b.done) return false;
    const pal = buildPalette();
    const step = 1 << b.k;
    const off = b.k === 0 ? 0 : step >> 1;
    const x0 = b.bx * BS * step;
    const y0 = b.by * BS * step;
    let did = false;
    while (b.row < BS && performance.now() < deadline) {
      const ty = y0 + b.row * step + off;
      for (let c = 0; c < BS; c++) {
        let id = UNKNOWN;
        try {
          const bio = w._computeSurfaceBaseBiome(x0 + c * step + off, ty);
          const i = bio ? pal.idToIndex.get(bio.id) : void 0;
          if (i !== void 0) id = i;
        } catch (e) {
          /* amostra invalida: fica "desconhecida" */
        }
        b.idx[b.row * BS + c] = id;
      }
      b.row++;
      did = true;
    }
    if (b.row >= BS) b.done = true;
    if (did) paintBlock(b);
    return did;
  }

  // ------------------------------------------------------------------ vista
  function viewBounds() {
    const hw = st.w / 2 / st.z;
    const hh = st.h / 2 / st.z;
    return { x0: st.cx - hw, y0: st.cy - hh, x1: st.cx + hw, y1: st.cy + hh };
  }
  function screenToWorld(sx, sy) {
    return { x: st.cx + (sx - st.w / 2) / st.z, y: st.cy + (sy - st.h / 2) / st.z };
  }
  function zoomAt(newZ, sx, sy) {
    const z = clamp(newZ, Z_MIN, Z_MAX);
    const before = screenToWorld(sx, sy);
    st.z = z;
    st.cx = before.x - (sx - st.w / 2) / z;
    st.cy = before.y - (sy - st.h / 2) / z;
  }
  function centerOnPlayer() {
    const p = playerTile();
    if (p) {
      st.cx = p.x;
      st.cy = p.y;
    }
  }

  // ------------------------------------------------------------------ desenho
  function visibleBlocks(k) {
    const size = BS * (1 << k);
    const v = viewBounds();
    const bx0 = Math.floor(v.x0 / size),
      bx1 = Math.floor(v.x1 / size),
      by0 = Math.floor(v.y0 / size),
      by1 = Math.floor(v.y1 / size);
    const out = [];
    if ((bx1 - bx0 + 1) * (by1 - by0 + 1) > 4000) return out;
    for (let by = by0; by <= by1; by++) for (let bx = bx0; bx <= bx1; bx++) out.push([bx, by]);
    return out;
  }
  function drawLevel(ctx, k, create, v) {
    const size = BS * (1 << k);
    const list = visibleBlocks(k);
    const missing = [];
    for (const [bx, by] of list) {
      const b = getBlock(k, bx, by, create);
      if (!b) continue;
      const sx = (bx * size - v.x0) * st.z;
      const sy = (by * size - v.y0) * st.z;
      const x0 = Math.floor(sx),
        y0 = Math.floor(sy);
      const x1 = Math.ceil(sx + size * st.z),
        y1 = Math.ceil(sy + size * st.z);
      if (b.row > 0 || b.done) ctx.drawImage(b.cv, 0, 0, BS, b.done ? BS : b.row, x0, y0, x1 - x0, ((y1 - y0) * (b.done ? BS : b.row)) / BS);
      if (!b.done && create) missing.push({ b, d: Math.hypot(bx * size + size / 2 - st.cx, by * size + size / 2 - st.cy) });
    }
    return missing;
  }
  function niceStep(minTiles) {
    const p = Math.pow(10, Math.floor(Math.log10(minTiles)));
    for (const m of [1, 2, 5, 10]) if (m * p >= minTiles) return m * p;
    return 10 * p;
  }
  function drawOverlay(ctx, v) {
    ctx.save();
    ctx.font = "10px monospace";
    ctx.textBaseline = "top";
    if (st.grid) {
      const g = niceStep(90 / st.z);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.13)";
      ctx.fillStyle = "rgba(226,232,240,0.75)";
      ctx.beginPath();
      for (let x = Math.ceil(v.x0 / g) * g; x <= v.x1; x += g) {
        const sx = Math.round((x - v.x0) * st.z) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, st.h);
      }
      for (let y = Math.ceil(v.y0 / g) * g; y <= v.y1; y += g) {
        const sy = Math.round((y - v.y0) * st.z) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(st.w, sy);
      }
      ctx.stroke();
      for (let x = Math.ceil(v.x0 / g) * g; x <= v.x1; x += g) ctx.fillText(String(x), Math.round((x - v.x0) * st.z) + 3, 48);
      for (let y = Math.ceil(v.y0 / g) * g; y <= v.y1; y += g) ctx.fillText(String(y), 3, Math.round((y - v.y0) * st.z) + 3);
    }
    // eixos da origem (0,0)
    const ox = (0 - v.x0) * st.z,
      oy = (0 - v.y0) * st.z;
    ctx.strokeStyle = "rgba(250,204,21,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ox >= 0 && ox <= st.w) {
      ctx.moveTo(Math.round(ox) + 0.5, 0);
      ctx.lineTo(Math.round(ox) + 0.5, st.h);
    }
    if (oy >= 0 && oy <= st.h) {
      ctx.moveTo(0, Math.round(oy) + 0.5);
      ctx.lineTo(st.w, Math.round(oy) + 0.5);
    }
    ctx.stroke();
    // cidades (centro e raio do territorio): Picos Gelados, Deserto e Portuaria
    const cityList = [["Picos Gelados", window.SnowPeakCity], ["Deserto", window.DesertCity], ["Porto", window.PortCity]];
    for (const [nm, C] of cityList) {
      if (!C || typeof C.centerX !== "number") continue;
      const px = (C.centerX - v.x0) * st.z,
        py = (C.centerY - v.y0) * st.z;
      const rad = (C.radius || 0) * st.z;
      if (px < -rad - 40 || px > st.w + rad + 40 || py < -rad - 40 || py > st.h + rad + 40) continue;
      ctx.strokeStyle = "rgba(125,211,252,0.9)";
      ctx.lineWidth = 1.5;
      if (rad > 3) {
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#7dd3fc";
      ctx.strokeStyle = "#0c4a6e";
      ctx.beginPath();
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px + 6, py);
      ctx.lineTo(px, py + 6);
      ctx.lineTo(px - 6, py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#e0f2fe";
      ctx.fillText("🏙 " + nm + " (" + Math.round(C.centerX) + ", " + Math.round(C.centerY) + ")", px + 10, py + 4);
    }
    // jogador
    const p = playerTile();
    if (p) {
      const px = (p.x - v.x0) * st.z,
        py = (p.y - v.y0) * st.z;
      if (px > -20 && px < st.w + 20 && py > -20 && py < st.h + 20) {
        const pulse = (Math.sin(performance.now() * 0.006) + 1) / 2;
        ctx.strokeStyle = "rgba(248,113,113," + (0.4 + pulse * 0.5) + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 7 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText("Você", px + 10, py - 5);
      }
    }
    // barra de escala
    const scaleTiles = niceStep(110 / st.z);
    const barPx = scaleTiles * st.z;
    ctx.fillStyle = "rgba(2,6,23,0.7)";
    ctx.fillRect(st.w - barPx - 24, st.h - 34, barPx + 16, 24);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(st.w - barPx - 16, st.h - 18, barPx, 2);
    ctx.font = "10px monospace";
    ctx.fillText(scaleTiles + " tiles", st.w - barPx - 16, st.h - 30);
    ctx.restore();
  }
  function render() {
    if (!st.open || !ui) return;
    st.frame++;
    checkWorldChanged();
    const ctx = ui.ctx;
    if (!ctx) return;
    ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, st.w, st.h);
    const v = viewBounds();
    const k = levelFor(st.z);
    let missing = [];
    if (getWorld()) {
      for (let kk = Math.min(k + 3, MAX_K); kk >= k; kk--) {
        const m = drawLevel(ctx, kk, kk === k, v);
        if (kk === k) missing = m;
      }
    }
    // calcula blocos que faltam (mais perto do centro primeiro)
    let remaining = missing.filter((m) => !m.b.done);
    if (remaining.length) {
      remaining.sort((a, b) => a.d - b.d);
      const deadline = performance.now() + BUDGET_MS;
      for (const m of remaining) {
        if (performance.now() >= deadline) break;
        workBlock(m.b, deadline);
      }
      remaining = remaining.filter((m) => !m.b.done);
    }
    drawOverlay(ctx, v);
    updateInfo(remaining.length, k);
  }
  function loop() {
    raf = 0;
    if (!st.open) return;
    try {
      render();
    } catch (e) {
      if (window.console) console.error("[mapa-global]", e);
    }
    raf = requestAnimationFrame(loop);
  }

  // ------------------------------------------------------------------ interface (DOM)
  function updateInfo(pending, k) {
    if (!ui) return;
    const w = getWorld();
    let hover = "";
    if (st.mouse && w) {
      const t = screenToWorld(st.mouse.x, st.mouse.y);
      const b = sampleBiomeAt(t.x, t.y);
      hover = "  |  Cursor: (" + Math.floor(t.x) + ", " + Math.floor(t.y) + ")  " + biomeName(b);
    }
    const zTxt = st.z >= 1 ? st.z.toFixed(1) : st.z.toFixed(3);
    ui.info.textContent =
      "Centro: (" + Math.round(st.cx) + ", " + Math.round(st.cy) + ")  |  Zoom: " + zTxt + " px/tile  |  1 amostra = " + (1 << k) + " tile" + (k ? "s" : "") +
      (pending ? "  |  ⏳ calculando " + pending + " bloco" + (pending > 1 ? "s" : "") + "..." : "  |  ✔ pronto") + hover;
  }
  function resize() {
    if (!ui) return;
    st.dpr = Math.min(window.devicePixelRatio || 1, 2);
    st.w = ui.root.clientWidth || window.innerWidth;
    st.h = ui.root.clientHeight || window.innerHeight;
    ui.cv.width = Math.floor(st.w * st.dpr);
    ui.cv.height = Math.floor(st.h * st.dpr);
    ui.cv.style.width = st.w + "px";
    ui.cv.style.height = st.h + "px";
  }
  function mkBtn(label, title, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.title = title;
    b.style.cssText =
      "padding:4px 9px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(15,23,42,.92);color:#e2e8f0;font:600 12px sans-serif;cursor:pointer;white-space:nowrap";
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    b.addEventListener("pointerdown", (e) => e.stopPropagation());
    return b;
  }
  function buildLegend() {
    const pal = buildPalette();
    ui.legendList.innerHTML = "";
    pal.list.forEach((b, i) => {
      const row = document.createElement("div");
      row.dataset.idx = String(i);
      row.style.cssText = "display:flex;align-items:center;gap:6px;padding:3px 5px;border-radius:6px;cursor:pointer;font:11px sans-serif;color:#e2e8f0";
      const sw = document.createElement("span");
      sw.style.cssText = "flex:none;width:14px;height:14px;border-radius:3px;border:1px solid rgba(255,255,255,.35);background:" + (b.groundColor || "#64748b");
      const tx = document.createElement("span");
      tx.textContent = biomeName(b);
      row.appendChild(sw);
      row.appendChild(tx);
      row.addEventListener("click", () => {
        if (st.hl.has(i)) st.hl.delete(i);
        else st.hl.add(i);
        refreshLegend();
        repaintAll();
      });
      ui.legendList.appendChild(row);
    });
  }
  function refreshLegend() {
    Array.from(ui.legendList.children).forEach((row) => {
      const on = st.hl.has(Number(row.dataset.idx));
      row.style.background = on ? "rgba(250,204,21,.22)" : "transparent";
      row.style.outline = on ? "1px solid rgba(250,204,21,.7)" : "none";
    });
    ui.legendHint.textContent = st.hl.size ? st.hl.size + " bioma(s) destacado(s)" : "Clique num bioma para destacá-lo";
  }
  function buildUI() {
    if (ui) return;
    const root = document.createElement("div");
    root.id = "mapa-global-root";
    root.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:#020617;touch-action:none;user-select:none;-webkit-user-select:none;display:none";
    const cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;left:0;top:0;cursor:grab;touch-action:none";
    root.appendChild(cv);

    const bar = document.createElement("div");
    bar.style.cssText = "position:absolute;left:8px;right:8px;top:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;pointer-events:none";
    const title = document.createElement("div");
    title.textContent = "🗺️ Mapa Global — superfície (Modo Desenvolvedor)";
    title.style.cssText = "padding:4px 10px;border-radius:8px;background:rgba(15,23,42,.92);border:1px solid rgba(255,255,255,.18);color:#fde68a;font:700 12px sans-serif;pointer-events:auto";
    bar.appendChild(title);
    const btns = [
      mkBtn("➖", "Afastar (tecla -)", () => zoomAt(st.z / 1.6, st.w / 2, st.h / 2)),
      mkBtn("➕", "Aproximar (tecla +)", () => zoomAt(st.z * 1.6, st.w / 2, st.h / 2)),
      mkBtn("🎯 Jogador", "Centralizar no jogador (tecla C)", centerOnPlayer),
      mkBtn("📍 Origem", "Ir para (0, 0) (tecla O)", () => {
        st.cx = 0;
        st.cy = 0;
      }),
      mkBtn("🌍 Visão ampla", "Afastar bastante para ver o mundo em grande escala", () => {
        zoomAt(0.03, st.w / 2, st.h / 2);
      }),
      mkBtn("▦ Grade", "Mostrar/ocultar grade e coordenadas (tecla G)", () => {
        st.grid = !st.grid;
      }),
      mkBtn("📖 Legenda", "Mostrar/ocultar legenda (tecla L)", () => {
        st.legend = !st.legend;
        ui.legendBox.style.display = st.legend ? "flex" : "none";
      }),
      mkBtn("✖ Fechar", "Fechar o mapa (Esc)", closeMapa),
    ];
    btns.forEach((b) => {
      b.style.pointerEvents = "auto";
      bar.appendChild(b);
    });
    root.appendChild(bar);

    const info = document.createElement("div");
    info.style.cssText =
      "position:absolute;left:8px;bottom:8px;max-width:calc(100% - 180px);padding:4px 10px;border-radius:8px;background:rgba(2,6,23,.82);border:1px solid rgba(255,255,255,.15);color:#e2e8f0;font:11px monospace;pointer-events:none";
    root.appendChild(info);

    const legendBox = document.createElement("div");
    legendBox.style.cssText =
      "position:absolute;right:8px;top:48px;bottom:48px;width:210px;display:flex;flex-direction:column;border-radius:10px;background:rgba(2,6,23,.88);border:1px solid rgba(255,255,255,.18);padding:6px;gap:4px";
    const legendHint = document.createElement("div");
    legendHint.style.cssText = "font:600 11px sans-serif;color:#fde68a;display:flex;justify-content:space-between;gap:6px;align-items:center";
    const clr = mkBtn("Limpar", "Remover o destaque", () => {
      st.hl.clear();
      refreshLegend();
      repaintAll();
    });
    clr.style.padding = "2px 6px";
    const hintTxt = document.createElement("span");
    legendHint.appendChild(hintTxt);
    legendHint.appendChild(clr);
    const legendList = document.createElement("div");
    legendList.style.cssText = "overflow:auto;flex:1;min-height:0";
    legendBox.appendChild(legendHint);
    legendBox.appendChild(legendList);
    legendBox.addEventListener("pointerdown", (e) => e.stopPropagation());
    legendBox.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
    root.appendChild(legendBox);

    document.body.appendChild(root);
    ui = { root, cv, ctx: cv.getContext("2d"), info, legendBox, legendList, legendHint: hintTxt };
    buildLegend();
    refreshLegend();
    bindInput(cv);
  }

  // ------------------------------------------------------------------ entrada
  function bindInput(cv) {
    cv.addEventListener("pointerdown", (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (err) {}
      cv.style.cursor = "grabbing";
      if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1 };
      }
    });
    cv.addEventListener("pointermove", (e) => {
      st.mouse = { x: e.clientX, y: e.clientY };
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      if (pointers.size === 1) {
        st.cx -= (e.clientX - prev.x) / st.z;
        st.cy -= (e.clientY - prev.y) / st.z;
      }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinch) {
        const [a, b] = Array.from(pointers.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        zoomAt(st.z * (d / pinch.d), (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch.d = d;
      }
    });
    const up = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) cv.style.cursor = "grab";
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => {
      st.mouse = null;
    });
    cv.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        zoomAt(st.z * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016)), e.clientX, e.clientY);
      },
      { passive: false },
    );
    cv.addEventListener("dblclick", (e) => zoomAt(st.z * 2, e.clientX, e.clientY));
  }
  // Enquanto aberto, o teclado NAO chega ao jogo (o jogador nao anda sem querer).
  function onKey(e) {
    if (!st.open) return;
    if (e.type === "keydown") {
      const step = (e.shiftKey ? 240 : 80) / st.z;
      switch (e.key) {
        case "Escape":
          closeMapa();
          break;
        case "+":
        case "=":
          zoomAt(st.z * 1.4, st.w / 2, st.h / 2);
          break;
        case "-":
        case "_":
          zoomAt(st.z / 1.4, st.w / 2, st.h / 2);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          st.cx -= step;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          st.cx += step;
          break;
        case "ArrowUp":
        case "w":
        case "W":
          st.cy -= step;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          st.cy += step;
          break;
        case "c":
        case "C":
          centerOnPlayer();
          break;
        case "o":
        case "O":
          st.cx = 0;
          st.cy = 0;
          break;
        case "g":
        case "G":
          st.grid = !st.grid;
          break;
        case "l":
        case "L":
          st.legend = !st.legend;
          ui.legendBox.style.display = st.legend ? "flex" : "none";
          break;
        default:
          if (e.ctrlKey || e.metaKey || e.altKey || /^F\d+$/.test(e.key)) return; // atalhos do navegador seguem normais
      }
    } else if (e.ctrlKey || e.metaKey || /^F\d+$/.test(e.key)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // ------------------------------------------------------------------ abrir / fechar
  function openMapa() {
    if (!window.__devMode) return false; // so no Modo Desenvolvedor
    if (!getWorld()) return false;
    buildUI();
    if (!st.open) {
      st.open = true;
      ui.root.style.display = "block";
      resize();
      const p = playerTile();
      if (p) {
        st.cx = p.x;
        st.cy = p.y;
      }
      pointers.clear();
      pinch = null;
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("keyup", onKey, true);
      window.addEventListener("resize", resize);
      if (!raf) raf = requestAnimationFrame(loop);
    }
    return true;
  }
  function closeMapa() {
    if (!st.open) return false;
    st.open = false;
    if (ui) ui.root.style.display = "none";
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("keyup", onKey, true);
    window.removeEventListener("resize", resize);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    return true;
  }

  window.openMapaGlobal = openMapa;
  window.closeMapaGlobal = closeMapa;
  window.toggleMapaGlobal = function () {
    return st.open ? (closeMapa(), false) : openMapa();
  };
  // Usado por testes/depuracao
  window.__mapaGlobalState = st;
  window.__mapaGlobalCache = cache;
})();
