/**
 * items.js - Definição dos 12 Slots de Equipamento, Itens e Sistema de Fusão/Forja
 * Namespace: window.Game.Items, window.Game.EQUIPMENT_SLOTS_DEF, window.Game.FUSION_RECIPES
 */
window.Game = window.Game || {};

(function (G) {
  'use strict';

  /* =======================================================
     1. 12 CONFIGURAÇÕES DE SLOTS DE EQUIPAMENTO (PAPERDOLL)
     ======================================================= */
  const EQUIPMENT_SLOTS_DEF = [
    { id: 'chapeu', label: 'Chapéu / Elmo' },
    { id: 'pingente', label: 'Amuleto / Pingente' },
    { id: 'capa', label: 'Capa / Manto' },
    { id: 'mao_esquerda', label: 'Mão Esquerda (Secundária/Tocha/Escudo)' },
    { id: 'camisa', label: 'Camisa / Peitoral' },
    { id: 'mao_direita', label: 'Mão Direita (Arma)' },
    { id: 'bracelete_esquerdo', label: 'Bracelete Esquerdo' },
    { id: 'cinto', label: 'Cinto / Faixa' },
    { id: 'bracelete_direito', label: 'Bracelete Direito' },
    { id: 'calca', label: 'Calça / Pernas' },
    { id: 'botas', label: 'Botas de Viagem' },
    { id: 'mochila', label: 'Bolsa de Recursos (+15 Slots)' }
  ];

  /* =======================================================
     2. HELPERS DE COMPARAÇÃO DE INGREDIENTES PARA FORJA
     ======================================================= */
  function itemMatchesKw(it, ...keywords) {
    if (!it) return false;
    const n = (it.name || '').toLowerCase();
    const id = (it.id || '').toLowerCase();
    return keywords.some(k => {
      const kwLower = k.toLowerCase();
      if (kwLower === 'fibra' && (n.includes('corda') || id.includes('corda'))) return false;
      return n.includes(kwLower) || id.includes(kwLower);
    });
  }

  function isRawFibra(it) {
    if (!it) return false;
    const n = (it.name || '').toLowerCase();
    const id = (it.id || '').toLowerCase();
    if (n.includes('corda') || id.includes('corda')) return false;
    return n.includes('fibra') || id.includes('fibra');
  }

  function isCordaPequena(it) {
    if (!it) return false;
    const n = (it.name || '').toLowerCase();
    const id = (it.id || '').toLowerCase();
    const hasCorda = n.includes('corda') || id.includes('corda');
    return hasCorda && (n.includes('pequena') || id.includes('pequena'));
  }

  function isCordaMedia(it) {
    if (!it) return false;
    const n = (it.name || '').toLowerCase();
    const id = (it.id || '').toLowerCase();
    const hasCorda = n.includes('corda') || id.includes('corda');
    return hasCorda && (n.includes('m\u00e9dia') || n.includes('media') || id.includes('media'));
  }

  function isCordaGrande(it) {
    if (!it) return false;
    const n = (it.name || '').toLowerCase();
    const id = (it.id || '').toLowerCase();
    const hasCorda = n.includes('corda') || id.includes('corda');
    return hasCorda && (n.includes('grande') || id.includes('grande'));
  }

  function matchPair(a, b, kws1, kws2) {
    return (
      (itemMatchesKw(a, ...kws1) && itemMatchesKw(b, ...kws2)) ||
      (itemMatchesKw(b, ...kws1) && itemMatchesKw(a, ...kws2))
    );
  }

  /* =======================================================
     3. TABELA DE RECEITAS DE FORJA E FUSÃO
     ======================================================= */
  const FUSION_RECIPES = [
    {
      id: 'fuse_corda_pequena',
      name: 'Corda de Fibra Pequena',
      category: 'utilitario',
      categoryLabel: 'Corda & Utilitário',
      ing1: 'Fibra Vegetal',
      ing2: 'Fibra Vegetal',
      desc: 'Trança rústica de feixes de fibra vegetal. Leve e flexível para o cinto.',
      match: (a, b) => isRawFibra(a) && isRawFibra(b),
      create: () => ({
        id: 'corda_pequena_' + Date.now(),
        name: 'Corda de Fibra Pequena',
        categoryType: 'equipment',
        slot: 'cinto',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Corda flexível trançada com feixes de fibra vegetal (+10 Vigor, +5% Vel).',
        stats: { defense: 2, staminaBonus: 10, speedBonusPercent: 5 },
        value: 20
      })
    },
    {
      id: 'fuse_corda_media',
      name: 'Corda de Fibra Média',
      category: 'utilitario',
      categoryLabel: 'Corda & Utilitário',
      ing1: 'Corda de Fibra Pequena',
      ing2: 'Corda de Fibra Pequena',
      desc: 'Fusão de duas cordas pequenas entrelaçadas em trança dupla com nós firmes.',
      match: (a, b) => isCordaPequena(a) && isCordaPequena(b),
      create: () => ({
        id: 'corda_media_' + Date.now(),
        name: 'Corda de Fibra Média',
        categoryType: 'equipment',
        slot: 'cinto',
        isEquippable: true,
        rarity: 'incomum',
        desc: 'Corda reforçada em trama dupla (+22 Vigor, +10% Vel, +5 Def).',
        stats: { defense: 5, staminaBonus: 22, speedBonusPercent: 10 },
        value: 55
      })
    },
    {
      id: 'fuse_corda_grande',
      name: 'Corda de Fibra Grande',
      category: 'utilitario',
      categoryLabel: 'Corda & Utilitário',
      ing1: 'Corda de Fibra Média',
      ing2: 'Corda de Fibra Média',
      desc: 'Junção de duas cordas médias compactadas com braçadeiras de reforço.',
      match: (a, b) => isCordaMedia(a) && isCordaMedia(b),
      create: () => ({
        id: 'corda_grande_' + Date.now(),
        name: 'Corda de Fibra Grande',
        categoryType: 'equipment',
        slot: 'cinto',
        isEquippable: true,
        rarity: 'raro',
        desc: 'Grossa corda naval forjada com cordas médias (+42 Vigor, +15% Vel, +10 Def).',
        stats: { defense: 10, staminaBonus: 42, speedBonusPercent: 15, attack: 3 },
        value: 130
      })
    },
    {
      id: 'fuse_corda_gigante',
      name: 'Corda de Fibra Gigante',
      category: 'utilitario',
      categoryLabel: 'Corda & Utilitário',
      ing1: 'Corda de Fibra Grande',
      ing2: 'Corda de Fibra Grande',
      desc: 'Cabo colossal de resistência titânica com tramas lendárias!',
      match: (a, b) => isCordaGrande(a) && isCordaGrande(b),
      create: () => ({
        id: 'corda_gigante_' + Date.now(),
        name: 'Corda de Fibra Gigante',
        categoryType: 'equipment',
        slot: 'cinto',
        isEquippable: true,
        rarity: 'epico',
        desc: 'Cabo colossal lendário capaz de conter golens titânicos (+75 Vigor, +22% Vel, +18 Def).',
        stats: { defense: 18, staminaBonus: 75, speedBonusPercent: 22, attack: 8 },
        value: 320
      })
    },
    {
      id: 'fuse_torch_pinho',
      name: 'Tocha de Pinho Flamejante',
      category: 'utilitario',
      categoryLabel: 'Iluminação & Mão',
      ing1: 'Galho de Madeira',
      ing2: 'Pederneira',
      desc: 'Tocha robusta forjada unindo madeira seca e faíscas de pederneira. Equipe na mão!',
      match: (a, b) => matchPair(a, b, ['galho'], ['pederneira', 'pedreneira']),
      create: () => ({
        id: 'torch_' + Date.now(),
        name: 'Tocha de Pinho Flamejante',
        categoryType: 'equipment',
        slot: 'mao_esquerda',
        isEquippable: true,
        rarity: 'incomum',
        desc: 'Tocha acesa com faísca de pederneira. Ilumina a noite e as profundezas.',
        stats: { attack: 3, lightRadiusBonus: 50 },
        value: 30
      })
    },
    {
      id: 'fuse_torch_resina',
      name: 'Tocha de Resina Brilhante',
      category: 'utilitario',
      categoryLabel: 'Iluminação & Mão',
      ing1: 'Galho de Madeira',
      ing2: 'Resina Natural',
      desc: 'Tocha tratada com resina florestal espessa. Emite uma chama âmbar densa com grande raio.',
      match: (a, b) => matchPair(a, b, ['galho'], ['resina']),
      create: () => ({
        id: 'torch_res_' + Date.now(),
        name: 'Tocha de Resina Brilhante',
        categoryType: 'equipment',
        slot: 'mao_esquerda',
        isEquippable: true,
        rarity: 'incomum',
        desc: 'Tocha densa que queima com luminescência ampliada nas trevas.',
        stats: { attack: 4, lightRadiusBonus: 65 },
        value: 40
      })
    },
    {
      id: 'fuse_wood_staff',
      name: 'Bastão de Madeira Reforçado',
      category: 'arma',
      categoryLabel: 'Arma Principal',
      ing1: 'Galho de Madeira',
      ing2: 'Galho de Madeira',
      desc: 'Dois galhos rígidos entrelaçados para desferir golpes contundentes.',
      match: (a, b) => itemMatchesKw(a, 'galho') && itemMatchesKw(b, 'galho'),
      create: () => ({
        id: 'staff_' + Date.now(),
        name: 'Bastão de Madeira Reforçado',
        categoryType: 'equipment',
        slot: 'mao_direita',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Arma básica de madeira torneada.',
        stats: { attack: 6, defense: 1 },
        value: 35
      })
    },
    {
      id: 'fuse_stone_mace',
      name: 'Maça Rústica de Pedra',
      category: 'arma',
      categoryLabel: 'Arma Principal',
      ing1: 'Galho de Madeira',
      ing2: 'Seixo de Pedra',
      desc: 'Um seixo angular amarrado à extremidade de um galho forte.',
      match: (a, b) => matchPair(a, b, ['galho'], ['seixo']),
      create: () => ({
        id: 'mace_' + Date.now(),
        name: 'Maça Rústica de Pedra',
        categoryType: 'equipment',
        slot: 'mao_direita',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Arma de impacto pesado construída com pedra e madeira.',
        stats: { attack: 8, defense: 2 },
        value: 45
      })
    },
    {
      id: 'fuse_iron_sword',
      name: 'Espada de Ferro Forjado',
      category: 'arma',
      categoryLabel: 'Arma Principal',
      ing1: 'Galho de Madeira',
      ing2: 'Cristal de Ferro',
      desc: 'Lâmina afiada forjada com ferro denso e empunhadura ergonômica.',
      match: (a, b) => matchPair(a, b, ['galho'], ['ferro']),
      create: () => ({
        id: 'sword_' + Date.now(),
        name: 'Espada de Ferro Forjado',
        categoryType: 'equipment',
        slot: 'mao_direita',
        isEquippable: true,
        rarity: 'incomum',
        desc: 'Lâmina de corte preciso. Estilhaça defesas e acelera o combate.',
        stats: { attack: 11, defense: 2 },
        value: 65
      })
    },
    {
      id: 'fuse_crystal_staff',
      name: 'Cajado de Cristal Arcano',
      category: 'arma',
      categoryLabel: 'Arma Principal',
      ing1: 'Galho de Madeira',
      ing2: 'Drusa de Cristal',
      desc: 'Cajado esculpido com cristal lapidado em seu topo. Emana luz e poder.',
      match: (a, b) => matchPair(a, b, ['galho'], ['ametista', 'safira', 'rubi', 'esmeralda', 'drusa', 'cristal']),
      create: () => ({
        id: 'cstaff_' + Date.now(),
        name: 'Cajado de Cristal Arcano',
        categoryType: 'equipment',
        slot: 'mao_direita',
        isEquippable: true,
        rarity: 'raro',
        desc: 'Arma mística canalizadora que amplifica ataque e emana luz.',
        stats: { attack: 14, lightRadiusBonus: 35, staminaBonus: 15 },
        value: 120
      })
    },
    {
      id: 'fuse_stone_shield',
      name: 'Escudo de Pedra Lapidada',
      category: 'armadura',
      categoryLabel: 'Secundária / Escudo',
      ing1: 'Seixo de Pedra',
      ing2: 'Seixo de Pedra',
      desc: 'Broquel de rocha densa para aparar investidas corporais.',
      match: (a, b) => itemMatchesKw(a, 'seixo') && itemMatchesKw(b, 'seixo'),
      create: () => ({
        id: 'shield_s_' + Date.now(),
        name: 'Escudo de Pedra Lapidada',
        categoryType: 'equipment',
        slot: 'mao_esquerda',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Escudo convexo que bloqueia golpes com estabilidade.',
        stats: { defense: 9, attack: 1 },
        value: 40
      })
    },
    {
      id: 'fuse_iron_shield',
      name: 'Escudo de Ferro Temperado',
      category: 'armadura',
      categoryLabel: 'Secundária / Escudo',
      ing1: 'Cristal de Ferro',
      ing2: 'Seixo de Pedra',
      desc: 'Escudo com reforços de aço e fixadores rígidos.',
      match: (a, b) => matchPair(a, b, ['ferro'], ['seixo']),
      create: () => ({
        id: 'shield_i_' + Date.now(),
        name: 'Escudo de Ferro Temperado',
        categoryType: 'equipment',
        slot: 'mao_esquerda',
        isEquippable: true,
        rarity: 'raro',
        desc: 'Escudo impenetrável forjado em bigorna rúnica.',
        stats: { defense: 16, attack: 2 },
        value: 110
      })
    },
    {
      id: 'fuse_cinto_fibra',
      name: 'Cinto de Fibra',
      category: 'acessorio',
      categoryLabel: 'Cinto / Faixa',
      ing1: 'Corda de Fibra',
      ing2: 'Fibra Vegetal',
      desc: 'Cinto trançado com corda e fibras vegetais. Concede +2 Defesa, +15 Vigor e libera 2 bolsos utilitários.',
      match: (a, b) => (itemMatchesKw(a, 'corda') && isRawFibra(b)) || (itemMatchesKw(b, 'corda') && isRawFibra(a)),
      create: () => ({
        id: 'cinto_fibra_' + Date.now(),
        name: 'Cinto de Fibra',
        categoryType: 'equipment',
        slot: 'cinto',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Cinto trançado com cordas e fibras vegetais. Ao equipar, libera 2 bolsos utilitários para itens na cintura.',
        stats: { defense: 2, staminaBonus: 15 },
        value: 35
      })
    },
    {
      id: 'fuse_linen_tunic',
      name: 'Túnica de Linho do Aventureiro',
      category: 'armadura',
      categoryLabel: 'Peitoral / Camisa',
      ing1: 'Corda de Fibra Pequena',
      ing2: 'Fibra Vegetal',
      desc: 'Tecida com fibras puras e arrematada com corda pequena.',
      match: (a, b) => (isCordaPequena(a) && isRawFibra(b)) || (isCordaPequena(b) && isRawFibra(a)),
      create: () => ({
        id: 'tunic_' + Date.now(),
        name: 'Túnica de Linho do Aventureiro',
        categoryType: 'equipment',
        slot: 'camisa',
        isEquippable: true,
        rarity: 'comum',
        desc: 'Proteção leve que não restringe a agilidade de caminhada.',
        stats: { defense: 8, staminaBonus: 15 },
        value: 45
      })
    },
    {
      id: 'fuse_travel_boots',
      name: 'Botas Ágeis de Viajante',
      category: 'armadura',
      categoryLabel: 'Botas',
      ing1: 'Fibra Vegetal',
      ing2: 'Seixo de Pedra',
      desc: 'Solado reforçado com forro macio de fibra, impulsionando a marcha (+15% Vel).',
      match: (a, b) => matchPair(a, b, ['fibra'], ['seixo']),
      create: () => ({
        id: 'boots_' + Date.now(),
        name: 'Botas Ágeis de Viajante',
        categoryType: 'equipment',
        slot: 'botas',
        isEquippable: true,
        rarity: 'incomum',
        desc: 'Calçado confortável que acelera a velocidade em +15%.',
        stats: { defense: 5, speedBonusPercent: 15 },
        value: 60
      })
    },
    {
      id: 'fuse_gold_pendant',
      name: 'Pingente do Luar Radiante',
      category: 'acessorio',
      categoryLabel: 'Amuleto / Pingente',
      ing1: 'Pepita de Ouro',
      ing2: 'Drusa de Cristal',
      desc: 'Jóia nobre em ouro polido com cristal prismático.',
      match: (a, b) => matchPair(a, b, ['ouro'], ['ametista', 'safira', 'rubi', 'esmeralda', 'drusa', 'cristal']),
      create: () => ({
        id: 'pendant_' + Date.now(),
        name: 'Pingente do Luar Radiante',
        categoryType: 'equipment',
        slot: 'pingente',
        isEquippable: true,
        rarity: 'epico',
        desc: 'Amuleto místico que emite brilho espectral, concedendo luz e poder.',
        stats: { attack: 6, defense: 6, lightRadiusBonus: 35 },
        value: 150
      })
    },
    {
      id: 'fuse_vigor_potion',
      name: 'Frasco de Poção de Vigor',
      category: 'pocao',
      categoryLabel: 'Consumível / Poção',
      ing1: 'Esporos de Cogumelo',
      ing2: 'Resina Natural',
      desc: 'Tônico revitalizante que recupera 100% de energia física.',
      match: (a, b) => matchPair(a, b, ['cogumelo', 'esporos'], ['resina']),
      create: () => ({
        id: 'pot_vig_' + Date.now(),
        name: 'Frasco de Poção de Vigor',
        categoryType: 'consumable',
        isEquippable: false,
        rarity: 'incomum',
        desc: 'Recupera instantaneamente todo o vigor físico ao beber.',
        stackCount: 1,
        value: 35
      })
    }
  ];

  function checkFusionMatch(itemA, itemB) {
    if (!itemA || !itemB) return null;
    for (const r of FUSION_RECIPES) {
      if (r.match(itemA, itemB)) return r;
    }
    return null;
  }

  /* =======================================================
     4. CÁLCULO DE ATRIBUTOS BASE + EQUIPAMENTOS
     ======================================================= */
  function computePlayerStats(equipment = {}) {
    const stats = {
      attack: 5,
      defense: 2,
      speedBonusPercent: 0,
      lightRadiusBonus: 0,
      staminaBonus: 0,
      maxStamina: 100
    };

    for (const slotKey of Object.keys(equipment)) {
      const it = equipment[slotKey];
      if (it && it.stats) {
        if (it.stats.attack) stats.attack += it.stats.attack;
        if (it.stats.defense) stats.defense += it.stats.defense;
        if (it.stats.speedBonusPercent) stats.speedBonusPercent += it.stats.speedBonusPercent;
        if (it.stats.lightRadiusBonus) stats.lightRadiusBonus += it.stats.lightRadiusBonus;
        if (it.stats.staminaBonus) {
          stats.staminaBonus += it.stats.staminaBonus;
          stats.maxStamina += it.stats.staminaBonus;
        }
      }
    }
    return stats;
  }

  G.EQUIPMENT_SLOTS_DEF = EQUIPMENT_SLOTS_DEF;
  G.FUSION_RECIPES = FUSION_RECIPES;
  G.checkFusionMatch = checkFusionMatch;
  G.computePlayerStats = computePlayerStats;
  G.itemMatchesKw = itemMatchesKw;
})(window.Game);
