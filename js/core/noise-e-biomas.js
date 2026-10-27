/* js/core/noise-e-biomas.js
 * Ruido (SimplexNoise), enum de biomas (BiomeId), tabela de biomas (BIOMES), funcoes de bioma (Jp, Fs) e dificuldade (RESOURCE_DIFFICULTY).
 * Trecho de legacy/app.original.js (linhas 15535-16197); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  ((vt.GRAD3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ]),
    (vt.F2 = 0.5 * (Math.sqrt(3) - 1)),
    (vt.G2 = (3 - Math.sqrt(3)) / 6));
  let SimplexNoise = vt;
  var BiomeId = ((e) => (
    (e.DEEP_OCEAN = "DEEP_OCEAN"),
    (e.COAST_WATER = "COAST_WATER"),
    (e.BEACH = "BEACH"),
    (e.MEADOW = "MEADOW"),
    (e.FOREST = "FOREST"),
    (e.DEEP_FOREST = "DEEP_FOREST"),
    (e.SWAMP = "SWAMP"),
    (e.SAVANNA = "SAVANNA"),
    (e.DESERT = "DESERT"),
    (e.OASIS = "OASIS"),
    (e.CANYON = "CANYON"),
    (e.SNOW_TAIGA = "SNOW_TAIGA"),
    (e.GLACIER = "GLACIER"),
    (e.SNOW_PEAK = "SNOW_PEAK"),
    (e.VOLCANIC = "VOLCANIC"),
    (e.OASIS_LAKE = "OASIS_LAKE"),
    (e.MEADOW_LAKE = "MEADOW_LAKE"),
    (e.FOREST_LAKE = "FOREST_LAKE"),
    (e.SWAMP_LAKE = "SWAMP_LAKE"),
    (e.SAVANNA_LAKE = "SAVANNA_LAKE"),
    (e.TAIGA_LAKE = "TAIGA_LAKE"),
    (e.GLACIER_LAKE = "GLACIER_LAKE"),
    (e.CAVE_FLOOR = "CAVE_FLOOR"),
    (e.CAVE_CRYSTAL = "CAVE_CRYSTAL"),
    (e.CAVE_MUSHROOM = "CAVE_MUSHROOM"),
    (e.CAVE_LAKE = "CAVE_LAKE"),
    (e.CAVE_WALL = "CAVE_WALL"),
    (e.DESERT_CAVE_FLOOR = "DESERT_CAVE_FLOOR"),
    (e.DESERT_CAVE_WALL = "DESERT_CAVE_WALL"),
    (e.MOUNTAIN_25D = "MOUNTAIN_25D"),
    e
  ))(BiomeId || {});
  const BIOMES = {
    MOUNTAIN_25D: {
      id: "MOUNTAIN_25D",
      namePt: "⛰️ Montanhas 2.5D (Paredões)",
      category: "mountain",
      groundColor: "#64748b",
      groundAccentColor: "#475569",
      treeColor: "#1e3a2f",
      treeTrunkColor: "#3e2723",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.9,
      treeDensity: 0.035,
      floraDensity: 0.025,
      rockDensity: 0.08,
      propType: "pine",
      ambientParticle: "leaf",
      descriptionPt:
        "Montanhas 2.5D imponentes esculpidas em patamares rochosos e grandes paredões verticais de granito com passagens naturais.",
    },
    DEEP_OCEAN: {
      id: "DEEP_OCEAN",
      namePt: "Oceano Profundo",
      category: "water",
      groundColor: "#0c223f",
      groundAccentColor: "#1e3a8a",
      waterColor: "#0c223f",
      treeColor: "#1e3a8a",
      treeTrunkColor: "#172554",
      hasWater: !0,
      passable: !1,
      moveSpeedMultiplier: 0.45,
      treeDensity: 0,
      floraDensity: 0,
      rockDensity: 0.005,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt: "Águas abissais misteriosas de correntezas fortes.",
    },
    COAST_WATER: {
      id: "COAST_WATER",
      namePt: "Águas Rasas",
      category: "water",
      groundColor: "#0284c7",
      groundAccentColor: "#38bdf8",
      waterColor: "#0284c7",
      treeColor: "#0369a1",
      treeTrunkColor: "#0c4a6e",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.65,
      treeDensity: 0,
      floraDensity: 0.01,
      rockDensity: 0.01,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt: "Mar calmo cristalino de águas azul-turquesa.",
    },
    BEACH: {
      id: "BEACH",
      namePt: "Praia Tropical",
      category: "land",
      groundColor: "#e0c078",
      groundAccentColor: "#d4b062",
      treeColor: "#15803d",
      treeTrunkColor: "#78350f",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.95,
      treeDensity: 0.02,
      floraDensity: 0.04,
      rockDensity: 0.02,
      propType: "palm",
      ambientParticle: "sand",
      descriptionPt: "Areias douradas pontilhadas por palmeiras tropicais.",
    },
    MEADOW: {
      id: "MEADOW",
      namePt: "Planície Florida",
      category: "land",
      groundColor: "#5fa743",
      groundAccentColor: "#6cb64d",
      treeColor: "#2e7d32",
      treeTrunkColor: "#5c4033",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0.035,
      floraDensity: 0.12,
      rockDensity: 0.015,
      propType: "oak",
      ambientParticle: "leaf",
      descriptionPt:
        "Campos verdejantes repletos de flores silvestres e brisa suave.",
    },
    FOREST: {
      id: "FOREST",
      namePt: "Floresta Temperada",
      category: "land",
      groundColor: "#458532",
      groundAccentColor: "#3c752b",
      treeColor: "#1b5e20",
      treeTrunkColor: "#4a3525",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.95,
      treeDensity: 0.11,
      floraDensity: 0.08,
      rockDensity: 0.025,
      propType: "oak",
      ambientParticle: "leaf",
      descriptionPt:
        "Bosques densos com carvalhos frondosos e clareiras escondidas.",
    },
    DEEP_FOREST: {
      id: "DEEP_FOREST",
      namePt: "Floresta Ancestral",
      category: "land",
      groundColor: "#2d6124",
      groundAccentColor: "#24501d",
      treeColor: "#144618",
      treeTrunkColor: "#382415",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.85,
      treeDensity: 0.18,
      floraDensity: 0.09,
      rockDensity: 0.035,
      propType: "oak",
      ambientParticle: "firefly",
      descriptionPt:
        "Árvores colossais milenares envoltas em mistério e vaga-lumes.",
    },
    SWAMP: {
      id: "SWAMP",
      namePt: "Pântano Místico",
      category: "land",
      groundColor: "#4a5b3a",
      groundAccentColor: "#3c4b2e",
      treeColor: "#2f4124",
      treeTrunkColor: "#342f22",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.75,
      treeDensity: 0.09,
      floraDensity: 0.11,
      rockDensity: 0.03,
      propType: "willow",
      ambientParticle: "firefly",
      descriptionPt:
        "Solos encharcados com salgueiros chorões, cogumelos e névoa.",
    },
    SAVANNA: {
      id: "SAVANNA",
      namePt: "Savana Árida",
      category: "land",
      groundColor: "#bfa14c",
      groundAccentColor: "#b0923f",
      treeColor: "#6b7a2d",
      treeTrunkColor: "#6d4c41",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0.025,
      floraDensity: 0.05,
      rockDensity: 0.03,
      propType: "oak",
      ambientParticle: "leaf",
      descriptionPt: "Campos abertos de grama seca sob o sol radiante.",
    },
    DESERT: {
      id: "DESERT",
      namePt: "Deserto Dourado",
      category: "land",
      groundColor: "#dfb76c",
      groundAccentColor: "#cfa557",
      treeColor: "#2d6a4f",
      treeTrunkColor: "#1b4332",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.85,
      treeDensity: 0.015,
      floraDensity: 0.01,
      rockDensity: 0.03,
      propType: "cactus",
      ambientParticle: "sand",
      descriptionPt:
        "Vastas dunas de areia fina, cactos saguaro e rochas esculpidas.",
    },
    OASIS: {
      id: "OASIS",
      namePt: "Oásis do Deserto",
      category: "land",
      groundColor: "#4ade80",
      groundAccentColor: "#22c55e",
      waterColor: "#0284c7",
      treeColor: "#15803d",
      treeTrunkColor: "#78350f",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0.08,
      floraDensity: 0.14,
      rockDensity: 0.015,
      propType: "palm",
      ambientParticle: "leaf",
      descriptionPt:
        "Um oásis paradisíaco no coração do deserto, com palmeiras verdejantes e nascentes cristalinas.",
    },
    CANYON: {
      id: "CANYON",
      namePt: "Cânion Vermelho",
      category: "mountain",
      groundColor: "#b45309",
      groundAccentColor: "#92400e",
      treeColor: "#78350f",
      treeTrunkColor: "#451a03",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.85,
      treeDensity: 0.005,
      floraDensity: 0.01,
      rockDensity: 0.12,
      propType: "none",
      ambientParticle: "sand",
      descriptionPt:
        "Profundas gargantas esculpidas em arenito terracota, cercadas por paredões de rocha avermelhada.",
    },
    SNOW_TAIGA: {
      id: "SNOW_TAIGA",
      namePt: "Taiga Nevada",
      category: "land",
      groundColor: "#d6e5ea",
      groundAccentColor: "#bfd5dd",
      treeColor: "#1d433b",
      treeTrunkColor: "#4a3b32",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.9,
      treeDensity: 0.13,
      floraDensity: 0.03,
      rockDensity: 0.03,
      propType: "pine",
      ambientParticle: "snow",
      descriptionPt:
        "Florestas gélidas com pinheiros cobertos por neve cintilante.",
    },
    GLACIER: {
      id: "GLACIER",
      namePt: "Geleiras Ancestrais",
      category: "mountain",
      groundColor: "#e0f2fe",
      groundAccentColor: "#bae6fd",
      waterColor: "#38bdf8",
      treeColor: "#0284c7",
      treeTrunkColor: "#0369a1",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.8,
      treeDensity: 0.005,
      floraDensity: 0.005,
      rockDensity: 0.07,
      propType: "pine",
      ambientParticle: "snow",
      descriptionPt:
        "Vastas extensões de gelo azul eterno e fendas glaciais esculpidas por milênios.",
    },
    SNOW_PEAK: {
      id: "SNOW_PEAK",
      namePt: "Picos Glaciais",
      category: "mountain",
      groundColor: "#f1f5f9",
      groundAccentColor: "#cbd5e1",
      treeColor: "#334155",
      treeTrunkColor: "#1e293b",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.75,
      treeDensity: 0.01,
      floraDensity: 0.01,
      rockDensity: 0.09,
      propType: "pine",
      ambientParticle: "snow",
      descriptionPt:
        "Cordilheiras alcantiladas com ventos cortantes e gelo eterno.",
    },
    VOLCANIC: {
      id: "VOLCANIC",
      namePt: "Vulcão da Ilha",
      category: "mountain",
      groundColor: "#292524",
      groundAccentColor: "#dc2626",
      treeColor: "#1c1917",
      treeTrunkColor: "#0c0a09",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.8,
      treeDensity: 0.01,
      floraDensity: 0.005,
      rockDensity: 0.09,
      propType: "burnt",
      ambientParticle: "spark",
      descriptionPt:
        "Cratera vulcânica imponente com rochas de basalto, rios de lava e cinzas crepitantes.",
    },
    OASIS_LAKE: {
      id: "OASIS_LAKE",
      namePt: "Nascente do Oásis",
      category: "water",
      groundColor: "#0284c7",
      groundAccentColor: "#22d3ee",
      waterColor: "#06b6d4",
      treeColor: "#0284c7",
      treeTrunkColor: "#0891b2",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.7,
      treeDensity: 0,
      floraDensity: 0.04,
      rockDensity: 0.01,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt:
        "Nascente cristalina com águas azul-turquesa, lótus floridas e palmeiras na margem.",
    },
    MEADOW_LAKE: {
      id: "MEADOW_LAKE",
      namePt: "Lago Campestre",
      category: "water",
      groundColor: "#0284c7",
      groundAccentColor: "#38bdf8",
      waterColor: "#0ea5e9",
      treeColor: "#0284c7",
      treeTrunkColor: "#0369a1",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.65,
      treeDensity: 0,
      floraDensity: 0.03,
      rockDensity: 0.015,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt:
        "Grande lago límpido de águas calmas, nenúfares flutuantes e brisa suave de planície.",
    },
    FOREST_LAKE: {
      id: "FOREST_LAKE",
      namePt: "Lago da Floresta",
      category: "water",
      groundColor: "#0f766e",
      groundAccentColor: "#14b8a6",
      waterColor: "#0d9488",
      treeColor: "#0f766e",
      treeTrunkColor: "#115e59",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.65,
      treeDensity: 0,
      floraDensity: 0.03,
      rockDensity: 0.02,
      propType: "none",
      ambientParticle: "firefly",
      descriptionPt:
        "Vasto lago de águas esmeralda-azuladas, envolto pelas copas das árvores e reflexos tranquilos.",
    },
    SWAMP_LAKE: {
      id: "SWAMP_LAKE",
      namePt: "Lago Pantanoso",
      category: "water",
      groundColor: "#14532d",
      groundAccentColor: "#15803d",
      waterColor: "#166534",
      treeColor: "#14532d",
      treeTrunkColor: "#1e3a1e",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.58,
      treeDensity: 0,
      floraDensity: 0.04,
      rockDensity: 0.02,
      propType: "none",
      ambientParticle: "firefly",
      descriptionPt:
        "Alagadiço denso com águas musgosas, lentilhas d’água e vapores misteriosos.",
    },
    SAVANNA_LAKE: {
      id: "SAVANNA_LAKE",
      namePt: "Bebedouro da Savana",
      category: "water",
      groundColor: "#0369a1",
      groundAccentColor: "#d97706",
      waterColor: "#0284c7",
      treeColor: "#0369a1",
      treeTrunkColor: "#b45309",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.65,
      treeDensity: 0,
      floraDensity: 0.02,
      rockDensity: 0.02,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt:
        "Vasto bebedouro natural de águas terrosas onde a vida da savana se concentra sob o sol.",
    },
    TAIGA_LAKE: {
      id: "TAIGA_LAKE",
      namePt: "Lago Boreal",
      category: "water",
      groundColor: "#0284c7",
      groundAccentColor: "#e0f2fe",
      waterColor: "#0369a1",
      treeColor: "#0284c7",
      treeTrunkColor: "#0c4a6e",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.62,
      treeDensity: 0,
      floraDensity: 0.015,
      rockDensity: 0.025,
      propType: "none",
      ambientParticle: "snow",
      descriptionPt:
        "Lago alpino de águas azul-safira com margens nevadas e ar puro cortante.",
    },
    GLACIER_LAKE: {
      id: "GLACIER_LAKE",
      namePt: "Lago Glacial",
      category: "water",
      groundColor: "#0284c7",
      groundAccentColor: "#38bdf8",
      waterColor: "#06b6d4",
      treeColor: "#0284c7",
      treeTrunkColor: "#0c4a6e",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.55,
      treeDensity: 0,
      floraDensity: 0,
      rockDensity: 0.03,
      propType: "none",
      ambientParticle: "snow",
      descriptionPt:
        "Águas de degelo azul-ciano brilhantes com blocos flutuantes de gelo e névoa ártica.",
    },
    CAVE_FLOOR: {
      id: "CAVE_FLOOR",
      namePt: "Túnel de Pedra Subterrâneo",
      category: "cave",
      groundColor: "#1c1917",
      groundAccentColor: "#292524",
      treeColor: "#44403c",
      treeTrunkColor: "#292524",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0,
      floraDensity: 0.02,
      rockDensity: 0.05,
      propType: "none",
      ambientParticle: "spark",
      descriptionPt:
        "Galerias rochosas escavadas nas entranhas da terra antiga.",
    },
    CAVE_CRYSTAL: {
      id: "CAVE_CRYSTAL",
      namePt: "Câmara dos Cristais Radiantes",
      category: "cave",
      groundColor: "#1e1b4b",
      groundAccentColor: "#312e81",
      treeColor: "#a855f7",
      treeTrunkColor: "#6b21a8",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0,
      floraDensity: 0.05,
      rockDensity: 0.08,
      propType: "none",
      ambientParticle: "spark",
      descriptionPt:
        "Salão mágico com drusas de ametista e safira emitindo luz estelar.",
    },
    CAVE_MUSHROOM: {
      id: "CAVE_MUSHROOM",
      namePt: "Gruta dos Fungos Bioluminescentes",
      category: "cave",
      groundColor: "#042f2e",
      groundAccentColor: "#115e59",
      treeColor: "#14b8a6",
      treeTrunkColor: "#0f766e",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 0.95,
      treeDensity: 0,
      floraDensity: 0.15,
      rockDensity: 0.03,
      propType: "none",
      ambientParticle: "firefly",
      descriptionPt:
        "Gruta úmida repleta de esporos fluorescentes verde-esmeralda.",
    },
    CAVE_LAKE: {
      id: "CAVE_LAKE",
      namePt: "Lago das Profundezas",
      category: "water",
      groundColor: "#0f172a",
      groundAccentColor: "#0284c7",
      waterColor: "#0369a1",
      treeColor: "#0284c7",
      treeTrunkColor: "#0c4a6e",
      hasWater: !0,
      passable: !0,
      moveSpeedMultiplier: 0.6,
      treeDensity: 0,
      floraDensity: 0.01,
      rockDensity: 0.02,
      propType: "none",
      ambientParticle: "bubble",
      descriptionPt:
        "Águas límpidas subterrâneas onde gotas ecoam do teto de estalactites.",
    },
    CAVE_WALL: {
      id: "CAVE_WALL",
      namePt: "Parede Rochosa das Profundezas",
      category: "cave",
      groundColor: "#0c0a09",
      groundAccentColor: "#1c1917",
      treeColor: "#292524",
      treeTrunkColor: "#1c1917",
      hasWater: !1,
      passable: !1,
      moveSpeedMultiplier: 0,
      treeDensity: 0,
      floraDensity: 0,
      rockDensity: 0,
      propType: "none",
      ambientParticle: "none",
      descriptionPt:
        "Maciço rochoso ancestral impenetrável que sustenta o teto da caverna.",
    },
    DESERT_CAVE_FLOOR: {
      id: "DESERT_CAVE_FLOOR",
      namePt: "Túnel Arenoso do Deserto",
      category: "cave",
      groundColor: "#8c6538",
      groundAccentColor: "#b2854b",
      treeColor: "#593d1e",
      treeTrunkColor: "#3d2612",
      hasWater: !1,
      passable: !0,
      moveSpeedMultiplier: 1,
      treeDensity: 0,
      floraDensity: 0,
      rockDensity: 0.02,
      propType: "none",
      ambientParticle: "sand",
      descriptionPt:
        "Túneis estreitos de arenito e solo árido sob as dunas escaldantes do deserto.",
    },
    DESERT_CAVE_WALL: {
      id: "DESERT_CAVE_WALL",
      namePt: "Paredão de Arenito das Profundezas",
      category: "cave",
      groundColor: "#4a321a",
      groundAccentColor: "#6b4725",
      treeColor: "#332010",
      treeTrunkColor: "#221307",
      hasWater: !1,
      passable: !1,
      moveSpeedMultiplier: 0,
      treeDensity: 0,
      floraDensity: 0,
      rockDensity: 0,
      propType: "none",
      ambientParticle: "none",
      descriptionPt:
        "Paredões compactos de arenito sedimentar que sustentam o teto dos túneis estreitos do deserto.",
    },
  };
  if (typeof window !== "undefined") {
    window.BiomeId = BiomeId;
    window.BIOMES = BIOMES;
  }
  function Jp(e, t, l, o) {
    return o != null && o.isIsland
      ? o.isVolcano && o.volcanoCore
        ? BIOMES.VOLCANIC
        : e < 0.44
          ? BIOMES.BEACH
          : e > 0.75 && o.isVolcano
            ? BIOMES.VOLCANIC
            : l >= 0.52
              ? BIOMES.SAVANNA
              : BIOMES.MEADOW
      : e < 0.27
        ? BIOMES.DEEP_OCEAN
        : e < 0.35
          ? BIOMES.COAST_WATER
          : e < 0.42
            ? BIOMES.BEACH
            : e > 0.52 && l < 0.35
              ? BIOMES.SNOW_PEAK
              : e > 0.67 && l >= 0.35 && l <= 0.7
                ? BIOMES.MOUNTAIN_25D
                : l >= 0.72
                ? e < 0.48
                  ? BIOMES.SAVANNA
                  : (o == null ? void 0 : o.oasisVal) !== void 0 &&
                      o.oasisVal > 0.68
                    ? o.oasisVal > 0.81
                      ? BIOMES.OASIS_LAKE
                      : BIOMES.OASIS
                    : (o == null ? void 0 : o.canyonVal) !== void 0 &&
                        o.canyonVal > 0.65
                      ? BIOMES.CANYON
                      : BIOMES.DESERT
                : l >= 0.54
                  ? e >= 0.48 &&
                    e <= 0.66 &&
                    (o == null ? void 0 : o.lakeVal) !== void 0 &&
                    o.lakeVal > 0.76
                    ? BIOMES.SAVANNA_LAKE
                    : BIOMES.SAVANNA
                  : l >= 0.42
                    ? e >= 0.48 &&
                      e <= 0.66 &&
                      (o == null ? void 0 : o.lakeVal) !== void 0 &&
                      o.lakeVal > 0.73
                      ? BIOMES.MEADOW_LAKE
                      : BIOMES.MEADOW
                    : l >= 0.24
                      ? e < 0.47
                        ? BIOMES.MEADOW
                        : (o == null ? void 0 : o.swampVal) !== void 0 &&
                            o.swampVal > 0.63 &&
                            e < 0.64 &&
                            l >= 0.27 &&
                            l <= 0.39
                          ? (o == null ? void 0 : o.lakeVal) !== void 0 &&
                            o.lakeVal > 0.72
                            ? BIOMES.SWAMP_LAKE
                            : BIOMES.SWAMP
                          : e >= 0.48 &&
                              e <= 0.68 &&
                              (o == null ? void 0 : o.lakeVal) !== void 0 &&
                              o.lakeVal > 0.7
                            ? BIOMES.FOREST_LAKE
                            : t > 0.6
                              ? BIOMES.DEEP_FOREST
                              : BIOMES.FOREST
                      : l >= 0.12
                        ? e >= 0.48 &&
                          e <= 0.62 &&
                          (o == null ? void 0 : o.lakeVal) !== void 0 &&
                          o.lakeVal > 0.73
                          ? BIOMES.TAIGA_LAKE
                          : BIOMES.SNOW_TAIGA
                        : e > 0.62
                          ? BIOMES.SNOW_PEAK
                          : e >= 0.47 &&
                              e <= 0.6 &&
                              (o == null ? void 0 : o.lakeVal) !== void 0 &&
                              o.lakeVal > 0.75
                            ? BIOMES.GLACIER_LAKE
                            : BIOMES.GLACIER;
  }
  const RESOURCE_DIFFICULTY = {
    facil: { label: "Fácil", spawnChance: 0.38 },
    media: { label: "Média", spawnChance: 0.16 },
  };
  function Fs(e, t, l, o) {
    return ((c) =>
      !!c.biome.hasWater &&
      c.biome.id !== BiomeId.DEEP_OCEAN &&
      c.biome.id !== BiomeId.COAST_WATER)(o)
      ? l.hash2D(Math.floor(e / 3), Math.floor(t / 3), 619) > 0.52
      : !1;
  }
