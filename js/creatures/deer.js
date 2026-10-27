/* js/creatures/deer.js
 * Criatura COMPLETA: Cervo da Floresta (presa). Tudo que define o cervo fica neste arquivo.
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CREATURES.deer = {
  id: "deer",
  // Nascimento no mundo (valores do spawn)
  spawn: { name: "Cervo da Floresta", color: "#a16207", accentColor: "#fef08a", hp: 20, attack: 1, speed: 1.1, scale: 1 },
  // Comportamento: presa foge do jogador e de lobos; particulas ao morrer
  behavior: {
    prey: true,
    deathParticles: 12,
    // Tempo de fuga ao ser atingido por lobo / pelo jogador
    wolfHitFleeTimer: 5.5,
    playerHitFleeTimer: 6,
    // Valores usados por updatePreyAI (creatures-manager.js)
    preyAI: {
      alertRadius: 175,
      wolfRadius: 230,
      giveUpRadius: 340,
      fleeTimerOnThreat: 5,
      fleeProbeDistance: 36,
      fleeSpeedMult: 2.7,
      zigzag: false,
      idleWait: [2.5, 2.5],
      wanderWait: [2, 2.5],
      wanderSpeedMult: 0.4,
    },
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Carcaça de Cervo",
    bodyName: "Corpo de Cervo",
    description: "Corpo de cervo abatido. Pode ser destrinchado com uma faca para extrair ossos, pele, carne, entranhas e chifres.",
  },
  // Ficha mostrada ao destrinchar
  sheet: {
        name: "Cervo da Floresta",
        species: "Cervídeo Nobre",
        icon: "🦌",
        badgeColor:
          "text-emerald-200 border-emerald-500/40 bg-emerald-950/60",
        description:
          "Nobre animal silvestre de galhada imponente. Rende carne nutritiva, couro nobre, ossos densos, entranhas e chifres pontiagudos.",
        exclusiveNote:
          "Item Exclusivo: Chifre de Cervo (galhada sólida para lanças e elmos).",
      },
  // Como reconhecer um item/carcaca desta criatura (t = nome, l = id, o = icone, tudo minusculo)
  // (wolf.js carrega ANTES deste arquivo, entao o lobo ja tem prioridade sobre o cervo na deteccao)
  detect: (t, l, o) =>
    t.includes("cervo") ||
    t.includes("deer") ||
    t.includes("veado") ||
    t.includes("alce") ||
    t.includes("antílope") ||
    l.includes("deer") ||
    l.includes("cervo") ||
    o === "creature_deer",
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatorio)
  loot: (t, l) => [
        {
          id: `butcher_deer_bone_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_osso_cervo_${t}_${l()}`,
            name: "Ossos de Cervo",
            categoryType: "material",
            rarity: "comum",
            stackCount: 3,
            isEquippable: !1,
            icon: "bone",
            color: "#e2e8f0",
            value: 15,
            description:
              "Ossos longos e fortes de cervídeo. Ideais para cabos de ferramentas e pontas endurecidas.",
          },
        },
        {
          id: `butcher_deer_pelt_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_pele_cervo_${t}_${l()}`,
            name: "Couro Nobre de Cervo",
            categoryType: "material",
            rarity: "incomum",
            stackCount: 2,
            isEquippable: !1,
            icon: "shirt",
            color: "#a16207",
            value: 35,
            description:
              "Couro espesso e elástico de cervo florestal. Matéria-prima superior para peitorais, aljavas e calçados flexíveis.",
          },
        },
        {
          id: `butcher_deer_meat_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_carne_cervo_${t}_${l()}`,
            name: "Carne de Caça de Cervo",
            categoryType: "consumable",
            rarity: "comum",
            stackCount: 3,
            isEquippable: !1,
            icon: "utensils",
            color: "#ef4444",
            value: 24,
            description:
              "Carne nobre e substancial (+45 Vida, +50 Stamina). Nutre generosamente e recupera o vigor nas jornadas.",
          },
        },
        {
          id: `butcher_deer_guts_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_entranhas_cervo_${t}_${l()}`,
            name: "Entranhas de Cervo",
            categoryType: "material",
            rarity: "comum",
            stackCount: 1,
            isEquippable: !1,
            icon: "heart",
            color: "#991b1b",
            value: 12,
            description:
              "Entranhas e órgãos colhidos com cuidado. Usados em unguentos e filtros medicinais da floresta.",
          },
        },
        {
          id: `butcher_deer_horn_${t}_${l()}`,
          isExclusive: !0,
          exclusiveLabel: "⭐ Exclusivo de Cervo",
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_chifre_cervo_${t}_${l()}`,
            name: "Chifre de Cervo da Floresta",
            categoryType: "material",
            rarity: "raro",
            stackCount: 2,
            isEquippable: !1,
            icon: "sparkles",
            color: "#d97706",
            value: 60,
            description:
              "Galhada esbelta e pontiaguda de cervo adulto. Item exclusivo nobre para adornar armas, arcos reforçados e troféus.",
          },
        },
      ],
  // Reconhecer para escolher o DESENHO do icone (antigo lb)
  detectIcon: (t, l, o) => o === "creature_deer" || o === "deer" || t.includes("cervo") || l.includes("deer"),
  // Desenho no Canvas (codigo movido sem alteracoes)
  draw: {
    // Corpo vivo no mundo (antigo Rg)
    body: function (e, t, l, o) {
    e.save();
    const u = t.facing === "left" ? -1 : 1;
    e.scale(u, 1);
    const m = o ? "#ffffff" : t.color || "#a16207",
      c = o ? "#e2e8f0" : "#fef08a",
      g = t.vx * t.vx + t.vy * t.vy > 0.04,
      y = (t.fleeTimer || 0) > 0,
      w = y ? t.animTimer * 16 : g ? t.animTimer * 8 : t.animTimer * 2,
      v = y
        ? Math.sin(w * 2) * 2.8 * l
        : g
          ? Math.sin(w * 2) * 1.5 * l
          : Math.sin(t.animTimer * 2) * 0.4 * l;
    ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
      e.beginPath(),
      e.ellipse(0, 5 * l, (y ? 14 : 12) * l, 4.5 * l, 0, 0, Math.PI * 2),
      e.fill());
    const T = y ? 5.5 : 3,
      S = g ? Math.sin(w) * T * l : 0,
      p = g ? Math.sin(w + Math.PI) * T * l : 0;
    ((e.fillStyle = m),
      e.fillRect(-6 * l + S, 1 * l, 1.8 * l, 5.5 * l),
      e.fillRect(-3 * l - S, 1 * l, 1.8 * l, 5.5 * l),
      e.fillRect(3 * l + p, 1 * l, 1.8 * l, 5.5 * l),
      e.fillRect(6 * l - p, 1 * l, 1.8 * l, 5.5 * l),
      (e.fillStyle = m),
      e.beginPath(),
      e.ellipse(0, -3 * l + v, 10 * l, 5.5 * l, 0.02, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = c),
      e.beginPath(),
      e.ellipse(1 * l, -1 * l + v, 6 * l, 2.5 * l, 0.02, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      y
        ? (e.moveTo(-10 * l, -4 * l + v),
          e.lineTo(-13.5 * l, -10 * l + v),
          e.lineTo(-9.5 * l, -2 * l + v))
        : (e.moveTo(-10 * l, -4 * l + v),
          e.lineTo(-12.5 * l, -6 * l + v),
          e.lineTo(-10.5 * l, -2 * l + v)),
      e.closePath(),
      e.fill(),
      (e.fillStyle = m),
      e.beginPath(),
      e.moveTo(5 * l, -4 * l + v),
      e.lineTo(8 * l, -12 * l + v),
      e.lineTo(11 * l, -11 * l + v),
      e.lineTo(8 * l, -1 * l + v),
      e.closePath(),
      e.fill(),
      e.beginPath(),
      e.ellipse(10 * l, -12 * l + v, 4.5 * l, 3.2 * l, 0.15, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#78350f"),
      (e.lineWidth = 1.8 * l),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(8 * l, -14 * l + v),
      e.lineTo(6 * l, -20 * l + v),
      e.lineTo(9 * l, -23 * l + v),
      e.moveTo(7 * l, -17 * l + v),
      e.lineTo(4 * l, -19 * l + v),
      e.moveTo(8 * l, -19 * l + v),
      e.lineTo(11 * l, -20 * l + v),
      e.stroke(),
      (e.fillStyle = o ? "#ef4444" : "#0f172a"),
      e.beginPath(),
      e.arc(11 * l, -13 * l + v, 1.2 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(10.8 * l, -13.3 * l + v, 0.5 * l, 0, Math.PI * 2),
      e.fill(),
      e.restore());
  },
    // Carcaca no chao (antigo ramo "deer" de Ag): e=ctx, t=carcaca, o=escala, u=fade
    carcass: function (e, t, o, u) {
        const m = t.color || "#a16207";
  ((e.fillStyle = m),
    e.beginPath(),
    e.ellipse(0, 2 * o, 12 * o, 6 * o, 0, 0, Math.PI * 2),
    e.fill(),
    (e.fillStyle = "#fef08a"),
    e.beginPath(),
    e.ellipse(1 * o, 4 * o, 7 * o, 2.5 * o, 0, 0, Math.PI * 2),
    e.fill(),
    (e.fillStyle = m),
    e.beginPath(),
    e.ellipse(10 * o, 0, 5.5 * o, 4 * o, 0.1, 0, Math.PI * 2),
    e.fill(),
    (e.strokeStyle = "#78350f"),
    (e.lineWidth = 1.8 * o),
    e.beginPath(),
    e.moveTo(8 * o, -2 * o),
    e.lineTo(7 * o, -8 * o),
    e.lineTo(10 * o, -11 * o),
    e.moveTo(7.5 * o, -5 * o),
    e.lineTo(5 * o, -7 * o),
    e.stroke(),
    (e.strokeStyle = `rgba(15, 23, 42, ${u})`),
    (e.lineWidth = 1.3 * o),
    e.beginPath(),
    e.moveTo(9 * o, -1.5 * o),
    e.lineTo(11 * o, 0.5 * o),
    e.moveTo(11 * o, -1.5 * o),
    e.lineTo(9 * o, 0.5 * o),
    e.stroke());
},
    // Icone da criatura em itens/inventario (antigo Lb)
    icon: function (e, t, l) {
    const o = l.color || "#a16207";
    ((e.fillStyle = o),
      e.beginPath(),
      e.ellipse(0, 1 * t, 9 * t, 5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#fef08a"),
      e.beginPath(),
      e.ellipse(1 * t, 3 * t, 5 * t, 2 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = o),
      e.beginPath(),
      e.ellipse(8 * t, -2 * t, 4.5 * t, 3 * t, 0.1, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#78350f"),
      (e.lineWidth = 1.4 * t),
      e.beginPath(),
      e.moveTo(7 * t, -4 * t),
      e.lineTo(6 * t, -9 * t),
      e.lineTo(9 * t, -11 * t),
      e.moveTo(6.5 * t, -6.5 * t),
      e.lineTo(4.5 * t, -8 * t),
      e.stroke(),
      (e.strokeStyle = "#0f172a"),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(8 * t, -3 * t),
      e.lineTo(9.5 * t, -1.5 * t),
      e.moveTo(9.5 * t, -3 * t),
      e.lineTo(8 * t, -1.5 * t),
      e.stroke());
  },
  },
};
