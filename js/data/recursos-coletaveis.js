/* js/data/recursos-coletaveis.js
 * Definicoes de recursos coletaveis do mundo (Xu, Fu, Hu, Wu, Ku, ag).
 * Trecho de legacy/app.original.js (linhas 18019-18290); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const Xu = {
      id: "item_galho",
      name: "Galho de Madeira",
      difficulty: "facil",
      difficultyLabel: RESOURCE_DIFFICULTY.facil.label,
      rarity: "comum",
      description:
        "Galho rígido de madeira colhido sob as copas das árvores. Pode ser empunhado na mão direita como arma de combate (+5 de Ataque) ou usado para manufaturar tochas e ferramentas.",
      whereFound:
        "Próximo a árvores (florestas, bosques e bosques de pinheiros)",
      categoryType: "equipment",
      icon: "🪵",
      color: "#a16207",
      value: 2,
      stackSize: 99,
      canSpawnAt: (e) =>
        !e.hasNearbyTree || e.tile.biome.hasWater
          ? !1
          : e.hash < (RESOURCE_DIFFICULTY.facil.spawnChance / 3),
      render: (e, t, l, o, u) => {
        (e.save(),
          e.translate(t, l),
          (e.fillStyle = "rgba(0, 0, 0, 0.25)"),
          e.beginPath(),
          e.ellipse(0, 3, 7 * o, 3 * o, 0.2, 0, Math.PI * 2),
          e.fill());
        const m = -0.35 + Math.sin(u * 1.5 + t) * 0.04;
        (e.rotate(m),
          (e.strokeStyle = "#5c3a21"),
          (e.lineWidth = 3.5 * o),
          (e.lineCap = "round"),
          e.beginPath(),
          e.moveTo(-9 * o, 2 * o),
          e.quadraticCurveTo(-2 * o, -1 * o, 9 * o, -2 * o),
          e.stroke(),
          (e.strokeStyle = "#854d0e"),
          (e.lineWidth = 2 * o),
          e.beginPath(),
          e.moveTo(-8 * o, 2 * o),
          e.quadraticCurveTo(-2 * o, -1 * o, 8 * o, -2 * o),
          e.stroke(),
          (e.strokeStyle = "#713f12"),
          (e.lineWidth = 1.8 * o),
          e.beginPath(),
          e.moveTo(1 * o, -1 * o),
          e.lineTo(5 * o, -6 * o),
          e.stroke(),
          (e.fillStyle = "#65a30d"),
          e.beginPath(),
          e.ellipse(5 * o, -6 * o, 2 * o, 1.2 * o, 0.4, 0, Math.PI * 2),
          e.fill(),
          e.restore());
      },
    },
    Fu = {
      id: "item_pedreneira",
      name: "Pederneira",
      difficulty: "media",
      difficultyLabel: RESOURCE_DIFFICULTY.media.label,
      rarity: "incomum",
      description:
        "Fragmento de sílex mineral escuro com bordas vítreas afiadas. Ao ser golpeada contra ferro ou pirita, gera faíscas incandescentes ideais para acender fogueiras e tochas.",
      whereFound:
        "Onde tem cascalho (depósitos fluviais, praias de pedras e cavernas rochosas)",
      categoryType: "material",
      icon: "🪨",
      color: "#38bdf8",
      value: 8,
      stackSize: 99,
      canSpawnAt: (e) =>
        !e.isGravel || e.tile.biome.hasWater
          ? !1
          : e.hash < (RESOURCE_DIFFICULTY.media.spawnChance / 3),
      render: (e, t, l, o, u) => {
        (e.save(),
          e.translate(t, l),
          (e.fillStyle = "rgba(0, 0, 0, 0.35)"),
          e.beginPath(),
          e.ellipse(0, 4, 6 * o, 3 * o, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#1e293b"),
          (e.strokeStyle = "#0f172a"),
          (e.lineWidth = 1.5 * o),
          e.beginPath(),
          e.moveTo(-5 * o, 2 * o),
          e.lineTo(-7 * o, -2 * o),
          e.lineTo(-2 * o, -7 * o),
          e.lineTo(5 * o, -5 * o),
          e.lineTo(7 * o, 1 * o),
          e.lineTo(2 * o, 4 * o),
          e.closePath(),
          e.fill(),
          e.stroke(),
          (e.fillStyle = "#334155"),
          e.beginPath(),
          e.moveTo(-2 * o, -7 * o),
          e.lineTo(0, -1 * o),
          e.lineTo(-5 * o, 2 * o),
          e.lineTo(-7 * o, -2 * o),
          e.closePath(),
          e.fill(),
          (e.fillStyle = "#475569"),
          e.beginPath(),
          e.moveTo(-2 * o, -7 * o),
          e.lineTo(5 * o, -5 * o),
          e.lineTo(1 * o, 0),
          e.closePath(),
          e.fill(),
          (e.strokeStyle = "#94a3b8"),
          (e.lineWidth = 1 * o),
          e.beginPath(),
          e.moveTo(-2 * o, -7 * o),
          e.lineTo(5 * o, -5 * o),
          e.stroke());
        const m = Math.sin(u * 4 + t * 0.5);
        if (m > 0.82) {
          const c = (m - 0.82) / 0.18;
          ((e.fillStyle = `rgba(56, 189, 248, ${c * 0.9})`),
            e.beginPath(),
            e.arc(0, -3 * o, 2 * o, 0, Math.PI * 2),
            e.fill(),
            (e.strokeStyle = `rgba(224, 242, 254, ${c})`),
            (e.lineWidth = 1.2 * o),
            e.beginPath(),
            e.moveTo(-3 * o, -3 * o),
            e.lineTo(3 * o, -3 * o),
            e.moveTo(0, -6 * o),
            e.lineTo(0, 0),
            e.stroke());
        }
        e.restore();
      },
    },
    Hu = {
      id: "item_seixo",
      name: "Seixo de Pedra",
      difficulty: "facil",
      difficultyLabel: RESOURCE_DIFFICULTY.facil.label,
      rarity: "comum",
      description:
        "Pedra de rio polida e arredondada pelo atrito natural. Material elementar para peso, atiradeiras e suporte rústico.",
      whereFound:
        "Próximo a rochedos, leitos pedregosos e encostas montanhosas",
      categoryType: "material",
      icon: "⚪",
      color: "#94a3b8",
      value: 1,
      stackSize: 99,
      canSpawnAt: (e) =>
        (!e.isGravel && e.tile.biome.category !== "mountain" && !e.isShore) || e.tile.biome.hasWater
          ? !1
          : e.hash < (RESOURCE_DIFFICULTY.facil.spawnChance / 3),
      render: (e, t, l, o) => {
        (e.save(),
          e.translate(t, l),
          (e.fillStyle = "rgba(0, 0, 0, 0.3)"),
          e.beginPath(),
          e.ellipse(0, 3, 5 * o, 2.5 * o, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#64748b"),
          (e.strokeStyle = "#475569"),
          (e.lineWidth = 1.2 * o),
          e.beginPath(),
          e.ellipse(0, 0, 5 * o, 3.5 * o, -0.15, 0, Math.PI * 2),
          e.fill(),
          e.stroke(),
          (e.fillStyle = "#94a3b8"),
          e.beginPath(),
          e.ellipse(-1.5 * o, -1.2 * o, 3 * o, 1.6 * o, -0.2, 0, Math.PI * 2),
          e.fill(),
          e.restore());
      },
    },
    Wu = {
      id: "item_fibra",
      name: "Fibra Vegetal",
      difficulty: "facil",
      difficultyLabel: RESOURCE_DIFFICULTY.facil.label,
      rarity: "comum",
      description:
        "Fibras secas extraídas de juncos e gramíneas resistentes. Ideais para tecer cordões, amarras de tochas e mochilas rústicas.",
      whereFound: "Planícies, pradarias e campos com vegetação rasteira",
      categoryType: "material",
      icon: "🌾",
      color: "#84cc16",
      value: 3,
      stackSize: 99,
      canSpawnAt: (e) =>
        !(
          e.tile.biome.id === "MEADOW" ||
          e.tile.biome.id === "SAVANNA" ||
          e.tile.biome.id === "SWAMP"
        ) || e.tile.biome.hasWater
          ? !1
          : e.hash < RESOURCE_DIFFICULTY.facil.spawnChance,
      render: (e, t, l, o, u) => {
        (e.save(), e.translate(t, l));
        const m = Math.sin(u * 2 + t) * 0.08;
        (e.rotate(m),
          (e.fillStyle = "rgba(0, 0, 0, 0.2)"),
          e.beginPath(),
          e.ellipse(0, 3, 5 * o, 2 * o, 0, 0, Math.PI * 2),
          e.fill(),
          (e.strokeStyle = "#65a30d"),
          (e.lineWidth = 1.6 * o),
          e.beginPath(),
          e.moveTo(-4 * o, 2 * o),
          e.quadraticCurveTo(-2 * o, -5 * o, 2 * o, -7 * o),
          e.moveTo(-2 * o, 2 * o),
          e.quadraticCurveTo(1 * o, -4 * o, 5 * o, -5 * o),
          e.stroke(),
          (e.strokeStyle = "#ca8a04"),
          (e.lineWidth = 1.8 * o),
          e.beginPath(),
          e.moveTo(-3 * o, 0),
          e.lineTo(2 * o, 0),
          e.stroke(),
          e.restore());
      },
    },
    Ku = {
      id: "item_resina",
      name: "Resina de Pinho",
      difficulty: "media",
      difficultyLabel: RESOURCE_DIFFICULTY.media.label,
      rarity: "incomum",
      description:
        "Nódulo âmbar translúcido e altamente inflamável escorrido de coníferas antigas. Excelente para revestir tochas e acender fogueiras sob chuva.",
      whereFound:
        "Próximo a pinheiros nas florestas de taiga e montanhas gélidas",
      categoryType: "material",
      icon: "🍯",
      color: "#f59e0b",
      value: 12,
      stackSize: 99,
      canSpawnAt: (e) => {
        const t =
          e.tile.biome.propType === "pine" ||
          e.tile.biome.id === "SNOW_TAIGA" ||
          e.tile.biome.id === "SNOW_PEAK" ||
          e.tile.biome.id === "MOUNTAIN_25D";
        return !e.hasNearbyTree || !t ? !1 : e.hash < RESOURCE_DIFFICULTY.media.spawnChance;
      },
      render: (e, t, l, o, u) => {
        (e.save(), e.translate(t, l));
        const m = 0.8 + Math.sin(u * 3 + t) * 0.2;
        ((e.fillStyle = `rgba(245, 158, 11, ${0.25 * m})`),
          e.beginPath(),
          e.arc(0, 0, 8 * o, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "rgba(0, 0, 0, 0.3)"),
          e.beginPath(),
          e.ellipse(0, 3, 5 * o, 2 * o, 0, 0, Math.PI * 2),
          e.fill(),
          (e.fillStyle = "#f59e0b"),
          (e.strokeStyle = "#b45309"),
          (e.lineWidth = 1.2 * o),
          e.beginPath(),
          e.moveTo(0, -6 * o),
          e.bezierCurveTo(4 * o, -2 * o, 4.5 * o, 3 * o, 0, 4 * o),
          e.bezierCurveTo(-4.5 * o, 3 * o, -4 * o, -2 * o, 0, -6 * o),
          e.closePath(),
          e.fill(),
          e.stroke(),
          (e.fillStyle = "#fef08a"),
          e.beginPath(),
          e.ellipse(-1 * o, -1 * o, 1.8 * o, 1 * o, -0.4, 0, Math.PI * 2),
          e.fill(),
          e.restore());
      },
    },
    ag = [Gu, Fu, Xu, Ku, Hu, Wu];
