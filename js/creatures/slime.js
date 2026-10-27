/* js/creatures/slime.js
 * Criatura COMPLETA: Slime / Gosma (todas as variantes por bioma: floresta, prados, pantano, lagos, geodo, cavernas...).
 * Reune os dados de nascimento (spawn + spawnVariants + swarm), a carcaca ("Gosma Sem Vida"), o comportamento, a
 * deteccao do icone e TODO o desenho (corpo, carcaca no chao e icone).
 * A IA do slime (grudar no jogador, enxame, dano do sol, lodo/particulas, fuga do fogo) continua em
 * js/engine/creatures-manager.js, que compara `type === "slime"`; o clima em js/engine/weather.js.
 * Depende de registry.js (carregar depois dele).
 *
 * `draw.carcassFull`: gancho opcional deste registro. Diferente de `draw.carcass` (que roda DENTRO da sombra e do alfa
 * padrao de Ag), `carcassFull` desenha a carcaca INTEIRA, com sombra propria (e recebe o tempo de animacao `l`).
 * Sem `sheet`, `loot` e `detect` de proposito (ac() em fusao-e-loot.js exclui itens com "gosma"/"slime" no nome).
 * `behavior.deathParticles: 12`: valor usado por creatureDeathParticles; o caminho de morte em combate usa 8 para o
 * slime direto no gerenciador (diferenca antiga, mantida).
 */
"use strict";
CREATURES.slime = {
  id: "slime",
  // Nascimento padrao: Gosma Verde da Floresta
  spawn: {
    name: "Gosma Verde da Floresta",
    color: "#22c55e",
    accentColor: "#86efac",
    hp: 22,
    attack: 4,
    speed: 0.75,
    scale: 1.0,
  },
  // Variantes por bioma/local (chave = onde nasce)
  spawnVariants: {
    geode: {
      name: "Gosma Bioluminescente do Geodo",
      color: "#2dd4bf",
      accentColor: "#a7f3d0",
      hp: 24,
      attack: 4,
      speed: 0.8,
      scale: 1.0,
    },
    cave: {
      name: "Gosma Cavernosa Bioluminescente",
      color: "#0ea5e9",
      accentColor: "#7dd3fc",
      hp: 24,
      attack: 4,
      speed: 0.8,
      scale: 1.05,
    },
    lakeOasis: {
      name: "Gosma das Águas do Oásis",
      color: "#06b6d4",
      accentColor: "#67e8f9",
      hp: 22,
      attack: 3,
      speed: 0.95,
      scale: 1.0,
    },
    lakeForest: {
      name: "Gosma Musgosa do Lago",
      color: "#0f766e",
      accentColor: "#2dd4bf",
      hp: 24,
      attack: 4,
      speed: 0.9,
      scale: 1.0,
    },
    lakeSwamp: {
      name: "Gosma das Profundezas Pantanosas",
      color: "#14532d",
      accentColor: "#4ade80",
      hp: 28,
      attack: 5,
      speed: 0.85,
      scale: 1.1,
    },
    lakeSavanna: {
      name: "Gosma do Bebedouro",
      color: "#0369a1",
      accentColor: "#f59e0b",
      hp: 24,
      attack: 4,
      speed: 0.95,
      scale: 1.0,
    },
    lakeTaiga: {
      name: "Gosma Boreal das Águas Frias",
      color: "#0c4a6e",
      accentColor: "#bae6fd",
      hp: 25,
      attack: 4,
      speed: 0.9,
      scale: 1.0,
    },
    lakeGlacier: {
      name: "Gosma Glacial Cristalina",
      color: "#0891b2",
      accentColor: "#e0f2fe",
      hp: 26,
      attack: 4,
      speed: 0.85,
      scale: 1.0,
    },
    lakeMeadow: {
      name: "Gosma Límpida do Lago",
      color: "#0284c7",
      accentColor: "#38bdf8",
      hp: 20,
      attack: 3,
      speed: 0.95,
      scale: 1.0,
    },
    lakeShallow: {
      name: "Gosma das Águas Rasas",
      color: "#0284c7",
      accentColor: "#38bdf8",
      hp: 20,
      attack: 3,
      speed: 0.95,
      scale: 1.0,
    },
    swamp: {
      name: "Gosma do Pântano Sombrio",
      color: "#7e22ce",
      accentColor: "#d8b4fe",
      hp: 26,
      attack: 5,
      speed: 0.8,
      scale: 1.1,
    },
    deepForest: {
      name: "Gosma Musgosa Ancestral",
      color: "#15803d",
      accentColor: "#4ade80",
      hp: 22,
      attack: 4,
      speed: 0.75,
      scale: 1.0,
    },
    meadow: {
      name: "Gosma Verde dos Prados",
      color: "#16a34a",
      accentColor: "#86efac",
      hp: 20,
      attack: 4,
      speed: 0.75,
      scale: 0.95,
    },
  },
  // Enxame que aparece ao redor do jogador (CreatureManager.spawnSwarmSlimeNearPlayer; a escala e sorteada la)
  swarm: {
    hp: 18,
    attack: 4,
    defense: 0,
    speed: 0.85,
    forms: [
      { name: "Gosma Rastejante", color: "#22c55e", accentColor: "#86efac" },
      { name: "Gosma Venenosa", color: "#10b981", accentColor: "#6ee7b7" },
      { name: "Gosma Caçadora", color: "#16a34a", accentColor: "#bbf7d0" },
    ],
  },
  // Comportamento: monstro hostil, foge de fogueiras/tochas
  behavior: {
    prey: false,
    fearsFire: true,
    deathParticles: 12,
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Gosma Sem Vida",
    bodyName: "Corpo de Gosma",
    description:
      "Corpo de criatura gosma coletado no solo. Preserva a forma gelatinosa viva com núcleo e olhos vítreos, ideal para forja e alquimia.",
    rarity: "incomum",
    value: 28,
  },
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone (t = nome, l = id, o = icone, minusculo)
  detectIcon: (t, l, o) =>
    o === "creature_slime" ||
    o === "slime" ||
    t.includes("gosma") ||
    l.includes("slime") ||
    t.includes("gelatina"),
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (antigo ramo slime de Eg; inclui emergir, pulo e grudado no jogador)
    body: function (e, t, o, l) {
      const u = !!t.attached,
        m = !!t.isLeaping,
        c = !!t.emerging,
        f = c ? Math.max(0.1, Math.min(1, 1 - (t.emergeTimer || 0) / 0.55)) : 1;
      if (c)
        ((e.fillStyle = "#78350f"),
          e.beginPath(),
          e.ellipse(
            0,
            3 * o,
            11 * o * (1.1 - f * 0.2),
            4.5 * o * (1.1 - f * 0.2),
            0,
            0,
            Math.PI * 2,
          ),
          e.fill());
      else if (!u && t.inWater) {
        const A = (t.animTimer * 2.6) % Math.PI;
        ((e.strokeStyle = "rgba(56, 189, 248, 0.45)"),
          (e.lineWidth = 1.3 * o),
          e.beginPath(),
          e.ellipse(
            0,
            3 * o,
            (13 + Math.sin(A) * 3) * o,
            (6 + Math.sin(A) * 1.5) * o,
            0,
            0,
            Math.PI * 2,
          ),
          e.stroke());
      }
      const g = 2.4;
      let y = 0,
        w = 1,
        v = 1;
      if (u) {
        const A = Math.sin(t.animTimer * 8) * 0.1;
        ((w = 0.78 + A), (v = 1.28 - A), (y = 0));
      } else if (m) {
        const A = Math.min(1, Math.max(0, t.leapProgress || 0));
        ((y = Math.sin(A * Math.PI) * 16 * o), (w = 1.42), (v = 0.74));
      } else if (c) ((w = f), (v = 0.5 + f * 0.5), (y = 0));
      else {
        const A = (t.animTimer * g) % Math.PI,
          x = Math.sin(A),
          M = x > 0.28;
        if (((y = M ? (x - 0.28) * 5.5 * o : 0), M)) {
          const z = (x - 0.28) / 0.72;
          ((w = 1 + z * 0.38), (v = 1 - z * 0.22));
        } else {
          const z = (0.28 - x) / 0.28;
          ((w = 1 - z * 0.35), (v = 1 + z * 0.42));
        }
        const $ = Math.sin(t.animTimer * 6.2) * 0.05;
        ((v += $), (w -= $ * 0.8));
      }
      (u ||
        ((e.fillStyle = "rgba(15, 23, 42, 0.32)"),
        e.beginPath(),
        e.ellipse(
          0,
          3 * o,
          11 * v * o * (y > 2 ? 0.82 : 1),
          5 * v * o * (y > 2 ? 0.75 : 1),
          0,
          0,
          Math.PI * 2,
        ),
        e.fill()),
        e.save(),
        e.translate(0, -y));
      const T = u
        ? 0
        : Math.max(-0.22, Math.min(0.22, (t.vx / (t.speed || 1)) * 0.16));
      e.rotate(T);
      const S = 11.5 * o * v,
        p = 13.5 * o * w,
        j = 0,
        P = -p;
      if (
        (e.beginPath(),
        e.moveTo(0, j),
        e.bezierCurveTo(S * 0.65, j + 1.2 * o, S, j - 0.6 * o, S, j - p * 0.32),
        e.bezierCurveTo(S * 0.98, j - p * 0.75, S * 0.45, P, 0, P),
        e.bezierCurveTo(
          -S * 0.45,
          P,
          -S * 0.98,
          j - p * 0.75,
          -S,
          j - p * 0.32,
        ),
        e.bezierCurveTo(-S, j - 0.6 * o, -S * 0.65, j + 1.2 * o, 0, j),
        e.closePath(),
        l)
      )
        ((e.fillStyle = "#ffffff"), e.fill());
      else {
        const A = e.createRadialGradient(
          -S * 0.25,
          P + p * 0.38,
          2 * o,
          0,
          P + p * 0.55,
          S * 1.15,
        );
        (A.addColorStop(0, t.accentColor),
          A.addColorStop(0.55, t.color),
          A.addColorStop(1, t.color),
          e.save(),
          (e.globalAlpha = 0.88),
          (e.fillStyle = A),
          e.fill(),
          e.restore(),
          e.save(),
          (e.globalAlpha = 0.32),
          (e.strokeStyle = t.accentColor),
          (e.lineWidth = 1.3 * o),
          e.stroke(),
          e.restore());
        const x = Math.sin(t.animTimer * g - 0.4) * 1.2 * o;
        (e.save(),
          (e.globalAlpha = 0.45),
          (e.fillStyle = t.color),
          e.beginPath(),
          e.ellipse(0, P + p * 0.58 + x, S * 0.48, p * 0.36, 0, 0, Math.PI * 2),
          e.fill(),
          e.restore(),
          e.save(),
          (e.fillStyle = "rgba(255, 255, 255, 0.42)"),
          e.beginPath(),
          e.arc(-S * 0.32, P + p * 0.68 + x * 0.8, 1.3 * o, 0, Math.PI * 2),
          e.fill(),
          e.beginPath(),
          e.arc(S * 0.35, P + p * 0.46 - x * 0.5, 0.9 * o, 0, Math.PI * 2),
          e.fill(),
          e.restore(),
          e.save(),
          (e.fillStyle = "rgba(255, 255, 255, 0.65)"),
          e.beginPath(),
          e.ellipse(
            -S * 0.32,
            P + p * 0.25,
            S * 0.35,
            p * 0.15,
            -0.32,
            0,
            Math.PI * 2,
          ),
          e.fill(),
          (e.fillStyle = "rgba(255, 255, 255, 0.85)"),
          e.beginPath(),
          e.arc(-S * 0.42, P + p * 0.2, 1.1 * o, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "rgba(255, 255, 255, 0.22)"),
          e.beginPath(),
          e.ellipse(
            S * 0.28,
            j - p * 0.22,
            S * 0.28,
            p * 0.1,
            0.25,
            0,
            Math.PI * 2,
          ),
          e.fill(),
          e.restore());
        let M = 0,
          $ = 0;
        t.facing === "right"
          ? (M = 1.6 * o)
          : t.facing === "left"
            ? (M = -1.6 * o)
            : t.facing === "down"
              ? ($ = 1.2 * o)
              : t.facing === "up" && ($ = -1.5 * o);
        const z = P + p * 0.54 + $,
          K = t.facing === "up" ? 3.4 * o : 4.2 * o;
        if (
          ((e.fillStyle = "#090d16"),
          e.beginPath(),
          e.arc(-K / 2 + M, z, 1.8 * o, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#ffffff"),
          e.beginPath(),
          e.arc(-K / 2 + M - 0.5 * o, z - 0.5 * o, 0.65 * o, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#090d16"),
          e.beginPath(),
          e.arc(K / 2 + M, z, 1.8 * o, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#ffffff"),
          e.beginPath(),
          e.arc(K / 2 + M - 0.5 * o, z - 0.5 * o, 0.65 * o, 0, Math.PI * 2),
          e.fill(),
          u)
        ) {
          const V = (t.animTimer * 3.2) % 1;
          ((e.fillStyle = "#4ade80"),
            e.beginPath(),
            e.arc(0, j + V * 8 * o, 1.4 * o, 0, Math.PI * 2),
            e.fill());
        }
      }
      e.restore();
    },
    // Carcaca inteira no chao, com sombra propria (antigo ramo isSlime de Ag; l = tempo de animacao, o = escala, u = alfa)
    carcassFull: function (e, t, l, o, u) {
      ((e.fillStyle = `rgba(15, 23, 42, ${0.35 * u})`),
        e.beginPath(),
        e.ellipse(0, 2.5 * o, 14 * o, 5.5 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = t.color),
        (e.globalAlpha = 0.85 * u),
        e.beginPath(),
        e.arc(-11 * o, 1.8 * o, 2.2 * o, 0, Math.PI * 2),
        e.arc(11 * o, 2.2 * o, 1.8 * o, 0, Math.PI * 2),
        e.arc(4.5 * o, -3.8 * o, 1.6 * o, 0, Math.PI * 2),
        e.arc(-6 * o, 4.2 * o, 1.4 * o, 0, Math.PI * 2),
        e.fill());
      const m = e.createRadialGradient(-2.5 * o, -1 * o, 1 * o, 0, 0, 13 * o);
      (m.addColorStop(0, t.accentColor || "#86efac"),
        m.addColorStop(0.65, t.color || "#22c55e"),
        m.addColorStop(1, "rgba(21, 128, 61, 0.92)"),
        (e.fillStyle = m),
        (e.globalAlpha = u),
        e.beginPath(),
        e.ellipse(0, 0.5 * o, 13.5 * o, 5.2 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = `rgba(20, 83, 45, ${0.45 * u})`),
        (e.lineWidth = 1 * o),
        e.stroke(),
        (e.fillStyle = `rgba(255, 255, 255, ${0.55 * u})`),
        e.beginPath(),
        e.ellipse(-3.5 * o, -1.5 * o, 4.5 * o, 1.4 * o, -0.2, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = `rgba(2, 44, 34, ${u})`),
        (e.lineWidth = 1.6 * o),
        (e.lineCap = "round"));
      const c = -4.5 * o,
        f = -0.5 * o,
        g = 2.2 * o;
      (e.beginPath(),
        e.moveTo(c - g, f - g),
        e.lineTo(c + g, f + g),
        e.moveTo(c + g, f - g),
        e.lineTo(c - g, f + g),
        e.stroke());
      const y = 4.2 * o,
        w = -0.5 * o;
      (e.beginPath(),
        e.moveTo(y - g, w - g),
        e.lineTo(y + g, w + g),
        e.moveTo(y + g, w - g),
        e.lineTo(y - g, w + g),
        e.stroke());
      const v = Math.sin(l * 4.5) * 0.15 + 0.85;
      ((e.strokeStyle = t.accentColor || "#4ade80"),
        (e.lineWidth = 1.2),
        (e.globalAlpha = 0.45 * v * u),
        e.beginPath(),
        e.ellipse(0, 1 * o, 16 * o * v, 7.5 * o * v, 0, 0, Math.PI * 2),
        e.stroke(),
        (e.fillStyle = "#ffffff"),
        (e.globalAlpha = 0.85 * v * u),
        e.beginPath(),
        e.arc(8 * o, -6 * o - Math.sin(l * 5) * 2, 1.8, 0, Math.PI * 2),
        e.fill());
    },
    // Icone desenhado no canvas / inventario (antigo nb)
    icon: function (e, t, l) {
      const o = l.color || "#22c55e",
        m =
          o.includes("22c55e") ||
          o.includes("10b981") ||
          o.includes("4ade80") ||
          o.includes("86efac")
            ? "#86efac"
            : "#fef08a",
        c = 1,
        f = 1,
        g = 7.5 * t * c,
        y = 9.5 * t * f,
        w = 4.2 * t,
        v = w - y;
      ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
        e.beginPath(),
        e.ellipse(0, w + 1.2 * t, g * 1.05, 3.2 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = o),
        (e.globalAlpha = 0.85),
        e.beginPath(),
        e.arc(-g * 1.15, w - 0.5 * t, 1.2 * t, 0, Math.PI * 2),
        e.arc(g * 1.15, w - 0.2 * t, 1 * t, 0, Math.PI * 2),
        e.fill(),
        e.beginPath(),
        e.moveTo(0, w),
        e.bezierCurveTo(g * 0.65, w + 1.1 * t, g, w - 0.5 * t, g, w - y * 0.32),
        e.bezierCurveTo(g * 0.98, w - y * 0.75, g * 0.45, v, 0, v),
        e.bezierCurveTo(-g * 0.45, v, -g * 0.98, w - y * 0.75, -g, w - y * 0.32),
        e.bezierCurveTo(-g, w - 0.5 * t, -g * 0.65, w + 1.1 * t, 0, w),
        e.closePath());
      const T = e.createRadialGradient(
        -g * 0.25,
        v + y * 0.35,
        1.5 * t,
        0,
        v + y * 0.55,
        g * 1.2,
      );
      (T.addColorStop(0, m),
        T.addColorStop(0.55, o),
        T.addColorStop(1, o),
        (e.globalAlpha = 0.92),
        (e.fillStyle = T),
        e.fill(),
        (e.strokeStyle = m),
        (e.lineWidth = 1.1 * t),
        (e.globalAlpha = 0.4),
        e.stroke(),
        (e.fillStyle = o),
        (e.globalAlpha = 0.5),
        e.beginPath(),
        e.ellipse(0, v + y * 0.58, g * 0.45, y * 0.32, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(255, 255, 255, 0.7)"),
        (e.globalAlpha = 0.85),
        e.beginPath(),
        e.ellipse(
          -g * 0.3,
          v + y * 0.24,
          g * 0.32,
          y * 0.14,
          -0.3,
          0,
          Math.PI * 2,
        ),
        e.fill(),
        (e.fillStyle = "#ffffff"),
        e.beginPath(),
        e.arc(-g * 0.4, v + y * 0.18, 0.9 * t, 0, Math.PI * 2),
        e.fill());
      const S = 3.6 * t,
        p = v + y * 0.52;
      ((e.fillStyle = "#022c22"),
        (e.globalAlpha = 1),
        e.beginPath(),
        e.arc(-S / 2, p, 1.5 * t, 0, Math.PI * 2),
        e.arc(S / 2, p, 1.5 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ffffff"),
        e.beginPath(),
        e.arc(-S / 2 - 0.4 * t, p - 0.4 * t, 0.6 * t, 0, Math.PI * 2),
        e.arc(S / 2 - 0.4 * t, p - 0.4 * t, 0.6 * t, 0, Math.PI * 2),
        e.fill());
    },
  },
};
