/* js/creatures/bat.js
 * Criatura COMPLETA: Morcego das Profundezas.
 * Tudo que define o morcego fica neste arquivo.
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CREATURES.bat = {
  id: "bat",
  // Nascimento no mundo (valores do spawn)
  spawn: {
    name: "Morcego das Profundezas",
    color: "#475569",
    accentColor: "#f43f5e",
    hp: 18,
    attack: 5,
    speed: 1.25,
    scale: 0.9,
  },
  // Comportamento: monstro hostil, foge de fogueiras/tochas, particulas ao morrer
  behavior: {
    prey: false,
    fearsFire: true,
    deathParticles: 6,
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Carcaça de Morcego",
    bodyName: "Corpo de Morcego",
    description:
      "Corpo de morcego das profundezas abatido. Pode ser destrinchado com uma faca para extrair asas membranosas, ossos ocos e carne magra.",
  },
  // Ficha mostrada ao destrinchar
  sheet: {
    name: "Morcego das Profundezas",
    species: "Predador Aéreo Cavernoso",
    icon: "🦇",
    badgeColor: "text-slate-300 border-slate-500/40 bg-slate-950/60",
    description:
      "Criatura alada misteriosa que esvoaça em cavernas e noites escuras. Rende asas coriáceas, ossos leves e carne magra.",
    exclusiveNote:
      "Item Exclusivo: Asa Membranosa de Morcego (material para capas e alquimia).",
  },
  // Como reconhecer um item/carcaca desta criatura (t = nome, l = id, o = icone, tudo minusculo)
  detect: (t, l, o) =>
    t.includes("morcego") ||
    t.includes("bat") ||
    l.includes("bat") ||
    l.includes("morcego") ||
    o === "creature_bat",
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatorio)
  loot: (t, l) => [
    {
      id: `butcher_bat_wing_${t}_${l()}`,
      isExclusive: true,
      exclusiveLabel: "⭐ Exclusivo de Morcego",
      status: "pending",
      item: {
        isCreaturePart: true,
        id: `item_asa_morcego_${t}_${l()}`,
        name: "Asa Membranosa de Morcego",
        categoryType: "material",
        rarity: "incomum",
        stackCount: 2,
        isEquippable: false,
        icon: "sparkles",
        color: "#475569",
        value: 30,
        description:
          "Membrana alar escura e flexível. Excelente para revestir capas leves, amarras e preparos alquímicos de agilidade.",
      },
    },
    {
      id: `butcher_bat_bone_${t}_${l()}`,
      isExclusive: false,
      status: "pending",
      item: {
        isCreaturePart: true,
        id: `item_osso_morcego_${t}_${l()}`,
        name: "Ossos Ocos de Morcego",
        categoryType: "material",
        rarity: "comum",
        stackCount: 2,
        isEquippable: false,
        icon: "bone",
        color: "#cbd5e1",
        value: 10,
        description: "Pequenos ossos ocos e ultra leves de morcego cavernoso.",
      },
    },
    {
      id: `butcher_bat_meat_${t}_${l()}`,
      isExclusive: false,
      status: "pending",
      item: {
        isCreaturePart: true,
        id: `item_carne_morcego_${t}_${l()}`,
        name: "Carne Magra de Morcego",
        categoryType: "consumable",
        rarity: "comum",
        stackCount: 1,
        isEquippable: false,
        icon: "utensils",
        color: "#64748b",
        value: 14,
        description:
          "Carne escura e fibrosa de morcego (+25 Vida, +30 Stamina ao consumir).",
      },
    },
  ],
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone
  detectIcon: (t, l, o) =>
    o === "creature_bat" ||
    o === "bat" ||
    t.includes("morcego") ||
    l.includes("bat"),
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (antigo trecho de Eg)
    body: function (e, t, o, l) {
      const u = Math.sin(t.animTimer * 5) * 6;
      ((e.fillStyle = l ? "#ffffff" : t.color),
        e.beginPath(),
        e.ellipse(0, -12 * o, 5 * o, 7 * o, 0, 0, Math.PI * 2),
        e.fill(),
        e.beginPath(),
        e.moveTo(-4 * o, -12 * o),
        e.lineTo(-14 * o, -14 * o + u),
        e.lineTo(-8 * o, -6 * o + u),
        e.closePath(),
        e.fill(),
        e.beginPath(),
        e.moveTo(4 * o, -12 * o),
        e.lineTo(14 * o, -14 * o + u),
        e.lineTo(8 * o, -6 * o + u),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#ef4444"),
        e.fillRect(-2 * o, -13 * o, 1.5 * o, 1.5 * o),
        e.fillRect(1 * o, -13 * o, 1.5 * o, 1.5 * o));
    },
    // Carcaca no chao (antigo trecho de Ag)
    carcass: function (e, t, o, u) {
      ((e.fillStyle = t.color),
        e.beginPath(),
        e.ellipse(0, 0, 4.5 * o, 7 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#0f172a"),
        e.beginPath(),
        e.moveTo(-3 * o, -2 * o),
        e.lineTo(-9 * o, 2 * o),
        e.lineTo(-3 * o, 5 * o),
        e.closePath(),
        e.fill(),
        e.beginPath(),
        e.moveTo(3 * o, -2 * o),
        e.lineTo(9 * o, 2 * o),
        e.lineTo(3 * o, 5 * o),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = `rgba(239, 68, 68, ${u})`),
        (e.lineWidth = 1.2 * o),
        e.beginPath(),
        e.moveTo(-1.5 * o, -3.5 * o),
        e.lineTo(1.5 * o, -1.5 * o),
        e.moveTo(1.5 * o, -3.5 * o),
        e.lineTo(-1.5 * o, -1.5 * o),
        e.stroke());
    },
    // Ícone desenhado no canvas / inventário (antigo ub)
    icon: function (e, t, l) {
      const o = l.color || "#1e1b4b",
        u = 0;
      e.fillStyle = o;
      for (const m of [-1, 1])
        (e.beginPath(),
          e.moveTo(m * 1.5 * t, -1 * t),
          e.quadraticCurveTo(m * 5 * t, -6 * t + u, m * 8.5 * t, -4 * t + u),
          e.quadraticCurveTo(m * 6.5 * t, -1 * t + u, m * 5 * t, 1.5 * t + u),
          e.quadraticCurveTo(m * 3.5 * t, 1.8 * t, m * 2 * t, 2 * t),
          e.closePath(),
          e.fill(),
          (e.strokeStyle = "#4338ca"),
          (e.lineWidth = 0.9 * t),
          e.beginPath(),
          e.moveTo(m * 1.5 * t, -1 * t),
          e.lineTo(m * 8.5 * t, -4 * t + u),
          e.moveTo(m * 4 * t, -3 * t + u * 0.6),
          e.lineTo(m * 5 * t, 1.5 * t + u),
          e.stroke());
      ((e.fillStyle = "#0f172a"),
        e.beginPath(),
        e.ellipse(0, 0.5 * t, 2.8 * t, 4.5 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = o),
        e.beginPath(),
        e.moveTo(-2 * t, -2.5 * t),
        e.lineTo(-2.8 * t, -6 * t),
        e.lineTo(-0.8 * t, -3.5 * t),
        e.fill(),
        e.beginPath(),
        e.moveTo(2 * t, -2.5 * t),
        e.lineTo(2.8 * t, -6 * t),
        e.lineTo(0.8 * t, -3.5 * t),
        e.fill(),
        (e.fillStyle = "#ef4444"),
        e.beginPath(),
        e.arc(-1.1 * t, -1.2 * t, 0.8 * t, 0, Math.PI * 2),
        e.arc(1.1 * t, -1.2 * t, 0.8 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ffffff"),
        e.fillRect(-1 * t, 1.5 * t, 0.6 * t, 1 * t),
        e.fillRect(0.4 * t, 1.5 * t, 0.6 * t, 1 * t));
    },
  },
};
