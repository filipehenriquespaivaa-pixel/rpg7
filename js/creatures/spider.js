/* js/creatures/spider.js
 * Criatura COMPLETA: Aranha (todas as variantes: Aranha Cavernosa, Aranha das Fendas Arenosas,
 * Tarântula Pantaneira e Aranha dos Bosques).
 * Tudo que define a aranha fica neste arquivo. O escorpião é uma criatura SEPARADA (ainda não migrada).
 * Depende de registry.js (carregar depois dele).
 *
 * Sem `carcass`, `sheet`, `loot` e `detect` de propósito (como o golem): ac() em fusao-e-loot.js
 * exclui itens com "aranha"/"spider" no nome e o corpo deixado é o genérico ("Corpo intacto de ...").
 */
"use strict";
CREATURES.spider = {
  id: "spider",
  // Nascimento padrão: Aranha Cavernosa (cavernas comuns)
  spawn: {
    name: "Aranha Cavernosa",
    color: "#334155",
    accentColor: "#ef4444",
    hp: 26,
    attack: 6,
    speed: 0.95,
    scale: 1,
  },
  // Outros nascimentos por bioma/local
  spawnVariants: {
    // Fendas da caverna do deserto
    sand: {
      name: "Aranha das Fendas Arenosas",
      color: "#78350f",
      accentColor: "#fbbf24",
      hp: 16,
      attack: 4,
      speed: 0.92,
      scale: 0.72,
    },
    // Pântano
    swamp: {
      name: "Tarântula Pantaneira",
      color: "#1e293b",
      accentColor: "#a855f7",
      hp: 28,
      attack: 7,
      speed: 0.9,
      scale: 1.05,
    },
    // Floresta e floresta profunda
    forest: {
      name: "Aranha dos Bosques",
      color: "#334155",
      accentColor: "#22c55e",
      hp: 24,
      attack: 5,
      speed: 0.9,
      scale: 0.95,
    },
  },
  // Comportamento: monstro hostil, foge de fogueiras/tochas, 12 particulas ao morrer (padrao antigo)
  behavior: {
    prey: false,
    fearsFire: true,
    deathParticles: 12,
  },
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone (t = nome, l = id, o = icone, minusculo)
  detectIcon: (t, l, o) =>
    o === "creature_spider" ||
    o === "spider" ||
    t.includes("aranha") ||
    l.includes("spider"),
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (antigo ramo spider de Eg)
    body: function (e, t, o, l) {
      e.fillStyle = l ? "#ffffff" : t.color;
      let u = 0,
        m = -5 * o,
        c = 0,
        f = -7 * o;
      (t.facing === "right"
        ? ((u = 6 * o), (m = -5 * o), (c = -2 * o), (f = -7 * o))
        : t.facing === "left"
          ? ((u = -6 * o), (m = -5 * o), (c = 2 * o), (f = -7 * o))
          : t.facing === "down"
            ? ((u = 0), (m = -2 * o), (c = 0), (f = -9 * o))
            : ((u = 0), (m = -11 * o), (c = 0), (f = -4 * o)),
        e.beginPath(),
        e.ellipse(c, f, 7 * o, 6 * o, 0, 0, Math.PI * 2),
        e.fill(),
        e.beginPath(),
        e.ellipse(u, m, 4 * o, 3.5 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = l ? "#ffffff" : t.color),
        (e.lineWidth = 1.4 * o));
      for (let g = -2; g <= 2; g++) {
        if (g === 0) continue;
        const y = Math.sin(t.animTimer * 4 + g) * 3;
        (e.beginPath(),
          e.moveTo(0, -6 * o),
          e.lineTo(g * 4 * o, -10 * o + y),
          e.lineTo(g * 7 * o, 0 * o + y),
          e.stroke());
      }
      if (((e.fillStyle = t.accentColor), t.facing === "down"))
        (e.fillRect(-2 * o, m + 1 * o, 1.5 * o, 1.5 * o),
          e.fillRect(1 * o, m + 1 * o, 1.5 * o, 1.5 * o));
      else if (t.facing === "up")
        (e.fillRect(-2 * o, m - 2 * o, 1.5 * o, 1.5 * o),
          e.fillRect(1 * o, m - 2 * o, 1.5 * o, 1.5 * o));
      else {
        const g = t.facing === "right" ? 7 * o : -7 * o;
        (e.fillRect(g, -6 * o, 1.5 * o, 1.5 * o),
          e.fillRect(g, -4 * o, 1.5 * o, 1.5 * o));
      }
    },
    // Carcaca no chao (antigo ramo spider de Ag)
    carcass: function (e, t, o, u) {
      ((e.fillStyle = t.color),
        e.beginPath(),
        e.ellipse(0, 0, 8 * o, 6.5 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#1e1b4b"),
        (e.lineWidth = 1.3 * o));
      for (const m of [-1, 1])
        for (let c = 0; c < 4; c++) {
          const f = -3 * o + c * 2 * o;
          (e.beginPath(),
            e.moveTo(m * 4 * o, f),
            e.lineTo(m * 8 * o, f - 3 * o),
            e.lineTo(m * 5 * o, f - 5 * o),
            e.stroke());
        }
      ((e.strokeStyle = `rgba(239, 68, 68, ${u})`),
        (e.lineWidth = 1.2 * o),
        e.beginPath(),
        e.moveTo(-2 * o, -1 * o),
        e.lineTo(0, 1 * o),
        e.moveTo(0, -1 * o),
        e.lineTo(-2 * o, 1 * o),
        e.moveTo(1 * o, -1 * o),
        e.lineTo(3 * o, 1 * o),
        e.moveTo(3 * o, -1 * o),
        e.lineTo(1 * o, 1 * o),
        e.stroke());
    },
    // Ícone desenhado no canvas / inventário (antigo cb)
    icon: function (e, t, l) {
      const o = l.color || "#312e81";
      ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
        e.beginPath(),
        e.ellipse(0, 3 * t, 6.5 * t, 3.5 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#1e1b4b"),
        (e.lineWidth = 1.2 * t),
        (e.lineCap = "round"));
      for (let m of [-1, 1])
        for (let c = 0; c < 4; c++) {
          const f = -0.7 + c * 0.48,
            g = 5 * t,
            y = 8.5 * t,
            w = 0;
          (e.beginPath(),
            e.moveTo(m * 2 * t, -1 * t + c * 1.5 * t),
            e.lineTo(m * Math.cos(f) * g, Math.sin(f) * g + w),
            e.lineTo(m * Math.cos(f) * y, Math.sin(f) * y + 3 * t),
            e.stroke());
        }
      ((e.fillStyle = o),
        e.beginPath(),
        e.ellipse(0, 2 * t, 5 * t, 6 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#a855f7"),
        (e.lineWidth = 1.1 * t),
        e.beginPath(),
        e.moveTo(0, -1 * t),
        e.lineTo(0, 5 * t),
        e.moveTo(-2 * t, 1.5 * t),
        e.lineTo(2 * t, 1.5 * t),
        e.stroke(),
        (e.fillStyle = "#1e1b4b"),
        e.beginPath(),
        e.ellipse(0, -3.5 * t, 3.2 * t, 2.8 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ef4444"));
      const u = [
        [-1.4 * t, -4.2 * t, 0.8 * t],
        [-0.5 * t, -4.5 * t, 0.9 * t],
        [0.5 * t, -4.5 * t, 0.9 * t],
        [1.4 * t, -4.2 * t, 0.8 * t],
        [-0.9 * t, -3.2 * t, 0.7 * t],
        [0.9 * t, -3.2 * t, 0.7 * t],
      ];
      for (const [m, c, f] of u)
        (e.beginPath(), e.arc(m, c, f, 0, Math.PI * 2), e.fill());
      ((e.strokeStyle = "#f87171"),
        (e.lineWidth = 1.2 * t),
        e.beginPath(),
        e.moveTo(-1.2 * t, -5 * t),
        e.lineTo(-0.8 * t, -6.5 * t),
        e.moveTo(1.2 * t, -5 * t),
        e.lineTo(0.8 * t, -6.5 * t),
        e.stroke());
    },
  },
};
