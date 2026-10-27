/* js/citizens/snow-prisoner.js
 * Prisioneiro da Vila Glacial dos Picos Gelados: desenho (uniforme de prisioneiro) e skins.
 * Usa as paletas de skin de snow-citizen.js (pele, cabelo e roupa sao escolhidos em _initCitizens de js/core/snow-peak-city.js).
 * Depende de registry.js e de snow-citizen.js (carregar depois deles).
 */
"use strict";
CITIZEN_KINDS["snow-prisoner"] = {
  id: "snow-prisoner",
  city: "snow",
  description: "Prisioneiro da Vila Glacial (mina e celas): desenho e skins",
  // skins: as mesmas paletas do morador da neve
  skinTones: CITIZEN_KINDS["snow-citizen"].skinTones,
  hairColors: CITIZEN_KINDS["snow-citizen"].hairColors,
  outfitPalettes: CITIZEN_KINDS["snow-citizen"].outfitPalettes,
  // Desenho no Canvas (antigo _renderPrisoner): (ctx, npc, timeOfDay, animTimer, player)
  // Renderiza um Prisioneiro (tons de pele variados, TODOS com roupas brancas rasgadas, animação de escavar terra ou carregar saco de terra)
  draw: function (c, p, timeOfDay, animTimer, player) {
    c.save();
    c.translate(p.x, p.y);

    const w = p.facing || "down";
    const isMoving = !!p.isMoving;
    const isDigging = !!p.isDigging;
    const carryingDirt = !!p.carryingDirt;
    const walkSin = (isMoving || isDigging) ? Math.sin(p.walkPhase) : 0;
    const bob = isMoving
      ? Math.abs(Math.sin(p.walkPhase)) * 1.6
      : isDigging
        ? Math.abs(Math.sin(p.walkPhase * 1.4)) * 2.1
        : Math.sin(animTimer * 2 + p.id) * 0.3;

    // 1. Sombra no chão
    c.fillStyle = "rgba(15, 23, 42, 0.36)";
    c.beginPath();
    c.ellipse(0, 2.5, 7.5, 4.0, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Pernas anatômicas com balanço pendular idêntico ao do player
    const legMult = 2.8,
      legSwingL = isMoving ? -walkSin * legMult : 0,
      legSwingR = isMoving ? walkSin * legMult : 0;

    if (w === "up") {
      // VISTA TRASEIRA (COSTAS): Passada vertical alternada idêntica ao player
      // Perna Esquerda
      c.fillStyle = "#cbd5e1";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.18)";
      c.fillRect(-3.2, -3.5 + legSwingL, 0.9, 4.6);
      c.fillStyle = p.skinColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#cbd5e1";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.18)";
      c.fillRect(3.4, -3.5 + legSwingR, 0.9, 4.6);
      c.fillStyle = p.skinColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = "#e2e8f0";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "down") {
      // VISTA FRONTAL: Passada vertical alternada idêntica ao player
      // Perna Esquerda
      c.fillStyle = "#e2e8f0";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.3)";
      c.fillRect(-4.5, -1.7 + legSwingL, 2.4, 2.2);
      c.fillStyle = p.skinColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = "#cbd5e1";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "rgba(120, 53, 15, 0.4)";
      c.fillRect(-5.0, 3.1 + legSwingL, 3.4, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#e2e8f0";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.3)";
      c.fillRect(2.1, -1.7 + legSwingR, 2.4, 2.2);
      c.fillStyle = p.skinColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = "#cbd5e1";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "rgba(120, 53, 15, 0.4)";
      c.fillRect(1.6, 3.1 + legSwingR, 3.4, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "left") {
      // VISTA LATERAL ESQUERDA: Pêndulo anatômico com pivôs fixos no quadril (y = -3.5) idêntico ao player
      const strideRange = 0.48,
        frontAngle = -walkSin * strideRange,
        backAngle = walkSin * strideRange;

      // Perna de trás (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#cbd5e1";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.22)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = p.skinColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-3.0, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#f1f5f9";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.35)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = p.skinColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = "#cbd5e1";
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-3.3, 6.8, 5.2, 1.2);
      c.restore();
    } else {
      // VISTA LATERAL DIREITA: Pêndulo anatômico com pivôs fixos no quadril (y = -3.5) idêntico ao player
      const strideRange = 0.48,
        frontAngle = walkSin * strideRange,
        backAngle = -walkSin * strideRange;

      // Perna de trás (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#cbd5e1";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.22)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = p.skinColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-1.8, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#f1f5f9";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.35)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = p.skinColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = "#cbd5e1";
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#78350f";
      c.fillRect(-1.9, 6.8, 5.2, 1.2);
      c.restore();
    }

    // 3. Túnica/Camisa Branca Rasgada (com pontas desfiadas, rasgos e manchas de terra da escavação)
    c.fillStyle = "#f1f5f9";
    c.fillRect(-6.5, -15.5 - bob, 13, 12.2);

    // Barra inferior rasgada em zigue-zague (farrapos brancos pendurados)
    c.fillStyle = "#f1f5f9";
    for (let tx = -6; tx <= 4; tx += 3.2) {
      c.beginPath();
      c.moveTo(tx, -3.5 - bob);
      c.lineTo(tx + 1.6, -1.0 - bob + ((Math.abs(tx + p.id) % 2) * 1.1));
      c.lineTo(tx + 3.0, -3.5 - bob);
      c.closePath();
      c.fill();
    }

    // Rasgos nas roupas brancas mostrando a pele por baixo e manchas de terra marrom
    c.fillStyle = p.skinColor;
    c.fillRect(-4.2, -12.5 - bob, 2.6, 1.8); // Rasgo no peito/ombro
    c.fillRect(1.8, -8.5 - bob, 2.8, 1.6);   // Rasgo na costela
    // Manchas de barro/terra na roupa branca
    c.fillStyle = "rgba(120, 53, 15, 0.35)";
    c.fillRect(-5.5, -6.5 - bob, 4.2, 2.5);
    c.fillRect(1.5, -14.0 - bob, 3.5, 2.2);
    // Corda rústica amarrada na cintura
    c.fillStyle = "#78350f";
    c.fillRect(-6.6, -6.8 - bob, 13.2, 1.4);

    // 4. Braços com mangas brancas rasgadas + Animação de Escavar ou Carregar Saco de Terra
    const armSwing = isDigging ? Math.sin(p.walkPhase * 1.6) * 5.2 : walkSin * 2.8;
    if (carryingDirt) {
      // Braços segurando um grande saco/cesto de terra escavada na frente do corpo!
      c.fillStyle = "#f1f5f9";
      c.fillRect(-8.5, -14.5 - bob, 2.5, 4.5);
      c.fillRect(6.0, -14.5 - bob, 2.5, 4.5);
      c.fillStyle = p.skinColor;
      c.fillRect(-8.2, -10.2 - bob, 2.2, 3.5);
      c.fillRect(6.0, -10.2 - bob, 2.2, 3.5);

      // Saco/Cesto cheio de TERRA MARROM ESCAVADA (sem neve!)
      const bagX = w === "left" ? -3.5 : w === "right" ? 3.5 : 0;
      const bagY = -9.5 - bob;
      c.fillStyle = "#451a03";
      c.beginPath();
      c.ellipse(bagX, bagY, 6.2, 4.5, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#78350f";
      c.beginPath();
      c.ellipse(bagX, bagY - 1.2, 5.2, 3.2, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#92400e";
      c.fillRect(bagX - 2.5, bagY - 2.5, 2.2, 1.6);
      c.fillRect(bagX + 0.8, bagY - 1.8, 1.8, 1.4);
    } else {
      // Braços normais ou golpeando a terra na escavação
      c.fillStyle = "#f1f5f9";
      c.fillRect(-8.6, -15.0 - bob + armSwing * 0.3, 2.4, 4.0); // Manga branca curta/rasgada
      c.fillRect(6.2, -15.0 - bob - armSwing * 0.3, 2.4, 4.0);
      c.fillStyle = p.skinColor;
      c.fillRect(-8.4, -11.0 - bob + armSwing * 0.5, 2.1, 4.8);
      c.fillRect(6.3, -11.0 - bob - armSwing * 0.5, 2.1, 4.8);

      // Se estiver escavando dentro do túnel da mina, desenha a pá/picareta e torrões de terra voando!
      if (isDigging) {
        const dirX = w === "left" ? -1 : 1;
        c.save();
        c.translate(dirX * 6, -10 - bob);
        c.rotate(dirX * (0.4 + Math.sin(p.walkPhase * 1.6) * 0.65));
        // Cabo de madeira da pá/picareta de escavação
        c.fillStyle = "#78350f";
        c.fillRect(-1, -8, 2, 13);
        // Lâmina de ferro suja de terra
        c.fillStyle = "#475569";
        c.fillRect(-3.5, -10, 7, 3.2);
        c.restore();

        // Partículas de terra marrom soltando da parede do túnel!
        c.fillStyle = "#78350f";
        for (let k = 0; k < 3; k++) {
          const prog = ((animTimer * 3.5 + k * 0.33 + p.id) % 1);
          const px = dirX * (9 + prog * 5);
          const py = -12 + prog * 10;
          c.fillRect(px, py, 2.2, 2.2);
        }
      }
    }

    // 5. Cabeça (tom de pele variado, cabelo desalinhado)
    const headY = -21.5 - bob;
    c.fillStyle = p.skinColor;
    c.beginPath();
    c.arc(0, headY, 6.0, 0, Math.PI * 2);
    c.fill();

    // Cabelo desalinhado
    c.fillStyle = p.hairColor;
    c.beginPath();
    c.arc(0, headY - 1.8, 6.2, Math.PI * 0.9, Math.PI * 0.1);
    c.fill();

    if (w !== "up") {
      // Barba por fazer em alguns prisioneiros
      if (p.hasBeard) {
        c.fillStyle = "rgba(28, 25, 23, 0.45)";
        c.fillRect(-3.5, headY + 2.2, 7.0, 2.4);
      }
      // Olhos cansados
      c.fillStyle = "#1e293b";
      if (w === "down") {
        c.fillRect(-3.0, headY - 0.5, 1.8, 1.8);
        c.fillRect(1.2, headY - 0.5, 1.8, 1.8);
      } else if (w === "left") {
        c.fillRect(-4.0, headY - 0.5, 1.8, 1.8);
      } else if (w === "right") {
        c.fillRect(2.2, headY - 0.5, 1.8, 1.8);
      }
    } else {
      c.fillStyle = p.hairColor;
      c.beginPath();
      c.arc(0, headY - 0.5, 6.1, 0, Math.PI * 2);
      c.fill();
    }

    // Balão de fala se estiver conversando na aglomeração ou interagindo perto do jogador
    if (p.chatText && player && Math.hypot(player.x - p.x, player.y - p.y) < 220) {
      c.font = "bold 7px sans-serif";
      const tw = Math.min(185, Math.max(54, c.measureText(p.chatText).width + 12));
      const bx = -tw / 2;
      const by = headY - 21;
      c.fillStyle = "rgba(15, 23, 42, 0.88)";
      c.strokeStyle = "#94a3b8";
      c.lineWidth = 1.0;
      c.beginPath();
      c.roundRect(bx, by, tw, 12.5, 3.5);
      c.fill();
      c.stroke();
      c.fillStyle = "#e2e8f0";
      c.textAlign = "center";
      c.fillText(p.chatText, 0, by + 9);
    }

    c.restore();
  },
};
