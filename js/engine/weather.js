/* js/engine/weather.js
 * Sistema de Clima Dinamico no Canvas (WeatherSystem):
 * - Chuva (rain) com respingos no solo/agua e nevoa umida
 * - Tempestade com Raios (thunderstorm) com relampagos ramificados no Canvas, trovoes, flash e ondas de choque
 * - Tempestade de Areia (sandstorm) com rajadas densas, dunas em redemoinho e reducao severa de visibilidade
 * - Neve / Nevasca (snow) com flocos cristalinos, vento gelido e nevoeiro branco
 * - Impacto direto na visibilidade (nevoa/escuridao e raio de visao reduzido no Canvas)
 * - Impacto no comportamento das criaturas (ex: criaturas de fogo como Dragao Anciao e Golem Magmatico recuam/fumegam na chuva;
 *   presas buscam abrigo; lobos glaciais ficam mais velozes na neve; escorpioes se entocam ou ficam cautelosos; criaturas se assustam com raios).
 */
"use strict";
(function () {
  const WEATHER_TYPES = {
    CLEAR: "clear",
    RAIN: "rain",
    THUNDERSTORM: "thunderstorm",
    SANDSTORM: "sandstorm",
    SNOW: "snow",
  };

  const WEATHER_INFO = {
    clear: {
      id: "clear",
      namePt: "Céu Limpo",
      icon: "☀️",
      visibilityFactor: 1.0,
      darknessBoost: 0.0,
      fogAlpha: 0.0,
      fogColor: [15, 23, 42],
      windSpeed: 0.2,
      descriptionPt: "Visibilidade plena e condições climáticas estáveis.",
    },
    rain: {
      id: "rain",
      namePt: "Chuva",
      icon: "🌧️",
      visibilityFactor: 0.72,
      darknessBoost: 0.24,
      fogAlpha: 0.22,
      fogColor: [30, 58, 95],
      windSpeed: 1.1,
      descriptionPt: "Visibilidade reduzida (-28%). Criaturas de fogo recuam e fumegam; gosmas ficam mais ágeis.",
    },
    thunderstorm: {
      id: "thunderstorm",
      namePt: "Tempestade com Raios",
      icon: "⛈️",
      visibilityFactor: 0.52,
      darknessBoost: 0.42,
      fogAlpha: 0.36,
      fogColor: [17, 24, 48],
      windSpeed: 2.3,
      descriptionPt: "Visibilidade severamente reduzida (-48%). Raios caem no mundo assustando criaturas; criaturas de fogo fogem!",
    },
    sandstorm: {
      id: "sandstorm",
      namePt: "Tempestade de Areia",
      icon: "🌪️",
      visibilityFactor: 0.42,
      darknessBoost: 0.30,
      fogAlpha: 0.50,
      fogColor: [194, 132, 58],
      windSpeed: 3.4,
      descriptionPt: "Cortina de areia densa (-58% visibilidade). Reduz o alcance de visão de predadores e presas.",
    },
    snow: {
      id: "snow",
      namePt: "Tempestade de Neve",
      icon: "🌨️",
      visibilityFactor: 0.58,
      darknessBoost: 0.22,
      fogAlpha: 0.38,
      fogColor: [218, 234, 248],
      windSpeed: 1.8,
      descriptionPt: "Nevasca congelante (-42% visibilidade). Lobos da neve ficam mais ferozes; criaturas de fogo recuam do frio.",
    },
  };

  class WeatherSystem {
    constructor() {
      this.currentWeather = WEATHER_TYPES.CLEAR;
      this.targetWeather = WEATHER_TYPES.CLEAR;
      this.mode = "auto"; // "auto" ou "manual"
      this.intensity = 0; // 0..1 (intensidade da transicao atual)
      this.weatherTimer = 65; // Segundos ate a proxima mudanca automatica
      this.animTimer = 0;
      this.windAngle = 0.28;
      this.windStrength = 1.0;

      // Partículas em espaço do mundo / câmera no Canvas
      this.drops = [];
      this.splashes = [];
      this.gustStreaks = [];
      this.lightningBolts = [];
      this.groundScorches = [];

      // Estado de relâmpago (Tempestade com Raios)
      this.lightningCooldown = 4.5;
      this.flashAlpha = 0;
      this.lastLightningStrike = null;
      this.audio = null;
    }

    setAudio(audio) {
      this.audio = audio;
    }

    getWeatherInfo(type = this.currentWeather) {
      return WEATHER_INFO[type] || WEATHER_INFO.clear;
    }

    isFireCreature(monster) {
      if (!monster) return false;
      const type = monster.type || "";
      const name = (monster.name || "").toLowerCase();
      const color = (monster.color || "").toLowerCase();
      if (type === "dragon") return true;
      if (
        type === "golem" &&
        (name.includes("magm") ||
          name.includes("fogo") ||
          name.includes("lava") ||
          name.includes("vulc") ||
          color === "#b91c1c" ||
          color === "#dc2626")
      ) {
        return true;
      }
      return name.includes("fogo") || name.includes("magma") || name.includes("lava") || name.includes("chama");
    }

    isWetWeather() {
      return (
        (this.currentWeather === WEATHER_TYPES.RAIN ||
          this.currentWeather === WEATHER_TYPES.THUNDERSTORM) &&
        this.intensity > 0.15
      );
    }

    isColdWeather() {
      return this.currentWeather === WEATHER_TYPES.SNOW && this.intensity > 0.15;
    }

    isSandstormWeather() {
      return this.currentWeather === WEATHER_TYPES.SANDSTORM && this.intensity > 0.15;
    }

    setManualWeather(weatherType) {
      if (weatherType === "auto") {
        this.mode = "auto";
        this.weatherTimer = 2.0;
        return;
      }
      if (!WEATHER_INFO[weatherType]) return;
      this.mode = "manual";
      this.targetWeather = weatherType;
      if (weatherType === WEATHER_TYPES.CLEAR) {
        this.currentWeather = WEATHER_TYPES.CLEAR;
        this.intensity = 0;
        this.drops.length = 0;
        this.gustStreaks.length = 0;
      } else {
        this.currentWeather = weatherType;
        this.intensity = Math.max(this.intensity, 0.88);
        if (weatherType === WEATHER_TYPES.THUNDERSTORM) {
          this.lightningCooldown = 1.2;
        }
      }
    }

    cycleWeather() {
      const order = ["auto", "clear", "rain", "thunderstorm", "sandstorm", "snow"];
      const currentKey = this.mode === "auto" ? "auto" : this.currentWeather;
      const idx = order.indexOf(currentKey);
      const next = order[(idx + 1) % order.length];
      this.setManualWeather(next);
      return next;
    }

    chooseAutomaticWeatherForBiome(biomeId) {
      const r = Math.random();
      // Céu Limpo é garantido em 60% de chance em todos os biomas
      if (r < 0.60) {
        return WEATHER_TYPES.CLEAR;
      }

      // Os 40% restantes (r >= 0.60) são distribuídos entre os fenômenos de cada bioma:
      if (
        biomeId === BiomeId.SNOW_TAIGA ||
        biomeId === BiomeId.SNOW_PEAK ||
        biomeId === BiomeId.GLACIER ||
        biomeId === BiomeId.TAIGA_LAKE ||
        biomeId === BiomeId.GLACIER_LAKE
      ) {
        return WEATHER_TYPES.SNOW; // 40% Neve/Nevasca
      }
      if (
        biomeId === BiomeId.DESERT ||
        biomeId === BiomeId.CANYON ||
        biomeId === BiomeId.OASIS ||
        biomeId === BiomeId.OASIS_LAKE
      ) {
        // Dos 40%: 28% Tempestade de Areia, 12% Tempestade Seca com Raios
        return r < 0.88 ? WEATHER_TYPES.SANDSTORM : WEATHER_TYPES.THUNDERSTORM;
      }
      if (biomeId === BiomeId.VOLCANIC) {
        // Dos 40%: 22% Chuva com fuligem, 18% Tempestade de Raios
        return r < 0.82 ? WEATHER_TYPES.RAIN : WEATHER_TYPES.THUNDERSTORM;
      }
      if (biomeId === BiomeId.SWAMP || biomeId === BiomeId.SWAMP_LAKE || biomeId === BiomeId.DEEP_FOREST) {
        // Dos 40%: 25% Chuva, 15% Tempestade com Raios
        return r < 0.85 ? WEATHER_TYPES.RAIN : WEATHER_TYPES.THUNDERSTORM;
      }
      // Biomas temperados (Prado, Floresta, Montanha, Savana, Praia)
      // Dos 40%: 25% Chuva, 15% Tempestade com Raios
      return r < 0.85 ? WEATHER_TYPES.RAIN : WEATHER_TYPES.THUNDERSTORM;
    }

    getEffectiveVisibilityMultiplier(isUnderground = false) {
      if (isUnderground || this.currentWeather === WEATHER_TYPES.CLEAR || this.intensity <= 0.02) {
        return 1.0;
      }
      const info = this.getWeatherInfo(this.currentWeather);
      return 1.0 - (1.0 - info.visibilityFactor) * this.intensity;
    }

    update(dt, player, worldEngine, creatureManager, biomeId) {
      const safeDt = Math.min(0.1, Math.max(0.001, dt || 0.016));
      this.animTimer += safeDt;
      const isUnderground = !!(worldEngine && worldEngine.isUnderground);

      // Atualização automática do clima de acordo com o bioma e tempo
      if (this.mode === "auto" && !isUnderground) {
        this.weatherTimer -= safeDt;
        // Se o jogador entrou em bioma de neve ou deserto e o clima atual é incompatível, adapta suavemente
        const isSnowBiome =
          biomeId === BiomeId.SNOW_TAIGA ||
          biomeId === BiomeId.SNOW_PEAK ||
          biomeId === BiomeId.GLACIER ||
          biomeId === BiomeId.TAIGA_LAKE ||
          biomeId === BiomeId.GLACIER_LAKE;
        const isDesertBiome =
          biomeId === BiomeId.DESERT ||
          biomeId === BiomeId.CANYON;

        if (isSnowBiome && (this.targetWeather === WEATHER_TYPES.SANDSTORM || this.targetWeather === WEATHER_TYPES.RAIN)) {
          this.targetWeather = WEATHER_TYPES.SNOW;
        } else if (isDesertBiome && this.targetWeather === WEATHER_TYPES.SNOW) {
          this.targetWeather = WEATHER_TYPES.SANDSTORM;
        } else if (!isDesertBiome && this.targetWeather === WEATHER_TYPES.SANDSTORM && biomeId !== BiomeId.SAVANNA && biomeId !== BiomeId.BEACH) {
          this.targetWeather = WEATHER_TYPES.RAIN;
        }

        if (this.weatherTimer <= 0) {
          this.targetWeather = this.chooseAutomaticWeatherForBiome(biomeId);
          this.weatherTimer = this.targetWeather === WEATHER_TYPES.CLEAR
            ? 55 + Math.random() * 45
            : 48 + Math.random() * 45;
        }
      }

      // Transição suave de intensidade
      if (this.targetWeather === WEATHER_TYPES.CLEAR) {
        this.intensity = Math.max(0, this.intensity - safeDt * 0.35);
        if (this.intensity <= 0.01) {
          this.currentWeather = WEATHER_TYPES.CLEAR;
        }
      } else {
        if (this.currentWeather !== this.targetWeather) {
          this.intensity = Math.max(0, this.intensity - safeDt * 0.65);
          if (this.intensity <= 0.05) {
            this.currentWeather = this.targetWeather;
          }
        } else {
          this.intensity = Math.min(1, this.intensity + safeDt * 0.42);
        }
      }

      // Decaimento do clarão de relâmpago
      if (this.flashAlpha > 0) {
        this.flashAlpha = Math.max(0, this.flashAlpha - safeDt * 2.6);
      }

      // Atualiza raios ativos
      for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
        const bolt = this.lightningBolts[i];
        bolt.life -= safeDt;
        if (bolt.life <= 0) {
          this.lightningBolts.splice(i, 1);
        }
      }

      // Atualiza marcas de impacto de raio no solo
      for (let i = this.groundScorches.length - 1; i >= 0; i--) {
        const sc = this.groundScorches[i];
        sc.life -= safeDt;
        if (sc.life <= 0) {
          this.groundScorches.splice(i, 1);
        }
      }

      // Atualiza respingos no chão/água
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const sp = this.splashes[i];
        sp.life += safeDt;
        if (sp.life >= sp.maxLife) {
          this.splashes.splice(i, 1);
        }
      }

      // Disparo periódico de relâmpagos durante Tempestade com Raios na superfície
      if (
        !isUnderground &&
        this.currentWeather === WEATHER_TYPES.THUNDERSTORM &&
        this.intensity > 0.35 &&
        player
      ) {
        this.lightningCooldown -= safeDt;
        if (this.lightningCooldown <= 0) {
          this.lightningCooldown = 4.2 + Math.random() * 5.8;
          this.triggerLightningStrike(player, worldEngine, creatureManager);
        }
      }
    }

    triggerLightningStrike(player, worldEngine, creatureManager, customX, customY) {
      if (!player) return;
      const angle = Math.random() * Math.PI * 2;
      const dist = 75 + Math.random() * 210;
      const strikeX = customX !== undefined ? customX : player.x + Math.cos(angle) * dist;
      const strikeY = customY !== undefined ? customY : player.y + Math.sin(angle) * dist;

      // Gera segmentos quebrados do raio principal + ramificações secundárias
      const segments = [];
      const branches = [];
      const startX = strikeX + (Math.random() - 0.5) * 90;
      const startY = strikeY - 420;
      const steps = 14;
      let prevX = startX;
      let prevY = startY;

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const jitter = (1 - t) * 34;
        const nextX =
          i === steps
            ? strikeX
            : startX + (strikeX - startX) * t + (Math.random() - 0.5) * jitter * 2;
        const nextY = startY + (strikeY - startY) * t;
        segments.push({ x1: prevX, y1: prevY, x2: nextX, y2: nextY });

        // Ramificações elétricas laterais
        if (i > 2 && i < steps - 1 && Math.random() < 0.52) {
          const bSteps = 4 + Math.floor(Math.random() * 3);
          let bx = nextX;
          let by = nextY;
          const bDir = Math.random() < 0.5 ? -1 : 1;
          for (let b = 0; b < bSteps; b++) {
            const nbx = bx + bDir * (10 + Math.random() * 18);
            const nby = by + (14 + Math.random() * 18);
            branches.push({ x1: bx, y1: by, x2: nbx, y2: nby });
            bx = nbx;
            by = nby;
          }
        }

        prevX = nextX;
        prevY = nextY;
      }

      this.lightningBolts.push({
        x: strikeX,
        y: strikeY,
        segments,
        branches,
        life: 0.42,
        maxLife: 0.42,
      });

      this.groundScorches.push({
        x: strikeX,
        y: strikeY,
        radius: 18 + Math.random() * 8,
        life: 9.0,
        maxLife: 9.0,
      });

      this.flashAlpha = 0.78;
      this.lastLightningStrike = {
        x: strikeX,
        y: strikeY,
        time: this.animTimer,
      };

      // Toca efeito sonoro de trovão se disponível
      if (this.audio && typeof this.audio.playThunderClap === "function") {
        this.audio.playThunderClap();
      } else if (typeof window !== "undefined" && window.Game && window.Game.audio && typeof window.Game.audio.playThunderClap === "function") {
        window.Game.audio.playThunderClap();
      }

      // Afeta criaturas próximas ao impacto do raio!
      if (creatureManager && Array.isArray(creatureManager.monsters)) {
        for (const m of creatureManager.monsters) {
          if (m.hp <= 0 || m.isUnderground) continue;
          const d = Math.hypot(m.x - strikeX, m.y - strikeY);
          // Impacto direto / próximo causa dano elétrico
          if (d < 62) {
            const dmg = Math.max(4, Math.round(14 * (1 - d / 75)));
            m.hp = Math.max(1, m.hp - dmg);
            m.hitFlashTimer = 0.35;
            creatureManager.floatingTexts.push({
              id: `zap_${creatureManager.nextId++}`,
              x: m.x,
              y: m.y - 22,
              text: `⚡ -${dmg} Raio!`,
              color: "#38bdf8",
              isCrit: true,
              life: 1.1,
            });
          }
          // Criaturas num raio de 280px se assustam com o trovão e correm em pânico
          if (d < 280 && !m.isQueen) {
            m.weatherStartleTimer = 3.2;
            m.weatherStartleX = strikeX;
            m.weatherStartleY = strikeY;
            m.alertEffectTimer = 2.8;
            const fleeAng = Math.atan2(m.y - strikeY, m.x - strikeX) || Math.random() * Math.PI * 2;
            m.targetAngle = fleeAng;
            const burstSpd = (m.speed || 0.8) * 1.65;
            m.vx = Math.cos(fleeAng) * burstSpd;
            m.vy = Math.sin(fleeAng) * burstSpd;
            if (typeof creatureManager.getMonsterFacing === "function") {
              m.facing = creatureManager.getMonsterFacing(m.vx, m.vy, m.facing);
            }
          }
        }
        // Partículas de faísca elétrica no ponto de impacto
        for (let p = 0; p < 14; p++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 2.2 + Math.random() * 4.5;
          creatureManager.hitParticles.push({
            x: strikeX + (Math.random() - 0.5) * 10,
            y: strikeY + (Math.random() - 0.5) * 8,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 1.5,
            life: 0.65,
            color: p % 2 === 0 ? "#e0f2fe" : "#38bdf8",
            size: 2.2 + Math.random() * 2,
          });
        }
      }
    }

    /**
     * Calcula modificadores de comportamento e atributos para uma criatura com base no clima atual.
     * Usado por CreatureManager.update para alterar IA, velocidade, alcance de detecção e recuo na chuva.
     */
    getCreatureWeatherBehavior(monster, player, dt, creatureManager) {
      const result = {
        visionMult: 1.0,
        speedMult: 1.0,
        forceRetreat: false,
        retreatFromX: player ? player.x : monster.x,
        retreatFromY: player ? player.y : monster.y,
        seekShelter: false,
        statusLabel: null,
        statusColor: "#38bdf8",
      };

      if (!monster || monster.isUnderground || this.currentWeather === WEATHER_TYPES.CLEAR || this.intensity <= 0.1) {
        monster.weatherStateText = null;
        return result;
      }

      const wType = this.currentWeather;
      const inten = this.intensity;
      const isFire = this.isFireCreature(monster);
      const isWet = wType === WEATHER_TYPES.RAIN || wType === WEATHER_TYPES.THUNDERSTORM;
      const isStorm = wType === WEATHER_TYPES.THUNDERSTORM;
      const isSand = wType === WEATHER_TYPES.SANDSTORM;
      const isSnow = wType === WEATHER_TYPES.SNOW;

      // Redução global do alcance de visão das criaturas conforme a visibilidade do clima
      result.visionMult = this.getEffectiveVisibilityMultiplier(false);

      // 1. Criaturas assustadas por um raio recente fogem do local da queda
      if (monster.weatherStartleTimer && monster.weatherStartleTimer > 0) {
        monster.weatherStartleTimer = Math.max(0, monster.weatherStartleTimer - dt);
        result.forceRetreat = true;
        result.retreatFromX = monster.weatherStartleX ?? (player ? player.x : monster.x);
        result.retreatFromY = monster.weatherStartleY ?? (player ? player.y : monster.y);
        result.speedMult = 1.45;
        result.statusLabel = "⚡ Assustado pelo Raio!";
        result.statusColor = "#38bdf8";
        monster.weatherStateText = result.statusLabel;
        monster.weatherStateColor = result.statusColor;
        return result;
      }

      // 2. CRIATURAS DE FOGO (Dragão Ancião, Golem Magmático) RECUAM NA CHUVA, TEMPESTADE E NEVE!
      if (isFire && (isWet || isSnow)) {
        // Se estiver perto de uma fogueira acesa protetora, recua apenas do jogador; caso contrário recua e solta vapor
        result.forceRetreat = true;
        result.retreatFromX = player ? player.x : monster.x + Math.cos(this.animTimer) * 40;
        result.retreatFromY = player ? player.y : monster.y + Math.sin(this.animTimer) * 40;
        result.speedMult = isStorm ? 1.28 : 1.15;
        result.statusLabel = isSnow ? "❄️ Fogo Enfraquecido (Recuando!)" : "🌧️ Fogo Apagando (Recuando!)";
        result.statusColor = "#60a5fa";
        monster.weatherStateText = result.statusLabel;
        monster.weatherStateColor = result.statusColor;

        // Emite partículas de vapor chiando no corpo da criatura de fogo na chuva/neve
        if (creatureManager && Math.random() < dt * (isStorm ? 9 : 6)) {
          const sc = monster.scale || 1;
          creatureManager.slimeParticles.push({
            x: monster.x + (Math.random() - 0.5) * 18 * sc,
            y: monster.y - (6 + Math.random() * 14) * sc,
            vx: (Math.random() - 0.5) * 8 + this.windStrength * 3,
            vy: -14 - Math.random() * 10,
            life: 0.65,
            maxLife: 0.65,
            type: "vapor",
            color: "rgba(226, 232, 240, 0.72)",
            size: (2.2 + Math.random() * 1.8) * Math.min(1.6, sc),
          });
        }

        // Dano leve periódico de resfriamento térmico em tempestade forte (sem matar, deixando com pelo menos 25% de vida)
        monster._rainSteamTimer = (monster._rainSteamTimer || 0) + dt;
        if (monster._rainSteamTimer >= 2.4) {
          monster._rainSteamTimer = 0;
          if (monster.hp > monster.maxHp * 0.25) {
            const steamDmg = isStorm ? 2 : 1;
            monster.hp = Math.max(Math.ceil(monster.maxHp * 0.25), monster.hp - steamDmg);
          }
          if (creatureManager && Math.random() < 0.45) {
            creatureManager.floatingTexts.push({
              id: `steam_${creatureManager.nextId++}`,
              x: monster.x,
              y: monster.y - 24 * (monster.scale || 1),
              text: isSnow ? "💨 Resfriando! (Recua)" : "💨 Vaporizando na Chuva!",
              color: "#93c5fd",
              isCrit: false,
              life: 0.95,
            });
          }
        }
        return result;
      }

      // 3. Comportamento de Gosmas (Slimes) no clima:
      // Na chuva/tempestade não sofrem com sol, ficam revigoradas e mais rápidas (+25% speed)!
      // Na tempestade de areia ou neve ficam lentas e buscam abrigo.
      if (monster.type === "slime") {
        if (isWet) {
          result.speedMult = 1.25;
          result.statusLabel = "💧 Revigorada pela Chuva";
          result.statusColor = "#34d399";
        } else if (isSand || isSnow) {
          result.speedMult = 0.68;
          result.seekShelter = true;
          result.statusLabel = isSand ? "🌪️ Desidratando na Areia" : "❄️ Congelando";
          result.statusColor = "#fbbf24";
        }
      }

      // 4. Lobos (Wolf):
      // Na neve (especialmente Lobo Branco da Neve), ficam mais velozes e têm faro aguçado!
      // Em tempestade com raios ou areia, têm visão reduzida.
      else if (monster.type === "wolf") {
        const isSnowWolf = (monster.name || "").toLowerCase().includes("neve") || (monster.color || "") === "#e2e8f0";
        if (isSnow) {
          result.speedMult = isSnowWolf ? 1.28 : 1.05;
          result.visionMult = isSnowWolf ? 1.15 : 0.75;
          if (isSnowWolf) {
            result.statusLabel = "🐺 Caçador da Nevasca (+Vel)";
            result.statusColor = "#bae6fd";
          }
        } else if (isStorm || isSand) {
          result.speedMult = 0.88;
          result.visionMult *= 0.75;
        }
      }

      // 5. Presas (Coelho, Cervo):
      // Em tempestades com raios, tempestade de areia ou nevasca, ficam encolhidas/cautelosas procurando abrigo sob árvores
      else if (monster.type === "rabbit" || monster.type === "deer") {
        if (isStorm || isSand || isSnow) {
          result.seekShelter = true;
          result.speedMult = 0.82;
          result.statusLabel = isStorm ? "⛈️ Buscando Abrigo" : isSand ? "🌪️ Cego pela Areia" : "🌨️ Encolhido no Frio";
          result.statusColor = "#fcd34d";
        }
      }

      // 6. Escorpiões e Aranhas na superfície:
      // Na chuva/tempestade ou neve ficam lentos e evitam perseguições longas; na tempestade de areia escorpiões se camuflam
      else if (monster.type === "scorpion" || monster.type === "spider") {
        if (isWet || isSnow) {
          result.speedMult = 0.76;
          result.visionMult *= 0.72;
          if (!monster.isGiantScorpion) {
            result.statusLabel = isWet ? "🌧️ Entorpecido pela Chuva" : "❄️ Letárgico pelo Frio";
            result.statusColor = "#94a3b8";
          }
        } else if (isSand && monster.type === "scorpion") {
          result.speedMult = 1.12;
          result.statusLabel = "🌪️ Predador das Dunas";
          result.statusColor = "#f59e0b";
        }
      }

      monster.weatherStateText = result.statusLabel;
      monster.weatherStateColor = result.statusColor;
      return result;
    }

    /**
     * Renderiza marcas no chão e respingos em espaço do mundo (chamado antes do fim do transform da câmera).
     */
    renderWorldEffects(ctx, viewLeft, viewRight, viewTop, viewBottom) {
      if (this.engineIsUnderground) return;

      // 1. Marcas de impacto de raios no chão
      for (const sc of this.groundScorches) {
        if (sc.x < viewLeft - 40 || sc.x > viewRight + 40 || sc.y < viewTop - 40 || sc.y > viewBottom + 40) continue;
        const alpha = Math.min(1, sc.life / 2.5) * 0.65;
        ctx.save();
        ctx.translate(sc.x, sc.y);
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, sc.radius);
        grad.addColorStop(0, `rgba(15, 23, 42, ${alpha})`);
        grad.addColorStop(0.55, `rgba(30, 41, 59, ${alpha * 0.7})`);
        grad.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, sc.radius * 1.2, sc.radius * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brasa azulada residual nos primeiros segundos após o raio
        if (sc.life > sc.maxLife - 3.0) {
          const glowA = ((sc.life - (sc.maxLife - 3.0)) / 3.0) * 0.75;
          ctx.strokeStyle = `rgba(56, 189, 248, ${glowA})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(-sc.radius * 0.6, -2);
          ctx.lineTo(0, 1);
          ctx.lineTo(sc.radius * 0.5, -3);
          ctx.moveTo(-3, -sc.radius * 0.35);
          ctx.lineTo(2, sc.radius * 0.35);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Ondas e respingos de gotas de chuva no solo/água
      if (this.splashes.length > 0) {
        ctx.save();
        for (const sp of this.splashes) {
          if (sp.x < viewLeft - 20 || sp.x > viewRight + 20 || sp.y < viewTop - 20 || sp.y > viewBottom + 20) continue;
          const prog = sp.life / sp.maxLife;
          const alpha = (1 - prog) * 0.55 * this.intensity;
          const rx = (1.5 + prog * sp.maxRadius) * 1.3;
          const ry = (0.8 + prog * sp.maxRadius * 0.55);
          ctx.strokeStyle = `rgba(186, 230, 253, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.ellipse(sp.x, sp.y, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Relâmpagos ramificados caindo do céu no mundo
      for (const bolt of this.lightningBolts) {
        const prog = bolt.life / bolt.maxLife;
        const alpha = Math.min(1, prog * 1.4);
        ctx.save();

        // Onda de choque elétrica no chão no ponto de impacto
        const ringProg = 1 - prog;
        const ringR = 12 + ringProg * 68;
        ctx.strokeStyle = `rgba(125, 211, 252, ${(alpha * 0.85).toFixed(3)})`;
        ctx.lineWidth = 2.5 * prog;
        ctx.beginPath();
        ctx.ellipse(bolt.x, bolt.y, ringR * 1.25, ringR * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Halo luminoso no solo
        const groundGlow = ctx.createRadialGradient(bolt.x, bolt.y, 2, bolt.x, bolt.y, 64);
        groundGlow.addColorStop(0, `rgba(224, 242, 254, ${(alpha * 0.9).toFixed(3)})`);
        groundGlow.addColorStop(0.4, `rgba(56, 189, 248, ${(alpha * 0.5).toFixed(3)})`);
        groundGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = groundGlow;
        ctx.beginPath();
        ctx.ellipse(bolt.x, bolt.y, 64, 34, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ramificações secundárias
        ctx.strokeStyle = `rgba(125, 211, 252, ${(alpha * 0.78).toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (const br of bolt.branches) {
          ctx.moveTo(br.x1, br.y1);
          ctx.lineTo(br.x2, br.y2);
        }
        ctx.stroke();

        // Brilho externo azul elétrico do raio principal
        ctx.strokeStyle = `rgba(56, 189, 248, ${(alpha * 0.85).toFixed(3)})`;
        ctx.lineWidth = 6.5 * prog;
        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Núcleo branco incandescente do raio principal
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 2.4 * prog;
        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        ctx.restore();
      }
    }

    /**
     * Renderiza partículas climáticas (chuva, tempestade, tempestade de areia, neve) e neblina de visibilidade no Canvas.
     */
    renderScreenWeather(ctx, width, height, zoom, cameraX, cameraY, isUnderground = false) {
      this.engineIsUnderground = isUnderground;
      if (isUnderground || this.currentWeather === WEATHER_TYPES.CLEAR || this.intensity <= 0.02) {
        return;
      }

      const wType = this.currentWeather;
      const inten = this.intensity;
      const quality = (typeof window !== "undefined" && window.__rpgQuality?.effects) ?? 1;

      ctx.save();

      // =====================================================================
      // 1. CHUVA E TEMPESTADE COM RAIOS
      // =====================================================================
      if (wType === WEATHER_TYPES.RAIN || wType === WEATHER_TYPES.THUNDERSTORM) {
        const isThunder = wType === WEATHER_TYPES.THUNDERSTORM;
        const targetCount = Math.floor((isThunder ? 190 : 120) * inten * Math.max(0.5, quality));

        while (this.drops.length < targetCount) {
          this.drops.push({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * (height + 200) - 100,
            len: (isThunder ? 22 : 16) + Math.random() * 14,
            speed: (isThunder ? 19 : 14) + Math.random() * 7,
            windX: (isThunder ? -4.8 : -2.4) + (Math.random() - 0.5) * 0.8,
            alpha: (0.32 + Math.random() * 0.38) * inten,
            thickness: isThunder ? 1.45 : 1.15,
          });
        }
        if (this.drops.length > targetCount) {
          this.drops.length = targetCount;
        }

        // Desenha os traços diagonais de chuva
        ctx.lineCap = "round";
        for (let i = 0; i < this.drops.length; i++) {
          const d = this.drops[i];
          d.x += d.windX;
          d.y += d.speed;

          if (d.y > height + 30 || d.x < -120 || d.x > width + 120) {
            // Cria respingo no espaço do mundo ocasionalmente
            if (this.splashes.length < 48 && Math.random() < (isThunder ? 0.35 : 0.22)) {
              const worldX = cameraX + (d.x - width / 2) / (zoom || 1);
              const worldY = cameraY + (Math.random() * height - height / 2) / (zoom || 1);
              this.splashes.push({
                x: worldX,
                y: worldY,
                life: 0,
                maxLife: 0.25 + Math.random() * 0.2,
                maxRadius: 3.5 + Math.random() * 3.5,
              });
            }
            d.x = Math.random() * (width + 240) - 60;
            d.y = -20 - Math.random() * 80;
          }

          ctx.strokeStyle = isThunder
            ? `rgba(186, 230, 253, ${(d.alpha * 0.95).toFixed(3)})`
            : `rgba(147, 197, 253, ${(d.alpha * 0.85).toFixed(3)})`;
          ctx.lineWidth = d.thickness;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.windX * 1.45, d.y + d.len);
          ctx.stroke();
        }

        // Neblina úmida azulada uniforme em toda a tela (sem clarear um círculo ao redor do player)
        const fogAlpha = (isThunder ? 0.34 : 0.20) * inten;
        ctx.fillStyle = `rgba(12, 24, 46, ${fogAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);

        // Clarão de relâmpago na tela inteira durante Tempestade com Raios
        if (this.flashAlpha > 0.01) {
          ctx.fillStyle = `rgba(224, 242, 254, ${(this.flashAlpha * 0.55).toFixed(3)})`;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // =====================================================================
      // 2. TEMPESTADE DE AREIA (SANDSTORM)
      // =====================================================================
      else if (wType === WEATHER_TYPES.SANDSTORM) {
        const targetCount = Math.floor(170 * inten * Math.max(0.5, quality));
        while (this.drops.length < targetCount) {
          this.drops.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 11 + Math.random() * 10,
            vy: (Math.random() - 0.5) * 3.2,
            size: 1.4 + Math.random() * 3.0,
            alpha: (0.35 + Math.random() * 0.45) * inten,
            wavePhase: Math.random() * Math.PI * 2,
            isStreak: Math.random() < 0.32,
          });
        }
        if (this.drops.length > targetCount) {
          this.drops.length = targetCount;
        }

        // Camada de poeira ocre densa e uniforme no ar (sem halo claro ao redor do player)
        ctx.fillStyle = `rgba(165, 102, 34, ${(0.36 * inten).toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);

        // Ondas de vento arenoso varrendo a tela horizontalmente
        for (let band = 0; band < 4; band++) {
          const bandY = ((band * height * 0.27 + this.animTimer * (90 + band * 25)) % (height + 160)) - 80;
          const bGrad = ctx.createLinearGradient(0, bandY - 55, 0, bandY + 55);
          const bAlpha = (0.12 + 0.04 * Math.sin(this.animTimer * 2 + band)) * inten;
          bGrad.addColorStop(0, "rgba(217, 149, 67, 0)");
          bGrad.addColorStop(0.5, `rgba(217, 149, 67, ${bAlpha.toFixed(3)})`);
          bGrad.addColorStop(1, "rgba(217, 149, 67, 0)");
          ctx.fillStyle = bGrad;
          ctx.fillRect(0, bandY - 55, width, 110);
        }

        // Grãos de areia e rajadas velozes
        for (let i = 0; i < this.drops.length; i++) {
          const p = this.drops[i];
          p.x += p.vx;
          p.y += p.vy + Math.sin(this.animTimer * 4 + p.wavePhase) * 1.3;

          if (p.x > width + 60) {
            p.x = -50;
            p.y = Math.random() * height;
          }
          if (p.y < -30) p.y = height + 20;
          if (p.y > height + 30) p.y = -20;

          if (p.isStreak) {
            ctx.strokeStyle = `rgba(245, 194, 107, ${(p.alpha * 0.7).toFixed(3)})`;
            ctx.lineWidth = p.size * 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 1.2);
            ctx.stroke();
          } else {
            ctx.fillStyle = `rgba(234, 179, 88, ${p.alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // =====================================================================
      // 3. TEMPESTADE DE NEVE / NEVASCA (SNOW)
      // =====================================================================
      else if (wType === WEATHER_TYPES.SNOW) {
        const targetCount = Math.floor(150 * inten * Math.max(0.5, quality));
        while (this.drops.length < targetCount) {
          this.drops.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: -1.8 + (Math.random() - 0.5) * 1.6,
            vy: 1.8 + Math.random() * 2.6,
            size: 1.5 + Math.random() * 2.8,
            alpha: (0.45 + Math.random() * 0.45) * inten,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 1.5 + Math.random() * 2.0,
          });
        }
        if (this.drops.length > targetCount) {
          this.drops.length = targetCount;
        }

        // Véu glacial uniforme em toda a tela (sem halo ao redor do player)
        ctx.fillStyle = `rgba(214, 234, 250, ${(0.22 * inten).toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < this.drops.length; i++) {
          const f = this.drops[i];
          const sway = Math.sin(this.animTimer * f.swaySpeed + f.swayPhase) * 1.4;
          f.x += f.vx + sway;
          f.y += f.vy;

          if (f.y > height + 20) {
            f.y = -15;
            f.x = Math.random() * width;
          }
          if (f.x < -20) f.x = width + 15;
          if (f.x > width + 20) f.x = -15;

          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();

          if (f.size > 3.1) {
            ctx.strokeStyle = `rgba(186, 230, 253, ${(f.alpha * 0.65).toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(f.x - f.size * 1.3, f.y);
            ctx.lineTo(f.x + f.size * 1.3, f.y);
            ctx.moveTo(f.x, f.y - f.size * 1.3);
            ctx.lineTo(f.x, f.y + f.size * 1.3);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    }
  }

  const weatherSystem = new WeatherSystem();
  window.WEATHER_TYPES = WEATHER_TYPES;
  window.WEATHER_INFO = WEATHER_INFO;
  window.WeatherSystem = WeatherSystem;
  window.weatherSystem = weatherSystem;
  window.Game = window.Game || {};
  window.Game.WeatherSystem = WeatherSystem;
  window.Game.weather = weatherSystem;
})();
