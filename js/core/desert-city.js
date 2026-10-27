/* js/core/desert-city.js
 * Aldeia das Areias Douradas — Cidade / Povoado no Bioma de Deserto.
 *
 * Características arquitetônicas:
 * - Localizada no bioma de Deserto (BiomeId.DESERT).
 * - Sem ruas pavimentadas (as casas ficam diretamente sobre o solo e dunas do deserto).
 * - Casas de cômodo único e pequeno (feitas de adobe, barro cozido e madeira de deserto).
 * - Casas espalhadas pelo mapa a uma distância mínima de 4 a 8 quadrados umas das outras.
 * - 17 casas no total, numeradas de #1 a #17.
 * - Interior de cada casa contém esteira de palha para dormir e potes de cerâmica com mantimentos.
 * - Telhados de adobe 2.5D com fade ao entrar/sair.
 *
 * População da Aldeia (Moradores do Deserto):
 * - Moradores esguios / magros, de silhueta esbelta típica de nômades das areias.
 * - Cores variadas (tons de pele variados: âmbar dourada, pêssego suave, canela quente,
 *   bronzeada, trigueira, morena profunda, café e negra retinta luminosa).
 * - Roupas temáticas de deserto autênticas:
 *   * Túnicas fluidas e ajustadas (dishdasha / jalabiya / caftã) em linho branco do Saara, azul tuaregue,
 *     areia dourada/ocre, verde oásis, carmesim de caravana, terracota e açafrão solar.
 *   * Coberturas de cabeça temáticas: Turbantes bem moldados, Shemagh/Keffiyeh com agal preto,
 *     turbantes de caravaneiro, diademas solares, capuzes abertos e tiaras de couro com turquesa (rosto 100% livre e visível, sem nenhum véu tampando o rosto).
 *   * Acessórios: odres de água a tiracolo, ânforas de cerâmica, cestos de tâmaras, cajados de pastor e leques de palha.
 * - Linguagem Rúnica Ancestral (Referência ao Pergaminho Rúnico):
 *   * Os moradores NÃO conversam em português; comunicam-se exclusivamente em RUNAS SAGRADAS do Futhark Antigo,
 *     com glifos de poder (᚛ ᛋ ᛟ ᛚ ᛫ ᚨ ᚱ ᛖ ᚾ ᚨ ᛫ ᛏ ᛖ ᛏ ᚱ ᚨ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ ᚜)!
 *   * Balões de diálogo sobre a cabeça e mensagens de interação exibem escrituras rúnicas arcanas.
 * - Rotina viva de RPG:
 *   * De dia passeiam pelas dunas e espaços entre as casas, conversam entre si em runas e abrem portas ao passar.
 *   * À noite retornam para suas respectivas casas para descansar sobre as esteiras de junco com efeito zZz!
 *   * Interação com o jogador através da tecla [F].
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  // Centro e raio territorial do Povoado do Deserto.
  // O centro NAO e mais fixo: setSeed(seed, world) procura um deserto natural no mundo e coloca a aldeia DENTRO dele
  // (ver "Localizacao do deserto" abaixo). Se nao achar (ou window.__legacyDesertCity = true), usa o ponto antigo (520, 360)
  // com o disco de bioma forcado, como antes.
  const LEGACY_CX = 520;
  const LEGACY_CY = 360;
  let CITY_CX = LEGACY_CX;
  let CITY_CY = LEGACY_CY;
  const CITY_RADIUS = 90;
  const CITY_BIOME_RADIUS = 180;
  let _siteSearchActive = false; // true enquanto procura o local: desliga o disco forcado para ler o bioma NATURAL
  let _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: 0 };

  // =========================================================================
  // SISTEMA DE RUNAS ANCESTRAIS (REFERÊNCIA AO PERGAMINHO DE RUNAS)
  // - Transliteração direta e frases arcanas de Futhark Antigo
  // =========================================================================
  const RUNE_MAP = {
    a: "ᚨ", b: "ᛒ", c: "ᚲ", d: "ᛞ", e: "ᛖ", f: "ᚠ", g: "ᚷ", h: "ᚺ",
    i: "ᛁ", j: "ᛃ", k: "ᚲ", l: "ᛚ", m: "ᛗ", n: "ᚾ", o: "ᛟ", p: "ᛈ",
    q: "ᚲ", r: "ᚱ", s: "ᛋ", t: "ᛏ", u: "ᚢ", v: "ᚹ", w: "ᚹ", x: "ᛉ",
    y: "ᛇ", z: "ᛉ"
  };

  function toRunes(str) {
    if (!str) return "";
    const clean = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const words = clean.split(/\s+/).filter(Boolean);
    const runicWords = words.map(w => {
      let rw = "";
      for (const char of w) {
        if (RUNE_MAP[char]) {
          rw += (rw ? " " : "") + RUNE_MAP[char];
        }
      }
      return rw;
    }).filter(Boolean);
    return "᚛ " + runicWords.join(" ᛫ ") + " ᚜";
  }

  // Falas e saudações rúnicas místicas para interação com o jogador [F]
  const RUNIC_GREETINGS = [
    "᚛ ᛋ ᛟ ᛚ ᛫ ᚨ ᚱ ᛖ ᚾ ᚨ ᛫ ᛏ ᛖ ᛏ ᚱ ᚨ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ ᚜",
    "᚛ ᚨ ᚲ ᚢ ᚨ ᛫ ᛈ ᚢ ᚱ ᚨ ᛫ ᛟ ᚨ ᛋ ᛁ ᛋ ᛫ ᚹ ᛁ ᛏ ᚨ ᚜",
    "᚛ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᛫ ᚨ ᚱ ᚲ ᚨ ᚾ ᚢ ᛗ ᛫ ᛋ ᚨ ᚲ ᚱ ᚢ ᛗ ᚜",
    "᚛ ᛟ ᛫ ᛏ ᚱ ᛁ ᚨ ᚾ ᚷ ᚢ ᛚ ᛟ ᛫ ᛞ ᛟ ᛫ ᚠ ᛟ ᚷ ᛟ ᛫ ᛖ ᛫ ᛞ ᚨ ᛫ ᚨ ᚷ ᚢ ᚨ ᚜",
    "᚛ ᛚ ᚢ ᚾ ᚨ ᛫ ᚨ ᛋ ᛏ ᚱ ᚢ ᛗ ᛫ ᛈ ᚢ ᛚ ᛋ ᚨ ᛫ ᚾ ᚨ ᛫ ᛖ ᛋ ᚲ ᚢ ᚱ ᛁ ᛞ ᚨ ᛟ ᚜",
    "᚛ ᛈ ᛖ ᚱ ᚷ ᚨ ᛗ ᛁ ᚾ ᚺ ᛟ ᛫ ᚨ ᚱ ᚲ ᚨ ᚾ ᛟ ᛫ ᛞ ᛟ ᛫ ᛞ ᛖ ᛋ ᛏ ᛁ ᚾ ᛟ ᚜",
    "᚛ 🜂 ᚠ ᛟ ᚷ ᛟ ᛫ 🜄 ᚨ ᚷ ᚢ ᚨ ᛫ 🜁 ᚨ ᛖ ᚱ ᛫ 🜃 ᛏ ᛖ ᚱ ᚱ ᚨ ᚜",
    "᚛ ᚲ ᚢ ᚨ ᛏ ᚱ ᛟ ᛫ ᛈ ᛟ ᛞ ᛖ ᚱ ᛖ ᛋ ᛫ ᚢ ᛗ ᛫ ᛋ ᛟ ᛫ ᛞ ᛖ ᛋ ᛏ ᛁ ᚾ ᛟ ᚜",
    "᚛ ᛏ ᚱ ᛖ ᛋ ᛫ ᚲ ᚺ ᚨ ᚹ ᛖ ᛋ ᛫ ᛋ ᛟ ᛒ ᛫ ᚨ ᛋ ᛫ ᚱ ᚢ ᛁ ᚾ ᚨ ᛋ ᚜",
    "᚛ ᚹ ᛁ ᛏ ᚨ ᛫ ᛖ ᛏ ᛖ ᚱ ᚾ ᚨ ᛫ ᛈ ᛟ ᛞ ᛖ ᚱ ᛫ ᛟ ᚲ ᚢ ᛚ ᛏ ᛟ ᚜",
    "᚛ ᛟ ᛫ ᛟ ᛚ ᚺ ᛟ ᛫ ᛞ ᛟ ᛫ ᛖ ᛏ ᛖ ᚱ ᛫ ᛈ ᚢ ᛚ ᛋ ᚨ ᚜",
    "᚛ ᚱ ᚢ ᚾ ᚨ ᛋ ᛫ ᛁ ᚾ ᛞ ᛖ ᚲ ᛁ ᚠ ᚱ ᚨ ᚹ ᛖ ᛁ ᛋ ᛫ ᚨ ᛟ ᛫ ᛟ ᛚ ᚺ ᚨ ᚱ ᛫ ᛗ ᛟ ᚱ ᛏ ᚨ ᛚ ᚜"
  ];

  // Conversas cotidianas em runas entre os moradores ao se cruzarem
  const RUNIC_CHATTER = [
    "᚛ ᛋ ᚨ ᛚ ᚨ ᛗ ᛫ ᛋ ᛟ ᛚ ᛫ ᚨ ᚱ ᛖ ᚾ ᚨ ᚜",
    "᚛ ᚨ ᚲ ᚢ ᚨ ᛫ ᛟ ᚨ ᛋ ᛁ ᛋ ᛫ ᛈ ᚢ ᚱ ᚨ ᚜",
    "᚛ ᛚ ᚢ ᚾ ᚨ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ ᛫ ᚨ ᛋ ᛏ ᚱ ᚢ ᛗ ᚜",
    "᚛ ᚹ ᛁ ᛏ ᚨ ᛫ ᛖ ᛏ ᛖ ᚱ ᚾ ᚨ ᛫ ᛋ ᚨ ᚲ ᚱ ᚨ ᚜",
    "᚛ ᛏ ᛖ ᛏ ᚱ ᚨ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ ᛫ ᛟ ᛚ ᚺ ᛟ ᚜",
    "᚛ ᚱ ᚢ ᚾ ᚨ ᛫ ᚨ ᚾ ᚲ ᛖ ᛋ ᛏ ᚱ ᚨ ᛚ ᛁ ᛋ ᚜",
    "᚛ ᛞ ᛖ ᛋ ᛖ ᚱ ᛏ ᚢ ᛗ ᛫ ᛋ ᚨ ᚲ ᚱ ᚢ ᛗ ᚜",
    "᚛ ✦ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᛫ ᚨ ᚱ ᚲ ᚨ ᚾ ᚢ ᛗ ✦ ᚜"
  ];

  // =========================================================================
  // DISPOSIÇÃO ORGÂNICA DAS 17 CASAS DE CÔMODO ÚNICO DO DESERTO:
  // =========================================================================
  const HOUSE_SPECS = [
    // Fileira Norte / Noroeste
    { relX: -26, relY: -22, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #1
    { relX: -16, relY: -28, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #2
    { relX:  -7, relY: -20, halfW: 3, halfH: 2, doorSide: "south" }, // Casa #3
    { relX:   4, relY: -27, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #4
    { relX:  15, relY: -20, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #5
    { relX:  26, relY: -26, halfW: 3, halfH: 2, doorSide: "south" }, // Casa #6

    // Meio Oeste e Leste
    { relX: -34, relY:  -9, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #7
    { relX: -21, relY:  -8, halfW: 3, halfH: 2, doorSide: "south" }, // Casa #8
    { relX:  20, relY:  -7, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #9
    { relX:  32, relY:  -9, halfW: 2, halfH: 2, doorSide: "south" }, // Casa #10

    // Meio-Sul Oeste e Leste
    { relX: -27, relY:   6, halfW: 2, halfH: 2, doorSide: "north" }, // Casa #11
    { relX: -14, relY:   7, halfW: 3, halfH: 2, doorSide: "north" }, // Casa #12
    { relX:  12, relY:   7, halfW: 2, halfH: 2, doorSide: "north" }, // Casa #13
    { relX:  24, relY:   8, halfW: 3, halfH: 2, doorSide: "north" }, // Casa #14

    // Extremo Sul
    { relX: -20, relY:  21, halfW: 2, halfH: 2, doorSide: "north" }, // Casa #15
    { relX:  -6, relY:  22, halfW: 2, halfH: 2, doorSide: "north" }, // Casa #16
    { relX:   8, relY:  20, halfW: 3, halfH: 2, doorSide: "north" }  // Casa #17
  ];

  const HOUSES = HOUSE_SPECS.map((spec, idx) => {
    const id = idx + 1;
    return {
      id,
      name: `Casa de Adobe #${id} (Cômodo Único)`,
      cx: CITY_CX + spec.relX,
      cy: CITY_CY + spec.relY,
      relX: spec.relX,
      relY: spec.relY,
      halfW: spec.halfW,
      halfH: spec.halfH,
      doorSide: spec.doorSide || "south",
    };
  });

  // Verifica se o tile está dentro do território da aldeia do deserto
  function isCityTerritory(tx, ty) {
    if (_siteSearchActive || (typeof window !== "undefined" && window.__citySiteSearch)) return false;
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    return dx * dx + dy * dy <= CITY_RADIUS * CITY_RADIUS;
  }

  // Garante que o bioma ao redor da aldeia seja sempre DESERT (Deserto Dourado contínuo)
  function isCityBiomeArea(tx, ty) {
    if (_siteSearchActive || (typeof window !== "undefined" && window.__citySiteSearch)) return false;
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    return dx * dx + dy * dy <= CITY_BIOME_RADIUS * CITY_BIOME_RADIUS;
  }


  // =========================================================================
  // LOCALIZACAO DO DESERTO (por seed): a aldeia nasce dentro de um deserto natural
  // =========================================================================
  // Procura, a partir da origem e em aneis crescentes, o ponto mais proximo onde um disco de SITE_FIT_RADIUS blocos
  // (disco de bioma 180 + margem 40) e TODO bioma DESERT natural. Depois ajusta o centro para o ponto de maior folga
  // ao redor. Usa so World._computeSurfaceBaseBiome (pura: nao grava cache). Se nao achar, volta ao ponto antigo.
  const SITE_FIT_RADIUS = CITY_BIOME_RADIUS + 40;
  const SITE_MIN_DIST = 500; // longe da area inicial de floresta
  const SITE_MAX_DIST = 8000;
  const SITE_STEP = 64;

  function _relocate(cx, cy) {
    CITY_CX = cx;
    CITY_CY = cy;
    for (let i = 0; i < HOUSES.length; i++) {
      HOUSES[i].cx = CITY_CX + HOUSES[i].relX;
      HOUSES[i].cy = CITY_CY + HOUSES[i].relY;
    }
    CITIZENS.length = 0; // moradores renascem sob demanda (_initCitizens) nas casas novas
    _citizensInitialized = false; // sem isto os moradores nunca renasciam se ja tinham sido criados num mundo anterior
    _activeDoorwayTimers.clear();
  }

  function _findDesertSite(world) {
    let checked = 0;
    const sample = (x, y) => {
      checked++;
      const b = world._computeSurfaceBaseBiome(Math.floor(x), Math.floor(y));
      return b ? b.id : null;
    };
    // true se todos os pontos de aneis de raio r (em 16 direcoes) forem DESERT
    const ringOk = (cx, cy, r) => {
      for (let i = 0; i < 16; i++) {
        const a = ((i + 0.5) / 16) * Math.PI * 2;
        if (sample(cx + Math.cos(a) * r, cy + Math.sin(a) * r) !== "DESERT") return false;
      }
      return true;
    };
    const fits = (cx, cy) => {
      if (sample(cx, cy) !== "DESERT") return false;
      if (!ringOk(cx, cy, SITE_FIT_RADIUS)) return false;
      return ringOk(cx, cy, SITE_FIT_RADIUS * 0.66) && ringOk(cx, cy, SITE_FIT_RADIUS * 0.33);
    };
    // maior raio (passos de 40) com aneis completamente em deserto, ate 520
    const margin = (cx, cy) => {
      if (sample(cx, cy) !== "DESERT") return 0;
      let m = 0;
      for (let r = 40; r <= 520; r += 40) {
        if (!ringOk(cx, cy, r)) break;
        m = r;
      }
      return m;
    };
    let found = null;
    for (let d = SITE_MIN_DIST; d <= SITE_MAX_DIST && !found; d += SITE_STEP) {
      const n = Math.max(8, Math.ceil((Math.PI * 2 * d) / SITE_STEP));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const cx = Math.round(Math.cos(a) * d),
          cy = Math.round(Math.sin(a) * d);
        if (fits(cx, cy)) {
          found = [cx, cy];
          break;
        }
      }
    }
    if (!found) return { site: null, checked };
    // ajuste fino: ponto de maior folga num quadrado de +-144 blocos em volta
    let best = found,
      bestM = margin(found[0], found[1]);
    for (let dy = -144; dy <= 144; dy += 48) {
      for (let dx = -144; dx <= 144; dx += 48) {
        if (!dx && !dy) continue;
        const cx = found[0] + dx,
          cy = found[1] + dy;
        const m = margin(cx, cy);
        if (m > bestM) {
          bestM = m;
          best = [cx, cy];
        }
      }
    }
    return { site: best, margin: bestM, checked };
  }

  // Chamado pelo World (construtor e setSeed) DEPOIS de os ruidos da seed estarem prontos.
  let _lastSeedKey = null;
  function setSeed(seed, world) {
    const legacy = typeof window !== "undefined" && !!window.__legacyDesertCity;
    const key = String(seed) + (legacy ? ":legado" : ":natural");
    if (key === _lastSeedKey) return; // mesma seed: o local ja esta calculado (nao refaz a busca nem recria os moradores)
    if (legacy) {
      _lastSeedKey = key;
      _relocate(LEGACY_CX, LEGACY_CY);
      _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: 0 };
      return;
    }
    if (!world || typeof world._computeSurfaceBaseBiome !== "function") return; // sem mundo: mantem o ponto atual
    _lastSeedKey = key;
    let res = null;
    // Desliga SO o proprio disco. A neve e calculada ANTES (ordem em world.js) e o disco dela continua valendo aqui:
    // se a neve cair no modo fixo (disco de 1050 blocos), o deserto nao e colocado dentro dele.
    _siteSearchActive = true;
    try {
      res = _findDesertSite(world);
    } catch (e) {
      res = null;
    } finally {
      _siteSearchActive = false;
    }
    if (res && res.site) {
      _relocate(res.site[0], res.site[1]);
      _siteInfo = { mode: "natural", margin: res.margin, distance: Math.round(Math.hypot(res.site[0], res.site[1])), checked: res.checked };
    } else {
      _relocate(LEGACY_CX, LEGACY_CY);
      _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: res ? res.checked : 0 };
    }
  }
  // Para testes: executa fn com o disco forcado desligado (le o bioma natural)
  function _withoutBiomeOverride(fn) {
    const prev = typeof window !== "undefined" ? window.__citySiteSearch : false;
    if (typeof window !== "undefined") window.__citySiteSearch = true;
    try {
      return fn();
    } finally {
      if (typeof window !== "undefined") window.__citySiteSearch = prev;
    }
  }

  // Encontra a casa correspondente ao tile, se houver
  function getHouseAt(tx, ty) {
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      if (Math.abs(tx - h.cx) <= h.halfW && Math.abs(ty - h.cy) <= h.halfH) {
        return h;
      }
    }
    return null;
  }

  // Retorna o ID da casa em que o jogador está atualmente dentro (para fade do telhado)
  function getActiveHouseForPlayer(playerX, playerY, tileSize) {
    const ptx = Math.floor(playerX / tileSize);
    const pty = Math.floor(playerY / tileSize);
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      if (Math.abs(ptx - h.cx) < h.halfW && Math.abs(pty - h.cy) < h.halfH) {
        return h.id;
      }
    }
    return null;
  }

  // Retorna os dados arquitetônicos completos do bloco na aldeia do deserto
  function getCellAt(tx, ty, interactedProps) {
    if (!isCityTerritory(tx, ty)) return null;

    const house = getHouseAt(tx, ty);
    if (!house) {
      return null;
    }

    const rx = tx - house.cx;
    const ry = ty - house.cy;
    const W = house.halfW;
    const H = house.halfH;
    const isSouthDoor = house.doorSide === "south";
    const doorY = isSouthDoor ? H : -H;
    const doorX = 0;
    const houseId = house.id;

    const tileKey = `${tx},${ty}`;
    const intState =
      interactedProps && interactedProps.get
        ? interactedProps.get(tileKey) || {}
        : {};

    // 1. Porta de entrada da casa (sul ou norte)
    if (ry === doorY && rx === doorX) {
      const isDoorOpen = !!intState.opened;
      return {
        isDesertCity: true,
        houseIndex: houseId,
        role: "door",
        roomName: `Entrada da Casa de Adobe #${houseId}`,
        isDoor: true,
        isDoorOpen: isDoorOpen,
        isWall: false,
        prop: {
          kind: "desert_city_door",
          houseIndex: houseId,
          opened: isDoorOpen,
          interactive: true,
          namePt: isDoorOpen
            ? `Porta de Madeira Aberta (Casa #${houseId})`
            : `Porta Rústica de Madeira (Casa #${houseId})`,
          descriptionPt: isDoorOpen
            ? "Porta rústica de ripas de madeira aberta. Pressione [E] para fechar contra o vento do deserto."
            : "Porta simples de tábuas de madeira com batente de argila. Pressione [E] para abrir!",
        },
      };
    }

    // 2. Paredes externas da casa (feitas de adobe e tijolos de argila cozida)
    if (Math.abs(rx) === W || Math.abs(ry) === H) {
      return {
        isDesertCity: true,
        houseIndex: houseId,
        role: "wall",
        roomName: `Parede de Adobe da Casa #${houseId}`,
        isWall: true,
        prop: {
          kind: "desert_city_wall",
          subType: 0,
          houseIndex: houseId,
          namePt: `Parede de Adobe (Casa #${houseId})`,
          descriptionPt:
            "Parede espessa de tijolos de adobe e argila seca ao sol, mantendo o interior fresco durante o dia abrasador.",
        },
      };
    }

    // 3. Interior: esteira rústica de dormir no canto oposto à porta
    const matX = -W + 1;
    const matY = isSouthDoor ? -H + 1 : H - 1;
    if (rx === matX && ry === matY) {
      return {
        isDesertCity: true,
        houseIndex: houseId,
        role: "mat",
        roomName: `Esteira de Dormir da Casa #${houseId}`,
        isWall: false,
        prop: {
          kind: "desert_city_mat",
          houseIndex: houseId,
          interactive: true,
          namePt: "Esteira de Dormir de Palha Trançada",
          descriptionPt:
            "Esteira tradicional de fibras vegetais e junco com cobertor enrolado. Lugar fresco e acolhedor para repousar e recuperar as forças.",
        },
      };
    }

    // 4. Interior: potes de mantimentos no canto oposto à porta
    const potsX = W - 1;
    const potsY = isSouthDoor ? -H + 1 : H - 1;
    if (rx === potsX && ry === potsY) {
      return {
        isDesertCity: true,
        houseIndex: houseId,
        role: "pots",
        roomName: `Potes de Mantimentos da Casa #${houseId}`,
        isWall: false,
        isCollider: true,
        prop: {
          kind: "desert_city_pots",
          houseIndex: houseId,
          interactive: true,
          namePt: "Potes de Mantimentos de Cerâmica",
          descriptionPt:
            "Grandes jarros de barro cozido armazenando grãos, tâmaras secas do deserto e água fresca protegida do calor. Pressione [E] para verificar as provisões!",
        },
      };
    }

    // 5. Piso interno de barro batido da casa de adobe
    return {
      isDesertCity: true,
      houseIndex: houseId,
      role: "floor",
      roomName: `Chão da Casa de Adobe #${houseId}`,
      isWall: false,
      prop: {
        kind: "desert_city_floor",
        houseIndex: houseId,
        namePt: "Piso de Barro Compactado",
      },
    };
  }

  // =========================================================================
  // POPULAÇÃO DA ALDEIA DAS AREIAS DOURADAS (MORADORES DO DESERTO)
  // - Silhueta esguia / magra, elegante e adaptada ao calor abrasador.
  // - Tons de pele variados de povos do deserto e caravaneiros.
  // - Roupas temáticas de deserto autênticas com túnicas fluidas ajustadas.
  // =========================================================================

  
  
  
  
  // Pontos de passeio orgânicos ao ar livre na aldeia do deserto
  const STROLL_DESTINATIONS = [
    { relX:  -4, relY:  -4 },
    { relX:   4, relY:  -4 },
    { relX:  -4, relY:   3 },
    { relX:   4, relY:   3 },
    { relX:   0, relY:  -2 },
    { relX:   0, relY:   2 },
    { relX:  -8, relY:   0 },
    { relX:   8, relY:   0 },
    { relX: -26, relY: -15 },
    { relX: -30, relY:  -2 },
    { relX: -27, relY:  14 },
    { relX:  20, relY: -15 },
    { relX:  26, relY:  -2 },
    { relX:  18, relY:  14 },
    { relX: -10, relY: -26 },
    { relX:  10, relY: -26 },
    { relX: -12, relY:  15 },
    { relX:   2, relY:  15 },
    { relX: -14, relY:  21 },
    { relX:   0, relY:  24 }
  ];

  let _citizensInitialized = false;
  const CITIZENS = [];
  const _activeDoorwayTimers = new Map();

  // Inicializa os 29 moradores distribuídos nas 17 casas
  function _initCitizens(tileSize) {
    if (_citizensInitialized) return;
    // skins e perfis vivem em js/citizens/desert-citizen.js
    const { skinTones: SKIN_TONES, hairColors: HAIR_COLORS, outfitPalettes: OUTFIT_PALETTES, profiles: CITIZEN_PROFILES } = CITIZEN_KINDS["desert-citizen"];
    _citizensInitialized = true;
    const ts = tileSize || 36;
    let profileIdx = 0;

    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      const isTwoResidents = h.halfW === 3 || [2, 4, 7, 10, 13, 16].includes(h.id);
      const count = isTwoResidents ? 2 : 1;

      for (let r = 0; r < count; r++) {
        const id = CITIZENS.length + 1;
        const prof = CITIZEN_PROFILES[profileIdx % CITIZEN_PROFILES.length];
        profileIdx++;

        const isSouthDoor = h.doorSide === "south";
        const doorTx = h.cx;
        const doorTy = h.cy + (isSouthDoor ? h.halfH : -h.halfH);
        const outsideTy = doorTy + (isSouthDoor ? 1.25 : -1.25);

        // Pontos internos da casa
        const matTx = h.cx - h.halfW + 1;
        const matTy = h.cy + (isSouthDoor ? -h.halfH + 1 : h.halfH - 1);
        const potsTx = h.cx + h.halfW - 1;
        const potsTy = h.cy + (isSouthDoor ? -h.halfH + 1 : h.halfH - 1);
        const hallTx = h.cx;
        const hallTy = h.cy + (isSouthDoor ? h.halfH - 0.9 : -h.halfH + 0.9);
        const centerTx = h.cx + (r === 0 ? -0.35 : 0.35);
        const centerTy = h.cy;

        // Variação de tons de pele e cabelo
        const skinColor = SKIN_TONES[(id * 3 + r * 5 + i) % SKIN_TONES.length];
        const hairColor = HAIR_COLORS[(id * 5 + r * 2 + i) % HAIR_COLORS.length];
        const outfit = OUTFIT_PALETTES[(id * 2 + r + i) % OUTFIT_PALETTES.length];
        const headwearStyle = prof.head !== undefined ? prof.head : ((id + i) % 7);
        const propInHand = prof.prop !== undefined ? prof.prop : ((id + i) % 4 === 0 ? "amphora" : null);
        const hasWaterSkin = prof.waterSkin !== undefined ? prof.waterSkin : ((id + r) % 2 === 0);

        const startOutside = (id + r) % 3 !== 0;
        const startX = startOutside
          ? (h.cx + (r === 0 ? -1.4 : 1.4) + (Math.random() * 1.6 - 0.8) + 0.5) * ts
          : ((r === 0 ? matTx : centerTx) + 0.5) * ts;
        const startY = startOutside
          ? (outsideTy + (Math.random() * 1.2 - 0.6) + 0.5) * ts
          : ((r === 0 ? matTy : centerTy) + 0.5) * ts;

        const cit = {
          id,
          name: `${prof.name}, ${prof.title}`,
          shortName: prof.name,
          runicName: toRunes(prof.name),
          title: prof.title,
          gender: prof.gender || "m",
          houseId: h.id,
          house: h,
          residentIndex: r,
          skinColor,
          hairColor,
          outfit,
          headwearStyle,
          propInHand,
          hasWaterSkin,
          x: startX,
          y: startY,
          facing: isSouthDoor ? "down" : "up",
          isMoving: false,
          walkPhase: id * 1.6,
          speed: 0.88 + ((id * 7) % 5) * 0.04,
          doorTx,
          doorTy,
          outsideTy,
          matTx,
          matTy,
          potsTx,
          potsTy,
          hallTx,
          hallTy,
          centerTx,
          centerTy,
          isInsideHouse: !startOutside,
          state: startOutside ? "strolling" : "inside_home",
          stateTimer: startOutside ? 10 + (id % 15) : 3 + (id % 6),
          pauseTimer: 0,
          chatCooldown: 3 + (id % 5),
          chatPartnerId: null,
          chatText: "",
          waypoints: []
        };

        if (startOutside) {
          _assignDesertStrollDestination(cit, ts);
        }

        CITIZENS.push(cit);
      }
    }
  }

  // Atribui novo destino de passeio nas areias ao ar livre
  function _assignDesertStrollDestination(cit, ts) {
    const roll = Math.random();
    let targetX, targetY;

    if (roll < 0.45) {
      const pt = STROLL_DESTINATIONS[Math.floor(Math.random() * STROLL_DESTINATIONS.length)];
      targetX = (CITY_CX + pt.relX + (Math.random() * 1.4 - 0.7) + 0.5) * ts;
      targetY = (CITY_CY + pt.relY + (Math.random() * 1.4 - 0.7) + 0.5) * ts;
    } else if (roll < 0.75) {
      const targetHouse = HOUSES[Math.floor(Math.random() * HOUSES.length)];
      const isSouth = targetHouse.doorSide === "south";
      const outY = targetHouse.cy + (isSouth ? targetHouse.halfH + 1.8 : -targetHouse.halfH - 1.8);
      targetX = (targetHouse.cx + (Math.random() * 2.6 - 1.3) + 0.5) * ts;
      targetY = (outY + (Math.random() * 0.8 - 0.4) + 0.5) * ts;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const distTiles = 8 + Math.random() * 20;
      targetX = (CITY_CX + Math.cos(angle) * distTiles + 0.5) * ts;
      targetY = (CITY_CY + Math.sin(angle) * distTiles + 0.5) * ts;
    }

    cit.waypoints = [
      {
        x: (cit.x + targetX) * 0.5 + (Math.random() * 14 - 7),
        y: (cit.y + targetY) * 0.5 + (Math.random() * 14 - 7)
      },
      { x: targetX, y: targetY }
    ];
    cit.isMoving = true;
  }

  // Envia o morador de volta para sua casa de adobe
  function _sendDesertCitizenHome(cit, ts, forNight) {
    cit.state = forNight ? "returning_home_night" : "entering_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;

    if (cit.isInsideHouse) {
      const destTx = forNight ? cit.matTx : (Math.random() < 0.5 ? cit.potsTx : cit.centerTx);
      const destTy = forNight ? cit.matTy : (Math.random() < 0.5 ? cit.potsTy : cit.centerTy);
      cit.waypoints = [
        { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
        { x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts }
      ];
      cit.isMoving = true;
      return;
    }

    const isSouth = cit.house.doorSide === "south";
    const doorStepY = cit.doorTy + (isSouth ? 1.4 : -1.4);
    const destTx = forNight ? cit.matTx : (Math.random() < 0.5 ? cit.potsTx : cit.centerTx);
    const destTy = forNight ? cit.matTy : (Math.random() < 0.5 ? cit.potsTy : cit.centerTy);

    cit.waypoints = [
      { x: (cit.doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true },
      { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts, markInside: true },
      { x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts }
    ];
    cit.isMoving = true;
  }

  // Faz o morador sair de casa para passear nas areias
  function _sendDesertCitizenOutside(cit, ts) {
    cit.state = "exiting_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;
    const isSouth = cit.house.doorSide === "south";
    const doorStepY = cit.doorTy + (isSouth ? 1.4 : -1.4);
    const outsideStrollY = cit.doorTy + (isSouth ? 2.8 : -2.8);

    cit.waypoints = [
      { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true },
      { x: (cit.doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts, markOutside: true },
      { x: (cit.doorTx + 0.5) * ts, y: (outsideStrollY + 0.5) * ts, markOutside: true }
    ];
    cit.isMoving = true;
  }

  // Verifica se um morador está passando pela porta neste instante
  function isDoorwayUsedByCitizen(tx, ty) {
    const exp = _activeDoorwayTimers.get(`${tx},${ty}`);
    return exp !== undefined && exp > 0;
  }

  // Interação do jogador com tecla [F] — fala exclusivamente em runas antigas!
  function interactWithNearbyCitizen(playerX, playerY, isUnderground = false) {
    if (isUnderground) return null;
    let best = null;
    let bestDist = 56;

    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      const d = Math.hypot(playerX - c.x, playerY - c.y);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }

    if (!best) return null;

    const dx = playerX - best.x;
    const dy = playerY - best.y;
    best.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
    best.pauseTimer = 4.0;
    best.isMoving = false;

    // Fala 100% em runas antigas como no Pergaminho de Runas!
    const runicPhrase = RUNIC_GREETINGS[Math.floor(Math.random() * RUNIC_GREETINGS.length)];
    best.chatText = runicPhrase;
    best.state = best.isInsideHouse ? best.state : "interacting";
    best.stateTimer = 5.0;

    return {
      success: true,
      citizen: best,
      message: `💬 ${best.runicName}: "${runicPhrase}"`,
    };
  }

  // Atualiza rotinas dos moradores e retorna itens prontos para renderização ordenados por Y
  function updateAndGetCitizenRenderItems(ctx, tileSize, player, timeOfDay, animTimer, viewLeft, viewRight, viewTop, viewBottom, isUnderground = false) {
    const ts = tileSize || 36;
    _initCitizens(ts);

    if (player) {
      const distToCity = Math.hypot(player.x - CITY_CX * ts, player.y - CITY_CY * ts);
      if (distToCity > (CITY_RADIUS + 90) * ts) return [];
    }
    if (isUnderground) return [];

    for (const [k, v] of _activeDoorwayTimers.entries()) {
      if (v <= 1) _activeDoorwayTimers.delete(k);
      else _activeDoorwayTimers.set(k, v - 1);
    }

    const dt = 0.016;
    const isNight = timeOfDay < 0.24 || timeOfDay > 0.76;
    const activePlayerHouseId = player ? getActiveHouseForPlayer(player.x, player.y, ts) : null;

    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      if (c.chatCooldown > 0) c.chatCooldown = Math.max(0, c.chatCooldown - dt);

      // REGRA DA NOITE NO DESERTO: Todos voltam para casa descansar na esteira
      if (isNight) {
        if (c.state !== "returning_home_night" && c.state !== "night_at_home") {
          _sendDesertCitizenHome(c, ts, true);
        }
      } else {
        if (c.state === "night_at_home" || c.state === "returning_home_night") {
          c.state = c.isInsideHouse ? "inside_home" : "strolling";
          c.stateTimer = 2.0 + (c.id % 6) * 0.8;
          if (!c.isInsideHouse) _assignDesertStrollDestination(c, ts);
        }
      }

      if (c.state === "interacting") {
        c.isMoving = false;
        c.stateTimer -= dt;
        if (c.stateTimer <= 0) {
          c.state = "strolling";
          c.chatText = "";
          c.chatCooldown = 8 + Math.random() * 8;
          if (!c.waypoints || c.waypoints.length === 0) {
            _assignDesertStrollDestination(c, ts);
          }
        }
        continue;
      }

      if (c.pauseTimer > 0) {
        c.pauseTimer -= dt;
        c.isMoving = false;
        continue;
      }

      // Conversa entre moradores nas areias exclusivamente em runas!
      if (!isNight && !c.isInsideHouse && c.chatCooldown <= 0 && c.state === "strolling") {
        for (let j = i + 1; j < CITIZENS.length; j++) {
          const other = CITIZENS[j];
          if (!other.isInsideHouse && other.chatCooldown <= 0 && other.state === "strolling") {
            const d = Math.hypot(c.x - other.x, c.y - other.y);
            if (d < 44) {
              c.state = "chatting";
              other.state = "chatting";
              c.chatPartnerId = other.id;
              other.chatPartnerId = c.id;
              c.isMoving = false;
              other.isMoving = false;
              c.stateTimer = 4.5;
              other.stateTimer = 4.5;
              c.chatCooldown = 18 + Math.random() * 10;
              other.chatCooldown = 18 + Math.random() * 10;
              c.facing = c.x < other.x ? "right" : "left";
              other.facing = other.x < c.x ? "right" : "left";
              c.chatText = RUNIC_CHATTER[Math.floor(Math.random() * RUNIC_CHATTER.length)];
              break;
            }
          }
        }
      }

      if (c.state === "chatting") {
        c.isMoving = false;
        c.stateTimer -= dt;
        if (c.stateTimer <= 0) {
          c.state = "strolling";
          c.chatPartnerId = null;
          c.chatText = "";
          _assignDesertStrollDestination(c, ts);
        }
        continue;
      }

      if (c.waypoints && c.waypoints.length > 0) {
        const wp = c.waypoints[0];
        const dx = wp.x - c.x;
        const dy = wp.y - c.y;
        const dist = Math.hypot(dx, dy);

        const doorWorldX = (c.doorTx + 0.5) * ts;
        const doorWorldY = (c.doorTy + 0.5) * ts;
        if (Math.hypot(c.x - doorWorldX, c.y - doorWorldY) < ts * 1.25) {
          _activeDoorwayTimers.set(`${c.doorTx},${c.doorTy}`, 12);
        }

        if (dist <= c.speed * 1.5) {
          c.x = wp.x;
          c.y = wp.y;
          if (wp.markInside) c.isInsideHouse = true;
          if (wp.markOutside) c.isInsideHouse = false;
          c.waypoints.shift();

          if (c.waypoints.length === 0) {
            c.isMoving = false;
            if (c.state === "returning_home_night") {
              c.isInsideHouse = true;
              c.state = "night_at_home";
              c.facing = "down";
            } else if (c.state === "entering_house") {
              c.isInsideHouse = true;
              c.state = "inside_home";
              c.stateTimer = 5 + Math.random() * 8;
            } else if (c.state === "exiting_house") {
              c.isInsideHouse = false;
              c.state = "strolling";
              c.stateTimer = 12 + Math.random() * 15;
              _assignDesertStrollDestination(c, ts);
            } else if (c.state === "strolling") {
              c.pauseTimer = 1.5 + Math.random() * 3.0;
              c.stateTimer = 10 + Math.random() * 15;
            }
          }
        } else {
          c.isMoving = true;
          c.walkPhase += 0.16;
          const step = Math.min(dist, c.speed);
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
          c.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
        }
      } else {
        c.isMoving = false;
        c.stateTimer -= dt;

        if (c.stateTimer <= 0) {
          if (c.state === "inside_home") {
            if (!isNight && Math.random() < 0.65) {
              _sendDesertCitizenOutside(c, ts);
            } else {
              const destTx = Math.random() < 0.5 ? c.matTx : c.potsTx;
              const destTy = Math.random() < 0.5 ? c.matTy : c.potsTy;
              c.waypoints = [{ x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts }];
              c.isMoving = true;
              c.stateTimer = 4 + Math.random() * 6;
            }
          } else if (c.state === "strolling") {
            if (!isNight && Math.random() < 0.25) {
              _sendDesertCitizenHome(c, ts, false);
            } else {
              _assignDesertStrollDestination(c, ts);
              c.stateTimer = 12 + Math.random() * 16;
            }
          }
        }
      }
    }

    const items = [];
    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      if (
        c.x < viewLeft - 48 ||
        c.x > viewRight + 48 ||
        c.y < viewTop - 48 ||
        c.y > viewBottom + 48
      ) {
        continue;
      }

      if (c.isInsideHouse && activePlayerHouseId !== c.houseId) {
        const doorWorldY = (c.doorTy + 0.5) * ts;
        if (Math.abs(c.y - doorWorldY) > ts * 0.85) {
          continue;
        }
      }

      items.push({
        y: c.y,
        draw: () => CITIZEN_KINDS["desert-citizen"].draw(ctx, c, timeOfDay, animTimer, player)
      });
    }

    return items;
  }

  // =========================================================================
  // RENDERIZAÇÃO DO MORADOR DO DESERTO NO CANVAS
  // - Proporções humanas normais idênticas ao jogador e moradores de SnowPeakCity.
  // - Altura normal padrão, pescoço anatômico, pernas com pivô pendular no quadril.
  // - Vista anatômica nas 4 direções (down, up, left, right) com perfil estreito lateral.
  // - Cores variadas de pele e cabelo com roupas temáticas de deserto.
  // - Túnica longa, cinto com faixa, manto/xale, odre e sandálias.
  // - Turbantes e coberturas proporcionais à cabeça.
  // - Balão de diálogo exclusivamente em RUNAS!
  // =========================================================================

  
  // Exporta a definição completa do módulo
  const DesertCity = {
    // centro dinamico (getters): muda quando setSeed escolhe o deserto da seed
    get centerX() {
      return CITY_CX;
    },
    get centerY() {
      return CITY_CY;
    },
    get siteInfo() {
      return _siteInfo;
    },
    radius: CITY_RADIUS,
    biomeRadius: CITY_BIOME_RADIUS,
    houses: HOUSES,
    citizens: CITIZENS,
    setSeed,
    _withoutBiomeOverride,
    toRunes,
    isCityTerritory,
    isCityBiomeArea,
    getHouseAt,
    getActiveHouseForPlayer,
    getCellAt,
    isDoorwayUsedByCitizen,
    interactWithNearbyCitizen,
    updateAndGetCitizenRenderItems,
  };

  G.DesertCity = DesertCity;
  window.DesertCity = DesertCity;
})(window.Game);
