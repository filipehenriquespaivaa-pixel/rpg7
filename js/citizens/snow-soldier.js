/* js/citizens/snow-soldier.js
 * Soldado do Quartel da Vila Glacial dos Picos Gelados: desenho (uniforme militar) e skins.
 * Usa as paletas de skin de snow-citizen.js (pele, cabelo e roupa sao escolhidos em _initCitizens de js/core/snow-peak-city.js).
 * Depende de registry.js e de snow-citizen.js (carregar depois deles).
 */
"use strict";
CITIZEN_KINDS["snow-soldier"] = {
  id: "snow-soldier",
  city: "snow",
  description: "Soldado do Quartel da Vila Glacial: desenho e skins",
  // skins: as mesmas paletas do morador da neve
  skinTones: CITIZEN_KINDS["snow-citizen"].skinTones,
  hairColors: CITIZEN_KINDS["snow-citizen"].hairColors,
  outfitPalettes: CITIZEN_KINDS["snow-citizen"].outfitPalettes,
  // Desenho no Canvas (antigo _renderSoldier): (ctx, npc, timeOfDay, animTimer, player)
  // Renderiza Soldados, Carcereiros, Tenentes, Capitão e Coronel:
  // - Tons de pele variados (sol.skinColor)
  // - TODOS com UNIFORME PRETO E DETALHES VERMELHOS IDÊNTICOS!
  draw: function (c, sol, timeOfDay, animTimer, player) {
    c.save();
    c.translate(sol.x, sol.y);

    const w = sol.facing || "down";
    const isMoving = !!sol.isMoving;
    const walkSin = isMoving ? Math.sin(sol.walkPhase) : 0;
    const bob = isMoving
      ? Math.abs(Math.sin(sol.walkPhase)) * 1.7
      : Math.sin(animTimer * 2.2 + sol.id) * 0.3;

    // Cores padronizadas do Uniforme Militar Preto com Detalhes Vermelhos Idênticos
    const uniBlack = "#0f172a";
    const uniDark = "#09090b";
    const uniRed = "#dc2626";
    const uniRedBright = "#ef4444";
    const isOfficer = sol.rank === "Coronel" || sol.rank === "Capitão" || sol.rank === "Tenente";

    // 1. Sombra no chão
    c.fillStyle = "rgba(15, 23, 42, 0.4)";
    c.beginPath();
    c.ellipse(0, 2.5, 8.0, 4.3, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Capa Militar Preta com Forro/Borda Vermelha para o Coronel e Capitão
    if (sol.rank === "Coronel" || sol.rank === "Capitão") {
      const sway = isMoving ? Math.cos(sol.walkPhase) * 1.8 : 0;
      c.fillStyle = uniDark;
      c.fillRect(-7.8 + sway * 0.3, -15.5 - bob, 15.6, 15.5);
      c.fillStyle = uniRed;
      c.fillRect(-7.8 + sway * 0.3, -1.5 - bob, 15.6, 1.8);
    }

    // 3. Pernas e Botas Anatômicas com Balanço Pendular Idêntico ao Player
    const legMult = 2.8,
      legSwingL = isMoving ? -walkSin * legMult : 0,
      legSwingR = isMoving ? walkSin * legMult : 0;

    if (w === "up") {
      // VISTA TRASEIRA (COSTAS): Passada vertical alternada idêntica ao player
      // Perna Esquerda
      c.fillStyle = uniDark;
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.35)";
      c.fillRect(-3.2, -3.5 + legSwingL, 0.9, 4.6);
      c.fillStyle = "#18181b";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = uniRed;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.3);
      c.fillStyle = "rgba(0, 0, 0, 0.28)";
      c.fillRect(-3.5, 1.5 + legSwingL, 1.0, 2.8);
      c.fillStyle = "#09090b";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = uniDark;
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.35)";
      c.fillRect(3.4, -3.5 + legSwingR, 0.9, 4.6);
      c.fillStyle = "#18181b";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = uniRed;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.3);
      c.fillStyle = "rgba(0, 0, 0, 0.28)";
      c.fillRect(3.1, 1.5 + legSwingR, 1.0, 2.8);
      c.fillStyle = "#09090b";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "down") {
      // VISTA FRONTAL: Passada vertical alternada idêntica ao player
      // Perna Esquerda
      c.fillStyle = uniDark;
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.1)";
      c.fillRect(-4.5, -1.7 + legSwingL, 2.4, 2.2);
      c.fillStyle = "#18181b";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = uniRed;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.3);
      c.fillStyle = "#27272a";
      c.fillRect(-5.0, 3.1 + legSwingL, 3.4, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = uniDark;
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.1)";
      c.fillRect(2.1, -1.7 + legSwingR, 2.4, 2.2);
      c.fillStyle = "#18181b";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = uniRed;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.3);
      c.fillStyle = "#27272a";
      c.fillRect(1.6, 3.1 + legSwingR, 3.4, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "left") {
      // VISTA LATERAL ESQUERDA: Pêndulo anatômico com pivô fixo no quadril (y = -3.5) idêntico ao player
      const strideRange = 0.48,
        frontAngle = -walkSin * strideRange,
        backAngle = walkSin * strideRange;

      // Perna de trás (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = uniDark;
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = uniRed;
      c.fillRect(-0.4, 0, 1.0, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.35)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "#18181b";
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = uniRed;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(-3.0, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = uniDark;
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = uniRed;
      c.fillRect(-0.5, 0, 1.0, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.1)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = "#18181b";
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = uniRed;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(-3.3, 6.8, 5.2, 1.2);
      c.restore();
    } else {
      // VISTA LATERAL DIREITA: Pêndulo anatômico com pivô fixo no quadril (y = -3.5) idêntico ao player
      const strideRange = 0.48,
        frontAngle = walkSin * strideRange,
        backAngle = -walkSin * strideRange;

      // Perna de trás (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = uniDark;
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = uniRed;
      c.fillRect(-0.6, 0, 1.0, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.35)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "#18181b";
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = uniRed;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(-1.8, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = uniDark;
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = uniRed;
      c.fillRect(-0.5, 0, 1.0, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.1)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = "#18181b";
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = uniRed;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#09090b";
      c.fillRect(-1.9, 6.8, 5.2, 1.2);
      c.restore();
    }

    // 4. Casaco / Túnica Militar Preta Padronizada + Detalhes Vermelhos Idênticos
    c.fillStyle = uniBlack;
    c.fillRect(-6.8, -16.2 - bob, 13.6, 13.2);

    // Ombreiras (Dragonas) Vermelhas Idênticas em todos os uniformes
    c.fillStyle = uniRed;
    c.fillRect(-8.4, -16.5 - bob, 3.4, 2.2);
    c.fillRect(5.0, -16.5 - bob, 3.4, 2.2);
    if (sol.rank === "Coronel") {
      // Friso dourado extra na ombreira vermelha do Coronel (Chefe de todos)
      c.fillStyle = "#facc15";
      c.fillRect(-8.4, -16.5 - bob, 1.2, 2.2);
      c.fillRect(7.2, -16.5 - bob, 1.2, 2.2);
    }

    // Gola Alta Vermelha + Lapelas/Faixas Peitorais Vermelhas Idênticas
    c.fillStyle = uniRed;
    c.fillRect(-5.5, -17.2 - bob, 11.0, 2.0);
    if (w !== "up") {
      const fOffX = w === "left" ? -1.5 : w === "right" ? 1.5 : 0;
      // Faixa vertical central e lapelas vermelhas idênticas no peito do uniforme preto
      c.fillStyle = uniRed;
      c.fillRect(-1.3 + fOffX, -15.5 - bob, 2.6, 11.5);
      // Costuras horizontais vermelhas no peito (estilo hussardo/guarda imperial)
      c.fillStyle = uniRedBright;
      c.fillRect(-4.8 + fOffX, -14.2 - bob, 9.6, 1.2);
      c.fillRect(-4.4 + fOffX, -11.6 - bob, 8.8, 1.2);
      c.fillRect(-4.0 + fOffX, -9.0 - bob, 8.0, 1.2);
    } else {
      // Costas do uniforme preto com costura central e barra vermelha idêntica
      c.fillStyle = uniRed;
      c.fillRect(-1.0, -15.5 - bob, 2.0, 11.5);
    }

    // Barra inferior vermelha do casaco preto + Cinto Militar Vermelho com Fivela
    c.fillStyle = uniRed;
    c.fillRect(-6.8, -4.2 - bob, 13.6, 1.3);
    c.fillStyle = uniRedBright;
    c.fillRect(-7.0, -7.0 - bob, 14.0, 2.2);
    if (w !== "up") {
      c.fillStyle = isOfficer ? "#facc15" : "#e2e8f0";
      c.fillRect(-1.6, -7.2 - bob, 3.2, 2.6);
    }

    // Se for Carcereiro, exibe o molho de chaves pendurado no cinto
    if (sol.rank === "Carcereiro" && w !== "up") {
      c.strokeStyle = "#eab308";
      c.lineWidth = 1.1;
      c.beginPath();
      c.arc(4.8, -4.2 - bob, 1.8, 0, Math.PI * 2);
      c.stroke();
    }

    // 5. Braços com Mangas Pretas e Punhos Vermelhos Idênticos + Arma Militar
    const swingL = walkSin * 0.75,
      swingR = -walkSin * 0.75,
      shoulderTopY = -15.2 - bob;

    if (w === "down" || w === "up") {
      // Braço Esquerdo (topo fixo no ombro)
      const wristYL = shoulderTopY + 5.0 + swingL;
      c.fillStyle = uniBlack;
      c.fillRect(-8.4, shoulderTopY, 2.6, 6.2 + swingL);
      c.fillStyle = uniRed;
      c.fillRect(-8.4, wristYL, 2.6, 1.6);
      c.fillStyle = sol.skinColor;
      c.fillRect(-8.3, wristYL + 1.5, 2.4, 2.0);

      // Braço Direito (topo fixo no ombro)
      const wristYR = shoulderTopY + 5.0 + swingR;
      c.fillStyle = uniBlack;
      c.fillRect(5.8, shoulderTopY, 2.6, 6.2 + swingR);
      c.fillStyle = uniRed;
      c.fillRect(5.8, wristYR, 2.6, 1.6);
      c.fillStyle = sol.skinColor;
      c.fillRect(5.9, wristYR + 1.5, 2.4, 2.0);
    } else {
      const isLeft = w === "left",
        shoulderPivotX = isLeft ? -1.0 : 0.8,
        armAngle = (isLeft ? 1 : -1) * walkSin * 0.45;
      c.save();
      c.translate(shoulderPivotX, shoulderTopY);
      c.rotate(armAngle);
      c.fillStyle = uniBlack;
      c.fillRect(-1.3, 0, 2.6, 6.2);
      c.fillStyle = uniRed;
      c.fillRect(-1.3, 4.8, 2.6, 1.6);
      c.fillStyle = sol.skinColor;
      c.fillRect(-1.2, 6.4, 2.4, 2.0);
      c.restore();
    }

    // Lança / Alabarda Militar (para Soldados e Tenentes) ou Espada no Cinto (para Coronel e Capitão)
    if (sol.rank === "Soldado" || sol.rank === "Tenente") {
      const spX = w === "left" ? -6.5 : 7.8;
      c.fillStyle = "#451a03";
      c.fillRect(spX, -26 - bob, 1.6, 28);
      // Flâmula vermelha abaixo da ponta da lança
      c.fillStyle = uniRedBright;
      c.beginPath();
      c.moveTo(spX + 1.6, -24 - bob);
      c.lineTo(spX + 6.2, -22.5 - bob);
      c.lineTo(spX + 1.6, -20.5 - bob);
      c.closePath();
      c.fill();
      // Ponta de aço da lança
      c.fillStyle = "#cbd5e1";
      c.beginPath();
      c.moveTo(spX - 1.2, -25.5 - bob);
      c.lineTo(spX + 0.8, -31.5 - bob);
      c.lineTo(spX + 2.8, -25.5 - bob);
      c.closePath();
      c.fill();
    } else {
      // Bainha preta e vermelha de espada na cintura do Oficial / Carcereiro
      c.fillStyle = "#18181b";
      c.fillRect(-8.5, -6.0 - bob, 2.0, 9.5);
      c.fillStyle = uniRedBright;
      c.fillRect(-9.2, -7.2 - bob, 3.4, 1.6);
    }

    // 6. Cabeça (Tom de Pele Variado!) + Quepe/Capacete Militar Preto com Faixa Vermelha Idêntica
    const headY = -22.0 - bob;
    c.fillStyle = sol.skinColor;
    c.beginPath();
    c.arc(0, headY, 6.1, 0, Math.PI * 2);
    c.fill();

    if (w !== "up") {
      c.fillStyle = "#0f172a";
      if (w === "down") {
        c.fillRect(-3.2, headY - 0.4, 1.9, 1.9);
        c.fillRect(1.3, headY - 0.4, 1.9, 1.9);
      } else if (w === "left") {
        c.fillRect(-4.2, headY - 0.4, 1.9, 1.9);
      } else if (w === "right") {
        c.fillRect(2.3, headY - 0.4, 1.9, 1.9);
      }
    }

    // Quepe / Capacete Militar Preto com Faixa e Insígnia Vermelha Idêntica em todos
    c.fillStyle = uniDark;
    c.fillRect(-6.6, headY - 6.8, 13.2, 4.6);
    c.beginPath();
    c.arc(0, headY - 6.5, 6.6, Math.PI, 0);
    c.fill();
    // Faixa vermelha idêntica no quepe/capacete
    c.fillStyle = uniRedBright;
    c.fillRect(-6.6, headY - 3.6, 13.2, 1.8);
    // Topete/insígnia frontal vermelha (com estrela dourada para Coronel/Capitão)
    c.fillStyle = sol.rank === "Coronel" ? "#facc15" : uniRedBright;
    c.fillRect(-1.4, headY - 7.8, 2.8, 2.8);

    // 7. Etiqueta discreta da Patente (para Coronel, Capitão, Tenente e Carcereiro quando perto do jogador) + Balão de fala
    if (player && Math.hypot(player.x - sol.x, player.y - sol.y) < 175) {
      c.font = "bold 6.5px sans-serif";
      c.textAlign = "center";
      c.fillStyle = sol.rank === "Coronel" ? "#facc15" : "#f87171";
      c.fillText(`[${sol.rank.toUpperCase()}]`, 0, headY - 10.5);
    }

    if (sol.chatText && player && Math.hypot(player.x - sol.x, player.y - sol.y) < 250) {
      c.font = "bold 7.2px sans-serif";
      const tw = Math.min(210, Math.max(60, c.measureText(sol.chatText).width + 12));
      const bx = -tw / 2;
      const by = headY - 25;
      c.fillStyle = "rgba(9, 9, 11, 0.92)";
      c.strokeStyle = "#dc2626";
      c.lineWidth = 1.2;
      c.beginPath();
      c.roundRect(bx, by, tw, 13, 4);
      c.fill();
      c.stroke();
      c.fillStyle = "#f8fafc";
      c.textAlign = "center";
      c.fillText(sol.chatText, 0, by + 9.2);
    }

    c.restore();
  },
};
