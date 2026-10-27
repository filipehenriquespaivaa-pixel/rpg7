/* js/engine/draw-personagem-e-efeitos.js
 * Desenho de personagens/criaturas animadas e efeitos (Ag, Eg, Ng...). O desenho do dragao e do escorpiao (corpo, garras, colisores) esta em js/creatures/dragon.js e js/creatures/scorpion.js.
 * Trecho de legacy/app.original.js (linhas 24031-26091); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function Ag(e, t, l) {
    (e.save(), e.translate(t.x, t.y));
    const o = t.scale,
      u = t.lifetime < 4 ? Math.max(0.04, t.lifetime / 4) : 1;
    if (creatureDraw(t.type, "carcassFull")) {
      creatureDraw(t.type, "carcassFull")(e, t, l, o, u);
    } else {
      if (
        ((e.fillStyle = `rgba(15, 23, 42, ${0.35 * u})`),
        e.beginPath(),
        e.ellipse(0, 3 * o, 13 * o, 6 * o, 0, 0, Math.PI * 2),
        e.fill(),
        e.save(),
        (e.globalAlpha = 0.85 * u),
        creatureDraw(t.type, "carcass"))
      ) {
        creatureDraw(t.type, "carcass")(e, t, o, u);
      } else {
        ((e.fillStyle = "#1e293b"),
          e.fillRect(-7 * o, -3 * o, 6 * o, 6 * o),
          e.fillRect(1 * o, -4 * o, 7 * o, 5 * o),
          e.fillRect(-2 * o, 1 * o, 5 * o, 4 * o),
          (e.strokeStyle = `rgba(249, 115, 22, ${0.4 * u})`),
          (e.lineWidth = 1.2 * o),
          e.strokeRect(-7 * o, -3 * o, 6 * o, 6 * o),
          e.strokeRect(1 * o, -4 * o, 7 * o, 5 * o));
      }
      e.restore();
    }
    e.restore();
  }
  function Eg(e, t) {
    (e.save(), e.translate(t.x, t.y));
    const l = t.hitFlashTimer > 0,
      o = t.scale;
    ((window.__rpgQuality?.beings ?? 1) >= 0.75 &&
        ((e.fillStyle = "rgba(15, 23, 42, 0.4)"),
        e.beginPath(),
        e.ellipse(0, 3 * o, 10 * o, 5 * o, 0, 0, Math.PI * 2),
        e.fill()),
      l && ((e.fillStyle = "#ffffff"), (e.strokeStyle = "#ef4444")));
    if (creatureDraw(t.type, "body")) creatureDraw(t.type, "body")(e, t, o, l);
    // Tipos sem desenho proprio caem no corpo do lobo (comportamento do codigo antigo)
    else CREATURES.wolf.draw.body(e, t, o, l);
    if (t.hp < t.maxHp && !t.attached) {
      const u = 24 * o,
        m = 3 * o,
        c = Math.max(0, t.hp / t.maxHp);
      ((e.fillStyle = "rgba(0, 0, 0, 0.7)"),
        e.fillRect(-u / 2 - 1, -25 * o - 1, u + 2, m + 2),
        (e.fillStyle = c > 0.4 ? "#22c55e" : "#ef4444"),
        e.fillRect(-u / 2, -25 * o, u * c, m));
    }
    if (t.weatherStateText && !t.attached && !t.isUnderground) {
      e.save();
      const labelY = (t.hp < t.maxHp ? -32 : -27) * o + Math.sin((t.animTimer || 0) * 4) * 1.2;
      e.font = "bold 9px 'Segoe UI', sans-serif";
      e.textAlign = "center";
      e.textBaseline = "middle";
      const metrics = e.measureText(t.weatherStateText);
      const padX = 5;
      const bw = metrics.width + padX * 2;
      const bh = 13;
      e.fillStyle = "rgba(15, 23, 42, 0.82)";
      e.beginPath();
      if (typeof e.roundRect === "function") {
        e.roundRect(-bw / 2, labelY - bh / 2, bw, bh, 4);
      } else {
        e.rect(-bw / 2, labelY - bh / 2, bw, bh);
      }
      e.fill();
      e.strokeStyle = t.weatherStateColor || "#38bdf8";
      e.lineWidth = 0.9;
      e.stroke();
      e.fillStyle = t.weatherStateColor || "#e0f2fe";
      e.fillText(t.weatherStateText, 0, labelY + 0.5);
      e.restore();
    }
    e.restore();
  }
