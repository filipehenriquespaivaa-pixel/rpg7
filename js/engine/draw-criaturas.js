/* js/engine/draw-criaturas.js
 * Desenho de criaturas/monstros (lb, ib, nb...zb) e predicado gl.
 * Trecho de legacy/app.original.js (linhas 27670-30086); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function lb(e) {
    if (!e) return null;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase(),
      o = (e.icon || "").toLowerCase();

    // Peças e materiais obtidos ao destrinchar NUNCA devem ser desenhados como o monstro vivo inteiro!
    if (
      t.includes("osso") || l.includes("bone") || o === "bone" ||
      t.includes("carne") || l.includes("meat") || o === "meat" ||
      t.includes("pele") || t.includes("couro") || l.includes("pelt") || l.includes("leather") ||
      t.includes("entranha") || t.includes("víscera") || t.includes("viscera") || l.includes("guts") ||
      t.includes("dente") || t.includes("presa") || l.includes("tooth") ||
      t.includes("chifre") || t.includes("galhada") || l.includes("horn") ||
      t.includes("escama") || l.includes("scale") ||
      t.includes("asa") || l.includes("wing") ||
      t.includes("crânio") || t.includes("cranio") || l.includes("skull") ||
      t.includes("pé de coelho") || t.includes("pe de coelho") || l.includes("rabbit_foot") ||
      t.includes("amuleto")
    ) {
      return null;
    }

    // Apenas carcaças completas e criaturas inteiras (capturadas no cinto/inventário)
    const isCarcassOrMonster =
      l.startsWith("carcass_") ||
      l.includes("corpse") ||
      t.includes("carcaça") ||
      t.includes("carcaca") ||
      t.includes("corpo de") ||
      t.includes("despojo de") ||
      o.startsWith("creature_") ||
      o === "slime" || getCreature(o) !== null || o === "dragon" || o === "spider" || o === "scorpion" || o === "bat" ||
      t.startsWith("criatura ") ||
      e.category === "creature_spider_scorpion" ||
      e.category === "creature_small";

    if (!isCarcassOrMonster) {
      return null;
    }

    if (CREATURES.slime.detectIcon(t, l, o)) return "slime";
    if (CREATURES.scorpion.detectIcon(t, l, o)) return "scorpion";
    if (CREATURES.spider.detectIcon(t, l, o)) return "spider";
    if (CREATURES.wolf.detectIcon(t, l, o)) return "wolf";
    if (o === "creature_bat" || o === "bat" || t.includes("morcego") || l.includes("bat")) return "bat";
    if (CREATURES.golem.detectIcon(t, l, o)) return "golem";
    {
      const migratedType = detectCreatureForIcon(t, l, o);
      if (migratedType) return migratedType;
    }
    return "slime";
  }
  function ib(e, t, l, o, u, m, c) {
    switch ((e.save(), e.translate(t, l), m)) {
      default: {
        const creatureIcon = creatureDraw(m, "icon");
        creatureIcon && creatureIcon(e, o, c);
      }
    }
    e.restore();
  }
  function ub(e, t, l) {
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
  }
  function mb(e, t, l, o, u, m, c) {
    (e.save(), e.translate(t, l));
    const f = m.includes("gigante") || c.includes("gigante"),
      g = !f && (m.includes("grande") || c.includes("grande")),
      y =
        !f &&
        !g &&
        (m.includes("média") || m.includes("media") || c.includes("media"));
    ((e.fillStyle = "rgba(0, 0, 0, 0.32)"),
      e.beginPath(),
      e.ellipse(0, 3.5 * o, 6.5 * o, 2.8 * o, 0, 0, Math.PI * 2),
      e.fill());
    let w = "#ca8a04",
      v = "#fef08a",
      T = "#854d0e",
      S = "#78350f",
      p = 1.8 * o,
      j = 2,
      P = 5 * o,
      A = 3.6 * o;
    if (y)
      ((w = "#d97706"),
        (v = "#fde68a"),
        (T = "#78350f"),
        (S = "#451a03"),
        (p = 2.4 * o),
        (j = 3),
        (P = 5.6 * o),
        (A = 4 * o));
    else if (g)
      ((w = "#ea580c"),
        (v = "#fdba74"),
        (T = "#9a3412"),
        (S = "#334155"),
        (p = 3 * o),
        (j = 4),
        (P = 6.2 * o),
        (A = 4.5 * o));
    else if (f) {
      ((w = "#f59e0b"),
        (v = "#ffffff"),
        (T = "#b45309"),
        (S = "#d97706"),
        (p = 3.8 * o),
        (j = 5),
        (P = 6.8 * o),
        (A = 5 * o));
      const x = 0.5 + Math.sin(u * 3) * 0.25;
      ((e.strokeStyle = `rgba(245, 158, 11, ${x * 0.5})`),
        (e.lineWidth = 5.5 * o),
        e.beginPath(),
        e.ellipse(0, -0.5 * o, P + 1 * o, A + 1 * o, 0, 0, Math.PI * 2),
        e.stroke());
    }
    for (let x = 0; x < j; x++) {
      const M = P - x * (1.15 * o),
        $ = A - x * (0.85 * o),
        z = -x * (0.75 * o);
      ((e.strokeStyle = T),
        (e.lineWidth = p + 0.8 * o),
        e.beginPath(),
        e.ellipse(0, z + 0.5 * o, M, $, -0.12, 0, Math.PI * 2),
        e.stroke(),
        (e.strokeStyle = w),
        (e.lineWidth = p),
        e.beginPath(),
        e.ellipse(0, z, M, $, -0.12, 0, Math.PI * 2),
        e.stroke(),
        e.setLineDash([2 * o, 2 * o]),
        (e.strokeStyle = v),
        (e.lineWidth = p * 0.45),
        e.beginPath(),
        e.ellipse(0, z - 0.3 * o, M, $, -0.12, 0, Math.PI * 2),
        e.stroke(),
        e.setLineDash([]));
    }
    if (
      ((e.strokeStyle = T),
      (e.lineWidth = p + 0.6 * o),
      e.beginPath(),
      e.moveTo(P * 0.6, 1 * o),
      e.quadraticCurveTo(P * 0.9, 4 * o, P * 0.4, 6 * o),
      e.stroke(),
      (e.strokeStyle = w),
      (e.lineWidth = p),
      e.beginPath(),
      e.moveTo(P * 0.6, 1 * o),
      e.quadraticCurveTo(P * 0.9, 4 * o, P * 0.4, 6 * o),
      e.stroke(),
      (e.strokeStyle = v),
      (e.lineWidth = 1 * o),
      e.beginPath(),
      e.moveTo(P * 0.4, 6 * o),
      e.lineTo(P * 0.25, 7.2 * o),
      e.moveTo(P * 0.4, 6 * o),
      e.lineTo(P * 0.45, 7.5 * o),
      e.moveTo(P * 0.4, 6 * o),
      e.lineTo(P * 0.6, 7 * o),
      e.stroke(),
      (e.fillStyle = S),
      e.fillRect(-2 * o, -A * 0.9, 4 * o, A * 1.8),
      g || f
        ? ((e.fillStyle = f ? "#fef08a" : "#94a3b8"),
          e.fillRect(-1 * o, -1 * o, 2 * o, 2 * o),
          (e.fillStyle = "#0f172a"),
          e.fillRect(-0.4 * o, -0.4 * o, 0.8 * o, 0.8 * o))
        : ((e.strokeStyle = "#fef08a"),
          (e.lineWidth = 0.8 * o),
          e.beginPath(),
          e.moveTo(-1.6 * o, -1.5 * o),
          e.lineTo(1.6 * o, -1.5 * o),
          e.moveTo(-1.6 * o, 1.5 * o),
          e.lineTo(1.6 * o, 1.5 * o),
          e.stroke()),
      f)
    ) {
      const x = Math.sin(u * 4);
      ((e.fillStyle = "#fef08a"),
        e.fillRect(-4 * o + x * 1.5, -4 * o, 1.2 * o, 1.2 * o),
        e.fillRect(4 * o - x * 1.5, 3 * o, 1.2 * o, 1.2 * o));
    }
    e.restore();
  }
  function hb(e, t, l, o, u = 0) {
    (e.save(),
      e.translate(t, l),
      (e.fillStyle = "rgba(15, 23, 42, 0.4)"),
      e.beginPath(),
      e.ellipse(0, 9 * o, 8 * o, 3.2 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.ellipse(0, 7.5 * o, 6 * o, 2.2 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#9a3412"),
      e.beginPath(),
      e.ellipse(0, 2 * o, 8.5 * o, 7.5 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#c2410c"),
      e.beginPath(),
      e.ellipse(-1.2 * o, 1.2 * o, 6.8 * o, 6.2 * o, -0.05, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ea580c"),
      e.beginPath(),
      e.ellipse(-2.5 * o, 0, 4.5 * o, 4.5 * o, -0.1, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "rgba(255, 247, 237, 0.65)"),
      e.beginPath(),
      e.ellipse(-3.2 * o, -1 * o, 1.8 * o, 3.2 * o, -0.25, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#9a3412"),
      e.beginPath(),
      e.ellipse(0, -5 * o, 4.8 * o, 2 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#c2410c"),
      e.fillRect(-4.5 * o, -7.5 * o, 9 * o, 3 * o),
      (e.fillStyle = "#ea580c"),
      e.beginPath(),
      e.ellipse(0, -7.5 * o, 5.5 * o, 2.2 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#431407"),
      e.beginPath(),
      e.ellipse(0, -7.5 * o, 3.8 * o, 1.4 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#431407"),
      (e.lineWidth = 1.1 * o),
      e.beginPath(),
      e.ellipse(0, 2 * o, 8.2 * o, 2.8 * o, 0, 0.2, Math.PI - 0.2),
      e.stroke(),
      (e.fillStyle = "#fef08a"));
    for (let m = -5; m <= 5; m += 2.5)
      e.fillRect(m * o - 0.6 * o, 1.2 * o, 1.2 * o, 1.6 * o);
    ((e.strokeStyle = "#d97706"),
      (e.lineWidth = 1.4 * o),
      e.beginPath(),
      e.ellipse(0, -5 * o, 5 * o, 1.4 * o, 0, 0, Math.PI),
      e.stroke(),
      e.restore());
  }
  function pb(e, t, l, o) {
    (e.save(),
      e.translate(t, l),
      (e.fillStyle = "rgba(15, 23, 42, 0.38)"),
      e.beginPath(),
      e.ellipse(0, 7 * o, 10 * o, 4 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#9a3412"),
      e.fillRect(-8 * o, -1 * o, 16 * o, 7 * o),
      (e.fillStyle = "#c2410c"),
      e.beginPath(),
      e.moveTo(-8 * o, -1 * o),
      e.lineTo(-4 * o, -6 * o),
      e.lineTo(12 * o, -6 * o),
      e.lineTo(8 * o, -1 * o),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.moveTo(8 * o, -1 * o),
      e.lineTo(12 * o, -6 * o),
      e.lineTo(12 * o, 1 * o),
      e.lineTo(8 * o, 6 * o),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#431407"),
      e.fillRect(-5 * o, 1 * o, 1.2 * o, 1.2 * o),
      e.fillRect(2 * o, 3 * o, 1.4 * o, 1 * o),
      e.fillRect(-2 * o, -4 * o, 1.5 * o, 1 * o),
      e.fillRect(4 * o, -3.5 * o, 1.2 * o, 1.2 * o),
      (e.fillStyle = "#ea580c"),
      e.fillRect(-7 * o, 0, 14 * o, 1.2 * o),
      e.restore());
  }
  function gb(e, t, l, o, u = 0) {
    (e.save(),
      e.translate(t, l),
      (e.fillStyle = "rgba(15, 23, 42, 0.42)"),
      e.beginPath(),
      e.ellipse(0, 9 * o, 9.5 * o, 3.6 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#7c2d12"),
      e.fillRect(-6.5 * o, 5 * o, 2.8 * o, 3.8 * o),
      e.fillRect(3.7 * o, 5 * o, 2.8 * o, 3.8 * o),
      e.fillRect(-1.4 * o, 5.8 * o, 2.8 * o, 3.2 * o),
      (e.strokeStyle = "#9a3412"),
      (e.lineWidth = 2.2 * o),
      e.beginPath(),
      e.arc(-8.5 * o, 0, 3 * o, Math.PI * 0.5, Math.PI * 1.5),
      e.stroke(),
      e.beginPath(),
      e.arc(8.5 * o, 0, 3 * o, -Math.PI * 0.5, Math.PI * 0.5),
      e.stroke(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.ellipse(0, 1.5 * o, 9.2 * o, 7.2 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#9a3412"),
      e.beginPath(),
      e.ellipse(-1.2 * o, 1.2 * o, 7.8 * o, 6 * o, -0.05, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#c2410c"),
      e.beginPath(),
      e.ellipse(-2.5 * o, 0.5 * o, 5.8 * o, 4.6 * o, -0.1, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "rgba(255, 247, 237, 0.45)"),
      e.beginPath(),
      e.ellipse(-3.2 * o, -0.5 * o, 1.8 * o, 3.2 * o, -0.25, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.ellipse(0, -4.5 * o, 8.2 * o, 2.8 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#9a3412"),
      e.beginPath(),
      e.ellipse(0, -4.5 * o, 7.5 * o, 2.3 * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#1c0e08"),
      e.beginPath(),
      e.ellipse(0, -4.5 * o, 6.2 * o, 1.8 * o, 0, 0, Math.PI * 2),
      e.fill(),
      e.restore());
  }
  function bb(e) {
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase(),
      o = (e.icon || "").toLowerCase();
    return t.includes("espeto") ||
      t.includes("assado") ||
      l.includes("roasted_fish") ||
      l.includes("fish_roasted") ||
      l.includes("espeto_peixe")
      ? "roasted_skewer"
      : t.includes("lambari") || l.includes("lambari")
        ? "lambari"
        : t.includes("tilápia") ||
            t.includes("tilapia") ||
            l.includes("tilapia")
          ? "tilapia"
          : t.includes("cascudo") || l.includes("cascudo")
            ? "cascudo"
            : t.includes("truta") || l.includes("truta")
              ? "truta"
              : o === "fish" ||
                  o === "peixe" ||
                  t.includes("peixe") ||
                  l.startsWith("fish_") ||
                  l.includes("peixe")
                ? "generic"
                : null;
  }
  function yb(e, t, l, o, u, m, c) {
    switch ((e.save(), e.translate(t, l), m)) {
      case "roasted_skewer":
        kb(e, o, u);
        break;
      case "lambari":
        vb(e, o, u);
        break;
      case "tilapia":
        wb(e, o);
        break;
      case "cascudo":
        Tb(e, o);
        break;
      case "truta":
        Sb(e, o, u);
        break;
      case "generic":
      default:
        Mb(e, o, u, c);
        break;
    }
    e.restore();
  }
  function vb(e, t, l) {
    ((e.fillStyle = "rgba(15, 23, 42, 0.3)"),
      e.beginPath(),
      e.ellipse(0, 5 * t, 8 * t, 2.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#0284c7"),
      e.beginPath(),
      e.moveTo(4 * t, 0),
      e.lineTo(9.5 * t, -4.5 * t),
      e.lineTo(7 * t, 0),
      e.lineTo(9.5 * t, 4.5 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#38bdf8"),
      (e.lineWidth = 0.8 * t),
      e.stroke(),
      (e.fillStyle = "#0284c7"),
      e.beginPath(),
      e.moveTo(-1 * t, -1.8 * t),
      e.lineTo(2 * t, -5.5 * t),
      e.lineTo(3.5 * t, -1.5 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#38bdf8"),
      e.beginPath(),
      e.moveTo(0, 1.8 * t),
      e.lineTo(1.5 * t, 4 * t),
      e.lineTo(2.5 * t, 1.5 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#38bdf8"),
      e.beginPath(),
      e.moveTo(-8.5 * t, 0),
      e.quadraticCurveTo(-4 * t, -3.2 * t, 1 * t, -2.5 * t),
      e.quadraticCurveTo(4.5 * t, -1.8 * t, 5.5 * t, 0),
      e.quadraticCurveTo(4.5 * t, 1.8 * t, 1 * t, 2.5 * t),
      e.quadraticCurveTo(-4 * t, 3.2 * t, -8.5 * t, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f0fdf4"),
      e.beginPath(),
      e.moveTo(-7 * t, 0.4 * t),
      e.quadraticCurveTo(-2 * t, 2.6 * t, 2 * t, 2 * t),
      e.quadraticCurveTo(4.5 * t, 1.2 * t, 5 * t, 0),
      e.quadraticCurveTo(1 * t, 0.6 * t, -4 * t, 0.3 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#0284c7"),
      (e.lineWidth = 0.6 * t),
      e.beginPath(),
      e.moveTo(-6 * t, 0.2 * t),
      e.lineTo(4 * t, 0),
      e.stroke(),
      (e.fillStyle = "rgba(2, 132, 199, 0.85)"),
      e.beginPath(),
      e.moveTo(-3.5 * t, 0.5 * t),
      e.lineTo(-1 * t, 2.8 * t),
      e.lineTo(-1.5 * t, 0.8 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f8fafc"),
      e.beginPath(),
      e.arc(-5.8 * t, -0.6 * t, 1.3 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(-5.8 * t, -0.6 * t, 0.8 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-6.1 * t, -0.9 * t, 0.4 * t, 0, Math.PI * 2),
      e.fill(),
      Math.sin(l * 3.5) > 0.4 &&
        ((e.fillStyle = "rgba(255, 255, 255, 0.7)"),
        e.beginPath(),
        e.arc(-2 * t, -1.2 * t, 0.9 * t, 0, Math.PI * 2),
        e.fill()));
  }
  function wb(e, t, l) {
    ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
      e.beginPath(),
      e.ellipse(0, 6 * t, 8.5 * t, 3 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#0284c7"),
      e.beginPath(),
      e.moveTo(4.5 * t, 0),
      e.lineTo(9.5 * t, -4.8 * t),
      e.quadraticCurveTo(8.5 * t, 0, 9.5 * t, 4.8 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#0369a1"),
      (e.lineWidth = 0.8 * t));
    for (let o = -3; o <= 3; o += 2)
      (e.beginPath(),
        e.moveTo(5 * t, o * 0.4 * t),
        e.lineTo(9 * t, o * 1.3 * t),
        e.stroke());
    ((e.fillStyle = "#0369a1"),
      e.beginPath(),
      e.moveTo(-3.5 * t, -2.5 * t),
      e.lineTo(-2 * t, -6.5 * t),
      e.lineTo(0, -6.2 * t),
      e.lineTo(2 * t, -6.5 * t),
      e.lineTo(3.5 * t, -5 * t),
      e.lineTo(4 * t, -2 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#0c4a6e"),
      (e.lineWidth = 0.7 * t));
    for (let o of [-2, 0, 2])
      (e.beginPath(),
        e.moveTo(o * t, -2.5 * t),
        e.lineTo(o * t, -6.2 * t),
        e.stroke());
    ((e.fillStyle = "#0284c7"),
      e.beginPath(),
      e.moveTo(1 * t, 3.2 * t),
      e.lineTo(3 * t, 5.5 * t),
      e.lineTo(4.5 * t, 2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#0284c7"),
      e.beginPath(),
      e.moveTo(-8 * t, 0.5 * t),
      e.quadraticCurveTo(-5 * t, -4.8 * t, 0, -4.2 * t),
      e.quadraticCurveTo(4 * t, -3.5 * t, 5 * t, 0),
      e.quadraticCurveTo(4 * t, 4.5 * t, 0, 4.8 * t),
      e.quadraticCurveTo(-5 * t, 4.5 * t, -8 * t, 0.5 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#e0f2fe"),
      e.beginPath(),
      e.moveTo(-6.5 * t, 1 * t),
      e.quadraticCurveTo(-2 * t, 4.2 * t, 1.5 * t, 3.8 * t),
      e.quadraticCurveTo(4.2 * t, 2.5 * t, 4.8 * t, 0),
      e.quadraticCurveTo(1 * t, 0.8 * t, -3.5 * t, 0.8 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "rgba(3, 105, 161, 0.6)"),
      (e.lineWidth = 1 * t));
    for (let o of [-2.5, -0.5, 1.5, 3.2])
      (e.beginPath(),
        e.moveTo(o * t, -3.5 * t),
        e.lineTo(o * t, 2.5 * t),
        e.stroke());
    ((e.strokeStyle = "#0369a1"),
      (e.lineWidth = 0.9 * t),
      e.beginPath(),
      e.arc(-3.5 * t, 0.5 * t, 2.6 * t, -Math.PI * 0.4, Math.PI * 0.4),
      e.stroke(),
      (e.fillStyle = "#38bdf8"),
      e.beginPath(),
      e.moveTo(-3 * t, 0.5 * t),
      e.lineTo(-0.5 * t, 3.2 * t),
      e.lineTo(0.5 * t, 1.8 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f8fafc"),
      e.beginPath(),
      e.arc(-5.5 * t, -0.8 * t, 1.5 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(-5.5 * t, -0.8 * t, 0.9 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-5.8 * t, -1.2 * t, 0.5 * t, 0, Math.PI * 2),
      e.fill());
  }
  function Tb(e, t, l) {
    ((e.fillStyle = "rgba(15, 23, 42, 0.4)"),
      e.beginPath(),
      e.ellipse(0, 5.5 * t, 9 * t, 3.2 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#44403c"),
      e.beginPath(),
      e.moveTo(5 * t, 0),
      e.lineTo(10 * t, -4.5 * t),
      e.lineTo(8 * t, 0),
      e.lineTo(9.5 * t, 4 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#57534e"),
      e.beginPath(),
      e.moveTo(-1 * t, -1.5 * t),
      e.lineTo(0.5 * t, -6.5 * t),
      e.lineTo(3.5 * t, -4.5 * t),
      e.lineTo(3.8 * t, -1.2 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#292524"),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(-1 * t, -1.5 * t),
      e.lineTo(0.5 * t, -6.5 * t),
      e.stroke(),
      (e.fillStyle = "#57534e"),
      e.beginPath(),
      e.moveTo(-3 * t, 1.5 * t),
      e.lineTo(-1 * t, 5.5 * t),
      e.lineTo(2 * t, 3.5 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#78716c"),
      e.beginPath(),
      e.moveTo(-8.5 * t, 1 * t),
      e.quadraticCurveTo(-6 * t, -3.2 * t, 0, -2.8 * t),
      e.quadraticCurveTo(4.5 * t, -2 * t, 5.5 * t, 0),
      e.quadraticCurveTo(4.5 * t, 2.5 * t, 0, 3.2 * t),
      e.quadraticCurveTo(-6 * t, 3.5 * t, -8.5 * t, 1 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#292524"),
      (e.lineWidth = 0.9 * t));
    for (let o = -4; o <= 4; o += 1.8)
      (e.beginPath(),
        e.moveTo(o * t, -2 * t),
        e.lineTo((o + 0.8) * t, 0),
        e.lineTo(o * t, 2 * t),
        e.stroke());
    ((e.fillStyle = "#44403c"),
      e.fillRect(-5 * t, 0.5 * t, 1.2 * t, 1 * t),
      e.fillRect(-2 * t, -1.2 * t, 1.5 * t, 1 * t),
      e.fillRect(1.5 * t, 0.8 * t, 1.2 * t, 1.2 * t),
      e.fillRect(3 * t, -0.8 * t, 1 * t, 1 * t),
      (e.strokeStyle = "#44403c"),
      (e.lineWidth = 1 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(-8 * t, 0.5 * t),
      e.quadraticCurveTo(-10 * t, -1 * t, -11 * t, -0.5 * t),
      e.moveTo(-8 * t, 1.5 * t),
      e.quadraticCurveTo(-10 * t, 3 * t, -11 * t, 2.5 * t),
      e.stroke(),
      (e.fillStyle = "#f59e0b"),
      e.beginPath(),
      e.arc(-5.5 * t, -1.5 * t, 1.1 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#1c1917"),
      e.beginPath(),
      e.arc(-5.5 * t, -1.5 * t, 0.6 * t, 0, Math.PI * 2),
      e.fill());
  }
  function Sb(e, t, l) {
    const o = Math.sin(l * 4) * 0.2 + 0.8;
    ((e.fillStyle = "rgba(251, 191, 36, 0.25)"),
      e.beginPath(),
      e.ellipse(0, 0, 11 * t * o, 6.5 * t * o, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "rgba(15, 23, 42, 0.3)"),
      e.beginPath(),
      e.ellipse(0, 5 * t, 8.5 * t, 2.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#f59e0b"),
      e.beginPath(),
      e.moveTo(4.5 * t, 0),
      e.lineTo(9.5 * t, -4.5 * t),
      e.lineTo(7.5 * t, 0),
      e.lineTo(9.5 * t, 4.5 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#d97706"),
      (e.lineWidth = 0.8 * t),
      e.stroke(),
      (e.fillStyle = "#f59e0b"),
      e.beginPath(),
      e.moveTo(-1 * t, -2.5 * t),
      e.lineTo(1.5 * t, -6 * t),
      e.lineTo(3 * t, -2.2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#d97706"),
      e.beginPath(),
      e.ellipse(3.8 * t, -2 * t, 0.8 * t, 0.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#fbbf24"),
      e.beginPath(),
      e.moveTo(-8.5 * t, 0),
      e.quadraticCurveTo(-4 * t, -3.8 * t, 0.5 * t, -3.2 * t),
      e.quadraticCurveTo(4.5 * t, -2.2 * t, 5.5 * t, 0),
      e.quadraticCurveTo(4.5 * t, 2.2 * t, 0.5 * t, 3.2 * t),
      e.quadraticCurveTo(-4 * t, 3.8 * t, -8.5 * t, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#fef08a"),
      e.beginPath(),
      e.moveTo(-7 * t, 0.5 * t),
      e.quadraticCurveTo(-2 * t, 3 * t, 2 * t, 2.4 * t),
      e.quadraticCurveTo(4.5 * t, 1.5 * t, 5 * t, 0),
      e.quadraticCurveTo(1 * t, 0.5 * t, -4 * t, 0.4 * t),
      e.closePath(),
      e.fill());
    const u = [
      [-4.5 * t, -0.2 * t],
      [-3 * t, 0.4 * t],
      [-1.5 * t, -0.6 * t],
      [-0.5 * t, 0.2 * t],
      [1 * t, -0.4 * t],
      [2.2 * t, 0.3 * t],
      [3.5 * t, -0.2 * t],
    ];
    e.fillStyle = "#dc2626";
    for (const [c, f] of u)
      (e.beginPath(), e.arc(c, f, 0.7 * t, 0, Math.PI * 2), e.fill());
    ((e.fillStyle = "#f59e0b"),
      e.beginPath(),
      e.moveTo(-4 * t, 0.5 * t),
      e.lineTo(-1.8 * t, 3.2 * t),
      e.lineTo(-2 * t, 0.8 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#fef08a"),
      e.beginPath(),
      e.arc(-6 * t, -0.8 * t, 1.4 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#1e1b4b"),
      e.beginPath(),
      e.arc(-6 * t, -0.8 * t, 0.85 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-6.3 * t, -1.1 * t, 0.45 * t, 0, Math.PI * 2),
      e.fill());
    const m = (l * 5) % Math.PI;
    Math.sin(m) > 0.6 &&
      ((e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(2 * t, -3 * t, 1.2 * t, 0, Math.PI * 2),
      e.fill());
  }
  function kb(e, t, l, o) {
    ((e.fillStyle = "rgba(15, 23, 42, 0.35)"),
      e.beginPath(),
      e.ellipse(0, 6 * t, 9 * t, 3 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#451a03"),
      (e.lineWidth = 2.4 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(-11 * t, 0.5 * t),
      e.lineTo(12 * t, -0.5 * t),
      e.stroke(),
      (e.strokeStyle = "#92400e"),
      (e.lineWidth = 1.6 * t),
      e.beginPath(),
      e.moveTo(-11 * t, 0.5 * t),
      e.lineTo(12 * t, -0.5 * t),
      e.stroke(),
      (e.fillStyle = "#fde68a"),
      e.beginPath(),
      e.moveTo(11 * t, -1 * t),
      e.lineTo(13 * t, -0.5 * t),
      e.lineTo(11 * t, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#92400e"),
      e.beginPath(),
      e.moveTo(4.5 * t, 0),
      e.lineTo(8.5 * t, -3.8 * t),
      e.lineTo(7 * t, 0),
      e.lineTo(8.5 * t, 3.8 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#292524"),
      e.beginPath(),
      e.arc(8.5 * t, -3.8 * t, 0.8 * t, 0, Math.PI * 2),
      e.arc(8.5 * t, 3.8 * t, 0.8 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#78350f"),
      e.beginPath(),
      e.moveTo(-1 * t, -2.5 * t),
      e.lineTo(1.5 * t, -5 * t),
      e.lineTo(3 * t, -2.2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#b45309"),
      e.beginPath(),
      e.moveTo(-7 * t, 0),
      e.quadraticCurveTo(-3.5 * t, -3.8 * t, 0.5 * t, -3.2 * t),
      e.quadraticCurveTo(4 * t, -2.2 * t, 5 * t, 0),
      e.quadraticCurveTo(4 * t, 2.2 * t, 0.5 * t, 3.2 * t),
      e.quadraticCurveTo(-3.5 * t, 3.8 * t, -7 * t, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#d97706"),
      e.beginPath(),
      e.moveTo(-5.5 * t, 0.5 * t),
      e.quadraticCurveTo(-1.5 * t, 2.8 * t, 2 * t, 2.2 * t),
      e.quadraticCurveTo(4 * t, 1.2 * t, 4.5 * t, 0),
      e.quadraticCurveTo(1 * t, 0.4 * t, -3 * t, 0.3 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#451a03"),
      (e.lineWidth = 1.3 * t),
      (e.lineCap = "round"));
    for (let m of [-3.8, -1.8, 0.2, 2.2])
      (e.beginPath(),
        e.moveTo(m * t, -2.8 * t),
        e.lineTo((m + 0.8) * t, 2.4 * t),
        e.stroke());
    ((e.fillStyle = "#292524"),
      e.beginPath(),
      e.arc(-5 * t, -0.6 * t, 1.1 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#fef08a"),
      e.beginPath(),
      e.arc(-5 * t, -0.6 * t, 0.5 * t, 0, Math.PI * 2),
      e.fill());
    const u = (l * 2.5) % 1;
    ((e.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 0.65 - u * 0.6)})`),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(-1 * t, -3.5 * t),
      e.quadraticCurveTo(
        -2.5 * t,
        -6 * t - u * 5 * t,
        -0.5 * t,
        -8 * t - u * 6 * t,
      ),
      e.stroke(),
      e.beginPath(),
      e.moveTo(1.5 * t, -3.5 * t),
      e.quadraticCurveTo(
        3 * t,
        -5.5 * t - u * 5 * t,
        1.5 * t,
        -7.5 * t - u * 6 * t,
      ),
      e.stroke());
  }
  function Mb(e, t, l, o) {
    const u = o.color || "#38bdf8";
    ((e.fillStyle = u),
      e.beginPath(),
      e.moveTo(-7 * t, 0),
      e.quadraticCurveTo(-3 * t, -3.5 * t, 1 * t, -2.5 * t),
      e.quadraticCurveTo(4 * t, -1.8 * t, 5 * t, 0),
      e.quadraticCurveTo(4 * t, 1.8 * t, 1 * t, 2.5 * t),
      e.quadraticCurveTo(-3 * t, 3.5 * t, -7 * t, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f8fafc"),
      e.beginPath(),
      e.arc(-5 * t, -0.6 * t, 1.2 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(-5 * t, -0.6 * t, 0.7 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = u),
      e.beginPath(),
      e.moveTo(4.5 * t, 0),
      e.lineTo(8.5 * t, -4 * t),
      e.lineTo(6.5 * t, 0),
      e.lineTo(8.5 * t, 4 * t),
      e.closePath(),
      e.fill());
  }
  function Cb(e, t, l, o, u, m) {
    (e.save(),
      e.translate(t, l),
      e.rotate(0.78),
      (e.fillStyle = "#78350f"),
      e.fillRect(-2 * o, 2 * o, 4 * o, 7 * o),
      (e.strokeStyle = "#b45309"),
      (e.lineWidth = 1 * o));
    for (let f = 3; f <= 8; f += 1.8)
      (e.beginPath(),
        e.moveTo(-2 * o, f * o),
        e.lineTo(2 * o, f * o),
        e.stroke());
    ((e.fillStyle = "#475569"),
      e.beginPath(),
      e.arc(0, 9.5 * o, 2.2 * o, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#64748b"),
      e.fillRect(-4.5 * o, 0.5 * o, 9 * o, 2 * o));
    const c = m || "#cbd5e1";
    ((e.fillStyle = c),
      e.beginPath(),
      e.moveTo(-2 * o, 0.5 * o),
      e.lineTo(-2 * o, -8 * o),
      e.quadraticCurveTo(-1 * o, -11 * o, 0, -12 * o),
      e.quadraticCurveTo(2 * o, -7 * o, 2 * o, 0.5 * o),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f8fafc"),
      e.beginPath(),
      e.moveTo(0, 0.5 * o),
      e.lineTo(0, -9 * o),
      e.quadraticCurveTo(0.8 * o, -11 * o, 0, -12 * o),
      e.lineTo(2 * o, 0.5 * o),
      e.closePath(),
      e.fill(),
      e.restore());
  }
  function qRRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }
  function Pb(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    const n = ((it && it.name) || "").toLowerCase();
    const id = ((it && it.id) || "").toLowerCase();
    const isDragon = n.includes("dragão") || n.includes("dragao") || id.includes("dragon");
    const isRabbit = n.includes("coelho") || id.includes("rabbit");
    const isDeer = n.includes("cervo") || id.includes("deer");

    if (isDragon) {
      e.rotate(0.35);
      e.fillStyle = "rgba(0,0,0,0.45)";
      e.beginPath();
      e.ellipse(o * 1, o * 2, o * 10, o * 4, 0.35, 0, Math.PI * 2);
      e.fill();

      const grad = e.createLinearGradient(-o * 8, -o * 8, o * 8, o * 8);
      grad.addColorStop(0, "#09090b");
      grad.addColorStop(0.35, "#1e1b4b");
      grad.addColorStop(0.7, "#312e81");
      grad.addColorStop(1, "#0f172a");
      e.fillStyle = grad;

      e.beginPath();
      e.moveTo(-o * 8, -o * 3);
      e.lineTo(-o * 10, -o * 6);
      e.lineTo(-o * 6, -o * 5);
      e.lineTo(-o * 3, -o * 8);
      e.lineTo(o * 1, -o * 3.5);
      e.lineTo(o * 8, -o * 4);
      e.lineTo(o * 10, -o * 1);
      e.lineTo(o * 8, o * 4.5);
      e.lineTo(o * 5, o * 2);
      e.lineTo(-o * 2, o * 3.5);
      e.lineTo(-o * 7, o * 6.5);
      e.lineTo(-o * 9, o * 3);
      e.closePath();
      e.fill();
      e.strokeStyle = "#4338ca";
      e.lineWidth = 1 * o;
      e.stroke();

      const pulse = 0.7 + 0.3 * Math.sin(tm * 4);
      e.strokeStyle = `rgba(249, 115, 22, ${pulse})`;
      e.lineWidth = 1.6 * o;
      e.lineCap = "round";
      e.beginPath();
      e.moveTo(-o * 7, -o * 2);
      e.lineTo(-o * 2, -o * 1);
      e.lineTo(o * 2, o * 1);
      e.lineTo(o * 7, 0);
      e.moveTo(-o * 2, -o * 1);
      e.lineTo(o * 1, -o * 4);
      e.stroke();

      e.strokeStyle = `rgba(254, 240, 138, ${pulse})`;
      e.lineWidth = 0.7 * o;
      e.stroke();
    } else if (isRabbit) {
      e.fillStyle = "rgba(0,0,0,0.2)";
      e.beginPath();
      e.ellipse(0, o * 2, o * 8, o * 3, 0, 0, Math.PI * 2);
      e.fill();

      [-0.45, 0.45].forEach((rot, idx) => {
        e.save();
        e.rotate(rot);
        const gShaft = e.createLinearGradient(-o * 1, 0, o * 1, 0);
        gShaft.addColorStop(0, idx === 0 ? "#ffffff" : "#f1f5f9");
        gShaft.addColorStop(0.5, "#f8fafc");
        gShaft.addColorStop(1, "#cbd5e1");
        e.fillStyle = gShaft;

        qRRect(e, -o * 1, -o * 7, o * 2, o * 14, o * 0.8);
        e.fill();

        e.fillStyle = "#f8fafc";
        e.strokeStyle = "#94a3b8";
        e.lineWidth = 0.6 * o;
        [-o * 7, o * 7].forEach((yPos) => {
          e.beginPath();
          e.arc(-o * 1.2, yPos, o * 1.3, 0, Math.PI * 2);
          e.arc(o * 1.2, yPos, o * 1.3, 0, Math.PI * 2);
          e.fill();
          e.stroke();
        });

        e.strokeStyle = "rgba(255,255,255,0.85)";
        e.lineWidth = 0.7 * o;
        e.beginPath();
        e.moveTo(-o * 0.3, -o * 5);
        e.lineTo(-o * 0.3, o * 5);
        e.stroke();
        e.restore();
      });
    } else {
      e.rotate(isDeer ? -0.4 : 0.45);
      e.fillStyle = "rgba(0,0,0,0.25)";
      e.beginPath();
      e.ellipse(o * 1.5, o * 2, o * 8, o * 4, 0, 0, Math.PI * 2);
      e.fill();

      const bGrad = e.createLinearGradient(-o * 2, -o * 7, o * 3, o * 7);
      bGrad.addColorStop(0, "#ffffff");
      bGrad.addColorStop(0.3, "#f8fafc");
      bGrad.addColorStop(0.7, "#e2e8f0");
      bGrad.addColorStop(1, "#cbd5e1");
      e.fillStyle = bGrad;

      e.beginPath();
      e.moveTo(-o * 1.8, -o * 6);
      e.quadraticCurveTo(-o * 1.2, 0, -o * 2.2, o * 6);
      e.lineTo(o * 2.2, o * 6);
      e.quadraticCurveTo(o * 1.2, 0, o * 1.8, -o * 6);
      e.closePath();
      e.fill();

      const drawJoint = (y, flip) => {
        const sign = flip ? -1 : 1;
        e.beginPath();
        e.arc(-o * 2.4, y, o * 2.2, 0, Math.PI * 2);
        e.arc(o * 2.4, y, o * 2.2, 0, Math.PI * 2);
        e.fill();

        e.fillStyle = "rgba(148, 163, 184, 0.4)";
        e.beginPath();
        e.arc(0, y + sign * o * 0.5, o * 1.2, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = bGrad;
      };
      drawJoint(-o * 6.5, false);
      drawJoint(o * 6.5, true);

      e.strokeStyle = "#94a3b8";
      e.lineWidth = 0.8 * o;
      e.beginPath();
      e.arc(-o * 2.4, -o * 6.5, o * 2.2, Math.PI * 0.8, Math.PI * 1.9);
      e.stroke();
      e.beginPath();
      e.arc(o * 2.4, -o * 6.5, o * 2.2, -Math.PI * 0.9, Math.PI * 0.2);
      e.stroke();

      e.strokeStyle = "rgba(255,255,255,0.9)";
      e.lineWidth = 1.1 * o;
      e.lineCap = "round";
      e.beginPath();
      e.moveTo(-o * 0.5, -o * 4);
      e.quadraticCurveTo(-o * 0.2, 0, -o * 0.7, o * 4);
      e.stroke();
    }
    e.restore();
  }
  function _b(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    const n = ((it && it.name) || "").toLowerCase();
    const id = ((it && it.id) || "").toLowerCase();
    const isDragon = n.includes("dragão") || n.includes("dragao") || id.includes("dragon");
    const isRabbit = n.includes("coelho") || id.includes("rabbit");
    const isDeer = n.includes("cervo") || id.includes("deer");

    e.fillStyle = "rgba(0, 0, 0, 0.35)";
    e.beginPath();
    e.ellipse(o * 1, o * 3.5, o * 9.5, o * 6, -0.15, 0, Math.PI * 2);
    e.fill();

    if (isDragon) {
      e.beginPath();
      e.moveTo(-o * 8, -o * 4);
      e.quadraticCurveTo(-o * 1, -o * 8, o * 7, -o * 4);
      e.quadraticCurveTo(o * 10, o * 1, o * 6, o * 6);
      e.quadraticCurveTo(-o * 2, o * 8, -o * 8, o * 4);
      e.quadraticCurveTo(-o * 10, 0, -o * 8, -o * 4);
      e.closePath();
      e.fillStyle = "#260606";
      e.fill();
      e.strokeStyle = "#450a0a";
      e.lineWidth = 1.2 * o;
      e.stroke();

      const mGrad = e.createRadialGradient(o * 1, 0, o * 1, o * 1, 0, o * 8);
      mGrad.addColorStop(0, "#ef4444");
      mGrad.addColorStop(0.5, "#dc2626");
      mGrad.addColorStop(1, "#991b1b");
      e.fillStyle = mGrad;
      e.beginPath();
      e.moveTo(-o * 7, -o * 3.5);
      e.quadraticCurveTo(-o * 1, -o * 6.5, o * 5.5, -o * 3.5);
      e.quadraticCurveTo(o * 8.5, o * 0.5, o * 5, o * 5);
      e.quadraticCurveTo(-o * 2, o * 6.5, -o * 7, o * 3);
      e.closePath();
      e.fill();

      const glow = 0.7 + 0.3 * Math.sin(tm * 5);
      e.strokeStyle = `rgba(251, 191, 36, ${glow})`;
      e.lineWidth = 1.5 * o;
      e.lineCap = "round";
      e.beginPath();
      e.moveTo(-o * 5, -o * 1);
      e.quadraticCurveTo(-o * 2, -o * 3, o * 2, -o * 2);
      e.moveTo(-o * 4, o * 2);
      e.quadraticCurveTo(0, o * 1, o * 4, o * 2);
      e.stroke();

      e.fillStyle = "#09090b";
      e.beginPath();
      e.arc(o * 0.5, -o * 0.5, o * 2.2, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#ea580c";
      e.beginPath();
      e.arc(o * 0.5, -o * 0.5, o * 1.1, 0, Math.PI * 2);
      e.fill();
    } else {
      let cCore = isRabbit ? "#fb7185" : isDeer ? "#9f1239" : "#dc2626";
      let cEdge = isRabbit ? "#f43f5e" : isDeer ? "#881337" : "#b91c1c";
      let cFat = isRabbit ? "#fff1f2" : "#fef3c7";

      e.beginPath();
      e.moveTo(-o * 8.5, -o * 3.5);
      e.quadraticCurveTo(-o * 2, -o * 7.5, o * 7.5, -o * 4.5);
      e.quadraticCurveTo(o * 9.5, o * 1, o * 7, o * 5.5);
      e.quadraticCurveTo(-o * 1, o * 7.5, -o * 7.5, o * 4.5);
      e.quadraticCurveTo(-o * 9.5, 0, -o * 8.5, -o * 3.5);
      e.closePath();
      e.fillStyle = cFat;
      e.fill();
      e.strokeStyle = isRabbit ? "#fecdd3" : "#fde68a";
      e.lineWidth = 1 * o;
      e.stroke();

      const cutGrad = e.createLinearGradient(-o * 6, -o * 4, o * 6, o * 4);
      cutGrad.addColorStop(0, cCore);
      cutGrad.addColorStop(0.7, cEdge);
      cutGrad.addColorStop(1, isDeer ? "#4c0519" : "#7f1d1d");
      e.fillStyle = cutGrad;

      e.beginPath();
      e.moveTo(-o * 7.5, -o * 2.8);
      e.quadraticCurveTo(-o * 1.5, -o * 6.2, o * 6.2, -o * 3.8);
      e.quadraticCurveTo(o * 8, o * 0.8, o * 5.8, o * 4.5);
      e.quadraticCurveTo(-o * 1, o * 6.2, -o * 6.8, o * 3.8);
      e.quadraticCurveTo(-o * 8.2, 0, -o * 7.5, -o * 2.8);
      e.closePath();
      e.fill();

      e.strokeStyle = isRabbit ? "rgba(255, 241, 242, 0.7)" : "rgba(254, 243, 199, 0.65)";
      e.lineWidth = 0.9 * o;
      e.beginPath();
      e.moveTo(-o * 5, -o * 1.5);
      e.quadraticCurveTo(-o * 2, -o * 3, o * 1, -o * 2.5);
      e.moveTo(-o * 4, o * 2);
      e.quadraticCurveTo(-o * 1, o * 1, o * 3.5, o * 1.8);
      e.moveTo(o * 1.5, -o * 1.5);
      e.quadraticCurveTo(o * 3.5, -o * 0.5, o * 4.8, o * 1.2);
      e.stroke();

      const bx = -o * 1.2, by = -o * 0.5;
      e.fillStyle = "#ffffff";
      e.strokeStyle = "#cbd5e1";
      e.lineWidth = 0.8 * o;
      e.beginPath();
      e.ellipse(bx, by, o * 2.2, o * 1.8, 0.3, 0, Math.PI * 2);
      e.fill();
      e.stroke();

      e.fillStyle = isDeer ? "#4c0519" : "#991b1b";
      e.beginPath();
      e.ellipse(bx, by, o * 1.1, o * 0.9, 0.3, 0, Math.PI * 2);
      e.fill();

      e.strokeStyle = "rgba(255, 255, 255, 0.6)";
      e.lineWidth = 1.3 * o;
      e.beginPath();
      e.arc(-o * 4, -o * 2.5, o * 2, Math.PI * 0.8, Math.PI * 1.6);
      e.stroke();
    }
    e.restore();
  }
  function Ab(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    const n = ((it && it.name) || "").toLowerCase();
    const id = ((it && it.id) || "").toLowerCase();
    const isRabbit = n.includes("coelho") || id.includes("rabbit");
    const isDeer = n.includes("cervo") || id.includes("deer");
    const isWolf = n.includes("lobo") || id.includes("wolf");

    e.fillStyle = "rgba(0, 0, 0, 0.25)";
    e.beginPath();
    e.ellipse(0, o * 1, o * 9, o * 8.5, 0, 0, Math.PI * 2);
    e.fill();

    let pMain, pShadow, pStroke;
    if (isRabbit) {
      pMain = "#f8fafc";
      pShadow = "#cbd5e1";
      pStroke = "#94a3b8";
    } else if (isWolf) {
      pMain = "#475569";
      pShadow = "#1e293b";
      pStroke = "#0f172a";
    } else if (isDeer) {
      pMain = "#b45309";
      pShadow = "#78350f";
      pStroke = "#451a03";
    } else {
      pMain = u || "#d97706";
      pShadow = "#92400e";
      pStroke = "#78350f";
    }

    e.beginPath();
    e.moveTo(0, -o * 9);
    e.lineTo(o * 2.5, -o * 8);
    e.lineTo(o * 7, -o * 7.5);
    e.lineTo(o * 8.5, -o * 5);
    e.lineTo(o * 6, -o * 4);
    e.lineTo(o * 4.5, -o * 0.5);
    e.lineTo(o * 7.5, o * 5);
    e.lineTo(o * 6.5, o * 8);
    e.lineTo(o * 4, o * 7);
    e.lineTo(o * 2, o * 8.5);
    e.lineTo(0, o * 9.5);
    e.lineTo(-o * 2, o * 8.5);
    e.lineTo(-o * 4, o * 7);
    e.lineTo(-o * 6.5, o * 8);
    e.lineTo(-o * 7.5, o * 5);
    e.lineTo(-o * 4.5, -o * 0.5);
    e.lineTo(-o * 6, -o * 4);
    e.lineTo(-o * 8.5, -o * 5);
    e.lineTo(-o * 7, -o * 7.5);
    e.lineTo(-o * 2.5, -o * 8);
    e.closePath();

    const peltGrad = e.createRadialGradient(0, 0, o * 2, 0, 0, o * 8);
    peltGrad.addColorStop(0, pMain);
    peltGrad.addColorStop(0.7, pMain);
    peltGrad.addColorStop(1, pShadow);
    e.fillStyle = peltGrad;
    e.fill();
    e.strokeStyle = pStroke;
    e.lineWidth = 1 * o;
    e.stroke();

    if (isRabbit) {
      e.fillStyle = "rgba(255, 255, 255, 0.7)";
      e.beginPath();
      e.ellipse(0, 0, o * 3, o * 4.5, 0, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = "#92400e";
      e.lineWidth = 1.2 * o;
      e.beginPath();
      e.moveTo(-o * 3.5, 0);
      e.lineTo(o * 3.5, 0);
      e.stroke();
      e.fillStyle = "#b45309";
      e.beginPath();
      e.arc(0, 0, o * 1, 0, Math.PI * 2);
      e.fill();
    } else if (isWolf) {
      e.fillStyle = "rgba(15, 23, 42, 0.55)";
      e.beginPath();
      e.ellipse(0, 0, o * 2.2, o * 6.5, 0, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = "#cbd5e1";
      e.lineWidth = 0.8 * o;
      e.beginPath();
      e.moveTo(-o * 1, -o * 4); e.lineTo(0, -o * 2); e.lineTo(o * 1, -o * 4);
      e.moveTo(-o * 1.5, o * 1); e.lineTo(0, o * 3); e.lineTo(o * 1.5, o * 1);
      e.stroke();
    } else if (isDeer) {
      e.strokeStyle = "#fef3c7";
      e.lineWidth = 0.8 * o;
      [-o * 4, -o * 1, o * 2, o * 5].forEach(y => {
        e.beginPath();
        e.moveTo(-o * 3.2, y - o * 0.8); e.lineTo(-o * 2.2, y + o * 0.8);
        e.moveTo(-o * 2.2, y - o * 0.8); e.lineTo(-o * 3.2, y + o * 0.8);
        e.moveTo(o * 2.2, y - o * 0.8); e.lineTo(o * 3.2, y + o * 0.8);
        e.moveTo(o * 3.2, y - o * 0.8); e.lineTo(o * 2.2, y + o * 0.8);
        e.stroke();
      });
      e.fillStyle = "rgba(254, 243, 199, 0.25)";
      e.beginPath();
      e.ellipse(0, 0, o * 3, o * 4, 0, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
  }
  function Eb(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    e.fillStyle = "rgba(0,0,0,0.3)";
    e.beginPath();
    e.ellipse(0, o * 2.5, o * 8, o * 5, 0, 0, Math.PI * 2);
    e.fill();

    const grad = e.createRadialGradient(-o * 1, -o * 1, o * 1, 0, 0, o * 7);
    grad.addColorStop(0, "#ef4444");
    grad.addColorStop(0.5, "#dc2626");
    grad.addColorStop(0.85, "#991b1b");
    grad.addColorStop(1, "#450a0a");

    e.fillStyle = grad;
    e.beginPath();
    e.moveTo(0, o * 6.5);
    e.bezierCurveTo(-o * 6.5, o * 3, -o * 7.5, -o * 4, -o * 3.5, -o * 6);
    e.bezierCurveTo(-o * 1, -o * 7, 0, -o * 4.5, 0, -o * 3);
    e.bezierCurveTo(0, -o * 4.5, o * 1, -o * 7, o * 3.5, -o * 6);
    e.bezierCurveTo(o * 7.5, -o * 4, o * 6.5, o * 3, 0, o * 6.5);
    e.closePath();
    e.fill();
    e.strokeStyle = "#7f1d1d";
    e.lineWidth = 1 * o;
    e.stroke();

    e.fillStyle = "#881337";
    qRRect(e, -o * 2.5, -o * 8.5, o * 2.2, o * 3.5, o * 0.8);
    e.fill();
    qRRect(e, o * 0.5, -o * 8, o * 2, o * 3, o * 0.8);
    e.fill();

    e.strokeStyle = "#fef08a";
    e.lineWidth = 1.1 * o;
    e.beginPath();
    e.moveTo(-o * 3, -o * 5.5);
    e.lineTo(o * 3, -o * 5.5);
    e.stroke();

    e.strokeStyle = "rgba(127, 29, 29, 0.7)";
    e.lineWidth = 0.8 * o;
    e.beginPath();
    e.moveTo(-o * 1, -o * 2); e.quadraticCurveTo(-o * 3, 0, -o * 4, o * 2);
    e.moveTo(0, -o * 1); e.quadraticCurveTo(o * 2, 0, o * 3.5, o * 1.5);
    e.stroke();

    e.strokeStyle = "rgba(255, 255, 255, 0.75)";
    e.lineWidth = 1.3 * o;
    e.lineCap = "round";
    e.beginPath();
    e.arc(-o * 3, -o * 3, o * 2, Math.PI * 0.9, Math.PI * 1.5);
    e.stroke();
    e.restore();
  }
  function Nb(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    const n = ((it && it.name) || "").toLowerCase();
    const id = ((it && it.id) || "").toLowerCase();
    const isDragon = n.includes("dragão") || n.includes("dragao") || id.includes("dragon");

    e.fillStyle = "rgba(0,0,0,0.3)";
    e.beginPath();
    e.ellipse(o * 2, o * 3, o * 6, o * 8, 0.25, 0, Math.PI * 2);
    e.fill();

    if (isDragon) {
      e.rotate(0.2);
      const fGrad = e.createLinearGradient(-o * 4, -o * 8, o * 4, o * 8);
      fGrad.addColorStop(0, "#7f1d1d");
      fGrad.addColorStop(0.3, "#dc2626");
      fGrad.addColorStop(0.7, "#f97316");
      fGrad.addColorStop(1, "#fef08a");

      e.beginPath();
      e.moveTo(-o * 4.5, -o * 7.5);
      e.lineTo(o * 4.5, -o * 7.5);
      e.quadraticCurveTo(o * 5, 0, o * 1, o * 8.5);
      e.quadraticCurveTo(-o * 2, o * 1, -o * 4.5, -o * 7.5);
      e.closePath();
      e.fillStyle = fGrad;
      e.fill();
      e.strokeStyle = "#ea580c";
      e.lineWidth = 1 * o;
      e.stroke();

      e.fillStyle = "#1c1917";
      qRRect(e, -o * 5, -o * 9, o * 10, o * 2.5, o * 0.8);
      e.fill();

      const p = 0.7 + 0.3 * Math.sin(tm * 6);
      e.strokeStyle = `rgba(254, 240, 138, ${p})`;
      e.lineWidth = 1.2 * o;
      e.beginPath();
      e.moveTo(0, -o * 6);
      e.lineTo(-o * 0.5, -o * 1);
      e.lineTo(o * 0.8, o * 4);
      e.lineTo(o * 1, o * 8.5);
      e.stroke();

      e.fillStyle = "#ffffff";
      e.beginPath();
      e.arc(o * 1, o * 8.5, o * 0.9, 0, Math.PI * 2);
      e.fill();
    } else {
      e.rotate(0.25);
      const rGrad = e.createLinearGradient(-o * 4, -o * 8, o * 4, -o * 5);
      rGrad.addColorStop(0, "#cbd5e1");
      rGrad.addColorStop(0.5, "#e2e8f0");
      rGrad.addColorStop(1, "#94a3b8");
      e.fillStyle = rGrad;
      qRRect(e, -o * 4, -o * 8.5, o * 8, o * 3.5, o * 1);
      e.fill();

      e.strokeStyle = "#94a3b8";
      e.lineWidth = 0.6 * o;
      e.beginPath();
      e.moveTo(-o * 1.5, -o * 8.5); e.lineTo(-o * 1.5, -o * 5);
      e.moveTo(o * 1.5, -o * 8.5); e.lineTo(o * 1.5, -o * 5);
      e.stroke();

      const cGrad = e.createLinearGradient(-o * 3, -o * 5, o * 4, o * 8);
      cGrad.addColorStop(0, "#ffffff");
      cGrad.addColorStop(0.5, "#f8fafc");
      cGrad.addColorStop(0.85, "#e2e8f0");
      cGrad.addColorStop(1, "#cbd5e1");
      e.fillStyle = cGrad;

      e.beginPath();
      e.moveTo(-o * 4, -o * 5);
      e.lineTo(o * 4, -o * 5);
      e.quadraticCurveTo(o * 4.2, o * 1, o * 0.5, o * 8.5);
      e.quadraticCurveTo(-o * 1.5, o * 2, -o * 4, -o * 5);
      e.closePath();
      e.fill();
      e.strokeStyle = "#94a3b8";
      e.lineWidth = 0.8 * o;
      e.stroke();

      e.strokeStyle = "#ffffff";
      e.lineWidth = 1.2 * o;
      e.beginPath();
      e.moveTo(o * 1, -o * 4);
      e.quadraticCurveTo(o * 1.5, o * 2, o * 0.5, o * 8.5);
      e.stroke();

      e.fillStyle = "rgba(255, 255, 255, 0.9)";
      e.beginPath();
      e.arc(o * 0.5, o * 8.5, o * 0.8, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
  }
  function Rb(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    const n = ((it && it.name) || "").toLowerCase();
    const id = ((it && it.id) || "").toLowerCase();
    const isDragon = n.includes("dragão") || n.includes("dragao") || id.includes("dragon");

    e.fillStyle = "rgba(0,0,0,0.3)";
    e.beginPath();
    e.ellipse(o * 1, o * 3, o * 7, o * 8, 0, 0, Math.PI * 2);
    e.fill();

    if (isDragon) {
      const hornGrad = e.createLinearGradient(-o * 5, o * 7, o * 5, -o * 8);
      hornGrad.addColorStop(0, "#1c1917");
      hornGrad.addColorStop(0.3, "#78350f");
      hornGrad.addColorStop(0.7, "#c2410c");
      hornGrad.addColorStop(1, "#f97316");

      e.beginPath();
      e.moveTo(-o * 5, o * 7);
      e.lineTo(o * 4, o * 7);
      e.quadraticCurveTo(o * 7, 0, o * 2, -o * 8.5);
      e.quadraticCurveTo(o * 4, 0, -o * 5, o * 7);
      e.closePath();
      e.fillStyle = hornGrad;
      e.fill();
      e.strokeStyle = "#451a03";
      e.lineWidth = 1 * o;
      e.stroke();

      e.strokeStyle = "#fbbf24";
      e.lineWidth = 1.1 * o;
      [-o * 4, -o * 1, o * 2, o * 5].forEach((y, i) => {
        e.beginPath();
        e.ellipse(0, y, o * (4 - i * 0.6), o * 1.1, -0.3, 0, Math.PI * 2);
        e.stroke();
      });

      e.fillStyle = "#fef08a";
      e.beginPath();
      e.arc(o * 2, -o * 8.5, o * 1.2, 0, Math.PI * 2);
      e.fill();
    } else {
      e.rotate(-0.1);
      e.fillStyle = "#451a03";
      e.beginPath();
      e.ellipse(-o * 2, o * 7, o * 3, o * 1.4, 0, 0, Math.PI * 2);
      e.fill();

      const aGrad = e.createLinearGradient(-o * 3, o * 7, o * 4, -o * 8);
      aGrad.addColorStop(0, "#78350f");
      aGrad.addColorStop(0.4, "#b45309");
      aGrad.addColorStop(0.8, "#fef3c7");
      aGrad.addColorStop(1, "#ffffff");

      e.strokeStyle = aGrad;
      e.lineWidth = 3.5 * o;
      e.lineCap = "round";
      e.beginPath();
      e.moveTo(-o * 2, o * 6.5);
      e.quadraticCurveTo(-o * 1, o * 1, o * 2, -o * 3);
      e.quadraticCurveTo(o * 4, -o * 6, o * 3, -o * 8.5);
      e.stroke();

      e.lineWidth = 2.2 * o;
      e.beginPath();
      e.moveTo(-o * 1.5, o * 3.5);
      e.quadraticCurveTo(-o * 5, o * 1.5, -o * 6.5, o * 0.5);
      e.stroke();

      e.lineWidth = 2 * o;
      e.beginPath();
      e.moveTo(o * 0.5, o * 0.5);
      e.quadraticCurveTo(-o * 3, -o * 2, -o * 4.5, -o * 4);
      e.stroke();

      e.lineWidth = 1.8 * o;
      e.beginPath();
      e.moveTo(o * 2, -o * 3);
      e.quadraticCurveTo(o * 6, -o * 4, o * 7, -o * 5.5);
      e.stroke();

      e.fillStyle = "#ffffff";
      [
        [-o * 6.5, o * 0.5],
        [-o * 4.5, -o * 4],
        [o * 3, -o * 8.5],
        [o * 7, -o * 5.5]
      ].forEach(([px, py]) => {
        e.beginPath();
        e.arc(px, py, o * 0.9, 0, Math.PI * 2);
        e.fill();
      });
    }
    e.restore();
  }
  function jb(e, t, l, o, u, m, it) {
    e.save();
    e.translate(t, l);
    e.fillStyle = "rgba(0,0,0,0.4)";
    e.beginPath();
    e.ellipse(0, o * 2, o * 8.5, o * 8.5, 0, 0, Math.PI * 2);
    e.fill();

    e.beginPath();
    e.moveTo(0, -o * 9.5);
    e.lineTo(o * 8.5, -o * 2.5);
    e.lineTo(o * 6, o * 7);
    e.lineTo(0, o * 9.5);
    e.lineTo(-o * 6, o * 7);
    e.lineTo(-o * 8.5, -o * 2.5);
    e.closePath();

    const baseGrad = e.createRadialGradient(0, 0, o * 1, 0, 0, o * 9);
    baseGrad.addColorStop(0, "#ea580c");
    baseGrad.addColorStop(0.4, "#dc2626");
    baseGrad.addColorStop(0.85, "#7f1d1d");
    baseGrad.addColorStop(1, "#18181b");
    e.fillStyle = baseGrad;
    e.fill();
    e.strokeStyle = "#450a0a";
    e.lineWidth = 1.2 * o;
    e.stroke();

    const pulse = 0.6 + 0.4 * Math.sin(u * 4);
    e.fillStyle = `rgba(251, 191, 36, ${0.4 * pulse})`;
    e.beginPath();
    e.moveTo(0, -o * 9.5);
    e.lineTo(o * 8.5, -o * 2.5);
    e.lineTo(0, 0);
    e.closePath();
    e.fill();

    e.strokeStyle = `rgba(254, 240, 138, ${pulse})`;
    e.lineWidth = 1.4 * o;
    e.beginPath();
    e.moveTo(0, -o * 9.5);
    e.lineTo(0, o * 9.5);
    e.moveTo(-o * 8.5, -o * 2.5);
    e.lineTo(o * 8.5, -o * 2.5);
    e.stroke();

    e.fillStyle = "#fef08a";
    e.beginPath();
    e.arc(0, 0, o * 1.6, 0, Math.PI * 2);
    e.fill();
    e.restore();
  }
  function xb(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    e.fillStyle = "rgba(0,0,0,0.35)";
    e.beginPath();
    e.ellipse(0, o * 2, o * 9, o * 7, -0.15, 0, Math.PI * 2);
    e.fill();

    const wGrad = e.createRadialGradient(-o * 5, -o * 5, o * 1, 0, 0, o * 10);
    wGrad.addColorStop(0, "#dc2626");
    wGrad.addColorStop(0.5, "#991b1b");
    wGrad.addColorStop(0.85, "#450a0a");
    wGrad.addColorStop(1, "#18181b");

    e.beginPath();
    e.moveTo(-o * 8, -o * 7);
    e.lineTo(o * 8.5, -o * 4);
    e.quadraticCurveTo(o * 5.5, o * 1, o * 5, o * 7);
    e.quadraticCurveTo(o * 2, o * 4, -o * 1, o * 8);
    e.quadraticCurveTo(-o * 4, o * 4.5, -o * 7, o * 7);
    e.quadraticCurveTo(-o * 6.5, 0, -o * 8, -o * 7);
    e.closePath();
    e.fillStyle = wGrad;
    e.fill();
    e.strokeStyle = "#450a0a";
    e.lineWidth = 1 * o;
    e.stroke();

    e.strokeStyle = "#f59e0b";
    e.lineWidth = 2 * o;
    e.lineCap = "round";
    e.beginPath();
    e.moveTo(-o * 8, -o * 7);
    e.lineTo(o * 8.5, -o * 4);
    e.moveTo(-o * 8, -o * 7);
    e.lineTo(o * 5, o * 7);
    e.moveTo(-o * 8, -o * 7);
    e.lineTo(-o * 1, o * 8);
    e.stroke();

    e.strokeStyle = "rgba(251, 191, 36, 0.4)";
    e.lineWidth = 0.8 * o;
    e.beginPath();
    e.moveTo(o * 2, -o * 4); e.lineTo(o * 3, o * 3);
    e.moveTo(-o * 3, -o * 4); e.lineTo(-o * 2, o * 3);
    e.stroke();

    e.fillStyle = "#fef08a";
    e.beginPath();
    e.arc(-o * 8, -o * 7, o * 1.8, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#b45309";
    e.lineWidth = 0.8 * o;
    e.stroke();
    e.restore();
  }
  function Db(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    e.fillStyle = "rgba(0,0,0,0.45)";
    e.beginPath();
    e.ellipse(o * 0.5, o * 3, o * 9, o * 6, 0.1, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = "#78350f";
    e.strokeStyle = "#451a03";
    e.lineWidth = 1 * o;
    e.beginPath();
    e.moveTo(-o * 5, -o * 4);
    e.quadraticCurveTo(-o * 9, -o * 8, -o * 10.5, -o * 9.5);
    e.quadraticCurveTo(-o * 7, -o * 6, -o * 3.5, -o * 3.5);
    e.closePath();
    e.fill();
    e.stroke();

    const skGrad = e.createLinearGradient(-o * 6, -o * 6, o * 8, o * 4);
    skGrad.addColorStop(0, "#f8fafc");
    skGrad.addColorStop(0.5, "#cbd5e1");
    skGrad.addColorStop(0.85, "#94a3b8");
    skGrad.addColorStop(1, "#475569");

    e.fillStyle = skGrad;
    e.beginPath();
    e.moveTo(-o * 5.5, -o * 3.5);
    e.lineTo(-o * 7, -o * 6.5);
    e.lineTo(-o * 2, -o * 5.5);
    e.lineTo(o * 4, -o * 2.5);
    e.lineTo(o * 8.5, -o * 0.5);
    e.lineTo(o * 7.5, o * 3);
    e.lineTo(o * 1, o * 2.5);
    e.lineTo(-o * 3.5, o * 4.5);
    e.closePath();
    e.fill();
    e.strokeStyle = "#334155";
    e.lineWidth = 1 * o;
    e.stroke();

    e.fillStyle = "#09090b";
    e.beginPath();
    e.ellipse(-o * 1.5, -o * 1.5, o * 2.2, o * 1.8, 0.2, 0, Math.PI * 2);
    e.fill();

    const eyeFlame = 0.6 + 0.4 * Math.sin(tm * 5);
    e.fillStyle = `rgba(249, 115, 22, ${eyeFlame})`;
    e.beginPath();
    e.arc(-o * 1.5, -o * 1.5, o * 1.2, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#fef08a";
    e.beginPath();
    e.arc(-o * 1.5, -o * 1.5, o * 0.6, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = "#ffffff";
    for (let c = 1.5; c <= 7.5; c += 1.8) {
      e.beginPath();
      e.moveTo((c - 0.7) * o, o * 2.3);
      e.lineTo(c * o, o * 4.8);
      e.lineTo((c + 0.7) * o, o * 2.3);
      e.closePath();
      e.fill();
    }

    e.strokeStyle = "#f59e0b";
    e.lineWidth = 0.9 * o;
    e.beginPath();
    e.moveTo(-o * 3, -o * 4.5);
    e.lineTo(-o * 0.5, -o * 3.5);
    e.lineTo(o * 2, -o * 1.5);
    e.stroke();

    e.restore();
  }
  function Ib(e, t, l, o, u, it, tm = 0) {
    e.save();
    e.translate(t, l);
    e.fillStyle = "rgba(0,0,0,0.25)";
    e.beginPath();
    e.ellipse(0, o * 2, o * 6, o * 7.5, 0, 0, Math.PI * 2);
    e.fill();

    e.strokeStyle = "#f59e0b";
    e.lineWidth = 1.6 * o;
    e.beginPath();
    e.arc(0, -o * 8.5, o * 2.2, 0, Math.PI * 2);
    e.stroke();

    const gCap = e.createLinearGradient(-o * 4, -o * 7, o * 4, -o * 4);
    gCap.addColorStop(0, "#b45309");
    gCap.addColorStop(0.3, "#fef08a");
    gCap.addColorStop(0.7, "#f59e0b");
    gCap.addColorStop(1, "#92400e");
    e.fillStyle = gCap;
    qRRect(e, -o * 4, -o * 7, o * 8, o * 3.5, o * 1);
    e.fill();
    e.strokeStyle = "#d97706";
    e.lineWidth = 0.8 * o;
    e.stroke();

    const pGrad = e.createLinearGradient(-o * 3, -o * 3.5, o * 3, o * 6);
    pGrad.addColorStop(0, "#ffffff");
    pGrad.addColorStop(0.6, "#f8fafc");
    pGrad.addColorStop(1, "#e2e8f0");
    e.fillStyle = pGrad;

    e.beginPath();
    e.moveTo(-o * 3.8, -o * 3.5);
    e.lineTo(o * 3.8, -o * 3.5);
    e.quadraticCurveTo(o * 5.5, o * 2, o * 4.5, o * 6);
    e.quadraticCurveTo(0, o * 8.5, -o * 4.5, o * 6);
    e.quadraticCurveTo(-o * 5.5, o * 2, -o * 3.8, -o * 3.5);
    e.closePath();
    e.fill();
    e.strokeStyle = "#cbd5e1";
    e.lineWidth = 0.9 * o;
    e.stroke();

    e.fillStyle = "#fda4af";
    e.beginPath();
    e.ellipse(0, o * 2.5, o * 1.8, o * 1.4, 0, 0, Math.PI * 2);
    e.fill();
    [[-o * 2.2, o * 5], [0, o * 5.8], [o * 2.2, o * 5]].forEach(([bx, by]) => {
      e.beginPath();
      e.ellipse(bx, by, o * 1.2, o * 1.4, 0, 0, Math.PI * 2);
      e.fill();
    });

    const starGlow = 0.6 + 0.4 * Math.sin(tm * 4);
    e.fillStyle = `rgba(254, 240, 138, ${starGlow})`;
    const sx = o * 4.5, sy = -o * 2.5;
    e.beginPath();
    e.moveTo(sx, sy - o * 2);
    e.lineTo(sx + o * 0.6, sy - o * 0.6);
    e.lineTo(sx + o * 2, sy);
    e.lineTo(sx + o * 0.6, sy + o * 0.6);
    e.lineTo(sx, sy + o * 2);
    e.lineTo(sx - o * 0.6, sy + o * 0.6);
    e.lineTo(sx - o * 2, sy);
    e.lineTo(sx - o * 0.6, sy - o * 0.6);
    e.closePath();
    e.fill();

    e.restore();
  }
  function gl(e) {
    return (
      e === "bat" ||
      // Criaturas do registro tem medo de fogo/tocha, exceto as com behavior.fearsFire === false (ex.: golem)
      (getCreature(e) !== null && creatureBehavior(e).fearsFire !== false)
    );
  }
