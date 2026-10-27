/* js/citizens/desert-citizen.js
 * Habitante do Povoado do Deserto: skins (pele, cabelo, roupa), perfis e desenho.
 * A criacao e o movimento continuam em js/core/desert-city.js (_initCitizens / updateAndGetCitizenRenderItems).
 * Depende de registry.js (carregar depois dele).
 */
"use strict";
CITIZEN_KINDS["desert-citizen"] = {
  id: "desert-citizen",
  city: "desert",
  description: "Morador do Povoado do Deserto (perfis, skins e desenho)",
  // tons de pele (indice = f(id do morador, casa))
  skinTones: [
    "#fcd34d", // Âmbar dourada / bronze sol radiante
    "#f6cfb2", // Pêssego suave do oásis
    "#e5af80", // Bronzeada ensolarada
    "#d4976a", // Canela quente do deserto
    "#ba7c4e", // Trigueira / terracota
    "#9a5b2d", // Morena profunda
    "#78421b", // Castanho escuro / café
    "#4d2911", // Negra retinta luminosa
  ],
  // cores de cabelo
  hairColors: [
    "#151311", // Preto azeviche profundo
    "#2a170e", // Castanho café torrado
    "#452313", // Castanho cacau
    "#693218", // Castanho henna avermelhado
    "#593c1d", // Castanho âmbar
    "#94a3b8", // Grisalho experiente
    "#cbd5e1", // Prateado sábio ancião
  ],
  // Paletas temáticas de trajes do deserto
  // paletas de roupa
  outfitPalettes: [
    {
      name: "Linho Branco do Saara com Faixa Terracota e Ouro",
      robe: "#f8fafc",
      cloak: "#f1f5f9",
      belt: "#c2410c",
      trim: "#d97706",
      headwear: "#f8fafc",
      headwearTrim: "#c2410c",
      sandals: "#78350f"
    },
    {
      name: "Azul-Índigo Real Tuaregue com Ouro e Turquesa",
      robe: "#1e3a8a",
      cloak: "#172554",
      belt: "#d97706",
      trim: "#38bdf8",
      headwear: "#1e3a8a",
      headwearTrim: "#fbbf24",
      sandals: "#451a03"
    },
    {
      name: "Areia Dourada e Ocre com Xale de Canela",
      robe: "#d97706",
      cloak: "#9a3412",
      belt: "#78350f",
      trim: "#fef3c7",
      headwear: "#b45309",
      headwearTrim: "#fef08a",
      sandals: "#581c87"
    },
    {
      name: "Verde Esmeralda do Oásis com Fitas de Linho",
      robe: "#15803d",
      cloak: "#14532d",
      belt: "#ca8a04",
      trim: "#86efac",
      headwear: "#166534",
      headwearTrim: "#ca8a04",
      sandals: "#27272a"
    },
    {
      name: "Manto Carmesim das Caravanas com Lã de Camelo",
      robe: "#991b1b",
      cloak: "#78350f",
      belt: "#b45309",
      trim: "#fecaca",
      headwear: "#7f1d1d",
      headwearTrim: "#fef08a",
      sandals: "#451a03"
    },
    {
      name: "Terracota Ardente com Lenço Azul-Cobalto",
      robe: "#c2410c",
      cloak: "#0369a1",
      belt: "#431407",
      trim: "#38bdf8",
      headwear: "#0284c7",
      headwearTrim: "#fdba74",
      sandals: "#3f200c"
    },
    {
      name: "Açafrão Solar com Manto Púrpura de Mercador",
      robe: "#eab308",
      cloak: "#581c87",
      belt: "#6b21a8",
      trim: "#fef08a",
      headwear: "#ca8a04",
      headwearTrim: "#7e22ce",
      sandals: "#18181b"
    },
    {
      name: "Linho Cru com Colete de Couro Rústico e Faixa Azul",
      robe: "#e2e8f0",
      cloak: "#5c2c16",
      belt: "#1d4ed8",
      trim: "#94a3b8",
      headwear: "#e2e8f0",
      headwearTrim: "#1e3a8a",
      sandals: "#374151"
    }
  ],
  // Perfis individuais dos moradores
  // perfis por ordem de criacao (nome, titulo, cabeca, adereco...)
  profiles: [
    { name: "Tariq", title: "Guardião do Poço Central", gender: "m", head: 0, prop: "amphora", waterSkin: true },
    { name: "Yasmin", title: "Tecelã de Esteiras de Junco", gender: "f", head: 3, prop: "fan", waterSkin: false },
    { name: "Malik", title: "Mercador de Especiarias e Sal", gender: "m", head: 1, prop: "staff", waterSkin: true },
    { name: "Samira", title: "Apanhadora de Tâmaras do Oásis", gender: "f", head: 3, prop: "basket", waterSkin: true },
    { name: "Farid", title: "Mestre de Caravana das Areias", gender: "m", head: 2, prop: "staff", waterSkin: true },
    { name: "Amina", title: "Oleira das Ânforas de Argila", gender: "f", head: 5, prop: "amphora", waterSkin: false },
    { name: "Zayd", title: "Guia das Dunas Silenciosas", gender: "m", head: 1, prop: "staff", waterSkin: true },
    { name: "Layla", title: "Astrônoma do Céu do Deserto", gender: "f", head: 3, prop: null, waterSkin: true },
    { name: "Rashid", title: "Curtidor de Couro de Camelo", gender: "m", head: 0, prop: null, waterSkin: true },
    { name: "Soraya", title: "Ourives de Latão e Turquesa", gender: "f", head: 5, prop: "fan", waterSkin: false },
    { name: "Karim", title: "Cultivador de Ervas do Oásis", gender: "m", head: 4, prop: "basket", waterSkin: true },
    { name: "Fatima", title: "Sábia Anciã das Areias", gender: "f", head: 3, prop: "staff", waterSkin: false },
    { name: "Omar", title: "Pastor de Cabras do Deserto", gender: "m", head: 1, prop: "staff", waterSkin: true },
    { name: "Nadia", title: "Tecelã de Linho Alvo", gender: "f", head: 3, prop: "fan", waterSkin: false },
    { name: "Jalil", title: "Coletor de Resina Aromática", gender: "m", head: 0, prop: "basket", waterSkin: true },
    { name: "Zahra", title: "Bordadeira das Túnicas Reais", gender: "f", head: 5, prop: null, waterSkin: false },
    { name: "Nassir", title: "Vigia das Tempestades de Areia", gender: "m", head: 2, prop: "staff", waterSkin: true },
    { name: "Amira", title: "Curandeira dos Ventos Quentes", gender: "f", head: 3, prop: "amphora", waterSkin: true },
    { name: "Bashir", title: "Contador de Histórias das Dunas", gender: "m", head: 0, prop: null, waterSkin: true },
    { name: "Salma", title: "Guardiã dos Mantimentos", gender: "f", head: 5, prop: "basket", waterSkin: false },
    { name: "Hakim", title: "Ancião Guardião das Tradições", gender: "m", head: 1, prop: "staff", waterSkin: true },
    { name: "Rania", title: "Nômade das Areias Douradas", gender: "f", head: 3, prop: "amphora", waterSkin: true },
    { name: "Qasim", title: "Sapateiro de Sandálias Leves", gender: "m", head: 6, prop: null, waterSkin: true },
    { name: "Maya", title: "Moça das Ânforas de Água Fresca", gender: "f", head: 3, prop: "amphora", waterSkin: false },
    { name: "Idris", title: "Viajante dos Oásis Perdidos", gender: "m", head: 2, prop: "staff", waterSkin: true },
    { name: "Dalal", title: "Tecelã de Turbantes e Xales", gender: "f", head: 5, prop: "fan", waterSkin: false },
    { name: "Samir", title: "Ferreiro das Lâminas de Bronze", gender: "m", head: 6, prop: null, waterSkin: true },
    { name: "Jamila", title: "Perfumista das Flores do Deserto", gender: "f", head: 3, prop: "basket", waterSkin: true }
  ],
  // Desenho no Canvas (antigo _renderDesertCitizen): (ctx, npc, timeOfDay, animTimer, player)
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
    const robeColor = pal.robe;
    const cloakColor = pal.cloak;
    const beltColor = pal.belt;
    const trimColor = pal.trim;
    const headwearColor = pal.headwear;
    const headwearTrim = pal.headwearTrim || trimColor;
    const sandalsColor = pal.sandals || "#5c2c16";

    // 1. Sombra padrão no solo de areia
    c.fillStyle = "rgba(15, 23, 42, 0.35)";
    c.beginPath();
    c.ellipse(0, 2.5, 7.8, 4.2, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Manto / Xale do Deserto nas costas (visível nas costas ou levemente de lado/frente)
    const capeSway = isMoving ? Math.cos(npc.walkPhase) * 1.8 : 0;
    if (w === "up") {
      // Vista Traseira: Manto desce pelas costas
      c.fillStyle = cloakColor;
      c.fillRect(-7, -16 - bob, 14, 13);
      c.fillStyle = trimColor;
      c.fillRect(-7, -4 - bob, 14, 1.5);
    } else if (!isSleeping) {
      if (w === "down") {
        c.fillStyle = cloakColor;
        c.fillRect(-7.2 + capeSway * 0.25, -15.5 - bob, 14.4, 13);
        c.fillStyle = trimColor;
        c.fillRect(-7.2 + capeSway * 0.25, -3.5 - bob, 14.4, 1.2);
      } else {
        // Lateral
        const capeX = w === "left" ? 0.5 : -4.5;
        c.fillStyle = cloakColor;
        c.fillRect(capeX + capeSway * 0.2, -15.5 - bob, 4.2, 13);
      }
    }

    // 3. Pernas e Sandálias Anatômicas com Balanço Pendular Normal (Pivô no quadril y = -3.5)
    const legMult = 2.8;
    const legSwingL = isMoving ? -walkSin * legMult : 0;
    const legSwingR = isMoving ? walkSin * legMult : 0;

    if (w === "up") {
      // VISTA TRASEIRA (COSTAS)
      // Perna Esquerda
      c.fillStyle = "#e2e8f0";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.22)";
      c.fillRect(-3.2, -3.5 + legSwingL, 0.9, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = trimColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#e2e8f0";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = "rgba(0, 0, 0, 0.22)";
      c.fillRect(3.4, -3.5 + legSwingR, 0.9, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = trimColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "down") {
      // VISTA FRONTAL
      // Perna Esquerda
      c.fillStyle = "#e2e8f0";
      c.fillRect(-5.2, -3.5 + legSwingL, 3.8, 4.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(-4.5, -1.2 + legSwingL, 2.4, 2.2);
      c.fillStyle = sandalsColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 3.8);
      c.fillStyle = trimColor;
      c.fillRect(-5.2, 0.5 + legSwingL, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-5.2, 3.7 + legSwingL, 3.8, 1.2);

      // Perna Direita
      c.fillStyle = "#e2e8f0";
      c.fillRect(1.4, -3.5 + legSwingR, 3.8, 4.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(2.1, -1.2 + legSwingR, 2.4, 2.2);
      c.fillStyle = sandalsColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 3.8);
      c.fillStyle = trimColor;
      c.fillRect(1.4, 0.5 + legSwingR, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(1.4, 3.7 + legSwingR, 3.8, 1.2);
    } else if (w === "left") {
      // VISTA LATERAL ESQUERDA: Pêndulo anatômico com pivô em y = -3.5
      const strideRange = 0.48;
      const frontAngle = -walkSin * strideRange;
      const backAngle = walkSin * strideRange;

      // Perna de trás (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = trimColor;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.0, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = trimColor;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-3.3, 6.8, 5.2, 1.2);
      c.restore();
    } else {
      // VISTA LATERAL DIREITA: Pêndulo anatômico com pivô em y = -3.5
      const strideRange = 0.48;
      const frontAngle = walkSin * strideRange;
      const backAngle = -walkSin * strideRange;

      // Perna de trás (esquerda, pivô em -1.6, -3.5)
      c.save();
      c.translate(-1.6, -3.5);
      c.rotate(backAngle);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.8, 0, 3.6, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(-1.8, 4.0, 3.6, 3.2);
      c.fillStyle = trimColor;
      c.fillRect(-1.8, 4.0, 3.6, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.8, 6.8, 4.8, 1.2);
      c.restore();

      // Perna da frente (direita, pivô em 1.6, -3.5)
      c.save();
      c.translate(1.6, -3.5);
      c.rotate(frontAngle);
      c.fillStyle = "#e2e8f0";
      c.fillRect(-1.9, 0, 3.8, 4.6);
      c.fillStyle = sandalsColor;
      c.fillRect(-1.9, 4.0, 3.8, 3.2);
      c.fillStyle = trimColor;
      c.fillRect(-1.9, 4.0, 3.8, 1.2);
      c.fillStyle = "#1c1917";
      c.fillRect(-1.9, 6.8, 5.2, 1.2);
      c.restore();
    }

    // 4. Túnica Longa de Deserto (Dishdasha / Caftã) com proporções normais
    const skirtSway = walkSin * 1.1;

    if (w === "left" || w === "right") {
      // Perfil lateral: túnica fluida estreita anatômica
      const isLeft = w === "left";
      const profX = isLeft ? -4.8 : -4.2;
      c.fillStyle = robeColor;
      c.beginPath();
      c.moveTo(profX, -16 - bob);
      c.lineTo(profX + 9.2, -16 - bob);
      c.lineTo(profX + 9.8 + (isLeft ? -skirtSway * 0.5 : skirtSway * 0.5), 2.0 - bob * 0.3);
      c.lineTo(profX - 0.4 + (isLeft ? -skirtSway * 0.5 : skirtSway * 0.5), 2.0 - bob * 0.3);
      c.closePath();
      c.fill();

      // Barra bordada
      c.fillStyle = trimColor;
      c.fillRect(profX - 0.4, 0.4 - bob * 0.3, 10.2, 1.8);
    } else {
      // Vista frontal / traseira: túnica fluida normal
      c.fillStyle = robeColor;
      // Tronco superior
      c.fillRect(-6.5, -16 - bob, 13, 10.5);

      // Saia da túnica fluida
      c.beginPath();
      c.moveTo(-6.5, -6 - bob);
      c.lineTo(6.5, -6 - bob);
      c.lineTo(8.2 + skirtSway, 2.0 - bob * 0.3);
      c.lineTo(-8.2 + skirtSway, 2.0 - bob * 0.3);
      c.closePath();
      c.fill();

      // Barra bordada decorativa na túnica
      c.fillStyle = trimColor;
      c.fillRect(-7.8 + skirtSway * 0.8, -0.2 - bob * 0.3, 15.6, 2.0);
      c.fillStyle = "rgba(0, 0, 0, 0.12)";
      c.fillRect(-7.5 + skirtSway * 0.8, 1.2 - bob * 0.3, 15.0, 0.8);
    }

    // 5. Cinto / Faixa de Cintura Normal
    c.fillStyle = beltColor;
    c.fillRect(-6.8, -7.2 - bob, 13.6, 2.6);
    if (w !== "up") {
      // Fivela dourada ou nó decorativo caído
      c.fillStyle = "#fbbf24";
      c.fillRect(-1.0, -7.0 - bob, 2.0, 2.2);
      c.fillStyle = beltColor;
      c.fillRect(1.5, -6.5 - bob, 2.0, 4.8);
      c.fillStyle = trimColor;
      c.fillRect(1.5, -2.5 - bob, 2.0, 1.0);
    }

    // 6. Detalhes do Peito / Gola da Túnica
    if (w !== "up") {
      const fOffX = w === "left" ? -1.5 : w === "right" ? 1.5 : 0;
      // Colarinho / decote em V tradicional
      c.fillStyle = trimColor;
      c.beginPath();
      c.moveTo(-3.5 + fOffX, -16 - bob);
      c.lineTo(3.5 + fOffX, -16 - bob);
      c.lineTo(0 + fOffX, -10 - bob);
      c.closePath();
      c.fill();
      c.fillStyle = npc.skinColor;
      c.beginPath();
      c.moveTo(-2.2 + fOffX, -16 - bob);
      c.lineTo(2.2 + fOffX, -16 - bob);
      c.lineTo(0 + fOffX, -11.5 - bob);
      c.closePath();
      c.fill();

      // Botões ou bordados centrais
      c.fillStyle = "#fbbf24";
      c.fillRect(-0.6 + fOffX, -10.0 - bob, 1.2, 1.2);
      c.fillRect(-0.6 + fOffX, -8.2 - bob, 1.2, 1.2);
    }

    // 7. Odre de Água a Tiracolo Normal
    if (npc.hasWaterSkin && !isSleeping && w !== "up") {
      c.fillStyle = "#451a03";
      c.beginPath();
      c.moveTo(-6.5, -15 - bob);
      c.lineTo(5.5, -6.0 - bob);
      c.lineTo(4.2, -5.0 - bob);
      c.lineTo(-7.5, -14 - bob);
      c.closePath();
      c.fill();
      c.fillStyle = "#78350f";
      c.beginPath();
      c.ellipse(6.2, -5.0 - bob, 3.0, 4.2, Math.PI / 6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#b45309";
      c.fillRect(5.5, -9.0 - bob, 1.8, 1.8);
    }

    // 8. Braços com Mangas e Punhos + Mãos com tom de pele (Proporções normais)
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
      c.fillStyle = robeColor;
      c.fillRect(-8.4, shoulderTopY, 2.6, 6.2 + swingL);
      c.fillStyle = trimColor;
      c.fillRect(-8.4, wristYL, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(-8.3, wristYL + 1.5, 2.4, 2.0);

      // Braço direito (topo fixo no ombro)
      const wristYR = shoulderTopY + 5.0 + swingR;
      c.fillStyle = robeColor;
      c.fillRect(5.8, shoulderTopY, 2.6, 6.2 + swingR);
      c.fillStyle = trimColor;
      c.fillRect(5.8, wristYR, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(5.9, wristYR + 1.5, 2.4, 2.0);
    } else {
      const isLeft = w === "left";
      const shoulderPivotX = isLeft ? -1.0 : 0.8;
      const armAngle = (isLeft ? 1 : -1) * walkSwing * 0.45;
      c.save();
      c.translate(shoulderPivotX, shoulderTopY);
      c.rotate(armAngle);
      c.fillStyle = robeColor;
      c.fillRect(-1.3, 0, 2.6, 6.2);
      c.fillStyle = trimColor;
      c.fillRect(-1.3, 4.8, 2.6, 1.6);
      c.fillStyle = npc.skinColor;
      c.fillRect(-1.2, 6.4, 2.4, 2.0);
      c.restore();
    }

    // 9. Acessórios na Mão
    if (npc.propInHand && !isSleeping && w !== "up") {
      const propX = w === "left" ? -7.8 : 7.6;
      const propY = -5.0 - bob;

      if (npc.propInHand === "amphora") {
        c.fillStyle = "#c2410c";
        c.beginPath();
        c.ellipse(propX, propY, 3.2, 4.4, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#9a3412";
        c.fillRect(propX - 1.5, propY - 6.0, 3.0, 2.0);
        c.strokeStyle = "#7c2d12";
        c.lineWidth = 1.0;
        c.beginPath();
        c.arc(propX + 2.2, propY - 2.0, 2.0, 0, Math.PI * 2);
        c.stroke();
      } else if (npc.propInHand === "basket") {
        c.fillStyle = "#b45309";
        c.beginPath();
        c.ellipse(propX, propY, 4.2, 3.0, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#451a03";
        c.fillRect(propX - 2.6, propY - 3.6, 1.8, 1.8);
        c.fillRect(propX, propY - 3.8, 2.0, 1.8);
      } else if (npc.propInHand === "staff") {
        c.fillStyle = "#78350f";
        c.fillRect(propX, propY - 16, 1.6, 24);
        c.fillStyle = "#d97706";
        c.fillRect(propX - 1.4, propY - 18, 3.8, 2.4);
      } else if (npc.propInHand === "fan") {
        c.fillStyle = "#ca8a04";
        c.beginPath();
        c.moveTo(propX, propY);
        c.arc(propX, propY, 5.0, -Math.PI * 0.8, -Math.PI * 0.2);
        c.closePath();
        c.fill();
      }
    }

    // 10. Cabeça, Pescoço Anatômico e Rosto 100% Descoberto e Visível (headY = -22 - bob, raio 6.1px)
    const headX = 0;
    const headY = -22 - bob;

    // Pescoço de ligação anatômica normal
    c.fillStyle = npc.skinColor;
    c.fillRect(-2.2, headY + 3.2, 4.4, 3.0);

    // Cabelo traseiro (somente nas vistas de costas ou laterais para não sangrar atrás dos olhos no perfil frontal)
    if (w === "up") {
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(headX, headY, 6.2, 0, Math.PI * 2);
      c.fill();
    } else if (w === "left") {
      // Lateral esquerda: nuca e cabelo atrás da cabeça
      c.fillStyle = npc.hairColor;
      c.fillRect(headX + 1.2, headY - 3.2, 4.6, 7.5);
    } else if (w === "right") {
      // Lateral direita: nuca e cabelo atrás da cabeça
      c.fillStyle = npc.hairColor;
      c.fillRect(headX - 5.8, headY - 3.2, 4.6, 7.5);
    }

    // Rosto com o tom de pele do morador (totalmente limpo e descoberto, sem cabelo escuro de fundo sob os olhos)
    c.fillStyle = npc.skinColor;
    c.beginPath();
    c.arc(headX, headY, 6.1, 0, Math.PI * 2);
    c.fill();

    // Topo do cabelo / franja natural (na coroa da cabeça e mechas laterais nas têmporas, acima dos olhos)
    c.fillStyle = npc.hairColor;
    c.beginPath();
    c.arc(headX, headY - 1.2, 6.2, Math.PI, 0);
    c.fill();

    if (w === "down") {
      // Mechas laterais nas têmporas e franja alta bem acima dos olhos (olhar 100% limpo)
      c.fillRect(headX - 6.2, headY - 4.0, 2.0, 5.0);
      c.fillRect(headX + 4.2, headY - 4.0, 2.0, 5.0);
      c.fillRect(headX - 2.8, headY - 4.8, 3.2, 1.8);
    } else if (w === "left") {
      c.fillRect(headX - 5.6, headY - 4.6, 2.8, 2.2);
    } else if (w === "right") {
      c.fillRect(headX + 2.8, headY - 4.6, 2.8, 2.2);
    }

    // 11. Coberturas de Cabeça Temáticas (sempre no topo da cabeça ou testa, NUNCA tampando o rosto)
    const hStyle = npc.headwearStyle;

    if (hStyle === 0) {
      // Turbante enrolado clássico no topo da cabeça (rosto 100% aberto)
      c.fillStyle = headwearColor;
      c.beginPath();
      c.ellipse(headX, headY - 2.6, 6.6, 4.6, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = headwearTrim;
      c.fillRect(headX - 6.2, headY - 2.2, 12.4, 1.4);
      c.fillStyle = "#fbbf24";
      c.fillRect(headX - 1.0, headY - 3.8, 2.0, 2.2);
      c.fillStyle = headwearColor;
      c.fillRect(headX + (w === "left" ? 3.0 : -4.5), headY - 1.0, 2.2, 5.5);
    } else if (hStyle === 1) {
      // Shemagh / Keffiyeh com agal preto na coroa da cabeça (rosto 100% aberto)
      c.fillStyle = headwearColor;
      c.beginPath();
      c.moveTo(headX - 6.4, headY - 4.5);
      c.lineTo(headX + 6.4, headY - 4.5);
      c.lineTo(headX + 7.0, headY + 2.0);
      c.lineTo(headX - 7.0, headY + 2.0);
      c.closePath();
      c.fill();
      c.fillStyle = "#18181b";
      c.fillRect(headX - 5.8, headY - 3.2, 11.6, 1.4);
      c.fillRect(headX - 5.4, headY - 1.6, 10.8, 1.2);
      c.fillStyle = headwearColor;
      c.fillRect(headX - 7.0, headY, 2.0, 6.5);
      c.fillRect(headX + 5.0, headY, 2.0, 6.5);
    } else if (hStyle === 2) {
      // Turbante de Caravaneiro com broche de bronze (rosto 100% aberto, sem máscara nem véu)
      c.fillStyle = headwearColor;
      c.beginPath();
      c.ellipse(headX, headY - 2.5, 6.5, 4.4, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = headwearTrim;
      c.fillRect(headX - 6.0, headY - 2.2, 12.0, 1.4);
      c.fillStyle = "#d97706";
      c.fillRect(headX - 1.2, headY - 3.6, 2.4, 2.2);
    } else if (hStyle === 3) {
      // Diadema solar dourada com xale nos ombros por trás (rosto 100% aberto)
      c.fillStyle = headwearColor;
      c.fillRect(headX - 6.0, headY - 2.4, 12.0, 1.4);
      c.fillStyle = headwearTrim;
      c.fillRect(headX - 1.0, headY - 2.8, 2.0, 2.0);
      c.fillStyle = headwearColor;
      c.fillRect(headX - 6.5, headY - 0.5, 1.8, 7.0);
      c.fillRect(headX + 4.7, headY - 0.5, 1.8, 7.0);
    } else if (hStyle === 4) {
      // Capuz aberto de viajante emoldurando o rosto (rosto 100% aberto)
      c.fillStyle = headwearColor;
      c.beginPath();
      c.arc(headX, headY - 1.0, 6.6, Math.PI * 0.9, Math.PI * 0.1);
      c.fill();
      c.fillStyle = headwearTrim;
      c.fillRect(headX - 5.6, headY - 2.4, 11.2, 1.4);
    } else if (hStyle === 5) {
      // Tiara de couro nobre com turquesa e tranças (rosto 100% aberto)
      c.fillStyle = "#78350f";
      c.fillRect(headX - 5.8, headY - 2.2, 11.6, 1.6);
      c.fillStyle = "#06b6d4";
      c.fillRect(headX - 3.0, headY - 2.0, 1.6, 1.2);
      c.fillRect(headX + 1.4, headY - 2.0, 1.6, 1.2);
      c.fillStyle = npc.hairColor;
      c.fillRect(headX - 6.2, headY, 1.8, 7.0);
      c.fillRect(headX + 4.4, headY, 1.8, 7.0);
      c.fillStyle = "#fbbf24";
      c.fillRect(headX - 6.2, headY + 6.0, 1.8, 1.2);
      c.fillRect(headX + 4.4, headY + 6.0, 1.8, 1.2);
    } else {
      // Bandana / faixa de linho do deserto na testa (rosto 100% aberto)
      c.fillStyle = headwearColor;
      c.fillRect(headX - 5.6, headY - 2.2, 11.2, 1.8);
      c.fillStyle = headwearTrim;
      c.fillRect(headX - 5.6, headY - 0.8, 11.2, 0.8);
    }

    // 12. Traços Faciais Nítidos e Expressivos (desenhados por cima, NUNCA cobertos)
    if (w !== "up") {
      if (isSleeping) {
        c.strokeStyle = "#171412";
        c.lineWidth = 1.0;
        c.beginPath();
        c.moveTo(headX - 3.2, headY + 0.4);
        c.lineTo(headX - 1.2, headY + 0.4);
        c.moveTo(headX + 1.2, headY + 0.4);
        c.lineTo(headX + 3.2, headY + 0.4);
        c.stroke();
      } else {
        const eyeOffset = w === "left" ? -1.2 : w === "right" ? 1.2 : 0;
        // Todos os habitantes do deserto possuem impressionantes olhos azuis (azul-celeste / especiaria do deserto)
        const eyeIrisColor = "#0284c7"; // Azul celeste vibrante
        const eyePupilColor = "#0369a1"; // Centro azul profundo
        const eyeHighlight = "#38bdf8"; // Brilho luminoso azul

        // Olho esquerdo (esclera branca, íris azul e brilho azul)
        c.fillStyle = "#ffffff";
        c.fillRect(headX - 3.2 + eyeOffset, headY - 0.2, 2.2, 1.8);
        c.fillStyle = eyeIrisColor;
        c.fillRect(headX - 2.6 + eyeOffset, headY + 0.1, 1.2, 1.2);
        c.fillStyle = eyePupilColor;
        c.fillRect(headX - 2.4 + eyeOffset, headY + 0.3, 0.8, 0.8);
        c.fillStyle = eyeHighlight;
        c.fillRect(headX - 2.6 + eyeOffset, headY + 0.1, 0.5, 0.5);

        // Olho direito (esclera branca, íris azul e brilho azul)
        c.fillStyle = "#ffffff";
        c.fillRect(headX + 1.0 + eyeOffset, headY - 0.2, 2.2, 1.8);
        c.fillStyle = eyeIrisColor;
        c.fillRect(headX + 1.4 + eyeOffset, headY + 0.1, 1.2, 1.2);
        c.fillStyle = eyePupilColor;
        c.fillRect(headX + 1.6 + eyeOffset, headY + 0.3, 0.8, 0.8);
        c.fillStyle = eyeHighlight;
        c.fillRect(headX + 1.4 + eyeOffset, headY + 0.1, 0.5, 0.5);

        // Sobrancelhas expressivas
        c.fillStyle = npc.hairColor;
        c.fillRect(headX - 3.4 + eyeOffset, headY - 1.2, 2.4, 0.7);
        c.fillRect(headX + 0.8 + eyeOffset, headY - 1.2, 2.4, 0.7);

        // Boca nítida e visível (sem nada tampando o rosto)
        c.fillStyle = "#78350f";
        c.fillRect(headX - 1.2 + eyeOffset * 0.5, headY + 2.4, 2.4, 0.8);

        // Leve rubor facial natural para vivacidade
        c.fillStyle = "rgba(225, 29, 72, 0.22)";
        c.fillRect(headX - 3.8 + eyeOffset, headY + 1.2, 1.8, 1.0);
        c.fillRect(headX + 2.0 + eyeOffset, headY + 1.2, 1.8, 1.0);

        // Barba aparada para alguns homens (sob o queixo, deixando a boca e rosto limpos)
        if (npc.gender === "m" && npc.headwearStyle % 2 === 1) {
          c.fillStyle = npc.hairColor;
          c.beginPath();
          c.arc(headX, headY + 4.2, 2.5, 0, Math.PI);
          c.fill();
        }
      }
    } else {
      // Vista traseira da cabeça (cabelo e nuca)
      c.fillStyle = npc.hairColor;
      c.beginPath();
      c.arc(headX, headY - 0.5, 6.2, 0, Math.PI * 2);
      c.fill();
    }

    // 12. Efeito zZz quando descansando na esteira à noite
    if (isSleeping) {
      const zFloat = (animTimer * 1.5 + npc.id) % 1;
      c.fillStyle = "#fde68a";
      c.font = "bold 9px sans-serif";
      c.textAlign = "center";
      c.fillText("z", 6, headY - 8 - zFloat * 12);
      c.font = "bold 11px sans-serif";
      c.fillText("Z", 12, headY - 14 - zFloat * 12);
    }

    // 13. Balão de fala idêntico aos soldados da neve (compacto, discreto e proporcional)
    if (npc.chatText && player && Math.hypot(player.x - npc.x, player.y - npc.y) < 250) {
      c.font = "bold 7.2px sans-serif";
      const text = npc.chatText;
      const tw = Math.min(210, Math.max(60, c.measureText(text).width + 12));
      const bx = -tw / 2;
      const by = headY - 25;

      // Caixa idêntica aos soldados da neve (fundo escuro militar, borda fina, 13px de altura)
      c.fillStyle = "rgba(9, 9, 11, 0.92)";
      c.strokeStyle = "#d97706";
      c.lineWidth = 1.2;
      c.beginPath();
      c.roundRect(bx, by, tw, 13, 4);
      c.fill();
      c.stroke();

      // Texto de fala limpo e centralizado (idêntico ao dos soldados da neve)
      c.fillStyle = "#f8fafc";
      c.textAlign = "center";
      c.fillText(text, 0, by + 9.2);
    }

    c.restore();
  },
};
