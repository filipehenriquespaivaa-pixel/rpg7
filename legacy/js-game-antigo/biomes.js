/**
 * biomes.js - Definição dos Biomas, Cores de Terreno e Lógica Procedural
 * Namespace: window.Game.Biomes, window.Game.BIOMES, window.Game.getBiome
 */
window.Game = window.Game || {};

(function (G) {
  'use strict';

  const BIOMES = {
    DEEP_OCEAN: {
      id: 'DEEP_OCEAN',
      name: 'Oceano Profundo',
      category: 'ocean',
      ground: '#0c223f',
      accent: '#1e3a8a',
      hasWater: true,
      passable: false,
      desc: 'Águas abissais profundas com correntes fortes.'
    },
    COAST_WATER: {
      id: 'COAST_WATER',
      name: 'Águas Rasas',
      category: 'water',
      ground: '#0284c7',
      accent: '#38bdf8',
      hasWater: true,
      passable: false,
      desc: 'Costa cristalina de águas calmas azul-turquesa.'
    },
    BEACH: {
      id: 'BEACH',
      name: 'Praia Dourada',
      category: 'coastal',
      ground: '#e0c078',
      accent: '#d4b062',
      hasWater: false,
      passable: true,
      prop: 'palm',
      desc: 'Areias suaves com conchas e palmeiras tropicais.'
    },
    MEADOW: {
      id: 'MEADOW',
      name: 'Planície Florida',
      category: 'plains',
      ground: '#5fa743',
      accent: '#6cb64d',
      hasWater: false,
      passable: true,
      prop: 'oak',
      desc: 'Campos verdejantes com flores silvestres e brisa suave.'
    },
    FOREST: {
      id: 'FOREST',
      name: 'Floresta Temperada',
      category: 'forest',
      ground: '#458532',
      accent: '#3c752b',
      hasWater: false,
      passable: true,
      prop: 'oak',
      desc: 'Bosques frondosos de carvalhos e clareiras.'
    },
    DEEP_FOREST: {
      id: 'DEEP_FOREST',
      name: 'Floresta Ancestral',
      category: 'forest',
      ground: '#2d6124',
      accent: '#24501d',
      hasWater: false,
      passable: true,
      prop: 'oak',
      desc: 'Árvores colossais milenares e vaga-lumes misteriosos.'
    },
    SWAMP: {
      id: 'SWAMP',
      name: 'Pântano Místico',
      category: 'swamp',
      ground: '#4a5b3a',
      accent: '#3c4b2e',
      hasWater: false,
      passable: true,
      prop: 'willow',
      desc: 'Solos encharcados com salgueiros e cogumelos.'
    },
    SAVANNA: {
      id: 'SAVANNA',
      name: 'Savana Árida',
      category: 'savanna',
      ground: '#bfa14c',
      accent: '#b0923f',
      hasWater: false,
      passable: true,
      prop: 'oak',
      desc: 'Campos dourados sob o calor do sol.'
    },
    DESERT: {
      id: 'DESERT',
      name: 'Deserto Dourado',
      category: 'desert',
      ground: '#dfb76c',
      accent: '#cfa557',
      hasWater: false,
      passable: true,
      prop: 'cactus',
      desc: 'Dunas de areia fina e cactos imponentes.'
    },
    OASIS: {
      id: 'OASIS',
      name: 'Oásis do Deserto',
      category: 'oasis',
      ground: '#4ade80',
      accent: '#22c55e',
      hasWater: false,
      passable: true,
      prop: 'palm',
      desc: 'Oásis verdejante no coração do deserto.'
    },
    OASIS_LAKE: {
      id: 'OASIS_LAKE',
      name: 'Nascente do Oásis',
      category: 'water',
      ground: '#06b6d4',
      accent: '#22d3ee',
      hasWater: true,
      passable: false,
      desc: 'Nascente cristalina turquesa no centro do oásis.'
    },
    MEADOW_LAKE: {
      id: 'MEADOW_LAKE',
      name: 'Lago Campestre',
      category: 'water',
      ground: '#0284c7',
      accent: '#38bdf8',
      hasWater: true,
      passable: false,
      desc: 'Grande lago límpido de águas calmas e nenúfares.'
    },
    FOREST_LAKE: {
      id: 'FOREST_LAKE',
      name: 'Lago da Floresta',
      category: 'water',
      ground: '#0f766e',
      accent: '#14b8a6',
      hasWater: true,
      passable: false,
      desc: 'Vasto lago de águas esmeralda envolto pelas árvores.'
    },
    SWAMP_LAKE: {
      id: 'SWAMP_LAKE',
      name: 'Lago Pantanoso',
      category: 'water',
      ground: '#14532d',
      accent: '#166534',
      hasWater: true,
      passable: false,
      desc: 'Alagadiço denso com águas musgosas e vapores.'
    },
    SAVANNA_LAKE: {
      id: 'SAVANNA_LAKE',
      name: 'Bebedouro da Savana',
      category: 'water',
      ground: '#0369a1',
      accent: '#0284c7',
      hasWater: true,
      passable: false,
      desc: 'Bebedouro natural ensolarado de águas terrosas.'
    },
    TAIGA_LAKE: {
      id: 'TAIGA_LAKE',
      name: 'Lago Boreal',
      category: 'water',
      ground: '#0c4a6e',
      accent: '#38bdf8',
      hasWater: true,
      passable: false,
      desc: 'Lago alpino de águas azul-safira com margens nevadas.'
    },
    GLACIER_LAKE: {
      id: 'GLACIER_LAKE',
      name: 'Lago Glacial',
      category: 'water',
      ground: '#0891b2',
      accent: '#e0f2fe',
      hasWater: true,
      passable: false,
      desc: 'Águas de degelo azul-ciano com blocos flutuantes de gelo.'
    },
    CANYON: {
      id: 'CANYON',
      name: 'Cânion Vermelho',
      category: 'canyon',
      ground: '#b45309',
      accent: '#92400e',
      hasWater: false,
      passable: true,
      prop: 'none',
      desc: 'Profundas gargantas esculpidas em arenito terracota.'
    },
    SNOW_TAIGA: {
      id: 'SNOW_TAIGA',
      name: 'Taiga Nevada',
      category: 'taiga',
      ground: '#d6e5ea',
      accent: '#bfd5dd',
      hasWater: false,
      passable: true,
      prop: 'pine',
      desc: 'Pinheiros cobertos por neve cintilante.'
    },
    GLACIER: {
      id: 'GLACIER',
      name: 'Geleiras Ancestrais',
      category: 'glacier',
      ground: '#e0f2fe',
      accent: '#bae6fd',
      hasWater: false,
      passable: true,
      prop: 'pine',
      desc: 'Vastas extensões de gelo azul eterno.'
    },
    SNOW_PEAK: {
      id: 'SNOW_PEAK',
      name: 'Picos Glaciais',
      category: 'mountain',
      ground: '#f1f5f9',
      accent: '#cbd5e1',
      hasWater: false,
      passable: true,
      prop: 'pine',
      desc: 'Altas montanhas gélidas com ventos cortantes.'
    },
    VOLCANIC: {
      id: 'VOLCANIC',
      name: 'Vulcão da Ilha',
      category: 'volcano',
      ground: '#292524',
      accent: '#dc2626',
      hasWater: false,
      passable: true,
      prop: 'burnt',
      desc: 'Cratera vulcânica imponente com cinzas e lava.'
    },
    CAVE_FLOOR: {
      id: 'CAVE_FLOOR',
      name: 'Túnel de Pedra Subterrâneo',
      category: 'cave',
      ground: '#1c1917',
      accent: '#292524',
      hasWater: false,
      passable: true,
      prop: 'none',
      desc: 'Galerias rochosas escavadas nas entranhas da terra antiga.'
    },
    CAVE_CRYSTAL: {
      id: 'CAVE_CRYSTAL',
      name: 'Câmara dos Cristais Radiantes',
      category: 'cave',
      ground: '#1e1b4b',
      accent: '#312e81',
      hasWater: false,
      passable: true,
      prop: 'none',
      desc: 'Salão mágico com drusas de ametista e safira emitindo luz estelar.'
    },
    CAVE_MUSHROOM: {
      id: 'CAVE_MUSHROOM',
      name: 'Gruta dos Fungos Bioluminescentes',
      category: 'cave',
      ground: '#042f2e',
      accent: '#115e59',
      hasWater: false,
      passable: true,
      prop: 'none',
      desc: 'Gruta úmida repleta de esporos fluorescentes verde-esmeralda.'
    },
    CAVE_LAKE: {
      id: 'CAVE_LAKE',
      name: 'Lago das Profundezas',
      category: 'water',
      ground: '#0f172a',
      accent: '#0284c7',
      hasWater: true,
      passable: true,
      prop: 'none',
      desc: 'Águas límpidas subterrâneas onde gotas ecoam do teto de estalactites.'
    },
    CAVE_WALL: {
      id: 'CAVE_WALL',
      name: 'Parede Rochosa das Profundezas',
      category: 'cave',
      ground: '#0c0a09',
      accent: '#1c1917',
      hasWater: false,
      passable: false,
      prop: 'none',
      desc: 'Maciço rochoso ancestral impenetrável.'
    }
  };

  /**
   * Determina o bioma exato com base em elevação (e), umidade (m), temperatura (t)
   * e dados contextuais adicionais como ruído de lago, oásis, cânion ou vulcão.
   */
  function getBiome(e, m, t, ctx = {}) {
    if (ctx.isVolcano) return BIOMES.VOLCANIC;
    if (e < 0.28) return BIOMES.DEEP_OCEAN;
    if (e < 0.36) return BIOMES.COAST_WATER;
    if (e < 0.42) return BIOMES.BEACH;

    if (e > 0.84) {
      if (t < 0.35) return BIOMES.SNOW_PEAK;
      if (t > 0.70 && ctx.canyonVal > 0.35) return BIOMES.CANYON;
    }

    if (t >= 0.70) {
      if (e < 0.48) return BIOMES.SAVANNA;
      if (ctx.oasisVal > 0.68) {
        if (ctx.oasisVal > 0.81) return BIOMES.OASIS_LAKE;
        return BIOMES.OASIS;
      }
      if (ctx.canyonVal !== undefined && (Math.abs(ctx.canyonVal) < 0.15 || ctx.canyonVal > 0.72)) {
        return BIOMES.CANYON;
      }
      return BIOMES.DESERT;
    }

    if (t >= 0.56) {
      if (e >= 0.48 && e <= 0.66 && ctx.lakeVal > 0.76) return BIOMES.SAVANNA_LAKE;
      return BIOMES.SAVANNA;
    }

    if (t >= 0.44) {
      if (e >= 0.48 && e <= 0.66 && ctx.lakeVal > 0.73) return BIOMES.MEADOW_LAKE;
      return BIOMES.MEADOW;
    }

    if (t >= 0.26) {
      if (e < 0.47) return BIOMES.MEADOW;
      if (ctx.swampVal > 0.68 && e < 0.62) {
        if (ctx.lakeVal > 0.72) return BIOMES.SWAMP_LAKE;
        return BIOMES.SWAMP;
      }
      if (e >= 0.48 && e <= 0.68 && ctx.lakeVal > 0.70) return BIOMES.FOREST_LAKE;
      if (m > 0.62) return BIOMES.DEEP_FOREST;
      return BIOMES.FOREST;
    }

    if (t >= 0.14) {
      if (e >= 0.48 && e <= 0.62 && ctx.lakeVal > 0.73) return BIOMES.TAIGA_LAKE;
      return BIOMES.SNOW_TAIGA;
    }

    if (e > 0.60) return BIOMES.SNOW_PEAK;
    if (e >= 0.47 && e <= 0.60 && ctx.lakeVal > 0.75) return BIOMES.GLACIER_LAKE;
    return BIOMES.GLACIER;
  }

  function isWaterBiome(biome) {
    return !!(biome && biome.hasWater);
  }

  G.BIOMES = BIOMES;
  G.Biomes = BIOMES;
  G.getBiome = getBiome;
  G.isWaterBiome = isWaterBiome;
})(window.Game);
