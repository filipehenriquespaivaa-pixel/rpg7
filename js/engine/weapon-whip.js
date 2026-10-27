/* js/engine/weapon-whip.js
 * Chicote de Gosma: icone, golpe, estalo, pose na mao (isWhipItemX, drawWhip*).
 * Trecho de legacy/app.original.js (linhas 26093-26359); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  // ===== 🪢 CHICOTE (Chicote de Gosma): detecção, ícone e animação de golpe =====
  function isWhipItemX(e) {
    if (!e) return !1;
    const n = (e.name || "").toLowerCase(),
      i = (e.id || "").toLowerCase();
    return n.includes("chicote") || i.includes("chicote") || i.includes("whip");
  }
  // Quanto o ângulo da tira está "atrás" do alvo (1.45 rad no preparo -> 0 no estalo -> leve recuo)
  function whipSweepMagX(k) {
    const q = (z) => 1 - Math.pow(1 - Math.max(0, Math.min(1, z)), 2);
    return k < 0.45 ? 1.45 * (1 - q(k / 0.45)) : -0.2 * Math.sin(Math.min(1, (k - 0.45) / 0.55) * Math.PI);
  }
  // Pontos da tira durante o golpe. Cada ponto usa o tempo "atrasado", a ponta chega por último (arco de chicoteada)
  function whipLashX(ox, oy, ang, g, reach, n) {
    const q = (z) => 1 - Math.pow(1 - Math.max(0, Math.min(1, z)), 2),
      ext = g < 0.55 ? 0.3 + 0.7 * q(g / 0.55) : g < 0.82 ? 1 : 1 - 0.7 * q((g - 0.82) / 0.18),
      sgn = Math.cos(ang) < -0.15 ? -1 : 1,
      seg = (reach * ext) / n,
      pts = [{ x: ox, y: oy }];
    let px = ox,
      py = oy;
    for (let i = 1; i <= n; i++) {
      const s = i / n,
        gi = Math.max(0, Math.min(1, g - s * 0.2)),
        wave = Math.sin(s * Math.PI * 2.2 - g * 14) * (1 - ext * 0.8) * 0.45 * s,
        th = ang - sgn * whipSweepMagX(gi) + wave;
      px += Math.cos(th) * seg;
      py += Math.sin(th) * seg;
      pts.push({ x: px, y: py });
    }
    return { pts, ext };
  }
  // Desenha a tira afilada (contorno escuro + miolo na cor do item + brilho)
  function drawWhipLashX(c, pts, col, wScale, alpha) {
    const n = pts.length - 1;
    c.save();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.globalAlpha = alpha === void 0 ? 1 : alpha;
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i <= n; i++) {
        const k = i / n,
          w = (2.9 - 1.9 * k) * wScale;
        c.strokeStyle = pass === 0 ? "#1a2e05" : pass === 1 ? col : "#d9f99d";
        c.lineWidth = pass === 0 ? w + 1.3 : pass === 1 ? w : Math.max(0.4, w * 0.3);
        if (pass === 2 && i % 2 === 0) continue;
        c.beginPath();
        c.moveTo(pts[i - 1].x, pts[i - 1].y);
        c.lineTo(pts[i].x, pts[i].y);
        c.stroke();
      }
    }
    // pontinha desfiada
    const a = pts[n - 1],
      b = pts[n],
      ta = Math.atan2(b.y - a.y, b.x - a.x);
    c.strokeStyle = "#1a2e05";
    c.lineWidth = 0.9;
    for (const d of [-0.5, 0.45]) {
      c.beginPath();
      c.moveTo(b.x, b.y);
      c.lineTo(b.x + Math.cos(ta + d) * 3.4, b.y + Math.sin(ta + d) * 3.4);
      c.stroke();
    }
    c.restore();
  }
  // Faísca do "estalo" na ponta
  function drawWhipCrackX(c, tx, ty, k) {
    if (k <= 0) return;
    c.save();
    c.globalAlpha = Math.min(1, k);
    c.strokeStyle = "#ffffff";
    c.lineWidth = 1.4;
    c.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const a = i * (Math.PI / 3) + 0.3;
      c.beginPath();
      c.moveTo(tx + Math.cos(a) * 2.5, ty + Math.sin(a) * 2.5);
      c.lineTo(tx + Math.cos(a) * (5 + 5 * k), ty + Math.sin(a) * (5 + 5 * k));
      c.stroke();
    }
    c.fillStyle = "rgba(255,255,255,0.85)";
    c.beginPath();
    c.arc(tx, ty, 1 + 2 * k, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = k * 0.5;
    c.lineWidth = 1;
    c.beginPath();
    c.arc(tx, ty, 4 + (1 - k) * 9, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }
  // Ícone de inventário (grade de ~22 unidades, centro em (c, f), escala g)
  function drawWhipIcon(e, c, f, g, u, S) {
    e.save();
    e.translate(c, f);
    e.scale(g, g);
    e.lineCap = "round";
    e.lineJoin = "round";
    const sw = Math.sin(u * 2.4) * 0.8,
      col = S || "#65a30d",
      lash = (w, st) => {
        e.strokeStyle = st;
        e.lineWidth = w;
        e.beginPath();
        e.moveTo(-3.6, 3.6);
        e.bezierCurveTo(3, 2, 5.5, -2, 1, -5);
        e.bezierCurveTo(-4, -8, -2.5, -12.5, 3.5, -11.5 + sw);
        e.bezierCurveTo(8.5, -10.7, 10.5, -6.5, 8.2, -3.6);
        e.bezierCurveTo(6.8, -1.9, 5, -3.2, 6.1, -4.7);
        e.stroke();
      };
    lash(3.9, "#1a2e05");
    lash(2.6, col);
    lash(0.9, "#d9f99d");
    // cabo de couro
    e.strokeStyle = "#451a03";
    e.lineWidth = 4.4;
    e.beginPath();
    e.moveTo(-9.4, 9.4);
    e.lineTo(-3.2, 3.2);
    e.stroke();
    e.strokeStyle = "#a16207";
    e.lineWidth = 2.8;
    e.beginPath();
    e.moveTo(-9.4, 9.4);
    e.lineTo(-3.2, 3.2);
    e.stroke();
    e.strokeStyle = "#451a03";
    e.lineWidth = 0.9;
    for (const t of [0.22, 0.46, 0.7]) {
      const px = -9.4 + 6.2 * t,
        py = 9.4 - 6.2 * t;
      e.beginPath();
      e.moveTo(px - 1.5, py - 1.5);
      e.lineTo(px + 1.5, py + 1.5);
      e.stroke();
    }
    // argola de metal + pomo
    e.strokeStyle = "#94a3b8";
    e.lineWidth = 4.8;
    e.beginPath();
    e.moveTo(-3.6, 3.6);
    e.lineTo(-2.9, 2.9);
    e.stroke();
    e.fillStyle = "#d97706";
    e.beginPath();
    e.arc(-9.9, 9.9, 2.1, 0, Math.PI * 2);
    e.fill();
    e.restore();
  }
  // Braço + cabo + tira durante o golpe (coordenadas locais do personagem; mesmas do braço da lança)
  function drawWhipSwingX(M, dir, x, g, o, l, u, item, P, A, offHand) {
    const base = dir === "right" ? 0 : dir === "left" ? Math.PI : dir === "up" ? -Math.PI / 2 : Math.PI / 2,
      ang = x !== void 0 ? x : base,
      cs = Math.cos(ang),
      sn = Math.sin(ang),
      left = cs < -0.15 || (Math.abs(cs) <= 0.15 && dir === "left"),
      sx = (left ? -4 : 4) + o,
      sy = -11 - l + u + (sn < -0.3 ? -1 : 0),
      arm = 3 + 5 * Math.sin((Math.min(1, g / 0.6) * Math.PI) / 2) - (g > 0.82 ? ((g - 0.82) / 0.18) * 3 : 0),
      hx = sx + cs * arm,
      hy = sy + sn * arm,
      sgn = cs < -0.15 ? -1 : 1,
      thH = ang - sgn * whipSweepMagX(g),
      lx = hx + Math.cos(thH) * 6,
      ly = hy + Math.sin(thH) * 6,
      col = (item && item.color) || "#65a30d",
      skin = (typeof window !== "undefined" && window.__currentPlayerSkinColor) || "#e6b89c";
    // braço
    M.strokeStyle = skin;
    M.lineWidth = 3.4;
    M.lineCap = "round";
    M.beginPath();
    M.moveTo(sx, sy);
    M.lineTo(hx, hy);
    M.stroke();
    const br = left ? P || A : A || P;
    if (br) {
      M.strokeStyle = br.color || "#d97706";
      M.lineWidth = 4.2;
      M.beginPath();
      M.moveTo((sx + hx) / 2 - 0.5, (sy + hy) / 2 - 0.5);
      M.lineTo((sx + hx) / 2 + 0.5, (sy + hy) / 2 + 0.5);
      M.stroke();
    }
    // rastro da chicoteada
    if (g > 0.1 && g < 0.85) {
      const tr = whipLashX(hx + Math.cos(whipSweepAng(ang, g - 0.08)) * 6, hy + Math.sin(whipSweepAng(ang, g - 0.08)) * 6, ang, Math.max(0, g - 0.08), 68, 14);
      drawWhipLashX(M, tr.pts, "#ecfccb", 0.55, 0.22);
    }
    // cabo de couro
    M.strokeStyle = "#451a03";
    M.lineWidth = 3.6;
    M.beginPath();
    M.moveTo(hx, hy);
    M.lineTo(lx, ly);
    M.stroke();
    M.strokeStyle = "#a16207";
    M.lineWidth = 2.2;
    M.beginPath();
    M.moveTo(hx, hy);
    M.lineTo(lx, ly);
    M.stroke();
    // tira
    const lash = whipLashX(lx, ly, ang, g, 68, 14);
    drawWhipLashX(M, lash.pts, col, 1, 1);
    const tip = lash.pts[lash.pts.length - 1];
    drawWhipCrackX(M, tip.x, tip.y, Math.max(0, 1 - Math.abs(g - 0.68) / 0.14));
    // punho
    M.fillStyle = skin;
    M.beginPath();
    M.arc(hx, hy, 2.8, 0, Math.PI * 2);
    M.fill();
    if (offHand) {
      M.beginPath();
      M.arc((left ? 2 : -2) + o + cs * arm * 0.35, -9 - l + u + sn * arm * 0.35, 2.4, 0, Math.PI * 2);
      M.fill();
    }
  }
  function whipSweepAng(ang, g) {
    return ang - (Math.cos(ang) < -0.15 ? -1 : 1) * whipSweepMagX(Math.max(0, g));
  }
  // Chicote na mão (parado / andando): cabo + tira enrolada balançando. Origem = mão, arma aponta para -y
  function drawWhipHeldX(l, item, t) {
    const col = (item && item.color) || "#65a30d",
      sw = Math.sin((t || 0) * 2.4) * 1.2,
      loop = (w, st) => {
        l.strokeStyle = st;
        l.lineWidth = w;
        l.beginPath();
        l.moveTo(0, -6);
        l.bezierCurveTo(0, -14, 8 + sw, -14, 8 + sw, -6.5);
        l.bezierCurveTo(8 + sw, -1, 3.5, 0, 5 + sw * 0.5, 6.5);
        l.stroke();
      };
    l.save();
    l.lineCap = "round";
    l.lineJoin = "round";
    loop(3.1, "#1a2e05");
    loop(1.9, col);
    l.strokeStyle = "#451a03";
    l.lineWidth = 3.4;
    l.beginPath();
    l.moveTo(0, 3.5);
    l.lineTo(0, -6);
    l.stroke();
    l.strokeStyle = "#a16207";
    l.lineWidth = 2;
    l.beginPath();
    l.moveTo(0, 3.5);
    l.lineTo(0, -6);
    l.stroke();
    l.strokeStyle = "#451a03";
    l.lineWidth = 0.8;
    for (const y of [1.5, -1, -3.5]) {
      l.beginPath();
      l.moveTo(-1.7, y);
      l.lineTo(1.7, y + 0.9);
      l.stroke();
    }
    l.strokeStyle = "#94a3b8";
    l.lineWidth = 3.8;
    l.beginPath();
    l.moveTo(0, -6.3);
    l.lineTo(0, -6.9);
    l.stroke();
    l.restore();
  }
