/* js/engine/render-props.js
 * Desenho dos props do cenario no canvas (rg...Pg), incluindo a fogueira (hg).
 * Trecho de legacy/app.original.js (linhas 18363-20124); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function drawTreeStump(e, t) {
    e.fillStyle = "rgba(0, 0, 0, 0.28)";
    e.beginPath();
    e.ellipse(0, 3 * t, 7.5 * t, 3.8 * t, 0, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = "#d4a373";
    e.beginPath();
    e.ellipse(-5 * t, 3 * t, 1.6 * t, 0.9 * t, 0.4, 0, Math.PI * 2);
    e.ellipse(5 * t, 2.5 * t, 1.8 * t, 0.8 * t, -0.3, 0, Math.PI * 2);
    e.ellipse(2 * t, 4 * t, 1.2 * t, 0.7 * t, 0.1, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = "#3d2215";
    e.beginPath();
    e.moveTo(-5.5 * t, 4 * t);
    e.quadraticCurveTo(-4.2 * t, 0, -3.8 * t, -4 * t);
    e.lineTo(3.8 * t, -4 * t);
    e.quadraticCurveTo(4.2 * t, 0, 5.5 * t, 4 * t);
    e.closePath();
    e.fill();

    e.fillStyle = "#5c3826";
    e.beginPath();
    e.moveTo(-3.8 * t, 2 * t);
    e.lineTo(-2.8 * t, -4 * t);
    e.lineTo(2.8 * t, -4 * t);
    e.lineTo(3.8 * t, 2 * t);
    e.closePath();
    e.fill();

    e.strokeStyle = "#29140a";
    e.lineWidth = 0.9 * t;
    e.beginPath();
    e.moveTo(-1.2 * t, 3 * t);
    e.lineTo(-1.2 * t, -3 * t);
    e.moveTo(1.2 * t, 3 * t);
    e.lineTo(1.2 * t, -3 * t);
    e.stroke();

    e.fillStyle = "#d4a373";
    e.strokeStyle = "#8b5e34";
    e.lineWidth = 0.9 * t;
    e.beginPath();
    e.ellipse(0, -4 * t, 3.8 * t, 1.8 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.stroke();

    e.beginPath();
    e.ellipse(0, -4 * t, 2 * t, 0.9 * t, 0, 0, Math.PI * 2);
    e.stroke();

    e.fillStyle = "#8b5e34";
    e.beginPath();
    e.arc(0, -4 * t, 0.6 * t, 0, Math.PI * 2);
    e.fill();
  }
  function drawPlacedWoodLog(e, t, count = 1) {
    const s = t;
    // Sombra suave no chão
    e.fillStyle = "rgba(0, 0, 0, 0.35)";
    e.beginPath();
    e.ellipse(0, 4 * s, 11 * s, 4.2 * s, 0, 0, Math.PI * 2);
    e.fill();

    const renderSingleLog = (offsetX, offsetY, angle, scaleMult = 1) => {
      e.save();
      e.translate(offsetX * s, offsetY * s);
      if (angle) e.rotate(angle);

      const logW = 20 * scaleMult;
      const logH = 6.2 * scaleMult;
      const halfW = logW * 0.5;
      const halfH = logH * 0.5;

      // Casca externa marrom escura e volumosa
      e.fillStyle = "#3d2215";
      e.beginPath();
      if (typeof e.roundRect === "function") {
        e.roundRect((-halfW) * s, (-halfH) * s, logW * s, logH * s, 2 * s);
      } else {
        e.rect((-halfW) * s, (-halfH) * s, logW * s, logH * s);
      }
      e.fill();

      // Textura e veios da casca
      e.fillStyle = "#5c3826";
      e.fillRect((-halfW + 3) * s, (-halfH + 1) * s, (logW - 6) * s, (halfH - 0.5) * s);
      e.fillStyle = "#271206";
      e.fillRect((-halfW + 2) * s, (halfH - 1.8) * s, (logW - 4) * s, 1.2 * s);

      // Linhas da casca
      e.strokeStyle = "#1c0d05";
      e.lineWidth = 0.8 * s;
      e.beginPath();
      e.moveTo((-halfW + 5) * s, 0);
      e.lineTo((-halfW + 11) * s, 0);
      e.moveTo((-halfW + 13) * s, 1 * s);
      e.lineTo((halfW - 3) * s, 1 * s);
      e.stroke();

      // Corte circular/elíptico da extremidade com anéis de crescimento
      e.fillStyle = "#d4a373";
      e.strokeStyle = "#8b5e34";
      e.lineWidth = 0.9 * s;
      e.beginPath();
      e.ellipse((-halfW) * s, 0, 2.2 * s * scaleMult, halfH * s, 0, 0, Math.PI * 2);
      e.fill();
      e.stroke();

      // Anel interno de crescimento
      e.beginPath();
      e.ellipse((-halfW) * s, 0, 1.1 * s * scaleMult, halfH * 0.55 * s, 0, 0, Math.PI * 2);
      e.stroke();

      // Miolo central
      e.fillStyle = "#5c3826";
      e.beginPath();
      e.arc((-halfW) * s, 0, 0.55 * s * scaleMult, 0, Math.PI * 2);
      e.fill();

      // Extremidade direita chanfrada
      e.fillStyle = "#2a150b";
      e.beginPath();
      e.ellipse((halfW) * s, 0, 1.4 * s * scaleMult, halfH * s, 0, 0, Math.PI * 2);
      e.fill();

      e.restore();
    };

    if (count <= 1) {
      renderSingleLog(0, 1, 0.05, 1);
    } else if (count === 2) {
      renderSingleLog(-1, 3, 0.04, 1);
      renderSingleLog(1, -1.8, -0.06, 0.96);
    } else {
      renderSingleLog(-2, 3.2, 0.05, 0.98);
      renderSingleLog(4, 2.8, -0.04, 0.96);
      renderSingleLog(0.5, -2.2, 0.02, 0.95);
      if (count > 3) {
        renderSingleLog(-0.5, -6.5, -0.05, 0.88);
      }
    }
  }
  function rg(e, t, l) {
    ((e.fillStyle = "#3d2215"),
      e.beginPath(),
      e.moveTo(-6 * t, 4 * t),
      e.quadraticCurveTo(-4 * t, -4 * t, -3.5 * t, -14 * t),
      e.lineTo(3.5 * t, -14 * t),
      e.quadraticCurveTo(4 * t, -4 * t, 6 * t, 4 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#5c3826"),
      e.beginPath(),
      e.moveTo(-4 * t, 2 * t),
      e.lineTo(-2.5 * t, -14 * t),
      e.lineTo(2.5 * t, -14 * t),
      e.lineTo(4 * t, 2 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#29140a"),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(-1 * t, 2 * t),
      e.lineTo(-1.2 * t, -12 * t),
      e.moveTo(1.2 * t, 2 * t),
      e.lineTo(1 * t, -10 * t),
      e.stroke());
    const o = Math.sin(l * 1.4 + t * 8) * 1.5 * t,
      u = Math.cos(l * 1.8 + t * 6) * 1.2 * t;
    ((e.fillStyle = "#113318"),
      e.beginPath(),
      e.arc(0 + o * 0.4, -22 * t, 22 * t, 0, Math.PI * 2),
      e.arc(-8 * t + o * 0.3, -24 * t, 16 * t, 0, Math.PI * 2),
      e.arc(8 * t + o * 0.3, -23 * t, 16 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#1b5228"),
      e.beginPath(),
      e.arc(-7 * t + o, -28 * t, 15 * t, 0, Math.PI * 2),
      e.arc(7 * t + u, -27 * t, 14 * t, 0, Math.PI * 2),
      e.arc(0 + o * 0.7, -33 * t, 16 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#266b34"),
      e.beginPath(),
      e.arc(-9 * t + o, -30 * t, 10 * t, 0, Math.PI * 2),
      e.arc(-2 * t + o * 0.8, -36 * t, 11 * t, 0, Math.PI * 2),
      e.arc(4 * t + u, -32 * t, 8 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#307a3e"),
      e.beginPath(),
      e.arc(-7 * t + o, -32 * t, 5 * t, 0, Math.PI * 2),
      e.arc(-3 * t + o * 0.8, -38 * t, 6 * t, 0, Math.PI * 2),
      e.arc(3 * t + u, -34 * t, 4 * t, 0, Math.PI * 2),
      e.fill());
  }
  function lg(e, t, l, o) {
    ((e.fillStyle = "#2e1c14"),
      e.fillRect(-3.5 * t, -12 * t, 7 * t, 16 * t),
      (e.fillStyle = "#452b1f"),
      e.fillRect(-2 * t, -12 * t, 4 * t, 16 * t));
    const u = [
      { y: -8 * t, w: 28 * t, h: 16 * t },
      { y: -19 * t, w: 22 * t, h: 15 * t },
      { y: -29 * t, w: 16 * t, h: 14 * t },
      { y: -38 * t, w: 10 * t, h: 12 * t },
    ];
    for (let m = 0; m < u.length; m++) {
      const c = u[m],
        f = Math.sin(o * 1.6 + m) * (0.8 + m * 0.4) * t;
      ((e.fillStyle = "#0b2d1c"),
        e.beginPath(),
        e.moveTo(-c.w / 2 + f * 0.5, c.y),
        e.lineTo(c.w / 2 + f * 0.5, c.y),
        e.lineTo(f, c.y - c.h),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#13462f"),
        e.beginPath(),
        e.moveTo(-c.w / 2 + f * 0.5, c.y - 2 * t));
      const g = 4;
      for (let y = 0; y <= g; y++) {
        const w = -c.w / 2 + (c.w / g) * y + f * 0.5,
          v = y % 2 === 0 ? c.y : c.y - 3 * t;
        e.lineTo(w, v);
      }
      (e.lineTo(f, c.y - c.h),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#1d5c3f"),
        e.beginPath(),
        e.moveTo(-c.w / 2 + f * 0.5, c.y - 2 * t),
        e.lineTo(f, c.y),
        e.lineTo(f, c.y - c.h),
        e.closePath(),
        e.fill(),
        l &&
          ((e.fillStyle = "#cbd5e1"),
          e.beginPath(),
          e.moveTo(-c.w * 0.38 + f * 0.5, c.y - c.h * 0.28),
          e.lineTo(c.w * 0.38 + f * 0.5, c.y - c.h * 0.28),
          e.lineTo(f, c.y - c.h),
          e.closePath(),
          e.fill(),
          (e.fillStyle = "#ffffff"),
          e.beginPath(),
          e.moveTo(-c.w * 0.32 + f * 0.5, c.y - c.h * 0.32),
          e.quadraticCurveTo(
            f,
            c.y - c.h * 0.25,
            c.w * 0.32 + f * 0.5,
            c.y - c.h * 0.32,
          ),
          e.lineTo(f, c.y - c.h),
          e.closePath(),
          e.fill()));
    }
  }
  function ig(e, t, l) {
    const o = Math.sin(l * 1.5) * 2.5 * t,
      u = 6 * t + o,
      m = -36 * t;
    ((e.strokeStyle = "#451a03"),
      (e.lineWidth = 6.5 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(0, 2 * t),
      e.quadraticCurveTo(8 * t, -18 * t, u, m),
      e.stroke(),
      (e.strokeStyle = "#78350f"),
      (e.lineWidth = 4.8 * t),
      e.stroke(),
      (e.fillStyle = "#9a3412"));
    for (let f = 0.2; f <= 0.85; f += 0.15) {
      const g = (1 - f) * (1 - f) * 0 + 2 * (1 - f) * f * (8 * t) + f * f * u,
        y =
          (1 - f) * (1 - f) * (2 * t) + 2 * (1 - f) * f * (-18 * t) + f * f * m;
      (e.beginPath(), e.arc(g, y, 3.2 * t, 0, Math.PI * 2), e.fill());
    }
    ((e.fillStyle = "#451a03"),
      e.beginPath(),
      e.arc(u - 2.5 * t, m + 3 * t, 2.5 * t, 0, Math.PI * 2),
      e.arc(u + 2.5 * t, m + 3.5 * t, 2.6 * t, 0, Math.PI * 2),
      e.arc(u, m + 5 * t, 2.8 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#78350f"),
      e.beginPath(),
      e.arc(u - 3 * t, m + 2.5 * t, 1.2 * t, 0, Math.PI * 2),
      e.arc(u + 2 * t, m + 3 * t, 1.2 * t, 0, Math.PI * 2),
      e.fill());
    const c = [
      { dx: -26 * t, dy: 10 * t, archY: -16 * t },
      { dx: 26 * t + o, dy: 12 * t, archY: -14 * t },
      { dx: -22 * t, dy: -12 * t, archY: -22 * t },
      { dx: 22 * t + o, dy: -10 * t, archY: -20 * t },
      { dx: -10 * t, dy: -24 * t, archY: -28 * t },
      { dx: 12 * t + o, dy: -24 * t, archY: -28 * t },
    ];
    for (const f of c) {
      const g = u + f.dx,
        y = m + f.dy,
        w = u + f.dx * 0.5,
        v = m + f.archY;
      ((e.strokeStyle = "#143d1f"),
        (e.lineWidth = 3.5 * t),
        e.beginPath(),
        e.moveTo(u, m),
        e.quadraticCurveTo(w, v, g, y),
        e.stroke(),
        (e.strokeStyle = "#1f592d"),
        (e.lineWidth = 2 * t),
        e.stroke(),
        (e.strokeStyle = "#164823"),
        (e.lineWidth = 1.4 * t));
      for (let T = 0.2; T <= 0.9; T += 0.15) {
        const S = (1 - T) * (1 - T) * u + 2 * (1 - T) * T * w + T * T * g,
          p = (1 - T) * (1 - T) * m + 2 * (1 - T) * T * v + T * T * y;
        (e.beginPath(),
          e.moveTo(S, p),
          e.lineTo(S + (f.dx > 0 ? 3 : -3) * t, p + 6 * t),
          e.stroke());
      }
    }
  }
  function ng(e, t, l) {
    ((e.fillStyle = "#2d1810"),
      e.beginPath(),
      e.moveTo(-6 * t, 4 * t),
      e.quadraticCurveTo(-3 * t, -4 * t, -4 * t, -16 * t),
      e.lineTo(4 * t, -16 * t),
      e.quadraticCurveTo(3 * t, -4 * t, 6 * t, 4 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#422416"),
      e.fillRect(-3 * t, -14 * t, 6 * t, 16 * t));
    const o = Math.sin(l * 1.3) * 1.5 * t;
    ((e.fillStyle = "#183018"),
      e.beginPath(),
      e.arc(0 + o * 0.5, -24 * t, 22 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#244824"),
      e.beginPath(),
      e.arc(-4 * t + o, -26 * t, 16 * t, 0, Math.PI * 2),
      e.arc(5 * t + o, -25 * t, 15 * t, 0, Math.PI * 2),
      e.fill());
    for (let u = -16; u <= 16; u += 4) {
      const m = Math.sin(l * 1.8 + u * 0.4) * 3 * t,
        c = (18 + Math.sin(u * 3) * 6) * t,
        f = e.createLinearGradient(u * t, -20 * t, u * t + m, -20 * t + c);
      (f.addColorStop(0, "rgba(48, 76, 22, 0.85)"),
        f.addColorStop(0.7, "rgba(68, 106, 32, 0.65)"),
        f.addColorStop(1, "rgba(84, 126, 40, 0.35)"),
        (e.strokeStyle = f),
        (e.lineWidth = 1.6 * t),
        e.beginPath(),
        e.moveTo(u * t, -20 * t),
        e.quadraticCurveTo(
          u * t + m * 0.5,
          -20 * t + c * 0.5,
          u * t + m,
          -20 * t + c,
        ),
        e.stroke());
    }
  }
  function sg(e, t, l) {
    ((e.strokeStyle = "#0c0a09"),
      (e.lineWidth = 4.5 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(0, 2 * t),
      e.lineTo(-2 * t, -22 * t),
      e.lineTo(-12 * t, -32 * t),
      e.moveTo(-2 * t, -16 * t),
      e.lineTo(10 * t, -28 * t),
      e.stroke());
    const o = (Math.sin(l * 4) + 1) * 0.5;
    ((e.fillStyle = `rgba(249, 115, 22, ${0.4 + o * 0.5})`),
      e.beginPath(),
      e.arc(-1.5 * t, -16 * t, 1.8 * t, 0, Math.PI * 2),
      e.fill());
  }
  function cg(e, t) {
    ((e.fillStyle = "#143d22"),
      e.beginPath(),
      e.roundRect(-4.5 * t, -28 * t, 9 * t, 32 * t, 4.5 * t),
      e.fill(),
      (e.fillStyle = "#1c552f"),
      e.beginPath(),
      e.roundRect(-4 * t, -28 * t, 6 * t, 31 * t, 4 * t),
      e.fill(),
      (e.fillStyle = "#26703f"),
      e.beginPath(),
      e.roundRect(-3.5 * t, -27 * t, 2.5 * t, 29 * t, 2 * t),
      e.fill(),
      (e.lineWidth = 3.5 * t),
      (e.strokeStyle = "#1c552f"),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(-4 * t, -16 * t),
      e.lineTo(-12 * t, -16 * t),
      e.lineTo(-12 * t, -24 * t),
      e.stroke(),
      e.beginPath(),
      e.moveTo(4 * t, -12 * t),
      e.lineTo(12 * t, -12 * t),
      e.lineTo(12 * t, -22 * t),
      e.stroke(),
      (e.fillStyle = "#d4b26f"));
    for (let l = -24; l <= -2; l += 6)
      (e.fillRect(-5.5 * t, l * t, 1.2 * t, 1 * t),
        e.fillRect(4.5 * t, l * t, 1.2 * t, 1 * t));
  }
  function dg(e, t, l, o) {
    let u = "#1e293b",
      m = "#475569",
      c = "#94a3b8",
      f = "#cbd5e1";
    (o === BiomeId.VOLCANIC
      ? ((u = "#0c0a09"), (m = "#262626"), (c = "#44403c"), (f = "#78716c"))
      : o === BiomeId.CANYON
        ? ((u = "#451a03"), (m = "#7c2d12"), (c = "#c2410c"), (f = "#fdba74"))
        : o === BiomeId.GLACIER
          ? ((u = "#0369a1"), (m = "#0284c7"), (c = "#7dd3fc"), (f = "#ffffff"))
          : (o === BiomeId.DESERT || o === BiomeId.BEACH) &&
            ((u = "#78350f"),
            (m = "#b45309"),
            (c = "#d97706"),
            (f = "#fde68a")),
      (e.fillStyle = u),
      e.beginPath(),
      e.moveTo(-11 * t, 2 * t),
      e.lineTo(11 * t, 2 * t),
      e.lineTo(12 * t, -4 * t),
      e.lineTo(4 * t, -12 * t),
      e.lineTo(-8 * t, -11 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = m),
      e.beginPath(),
      e.moveTo(-11 * t, 2 * t),
      e.lineTo(0, -5 * t),
      e.lineTo(4 * t, -12 * t),
      e.lineTo(-8 * t, -11 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = c),
      e.beginPath(),
      e.moveTo(-10 * t, 0),
      e.lineTo(-2 * t, -7 * t),
      e.lineTo(-4 * t, -12 * t),
      e.lineTo(-8 * t, -11 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = f),
      (e.lineWidth = 1.2 * t),
      e.beginPath(),
      e.moveTo(-8 * t, -11 * t),
      e.lineTo(-2 * t, -7 * t),
      e.lineTo(4 * t, -12 * t),
      e.stroke(),
      o !== BiomeId.VOLCANIC &&
      o !== BiomeId.DESERT &&
      o !== BiomeId.CANYON &&
      o !== BiomeId.GLACIER
        ? ((e.fillStyle = "#65a30d"),
          e.beginPath(),
          e.arc(-2 * t, -3 * t, 2.5 * t, 0, Math.PI * 2),
          e.arc(3 * t, -1 * t, 2 * t, 0, Math.PI * 2),
          e.fill())
        : o === BiomeId.VOLCANIC &&
          ((e.strokeStyle = "#ef4444"),
          (e.lineWidth = 1 * t),
          e.beginPath(),
          e.moveTo(-2 * t, 0),
          e.lineTo(2 * t, -4 * t),
          e.stroke()));
  }
  function ug(e, t, l, o) {
    const u = Math.sin(o * 3 + l * 10) * 0.8 * l;
    ((e.strokeStyle = "#15803d"),
      (e.lineWidth = 1.6 * l),
      e.beginPath(),
      e.moveTo(0, 3 * l),
      e.quadraticCurveTo(-1 * l, -2 * l, u, -8 * l),
      e.stroke(),
      (e.fillStyle = "#22c55e"),
      e.beginPath(),
      e.ellipse(-2 * l, -3 * l, 2.5 * l, 1.2 * l, -0.4, 0, Math.PI * 2),
      e.fill());
    let m = "#ef4444",
      c = "#fef08a";
    t === "flower_blue"
      ? ((m = "#38bdf8"), (c = "#ffffff"))
      : t === "flower_yellow" && ((m = "#eab308"), (c = "#78350f"));
    const f = u,
      g = -8 * l;
    e.fillStyle = m;
    for (let y = 0; y < Math.PI * 2; y += Math.PI / 2.5) {
      const w = f + Math.cos(y) * 3.2 * l,
        v = g + Math.sin(y) * 3.2 * l;
      (e.beginPath(), e.arc(w, v, 2.2 * l, 0, Math.PI * 2), e.fill());
    }
    ((e.fillStyle = c),
      e.beginPath(),
      e.arc(f, g, 1.8 * l, 0, Math.PI * 2),
      e.fill());
  }
  function drawBluePlant(e, t, l, o, isNight) {
    e.save();
    e.translate(0, 1 * l);
    e.strokeStyle = "#164e63";
    e.lineWidth = 2.2 * l;
    e.lineCap = "round";
    e.beginPath();
    e.moveTo(0, 3 * l);
    e.quadraticCurveTo(-1 * l, -3 * l, 0.5 * l, -11 * l);
    e.stroke();
    e.strokeStyle = "#2563eb";
    e.lineWidth = 1.5 * l;
    e.beginPath();
    e.moveTo(0, 1 * l);
    e.quadraticCurveTo(-5 * l, -2 * l, -7 * l, -6 * l);
    e.moveTo(0, -1 * l);
    e.quadraticCurveTo(5 * l, -4 * l, 7 * l, -8 * l);
    e.stroke();
    e.fillStyle = "#60a5fa";
    e.beginPath();
    e.ellipse(-5 * l, -5 * l, 3.2 * l, 1.4 * l, -0.55, 0, Math.PI * 2);
    e.ellipse(5 * l, -7 * l, 3.2 * l, 1.4 * l, 0.55, 0, Math.PI * 2);
    e.fill();
    if (isNight) {
      e.shadowColor = "#60a5fa";
      e.shadowBlur = 9 * l;
      e.fillStyle = "#2563eb";
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
        e.beginPath();
        e.arc(Math.cos(a) * 3.4 * l, -12 * l + Math.sin(a) * 3.4 * l, 2.5 * l, 0, Math.PI * 2);
        e.fill();
      }
      e.fillStyle = "#dbeafe";
      e.beginPath();
      e.arc(0, -12 * l, 1.8 * l, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
  }
  function fg(e, t) {
    ((e.fillStyle = "#e7e5e4"),
      e.beginPath(),
      e.roundRect(-2.5 * t, -7 * t, 5 * t, 9 * t, 2 * t),
      e.fill(),
      (e.fillStyle = "#b91c1c"),
      e.beginPath(),
      e.arc(0, -7 * t, 7 * t, Math.PI, 0),
      e.fill(),
      (e.fillStyle = "#ef4444"),
      e.beginPath(),
      e.arc(-1.5 * t, -8 * t, 5 * t, Math.PI, 0),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-3 * t, -10 * t, 1.2 * t, 0, Math.PI * 2),
      e.arc(2 * t, -11 * t, 1.4 * t, 0, Math.PI * 2),
      e.arc(0, -13 * t, 1 * t, 0, Math.PI * 2),
      e.fill());
  }
  function mg(e, t, l, o) {
    ((e.fillStyle = "#334155"),
      e.fillRect(-14 * t, -4 * t, 28 * t, 8 * t),
      (e.fillStyle = "#475569"),
      e.fillRect(-10 * t, -12 * t, 20 * t, 8 * t));
    const u = Math.sin(o * 2.5) * 3,
      m = -26 * t + u;
    (e.save(),
      (e.shadowColor = "#38bdf8"),
      (e.shadowBlur = 14),
      (e.fillStyle = "#38bdf8"),
      e.beginPath(),
      e.moveTo(0, m - 14 * t),
      e.lineTo(8 * t, m),
      e.lineTo(0, m + 14 * t),
      e.lineTo(-8 * t, m),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#e0f2fe"),
      e.beginPath(),
      e.moveTo(0, m - 14 * t),
      e.lineTo(0, m + 14 * t),
      e.lineTo(-8 * t, m),
      e.closePath(),
      e.fill(),
      e.restore(),
      (e.strokeStyle = "rgba(56, 189, 248, 0.6)"),
      (e.lineWidth = 1.5),
      e.beginPath(),
      e.ellipse(0, 0, 18 * t, 6 * t, 0, 0, Math.PI * 2),
      e.stroke());
  }
  function hg(e, t, l, o = !0, u, isSaveFire = false, rainTimer = 0) {
    for (let w = 0; w < Math.PI * 2; w += Math.PI / 4) {
      const v = Math.cos(w) * 8.5 * t,
        T = Math.sin(w) * 4.5 * t;
      ((e.fillStyle = "#27272a"),
        e.beginPath(),
        e.arc(v, T + 0.5 * t, 3.2 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#71717a"),
        e.beginPath(),
        e.arc(v - 0.8 * t, T - 0.8 * t, 2.2 * t, 0, Math.PI * 2),
        e.fill());
    }
    if (!o) {
      ((e.fillStyle = "#18181b"),
        e.beginPath(),
        e.ellipse(0, 1 * t, 5.8 * t, 2.8 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#27272a"),
        e.beginPath(),
        e.ellipse(0, 0.8 * t, 3.8 * t, 1.8 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#271206"),
        (e.lineWidth = 3.2 * t),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(-6 * t, 2.5 * t),
        e.lineTo(5.5 * t, -2.2 * t),
        e.moveTo(-5.5 * t, -2.2 * t),
        e.lineTo(6 * t, 2.5 * t),
        e.moveTo(-6.5 * t, 0),
        e.lineTo(6.5 * t, 0),
        e.stroke(),
        (e.strokeStyle = "#78350f"),
        (e.lineWidth = 2 * t),
        e.beginPath(),
        e.moveTo(-4.5 * t, 2.8 * t),
        e.lineTo(0, -5.5 * t),
        e.moveTo(4.5 * t, 2.8 * t),
        e.lineTo(0, -5.5 * t),
        e.moveTo(-2.2 * t, 3.2 * t),
        e.lineTo(-0.5 * t, -6 * t),
        e.moveTo(2.2 * t, 3.2 * t),
        e.lineTo(0.5 * t, -6 * t),
        e.moveTo(0, 3.5 * t),
        e.lineTo(0, -6 * t),
        e.stroke(),
        (e.strokeStyle = "#a16207"),
        (e.lineWidth = 1.2 * t),
        e.beginPath(),
        e.moveTo(-3.5 * t, 2.5 * t),
        e.lineTo(-0.2 * t, -5 * t),
        e.moveTo(3.5 * t, 2.5 * t),
        e.lineTo(0.2 * t, -5 * t),
        e.moveTo(-1.2 * t, 3 * t),
        e.lineTo(-0.2 * t, -5.8 * t),
        e.stroke(),
        (e.fillStyle = "#b45309"),
        e.fillRect(-1.5 * t, 0, 3 * t, 1.2 * t));
      return;
    }
    const m = Math.sin(l * 5) * 0.2 + 0.8;
    ((e.fillStyle = `rgba(234, 88, 12, ${0.7 * m})`),
      e.beginPath(),
      e.ellipse(0, 1 * t, 6 * t, 3 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = `rgba(254, 240, 138, ${0.85 * m})`),
      e.beginPath(),
      e.ellipse(0, 1 * t, 3.5 * t, 1.8 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#271206"),
      (e.lineWidth = 3.8 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(-6.5 * t, 3 * t),
      e.lineTo(6.5 * t, -2.5 * t),
      e.moveTo(-6.5 * t, -2.5 * t),
      e.lineTo(6.5 * t, 3 * t),
      e.stroke(),
      (e.strokeStyle = "#78350f"),
      (e.lineWidth = 2.4 * t),
      e.stroke());
    const c = Math.sin(l * 14) * 2.5 * t,
      f = (17 + Math.cos(l * 18) * 3.5) * t;
    if (isSaveFire) {
      // Fogo AZUL: marca visual do ponto de Salve atual (sem texto no mapa)
      (e.save(),
        (e.shadowColor = "#38bdf8"),
        (e.shadowBlur = 16),
        (e.fillStyle = "#0ea5e9"),
        e.beginPath(),
        e.moveTo(-5.5 * t, 1 * t),
        e.quadraticCurveTo(-4 * t, -f * 0.5, c, -f),
        e.quadraticCurveTo(4 * t, -f * 0.5, 5.5 * t, 1 * t),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#38bdf8"),
        e.beginPath(),
        e.moveTo(-3.5 * t, 1 * t),
        e.quadraticCurveTo(-2.5 * t, -f * 0.45, c * 0.6, -f * 0.78),
        e.quadraticCurveTo(2.5 * t, -f * 0.45, 3.5 * t, 1 * t),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#e0f2fe"),
        e.beginPath(),
        e.moveTo(-2 * t, 1 * t),
        e.quadraticCurveTo(-1 * t, -f * 0.3, c * 0.3, -f * 0.45),
        e.quadraticCurveTo(1 * t, -f * 0.3, 2 * t, 1 * t),
        e.closePath(),
        e.fill(),
        e.restore());
      // Faíscas azuis REMOVIDAS a pedido do jogador: fogueira de save deve ficar limpa (apenas o fogo azul).
    } else {
    (e.save(),
      (e.shadowColor = "#ea580c"),
      (e.shadowBlur = 14),
      (e.fillStyle = "#ea580c"),
      e.beginPath(),
      e.moveTo(-5.5 * t, 1 * t),
      e.quadraticCurveTo(-4 * t, -f * 0.5, c, -f),
      e.quadraticCurveTo(4 * t, -f * 0.5, 5.5 * t, 1 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#f59e0b"),
      e.beginPath(),
      e.moveTo(-3.5 * t, 1 * t),
      e.quadraticCurveTo(-2.5 * t, -f * 0.45, c * 0.6, -f * 0.78),
      e.quadraticCurveTo(2.5 * t, -f * 0.45, 3.5 * t, 1 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#fef08a"),
      e.beginPath(),
      e.moveTo(-2 * t, 1 * t),
      e.quadraticCurveTo(-1 * t, -f * 0.3, c * 0.3, -f * 0.45),
      e.quadraticCurveTo(1 * t, -f * 0.3, 2 * t, 1 * t),
      e.closePath(),
      e.fill(),
      e.restore());
    const g = Math.min(12, Math.round(4 + (t - 1) * 2.2));
    for (let w = 0; w < g; w++) {
      const v = (l * 3 + w * 1.3) % 3,
        T = Math.sin(l * 5 + w * 2) * (4 + w * 1.5) * t,
        S = -8 * t - v * 10 * t,
        p = Math.max(0, 1 - v / 3);
      ((e.fillStyle = `rgba(254, 215, 170, ${p})`),
        e.fillRect(T, S, 1.4 * t, 1.4 * t));
    }
    if (!isSaveFire && rainTimer > 0) {
      e.save();
      for (let s = 0; s < 3; s++) {
        const v = ((l * 2.2 + s * 1.2) % 2.4) / 2.4,
          sx = Math.sin(l * 3 + s) * 3.5 * t,
          sy = -6 * t - v * 13 * t,
          alpha = Math.max(0, (1 - v) * 0.42);
        e.fillStyle = `rgba(210, 220, 230, ${alpha})`;
        e.beginPath();
        e.arc(sx, sy, (2 + v * 3.2) * t, 0, Math.PI * 2);
        e.fill();
      }
      e.restore();
    }
    // REMOVIDO a pedido do jogador: fumaca em circulos girando sobre a fogueira (arcos cinza orbitando).
    if (u && u.roasting) {
      const rt = u.roasting,
        w = Date.now() - rt.startTime,
        v = w >= rt.durationMs,
        T = Math.min(1, Math.max(0, w / rt.durationMs)),
        S = Math.max(0, Math.ceil((rt.durationMs - w) / 1e3));
      e.save();
      const p = -13 * t,
        j = 13 * t,
        P = 2 * t,
        A = -12 * t;
      ((e.strokeStyle = "#2e1205"),
        (e.lineWidth = 2.4 * t),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(p, P),
        e.lineTo(p, A),
        e.lineTo(p - 3 * t, A - 3 * t),
        e.moveTo(p, A),
        e.lineTo(p + 2.5 * t, A - 3 * t),
        e.stroke(),
        e.beginPath(),
        e.moveTo(j, P),
        e.lineTo(j, A),
        e.lineTo(j - 2.5 * t, A - 3 * t),
        e.moveTo(j, A),
        e.lineTo(j + 3 * t, A - 3 * t),
        e.stroke(),
        (e.strokeStyle = "#854d0e"),
        (e.lineWidth = 1.3 * t),
        e.beginPath(),
        e.moveTo(p, P),
        e.lineTo(p, A),
        e.moveTo(j, P),
        e.lineTo(j, A),
        e.stroke(),
        (e.strokeStyle = "#3e1c05"),
        (e.lineWidth = 2.2 * t),
        e.beginPath(),
        e.moveTo(-16 * t, A),
        e.lineTo(16 * t, A),
        e.stroke(),
        (e.strokeStyle = "#a16207"),
        (e.lineWidth = 1.2 * t),
        e.beginPath(),
        e.moveTo(-16 * t, A),
        e.lineTo(16 * t, A),
        e.stroke());
      const x = t * 0.95,
        M = rt.fishItem.color || "#38bdf8",
        $ = v ? "#d97706" : T > 0.6 ? "#ca8a04" : M;
      if (
        (e.save(),
        e.translate(0, A),
        (e.fillStyle = $),
        e.beginPath(),
        e.ellipse(0, 0, 7.5 * x, 3.8 * x, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = v ? "#78350f" : "#0f172a"),
        (e.lineWidth = 1 * x),
        e.stroke(),
        (e.fillStyle = v ? "#92400e" : $),
        e.beginPath(),
        e.moveTo(-7.5 * x, 0),
        e.lineTo(-11.5 * x, -3.2 * x),
        e.lineTo(-9.5 * x, 0),
        e.lineTo(-11.5 * x, 3.2 * x),
        e.closePath(),
        e.fill(),
        e.stroke(),
        (e.fillStyle = "#1e293b"),
        e.beginPath(),
        e.arc(5 * x, -1 * x, 0.8 * x, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = v ? "#78350f" : "#64748b"),
        e.beginPath(),
        e.moveTo(-1 * x, -3.8 * x),
        e.lineTo(2 * x, -6 * x),
        e.lineTo(3 * x, -3.6 * x),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = v ? "#451a03" : "rgba(0,0,0,0.3)"),
        (e.lineWidth = 1.2 * x),
        e.beginPath(),
        e.moveTo(-3 * x, -2.5 * x),
        e.lineTo(-1.5 * x, 2.5 * x),
        e.moveTo(0, -2.5 * x),
        e.lineTo(1.5 * x, 2.5 * x),
        e.moveTo(3 * x, -2.5 * x),
        e.lineTo(4.5 * x, 2.5 * x),
        e.stroke(),
        v)
      ) {
        const K = (l * 2) % 1;
        ((e.fillStyle = "rgba(254, 240, 138, 0.6)"),
          e.beginPath(),
          e.arc(
            Math.sin(l * 3) * 2 * t,
            -5 * t - K * 6 * t,
            (1.5 + K * 2) * t,
            0,
            Math.PI * 2,
          ),
          e.fill());
      } else {
        const V = ((l * 4.5) % 1) * 9 * t;
        ((e.fillStyle = "#fef08a"), e.fillRect(-0.6 * t, V, 1.2 * t, 2 * t));
      }
      e.restore();
      const z = A - 11 * t;
      if (
        ((e.font = "bold 8px system-ui, sans-serif"),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        v)
      ) {
        const K = "🍢 PRONTO!",
          V = Math.sin(l * 6) * 0.15 + 0.85,
          O = 50 * t * V,
          _ = 14 * t;
        ((e.fillStyle = "rgba(22, 101, 52, 0.95)"),
          e.beginPath(),
          e.roundRect(-O / 2, z - _ / 2, O, _, 4 * t),
          e.fill(),
          (e.strokeStyle = "#4ade80"),
          (e.lineWidth = 1.2),
          e.stroke(),
          (e.fillStyle = "#ffffff"),
          e.fillText(K, 0, z));
      } else {
        const K = `⏳ ${S}s`,
          V = 40 * t,
          O = 13 * t;
        ((e.fillStyle = "rgba(15, 23, 42, 0.88)"),
          e.beginPath(),
          e.roundRect(-V / 2, z - O / 2, V, O, 4 * t),
          e.fill(),
          (e.strokeStyle = "#f59e0b"),
          (e.lineWidth = 1),
          e.stroke());
        const _ = (V - 4 * t) * T;
        ((e.fillStyle = "#f59e0b"),
          e.fillRect(-V / 2 + 2 * t, z + O / 2 - 2.5 * t, _, 1.8 * t),
          (e.fillStyle = "#fef08a"),
          e.fillText(K, 0, z - 1 * t));
      }
      e.restore();
    }
    }
    u && u.cookingPot && gG(e, t, l, o, u.cookingPot);
  }
  function gG(e, t, l, o = !0, u) {
    if (!u) return;
    const m = o ? 1 : 0.85,
      c = -2 * t * m,
      f = 6.2 * t * m,
      g = 4.2 * t * m,
      y = (u.potItem || {}).name || "",
      w = y.toLowerCase().includes("caldeirão") || y.toLowerCase().includes("caldeirao");
    e.save();
    e.translate(0, c);
    ((e.fillStyle = "rgba(0, 0, 0, 0.35)"),
      e.beginPath(),
      e.ellipse(0, g + 1.2 * t, f * 0.95, g * 0.42, 0, 0, Math.PI * 2),
      e.fill());
    if (w) {
      ((e.strokeStyle = "#1c1917"),
        (e.lineWidth = 1.6 * t),
        e.beginPath(),
        e.arc(0, -g * 0.2, f * 1.02, Math.PI * 1.12, Math.PI * 1.88),
        e.stroke());
    }
    ((e.fillStyle = w ? "#44403c" : "#57534e"),
      e.beginPath(),
      e.moveTo(-f, -g * 0.55),
      e.quadraticCurveTo(-f * 1.06, g * 0.9, -f * 0.62, g),
      e.lineTo(f * 0.62, g),
      e.quadraticCurveTo(f * 1.06, g * 0.9, f, -g * 0.55),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "rgba(255,255,255,0.12)"),
      e.beginPath(),
      e.ellipse(-f * 0.45, g * 0.15, f * 0.22, g * 0.55, 0.25, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = w ? "#292524" : "#44403c"),
      (e.lineWidth = 1.4 * t),
      e.beginPath(),
      e.moveTo(-f * 0.62, g),
      e.lineTo(f * 0.62, g),
      e.stroke(),
      (e.fillStyle = w ? "#292524" : "#3f3f46"),
      e.beginPath(),
      e.ellipse(0, -g * 0.55, f, g * 0.42, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = w ? "#1c1917" : "#27272a"),
      (e.lineWidth = 1.2 * t),
      e.stroke());
    const v = u.hasWater ? "#38bdf8" : "#d97706";
    ((e.fillStyle = u.hasWater ? "rgba(56, 189, 248, 0.85)" : "rgba(217, 119, 6, 0.9)"),
      e.beginPath(),
      e.ellipse(0, -g * 0.5, f * 0.78, g * 0.3, 0, 0, Math.PI * 2),
      e.fill());
    for (let T = 0; T < (u.ingredients || []).length; T++) {
      const S = u.ingredients[T],
        p = (S.name || "").toLowerCase(),
        j = p.includes("carne") || p.includes("meat") ? "#b91c1c" : p.includes("gosma") || p.includes("gelatina") ? "#4ade80" : v,
        P = Math.sin(T * 2.4) * f * 0.4,
        A = Math.cos(T * 1.7) * g * 0.12;
      ((e.fillStyle = j),
        e.beginPath(),
        e.ellipse(P, -g * 0.5 + A, 2.4 * t, 1.5 * t, 0, 0, Math.PI * 2),
        e.fill());
    }
    if (o) {
      const K = Date.now() - u.startTime,
        V = K >= 45e3,
        O = Math.min(1, Math.max(0, K / 45e3)),
        _ = Math.max(0, Math.ceil((45e3 - K) / 1e3));
      for (let ue = 0; ue < 4; ue++) {
        const se = ((l * (V ? 0.55 : 0.9) + ue * 0.25) % 1) * 26 * t,
          Ce = Math.sin(l * 2 + ue * 1.6) * 3.5 * t,
          na = (1.6 + se / 9) * t,
          ia = Math.max(0, 0.3 - (se / (26 * t)) * 0.3);
        ((e.fillStyle = `rgba(226, 232, 240, ${ia})`),
          e.beginPath(),
          e.arc(Ce, -g * 0.7 - se, na, 0, Math.PI * 2),
          e.fill());
      }
      e.font = `bold ${Math.max(7, 8 * t)}px system-ui, sans-serif`;
      ((e.textAlign = "center"), (e.textBaseline = "middle"));
      const Je = -g * 0.55 - 34 * t;
      if (V) {
        const he = "🍲 PRONTO! [R]",
          $e = Math.sin(l * 6) * 0.15 + 0.85,
          da = 78 * t * $e,
          ka = 14 * t;
        ((e.fillStyle = "rgba(22, 101, 52, 0.95)"),
          e.beginPath(),
          e.roundRect(-da / 2, Je - ka / 2, da, ka, 4 * t),
          e.fill(),
          (e.strokeStyle = "#4ade80"),
          (e.lineWidth = 1.2),
          e.stroke(),
          (e.fillStyle = "#ffffff"),
          e.fillText(he, 0, Je));
      } else {
        const he = `⏳ ${_}s`,
          $e = 44 * t,
          da = 13 * t;
        ((e.fillStyle = "rgba(15, 23, 42, 0.88)"),
          e.beginPath(),
          e.roundRect(-$e / 2, Je - da / 2, $e, da, 4 * t),
          e.fill(),
          (e.strokeStyle = "#f59e0b"),
          (e.lineWidth = 1),
          e.stroke());
        const ka = ($e - 4 * t) * O;
        ((e.fillStyle = "#f59e0b"),
          e.fillRect(-$e / 2 + 2 * t, Je + da / 2 - 2.5 * t, ka, 1.8 * t),
          (e.fillStyle = "#fef08a"),
          e.fillText(he, 0, Je - 1 * t));
      }
    }
    e.restore();
  }
  function pg(e, t, l = !1, o = 0) {
    if (
      ((e.fillStyle = "#451a03"),
      e.beginPath(),
      e.roundRect(-9.5 * t, -8.5 * t, 19 * t, 13 * t, 2 * t),
      e.fill(),
      (e.fillStyle = "#78350f"),
      e.fillRect(-9 * t, -8 * t, 18 * t, 12 * t),
      (e.strokeStyle = "#2e1205"),
      (e.lineWidth = 1 * t),
      e.beginPath(),
      e.moveTo(-9 * t, -4 * t),
      e.lineTo(9 * t, -4 * t),
      e.stroke(),
      (e.fillStyle = "#1e293b"),
      e.fillRect(-8 * t, -8 * t, 3 * t, 12 * t),
      e.fillRect(5 * t, -8 * t, 3 * t, 12 * t),
      (e.fillStyle = "#94a3b8"),
      e.fillRect(-7 * t, -7 * t, 1.2 * t, 1.2 * t),
      e.fillRect(-7 * t, -1 * t, 1.2 * t, 1.2 * t),
      e.fillRect(6 * t, -7 * t, 1.2 * t, 1.2 * t),
      e.fillRect(6 * t, -1 * t, 1.2 * t, 1.2 * t),
      l)
    ) {
      ((e.fillStyle = "#451a03"),
        e.beginPath(),
        e.moveTo(-10 * t, -8 * t),
        e.lineTo(-8 * t, -19 * t),
        e.lineTo(8 * t, -19 * t),
        e.lineTo(10 * t, -8 * t),
        e.closePath(),
        e.fill());
      const u = Math.sin(o * 4) * 0.15 + 0.85;
      ((e.fillStyle = `rgba(251, 191, 36, ${0.8 * u})`),
        e.beginPath(),
        e.ellipse(0, -6 * t, 6 * t, 3 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ffffff"),
        e.beginPath(),
        e.arc(-2 * t, -7 * t, 1.2 * t, 0, Math.PI * 2),
        e.arc(3 * t, -6 * t, 1.4 * t, 0, Math.PI * 2),
        e.fill());
    } else
      ((e.fillStyle = "#451a03"),
        e.beginPath(),
        e.roundRect(-10 * t, -15 * t, 20 * t, 8 * t, [4 * t, 4 * t, 0, 0]),
        e.fill(),
        (e.fillStyle = "#92400e"),
        e.beginPath(),
        e.roundRect(-9.5 * t, -14.5 * t, 19 * t, 7 * t, [3 * t, 3 * t, 0, 0]),
        e.fill(),
        (e.fillStyle = "#1e293b"),
        e.fillRect(-8 * t, -14.5 * t, 3 * t, 7 * t),
        e.fillRect(5 * t, -14.5 * t, 3 * t, 7 * t),
        (e.fillStyle = "#f59e0b"),
        e.beginPath(),
        e.roundRect(-2.5 * t, -9.5 * t, 5 * t, 5.5 * t, 1.5 * t),
        e.fill(),
        (e.fillStyle = "#1c1917"),
        e.beginPath(),
        e.arc(0, -7.5 * t, 1 * t, 0, Math.PI * 2),
        e.rect(-0.6 * t, -7.5 * t, 1.2 * t, 2 * t),
        e.fill());
  }
  function gg(e, t, l) {
    // Coluna Dórica Grega de Mármore Branco com caneluras verticais, capitel e hera
    e.save();
    // Base / Estilóbata de mármore em 2 degraus
    e.fillStyle = "#94a3b8";
    e.fillRect(-10.5 * t, -1.5 * t, 21 * t, 4.5 * t);
    e.fillStyle = "#e2e8f0";
    e.fillRect(-9.5 * t, -4 * t, 19 * t, 3 * t);
    e.strokeStyle = "#64748b";
    e.lineWidth = 0.9 * t;
    e.strokeRect(-9.5 * t, -4 * t, 19 * t, 3 * t);

    // Fuste da coluna (inteira quando l !== 1, ou semi-quebrada em ruína quando l === 1)
    const colH = l === 1 ? 18 * t : 26 * t;
    const topY = -4 * t - colH;
    const fusteGrad = e.createLinearGradient(-7.5 * t, 0, 7.5 * t, 0);
    fusteGrad.addColorStop(0, "#cbd5e1");
    fusteGrad.addColorStop(0.35, "#f8fafc");
    fusteGrad.addColorStop(0.75, "#e2e8f0");
    fusteGrad.addColorStop(1, "#94a3b8");
    e.fillStyle = fusteGrad;
    e.fillRect(-7.2 * t, topY, 14.4 * t, colH);

    // Caneluras clássicas gregas (sulcos verticais)
    e.strokeStyle = "rgba(100, 116, 139, 0.55)";
    e.lineWidth = 1.1 * t;
    for (const fx of [-4.5, -1.5, 1.5, 4.5]) {
      e.beginPath();
      e.moveTo(fx * t, topY + 2 * t);
      e.lineTo(fx * t, -4 * t);
      e.stroke();
    }

    if (l !== 1) {
      // Capitel Dórico (Equino + Ábaco com friso dourado helênico)
      e.fillStyle = "#e2e8f0";
      e.beginPath();
      e.moveTo(-7.5 * t, topY);
      e.lineTo(-10 * t, topY - 3 * t);
      e.lineTo(10 * t, topY - 3 * t);
      e.lineTo(7.5 * t, topY);
      e.closePath();
      e.fill();

      e.fillStyle = "#f8fafc";
      e.fillRect(-10.5 * t, topY - 6.5 * t, 21 * t, 3.8 * t);
      e.strokeStyle = "#d97706";
      e.lineWidth = 1.1 * t;
      e.strokeRect(-9.5 * t, topY - 5.5 * t, 19 * t, 1.8 * t);
    } else {
      // Topo fraturado em diagonal de coluna grega arruinada
      e.fillStyle = "#cbd5e1";
      e.beginPath();
      e.moveTo(-7.2 * t, topY);
      e.lineTo(-3 * t, topY - 3.5 * t);
      e.lineTo(2 * t, topY - 1 * t);
      e.lineTo(7.2 * t, topY - 4 * t);
      e.lineTo(7.2 * t, topY);
      e.closePath();
      e.fill();
    }

    // Hera mediterrânea subindo pela coluna
    e.fillStyle = "#15803d";
    e.beginPath();
    e.arc(-5.5 * t, -10 * t, 2.6 * t, 0, Math.PI * 2);
    e.arc(-4 * t, -14 * t, 2.2 * t, 0, Math.PI * 2);
    e.arc(-2.5 * t, -17.5 * t, 1.8 * t, 0, Math.PI * 2);
    e.fill();
    e.restore();
  }
  function drawGreekRuinWall25D(e, t, subType = 0, neighbors = null, wallHeightState = 0) {
    const nL = !!(neighbors && neighbors.left),
      nR = !!(neighbors && neighbors.right),
      nT = !!(neighbors && neighbors.top),
      nB = !!(neighbors && neighbors.bottom),
      st = Math.abs(subType || 0) % 4,
      hs = Math.abs(wallHeightState || 0) % 4;

    // [PERF] Cacheia todos os estados das paredes 2.5D das ruínas gregas em canvas offscreen!
    if (!drawGreekRuinWall25D._cache) {
      drawGreekRuinWall25D._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nT ? 4 : 0) | (nB ? 8 : 0);
    const key = `${t.toFixed(3)}_${mask}_${st}_${hs}`;
    let cached = drawGreekRuinWall25D._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(22 * t);
      const padTop = Math.ceil(50 * t);
      const padBot = Math.ceil(32 * t);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * t,
          leftX = nL ? -half - 1 * t : -half + 1 * t,
          rightX = nR ? half + 1 * t : half - 1 * t,
          w = rightX - leftX,
          wallH =
            hs === 3
              ? 7.5 * t
              : hs === 2
                ? 14.5 * t
                : hs === 1
                  ? 22 * t
                  : 26 * t,
          baseY = 18 * t,
          topFrontY = baseY - wallH,
          topBackY = -half - wallH;

        if (!nB) {
          wc.fillStyle = "rgba(2, 6, 23, 0.58)";
          wc.fillRect(leftX - 1 * t, baseY - 2 * t, w + 2 * t, (hs >= 2 ? 6 : 9.5) * t);
        }

        const frontGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
        frontGrad.addColorStop(0, "#ffffff");
        frontGrad.addColorStop(0.55, "#f1f5f9");
        frontGrad.addColorStop(1, "#cbd5e1");
        wc.fillStyle = frontGrad;

        if (hs === 0) {
          wc.fillRect(leftX, topFrontY, w, wallH);
        } else {
          wc.beginPath();
          wc.moveTo(leftX, baseY);
          wc.lineTo(leftX, topFrontY + (st === 1 ? 4 * t : 1 * t));
          wc.lineTo(leftX + w * 0.28, topFrontY + (st === 1 ? 4 * t : 1 * t));
          wc.lineTo(leftX + w * 0.32, topFrontY - (st === 2 ? 2.5 * t : -3.5 * t));
          wc.lineTo(leftX + w * 0.68, topFrontY - (st === 2 ? 2.5 * t : -3.5 * t));
          wc.lineTo(leftX + w * 0.72, topFrontY + (st === 0 ? 3.5 * t : 0));
          wc.lineTo(rightX, topFrontY + (st === 0 ? 3.5 * t : 0));
          wc.lineTo(rightX, baseY);
          wc.closePath();
          wc.fill();
        }

        wc.fillStyle = "#1e293b";
        wc.fillRect(leftX, baseY - 3.8 * t, w, 3.8 * t);
        wc.fillStyle = "#d97706";
        wc.fillRect(leftX, baseY - 4.8 * t, w, 1.1 * t);

        wc.strokeStyle = "rgba(51, 65, 85, 0.65)";
        wc.lineWidth = 1.2 * t;
        wc.beginPath();
        if (hs <= 1) {
          wc.moveTo(leftX, topFrontY + 8.5 * t);
          wc.lineTo(rightX, topFrontY + 8.5 * t);
          wc.moveTo(0, topFrontY + 8.5 * t);
          wc.lineTo(0, topFrontY + 17 * t);
        }
        if (hs <= 2) {
          wc.moveTo(leftX, baseY - 8.5 * t);
          wc.lineTo(rightX, baseY - 8.5 * t);
          wc.moveTo(-6 * t, baseY - 8.5 * t);
          wc.lineTo(-6 * t, baseY - 4 * t);
        }
        wc.stroke();

        if (hs === 0 || (hs === 1 && st !== 1)) {
          const friezeW = hs === 1 ? w * 0.62 : w;
          const friezeX = hs === 1 ? leftX + w * 0.18 : leftX;
          wc.fillStyle = "#0369a1";
          wc.fillRect(friezeX, topFrontY + 2 * t, friezeW, 4.4 * t);
          wc.strokeStyle = "#fbbf24";
          wc.lineWidth = 1.2 * t;
          wc.beginPath();
          wc.moveTo(friezeX, topFrontY + 2 * t);
          wc.lineTo(friezeX + friezeW, topFrontY + 2 * t);
          wc.moveTo(friezeX, topFrontY + 6.4 * t);
          wc.lineTo(friezeX + friezeW, topFrontY + 6.4 * t);
          wc.stroke();
        }

        const topDepth = topFrontY - topBackY;
        if (hs === 0) {
          wc.fillStyle = "#334155";
          wc.fillRect(leftX, topBackY, w, topDepth + 1.5 * t);
          wc.strokeStyle = "#f8fafc";
          wc.lineWidth = 1.6 * t;
          wc.strokeRect(leftX + 0.8 * t, topBackY + 0.8 * t, w - 1.6 * t, topDepth - 0.5 * t);
          wc.strokeStyle = "#fbbf24";
          wc.lineWidth = 0.9 * t;
          wc.strokeRect(leftX + 2.5 * t, topBackY + 2.5 * t, w - 5 * t, topDepth - 4 * t);
        } else {
          wc.fillStyle = "#1e293b";
          wc.fillRect(leftX + 1 * t, topBackY + 2.5 * t, w - 2 * t, topDepth - 2 * t);
          wc.fillStyle = "#e2e8f0";
          wc.fillRect(leftX + 1.5 * t, topBackY + 3.5 * t, w * 0.4, topDepth - 4 * t);
          wc.fillStyle = "#ffffff";
          wc.fillRect(leftX + w * 0.42, topBackY + (st === 2 ? 0.5 * t : 5 * t), w * 0.46, topDepth - 4 * t);
          wc.strokeStyle = "#0f172a";
          wc.lineWidth = 1.3 * t;
          wc.strokeRect(leftX + 1 * t, topBackY + 2.5 * t, w - 2 * t, topDepth - 2 * t);
          wc.fillStyle = "#94a3b8";
          wc.beginPath();
          wc.arc(leftX + w * 0.22, topFrontY - 4 * t, 2.8 * t, 0, Math.PI * 2);
          wc.arc(leftX + w * 0.78, topFrontY - 2.5 * t, 2.4 * t, 0, Math.PI * 2);
          wc.fill();
        }

        if (st === 1 || hs === 2) {
          wc.fillStyle = "#15803d";
          wc.beginPath();
          wc.arc(-5 * t, baseY - 6 * t, 3 * t, 0, Math.PI * 2);
          wc.arc(-2 * t, baseY - 9 * t, 2.3 * t, 0, Math.PI * 2);
          wc.fill();
        } else if (st === 2 || hs === 1) {
          wc.strokeStyle = "rgba(71, 85, 105, 0.75)";
          wc.lineWidth = 1.2 * t;
          wc.beginPath();
          wc.moveTo(-3 * t, topFrontY + 4 * t);
          wc.lineTo(0, topFrontY + 10 * t);
          wc.lineTo(-2 * t, baseY - 2 * t);
          wc.stroke();
        }

        if (!nL) {
          wc.fillStyle = "#94a3b8";
          wc.fillRect(leftX, topBackY + (hs > 0 ? 3 * t : 0), 2 * t, baseY - topBackY);
        }
        if (!nR) {
          wc.fillStyle = "#94a3b8";
          wc.fillRect(rightX - 2 * t, topBackY + (hs > 0 ? 3 * t : 0), 2 * t, baseY - topBackY);
        }
      }

      cached = { canvas: can, padX, padTop };
      drawGreekRuinWall25D._cache.set(key, cached);
    }

    e.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  function drawGreekStatue(e, t, subType = 0, animTimer = 0) {
    e.save();
    // Pedestal escalonado de mármore com friso dourado
    e.fillStyle = "#94a3b8";
    e.fillRect(-11 * t, -1 * t, 22 * t, 5 * t);
    e.fillStyle = "#e2e8f0";
    e.fillRect(-9.5 * t, -7 * t, 19 * t, 6.5 * t);
    e.strokeStyle = "#d97706";
    e.lineWidth = 1 * t;
    e.strokeRect(-8.5 * t, -6 * t, 17 * t, 4.5 * t);

    if (subType === 0) {
      // Estátua Monumental de Atena Parthenos (com elmo coríntio, lança dourada e escudo Égide)
      e.fillStyle = "#f8fafc";
      // Peplos / Túnica drapeada
      e.beginPath();
      e.moveTo(-5.5 * t, -7 * t);
      e.lineTo(-4.5 * t, -25 * t);
      e.lineTo(4.5 * t, -25 * t);
      e.lineTo(5.5 * t, -7 * t);
      e.closePath();
      e.fill();
      e.strokeStyle = "#94a3b8";
      e.lineWidth = 0.9 * t;
      e.stroke();
      // Cabeça + Elmo com crista dourada
      e.fillStyle = "#f1f5f9";
      e.beginPath();
      e.arc(0, -28 * t, 3.6 * t, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#fbbf24";
      e.beginPath();
      e.arc(0, -30 * t, 3.8 * t, Math.PI, 0);
      e.fill();
      e.fillRect(-1.2 * t, -34 * t, 2.4 * t, 4 * t);
      // Escudo redondo grego (Hoplon) ao lado
      e.fillStyle = "#d97706";
      e.beginPath();
      e.ellipse(-6.5 * t, -15 * t, 3.5 * t, 6.5 * t, -0.1, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = "#fef08a";
      e.lineWidth = 1.1 * t;
      e.stroke();
      // Lança Dourada
      e.strokeStyle = "#b45309";
      e.lineWidth = 1.5 * t;
      e.beginPath();
      e.moveTo(6.5 * t, -7 * t);
      e.lineTo(6.5 * t, -35 * t);
      e.stroke();
      const glow = (Math.sin(animTimer * 3) + 1) * 0.5;
      e.fillStyle = `rgba(254, 240, 138, ${0.65 + glow * 0.35})`;
      e.beginPath();
      e.moveTo(6.5 * t, -39 * t);
      e.lineTo(4.5 * t, -34 * t);
      e.lineTo(8.5 * t, -34 * t);
      e.closePath();
      e.fill();
    } else if (subType === 1) {
      // Estátua de Filósofo / Orador com Himation (manto) e pergaminho
      e.fillStyle = "#f1f5f9";
      e.fillRect(-4.8 * t, -23 * t, 9.6 * t, 16 * t);
      // Dobra diagonal do manto grego
      e.strokeStyle = "#0284c7";
      e.lineWidth = 1.6 * t;
      e.beginPath();
      e.moveTo(-4.5 * t, -22 * t);
      e.lineTo(4.5 * t, -12 * t);
      e.stroke();
      // Cabeça barbada clássica
      e.fillStyle = "#f8fafc";
      e.beginPath();
      e.arc(0, -26.5 * t, 3.5 * t, 0, Math.PI * 2);
      e.fill();
      // Rolo de pergaminho na mão
      e.fillStyle = "#fef3c7";
      e.fillRect(3.5 * t, -19 * t, 3.5 * t, 2.2 * t);
    } else {
      // Estátua em Ruínas / Torso Esculpido Inacabado (sem um braço, estilo arqueológico)
      e.fillStyle = "#e2e8f0";
      e.beginPath();
      e.moveTo(-5 * t, -7 * t);
      e.lineTo(-4 * t, -19 * t);
      e.lineTo(1 * t, -21 * t);
      e.lineTo(4.5 * t, -17 * t);
      e.lineTo(4.5 * t, -7 * t);
      e.closePath();
      e.fill();
      // Fragmento da cabeça/busto caído na base do pedestal
      e.fillStyle = "#cbd5e1";
      e.beginPath();
      e.arc(7.5 * t, 1 * t, 3.2 * t, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
  }

  function drawGreekVaseCluster(e, t, subType = 0) {
    e.save();
    // Sombra
    e.fillStyle = "rgba(15, 23, 42, 0.3)";
    e.beginPath();
    e.ellipse(0, 3 * t, 11 * t, 5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Ânfora Grega Principal de Terracota (Figuras Negras)
    e.fillStyle = "#c2410c";
    e.beginPath();
    e.ellipse(-2 * t, -4 * t, 5.5 * t, 7.5 * t, 0, 0, Math.PI * 2);
    e.fill();
    // Faixa preta helênica no bojo do vaso
    e.fillStyle = "#1c1917";
    e.fillRect(-7 * t, -6 * t, 10 * t, 3.5 * t);
    e.strokeStyle = "#f59e0b";
    e.lineWidth = 0.9 * t;
    e.beginPath();
    e.moveTo(-7 * t, -4.2 * t);
    e.lineTo(3 * t, -4.2 * t);
    e.stroke();
    // Gargalo e 2 alças curvas da ânfora
    e.fillStyle = "#ea580c";
    e.fillRect(-4 * t, -14 * t, 4 * t, 4 * t);
    e.strokeStyle = "#9a3412";
    e.lineWidth = 1.4 * t;
    e.beginPath();
    e.arc(-5 * t, -10.5 * t, 2.5 * t, Math.PI * 0.5, Math.PI * 1.5);
    e.arc(1 * t, -10.5 * t, 2.5 * t, -Math.PI * 0.5, Math.PI * 0.5);
    e.stroke();

    // Segundo vaso ao lado (Krater larga ou ânfora tombada/quebrada)
    if (subType === 1) {
      // Krater de misturar vinho nos banquetes
      e.fillStyle = "#9a3412";
      e.beginPath();
      e.ellipse(6 * t, -2 * t, 5 * t, 4.5 * t, 0, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#1c1917";
      e.beginPath();
      e.ellipse(6 * t, -5.5 * t, 5.5 * t, 1.8 * t, 0, 0, Math.PI * 2);
      e.fill();
    } else {
      // Jarro menor / cacos de cerâmica no chão
      e.fillStyle = "#ea580c";
      e.beginPath();
      e.ellipse(5.5 * t, 0 * t, 4.2 * t, 3 * t, 0.35, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
  }

  function drawGreekFurniture(e, t, subType = 0) {
    e.save();
    if (subType === 0) {
      // Kline: Divã / Cama grega de banquete e repouso com tecido azul/púrpura e almofadas douradas
      e.fillStyle = "#78350f";
      e.fillRect(-12 * t, -2 * t, 24 * t, 3.5 * t);
      e.fillRect(-11 * t, 1.5 * t, 2.5 * t, 5 * t);
      e.fillRect(8.5 * t, 1.5 * t, 2.5 * t, 5 * t);
      // Colchão e manto helênico
      e.fillStyle = "#f8fafc";
      e.fillRect(-11.5 * t, -6.5 * t, 23 * t, 4.8 * t);
      e.fillStyle = "#0284c7";
      e.fillRect(-8 * t, -6.5 * t, 16 * t, 3.5 * t);
      // Cabeceira curva com almofada real
      e.fillStyle = "#fbbf24";
      e.beginPath();
      e.ellipse(-8.5 * t, -8 * t, 3.8 * t, 2.4 * t, -0.2, 0, Math.PI * 2);
      e.fill();
    } else if (subType === 1) {
      // Trapeza: Mesa grega de madeira e bronze posta com taças Kylix e oferendas
      e.fillStyle = "#92400e";
      e.fillRect(-10 * t, -5 * t, 20 * t, 3 * t);
      e.fillStyle = "#451a03";
      e.fillRect(-8.5 * t, -2 * t, 2.2 * t, 6.5 * t);
      e.fillRect(6.3 * t, -2 * t, 2.2 * t, 6.5 * t);
      // Taça Kylix dourada e prato de frutas sobre a mesa
      e.fillStyle = "#fbbf24";
      e.beginPath();
      e.arc(-4 * t, -6.8 * t, 2.2 * t, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#dc2626";
      e.beginPath();
      e.arc(3.5 * t, -6.5 * t, 2.4 * t, 0, Math.PI * 2);
      e.fill();
    } else if (subType === 3) {
      // Bema: Tribuna oratória de mármore esculpido no Bouleuterion
      e.fillStyle = "#cbd5e1";
      e.fillRect(-11 * t, -2 * t, 22 * t, 6 * t);
      e.fillStyle = "#f8fafc";
      e.fillRect(-8 * t, -13 * t, 16 * t, 11 * t);
      e.strokeStyle = "#d97706";
      e.lineWidth = 1.1 * t;
      e.strokeRect(-7 * t, -12 * t, 14 * t, 9 * t);
    } else {
      // Bancada de Mármore do Bouleuterion / Assento Klismos
      e.fillStyle = "#94a3b8";
      e.fillRect(-12 * t, 0 * t, 24 * t, 4.5 * t);
      e.fillStyle = "#f1f5f9";
      e.fillRect(-13 * t, -4.5 * t, 26 * t, 5 * t);
      e.strokeStyle = "#64748b";
      e.lineWidth = 1 * t;
      e.strokeRect(-13 * t, -4.5 * t, 26 * t, 5 * t);
    }
    e.restore();
  }

  function drawGreekDoor(e, t, isVertical = !1, isOpen = !1) {
    e.save();
    if (isVertical) {
      // =======================================================================
      // PORTA EM PAREDE ESQUERDA / DIREITA (Parede Vertical Norte-Sul):
      // Alinhada na vertical conectando a parede de cima (y = -18*t) com a
      // parede de baixo (y = +18*t), com passagem Leste-Oeste!
      // =======================================================================
      const half = 18 * t,
        wallH = 26 * t,
        baseY = 18 * t,
        topBackY = -half - wallH;

      // 1. Soleira de mármore no piso (orientada Norte-Sul sob o vão da parede vertical)
      e.fillStyle = "#cbd5e1";
      e.fillRect(-10 * t, -18 * t, 20 * t, 36 * t);
      e.strokeStyle = "#64748b";
      e.lineWidth = 1 * t;
      e.strokeRect(-10 * t, -18 * t, 20 * t, 36 * t);

      // 2. Pilar / Batente Norte de Mármore (conecta com a parede de cima em y = -18*t)
      e.fillStyle = "#e2e8f0";
      e.fillRect(-7 * t, -18 * t - wallH, 14 * t, 9 * t + wallH);
      e.fillStyle = "#334155";
      e.fillRect(-7 * t, topBackY, 14 * t, 9 * t);
      e.strokeStyle = "#f8fafc";
      e.lineWidth = 1.2 * t;
      e.strokeRect(-6.5 * t, topBackY + 0.5 * t, 13 * t, 8 * t);

      if (!isOpen) {
        // 3. Folhas da Porta de Cedro e Bronze FECHADAS na vertical (bloqueando a passagem Leste-Oeste)
        // Face lateral/frontal da porta vertical
        e.fillStyle = "#78350f";
        e.fillRect(-4.5 * t, -9 * t - wallH, 9 * t, 20 * t + wallH);
        // Topo da folha da porta de madeira e bronze visto de cima
        e.fillStyle = "#451a03";
        e.fillRect(-4.5 * t, -9 * t - wallH, 9 * t, 20 * t);
        // Travessas e cravos de bronze helênico ao longo da porta vertical
        e.fillStyle = "#d97706";
        e.fillRect(-5 * t, -4 * t - wallH * 0.65, 10 * t, 2.2 * t);
        e.fillRect(-5 * t, 4 * t - wallH * 0.65, 10 * t, 2.2 * t);
        e.fillRect(-5 * t, -2 * t - wallH * 0.25, 10 * t, 2.2 * t);
        e.fillRect(-5 * t, 6 * t - wallH * 0.25, 10 * t, 2.2 * t);
        // Argolas de bronze no centro
        e.beginPath();
        e.arc(0, -wallH * 0.45, 1.8 * t, 0, Math.PI * 2);
        e.arc(0, 3.5 * t - wallH * 0.45, 1.8 * t, 0, Math.PI * 2);
        e.fill();
      } else {
        // 3. Folhas da Porta ABERTAS (rebatidas para o lado Leste/Oeste, liberando a passagem no centro!)
        e.fillStyle = "#78350f";
        // Folha norte aberta para o lado
        e.fillRect(4 * t, -11 * t - wallH * 0.85, 10 * t, 3.5 * t + wallH * 0.75);
        // Folha sul aberta para o lado
        e.fillRect(4 * t, 7.5 * t - wallH * 0.85, 10 * t, 3.5 * t + wallH * 0.75);
        e.fillStyle = "#d97706";
        e.fillRect(4 * t, -11 * t - wallH * 0.85, 10 * t, 1.5 * t);
        e.fillRect(4 * t, 7.5 * t - wallH * 0.85, 10 * t, 1.5 * t);
      }

      // 4. Pilar / Batente Sul de Mármore (conecta com a parede de baixo em y = +18*t)
      e.fillStyle = "#f1f5f9";
      e.fillRect(-7 * t, 9 * t - wallH, 14 * t, 9 * t + wallH);
      e.fillStyle = "#1e293b";
      e.fillRect(-7 * t, baseY - 3.5 * t, 14 * t, 3.5 * t);
      e.fillStyle = "#334155";
      e.fillRect(-7 * t, 9 * t - wallH, 14 * t, 9 * t);
      e.strokeStyle = "#f8fafc";
      e.lineWidth = 1.2 * t;
      e.strokeRect(-6.5 * t, 9.5 * t - wallH, 13 * t, 8 * t);

      // 5. Lintel / Arquitrave Superior orientado na VERTICAL (Norte-Sul) ligando os dois batentes por cima!
      e.fillStyle = "#334155";
      e.fillRect(-8 * t, topBackY - 3 * t, 16 * t, 36 * t);
      e.strokeStyle = "#f8fafc";
      e.lineWidth = 1.4 * t;
      e.strokeRect(-7 * t, topBackY - 2 * t, 14 * t, 34 * t);
      e.strokeStyle = "#d97706";
      e.lineWidth = 1 * t;
      e.strokeRect(-5 * t, topBackY, 10 * t, 30 * t);

      e.restore();
      return;
    }

    // =========================================================================
    // PORTA EM PAREDE DE CIMA / BAIXO (Parede Horizontal Leste-Oeste):
    // =========================================================================
    // Soleira de mármore no chão
    e.fillStyle = "#cbd5e1";
    e.fillRect(-16 * t, -6 * t, 32 * t, 14 * t);
    e.strokeStyle = "#64748b";
    e.lineWidth = 1 * t;
    e.strokeRect(-16 * t, -6 * t, 32 * t, 14 * t);

    // Batentes laterais (ombreiras de mármore dórico)
    e.fillStyle = "#e2e8f0";
    e.fillRect(-16 * t, -26 * t, 4.5 * t, 30 * t);
    e.fillRect(11.5 * t, -26 * t, 4.5 * t, 30 * t);
    // Lintel / Arquitrave superior com friso dourado
    e.fillStyle = "#f8fafc";
    e.fillRect(-17.5 * t, -30 * t, 35 * t, 5 * t);
    e.strokeStyle = "#d97706";
    e.lineWidth = 1.1 * t;
    e.strokeRect(-16.5 * t, -29 * t, 33 * t, 3 * t);

    if (!isOpen) {
      // Folhas duplas de cedro e bronze fechadas
      e.fillStyle = "#78350f";
      e.fillRect(-11.5 * t, -25 * t, 11.2 * t, 27 * t);
      e.fillRect(0.3 * t, -25 * t, 11.2 * t, 27 * t);
      // Faixas e argolas de bronze helênico
      e.fillStyle = "#d97706";
      e.fillRect(-11 * t, -20 * t, 22 * t, 2 * t);
      e.fillRect(-11 * t, -8 * t, 22 * t, 2 * t);
      e.beginPath();
      e.arc(-2.5 * t, -14 * t, 1.8 * t, 0, Math.PI * 2);
      e.arc(2.5 * t, -14 * t, 1.8 * t, 0, Math.PI * 2);
      e.fill();
    } else {
      // Folhas da porta abertas em escorço nas laterais permitindo passagem livre
      e.fillStyle = "#78350f";
      e.fillRect(-11.5 * t, -25 * t, 3.5 * t, 25 * t);
      e.fillRect(8 * t, -25 * t, 3.5 * t, 25 * t);
    }
    e.restore();
  }

  function drawGreekUnfinishedWork(e, t, subType = 0) {
    e.save();
    if (subType === 0) {
      // Andaime de Madeira e Guindaste Grego (Polyspastos) erguendo um bloco de mármore
      e.strokeStyle = "#78350f";
      e.lineWidth = 2.6 * t;
      e.beginPath();
      e.moveTo(-11 * t, 4 * t);
      e.lineTo(-3 * t, -28 * t);
      e.lineTo(11 * t, 4 * t);
      e.moveTo(-9 * t, -10 * t);
      e.lineTo(7 * t, -10 * t);
      e.stroke();
      // Corda do guindaste
      e.strokeStyle = "#d97706";
      e.lineWidth = 1.3 * t;
      e.beginPath();
      e.moveTo(-2 * t, -27 * t);
      e.lineTo(-2 * t, -12 * t);
      e.stroke();
      // Bloco de mármore suspenso pela metade
      e.fillStyle = "#f1f5f9";
      e.fillRect(-8 * t, -12 * t, 12 * t, 8 * t);
      e.strokeStyle = "#64748b";
      e.lineWidth = 1 * t;
      e.strokeRect(-8 * t, -12 * t, 12 * t, 8 * t);
    } else {
      // Blocos de mármore bruto recém-cortados e tambor de coluna inacabado no chão
      e.fillStyle = "#e2e8f0";
      e.fillRect(-11 * t, -6 * t, 13 * t, 9 * t);
      e.strokeStyle = "#64748b";
      e.lineWidth = 1 * t;
      e.strokeRect(-11 * t, -6 * t, 13 * t, 9 * t);
      // Tambor cilíndrico de coluna dórica ainda sem montar
      e.fillStyle = "#cbd5e1";
      e.beginPath();
      e.ellipse(7 * t, 0 * t, 5.5 * t, 3.5 * t, 0, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#f8fafc";
      e.beginPath();
      e.ellipse(7 * t, -4 * t, 5.5 * t, 3.5 * t, 0, 0, Math.PI * 2);
      e.fill();
      e.stroke();
    }
    e.restore();
  }

  function drawGreekCorridorTorch(e, t = 1, isLit = !1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // 1. Sombra no piso do corredor
    e.fillStyle = "rgba(2, 6, 23, 0.36)";
    e.beginPath();
    e.ellipse(0, 3 * t, 6.5 * t, 3 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2. Pedestal de Mármore Helênico e Coluna de Bronze do Tocheiro
    e.fillStyle = "#cbd5e1";
    e.fillRect(-5 * t, 0, 10 * t, 3.2 * t);
    e.fillStyle = "#f8fafc";
    e.fillRect(-3.8 * t, -3.5 * t, 7.6 * t, 3.8 * t);
    e.strokeStyle = "#64748b";
    e.lineWidth = 0.8 * t;
    e.strokeRect(-3.8 * t, -3.5 * t, 7.6 * t, 3.8 * t);

    // Haste vertical de bronze/ferro forjado
    e.fillStyle = "#78350f";
    e.fillRect(-1.6 * t, -15.5 * t, 3.2 * t, 12.2 * t);
    e.fillStyle = "#d97706";
    e.fillRect(-2.4 * t, -9.5 * t, 4.8 * t, 1.4 * t);

    // 3. Cesto / Braseiro da Tocha no topo
    e.fillStyle = "#451a03";
    e.beginPath();
    e.moveTo(-4.8 * t, -19 * t);
    e.lineTo(4.8 * t, -19 * t);
    e.lineTo(2.8 * t, -14.5 * t);
    e.lineTo(-2.8 * t, -14.5 * t);
    e.closePath();
    e.fill();
    e.strokeStyle = "#f59e0b";
    e.lineWidth = 1 * t;
    e.stroke();

    if (!isLit) {
      // Estado APAGADO: Pavio e carvão escuro no topo aguardando ser aceso com uma tocha na mão
      e.fillStyle = "#1c1917";
      e.beginPath();
      e.ellipse(0, -19.2 * t, 3.4 * t, 1.6 * t, 0, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#44403c";
      e.beginPath();
      e.arc(-1 * t, -20 * t, 1.4 * t, 0, Math.PI * 2);
      e.arc(1.2 * t, -19.8 * t, 1.2 * t, 0, Math.PI * 2);
      e.fill();
    } else {
      // Estado ACESO: Halo luminoso e chama viva dançante!
      const flicker = Math.sin(animTimer * 11) * 1.1 * t,
        pulse = 1 + Math.cos(animTimer * 8) * 0.12;

      const glow = e.createRadialGradient(0, -22 * t, 1 * t, 0, -22 * t, 16 * pulse * t);
      glow.addColorStop(0, "rgba(254, 240, 138, 0.75)");
      glow.addColorStop(0.45, "rgba(249, 115, 22, 0.35)");
      glow.addColorStop(1, "rgba(249, 115, 22, 0)");
      e.fillStyle = glow;
      e.beginPath();
      e.arc(0, -22 * t, 16 * pulse * t, 0, Math.PI * 2);
      e.fill();

      // Língua externa da chama (laranja-avermelhada)
      e.fillStyle = "#f97316";
      e.beginPath();
      e.moveTo(-3.8 * t, -18.8 * t);
      e.quadraticCurveTo(-4.5 * t, -24 * t, flicker, -28.5 * pulse * t);
      e.quadraticCurveTo(4.5 * t, -24 * t, 3.8 * t, -18.8 * t);
      e.closePath();
      e.fill();

      // Núcleo interno da chama (amarelo-ouro brilhante)
      e.fillStyle = "#fef08a";
      e.beginPath();
      e.moveTo(-2 * t, -19 * t);
      e.quadraticCurveTo(-2.2 * t, -22.5 * t, flicker * 0.5, -25.2 * pulse * t);
      e.quadraticCurveTo(2.2 * t, -22.5 * t, 2 * t, -19 * t);
      e.closePath();
      e.fill();
    }
    e.restore();
  }
  function getCaveBiomeTheme(biome) {
    const bId = (biome && biome.id) || "MEADOW";
    const groundCol = (biome && biome.groundColor) || "#5fa743";
    const accentCol = (biome && biome.groundAccentColor) || "#6cb64d";
    // 1. Biomas de Areia (DESERT, BEACH, DESERT_CAVE): Pedra de Arenito dourado/amarelado com estratos e areia acumulada
    if (bId === "DESERT" || bId === "BEACH" || bId === "DESERT_CAVE_FLOOR" || bId === "DESERT_CAVE_WALL") {
      return {
        kind: "sandstone",
        rockOuter: "#92400e",
        rockMid: "#b45309",
        rockLight: "#d97706",
        rockHighlight: "#f59e0b",
        stratumCol: "rgba(120, 53, 15, 0.55)",
        mossColor: groundCol,
        mossAccent: accentCol,
        hasMoss: !1,
        hasSand: !0,
      };
    }
    // 2. Cânion Vermelho (CANYON): Arenito avermelhado/terracota
    if (bId === "CANYON") {
      return {
        kind: "canyon",
        rockOuter: "#7c2d12",
        rockMid: "#9a3412",
        rockLight: "#c2410c",
        rockHighlight: "#ea580c",
        stratumCol: "rgba(67, 20, 7, 0.6)",
        mossColor: groundCol,
        mossAccent: accentCol,
        hasMoss: !1,
        hasSand: !0,
      };
    }
    // 3. Biomas de Neve / Gelo (SNOW_TAIGA, SNOW_PEAK, GLACIER): Rocha alpina fria com cobertura de neve/gelo
    if (bId === "SNOW_TAIGA" || bId === "SNOW_PEAK" || bId === "GLACIER") {
      return {
        kind: "snow",
        rockOuter: "#1e293b",
        rockMid: "#334155",
        rockLight: "#475569",
        rockHighlight: "#64748b",
        stratumCol: "rgba(15, 23, 42, 0.6)",
        mossColor: "#f8fafc",
        mossAccent: "#bae6fd",
        hasMoss: !0,
        hasSand: !1,
      };
    }
    // 4. Vulcão (VOLCANIC): Basalto vulcânico negro/obsidiana com veios incandescentes
    if (bId === "VOLCANIC") {
      return {
        kind: "volcanic",
        rockOuter: "#09090b",
        rockMid: "#18181b",
        rockLight: "#27272a",
        rockHighlight: "#3f3f46",
        stratumCol: "rgba(220, 38, 38, 0.55)",
        mossColor: "#dc2626",
        mossAccent: "#f97316",
        hasMoss: !1,
        hasSand: !1,
      };
    }
    // 5. Biomas de Grama / Floresta / Savana / Oásis / Pântano / Montanha:
    //    Rocha granítica irregular coberta com MUSGO DA EXATA COR DA GRAMA DO BIOMA!
    return {
      kind: "grass_moss",
      rockOuter: "#1e293b",
      rockMid: "#334155",
      rockLight: "#475569",
      rockHighlight: "#64748b",
      stratumCol: "rgba(15, 23, 42, 0.55)",
      mossColor: groundCol,
      mossAccent: accentCol,
      hasMoss: !0,
      hasSand: !1,
    };
  }

  function drawIrregularCaveRockFormation(e, t, theme, isExit = !1, isMerged = !1, mergedCount = 1) {
    const wMul = isMerged ? 1.32 : 1,
      hMul = isMerged ? 1.48 : 1;

    // 1. Sombra de base irregular sob os rochedos
    e.fillStyle = "rgba(2, 6, 23, 0.45)";
    e.beginPath();
    e.moveTo(-29 * wMul * t, 5 * t);
    e.lineTo(-24 * wMul * t, 9 * t);
    e.lineTo(25 * wMul * t, 9 * t);
    e.lineTo(30 * wMul * t, 4 * t);
    e.lineTo(24 * wMul * t, -4 * t);
    e.lineTo(-24 * wMul * t, -4 * t);
    e.closePath();
    e.fill();

    // Se for uma Caverna Unificada (duas ou mais cavernas próximas que se juntaram),
    // desenha primeiro os grandes picos traseiros extras (muito mais alta!)
    if (isMerged) {
      e.fillStyle = theme.rockOuter;
      e.beginPath();
      e.moveTo(-36 * t, 4 * t);
      e.lineTo(-39 * t, -10 * t);
      e.lineTo(-33 * t, -26 * t);
      e.lineTo(-25 * t, -42 * t);
      e.lineTo(-16 * t, -38 * t);
      e.lineTo(-11 * t, -54 * t);
      e.lineTo(-2 * t, -60 * t);
      e.lineTo(8 * t, -56 * t);
      e.lineTo(15 * t, -44 * t);
      e.lineTo(24 * t, -47 * t);
      e.lineTo(32 * t, -31 * t);
      e.lineTo(38 * t, -14 * t);
      e.lineTo(36 * t, 4 * t);
      e.closePath();
      e.fill();

      // Facetas intermediárias dos picos altos da caverna unificada
      e.fillStyle = theme.rockMid;
      e.beginPath();
      e.moveTo(-23 * t, -26 * t);
      e.lineTo(-18 * t, -40 * t);
      e.lineTo(-9 * t, -52 * t);
      e.lineTo(-1 * t, -57 * t);
      e.lineTo(7 * t, -53 * t);
      e.lineTo(14 * t, -39 * t);
      e.lineTo(22 * t, -44 * t);
      e.lineTo(28 * t, -28 * t);
      e.closePath();
      e.fill();

      // Planos de luz nos picos superiores
      e.fillStyle = theme.rockLight;
      e.beginPath();
      e.moveTo(-9 * t, -49 * t);
      e.lineTo(-2 * t, -55 * t);
      e.lineTo(5 * t, -51 * t);
      e.lineTo(1 * t, -39 * t);
      e.closePath();
      e.moveTo(16 * t, -38 * t);
      e.lineTo(22 * t, -43 * t);
      e.lineTo(26 * t, -31 * t);
      e.lineTo(19 * t, -27 * t);
      e.closePath();
      e.fill();
    }

    // 2. Maciço Rochoso Principal Irregular (Polígono angular escarpado em vez de círculos!)
    e.fillStyle = theme.rockOuter;
    e.beginPath();
    e.moveTo(-28 * wMul * t, 4 * t);
    e.lineTo(-30 * wMul * t, -5 * hMul * t);
    e.lineTo(-26 * wMul * t, -16 * hMul * t);
    e.lineTo(-21 * wMul * t, -23 * hMul * t);
    e.lineTo(-15 * wMul * t, -21 * hMul * t);
    e.lineTo(-11 * wMul * t, -32 * hMul * t);
    e.lineTo(-3 * wMul * t, -37 * hMul * t);
    e.lineTo(5 * wMul * t, -35 * hMul * t);
    e.lineTo(12 * wMul * t, -29 * hMul * t);
    e.lineTo(17 * wMul * t, -25 * hMul * t);
    e.lineTo(24 * wMul * t, -21 * hMul * t);
    e.lineTo(29 * wMul * t, -12 * hMul * t);
    e.lineTo(27 * wMul * t, 4 * t);
    e.closePath();
    e.fill();

    // 3. Facetas Rochosas Intermediárias Irregulares (3 blocos angulares lascados: esquerdo, central/topo e direito)
    e.fillStyle = theme.rockMid;
    // Bloco rochoso esquerdo
    e.beginPath();
    e.moveTo(-26 * wMul * t, 3 * t);
    e.lineTo(-27 * wMul * t, -7 * hMul * t);
    e.lineTo(-23 * wMul * t, -17 * hMul * t);
    e.lineTo(-17 * wMul * t, -20 * hMul * t);
    e.lineTo(-12 * wMul * t, -14 * hMul * t);
    e.lineTo(-13 * wMul * t, 3 * t);
    e.closePath();
    e.fill();

    // Crista rochosa superior
    e.beginPath();
    e.moveTo(-15 * wMul * t, -16 * hMul * t);
    e.lineTo(-9 * wMul * t, -29 * hMul * t);
    e.lineTo(-2 * wMul * t, -34 * hMul * t);
    e.lineTo(6 * wMul * t, -32 * hMul * t);
    e.lineTo(13 * wMul * t, -24 * hMul * t);
    e.lineTo(9 * wMul * t, -15 * hMul * t);
    e.closePath();
    e.fill();

    // Bloco rochoso direito
    e.beginPath();
    e.moveTo(12 * wMul * t, 3 * t);
    e.lineTo(11 * wMul * t, -15 * hMul * t);
    e.lineTo(17 * wMul * t, -22 * hMul * t);
    e.lineTo(23 * wMul * t, -18 * hMul * t);
    e.lineTo(26 * wMul * t, -9 * hMul * t);
    e.lineTo(25 * wMul * t, 3 * t);
    e.closePath();
    e.fill();

    // 4. Planos de Luz / Quinas de Pedra Lascada (facetas iluminadas angulares)
    e.fillStyle = theme.rockLight;
    e.beginPath();
    // Faceta clara esquerda
    e.moveTo(-24 * wMul * t, -6 * hMul * t);
    e.lineTo(-21 * wMul * t, -16 * hMul * t);
    e.lineTo(-16 * wMul * t, -18 * hMul * t);
    e.lineTo(-15 * wMul * t, -8 * hMul * t);
    e.closePath();
    // Faceta clara topo
    e.moveTo(-8 * wMul * t, -27 * hMul * t);
    e.lineTo(-2 * wMul * t, -32 * hMul * t);
    e.lineTo(5 * wMul * t, -30 * hMul * t);
    e.lineTo(2 * wMul * t, -22 * hMul * t);
    e.closePath();
    // Faceta clara direita
    e.moveTo(14 * wMul * t, -14 * hMul * t);
    e.lineTo(17 * wMul * t, -20 * hMul * t);
    e.lineTo(22 * wMul * t, -16 * hMul * t);
    e.lineTo(19 * wMul * t, -7 * hMul * t);
    e.closePath();
    e.fill();

    // 5. Fendas geológicas e estratos (no arenito desenha faixas horizontais de sedimentos)
    e.strokeStyle = theme.stratumCol;
    e.lineWidth = (isMerged ? 1.6 : 1.3) * t;
    e.beginPath();
    if (theme.kind === "sandstone" || theme.kind === "canyon") {
      // Camadas sedimentares de arenito
      e.moveTo(-26 * wMul * t, -10 * hMul * t);
      e.lineTo(-14 * wMul * t, -12 * hMul * t);
      e.moveTo(-10 * wMul * t, -25 * hMul * t);
      e.lineTo(9 * wMul * t, -24 * hMul * t);
      e.moveTo(13 * wMul * t, -11 * hMul * t);
      e.lineTo(25 * wMul * t, -9 * hMul * t);
      if (isMerged) {
        e.moveTo(-16 * t, -42 * t);
        e.lineTo(14 * t, -40 * t);
      }
    } else {
      // Fraturas angulares de rocha
      e.moveTo(-21 * wMul * t, -19 * hMul * t);
      e.lineTo(-17 * wMul * t, -11 * hMul * t);
      e.lineTo(-22 * wMul * t, -4 * hMul * t);
      e.moveTo(-3 * wMul * t, -33 * hMul * t);
      e.lineTo(1 * wMul * t, -25 * hMul * t);
      e.moveTo(19 * wMul * t, -21 * hMul * t);
      e.lineTo(16 * wMul * t, -10 * hMul * t);
    }
    e.stroke();

    // 6. Pedras irregulares menores nas laterais da entrada
    e.fillStyle = theme.rockMid;
    e.beginPath();
    e.moveTo(-29 * wMul * t, 4 * t);
    e.lineTo(-27 * wMul * t, -2 * t);
    e.lineTo(-21 * wMul * t, -1 * t);
    e.lineTo(-19 * wMul * t, 5 * t);
    e.closePath();
    e.moveTo(19 * wMul * t, 5 * t);
    e.lineTo(21 * wMul * t, -1 * t);
    e.lineTo(27 * wMul * t, 0 * t);
    e.lineTo(29 * wMul * t, 5 * t);
    e.closePath();
    e.fill();

    // 7. Quando duas ou mais cavernas se juntam (isMerged), adiciona MUITO MAIS PEDRAS IRREGULARES na entrada!
    if (isMerged) {
      const extraRocks = [
        // Aglomerado esquerdo de rochedos na entrada
        { x: -34, y: 6, w: 9, h: 8, col: theme.rockOuter },
        { x: -31, y: 5, w: 7, h: 6, col: theme.rockMid },
        { x: -25, y: 7, w: 8, h: 6.5, col: theme.rockOuter },
        { x: -24, y: 6, w: 6, h: 5, col: theme.rockLight },
        { x: -18, y: 8, w: 6.5, h: 5, col: theme.rockMid },
        // Aglomerado direito de rochedos na entrada
        { x: 34, y: 6, w: 9.5, h: 8, col: theme.rockOuter },
        { x: 31, y: 5, w: 7, h: 6, col: theme.rockMid },
        { x: 25, y: 7, w: 8, h: 6.5, col: theme.rockOuter },
        { x: 24, y: 6, w: 6, h: 5, col: theme.rockLight },
        { x: 18, y: 8, w: 6.5, h: 5, col: theme.rockMid },
        // Pedras extras empilhadas nas ombreiras da entrada
        { x: -20, y: -4, w: 7, h: 8, col: theme.rockMid },
        { x: 20, y: -4, w: 7, h: 8, col: theme.rockMid },
      ];
      for (let i = 0; i < extraRocks.length; i++) {
        const rk = extraRocks[i];
        e.fillStyle = rk.col;
        e.beginPath();
        e.moveTo((rk.x - rk.w * 0.5) * t, rk.y * t);
        e.lineTo((rk.x - rk.w * 0.38) * t, (rk.y - rk.h * 0.85) * t);
        e.lineTo((rk.x + rk.w * 0.12) * t, (rk.y - rk.h) * t);
        e.lineTo((rk.x + rk.w * 0.48) * t, (rk.y - rk.h * 0.55) * t);
        e.lineTo((rk.x + rk.w * 0.52) * t, (rk.y + 1) * t);
        e.closePath();
        e.fill();
      }
    }
  }

  function drawCaveBiomeOverlay(e, t, theme, isMerged = !1) {
    const wMul = isMerged ? 1.32 : 1,
      hMul = isMerged ? 1.48 : 1;
    // Se for bioma de grama/floresta/neve, aplica tapetes irregulares de MUSGO DA COR DA GRAMA (ou neve) sobre as cristas da pedra!
    if (theme.hasMoss) {
      e.fillStyle = theme.mossColor;
      // Camada de musgo superior acompanhando a crista irregular da caverna
      e.beginPath();
      e.moveTo(-23 * wMul * t, -16 * hMul * t);
      e.lineTo(-21 * wMul * t, -23 * hMul * t);
      e.lineTo(-15 * wMul * t, -21 * hMul * t);
      e.lineTo(-11 * wMul * t, -32 * hMul * t);
      e.lineTo(-3 * wMul * t, -37 * hMul * t);
      e.lineTo(5 * wMul * t, -35 * hMul * t);
      e.lineTo(12 * wMul * t, -29 * hMul * t);
      e.lineTo(17 * wMul * t, -25 * hMul * t);
      e.lineTo(23 * wMul * t, -20 * hMul * t);
      e.lineTo(18 * wMul * t, -16 * hMul * t);
      e.lineTo(11 * wMul * t, -20 * hMul * t);
      e.lineTo(4 * wMul * t, -26 * hMul * t);
      e.lineTo(-4 * wMul * t, -27 * hMul * t);
      e.lineTo(-12 * wMul * t, -18 * hMul * t);
      e.lineTo(-18 * wMul * t, -14 * hMul * t);
      e.closePath();
      e.fill();

      // Destaque secundário do musgo (groundAccentColor do bioma) e manchas nas pedras laterais
      e.fillStyle = theme.mossAccent;
      e.beginPath();
      e.moveTo(-10 * wMul * t, -29 * hMul * t);
      e.lineTo(-3 * wMul * t, -35 * hMul * t);
      e.lineTo(4 * wMul * t, -33 * hMul * t);
      e.lineTo(8 * wMul * t, -27 * hMul * t);
      e.lineTo(1 * wMul * t, -28 * hMul * t);
      e.closePath();
      // Manchas de musgo descendo pela rocha esquerda e direita
      e.moveTo(-25 * wMul * t, -8 * hMul * t);
      e.lineTo(-22 * wMul * t, -14 * hMul * t);
      e.lineTo(-16 * wMul * t, -12 * hMul * t);
      e.lineTo(-18 * wMul * t, -6 * hMul * t);
      e.closePath();
      e.moveTo(16 * wMul * t, -12 * hMul * t);
      e.lineTo(21 * wMul * t, -15 * hMul * t);
      e.lineTo(25 * wMul * t, -9 * hMul * t);
      e.lineTo(19 * wMul * t, -7 * hMul * t);
      e.closePath();
      if (isMerged) {
        // Musgo nos rochedos extras da entrada da caverna unificada
        e.moveTo(-34 * t, 2 * t);
        e.lineTo(-29 * t, -1 * t);
        e.lineTo(-22 * t, 2 * t);
        e.lineTo(-26 * t, 5 * t);
        e.closePath();
        e.moveTo(22 * t, 2 * t);
        e.lineTo(29 * t, -1 * t);
        e.lineTo(34 * t, 2 * t);
        e.lineTo(26 * t, 5 * t);
        e.closePath();
      }
      e.fill();
    } else if (theme.hasSand) {
      // Dunas de areia / poeira de arenito acumulada na base e nas fendas da caverna
      e.fillStyle = theme.mossColor;
      e.beginPath();
      e.moveTo(-30 * wMul * t, 5 * t);
      e.quadraticCurveTo(-22 * wMul * t, -2 * t, -13 * wMul * t, 5 * t);
      e.closePath();
      e.moveTo(13 * wMul * t, 5 * t);
      e.quadraticCurveTo(22 * wMul * t, -2 * t, 30 * wMul * t, 5 * t);
      e.closePath();
      e.fill();
      e.fillStyle = theme.rockHighlight;
      e.beginPath();
      e.moveTo(-9 * wMul * t, -29 * hMul * t);
      e.lineTo(-2 * wMul * t, -34 * hMul * t);
      e.lineTo(5 * wMul * t, -32 * hMul * t);
      e.lineTo(1 * wMul * t, -28 * hMul * t);
      e.closePath();
      e.fill();
    }
  }

  function getSurfaceExitWeatherColors(surfaceBiome = null) {
    let timeOfDay = 0.5;
    try {
      if (typeof window !== "undefined" && window.Game && window.Game.engine && typeof window.Game.engine.timeOfDay === "number") {
        timeOfDay = window.Game.engine.timeOfDay;
      } else if (typeof window !== "undefined" && window.weatherSystem && typeof window.weatherSystem.lastTimeOfDay === "number") {
        timeOfDay = window.weatherSystem.lastTimeOfDay;
      }
    } catch (_) {}

    const isNight = timeOfDay < 0.22 || timeOfDay > 0.78;
    const isDawn = timeOfDay >= 0.22 && timeOfDay < 0.32;
    const isDusk = timeOfDay > 0.68 && timeOfDay <= 0.78;

    let ws = null;
    try {
      if (typeof window !== "undefined" && window.weatherSystem) {
        ws = window.weatherSystem;
      }
    } catch (_) {}

    const currentWeather = ws ? ws.currentWeather : "clear";
    const intensity = (ws && typeof ws.intensity === "number") ? ws.intensity : 0;
    const isThunder = currentWeather === "thunderstorm" && intensity > 0.05;
    const isRain = (currentWeather === "rain" || currentWeather === "heavy_rain") && intensity > 0.05;
    const isSnow = (currentWeather === "snow" || currentWeather === "blizzard") && intensity > 0.05;
    const isSand = (currentWeather === "sandstorm" || currentWeather === "sand") && intensity > 0.05;

    // Relâmpago ativo no momento
    const flashAlpha = (ws && typeof ws.flashAlpha === "number") ? ws.flashAlpha : 0;

    if (flashAlpha > 0.15) {
      return {
        skyTop: "#e0f2fe",
        skyMid: "#bae6fd",
        skyBottom: "#ffffff",
        rayColor: `rgba(224, 242, 254, ${Math.min(0.75, 0.35 + flashAlpha * 0.5)})`,
        floorColor: `rgba(224, 242, 254, ${Math.min(0.65, 0.25 + flashAlpha * 0.4)})`,
        weatherType: "flash",
        isAdverse: true
      };
    }

    if (isThunder) {
      if (isNight) {
        return {
          skyTop: "#020617",
          skyMid: "#0f172a",
          skyBottom: "#1e293b",
          rayColor: "rgba(56, 189, 248, 0.04)",
          floorColor: "rgba(30, 41, 59, 0.08)",
          weatherType: "thunderstorm",
          isAdverse: true
        };
      }
      return {
        skyTop: "#0f172a",
        skyMid: "#1e293b",
        skyBottom: "#334155",
        rayColor: "rgba(56, 189, 248, 0.09)",
        floorColor: "rgba(51, 65, 85, 0.14)",
        weatherType: "thunderstorm",
        isAdverse: true
      };
    }

    if (isRain) {
      if (isNight) {
        return {
          skyTop: "#020617",
          skyMid: "#0b1528",
          skyBottom: "#172554",
          rayColor: "rgba(56, 189, 248, 0.05)",
          floorColor: "rgba(30, 58, 138, 0.10)",
          weatherType: "rain",
          isAdverse: true
        };
      }
      return {
        skyTop: "#334155",
        skyMid: "#475569",
        skyBottom: "#64748b",
        rayColor: "rgba(148, 163, 184, 0.12)",
        floorColor: "rgba(100, 116, 139, 0.18)",
        weatherType: "rain",
        isAdverse: true
      };
    }

    if (isSnow) {
      if (isNight) {
        return {
          skyTop: "#090d16",
          skyMid: "#1e293b",
          skyBottom: "#334155",
          rayColor: "rgba(226, 232, 240, 0.08)",
          floorColor: "rgba(203, 213, 225, 0.14)",
          weatherType: "snow",
          isAdverse: true
        };
      }
      return {
        skyTop: "#94a3b8",
        skyMid: "#cbd5e1",
        skyBottom: "#e2e8f0",
        rayColor: "rgba(241, 245, 249, 0.22)",
        floorColor: "rgba(226, 232, 240, 0.26)",
        weatherType: "snow",
        isAdverse: true
      };
    }

    if (isSand) {
      if (isNight) {
        return {
          skyTop: "#1c1106",
          skyMid: "#291809",
          skyBottom: "#451a03",
          rayColor: "rgba(217, 119, 6, 0.06)",
          floorColor: "rgba(180, 83, 9, 0.10)",
          weatherType: "sandstorm",
          isAdverse: true
        };
      }
      return {
        skyTop: "#78350f",
        skyMid: "#b45309",
        skyBottom: "#d97706",
        rayColor: "rgba(245, 158, 11, 0.18)",
        floorColor: "rgba(217, 119, 6, 0.24)",
        weatherType: "sandstorm",
        isAdverse: true
      };
    }

    // Céu Aberto / Céu Limpo (considerando ciclo dia/noite)
    if (isNight) {
      return {
        skyTop: "#020617",
        skyMid: "#090d16",
        skyBottom: "#0f172a",
        rayColor: "rgba(56, 189, 248, 0.08)",
        floorColor: "rgba(56, 189, 248, 0.10)",
        weatherType: "night",
        isAdverse: false
      };
    }
    if (isDawn) {
      return {
        skyTop: "#4338ca",
        skyMid: "#c026d3",
        skyBottom: "#fb923c",
        rayColor: "rgba(251, 146, 60, 0.26)",
        floorColor: "rgba(251, 146, 60, 0.28)",
        weatherType: "dawn",
        isAdverse: false
      };
    }
    if (isDusk) {
      return {
        skyTop: "#1e1b4b",
        skyMid: "#9333ea",
        skyBottom: "#ea580c",
        rayColor: "rgba(249, 115, 22, 0.24)",
        floorColor: "rgba(234, 88, 12, 0.26)",
        weatherType: "dusk",
        isAdverse: false
      };
    }

    // Dia pleno ensolarado
    return {
      skyTop: "#0284c7",
      skyMid: "#38bdf8",
      skyBottom: "#fde047",
      rayColor: "rgba(254, 240, 138, 0.38)",
      floorColor: "rgba(254, 240, 138, 0.35)",
      weatherType: "clear",
      isAdverse: false
    };
  }

  function drawRuinsSubterraneanStaircase(e, t, l, isExit = !1, isMerged = !1) {
    const wMul = isMerged ? 1.28 : 1,
      hMul = isMerged ? 1.22 : 1;

    if (isExit) {
      const exitColors = getSurfaceExitWeatherColors();
      // =========================================================================
      // SAÍDA DA ESCADARIA NO SUBSOLO (Escadaria de Mármore que SOBE do chão da
      // caverna em direção à abertura iluminada da superfície no teto!)
      // =========================================================================
      // 1. Tapete de luz projetado no chão da caverna ao pé da escadaria (corresponde ao clima real!)
      const floorBeam = e.createRadialGradient(0, 6 * t, 2 * t, 0, 8 * t, 26 * wMul * t);
      floorBeam.addColorStop(0, exitColors.floorColor);
      floorBeam.addColorStop(0.55, exitColors.rayColor);
      floorBeam.addColorStop(1, "rgba(15, 23, 42, 0)");
      e.fillStyle = floorBeam;
      e.beginPath();
      e.ellipse(0, 8 * t, 26 * wMul * t, 11 * t, 0, 0, Math.PI * 2);
      e.fill();

      // 2. Sombra da estrutura da escadaria que se ergue no subsolo
      e.fillStyle = "rgba(2, 6, 23, 0.55)";
      e.fillRect(-24 * wMul * t, -34 * hMul * t, 48 * wMul * t, (34 * hMul + 12) * t);

      // 3. Estrutura Lateral de Pedra/Mármore Sustentando a Escadaria Ascendente (2.5D)
      e.fillStyle = "#334155";
      e.beginPath();
      e.moveTo(-22 * wMul * t, 8 * t);
      e.lineTo(-18 * wMul * t, -34 * hMul * t);
      e.lineTo(18 * wMul * t, -34 * hMul * t);
      e.lineTo(22 * wMul * t, 8 * t);
      e.closePath();
      e.fill();

      // Balaustradas / Corrimãos Laterais de Mármore Branco subindo em rampa até o teto
      e.fillStyle = "#f8fafc";
      // Corrimão esquerdo
      e.beginPath();
      e.moveTo(-21 * wMul * t, 8 * t);
      e.lineTo(-16 * wMul * t, -34 * hMul * t);
      e.lineTo(-11.5 * wMul * t, -34 * hMul * t);
      e.lineTo(-15.5 * wMul * t, 8 * t);
      e.closePath();
      e.fill();
      // Corrimão direito
      e.beginPath();
      e.moveTo(15.5 * wMul * t, 8 * t);
      e.lineTo(11.5 * wMul * t, -34 * hMul * t);
      e.lineTo(16 * wMul * t, -34 * hMul * t);
      e.lineTo(21 * wMul * t, 8 * t);
      e.closePath();
      e.fill();

      // Friso dourado ao longo das balaustradas ascendentes
      e.strokeStyle = "#f59e0b";
      e.lineWidth = 1.2 * t;
      e.beginPath();
      e.moveTo(-18.5 * wMul * t, 7 * t);
      e.lineTo(-14 * wMul * t, -33 * hMul * t);
      e.moveTo(18.5 * wMul * t, 7 * t);
      e.lineTo(14 * wMul * t, -33 * hMul * t);
      e.stroke();

      // 4. Degraus Ascendentes (começam largos na base da caverna e sobem em degraus 3D até o portal iluminado no topo!)
      const numUpSteps = isMerged ? 10 : 8;
      for (let s = 0; s < numUpSteps; s++) {
        const r0 = s / numUpSteps;
        const r1 = (s + 1) / numUpSteps;
        // Base em y = +8*t subindo até y = -28*hMul*t
        const yBottom = (8 - r0 * (34 * hMul)) * t;
        const yTop = (8 - r1 * (34 * hMul)) * t;
        const stepH = Math.max(2 * t, yBottom - yTop);
        const halfW0 = (15.5 - r0 * 4) * wMul * t;
        const halfW1 = (15.5 - r1 * 4) * wMul * t;

        // Espelho frontal vertical do degrau (quem está na caverna vê a frente do degrau subindo!)
        const riserLum = Math.round(110 + r0 * 95);
        e.fillStyle = `rgb(${riserLum}, ${riserLum + 4}, ${riserLum + 12})`;
        e.fillRect(-halfW0, yBottom - stepH * 0.55, halfW0 * 2, stepH * 0.55);

        // Pisada superior do degrau banhada pela luz que vem de cima
        const treadLum = Math.round(165 + r1 * 88);
        e.fillStyle = `rgb(${treadLum}, ${treadLum}, ${Math.min(255, treadLum + 8)})`;
        e.fillRect(-halfW1, yTop, halfW1 * 2, stepH * 0.48);

        // Borda dourada sutil nos degraus superiores
        if (s % 2 === 1) {
          e.fillStyle = "rgba(251, 191, 36, 0.45)";
          e.fillRect(-halfW0 + 1 * t, yBottom - stepH * 0.55, (halfW0 - 1 * t) * 2, 0.7 * t);
        }
      }

      // 5. Portal / Claraboia de Saída no Topo da Escadaria (Céu aberto e clima dinâmico da superfície lá em cima!)
      const skyGrad = e.createLinearGradient(0, -38 * hMul * t, 0, -22 * hMul * t);
      skyGrad.addColorStop(0, exitColors.skyTop);
      skyGrad.addColorStop(0.55, exitColors.skyMid);
      skyGrad.addColorStop(1, exitColors.skyBottom);
      e.fillStyle = skyGrad;
      e.fillRect(-12 * wMul * t, -37 * hMul * t, 24 * wMul * t, 11 * hMul * t);

      // Gotas de chuva ou flocos caindo pelo vão da escadaria se o clima exterior for chuva ou neve
      if (exitColors.weatherType === "rain" || exitColors.weatherType === "thunderstorm") {
        e.strokeStyle = "rgba(186, 230, 253, 0.65)";
        e.lineWidth = 1 * t;
        const timeOff = (l || 0) * 20;
        for (let ri = -9; ri <= 9; ri += 3.5) {
          const rx = ri * wMul * t;
          const ry = -36 * hMul * t + (((ri * 7 + timeOff) % 11) * hMul * t);
          e.beginPath();
          e.moveTo(rx, ry);
          e.lineTo(rx - 1.5 * t, ry + 4 * t);
          e.stroke();
        }
      } else if (exitColors.weatherType === "snow") {
        e.fillStyle = "rgba(255, 255, 255, 0.85)";
        const timeOff = (l || 0) * 8;
        for (let si = -9; si <= 9; si += 4) {
          const sx = si * wMul * t + Math.sin((l || 0) * 3 + si) * 2 * t;
          const sy = -36 * hMul * t + (((si * 5 + timeOff) % 11) * hMul * t);
          e.beginPath();
          e.arc(sx, sy, 1.2 * t, 0, Math.PI * 2);
          e.fill();
        }
      }

      // Feixe de luz descendo da abertura sobre os degraus
      const rayGrad = e.createLinearGradient(0, -36 * hMul * t, 0, 8 * t);
      rayGrad.addColorStop(0, exitColors.rayColor);
      rayGrad.addColorStop(0.55, exitColors.rayColor.replace(/[\d\.]+\)$/, "0.1)"));
      rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      e.fillStyle = rayGrad;
      e.beginPath();
      e.moveTo(-12 * wMul * t, -36 * hMul * t);
      e.lineTo(12 * wMul * t, -36 * hMul * t);
      e.lineTo(18 * wMul * t, 8 * t);
      e.lineTo(-18 * wMul * t, 8 * t);
      e.closePath();
      e.fill();

      // Colunas Dóricas e Arquitrave de Mármore emoldurando a Saída no Topo e na Base
      for (const side of [-1, 1]) {
        // Pilares da base da escadaria
        const bx = side * 18 * wMul * t;
        e.fillStyle = "#94a3b8";
        e.fillRect(bx - 3.2 * t, 4 * t, 6.4 * t, 4 * t);
        e.fillStyle = "#f8fafc";
        e.fillRect(bx - 2.4 * t, -8 * t, 4.8 * t, 12 * t);
        e.fillStyle = "#f59e0b";
        e.fillRect(bx - 3 * t, -9.5 * t, 6 * t, 1.8 * t);

        // Colunas do portal superior de saída
        const tx = side * 13.5 * wMul * t;
        e.fillStyle = "#f8fafc";
        e.fillRect(tx - 2.4 * t, -39 * hMul * t, 4.8 * t, 13 * hMul * t);
        e.fillStyle = "#e2e8f0";
        e.fillRect(tx - 3.2 * t, -41 * hMul * t, 6.4 * t, 2.2 * t);
      }

      // Arquitrave superior de mármore com friso dourado (sem texto escrito SAÍDA)
      e.fillStyle = "#f8fafc";
      e.fillRect(-17 * wMul * t, -43 * hMul * t, 34 * wMul * t, 4 * t);
      e.fillStyle = "#334155";
      e.fillRect(-18 * wMul * t, -45 * hMul * t, 36 * wMul * t, 2 * t);
      e.strokeStyle = "#fbbf24";
      e.lineWidth = 1 * t;
      e.strokeRect(-16 * wMul * t, -42.5 * hMul * t, 32 * wMul * t, 3 * t);

      // Tochas de bronze acesas na base da escadaria de saída
      const flicker = Math.sin((l || 0) * 6) * 0.15;
      for (const side of [-1, 1]) {
        const tx = side * 18 * wMul * t,
          ty = -11 * t;
        e.fillStyle = `rgba(251, 191, 36, ${0.9 + flicker})`;
        e.beginPath();
        e.arc(tx, ty, 2.8 * t, 0, Math.PI * 2);
        e.fill();
      }
      return;
    }

    // =========================================================================
    // ENTRADA DA ESCADARIA NA SUPERFÍCIE (Poço de Mármore que DESCE ao Subsolo)
    // =========================================================================
    // 1. Sombra projetada ao redor do poço da escadaria
    e.fillStyle = "rgba(2, 6, 23, 0.45)";
    e.fillRect(-25 * wMul * t, -24 * hMul * t, 50 * wMul * t, (24 * hMul + 11) * t);

    // 2. Piso/Moldura externa de mármore travertino e borda dourada ao nível do solo
    e.fillStyle = "#cbd5e1";
    e.fillRect(-23 * wMul * t, -22 * hMul * t, 46 * wMul * t, (22 * hMul + 9) * t);
    e.strokeStyle = "#475569";
    e.lineWidth = 1.3 * t;
    e.strokeRect(-23 * wMul * t, -22 * hMul * t, 46 * wMul * t, (22 * hMul + 9) * t);

    // Friso grego dourado na borda externa da escadaria
    e.strokeStyle = "#d97706";
    e.lineWidth = 1.1 * t;
    e.strokeRect(-21 * wMul * t, -20 * hMul * t, 42 * wMul * t, (20 * hMul + 7) * t);

    // 3. Muretas Laterais (Parapeitos de Mármore 2.5D nas bordas esquerda, direita e fundo norte)
    e.fillStyle = "#f8fafc";
    e.fillRect(-22 * wMul * t, -26 * hMul * t, 44 * wMul * t, 6 * t);
    e.fillStyle = "#334155";
    e.fillRect(-22 * wMul * t, -28 * hMul * t, 44 * wMul * t, 2.5 * t);

    e.fillStyle = "#e2e8f0";
    e.fillRect(-22 * wMul * t, -22 * hMul * t, 6.5 * wMul * t, (22 * hMul + 8) * t);
    e.fillRect(15.5 * wMul * t, -22 * hMul * t, 6.5 * wMul * t, (22 * hMul + 8) * t);
    e.fillStyle = "#334155";
    e.fillRect(-21.5 * wMul * t, -22 * hMul * t, 5.5 * wMul * t, (22 * hMul + 6) * t);
    e.fillRect(16 * wMul * t, -22 * hMul * t, 5.5 * wMul * t, (22 * hMul + 6) * t);
    e.strokeStyle = "#f8fafc";
    e.lineWidth = 1 * t;
    e.strokeRect(-21.5 * wMul * t, -22 * hMul * t, 5.5 * wMul * t, (22 * hMul + 6) * t);
    e.strokeRect(16 * wMul * t, -22 * hMul * t, 5.5 * wMul * t, (22 * hMul + 6) * t);

    // 4. Vão Central da Escadaria (Fosso que desce da superfície para a escuridão do subsolo)
    const innerW = 31 * wMul * t,
      innerX = -15.5 * wMul * t,
      innerTopY = -20 * hMul * t,
      innerH = (20 * hMul + 8) * t;

    const voidGrad = e.createLinearGradient(0, innerTopY, 0, innerTopY + innerH);
    voidGrad.addColorStop(0, "#020617");
    voidGrad.addColorStop(0.45, "#09090b");
    voidGrad.addColorStop(0.8, "#1e293b");
    voidGrad.addColorStop(1, "#334155");
    e.fillStyle = voidGrad;
    e.fillRect(innerX, innerTopY, innerW, innerH);

    // 5. Degraus de Mármore em Perspectiva Descendo para o Subsolo
    const numSteps = isMerged ? 9 : 7;
    for (let s = 0; s < numSteps; s++) {
      const ratio = s / numSteps;
      const nextRatio = (s + 1) / numSteps;
      const stepY1 = 7 * t - ratio * (25 * hMul * t);
      const stepY2 = 7 * t - nextRatio * (25 * hMul * t);
      const stepH = Math.max(1.8 * t, stepY1 - stepY2);
      const inset = ratio * 4.5 * wMul * t;
      const sx = innerX + inset;
      const sw = innerW - inset * 2;

      const shade = Math.round(235 - ratio * 175);
      e.fillStyle = `rgb(${shade}, ${shade}, ${Math.min(255, shade + 8)})`;
      e.fillRect(sx, stepY2, sw, stepH * 0.72);

      const riserShade = Math.max(12, shade - 55);
      e.fillStyle = `rgb(${riserShade}, ${riserShade}, ${riserShade + 5})`;
      e.fillRect(sx, stepY2 + stepH * 0.72, sw, stepH * 0.28);
    }

    // 6. Pares de Colunas Dóricas guardando a entrada da escadaria
    const colPositions = isMerged
      ? [-18.5 * wMul, -11.5 * wMul, 11.5 * wMul, 18.5 * wMul]
      : [-18.5 * wMul, 18.5 * wMul];
    for (let i = 0; i < colPositions.length; i++) {
      const cx = colPositions[i] * t;
      e.fillStyle = "#94a3b8";
      e.fillRect(cx - 3.5 * t, -19 * hMul * t, 7 * t, 4 * t);
      e.fillStyle = "#f8fafc";
      e.fillRect(cx - 2.8 * t, -32 * hMul * t, 5.6 * t, 14 * hMul * t);
      e.fillStyle = "#cbd5e1";
      e.fillRect(cx + 0.5 * t, -32 * hMul * t, 2.3 * t, 14 * hMul * t);
      e.fillStyle = "#e2e8f0";
      e.fillRect(cx - 3.8 * t, -34.5 * hMul * t, 7.6 * t, 2.8 * t);
      e.fillStyle = "#f59e0b";
      e.fillRect(cx - 3.5 * t, -32.2 * hMul * t, 7 * t, 1 * t);
    }

    // Arquitrave / Portal de Mármore no topo norte da escadaria
    e.fillStyle = "#f1f5f9";
    e.fillRect(-22 * wMul * t, -37.5 * hMul * t, 44 * wMul * t, 4 * t);
    e.fillStyle = "#334155";
    e.fillRect(-23 * wMul * t, -39.5 * hMul * t, 46 * wMul * t, 2.2 * t);
    e.strokeStyle = "#fbbf24";
    e.lineWidth = 1 * t;
    e.strokeRect(-21 * wMul * t, -37 * hMul * t, 42 * wMul * t, 3 * t);

    // 7. Tochas / Arandelas de Bronze acesas nas laterais da escadaria
    const flicker = Math.sin((l || 0) * 6) * 0.15;
    for (const side of [-1, 1]) {
      const tx = side * 14.2 * wMul * t,
        ty = -6 * t;
      e.fillStyle = "#78350f";
      e.fillRect(tx - 1.2 * t, ty - 5 * t, 2.4 * t, 6 * t);
      e.fillStyle = `rgba(251, 191, 36, ${0.88 + flicker})`;
      e.beginPath();
      e.arc(tx, ty - 6.5 * t, 2.6 * t, 0, Math.PI * 2);
      e.fill();
    }
  }

  function bg(e, t, l, biome = null, isMerged = !1, mergedCount = 1, isStaircase = !1, isBarracksStaircase = !1, isPrisonDeepMine = !1) {
    if (isBarracksStaircase || (isStaircase && biome && (biome.id === "SNOW_PEAK" || biome.id === "SNOW_TAIGA" || biome.id === "GLACIER"))) {
      drawDungeonStaircase(e, t, !1, l);
      return;
    }
    if (isStaircase || (biome && biome.id === "MEADOW")) {
      drawRuinsSubterraneanStaircase(e, t, l, !1, isMerged);
      return;
    }
    const theme = getCaveBiomeTheme(biome);
    drawIrregularCaveRockFormation(e, t, theme, !1, isMerged, mergedCount);

    const archW = isMerged ? 1.25 : 1,
      archH = isMerged ? 1.32 : 1;

    // Boca escura irregular da caverna (arco rochoso facetado em vez de elipse redonda)
    const o = e.createRadialGradient(0, 0, 2 * t, 0, -4 * archH * t, 18 * archW * t);
    (o.addColorStop(0, "#000000"),
      o.addColorStop(0.7, "#09090b"),
      o.addColorStop(1, "#18181b"),
      (e.fillStyle = o),
      e.beginPath(),
      e.moveTo(-14 * archW * t, 4 * t),
      e.lineTo(-14 * archW * t, -8 * archH * t),
      e.lineTo(-10 * archW * t, -17 * archH * t),
      e.lineTo(-3 * archW * t, -20 * archH * t),
      e.lineTo(4 * archW * t, -20 * archH * t),
      e.lineTo(10 * archW * t, -16 * archH * t),
      e.lineTo(14 * archW * t, -8 * archH * t),
      e.lineTo(14 * archW * t, 4 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#27272a"),
      e.fillRect(-10 * archW * t, 0 * t, 20 * archW * t, 2.5 * t),
      (e.fillStyle = "#18181b"),
      e.fillRect(-8 * archW * t, 2.5 * t, 16 * archW * t, 2.5 * t),
      (e.fillStyle = "#451a03"),
      e.fillRect(-13 * archW * t, -16 * archH * t, 3.5 * t, (16 * archH + 2) * t),
      e.fillRect((13 * archW - 3.5) * t, -16 * archH * t, 3.5 * t, (16 * archH + 2) * t),
      (e.fillStyle = "#78350f"),
      e.fillRect(-14 * archW * t, -18 * archH * t, 28 * archW * t, 4 * t));

    // Apenas a Grande Mina dos Escavadores da Prisão possui lanterna acesa iluminando a entrada!
    if (isPrisonDeepMine) {
      e.strokeStyle = "#0f172a";
      e.lineWidth = 1.2 * t;
      e.beginPath();
      e.moveTo(6 * archW * t, -14 * archH * t);
      e.lineTo(6 * archW * t, -9 * archH * t);
      e.stroke();
      e.fillStyle = "#1e293b";
      e.fillRect((6 * archW - 2) * t, -9 * archH * t, 4 * t, 5.5 * t);
      const u = Math.sin(l * 6) * 0.15;
      e.fillStyle = `rgba(251, 191, 36, ${0.85 + u})`;
      e.fillRect((6 * archW - 1.2) * t, (-9 * archH + 0.8) * t, 2.4 * t, 3.8 * t);
    }

    // Cobertura de musgo da cor da grama (ou areia/neve conforme o bioma)
    drawCaveBiomeOverlay(e, t, theme, isMerged);
  }
  function yg(e, t, l = 0, biome = null, isMerged = !1, mergedCount = 1, isStaircase = !1, isBarracksStaircase = !1) {
    if (isBarracksStaircase || (isStaircase && biome && (biome.id === "SNOW_PEAK" || biome.id === "SNOW_TAIGA" || biome.id === "GLACIER"))) {
      drawDungeonStaircase(e, t, !0, l);
      return;
    }
    if (isStaircase || (biome && biome.id === "MEADOW")) {
      drawRuinsSubterraneanStaircase(e, t, l, !0, isMerged);
      return;
    }
    const theme = getCaveBiomeTheme(biome);
    drawIrregularCaveRockFormation(e, t, theme, !0, isMerged, mergedCount);

    const archW = isMerged ? 1.25 : 1,
      archH = isMerged ? 1.32 : 1;

    const exitColors = getSurfaceExitWeatherColors(biome);

    // Luz da saída saindo pelo arco rochoso irregular (reflete o clima real da superfície!)
    const o = e.createLinearGradient(0, -20 * archH * t, 0, 4 * t);
    o.addColorStop(0, exitColors.skyTop);
    o.addColorStop(0.35, exitColors.skyMid);
    o.addColorStop(1, exitColors.skyBottom);
    e.fillStyle = o;
    e.beginPath();
    e.moveTo(-14 * archW * t, 4 * t);
    e.lineTo(-14 * archW * t, -8 * archH * t);
    e.lineTo(-10 * archW * t, -17 * archH * t);
    e.lineTo(-3 * archW * t, -20 * archH * t);
    e.lineTo(4 * archW * t, -20 * archH * t);
    e.lineTo(10 * archW * t, -16 * archH * t);
    e.lineTo(14 * archW * t, -8 * archH * t);
    e.lineTo(14 * archW * t, 4 * t);
    e.closePath();
    e.fill();

    // Gotas de chuva, flocos de neve ou partículas de areia visíveis na boca da caverna
    if (exitColors.weatherType === "rain" || exitColors.weatherType === "thunderstorm") {
      e.save();
      e.beginPath();
      e.moveTo(-14 * archW * t, 4 * t);
      e.lineTo(-14 * archW * t, -8 * archH * t);
      e.lineTo(-10 * archW * t, -17 * archH * t);
      e.lineTo(-3 * archW * t, -20 * archH * t);
      e.lineTo(4 * archW * t, -20 * archH * t);
      e.lineTo(10 * archW * t, -16 * archH * t);
      e.lineTo(14 * archW * t, -8 * archH * t);
      e.lineTo(14 * archW * t, 4 * t);
      e.closePath();
      e.clip();

      e.strokeStyle = "rgba(186, 230, 253, 0.7)";
      e.lineWidth = 1 * t;
      const timeOff = (l || 0) * 22;
      for (let ri = -12; ri <= 12; ri += 3.2) {
        const rx = ri * archW * t;
        const ry = -19 * archH * t + (((ri * 7 + timeOff) % 22) * archH * t);
        e.beginPath();
        e.moveTo(rx, ry);
        e.lineTo(rx - 1.8 * t, ry + 4.5 * t);
        e.stroke();
      }
      e.restore();
    } else if (exitColors.weatherType === "snow") {
      e.save();
      e.beginPath();
      e.moveTo(-14 * archW * t, 4 * t);
      e.lineTo(-14 * archW * t, -8 * archH * t);
      e.lineTo(-10 * archW * t, -17 * archH * t);
      e.lineTo(-3 * archW * t, -20 * archH * t);
      e.lineTo(4 * archW * t, -20 * archH * t);
      e.lineTo(10 * archW * t, -16 * archH * t);
      e.lineTo(14 * archW * t, -8 * archH * t);
      e.lineTo(14 * archW * t, 4 * t);
      e.closePath();
      e.clip();

      e.fillStyle = "rgba(255, 255, 255, 0.9)";
      const timeOff = (l || 0) * 9;
      for (let si = -11; si <= 11; si += 3.8) {
        const sx = si * archW * t + Math.sin((l || 0) * 3 + si) * 2 * t;
        const sy = -19 * archH * t + (((si * 5 + timeOff) % 22) * archH * t);
        e.beginPath();
        e.arc(sx, sy, 1.2 * t, 0, Math.PI * 2);
        e.fill();
      }
      e.restore();
    } else if (exitColors.weatherType === "sandstorm") {
      e.save();
      e.beginPath();
      e.moveTo(-14 * archW * t, 4 * t);
      e.lineTo(-14 * archW * t, -8 * archH * t);
      e.lineTo(-10 * archW * t, -17 * archH * t);
      e.lineTo(-3 * archW * t, -20 * archH * t);
      e.lineTo(4 * archW * t, -20 * archH * t);
      e.lineTo(10 * archW * t, -16 * archH * t);
      e.lineTo(14 * archW * t, -8 * archH * t);
      e.lineTo(14 * archW * t, 4 * t);
      e.closePath();
      e.clip();

      e.fillStyle = "rgba(245, 158, 11, 0.35)";
      const timeOff = (l || 0) * 25;
      for (let si = -12; si <= 12; si += 4) {
        const sx = si * archW * t + ((timeOff % 10) * t);
        const sy = -18 * archH * t + (((si * 7) % 20) * archH * t);
        e.fillRect(sx, sy, 2.5 * t, 1 * t);
      }
      e.restore();
    }

    // Feixe e cone de claridade projetado no chão da caverna
    const r = e.createLinearGradient(0, -2 * t, 0, 16 * t);
    r.addColorStop(0, exitColors.floorColor);
    r.addColorStop(0.5, exitColors.floorColor.replace(/[\d\.]+\)$/, "0.06)"));
    r.addColorStop(1, "rgba(0, 0, 0, 0)");
    e.fillStyle = r;
    e.beginPath();
    e.moveTo(-11 * archW * t, -2 * t);
    e.lineTo(11 * archW * t, -2 * t);
    e.lineTo(20 * archW * t, 14 * t);
    e.lineTo(-20 * archW * t, 14 * t);
    e.closePath();
    e.fillStyle = "#334155";
    e.fillRect(-10 * archW * t, 0 * t, 20 * archW * t, 2.5 * t);
    e.fillStyle = "#1e293b";
    e.fillRect(-8 * archW * t, 2.5 * t, 16 * archW * t, 2.5 * t);
    e.fillStyle = "#451a03";
    e.fillRect(-13 * archW * t, -16 * archH * t, 3.5 * t, (16 * archH + 2) * t);
    e.fillRect((13 * archW - 3.5) * t, -16 * archH * t, 3.5 * t, (16 * archH + 2) * t);
    e.fillStyle = "#78350f";
    e.fillRect(-14 * archW * t, -18 * archH * t, 28 * archW * t, 4 * t);
    e.fillStyle = "#451a03";
    e.fillRect(-10 * t, (-23 * archH) * t, 20 * t, 5 * t);
    e.fillStyle = "#92400e";
    e.fillRect(-9 * t, (-23 * archH + 1) * t, 18 * t, 4 * t);
    e.fillStyle = "#fef08a";
    e.font = `bold ${Math.round(3.5 * t)}px sans-serif`;
    e.textAlign = "center";
    e.fillText("▲ SAÍDA", 0, (-23 * archH + 4) * t);
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(6 * archW * t, -14 * archH * t);
    e.lineTo(6 * archW * t, -9 * archH * t);
    e.stroke();
    e.fillStyle = "#1e293b";
    e.fillRect((6 * archW - 2) * t, -9 * archH * t, 4 * t, 5.5 * t);
    const u = Math.sin((l || 0) * 6) * 0.15;
    e.fillStyle = `rgba(251, 191, 36, ${0.85 + u})`;
    e.fillRect((6 * archW - 1.2) * t, (-9 * archH + 0.8) * t, 2.4 * t, 3.8 * t);

    // Cobertura de musgo/arenito/neve seguindo o bioma da superfície correspondente
    drawCaveBiomeOverlay(e, t, theme, isMerged);
  }
  function drawLargeCaveRock(e, t, l = 0, biome = null, isMerged = !1, mergedCount = 1, subType = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    const theme = getCaveBiomeTheme(biome);
    const wMul = isMerged ? 1.32 : 1;
    const hMul = isMerged ? 1.48 : 1;

    // 1. Desenha a formação rochosa irregular base (mesmo porte das cavernas)
    drawIrregularCaveRockFormation(e, t, theme, !1, isMerged, mergedCount);

    // 2. Preenche o centro frontal com um paredão/bloco rochoso maciço (sem abertura de caverna e sem lanterna)
    e.fillStyle = theme.rockOuter;
    e.beginPath();
    e.moveTo(-17 * wMul * t, 6 * t);
    e.lineTo(-19 * wMul * t, -9 * hMul * t);
    e.lineTo(-11 * wMul * t, -23 * hMul * t);
    e.lineTo(0, -27 * hMul * t);
    e.lineTo(12 * wMul * t, -22 * hMul * t);
    e.lineTo(18 * wMul * t, -8 * hMul * t);
    e.lineTo(16 * wMul * t, 6 * t);
    e.closePath();
    e.fill();

    // Facetas frontais de rocha bruta maciça
    e.fillStyle = theme.rockMid;
    e.beginPath();
    e.moveTo(-14 * wMul * t, 5 * t);
    e.lineTo(-15 * wMul * t, -8 * hMul * t);
    e.lineTo(-8 * wMul * t, -20 * hMul * t);
    e.lineTo(2 * wMul * t, -23 * hMul * t);
    e.lineTo(11 * wMul * t, -16 * hMul * t);
    e.lineTo(13 * wMul * t, 5 * t);
    e.closePath();
    e.fill();

    // Planos de luz na face central da grande rocha
    e.fillStyle = theme.rockLight;
    e.beginPath();
    e.moveTo(-9 * wMul * t, -5 * hMul * t);
    e.lineTo(-6 * wMul * t, -18 * hMul * t);
    e.lineTo(3 * wMul * t, -20 * hMul * t);
    e.lineTo(6 * wMul * t, -7 * hMul * t);
    e.lineTo(-2 * wMul * t, 1 * t);
    e.closePath();
    e.fill();

    // Fissuras e veios naturais de rocha fechada
    e.strokeStyle = theme.stratumCol;
    e.lineWidth = 1.4 * t;
    e.beginPath();
    e.moveTo(-11 * wMul * t, -14 * hMul * t);
    e.lineTo(-2 * wMul * t, -9 * hMul * t);
    e.lineTo(8 * wMul * t, -12 * hMul * t);
    e.moveTo(-3 * wMul * t, -9 * hMul * t);
    e.lineTo(1 * wMul * t, 3 * t);
    e.stroke();

    // Pedregulhos frontais encostados na base da grande rocha
    const frontBoulders = [
      { x: -9 * wMul, y: 5.5, rx: 6.5 * wMul, ry: 4.2, col: theme.rockOuter },
      { x: 8 * wMul, y: 5.5, rx: 6.8 * wMul, ry: 4.4, col: theme.rockOuter },
      { x: 0, y: 6.2, rx: 7.5 * wMul, ry: 4.6, col: theme.rockMid },
      { x: -1 * wMul, y: 4.8, rx: 4.8 * wMul, ry: 3.0, col: theme.rockLight },
    ];
    for (let i = 0; i < frontBoulders.length; i++) {
      const b = frontBoulders[i];
      e.fillStyle = b.col;
      e.beginPath();
      e.moveTo((b.x - b.rx) * t, b.y * t);
      e.lineTo((b.x - b.rx * 0.65) * t, (b.y - b.ry) * t);
      e.lineTo((b.x + b.rx * 0.55) * t, (b.y - b.ry * 0.9) * t);
      e.lineTo((b.x + b.rx) * t, b.y * t);
      e.closePath();
      e.fill();
    }

    // 3. Cobertura de musgo/areia/neve do bioma
    drawCaveBiomeOverlay(e, t, theme, isMerged);
    e.restore();
  }
  function drawCaveExitStalactites(e, t = 1, subType = 0, animTimer = 0, isMerged = !1, surfaceBiome = null) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    const wMul = isMerged ? 1.25 : 1;
    const hMul = isMerged ? 1.2 : 1;
    const isDesert = surfaceBiome && (surfaceBiome.id === "DESERT" || surfaceBiome.id === "CANYON");

    const colBase = isDesert ? "#2e1205" : "#1c1917";
    const colDark = isDesert ? "#451a03" : "#292524";
    const colMid = isDesert ? "#78350f" : "#44403c";
    const colLight = isDesert ? "#b45309" : "#78716c";
    const colHighlight = isDesert ? "#fde68a" : "#e7e5e4";

    e.save();

    // 1. Sombra e base rochosa somente no CHÃO da caverna (sem nada pendurado do teto!)
    e.fillStyle = "rgba(0, 0, 0, 0.55)";
    e.beginPath();
    e.ellipse(0, 4.5 * t, 17 * wMul * t, 7 * t, 0, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = colBase;
    e.beginPath();
    e.ellipse(0, 3.5 * t, 14 * wMul * t, 5.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2. Aglomerado de Estalagmites brotando do chão para cima (estilo Tg ampliado)
    const cones = [
      { x: -9.5 * wMul, y: 2.5, w: 6.8 * wMul, h: 15 * hMul },
      { x: 9.2 * wMul, y: 2.8, w: 6.5 * wMul, h: 14 * hMul },
      { x: -4.8 * wMul, y: 3.2, w: 7.8 * wMul, h: 21 * hMul },
      { x: 4.8 * wMul, y: 3.2, w: 7.5 * wMul, h: 19.5 * hMul },
      { x: 0, y: 3.8, w: 9.6 * wMul, h: 26 * hMul },
    ];

    for (let i = 0; i < cones.length; i++) {
      const c = cones[i];
      const cx = c.x * t;
      const baseY = c.y * t;
      const hw = (c.w * 0.5) * t;
      const tipY = baseY - c.h * t;

      // Base circular de cada estalagmite no chão
      e.fillStyle = colDark;
      e.beginPath();
      e.ellipse(cx, baseY + 0.8 * t, hw * 0.95, 2.8 * t, 0, 0, Math.PI * 2);
      e.fill();

      // Corpo principal da estalagmite apontando para cima
      e.fillStyle = colMid;
      e.beginPath();
      e.moveTo(cx - hw, baseY);
      e.lineTo(cx, tipY);
      e.lineTo(cx + hw, baseY);
      e.closePath();
      e.fill();

      // Face esquerda iluminada (igual às estalagmites do chão da caverna)
      e.fillStyle = colLight;
      e.beginPath();
      e.moveTo(cx - hw, baseY);
      e.lineTo(cx, tipY);
      e.lineTo(cx, baseY);
      e.closePath();
      e.fill();

      // Ponto de brilho mineral no topo da estalagmite
      e.fillStyle = colHighlight;
      e.beginPath();
      e.arc(cx, tipY + 1.5 * t, 1.1 * t, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }
  function vg(e, t, l, o = !1) {
    if (
      ((e.fillStyle = "#1c1917"),
      e.beginPath(),
      e.ellipse(0, 3 * t, 13 * t, 6 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#292524"),
      e.beginPath(),
      e.ellipse(0, 2 * t, 10 * t, 4.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      o)
    ) {
      ((e.fillStyle = "#a855f7"),
        e.beginPath(),
        e.moveTo(-3 * t, 2 * t),
        e.lineTo(-2 * t, -2 * t),
        e.lineTo(0, 2 * t),
        e.fill(),
        (e.fillStyle = "#cbd5e1"),
        e.fillRect(1 * t, 1 * t, 3 * t, 2 * t));
      return;
    }
    const u = [
        ["#581c87", "#9333ea", "#c084fc", "#f3e8ff"],
        ["#0369a1", "#0284c7", "#38bdf8", "#e0f2fe"],
        ["#9f1239", "#e11d48", "#fb7185", "#ffe4e6"],
        ["#065f46", "#059669", "#34d399", "#d1fae5"],
      ],
      m = u[l % u.length];
    e.save();
    const c = [
      { x: -5 * t, y: 3 * t, w: 4 * t, h: 14 * t, angle: -0.22 },
      { x: 0, y: 3 * t, w: 5 * t, h: 22 * t, angle: 0.05 },
      { x: 5 * t, y: 3 * t, w: 4.5 * t, h: 16 * t, angle: 0.26 },
      { x: -2 * t, y: 4 * t, w: 3 * t, h: 10 * t, angle: -0.1 },
    ];
    for (const f of c)
      (e.save(),
        e.translate(f.x, f.y),
        e.rotate(f.angle),
        (e.fillStyle = m[0]),
        e.beginPath(),
        e.moveTo(-f.w / 2, 0),
        e.lineTo(0, -f.h),
        e.lineTo(f.w / 2, 0),
        e.closePath(),
        e.fill(),
        (e.fillStyle = m[1]),
        e.beginPath(),
        e.moveTo(-f.w / 2, 0),
        e.lineTo(0, -f.h),
        e.lineTo(0, 0),
        e.closePath(),
        e.fill(),
        (e.fillStyle = m[2]),
        e.beginPath(),
        e.moveTo(0, 0),
        e.lineTo(0, -f.h),
        e.lineTo(f.w / 4, -f.h * 0.4),
        e.closePath(),
        e.fill(),
        (e.fillStyle = m[3]),
        e.fillRect(-0.6 * t, -f.h, 1.2 * t, 2 * t),
        e.restore());
    e.restore();
  }
  function wg(e, t, l, o = !1) {
    if (
      ((e.fillStyle = "#292524"),
      e.beginPath(),
      e.moveTo(-11 * t, 4 * t),
      e.lineTo(-13 * t, -4 * t),
      e.lineTo(-7 * t, -14 * t),
      e.lineTo(5 * t, -15 * t),
      e.lineTo(12 * t, -6 * t),
      e.lineTo(11 * t, 4 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#44403c"),
      e.beginPath(),
      e.moveTo(-7 * t, -14 * t),
      e.lineTo(5 * t, -15 * t),
      e.lineTo(0 * t, -4 * t),
      e.lineTo(-11 * t, -4 * t),
      e.closePath(),
      e.fill(),
      o)
    ) {
      ((e.fillStyle = "#0c0a09"),
        e.beginPath(),
        e.ellipse(0, -5 * t, 5 * t, 3.5 * t, 0, 0, Math.PI * 2),
        e.fill());
      return;
    }
    const u = [
        ["#d97706", "#fbbf24", "#fef08a"],
        ["#0284c7", "#38bdf8", "#e0f2fe"],
        ["#64748b", "#cbd5e1", "#f8fafc"],
      ],
      m = u[l % u.length],
      c = [
        { x: -4 * t, y: -8 * t, r: 2.8 * t },
        { x: 1 * t, y: -10 * t, r: 3.2 * t },
        { x: -1 * t, y: -4 * t, r: 2.5 * t },
        { x: 5 * t, y: -7 * t, r: 2.4 * t },
      ];
    for (const f of c)
      ((e.fillStyle = m[0]),
        e.beginPath(),
        e.arc(f.x, f.y, f.r, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = m[1]),
        e.beginPath(),
        e.arc(f.x - f.r * 0.25, f.y - f.r * 0.25, f.r * 0.7, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = m[2]),
        e.beginPath(),
        e.arc(f.x - f.r * 0.4, f.y - f.r * 0.4, f.r * 0.35, 0, Math.PI * 2),
        e.fill());
  }
  function Tg(e, t, l) {
    const o = (l === 0 ? 18 : l === 1 ? 24 : 14) * t,
      u = 8 * t;
    ((e.fillStyle = "#292524"),
      e.beginPath(),
      e.ellipse(0, 3 * t, 7 * t, 3.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#44403c"),
      e.beginPath(),
      e.moveTo(-u / 2, 2 * t),
      e.lineTo(0, -o),
      e.lineTo(u / 2, 2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#78716c"),
      e.beginPath(),
      e.moveTo(-u / 2, 2 * t),
      e.lineTo(0, -o),
      e.lineTo(0, 2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#e7e5e4"),
      e.beginPath(),
      e.arc(0, -o + 1.5 * t, 1.2 * t, 0, Math.PI * 2),
      e.fill());
  }
  function Sg(e, t) {
    ((e.fillStyle = "#451a03"),
      e.fillRect(-12 * t, 2 * t, 24 * t, 3 * t),
      (e.fillStyle = "#94a3b8"),
      e.fillRect(-14 * t, 0, 28 * t, 1.5 * t),
      e.fillRect(-14 * t, 4 * t, 28 * t, 1.5 * t),
      (e.fillStyle = "#334155"),
      e.beginPath(),
      e.arc(-7 * t, 1 * t, 3.2 * t, 0, Math.PI * 2),
      e.arc(7 * t, 1 * t, 3.2 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#78350f"),
      e.beginPath(),
      e.moveTo(-10 * t, 0),
      e.lineTo(-12 * t, -9 * t),
      e.lineTo(12 * t, -9 * t),
      e.lineTo(10 * t, 0),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#475569"),
      (e.lineWidth = 1.5 * t),
      e.stroke(),
      (e.fillStyle = "#fbbf24"),
      e.beginPath(),
      e.arc(-4 * t, -10 * t, 3 * t, 0, Math.PI * 2),
      e.arc(2 * t, -11 * t, 3.5 * t, 0, Math.PI * 2),
      e.arc(6 * t, -10 * t, 2.5 * t, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#c084fc"),
      e.beginPath(),
      e.arc(0, -12 * t, 2 * t, 0, Math.PI * 2),
      e.fill());
  }
  function kP(e, t, l) {
    const o = l === 0,
      u = o ? "#0d9488" : "#a855f7",
      m = o ? "rgba(45, 212, 191, 0.08)" : "rgba(168, 85, 247, 0.08)",
      c = o ? "#ccfbf1" : "#f3e8ff";
    ((e.fillStyle = m),
      e.beginPath(),
      e.ellipse(0, 3 * t, 6 * t, 3 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = c),
      e.beginPath(),
      e.moveTo(-1.5 * t, 2 * t),
      e.quadraticCurveTo(-0.5 * t, -5 * t, -1 * t, -8 * t),
      e.lineTo(1 * t, -8 * t),
      e.quadraticCurveTo(1.2 * t, -5 * t, 1.5 * t, 2 * t),
      e.closePath(),
      e.fill(),
      (e.fillStyle = u),
      e.beginPath(),
      e.arc(0, -8 * t, 6 * t, Math.PI, 0),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#e2e8f0"),
      e.beginPath(),
      e.arc(-2.5 * t, -11 * t, 0.9 * t, 0, Math.PI * 2),
      e.arc(2 * t, -12 * t, 1 * t, 0, Math.PI * 2),
      e.arc(0, -9.5 * t, 0.8 * t, 0, Math.PI * 2),
      e.fill());
  }
  function Mg(e, t, l = 0, o = !1) {
    e.save();
    const u = Math.sin(l * 2.2) * 0.12 + 0.88;
    if (
      ((e.fillStyle = "rgba(124, 45, 18, 0.28)"),
      e.beginPath(),
      e.ellipse(0, 4 * t, 14 * t, 7 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "rgba(254, 215, 170, 0.4)"),
      (e.lineWidth = 1.2 * t),
      e.beginPath(),
      e.ellipse(0, 4 * t, 16 * t * u, 8 * t * u, 0, 0, Math.PI * 2),
      e.stroke(),
      (e.fillStyle = "#431407"),
      e.beginPath(),
      e.ellipse(0, 2 * t, 12 * t, 6.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.ellipse(-1 * t, 0, 10.5 * t, 5.5 * t, -0.05, 0, Math.PI * 2),
      e.fill(),
      o)
    )
      ((e.fillStyle = "#451a03"),
        e.beginPath(),
        e.ellipse(0, -1 * t, 8 * t, 4 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(14, 165, 233, 0.45)"),
        e.beginPath(),
        e.ellipse(0, -0.5 * t, 6 * t, 2.8 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#9a3412"),
        (e.lineWidth = 1.2 * t),
        e.beginPath(),
        e.arc(0, -1 * t, 6.5 * t, 0.3, Math.PI - 0.3),
        e.stroke());
    else {
      ((e.fillStyle = "#9a3412"),
        e.beginPath(),
        e.ellipse(0, -2 * t, 9 * t, 5 * t, 0.04, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#c2410c"),
        e.beginPath(),
        e.ellipse(-1.2 * t, -4.5 * t, 7 * t, 4.2 * t, -0.08, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ea580c"),
        e.beginPath(),
        e.ellipse(0.5 * t, -6 * t, 5 * t, 2.8 * t, 0.05, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#9a3412"),
        e.beginPath(),
        e.ellipse(5.5 * t, -0.5 * t, 4.2 * t, 3 * t, 0.3, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#c2410c"),
        e.beginPath(),
        e.ellipse(5 * t, -1.2 * t, 3.2 * t, 2.2 * t, 0.25, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#7c2d12"),
        (e.lineWidth = 1.3 * t),
        e.beginPath(),
        e.arc(-1 * t, -3.5 * t, 4.5 * t, 0.4, 2.2),
        e.stroke(),
        e.beginPath(),
        e.arc(1.5 * t, -2.5 * t, 3.8 * t, 0.2, 1.8),
        e.stroke(),
        (e.fillStyle = "rgba(255, 247, 237, 0.75)"),
        e.beginPath(),
        e.ellipse(-2.2 * t, -6.8 * t, 2.4 * t, 1.1 * t, -0.2, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(254, 215, 170, 0.6)"),
        e.beginPath(),
        e.ellipse(3.8 * t, -2.5 * t, 1.6 * t, 0.8 * t, 0.3, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#15803d"),
        e.beginPath(),
        e.moveTo(-6 * t, 2 * t),
        e.quadraticCurveTo(-7.5 * t, -5 * t, -9 * t, -11 * t),
        e.quadraticCurveTo(-6.8 * t, -5 * t, -5.2 * t, 2 * t),
        e.fill(),
        (e.fillStyle = "#22c55e"),
        e.beginPath(),
        e.moveTo(-4.5 * t, 2 * t),
        e.quadraticCurveTo(-5 * t, -4 * t, -5.5 * t, -9 * t),
        e.quadraticCurveTo(-4.2 * t, -4 * t, -3.8 * t, 2 * t),
        e.fill());
      const m = -8 * t - ((l * 8) % (12 * t)),
        c = Math.sin((((l * 8) % (12 * t)) / (12 * t)) * Math.PI);
      ((e.fillStyle = `rgba(254, 215, 170, ${c * 0.75})`),
        e.beginPath(),
        e.arc(2.5 * t, m, 1.2 * t, 0, Math.PI * 2),
        e.fill());
      const f = Math.sin(l * 3.5);
      if (f > 0.6) {
        const g = (f - 0.6) / 0.4;
        ((e.fillStyle = `rgba(255, 255, 255, ${g * 0.9})`),
          e.beginPath(),
          e.arc(-1.5 * t, -7 * t, 1.5 * t, 0, Math.PI * 2),
          e.fill());
      }
    }
    e.restore();
  }
  function Cg(e, t, l = 0, o = "pote", u = 0, m = 12e4) {
    e.save();
    const c = Math.max(0, Date.now() - u),
      f = Math.min(1, Math.max(0, c / m)),
      g = f >= 1;
    ((e.fillStyle = "rgba(28, 25, 23, 0.45)"),
      e.beginPath(),
      e.ellipse(0, 3 * t, 11 * t, 5.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#78716c"),
      e.beginPath(),
      e.ellipse(0, 2.5 * t, 10 * t, 5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "#a8a29e"),
      (e.lineWidth = 0.8 * t),
      e.stroke());
    const y = Math.round(110 + f * 84),
      w = Math.round(40 + f * 48),
      v = Math.round(15 + f * 15),
      T = `rgb(${y}, ${w}, ${v})`,
      S = `rgb(${Math.round(y * 0.65)}, ${Math.round(w * 0.65)}, ${Math.round(v * 0.65)})`,
      p = `rgb(${Math.min(255, y + 45)}, ${Math.min(255, w + 35)}, ${Math.min(255, v + 25)})`;
    o === "frasco"
      ? ((e.fillStyle = S),
        e.beginPath(),
        e.ellipse(0, 1 * t, 6.5 * t, 4 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = T),
        e.beginPath(),
        e.ellipse(0, -2 * t, 6 * t, 5.5 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = T),
        e.fillRect(-2.2 * t, -11 * t, 4.4 * t, 6 * t),
        (e.fillStyle = p),
        e.beginPath(),
        e.ellipse(0, -11 * t, 3.2 * t, 1.4 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = S),
        (e.lineWidth = 1.6 * t),
        e.beginPath(),
        e.arc(4.2 * t, -4.5 * t, 2.8 * t, -Math.PI / 2, Math.PI / 2),
        e.stroke(),
        g ||
          ((e.fillStyle = "rgba(255, 255, 255, 0.4)"),
          e.beginPath(),
          e.ellipse(-1.8 * t, -3.5 * t, 1.2 * t, 2.2 * t, -0.3, 0, Math.PI * 2),
          e.fill()))
      : o === "jarra"
        ? ((e.fillStyle = S),
          e.beginPath(),
          e.ellipse(0, 1 * t, 7 * t, 4.2 * t, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = T),
          e.beginPath(),
          e.ellipse(0, -3 * t, 6.8 * t, 6.5 * t, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = p),
          e.beginPath(),
          e.moveTo(-3 * t, -6 * t),
          e.lineTo(-2 * t, -12 * t),
          e.lineTo(3.5 * t, -12.5 * t),
          e.lineTo(2.5 * t, -6 * t),
          e.closePath(),
          e.fill(),
          (e.fillStyle = S),
          e.beginPath(),
          e.ellipse(0.5 * t, -12 * t, 2.8 * t, 1.2 * t, 0, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = p),
          (e.lineWidth = 1.8 * t),
          e.beginPath(),
          e.moveTo(-2 * t, -11 * t),
          e.quadraticCurveTo(-6 * t, -7 * t, -3 * t, -2 * t),
          e.stroke(),
          g ||
            ((e.fillStyle = "rgba(255, 255, 255, 0.35)"),
            e.beginPath(),
            e.ellipse(1 * t, -4 * t, 1.4 * t, 3 * t, 0.2, 0, Math.PI * 2),
            e.fill()))
        : o === "panela"
          ? ((e.fillStyle = S),
            e.beginPath(),
            e.ellipse(0, 1 * t, 8.5 * t, 4.8 * t, 0, 0, Math.PI * 2),
            e.fill(),
            (e.fillStyle = T),
            e.beginPath(),
            e.ellipse(0, -2 * t, 8.2 * t, 5 * t, 0, 0, Math.PI * 2),
            e.fill(),
            (e.fillStyle = p),
            e.beginPath(),
            e.ellipse(0, -5.5 * t, 7.8 * t, 2.6 * t, 0, 0, Math.PI * 2),
            e.fill(),
            (e.fillStyle = S),
            e.beginPath(),
            e.ellipse(0, -5.5 * t, 6.2 * t, 1.9 * t, 0, 0, Math.PI * 2),
            e.fill(),
            (e.strokeStyle = p),
            (e.lineWidth = 1.8 * t),
            e.beginPath(),
            e.arc(-7.2 * t, -3 * t, 2 * t, Math.PI / 2, -Math.PI / 2, !1),
            e.stroke(),
            e.beginPath(),
            e.arc(7.2 * t, -3 * t, 2 * t, -Math.PI / 2, Math.PI / 2, !1),
            e.stroke(),
            g ||
              ((e.fillStyle = "rgba(255, 255, 255, 0.35)"),
              e.beginPath(),
              e.ellipse(-2 * t, -2 * t, 2.5 * t, 1.2 * t, 0, 0, Math.PI * 2),
              e.fill()))
          : o === "caldeirao"
            ? ((e.fillStyle = S),
              e.fillRect(-5.5 * t, 1.5 * t, 2 * t, 2.5 * t),
              e.fillRect(3.5 * t, 1.5 * t, 2 * t, 2.5 * t),
              e.fillRect(-1 * t, 2 * t, 2 * t, 2.5 * t),
              (e.fillStyle = S),
              e.beginPath(),
              e.ellipse(0, -0.5 * t, 8.5 * t, 5.5 * t, 0, 0, Math.PI * 2),
              e.fill(),
              (e.fillStyle = T),
              e.beginPath(),
              e.ellipse(0, -2.5 * t, 8 * t, 5.2 * t, 0, 0, Math.PI * 2),
              e.fill(),
              (e.fillStyle = p),
              e.beginPath(),
              e.ellipse(0, -7 * t, 7 * t, 2.5 * t, 0, 0, Math.PI * 2),
              e.fill(),
              (e.fillStyle = S),
              e.beginPath(),
              e.ellipse(0, -7 * t, 5.5 * t, 1.8 * t, 0, 0, Math.PI * 2),
              e.fill(),
              (e.strokeStyle = p),
              (e.lineWidth = 2 * t),
              e.beginPath(),
              e.arc(-7 * t, -4 * t, 2.2 * t, Math.PI / 2, -Math.PI / 2, !1),
              e.stroke(),
              e.beginPath(),
              e.arc(7 * t, -4 * t, 2.2 * t, -Math.PI / 2, Math.PI / 2, !1),
              e.stroke(),
              g ||
                ((e.fillStyle = "rgba(255, 255, 255, 0.35)"),
                e.beginPath(),
                e.ellipse(
                  -3 * t,
                  -2.5 * t,
                  2.5 * t,
                  1.2 * t,
                  -0.2,
                  0,
                  Math.PI * 2,
                ),
                e.fill()))
            : o === "tijolo"
              ? ((e.fillStyle = S),
                e.beginPath(),
                e.moveTo(-6 * t, 2 * t),
                e.lineTo(4 * t, 3.5 * t),
                e.lineTo(7 * t, 1 * t),
                e.lineTo(-3 * t, -0.5 * t),
                e.closePath(),
                e.fill(),
                (e.fillStyle = p),
                e.beginPath(),
                e.moveTo(-6 * t, -4 * t),
                e.lineTo(4 * t, -2.5 * t),
                e.lineTo(7 * t, -5 * t),
                e.lineTo(-3 * t, -6.5 * t),
                e.closePath(),
                e.fill(),
                (e.fillStyle = T),
                e.beginPath(),
                e.moveTo(-6 * t, -4 * t),
                e.lineTo(4 * t, -2.5 * t),
                e.lineTo(4 * t, 3.5 * t),
                e.lineTo(-6 * t, 2 * t),
                e.closePath(),
                e.fill())
              : ((e.fillStyle = S),
                e.beginPath(),
                e.ellipse(0, 1 * t, 7 * t, 4.2 * t, 0, 0, Math.PI * 2),
                e.fill(),
                (e.fillStyle = T),
                e.beginPath(),
                e.ellipse(0, -2.5 * t, 7 * t, 6 * t, 0, 0, Math.PI * 2),
                e.fill(),
                (e.fillStyle = p),
                e.beginPath(),
                e.ellipse(0, -8 * t, 5 * t, 2 * t, 0, 0, Math.PI * 2),
                e.fill(),
                (e.fillStyle = S),
                e.beginPath(),
                e.ellipse(0, -8 * t, 3.8 * t, 1.4 * t, 0, 0, Math.PI * 2),
                e.fill(),
                (e.strokeStyle = S),
                (e.lineWidth = 0.9 * t),
                e.beginPath(),
                e.ellipse(0, -2 * t, 6.4 * t, 2.4 * t, 0, 0.2, Math.PI - 0.2),
                e.stroke(),
                g ||
                  ((e.fillStyle = "rgba(255, 255, 255, 0.4)"),
                  e.beginPath(),
                  e.ellipse(
                    -2.2 * t,
                    -3.5 * t,
                    1.5 * t,
                    2.5 * t,
                    -0.25,
                    0,
                    Math.PI * 2,
                  ),
                  e.fill()));
    const j = -18 * t + Math.sin(l * 2.5) * 1.5;
    if (g) {
      const P = 44 * t,
        A = 13 * t,
        x = Math.sin(l * 4) * 0.15 + 0.85;
      ((e.fillStyle = "rgba(6, 78, 59, 0.9)"),
        e.beginPath(),
        e.roundRect(-P / 2, j - A / 2, P, A, 5 * t),
        e.fill(),
        (e.strokeStyle = `rgba(52, 211, 153, ${x})`),
        (e.lineWidth = 1.2 * t),
        e.stroke(),
        (e.fillStyle = "#6ee7b7"),
        (e.font = `bold ${Math.max(9, Math.round(7.5 * t))}px sans-serif`),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        e.fillText("✨ Pronto [F]", 0, j));
      for (let M = 0; M < 3; M++) {
        const $ = l * 2.5 + (M * Math.PI * 2) / 3,
          z = Math.cos($) * (9 * t),
          K = Math.sin($) * (5 * t) - 3 * t;
        ((e.fillStyle = "#fde047"),
          e.beginPath(),
          e.arc(z, K, 1.2 * t, 0, Math.PI * 2),
          e.fill());
      }
    }
    e.restore();
  }
  function Pg(e, t, l, o = !0, u) {
    (e.save(),
      (e.fillStyle = "rgba(15, 23, 42, 0.45)"),
      e.beginPath(),
      e.ellipse(0, 4 * t, 15 * t, 7 * t, 0, 0, Math.PI * 2),
      e.fill());
    const m = 2 * t;
    for (let f = 0; f < Math.PI * 2; f += Math.PI / 5) {
      const g = Math.cos(f) * 11.5 * t,
        y = Math.sin(f) * 5.2 * t + m;
      ((e.fillStyle = "#292524"),
        e.beginPath(),
        e.arc(g, y + 0.8 * t, 3.8 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#57534e"),
        e.beginPath(),
        e.arc(g, y, 3.2 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#78716c"),
        e.beginPath(),
        e.arc(g - 0.7 * t, y - 0.7 * t, 2 * t, 0, Math.PI * 2),
        e.fill());
    }
    const c = e.createRadialGradient(-3 * t, -6 * t, 2 * t, 0, -3 * t, 14 * t);
    if (
      (c.addColorStop(0, "#ea580c"),
      c.addColorStop(0.4, "#c2410c"),
      c.addColorStop(0.85, "#9a3412"),
      c.addColorStop(1, "#431407"),
      (e.fillStyle = c),
      e.beginPath(),
      e.moveTo(-11 * t, 3 * t),
      e.quadraticCurveTo(-12 * t, -10 * t, 0, -13 * t),
      e.quadraticCurveTo(12 * t, -10 * t, 11 * t, 3 * t),
      e.quadraticCurveTo(0, 5 * t, -11 * t, 3 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "rgba(67, 20, 7, 0.4)"),
      (e.lineWidth = 1.2 * t),
      e.beginPath(),
      e.ellipse(0, -4 * t, 9 * t, 3.5 * t, 0, 0, Math.PI),
      e.stroke(),
      (e.fillStyle = "#7c2d12"),
      e.beginPath(),
      e.rect(-2.8 * t, -17.5 * t, 5.6 * t, 6 * t),
      e.fill(),
      (e.strokeStyle = "#431407"),
      (e.lineWidth = 1 * t),
      e.stroke(),
      (e.fillStyle = "#9a3412"),
      e.beginPath(),
      e.ellipse(0, -17.5 * t, 3.6 * t, 1.4 * t, 0, 0, Math.PI * 2),
      e.fill(),
      e.stroke(),
      (e.fillStyle = "#1c1917"),
      e.beginPath(),
      e.ellipse(0, -17.5 * t, 2.4 * t, 0.9 * t, 0, 0, Math.PI * 2),
      e.fill(),
      o)
    )
      for (let f = 0; f < 3; f++) {
        const g = (l * 1.8 + f * 1.2) % 3,
          y = -18 * t - g * 6 * t,
          w = Math.sin(l * 2 + f) * 2 * t + g * 1.5 * t,
          v = (1.8 + g * 1.5) * t,
          T = Math.max(0, 0.35 - (g / 3) * 0.35);
        ((e.fillStyle = `rgba(214, 211, 209, ${T})`),
          e.beginPath(),
          e.arc(w, y, v, 0, Math.PI * 2),
          e.fill());
      }
    if (
      ((e.strokeStyle = "#7c2d12"),
      (e.lineWidth = 2 * t),
      e.beginPath(),
      e.moveTo(-5.5 * t, 3 * t),
      e.quadraticCurveTo(-5.5 * t, -5 * t, 0, -5.5 * t),
      e.quadraticCurveTo(5.5 * t, -5 * t, 5.5 * t, 3 * t),
      e.stroke(),
      (e.fillStyle = "#1c1917"),
      e.beginPath(),
      e.moveTo(-4.5 * t, 3 * t),
      e.quadraticCurveTo(-4.5 * t, -4.5 * t, 0, -4.8 * t),
      e.quadraticCurveTo(4.5 * t, -4.5 * t, 4.5 * t, 3 * t),
      e.closePath(),
      e.fill(),
      o)
    ) {
      const f = Math.sin(l * 8) * 0.15,
        g = e.createRadialGradient(0, 1 * t, 1 * t, 0, 0, 6 * t);
      (g.addColorStop(0, `rgba(254, 240, 138, ${0.9 + f})`),
        g.addColorStop(0.3, `rgba(249, 115, 22, ${0.85 + f})`),
        g.addColorStop(0.7, "rgba(220, 38, 38, 0.7)"),
        g.addColorStop(1, "rgba(0, 0, 0, 0)"),
        (e.fillStyle = g),
        e.beginPath(),
        e.ellipse(0, 1 * t, 4.2 * t, 3.2 * t, 0, 0, Math.PI * 2),
        e.fill());
      const y = (3.5 + Math.sin(l * 12) * 1.2) * t,
        w = (2.2 + Math.cos(l * 10) * 0.6) * t;
      ((e.fillStyle = "#fef08a"),
        e.beginPath(),
        e.moveTo(-w * 0.6, 2 * t),
        e.quadraticCurveTo(-w * 0.3, -y * 0.4, 0, -y),
        e.quadraticCurveTo(w * 0.3, -y * 0.4, w * 0.6, 2 * t),
        e.closePath(),
        e.fill());
      const v = e.createRadialGradient(0, 3.5 * t, 1 * t, 0, 4.5 * t, 9 * t);
      (v.addColorStop(0, "rgba(251, 146, 60, 0.35)"),
        v.addColorStop(1, "rgba(251, 146, 60, 0)"),
        (e.fillStyle = v),
        e.beginPath(),
        e.ellipse(0, 4.5 * t, 9 * t, 3.5 * t, 0, 0, Math.PI * 2),
        e.fill());
    }
    if (u && u.fishItem) {
      const f = Date.now() - u.startTime,
        g = Math.min(1, f / u.durationMs);
      ((e.strokeStyle = "#18181b"),
        (e.lineWidth = 1.4 * t),
        e.beginPath(),
        e.moveTo(-4 * t, 1.8 * t),
        e.lineTo(4 * t, 1.8 * t),
        e.stroke(),
        e.save(),
        e.translate(0, 1 * t));
      const y = g >= 1 ? "#78350f" : "#ea580c";
      if (
        ((e.fillStyle = y),
        e.beginPath(),
        e.ellipse(0, 0, 3.5 * t, 1.3 * t, 0, 0, Math.PI * 2),
        e.fill(),
        o)
      ) {
        const S = (l * 3) % 2;
        ((e.fillStyle = "rgba(255, 255, 255, 0.5)"),
          e.beginPath(),
          e.arc(
            Math.sin(l * 4) * 1.5 * t,
            -2 * t - S * 3 * t,
            1 * t,
            0,
            Math.PI * 2,
          ),
          e.fill());
      }
      e.restore();
      const w = 28 * t,
        v = 4 * t,
        T = -24 * t;
      if (
        ((e.fillStyle = "rgba(0, 0, 0, 0.85)"),
        e.beginPath(),
        e.roundRect(-w / 2 - 2 * t, T - 2 * t, w + 4 * t, v + 4 * t, 3 * t),
        e.fill(),
        (e.strokeStyle = g >= 1 ? "#22c55e" : "#f59e0b"),
        (e.lineWidth = 1 * t),
        e.stroke(),
        (e.fillStyle = g >= 1 ? "#22c55e" : "#f59e0b"),
        e.beginPath(),
        e.roundRect(-w / 2, T, w * g, v, 2 * t),
        e.fill(),
        (e.font = `bold ${Math.max(8, Math.round(7.5 * t))}px monospace`),
        (e.textAlign = "center"),
        (e.textBaseline = "bottom"),
        g >= 1)
      )
        ((e.fillStyle = "#4ade80"),
          e.fillText("🐟 [F] Coletar Assado!", 0, T - 3 * t));
      else {
        const S = Math.max(0, Math.ceil((u.durationMs - f) / 1e3));
        ((e.fillStyle = "#fef08a"),
          e.fillText(`🔥 Assando (${S}s)`, 0, T - 3 * t));
      }
    }
    e.restore();
  }
  // [PERF/FIX] Gradientes dos paredoes criados uma unica vez por altura (antes: estas duas funcoes eram
  // chamadas mas NAO existiam em nenhum arquivo -> ReferenceError ao desenhar qualquer paredao com face externa).
  // Cores reconstruidas com a paleta slate dos paredoes vizinhos (oeste/leste/platô).
  const _cliffGradCache = new Map();
  function getCliffWallFaceGradient(e, y0, y1) {
    const key = "f" + y0.toFixed(2) + "|" + y1.toFixed(2);
    let g = _cliffGradCache.get(key);
    if (!g) {
      g = e.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, "#64748b");
      g.addColorStop(0.35, "#475569");
      g.addColorStop(0.8, "#334155");
      g.addColorStop(1, "#1e293b");
      _cliffGradCache.set(key, g);
    }
    return g;
  }
  function getCliffNorthGradient(e, y0, y1) {
    const key = "n" + y0.toFixed(2) + "|" + y1.toFixed(2);
    let g = _cliffGradCache.get(key);
    if (!g) {
      g = e.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, "#0f172a");
      g.addColorStop(0.65, "#334155");
      g.addColorStop(1, "#475569");
      _cliffGradCache.set(key, g);
    }
    return g;
  }
  function drawCliffWall25D(e, t, l = 1, o = 0.5, u = 0, neighbors = null) {
    e.save();
    // nL, nR, nT, nB = true quando o tile vizinho faz parte do platô elevado (seja outro paredão ou o chão interno de MOUNTAIN_25D)
    // Assim, o lado interno NUNCA tem queda/parede nem sombra: o topo do paredão se funde 100% no mesmo nível do interior!
    const nL = !!(neighbors && neighbors.left),
      nR = !!(neighbors && neighbors.right),
      nT = !!(neighbors && neighbors.top),
      nB = !!(neighbors && neighbors.bottom),
      nTL = !!(neighbors && neighbors.topLeft),
      nTR = !!(neighbors && neighbors.topRight),
      nBL = !!(neighbors && neighbors.bottomLeft),
      nBR = !!(neighbors && neighbors.bottomRight);

    const halfTile = 18 * t,
      // Sangria de 1.5px para dentro de qualquer lado conectado ao platô/paredão para zero frestas
      leftX = nL ? -halfTile - 1.5 * t : -halfTile + 0.5 * t,
      rightX = nR ? halfTile + 1.5 * t : halfTile - 0.5 * t,
      fullW = rightX - leftX,
      // Paredão 4x maior na face externa (112px de altura monumental 2.5D)!
      hWall = 112 * t,
      baseY = 18 * t + (nB ? 0 : 94 * t),
      topY = 18 * t - 18 * t,
      platBackY = -halfTile - 1.5 * t,
      platFrontY = halfTile + 1.5 * t;

    // Chanfros apenas nas quinas externas livres (que dão para fora do bioma)
    const bevelL = nL || nT ? 0 : 6 * t,
      bevelR = nR || nT ? 0 : 6 * t;

    // 1. Sombra de Base externa gigante (APENAS quando o sul é fora do bioma: !nB)
    if (!nB) {
      e.fillStyle = "rgba(2, 6, 23, 0.52)";
      e.beginPath();
      if (nL && nR) {
        e.fillRect(leftX, baseY - 4 * t, fullW, 22 * t);
      } else {
        e.roundRect(
          leftX,
          baseY - 4 * t,
          fullW,
          24 * t,
          [0, 0, nR ? 0 : 10 * t, nL ? 0 : 10 * t],
        );
        e.fill();
      }
    }

    // 2. Face Vertical Rochosa Exposta 4x MAIOR (APENAS onde há queda para fora do bioma!)
    // O topo do paredão fica em platFrontY (18*t), conectado com o interior do bioma,
    // e a parede colossal desce 4x (até baseY = 112*t) para fora do bioma!
    if (!nB) {
      const faceTopY = platFrontY - 2 * t;
      const faceBottomY = baseY;
      // Bitmap pré-assado: gradiente vertical da face reutilizado (identico em todos os tiles),
      // criado uma unica vez por espessura de tile em vez de a cada frame (ver OTIMIZACAO-DESEMPENHO-v2.md)
      const wallGrad = getCliffWallFaceGradient(e, faceTopY, faceBottomY);
      e.fillStyle = wallGrad;
      e.beginPath();
      e.moveTo(leftX, faceBottomY);
      e.lineTo(leftX, faceTopY + bevelL);
      e.lineTo(leftX + bevelL, faceTopY);
      e.lineTo(rightX - bevelR, faceTopY);
      e.lineTo(rightX, faceTopY + bevelR);
      e.lineTo(rightX, faceBottomY);
      e.closePath();
      e.fill();

      // Pontes diagonais externas (4x maiores para acompanhar a parede colossal)
      if (!nL && nTL) {
        e.fillStyle = wallGrad;
        e.fillRect(-halfTile - 18 * t, faceTopY - 18 * t, 22 * t, 64 * t);
      }
      if (!nR && nTR) {
        e.fillStyle = wallGrad;
        e.fillRect(halfTile - 4 * t, faceTopY - 18 * t, 22 * t, 64 * t);
      }
      if (!nL && nBL) {
        e.fillStyle = wallGrad;
        e.fillRect(-halfTile - 18 * t, faceTopY + 12 * t, 22 * t, 80 * t);
      }
      if (!nR && nBR) {
        e.fillStyle = wallGrad;
        e.fillRect(halfTile - 4 * t, faceTopY + 12 * t, 22 * t, 80 * t);
      }

      // 5 faixas de estratos geológicos e fendas ao longo da altura 4x da parede
      const faceH = faceBottomY - faceTopY;
      e.strokeStyle = "rgba(15, 23, 42, 0.58)";
      e.lineWidth = 1.8 * t;
      e.beginPath();
      for (let i = 1; i <= 4; i++) {
        const sy = faceTopY + faceH * (i * 0.2);
        e.moveTo(leftX + (nL ? 0 : 1.5 * t), sy);
        e.lineTo(-5 * t, sy + (i % 2 === 0 ? -2.2 : 2.2) * t);
        e.lineTo(6 * t, sy + (i % 2 === 0 ? 1.8 : -1.8) * t);
        e.lineTo(rightX - (nR ? 0 : 1.5 * t), sy);
      }

      const vx = (o - 0.5) * 12 * t;
      e.moveTo(vx, faceTopY + 3 * t);
      e.lineTo(vx - 3.5 * t, faceTopY + faceH * 0.33);
      e.lineTo(vx + 2.5 * t, faceTopY + faceH * 0.66);
      e.lineTo(vx - 1.5 * t, faceBottomY - 4 * t);
      e.stroke();

      e.fillStyle = "rgba(148, 163, 184, 0.24)";
      e.fillRect(leftX + 2 * t, faceTopY + faceH * 0.2 - 3 * t, fullW * 0.45, 2.8 * t);
      e.fillRect(1 * t, faceTopY + faceH * 0.6 - 3 * t, fullW * 0.4, 2.5 * t);

      // Rodapé escuro na base externa sul
      e.fillStyle = "rgba(9, 13, 22, 0.65)";
      e.fillRect(leftX, faceBottomY - 6 * t, fullW, 6 * t);
    }

    // 3. Platô Superior 2.5D Contínuo — EXATAMENTE na mesma cor (#64748b) e nível do chão interno de MOUNTAIN_25D!
    // Assim, o topo do paredão é a continuação direta e nivelada do terreno interno do bioma!
    e.fillStyle = "#64748b";
    e.fillRect(leftX, platBackY, fullW, platFrontY - platBackY);

    // Textura idêntica à do chão interno do platô para fusão visual perfeita
    e.fillStyle = "rgba(30, 41, 59, 0.26)";
    const platMidY = (platBackY + platFrontY) * 0.5;
    e.fillRect(leftX + 4 * t, platMidY - 1.5 * t, fullW - 8 * t, 2 * t);
    e.fillStyle = "rgba(241, 245, 249, 0.22)";
    e.fillRect(leftX + 5 * t, platMidY - 2.7 * t, fullW - 10 * t, 1.2 * t);

    // 4. Bordas / Escarpas 4x maiores nas laterais que dão para FORA do bioma (Norte, Oeste, Leste, Sul)
    if (!nT) {
      const northCliffH = 24 * t;
      // Bitmap pre-assado: gradiente vertical da escarpa norte (identico em todos os tiles)
      const nGrad = getCliffNorthGradient(e, platBackY - northCliffH, platBackY - northCliffH + northCliffH + 5 * t);
      e.fillStyle = nGrad;
      e.fillRect(leftX, platBackY - northCliffH, fullW, northCliffH + 2 * t);
      e.strokeStyle = "#e2e8f0";
      e.lineWidth = 2.4 * t;
      e.beginPath();
      e.moveTo(leftX, platBackY + 1 * t);
      e.lineTo(rightX, platBackY + 1 * t);
      e.stroke();
    }

    if (!nL) {
      const westCliffW = 24 * t;
      const wGrad = e.createLinearGradient(leftX - westCliffW, 0, leftX + 3 * t, 0);
      wGrad.addColorStop(0, "#0f172a");
      wGrad.addColorStop(0.65, "#334155");
      wGrad.addColorStop(1, "#475569");
      e.fillStyle = wGrad;
      e.fillRect(leftX - westCliffW, platBackY, westCliffW + 2 * t, (nB ? platFrontY : baseY) - platBackY);
      e.strokeStyle = "#e2e8f0";
      e.lineWidth = 2.4 * t;
      e.beginPath();
      e.moveTo(leftX + 1 * t, platBackY);
      e.lineTo(leftX + 1 * t, platFrontY);
      e.stroke();
    }

    if (!nR) {
      const eastCliffW = 24 * t;
      const eGrad = e.createLinearGradient(rightX - 3 * t, 0, rightX + eastCliffW, 0);
      eGrad.addColorStop(0, "#475569");
      eGrad.addColorStop(0.35, "#1e293b");
      eGrad.addColorStop(1, "#0f172a");
      e.fillStyle = eGrad;
      e.fillRect(rightX - 2 * t, platBackY, eastCliffW + 2 * t, (nB ? platFrontY : baseY) - platBackY);
      e.strokeStyle = "#cbd5e1";
      e.lineWidth = 2.4 * t;
      e.beginPath();
      e.moveTo(rightX - 1 * t, platBackY);
      e.lineTo(rightX - 1 * t, platFrontY);
      e.stroke();
    }

    // Se o Sul é fora do bioma (!nB), desenha a crista iluminada frontal onde o platô encontra o topo da parede vertical sul
    if (!nB) {
      e.strokeStyle = "#e2e8f0";
      e.lineWidth = 2.8 * t;
      e.beginPath();
      e.moveTo(leftX, platFrontY - 1 * t);
      e.lineTo(rightX, platFrontY - 1 * t);
      e.stroke();
    }

    e.restore();
  }

  function drawCliffRamp25D(e, t, upperTier = 1, lowerTier = 0, rampDir = "up", neighbors = null) {
    e.save();
    const halfTile = 18 * t,
      floor = Math.max(1, Math.min(5, upperTier || 1)),
      hWall = (25 + floor * 3.5) * t,
      baseY = 18 * t,
      topY = baseY - hWall,
      nL = !!(neighbors && neighbors.leftWall),
      nR = !!(neighbors && neighbors.rightWall),
      nT = !!(neighbors && neighbors.topRamp),
      nB = !!(neighbors && neighbors.bottomRamp);

    // Cores do andar inferior (base da rampa) e do andar superior (topo da rampa)
    const getTierColor = (tr) =>
      tr >= 5
        ? "#e2e8f0"
        : tr === 4
          ? "#cbd5e1"
          : tr === 3
            ? "#94a3b8"
            : tr === 2
              ? "#64748b"
              : tr === 1
                ? "#475569"
                : "#57534e";
    const upperCol = getTierColor(floor);
    const lowerCol = getTierColor(lowerTier);

    // A rampa 2.5D começa no nível do chão do andar inferior (baseY) e sobe inclinada na altura 2.5D
    // até encontrar a altura exata do platô do andar superior (topY), conectando visualmente os dois andares!
    const rampTopY = nT ? -halfTile - 2 * t : topY + 2 * t;
    const rampBotY = baseY;
    const rampLeftX = -halfTile;
    const rampRightX = halfTile;
    const rampW = rampRightX - rampLeftX;
    const rampH = rampBotY - rampTopY;

    // 1. Paredes laterais de sustentação da rampa (conectando com o paredão ao lado)
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.moveTo(rampLeftX, rampBotY);
    e.lineTo(rampLeftX, rampTopY);
    e.lineTo(rampRightX, rampTopY);
    e.lineTo(rampRightX, rampBotY);
    e.closePath();
    e.fill();

    // 2. Superfície inclinada da rampa (gradiente contínuo do andar inferior até a cor do andar superior no topo)
    const slopeGrad = e.createLinearGradient(0, rampTopY, 0, rampBotY);
    if (rampDir === "down") {
      slopeGrad.addColorStop(0, lowerCol);
      slopeGrad.addColorStop(0.5, "#64748b");
      slopeGrad.addColorStop(1, upperCol);
    } else {
      slopeGrad.addColorStop(0, upperCol);
      slopeGrad.addColorStop(0.55, "#64748b");
      slopeGrad.addColorStop(1, lowerCol);
    }
    e.fillStyle = slopeGrad;
    e.fillRect(rampLeftX + 2.5 * t, rampTopY, rampW - 5 * t, rampH);

    // 3. Degraus 3D esculpidos em perspectiva subindo do andar inferior até o topo do paredão
    const stepCount = 6;
    const stepH = rampH / stepCount;
    for (let i = 0; i < stepCount; i++) {
      const sy = rampBotY - (i + 1) * stepH;
      const stepProgress = (i + 1) / stepCount;
      // Face vertical do degrau (espelho do degrau)
      e.fillStyle = "rgba(15, 23, 42, 0.62)";
      e.fillRect(rampLeftX + 3 * t, sy + stepH * 0.52, rampW - 6 * t, stepH * 0.48);

      // Piso do degrau (mais claro conforme sobe para o andar superior)
      e.fillStyle =
        stepProgress > 0.65
          ? upperCol
          : stepProgress > 0.35
            ? "#94a3b8"
            : lowerCol;
      e.fillRect(rampLeftX + 3 * t, sy, rampW - 6 * t, stepH * 0.56);

      // Quina iluminada de cada degrau
      e.fillStyle = floor >= 4 ? "rgba(255, 255, 255, 0.7)" : "rgba(241, 245, 249, 0.5)";
      e.fillRect(rampLeftX + 3 * t, sy, rampW - 6 * t, 1.3 * t);
    }

    // 4. Parapeitos / Muretas laterais em rampa que acompanham a inclinação do andar inferior ao superior
    // Mureta esquerda
    const curbGradL = e.createLinearGradient(0, rampTopY, 0, rampBotY);
    curbGradL.addColorStop(0, upperCol);
    curbGradL.addColorStop(1, "#334155");
    e.fillStyle = curbGradL;
    e.fillRect(rampLeftX, rampTopY, 3.8 * t, rampH);
    e.strokeStyle = "#e2e8f0";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(rampLeftX + 3.6 * t, rampTopY);
    e.lineTo(rampLeftX + 3.6 * t, rampBotY);
    e.stroke();

    // Mureta direita
    e.fillStyle = curbGradL;
    e.fillRect(rampRightX - 3.8 * t, rampTopY, 3.8 * t, rampH);
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(rampRightX - 3.6 * t, rampTopY);
    e.lineTo(rampRightX - 3.6 * t, rampBotY);
    e.stroke();

    // 5. Patamar de chegada no topo (encaixe perfeito com o piso do andar superior)
    if (!nT) {
      e.fillStyle = upperCol;
      e.fillRect(rampLeftX + 2 * t, rampTopY - 3 * t, rampW - 4 * t, 5 * t);
      e.strokeStyle = floor >= 4 ? "#ffffff" : "#e2e8f0";
      e.lineWidth = 1.8 * t;
      e.beginPath();
      e.moveTo(rampLeftX + 2 * t, rampTopY + 1 * t);
      e.lineTo(rampRightX - 2 * t, rampTopY + 1 * t);
      e.stroke();
    }

    // 6. Soleira de entrada na base (encaixe com o andar inferior)
    if (!nB) {
      e.fillStyle = "rgba(15, 23, 42, 0.38)";
      e.fillRect(rampLeftX + 2 * t, rampBotY - 2 * t, rampW - 4 * t, 3.5 * t);
    }

    e.restore();
  }

  // =========================================================================
  // ELEMENTOS DO CALABOUÇO E MASMORRAS SUBTERRÂNEAS (ANDAR INFERIOR)
  // =========================================================================

  function drawDungeonStaircase(e, t = 1, isUp = !1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    const wMul = 1.15;
    const hMul = 1.15;

    if (isUp) {
      // 1. Auréola de luz dourada irradiando no piso em frente à escadaria
      const floorGlow = e.createRadialGradient(0, 8 * t, 3 * t, 0, 8 * t, 36 * wMul * t);
      floorGlow.addColorStop(0, "rgba(251, 191, 36, 0.65)");
      floorGlow.addColorStop(0.45, "rgba(245, 158, 11, 0.35)");
      floorGlow.addColorStop(0.75, "rgba(234, 88, 12, 0.12)");
      floorGlow.addColorStop(1, "rgba(15, 23, 42, 0)");
      e.fillStyle = floorGlow;
      e.beginPath();
      e.ellipse(0, 9 * t, 36 * wMul * t, 16 * t, 0, 0, Math.PI * 2);
      e.fill();

      // 2. Base e reentrância do pórtico na muralha de pedra
      e.fillStyle = "rgba(2, 6, 23, 0.85)";
      e.fillRect(-26 * wMul * t, -36 * hMul * t, 52 * wMul * t, (36 * hMul + 14) * t);

      // Pilares laterais maciços de granito chanfrado
      e.fillStyle = "#334155";
      e.fillRect(-26 * wMul * t, -36 * hMul * t, 7 * wMul * t, (36 * hMul + 12) * t);
      e.fillRect(19 * wMul * t, -36 * hMul * t, 7 * wMul * t, (36 * hMul + 12) * t);

      // Chanfros e relevos das pilastras
      e.fillStyle = "#475569";
      e.fillRect(-25 * wMul * t, -35 * hMul * t, 5 * wMul * t, (35 * hMul + 10) * t);
      e.fillRect(20 * wMul * t, -35 * hMul * t, 5 * wMul * t, (35 * hMul + 10) * t);

      // 3. Feixe de luz celestial/dourada que desce dos salões superiores do subsolo
      const beamPulse = Math.sin((animTimer || 0) * 4) * 0.08 + 0.38;
      const beamGrad = e.createLinearGradient(0, -32 * hMul * t, 0, 8 * t);
      beamGrad.addColorStop(0, `rgba(254, 240, 138, ${beamPulse * 1.5})`);
      beamGrad.addColorStop(0.4, `rgba(251, 191, 36, ${beamPulse})`);
      beamGrad.addColorStop(0.85, `rgba(245, 158, 11, ${beamPulse * 0.5})`);
      beamGrad.addColorStop(1, "rgba(217, 119, 6, 0.05)");
      e.fillStyle = beamGrad;
      e.beginPath();
      e.moveTo(-16 * wMul * t, -32 * hMul * t);
      e.lineTo(16 * wMul * t, -32 * hMul * t);
      e.lineTo(22 * wMul * t, 8 * t);
      e.lineTo(-22 * wMul * t, 8 * t);
      e.closePath();
      e.fill();

      // 4. Degraus de cantaria ascendentes iluminados
      const numSteps = 9;
      for (let s = 0; s < numSteps; s++) {
        const r0 = s / numSteps;
        const r1 = (s + 1) / numSteps;
        const yBottom = (8 - r0 * (34 * hMul)) * t;
        const yTop = (8 - r1 * (34 * hMul)) * t;
        const stepH = Math.max(2.5 * t, yBottom - yTop);
        const halfW0 = (17.5 - r0 * 4.5) * wMul * t;
        const halfW1 = (17.5 - r1 * 4.5) * wMul * t;

        // Espelho do degrau
        const riserLum = Math.round(70 + r0 * 95);
        e.fillStyle = `rgb(${riserLum + 12}, ${riserLum + 8}, ${riserLum})`;
        e.fillRect(-halfW0, yBottom - stepH * 0.55, halfW0 * 2, stepH * 0.55);

        // Piso do degrau com destaque de iluminação
        const treadLum = Math.round(130 + r1 * 100);
        e.fillStyle = `rgb(${Math.min(255, treadLum + 20)}, ${Math.min(255, treadLum + 16)}, ${treadLum})`;
        e.fillRect(-halfW1, yTop, halfW1 * 2, stepH * 0.52);

        // Friso dourado polido na quina do degrau
        e.fillStyle = `rgba(254, 240, 138, ${0.45 + r1 * 0.45})`;
        e.fillRect(-halfW1, yTop, halfW1 * 2, 1.2 * t);
      }

      // 5. Corrimãos pesados de latão polido e ferro forjado
      e.strokeStyle = "#fbbf24";
      e.lineWidth = 1.8 * t;
      e.beginPath();
      e.moveTo(-18 * wMul * t, 8 * t);
      e.lineTo(-13 * wMul * t, -32 * hMul * t);
      e.moveTo(18 * wMul * t, 8 * t);
      e.lineTo(13 * wMul * t, -32 * hMul * t);
      e.stroke();

      // 6. Arco Superior / Verga de cantaria com arco
      e.fillStyle = "#1e293b";
      e.fillRect(-27 * wMul * t, -40 * hMul * t, 54 * wMul * t, 8 * hMul * t);
      e.fillStyle = "#334155";
      e.fillRect(-26 * wMul * t, -39 * hMul * t, 52 * wMul * t, 6 * hMul * t);
      e.strokeStyle = "#64748b";
      e.lineWidth = 1.2 * t;
      e.strokeRect(-26 * wMul * t, -39 * hMul * t, 52 * wMul * t, 6 * hMul * t);

      // 7. Placa de Pedra com inscrição entalhada em relevo dourado
      e.fillStyle = "#090d16";
      e.fillRect(-19 * wMul * t, -37.5 * hMul * t, 38 * wMul * t, 5 * hMul * t);
      e.strokeStyle = "#f59e0b";
      e.lineWidth = 1.2 * t;
      e.strokeRect(-19 * wMul * t, -37.5 * hMul * t, 38 * wMul * t, 5 * hMul * t);

      // Texto entalhado na pedra: "▲ SUBSOLO I ▲"
      e.fillStyle = "#fef08a";
      e.font = `bold ${Math.round(4.5 * t)}px monospace`;
      e.textAlign = "center";
      e.textBaseline = "middle";
      e.fillText("▲ SUBSOLO I ▲", 0, -35 * hMul * t);

      // 8. Tochas gêmeas flamejantes de ferro forjado nas pilastras laterais
      const torchFlicker = Math.sin((animTimer || 0) * 8) * 0.18;
      for (const side of [-1, 1]) {
        const tx = side * 22 * wMul * t;
        const ty = -14 * t;
        // Suporte de ferro
        e.fillStyle = "#0f172a";
        e.fillRect(tx - 1.5 * t, ty - 6 * t, 3 * t, 8 * t);
        e.fillRect(tx - (side > 0 ? 3 : 0) * t, ty, 3 * t, 2 * t);
        // Cesta da tocha
        e.fillStyle = "#78350f";
        e.fillRect(tx - 2.5 * t, ty - 8 * t, 5 * t, 3.5 * t);

        // Halo de luz da tocha
        const tHalo = e.createRadialGradient(tx, ty - 9 * t, 1 * t, tx, ty - 9 * t, 12 * t);
        tHalo.addColorStop(0, "rgba(254, 240, 138, 0.85)");
        tHalo.addColorStop(0.5, "rgba(249, 115, 22, 0.45)");
        tHalo.addColorStop(1, "rgba(249, 115, 22, 0)");
        e.fillStyle = tHalo;
        e.beginPath();
        e.arc(tx, ty - 9 * t, 12 * t, 0, Math.PI * 2);
        e.fill();

        // Chama viva
        e.fillStyle = `rgba(249, 115, 22, ${0.9 + torchFlicker})`;
        e.beginPath();
        e.arc(tx, ty - 9.5 * t, 3.2 * t, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = "#fef08a";
        e.beginPath();
        e.arc(tx, ty - 9.5 * t, 1.6 * t, 0, Math.PI * 2);
        e.fill();
      }

      // 9. Sinalizador / Indicador luminoso flutuante no topo
      const beaconFloat = Math.sin((animTimer || 0) * 5) * 2 * t;
      const beaconAlpha = Math.sin((animTimer || 0) * 4) * 0.2 + 0.8;
      e.fillStyle = `rgba(251, 191, 36, ${beaconAlpha})`;
      e.font = `bold ${Math.round(8 * t)}px monospace`;
      e.textAlign = "center";
      e.textBaseline = "middle";
      e.fillText("▲", 0, (-44 * hMul * t) + beaconFloat);
    } else {
      // Escadaria que DESCE para o calabouço (poço escuro profundo com névoa sombria, tochas vivas e ferro forjado)
      e.fillStyle = "rgba(2, 6, 23, 0.65)";
      e.fillRect(-26 * wMul * t, -26 * hMul * t, 52 * wMul * t, (26 * hMul + 12) * t);

      // Moldura externa pesada de cantaria de granito escuro chanfrado
      e.fillStyle = "#1e293b";
      e.fillRect(-24 * wMul * t, -24 * hMul * t, 48 * wMul * t, (24 * hMul + 10) * t);
      e.fillStyle = "#334155";
      e.fillRect(-23 * wMul * t, -23 * hMul * t, 46 * wMul * t, (23 * hMul + 8) * t);
      e.strokeStyle = "#0f172a";
      e.lineWidth = 1.6 * t;
      e.strokeRect(-23 * wMul * t, -23 * hMul * t, 46 * wMul * t, (23 * hMul + 8) * t);

      // Frisos de blocos de cantaria talhados na moldura
      e.strokeStyle = "rgba(15, 23, 42, 0.75)";
      e.lineWidth = 1 * t;
      for (let by = -20; by <= 6; by += 7) {
        e.beginPath();
        e.moveTo(-23 * wMul * t, by * hMul * t);
        e.lineTo(-17 * wMul * t, by * hMul * t);
        e.moveTo(17 * wMul * t, by * hMul * t);
        e.lineTo(23 * wMul * t, by * hMul * t);
        e.stroke();
      }

      // Parapeitos e balaustradas de ferro negro forjado nas bordas
      e.fillStyle = "#09090b";
      e.fillRect(-22 * wMul * t, -26 * hMul * t, 44 * wMul * t, 4.5 * t);
      e.fillRect(-22 * wMul * t, -24 * hMul * t, 4.5 * wMul * t, (24 * hMul + 6) * t);
      e.fillRect(17.5 * wMul * t, -24 * hMul * t, 4.5 * wMul * t, (24 * hMul + 6) * t);

      // Pontas afiadas / lanças de ferro forjado no topo do parapeito
      e.fillStyle = "#475569";
      for (let px = -18; px <= 18; px += 4.5) {
        e.beginPath();
        e.moveTo(px * wMul * t, -26 * hMul * t);
        e.lineTo((px + 1) * wMul * t, -30 * hMul * t);
        e.lineTo((px + 2) * wMul * t, -26 * hMul * t);
        e.closePath();
        e.fill();
      }

      // Vão central do fosso
      const innerW = 31 * wMul * t;
      const innerX = -15.5 * wMul * t;
      const innerTopY = -21 * hMul * t;
      const innerH = (21 * hMul + 7) * t;

      // Gradiente abissal com toque avermelhado/sombrio do calabouço
      const voidGrad = e.createLinearGradient(0, innerTopY, 0, innerTopY + innerH);
      voidGrad.addColorStop(0, "#020617");
      voidGrad.addColorStop(0.4, "#09090b");
      voidGrad.addColorStop(0.8, "#1a0b16");
      voidGrad.addColorStop(1, "#2e1022");
      e.fillStyle = voidGrad;
      e.fillRect(innerX, innerTopY, innerW, innerH);

      // Brilho pulsante sutil que emana das profundezas (câmara de tortura/brasas lá embaixo)
      const glowPulse = Math.sin((animTimer || 0) * 3) * 0.08 + 0.18;
      const depthGlow = e.createRadialGradient(0, innerTopY + 4 * t, 2 * t, 0, innerTopY + 6 * t, 16 * wMul * t);
      depthGlow.addColorStop(0, `rgba(225, 29, 72, ${glowPulse * 1.4})`);
      depthGlow.addColorStop(0.5, `rgba(180, 83, 9, ${glowPulse * 0.8})`);
      depthGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
      e.fillStyle = depthGlow;
      e.beginPath();
      e.ellipse(0, innerTopY + 5 * t, 15 * wMul * t, 8 * t, 0, 0, Math.PI * 2);
      e.fill();

      // Degraus descendentes na escuridão
      const numSteps = 8;
      for (let s = 0; s < numSteps; s++) {
        const ratio = s / numSteps;
        const nextRatio = (s + 1) / numSteps;
        const stepY1 = 6 * t - ratio * (25 * hMul * t);
        const stepY2 = 6 * t - nextRatio * (25 * hMul * t);
        const stepH = Math.max(1.8 * t, stepY1 - stepY2);
        const inset = ratio * 4.2 * wMul * t;
        const sx = innerX + inset;
        const sw = innerW - inset * 2;

        const shade = Math.round(145 - ratio * 115);
        e.fillStyle = `rgb(${shade}, ${shade}, ${shade + 6})`;
        e.fillRect(sx, stepY2, sw, stepH * 0.7);

        const riserShade = Math.max(10, shade - 48);
        e.fillStyle = `rgb(${riserShade + 6}, ${riserShade}, ${riserShade + 8})`;
        e.fillRect(sx, stepY2 + stepH * 0.7, sw, stepH * 0.3);

        // Corrimão interno de ferro
        e.strokeStyle = "#475569";
        e.lineWidth = 1 * t;
        e.strokeRect(sx, stepY2, sw, stepH);
      }

      // Correntes de ferro penduradas nas laterais
      e.strokeStyle = "#64748b";
      e.lineWidth = 1.3 * t;
      for (const side of [-1, 1]) {
        const cx = side * 14 * wMul * t;
        e.beginPath();
        e.moveTo(cx, -22 * hMul * t);
        e.lineTo(cx + side * 1 * t, -12 * t);
        e.stroke();
        // Argola da corrente
        e.fillStyle = "#334155";
        e.beginPath();
        e.arc(cx + side * 1 * t, -11 * t, 2 * t, 0, Math.PI * 2);
        e.fill();
      }

      // Tochas de ferro negro nas laterais com chama tremeluzente
      const flicker = Math.sin((animTimer || 0) * 6) * 0.15;
      for (const side of [-1, 1]) {
        const tx = side * 15 * wMul * t;
        const ty = -6 * t;
        // Suporte de ferro chumbado na rocha
        e.fillStyle = "#09090b";
        e.fillRect(tx - 1.5 * t, ty - 5 * t, 3 * t, 7 * t);
        e.fillRect(tx - (side > 0 ? 3 : 0) * t, ty, 3 * t, 1.8 * t);

        // Cesta da tocha
        e.fillStyle = "#1e293b";
        e.fillRect(tx - 2 * t, ty - 7 * t, 4 * t, 3 * t);

        // Chama
        e.fillStyle = `rgba(249, 115, 22, ${0.85 + flicker})`;
        e.beginPath();
        e.arc(tx, ty - 8.5 * t, 3 * t, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = "rgba(254, 240, 138, 0.95)";
        e.beginPath();
        e.arc(tx, ty - 8.5 * t, 1.5 * t, 0, Math.PI * 2);
        e.fill();
      }
    }
    e.restore();
  }

  function drawDungeonWall25D(e, t = 1, neighbors = null) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    const nL = !!(neighbors && neighbors.left);
    const nR = !!(neighbors && neighbors.right);
    const nT = !!(neighbors && neighbors.top);
    const nB = !!(neighbors && neighbors.bottom);

    // [PERF] Cacheia os 16 estados possíveis da muralha 2.5D do calabouço em canvas offscreen!
    if (!drawDungeonWall25D._cache) {
      drawDungeonWall25D._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nT ? 4 : 0) | (nB ? 8 : 0);
    const key = `${t.toFixed(3)}_${mask}`;
    let cached = drawDungeonWall25D._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(22 * t);
      const padTop = Math.ceil(58 * t);
      const padBot = Math.ceil(32 * t);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * t;
        const leftX = nL ? -half - 1 * t : -half;
        const rightX = nR ? half + 1 * t : half;
        const w = rightX - leftX;
        // Altura 2.5D alta e imponente (36*t) com topo elevado em perspectiva!
        const wallH = 36 * t;
        const baseY = 18 * t;
        const topFrontY = baseY - wallH;
        const topBackY = -half - wallH;
        const topDepth = topFrontY - topBackY;

        // 1. Sombra projetada na base sul quando exposta ao piso
        if (!nB) {
          wc.fillStyle = "rgba(2, 6, 23, 0.78)";
          wc.fillRect(leftX - 1 * t, baseY - 2 * t, w + 2 * t, 11 * t);
        }

        // 2. Face frontal 2.5D da muralha de granito escuro (muito mais alta!)
        const frontGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
        frontGrad.addColorStop(0, "#64748b");
        frontGrad.addColorStop(0.28, "#475569");
        frontGrad.addColorStop(0.68, "#334155");
        frontGrad.addColorStop(1, "#1e293b");
        wc.fillStyle = frontGrad;
        wc.fillRect(leftX, topFrontY, w, wallH);

        // Rodapé reforçado de cantaria bruta na base
        wc.fillStyle = "#0f172a";
        wc.fillRect(leftX, baseY - 4 * t, w, 4 * t);

        // 4 fileiras de blocos de pedra (cantaria pesada 2.5D) na face frontal alta
        wc.strokeStyle = "rgba(15, 23, 42, 0.95)";
        wc.lineWidth = 1.3 * t;
        wc.beginPath();
        wc.moveTo(leftX, topFrontY + 8 * t);
        wc.lineTo(rightX, topFrontY + 8 * t);
        wc.moveTo(leftX, topFrontY + 16 * t);
        wc.lineTo(rightX, topFrontY + 16 * t);
        wc.moveTo(leftX, topFrontY + 24 * t);
        wc.lineTo(rightX, topFrontY + 24 * t);
        // Juntas verticais alternadas
        wc.moveTo(0, topFrontY);
        wc.lineTo(0, topFrontY + 8 * t);
        wc.moveTo(-6 * t, topFrontY + 8 * t);
        wc.lineTo(-6 * t, topFrontY + 16 * t);
        wc.moveTo(6 * t, topFrontY + 8 * t);
        wc.lineTo(6 * t, topFrontY + 16 * t);
        wc.moveTo(0, topFrontY + 16 * t);
        wc.lineTo(0, topFrontY + 24 * t);
        wc.moveTo(-6 * t, topFrontY + 24 * t);
        wc.lineTo(-6 * t, baseY - 4 * t);
        wc.moveTo(6 * t, topFrontY + 24 * t);
        wc.lineTo(6 * t, baseY - 4 * t);
        wc.stroke();

        // Destaques de luz no topo de cada fiada de pedra
        wc.strokeStyle = "rgba(148, 163, 184, 0.35)";
        wc.lineWidth = 1 * t;
        wc.beginPath();
        wc.moveTo(leftX + 1, topFrontY + 1 * t);
        wc.lineTo(rightX - 1, topFrontY + 1 * t);
        wc.moveTo(leftX + 1, topFrontY + 9 * t);
        wc.lineTo(rightX - 1, topFrontY + 9 * t);
        wc.moveTo(leftX + 1, topFrontY + 17 * t);
        wc.lineTo(rightX - 1, topFrontY + 17 * t);
        wc.moveTo(leftX + 1, topFrontY + 25 * t);
        wc.lineTo(rightX - 1, topFrontY + 25 * t);
        wc.stroke();

        // 3. Topo 2.5D da muralha (plano superior elevado visto de cima, de topBackY até topFrontY!)
        const topGrad = wc.createLinearGradient(0, topBackY, 0, topFrontY);
        topGrad.addColorStop(0, "#1e293b");
        topGrad.addColorStop(0.5, "#334155");
        topGrad.addColorStop(1, "#475569");
        wc.fillStyle = topGrad;
        wc.fillRect(leftX, topBackY, w, topDepth + 1.5 * t);

        // Lajes de cobertura no topo 2.5D
        wc.strokeStyle = "rgba(15, 23, 42, 0.85)";
        wc.lineWidth = 1.1 * t;
        wc.strokeRect(leftX + 0.5 * t, topBackY + 0.5 * t, w - 1 * t, topDepth);
        wc.beginPath();
        wc.moveTo(leftX, topBackY + topDepth * 0.5);
        wc.lineTo(rightX, topBackY + topDepth * 0.5);
        wc.moveTo(0, topBackY);
        wc.lineTo(0, topBackY + topDepth * 0.5);
        wc.moveTo(-6 * t, topBackY + topDepth * 0.5);
        wc.lineTo(-6 * t, topFrontY);
        wc.moveTo(6 * t, topBackY + topDepth * 0.5);
        wc.lineTo(6 * t, topFrontY);
        wc.stroke();

        // Cornija frontal iluminada separando o topo 2.5D da face vertical sul
        wc.fillStyle = "#94a3b8";
        wc.fillRect(leftX, topFrontY - 2.2 * t, w, 2.5 * t);
        wc.fillStyle = "#cbd5e1";
        wc.fillRect(leftX, topFrontY - 2.6 * t, w, 1 * t);

        if (!nT) {
          wc.fillStyle = "#0f172a";
          wc.fillRect(leftX, topBackY, w, 2.2 * t);
        }
        if (!nL) {
          wc.fillStyle = "rgba(15, 23, 42, 0.55)";
          wc.fillRect(leftX, topBackY, 2.2 * t, baseY - topBackY);
        }
        if (!nR) {
          wc.fillStyle = "rgba(2, 6, 23, 0.65)";
          wc.fillRect(rightX - 2.2 * t, topBackY, 2.2 * t, baseY - topBackY);
        }

        // Manchas de umidade e musgo na base da muralha
        if (!nB) {
          wc.fillStyle = "rgba(22, 101, 52, 0.42)";
          wc.fillRect(leftX, baseY - 5 * t, w, 2 * t);
        }
      }

      cached = { canvas: can, padX, padTop };
      drawDungeonWall25D._cache.set(key, cached);
    }

    e.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  function drawCaveRockWall25D(e, t = 1, wallTheme = "cave_rock", detailHash = 0.5, neighbors = null) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    const nL = !!(neighbors && neighbors.left);
    const nR = !!(neighbors && neighbors.right);
    const nT = !!(neighbors && neighbors.top);
    const nB = !!(neighbors && neighbors.bottom);

    // [PERF] Quantiza detailHash em 4 variações visuais determinísticas e cacheia todos os estados
    // em canvas offscreen (3 temas x 16 máscaras de vizinhos x 4 variações = máx 192 mini-sprites).
    // Isso elimina ~35 chamadas vetoriais/gradientes por bloco de parede a cada frame!
    if (!drawCaveRockWall25D._cache) {
      drawCaveRockWall25D._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nT ? 4 : 0) | (nB ? 8 : 0);
    const variant = Math.min(3, Math.max(0, Math.floor((detailHash || 0) * 4)));
    const qHash = [0.2, 0.42, 0.65, 0.85][variant];
    const key = `${t.toFixed(3)}_${wallTheme}_${mask}_${variant}`;
    let cached = drawCaveRockWall25D._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(22 * t);
      const padTop = Math.ceil(64 * t);
      const padBot = Math.ceil(32 * t);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * t;
        const leftX = nL ? -half - 1.5 * t : -half;
        const rightX = nR ? half + 1.5 * t : half;
        const w = rightX - leftX;

        // Paredão 2.5D alto de caverna: 40*t de elevação vertical para parecer bem mais alto e imponente!
        const wallH = 40 * t;
        const baseY = 18 * t;
        const topFrontY = baseY - wallH; // -22 * t
        const topBackY = -half - wallH;  // -58 * t
        const topDepth = topFrontY - topBackY; // 36 * t

        // Paleta de cores conforme o bioma/tipo de caverna
        let pal;
        if (wallTheme === "desert_cave") {
          pal = {
            faceTop: "#b45309",
            faceUpper: "#92400e",
            faceMid: "#78350f",
            faceBot: "#3b1806",
            baseFoot: "#240d03",
            topBack: "#5c280b",
            topMid: "#7c340f",
            topFront: "#9a4212",
            ridgeLight: "#d97706",
            ridgeBright: "#f59e0b",
            crackCol: "rgba(36, 13, 3, 0.85)",
            stratumLight: "rgba(251, 191, 36, 0.22)",
            sideL: "rgba(245, 158, 11, 0.16)",
            sideR: "rgba(24, 10, 2, 0.55)",
          };
        } else if (wallTheme === "earth_mine") {
          pal = {
            faceTop: "#694122",
            faceUpper: "#523118",
            faceMid: "#3b2210",
            faceBot: "#1f1108",
            baseFoot: "#120904",
            topBack: "#26150a",
            topMid: "#361e0f",
            topFront: "#4a2a16",
            ridgeLight: "#7c4d28",
            ridgeBright: "#9a6234",
            crackCol: "rgba(15, 7, 3, 0.88)",
            stratumLight: "rgba(180, 120, 70, 0.2)",
            sideL: "rgba(154, 98, 52, 0.18)",
            sideR: "rgba(12, 6, 2, 0.6)",
          };
        } else if (wallTheme === "geode_crystal") {
          pal = {
            faceTop: "#7e22ce",
            faceUpper: "#581c87",
            faceMid: "#3b0764",
            faceBot: "#1e1b4b",
            baseFoot: "#0f0728",
            topBack: "#1e1b4b",
            topMid: "#311052",
            topFront: "#4c1d95",
            ridgeLight: "#c084fc",
            ridgeBright: "#e879f9",
            crackCol: "rgba(15, 7, 40, 0.9)",
            stratumLight: "rgba(216, 180, 254, 0.32)",
            sideL: "rgba(192, 132, 252, 0.25)",
            sideR: "rgba(15, 7, 40, 0.65)",
          };
        } else {
          pal = {
            faceTop: "#57534e",
            faceUpper: "#44403c",
            faceMid: "#292524",
            faceBot: "#141210",
            baseFoot: "#090807",
            topBack: "#171513",
            topMid: "#262320",
            topFront: "#36322e",
            ridgeLight: "#78716c",
            ridgeBright: "#a8a29e",
            crackCol: "rgba(5, 5, 5, 0.9)",
            stratumLight: "rgba(168, 162, 158, 0.2)",
            sideL: "rgba(168, 162, 158, 0.15)",
            sideR: "rgba(0, 0, 0, 0.6)",
          };
        }

        // 1. Sombra projetada no chão da caverna ao pé do paredão (quando o sul é piso aberto)
        if (!nB) {
          wc.fillStyle = "rgba(0, 0, 0, 0.72)";
          wc.fillRect(leftX - 1 * t, baseY - 2 * t, w + 2 * t, 12 * t);
        }

        // 2. Face Frontal Vertical 2.5D do Paredão (visível quando não há parede abaixo, ou na transição)
        if (!nB) {
          const faceGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
          faceGrad.addColorStop(0, pal.faceTop);
          faceGrad.addColorStop(0.28, pal.faceUpper);
          faceGrad.addColorStop(0.68, pal.faceMid);
          faceGrad.addColorStop(1, pal.faceBot);
          wc.fillStyle = faceGrad;
          wc.fillRect(leftX, topFrontY, w, wallH);

          // Rodapé escarpado na base do paredão onde encontra o chão da caverna
          wc.fillStyle = pal.baseFoot;
          wc.fillRect(leftX, baseY - 5 * t, w, 5 * t);

          // Saliências e blocos rochosos esculpidos em 3 níveis na face frontal alta
          const hStep = wallH / 3;
          for (let tier = 0; tier < 3; tier++) {
            const sy = topFrontY + tier * hStep;
            const wob = ((qHash * (tier + 3) * 7) % 1) * 3 * t - 1.5 * t;

            // Luz na crista de cada camada rochosa
            wc.fillStyle = pal.stratumLight;
            wc.fillRect(leftX + 1.5 * t, sy + 1.2 * t, w - 3 * t, 2.2 * t);

            // Fenda horizontal irregular dividindo os estratos do paredão
            if (tier > 0) {
              wc.strokeStyle = pal.crackCol;
              wc.lineWidth = 1.5 * t;
              wc.beginPath();
              wc.moveTo(leftX, sy);
              wc.lineTo(-6 * t, sy + wob);
              wc.lineTo(6 * t, sy - wob * 0.8);
              wc.lineTo(rightX, sy);
              wc.stroke();
            }
          }

          // Fraturas verticais e fendas geológicas profundas ao longo da altura do paredão
          const crackX = (qHash - 0.5) * 14 * t;
          wc.strokeStyle = pal.crackCol;
          wc.lineWidth = 1.4 * t;
          wc.beginPath();
          wc.moveTo(crackX, topFrontY + 2 * t);
          wc.lineTo(crackX - 3.5 * t, topFrontY + wallH * 0.36);
          wc.lineTo(crackX + 2.5 * t, topFrontY + wallH * 0.72);
          wc.lineTo(crackX - 1 * t, baseY - 3 * t);
          wc.stroke();

          if (wallTheme === "geode_crystal") {
            // Drusas de ametista e quartzo incrustadas na face 2.5D da parede do Geodo
            wc.fillStyle = "#d8b4fe";
            wc.beginPath();
            wc.moveTo(-7 * t, baseY - 4 * t);
            wc.lineTo(-10 * t, baseY - 18 * t);
            wc.lineTo(-4 * t, baseY - 14 * t);
            wc.closePath();
            wc.moveTo(5 * t, baseY - 5 * t);
            wc.lineTo(9 * t, baseY - 21 * t);
            wc.lineTo(12 * t, baseY - 8 * t);
            wc.closePath();
            wc.fill();
          }
        }

        // 3. Topo 2.5D do Paredão (maciço rochoso superior elevado visto em perspectiva)
        const topGrad = wc.createLinearGradient(0, topBackY, 0, topFrontY);
        topGrad.addColorStop(0, pal.topBack);
        topGrad.addColorStop(0.55, pal.topMid);
        topGrad.addColorStop(1, pal.topFront);
        wc.fillStyle = topGrad;
        wc.fillRect(leftX, topBackY, w, topDepth + (nB ? 2 * t : 1 * t));

        // Relevo rochoso orgânico no topo do paredão
        if (qHash > 0.32) {
          wc.fillStyle = pal.stratumLight;
          wc.beginPath();
          wc.ellipse(
            (qHash - 0.5) * 10 * t,
            topBackY + topDepth * 0.48,
            8 * t,
            4.5 * t,
            qHash * Math.PI,
            0,
            Math.PI * 2
          );
          wc.fill();
        }

        wc.strokeStyle = pal.crackCol;
        wc.lineWidth = 1.1 * t;
        wc.beginPath();
        wc.moveTo(leftX + 3 * t, topBackY + topDepth * (0.3 + qHash * 0.35));
        wc.lineTo(0, topBackY + topDepth * 0.52);
        wc.lineTo(rightX - 3 * t, topBackY + topDepth * (0.65 - qHash * 0.25));
        wc.stroke();

        // 4. Cristas e Escarpas de Borda 2.5D (destacam claramente o volume e a altura nas bordas expostas!)
        if (!nB) {
          wc.fillStyle = pal.ridgeLight;
          wc.fillRect(leftX, topFrontY - 2.8 * t, w, 3.2 * t);
          wc.fillStyle = pal.ridgeBright;
          wc.fillRect(leftX, topFrontY - 3.2 * t, w, 1.2 * t);
        }

        if (!nT) {
          wc.fillStyle = pal.baseFoot;
          wc.fillRect(leftX, topBackY, w, 3.5 * t);
          wc.fillStyle = pal.ridgeLight;
          wc.fillRect(leftX, topBackY + 3.5 * t, w, 1.5 * t);
        }

        if (!nL) {
          const sideH = (nB ? topFrontY : baseY) - topBackY;
          wc.fillStyle = pal.sideL;
          wc.fillRect(leftX, topBackY, 3.5 * t, sideH);
          wc.fillStyle = pal.crackCol;
          wc.fillRect(leftX, topBackY, 1.2 * t, sideH);
        }

        if (!nR) {
          const sideH = (nB ? topFrontY : baseY) - topBackY;
          wc.fillStyle = pal.sideR;
          wc.fillRect(rightX - 3.8 * t, topBackY, 3.8 * t, sideH);
          wc.fillStyle = pal.crackCol;
          wc.fillRect(rightX - 1.2 * t, topBackY, 1.2 * t, sideH);
        }
      }

      cached = { canvas: can, padX, padTop };
      drawCaveRockWall25D._cache.set(key, cached);
    }

    e.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  function drawGeodeWallFissure25D(e, t = 1, neighbors = null, isExit = !1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    // 1. Desenha a estrutura base do paredão alto 2.5D em tons de terra (earth_mine / desert_cave)
    const wallNeighbors = {
      left: !!(neighbors && neighbors.left),
      right: !!(neighbors && neighbors.right),
      top: !!(neighbors && neighbors.top),
      bottom: !1, // Garante que a face frontal vertical 40*t seja sempre desenhada com a fenda!
    };
    drawCaveRockWall25D(e, t, isExit ? "earth_mine" : "desert_cave", 0.42, wallNeighbors);

    e.save();
    const baseY = 18 * t;
    const wallH = 40 * t;
    const topFrontY = baseY - wallH; // -22 * t
    const topBackY = -18 * t - wallH; // -58 * t
    const safeTimer = typeof animTimer === "number" && isFinite(animTimer) ? animTimer : 0;
    const pulse = Math.sin(safeTimer * 3.5) * 0.14 + 0.86;

    // 2. Halo terroso/ocre suave projetado no chão de terra diante da fenda
    const glowY = isExit ? topBackY - 4 * t : baseY + 5 * t;
    const floorGlow = e.createRadialGradient(0, glowY, 2 * t, 0, glowY, 24 * t);
    floorGlow.addColorStop(0, `rgba(180, 105, 45, ${0.52 * pulse})`);
    floorGlow.addColorStop(0.5, `rgba(120, 62, 24, ${0.28 * pulse})`);
    floorGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    e.fillStyle = floorGlow;
    e.beginPath();
    e.ellipse(0, glowY, 22 * t, 10 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 3. Fenda Geológica Escarpada em Tons de Terra Rasgando a Face 2.5D do Paredão
    // Borda externa de terra escura / barro compactado
    e.fillStyle = "#26150a";
    e.beginPath();
    e.moveTo(-13 * t, baseY);
    e.lineTo(-11 * t, baseY - 12 * t);
    e.lineTo(-13.5 * t, baseY - 22 * t);
    e.lineTo(-7 * t, baseY - 33 * t);
    e.lineTo(0 * t, topFrontY - 3 * t);
    e.lineTo(7.5 * t, baseY - 32 * t);
    e.lineTo(13 * t, baseY - 20 * t);
    e.lineTo(10.5 * t, baseY - 10 * t);
    e.lineTo(13.5 * t, baseY);
    e.closePath();
    e.fill();

    // Camada intermediária de solo argiloso, siena e ocre terroso
    const fissureGrad = e.createLinearGradient(0, topFrontY, 0, baseY);
    fissureGrad.addColorStop(0, "#1c0f07");
    fissureGrad.addColorStop(0.38, "#3b2210");
    fissureGrad.addColorStop(0.75, "#694122");
    fissureGrad.addColorStop(1, "#854d0e");
    e.fillStyle = fissureGrad;
    e.beginPath();
    e.moveTo(-9.8 * t, baseY);
    e.lineTo(-8.0 * t, baseY - 11 * t);
    e.lineTo(-9.8 * t, baseY - 21 * t);
    e.lineTo(-4.5 * t, baseY - 30 * t);
    e.lineTo(0 * t, topFrontY + 2 * t);
    e.lineTo(5.0 * t, baseY - 29 * t);
    e.lineTo(9.5 * t, baseY - 19 * t);
    e.lineTo(7.8 * t, baseY - 10 * t);
    e.lineTo(10.0 * t, baseY);
    e.closePath();
    e.fill();

    // Vão profundo de sombra terrosa no centro da fenda
    e.fillStyle = "#120904";
    e.beginPath();
    e.moveTo(-6.0 * t, baseY);
    e.lineTo(-5.0 * t, baseY - 14 * t);
    e.lineTo(-2.6 * t, baseY - 25 * t);
    e.lineTo(0 * t, baseY - 29 * t);
    e.lineTo(2.9 * t, baseY - 24 * t);
    e.lineTo(5.0 * t, baseY - 13 * t);
    e.lineTo(6.2 * t, baseY);
    e.closePath();
    e.fill();

    // 4. Saliências de Terra Compactada, Argila Seca e Arenito Ocre nas Bordas Internas da Fenda!
    const earthLedgeColors = ["#7c4d28", "#9a6234", "#5c3a21", "#b45309"];
    const ledges = [
      { x: -8.8, y: baseY - 5 * t, dx: 4.4, dy: -3.6, w: 2.6, c: 0 },
      { x: -7.8, y: baseY - 14 * t, dx: 4.6, dy: -3.2, w: 2.4, c: 2 },
      { x: -5.8, y: baseY - 23 * t, dx: 3.6, dy: -2.5, w: 2.0, c: 1 },
      { x: 9.0, y: baseY - 6 * t, dx: -4.5, dy: -3.6, w: 2.6, c: 1 },
      { x: 8.0, y: baseY - 15 * t, dx: -4.4, dy: -3.2, w: 2.4, c: 3 },
      { x: 6.0, y: baseY - 22 * t, dx: -3.6, dy: -2.4, w: 2.0, c: 0 },
    ];
    for (let i = 0; i < ledges.length; i++) {
      const s = ledges[i];
      e.fillStyle = earthLedgeColors[s.c % earthLedgeColors.length];
      e.beginPath();
      e.moveTo(s.x * t, s.y - s.w * 0.55 * t);
      e.lineTo((s.x + s.dx) * t, s.y + s.dy * t);
      e.lineTo(s.x * t, s.y + s.w * 0.55 * t);
      e.closePath();
      e.fill();
    }

    // Cascalho de terra e torrões de barro na soleira da fenda
    e.fillStyle = "#523118";
    e.beginPath();
    e.ellipse(-7.5 * t, baseY + 1.5 * t, 3.2 * t, 1.6 * t, 0.2, 0, Math.PI * 2);
    e.ellipse(8.0 * t, baseY + 1.8 * t, 3.5 * t, 1.7 * t, -0.2, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#854d0e";
    e.beginPath();
    e.ellipse(-4.2 * t, baseY + 2.2 * t, 2.2 * t, 1.2 * t, 0, 0, Math.PI * 2);
    e.ellipse(4.8 * t, baseY + 2.0 * t, 2.4 * t, 1.3 * t, 0.15, 0, Math.PI * 2);
    e.fill();

    // 5. Fenda em tons de terra rasgando também o topo 2.5D do paredão (visível de dentro do Geodo ao norte!)
    e.fillStyle = "#26150a";
    e.beginPath();
    e.moveTo(-6.5 * t, topBackY);
    e.lineTo(-3.8 * t, topBackY + 18 * t);
    e.lineTo(-1.8 * t, topFrontY);
    e.lineTo(2.2 * t, topFrontY);
    e.lineTo(4.2 * t, topBackY + 16 * t);
    e.lineTo(6.8 * t, topBackY);
    e.closePath();
    e.fill();

    e.strokeStyle = "#7c4d28";
    e.lineWidth = 1.3 * t;
    e.beginPath();
    e.moveTo(-6.5 * t, topBackY);
    e.lineTo(-3.8 * t, topBackY + 18 * t);
    e.lineTo(-1.8 * t, topFrontY);
    e.moveTo(6.8 * t, topBackY);
    e.lineTo(4.2 * t, topBackY + 16 * t);
    e.lineTo(2.2 * t, topFrontY);
    e.stroke();

    e.restore();
  }

  function drawLuminousAlgae(e, t = 1, subType = 0, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    const safeT = typeof animTimer === "number" && isFinite(animTimer) ? animTimer : 0;
    const sway = Math.sin(safeT * 2.6 + subType * 1.7) * 2.2 * t;
    const pulse = Math.sin(safeT * 3.8 + subType * 1.1) * 0.18 + 0.82;

    e.save();

    // Halo bioluminescente subaquático
    const glowGrad = e.createRadialGradient(0, 0, 1 * t, 0, 0, 15 * t);
    if (subType === 1) {
      glowGrad.addColorStop(0, `rgba(56, 189, 248, ${0.52 * pulse})`);
      glowGrad.addColorStop(0.55, `rgba(20, 184, 166, ${0.24 * pulse})`);
    } else if (subType === 2) {
      glowGrad.addColorStop(0, `rgba(163, 230, 53, ${0.5 * pulse})`);
      glowGrad.addColorStop(0.55, `rgba(16, 185, 129, ${0.24 * pulse})`);
    } else {
      glowGrad.addColorStop(0, `rgba(45, 212, 191, ${0.55 * pulse})`);
      glowGrad.addColorStop(0.55, `rgba(16, 185, 129, ${0.26 * pulse})`);
    }
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    e.fillStyle = glowGrad;
    e.beginPath();
    e.ellipse(0, 1 * t, 15 * t, 9.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Filamentos e frondes ondulantes de algas luminosas emergindo da água
    const fronds = [
      { bx: -5.5, by: 3.5, h: 11.5, w: 2.2, ph: 0 },
      { bx: -2.0, by: 4.2, h: 14.0, w: 2.5, ph: 1.2 },
      { bx: 2.2, by: 3.8, h: 12.8, w: 2.4, ph: 2.4 },
      { bx: 5.8, by: 3.0, h: 9.8, w: 2.0, ph: 3.6 },
    ];
    const mainCol = subType === 1 ? "#38bdf8" : subType === 2 ? "#4ade80" : "#2dd4bf";
    const coreCol = subType === 1 ? "#bae6fd" : subType === 2 ? "#dcfce7" : "#99f6e4";

    for (let i = 0; i < fronds.length; i++) {
      const f = fronds[i];
      const fSway = Math.sin(safeT * 2.8 + f.ph) * 2.4 * t;
      const startX = f.bx * t;
      const startY = f.by * t;
      const tipX = startX + fSway;
      const tipY = startY - f.h * t;

      e.strokeStyle = mainCol;
      e.lineWidth = f.w * t;
      e.lineCap = "round";
      e.beginPath();
      e.moveTo(startX, startY);
      e.quadraticCurveTo(startX - fSway * 0.45, startY - f.h * 0.5 * t, tipX, tipY);
      e.stroke();

      e.strokeStyle = coreCol;
      e.lineWidth = f.w * 0.45 * t;
      e.beginPath();
      e.moveTo(startX, startY - 1 * t);
      e.quadraticCurveTo(startX - fSway * 0.45, startY - f.h * 0.5 * t, tipX, tipY);
      e.stroke();

      // Vesícula luminosa na ponta da alga
      e.fillStyle = "#ffffff";
      e.beginPath();
      e.arc(tipX, tipY, 1.35 * t * pulse, 0, Math.PI * 2);
      e.fill();
    }

    // Bolhas/esporos bioluminescentes flutuando na superfície do lago
    const orbs = [
      { ox: -7.5, oy: -2.0, r: 1.2 },
      { ox: 0.5, oy: -11.5, r: 1.4 },
      { ox: 7.2, oy: -3.5, r: 1.1 },
    ];
    e.fillStyle = coreCol;
    for (let i = 0; i < orbs.length; i++) {
      const ob = orbs[i];
      const bob = Math.sin(safeT * 3.5 + i * 2.1) * 1.4 * t;
      e.beginPath();
      e.arc(ob.ox * t + sway * 0.3, ob.oy * t + bob, ob.r * t * pulse, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }

  function drawIronBarsGate(e, t = 1, isVert = !0, isOpened = !1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();

    if (isVert) {
      // Portão de grade das celas em parede vertical (dx === -2, alinhado Norte-Sul)
      // 1. Sombra da base
      e.fillStyle = "rgba(2, 6, 23, 0.6)";
      e.fillRect(-5 * t, -16 * t, 10 * t, 32 * t);

      // 2. Soleira de cantaria escura no piso do vão
      e.fillStyle = "#0f172a";
      e.fillRect(-4.5 * t, -11 * t, 9 * t, 22 * t);
      e.strokeStyle = "rgba(255, 255, 255, 0.08)";
      e.lineWidth = 1 * t;
      e.strokeRect(-4.5 * t, -11 * t, 9 * t, 22 * t);

      // 3. Batentes de alvenaria superior e inferior (conectando às paredes norte e sul)
      // Batente Superior (conecta com a parede norte em y = -16*t)
      e.fillStyle = "#1e293b";
      e.fillRect(-5 * t, -16 * t, 10 * t, 5 * t);
      e.strokeStyle = "#090d16";
      e.lineWidth = 1 * t;
      e.strokeRect(-5 * t, -16 * t, 10 * t, 5 * t);

      // Batente Inferior (conecta com a parede sul em y = 11*t)
      e.fillStyle = "#1e293b";
      e.fillRect(-5 * t, 11 * t, 10 * t, 5 * t);
      e.strokeRect(-5 * t, 11 * t, 10 * t, 5 * t);

      if (isOpened) {
        // GRADE DA CELA ABERTA NORMALMENTE:
        // Usa o MESMO modo de abrir das portas normais:
        // O portão de ferro gira 90 graus na dobradiça superior e abre para dentro da cela (-X)
        // Tamanho AUMENTADO, grande e proporcional (altura 20*t, largura 11.5*t), NUNCA cortado!
        
        // Sombra da grade aberta no chão da cela
        e.fillStyle = "rgba(0, 0, 0, 0.35)";
        e.fillRect(-13.5 * t, -9 * t, 12 * t, 19 * t);

        // Moldura externa da grade aberta em ferro escuro forjado
        e.fillStyle = "#0f172a";
        e.fillRect(-13 * t, -11 * t, 11.5 * t, 20 * t);
        e.strokeStyle = "#334155";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-13 * t, -11 * t, 11.5 * t, 20 * t);

        // Vão interior da grade aberta
        e.fillStyle = "#1e293b";
        e.fillRect(-12 * t, -10 * t, 9.5 * t, 18 * t);

        // Travessas horizontais de reforço
        e.fillStyle = "#0f172a";
        e.fillRect(-13 * t, -6 * t, 11.5 * t, 2.5 * t);
        e.fillRect(-13 * t, 1 * t, 11.5 * t, 2.5 * t);

        // Barras verticais de ferro com pontas pontiagudas
        e.fillStyle = "#475569";
        for (const bx of [-11, -8.5, -6, -3.5]) {
          e.fillRect(bx * t, -11 * t, 1.8 * t, 20 * t);
          // Pontas afiadas no topo
          e.beginPath();
          e.moveTo(bx * t, -11 * t);
          e.lineTo((bx + 0.9) * t, -13.5 * t);
          e.lineTo((bx + 1.8) * t, -11 * t);
          e.closePath();
          e.fill();
        }

        // Dobradiças de ferro maciço no batente superior
        e.fillStyle = "#0f172a";
        e.fillRect(-3 * t, -12 * t, 4 * t, 5 * t);
        e.fillRect(-11 * t, -12 * t, 3 * t, 5 * t);

        // Cadeado destrancado aberto pendurado na borda que abre
        e.fillStyle = "#78350f";
        e.fillRect(-14 * t, -1 * t, 3.5 * t, 4 * t);
        e.strokeStyle = "#d97706";
        e.lineWidth = 0.9 * t;
        e.strokeRect(-14 * t, -1 * t, 3.5 * t, 4 * t);
        e.beginPath();
        e.arc(-12.2 * t, -2 * t, 1.6 * t, Math.PI * 0.8, Math.PI * 1.8);
        e.stroke();

        // Passagem da porta 100% aberta e desimpedida do corredor para a cela
        e.fillStyle = "rgba(255, 255, 255, 0.05)";
        e.fillRect(-1.5 * t, -11 * t, 6 * t, 22 * t);
      } else {
        // GRADE DA CELA FECHADA E TRANCADA NA VERTICAL (conectando batente norte ao sul)
        // Moldura externa da grade de ferro
        e.fillStyle = "#0f172a";
        e.fillRect(-4 * t, -11 * t, 8 * t, 22 * t);
        e.strokeStyle = "#334155";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-4 * t, -11 * t, 8 * t, 22 * t);

        // Travessas horizontais de ferro
        e.fillStyle = "#090d16";
        e.fillRect(-4.5 * t, -6 * t, 9 * t, 2.5 * t);
        e.fillRect(-4.5 * t, 4 * t, 9 * t, 2.5 * t);

        // Barras verticais redondas de aço
        e.fillStyle = "#475569";
        for (const bx of [-2.5, 0, 2.5]) {
          e.fillRect((bx - 0.9) * t, -11 * t, 1.8 * t, 22 * t);
          // Pontas pontiagudas no topo
          e.beginPath();
          e.moveTo((bx - 0.9) * t, -11 * t);
          e.lineTo(bx * t, -13.5 * t);
          e.lineTo((bx + 0.9) * t, -11 * t);
          e.closePath();
          e.fill();
        }

        // Cadeado pesado de ferro e bronze com corrente na tranca central
        e.fillStyle = "#78350f";
        e.fillRect(-2 * t, -2 * t, 4 * t, 4.5 * t);
        e.strokeStyle = "#d97706";
        e.lineWidth = 0.9 * t;
        e.strokeRect(-2 * t, -2 * t, 4 * t, 4.5 * t);
        e.beginPath();
        e.arc(0, -2.5 * t, 1.6 * t, Math.PI, 0);
        e.stroke();
        e.fillStyle = "#0f172a";
        e.beginPath();
        e.arc(0, -0.2 * t, 0.7 * t, 0, Math.PI * 2);
        e.fillRect(-0.4 * t, -0.2 * t, 0.8 * t, 1.5 * t);
        e.fill();
      }
    } else {
      // Fallback para parede horizontal (caso ocorra em algum corredor)
      e.fillStyle = "rgba(2, 6, 23, 0.6)";
      e.fillRect(-16 * t, -16 * t, 32 * t, 32 * t);

      e.fillStyle = "#0f172a";
      e.fillRect(-12 * t, -14 * t, 24 * t, 28 * t);

      e.fillStyle = "#1e293b";
      e.fillRect(-16 * t, -17 * t, 4.5 * t, 34 * t);
      e.fillRect(11.5 * t, -17 * t, 4.5 * t, 34 * t);
      e.strokeStyle = "#0f172a";
      e.lineWidth = 1 * t;
      e.strokeRect(-16 * t, -17 * t, 4.5 * t, 34 * t);
      e.strokeRect(11.5 * t, -17 * t, 4.5 * t, 34 * t);

      if (isOpened) {
        // Grade aberta em perspectiva aumentada rente à esquerda
        e.fillStyle = "#0f172a";
        e.fillRect(-12 * t, -15 * t, 10 * t, 29 * t);
        e.strokeStyle = "#334155";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-12 * t, -15 * t, 10 * t, 29 * t);

        e.fillStyle = "#475569";
        for (const bx of [-10, -7, -4]) {
          e.fillRect(bx * t, -15 * t, 1.8 * t, 29 * t);
        }
        e.fillStyle = "rgba(255, 255, 255, 0.05)";
        e.fillRect(-2 * t, -14 * t, 13.5 * t, 28 * t);
      } else {
        e.fillStyle = "#0f172a";
        e.fillRect(-14 * t, -14 * t, 28 * t, 3 * t);
        e.fillRect(-14 * t, -1 * t, 28 * t, 3 * t);
        e.fillRect(-14 * t, 11 * t, 28 * t, 3 * t);

        e.fillStyle = "#334155";
        for (let bx = -10; bx <= 10; bx += 4) {
          e.fillRect((bx - 1) * t, -16 * t, 2.2 * t, 29 * t);
        }
      }
    }

    e.restore();
  }

  function drawDungeonDoor(e, t = 1, isVert = !1, isOpened = !1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();

    if (isVert) {
      // Porta em parede vertical (passagem Leste-Oeste entre corredor e salão)
      // 1. Sombra e soleira de pedra no chão
      e.fillStyle = "rgba(2, 6, 23, 0.6)";
      e.fillRect(-5 * t, -16 * t, 10 * t, 32 * t);

      e.fillStyle = "#0f172a";
      e.fillRect(-4.5 * t, -11 * t, 9 * t, 22 * t);
      e.strokeStyle = "rgba(255, 255, 255, 0.08)";
      e.lineWidth = 1 * t;
      e.strokeRect(-4.5 * t, -11 * t, 9 * t, 22 * t);

      // 2. Batentes de alvenaria superior e inferior (EXATAMENTE IDENTICOS aberta e fechada!)
      // Batente Superior (conecta com a parede norte)
      e.fillStyle = "#1e293b";
      e.fillRect(-5 * t, -16 * t, 10 * t, 5 * t);
      e.strokeStyle = "#090d16";
      e.lineWidth = 1 * t;
      e.strokeRect(-5 * t, -16 * t, 10 * t, 5 * t);

      // Batente Inferior (conecta com a parede sul)
      e.fillStyle = "#1e293b";
      e.fillRect(-5 * t, 11 * t, 10 * t, 5 * t);
      e.strokeRect(-5 * t, 11 * t, 10 * t, 5 * t);

      if (isOpened) {
        // PORTA COMUM ABERTA NORMALMENTE:
        // Folha ÚNICA inteira de carvalho que gira 90 graus na dobradiça superior e abre para dentro do salão (+X)
        // NÃO DIVIDE NO MEIO: é uma porta comum de folha única!
        // TAMANHO AUMENTADO (altura 20*t, largura 11.5*t): grande, substancial, imponente e NUNCA cortada!
        
        // Sombra da porta aberta no piso do salão
        e.fillStyle = "rgba(0, 0, 0, 0.35)";
        e.fillRect(1.5 * t, -9 * t, 12 * t, 19 * t);

        // Folha da porta de carvalho maciço aberta vista em perspectiva no salão
        e.fillStyle = "#5c2e0b";
        e.fillRect(1.5 * t, -11 * t, 11.5 * t, 20 * t);
        e.strokeStyle = "#381c07";
        e.lineWidth = 1.2 * t;
        e.strokeRect(1.5 * t, -11 * t, 11.5 * t, 20 * t);

        // Frisos verticais das pranchas de madeira na folha aberta
        e.strokeStyle = "#451a03";
        e.lineWidth = 0.9 * t;
        e.beginPath();
        e.moveTo(5.3 * t, -11 * t); e.lineTo(5.3 * t, 9 * t);
        e.moveTo(9.1 * t, -11 * t); e.lineTo(9.1 * t, 9 * t);
        e.stroke();

        // Cintas reforçadas de ferro forjado horizontais
        e.fillStyle = "#0f172a";
        e.fillRect(1.5 * t, -7 * t, 11.5 * t, 2.5 * t);
        e.fillRect(1.5 * t, 3 * t, 11.5 * t, 2.5 * t);

        // Rebites de ferro nas cintas
        e.fillStyle = "#94a3b8";
        for (const bx of [3.5, 7.2, 11]) {
          e.beginPath();
          e.arc(bx * t, -5.8 * t, 0.9 * t, 0, Math.PI * 2);
          e.arc(bx * t, 4.2 * t, 0.9 * t, 0, Math.PI * 2);
          e.fill();
        }

        // Dobradiças de ferro no batente superior
        e.fillStyle = "#0f172a";
        e.fillRect(-1 * t, -12 * t, 4 * t, 5 * t);
        e.fillRect(8 * t, -12 * t, 3 * t, 5 * t);

        // Maçaneta e argola de ferro na ponta da porta aberta
        e.strokeStyle = "#cbd5e1";
        e.lineWidth = 1.2 * t;
        e.beginPath();
        e.arc(11.5 * t, -1 * t, 1.8 * t, 0, Math.PI * 2);
        e.stroke();

        // Passagem livre central totalmente desimpedida
        e.fillStyle = "rgba(255, 255, 255, 0.05)";
        e.fillRect(-4.5 * t, -11 * t, 6 * t, 22 * t);
      } else {
        // PORTA COMUM FECHADA (Folha única maciça de carvalho conectando do topo até a base)
        e.fillStyle = "#5c2e0b";
        e.fillRect(-4 * t, -11 * t, 8 * t, 22 * t);
        e.strokeStyle = "#381c07";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-4 * t, -11 * t, 8 * t, 22 * t);

        // Frisos verticais
        e.strokeStyle = "#451a03";
        e.lineWidth = 0.9 * t;
        e.beginPath();
        e.moveTo(-1.3 * t, -11 * t); e.lineTo(-1.3 * t, 11 * t);
        e.moveTo(1.3 * t, -11 * t); e.lineTo(1.3 * t, 11 * t);
        e.stroke();

        // Cintas de ferro forjado reforçando a folha
        e.fillStyle = "#0f172a";
        e.fillRect(-4.5 * t, -7 * t, 9 * t, 2.5 * t);
        e.fillRect(-4.5 * t, 5 * t, 9 * t, 2.5 * t);

        // Rebites
        e.fillStyle = "#94a3b8";
        for (const bx of [-2.5, 0, 2.5]) {
          e.beginPath();
          e.arc(bx * t, -5.8 * t, 0.9 * t, 0, Math.PI * 2);
          e.arc(bx * t, 6.2 * t, 0.9 * t, 0, Math.PI * 2);
          e.fill();
        }

        // Maçaneta com argola de ferro para abrir
        e.strokeStyle = "#cbd5e1";
        e.lineWidth = 1.3 * t;
        e.beginPath();
        e.arc(1.5 * t, 0, 2.2 * t, 0, Math.PI * 2);
        e.stroke();
      }
    } else {
      // Porta em parede horizontal (passagem Norte-Sul)
      // 1. Sombra da base
      e.fillStyle = "rgba(2, 6, 23, 0.6)";
      e.fillRect(-16 * t, -16 * t, 32 * t, 32 * t);

      // 2. Soleira de pedra no chão
      e.fillStyle = "#0f172a";
      e.fillRect(-11 * t, -15 * t, 22 * t, 30 * t);
      e.strokeStyle = "rgba(255, 255, 255, 0.08)";
      e.lineWidth = 1 * t;
      e.strokeRect(-11 * t, -15 * t, 22 * t, 30 * t);

      // 3. Batentes laterais de alvenaria (EXATAMENTE IDENTICOS aberta e fechada!)
      e.fillStyle = "#1e293b";
      e.fillRect(-16 * t, -16 * t, 5 * t, 32 * t);
      e.fillRect(11 * t, -16 * t, 5 * t, 32 * t);
      e.strokeStyle = "#090d16";
      e.lineWidth = 1 * t;
      e.strokeRect(-16 * t, -16 * t, 5 * t, 32 * t);
      e.strokeRect(11 * t, -16 * t, 5 * t, 32 * t);

      if (isOpened) {
        // PORTA COMUM ABERTA NORMALMENTE:
        // Folha ÚNICA inteira de carvalho que gira 90 graus na dobradiça esquerda e fica aberta
        // TAMANHO AUMENTADO (largura 11*t, altura total 30*t): grande, substancial e NUNCA cortada!
        
        // Sombra da folha aberta
        e.fillStyle = "rgba(0, 0, 0, 0.35)";
        e.fillRect(-11 * t, -13 * t, 12 * t, 29 * t);

        // Folha de carvalho aberta
        e.fillStyle = "#5c2e0b";
        e.fillRect(-11 * t, -15 * t, 11 * t, 30 * t);
        e.strokeStyle = "#381c07";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-11 * t, -15 * t, 11 * t, 30 * t);

        // Frisos das pranchas
        e.strokeStyle = "#451a03";
        e.lineWidth = 0.9 * t;
        e.beginPath();
        e.moveTo(-7.5 * t, -15 * t); e.lineTo(-7.5 * t, 15 * t);
        e.moveTo(-4 * t, -15 * t); e.lineTo(-4 * t, 15 * t);
        e.stroke();

        // Cintas de ferro da folha aberta conectadas ao batente esquerdo
        e.fillStyle = "#0f172a";
        e.fillRect(-11 * t, -10 * t, 11 * t, 3.5 * t);
        e.fillRect(-11 * t, 7 * t, 11 * t, 3.5 * t);

        // Rebites
        e.fillStyle = "#94a3b8";
        for (const rx of [-9, -5.5, -2]) {
          e.beginPath();
          e.arc(rx * t, -8.2 * t, 1 * t, 0, Math.PI * 2);
          e.arc(rx * t, 8.8 * t, 1 * t, 0, Math.PI * 2);
          e.fill();
        }

        // Maçaneta na borda livre da porta aberta
        e.strokeStyle = "#cbd5e1";
        e.lineWidth = 1.2 * t;
        e.beginPath();
        e.arc(-1 * t, 0, 2.2 * t, 0, Math.PI * 2);
        e.stroke();

        // Vão central 100% aberto e desimpedido para passagem
        e.fillStyle = "rgba(255, 255, 255, 0.05)";
        e.fillRect(0 * t, -15 * t, 11 * t, 30 * t);
      } else {
        // PORTA COMUM FECHADA (Folha única maciça de carvalho preenchendo todo o vão)
        e.fillStyle = "#5c2e0b";
        e.fillRect(-11 * t, -15 * t, 22 * t, 30 * t);
        e.strokeStyle = "#381c07";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-11 * t, -15 * t, 22 * t, 30 * t);

        // Frisos de pranchas de madeira da folha única
        e.strokeStyle = "#451a03";
        e.lineWidth = 1 * t;
        e.beginPath();
        e.moveTo(-5.5 * t, -15 * t); e.lineTo(-5.5 * t, 15 * t);
        e.moveTo(0, -15 * t); e.lineTo(0, 15 * t);
        e.moveTo(5.5 * t, -15 * t); e.lineTo(5.5 * t, 15 * t);
        e.stroke();

        // Cintas de ferro horizontais reforçadas
        e.fillStyle = "#0f172a";
        e.fillRect(-11 * t, -10 * t, 22 * t, 3.5 * t);
        e.fillRect(-11 * t, 7 * t, 22 * t, 3.5 * t);

        // Rebites de ferro
        e.fillStyle = "#94a3b8";
        for (const rx of [-8, -3, 3, 8]) {
          e.beginPath();
          e.arc(rx * t, -8.2 * t, 1.1 * t, 0, Math.PI * 2);
          e.arc(rx * t, 8.8 * t, 1.1 * t, 0, Math.PI * 2);
          e.fill();
        }

        // Maçaneta única com argola do lado direito para abrir
        e.strokeStyle = "#cbd5e1";
        e.lineWidth = 1.3 * t;
        e.beginPath();
        e.arc(6 * t, 0, 2.6 * t, 0, Math.PI * 2);
        e.stroke();
      }
    }

    e.restore();
  }

  function drawTortureRack(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra
    e.fillStyle = "rgba(2, 6, 23, 0.6)";
    e.fillRect(-18 * t, -8 * t, 36 * t, 20 * t);

    // Estrutura de vigas de madeira escura
    e.fillStyle = "#3e2723";
    e.fillRect(-16 * t, -12 * t, 32 * t, 4 * t);
    e.fillRect(-16 * t, 8 * t, 32 * t, 4 * t);
    e.fillRect(-16 * t, -12 * t, 4 * t, 24 * t);
    e.fillRect(12 * t, -12 * t, 4 * t, 24 * t);

    // Prancha central manchada de sangue antigo
    e.fillStyle = "#5d4037";
    e.fillRect(-12 * t, -8 * t, 24 * t, 16 * t);
    e.fillStyle = "rgba(127, 29, 29, 0.75)";
    e.beginPath();
    e.ellipse(0, 0, 8 * t, 5 * t, 0.3, 0, Math.PI * 2);
    e.fill();

    // Rolos cilíndricos com manivelas nas pontas
    e.fillStyle = "#1e293b";
    e.fillRect(-14 * t, -7 * t, 3 * t, 14 * t);
    e.fillRect(11 * t, -7 * t, 3 * t, 14 * t);

    // Manivelas dentadas
    e.strokeStyle = "#475569";
    e.lineWidth = 1.8 * t;
    e.beginPath();
    e.moveTo(13 * t, -10 * t); e.lineTo(17 * t, -14 * t);
    e.moveTo(13 * t, 10 * t); e.lineTo(17 * t, 14 * t);
    e.stroke();

    // Correntes de ferro esticadas
    e.strokeStyle = "#94a3b8";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(-11 * t, -4 * t); e.lineTo(-5 * t, -2 * t);
    e.moveTo(-11 * t, 4 * t); e.lineTo(-5 * t, 2 * t);
    e.moveTo(11 * t, -4 * t); e.lineTo(5 * t, -2 * t);
    e.moveTo(11 * t, 4 * t); e.lineTo(5 * t, 2 * t);
    e.stroke();

    // Manoplas de couro/ferro
    e.fillStyle = "#78350f";
    e.fillRect(-6 * t, -4 * t, 2 * t, 3 * t);
    e.fillRect(-6 * t, 1 * t, 2 * t, 3 * t);
    e.fillRect(4 * t, -4 * t, 2 * t, 3 * t);
    e.fillRect(4 * t, 1 * t, 2 * t, 3 * t);

    e.restore();
  }

  function drawIronMaiden(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra
    e.fillStyle = "rgba(2, 6, 23, 0.65)";
    e.beginPath();
    e.ellipse(0, 12 * t, 14 * t, 6 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Corpo do sarcófago de ferro negro
    e.fillStyle = "#1e293b";
    e.fillRect(-9 * t, -24 * t, 18 * t, 34 * t);

    // Topo em arco
    e.beginPath();
    e.arc(0, -24 * t, 9 * t, Math.PI, 0);
    e.fill();

    // Borda metálica e rebites
    e.strokeStyle = "#475569";
    e.lineWidth = 1.5 * t;
    e.strokeRect(-9 * t, -24 * t, 18 * t, 34 * t);

    // Rosto moldado na porta em agonia
    e.fillStyle = "#334155";
    e.beginPath();
    e.ellipse(0, -22 * t, 5 * t, 6 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#0f172a";
    e.fillRect(-2.5 * t, -24 * t, 1.8 * t, 2 * t);
    e.fillRect(0.8 * t, -24 * t, 1.8 * t, 2 * t);
    e.fillRect(-2 * t, -19 * t, 4 * t, 2.5 * t);

    // Porta ligeiramente entreaberta mostrando espinhos afiados por dentro
    e.fillStyle = "#09090b";
    e.fillRect(2 * t, -18 * t, 6 * t, 27 * t);

    // Espinhos pontiagudos internos brilhando
    e.fillStyle = "#cbd5e1";
    for (let sy = -14; sy <= 6; sy += 5) {
      e.beginPath();
      e.moveTo(8 * t, sy * t);
      e.lineTo(3 * t, (sy + 1.5) * t);
      e.lineTo(8 * t, (sy + 3) * t);
      e.closePath();
      e.fill();
    }

    e.restore();
  }

  function drawHangingCage(e, t = 1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    const sway = Math.sin((animTimer || 0) * 1.6) * 0.04;
    e.rotate(sway);

    // Corrente pendurada no teto
    e.strokeStyle = "#475569";
    e.lineWidth = 1.4 * t;
    e.beginPath();
    e.moveTo(0, -32 * t);
    e.lineTo(0, -14 * t);
    e.stroke();

    // Sombra no chão
    e.fillStyle = "rgba(2, 6, 23, 0.45)";
    e.beginPath();
    e.ellipse(0, 10 * t, 10 * t, 4 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Cúpula e anéis da gaiola
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.ellipse(0, -14 * t, 8 * t, 3 * t, 0, 0, Math.PI * 2);
    e.ellipse(0, 2 * t, 8 * t, 3 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Barras verticais da gaiola
    e.strokeStyle = "#334155";
    e.lineWidth = 1.6 * t;
    for (const bx of [-7, -3.5, 0, 3.5, 7]) {
      e.beginPath();
      e.moveTo(bx * t, -14 * t);
      e.lineTo(bx * t, 2 * t);
      e.stroke();
    }

    // Ossadas e crânio dentro da gaiola
    e.fillStyle = "#e2e8f0";
    // Crânio
    e.beginPath();
    e.arc(1 * t, -4 * t, 3 * t, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#0f172a";
    e.fillRect(0, -4.5 * t, 1 * t, 1.2 * t);
    e.fillRect(2 * t, -4.5 * t, 1 * t, 1.2 * t);
    // Costelas / ossos
    e.strokeStyle = "#cbd5e1";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(-2 * t, -1 * t); e.lineTo(3 * t, 0);
    e.stroke();

    e.restore();
  }

  function drawTortureBrazier(e, t = 1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra
    e.fillStyle = "rgba(2, 6, 23, 0.55)";
    e.beginPath();
    e.ellipse(0, 8 * t, 12 * t, 5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Tripé de ferro forjado
    e.strokeStyle = "#1e293b";
    e.lineWidth = 2 * t;
    e.beginPath();
    e.moveTo(0, 2 * t); e.lineTo(-8 * t, 8 * t);
    e.moveTo(0, 2 * t); e.lineTo(8 * t, 8 * t);
    e.moveTo(0, 2 * t); e.lineTo(0, 8 * t);
    e.stroke();

    // Bacia de ferro
    e.fillStyle = "#0f172a";
    e.beginPath();
    e.ellipse(0, 0, 11 * t, 5 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#334155";
    e.lineWidth = 1.5 * t;
    e.stroke();

    // Carvão em brasa ardente
    const flicker = Math.sin((animTimer || 0) * 7) * 0.15;
    e.fillStyle = `rgba(239, 68, 68, ${0.85 + flicker})`;
    e.beginPath();
    e.ellipse(0, -1 * t, 9 * t, 3.8 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "rgba(249, 115, 22, 0.9)";
    e.beginPath();
    e.ellipse(0, -1.5 * t, 6 * t, 2.5 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "rgba(254, 240, 138, 0.95)";
    e.beginPath();
    e.ellipse(0, -2 * t, 3 * t, 1.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Ferros de marcar a brasa compridos saindo do braseiro
    e.strokeStyle = "#1e293b";
    e.lineWidth = 1.6 * t;
    e.beginPath();
    e.moveTo(-3 * t, -1 * t); e.lineTo(-11 * t, -12 * t);
    e.moveTo(2 * t, -1 * t); e.lineTo(10 * t, -11 * t);
    e.stroke();
    // Pontas incandescentes dos ferros
    e.strokeStyle = "#ef4444";
    e.lineWidth = 2.2 * t;
    e.beginPath();
    e.moveTo(-1 * t, -1 * t); e.lineTo(-4 * t, -3 * t);
    e.moveTo(1 * t, -1 * t); e.lineTo(3.5 * t, -3 * t);
    e.stroke();

    e.restore();
  }

  function drawTortureTools(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Mesa rústica ensanguentada
    e.fillStyle = "rgba(2, 6, 23, 0.5)";
    e.fillRect(-14 * t, -4 * t, 28 * t, 14 * t);

    e.fillStyle = "#292524";
    e.fillRect(-12 * t, -8 * t, 24 * t, 12 * t);
    e.strokeStyle = "#1c1917";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-12 * t, -8 * t, 24 * t, 12 * t);

    // Manchas de sangue
    e.fillStyle = "rgba(185, 28, 28, 0.7)";
    e.beginPath();
    e.ellipse(-4 * t, -2 * t, 4 * t, 2 * t, 0.2, 0, Math.PI * 2);
    e.fill();

    // Ferramentas: serra, tenaz, pinças
    e.strokeStyle = "#94a3b8";
    e.lineWidth = 1.3 * t;
    // Serra
    e.beginPath();
    e.moveTo(2 * t, -6 * t); e.lineTo(9 * t, -2 * t);
    e.stroke();
    // Pinças / Alicates
    e.beginPath();
    e.moveTo(-8 * t, -5 * t); e.lineTo(-4 * t, -1 * t);
    e.moveTo(-8 * t, -1 * t); e.lineTo(-4 * t, -5 * t);
    e.stroke();

    e.restore();
  }

  function drawLatrinePit(e, t = 1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Borda de pedra escavada da fossa
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.ellipse(0, 0, 18 * t, 14 * t, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#0f172a";
    e.lineWidth = 2 * t;
    e.stroke();

    // Poço profundo escuro
    e.fillStyle = "#020617";
    e.beginPath();
    e.ellipse(0, 0, 15 * t, 11 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Água pútrida/lama com reflexos verdes de limo
    const wave = Math.sin((animTimer || 0) * 2) * 0.5 * t;
    e.fillStyle = "rgba(20, 83, 45, 0.55)";
    e.beginPath();
    e.ellipse(0, wave, 13 * t, 9 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Grade de escoamento de ferro cruzando a fossa
    e.strokeStyle = "#334155";
    e.lineWidth = 1.5 * t;
    e.beginPath();
    for (let gx = -10; gx <= 10; gx += 4) {
      e.moveTo(gx * t, -7 * t);
      e.lineTo(gx * t, 7 * t);
    }
    e.moveTo(-12 * t, 0);
    e.lineTo(12 * t, 0);
    e.stroke();

    // Pranchas podres de contenção nas bordas
    e.fillStyle = "#3e2723";
    e.fillRect(-16 * t, -12 * t, 9 * t, 3.5 * t);
    e.fillRect(7 * t, 8 * t, 10 * t, 3.5 * t);

    e.restore();
  }

  function drawLatrineBench(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Bancos de latrina em alvenaria
    e.fillStyle = "rgba(2, 6, 23, 0.5)";
    e.fillRect(-12 * t, -4 * t, 24 * t, 14 * t);

    // Bloco de cantaria da latrina
    e.fillStyle = "#334155";
    e.fillRect(-10 * t, -8 * t, 20 * t, 14 * t);
    e.strokeStyle = "#1e293b";
    e.lineWidth = 1.3 * t;
    e.strokeRect(-10 * t, -8 * t, 20 * t, 14 * t);

    // Orifícios escavados na pedra
    e.fillStyle = "#020617";
    e.beginPath();
    e.ellipse(-4 * t, -2 * t, 3 * t, 3.5 * t, 0, 0, Math.PI * 2);
    e.ellipse(4 * t, -2 * t, 3 * t, 3.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Tampo de madeira encostado na parede
    e.fillStyle = "#451a03";
    e.fillRect(-9 * t, -11 * t, 18 * t, 3 * t);

    e.restore();
  }

  function drawDungeonSkeleton(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra
    e.fillStyle = "rgba(2, 6, 23, 0.4)";
    e.beginPath();
    e.ellipse(0, 2 * t, 10 * t, 5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Correntes e grilhões presos na parede
    e.strokeStyle = "#475569";
    e.lineWidth = 1.3 * t;
    e.beginPath();
    e.moveTo(-8 * t, -8 * t); e.lineTo(-5 * t, -3 * t);
    e.moveTo(8 * t, -8 * t); e.lineTo(5 * t, -3 * t);
    e.stroke();

    // Crânio
    e.fillStyle = "#cbd5e1";
    e.beginPath();
    e.arc(0, -3 * t, 3.2 * t, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#0f172a";
    e.fillRect(-1.5 * t, -3.5 * t, 1 * t, 1 * t);
    e.fillRect(0.5 * t, -3.5 * t, 1 * t, 1 * t);

    // Costelas e ossos caídos
    e.strokeStyle = "#94a3b8";
    e.lineWidth = 1.2 * t;
    e.beginPath();
    e.moveTo(-3 * t, 0); e.lineTo(3 * t, 0);
    e.moveTo(-2.5 * t, 2 * t); e.lineTo(2.5 * t, 2 * t);
    e.moveTo(-4 * t, 4 * t); e.lineTo(-1 * t, 7 * t);
    e.moveTo(4 * t, 4 * t); e.lineTo(1 * t, 7 * t);
    e.stroke();

    e.restore();
  }

  function drawDungeonStraw(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Monte de palha mofada
    e.fillStyle = "#713f12";
    e.beginPath();
    e.ellipse(0, 0, 11 * t, 6 * t, 0.1, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#a16207";
    e.lineWidth = 1 * t;
    for (let i = -7; i <= 7; i += 3) {
      e.beginPath();
      e.moveTo(i * t, -3 * t);
      e.lineTo((i + 2) * t, 3 * t);
      e.stroke();
    }
    // Tigela de barro quebrada
    e.fillStyle = "#9a3412";
    e.beginPath();
    e.arc(6 * t, 2 * t, 2.2 * t, 0, Math.PI);
    e.fill();
    e.restore();
  }

  function drawJailerTable(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    e.fillStyle = "rgba(2, 6, 23, 0.5)";
    e.fillRect(-13 * t, -4 * t, 26 * t, 14 * t);

    e.fillStyle = "#3e2723";
    e.fillRect(-11 * t, -8 * t, 22 * t, 12 * t);
    e.strokeStyle = "#1b0f0a";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-11 * t, -8 * t, 22 * t, 12 * t);

    // Livro de registros de prisioneiros
    e.fillStyle = "#fef3c7";
    e.fillRect(-6 * t, -6 * t, 6 * t, 8 * t);
    e.strokeStyle = "#78350f";
    e.lineWidth = 0.8 * t;
    e.strokeRect(-6 * t, -6 * t, 6 * t, 8 * t);

    // Garrafa e chaveiro
    e.fillStyle = "#15803d";
    e.fillRect(3 * t, -6 * t, 2.5 * t, 5 * t);
    // Argola com chaves de ferro
    e.strokeStyle = "#cbd5e1";
    e.lineWidth = 1.1 * t;
    e.beginPath();
    e.arc(6 * t, 0, 2 * t, 0, Math.PI * 2);
    e.moveTo(6 * t, 2 * t); e.lineTo(7 * t, 4 * t);
    e.stroke();

    e.restore();
  }

  function drawWeaponRack(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    e.fillStyle = "rgba(2, 6, 23, 0.45)";
    e.fillRect(-11 * t, -2 * t, 22 * t, 10 * t);

    // Suporte de madeira
    e.fillStyle = "#451a03";
    e.fillRect(-9 * t, -12 * t, 3 * t, 18 * t);
    e.fillRect(6 * t, -12 * t, 3 * t, 18 * t);
    e.fillRect(-9 * t, -6 * t, 18 * t, 2.5 * t);

    // Lanças e alabardas enferrujadas
    e.strokeStyle = "#78350f";
    e.lineWidth = 1.4 * t;
    e.beginPath();
    e.moveTo(-5 * t, 4 * t); e.lineTo(-2 * t, -16 * t);
    e.moveTo(2 * t, 4 * t); e.lineTo(5 * t, -16 * t);
    e.stroke();

    // Pontas de metal
    e.fillStyle = "#94a3b8";
    e.beginPath();
    e.moveTo(-2 * t, -18 * t); e.lineTo(-3.5 * t, -15 * t); e.lineTo(-0.5 * t, -15 * t);
    e.closePath();
    e.fill();
    e.beginPath();
    e.moveTo(5 * t, -18 * t); e.lineTo(3.5 * t, -15 * t); e.lineTo(6.5 * t, -15 * t);
    e.closePath();
    e.fill();

    e.restore();
  }

  function drawPedregulhos(e, t = 1, subType = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Pilha de pedregulhos e cascalho da escavação
    const colors = ["#475569", "#334155", "#64748b", "#1e293b"];
    const col0 = colors[subType % 4];
    const col1 = colors[(subType + 1) % 4];

    // Sombra das pedras
    e.fillStyle = "rgba(2, 6, 23, 0.4)";
    e.beginPath();
    e.ellipse(0, 3 * t, 12 * t, 6 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Pedra maior
    e.fillStyle = col0;
    e.beginPath();
    e.moveTo(-6 * t, 2 * t);
    e.lineTo(-3 * t, -5 * t);
    e.lineTo(3 * t, -4 * t);
    e.lineTo(5 * t, 3 * t);
    e.lineTo(-1 * t, 5 * t);
    e.closePath();
    e.fill();
    e.strokeStyle = "#0f172a";
    e.lineWidth = 0.9 * t;
    e.stroke();

    // Pedra média
    e.fillStyle = col1;
    e.beginPath();
    e.moveTo(3 * t, 0);
    e.lineTo(8 * t, -3 * t);
    e.lineTo(9 * t, 3 * t);
    e.lineTo(5 * t, 4 * t);
    e.closePath();
    e.fill();
    e.stroke();

    // Pedregulhos menores espalhados
    e.fillStyle = "#64748b";
    e.fillRect(-8 * t, -1 * t, 2.5 * t, 2 * t);
    e.fillRect(-2 * t, 4 * t, 2 * t, 1.8 * t);
    e.fillRect(6 * t, -4 * t, 1.8 * t, 1.5 * t);

    e.restore();
  }

  function drawBonePile(e, t = 1, subType = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();

    // 1. Sombra macabra projetada no piso da caverna
    e.fillStyle = "rgba(2, 6, 23, 0.55)";
    e.beginPath();
    e.ellipse(0, 4 * t, 15 * t, 8 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2. Base de terra escura, pó de osso e fragmentos
    e.fillStyle = "rgba(15, 23, 42, 0.7)";
    e.beginPath();
    e.ellipse(0, 2 * t, 13 * t, 6.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 3. Fêmures e ossos compridos cruzados na base
    e.strokeStyle = "#94a3b8";
    e.fillStyle = "#cbd5e1";
    e.lineWidth = 2 * t;
    e.lineCap = "round";

    // Fêmur cruzado diagonal esquerda
    e.beginPath();
    e.moveTo(-11 * t, 3 * t);
    e.lineTo(10 * t, -3 * t);
    e.stroke();
    e.beginPath();
    e.arc(-11 * t, 3 * t, 1.8 * t, 0, Math.PI * 2);
    e.arc(10 * t, -3 * t, 1.8 * t, 0, Math.PI * 2);
    e.fill();

    // Fêmur cruzado diagonal direita
    e.beginPath();
    e.moveTo(-9 * t, -3 * t);
    e.lineTo(11 * t, 3 * t);
    e.stroke();
    e.beginPath();
    e.arc(-9 * t, -3 * t, 1.8 * t, 0, Math.PI * 2);
    e.arc(11 * t, 3 * t, 1.8 * t, 0, Math.PI * 2);
    e.fill();

    // 4. Caixa torácica / costelas curvadas abraçando a pilha
    e.strokeStyle = "#cbd5e1";
    e.lineWidth = 1.3 * t;
    for (let r = -2; r <= 2; r++) {
      const rx = r * 3.5 * t;
      const ry = (2 - Math.abs(r)) * 1.5 * t;
      e.beginPath();
      e.arc(rx - 2 * t, ry + 2 * t, 3.5 * t, Math.PI * 0.2, Math.PI * 0.9);
      e.stroke();
      e.beginPath();
      e.arc(rx + 2 * t, ry + 2 * t, 3.5 * t, Math.PI * 0.1, Math.PI * 0.8, !0);
      e.stroke();
    }

    // 5. Camada intermediária de crânios envelhecidos
    const skulls = [
      { x: -6 * t, y: 1 * t, r: 2.8 * t, a: -0.2 },
      { x: 5 * t, y: 1.5 * t, r: 2.8 * t, a: 0.25 },
      { x: -2.5 * t, y: -2 * t, r: 3.2 * t, a: -0.1 },
      { x: 3 * t, y: -2.5 * t, r: 3 * t, a: 0.15 },
    ];

    for (const s of skulls) {
      e.fillStyle = "#e2e8f0";
      e.strokeStyle = "#475569";
      e.lineWidth = 0.8 * t;
      e.beginPath();
      e.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      e.fill();
      e.stroke();

      // Cavidades oculares pretas
      e.fillStyle = "#090d16";
      e.beginPath();
      e.ellipse(s.x - s.r * 0.35, s.y - s.r * 0.1, s.r * 0.22, s.r * 0.3, s.a, 0, Math.PI * 2);
      e.ellipse(s.x + s.r * 0.35, s.y - s.r * 0.1, s.r * 0.22, s.r * 0.3, s.a, 0, Math.PI * 2);
      e.fill();
      // Cavidade nasal
      e.beginPath();
      e.moveTo(s.x, s.y + s.r * 0.2);
      e.lineTo(s.x - 0.6 * t, s.y + s.r * 0.45);
      e.lineTo(s.x + 0.6 * t, s.y + s.r * 0.45);
      e.closePath();
      e.fill();
    }

    // 6. Crânio Central / Superior no topo da pilha (destaque macabro)
    const topY = -7 * t;
    const topR = 4 * t;

    e.fillStyle = "#f8fafc";
    e.strokeStyle = "#334155";
    e.lineWidth = 1 * t;
    e.beginPath();
    e.arc(0, topY, topR, 0, Math.PI * 2);
    e.fill();
    e.stroke();

    // Mandíbula e dentes
    e.fillStyle = "#e2e8f0";
    e.fillRect(-2 * t, topY + topR * 0.6, 4 * t, 2.5 * t);
    e.strokeRect(-2 * t, topY + topR * 0.6, 4 * t, 2.5 * t);
    e.strokeStyle = "#475569";
    e.lineWidth = 0.7 * t;
    for (let d = -1.2; d <= 1.2; d += 0.8) {
      e.beginPath();
      e.moveTo(d * t, topY + topR * 0.6);
      e.lineTo(d * t, topY + topR * 0.6 + 2.5 * t);
      e.stroke();
    }

    // Olhos profundos com fulgor sutil
    e.fillStyle = "#090d16";
    e.beginPath();
    e.ellipse(-1.5 * t, topY - 0.5 * t, 1.1 * t, 1.4 * t, -0.1, 0, Math.PI * 2);
    e.ellipse(1.5 * t, topY - 0.5 * t, 1.1 * t, 1.4 * t, 0.1, 0, Math.PI * 2);
    e.fill();

    // Nariz
    e.beginPath();
    e.moveTo(0, topY + 0.8 * t);
    e.lineTo(-0.8 * t, topY + 2 * t);
    e.lineTo(0.8 * t, topY + 2 * t);
    e.closePath();
    e.fill();

    // Detalhes por subType:
    if (subType === 0) {
      // Chifres ancestrais de besta saindo do crânio do topo
      e.strokeStyle = "#78350f";
      e.lineWidth = 2.2 * t;
      e.beginPath();
      e.moveTo(-3 * t, topY - 2 * t);
      e.quadraticCurveTo(-9 * t, topY - 7 * t, -7 * t, topY - 11 * t);
      e.stroke();
      e.beginPath();
      e.moveTo(3 * t, topY - 2 * t);
      e.quadraticCurveTo(9 * t, topY - 7 * t, 7 * t, topY - 11 * t);
      e.stroke();
    } else if (subType === 1) {
      // Vários crânios menores rodeando o topo
      e.fillStyle = "#cbd5e1";
      e.beginPath();
      e.arc(-5.5 * t, topY + 2 * t, 2.5 * t, 0, Math.PI * 2);
      e.arc(5.5 * t, topY + 2 * t, 2.5 * t, 0, Math.PI * 2);
      e.fill();
    } else if (subType === 2) {
      // Espinha dorsal longa e vértebras
      e.strokeStyle = "#94a3b8";
      e.lineWidth = 1.6 * t;
      for (let v = 0; v < 6; v++) {
        e.beginPath();
        e.arc(-6 * t + v * 2.5 * t, 6 * t, 1.4 * t, 0, Math.PI * 2);
        e.stroke();
      }
    } else if (subType === 3) {
      // Vela com chaminha espectral azulada na pilha
      e.fillStyle = "#ca8a04";
      e.fillRect(-1 * t, topY - 6 * t, 2 * t, 5 * t);
      e.fillStyle = "rgba(56, 189, 248, 0.85)";
      e.beginPath();
      e.ellipse(0, topY - 7.5 * t, 1.2 * t, 2.2 * t, 0, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }

  function drawBookshelf(e, t = 1, subType = 0, isCollected = !1, booksTaken = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    booksTaken = typeof booksTaken === "number" ? booksTaken : (isCollected ? 4 : 0);
    const maxBooks = 4;
    const remainingBooks = isCollected ? 0 : Math.max(0, maxBooks - booksTaken);
    e.save();

    // 1. Sombra projetada no piso de mosaico
    e.fillStyle = "rgba(15, 23, 42, 0.45)";
    e.beginPath();
    e.ellipse(0, 5 * t, 15 * t, 4.5 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2. Estrutura de madeira nobre de cedro (fundo da estante)
    const w = 26 * t;
    const h = 32 * t;
    const x0 = -w / 2;
    const y0 = -h + 4 * t;

    // Fundo escuro do móvel
    e.fillStyle = "#3b1604";
    e.fillRect(x0 + 2 * t, y0 + 2 * t, w - 4 * t, h - 3 * t);

    // Laterais de madeira de cedro
    e.fillStyle = "#78350f";
    e.fillRect(x0, y0, 3 * t, h);
    e.fillRect(x0 + w - 3 * t, y0, 3 * t, h);

    // Detalhe entalhado nas laterais (caneluras clássicas)
    e.fillStyle = "#b45309";
    e.fillRect(x0 + 1 * t, y0 + 4 * t, 1 * t, h - 8 * t);
    e.fillRect(x0 + w - 2 * t, y0 + 4 * t, 1 * t, h - 8 * t);

    // Topo com cornija / frontão clássico esculpido
    e.fillStyle = "#92400e";
    e.fillRect(x0 - 1.5 * t, y0 - 3 * t, w + 3 * t, 4 * t);
    e.fillStyle = "#d97706";
    e.fillRect(x0 - 0.5 * t, y0 - 1.5 * t, w + 1 * t, 1.2 * t);

    // Base sólida reforçada
    e.fillStyle = "#5c2509";
    e.fillRect(x0 - 1 * t, y0 + h - 2 * t, w + 2 * t, 4 * t);

    // 3 Prateleiras horizontais de apoio
    const shelvesY = [
      y0 + h * 0.32,
      y0 + h * 0.64,
      y0 + h - 2 * t,
    ];

    for (const sy of shelvesY) {
      e.fillStyle = "#92400e";
      e.fillRect(x0 + 2 * t, sy, w - 4 * t, 2.2 * t);
      e.fillStyle = "#b45309";
      e.fillRect(x0 + 2 * t, sy + 0.5 * t, w - 4 * t, 0.8 * t);
    }

    // 3. APENAS LIVROS COLETÁVEIS (Sem livros de decoração!)
    // Cada livro desenhado corresponde exatamente a 1 livro que pode ser recolhido.
    // Quando todos forem coletados (remainingBooks === 0), a estante fica limpa/vazia.
    if (remainingBooks > 0) {
      const bookColors = ["#991b1b", "#1e3a8a", "#14532d", "#78350f", "#581c87"];
      const accentColors = ["#fbbf24", "#fef08a", "#fde047", "#f8fafc"];

      // 1º Livro Coletável (se restante >= 1): Tomo na prateleira superior
      if (remainingBooks >= 1) {
        const b1X = x0 + 5 * t;
        const b1W = 4.2 * t;
        const b1H = 8.5 * t;
        const b1Y = shelvesY[0] - b1H;
        e.fillStyle = bookColors[subType % bookColors.length];
        e.fillRect(b1X, b1Y, b1W, b1H);
        e.fillStyle = accentColors[subType % accentColors.length];
        e.fillRect(b1X + 0.5 * t, b1Y + 1.5 * t, b1W - 1 * t, 0.9 * t);
        e.fillRect(b1X + 0.5 * t, b1Y + b1H - 2.2 * t, b1W - 1 * t, 0.9 * t);
      }

      // 2º Livro Coletável (se restante >= 2): Segundo tomo na prateleira superior
      if (remainingBooks >= 2) {
        const b2X = x0 + 10.5 * t;
        const b2W = 4 * t;
        const b2H = 7.8 * t;
        const b2Y = shelvesY[0] - b2H;
        e.fillStyle = bookColors[(subType + 1) % bookColors.length];
        e.fillRect(b2X, b2Y, b2W, b2H);
        e.fillStyle = accentColors[(subType + 1) % accentColors.length];
        e.fillRect(b2X + 0.5 * t, b2Y + 2 * t, b2W - 1 * t, 0.8 * t);
      }

      // 3º Livro Coletável (se restante >= 3): Tomo na prateleira do meio
      if (remainingBooks >= 3) {
        const b3X = x0 + 7 * t;
        const b3W = 4.5 * t;
        const b3H = 8 * t;
        const b3Y = shelvesY[1] - b3H;
        e.fillStyle = bookColors[(subType + 2) % bookColors.length];
        e.fillRect(b3X, b3Y, b3W, b3H);
        e.fillStyle = accentColors[(subType + 2) % accentColors.length];
        e.fillRect(b3X + 0.5 * t, b3Y + 1.8 * t, b3W - 1 * t, 1 * t);
        e.fillRect(b3X + 0.5 * t, b3Y + b3H - 2.5 * t, b3W - 1 * t, 1 * t);
      }

      // 4º Livro Coletável (se restante >= 4): Grande Compêndio na prateleira inferior
      if (remainingBooks >= 4) {
        const b4X = x0 + 8 * t;
        const b4W = 5.2 * t;
        const b4H = 9 * t;
        const b4Y = shelvesY[2] - b4H;
        e.fillStyle = bookColors[(subType + 3) % bookColors.length];
        e.fillRect(b4X, b4Y, b4W, b4H);
        e.fillStyle = accentColors[(subType + 3) % accentColors.length];
        e.fillRect(b4X + 0.6 * t, b4Y + 2 * t, b4W - 1.2 * t, 1.2 * t);
        e.fillRect(b4X + 0.6 * t, b4Y + 4.5 * t, b4W - 1.2 * t, 1 * t);
      }
    }

    e.strokeStyle = "#451a03";
    e.lineWidth = 1 * t;
    e.strokeRect(x0, y0, w, h);

    e.restore();
  }

  function drawScrollStand(e, t = 1, subType = 0, isCollected = !1, scrollsTaken = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    scrollsTaken = typeof scrollsTaken === "number" ? scrollsTaken : (isCollected ? 2 : 0);
    const maxScrolls = 2;
    const remainingScrolls = isCollected ? 0 : Math.max(0, maxScrolls - scrollsTaken);
    e.save();

    // 1. Sombra da mesa/escrivaninha
    e.fillStyle = "rgba(15, 23, 42, 0.42)";
    e.beginPath();
    e.ellipse(0, 5 * t, 14 * t, 6 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2. Mesa helênica de madeira polida (Trapeza de estudo)
    e.fillStyle = "#5c2509";
    e.fillRect(-10 * t, -2 * t, 2.5 * t, 7 * t);
    e.fillRect(8 * t, -2 * t, 2.5 * t, 7 * t);
    e.fillRect(-1 * t, -1 * t, 2.2 * t, 6 * t);

    // Tampo inclinado da escrivaninha de escriba
    e.fillStyle = "#854d0e";
    e.beginPath();
    e.moveTo(-12 * t, -1 * t);
    e.lineTo(-11 * t, -10 * t);
    e.lineTo(11 * t, -10 * t);
    e.lineTo(12 * t, -1 * t);
    e.closePath();
    e.fill();
    e.strokeStyle = "#713f12";
    e.lineWidth = 1 * t;
    e.stroke();

    // Friso de madeira no topo e na base do tampo
    e.fillStyle = "#a16207";
    e.fillRect(-12.5 * t, -1 * t, 25 * t, 2 * t);
    e.fillRect(-11.5 * t, -10.5 * t, 23 * t, 1.5 * t);

    // 3. APENAS PERGAMINHOS COLETÁVEIS (Sem pergaminhos de decoração!)
    // 1º Pergaminho Coletável: desenrolado sobre a escrivaninha (se restam 2)
    if (remainingScrolls >= 2) {
      e.fillStyle = "#fef3c7";
      e.fillRect(-8 * t, -8.5 * t, 14 * t, 7 * t);
      e.strokeStyle = "#d97706";
      e.lineWidth = 0.8 * t;
      e.strokeRect(-8 * t, -8.5 * t, 14 * t, 7 * t);

      e.fillStyle = "#78350f";
      e.fillRect(-8.8 * t, -9 * t, 1.2 * t, 8 * t);
      e.fillRect(5.6 * t, -9 * t, 1.2 * t, 8 * t);
      e.fillStyle = "#f59e0b";
      e.fillRect(-9 * t, -9.5 * t, 1.6 * t, 1 * t);
      e.fillRect(5.4 * t, -9.5 * t, 1.6 * t, 1 * t);
      e.fillRect(-9 * t, -1.2 * t, 1.6 * t, 1 * t);
      e.fillRect(5.4 * t, -1.2 * t, 1.6 * t, 1 * t);

      e.strokeStyle = "#78350f";
      e.lineWidth = 0.6 * t;
      for (let r = 0; r < 4; r++) {
        const lineY = (-7 + r * 1.5) * t;
        e.beginPath();
        e.moveTo(-6 * t, lineY);
        e.lineTo(4 * t, lineY);
        e.stroke();
      }
      if (subType === 0) {
        e.strokeStyle = "#92400e";
        e.beginPath();
        e.arc(1.5 * t, -4 * t, 1.8 * t, 0, Math.PI * 2);
        e.stroke();
      }
    }

    // 4. Capsa (cesta cilíndrica de bronze) ao lado da mesa
    const capsaX = 8 * t;
    const capsaY = 1 * t;

    e.fillStyle = "rgba(15, 23, 42, 0.35)";
    e.beginPath();
    e.ellipse(capsaX, capsaY + 3 * t, 4 * t, 2 * t, 0, 0, Math.PI * 2);
    e.fill();

    // 2º Pergaminho Coletável: rolo com fita vermelha na capsa (se resta pelo menos 1)
    if (remainingScrolls >= 1) {
      e.fillStyle = "#fef08a";
      e.fillRect(capsaX - 1 * t, capsaY - 8 * t, 2 * t, 7 * t);
      e.fillStyle = "#b91c1c";
      e.fillRect(capsaX - 1 * t, capsaY - 5 * t, 2 * t, 1 * t);
    }

    // Estrutura da cesta de bronze
    e.fillStyle = "#b45309";
    e.fillRect(capsaX - 3.5 * t, capsaY - 3 * t, 7 * t, 6.5 * t);
    e.fillStyle = "#d97706";
    e.fillRect(capsaX - 3.5 * t, capsaY - 3 * t, 7 * t, 1.2 * t);
    e.strokeStyle = "#78350f";
    e.lineWidth = 0.8 * t;
    e.strokeRect(capsaX - 3.5 * t, capsaY - 3 * t, 7 * t, 6.5 * t);

    // 5. Tinteiro de cerâmica escura com cálamo
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.arc(-9.5 * t, -8.5 * t, 1.5 * t, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#f8fafc";
    e.lineWidth = 0.8 * t;
    e.beginPath();
    e.moveTo(-9.5 * t, -8.5 * t);
    e.lineTo(-12 * t, -13 * t);
    e.stroke();

    e.restore();
  }

  // =========================================================================
  // VILA GLACIAL DOS PICOS GELADOS: DESENHO DE PISOS, CASAS, CHAMINÉS E MÓVEIS
  // =========================================================================

  // 1. Desenho do Piso: Paralelepípedos nas ruas/praça, tábuas e pedras nas casas
  function drawSnowCityFloor(g, l, o, u, t, animTimer) {
    const role = t.snowCityRole || "road";
    const roomName = t.snowCityRoom || "";
    const isChecker = (Math.abs(t.tx + t.ty) % 2) === 0;

    // A. RUAS DE PARALELEPÍPEDO (Cobblestone)
    if (role === "road") {
      // Base de argamassa escura entre as pedras
      g.fillStyle = "#1e293b";
      g.fillRect(l, o, u + 1, u + 1);

      // 4 fileiras de pedras retangulares de paralelepípedo
      const rows = 4;
      const rowH = u / rows;
      const stoneColors = ["#475569", "#3b4252", "#4c566a", "#334155", "#525d72"];

      for (let r = 0; r < rows; r++) {
        const ry = o + r * rowH;
        // Alterna o deslocamento horizontal das pedras nas fileiras ímpares (running bond)
        const offset = (r % 2 === 1) ? u * 0.25 : 0;
        const stoneW = u * 0.46;

        for (let col = -1; col < 3; col++) {
          const rx = l + offset + col * stoneW + 1;
          const rw = stoneW - 2;
          const rh = rowH - 1.5;

          // Seleciona cor pseudo-aleatória determinística por posição
          const colorIdx = Math.abs(t.tx * 7 + t.ty * 13 + r * 5 + col * 3) % stoneColors.length;
          g.fillStyle = stoneColors[colorIdx];
          g.fillRect(rx, ry + 0.5, rw, rh);

          // Chanfro de luz no topo e esquerda do paralelepípedo (relevo 3D)
          g.fillStyle = "rgba(226, 232, 240, 0.35)";
          g.fillRect(rx, ry + 0.5, rw, 1);
          g.fillRect(rx, ry + 0.5, 1, rh);

          // Sombra chanfrada na base e direita
          g.fillStyle = "rgba(15, 23, 42, 0.7)";
          g.fillRect(rx, ry + rh - 0.5, rw, 1);
          g.fillRect(rx + rw - 1, ry + 0.5, 1, rh);
        }
      }

      // Pequenas nesgas de neve acumulada nas frestas e cantos do calçamento
      const snowSeed = Math.abs(t.tx * 11 + t.ty * 17) % 5;
      if (snowSeed < 3) {
        g.fillStyle = "rgba(241, 245, 249, 0.65)";
        g.beginPath();
        if (snowSeed === 0) {
          g.arc(l + u * 0.2, o + u * 0.25, 2.2, 0, Math.PI * 2);
          g.arc(l + u * 0.75, o + u * 0.8, 1.8, 0, Math.PI * 2);
        } else if (snowSeed === 1) {
          g.arc(l + u * 0.82, o + u * 0.3, 2.5, 0, Math.PI * 2);
        } else {
          g.arc(l + u * 0.35, o + u * 0.72, 2.0, 0, Math.PI * 2);
        }
        g.fill();
      }
      return;
    }

    // B. PRAÇA CENTRAL DE PARALELEPÍPEDOS (Mosaico Ornamental)
    if (role === "plaza") {
      g.fillStyle = "#1e293b";
      g.fillRect(l, o, u + 1, u + 1);

      // Padrão de paralelepípedos em anéis decorativos com pedra azul-ardósia
      const plazaColors = isChecker
        ? ["#334155", "#475569", "#3b4252"]
        : ["#475569", "#525d72", "#334155"];

      const cols = 3;
      const colW = u / cols;
      const rows = 3;
      const rowH = u / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = l + c * colW + 1;
          const py = o + r * rowH + 1;
          const pw = colW - 2;
          const ph = rowH - 2;

          const pCol = plazaColors[(r + c) % plazaColors.length];
          g.fillStyle = pCol;
          g.fillRect(px, py, pw, ph);

          // Borda chanfrada
          g.fillStyle = "rgba(241, 245, 249, 0.4)";
          g.fillRect(px, py, pw, 1);
          g.fillRect(px, py, 1, ph);
          g.fillStyle = "rgba(15, 23, 42, 0.75)";
          g.fillRect(px, py + ph - 1, pw, 1);
          g.fillRect(px + pw - 1, py, 1, ph);
        }
      }

      // Detalhe central no piso da praça
      if (isChecker) {
        g.fillStyle = "rgba(245, 158, 11, 0.25)";
        g.fillRect(l + u * 0.35, o + u * 0.35, u * 0.3, u * 0.3);
      }

      // Neve nas juntas
      g.fillStyle = "rgba(241, 245, 249, 0.5)";
      g.fillRect(l + u * 0.05, o + u * 0.9, 3, 2);
      g.fillRect(l + u * 0.9, o + u * 0.1, 2.5, 2.5);
      return;
    }

    // C. PISO INTERIOR DAS CASAS
    if (role === "house_floor") {
      // Banheiro: Lajes polidas de ardósia cinza-azulada com tapete azul
      if (roomName.includes("Banheiro")) {
        g.fillStyle = isChecker ? "#334155" : "#1e293b";
        g.fillRect(l, o, u + 1, u + 1);

        g.strokeStyle = "rgba(15, 23, 42, 0.8)";
        g.lineWidth = 1;
        g.strokeRect(l + 0.5, o + 0.5, u * 0.5, u * 0.5);
        g.strokeRect(l + u * 0.5 + 0.5, o + 0.5, u * 0.5, u * 0.5);
        g.strokeRect(l + 0.5, o + u * 0.5 + 0.5, u * 0.5, u * 0.5);
        g.strokeRect(l + u * 0.5 + 0.5, o + u * 0.5 + 0.5, u * 0.5, u * 0.5);

        // Tapete azul no centro do banheiro
        if ((Math.abs(t.tx * 3 + t.ty) % 4) === 0) {
          g.fillStyle = "rgba(2, 132, 199, 0.35)";
          g.fillRect(l + 3, o + 3, u - 6, u - 6);
        }
        return;
      }

      // Quarto e Sala: Tábuas aconchegantes de pinheiro nórdico com verniz âmbar
      g.fillStyle = isChecker ? "#92400e" : "#78350f";
      g.fillRect(l, o, u + 1, u + 1);

      // Linhas das tábuas horizontais de madeira
      const planks = 4;
      const plankH = u / planks;
      g.strokeStyle = "rgba(69, 26, 3, 0.65)";
      g.lineWidth = 1;

      for (let p = 0; p < planks; p++) {
        const py = o + p * plankH;
        g.beginPath();
        g.moveTo(l, py);
        g.lineTo(l + u, py);
        g.stroke();

        // Cabeças de pregos e veios sutis
        g.fillStyle = "#451a03";
        g.fillRect(l + 3, py + plankH * 0.45, 1.2, 1.2);
        g.fillRect(l + u - 4, py + plankH * 0.45, 1.2, 1.2);
      }

      // Tapete felpudo decorativo no centro do quarto ou em frente à lareira da sala
      if ((Math.abs(t.tx + t.ty * 2) % 3) === 0) {
        g.fillStyle = "rgba(180, 83, 9, 0.32)";
        g.fillRect(l + 2, o + 2, u - 4, u - 4);
        g.strokeStyle = "#d97706";
        g.lineWidth = 0.8;
        g.strokeRect(l + 2.5, o + 2.5, u - 5, u - 5);
      }
      return;
    }

    // D. SOLEIRA DA PORTA
    if (role === "door") {
      g.fillStyle = "#475569";
      g.fillRect(l, o, u + 1, u + 1);
      g.fillStyle = "#64748b";
      g.fillRect(l + 2, o + 2, u - 4, u - 4);
      g.strokeStyle = "#334155";
      g.lineWidth = 1.2;
      g.strokeRect(l + 2, o + 2, u - 4, u - 4);
      return;
    }

    // E. PALANQUE DE MADEIRA DO PÁTIO DE EXECUÇÃO (GALLOWS PLATFORM)
    if (role === "gallows_platform") {
      g.fillStyle = "#451a03";
      g.fillRect(l, o, u + 1, u + 1);
      const planks = 4;
      const plankH = u / planks;
      for (let p = 0; p < planks; p++) {
        const py = o + p * plankH;
        g.fillStyle = (p + t.tx) % 2 === 0 ? "#5c2808" : "#4a1f05";
        g.fillRect(l + 0.5, py + 0.5, u - 1, plankH - 1);
      }
      g.strokeStyle = "#271206";
      g.lineWidth = 1.2;
      g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
      return;
    }

    // F. PISO FRIO DAS GRANDES CELAS COLETIVAS (CAMPO DE CONCENTRAÇÃO)
    if (role === "prison_floor") {
      g.fillStyle = isChecker ? "#1e293b" : "#172033";
      g.fillRect(l, o, u + 1, u + 1);
      g.strokeStyle = "rgba(2, 6, 23, 0.78)";
      g.lineWidth = 1.2;
      g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
      if ((Math.abs(t.tx * 7 + t.ty * 3) % 5) === 0) {
        g.fillStyle = "rgba(15, 23, 42, 0.55)";
        g.fillRect(l + 4, o + 5, u - 8, 2.5);
      }
      return;
    }

    // G. SOLO DE TERRA ESCAVADA (SEM NEVE) AO REDOR DA GRANDE MINA PROFUNDA DA PRISÃO
    if (role === "excavated_dirt") {
      const hVal = Math.abs(Math.sin(t.tx * 12.9898 + t.ty * 78.233)) % 1;
      g.fillStyle = isChecker ? "#5c3a21" : "#4a2e19";
      g.fillRect(l, o, u + 1.2, u + 1.2);

      // Manchas orgânicas de terra revolvida marrom-escura e ocre terroso (100% sem neve!)
      g.fillStyle = hVal > 0.5 ? "#6b4423" : "#3e2412";
      g.beginPath();
      g.ellipse(
        l + u * (0.3 + hVal * 0.4),
        o + u * (0.35 + (1 - hVal) * 0.3),
        u * 0.34,
        u * 0.24,
        hVal * Math.PI,
        0,
        Math.PI * 2
      );
      g.fill();

      // Torrões e grânulos de terra solta
      g.fillStyle = "#7c4d28";
      g.fillRect(l + 4 + hVal * 14, o + 5 + (1 - hVal) * 14, 3.5, 2.5);
      g.fillStyle = "#2e190b";
      g.fillRect(l + 18 - hVal * 10, o + 16 - hVal * 8, 3, 2.5);
      return;
    }

    // Fundo padrão
    g.fillStyle = "#334155";
    g.fillRect(l, o, u + 1, u + 1);
  }

  // 1b. Forca de Execução no Pátio do Quartel Militar (Cadafalso com Alçapão e Laços de Corda)
  function drawBarracksGallows(e, t = 1, animTimer = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    const s = t * 1.1;

    // Sombra projetada sobre o palanque
    e.fillStyle = "rgba(2, 6, 23, 0.65)";
    e.beginPath();
    e.ellipse(0, 8 * s, 26 * s, 11 * s, 0, 0, Math.PI * 2);
    e.fill();

    // Base elevada do cadafalso com alçapão duplo de ferro e madeira
    e.fillStyle = "#3e1f0d";
    e.fillRect(-22 * s, -4 * s, 44 * s, 14 * s);
    e.strokeStyle = "#1c0d06";
    e.lineWidth = 1.4 * s;
    e.strokeRect(-22 * s, -4 * s, 44 * s, 14 * s);

    // Alçapão central de execução (portinholas no piso com dobradiças de ferro)
    e.fillStyle = "#1e293b";
    e.fillRect(-13 * s, -2 * s, 26 * s, 9 * s);
    e.fillStyle = "#291509";
    e.fillRect(-11.5 * s, -1 * s, 11 * s, 7 * s);
    e.fillRect(0.5 * s, -1 * s, 11 * s, 7 * s);

    // Dois pilares verticais maciços de carvalho escuro
    e.fillStyle = "#451a03";
    e.fillRect(-19 * s, -42 * s, 4.5 * s, 46 * s);
    e.fillRect(14.5 * s, -42 * s, 4.5 * s, 46 * s);
    e.strokeStyle = "#271206";
    e.lineWidth = 1.1 * s;
    e.strokeRect(-19 * s, -42 * s, 4.5 * s, 46 * s);
    e.strokeRect(14.5 * s, -42 * s, 4.5 * s, 46 * s);

    // Mãos-francesas (escoras diagonais superiores)
    e.strokeStyle = "#5c2808";
    e.lineWidth = 3 * s;
    e.beginPath();
    e.moveTo(-16.5 * s, -31 * s);
    e.lineTo(-9 * s, -40 * s);
    e.moveTo(16.5 * s, -31 * s);
    e.lineTo(9 * s, -40 * s);
    e.stroke();

    // Viga mestra horizontal superior da Forca (com camada de neve no topo)
    e.fillStyle = "#5c2808";
    e.fillRect(-23 * s, -45 * s, 46 * s, 5 * s);
    e.strokeStyle = "#271206";
    e.lineWidth = 1.2 * s;
    e.strokeRect(-23 * s, -45 * s, 46 * s, 5 * s);

    // Neve acumulada sobre a viga da forca
    e.fillStyle = "#f8fafc";
    e.fillRect(-22.5 * s, -46.8 * s, 45 * s, 2.4 * s);

    // Alavanca de ferro do carrasco ao lado direito para abrir o alçapão
    e.strokeStyle = "#64748b";
    e.lineWidth = 1.8 * s;
    e.beginPath();
    e.moveTo(20 * s, 4 * s);
    e.lineTo(23 * s, -8 * s);
    e.stroke();
    e.fillStyle = "#dc2626";
    e.beginPath();
    e.arc(23 * s, -8.5 * s, 1.8 * s, 0, Math.PI * 2);
    e.fill();

    // Dois laços de corda de enforcamento balançando com o vento glacial
    const sway = Math.sin((animTimer || 0) * 2.2) * 1.6 * s;
    for (const rx of [-6.5 * s, 6.5 * s]) {
      e.strokeStyle = "#d97706";
      e.lineWidth = 1.5 * s;
      // Corda descendo da viga
      e.beginPath();
      e.moveTo(rx, -40 * s);
      e.quadraticCurveTo(rx + sway * 0.5, -31 * s, rx + sway, -24 * s);
      e.stroke();

      // Nó grosso de enforcado (13 voltas)
      e.fillStyle = "#b45309";
      e.fillRect(rx + sway - 1.4 * s, -25 * s, 2.8 * s, 3.5 * s);

      // Laço oval da forca
      e.strokeStyle = "#f59e0b";
      e.lineWidth = 1.6 * s;
      e.beginPath();
      e.ellipse(rx + sway, -18.5 * s, 3.2 * s, 4.2 * s, 0, 0, Math.PI * 2);
      e.stroke();
    }

    e.restore();
  }

  // 1c. Mesa de Comando e Estratégia dos Oficiais do Quartel
  function drawBarracksOfficerDesk(e, t = 1, subType = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra
    e.fillStyle = "rgba(2, 6, 23, 0.55)";
    e.fillRect(-16 * t, -7 * t, 32 * t, 18 * t);

    // Corpo da escrivaninha de carvalho nobre e detalhes dourados
    e.fillStyle = "#451a03";
    e.fillRect(-14 * t, -10 * t, 28 * t, 15 * t);
    e.fillStyle = "#78350f";
    e.fillRect(-13 * t, -9 * t, 26 * t, 12 * t);
    e.strokeStyle = "#b45309";
    e.lineWidth = 1.1 * t;
    e.strokeRect(-13 * t, -9 * t, 26 * t, 12 * t);

    // Mapa estratégico aberto no centro da mesa
    e.fillStyle = "#fef3c7";
    e.fillRect(-8 * t, -7 * t, 16 * t, 8 * t);
    e.strokeStyle = "#92400e";
    e.lineWidth = 0.8 * t;
    e.strokeRect(-8 * t, -7 * t, 16 * t, 8 * t);

    // Marcações vermelhas e azuis táticas no mapa
    e.fillStyle = "#dc2626";
    e.beginPath();
    e.arc(-3 * t, -3 * t, 1.4 * t, 0, Math.PI * 2);
    e.arc(3 * t, -4 * t, 1.4 * t, 0, Math.PI * 2);
    e.fill();

    // Candelabro dourado e tinteiro com pena
    e.fillStyle = "#fbbf24";
    e.beginPath();
    e.arc(-10.5 * t, -6 * t, 1.8 * t, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.arc(10 * t, -5 * t, 1.5 * t, 0, Math.PI * 2);
    e.fill();

    e.restore();
  }

  // 1d. Beliche Triplo Coletivo de Prisioneiros (Celas Grandes tipo Campo de Concentração)
  function drawPrisonBunkBed(e, t = 1) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();
    // Sombra no piso frio da grande cela
    e.fillStyle = "rgba(2, 6, 23, 0.6)";
    e.fillRect(-15 * t, -8 * t, 30 * t, 18 * t);

    // Estrutura de madeira bruta de 2/3 andares de beliche coletivo
    e.fillStyle = "#3e2723";
    e.fillRect(-13.5 * t, -14 * t, 27 * t, 20 * t);
    e.strokeStyle = "#1b0f0a";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-13.5 * t, -14 * t, 27 * t, 20 * t);

    // Colchões rústicos de estopa cinza-escura e palha nos andares do beliche
    e.fillStyle = "#475569";
    e.fillRect(-12 * t, -12.5 * t, 24 * t, 7 * t);
    e.fillStyle = "#334155";
    e.fillRect(-12 * t, -3 * t, 24 * t, 7 * t);

    // Travesseiros rústicos e palha saindo pelas bordas
    e.fillStyle = "#94a3b8";
    e.fillRect(-11 * t, -11.5 * t, 5 * t, 5 * t);
    e.fillRect(-11 * t, -2 * t, 5 * t, 5 * t);
    e.fillStyle = "#a16207";
    e.fillRect(6 * t, -11 * t, 4 * t, 2 * t);
    e.fillRect(5 * t, -1 * t, 5 * t, 2 * t);

    // Poste vertical nos 4 cantos do beliche
    e.fillStyle = "#271206";
    e.fillRect(-14 * t, -15 * t, 2.5 * t, 22 * t);
    e.fillRect(11.5 * t, -15 * t, 2.5 * t, 22 * t);

    e.restore();
  }

  // 1e. Grande Monte de Terra Escavada (SEM NEVE) ao lado da Entrada da Mina Profunda
  function drawExcavatedDirtMound(e, t = 1, subType = 0) {
    t = (typeof t === "number" && isFinite(t) && t > 0) ? t : 1;
    e.save();

    // Sombra suave na base do monte de terra
    e.fillStyle = "rgba(28, 15, 7, 0.55)";
    e.beginPath();
    e.ellipse(0, 14 * t, 68 * t, 36 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Camada de base espalhada de terra marrom-escura (sem neve!)
    const baseGrad = e.createRadialGradient(0, 4 * t, 8 * t, 0, 8 * t, 64 * t);
    baseGrad.addColorStop(0, "#6b4423");
    baseGrad.addColorStop(0.55, "#4a2e19");
    baseGrad.addColorStop(1, "#3b2211");
    e.fillStyle = baseGrad;
    e.beginPath();
    e.moveTo(-62 * t, 12 * t);
    e.quadraticCurveTo(-66 * t, -8 * t, -42 * t, -22 * t);
    e.quadraticCurveTo(-18 * t, -38 * t, 8 * t, -35 * t);
    e.quadraticCurveTo(38 * t, -32 * t, 56 * t, -12 * t);
    e.quadraticCurveTo(66 * t, 6 * t, 54 * t, 22 * t);
    e.quadraticCurveTo(22 * t, 34 * t, -16 * t, 32 * t);
    e.quadraticCurveTo(-50 * t, 30 * t, -62 * t, 12 * t);
    e.closePath();
    e.fill();

    // Corpo principal elevado do monte de terra (duna volumosa 2.5D de terra revolvida)
    const moundGrad = e.createLinearGradient(0, -44 * t, 0, 24 * t);
    moundGrad.addColorStop(0, "#85522b");
    moundGrad.addColorStop(0.45, "#6b4423");
    moundGrad.addColorStop(0.85, "#4a2e19");
    moundGrad.addColorStop(1, "#331d0e");
    e.fillStyle = moundGrad;
    e.beginPath();
    e.moveTo(-52 * t, 14 * t);
    e.quadraticCurveTo(-44 * t, -18 * t, -18 * t, -36 * t);
    e.quadraticCurveTo(2 * t, -46 * t, 22 * t, -32 * t);
    e.quadraticCurveTo(44 * t, -16 * t, 50 * t, 12 * t);
    e.quadraticCurveTo(24 * t, 26 * t, -4 * t, 26 * t);
    e.quadraticCurveTo(-34 * t, 26 * t, -52 * t, 14 * t);
    e.closePath();
    e.fill();

    // Segundo cume / encosta lateral de terra para dar volume natural de escavação
    if (subType === 0) {
      e.fillStyle = "#754724";
      e.beginPath();
      e.moveTo(-36 * t, 16 * t);
      e.quadraticCurveTo(-24 * t, -14 * t, 4 * t, -26 * t);
      e.quadraticCurveTo(28 * t, -14 * t, 38 * t, 14 * t);
      e.quadraticCurveTo(6 * t, 24 * t, -36 * t, 16 * t);
      e.closePath();
      e.fill();
    }

    // Cristas e sulcos de terra despejada (sem nenhuma neve!)
    e.strokeStyle = "rgba(42, 22, 9, 0.65)";
    e.lineWidth = 1.6 * t;
    e.beginPath();
    e.moveTo(-22 * t, -24 * t);
    e.quadraticCurveTo(-6 * t, -8 * t, -14 * t, 14 * t);
    e.moveTo(8 * t, -30 * t);
    e.quadraticCurveTo(18 * t, -10 * t, 24 * t, 12 * t);
    e.moveTo(-36 * t, -4 * t);
    e.quadraticCurveTo(-18 * t, 6 * t, -28 * t, 18 * t);
    e.stroke();

    // Torrões de terra seca e pedregulhos terrosos espalhados pela encosta do monte
    const clods = [
      { x: -28, y: 6, rx: 5.5, ry: 3.5, col: "#3e2412" },
      { x: -12, y: -14, rx: 4.5, ry: 2.8, col: "#925b30" },
      { x: 6, y: -20, rx: 5.0, ry: 3.2, col: "#925b30" },
      { x: 18, y: -4, rx: 6.0, ry: 3.6, col: "#3e2412" },
      { x: -6, y: 10, rx: 6.5, ry: 3.8, col: "#523218" },
      { x: 28, y: 8, rx: 5.2, ry: 3.2, col: "#4a2e19" },
      { x: -38, y: 12, rx: 4.8, ry: 3.0, col: "#7c4d28" },
      { x: 12, y: 16, rx: 5.5, ry: 3.2, col: "#3e2412" },
    ];
    for (let i = 0; i < clods.length; i++) {
      const c = clods[i];
      e.fillStyle = c.col;
      e.beginPath();
      e.ellipse(c.x * t, c.y * t, c.rx * t, c.ry * t, (i * 0.5) % Math.PI, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }

  // 2. Parede 2.5D de Pedra da Montanha com Vigas de Madeira e Telhado Nevado
  function drawSnowCityWall(e, t, subType = 0, neighbors = null) {
    const nL = !!(neighbors && neighbors.left);
    const nR = !!(neighbors && neighbors.right);
    const nB = !!(neighbors && neighbors.bottom);

    // [PERF] Cacheia os 8 estados possíveis de parede 2.5D em offscreen canvas (transforma ~15 comandos vetoriais/gradientes por parede em 1 drawImage!)
    if (!drawSnowCityWall._cache) {
      drawSnowCityWall._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nB ? 4 : 0);
    const key = `${t.toFixed(3)}_${mask}`;
    let cached = drawSnowCityWall._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(24 * t);
      const padTop = Math.ceil(16 * t);
      const padBot = Math.ceil(30 * t);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * t;
        const leftX = nL ? -half - 1 * t : -half + 1 * t;
        const rightX = nR ? half + 1 * t : half - 1 * t;
        const w = rightX - leftX;
        const wallH = 26 * t;
        const baseY = 18 * t;
        const topFrontY = baseY - wallH;

        // Sombra projetada no piso ao sul
        if (!nB) {
          wc.fillStyle = "rgba(15, 23, 42, 0.65)";
          wc.fillRect(leftX - 1 * t, baseY - 2 * t, w + 2 * t, 9 * t);
        }

        // Face frontal da parede: Blocos de pedra de cantaria cinza ardósia
        const wallGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
        wallGrad.addColorStop(0, "#475569");
        wallGrad.addColorStop(0.5, "#334155");
        wallGrad.addColorStop(1, "#1e293b");
        wc.fillStyle = wallGrad;
        wc.fillRect(leftX, topFrontY, w, wallH);

        // Linhas de assentamento de cantaria
        wc.strokeStyle = "rgba(15, 23, 42, 0.75)";
        wc.lineWidth = 1.2 * t;
        wc.beginPath();
        wc.moveTo(leftX, topFrontY + 8 * t);
        wc.lineTo(rightX, topFrontY + 8 * t);
        wc.moveTo(leftX, topFrontY + 17 * t);
        wc.lineTo(rightX, topFrontY + 17 * t);
        // Juntas verticais
        wc.moveTo(leftX + w * 0.45, topFrontY);
        wc.lineTo(leftX + w * 0.45, topFrontY + 8 * t);
        wc.moveTo(leftX + w * 0.75, topFrontY + 8 * t);
        wc.lineTo(leftX + w * 0.75, topFrontY + 17 * t);
        wc.moveTo(leftX + w * 0.25, topFrontY + 8 * t);
        wc.lineTo(leftX + w * 0.25, topFrontY + 17 * t);
        wc.moveTo(leftX + w * 0.55, topFrontY + 17 * t);
        wc.lineTo(leftX + w * 0.55, baseY);
        wc.stroke();

        // Vigas verticais e horizontais de carvalho nórdico (enxaimel alpino)
        wc.fillStyle = "#78350f";
        wc.fillRect(leftX, topFrontY, 2.5 * t, wallH);
        wc.fillRect(rightX - 2.5 * t, topFrontY, 2.5 * t, wallH);
        wc.fillRect(leftX, baseY - 3.5 * t, w, 3.5 * t);

        // Beiral superior do telhado: Tábuas de pinheiro
        wc.fillStyle = "#451a03";
        wc.fillRect(leftX - 1.5 * t, topFrontY - 2 * t, w + 3 * t, 3.5 * t);

        // Camada espessa de NEVE BRANCA acumulada no topo da parede
        wc.fillStyle = "#f8fafc";
        wc.beginPath();
        wc.moveTo(leftX - 2 * t, topFrontY - 2 * t);
        wc.lineTo(rightX + 2 * t, topFrontY - 2 * t);
        wc.lineTo(rightX + 2 * t, topFrontY + 2.5 * t);
        wc.quadraticCurveTo(leftX + w * 0.5, topFrontY + 4 * t, leftX - 2 * t, topFrontY + 2.5 * t);
        wc.closePath();
        wc.fill();

        // Sombra suave sob a neve
        wc.strokeStyle = "rgba(203, 213, 225, 0.85)";
        wc.lineWidth = 1 * t;
        wc.stroke();
      }

      cached = { canvas: can, padX, padTop };
      drawSnowCityWall._cache.set(key, cached);
    }

    e.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  // 3. Porta da Casa / Quartel: Carvalho com Ferragens e Batente de Pedra (Abre e Fecha, Horizontal ou Vertical)
  function drawSnowCityDoor(e, t, opened = false, isVertical = false) {
    e.save();
    const baseY = 18 * t;
    const doorH = 25 * t;
    const topY = baseY - doorH;

    if (isVertical) {
      // Porta em parede vertical (Leste/Oeste — usada nas Alas de Oficiais e Descanso do Quartel)
      e.fillStyle = "#334155";
      e.fillRect(-5 * t, topY - 4 * t, 10 * t, doorH + 6 * t);
      e.strokeStyle = "#1e293b";
      e.lineWidth = 1.2 * t;
      e.strokeRect(-5 * t, topY - 4 * t, 10 * t, doorH + 6 * t);

      // Neve no topo do batente
      e.fillStyle = "#f8fafc";
      e.fillRect(-6 * t, topY - 5.5 * t, 12 * t, 3 * t);

      if (opened) {
        // Vão de passagem aberto com folha da porta recolhida
        e.fillStyle = "rgba(245, 158, 11, 0.28)";
        e.fillRect(-4 * t, topY + 2 * t, 8 * t, doorH - 2 * t);
        e.fillStyle = "#78350f";
        e.fillRect(-3.5 * t, topY - 2 * t, 12 * t, 6 * t);
        e.strokeStyle = "#451a03";
        e.strokeRect(-3.5 * t, topY - 2 * t, 12 * t, 6 * t);
      } else {
        // Folha de carvalho fechada na vertical
        e.fillStyle = "#78350f";
        e.fillRect(-3.5 * t, topY, 7 * t, doorH + 1 * t);
        e.strokeStyle = "#451a03";
        e.lineWidth = 1 * t;
        e.strokeRect(-3.5 * t, topY, 7 * t, doorH + 1 * t);
        // Ferragens de ferro preto
        e.fillStyle = "#0f172a";
        e.fillRect(-4 * t, topY + 5 * t, 8 * t, 2.2 * t);
        e.fillRect(-4 * t, baseY - 6 * t, 8 * t, 2.2 * t);
        e.fillStyle = "#fbbf24";
        e.beginPath();
        e.arc(0, baseY - 10 * t, 1.6 * t, 0, Math.PI * 2);
        e.fill();
      }
      e.restore();
      return;
    }

    // Batente de cantaria de pedra cinza
    e.fillStyle = "#334155";
    e.fillRect(-12 * t, topY, 24 * t, doorH);
    e.strokeStyle = "#1e293b";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-12 * t, topY, 24 * t, doorH);

    // Neve no topo do lintel de pedra
    e.fillStyle = "#f8fafc";
    e.fillRect(-13 * t, topY - 2 * t, 26 * t, 3 * t);

    if (opened) {
      // Interior visível escuro/acolhedor com luz âmbar da lareira
      e.fillStyle = "#1e1b4b";
      e.fillRect(-9 * t, topY + 2 * t, 18 * t, doorH - 2 * t);
      e.fillStyle = "rgba(245, 158, 11, 0.4)";
      e.fillRect(-8 * t, topY + 4 * t, 16 * t, doorH - 6 * t);

      // Folha da porta aberta em perspectiva lateral
      e.fillStyle = "#78350f";
      e.beginPath();
      e.moveTo(7 * t, topY + 2 * t);
      e.lineTo(13 * t, topY - 2 * t);
      e.lineTo(13 * t, baseY - 4 * t);
      e.lineTo(7 * t, baseY);
      e.closePath();
      e.fill();
    } else {
      // Porta fechada de carvalho maciço
      const woodGrad = e.createLinearGradient(0, topY, 0, baseY);
      woodGrad.addColorStop(0, "#92400e");
      woodGrad.addColorStop(1, "#78350f");
      e.fillStyle = woodGrad;
      e.fillRect(-9 * t, topY + 2 * t, 18 * t, doorH - 2 * t);

      // Tábuas verticais
      e.strokeStyle = "#451a03";
      e.lineWidth = 1 * t;
      e.beginPath();
      e.moveTo(-3 * t, topY + 2 * t);
      e.lineTo(-3 * t, baseY);
      e.moveTo(3 * t, topY + 2 * t);
      e.lineTo(3 * t, baseY);
      e.stroke();

      // Dobradiças de ferro preto
      e.fillStyle = "#0f172a";
      e.fillRect(-8.5 * t, topY + 6 * t, 15 * t, 2.2 * t);
      e.fillRect(-8.5 * t, baseY - 8 * t, 15 * t, 2.2 * t);

      // Maçaneta de latão dourado
      e.fillStyle = "#fbbf24";
      e.beginPath();
      e.arc(5 * t, baseY - 12 * t, 1.8 * t, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = "#b45309";
      e.lineWidth = 0.8 * t;
      e.stroke();
    }

    e.restore();
  }

  // 4. Chaminé de Pedra em TODAS as Casas com Fumaça Viva Animada
  function drawSnowCityChimney(e, t, animTimer = 0) {
    e.save();
    const half = 18 * t;
    const baseY = 18 * t;
    const chimneyH = 32 * t;
    const topY = baseY - chimneyH;
    const chimW = 16 * t;
    const leftX = -chimW * 0.5;

    // Sombra na base
    e.fillStyle = "rgba(15, 23, 42, 0.65)";
    e.fillRect(leftX - 1 * t, baseY - 2 * t, chimW + 2 * t, 8 * t);

    // Corpo da chaminé: pedras de cantaria da montanha
    const chimGrad = e.createLinearGradient(0, topY, 0, baseY);
    chimGrad.addColorStop(0, "#475569");
    chimGrad.addColorStop(0.5, "#334155");
    chimGrad.addColorStop(1, "#1e293b");
    e.fillStyle = chimGrad;
    e.fillRect(leftX, topY, chimW, chimneyH);

    // Juntas de argamassa da cantaria
    e.strokeStyle = "rgba(15, 23, 42, 0.75)";
    e.lineWidth = 1 * t;
    e.strokeRect(leftX, topY, chimW, chimneyH);
    e.beginPath();
    for (let yOff = 8; yOff < 30; yOff += 7) {
      e.moveTo(leftX, topY + yOff * t);
      e.lineTo(leftX + chimW, topY + yOff * t);
    }
    e.stroke();

    // Chapéu/coroamento da chaminé
    e.fillStyle = "#1e293b";
    e.fillRect(leftX - 2 * t, topY - 3 * t, chimW + 4 * t, 4 * t);

    // Camada de neve no chapéu da chaminé
    e.fillStyle = "#f8fafc";
    e.fillRect(leftX - 2.5 * t, topY - 4.5 * t, chimW + 5 * t, 2.5 * t);

    // Abertura escura da saída de fumaça com brilho de brasa avermelhado
    e.fillStyle = "#0f172a";
    e.fillRect(leftX + 2 * t, topY - 1 * t, chimW - 4 * t, 2.5 * t);
    e.fillStyle = "rgba(234, 88, 12, 0.65)";
    e.fillRect(leftX + 4 * t, topY, chimW - 8 * t, 1.5 * t);

    // =====================================================================
    // FUMAÇA VIVA E ANIMADA SUBINDO AO AR FRIO DOS PICOS GELADOS
    // =====================================================================
    const puffCount = 5;
    for (let i = 0; i < puffCount; i++) {
      // Ciclo temporal de cada baforada
      const puffTime = ((animTimer * 1.5 + i * 0.75) % 3.5);
      const prog = puffTime / 3.5; // 0 (saindo) até 1 (dissipando no ar)

      // Sobe verticalmente de topY até bem acima da chaminé
      const puffY = topY - 2 * t - prog * 44 * t;
      // Oscila suavemente ao vento lateral para a direita
      const puffX = Math.sin(animTimer * 2 + i * 1.3) * (3 * t) + prog * 16 * t;
      // Expande conforme sobe
      const puffRadius = (3.5 + prog * 8.5) * t;
      // Desvanece a opacidade
      const puffAlpha = Math.max(0, (1 - prog) * 0.58);

      e.fillStyle = `rgba(226, 232, 240, ${puffAlpha})`;
      e.beginPath();
      e.arc(puffX, puffY, puffRadius, 0, Math.PI * 2);
      e.fill();

      // Núcleo um pouco mais denso
      e.fillStyle = `rgba(241, 245, 249, ${puffAlpha * 0.75})`;
      e.beginPath();
      e.arc(puffX - 1 * t, puffY + 1 * t, puffRadius * 0.55, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }

  // 5. Lareira de Pedra da Montanha com Chamas Dançantes e Lenha Crepitante
  function drawSnowCityFireplace(e, t, animTimer = 0) {
    e.save();
    const half = 18 * t;
    const baseY = 18 * t;
    const fireW = 24 * t;
    const fireH = 24 * t;
    const leftX = -fireW * 0.5;
    const topY = baseY - fireH;

    // Estrutura externa de pedra da lareira
    e.fillStyle = "#334155";
    e.fillRect(leftX, topY, fireW, fireH);
    e.strokeStyle = "#1e293b";
    e.lineWidth = 1.2 * t;
    e.strokeRect(leftX, topY, fireW, fireH);

    // Moldura de cantaria no topo (prateleira da lareira)
    e.fillStyle = "#475569";
    e.fillRect(leftX - 2 * t, topY - 2 * t, fireW + 4 * t, 3.5 * t);
    e.fillStyle = "#78350f";
    e.fillRect(leftX - 2 * t, topY - 3.5 * t, fireW + 4 * t, 1.5 * t);

    // Nicho arqueado escuro do fogo
    e.fillStyle = "#0f172a";
    e.beginPath();
    e.moveTo(-8 * t, baseY);
    e.lineTo(-8 * t, topY + 7 * t);
    e.quadraticCurveTo(0, topY + 3 * t, 8 * t, topY + 7 * t);
    e.lineTo(8 * t, baseY);
    e.closePath();
    e.fill();

    // Troncos de lenha cruzados
    e.fillStyle = "#78350f";
    e.save();
    e.translate(0, baseY - 3 * t);
    e.rotate(-0.15);
    e.fillRect(-7 * t, -2 * t, 14 * t, 3.5 * t);
    e.rotate(0.3);
    e.fillStyle = "#92400e";
    e.fillRect(-6 * t, -2 * t, 12 * t, 3 * t);
    e.restore();

    // Brasa incandescente na base
    e.fillStyle = "#ea580c";
    e.fillRect(-6 * t, baseY - 5 * t, 12 * t, 3 * t);

    // CHAMAS DANÇANTES VIVAS (Animadas)
    const f1 = Math.sin(animTimer * 12) * 2 * t;
    const f2 = Math.cos(animTimer * 16) * 2.5 * t;

    // Labareda vermelha externa
    e.fillStyle = "rgba(239, 68, 68, 0.88)";
    e.beginPath();
    e.moveTo(-6 * t, baseY - 3 * t);
    e.quadraticCurveTo(-4 * t + f1, baseY - 12 * t, 0, baseY - 16 * t + f2);
    e.quadraticCurveTo(4 * t - f1, baseY - 12 * t, 6 * t, baseY - 3 * t);
    e.closePath();
    e.fill();

    // Labareda alaranjada média
    e.fillStyle = "rgba(245, 158, 11, 0.95)";
    e.beginPath();
    e.moveTo(-4 * t, baseY - 3 * t);
    e.quadraticCurveTo(-2 * t + f2, baseY - 10 * t, 0, baseY - 13 * t + f1);
    e.quadraticCurveTo(2 * t - f2, baseY - 10 * t, 4 * t, baseY - 3 * t);
    e.closePath();
    e.fill();

    // Núcleo amarelo vibrante
    e.fillStyle = "#fef08a";
    e.beginPath();
    e.moveTo(-2.5 * t, baseY - 3 * t);
    e.lineTo(0, baseY - 8 * t + f1);
    e.lineTo(2.5 * t, baseY - 3 * t);
    e.closePath();
    e.fill();

    // Grade protetora de ferro forjado na frente da lareira
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1 * t;
    e.beginPath();
    for (let gx = -7; gx <= 7; gx += 3.5) {
      e.moveTo(gx * t, baseY - 5 * t);
      e.lineTo(gx * t, baseY);
    }
    e.moveTo(-7 * t, baseY - 4.5 * t);
    e.lineTo(7 * t, baseY - 4.5 * t);
    e.stroke();

    e.restore();
  }

  // 6. Fogão a Lenha e Forno com Vapor Animado na Cozinha
  function drawSnowCityStove(e, t, animTimer = 0) {
    e.save();
    const baseY = 18 * t;
    const stoveH = 20 * t;
    const stoveW = 20 * t;
    const topY = baseY - stoveH;

    // Corpo de ferro fundido escuro do fogão
    e.fillStyle = "#1e293b";
    e.fillRect(-10 * t, topY, stoveW, stoveH);
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-10 * t, topY, stoveW, stoveH);

    // Chapa superior de ferro com bocas circulares
    e.fillStyle = "#334155";
    e.fillRect(-11 * t, topY - 2 * t, 22 * t, 3.5 * t);
    e.fillStyle = "#0f172a";
    e.beginPath();
    e.arc(-5 * t, topY, 2.5 * t, 0, Math.PI * 2);
    e.arc(5 * t, topY, 2.5 * t, 0, Math.PI * 2);
    e.fill();

    // Panela de cobre com ensopado e vapor
    e.fillStyle = "#b45309";
    e.fillRect(-8 * t, topY - 7 * t, 6 * t, 5 * t);
    e.fillStyle = "#d97706";
    e.fillRect(-9 * t, topY - 8 * t, 8 * t, 1.5 * t);

    // Chaleira com bico
    e.fillStyle = "#475569";
    e.beginPath();
    e.arc(5 * t, topY - 4 * t, 3.5 * t, 0, Math.PI * 2);
    e.fill();

    // Baforadas de vapor suave da panela
    const steam1 = Math.sin(animTimer * 5) * 2 * t;
    const steamProg = (animTimer * 2) % 2;
    e.fillStyle = "rgba(241, 245, 249, 0.6)";
    e.beginPath();
    e.arc(-5 * t + steam1, topY - 11 * t - steamProg * 6 * t, 2 * t + steamProg * 1.5 * t, 0, Math.PI * 2);
    e.fill();

    // Porta do forno de ferro com puxador
    e.fillStyle = "#0f172a";
    e.fillRect(-7 * t, topY + 7 * t, 14 * t, 10 * t);
    e.fillStyle = "#ea580c";
    e.fillRect(-5 * t, topY + 11 * t, 10 * t, 2 * t);
    e.fillStyle = "#94a3b8";
    e.fillRect(4 * t, topY + 11 * t, 1.5 * t, 4 * t);

    e.restore();
  }

  // 7. Tina / Banheira de Imersão Aquecida no Banheiro
  function drawSnowCityBathtub(e, t, animTimer = 0) {
    e.save();
    const baseY = 18 * t;
    const tubW = 26 * t;
    const tubH = 16 * t;
    const topY = baseY - tubH;

    // Corpo de madeira nobre com aros de ferro
    e.fillStyle = "#78350f";
    e.beginPath();
    e.ellipse(0, baseY - 8 * t, tubW * 0.5, tubH * 0.5, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#451a03";
    e.lineWidth = 1.2 * t;
    e.stroke();

    // Aros de ferro escuro
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1.5 * t;
    e.beginPath();
    e.ellipse(0, baseY - 6 * t, tubW * 0.48, tubH * 0.42, 0, 0, Math.PI * 2);
    e.stroke();

    // Água aquecida cristalina com ondulações sutis
    e.fillStyle = "#0284c7";
    e.beginPath();
    e.ellipse(0, baseY - 9 * t, tubW * 0.42, tubH * 0.36, 0, 0, Math.PI * 2);
    e.fill();

    // Brilho da água
    e.fillStyle = "rgba(186, 230, 253, 0.45)";
    e.beginPath();
    e.ellipse(-3 * t, baseY - 10 * t, tubW * 0.25, tubH * 0.18, -0.2, 0, Math.PI * 2);
    e.fill();

    // Vapor quente subindo suavemente
    const steamY = ((animTimer * 1.5) % 3);
    e.fillStyle = "rgba(241, 245, 249, 0.4)";
    e.beginPath();
    e.arc(Math.sin(animTimer * 3) * 3 * t, topY - steamY * 4 * t, 2.5 * t, 0, Math.PI * 2);
    e.fill();

    e.restore();
  }

  // 8. Cama Nórdica com Peles de Inverno no Quarto
  function drawSnowCityBed(e, t) {
    e.save();
    const baseY = 18 * t;
    const bedW = 24 * t;
    const bedH = 26 * t;
    const topY = baseY - bedH;

    // Estrutura de madeira de pinheiro escuro
    e.fillStyle = "#78350f";
    e.fillRect(-bedW * 0.5, topY, bedW, bedH);
    e.strokeStyle = "#451a03";
    e.lineWidth = 1.2 * t;
    e.strokeRect(-bedW * 0.5, topY, bedW, bedH);

    // Cabeceira da cama torneada
    e.fillStyle = "#92400e";
    e.fillRect(-bedW * 0.5 - 1 * t, topY - 3 * t, bedW + 2 * t, 4 * t);

    // Dois travesseiros macios brancos
    e.fillStyle = "#f8fafc";
    e.fillRect(-10 * t, topY + 2 * t, 9 * t, 5.5 * t);
    e.fillRect(1 * t, topY + 2 * t, 9 * t, 5.5 * t);
    e.strokeStyle = "#cbd5e1";
    e.lineWidth = 0.8 * t;
    e.strokeRect(-10 * t, topY + 2 * t, 9 * t, 5.5 * t);
    e.strokeRect(1 * t, topY + 2 * t, 9 * t, 5.5 * t);

    // Cobertor grosso vermelho xadrez nórdico
    e.fillStyle = "#991b1b";
    e.fillRect(-11 * t, topY + 8 * t, 22 * t, bedH - 9 * t);

    // Pelerine / faixa de pele de carneiro felpuda branca no pé da cama
    e.fillStyle = "#f1f5f9";
    e.fillRect(-11 * t, baseY - 8 * t, 22 * t, 6.5 * t);
    e.strokeStyle = "#e2e8f0";
    e.lineWidth = 0.8 * t;
    e.strokeRect(-11 * t, baseY - 8 * t, 22 * t, 6.5 * t);

    e.restore();
  }

  // 9. Móveis Decorativos e Utilitários das Casas
  function drawSnowCityFurniture(e, t, kind) {
    e.save();
    const baseY = 18 * t;

    switch (kind) {
      case "snow_city_sofa": {
        // Sofá / poltrona acolchoada na sala
        e.fillStyle = "#1e3a5f";
        e.fillRect(-11 * t, baseY - 16 * t, 22 * t, 15 * t);
        e.fillStyle = "#2563eb";
        e.fillRect(-9 * t, baseY - 13 * t, 18 * t, 10 * t);
        // Almofadas de lã
        e.fillStyle = "#fef08a";
        e.fillRect(-8 * t, baseY - 12 * t, 7 * t, 7 * t);
        e.fillRect(1 * t, baseY - 12 * t, 7 * t, 7 * t);
        break;
      }
      case "snow_city_table": {
        // Mesinha de centro redonda com caneca quente
        e.fillStyle = "#92400e";
        e.beginPath();
        e.ellipse(0, baseY - 6 * t, 9 * t, 5 * t, 0, 0, Math.PI * 2);
        e.fill();
        e.strokeStyle = "#78350f";
        e.lineWidth = 1 * t;
        e.stroke();
        // Caneca de chá
        e.fillStyle = "#f8fafc";
        e.fillRect(-2 * t, baseY - 10 * t, 3.5 * t, 4 * t);
        e.fillStyle = "#b45309";
        e.fillRect(-1.5 * t, baseY - 9 * t, 2.5 * t, 1.5 * t);
        break;
      }
      case "snow_city_nightstand": {
        // Criado-mudo com vela
        e.fillStyle = "#78350f";
        e.fillRect(-7 * t, baseY - 13 * t, 14 * t, 12 * t);
        e.strokeStyle = "#451a03";
        e.lineWidth = 1 * t;
        e.strokeRect(-7 * t, baseY - 13 * t, 14 * t, 12 * t);
        // Castiçal e chama de vela
        e.fillStyle = "#fbbf24";
        e.fillRect(-2 * t, baseY - 15 * t, 4 * t, 2 * t);
        e.fillStyle = "#f8fafc";
        e.fillRect(-1 * t, baseY - 18 * t, 2 * t, 3 * t);
        e.fillStyle = "#f59e0b";
        e.beginPath();
        e.arc(0, baseY - 20 * t, 1.5 * t, 0, Math.PI * 2);
        e.fill();
        break;
      }
      case "snow_city_wardrobe": {
        // Armário guarda-roupa de madeira de pinheiro
        e.fillStyle = "#78350f";
        e.fillRect(-10 * t, baseY - 24 * t, 20 * t, 23 * t);
        e.strokeStyle = "#451a03";
        e.lineWidth = 1.2 * t;
        e.strokeRect(-10 * t, baseY - 24 * t, 20 * t, 23 * t);
        // Divisão das duas portas
        e.beginPath();
        e.moveTo(0, baseY - 24 * t);
        e.lineTo(0, baseY - 1 * t);
        e.stroke();
        // Puxadores de latão
        e.fillStyle = "#fbbf24";
        e.fillRect(-2.5 * t, baseY - 12 * t, 1.5 * t, 2.5 * t);
        e.fillRect(1 * t, baseY - 12 * t, 1.5 * t, 2.5 * t);
        break;
      }
      case "snow_city_sink": {
        // Lavatório de pedra com espelho no banheiro
        e.fillStyle = "#475569";
        e.fillRect(-8 * t, baseY - 13 * t, 16 * t, 12 * t);
        e.fillStyle = "#cbd5e1";
        e.fillRect(-6 * t, baseY - 12 * t, 12 * t, 4 * t);
        // Espelho oval
        e.fillStyle = "#38bdf8";
        e.beginPath();
        e.ellipse(0, baseY - 18 * t, 5 * t, 6 * t, 0, 0, Math.PI * 2);
        e.fill();
        e.strokeStyle = "#94a3b8";
        e.lineWidth = 0.8 * t;
        e.stroke();
        break;
      }
      case "snow_city_toilet": {
        // Sanitário de madeira tratada
        e.fillStyle = "#78350f";
        e.fillRect(-6 * t, baseY - 14 * t, 12 * t, 13 * t);
        e.fillStyle = "#92400e";
        e.beginPath();
        e.ellipse(0, baseY - 8 * t, 5 * t, 4 * t, 0, 0, Math.PI * 2);
        e.fill();
        break;
      }
      case "snow_city_counter": {
        // Bancada de preparo de alimentos na cozinha
        e.fillStyle = "#78350f";
        e.fillRect(-10 * t, baseY - 15 * t, 20 * t, 14 * t);
        e.fillStyle = "#f8fafc";
        e.fillRect(-11 * t, baseY - 16 * t, 22 * t, 2.5 * t);
        // Tábua de corte e faca
        e.fillStyle = "#b45309";
        e.fillRect(-5 * t, baseY - 17.5 * t, 5 * t, 2 * t);
        e.fillStyle = "#94a3b8";
        e.fillRect(2 * t, baseY - 17.5 * t, 4 * t, 1 * t);
        break;
      }
      case "snow_city_pantry": {
        // Prateleiras de despensa com mantimentos
        e.fillStyle = "#78350f";
        e.fillRect(-9 * t, baseY - 22 * t, 18 * t, 21 * t);
        e.fillStyle = "#451a03";
        e.fillRect(-9 * t, baseY - 15 * t, 18 * t, 2 * t);
        e.fillRect(-9 * t, baseY - 8 * t, 18 * t, 2 * t);
        // Potes de cerâmica
        e.fillStyle = "#dc2626";
        e.fillRect(-7 * t, baseY - 14 * t, 3 * t, 4 * t);
        e.fillStyle = "#16a34a";
        e.fillRect(-2 * t, baseY - 14 * t, 3 * t, 4 * t);
        e.fillStyle = "#f59e0b";
        e.fillRect(3 * t, baseY - 14 * t, 3 * t, 4 * t);
        break;
      }
    }

    e.restore();
  }

  // 10. Monumento / Fogueira da Praça dos Picos Gelados (metade do tamanho colossal anterior, com colisor)
  function drawSnowCityMonument(e, t, animTimer = 0) {
    e.save();
    // Metade do tamanho anterior: raio de base ~18*s (cabe perfeitamente no tile central sem cobrir os bancos)
    const s = t * 0.65;
    const baseY = 6 * s;

    // Halo de calor alaranjado pulsante no chão de pedra ao redor da pira
    const pulse = (Math.sin(animTimer * 5) + 1) * 0.5;
    const glowGrad = e.createRadialGradient(0, 0, 5 * s, 0, 0, 36 * s);
    glowGrad.addColorStop(0, `rgba(251, 146, 60, ${0.42 + pulse * 0.12})`);
    glowGrad.addColorStop(0.55, `rgba(234, 88, 12, ${0.18 + pulse * 0.08})`);
    glowGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
    e.fillStyle = glowGrad;
    e.beginPath();
    e.ellipse(0, 2 * s, 36 * s, 28 * s, 0, 0, Math.PI * 2);
    e.fill();

    // Base escalonada circular de granito da montanha
    e.fillStyle = "#1e293b";
    e.beginPath();
    e.ellipse(0, baseY + 3 * s, 26 * s, 19 * s, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1.5 * s;
    e.stroke();

    // Segundo degrau de blocos de pedra
    e.fillStyle = "#334155";
    e.beginPath();
    e.ellipse(0, baseY, 22 * s, 15 * s, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = "#475569";
    e.lineWidth = 1.3 * s;
    e.stroke();

    // Anel de pedras brutas ao redor da fogueira
    const stoneCount = 10;
    for (let i = 0; i < stoneCount; i++) {
      const ang = (i / stoneCount) * Math.PI * 2;
      const rx = Math.cos(ang) * 18 * s;
      const ry = baseY - 1.5 * s + Math.sin(ang) * 11.5 * s;
      e.fillStyle = i % 2 === 0 ? "#475569" : "#334155";
      e.beginPath();
      e.ellipse(rx, ry, 5 * s, 3.8 * s, ang * 0.3, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = "#0f172a";
      e.lineWidth = 0.9 * s;
      e.stroke();
    }

    // Leito de brasas ardentes e carvão incandescente
    e.fillStyle = "#451a03";
    e.beginPath();
    e.ellipse(0, baseY - 2 * s, 15 * s, 9.5 * s, 0, 0, Math.PI * 2);
    e.fill();

    e.fillStyle = `rgba(234, 88, 12, ${0.82 + pulse * 0.18})`;
    e.beginPath();
    e.ellipse(0, baseY - 2.5 * s, 12.5 * s, 7.5 * s, 0, 0, Math.PI * 2);
    e.fill();

    // Toras de pinheiro empilhadas na fogueira
    const logs = [
      { ang: -0.35, len: 24, w: 4.2, col: "#451a03" },
      { ang: 0.35, len: 24, w: 4.2, col: "#78350f" },
      { ang: 1.15, len: 20, w: 3.8, col: "#5c2808" },
      { ang: -1.15, len: 20, w: 3.8, col: "#78350f" },
      { ang: 0.05, len: 21, w: 3.6, col: "#92400e" },
    ];
    for (const lg of logs) {
      e.save();
      e.translate(0, baseY - 4 * s);
      e.rotate(lg.ang);
      e.fillStyle = lg.col;
      e.fillRect((-lg.len * 0.5) * s, (-lg.w * 0.5) * s, lg.len * s, lg.w * s);
      e.strokeStyle = "#271206";
      e.lineWidth = 0.8 * s;
      e.strokeRect((-lg.len * 0.5) * s, (-lg.w * 0.5) * s, lg.len * s, lg.w * s);
      e.restore();
    }

    // Chamas da Fogueira da Praça
    const f1 = Math.sin(animTimer * 10) * 3.5 * s;
    const f2 = Math.cos(animTimer * 14) * 4 * s;
    const f3 = Math.sin(animTimer * 8 + 1.4) * 2.5 * s;

    e.save();
    e.shadowColor = "#ea580c";
    e.shadowBlur = 16;

    // Língua de fogo externa vermelha/laranja escura
    e.fillStyle = "rgba(220, 38, 38, 0.92)";
    e.beginPath();
    e.moveTo(-13 * s, baseY - 3 * s);
    e.quadraticCurveTo(-11 * s + f1, baseY - 19 * s, -4 * s + f3, baseY - 28 * s);
    e.quadraticCurveTo(0, baseY - 38 * s + f2, 4 * s - f3, baseY - 28 * s);
    e.quadraticCurveTo(11 * s - f1, baseY - 19 * s, 13 * s, baseY - 3 * s);
    e.closePath();
    e.fill();

    // Língua de fogo intermediária laranja-ouro
    e.fillStyle = "rgba(249, 115, 22, 0.96)";
    e.beginPath();
    e.moveTo(-9.5 * s, baseY - 3 * s);
    e.quadraticCurveTo(-6.5 * s + f2, baseY - 18 * s, f1 * 0.6, baseY - 31 * s + f1);
    e.quadraticCurveTo(6.5 * s - f2, baseY - 18 * s, 9.5 * s, baseY - 3 * s);
    e.closePath();
    e.fill();

    // Chama interna amarela brilhante
    e.fillStyle = "rgba(250, 204, 21, 0.98)";
    e.beginPath();
    e.moveTo(-6 * s, baseY - 3 * s);
    e.quadraticCurveTo(-3 * s - f3, baseY - 14 * s, f2 * 0.4, baseY - 22 * s + f2 * 0.5);
    e.quadraticCurveTo(3 * s + f3, baseY - 14 * s, 6 * s, baseY - 3 * s);
    e.closePath();
    e.fill();

    // Núcleo branco-amarelado incandescente
    e.fillStyle = "#fef9c3";
    e.beginPath();
    e.ellipse(0, baseY - 7 * s, 4 * s, 5.5 * s, 0, 0, Math.PI * 2);
    e.fill();
    e.restore();

    // Fagulhas subindo ao céu gelado
    for (let sp = 0; sp < 6; sp++) {
      const cyc = (animTimer * 2.4 + sp * 0.45) % 2.2;
      const prog = cyc / 2.2;
      const sx = Math.sin(animTimer * 4 + sp * 1.9) * (9 * s) * (1 - prog * 0.3);
      const sy = baseY - 10 * s - prog * 34 * s;
      const alpha = Math.max(0, 1 - prog);
      e.fillStyle = `rgba(254, 240, 138, ${alpha * 0.9})`;
      e.beginPath();
      e.arc(sx, sy, (1.5 - prog * 0.7) * s, 0, Math.PI * 2);
      e.fill();
    }

    e.restore();
  }

  // 10b. Bancos da Praça Central ao redor da Grande Fogueira
  function drawSnowCityBench(e, t, subType = 0, facing = "south") {
    e.save();
    const isVert = subType === 1 || facing === "east" || facing === "west";

    // Sombra projetada no chão de paralelepípedo
    e.fillStyle = "rgba(15, 23, 42, 0.55)";
    if (isVert) {
      e.fillRect(-7 * t, -15 * t, 14 * t, 30 * t);
    } else {
      e.fillRect(-16 * t, -6 * t, 32 * t, 14 * t);
    }

    if (isVert) {
      // Banco vertical (Leste / Oeste da fogueira)
      const backX = facing === "east" ? -5.5 * t : 2.5 * t;
      const seatX = facing === "east" ? -2.5 * t : -5.5 * t;

      // Pés de ferro forjado preto
      e.fillStyle = "#0f172a";
      e.fillRect(-6 * t, -14 * t, 12 * t, 2.5 * t);
      e.fillRect(-6 * t, 11.5 * t, 12 * t, 2.5 * t);

      // Assento de tábuas de carvalho aquecido
      e.fillStyle = "#92400e";
      e.fillRect(seatX, -13.5 * t, 8 * t, 27 * t);
      e.strokeStyle = "#451a03";
      e.lineWidth = 0.9 * t;
      e.strokeRect(seatX, -13.5 * t, 8 * t, 27 * t);

      // Divisão das ripas de madeira do assento
      e.beginPath();
      e.moveTo(seatX + 4 * t, -13.5 * t);
      e.lineTo(seatX + 4 * t, 13.5 * t);
      e.stroke();

      // Encosto de madeira reforçada com neve fina nas pontas
      e.fillStyle = "#78350f";
      e.fillRect(backX, -14 * t, 3.2 * t, 28 * t);
      e.strokeRect(backX, -14 * t, 3.2 * t, 28 * t);

      // Apoios de braço de ferro forjado
      e.fillStyle = "#1e293b";
      e.fillRect(-6 * t, -14 * t, 12 * t, 2 * t);
      e.fillRect(-6 * t, 12 * t, 12 * t, 2 * t);
    } else {
      // Banco horizontal (Norte / Sul da fogueira)
      const backY = facing === "north" ? 1 * t : -9 * t;
      const seatY = facing === "north" ? -5 * t : -4 * t;

      // Pés laterais de ferro forjado
      e.fillStyle = "#0f172a";
      e.fillRect(-14 * t, -5 * t, 3 * t, 11 * t);
      e.fillRect(11 * t, -5 * t, 3 * t, 11 * t);

      // Assento de tábuas de carvalho
      e.fillStyle = "#92400e";
      e.fillRect(-15 * t, seatY, 30 * t, 7.5 * t);
      e.strokeStyle = "#451a03";
      e.lineWidth = 0.9 * t;
      e.strokeRect(-15 * t, seatY, 30 * t, 7.5 * t);

      // Linhas das ripas horizontais
      e.beginPath();
      e.moveTo(-15 * t, seatY + 3.8 * t);
      e.lineTo(15 * t, seatY + 3.8 * t);
      e.stroke();

      // Encosto do banco
      e.fillStyle = "#78350f";
      e.fillRect(-15 * t, backY, 30 * t, 4.2 * t);
      e.strokeRect(-15 * t, backY, 30 * t, 4.2 * t);

      // Detalhe de neve acumulada nas pontas do encosto
      e.fillStyle = "#f8fafc";
      e.fillRect(-14.5 * t, backY, 5 * t, 1.6 * t);
      e.fillRect(9.5 * t, backY, 5 * t, 1.6 * t);
    }

    e.restore();
  }

  // 11. Poste de Lampião de Ferro Forjado nas Ruas de Paralelepípedo
  function drawSnowCityLamppost(e, t, animTimer = 0) {
    e.save();
    const baseY = 18 * t;

    // Pedestal de pedra
    e.fillStyle = "#334155";
    e.fillRect(-3 * t, baseY - 4 * t, 6 * t, 4 * t);

    // Haste de ferro preto
    e.fillStyle = "#0f172a";
    e.fillRect(-1.2 * t, baseY - 24 * t, 2.4 * t, 20 * t);

    // Braço curvado e lanterna
    e.fillRect(-4 * t, baseY - 25 * t, 8 * t, 2 * t);

    // Caixa de vidro com topo cônico coberto de neve
    e.fillStyle = "rgba(254, 240, 138, 0.85)";
    e.fillRect(-3.5 * t, baseY - 30 * t, 7 * t, 6 * t);
    e.strokeStyle = "#0f172a";
    e.lineWidth = 1 * t;
    e.strokeRect(-3.5 * t, baseY - 30 * t, 7 * t, 6 * t);

    // Topo de ferro com camada de neve
    e.fillStyle = "#0f172a";
    e.beginPath();
    e.moveTo(-4.5 * t, baseY - 30 * t);
    e.lineTo(0, baseY - 34 * t);
    e.lineTo(4.5 * t, baseY - 30 * t);
    e.closePath();
    e.fill();
    e.fillStyle = "#f8fafc";
    e.beginPath();
    e.moveTo(-5 * t, baseY - 30 * t);
    e.lineTo(0, baseY - 35 * t);
    e.lineTo(5 * t, baseY - 30 * t);
    e.closePath();
    e.fill();

    // Chama dançante no interior
    const flameFlicker = Math.sin(animTimer * 15) * 0.8 * t;
    e.fillStyle = "#f59e0b";
    e.beginPath();
    e.arc(flameFlicker, baseY - 27 * t, 1.8 * t, 0, Math.PI * 2);
    e.fill();

    e.restore();
  }

  // 12. Telhados Alpinos Inclinados (Típicos de Neve) para cada Casa da Vila Glacial:
  // - Cada casa tem o seu próprio telhado individual de duas águas íngremes (chalé alpino).
  // - Possui grossa camada de neve branca acumulada no topo, cumeeira de madeira, ripas e pingentes de gelo.
  // - NUNCA cobre a porta da casa (recuo frontal e pórtico em V sobre a porta deixando a entrada 100% visível).
  // - Sistema clássico de RPG: quando o jogador entra na casa, o telhado daquela casa fica invisível;
  //   ao sair da casa, o telhado volta imediatamente!
  function drawSnowCityHouseRoofs(ctx, tileSize, playerX, playerY, viewLeft, viewRight, viewTop, viewBottom, animTimer = 0) {
    if (typeof window === "undefined" || !window.SnowPeakCity || !window.SnowPeakCity.houses) return;

    const city = window.SnowPeakCity;
    const houses = city.houses;
    const activeHouseId = city.getActiveHouseForPlayer
      ? city.getActiveHouseForPlayer(playerX, playerY, tileSize)
      : null;

    // Inicializa mapa de opacidade suave por casa para transição fluida ao entrar/sair
    if (!window.__snowRoofAlphaMap) {
      window.__snowRoofAlphaMap = {};
    }
    const alphaMap = window.__snowRoofAlphaMap;

    for (let i = 0; i < houses.length; i++) {
      const h = houses[i];

      // Coordenadas em pixels do retângulo das paredes da casa
      const minTileX = h.cx - h.halfW;
      const maxTileX = h.cx + h.halfW;
      const minTileY = h.cy - h.halfH;
      const maxTileY = h.cy + h.halfH;

      const houseLeftPx = minTileX * tileSize;
      const houseRightPx = (maxTileX + 1) * tileSize;
      const houseTopPx = minTileY * tileSize;
      const houseBottomPx = (maxTileY + 1) * tileSize;

      // Descarte rápido (frustum culling) se a casa estiver fora da câmera
      if (
        houseRightPx + tileSize < viewLeft ||
        houseLeftPx - tileSize > viewRight ||
        houseBottomPx + tileSize < viewTop ||
        houseTopPx - tileSize > viewBottom
      ) {
        continue;
      }

      // Atualiza opacidade (0 quando o jogador está dentro desta casa, 1 quando está fora)
      const isPlayerInsideThisHouse = activeHouseId === h.id;
      const targetAlpha = isPlayerInsideThisHouse ? 0 : 1;
      const prevAlpha = alphaMap[h.id] !== undefined ? alphaMap[h.id] : targetAlpha;
      const nextAlpha =
        Math.abs(prevAlpha - targetAlpha) < 0.08
          ? targetAlpha
          : prevAlpha + (targetAlpha - prevAlpha) * 0.28;
      alphaMap[h.id] = nextAlpha;

      // Se totalmente invisível (jogador dentro da casa), não desenha o telhado
      if (nextAlpha <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = nextAlpha;

      const overhangX = 4;
      const roofLeft = houseLeftPx - overhangX;
      const roofRight = houseRightPx + overhangX;
      const roofW = roofRight - roofLeft;

      // Limites verticais da cobertura 2.5D (sem cobrir a porta da frente)
      const roofTop = h.doorOnSouth
        ? houseTopPx - tileSize * 0.72
        : houseTopPx + tileSize * 0.30;
      const roofBottom = h.doorOnSouth
        ? houseBottomPx - tileSize * 0.76
        : houseBottomPx - tileSize * 0.22;
      const roofH = roofBottom - roofTop;

      // [PERF] Cacheia o telhado 2.5D estático de cada casa em um canvas offscreen (reduz ~80 comandos vetoriais/gradientes para 1 drawImage!)
      if (!drawSnowCityHouseRoofs._houseRoofCache) {
        drawSnowCityHouseRoofs._houseRoofCache = new Map();
      }
      const hCacheKey = `h_${h.id}_${h.halfW}_${h.halfH}_${h.doorOnSouth ? 1 : 0}_${tileSize}`;
      let hCached = drawSnowCityHouseRoofs._houseRoofCache.get(hCacheKey);

      if (!hCached) {
        const pad = 16;
        const canW = Math.max(1, Math.ceil(roofW + pad * 2));
        const canH = Math.max(1, Math.ceil(roofH + pad * 2));
        const offCan = document.createElement("canvas");
        offCan.width = canW;
        offCan.height = canH;
        const rc = offCan.getContext("2d");

        if (rc) {
          rc.translate(-roofLeft + pad, -roofTop + pad);
          const origCtx = ctx;
          ctx = rc;

          // Cumeeira horizontal 2.5D
          const ridgeY = roofTop + roofH * 0.48;
          // Recuo lateral 2.5D da cumeeira (abas trapezoidais nos lados)
          const ridgeInsetX = Math.min(roofW * 0.14, tileSize * 1.25);
          const ridgeLeftX = roofLeft + ridgeInsetX;
          const ridgeRightX = roofRight - ridgeInsetX;

          const doorCenterX = (h.cx + 0.5) * tileSize;
          const gableHalfBaseW = Math.min(roofW * 0.30, tileSize * 1.85);
          const gableHalfTopW = tileSize * 0.42;
          const gableLeftX = Math.max(roofLeft + 12, doorCenterX - gableHalfBaseW);
          const gableRightX = Math.min(roofRight - 12, doorCenterX + gableHalfBaseW);
          const gableTopLeftX = doorCenterX - gableHalfTopW;
          const gableTopRightX = doorCenterX + gableHalfTopW;

          const gableHeightPx = Math.min(roofH * 0.44, tileSize * 2.15);
          const gableBaseY = h.doorOnSouth ? roofBottom : roofTop;
          const gablePeakY = h.doorOnSouth
            ? gableBaseY - gableHeightPx
            : gableBaseY + gableHeightPx;

          const roofStyle = h.id % 3;
          const northSlopeTopCol = roofStyle === 0 ? "#1e293b" : roofStyle === 1 ? "#2a1205" : "#292524";
          const northSlopeBotCol = roofStyle === 0 ? "#334155" : roofStyle === 1 ? "#451a03" : "#44403c";
          const southSlopeTopCol = roofStyle === 0 ? "#475569" : roofStyle === 1 ? "#78350f" : "#57534e";
          const southSlopeBotCol = roofStyle === 0 ? "#334155" : roofStyle === 1 ? "#451a03" : "#292524";
          const sideSlopeCol = roofStyle === 0 ? "#334155" : roofStyle === 1 ? "#5c2808" : "#44403c";

          // 1. Sombra 2.5D projetada pelos beirais sobre as paredes
          ctx.fillStyle = "rgba(15, 23, 42, 0.42)";
          ctx.fillRect(roofLeft + 2, roofTop + 5, roofW, roofH + 3);

          // 2. PAREDE FRONTAL DE MADEIRA/PEDRA DENTRO DO FRONTÃO ACIMA DA PORTA
          const gableWallGrad = ctx.createLinearGradient(0, Math.min(gablePeakY, gableBaseY), 0, Math.max(gablePeakY, gableBaseY));
          gableWallGrad.addColorStop(0, "#451a03");
          gableWallGrad.addColorStop(0.6, "#78350f");
          gableWallGrad.addColorStop(1, "#334155");
          ctx.fillStyle = gableWallGrad;
          ctx.beginPath();
          ctx.moveTo(gableLeftX, gableBaseY);
          ctx.lineTo(gableTopLeftX, gablePeakY);
          ctx.lineTo(gableTopRightX, gablePeakY);
          ctx.lineTo(gableRightX, gableBaseY);
          ctx.closePath();
          ctx.fill();

          // Tábuas verticais e viga de madeira dentro do frontão acima da porta
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(gableLeftX, gableBaseY);
          ctx.lineTo(gableTopLeftX, gablePeakY);
          ctx.lineTo(gableTopRightX, gablePeakY);
          ctx.lineTo(gableRightX, gableBaseY);
          ctx.closePath();
          ctx.clip();

          ctx.strokeStyle = "rgba(28, 25, 23, 0.5)";
          ctx.lineWidth = 1.1;
          for (let gx = gableLeftX + 7; gx < gableRightX; gx += 7) {
            ctx.beginPath();
            ctx.moveTo(gx, Math.min(gablePeakY, gableBaseY));
            ctx.lineTo(gx, Math.max(gablePeakY, gableBaseY));
            ctx.stroke();
          }
          const midGableY = (gablePeakY + gableBaseY) * 0.52;
          ctx.fillStyle = "#451a03";
          ctx.fillRect(gableLeftX, midGableY - 2, gableRightX - gableLeftX, 4);

          const atticWinY = gablePeakY + (gableBaseY - gablePeakY) * 0.42;
          ctx.fillStyle = "rgba(251, 191, 36, 0.75)";
          ctx.fillRect(doorCenterX - 5, atticWinY - 4, 10, 8);
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = 1.8;
          ctx.strokeRect(doorCenterX - 5, atticWinY - 4, 10, 8);
          ctx.restore();

          // 3. ÁGUAS LATERAIS ESQUERDA E DIREITA EM PERSPECTIVA 2.5D
          ctx.fillStyle = sideSlopeCol;
          ctx.beginPath();
          ctx.moveTo(roofLeft, roofTop);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.lineTo(roofLeft, roofBottom);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(roofRight, roofTop);
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(roofRight, roofBottom);
          ctx.closePath();
          ctx.fill();

          // 4. ÁGUA NORTE DO TELHADO 2.5D
          const northGrad = ctx.createLinearGradient(0, roofTop, 0, ridgeY);
          northGrad.addColorStop(0, northSlopeTopCol);
          northGrad.addColorStop(1, northSlopeBotCol);
          ctx.fillStyle = northGrad;
          ctx.beginPath();
          if (!h.doorOnSouth) {
            ctx.moveTo(roofLeft, roofTop);
            ctx.lineTo(gableLeftX, roofTop);
            ctx.lineTo(gableTopLeftX, gablePeakY);
            ctx.lineTo(gableTopRightX, gablePeakY);
            ctx.lineTo(gableRightX, roofTop);
            ctx.lineTo(roofRight, roofTop);
          } else {
            ctx.moveTo(roofLeft, roofTop);
            ctx.lineTo(roofRight, roofTop);
          }
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.closePath();
          ctx.fill();

          // 5. ÁGUA SUL DO TELHADO 2.5D
          const southGrad = ctx.createLinearGradient(0, ridgeY, 0, roofBottom);
          southGrad.addColorStop(0, southSlopeTopCol);
          southGrad.addColorStop(1, southSlopeBotCol);
          ctx.fillStyle = southGrad;
          ctx.beginPath();
          ctx.moveTo(ridgeLeftX, ridgeY);
          ctx.lineTo(ridgeRightX, ridgeY);
          if (h.doorOnSouth) {
            ctx.lineTo(roofRight, roofBottom);
            ctx.lineTo(gableRightX, roofBottom);
            ctx.lineTo(gableTopRightX, gablePeakY);
            ctx.lineTo(gableTopLeftX, gablePeakY);
            ctx.lineTo(gableLeftX, roofBottom);
            ctx.lineTo(roofLeft, roofBottom);
          } else {
            ctx.lineTo(roofRight, roofBottom);
            ctx.lineTo(roofLeft, roofBottom);
          }
          ctx.closePath();
          ctx.fill();

          // 6. Caibros e Telhas em perspectiva 2.5D
          ctx.strokeStyle = "rgba(15, 23, 42, 0.34)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          const numRafters = Math.max(6, Math.floor(roofW / 16));
          for (let r = 1; r < numRafters; r++) {
            const tFrac = r / numRafters;
            const topX = roofLeft + roofW * tFrac;
            const midX = ridgeLeftX + (ridgeRightX - ridgeLeftX) * tFrac;
            const botX = roofLeft + roofW * tFrac;

            const inGableX = topX > gableLeftX + 2 && topX < gableRightX - 2;
            if (!inGableX || h.doorOnSouth) {
              ctx.moveTo(topX, roofTop + 2);
              ctx.lineTo(midX, ridgeY);
            }
            if (!inGableX || !h.doorOnSouth) {
              ctx.moveTo(midX, ridgeY);
              ctx.lineTo(botX, roofBottom - 2);
            }
          }
          for (let sy = roofTop + 12; sy < roofBottom - 8; sy += 12) {
            if (h.doorOnSouth && sy > gablePeakY) {
              const prog = (sy - gablePeakY) / Math.max(1, roofBottom - gablePeakY);
              const curHalf = gableHalfTopW + prog * (gableHalfBaseW - gableHalfTopW);
              ctx.moveTo(roofLeft + 4, sy);
              ctx.lineTo(Math.max(roofLeft + 4, doorCenterX - curHalf - 4), sy);
              ctx.moveTo(Math.min(roofRight - 4, doorCenterX + curHalf + 4), sy);
              ctx.lineTo(roofRight - 4, sy);
            } else if (!h.doorOnSouth && sy < gablePeakY) {
              const prog = (gablePeakY - sy) / Math.max(1, gablePeakY - roofTop);
              const curHalf = gableHalfTopW + prog * (gableHalfBaseW - gableHalfTopW);
              ctx.moveTo(roofLeft + 4, sy);
              ctx.lineTo(Math.max(roofLeft + 4, doorCenterX - curHalf - 4), sy);
              ctx.moveTo(Math.min(roofRight - 4, doorCenterX + curHalf + 4), sy);
              ctx.lineTo(roofRight - 4, sy);
            } else {
              ctx.moveTo(roofLeft + 4, sy);
              ctx.lineTo(roofRight - 4, sy);
            }
          }
          ctx.stroke();

          // 7. CAMADA DE NEVE BRANCA ACUMULADA EM CIMA DO TELHADO 2.5D
          const snowPad = 6;
          const snowNorthGrad = ctx.createLinearGradient(0, roofTop, 0, ridgeY);
          snowNorthGrad.addColorStop(0, "#cbd5e1");
          snowNorthGrad.addColorStop(0.5, "#f1f5f9");
          snowNorthGrad.addColorStop(1, "#ffffff");
          ctx.fillStyle = snowNorthGrad;
          ctx.beginPath();
          if (!h.doorOnSouth) {
            ctx.moveTo(roofLeft + snowPad, roofTop + 4);
            ctx.lineTo(gableLeftX - 4, roofTop + 4);
            ctx.lineTo(gableTopLeftX - 2, gablePeakY + 3);
            ctx.lineTo(gableTopRightX + 2, gablePeakY + 3);
            ctx.lineTo(gableRightX + 4, roofTop + 4);
            ctx.lineTo(roofRight - snowPad, roofTop + 4);
          } else {
            ctx.moveTo(roofLeft + snowPad, roofTop + 4);
            ctx.lineTo(roofRight - snowPad, roofTop + 4);
          }
          ctx.lineTo(ridgeRightX - 2, ridgeY - 2);
          ctx.lineTo(ridgeLeftX + 2, ridgeY - 2);
          ctx.closePath();
          ctx.fill();

          const snowSouthGrad = ctx.createLinearGradient(0, ridgeY, 0, roofBottom);
          snowSouthGrad.addColorStop(0, "#ffffff");
          snowSouthGrad.addColorStop(0.65, "#f8fafc");
          snowSouthGrad.addColorStop(1, "#e2e8f0");
          ctx.fillStyle = snowSouthGrad;
          ctx.beginPath();
          ctx.moveTo(ridgeLeftX + 2, ridgeY + 2);
          ctx.lineTo(ridgeRightX - 2, ridgeY + 2);
          if (h.doorOnSouth) {
            ctx.lineTo(roofRight - snowPad, roofBottom - 5);
            ctx.lineTo(gableRightX + 4, roofBottom - 5);
            ctx.lineTo(gableTopRightX + 2, gablePeakY - 3);
            ctx.lineTo(gableTopLeftX - 2, gablePeakY - 3);
            ctx.lineTo(gableLeftX - 4, roofBottom - 5);
            ctx.lineTo(roofLeft + snowPad, roofBottom - 5);
          } else {
            ctx.lineTo(roofRight - snowPad, roofBottom - 5);
            ctx.lineTo(roofLeft + snowPad, roofBottom - 5);
          }
          ctx.closePath();
          ctx.fill();

          // 8. VIGAS DE MADEIRA E NEVE DO FRONTÃO ACIMA DA PORTA
          ctx.strokeStyle = "#3b1d0a";
          ctx.lineWidth = 5.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(gableLeftX - 2, gableBaseY);
          ctx.lineTo(gableTopLeftX, gablePeakY);
          ctx.lineTo(gableTopRightX, gablePeakY);
          ctx.lineTo(gableRightX + 2, gableBaseY);
          ctx.stroke();

          ctx.strokeStyle = "#78350f";
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(gableLeftX - 2, gableBaseY);
          ctx.lineTo(gableTopLeftX, gablePeakY);
          ctx.lineTo(gableTopRightX, gablePeakY);
          ctx.lineTo(gableRightX + 2, gableBaseY);
          ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(gableLeftX, gableBaseY - 2);
          ctx.lineTo(gableTopLeftX, gablePeakY - 2);
          ctx.lineTo(gableTopRightX, gablePeakY - 2);
          ctx.lineTo(gableRightX, gableBaseY - 2);
          ctx.stroke();

          // 9. CUMEEIRA CENTRAL E ARESTAS 2.5D DO TELHADO
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(roofLeft, roofTop);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.lineTo(roofLeft, roofBottom);
          ctx.moveTo(roofRight, roofTop);
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(roofRight, roofBottom);
          ctx.stroke();

          ctx.fillStyle = "#451a03";
          ctx.fillRect(ridgeLeftX - 2, ridgeY - 3.5, ridgeRightX - ridgeLeftX + 4, 7);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(ridgeLeftX + 2, ridgeY - 2, ridgeRightX - ridgeLeftX - 4, 3.5);

          ctx.strokeStyle = "#3b1d0a";
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          if (h.doorOnSouth) {
            ctx.moveTo(roofLeft, roofTop);
            ctx.lineTo(roofRight, roofTop);
            ctx.lineTo(roofRight, roofBottom);
            ctx.lineTo(gableRightX, roofBottom);
            ctx.moveTo(gableLeftX, roofBottom);
            ctx.lineTo(roofLeft, roofBottom);
            ctx.lineTo(roofLeft, roofTop);
          } else {
            ctx.moveTo(roofLeft, roofBottom);
            ctx.lineTo(roofRight, roofBottom);
            ctx.lineTo(roofRight, roofTop);
            ctx.lineTo(gableRightX, roofTop);
            ctx.moveTo(gableLeftX, roofTop);
            ctx.lineTo(roofLeft, roofTop);
            ctx.lineTo(roofLeft, roofBottom);
          }
          ctx.stroke();

          // 10. PINGENTES DE GELO DISCRETOS NO BEIRAL
          ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
          for (let ix = roofLeft + 8; ix < roofRight - 8; ix += 11) {
            if (h.doorOnSouth && ix > gableLeftX - 4 && ix < gableRightX + 4) continue;
            const icicleLen = 4 + ((Math.abs(ix * 7 + h.id * 13) % 5));
            ctx.beginPath();
            ctx.moveTo(ix - 1.8, roofBottom);
            ctx.lineTo(ix, roofBottom + icicleLen);
            ctx.lineTo(ix + 1.8, roofBottom);
            ctx.closePath();
            ctx.fill();
          }

          ctx = origCtx;
        }

        hCached = { canvas: offCan, pad };
        drawSnowCityHouseRoofs._houseRoofCache.set(hCacheKey, hCached);
      }

      ctx.drawImage(hCached.canvas, roofLeft - hCached.pad, roofTop - hCached.pad);

      // 8. CHAMINÉ FUMEGANTE ACIMA DO TELHADO (para continuar visível sobre a neve do telhado!)
      const chimTileX = h.cx + 3;
      const chimTileY = h.cy + (h.doorOnSouth ? -h.halfH : h.halfH);
      const chimPxX = chimTileX * tileSize + tileSize * 0.5;
      const chimPxY = chimTileY * tileSize + tileSize * 0.5;
      ctx.save();
      ctx.translate(chimPxX, chimPxY);
      drawSnowCityChimney(ctx, tileSize / 36, animTimer);
      ctx.restore();

      ctx.restore();
    }

    // =========================================================================
    // 13. TELHADOS ALPINOS MILITARES 2.5D DO QUARTEL E PRISÃO (COBERTOS DE NEVE):
    // - Cobre as Salas para Oficiais (Ala Noroeste), as Salas de Descanso para Oficiais (Ala Nordeste),
    //   o Corredor Central da Prisão e cada uma das 4 Grandes Celas Coletivas de Concentração!
    // - O Pátio de Execução com Forca permanece 100% a céu aberto no centro!
    // - Cada pavilhão tem seu próprio telhado independente: quando o jogador entra em um pavilhão,
    //   apenas o telhado daquele pavilhão fica invisível, e ao sair ele volta!
    // - Deixa as portas/portões de entrada livres e visíveis com frontões 2.5D inclinados (1 a 3 blocos).
    // =========================================================================
    const barracksRoofs = city.barracksRoofs || [];
    for (let b = 0; b < barracksRoofs.length; b++) {
      const br = barracksRoofs[b];

      const boxLeftPx = br.minTileX * tileSize;
      const boxRightPx = (br.maxTileX + 1) * tileSize;
      const boxTopPx = br.minTileY * tileSize;
      const boxBottomPx = (br.maxTileY + 1) * tileSize;

      // Frustum culling se o pavilhão estiver fora da câmera
      if (
        boxRightPx + tileSize < viewLeft ||
        boxLeftPx - tileSize > viewRight ||
        boxBottomPx + tileSize < viewTop ||
        boxTopPx - tileSize > viewBottom
      ) {
        continue;
      }

      // Opacidade suave por pavilhão (0 quando o jogador está dentro deste pavilhão, 1 quando está fora)
      const isPlayerInsideWing = activeHouseId === br.id;
      const targetAlpha = isPlayerInsideWing ? 0 : 1;
      const prevAlpha = alphaMap[br.id] !== undefined ? alphaMap[br.id] : targetAlpha;
      const nextAlpha =
        Math.abs(prevAlpha - targetAlpha) < 0.08
          ? targetAlpha
          : prevAlpha + (targetAlpha - prevAlpha) * 0.28;
      alphaMap[br.id] = nextAlpha;

      if (nextAlpha <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = nextAlpha;

      // Recuo lateral/frontal na face onde ficam as portas/portões para NUNCA cobrir a entrada!
      const roofLeft =
        br.doorSide === "west" ? boxLeftPx + tileSize * 0.65 : boxLeftPx - 3;
      const roofRight =
        br.doorSide === "east" ? boxRightPx - tileSize * 0.65 : boxRightPx + 3;
      const roofTop =
        br.doorSide === "north" ? boxTopPx + tileSize * 0.38 : boxTopPx - tileSize * 0.55;
      const roofBottom = boxBottomPx - tileSize * 0.22;

      const roofW = roofRight - roofLeft;
      const roofH = roofBottom - roofTop;

      // [PERF] Cacheia o telhado 2.5D estático de cada ala do Quartel/Prisão em um canvas offscreen!
      if (!drawSnowCityHouseRoofs._barracksRoofCache) {
        drawSnowCityHouseRoofs._barracksRoofCache = new Map();
      }
      const bCacheKey = `br_${br.id}_${tileSize}`;
      let bCached = drawSnowCityHouseRoofs._barracksRoofCache.get(bCacheKey);

      if (!bCached) {
        const pad = 16;
        const canW = Math.max(1, Math.ceil(roofW + pad * 2));
        const canH = Math.max(1, Math.ceil(roofH + pad * 2));
        const offCan = document.createElement("canvas");
        offCan.width = canW;
        offCan.height = canH;
        const rc = offCan.getContext("2d");

        if (rc) {
          rc.translate(-roofLeft + pad, -roofTop + pad);
          const origCtx = ctx;
          ctx = rc;

          const ridgeY = roofTop + roofH * 0.48;
          const ridgeInsetX = Math.min(roofW * 0.12, tileSize * 1.6);
          const ridgeLeftX = roofLeft + ridgeInsetX;
          const ridgeRightX = roofRight - ridgeInsetX;

          // Paleta Militar Glacial (Ardósia Cinza-Rocha, Carvalho Escuro e Pinheiro com Neve Branca; sem azul!)
          const rStyle = br.roofStyle || 0;
          const northSlopeTopCol = rStyle === 0 ? "#1e293b" : rStyle === 1 ? "#2a1205" : "#292524";
          const northSlopeBotCol = rStyle === 0 ? "#334155" : rStyle === 1 ? "#451a03" : "#44403c";
          const southSlopeTopCol = rStyle === 0 ? "#475569" : rStyle === 1 ? "#78350f" : "#57534e";
          const southSlopeBotCol = rStyle === 0 ? "#334155" : rStyle === 1 ? "#451a03" : "#292524";
          const sideSlopeCol = rStyle === 0 ? "#334155" : rStyle === 1 ? "#5c2808" : "#44403c";

          // 1. Sombra 2.5D projetada pelos beirais do quartel
          ctx.fillStyle = "rgba(15, 23, 42, 0.44)";
          ctx.fillRect(roofLeft + 2, roofTop + 5, roofW, roofH + 3);

          // 2. Águas laterais Esquerda e Direita em perspectiva 2.5D (Trapézios inclinados)
          ctx.fillStyle = sideSlopeCol;
          ctx.beginPath();
          ctx.moveTo(roofLeft, roofTop);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.lineTo(roofLeft, roofBottom);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(roofRight, roofTop);
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(roofRight, roofBottom);
          ctx.closePath();
          ctx.fill();

          // 3. Água Norte do Telhado 2.5D
          const northGrad = ctx.createLinearGradient(0, roofTop, 0, ridgeY);
          northGrad.addColorStop(0, northSlopeTopCol);
          northGrad.addColorStop(1, northSlopeBotCol);
          ctx.fillStyle = northGrad;
          ctx.beginPath();
          if (br.doorSide === "north" && br.doorTileX !== undefined) {
            const dCenterX = (br.doorTileX + 0.5) * tileSize;
            const gHalfBase = Math.min(roofW * 0.34, tileSize * 1.9);
            const gHalfTop = tileSize * 0.48;
            const gPeakY = roofTop + Math.min(roofH * 0.25, tileSize * 2.1);
            ctx.moveTo(roofLeft, roofTop);
            ctx.lineTo(dCenterX - gHalfBase, roofTop);
            ctx.lineTo(dCenterX - gHalfTop, gPeakY);
            ctx.lineTo(dCenterX + gHalfTop, gPeakY);
            ctx.lineTo(dCenterX + gHalfBase, roofTop);
            ctx.lineTo(roofRight, roofTop);
          } else {
            ctx.moveTo(roofLeft, roofTop);
            ctx.lineTo(roofRight, roofTop);
          }
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.closePath();
          ctx.fill();

          // 4. Água Sul do Telhado 2.5D
          const southGrad = ctx.createLinearGradient(0, ridgeY, 0, roofBottom);
          southGrad.addColorStop(0, southSlopeTopCol);
          southGrad.addColorStop(1, southSlopeBotCol);
          ctx.fillStyle = southGrad;
          ctx.beginPath();
          ctx.moveTo(ridgeLeftX, ridgeY);
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(roofRight, roofBottom);
          ctx.lineTo(roofLeft, roofBottom);
          ctx.closePath();
          ctx.fill();

          // 5. Caibros e Telhas em perspectiva 2.5D
          ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          const numRafters = Math.max(8, Math.floor(roofW / 18));
          for (let r = 1; r < numRafters; r++) {
            const tFrac = r / numRafters;
            const topX = roofLeft + roofW * tFrac;
            const midX = ridgeLeftX + (ridgeRightX - ridgeLeftX) * tFrac;
            const botX = roofLeft + roofW * tFrac;
            ctx.moveTo(topX, roofTop + 3);
            ctx.lineTo(midX, ridgeY);
            ctx.moveTo(midX, ridgeY);
            ctx.lineTo(botX, roofBottom - 3);
          }
          for (let sy = roofTop + 14; sy < roofBottom - 8; sy += 14) {
            ctx.moveTo(roofLeft + 5, sy);
            ctx.lineTo(roofRight - 5, sy);
          }
          ctx.stroke();

          // 6. CAMADA ESPESSA DE NEVE BRANCA ACUMULADA EM CIMA DO TELHADO DO QUARTEL E PRISÃO
          const snowPad = 7;
          const snowNorthGrad = ctx.createLinearGradient(0, roofTop, 0, ridgeY);
          snowNorthGrad.addColorStop(0, "#cbd5e1");
          snowNorthGrad.addColorStop(0.5, "#f1f5f9");
          snowNorthGrad.addColorStop(1, "#ffffff");
          ctx.fillStyle = snowNorthGrad;
          ctx.beginPath();
          ctx.moveTo(roofLeft + snowPad, roofTop + 5);
          ctx.lineTo(roofRight - snowPad, roofTop + 5);
          ctx.lineTo(ridgeRightX - 2, ridgeY - 2);
          ctx.lineTo(ridgeLeftX + 2, ridgeY - 2);
          ctx.closePath();
          ctx.fill();

          const snowSouthGrad = ctx.createLinearGradient(0, ridgeY, 0, roofBottom);
          snowSouthGrad.addColorStop(0, "#ffffff");
          snowSouthGrad.addColorStop(0.65, "#f8fafc");
          snowSouthGrad.addColorStop(1, "#e2e8f0");
          ctx.fillStyle = snowSouthGrad;
          ctx.beginPath();
          ctx.moveTo(ridgeLeftX + 2, ridgeY + 2);
          ctx.lineTo(ridgeRightX - 2, ridgeY + 2);
          ctx.lineTo(roofRight - snowPad, roofBottom - 6);
          ctx.lineTo(roofLeft + snowPad, roofBottom - 6);
          ctx.closePath();
          ctx.fill();

          // 7. FRONTÕES 2.5D INCLINADOS SOBRE AS PORTAS E PORTÕES LATERAIS
          if ((br.doorSide === "east" || br.doorSide === "west") && br.doorTilesY) {
            const isEast = br.doorSide === "east";
            const edgeX = isEast ? roofRight : roofLeft;
            const dirIn = isEast ? -1 : 1;
            const gableDepthPx = tileSize * 2.0;
            const gHalfBaseY = tileSize * 1.45;
            const gHalfTopY = tileSize * 0.42;

            for (let d = 0; d < br.doorTilesY.length; d++) {
              const doorCY = (br.doorTilesY[d] + 0.5) * tileSize;
              const by1 = Math.max(roofTop + 8, doorCY - gHalfBaseY);
              const by2 = Math.min(roofBottom - 8, doorCY + gHalfBaseY);
              const ty1 = doorCY - gHalfTopY;
              const ty2 = doorCY + gHalfTopY;
              const peakX = edgeX + dirIn * gableDepthPx;

              ctx.fillStyle = "#451a03";
              ctx.beginPath();
              ctx.moveTo(edgeX, by1);
              ctx.lineTo(peakX, ty1);
              ctx.lineTo(peakX, ty2);
              ctx.lineTo(edgeX, by2);
              ctx.closePath();
              ctx.fill();

              ctx.strokeStyle = "#78350f";
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(edgeX, by1);
              ctx.lineTo(peakX, ty1);
              ctx.lineTo(peakX, ty2);
              ctx.lineTo(edgeX, by2);
              ctx.stroke();

              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              ctx.moveTo(edgeX, by1 - 1.5);
              ctx.lineTo(peakX, ty1 - 1.5);
              ctx.lineTo(peakX, ty2 - 1.5);
              ctx.lineTo(edgeX, by2 - 1.5);
              ctx.stroke();
            }
          }

          // 8. Cumeeira central de madeira maciça e neve no topo
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(roofLeft, roofTop);
          ctx.lineTo(ridgeLeftX, ridgeY);
          ctx.lineTo(roofLeft, roofBottom);
          ctx.moveTo(roofRight, roofTop);
          ctx.lineTo(ridgeRightX, ridgeY);
          ctx.lineTo(roofRight, roofBottom);
          ctx.stroke();

          ctx.fillStyle = "#451a03";
          ctx.fillRect(ridgeLeftX - 2, ridgeY - 4, ridgeRightX - ridgeLeftX + 4, 8);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(ridgeLeftX + 2, ridgeY - 2, ridgeRightX - ridgeLeftX - 4, 4);

          ctx.strokeStyle = "#3b1d0a";
          ctx.lineWidth = 2.6;
          ctx.strokeRect(roofLeft, roofTop, roofW, roofH);

          // 9. Pingentes de gelo discretos no beiral sul
          ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
          for (let ix = roofLeft + 10; ix < roofRight - 10; ix += 12) {
            const icicleLen = 4 + ((Math.abs(ix * 7 + b * 13) % 5));
            ctx.beginPath();
            ctx.moveTo(ix - 1.8, roofBottom);
            ctx.lineTo(ix, roofBottom + icicleLen);
            ctx.lineTo(ix + 1.8, roofBottom);
            ctx.closePath();
            ctx.fill();
          }

          ctx = origCtx;
        }

        bCached = { canvas: offCan, pad };
        drawSnowCityHouseRoofs._barracksRoofCache.set(bCacheKey, bCached);
      }

      ctx.drawImage(bCached.canvas, roofLeft - bCached.pad, roofTop - bCached.pad);

      // 10. Chaminé fumegante acima do telhado nas Alas de Oficiais e Descanso
      if (br.chimneyTileX !== undefined && br.chimneyTileY !== undefined) {
        const chimPxX = br.chimneyTileX * tileSize + tileSize * 0.5;
        const chimPxY = br.chimneyTileY * tileSize + tileSize * 0.5;
        ctx.save();
        ctx.translate(chimPxX, chimPxY);
        drawSnowCityChimney(ctx, tileSize / 36, animTimer);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // ALDEIA DAS AREIAS DOURADAS (POVOADO DO DESERTO - CASAS DE ADOBE):
  // 1. Telhados 2.5D de Adobe com Vigas Salientes de Madeira (desaparecem ao entrar)
  // 2. Paredes de Adobe / Argila Cozida
  // 3. Portas Rústicas de Madeira
  // 4. Esteiras de Dormir de Palha Trançada
  // 5. Potes e Ânforas de Cerâmica de Mantimentos
  // 6. Piso Interno de Terra Batida
  // =========================================================================

  function drawDesertCityHouseRoofs(ctx, tileSize, playerX, playerY, viewLeft, viewRight, viewTop, viewBottom, animTimer = 0) {
    if (typeof window === "undefined" || !window.DesertCity || !window.DesertCity.houses) return;

    const city = window.DesertCity;
    const houses = city.houses;
    const activeHouseId = city.getActiveHouseForPlayer
      ? city.getActiveHouseForPlayer(playerX, playerY, tileSize)
      : null;

    if (!window.__desertRoofAlphaMap) {
      window.__desertRoofAlphaMap = {};
    }
    const alphaMap = window.__desertRoofAlphaMap;

    for (let i = 0; i < houses.length; i++) {
      const h = houses[i];
      const minTileX = h.cx - h.halfW;
      const maxTileX = h.cx + h.halfW;
      const minTileY = h.cy - h.halfH;
      const maxTileY = h.cy + h.halfH;

      const houseLeftPx = minTileX * tileSize;
      const houseRightPx = (maxTileX + 1) * tileSize;
      const houseTopPx = minTileY * tileSize;
      const houseBottomPx = (maxTileY + 1) * tileSize;

      // Descarte rápido (frustum culling)
      if (
        houseRightPx + tileSize < viewLeft ||
        houseLeftPx - tileSize > viewRight ||
        houseBottomPx + tileSize < viewTop ||
        houseTopPx - tileSize > viewBottom
      ) {
        continue;
      }

      const isInside = activeHouseId === h.id;
      const targetAlpha = isInside ? 0 : 1;
      const prevAlpha = alphaMap[h.id] !== undefined ? alphaMap[h.id] : targetAlpha;
      const nextAlpha =
        Math.abs(prevAlpha - targetAlpha) < 0.08
          ? targetAlpha
          : prevAlpha + (targetAlpha - prevAlpha) * 0.28;
      alphaMap[h.id] = nextAlpha;

      if (nextAlpha <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = nextAlpha;

      const overhangX = 3;
      const roofLeft = houseLeftPx - overhangX;
      const roofRight = houseRightPx + overhangX;
      const roofW = roofRight - roofLeft;

      const isSouthDoor = h.doorSide === "south";
      const roofTop = isSouthDoor
        ? houseTopPx - tileSize * 0.65
        : houseTopPx + tileSize * 0.25;
      const roofBottom = isSouthDoor
        ? houseBottomPx - tileSize * 0.70
        : houseBottomPx - tileSize * 0.20;
      const roofH = roofBottom - roofTop;

      // Cache em offscreen canvas
      if (!drawDesertCityHouseRoofs._cache) {
        drawDesertCityHouseRoofs._cache = new Map();
      }
      const cacheKey = `d_roof_${h.id}_${tileSize}`;
      let cached = drawDesertCityHouseRoofs._cache.get(cacheKey);

      if (!cached) {
        const pad = 18;
        const canW = Math.max(1, Math.ceil(roofW + pad * 2));
        const canH = Math.max(1, Math.ceil(roofH + pad * 2));
        const offCan = document.createElement("canvas");
        offCan.width = canW;
        offCan.height = canH;
        const rc = offCan.getContext("2d");

        if (rc) {
          rc.translate(-roofLeft + pad, -roofTop + pad);

          // 1. Sombra suave do telhado de adobe projetada ao sul no solo do deserto
          rc.fillStyle = "rgba(69, 36, 12, 0.40)";
          rc.beginPath();
          rc.roundRect(roofLeft + 4, roofBottom - 2, roofW - 8, 14, 6);
          rc.fill();

          // 2. Terraço / Teto plano de adobe seco ao sol
          const roofGrad = rc.createLinearGradient(0, roofTop, 0, roofBottom);
          roofGrad.addColorStop(0, "#c9955c");
          roofGrad.addColorStop(0.5, "#b57e46");
          roofGrad.addColorStop(1, "#996332");
          rc.fillStyle = roofGrad;
          rc.beginPath();
          rc.roundRect(roofLeft, roofTop, roofW, roofH, 4);
          rc.fill();

          // 3. Textura de terra batida e poeira fina do deserto no topo
          rc.fillStyle = "rgba(235, 187, 128, 0.18)";
          rc.fillRect(roofLeft + 6, roofTop + 6, roofW - 12, roofH - 12);

          // 4. Parapete / Platibanda de proteção da borda da cobertura
          const parapetInset = 4;
          rc.strokeStyle = "#7c4a1e";
          rc.lineWidth = 2.4;
          rc.strokeRect(roofLeft + parapetInset, roofTop + parapetInset, roofW - parapetInset * 2, roofH - parapetInset * 2);

          // 5. Linha de destaque ensolarada (brilho do sol do deserto na borda norte/oeste)
          rc.strokeStyle = "rgba(255, 230, 180, 0.55)";
          rc.lineWidth = 1.6;
          rc.beginPath();
          rc.moveTo(roofLeft + 2, roofTop + roofH - 4);
          rc.lineTo(roofLeft + 2, roofTop + 2);
          rc.lineTo(roofLeft + roofW - 4, roofTop + 2);
          rc.stroke();

          // 6. Vigas salientes de madeira rústica de palmeira (vigas tradicionais de casas de adobe)
          const beamCount = Math.max(3, Math.floor(roofW / (tileSize * 0.85)));
          const beamStep = roofW / (beamCount + 1);
          const beamRadius = 3.2;
          const beamY = roofBottom - 4;

          for (let b = 1; b <= beamCount; b++) {
            const bx = roofLeft + b * beamStep;

            // Sombra da ponta da viga
            rc.fillStyle = "rgba(45, 20, 6, 0.45)";
            rc.beginPath();
            rc.arc(bx + 1, beamY + 2.5, beamRadius, 0, Math.PI * 2);
            rc.fill();

            // Madeira escura da viga
            rc.fillStyle = "#4a2c11";
            rc.beginPath();
            rc.arc(bx, beamY, beamRadius, 0, Math.PI * 2);
            rc.fill();

            // Anéis de crescimento da madeira no corte da viga
            rc.strokeStyle = "#825023";
            rc.lineWidth = 1;
            rc.beginPath();
            rc.arc(bx, beamY, beamRadius * 0.6, 0, Math.PI * 2);
            rc.stroke();
          }

          // 7. Borda final do telhado com acabamento suave
          rc.strokeStyle = "#593315";
          rc.lineWidth = 1.8;
          rc.beginPath();
          rc.roundRect(roofLeft, roofTop, roofW, roofH, 4);
          rc.stroke();
        }

        cached = { canvas: offCan, pad };
        drawDesertCityHouseRoofs._cache.set(cacheKey, cached);
      }

      ctx.drawImage(cached.canvas, roofLeft - cached.pad, roofTop - cached.pad);
      ctx.restore();
    }
  }

  // 2. Parede 2.5D de Tijolos de Adobe e Argila Seca ao Sol
  function drawDesertCityWall(ctx, tileSize, subType = 0, neighbors = null) {
    const nL = !!(neighbors && neighbors.left);
    const nR = !!(neighbors && neighbors.right);
    const nB = !!(neighbors && neighbors.bottom);

    if (!drawDesertCityWall._cache) {
      drawDesertCityWall._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nB ? 4 : 0);
    const key = `${tileSize.toFixed(2)}_${mask}`;
    let cached = drawDesertCityWall._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(24 * tileSize);
      const padTop = Math.ceil(16 * tileSize);
      const padBot = Math.ceil(30 * tileSize);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * tileSize;
        const leftX = nL ? -half - 1 * tileSize : -half + 1 * tileSize;
        const rightX = nR ? half + 1 * tileSize : half - 1 * tileSize;
        const w = rightX - leftX;
        const wallH = 26 * tileSize;
        const baseY = 18 * tileSize;
        const topFrontY = baseY - wallH;

        // Sombra suave na areia ao sul
        if (!nB) {
          wc.fillStyle = "rgba(70, 38, 12, 0.45)";
          wc.fillRect(leftX - 1 * tileSize, baseY - 2 * tileSize, w + 2 * tileSize, 8 * tileSize);
        }

        // Face frontal: Gradiente de tijolos de adobe dourados
        const wallGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
        wallGrad.addColorStop(0, "#c9955c");
        wallGrad.addColorStop(0.4, "#b57e46");
        wallGrad.addColorStop(1, "#8a582b");
        wc.fillStyle = wallGrad;
        wc.fillRect(leftX, topFrontY, w, wallH);

        // Linhas de assentamento de tijolos de adobe
        wc.strokeStyle = "rgba(74, 42, 16, 0.60)";
        wc.lineWidth = 1.1 * tileSize;

        // Linhas horizontais de adobe
        const rows = 4;
        const rowH = wallH / rows;
        for (let r = 1; r < rows; r++) {
          const ly = topFrontY + r * rowH;
          wc.beginPath();
          wc.moveTo(leftX + 1, ly);
          wc.lineTo(rightX - 1, ly);
          wc.stroke();
        }

        // Linhas verticais alternadas de tijolos
        const brickW = 12 * tileSize;
        for (let r = 0; r < rows; r++) {
          const ly0 = topFrontY + r * rowH;
          const ly1 = ly0 + rowH;
          const xOffset = (r % 2 === 0 ? 0 : brickW * 0.5);
          for (let bx = leftX + xOffset + brickW; bx < rightX - 2; bx += brickW) {
            wc.beginPath();
            wc.moveTo(bx, ly0);
            wc.lineTo(bx, ly1);
            wc.stroke();
          }
        }

        // Topo da parede: destaque iluminado pelo sol do deserto
        wc.fillStyle = "#dfa86f";
        wc.fillRect(leftX, topFrontY - 2 * tileSize, w, 3 * tileSize);

        // Borda final sutil
        wc.strokeStyle = "#593315";
        wc.lineWidth = 1.2 * tileSize;
        wc.strokeRect(leftX, topFrontY - 2 * tileSize, w, wallH + 2 * tileSize);
      }

      cached = { canvas: can, padX, padTop };
      drawDesertCityWall._cache.set(key, cached);
    }

    ctx.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  // 3. Porta Rústica de Madeira com Batente de Adobe
  function drawDesertCityDoor(ctx, tileSize, isOpen = false, isVertical = false) {
    ctx.save();
    const w = 18 * tileSize;
    const h = 26 * tileSize;
    const baseY = 16 * tileSize;
    const topY = baseY - h;

    // Batente de adobe
    ctx.fillStyle = "#7a491f";
    ctx.fillRect(-w / 2 - 2, topY - 2, w + 4, h + 4);

    if (isOpen) {
      // Vão aberto escuro da porta (mostra o interior fresco da casa de adobe)
      ctx.fillStyle = "#2d1b0d";
      ctx.fillRect(-w / 2, topY, w, h);

      // Folha da porta aberta inclinada para dentro
      ctx.save();
      ctx.translate(-w / 2 + 3, baseY - 2);
      ctx.rotate(-0.85);

      ctx.fillStyle = "#633c1d";
      ctx.fillRect(0, -h + 2, 6 * tileSize, h - 2);

      ctx.strokeStyle = "#3d210b";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(0, -h + 2, 6 * tileSize, h - 2);
      ctx.restore();
    } else {
      // Porta fechada de tábuas verticais de madeira rústica
      const woodGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      woodGrad.addColorStop(0, "#734621");
      woodGrad.addColorStop(0.5, "#8a5529");
      woodGrad.addColorStop(1, "#663d1c");
      ctx.fillStyle = woodGrad;
      ctx.fillRect(-w / 2, topY, w, h);

      // Ranhuras das tábuas verticais
      ctx.strokeStyle = "#42240e";
      ctx.lineWidth = 1.2;
      const plankW = w / 3;
      for (let p = 1; p < 3; p++) {
        ctx.beginPath();
        ctx.moveTo(-w / 2 + p * plankW, topY + 1);
        ctx.lineTo(-w / 2 + p * plankW, baseY - 1);
        ctx.stroke();
      }

      // Travessas de reforço horizontal de ferro/madeira
      ctx.fillStyle = "#3b220d";
      ctx.fillRect(-w / 2 + 1, topY + h * 0.22, w - 2, 3.5 * tileSize);
      ctx.fillRect(-w / 2 + 1, topY + h * 0.72, w - 2, 3.5 * tileSize);

      // Puxador rústico de ferro
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(w / 2 - 4.5, topY + h * 0.52, 2.2 * tileSize, 0, Math.PI * 2);
      ctx.fill();

      // Borda do batente
      ctx.strokeStyle = "#381f0b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2, topY, w, h);
    }

    ctx.restore();
  }

  // 4. Esteira Rústica de Dormir de Palha Trançada (com travesseiro de linho)
  function drawDesertCityMat(ctx, tileSize) {
    ctx.save();
    const mw = 26 * tileSize;
    const mh = 32 * tileSize;
    const mx = -mw / 2;
    const my = -mh / 2;

    // Sombra suave sob a esteira no chão de terra batida
    ctx.fillStyle = "rgba(45, 24, 8, 0.35)";
    ctx.fillRect(mx + 2, my + 3, mw, mh);

    // Corpo da esteira de palha / junco
    const matGrad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
    matGrad.addColorStop(0, "#d9b46e");
    matGrad.addColorStop(0.5, "#c59f56");
    matGrad.addColorStop(1, "#ad8841");
    ctx.fillStyle = matGrad;
    ctx.beginPath();
    ctx.roundRect(mx, my, mw, mh, 2);
    ctx.fill();

    // Textura trançada com linhas finas cruzadas
    ctx.strokeStyle = "rgba(112, 79, 28, 0.45)";
    ctx.lineWidth = 0.9;
    const step = 4 * tileSize;
    for (let x = mx + step; x < mx + mw; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, my + 1);
      ctx.lineTo(x, my + mh - 1);
      ctx.stroke();
    }
    for (let y = my + step; y < my + mh; y += step) {
      ctx.beginPath();
      ctx.moveTo(mx + 1, y);
      ctx.lineTo(mx + mw - 1, y);
      ctx.stroke();
    }

    // Bordas costuradas / arremate da esteira
    ctx.strokeStyle = "#825b20";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(mx, my, mw, mh);

    // Travesseiro de linho enrolado / dobrado na cabeceira da esteira
    const pw = mw * 0.78;
    const ph = 9 * tileSize;
    const px = -pw / 2;
    const py = my + 3 * tileSize;

    // Sombra do travesseiro
    ctx.fillStyle = "rgba(75, 48, 15, 0.35)";
    ctx.beginPath();
    ctx.roundRect(px + 1, py + 2, pw, ph, 3);
    ctx.fill();

    // Tecido de linho bege claro
    const pillowGrad = ctx.createLinearGradient(0, py, 0, py + ph);
    pillowGrad.addColorStop(0, "#f8f5ee");
    pillowGrad.addColorStop(0.6, "#eae2ce");
    pillowGrad.addColorStop(1, "#c8bc9e");
    ctx.fillStyle = pillowGrad;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 4);
    ctx.fill();

    // Costuras e dobra do travesseiro
    ctx.strokeStyle = "#ab9c7b";
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, pw, ph);

    // Faixa decorativa simples de tecido do deserto no travesseiro
    ctx.fillStyle = "#b45309";
    ctx.fillRect(px + pw * 0.44, py, 4 * tileSize, ph);

    ctx.restore();
  }

  // 5. Potes e Ânforas de Cerâmica de Mantimentos (grãos, tâmaras e água fresca)
  function drawDesertCityPots(ctx, tileSize) {
    ctx.save();

    // 1. Pote Grande Principal (Ânfora de barro com tampa de pano amarrada)
    const p1x = -5 * tileSize;
    const p1y = 2 * tileSize;
    const r1 = 9 * tileSize;

    // Sombra comum no chão
    ctx.fillStyle = "rgba(45, 24, 8, 0.40)";
    ctx.beginPath();
    ctx.ellipse(p1x, p1y + r1 * 0.65, r1 * 1.15, r1 * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corpo da ânfora de cerâmica terracota
    const grad1 = ctx.createRadialGradient(p1x - r1 * 0.35, p1y - r1 * 0.35, 1, p1x, p1y, r1);
    grad1.addColorStop(0, "#e07a48");
    grad1.addColorStop(0.5, "#c25e2e");
    grad1.addColorStop(1, "#8a3514");
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.ellipse(p1x, p1y, r1 * 0.9, r1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Faixa decorativa incisa na cerâmica
    ctx.strokeStyle = "#6d270c";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(p1x, p1y, r1 * 0.88, r1 * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Boca da ânfora com tecido de linho amarrado com barbante
    const neckY = p1y - r1 * 0.95;
    ctx.fillStyle = "#f1ede2";
    ctx.beginPath();
    ctx.ellipse(p1x, neckY, r1 * 0.48, 3.5 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#854d0e";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Cordão de amarração
    ctx.strokeStyle = "#5b3109";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p1x - r1 * 0.4, neckY + 1);
    ctx.lineTo(p1x + r1 * 0.4, neckY + 1);
    ctx.stroke();

    // Alça da ânfora
    ctx.strokeStyle = "#8a3514";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(p1x - r1 * 0.82, p1y - r1 * 0.2, 3.8 * tileSize, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    // 2. Segundo Pote Médio (Jarros de água e tâmaras ao lado)
    const p2x = 8 * tileSize;
    const p2y = 4 * tileSize;
    const r2 = 6.8 * tileSize;

    // Sombra do segundo pote
    ctx.fillStyle = "rgba(45, 24, 8, 0.40)";
    ctx.beginPath();
    ctx.ellipse(p2x, p2y + r2 * 0.65, r2 * 1.1, r2 * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cerâmica de argila amarelada/ocre do deserto
    const grad2 = ctx.createRadialGradient(p2x - r2 * 0.3, p2y - r2 * 0.3, 1, p2x, p2y, r2);
    grad2.addColorStop(0, "#d99343");
    grad2.addColorStop(0.5, "#ba7327");
    grad2.addColorStop(1, "#7d4711");
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(p2x, p2y, r2, 0, Math.PI * 2);
    ctx.fill();

    // Abertura do segundo jarro (com tâmaras e grãos visíveis)
    ctx.fillStyle = "#3f210a";
    ctx.beginPath();
    ctx.ellipse(p2x, p2y - r2 * 0.7, r2 * 0.55, 2.6 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Algumas tâmaras secas / sementes na borda
    ctx.fillStyle = "#291307";
    ctx.beginPath();
    ctx.arc(p2x - 1.5, p2y - r2 * 0.68, 1.8 * tileSize, 0, Math.PI * 2);
    ctx.arc(p2x + 2, p2y - r2 * 0.72, 1.6 * tileSize, 0, Math.PI * 2);
    ctx.fill();

    // Borda da boca do jarro
    ctx.strokeStyle = "#592e07";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(p2x, p2y - r2 * 0.7, r2 * 0.58, 2.8 * tileSize, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Terceira Tigela/Pote Pequeno em primeiro plano
    const p3x = 1 * tileSize;
    const p3y = 10 * tileSize;
    const r3 = 4.6 * tileSize;

    ctx.fillStyle = "rgba(45, 24, 8, 0.35)";
    ctx.beginPath();
    ctx.ellipse(p3x, p3y + 2, r3 * 1.1, r3 * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad3 = ctx.createRadialGradient(p3x - 1, p3y - 1, 1, p3x, p3y, r3);
    grad3.addColorStop(0, "#c27447");
    grad3.addColorStop(0.6, "#9e4e24");
    grad3.addColorStop(1, "#66280b");
    ctx.fillStyle = grad3;
    ctx.beginPath();
    ctx.arc(p3x, p3y, r3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2e1407";
    ctx.beginPath();
    ctx.ellipse(p3x, p3y - r3 * 0.5, r3 * 0.7, 1.8 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. Piso Interno de Terra Batida / Adobe Compacto
  function drawDesertCityFloor(ctx, tileSize) {
    ctx.save();
    const half = 18 * tileSize;

    // Piso de terra batida nivelada suave
    const floorGrad = ctx.createLinearGradient(-half, -half, half, half);
    floorGrad.addColorStop(0, "#c79860");
    floorGrad.addColorStop(0.5, "#ba8950");
    floorGrad.addColorStop(1, "#a87840");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(-half, -half, half * 2, half * 2);

    // Suaves marcas de espátula e argila seca
    ctx.strokeStyle = "rgba(102, 63, 23, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-half + 4, -half + 10);
    ctx.lineTo(half - 6, -half + 12);
    ctx.moveTo(-half + 8, half - 10);
    ctx.lineTo(half - 4, half - 8);
    ctx.stroke();

    ctx.restore();
  }

  // 7. Ovos e Ninhadas de Tardígrados no Ninho das Cavernas do Deserto
  function drawTardigradeEggs(ctx, scale = 1, subType = 0, opened = false) {
    scale = (typeof scale === "number" && isFinite(scale) && scale > 0) ? scale : 1;
    ctx.save();

    // Sombra suave no chão arenoso
    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    ctx.beginPath();
    ctx.ellipse(0, 3 * scale, 12 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ninho sutil de secreção criptobiótica e fios mucosos secos
    ctx.strokeStyle = "rgba(180, 83, 9, 0.35)";
    ctx.lineWidth = 1.0 * scale;
    ctx.beginPath();
    ctx.arc(0, 1 * scale, 10 * scale, 0.2, Math.PI * 1.8);
    ctx.stroke();

    if (opened) {
      // Cascas vazias e rompidas de ovos eclodidos
      ctx.fillStyle = "rgba(217, 119, 6, 0.6)";
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 0.8 * scale;
      // Casca 1
      ctx.beginPath();
      ctx.ellipse(-4 * scale, 1 * scale, 3.8 * scale, 2.5 * scale, 0.3, Math.PI * 0.2, Math.PI * 1.2);
      ctx.stroke();
      ctx.fill();
      // Casca 2
      ctx.beginPath();
      ctx.ellipse(3 * scale, 2 * scale, 3.2 * scale, 2.2 * scale, -0.4, 0, Math.PI);
      ctx.stroke();
      ctx.fill();
      // Fragmentos
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(-1 * scale, 0, 1.2 * scale, 1.2 * scale);
      ctx.fillRect(5 * scale, -1 * scale, 1.0 * scale, 1.0 * scale);
      ctx.restore();
      return;
    }

    // Configuração dos ovos por subType (aglomerados naturais de 3 a 5 ovos translúcidos)
    const eggConfigs = [
      // Subtipo 0: Quatro ovos aglomerados
      [
        { x: -4.5, y: 1.5, rx: 4.2, ry: 3.5, ang: -0.2 },
        { x: 3.5, y: 2.0, rx: 4.5, ry: 3.6, ang: 0.25 },
        { x: -0.5, y: -2.0, rx: 4.8, ry: 3.8, ang: 0.1 },
        { x: 1.5, y: 0.5, rx: 3.6, ry: 3.0, ang: -0.15 },
      ],
      // Subtipo 1: Grande ovo central com dois ovos companheiros
      [
        { x: -3.8, y: 1.0, rx: 3.8, ry: 3.2, ang: -0.3 },
        { x: 1.0, y: -1.0, rx: 5.6, ry: 4.5, ang: 0.15 },
        { x: 4.2, y: 2.2, rx: 3.5, ry: 3.0, ang: 0.4 },
      ],
      // Subtipo 2: Ninhada de cinco ovos brilhantes
      [
        { x: -5.0, y: 0.0, rx: 4.0, ry: 3.2, ang: -0.2 },
        { x: -1.5, y: -3.0, rx: 4.2, ry: 3.5, ang: 0.05 },
        { x: 3.5, y: -2.0, rx: 4.4, ry: 3.6, ang: 0.25 },
        { x: 4.0, y: 2.0, rx: 3.8, ry: 3.2, ang: 0.35 },
        { x: -1.0, y: 1.8, rx: 4.6, ry: 3.8, ang: -0.1 },
      ],
    ][subType % 3];

    for (const egg of eggConfigs) {
      const ex = egg.x * scale;
      const ey = egg.y * scale;
      const erx = egg.rx * scale;
      const ery = egg.ry * scale;

      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(egg.ang);

      // Brilho exterior suave (halo translúcido)
      const glowGrad = ctx.createRadialGradient(0, 0, erx * 0.4, 0, 0, erx * 1.3);
      glowGrad.addColorStop(0, "rgba(251, 191, 36, 0.45)");
      glowGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, erx * 1.3, ery * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Casca externa do ovo (âmbar translúcido dourado)
      const shellGrad = ctx.createRadialGradient(-erx * 0.25, -ery * 0.3, erx * 0.15, 0, 0, erx);
      shellGrad.addColorStop(0, "#fef08a"); // Centro luminoso
      shellGrad.addColorStop(0.45, "#fbbf24"); // Corpo âmbar
      shellGrad.addColorStop(0.85, "#d97706"); // Borda densa
      shellGrad.addColorStop(1, "#92400e");
      ctx.fillStyle = shellGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, erx, ery, 0, 0, Math.PI * 2);
      ctx.fill();

      // Contorno fino quitinoso
      ctx.strokeStyle = "rgba(120, 53, 15, 0.65)";
      ctx.lineWidth = 0.8 * scale;
      ctx.stroke();

      // Embrião dormente visível por transparência (minúsculo corpo de tardígrado encolhido)
      ctx.fillStyle = "rgba(180, 83, 9, 0.42)";
      ctx.beginPath();
      ctx.ellipse(0.3 * scale, 0.2 * scale, erx * 0.45, ery * 0.4, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Ponto de luz / reflexo especular na casca curvada
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.beginPath();
      ctx.ellipse(-erx * 0.35, -ery * 0.38, erx * 0.3, ery * 0.22, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // CIDADE PORTUÁRIA DAS PALMEIRAS (PRAIA TROPICAL & EMBARCAÇÕES NA ÁGUA):
  // 1. Pisos do Calçadão, Praça do Porto, Píeres de Madeira sobre a Água e Convés de Embarcações
  // 2. Paredes Coloniais Caiadas 2.5D com Vigas de Madeira Tropical
  // 3. Portas Navais com Vigia de Latão
  // 4. Telhados 2.5D de Telha Colonial Terracota / Palha Trançada (desaparecem ao entrar)
  // 5. Embarcações na Água (Galeões Mercantes, Escunas Costeiras e Barcos Pesqueiros com Velas, Mastros, Timão, Casco e Ondas)
  // 6. Monumento do Farol-Lanterna & Grande Âncora, Postes Navais, Cabeços de Amarração, Redes e Barris
  // =========================================================================

  function drawPortCityFloor(g, l, o, u, t, animTimer = 0) {
    const role = t.portCityRole || "boardwalk";
    const isAlt = (Math.abs(t.tx + t.ty) % 2) === 0;

    if (role === "pier" || role === "gangplank") {
      // Estacas submersas e sombra projetada na água rasa
      g.fillStyle = "rgba(12, 34, 63, 0.45)";
      g.fillRect(l + 1, o + u - 4, u - 2, 5);
      // Tábuas rústicas de madeira do píer sobre a água
      g.fillStyle = isAlt ? "#78350f" : "#713f12";
      g.fillRect(l, o, u + 0.8, u + 0.8);
      g.strokeStyle = "rgba(28, 25, 23, 0.65)";
      g.lineWidth = 1.1;
      for (let py = 4; py < u; py += 6) {
        g.beginPath();
        g.moveTo(l, o + py);
        g.lineTo(l + u, o + py);
        g.stroke();
      }
      // Vigas laterais e pregos de latão do píer
      g.fillStyle = "#451a03";
      g.fillRect(l, o, 3, u);
      g.fillRect(l + u - 3, o, 3, u);
      g.fillStyle = "#d97706";
      g.fillRect(l + 1, o + 4, 1.5, 1.5);
      g.fillRect(l + u - 2.5, o + 4, 1.5, 1.5);
      g.fillRect(l + 1, o + u - 6, 1.5, 1.5);
      g.fillRect(l + u - 2.5, o + u - 6, 1.5, 1.5);
      return;
    }

    if (role === "boat_deck" || role === "boat_center" || role === "boat_helm" || role === "boat_chest" || role === "boat_rail") {
      // Sombra suave sob o tile do navio na água; todo o casco curvo e tábuas do convés são desenhados em drawPortCityBoatStructure!
      g.fillStyle = "rgba(8, 25, 48, 0.22)";
      g.fillRect(l + 2, o + 2, u - 4, u - 4);
      return;
    }

    if (role === "floor" || role === "hammock" || role === "cargo" || role === "table" || role === "door") {
      // Piso interno das casas portuárias (assoalho naval claro e fresco)
      g.fillStyle = isAlt ? "#b45309" : "#a16207";
      g.fillRect(l, o, u + 0.8, u + 0.8);
      g.strokeStyle = "rgba(69, 26, 3, 0.45)";
      g.lineWidth = 1;
      g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
      return;
    }

    // Calçadão Portuário e Praça da Capitania (pedra calcária coralina clara e madeira)
    g.fillStyle = role === "plaza" ? (isAlt ? "#d6d3d1" : "#e7e5e4") : (isAlt ? "#c7b299" : "#d6c5b3");
    g.fillRect(l, o, u + 0.8, u + 0.8);
    g.strokeStyle = "rgba(87, 83, 78, 0.42)";
    g.lineWidth = 1.1;
    g.strokeRect(l + 1, o + 1, u - 2, u - 2);
    if (role === "plaza" && Math.abs(t.tx - (window.PortCity ? window.PortCity.centerX : -680)) <= 2 && Math.abs(t.ty - ((window.PortCity ? window.PortCity.centerY : 620) - 6)) <= 2) {
      // Rosa dos Ventos em mosaico náutico ao redor do Farol Central
      g.fillStyle = "rgba(2, 132, 199, 0.28)";
      g.fillRect(l + 3, o + 3, u - 6, u - 6);
      g.strokeStyle = "rgba(217, 119, 6, 0.65)";
      g.strokeRect(l + 4, o + 4, u - 8, u - 8);
    }
  }

  function drawPortCityWall(ctx, tileSize, subType = 0, neighbors = null) {
    const nL = !!(neighbors && neighbors.left);
    const nR = !!(neighbors && neighbors.right);
    const nB = !!(neighbors && neighbors.bottom);

    if (!drawPortCityWall._cache) {
      drawPortCityWall._cache = new Map();
    }
    const mask = (nL ? 1 : 0) | (nR ? 2 : 0) | (nB ? 4 : 0);
    const key = `${tileSize.toFixed(2)}_${subType}_${mask}`;
    let cached = drawPortCityWall._cache.get(key);

    if (!cached) {
      const padX = Math.ceil(24 * tileSize);
      const padTop = Math.ceil(16 * tileSize);
      const padBot = Math.ceil(30 * tileSize);
      const can = document.createElement("canvas");
      can.width = Math.max(1, padX * 2);
      can.height = Math.max(1, padTop + padBot);
      const wc = can.getContext("2d");

      if (wc) {
        wc.translate(padX, padTop);
        const half = 18 * tileSize;
        const leftX = nL ? -half - 1 * tileSize : -half + 1 * tileSize;
        const rightX = nR ? half + 1 * tileSize : half - 1 * tileSize;
        const w = rightX - leftX;
        const wallH = 26 * tileSize;
        const baseY = 18 * tileSize;
        const topFrontY = baseY - wallH;

        if (!nB) {
          wc.fillStyle = "rgba(45, 28, 12, 0.38)";
          wc.fillRect(leftX - 1 * tileSize, baseY - 2 * tileSize, w + 2 * tileSize, 7 * tileSize);
        }

        // Alvenaria colonial caiada (Branco Perolado, Creme Coralino ou Azul Celeste Costeiro)
        const wallGrad = wc.createLinearGradient(0, topFrontY, 0, baseY);
        if (subType % 3 === 1) {
          wallGrad.addColorStop(0, "#fef3c7");
          wallGrad.addColorStop(1, "#fde68a");
        } else if (subType % 3 === 2) {
          wallGrad.addColorStop(0, "#e0f2fe");
          wallGrad.addColorStop(1, "#bae6fd");
        } else {
          wallGrad.addColorStop(0, "#f8fafc");
          wallGrad.addColorStop(1, "#e2e8f0");
        }
        wc.fillStyle = wallGrad;
        wc.fillRect(leftX, topFrontY, w, wallH);

        // Barrado inferior de pedra coralina / azulejo marítimo e vigas de madeira tropical
        wc.fillStyle = "#0369a1";
        wc.fillRect(leftX, baseY - 6 * tileSize, w, 6 * tileSize);
        wc.fillStyle = "#78350f";
        wc.fillRect(leftX, topFrontY, w, 3 * tileSize);
        wc.fillRect(leftX, baseY - 2.5 * tileSize, w, 2.5 * tileSize);

        // Pilares verticais de madeira nas extremidades
        if (!nL) wc.fillRect(leftX, topFrontY, 3 * tileSize, wallH);
        if (!nR) wc.fillRect(rightX - 3 * tileSize, topFrontY, 3 * tileSize, wallH);

        // Topo da parede 2.5D
        wc.fillStyle = "#92400e";
        wc.fillRect(leftX, topFrontY - 2 * tileSize, w, 3 * tileSize);
        wc.strokeStyle = "#451a03";
        wc.lineWidth = 1.2 * tileSize;
        wc.strokeRect(leftX, topFrontY - 2 * tileSize, w, wallH + 2 * tileSize);
      }

      cached = { canvas: can, padX, padTop };
      drawPortCityWall._cache.set(key, cached);
    }

    ctx.drawImage(cached.canvas, -cached.padX, -cached.padTop);
  }

  function drawPortCityDoor(ctx, tileSize, isOpen = false) {
    ctx.save();
    const w = 18 * tileSize;
    const h = 26 * tileSize;
    const baseY = 16 * tileSize;
    const topY = baseY - h;

    // Batente colonial de madeira nobre e pedra
    ctx.fillStyle = "#451a03";
    ctx.fillRect(-w / 2 - 2, topY - 2, w + 4, h + 4);

    if (isOpen) {
      ctx.fillStyle = "#1e1b18";
      ctx.fillRect(-w / 2, topY, w, h);
      ctx.save();
      ctx.translate(-w / 2 + 2, baseY - 2);
      ctx.rotate(-0.82);
      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, -h + 2, 6 * tileSize, h - 2);
      ctx.restore();
    } else {
      ctx.fillStyle = "#92400e";
      ctx.fillRect(-w / 2, topY, w, h);
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-w / 2, topY, w, h);
      // Vigia redonda de navio em latão e vidro azul-marinho no topo da porta
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, topY + h * 0.34, 4.2 * tileSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.8 * tileSize;
      ctx.stroke();
      // Maçaneta de latão
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(w / 2 - 4 * tileSize, topY + h * 0.58, 1.8 * tileSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPortCityHammock(ctx, tileSize) {
    ctx.save();
    // Rede tropical / leito naval com listras azuis e brancas
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.beginPath();
    ctx.ellipse(0, 4 * tileSize, 13 * tileSize, 6 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2 * tileSize;
    ctx.beginPath();
    ctx.moveTo(-14 * tileSize, -6 * tileSize);
    ctx.lineTo(-10 * tileSize, -2 * tileSize);
    ctx.moveTo(14 * tileSize, -6 * tileSize);
    ctx.lineTo(10 * tileSize, -2 * tileSize);
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.ellipse(0, -1 * tileSize, 11 * tileSize, 5.5 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 1.6 * tileSize;
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(-6 * tileSize, -4 * tileSize, 3 * tileSize, 6 * tileSize);
    ctx.fillRect(3 * tileSize, -4 * tileSize, 3 * tileSize, 6 * tileSize);
    ctx.restore();
  }

  function drawPortCityCargo(ctx, tileSize, subType = 0) {
    ctx.save();
    // Caixote de madeira naval e barril de carvalho com aros de ferro
    ctx.fillStyle = "rgba(15, 23, 42, 0.38)";
    ctx.beginPath();
    ctx.ellipse(0, 5 * tileSize, 14 * tileSize, 7 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Caixote naval
    ctx.fillStyle = "#92400e";
    ctx.fillRect(-12 * tileSize, -9 * tileSize, 13 * tileSize, 13 * tileSize);
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 1.3 * tileSize;
    ctx.strokeRect(-12 * tileSize, -9 * tileSize, 13 * tileSize, 13 * tileSize);
    ctx.beginPath();
    ctx.moveTo(-12 * tileSize, -9 * tileSize);
    ctx.lineTo(1 * tileSize, 4 * tileSize);
    ctx.stroke();

    // Barril de rum / água doce ao lado
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.ellipse(6 * tileSize, -1 * tileSize, 6.5 * tileSize, 8 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.6 * tileSize;
    ctx.beginPath();
    ctx.moveTo(0, -4 * tileSize);
    ctx.lineTo(12 * tileSize, -4 * tileSize);
    ctx.moveTo(0, 2 * tileSize);
    ctx.lineTo(12 * tileSize, 2 * tileSize);
    ctx.stroke();

    if (subType % 2 === 0) {
      // Rede de pesca e boia azul-turquesa
      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.arc(-5 * tileSize, 6 * tileSize, 3 * tileSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPortCityTable(ctx, tileSize) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    ctx.fillRect(-13 * tileSize, -5 * tileSize, 26 * tileSize, 15 * tileSize);
    ctx.fillStyle = "#78350f";
    ctx.fillRect(-14 * tileSize, -9 * tileSize, 28 * tileSize, 14 * tileSize);
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 1.4 * tileSize;
    ctx.strokeRect(-14 * tileSize, -9 * tileSize, 28 * tileSize, 14 * tileSize);
    // Mapa náutico aberto sobre a mesa e bússola dourada
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(-7 * tileSize, -6 * tileSize, 12 * tileSize, 8 * tileSize);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(8 * tileSize, -2 * tileSize, 2.5 * tileSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPortCityMonument(ctx, tileSize, animTimer = 0) {
    ctx.save();
    // Base octogonal de pedra coralina e bronze
    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    ctx.beginPath();
    ctx.ellipse(0, 6 * tileSize, 24 * tileSize, 12 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.ellipse(0, 2 * tileSize, 20 * tileSize, 10 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2 * tileSize;
    ctx.stroke();

    // Torre do Farol Portuário (listrada de branco e vermelho-coral)
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(-9 * tileSize, 2 * tileSize);
    ctx.lineTo(-6 * tileSize, -38 * tileSize);
    ctx.lineTo(6 * tileSize, -38 * tileSize);
    ctx.lineTo(9 * tileSize, 2 * tileSize);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-8 * tileSize, -14 * tileSize, 16 * tileSize, 8 * tileSize);
    ctx.fillRect(-7 * tileSize, -30 * tileSize, 14 * tileSize, 8 * tileSize);

    // Cúpula e Lanterna Giratória do Farol
    const pulse = (Math.sin(animTimer * 5) + 1) * 0.5;
    ctx.fillStyle = `rgba(254, 240, 138, ${0.75 + pulse * 0.25})`;
    ctx.beginPath();
    ctx.arc(0, -43 * tileSize, 7.5 * tileSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(-8 * tileSize, -46 * tileSize);
    ctx.lineTo(0, -55 * tileSize);
    ctx.lineTo(8 * tileSize, -46 * tileSize);
    ctx.closePath();
    ctx.fill();

    // Grande Âncora Naval de Bronze apoiada na frente do Farol
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 3 * tileSize;
    ctx.beginPath();
    ctx.moveTo(0, -10 * tileSize);
    ctx.lineTo(0, 5 * tileSize);
    ctx.moveTo(-7 * tileSize, -5 * tileSize);
    ctx.lineTo(7 * tileSize, -5 * tileSize);
    ctx.arc(0, 1 * tileSize, 8 * tileSize, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    ctx.restore();
  }

  function drawPortCityLamppost(ctx, tileSize, animTimer = 0) {
    ctx.save();
    ctx.fillStyle = "#451a03";
    ctx.fillRect(-2 * tileSize, -28 * tileSize, 4 * tileSize, 30 * tileSize);
    ctx.fillRect(-2 * tileSize, -28 * tileSize, 10 * tileSize, 2.5 * tileSize);
    const glow = (Math.sin(animTimer * 6) + 1) * 0.5;
    ctx.fillStyle = `rgba(251, 191, 36, ${0.8 + glow * 0.2})`;
    ctx.beginPath();
    ctx.arc(6 * tileSize, -23 * tileSize, 3.8 * tileSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.2 * tileSize;
    ctx.stroke();
    ctx.restore();
  }

  function drawPortCityBollard(ctx, tileSize) {
    ctx.save();
    // Cabeço de amarração com corda naval enrolada
    ctx.fillStyle = "#292524";
    ctx.fillRect(-3.5 * tileSize, -8 * tileSize, 7 * tileSize, 10 * tileSize);
    ctx.fillStyle = "#44403c";
    ctx.beginPath();
    ctx.ellipse(0, -8 * tileSize, 4.5 * tileSize, 2.2 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2 * tileSize;
    ctx.beginPath();
    ctx.moveTo(-4 * tileSize, -4 * tileSize);
    ctx.lineTo(4 * tileSize, -3 * tileSize);
    ctx.moveTo(-4 * tileSize, -1.5 * tileSize);
    ctx.lineTo(4 * tileSize, -0.5 * tileSize);
    ctx.stroke();
    ctx.restore();
  }

  function drawPortCityBoatHelm(ctx, tileSize) {
    ctx.save();
    // Pedestal de carvalho e Roda de Timão Naval com bússola dourada
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    ctx.beginPath();
    ctx.ellipse(0, 2 * tileSize, 8 * tileSize, 4 * tileSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#451a03";
    ctx.fillRect(-3.2 * tileSize, -13 * tileSize, 6.4 * tileSize, 15 * tileSize);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-3.6 * tileSize, -14 * tileSize, 7.2 * tileSize, 2.2 * tileSize);

    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2.2 * tileSize;
    ctx.beginPath();
    ctx.arc(0, -11 * tileSize, 7.5 * tileSize, 0, Math.PI * 2);
    ctx.stroke();
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(0, -11 * tileSize);
      ctx.lineTo(Math.cos(a) * 9.8 * tileSize, -11 * tileSize + Math.sin(a) * 9.8 * tileSize);
      ctx.stroke();
    }
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, -11 * tileSize, 2.4 * tileSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Traça o contorno hidrodinâmico de um casco de navio (proa pontiaguda em +L e popa arredondada em -L no eixo X local)
  function _traceShipHullContour(ctx, L, B, scale = 1.0) {
    const l = L * scale;
    const b = B * scale;
    const sternX = -l * 0.94;
    const sternTransomY = b * 0.56;
    const sternQuarterX = -l * 0.62;
    const midSternX = -l * 0.18;
    const shoulderX = l * 0.38;
    const bowTipX = l * 1.04;

    ctx.beginPath();
    // Bico da proa (afilado)
    ctx.moveTo(bowTipX, 0);
    // Bochecha e costado de boreste (inferior/direito)
    ctx.bezierCurveTo(l * 0.84, b * 0.54, shoulderX, b * 0.98, midSternX, b);
    // Alheta até o painel de popa
    ctx.bezierCurveTo(sternQuarterX, b * 0.96, sternX, b * 0.82, sternX, sternTransomY);
    // Espelho de popa levemente arqueado
    ctx.quadraticCurveTo(-l * 1.01, 0, sternX, -sternTransomY);
    // Alheta e costado de bombordo (superior/esquerdo)
    ctx.bezierCurveTo(sternX, -b * 0.82, sternQuarterX, -b * 0.96, midSternX, -b);
    ctx.bezierCurveTo(shoulderX, -b * 0.98, l * 0.84, -b * 0.54, bowTipX, 0);
    ctx.closePath();
  }

  // Renderiza o Casco Curvo 2.5D, Castelo de Popa, Castelo de Proa, Canhões, Escotilhas, Enxárcias e Velas Enfunadas!
  function drawPortCityBoatStructure(ctx, tileSize, boatSpec, animTimer = 0) {
    if (!boatSpec) return;
    ctx.save();

    const isHoriz = boatSpec.orientation === "horizontal";
    const isGalleon = boatSpec.boatType === "galleon";
    const isSchooner = boatSpec.boatType === "schooner";
    const boatId = boatSpec.id || 1;
    const sway = Math.sin(animTimer * 2.1 + boatId * 1.7) * 2.4 * tileSize;
    const waveBob = Math.cos(animTimer * 2.5 + boatId * 1.3) * 1.6 * tileSize;
    ctx.translate(0, waveBob);

    // Semidimensões reais do navio: L = metade do comprimento (proa-popa), B = metade da boca (largura)
    const L = ((isHoriz ? boatSpec.halfW : boatSpec.halfH) + 0.58) * 36 * tileSize;
    const B = ((isHoriz ? boatSpec.halfH : boatSpec.halfW) + 0.52) * 36 * tileSize;

    // Ângulo de direção da proa no mundo:
    //  0 = Leste (+X), PI = Oeste (-X), PI/2 = Sul (+Y), -PI/2 = Norte (-Y)
    let rotAngle = 0;
    if (isHoriz) {
      rotAngle = boatSpec.facingDir === "west" ? Math.PI : 0;
    } else {
      rotAngle = boatSpec.facingDir === "north" ? -Math.PI / 2 : Math.PI / 2;
    }

    const hullColors = [
      { hullDark: "#2d1204", hullMid: "#451a03", rail: "#5c2408", trim: "#f59e0b", deckA: "#9a5219", deckB: "#854210", cabin: "#5c2408" },
      { hullDark: "#1f1209", hullMid: "#3b1d0a", rail: "#4a2511", trim: "#38bdf8", deckA: "#a16223", deckB: "#8c5119", cabin: "#43200d" },
      { hullDark: "#311010", hullMid: "#4c1d1d", rail: "#691e1e", trim: "#facc15", deckA: "#924817", deckB: "#7c3a11", cabin: "#581818" },
    ];
    const hc = hullColors[(boatSpec.hullStyle || 0) % hullColors.length];

    const sailPalettes = [
      { main: "#fef3c7", shade: "#fde68a", stripe: "#dc2626", emblem: "#b91c1c" }, // Vela Real com listras escarlates
      { main: "#f8fafc", shade: "#e2e8f0", stripe: "#0284c7", emblem: "#0369a1" }, // Vela Alva com listras azul-oceano
      { main: "#fef9c3", shade: "#fef08a", stripe: "#d97706", emblem: "#b45309" }, // Vela Solar Dourada
      { main: "#f1f5f9", shade: "#cbd5e1", stripe: "#15803d", emblem: "#166534" }, // Vela Tropical Esmeralda
      { main: "#ffedd5", shade: "#fed7aa", stripe: "#9a3412", emblem: "#7c2d12" }, // Vela Mercante Terracota
    ];
    const sp = sailPalettes[(boatSpec.sailColorIdx || 0) % sailPalettes.length];

    // =========================================================================
    // PARTE 1: DESENHO DO CASCO HIDRODINÂMICO E CONVÉS (NO ESPAÇO ROTACIONADO DO NAVIO)
    // =========================================================================
    ctx.save();
    ctx.rotate(rotAngle);

    // 1.1. Sombra profunda submersa e ondas de espuma branca ao redor da linha d'água curva
    const ripple = (Math.sin(animTimer * 3.1 + boatId) + 1) * 0.5;
    ctx.save();
    ctx.translate(-2 * tileSize, 5 * tileSize);
    _traceShipHullContour(ctx, L * 1.04, B * 1.08, 1.0);
    ctx.fillStyle = "rgba(3, 15, 35, 0.48)";
    ctx.fill();
    ctx.restore();

    _traceShipHullContour(ctx, L + 7 * tileSize, B + 6 * tileSize, 1.0);
    ctx.strokeStyle = `rgba(224, 242, 254, ${0.42 + ripple * 0.28})`;
    ctx.lineWidth = 2.4 * tileSize;
    ctx.stroke();

    // Bigode de espuma cortando a água no bico da proa
    ctx.strokeStyle = `rgba(240, 249, 255, ${0.55 + ripple * 0.3})`;
    ctx.lineWidth = 2 * tileSize;
    ctx.beginPath();
    ctx.moveTo(L * 1.08, 0);
    ctx.quadraticCurveTo(L * 0.85, B * 0.72, L * 0.45, B * 1.18 + ripple * 4 * tileSize);
    ctx.moveTo(L * 1.08, 0);
    ctx.quadraticCurveTo(L * 0.85, -B * 0.72, L * 0.45, -B * 1.18 - ripple * 4 * tileSize);
    ctx.stroke();

    // 1.2. Costado externo de madeira naval calafetada (volume 2.5D da quilha até a amurada)
    _traceShipHullContour(ctx, L, B, 1.0);
    ctx.fillStyle = hc.hullDark;
    ctx.fill();
    ctx.lineWidth = 2.5 * tileSize;
    ctx.strokeStyle = "#1c0a02";
    ctx.stroke();

    _traceShipHullContour(ctx, L, B, 0.95);
    ctx.fillStyle = hc.hullMid;
    ctx.fill();

    // 1.3. Convés Principal recortado pelo contorno curvo do casco (tábuas longitudinais calafetadas)
    ctx.save();
    _traceShipHullContour(ctx, L, B, 0.86);
    ctx.clip();

    const deckGrad = ctx.createLinearGradient(-L, -B, L, B);
    deckGrad.addColorStop(0, hc.deckB);
    deckGrad.addColorStop(0.5, hc.deckA);
    deckGrad.addColorStop(1, hc.deckB);
    ctx.fillStyle = deckGrad;
    ctx.fillRect(-L * 1.1, -B * 1.1, L * 2.2, B * 2.2);

    // Linhas de calafetação das tábuas do convés (acompanhando o sentido proa-popa)
    ctx.strokeStyle = "rgba(28, 16, 8, 0.48)";
    ctx.lineWidth = 1.1 * tileSize;
    const plankStep = 5.5 * tileSize;
    for (let py = -B; py <= B; py += plankStep) {
      ctx.beginPath();
      ctx.moveTo(-L, py);
      ctx.lineTo(L, py);
      ctx.stroke();
    }
    // Juntas transversais alternadas das tábuas
    ctx.strokeStyle = "rgba(28, 16, 8, 0.32)";
    for (let px = -L * 0.8; px <= L * 0.8; px += 22 * tileSize) {
      ctx.beginPath();
      ctx.moveTo(px, -B);
      ctx.lineTo(px, B);
      ctx.stroke();
    }

    // 1.4. Castelo de Popa Elevado (Tombadilho do Capitão na traseira -X) e Castelo de Proa (+X)
    if (isGalleon || isSchooner) {
      const poopEndX = isGalleon ? -L * 0.38 : -L * 0.46;
      // Sombra do degrau do Castelo de Popa sobre o convés principal
      ctx.fillStyle = "rgba(15, 23, 42, 0.38)";
      ctx.fillRect(poopEndX, -B, 7 * tileSize, B * 2);

      // Piso mais nobre do Castelo de Popa
      ctx.fillStyle = hc.cabin;
      ctx.fillRect(-L * 1.05, -B, L * 1.05 + poopEndX, B * 2);
      ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
      ctx.lineWidth = 1.2 * tileSize;
      for (let py = -B; py <= B; py += plankStep) {
        ctx.beginPath();
        ctx.moveTo(-L, py);
        ctx.lineTo(poopEndX, py);
        ctx.stroke();
      }

      // Balaustrada ornamentada na frente do Castelo de Popa com escadas laterais
      ctx.fillStyle = hc.hullDark;
      ctx.fillRect(poopEndX - 2.5 * tileSize, -B, 4 * tileSize, B * 2);
      ctx.fillStyle = hc.trim;
      ctx.fillRect(poopEndX - 1.5 * tileSize, -B, 2 * tileSize, B * 2);

      // Escadinhas de acesso ao tombadilho da popa
      const stairW = 9 * tileSize;
      const stairH = 10 * tileSize;
      ctx.fillStyle = "#b45309";
      ctx.fillRect(poopEndX - 2 * tileSize, -B * 0.55 - stairH / 2, stairW, stairH);
      ctx.fillRect(poopEndX - 2 * tileSize, B * 0.55 - stairH / 2, stairW, stairH);

      // Castelo de Proa elevado (+X)
      const foreStartX = isGalleon ? L * 0.52 : L * 0.58;
      ctx.fillStyle = "rgba(15, 23, 42, 0.32)";
      ctx.fillRect(foreStartX - 5 * tileSize, -B, 5 * tileSize, B * 2);
      ctx.fillStyle = hc.cabin;
      ctx.fillRect(foreStartX, -B, L - foreStartX, B * 2);
      ctx.fillStyle = hc.trim;
      ctx.fillRect(foreStartX - 1.5 * tileSize, -B, 2.2 * tileSize, B * 2);
    } else {
      // Bancos transversais de madeira nos barcos pesqueiros / saveiros
      ctx.fillStyle = hc.rail;
      for (const bx of [-L * 0.48, 0, L * 0.42]) {
        ctx.fillRect(bx - 3.5 * tileSize, -B * 0.85, 7 * tileSize, B * 1.7);
        ctx.strokeStyle = "#1c0a02";
        ctx.lineWidth = 1 * tileSize;
        ctx.strokeRect(bx - 3.5 * tileSize, -B * 0.85, 7 * tileSize, B * 1.7);
      }
    }

    // 1.5. Escotilha de Carga com Grelha de Carvalho no meio do convés
    if (isGalleon || isSchooner) {
      const hatchX = isGalleon ? -18 * tileSize : -4 * tileSize;
      const hatchW = (isGalleon ? 26 : 18) * tileSize;
      const hatchH = (isGalleon ? 24 : 16) * tileSize;
      ctx.fillStyle = "#1e1b18";
      ctx.fillRect(hatchX - hatchW / 2, -hatchH / 2, hatchW, hatchH);
      ctx.strokeStyle = hc.hullDark;
      ctx.lineWidth = 2.6 * tileSize;
      ctx.strokeRect(hatchX - hatchW / 2, -hatchH / 2, hatchW, hatchH);
      // Grelha xadrez de madeira da escotilha
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.4 * tileSize;
      for (let gx = -hatchW / 2 + 4 * tileSize; gx < hatchW / 2; gx += 4.5 * tileSize) {
        ctx.beginPath();
        ctx.moveTo(hatchX + gx, -hatchH / 2 + 2 * tileSize);
        ctx.lineTo(hatchX + gx, hatchH / 2 - 2 * tileSize);
        ctx.stroke();
      }
      for (let gy = -hatchH / 2 + 4 * tileSize; gy < hatchH / 2; gy += 4.5 * tileSize) {
        ctx.beginPath();
        ctx.moveTo(hatchX - hatchW / 2 + 2 * tileSize, gy);
        ctx.lineTo(hatchX + hatchW / 2 - 2 * tileSize, gy);
        ctx.stroke();
      }
      ctx.strokeStyle = hc.trim;
      ctx.lineWidth = 1.1 * tileSize;
      ctx.strokeRect(hatchX - hatchW / 2 + 1.5 * tileSize, -hatchH / 2 + 1.5 * tileSize, hatchW - 3 * tileSize, hatchH - 3 * tileSize);
    }

    ctx.restore(); // Fim do clip do convés

    // 1.6. Amurada Naval Curva (Parapeito de madeira nobre e friso metálico dourado/azul ao redor de todo o casco)
    _traceShipHullContour(ctx, L, B, 0.90);
    ctx.strokeStyle = hc.rail;
    ctx.lineWidth = 5 * tileSize;
    ctx.stroke();

    _traceShipHullContour(ctx, L, B, 0.92);
    ctx.strokeStyle = hc.trim;
    ctx.lineWidth = 1.8 * tileSize;
    ctx.stroke();

    // 1.7. Canhões Navais nas Bordiadas (para Galeões e Escunas) ou Remos (para Barcos Pesqueiros)
    if (isGalleon || isSchooner) {
      const cannonXs = isGalleon
        ? [-L * 0.24, -L * 0.04, L * 0.16, L * 0.36]
        : [-L * 0.16, L * 0.16];
      for (let c = 0; c < cannonXs.length; c++) {
        const cx = cannonXs[c];
        const ratioX = Math.abs(cx) / L;
        const sideY = B * (0.91 - ratioX * ratioX * 0.18);
        for (const side of [-1, 1]) {
          // Carreta de madeira do canhão
          ctx.fillStyle = "#78350f";
          ctx.fillRect(cx - 4 * tileSize, side * (sideY - 7 * tileSize) - 3 * tileSize, 8 * tileSize, 6 * tileSize);
          // Cano de ferro fundido apontando para fora da amurada
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.roundRect(
            cx - 2.4 * tileSize,
            side > 0 ? sideY - 6 * tileSize : -sideY - 5 * tileSize,
            4.8 * tileSize,
            11 * tileSize,
            1.5 * tileSize
          );
          ctx.fill();
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 0.9 * tileSize;
          ctx.stroke();
        }
      }
    } else {
      // Par de remos de madeira apoiados nas bordas do barco pesqueiro
      ctx.strokeStyle = "#a16207";
      ctx.lineWidth = 2.2 * tileSize;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-4 * tileSize, side * B * 0.72);
        ctx.lineTo(-14 * tileSize, side * (B + 14 * tileSize));
        ctx.stroke();
        ctx.fillStyle = "#ca8a04";
        ctx.beginPath();
        ctx.ellipse(-15 * tileSize, side * (B + 15 * tileSize), 4.5 * tileSize, 2.2 * tileSize, side * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 1.8. Galeria de Popa com Janelas Iluminadas e Lanterna Naval Real (na extremidade -X)
    if (isGalleon || isSchooner) {
      const sternX = -L * 0.95;
      // Janelas de cristal dourado da cabine do capitão na popa
      const winCount = isGalleon ? 3 : 2;
      const winSpan = B * 0.36;
      ctx.fillStyle = "#fef08a";
      ctx.strokeStyle = hc.trim;
      ctx.lineWidth = 1.4 * tileSize;
      for (let w = 0; w < winCount; w++) {
        const wy = (w - (winCount - 1) / 2) * winSpan;
        ctx.beginPath();
        ctx.arc(sternX + 2 * tileSize, wy, 3.2 * tileSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Grande Fanais / Lanterna de Popa em ouro e vidro âmbar
      const lanternPulse = (Math.sin(animTimer * 5 + boatId) + 1) * 0.5;
      ctx.fillStyle = `rgba(251, 191, 36, ${0.82 + lanternPulse * 0.18})`;
      ctx.beginPath();
      ctx.arc(sternX - 4 * tileSize, 0, 5.2 * tileSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.8 * tileSize;
      ctx.stroke();
    }

    // 1.9. Gurupés (Mastro de Proa Inclinado), Carranca Dourada e Cabos de Estai (na extremidade +X)
    const bowTipX = L * 1.02;
    const bowspritLen = (isGalleon ? 38 : isSchooner ? 28 : 16) * tileSize;
    // Cabos de amarração do gurupés até a amurada de proa
    ctx.strokeStyle = "rgba(214, 211, 209, 0.7)";
    ctx.lineWidth = 1.1 * tileSize;
    ctx.beginPath();
    ctx.moveTo(bowTipX + bowspritLen * 0.85, 0);
    ctx.lineTo(L * 0.72, B * 0.48);
    ctx.moveTo(bowTipX + bowspritLen * 0.85, 0);
    ctx.lineTo(L * 0.72, -B * 0.48);
    ctx.stroke();

    // Mastro do Gurupés projetando-se da proa afilada
    ctx.strokeStyle = "#5c2408";
    ctx.lineWidth = (isGalleon ? 4.8 : 3.6) * tileSize;
    ctx.beginPath();
    ctx.moveTo(L * 0.76, 0);
    ctx.lineTo(bowTipX + bowspritLen, 0);
    ctx.stroke();
    // Ponteira e figura de proa (carranca dourada)
    ctx.fillStyle = hc.trim;
    ctx.beginPath();
    ctx.arc(bowTipX + 2 * tileSize, 0, (isGalleon ? 4.2 : 3.0) * tileSize, 0, Math.PI * 2);
    ctx.fill();

    // Pequena vela cevadeira / bujarrona na proa para Galeões e Escunas
    if (isGalleon || isSchooner) {
      ctx.fillStyle = sp.main;
      ctx.beginPath();
      ctx.moveTo(bowTipX + bowspritLen * 0.92, 0);
      ctx.quadraticCurveTo(bowTipX + bowspritLen * 0.45, B * 0.28 + sway * 0.2, L * 0.82, B * 0.12);
      ctx.quadraticCurveTo(bowTipX + bowspritLen * 0.35, -B * 0.18, bowTipX + bowspritLen * 0.92, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1 * tileSize;
      ctx.stroke();
    }

    ctx.restore(); // Fim do espaço rotacionado do casco

    // =========================================================================
    // PARTE 2: MASTROS 2.5D, ENXÁRCIAS (ESCADAS DE CORDA), VERGAS E VELAS ENFUNADAS
    // =========================================================================
    const cosA = Math.cos(rotAngle);
    const sinA = Math.sin(rotAngle);

    // Posições dos mastros ao longo do eixo longitudinal do navio (de popa -L para proa +L)
    const mastConfigs = isGalleon
      ? [
          { along: -L * 0.48, s: 0.86, name: "mizzen" }, // Mastro da Mezena (Popa)
          { along: -L * 0.02, s: 1.18, name: "main" },   // Mastro Grande Central
          { along: L * 0.44, s: 0.94, name: "fore" },    // Mastro do Traquete (Proa)
        ]
      : isSchooner
        ? [
            { along: -L * 0.30, s: 1.02, name: "main" },
            { along: L * 0.30, s: 0.90, name: "fore" },
          ]
        : [{ along: L * 0.05, s: 0.84, name: "single" }];

    // Ordena os mastros pelo Y de tela para que o mais ao sul sobreponha corretamente o mais ao norte em 2.5D
    const sortedMasts = mastConfigs
      .map((mc, idx) => ({
        ...mc,
        idx,
        mx: mc.along * cosA,
        my: mc.along * sinA,
        portX: mc.along * cosA - (-B * 0.78) * sinA,
        portY: mc.along * sinA + (-B * 0.78) * cosA,
        starX: mc.along * cosA - (B * 0.78) * sinA,
        starY: mc.along * sinA + (B * 0.78) * cosA,
      }))
      .sort((a, b) => a.my - b.my);

    // Cabos de estai longitudinais ligando o topo dos mastros entre si e ao gurupés
    if (sortedMasts.length > 1) {
      ctx.strokeStyle = "rgba(231, 229, 228, 0.55)";
      ctx.lineWidth = 1.1 * tileSize;
      ctx.beginPath();
      for (let i = 0; i < mastConfigs.length - 1; i++) {
        const m1 = mastConfigs[i];
        const m2 = mastConfigs[i + 1];
        const x1 = m1.along * cosA;
        const y1 = m1.along * sinA - 58 * tileSize * m1.s;
        const x2 = m2.along * cosA;
        const y2 = m2.along * sinA - 58 * tileSize * m2.s;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }

    for (let m = 0; m < sortedMasts.length; m++) {
      const mp = sortedMasts[m];
      const ms = mp.s;
      const mx = mp.mx;
      const my = mp.my;
      const mastHeight = 62 * tileSize * ms;
      const mastTopY = my - mastHeight;

      // 2.1. Sombra projetada pelo velame sobre o convés
      ctx.fillStyle = "rgba(15, 23, 42, 0.24)";
      ctx.beginPath();
      ctx.ellipse(mx + 6 * tileSize, my + 5 * tileSize, 26 * tileSize * ms, 13 * tileSize * ms, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2.2. Enxárcias (Escadas de corda laterais das bordas do casco até o cesto da gávea)
      const topRigY = mastTopY + 14 * tileSize * ms;
      ctx.strokeStyle = "rgba(120, 53, 15, 0.72)";
      ctx.lineWidth = 1.1 * tileSize;
      for (const sidePt of [
        { x: mp.portX, y: mp.portY },
        { x: mp.starX, y: mp.starY },
      ]) {
        ctx.beginPath();
        ctx.moveTo(sidePt.x - 4 * tileSize, sidePt.y);
        ctx.lineTo(mx, topRigY);
        ctx.moveTo(sidePt.x + 4 * tileSize, sidePt.y);
        ctx.lineTo(mx, topRigY);
        ctx.stroke();
      }

      // 2.3. Base reforçada e Coluna do Mastro Real em 2.5D
      ctx.fillStyle = "#2d1204";
      ctx.beginPath();
      ctx.arc(mx, my, 6.2 * tileSize * ms, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hc.trim;
      ctx.lineWidth = 1.3 * tileSize;
      ctx.stroke();

      ctx.fillStyle = "#5c2408";
      ctx.fillRect(mx - 3 * tileSize * ms, mastTopY, 6 * tileSize * ms, mastHeight);
      ctx.fillStyle = "#92400e";
      ctx.fillRect(mx - 1.2 * tileSize * ms, mastTopY, 2.2 * tileSize * ms, mastHeight);

      // Cesto da Gávea (Plataforma de vigia no alto do mastro principal)
      if (isGalleon || (isSchooner && mp.name === "main")) {
        ctx.fillStyle = "#451a03";
        ctx.beginPath();
        ctx.ellipse(mx, topRigY, 8.5 * tileSize * ms, 4.2 * tileSize * ms, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hc.trim;
        ctx.lineWidth = 1.2 * tileSize;
        ctx.stroke();
      }

      // 2.4. Vela Principal e Vela de Gávea Superior (infladas com curvatura realista)
      const sailW = 50 * tileSize * ms;
      const sailH = 34 * tileSize * ms;
      const sailTop = mastTopY + 13 * tileSize * ms;
      const billow = 8.5 * tileSize * ms + sway * 0.4;

      const sailGrad = ctx.createLinearGradient(mx - sailW / 2, sailTop, mx + sailW / 2, sailTop + sailH);
      sailGrad.addColorStop(0, sp.main);
      sailGrad.addColorStop(0.65, sp.main);
      sailGrad.addColorStop(1, sp.shade);

      ctx.fillStyle = sailGrad;
      ctx.beginPath();
      ctx.moveTo(mx - sailW / 2, sailTop);
      ctx.quadraticCurveTo(mx, sailTop - 3.5 * tileSize, mx + sailW / 2, sailTop);
      ctx.quadraticCurveTo(mx + sailW / 2 + billow * 0.45, sailTop + sailH * 0.5, mx + sailW * 0.45, sailTop + sailH);
      ctx.quadraticCurveTo(mx, sailTop + sailH + billow, mx - sailW * 0.45, sailTop + sailH);
      ctx.quadraticCurveTo(mx - sailW / 2 - billow * 0.2, sailTop + sailH * 0.5, mx - sailW / 2, sailTop);
      ctx.closePath();
      ctx.fill();

      // Listras verticais heráldicas da vela acompanhando a curvatura
      ctx.save();
      ctx.clip();
      ctx.fillStyle = sp.stripe;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(mx - sailW * 0.30, sailTop - 4 * tileSize, sailW * 0.13, sailH + 16 * tileSize);
      ctx.fillRect(mx + sailW * 0.17, sailTop - 4 * tileSize, sailW * 0.13, sailH + 16 * tileSize);

      // Emblema náutico / Rosa dos Ventos no centro da vela principal do Galeão
      if (isGalleon && mp.name === "main") {
        ctx.fillStyle = sp.emblem;
        ctx.globalAlpha = 0.9;
        const cx = mx + billow * 0.12;
        const cy = sailTop + sailH * 0.52;
        const r = 7.5 * tileSize * ms;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.35, cy - r * 0.35);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx + r * 0.35, cy + r * 0.35);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r * 0.35, cy + r * 0.35);
        ctx.lineTo(cx - r, cy);
        ctx.lineTo(cx - r * 0.35, cy - r * 0.35);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Contorno de costura reforçada da vela
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.5 * tileSize;
      ctx.stroke();

      // Verga de madeira superior e inferior
      ctx.fillStyle = "#3b1d0a";
      ctx.fillRect(mx - sailW * 0.55, sailTop - 2.2 * tileSize, sailW * 1.1, 3.8 * tileSize);
      ctx.fillStyle = hc.trim;
      ctx.fillRect(mx - 4 * tileSize, sailTop - 2.4 * tileSize, 8 * tileSize, 4.2 * tileSize);

      // Flâmula Real longa tremulando no topo do mastro
      const flagWave1 = Math.sin(animTimer * 6.2 + mp.idx) * 3.5 * tileSize;
      const flagWave2 = Math.cos(animTimer * 5.4 + mp.idx) * 4.5 * tileSize;
      ctx.fillStyle = sp.stripe;
      ctx.beginPath();
      ctx.moveTo(mx, mastTopY);
      ctx.quadraticCurveTo(
        mx + 11 * tileSize * ms,
        mastTopY + 1 * tileSize + flagWave1,
        mx + 22 * tileSize * ms,
        mastTopY + 3.5 * tileSize + flagWave2
      );
      ctx.lineTo(mx + 18 * tileSize * ms, mastTopY + 6 * tileSize * ms + flagWave1);
      ctx.lineTo(mx, mastTopY + 8 * tileSize * ms);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // Telhados 2.5D das Casas da Cidade Portuária (desaparecem quando o jogador entra na casa)
  function drawPortCityHouseRoofs(ctx, tileSize, playerX, playerY, viewLeft, viewRight, viewTop, viewBottom, animTimer = 0) {
    if (typeof window === "undefined" || !window.PortCity || !window.PortCity.houses) return;

    const city = window.PortCity;
    const houses = city.houses;
    const activeHouseId = city.getActiveHouseForPlayer
      ? city.getActiveHouseForPlayer(playerX, playerY, tileSize)
      : null;

    if (!window.__portRoofAlphaMap) {
      window.__portRoofAlphaMap = {};
    }
    const alphaMap = window.__portRoofAlphaMap;

    for (let i = 0; i < houses.length; i++) {
      const h = houses[i];
      const minTileX = h.cx - h.halfW;
      const maxTileX = h.cx + h.halfW;
      const minTileY = h.cy - h.halfH;
      const maxTileY = h.cy + h.halfH;

      const houseLeftPx = minTileX * tileSize;
      const houseRightPx = (maxTileX + 1) * tileSize;
      const houseTopPx = minTileY * tileSize;
      const houseBottomPx = (maxTileY + 1) * tileSize;

      if (
        houseRightPx + tileSize < viewLeft ||
        houseLeftPx - tileSize > viewRight ||
        houseBottomPx + tileSize < viewTop ||
        houseTopPx - tileSize > viewBottom
      ) {
        continue;
      }

      const isInside = activeHouseId === h.id;
      const targetAlpha = isInside ? 0 : 1;
      const prevAlpha = alphaMap[h.id] !== undefined ? alphaMap[h.id] : targetAlpha;
      const nextAlpha =
        Math.abs(prevAlpha - targetAlpha) < 0.08
          ? targetAlpha
          : prevAlpha + (targetAlpha - prevAlpha) * 0.28;
      alphaMap[h.id] = nextAlpha;

      if (nextAlpha <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = nextAlpha;

      const overhangX = 4;
      const roofLeft = houseLeftPx - overhangX;
      const roofRight = houseRightPx + overhangX;
      const roofW = roofRight - roofLeft;
      const roofTop = houseTopPx - tileSize * 0.68;
      const roofBottom = houseBottomPx - tileSize * 0.72;
      const roofH = roofBottom - roofTop;
      const ridgeY = roofTop + roofH * 0.48;

      // Sombra projetada pelo beiral colonial
      ctx.fillStyle = "rgba(15, 23, 42, 0.36)";
      ctx.beginPath();
      ctx.roundRect(roofLeft + 3, roofBottom - 2, roofW - 6, 12, 4);
      ctx.fill();

      // Paleta de telha colonial terracota, azul-marítimo ou palha tropical trançada
      const rStyle = (h.roofStyle || 0) % 3;
      const northCol = rStyle === 0 ? "#9a3412" : rStyle === 1 ? "#854d0e" : "#075985";
      const southCol = rStyle === 0 ? "#c2410c" : rStyle === 1 ? "#ca8a04" : "#0284c7";
      const ridgeCol = rStyle === 0 ? "#fdba74" : rStyle === 1 ? "#fde047" : "#7dd3fc";

      // Água norte
      ctx.fillStyle = northCol;
      ctx.beginPath();
      ctx.roundRect(roofLeft, roofTop, roofW, ridgeY - roofTop + 2, [4, 4, 0, 0]);
      ctx.fill();

      // Água sul
      ctx.fillStyle = southCol;
      ctx.beginPath();
      ctx.roundRect(roofLeft, ridgeY, roofW, roofBottom - ridgeY, [0, 0, 4, 4]);
      ctx.fill();

      // Ondulações das telhas coloniais
      ctx.strokeStyle = "rgba(28, 25, 23, 0.28)";
      ctx.lineWidth = 1.1;
      for (let rx = roofLeft + 8; rx < roofRight - 4; rx += 9) {
        ctx.beginPath();
        ctx.moveTo(rx, roofTop + 2);
        ctx.lineTo(rx, roofBottom - 2);
        ctx.stroke();
      }

      // Cumeeira central caiada
      ctx.fillStyle = ridgeCol;
      ctx.fillRect(roofLeft + 3, ridgeY - 2, roofW - 6, 4);

      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 2;
      ctx.strokeRect(roofLeft, roofTop, roofW, roofH);

      ctx.restore();
    }
  }

  // Cabana de Madeira Rústica construída pelo Jogador (Paredes finas ocupando menos de 1/3 de um bloco: 10px em 36px)
  function drawCabinWall(ctx, sizeArg = 36, subType = 0, nb = null) {
    const ts = (typeof sizeArg === "number" && sizeArg > 2) ? sizeArg : 36 * (sizeArg || 1);
    const s = ts / 36;
    const half = ts / 2;

    // Piso de tábuas de madeira (se não tiver sido desenhado na camada de chão)
    if (!nb || !nb.skipFloor) {
      drawCabinFloor(ctx, ts);
    }

    ctx.save();
    ctx.translate(-half, -half);

    const thick = 10 * s; // Paredes laterais (leste/oeste: 10px de 36px)
    const southThick = thick * 2; // Parede da frente (sul: dobro da altura, 20px de 36px)
    const northThick = thick * 3; // Parede do fundo (norte: 50% mais alta que antes, 30px de 36px)
    const side = (nb && nb.wallSide) || "north";

    const drawHorizSegment = (x, y, w, h, numLogs = 2) => {
      // Sombra projetada suave no piso
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(x, y + h, w, 2 * s);

      ctx.fillStyle = "#271206";
      ctx.fillRect(x, y, w, h);

      const logH = h / numLogs;
      for (let i = 0; i < numLogs; i++) {
        const ly = y + i * logH;
        const grad = ctx.createLinearGradient(0, ly, 0, ly + logH);
        grad.addColorStop(0, "#854d0e");
        grad.addColorStop(0.35, "#a16207");
        grad.addColorStop(0.75, "#78350f");
        grad.addColorStop(1, "#451a03");
        ctx.fillStyle = grad;
        ctx.fillRect(x + 0.5, ly + 0.5, w - 1, logH - 1);

        ctx.strokeStyle = "rgba(251, 191, 36, 0.24)";
        ctx.lineWidth = 0.7 * s;
        ctx.beginPath();
        ctx.moveTo(x + 2 * s, ly + logH * 0.35);
        ctx.lineTo(x + w - 2 * s, ly + logH * 0.35);
        ctx.stroke();

        if (i > 0) {
          // Vedação entre as toras
          ctx.fillStyle = "#3f2d19";
          ctx.fillRect(x, ly - 0.7 * s, w, 1.4 * s);
        }
      }

      ctx.strokeStyle = "#271206";
      ctx.lineWidth = 1.1 * s;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    };

    const drawVertSegment = (x, y, w, h) => {
      // Sombra lateral suave no piso
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(x + w, y, 2 * s, h);

      ctx.fillStyle = "#271206";
      ctx.fillRect(x, y, w, h);

      const logW = w / 2;
      for (let i = 0; i < 2; i++) {
        const lx = x + i * logW;
        const grad = ctx.createLinearGradient(lx, 0, lx + logW, 0);
        grad.addColorStop(0, "#854d0e");
        grad.addColorStop(0.35, "#a16207");
        grad.addColorStop(0.75, "#78350f");
        grad.addColorStop(1, "#451a03");
        ctx.fillStyle = grad;
        ctx.fillRect(lx + 0.5, y + 0.5, logW - 1, h - 1);

        ctx.strokeStyle = "rgba(251, 191, 36, 0.22)";
        ctx.lineWidth = 0.7 * s;
        ctx.beginPath();
        ctx.moveTo(lx + logW * 0.35, y + 2 * s);
        ctx.lineTo(lx + logW * 0.35, y + h - 2 * s);
        ctx.stroke();
      }

      ctx.fillStyle = "#3f2d19";
      ctx.fillRect(x + logW - 0.7 * s, y, 1.4 * s, h);

      ctx.strokeStyle = "#271206";
      ctx.lineWidth = 1.1 * s;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    };

    // Parede Oeste (borda esquerda externa)
    if (side === "west" || side === "nw" || side === "sw") {
      drawVertSegment(0, 0, thick, ts);
    }
    // Parede Leste (borda direita externa)
    if (side === "east" || side === "ne" || side === "se") {
      drawVertSegment(ts - thick, 0, thick, ts);
    }
    // Parede Norte / Fundo (borda superior externa — 50% mais alta que antes: 30px com 6 toras)
    if (side === "north" || side === "nw" || side === "ne") {
      drawHorizSegment(0, 0, ts, northThick, 6);
    }
    // Parede Sul / Frente (borda inferior externa — dobro da altura: 20px com 4 toras)
    if (side === "south" || side === "sw" || side === "se") {
      drawHorizSegment(0, ts - southThick, ts, southThick, 4);
    }

    // Pilar de encaixe apenas nas 4 quinas externas da cabana
    if (side === "nw" || side === "ne" || side === "sw" || side === "se") {
      const px = (side === "nw" || side === "sw") ? 0 : ts - thick;
      const py = (side === "nw" || side === "ne") ? 0 : ts - southThick;
      const ph = (side === "nw" || side === "ne") ? northThick : southThick;
      ctx.fillStyle = "#5c2808";
      ctx.fillRect(px + 1 * s, py + 1 * s, thick - 2 * s, ph - 2 * s);
      ctx.strokeStyle = "#271206";
      ctx.lineWidth = 1.1 * s;
      ctx.strokeRect(px + 1 * s, py + 1 * s, thick - 2 * s, ph - 2 * s);
    }

    ctx.restore();
  }

  function drawCabinFloor(ctx, sizeArg = 36) {
    const ts = (typeof sizeArg === "number" && sizeArg > 2) ? sizeArg : 36 * (sizeArg || 1);
    const s = ts / 36;
    const half = ts / 2;
    ctx.save();
    ctx.translate(-half, -half);

    ctx.fillStyle = "#1e1006";
    ctx.fillRect(0, 0, ts, ts);

    // 4 tábuas horizontais de madeira
    const plankH = ts / 4;
    for (let i = 0; i < 4; i++) {
      const py = i * plankH;
      const col = (i % 2 === 0) ? "#9a5219" : "#854210";
      ctx.fillStyle = col;
      ctx.fillRect(0.5, py + 0.5, ts - 1, plankH - 1);

      ctx.fillStyle = "rgba(251, 191, 36, 0.14)";
      ctx.fillRect(3 * s, py + 2 * s, (ts - 6) * s, 1.5 * s);

      ctx.fillStyle = "#271206";
      ctx.fillRect(3 * s, py + plankH * 0.4, 1.6 * s, 1.6 * s);
      ctx.fillRect((ts - 4.5) * s, py + plankH * 0.4, 1.6 * s, 1.6 * s);
    }

    ctx.restore();
  }

  function drawCabinDoor(ctx, sizeArg = 36, opened = false, skipFloor = false) {
    const ts = (typeof sizeArg === "number" && sizeArg > 2) ? sizeArg : 36 * (sizeArg || 1);
    const s = ts / 36;

    // Piso interno de madeira sob o bloco da porta (se não tiver sido desenhado na camada de chão)
    if (!skipFloor) {
      drawCabinFloor(ctx, ts);
    }

    ctx.save();

    const half = ts / 2;
    const thick = 10 * s; // Paredes laterais (10px)
    const southThick = 20 * s; // Parede da frente (sul: dobro da altura, 20px)

    // Continuação da parede sul nas laterais da porta (altura dobrada para 20px)
    ctx.fillStyle = "#5c2808";
    ctx.fillRect(-half, half - southThick, 5 * s, southThick);
    ctx.fillRect(half - 5 * s, half - southThick, 5 * s, southThick);
    ctx.strokeStyle = "#271206";
    ctx.lineWidth = 1 * s;
    ctx.strokeRect(-half, half - southThick, 5 * s, southThick);
    ctx.strokeRect(half - 5 * s, half - southThick, 5 * s, southThick);

    // Soleira de madeira maciça na borda sul
    ctx.fillStyle = "#271206";
    ctx.fillRect(-14 * s, 14 * s, 28 * s, 4 * s);
    ctx.fillStyle = "#451a03";
    ctx.fillRect(-13 * s, 15 * s, 26 * s, 3 * s);

    // Batente externo de toras alinhado com a parede frontal (altura de 20px)
    const frameW = 26 * s;
    const frameH = 20 * s;
    const topY = half - southThick;
    const baseY = half;

    ctx.fillStyle = "#3d1904";
    ctx.fillRect(-frameW / 2, topY, frameW, frameH);
    ctx.strokeStyle = "#1c0b02";
    ctx.lineWidth = 1.2 * s;
    ctx.strokeRect(-frameW / 2, topY, frameW, frameH);

    // Vão interno da porta
    const innerW = 20 * s;
    const innerH = 17 * s;
    const innerTopY = topY + 2 * s;

    if (opened) {
      // Vão aberto: luz âmbar e tábuas do interior visíveis
      ctx.fillStyle = "#2a1508";
      ctx.fillRect(-innerW / 2, innerTopY, innerW, innerH);
      ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
      ctx.fillRect(-innerW / 2 + 1 * s, innerTopY + 1 * s, innerW - 2 * s, innerH - 2 * s);

      // Folha da porta aberta em perspectiva lateral à direita
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.moveTo(innerW / 2 - 2 * s, innerTopY);
      ctx.lineTo(innerW / 2 + 7 * s, innerTopY - 3 * s);
      ctx.lineTo(innerW / 2 + 7 * s, baseY - 4 * s);
      ctx.lineTo(innerW / 2 - 2 * s, baseY - 1 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#3d1904";
      ctx.lineWidth = 1 * s;
      ctx.stroke();
    } else {
      // Porta fechada de carvalho maciço
      const doorGrad = ctx.createLinearGradient(-innerW / 2, 0, innerW / 2, 0);
      doorGrad.addColorStop(0, "#854d0e");
      doorGrad.addColorStop(0.3, "#a16207");
      doorGrad.addColorStop(0.7, "#92400e");
      doorGrad.addColorStop(1, "#78350f");
      ctx.fillStyle = doorGrad;
      ctx.fillRect(-innerW / 2, innerTopY, innerW, innerH);

      // Três tábuas verticais com ranhuras
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 1.1 * s;
      const plankW = innerW / 3;
      ctx.beginPath();
      ctx.moveTo(-innerW / 2 + plankW, innerTopY);
      ctx.lineTo(-innerW / 2 + plankW, innerTopY + innerH);
      ctx.moveTo(-innerW / 2 + plankW * 2, innerTopY);
      ctx.lineTo(-innerW / 2 + plankW * 2, innerTopY + innerH);
      ctx.stroke();

      // Dobradiças pretas de ferro forjado
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-innerW / 2 - 1 * s, innerTopY + 2.5 * s, innerW + 2 * s, 2.2 * s);
      ctx.fillRect(-innerW / 2 - 1 * s, baseY - 5 * s, innerW + 2 * s, 2.2 * s);

      // Maçaneta de latão polido
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(innerW / 2 - 3.5 * s, innerTopY + innerH * 0.5, 1.8 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawCabinRoofs(ctx, tileSize, playerX, playerY, viewLeft, viewRight, viewTop, viewBottom, animTimer = 0, engine = null) {
    if (!engine || !engine.playerCabins || engine.playerCabins.length === 0) return;
    if (!window.__cabinRoofAlphaMap) {
      window.__cabinRoofAlphaMap = {};
    }
    const alphaMap = window.__cabinRoofAlphaMap;

    for (let i = 0; i < engine.playerCabins.length; i++) {
      const c = engine.playerCabins[i];
      const overhang = 8;
      const roofLeftPx = c.originTx * tileSize - overhang;
      const roofRightPx = (c.originTx + c.width) * tileSize + overhang;
      const roofTopPx = c.originTy * tileSize - 16;
      // Termina a cobertura logo acima da parede sul / frontal (20px) para que a porta e parede frontal fiquem 100% visíveis!
      const roofBottomPx = (c.originTy + c.height) * tileSize - (tileSize * (20 / 36));
      const roofW = roofRightPx - roofLeftPx;
      const roofH = roofBottomPx - roofTopPx;

      if (roofRightPx < viewLeft || roofLeftPx > viewRight || roofBottomPx < viewTop || roofTopPx > viewBottom) {
        continue;
      }

      const insideCabin = engine.isPlayerInsideCabin && engine.isPlayerInsideCabin(playerX, playerY);
      const isInside = insideCabin && insideCabin.id === c.id;
      const targetAlpha = isInside ? 0 : 1;
      const prevAlpha = alphaMap[c.id] !== undefined ? alphaMap[c.id] : targetAlpha;
      const nextAlpha = Math.abs(prevAlpha - targetAlpha) < 0.08
        ? targetAlpha
        : prevAlpha + (targetAlpha - prevAlpha) * 0.26;
      alphaMap[c.id] = nextAlpha;

      if (nextAlpha <= 0.02) continue;

      ctx.save();
      ctx.globalAlpha = nextAlpha;

      // Sombra projetada
      ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
      ctx.fillRect(roofLeftPx + 4, roofBottomPx - 4, roofW - 8, 8);

      // Telhado rústico de duas águas
      const grad = ctx.createLinearGradient(roofLeftPx, roofTopPx, roofRightPx, roofTopPx);
      grad.addColorStop(0, "#5c2808");
      grad.addColorStop(0.2, "#854210");
      grad.addColorStop(0.5, "#a1541b");
      grad.addColorStop(0.8, "#854210");
      grad.addColorStop(1, "#5c2808");
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(roofLeftPx, roofTopPx, roofW, roofH, 6);
      } else {
        ctx.rect(roofLeftPx, roofTopPx, roofW, roofH);
      }
      ctx.fill();

      // Ripas e tábuas sobrepostas
      const rows = 5;
      const rowH = roofH / rows;
      for (let r = 0; r < rows; r++) {
        const ry = roofTopPx + r * rowH;
        ctx.fillStyle = (r % 2 === 0) ? "rgba(45, 18, 4, 0.45)" : "rgba(245, 158, 11, 0.15)";
        ctx.fillRect(roofLeftPx + 2, ry, roofW - 4, 2);

        const colW = 16;
        const offset = (r % 2) * 8;
        ctx.strokeStyle = "rgba(35, 14, 3, 0.35)";
        ctx.lineWidth = 1;
        for (let cx = roofLeftPx + offset; cx < roofRightPx; cx += colW) {
          ctx.beginPath();
          ctx.moveTo(cx, ry);
          ctx.lineTo(cx, ry + rowH);
          ctx.stroke();
        }
      }

      // Cumeeira central superior
      const midY = roofTopPx + 8;
      ctx.fillStyle = "#3d1904";
      ctx.fillRect(roofLeftPx + 2, midY - 3, roofW - 4, 6);
      ctx.fillStyle = "#a1541b";
      ctx.fillRect(roofLeftPx + 3, midY - 1, roofW - 6, 2);

      // Borda
      ctx.strokeStyle = "#271206";
      ctx.lineWidth = 1.8;
      ctx.strokeRect(roofLeftPx, roofTopPx, roofW, roofH);

      ctx.restore();
    }
  }

  function drawCabinPlacementPreview(ctx, tileSize, animTimer = 0, engine = null) {
    const preview = typeof window !== "undefined" ? window.__cabinPlacementPreview : null;
    if (!preview || !preview.active) return;
    const isChestMode = preview.mode === "chest";
    if (!isChestMode && engine && engine.isUnderground) return;

    const originTx = preview.originTx;
    const originTy = preview.originTy;
    const width = isChestMode ? 1 : (preview.width || 4);
    const height = isChestMode ? 1 : (preview.height || 4);
    const doorTx = originTx + 1;
    const doorTy = originTy + 3;

    const isValid = isChestMode
      ? (engine && typeof engine.isChestPlacementValid === "function"
          ? engine.isChestPlacementValid(originTx, originTy)
          : true)
      : (engine && typeof engine.isCabinPlacementValid === "function"
          ? engine.isCabinPlacementValid(originTx, originTy, width, height)
          : true);

    const pulse = (Math.sin(animTimer * 6) + 1) * 0.5;
    const leftPx = originTx * tileSize;
    const topPx = originTy * tileSize;
    const totalW = width * tileSize;
    const totalH = height * tileSize;
    const wallThick = tileSize * (10 / 36); // Paredes laterais (10px)
    const southWallThick = wallThick * 2; // Parede da frente (20px)
    const northWallThick = wallThick * 3; // Parede do fundo (30px)

    ctx.save();

    if (isChestMode) {
      ctx.fillStyle = isValid
        ? `rgba(134, 239, 172, ${0.22 + pulse * 0.12})`
        : `rgba(252, 165, 165, ${0.24 + pulse * 0.12})`;
      ctx.fillRect(leftPx, topPx, tileSize, tileSize);

      ctx.strokeStyle = isValid
        ? `rgba(74, 222, 128, ${0.88 + pulse * 0.12})`
        : `rgba(248, 113, 113, ${0.88 + pulse * 0.12})`;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(leftPx + 1.5, topPx + 1.5, tileSize - 3, tileSize - 3);

      const cx = leftPx + tileSize / 2;
      const cy = topPx + tileSize / 2;
      ctx.save();
      ctx.translate(cx, cy + 4);
      ctx.globalAlpha = 0.85;
      pg(ctx, 1, false, animTimer || 0);
      ctx.restore();

      const badgeW = 186;
      const badgeH = 20;
      const badgeX = cx - badgeW / 2;
      const badgeY = topPx - 24 - Math.sin((animTimer || 0) * 4) * 2;

      ctx.fillStyle = "rgba(9, 13, 22, 0.88)";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
      } else {
        ctx.rect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fill();

      ctx.strokeStyle = isValid ? "#34d399" : "#f87171";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isValid ? "#6ee7b7" : "#fca5a5";
      ctx.fillText(
        isValid
          ? "📦 WASD MOVER • [C] / POSICIONAR BAÚ"
          : "⚠️ LOCAL BLOQUEADO — MOVA COM WASD",
        cx,
        badgeY + badgeH / 2 + 0.5,
      );

      ctx.restore();
      return;
    }

    // Fundo translúcido da área total da cabana
    ctx.fillStyle = isValid
      ? `rgba(134, 239, 172, ${0.18 + pulse * 0.08})`
      : `rgba(252, 165, 165, ${0.18 + pulse * 0.08})`;
    ctx.fillRect(leftPx, topPx, totalW, totalH);

    // Grade tile a tile sutil
    for (let x = originTx; x < originTx + width; x++) {
      for (let y = originTy; y < originTy + height; y++) {
        const txPx = x * tileSize;
        const tyPx = y * tileSize;
        ctx.strokeStyle = isValid
          ? "rgba(74, 222, 128, 0.35)"
          : "rgba(248, 113, 113, 0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(txPx + 0.5, tyPx + 0.5, tileSize - 1, tileSize - 1);
      }
    }

    // Paredes perimetrais finas (< 1/3 de um bloco) na pré-visualização
    ctx.fillStyle = isValid
      ? `rgba(22, 163, 74, ${0.52 + pulse * 0.15})`
      : `rgba(220, 38, 38, ${0.52 + pulse * 0.15})`;
    // Parede Norte (fundo)
    ctx.fillRect(leftPx, topPx, totalW, northWallThick);
    // Parede Oeste
    ctx.fillRect(leftPx, topPx, wallThick, totalH);
    // Parede Leste
    ctx.fillRect(leftPx + totalW - wallThick, topPx, wallThick, totalH);
    // Parede Sul (frente, com abertura para a porta)
    const doorLeftPx = doorTx * tileSize;
    const doorRightPx = (doorTx + 1) * tileSize;
    ctx.fillRect(leftPx, topPx + totalH - southWallThick, doorLeftPx - leftPx, southWallThick);
    ctx.fillRect(doorRightPx, topPx + totalH - southWallThick, (leftPx + totalW) - doorRightPx, southWallThick);

    // Destaque da Porta na parede sul
    ctx.fillStyle = isValid
      ? `rgba(74, 222, 128, ${0.6 + pulse * 0.2})`
      : `rgba(248, 113, 113, ${0.6 + pulse * 0.2})`;
    ctx.fillRect(doorLeftPx + 3, topPx + totalH - southWallThick - 2, tileSize - 6, southWallThick + 2);

    // Borda externa brilhante da área da cabana
    ctx.strokeStyle = isValid
      ? `rgba(74, 222, 128, ${0.85 + pulse * 0.15})`
      : `rgba(248, 113, 113, ${0.85 + pulse * 0.15})`;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(leftPx, topPx, totalW, totalH);

    // Cantoneiras de marcação nos 4 cantos
    const cornerLen = 10;
    ctx.strokeStyle = isValid ? "#bbf7d0" : "#fecaca";
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Canto superior esquerdo
    ctx.moveTo(leftPx, topPx + cornerLen);
    ctx.lineTo(leftPx, topPx);
    ctx.lineTo(leftPx + cornerLen, topPx);
    // Canto superior direito
    ctx.moveTo(leftPx + totalW - cornerLen, topPx);
    ctx.lineTo(leftPx + totalW, topPx);
    ctx.lineTo(leftPx + totalW, topPx + cornerLen);
    // Canto inferior esquerdo
    ctx.moveTo(leftPx, topPx + totalH - cornerLen);
    ctx.lineTo(leftPx, topPx + totalH);
    ctx.lineTo(leftPx + cornerLen, topPx + totalH);
    // Canto inferior direito
    ctx.moveTo(leftPx + totalW - cornerLen, topPx + totalH);
    ctx.lineTo(leftPx + totalW, topPx + totalH);
    ctx.lineTo(leftPx + totalW, topPx + totalH - cornerLen);
    ctx.stroke();

    // Indicador da Porta
    const doorCenterX = (doorTx + 0.5) * tileSize;
    const doorCenterY = (doorTy + 0.5) * tileSize;
    ctx.fillStyle = "rgba(6, 78, 59, 0.9)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(doorCenterX - 18, doorCenterY - 7, 36, 14, 4);
    } else {
      ctx.rect(doorCenterX - 18, doorCenterY - 7, 36, 14);
    }
    ctx.fill();
    ctx.strokeStyle = isValid ? "#4ade80" : "#f87171";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚪 PORTA", doorCenterX, doorCenterY);

    ctx.restore();
  }

  // Torna as funções acessíveis globalmente
  window.drawDesertCityHouseRoofs = drawDesertCityHouseRoofs;
  window.drawDesertCityWall = drawDesertCityWall;
  window.drawDesertCityDoor = drawDesertCityDoor;
  window.drawDesertCityMat = drawDesertCityMat;
  window.drawDesertCityPots = drawDesertCityPots;
  window.drawDesertCityFloor = drawDesertCityFloor;
  window.drawTardigradeEggs = drawTardigradeEggs;
  window.drawPortCityFloor = drawPortCityFloor;
  window.drawPortCityWall = drawPortCityWall;
  window.drawPortCityDoor = drawPortCityDoor;
  window.drawPortCityHammock = drawPortCityHammock;
  window.drawPortCityCargo = drawPortCityCargo;
  window.drawPortCityTable = drawPortCityTable;
  window.drawPortCityMonument = drawPortCityMonument;
  window.drawPortCityLamppost = drawPortCityLamppost;
  window.drawPortCityBollard = drawPortCityBollard;
  window.drawPortCityBoatHelm = drawPortCityBoatHelm;
  window.drawPortCityBoatStructure = drawPortCityBoatStructure;
  window.drawPortCityHouseRoofs = drawPortCityHouseRoofs;
  window.drawCabinWall = drawCabinWall;
  window.drawCabinFloor = drawCabinFloor;
  window.drawCabinDoor = drawCabinDoor;
  window.drawCabinRoofs = drawCabinRoofs;
  window.drawCabinPlacementPreview = drawCabinPlacementPreview;


