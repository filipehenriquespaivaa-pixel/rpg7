/* js/citizens/snow-citizen.js
 * Morador da Vila Glacial dos Picos Gelados: skins (pele, cabelo, roupa), nomes e desenho.
 * As paletas daqui tambem sao usadas pelos prisioneiros (snow-prisoner.js) e soldados (snow-soldier.js): _initCitizens
 * (js/core/snow-peak-city.js) cria os tres tipos com os mesmos indices. A criacao e o movimento continuam la.
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CITIZEN_KINDS["snow-citizen"] = {
  id: "snow-citizen",
  city: "snow",
  description: "Morador da Vila Glacial dos Picos Gelados (nomes, skins e desenho). As paletas tambem servem aos prisioneiros e soldados.",
  // =========================================================================
  // POPULAÇÃO DA VILA GLACIAL DAS ALTURAS (MORADORAS DAS 24 CASAS):
  // - 1 ou 2 mulheres em cada uma das 24 casas (total: 38 moradoras).
  // - Cores variadas (tons de pele variados: clara, rosada, oliva, morena, parda, negra;
  //   cabelos variados: preto, castanho, ruivo acobreado, loiro, grisalho; 5 penteados).
  // - Todos usando trajes alpinos com variedade (6 estilos e cores base diferentes)
  //   e DETALHES VERMELHOS EM TODOS (xale/cachecol vermelho, faixa/cinto vermelho,
  //   barra da saia e punhos bordados em vermelho, fitas/laços vermelhos).
  // - Rotina viva de RPG:
  //   * Entram e saem de suas casas (abrindo a porta ao passar);
  //   * Passeiam pelas ruas de paralelepípedo, becos e Praça Central;
  //   * Interagem e conversam entre si quando se encontram nas ruas/praça;
  //   * Ao anoitecer, todas voltam para suas respectivas casas para passar a noite!
  // =========================================================================
  // tons de pele (compartilhados com prisioneiros e soldados)
  skinTones: [
    "#fde68a", // Clara dourada
    "#fbcfe8", // Clara rosada
    "#f3d5b5", // Pêssego suave
    "#e6b89c", // Morena clara
    "#d4a373", // Trigueira / Bronzeada
    "#b07d62", // Parda / Morena média
    "#8d5524", // Morena escura
    "#582f0e", // Negra retinta
  ],
  // cores de cabelo (compartilhadas)
  hairColors: [
    "#1c1917", // Preto azeviche
    "#3b1d0a", // Castanho café
    "#78350f", // Castanho amendoado
    "#b45309", // Ruivo acobreado
    "#9a3412", // Ruivo intenso
    "#eab308", // Loiro dourado
    "#cbd5e1", // Grisalho trançado
  ],
  // Trajes alpinos variados — TODOS combinados com detalhes vermelhos (#dc2626, #ef4444, #b91c1c)
  // paletas de roupa (compartilhadas)
  outfitPalettes: [
    { name: "Casaco Azul-Noite com Xale e Barra Vermelha", coat: "#1e3a8a", skirt: "#172554", apron: "#f8fafc", redMain: "#dc2626", redLight: "#ef4444", redDark: "#991b1b" },
    { name: "Traje Verde-Pinheiro com Corpete e Faixa Vermelha", coat: "#14532d", skirt: "#052e16", apron: "#e2e8f0", redMain: "#dc2626", redLight: "#f87171", redDark: "#b91c1c" },
    { name: "Túnica de Camurça Marrom com Manto e Punhos Vermelhos", coat: "#5c2808", skirt: "#3b1d0a", apron: "#fef3c7", redMain: "#ef4444", redLight: "#f87171", redDark: "#991b1b" },
    { name: "Vestido de Lã Cinza-Ardósia com Cachecol e Bordado Vermelho", coat: "#334155", skirt: "#1e293b", apron: "#f1f5f9", redMain: "#dc2626", redLight: "#ef4444", redDark: "#991b1b" },
    { name: "Traje de Lã Creme da Montanha com Colete e Saia Debruada em Vermelho", coat: "#78716c", skirt: "#44403c", apron: "#fafaf9", redMain: "#b91c1c", redLight: "#ef4444", redDark: "#7f1d1d" },
    { name: "Casaco Ameixa Escuro com Capuz e Faixa Carmesim", coat: "#3b0764", skirt: "#2e1065", apron: "#f5f3ff", redMain: "#ef4444", redLight: "#f87171", redDark: "#b91c1c" },
    { name: "Traje Carvão Alpino com Xale Vermelho Vivo", coat: "#27272a", skirt: "#18181b", apron: "#e4e4e7", redMain: "#dc2626", redLight: "#ef4444", redDark: "#991b1b" },
  ],
  // nomes femininos dos moradores, por ordem de criacao
  femaleNames: [
    "Helena", "Clara", "Lívia", "Aurora", "Freya", "Beatriz", "Astrid", "Mirela",
    "Sofia", "Ingrid", "Elisa", "Valéria", "Camila", "Bianca", "Aline", "Diana",
    "Lorena", "Nádia", "Olívia", "Cecília", "Marina", "Celeste", "Íris", "Érica",
    "Lara", "Greta", "Marta", "Sílvia", "Regina", "Tânia", "Luciana", "Estela",
    "Alba", "Noêmia", "Catarina", "Rosa", "Violeta", "Ágata", "Bárbara", "Dora"
  ],
  // Desenho no Canvas (antigo _renderCitizen): (ctx, npc, timeOfDay, animTimer, player)
  // Renderiza uma moradora da Vila Glacial com cores variadas e trajes alpinos com DETALHES VERMELHOS obrigatórios
  draw: function (c, npc, timeOfDay, animTimer, player) {
    c.save();
    c.translate(npc.x, npc.y);

    const w = npc.facing || "down";
    const isMoving = !!npc.isMoving;
    const isSleeping = npc.state === "night_at_home" && npc.isInsideHouse;
    const isInteracting = npc.state === "interacting";
    const walkSin = isMoving ? Math.sin(npc.walkPhase) : 0;
    const bob = isMoving
      ? Math.abs(Math.sin(npc.walkPhase)) * 1.8
      : isInteracting
        ? Math.sin(animTimer * 4 + npc.id) * 0.7
        : Math.sin(animTimer * 2 + npc.id) * 0.35;

    const pal = npc.palette;
    const redMain = pal.redMain;   // #dc2626 / #ef4444 / #b91c1c
    const redLight = pal.redLight; // #ef4444 / #f87171
    const redDark = pal.redDark;   // #991b1b / #7f1d1d

    // 1. Sombra no chão
    c.fillStyle = "rgba(15, 23, 42, 0.35)";
    c.beginPath();
    c.ellipse(0, 2.5, 7.8, 4.2, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Manto / Xale Vermelho nas costas (quando olhando para baixo/lados)
    const capeSway = isMoving ? Math.cos(npc.walkPhase) * 1.8 : 0;
    if (w !== "up") {
      c.fillStyle = redDark;
      c.fillRect(-7.5 + capeSway * 0.3, -15 - bob, 15, 14);
      c.fillStyle = redMain;
      c.fillRect(-6.5 + capeSway * 0.3, -15 - bob, 13, 6);
    }

    // 3. Pernas e Botas de Inverno Anatômicas com Balanço Pendular Idêntico ao Player
    const legMult = 2.8,
      legSwingL = isMoving ? -walkSin * legMult : 0,
      legSwingR = isMoving ? walkSin * legMult : 0;

    if (w === "up") {
      // VISTA TRASEIRA (COSTAS): Passada vertical alternada
      // Perna Esquerda
      c.fillStyle = "#1e293b";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(-3.2, -3.5 + legSwingL, 0.9, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = redMain;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.3);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#1e293b";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.25)";
      c.fillRect(3.4, -3.5 + legSwingR, 0.9, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = redMain;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.3);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "down") {
      // VISTA FRONTAL: Passada vertical alternada
      // Perna Esquerda
      c.fillStyle = "#334155";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(-4.5, -1.7 + legSwingL, 2.4, 2.2);
      c.fillStyle = "#292524";
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = redMain;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.3);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#334155";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(255, 255, 255, 0.12)";
      c.fillRect(2.1, -1.7 + legSwingR, 2.4, 2.2);
      c.fillStyle = "#292524";
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = redMain;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.3);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "left") {
      // VISTA LATERAL ESQUERDA: Pêndulo anatômico com pivô em y = -3.5
      const strideRange = 0.48,
        frontAngle = -walkSin * strideRange,
        backAngle = walkSin * strideRange;

      // Perna de trás (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#1e293b";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = redMain;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.0, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#334155";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = redMain;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.3, 6.8, 5.2, 1.2);
      c.restore();
    } else {
      // VISTA LATERAL DIREITA: Pêndulo anatômico com pivô em y = -3.5
      const strideRange = 0.48,
        frontAngle = walkSin * strideRange,
        backAngle = -walkSin * strideRange;

      // Perna de trás (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#1e293b";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = redMain;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.8, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#334155";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = "#292524";
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = redMain;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.9, 6.8, 5.2, 1.2);
      c.restore();
    }

    // 4. Saia Longa de Inverno Acinturada + BARRA VERMELHA BORDADA EM TODAS
    const skirtSway = walkSin * 1.1;
    c.fillStyle = pal.skirt;
    c.beginPath();
    c.moveTo(-6.5, -6 - bob);
    c.lineTo(6.5, -6 - bob);
    c.lineTo(8.2 + skirtSway, 2.2 - bob * 0.3);
    c.lineTo(-8.2 + skirtSway, 2.2 - bob * 0.3);
    c.closePath();
    c.fill();

    // Faixa Vermelha Dupla na Barra da Saia (Detalhe Vermelho Obrigatório #1)
    c.fillStyle = redMain;
    c.fillRect(-7.8 + skirtSway * 0.8, -0.5 - bob * 0.3, 15.6, 2.2);
    c.fillStyle = redLight;
    c.fillRect(-7.5 + skirtSway * 0.8, 0.2 - bob * 0.3, 15.0, 0.8);

    // Avental / Sobressaia frontal com friso vermelho (em alguns modelos de traje para dar variedade)
    if (npc.outfitStyle % 2 === 0 && w !== "up") {
      const apOffX = w === "left" ? -1.8 : w === "right" ? 1.8 : 0;
      c.fillStyle = pal.apron;
      c.fillRect(-4.2 + apOffX, -5.5 - bob, 8.4, 6.2);
      // Bordado vermelho no avental
      c.fillStyle = redMain;
      c.fillRect(-4.2 + apOffX, -0.6 - bob, 8.4, 1.3);
    }

    // 5. Casaco / Corpete de Inverno Variado + FAIXA E DETALHES VERMELHOS
    c.fillStyle = pal.coat;
    c.fillRect(-6.5, -16 - bob, 13, 10.5);

    // Detalhe Vermelho no Corpete / Peito (varia conforme outfitStyle, mas sempre vermelho!)
    if (w !== "up") {
      const fOffX = w === "left" ? -1.5 : w === "right" ? 1.5 : 0;
      if (npc.outfitStyle === 0 || npc.outfitStyle === 3) {
        // Lapelas e frente vermelha no casaco
        c.fillStyle = redMain;
        c.fillRect(-2.5 + fOffX, -15.5 - bob, 5, 9.5);
        c.fillStyle = "#fde047";
        c.fillRect(-0.6 + fOffX, -13.5 - bob, 1.2, 1.2);
        c.fillRect(-0.6 + fOffX, -10.5 - bob, 1.2, 1.2);
      } else if (npc.outfitStyle === 1 || npc.outfitStyle === 4) {
        // Corpete trançado com fitas vermelhas
        c.fillStyle = redDark;
        c.fillRect(-3.5 + fOffX, -15 - bob, 7, 8.5);
        c.strokeStyle = redLight;
        c.lineWidth = 1.1;
        c.beginPath();
        c.moveTo(-2.5 + fOffX, -14.5 - bob);
        c.lineTo(2.5 + fOffX, -11.5 - bob);
        c.moveTo(2.5 + fOffX, -14.5 - bob);
        c.lineTo(-2.5 + fOffX, -11.5 - bob);
        c.stroke();
      } else {
        // Xale em V vermelho sobre o peito
        c.fillStyle = redMain;
        c.beginPath();
        c.moveTo(-6 + fOffX, -16 - bob);
        c.lineTo(6 + fOffX, -16 - bob);
        c.lineTo(0 + fOffX, -8 - bob);
        c.closePath();
        c.fill();
      }
    }

    // Cinto / Faixa Vermelha na Cintura (Detalhe Vermelho Obrigatório #2)
    c.fillStyle = redMain;
    c.fillRect(-6.8, -7.2 - bob, 13.6, 2.4);
    if (w !== "up") {
      // Laço/faixa caída vermelha na cintura
      c.fillStyle = redLight;
      c.fillRect(1.5, -6.5 - bob, 2.2, 4.8);
    }

    // Cachecol / Gola Vermelha Quente no Pescoço (Detalhe Vermelho Obrigatório #3)
    c.fillStyle = redMain;
    c.fillRect(-6.2, -17.2 - bob, 12.4, 2.8);
    c.fillStyle = redLight;
    c.fillRect(-5.5, -16.8 - bob, 11.0, 1.1);
    if (w !== "up") {
      // Ponta do cachecol vermelho no peito
      c.fillStyle = redMain;
      c.fillRect(2.2, -15.2 - bob, 2.6, 5.5);
      c.fillStyle = redLight;
      c.fillRect(2.2, -10.5 - bob, 2.6, 1.0);
    } else {
      // Quando vista de costas (w === "up"), mostra o Xale/Manto Vermelho nas costas
      c.fillStyle = redMain;
      c.fillRect(-7, -16 - bob, 14, 12);
      c.fillStyle = redDark;
      c.fillRect(-5, -15 - bob, 10, 9);
      c.fillStyle = redLight;
      c.fillRect(-7, -5.2 - bob, 14, 1.5);
    }

    // 6. Braços com Mangas e PUNHOS VERMELHOS + Mãos com tom de pele variado
    const walkSwing = isMoving ? walkSin : (isInteracting ? Math.sin(animTimer * 6 + npc.id) * 0.5 : 0),
      swingL = walkSwing * 0.75,
      swingR = -walkSwing * 0.75,
      shoulderTopY = -15.2 - bob;

    if (w === "down" || w === "up") {
      // Braço esquerdo (topo fixo no ombro)
      const wristYL = shoulderTopY + 5.0 + swingL;
      c.fillStyle = pal.coat;
      c.fillRect(-8.4, shoulderTopY, 2.6, 6.2 + swingL);
      c.fillStyle = redMain; // Punho vermelho
      c.fillRect(-8.4, wristYL, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(-8.3, wristYL + 1.5, 2.4, 2.0);

      // Braço direito (topo fixo no ombro)
      const wristYR = shoulderTopY + 5.0 + swingR;
      c.fillStyle = pal.coat;
      c.fillRect(5.8, shoulderTopY, 2.6, 6.2 + swingR);
      c.fillStyle = redMain; // Punho vermelho
      c.fillRect(5.8, wristYR, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(5.9, wristYR + 1.5, 2.4, 2.0);
    } else {
      const isLeft = w === "left",
        shoulderPivotX = isLeft ? -1.0 : 0.8,
        armAngle = (isLeft ? 1 : -1) * walkSwing * 0.45;
      c.save();
      c.translate(shoulderPivotX, shoulderTopY);
      c.rotate(armAngle);
      c.fillStyle = pal.coat;
      c.fillRect(-1.3, 0, 2.6, 6.2);
      c.fillStyle = redMain; // Punho vermelho
      c.fillRect(-1.3, 4.8, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(-1.2, 6.4, 2.4, 2.0);
      c.restore();
    }

    // Cesto ou pote rústico na mão durante o passeio (para algumas moradoras)
    if (npc.propInHand === "basket" && !isSleeping && w !== "up") {
      const bx = w === "left" ? -8.5 : 7.5;
      const by = -6.5 - bob;
      c.fillStyle = "#b45309";
      c.fillRect(bx - 3, by, 6, 4.5);
      c.fillStyle = redMain; // Pano vermelho cobrindo o cesto!
      c.fillRect(bx - 3.2, by - 1, 6.4, 1.6);
    }

    // 7. Cabeça, Cabelos Variados e Fitas/Adornos Vermelhos
    const headY = -22 - bob;

    // Cabelo atrás da cabeça (para cabelos longos/soltos)
    if (npc.hairStyle === 0 || npc.hairStyle === 1 || npc.hairStyle === 3) {
      c.fillStyle = npc.hairColor;
      c.fillRect(-6.8, headY - 2, 13.6, 9.5);
    }

    // Rosto (com tom de pele variado!)
    c.fillStyle = npc.skinColor;
    c.beginPath();
    c.arc(0, headY, 6.2, 0, Math.PI * 2);
    c.fill();

    // Topo do Cabelo / Franja Feminina
    c.fillStyle = npc.hairColor;
    c.beginPath();
    c.arc(0, headY - 1.8, 6.4, Math.PI * 0.92, Math.PI * 0.08);
    c.fill();

    // Penteados específicos com DETALHES VERMELHOS na cabeça:
    if (npc.hairStyle === 1) {
      // Duas tranças compridas com laços vermelhos nas pontas
      c.fillStyle = npc.hairColor;
      c.fillRect(-6.8, headY + 1, 2.3, 8.5);
      c.fillRect(4.5, headY + 1, 2.3, 8.5);
      c.fillStyle = redLight;
      c.fillRect(-7.1, headY + 7.5, 2.9, 1.8);
      c.fillRect(4.2, headY + 7.5, 2.9, 1.8);
    } else if (npc.hairStyle === 2) {
      // Coque alto elegante com fita vermelha ao redor
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(0, headY - 7.2, 3.6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = redMain;
      c.fillRect(-3.8, headY - 6.2, 7.6, 1.8);
    } else if (npc.hairStyle === 4) {
      // Capuz de inverno com borda vermelha e pele clara
      c.strokeStyle = redMain;
      c.lineWidth = 2.2;
      c.beginPath();
      c.arc(0, headY - 0.5, 6.6, Math.PI * 0.85, Math.PI * 0.15);
      c.stroke();
    } else {
      // Tiara / Fita Vermelha no cabelo (para hairStyle 0 e 3)
      c.fillStyle = redMain;
      c.fillRect(-6.0, headY - 4.8, 12.0, 1.7);
      c.fillStyle = redLight;
      c.fillRect(3.5, headY - 5.4, 2.6, 2.6);
    }

    // Se vista de costas (w === "up"), preenche a parte de trás do cabelo + laço vermelho
    if (w === "up") {
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(0, headY - 0.5, 6.3, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = redMain;
      c.fillRect(-4.5, headY - 2, 9, 1.8);
      c.fillStyle = redLight;
      c.fillRect(-1.5, headY - 2.5, 3, 4);
    } else {
      // Olhos e expressão facial
      c.fillStyle = "#1e293b";
      if (isSleeping) {
        // Olhos fechados descansando em casa à noite
        c.fillRect(-3.2, headY + 0.2, 2.2, 0.9);
        c.fillRect(1.0, headY + 0.2, 2.2, 0.9);
      } else if (w === "down") {
        c.fillRect(-3.2, headY - 0.4, 1.9, 2.0);
        c.fillRect(1.3, headY - 0.4, 1.9, 2.0);
        // Leve rubor nas bochechas pelo frio
        c.fillStyle = "rgba(244, 63, 94, 0.32)";
        c.fillRect(-4.4, headY + 1.4, 1.8, 1.1);
        c.fillRect(2.6, headY + 1.4, 1.8, 1.1);
      } else if (w === "left") {
        c.fillRect(-4.2, headY - 0.4, 1.9, 2.0);
        c.fillStyle = "rgba(244, 63, 94, 0.32)";
        c.fillRect(-3.2, headY + 1.4, 1.8, 1.1);
      } else if (w === "right") {
        c.fillRect(2.3, headY - 0.4, 1.9, 2.0);
        c.fillStyle = "rgba(244, 63, 94, 0.32)";
        c.fillRect(1.4, headY + 1.4, 1.8, 1.1);
      }
    }

    // 8. Indicador de sono ("Zzz") quando estão passando a noite em casa, ou Balão de Conversa quando interagem!
    if (isSleeping) {
      const zFloat = (animTimer * 1.5 + npc.id) % 1;
      c.fillStyle = `rgba(226, 232, 240, ${0.85 - zFloat * 0.6})`;
      c.font = "bold 7.5px sans-serif";
      c.textAlign = "center";
      c.fillText("Zzz", 6 + zFloat * 4, headY - 8 - zFloat * 6);
    } else if (isInteracting && npc.chatText && player && Math.hypot(player.x - npc.x, player.y - npc.y) < 260) {
      c.font = "bold 7.5px sans-serif";
      const text = npc.chatText;
      const tw = Math.min(180, Math.max(54, c.measureText(text).width + 12));
      const bx = -tw / 2;
      const by = headY - 22;

      c.fillStyle = "rgba(15, 23, 42, 0.88)";
      c.strokeStyle = "#ef4444";
      c.lineWidth = 1.1;
      c.beginPath();
      c.roundRect(bx, by, tw, 13, 4);
      c.fill();
      c.stroke();

      c.fillStyle = "#f8fafc";
      c.textAlign = "center";
      c.fillText(text, 0, by + 9.2);
    }

    c.restore();
  },
};
