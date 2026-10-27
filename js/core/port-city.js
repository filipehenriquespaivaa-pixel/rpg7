/* js/core/port-city.js
 * Cidade Portuária das Palmeiras — Cidade Portuária na Praia Tropical (BiomeId.BEACH e BiomeId.COAST_WATER).
 *
 * Características arquitetônicas e procedurais:
 * - Gerada proceduralmente de acordo com a seed do mundo (setSeed(seed)).
 * - A posição das casas, calçadão do porto, píeres e embarcações na água mudam dinamicamente conforme a seed!
 * - Localizada na Praia Tropical (BEACH) fazendo fronteira direta ao sul com Águas Rasas (COAST_WATER) e Oceano Profundo (DEEP_OCEAN).
 * - Calçadão Portuário e Praça do Porto pavimentados na beira-mar com Farol/Lanterna Portuária, Âncora Monumental, caixotes e barris.
 * - Píeres de madeira (docas sobre estacas) que avançam sobre a água rasa (caminháveis sobre a água!).
 * - Embarcações variadas na água (Galeões/Caravelas Mercantes com velas latinas e quadradas, Escunas Costeiras e Barcos Pesqueiros a vela e remo)
 *   atracadas nos píeres e ancoradas na baía conforme a seed!
 *   * As embarcações possuem conveses de madeira caminháveis ligados aos píeres por pranchas de embarque,
 *     timão de comando, mastros com velas infladas ao vento, cabines, redes de pesca, canhões/barris e baús do capitão!
 * - Casas Portuárias Tropicais espalhadas de acordo com a seed ao redor do porto, com telhados 2.5D de telha colonial terracota e palha trançada
 *   que desaparecem suavemente quando o jogador entra na casa!
 * - População viva de Marinheiros, Capitães, Pescadores e Mercadores do Porto que caminham pelas docas,
 *   sobem nos barcos, conversam no cais e interagem com [F].
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  // Centro territorial da Cidade Portuária (Praia Tropical ao norte e Baía de Águas Rasas ao sul).
  // O centro NAO e mais fixo: setSeed(seed, world) procura na seed uma divisa natural entre PRAIA e MAR voltada para o sul
  // (reta, com praia atras e agua rasa a frente) e coloca o porto nela (ver "Localizacao da costa" abaixo). Nesse modo
  // NATURAL nao ha disco de bioma forcado nem costa sintetica: o bioma e a costa sao os do proprio mundo. Se a seed nao
  // tiver costa que sirva (ou window.__legacyPortCity = true), usa o ponto antigo (-680, 620) com o disco forcado de 460
  // blocos e a costa sintetica, como antes.
  const LEGACY_CX = -680;
  const LEGACY_CY = 620;
  let CITY_CX = LEGACY_CX;
  let CITY_CY = LEGACY_CY;
  const CITY_RADIUS = 105;
  const LEGACY_BIOME_RADIUS = 460;
  let _naturalMode = false; // true: porto numa costa natural (sem disco forcado nem costa sintetica)
  let _world = null; // World da seed (so no modo natural, para ler o bioma natural dentro do territorio)
  let _siteSearchActive = false; // true durante a propria busca: desliga o disco do porto
  let _inNaturalQuery = false; // trava contra recursao ao ler o bioma natural dentro do territorio
  let _siteInfo = { mode: "fixed", distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), maxDev: 0, slopeDeg: 0, checked: 0 };
  const _shoreCache = new Map();
  const _deepCache = new Map();

  let _currentSeed = 54321;

  // Hash determinístico baseado na seed do mundo
  function _seedHash(a, b, salt = 0) {
    let h =
      (Math.imul(a | 0, 374761393) ^
        Math.imul(b | 0, 668265263) ^
        Math.imul(_currentSeed | 0, 1597334677) ^
        Math.imul(salt | 0, 1013904223)) |
      0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // Estruturas dinâmicas geradas pela seed
  const HOUSES = [];
  const PIERS = [];
  const BOATS = [];
  const CITIZENS = [];
  let _citizensInitialized = false;
  const _activeDoorwayTimers = new Map();

  // Linha costeira sinuosa determinística por seed (divide BEACH ao norte e COAST_WATER / DEEP_OCEAN ao sul)
  function getShorelineY(tx) {
    if (_naturalMode) {
      let v = _shoreCache.get(tx);
      if (v === undefined) {
        v = _computeNaturalShore(tx);
        _shoreCache.set(tx, v);
      }
      return v;
    }
    const dx = tx - CITY_CX;
    const wave1 = Math.sin(dx * 0.085 + (_currentSeed % 97) * 0.13) * 1.8;
    const wave2 = Math.cos(dx * 0.042 + (_currentSeed % 53) * 0.29) * 1.4;
    // Enseada natural (baía portuária na divisa exata entre a Praia e o Mar)
    const bayIndent = Math.abs(dx) < 42 ? -Math.cos((dx / 42) * (Math.PI * 0.5)) * 2.2 : 0;
    return Math.round(CITY_CY + 3 + wave1 + wave2 + bayIndent);
  }

  // Linha onde a Água Rasa da Baía Portuária encontra o Oceano Profundo (DEEP_OCEAN)
  function getDeepOceanStartY(tx) {
    if (_naturalMode) {
      let v = _deepCache.get(tx);
      if (v === undefined) {
        v = _computeNaturalDeepStart(tx);
        _deepCache.set(tx, v);
      }
      return v;
    }
    const shoreY = getShorelineY(tx);
    const dx = tx - CITY_CX;
    // Na frente dos píeres (|dx| <= 46) a baía rasa tem ~24 a 28 blocos para abrigar as docas; nas laterais o oceano já começa a ~12 blocos da praia!
    const harborReach = Math.abs(dx) < 52 ? Math.cos((dx / 52) * (Math.PI * 0.5)) * 14 : 0;
    const wave = Math.sin(tx * 0.06 + (_currentSeed % 41)) * 2.5;
    return Math.round(shoreY + 12 + harborReach + wave);
  }

  // Verifica se o tile está na área de bioma garantido da Cidade Portuária
  function isCityBiomeArea(tx, ty) {
    if (_siteSearchActive || _inNaturalQuery) return false;
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    // modo natural: so o territorio da cidade (o World precisa deste "true" para desenhar casas, calcadao, pieres e barcos);
    // o bioma dentro dele e o natural (ver getBiomeForTile). Modo fixo (antigo): disco forcado de 460 blocos.
    const r = _naturalMode ? CITY_RADIUS : LEGACY_BIOME_RADIUS;
    return dx * dx + dy * dy <= r * r;
  }

  // Bioma NATURAL do tile (modo natural): pergunta ao proprio mundo, com o porto "desligado" para nao recursar
  function _naturalBiomeAt(tx, ty) {
    if (!_world) return null;
    const prev = _inNaturalQuery;
    _inNaturalQuery = true;
    try {
      return _world._computeSurfaceBaseBiome(tx, ty);
    } finally {
      _inNaturalQuery = prev;
    }
  }
  function _isSeaBiome(b) {
    return !!b && (b.id === "COAST_WATER" || b.id === "DEEP_OCEAN");
  }
  // Ultimo tile de terra antes do primeiro tile de mar na coluna tx (costa natural exata)
  function _computeNaturalShore(tx) {
    for (let y = CITY_CY - 14; y <= CITY_CY + 30; y++) {
      if (_isSeaBiome(_naturalBiomeAt(tx, y))) return y - 1;
    }
    return CITY_CY + 3;
  }
  // Ultimo tile de agua rasa antes do oceano profundo na coluna tx
  function _computeNaturalDeepStart(tx) {
    const shoreY = getShorelineY(tx);
    for (let y = shoreY + 1; y <= shoreY + 80; y++) {
      const b = _naturalBiomeAt(tx, y);
      if (b && b.id === "DEEP_OCEAN") return y - 1;
    }
    return shoreY + 80;
  }

  // Verifica se o tile na região da Cidade Portuária é água (COAST_WATER ou DEEP_OCEAN)
  function isCityWaterArea(tx, ty) {
    if (!isCityBiomeArea(tx, ty)) return false;
    if (_naturalMode) return _isSeaBiome(_naturalBiomeAt(tx, ty));
    return ty > getShorelineY(tx);
  }

  // Retorna o bioma exato do tile na região da Cidade Portuária:
  // - Ao norte da orla (ty <= shoreY): Praia Tropical (BEACH) onde ficam as casas e o calçadão
  // - Entre a praia e o oceano (shoreY < ty <= deepOceanY): Águas Rasas (COAST_WATER) onde avançam os píeres
  // - Ao sul (ty > deepOceanY): Oceano Profundo (DEEP_OCEAN) aberto!
  function getBiomeForTile(tx, ty) {
    if (!isCityBiomeArea(tx, ty)) return null;
    if (typeof BIOMES === "undefined") return null;
    if (_naturalMode) return _naturalBiomeAt(tx, ty); // costa e bioma naturais
    const shoreY = getShorelineY(tx);
    if (ty <= shoreY) {
      return BIOMES.BEACH;
    }
    const deepOceanY = getDeepOceanStartY(tx);
    if (ty <= deepOceanY) {
      return BIOMES.COAST_WATER;
    }
    return BIOMES.DEEP_OCEAN;
  }

  // Verifica se o tile está dentro do território construído da Cidade Portuária
  function isCityTerritory(tx, ty) {
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    return dx * dx + dy * dy <= CITY_RADIUS * CITY_RADIUS;
  }

  // =========================================================================
  // GERAÇÃO PROCEDURAL DA CIDADE PORTUÁRIA E EMBARCAÇÕES DE ACORDO COM A SEED
  // =========================================================================
  function _buildPortLayoutForSeed(seed) {
    _currentSeed = (Number(seed) || 54321) | 0;
    HOUSES.length = 0;
    PIERS.length = 0;
    BOATS.length = 0;

    // 1. GERA OS PÍERES DE MADEIRA (4 Píeres principais saindo da Praia Tropical, cruzando a Água Rasa até a borda do Oceano Profundo!)
    const pierCount = 4;
    const basePierXs = [-28, -9, 10, 29];
    for (let p = 0; p < pierCount; p++) {
      const shiftX = Math.round((_seedHash(p, 11, 101) - 0.5) * 6);
      const px = CITY_CX + basePierXs[p] + shiftX;
      const startY = CITY_CY + 1; // Conecta diretamente no calçadão portuário na areia da praia
      const len = 18 + Math.floor(_seedHash(p, 23, 103) * 8); // Avança pelas Águas Rasas até a divisa com o Oceano Profundo
      const endY = startY + len;
      const halfW = p === 1 || p === 2 ? 2 : 1; // Píeres centrais mais largos (5 blocos), laterais (3 blocos)
      const hasCrossT = _seedHash(p, 37, 107) > 0.35;

      PIERS.push({
        id: p + 1,
        cx: px,
        startY,
        endY,
        halfW,
        hasCrossT,
        crossY: endY - 1,
        crossHalfW: halfW + 3,
      });
    }

    // 2. GERA AS EMBARCAÇÕES NA ÁGUA DE ACORDO COM A SEED:
    //    - Galeões / Caravelas Mercantes atracados nos píeres principais (com prancha de embarque caminhável!)
    //    - Escunas e Barcos Pesqueiros atracados nas laterais dos píeres
    //    - Embarcações ancoradas na transição entre as Águas Rasas e o Oceano Profundo!
    let boatIdCounter = 1;

    for (let p = 0; p < PIERS.length; p++) {
      const pier = PIERS[p];
      const dockSide = _seedHash(p, 51, 201) < 0.5 ? -1 : 1;

      // Embarcação principal atracada ao lado deste píer
      const isGalleon = p === 1 || p === 2 || _seedHash(p, 61, 203) > 0.45;
      const bHalfW = isGalleon ? 2 : 1; // Largura do casco: 5 blocos (Galeão) ou 3 blocos (Barco Costeiro)
      const bHalfH = isGalleon ? 5 : 3; // Comprimento do casco: 11 blocos (Galeão) ou 7 blocos (Barco)
      const gangplankLen = 2;
      const boatCx = pier.cx + dockSide * (pier.halfW + gangplankLen + bHalfW);
      const boatCy = pier.startY + Math.min(pier.endY - pier.startY - bHalfH - 1, 8 + Math.floor(_seedHash(p, 71, 209) * 5));
      const sailColorIdx = Math.floor(_seedHash(p, 83, 211) * 5);
      const hullStyle = Math.floor(_seedHash(p, 97, 223) * 3);

      BOATS.push({
        id: boatIdCounter++,
        name: isGalleon
          ? `Galeão Mercante #${boatIdCounter - 1}`
          : `Escuna Portuária #${boatIdCounter - 1}`,
        boatType: isGalleon ? "galleon" : "schooner",
        orientation: "vertical",
        cx: boatCx,
        cy: boatCy,
        halfW: bHalfW,
        halfH: bHalfH,
        dockedPierId: pier.id,
        dockSide: dockSide, // -1 = barco a oeste do píer, +1 = barco a leste do píer
        gangplankY: boatCy,
        gangplankMinX: dockSide > 0 ? pier.cx + pier.halfW + 1 : boatCx + bHalfW + 1,
        gangplankMaxX: dockSide > 0 ? boatCx - bHalfW - 1 : pier.cx - pier.halfW - 1,
        sailColorIdx,
        hullStyle,
        facingDir: _seedHash(p, 109, 227) < 0.5 ? "south" : "north",
      });

      // Embarcação secundária (Barco Pesqueiro / Saveiro) do outro lado do píer de acordo com a seed
      if (_seedHash(p, 131, 233) > 0.25) {
        const oppSide = -dockSide;
        const fHalfW = 1;
        const fHalfH = 3;
        const fCx = pier.cx + oppSide * (pier.halfW + 2 + fHalfW);
        const fCy = pier.startY + 6 + Math.floor(_seedHash(p, 149, 239) * 4);

        // Verifica não colidir com outro píer ou barco
        let conflict = false;
        for (const ob of BOATS) {
          if (Math.abs(fCx - ob.cx) <= fHalfW + ob.halfW + 3 && Math.abs(fCy - ob.cy) <= fHalfH + ob.halfH + 2) {
            conflict = true;
            break;
          }
        }
        for (const op of PIERS) {
          if (Math.abs(fCx - op.cx) <= fHalfW + op.halfW + 1 && fCy + fHalfH >= op.startY && fCy - fHalfH <= op.endY) {
            conflict = true;
            break;
          }
        }
        if (!conflict) {
          BOATS.push({
            id: boatIdCounter++,
            name: `Barco Pesqueiro #${boatIdCounter - 1}`,
            boatType: "fishing_boat",
            orientation: "vertical",
            cx: fCx,
            cy: fCy,
            halfW: fHalfW,
            halfH: fHalfH,
            dockedPierId: pier.id,
            dockSide: oppSide,
            gangplankY: fCy,
            gangplankMinX: oppSide > 0 ? pier.cx + pier.halfW + 1 : fCx + fHalfW + 1,
            gangplankMaxX: oppSide > 0 ? fCx - fHalfW - 1 : pier.cx - pier.halfW - 1,
            sailColorIdx: Math.floor(_seedHash(p, 163, 241) * 5),
            hullStyle: Math.floor(_seedHash(p, 173, 251) * 3),
            facingDir: "south",
          });
        }
      }
    }

    // 3. EMBARCAÇÕES ANCORADAS NA BAÍA E NO OCEANO PROFUNDO LOGO À FRENTE DO PORTO (espalhadas de acordo com a seed)
    const anchoredZones = [
      { baseX: -44, baseY: 14, type: "galleon", orient: "horizontal" },
      { baseX: -19, baseY: 31, type: "schooner", orient: "horizontal" },
      { baseX: 2, baseY: 34, type: "galleon", orient: "horizontal" },
      { baseX: 24, baseY: 30, type: "fishing_boat", orient: "vertical" },
      { baseX: 44, baseY: 15, type: "schooner", orient: "horizontal" },
      { baseX: -36, baseY: 28, type: "fishing_boat", orient: "horizontal" },
    ];

    for (let a = 0; a < anchoredZones.length; a++) {
      const az = anchoredZones[a];
      const sx = Math.round((_seedHash(a, 191, 307) - 0.5) * 8);
      const sy = Math.round((_seedHash(a, 199, 311) - 0.5) * 6);
      const isHoriz = az.orient === "horizontal";
      const isGal = az.type === "galleon";
      const hw = isHoriz ? (isGal ? 5 : 3) : (isGal ? 2 : 1);
      const hh = isHoriz ? (isGal ? 2 : 1) : (isGal ? 5 : 3);
      const acx = CITY_CX + az.baseX + sx;
      const acy = CITY_CY + az.baseY + sy;

      let conflict = false;
      for (const ob of BOATS) {
        if (Math.abs(acx - ob.cx) <= hw + ob.halfW + 3 && Math.abs(acy - ob.cy) <= hh + ob.halfH + 3) {
          conflict = true;
          break;
        }
      }
      for (const op of PIERS) {
        if (Math.abs(acx - op.cx) <= hw + op.halfW + 2 && acy + hh >= op.startY - 1 && acy - hh <= op.endY + 2) {
          conflict = true;
          break;
        }
      }

      if (!conflict) {
        BOATS.push({
          id: boatIdCounter++,
          name: isGal
            ? `Nau Mercante Ancorada #${boatIdCounter - 1}`
            : az.type === "schooner"
              ? `Caravela Costeira #${boatIdCounter - 1}`
              : `Jangada / Saveiro de Pesca #${boatIdCounter - 1}`,
          boatType: az.type,
          orientation: az.orient,
          cx: acx,
          cy: acy,
          halfW: hw,
          halfH: hh,
          dockedPierId: null,
          sailColorIdx: Math.floor(_seedHash(a, 211, 313) * 5),
          hullStyle: Math.floor(_seedHash(a, 223, 317) * 3),
          facingDir: isHoriz ? (_seedHash(a, 229, 331) < 0.5 ? "east" : "west") : "south",
        });
      }
    }

    // 4. GERA AS CASAS PORTUÁRIAS NA PRAIA TROPICAL DE ACORDO COM A SEED
    //    - Espalhadas ao redor do Calçadão do Porto e Praça Marítima sem sobrepor ruas ou costa
    const houseAnchors = [
      // Primeira fileira costeira (olhando para o Calçadão do Porto e para o Mar ao sul)
      { rx: -42, ry: -9, hw: 3, hh: 2, doorSide: "south", style: 0, kind: "tavern" },
      { rx: -28, ry: -10, hw: 3, hh: 2, doorSide: "south", style: 1, kind: "shop" },
      { rx: -15, ry: -9, hw: 2, hh: 2, doorSide: "south", style: 2, kind: "house" },
      { rx: 15, ry: -9, hw: 2, hh: 2, doorSide: "south", style: 0, kind: "house" },
      { rx: 28, ry: -10, hw: 3, hh: 2, doorSide: "south", style: 1, kind: "warehouse" },
      { rx: 42, ry: -9, hw: 3, hh: 2, doorSide: "south", style: 2, kind: "house" },

      // Fileira intermediária da Praia Tropical (espalhadas conforme a seed)
      { rx: -46, ry: -22, hw: 2, hh: 2, doorSide: "south", style: 1, kind: "house" },
      { rx: -32, ry: -23, hw: 3, hh: 2, doorSide: "south", style: 2, kind: "house" },
      { rx: -17, ry: -21, hw: 3, hh: 2, doorSide: "south", style: 0, kind: "house" },
      { rx: 0, ry: -23, hw: 3, hh: 2, doorSide: "south", style: 0, kind: "captain_hall" },
      { rx: 17, ry: -21, hw: 3, hh: 2, doorSide: "south", style: 1, kind: "house" },
      { rx: 32, ry: -23, hw: 2, hh: 2, doorSide: "south", style: 2, kind: "house" },
      { rx: 46, ry: -22, hw: 3, hh: 2, doorSide: "south", style: 0, kind: "house" },

      // Fileira norte das dunas e palmeiras da praia (espalhadas conforme a seed)
      { rx: -38, ry: -35, hw: 3, hh: 2, doorSide: "south", style: 2, kind: "house" },
      { rx: -22, ry: -36, hw: 2, hh: 2, doorSide: "south", style: 0, kind: "house" },
      { rx: -8, ry: -35, hw: 3, hh: 2, doorSide: "south", style: 1, kind: "house" },
      { rx: 9, ry: -35, hw: 2, hh: 2, doorSide: "south", style: 2, kind: "house" },
      { rx: 24, ry: -36, hw: 3, hh: 2, doorSide: "south", style: 0, kind: "house" },
      { rx: 39, ry: -34, hw: 2, hh: 2, doorSide: "south", style: 1, kind: "house" },
    ];

    const HOUSE_TYPE_NAMES = {
      tavern: "Taverna do Marujo Dourado",
      shop: "Empório de Especiarias e Redes",
      warehouse: "Armazém Naval da Companhia do Mar",
      captain_hall: "Capitania dos Portos Tropicais",
      house: "Casa Portuária Caiada",
    };

    for (let i = 0; i < houseAnchors.length; i++) {
      const anc = houseAnchors[i];
      let placed = null;

      for (let attempt = 0; attempt < 20; attempt++) {
        const range = attempt < 8 ? 3 : 2;
        const jx = attempt === 19 ? 0 : Math.round((_seedHash(i + 1, attempt * 7 + 3, 401) * 2 - 1) * range);
        const jy = attempt === 19 ? 0 : Math.round((_seedHash(i + 1, attempt * 11 + 5, 409) * 2 - 1) * 2);
        const cx = CITY_CX + anc.rx + jx;
        const cy = CITY_CY + anc.ry + jy;
        const hw = _seedHash(i + 1, attempt + 2, 419) > 0.45 ? 3 : 2;
        const hh = 2;

        // Não pode invadir o Calçadão Beira-Mar (ty >= CITY_CY - 3) nem a Praça Central (|dx| <= 9 e dy >= -14)
        if (cy + hh >= CITY_CY - 4) continue;
        if (Math.abs(cx - CITY_CX) <= 9 + hw && cy + hh >= CITY_CY - 15) continue;

        // Garante distância mínima de 4 blocos entre casas vizinhas (espalhadas de acordo com a seed)
        let overlap = false;
        for (let j = 0; j < HOUSES.length; j++) {
          const other = HOUSES[j];
          const sepX = Math.abs(cx - other.cx) - (hw + other.halfW);
          const sepY = Math.abs(cy - other.cy) - (hh + other.halfH);
          if (sepX < 4 && sepY < 4) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          placed = { cx, cy, hw, hh };
          break;
        }
      }

      if (!placed) {
        placed = {
          cx: CITY_CX + anc.rx,
          cy: CITY_CY + anc.ry,
          hw: anc.hw,
          hh: anc.hh,
        };
      }

      const id = HOUSES.length + 1;
      const roofStyle = Math.floor(_seedHash(id, 17, 431) * 3);
      const baseTitle = HOUSE_TYPE_NAMES[anc.kind] || "Casa Portuária Caiada";
      HOUSES.push({
        id,
        name: `${baseTitle} #${id}`,
        kind: anc.kind || "house",
        cx: placed.cx,
        cy: placed.cy,
        relX: placed.cx - CITY_CX,
        relY: placed.cy - CITY_CY,
        halfW: placed.hw,
        halfH: placed.hh,
        doorSide: anc.doorSide || "south",
        roofStyle,
      });
    }
  }

  // Inicializa o layout com a seed padrão e permite atualizar quando a seed mudar
  _buildPortLayoutForSeed(_currentSeed);

  // =========================================================================
  // LOCALIZACAO DA COSTA (por seed): o porto nasce numa divisa natural PRAIA | MAR voltada para o sul
  // =========================================================================
  // Procura, em aneis crescentes a partir da origem, uma praia cujo mar fique ao SUL e cuja costa seja reta o bastante
  // para o layout atual (casas ate 37 blocos ao norte da costa; pieres e barcos ate 36 ao sul; ~100 de largura):
  //   - desvio da costa <= 3 blocos e inclinacao <= 2,5 graus ao longo de +-60 colunas;
  //   - praia natural (BEACH) por >= 44 blocos atras da costa e terra a 100 blocos atras;
  //   - mar (agua rasa e/ou profunda) por >= 100 blocos a frente, com >= 12 blocos de agua rasa.
  // O centro fica 2 blocos ao norte da linha da costa (o desenho antigo usava ~3 com costa ondulada). Se nao achar, volta ao ponto antigo.
  const SITE_MIN_DIST = 500;
  const SITE_MAX_DIST = 9000;
  const SITE_STEP = 112;
  const SITE_SHORE_OFFSET = 2; // o centro fica 2 blocos ao norte da costa (testado: 0 barcos em terra em 790 pontos; com 3, 5 proas em terra)

  function _findPortSite(world) {
    let checked = 0;
    const id = (x, y) => {
      checked++;
      const b = world._computeSurfaceBaseBiome(Math.floor(x), Math.floor(y));
      return b ? b.id : null;
    };
    const sea = (v) => v === "COAST_WATER" || v === "DEEP_OCEAN";
    // costa exata na coluna x perto de yHint: ultimo tile de terra antes do mar (null se a coluna nao for terra->mar)
    const shoreAt = (x, yHint) => {
      if (sea(id(x, yHint - 10))) return null;
      for (let y = yHint - 9; y <= yHint + 12; y++) if (sea(id(x, y))) return y - 1;
      return null;
    };
    const evaluate = (cx, yShore) => {
      // 1) teste rapido em 3 colunas
      const quick = [-60, 0, 60].map((d) => shoreAt(cx + d, yShore));
      if (quick.some((v) => v === null) || Math.max(...quick) - Math.min(...quick) > 8) return null;
      // 2) costa em 21 colunas: reta o bastante?
      const cols = [];
      for (let d = -60; d <= 60; d += 6) {
        const sh = shoreAt(cx + d, yShore);
        if (sh === null) return null;
        cols.push([cx + d, sh]);
      }
      const N = cols.length;
      let sx = 0, sy = 0, sxx = 0, sxy = 0;
      for (const [x, y] of cols) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
      const m = (N * sxy - sx * sy) / (N * sxx - sx * sx);
      const b = (sy - m * sx) / N;
      let maxDev = 0;
      for (const [x, y] of cols) maxDev = Math.max(maxDev, Math.abs(y - (m * x + b)));
      const slopeDeg = (Math.atan(m) * 180) / Math.PI;
      if (maxDev > 3 || Math.abs(slopeDeg) > 2.5) return null;
      // 3) praia atras, terra mais atras, mar a frente (colunas a cada 20 blocos)
      for (let k = 0; k < cols.length; k += 3) {
        const [x, sh] = cols[k];
        for (const back of [4, 12, 24, 36, 44]) if (id(x, sh - back) !== "BEACH") return null;
        if (sea(id(x, sh - 100))) return null;
        for (const front of [2, 6, 10]) if (id(x, sh + front) !== "COAST_WATER") return null;
        for (const front of [14, 22, 30, 40, 60, 100]) if (!sea(id(x, sh + front))) return null;
      }
      return { cx, cy: Math.round(m * cx + b) - SITE_SHORE_OFFSET, maxDev: +maxDev.toFixed(1), slopeDeg: +slopeDeg.toFixed(1) };
    };
    for (let d = SITE_MIN_DIST; d <= SITE_MAX_DIST; d += SITE_STEP) {
      const n = Math.max(8, Math.ceil((Math.PI * 2 * d) / SITE_STEP));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const px = Math.round(Math.cos(a) * d),
          py = Math.round(Math.sin(a) * d);
        if (id(px, py) !== "BEACH") continue;
        // desce para o sul ate achar o mar; o ultimo tile de terra antes dele tem que ser praia
        let yLand = py,
          ySea = null;
        for (let y = py + 16; y <= py + 640; y += 16) {
          const v = id(px, y);
          if (sea(v)) {
            ySea = y;
            break;
          }
          if (v !== "BEACH") break;
          yLand = y;
        }
        if (ySea === null) continue;
        // refina a costa entre yLand (terra) e ySea (mar)
        let lo = yLand,
          hi = ySea;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (sea(id(px, mid))) hi = mid;
          else lo = mid;
        }
        const r = evaluate(px, lo);
        if (r) return { site: [r.cx, r.cy], maxDev: r.maxDev, slopeDeg: r.slopeDeg, checked };
      }
    }
    return { site: null, checked };
  }

  function _relocate(cx, cy, natural, seed) {
    CITY_CX = cx;
    CITY_CY = cy;
    _naturalMode = natural;
    _shoreCache.clear();
    _deepCache.clear();
    _buildPortLayoutForSeed(seed); // casas, pieres e barcos guardam posicao absoluta: reconstroi no centro novo
    _citizensInitialized = false;
    CITIZENS.length = 0;
    _activeDoorwayTimers.clear();
    if (typeof window !== "undefined" && window.drawPortCityHouseRoofs && window.drawPortCityHouseRoofs._cache) {
      window.drawPortCityHouseRoofs._cache.clear();
    }
  }

  let _lastSiteKey = null;
  function setSeed(newSeed, world) {
    const s = (Number(newSeed) || 54321) | 0;
    const legacy = typeof window !== "undefined" && !!window.__legacyPortCity;
    const canSearch = !!(world && typeof world._computeSurfaceBaseBiome === "function");
    if (!legacy && !canSearch) {
      // sem mundo (chamada antiga): so refaz a planta para a seed, no centro atual
      if (s === _currentSeed && HOUSES.length > 0) return;
      _relocate(CITY_CX, CITY_CY, _naturalMode, s);
      return;
    }
    const key = String(s) + (legacy ? ":legado" : ":natural");
    if (key === _lastSiteKey && HOUSES.length > 0) return; // mesma seed: local ja calculado
    _lastSiteKey = key;
    _world = world || _world;
    if (legacy) {
      _relocate(LEGACY_CX, LEGACY_CY, false, s);
      _siteInfo = { mode: "fixed", distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), maxDev: 0, slopeDeg: 0, checked: 0 };
      return;
    }
    // Durante a busca o disco do porto fica desligado e, com ele, os discos das outras cidades dinamicas (bandeira global):
    // o resultado depende so da seed, nunca da posicao que outra cidade tinha na seed anterior.
    let res = null;
    const prevG = window.__citySiteSearch;
    _siteSearchActive = true;
    window.__citySiteSearch = true;
    try {
      res = _findPortSite(world);
    } catch (e) {
      res = null;
    } finally {
      _siteSearchActive = false;
      window.__citySiteSearch = prevG;
    }
    if (res && res.site) {
      _relocate(res.site[0], res.site[1], true, s);
      _siteInfo = { mode: "natural", distance: Math.round(Math.hypot(res.site[0], res.site[1])), maxDev: res.maxDev, slopeDeg: res.slopeDeg, checked: res.checked };
    } else {
      _relocate(LEGACY_CX, LEGACY_CY, false, s);
      _siteInfo = { mode: "fixed", distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), maxDev: 0, slopeDeg: 0, checked: res ? res.checked : 0 };
    }
  }
  // Para testes: executa fn com o disco do porto desligado (le o bioma natural)
  function _withoutBiomeOverride(fn) {
    _siteSearchActive = true;
    try {
      return fn();
    } finally {
      _siteSearchActive = false;
    }
  }

  // Encontra casa no tile
  function getHouseAt(tx, ty) {
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      if (Math.abs(tx - h.cx) <= h.halfW && Math.abs(ty - h.cy) <= h.halfH) {
        return h;
      }
    }
    return null;
  }

  // Casa ativa onde o jogador está dentro (para ocultar o telhado 2.5D ao entrar)
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

  // Encontra píer ou prancha de embarque no tile
  function getPierAt(tx, ty) {
    for (let i = 0; i < PIERS.length; i++) {
      const p = PIERS[i];
      if (ty >= p.startY && ty <= p.endY && Math.abs(tx - p.cx) <= p.halfW) {
        return { pier: p, isEdge: Math.abs(tx - p.cx) === p.halfW || ty === p.endY, isGangplank: false };
      }
      if (p.hasCrossT && Math.abs(ty - p.crossY) <= 1 && Math.abs(tx - p.cx) <= p.crossHalfW) {
        return { pier: p, isEdge: Math.abs(ty - p.crossY) === 1 || Math.abs(tx - p.cx) === p.crossHalfW, isGangplank: false };
      }
    }
    // Pranchas de embarque que ligam os píeres aos barcos atracados
    for (let i = 0; i < BOATS.length; i++) {
      const b = BOATS[i];
      if (b.dockedPierId && Math.abs(ty - b.gangplankY) <= 1 && tx >= b.gangplankMinX && tx <= b.gangplankMaxX) {
        return { pier: PIERS[0], isEdge: false, isGangplank: true, boat: b };
      }
    }
    return null;
  }

  // Verifica se (tx, ty) pertence ao casco afilado/curvo da embarcação (sem cantos quadrados nas pontas!)
  function isTileInBoatHull(b, tx, ty) {
    const rx = tx - b.cx;
    const ry = ty - b.cy;
    const W = b.halfW;
    const H = b.halfH;
    if (Math.abs(rx) > W || Math.abs(ry) > H) return false;

    const isHoriz = b.orientation === "horizontal";
    const along = isHoriz ? rx : ry;
    const across = Math.abs(isHoriz ? ry : rx);
    const L = isHoriz ? W : H;
    const B = isHoriz ? H : W;

    const bowSign = isHoriz
      ? (b.facingDir === "west" ? -1 : 1)
      : (b.facingDir === "north" ? -1 : 1);
    const distFromBow = (bowSign > 0) ? (L - along) : (along + L);
    const distFromStern = (bowSign > 0) ? (along + L) : (L - along);

    if (B >= 2) {
      // Galeão / Nau (5 blocos de largura): proa pontiaguda e popa arredondada
      if (distFromBow === 0 && across >= 1) return false;
      if (distFromBow === 1 && across >= 2) return false;
      if (distFromStern === 0 && across >= 2) return false;
    } else if (B === 1) {
      // Escuna / Saveiro (3 blocos de largura): bico de proa afilado
      if (distFromBow === 0 && across >= 1) return false;
    }
    return true;
  }

  // Encontra embarcação no tile (respeitando o formato naval afilado do casco)
  function getBoatAt(tx, ty) {
    for (let i = 0; i < BOATS.length; i++) {
      const b = BOATS[i];
      if (isTileInBoatHull(b, tx, ty)) {
        return b;
      }
    }
    return null;
  }

  // Verifica se o tile faz parte do Calçadão Portuário ou Praça Marítima
  function isBoardwalkOrPlazaAt(tx, ty) {
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    const shoreY = getShorelineY(tx);
    // Calçadão Portuário acompanhando a beira da praia (de CITY_CY - 2 até shoreY)
    if (Math.abs(dx) <= 46 && ty >= CITY_CY - 2 && ty <= shoreY) {
      return "boardwalk";
    }
    // Praça Central do Porto (entre as casas costeiras)
    if (Math.abs(dx) <= 8 && dy >= -14 && dy < -2) {
      return "plaza";
    }
    return null;
  }

  // =========================================================================
  // RETORNA A CÉLULA ARQUITETÔNICA DA CIDADE PORTUÁRIA OU EMBARCAÇÃO EM (tx, ty)
  // =========================================================================
  function getCellAt(tx, ty, interactedProps) {
    if (!isCityTerritory(tx, ty)) return null;

    const tileKey = `${tx},${ty}`;
    const intState =
      interactedProps && interactedProps.get
        ? interactedProps.get(tileKey) || {}
        : {};

    // 1. EMBARCAÇÕES NA ÁGUA (Galeões, Escunas e Barcos Pesqueiros)
    const boat = getBoatAt(tx, ty);
    if (boat) {
      const rx = tx - boat.cx;
      const ry = ty - boat.cy;
      const W = boat.halfW;
      const H = boat.halfH;
      const isHoriz = boat.orientation === "horizontal";

      // Verifica se este tile da borda do barco é a entrada da prancha de embarque
      const isGangplankEntry =
        !!boat.dockedPierId &&
        Math.abs(ty - boat.gangplankY) <= 1 &&
        ((boat.dockSide > 0 && rx === -W) || (boat.dockSide < 0 && rx === W));

      // Centro do barco: Mastro Principal, Casco Curvo 2.5D, Castelo de Popa, Proa e Velame
      if (rx === 0 && ry === 0) {
        return {
          isPortCity: true,
          isPortBoat: true,
          isPortPier: true,
          boatId: boat.id,
          role: "boat_center",
          roomName: boat.name,
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_boat_mast",
            boatId: boat.id,
            boatSpec: boat,
            scale: 1,
            interactive: true,
            namePt: `${boat.name} (Mastro e Velame)`,
            descriptionPt:
              "Embarcação marítima de casco curvo em madeira nobre calafetada, com castelo de popa, gurupés de proa e velas enfunadas pela brisa tropical. Pressione [F] para inspecionar o navio!",
          },
        };
      }

      const bowSign = isHoriz
        ? (boat.facingDir === "west" ? -1 : 1)
        : (boat.facingDir === "north" ? -1 : 1);

      // Timão do Capitão / Leme no tombadilho da popa da embarcação
      const helmRx = isHoriz ? -bowSign * (W - 1) : 0;
      const helmRy = isHoriz ? 0 : -bowSign * (H - 1);
      if (rx === helmRx && ry === helmRy) {
        return {
          isPortCity: true,
          isPortBoat: true,
          isPortPier: true,
          boatId: boat.id,
          role: "boat_helm",
          roomName: `Tombadilho de Comando (${boat.name})`,
          isWall: false,
          isCollider: false,
          prop: {
            kind: "port_city_boat_helm",
            boatId: boat.id,
            boatType: boat.boatType,
            interactive: true,
            namePt: `Timão de Comando (${boat.name})`,
            descriptionPt:
              "Roda de leme em madeira de lei com bússola de latão no castelo de popa para navegar pelos mares tropicais. Pressione [F] para examinar a rota!",
          },
        };
      }

      // Baú do Capitão / Carga Naval no castelo de proa dos Galeões e Escunas
      const chestRx = isHoriz ? bowSign * (W - 1) : 0;
      const chestRy = isHoriz ? 0 : bowSign * (H - 1);
      if (rx === chestRx && ry === chestRy) {
        const opened = !!intState.opened;
        return {
          isPortCity: true,
          isPortBoat: true,
          isPortPier: true,
          boatId: boat.id,
          role: "boat_chest",
          roomName: `Castelo de Proa (${boat.name})`,
          isWall: false,
          isCollider: false,
          prop: {
            kind: "chest",
            subType: 0,
            scale: 1.0,
            interactive: !opened,
            opened: opened,
            namePt: opened
              ? `Baú Marítimo (${boat.name} - Saqueado)`
              : `Baú do Capitão (${boat.name})`,
            descriptionPt: opened
              ? "Os suprimentos e doblões deste baú naval já foram recolhidos."
              : `Arca naval reforçada com latão a bordo de ${boat.name}. Pressione [F] para abrir!`,
          },
        };
      }

      // Verifica se o tile está na amurada externa do casco naval curvo
      const isHullBorder =
        !isTileInBoatHull(boat, tx - 1, ty) ||
        !isTileInBoatHull(boat, tx + 1, ty) ||
        !isTileInBoatHull(boat, tx, ty - 1) ||
        !isTileInBoatHull(boat, tx, ty + 1);
      if (isHullBorder && !isGangplankEntry) {
        return {
          isPortCity: true,
          isPortBoat: true,
          isPortPier: true,
          boatId: boat.id,
          role: "boat_rail",
          roomName: `Amurada de ${boat.name}`,
          isWall: false,
          isCollider: false,
          prop: null,
        };
      }

      // Convés caminhável de tábuas navais calafetadas
      return {
        isPortCity: true,
        isPortBoat: true,
        isPortPier: true,
        boatId: boat.id,
        role: "boat_deck",
        roomName: `Convés de ${boat.name}`,
        isWall: false,
        isCollider: false,
        prop: null,
      };
    }

    // 2. PÍERES DE MADEIRA E PRANCHAS DE EMBARQUE SOBRE A ÁGUA
    const pierInfo = getPierAt(tx, ty);
    if (pierInfo) {
      const p = pierInfo.pier;
      const isLampSpot =
        !pierInfo.isGangplank &&
        Math.abs(tx - p.cx) === p.halfW &&
        (ty === p.startY + 4 || ty === p.startY + 12 || ty === p.endY - 1);
      const isBollardSpot =
        !pierInfo.isGangplank &&
        Math.abs(tx - p.cx) === p.halfW &&
        (ty === p.startY + 8 || ty === p.endY);

      return {
        isPortCity: true,
        isPortPier: true,
        role: pierInfo.isGangplank ? "gangplank" : "pier",
        roomName: pierInfo.isGangplank
          ? `Prancha de Embarque (${pierInfo.boat ? pierInfo.boat.name : "Navio"})`
          : `Píer de Madeira #${p.id}`,
        isWall: false,
        isCollider: false,
        prop: isLampSpot
          ? {
              kind: "port_city_lamppost",
              interactive: true,
              namePt: "Lanterna Naval do Píer",
              descriptionPt:
                "Poste de madeira naval com lampião de óleo de baleia que guia as embarcações à noite.",
            }
          : isBollardSpot
            ? {
                kind: "port_city_bollard",
                interactive: true,
                namePt: "Cabeço de Amarração Naval",
                descriptionPt:
                  " Tronco maciço com cabos de cânhamo grosso amarrando os navios atracados no porto.",
              }
            : null,
      };
    }

    // 3. CASAS PORTUÁRIAS NA PRAIA TROPICAL
    const house = getHouseAt(tx, ty);
    if (house) {
      const rx = tx - house.cx;
      const ry = ty - house.cy;
      const W = house.halfW;
      const H = house.halfH;
      const isSouthDoor = house.doorSide === "south";
      const doorY = isSouthDoor ? H : -H;
      const doorX = 0;
      const houseId = house.id;

      // Porta da casa portuária
      if (ry === doorY && rx === doorX) {
        const isDoorOpen = !!intState.opened;
        return {
          isPortCity: true,
          houseIndex: houseId,
          role: "door",
          roomName: `Entrada — ${house.name}`,
          isDoor: true,
          isDoorOpen: isDoorOpen,
          isWall: false,
          prop: {
            kind: "port_city_door",
            houseIndex: houseId,
            opened: isDoorOpen,
            interactive: true,
            namePt: isDoorOpen
              ? `Porta Naval Aberta (${house.name})`
              : `Porta de Madeira Naval (${house.name})`,
            descriptionPt: isDoorOpen
              ? "Porta colonial com detalhes de latão aberta para a brisa do mar. Pressione [F] para fechar."
              : "Porta resistente de cedro marítimo com vigia redonda de latão. Pressione [F] para abrir!",
          },
        };
      }

      // Paredes externas (alvenaria caiada branca/creme com vigas de madeira tropical)
      if (Math.abs(rx) === W || Math.abs(ry) === H) {
        return {
          isPortCity: true,
          houseIndex: houseId,
          role: "wall",
          roomName: `Parede — ${house.name}`,
          isWall: true,
          prop: {
            kind: "port_city_wall",
            subType: house.roofStyle || 0,
            houseIndex: houseId,
            namePt: `Parede Colonial Portuária (${house.name})`,
            descriptionPt:
              "Parede caiada de cal branca e pedra coralina com vigamento de madeira tropical resistente à maresia.",
          },
        };
      }

      // Interior: Rede Tropical / Leito de Marinheiro no canto esquerdo
      const hammockX = -W + 1;
      const hammockY = isSouthDoor ? -H + 1 : H - 1;
      if (rx === hammockX && ry === hammockY) {
        return {
          isPortCity: true,
          houseIndex: houseId,
          role: "hammock",
          roomName: `Interior — ${house.name}`,
          isWall: false,
          prop: {
            kind: "port_city_hammock",
            houseIndex: houseId,
            interactive: true,
            namePt: "Rede de Algodão e Leito de Marinheiro",
            descriptionPt:
              "Leito fresco de fibras naturais embalado pela brisa da praia tropical. Pressione [F] para descansar e recuperar todas as forças!",
          },
        };
      }

      // Interior: Barris de Rum/Água Doce, Caixotes de Especiarias e Mapas Náuticos no canto direito
      const cargoX = W - 1;
      const cargoY = isSouthDoor ? -H + 1 : H - 1;
      if (rx === cargoX && ry === cargoY) {
        return {
          isPortCity: true,
          houseIndex: houseId,
          role: "cargo",
          roomName: `Suprimentos — ${house.name}`,
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_cargo",
            houseIndex: houseId,
            subType: houseId % 3,
            interactive: true,
            namePt: "Barris Navais e Caixotes do Porto",
            descriptionPt:
              "Barris de carvalho com água doce, frutas tropicais, pescado salgado e cartas náuticas. Pressione [F] para inspecionar!",
          },
        };
      }

      // Interior: Mesa de Taverna / Balcão de Mapas no centro-fundo de casas maiores (W === 3)
      if (W >= 3 && rx === 0 && ry === (isSouthDoor ? -H + 1 : H - 1)) {
        return {
          isPortCity: true,
          houseIndex: houseId,
          role: "table",
          roomName: `Salão — ${house.name}`,
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_table",
            houseIndex: houseId,
            interactive: true,
            namePt: "Mesa Náutica de Carvalho",
            descriptionPt:
              "Mesa posta com bússola, luneta de latão, cartas marítimas da costa e canecas de madeira. Pressione [F] para examinar!",
          },
        };
      }

      // Piso interno de tábuas navais envernizadas
      return {
        isPortCity: true,
        houseIndex: houseId,
        role: "floor",
        roomName: `Interior — ${house.name}`,
        isWall: false,
        prop: null,
      };
    }

    // 4. CALÇADÃO PORTUÁRIO E PRAÇA CENTRAL DO PORTO
    const bwRole = isBoardwalkOrPlazaAt(tx, ty);
    if (bwRole) {
      const dx = tx - CITY_CX;
      const dy = ty - CITY_CY;

      // Monumento Central da Praça do Porto: Farol-Lanterna e Grande Âncora de Bronze (em CITY_CX, CITY_CY - 6)
      if (dx === 0 && dy === -6) {
        return {
          isPortCity: true,
          role: "plaza",
          roomName: "Praça do Farol e da Grande Âncora",
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_monument",
            interactive: true,
            namePt: "Farol Portuário & Monumento da Grande Âncora",
            descriptionPt:
              "Marco central da Cidade Portuária das Palmeiras com fogo de sinalização marítima. Pressione [F] para descansar à brisa do porto e restaurar vigor!",
          },
        };
      }

      // Bancos e postes de lanterna ao redor da Praça e Calçadão
      if (
        (Math.abs(dx) === 6 && (dy === -10 || dy === -3)) ||
        (Math.abs(dx) === 18 && dy === 0) ||
        (Math.abs(dx) === 34 && dy === 0)
      ) {
        return {
          isPortCity: true,
          role: bwRole,
          roomName: "Calçadão da Cidade Portuária",
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_lamppost",
            interactive: true,
            namePt: "Poste de Lanterna Marítima",
            descriptionPt: "Lampião portuário de bronze suspenso em haste de madeira naval.",
          },
        };
      }

      // Remessas de caixotes, redes de pesca e barris ao longo do cais
      if (
        (dx === -13 && dy === 0) ||
        (dx === 14 && dy === 0) ||
        (dx === -23 && dy === 0) ||
        (dx === 23 && dy === 0)
      ) {
        return {
          isPortCity: true,
          role: bwRole,
          roomName: "Cais de Mercadorias do Porto",
          isWall: false,
          isCollider: true,
          prop: {
            kind: "port_city_cargo",
            subType: Math.abs(dx) % 3,
            interactive: true,
            namePt: "Carga Portuária e Redes de Pesca",
            descriptionPt:
              "Mercadorias recém-desembarcadas das caravelas: especiarias, cordas navais, cocos e redes de pesca.",
          },
        };
      }

      return {
        isPortCity: true,
        role: bwRole,
        roomName:
          bwRole === "plaza"
            ? "Praça da Capitania do Porto"
            : "Calçadão Portuário da Praia Tropical",
        isWall: false,
        isCollider: false,
        prop: null,
      };
    }

    return null;
  }

  
  const PORT_GREETINGS = [
    "⚓ Bem-vindo à Cidade Portuária das Palmeiras! Nossos navios mudam de ancoragem a cada nova maré e seed do mundo.",
    "⛵ As águas rasas da baía estão ótimas para navegar! Você pode subir pelos píeres e caminhar pelo convés das embarcações.",
    "🌴 A brisa tropical enche nossas velas! Já visitou o Galeão Mercante atracado no píer principal?",
    "🐟 Hoje a pesca nas águas azul-turquesa rendeu dourados e atuns! Os barcos pesqueiros acabaram de atracar.",
    "🧭 Na Capitania do Porto guardamos cartas náuticas de todas as ilhas e recifes deste oceano.",
    "🐚 As casas caiadas da praia protegem do calor tropical. Sinta-se em casa para descansar nas redes de algodão!",
    "⚓ Ouvi dizer que o Baú do Capitão na proa dos navios guarda relíquias trazidas de além-mar!",
  ];

  const PORT_CHATTER = [
    "⛵ Içar as velas na maré alta!",
    "⚓ Amarrem bem os cabos no píer!",
    "🐟 A rede veio cheia hoje!",
    "🌴 Que brisa boa na Praia Tropical!",
    "🧭 Vento sul favorável para as caravelas!",
    "📦 Descarreguem os barris no calçadão!",
  ];

  
  
  function _initCitizens(tileSize) {
    if (_citizensInitialized) return;
    // skins e perfis vivem em js/citizens/port-citizen.js
    const { skinTones: SKIN_TONES, outfitColors: OUTFIT_COLORS, profiles: PORT_PROFILES } = CITIZEN_KINDS["port-citizen"];
    _citizensInitialized = true;
    CITIZENS.length = 0;
    const ts = tileSize || 36;
    let profileIdx = 0;

    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      const count = h.halfW >= 3 && i % 2 === 0 ? 2 : 1;

      for (let r = 0; r < count; r++) {
        const id = CITIZENS.length + 1;
        const prof = PORT_PROFILES[profileIdx % PORT_PROFILES.length];
        profileIdx++;

        const isSouthDoor = h.doorSide === "south";
        const doorTx = h.cx;
        const doorTy = h.cy + (isSouthDoor ? h.halfH : -h.halfH);
        const outsideTy = doorTy + (isSouthDoor ? 1.35 : -1.35);

        const hammockTx = h.cx - h.halfW + 1;
        const hammockTy = h.cy + (isSouthDoor ? -h.halfH + 1 : h.halfH - 1);
        const cargoTx = h.cx + h.halfW - 1;
        const cargoTy = h.cy + (isSouthDoor ? -h.halfH + 1 : h.halfH - 1);
        const hallTx = h.cx;
        const hallTy = h.cy + (isSouthDoor ? h.halfH - 0.9 : -h.halfH + 0.9);
        const centerTx = h.cx + (r === 0 ? -0.35 : 0.35);
        const centerTy = h.cy;

        const startOnPier = r === 0 && i < PIERS.length;
        const startOutside = startOnPier || (id + r) % 4 !== 0;
        const pier = PIERS[i % Math.max(1, PIERS.length)];

        let startX, startY;
        if (startOnPier && pier) {
          startX = (pier.cx + 0.5) * ts;
          startY = (pier.startY + 4 + ((i * 3) % 7) + 0.5) * ts;
        } else if (startOutside) {
          startX = (h.cx + (r === 0 ? -1.2 : 1.2) + 0.5) * ts;
          startY = (outsideTy + 0.5) * ts;
        } else {
          startX = ((r === 0 ? hammockTx : centerTx) + 0.5) * ts;
          startY = ((r === 0 ? hammockTy : centerTy) + 0.5) * ts;
        }

        const cit = {
          id,
          name: `${prof.name} (${prof.title})`,
          shortName: prof.name,
          title: prof.title,
          gender: prof.gender,
          style: prof.style,
          propInHand: prof.prop,
          houseId: h.id,
          house: h,
          residentIndex: r,
          skinColor: SKIN_TONES[(id * 3 + r * 5 + i) % SKIN_TONES.length],
          hairColor: ["#1c1917", "#451a03", "#78350f", "#92400e", "#cbd5e1"][(id * 2 + r) % 5],
          outfit: OUTFIT_COLORS[(id + r) % OUTFIT_COLORS.length],
          x: startX,
          y: startY,
          facing: "down",
          isMoving: false,
          walkPhase: id * 1.6,
          speed: 0.88 + ((id * 7) % 5) * 0.04,
          doorTx,
          doorTy,
          outsideTy,
          hammockTx,
          hammockTy,
          cargoTx,
          cargoTy,
          hallTx,
          hallTy,
          centerTx,
          centerTy,
          isInsideHouse: !startOutside,
          state: startOutside ? "strolling" : "inside_home",
          stateTimer: startOutside ? 10 + (id % 14) : 4 + (id % 6),
          pauseTimer: 0,
          chatCooldown: 4 + (id % 6),
          chatPartnerId: null,
          chatText: "",
          waypoints: [],
        };

        if (startOutside) {
          _assignPortStroll(cit, ts);
        }
        CITIZENS.push(cit);
      }
    }
  }

  // Encontra qual píer contém a posição (tx, ty) caso o morador esteja sobre um píer
  function _findPierContaining(tx, ty) {
    for (let i = 0; i < PIERS.length; i++) {
      const p = PIERS[i];
      if (ty >= p.startY - 0.5 && ty <= p.endY + 0.5 && Math.abs(tx - p.cx) <= p.halfW + 1.2) {
        return p;
      }
    }
    return null;
  }

  // Cria uma rota segura que NUNCA atravessa a água nem paredes das casas (usando o Calçadão como eixo)
  function _buildSafePortRoute(cit, targetX, targetY, ts) {
    const waypoints = [];
    const curTx = cit.x / ts - 0.5;
    const curTy = cit.y / ts - 0.5;
    const destTx = targetX / ts - 0.5;
    const destTy = targetY / ts - 0.5;
    const boardwalkY = (CITY_CY - 0.5 + 0.5) * ts;

    // 1. Se o morador está em um píer (curTy > CITY_CY + 0.5), primeiro sobe pelo próprio píer até o Calçadão!
    const curPier = curTy > CITY_CY + 0.5 ? _findPierContaining(curTx, curTy) : null;
    const destPier = destTy > CITY_CY + 0.5 ? _findPierContaining(destTx, destTy) : null;

    if (curPier && (!destPier || destPier.id !== curPier.id)) {
      waypoints.push({ x: (curPier.cx + 0.5) * ts, y: boardwalkY });
    }

    // 2. Se o destino é em um píer diferente da posição atual, vai pelo Calçadão até a entrada do píer de destino!
    if (destPier && (!curPier || curPier.id !== destPier.id)) {
      waypoints.push({ x: (destPier.cx + 0.5) * ts, y: boardwalkY });
      waypoints.push({ x: targetX, y: targetY });
      return waypoints;
    }

    // 3. Se ambos estão na areia/calçadão (fora dos píeres), adiciona ponto intermediário suave evitando casas
    const midX = (cit.x + targetX) * 0.5 + (Math.random() * 10 - 5);
    let midY = (cit.y + targetY) * 0.5 + (Math.random() * 8 - 4);
    const midTx = Math.round(midX / ts - 0.5);
    const midTy = Math.round(midY / ts - 0.5);
    const hitHouse = getHouseAt(midTx, midTy);
    if (hitHouse) {
      midY = (hitHouse.cy + hitHouse.halfH + 1.5 + 0.5) * ts;
    }
    if (midY > (CITY_CY + 1.2) * ts && !destPier && !curPier) {
      midY = boardwalkY;
    }
    waypoints.push({ x: midX, y: midY });
    waypoints.push({ x: targetX, y: targetY });
    return waypoints;
  }

  function _assignPortStroll(cit, ts) {
    const roll = Math.random();
    let targetX, targetY;
    if (roll < 0.38 && PIERS.length > 0) {
      // Passeia até um dos píeres de madeira ou convés de embarcação atracada
      const p = PIERS[Math.floor(Math.random() * PIERS.length)];
      targetX = (p.cx + (Math.random() * 1.0 - 0.5) + 0.5) * ts;
      targetY = (p.startY + 2 + Math.random() * Math.max(2, p.endY - p.startY - 3) + 0.5) * ts;
    } else if (roll < 0.72) {
      // Passeia pelo Calçadão Portuário da Praia Tropical
      targetX = (CITY_CX + (Math.random() * 68 - 34) + 0.5) * ts;
      targetY = (CITY_CY + (Math.random() * 2.6 - 1.8) + 0.5) * ts;
    } else if (roll < 0.90) {
      // Passeia pela Praça do Farol e da Grande Âncora
      targetX = (CITY_CX + (Math.random() * 12 - 6) + 0.5) * ts;
      targetY = (CITY_CY - 8 + (Math.random() * 5 - 2.5) + 0.5) * ts;
    } else {
      // Visita a frente de uma casa portuária na praia
      const th = HOUSES[Math.floor(Math.random() * HOUSES.length)];
      targetX = (th.cx + (Math.random() * 2.2 - 1.1) + 0.5) * ts;
      targetY = (th.cy + th.halfH + 1.6 + 0.5) * ts;
    }

    cit.waypoints = _buildSafePortRoute(cit, targetX, targetY, ts);
    cit.isMoving = true;
  }

  // Envia o morador de volta para sua casa na Praia Tropical
  function _sendPortCitizenHome(cit, ts, forNight) {
    cit.state = forNight ? "returning_home_night" : "entering_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;

    if (cit.isInsideHouse) {
      const destTx = forNight ? cit.hammockTx : (Math.random() < 0.5 ? cit.cargoTx : cit.centerTx);
      const destTy = forNight ? cit.hammockTy : (Math.random() < 0.5 ? cit.cargoTy : cit.centerTy);
      cit.waypoints = [
        { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
        { x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts },
      ];
      cit.isMoving = true;
      return;
    }

    const doorStepX = (cit.doorTx + 0.5) * ts;
    const doorStepY = (cit.outsideTy + 0.5) * ts;
    const routeToDoor = _buildSafePortRoute(cit, doorStepX, doorStepY, ts);
    const destTx = forNight ? cit.hammockTx : (Math.random() < 0.5 ? cit.cargoTx : cit.centerTx);
    const destTy = forNight ? cit.hammockTy : (Math.random() < 0.5 ? cit.cargoTy : cit.centerTy);

    cit.waypoints = [
      ...routeToDoor,
      { x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true },
      { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts, markInside: true },
      { x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts },
    ];
    cit.isMoving = true;
  }

  // Faz o morador sair de sua casa portuária para passear no cais
  function _sendPortCitizenOutside(cit, ts) {
    cit.state = "exiting_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;

    cit.waypoints = [
      { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.outsideTy + 0.5) * ts, markOutside: true },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.outsideTy + 1.2 + 0.5) * ts, markOutside: true },
    ];
    cit.isMoving = true;
  }

  function isDoorwayUsedByCitizen(tx, ty) {
    const exp = _activeDoorwayTimers.get(`${tx},${ty}`);
    return exp !== undefined && exp > 0;
  }

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
    const phrase = PORT_GREETINGS[Math.floor(Math.random() * PORT_GREETINGS.length)];
    best.chatText = phrase.slice(0, 48) + "...";
    best.state = best.isInsideHouse ? best.state : "interacting";
    best.stateTimer = 4.5;

    return {
      success: true,
      citizen: best,
      message: `💬 ${best.name}: "${phrase}"`,
    };
  }

  function updateAndGetCitizenRenderItems(ctx, tileSize, player, timeOfDay, animTimer, viewLeft, viewRight, viewTop, viewBottom, isUnderground = false) {
    if (isUnderground) return [];
    const ts = tileSize || 36;
    _initCitizens(ts);

    if (player) {
      const dist = Math.hypot(player.x - CITY_CX * ts, player.y - CITY_CY * ts);
      if (dist > (CITY_RADIUS + 90) * ts) return [];
    }

    for (const [k, v] of _activeDoorwayTimers.entries()) {
      if (v <= 1) _activeDoorwayTimers.delete(k);
      else _activeDoorwayTimers.set(k, v - 1);
    }

    const dt = 0.016;
    const isNight = timeOfDay < 0.24 || timeOfDay > 0.78;
    const activePlayerHouseId = player ? getActiveHouseForPlayer(player.x, player.y, ts) : null;

    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      if (c.chatCooldown > 0) c.chatCooldown = Math.max(0, c.chatCooldown - dt);

      // Rotina noturna: moradores recolhem-se para descansar nas redes de suas casas
      if (isNight) {
        if (c.state !== "returning_home_night" && c.state !== "night_at_home") {
          _sendPortCitizenHome(c, ts, true);
        }
      } else {
        if (c.state === "night_at_home" || c.state === "returning_home_night") {
          c.state = c.isInsideHouse ? "inside_home" : "strolling";
          c.stateTimer = 2.0 + (c.id % 6) * 0.7;
          if (!c.isInsideHouse) _assignPortStroll(c, ts);
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
            _assignPortStroll(c, ts);
          }
        }
        continue;
      }

      if (c.pauseTimer > 0) {
        c.pauseTimer -= dt;
        c.isMoving = false;
        continue;
      }

      if (!isNight && !c.isInsideHouse && c.chatCooldown <= 0 && c.state === "strolling") {
        for (let j = i + 1; j < CITIZENS.length; j++) {
          const o = CITIZENS[j];
          if (!o.isInsideHouse && o.chatCooldown <= 0 && o.state === "strolling" && Math.hypot(c.x - o.x, c.y - o.y) < 42) {
            c.state = "chatting";
            o.state = "chatting";
            c.chatPartnerId = o.id;
            o.chatPartnerId = c.id;
            c.isMoving = false;
            o.isMoving = false;
            c.stateTimer = 4.2;
            o.stateTimer = 4.2;
            c.chatCooldown = 16 + Math.random() * 8;
            o.chatCooldown = 16 + Math.random() * 8;
            c.facing = c.x < o.x ? "right" : "left";
            o.facing = o.x < c.x ? "right" : "left";
            c.chatText = PORT_CHATTER[Math.floor(Math.random() * PORT_CHATTER.length)];
            break;
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
          _assignPortStroll(c, ts);
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
              _assignPortStroll(c, ts);
            } else if (c.state === "strolling") {
              c.pauseTimer = 1.5 + Math.random() * 3.0;
              c.stateTimer = 10 + Math.random() * 14;
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
            if (!isNight && Math.random() < 0.68) {
              _sendPortCitizenOutside(c, ts);
            } else {
              const destTx = Math.random() < 0.5 ? c.hammockTx : c.cargoTx;
              const destTy = Math.random() < 0.5 ? c.hammockTy : c.cargoTy;
              c.waypoints = [{ x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts }];
              c.isMoving = true;
              c.stateTimer = 4 + Math.random() * 6;
            }
          } else if (c.state === "strolling") {
            if (!isNight && Math.random() < 0.22) {
              _sendPortCitizenHome(c, ts, false);
            } else {
              _assignPortStroll(c, ts);
              c.stateTimer = 12 + Math.random() * 15;
            }
          }
        }
      }
    }

    const items = [];
    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      if (c.x < viewLeft - 48 || c.x > viewRight + 48 || c.y < viewTop - 48 || c.y > viewBottom + 48) {
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
        draw: () => CITIZEN_KINDS["port-citizen"].draw(ctx, c, timeOfDay, animTimer, player),
      });
    }
    return items;
  }

  
  const PortCity = {
    // posicao dinamica (getters): muda quando setSeed escolhe a costa da seed
    get CITY_CENTER() {
      return { tx: CITY_CX, ty: CITY_CY };
    },
    get centerX() {
      return CITY_CX;
    },
    get centerY() {
      return CITY_CY;
    },
    radius: CITY_RADIUS,
    get biomeRadius() {
      return _naturalMode ? CITY_RADIUS : LEGACY_BIOME_RADIUS;
    },
    get siteInfo() {
      return _siteInfo;
    },
    _withoutBiomeOverride,
    houses: HOUSES,
    piers: PIERS,
    boats: BOATS,
    citizens: CITIZENS,
    setSeed,
    getShorelineY,
    getDeepOceanStartY,
    isCityBiomeArea,
    isCityWaterArea,
    getBiomeForTile,
    isCityTerritory,
    getHouseAt,
    getActiveHouseForPlayer,
    getPierAt,
    getBoatAt,
    isBoardwalkOrPlazaAt,
    getCellAt,
    isDoorwayUsedByCitizen,
    interactWithNearbyCitizen,
    updateAndGetCitizenRenderItems,
  };

  G.PortCity = PortCity;
  window.PortCity = PortCity;
})(window.Game);
