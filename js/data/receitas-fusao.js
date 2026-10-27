/* js/data/receitas-fusao.js
 * Detectores de ingrediente (et, mn, o0, gi...), Ua e lista de receitas de fusao (FUSION_RECIPES...bl).
 * Trecho de legacy/app.original.js (linhas 38420-40263); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function et(e, ...t) {
    if (!e) return !1;
    const l = (e.name || "").toLowerCase(),
      o = (e.id || "").toLowerCase();
    return t.some((u) => {
      const m = u.toLowerCase();
      return m === "fibra" && (l.includes("corda") || o.includes("corda"))
        ? !1
        : l.includes(m) || o.includes(m);
    });
  }
  function mn(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("corda") || l.includes("corda")
      ? !1
      : t.includes("fibra") || l.includes("fibra");
  }
  function o0(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("corda") || l.includes("corda");
  }
  function gi(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return (
      (t.includes("corda") || l.includes("corda")) &&
      (t.includes("pequena") || l.includes("pequena"))
    );
  }
  function r0(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return (
      (t.includes("corda") || l.includes("corda")) &&
      (t.includes("média") || t.includes("media") || l.includes("media"))
    );
  }
  function l0(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase(),
      o = t.includes("corda") || l.includes("corda");
    return t.includes("gigante") || l.includes("gigante")
      ? !1
      : o && (t.includes("grande") || l.includes("grande"));
  }
  function Js(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("seixo") || l.includes("seixo");
  }
  function ec(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("galho") || l.includes("galho");
  }
  function i0(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("lascada") || l.includes("lascada");
  }
  function Gb(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("osso") || l.includes("bone") || l.includes("osso");
  }
  function n0(e, t, l, o, u, m) {
    if (!e || !t || !l) return !1;
    const c = [e, t, l],
      f = [o, u, m],
      g = [!1, !1, !1];
    function y(w) {
      if (w >= 3) return !0;
      for (let v = 0; v < 3; v++)
        if (!g[v] && f[w](c[v])) {
          if (((g[v] = !0), y(w + 1))) return !0;
          g[v] = !1;
        }
      return !1;
    }
    return y(0);
  }
  function Ua(e, t, l, o) {
    if (!e || !t) return !1;
    const u = typeof l == "function" ? l : (w) => et(w, ...l),
      m = typeof o == "function" ? o : (w) => et(w, ...o),
      c = u(e),
      f = m(t);
    if (c && f) return !0;
    const g = m(e),
      y = u(t);
    return g && y;
  }
  const FUSION_RECIPES = [
      {
        id: "fuse_corda_pequena",
        name: "Corda de Fibra Pequena",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Fibra Vegetal",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Trança rústica de feixes de fibra vegetal. Leve e flexível, serve para amarras de campo e como base para cordas mais espessas.",
        match: (e, t) => mn(e) && mn(t),
        createResult: () => ({
          id: `item_corda_pequena_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda de Fibra Pequena",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "comum",
          description:
            "Corda flexível trançada com feixes de fibra vegetal. Equipe-a no cinto para agilidade e postura ou use em fusões superiores.",
          stats: { defense: 2, staminaBonus: 10, speedBonusPercent: 5 },
          icon: "SlidersHorizontal",
          color: "#ca8a04",
          value: 20,
        }),
      },
      {
        id: "fuse_corda_media",
        name: "Corda de Fibra Média",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Corda de Fibra Pequena",
        ingredient2Name: "Corda de Fibra Pequena",
        description:
          "Fusão de duas cordas pequenas entrelaçadas em trança dupla com nós de retenção. Muito mais firme e resistente a tração.",
        match: (e, t) => gi(e) && gi(t),
        createResult: () => ({
          id: `item_corda_media_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda de Fibra Média",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Corda reforçada em trama dupla. Concede estabilidade física, vigor e absorção de impactos no cinto.",
          stats: { defense: 5, staminaBonus: 22, speedBonusPercent: 10 },
          icon: "SlidersHorizontal",
          color: "#d97706",
          value: 55,
        }),
      },
      {
        id: "fuse_corda_grande",
        name: "Corda de Fibra Grande",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Corda de Fibra Média",
        ingredient2Name: "Corda de Fibra Média",
        description:
          "Junção de duas cordas médias compactadas sob prensa manual com braçadeiras de reforço. Suporta cargas pesadas e amarras de navios.",
        match: (e, t) => r0(e) && r0(t),
        createResult: () => ({
          id: `item_corda_grande_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda de Fibra Grande",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Grossa corda de alta tenacidade forjada com cordas médias. Aumenta substancialmente vigor, defesa e velocidade.",
          stats: {
            defense: 10,
            staminaBonus: 42,
            speedBonusPercent: 15,
            attack: 3,
          },
          icon: "SlidersHorizontal",
          color: "#ea580c",
          value: 130,
        }),
      },
      // 🧪 ETAPA 2 — Fusões com Gosma/Gordura (Chicote, Cordas Elásticas, Estilingue)
      {
        id: "fuse_chicote_gosma",
        name: "Chicote de Gosma",
        category: "arma",
        categoryLabel: "Arma Flexível",
        ingredient1Name: "Corpo de Gosma",
        ingredient2Name: "Corda de Fibra Média",
        description:
          "Corda média revestida com gosma elasticizada. Chicoteio longo que estala contra o inimigo.",
        match: (e, t) =>
          Ua(
            e,
            t,
            (w) => {
              const n = ((w && w.name) || "").toLowerCase(),
                i = ((w && w.id) || "").toLowerCase();
              return (
                (n.includes("corpo") && (n.includes("gosma") || n.includes("slime"))) ||
                i.includes("corpo_gosma")
              );
            },
            r0,
          ),
        createResult: () => ({
          id: `item_chicote_gosma_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Chicote de Gosma",
          categoryType: "weapon",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Chicote flexível de gosma elasticizada trançada em corda média. Alcance longo: a tira estala a mais de 3x a distância de uma espada (+7 Ataque, +12% Velocidade).",
          stats: { attack: 7, speedBonusPercent: 12 },
          icon: "Whip",
          color: "#65a30d",
          value: 140,
        }),
      },
      {
        id: "fuse_corda_elastica",
        name: "Corda Elástica",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Corda de Fibra Pequena",
        ingredient2Name: "Gordura Animal / Gelatina Processada",
        description:
          "Corda pequena impregnada com gordura ou gelatina processada, ficando elástica como borracha. Base do Estilingue.",
        match: (e, t) =>
          Ua(
            e,
            t,
            gi,
            (w) => {
              const n = ((w && w.name) || "").toLowerCase(),
                i = ((w && w.id) || "").toLowerCase();
              return (
                n.includes("gordura") ||
                n.includes("gelatina processada") ||
                i.includes("gordura_animal") ||
                i.includes("gelatina_processada")
              );
            },
          ),
        createResult: () => ({
          id: `item_corda_elastica_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda Elástica",
          categoryType: "material",
          isEquippable: !1,
          rarity: "incomum",
          stackCount: 1,
          maxStack: 20,
          description:
            "Trança fibrosa tratada com gordura animal, elástica como borracha. Componente essencial para o Estilingue.",
          icon: "Infinity",
          color: "#f59e0b",
          value: 45,
        }),
      },
      {
        id: "fuse_corda_elastica_grande",
        name: "Corda Elástica Grande",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Corda de Fibra Grande",
        ingredient2Name: "Corpo de Gosma / Gelatina Processada",
        description:
          "Corda grande saturada de gosma purificada. Extremamente elástica — ainda sem uso conhecido...",
        match: (e, t) =>
          Ua(
            e,
            t,
            l0,
            (w) => {
              const n = ((w && w.name) || "").toLowerCase(),
                i = ((w && w.id) || "").toLowerCase();
              return (
                (n.includes("corpo") && (n.includes("gosma") || n.includes("slime"))) ||
                n.includes("gelatina processada") ||
                i.includes("corpo_gosma") ||
                i.includes("gelatina_processada")
              );
            },
          ),
        createResult: () => ({
          id: `item_corda_elastica_grande_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda Elástica Grande",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Cabo grosso e muito elástico tratado com gosma. Concede vigor e defesa, mas seu verdadeiro potencial ainda é um mistério.",
          stats: { defense: 8, staminaBonus: 35, speedBonusPercent: 8 },
          icon: "Infinity",
          color: "#22c55e",
          value: 160,
        }),
      },
      {
        id: "fuse_estilingue",
        name: "Estilingue",
        category: "arma",
        categoryLabel: "Arma de Arremesso",
        ingredient1Name: "Corda Elástica",
        ingredient2Name: "Galho de Madeira",
        description:
          "Forque de galho firme com bandagem de corda elástica. Dobra o alcance dos seixos arremessados!",
        match: (e, t) =>
          Ua(
            e,
            t,
            (w) => {
              const n = ((w && w.name) || "").toLowerCase(),
                i = ((w && w.id) || "").toLowerCase();
              return (
                (n.includes("corda elástica") || n.includes("corda elastica") || i.includes("corda_elastica")) &&
                !n.includes("grande") &&
                !i.includes("elastica_grande")
              );
            },
            ec,
          ),
        createResult: () => ({
          id: `item_estilingue_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Estilingue",
          categoryType: "weapon",
          slot: "mao_esquerda",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Forque de madeira com corda elástica. Equipe-o em uma mão e um Seixo na outra: os seixos voam o DOBRO da distância com +50% de dano no impacto.",
          stats: { attack: 4 },
          icon: "Cross",
          color: "#a16207",
          value: 90,
        }),
      },
      {
        id: "fuse_corda_gigante",
        name: "Corda de Fibra Gigante",
        category: "utilitario",
        categoryLabel: "Corda & Utilitário",
        ingredient1Name: "Corda de Fibra Grande",
        ingredient2Name: "Corda de Fibra Grande",
        description:
          "Cabo colossal forjado ao unir duas cordas grandes. Uma verdadeira relíquia de amarra naval e nós mestres capaz de conter feras titânicas!",
        match: (e, t) => l0(e) && l0(t),
        createResult: () => ({
          id: `item_corda_gigante_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Corda de Fibra Gigante",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "epico",
          description:
            "Cabo colossal lendário com fios dourados reforçados. Concede estabilidade hercúlea, vigor maciço e impulsão veloz.",
          stats: {
            defense: 18,
            staminaBonus: 75,
            speedBonusPercent: 22,
            attack: 8,
          },
          icon: "SlidersHorizontal",
          color: "#f59e0b",
          value: 320,
        }),
      },
      {
        id: "fuse_torch_pinho",
        name: "Tocha de Pinho Flamejante",
        category: "utilitario",
        categoryLabel: "Iluminação & Mão",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Pederneira",
        description:
          "Tocha robusta forjada unindo madeira seca e faíscas de pederneira. Equipe-a na mão para iluminar cavernas e noites escuras!",
        match: (e, t) => Ua(e, t, ["galho"], ["pederneira", "pedreneira"]),
        createResult: () => ({
          id: `torch_crafted_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Tocha de Pinho Flamejante",
          categoryType: "equipment",
          slot: "mao_esquerda",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Tocha de pinho acesa com faísca de pederneira. Equipe-a na mão esquerda ou direita para dissipar a escuridão.",
          stats: { attack: 3, lightRadiusBonus: 50 },
          icon: "Flame",
          color: "#f59e0b",
          value: 30,
        }),
      },
      {
        id: "fuse_torch_resina",
        name: "Tocha de Resina Brilhante",
        category: "utilitario",
        categoryLabel: "Iluminação & Mão",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Resina Natural",
        description:
          "Tocha alquímica tratada com seiva de resina espessa. Emite uma chama âmbar densa com luminescência ampliada.",
        match: (e, t) => Ua(e, t, ["galho"], ["resina"]),
        createResult: () => ({
          id: `torch_resin_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Tocha de Resina Brilhante",
          categoryType: "equipment",
          slot: "mao_esquerda",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Tocha impregnada com resina florestal. Queima mais quente e amplia o raio de visão nas profundezas subterrâneas.",
          stats: { attack: 4, lightRadiusBonus: 65 },
          icon: "Flame",
          color: "#fb923c",
          value: 40,
        }),
      },
      {
        id: "fuse_campfire_unlit",
        name: "Fogueira de Acampamento (Apagada)",
        category: "utilitario",
        categoryLabel: "Construção no Mapa (Conjunto)",
        ingredient1Name: "10x Galho de Madeira",
        ingredient2Name: "Conjunto (10 Galhos)",
        description:
          "Reúna um conjunto de 10 galhos secos para armar uma fogueira no chão do mapa! É construída diretamente no terreno onde você está pisando (não ocupa slot do inventário). Permanece apagada até você golpeá-la com 2 Pederneiras.",
        match: (e, t) =>
          !e || !et(e, "galho")
            ? !1
            : t
              ? et(t, "galho")
                ? (e.id === t.id
                    ? e.stackCount || 1
                    : (e.stackCount || 1) + (t.stackCount || 1)) >= 10
                : !1
              : (e.stackCount || 1) >= 10,
        createResult: () => ({
          id: `map_construction_campfire_${Date.now()}`,
          name: "Fogueira de Acampamento (Apagada)",
          categoryType: "material",
          isEquippable: !1,
          rarity: "incomum",
          description:
            "Estrutura de fogueira de 10 galhos construída diretamente no solo do mapa. Acenda com 2 Pederneiras.",
          icon: "Flame",
          color: "#f59e0b",
          value: 60,
          isMapConstruction: !0,
        }),
      },
      {
        id: "fuse_moldagem_argila",
        name: "Moldagem de Argila (No Chão)",
        category: "utilitario",
        categoryLabel: "Cerâmica no Solo",
        ingredient1Name: "Argila Úmida",
        ingredient2Name: "Argila Úmida",
        description:
          "Moldagem artesanal com argila pura da lagoa. Ao construir, a peça é moldada no solo do mapa e precisa de 2 minutos de secagem ao sol para virar um item coletável.",
        match: (e, t) => et(e, "argila") && et(t, "argila"),
        results: [
          {
            id: "choice_frasco_barro",
            name: "Frasco de Barro (Secando no Chão)",
            categoryLabel: "Frasco Usável (2 min secagem)",
            description:
              "Frasco torneado no solo para armazenar líquidos frescos. Requer 2 minutos de secagem ao sol para se tornar coletável (+40 Stamina com água fresca).",
            createResult: () => ({
              id: `clay_drying_frasco_${Date.now()}`,
              name: "Frasco de Barro",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "comum",
              value: 30,
              stackCount: 1,
              icon: "🏺",
              color: "#ea580c",
              description:
                "Frasco cerâmico torneado em pura argila e seco ao sol. Pode ser usado na beira da lagoa para coletar água fresca (+40 Stamina ao beber).",
              isMapConstruction: !0,
              isClayDrying: !0,
              dryingItemType: "frasco",
            }),
          },
          {
            id: "choice_jarra_barro",
            name: "Jarra de Barro Vazia (Secando no Chão)",
            categoryLabel: "Jarra para Água (2 min secagem)",
            description:
              "Jarra bojuda elegante com alça e bico, moldada no solo. Ideal para coletar e carregar grande quantidade de água fresca (+70 Stamina).",
            createResult: () => ({
              id: `clay_drying_jarra_${Date.now()}`,
              name: "Jarra de Barro Vazia",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "incomum",
              value: 40,
              stackCount: 1,
              icon: "🏺",
              color: "#d97706",
              description:
                "Jarra cerâmica com alça e bico torneada em argila pura. Pode ser mergulhada na água para coletar água fresca (+70 Stamina ao beber).",
              isMapConstruction: !0,
              isClayDrying: !0,
              dryingItemType: "jarra",
            }),
          },
          {
            id: "choice_pote_barro",
            name: "Pote de Barro Vazio (Secando no Chão)",
            categoryLabel: "Pote Artesanal (2 min secagem)",
            description:
              "Pote cerâmico rústico moldado no chão. Excelente para coletar e armazenar água fresca (+55 Stamina ao beber).",
            createResult: () => ({
              id: `clay_drying_pote_${Date.now()}`,
              name: "Pote de Barro Vazio",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "comum",
              value: 30,
              stackCount: 1,
              icon: "🏺",
              color: "#c2410c",
              description:
                "Pote de cerâmica rústica moldado em argila e seco ao sol. Pode ser usado na beira da água para coletar água fresca (+55 Stamina ao beber).",
              isMapConstruction: !0,
              isClayDrying: !0,
              dryingItemType: "pote",
            }),
          },
          {
            id: "choice_panela_barro",
            name: "Panela de Barro Vazia (Secando no Chão)",
            categoryLabel: "Panela Culinária (2 min secagem)",
            description:
              "Panela artesanal de argila com bordas reforçadas e alças. Pode coletar água fresca com abundância (+90 Stamina) ou ser usada para assar/cozinhar no fogo.",
            createResult: () => ({
              id: `clay_drying_panela_${Date.now()}`,
              name: "Panela de Barro Vazia",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "incomum",
              value: 45,
              stackCount: 1,
              icon: "🍳",
              color: "#b45309",
              description:
                "Panela robusta de barro com paredes grossas. Pode coletar água fresca na lagoa (+90 Stamina ao beber) ou preparar receitas.",
              isMapConstruction: !0,
              isClayDrying: !0,
              dryingItemType: "panela",
            }),
          },
          {
            id: "choice_caldeirao_barro",
            name: "Caldeirão de Barro Vazio (Secando no Chão)",
            categoryLabel: "Caldeirão Bojudo (2 min secagem)",
            description:
              "Caldeirão espesso de argila criado no solo. Após 2 minutos de secagem ao sol, torna-se um recipiente vazio para coletar água ou preparos culinários.",
            createResult: () => ({
              id: `clay_drying_caldeirao_${Date.now()}`,
              name: "Caldeirão de Barro Vazio",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "incomum",
              value: 45,
              stackCount: 1,
              icon: "🍲",
              color: "#9a3412",
              description:
                "Caldeirão robusto moldado com paredes espessas de argila e curado ao sol. Pode coletar água fresca (+90 Stamina) ou ser usado em receitas no fogo.",
              isMapConstruction: !0,
              isClayDrying: !0,
              dryingItemType: "caldeirao",
            }),
          },
        ],
        createResult: (e) => {
          const t =
            e === "choice_caldeirao_barro"
              ? "caldeirao"
              : e === "choice_frasco_barro"
                ? "frasco"
                : e === "choice_jarra_barro"
                  ? "jarra"
                  : e === "choice_panela_barro"
                    ? "panela"
                    : "pote";
          return t === "frasco"
            ? {
                id: `clay_drying_frasco_${Date.now()}`,
                name: "Frasco de Barro",
                categoryType: "consumable",
                isEquippable: !1,
                rarity: "comum",
                value: 30,
                stackCount: 1,
                icon: "🏺",
                color: "#ea580c",
                description:
                  "Frasco cerâmico torneado em pura argila e seco ao sol. Pode ser usado na margem da água para coletar água fresca (+40 Stamina ao beber).",
                isMapConstruction: !0,
                isClayDrying: !0,
                dryingItemType: "frasco",
              }
            : t === "jarra"
              ? {
                  id: `clay_drying_jarra_${Date.now()}`,
                  name: "Jarra de Barro Vazia",
                  categoryType: "consumable",
                  isEquippable: !1,
                  rarity: "incomum",
                  value: 40,
                  stackCount: 1,
                  icon: "🏺",
                  color: "#d97706",
                  description:
                    "Jarra cerâmica com alça e bico torneada em argila pura. Pode ser mergulhada na água para coletar água fresca (+70 Stamina ao beber).",
                  isMapConstruction: !0,
                  isClayDrying: !0,
                  dryingItemType: "jarra",
                }
              : t === "panela"
                ? {
                    id: `clay_drying_panela_${Date.now()}`,
                    name: "Panela de Barro Vazia",
                    categoryType: "consumable",
                    isEquippable: !1,
                    rarity: "incomum",
                    value: 45,
                    stackCount: 1,
                    icon: "🍳",
                    color: "#b45309",
                    description:
                      "Panela robusta de barro com paredes grossas. Pode coletar água fresca na lagoa (+90 Stamina ao beber) ou preparar receitas.",
                    isMapConstruction: !0,
                    isClayDrying: !0,
                    dryingItemType: "panela",
                  }
                : t === "caldeirao"
                  ? {
                      id: `clay_drying_caldeirao_${Date.now()}`,
                      name: "Caldeirão de Barro Vazio",
                      categoryType: "consumable",
                      isEquippable: !1,
                      rarity: "incomum",
                      value: 45,
                      stackCount: 1,
                      icon: "🍲",
                      color: "#9a3412",
                      description:
                        "Caldeirão robusto moldado com paredes espessas de argila e curado ao sol. Pode coletar água fresca (+90 Stamina) ou ser usado em receitas no fogo.",
                      isMapConstruction: !0,
                      isClayDrying: !0,
                      dryingItemType: "caldeirao",
                    }
                  : {
                      id: `clay_drying_pote_${Date.now()}`,
                      name: "Pote de Barro Vazio",
                      categoryType: "consumable",
                      isEquippable: !1,
                      rarity: "comum",
                      value: 30,
                      stackCount: 1,
                      icon: "🏺",
                      color: "#c2410c",
                      description:
                        "Pote de cerâmica rústica moldado em argila e seco ao sol. Pode ser usado na beira da água para coletar água fresca (+55 Stamina ao beber).",
                      isMapConstruction: !0,
                      isClayDrying: !0,
                      dryingItemType: "pote",
                    };
        },
      },
      {
        id: "fuse_forno_barro",
        name: "Forno de Barro",
        category: "utilitario",
        categoryLabel: "Forno & Alvenaria",
        ingredient1Name: "Itens da Fogueira (Galhos / Fogueira)",
        ingredient2Name: "Argila Úmida",
        description:
          "Ao juntar os itens da fogueira (galhos ou estrutura de fogueira) com argila úmida, você constrói um Forno de Barro artesanal aquecido! Mantém brasas constantes para assar peixes, cozinhar receitas e descansar no mapa.",
        match: (e, t) => {
          if (!e || !t) return !1;
          const l = et(e, "galho") || et(e, "fogueira"),
            o = et(t, "galho") || et(t, "fogueira"),
            u = et(e, "argila"),
            m = et(t, "argila");
          return (l && m) || (o && u);
        },
        results: [
          {
            id: "choice_forno_barro_mapa",
            name: "Forno de Barro (Construir no Solo)",
            categoryLabel: "Construção no Solo (Mapa)",
            description:
              "Instala imediatamente um Forno de Barro com chaminé e brasas vivas no solo onde você está pisando (não ocupa espaço na mochila). Pressione [F] para descansar e recuperar HP/Stamina ou assar peixes.",
            createResult: () => ({
              id: `forno_barro_prop_${Date.now()}`,
              name: "Forno de Barro",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "raro",
              value: 120,
              stackCount: 1,
              icon: "🔥",
              color: "#ea580c",
              description:
                "Forno cúpula de argila aquecido. Construído no solo do mapa.",
              isMapConstruction: !0,
              mapPropKind: "clay_oven",
            }),
          },
          {
            id: "choice_forno_barro_item",
            name: "Forno de Barro Portátil (Mochila)",
            categoryLabel: "Item Portátil (Inventário)",
            description:
              "Cria uma estrutura compacta de forno de barro para levar na mochila. Pressione [Usar] no inventário a qualquer momento para instalá-lo no chão onde você estiver.",
            createResult: () => ({
              id: `item_forno_barro_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Forno de Barro Portátil",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "raro",
              value: 120,
              stackCount: 1,
              icon: "🔥",
              color: "#ea580c",
              description:
                "Forno de barro pré-moldado compacto. Pressione [Usar] para instalá-lo permanentemente no chão onde você estiver como um forno com fogo ativo e ponto de descanso!",
              isPlaceableOven: !0,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_forno_barro_item"
            ? {
                id: `item_forno_barro_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Forno de Barro Portátil",
                categoryType: "consumable",
                isEquippable: !1,
                rarity: "raro",
                value: 120,
                stackCount: 1,
                icon: "🔥",
                color: "#ea580c",
                description:
                  "Forno de barro pré-moldado compacto. Pressione [Usar] para instalá-lo permanentemente no chão onde você estiver como um forno com fogo ativo e ponto de descanso!",
                isPlaceableOven: !0,
              }
            : {
                id: `forno_barro_prop_${Date.now()}`,
                name: "Forno de Barro",
                categoryType: "consumable",
                isEquippable: !1,
                rarity: "raro",
                value: 120,
                stackCount: 1,
                icon: "🔥",
                color: "#ea580c",
                description:
                  "Forno cúpula de argila aquecido. Construído no solo do mapa.",
                isMapConstruction: !0,
                mapPropKind: "clay_oven",
              },
      },
      {
        id: "fuse_tijolo_argila",
        name: "Tijolo de Argila",
        category: "utilitario",
        categoryLabel: "Material & Construção",
        ingredient1Name: "Argila Úmida",
        ingredient2Name: "Resina de Pinheiro",
        description:
          "Bloco de cerâmica de alta densidade temperado com resina endurecedora. Item usável para reforço e alvenaria sem alteração em atributos.",
        match: (e, t) => Ua(e, t, ["argila"], ["resina"]),
        createResult: () => ({
          id: `brick_clay_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Tijolo de Argila",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "comum",
          description:
            "Tijolo cerâmico maciço curado. Item usável para reforço de estruturas e obras no mapa.",
          icon: "🧱",
          color: "#ea580c",
          value: 25,
          stackCount: 1,
        }),
      },
    ],
    Fb = [
      {
        id: "fuse_tronco_lascar",
        name: "Desbastar Tronco em Galhos",
        category: "recurso",
        categoryLabel: "Desbaste de Madeira",
        ingredient1Name: "Tronco de Madeira",
        ingredient2Name: "Pedra Lascada ou Seixo",
        description:
          "Use uma pedra cortante ou seixo afiado para fatiar o tronco de madeira maciça em 4 Galhos de Madeira manejáveis.",
        match: (e, t) =>
          (et(e, "tronco") && (i0(t) || Js(t) || et(t, "faca") || et(t, "machado"))) ||
          (et(t, "tronco") && (i0(e) || Js(e) || et(e, "faca") || et(e, "machado"))),
        results: [
          {
            id: "choice_tronco_desbastar",
            name: "4 Galhos de Madeira",
            categoryLabel: "Recurso (Consome 1 Tronco)",
            description:
              "Desbasta o tronco maciço em 4 galhos retos e pontiagudos de madeira para tochas, lanças e fogueiras.",
            createResult: () => ({
              id: `item_galho_${Date.now()}`,
              name: "Galho de Madeira",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              stats: { attack: 5 },
              rarity: "comum",
              description:
                "Galho rígido de madeira obtido desbastando tronco de árvore (+5 Ataque).",
              icon: "🪵",
              color: "#a16207",
              value: 2,
              stackCount: 4,
            }),
          },
        ],
        createResult: () => ({
          id: `item_galho_${Date.now()}`,
          name: "Galho de Madeira",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          stats: { attack: 5 },
          rarity: "comum",
          description:
            "Galho rígido de madeira obtido desbastando tronco de árvore (+5 Ataque).",
          icon: "🪵",
          color: "#a16207",
          value: 2,
          stackCount: 4,
        }),
      },
      {
        id: "fuse_tronco_fogueira",
        name: "Fogueira de Tronco Maciço (No Solo)",
        category: "construcao",
        categoryLabel: "Construção no Mapa",
        ingredient1Name: "Tronco de Madeira",
        ingredient2Name: "Galho de Madeira",
        description:
          "Monta diretamente no solo uma fogueira duradoura de lenha maciça! Muito mais resistente e de brasas fortes. Acenda com 2 Pederneiras.",
        match: (e, t) =>
          (et(e, "tronco", "wood_log") && et(t, "galho")) ||
          (et(t, "tronco", "wood_log") && et(e, "galho")),
        results: [
          {
            id: "choice_tronco_fogueira",
            name: "Fogueira de Lenha Maciça (Apagada)",
            categoryLabel: "Construção no Solo do Mapa",
            description:
              "Estrutura robusta de tronco e lenha montada diretamente no solo onde você está. Acenda com 2 Pederneiras.",
            createResult: () => ({
              id: `map_construction_campfire_${Date.now()}`,
              name: "Fogueira de Acampamento (Apagada)",
              categoryType: "material",
              isEquippable: !1,
              rarity: "incomum",
              description:
                "Estrutura de fogueira de tronco e lenha montada diretamente no solo. Acenda com 2 Pederneiras.",
              icon: "Flame",
              color: "#f59e0b",
              value: 80,
              isMapConstruction: !0,
            }),
          },
        ],
        createResult: () => ({
          id: `map_construction_campfire_${Date.now()}`,
          name: "Fogueira de Acampamento (Apagada)",
          categoryType: "material",
          isEquippable: !1,
          rarity: "incomum",
          description:
            "Estrutura de fogueira de tronco e lenha montada diretamente no solo. Acenda com 2 Pederneiras.",
          icon: "Flame",
          color: "#f59e0b",
          value: 80,
          isMapConstruction: !0,
        }),
      },
      {
        id: "fuse_wood_staff",
        name: "Bastão de Madeira ou Fogueira no Mapa",
        category: "arma",
        categoryLabel: "Arma ou Construção",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Galho de Madeira",
        description:
          "Com 2 galhos forme um bastão contundente. Se possuir um conjunto de 10 galhos, construa uma fogueira diretamente no solo do mapa!",
        match: (e, t) => et(e, "galho") && et(t, "galho"),
        results: [
          {
            id: "choice_wood_staff",
            name: "Bastão de Madeira Reforçado",
            categoryLabel: "Arma Principal (Consome 2 Galhos)",
            description:
              "Bastão rústico torneado para desferir golpes rápidos contra predadores (+6 Ataque, +1 Defesa).",
            createResult: () => ({
              id: `weapon_staff_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Bastão de Madeira Reforçado",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "comum",
              description:
                "Bastão rústico torneado para desferir golpes rápidos contra predadores.",
              stats: { attack: 6, defense: 1 },
              icon: "Sword",
              color: "#a16207",
              value: 35,
            }),
          },
          {
            id: "choice_campfire_unlit",
            name: "Fogueira de Acampamento (Apagada)",
            categoryLabel: "Construção no Mapa (Conjunto de 10 Galhos)",
            description:
              "Monta uma fogueira diretamente no chão do mapa onde você está! Consome 10 galhos. Não ocupa slot do inventário. Acenda com 2 Pederneiras.",
            createResult: () => ({
              id: `map_construction_campfire_${Date.now()}`,
              name: "Fogueira de Acampamento (Apagada)",
              categoryType: "material",
              isEquippable: !1,
              rarity: "incomum",
              description:
                "Estrutura de fogueira de 10 galhos construída diretamente no solo do mapa. Acenda com 2 Pederneiras.",
              icon: "Flame",
              color: "#f59e0b",
              value: 60,
              isMapConstruction: !0,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_campfire_unlit"
            ? {
                id: `map_construction_campfire_${Date.now()}`,
                name: "Fogueira de Acampamento (Apagada)",
                categoryType: "material",
                isEquippable: !1,
                rarity: "incomum",
                description:
                  "Estrutura de fogueira de 10 galhos construída diretamente no solo do mapa. Acenda com 2 Pederneiras.",
                icon: "Flame",
                color: "#f59e0b",
                value: 60,
                isMapConstruction: !0,
              }
            : {
                id: `weapon_staff_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Bastão de Madeira Reforçado",
                categoryType: "equipment",
                slot: "mao_direita",
                isEquippable: !0,
                rarity: "comum",
                description:
                  "Bastão rústico torneado para desferir golpes rápidos contra predadores.",
                stats: { attack: 6, defense: 1 },
                icon: "Sword",
                color: "#a16207",
                value: 35,
              },
      },
      {
        id: "fuse_seixo_galho_corda",
        name: "Maça Rústica ou Martelo de Pedra",
        category: "arma",
        categoryLabel: "Arma & Ferramenta",
        ingredient1Name: "Seixo de Pedra",
        ingredient2Name: "Galho de Madeira",
        ingredient3Name: "Corda de Fibra Pequena",
        description:
          "Prenda o seixo na extremidade de um galho resistente usando corda de fibra pequena. Forja uma Maça Rústica contundente ou um Martelo de Pedra minerador.",
        match: (e, t, l) => !!l && n0(e, t, l, Js, ec, gi),
        results: [
          {
            id: "choice_maca_rustica",
            name: "Maça Rústica de Pedra",
            categoryLabel: "Arma Principal (Impacto)",
            description:
              "Um seixo angular denso amarrado com nós reforçados ao galho forte. Causa dano de concussão brutal (+9 Ataque, +2 Defesa).",
            createResult: () => ({
              id: `weapon_mace_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Maça Rústica de Pedra",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "incomum",
              description:
                "Arma de impacto pesado construída com rocha angular e galho torneado amarrados por corda pequena.",
              stats: { attack: 9, defense: 2 },
              icon: "mace",
              color: "#a16207",
              value: 45,
            }),
          },
          {
            id: "choice_martelo_pedra",
            name: "Martelo de Pedra",
            categoryLabel: "Arma & Mineração",
            description:
              "Martelo equilibrado com cabeça de seixo plano e amarras firmes de corda. Esmaga blindagens e fratura veios rochosos (+8 Ataque, +3 Defesa, +10 Vigor).",
            createResult: () => ({
              id: `weapon_hammer_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Martelo de Pedra",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "incomum",
              description:
                "Martelo rústico com bloco de seixo lapidado e empunhadura reforçada com corda pequena. Ideal para britar pedras e golpear alvos armadurados.",
              stats: { attack: 8, defense: 3, staminaBonus: 10 },
              icon: "hammer",
              color: "#78716c",
              value: 45,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_martelo_pedra"
            ? {
                id: `weapon_hammer_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Martelo de Pedra",
                categoryType: "equipment",
                slot: "mao_direita",
                isEquippable: !0,
                rarity: "incomum",
                description:
                  "Martelo rústico com bloco de seixo lapidado e empunhadura reforçada com corda pequena. Ideal para britar pedras e golpear alvos armadurados.",
                stats: { attack: 8, defense: 3, staminaBonus: 10 },
                icon: "hammer",
                color: "#78716c",
                value: 45,
              }
            : {
                id: `weapon_mace_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Maça Rústica de Pedra",
                categoryType: "equipment",
                slot: "mao_direita",
                isEquippable: !0,
                rarity: "incomum",
                description:
                  "Arma de impacto pesado construída com rocha angular e galho torneado amarrados por corda pequena.",
                stats: { attack: 9, defense: 2 },
                icon: "mace",
                color: "#a16207",
                value: 45,
              },
      },
      {
        id: "fuse_pedra_corda_galho",
        name: "Lança Primitiva ou Machado de Pedra",
        category: "arma",
        categoryLabel: "Arma & Ferramenta",
        ingredient1Name: "Pedra Lascada",
        ingredient2Name: "Corda de Fibra Pequena",
        ingredient3Name: "Galho de Madeira",
        description:
          "Fixe a lasca afiada de pedra no galho usando corda de fibra pequena. Forja uma Lança Primitiva veloz ou um Machado de Pedra dilacerador.",
        match: (e, t, l) => !!l && n0(e, t, l, i0, gi, ec),
        results: [
          {
            id: "choice_lanca_primitiva",
            name: "Lança Primitiva",
            categoryLabel: "Arma Principal (Perfuração)",
            description:
              "Ponta triangular afiada de pedra lascada fixada na haste de galho. Desfere estocadas rápidas com alcance estendido (+11 Ataque, +5% Velocidade).",
            createResult: () => ({
              id: `weapon_spear_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Lança Primitiva",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "incomum",
              description:
                "Haste torneada de madeira com ponta cuneiforme afiada de pedra lascada presa por corda pequena. Ataques de perfuração ágil.",
              stats: { attack: 11, speedBonusPercent: 5 },
              icon: "sword",
              color: "#38bdf8",
              value: 50,
            }),
          },
          {
            id: "choice_machado_pedra",
            name: "Machado de Pedra",
            categoryLabel: "Arma & Ferramenta (Corte)",
            description:
              "Lâmina chanfrada de pedra lascada encaixada na fenda do galho e amarrada firmemente. Dilacera inimigos e corta madeira (+10 Ataque, +1 Defesa, +8 Vigor).",
            createResult: () => ({
              id: `weapon_axe_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Machado de Pedra",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "incomum",
              description:
                "Machado rústico com gume afiado de pedra lascada preso por ligaduras de corda vegetal. Corta vegetação e desfere golpes dilacerantes.",
              stats: { attack: 10, defense: 1, staminaBonus: 8 },
              icon: "hammer",
              color: "#f97316",
              value: 50,
            }),
          },
          {
            id: "choice_faca_caca",
            name: "Faca de Caça Rústica",
            categoryLabel: "Ferramenta de Corte & Destrinchador",
            description:
              "Faca com gume afiado de pedra e cabo reforçado por corda vegetal. Permite destrinchar corpos de lobos, coelhos, cervos e dragões (+9 Ataque, +6% Velocidade).",
            createResult: () => ({
              id: `weapon_knife_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Faca de Caça Rústica",
              categoryType: "equipment",
              slot: "mao_direita",
              isEquippable: !0,
              rarity: "incomum",
              description:
                "Faca rústica de caçador com gume afiado de pedra lascada. Permite destrinchar animais abatidos para extrair carne, pele, ossos e órgãos.",
              stats: { attack: 9, speedBonusPercent: 6 },
              icon: "sword",
              color: "#e2e8f0",
              value: 55,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_faca_caca"
            ? {
                id: `weapon_knife_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Faca de Caça Rústica",
                categoryType: "equipment",
                slot: "mao_direita",
                isEquippable: !0,
                rarity: "incomum",
                description:
                  "Faca rústica de caçador com gume afiado de pedra lascada. Permite destrinchar animais abatidos para extrair carne, pele, ossos e órgãos.",
                stats: { attack: 9, speedBonusPercent: 6 },
                icon: "sword",
                color: "#e2e8f0",
                value: 55,
              }
            : e === "choice_machado_pedra"
              ? {
                  id: `weapon_axe_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                  name: "Machado de Pedra",
                  categoryType: "equipment",
                  slot: "mao_direita",
                  isEquippable: !0,
                  rarity: "incomum",
                  description:
                    "Machado rústico com gume afiado de pedra lascada preso por ligaduras de corda vegetal. Corta vegetação e desfere golpes dilacerantes.",
                  stats: { attack: 10, defense: 1, staminaBonus: 8 },
                  icon: "hammer",
                  color: "#f97316",
                  value: 50,
                }
              : {
                  id: `weapon_spear_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                  name: "Lança Primitiva",
                  categoryType: "equipment",
                  slot: "mao_direita",
                  isEquippable: !0,
                  rarity: "incomum",
                  description:
                    "Haste torneada de madeira com ponta cuneiforme afiada de pedra lascada presa por corda pequena. Ataques de perfuração ágil.",
                  stats: { attack: 11, speedBonusPercent: 5 },
                  icon: "sword",
                  color: "#38bdf8",
                  value: 50,
                },
      },
      {
        id: "fuse_pedra_galho_faca",
        name: "Faca de Pedra Lascada",
        category: "arma",
        categoryLabel: "Ferramenta & Destrinchador",
        ingredient1Name: "Pedra Lascada",
        ingredient2Name: "Galho de Madeira",
        description:
          "Encaixe uma lasca de pedra cortante num pequeno galho para criar uma faca rústica. Essencial para destrinchar corpos de lobos, coelhos e outros animais (+8 Ataque, +5% Velocidade).",
        match: (e, t) => Ua(e, t, i0, ec),
        createResult: () => ({
          id: `weapon_knife_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Faca de Pedra Lascada",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "comum",
          description:
            "Faca de lâmina afiada de pedra com cabo de galho rústico. Pode ser empunhada como arma veloz ou usada na mochila para destrinchar carcaças de animais abatidos.",
          stats: { attack: 8, speedBonusPercent: 5 },
          icon: "sword",
          color: "#cbd5e1",
          value: 40,
        }),
      },
      {
        id: "fuse_osso_corda_adaga",
        name: "Adaga de Osso Afiada",
        category: "arma",
        categoryLabel: "Arma Leve & Destrinchador",
        ingredient1Name: "Ossos de Animal",
        ingredient2Name: "Corda de Fibra Pequena",
        description:
          "Afie uma lasca óssea e envolva-a em corda para forjar uma adaga perfurante mortal. Perfeita para combate ágil e destrinchar feras rapidamente (+12 Ataque, +8% Velocidade).",
        match: (e, t) => Ua(e, t, Gb, gi),
        createResult: () => ({
          id: `weapon_knife_bone_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Adaga de Osso Afiada",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Lâmina afiada esculpida a partir de ossos de animais com empunhadura revestida de corda. Excelente para destrinchar criaturas e desferir golpes rápidos.",
          stats: { attack: 12, speedBonusPercent: 8 },
          icon: "sword",
          color: "#f8fafc",
          value: 65,
        }),
      },
      {
        id: "fuse_iron_sword",
        name: "Espada de Ferro Forjado",
        category: "arma",
        categoryLabel: "Arma Principal",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Cristal de Ferro",
        description:
          "Lâmina afiada fundida com núcleo de ferro e empunhadura ergonômica de madeira torneada.",
        match: (e, t) => Ua(e, t, ["galho"], ["ferro"]),
        createResult: () => ({
          id: `weapon_iron_sword_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Espada de Ferro Forjado",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Lâmina de gume preciso forjada com ferro denso. Corta vegetação e estilhaça defesas monstruosas.",
          stats: { attack: 11, defense: 2 },
          icon: "Sword",
          color: "#38bdf8",
          value: 65,
        }),
      },
      {
        id: "fuse_crystal_staff",
        name: "Cajado de Cristal Arcano",
        category: "arma",
        categoryLabel: "Arma Principal",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Drusa de Cristal",
        description:
          "Um nobre cajado esculpido com uma gema de cristal puro em seu topo. Vibra com energia mística e emite foco de luz.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["galho"],
            ["ametista", "safira", "rubi", "esmeralda", "drusa", "cristal"],
          ),
        createResult: () => ({
          id: `weapon_crystal_staff_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Cajado de Cristal Arcano",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Arma mística canalizadora que emana pulsações mágicas, amplificando o poder de ataque e iluminando o ambiente.",
          stats: { attack: 14, lightRadiusBonus: 35, staminaBonus: 15 },
          icon: "Gem",
          color: "#c084fc",
          value: 120,
        }),
      },
      {
        id: "fuse_mithril_blade",
        name: "Lâmina Espectral de Mitril",
        category: "arma",
        categoryLabel: "Arma Principal",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Minério de Mitril",
        description:
          "Forjada a partir do raríssimo mineral de mitril subterrâneo. É extraordinariamente leve e afiada como uma pluma espectral.",
        match: (e, t) => Ua(e, t, ["galho", "ferro", "seixo"], ["mitril"]),
        createResult: () => ({
          id: `weapon_mithril_blade_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Lâmina Espectral de Mitril",
          categoryType: "equipment",
          slot: "mao_direita",
          isEquippable: !0,
          rarity: "epico",
          description:
            "Lâmina lendária forjada com mitril puro. Seu balanço aerodinâmico acelera os passos e desfaz inimigos.",
          stats: { attack: 18, speedBonusPercent: 12, defense: 4 },
          icon: "Sword",
          color: "#67e8f9",
          value: 200,
        }),
      },
      {
        id: "fuse_seixo_pedras_lascadas",
        name: "Pedra Lascada (x4)",
        category: "utilitario",
        categoryLabel: "Lascamento & Lapidação",
        ingredient1Name: "Seixo de Pedra",
        ingredient2Name: "Seixo de Pedra",
        description:
          "Bata dois seixos densos com impacto seco para obter 4 lâminas afiadas de pedra lascada. Base essencial para pontas de lança, machados e ferramentas.",
        match: (e, t, l) => !l && Js(e) && Js(t),
        results: [
          {
            id: "choice_pedras_lascadas",
            name: "4x Pedras Lascadas",
            categoryLabel: "Material (x4)",
            description:
              "Fratura os 2 seixos em 4 lâminas cortantes de pedra lascada afiada para lanças e machados.",
            createResult: () => ({
              id: `item_pedra_lascada_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Pedra Lascada",
              categoryType: "material",
              stackCount: 4,
              isEquippable: !1,
              rarity: "comum",
              description:
                "Lâminas afiadas e pontiagudas de rocha obtidas ao lascar seixos. Ingrediente indispensável para pontas de lanças, lâminas de machado e ferramentas primitivas.",
              icon: "gem",
              color: "#94a3b8",
              value: 12,
            }),
          },
          {
            id: "choice_escudo_pedra",
            name: "Escudo de Pedra Lapidada",
            categoryLabel: "Secundária / Escudo",
            description:
              "Entalha e une os dois seixos maciços em forma de broquel convexo para aparar golpes corporais (+9 Defesa, +1 Ataque).",
            createResult: () => ({
              id: `shield_stone_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Escudo de Pedra Lapidada",
              categoryType: "equipment",
              slot: "mao_esquerda",
              isEquippable: !0,
              rarity: "comum",
              description:
                "Broquel de rocha densa capaz de repelir ataques físicos com grande estabilidade.",
              stats: { defense: 9, attack: 1 },
              icon: "Shield",
              color: "#64748b",
              value: 40,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_escudo_pedra"
            ? {
                id: `shield_stone_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Escudo de Pedra Lapidada",
                categoryType: "equipment",
                slot: "mao_esquerda",
                isEquippable: !0,
                rarity: "comum",
                description:
                  "Broquel de rocha densa capaz de repelir ataques físicos com grande estabilidade.",
                stats: { defense: 9, attack: 1 },
                icon: "Shield",
                color: "#64748b",
                value: 40,
              }
            : {
                id: `item_pedra_lascada_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Pedra Lascada",
                categoryType: "material",
                stackCount: 4,
                isEquippable: !1,
                rarity: "comum",
                description:
                  "Lâminas afiadas e pontiagudas de rocha obtidas ao lascar seixos. Ingrediente indispensável para pontas de lanças, lâminas de machado e ferramentas primitivas.",
                icon: "gem",
                color: "#94a3b8",
                value: 12,
              },
      },
    ],
    Hb = [
      {
        id: "fuse_iron_shield",
        name: "Escudo de Ferro Temperado",
        category: "armadura",
        categoryLabel: "Secundária / Escudo",
        ingredient1Name: "Cristal de Ferro",
        ingredient2Name: "Seixo de Pedra",
        description:
          "Escudo circular com aro e pregos de ferro puro reforçado por substrato mineral. Absorção estelar de dano.",
        match: (e, t) => Ua(e, t, ["ferro"], ["seixo"]),
        createResult: () => ({
          id: `shield_iron_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Escudo de Ferro Temperado",
          categoryType: "equipment",
          slot: "mao_esquerda",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Escudo impenetrável forjado em bigorna rúnica. Aumenta substancialmente a armadura.",
          stats: { defense: 16, attack: 2 },
          icon: "Shield",
          color: "#38bdf8",
          value: 110,
        }),
      },
      {
        id: "fuse_cinto_tunica_fibra",
        name: "Cinto de Fibra ou Túnica de Linho",
        category: "acessorio",
        categoryLabel: "Cinto & Vestimenta",
        ingredient1Name: "Corda de Fibra",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Trance cordas e feixes de fibra vegetal. Permite forjar o Cinto de Fibra (com 2 bolsos utilitários para armas, frascos e criaturas) ou a flexível Túnica de Linho.",
        match: (e, t) => (o0(e) && mn(t)) || (o0(t) && mn(e)),
        results: [
          {
            id: "choice_cinto_fibra",
            name: "Cinto de Fibra",
            categoryLabel: "Acessório / Cinto",
            description:
              "Cinto rústico trançado com corda e fibras vegetais. Concede +2 Defesa, +15 Vigor e libera 2 bolsos utilitários na cintura para carregar armas, frascos e criaturas pequenas.",
            createResult: () => ({
              id: `acc_belt_fiber_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Cinto de Fibra",
              categoryType: "equipment",
              slot: "cinto",
              isEquippable: !0,
              rarity: "comum",
              description:
                "Cinto trançado com cordas e fibras vegetais resistentes. Ao equipar, libera 2 bolsos utilitários na cintura para carregar armas, frascos e criaturas pequenas.",
              stats: { defense: 2, staminaBonus: 15 },
              icon: "SlidersHorizontal",
              color: "#84cc16",
              value: 35,
            }),
          },
          {
            id: "choice_tunic_linen",
            name: "Túnica de Linho do Aventureiro",
            categoryLabel: "Peitoral / Camisa",
            description:
              "Túnica leve e resistente tecida com fibras puras e reforçada com cordões de linho (+8 Defesa, +15 Vigor).",
            createResult: () => ({
              id: `armor_tunic_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Túnica de Linho do Aventureiro",
              categoryType: "equipment",
              slot: "camisa",
              isEquippable: !0,
              rarity: "comum",
              description:
                "Túnica leve e resistente tecida com fibras puras e reforçada com cordões de linho.",
              stats: { defense: 8, staminaBonus: 15 },
              icon: "Shirt",
              color: "#a3e635",
              value: 45,
            }),
          },
        ],
        createResult: (e) =>
          e === "choice_tunic_linen"
            ? {
                id: `armor_tunic_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Túnica de Linho do Aventureiro",
                categoryType: "equipment",
                slot: "camisa",
                isEquippable: !0,
                rarity: "comum",
                description:
                  "Túnica leve e resistente tecida com fibras puras e reforçada com cordões de linho.",
                stats: { defense: 8, staminaBonus: 15 },
                icon: "Shirt",
                color: "#a3e635",
                value: 45,
              }
            : {
                id: `acc_belt_fiber_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                name: "Cinto de Fibra",
                categoryType: "equipment",
                slot: "cinto",
                isEquippable: !0,
                rarity: "comum",
                description:
                  "Cinto trançado com cordas e fibras vegetais resistentes. Ao equipar, libera 2 bolsos utilitários na cintura para carregar armas, frascos e criaturas pequenas.",
                stats: { defense: 2, staminaBonus: 15 },
                icon: "SlidersHorizontal",
                color: "#84cc16",
                value: 35,
              },
      },
      {
        id: "fuse_iron_chestplate",
        name: "Peitoral de Ferro Articulado",
        category: "armadura",
        categoryLabel: "Peitoral / Camisa",
        ingredient1Name: "Cristal de Ferro",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Placas curvas de ferro sobrepostas fixadas em colete de fibra reforçada.",
        match: (e, t) => Ua(e, t, ["ferro"], ["fibra"]),
        createResult: () => ({
          id: `armor_iron_chest_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Peitoral de Ferro Articulado",
          categoryType: "equipment",
          slot: "camisa",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Armadura peitoral reforçada com placas de metal. Concede alta resistência a golpes corporais.",
          stats: { defense: 16, staminaBonus: 25 },
          icon: "Shirt",
          color: "#60a5fa",
          value: 125,
        }),
      },
      {
        id: "fuse_travel_cloak",
        name: "Capa Protetora de Resina",
        category: "armadura",
        categoryLabel: "Capa / Manto",
        ingredient1Name: "Fibra Vegetal",
        ingredient2Name: "Resina Natural",
        description:
          "Manto impermeável banhado em resina aromática. Protege contra tempestades e abrasões nas cavernas.",
        match: (e, t) => Ua(e, t, ["fibra"], ["resina"]),
        createResult: () => ({
          id: `armor_cloak_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Capa Protetora de Resina",
          categoryType: "equipment",
          slot: "capa",
          isEquippable: !0,
          rarity: "incomum",
          description: "Manto esvoaçante impermeabilizado com resina natural.",
          stats: { defense: 7, staminaBonus: 20 },
          icon: "Wind",
          color: "#f97316",
          value: 55,
        }),
      },
      {
        id: "fuse_travel_boots",
        name: "Botas Ágeis de Viajante",
        category: "armadura",
        categoryLabel: "Botas",
        ingredient1Name: "Fibra Vegetal",
        ingredient2Name: "Seixo de Pedra",
        description:
          "Calçado com solado reforçado com cascalho compactado e forro macio de fibra, impulsionando a marcha.",
        match: (e, t) => Ua(e, t, ["fibra"], ["seixo"]),
        createResult: () => ({
          id: `armor_boots_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Botas Ágeis de Viajante",
          categoryType: "equipment",
          slot: "botas",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Calçado confortável e aderente que acelera a velocidade de movimentação em +15%.",
          stats: { defense: 5, speedBonusPercent: 15 },
          icon: "Footprints",
          color: "#10b981",
          value: 60,
        }),
      },
      {
        id: "fuse_straw_hat",
        name: "Chapéu de Explorador das Matas",
        category: "armadura",
        categoryLabel: "Elmo / Chapéu",
        ingredient1Name: "Galho de Madeira",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Chapéu trançado de abas largas que resguarda a cabeça do aventureiro contra o sol e goteiras nas cavernas.",
        match: (e, t) => Ua(e, t, ["galho"], ["fibra"]),
        createResult: () => ({
          id: `armor_hat_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Chapéu de Explorador das Matas",
          categoryType: "equipment",
          slot: "chapeu",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Chapéu leve de explorador com abas que clareiam o campo de visão nas trilhas escuras.",
          stats: { defense: 5, lightRadiusBonus: 15 },
          icon: "Crown",
          color: "#eab308",
          value: 50,
        }),
      },
      {
        id: "fuse_miner_pants",
        name: "Calça Reforçada de Aventureiro",
        category: "armadura",
        categoryLabel: "Calça / Pernas",
        ingredient1Name: "Fibra Vegetal",
        ingredient2Name: "Pederneira",
        description:
          "Perneiras confeccionadas com tecido espesso e joelheiras protegidas para escaladas em terrenos rochosos.",
        match: (e, t) => Ua(e, t, ["fibra"], ["pederneira", "pedreneira"]),
        createResult: () => ({
          id: `armor_pants_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Calça Reforçada de Aventureiro",
          categoryType: "equipment",
          slot: "calca",
          isEquippable: !0,
          rarity: "comum",
          description: "Calça flexível e resistente a rasgos e espinhos.",
          stats: { defense: 7, staminaBonus: 10 },
          icon: "Layers",
          color: "#b45309",
          value: 40,
        }),
      },
      {
        id: "fuse_slime_boots",
        name: "Botas Elásticas de Gelatina",
        category: "armadura",
        categoryLabel: "Botas / Pés",
        ingredient1Name: "Gelatina / Corpo de Gosma",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Botas forradas com polímero gelatinoso elástico. Amortecem passos e concedem velocidade e agilidade excepcional.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["gosma", "slime", "gelatina", "corpo"],
            ["fibra", "resina", "couro"],
          ),
        createResult: () => ({
          id: `armor_boots_slime_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Botas Elásticas de Gelatina",
          categoryType: "equipment",
          slot: "botas",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Calçado especial com sola de gel biológico que reduz a fadiga da corrida e previne que monstros consigam te prender.",
          stats: { defense: 6, speedBonusPercent: 22, staminaBonus: 15 },
          icon: "Footprints",
          color: "#4ade80",
          value: 75,
        }),
      },
      {
        id: "fuse_slime_shield",
        name: "Escudo Viscoso Anti-Impacto",
        category: "armadura",
        categoryLabel: "Escudo / Mão Esquerda",
        ingredient1Name: "Gelatina / Corpo de Gosma",
        ingredient2Name: "Cristal de Ferro",
        description:
          "Escudo forjado com reforço de liga de ferro e camada externa gelatinosa que amortece investidas de feras.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["gosma", "slime", "gelatina", "corpo"],
            ["ferro", "seixo", "pedra"],
          ),
        createResult: () => ({
          id: `armor_shield_slime_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Escudo Viscoso Anti-Impacto",
          categoryType: "equipment",
          slot: "mao_esquerda",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Escudo que dissipa força de impacto e repele garras de predadores com sua resiliência elástica.",
          stats: { defense: 14, attack: 2 },
          icon: "Shield",
          color: "#10b981",
          value: 85,
        }),
      },
    ],
    Wb = [
      {
        id: "fuse_gold_pendant",
        name: "Pingente do Luar Radiante",
        category: "acessorio",
        categoryLabel: "Amuleto / Pingente",
        ingredient1Name: "Pepita de Ouro",
        ingredient2Name: "Drusa de Cristal",
        description:
          "Amuleto nobre confeccionado em ouro lapidado com um cristal prismático incrustado. Dissipa as sombras ao redor.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["ouro"],
            ["ametista", "safira", "rubi", "esmeralda", "drusa", "cristal"],
          ),
        createResult: () => ({
          id: `acc_pendant_moon_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Pingente do Luar Radiante",
          categoryType: "equipment",
          slot: "pingente",
          isEquippable: !0,
          rarity: "epico",
          description:
            "Jóia mística antiga que emite um brilho espectral límpido, aumentando poder e alcance luminoso.",
          stats: { attack: 6, defense: 6, lightRadiusBonus: 35 },
          icon: "Gem",
          color: "#f59e0b",
          value: 150,
        }),
      },
      {
        id: "fuse_gold_bracelet",
        name: "Bracelete de Força Dourado",
        category: "acessorio",
        categoryLabel: "Bracelete Direito",
        ingredient1Name: "Pepita de Ouro",
        ingredient2Name: "Cristal de Ferro",
        description:
          "Pulseira pesada forjada em liga de ouro e ferro nobre. Estabiliza a postura ao desferir golpes com as mãos ou armas.",
        match: (e, t) => Ua(e, t, ["ouro"], ["ferro"]),
        createResult: () => ({
          id: `acc_bracelet_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Bracelete de Força Dourado",
          categoryType: "equipment",
          slot: "bracelete_direito",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Bracelete entalhado com runas de solidez que concede maior vigor físico.",
          stats: { attack: 5, defense: 4, staminaBonus: 20 },
          icon: "CircleDot",
          color: "#fbbf24",
          value: 110,
        }),
      },
      {
        id: "fuse_gold_belt",
        name: "Cinto com Fivela de Ouro Nobre",
        category: "acessorio",
        categoryLabel: "Cinto / Faixa",
        ingredient1Name: "Pepita de Ouro",
        ingredient2Name: "Fibra Vegetal",
        description:
          "Cinto de couro trançado com fivela forjada em ouro polido, projetado para equilibrar o centro de gravidade.",
        match: (e, t) => Ua(e, t, ["ouro"], ["fibra"]),
        createResult: () => ({
          id: `acc_belt_gold_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Cinto com Fivela de Ouro Nobre",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Cinto resistente que acomoda frascos e ferramentas, garantindo +30 de vigor adicional.",
          stats: { defense: 5, staminaBonus: 30 },
          icon: "SlidersHorizontal",
          color: "#f59e0b",
          value: 100,
        }),
      },
      {
        id: "fuse_fiber_pouch",
        name: "Bolsa de Viagem de Fibra",
        category: "acessorio",
        categoryLabel: "Mochila / Bolsa",
        ingredient1Name: "Corda de Fibra Pequena",
        ingredient2Name: "Resina Natural",
        description:
          "Bolsa leve de tiracolo tecida com cordas e selada com resina. Quando equipada, concede +6 slots de itens (+6 slots verdes de Bolsa)!",
        match: (e, t) => Ua(e, t, ["corda", "fibra"], ["resina"]),
        createResult: () => ({
          id: `acc_pouch_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Bolsa de Viagem de Fibra",
          categoryType: "equipment",
          slot: "mochila",
          isEquippable: !0,
          rarity: "comum",
          description:
            "Bolsa leve de aventureiro. Quando equipada, concede +6 slots de itens (+6 slots verdes de Bolsa)!",
          stats: { defense: 1, staminaBonus: 15 },
          icon: "Briefcase",
          color: "#10b981",
          value: 50,
        }),
      },
      {
        id: "fuse_leather_backpack",
        name: "Mochila de Couro Reforçada",
        category: "acessorio",
        categoryLabel: "Mochila / Bolsa",
        ingredient1Name: "Resina Natural",
        ingredient2Name: "Seixo de Pedra",
        description:
          "Mochila reforçada com suportes rígidos. Quando equipada, concede +15 slots de itens (+15 slots anil de Mochila)!",
        match: (e, t) => Ua(e, t, ["resina"], ["seixo"]),
        createResult: () => ({
          id: `acc_backpack_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Mochila de Couro Reforçada",
          categoryType: "equipment",
          slot: "mochila",
          isEquippable: !0,
          rarity: "incomum",
          description:
            "Mochila reforçada de aventureiro. Quando equipada, concede +15 slots de itens (+15 slots anil de Mochila)!",
          stats: { defense: 3, staminaBonus: 35 },
          icon: "Briefcase",
          color: "#6366f1",
          value: 90,
        }),
      },
      {
        id: "fuse_potion_vigor",
        name: "Frasco de Poção de Vigor",
        category: "pocao",
        categoryLabel: "Consumível / Poção",
        ingredient1Name: "Esporos de Cogumelo",
        ingredient2Name: "Resina Natural",
        description:
          "Destilação alquímica concentrada que recupera instantaneamente todo o vigor físico e fôlego do personagem.",
        match: (e, t) => Ua(e, t, ["cogumelo", "esporos"], ["resina"]),
        createResult: () => ({
          id: `potion_vigor_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Frasco de Poção de Vigor",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "incomum",
          description:
            "Tônico revitalizante destilado de esporos e resina. Restaura instantaneamente 100% do vigor ao consumir!",
          icon: "Sparkles",
          color: "#34d399",
          stackCount: 1,
          value: 35,
        }),
      },
      {
        id: "fuse_potion_arcane",
        name: "Elixir de Cristal Espectral",
        category: "pocao",
        categoryLabel: "Consumível / Elixir",
        ingredient1Name: "Esporos de Cogumelo",
        ingredient2Name: "Drusa de Cristal",
        description:
          "Poção cintilante e efervescente que transborda de partículas cristalinas. Restaura vigor e regenera energias vitais.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["cogumelo", "esporos"],
            ["ametista", "safira", "rubi", "esmeralda", "drusa", "cristal"],
          ),
        createResult: () => ({
          id: `potion_arcane_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Elixir de Cristal Espectral",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "raro",
          description:
            "Elixir brilhante com essência pura de cristais que restaura energia corporal instantaneamente.",
          icon: "Sparkles",
          color: "#38bdf8",
          stackCount: 1,
          value: 70,
        }),
      },
      {
        id: "fuse_spark_powder",
        name: "Pó Alquímico de Centelhas",
        category: "pocao",
        categoryLabel: "Consumível / Centelha",
        ingredient1Name: "Pederneira",
        ingredient2Name: "Resina Natural",
        description:
          "Pó inflamável preparado com lascas de pederneira e resina seca. Produz faíscas que afugentam monstros.",
        match: (e, t) => Ua(e, t, ["pederneira", "pedreneira"], ["resina"]),
        createResult: () => ({
          id: `item_spark_powder_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Pó Alquímico de Centelhas",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "incomum",
          description:
            "Composto pirotécnico que estoura em pequenas labaredas com estalos ao ser espalhado no ar.",
          icon: "Sparkles",
          color: "#f97316",
          stackCount: 2,
          value: 30,
        }),
      },
      {
        id: "fuse_slime_potion",
        name: "Tônico Restaurador de Gelatina",
        category: "pocao",
        categoryLabel: "Consumível / Tônico",
        ingredient1Name: "Gelatina / Corpo de Gosma",
        ingredient2Name: "Esporos de Cogumelo",
        description:
          "Poção viscosa e efervescente que regenera instantaneamente a saúde física e revigora toda a energia do explorador.",
        match: (e, t) =>
          Ua(
            e,
            t,
            ["gosma", "slime", "gelatina", "corpo"],
            ["cogumelo", "esporos", "resina"],
          ),
        createResult: () => ({
          id: `potion_slime_vitality_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Tônico Restaurador de Gelatina",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "incomum",
          description:
            "Elixir encorpado de propriedades regenerativas. Restaura vigor instantaneamente.",
          icon: "Droplets",
          color: "#22c55e",
          stackCount: 2,
          value: 45,
        }),
      },
      {
        id: "fuse_bau_madeira",
        name: "Baú de Madeira",
        category: "utilitario",
        categoryLabel: "Construção & Armazenamento",
        ingredient1Name: "Tronco de Madeira",
        ingredient2Name: "Tronco de Madeira",
        description:
          "Entalhe e una dois troncos robustos na forja para construir um Baú de Madeira (12 slots de armazenamento). Ao criar, escolha o local no mapa usando o sistema de posicionamento verde igual ao da cabana!",
        match: (e, t, l) =>
          !l &&
          et(e, "tronco", "wood_log", "tora") &&
          et(t, "tronco", "wood_log", "tora"),
        createResult: () => ({
          id: `item_bau_madeira_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          name: "Baú de Madeira",
          categoryType: "consumable",
          isEquippable: !1,
          isPlaceableChest: !0,
          rarity: "incomum",
          stackCount: 1,
          value: 60,
          icon: "📦",
          color: "#d97706",
          description:
            "Baú resistente de carvalho com ferragens. Escolha onde posicionar no mapa para guardar até 12 itens com segurança (pressione [F] perto dele para abrir).",
        }),
      },
    ],
    bl = [...FUSION_RECIPES, ...Fb, ...Hb, ...Wb];
