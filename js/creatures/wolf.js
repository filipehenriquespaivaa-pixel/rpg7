/* js/creatures/wolf.js
 * Criatura COMPLETA: Lobo (predador). Tudo que define o lobo fica neste arquivo.
 * Depende de registry.js (carregar depois dele). Ordem de carga: rabbit.js, wolf.js, deer.js
 * (a ordem define a prioridade de deteccao por nome: coelho > lobo > cervo).
 *
 * Dois nascimentos: `spawn` (Lobo dos Bosques, florestas) e `spawnVariants.snow` (Lobo das Neves, biomas de neve/gelo).
 * `behavior.predator`: presas fogem dele (updatePreyAI). `behavior.hunter`: numeros da IA de caca
 * (creatures-manager.js): cacar presas num raio, perseguir, atacar e vagar quando nao ha presa.
 */
"use strict";

// ==========================================
// RENDERIZADOR APRIMORADO DO LOBO (ANATOMIA E PELAGEM)
// ==========================================
function getWolfPalette(t, l) {
  const isSnow = (t.accentColor === "#38bdf8") || (t.name && t.name.toLowerCase().includes("neve"));
  if (l) {
    return {
      base: "#ffffff",
      shade: "#e2e8f0",
      dorsal: "#cbd5e1",
      light: "#ffffff",
      chest: "#ffffff",
      earInner: "#ffffff",
      nose: "#94a3b8",
      claws: "#64748b",
      eyeIris: "#ef4444",
      eyeGlow: "rgba(239, 68, 68, 0.4)",
      pupil: "#0f172a",
      fangs: "#ffffff",
      isSnow: isSnow,
    };
  }
  if (isSnow) {
    return {
      base: t.color || "#94a3b8",
      shade: "#64748b",
      dorsal: "#475569",
      light: "#f8fafc",
      chest: "#f1f5f9",
      earInner: "#cbd5e1",
      nose: "#0f172a",
      claws: "#020617",
      eyeIris: t.accentColor || "#38bdf8",
      eyeGlow: "rgba(56, 189, 248, 0.55)",
      pupil: "#020617",
      fangs: "#f8fafc",
      isSnow: true,
    };
  }
  return {
    base: t.color || "#475569",
    shade: "#334155",
    dorsal: "#1e293b",
    light: "#cbd5e1",
    chest: "#e2e8f0",
    earInner: "#fda4af",
    nose: "#0f172a",
    claws: "#020617",
    eyeIris: t.accentColor || "#f59e0b",
    eyeGlow: "rgba(245, 158, 11, 0.5)",
    pupil: "#020617",
    fangs: "#ffffff",
    isSnow: false,
  };
}

function drawLupineBushyTail(e, ox, oy, o, pal, angle, wag, lengthMult) {
  e.save();
  e.translate(ox, oy);
  e.rotate(angle + wag);
  const L = 14 * (lengthMult || 1) * o;

  e.fillStyle = pal.shade;
  e.beginPath();
  e.moveTo(0, -1.2 * o);
  e.bezierCurveTo(L * 0.35, -2.8 * o, L * 0.75, -2.0 * o, L, -0.2 * o);
  e.lineTo(L * 0.85, 2.6 * o);
  e.lineTo(L * 0.6, 3.8 * o);
  e.lineTo(L * 0.35, 3.2 * o);
  e.lineTo(0, 2.0 * o);
  e.closePath();
  e.fill();

  e.fillStyle = pal.base;
  e.beginPath();
  e.moveTo(0, -1.8 * o);
  e.bezierCurveTo(L * 0.35, -3.8 * o, L * 0.75, -2.8 * o, L, -0.6 * o);
  e.lineTo(L + 2.0 * o, -0.2 * o);
  e.lineTo(L * 0.82, 2.2 * o);
  e.lineTo(L * 0.74, 1.2 * o);
  e.lineTo(L * 0.55, 3.4 * o);
  e.lineTo(L * 0.45, 1.8 * o);
  e.lineTo(L * 0.25, 2.8 * o);
  e.lineTo(0, 1.6 * o);
  e.closePath();
  e.fill();

  if (pal.dorsal !== pal.base) {
    e.fillStyle = pal.dorsal;
    e.beginPath();
    e.moveTo(0, -1.8 * o);
    e.bezierCurveTo(L * 0.35, -3.8 * o, L * 0.7, -2.6 * o, L * 0.88, -1.0 * o);
    e.lineTo(L * 0.7, -0.4 * o);
    e.bezierCurveTo(L * 0.45, -1.6 * o, L * 0.2, -1.0 * o, 0, -0.3 * o);
    e.closePath();
    e.fill();
  }

  e.fillStyle = pal.light;
  e.beginPath();
  e.moveTo(L * 0.72, -1.4 * o);
  e.lineTo(L + 2.0 * o, -0.2 * o);
  e.lineTo(L * 0.75, 1.8 * o);
  e.lineTo(L * 0.8, 0.4 * o);
  e.closePath();
  e.fill();

  e.restore();
}

function drawLupinePaw(e, px, py, o, pal, isFar) {
  const col = isFar ? pal.shade : pal.base;
  e.fillStyle = col;
  e.beginPath();
  e.ellipse(px + 0.6 * o, py + 1.8 * o, 2.4 * o, 1.4 * o, 0, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = pal.nose;
  e.beginPath();
  e.ellipse(px + 0.4 * o, py + 2.2 * o, 1.8 * o, 0.8 * o, 0, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = pal.claws;
  e.beginPath();
  e.moveTo(px + 1.8 * o, py + 1.4 * o);
  e.lineTo(px + 3.2 * o, py + 2.4 * o);
  e.lineTo(px + 1.8 * o, py + 2.6 * o);
  e.closePath();
  e.fill();
  e.beginPath();
  e.moveTo(px + 1.4 * o, py + 2.0 * o);
  e.lineTo(px + 2.8 * o, py + 2.9 * o);
  e.lineTo(px + 1.2 * o, py + 3.0 * o);
  e.closePath();
  e.fill();
  e.beginPath();
  e.moveTo(px - 0.6 * o, py + 2.2 * o);
  e.lineTo(px + 0.6 * o, py + 3.1 * o);
  e.lineTo(px - 0.4 * o, py + 2.9 * o);
  e.closePath();
  e.fill();

  if (!pal.isHitFlash && pal.claws !== "#ffffff") {
    e.fillStyle = "rgba(255, 255, 255, 0.45)";
    e.fillRect(px + 2.8 * o, py + 2.2 * o, 0.6 * o, 0.6 * o);
  }
}

function drawLupineEye(e, ex, ey, o, pal, squint) {
  const sq = squint ? 0.6 : 1.0;
  e.fillStyle = "#020617";
  e.beginPath();
  e.ellipse(ex, ey, 2.0 * o, 1.4 * o * sq, 0.12, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = pal.eyeGlow;
  e.beginPath();
  e.arc(ex + 0.2 * o, ey, 1.6 * o, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = pal.eyeIris;
  e.beginPath();
  e.arc(ex + 0.2 * o, ey, 1.2 * o * sq, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = pal.pupil;
  e.beginPath();
  e.ellipse(ex + 0.4 * o, ey, 0.45 * o, 1.0 * o * sq, 0.05, 0, Math.PI * 2);
  e.fill();

  e.fillStyle = "#ffffff";
  e.beginPath();
  e.arc(ex - 0.2 * o, ey - 0.4 * o * sq, 0.42 * o, 0, Math.PI * 2);
  e.fill();

  e.strokeStyle = pal.dorsal;
  e.lineWidth = 1.0 * o;
  e.lineCap = "round";
  e.beginPath();
  e.moveTo(ex - 1.6 * o, ey - 1.4 * o);
  e.lineTo(ex + 1.8 * o, ey - 1.1 * o);
  e.stroke();
}
CREATURES.wolf = {
  id: "wolf",
  // Nascimento no mundo (valores do spawn)
  spawn: { name: "Lobo dos Bosques", color: "#475569", accentColor: "#f59e0b", hp: 68, attack: 8, speed: 1.05, scale: 0.95, dodgeChance: 0.20 },
  spawnVariants: {
    snow: { name: "Lobo das Neves", color: "#94a3b8", accentColor: "#38bdf8", hp: 76, attack: 9, speed: 1.1, scale: 1, dodgeChance: 0.20 },
  },
  // Comportamento: predador (as presas fogem dele); particulas ao morrer
  behavior: {
    prey: false,
    predator: true,
    dodgeChance: 0.20,
    deathParticles: 12,
    // Nome da ameaca mostrado/guardado nas presas (threatName)
    threatName: "lobo",
    // Recarga do ataque ao jogador (s)
    attackCooldown: 1,
    // Valores usados pela IA de caca (creatures-manager.js)
    hunter: {
      huntRadius: 185,
      meleeRange: 22,
      huntSpeedMult: 1.35,
      attackCooldownPrey: 1.1,
      wanderWait: [1.8, 2.5],
      idleChance: 0.3,
      wanderSpeedMult: 0.6,
    },
  },
  // Carcaca deixada ao morrer
  carcass: {
    name: "Carcaça de Lobo",
    bodyName: "Corpo de Lobo",
    description: "Corpo de lobo abatido. Pode ser destrinchado com uma faca para extrair ossos, pele, carne, entranhas e dente de lobo.",
  },
  // Ficha mostrada ao destrinchar
  sheet: {
          name: "Lobo Selvagem",
          species: "Canídeo Predador",
          icon: "🐺",
          badgeColor: "text-slate-300 border-slate-500/40 bg-slate-900/60",
          description:
            "Predador canino ágil das estepes e bosques nevados. Possui 20% de chance de esquiva ao ser atacado, saltando 2 passos para trás e desengajando do combate. Rende pele espessa, carne, ossos, entranhas e dentes afiados.",
          exclusiveNote:
            "Habilidade Especial: Esquiva Ágil (20% de chance de esquiva + recuo de 2 passos). Item Exclusivo: Dente de Lobo.",
        },
  // Como reconhecer um item/carcaca desta criatura (t = nome, l = id, o = icone, tudo minusculo)
  detect: (t, l, o) => t.includes("lobo") || t.includes("wolf") || l.includes("wolf") || l.includes("lobo") || o === "creature_wolf",
  // Reconhecer por nome/id/icone para escolher o DESENHO do icone (antigo lb). t=nome, l=id, o=icone (minusculos)
  detectIcon: (t, l, o) => o === "creature_wolf" || o === "wolf" || t.includes("lobo") || l.includes("wolf"),
  // Despojos ao destrinchar (t = timestamp, l = gerador de sufixo aleatorio)
  loot: (t, l) => [
          {
            id: `butcher_wolf_bone_${t}_${l()}`,
            isExclusive: !1,
            status: "pending",
            item: {
              isCreaturePart: !0,
              id: `item_osso_lobo_${t}_${l()}`,
              name: "Ossos de Lobo",
              categoryType: "material",
              rarity: "comum",
              stackCount: 3,
              isEquippable: !1,
              icon: "bone",
              color: "#e2e8f0",
              value: 12,
              description:
                "Ossos densos e resistentes de predador canino. Matéria-prima clássica para ferramentas, agulhas e entalhes.",
            },
          },
          {
            id: `butcher_wolf_pelt_${t}_${l()}`,
            isExclusive: !1,
            status: "pending",
            item: {
              isCreaturePart: !0,
              id: `item_pele_lobo_${t}_${l()}`,
              name: "Pele de Lobo",
              categoryType: "material",
              rarity: "incomum",
              stackCount: 1,
              isEquippable: !1,
              icon: "shirt",
              color: "#94a3b8",
              value: 30,
              description:
                "Couro felpudo com espessa camada térmica de lã de lobo. Ideal para confecção de mantos e reforço de armaduras.",
            },
          },
          {
            id: `butcher_wolf_meat_${t}_${l()}`,
            isExclusive: !1,
            status: "pending",
            item: {
              isCreaturePart: !0,
              id: `item_carne_lobo_${t}_${l()}`,
              name: "Carne de Lobo Crua",
              categoryType: "consumable",
              rarity: "comum",
              stackCount: 2,
              isEquippable: !1,
              icon: "utensils",
              color: "#f87171",
              value: 18,
              description:
                "Carne crua de caça. Pode ser consumida (+25 Vida, +30 Stamina) ou levada à fogueira e forno de barro para assar.",
            },
          },
          {
            id: `butcher_wolf_guts_${t}_${l()}`,
            isExclusive: !1,
            status: "pending",
            item: {
              isCreaturePart: !0,
              id: `item_entranhas_lobo_${t}_${l()}`,
              name: "Entranhas de Lobo",
              categoryType: "material",
              rarity: "comum",
              stackCount: 1,
              isEquippable: !1,
              icon: "heart",
              color: "#991b1b",
              value: 14,
              description:
                "Vísceras frescas colhidas durante a evisceração. Essenciais para compostos químicos, iscas e fermentações.",
            },
          },
          {
            id: `butcher_wolf_tooth_${t}_${l()}`,
            isExclusive: !0,
            exclusiveLabel: "⭐ Exclusivo de Lobo",
            status: "pending",
            item: {
              isCreaturePart: !0,
              id: `item_dente_lobo_${t}_${l()}`,
              name: "Dente de Lobo Alfa",
              categoryType: "material",
              rarity: "raro",
              stackCount: 2,
              isEquippable: !1,
              icon: "sparkles",
              color: "#f1f5f9",
              value: 48,
              description:
                "Presa afiada e curva do lobo predador. Item exclusivo valioso, cobiçado para ornamentos cerimoniais e armas perfurantes.",
            },
          },
        ],
  // Desenho no Canvas (Aparência aprimorada: anatomia lupina realista, cauda espessa, juba, bochechas felpudas, patas com garras e olhos amendoados penetrantes)
  draw: {
    // Corpo vivo no mundo (padrão e combate)
    body: function (e, t, o, l) {
      const pal = getWolfPalette(t, l);

      // ==========================================
      // 0. ESQUIVA ÁGIL: SALTO LUPINO NO AR (DODGE LEAP)
      // ==========================================
      if (t.wolfAttackState === "dodge_leap") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const dur = t.wolfAttackDuration || 0.38;
        const prog = Math.min(1, Math.max(0, 1 - (t.wolfAttackTimer || 0) / dur));
        // Arco parabólico do salto: eleva o lobo no ar até 14px * scale no ápice
        const jumpElevation = Math.sin(prog * Math.PI) * 14 * o;
        // Inclinação aerodinâmica do salto: sobe na arrancada, nivela no ápice e mira as patas na descida
        const leapTilt = (prog - 0.5) * 0.28;

        // Sombra realista no chão (permanece no solo projetada sob o lobo, diminuindo e suavizando no ápice do salto)
        const shadowScale = Math.max(0.62, 1 - (jumpElevation / (18 * o)));
        e.fillStyle = "rgba(15, 23, 42, " + (0.35 * shadowScale) + ")";
        e.beginPath();
        e.ellipse(0, 4.5 * o, 13 * o * shadowScale, 3.8 * o * shadowScale, 0, 0, Math.PI * 2);
        e.fill();

        // Eleva e inclina o corpo do lobo no ar na direção do salto
        e.translate(0, -jumpElevation);
        e.rotate(leapTilt);

        // Pata traseira de trás (estendida para trás em propulsão elástica)
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-6 * o, -6 * o);
        e.lineTo(-12 * o, -1 * o);
        e.lineTo(-13 * o, 1 * o);
        e.lineTo(-9 * o, 0 * o);
        e.lineTo(-4 * o, -6 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -12 * o, 0.5 * o, o, pal, true);

        // Pata dianteira de trás (estendida para a frente cortando o ar)
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(5 * o, -7 * o);
        e.lineTo(9 * o, -2 * o);
        e.lineTo(11 * o, -1 * o);
        e.lineTo(8 * o, 1 * o);
        e.lineTo(3 * o, -7 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 10 * o, -0.5 * o, o, pal, true);

        // Cauda espessa esvoaçante alinhada com a aerodinâmica do salto
        drawLupineBushyTail(e, -10 * o, -7 * o, o, pal, Math.PI * 1.02, 0, 1.2);

        // Tronco musculoso alongado em pleno salto
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-10 * o, -9 * o);
        e.quadraticCurveTo(-2 * o, -13 * o, 5 * o, -12 * o);
        e.lineTo(8 * o, -9 * o);
        e.quadraticCurveTo(8.5 * o, -4 * o, 4.5 * o, -2.5 * o);
        e.quadraticCurveTo(-3 * o, -3.5 * o, -9 * o, -6 * o);
        e.closePath();
        e.fill();

        // Faixa dorsal escura
        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-10 * o, -9 * o);
          e.quadraticCurveTo(-2 * o, -13 * o, 5 * o, -12 * o);
          e.lineTo(8 * o, -9 * o);
          e.lineTo(4 * o, -8.5 * o);
          e.quadraticCurveTo(-3 * o, -9 * o, -9.5 * o, -7.5 * o);
          e.closePath();
          e.fill();
        }

        // Peito claro e juba eriçada
        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(2 * o, -8.5 * o);
          e.quadraticCurveTo(7 * o, -5 * o, 5 * o, -2.5 * o);
          e.quadraticCurveTo(1 * o, -3.5 * o, -2 * o, -5 * o);
          e.closePath();
          e.fill();

          e.fillStyle = pal.light;
          e.beginPath();
          e.moveTo(6 * o, -9 * o);
          e.lineTo(9.5 * o, -6 * o);
          e.lineTo(7.5 * o, -3.5 * o);
          e.lineTo(10.2 * o, -1.8 * o);
          e.lineTo(6.5 * o, -1 * o);
          e.closePath();
          e.fill();
        }

        // Pata traseira da frente (esticada para trás)
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-5 * o, -9 * o);
        e.quadraticCurveTo(-10 * o, -4 * o, -11 * o, 0.5 * o);
        e.lineTo(-12.5 * o, 1.8 * o);
        e.lineTo(-9.5 * o, 1.5 * o);
        e.lineTo(-4 * o, -4 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -11.5 * o, 1.2 * o, o, pal, false);

        // Pata dianteira da frente (esticada para a frente, preparando a aterrissagem)
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(4 * o, -9 * o);
        e.lineTo(9.5 * o, -1 * o);
        e.lineTo(11.5 * o, 1 * o);
        e.lineTo(8.5 * o, 1.5 * o);
        e.lineTo(4.5 * o, -3 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 10.5 * o, 0.8 * o, o, pal, false);

        // Cabeça e focinho em foco de esquiva
        const headX = 8 * o;
        const headY = -11.5 * o;

        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(3 * o, -11.5 * o);
        e.lineTo(headX + 2 * o, headY - 3.8 * o);
        e.lineTo(headX + 5 * o, headY);
        e.lineTo(5 * o, -6.5 * o);
        e.closePath();
        e.fill();

        e.beginPath();
        e.ellipse(headX + 1.6 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.1, 0, Math.PI * 2);
        e.fill();

        // Bochechas felpudas
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY + 1 * o);
        e.lineTo(headX - 3.5 * o, headY + 3.2 * o);
        e.lineTo(headX + 0.5 * o, headY + 3.2 * o);
        e.closePath();
        e.fill();

        // Orelhas aerodinâmicas (inclinadas ligeiramente para trás pela velocidade do salto)
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headX - 1 * o, headY - 3 * o);
        e.lineTo(headX - 2 * o, headY - 8.2 * o);
        e.lineTo(headX + 1.8 * o, headY - 3.5 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 0.5 * o, headY - 3.5 * o);
        e.lineTo(headX + 0.8 * o, headY - 9 * o);
        e.lineTo(headX + 4.2 * o, headY - 3.8 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.earInner;
        e.beginPath();
        e.moveTo(headX + 1.2 * o, headY - 4 * o);
        e.lineTo(headX + 1.5 * o, headY - 7.8 * o);
        e.lineTo(headX + 3.4 * o, headY - 4.2 * o);
        e.closePath();
        e.fill();

        // Focinho determinado
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 2.8 * o, headY - 2.4 * o);
        e.lineTo(headX + 8.5 * o, headY - 1.2 * o);
        e.lineTo(headX + 8.5 * o, headY + 0.8 * o);
        e.lineTo(headX + 3.8 * o, headY + 2.2 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.nose;
        e.beginPath();
        if (typeof e.roundRect === "function") {
          e.roundRect(headX + 8.0 * o, headY - 1.6 * o, 1.8 * o, 1.8 * o, 0.45 * o);
        } else {
          e.rect(headX + 8.0 * o, headY - 1.6 * o, 1.8 * o, 1.8 * o);
        }
        e.fill();

        // Mandíbula
        e.fillStyle = l ? "#ffffff" : pal.chest;
        e.beginPath();
        e.moveTo(headX + 3.8 * o, headY + 1.2 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.0 * o);
        e.lineTo(headX + 7.2 * o, headY + 2.2 * o);
        e.lineTo(headX + 3.5 * o, headY + 2.4 * o);
        e.closePath();
        e.fill();

        // Olho focado e penetrante
        drawLupineEye(e, headX + 3.8 * o, headY - 1.6 * o, o, pal, false);

        if (!l && pal.isSnow) {
          const z = (t.animTimer * 2.8) % Math.PI;
          e.fillStyle = "rgba(224, 242, 254, 0.38)";
          e.beginPath();
          e.arc(headX + 10 * o + Math.cos(z) * 2 * o, headY - 0.5 * o - Math.sin(z) * 1.5 * o, (1.2 + z * 0.8) * o, 0, Math.PI * 2);
          e.fill();
        }

        e.restore();
        return;
      }

      // ==========================================
      // 1. LOBO ABRAÇA O PERSONAGEM E MIRA A BOCA NO PESCOÇO DO PLAYER
      // ==========================================
      if (t.wolfAttackState === "arm_hold") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const thrash = Math.sin((t.wolfAttackTimer || 0) * 26) * 1.8 * o;
        const gnaw = Math.sin((t.wolfAttackTimer || 0) * 32) * 1.2 * o;
        const tailWag = Math.sin((t.wolfAttackTimer || 0) * 18) * 3.2 * o;

        // Sombra no chão
        e.fillStyle = "rgba(15, 23, 42, 0.4)";
        e.beginPath();
        e.ellipse(-3 * o, 7.5 * o, 8 * o, 2.8 * o, 0, 0, Math.PI * 2);
        e.fill();

        // Pata traseira de trás (sombra)
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-7 * o, 0 * o);
        e.lineTo(-9 * o, 4 * o);
        e.lineTo(-6 * o, 7.5 * o);
        e.lineTo(-3 * o, 7.5 * o);
        e.lineTo(-4 * o, 2 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -5 * o, 5.8 * o, o, pal, true);

        // Cauda espessa balançando atrás
        drawLupineBushyTail(e, -8 * o, 0 * o, o, pal, Math.PI * 0.82, tailWag * 0.08, 1.15);

        // Tronco empinado verticalmente abraçando o jogador
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-8 * o, 0 * o);
        e.quadraticCurveTo(-7 * o, -8 * o, -2 * o, -16 * o);
        e.lineTo(4.5 * o, -16 * o);
        e.quadraticCurveTo(8 * o, -8 * o, 1 * o, 3 * o);
        e.lineTo(-5 * o, 3 * o);
        e.closePath();
        e.fill();

        // Manto dorsal escuro ao longo da espinha dorsal arqueada
        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-8 * o, 0 * o);
          e.quadraticCurveTo(-7 * o, -8 * o, -2 * o, -16 * o);
          e.lineTo(0.5 * o, -16 * o);
          e.quadraticCurveTo(-4 * o, -8 * o, -5 * o, 2 * o);
          e.closePath();
          e.fill();
        }

        // Peito claro com mechas de pelos
        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(-0.5 * o, -15 * o);
          e.quadraticCurveTo(5.5 * o, -11 * o, 4.5 * o, -3 * o);
          e.quadraticCurveTo(0.5 * o, -4 * o, -1.5 * o, -8 * o);
          e.closePath();
          e.fill();

          e.fillStyle = pal.light;
          e.beginPath();
          e.moveTo(1 * o, -14 * o);
          e.lineTo(5.5 * o, -12 * o);
          e.lineTo(3.5 * o, -9 * o);
          e.lineTo(6.5 * o, -6 * o);
          e.lineTo(3 * o, -4 * o);
          e.closePath();
          e.fill();
        }

        // Pata traseira da frente
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-4 * o, 1 * o);
        e.lineTo(-7 * o, 4.5 * o);
        e.lineTo(-4 * o, 7.8 * o);
        e.lineTo(-1 * o, 7.8 * o);
        e.lineTo(-1.5 * o, 2 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -3 * o, 6.2 * o, o, pal, false);

        // Membro dianteiro traseiro
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(1 * o, -13 * o);
        e.lineTo(8.5 * o, -11.5 * o);
        e.lineTo(11.2 * o, -9.0 * o);
        e.lineTo(8.5 * o, -7.5 * o);
        e.lineTo(0.5 * o, -10.0 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 8.8 * o, -10.8 * o, o, pal, true);

        // Cabeça e boca miradas diretamente no pescoço
        const neckTargetX = 9.8 * o;
        const neckTargetY = -16.2 * o;
        const headBaseX = 3.8 * o + thrash;
        const headBaseY = -15.4 * o + gnaw;

        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(0 * o, -13 * o);
        e.lineTo(headBaseX - 0.5 * o, headBaseY - 1.5 * o);
        e.lineTo(headBaseX + 3.2 * o, headBaseY + 2.5 * o);
        e.lineTo(2.5 * o, -10 * o);
        e.closePath();
        e.fill();

        e.beginPath();
        e.ellipse(headBaseX + 0.8 * o, headBaseY - 1.0 * o, 4.5 * o, 3.8 * o, 0.15, 0, Math.PI * 2);
        e.fill();

        // Bochechas pontiagudas
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headBaseX - 1.5 * o, headBaseY + 1 * o);
        e.lineTo(headBaseX - 4.5 * o, headBaseY + 2.8 * o);
        e.lineTo(headBaseX - 1 * o, headBaseY + 3.2 * o);
        e.lineTo(headBaseX - 3.8 * o, headBaseY + 5 * o);
        e.lineTo(headBaseX + 1 * o, headBaseY + 4 * o);
        e.closePath();
        e.fill();

        // Focinho e Mandíbula Superior
        e.beginPath();
        e.moveTo(headBaseX + 1.5 * o, headBaseY - 2.5 * o);
        e.lineTo(neckTargetX + 0.8 * o, neckTargetY - 1.4 * o);
        e.lineTo(neckTargetX + 0.3 * o, neckTargetY - 0.2 * o);
        e.lineTo(headBaseX + 2.4 * o, headBaseY + 0.8 * o);
        e.closePath();
        e.fill();

        // Trufa do nariz
        e.fillStyle = pal.nose;
        e.beginPath();
        e.roundRect(neckTargetX - 0.2 * o, neckTargetY - 2.2 * o, 1.8 * o, 1.7 * o, 0.45 * o);
        e.fill();

        // Mandíbula Inferior
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headBaseX + 1.8 * o, headBaseY + 1.4 * o);
        e.lineTo(neckTargetX - 0.2 * o, neckTargetY + 0.5 * o);
        e.lineTo(neckTargetX - 0.6 * o, neckTargetY + 2.0 * o);
        e.lineTo(headBaseX + 1.2 * o, headBaseY + 3.0 * o);
        e.closePath();
        e.fill();

        // Presas superiores e inferiores
        e.fillStyle = pal.fangs;
        e.beginPath();
        e.moveTo(neckTargetX - 1.4 * o, neckTargetY - 0.5 * o);
        e.lineTo(neckTargetX - 0.7 * o, neckTargetY + 1.3 * o);
        e.lineTo(neckTargetX - 0.1 * o, neckTargetY - 0.5 * o);
        e.closePath();
        e.fill();
        e.beginPath();
        e.moveTo(neckTargetX - 2.2 * o, neckTargetY + 1.1 * o);
        e.lineTo(neckTargetX - 1.5 * o, neckTargetY - 0.7 * o);
        e.lineTo(neckTargetX - 0.9 * o, neckTargetY + 1.1 * o);
        e.closePath();
        e.fill();

        if (!l) {
          e.fillStyle = "#ef4444";
          e.beginPath();
          e.arc(neckTargetX - 0.6 * o, neckTargetY + 0.3 * o, 1.3 * o, 0, Math.PI * 2);
          e.arc(neckTargetX + 0.2 * o, neckTargetY + 1.6 * o, 0.85 * o, 0, Math.PI * 2);
          e.arc(neckTargetX - 1.5 * o, neckTargetY + 1.2 * o, 0.75 * o, 0, Math.PI * 2);
          e.fill();
        }

        // Orelhas coladas para trás
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headBaseX - 2 * o, headBaseY - 2.2 * o);
        e.lineTo(headBaseX - 6.5 * o, headBaseY - 5.8 * o);
        e.lineTo(headBaseX - 1 * o, headBaseY - 4.2 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headBaseX - 1 * o, headBaseY - 3.2 * o);
        e.lineTo(headBaseX - 5.5 * o, headBaseY - 7.2 * o);
        e.lineTo(headBaseX + 1 * o, headBaseY - 4.2 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.earInner;
        e.beginPath();
        e.moveTo(headBaseX - 1.2 * o, headBaseY - 3.6 * o);
        e.lineTo(headBaseX - 4.6 * o, headBaseY - 6.4 * o);
        e.lineTo(headBaseX + 0.2 * o, headBaseY - 4.3 * o);
        e.closePath();
        e.fill();

        drawLupineEye(e, headBaseX + 3.6 * o, headBaseY - 1.6 * o, o, pal, true);

        e.restore();
        return;
      }

      // ==========================================
      // 2. LOBO MORDE PERNA E PUXA PARA TRÁS
      // ==========================================
      if (t.wolfAttackState === "leg_pull") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const tugJerks = Math.sin((t.wolfAttackTimer || 0) * 24) * 2.5 * o;

        // Sombra alongada sob o lobo em tração
        e.fillStyle = "rgba(15, 23, 42, 0.4)";
        e.beginPath();
        e.ellipse(-2 * o, 4.5 * o, 13 * o, 3.2 * o, 0, 0, Math.PI * 2);
        e.fill();

        // Patas traseiras fincadas bem para trás no solo com garras cravadas
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-10 * o, -2 * o);
        e.lineTo(-14.5 * o, 4 * o);
        e.lineTo(-10 * o, 4.2 * o);
        e.lineTo(-7 * o, 0 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -13 * o, 2.5 * o, o, pal, true);

        // Cauda espessa esticada tensa
        drawLupineBushyTail(e, -11 * o, -2 * o, o, pal, Math.PI * 1.05, -0.15, 1.25);

        // Corpo esticado baixo rente ao chão, puxando com toda força
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-11 * o, -4 * o);
        e.quadraticCurveTo(-4 * o, -7.5 * o, 3 * o, -5.5 * o);
        e.lineTo(5.5 * o, -1 * o);
        e.quadraticCurveTo(-2 * o, 2 * o, -8.5 * o, 1 * o);
        e.closePath();
        e.fill();

        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-11 * o, -4 * o);
          e.quadraticCurveTo(-4 * o, -7.5 * o, 3 * o, -5.5 * o);
          e.lineTo(2 * o, -3.5 * o);
          e.quadraticCurveTo(-4 * o, -4.5 * o, -9 * o, -2 * o);
          e.closePath();
          e.fill();
        }

        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(0 * o, -4 * o);
          e.quadraticCurveTo(4.5 * o, -2 * o, 3.5 * o, 1 * o);
          e.quadraticCurveTo(-1 * o, 1 * o, -3 * o, -2 * o);
          e.closePath();
          e.fill();
        }

        // Patas dianteiras fincadas no chão resistindo ao puxão
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(1 * o, -2 * o);
        e.lineTo(5 * o, 3 * o);
        e.lineTo(8 * o, 3.5 * o);
        e.lineTo(4 * o, 0 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 6 * o, 2.2 * o, o, pal, false);

        const headX = (6 - Math.abs(tugJerks)) * o;
        const headY = (0 + tugJerks * 0.2) * o;

        // Pescoço esticado
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(2 * o, -5 * o);
        e.lineTo(headX, headY - 3 * o);
        e.lineTo(headX + 2.5 * o, headY + 2 * o);
        e.lineTo(4 * o, -1 * o);
        e.closePath();
        e.fill();

        // Cabeça
        e.beginPath();
        e.ellipse(headX + 1 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.1, 0, Math.PI * 2);
        e.fill();

        // Bochechas
        e.beginPath();
        e.moveTo(headX - 1 * o, headY + 1 * o);
        e.lineTo(headX - 3.5 * o, headY + 3 * o);
        e.lineTo(headX, headY + 3.2 * o);
        e.closePath();
        e.fill();

        // Focinho cravado na perna
        e.beginPath();
        e.moveTo(headX + 2 * o, headY - 2.5 * o);
        e.lineTo(headX + 9.2 * o, headY - 1.5 * o);
        e.lineTo(headX + 8.8 * o, headY + 0.5 * o);
        e.lineTo(headX + 3 * o, headY + 0.8 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.nose;
        e.beginPath();
        e.roundRect(headX + 8.4 * o, headY - 2 * o, 1.8 * o, 1.8 * o, 0.45 * o);
        e.fill();

        // Mandíbula inferior cravada
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headX + 2 * o, headY + 1.2 * o);
        e.lineTo(headX + 8.2 * o, headY + 1.5 * o);
        e.lineTo(headX + 7.8 * o, headY + 3.4 * o);
        e.lineTo(headX + 2 * o, headY + 2.8 * o);
        e.closePath();
        e.fill();

        // Dentes e presas travadas
        e.fillStyle = pal.fangs;
        e.beginPath();
        e.moveTo(headX + 7.0 * o, headY + 0.3 * o);
        e.lineTo(headX + 7.6 * o, headY + 2.4 * o);
        e.lineTo(headX + 8.1 * o, headY + 0.3 * o);
        e.closePath();
        e.fill();

        // Orelhas coladas nas costas
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX - 1 * o, headY - 2 * o);
        e.lineTo(headX - 5.5 * o, headY - 4 * o);
        e.lineTo(headX, headY - 3.8 * o);
        e.closePath();
        e.fill();

        drawLupineEye(e, headX + 3.4 * o, headY - 1.5 * o, o, pal, true);

        e.restore();
        return;
      }

      // ==========================================
      // 3. MORDE, SOLTA E AFASTA PARA AVANÇAR NOVAMENTE
      // ==========================================
      if (t.wolfAttackState === "quick_bite") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const lungeProg = 1 - (t.wolfAttackTimer || 0) / (t.wolfAttackDuration || 0.35);
        const lungeHop = Math.sin(lungeProg * Math.PI) * 3.2 * o;
        const snap = Math.sin(lungeProg * Math.PI);

        // Sombra sob o salto
        e.fillStyle = "rgba(15, 23, 42, 0.28)";
        e.beginPath();
        e.ellipse(2 * o, 3.8 * o, 13 * o, 3.0 * o, 0, 0, Math.PI * 2);
        e.fill();

        // Pata traseira de trás esticada no salto
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-6 * o, -6 * o - lungeHop);
        e.lineTo(-10.5 * o, 0 * o - lungeHop * 0.4);
        e.lineTo(-8.5 * o, 2 * o);
        e.lineTo(-5.5 * o, 2 * o);
        e.lineTo(-4 * o, -6 * o - lungeHop);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -9 * o, 0.8 * o, o, pal, true);

        // Pata dianteira de trás estendida
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(5 * o, -7 * o - lungeHop);
        e.lineTo(7.5 * o, -1 * o - lungeHop * 0.4);
        e.lineTo(8.5 * o, 2 * o);
        e.lineTo(5.5 * o, 2 * o);
        e.lineTo(3 * o, -7 * o - lungeHop);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 7 * o, 0.8 * o, o, pal, true);

        // Cauda espessa voando horizontalmente no bote
        drawLupineBushyTail(e, -9 * o, -8 * o - lungeHop, o, pal, Math.PI * 1.04, -0.15, 1.25);

        // Tronco musculoso no bote
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-9 * o, -10 * o - lungeHop);
        e.quadraticCurveTo(-2 * o, -13.5 * o - lungeHop, 4.5 * o, -12.5 * o - lungeHop);
        e.lineTo(7.5 * o, -10 * o - lungeHop);
        e.quadraticCurveTo(8.5 * o, -4 * o - lungeHop, 4.5 * o, -2 * o - lungeHop);
        e.quadraticCurveTo(-3 * o, -4 * o - lungeHop, -8 * o, -6 * o - lungeHop);
        e.closePath();
        e.fill();

        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-9 * o, -10 * o - lungeHop);
          e.quadraticCurveTo(-2 * o, -13.5 * o - lungeHop, 4.5 * o, -12.5 * o - lungeHop);
          e.lineTo(7.5 * o, -10 * o - lungeHop);
          e.lineTo(4 * o, -9 * o - lungeHop);
          e.quadraticCurveTo(-3 * o, -9 * o - lungeHop, -8.5 * o, -7.5 * o - lungeHop);
          e.closePath();
          e.fill();
        }

        // Peito claro e juba eriçada
        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(2 * o, -9 * o - lungeHop);
          e.quadraticCurveTo(7 * o, -5 * o - lungeHop, 5 * o, -2 * o - lungeHop);
          e.quadraticCurveTo(1 * o, -3 * o - lungeHop, -2 * o, -5 * o - lungeHop);
          e.closePath();
          e.fill();

          e.fillStyle = pal.light;
          e.beginPath();
          e.moveTo(6 * o, -9.5 * o - lungeHop);
          e.lineTo(9.5 * o, -6.5 * o - lungeHop);
          e.lineTo(7.5 * o, -4 * o - lungeHop);
          e.lineTo(10.2 * o, -2 * o - lungeHop);
          e.lineTo(6.5 * o, -1 * o - lungeHop);
          e.closePath();
          e.fill();
        }

        // Pata traseira dianteira
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-5 * o, -10 * o - lungeHop);
        e.quadraticCurveTo(-9.5 * o, -5 * o - lungeHop, -8 * o, 0 * o - lungeHop * 0.4);
        e.lineTo(-6.5 * o, 3 * o);
        e.lineTo(-3.5 * o, 3 * o);
        e.lineTo(-4 * o, 0 * o - lungeHop * 0.4);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -6.5 * o, 1.8 * o, o, pal, false);

        // Pata dianteira dianteira estendida
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(4 * o, -10 * o - lungeHop);
        e.lineTo(8.5 * o, 0 * o - lungeHop * 0.4);
        e.lineTo(9.5 * o, 3 * o);
        e.lineTo(6.5 * o, 3 * o);
        e.lineTo(5.5 * o, 0 * o - lungeHop * 0.4);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 8 * o, 1.8 * o, o, pal, false);

        const headX = (7 + snap * 3.8) * o;
        const headY = (-12 - lungeHop) * o;

        // Pescoço e crânio
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(3 * o, -12 * o - lungeHop);
        e.lineTo(headX + 2.2 * o, headY - 4.2 * o);
        e.lineTo(headX + 5.5 * o, headY);
        e.lineTo(5 * o, -7 * o - lungeHop);
        e.closePath();
        e.fill();

        e.beginPath();
        e.ellipse(headX + 1.6 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.15, 0, Math.PI * 2);
        e.fill();

        // Bochechas
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY + 1 * o);
        e.lineTo(headX - 3.5 * o, headY + 3.5 * o);
        e.lineTo(headX + 0.5 * o, headY + 3.5 * o);
        e.closePath();
        e.fill();

        // Orelhas
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY - 3.5 * o);
        e.lineTo(headX + 0.5 * o, headY - 9 * o);
        e.lineTo(headX + 2.8 * o, headY - 3.8 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 1.2 * o, headY - 3.8 * o);
        e.lineTo(headX + 3.0 * o, headY - 9.8 * o);
        e.lineTo(headX + 5.2 * o, headY - 4 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.earInner;
        e.beginPath();
        e.moveTo(headX + 2.1 * o, headY - 4.4 * o);
        e.lineTo(headX + 3.2 * o, headY - 8.6 * o);
        e.lineTo(headX + 4.4 * o, headY - 4.6 * o);
        e.closePath();
        e.fill();

        // Focinho com boca entreaberta
        const mouthGap = (1 - snap) * 3.0 * o;
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 3 * o, headY - 2.6 * o);
        e.lineTo(headX + 8.8 * o, headY - 1 * o - mouthGap * 0.3);
        e.lineTo(headX + 8.8 * o, headY + 1.2 * o - mouthGap * 0.3);
        e.lineTo(headX + 4 * o, headY + 2.6 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.nose;
        e.beginPath();
        e.roundRect(headX + 8.2 * o, headY - 1.6 * o - mouthGap * 0.3, 1.8 * o, 1.9 * o, 0.45 * o);
        e.fill();

        // Mandíbula inferior
        e.fillStyle = l ? "#ffffff" : pal.chest;
        e.beginPath();
        e.moveTo(headX + 4 * o, headY + 1.5 * o);
        e.lineTo(headX + 8.2 * o, headY + 1.2 * o + mouthGap * 0.7);
        e.lineTo(headX + 7.4 * o, headY + 2.8 * o + mouthGap * 0.7);
        e.lineTo(headX + 3.5 * o, headY + 2.9 * o);
        e.closePath();
        e.fill();

        // Presas superiores e inferiores
        e.fillStyle = pal.fangs;
        e.beginPath();
        e.moveTo(headX + 6.8 * o, headY + 1.2 * o - mouthGap * 0.3);
        e.lineTo(headX + 7.5 * o, headY + 2.8 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.2 * o - mouthGap * 0.3);
        e.closePath();
        e.fill();
        e.beginPath();
        e.moveTo(headX + 6.0 * o, headY + 1.5 * o + mouthGap * 0.7);
        e.lineTo(headX + 6.6 * o, headY + 0.2 * o);
        e.lineTo(headX + 7.2 * o, headY + 1.5 * o + mouthGap * 0.7);
        e.closePath();
        e.fill();

        drawLupineEye(e, headX + 4.2 * o, headY - 1.6 * o, o, pal, false);

        if (!l && pal.isSnow) {
          const z = (t.animTimer * 2.8) % Math.PI;
          e.fillStyle = "rgba(224, 242, 254, 0.38)";
          e.beginPath();
          e.arc(headX + 10.5 * o + Math.cos(z) * 2 * o, headY - 0.5 * o - Math.sin(z) * 1.5 * o, (1.2 + z * 0.8) * o, 0, Math.PI * 2);
          e.fill();
        }

        e.restore();
        return;
      }

      if (t.wolfAttackState === "quick_retreat") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const lowStance = 1.8 * o;

        e.fillStyle = "rgba(15, 23, 42, 0.35)";
        e.beginPath();
        e.ellipse(0, 4.5 * o, 12 * o, 3.5 * o, 0, 0, Math.PI * 2);
        e.fill();

        // Pata traseira de trás amortecendo o recuo
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-6 * o, -6 * o + lowStance);
        e.lineTo(-9.5 * o, -1 * o + lowStance);
        e.lineTo(-8.5 * o, 2 * o);
        e.lineTo(-5 * o, 2 * o);
        e.lineTo(-4 * o, -6 * o + lowStance);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -8 * o, 1.2 * o, o, pal, true);

        // Pata dianteira de trás
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(5 * o, -7 * o + lowStance);
        e.lineTo(4 * o, -1 * o + lowStance);
        e.lineTo(5 * o, 2 * o);
        e.lineTo(2 * o, 2 * o);
        e.lineTo(3 * o, -7 * o + lowStance);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 3.5 * o, 1.2 * o, o, pal, true);

        // Cauda empinada e tensa
        drawLupineBushyTail(e, -9 * o, -8 * o + lowStance, o, pal, Math.PI * 0.98, 0.1, 1.15);

        // Corpo abaixado e recuando firme
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-9 * o, -10 * o + lowStance);
        e.quadraticCurveTo(-2 * o, -13.5 * o + lowStance, 4.5 * o, -12.5 * o + lowStance);
        e.lineTo(7.5 * o, -10 * o + lowStance);
        e.quadraticCurveTo(8.5 * o, -4 * o + lowStance, 4.5 * o, -2 * o + lowStance);
        e.quadraticCurveTo(-3 * o, -4 * o + lowStance, -8 * o, -6 * o + lowStance);
        e.closePath();
        e.fill();

        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-9 * o, -10 * o + lowStance);
          e.quadraticCurveTo(-2 * o, -13.5 * o + lowStance, 4.5 * o, -12.5 * o + lowStance);
          e.lineTo(7.5 * o, -10 * o + lowStance);
          e.lineTo(4 * o, -9 * o + lowStance);
          e.quadraticCurveTo(-3 * o, -9 * o + lowStance, -8.5 * o, -7.5 * o + lowStance);
          e.closePath();
          e.fill();
        }

        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(2 * o, -9 * o + lowStance);
          e.quadraticCurveTo(7 * o, -5 * o + lowStance, 5 * o, -2 * o + lowStance);
          e.quadraticCurveTo(1 * o, -3 * o + lowStance, -2 * o, -5 * o + lowStance);
          e.closePath();
          e.fill();

          e.fillStyle = pal.light;
          e.beginPath();
          e.moveTo(6 * o, -9.5 * o + lowStance);
          e.lineTo(9.5 * o, -6.5 * o + lowStance);
          e.lineTo(7.5 * o, -4 * o + lowStance);
          e.lineTo(10.2 * o, -2 * o + lowStance);
          e.lineTo(6.5 * o, -1 * o + lowStance);
          e.closePath();
          e.fill();
        }

        // Pata traseira dianteira
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-5 * o, -10 * o + lowStance);
        e.quadraticCurveTo(-9.5 * o, -5 * o + lowStance, -7 * o, 0 * o + lowStance);
        e.lineTo(-5.5 * o, 3 * o);
        e.lineTo(-2.5 * o, 3 * o);
        e.lineTo(-3.5 * o, 0 * o + lowStance);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -5 * o, 1.8 * o, o, pal, false);

        // Pata dianteira dianteira
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(4 * o, -10 * o + lowStance);
        e.lineTo(5.5 * o, 0 * o + lowStance);
        e.lineTo(6 * o, 3 * o);
        e.lineTo(3 * o, 3 * o);
        e.lineTo(2 * o, 0 * o + lowStance);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 4.5 * o, 1.8 * o, o, pal, false);

        const headX = 6.8 * o;
        const headY = -12 * o + lowStance;

        // Cabeça baixa com rosnado
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(3 * o, -12 * o + lowStance);
        e.lineTo(headX + 2.2 * o, headY - 4 * o);
        e.lineTo(headX + 5.5 * o, headY);
        e.lineTo(5 * o, -7 * o + lowStance);
        e.closePath();
        e.fill();

        e.beginPath();
        e.ellipse(headX + 1.6 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.15, 0, Math.PI * 2);
        e.fill();

        // Bochechas
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY + 1 * o);
        e.lineTo(headX - 3.5 * o, headY + 3.5 * o);
        e.lineTo(headX + 0.5 * o, headY + 3.5 * o);
        e.closePath();
        e.fill();

        // Orelhas alertas
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY - 3.5 * o);
        e.lineTo(headX + 0.3 * o, headY - 8.8 * o);
        e.lineTo(headX + 2.5 * o, headY - 3.8 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 1.0 * o, headY - 3.8 * o);
        e.lineTo(headX + 2.4 * o, headY - 9.4 * o);
        e.lineTo(headX + 4.8 * o, headY - 4 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.earInner;
        e.beginPath();
        e.moveTo(headX + 1.8 * o, headY - 4.4 * o);
        e.lineTo(headX + 2.7 * o, headY - 8.2 * o);
        e.lineTo(headX + 4.0 * o, headY - 4.6 * o);
        e.closePath();
        e.fill();

        // Focinho rosnando
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 3 * o, headY - 2.6 * o);
        e.lineTo(headX + 8.8 * o, headY - 1 * o);
        e.lineTo(headX + 8.8 * o, headY + 1.2 * o);
        e.lineTo(headX + 4 * o, headY + 2.6 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.nose;
        e.beginPath();
        e.roundRect(headX + 8.2 * o, headY - 1.6 * o, 1.8 * o, 1.9 * o, 0.45 * o);
        e.fill();

        e.fillStyle = l ? "#ffffff" : pal.chest;
        e.beginPath();
        e.moveTo(headX + 4 * o, headY + 1.5 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.2 * o);
        e.lineTo(headX + 7.2 * o, headY + 2.6 * o);
        e.lineTo(headX + 3.5 * o, headY + 2.9 * o);
        e.closePath();
        e.fill();

        // Presas expostas
        e.fillStyle = pal.fangs;
        e.beginPath();
        e.moveTo(headX + 6.8 * o, headY + 1.2 * o);
        e.lineTo(headX + 7.5 * o, headY + 2.8 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.2 * o);
        e.closePath();
        e.fill();

        drawLupineEye(e, headX + 4.2 * o, headY - 1.6 * o, o, pal, false);

        if (!l && pal.isSnow) {
          const z = (t.animTimer * 2.8) % Math.PI;
          e.fillStyle = "rgba(224, 242, 254, 0.38)";
          e.beginPath();
          e.arc(headX + 10.5 * o + Math.cos(z) * 2 * o, headY - 0.5 * o - Math.sin(z) * 1.5 * o, (1.2 + z * 0.8) * o, 0, Math.PI * 2);
          e.fill();
        }

        e.restore();
        return;
      }

      if (t.wolfAttackState === "advance_again") {
        e.save();
        const u = t.facing === "left" ? -1 : 1;
        e.scale(u, 1);
        const advProg = 1 - (t.wolfAttackTimer || 0) / (t.wolfAttackDuration || 0.45);
        const sprintHop = Math.sin(advProg * Math.PI * 2) * 2.0 * o;
        const legSwing = Math.sin(advProg * Math.PI * 2) * 3.8 * o;

        e.fillStyle = "rgba(15, 23, 42, 0.35)";
        e.beginPath();
        e.ellipse(0, 4.5 * o, 13 * o, 3.5 * o, 0, 0, Math.PI * 2);
        e.fill();

        // Patas do fundo em galope
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(-6 * o, -6 * o + sprintHop);
        e.lineTo(-8 * o - legSwing, -1 * o + sprintHop);
        e.lineTo(-6.5 * o - legSwing, 2 * o);
        e.lineTo(-3.5 * o - legSwing, 2 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -6 * o - legSwing, 1.2 * o, o, pal, true);

        e.beginPath();
        e.moveTo(5 * o, -7 * o + sprintHop);
        e.lineTo(6 * o + legSwing, -1 * o + sprintHop);
        e.lineTo(7.5 * o + legSwing, 2 * o);
        e.lineTo(4.5 * o + legSwing, 2 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 5.5 * o + legSwing, 1.2 * o, o, pal, true);

        // Cauda empinada e esvoaçante
        drawLupineBushyTail(e, -9 * o, -8 * o + sprintHop, o, pal, Math.PI * 1.05, -0.25, 1.25);

        // Tronco em arrancada veloz
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-9 * o, -10 * o + sprintHop);
        e.quadraticCurveTo(-2 * o, -13.5 * o + sprintHop, 4.5 * o, -12.5 * o + sprintHop);
        e.lineTo(7.5 * o, -10 * o + sprintHop);
        e.quadraticCurveTo(8.5 * o, -4 * o + sprintHop, 4.5 * o, -2 * o + sprintHop);
        e.quadraticCurveTo(-3 * o, -4 * o + sprintHop, -8 * o, -6 * o + sprintHop);
        e.closePath();
        e.fill();

        if (pal.dorsal !== pal.base) {
          e.fillStyle = pal.dorsal;
          e.beginPath();
          e.moveTo(-9 * o, -10 * o + sprintHop);
          e.quadraticCurveTo(-2 * o, -13.5 * o + sprintHop, 4.5 * o, -12.5 * o + sprintHop);
          e.lineTo(7.5 * o, -10 * o + sprintHop);
          e.lineTo(4 * o, -9 * o + sprintHop);
          e.quadraticCurveTo(-3 * o, -9 * o + sprintHop, -8.5 * o, -7.5 * o + sprintHop);
          e.closePath();
          e.fill();
        }

        if (!l) {
          e.fillStyle = pal.chest;
          e.beginPath();
          e.moveTo(2 * o, -9 * o + sprintHop);
          e.quadraticCurveTo(7 * o, -5 * o + sprintHop, 5 * o, -2 * o + sprintHop);
          e.quadraticCurveTo(1 * o, -3 * o + sprintHop, -2 * o, -5 * o + sprintHop);
          e.closePath();
          e.fill();

          e.fillStyle = pal.light;
          e.beginPath();
          e.moveTo(6 * o, -9.5 * o + sprintHop);
          e.lineTo(9.5 * o, -6.5 * o + sprintHop);
          e.lineTo(7.5 * o, -4 * o + sprintHop);
          e.lineTo(10.2 * o, -2 * o + sprintHop);
          e.lineTo(6.5 * o, -1 * o + sprintHop);
          e.closePath();
          e.fill();
        }

        // Patas do primeiro plano
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(-5 * o, -10 * o + sprintHop);
        e.quadraticCurveTo(-9.5 * o, -5 * o + sprintHop, -7 * o - legSwing * 0.7, 0 * o + sprintHop);
        e.lineTo(-5.5 * o - legSwing * 0.7, 3 * o);
        e.lineTo(-2.5 * o - legSwing * 0.7, 3 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, -5 * o - legSwing * 0.7, 1.8 * o, o, pal, false);

        e.beginPath();
        e.moveTo(4 * o, -10 * o + sprintHop);
        e.lineTo(6.5 * o + legSwing * 0.7, 0 * o + sprintHop);
        e.lineTo(7.5 * o + legSwing * 0.7, 3 * o);
        e.lineTo(4.5 * o + legSwing * 0.7, 3 * o);
        e.closePath();
        e.fill();
        drawLupinePaw(e, 5.5 * o + legSwing * 0.7, 1.8 * o, o, pal, false);

        const headX = (7.5 + Math.sin(advProg * Math.PI) * 1.5) * o;
        const headY = -12 * o + sprintHop;

        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(3 * o, -12 * o + sprintHop);
        e.lineTo(headX + 2.2 * o, headY - 4 * o);
        e.lineTo(headX + 5.5 * o, headY);
        e.lineTo(5 * o, -7 * o + sprintHop);
        e.closePath();
        e.fill();

        e.beginPath();
        e.ellipse(headX + 1.6 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.15, 0, Math.PI * 2);
        e.fill();

        // Bochechas
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY + 1 * o);
        e.lineTo(headX - 3.5 * o, headY + 3.5 * o);
        e.lineTo(headX + 0.5 * o, headY + 3.5 * o);
        e.closePath();
        e.fill();

        // Orelhas
        e.fillStyle = pal.shade;
        e.beginPath();
        e.moveTo(headX - 0.5 * o, headY - 3.5 * o);
        e.lineTo(headX + 0.5 * o, headY - 9 * o);
        e.lineTo(headX + 2.8 * o, headY - 3.8 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 1.2 * o, headY - 3.8 * o);
        e.lineTo(headX + 3.0 * o, headY - 9.8 * o);
        e.lineTo(headX + 5.2 * o, headY - 4 * o);
        e.closePath();
        e.fill();
        e.fillStyle = pal.earInner;
        e.beginPath();
        e.moveTo(headX + 2.1 * o, headY - 4.4 * o);
        e.lineTo(headX + 3.2 * o, headY - 8.6 * o);
        e.lineTo(headX + 4.4 * o, headY - 4.6 * o);
        e.closePath();
        e.fill();

        // Focinho
        e.fillStyle = pal.base;
        e.beginPath();
        e.moveTo(headX + 3 * o, headY - 2.6 * o);
        e.lineTo(headX + 8.8 * o, headY - 1 * o);
        e.lineTo(headX + 8.8 * o, headY + 1.2 * o);
        e.lineTo(headX + 4 * o, headY + 2.6 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.nose;
        e.beginPath();
        e.roundRect(headX + 8.2 * o, headY - 1.6 * o, 1.8 * o, 1.9 * o, 0.45 * o);
        e.fill();

        e.fillStyle = l ? "#ffffff" : pal.chest;
        e.beginPath();
        e.moveTo(headX + 4 * o, headY + 1.5 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.2 * o);
        e.lineTo(headX + 7.2 * o, headY + 2.6 * o);
        e.lineTo(headX + 3.5 * o, headY + 2.9 * o);
        e.closePath();
        e.fill();

        e.fillStyle = pal.fangs;
        e.beginPath();
        e.moveTo(headX + 6.8 * o, headY + 1.2 * o);
        e.lineTo(headX + 7.5 * o, headY + 2.8 * o);
        e.lineTo(headX + 8.0 * o, headY + 1.2 * o);
        e.closePath();
        e.fill();

        drawLupineEye(e, headX + 4.2 * o, headY - 1.6 * o, o, pal, false);

        if (!l && pal.isSnow) {
          const z = (t.animTimer * 2.8) % Math.PI;
          e.fillStyle = "rgba(224, 242, 254, 0.38)";
          e.beginPath();
          e.arc(headX + 10.5 * o + Math.cos(z) * 2 * o, headY - 0.5 * o - Math.sin(z) * 1.5 * o, (1.2 + z * 0.8) * o, 0, Math.PI * 2);
          e.fill();
        }

        e.restore();
        return;
      }

      // ==========================================
      // ANIMAÇÃO PADRÃO (ANDANDO, CORRENDO OU PARADO)
      // ==========================================
      e.save();
      const u = t.facing === "left" ? -1 : 1;
      e.scale(u, 1);
      const isMoving = (t.vx * t.vx + t.vy * t.vy) > 0.04;
      const speedMult = isMoving ? 9 : 2.2;
      const animSpeed = t.animTimer * speedMult;

      const breathBounce = isMoving
        ? Math.sin(animSpeed * 2) * 1.5 * o
        : Math.sin(t.animTimer * 2.5) * 0.65 * o;
      const chestExpand = Math.sin(t.animTimer * 2.8) * 0.45 * o;
      const tailWag = isMoving
        ? Math.sin(animSpeed * 1.2) * 2.8 * o
        : Math.sin(t.animTimer * 1.6) * 1.2 * o;

      const legStrideRearNear = isMoving ? Math.sin(animSpeed + Math.PI * 0.7) * 4.6 * o : 0;
      const legStrideRearFar = isMoving ? Math.sin(animSpeed + Math.PI * 1.7) * 4.6 * o : 0;
      const legStrideFrontNear = isMoving ? Math.sin(animSpeed) * 4.6 * o : 0;
      const legStrideFrontFar = isMoving ? Math.sin(animSpeed + Math.PI) * 4.6 * o : 0;

      // Sombra realista no chão projetada sob o lobo
      e.fillStyle = "rgba(15, 23, 42, 0.35)";
      e.beginPath();
      e.ellipse(0, 4.8 * o, (isMoving ? 13 : 11.5) * o, 3.8 * o, 0, 0, Math.PI * 2);
      e.fill();

      // Membros do fundo (pata traseira e dianteira distantes)
      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(-6 * o, -6 * o + breathBounce);
      e.quadraticCurveTo(-9 * o, -2 * o + breathBounce, -8 * o + legStrideRearFar, 1 * o);
      e.lineTo(-5 * o + legStrideRearFar, 2.5 * o);
      e.lineTo(-3.5 * o + legStrideRearFar, 0.5 * o);
      e.lineTo(-4 * o, -6 * o + breathBounce);
      e.closePath();
      e.fill();
      drawLupinePaw(e, -6 * o + legStrideRearFar, 1.2 * o, o, pal, true);

      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(5 * o, -7 * o + breathBounce);
      e.quadraticCurveTo(6 * o + legStrideFrontFar, -2 * o + breathBounce, 6 * o + legStrideFrontFar, 1.5 * o);
      e.lineTo(8 * o + legStrideFrontFar, 2.5 * o);
      e.lineTo(4 * o + legStrideFrontFar, 0.5 * o);
      e.lineTo(3 * o, -7 * o + breathBounce);
      e.closePath();
      e.fill();
      drawLupinePaw(e, 5.5 * o + legStrideFrontFar, 1.2 * o, o, pal, true);

      // Cauda espessa e felpuda (porte altivo e dominante)
      const tailAngle = isMoving ? Math.PI * 1.02 : Math.PI * 1.10;
      drawLupineBushyTail(e, -9 * o, -8 * o + breathBounce, o, pal, tailAngle, tailWag * 0.08, isMoving ? 1.2 : 1.05);

      // Tronco atlético, cintura e peito profundo
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(-9 * o, -10 * o + breathBounce);
      e.quadraticCurveTo(-3 * o, -13.5 * o + breathBounce, 4.5 * o, -12.5 * o + breathBounce);
      e.lineTo(7.5 * o, -10 * o + breathBounce);
      e.quadraticCurveTo(8.5 * o, -4 * o + breathBounce + chestExpand, 4.5 * o, -1.8 * o + breathBounce + chestExpand);
      e.quadraticCurveTo(-2.5 * o, -3.8 * o + breathBounce, -8 * o, -5.5 * o + breathBounce);
      e.closePath();
      e.fill();

      // Manto dorsal escuro ao longo do lombo/espinha
      if (pal.dorsal !== pal.base) {
        e.fillStyle = pal.dorsal;
        e.beginPath();
        e.moveTo(-9 * o, -10 * o + breathBounce);
        e.quadraticCurveTo(-3 * o, -13.5 * o + breathBounce, 4.5 * o, -12.5 * o + breathBounce);
        e.lineTo(7.5 * o, -10 * o + breathBounce);
        e.lineTo(4 * o, -9 * o + breathBounce);
        e.quadraticCurveTo(-3 * o, -9 * o + breathBounce, -8.5 * o, -7.5 * o + breathBounce);
        e.closePath();
        e.fill();
      }

      // Pelagem ventral clara e peitoral
      if (!l) {
        e.fillStyle = pal.chest;
        e.beginPath();
        e.moveTo(2 * o, -9 * o + breathBounce);
        e.quadraticCurveTo(7.5 * o, -5 * o + breathBounce, 5 * o, -1.8 * o + breathBounce + chestExpand);
        e.quadraticCurveTo(1 * o, -2.8 * o + breathBounce, -2 * o, -4.8 * o + breathBounce);
        e.closePath();
        e.fill();

        // Gola/juba de pelos pontiagudos no peito
        e.fillStyle = pal.light;
        e.beginPath();
        e.moveTo(6 * o, -9.5 * o + breathBounce);
        e.lineTo(9.6 * o, -6.5 * o + breathBounce);
        e.lineTo(7.5 * o, -4.2 * o + breathBounce);
        e.lineTo(10.2 * o, -2.2 * o + breathBounce);
        e.lineTo(6.5 * o, -1.0 * o + breathBounce);
        e.closePath();
        e.fill();
      }

      // Pata traseira dianteira
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(-5 * o, -10 * o + breathBounce);
      e.quadraticCurveTo(-9.5 * o, -5 * o + breathBounce, -7.5 * o + legStrideRearNear, 0 * o + breathBounce);
      e.lineTo(-5.5 * o + legStrideRearNear, 3.2 * o);
      e.lineTo(-2.8 * o + legStrideRearNear, 3.2 * o);
      e.lineTo(-3.2 * o + legStrideRearNear, 0 * o + breathBounce);
      e.quadraticCurveTo(-3 * o, -6 * o + breathBounce, -3 * o, -8 * o + breathBounce);
      e.closePath();
      e.fill();
      drawLupinePaw(e, -4.5 * o + legStrideRearNear, 1.8 * o, o, pal, false);

      // Pata dianteira dianteira
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(4 * o, -10 * o + breathBounce);
      e.lineTo(6.5 * o + legStrideFrontNear, 0 * o + breathBounce);
      e.lineTo(7.5 * o + legStrideFrontNear, 3.2 * o);
      e.lineTo(4.2 * o + legStrideFrontNear, 3.2 * o);
      e.lineTo(3.8 * o + legStrideFrontNear, 0 * o + breathBounce);
      e.lineTo(1.5 * o, -8 * o + breathBounce);
      e.closePath();
      e.fill();
      if (!l) {
        e.fillStyle = pal.light;
        e.beginPath();
        e.moveTo(3.5 * o + legStrideFrontNear, -0.5 * o + breathBounce);
        e.lineTo(1.8 * o + legStrideFrontNear, 1.2 * o + breathBounce);
        e.lineTo(3.8 * o + legStrideFrontNear, 1.8 * o + breathBounce);
        e.closePath();
        e.fill();
      }
      drawLupinePaw(e, 5.8 * o + legStrideFrontNear, 1.8 * o, o, pal, false);

      // Cabeça, focinho, bochechas e orelhas
      const headX = 7 * o;
      const headY = -12 * o + breathBounce;

      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(3 * o, -12 * o + breathBounce);
      e.lineTo(headX + 2.2 * o, headY - 4.2 * o);
      e.lineTo(headX + 5.5 * o, headY + 0.5 * o);
      e.lineTo(5 * o, -6.8 * o + breathBounce);
      e.closePath();
      e.fill();

      e.beginPath();
      e.ellipse(headX + 1.6 * o, headY - 1 * o, 4.4 * o, 3.8 * o, 0.15, 0, Math.PI * 2);
      e.fill();

      // Bochechas felpudas pontiagudas
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(headX - 0.5 * o, headY + 1 * o);
      e.lineTo(headX - 3.2 * o, headY + 3.2 * o);
      e.lineTo(headX + 0.5 * o, headY + 3.2 * o);
      e.lineTo(headX - 2.5 * o, headY + 5.5 * o);
      e.lineTo(headX + 2.5 * o, headY + 4.2 * o);
      e.closePath();
      e.fill();

      // Orelha de trás
      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(headX - 0.6 * o, headY - 3.5 * o);
      e.lineTo(headX + 0.5 * o, headY - 9.0 * o);
      e.lineTo(headX + 2.8 * o, headY - 3.8 * o);
      e.closePath();
      e.fill();

      // Orelha da frente
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(headX + 1.2 * o, headY - 3.8 * o);
      e.lineTo(headX + 2.8 * o, headY - 9.8 * o);
      e.lineTo(headX + 5.2 * o, headY - 4 * o);
      e.closePath();
      e.fill();
      if (pal.dorsal !== pal.base) {
        e.strokeStyle = pal.dorsal;
        e.lineWidth = 1.0 * o;
        e.beginPath();
        e.moveTo(headX + 1.2 * o, headY - 3.8 * o);
        e.lineTo(headX + 2.8 * o, headY - 9.8 * o);
        e.lineTo(headX + 5.2 * o, headY - 4 * o);
        e.stroke();
      }
      e.fillStyle = pal.earInner;
      e.beginPath();
      e.moveTo(headX + 2.1 * o, headY - 4.4 * o);
      e.lineTo(headX + 3.1 * o, headY - 8.6 * o);
      e.lineTo(headX + 4.4 * o, headY - 4.6 * o);
      e.closePath();
      e.fill();

      // Focinho lupino
      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(headX + 3 * o, headY - 2.6 * o);
      e.lineTo(headX + 8.8 * o, headY - 1 * o);
      e.lineTo(headX + 8.8 * o, headY + 1.2 * o);
      e.lineTo(headX + 4 * o, headY + 2.6 * o);
      e.closePath();
      e.fill();

      if (pal.dorsal !== pal.base) {
        e.fillStyle = pal.dorsal;
        e.beginPath();
        e.moveTo(headX + 3 * o, headY - 2.6 * o);
        e.lineTo(headX + 8.8 * o, headY - 1 * o);
        e.lineTo(headX + 8.0 * o, headY - 0.2 * o);
        e.lineTo(headX + 3.5 * o, headY - 1.2 * o);
        e.closePath();
        e.fill();
      }

      e.fillStyle = l ? "#ffffff" : pal.chest;
      e.beginPath();
      e.moveTo(headX + 4 * o, headY + 1.5 * o);
      e.lineTo(headX + 8.0 * o, headY + 1.2 * o);
      e.lineTo(headX + 7.2 * o, headY + 2.6 * o);
      e.lineTo(headX + 3.5 * o, headY + 2.9 * o);
      e.closePath();
      e.fill();

      // Trufa canina realista
      e.fillStyle = pal.nose;
      e.beginPath();
      e.roundRect(headX + 8.2 * o, headY - 1.5 * o, 1.8 * o, 1.9 * o, 0.45 * o);
      e.fill();
      if (!l) {
        e.fillStyle = "#020617";
        e.beginPath();
        e.arc(headX + 9.0 * o, headY - 0.4 * o, 0.45 * o, 0, Math.PI * 2);
        e.fill();
      }

      // Presas afiadas
      e.fillStyle = pal.fangs;
      e.beginPath();
      e.moveTo(headX + 6.8 * o, headY + 1.2 * o);
      e.lineTo(headX + 7.4 * o, headY + 2.7 * o);
      e.lineTo(headX + 7.9 * o, headY + 1.2 * o);
      e.closePath();
      e.fill();

      drawLupineEye(e, headX + 4.2 * o, headY - 1.6 * o, o, pal, false);

      // Lobo das Neves: hálito gelado
      if (!l && pal.isSnow) {
        const z = (t.animTimer * 2.6) % Math.PI;
        e.fillStyle = "rgba(224, 242, 254, 0.38)";
        e.beginPath();
        e.arc(headX + 10.5 * o + Math.cos(z) * 2.2 * o, headY - 0.4 * o - Math.sin(z) * 1.6 * o, (1.2 + z * 0.9) * o, 0, Math.PI * 2);
        e.fill();
        e.fillStyle = "rgba(186, 230, 253, 0.22)";
        e.beginPath();
        e.arc(headX + 12.0 * o + Math.cos(z) * 3.0 * o, headY - 0.8 * o - Math.sin(z) * 2.2 * o, (1.6 + z * 1.1) * o, 0, Math.PI * 2);
        e.fill();
      }

      e.restore();
    },
    // Carcaça no chão
    carcass: function (e, t, o, u) {
      const pal = getWolfPalette(t, false);
      e.fillStyle = "rgba(15, 23, 42, " + (0.4 * u) + ")";
      e.beginPath();
      e.ellipse(2 * o, 4.5 * o, 15 * o, 5.2 * o, 0, 0, Math.PI * 2);
      e.fill();

      drawLupineBushyTail(e, -8 * o, 1 * o, o, pal, Math.PI * 0.35, 0, 1.1);

      e.fillStyle = pal.shade;
      e.fillRect(-6 * o, 2 * o, 2.8 * o, 4.5 * o);
      e.fillRect(3.5 * o, 2 * o, 2.8 * o, 4.5 * o);
      drawLupinePaw(e, -5 * o, 4.2 * o, o, pal, true);
      drawLupinePaw(e, 4.5 * o, 4.2 * o, o, pal, true);

      e.fillStyle = pal.base;
      e.beginPath();
      e.ellipse(0, 0, 11.5 * o, 5.8 * o, 0.05, 0, Math.PI * 2);
      e.fill();

      if (pal.dorsal !== pal.base) {
        e.fillStyle = pal.dorsal;
        e.beginPath();
        e.ellipse(-1 * o, -2 * o, 10 * o, 3.2 * o, 0.05, 0, Math.PI * 2);
        e.fill();
      }

      e.fillStyle = pal.chest;
      e.beginPath();
      e.ellipse(2 * o, 1.6 * o, 7 * o, 2.8 * o, 0.05, 0, Math.PI * 2);
      e.fill();

      e.fillStyle = pal.base;
      e.beginPath();
      e.ellipse(8.5 * o, 1 * o, 5.8 * o, 4.2 * o, 0.12, 0, Math.PI * 2);
      e.fill();

      e.beginPath();
      e.moveTo(7 * o, 3 * o);
      e.lineTo(5 * o, 5 * o);
      e.lineTo(8 * o, 4.5 * o);
      e.closePath();
      e.fill();

      e.beginPath();
      e.moveTo(9 * o, -0.5 * o);
      e.lineTo(14.5 * o, 1.5 * o);
      e.lineTo(14 * o, 3.8 * o);
      e.lineTo(8 * o, 3.8 * o);
      e.closePath();
      e.fill();

      e.fillStyle = pal.nose;
      e.beginPath();
      e.roundRect(13.6 * o, 0.8 * o, 1.6 * o, 1.8 * o, 0.4 * o);
      e.fill();

      e.fillStyle = pal.fangs;
      e.beginPath();
      e.moveTo(12.2 * o, 3.6 * o);
      e.lineTo(12.8 * o, 4.8 * o);
      e.lineTo(13.3 * o, 3.6 * o);
      e.closePath();
      e.fill();

      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(6 * o, -2 * o);
      e.lineTo(8.5 * o, -5.5 * o);
      e.lineTo(10.5 * o, -1 * o);
      e.closePath();
      e.fill();
      e.fillStyle = pal.earInner;
      e.beginPath();
      e.moveTo(7 * o, -2 * o);
      e.lineTo(8.5 * o, -4.5 * o);
      e.lineTo(9.8 * o, -1.2 * o);
      e.closePath();
      e.fill();

      e.strokeStyle = "rgba(15, 23, 42, " + u + ")";
      e.lineWidth = 1.4 * o;
      e.beginPath();
      e.moveTo(8.5 * o, -0.5 * o);
      e.lineTo(10.5 * o, 1.5 * o);
      e.moveTo(10.5 * o, -0.5 * o);
      e.lineTo(8.5 * o, 1.5 * o);
      e.stroke();
    },
    // Ícone do lobo (inventário e compêndio)
    icon: function (e, t, l) {
      const pal = getWolfPalette(l, false);
      e.fillStyle = "rgba(15, 23, 42, 0.35)";
      e.beginPath();
      e.ellipse(0, 4.5 * t, 10.5 * t, 3.8 * t, 0, 0, Math.PI * 2);
      e.fill();

      drawLupineBushyTail(e, -5 * t, 0, t, pal, Math.PI * 1.08, 0, 1.1);

      e.fillStyle = pal.shade;
      e.fillRect(-3.5 * t, 1 * t, 2.2 * t, 4 * t);
      e.fillRect(4 * t, 1 * t, 2.2 * t, 4 * t);
      e.fillStyle = pal.base;
      e.fillRect(-5 * t, 1 * t, 2.4 * t, 4.5 * t);
      e.fillRect(2.2 * t, 1 * t, 2.4 * t, 4.5 * t);
      drawLupinePaw(e, -4.2 * t, 3.5 * t, t, pal, false);
      drawLupinePaw(e, 3.0 * t, 3.5 * t, t, pal, false);

      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(-5.5 * t, -1 * t);
      e.quadraticCurveTo(-1 * t, -4.2 * t, 3.5 * t, -3.2 * t);
      e.quadraticCurveTo(5 * t, 0, 2.5 * t, 2.2 * t);
      e.quadraticCurveTo(-1 * t, 1 * t, -5 * t, 1.5 * t);
      e.closePath();
      e.fill();

      if (pal.dorsal !== pal.base) {
        e.fillStyle = pal.dorsal;
        e.beginPath();
        e.moveTo(-5.5 * t, -1 * t);
        e.quadraticCurveTo(-1 * t, -4.2 * t, 3.5 * t, -3.2 * t);
        e.lineTo(1 * t, -2 * t);
        e.quadraticCurveTo(-2 * t, -2.5 * t, -5 * t, 0.5 * t);
        e.closePath();
        e.fill();
      }

      e.fillStyle = pal.chest;
      e.beginPath();
      e.ellipse(1 * t, 0.5 * t, 3.5 * t, 1.8 * t, 0.1, 0, Math.PI * 2);
      e.fill();

      e.fillStyle = pal.light;
      e.beginPath();
      e.moveTo(3 * t, -2.5 * t);
      e.lineTo(5.8 * t, -0.5 * t);
      e.lineTo(4 * t, 0.8 * t);
      e.lineTo(6.0 * t, 1.8 * t);
      e.lineTo(3.2 * t, 2.2 * t);
      e.closePath();
      e.fill();

      e.fillStyle = pal.base;
      e.beginPath();
      e.ellipse(4.5 * t, -2.5 * t, 4.0 * t, 3.4 * t, 0.2, 0, Math.PI * 2);
      e.fill();

      e.beginPath();
      e.moveTo(2.5 * t, -1.0 * t);
      e.lineTo(0.5 * t, 0.5 * t);
      e.lineTo(3.0 * t, 0.5 * t);
      e.lineTo(1.2 * t, 2.0 * t);
      e.lineTo(4.0 * t, 1.5 * t);
      e.closePath();
      e.fill();

      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(2 * t, -4.5 * t);
      e.lineTo(2.5 * t, -8.8 * t);
      e.lineTo(4.2 * t, -4.5 * t);
      e.closePath();
      e.fill();

      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(3.2 * t, -4.5 * t);
      e.lineTo(4.4 * t, -9.4 * t);
      e.lineTo(6.0 * t, -4.5 * t);
      e.closePath();
      e.fill();
      e.fillStyle = pal.earInner;
      e.beginPath();
      e.moveTo(3.8 * t, -5 * t);
      e.lineTo(4.5 * t, -8.2 * t);
      e.lineTo(5.4 * t, -5 * t);
      e.closePath();
      e.fill();

      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(4 * t, -3 * t);
      e.lineTo(8.8 * t, -1.6 * t);
      e.lineTo(8.2 * t, 0.6 * t);
      e.lineTo(4 * t, 0.5 * t);
      e.closePath();
      e.fill();

      e.fillStyle = pal.nose;
      e.beginPath();
      e.roundRect(8.2 * t, -2.0 * t, 1.5 * t, 1.7 * t, 0.4 * t);
      e.fill();

      e.fillStyle = pal.fangs;
      e.beginPath();
      e.moveTo(7.0 * t, 0.2 * t);
      e.lineTo(7.5 * t, 1.5 * t);
      e.lineTo(7.9 * t, 0.2 * t);
      e.closePath();
      e.fill();

      drawLupineEye(e, 5.0 * t, -3.2 * t, t, pal, false);
    },
    // Pata dianteira sobreposta no abraço do ataque
    frontPawOverlay: function (e, t, o, l) {
      if (t.wolfAttackState !== "arm_hold") return;
      e.save();
      const u = t.facing === "left" ? -1 : 1;
      e.scale(u, 1);
      const pal = getWolfPalette(t, l);

      const clawTwitch = Math.sin((t.wolfAttackTimer || 0) * 26) * 0.9 * o;
      const clawTension = Math.sin((t.wolfAttackTimer || 0) * 32) * 0.5 * o;

      e.fillStyle = pal.shade;
      e.beginPath();
      e.moveTo(1.2 * o, -7.0 * o);
      e.quadraticCurveTo(5.0 * o, -6.0 * o, 8.8 * o, -4.0 * o + clawTwitch);
      e.lineTo(11.8 * o + clawTension, -1.8 * o + clawTwitch);
      e.lineTo(8.8 * o, -0.6 * o + clawTwitch);
      e.quadraticCurveTo(4.5 * o, -2.5 * o, 0.8 * o, -4.0 * o);
      e.closePath();
      e.fill();

      e.fillStyle = pal.base;
      e.beginPath();
      e.moveTo(1.6 * o, -8.5 * o);
      e.quadraticCurveTo(5.2 * o, -7.2 * o, 9.2 * o, -5.2 * o + clawTwitch);
      e.lineTo(12.4 * o + clawTension, -2.6 * o + clawTwitch);
      e.lineTo(10.6 * o + clawTension, -1.2 * o + clawTwitch);
      e.quadraticCurveTo(7.8 * o, -2.8 * o + clawTwitch, 1.4 * o, -5.5 * o);
      e.closePath();
      e.fill();

      if (!l) {
        e.fillStyle = pal.light;
        e.beginPath();
        e.moveTo(2.5 * o, -8.0 * o);
        e.quadraticCurveTo(6.0 * o, -6.8 * o, 9.5 * o, -4.8 * o + clawTwitch);
        e.lineTo(8.8 * o, -3.8 * o + clawTwitch);
        e.quadraticCurveTo(5.5 * o, -5.8 * o, 2.2 * o, -6.8 * o);
        e.closePath();
        e.fill();
      }

      e.fillStyle = pal.nose;
      e.beginPath();
      e.ellipse(11.2 * o + clawTension, -2.0 * o + clawTwitch, 2.0 * o, 1.5 * o, 0.25, 0, Math.PI * 2);
      e.fill();

      e.fillStyle = pal.claws;
      const clawsData = [
        [-3.4, -2.6, -2.2],
        [-2.4, -1.6, -1.2],
        [-1.3, -0.6, -0.3],
        [-0.4, 0.3, 0.4]
      ];
      clawsData.forEach(([y1, y2, y3]) => {
        e.beginPath();
        e.moveTo(12.0 * o + clawTension, y1 * o + clawTwitch);
        e.lineTo(14.0 * o + clawTension, y2 * o + clawTwitch);
        e.lineTo(12.2 * o + clawTension, y3 * o + clawTwitch);
        e.closePath();
        e.fill();
      });

      if (!l) {
        e.fillStyle = "#ffffff";
        clawsData.forEach(([, y2]) => {
          e.beginPath();
          e.arc(13.8 * o + clawTension, y2 * o + clawTwitch, 0.5 * o, 0, Math.PI * 2);
          e.fill();
        });
      }

      e.restore();
    },
  },
};

// ==========================================
// LÓGICA DE COMBATE DINÂMICO DO LOBO (3 ATAQUES)
// ==========================================
// Partícula de poeira sutil (redução de 95% na quantidade e tamanho de poeira do lobo)
function spawnSubtleWolfDust(manager, x, y) {
  if (!manager || !manager.slimeParticles) return;
  manager.slimeParticles.push({
    x: x + (Math.random() - 0.5) * 4,
    y: y,
    vx: (Math.random() - 0.5) * 0.9,
    vy: -0.3 - Math.random() * 0.5,
    life: 0.25,
    maxLife: 0.25,
    type: "dust",
    color: "rgba(148, 163, 184, 0.28)",
    size: 1.0,
  });
}

CREATURES.wolf.onAttackPlayer = function (manager, wolf, player, playerDef) {
  if (player.isDead || (player.invulnerableTimer && player.invulnerableTimer > 0)) return;
  const det = manager.getAnimalFireDeterrence(wolf, player);
  if (!det.canAttack) return;

  if (wolf.leavingCombatTimer && wolf.leavingCombatTimer > 0) return;
  // Hierarquia de predadores: se houver criatura mais forte atacando o jogador (ex: Dragão), o lobo não entra na luta e vai embora
  if (manager && typeof manager.getSuperiorPlayerAttacker === "function") {
    const superior = manager.getSuperiorPlayerAttacker(wolf, player);
    if (superior) {
      wolf.attackCooldown = 4.0;
      wolf.aggroTimer = 0;
      wolf.giveUpPursuitTimer = 14.0;
      wolf.leavingCombatTimer = 10.0;
      wolf.fleeFromCombatX = player.x;
      wolf.fleeFromCombatY = player.y;
      const fleeAng = (manager.pickFleeAngle ? manager.pickFleeAngle(wolf, player.x, player.y, 0.016, wolf.speed * 1.45) : Math.atan2(wolf.y - player.y, wolf.x - player.x)) || Math.random() * Math.PI * 2;
      wolf.vx = Math.cos(fleeAng) * (wolf.speed * 1.45);
      wolf.vy = Math.sin(fleeAng) * (wolf.speed * 1.45);
      wolf.facing = manager.getMonsterFacing(wolf.vx, wolf.vy, wolf.facing);
      if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
        const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, wolf.vx * 0.016 * 60, wolf.vy * 0.016 * 60, false);
        wolf.x = _m.x;
        wolf.y = _m.y;
        wolf.isMoving = true;
      }
      return;
    }
  }

  // Alterna dinamicamente entre os 3 ataques:
  // 1 = arm_hold (abraça o player e mira a boca no pescoço)
  // 2 = leg_pull (morde perna e puxa para trás)
  // 3 = quick_bite_retreat (morde, solta e afasta para avançar novamente)
  wolf.inCombatTimer = 4.0;
  if (manager && typeof manager.dismissInferiorAttackers === "function") {
    manager.dismissInferiorAttackers(wolf, player);
  }
  wolf.wolfAttackCombo = ((wolf.wolfAttackCombo || 0) % 3) + 1;
  const attackChoice = wolf.wolfAttackCombo;

  if (attackChoice === 1) {
    // 1. Lobo abraça o player e crava a boca com presas no pescoço
    wolf.wolfAttackState = "arm_hold";
    wolf.wolfAttackDuration = 1.35;
    wolf.wolfAttackTimer = wolf.wolfAttackDuration;
    wolf.wolfDamageTick = 0.45;
    wolf.attackCooldown = 1.6;

    const side = wolf.x < player.x ? -1 : 1;
    wolf.facing = side < 0 ? "right" : "left";
    wolf.x = player.x + side * 10 * (wolf.scale || 1);
    wolf.y = player.y - 2 * (wolf.scale || 1);
    wolf.vx = 0;
    wolf.vy = 0;
    wolf._playerX = player.x;
    wolf._playerY = player.y;

    manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, player.x, player.y - 18);
    // Efeito de sangramento por mordida no pescoço: 2 de dano por segundo durante 3 segundos (3 ticks)
    player.bleedTimer = 3.05;
    player.bleedTickTimer = 1.0;
  } else if (attackChoice === 2) {
    // 2. Lobo morde perna e puxa para trás
    wolf.wolfAttackState = "leg_pull";
    wolf.wolfAttackDuration = 1.25;
    wolf.wolfAttackTimer = wolf.wolfAttackDuration;
    wolf.wolfDamageTick = 0.6;
    wolf.attackCooldown = 1.6;

    const side = wolf.x < player.x ? -1 : 1;
    wolf.facing = side < 0 ? "right" : "left";
    wolf.x = player.x + side * 16 * (wolf.scale || 1);
    wolf.y = player.y + 4 * (wolf.scale || 1);
    wolf.vx = 0;
    wolf.vy = 0;

    manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, wolf.x, wolf.y);
    spawnSubtleWolfDust(manager, wolf.x, wolf.y + 4);
  } else {
    // 3. Morde e solta e afasta para avançar novamente
    wolf.wolfAttackState = "quick_bite";
    wolf.wolfAttackDuration = 0.35;
    wolf.wolfAttackTimer = wolf.wolfAttackDuration;
    wolf.attackCooldown = 1.6;

    // O lobo sempre encara diretamente o jogador no ataque
    wolf.facing = player.x < wolf.x ? "left" : "right";
    const ang = Math.atan2(player.y - wolf.y, player.x - wolf.x);
    wolf.vx = Math.cos(ang) * (wolf.speed * 2.2);
    wolf.vy = Math.sin(ang) * (wolf.speed * 2.2);

    manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, player.x, player.y);
  }
};

CREATURES.wolf.updateAttack = function (manager, wolf, player, dt, playerDef) {
  if (!wolf.wolfAttackState) return false;
  wolf.inCombatTimer = 4.0;
  if (manager && typeof manager.dismissInferiorAttackers === "function") {
    manager.dismissInferiorAttackers(wolf, player);
  }

  // Se o lobo ou player estiverem mortos, encerra o ataque
  if (wolf.hp <= 0 || player.isDead) {
    wolf.wolfAttackState = null;
    return false;
  }

  // 0. Salto de esquiva ágil (dodge_leap): o lobo vira em direção ao local da esquiva e salta dinamicamente
  if (wolf.wolfAttackState === "dodge_leap") {
    const dur = wolf.wolfAttackDuration || 0.38;
    wolf.wolfAttackTimer = Math.max(0, (wolf.wolfAttackTimer || 0) - dt);

    const dodgeAng = wolf.dodgeAngle !== void 0 ? wolf.dodgeAngle : (Math.atan2(wolf.vy, wolf.vx) || 0);
    const speed = wolf.dodgeSpeed || (72 / dur);
    const stepX = Math.cos(dodgeAng) * speed * dt;
    const stepY = Math.sin(dodgeAng) * speed * dt;

    // Mantém-se virado rigorosamente em direção ao local da esquiva durante todo o salto!
    wolf.facing = Math.cos(dodgeAng) < 0 ? "left" : "right";
    wolf.targetAngle = dodgeAng;

    if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
      const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, stepX, stepY, false);
      wolf.x = _m.x;
      wolf.y = _m.y;
    } else {
      wolf.x += stepX;
      wolf.y += stepY;
    }

    wolf.vx = Math.cos(dodgeAng) * speed * 0.4;
    wolf.vy = Math.sin(dodgeAng) * speed * 0.4;
    wolf.isMoving = true;

    // Rastro sutil de poeira levantado durante o voo do salto
    if (Math.random() < dt * 10) {
      spawnSubtleWolfDust(manager, wolf.x + (Math.random() - 0.5) * 6, wolf.y + 3);
    }

    // Aterrissagem suave do salto ao expirar o tempo
    if (wolf.wolfAttackTimer <= 0) {
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 0.55;
      for (let i = 0; i < 3; i++) {
        spawnSubtleWolfDust(manager, wolf.x + (Math.random() - 0.5) * 8, wolf.y + 4);
      }
    }
    return true;
  }

  // Hierarquia de predadores: se um predador mais forte (ex: Dragão) chegar atacando o player, o lobo desiste do ataque e vai embora!
  if (manager && typeof manager.getSuperiorPlayerAttacker === "function") {
    const superior = manager.getSuperiorPlayerAttacker(wolf, player);
    if (superior) {
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 4.0;
      wolf.aggroTimer = 0;
      wolf.giveUpPursuitTimer = 14.0;
      wolf.leavingCombatTimer = 10.0;
      wolf.fleeFromCombatX = player.x;
      wolf.fleeFromCombatY = player.y;
      const fleeAng = (manager.pickFleeAngle ? manager.pickFleeAngle(wolf, player.x, player.y, dt, wolf.speed * 1.45) : Math.atan2(wolf.y - player.y, wolf.x - player.x)) || Math.random() * Math.PI * 2;
      wolf.vx = Math.cos(fleeAng) * (wolf.speed * 1.45);
      wolf.vy = Math.sin(fleeAng) * (wolf.speed * 1.45);
      wolf.facing = manager.getMonsterFacing(wolf.vx, wolf.vy, wolf.facing);
      if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
        const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, wolf.vx * dt * 60, wolf.vy * dt * 60, false);
        wolf.x = _m.x;
        wolf.y = _m.y;
        wolf.isMoving = true;
      }
      return false;
    }
  }

  // Fogo e tocha intimidam o lobo
  const det = manager.getAnimalFireDeterrence(wolf, player);
  if (det.isDeterred) {
    wolf.wolfAttackState = null;
    wolf.attackCooldown = 2.5;
    return false;
  }

  wolf.wolfAttackTimer = Math.max(0, (wolf.wolfAttackTimer || 0) - dt);

  // 1. Lobo abraça o player e crava a boca no pescoço
  if (wolf.wolfAttackState === "arm_hold") {
    const side = wolf.facing === "left" ? 10 : -10;
    wolf.x = player.x + side * (wolf.scale || 1);
    wolf.y = player.y - 2 * (wolf.scale || 1);
    wolf.vx = 0;
    wolf.vy = 0;
    wolf._playerX = player.x;
    wolf._playerY = player.y;

    // Reduz movimentação do jogador pelo peso do lobo agarrado
    if (player.isMoving) {
      player.x += (Math.random() - 0.5) * 4 * dt;
      player.y += (Math.random() - 0.5) * 4 * dt;
    }

    // Dentadas periódicas enquanto crava as presas no pescoço do jogador
    wolf.wolfDamageTick = (wolf.wolfDamageTick || 0) - dt;
    if (wolf.wolfDamageTick <= 0) {
      wolf.wolfDamageTick = 0.5;
      manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, player.x, player.y - 18);
      // Renova o sangramento a cada dentada profunda no pescoço
      player.bleedTimer = 3.05;
      player.bleedTickTimer = 1.0;
    }

    if (wolf.wolfAttackTimer <= 0) {
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 1.0;
      const jumpAng = Math.atan2(wolf.y - player.y, wolf.x - player.x) || (wolf.facing === "right" ? Math.PI : 0);
      wolf.vx = Math.cos(jumpAng) * (wolf.speed * 1.5);
      wolf.vy = Math.sin(jumpAng) * (wolf.speed * 1.5);
    }
    return true;
  }

  // 2. Morde a perna e puxa o player para trás
  if (wolf.wolfAttackState === "leg_pull") {
    const pullDirX = wolf.x - player.x;
    const pullDirY = wolf.y - player.y;
    const pullDist = Math.hypot(pullDirX, pullDirY) || 1;
    const ndx = pullDirX / pullDist;
    const ndy = pullDirY / pullDist;

    // Puxa o jogador fisicamente para trás
    const pullSpeed = 44;
    player.x += ndx * pullSpeed * dt;
    player.y += ndy * pullSpeed * dt;

    // Mantém o lobo travado na perna recuando e puxando
    wolf.x = player.x + ndx * 16 * (wolf.scale || 1);
    wolf.y = player.y + ndy * 16 * (wolf.scale || 1);
    wolf.facing = ndx < 0 ? "right" : "left";

    // Poeira reduzida em 95%: apenas 1 partícula sutil ocasionalmente
    if (Math.random() < dt * 0.35) {
      spawnSubtleWolfDust(manager, wolf.x, wolf.y + 4);
    }

    // Mordida secundária durante o puxão
    wolf.wolfDamageTick = (wolf.wolfDamageTick || 0) - dt;
    if (wolf.wolfDamageTick <= 0) {
      wolf.wolfDamageTick = 0.6;
      manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, player.x, player.y + 8);
    }

    if (wolf.wolfAttackTimer <= 0) {
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 0.95;
    }
    return true;
  }

  // 3. Morde e solta
  if (wolf.wolfAttackState === "quick_bite") {
    wolf.facing = player.x < wolf.x ? "left" : "right";
    if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
      const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, (wolf.vx || 0) * dt * 45, (wolf.vy || 0) * dt * 45, false);
      wolf.x = _m.x;
      wolf.y = _m.y;
      wolf.isMoving = true;
    }
    if (wolf.wolfAttackTimer <= 0) {
      // Afasta rapidamente para trás mantendo olhar fixo no jogador
      wolf.wolfAttackState = "quick_retreat";
      wolf.wolfAttackDuration = 0.48;
      wolf.wolfAttackTimer = wolf.wolfAttackDuration;
      const retreatAng = Math.atan2(wolf.y - player.y, wolf.x - player.x) || (player.x < wolf.x ? 0 : Math.PI);
      wolf.retreatVx = Math.cos(retreatAng) * (wolf.speed * 2.5);
      wolf.retreatVy = Math.sin(retreatAng) * (wolf.speed * 2.5);
      wolf.facing = player.x < wolf.x ? "left" : "right";
    }
    return true;
  }

  // 3b. Afasta-se rapidamente mantendo postura defensiva focada no player
  if (wolf.wolfAttackState === "quick_retreat") {
    wolf.vx = wolf.retreatVx || 0;
    wolf.vy = wolf.retreatVy || 0;
    // Sempre encarar o jogador no recuo para não inverter o sprite
    wolf.facing = player.x < wolf.x ? "left" : "right";

    if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
      const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, wolf.vx * dt * 50, wolf.vy * dt * 50, false);
      wolf.x = _m.x;
      wolf.y = _m.y;
      wolf.isMoving = true;
    } else {
      wolf.x += wolf.vx * dt * 50;
      wolf.y += wolf.vy * dt * 50;
    }

    // Poeira sutil de frenagem
    if (Math.random() < dt * 0.3) {
      spawnSubtleWolfDust(manager, wolf.x, wolf.y + 3);
    }

    if (wolf.wolfAttackTimer <= 0) {
      // Avança novamente para o segundo bote!
      wolf.wolfAttackState = "advance_again";
      wolf.wolfAttackDuration = 0.45;
      wolf.wolfAttackTimer = wolf.wolfAttackDuration;
    }
    return true;
  }

  // 3c. Avança novamente com bote
  if (wolf.wolfAttackState === "advance_again") {
    const advanceAng = Math.atan2(player.y - wolf.y, player.x - wolf.x);
    const advSpeed = wolf.speed * 2.2;
    wolf.vx = Math.cos(advanceAng) * advSpeed;
    wolf.vy = Math.sin(advanceAng) * advSpeed;
    wolf.facing = player.x < wolf.x ? "left" : "right";

    if (manager.engine && typeof manager.engine.moveWithSlide === "function") {
      const _m = manager.engine.moveWithSlide(wolf.x, wolf.y, wolf.vx * dt * 50, wolf.vy * dt * 50, false);
      wolf.x = _m.x;
      wolf.y = _m.y;
      wolf.isMoving = true;
    } else {
      wolf.x += wolf.vx * dt * 50;
      wolf.y += wolf.vy * dt * 50;
    }

    const distToPlayer = Math.hypot(player.x - wolf.x, player.y - wolf.y);
    if (distToPlayer <= 26) {
      manager.applyMonsterHitToPlayer(wolf, player, playerDef, false, player.x, player.y);
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 0.9;
    } else if (wolf.wolfAttackTimer <= 0) {
      wolf.wolfAttackState = null;
      wolf.attackCooldown = 0.8;
    }
    return true;
  }

  return false;
};
