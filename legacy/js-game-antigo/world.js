/**
 * world.js - Gerador do Mundo Procedural, Chunks, Cavernas, Biomas, Recursos e Objetos
 * Namespace: window.Game.World e window.Game.world
 */
window.Game = window.Game || {};

(function (G) {
  'use strict';

  const NoiseClass = G.Noise || G.SimplexNoise;
  const BIOMES = G.BIOMES;
  const getBiome = G.getBiome;

  class World {
    constructor(seed = 4289) {
      this.tileSize = 36;
      this.isUnderground = false;
      this.activeCaveSeed = 0;
      this.surfaceCoords = { x: 0, y: 0 };
      this.minedCrystals = 0;
      this.interactedProps = new Map();
      this.collectedGroundItems = new Set();
      this.customPlacedProps = new Map();
      this.tileCache = new Map();
      this.closestCampfireCache = new Map();
      this.knownCaveEntrances = new Map();

      this.seed = seed;
      this.elevNoise = new NoiseClass(seed);
      this.moistNoise = new NoiseClass(seed + 101);
      this.tempNoise = new NoiseClass(seed + 202);
      this.detailNoise = new NoiseClass(seed + 303);
      this.caveWallNoise = new NoiseClass(seed + 404);
      this.caveRoomNoise = new NoiseClass(seed + 505);
      this.caveDetailNoise = new NoiseClass(seed + 606);
      this.islandNoise = new NoiseClass(seed + 707);
      this.featureNoise = new NoiseClass(seed + 808);
      this.canyonNoise = new NoiseClass(seed + 909);
      this.lakeNoise = new NoiseClass(seed + 1010);
    }

    setSeed(seed) {
      this.seed = seed;
      this.elevNoise.seed(seed);
      this.moistNoise.seed(seed + 101);
      this.tempNoise.seed(seed + 202);
      this.detailNoise.seed(seed + 303);
      this.caveWallNoise.seed(seed + 404);
      this.caveRoomNoise.seed(seed + 505);
      this.caveDetailNoise.seed(seed + 606);
      this.islandNoise.seed(seed + 707);
      this.featureNoise.seed(seed + 808);
      this.canyonNoise.seed(seed + 909);
      this.lakeNoise.seed(seed + 1010);

      this.interactedProps.clear();
      this.collectedGroundItems.clear();
      this.customPlacedProps.clear();
      this.knownCaveEntrances.clear();
      this.clearTileCache();
      this.isUnderground = false;
    }

    _tk(tx, ty, isCave) {
      if (
        Number.isInteger(tx) &&
        Number.isInteger(ty) &&
        tx > -1048576 &&
        tx < 1048576 &&
        ty > -1048576 &&
        ty < 1048576
      ) {
        return (tx + 1048576) * 2097152 + (ty + 1048576) + (isCave ? 4398046511104 : 0);
      }
      return `${isCave ? 'c' : 's'}_${tx},${ty}`;
    }

    invalidateTile(tx, ty) {
      this.tileCache.delete(this._tk(tx, ty, false));
      this.tileCache.delete(this._tk(tx, ty, true));
      this.closestCampfireCache.clear();
    }

    clearTileCache() {
      this.tileCache.clear();
      this.closestCampfireCache.clear();
    }

    getCachedTileCount() {
      return this.tileCache.size;
    }

    pruneTileCache(tx, ty, maxDist = 50, maxSize = 2400) {
      if (this.tileCache.size <= maxSize) return 0;
      const maxDistSq = maxDist * maxDist;
      let pruned = 0;
      for (const [key, tile] of this.tileCache.entries()) {
        const dx = tile.tx - tx;
        const dy = tile.ty - ty;
        if (dx * dx + dy * dy > maxDistSq) {
          this.tileCache.delete(key);
          pruned++;
        }
      }
      return pruned;
    }

    exportSaveData() {
      return {
        interactedProps: Array.from(this.interactedProps.entries()),
        customPlacedProps: Array.from(this.customPlacedProps.entries()),
        collectedGroundItems: Array.from(this.collectedGroundItems.values())
      };
    }

    importSaveData(data) {
      if (!data) return;
      if (data.interactedProps) {
        this.interactedProps = new Map(data.interactedProps);
      }
      if (data.customPlacedProps) {
        this.customPlacedProps = new Map(data.customPlacedProps);
      }
      if (data.collectedGroundItems) {
        this.collectedGroundItems = new Set(data.collectedGroundItems);
      }
      this.clearTileCache();
    }

    placeProp(tx, ty, prop) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      this.customPlacedProps.set(key, { ...prop });
      this.invalidateTile(tx, ty);
    }

    getPlacedProp(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      return this.customPlacedProps.get(key);
    }

    removeProp(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      const deleted = this.customPlacedProps.delete(key);
      this.interactedProps.delete(key);
      this.invalidateTile(tx, ty);
      return deleted;
    }

    lightCampfire(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      let p = this.customPlacedProps.get(key);
      if (!p) {
        const t = this.getTile(tx, ty);
        if (t.prop && t.prop.kind === 'campfire') {
          p = { ...t.prop };
          this.customPlacedProps.set(key, p);
        }
      }
      if (p && p.kind === 'campfire') {
        p.lit = true;
        const level = p.fireLevel || 1;
        const scale = p.scale || 1;
        p.namePt =
          level >= 5
            ? 'Pira Ancestral das Chamas Eternas'
            : level >= 3
            ? 'Fogueira Majestosa'
            : level >= 2
            ? 'Grande Fogueira Crepitante'
            : 'Fogueira Crepitante';
        p.descriptionPt = `Fogueira crepitante (Nível ${level}, Tamanho ${scale.toFixed(1)}x). Pressione [E] para descansar ou alimente-a com galhos para expandir o fogo.`;
      }
      const existing = this.interactedProps.get(key) || {};
      this.interactedProps.set(key, { ...existing, lit: true });
      this.invalidateTile(tx, ty);
      return true;
    }

    getNearbyCampfire(px, py, radius = 85) {
      const u = Math.round(px / this.tileSize);
      const m = Math.round(py / this.tileSize);
      const c = Math.ceil(radius / this.tileSize) + 2;
      let nearest = null;

      for (let dy = -c; dy <= c; dy++) {
        for (let dx = -c; dx <= c; dx++) {
          const w = u + dx;
          const v = m + dy;
          const key = `${this.isUnderground ? 'cave_' : 'surf_'}${w},${v}`;
          let prop = this.customPlacedProps.get(key);
          if (!prop) {
            const tile = this.getTile(w, v);
            if (tile.prop && (tile.prop.kind === 'campfire' || tile.prop.kind === 'clay_oven')) {
              prop = tile.prop;
            }
          }
          if (prop && (prop.kind === 'campfire' || prop.kind === 'clay_oven')) {
            const cx = w * this.tileSize + this.tileSize / 2 + (prop.offsetX || 0);
            const cy = v * this.tileSize + this.tileSize / 2 + (prop.offsetY || 0);
            const dist = Math.hypot(px - cx, py - cy);
            const maxAllowed = radius + ((prop.scale || 1) - 1) * 35;
            if (dist <= maxAllowed && (!nearest || dist < nearest.dist)) {
              nearest = { tx: w, ty: v, prop, dist };
            }
          }
        }
      }
      return nearest;
    }

    feedCampfire(tx, ty, stickCount = 10) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      let prop = this.customPlacedProps.get(key);
      if (!prop) {
        const tile = this.getTile(tx, ty);
        if (tile.prop && (tile.prop.kind === 'campfire' || tile.prop.kind === 'clay_oven')) {
          prop = { ...tile.prop };
          this.customPlacedProps.set(key, prop);
        }
      }
      if (!prop || (prop.kind !== 'campfire' && prop.kind !== 'clay_oven')) {
        return {
          success: false,
          level: 1,
          scale: 1,
          sticksFed: 10,
          percentageGrowth: '',
          propName: '',
          description: 'Nenhuma fogueira encontrada neste local.'
        };
      }

      const totalSticks = (prop.sticksFed || 10) + stickCount;
      const prevScale = prop.scale || 1;
      const newScale = Math.max(1, Math.round((totalSticks / 10) * 10) / 10);
      const newLevel = Math.round(newScale);

      let growthMsg = '';
      if (newLevel === 2) {
        growthMsg = 'Dobrou de tamanho (+100%)! Agora 2x maior!';
      } else if (newLevel === 3) {
        growthMsg = 'Cresceu +50%! Agora 3x maior que a base!';
      } else if (newLevel === 4) {
        growthMsg = 'Cresceu proporcionalmente (+33%)! Agora 4x maior!';
      } else if (newLevel >= 5) {
        growthMsg = 'Atingiu o 5º nível (+25%)! Pira colossal 5x maior!';
      } else {
        growthMsg = `Cresceu +${Math.round(((newScale - prevScale) / prevScale) * 100)}%! Agora ${newScale.toFixed(1)}x maior!`;
      }

      let name = 'Fogueira de Acampamento';
      if (newLevel === 2) {
        name = 'Grande Fogueira Crepitante (Nível 2)';
      } else if (newLevel === 3) {
        name = 'Fogueira Majestosa de Chamas Altas (Nível 3)';
      } else if (newLevel === 4) {
        name = 'Fogueira Monumental Flamejante (Nível 4)';
      } else if (newLevel >= 5) {
        name = 'Pira Ancestral das Chamas Eternas (Nível 5)';
      }

      prop.scale = newScale;
      prop.fireLevel = newLevel;
      prop.sticksFed = totalSticks;
      prop.namePt = name;
      prop.descriptionPt = `Fogueira alimentada com ${totalSticks} galhos. Tamanho ${newScale.toFixed(1)}x. ${growthMsg}`;

      const existing = this.interactedProps.get(key) || {};
      this.interactedProps.set(key, {
        ...existing,
        lit: prop.lit !== false,
        fireLevel: newLevel,
        sticksFed: totalSticks
      });
      this.invalidateTile(tx, ty);

      return {
        success: true,
        level: newLevel,
        scale: newScale,
        sticksFed: totalSticks,
        percentageGrowth: growthMsg,
        propName: name,
        description: prop.descriptionPt
      };
    }

    startRoastingFish(tx, ty, fishItem) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      const plainKey = `${tx},${ty}`;
      const roasting = {
        fishItem: {
          id: fishItem.id,
          name: fishItem.name,
          color: fishItem.color,
          rarity: fishItem.rarity,
          value: fishItem.value,
          description: fishItem.description,
          hpHeal: fishItem.hpHeal,
          staminaHeal: fishItem.staminaHeal
        },
        startTime: Date.now(),
        durationMs: 60000
      };

      if (this.customPlacedProps.has(key)) {
        this.customPlacedProps.get(key).roastingFish = roasting;
      }
      const existing = {
        ...(this.interactedProps.get(key) || this.interactedProps.get(plainKey) || {}),
        roastingFish: roasting
      };
      this.interactedProps.set(key, existing);
      this.interactedProps.set(plainKey, existing);
      this.invalidateTile(tx, ty);
      return true;
    }

    collectRoastedFish(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      const plainKey = `${tx},${ty}`;
      const inter = this.interactedProps.get(key) || this.interactedProps.get(plainKey);
      let r = inter ? inter.roastingFish : null;
      if (!r && this.customPlacedProps.has(key)) {
        r = this.customPlacedProps.get(key).roastingFish;
      }
      if (!r) return null;

      if (this.customPlacedProps.has(key)) {
        delete this.customPlacedProps.get(key).roastingFish;
      }
      if (inter) {
        delete inter.roastingFish;
        this.interactedProps.set(key, { ...inter });
        this.interactedProps.set(plainKey, { ...inter });
      }
      this.invalidateTile(tx, ty);

      const baseName = r.fishItem.name
        .replace(' (Cru)', '')
        .replace(' Cru', '')
        .replace(' Fresco', '');
      const finalName = `${baseName} Assado no Espeto`;

      return {
        id: `fish_roasted_${r.fishItem.id}_${Date.now()}`,
        name: finalName,
        icon: '🍢',
        categoryType: 'consumable',
        rarity: 'raro',
        value: (r.fishItem.value || 40) + 60,
        hpHeal: 70,
        staminaHeal: 90,
        color: '#f59e0b',
        description: `Suculento ${baseName} assado no espeto de galho sobre as brasas da fogueira durante 1 minuto. Deliciosamente tostado com aroma defumado irresistível. Restaura 70 de Vida e 90 de Stamina.`,
        stackCount: 1,
        maxStack: 10
      };
    }

    isNearLitCampfire(px, py, radius = 190) {
      const u = Math.round(px / this.tileSize);
      const m = Math.round(py / this.tileSize);
      const c = 14;

      for (let dy = -c; dy <= c; dy++) {
        for (let dx = -c; dx <= c; dx++) {
          const w = u + dx;
          const v = m + dy;
          const key = `${this.isUnderground ? 'cave_' : 'surf_'}${w},${v}`;
          const placed = this.customPlacedProps.get(key);
          if (
            placed &&
            (placed.kind === 'campfire' || placed.kind === 'clay_oven') &&
            placed.lit !== false
          ) {
            const sc = placed.scale || 1;
            const distAllowed = radius + (sc - 1) * 85;
            const cx = w * this.tileSize + this.tileSize / 2 + (placed.offsetX || 0);
            const cy = v * this.tileSize + this.tileSize / 2 + (placed.offsetY || 0);
            if (Math.hypot(px - cx, py - cy) <= distAllowed) return true;
          }

          const tile = this.getTile(w, v);
          if (
            tile.prop &&
            (tile.prop.kind === 'campfire' || tile.prop.kind === 'clay_oven') &&
            tile.prop.lit !== false
          ) {
            const sc = tile.prop.scale || 1;
            const distAllowed = radius + (sc - 1) * 85;
            const cx = w * this.tileSize + this.tileSize / 2 + (tile.prop.offsetX || 0);
            const cy = v * this.tileSize + this.tileSize / 2 + (tile.prop.offsetY || 0);
            if (Math.hypot(px - cx, py - cy) <= distAllowed) return true;
          }
        }
      }
      return false;
    }

    getClosestLitCampfire(px, py, maxRadius = 420) {
      const u = Math.round(px / this.tileSize);
      const m = Math.round(py / this.tileSize);
      const c = Math.ceil(maxRadius / this.tileSize) + 2;
      const cacheKey = `${this.isUnderground ? 'c' : 's'}_${u},${m},${maxRadius}`;
      const cached = this.closestCampfireCache.get(cacheKey);
      if (cached && performance.now() - cached.time < 250) {
        return cached.value;
      }

      let closest = null;
      for (let dy = -c; dy <= c; dy++) {
        for (let dx = -c; dx <= c; dx++) {
          const w = u + dx;
          const v = m + dy;
          const key = `${this.isUnderground ? 'cave_' : 'surf_'}${w},${v}`;
          let prop = this.customPlacedProps.get(key);
          if (!prop) {
            const tile = this.getTile(w, v);
            if (tile.prop && (tile.prop.kind === 'campfire' || tile.prop.kind === 'clay_oven')) {
              prop = tile.prop;
            }
          }
          if (prop && (prop.kind === 'campfire' || prop.kind === 'clay_oven') && prop.lit !== false) {
            const sc = prop.scale || 1;
            const lightRad = (this.isUnderground ? 225 : 190) + (sc - 1) * 85;
            const cx = w * this.tileSize + this.tileSize / 2 + (prop.offsetX || 0);
            const cy = v * this.tileSize + this.tileSize / 2 + (prop.offsetY || 0);
            const dist = Math.hypot(px - cx, py - cy);
            if (dist <= maxRadius + lightRad && (!closest || dist < closest.dist)) {
              closest = { fireX: cx, fireY: cy, dist, lightRadius: lightRad, scale: sc };
            }
          }
        }
      }

      if (this.closestCampfireCache.size > 256) {
        this.closestCampfireCache.clear();
      }
      this.closestCampfireCache.set(cacheKey, { time: performance.now(), value: closest });
      return closest;
    }

    isGroundItemCollected(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      return this.collectedGroundItems.has(key);
    }

    collectGroundItem(tx, ty) {
      const key = `${this.isUnderground ? 'cave_' : 'surf_'}${tx},${ty}`;
      this.collectedGroundItems.add(key);
      this.invalidateTile(tx, ty);
    }

    enterCave(seed, entranceCoords) {
      this.surfaceCoords = { x: entranceCoords.x, y: entranceCoords.y };
      this.isUnderground = true;
      this.activeCaveSeed = (this.seed + 88888) >>> 0;
      this.caveWallNoise.seed(this.activeCaveSeed + 404);
      this.caveRoomNoise.seed(this.activeCaveSeed + 505);
      this.caveDetailNoise.seed(this.activeCaveSeed + 606);
      this.clearTileCache();
    }

    exitCave(tx, ty) {
      this.isUnderground = false;
      this.clearTileCache();
      if (tx !== undefined && ty !== undefined) {
        return {
          x: tx * this.tileSize + 14,
          y: ty * this.tileSize + 14
        };
      }
      return this.surfaceCoords;
    }

    getCaveEntranceAt(tx, ty) {
      const key = (tx + 1048576) * 2097152 + (ty + 1048576);
      if (this.knownCaveEntrances.has(key)) {
        return this.knownCaveEntrances.get(key);
      }

      let res = null;
      if (tx === 10 && ty === 8) {
        res = {
          kind: 'cave_entrance',
          namePt: 'Entrada da Caverna dos Cristais',
          subType: 0,
          tx: 10,
          ty: 8
        };
      } else {
        const roll = this.hash2D(tx, ty, 99);
        if ((roll > 0.0075 && roll < 0.0125) || (roll > 0.009 && roll < 0.0105)) {
          const surf = this.getSurfaceTile(tx, ty);
          if (surf && surf.prop && surf.prop.kind === 'cave_entrance') {
            res = {
              kind: 'cave_entrance',
              namePt: surf.prop.namePt || 'Entrada da Caverna',
              subType: surf.prop.subType || 0,
              tx,
              ty
            };
          }
        }
      }

      this.knownCaveEntrances.set(key, res);
      return res;
    }

    getNearbyCaveExit(tx, ty, maxR = 3.6) {
      const rInt = Math.ceil(maxR);
      for (let dy = -rInt; dy <= rInt; dy++) {
        for (let dx = -rInt; dx <= rInt; dx++) {
          const d = Math.hypot(dx, dy);
          if (d <= maxR) {
            const cave = this.getCaveEntranceAt(tx + dx, ty + dy);
            if (cave) return { cave, dist: d, dx, dy };
          }
        }
      }
      return null;
    }

    hash2D(x, y, s = 0) {
      let h = (x * 374761393) ^ (y * 668265263) ^ (this.seed * 31) ^ (s * 1013904223);
      h = (h ^ (h >>> 13)) * 1274126177;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }

    getTile(tx, ty) {
      const key = this._tk(tx, ty, this.isUnderground);
      const cached = this.tileCache.get(key);
      if (cached) return cached;

      if (this.isUnderground) {
        const t = this.getUndergroundTile(tx, ty);
        this.tileCache.set(key, t);
        return t;
      }
      return this.getSurfaceTile(tx, ty);
    }

    getSurfaceTile(tx, ty) {
      const key = this._tk(tx, ty, false);
      const cached = this.tileCache.get(key);
      if (cached) return cached;

      const detailX = this.detailNoise.noise2D(tx * 0.005, ty * 0.005) * 12;
      const detailY = this.detailNoise.noise2D(tx * 0.005 + 77, ty * 0.005 + 77) * 12;
      const warpedX = tx + detailX;
      const warpedY = ty + detailY;

      const rawElev = this.elevNoise.fbm2D(warpedX * 0.0011, warpedY * 0.0011, 2, 2, 0.4);
      const distFromSpawn = Math.hypot(tx, ty);
      const spawnIslandBonus = distFromSpawn < 36 ? (1 - distFromSpawn / 36) * 0.28 : 0;
      let elev = Math.max(0, Math.min(1, rawElev + spawnIslandBonus));

      let isIsland = false;
      let isVolcano = false;
      let volcanoCore = false;

      if (rawElev < 0.24) {
        const isl = this.islandNoise.fbm2D(tx * 0.0022 + 400, ty * 0.0022 + 400, 2, 2, 0.45);
        if (isl > 0.56) {
          isIsland = true;
          const ratio = (isl - 0.56) / 0.44;
          elev = 0.32 + ratio * 0.56;
          const feat = this.featureNoise.fbm2D(tx * 0.0025 + 200, ty * 0.0025 + 200, 2, 2, 0.5);
          if (feat > 0.45) {
            isVolcano = true;
            if (ratio > 0.4 || (feat > 0.58 && elev > 0.55)) {
              volcanoCore = true;
            }
          }
        }
      }

      const temp = this.tempNoise.fbm2D(warpedX * 0.0009 + 150, warpedY * 0.0009 + 150, 2, 2, 0.4);
      const moist = this.moistNoise.fbm2D(warpedX * 0.0012 + 280, warpedY * 0.0012 + 280, 2, 2, 0.4);
      const swampVal = this.featureNoise.fbm2D(tx * 0.003 + 320, ty * 0.003 + 320, 2, 2, 0.5);
      const oasisVal = this.featureNoise.fbm2D(tx * 0.0028 + 560, ty * 0.0028 + 560, 2, 2, 0.5);
      const canyonVal = this.canyonNoise.fbm2D(tx * 0.0028 + 780, ty * 0.0028 + 780, 2, 2, 0.5);
      const lakeVal =
        distFromSpawn < 24
          ? 0
          : this.lakeNoise.fbm2D(warpedX * 0.0078 + 920, warpedY * 0.0078 + 920, 2, 2, 0.45);

      const biome = getBiome(elev, moist, temp, {
        isIsland,
        isVolcano,
        volcanoCore,
        swampVal,
        oasisVal,
        canyonVal,
        lakeVal
      });

      const detailHash = this.hash2D(tx, ty, 7);
      const propKey = `surf_${tx},${ty}`;
      let prop = null;

      if (this.customPlacedProps.has(propKey)) {
        prop = { ...this.customPlacedProps.get(propKey) };
        const inter = this.interactedProps.get(propKey) || this.interactedProps.get(`${tx},${ty}`);
        if (inter && inter.lit !== undefined) {
          prop.lit = inter.lit;
          if (prop.lit) {
            prop.namePt = 'Fogueira Crepitante';
            prop.descriptionPt = 'Uma fogueira aquecida e crepitante. Pressione [E] para descansar e restaurar vigor.';
          } else {
            prop.namePt = 'Fogueira de Acampamento (Apagada)';
            prop.descriptionPt = 'Uma fogueira montada com 10 galhos secos. Pressione [E] tendo 2 Pederneiras para acendê-la com faíscas!';
          }
        }
        if (inter && inter.roastingFish) {
          prop.roastingFish = inter.roastingFish;
        }
      } else {
        prop = this.generateProp(tx, ty, biome, detailHash, elev);
        if (prop && prop.kind === 'campfire') {
          const inter = this.interactedProps.get(propKey) || this.interactedProps.get(`${tx},${ty}`);
          if (inter && inter.roastingFish) {
            prop.roastingFish = inter.roastingFish;
          }
        }
      }

      const tile = {
        tx,
        ty,
        elevation: elev,
        moisture: moist,
        temperature: temp,
        biome,
        prop,
        detailHash
      };

      this.tileCache.set(key, tile);
      return tile;
    }

    getUndergroundTile(tx, ty) {
      const detailHash = this.hash2D(tx, ty, 97);
      const thisCave = this.getCaveEntranceAt(tx, ty);

      if (thisCave) {
        const cleanName = thisCave.namePt
          .replace('Entrada da ', '')
          .replace('Boca da ', '')
          .replace('Fenda da ', '');
        return {
          tx,
          ty,
          elevation: 0.1,
          moisture: 0.6,
          temperature: 0.45,
          biome: BIOMES.CAVE_FLOOR,
          prop: {
            kind: 'cave_exit',
            subType: thisCave.subType || 0,
            targetTx: tx,
            targetTy: ty,
            offsetX: 0,
            offsetY: -4,
            scale: 1.35,
            interactive: true,
            namePt: `Saída da Caverna [${cleanName}]`,
            descriptionPt: `Portal rochoso em arco conectado com a superfície em [${tx}, ${ty}] (${thisCave.namePt}). Pressione [E] para emergir no mundo superior!`
          },
          detailHash
        };
      }

      const nearExit = this.getNearbyCaveExit(tx, ty, 3.5);
      const nearConnector = this.getNearbyCaveExit(tx, ty, 6.5);
      const isConnectorHall =
        nearConnector &&
        (Math.abs(nearConnector.dx) <= 1.4 || Math.abs(nearConnector.dy) <= 1.4);

      const wallVal = Math.abs(this.caveWallNoise.noise2D(tx * 0.07, ty * 0.07));
      const roomVal = this.caveRoomNoise.noise2D(tx * 0.04, ty * 0.04);
      const fDetail = this.caveDetailNoise.noise2D(tx * 0.08, ty * 0.08);

      const isOpen =
        !!nearExit || isConnectorHall || wallVal < 0.15 || roomVal > 0.46;

      if (!isOpen) {
        return {
          tx,
          ty,
          elevation: 0.9,
          moisture: 0.2,
          temperature: 0.4,
          biome: BIOMES.CAVE_WALL,
          prop: null,
          detailHash
        };
      }

      let caveBiome = BIOMES.CAVE_FLOOR;
      if (fDetail < -0.45 && roomVal > 0.35) {
        caveBiome = BIOMES.CAVE_LAKE;
      } else if (fDetail > 0.45 && roomVal > 0.35) {
        caveBiome = BIOMES.CAVE_CRYSTAL;
      } else if (roomVal > 0.42 && fDetail < -0.15) {
        caveBiome = BIOMES.CAVE_MUSHROOM;
      }

      let prop = null;
      if (nearExit && nearExit.dist > 1.8 && detailHash < 0.08) {
        prop = {
          kind: 'stalagmite',
          subType: 0,
          offsetX: detailHash * 8 - 4,
          offsetY: ((detailHash * 13) % 8) - 4,
          scale: 0.85
        };
      }

      const roll = this.hash2D(tx, ty, 77);
      const interKey = `underground_${tx},${ty}`;
      const inter = this.interactedProps.get(interKey);

      if (!nearExit && caveBiome.id !== 'CAVE_LAKE') {
        if (caveBiome.id === 'CAVE_CRYSTAL' && roll < 0.09) {
          const gemIdx = Math.floor(this.hash2D(tx, ty, 88) * 4);
          const isOpened = inter ? inter.opened : false;
          const gems = ['Ametista', 'Safira', 'Rubi', 'Esmeralda'];
          prop = {
            kind: 'crystal_cluster',
            subType: gemIdx,
            offsetX: (this.hash2D(tx, ty, 91) - 0.5) * 8,
            offsetY: (this.hash2D(tx, ty, 93) - 0.5) * 8,
            scale: 0.95 + this.hash2D(tx, ty, 95) * 0.25,
            interactive: !isOpened,
            opened: isOpened,
            namePt: isOpened ? 'Formação Mineral (Minerada)' : `Drusa de ${gems[gemIdx]}`,
            descriptionPt: isOpened
              ? 'Esta formação rochosa já foi minerada.'
              : 'Pressione [E] ou Interagir para extrair minerais!'
          };
        } else if (caveBiome.id === 'CAVE_MUSHROOM' && roll < 0.07) {
          prop = {
            kind: 'glowing_mushroom',
            subType: Math.floor(this.hash2D(tx, ty, 82) * 2),
            offsetX: (this.hash2D(tx, ty, 84) - 0.5) * 8,
            offsetY: (this.hash2D(tx, ty, 86) - 0.5) * 8,
            scale: 0.85 + this.hash2D(tx, ty, 87) * 0.25,
            interactive: true,
            namePt: 'Fungo das Profundezas',
            descriptionPt: 'Esporos fosforescentes muito tênues crescendo na rocha úmida.'
          };
        } else if (caveBiome.id === 'CAVE_FLOOR' && roll < 0.008) {
          const isOpened = inter ? inter.opened : false;
          prop = {
            kind: 'chest',
            subType: 1,
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            interactive: !isOpened,
            opened: isOpened,
            namePt: isOpened ? 'Baú do Mineiro Perdido (Aberto)' : 'Baú do Mineiro Perdido',
            descriptionPt: isOpened
              ? 'Você já abriu este baú.'
              : 'Pressione [E] para abrir e saquear mantimentos subterrâneos!'
          };
        }
      }

      return {
        tx,
        ty,
        elevation: 0.15,
        moisture: 0.6,
        temperature: 0.45,
        biome: caveBiome,
        prop,
        detailHash
      };
    }

    generateProp(tx, ty, biome, hash, elev) {
      const key = `${tx},${ty}`;
      const inter = this.interactedProps.get(key);

      if (biome.hasWater) {
        if (hash < 0.016 && (biome.id === 'COAST_WATER' || biome.id.includes('LAKE'))) {
          return {
            kind: 'rock',
            subType: 0,
            offsetX: hash * 10 - 5,
            offsetY: hash * 12 - 6,
            scale: 0.7
          };
        }
        return null;
      }

      // Caverna garantida em (10, 8)
      if (tx === 10 && ty === 8) {
        return {
          kind: 'cave_entrance',
          subType: 0,
          offsetX: 0,
          offsetY: -4,
          scale: 1.35,
          interactive: true,
          namePt: 'Entrada da Caverna dos Cristais',
          descriptionPt: 'Uma entrada rochosa imponente que desce para galerias subterrâneas inexploradas. Pressione [E] para entrar e explorar!'
        };
      }

      const poiRoll = this.hash2D(tx, ty, 99);

      // Altares/Santuários mágicos
      if (poiRoll < 0.0018 && elev > 0.42 && elev < 0.8) {
        const isAct = inter && inter.activated;
        return {
          kind: 'shrine',
          subType: 0,
          offsetX: 0,
          offsetY: -4,
          scale: 1.2,
          interactive: true,
          activated: isAct,
          namePt: 'Santuário de Cristal Ancestral',
          descriptionPt: isAct
            ? 'O santuário pulsa com bênçãos radiantes ativadas!'
            : 'Pressione [E] ou Interagir para despertar a bênção mágica do santuário.'
        };
      }

      // Fogueiras naturais
      if (poiRoll > 0.0018 && poiRoll < 0.0035 && biome.category !== 'ocean' && biome.category !== 'water') {
        return {
          kind: 'campfire',
          subType: 0,
          offsetX: 0,
          offsetY: 2,
          scale: 1,
          interactive: true,
          lit: inter ? inter.lit !== false : true,
          namePt: 'Acampamento de Viajante',
          descriptionPt: 'Uma fogueira crepitante aconchegante. Pressione [E] para descansar.'
        };
      }

      // Baús de tesouro
      if (poiRoll > 0.0035 && poiRoll < 0.0055 && biome.category !== 'ocean' && biome.category !== 'water') {
        const isOpened = inter ? inter.opened : false;
        return {
          kind: 'chest',
          subType: 0,
          offsetX: 0,
          offsetY: 0,
          scale: 1,
          interactive: !isOpened,
          opened: isOpened,
          namePt: isOpened ? 'Baú de Relíquias (Aberto)' : 'Baú de Relíquias Antigo',
          descriptionPt: isOpened
            ? 'Você já recolheu o tesouro deste baú!'
            : 'Pressione [E] ou Interagir para abrir o baú e obter tesouros!'
        };
      }

      // Pilares de ruínas
      if (
        poiRoll > 0.0055 &&
        poiRoll < 0.0075 &&
        (biome.id === 'MEADOW' || biome.id === 'SNOW_PEAK' || biome.id === 'FOREST')
      ) {
        return {
          kind: 'ruin_pillar',
          subType: Math.floor(this.hash2D(tx, ty, 13) * 2),
          offsetX: 0,
          offsetY: -6,
          scale: 1.1,
          interactive: true,
          namePt: 'Pilar em Ruínas de Pedra Mágica',
          descriptionPt: 'Inscrições rúnicas esquecidas esculpidas em granito ancestral.'
        };
      }

      // Cavernas procedurais
      if (
        (biome.id === 'SNOW_PEAK' || biome.id === 'VOLCANIC' || elev > 0.65) &&
        poiRoll > 0.0075 &&
        poiRoll < 0.0125
      ) {
        return {
          kind: 'cave_entrance',
          subType: 0,
          offsetX: 0,
          offsetY: -4,
          scale: 1.3,
          interactive: true,
          namePt: 'Boca da Caverna das Montanhas',
          descriptionPt: 'Uma caverna escura esculpida na rocha com brisa gelada emanando do interior. Pressione [E] para entrar e explorar!'
        };
      }

      // Vegetação e árvores pelo bioma
      const treeRoll = this.hash2D(tx, ty, 23);
      const subRoll = this.hash2D(tx, ty, 41);
      const offX = (this.hash2D(tx, ty, 53) - 0.5) * 12;
      const offY = (this.hash2D(tx, ty, 67) - 0.5) * 12;

      let treeDensity = 0.08;
      if (biome.id === 'FOREST') treeDensity = 0.22;
      if (biome.id === 'DEEP_FOREST') treeDensity = 0.38;
      if (biome.id === 'SWAMP') treeDensity = 0.16;
      if (biome.id === 'SNOW_TAIGA') treeDensity = 0.20;
      if (biome.id === 'BEACH' || biome.id === 'OASIS') treeDensity = 0.10;
      if (biome.id === 'DESERT' || biome.id === 'SNOW_PEAK') treeDensity = 0.03;

      if (treeRoll < treeDensity && biome.prop && biome.prop !== 'none') {
        let kind = 'tree_oak';
        if (biome.prop === 'pine') kind = 'tree_pine';
        else if (biome.prop === 'palm') kind = 'tree_palm';
        else if (biome.prop === 'cactus') kind = 'cactus';
        else if (biome.prop === 'willow') kind = 'tree_willow';
        else if (biome.prop === 'burnt') kind = 'tree_burnt';

        return {
          kind,
          subType: Math.floor(subRoll * 3),
          offsetX: offX,
          offsetY: offY - 8,
          scale: 0.9 + subRoll * 0.3
        };
      }

      // Pedras
      if (treeRoll < treeDensity + 0.04) {
        return {
          kind: 'rock',
          subType: Math.floor(subRoll * 3),
          offsetX: offX,
          offsetY: offY,
          scale: 0.8 + subRoll * 0.4
        };
      }

      // Cogumelos ou flores
      if (treeRoll < treeDensity + 0.07) {
        if ((biome.id === 'SWAMP' || biome.id === 'DEEP_FOREST') && subRoll < 0.45) {
          return {
            kind: 'mushroom',
            subType: Math.floor(subRoll * 4),
            offsetX: offX,
            offsetY: offY,
            scale: 0.85
          };
        }
        return {
          kind: subRoll < 0.33 ? 'flower_red' : subRoll < 0.66 ? 'flower_blue' : 'flower_yellow',
          subType: Math.floor(subRoll * 2),
          offsetX: offX,
          offsetY: offY,
          scale: 0.8 + subRoll * 0.3
        };
      }

      return null;
    }

    interactWithTile(tx, ty) {
      const tile = this.getTile(tx, ty);
      if (!tile.prop || !tile.prop.interactive) return null;

      const key = this.isUnderground ? `underground_${tx},${ty}` : `${tx},${ty}`;
      const existing = this.interactedProps.get(key) || {};

      if (tile.prop.kind === 'cave_entrance') {
        return {
          success: true,
          action: 'enter_cave',
          entranceTx: tx,
          entranceTy: ty,
          message: 'Descendo para o labirinto de cavernas subterrâneas...',
          reward: 'Caverna Descoberta (+100 XP)'
        };
      }

      if (tile.prop.kind === 'cave_exit') {
        return {
          success: true,
          action: 'exit_cave',
          targetTx: tile.prop.targetTx !== undefined ? tile.prop.targetTx : tx,
          targetTy: tile.prop.targetTy !== undefined ? tile.prop.targetTy : ty,
          message: 'Atravessando o portal de pedra de volta à luz da superfície!',
          reward: 'Retorno à Superfície'
        };
      }

      if (tile.prop.kind === 'chest') {
        if (tile.prop.opened) {
          return {
            success: false,
            message: 'Este baú já foi saqueado.'
          };
        }
        tile.prop.opened = true;
        this.interactedProps.set(key, { ...existing, opened: true });
        this.invalidateTile(tx, ty);
        return {
          success: true,
          action: 'open_chest',
          message: 'Você abriu o baú antigo!',
          goldReward: Math.floor(25 + this.hash2D(tx, ty, 5) * 35)
        };
      }

      if (tile.prop.kind === 'shrine') {
        tile.prop.activated = true;
        this.interactedProps.set(key, { ...existing, activated: true });
        this.invalidateTile(tx, ty);
        return {
          success: true,
          action: 'activate_shrine',
          message: 'A luz arcana do santuário preenche sua alma!',
          healAmount: 100
        };
      }

      return null;
    }

    getGroundItemAt(tx, ty) {
      if (this.isGroundItemCollected(tx, ty)) return null;
      const tile = this.getTile(tx, ty);
      if (tile.prop && (tile.prop.kind.startsWith('tree_') || tile.prop.kind === 'shrine')) {
        return null;
      }
      if (tile.biome.hasWater && !tile.biome.passable) return null;

      const hash = this.hash2D(tx, ty, 107);
      if (hash > 0.08) return null;

      // Spawn probabilístico baseado no terreno
      if (tile.biome.id.includes('LAKE') || tile.biome.id === 'COAST_WATER' || tile.biome.id === 'SWAMP') {
        if (hash < 0.03) {
          return {
            id: `item_argila_${tx}_${ty}`,
            name: 'Argila Úmida',
            categoryType: 'material',
            color: '#a16207',
            icon: '🧱',
            rarity: 'comum',
            value: 2,
            stackCount: 1
          };
        }
      }

      if (tile.biome.prop === 'oak' || tile.biome.prop === 'willow' || tile.biome.id.includes('FOREST')) {
        if (hash < 0.04) {
          return {
            id: `item_galho_${tx}_${ty}`,
            name: 'Galho de Madeira',
            categoryType: 'equipment',
            slot: 'mao_direita',
            isEquippable: true,
            stats: { attack: 5 },
            color: '#854d0e',
            icon: '🪵',
            rarity: 'comum',
            value: 1,
            stackCount: 1
          };
        }
        if (hash < 0.06) {
          return {
            id: `item_fibra_${tx}_${ty}`,
            name: 'Fibra Vegetal',
            categoryType: 'material',
            color: '#84cc16',
            icon: '🌿',
            rarity: 'comum',
            value: 1,
            stackCount: 1
          };
        }
      }

      if (tile.elevation > 0.5 || tile.biome.id === 'CANYON' || tile.biome.id === 'SNOW_PEAK') {
        if (hash < 0.04) {
          return {
            id: `item_seixo_${tx}_${ty}`,
            name: 'Seixo de Pedra',
            categoryType: 'material',
            color: '#94a3b8',
            icon: '⚪',
            rarity: 'comum',
            value: 1,
            stackCount: 1
          };
        }
        if (hash < 0.06) {
          return {
            id: `item_pederneira_${tx}_${ty}`,
            name: 'Pederneira',
            categoryType: 'material',
            color: '#e2e8f0',
            icon: '✨',
            rarity: 'incomum',
            value: 3,
            stackCount: 1
          };
        }
      }

      return null;
    }
  }

  G.World = World;
  G.world = new World();
})(window.Game);
