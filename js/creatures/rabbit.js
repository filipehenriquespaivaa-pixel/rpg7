/* js/creatures/rabbit.js
 * Criatura COMPLETA: Coelho dos Prados. Tudo que define o coelho fica neste arquivo.
 * Para criar outra criatura, copie este arquivo e ajuste.
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CREATURES.rabbit = {
  id: "rabbit",
  // Nascimento no mundo (valores do spawn)
  spawn: { name: "Coelho dos Prados", color: "#f1f5f9", accentColor: "#fbcfe8", hp: 12, attack: 1, speed: 1.2, scale: 0.85 },
  // Comportamento: presa foge do jogador; particulas ao morrer
  behavior: {
    prey: true,
    deathParticles: 8,
    // Tempo de fuga ao ser atingido por lobo / pelo jogador
    wolfHitFleeTimer: 3.5,
    playerHitFleeTimer: 4.5,
    // Valores usados por updatePreyAI (creatures-manager.js)
    preyAI: {
      alertRadius: 110,
      wolfRadius: 155,
      giveUpRadius: 185,
      fleeTimerOnThreat: 3,
      fleeProbeDistance: 24,
      fleeSpeedMult: 1.85,
      zigzag: true,
      idleWait: [1.8, 2.2],
      wanderWait: [1.4, 1.8],
      wanderSpeedMult: 0.45,
    },
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Carcaça de Coelho",
    bodyName: "Corpo de Coelho",
    description: "Corpo de coelho abatido. Pode ser destrinchado com uma faca para extrair ossos, pele, carne, entranhas e pé de coelho.",
  },
  // Ficha mostrada ao destrinchar
  sheet: {
        name: "Coelho dos Prados",
        species: "Herbívoro Veloz",
        icon: "🐇",
        badgeColor: "text-amber-200 border-amber-500/40 bg-amber-950/60",
        description:
          "Pequeno herbívoro veloz. Rende pele aveludada, carne tenra magra, ossos finos, entranhas e o afamado pé de coelho da sorte.",
        exclusiveNote:
          "Item Exclusivo: Pé de Coelho da Sorte (amuleto de velocidade e vigor).",
      },
  // Como reconhecer um item/carcaca desta criatura (t = nome, l = id, o = icone, tudo minusculo)
  detect: (t, l, o) =>
    t.includes("coelho") ||
    t.includes("rabbit") ||
    l.includes("rabbit") ||
    l.includes("coelho") ||
    o === "creature_rabbit",
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatorio)
  loot: (t, l) => [
        {
          id: `butcher_rabbit_bone_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_osso_coelho_${t}_${l()}`,
            name: "Ossos de Coelho",
            categoryType: "material",
            rarity: "comum",
            stackCount: 2,
            isEquippable: !1,
            icon: "bone",
            color: "#f8fafc",
            value: 8,
            description:
              "Pequenos ossículos leves de coelho dos prados. Delicados e fáceis de polir para agulhas de costura.",
          },
        },
        {
          id: `butcher_rabbit_pelt_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_pele_coelho_${t}_${l()}`,
            name: "Pele Macia de Coelho",
            categoryType: "material",
            rarity: "incomum",
            stackCount: 1,
            isEquippable: !1,
            icon: "shirt",
            color: "#e2e8f0",
            value: 24,
            description:
              "Pele aveludada de extrema maciez. Usada no forro interno de luvas e gorros de alta qualidade.",
          },
        },
        {
          id: `butcher_rabbit_meat_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_carne_coelho_${t}_${l()}`,
            name: "Carne de Coelho Fresca",
            categoryType: "consumable",
            rarity: "comum",
            stackCount: 1,
            isEquippable: !1,
            icon: "utensils",
            color: "#fb7185",
            value: 20,
            description:
              "Carne tenra, magra e altamente digestiva (+35 Vida, +40 Stamina ao consumir). Ótima para ensopados.",
          },
        },
        {
          id: `butcher_rabbit_guts_${t}_${l()}`,
          isExclusive: !1,
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_entranhas_coelho_${t}_${l()}`,
            name: "Entranhas de Coelho",
            categoryType: "material",
            rarity: "comum",
            stackCount: 1,
            isEquippable: !1,
            icon: "heart",
            color: "#b91c1c",
            value: 10,
            description:
              "Entranhas miúdas colhidas no corte do coelho. Podem ser aproveitadas em iscas e estudos alquímicos.",
          },
        },
        {
          id: `butcher_rabbit_foot_${t}_${l()}`,
          isExclusive: !0,
          exclusiveLabel: "⭐ Exclusivo de Coelho",
          status: "pending",
          item: {
            isCreaturePart: !0,
            id: `item_pe_de_coelho_${t}_${l()}`,
            name: "Pé de Coelho da Sorte",
            categoryType: "equipment",
            slot: "pingente",
            isEquippable: !0,
            rarity: "raro",
            stackCount: 1,
            icon: "sparkles",
            color: "#38bdf8",
            value: 65,
            stats: { speedBonusPercent: 7, staminaBonus: 16, defense: 1 },
            description:
              "Tradicional amuleto da fortuna! Traz boa sorte, passos ligeiros e vigor renovado ao aventureiro (+7% Velocidade, +16 Vigor, +1 Defesa).",
          },
        },
      ],
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone (antigo lb). t=nome, l=id, o=icone (minusculos)
  detectIcon: (t, l, o) => o === "creature_rabbit" || o === "rabbit" || t.includes("coelho") || l.includes("rabbit"),
  // Desenho no Canvas (codigo movido sem alteracoes dos arquivos de engine)
  draw: {
    // Corpo vivo no mundo (antigo Ng)
    body: function (e, t, l, o) {
    e.save();
    const u = t.facing === "left" ? -1 : 1;
    e.scale(u, 1);
    const m = o ? "#ffffff" : t.color || "#f1f5f9",
      c = o ? "#f43f5e" : "#fbcfe8",
      g = t.vx * t.vx + t.vy * t.vy > 0.04,
      y = (t.fleeTimer || 0) > 0,
      w = y ? t.animTimer * 20 : g ? t.animTimer * 12 : t.animTimer * 3,
      v = g
        ? Math.abs(Math.sin(w)) * (y ? -6.5 : -4.5) * l
        : Math.sin(t.animTimer * 3) * 0.5 * l,
      T = Math.sin(t.animTimer * 4) * 0.15;
    ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
      e.beginPath(),
      e.ellipse(0, 3 * l, (7 + (g ? 1 : 0)) * l, 3.5 * l, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = m),
      e.beginPath(),
      e.ellipse(0, -3 * l + v, 6.5 * l, 4.5 * l, 0.08, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-6.5 * l, -4 * l + v, 2.2 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = m),
      e.beginPath(),
      e.ellipse(5 * l, -5 * l + v, 3.8 * l, 3.2 * l, 0.05, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = m),
      e.beginPath(),
      e.ellipse(
        3.8 * l,
        -10 * l + v,
        1.4 * l,
        4.2 * l,
        -0.15 + T,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      e.beginPath(),
      e.ellipse(
        5.8 * l,
        -9.8 * l + v,
        1.4 * l,
        4.2 * l,
        0.1 - T,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      (e.fillStyle = c),
      e.beginPath(),
      e.ellipse(
        3.8 * l,
        -10 * l + v,
        0.7 * l,
        3 * l,
        -0.15 + T,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      e.beginPath(),
      e.ellipse(5.8 * l, -9.8 * l + v, 0.7 * l, 3 * l, 0.1 - T, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = o ? "#ef4444" : "#0f172a"),
      e.beginPath(),
      e.arc(6.2 * l, -5.8 * l + v, 1.1 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(6 * l, -6.1 * l + v, 0.4 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#f43f5e"),
      e.beginPath(),
      e.arc(8.5 * l, -4.6 * l + v, 0.7 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = m),
      e.fillRect(-2 * l, 0.5 * l + v, 2 * l, 2.5 * l),
      e.fillRect(3 * l, 0.5 * l + v, 2 * l, 2.5 * l),
      e.restore());
  },
    // Carcaca no chao (antigo ramo "rabbit" de Ag): e=ctx, t=carcaca, o=escala, u=fade
    carcass: function (e, t, o, u) {
        const m = t.color || "#f1f5f9";
  ((e.fillStyle = m),
    e.beginPath(),
    e.ellipse(0, 1 * o, 8 * o, 5 * o, 0.05, 0, Math.PI * 2),
    e.fill(),
    (e.fillStyle = "#ffffff"),
    e.beginPath(),
    e.arc(-7.5 * o, 0, 2.5 * o, 0, Math.PI * 2),
    e.fill(),
    (e.fillStyle = m),
    e.beginPath(),
    e.ellipse(6 * o, -1 * o, 4.5 * o, 3.8 * o, 0.1, 0, Math.PI * 2),
    e.fill(),
    e.beginPath(),
    e.ellipse(3 * o, -5 * o, 2 * o, 5 * o, -0.4, 0, Math.PI * 2),
    e.fill(),
    (e.fillStyle = "#fbcfe8"),
    e.beginPath(),
    e.ellipse(3 * o, -5 * o, 1 * o, 3.5 * o, -0.4, 0, Math.PI * 2),
    e.fill(),
    (e.strokeStyle = `rgba(15, 23, 42, ${u})`),
    (e.lineWidth = 1.2 * o),
    e.beginPath(),
    e.moveTo(6.5 * o, -2.5 * o),
    e.lineTo(8.5 * o, -0.5 * o),
    e.moveTo(8.5 * o, -2.5 * o),
    e.lineTo(6.5 * o, -0.5 * o),
    e.stroke());
},
    // Icone da criatura em itens/inventario (antigo zb)
    icon: function (e, t, l) {
    const o = l.color || "#f1f5f9";
    ((e.fillStyle = o),
      e.beginPath(),
      e.ellipse(0, 1 * t, 7 * t, 4.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-6.5 * t, 0, 2.2 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = o),
      e.beginPath(),
      e.ellipse(5 * t, -1 * t, 4 * t, 3.2 * t, 0.1, 0, Math.PI * 2),
      e.fill(),
      e.beginPath(),
      e.ellipse(3 * t, -5 * t, 1.5 * t, 4.5 * t, -0.3, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#fbcfe8"),
      e.beginPath(),
      e.ellipse(3 * t, -5 * t, 0.8 * t, 3 * t, -0.3, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#0f172a"),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(5.5 * t, -2 * t),
      e.lineTo(7.5 * t, 0),
      e.moveTo(7.5 * t, -2 * t),
      e.lineTo(5.5 * t, 0),
      e.stroke());
  },
  },
};
