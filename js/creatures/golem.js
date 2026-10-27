/* js/creatures/golem.js
 * Criatura COMPLETA: Golem (monstro de pedra/magma). Tudo que define o golem fica neste arquivo.
 * Depende de registry.js (carregar depois dele). Ordem de carga: rabbit.js, wolf.js, deer.js, golem.js.
 *
 * O golem NAO e destrinchavel: nao tem `carcass`, `sheet`, `loot` nem `detect` (ac() em fusao-e-loot.js continua
 * excluindo itens com "golem" no nome). Ao morrer deixa o corpo generico.
 * Dois nascimentos: `spawn` (Golem Magmatico, bioma vulcanico) e `spawnVariants.mountain` (Golem dos Paredoes,
 * bioma MOUNTAIN_25D).
 * `behavior.fearsFire: false`: nao foge de fogueira nem de tocha (criaturas do registro fogem por padrao).
 */
"use strict";
CREATURES.golem = {
  id: "golem",
  // Nascimento no mundo (valores do spawn)
  spawn: { name: "Golem Magmático", color: "#b91c1c", accentColor: "#fbbf24", hp: 35, attack: 8, speed: 0.65, scale: 1.15 },
  spawnVariants: {
    mountain: { name: "Golem dos Paredões", color: "#475569", accentColor: "#38bdf8", hp: 36, attack: 8, speed: 0.68, scale: 1.15 },
  },
  // Comportamento: hostil, lento (recarga de ataque maior), sem medo de fogo/tocha
  behavior: {
    prey: false,
    deathParticles: 12,
    attackCooldown: 1.7,
    fearsFire: false,
  },
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone. t=nome, l=id, o=icone (minusculos)
  detectIcon: (t, l, o) => o === "creature_golem" || o === "golem" || t.includes("golem") || l.includes("golem"),
  // Desenho no Canvas (codigo movido sem alteracoes dos arquivos de engine)
  draw: {
    // Corpo vivo no mundo (antigo drawMagmaGolem)
    body: function (e, t, o, l) {
    e.save();

    const facing = t.facing || "down";
    const isLeft = facing === "left";
    const isRight = facing === "right";
    const isUp = facing === "up";
    const isDown = facing === "down";

    if (isLeft) {
      e.scale(-1, 1);
    }

    const anim = t.animTimer || 0;
    const speedSq = (t.vx || 0) * (t.vx || 0) + (t.vy || 0) * (t.vy || 0);
    const isMoving = (t.isMoving !== undefined) ? !!t.isMoving : (speedSq > 0.005);
    const pulse = Math.sin(anim * 3.5);
    const breathe = Math.sin(anim * 2.2) * 0.8 * o;

    // Movimentação de passos rítmicos e pesados
    const walkPhase = anim * 4;
    const walkBob = isMoving ? Math.abs(Math.sin(walkPhase)) * 1.8 * o : 0;
    const bodyY = -walkBob + breathe;

    // Cálculo dinâmico das articulações de pernas e braços
    let legAngleL = 0;
    let legAngleR = 0;
    let legLiftL = 0;
    let legLiftR = 0;
    let armAngleL = 0;
    let armAngleR = 0;

    if (isMoving) {
      if (isLeft || isRight) {
        // Passada ampla lateral em perfil
        legAngleL = Math.sin(walkPhase) * 0.44;
        legAngleR = -Math.sin(walkPhase) * 0.44;
        legLiftL = Math.max(0, -Math.sin(walkPhase)) * 2.4 * o;
        legLiftR = Math.max(0, Math.sin(walkPhase)) * 2.4 * o;
        // Braços balançam em contra-passo firme
        armAngleL = -Math.sin(walkPhase) * 0.5;
        armAngleR = Math.sin(walkPhase) * 0.5;
      } else {
        // Passada frontal/traseira (down/up): pisadas pesadas alternadas
        legAngleL = Math.sin(walkPhase) * 0.18;
        legAngleR = -Math.sin(walkPhase) * 0.18;
        legLiftL = Math.max(0, -Math.sin(walkPhase)) * 2.8 * o;
        legLiftR = Math.max(0, Math.sin(walkPhase)) * 2.8 * o;
        armAngleL = -Math.sin(walkPhase) * 0.32;
        armAngleR = Math.sin(walkPhase) * 0.32;
      }
    } else {
      // Repouso: respiração lenta e suave oscilação dos braços
      armAngleL = Math.sin(anim * 2.2) * 0.06;
      armAngleR = -Math.sin(anim * 2.2) * 0.06;
    }

    // Ataque esmagador com punhos se estiver desferindo golpe
    const attackCd = t.attackCooldown || 0;
    if (attackCd > 0.8) {
      const punchFactor = Math.sin(((attackCd - 0.8) / 0.9) * Math.PI);
      armAngleL -= punchFactor * 0.75;
      armAngleR -= punchFactor * 0.75;
    }

    // Paleta Vulcânica: Basalto Profundo + Núcleo de Magma
    const rockDark = l ? "#ffffff" : "#18181b"; // Obsidiana profunda
    const rockMid = l ? "#f4f4f5" : "#27272a";  // Placas de basalto
    const rockLight = l ? "#ffffff" : "#3f3f46";// Arestas de pedra
    const lavaBright = l ? "#ffffff" : "#fef08a"; // Amarelo incandescente
    const lavaOrange = l ? "#ffffff" : "#f97316"; // Magma alaranjado vivo
    const lavaRed = l ? "#ffffff" : "#dc2626";    // Lava avermelhada

    // 1. Calor radiante no chão (lava aura)
    if (!l) {
      const heatGround = e.createRadialGradient(0, 2 * o, 2 * o, 0, 2 * o, 15 * o);
      heatGround.addColorStop(0, "rgba(249, 115, 22, 0.3)");
      heatGround.addColorStop(0.55, "rgba(220, 38, 38, 0.12)");
      heatGround.addColorStop(1, "rgba(0, 0, 0, 0)");
      e.fillStyle = heatGround;
      e.beginPath();
      e.ellipse(0, 2 * o, 15 * o, 6.5 * o, 0, 0, Math.PI * 2);
      e.fill();
    }

    // 2. Fagulhas e Brasas de Fogo Subindo dos Ombros
    if (!l) {
      for (let i = 0; i < 4; i++) {
        const emberProg = (anim * 1.5 + i * 0.25) % 1;
        const emberX = Math.sin(anim * 3 + i * 2) * (8 * o) + (i % 2 === 0 ? -5 * o : 5 * o);
        const emberY = -15 * o - emberProg * (16 * o);
        const emberSize = (1 - emberProg) * 1.5 * o;
        const emberAlpha = Math.sin(emberProg * Math.PI) * 0.85;

        e.fillStyle = i % 2 === 0 ? lavaBright : lavaOrange;
        e.globalAlpha = emberAlpha;
        e.beginPath();
        e.arc(emberX, emberY, Math.max(0.6, emberSize), 0, Math.PI * 2);
        e.fill();
        e.globalAlpha = 1;
      }
    }

    // 3. Pernas de Pilares de Basalto com Articulação do Quadril
    // Perna Esquerda
    e.save();
    e.translate(-5.5 * o, bodyY - 2 * o - legLiftL);
    e.rotate(legAngleL);
    e.fillStyle = lavaOrange;
    e.beginPath();
    e.arc(0, 0, 2 * o, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-3 * o, 0);
    e.lineTo(3 * o, 0);
    e.lineTo(3.8 * o, 5 * o);
    e.lineTo(-3.8 * o, 5 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1 * o;
    e.stroke();
    e.fillStyle = rockDark;
    e.fillRect(-4.5 * o, 4 * o, 6.5 * o, 2.5 * o);
    e.fillStyle = lavaBright;
    e.fillRect(-3 * o, 4.8 * o, 3.5 * o, 0.8 * o);
    e.restore();

    // Perna Direita
    e.save();
    e.translate(5.5 * o, bodyY - 2 * o - legLiftR);
    e.rotate(legAngleR);
    e.fillStyle = lavaOrange;
    e.beginPath();
    e.arc(0, 0, 2 * o, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-3 * o, 0);
    e.lineTo(3 * o, 0);
    e.lineTo(3.8 * o, 5 * o);
    e.lineTo(-3.8 * o, 5 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1 * o;
    e.stroke();
    e.fillStyle = rockDark;
    e.fillRect(-2 * o, 4 * o, 6.5 * o, 2.5 * o);
    e.fillStyle = lavaBright;
    e.fillRect(-0.5 * o, 4.8 * o, 3.5 * o, 0.8 * o);
    e.restore();

    // 4. Espinhas Dorsais Pontiagudas de Obsidiana
    if (isUp || isLeft || isRight) {
      e.fillStyle = rockDark;
      e.strokeStyle = lavaOrange;
      e.lineWidth = 0.9 * o;
      e.beginPath();
      e.moveTo(-2 * o, bodyY - 17 * o);
      e.lineTo(0, bodyY - 24 * o);
      e.lineTo(2 * o, bodyY - 17 * o);
      e.closePath();
      e.fill();
      e.stroke();

      e.beginPath();
      e.moveTo(-6 * o, bodyY - 15 * o);
      e.lineTo(-5 * o, bodyY - 21 * o);
      e.lineTo(-2 * o, bodyY - 14 * o);
      e.closePath();
      e.fill();
      e.stroke();

      e.beginPath();
      e.moveTo(2 * o, bodyY - 14 * o);
      e.lineTo(5 * o, bodyY - 21 * o);
      e.lineTo(6 * o, bodyY - 15 * o);
      e.closePath();
      e.fill();
      e.stroke();
    }

    // 5. Tronco Titânico de Rocha Ígnea
    e.save();
    e.translate(0, bodyY);
    const torsoTilt = isMoving ? Math.sin(walkPhase) * 0.035 : 0;
    if (isMoving) e.rotate(torsoTilt);

    // Aura de calor no torso
    if (!l) {
      const torsoGlow = e.createRadialGradient(0, -10 * o, 3 * o, 0, -10 * o, 13 * o);
      torsoGlow.addColorStop(0, "rgba(249, 115, 22, 0.35)");
      torsoGlow.addColorStop(0.7, "rgba(220, 38, 38, 0.12)");
      torsoGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      e.fillStyle = torsoGlow;
      e.beginPath();
      e.arc(0, -10 * o, 13 * o, 0, Math.PI * 2);
      e.fill();
    }

    // Placa frontal/traseira principal chanfrada
    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-10 * o, -16 * o);
    e.lineTo(10 * o, -16 * o);
    e.lineTo(8.5 * o, -4 * o);
    e.lineTo(4 * o, -1 * o);
    e.lineTo(-4 * o, -1 * o);
    e.lineTo(-8.5 * o, -4 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1.3 * o;
    e.stroke();

    // Placas de armadura angular
    e.fillStyle = rockDark;
    e.beginPath();
    e.moveTo(-8.5 * o, -15 * o);
    e.lineTo(-2 * o, -15 * o);
    e.lineTo(-1 * o, -6 * o);
    e.lineTo(-7 * o, -5 * o);
    e.closePath();
    e.fill();

    e.beginPath();
    e.moveTo(8.5 * o, -15 * o);
    e.lineTo(2 * o, -15 * o);
    e.lineTo(1 * o, -6 * o);
    e.lineTo(7 * o, -5 * o);
    e.closePath();
    e.fill();

    // 6. Núcleo de Magma e Fissuras Rúnicas
    if (!isUp) {
      const coreY = -10 * o;
      const coreGlow = e.createRadialGradient(0, coreY, 0.8 * o, 0, coreY, 5.5 * o);
      coreGlow.addColorStop(0, lavaBright);
      coreGlow.addColorStop(0.35, lavaOrange);
      coreGlow.addColorStop(0.75, lavaRed);
      coreGlow.addColorStop(1, "rgba(185, 28, 28, 0)");

      e.fillStyle = coreGlow;
      e.beginPath();
      e.arc(0, coreY, 5.5 * o, 0, Math.PI * 2);
      e.fill();

      // Fenda rúnica de lava em Y
      e.strokeStyle = lavaBright;
      e.lineWidth = 1.8 * o;
      e.lineCap = "round";
      e.lineJoin = "round";
      e.beginPath();
      e.moveTo(-4.5 * o, -13.5 * o);
      e.lineTo(0, -10 * o);
      e.lineTo(4.5 * o, -13.5 * o);
      e.moveTo(0, -10 * o);
      e.lineTo(0, -3.5 * o);
      e.lineTo(pulse * 1.2 * o, -2 * o);
      e.stroke();

      e.strokeStyle = lavaOrange;
      e.lineWidth = 1.2 * o;
      e.beginPath();
      e.moveTo(-6 * o, -8 * o);
      e.lineTo(-3 * o, -6.5 * o);
      e.moveTo(6 * o, -8 * o);
      e.lineTo(3 * o, -6.5 * o);
      e.stroke();
    } else {
      e.strokeStyle = lavaOrange;
      e.lineWidth = 1.4 * o;
      e.beginPath();
      e.moveTo(0, -15 * o);
      e.lineTo(-1.5 * o, -11 * o);
      e.lineTo(1.5 * o, -7 * o);
      e.lineTo(0, -2 * o);
      e.stroke();
    }

    // 7. Ombreiras Titânicas de Basalto com Linhas de Lava
    e.fillStyle = rockDark;
    e.beginPath();
    e.moveTo(-8 * o, -14 * o);
    e.lineTo(-14.5 * o, -18 * o);
    e.lineTo(-13 * o, -12 * o);
    e.lineTo(-7.5 * o, -9 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockLight;
    e.lineWidth = 0.9 * o;
    e.stroke();
    e.strokeStyle = lavaOrange;
    e.lineWidth = 1.2 * o;
    e.beginPath();
    e.moveTo(-8.5 * o, -13 * o);
    e.lineTo(-13 * o, -15.5 * o);
    e.stroke();

    e.fillStyle = rockDark;
    e.beginPath();
    e.moveTo(8 * o, -14 * o);
    e.lineTo(14.5 * o, -18 * o);
    e.lineTo(13 * o, -12 * o);
    e.lineTo(7.5 * o, -9 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockLight;
    e.lineWidth = 0.9 * o;
    e.stroke();
    e.strokeStyle = lavaOrange;
    e.lineWidth = 1.2 * o;
    e.beginPath();
    e.moveTo(8.5 * o, -13 * o);
    e.lineTo(13 * o, -15.5 * o);
    e.stroke();

    // 8. Braços e Punhos Pesados de Rocha com Rotação dos Ombros
    // Braço Esquerdo
    e.save();
    e.translate(-11.5 * o, -10 * o);
    e.rotate(armAngleL);
    e.fillStyle = lavaOrange;
    e.beginPath();
    e.arc(0, 0, 2.5 * o, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-2.5 * o, 0);
    e.lineTo(2.5 * o, 0);
    e.lineTo(3.5 * o, 8 * o);
    e.lineTo(-3.5 * o, 8 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1 * o;
    e.stroke();
    e.strokeStyle = lavaBright;
    e.lineWidth = 1.2 * o;
    e.beginPath();
    e.moveTo(0, 1.5 * o);
    e.lineTo(-0.8 * o, 6 * o);
    e.stroke();
    e.fillStyle = rockDark;
    e.beginPath();
    e.rect(-4 * o, 7.5 * o, 8 * o, 6.5 * o);
    e.fill();
    e.strokeStyle = rockLight;
    e.lineWidth = 0.8 * o;
    e.stroke();
    e.fillStyle = lavaOrange;
    e.fillRect(-3 * o, 12 * o, 2 * o, 1.5 * o);
    e.fillRect(1 * o, 12 * o, 2 * o, 1.5 * o);
    e.restore();

    // Braço Direito
    e.save();
    e.translate(11.5 * o, -10 * o);
    e.rotate(armAngleR);
    e.fillStyle = lavaOrange;
    e.beginPath();
    e.arc(0, 0, 2.5 * o, 0, Math.PI * 2);
    e.fill();
    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-2.5 * o, 0);
    e.lineTo(2.5 * o, 0);
    e.lineTo(3.5 * o, 8 * o);
    e.lineTo(-3.5 * o, 8 * o);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1 * o;
    e.stroke();
    e.strokeStyle = lavaBright;
    e.lineWidth = 1.2 * o;
    e.beginPath();
    e.moveTo(0, 1.5 * o);
    e.lineTo(0.8 * o, 6 * o);
    e.stroke();
    e.fillStyle = rockDark;
    e.beginPath();
    e.rect(-4 * o, 7.5 * o, 8 * o, 6.5 * o);
    e.fill();
    e.strokeStyle = rockLight;
    e.lineWidth = 0.8 * o;
    e.stroke();
    e.fillStyle = lavaOrange;
    e.fillRect(-3 * o, 12 * o, 2 * o, 1.5 * o);
    e.fillRect(1 * o, 12 * o, 2 * o, 1.5 * o);
    e.restore();

    // 9. Cabeça e Máscara Ancestral de Pedra
    const headY = -18 * o + (isDown ? 1 * o : isUp ? -1.5 * o : 0);
    e.save();
    e.translate(0, headY);
    if (isMoving) e.rotate(-torsoTilt * 0.7);

    e.fillStyle = rockMid;
    e.beginPath();
    e.moveTo(-5.5 * o, -6 * o);
    e.lineTo(5.5 * o, -6 * o);
    e.lineTo(6.5 * o, 0);
    e.lineTo(4 * o, 4.5 * o);
    e.lineTo(-4 * o, 4.5 * o);
    e.lineTo(-6.5 * o, 0);
    e.closePath();
    e.fill();
    e.strokeStyle = rockDark;
    e.lineWidth = 1.2 * o;
    e.stroke();

    e.fillStyle = rockDark;
    e.beginPath();
    e.moveTo(-4.5 * o, -5.5 * o);
    e.lineTo(4.5 * o, -5.5 * o);
    e.lineTo(3.5 * o, -1.5 * o);
    e.lineTo(-3.5 * o, -1.5 * o);
    e.closePath();
    e.fill();

    e.strokeStyle = lavaOrange;
    e.lineWidth = 1 * o;
    e.beginPath();
    e.moveTo(0, -5 * o);
    e.lineTo(0, -2 * o);
    e.stroke();

    if (!isUp) {
      // Brilho dos Olhos de Fogo
      const eyeGlow = e.createRadialGradient(-3 * o, 0.5 * o, 0.2 * o, -3 * o, 0.5 * o, 2.5 * o);
      eyeGlow.addColorStop(0, lavaBright);
      eyeGlow.addColorStop(0.5, lavaOrange);
      eyeGlow.addColorStop(1, "rgba(220, 38, 38, 0)");
      e.fillStyle = eyeGlow;
      e.beginPath();
      e.arc(-3 * o, 0.5 * o, 2.5 * o, 0, Math.PI * 2);
      e.arc(3 * o, 0.5 * o, 2.5 * o, 0, Math.PI * 2);
      e.fill();

      // Fendas Oculares Angulares Agressivas
      e.fillStyle = lavaBright;
      e.beginPath();
      e.moveTo(-4.8 * o, -0.2 * o);
      e.lineTo(-1.6 * o, 0.4 * o);
      e.lineTo(-2.2 * o, 1.4 * o);
      e.lineTo(-4.6 * o, 0.8 * o);
      e.closePath();
      e.fill();

      e.beginPath();
      e.moveTo(4.8 * o, -0.2 * o);
      e.lineTo(1.6 * o, 0.4 * o);
      e.lineTo(2.2 * o, 1.4 * o);
      e.lineTo(4.6 * o, 0.8 * o);
      e.closePath();
      e.fill();

      // Pupilas de luz branca
      e.fillStyle = "#ffffff";
      e.fillRect(-3.2 * o, 0.2 * o, 1.2 * o, 0.8 * o);
      e.fillRect(2 * o, 0.2 * o, 1.2 * o, 0.8 * o);

      // Fenda de calor na mandíbula
      e.fillStyle = lavaOrange;
      e.fillRect(-2 * o, 2.8 * o, 4 * o, 0.8 * o);
      e.fillStyle = lavaBright;
      e.fillRect(-1 * o, 3 * o, 2 * o, 0.5 * o);
    } else {
      e.fillStyle = rockDark;
      e.fillRect(-3 * o, -2 * o, 6 * o, 4 * o);
      e.strokeStyle = lavaOrange;
      e.lineWidth = 1 * o;
      e.strokeRect(-3 * o, -2 * o, 6 * o, 4 * o);
    }

    e.restore(); // cabeça
    e.restore(); // tronco
    e.restore(); // global
  
    },
    // Icone (antigo fb)
    icon: function (e, t, l) {
    // Sombra suave da base
    e.fillStyle = "rgba(15, 23, 42, 0.45)";
    e.beginPath();
    e.ellipse(0, 4.5 * t, 7 * t, 2.6 * t, 0, 0, Math.PI * 2);
    e.fill();

    // Ombreiras titânicas de basalto
    e.fillStyle = "#18181b";
    e.beginPath();
    e.moveTo(-7.5 * t, -2.5 * t);
    e.lineTo(-4.5 * t, -6 * t);
    e.lineTo(4.5 * t, -6 * t);
    e.lineTo(7.5 * t, -2.5 * t);
    e.lineTo(5.5 * t, 3.5 * t);
    e.lineTo(-5.5 * t, 3.5 * t);
    e.closePath();
    e.fill();
    e.strokeStyle = "#3f3f46";
    e.lineWidth = 0.8 * t;
    e.stroke();

    // Peitoral de rocha com núcleo incandescente
    e.fillStyle = "#27272a";
    e.beginPath();
    e.moveTo(-4.5 * t, -3.5 * t);
    e.lineTo(4.5 * t, -3.5 * t);
    e.lineTo(3.5 * t, 2.5 * t);
    e.lineTo(-3.5 * t, 2.5 * t);
    e.closePath();
    e.fill();

    // Núcleo de lava no peito
    const coreGrad = e.createRadialGradient(0, 0, 0.5 * t, 0, 0, 3 * t);
    coreGrad.addColorStop(0, "#fef08a");
    coreGrad.addColorStop(0.4, "#f97316");
    coreGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
    e.fillStyle = coreGrad;
    e.beginPath();
    e.arc(0, 0, 3 * t, 0, Math.PI * 2);
    e.fill();

    // Fenda rúnica em Y no peito
    e.strokeStyle = "#fef08a";
    e.lineWidth = 1.3 * t;
    e.lineCap = "round";
    e.beginPath();
    e.moveTo(-2.5 * t, -2 * t);
    e.lineTo(0, 0);
    e.lineTo(2.5 * t, -2 * t);
    e.moveTo(0, 0);
    e.lineTo(0, 2.5 * t);
    e.stroke();

    // Cabeça de rocha entalhada / Máscara
    e.fillStyle = "#3f3f46";
    e.beginPath();
    e.moveTo(-3.5 * t, -8 * t);
    e.lineTo(3.5 * t, -8 * t);
    e.lineTo(4.8 * t, -4 * t);
    e.lineTo(2.5 * t, -1.2 * t);
    e.lineTo(-2.5 * t, -1.2 * t);
    e.lineTo(-4.8 * t, -4 * t);
    e.closePath();
    e.fill();
    e.strokeStyle = "#18181b";
    e.lineWidth = 0.9 * t;
    e.stroke();

    // Placa de testa de obsidiana
    e.fillStyle = "#18181b";
    e.fillRect(-2.5 * t, -7.5 * t, 5 * t, 2 * t);

    // Fenda incandescente na testa
    e.strokeStyle = "#f97316";
    e.lineWidth = 0.8 * t;
    e.beginPath();
    e.moveTo(0, -7.2 * t);
    e.lineTo(0, -5.2 * t);
    e.stroke();

    // Olhos flamejantes de magma
    e.fillStyle = "#fef08a";
    e.fillRect(-3 * t, -4.8 * t, 1.8 * t, 1.3 * t);
    e.fillRect(1.2 * t, -4.8 * t, 1.8 * t, 1.3 * t);
    e.fillStyle = "#ffffff";
    e.fillRect(-2.4 * t, -4.5 * t, 0.8 * t, 0.7 * t);
    e.fillRect(1.6 * t, -4.5 * t, 0.8 * t, 0.7 * t);
  
    },
  },
};
