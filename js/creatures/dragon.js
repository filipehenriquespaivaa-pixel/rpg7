/* js/creatures/dragon.js
 * Criatura COMPLETA: Dragao Anciao (boss do bioma vulcanico). Tudo que define o dragao fica neste arquivo:
 * dados de nascimento, comportamento, carcaca, ficha e despojos ao destrinchar, deteccao por nome e todo o desenho
 * (corpo, carcaca no chao e icone).
 * Depende de registry.js (carregar depois dele). Ordem de carga: ..., scorpion.js, dragon.js (a ordem define a
 * prioridade de deteccao por nome: o dragao e o ultimo, como no codigo antigo).
 *
 * `behavior.fearsFire: false`: o dragao nao foge de fogueira nem de tocha (como antes de ser migrado).
 * `carcass.rarity` / `carcass.value`: opcionais no registro (padrao "raro" e 35); o dragao e lendario, valor 250.
 * A IA de combate (alcance, dano) continua em creatures-manager.js e a reacao ao clima em weather.js, que comparam
 * `type === "dragon"`.
 */
"use strict";
CREATURES.dragon = {
  id: "dragon",
  // Nascimento: bioma vulcanico (35% de chance, no lugar do golem)
  spawn: {
    name: "Dragão Ancião",
    color: "#dc2626",
    accentColor: "#fbbf24",
    hp: 60,
    attack: 9,
    speed: 0.85,
    scale: 1.3,
  },
  behavior: {
    prey: false,
    fearsFire: false,
    deathParticles: 12,
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Carcaça de Dragão Ancião",
    bodyName: "Corpo de Dragão",
    description:
      "Carcaça lendária de dragão. Pode ser destrinchada com uma faca para extrair escamas, chifres, dentes, asas, crânio, carne e ossos.",
    rarity: "lendario",
    value: 250,
  },
  // Ficha mostrada ao destrinchar
  sheet: {
    name: "Dragão Ancião",
    species: "Titã Draconiano",
    icon: "🐉",
    badgeColor: "text-rose-300 border-rose-500/40 bg-rose-950/60",
    description:
      "Titã alado mitológico forjado em chamas ancestrais. Rende múltiplos despojos lendários exclusivos de poder incomensurável.",
    exclusiveNote:
      "Múltiplos Exclusivos: Chifre, Dente, Escamas de Dragão, Asas e Crânio Draconiano!",
  },
  // Como reconhecer um item/carcaca desta criatura (t = nome, l = id, o = icone, tudo minusculo)
  detect: (t, l, o) =>
    t.includes("dragão") ||
    t.includes("dragao") ||
    t.includes("dragon") ||
    l.includes("dragon") ||
    l.includes("dragao") ||
    o === "creature_dragon",
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone (t = nome, l = id, o = icone, minusculo)
  detectIcon: (t, l, o) =>
    o === "creature_dragon" ||
    o === "dragon" ||
    t.includes("dragão") ||
    t.includes("dragao") ||
    l.includes("dragon"),
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatorio)
  loot: (t, l) => [
    {
      id: `butcher_dragon_bone_${t}_${l()}`,
      isExclusive: !1,
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_osso_dragao_${t}_${l()}`,
        name: "Ossos Ancestrais de Dragão",
        categoryType: "material",
        rarity: "epico",
        stackCount: 4,
        isEquippable: !1,
        icon: "bone",
        color: "#f59e0b",
        value: 120,
        description:
          "Ossos gigantescos imbuídos com essência fóssil do fogo primordial. Material nobre lendário para armamentos titânicos.",
      },
    },
    {
      id: `butcher_dragon_meat_${t}_${l()}`,
      isExclusive: !1,
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_carne_dragao_${t}_${l()}`,
        name: "Carne Dracônica Nobre",
        categoryType: "consumable",
        rarity: "epico",
        stackCount: 3,
        isEquippable: !1,
        icon: "utensils",
        color: "#dc2626",
        value: 150,
        description:
          "Carne lendária que irradia calor intrínseco. Restaura plenamente todo o fôlego (+120 Vida, +150 Stamina).",
      },
    },
    {
      id: `butcher_dragon_horn_${t}_${l()}`,
      isExclusive: !0,
      exclusiveLabel: "⭐ Exclusivo de Dragão",
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_chifre_dragao_${t}_${l()}`,
        name: "Chifre de Dragão Ancião",
        categoryType: "material",
        rarity: "lendario",
        stackCount: 2,
        isEquippable: !1,
        icon: "sparkles",
        color: "#ea580c",
        value: 250,
        description:
          "Chifre colossal espiralado esculpido pela fúria de vulcões. Canaliza chamas devastadoras e magia destrutiva.",
      },
    },
    {
      id: `butcher_dragon_tooth_${t}_${l()}`,
      isExclusive: !0,
      exclusiveLabel: "⭐ Exclusivo de Dragão",
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_dente_dragao_${t}_${l()}`,
        name: "Dente Incandescente de Dragão",
        categoryType: "material",
        rarity: "lendario",
        stackCount: 4,
        isEquippable: !1,
        icon: "sparkles",
        color: "#fbbf24",
        value: 220,
        description:
          "Presa afiada incandescente capaz de estilhaçar rochas e chapas de ferro com uma única mordida.",
      },
    },
    {
      id: `butcher_dragon_scales_${t}_${l()}`,
      isExclusive: !0,
      exclusiveLabel: "⭐ Exclusivo de Dragão",
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_escama_dragao_${t}_${l()}`,
        name: "Escama de Dragão Flamejante",
        categoryType: "material",
        rarity: "lendario",
        stackCount: 5,
        isEquippable: !1,
        icon: "shield",
        color: "#b91c1c",
        value: 300,
        description:
          "Placa córnea indestrutível imune ao calor extremo e lâminas comuns. A liga suprema para forjar a Couraça do Dragão.",
      },
    },
    {
      id: `butcher_dragon_wings_${t}_${l()}`,
      isExclusive: !0,
      exclusiveLabel: "⭐ Exclusivo de Dragão",
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_asa_dragao_${t}_${l()}`,
        name: "Asa Membranosa de Dragão",
        categoryType: "material",
        rarity: "lendario",
        stackCount: 2,
        isEquippable: !1,
        icon: "sparkles",
        color: "#991b1b",
        value: 280,
        description:
          "Membrana aerodinâmica gigantesca imbuída com correntes de ar ascendentes. Permite voos e mantos místicos.",
      },
    },
    {
      id: `butcher_dragon_skull_${t}_${l()}`,
      isExclusive: !0,
      exclusiveLabel: "⭐ Exclusivo de Dragão",
      status: "pending",
      item: {
        isCreaturePart: !0,
        id: `item_cranio_dragao_${t}_${l()}`,
        name: "Crânio de Dragão Colossal",
        categoryType: "material",
        rarity: "lendario",
        stackCount: 1,
        isEquippable: !1,
        icon: "skull",
        color: "#fbbf24",
        value: 500,
        description:
          "O crânio mítico completo da besta alada. Símbolo supremo de coragem, poder soberano e troféu lendário sem igual.",
      },
    },
  ],
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (antigo jg; aqui os parametros mantem os nomes originais: l = escala, o = flash de dano)
    body: function (e, t, l, o) {
      e.save();

      const facing = t.facing || "down";
      const isLeft = facing === "left";
      const isRight = facing === "right";
      const isUp = facing === "up";
      const isDown = facing === "down";

      // Orientação horizontal
      if (isLeft) {
        e.scale(-1, 1);
      }

      const anim = t.animTimer || 0;
      const speedSq = (t.vx || 0) * (t.vx || 0) + (t.vy || 0) * (t.vy || 0);
      const isMoving = (t.isMoving !== undefined) ? !!t.isMoving : (speedSq > 0.005);
      const isAttacking = (t.attackCooldown || 0) > 0.8;

      // Escala proporcional da criatura
      const s = l;

      // Paleta de Cores Míticas do Dragão Ancião (suporte completo ao hitFlash)
      const isHit = !!o;
      const colBase = isHit ? "#ffffff" : (t.color || "#dc2626"); // Escamas vermelhas carmesim vivas
      const colDark = isHit ? "#f1f5f9" : "#991b1b";             // Escamas sombreadas
      const colDeep = isHit ? "#e2e8f0" : "#450a0a";             // Sombreamento profundo / contornos
      const colBelly = isHit ? "#ffffff" : (t.accentColor || "#fbbf24"); // Placas ventrais douradas incandescentes
      const colOrange = isHit ? "#ffffff" : "#f97316";            // Magma alaranjado / fogo
      const colYellow = isHit ? "#ffffff" : "#fef08a";            // Brilho dourado luminoso
      const colHorn = isHit ? "#ffffff" : "#d97706";              // Chifres dourados / âmbar nobre
      const colHornDark = isHit ? "#ffffff" : "#78350f";          // Nervuras e sulcos do chifre
      const colWingMem = isHit ? "#ffffff" : "#7f1d1d";           // Membrana alar coriácea
      const colWingMemDark = isHit ? "#ffffff" : "#500724";       // Sombra da asa traseira
      const colClaw = isHit ? "#ffffff" : "#1c1917";              // Garras afiadas de obsidiana

      // Ciclo de voo / batimento de asas e flutuação
      const flapFreq = isMoving ? 5.5 : 3.8;
      const wingFlap = Math.sin(anim * flapFreq);
      const hoverY = Math.sin(anim * 3.2) * (2.8 * s);
      const bodyTilt = isMoving ? (Math.sin(anim * flapFreq) * 0.06) : (Math.sin(anim * 2.2) * 0.03);

      // 1. Sombra projetada no solo e aura de calor vulcânico
      if (!isHit) {
        // Aura de brasas e calor no chão
        const groundHeat = e.createRadialGradient(0, 16 * s, 3 * s, 0, 16 * s, 26 * s);
        groundHeat.addColorStop(0, "rgba(249, 115, 22, 0.28)");
        groundHeat.addColorStop(0.6, "rgba(220, 38, 38, 0.1)");
        groundHeat.addColorStop(1, "rgba(0, 0, 0, 0)");
        e.fillStyle = groundHeat;
        e.beginPath();
        e.ellipse(0, 16 * s, 26 * s, 10 * s, 0, 0, Math.PI * 2);
        e.fill();

        // Sombra corporal dinâmica que reage ao bater das asas
        const shadowScale = 1 - (wingFlap * 0.12);
        e.fillStyle = "rgba(15, 23, 42, 0.42)";
        e.beginPath();
        e.ellipse(0, 16 * s, 18 * s * shadowScale, 6.5 * s * shadowScale, 0, 0, Math.PI * 2);
        e.fill();
      }

      // 2. Cauda Serpentina Longa com Espigões Dorsais e Lâmina Terminal
      e.save();
      {
        const tailBaseX = -10 * s;
        const tailBaseY = hoverY - 1 * s;
        const tWave1 = Math.sin(anim * 3.5) * 4 * s;
        const tWave2 = Math.sin(anim * 3.5 + 1.2) * 7 * s;
        const tWave3 = Math.sin(anim * 3.5 + 2.4) * 9 * s;

        // Corpo carnoso da cauda sinuosa
        e.fillStyle = colDark;
        e.beginPath();
        e.moveTo(tailBaseX, tailBaseY - 5 * s);
        e.quadraticCurveTo(tailBaseX - 12 * s, tailBaseY - 4 * s + tWave1, tailBaseX - 22 * s, tailBaseY + tWave2);
        e.quadraticCurveTo(tailBaseX - 30 * s, tailBaseY + 2 * s + tWave3, tailBaseX - 36 * s, tailBaseY + tWave3);
        e.lineTo(tailBaseX - 35 * s, tailBaseY + 3 * s + tWave3);
        e.quadraticCurveTo(tailBaseX - 22 * s, tailBaseY + 5 * s + tWave2, tailBaseX - 12 * s, tailBaseY + 4 * s + tWave1);
        e.lineTo(tailBaseX, tailBaseY + 4 * s);
        e.closePath();
        e.fill();
        e.strokeStyle = colDeep;
        e.lineWidth = 1 * s;
        e.stroke();

        // Espinhos dorsais na cauda
        e.fillStyle = colHorn;
        for (let i = 1; i <= 4; i++) {
          const prog = i / 4.5;
          const spkX = tailBaseX - (i * 7.5 * s);
          const spkY = tailBaseY - (2.5 * s) + (Math.sin(anim * 3.5 + i * 0.6) * (5 * s) * prog);
          e.beginPath();
          e.moveTo(spkX + 1.5 * s, spkY);
          e.lineTo(spkX, spkY - (5 - i * 0.8) * s);
          e.lineTo(spkX - 1.5 * s, spkY);
          e.closePath();
          e.fill();
        }

        // Ponta da Cauda: Lâmina de Fogo / Arpão em Espada
        const tipX = tailBaseX - 36 * s;
        const tipY = tailBaseY + tWave3;
        e.fillStyle = colBelly;
        e.strokeStyle = colOrange;
        e.lineWidth = 1.2 * s;
        e.beginPath();
        e.moveTo(tipX, tipY);
        e.lineTo(tipX - 7 * s, tipY - 4.5 * s);
        e.lineTo(tipX - 5 * s, tipY);
        e.lineTo(tipX - 10 * s, tipY + 0.5 * s);
        e.lineTo(tipX - 5 * s, tipY + 1 * s);
        e.lineTo(tipX - 7 * s, tipY + 5.5 * s);
        e.closePath();
        e.fill();
        e.stroke();
      }
      e.restore();

      // 3. Asa Traseira (Far Wing) - Batendo em perspectiva atrás do corpo com curvatura para trás
      e.save();
      {
        const wingRootX = -1 * s;
        const wingRootY = hoverY - 7 * s;
        const farFlap = Math.sin(anim * flapFreq + 0.35);
        const farFlapAngle = farFlap * 0.35;

        e.translate(wingRootX, wingRootY);
        e.rotate(farFlapAngle);

        // Pulso alar traseiro (borda frontal superior da asa)
        const fWristX = 5 * s;
        const fWristY = -19 * s;

        // Falanges traseiras curvando para trás
        const fTip1X = -5 * s;
        const fTip1Y = -31 * s;
        const fTip2X = -16 * s;
        const fTip2Y = -25 * s;
        const fTip3X = -22 * s;
        const fTip3Y = -14 * s;

        // Membrana escura em perspectiva
        e.fillStyle = colWingMemDark;
        e.beginPath();
        e.moveTo(0, 0);
        e.lineTo(fWristX, fWristY);
        e.lineTo(fTip1X, fTip1Y);
        e.quadraticCurveTo(-11 * s, -29 * s, fTip2X, fTip2Y);
        e.quadraticCurveTo(-20 * s, -20 * s, fTip3X, fTip3Y);
        e.quadraticCurveTo(-12 * s, -7 * s, -2 * s, 0);
        e.closePath();
        e.fill();

        // Ossos da asa traseira
        e.strokeStyle = colDark;
        e.lineWidth = 2 * s;
        e.beginPath();
        e.moveTo(0, 0);
        e.lineTo(fWristX, fWristY);
        e.lineTo(fTip1X, fTip1Y);
        e.moveTo(fWristX, fWristY);
        e.lineTo(fTip2X, fTip2Y);
        e.moveTo(fWristX, fWristY);
        e.lineTo(fTip3X, fTip3Y);
        e.stroke();
      }
      e.restore();

      // 4. Pernas Traseiras e Garras Posteriores (Far Legs)
      e.save();
      {
        // Perna traseira posterior
        e.fillStyle = colDeep;
        e.beginPath();
        e.moveTo(-7 * s, hoverY + 3 * s);
        e.lineTo(-10 * s, hoverY + 12 * s);
        e.lineTo(-6 * s, hoverY + 13.5 * s);
        e.lineTo(-4 * s, hoverY + 3 * s);
        e.closePath();
        e.fill();
        // Garras da pata traseira posterior
        e.fillStyle = colClaw;
        e.fillRect(-11 * s, hoverY + 12.5 * s, 6 * s, 1.8 * s);

        // Perna dianteira posterior
        e.fillStyle = colDeep;
        e.beginPath();
        e.moveTo(7 * s, hoverY + 4 * s);
        e.lineTo(8 * s, hoverY + 12.5 * s);
        e.lineTo(11 * s, hoverY + 12.5 * s);
        e.lineTo(10 * s, hoverY + 4 * s);
        e.closePath();
        e.fill();
        e.fillStyle = colClaw;
        e.fillRect(7.5 * s, hoverY + 12 * s, 5 * s, 1.6 * s);
      }
      e.restore();

      // 5. Tronco Musculoso e Placas Ventrais Incandescentes (Torso & Belly Scutes)
      e.save();
      e.translate(0, hoverY);
      if (bodyTilt !== 0) e.rotate(bodyTilt);
      {
        // Silhueta do torso forte
        e.fillStyle = colBase;
        e.beginPath();
        e.moveTo(-13 * s, -4 * s);
        e.quadraticCurveTo(-4 * s, -9 * s, 10 * s, -7 * s);  // Costas arqueadas
        e.lineTo(14 * s, 1 * s);                             // Base do pescoço
        e.quadraticCurveTo(11 * s, 8 * s, 2 * s, 7 * s);     // Peitoral forte
        e.quadraticCurveTo(-7 * s, 7 * s, -13 * s, 2 * s);   // Abdômen
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1.3 * s;
        e.stroke();

        // Placas ventrais incandescentes (Belly Plates)
        e.fillStyle = colBelly;
        e.beginPath();
        e.moveTo(-6 * s, 2 * s);
        e.quadraticCurveTo(2 * s, 1 * s, 11 * s, -2 * s);
        e.lineTo(12.5 * s, 3.5 * s);
        e.quadraticCurveTo(5 * s, 6.5 * s, -4 * s, 5.5 * s);
        e.closePath();
        e.fill();

        // Nervuras de magma entre as placas ventrais
        e.strokeStyle = colOrange;
        e.lineWidth = 1.2 * s;
        for (let bx = -3; bx <= 9; bx += 3.2) {
          e.beginPath();
          e.moveTo(bx * s, 1.5 * s);
          e.lineTo((bx + 1.2) * s, 6 * s);
          e.stroke();
        }

        // Cristas espinhosas dorsais ao longo do dorso
        e.fillStyle = colHorn;
        e.strokeStyle = colHornDark;
        e.lineWidth = 0.8 * s;
        for (let sx = -11; sx <= 8; sx += 3.8) {
          const spkHeight = (sx > -2 && sx < 6) ? 5.5 : 4;
          e.beginPath();
          e.moveTo((sx - 1.4) * s, -7.5 * s);
          e.lineTo(sx * s, -(7.5 + spkHeight) * s);
          e.lineTo((sx + 1.4) * s, -7.5 * s);
          e.closePath();
          e.fill();
          e.stroke();
        }
      }
      e.restore();

      // 6. Pernas Dianteiras e Traseiras Próximas (Near Legs) com Articulação e Garras
      e.save();
      {
        const legBob = isMoving ? Math.sin(anim * flapFreq) * 1.5 * s : 0;

        // Perna Traseira Próxima (Coxa musculosa de réptil + Jarrete)
        e.fillStyle = colBase;
        e.beginPath();
        e.moveTo(-2 * s, hoverY);
        e.quadraticCurveTo(-8 * s, hoverY + 4 * s, -6 * s, hoverY + 9 * s);
        e.lineTo(-4 * s, hoverY + 14 * s + legBob);
        e.lineTo(-1 * s, hoverY + 14 * s + legBob);
        e.lineTo(1 * s, hoverY + 7 * s);
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1 * s;
        e.stroke();

        // Pata e Garras Traseiras Afiadas
        e.fillStyle = colClaw;
        e.beginPath();
        e.moveTo(-5.5 * s, hoverY + 13.5 * s + legBob);
        e.lineTo(-7 * s, hoverY + 16 * s + legBob);
        e.lineTo(-3.5 * s, hoverY + 15 * s + legBob);
        e.lineTo(-2 * s, hoverY + 16.5 * s + legBob);
        e.lineTo(-0.5 * s, hoverY + 14 * s + legBob);
        e.closePath();
        e.fill();

        // Perna Dianteira Próxima
        e.fillStyle = colBase;
        e.beginPath();
        e.moveTo(5 * s, hoverY + 1 * s);
        e.lineTo(4 * s, hoverY + 8 * s);
        e.lineTo(7 * s, hoverY + 14 * s - legBob);
        e.lineTo(9.5 * s, hoverY + 14 * s - legBob);
        e.lineTo(9 * s, hoverY + 4 * s);
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1 * s;
        e.stroke();

        // Garras Dianteiras
        e.fillStyle = colClaw;
        e.beginPath();
        e.moveTo(5.5 * s, hoverY + 13.5 * s - legBob);
        e.lineTo(5 * s, hoverY + 16.5 * s - legBob);
        e.lineTo(8 * s, hoverY + 15 * s - legBob);
        e.lineTo(10.5 * s, hoverY + 16.5 * s - legBob);
        e.lineTo(10 * s, hoverY + 13.5 * s - legBob);
        e.closePath();
        e.fill();
      }
      e.restore();

      // 7. Pescoço e Cabeça Régia Dracônica
      e.save();
      {
        const neckBaseX = 9 * s;
        const neckBaseY = hoverY - 4 * s;
        const headX = 22 * s;
        const headY = hoverY - 14 * s + (Math.sin(anim * 2.8) * 1.2 * s);

        // Garganta com Brilho de Fogo Interno (Glowing Gullet)
        if (!isHit) {
          const throatGlow = e.createRadialGradient(neckBaseX + 6 * s, neckBaseY - 4 * s, 1 * s, neckBaseX + 6 * s, neckBaseY - 4 * s, 8 * s);
          throatGlow.addColorStop(0, "rgba(254, 240, 138, 0.75)");
          throatGlow.addColorStop(0.4, "rgba(249, 115, 22, 0.45)");
          throatGlow.addColorStop(1, "rgba(220, 38, 38, 0)");
          e.fillStyle = throatGlow;
          e.beginPath();
          e.arc(neckBaseX + 6 * s, neckBaseY - 4 * s, 8 * s, 0, Math.PI * 2);
          e.fill();
        }

        // Pescoço Sinuoso Musculoso
        e.fillStyle = colBase;
        e.beginPath();
        e.moveTo(neckBaseX, neckBaseY - 3 * s);
        e.quadraticCurveTo(neckBaseX + 4 * s, neckBaseY - 11 * s, headX - 2 * s, headY - 1 * s);
        e.lineTo(headX, headY + 5 * s);
        e.quadraticCurveTo(neckBaseX + 8 * s, neckBaseY + 3 * s, neckBaseX + 3 * s, neckBaseY + 5 * s);
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1.3 * s;
        e.stroke();

        // Placas douradas na parte inferior do pescoço
        e.fillStyle = colBelly;
        e.beginPath();
        e.moveTo(neckBaseX + 4 * s, neckBaseY + 3 * s);
        e.quadraticCurveTo(neckBaseX + 9 * s, neckBaseY - 1 * s, headX - 1 * s, headY + 4 * s);
        e.lineTo(headX - 3 * s, headY + 5.5 * s);
        e.quadraticCurveTo(neckBaseX + 6 * s, neckBaseY + 4 * s, neckBaseX + 2 * s, neckBaseY + 4.5 * s);
        e.closePath();
        e.fill();

        // Espinhos na nuca
        e.fillStyle = colHorn;
        for (let ni = 0; ni < 3; ni++) {
          const nx = neckBaseX + (ni * 4 * s) + 2 * s;
          const ny = neckBaseY - (ni * 3.5 * s) - 5 * s;
          e.beginPath();
          e.moveTo(nx - 1 * s, ny + 1 * s);
          e.lineTo(nx - 3.5 * s, ny - 4.5 * s);
          e.lineTo(nx + 1 * s, ny);
          e.closePath();
          e.fill();
        }

        // Crânio do Dragão
        e.fillStyle = colBase;
        e.beginPath();
        e.moveTo(headX - 4 * s, headY - 4 * s);
        e.lineTo(headX + 4 * s, headY - 6 * s);   // Topo da cabeça
        e.lineTo(headX + 11 * s, headY - 2 * s);  // Focinho superior
        e.lineTo(headX + 12 * s, headY + 1 * s);  // Narina
        e.lineTo(headX + 6 * s, headY + 2 * s);   // Mandíbula
        e.lineTo(headX + 10 * s, headY + 5 * s);  // Queixo inferior
        e.lineTo(headX + 1 * s, headY + 5 * s);   // Garganta
        e.lineTo(headX - 4 * s, headY);
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1.3 * s;
        e.stroke();

        // Dentes / Presas de Marfim
        e.fillStyle = "#ffffff";
        e.beginPath();
        e.moveTo(headX + 7 * s, headY + 2 * s);
        e.lineTo(headX + 8 * s, headY + 4.2 * s);
        e.lineTo(headX + 9 * s, headY + 2 * s);
        e.lineTo(headX + 10 * s, headY + 3.8 * s);
        e.lineTo(headX + 11 * s, headY + 1.8 * s);
        e.closePath();
        e.fill();

        // Chifres Ancestrais Magníficos (Par Superior Imponente + Esporão Inferior)
        // Chifre Principal Curvado
        e.fillStyle = colHorn;
        e.strokeStyle = colHornDark;
        e.lineWidth = 1 * s;
        e.beginPath();
        e.moveTo(headX - 1 * s, headY - 5 * s);
        e.quadraticCurveTo(headX - 8 * s, headY - 14 * s, headX - 16 * s, headY - 15 * s);
        e.quadraticCurveTo(headX - 7 * s, headY - 11 * s, headX - 3 * s, headY - 3 * s);
        e.closePath();
        e.fill();
        e.stroke();

        // Anéis de crescimento e ranhuras no chifre
        if (!isHit) {
          e.strokeStyle = colYellow;
          e.lineWidth = 0.8 * s;
          e.beginPath();
          e.moveTo(headX - 5 * s, headY - 8 * s);
          e.lineTo(headX - 7 * s, headY - 6 * s);
          e.moveTo(headX - 9 * s, headY - 12 * s);
          e.lineTo(headX - 11 * s, headY - 10 * s);
          e.stroke();
        }

        // Chifre Secundário da Bochecha / Tempora
        e.fillStyle = colHornDark;
        e.beginPath();
        e.moveTo(headX - 2 * s, headY - 1 * s);
        e.lineTo(headX - 9 * s, headY - 5 * s);
        e.lineTo(headX - 3 * s, headY + 1 * s);
        e.closePath();
        e.fill();

        // Olho de Réptil Dourado Incandescente com Pupila em Fenda
        e.fillStyle = colYellow;
        e.beginPath();
        e.ellipse(headX + 3 * s, headY - 1.8 * s, 2.2 * s, 1.6 * s, -0.15, 0, Math.PI * 2);
        e.fill();
        // Pupila vertical felina/réptil
        e.fillStyle = "#0f172a";
        e.beginPath();
        e.ellipse(headX + 3.2 * s, headY - 1.8 * s, 0.7 * s, 1.5 * s, 0, 0, Math.PI * 2);
        e.fill();
        // Brilho especular branco no olho
        e.fillStyle = "#ffffff";
        e.beginPath();
        e.arc(headX + 2.4 * s, headY - 2.4 * s, 0.6 * s, 0, Math.PI * 2);
        e.fill();

        // Narina com fumaça e faísca
        e.fillStyle = colDeep;
        e.beginPath();
        e.ellipse(headX + 10.5 * s, headY - 0.5 * s, 0.9 * s, 0.6 * s, 0.2, 0, Math.PI * 2);
        e.fill();

        // 8. Bafo de Fogo / Labaredas e Brasas
        if (isAttacking) {
          // Labareda estrondosa de fogo em jato cônico
          const flameProg = ((t.animTimer * 12) % 3) / 3;
          const breathReach = 28 * s + (flameProg * 14 * s);

          // Cone externo de magma
          const flameGrad = e.createRadialGradient(headX + 10 * s, headY + 2 * s, 2 * s, headX + 18 * s + breathReach * 0.5, headY + 3 * s, breathReach);
          flameGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          flameGrad.addColorStop(0.2, "rgba(254, 240, 138, 0.9)");
          flameGrad.addColorStop(0.55, "rgba(249, 115, 22, 0.75)");
          flameGrad.addColorStop(0.85, "rgba(220, 38, 38, 0.5)");
          flameGrad.addColorStop(1, "rgba(127, 29, 29, 0)");

          e.fillStyle = flameGrad;
          e.beginPath();
          e.moveTo(headX + 11 * s, headY);
          e.lineTo(headX + 12 * s + breathReach, headY - 10 * s);
          e.lineTo(headX + 16 * s + breathReach * 1.1, headY + 4 * s);
          e.lineTo(headX + 12 * s + breathReach, headY + 16 * s);
          e.lineTo(headX + 11 * s, headY + 4 * s);
          e.closePath();
          e.fill();

          // Núcleo branco incandescente
          e.fillStyle = "#ffffff";
          e.beginPath();
          e.arc(headX + 13 * s, headY + 2 * s, 3.5 * s, 0, Math.PI * 2);
          e.fill();
        } else if (!isHit) {
          // Fagulhas e brasas saindo da respiração em repouso
          for (let fi = 0; fi < 3; fi++) {
            const spkProg = (anim * 2.5 + fi * 0.33) % 1;
            const spkX = headX + 12 * s + (spkProg * 14 * s);
            const spkY = headY - 1 * s - (spkProg * 7 * s) + Math.sin(anim * 6 + fi) * (2 * s);
            e.fillStyle = fi % 2 === 0 ? colYellow : colOrange;
            e.globalAlpha = (1 - spkProg) * 0.85;
            e.beginPath();
            e.arc(spkX, spkY, (1 - spkProg * 0.5) * 1.3 * s, 0, Math.PI * 2);
            e.fill();
            e.globalAlpha = 1;
          }
        }
      }
      e.restore();

      // 9. Asa Frontal Próxima Majestosa (Near Forewing) com Curvatura Natural para Trás
      e.save();
      {
        const wingRootX = 1 * s;
        const wingRootY = hoverY - 7 * s;
        const flapAngle = wingFlap * 0.42;

        e.translate(wingRootX, wingRootY);
        e.rotate(flapAngle);

        // Pulso / Carpo da asa na borda frontal superior (borda de ataque da asa)
        const wristX = 7 * s;
        const wristY = -23 * s;

        // Dedos longos da asa curvando graciosamente PARA TRÁS sobre o dorso
        const tip1X = -6 * s;   // Dedo 1 (topo, arqueado para trás)
        const tip1Y = -37 * s;
        const tip2X = -20 * s;  // Dedo 2 (central, varrendo para trás)
        const tip2Y = -30 * s;
        const tip3X = -28 * s;  // Dedo 3 (inferior, estendendo-se em direção aos flancos)
        const tip3Y = -18 * s;

        // Membrana Alar com Gradiente de Couro de Dragão
        const wingGrad = e.createLinearGradient(0, 0, -18 * s, -35 * s);
        wingGrad.addColorStop(0, colBase);
        wingGrad.addColorStop(0.45, colWingMem);
        wingGrad.addColorStop(0.85, colOrange);
        wingGrad.addColorStop(1, colYellow);

        e.fillStyle = isHit ? "#ffffff" : wingGrad;
        e.beginPath();
        e.moveTo(0, 0);
        e.lineTo(wristX, wristY); // Braço frontal (borda de ataque)
        e.lineTo(tip1X, tip1Y);   // Borda do dedo 1
        // Curvaturas recortadas clássicas entre os dedos (scalloped edges)
        e.quadraticCurveTo(-14 * s, -34 * s, tip2X, tip2Y);
        e.quadraticCurveTo(-25 * s, -25 * s, tip3X, tip3Y);
        e.quadraticCurveTo(-16 * s, -9 * s, -2 * s, 2 * s);
        e.closePath();
        e.fill();
        e.strokeStyle = colDark;
        e.lineWidth = 1.3 * s;
        e.stroke();

        // Veias translúcidas de fogo na membrana
        if (!isHit) {
          e.strokeStyle = "rgba(254, 240, 138, 0.4)";
          e.lineWidth = 0.9 * s;
          e.beginPath();
          e.moveTo(wristX - 2 * s, wristY + 2 * s);
          e.quadraticCurveTo(-4 * s, -26 * s, -11 * s, -33 * s);
          e.moveTo(wristX - 2 * s, wristY + 4 * s);
          e.quadraticCurveTo(-10 * s, -20 * s, -21 * s, -26 * s);
          e.stroke();
        }

        // Ossos e Falanges Fortes da Asa
        e.strokeStyle = colBase;
        e.lineWidth = 2.6 * s;
        e.lineCap = "round";
        e.beginPath();
        e.moveTo(0, 0);
        e.lineTo(wristX, wristY); // Braço da asa
        e.lineTo(tip1X, tip1Y);   // Falange 1
        e.moveTo(wristX, wristY);
        e.lineTo(tip2X, tip2Y);   // Falange 2
        e.moveTo(wristX, wristY);
        e.lineTo(tip3X, tip3Y);   // Falange 3
        e.stroke();

        // Espigão / Garra Afiada do Polegar no Pulso da Asa (apontando para cima/frente)
        e.fillStyle = colHorn;
        e.strokeStyle = colHornDark;
        e.lineWidth = 0.8 * s;
        e.beginPath();
        e.moveTo(wristX - 1 * s, wristY + 1 * s);
        e.lineTo(wristX + 3.5 * s, wristY - 3.5 * s);
        e.lineTo(wristX + 0.5 * s, wristY - 1 * s);
        e.closePath();
        e.fill();
        e.stroke();
      }
      e.restore();

      // 10. Brasas Vulcânicas Flutuando ao Redor do Dragão
      if (!isHit) {
        for (let bi = 0; bi < 4; bi++) {
          const floatProg = (anim * 1.8 + bi * 0.25) % 1;
          const bX = Math.sin(anim * 4 + bi * 2.5) * (14 * s) + (bi % 2 === 0 ? -12 * s : 8 * s);
          const bY = hoverY - (floatProg * 28 * s) + 4 * s;
          const bAlpha = Math.sin(floatProg * Math.PI) * 0.8;
          e.fillStyle = bi % 2 === 0 ? colYellow : colOrange;
          e.globalAlpha = bAlpha;
          e.beginPath();
          e.arc(bX, bY, (1 - floatProg * 0.5) * 1.4 * s, 0, Math.PI * 2);
          e.fill();
          e.globalAlpha = 1;
        }
      }

      e.restore();
    },
    // Carcaca no chao (antigo ramo dragon de Ag)
    carcass: function (e, t, o, u) {
      const m = t.color || "#dc2626";
      ((e.fillStyle = m),
        e.beginPath(),
        e.ellipse(0, 2 * o, 16 * o, 8 * o, 0, 0, Math.PI * 2),
        e.fill(),
        e.beginPath(),
        e.ellipse(13 * o, -1 * o, 8 * o, 5.5 * o, 0.1, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#ea580c"),
        (e.lineWidth = 2.4 * o),
        e.beginPath(),
        e.moveTo(11 * o, -3 * o),
        e.quadraticCurveTo(8 * o, -11 * o, 3 * o, -13 * o),
        e.stroke(),
        (e.fillStyle = "#991b1b"),
        e.beginPath(),
        e.moveTo(-4 * o, 0),
        e.lineTo(-12 * o, -10 * o),
        e.lineTo(-7 * o, -4 * o),
        e.lineTo(-2 * o, 3 * o),
        e.closePath(),
        e.fill(),
        (e.fillStyle = "#7f1d1d"));
      for (let c = -10; c <= 6; c += 4)
        (e.beginPath(),
          e.moveTo((c - 1.5) * o, -4 * o),
          e.lineTo(c * o, -7.5 * o),
          e.lineTo((c + 1.5) * o, -4 * o),
          e.closePath(),
          e.fill());
      ((e.strokeStyle = "#fbbf24"),
        (e.lineWidth = 1.6 * o),
        e.beginPath(),
        e.moveTo(13 * o, -3 * o),
        e.lineTo(16 * o, 0),
        e.moveTo(16 * o, -3 * o),
        e.lineTo(13 * o, 0),
        e.stroke());
    },
    // Icone desenhado no canvas / inventario (antigo Ob)
    icon: function (e, t, l) {
      const o = l.color || "#dc2626";
      // Sombra suave da base
      e.fillStyle = "rgba(15, 23, 42, 0.45)";
      e.beginPath();
      e.ellipse(0, 4.5 * t, 8 * t, 2.5 * t, 0, 0, Math.PI * 2);
      e.fill();

      // Cauda
      e.strokeStyle = "#991b1b";
      e.lineWidth = 2 * t;
      e.beginPath();
      e.moveTo(-5 * t, 2 * t);
      e.quadraticCurveTo(-9 * t, 3 * t, -10 * t, 0);
      e.stroke();

      // Corpo carmesim
      e.fillStyle = o;
      e.beginPath();
      e.ellipse(0, 1 * t, 10 * t, 5.5 * t, 0, 0, Math.PI * 2);
      e.fill();

      // Placas ventrais douradas
      e.fillStyle = "#fbbf24";
      e.beginPath();
      e.ellipse(2 * t, 2.5 * t, 5.5 * t, 2.5 * t, 0, 0, Math.PI * 2);
      e.fill();

      // Asa recortada com nervuras
      e.fillStyle = "#7f1d1d";
      e.beginPath();
      e.moveTo(-2 * t, 0);
      e.lineTo(-8 * t, -9 * t);
      e.lineTo(-4 * t, -4 * t);
      e.lineTo(-1 * t, -7 * t);
      e.lineTo(1 * t, 2 * t);
      e.closePath();
      e.fill();
      e.strokeStyle = "#f97316";
      e.lineWidth = 1 * t;
      e.stroke();

      // Espinhos dorsais
      e.fillStyle = "#d97706";
      for (let i = -6; i <= 2; i += 3) {
        e.beginPath();
        e.moveTo((i - 1) * t, -4 * t);
        e.lineTo(i * t, -7 * t);
        e.lineTo((i + 1) * t, -4 * t);
        e.closePath();
        e.fill();
      }

      // Cabeça do dragão
      e.fillStyle = o;
      e.beginPath();
      e.moveTo(5 * t, -1 * t);
      e.lineTo(12 * t, -3 * t);
      e.lineTo(11 * t, 2 * t);
      e.lineTo(6 * t, 3 * t);
      e.closePath();
      e.fill();

      // Chifre curvado
      e.strokeStyle = "#d97706";
      e.lineWidth = 1.8 * t;
      e.beginPath();
      e.moveTo(8 * t, -3 * t);
      e.quadraticCurveTo(4 * t, -10 * t, 0, -10 * t);
      e.stroke();

      // Olho brilhante
      e.fillStyle = "#fef08a";
      e.beginPath();
      e.arc(9 * t, -1.5 * t, 1.2 * t, 0, Math.PI * 2);
      e.fill();
    },
  },
};
