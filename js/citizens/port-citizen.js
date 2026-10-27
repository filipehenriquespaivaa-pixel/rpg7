/* js/citizens/port-citizen.js
 * Habitante da Cidade Portuaria: skins (pele e roupa), perfis e desenho.
 * A criacao e o movimento continuam em js/core/port-city.js (_initCitizens / updateAndGetCitizenRenderItems).
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CITIZEN_KINDS["port-citizen"] = {
  id: "port-citizen",
  city: "port",
  description: "Morador da Cidade Portuaria (perfis, skins e desenho)",
  // =========================================================================
  // POPULAÇÃO DA CIDADE PORTUÁRIA (MARINHEIROS, CAPITÃES, PESCADORES E MERCADORES)
  // =========================================================================
  // perfis por ordem de criacao (nome, ofício, adereco...)
  profiles: [
    { name: "Capitão Vasco", title: "Comandante da Frota Mercante", gender: "m", style: "captain", prop: "spyglass" },
    { name: "Marina", title: "Navegadora das Estrelas do Sul", gender: "f", style: "navigator", prop: "compass" },
    { name: "Tiago", title: "Mestre Pescador das Águas Rasas", gender: "m", style: "fisherman", prop: "rod" },
    { name: "Coralina", title: "Mercadora de Pérolas e Conchas", gender: "f", style: "merchant", prop: "basket" },
    { name: "Lourenço", title: "Contramestre do Cais Principal", gender: "m", style: "sailor", prop: "rope" },
    { name: "Beatriz", title: "Cartógrafa da Capitania", gender: "f", style: "navigator", prop: "scroll" },
    { name: "Simão", title: "Carpinteiro Naval de Caravelas", gender: "m", style: "sailor", prop: "hammer" },
    { name: "Brisa", title: "Tecelã de Velas e Redes", gender: "f", style: "merchant", prop: "basket" },
    { name: "Capitão Diogo", title: "Lobo do Mar das Ilhas Tropicais", gender: "m", style: "captain", prop: "spyglass" },
    { name: "Helena", title: "Taverneira do Porto Dourado", gender: "f", style: "merchant", prop: "mug" },
    { name: "Mateus", title: "Vigia do Farol Portuário", gender: "m", style: "sailor", prop: "lantern" },
    { name: "Clara", title: "Pescadora da Enseada Azul", gender: "f", style: "fisherman", prop: "rod" },
    { name: "Gael", title: "Marujo de Gávea", gender: "m", style: "sailor", prop: "rope" },
    { name: "Aurora", title: "Comerciante de Especiarias", gender: "f", style: "merchant", prop: "basket" },
  ],
  // cores de roupa
  outfitColors: [
    { shirt: "#f8fafc", vest: "#1e3a8a", pants: "#1e293b", hat: "#1e3a8a", trim: "#fbbf24" }, // Capitão Azul Marinho & Ouro
    { shirt: "#e0f2fe", vest: "#0284c7", pants: "#334155", hat: "#f8fafc", trim: "#0284c7" }, // Marujo Celeste
    { shirt: "#fef3c7", vest: "#b45309", pants: "#451a03", hat: "#d97706", trim: "#f59e0b" }, // Pescador Chapéu de Palha
    { shirt: "#f8fafc", vest: "#991b1b", pants: "#1c1917", hat: "#7f1d1d", trim: "#facc15" }, // Corsário Carmesim
    { shirt: "#ecfdf5", vest: "#047857", pants: "#1e293b", hat: "#065f46", trim: "#34d399" }, // Mercador Esmeralda
  ],
  // tons de pele
  skinTones: [
    "#f6cfb2",
    "#e5af80",
    "#d4976a",
    "#ba7c4e",
    "#9a5b2d",
    "#78421b",
  ],
  // Desenho no Canvas (antigo _renderPortCitizen): (ctx, npc, timeOfDay, animTimer, player)
  // =========================================================================
  // RENDERIZAÇÃO DO MORADOR PORTUÁRIO NO CANVAS
  // - Proporções humanas e caminhada anatômica IDÊNTICAS aos moradores de DesertCity e SnowPeakCity:
  //   * Pernas com balanço pendular rotacionado no pivô do quadril (y = -3.5) nas vistas laterais (left / right)
  //     e passada vertical alternada nas vistas frontal e traseira (down / up).
  //   * Tronco estreito em perfil lateral e largo de frente/costas.
  //   * Braços com pivô rotacional no ombro nas vistas laterais e topo fixo no ombro de frente/costas.
  //   * Pescoço, cabeça, cabelo direcional, chapéus navais e acessórios nas mãos.
  // =========================================================================
  draw: function (c, npc, timeOfDay, animTimer, player) {
    c.save();
    c.translate(npc.x, npc.y);

    const w = npc.facing || "down";
    const isMoving = !!npc.isMoving;
    const isSleeping = npc.state === "night_at_home" && npc.isInsideHouse;
    const isInteracting = npc.state === "interacting";
    const isChatting = npc.state === "chatting";

    const walkSin = isMoving ? Math.sin(npc.walkPhase) : 0;
    const bob = isMoving
      ? Math.abs(Math.sin(npc.walkPhase)) * 1.8
      : isInteracting || isChatting
        ? Math.sin(animTimer * 4 + npc.id) * 0.7
        : Math.sin(animTimer * 2 + npc.id) * 0.35;

    const pal = npc.outfit;
    const bootsColor = "#451a03";

    // 1. Sombra padrão no solo
    c.fillStyle = "rgba(15, 23, 42, 0.35)";
    c.beginPath();
    c.ellipse(0, 2.5, 7.8, 4.2, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Capa de Capitão / Casaca Naval esvoaçando nas costas (para Capitães e Navegadores)
    if ((npc.style === "captain" || npc.style === "navigator") && !isSleeping) {
      const capeSway = isMoving ? Math.cos(npc.walkPhase) * 1.8 : 0;
      if (w === "up") {
        c.fillStyle = pal.vest;
        c.fillRect(-7.0, -16.0 - bob, 14.0, 13.0);
        c.fillStyle = pal.trim;
        c.fillRect(-7.0, -4.0 - bob, 14.0, 1.4);
      } else if (w === "down") {
        c.fillStyle = pal.vest;
        c.fillRect(-7.2 + capeSway * 0.25, -15.5 - bob, 14.4, 12.5);
        c.fillStyle = pal.trim;
        c.fillRect(-7.2 + capeSway * 0.25, -4.0 - bob, 14.4, 1.2);
      } else {
        const capeX = w === "left" ? 0.5 : -4.5;
        c.fillStyle = pal.vest;
        c.fillRect(capeX + capeSway * 0.2, -15.5 - bob, 4.2, 12.5);
      }
    }

    // 3. Pernas e Botas Navais com Balanço Pendular Idêntico às outras cidades (Pivô no quadril y = -3.5)
    const legMult = 2.8;
    const legSwingL = isMoving ? -walkSin * legMult : 0;
    const legSwingR = isMoving ? walkSin * legMult : 0;

    if (w === "up") {
      // VISTA TRASEIRA (COSTAS): Passada vertical alternada
      // Perna Esquerda
      c.fillStyle = pal.pants;
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(-3.2, -3.5 + legSwingL, 0.9, 4.6);
      c.fillStyle = bootsColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = pal.trim;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = pal.pants;
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(3.4, -3.5 + legSwingR, 0.9, 4.6);
      c.fillStyle = bootsColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = pal.trim;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "down") {
      // VISTA FRONTAL: Passada vertical alternada
      // Perna Esquerda
      c.fillStyle = pal.pants;
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(-4.5, -1.7 + legSwingL, 2.4, 2.2);
      c.fillStyle = bootsColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = pal.trim;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = pal.pants;
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(2.1, -1.7 + legSwingR, 2.4, 2.2);
      c.fillStyle = bootsColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = pal.trim;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "left") {
      // VISTA LATERAL ESQUERDA: Pêndulo anatômico com pivô fixo no quadril (y = -3.5) idêntico ao player e às outras cidades
      const strideRange = 0.48;
      const frontAngle = -walkSin * strideRange;
      const backAngle = walkSin * strideRange;

      // Perna de trás (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = pal.pants;
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = bootsColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = pal.trim;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.0, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = pal.pants;
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = bootsColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = pal.trim;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.3, 6.8, 5.2, 1.2);
      c.restore();
    } else {
      // VISTA LATERAL DIREITA: Pêndulo anatômico com pivô fixo no quadril (y = -3.5) idêntico ao player e às outras cidades
      const strideRange = 0.48;
      const frontAngle = walkSin * strideRange;
      const backAngle = -walkSin * strideRange;

      // Perna de trás (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = pal.pants;
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = bootsColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = pal.trim;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.8, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = pal.pants;
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(-1.4, 1.8, 2.8, 2.0);
      c.fillStyle = bootsColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = pal.trim;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.9, 6.8, 5.2, 1.2);
      c.restore();
    }

    // 4. Tronco: Camisa Listrada de Marinheiro e Colete / Casaca Naval (com perfil lateral estreito!)
    if (w === "left" || w === "right") {
      const isLeft = w === "left";
      const profX = isLeft ? -4.8 : -4.2;
      c.fillStyle = pal.shirt;
      c.fillRect(profX, -16.0 - bob, 9.0, 12.5);
      // Listras horizontais de marinheiro no perfil
      c.fillStyle = "rgba(3, 105, 161, 0.35)";
      for (let sy = -14.2; sy < -5.0; sy += 3.0) {
        c.fillRect(profX + 0.2, sy - bob, 8.6, 1.2);
      }
      // Casaca / Colete lateral
      c.fillStyle = pal.vest;
      c.fillRect(profX + (isLeft ? 2.2 : 0), -16.0 - bob, 6.8, 12.2);
      c.fillStyle = pal.trim;
      c.fillRect(profX, -5.0 - bob, 9.0, 1.2);
      // Cinto de couro com fivela lateral
      c.fillStyle = "#b45309";
      c.fillRect(profX - 0.2, -7.0 - bob, 9.4, 2.4);
    } else {
      // Vista Frontal / Traseira
      c.fillStyle = pal.shirt;
      c.fillRect(-6.5, -16.0 - bob, 13.0, 12.5);
      // Listras horizontais azuis clássicas de marinheiro
      c.fillStyle = "rgba(3, 105, 161, 0.35)";
      for (let sy = -14.2; sy < -5.0; sy += 3.0) {
        c.fillRect(-6.2, sy - bob, 12.4, 1.2);
      }
      if (w === "up") {
        // Costas do colete / casaca naval
        c.fillStyle = pal.vest;
        c.fillRect(-6.5, -16.0 - bob, 13.0, 12.2);
        c.fillStyle = pal.trim;
        c.fillRect(-6.5, -4.8 - bob, 13.0, 1.2);
      } else {
        // Frente do colete / casaca naval aberta mostrando a camisa listrada
        c.fillStyle = pal.vest;
        c.fillRect(-6.5, -16.0 - bob, 3.8, 12.2);
        c.fillRect(2.7, -16.0 - bob, 3.8, 12.2);
        // Lapelas / botões dourados
        c.fillStyle = pal.trim;
        c.fillRect(-3.2, -14.5 - bob, 1.0, 1.0);
        c.fillRect(-3.2, -11.5 - bob, 1.0, 1.0);
        c.fillRect(2.2, -14.5 - bob, 1.0, 1.0);
        c.fillRect(2.2, -11.5 - bob, 1.0, 1.0);
      }
      // Cinto naval com fivela dourada
      c.fillStyle = "#b45309";
      c.fillRect(-6.8, -7.0 - bob, 13.6, 2.4);
      if (w !== "up") {
        c.fillStyle = "#facc15";
        c.fillRect(-1.2, -7.0 - bob, 2.4, 2.4);
      }
    }

    // 5. Braços com Mangas, Punhos e Mãos (com rotação no ombro de lado e topo fixo de frente/costas, idêntico às outras cidades!)
    const walkSwing = isMoving
      ? walkSin
      : isInteracting || isChatting
        ? Math.sin(animTimer * 5 + npc.id) * 0.4
        : 0;
    const swingL = walkSwing * 0.75;
    const swingR = -walkSwing * 0.75;
    const shoulderTopY = -15.2 - bob;

    if (w === "down" || w === "up") {
      // Braço esquerdo (topo fixo no ombro)
      const wristYL = shoulderTopY + 5.0 + swingL;
      c.fillStyle = pal.vest;
      c.fillRect(-8.4, shoulderTopY, 2.6, 6.2 + swingL);
      c.fillStyle = pal.trim;
      c.fillRect(-8.4, wristYL, 2.6, 1.5);
      c.fillStyle = npc.skinColor;
      c.fillRect(-8.3, wristYL + 1.5, 2.4, 2.0);

      // Braço direito (topo fixo no ombro)
      const wristYR = shoulderTopY + 5.0 + swingR;
      c.fillStyle = pal.vest;
      c.fillRect(5.8, shoulderTopY, 2.6, 6.2 + swingR);
      c.fillStyle = pal.trim;
      c.fillRect(5.8, wristYR, 2.6, 1.5);
      c.fillStyle = npc.skinColor;
      c.fillRect(5.9, wristYR + 1.5, 2.4, 2.0);
    } else {
      // Vista lateral (left / right): Braço com pivô de rotação no ombro idêntico a DesertCity e SnowPeakCity!
      const isLeft = w === "left";
      const shoulderPivotX = isLeft ? -1.0 : 0.8;
      const armAngle = (isLeft ? 1 : -1) * walkSwing * 0.45;
      c.save();
      c.translate(shoulderPivotX, shoulderTopY);
      c.rotate(armAngle);
      c.fillStyle = pal.vest;
      c.fillRect(-1.3, 0, 2.6, 6.2);
      c.fillStyle = pal.trim;
      c.fillRect(-1.3, 4.8, 2.6, 1.5);
      c.fillStyle = npc.skinColor;
      c.fillRect(-1.2, 6.3, 2.4, 2.0);
      c.restore();
    }

    // 6. Acessórios Portuários na Mão (Luneta, Vara de Pesca, Lanterna, Cesto, Caneca)
    if (npc.propInHand && !isSleeping && w !== "up") {
      const propX = w === "left" ? -7.6 : 7.6;
      const propY = -5.5 - bob;
      if (npc.propInHand === "spyglass") {
        c.fillStyle = "#d97706";
        c.fillRect(propX - 1.5, propY - 1.5, 4.2, 1.8);
        c.fillStyle = "#fde047";
        c.fillRect(propX + 1.8, propY - 1.8, 1.5, 2.4);
      } else if (npc.propInHand === "rod") {
        c.strokeStyle = "#78350f";
        c.lineWidth = 1.3;
        c.beginPath();
        c.moveTo(propX, propY + 2);
        c.lineTo(propX + (w === "left" ? -6 : 6), propY - 14);
        c.stroke();
      } else if (npc.propInHand === "basket") {
        c.fillStyle = "#b45309";
        c.beginPath();
        c.ellipse(propX, propY, 3.8, 2.8, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#38bdf8";
        c.fillRect(propX - 2.2, propY - 2.5, 4.4, 1.2);
      } else if (npc.propInHand === "lantern") {
        c.fillStyle = "#facc15";
        c.beginPath();
        c.arc(propX, propY + 1.5, 2.2, 0, Math.PI * 2);
        c.fill();
      }
    }

    // 7. Cabeça, Pescoço Anatômico, Cabelo Direcional e Rosto Expressivo
    const headX = 0;
    const headY = -22.0 - bob;

    // Pescoço de ligação anatômica
    c.fillStyle = npc.skinColor;
    c.fillRect(-2.2, headY + 3.2, 4.4, 3.0);

    // Cabelo traseiro nas vistas de costas ou laterais
    if (w === "up") {
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(headX, headY, 6.2, 0, Math.PI * 2);
      c.fill();
    } else if (w === "left") {
      c.fillStyle = npc.hairColor;
      c.fillRect(headX + 1.2, headY - 3.2, 4.6, 7.2);
    } else if (w === "right") {
      c.fillStyle = npc.hairColor;
      c.fillRect(headX - 5.8, headY - 3.2, 4.6, 7.2);
    }

    // Rosto
    c.fillStyle = npc.skinColor;
    c.beginPath();
    c.arc(headX, headY, 6.1, 0, Math.PI * 2);
    c.fill();

    // Franja / topo do cabelo
    c.fillStyle = npc.hairColor;
    c.beginPath();
    c.arc(headX, headY - 1.2, 6.2, Math.PI, 0);
    c.fill();

    // 8. Chapéu Naval (Tricórnio de Capitão, Chapéu de Palha de Pescador ou Bandana/Quepe de Marinheiro)
    if (npc.style === "captain") {
      c.fillStyle = pal.hat;
      c.beginPath();
      c.moveTo(-7.6, headY - 2.2);
      c.lineTo(0, headY - 7.8);
      c.lineTo(7.6, headY - 2.2);
      c.closePath();
      c.fill();
      c.strokeStyle = "#facc15";
      c.lineWidth = 1.2;
      c.stroke();
    } else if (npc.style === "fisherman") {
      c.fillStyle = "#eab308";
      c.beginPath();
      c.ellipse(0, headY - 2.8, 7.8, 2.4, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ca8a04";
      c.beginPath();
      c.arc(0, headY - 3.2, 4.8, Math.PI, 0);
      c.fill();
    } else {
      c.fillStyle = pal.hat;
      c.beginPath();
      c.arc(0, headY - 2.0, 6.2, Math.PI, 0);
      c.fill();
      c.fillStyle = pal.trim;
      c.fillRect(-6.0, headY - 2.6, 12.0, 1.5);
    }

    // 9. Olhos e Expressão Facial nas 4 direções
    if (w !== "up") {
      if (isSleeping) {
        c.fillStyle = "#1e293b";
        c.fillRect(-3.2, headY + 0.2, 2.2, 0.9);
        c.fillRect(1.0, headY + 0.2, 2.2, 0.9);
      } else {
        const ex = w === "left" ? -1.4 : w === "right" ? 1.4 : 0;
        c.fillStyle = "#ffffff";
        c.fillRect(-3.2 + ex, headY - 0.3, 2.1, 1.8);
        c.fillRect(1.1 + ex, headY - 0.3, 2.1, 1.8);
        c.fillStyle = "#0f172a";
        c.fillRect(-2.6 + ex, headY, 1.2, 1.3);
        c.fillRect(1.5 + ex, headY, 1.2, 1.3);
        c.fillStyle = npc.hairColor;
        c.fillRect(-3.3 + ex, headY - 1.2, 2.2, 0.7);
        c.fillRect(1.0 + ex, headY - 1.2, 2.2, 0.7);
        c.fillStyle = "#78350f";
        c.fillRect(-1.1 + ex * 0.5, headY + 2.4, 2.2, 0.8);
      }
    } else {
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(headX, headY - 0.4, 6.1, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = pal.trim;
      c.fillRect(-5.8, headY - 2.4, 11.6, 1.5);
    }

    // 10. Balão de diálogo
    if (npc.chatText && player && Math.hypot(player.x - npc.x, player.y - npc.y) < 240) {
      c.font = "bold 7.2px sans-serif";
      const tw = Math.min(200, Math.max(64, c.measureText(npc.chatText).width + 12));
      const bx = -tw / 2;
      const by = headY - 25;
      c.fillStyle = "rgba(9, 9, 11, 0.92)";
      c.strokeStyle = "#0ea5e9";
      c.lineWidth = 1.2;
      c.beginPath();
      c.roundRect(bx, by, tw, 13, 4);
      c.fill();
      c.stroke();
      c.fillStyle = "#f8fafc";
      c.textAlign = "center";
      c.fillText(npc.chatText, 0, by + 9.2);
    }

    c.restore();
  },
};
