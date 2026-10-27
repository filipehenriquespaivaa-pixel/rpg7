/* js/creatures/scorpion.js
 * Criatura COMPLETA: Escorpiao (Escorpiao das Areias, no deserto e na caverna do deserto) e a variante
 * Escorpiao Gigante Noturno (`isGiantScorpion`, criado por CreatureManager.createGiantScorpion).
 * Tudo que DESENHA o escorpiao fica neste arquivo (corpo, garras, ferrao, carcaca, icone, colisores de golpe e a
 * garra que alcanca a entrada da caverna). A IA (enterrar-se, capturar o jogador, ataques) continua em
 * js/engine/creatures-manager.js e o clima em js/engine/weather.js, que comparam `type === "scorpion"`.
 * Depende de registry.js (carregar depois dele). A aranha e uma criatura SEPARADA (spider.js).
 *
 * Sem `carcass`, `sheet`, `loot` e `detect` de proposito (como o golem e a aranha): ac() em fusao-e-loot.js
 * exclui itens com "escorpiao" no nome; a carcaca usa o texto proprio do gigante em createCarcassForMonster.
 *
 * Funcoes globais definidas aqui (usadas por outros arquivos): getScorpionHitColliders (tambem em window) e
 * drawGiantScorpionCaveReachClaw. As demais (drawScorpionBody/Side/Front/Back/Claw) eram xg, Ju, Dg, Ig, e0.
 */
"use strict";
CREATURES.scorpion = {
  id: "scorpion",
  // Nascimento padrao: Escorpiao das Areias na superficie do deserto
  spawn: {
    name: "Escorpião das Areias",
    color: "#d97706",
    accentColor: "#fef08a",
    hp: 16,
    attack: 5,
    speed: 0.95,
    scale: 0.58,
  },
  spawnVariants: {
    // Tuneis da caverna do deserto
    cave: {
      name: "Escorpião das Areias",
      color: "#b45309",
      accentColor: "#fde047",
      hp: 16,
      attack: 5,
      speed: 0.95,
      scale: 0.58,
    },
    // Escorpiao Gigante Noturno (CreatureManager.createGiantScorpion; a velocidade depende do jogador e fica la)
    giant: {
      name: "Escorpião Gigante Noturno",
      color: "#b45309",
      accentColor: "#ef4444",
      hp: 95,
      attack: 14,
      defense: 5,
      scale: 0.95 * 5,
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
    o === "creature_scorpion" ||
    o === "scorpion" ||
    t.includes("escorpião") ||
    t.includes("escorpiao") ||
    l.includes("scorpion"),
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (antigo ramo scorpion de Eg; inclui a animacao de emergir/enterrar na areia)
    body: function (e, t, o, l) {
      const isEmergingScorpion = !!(t.emerging && (t.emergeTimer || 0) > 0),
        isBurrowingScorpion = !!(t.burrowing && (t.burrowTimer || 0) > 0);
      if (isEmergingScorpion || isBurrowingScorpion) {
        const totalDur = isEmergingScorpion ? (t.emergeDuration || 1.15) : (t.burrowDuration || 0.9),
          remTimer = isEmergingScorpion ? (t.emergeTimer || 0) : (t.burrowTimer || 0),
          rawProg = Math.max(0, Math.min(1, 1 - remTimer / totalDur)),
          visFrac = isEmergingScorpion ? rawProg : (1 - rawProg),
          holePulse = Math.sin(rawProg * Math.PI);

        // Cratera/monte de areia se abrindo ou fechando sob o escorpião
        e.save();
        e.fillStyle = "rgba(69, 26, 3, 0.72)";
        e.beginPath();
        e.ellipse(0, 4 * o, (11 + holePulse * 4) * o, (4.8 + holePulse * 2) * o, 0, 0, Math.PI * 2);
        e.fill();

        e.strokeStyle = "rgba(217, 119, 6, 0.85)";
        e.lineWidth = 2.0 * o;
        e.beginPath();
        e.ellipse(0, 4 * o, (12.5 + holePulse * 4.5) * o, (5.5 + holePulse * 2.2) * o, 0, 0, Math.PI * 2);
        e.stroke();

        // Grãos e torrões de areia saltando ao redor da borda da cratera
        for (let si = 0; si < 6; si++) {
          const sAng = (si / 6) * Math.PI * 2 + rawProg * 4,
            sDist = (9 + holePulse * 6) * o,
            sx = Math.cos(sAng) * sDist,
            sy = 3 * o + Math.sin(sAng) * (sDist * 0.42) - holePulse * 4 * o;
          e.fillStyle = si % 2 === 0 ? "#f59e0b" : "#92400e";
          e.beginPath();
          e.arc(sx, sy, 1.5 * o, 0, Math.PI * 2);
          e.fill();
        }

        // Recorte vertical na linha da cratera para o corpo emergir/afundar de dentro do chão
        e.beginPath();
        e.rect(-36 * o, -48 * o, 72 * o, 53 * o);
        e.clip();

        const sinkY = (1 - visFrac) * 20 * o,
          scaleMod = 0.55 + visFrac * 0.45;
        e.translate(0, sinkY);
        e.scale(scaleMod, scaleMod);
        drawScorpionBody(e, t, o, l);
        e.restore();
      } else {
        drawScorpionBody(e, t, o, l);
      }
    },
    // Carcaca no chao (antigo ramo scorpion de Ag)
    carcass: function (e, t, o, u) {
      const m = t.color || "#d97706",
        c = "#78350f",
        f = "#451a03";
      ((e.strokeStyle = c), (e.lineWidth = 1.2 * o), (e.lineCap = "round"));
      for (const g of [-1, 1])
        for (let y = 0; y < 4; y++) {
          const w = -4 * o + y * 2.6 * o;
          (e.beginPath(),
            e.moveTo(w, g * 2.2 * o),
            e.quadraticCurveTo(
              w + g * 3.5 * o,
              g * 4.5 * o,
              w + g * 1.5 * o,
              g * 6 * o,
            ),
            e.stroke());
        }
      ((e.fillStyle = m),
        e.beginPath(),
        e.ellipse(0, 0, 7.5 * o, 4.8 * o, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = c),
        (e.lineWidth = 0.9 * o));
      for (let g = -4.5; g <= 4.5; g += 2.2)
        (e.beginPath(),
          e.moveTo(g * o, -3.5 * o),
          e.lineTo(g * o, 3.5 * o),
          e.stroke());
      for (const g of [-1, 1])
        ((e.fillStyle = "#b45309"),
          e.fillRect(4 * o, g * 2.5 * o, 4 * o, 2 * o),
          e.beginPath(),
          e.ellipse(
            8.5 * o,
            g * 4 * o,
            3 * o,
            2 * o,
            g * 0.4,
            0,
            Math.PI * 2,
          ),
          e.fill(),
          (e.strokeStyle = f),
          (e.lineWidth = 1.3 * o),
          e.beginPath(),
          e.moveTo(10.5 * o, g * 3.5 * o),
          e.lineTo(13 * o, g * 2.5 * o),
          e.moveTo(10.5 * o, g * 4.5 * o),
          e.lineTo(13 * o, g * 5.5 * o),
          e.stroke());
      ((e.strokeStyle = m),
        (e.lineWidth = 2.4 * o),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(-7 * o, 0),
        e.quadraticCurveTo(-11 * o, 4 * o, -9 * o, 8 * o),
        e.stroke(),
        (e.fillStyle = t.accentColor || "#ef4444"),
        e.beginPath(),
        e.arc(-9 * o, 8 * o, 1.8 * o, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = f),
        (e.lineWidth = 1.2 * o),
        e.beginPath(),
        e.moveTo(-9 * o, 8 * o),
        e.lineTo(-7.5 * o, 10 * o),
        e.stroke(),
        (e.strokeStyle = `rgba(15, 23, 42, ${u})`),
        (e.lineWidth = 1.3 * o),
        e.beginPath(),
        e.moveTo(4 * o, -1.5 * o),
        e.lineTo(6 * o, 0.5 * o),
        e.moveTo(6 * o, -1.5 * o),
        e.lineTo(4 * o, 0.5 * o),
        e.stroke());
    },
    // Icone desenhado no canvas / inventario (antigo sb)
    icon: function (e, t, l) {
      const o = l.color || "#d97706",
        u = "#ef4444";
      ((e.fillStyle = "rgba(15, 23, 42, 0.4)"),
        e.beginPath(),
        e.ellipse(0, 3.5 * t, 8.5 * t, 4.5 * t, 0, 0, Math.PI * 2),
        e.ellipse(-7.5 * t, -3.5 * t, 3.2 * t, 2 * t, -0.3, 0, Math.PI * 2),
        e.ellipse(7.5 * t, -3.5 * t, 3.2 * t, 2 * t, 0.3, 0, Math.PI * 2),
        e.fill());
      const m = "#78350f",
        c = "#451a03",
        f = "#fef08a";
      for (let T of [-1, 1])
        for (let S = 0; S < 4; S++) {
          const p = -1.2 * t + S * 2.2 * t;
          ((e.strokeStyle = S < 2 ? m : o),
            (e.lineWidth = 1.3 * t),
            (e.lineCap = "round"),
            (e.lineJoin = "round"),
            e.beginPath(),
            e.moveTo(T * 2.8 * t, p));
          const j = T * 6.8 * t,
            P = p - (1.4 - S * 0.4) * t;
          e.lineTo(j, P);
          const A = T * 8.5 * t,
            x = p + 2.2 * t;
          (e.lineTo(A, x),
            e.stroke(),
            (e.strokeStyle = c),
            (e.lineWidth = 0.8 * t),
            e.beginPath(),
            e.moveTo(A, x),
            e.lineTo(A + T * 1 * t, x + 1 * t),
            e.stroke());
        }
      ((e.fillStyle = o),
        e.beginPath(),
        e.ellipse(0, 1.2 * t, 5 * t, 6.2 * t, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = c),
        (e.lineWidth = 0.9 * t));
      for (let T = -2.2; T <= 4.2; T += 1.8) {
        const S =
          Math.sqrt(Math.max(0, 1 - Math.pow((T - 1.2) / 6.2, 2))) * 4.8 * t;
        (e.beginPath(),
          e.moveTo(-S, T * t),
          e.lineTo(S, T * t),
          e.stroke(),
          (e.fillStyle = f),
          e.beginPath(),
          e.ellipse(0, T * t - 0.5 * t, 0.7 * t, 0.4 * t, 0, 0, Math.PI * 2),
          e.fill());
      }
      ((e.fillStyle = o),
        e.beginPath(),
        e.moveTo(-3.5 * t, -1.5 * t),
        e.lineTo(-2.8 * t, -4.5 * t),
        e.lineTo(0, -5.5 * t),
        e.lineTo(2.8 * t, -4.5 * t),
        e.lineTo(3.5 * t, -1.5 * t),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = m),
        (e.lineWidth = 1 * t),
        e.stroke(),
        (e.fillStyle = c),
        e.fillRect(-1.2 * t, -6.5 * t, 1 * t, 1.4 * t),
        e.fillRect(0.2 * t, -6.5 * t, 1 * t, 1.4 * t),
        (e.fillStyle = "#0f172a"),
        e.beginPath(),
        e.arc(-1 * t, -3.8 * t, 0.8 * t, 0, Math.PI * 2),
        e.arc(1 * t, -3.8 * t, 0.8 * t, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#ffffff"),
        e.beginPath(),
        e.arc(-0.8 * t, -4 * t, 0.35 * t, 0, Math.PI * 2),
        e.arc(1.2 * t, -4 * t, 0.35 * t, 0, Math.PI * 2),
        e.fill());
      const y = [
        { x1: 0, y1: 6 * t, x2: 2.2 * t, y2: 4 * t, w: 3.4 * t },
        { x1: 2.2 * t, y1: 4 * t, x2: 4.2 * t, y2: 1 * t, w: 3 * t },
        { x1: 4.2 * t, y1: 1 * t, x2: 4 * t, y2: -3 * t, w: 2.6 * t },
        { x1: 4 * t, y1: -3 * t, x2: 2 * t, y2: -6.5 * t, w: 2.2 * t },
        { x1: 2 * t, y1: -6.5 * t, x2: -0.5 * t, y2: -8 * t, w: 1.9 * t },
      ];
      for (let T of y)
        ((e.fillStyle = c),
          e.beginPath(),
          e.arc(T.x1, T.y1, T.w * 0.52, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = o),
          (e.lineWidth = T.w),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(T.x1, T.y1),
          e.lineTo(T.x2, T.y2),
          e.stroke(),
          (e.strokeStyle = m),
          (e.lineWidth = 0.8 * t),
          e.beginPath(),
          e.moveTo(T.x1, T.y1),
          e.lineTo(T.x2, T.y2),
          e.stroke());
      const w = -1.2 * t,
        v = -8.2 * t;
      ((e.fillStyle = u),
        e.beginPath(),
        e.ellipse(w, v, 2.2 * t, 1.8 * t, -0.4, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = c),
        (e.lineWidth = 1.3 * t),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(w - 1.2 * t, v),
        e.quadraticCurveTo(w - 3.8 * t, v + 0.5 * t, w - 3 * t, v + 3.2 * t),
        e.stroke(),
        (e.fillStyle = f),
        e.beginPath(),
        e.arc(w - 3 * t, v + 3.2 * t, 0.9 * t, 0, Math.PI * 2),
        e.fill());
      for (let T of [-1, 1]) {
        ((e.strokeStyle = o),
          (e.lineWidth = 2.2 * t),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(T * 2.5 * t, -2.5 * t),
          e.lineTo(T * 6.5 * t, -5 * t),
          e.stroke(),
          (e.fillStyle = m),
          e.beginPath(),
          e.arc(T * 6.5 * t, -5 * t, 1.4 * t, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#b45309"),
          e.beginPath(),
          e.ellipse(
            T * 7.5 * t,
            -6.8 * t,
            2.2 * t,
            3 * t,
            T * 0.35,
            0,
            Math.PI * 2,
          ),
          e.fill(),
          (e.fillStyle = f),
          e.beginPath(),
          e.ellipse(
            T * 7.3 * t,
            -7.2 * t,
            0.9 * t,
            1.4 * t,
            T * 0.35,
            0,
            Math.PI * 2,
          ),
          e.fill(),
          (e.fillStyle = m),
          e.beginPath(),
          e.moveTo(T * 6.8 * t, -8.2 * t),
          e.quadraticCurveTo(T * 8.2 * t, -11.5 * t, T * 6 * t, -12.5 * t),
          e.quadraticCurveTo(T * 7.2 * t, -10 * t, T * 6 * t, -8.6 * t),
          e.closePath(),
          e.fill(),
          (e.fillStyle = c),
          e.beginPath(),
          e.moveTo(T * 8 * t, -8.2 * t),
          e.quadraticCurveTo(T * 8.8 * t, -11 * t, T * 6.6 * t, -12.2 * t),
          e.quadraticCurveTo(T * 8 * t, -9.8 * t, T * 7.4 * t, -8.6 * t),
          e.closePath(),
          e.fill(),
          (e.strokeStyle = f),
          (e.lineWidth = 0.7 * t));
        for (let S = 1; S <= 2; S++)
          (e.beginPath(),
            e.moveTo(T * (7 + S * 0.3) * t, -(8.8 + S * 1) * t),
            e.lineTo(T * (7.4 + S * 0.3) * t, -(8.8 + S * 1) * t),
            e.stroke());
      }
    },
  },
};

// ---- Funcoes de desenho e colisao do escorpiao (movidas sem alteracoes de js/engine/draw-personagem-e-efeitos.js) ----
  function drawScorpionBody(e, t, l, o) {
    t.facing === "down"
      ? drawScorpionFront(e, t, l, o)
      : t.facing === "up"
        ? drawScorpionBack(e, t, l, o)
        : t.facing === "left"
          ? drawScorpionSide(e, t, l, o, -1)
          : drawScorpionSide(e, t, l, o, 1);
  }
  function drawScorpionSide(e, t, l, o, u) {
    (e.save(), e.scale(u, 1));
    const spd = Math.hypot(t.vx || 0, t.vy || 0),
      c = spd > 0.04,
      stepRate = Math.max(1.8, Math.min(4.2, (spd / Math.max(0.5, (t.scale || 1) * 0.65)) * 4.5)),
      f = c ? t.animTimer * stepRate : t.animTimer * 1.2,
      g = c ? Math.sin(f * 2) * 0.5 * l : Math.sin(t.animTimer * 1.5) * 0.3 * l,
      y = o ? "#ffffff" : t.color || "#d97706",
      w = o ? "#e2e8f0" : "#78350f",
      v = o ? "#cbd5e1" : "#451a03",
      T = o ? "#ffffff" : "#fef08a",
      S = o ? "#fee2e2" : "#b45309",
      p = o ? "#ffffff" : t.accentColor || "#ef4444";
    ((e.fillStyle = "rgba(15, 23, 42, 0.42)"),
      e.beginPath(),
      e.ellipse(0, 2 * l, 12 * l, 6.5 * l, 0, 0, Math.PI * 2),
      e.fill(),
      e.beginPath(),
      e.ellipse(11 * l, 2.5 * l, 5 * l, 2.6 * l, 0.2, 0, Math.PI * 2),
      e.ellipse(8 * l, -3.2 * l, 4.2 * l, 2.2 * l, -0.25, 0, Math.PI * 2),
      e.fill());
    for (let Ne = 0; Ne < 4; Ne++) {
      const X = f + Ne * 1.5,
        C = c
          ? Math.sin(X) * 2.1 * l
          : Math.sin(t.animTimer * 1.2 + Ne) * 0.35 * l,
        I = c ? Math.max(0, -Math.cos(X)) * 1.6 * l : 0,
        be = -5 * l + Ne * 3.4 * l,
        Me = -5 * l + g;
      ((e.strokeStyle = w),
        (e.lineWidth = 1.3 * l),
        (e.lineCap = "round"),
        (e.lineJoin = "round"),
        e.beginPath(),
        e.moveTo(be, Me));
      const Te = be - 2 * l + C * 0.7,
        Fe = Me - 6.5 * l - I;
      e.lineTo(Te, Fe);
      const _e = Te - 3.5 * l + C,
        xe = Me - 3 * l;
      (e.lineTo(_e, xe),
        e.stroke(),
        (e.strokeStyle = v),
        (e.lineWidth = 0.9 * l),
        e.beginPath(),
        e.moveTo(_e, xe),
        e.lineTo(_e - 1.2 * l, xe + 1 * l),
        e.stroke());
    }
    const isStingerAtk = t.isGiantScorpion
      ? !!(t.stingerAttackTimer && t.stingerAttackTimer > 0)
      : (t.attackType === "stinger" && t.attackTimer > 0);
    const stingerProg = isStingerAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.stingerAttackTimer / (t.stingerAttackDuration || 0.44) : t.attackTimer / (t.attackDuration || 0.38))))
      : 0;
    const stingerTgtX = t.isGiantScorpion && t.stingerTargetX !== void 0 ? t.stingerTargetX : t.attackTargetX;
    const stingerTgtY = t.isGiantScorpion && t.stingerTargetY !== void 0 ? t.stingerTargetY : t.attackTargetY;
    let stingerThrust = 0;
    let stingerDown = 0;
    let stingerStrikePower = 0;
    if (isStingerAtk) {
      if (stingerProg < 0.25) {
        const prep = Math.sin((stingerProg / 0.25) * Math.PI * 0.5);
        stingerThrust = -prep * 3 * l;
        stingerDown = -prep * 1.5 * l;
      } else if (stingerProg < 0.65) {
        const snap = Math.sin(((stingerProg - 0.25) / 0.4) * Math.PI);
        stingerStrikePower = snap;
        stingerThrust = -3 * l * (1 - (stingerProg - 0.25) / 0.4) + snap * 13 * l;
        stingerDown = snap * 5.5 * l;
      } else {
        const ret = Math.sin(((1 - stingerProg) / 0.35) * Math.PI * 0.5);
        stingerThrust = ret * 5 * l;
        stingerDown = ret * 1.5 * l;
      }
    }

    const j = Math.sin(t.animTimer * 2.8) * 1.8 * l,
      P = -7 * l,
      A = -5 * l + g;
    const restTipLocalX = P + 3.8 * l + j + 6.6 * l,
      restTipLocalY = A - 18.2 * l + 4.7 * l;
    let aimDeltaX = stingerThrust,
      aimDeltaY = stingerDown * 0.6;
    if (isStingerAtk && stingerStrikePower > 0 && stingerTgtX !== void 0 && stingerTgtY !== void 0) {
      const targetLocalX = (stingerTgtX - t.x) * u,
        targetLocalY = stingerTgtY - t.y;
      aimDeltaX = (targetLocalX - restTipLocalX) * stingerStrikePower;
      aimDeltaY = (targetLocalY - restTipLocalY) * stingerStrikePower;
    }
    const x = P - 3.2 * l,
      M = A - 2.8 * l,
      $ = P - 5.8 * l,
      z = A - 7.5 * l,
      K = P - 4.8 * l + j * 0.3 + aimDeltaX * 0.25,
      V = A - 13 * l + aimDeltaY * 0.2,
      O = P - 1.2 * l + j * 0.6 + aimDeltaX * 0.6,
      _ = A - 17 * l + aimDeltaY * 0.5,
      se = P + 3.8 * l + j + aimDeltaX,
      ue = A - 18.2 * l + aimDeltaY,
      N = [
        { x1: P, y1: A, x2: x, y2: M, width: 3.8 * l },
        { x1: x, y1: M, x2: $, y2: z, width: 3.4 * l },
        { x1: $, y1: z, x2: K, y2: V, width: 3 * l },
        { x1: K, y1: V, x2: O, y2: _, width: 2.6 * l },
        { x1: O, y1: _, x2: se, y2: ue, width: 2.3 * l },
      ];
    for (let Ne = 0; Ne < N.length; Ne++) {
      const X = N[Ne];
      ((e.fillStyle = v),
        e.beginPath(),
        e.arc(X.x1, X.y1, X.width * 0.52, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = y),
        (e.lineWidth = X.width),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(X.x1, X.y1),
        e.lineTo(X.x2, X.y2),
        e.stroke(),
        (e.strokeStyle = w),
        (e.lineWidth = 1 * l),
        e.beginPath(),
        e.moveTo(X.x1, X.y1),
        e.lineTo(X.x2, X.y2),
        e.stroke(),
        !o &&
          Ne >= 2 &&
          ((e.strokeStyle = T),
          (e.lineWidth = 0.7 * l),
          e.beginPath(),
          e.moveTo(X.x1 + 0.3 * l, X.y1 - 0.7 * l),
          e.lineTo(X.x2 + 0.3 * l, X.y2 - 0.7 * l),
          e.stroke()));
    }
    const Ee = se + 2.8 * l,
      ne = ue + 0.5 * l;
    if (
      ((e.fillStyle = p),
      e.beginPath(),
      e.ellipse(Ee, ne, 2.8 * l, 2.2 * l, 0.3, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = y),
      e.beginPath(),
      e.ellipse(
        Ee - 0.8 * l,
        ne + 0.3 * l,
        2 * l,
        1.8 * l,
        0.3,
        0,
        Math.PI * 2,
      ),
      e.fill(),
      (e.strokeStyle = v),
      (e.lineWidth = 1.4 * l),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(Ee + 1.8 * l, ne),
      e.quadraticCurveTo(
        Ee + 4.6 * l,
        ne + 1.2 * l,
        Ee + 3.8 * l,
        ne + 4.2 * l,
      ),
      e.stroke(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(Ee + 3.8 * l, ne + 4.2 * l, 0.7 * l, 0, Math.PI * 2),
      e.fill(),
      !o)
    ) {
      const Ne = Math.sin(t.animTimer * 4) * 0.3 + 0.7;
      ((e.fillStyle = p),
        (e.shadowColor = p),
        (e.shadowBlur = 6 * l * Ne),
        e.beginPath(),
        e.arc(Ee + 3.8 * l, ne + 4.4 * l, 1.2 * l * Ne, 0, Math.PI * 2),
        e.fill(),
        (e.shadowBlur = 0));
      const X = (t.animTimer * 1.6) % 1;
      X < 0.45 &&
        ((e.fillStyle = p),
        e.beginPath(),
        e.arc(
          Ee + 3.8 * l,
          ne + 4.4 * l + X * 7 * l,
          0.8 * l * (1 - X),
          0,
          Math.PI * 2,
        ),
        e.fill());
    }
    const ke = 0,
      G = -4.5 * l + g;
    ((e.fillStyle = y),
      e.beginPath(),
      e.ellipse(ke, G, 7.8 * l, 5 * l, 0, 0, Math.PI * 2),
      e.fill());
    const de = 6;
    for (let Ne = 0; Ne < de; Ne++) {
      const X = -6.2 * l + Ne * 2.3 * l,
        C = 2.4 * l,
        I = (4.8 - Math.abs(Ne - 2.5) * 0.4) * l;
      ((e.fillStyle = Ne % 2 === 0 ? y : w),
        e.beginPath(),
        e.roundRect(X - C / 2, G - I / 2, C, I, 1.2 * l),
        e.fill(),
        (e.strokeStyle = v),
        (e.lineWidth = 0.8 * l),
        e.beginPath(),
        e.moveTo(X + C / 2, G - I / 2),
        e.lineTo(X + C / 2, G + I / 2),
        e.stroke(),
        o ||
          ((e.fillStyle = T),
          e.beginPath(),
          e.ellipse(X, G, 0.8 * l, 0.5 * l, 0, 0, Math.PI * 2),
          e.fill()));
    }
    ((e.strokeStyle = w),
      (e.lineWidth = 1 * l),
      e.beginPath(),
      e.ellipse(ke, G, 7.8 * l, 5 * l, 0, 0, Math.PI * 2),
      e.stroke());
    const W = 6.2 * l,
      le = -4.5 * l + g;
    ((e.fillStyle = y),
      e.beginPath(),
      e.moveTo(W - 2.5 * l, le - 4.2 * l),
      e.lineTo(W + 3.2 * l, le - 3.2 * l),
      e.lineTo(W + 4.2 * l, le - 1.2 * l),
      e.lineTo(W + 3.8 * l, le),
      e.lineTo(W + 4.2 * l, le + 1.2 * l),
      e.lineTo(W + 3.2 * l, le + 3.2 * l),
      e.lineTo(W - 2.5 * l, le + 4.2 * l),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = w),
      (e.lineWidth = 1.1 * l),
      e.stroke());
    const te = t.isCapturingPlayer
      ? Math.abs(Math.sin(t.animTimer * 18)) * 1.4 * l
      : Math.sin(t.animTimer * 6) * 0.4 * l;
    ((e.fillStyle = v),
      e.beginPath(),
      e.moveTo(W + 3.8 * l, le - 1.2 * l),
      e.lineTo(W + 5.5 * l, le - 1.8 * l + te),
      e.lineTo(W + 4.8 * l, le - 0.4 * l),
      e.closePath(),
      e.fill(),
      e.beginPath(),
      e.moveTo(W + 3.8 * l, le + 1.2 * l),
      e.lineTo(W + 5.5 * l, le + 1.8 * l - te),
      e.lineTo(W + 4.8 * l, le + 0.4 * l),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#090d16"),
      e.beginPath(),
      e.arc(W + 1.2 * l, le - 0.9 * l, 1 * l, 0, Math.PI * 2),
      e.arc(W + 1.2 * l, le + 0.9 * l, 1 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(W + 1.4 * l, le - 1.1 * l, 0.4 * l, 0, Math.PI * 2),
      e.arc(W + 1.4 * l, le + 0.7 * l, 0.4 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = p));
    for (const Ne of [-2.6 * l, -2.1 * l, 2.1 * l, 2.6 * l])
      (e.beginPath(),
        e.arc(W + 2.5 * l, le + Ne, 0.5 * l, 0, Math.PI * 2),
        e.fill());
    for (let Ne = 0; Ne < 4; Ne++) {
      const X = f + Ne * 1.5 + Math.PI,
        C = c
          ? Math.sin(X) * 2.2 * l
          : Math.sin(t.animTimer * 1.2 + Ne + 2) * 0.35 * l,
        I = c ? Math.max(0, -Math.cos(X)) * 1.8 * l : 0,
        be = -5 * l + Ne * 3.4 * l,
        Me = -4 * l + g;
      ((e.strokeStyle = y),
        (e.lineWidth = 1.4 * l),
        (e.lineCap = "round"),
        (e.lineJoin = "round"),
        e.beginPath(),
        e.moveTo(be, Me));
      const Te = be - 1.5 * l + C * 0.7,
        Fe = Me + 5.5 * l - I;
      e.lineTo(Te, Fe);
      const _e = Te - 2.5 * l + C,
        xe = Me + 9.5 * l;
      (e.lineTo(_e, xe),
        e.stroke(),
        (e.fillStyle = w),
        e.beginPath(),
        e.arc(Te, Fe, 1.1 * l, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = v),
        (e.lineWidth = 1 * l),
        e.beginPath(),
        e.moveTo(_e, xe),
        e.lineTo(_e - 1.2 * l, xe + 1.2 * l),
        e.stroke());
    }
    const isAtk = t.isGiantScorpion
      ? !!(t.clawAttackTimer && t.clawAttackTimer > 0)
      : !!(t.attackTimer && t.attackTimer > 0 && t.attackType !== "stinger");
    const atkProg = isAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.clawAttackTimer / (t.clawAttackDuration || 0.36) : t.attackTimer / (t.attackDuration || 0.32))))
      : 0;
    const clawTgtX = t.isGiantScorpion && t.clawTargetX !== void 0 ? t.clawTargetX : t.attackTargetX;
    const clawTgtY = t.isGiantScorpion && t.clawTargetY !== void 0 ? t.clawTargetY : t.attackTargetY;
    const activeSide = t.attackClawSide || -1;
    const baseOe = isStingerAtk && !isAtk ? 0.55 : Math.sin(t.animTimer * 4) * 0.35 + 0.35;
    for (const clawSide of [1, -1]) {
      const isThisClaw = (isAtk && activeSide === clawSide) || (t.isCapturingPlayer && activeSide === clawSide);
      let thrustX = 0;
      let thrustY = 0;
      let clawOpen = baseOe;
      if (t.isCapturingPlayer && activeSide === clawSide) {
        const capProg = Math.max(0, Math.min(1, t.captureProgress || 0));
        const restClawTipX = W + 19.5 * l,
          restClawTipY = le + clawSide * 9.5 * l,
          mouthLocalX = W + 4.8 * l,
          mouthLocalY = le;
        const startLocalX = t.captureStartLocalX !== void 0 ? t.captureStartLocalX : restClawTipX;
        const startLocalY = t.captureStartLocalY !== void 0 ? t.captureStartLocalY : restClawTipY;
        const curLocalX = startLocalX + (mouthLocalX - startLocalX) * capProg;
        const curLocalY = startLocalY + (mouthLocalY - startLocalY) * capProg;
        thrustX = curLocalX - restClawTipX;
        thrustY = curLocalY - restClawTipY;
        clawOpen = 0.02;
      } else if (isThisClaw) {
        const strikePower = Math.sin(atkProg * Math.PI);
        if (clawTgtX !== void 0 && clawTgtY !== void 0) {
          const restClawTipX = W + 19.5 * l,
            restClawTipY = le + clawSide * 9.5 * l,
            targetLocalX = (clawTgtX - t.x) * u,
            targetLocalY = clawTgtY - t.y;
          thrustX = (targetLocalX - restClawTipX) * strikePower;
          thrustY = (targetLocalY - restClawTipY) * strikePower;
        } else {
          thrustX = strikePower * 5.5 * l;
          thrustY = -clawSide * strikePower * 1.2 * l;
        }
        if (atkProg < 0.35) {
          clawOpen = 0.35 + (0.75 - 0.35) * (atkProg / 0.35);
        } else if (atkProg < 0.65) {
          clawOpen = 0.04;
        } else {
          clawOpen = 0.04 + (baseOe - 0.04) * ((atkProg - 0.65) / 0.35);
        }
      } else if (isAtk) {
        const strikePower = Math.sin(atkProg * Math.PI);
        thrustX = -strikePower * 0.8 * l;
      }
      drawScorpionClaw(e, l, W, le, clawSide, clawOpen, y, w, v, T, S, o, thrustX, thrustY);
    }
    e.restore();
  }
  function drawScorpionClaw(e, t, l, o, u, m, c, f, g, y, w, v, thrustX = 0, thrustY = 0) {
    const T = u === 1 ? 0.35 : -0.35,
      S = l + 1.5 * t,
      p = o + u * 2.2 * t,
      j = S + 4.5 * t + thrustX * 0.4,
      P = p + u * 4.5 * t + thrustY * 0.4;
    ((e.strokeStyle = c),
      (e.lineWidth = 2.4 * t),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(S, p),
      e.lineTo(j, P),
      e.stroke(),
      (e.fillStyle = f),
      e.beginPath(),
      e.arc(j, P, 1.8 * t, 0, Math.PI * 2),
      e.fill());
    const A = j + 5.5 * t + thrustX * 0.6,
      x = P + u * 1.5 * t + thrustY * 0.6;
    ((e.strokeStyle = c),
      (e.lineWidth = 2.8 * t),
      e.beginPath(),
      e.moveTo(j, P),
      e.lineTo(A, x),
      e.stroke(),
      e.save(),
      e.translate(A, x),
      e.rotate(T),
      (e.fillStyle = w),
      e.beginPath(),
      e.ellipse(3.2 * t, 0, 3.8 * t, 2.5 * t, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = f),
      (e.lineWidth = 1 * t),
      e.stroke(),
      v ||
        ((e.fillStyle = y),
        e.beginPath(),
        e.ellipse(2.5 * t, -0.8 * t, 2 * t, 0.7 * t, 0.15, 0, Math.PI * 2),
        e.fill()),
      (e.fillStyle = f),
      e.beginPath(),
      e.moveTo(5.8 * t, -1.2 * t),
      e.quadraticCurveTo(9.5 * t, -2.5 * t, 11.5 * t, 0.2 * t),
      e.quadraticCurveTo(8.5 * t, -0.5 * t, 5.8 * t, 0.5 * t),
      e.closePath(),
      e.fill());
    const M = u === 1 ? -m : m;
    (e.save(),
      e.translate(5.5 * t, 1 * t),
      e.rotate(M),
      (e.fillStyle = g),
      e.beginPath(),
      e.moveTo(0, 0),
      e.quadraticCurveTo(3.5 * t, 2.2 * t, 6 * t, 0.2 * t),
      e.quadraticCurveTo(3 * t, 0.6 * t, 0, -1 * t),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = y),
      (e.lineWidth = 0.8 * t));
    for (let $ = 1; $ <= 3; $++)
      (e.beginPath(),
        e.moveTo($ * 1.3 * t, 0),
        e.lineTo($ * 1.3 * t, 0.7 * t),
        e.stroke());
    (e.restore(), e.restore());
  }
  function drawScorpionFront(e, t, l, o) {
    e.save();
    const spd = Math.hypot(t.vx || 0, t.vy || 0),
      m = spd > 0.04,
      stepRate = Math.max(1.8, Math.min(4.2, (spd / Math.max(0.5, (t.scale || 1) * 0.65)) * 4.5)),
      c = m ? t.animTimer * stepRate : t.animTimer * 1.2,
      f = m ? Math.sin(c * 2) * 0.5 * l : Math.sin(t.animTimer * 1.5) * 0.3 * l,
      g = Math.max(-0.2, Math.min(0.2, (t.vx / (t.speed || 1)) * 0.18));
    e.rotate(g);
    const y = o ? "#ffffff" : t.color || "#d97706",
      w = o ? "#e2e8f0" : "#78350f",
      v = o ? "#cbd5e1" : "#451a03",
      T = o ? "#ffffff" : "#fef08a",
      S = o ? "#fee2e2" : "#b45309",
      p = o ? "#ffffff" : t.accentColor || "#ef4444";
    ((e.fillStyle = "rgba(15, 23, 42, 0.42)"),
      e.beginPath(),
      e.ellipse(0, 3 * l, 10 * l, 13 * l, 0, 0, Math.PI * 2),
      e.ellipse(-10 * l, 8 * l, 5 * l, 2.8 * l, -0.3, 0, Math.PI * 2),
      e.ellipse(10 * l, 8 * l, 5 * l, 2.8 * l, 0.3, 0, Math.PI * 2),
      e.fill());
    for (const te of [-1, 1])
      for (let oe = 0; oe < 4; oe++) {
        const Ne = c + oe * 1.5 + (te === 1 ? Math.PI : 0),
          X = m
            ? Math.sin(Ne) * 2.1 * l
            : Math.sin(t.animTimer * 1.2 + oe) * 0.35 * l,
          C = m ? Math.max(0, -Math.cos(Ne)) * 1.6 * l : 0,
          I = te * 4.2 * l,
          be = -5 * l + oe * 2.4 * l + f,
          Me = te * (9.5 * l + Math.abs(X) * 0.3),
          Te = be - 3.2 * l - C + (oe - 1.5) * 1.2 * l,
          Fe = te * 13.5 * l,
          _e = be + 3 * l + X;
        ((e.strokeStyle = te === -1 ? y : w),
          (e.lineWidth = 1.3 * l),
          (e.lineCap = "round"),
          (e.lineJoin = "round"),
          e.beginPath(),
          e.moveTo(I, be),
          e.lineTo(Me, Te),
          e.lineTo(Fe, _e),
          e.stroke(),
          (e.fillStyle = w),
          e.beginPath(),
          e.arc(Me, Te, 1 * l, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = v),
          (e.lineWidth = 0.9 * l),
          e.beginPath(),
          e.moveTo(Fe, _e),
          e.lineTo(Fe + te * 1.2 * l, _e + 1.2 * l),
          e.stroke());
      }
    const j = -2.5 * l + f;
    ((e.fillStyle = y),
      e.beginPath(),
      e.ellipse(0, j, 6.2 * l, 8.5 * l, 0, 0, Math.PI * 2),
      e.fill());
    const P = 6;
    for (let te = 0; te < P; te++) {
      const oe = j - 6 * l + te * 2.1 * l,
        Ne = (6 - Math.abs(te - 2.5) * 0.4) * 2 * l,
        X = 2.2 * l;
      ((e.fillStyle = te % 2 === 0 ? y : w),
        e.beginPath(),
        e.roundRect(-Ne / 2, oe - X / 2, Ne, X, 1.2 * l),
        e.fill(),
        (e.strokeStyle = v),
        (e.lineWidth = 0.8 * l),
        e.beginPath(),
        e.moveTo(-Ne / 2, oe + X / 2),
        e.lineTo(Ne / 2, oe + X / 2),
        e.stroke(),
        o ||
          ((e.fillStyle = T),
          e.beginPath(),
          e.ellipse(0, oe, 0.7 * l, 0.5 * l, 0, 0, Math.PI * 2),
          e.fill()));
    }
    ((e.strokeStyle = w),
      (e.lineWidth = 1 * l),
      e.beginPath(),
      e.ellipse(0, j, 6.2 * l, 8.5 * l, 0, 0, Math.PI * 2),
      e.stroke());
    const A = 4.2 * l + f;
    ((e.fillStyle = y),
      e.beginPath(),
      e.moveTo(-4.5 * l, A - 3.5 * l),
      e.lineTo(4.5 * l, A - 3.5 * l),
      e.lineTo(3.4 * l, A + 2.5 * l),
      e.lineTo(1.8 * l, A + 3.8 * l),
      e.lineTo(-1.8 * l, A + 3.8 * l),
      e.lineTo(-3.4 * l, A + 2.5 * l),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = w),
      (e.lineWidth = 1.1 * l),
      e.stroke());
    const x = t.isCapturingPlayer
      ? Math.abs(Math.sin(t.animTimer * 18)) * 1.4 * l
      : Math.sin(t.animTimer * 6) * 0.4 * l;
    ((e.fillStyle = v),
      e.beginPath(),
      e.moveTo(-1.8 * l, A + 3.2 * l),
      e.lineTo(-0.8 * l - x, A + 5.5 * l),
      e.lineTo(-0.2 * l, A + 3.8 * l),
      e.closePath(),
      e.fill(),
      e.beginPath(),
      e.moveTo(1.8 * l, A + 3.2 * l),
      e.lineTo(0.8 * l + x, A + 5.5 * l),
      e.lineTo(0.2 * l, A + 3.8 * l),
      e.closePath(),
      e.fill(),
      (e.fillStyle = "#090d16"),
      e.beginPath(),
      e.arc(-1.5 * l, A + 0.5 * l, 1.1 * l, 0, Math.PI * 2),
      e.arc(1.5 * l, A + 0.5 * l, 1.1 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#ffffff"),
      e.beginPath(),
      e.arc(-1.3 * l, A + 0.3 * l, 0.45 * l, 0, Math.PI * 2),
      e.arc(1.7 * l, A + 0.3 * l, 0.45 * l, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = p),
      e.beginPath(),
      e.arc(-3 * l, A + 1.2 * l, 0.55 * l, 0, Math.PI * 2),
      e.arc(3 * l, A + 1.2 * l, 0.55 * l, 0, Math.PI * 2),
      e.fill());
    const isStingerAtk = t.isGiantScorpion
      ? !!(t.stingerAttackTimer && t.stingerAttackTimer > 0)
      : (t.attackType === "stinger" && t.attackTimer > 0);
    const stingerProg = isStingerAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.stingerAttackTimer / (t.stingerAttackDuration || 0.44) : t.attackTimer / (t.attackDuration || 0.38))))
      : 0;
    const stingerTgtX = t.isGiantScorpion && t.stingerTargetX !== void 0 ? t.stingerTargetX : t.attackTargetX;
    const stingerTgtY = t.isGiantScorpion && t.stingerTargetY !== void 0 ? t.stingerTargetY : t.attackTargetY;
    let stingerThrustY = 0;
    let stingerStrikePower = 0;
    if (isStingerAtk) {
      if (stingerProg < 0.25) {
        const prep = Math.sin((stingerProg / 0.25) * Math.PI * 0.5);
        stingerThrustY = -prep * 3 * l;
      } else if (stingerProg < 0.65) {
        const snap = Math.sin(((stingerProg - 0.25) / 0.4) * Math.PI);
        stingerStrikePower = snap;
        stingerThrustY = -3 * l * (1 - (stingerProg - 0.25) / 0.4) + snap * 14 * l;
      } else {
        const ret = Math.sin(((1 - stingerProg) / 0.35) * Math.PI * 0.5);
        stingerThrustY = ret * 5 * l;
      }
    }

    const isAtk = t.isGiantScorpion
      ? !!(t.clawAttackTimer && t.clawAttackTimer > 0)
      : !!(t.attackTimer && t.attackTimer > 0 && t.attackType !== "stinger");
    const atkProg = isAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.clawAttackTimer / (t.clawAttackDuration || 0.36) : t.attackTimer / (t.attackDuration || 0.32))))
      : 0;
    const clawTgtX = t.isGiantScorpion && t.clawTargetX !== void 0 ? t.clawTargetX : t.attackTargetX;
    const clawTgtY = t.isGiantScorpion && t.clawTargetY !== void 0 ? t.clawTargetY : t.attackTargetY;
    const activeSide = t.attackClawSide || -1;
    const baseM = isStingerAtk && !isAtk ? 0.55 : Math.sin(t.animTimer * 4) * 0.35 + 0.35;
    for (const te of [-1, 1]) {
      const isThisClaw = (isAtk && activeSide === te) || (t.isCapturingPlayer && activeSide === te);
      let thrustY = 0;
      let thrustX = 0;
      let clawOpen = baseM;
      if (t.isCapturingPlayer && activeSide === te) {
        const capProg = Math.max(0, Math.min(1, t.captureProgress || 0));
        const restClawTipX = te * 6.5 * l,
          restClawTipY = A + 14.5 * l,
          mouthLocalX = 0,
          mouthLocalY = A + 4.8 * l;
        const startLocalX = t.captureStartLocalX !== void 0 ? t.captureStartLocalX : restClawTipX;
        const startLocalY = t.captureStartLocalY !== void 0 ? t.captureStartLocalY : restClawTipY;
        const curLocalX = startLocalX + (mouthLocalX - startLocalX) * capProg;
        const curLocalY = startLocalY + (mouthLocalY - startLocalY) * capProg;
        thrustX = curLocalX - restClawTipX;
        thrustY = curLocalY - restClawTipY;
        clawOpen = 0.02;
      } else if (isThisClaw) {
        const strikePower = Math.sin(atkProg * Math.PI);
        if (clawTgtX !== void 0 && clawTgtY !== void 0) {
          const restClawTipX = te * 6.5 * l,
            restClawTipY = A + 14.5 * l,
            targetLocalX = clawTgtX - t.x,
            targetLocalY = clawTgtY - t.y;
          thrustX = (targetLocalX - restClawTipX) * strikePower;
          thrustY = (targetLocalY - restClawTipY) * strikePower;
        } else {
          thrustY = strikePower * 6.5 * l;
          thrustX = -te * strikePower * 1.5 * l;
        }
        if (atkProg < 0.35) {
          clawOpen = 0.35 + (0.75 - 0.35) * (atkProg / 0.35);
        } else if (atkProg < 0.65) {
          clawOpen = 0.04;
        } else {
          clawOpen = 0.04 + (baseM - 0.04) * ((atkProg - 0.65) / 0.35);
        }
      } else if (isAtk) {
        const strikePower = Math.sin(atkProg * Math.PI);
        thrustY = -strikePower * 0.8 * l;
      }
      const oe = te * 3.8 * l,
        Ne = A - 1.5 * l,
        X = te * 8.5 * l + thrustX * 0.4,
        C = A + 1.5 * l + thrustY * 0.4;
      ((e.strokeStyle = y),
        (e.lineWidth = 2.4 * l),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(oe, Ne),
        e.lineTo(X, C),
        e.stroke(),
        (e.fillStyle = w),
        e.beginPath(),
        e.arc(X, C, 1.7 * l, 0, Math.PI * 2),
        e.fill());
      const I = te * 9.8 * l + thrustX,
        be = A + 6.5 * l + thrustY;
      ((e.strokeStyle = y),
        (e.lineWidth = 2.8 * l),
        (e.beginPath(),
        e.moveTo(X, C),
        e.lineTo(I, be),
        e.stroke()),
        e.save(),
        e.translate(I, be),
        e.rotate(te * 0.35),
        (e.fillStyle = S),
        e.beginPath(),
        e.ellipse(0, 3.2 * l, 2.5 * l, 3.8 * l, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = w),
        (e.lineWidth = 1 * l),
        e.stroke(),
        o ||
          ((e.fillStyle = T),
          e.beginPath(),
          e.ellipse(-te * 0.8 * l, 2.5 * l, 0.7 * l, 2 * l, 0, 0, Math.PI * 2),
          e.fill()),
        (e.fillStyle = w),
        e.beginPath(),
        e.moveTo(-te * 1.2 * l, 5.8 * l),
        e.quadraticCurveTo(-te * 2.2 * l, 9.5 * l, 0, 11.5 * l),
        e.quadraticCurveTo(-te * 0.5 * l, 8.5 * l, te * 0.5 * l, 5.8 * l),
        e.closePath(),
        e.fill());
      const Me = te * -clawOpen;
      (e.save(),
        e.translate(te * 1 * l, 5.5 * l),
        e.rotate(Me),
        (e.fillStyle = v),
        e.beginPath(),
        e.moveTo(0, 0),
        e.quadraticCurveTo(te * 2 * l, 3.5 * l, 0, 6 * l),
        e.quadraticCurveTo(te * 0.6 * l, 3 * l, -te * 0.8 * l, 0),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = T),
        (e.lineWidth = 0.8 * l));
      for (let Te = 1; Te <= 3; Te++)
        (e.beginPath(),
          e.moveTo(0, Te * 1.3 * l),
          e.lineTo(te * 0.7 * l, Te * 1.3 * l),
          e.stroke());
      (e.restore(), e.restore());
    }
    const $ = Math.sin(t.animTimer * 2.8) * 2 * l,
      z = 0,
      K = j - 7.5 * l;
    let aimStingerX = 0,
      aimStingerY = stingerThrustY;
    if (isStingerAtk && stingerStrikePower > 0 && stingerTgtX !== void 0 && stingerTgtY !== void 0) {
      const restTipX = z + $,
        restTipY = K - 2.5 * l + 7.2 * l,
        targetLocalX = stingerTgtX - t.x,
        targetLocalY = stingerTgtY - t.y;
      aimStingerX = (targetLocalX - restTipX) * stingerStrikePower;
      aimStingerY = (targetLocalY - restTipY) * stingerStrikePower;
    }
    const V = z + $ * 0.2 + aimStingerX * 0.15,
      O = K - 4.2 * l,
      _ = z + $ * 0.45 + aimStingerX * 0.35,
      se = K - 8 * l - aimStingerY * 0.15,
      ue = z + $ * 0.7 + aimStingerX * 0.6,
      N = K - 10.5 * l - aimStingerY * 0.1,
      Ee = z + $ * 0.85 + aimStingerX * 0.8,
      ne = K - 7 * l + aimStingerY * 0.45,
      ke = z + $ + aimStingerX,
      G = K - 2.5 * l + aimStingerY,
      de = [
        { x1: z, y1: K, x2: V, y2: O, w: 4 * l },
        { x1: V, y1: O, x2: _, y2: se, w: 3.6 * l },
        { x1: _, y1: se, x2: ue, y2: N, w: 3.2 * l },
        { x1: ue, y1: N, x2: Ee, y2: ne, w: 2.8 * l },
        { x1: Ee, y1: ne, x2: ke, y2: G, w: 2.4 * l },
      ];
    for (let te = 0; te < de.length; te++) {
      const oe = de[te];
      ((e.fillStyle = v),
        e.beginPath(),
        e.arc(oe.x1, oe.y1, oe.w * 0.52, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = y),
        (e.lineWidth = oe.w),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(oe.x1, oe.y1),
        e.lineTo(oe.x2, oe.y2),
        e.stroke(),
        (e.strokeStyle = w),
        (e.lineWidth = 1 * l),
        e.beginPath(),
        e.moveTo(oe.x1, oe.y1),
        e.lineTo(oe.x2, oe.y2),
        e.stroke(),
        !o &&
          te >= 2 &&
          ((e.strokeStyle = T),
          (e.lineWidth = 0.7 * l),
          e.beginPath(),
          e.moveTo(oe.x1 - 0.5 * l, oe.y1),
          e.lineTo(oe.x2 - 0.5 * l, oe.y2),
          e.stroke()));
    }
    const W = ke,
      le = G + 1.2 * l;
    if (
      ((e.fillStyle = p),
      e.beginPath(),
      e.ellipse(W, le, 2.5 * l, 2.8 * l, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = y),
      e.beginPath(),
      e.ellipse(W, le - 0.8 * l, 2 * l, 1.8 * l, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = v),
      (e.lineWidth = 1.4 * l),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(W, le + 2 * l),
      e.quadraticCurveTo(W + 1.5 * l, le + 4.5 * l, W, le + 6 * l),
      e.stroke(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(W, le + 6 * l, 0.7 * l, 0, Math.PI * 2),
      e.fill(),
      !o)
    ) {
      const te = Math.sin(t.animTimer * 4) * 0.3 + 0.7;
      ((e.fillStyle = p),
        (e.shadowColor = p),
        (e.shadowBlur = 6 * l * te),
        e.beginPath(),
        e.arc(W, le + 6.2 * l, 1.2 * l * te, 0, Math.PI * 2),
        e.fill(),
        (e.shadowBlur = 0));
      const oe = (t.animTimer * 1.6) % 1;
      oe < 0.45 &&
        ((e.fillStyle = p),
        e.beginPath(),
        e.arc(W, le + 6.2 * l + oe * 7 * l, 0.8 * l * (1 - oe), 0, Math.PI * 2),
        e.fill());
    }
    e.restore();
  }
  function drawScorpionBack(e, t, l, o) {
    e.save();
    const spd = Math.hypot(t.vx || 0, t.vy || 0),
      m = spd > 0.04,
      stepRate = Math.max(1.8, Math.min(4.2, (spd / Math.max(0.5, (t.scale || 1) * 0.65)) * 4.5)),
      c = m ? t.animTimer * stepRate : t.animTimer * 1.2,
      f = m ? Math.sin(c * 2) * 0.5 * l : Math.sin(t.animTimer * 1.5) * 0.3 * l,
      g = Math.max(-0.2, Math.min(0.2, (t.vx / (t.speed || 1)) * 0.18));
    e.rotate(g);
    const y = o ? "#ffffff" : t.color || "#d97706",
      w = o ? "#e2e8f0" : "#78350f",
      v = o ? "#cbd5e1" : "#451a03",
      T = o ? "#ffffff" : "#fef08a",
      S = o ? "#fee2e2" : "#b45309",
      p = o ? "#ffffff" : t.accentColor || "#ef4444";
    ((e.fillStyle = "rgba(15, 23, 42, 0.42)"),
      e.beginPath(),
      e.ellipse(0, 1 * l, 10 * l, 13 * l, 0, 0, Math.PI * 2),
      e.ellipse(-10 * l, -8 * l, 5 * l, 2.8 * l, 0.3, 0, Math.PI * 2),
      e.ellipse(10 * l, -8 * l, 5 * l, 2.8 * l, -0.3, 0, Math.PI * 2),
      e.fill());
    for (const te of [-1, 1])
      for (let oe = 0; oe < 4; oe++) {
        const Ne = c + oe * 1.5 + (te === 1 ? Math.PI : 0),
          X = m
            ? Math.sin(Ne) * 2.1 * l
            : Math.sin(t.animTimer * 1.2 + oe) * 0.35 * l,
          C = m ? Math.max(0, -Math.cos(Ne)) * 1.6 * l : 0,
          I = te * 4.2 * l,
          be = 5 * l - oe * 2.4 * l + f,
          Me = te * (9.5 * l + Math.abs(X) * 0.3),
          Te = be - 3.2 * l - C - (oe - 1.5) * 1.2 * l,
          Fe = te * 13.5 * l,
          _e = be - 3 * l - X;
        ((e.strokeStyle = te === -1 ? y : w),
          (e.lineWidth = 1.3 * l),
          (e.lineCap = "round"),
          (e.lineJoin = "round"),
          e.beginPath(),
          e.moveTo(I, be),
          e.lineTo(Me, Te),
          e.lineTo(Fe, _e),
          e.stroke(),
          (e.fillStyle = w),
          e.beginPath(),
          e.arc(Me, Te, 1 * l, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = v),
          (e.lineWidth = 0.9 * l),
          e.beginPath(),
          e.moveTo(Fe, _e),
          e.lineTo(Fe + te * 1.2 * l, _e - 1.2 * l),
          e.stroke());
      }
    const j = 2.5 * l + f;
    ((e.fillStyle = y),
      e.beginPath(),
      e.ellipse(0, j, 6.2 * l, 8.5 * l, 0, 0, Math.PI * 2),
      e.fill());
    const P = 6;
    for (let te = 0; te < P; te++) {
      const oe = j + 6 * l - te * 2.1 * l,
        Ne = (6 - Math.abs(te - 2.5) * 0.4) * 2 * l,
        X = 2.2 * l;
      ((e.fillStyle = te % 2 === 0 ? y : w),
        e.beginPath(),
        e.roundRect(-Ne / 2, oe - X / 2, Ne, X, 1.2 * l),
        e.fill(),
        (e.strokeStyle = v),
        (e.lineWidth = 0.8 * l),
        e.beginPath(),
        e.moveTo(-Ne / 2, oe - X / 2),
        e.lineTo(Ne / 2, oe - X / 2),
        e.stroke(),
        o ||
          ((e.fillStyle = T),
          e.beginPath(),
          e.ellipse(0, oe, 0.7 * l, 0.5 * l, 0, 0, Math.PI * 2),
          e.fill()));
    }
    ((e.strokeStyle = w),
      (e.lineWidth = 1 * l),
      e.beginPath(),
      e.ellipse(0, j, 6.2 * l, 8.5 * l, 0, 0, Math.PI * 2),
      e.stroke());
    const A = -4.2 * l + f;
    ((e.fillStyle = y),
      e.beginPath(),
      e.moveTo(-4.5 * l, A + 3.5 * l),
      e.lineTo(4.5 * l, A + 3.5 * l),
      e.lineTo(3.4 * l, A - 2.5 * l),
      e.lineTo(1.8 * l, A - 3.8 * l),
      e.lineTo(-1.8 * l, A - 3.8 * l),
      e.lineTo(-3.4 * l, A - 2.5 * l),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = w),
      (e.lineWidth = 1.1 * l),
      e.stroke());
    const x = t.isCapturingPlayer
      ? Math.abs(Math.sin(t.animTimer * 18)) * 1.4 * l
      : Math.sin(t.animTimer * 6) * 0.4 * l;
    ((e.fillStyle = v),
      e.beginPath(),
      e.moveTo(-1.8 * l, A - 3.2 * l),
      e.lineTo(-0.8 * l - x, A - 5.5 * l),
      e.lineTo(-0.2 * l, A - 3.8 * l),
      e.closePath(),
      e.fill(),
      e.beginPath(),
      e.moveTo(1.8 * l, A - 3.2 * l),
      e.lineTo(0.8 * l + x, A - 5.5 * l),
      e.lineTo(0.2 * l, A - 3.8 * l),
      e.closePath(),
      e.fill());
    const isStingerAtk = t.isGiantScorpion
      ? !!(t.stingerAttackTimer && t.stingerAttackTimer > 0)
      : (t.attackType === "stinger" && t.attackTimer > 0);
    const stingerProg = isStingerAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.stingerAttackTimer / (t.stingerAttackDuration || 0.44) : t.attackTimer / (t.attackDuration || 0.38))))
      : 0;
    const stingerTgtX = t.isGiantScorpion && t.stingerTargetX !== void 0 ? t.stingerTargetX : t.attackTargetX;
    const stingerTgtY = t.isGiantScorpion && t.stingerTargetY !== void 0 ? t.stingerTargetY : t.attackTargetY;
    let stingerThrustY = 0;
    let stingerStrikePower = 0;
    if (isStingerAtk) {
      if (stingerProg < 0.25) {
        const prep = Math.sin((stingerProg / 0.25) * Math.PI * 0.5);
        stingerThrustY = prep * 3 * l;
      } else if (stingerProg < 0.65) {
        const snap = Math.sin(((stingerProg - 0.25) / 0.4) * Math.PI);
        stingerStrikePower = snap;
        stingerThrustY = 3 * l * (1 - (stingerProg - 0.25) / 0.4) - snap * 14 * l;
      } else {
        const ret = Math.sin(((1 - stingerProg) / 0.35) * Math.PI * 0.5);
        stingerThrustY = -ret * 5 * l;
      }
    }

    const isAtk = t.isGiantScorpion
      ? !!(t.clawAttackTimer && t.clawAttackTimer > 0)
      : !!(t.attackTimer && t.attackTimer > 0 && t.attackType !== "stinger");
    const atkProg = isAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.clawAttackTimer / (t.clawAttackDuration || 0.36) : t.attackTimer / (t.attackDuration || 0.32))))
      : 0;
    const clawTgtX = t.isGiantScorpion && t.clawTargetX !== void 0 ? t.clawTargetX : t.attackTargetX;
    const clawTgtY = t.isGiantScorpion && t.clawTargetY !== void 0 ? t.clawTargetY : t.attackTargetY;
    const activeSide = t.attackClawSide || -1;
    const baseM = isStingerAtk && !isAtk ? 0.55 : Math.sin(t.animTimer * 4) * 0.35 + 0.35;
    for (const te of [-1, 1]) {
      const isThisClaw = (isAtk && activeSide === te) || (t.isCapturingPlayer && activeSide === te);
      let thrustY = 0;
      let thrustX = 0;
      let clawOpen = baseM;
      if (t.isCapturingPlayer && activeSide === te) {
        const capProg = Math.max(0, Math.min(1, t.captureProgress || 0));
        const restClawTipX = te * 6.5 * l,
          restClawTipY = A - 14.5 * l,
          mouthLocalX = 0,
          mouthLocalY = A - 4.8 * l;
        const startLocalX = t.captureStartLocalX !== void 0 ? t.captureStartLocalX : restClawTipX;
        const startLocalY = t.captureStartLocalY !== void 0 ? t.captureStartLocalY : restClawTipY;
        const curLocalX = startLocalX + (mouthLocalX - startLocalX) * capProg;
        const curLocalY = startLocalY + (mouthLocalY - startLocalY) * capProg;
        thrustX = curLocalX - restClawTipX;
        thrustY = curLocalY - restClawTipY;
        clawOpen = 0.02;
      } else if (isThisClaw) {
        const strikePower = Math.sin(atkProg * Math.PI);
        if (clawTgtX !== void 0 && clawTgtY !== void 0) {
          const restClawTipX = te * 6.5 * l,
            restClawTipY = A - 14.5 * l,
            targetLocalX = clawTgtX - t.x,
            targetLocalY = clawTgtY - t.y;
          thrustX = (targetLocalX - restClawTipX) * strikePower;
          thrustY = (targetLocalY - restClawTipY) * strikePower;
        } else {
          thrustY = -strikePower * 6.5 * l;
          thrustX = -te * strikePower * 1.5 * l;
        }
        if (atkProg < 0.35) {
          clawOpen = 0.35 + (0.75 - 0.35) * (atkProg / 0.35);
        } else if (atkProg < 0.65) {
          clawOpen = 0.04;
        } else {
          clawOpen = 0.04 + (baseM - 0.04) * ((atkProg - 0.65) / 0.35);
        }
      } else if (isAtk) {
        const strikePower = Math.sin(atkProg * Math.PI);
        thrustY = strikePower * 0.8 * l;
      }
      const oe = te * 3.8 * l,
        Ne = A + 1.5 * l,
        X = te * 8.5 * l + thrustX * 0.4,
        C = A - 1.5 * l + thrustY * 0.4;
      ((e.strokeStyle = y),
        (e.lineWidth = 2.4 * l),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(oe, Ne),
        e.lineTo(X, C),
        e.stroke(),
        (e.fillStyle = w),
        e.beginPath(),
        e.arc(X, C, 1.7 * l, 0, Math.PI * 2),
        e.fill());
      const I = te * 9.8 * l + thrustX,
        be = A - 6.5 * l + thrustY;
      ((e.strokeStyle = y),
        (e.lineWidth = 2.8 * l),
        e.beginPath(),
        e.moveTo(X, C),
        e.lineTo(I, be),
        e.stroke(),
        e.save(),
        e.translate(I, be),
        e.rotate(-te * 0.35),
        (e.fillStyle = S),
        e.beginPath(),
        e.ellipse(0, -3.2 * l, 2.5 * l, 3.8 * l, 0, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = w),
        (e.lineWidth = 1 * l),
        e.stroke(),
        o ||
          ((e.fillStyle = T),
          e.beginPath(),
          e.ellipse(-te * 0.8 * l, -2.5 * l, 0.7 * l, 2 * l, 0, 0, Math.PI * 2),
          e.fill()),
        (e.fillStyle = w),
        e.beginPath(),
        e.moveTo(-te * 1.2 * l, -5.8 * l),
        e.quadraticCurveTo(-te * 2.2 * l, -9.5 * l, 0, -11.5 * l),
        e.quadraticCurveTo(-te * 0.5 * l, -8.5 * l, te * 0.5 * l, -5.8 * l),
        e.closePath(),
        e.fill());
      const Me = te * clawOpen;
      (e.save(),
        e.translate(te * 1 * l, -5.5 * l),
        e.rotate(Me),
        (e.fillStyle = v),
        e.beginPath(),
        e.moveTo(0, 0),
        e.quadraticCurveTo(te * 2 * l, -3.5 * l, 0, -6 * l),
        e.quadraticCurveTo(te * 0.6 * l, -3 * l, -te * 0.8 * l, 0),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = T),
        (e.lineWidth = 0.8 * l));
      for (let Te = 1; Te <= 3; Te++)
        (e.beginPath(),
          e.moveTo(0, -Te * 1.3 * l),
          e.lineTo(te * 0.7 * l, -Te * 1.3 * l),
          e.stroke());
      (e.restore(), e.restore());
    }
    const $ = Math.sin(t.animTimer * 2.8) * 2 * l,
      z = 0,
      K = j + 7.5 * l;
    let aimStingerX = 0,
      aimStingerY = stingerThrustY;
    if (isStingerAtk && stingerStrikePower > 0 && stingerTgtX !== void 0 && stingerTgtY !== void 0) {
      const restTipX = z + $,
        restTipY = K + 2.5 * l - 7.2 * l,
        targetLocalX = stingerTgtX - t.x,
        targetLocalY = stingerTgtY - t.y;
      aimStingerX = (targetLocalX - restTipX) * stingerStrikePower;
      aimStingerY = (targetLocalY - restTipY) * stingerStrikePower;
    }
    const V = z + $ * 0.2 + aimStingerX * 0.15,
      O = K + 4.2 * l,
      _ = z + $ * 0.45 + aimStingerX * 0.35,
      se = K + 8 * l - aimStingerY * 0.15,
      ue = z + $ * 0.7 + aimStingerX * 0.6,
      N = K + 10.5 * l - aimStingerY * 0.1,
      Ee = z + $ * 0.85 + aimStingerX * 0.8,
      ne = K + 7 * l + aimStingerY * 0.45,
      ke = z + $ + aimStingerX,
      G = K + 2.5 * l + aimStingerY,
      de = [
        { x1: z, y1: K, x2: V, y2: O, w: 4 * l },
        { x1: V, y1: O, x2: _, y2: se, w: 3.6 * l },
        { x1: _, y1: se, x2: ue, y2: N, w: 3.2 * l },
        { x1: ue, y1: N, x2: Ee, y2: ne, w: 2.8 * l },
        { x1: Ee, y1: ne, x2: ke, y2: G, w: 2.4 * l },
      ];
    for (let te = 0; te < de.length; te++) {
      const oe = de[te];
      ((e.fillStyle = v),
        e.beginPath(),
        e.arc(oe.x1, oe.y1, oe.w * 0.52, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = y),
        (e.lineWidth = oe.w),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(oe.x1, oe.y1),
        e.lineTo(oe.x2, oe.y2),
        e.stroke(),
        (e.strokeStyle = w),
        (e.lineWidth = 1 * l),
        e.beginPath(),
        e.moveTo(oe.x1, oe.y1),
        e.lineTo(oe.x2, oe.y2),
        e.stroke(),
        !o &&
          te >= 2 &&
          ((e.strokeStyle = T),
          (e.lineWidth = 0.7 * l),
          e.beginPath(),
          e.moveTo(oe.x1 - 0.5 * l, oe.y1),
          e.lineTo(oe.x2 - 0.5 * l, oe.y2),
          e.stroke()));
    }
    const W = ke,
      le = G - 1.2 * l;
    if (
      ((e.fillStyle = p),
      e.beginPath(),
      e.ellipse(W, le, 2.5 * l, 2.8 * l, 0, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = y),
      e.beginPath(),
      e.ellipse(W, le + 0.8 * l, 2 * l, 1.8 * l, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = v),
      (e.lineWidth = 1.4 * l),
      (e.lineCap = "round"),
      e.beginPath(),
      e.moveTo(W, le - 2 * l),
      e.quadraticCurveTo(W + 1.5 * l, le - 4.5 * l, W, le - 6 * l),
      e.stroke(),
      (e.fillStyle = "#0f172a"),
      e.beginPath(),
      e.arc(W, le - 6 * l, 0.7 * l, 0, Math.PI * 2),
      e.fill(),
      !o)
    ) {
      const te = Math.sin(t.animTimer * 4) * 0.3 + 0.7;
      ((e.fillStyle = p),
        (e.shadowColor = p),
        (e.shadowBlur = 6 * l * te),
        e.beginPath(),
        e.arc(W, le - 6.2 * l, 1.2 * l * te, 0, Math.PI * 2),
        e.fill(),
        (e.shadowBlur = 0));
      const oe = (t.animTimer * 1.6) % 1;
      oe < 0.45 &&
        ((e.fillStyle = p),
        e.beginPath(),
        e.arc(W, le - 6.2 * l - oe * 7 * l, 0.8 * l * (1 - oe), 0, Math.PI * 2),
        e.fill());
    }
    e.restore();
  }
  function getScorpionHitColliders(t) {
    const l = t.scale || 1;
    const spd = Math.hypot(t.vx || 0, t.vy || 0),
      m = spd > 0.04,
      stepRate = Math.max(1.8, Math.min(4.2, (spd / Math.max(0.5, l * 0.65)) * 4.5)),
      c = m ? t.animTimer * stepRate : t.animTimer * 1.2,
      f = m ? Math.sin(c * 2) * 0.5 * l : Math.sin(t.animTimer * 1.5) * 0.3 * l;
    const isStingerAtk = t.isGiantScorpion
      ? !!(t.stingerAttackTimer && t.stingerAttackTimer > 0)
      : (t.attackType === "stinger" && t.attackTimer > 0);
    const stingerProg = isStingerAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.stingerAttackTimer / (t.stingerAttackDuration || 0.44) : t.attackTimer / (t.attackDuration || 0.38))))
      : 0;
    const stingerTgtX = t.isGiantScorpion && t.stingerTargetX !== void 0 ? t.stingerTargetX : t.attackTargetX;
    const stingerTgtY = t.isGiantScorpion && t.stingerTargetY !== void 0 ? t.stingerTargetY : t.attackTargetY;
    const isAtk = t.isGiantScorpion
      ? !!(t.clawAttackTimer && t.clawAttackTimer > 0)
      : !!(t.attackTimer && t.attackTimer > 0 && t.attackType !== "stinger");
    const atkProg = isAtk
      ? Math.max(0, Math.min(1, 1 - (t.isGiantScorpion ? t.clawAttackTimer / (t.clawAttackDuration || 0.36) : t.attackTimer / (t.attackDuration || 0.32))))
      : 0;
    const clawTgtX = t.isGiantScorpion && t.clawTargetX !== void 0 ? t.clawTargetX : t.attackTargetX;
    const clawTgtY = t.isGiantScorpion && t.clawTargetY !== void 0 ? t.clawTargetY : t.attackTargetY;
    const activeSide = t.attackClawSide || -1;
    const clawRadius = Math.max(3.5, 3.6 * l);
    const stingerRadius = Math.max(3.2, 3.2 * l);
    const colliders = [];

    if (t.facing === "down" || t.facing === "up") {
      const dirY = t.facing === "down" ? 1 : -1;
      const g = Math.max(-0.2, Math.min(0.2, (t.vx / (t.speed || 1)) * 0.18));
      const cosG = Math.cos(g),
        sinG = Math.sin(g);
      const toWorld = (lx, ly) => ({
        x: t.x + lx * cosG - ly * sinG,
        y: t.y + lx * sinG + ly * cosG,
      });
      const j = -dirY * 2.5 * l + f;
      const A = dirY * 4.2 * l + f;
      const mouthWp = toWorld(0, A + dirY * 4.8 * l);
      t._mouthWorldX = mouthWp.x;
      t._mouthWorldY = mouthWp.y;

      for (const te of [-1, 1]) {
        const isThisClaw = isAtk && activeSide === te;
        let thrustX = 0,
          thrustY = 0;
        const restClawTipX = te * 6.5 * l,
          restClawTipY = A + dirY * 14.5 * l;
        if (t.isCapturingPlayer && activeSide === te) {
          const capProg = Math.max(0, Math.min(1, t.captureProgress || 0));
          const mouthLocalX = 0,
            mouthLocalY = A + dirY * 4.8 * l;
          const startLocalX = t.captureStartLocalX !== void 0 ? t.captureStartLocalX : restClawTipX;
          const startLocalY = t.captureStartLocalY !== void 0 ? t.captureStartLocalY : restClawTipY;
          const curLocalX = startLocalX + (mouthLocalX - startLocalX) * capProg;
          const curLocalY = startLocalY + (mouthLocalY - startLocalY) * capProg;
          thrustX = curLocalX - restClawTipX;
          thrustY = curLocalY - restClawTipY;
        } else if (isThisClaw) {
          const strikePower = Math.sin(atkProg * Math.PI);
          if (clawTgtX !== void 0 && clawTgtY !== void 0) {
            const targetLocalX = clawTgtX - t.x,
              targetLocalY = clawTgtY - t.y;
            thrustX = (targetLocalX - restClawTipX) * strikePower;
            thrustY = (targetLocalY - restClawTipY) * strikePower;
          } else {
            thrustY = dirY * strikePower * 6.5 * l;
            thrustX = -te * strikePower * 1.5 * l;
          }
        } else if (isAtk) {
          const strikePower = Math.sin(atkProg * Math.PI);
          thrustY = -dirY * strikePower * 0.8 * l;
        }
        const wp = toWorld(restClawTipX + thrustX, restClawTipY + thrustY);
        colliders.push({
          part: te === -1 ? "claw_left" : "claw_right",
          side: te,
          x: wp.x,
          y: wp.y,
          radius: clawRadius,
          active: isThisClaw && atkProg >= 0.2 && atkProg <= 0.8,
        });
      }

      let stingerThrustY = 0,
        stingerStrikePower = 0;
      if (isStingerAtk) {
        if (stingerProg < 0.25) {
          const prep = Math.sin((stingerProg / 0.25) * Math.PI * 0.5);
          stingerThrustY = -dirY * prep * 3 * l;
        } else if (stingerProg < 0.65) {
          const snap = Math.sin(((stingerProg - 0.25) / 0.4) * Math.PI);
          stingerStrikePower = snap;
          stingerThrustY = -dirY * 3 * l * (1 - (stingerProg - 0.25) / 0.4) + dirY * snap * 14 * l;
        } else {
          const ret = Math.sin(((1 - stingerProg) / 0.35) * Math.PI * 0.5);
          stingerThrustY = dirY * ret * 5 * l;
        }
      }
      const $ = Math.sin(t.animTimer * 2.8) * 2 * l,
        z = 0,
        K = j - dirY * 7.5 * l;
      const restTipX = z + $,
        restTipY = K - dirY * 2.5 * l + dirY * 7.2 * l;
      let aimStingerX = 0,
        aimStingerY = stingerThrustY;
      if (isStingerAtk && stingerStrikePower > 0 && stingerTgtX !== void 0 && stingerTgtY !== void 0) {
        const targetLocalX = stingerTgtX - t.x,
          targetLocalY = stingerTgtY - t.y;
        aimStingerX = (targetLocalX - restTipX) * stingerStrikePower;
        aimStingerY = (targetLocalY - restTipY) * stingerStrikePower;
      }
      const wpStinger = toWorld(restTipX + aimStingerX, K - dirY * 2.5 * l + aimStingerY + dirY * 7.2 * l);
      colliders.push({
        part: "stinger",
        x: wpStinger.x,
        y: wpStinger.y,
        radius: stingerRadius,
        active: isStingerAtk && stingerProg >= 0.25 && stingerProg <= 0.75,
      });

      // Pernas do escorpião (4 de cada lado = 8 pernas)
      for (const te of [-1, 1]) {
        for (let oe = 0; oe < 4; oe++) {
          const Ne = c + oe * 1.5 + (te === 1 ? Math.PI : 0);
          const X = m
            ? Math.sin(Ne) * 2.1 * l
            : Math.sin(t.animTimer * 1.2 + oe) * 0.35 * l;
          const be = dirY === 1 ? (-5 * l + oe * 2.4 * l + f) : (5 * l - oe * 2.4 * l + f);
          const Fe = te * 13.5 * l;
          const _e = dirY === 1 ? (be + 3 * l + X) : (be - 3 * l - X);
          const wpLeg = toWorld(Fe, _e);
          colliders.push({
            part: `leg_${te === -1 ? "left" : "right"}_${oe}`,
            side: te,
            index: oe,
            x: wpLeg.x,
            y: wpLeg.y,
            radius: Math.max(7, 2.5 * l),
            active: !1,
            isLeg: !0,
          });
        }
      }
    } else {
      const u = t.facing === "left" ? -1 : 1;
      const W = 6.2 * l,
        le = -4.5 * l + f;
      t._mouthWorldX = t.x + (W + 4.8 * l) * u;
      t._mouthWorldY = t.y + le;
      for (const clawSide of [1, -1]) {
        const isThisClaw = isAtk && activeSide === clawSide;
        let thrustX = 0,
          thrustY = 0;
        const restClawTipX = W + 19.5 * l,
          restClawTipY = le + clawSide * 9.5 * l;
        if (t.isCapturingPlayer && activeSide === clawSide) {
          const capProg = Math.max(0, Math.min(1, t.captureProgress || 0));
          const mouthLocalX = W + 4.8 * l,
            mouthLocalY = le;
          const startLocalX = t.captureStartLocalX !== void 0 ? t.captureStartLocalX : restClawTipX;
          const startLocalY = t.captureStartLocalY !== void 0 ? t.captureStartLocalY : restClawTipY;
          const curLocalX = startLocalX + (mouthLocalX - startLocalX) * capProg;
          const curLocalY = startLocalY + (mouthLocalY - startLocalY) * capProg;
          thrustX = curLocalX - restClawTipX;
          thrustY = curLocalY - restClawTipY;
        } else if (isThisClaw) {
          const strikePower = Math.sin(atkProg * Math.PI);
          if (clawTgtX !== void 0 && clawTgtY !== void 0) {
            const targetLocalX = (clawTgtX - t.x) * u,
              targetLocalY = clawTgtY - t.y;
            thrustX = (targetLocalX - restClawTipX) * strikePower;
            thrustY = (targetLocalY - restClawTipY) * strikePower;
          } else {
            thrustX = strikePower * 5.5 * l;
            thrustY = -clawSide * strikePower * 1.2 * l;
          }
        } else if (isAtk) {
          const strikePower = Math.sin(atkProg * Math.PI);
          thrustX = -strikePower * 0.8 * l;
        }
        colliders.push({
          part: clawSide === -1 ? "claw_left" : "claw_right",
          side: clawSide,
          x: t.x + (restClawTipX + thrustX) * u,
          y: t.y + restClawTipY + thrustY,
          radius: clawRadius,
          active: isThisClaw && atkProg >= 0.2 && atkProg <= 0.8,
        });
      }

      let stingerThrust = 0,
        stingerDown = 0,
        stingerStrikePower = 0;
      if (isStingerAtk) {
        if (stingerProg < 0.25) {
          const prep = Math.sin((stingerProg / 0.25) * Math.PI * 0.5);
          stingerThrust = -prep * 3 * l;
          stingerDown = -prep * 1.5 * l;
        } else if (stingerProg < 0.65) {
          const snap = Math.sin(((stingerProg - 0.25) / 0.4) * Math.PI);
          stingerStrikePower = snap;
          stingerThrust = -3 * l * (1 - (stingerProg - 0.25) / 0.4) + snap * 13 * l;
          stingerDown = snap * 5.5 * l;
        } else {
          const ret = Math.sin(((1 - stingerProg) / 0.35) * Math.PI * 0.5);
          stingerThrust = ret * 5 * l;
          stingerDown = ret * 1.5 * l;
        }
      }
      const j = Math.sin(t.animTimer * 2.8) * 1.8 * l,
        P = -7 * l,
        A = -5 * l + f;
      const restTipLocalX = P + 3.8 * l + j + 6.6 * l,
        restTipLocalY = A - 18.2 * l + 4.7 * l;
      let aimDeltaX = stingerThrust,
        aimDeltaY = stingerDown * 0.6;
      if (isStingerAtk && stingerStrikePower > 0 && stingerTgtX !== void 0 && stingerTgtY !== void 0) {
        const targetLocalX = (stingerTgtX - t.x) * u,
          targetLocalY = stingerTgtY - t.y;
        aimDeltaX = (targetLocalX - restTipLocalX) * stingerStrikePower;
        aimDeltaY = (targetLocalY - restTipLocalY) * stingerStrikePower;
      }
      colliders.push({
        part: "stinger",
        x: t.x + (restTipLocalX + aimDeltaX) * u,
        y: t.y + restTipLocalY + aimDeltaY,
        radius: stingerRadius,
        active: isStingerAtk && stingerProg >= 0.25 && stingerProg <= 0.75,
      });

      // Pernas superiores e inferiores na visão lateral (4 no topo, 4 na base)
      for (let Ne = 0; Ne < 4; Ne++) {
        const X = f + Ne * 1.5;
        const C = m ? Math.sin(X) * 2.1 * l : Math.sin(t.animTimer * 1.2 + Ne) * 0.35 * l;
        const be = -5 * l + Ne * 3.4 * l;
        const Te = be - 2 * l + C * 0.7;
        const _e = Te - 3.5 * l + C;
        const xe = -5 * l + f - 3 * l;
        colliders.push({
          part: `leg_top_${Ne}`,
          side: -1,
          index: Ne,
          x: t.x + _e * u,
          y: t.y + xe,
          radius: Math.max(7, 2.5 * l),
          active: !1,
          isLeg: !0,
        });
      }
      for (let Ne = 0; Ne < 4; Ne++) {
        const X = f + Ne * 1.5 + Math.PI;
        const C = m ? Math.sin(X) * 2.2 * l : Math.sin(t.animTimer * 1.2 + Ne + 2) * 0.35 * l;
        const be = -5 * l + Ne * 3.4 * l;
        const Te = be - 1.5 * l + C * 0.7;
        const _e = Te - 2.5 * l + C;
        const xe = -4 * l + f + 9.5 * l;
        colliders.push({
          part: `leg_bottom_${Ne}`,
          side: 1,
          index: Ne,
          x: t.x + _e * u,
          y: t.y + xe,
          radius: Math.max(7, 2.5 * l),
          active: !1,
          isLeg: !0,
        });
      }
    }
    return colliders;
  }
  if (typeof window !== "undefined") {
    window.getScorpionHitColliders = getScorpionHitColliders;
  }
  function drawGiantScorpionCaveReachClaw(e, t) {
    const l = t.scale || 3.4;
    const baseX = t.caveDoorX ?? t.x;
    const baseY = t.caveDoorY ?? t.y;
    const reachProg = t.caveReachProg || 0;
    const isPulling = !!t.isPullingFromCave;
    const pullProg = Math.max(0, Math.min(1, t.cavePullProgress || 0));
    if (reachProg <= 0 && !isPulling) return;

    const tgtX = t.caveReachTargetX ?? baseX;
    const tgtY = t.caveReachTargetY ?? (baseY + 26);
    let tipX = baseX;
    let tipY = baseY + 6;
    if (isPulling) {
      const startX = t.cavePullStartX ?? tgtX;
      const startY = t.cavePullStartY ?? tgtY;
      tipX = startX + (baseX - startX) * pullProg;
      tipY = startY + (baseY + 2 - startY) * pullProg;
    } else {
      const ext = Math.sin(reachProg * Math.PI);
      tipX = baseX + (tgtX - baseX) * ext;
      tipY = baseY + 4 + (tgtY - (baseY + 4)) * ext;
    }

    t._caveClawTipX = tipX;
    t._caveClawTipY = tipY;
    t._caveClawRadius = Math.max(8, 3.8 * l);

    const dx = tipX - baseX;
    const dy = tipY - baseY;
    const ang = Math.atan2(dy, dx) - Math.PI / 2;
    const elbowX = baseX + dx * 0.48 + (t.attackClawSide || 1) * 5.5 * l * 0.45;
    const elbowY = baseY + dy * 0.48;

    const y = t.color || "#b45309",
      w = t.accentColor || "#451a03",
      v = "#140b05",
      S = "#92400e",
      T = "#f59e0b";

    e.save();
    // Sombra da garra projetada no piso da caverna
    e.fillStyle = "rgba(0, 0, 0, 0.48)";
    e.beginPath();
    e.ellipse(tipX, tipY + 5, 4.5 * l, 2.2 * l, 0, 0, Math.PI * 2);
    e.fill();

    // Segmento 1 do braço saindo da entrada da caverna
    e.strokeStyle = v;
    e.lineWidth = 3.8 * l;
    e.lineCap = "round";
    e.lineJoin = "round";
    e.beginPath();
    e.moveTo(baseX, baseY);
    e.lineTo(elbowX, elbowY);
    e.stroke();
    e.strokeStyle = y;
    e.lineWidth = 2.8 * l;
    e.stroke();

    // Articulação do cotovelo
    e.fillStyle = w;
    e.beginPath();
    e.arc(elbowX, elbowY, 1.8 * l, 0, Math.PI * 2);
    e.fill();

    // Segmento 2 do braço até a pinça
    e.strokeStyle = v;
    e.lineWidth = 3.5 * l;
    e.beginPath();
    e.moveTo(elbowX, elbowY);
    e.lineTo(tipX, tipY);
    e.stroke();
    e.strokeStyle = S;
    e.lineWidth = 2.5 * l;
    e.stroke();

    // Pinça / Garra gigante na ponta
    const te = t.attackClawSide || 1;
    e.translate(tipX, tipY);
    e.rotate(ang);
    e.fillStyle = S;
    e.beginPath();
    e.ellipse(0, -1.8 * l, 2.6 * l, 4 * l, 0, 0, Math.PI * 2);
    e.fill();
    e.strokeStyle = w;
    e.lineWidth = 1 * l;
    e.stroke();
    e.fillStyle = T;
    e.beginPath();
    e.ellipse(-te * 0.8 * l, -1.5 * l, 0.7 * l, 2.1 * l, 0, 0, Math.PI * 2);
    e.fill();

    // Dedo fixo da garra
    e.fillStyle = w;
    e.beginPath();
    e.moveTo(-te * 1.2 * l, 1.2 * l);
    e.quadraticCurveTo(-te * 2.3 * l, 5.2 * l, 0, 7.6 * l);
    e.quadraticCurveTo(-te * 0.5 * l, 4.4 * l, te * 0.5 * l, 1.2 * l);
    e.closePath();
    e.fill();

    // Dedo móvel da garra (abre no bote e fecha ao agarrar o player)
    const clawOpen = isPulling
      ? 0.04
      : reachProg < 0.55
        ? 0.75
        : 0.08;
    e.save();
    e.translate(te * 1.1 * l, 1 * l);
    e.rotate(-te * clawOpen);
    e.fillStyle = v;
    e.beginPath();
    e.moveTo(0, 0);
    e.quadraticCurveTo(te * 2.1 * l, 3.8 * l, 0, 6.4 * l);
    e.quadraticCurveTo(te * 0.6 * l, 3.2 * l, -te * 0.8 * l, 0);
    e.closePath();
    e.fill();
    e.strokeStyle = T;
    e.lineWidth = 0.8 * l;
    for (let Te = 1; Te <= 3; Te++) {
      e.beginPath();
      e.moveTo(0, Te * 1.3 * l);
      e.lineTo(te * 0.7 * l, Te * 1.3 * l);
      e.stroke();
    }
    e.restore();
    e.restore();
  }
