/* js/creatures/tardigrade.js
 * Criatura COMPLETA: Tardígrado Cavernoso (Urso-d'Água das Profundezas).
 * Inspirado no tardígrado: corpo rechonchudo segmentado, 8 patas com micro-garras,
 * disco bucal com estilete mineral, extrema resistência e estado de criptobiose.
 * Vive especificamente nas cavernas estreitas do deserto.
 * Depende de registry.js (carregar depois dele).
 */
"use strict";

CREATURES.tardigrade = {
  id: "tardigrade",
  // Nascimento no mundo (valores do spawn)
  spawn: {
    name: "Tardígrado Cavernoso",
    color: "#d97706",
    accentColor: "#fef08a",
    hp: 42,
    attack: 5,
    speed: 0.82,
    scale: 0.95,
    defense: 6,
  },
  // Comportamento: predador voraz das cavernas! Devora escorpiões, aranhas e o próprio jogador!
  behavior: {
    neutral: false, // Caça ativamente invasores/jogador, escorpiões e aranhas!
    prey: false,
    predator: true, // Predador voraz da caverna
    threatName: "tardígrado",
    fearsFire: false, // Tardígrados resistem a extremos de calor, frio e dessecação!
    deathParticles: 14,
    attackCooldown: 1.25,
    hunter: {
      huntRadius: 290,
      meleeRange: 32,
      huntSpeedMult: 1.45,
      attackCooldownPrey: 1.1,
      wanderWait: [1.8, 2.8],
      idleChance: 0.25,
      wanderSpeedMult: 0.7,
    },
  },
  // Carcaça deixada ao morrer (entra em estado "tun" de criptobiose)
  carcass: {
    name: "Carcaça de Tardígrado",
    bodyName: "Corpo de Tardígrado",
    description:
      "Corpo compacto e ultra resistente de tardígrado cavernoso em estado criptobiótico. Pode ser destrinchado com uma faca para extrair membrana celular indestrutível, micro-garras e gel hidratado.",
  },
  // Ficha mostrada ao destrinchar
  sheet: {
    name: "Tardígrado Cavernoso",
    species: "Invertebrado Criptobiótico Predador",
    icon: "🔬",
    badgeColor: "text-amber-300 border-amber-500/40 bg-amber-950/60",
    description:
      "Invertebrado arcaico colossal adaptado exclusivamente às cavernas do deserto. Varia em portes titânicos de até 3 vezes o tamanho comum, dotado de 8 patas com micro-garras, carapaça quase indestrutível e disco bucal com estilete que devora escorpiões, aranhas e aventureiros desavisados.",
    exclusiveNote:
      "Item Exclusivo: Membrana Criptobiótica de Tardígrado (resiste a dessecação, vácuo e altas pressões; nobre para forja e alquimia).",
  },
  // Como reconhecer um item/carcaça desta criatura (t = nome, l = id, o = ícone, tudo minúsculo)
  detect: (t, l, o) =>
    t.includes("tardigrad") ||
    t.includes("tardígrad") ||
    l.includes("tardigrade") ||
    l.includes("tardigrad") ||
    o === "creature_tardigrade",
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatório)
  loot: (t, l, monster) => {
    const isQueen = !!(monster && (monster.isQueen || (monster.name && monster.name.includes("Rainha"))));
    const items = [];
    if (isQueen) {
      items.push({
        id: `butcher_tardigrade_queen_jelly_${t}_${l()}`,
        isExclusive: true,
        exclusiveLabel: "⭐ Geleia Real da Matriarca",
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_geleia_real_tardigrado_${t}_${l()}`,
          name: "Geleia Real Criptobiótica da Rainha",
          categoryType: "consumable",
          rarity: "lendario",
          stackCount: 1,
          isEquippable: false,
          icon: "sparkles",
          color: "#fbbf24",
          value: 190,
          description:
            "Concentrado biológico puríssimo produzido pela Rainha dos Tardígrados no ninho profundo (+100 Vida, +100 Stamina ao consumir). Concede vitalidade lendária.",
        },
      });
      items.push({
        id: `butcher_tardigrade_queen_membrane_${t}_${l()}`,
        isExclusive: true,
        exclusiveLabel: "⭐ Cutícula da Rainha",
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_membrana_rainha_tardigrado_${t}_${l()}`,
          name: "Membrana Real da Rainha Tardígrado",
          categoryType: "material",
          rarity: "epico",
          stackCount: 3,
          isEquippable: false,
          icon: "shield",
          color: "#f59e0b",
          value: 130,
          description:
            "Placas de cutícula reforçada da Rainha dos Tardígrados. Material lendário para forja de armaduras de altíssima proteção.",
        },
      });
    }
    items.push(
      {
        id: `butcher_tardigrade_membrane_${t}_${l()}`,
        isExclusive: true,
        exclusiveLabel: "⭐ Exclusivo de Tardígrado",
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_membrana_tardigrado_${t}_${l()}`,
          name: "Membrana Criptobiótica de Tardígrado",
          categoryType: "material",
          rarity: "raro",
          stackCount: isQueen ? 4 : 2,
          isEquippable: false,
          icon: "sparkles",
          color: "#f59e0b",
          value: 75,
          description:
            "Cutícula celular translúcida ultra resistente de tardígrado. Imune ao vácuo e à dessecação, material lendário para armaduras e elixires protetores.",
        },
      },
      {
        id: `butcher_tardigrade_claws_${t}_${l()}`,
        isExclusive: false,
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_garras_tardigrado_${t}_${l()}`,
          name: "Micro-Garras Quitinosas de Tardígrado",
          categoryType: "material",
          rarity: "incomum",
          stackCount: isQueen ? 8 : 4,
          isEquippable: false,
          icon: "sparkles",
          color: "#fde047",
          value: 28,
          description:
            "Conjunto de garras diminutas e hiper afiadas das 8 patas do tardígrado. Ideais para agulhas de precisão e pontas perfurantes.",
        },
      },
      {
        id: `butcher_tardigrade_gel_${t}_${l()}`,
        isExclusive: false,
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_gel_tardigrado_${t}_${l()}`,
          name: "Gel Criptobiótico Hidratado",
          categoryType: "consumable",
          rarity: "incomum",
          stackCount: isQueen ? 4 : 2,
          isEquippable: false,
          icon: "droplet",
          color: "#38bdf8",
          value: 36,
          description:
            "Fluido biológico concentrado com trealose e proteínas protetoras (+40 Vida, +40 Stamina ao consumir). Aumenta resistência celular a venenos e calor.",
        },
      },
      {
        id: `butcher_tardigrade_meat_${t}_${l()}`,
        isExclusive: false,
        status: "pending",
        item: {
          isCreaturePart: true,
          id: `item_carne_tardigrado_${t}_${l()}`,
          name: "Carne Mineralizada de Tardígrado",
          categoryType: "consumable",
          rarity: "comum",
          stackCount: isQueen ? 3 : 1,
          isEquippable: false,
          icon: "utensils",
          color: "#d97706",
          value: 18,
          description:
            "Carne densa e gelatinosa rica em minerais cavernosos (+30 Vida ao consumir).",
        },
      }
    );
    return items;
  },
  // Reconhecer por nome/id/ícone para escolher o DESENHO do ícone
  detectIcon: (t, l, o) =>
    o === "creature_tardigrade" ||
    o === "tardigrade" ||
    t.includes("tardigrad") ||
    t.includes("tardígrad") ||
    l.includes("tardigrade"),
  // Desenho no Canvas
  draw: {
    // Corpo vivo no mundo (8 patas articuladas com coxa, joelho e garras, corpo rechonchudo com segmentos e disco bucal)
    body: function (e, t, o, l) {
      e.save();
      const isQueen = !!(t.isQueen || (t.name && t.name.includes("Rainha")));
      const isBaby = !!(t.isBaby || (t.name && t.name.includes("Filhote")));
      const isMoving = Math.hypot(t.vx || 0, t.vy || 0) > 0.04;
      const walkAnim = isMoving
        ? (isQueen ? t.animTimer * 4.5 : t.animTimer * 8.2)
        : (isQueen ? t.animTimer * 1.4 : t.animTimer * 1.8);
      const bobY = isMoving
        ? Math.sin(walkAnim * 2) * (isQueen ? 0.55 : 0.85) * o
        : Math.sin(walkAnim) * 0.35 * o;
      const facing = t.facing || "down";

      const mainCol = l ? "#ffffff" : (t.color || "#d97706");
      const midCol = l ? "#f1f5f9" : "#b45309";
      const darkCol = l ? "#e2e8f0" : "#92400e";
      const lightCol = l ? "#ffffff" : (t.accentColor || "#fef08a");
      const deepCol = l ? "#94a3b8" : "#78350f";
      const clawCol = l ? "#ffffff" : "#fde68a";

      // Sombra suave sob o tardígrado
      e.fillStyle = "rgba(15, 23, 42, 0.42)";
      e.beginPath();
      if (isQueen) {
        if (facing === "left" || facing === "right") {
          e.ellipse(0, 5.2 * o, 18.5 * o, 8.5 * o, 0, 0, Math.PI * 2);
        } else {
          e.ellipse(0, -0.5 * o, 12.5 * o, 18.5 * o, 0, 0, Math.PI * 2);
        }
      } else {
        if (facing === "left" || facing === "right") {
          e.ellipse(0, 5.0 * o, (isBaby ? 10.5 : 13.5) * o, (isBaby ? 5.0 : 6.5) * o, 0, 0, Math.PI * 2);
        } else {
          e.ellipse(0, 1.5 * o, (isBaby ? 9.5 : 12.0) * o, (isBaby ? 8.5 : 11.5) * o, 0, 0, Math.PI * 2);
        }
      }
      e.fill();

      // Pata articulada com COXA -> JOELHO -> CANELA/PATA -> MICRO-GARRAS (Vista Perfil Esquerda/Direita)
      function drawJointedLegSide(hipX, hipY, phase, scaleLeg = 1, isBackLeg = false) {
        const stride = isMoving ? Math.sin(phase) : 0;
        const lift = isMoving ? Math.max(0, -Math.cos(phase)) : 0;
        const s = o * scaleLeg;

        // Articulação do Joelho (projeta-se para frente e flexiona ao levantar a pata)
        const kneeX = hipX + (1.6 + stride * 2.1 + lift * 0.9) * s;
        const kneeY = hipY + (2.3 - lift * 1.9) * s;

        // Ponta da Pata no chão (acompanha o passo com apoio firme e impulso)
        const footX = hipX + (0.5 + stride * 3.4) * s;
        const footY = hipY + (5.2 - lift * 2.4) * s;

        const legDark = isBackLeg ? deepCol : darkCol;
        const legMain = isBackLeg ? darkCol : mainCol;
        const legKnee = isBackLeg ? midCol : lightCol;

        e.save();
        e.lineCap = "round";
        e.lineJoin = "round";

        // 1. Contorno escuro (Coxa + Canela)
        e.strokeStyle = legDark;
        e.lineWidth = 3.5 * s;
        e.beginPath();
        e.moveTo(hipX, hipY);
        e.lineTo(kneeX, kneeY);
        e.lineTo(footX, footY);
        e.stroke();

        // 2. Preenchimento muscular (Coxa superior mais grossa + Canela inferior)
        e.strokeStyle = legMain;
        e.lineWidth = 2.4 * s;
        e.beginPath();
        e.moveTo(hipX, hipY);
        e.lineTo(kneeX, kneeY);
        e.stroke();

        e.lineWidth = 2.0 * s;
        e.beginPath();
        e.moveTo(kneeX, kneeY);
        e.lineTo(footX, footY);
        e.stroke();

        // 3. Cápsula da Articulação do Joelho bem visível
        e.fillStyle = legDark;
        e.beginPath();
        e.arc(kneeX, kneeY, 1.55 * s, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = legKnee;
        e.beginPath();
        e.arc(kneeX + 0.25 * s, kneeY - 0.2 * s, 0.85 * s, 0, Math.PI * 2);
        e.fill();

        // 4. Almofada da Pata e 3 Micro-Garras Quitinosas curvadas para frente
        e.fillStyle = legDark;
        e.beginPath();
        e.ellipse(footX + 0.3 * s, footY, 1.45 * s, 0.95 * s, 0, 0, Math.PI * 2);
        e.fill();

        e.strokeStyle = clawCol;
        e.lineWidth = 0.9 * s;
        for (let c = -1; c <= 1; c++) {
          const cx = footX + (0.4 + c * 0.65) * s;
          e.beginPath();
          e.moveTo(cx, footY + 0.1 * s);
          e.lineTo(cx + 0.95 * s, footY + 1.25 * s);
          e.stroke();
        }
        e.restore();
      }

      // Pata articulada com COXA -> JOELHO LATERAL -> CANELA -> GARRAS (Vista Cima / Baixo)
      function drawJointedLegVertical(hipX, hipY, side, phase, scaleLeg = 1, isUpView = false) {
        const stride = isMoving ? Math.sin(phase) : 0;
        const lift = isMoving ? Math.max(0, -Math.cos(phase)) : 0;
        const s = o * scaleLeg;

        // Joelho abre para a lateral e levanta na passada
        const kneeX = hipX + side * (3.1 + lift * 1.1) * s;
        const kneeY = hipY + (stride * 1.7 - 0.9 - lift * 1.3) * s;

        // Pata apoia firme no chão com passada vertical (Norte-Sul)
        const footX = hipX + side * (4.4 - lift * 0.4) * s;
        const footY = hipY + (stride * 2.8 + 1.6 - lift * 1.6) * s;

        e.save();
        e.lineCap = "round";
        e.lineJoin = "round";

        // 1. Contorno escuro (Coxa + Canela)
        e.strokeStyle = deepCol;
        e.lineWidth = 3.4 * s;
        e.beginPath();
        e.moveTo(hipX, hipY);
        e.lineTo(kneeX, kneeY);
        e.lineTo(footX, footY);
        e.stroke();

        // 2. Volume muscular da Coxa e Canela
        e.strokeStyle = mainCol;
        e.lineWidth = 2.3 * s;
        e.beginPath();
        e.moveTo(hipX, hipY);
        e.lineTo(kneeX, kneeY);
        e.stroke();

        e.strokeStyle = midCol;
        e.lineWidth = 1.9 * s;
        e.beginPath();
        e.moveTo(kneeX, kneeY);
        e.lineTo(footX, footY);
        e.stroke();

        // 3. Articulação do Joelho destacada
        e.fillStyle = darkCol;
        e.beginPath();
        e.arc(kneeX, kneeY, 1.45 * s, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = lightCol;
        e.beginPath();
        e.arc(kneeX + side * 0.25 * s, kneeY - 0.25 * s, 0.75 * s, 0, Math.PI * 2);
        e.fill();

        // 4. Pata e 3 Micro-Garras orientadas na direção da marcha
        e.fillStyle = darkCol;
        e.beginPath();
        e.ellipse(footX, footY, 1.35 * s, 0.95 * s, 0, 0, Math.PI * 2);
        e.fill();

        const clawDirY = isUpView ? -1.15 : 1.15;
        e.strokeStyle = clawCol;
        e.lineWidth = 0.85 * s;
        for (let c = -1; c <= 1; c++) {
          const cx = footX + side * 0.35 * s + c * 0.65 * s;
          e.beginPath();
          e.moveTo(cx, footY);
          e.lineTo(cx + side * 0.55 * s, footY + clawDirY * s);
          e.stroke();
        }
        e.restore();
      }

      // Desenha um gomo rechonchudo 3D (com volume sombreado e brilho dorsal suave, SEM listras em cima/baixo)
      function drawPlumpSegment3D(cx, cy, rx, ry, rot = 0) {
        e.save();
        e.translate(cx, cy);
        if (rot) e.rotate(rot);

        // Base escura quitinosa
        e.fillStyle = darkCol;
        e.beginPath();
        e.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        e.fill();

        // Volume principal rechonchudo
        e.fillStyle = mainCol;
        e.beginPath();
        e.ellipse(0, -0.45 * o, rx * 0.9, ry * 0.86, 0, 0, Math.PI * 2);
        e.fill();

        // Brilho dorsal orgânico (dá relevo 3D sem criar listras artificiais)
        if (!l) {
          e.fillStyle = "rgba(254, 240, 138, 0.18)";
          e.beginPath();
          e.ellipse(0, -ry * 0.28, rx * 0.56, ry * 0.42, 0, 0, Math.PI * 2);
          e.fill();
        }
        e.restore();
      }

      if (facing === "down") {
        const swayX = isMoving ? Math.sin(walkAnim) * 0.55 * o : 0;
        if (isQueen) {
          // =================================================================
          // RAINHA (FRENTE / SUL): 7 SEGMENTOS E 6 PARES DE PATAS COM JOELHOS
          // Desenha de trás (norte) para frente (sul) intercalando patas e gomos
          // =================================================================
          const queenLegsY = [-12.5 * o, -8.5 * o, -4.5 * o, -0.5 * o, 3.5 * o, 7.2 * o];
          const segDefs = [
            { y: -13.8 * o, rx: 7.4 * o, ry: 4.6 * o },
            { y: -10.3 * o, rx: 8.6 * o, ry: 5.1 * o },
            { y: -6.8 * o, rx: 9.7 * o, ry: 5.6 * o },
            { y: -3.2 * o, rx: 10.5 * o, ry: 5.9 * o },
            { y: 0.4 * o, rx: 9.9 * o, ry: 5.6 * o },
            { y: 4.0 * o, rx: 9.0 * o, ry: 5.1 * o },
            { y: 7.5 * o, rx: 7.8 * o, ry: 4.7 * o },
          ];

          for (let i = 0; i < segDefs.length; i++) {
            if (i < 6) {
              const legPhase = walkAnim - i * 1.05;
              const ly = queenLegsY[i] + bobY;
              const hipW = (segDefs[i].rx - 1.2 * o);
              drawJointedLegVertical(-hipW, ly, -1, legPhase, i === 5 ? 0.95 : 1.08, false);
              drawJointedLegVertical(hipW, ly, 1, legPhase + Math.PI, i === 5 ? 0.95 : 1.08, false);
            }
            const s = segDefs[i];
            const segSway = swayX * Math.sin(i * 0.7);
            drawPlumpSegment3D(segSway, s.y + bobY, s.rx, s.ry);
          }

          // Focinho e disco bucal colossal da Rainha
          const mouthY = 10.9 * o + bobY;
          e.fillStyle = deepCol;
          e.beginPath();
          e.arc(swayX * 0.5, mouthY, 3.2 * o, 0, Math.PI * 2);
          e.fill();
          e.strokeStyle = lightCol;
          e.lineWidth = 1.2 * o;
          e.beginPath();
          e.arc(swayX * 0.5, mouthY, 2.2 * o, 0, Math.PI * 2);
          e.stroke();
          e.fillStyle = "#1e1b4b";
          e.beginPath();
          e.arc(swayX * 0.5, mouthY, 1.15 * o, 0, Math.PI * 2);
          e.fill();

          // Olhos imperiais da Rainha
          const eyeR = 1.5 * o;
          const pupilR = 0.65 * o;
          e.fillStyle = "#0f172a";
          e.beginPath();
          e.arc(-3.6 * o + swayX * 0.4, 7.6 * o + bobY, eyeR, 0, Math.PI * 2);
          e.arc(3.6 * o + swayX * 0.4, 7.6 * o + bobY, eyeR, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = lightCol;
          e.beginPath();
          e.arc(-3.8 * o + swayX * 0.4, 7.3 * o + bobY, pupilR, 0, Math.PI * 2);
          e.arc(3.4 * o + swayX * 0.4, 7.3 * o + bobY, pupilR, 0, Math.PI * 2);
          e.fill();
        } else {
          // =================================================================
          // TARDÍGRADO COMUM / FILHOTE (FRENTE / SUL): 4 GOMOS E 8 PATAS COM JOELHOS
          // Sem listras horizontais nas costas/frente!
          // =================================================================
          const segDefs = [
            { y: -6.4 * o, rx: 8.2 * o, ry: 4.9 * o, legY: -5.4 * o, legScale: 0.92 },
            { y: -2.3 * o, rx: 9.6 * o, ry: 5.5 * o, legY: -1.4 * o, legScale: 1.0 },
            { y: 1.9 * o, rx: 9.1 * o, ry: 5.3 * o, legY: 2.8 * o, legScale: 1.0 },
            { y: 6.1 * o, rx: 7.7 * o, ry: 4.8 * o, legY: 6.6 * o, legScale: 0.92 },
          ];

          for (let i = 0; i < 4; i++) {
            const s = segDefs[i];
            const legPhase = walkAnim - i * 1.35;
            const segSway = swayX * (i % 2 === 0 ? 1 : -1) * 0.6;
            const hipX = s.rx - 1.4 * o;
            drawJointedLegVertical(-hipX + segSway, s.legY + bobY, -1, legPhase, s.legScale, false);
            drawJointedLegVertical(hipX + segSway, s.legY + bobY, 1, legPhase + Math.PI, s.legScale, false);
            drawPlumpSegment3D(segSway, s.y + bobY, s.rx, s.ry);
          }

          // Disco Bucal característico do Tardígrado
          const mouthY = 9.4 * o + bobY;
          e.fillStyle = deepCol;
          e.beginPath();
          e.arc(0, mouthY, 2.7 * o, 0, Math.PI * 2);
          e.fill();
          e.strokeStyle = lightCol;
          e.lineWidth = 1.0 * o;
          e.beginPath();
          e.arc(0, mouthY, 1.9 * o, 0, Math.PI * 2);
          e.stroke();
          e.fillStyle = "#1e1b4b";
          e.beginPath();
          e.arc(0, mouthY, 0.95 * o, 0, Math.PI * 2);
          e.fill();

          // Olhos/ocelos
          const eyeR = (isBaby ? 1.55 : 1.15) * o;
          const pupilR = (isBaby ? 0.68 : 0.45) * o;
          e.fillStyle = "#0f172a";
          e.beginPath();
          e.arc(-3.2 * o, 6.2 * o + bobY, eyeR, 0, Math.PI * 2);
          e.arc(3.2 * o, 6.2 * o + bobY, eyeR, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = "#ffffff";
          e.beginPath();
          e.arc(-3.45 * o, 5.9 * o + bobY, pupilR, 0, Math.PI * 2);
          e.arc(2.95 * o, 5.9 * o + bobY, pupilR, 0, Math.PI * 2);
          e.fill();
        }
      } else if (facing === "up") {
        const swayX = isMoving ? Math.sin(walkAnim) * 0.55 * o : 0;
        if (isQueen) {
          // =================================================================
          // RAINHA VISTA DE COSTAS (NORTE): 6 PARES DE PATAS COM JOELHOS E 7 SEGMENTOS
          // Sem listras horizontais!
          // =================================================================
          const queenLegsY = [-12.0 * o, -8.2 * o, -4.4 * o, -0.5 * o, 3.4 * o, 7.2 * o];
          const segDefsUp = [
            { y: -13.4 * o, rx: 7.4 * o, ry: 4.4 * o },
            { y: -9.9 * o, rx: 8.6 * o, ry: 4.9 * o },
            { y: -6.4 * o, rx: 9.6 * o, ry: 5.4 * o },
            { y: -2.8 * o, rx: 10.4 * o, ry: 5.8 * o },
            { y: 0.9 * o, rx: 9.8 * o, ry: 5.6 * o },
            { y: 4.6 * o, rx: 9.0 * o, ry: 5.2 * o },
            { y: 8.2 * o, rx: 8.2 * o, ry: 4.9 * o },
          ];

          for (let i = 0; i < segDefsUp.length; i++) {
            const s = segDefsUp[i];
            const segSway = swayX * Math.sin(i * 0.7);
            if (i < 6) {
              const legPhase = walkAnim + i * 1.05;
              const ly = queenLegsY[i] + bobY;
              const hipW = s.rx - 1.2 * o;
              drawJointedLegVertical(-hipW + segSway, ly, -1, legPhase, i === 0 ? 0.95 : 1.08, true);
              drawJointedLegVertical(hipW + segSway, ly, 1, legPhase + Math.PI, i === 0 ? 0.95 : 1.08, true);
            }
            drawPlumpSegment3D(segSway, s.y + bobY, s.rx, s.ry);
          }
        } else {
          // =================================================================
          // TARDÍGRADO COMUM / FILHOTE VISTO DE COSTAS (NORTE): 4 GOMOS E 8 PATAS COM JOELHOS
          // Sem listras horizontais!
          // =================================================================
          const segDefsUp = [
            { y: -6.3 * o, rx: 7.5 * o, ry: 4.5 * o, legY: -5.5 * o, legScale: 0.9 },
            { y: -2.3 * o, rx: 8.8 * o, ry: 5.2 * o, legY: -1.6 * o, legScale: 1.0 },
            { y: 1.9 * o, rx: 9.5 * o, ry: 5.6 * o, legY: 2.5 * o, legScale: 1.0 },
            { y: 6.3 * o, rx: 8.6 * o, ry: 5.3 * o, legY: 6.4 * o, legScale: 0.94 },
          ];

          for (let i = 0; i < 4; i++) {
            const s = segDefsUp[i];
            const legPhase = walkAnim + i * 1.35;
            const segSway = swayX * (i % 2 === 0 ? 1 : -1) * 0.6;
            const hipX = s.rx - 1.4 * o;
            drawJointedLegVertical(-hipX + segSway, s.legY + bobY, -1, legPhase, s.legScale, true);
            drawJointedLegVertical(hipX + segSway, s.legY + bobY, 1, legPhase + Math.PI, s.legScale, true);
            drawPlumpSegment3D(segSway, s.y + bobY, s.rx, s.ry);
          }
        }
      } else {
        // ===================================================================
        // PERFIL LATERAL (facing === "left" ou "right")
        // Aqui as listras/dobras verticais da cutícula fazem 100% de sentido!
        // ===================================================================
        if (facing === "left") {
          e.scale(-1, 1);
        }

        if (isQueen) {
          const queenLegOffsetsX = [9.2 * o, 5.6 * o, 2.0 * o, -1.8 * o, -5.6 * o, -9.4 * o];
          // 1. Patas do plano de fundo (4 patas/6 patas de trás com coxa, joelho e garras)
          for (let i = 0; i < 6; i++) {
            const legPhase = walkAnim - i * 0.95 + Math.PI;
            drawJointedLegSide(queenLegOffsetsX[i], 0.4 * o + bobY, legPhase, 0.88, true);
          }

          // 2. 7 Segmentos ao longo do eixo horizontal
          const segDefsSide = [
            { x: -13.2 * o, rx: 4.8 * o, ry: 6.2 * o },
            { x: -9.6 * o, rx: 5.3 * o, ry: 6.8 * o },
            { x: -5.8 * o, rx: 5.7 * o, ry: 7.4 * o },
            { x: -1.9 * o, rx: 5.9 * o, ry: 7.8 * o },
            { x: 2.1 * o, rx: 5.6 * o, ry: 7.4 * o },
            { x: 6.0 * o, rx: 5.1 * o, ry: 6.7 * o },
            { x: 9.7 * o, rx: 4.5 * o, ry: 5.7 * o },
          ];

          for (let i = 0; i < segDefsSide.length; i++) {
            const s = segDefsSide[i];
            const segWaveY = isMoving ? Math.sin(walkAnim - i * 0.7) * 0.35 * o : 0;
            drawPlumpSegment3D(s.x, 0.2 * o + bobY + segWaveY, s.rx, s.ry);
          }

          // Listras/dobras dorsais curvas entre os segmentos (exclusivas do perfil esquerda/direita)
          e.strokeStyle = lightCol;
          e.lineWidth = 1.15 * o;
          e.lineCap = "round";
          for (let i = 1; i < segDefsSide.length; i++) {
            const sx = (segDefsSide[i - 1].x + segDefsSide[i].x) * 0.5;
            const hSeg = Math.min(segDefsSide[i - 1].ry, segDefsSide[i].ry) * 0.78;
            e.beginPath();
            e.moveTo(sx - 0.3 * o, -hSeg + bobY);
            e.quadraticCurveTo(sx + 0.9 * o, 0.2 * o + bobY, sx - 0.3 * o, hSeg + bobY);
            e.stroke();
          }

          // Focinho e disco bucal
          const mouthX = 14.0 * o;
          const mouthY = 1.8 * o + bobY;
          e.fillStyle = deepCol;
          e.beginPath();
          e.ellipse(mouthX, mouthY, 2.3 * o, 2.9 * o, 0.2, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = lightCol;
          e.beginPath();
          e.arc(mouthX + 0.6 * o, mouthY, 1.35 * o, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = "#1e1b4b";
          e.beginPath();
          e.arc(mouthX + 0.9 * o, mouthY, 0.72 * o, 0, Math.PI * 2);
          e.fill();

          // Olho lateral da Rainha
          e.fillStyle = "#0f172a";
          e.beginPath();
          e.arc(10.2 * o, -1.2 * o + bobY, 1.45 * o, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = lightCol;
          e.beginPath();
          e.arc(10.5 * o, -1.5 * o + bobY, 0.65 * o, 0, Math.PI * 2);
          e.fill();

          // 3. Patas do primeiro plano com coxa, joelho e garras
          for (let i = 0; i < 6; i++) {
            const legPhase = walkAnim - i * 0.95;
            drawJointedLegSide(queenLegOffsetsX[i], 1.8 * o + bobY, legPhase, 1.05, false);
          }
        } else {
          const legOffsetsX = [6.8 * o, 2.2 * o, -2.6 * o, -7.4 * o];
          // 1. 4 Patas traseiras (plano de fundo) com coxa, joelho e micro-garras
          for (let i = 0; i < 4; i++) {
            const legPhase = walkAnim - i * 1.35 + Math.PI;
            drawJointedLegSide(legOffsetsX[i], 0.3 * o + bobY, legPhase, 0.86, true);
          }

          // 2. CORPO LATERAL RECHONCHUDO (4 gomos em perfil horizontal com leve ondulação)
          const segDefsSide = [
            { x: -7.6 * o, y: 0.4 * o, rx: 5.0 * o, ry: 6.1 * o, rot: 0.08 },
            { x: -2.4 * o, y: -0.1 * o, rx: 5.5 * o, ry: 6.9 * o, rot: 0 },
            { x: 2.8 * o, y: -0.1 * o, rx: 5.3 * o, ry: 6.7 * o, rot: -0.04 },
            { x: 7.6 * o, y: 0.8 * o, rx: 4.5 * o, ry: 5.3 * o, rot: -0.12 },
          ];

          for (let i = 0; i < segDefsSide.length; i++) {
            const s = segDefsSide[i];
            const segWaveY = isMoving ? Math.sin(walkAnim - i * 0.9) * 0.4 * o : 0;
            drawPlumpSegment3D(s.x, s.y + bobY + segWaveY, s.rx, s.ry, s.rot);
          }

          // Listras/anéis dorsais de cutícula entre os gomos (EXCLUSIVAS do perfil esquerda/direita!)
          e.strokeStyle = lightCol;
          e.lineWidth = 1.05 * o;
          e.lineCap = "round";
          const stripePositions = [
            { x: -5.1 * o, topY: -5.1 * o, botY: 5.0 * o },
            { x: 0.3 * o, topY: -5.7 * o, botY: 5.4 * o },
            { x: 5.4 * o, topY: -4.5 * o, botY: 4.4 * o },
          ];
          for (let i = 0; i < stripePositions.length; i++) {
            const st = stripePositions[i];
            const stWave = isMoving ? Math.sin(walkAnim - i * 0.9) * 0.35 * o : 0;
            e.beginPath();
            e.moveTo(st.x, st.topY + bobY + stWave);
            e.quadraticCurveTo(st.x + 1.0 * o, bobY + stWave, st.x, st.botY + bobY + stWave);
            e.stroke();
          }

          // Focinho e disco bucal voltado para a frente
          const mouthX = 11.6 * o;
          const mouthY = 2.0 * o + bobY;
          e.fillStyle = deepCol;
          e.beginPath();
          e.ellipse(mouthX, mouthY, 1.9 * o, 2.5 * o, 0.18, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = lightCol;
          e.beginPath();
          e.arc(mouthX + 0.5 * o, mouthY, 1.15 * o, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = "#1e1b4b";
          e.beginPath();
          e.arc(mouthX + 0.78 * o, mouthY, 0.62 * o, 0, Math.PI * 2);
          e.fill();

          // Olho lateral expressivo
          const latEyeR = (isBaby ? 1.55 : 1.15) * o;
          const latPupilR = (isBaby ? 0.68 : 0.45) * o;
          e.fillStyle = "#0f172a";
          e.beginPath();
          e.arc(8.0 * o, -1.0 * o + bobY, latEyeR, 0, Math.PI * 2);
          e.fill();
          e.fillStyle = "#ffffff";
          e.beginPath();
          e.arc(8.3 * o, -1.3 * o + bobY, latPupilR, 0, Math.PI * 2);
          e.fill();

          // 3. 4 Patas dianteiras (primeiro plano) com coxa, joelho e micro-garras
          for (let i = 0; i < 4; i++) {
            const legPhase = walkAnim - i * 1.35;
            drawJointedLegSide(legOffsetsX[i], 1.7 * o + bobY, legPhase, 1.02, false);
          }
        }
      }

      // Auréola mineral de Criptobiose (ao levar dano ou quando provocado; apenas para tardígrados normais)
      if (!isQueen && (l || (t.aggroTimer && t.aggroTimer > 0))) {
        const pulse = 0.5 + Math.sin(t.animTimer * 8) * 0.3;
        e.strokeStyle = `rgba(254, 240, 138, ${pulse * 0.75})`;
        e.lineWidth = 1.6 * o;
        e.beginPath();
        e.ellipse(0, 1.5 * o + bobY, 14.5 * o, 9.5 * o, 0, 0, Math.PI * 2);
        e.stroke();

        for (let s = 0; s < 4; s++) {
          const sAng = s * (Math.PI / 2) + t.animTimer * 3;
          const sDist = 14 * o;
          const sx = Math.cos(sAng) * sDist;
          const sy = Math.sin(sAng) * (sDist * 0.65) + bobY;
          e.fillStyle = s % 2 === 0 ? "#fef08a" : "#f59e0b";
          e.beginPath();
          e.arc(sx, sy, 1.2 * o, 0, Math.PI * 2);
          e.fill();
        }
      }

      e.restore();
    },

    // Carcaça no chão: estado clássico de "Tun" (barril criptobiótico encolhido e resistente)
    carcass: function (e, t, o, u) {
      e.save();
      const mainCol = t.color || "#d97706";
      const darkCol = "#78350f";
      const lightCol = t.accentColor || "#fef08a";

      // Sombra
      e.fillStyle = `rgba(15, 23, 42, ${0.45 * u})`;
      e.beginPath();
      e.ellipse(0, 2.5 * o, 11 * o, 6 * o, 0, 0, Math.PI * 2);
      e.fill();

      // Barril Criptobiótico ("Tun") - corpo compacto e encolhido
      e.fillStyle = darkCol;
      e.beginPath();
      e.ellipse(0, 0, 9.5 * o, 7.5 * o, 0, 0, Math.PI * 2);
      e.fill();

      e.fillStyle = mainCol;
      e.beginPath();
      e.ellipse(0, -0.6 * o, 8.2 * o, 6.2 * o, 0, 0, Math.PI * 2);
      e.fill();

      // Patas recolhidas com joelhos dobrados ao redor do corpo
      for (const side of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          const py = (-3.6 + i * 2.4) * o;
          const hipX = side * 6.2 * o;
          const kneeX = side * 8.4 * o;
          const kneeY = py - 0.6 * o;
          const footX = side * 7.8 * o;
          const footY = py + 1.2 * o;

          e.strokeStyle = darkCol;
          e.lineWidth = 2.0 * o;
          e.lineCap = "round";
          e.lineJoin = "round";
          e.beginPath();
          e.moveTo(hipX, py);
          e.lineTo(kneeX, kneeY);
          e.lineTo(footX, footY);
          e.stroke();

          e.fillStyle = lightCol;
          e.beginPath();
          e.arc(kneeX, kneeY, 0.7 * o, 0, Math.PI * 2);
          e.fill();
        }
      }

      // Disco bucal retraído
      e.fillStyle = darkCol;
      e.beginPath();
      e.arc(0, 4.5 * o, 1.8 * o, 0, Math.PI * 2);
      e.fill();
      e.strokeStyle = lightCol;
      e.lineWidth = 0.8 * o;
      e.beginPath();
      e.arc(0, 4.5 * o, 1.1 * o, 0, Math.PI * 2);
      e.stroke();

      // Partículas minerais de sono criptobiótico
      const shimmer = Math.sin(t.animTimer * 3) * 0.2 + 0.8;
      e.strokeStyle = `rgba(251, 191, 36, ${0.5 * u * shimmer})`;
      e.lineWidth = 1.0 * o;
      e.beginPath();
      e.ellipse(0, 0, 12 * o, 9 * o, 0, 0, Math.PI * 2);
      e.stroke();

      e.restore();
    },

    // Ícone desenhado no canvas / inventário / slots (em perfil com joelhos e listras laterais)
    icon: function (e, t, l) {
      e.save();
      const o = (t || 32) / 32;
      const mainCol = l.color || "#d97706";
      const darkCol = "#78350f";
      const lightCol = "#fef08a";

      // Sombra
      e.fillStyle = "rgba(15, 23, 42, 0.35)";
      e.beginPath();
      e.ellipse(0, 4.8 * o, 11.5 * o, 4.5 * o, 0, 0, Math.PI * 2);
      e.fill();

      // 4 pares de patas com joelho em perfil
      const legX = [5.8 * o, 1.8 * o, -2.2 * o, -6.2 * o];
      for (let i = 0; i < 4; i++) {
        const lx = legX[i];
        const ky = 3.2 * o;
        const fy = 5.4 * o;
        e.strokeStyle = darkCol;
        e.lineWidth = 2.4 * o;
        e.lineCap = "round";
        e.lineJoin = "round";
        e.beginPath();
        e.moveTo(lx, 1.2 * o);
        e.lineTo(lx + 1.3 * o, ky);
        e.lineTo(lx + 0.4 * o, fy);
        e.stroke();

        e.fillStyle = lightCol;
        e.beginPath();
        e.arc(lx + 1.3 * o, ky, 0.75 * o, 0, Math.PI * 2);
        e.fill();
      }

      // Corpo segmentado em perfil
      const segs = [
        { x: -6.4 * o, y: 0.2 * o, rx: 4.2 * o, ry: 5.0 * o },
        { x: -2.0 * o, y: -0.2 * o, rx: 4.6 * o, ry: 5.6 * o },
        { x: 2.4 * o, y: -0.2 * o, rx: 4.4 * o, ry: 5.4 * o },
        { x: 6.4 * o, y: 0.5 * o, rx: 3.8 * o, ry: 4.4 * o },
      ];
      for (const s of segs) {
        e.fillStyle = darkCol;
        e.beginPath();
        e.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = mainCol;
        e.beginPath();
        e.ellipse(s.x, s.y - 0.35 * o, s.rx * 0.88, s.ry * 0.85, 0, 0, Math.PI * 2);
        e.fill();
      }

      // Listras dorsais no perfil
      e.strokeStyle = lightCol;
      e.lineWidth = 0.95 * o;
      for (const sx of [-4.2 * o, 0.2 * o, 4.5 * o]) {
        e.beginPath();
        e.moveTo(sx, -4.2 * o);
        e.quadraticCurveTo(sx + 0.8 * o, 0, sx, 4.0 * o);
        e.stroke();
      }

      // Disco bucal e olho
      e.fillStyle = darkCol;
      e.beginPath();
      e.ellipse(9.8 * o, 1.5 * o, 1.6 * o, 2.1 * o, 0.15, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = lightCol;
      e.beginPath();
      e.arc(10.2 * o, 1.5 * o, 0.9 * o, 0, Math.PI * 2);
      e.fill();

      e.fillStyle = "#0f172a";
      e.beginPath();
      e.arc(6.8 * o, -0.9 * o, 0.95 * o, 0, Math.PI * 2);
      e.fill();
      e.fillStyle = "#ffffff";
      e.beginPath();
      e.arc(7.0 * o, -1.1 * o, 0.4 * o, 0, Math.PI * 2);
      e.fill();

      e.restore();
    },
  },
};
