/* js/core/snow-peak-city.js
 * Vila Glacial das Alturas — Pequena Cidade no Bioma de Picos Gelados.
 *
 * Características obrigatórias:
 * - Localizada no bioma de Picos Gelados (BiomeId.SNOW_PEAK / Picos Glaciais).
 * - Ruas e praça pavimentadas com pedras de paralelepípedo (cobblestone).
 * - No mínimo 20 casas (possui 24 casas no total, numeradas de #1 a #24).
 * - Cada casa possui:
 *     1. Quarto (cama nórdica com peles quentes, criado-mudo e armário de roupas).
 *     2. Banheiro (tina de banho quente de madeira, lavatório e sanitário).
 *     3. Sala (lareira de pedra aconchegante com fogo ardente, poltrona e mesinha).
 *     4. Cozinha (fogão a lenha de ferro e pedra, bancada de preparo e despensa).
 *     5. Algumas casas possuem Sala e Cozinha integradas juntas (conceito aberto),
 *        enquanto outras possuem divisória interna separando-as.
 *     6. TODAS as casas possuem chaminé (com fumaça animada subindo ao ar frio da montanha).
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  // Centro e raio territorial da Cidade dos Picos Gelados.
  // O centro NAO e mais fixo: setSeed(seed, world) procura um bioma Picos Glaciais (SNOW_PEAK) natural no mundo e coloca a
  // cidade DENTRO dele, junto com a mina (ver "Localizacao do bioma" abaixo). Se nao achar (ou window.__legacySnowCity = true),
  // usa o ponto antigo (-380, -1220) com o disco de bioma forcado de 1050 blocos, como antes.
  const LEGACY_CX = -380;
  const LEGACY_CY = -1220;
  let CITY_CX = LEGACY_CX;
  let CITY_CY = LEGACY_CY;
  const CITY_RADIUS = 132;
  const LEGACY_BIOME_RADIUS = 1050; // disco forcado do modo fixo (antigo)
  const NATURAL_BIOME_RADIUS = CITY_RADIUS + 100; // disco forcado no modo natural (cabe todo dentro do SNOW_PEAK natural)
  let _biomeRadius = LEGACY_BIOME_RADIUS;
  let _siteSearchActive = false; // true enquanto procura o local: desliga o disco forcado para ler o bioma NATURAL
  let _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: 0 };

  // Coordenadas da Escadaria do Subsolo do Quartel Militar (liga a Ala da Prisão na superfície ao Subsolo de Tortura e Solitárias!)
  let BARRACKS_STAIR_TX = CITY_CX;      // relX === 0
  let BARRACKS_STAIR_TY = CITY_CY + 51; // relY === 51

  // Coordenadas da Grande Mina Profunda de Escavação ao lado de fora da Prisão (Leste do Quartel/Prisão)
  // Entrada em relX === 46, relY === 56 (mesma posicao relativa em qualquer centro; no centro antigo: (-334, -1164))
  let PRISON_MINE_TX = CITY_CX + 46;
  let PRISON_MINE_TY = CITY_CY + 56;

  // =========================================================================
  // GERADOR PSEUDOALEATÓRIO DETERMINÍSTICO POR SEED (Mulberry32)
  // Garante que a posição das casas (especialmente as casas espalhadas ao redor
  // do centro pavimentado, estilo deserto, e os recuos das casas do centro)
  // mude automaticamente de acordo com a seed do mundo!
  // =========================================================================
  let _currentSeed = 4289;
  const HOUSES = [];

  function _createSeededRng(seedVal) {
    let a = (Number(seedVal) || 4289) >>> 0;
    if (a === 0) a = 4289;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // =========================================================================
  // URBANISMO DA VILA GLACIAL (40 CASAS NO TOTAL):
  // 1) 24 Casas no Centro Pavimentado (#1 a #24): ao redor da Praça Central e
  //    das Ruas Norte e Sul de paralelepípedos, com variações sutis por seed.
  // 2) 16 Novas Casas Espalhadas ao Redor do Centro Pavimentado (#25 a #40):
  //    posicionadas organicamente sobre a neve ao redor do núcleo pavimentado
  //    (Norte, Noroeste, Nordeste, Oeste, Leste e Sudoeste), com distância
  //    mínima garantida entre elas (estilo as casas espalhadas do Deserto!) e
  //    cujas posições, dimensões e layout interno mudam de acordo com a seed!
  // =========================================================================
  const BASE_PAVED_CENTER_SPECS = [
    // --- QUARTEIRÃO NOROESTE (Lado Norte da Rua Norte, portas para o Sul) ---
    { relX: -39, relY: -18, halfW: 7, halfH: 5, doorOnSouth: true,  twoBedrooms: true,  openConcept: true,  canJitterY: -1 },
    { relX: -24, relY: -19, halfW: 5, halfH: 6, doorOnSouth: true,  twoBedrooms: false, openConcept: false, canJitterY: 0 },
    { relX: -14, relY: -18, halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: true,  canJitterY: -1 },
    { relX: -2,  relY: -19, halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: false, canJitterY: 1 },

    // --- QUARTEIRÃO NORDESTE (Lado Norte da Rua Norte, portas para o Sul) ---
    { relX: 11,  relY: -18, halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: true,  canJitterY: -1 },
    { relX: 22,  relY: -19, halfW: 6, halfH: 6, doorOnSouth: true,  twoBedrooms: true,  openConcept: false, canJitterY: 0 },
    { relX: 37,  relY: -18, halfW: 7, halfH: 5, doorOnSouth: true,  twoBedrooms: true,  openConcept: true,  canJitterY: -1 },

    // --- QUARTEIRÃO CENTRO-OESTE (Lado Sul da Rua Norte, portas para o Norte + Coladas na Praça) ---
    { relX: -39, relY: -5,  halfW: 5, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: false, canJitterY: 1 },
    { relX: -24, relY: -4,  halfW: 7, halfH: 6, doorOnSouth: false, twoBedrooms: true,  openConcept: true,  canJitterY: 0 },
    { relX: -11, relY: -5,  halfW: 6, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: false, canJitterY: 0 },

    // --- QUARTEIRÃO CENTRO-LESTE (Lado Sul da Rua Norte, portas para o Norte + Coladas na Praça) ---
    { relX: 10,  relY: -5,  halfW: 5, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: true,  canJitterY: 0 },
    { relX: 23,  relY: -4,  halfW: 5, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: false, canJitterY: -1 },
    { relX: 35,  relY: -5,  halfW: 7, halfH: 5, doorOnSouth: false, twoBedrooms: true,  openConcept: true,  canJitterY: 1 },

    // --- QUARTEIRÃO CENTRO-SUL OESTE (Lado Norte da Rua Sul, portas para o Sul + Coladas na Praça) ---
    { relX: -38, relY: 5,   halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: true,  canJitterY: -1 },
    { relX: -26, relY: 4,   halfW: 7, halfH: 6, doorOnSouth: true,  twoBedrooms: true,  openConcept: false, canJitterY: 0 },
    { relX: -11, relY: 5,   halfW: 6, halfH: 5, doorOnSouth: true,  twoBedrooms: true,  openConcept: true,  canJitterY: 0 },

    // --- QUARTEIRÃO CENTRO-SUL LESTE (Lado Norte da Rua Sul, portas para o Sul + Coladas na Praça) ---
    { relX: 10,  relY: 5,   halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: false, canJitterY: 0 },
    { relX: 21,  relY: 6,   halfW: 5, halfH: 5, doorOnSouth: true,  twoBedrooms: false, openConcept: true,  canJitterY: -1 },
    { relX: 36,  relY: 5,   halfW: 7, halfH: 5, doorOnSouth: true,  twoBedrooms: true,  openConcept: false, canJitterY: -1 },

    // --- QUARTEIRÃO SUDOESTE (Lado Sul da Rua Sul, portas para o Norte) ---
    { relX: -36, relY: 18,  halfW: 6, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: true,  canJitterY: 1 },
    { relX: -20, relY: 19,  halfW: 7, halfH: 6, doorOnSouth: false, twoBedrooms: true,  openConcept: false, canJitterY: 0 },
    { relX: -7,  relY: 18,  halfW: 5, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: true,  canJitterY: 1 },

    // --- QUARTEIRÃO SUDESTE (Lado Sul da Rua Sul, portas para o Norte) ---
    { relX: 9,   relY: 19,  halfW: 6, halfH: 5, doorOnSouth: false, twoBedrooms: false, openConcept: false, canJitterY: -1 },
    { relX: 25,  relY: 18,  halfW: 7, halfH: 5, doorOnSouth: false, twoBedrooms: true,  openConcept: true,  canJitterY: 1 },
    { relX: 38,  relY: 19,  halfW: 5, halfH: 6, doorOnSouth: false, twoBedrooms: false, openConcept: false, canJitterY: 0 },
  ];

  // Âncoras base para as 16 novas casas espalhadas ao redor do centro pavimentado (como no Deserto, mas variando com a seed!)
  const SCATTERED_OUTER_ZONES = [
    // Arco Norte / Noroeste / Nordeste (acima da Rua Norte pavimentada, relY entre -34 e -76)
    { baseX: -68, baseY: -36, rangeX: 10, rangeY: 8,  doorOnSouth: true  }, // #25
    { baseX: -42, baseY: -44, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #26
    { baseX: -14, baseY: -46, rangeX: 12, rangeY: 9,  doorOnSouth: true  }, // #27
    { baseX:  16, baseY: -45, rangeX: 12, rangeY: 9,  doorOnSouth: true  }, // #28
    { baseX:  44, baseY: -43, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #29
    { baseX:  70, baseY: -35, rangeX: 10, rangeY: 8,  doorOnSouth: true  }, // #30

    // Arco Norte Distante (encostas geladas ao norte, relY entre -66 e -82)
    { baseX: -54, baseY: -70, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #31
    { baseX: -18, baseY: -74, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #32
    { baseX:  20, baseY: -73, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #33
    { baseX:  56, baseY: -69, rangeX: 12, rangeY: 8,  doorOnSouth: true  }, // #34

    // Flanco Oeste (a oeste do centro pavimentado, relX entre -62 e -88)
    { baseX: -74, baseY: -10, rangeX: 10, rangeY: 9,  doorOnSouth: true  }, // #35
    { baseX: -76, baseY:  16, rangeX: 10, rangeY: 9,  doorOnSouth: false }, // #36
    { baseX: -66, baseY:  42, rangeX: 10, rangeY: 9,  doorOnSouth: false }, // #37
    { baseX: -62, baseY:  68, rangeX: 10, rangeY: 8,  doorOnSouth: false }, // #38

    // Flanco Leste (a leste do centro pavimentado e ao norte da Mina Profunda)
    { baseX:  72, baseY: -10, rangeX: 10, rangeY: 9,  doorOnSouth: true  }, // #39
    { baseX:  74, baseY:  16, rangeX: 10, rangeY: 8,  doorOnSouth: false }, // #40
  ];

  // Verifica se um retângulo de casa espalhada [relX - halfW .. relX + halfW, relY - halfH .. relY + halfH]
  // conflita com o centro pavimentado, o Quartel/Prisão, a Mina Profunda ou com outras casas já posicionadas.
  function _isValidScatteredHouseBox(relX, relY, halfW, halfH, placedList, minGap) {
    const left = relX - halfW;
    const right = relX + halfW;
    const top = relY - halfH;
    const bottom = relY + halfH;

    // 1. Mantém distância do Centro Pavimentado (Ruas Norte/Sul e casas centrais: X in [-50..+49], Y in [-27..+27])
    if (right >= -51 && left <= 50 && bottom >= -27 && top <= 27) return false;

    // 2. Mantém distância do Grande Quartel Militar e Prisão (X in [-40..+40], Y in [24..78])
    if (right >= -41 && left <= 41 && bottom >= 24 && top <= 79) return false;

    // 3. Mantém distância da Grande Mina Profunda e Monte de Terra a Sudeste (X >= 36, Y >= 22)
    if (right >= 36 && bottom >= 23) return false;

    // 4. Garante que fique inteiramente dentro do território da Cidade da Neve (com folga de 6 blocos da borda)
    const maxCornerDist = Math.hypot(Math.max(Math.abs(left), Math.abs(right)), Math.max(Math.abs(top), Math.abs(bottom)));
    if (maxCornerDist > CITY_RADIUS - 6) return false;

    // 5. Garante espaçamento mínimo de `minGap` quadrados (4 a 8 blocos, igual ao deserto!) de todas as outras casas
    for (let i = 0; i < placedList.length; i++) {
      const o = placedList[i];
      const oLeft = o.relX - o.halfW - minGap;
      const oRight = o.relX + o.halfW + minGap;
      const oTop = o.relY - o.halfH - minGap;
      const oBottom = o.relY + o.halfH + minGap;
      if (right >= oLeft && left <= oRight && bottom >= oTop && top <= oBottom) {
        return false;
      }
    }
    return true;
  }

  function _buildHousesForSeed(seedVal) {
    _currentSeed = (Number(seedVal) || 4289) >>> 0;
    const rng = _createSeededRng(_currentSeed ^ 0x5f3759df);
    HOUSES.length = 0;

    // 1. Constrói as 25 casas do Centro Pavimentado (com leve variação de seed nos recuos e conceitos abertos/fechados)
    for (let idx = 0; idx < BASE_PAVED_CENTER_SPECS.length; idx++) {
      const base = BASE_PAVED_CENTER_SPECS[idx];
      const id = idx + 1;
      const jitterY = base.canJitterY !== 0 && rng() < 0.45 ? base.canJitterY : 0;
      const openConcept = rng() < 0.5 ? base.openConcept : !base.openConcept;
      const relX = base.relX;
      const relY = base.relY + jitterY;
      const layoutDesc = base.twoBedrooms
        ? `2 Quartos • ${openConcept ? "Sala/Cozinha Integradas" : "Cômodos Separados"}`
        : openConcept
          ? "Sala e Cozinha Integradas"
          : "Cômodos Separados";

      HOUSES.push({
        id,
        name: `Casa Glacial #${id} (${layoutDesc})`,
        cx: CITY_CX + relX,
        cy: CITY_CY + relY,
        relX,
        relY,
        halfW: base.halfW,
        halfH: base.halfH,
        openConcept,
        twoBedrooms: !!base.twoBedrooms,
        doorOnSouth: base.doorOnSouth,
        isScattered: false,
      });
    }

    // 2. Constrói as 16 Novas Casas Espalhadas ao redor do Centro Pavimentado (estilo Deserto, mudando com a seed!)
    // Embaralha levemente a ordem de estilos com base na seed e calcula a posição de cada casa em sua zona
    for (let sIdx = 0; sIdx < SCATTERED_OUTER_ZONES.length; sIdx++) {
      const zone = SCATTERED_OUTER_ZONES[sIdx];
      const id = HOUSES.length + 1;

      // Tamanho e configuração interna sorteados pela seed
      const sizeRoll = rng();
      const halfW = sizeRoll < 0.45 ? 5 : sizeRoll < 0.80 ? 6 : 7;
      const halfH = rng() < 0.72 ? 5 : 6;
      const twoBedrooms = halfW >= 6 && rng() < 0.55;
      const openConcept = rng() < 0.52;
      // Orientação da porta (voltada preferencialmente para o centro pavimentado da cidade, mas pode variar com a seed)
      const doorOnSouth = zone.baseY < -20 ? true : zone.baseY > 20 ? false : (rng() < 0.5 ? zone.doorOnSouth : !zone.doorOnSouth);

      let chosenX = zone.baseX;
      let chosenY = zone.baseY;
      let found = false;

      // Tenta posicionar com deslocamento determinístico da seed mantendo distância de 5 a 8 quadrados das outras casas
      for (let attempt = 0; attempt < 45; attempt++) {
        const shrink = attempt > 25 ? 0.5 : 1.0;
        const dx = Math.round((rng() * 2 - 1) * zone.rangeX * shrink);
        const dy = Math.round((rng() * 2 - 1) * zone.rangeY * shrink);
        const candX = zone.baseX + dx;
        const candY = zone.baseY + dy;
        const minGap = attempt < 20 ? 6 : attempt < 35 ? 4 : 3;
        if (_isValidScatteredHouseBox(candX, candY, halfW, halfH, HOUSES, minGap)) {
          chosenX = candX;
          chosenY = candY;
          found = true;
          break;
        }
      }

      // Fallback seguro na âncora se todas as tentativas aleatórias colidirem
      if (!found) {
        for (let r = 0; r <= 12 && !found; r += 2) {
          const dirs = [[0, 0], [-r, 0], [r, 0], [0, -r], [0, r], [-r, -r], [r, -r]];
          for (let d = 0; d < dirs.length; d++) {
            const cx = zone.baseX + dirs[d][0];
            const cy = zone.baseY + dirs[d][1];
            if (_isValidScatteredHouseBox(cx, cy, halfW, halfH, HOUSES, 3)) {
              chosenX = cx;
              chosenY = cy;
              found = true;
              break;
            }
          }
        }
      }

      const layoutDesc = twoBedrooms
        ? `Chalé Afastado • 2 Quartos • ${openConcept ? "Conceito Aberto" : "Cômodos Separados"}`
        : `Chalé Afastado • ${openConcept ? "Sala/Cozinha Integradas" : "Cômodos Separados"}`;

      HOUSES.push({
        id,
        name: `Casa Glacial #${id} (${layoutDesc})`,
        cx: CITY_CX + chosenX,
        cy: CITY_CY + chosenY,
        relX: chosenX,
        relY: chosenY,
        halfW,
        halfH,
        openConcept,
        twoBedrooms,
        doorOnSouth,
        isScattered: true,
      });
    }
  }

  // Inicializa o layout das casas com a seed padrão (será atualizado automaticamente quando World(seed) ou world.setSeed(seed) for chamado)
  _buildHousesForSeed(4289);

  // =========================================================================
  // TELHADOS ALPINOS MILITARES 2.5D DO QUARTEL E PRISÃO (COBERTOS DE NEVE):
  // - Cada pavilhão coberto do Quartel Militar e da Prisão tem seu próprio telhado 2.5D
  //   (deixando apenas o Pátio de Execução com Forca a céu aberto!).
  // - Quando o jogador entra na Ala de Oficiais, na Ala de Descanso ou em qualquer um dos
  //   4 Pavilhões de Celas de Concentração (ou no Corredor da Prisão), o telhado daquele
  //   pavilhão fica invisível e volta ao sair!
  // =========================================================================
  const BARRACKS_ROOFS = [
    // 1. Ala Noroeste: Salas para Oficiais (relX: -36..-14, relY: 28..45) — portas para o Pátio Leste (relX = -14, relY = 33 e 41)
    {
      id: "barracks_officers_wing",
      isBarracksRoof: true,
      minTileX: CITY_CX - 36,
      maxTileX: CITY_CX - 14,
      minTileY: CITY_CY + 28,
      maxTileY: CITY_CY + 45,
      doorSide: "east",
      doorTilesY: [CITY_CY + 33, CITY_CY + 41],
      chimneyTileX: CITY_CX - 28,
      chimneyTileY: CITY_CY + 28,
      roofStyle: 0,
    },
    // 2. Ala Nordeste: Salas de Descanso para Oficiais (relX: 14..36, relY: 28..45) — portas para o Pátio Oeste (relX = 14, relY = 33 e 41)
    {
      id: "barracks_rest_wing",
      isBarracksRoof: true,
      minTileX: CITY_CX + 14,
      maxTileX: CITY_CX + 36,
      minTileY: CITY_CY + 28,
      maxTileY: CITY_CY + 45,
      doorSide: "west",
      doorTilesY: [CITY_CY + 33, CITY_CY + 41],
      chimneyTileX: CITY_CX + 28,
      chimneyTileY: CITY_CY + 28,
      roofStyle: 1,
    },
    // 3. Corredor Central Coberto da Prisão e Acesso à Escadaria do Subsolo (relX: -4..+4, relY: 46..74) — portão ao Norte (relY = 46, relX = 0)
    {
      id: "barracks_prison_corridor",
      isBarracksRoof: true,
      minTileX: CITY_CX - 4,
      maxTileX: CITY_CX + 4,
      minTileY: CITY_CY + 46,
      maxTileY: CITY_CY + 74,
      doorSide: "north",
      doorTileX: CITY_CX,
      roofStyle: 0,
    },
    // 4. Grande Cela Coletiva — Bloco I Noroeste (relX: -36..-4, relY: 46..60) — portão a Leste (relX = -4, relY = 53)
    {
      id: "barracks_cell_nw",
      isBarracksRoof: true,
      minTileX: CITY_CX - 36,
      maxTileX: CITY_CX - 4,
      minTileY: CITY_CY + 46,
      maxTileY: CITY_CY + 60,
      doorSide: "east",
      doorTilesY: [CITY_CY + 53],
      roofStyle: 2,
    },
    // 5. Grande Cela Coletiva — Bloco II Nordeste (relX: 4..36, relY: 46..60) — portão a Oeste (relX = 4, relY = 53)
    {
      id: "barracks_cell_ne",
      isBarracksRoof: true,
      minTileX: CITY_CX + 4,
      maxTileX: CITY_CX + 36,
      minTileY: CITY_CY + 46,
      maxTileY: CITY_CY + 60,
      doorSide: "west",
      doorTilesY: [CITY_CY + 53],
      roofStyle: 2,
    },
    // 6. Grande Cela Coletiva — Bloco III Sudoeste (relX: -36..-4, relY: 60..74) — portão a Leste (relX = -4, relY = 66)
    {
      id: "barracks_cell_sw",
      isBarracksRoof: true,
      minTileX: CITY_CX - 36,
      maxTileX: CITY_CX - 4,
      minTileY: CITY_CY + 60,
      maxTileY: CITY_CY + 74,
      doorSide: "east",
      doorTilesY: [CITY_CY + 66],
      roofStyle: 2,
    },
    // 7. Grande Cela Coletiva — Bloco IV Sudeste (relX: 4..36, relY: 60..74) — portão a Oeste (relX = 4, relY = 66)
    {
      id: "barracks_cell_se",
      isBarracksRoof: true,
      minTileX: CITY_CX + 4,
      maxTileX: CITY_CX + 36,
      minTileY: CITY_CY + 60,
      maxTileY: CITY_CY + 74,
      doorSide: "west",
      doorTilesY: [CITY_CY + 66],
      roofStyle: 2,
    },
  ];

  // Verifica se o tile está dentro do território da cidade
  function isCityTerritory(tx, ty) {
    if (_siteSearchActive || (typeof window !== "undefined" && window.__citySiteSearch)) return false;
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    return dx * dx + dy * dy <= CITY_RADIUS * CITY_RADIUS;
  }

  // Zona alpina ao redor da cidade: garante que o bioma de Picos Glaciais tenha no mínimo 2.100 blocos de diâmetro
  // (raio de 1.050 blocos ao redor do centro da cidade, totalizando 2.100 x 2.100 blocos contínuos!)
  function isCityBiomeArea(tx, ty) {
    if (_siteSearchActive || (typeof window !== "undefined" && window.__citySiteSearch)) return false;
    const dx = tx - CITY_CX;
    const dy = ty - CITY_CY;
    const bufferRadius = _biomeRadius; // 1050 no modo fixo (antigo); NATURAL_BIOME_RADIUS quando a cidade nasce num SNOW_PEAK natural
    return dx * dx + dy * dy <= bufferRadius * bufferRadius;
  }

  // =========================================================================
  // LOCALIZACAO DO BIOMA (por seed): a cidade e a mina nascem dentro de um Picos Glaciais natural
  // =========================================================================
  // Mesmo sistema do Povoado do Deserto: procura, em aneis crescentes a partir da origem, o ponto mais proximo onde um
  // disco de SITE_FIT_RADIUS blocos e TODO SNOW_PEAK natural, e ajusta o centro para o ponto de maior folga. Durante a busca
  // os discos forcados de TODAS as cidades dinamicas ficam desligados (window.__citySiteSearch), para o resultado depender
  // so da seed (nunca da posicao anterior de outra cidade). A mina (entrada +46,+56 e ate ~156 blocos ao sul, no subsolo),
  // a escadaria, os telhados do quartel, as casas e os moradores acompanham o centro.
  const SITE_FIT_RADIUS = NATURAL_BIOME_RADIUS + 40;
  const SITE_MIN_DIST = 500;
  const SITE_MAX_DIST = 10000;
  const SITE_STEP = 96;

  function _shiftBarracksRoofs(dx, dy) {
    if (!dx && !dy) return;
    for (let i = 0; i < BARRACKS_ROOFS.length; i++) {
      const r = BARRACKS_ROOFS[i];
      for (const k of Object.keys(r)) {
        if (typeof r[k] === "number") {
          if (/TileX$/.test(k)) r[k] += dx;
          else if (/TileY$/.test(k)) r[k] += dy;
        } else if (Array.isArray(r[k])) {
          if (/TilesX$/.test(k)) r[k] = r[k].map((v) => v + dx);
          else if (/TilesY$/.test(k)) r[k] = r[k].map((v) => v + dy);
        }
      }
    }
  }

  function _relocate(cx, cy, biomeRadius, seed) {
    const dx = cx - CITY_CX;
    const dy = cy - CITY_CY;
    CITY_CX = cx;
    CITY_CY = cy;
    _biomeRadius = biomeRadius;
    BARRACKS_STAIR_TX = CITY_CX;
    BARRACKS_STAIR_TY = CITY_CY + 51;
    PRISON_MINE_TX = CITY_CX + 46;
    PRISON_MINE_TY = CITY_CY + 56;
    _shiftBarracksRoofs(dx, dy);
    _buildHousesForSeed(seed); // as casas guardam posicao absoluta: reconstroi no centro novo (mesma seed, mesma planta)
    _citizensInitialized = false;
    CITIZENS.length = 0;
    PRISONERS.length = 0;
    SOLDIERS.length = 0;
    _activeDoorwayTimers.clear();
  }

  function _findSnowSite(world) {
    let checked = 0;
    const sample = (x, y) => {
      checked++;
      const b = world._computeSurfaceBaseBiome(Math.floor(x), Math.floor(y));
      return b ? b.id : null;
    };
    const ringOk = (cx, cy, r) => {
      for (let i = 0; i < 16; i++) {
        const a = ((i + 0.5) / 16) * Math.PI * 2;
        if (sample(cx + Math.cos(a) * r, cy + Math.sin(a) * r) !== "SNOW_PEAK") return false;
      }
      return true;
    };
    const fits = (cx, cy) => {
      if (sample(cx, cy) !== "SNOW_PEAK") return false;
      if (!ringOk(cx, cy, SITE_FIT_RADIUS)) return false;
      return ringOk(cx, cy, SITE_FIT_RADIUS * 0.66) && ringOk(cx, cy, SITE_FIT_RADIUS * 0.33);
    };
    const margin = (cx, cy) => {
      if (sample(cx, cy) !== "SNOW_PEAK") return 0;
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

  // Para testes: executa fn com os discos forcados desligados (le o bioma natural)
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

  // Retorna o ID da casa ou do pavilhão do Quartel/Prisão se o jogador estiver dentro dele
  function getActiveHouseForPlayer(px, py, tileSize) {
    const ts = tileSize || 36;
    const ptx = px / ts - 0.5;
    const pty = py / ts - 0.5;
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      const dx = Math.abs(ptx - h.cx);
      const dy = Math.abs(pty - h.cy);
      // Considera o interior da casa (incluindo a linha da porta quando o jogador pisa nela)
      if (dx <= h.halfW - 0.15 && dy <= h.halfH - 0.15) {
        return h.id;
      }
      // Se estiver exatamente no vão da porta entrando/saindo
      const doorY = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
      if (Math.abs(ptx - h.cx) <= 0.65 && Math.abs(pty - doorY) <= 0.55) {
        return h.id;
      }
    }
    // Verifica se o jogador está dentro de um dos pavilhões cobertos do Quartel Militar e Prisão
    for (let j = 0; j < BARRACKS_ROOFS.length; j++) {
      const br = BARRACKS_ROOFS[j];
      if (
        ptx >= br.minTileX + 0.1 &&
        ptx <= br.maxTileX - 0.1 &&
        pty >= br.minTileY + 0.1 &&
        pty <= br.maxTileY - 0.1
      ) {
        return br.id;
      }
      // Verifica se está atravessando a porta/portão de entrada do pavilhão
      if (br.doorSide === "north" && Math.abs(ptx - br.doorTileX) <= 1.2 && Math.abs(pty - br.minTileY) <= 0.75) {
        return br.id;
      }
      if (br.doorSide === "east" && Math.abs(ptx - br.maxTileX) <= 0.75 && br.doorTilesY) {
        for (let k = 0; k < br.doorTilesY.length; k++) {
          if (Math.abs(pty - br.doorTilesY[k]) <= 0.85) return br.id;
        }
      }
      if (br.doorSide === "west" && Math.abs(ptx - br.minTileX) <= 0.75 && br.doorTilesY) {
        for (let k = 0; k < br.doorTilesY.length; k++) {
          if (Math.abs(pty - br.doorTilesY[k]) <= 0.85) return br.id;
        }
      }
    }
    return null;
  }

  // Retorna os dados arquitetônicos completos do bloco
  function getCellAt(tx, ty, interactedProps) {
    if (!isCityTerritory(tx, ty)) return null;

    const house = getHouseAt(tx, ty);
    const tileKey = `${tx},${ty}`;
    const intState =
      interactedProps && interactedProps.get
        ? interactedProps.get(tileKey) || {}
        : {};

    // 1. DENTRO DE UMA DAS 24 CASAS
    if (house) {
      const rx = tx - house.cx;
      const ry = ty - house.cy;
      const W = house.halfW;
      const H = house.halfH;
      const isSouthDoor = house.doorOnSouth;
      const doorY = isSouthDoor ? H : -H;
      const doorX = 0;
      const openConcept = house.openConcept;
      const houseId = house.id;

      // Parede externa oposta à porta (onde fica a chaminé exterior no telhado)
      const chimneyWallY = isSouthDoor ? -H : H;
      const chimneyWallX = 3;

      // 1.1 Porta frontal da casa (interativa com E / clique)
      if (ry === doorY && rx === doorX) {
        const isDoorOpen = !!intState.opened;
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "door",
          roomName: `Porta da Casa Glacial #${houseId}`,
          isDoor: true,
          isDoorOpen: isDoorOpen,
          isWall: false,
          openConcept,
          prop: {
            kind: "snow_city_door",
            houseIndex: houseId,
            opened: isDoorOpen,
            interactive: true,
            namePt: isDoorOpen
              ? `Porta Aberta (Casa Glacial #${houseId})`
              : `Porta de Carvalho e Ferro (Casa Glacial #${houseId})`,
            descriptionPt: isDoorOpen
              ? "Porta de madeira com batente de pedra aberta. Pressione [E] para fechar."
              : "Porta reforçada com ferragens de ferro e isolamento contra o vento dos picos. Pressione [E] para abrir ou fechar!",
          },
        };
      }

      // 1.2 Chaminé Exterior (em TODAS as 24 casas!)
      if (ry === chimneyWallY && rx === chimneyWallX) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "chimney",
          roomName: `Chaminé de Pedra da Casa Glacial #${houseId}`,
          isWall: true,
          isChimney: true,
          openConcept,
          prop: {
            kind: "snow_city_chimney",
            houseIndex: houseId,
            interactive: true,
            namePt: `Chaminé Fumegante da Casa #${houseId}`,
            descriptionPt:
              "Chaminé robusta de pedras da montanha elevando-se acima do telhado nevado, expelindo fumaça aquecida que mantém o chalé aquecido.",
          },
        };
      }

      // 1.3 Paredes externas da casa
      if (Math.abs(rx) === W || Math.abs(ry) === H) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "wall",
          roomName: `Parede Externa da Casa #${houseId}`,
          isWall: true,
          openConcept,
          prop: {
            kind: "snow_city_wall",
            subType: 0,
            wallHeightState: 0,
            namePt: `Parede de Pedra da Casa #${houseId}`,
            descriptionPt:
              "Paredes maciças de pedra da montanha com vigas de carvalho e telhado com beiral nevado 2.5D.",
          },
        };
      }

      // =====================================================================
      // 1.4 INTERIOR DA CASA (9x9 blocos):
      // - Quarto (cama, criado-mudo, cômoda)
      // - Banheiro (tina/banheira quente, lavatório, sanitário)
      // - Sala (lareira com fogo crepitante, poltrona, mesinha)
      // - Cozinha (fogão a lenha, bancada de preparo, armário de despensa)
      // - Sala e Cozinha juntas (conceito aberto) ou com divisória interna
      // =====================================================================

      // Orientação conforme a porta de entrada
      const northSide = isSouthDoor;

      // Divisória Oeste-Leste (separa ala íntima: quarto/banheiro da ala social: sala/cozinha)
      if (rx === -1) {
        // Vão de porta do Quarto (norte) e do Banheiro (sul)
        const isBedroomDoorway = northSide ? ry === -2 : ry === 2;
        const isBathroomDoorway = northSide ? ry === 2 : ry === -2;
        if (!isBedroomDoorway && !isBathroomDoorway) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "wall",
            roomName: `Divisória Interna da Casa #${houseId}`,
            isWall: true,
            openConcept,
            prop: {
              kind: "snow_city_wall",
              subType: 1,
              wallHeightState: 0,
              namePt: "Parede Divisória de Madeira e Pedra",
            },
          };
        }
      }

      // Divisória entre Quarto e Banheiro no lado Oeste (rx <= -1, ry === 0)
      if (rx <= -1 && ry === 0) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "wall",
          roomName: `Parede do Quarto / Banheiro #${houseId}`,
          isWall: true,
          openConcept,
          prop: {
            kind: "snow_city_wall",
            subType: 1,
            wallHeightState: 0,
            namePt: "Divisória Acústica de Madeira Nobre",
          },
        };
      }

      // Divisória entre Sala e Cozinha (apenas nas casas NÃO integradas, ry === 0, rx >= 0)
      if (!openConcept && rx >= 0 && ry === 0) {
        // Vão de passagem entre Sala e Cozinha em rx === 1
        if (rx !== 1) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "wall",
            roomName: `Divisória da Sala e Cozinha #${houseId}`,
            isWall: true,
            openConcept,
            prop: {
              kind: "snow_city_wall",
              subType: 1,
              wallHeightState: 0,
              namePt: "Parede Divisória da Sala e Cozinha",
            },
          };
        }
      }

      // --- 1.4.1 CÔMODO: QUARTO (Oeste-Norte se northSide, Oeste-Sul se southSide) ---
      const inBedroom = northSide
        ? rx <= -2 && ry <= -1
        : rx <= -2 && ry >= 1;

      if (inBedroom) {
        const roomName = `Quarto Aconchegante da Casa #${houseId}`;
        const bedCoord = northSide ? (rx === -3 && ry === -3) : (rx === -3 && ry === 3);
        const nightstandCoord = northSide ? (rx === -2 && ry === -4) : (rx === -2 && ry === 4);
        const wardrobeCoord = northSide ? (rx === -4 && ry === -2) : (rx === -4 && ry === 2);

        if (bedCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_bed",
              interactive: true,
              namePt: "Cama Nórdica de Casal com Peles de Inverno",
              descriptionPt:
                "Cama macia de madeira esculpida com cobertores grossos de lã e forro de pele de carneiro para descansar e se proteger do frio.",
            },
          };
        }
        if (nightstandCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_nightstand",
              interactive: true,
              namePt: "Criado-Mudo com Vela de Cera de Abelha",
              descriptionPt: "Mesa de cabeceira com castiçal aceso e gavetas de madeira.",
            },
          };
        }
        if (wardrobeCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_wardrobe",
              interactive: true,
              namePt: "Armário de Carvalho para Roupas de Lã",
              descriptionPt: "Cômoda espaçosa guardando casacos quentes, botas forradas e mantas.",
            },
          };
        }
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName,
          openConcept,
        };
      }

      // --- 1.4.2 CÔMODO: BANHEIRO (Oeste-Sul se northSide, Oeste-Norte se southSide) ---
      const inBathroom = northSide
        ? rx <= -2 && ry >= 1
        : rx <= -2 && ry <= -1;

      if (inBathroom) {
        const roomName = `Banheiro Aquecido da Casa #${houseId}`;
        const tubCoord = northSide ? (rx === -3 && ry === 3) : (rx === -3 && ry === -3);
        const sinkCoord = northSide ? (rx === -4 && ry === 2) : (rx === -4 && ry === -2);
        const toiletCoord = northSide ? (rx === -2 && ry === 4) : (rx === -2 && ry === -4);

        if (tubCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_bathtub",
              interactive: true,
              namePt: "Tina de Imersão Aquecida de Madeira",
              descriptionPt:
                "Banheira rústica de cedro com aros de ferro cheia de água quente perfumada com folhas de pinheiro para um banho relaxante nos picos gelados.",
            },
          };
        }
        if (sinkCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_sink",
              interactive: true,
              namePt: "Lavatório de Pedra Polida com Espelho",
              descriptionPt: "Pia de pedra esculpida com jarro d'água de cobre e toalha limpa.",
            },
          };
        }
        if (toiletCoord) {
          return {
            isSnowCity: true,
            houseIndex: houseId,
            role: "house_floor",
            roomName,
            openConcept,
            prop: {
              kind: "snow_city_toilet",
              interactive: true,
              namePt: "Sanitário com Assento Aquecido de Madeira",
              descriptionPt: "Lavabo discreto de madeira tratada com fechamento higiênico.",
            },
          };
        }
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName,
          openConcept,
        };
      }

      // --- 1.4.3 CÔMODO: SALA E COZINHA (Lado Leste, rx >= 0) ---
      const inLivingArea = northSide ? ry <= -1 : ry >= 1;
      const roomBaseName = openConcept
        ? `Sala de Estar e Cozinha Integradas da Casa #${houseId}`
        : inLivingArea
          ? `Sala de Estar Aconchegante da Casa #${houseId}`
          : `Cozinha com Fogão a Lenha da Casa #${houseId}`;

      // Lareira na Sala (conectada à Chaminé na parede externa!)
      const fireplaceCoord = northSide ? (rx === 3 && ry === -4) : (rx === 3 && ry === 4);
      // Sofá / poltrona da sala
      const sofaCoord = northSide ? (rx === 2 && ry === -2) : (rx === 2 && ry === 2);
      // Mesinha de centro da sala
      const tableCoord = northSide ? (rx === 1 && ry === -2) : (rx === 1 && ry === 2);

      // Fogão a lenha na Cozinha
      const stoveCoord = northSide ? (rx === 3 && ry === 3) : (rx === 3 && ry === -3);
      // Bancada de preparo de alimentos
      const counterCoord = northSide ? (rx === 2 && ry === 4) : (rx === 2 && ry === -4);
      // Armário de despensa / prateleiras
      const pantryCoord = northSide ? (rx === 4 && ry === 2) : (rx === 4 && ry === -2);

      if (fireplaceCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_fireplace",
            interactive: true,
            namePt: "Lareira de Pedra da Montanha com Fogo Ardente",
            descriptionPt:
              "Lareira rústica de pedras assentadas crepitando com lenha de pinheiro, aquecendo todo o chalé. A fumaça sobe diretamente pela chaminé!",
          },
        };
      }

      if (sofaCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_sofa",
            interactive: true,
            namePt: "Sofá Acolchoado com Mantas de Lã",
            descriptionPt: "Assento confortável em frente à lareira para relaxar após longas caminhadas na neve.",
          },
        };
      }

      if (tableCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_table",
            interactive: true,
            namePt: "Mesa de Centro com Caneca de Chá Quente",
            descriptionPt: "Pequena mesa de pinheiro polido com bebidas quentes e livro de crônicas.",
          },
        };
      }

      if (stoveCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_stove",
            interactive: true,
            namePt: "Fogão a Lenha e Forno de Pedra",
            descriptionPt:
              "Fogão de ferro fundido com chapa quente e chaleira de cobre soltando vapor aromático de ensopado.",
          },
        };
      }

      if (counterCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_counter",
            interactive: true,
            namePt: "Bancada Culinária com Facas e Temperos",
            descriptionPt: "Mesa de preparo com tábua de cortar pão, faca de caça e ervas alpinas secas.",
          },
        };
      }

      if (pantryCoord) {
        return {
          isSnowCity: true,
          houseIndex: houseId,
          role: "house_floor",
          roomName: roomBaseName,
          openConcept,
          prop: {
            kind: "snow_city_pantry",
            interactive: true,
            namePt: "Prateleiras de Despensa com Mantimentos de Inverno",
            descriptionPt: "Potes de cerâmica com geleias, carnes curadas, farinha e nozes armazenadas.",
          },
        };
      }

      // Piso livre da sala / cozinha / corredor interno
      return {
        isSnowCity: true,
        houseIndex: houseId,
        role: "house_floor",
        roomName: roomBaseName,
        openConcept,
      };
    }

    // =====================================================================
    // 2. FORA DAS CASAS: PRAÇA CENTRAL COMPACTA E REDE DE RUAS CONECTADAS
    // =====================================================================
    const relX = tx - CITY_CX;
    const relY = ty - CITY_CY;
    const absX = Math.abs(relX);
    const absY = Math.abs(relY);

    // 2.1 Praça Central da Cidade dos Picos Gelados (9x9 blocos: |relX| <= 4 e |relY| <= 4,
    //     com as casas internas coladas exatamente ao lado da praça em |relX| = 5!)
    const inCentralPlaza = absX <= 4 && absY <= 4;
    if (inCentralPlaza) {
      // Fogueira da Praça (no centro exato, metade do tamanho colossal anterior, com colisor!)
      if (relX === 0 && relY === 0) {
        return {
          isSnowCity: true,
          role: "plaza",
          roomName: "Fogueira da Praça dos Picos Gelados",
          isMonument: true,
          isCollider: true,
          isWall: false,
          prop: {
            kind: "snow_city_monument",
            scale: 1.2,
            interactive: true,
            namePt: "Fogueira da Praça dos Picos Gelados",
            descriptionPt:
              "Fogueira central de pedras da montanha e toras de pinheiro ardendo no coração da praça, aquecendo os bancos ao redor.",
          },
        };
      }

      // Bancos de madeira e ferro ao redor da Fogueira (Norte, Sul, Leste, Oeste em distância 2)
      const isNorthBench = relY === -2 && absX <= 1;
      const isSouthBench = relY === 2 && absX <= 1;
      const isWestBench = relX === -2 && absY <= 1;
      const isEastBench = relX === 2 && absY <= 1;

      if (isNorthBench || isSouthBench || isWestBench || isEastBench) {
        const isVerticalBench = isWestBench || isEastBench;
        return {
          isSnowCity: true,
          role: "plaza",
          roomName: "Banco da Praça dos Picos Gelados",
          isCollider: true,
          isWall: false,
          prop: {
            kind: "snow_city_bench",
            subType: isVerticalBench ? 1 : 0,
            benchFacing: isNorthBench
              ? "south"
              : isSouthBench
                ? "north"
                : isWestBench
                  ? "east"
                  : "west",
            interactive: true,
            namePt: "Banco da Praça Aquecido pela Fogueira",
            descriptionPt:
              "Banco robusto de tábuas de carvalho e braços de ferro forjado, posicionado de frente para a fogueira da praça. Pressione [F] para sentar e descansar!",
          },
        };
      }

      // Postes de lampião nos quatro cantos da praça (|relX| === 3 e |relY| === 3)
      if (absX === 3 && absY === 3) {
        return {
          isSnowCity: true,
          role: "plaza",
          roomName: "Lampião da Praça Central",
          isCollider: true,
          isWall: false,
          prop: {
            kind: "snow_city_lamppost",
            interactive: true,
            namePt: "Poste de Ferro Forjado com Lampião Âmbar",
            descriptionPt: "Lampião com queima de óleo alpino e vidro bisotado que dissipa a neblina gelada.",
          },
        };
      }

      return {
        isSnowCity: true,
        role: "plaza",
        roomName: "Praça Central dos Picos Gelados",
      };
    }

    // 2.2 RUAS COM CASAS DOS DOIS LADOS, BECOS COM SAÍDA E BECOS SEM SAÍDA:
    // - Rua Norte (relY = -12 e -11) e Rua Sul (relY = +11 e +12), percorrendo toda a vila (X = -45 até +44)
    const isMainDualSidedStreet = (absY === 11 || absY === 12) && relX >= -45 && relX <= 44;

    // - Passagens da Praça para as Ruas Norte e Sul:
    //   * Ao Norte da Praça: passagem deslocada em X = 4..5 (entre a Casa #4 em X = -7..+3 e a Casa #5 em X = +6..+16)
    //     e também acesso direto pelo vão central da Praça (X = -4..+4, Y = -10..-5)!
    const isNorthPlazaConnector =
      (relY >= -12 && relY <= -5 && relX >= -4 && relX <= 4) ||
      (relY >= -24 && relY <= -11 && (relX === 4 || relX === 5));

    //   * Ao Sul da Praça: passagem em X = -1..+2 que atravessa desde a Praça até o Portão do Quartel Militar (Y = +5..+28)!
    const isSouthPlazaConnector =
      (relY >= 5 && relY <= 12 && relX >= -4 && relX <= 4) ||
      (relY >= 11 && relY <= 28 && relX >= -2 && relX <= 2);

    // =====================================================================
    // 3. GRANDE QUARTEL MILITAR E PRISÃO DE CONCENTRAÇÃO (relX in [-36..+36], relY in [28..74])
    // Inclui:
    //   - Entrada Fortificada e Portão do Quartel (relY === 28)
    //   - Salas para Oficiais (Ala Noroeste: Gabinete do Comandante, Sala de Estratégia e Interrogatório)
    //   - Salas de Descanso para Oficiais (Ala Nordeste: Dormitório Oficial, Salão de Jogos/Lareira e Refeitório)
    //   - Pátio Central de Execução com Forca (relX in [-13..+13], relY in [30..45], Palanque + Forca no centro)
    //   - Ala de Prisão com 4 Grandes Celas Coletivas tipo Campo de Concentração (relY in [46..74])
    //   - Escadaria para o Subsolo da Prisão em (relX === 0, relY === 51) levando à Sala de Tortura e Solitárias!
    // =====================================================================
    if (relX >= -36 && relX <= 36 && relY >= 28 && relY <= 74) {
      // 3.1 MURALHA EXTERNA PERIMETRAL DO QUARTEL E PRISÃO
      const isOuterPerimeter =
        relX === -36 || relX === 36 || relY === 28 || relY === 74;

      if (isOuterPerimeter) {
        // Portão Principal do Quartel ao Norte (relY === 28, relX in [-1, 0, 1])
        if (relY === 28 && Math.abs(relX) <= 1) {
          if (relX === 0) {
            const isGateOpen = intState.opened !== undefined ? !!intState.opened : true;
            return {
              isSnowCity: true,
              role: "door",
              roomName: "Portão Principal do Quartel e Prisão Glacial",
              isDoor: true,
              isDoorOpen: isGateOpen,
              isWall: false,
              prop: {
                kind: "snow_city_door",
                opened: isGateOpen,
                interactive: true,
                namePt: isGateOpen
                  ? "Portão Fortificado do Quartel (Aberto)"
                  : "Portão Fortificado do Quartel (Fechado)",
                descriptionPt:
                  "Portão monumental de carvalho e barras de aço que dá acesso ao Grande Quartel Militar, Pátio da Forca e Prisão. Pressione [F] para abrir ou fechar.",
              },
            };
          }
          // Guaritas laterais da entrada com alabardas
          return {
            isSnowCity: true,
            role: "plaza",
            roomName: "Entrada do Quartel Militar",
          };
        }

        // Chaminés nas paredes externas das Salas dos Oficiais
        if (relY === 28 && (relX === -28 || relX === 28)) {
          return {
            isSnowCity: true,
            role: "chimney",
            roomName: "Chaminé do Quartel dos Oficiais",
            isWall: true,
            isChimney: true,
            prop: {
              kind: "snow_city_chimney",
              interactive: true,
              namePt: "Chaminé da Ala de Oficiais do Quartel",
              descriptionPt: "Chaminé militar aquecendo os gabinetes e salas de descanso dos oficiais.",
            },
          };
        }

        return {
          isSnowCity: true,
          role: "wall",
          roomName: "Muralha Fortificada do Quartel e Prisão",
          isWall: true,
          prop: {
            kind: "snow_city_wall",
            subType: 0,
            wallHeightState: 0,
            namePt: "Muralha Militar de Cantaria e Ferro",
            descriptionPt:
              "Muralha espessa de granito glacial reforçada com vigas e sentinelas que cerca o complexo do Quartel e Prisão.",
          },
        };
      }

      // 3.2 ALA NOROESTE: SALAS PARA OFICIAIS (relX in [-35..-14], relY in [29..45])
      if (relX >= -35 && relX <= -14 && relY >= 29 && relY <= 45) {
        // Parede Leste da Ala de Oficiais (separa do Pátio de Execução em relX === -14)
        if (relX === -14) {
          // Portas para o Pátio em relY === 33 e relY === 41
          if (relY === 33 || relY === 41) {
            const isDoorOpen = intState.opened !== undefined ? !!intState.opened : true;
            return {
              isSnowCity: true,
              role: "door",
              roomName: "Porta da Ala de Comando dos Oficiais",
              isDoor: true,
              isDoorOpen: isDoorOpen,
              isWall: false,
              prop: {
                kind: "snow_city_door",
                doorVertical: true,
                opened: isDoorOpen,
                interactive: true,
                namePt: isDoorOpen
                  ? "Porta da Ala de Oficiais (Aberta)"
                  : "Porta da Ala de Oficiais (Fechada)",
                descriptionPt: "Porta militar reforçada de carvalho e ferro que conecta o Pátio de Execução às Salas de Comando dos Oficiais.",
              },
            };
          }
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Parede da Ala de Oficiais",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 0, namePt: "Parede da Ala de Comando" },
          };
        }

        // Parede Sul da Ala de Oficiais (relY === 45)
        if (relY === 45) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Parede Divisória da Ala de Oficiais",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 0, namePt: "Parede da Ala de Comando" },
          };
        }

        // Divisórias internas da Ala de Oficiais:
        // - Parede horizontal em relY === 37 (com vãos de porta em relX === -30 e relX === -19)
        // - Parede vertical em relX === -25 de relY 29..37 (com vão em relY === 33)
        if (relY === 37 && relX !== -30 && relX !== -19) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Divisória das Salas de Oficiais",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 1, namePt: "Divisória Militar de Carvalho" },
          };
        }
        if (relX === -25 && relY >= 29 && relY <= 37 && relY !== 33) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Divisória do Gabinete do Comandante",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 1, namePt: "Divisória do Gabinete do Comandante" },
          };
        }

        // SALA 1 (Noroeste Superior): Gabinete do Comandante Supremo (relX in [-35..-26], relY in [29..36])
        if (relX <= -26 && relY <= 36) {
          const roomName = "Sala de Oficiais: Gabinete do Comandante do Quartel";
          if (relX === -28 && relY === 29) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_fireplace",
                interactive: true,
                namePt: "Lareira Oficial do Comandante",
                descriptionPt: "Lareira imponente de pedra aquecendo o gabinete de comando.",
              },
            };
          }
          if (relX === -31 && relY === 32) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              isCollider: true,
              prop: {
                kind: "barracks_officer_desk",
                subType: 0,
                interactive: true,
                namePt: "Mesa de Comando e Mapas Táticos do General",
                descriptionPt:
                  "Mesa de carvalho maciço com mapas de guerra dos Picos Glaciais, selos imperiais de cera vermelha, ordens de execução e candelabro dourado.",
              },
            };
          }
          if ((relX === -34 || relX === -32) && relY === 29) {
            const bKey = `${tx},${ty}`;
            const bState = interactedProps && interactedProps.get ? interactedProps.get(bKey) || {} : {};
            const taken = typeof bState.booksTaken === "number" ? bState.booksTaken : (bState.collected ? 4 : 0);
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "greek_bookshelf",
                subType: relX === -34 ? 1 : 3,
                scale: 1.15,
                interactive: true,
                collected: taken >= 4,
                booksTaken: taken,
                maxBooks: 4,
                namePt: "Estante de Registros Militares e Códigos de Guerra",
                descriptionPt: "Tomos encadernados em couro contendo relatórios de campanha e sentenças do tribunal militar. Pressione [F] para coletar!",
              },
            };
          }
          if (relX === -34 && relY === 35) {
            const opened = !!intState.opened;
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "chest",
                subType: 0,
                scale: 1.1,
                interactive: !opened,
                opened,
                namePt: opened ? "Cofre Militar do Comandante (Aberto)" : "Cofre de Ouro do Comandante",
                descriptionPt: "Arca encouraçada do comandante do quartel. Pressione [F] para abrir!",
              },
            };
          }
          if (relX === -27 && relY === 35) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "weapon_rack",
                scale: 1.15,
                interactive: true,
                namePt: "Suporte de Espadas e Alabardas Oficiais",
                descriptionPt: "Armas cerimoniais e de combate dos oficiais superiores.",
              },
            };
          }
          return { isSnowCity: true, role: "house_floor", roomName };
        }

        // SALA 2 (Nordeste da Ala Oeste): Sala de Estratégia e Guerra dos Oficiais (relX in [-24..-15], relY in [29..36])
        if (relX >= -24 && relY <= 36) {
          const roomName = "Sala de Oficiais: Salão de Estratégia e Conselho Militar";
          if (relX === -20 && relY === 32) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              isCollider: true,
              prop: {
                kind: "barracks_officer_desk",
                subType: 1,
                scale: 1.25,
                interactive: true,
                namePt: "Grande Mesa Tática de Operações Militares",
                descriptionPt: "Mesa de comando cercada por cadeiras de oficiais com miniaturas de tropas, mapas das fronteiras de gelo e planos de defesa.",
              },
            };
          }
          if ((relX === -23 || relX === -17) && relY === 29) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "weapon_rack",
                scale: 1.15,
                interactive: true,
                namePt: "Arsenal da Sala de Estratégia",
                descriptionPt: "Lanças, escudos e espadas de aço temperado da guarda de elite.",
              },
            };
          }
          if (relX === -23 && relY === 35) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_wardrobe",
                interactive: true,
                namePt: "Armário de Fardas e Insígnias de Oficiais",
                descriptionPt: "Guarda-roupa militar com sobretudos de lã pesada, dragonas douradas e medalhas.",
              },
            };
          }
          return { isSnowCity: true, role: "house_floor", roomName };
        }

        // SALA 3 (Sul da Ala Oeste): Sala de Administração Prisional e Interrogatório de Oficiais (relX in [-35..-15], relY in [38..44])
        const roomName = "Sala de Oficiais: Administração da Prisão e Tribunal";
        if (relX === -28 && relY === 41) {
          const hasKey = !!intState.collectedKey;
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "jailer_table",
              hasKey: !hasKey,
              scale: 1.2,
              interactive: true,
              namePt: "Mesa do Oficial Carcereiro-Chefe (Chaves da Prisão)",
              descriptionPt: hasKey
                ? "Mesa de registros de prisioneiros e sentenças de forca."
                : "Mesa do Oficial Carcereiro-Chefe com o Molho de Chaves Mestre da Prisão! Pressione [F] para pegar a Chave do Carcereiro.",
            },
          };
        }
        if (relX === -20 && relY === 41) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            isCollider: true,
            prop: {
              kind: "barracks_officer_desk",
              subType: 0,
              interactive: true,
              namePt: "Bancada do Tribunal Militar e Sentenças",
              descriptionPt: "Mesa onde os oficiais assinam os mandados para o Pátio da Forca e para a Solitária do Subsolo.",
            },
          };
        }
        if ((relX === -34 || relX === -16) && relY === 39) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "weapon_rack",
              scale: 1.15,
              interactive: true,
              namePt: "Armas da Guarda Prisional",
              descriptionPt: "Alabardas e correntes utilizadas pelos guardas do campo de prisioneiros.",
            },
          };
        }
        if (relX === -34 && relY === 43) {
          const opened = !!intState.opened;
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "chest",
              subType: 0,
              scale: 1.05,
              interactive: !opened,
              opened,
              namePt: opened ? "Baú de Pertences Confiscados (Aberto)" : "Baú de Pertences Confiscados",
              descriptionPt: "Baú contendo ouro e relíquias confiscadas dos prisioneiros ao chegarem ao quartel.",
            },
          };
        }
        return { isSnowCity: true, role: "house_floor", roomName };
      }

      // 3.3 ALA NORDESTE: SALAS DE DESCANSO PARA OFICIAIS (relX in [14..35], relY in [29..45])
      if (relX >= 14 && relX <= 35 && relY >= 29 && relY <= 45) {
        // Parede Oeste da Ala de Descanso (separa do Pátio de Execução em relX === 14)
        if (relX === 14) {
          if (relY === 33 || relY === 41) {
            const isDoorOpen = intState.opened !== undefined ? !!intState.opened : true;
            return {
              isSnowCity: true,
              role: "door",
              roomName: "Porta das Salas de Descanso dos Oficiais",
              isDoor: true,
              isDoorOpen: isDoorOpen,
              isWall: false,
              prop: {
                kind: "snow_city_door",
                doorVertical: true,
                opened: isDoorOpen,
                interactive: true,
                namePt: isDoorOpen
                  ? "Porta da Ala de Descanso dos Oficiais (Aberta)"
                  : "Porta da Ala de Descanso dos Oficiais (Fechada)",
                descriptionPt: "Porta de carvalho e ferro que conduz aos alojamentos aquecidos, salão de lazer e refeitório exclusivo dos oficiais.",
              },
            };
          }
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Parede da Ala de Descanso dos Oficiais",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 0, namePt: "Parede da Ala de Descanso" },
          };
        }

        // Parede Sul da Ala de Descanso (relY === 45)
        if (relY === 45) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Parede Sul da Ala de Descanso",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 0, namePt: "Parede da Ala de Descanso" },
          };
        }

        // Divisórias internas das Salas de Descanso de Oficiais:
        // - Parede horizontal em relY === 37 (com vãos em relX === 19 e relX === 30)
        // - Parede vertical em relX === 25 de relY 29..37 (com vão em relY === 33)
        if (relY === 37 && relX !== 19 && relX !== 30) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Divisória das Salas de Descanso",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 1, namePt: "Divisória de Madeira Nobre" },
          };
        }
        if (relX === 25 && relY >= 29 && relY <= 37 && relY !== 33) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Divisória do Dormitório de Oficiais",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 1, namePt: "Divisória do Dormitório" },
          };
        }

        // SALA DE DESCANSO 1 (Noroeste da Ala Leste): Salão de Convivência, Jogos e Lareira dos Oficiais (relX in [15..24], relY in [29..36])
        if (relX <= 24 && relY <= 36) {
          const roomName = "Sala de Descanso dos Oficiais: Salão de Lareira e Lazer";
          if (relX === 20 && relY === 29) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_fireplace",
                interactive: true,
                namePt: "Lareira da Sala de Descanso dos Oficiais",
                descriptionPt: "Lareira crepitante onde os oficiais descansam e bebem vinho quente após os turnos na neve.",
              },
            };
          }
          if ((relX === 18 || relX === 22) && relY === 32) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_sofa",
                interactive: true,
                namePt: "Poltrona de Couro e Peles dos Oficiais",
                descriptionPt: "Sofá macio de couro estofado exclusivo para o descanso da oficialidade.",
              },
            };
          }
          if (relX === 20 && relY === 32) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_table",
                interactive: true,
                namePt: "Mesa de Jogos, Xadrez e Hidromel dos Oficiais",
                descriptionPt: "Mesa de centro com tabuleiro de estratégia, taças de prata e garrafas de hidromel.",
              },
            };
          }
          if (relX === 16 && relY === 35) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_pantry",
                interactive: true,
                namePt: "Adega Particular e Reserva dos Oficiais",
                descriptionPt: "Estante abastecida com bebidas quentes, queijos curados e charutos.",
              },
            };
          }
          return { isSnowCity: true, role: "house_floor", roomName };
        }

        // SALA DE DESCANSO 2 (Nordeste da Ala Leste): Dormitório Nobre dos Oficiais (relX in [26..35], relY in [29..36])
        if (relX >= 26 && relY <= 36) {
          const roomName = "Sala de Descanso dos Oficiais: Dormitório Aquecido";
          if ((relX === 28 || relX === 33) && (relY === 30 || relY === 34)) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_bed",
                interactive: true,
                namePt: "Cama de Carvalho dos Oficiais com Peles de Urso",
                descriptionPt: "Leito confortável e aquecido reservado ao descanso dos capitães e tenentes do quartel.",
              },
            };
          }
          if ((relX === 27 || relX === 34) && relY === 32) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_nightstand",
                interactive: true,
                namePt: "Criado-Mudo de Oficial com Castiçal",
                descriptionPt: "Mesa de cabeceira com vela acesa e pertences pessoais.",
              },
            };
          }
          if (relX === 30 && relY === 29) {
            return {
              isSnowCity: true,
              role: "house_floor",
              roomName,
              prop: {
                kind: "snow_city_wardrobe",
                interactive: true,
                namePt: "Guarda-Roupa de Casacos e Mantas dos Oficiais",
                descriptionPt: "Armário de carvalho com uniformes de gala e capas térmicas.",
              },
            };
          }
          return { isSnowCity: true, role: "house_floor", roomName };
        }

        // SALA DE DESCANSO 3 (Sul da Ala Leste): Refeitório, Cozinha Quente e Banhos dos Oficiais (relX in [15..35], relY in [38..44])
        const roomName = "Sala de Descanso dos Oficiais: Refeitório, Cozinha e Banhos";
        if ((relX === 19 || relX === 24) && relY === 41) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_table",
              interactive: true,
              namePt: "Mesa de Banquete do Refeitório de Oficiais",
              descriptionPt: "Mesa farta com assados, pães quentes e caldos para os oficiais do quartel.",
            },
          };
        }
        if ((relX === 19 || relX === 24) && (relY === 40 || relY === 42)) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_sofa",
              interactive: true,
              namePt: "Banco Estofado do Refeitório Oficial",
              descriptionPt: "Assento acolchoado ao redor das mesas de refeição dos oficiais.",
            },
          };
        }
        if (relX === 29 && relY === 39) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_stove",
              interactive: true,
              namePt: "Fogão Industrial a Lenha dos Oficiais",
              descriptionPt: "Fogão de ferro fundido preparando refeições quentes para a oficialidade.",
            },
          };
        }
        if (relX === 31 && relY === 39) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_counter",
              interactive: true,
              namePt: "Bancada de Carnes e Mantimentos do Quartel",
              descriptionPt: "Bancada culinária abastecida com carnes de caça e especiarias.",
            },
          };
        }
        if (relX === 34 && relY === 40) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_pantry",
              interactive: true,
              namePt: "Despensa de Provisões dos Oficiais",
              descriptionPt: "Prateleiras cheias de suprimentos nobres do quartel.",
            },
          };
        }
        if (relX === 33 && relY === 43) {
          return {
            isSnowCity: true,
            role: "house_floor",
            roomName,
            prop: {
              kind: "snow_city_bathtub",
              interactive: true,
              namePt: "Tina de Banho Quente dos Oficiais",
              descriptionPt: "Banheira térmica de cedro com água fumegante para relaxamento dos oficiais.",
            },
          };
        }
        return { isSnowCity: true, role: "house_floor", roomName };
      }

      // 3.4 PÁTIO CENTRAL DE EXECUÇÃO COM FORCA (relX in [-13..+13], relY in [29..45])
      if (relX >= -13 && relX <= 13 && relY >= 29 && relY <= 45) {
        const roomName = "Pátio de Execução com Forca (Quartel Militar)";

        // No centro do Pátio (relX in [-2..+2], relY in [35..39]): Palanque de Madeira e Forca!
        if (Math.abs(relX) <= 2 && relY >= 35 && relY <= 39) {
          if (relX === 0 && relY === 37) {
            return {
              isSnowCity: true,
              role: "gallows_platform",
              roomName: "Cadafalso e Forca do Pátio de Execução",
              isCollider: true,
              prop: {
                kind: "barracks_gallows",
                scale: 1.35,
                interactive: true,
                namePt: "Forca de Execução do Quartel Militar",
                descriptionPt:
                  "Palanque elevado de madeira escura com alçapão de ferro, trave dupla maciça e laços de corda de cânhamo balançando ao vento gelado no centro do Pátio de Execução.",
              },
            };
          }
          // Piso do palanque de madeira ao redor da trave da forca
          return {
            isSnowCity: true,
            role: "gallows_platform",
            roomName: "Palanque de Madeira da Forca",
          };
        }

        // Bancos de observação e armas de guarda nas bordas do Pátio de Execução
        if ((relX === -6 || relX === 6) && (relY === 34 || relY === 40)) {
          return {
            isSnowCity: true,
            role: "plaza",
            roomName,
            isCollider: true,
            prop: {
              kind: "snow_city_lamppost",
              interactive: true,
              namePt: "Poste de Ferro do Pátio de Execução",
              descriptionPt: "Lampião militar iluminando o cadafalso e a forca durante as execuções noturnas.",
            },
          };
        }
        if ((relX === -10 || relX === 10) && relY === 37) {
          return {
            isSnowCity: true,
            role: "plaza",
            roomName,
            prop: {
              kind: "hanging_cage",
              scale: 1.2,
              interactive: true,
              namePt: "Gaiola de Ferro Suspensa no Pátio de Execução",
              descriptionPt: "Gaiola pendurada como aviso sombrio aos insurgentes e prisioneiros do quartel.",
            },
          };
        }

        return {
          isSnowCity: true,
          role: "plaza",
          roomName,
        };
      }

      // 3.5 ALA DE PRISÃO: GRANDES CELAS COLETIVAS TIPO CAMPO DE CONCENTRAÇÃO (relY in [46..73])
      // Parede divisória entre o Pátio de Execução e o Pavilhão de Concentração em relY === 46
      if (relY === 46) {
        if (Math.abs(relX) <= 1) {
          if (relX === 0) {
            const isOpen = intState.opened !== undefined ? !!intState.opened : true;
            return {
              isSnowCity: true,
              role: "door",
              roomName: "Portão de Grades do Campo de Concentração",
              isDoor: true,
              isDoorOpen: isOpen,
              isWall: false,
              prop: {
                kind: "iron_bars_gate",
                doorVertical: false,
                defaultOpened: true,
                unlocked: true,
                opened: isOpen,
                interactive: true,
                namePt: isOpen
                  ? "Portão de Ferro do Pavilhão de Prisioneiros (Aberto)"
                  : "Portão de Ferro do Pavilhão de Prisioneiros (Fechado)",
                descriptionPt: "Grades pesadas de ferro separando o Pátio da Forca dos grandes blocos de celas coletivas.",
              },
            };
          }
          return {
            isSnowCity: true,
            role: "road",
            roomName: "Passagem para as Grandes Celas de Concentração",
          };
        }
        return {
          isSnowCity: true,
          role: "wall",
          roomName: "Muralha Interna da Prisão",
          isWall: true,
          prop: { kind: "snow_city_wall", subType: 0, namePt: "Muralha da Ala de Prisão" },
        };
      }

      // Corredor Central de Vigilância da Prisão (relX in [-3..+3], relY in [47..73])
      if (relX >= -3 && relX <= 3 && relY >= 47 && relY <= 73) {
        // ESCADARIA PARA O SUBSOLO (SALA DE TORTURA E SOLITÁRIA) em (relX === 0, relY === 51)!
        if (relX === 0 && relY === 51) {
          return {
            isSnowCity: true,
            role: "plaza",
            roomName: "Escadaria para o Subsolo da Prisão (Sala de Tortura e Solitárias)",
            prop: {
              kind: "cave_entrance",
              subType: 2,
              isStaircase: true,
              isBarracksStaircase: true,
              offsetX: 0,
              offsetY: -4,
              scale: 1.4,
              interactive: true,
              namePt: "Escadaria para o Subsolo (Sala de Tortura e Solitárias)",
              descriptionPt:
                "Escadaria sombria de pedra e ferro que desce para o Subsolo do Quartel: Câmara de Tortura, Interrogatório e Celas Solitárias! Pressione [F] para descer.",
            },
          };
        }

        // Postos de guarda e tochas no corredor central das celas
        if ((relX === -2 || relX === 2) && (relY === 49 || relY === 59 || relY === 69)) {
          return {
            isSnowCity: true,
            role: "road",
            roomName: "Corredor de Vigilância do Campo de Prisioneiros",
            prop: {
              kind: "corridor_torch",
              lit: true,
              interactive: false,
              namePt: "Tocha de Vigilância da Prisão",
              descriptionPt: "Tocha acesa iluminando o corredor entre as grandes celas coletivas.",
            },
          };
        }

        return {
          isSnowCity: true,
          role: "road",
          roomName: "Corredor Central da Prisão (Acesso às Grandes Celas e ao Subsolo)",
        };
      }

      // Paredes de Grades e Portões das 4 Grandes Celas Coletivas (em relX === -4 e relX === +4)
      if (relX === -4 || relX === 4) {
        // Portões das 4 grandes celas coletivas em relY === 53 (Bloco I e II) e relY === 66 (Bloco III e IV)
        if (relY === 53 || relY === 66) {
          const isOpen = intState.opened !== undefined ? !!intState.opened : false;
          const blockNum = relY === 53 ? (relX < 0 ? "I (Noroeste)" : "II (Nordeste)") : (relX < 0 ? "III (Sudoeste)" : "IV (Sudeste)");
          return {
            isSnowCity: true,
            role: "door",
            roomName: `Portão da Grande Cela Coletiva — Bloco ${blockNum}`,
            isDoor: true,
            isDoorOpen: isOpen,
            isWall: false,
            prop: {
              kind: "iron_bars_gate",
              doorVertical: true,
              defaultOpened: true,
              unlocked: true,
              opened: isOpen,
              interactive: true,
              namePt: isOpen
                ? `Portão da Grande Cela Coletiva ${blockNum} (Aberto)`
                : `Portão da Grande Cela Coletiva ${blockNum} (Fechado)`,
              descriptionPt:
                "Pesado portão de grades de ferro do pavilhão de concentração de prisioneiros. Pressione [F] para abrir ou fechar!",
            },
          };
        }

        // Demais blocos em relX === -4 ou +4: Grades de ferro fechadas para dar visão de toda a cela gigante!
        if (relY === 60) {
          return {
            isSnowCity: true,
            role: "wall",
            roomName: "Pilar de Contenção da Cela",
            isWall: true,
            prop: { kind: "snow_city_wall", subType: 0, namePt: "Pilar de Pedra da Prisão" },
          };
        }
        return {
          isSnowCity: true,
          role: "prison_floor",
          roomName: "Gradeamento de Ferro da Grande Cela Coletiva",
          isCollider: true,
          prop: {
            kind: "iron_bars_gate",
            doorVertical: true,
            opened: false,
            interactive: false,
            namePt: "Grades de Ferro do Campo de Prisioneiros",
            descriptionPt: "Grades maciças de ferro que confinam as dezenas de prisioneiros nas grandes celas coletivas.",
          },
        };
      }

      // Parede divisória horizontal entre os Blocos Superiores (I/II) e Inferiores (III/IV) em relY === 60
      if (relY === 60) {
        return {
          isSnowCity: true,
          role: "wall",
          roomName: "Muralha Divisória dos Pavilhões de Concentração",
          isWall: true,
          prop: { kind: "snow_city_wall", subType: 0, namePt: "Muralha Divisória das Grandes Celas" },
        };
      }

      // INTERIOR DAS 4 GRANDES CELAS COLETIVAS TIPO CAMPO DE CONCENTRAÇÃO:
      // Cada cela tem 31 x 12 blocos (relX in [-35..-5] ou [5..35], relY in [47..59] ou [61..73])!
      const isWestCell = relX < 0;
      const isNorthCell = relY < 60;
      const cellBlockName = isNorthCell
        ? (isWestCell ? "Grande Cela Coletiva — Pavilhão I (Campo de Concentração Oeste)" : "Grande Cela Coletiva — Pavilhão II (Campo de Concentração Leste)")
        : (isWestCell ? "Grande Cela Coletiva — Pavilhão III (Campo de Concentração Sudoeste)" : "Grande Cela Coletiva — Pavilhão IV (Campo de Concentração Sudeste)");

      // Fileiras de beliches triplos de madeira bruta (tipo barraca de campo de concentração!)
      const bunkCols = isWestCell ? [-32, -26, -20, -14, -9] : [9, 14, 20, 26, 32];
      const bunkRows = isNorthCell ? [49, 53, 57] : [63, 67, 71];

      if (bunkCols.includes(relX) && bunkRows.includes(relY)) {
        return {
          isSnowCity: true,
          role: "prison_floor",
          roomName: cellBlockName,
          isCollider: true,
          prop: {
            kind: "prison_bunk_bed",
            interactive: true,
            namePt: "Beliche Coletivo de Madeira Bruta (Campo de Prisioneiros)",
            descriptionPt:
              "Beliche triplo de tábuas ásperas e palha fria onde dezenas de prisioneiros dormem amontoados nas grandes celas do quartel.",
          },
        };
      }

      // Montes de palha úmida, ossadas acorrentadas e latrinas coletivas nos cantos das grandes celas
      if ((relX === -34 || relX === 34) && (relY === 48 || relY === 62)) {
        return {
          isSnowCity: true,
          role: "prison_floor",
          roomName: cellBlockName,
          prop: {
            kind: "dungeon_latrine_bench",
            interactive: true,
            namePt: "Latrina Coletiva do Pavilhão de Prisioneiros",
            descriptionPt: "Vala sanitária rústica de pedra no canto da grande cela coletiva.",
          },
        };
      }
      if ((relX === -34 || relX === 34) && (relY === 58 || relY === 72)) {
        return {
          isSnowCity: true,
          role: "prison_floor",
          roomName: cellBlockName,
          prop: {
            kind: "dungeon_skeleton",
            interactive: true,
            namePt: "Prisioneiro Acorrentado nas Grades",
            descriptionPt: "Restos mortais de um prisioneiro que não resistiu ao inverno rigoroso na grande cela.",
          },
        };
      }
      if ((relX === -11 || relX === 11) && (relY === 51 || relY === 69)) {
        return {
          isSnowCity: true,
          role: "prison_floor",
          roomName: cellBlockName,
          prop: {
            kind: "dungeon_straw",
            interactive: true,
            namePt: "Palha Suja de Prisioneiros",
            descriptionPt: "Forragem úmida espalhada pelo chão de concreto frio da grande cela.",
          },
        };
      }

      return {
        isSnowCity: true,
        role: "prison_floor",
        roomName: cellBlockName,
      };
    }

    // =====================================================================
    // 4. EXTERIOR AO LADO DA PRISÃO (LESTE DO QUARTEL, relX >= 37):
    //    - Grande Entrada da Mina Profunda das Neves em (relX === 46, relY === 56)
    //    - Grande Monte de Terra da Escavação (SEM NEVE) ao lado da entrada da mina
    //      (centrado em relX === 58, relY === 57, cobrindo ~11x9 blocos de terra escavada!)
    //    - Caminho de acesso ligando a rua/quartel até a boca da mina
    // =====================================================================
    if (relX >= 37 && relX <= 68 && relY >= 12 && relY <= 68) {
      // 4.1 Grande Entrada da Mina Profunda das Neves (relX === 46, relY === 56)
      if (relX === 46 && relY === 56) {
        return {
          isSnowCity: true,
          role: "excavated_dirt",
          roomName: "Mina Profunda da Prisão",
          prop: {
            kind: "cave_entrance",
            subType: 0,
            isMerged: true,
            mergedCount: 4,
            isPrisonDeepMine: true,
            isExcavatorMine: true,
            offsetX: 0,
            offsetY: -4,
            scale: 1.95,
            interactive: true,
            namePt: "Mina Profunda das Neves",
            descriptionPt:
              "Uma colossal entrada de mina escavada na rocha nevada ao lado da prisão, descendo para longos túneis subterrâneos de terra. Pressione [F] para entrar!",
          },
        };
      }

      // 4.2 Clarea a área imediata ao redor da boca gigante da mina (terra batida sem árvores/obstáculos)
      const distToMine = Math.hypot(relX - 46, (relY - 56) * 1.15);
      if (distToMine <= 4.6) {
        return {
          isSnowCity: true,
          role: "excavated_dirt",
          roomName: "Mina Profunda da Prisão",
        };
      }

      // 4.3 Grande Monte de Terra ao lado da mina (terra pura de escavação, SEM NEVE e sem título!)
      // Centrado em (relX = 57, relY = 57), espalhando-se de relX 51..63 e relY 52..62
      const moundDx = (relX - 57) / 6.2;
      const moundDy = (relY - 57) / 4.8;
      const moundDist = Math.hypot(moundDx, moundDy);
      if (moundDist <= 1.05) {
        // Centro do monte de terra: grande elevação 2.5D de terra escavada (com colisor nos blocos centrais do monte)
        if (relX === 57 && relY === 57) {
          return {
            isSnowCity: true,
            role: "excavated_dirt",
            roomName: "",
            isCollider: true,
            prop: {
              kind: "excavated_dirt_mound",
              subType: 0,
              scale: 1.5,
              interactive: false,
            },
          };
        }
        // Dunas secundárias do mesmo monte de terra para deixá-lo largo, volumoso e orgânico
        if ((relX === 54 && relY === 56) || (relX === 60 && relY === 58) || (relX === 56 && relY === 59)) {
          return {
            isSnowCity: true,
            role: "excavated_dirt",
            roomName: "",
            isCollider: true,
            prop: {
              kind: "excavated_dirt_mound",
              subType: relX === 54 ? 1 : 2,
              scale: 1.15,
              interactive: false,
            },
          };
        }
        const isCoreCollider = Math.abs(relX - 57) <= 3 && Math.abs(relY - 57) <= 2;
        return {
          isSnowCity: true,
          role: "excavated_dirt",
          roomName: "",
          isCollider: isCoreCollider,
        };
      }

      // Trilha de terra/pedra que contorna a muralha leste do quartel/prisão até a entrada da mina
      const isMineTrail =
        (relX >= 40 && relX <= 43 && relY >= 12 && relY <= 59) ||
        (relX >= 40 && relX <= 51 && relY >= 57 && relY <= 60);
      if (isMineTrail) {
        return {
          isSnowCity: true,
          role: relY <= 28 ? "road" : "excavated_dirt",
          roomName: "Acesso Externo da Mina Profunda",
        };
      }
    }

    // Estrada militar externa ligando o Portão Principal do Quartel (relX = 0, relY = 26..27) até a Trilha da Mina a Leste (relX = 41..43)
    if (relX >= 0 && relX <= 43 && (relY === 26 || relY === 27)) {
      return {
        isSnowCity: true,
        role: "road",
        roomName: "Estrada Militar do Quartel para a Mina",
      };
    }

    // - BECOS COM SAÍDA (vielas estreitas que atravessam o quarteirão de um lado ao outro):
    //   1. Beco do Norte-Oeste (X = -8, Y de -24 até -12): passa entre a Casa #3 e a Casa #4 até a borda norte!
    //   2. Beco Central-Oeste (X = -33..-32, Y de -12 até +4): liga a Rua Norte ao pátio lateral entre as Casas #8 e #9!
    //   3. Beco Centro-Leste (X = 27..28, Y de +4 até +12): atravessa entre as Casas #18 e #19 até a Rua Sul!
    //   4. Beco Sul-Leste (X = 16..17, Y de +12 até +24): atravessa entre as Casas #23 e #24 até a saída sul!
    const isThroughAlley =
      (relX === -8 && relY >= -24 && relY <= -11) ||
      ((relX === -33 || relX === -32) && relY >= -12 && relY <= -1) ||
      ((relX === 27 || relX === 28) && relY >= 0 && relY <= 12) ||
      ((relX === 16 || relX === 17) && relY >= 11 && relY <= 24);

    // - BECOS SEM SAÍDA (vielas estreitas fechadas no fundo entre duas casas!):
    //   1. Beco sem saída Noroeste (X = -31..-30, Y de -19 até -12, fechado ao norte em Y = -20): entre Casa #1 e Casa #2!
    //   2. Beco sem saída Nordeste (X = 29, Y de -19 até -12, fechado ao norte): entre Casa #6 e Casa #7!
    //   3. Beco sem saída Centro-Leste (X = 16..17, Y de -12 até -5, fechado ao sul pela parede/fundo): entre Casa #11 e Casa #12!
    //   4. Beco sem saída Centro-Oeste (X = -18, Y de +5 até +12, fechado ao norte): entre Casa #15 e Casa #16!
    //   5. Beco sem saída Sudoeste (X = -29..-28, Y de +12 até +20, fechado ao sul): entre Casa #20 e Casa #21!
    const isDeadEndAlley =
      ((relX === -31 || relX === -30) && relY >= -19 && relY <= -11) ||
      (relX === 29 && relY >= -19 && relY <= -11) ||
      ((relX === 16 || relX === 17) && relY >= -12 && relY <= -5) ||
      (relX === -18 && relY >= 5 && relY <= 12) ||
      ((relX === -29 || relX === -28) && relY >= 11 && relY <= 20);

    // - Entradas de calçada automáticas ligando a porta de cada casa do centro pavimentado até a rua principal!
    //   (As casas espalhadas ao redor do centro pavimentado ficam diretamente sobre a neve, estilo Deserto!)
    let isHouseDoorStep = false;
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      if (h.isScattered) continue;
      const doorY = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
      const dirY = h.doorOnSouth ? 1 : -1;
      const stepDist = (ty - doorY) * dirY;
      if (Math.abs(tx - h.cx) <= 1 && stepDist >= 1 && stepDist <= 5) {
        isHouseDoorStep = true;
        break;
      }
    }

    if (
      isMainDualSidedStreet ||
      isNorthPlazaConnector ||
      isSouthPlazaConnector ||
      isThroughAlley ||
      isDeadEndAlley ||
      isHouseDoorStep
    ) {
      // No fundo dos becos sem saída, adiciona pequenos detalhes ou mantém o piso de paralelepípedo
      const isCornerLamp =
        (relX === -4 && relY === -10) ||
        (relX === 4 && relY === -10) ||
        (relX === -4 && relY === 10) ||
        (relX === 4 && relY === 10) ||
        (relX === -32 && relY === -12) ||
        (relX === 28 && relY === 12);

      if (isCornerLamp) {
        return {
          isSnowCity: true,
          role: "road",
          roomName: "Esquina da Rua de Paralelepípedos",
          isCollider: true,
          prop: {
            kind: "snow_city_lamppost",
            interactive: true,
            namePt: "Lampião de Esquina em Paralelepípedo",
            descriptionPt: "Lanterna de ferro fundido iluminando as ruas e entradas de becos da vila.",
          },
        };
      }

      return {
        isSnowCity: true,
        role: (isNorthPlazaConnector || isSouthPlazaConnector) && absX <= 2 && absY <= 10 ? "plaza" : "road",
        roomName: isDeadEndAlley
          ? "Beco Sem Saída de Paralelepípedos"
          : isThroughAlley
            ? "Beco Estreito de Passagem"
            : "Rua de Paralelepípedos da Vila Glacial",
      };
    }

    return null;
  }

  // =========================================================================
  // SUBSOLO DO QUARTEL E PRISÃO (SALA DE TORTURA E CELAS SOLITÁRIAS)
  // Centrado na escadaria em (BARRACKS_STAIR_TX, BARRACKS_STAIR_TY) = (CITY_CX, CITY_CY + 51).
  // Contém:
  //   1. Vestíbulo da Escadaria de Retorno ao Quartel (dx in [-3..+3], dy in [-3..+3])
  //   2. Grande Sala de Tortura e Interrogatório no Subsolo (dx in [-14..+14], dy in [4..18])
  //      - Cavaletes de Estiramento (torture_rack), Donzelas de Ferro (iron_maiden),
  //        Braseiros com Ferros em Brasa (torture_brazier), Mesas de Instrumentos (torture_tools),
  //        Gaiolas Suspensas (hanging_cage), Esqueletos Acorrentados e Baú do Carrasco.
  //   3. Ala das Celas Solitárias no Subsolo (dy in [19..38]):
  //      - Corredor Escuro de Isolamento (dx in [-2..+2], dy in [19..38])
  //      - 8 Celas Solitárias Individuais (4 à esquerda e 4 à direita, minúsculas e escuras,
  //        fechadas com portas de ferro/grades, cama de pedra/palha e grilhões)
  //      - 1 Solitária de Segurança Máxima ("O Fosso Gelado") no fundo sul (dy in [39..45])
  // =========================================================================
  function getUndergroundCellAt(tx, ty, interactedProps) {
    // =====================================================================
    // A. GRANDE MINA PROFUNDA EM ESPINHA DE PEIXE (Ao lado de fora da Prisão)
    //    - Entrada na superfície em (PRISON_MINE_TX, PRISON_MINE_TY) = (CITY_CX + 46, CITY_CY + 56)
    //    - Apenas túneis longos de terra (espinha dorsal central + várias costelas laterais longas)
    //    - Sem trilhos, sem água, sem minerais, sem cristais, sem cogumelos!
    // =====================================================================
    const mx = tx - PRISON_MINE_TX;
    const my = ty - PRISON_MINE_TY;
    if (mx >= -34 && mx <= 34 && my >= -6 && my <= 156) {
      // Ponto exato da Saída da Mina Profunda de volta para a superfície ao lado da Prisão
      if (mx === 0 && my === 0) {
        return {
          role: "prison_mine_exit",
          targetTx: PRISON_MINE_TX,
          targetTy: PRISON_MINE_TY,
          roomName: "Mina Profunda de Terra",
        };
      }

      // 1. VESTÍBULO DE ENTRADA DA MINA (mx in [-3..+3], my in [-3..+3])
      const inEntryChamber = Math.abs(mx) <= 3 && my >= -3 && my <= 3;

      // 2. TÚNEL CENTRAL PRINCIPAL ("A ESPINHA DORSAL" — longo túnel vertical de terra: my de -3 até +150, largura 3..5 blocos)
      // Leve sinuosidade natural de escavação em terra (oscila -1, 0 ou +1)
      const spineShift = my <= 4 ? 0 : Math.round(Math.sin(my * 0.08) * 1.0);
      const inMainSpine = my >= -3 && my <= 150 && Math.abs(mx - spineShift) <= 2;

      // 3. TÚNEIS LATERAIS LONGOS ("COSTELAS DA ESPINHA" — 9 pares de longas galerias horizontais de terra escavadas a cada 15 blocos!)
      // Costelas em my = 14, 29, 44, 59, 74, 89, 104, 119, 134, 146
      const ribCenters = [14, 29, 44, 59, 74, 89, 104, 119, 134, 146];
      let inRibTunnel = false;
      let inSubBranch = false;
      for (let i = 0; i < ribCenters.length; i++) {
        const ry = ribCenters[i];
        // Comprimento variável porém sempre longo de cada túnel lateral (entre 24 e 31 blocos para cada lado!)
        const leftLen = 25 + ((i * 3) % 7);  // -25 a -31
        const rightLen = 26 + ((i * 5) % 6); // +26 a +31
        // Leve inclinação orgânica ao longo da costela
        const ribYOffset = Math.abs(mx) <= 4 ? 0 : Math.round(Math.sin(mx * 0.11 + i) * 0.8);
        if (mx >= -leftLen && mx <= rightLen && Math.abs(my - (ry + ribYOffset)) <= 1) {
          inRibTunnel = true;
          break;
        }
        // Pequenos sub-ramos verticais curtos nas pontas de algumas costelas para acentuar o formato de espinha
        const tipLeftX = -leftLen + 5;
        const tipRightX = rightLen - 5;
        if (
          (Math.abs(mx - tipLeftX) <= 1 || Math.abs(mx - tipRightX) <= 1) &&
          Math.abs(my - ry) <= 4
        ) {
          inSubBranch = true;
        }
      }

      if (inEntryChamber || inMainSpine || inRibTunnel || inSubBranch) {
        // Verifica se este ponto do túnel tem uma tocha acesa presa na parede de terra:
        // 1. No vestíbulo de entrada (mx === -3 ou +3, my === -2 ou +2)
        // 2. Ao longo do túnel central da espinha (nas bordas laterais a cada 7 blocos, fora do cruzamento das costelas)
        // 3. Ao longo dos túneis laterais das costelas (na borda norte do túnel a cada 7 blocos)
        let hasTorch = false;
        if (inEntryChamber && (mx === -3 || mx === 3) && (my === -2 || my === 2)) {
          hasTorch = true;
        } else if (
          inMainSpine &&
          !inRibTunnel &&
          Math.abs(mx - spineShift) === 2 &&
          my >= 6 &&
          my <= 148 &&
          my % 7 === 0
        ) {
          hasTorch = true;
        } else if (inRibTunnel && !inMainSpine && Math.abs(mx) >= 6 && Math.abs(mx) % 7 === 0) {
          for (let i = 0; i < ribCenters.length; i++) {
            const ry = ribCenters[i];
            const ribYOffset = Math.abs(mx) <= 4 ? 0 : Math.round(Math.sin(mx * 0.11 + i) * 0.8);
            if (my === ry + ribYOffset - 1) {
              hasTorch = true;
              break;
            }
          }
        }

        return {
          role: "earth_mine_floor",
          hasTorch,
          roomName: "Túnel de Terra da Mina Profunda",
        };
      }

      // Tudo ao redor dos túneis da espinha é parede maciça de terra escavada!
      return {
        role: "earth_mine_wall",
        roomName: "Parede de Terra da Mina Profunda",
      };
    }

    const dx = tx - BARRACKS_STAIR_TX;
    const dy = ty - BARRACKS_STAIR_TY;

    if (dx < -15 || dx > 15 || dy < -4 || dy > 46) return null;

    const pKey = `underground_${tx},${ty}`;
    const intState =
      interactedProps && interactedProps.get
        ? interactedProps.get(pKey) || interactedProps.get(`dungeon_${tx},${ty}`) || interactedProps.get(`${tx},${ty}`) || {}
        : {};

    // 1. VESTÍBULO DA ESCADARIA DO QUARTEL (dx in [-4..+4], dy in [-4..+3])
    if (dy >= -4 && dy <= 3) {
      if (dx < -4 || dx > 4) return null;
      if (dy === -4 || dx === -4 || dx === 4 || (dy === 3 && Math.abs(dx) > 1)) {
        return { role: "dungeon_wall", roomName: "Muralha do Subsolo do Quartel" };
      }
      if (dx === 0 && dy === 0) {
        return {
          role: "barracks_stair_exit",
          targetTx: BARRACKS_STAIR_TX,
          targetTy: BARRACKS_STAIR_TY,
          roomName: "Escadaria de Subida para o Quartel e Prisão",
        };
      }
      if ((dx === -2 || dx === 2) && dy === -2) {
        return { role: "corridor_torch", lit: true, roomName: "Vestíbulo Subterrâneo do Quartel" };
      }
      return { role: "dungeon_floor", roomName: "Vestíbulo Subterrâneo do Quartel" };
    }

    // 2. GRANDE SALA DE TORTURA DO SUBSOLO (dx in [-14..+14], dy in [4..18])
    if (dy >= 4 && dy <= 18) {
      if (dx < -14 || dx > 14) return null;

      // Paredes externas da Sala de Tortura
      if (dx === -14 || dx === 14 || (dy === 4 && Math.abs(dx) > 1) || (dy === 18 && Math.abs(dx) > 1)) {
        return { role: "dungeon_wall", roomName: "Muralha da Grande Sala de Tortura" };
      }

      // Porta de entrada da Sala de Tortura (dy === 4, dx === 0) e saída para a Ala das Solitárias (dy === 18, dx === 0)
      if ((dy === 4 || dy === 18) && dx === 0) {
        const isOpen = intState.opened !== undefined ? !!intState.opened : true;
        return {
          role: "dungeon_door",
          doorVertical: false,
          defaultOpened: true,
          opened: isOpen,
          roomName: dy === 4 ? "Porta da Sala de Tortura do Subsolo" : "Porta para o Corredor das Solitárias",
        };
      }

      const roomName = "Sala de Tortura do Subsolo (Quartel Militar)";

      // Equipamentos de Tortura distribuídos na grande câmara:
      // - 2 Cavaletes de Estiramento (torture_rack)
      if ((dx === -7 || dx === 7) && dy === 8) {
        return { role: "torture_rack", roomName };
      }
      // - 2 Donzelas de Ferro (iron_maiden)
      if ((dx === -11 || dx === 11) && dy === 6) {
        return { role: "iron_maiden", roomName };
      }
      // - 2 Braseiros de Tortura com Ferros em Brasa (torture_brazier)
      if ((dx === -4 || dx === 4) && dy === 11) {
        return { role: "torture_brazier", roomName };
      }
      // - 2 Mesas de Instrumentos de Suplício (torture_tools)
      if ((dx === -7 || dx === 7) && dy === 14) {
        return { role: "torture_tools", roomName };
      }
      // - 4 Gaiolas de Ferro Suspensas (hanging_cage)
      if ((dx === -11 || dx === 11) && (dy === 11 || dy === 15)) {
        return { role: "hanging_cage", roomName };
      }
      // - Ossadas acorrentadas nas paredes e baú do inquisidor
      if ((dx === -12 || dx === 12) && dy === 17) {
        return { role: "dungeon_skeleton", roomName };
      }
      if (dx === -12 && dy === 9) {
        return { role: "weapon_rack", roomName };
      }
      if (dx === 12 && dy === 9) {
        return { role: "chest", opened: !!intState.opened, roomName };
      }
      if ((dx === -3 || dx === 3) && (dy === 6 || dy === 16)) {
        return { role: "corridor_torch", lit: true, roomName };
      }

      return { role: "torture_floor", roomName };
    }

    // 3. ALA DAS CELAS SOLITÁRIAS NO SUBSOLO (dx in [-9..+9], dy in [19..45])
    if (dy >= 19 && dy <= 45) {
      if (dx < -9 || dx > 9) return null;

      // Muralhas externas laterais e final sul
      if (dx === -9 || dx === 9 || dy === 45) {
        return { role: "dungeon_wall", roomName: "Muralha das Celas Solitárias" };
      }

      // 3.1 SOLITÁRIA DE SEGURANÇA MÁXIMA AO FUNDO SUL ("O Fosso Solitário", dy in [39..44], dx in [-8..+8])
      if (dy >= 39) {
        if (dy === 39) {
          if (dx === 0) {
            const isOpen = intState.opened !== undefined ? !!intState.opened : false;
            return {
              role: "iron_bars_gate",
              doorVertical: false,
              defaultOpened: true,
              unlocked: true,
              opened: isOpen,
              roomName: "Portão Blindado da Solitária Máxima (O Fosso)",
            };
          }
          return { role: "dungeon_wall", roomName: "Parede da Solitária Máxima" };
        }
        // Paredes laterais para deixar a solitária central estreita e claustrofóbica (dx in [-4..+4])
        if (Math.abs(dx) >= 5) {
          return { role: "dungeon_wall", roomName: "Rocha Maciça de Isolamento" };
        }
        const roomName = "Solitária de Segurança Máxima (Subsolo da Prisão)";
        if (dx === 0 && dy === 42) return { role: "hanging_cage", roomName };
        if (dx === -3 && dy === 43) return { role: "dungeon_skeleton", roomName };
        if (dx === 3 && dy === 43) return { role: "dungeon_straw", roomName };
        if (dx === 0 && dy === 44) return { role: "chest", opened: !!intState.opened, roomName };
        return { role: "cell_floor", roomName };
      }

      // 3.2 CORREDOR CENTRAL DAS SOLITÁRIAS (dx in [-2..+2], dy in [19..38])
      if (dx >= -2 && dx <= 2) {
        if ((dx === -1 || dx === 1) && (dy === 21 || dy === 29 || dy === 37)) {
          return {
            role: "corridor_torch",
            lit: true,
            roomName: "Corredor das Celas Solitárias (Subsolo)",
          };
        }
        return {
          role: "dungeon_floor",
          roomName: "Corredor das Celas Solitárias (Subsolo)",
        };
      }

      // 3.3 8 CELAS SOLITÁRIAS INDIVIDUAIS (4 a Oeste: dx in [-8..-3], 4 a Leste: dx in [3..8])
      // Divididas por paredes horizontais em dy === 19, 24, 29, 34, 39 (cada solitária tem 4 blocos de altura interna!)
      if (dy === 19 || dy === 24 || dy === 29 || dy === 34) {
        return { role: "dungeon_wall", roomName: "Parede de Isolamento da Solitária" };
      }

      const cellRow = Math.floor((dy - 19) / 5); // 0, 1, 2, 3
      const isLeft = dx < 0;
      const solitaryNumber = cellRow * 2 + (isLeft ? 1 : 2);
      const roomName = `Cela Solitária #${solitaryNumber} (Isolamento Total no Subsolo)`;
      const doorDy = 19 + cellRow * 5 + 2; // centro de cada solitária (21, 26, 31, 36)

      // Parede frontal de cada Solitária (dx === -3 ou dx === +3)
      if (dx === -3 || dx === 3) {
        if (dy === doorDy) {
          const isOpen = intState.opened !== undefined ? !!intState.opened : false;
          return {
            role: "iron_bars_gate",
            doorVertical: true,
            defaultOpened: true,
            unlocked: true,
            opened: isOpen,
            roomName: `Porta de Ferro da Cela Solitária #${solitaryNumber}`,
          };
        }
        return { role: "dungeon_wall", roomName: `Parede da Cela Solitária #${solitaryNumber}` };
      }

      // Interior claustrofóbico de cada Cela Solitária (dx in [-8..-4] ou [4..8])
      const farX = isLeft ? -7 : 7;
      const cornerX = isLeft ? -8 : 8;
      if (dx === farX && dy === doorDy - 1) {
        return { role: "dungeon_straw", roomName };
      }
      if (dx === cornerX && dy === doorDy + 1) {
        return {
          role: solitaryNumber % 2 === 0 ? "dungeon_skeleton" : "dungeon_latrine_bench",
          roomName,
        };
      }

      return { role: "cell_floor", roomName };
    }

    return null;
  }

  // Verifica se o ponto subterrâneo pertence à região da Grande Mina Profunda de Terra (ao leste da Prisão)
  // Usado também para garantir que na mina nasçam SOMENTE morcegos (zero slimes, zero aranhas!)
  function isPrisonMineArea(tx, ty) {
    const mx = tx - PRISON_MINE_TX;
    const my = ty - PRISON_MINE_TY;
    return mx >= -36 && mx <= 36 && my >= -8 && my <= 165;
  }

  
  
  
  
  const CHAT_PHRASES = [
    "Bom dia, vizinha! O fogo da praça está ótimo!",
    "Que vento gelado hoje nos picos!",
    "Gostei dos detalhes vermelhos do seu traje!",
    "Acabei de colocar mais lenha na lareira.",
    "O ensopado no fogão a lenha ficou uma delícia!",
    "Vou passear até a praça antes de anoitecer.",
    "Como está sua irmã lá em casa?",
    "Precisamos nos recolher cedo quando a noite cair.",
    "Ouviu os morcegos perto da mina ontem?",
    "Esse xale vermelho esquenta bastante no inverno!",
    "As ruas de pedra estão tranquilas hoje.",
    "Vou buscar temperos e já volto para casa!"
  ];

  let _citizensInitialized = false;
  const CITIZENS = [];
  const PRISONERS = [];
  const SOLDIERS = [];
  const _activeDoorwayTimers = new Map(); // key: "tx,ty" -> timestamp/remaining frames

  // Polilinha oficial da marcha entre o Corredor das Celas da Prisão e a Entrada da Mina Profunda (em coordenadas relativas à cidade)
  const PRISON_TO_MINE_ROUTE = [
    { rx: 0.0,  ry: 68.0 }, // 0: Fundo do Corredor Central das Celas
    { rx: -1.4, ry: 54.0 }, // 1: Corredor das Celas (desviando da escadaria em 0,51)
    { rx: 0.0,  ry: 46.0 }, // 2: Portão de Grades do Campo de Concentração
    { rx: -6.0, ry: 43.0 }, // 3: Pátio de Execução (contornando a forca pelo lado oeste)
    { rx: -6.0, ry: 30.5 }, // 4: Norte do Pátio de Execução
    { rx: 0.0,  ry: 28.0 }, // 5: Portão Principal do Quartel
    { rx: 0.0,  ry: 26.5 }, // 6: Estrada Militar Externa
    { rx: 41.5, ry: 26.5 }, // 7: Esquina Leste da Estrada Militar
    { rx: 41.5, ry: 56.5 }, // 8: Trilha da Mina ao lado da Prisão
    { rx: 46.0, ry: 56.5 }, // 9: Boca da Grande Mina Profunda das Neves
  ];

  // Calcula comprimento acumulado da polilinha para posicionar a fila de presos e os 6 tenentes (2 frente, 2 meio, 2 fim)
  const _ROUTE_SEGMENTS = [];
  let _ROUTE_TOTAL_LEN = 0;
  for (let i = 0; i < PRISON_TO_MINE_ROUTE.length - 1; i++) {
    const a = PRISON_TO_MINE_ROUTE[i];
    const b = PRISON_TO_MINE_ROUTE[i + 1];
    const len = Math.hypot(b.rx - a.rx, b.ry - a.ry);
    _ROUTE_SEGMENTS.push({ a, b, len, startDist: _ROUTE_TOTAL_LEN });
    _ROUTE_TOTAL_LEN += len;
  }

  function _sampleRouteAtDist(distTiles, lateralOffsetTiles, ts, reverse) {
    const clamped = Math.max(0, Math.min(_ROUTE_TOTAL_LEN, distTiles));
    const targetD = reverse ? _ROUTE_TOTAL_LEN - clamped : clamped;
    let seg = _ROUTE_SEGMENTS[0];
    for (let i = 0; i < _ROUTE_SEGMENTS.length; i++) {
      if (targetD >= _ROUTE_SEGMENTS[i].startDist && targetD <= _ROUTE_SEGMENTS[i].startDist + _ROUTE_SEGMENTS[i].len + 0.001) {
        seg = _ROUTE_SEGMENTS[i];
        break;
      }
    }
    const t = seg.len > 0 ? (targetD - seg.startDist) / seg.len : 0;
    const rx = seg.a.rx + (seg.b.rx - seg.a.rx) * t;
    const ry = seg.a.ry + (seg.b.ry - seg.a.ry) * t;
    let dx = seg.b.rx - seg.a.rx;
    let dy = seg.b.ry - seg.a.ry;
    if (reverse) {
      dx = -dx;
      dy = -dy;
    }
    const norm = Math.hypot(dx, dy) || 1;
    const ux = dx / norm;
    const uy = dy / norm;
    // Vetor perpendicular para colocar pares lado a lado na fila
    const px = -uy * lateralOffsetTiles;
    const py = ux * lateralOffsetTiles;
    const facing = Math.abs(ux) > Math.abs(uy) ? (ux < 0 ? "left" : "right") : (uy < 0 ? "up" : "down");
    return {
      x: (CITY_CX + rx + px + 0.5) * ts,
      y: (CITY_CY + ry + py + 0.5) * ts,
      facing,
      reachedStart: distTiles <= 0,
      reachedEnd: distTiles >= _ROUTE_TOTAL_LEN,
    };
  }

  // Definições das 4 Grandes Celas Coletivas para os 32 Prisioneiros (8 por cela)
  const CELL_ZONES = [
    { id: 0, roofId: "barracks_cell_nw", minRx: -31, maxRx: -7, aislesRy: [50.8, 51.4, 54.8, 55.4], gateRx: -4, gateRy: 53, clusterRx: -18, clusterRy: 51.2 },
    { id: 1, roofId: "barracks_cell_ne", minRx: 7,   maxRx: 31, aislesRy: [50.8, 51.4, 54.8, 55.4], gateRx: 4,  gateRy: 53, clusterRx: 18,  clusterRy: 51.2 },
    { id: 2, roofId: "barracks_cell_sw", minRx: -31, maxRx: -7, aislesRy: [64.8, 65.4, 68.8, 69.4], gateRx: -4, gateRy: 66, clusterRx: -18, clusterRy: 65.2 },
    { id: 3, roofId: "barracks_cell_se", minRx: 7,   maxRx: 31, aislesRy: [64.8, 65.4, 68.8, 69.4], gateRx: 4,  gateRy: 66, clusterRx: 18,  clusterRy: 65.2 },
  ];

  const PRISONER_PHRASES = [
    "Minhas mãos estão feridas de tanto cavar terra...",
    "Aquele monte de terra lá fora não para de crescer.",
    "Fiquem juntos aqui no canto, faz menos frio...",
    "Os 6 tenentes já vão abrir as grades para a fila da mina.",
    "Cuidado com o Capitão, ele fiscaliza cada túnel.",
    "Só tem terra e morcegos naquela mina profunda...",
    "Mais um dia carregando terra para fora...",
  ];

  const MILITARY_PHRASES = {
    coronel: [
      "Capitão, quero o relatório completo da escavação na mina!",
      "Mantenha os 6 tenentes firmes na escolta dos 32 prisioneiros.",
      "Vou inspecionar as ruas da cidade e retorno ao quartel antes do anoitecer.",
      "A disciplina no quartel e na mina deve ser absoluta!",
    ],
    capitao: [
      "Sim, Coronel! Os prisioneiros estão escavando os túneis e retirando a terra!",
      "A escolta dos tenentes levou todos os presos em fila sem incidentes.",
      "Vou retornar à mina agora mesmo para supervisionar os túneis, Coronel!",
      "Acelerem essa retirada de terra, prisioneiros!",
    ],
    tenente: [
      "Mantenham a fila alinhada até a entrada da mina! Sem parar!",
      "Dois tenentes na frente, dois no meio e dois na retaguarda — avancem!",
      "Levem esses sacos de terra para o monte ao lado da mina!",
      "De volta para as celas, prisioneiros! Rápido!",
    ],
    carcereiro: [
      "Ninguém se aproxima das grades! Silêncio nas celas!",
      "Corredor da prisão sob controle.",
    ],
    soldado: [
      "Em guarda! Perímetro seguro.",
      "Ronda em andamento sem alterações.",
      "Continuem escavando os túneis de terra, presos!",
    ],
  };

  let _lastSiteKey = null;
  function setSeed(seedVal, world) {
    const nextSeed = (Number(seedVal) || 4289) >>> 0;
    const legacy = typeof window !== "undefined" && !!window.__legacySnowCity;
    const canSearch = !!(world && typeof world._computeSurfaceBaseBiome === "function");
    if (!legacy && !canSearch) {
      // sem mundo (chamada antiga): so refaz a planta para a seed, no centro atual
      if (nextSeed === _currentSeed && HOUSES.length > 0) return;
      _buildHousesForSeed(nextSeed);
      _citizensInitialized = false;
      CITIZENS.length = 0;
      PRISONERS.length = 0;
      SOLDIERS.length = 0;
      _activeDoorwayTimers.clear();
      return;
    }
    const key = String(nextSeed) + (legacy ? ":legado" : ":natural");
    if (key === _lastSiteKey && HOUSES.length > 0) return; // mesma seed: local ja calculado
    _lastSiteKey = key;
    if (legacy) {
      _relocate(LEGACY_CX, LEGACY_CY, LEGACY_BIOME_RADIUS, nextSeed);
      _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: 0 };
      return;
    }
    let res = null;
    const prevG = window.__citySiteSearch;
    _siteSearchActive = true;
    window.__citySiteSearch = true;
    try {
      res = _findSnowSite(world);
    } catch (e) {
      res = null;
    } finally {
      _siteSearchActive = false;
      window.__citySiteSearch = prevG;
    }
    if (res && res.site) {
      _relocate(res.site[0], res.site[1], NATURAL_BIOME_RADIUS, nextSeed);
      _siteInfo = { mode: "natural", margin: res.margin, distance: Math.round(Math.hypot(res.site[0], res.site[1])), checked: res.checked };
    } else {
      _relocate(LEGACY_CX, LEGACY_CY, LEGACY_BIOME_RADIUS, nextSeed);
      _siteInfo = { mode: "fixed", margin: 0, distance: Math.round(Math.hypot(LEGACY_CX, LEGACY_CY)), checked: res ? res.checked : 0 };
    }
  }

  function _initCitizens(tileSize) {
    // skins e nomes vivem em js/citizens/snow-citizen.js (compartilhados com prisioneiros e soldados)
    const { skinTones: SKIN_TONES, hairColors: HAIR_COLORS, outfitPalettes: OUTFIT_PALETTES, femaleNames: FEMALE_NAMES } = CITIZEN_KINDS["snow-citizen"];
    if (_citizensInitialized) return;
    _citizensInitialized = true;
    CITIZENS.length = 0;
    PRISONERS.length = 0;
    SOLDIERS.length = 0;
    const ts = tileSize || 36;
    let nameIdx = 0;

    // 1. INICIALIZA AS MORADORAS DE TODAS AS CASAS (Centro Pavimentado + Casas Espalhadas ao Redor)
    for (let i = 0; i < HOUSES.length; i++) {
      const h = HOUSES[i];
      const count = h.twoBedrooms || h.id % 2 === 0 ? 2 : 1;

      for (let r = 0; r < count; r++) {
        const id = CITIZENS.length + 1;
        const name = FEMALE_NAMES[nameIdx % FEMALE_NAMES.length];
        nameIdx++;

        const doorTx = h.cx;
        const doorTy = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
        const streetRelY = h.isScattered
          ? (h.relY + (h.doorOnSouth ? h.halfH + 1.8 : -h.halfH - 1.8))
          : (h.relY < 0 ? -11.15 : 11.15);
        const streetTy = CITY_CY + streetRelY;

        const northSide = h.doorOnSouth;
        const bedTx = r === 0 ? h.cx - 2.1 : h.twoBedrooms ? h.cx + 2.1 : h.cx - 2.1;
        const bedTy = r === 0
          ? h.cy + (northSide ? -2.2 : 2.2)
          : h.twoBedrooms
            ? h.cy + (northSide ? -2.2 : 2.2)
            : h.cy + (northSide ? -1.2 : 1.2);
        const livingTx = h.cx + (r === 0 ? 1.1 : 2.1);
        const livingTy = h.cy + (northSide ? 1.8 : -1.8);
        const kitchenTx = h.cx + 1.5;
        const kitchenTy = h.cy + (northSide ? -1.8 : 1.8);
        const hallTx = h.cx + 0.2;
        const hallTy = h.cy + (northSide ? h.halfH - 1.2 : -h.halfH + 1.2);

        const skinColor = SKIN_TONES[(id * 3 + r * 5 + i) % SKIN_TONES.length];
        const hairColor = HAIR_COLORS[(id * 5 + r * 2 + i) % HAIR_COLORS.length];
        const hairStyle = (id + r * 2 + i) % 5;
        const outfitStyle = (id + r + i * 2) % 6;
        const palette = OUTFIT_PALETTES[(id * 2 + r + i) % OUTFIT_PALETTES.length];
        const propInHand = (id + i) % 4 === 0 ? "basket" : (id + i) % 7 === 0 ? "pot" : null;

        const startOutside = (id + r) % 3 !== 0;
        const startX = startOutside
          ? (h.cx + ((r === 0 ? -1 : 1) * 1.5) + 0.5) * ts
          : (livingTx + 0.5) * ts;
        const startY = startOutside
          ? (streetTy + 0.5) * ts
          : (livingTy + 0.5) * ts;

        const cit = {
          id,
          name: `${name} (Casa #${h.id})`,
          shortName: name,
          houseId: h.id,
          house: h,
          residentIndex: r,
          skinColor,
          hairColor,
          hairStyle,
          outfitStyle,
          palette,
          propInHand,
          x: startX,
          y: startY,
          facing: h.doorOnSouth ? "down" : "up",
          isMoving: false,
          walkPhase: id * 1.7,
          speed: 0.92 + ((id * 7) % 5) * 0.04,
          doorTx,
          doorTy,
          streetTy,
          streetRelY,
          bedTx,
          bedTy,
          livingTx,
          livingTy,
          kitchenTx,
          kitchenTy,
          hallTx,
          hallTy,
          isInsideHouse: !startOutside,
          state: startOutside ? "strolling" : "inside_home",
          stateTimer: startOutside ? 12 + (id % 20) : 2 + (id % 6),
          pauseTimer: 0,
          chatCooldown: 2 + (id % 5),
          chatPartnerId: null,
          chatText: "",
          waypoints: [],
        };

        if (startOutside) {
          _assignStrollDestination(cit, ts);
        }
        CITIZENS.push(cit);
      }
    }

    // 2. INICIALIZA OS 32 PRISIONEIROS (8 em cada uma das 4 Grandes Celas Coletivas, cores variadas, roupas brancas rasgadas)
    const ribCenters = [14, 29, 44, 59, 74, 89, 104, 119, 134, 146];
    for (let pIdx = 0; pIdx < 32; pIdx++) {
      const id = pIdx + 1;
      const cellIdx = pIdx % 4;
      const cz = CELL_ZONES[cellIdx];
      const slotInCell = Math.floor(pIdx / 4); // 0..7
      const skinColor = SKIN_TONES[(pIdx * 3 + cellIdx * 2) % SKIN_TONES.length];
      const hairColor = HAIR_COLORS[(pIdx * 5 + 1) % HAIR_COLORS.length];

      // Posição inicial dentro da sua grande cela
      const startRx = cz.minRx + 3 + (slotInCell * 3) % (cz.maxRx - cz.minRx - 4);
      const startRy = cz.aislesRy[slotInCell % cz.aislesRy.length];

      // Atribuição de trabalho na mina durante o dia:
      // - 20 prisioneiros (pIdx < 20) escavam dentro dos túneis subterrâneos de terra da mina e levam terra até a saída;
      // - 12 prisioneiros (pIdx >= 20) carregam os sacos de terra da boca da mina até o Grande Monte de Terra externo!
      const worksUndergroundInMine = pIdx < 20;
      const ribY = ribCenters[pIdx % ribCenters.length];
      const ribDir = pIdx % 2 === 0 ? -1 : 1;
      const digOffsetMx = ribDir * (6 + ((pIdx * 3) % 16));
      const digTargetMx = pIdx % 5 === 0 ? (pIdx % 2 === 0 ? -1.8 : 1.8) : digOffsetMx;
      const digTargetMy = pIdx % 5 === 0 ? 10 + ((pIdx * 11) % 120) : ribY;

      PRISONERS.push({
        id,
        name: `Prisioneiro #${id}`,
        cellIdx,
        cellZone: cz,
        slotInCell,
        skinColor,
        hairColor,
        hasBeard: pIdx % 3 === 0,
        tatterSeed: (pIdx * 7) % 5,
        x: (CITY_CX + startRx + 0.5) * ts,
        y: (CITY_CY + startRy + 0.5) * ts,
        facing: "down",
        isMoving: false,
        walkPhase: id * 1.3,
        speed: 0.95 + (pIdx % 4) * 0.03,
        isUnderground: false,
        carryingDirt: false,
        isDigging: false,
        digTimer: 0,
        mode: "cell_explore", // "cell_explore", "cell_cluster", "marching_to_mine", "mine_work", "marching_to_cell"
        modeTimer: 4 + (pIdx % 9),
        pauseTimer: 0,
        chatText: "",
        worksUndergroundInMine,
        digTargetMx,
        digTargetMy,
        haulPhase: pIdx % 2 === 0 ? "to_mound" : "to_mine",
        waypoints: [],
      });
    }

    // 3. INICIALIZA O CORONEL, CAPITÃO, 6 TENENTES, CARCEREIROS E SOLDADOS (Todos com tons de pele variados e uniforme preto com detalhes vermelhos idênticos!)
    let solId = 1;
    const makeSoldier = (rank, title, role, homeHouseIdx, startRx, startRy, isUnderground = false, goesHomeAtNight = false) => {
      const h = HOUSES[homeHouseIdx % HOUSES.length];
      const id = solId++;
      const skinColor = SKIN_TONES[(id * 3 + homeHouseIdx) % SKIN_TONES.length];
      const hairColor = HAIR_COLORS[(id * 4 + 2) % HAIR_COLORS.length];
      const baseX = isUnderground ? (PRISON_MINE_TX + startRx + 0.5) * ts : (CITY_CX + startRx + 0.5) * ts;
      const baseY = isUnderground ? (PRISON_MINE_TY + startRy + 0.5) * ts : (CITY_CY + startRy + 0.5) * ts;

      return {
        id,
        rank, // "Coronel", "Capitão", "Tenente", "Carcereiro", "Soldado"
        name: title,
        role,
        skinColor,
        hairColor,
        homeHouse: h,
        homeHouseId: h.id,
        goesHomeAtNight,
        isInsideHouse: false,
        isUnderground,
        defaultUnderground: isUnderground,
        postRx: startRx,
        postRy: startRy,
        x: baseX,
        y: baseY,
        facing: "down",
        isMoving: false,
        walkPhase: id * 2.1,
        speed: rank === "Capitão" ? 1.18 : rank === "Coronel" ? 1.0 : 1.04,
        state: "duty",
        stateTimer: 5 + (id % 8),
        pauseTimer: 0,
        chatText: "",
        waypoints: [],
        // Específicos de patrulha/trajeto
        patrolStep: 0,
        captainPhase: "at_colonel", // "at_colonel" -> "to_mine" -> "at_mine" -> "to_colonel"
        captainTimer: 6.0,
      };
    };

    // 3.1 CORONEL (1 — Chefe de todos: fica na Sala de Administração conversando com o Capitão, depois anda pela cidade todo dia, volta para o quartel e à noite vai para casa!)
    SOLDIERS.push(makeSoldier("Coronel", "Coronel Valerius (Comandante Chefe)", "colonel", 0, -22.0, 40.0, false, true));

    // 3.2 CAPITÃO (1 — Vai e volta da Mina Profunda de tempos em tempos até a Sala do Coronel!)
    SOLDIERS.push(makeSoldier("Capitão", "Capitão Rodrigo (Supervisor Geral)", "captain", 1, -20.0, 40.0, false, true));

    // 3.3 6 TENENTES (2 na frente da fila, 2 no meio da fila, 2 no final da fila para transportar os presos das celas para a mina; metade dorme em casa à noite)
    for (let lt = 0; lt < 6; lt++) {
      const posDesc = lt < 2 ? "Vanguarda da Fila" : lt < 4 ? "Meio da Fila" : "Retaguarda da Fila";
      const goesHome = lt % 2 === 0; // Metade (3 tenentes) vai para casa dormir à noite e retorna de dia!
      const postRx = 44.0 + (lt % 3) * 3.2;
      const postRy = 54.5 + Math.floor(lt / 3) * 4.2;
      const s = makeSoldier("Tenente", `Tenente #${lt + 1} (${posDesc})`, "lieutenant", 2 + lt, postRx, postRy, false, goesHome);
      s.ltIndex = lt; // 0,1 = frente; 2,3 = meio; 4,5 = fim
      SOLDIERS.push(s);
    }

    // 3.4 2 SOLDADOS / CARCEREIROS COMO VIGIA NOS CORREDORES DA PRISÃO (metade = 1 vai para casa dormir à noite e retorna de dia)
    SOLDIERS.push(makeSoldier("Carcereiro", "Carcereiro-Vigia #1 (Corredor da Prisão)", "prison_corridor_guard", 8, -1.6, 52.0, false, false));
    SOLDIERS.push(makeSoldier("Carcereiro", "Carcereiro-Vigia #2 (Corredor da Prisão)", "prison_corridor_guard", 9, 1.6, 64.0, false, true));

    // 3.5 2 SOLDADOS NA PORTA PRINCIPAL DO QUARTEL
    SOLDIERS.push(makeSoldier("Soldado", "Soldado Sentinela #1 (Porta Principal)", "main_gate_guard", 10, -2.4, 27.2, false, false));
    SOLDIERS.push(makeSoldier("Soldado", "Soldado Sentinela #2 (Porta Principal)", "main_gate_guard", 11, 2.4, 27.2, false, false));

    // 3.6 2 SOLDADOS NA ENTRADA DA MINA (metade = 1 vai para casa dormir à noite e retorna de dia)
    SOLDIERS.push(makeSoldier("Soldado", "Soldado da Mina #1 (Entrada da Mina)", "mine_entrance_guard", 12, 43.0, 56.8, false, false));
    SOLDIERS.push(makeSoldier("Soldado", "Soldado da Mina #2 (Entrada da Mina)", "mine_entrance_guard", 13, 49.0, 56.8, false, true));

    // 3.7 4 SOLDADOS DENTRO DA MINA FAZENDO RONDA (metade = 2 vão para casas dormir à noite e retornam de dia)
    const minePatrolStartMy = [14, 44, 74, 104];
    for (let mp = 0; mp < 4; mp++) {
      const goesHome = mp >= 2; // Metade (2 soldados) vai para casa dormir à noite e retorna de dia!
      const s = makeSoldier("Soldado", `Soldado de Ronda da Mina #${mp + 1}`, "mine_inside_patrol", 14 + mp, 0, minePatrolStartMy[mp], true, goesHome);
      s.minePatrolIndex = mp;
      SOLDIERS.push(s);
    }

    // 3.8 8 SOLDADOS FAZENDO RONDA NA CIDADE (4 soldados fazendo ronda de dia e 8 soldados fazendo ronda à noite!)
    const cityPatrolStartRx = [-28, -10, 12, 30, -35, -18, 18, 35];
    for (let cp = 0; cp < 8; cp++) {
      const isNightOnly = cp >= 4; // Os 4 primeiros patrulham de dia e noite; os outros 4 saem à noite totalizando 8 à noite!
      const startRy = cp % 2 === 0 ? -11.15 : 11.15;
      const s = makeSoldier(
        "Soldado",
        `Soldado da Ronda Urbana #${cp + 1}`,
        isNightOnly ? "city_patrol_night_extra" : "city_patrol_day_night",
        16 + cp,
        cityPatrolStartRx[cp],
        startRy,
        false,
        false
      );
      if (isNightOnly) {
        // De dia fica descansando em sua casa na cidade e sai ao anoitecer!
        const h = s.homeHouse;
        s.x = (h.cx + 1.0 + 0.5) * ts;
        s.y = (h.cy + (h.doorOnSouth ? 1.5 : -1.5) + 0.5) * ts;
        s.isInsideHouse = true;
        s.state = "resting_day_at_home";
      }
      SOLDIERS.push(s);
    }
  }

  // Constrói uma rota limpa pelas ruas de paralelepípedo, Praça Central e arredores nevados (evitando paredes, casas e a fogueira central)
  function _buildStreetRoute(fromX, fromY, targetRelX, targetRelY, ts) {
    const curRelX = fromX / ts - 0.5 - CITY_CX;
    const curRelY = fromY / ts - 0.5 - CITY_CY;
    const pts = [];
    const pushTile = (rx, ry) => {
      pts.push({ x: (CITY_CX + rx + 0.5) * ts, y: (CITY_CY + ry + 0.5) * ts });
    };

    // Se tanto origem quanto destino estão na zona externa espalhada ao norte (relY < -26), caminha direto pela neve
    if (curRelY < -26 && targetRelY < -26) {
      pushTile((curRelX + targetRelX) * 0.5, Math.min(curRelY, targetRelY) - 1.5);
      pushTile(targetRelX, targetRelY);
      return pts;
    }

    const curStreetY = curRelY < 0 ? -11.15 : 11.15;
    const targetStreetY = targetRelY < -5 ? -11.15 : targetRelY > 5 ? 11.15 : 0;

    // 1. Se estiver vindo de uma casa espalhada fora do centro pavimentado, entra na rua principal pela extremidade ou pelo conector norte
    if (Math.abs(curRelX) > 45 || Math.abs(curRelY) > 25) {
      const entryX = curRelX < -44 ? -45 : curRelX > 44 ? 44 : 4.5;
      pushTile(entryX, curRelY < 0 ? -25 : 11.15);
      pushTile(entryX, curStreetY);
    } else if (Math.abs(curRelX) > 3.9 && Math.abs(curRelY - curStreetY) > 0.8) {
      pushTile(curRelX, curStreetY);
    }

    // 2. Se o destino for na Praça Central (targetStreetY === 0)
    if (targetStreetY === 0) {
      if (Math.abs(curRelX) > 3.9) {
        pushTile(0, curStreetY);
      }
      const entryY = curRelY < 0 ? -4.1 : 4.1;
      pushTile(0, entryY);
      pushTile(targetRelX, targetRelY);
      return pts;
    }

    // 3. Se estiver na Praça Central e quiser ir para uma das ruas ou casas espalhadas
    if (Math.abs(curRelX) <= 3.9 && Math.abs(curRelY) < 9.5) {
      const exitX = Math.abs(curRelX) > 1.5 ? (curRelX < 0 ? -3.6 : 3.6) : 0;
      pushTile(exitX, targetStreetY < 0 ? -4.1 : 4.1);
      pushTile(0, targetStreetY);
      const clampedX = Math.max(-45, Math.min(44, targetRelX));
      pushTile(clampedX, targetStreetY);
      if (Math.abs(targetRelX) > 45 || Math.abs(targetRelY) > 25) {
        const outGateX = targetRelX < -44 ? -45 : targetRelX > 44 ? 44 : 4.5;
        pushTile(outGateX, targetStreetY);
        if (targetRelY < -25) pushTile(outGateX, -26);
      }
      if (Math.abs(targetRelY - targetStreetY) > 0.3 || Math.abs(targetRelX - clampedX) > 0.3) {
        pushTile(targetRelX, targetRelY);
      }
      return pts;
    }

    // 4. Se precisar trocar entre a Rua Norte (-11.15) e a Rua Sul (+11.15), atravessa pela Praça Central
    if (Math.sign(curStreetY) !== Math.sign(targetStreetY)) {
      pushTile(0, curStreetY);
      pushTile(0, curStreetY < 0 ? -4.2 : 4.2);
      // Contorna a fogueira e os bancos da praça por X = -3.6 ou +3.6
      const sideX = (Math.round(Math.abs(fromX + fromY)) % 2 === 0) ? -3.6 : 3.6;
      pushTile(sideX, curStreetY < 0 ? -4.2 : 4.2);
      pushTile(sideX, targetStreetY < 0 ? -4.2 : 4.2);
      pushTile(0, targetStreetY);
    }

    // 5. Caminha pela rua alvo até o X de destino (ou sai pela extremidade da rua se o destino for uma casa espalhada)
    if (Math.abs(targetRelX) > 45 || Math.abs(targetRelY) > 25) {
      const exitX = targetRelX < -44 ? -45 : targetRelX > 44 ? 44 : 4.5;
      pushTile(exitX, targetStreetY);
      if (targetRelY < -25) pushTile(exitX, -26);
      pushTile(targetRelX, targetRelY);
    } else {
      pushTile(targetRelX, targetStreetY);
      if (Math.abs(targetRelY - targetStreetY) > 0.25) {
        pushTile(targetRelX, targetRelY);
      }
    }
    return pts;
  }

  // Escolhe um novo destino de passeio pela cidade (Rua Norte, Rua Sul, Praça Central, Becos ou frente das casas espalhadas)
  function _assignStrollDestination(cit, ts) {
    const roll = Math.random();
    if (roll < 0.30) {
      // Passear até a Praça Central (ao redor da Grande Fogueira e bancos)
      const plazaSpots = [
        { rx: -3.5, ry: -3.8 },
        { rx: 3.5, ry: -3.8 },
        { rx: -3.5, ry: 3.8 },
        { rx: 3.5, ry: 3.8 },
        { rx: -1.4, ry: -3.1 },
        { rx: 1.4, ry: -3.1 },
        { rx: -1.4, ry: 3.1 },
        { rx: 1.4, ry: 3.1 },
        { rx: -3.2, ry: 0 },
        { rx: 3.2, ry: 0 },
      ];
      const sp = plazaSpots[Math.floor(Math.random() * plazaSpots.length)];
      cit.waypoints = _buildStreetRoute(cit.x, cit.y, sp.rx, sp.ry, ts);
    } else if (roll < 0.48) {
      // Passear por um dos becos (com ou sem saída)
      const alleySpots = [
        { rx: -30.5, ry: -16.5 },
        { rx: -8.0, ry: -17.5 },
        { rx: 29.0, ry: -16.5 },
        { rx: -32.5, ry: -4.5 },
        { rx: 16.5, ry: -7.5 },
        { rx: 27.5, ry: 4.5 },
        { rx: -28.5, ry: 17.0 },
        { rx: 16.5, ry: 18.0 },
      ];
      const sp = alleySpots[Math.floor(Math.random() * alleySpots.length)];
      cit.waypoints = _buildStreetRoute(cit.x, cit.y, sp.rx, sp.ry, ts);
    } else {
      // Passear visitando a frente de outras casas (tanto do centro pavimentado quanto das casas espalhadas ao redor)
      const targetHouse = HOUSES[Math.floor(Math.random() * HOUSES.length)];
      const rx = targetHouse.relX + (Math.random() * 3 - 1.5);
      const ry = targetHouse.isScattered
        ? targetHouse.relY + (targetHouse.doorOnSouth ? targetHouse.halfH + 1.8 : -targetHouse.halfH - 1.8)
        : (targetHouse.relY < 0 ? -11.15 + (Math.random() * 0.7 - 0.35) : 11.15 + (Math.random() * 0.7 - 0.35));
      cit.waypoints = _buildStreetRoute(cit.x, cit.y, rx, ry, ts);
    }
  }

  // Envia a moradora de volta para entrar na casa dela (para passar a noite ou descansar um pouco durante o dia)
  function _sendCitizenHome(cit, ts, forNight) {
    cit.state = forNight ? "returning_home_night" : "entering_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;

    if (cit.isInsideHouse) {
      // Já está dentro de casa: vai para a cama (à noite) ou para a sala/cozinha
      const destTx = forNight ? cit.bedTx : cit.livingTx;
      const destTy = forNight ? cit.bedTy : cit.livingTy;
      cit.waypoints = [
        { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
        { x: (destTx + 0.5) * ts, y: (destTy + 0.5) * ts },
      ];
      return;
    }

    // Constrói rota pelas ruas até a calçada da própria casa, depois atravessa a porta e entra!
    const streetPts = _buildStreetRoute(cit.x, cit.y, cit.house.relX, cit.streetRelY, ts);
    const doorStepY = cit.doorTy + (cit.house.doorOnSouth ? 1.1 : -1.1);
    streetPts.push({ x: (cit.doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts });
    streetPts.push({ x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true, EnterHouse: true });
    streetPts.push({ x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts, markInside: true });
    if (forNight) {
      streetPts.push({ x: (cit.bedTx + 0.5) * ts, y: (cit.bedTy + 0.5) * ts });
    } else {
      const goKitchen = Math.random() < 0.5;
      streetPts.push({
        x: ((goKitchen ? cit.kitchenTx : cit.livingTx) + 0.5) * ts,
        y: ((goKitchen ? cit.kitchenTy : cit.livingTy) + 0.5) * ts,
      });
    }
    cit.waypoints = streetPts;
  }

  // Faz a moradora sair de dentro de casa pela porta para passear na cidade
  function _sendCitizenOutside(cit, ts) {
    cit.state = "exiting_house";
    cit.chatPartnerId = null;
    cit.chatText = "";
    cit.pauseTimer = 0;
    const doorStepY = cit.doorTy + (cit.house.doorOnSouth ? 1.15 : -1.15);
    cit.waypoints = [
      { x: (cit.hallTx + 0.5) * ts, y: (cit.hallTy + 0.5) * ts },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.doorTy + 0.5) * ts, isDoorCrossing: true },
      { x: (cit.doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts, markOutside: true },
      { x: (cit.doorTx + 0.5) * ts, y: (cit.streetTy + 0.5) * ts, markOutside: true },
    ];
  }

  // Verifica se uma moradora está atravessando a porta de uma casa neste instante (para abrir a porta visualmente!)
  function isDoorwayUsedByCitizen(tx, ty) {
    const exp = _activeDoorwayTimers.get(`${tx},${ty}`);
    return exp !== undefined && exp > 0;
  }

  // Interação do jogador [F] com uma moradora, prisioneiro ou militar próximo
  function interactWithNearbyCitizen(playerX, playerY, isUnderground = false) {
    let best = null;
    let bestType = null;
    let bestDist = 52;

    if (!isUnderground) {
      for (let i = 0; i < CITIZENS.length; i++) {
        const c = CITIZENS[i];
        const d = Math.hypot(playerX - c.x, playerY - c.y);
        if (d < bestDist) {
          bestDist = d;
          best = c;
          bestType = "citizen";
        }
      }
    }

    for (let i = 0; i < SOLDIERS.length; i++) {
      const s = SOLDIERS[i];
      if (!!s.isUnderground !== !!isUnderground) continue;
      const d = Math.hypot(playerX - s.x, playerY - s.y);
      if (d < bestDist) {
        bestDist = d;
        best = s;
        bestType = "soldier";
      }
    }

    for (let i = 0; i < PRISONERS.length; i++) {
      const p = PRISONERS[i];
      if (!!p.isUnderground !== !!isUnderground) continue;
      const d = Math.hypot(playerX - p.x, playerY - p.y);
      if (d < bestDist) {
        bestDist = d;
        best = p;
        bestType = "prisoner";
      }
    }

    if (!best) return null;

    const dx = playerX - best.x;
    const dy = playerY - best.y;
    best.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
    best.pauseTimer = 3.0;

    if (bestType === "citizen") {
      const greetings = [
        `Olá, viajante! Sou ${best.shortName}, moro na Casa #${best.houseId}.`,
        `Que bom ver você nos Picos Gelados! A fogueira da praça está bem quentinha.`,
        `Todas nós usamos detalhes vermelhos nos trajes — é a tradição da nossa vila na neve!`,
        `Durante o dia passeamos e conversamos pela vila, mas à noite sempre voltamos para casa.`,
      ];
      const line = greetings[Math.floor(Math.random() * greetings.length)];
      best.chatText = line;
      best.state = best.isInsideHouse ? best.state : "interacting";
      best.stateTimer = 4.0;
      return {
        success: true,
        citizen: best,
        message: `💬 ${best.name}: "${line}"`,
      };
    }

    if (bestType === "soldier") {
      const rKey = best.rank === "Coronel"
        ? "coronel"
        : best.rank === "Capitão"
          ? "capitao"
          : best.rank === "Tenente"
            ? "tenente"
            : best.rank === "Carcereiro"
              ? "carcereiro"
              : "soldado";
      const pool = MILITARY_PHRASES[rKey] || MILITARY_PHRASES.soldado;
      const line = pool[Math.floor(Math.random() * pool.length)];
      best.chatText = line;
      best.stateTimer = 4.0;
      return {
        success: true,
        citizen: best,
        message: `⚔️ ${best.name}: "${line}"`,
      };
    }

    const line = PRISONER_PHRASES[Math.floor(Math.random() * PRISONER_PHRASES.length)];
    best.chatText = line;
    return {
      success: true,
      citizen: best,
      message: `⛓️ ${best.name}: "${line}"`,
    };
  }

  // Move uma entidade suavemente ao longo de sua lista de waypoints
  function _stepWaypoints(ent, ts, speedMul = 1.0) {
    if (!ent.waypoints || ent.waypoints.length === 0) {
      ent.isMoving = false;
      return false;
    }
    const wp = ent.waypoints[0];
    const dx = wp.x - ent.x;
    const dy = wp.y - ent.y;
    const dist = Math.hypot(dx, dy);
    const spd = (ent.speed || 1.0) * speedMul;

    if (wp.doorTileTx !== undefined && wp.doorTileTy !== undefined) {
      const dwX = (wp.doorTileTx + 0.5) * ts;
      const dwY = (wp.doorTileTy + 0.5) * ts;
      if (Math.hypot(ent.x - dwX, ent.y - dwY) < ts * 1.4) {
        _activeDoorwayTimers.set(`${wp.doorTileTx},${wp.doorTileTy}`, 14);
      }
    }

    if (dist <= spd * 1.45) {
      ent.x = wp.x;
      ent.y = wp.y;
      if (wp.markInside !== undefined) ent.isInsideHouse = !!wp.markInside;
      if (wp.setUnderground !== undefined) ent.isUnderground = !!wp.setUnderground;
      if (wp.teleportX !== undefined && wp.teleportY !== undefined) {
        ent.x = wp.teleportX;
        ent.y = wp.teleportY;
      }
      ent.waypoints.shift();
      if (ent.waypoints.length === 0) {
        ent.isMoving = false;
      }
      return true;
    }

    ent.x += (dx / dist) * spd;
    ent.y += (dy / dist) * spd;
    ent.isMoving = true;
    ent.walkPhase += 0.17 * speedMul;
    if (Math.abs(dx) > Math.abs(dy)) {
      ent.facing = dx < 0 ? "left" : "right";
    } else {
      ent.facing = dy < 0 ? "up" : "down";
    }
    return true;
  }

  // Constrói rota de qualquer ponto externo até entrar na casa `h` para dormir à noite (usado por Coronel, Capitão, Tenentes e Soldados)
  function _sendSoldierToHouseForNight(sol, ts) {
    const h = sol.homeHouse;
    const doorTx = h.cx;
    const doorTy = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
    const streetRelY = h.relY < 0 ? -11.15 : 11.15;
    const doorStepY = doorTy + (h.doorOnSouth ? 1.1 : -1.1);
    const insideX = (h.cx + (sol.id % 2 === 0 ? -1.8 : 1.5) + 0.5) * ts;
    const insideY = (h.cy + (h.doorOnSouth ? -1.8 : 1.8) + 0.5) * ts;

    // Se o soldado estava dentro da mina subterrânea, primeiro sai da mina para a superfície!
    if (sol.isUnderground) {
      sol.isUnderground = false;
      sol.x = (PRISON_MINE_TX + 0.5) * ts;
      sol.y = (PRISON_MINE_TY + 1.2) * ts;
    }

    const pts = [];
    const curRx = sol.x / ts - 0.5 - CITY_CX;
    const curRy = sol.y / ts - 0.5 - CITY_CY;

    // Se estiver dentro do Quartel/Prisão (curRy >= 28 e |curRx| <= 36), sai pelo Portão Principal (0, 28)
    if (curRy >= 28 && Math.abs(curRx) <= 36) {
      if (curRy > 46) {
        pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 46.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 46 });
      }
      pts.push({ x: (CITY_CX - 5.5) * ts, y: (CITY_CY + 32.5) * ts });
      pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 });
      pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 11.65) * ts });
    } else if (curRx > 36 || curRy > 24) {
      // Se estiver na área externa da Mina Profunda, sobe pela trilha leste até a Rua Sul
      pts.push({ x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts });
      pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts });
      pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 11.65) * ts });
    }

    const fromX = pts.length > 0 ? pts[pts.length - 1].x : sol.x;
    const fromY = pts.length > 0 ? pts[pts.length - 1].y : sol.y;
    const streetRoute = _buildStreetRoute(fromX, fromY, h.relX, streetRelY, ts);
    for (let k = 0; k < streetRoute.length; k++) pts.push(streetRoute[k]);

    pts.push({ x: (doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts, doorTileTx: doorTx, doorTileTy: doorTy });
    pts.push({ x: (doorTx + 0.5) * ts, y: (doorTy + 0.5) * ts, doorTileTx: doorTx, doorTileTy: doorTy, markInside: true });
    pts.push({ x: insideX, y: insideY, markInside: true });
    sol.waypoints = pts;
    sol.state = "going_home_night";
  }

  // Faz o soldado/oficial sair de casa de manhã cedo para retornar ao seu posto
  function _wakeSoldierFromHouse(sol, ts) {
    const h = sol.homeHouse;
    const doorTx = h.cx;
    const doorTy = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
    const streetRelY = h.relY < 0 ? -11.15 : 11.15;
    const doorStepY = doorTy + (h.doorOnSouth ? 1.15 : -1.15);

    const pts = [
      { x: (doorTx + 0.5) * ts, y: (doorTy + 0.5) * ts, doorTileTx: doorTx, doorTileTy: doorTy, markInside: false },
      { x: (doorTx + 0.5) * ts, y: (doorStepY + 0.5) * ts, doorTileTx: doorTx, doorTileTy: doorTy, markInside: false },
      { x: (doorTx + 0.5) * ts, y: (CITY_CY + streetRelY + 0.5) * ts, markInside: false },
    ];

    // Vai pelas ruas até a saída Sul da Praça (0, 11.15 -> 0, 26.5)
    const toSouth = _buildStreetRoute(pts[2].x, pts[2].y, 0, 11.15, ts);
    for (let k = 0; k < toSouth.length; k++) pts.push(toSouth[k]);
    pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 26.8) * ts });

    if (sol.defaultUnderground) {
      // Soldado de ronda interna da mina: caminha até a entrada da mina e entra no subsolo!
      pts.push({ x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 26.8) * ts });
      pts.push({ x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 56.8) * ts });
      pts.push({
        x: (PRISON_MINE_TX + 0.5) * ts,
        y: (PRISON_MINE_TY + 0.5) * ts,
        setUnderground: true,
        teleportX: (PRISON_MINE_TX + 0.5) * ts,
        teleportY: (PRISON_MINE_TY + sol.postRy + 0.5) * ts,
      });
    } else if (sol.postRy >= 28 && Math.abs(sol.postRx) <= 35) {
      // Posto dentro do Quartel / Prisão / Sala do Coronel
      pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 });
      pts.push({ x: (CITY_CX - 6.0 + 0.5) * ts, y: (CITY_CY + 33.5) * ts });
      if (sol.role === "colonel" || sol.role === "captain") {
        pts.push({ x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 });
      } else if (sol.postRy > 46) {
        pts.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 46.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 46 });
      }
      pts.push({ x: (CITY_CX + sol.postRx + 0.5) * ts, y: (CITY_CY + sol.postRy + 0.5) * ts });
    } else {
      // Posto externo na Entrada da Mina
      pts.push({ x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 26.8) * ts });
      pts.push({ x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 56.8) * ts });
      pts.push({ x: (CITY_CX + sol.postRx + 0.5) * ts, y: (CITY_CY + sol.postRy + 0.5) * ts });
    }

    sol.waypoints = pts;
    sol.state = "returning_to_duty";
  }

  // Atualiza os 32 Prisioneiros e todos os Soldados/Oficiais
  function _updatePrisonersAndSoldiers(ts, dt, timeOfDay, animTimer) {
    // Fases do dia para a Prisão e o Quartel:
    // - isMarchToMine (0.24 <= timeOfDay < 0.34): Fila de 32 prisioneiros levados das celas para a Mina por 6 Tenentes (2 frente, 2 meio, 2 fim)
    // - isMineWorkTime (0.34 <= timeOfDay <= 0.66): Prisioneiros escavando os túneis de terra da mina e retirando a terra para o monte externo
    // - isMarchToCells (0.66 < timeOfDay <= 0.75): Fila de 32 prisioneiros trazidos de volta da Mina para as celas pelos 6 Tenentes
    // - isPrisonNight (timeOfDay < 0.24 || timeOfDay > 0.75): Prisioneiros dentro das 4 Grandes Celas explorando e se aglomerando; metade dos soldados da mina/prisão e o Coronel em casa dormindo; 8 soldados na ronda da cidade!
    const isMarchToMine = timeOfDay >= 0.24 && timeOfDay < 0.34;
    const isMineWorkTime = timeOfDay >= 0.34 && timeOfDay <= 0.66;
    const isMarchToCells = timeOfDay > 0.66 && timeOfDay <= 0.75;
    const isNightShift = timeOfDay < 0.24 || timeOfDay > 0.75;

    // Progresso da marcha (0.0 a 1.0)
    const marchFrac = isMarchToMine
      ? (timeOfDay - 0.24) / 0.10
      : isMarchToCells
        ? (timeOfDay - 0.66) / 0.09
        : 0;
    // Distância percorrida pelo líder da fila ao longo da polilinha (_ROUTE_TOTAL_LEN ~ 125 blocos)
    const marchLeadDist = marchFrac * (_ROUTE_TOTAL_LEN + 30);

    // Mantém os portões da prisão e do quartel abertos durante a passagem da fila
    if (isMarchToMine || isMarchToCells) {
      _activeDoorwayTimers.set(`${CITY_CX},${CITY_CY + 28}`, 10);
      _activeDoorwayTimers.set(`${CITY_CX},${CITY_CY + 46}`, 10);
      _activeDoorwayTimers.set(`${CITY_CX - 4},${CITY_CY + 53}`, 10);
      _activeDoorwayTimers.set(`${CITY_CX + 4},${CITY_CY + 53}`, 10);
      _activeDoorwayTimers.set(`${CITY_CX - 4},${CITY_CY + 66}`, 10);
      _activeDoorwayTimers.set(`${CITY_CX + 4},${CITY_CY + 66}`, 10);
    }

    // =========================================================================
    // A. ATUALIZA OS 32 PRISIONEIROS
    // =========================================================================
    // Ponto de aglomeração dinâmico em cada uma das 4 grandes celas (muda a cada ~18s)
    const clusterCycle = Math.floor(animTimer * 0.08);
    const isClusterPhase = (Math.floor(animTimer * 0.12) % 3) !== 0; // 2/3 do tempo há grupos se aglomerando nas celas

    for (let i = 0; i < PRISONERS.length; i++) {
      const p = PRISONERS[i];
      if (p.pauseTimer > 0) p.pauseTimer = Math.max(0, p.pauseTimer - dt);

      // 1. MARCHA MATINAL (Celas -> Mina) ou MARCHA VESPERTINA (Mina -> Celas) EM FILA
      if (isMarchToMine || isMarchToCells) {
        p.isDigging = false;
        p.carryingDirt = false;
        p.waypoints = [];
        // Posição de cada prisioneiro na fila entre os 6 Tenentes:
        // - Prisioneiros 0..15 ficam entre os 2 Tenentes da Frente (offset 0) e os 2 Tenentes do Meio (offset 14.5)
        // - Prisioneiros 16..31 ficam entre os 2 Tenentes do Meio (offset 14.5) e os 2 Tenentes do Final (offset 29.0)
        const halfGroup = i < 16 ? 0 : 1;
        const rowInHalf = Math.floor((i % 16) / 2); // 0..7
        const sideSign = i % 2 === 0 ? -0.42 : 0.42;
        const distBehindLead = halfGroup === 0
          ? 2.2 + rowInHalf * 1.45
          : 16.5 + rowInHalf * 1.45;
        const myDist = marchLeadDist - distBehindLead;

        if (isMarchToMine && myDist >= _ROUTE_TOTAL_LEN) {
          // Já chegou na boca da Mina Profunda: inicia o trabalho na mina!
          if (p.worksUndergroundInMine) {
            p.isUnderground = true;
            p.x = (PRISON_MINE_TX + 0.5) * ts;
            p.y = (PRISON_MINE_TY + 2.5 + (i % 6)) * ts;
          } else {
            p.isUnderground = false;
            p.x = (CITY_CX + 46.5 + (i % 3)) * ts;
            p.y = (CITY_CY + 56.8) * ts;
          }
          p.isMoving = false;
        } else {
          p.isUnderground = false;
          const pos = _sampleRouteAtDist(myDist, sideSign, ts, isMarchToCells);
          p.x = pos.x;
          p.y = pos.y;
          p.facing = pos.facing;
          p.isMoving = myDist > 0 && myDist < _ROUTE_TOTAL_LEN;
          if (p.isMoving) p.walkPhase += 0.18;
          p.chatText = (i === 0 && Math.floor(animTimer) % 9 === 0)
            ? "Marchando em fila para a mina..."
            : "";
        }
        continue;
      }

      // 2. HORÁRIO DE TRABALHO NA MINA PROFUNDA (Escavar os túneis de terra e retirar a terra para fora)
      if (isMineWorkTime) {
        if (p.worksUndergroundInMine) {
          // Trabalha DENTRO dos túneis de terra da Mina Profunda (isUnderground = true)
          if (!p.isUnderground || p.mode !== "mine_work") {
            p.isUnderground = true;
            p.mode = "mine_work";
            p.carryingDirt = false;
            p.isDigging = false;
            p.x = (PRISON_MINE_TX + (i % 2 === 0 ? -1 : 1) + 0.5) * ts;
            p.y = (PRISON_MINE_TY + 8 + (i * 5) % 95 + 0.5) * ts;
            p.waypoints = [];
          }

          if (p.isDigging) {
            p.isMoving = false;
            p.digTimer -= dt;
            p.walkPhase += 0.22; // Anima os braços escavando a parede de terra!
            p.facing = p.digTargetMx < 0 ? "left" : p.digTargetMx > 0 ? "right" : "down";
            p.chatText = (i % 6 === 0 && Math.floor(animTimer + i) % 8 === 0)
              ? "Escavando o túnel de terra..."
              : "";
            if (p.digTimer <= 0) {
              // Terminou de encher o saco de terra: leva pelo túnel até a saída da mina!
              p.isDigging = false;
              p.carryingDirt = true;
              const spineX = (PRISON_MINE_TX + (i % 2 === 0 ? -0.8 : 0.8) + 0.5) * ts;
              const ribEntryY = (PRISON_MINE_TY + p.digTargetMy + 0.5) * ts;
              const exitX = (PRISON_MINE_TX + (i % 2 === 0 ? -1.2 : 1.2) + 0.5) * ts;
              const exitY = (PRISON_MINE_TY + 2.2 + 0.5) * ts;
              p.waypoints = [
                { x: spineX, y: ribEntryY },
                { x: exitX, y: exitY },
              ];
            }
          } else if (!_stepWaypoints(p, ts, p.carryingDirt ? 0.88 : 1.0)) {
            if (p.carryingDirt) {
              // Chegou perto da saída da mina e entregou o saco de terra para a turma externa: volta para escavar!
              p.carryingDirt = false;
              const spineX = (PRISON_MINE_TX + (i % 2 === 0 ? -0.8 : 0.8) + 0.5) * ts;
              const ribEntryY = (PRISON_MINE_TY + p.digTargetMy + 0.5) * ts;
              const digX = (PRISON_MINE_TX + p.digTargetMx + 0.5) * ts;
              const digY = (PRISON_MINE_TY + p.digTargetMy + 0.5) * ts;
              p.waypoints = [
                { x: spineX, y: ribEntryY },
                { x: digX, y: digY },
              ];
            } else {
              // Chegou na parede de terra do túnel: começa a escavar!
              p.isDigging = true;
              p.digTimer = 5.0 + (i % 5) * 1.2;
            }
          }
        } else {
          // Trabalha FORA da mina (isUnderground = false) retirando a terra da boca da mina até o Grande Monte de Terra!
          if (p.isUnderground || p.mode !== "mine_work") {
            p.isUnderground = false;
            p.mode = "mine_work";
            const lane = i - 20; // 0..11
            const startAtMine = lane % 2 === 0;
            p.carryingDirt = startAtMine;
            p.isDigging = false;
            p.x = (CITY_CX + (startAtMine ? 46.2 : 52.8) + (lane % 3) * 0.6 + 0.5) * ts;
            p.y = (CITY_CY + 55.8 + (lane % 4) * 0.7 + 0.5) * ts;
            p.waypoints = [];
          }

          if (p.pauseTimer <= 0 && !_stepWaypoints(p, ts, p.carryingDirt ? 0.86 : 1.0)) {
            const lane = i - 20;
            const rowOff = (lane % 4) * 0.75 - 1.1;
            if (p.carryingDirt) {
              // Estava indo com saco de terra para o Monte de Terra (ou acabou de chegar lá)
              const distToMound = Math.hypot(p.x - (CITY_CX + 53.2) * ts, p.y - (CITY_CY + 57.0) * ts);
              if (distToMound < ts * 2.5) {
                // Despeja a terra no grande monte de terra e volta vazio para a boca da mina!
                p.carryingDirt = false;
                p.pauseTimer = 1.2;
                p.facing = "right";
                p.chatText = (lane === 0 && Math.floor(animTimer) % 7 === 0) ? "Despejando a terra escavada..." : "";
                p.waypoints = [
                  { x: (CITY_CX + 46.2 + (lane % 2) * 0.6 + 0.5) * ts, y: (CITY_CY + 56.5 + rowOff * 0.5 + 0.5) * ts },
                ];
              } else {
                p.waypoints = [
                  { x: (CITY_CX + 52.8 + (lane % 2) * 0.7 + 0.5) * ts, y: (CITY_CY + 56.8 + rowOff + 0.5) * ts },
                ];
              }
            } else {
              // Chegou na boca da mina: pega outro saco cheio de terra dos túneis e leva até o Monte de Terra!
              p.carryingDirt = true;
              p.pauseTimer = 1.0;
              p.facing = "left";
              p.chatText = "";
              p.waypoints = [
                { x: (CITY_CX + 52.8 + (lane % 2) * 0.7 + 0.5) * ts, y: (CITY_CY + 56.8 + rowOff + 0.5) * ts },
              ];
            }
          }
        }
        continue;
      }

      // 3. DENTRO DAS 4 GRANDES CELAS COLETIVAS (Exploram o ambiente e às vezes se aglomeram!)
      const cz = p.cellZone;
      p.isUnderground = false;
      p.carryingDirt = false;
      p.isDigging = false;

      // Garante que está dentro dos limites da própria grande cela coletiva
      const curRx = p.x / ts - 0.5 - CITY_CX;
      const curRy = p.y / ts - 0.5 - CITY_CY;
      if (
        curRx < cz.minRx - 1 ||
        curRx > cz.maxRx + 1 ||
        curRy < cz.aislesRy[0] - 3 ||
        curRy > cz.aislesRy[cz.aislesRy.length - 1] + 3
      ) {
        const snapRx = cz.minRx + 3 + (p.slotInCell * 3) % (cz.maxRx - cz.minRx - 4);
        const snapRy = cz.aislesRy[p.slotInCell % cz.aislesRy.length];
        p.x = (CITY_CX + snapRx + 0.5) * ts;
        p.y = (CITY_CY + snapRy + 0.5) * ts;
        p.waypoints = [];
      }

      // Define se este prisioneiro participa da aglomeração atual da cela (6 dos 8 presos da cela se aglomeram)
      const shouldCluster = isClusterPhase && (p.slotInCell + clusterCycle) % 4 !== 0;
      p.mode = shouldCluster ? "cell_cluster" : "cell_explore";

      if (p.pauseTimer <= 0 && !_stepWaypoints(p, ts, 0.85)) {
        if (shouldCluster) {
          // Ponto de aglomeração (rodinha de prisioneiros conversando dentro da grande cela)
          const cSpotOffsets = [-8, 0, 7];
          const hubRx = cz.clusterRx + cSpotOffsets[(p.cellIdx + clusterCycle) % cSpotOffsets.length];
          const hubRy = cz.aislesRy[(p.cellIdx + clusterCycle) % cz.aislesRy.length];
          const angle = (p.slotInCell / 6) * Math.PI * 2;
          const targetRx = hubRx + Math.cos(angle) * 1.15;
          const targetRy = hubRy + Math.sin(angle) * 0.48;
          const dToHub = Math.hypot(curRx - targetRx, curRy - targetRy);

          if (dToHub > 0.6) {
            p.waypoints = [
              { x: (CITY_CX + targetRx + 0.5) * ts, y: (CITY_CY + targetRy + 0.5) * ts },
            ];
          } else {
            // Já está aglomerado na roda: olha para o centro da roda!
            p.facing = Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))
              ? (Math.cos(angle) > 0 ? "left" : "right")
              : (Math.sin(angle) > 0 ? "up" : "down");
            p.pauseTimer = 2.0 + Math.random() * 2.0;
            p.chatText = (p.slotInCell === 0 && Math.floor(animTimer + p.cellIdx) % 6 === 0)
              ? PRISONER_PHRASES[(p.id + clusterCycle) % PRISONER_PHRASES.length]
              : "";
          }
        } else {
          // Explora o ambiente da grande cela caminhando pelos corredores entre os beliches e grades
          p.chatText = "";
          const nextAisleRy = cz.aislesRy[Math.floor(Math.random() * cz.aislesRy.length)];
          const nextRx = cz.minRx + 2 + Math.random() * (cz.maxRx - cz.minRx - 4);
          p.waypoints = [
            { x: (CITY_CX + curRx + 0.5) * ts, y: (CITY_CY + nextAisleRy + 0.5) * ts },
            { x: (CITY_CX + nextRx + 0.5) * ts, y: (CITY_CY + nextAisleRy + 0.5) * ts },
          ];
          p.pauseTimer = 1.2 + Math.random() * 2.2;
        }
      }
    }

    // =========================================================================
    // B. ATUALIZA O CORONEL, CAPITÃO, 6 TENENTES, CARCEREIROS E SOLDADOS
    // =========================================================================
    const colonel = SOLDIERS[0];
    const captain = SOLDIERS[1];

    for (let i = 0; i < SOLDIERS.length; i++) {
      const s = SOLDIERS[i];
      if (s.pauseTimer > 0) s.pauseTimer = Math.max(0, s.pauseTimer - dt);

      // -----------------------------------------------------------------------
      // 1. ROTINA DO CORONEL (Chefe de todos):
      //    - Manhã (0.24..0.44): Sala de Administração (Sala do Coronel) conversando com o Capitão
      //    - Tarde (0.44..0.65): Anda pela cidade todo dia (Praça Central e Ruas)
      //    - Fim de tarde (0.65..0.75): Volta para o Quartel (Sala do Coronel / Pátio)
      //    - Noite (< 0.24 ou > 0.75): Vai para casa dormir!
      // -----------------------------------------------------------------------
      if (s.role === "colonel") {
        if (isNightShift) {
          if (s.state !== "going_home_night" && s.state !== "sleeping_at_home") {
            _sendSoldierToHouseForNight(s, ts);
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            s.state = "sleeping_at_home";
            s.isInsideHouse = true;
            s.facing = "down";
            s.chatText = "";
          }
        } else if (timeOfDay >= 0.24 && timeOfDay < 0.44) {
          // Manhã na Sala de Administração (Sala do Coronel: rx = -22, ry = 40) esperando/conversando com o Capitão
          if (s.isInsideHouse || s.state === "sleeping_at_home" || s.state === "going_home_night") {
            _wakeSoldierFromHouse(s, ts);
            s.state = "going_to_office";
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            const officeX = (CITY_CX - 22.0 + 0.5) * ts;
            const officeY = (CITY_CY + 40.0 + 0.5) * ts;
            if (Math.hypot(s.x - officeX, s.y - officeY) > ts * 1.2) {
              s.waypoints = [
                { x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.0 + 0.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 },
                { x: officeX, y: officeY },
              ];
            } else {
              s.state = "in_office_waiting_captain";
              s.facing = "right";
              const capDist = captain ? Math.hypot(captain.x - s.x, captain.y - s.y) : 999;
              s.chatText = capDist < ts * 3.5
                ? "Capitão, mantenha os presos escavando a mina sem descanso!"
                : "";
            }
          }
        } else if (timeOfDay >= 0.44 && timeOfDay < 0.65) {
          // Depois de conversar com o Capitão, o Coronel sai do Quartel e anda pela cidade todo dia!
          s.chatText = "";
          if (s.state !== "strolling_city") {
            s.state = "strolling_city";
            s.waypoints = [
              { x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.0 + 0.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 },
              { x: (CITY_CX - 6.0 + 0.5) * ts, y: (CITY_CY + 32.0 + 0.5) * ts },
              { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.0 + 0.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 },
              { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 11.15 + 0.5) * ts },
            ];
          } else if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.95)) {
            _assignStrollDestination(s, ts);
            s.pauseTimer = 1.5;
          }
        } else {
          // Fim de tarde (0.65..0.75): Volta da cidade para o Quartel antes de ir para casa à noite!
          if (s.state !== "returning_to_barracks") {
            s.state = "returning_to_barracks";
            const toGate = _buildStreetRoute(s.x, s.y, 0, 11.15, ts);
            toGate.push({ x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.0 + 0.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 });
            toGate.push({ x: (CITY_CX - 6.0 + 0.5) * ts, y: (CITY_CY + 33.0 + 0.5) * ts });
            toGate.push({ x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.0 + 0.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 });
            toGate.push({ x: (CITY_CX - 22.0 + 0.5) * ts, y: (CITY_CY + 40.0 + 0.5) * ts });
            s.waypoints = toGate;
          } else {
            _stepWaypoints(s, ts, 1.0);
          }
        }
        continue;
      }

      // -----------------------------------------------------------------------
      // 2. ROTINA DO CAPITÃO:
      //    - Vai e volta da Mina Profunda de tempos em tempos até a Sala do Coronel!
      // -----------------------------------------------------------------------
      if (s.role === "captain") {
        if (isNightShift) {
          if (s.state !== "going_home_night" && s.state !== "sleeping_at_home") {
            _sendSoldierToHouseForNight(s, ts);
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            s.state = "sleeping_at_home";
            s.isInsideHouse = true;
            s.facing = "down";
            s.chatText = "";
          }
        } else {
          if (s.isInsideHouse || s.state === "sleeping_at_home" || s.state === "going_home_night") {
            _wakeSoldierFromHouse(s, ts);
            s.state = "duty";
            s.captainPhase = "at_colonel";
            s.captainTimer = 5.0;
          } else if (!_stepWaypoints(s, ts, 1.15)) {
            s.captainTimer -= dt;
            if (s.captainPhase === "at_colonel") {
              s.facing = "left";
              const colDist = colonel ? Math.hypot(colonel.x - s.x, colonel.y - s.y) : 999;
              s.chatText = colDist < ts * 3.5
                ? "Coronel, a escavação nos túneis da mina segue em ritmo total!"
                : "Verificando ordens na Sala do Coronel...";
              if (s.captainTimer <= 0) {
                // Sai da Sala do Coronel e caminha até a Entrada da Mina Profunda!
                s.captainPhase = "to_mine";
                s.chatText = "";
                s.waypoints = [
                  { x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.0 + 0.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 },
                  { x: (CITY_CX - 6.0 + 0.5) * ts, y: (CITY_CY + 31.0 + 0.5) * ts },
                  { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.0 + 0.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 },
                  { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts },
                  { x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts },
                  { x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 56.5 + 0.5) * ts },
                  { x: (CITY_CX + 45.0 + 0.5) * ts, y: (CITY_CY + 57.5 + 0.5) * ts },
                ];
              }
            } else if (s.captainPhase === "to_mine") {
              s.captainPhase = "at_mine";
              s.captainTimer = 6.0;
            } else if (s.captainPhase === "at_mine") {
              s.facing = "right";
              s.chatText = "Mais rápido com essa terra, prisioneiros! Tenentes, vigiem a fila!";
              if (s.captainTimer <= 0) {
                // Volta da Mina Profunda até a Sala do Coronel!
                s.captainPhase = "to_colonel";
                s.chatText = "";
                s.waypoints = [
                  { x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 56.5 + 0.5) * ts },
                  { x: (CITY_CX + 41.5 + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts },
                  { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 26.5 + 0.5) * ts },
                  { x: (CITY_CX + 0.5) * ts, y: (CITY_CY + 28.0 + 0.5) * ts, doorTileTx: CITY_CX, doorTileTy: CITY_CY + 28 },
                  { x: (CITY_CX - 6.0 + 0.5) * ts, y: (CITY_CY + 31.0 + 0.5) * ts },
                  { x: (CITY_CX - 14.0 + 0.5) * ts, y: (CITY_CY + 41.0 + 0.5) * ts, doorTileTx: CITY_CX - 14, doorTileTy: CITY_CY + 41 },
                  { x: (CITY_CX - 19.8 + 0.5) * ts, y: (CITY_CY + 40.0 + 0.5) * ts },
                ];
              }
            } else if (s.captainPhase === "to_colonel") {
              s.captainPhase = "at_colonel";
              s.captainTimer = 6.5;
            }
          }
        }
        continue;
      }

      // -----------------------------------------------------------------------
      // 3. ROTINA DOS 6 TENENTES:
      //    - De manhã cedo (isMarchToMine) e ao entardecer (isMarchToCells):
      //      2 na frente da fila, 2 no meio da fila e 2 no final da fila escoltando os 32 prisioneiros!
      //    - Durante o dia (isMineWorkTime): supervisionam a retirada de terra na Mina Profunda!
      //    - À noite (isNightShift): metade (3 tenentes) vai para casa dormir e retorna de dia!
      // -----------------------------------------------------------------------
      if (s.role === "lieutenant") {
        const lt = s.ltIndex; // 0,1 = frente; 2,3 = meio; 4,5 = final
        if (isMarchToMine || isMarchToCells) {
          s.isInsideHouse = false;
          s.isUnderground = false;
          s.waypoints = [];
          const sideSign = lt % 2 === 0 ? -0.58 : 0.58;
          // Posição exata na fila: 0,1 na frente (dist = 0); 2,3 no meio (dist = 14.4); 4,5 no final (dist = 29.0)
          const distBehindLead = lt < 2 ? 0 : lt < 4 ? 14.4 : 29.0;
          const myDist = marchLeadDist - distBehindLead;
          const pos = _sampleRouteAtDist(myDist, sideSign, ts, isMarchToCells);
          s.x = pos.x;
          s.y = pos.y;
          s.facing = pos.facing;
          s.isMoving = myDist > 0 && myDist < _ROUTE_TOTAL_LEN;
          if (s.isMoving) s.walkPhase += 0.18;
          s.chatText = (lt === 0 && Math.floor(animTimer) % 8 === 0)
            ? "Mantenham a fila dos prisioneiros andando!"
            : "";
          continue;
        }

        if (isMineWorkTime) {
          s.isInsideHouse = false;
          s.isUnderground = false;
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.95)) {
            // Ronda de supervisão ao redor da boca da mina e do grande monte de terra
            const spots = [
              { rx: 44.0, ry: 54.5 },
              { rx: 49.5, ry: 54.5 },
              { rx: 52.0, ry: 59.8 },
              { rx: 44.5, ry: 59.8 },
            ];
            const pick = spots[(lt + Math.floor(animTimer * 0.2)) % spots.length];
            s.waypoints = [
              { x: (CITY_CX + pick.rx + (lt % 2) * 1.2 + 0.5) * ts, y: (CITY_CY + pick.ry + 0.5) * ts },
            ];
            s.pauseTimer = 2.0 + (lt % 3);
            s.facing = pick.ry < 56 ? "down" : "up";
          }
          continue;
        }

        // Horário noturno para os Tenentes: metade vai para casa dormir, metade vigia o Quartel
        if (s.goesHomeAtNight) {
          if (s.state !== "going_home_night" && s.state !== "sleeping_at_home") {
            _sendSoldierToHouseForNight(s, ts);
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            s.state = "sleeping_at_home";
            s.isInsideHouse = true;
            s.facing = "down";
          }
        } else {
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.9)) {
            const pSpots = [
              { rx: -6.0, ry: 33.0 },
              { rx: 6.0,  ry: 33.0 },
              { rx: -6.0, ry: 43.0 },
              { rx: 6.0,  ry: 43.0 },
            ];
            const sp = pSpots[(lt + Math.floor(animTimer * 0.15)) % pSpots.length];
            s.waypoints = [{ x: (CITY_CX + sp.rx + 0.5) * ts, y: (CITY_CY + sp.ry + 0.5) * ts }];
            s.pauseTimer = 2.5;
          }
        }
        continue;
      }

      // -----------------------------------------------------------------------
      // 4. ROTINA DOS SOLDADOS E CARCEREIROS DA MINA E PRISÃO
      //    (Metade vai para as casas dormir à noite e retorna de dia!)
      // -----------------------------------------------------------------------
      if (
        s.role === "prison_corridor_guard" ||
        s.role === "main_gate_guard" ||
        s.role === "mine_entrance_guard" ||
        s.role === "mine_inside_patrol"
      ) {
        if (isNightShift && s.goesHomeAtNight) {
          if (s.state !== "going_home_night" && s.state !== "sleeping_at_home") {
            _sendSoldierToHouseForNight(s, ts);
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            s.state = "sleeping_at_home";
            s.isInsideHouse = true;
            s.facing = "down";
          }
          continue;
        }

        // Se amanheceu e estava dormindo em casa, retorna ao seu posto!
        if (!isNightShift && (s.isInsideHouse || s.state === "sleeping_at_home" || s.state === "going_home_night")) {
          _wakeSoldierFromHouse(s, ts);
          continue;
        }
        if (s.state === "returning_to_duty") {
          if (!_stepWaypoints(s, ts, 1.05)) {
            s.state = "duty";
          }
          continue;
        }

        // Comportamento no posto durante o turno:
        if (s.role === "prison_corridor_guard") {
          // 2 soldados como vigia nos corredores da prisão (patrulham relY de 48 a 72 ao longo das grades das celas)
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.85)) {
            const targetRy = s.patrolStep % 2 === 0 ? 71.5 : 48.5;
            s.patrolStep++;
            s.waypoints = [{ x: (CITY_CX + s.postRx + 0.5) * ts, y: (CITY_CY + targetRy + 0.5) * ts }];
            s.pauseTimer = 1.8;
          }
        } else if (s.role === "main_gate_guard") {
          // 2 soldados na porta principal do quartel
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.75)) {
            const offsetRx = (s.patrolStep % 2 === 0) ? 0 : (s.postRx < 0 ? -1.4 : 1.4);
            s.patrolStep++;
            s.waypoints = [{ x: (CITY_CX + s.postRx + offsetRx + 0.5) * ts, y: (CITY_CY + s.postRy + 0.5) * ts }];
            s.pauseTimer = 3.2;
            s.facing = "up";
          }
        } else if (s.role === "mine_entrance_guard") {
          // 2 soldados na entrada da mina
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.78)) {
            const offsetRy = (s.patrolStep % 2 === 0) ? -1.2 : 1.2;
            s.patrolStep++;
            s.waypoints = [{ x: (CITY_CX + s.postRx + 0.5) * ts, y: (CITY_CY + s.postRy + offsetRy + 0.5) * ts }];
            s.pauseTimer = 2.8;
            s.facing = "down";
          }
        } else if (s.role === "mine_inside_patrol") {
          // 4 soldados dentro da mina fazendo ronda pelos túneis longos de terra (espinha e costelas)!
          s.isUnderground = true;
          if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.92)) {
            const ribList = [14, 29, 44, 59, 74, 89, 104, 119, 134];
            const myRib = ribList[(s.minePatrolIndex * 2 + s.patrolStep) % ribList.length];
            const dir = (s.patrolStep % 2 === 0) ? -1 : 1;
            const ribTargetX = dir * (14 + (s.minePatrolIndex * 3) % 10);
            s.patrolStep++;
            s.waypoints = [
              { x: (PRISON_MINE_TX + 0.5) * ts, y: (PRISON_MINE_TY + myRib + 0.5) * ts },
              { x: (PRISON_MINE_TX + ribTargetX + 0.5) * ts, y: (PRISON_MINE_TY + myRib + 0.5) * ts },
              { x: (PRISON_MINE_TX + 0.5) * ts, y: (PRISON_MINE_TY + myRib + 0.5) * ts },
            ];
            s.pauseTimer = 1.4;
          }
        }
        continue;
      }

      // -----------------------------------------------------------------------
      // 5. SOLDADOS FAZENDO RONDA NA CIDADE (4 soldados de dia e 8 soldados à noite!)
      // -----------------------------------------------------------------------
      if (s.role === "city_patrol_day_night") {
        // Os 4 primeiros fazem ronda nas ruas da cidade de dia e de noite
        s.isInsideHouse = false;
        s.isUnderground = false;
        if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.95)) {
          _assignStrollDestination(s, ts);
          s.pauseTimer = 1.0;
        }
      } else if (s.role === "city_patrol_night_extra") {
        // Os 4 soldados extras da noite: descansam em casa de dia e saem para fazer ronda à noite (totalizando 8 à noite!)
        if (isNightShift) {
          if (s.isInsideHouse || s.state === "resting_day_at_home" || s.state === "going_home_day") {
            const h = s.homeHouse;
            const doorTx = h.cx;
            const doorTy = h.cy + (h.doorOnSouth ? h.halfH : -h.halfH);
            const streetRelY = h.relY < 0 ? -11.15 : 11.15;
            s.waypoints = [
              { x: (doorTx + 0.5) * ts, y: (doorTy + 0.5) * ts, doorTileTx: doorTx, doorTileTy: doorTy, markInside: false },
              { x: (doorTx + 0.5) * ts, y: (CITY_CY + streetRelY + 0.5) * ts, markInside: false },
            ];
            s.state = "night_patrol";
          } else if (s.pauseTimer <= 0 && !_stepWaypoints(s, ts, 0.98)) {
            _assignStrollDestination(s, ts);
            s.pauseTimer = 1.0;
          }
        } else {
          // Durante o dia recolhem-se para casa para que fiquem exatamente 4 soldados em ronda de dia!
          if (!s.isInsideHouse && s.state !== "going_home_day") {
            _sendSoldierToHouseForNight(s, ts);
            s.state = "going_home_day";
          } else if (!_stepWaypoints(s, ts, 1.0)) {
            s.state = "resting_day_at_home";
            s.isInsideHouse = true;
          }
        }
      }
    }
  }

  // Atualiza a rotina de todas as moradoras, prisioneiros e soldados e retorna os itens de renderização ordenados por Y
  function updateAndGetCitizenRenderItems(ctx, tileSize, player, timeOfDay, animTimer, viewLeft, viewRight, viewTop, viewBottom, isUnderground = false) {
    const ts = tileSize || 36;
    _initCitizens(ts);

    // Só processa se o jogador estiver próximo do território da Vila Glacial ou dentro da Mina Profunda
    if (player) {
      const distToCity = Math.hypot(player.x - CITY_CX * ts, player.y - CITY_CY * ts);
      const distToMine = Math.hypot(player.x - PRISON_MINE_TX * ts, player.y - PRISON_MINE_TY * ts);
      if (distToCity > (CITY_RADIUS + 95) * ts && distToMine > 190 * ts) return [];
    }

    // Decrementa timers de portas abertas pelas moradoras / soldados / prisioneiros
    for (const [k, v] of _activeDoorwayTimers.entries()) {
      if (v <= 1) _activeDoorwayTimers.delete(k);
      else _activeDoorwayTimers.set(k, v - 1);
    }

    const dt = 0.016;
    const isNight = timeOfDay < 0.24 || timeOfDay > 0.76;
    const activePlayerHouseId = (!isUnderground && player) ? getActiveHouseForPlayer(player.x, player.y, ts) : null;

    // Atualiza os 32 Prisioneiros e todos os Soldados/Oficiais (tanto na superfície quanto na mina subterrânea!)
    _updatePrisonersAndSoldiers(ts, dt, timeOfDay, animTimer);

    for (let i = 0; i < CITIZENS.length; i++) {
      const c = CITIZENS[i];
      if (c.chatCooldown > 0) c.chatCooldown = Math.max(0, c.chatCooldown - dt);

      // 1. REGRA DA NOITE: Ao anoitecer, todas voltam para passar a noite em sua casa!
      if (isNight) {
        if (c.state !== "returning_home_night" && c.state !== "night_at_home") {
          _sendCitizenHome(c, ts, true);
        }
      } else {
        if (c.state === "night_at_home" || c.state === "returning_home_night") {
          c.state = c.isInsideHouse ? "inside_home" : "strolling";
          c.stateTimer = 1.5 + (c.id % 6) * 0.8;
          if (!c.isInsideHouse) _assignStrollDestination(c, ts);
        }
      }

      if (c.state === "interacting") {
        c.isMoving = false;
        c.stateTimer -= dt;
        if (c.stateTimer <= 0) {
          c.state = "strolling";
          c.chatPartnerId = null;
          c.chatText = "";
          c.chatCooldown = 10 + Math.random() * 10;
          if (!c.waypoints || c.waypoints.length === 0) {
            _assignStrollDestination(c, ts);
          }
        }
        continue;
      }

      if (c.pauseTimer > 0) {
        c.pauseTimer -= dt;
        c.isMoving = false;
        continue;
      }

      if (c.waypoints && c.waypoints.length > 0) {
        const wp = c.waypoints[0];
        const dx = wp.x - c.x;
        const dy = wp.y - c.y;
        const dist = Math.hypot(dx, dy);

        const doorWorldX = (c.doorTx + 0.5) * ts;
        const doorWorldY = (c.doorTy + 0.5) * ts;
        if (Math.hypot(c.x - doorWorldX, c.y - doorWorldY) < ts * 1.15) {
          _activeDoorwayTimers.set(`${c.doorTx},${c.doorTy}`, 12);
        }

        if (dist <= c.speed * 1.4) {
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
              c.stateTimer = 8 + Math.random() * 10;
              c.pauseTimer = 1.5;
            } else if (c.state === "exiting_house") {
              c.isInsideHouse = false;
              c.state = "strolling";
              c.stateTimer = 25 + Math.random() * 30;
              _assignStrollDestination(c, ts);
            } else if (c.state === "strolling") {
              c.pauseTimer = 1.2 + Math.random() * 2.5;
            } else if (c.state === "inside_home") {
              c.pauseTimer = 1.8 + Math.random() * 2.2;
            }
          }
        } else {
          const step = c.speed;
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
          c.isMoving = true;
          c.walkPhase += 0.16;
          if (Math.abs(dx) > Math.abs(dy)) {
            c.facing = dx < 0 ? "left" : "right";
          } else {
            c.facing = dy < 0 ? "up" : "down";
          }
        }
      } else {
        c.isMoving = false;
      }

      if (!isNight) {
        if (c.state === "inside_home") {
          c.stateTimer -= dt;
          if (c.stateTimer <= 0) {
            _sendCitizenOutside(c, ts);
          } else if (!c.waypoints || c.waypoints.length === 0) {
            const spots = [
              { tx: c.livingTx, ty: c.livingTy },
              { tx: c.kitchenTx, ty: c.kitchenTy },
              { tx: c.bedTx, ty: c.bedTy },
            ];
            const pick = spots[Math.floor(Math.random() * spots.length)];
            c.waypoints = [
              { x: (c.hallTx + 0.5) * ts, y: (c.hallTy + 0.5) * ts },
              { x: (pick.tx + 0.5) * ts, y: (pick.ty + 0.5) * ts },
            ];
          }
        } else if (c.state === "strolling") {
          c.stateTimer -= dt;
          if (c.stateTimer <= 0) {
            _sendCitizenHome(c, ts, false);
          } else if (!c.waypoints || c.waypoints.length === 0) {
            _assignStrollDestination(c, ts);
          }

          if (c.chatCooldown <= 0 && !c.isInsideHouse) {
            for (let j = i + 1; j < CITIZENS.length; j++) {
              const other = CITIZENS[j];
              if (
                !other.isInsideHouse &&
                other.state === "strolling" &&
                other.chatCooldown <= 0
              ) {
                const d = Math.hypot(c.x - other.x, c.y - other.y);
                if (d >= 16 && d <= 42) {
                  const chatDur = 4.5 + Math.random() * 2.5;
                  c.state = "interacting";
                  other.state = "interacting";
                  c.stateTimer = chatDur;
                  other.stateTimer = chatDur;
                  c.chatPartnerId = other.id;
                  other.chatPartnerId = c.id;
                  c.isMoving = false;
                  other.isMoving = false;

                  const cdx = other.x - c.x;
                  const cdy = other.y - c.y;
                  if (Math.abs(cdx) >= Math.abs(cdy)) {
                    c.facing = cdx >= 0 ? "right" : "left";
                    other.facing = cdx >= 0 ? "left" : "right";
                  } else {
                    c.facing = cdy >= 0 ? "down" : "up";
                    other.facing = cdy >= 0 ? "up" : "down";
                  }

                  c.chatText = CHAT_PHRASES[(c.id + other.id + Math.floor(animTimer)) % CHAT_PHRASES.length];
                  other.chatText = "";
                  break;
                }
              }
            }
          }
        }
      }
    }

    const items = [];

    // 1. Renderiza as moradoras (apenas na superfície)
    if (!isUnderground) {
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
          draw: () => CITIZEN_KINDS["snow-citizen"].draw(ctx, c, timeOfDay, animTimer, player),
        });
      }
    }

    // 2. Renderiza os 32 Prisioneiros (na superfície ou dentro da Mina Profunda, conforme p.isUnderground)
    for (let i = 0; i < PRISONERS.length; i++) {
      const p = PRISONERS[i];
      if (!!p.isUnderground !== !!isUnderground) continue;
      if (
        p.x < viewLeft - 48 ||
        p.x > viewRight + 48 ||
        p.y < viewTop - 48 ||
        p.y > viewBottom + 48
      ) {
        continue;
      }
      // [PERF] Se o prisioneiro está dentro da sua cela coletiva coberta pelo telhado e o jogador não está na mesma cela,
      // pula o desenho (o telhado cobre toda a cela!)
      if (
        !isUnderground &&
        (p.mode === "cell_explore" || p.mode === "cell_cluster") &&
        p.cellZone &&
        activePlayerHouseId !== p.cellZone.roofId
      ) {
        continue;
      }
      items.push({
        y: p.y,
        draw: () => CITIZEN_KINDS["snow-prisoner"].draw(ctx, p, timeOfDay, animTimer, player),
      });
    }

    // 3. Renderiza todos os Soldados, Carcereiros, Tenentes, Capitão e Coronel
    for (let i = 0; i < SOLDIERS.length; i++) {
      const s = SOLDIERS[i];
      if (!!s.isUnderground !== !!isUnderground) continue;
      if (
        s.x < viewLeft - 48 ||
        s.x > viewRight + 48 ||
        s.y < viewTop - 48 ||
        s.y > viewBottom + 48
      ) {
        continue;
      }
      if (!isUnderground && s.isInsideHouse && activePlayerHouseId !== s.homeHouseId) {
        continue;
      }
      // [PERF] Se o Coronel ou Capitão está dentro da Sala de Administração (barracks_west) e o telhado dessa ala está fechado, pula o desenho
      if (
        !isUnderground &&
        (s.role === "colonel" || s.role === "captain") &&
        activePlayerHouseId !== "barracks_west"
      ) {
        const srx = s.x / ts - 0.5 - CITY_CX;
        const sry = s.y / ts - 0.5 - CITY_CY;
        if (srx > -34 && srx < -14 && sry > 29 && sry < 45) {
          continue;
        }
      }
      items.push({
        y: s.y,
        draw: () => CITIZEN_KINDS["snow-soldier"].draw(ctx, s, timeOfDay, animTimer, player),
      });
    }

    return items;
  }

  
  
  
  // Exporta a definição
  const SnowPeakCity = {
    // posicao dinamica (getters): muda quando setSeed escolhe o bioma da seed
    get centerX() {
      return CITY_CX;
    },
    get centerY() {
      return CITY_CY;
    },
    radius: CITY_RADIUS,
    get biomeRadius() {
      return _biomeRadius;
    },
    get siteInfo() {
      return _siteInfo;
    },
    get barracksStairTx() {
      return BARRACKS_STAIR_TX;
    },
    get barracksStairTy() {
      return BARRACKS_STAIR_TY;
    },
    get prisonMineTx() {
      return PRISON_MINE_TX;
    },
    get prisonMineTy() {
      return PRISON_MINE_TY;
    },
    _withoutBiomeOverride,
    houses: HOUSES,
    barracksRoofs: BARRACKS_ROOFS,
    citizens: CITIZENS,
    setSeed,
    isCityTerritory,
    isCityBiomeArea,
    isPrisonMineArea,
    getHouseAt,
    getActiveHouseForPlayer,
    getCellAt,
    getUndergroundCellAt,
    isDoorwayUsedByCitizen,
    interactWithNearbyCitizen,
    updateAndGetCitizenRenderItems,
  };

  G.SnowPeakCity = SnowPeakCity;
  window.SnowPeakCity = SnowPeakCity;
})(window.Game);
