/* js/core/world.js
 * Mundo procedural: classe World (tiles, cavernas, fogueiras, panela) + item de argila (Gu).
 * Trecho de legacy/app.original.js (linhas 16198-18018); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const Gu = {
    id: "item_argila",
    name: "Argila Úmida",
    difficulty: "media",
    difficultyLabel: RESOURCE_DIFFICULTY.media.label,
    rarity: "comum",
    description:
      "Massa terrosa densa, plástica e maleável colhida nas margens e leitos sedimentares de lagoas. Excelente para moldar cerâmicas, vasos impermeáveis, tijolos e recipientes alquímicos.",
    whereFound: "Margens e leitos argilosos de lagoas e açudes",
    categoryType: "material",
    icon: "🧱",
    color: "#c2410c",
    value: 4,
    stackSize: 99,
    canSpawnAt: (e) =>
      !e.isClayZone || (e.tile.biome.hasWater && !e.tile.biome.passable)
        ? !1
        : e.hash < RESOURCE_DIFFICULTY.media.spawnChance * 1.6,
    render: (e, t, l, o, u = 0) => {
      (e.save(),
        e.translate(t, l),
        (e.fillStyle = "rgba(67, 20, 7, 0.32)"),
        e.beginPath(),
        e.ellipse(0, 3.5 * o, 7 * o, 3.8 * o, 0, 0, Math.PI * 2),
        e.fill());
      const m = Math.sin(u * 2.5 + t * 0.1) * 0.15 + 0.85;
      ((e.strokeStyle = "rgba(254, 215, 170, 0.35)"),
        (e.lineWidth = 1 * o),
        e.beginPath(),
        e.ellipse(0, 3.5 * o, 8.5 * o * m, 4.2 * o * m, 0, 0, Math.PI * 2),
        e.stroke(),
        (e.fillStyle = "#7c2d12"),
        e.beginPath(),
        e.ellipse(0, 0.5 * o, 6.2 * o, 4.5 * o, -0.08, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#9a3412"),
        e.beginPath(),
        e.ellipse(-1.2 * o, -0.8 * o, 5 * o, 3.6 * o, -0.15, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#c2410c"),
        e.beginPath(),
        e.ellipse(0.5 * o, -1.8 * o, 4.2 * o, 3 * o, 0.12, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#9a3412"),
        e.beginPath(),
        e.ellipse(3.8 * o, 1.2 * o, 2.6 * o, 2 * o, 0.3, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "#c2410c"),
        e.beginPath(),
        e.ellipse(3.5 * o, 0.8 * o, 2 * o, 1.5 * o, 0.25, 0, Math.PI * 2),
        e.fill(),
        (e.strokeStyle = "#431407"),
        (e.lineWidth = 1.1 * o),
        e.beginPath(),
        e.arc(-0.8 * o, -0.5 * o, 2.2 * o, 0.3, Math.PI * 0.9),
        e.stroke(),
        (e.fillStyle = "#ea580c"),
        e.beginPath(),
        e.ellipse(-1 * o, -2.6 * o, 2.8 * o, 1.6 * o, -0.2, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(255, 247, 237, 0.82)"),
        e.beginPath(),
        e.ellipse(-1.5 * o, -3 * o, 1.4 * o, 0.7 * o, -0.3, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(254, 215, 170, 0.6)"),
        e.beginPath(),
        e.arc(1.2 * o, -2 * o, 0.8 * o, 0, Math.PI * 2),
        e.fill());
      const c = Math.sin(u * 3.5 + l * 0.2);
      if (c > 0.78) {
        const f = (c - 0.78) / 0.22;
        ((e.fillStyle = `rgba(255, 255, 255, ${f * 0.95})`),
          e.beginPath(),
          e.arc(-1.2 * o, -3.2 * o, 1.2 * o, 0, Math.PI * 2),
          e.fill());
      }
      e.restore();
    },
  };
  class World {
    constructor(t = 4289) {
      ((this.tileSize = 36),
        (this.isUnderground = !1),
        (this.activeCaveSeed = 0),
        (this.surfaceCoords = { x: 0, y: 0 }),
        (this.minedCrystals = 0),
        (this.interactedProps = new Map()),
        (this.collectedGroundItems = new Set()),
        (this.customPlacedProps = new Map()),
        (this.tileCache = new Map()),
        (this.closestCampfireCache = new Map()),
        (this.seed = t),
        (this.elevNoise = new SimplexNoise(t)),
        (this.moistNoise = new SimplexNoise(t + 101)),
        (this.tempNoise = new SimplexNoise(t + 202)),
        (this.detailNoise = new SimplexNoise(t + 303)),
        (this.caveWallNoise = new SimplexNoise(t + 404)),
        (this.caveRoomNoise = new SimplexNoise(t + 505)),
        (this.caveDetailNoise = new SimplexNoise(t + 606)),
        (this.islandNoise = new SimplexNoise(t + 707)),
        (this.featureNoise = new SimplexNoise(t + 808)),
        (this.canyonNoise = new SimplexNoise(t + 909)),
        (this.lakeNoise = new SimplexNoise(t + 1010)),
        (typeof PortCity !== "undefined" && PortCity.setSeed && PortCity.setSeed(t, this)),
        (typeof SnowPeakCity !== "undefined" && SnowPeakCity.setSeed && SnowPeakCity.setSeed(t, this)),
        (typeof DesertCity !== "undefined" && DesertCity.setSeed && DesertCity.setSeed(t, this)),
        (this.undergroundLevel = 0),
        (this.timeOfDay = 0.5),
        (this.nightCount = 0),
        (this.playerCabins = []),
        (this._dungeonStairCache = new Map()));
    }
    setSeed(t) {
      ((this.seed = t),
        this.elevNoise.seed(t),
        this.moistNoise.seed(t + 101),
        this.tempNoise.seed(t + 202),
        this.detailNoise.seed(t + 303),
        this.caveWallNoise.seed(t + 404),
        this.caveRoomNoise.seed(t + 505),
        this.caveDetailNoise.seed(t + 606),
        this.islandNoise.seed(t + 707),
        this.featureNoise.seed(t + 808),
        this.canyonNoise.seed(t + 909),
        this.lakeNoise.seed(t + 1010),
        (typeof PortCity !== "undefined" && PortCity.setSeed && PortCity.setSeed(t, this)),
        (typeof SnowPeakCity !== "undefined" && SnowPeakCity.setSeed && SnowPeakCity.setSeed(t, this)),
        (typeof DesertCity !== "undefined" && DesertCity.setSeed && DesertCity.setSeed(t, this)),
        this._clearMountainCaches && this._clearMountainCaches(),
        this.interactedProps.clear(),
        this.collectedGroundItems.clear(),
        this.customPlacedProps.clear(),
        (this.playerCabins = []),
        (this.timeOfDay = 0.5),
        (this.nightCount = 0),
        this._dungeonStairCache && this._dungeonStairCache.clear(),
        this.clearTileCache(),
        (this.isUnderground = !1),
        (this.undergroundLevel = 0));
    }
    _tk(t, l, c) {
      const lvl = typeof c === "number" ? c : (c ? (this.undergroundLevel || 1) : 0);
      return Number.isInteger(t) &&
        Number.isInteger(l) &&
        t > -1048576 &&
        t < 1048576 &&
        l > -1048576 &&
        l < 1048576
        ? (t + 1048576) * 2097152 + (l + 1048576) + lvl * 4398046511104
        : `${lvl}_${t},${l}`;
    }
    invalidateTile(t, l) {
      (this.tileCache.delete(this._tk(t, l, 0)),
        this.tileCache.delete(this._tk(t, l, 1)),
        this.tileCache.delete(this._tk(t, l, 2)),
        this.tileCache.delete(this._tk(t, l, 3)),
        this.closestCampfireCache.clear());
    }
    clearTileCache() {
      (this.tileCache.clear(),
        this.closestCampfireCache.clear(),
        this.knownCaveEntrances && this.knownCaveEntrances.clear(),
        this.mergedCaveCache && this.mergedCaveCache.clear(),
        this.rawCaveCandidateCache && this.rawCaveCandidateCache.clear(),
        this._desertGeodeCache && this._desertGeodeCache.clear());
    }
    getCachedTileCount() {
      return this.tileCache.size;
    }
    pruneTileCache(t, l, o = 50, u = 2400) {
      if (this.tileCache.size <= u) return 0;
      const m = o * o;
      let c = 0;
      for (const [f, g] of this.tileCache.entries()) {
        const y = g.tx - t,
          w = g.ty - l;
        y * y + w * w > m && (this.tileCache.delete(f), c++);
      }
      return c;
    }
    exportSaveData() {
      return {
        interactedProps: Array.from(this.interactedProps.entries()),
        customPlacedProps: Array.from(this.customPlacedProps.entries()),
        collectedGroundItems: Array.from(this.collectedGroundItems.values()),
        playerCabins: this.playerCabins ? [...this.playerCabins] : [],
        timeOfDay: this.timeOfDay,
        nightCount: this.nightCount,
      };
    }
    importSaveData(t) {
      (t.interactedProps && (this.interactedProps = new Map(t.interactedProps)),
        t.customPlacedProps &&
          (this.customPlacedProps = new Map(t.customPlacedProps)),
        t.collectedGroundItems &&
          (this.collectedGroundItems = new Set(t.collectedGroundItems)),
        t.playerCabins && (this.playerCabins = Array.isArray(t.playerCabins) ? [...t.playerCabins] : []),
        typeof t.timeOfDay === "number" && (this.timeOfDay = t.timeOfDay),
        Number.isFinite(t.nightCount) && (this.nightCount = Math.max(0, Math.floor(t.nightCount))),
        this.clearTileCache());
    }
    setTimeState(timeOfDay, nightCount) {
      const rawTime = Number(timeOfDay);
      const nextTime = (((Number.isFinite(rawTime) ? rawTime : 0.5) % 1) + 1) % 1;
      const nextNight = Math.max(0, Math.floor(Number(nightCount) || 0));
      const spawnWindowChanged = Math.floor(nextNight / 4) !== Math.floor(this.nightCount / 4);
      this.timeOfDay = nextTime;
      this.nightCount = nextNight;
      if (spawnWindowChanged) this.clearTileCache();
    }
    isNight() {
      return this.isUnderground || this.timeOfDay < 0.2 || this.timeOfDay > 0.8;
    }
    // [PERF] getTile() chama isto para TODO tile de montanha a cada acesso (todo frame, todo tile visivel).
    // A parte geometrica nao muda para uma seed, entao e calculada uma vez por tile.
    _isBluePlantPeak(t, l, tile) {
      if (!tile || tile.biome.id !== BiomeId.MOUNTAIN_25D || tile.isCliffWall) return false;
      let cache = this._bluePeakCache;
      if (!cache) cache = this._bluePeakCache = new Map();
      const k = this._mk(t, l);
      const hit = cache.get(k);
      if (hit !== void 0) return hit;
      const r = this._computeBluePlantPeak(t, l);
      if (cache.size > 200000) cache.clear();
      cache.set(k, r);
      return r;
    }
    _computeBluePlantPeak(t, l) {
      const bounds = this._getMountain25DBounds(t, l);
      const centerX = Math.round(bounds.centerX),
        centerY = Math.round(bounds.centerY),
        offsets = [
          [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
          [2, 0], [-2, 0], [0, 2], [0, -2], [1, 1], [-1, 1], [1, -1], [-1, -1],
          [3, 0], [-3, 0], [0, 3], [0, -3], [2, 1], [-2, 1], [2, -1], [-2, -1],
          [1, 2], [-1, 2], [1, -2], [-1, -2],
        ];
      let topTier = 0;
      for (const [dx, dy] of offsets) {
        topTier = Math.max(topTier, this._getMountain25DInfo(centerX + dx, centerY + dy).tier);
      }
      if (!topTier) return false;
      for (const [dx, dy] of offsets) {
        const px = centerX + dx,
          py = centerY + dy,
          candidate = this._getMountain25DInfo(px, py);
        if (candidate.tier !== topTier) continue;
        let clearTop = true;
        for (let oy = -4; oy <= 4 && clearTop; oy++) {
          for (let ox = -4; ox <= 4; ox++) {
            if (this._getMountain25DInfo(px + ox, py + oy).tier < topTier) {
              clearTop = false;
              break;
            }
          }
        }
        if (clearTop) return t === px && l === py;
      }
      return false;
    }
    _syncBluePlantProp(t, l, tile) {
      if (this.isUnderground || !this._isBluePlantPeak(t, l, tile)) return tile;
      const state = this.interactedProps.get(`${t},${l}`) || {};
      const canRespawn = !state.collected || this.nightCount >= (state.collectedNight ?? 0) + 4;
      if (!canRespawn) return tile;
      if (state.collected) {
        this.interactedProps.set(`${t},${l}`, { ...state, collected: false, bluePlantFlowered: false });
      }
      if (this.isNight() && !state.bluePlantFlowered && !state.collected) {
        this.interactedProps.set(`${t},${l}`, { ...state, bluePlantFlowered: true, bluePlantStage: "flower" });
      }
      if (!tile.prop || tile.prop.kind === "rock" || tile.prop.kind.startsWith("flower_")) {
        tile.prop = {
          kind: "blue_plant",
          offsetX: 0,
          offsetY: 0,
          scale: 0.95,
          interactive: true,
          namePt: "Planta Azul do Luar",
          stage: this.isNight() ? "flower" : "branch",
          descriptionPt: this.isNight()
            ? "Flor azul rara, aberta somente à noite no ponto mais alto das montanhas de pedra. Pressione [F] para colher."
            : "Ramo azul raro que pode aparecer durante o dia e só dá flor à noite. Pressione [F] para colher.",
        };
      }
      return tile;
    }
    getNearbyWoodLogPile(px, py, maxDist = 90, minCount = 5) {
      if (this.isUnderground) return null;
      const maxDistSq = maxDist * maxDist;
      const pTx = Math.floor(px / this.tileSize);
      const pTy = Math.floor(py / this.tileSize);
      const r = Math.ceil(maxDist / this.tileSize);
      let best = null,
        bestDist = Infinity;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const tx = pTx + dx,
            ty = pTy + dy;
          const prop = this.getPlacedProp(tx, ty) || (this.getTile(tx, ty) && this.getTile(tx, ty).prop);
          if (prop && prop.kind === "wood_log" && (prop.count || 1) >= minCount) {
            const cx = (tx + 0.5) * this.tileSize;
            const cy = (ty + 0.5) * this.tileSize;
            const distSq = (cx - px) * (cx - px) + (cy - py) * (cy - py);
            if (distSq <= maxDistSq && distSq < bestDist) {
              bestDist = distSq;
              best = { tx, ty, prop };
            }
          }
        }
      }
      return best;
    }
    isPlayerInsideCabin(px, py) {
      if (this.isUnderground || !this.playerCabins) return null;
      const ts = this.tileSize;
      for (let i = 0; i < this.playerCabins.length; i++) {
        const c = this.playerCabins[i];
        const minX = (c.originTx + 0.25) * ts;
        const maxX = (c.originTx + c.width - 0.25) * ts;
        const minY = (c.originTy + 0.25) * ts;
        const maxY = (c.originTy + c.height - 0.3) * ts;
        if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
          return c;
        }
      }
      return null;
    }
    isCabinPlacementValid(originTx, originTy, width = 4, height = 4) {
      if (this.isUnderground) return false;
      for (let x = originTx; x < originTx + width; x++) {
        for (let y = originTy; y < originTy + height; y++) {
          const tile = this.getTile(x, y);
          if (
            !tile ||
            !tile.biome ||
            tile.biome.hasWater ||
            tile.isCliffWall ||
            tile.isGreekWall ||
            tile.isSnowCityWall ||
            tile.isDesertCityWall ||
            tile.isPortCityWall ||
            (tile.prop &&
              typeof tile.prop.kind === "string" &&
              (tile.prop.kind.includes("wall") ||
                tile.prop.kind.includes("door") ||
                tile.prop.kind === "cave_entrance" ||
                tile.prop.kind === "large_rock" ||
                tile.prop.kind === "shrine"))
          ) {
            return false;
          }
        }
      }
      return true;
    }
    isChestPlacementValid(tx, ty) {
      const tile = this.getTile(tx, ty);
      if (
        !tile ||
        !tile.biome ||
        !tile.biome.passable ||
        tile.biome.hasWater ||
        tile.isCliffWall ||
        tile.isGreekWall ||
        tile.isSnowCityWall ||
        tile.isDesertCityWall ||
        tile.isPortCityWall ||
        tile.isSnowCityCollider ||
        tile.isDesertCityCollider ||
        tile.isPortCityCollider
      ) {
        return false;
      }
      if (tile.prop) {
        const k = tile.prop.kind;
        if (k !== "cabin_floor" && k !== "flower_patch") {
          return false;
        }
      }
      return true;
    }
    buildPlayerChest(tx, ty, initialItems) {
      if (!this.isChestPlacementValid(tx, ty)) {
        return {
          success: false,
          message: "⚠️ Local inválido para o baú! Escolha um piso ou terreno livre sem obstáculos.",
        };
      }
      const existingTile = this.getTile(tx, ty);
      const underlyingCabinId =
        existingTile && existingTile.prop && existingTile.prop.kind === "cabin_floor"
          ? existingTile.prop.cabinId
          : null;
      const chestId = "chest_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      const chestProp = {
        kind: "wooden_chest",
        chestId,
        cabinId: underlyingCabinId,
        onCabinFloor: !!underlyingCabinId,
        subType: 0,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        interactive: true,
        opened: false,
        storageItems: Array.isArray(initialItems) ? [...initialItems] : [],
        maxSlots: 12,
        namePt: "Baú de Madeira (0/12)",
        descriptionPt:
          "Baú de carvalho construído pelo jogador. Guarda até 12 itens com segurança. Pressione [F] para abrir!",
      };
      this.placeProp(tx, ty, chestProp);
      this.invalidateTile(tx, ty);
      return {
        success: true,
        chestProp,
        message: "📦 Baú de Madeira posicionado no mapa! Pressione [F] perto dele para guardar ou retirar até 12 itens.",
      };
    }
    updateWoodenChestStorage(tx, ty, newItems, isOpen) {
      const prop = this.getPlacedProp(tx, ty) || (this.getTile(tx, ty) && this.getTile(tx, ty).prop);
      if (!prop || prop.kind !== "wooden_chest") return false;
      const items = Array.isArray(newItems) ? [...newItems] : [];
      const maxSlots = prop.maxSlots || 12;
      const updated = {
        ...prop,
        storageItems: items,
        opened: isOpen !== undefined ? !!isOpen : prop.opened,
        namePt: `Baú de Madeira (${items.length}/${maxSlots})`,
      };
      this.placeProp(tx, ty, updated);
      this.invalidateTile(tx, ty);
      return updated;
    }
    buildCabin(pileTx, pileTy, customOriginTx, customOriginTy) {
      if (this.isUnderground) return { success: false, message: "Cabanas só podem ser construídas na superfície!" };
      const prop = this.getPlacedProp(pileTx, pileTy) || (this.getTile(pileTx, pileTy) && this.getTile(pileTx, pileTy).prop);
      if (!prop || prop.kind !== "wood_log" || (prop.count || 1) < 5) {
        return { success: false, message: "Você precisa de pelo menos 5 troncos na pilha para construir a cabana!" };
      }
      const width = 4;
      const height = 4;
      let originTx = typeof customOriginTx === "number" ? customOriginTx : pileTx - 1;
      let originTy = typeof customOriginTy === "number" ? customOriginTy : pileTy - 2;
      if (typeof customOriginTx !== "number" || typeof customOriginTy !== "number") {
        const candidateOrigins = [
          [pileTx - 1, pileTy - 2],
          [pileTx - 2, pileTy - 2],
          [pileTx - 1, pileTy - 1],
          [pileTx - 2, pileTy - 1],
          [pileTx, pileTy - 2],
        ];
        for (const [cx, cy] of candidateOrigins) {
          if (this.isCabinPlacementValid(cx, cy, width, height)) {
            originTx = cx;
            originTy = cy;
            break;
          }
        }
      } else if (!this.isCabinPlacementValid(originTx, originTy, width, height)) {
        return {
          success: false,
          message: "⚠️ Local inválido para construir! Escolha uma área plana sem água, paredões ou outras construções.",
        };
      }
      const doorTx = originTx + 1;
      const doorTy = originTy + 3;
      const curCount = prop.count || 1;
      if (curCount > 5) {
        prop.count = curCount - 5;
        prop.namePt = prop.count > 1 ? `Pilha de Troncos (${prop.count})` : "Tronco de Madeira";
        prop.descriptionPt = `Pilha com ${prop.count} troncos de madeira no chão. Pressione [F] para recolher.`;
        this.placeProp(pileTx, pileTy, { ...prop });
      } else {
        this.removeProp(pileTx, pileTy);
      }
      const cabin = {
        id: "cabin_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        originTx,
        originTy,
        width,
        height,
        doorTx,
        doorTy,
        doorOpened: false,
        createdAt: Date.now(),
      };
      if (!this.playerCabins) this.playerCabins = [];
      this.playerCabins.push(cabin);
      for (let x = originTx; x < originTx + width; x++) {
        for (let y = originTy; y < originTy + height; y++) {
          if (x === doorTx && y === doorTy) {
            this.placeProp(x, y, {
              kind: "cabin_door",
              cabinId: cabin.id,
              opened: false,
              interactive: true,
              namePt: "Porta da Cabana",
              descriptionPt: "Porta simples de madeira rústica. Pressione [F] para abrir ou fechar.",
            });
          } else if (x === originTx || x === originTx + width - 1 || y === originTy || y === originTy + height - 1) {
            const isLeft = x === originTx;
            const isRight = x === originTx + width - 1;
            const isTop = y === originTy;
            const isBottom = y === originTy + height - 1;
            const wallSide =
              isTop && isLeft
                ? "nw"
                : isTop && isRight
                  ? "ne"
                  : isBottom && isLeft
                    ? "sw"
                    : isBottom && isRight
                      ? "se"
                      : isTop
                        ? "north"
                        : isBottom
                          ? "south"
                          : isLeft
                            ? "west"
                            : "east";
            this.placeProp(x, y, {
              kind: "cabin_wall",
              cabinId: cabin.id,
              wallSide,
              interactive: false,
              namePt: "Parede de Toras",
              descriptionPt: "Parede robusta feita com troncos de madeira sobrepostos.",
            });
          } else {
            this.placeProp(x, y, {
              kind: "cabin_floor",
              cabinId: cabin.id,
              interactive: false,
              namePt: "Piso da Cabana",
              descriptionPt: "Chão acolhedor de tábuas de madeira.",
            });
          }
          this.invalidateTile(x, y);
        }
      }
      for (let x = originTx - 1; x <= originTx + width; x++) {
        for (let y = originTy - 1; y <= originTy + height; y++) {
          this.invalidateTile(x, y);
        }
      }
      return {
        success: true,
        cabin,
        message: "🛖 Cabana rústica de 1 cômodo construída com sucesso! Pressione [F] na porta para entrar.",
      };
    }
    placeProp(t, l, o) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      (this.customPlacedProps.set(u, { ...o }), this.invalidateTile(t, l));
    }
    getPlacedProp(t, l) {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      return this.customPlacedProps.get(o);
    }
    removeProp(t, l) {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        u = this.customPlacedProps.delete(o);
      return (this.interactedProps.delete(o), this.invalidateTile(t, l), u);
    }
    lightCampfire(t, l) {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      let u = this.customPlacedProps.get(o);
      if (!u) {
        const c = this.getTile(t, l);
        c.prop &&
          c.prop.kind === "campfire" &&
          ((u = { ...c.prop }), this.customPlacedProps.set(o, u));
      }
      if (u && u.kind === "campfire") {
        u.lit = !0;
        const c = u.fireLevel || 1,
          f = u.scale || 1;
        ((u.namePt =
          c >= 5
            ? "Pira Ancestral das Chamas Eternas"
            : c >= 3
              ? "Fogueira Majestosa"
              : c >= 2
                ? "Grande Fogueira Crepitante"
                : "Fogueira Crepitante"),
          (u.descriptionPt = `Fogueira crepitante (Nível ${c}, Tamanho ${f.toFixed(1)}x). Pressione [F] para descansar ou alimente-a com galhos para expandir o fogo.`));
      }
      const m = this.interactedProps.get(o) || {};
      return (
        this.interactedProps.set(o, { ...m, lit: !0 }),
        (this._cachedCampfireTime = 0),
        this.invalidateTile(t, l),
        !0
      );
    }
    extinguishCampfire(t, l, reason = "rain") {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      let u = this.customPlacedProps.get(o);
      if (!u) {
        const c = this.getTile(t, l);
        if (c.prop && (c.prop.kind === "campfire" || c.prop.kind === "clay_oven")) {
          u = { ...c.prop };
          this.customPlacedProps.set(o, u);
        }
      }
      if (u && (u.kind === "campfire" || u.kind === "clay_oven")) {
        u.lit = !1;
        u.fireLevel = 1;
        u.scale = 1;
        u._rainExtinguishTimer = 0;
        u.namePt = "Fogueira de Acampamento (Apagada)";
        u.descriptionPt = "Uma fogueira apagada pela chuva. Pressione [F] tendo 2 Pederneiras para acendê-la com faíscas!";
      }
      const m = this.interactedProps.get(o) || {};
      this.interactedProps.set(o, { ...m, lit: !1, fireLevel: 1, scale: 1 });
      this._cachedCampfireTime = 0;
      this.invalidateTile(t, l);
      return !0;
    }
    updateRainExtinguishCampfires(dt, isRainingSurface, savedCampfire, playerX, playerY, notifyFn) {
      if (this.isUnderground) return;

      // Se não estiver chovendo na superfície, seca o acúmulo de água aos poucos
      if (!isRainingSurface) {
        for (const [key, prop] of this.customPlacedProps.entries()) {
          if (key.startsWith("surf_") && prop && (prop.kind === "campfire" || prop.kind === "clay_oven")) {
            if (prop._rainExtinguishTimer > 0) {
              prop._rainExtinguishTimer = Math.max(0, prop._rainExtinguishTimer - dt * 0.5);
            }
          }
        }
        return;
      }

      // Está chovendo na superfície: rastreia fogueiras nos tiles carregados ao redor do jogador
      const playerTx = Math.floor(playerX / this.tileSize);
      const playerTy = Math.floor(playerY / this.tileSize);
      const scanRadius = 16;

      for (let dy = -scanRadius; dy <= scanRadius; dy++) {
        for (let dx = -scanRadius; dx <= scanRadius; dx++) {
          const tx = playerTx + dx;
          const ty = playerTy + dy;
          const key = `surf_${tx},${ty}`;
          if (!this.customPlacedProps.has(key)) {
            const tile = this.getTile(tx, ty);
            if (tile && tile.prop && (tile.prop.kind === "campfire" || tile.prop.kind === "clay_oven")) {
              this.customPlacedProps.set(key, { ...tile.prop });
            }
          }
        }
      }

      // Processa fogueiras sob chuva
      for (const [key, prop] of this.customPlacedProps.entries()) {
        if (!key.startsWith("surf_")) continue;
        if (!prop || (prop.kind !== "campfire" && prop.kind !== "clay_oven")) continue;
        if (!prop.lit) continue;

        const coords = key.replace("surf_", "").split(",");
        const tx = parseInt(coords[0], 10);
        const ty = parseInt(coords[1], 10);
        if (isNaN(tx) || isNaN(ty)) continue;

        // Fogueira AZUL (de salve do jogador): NUNCA se apaga com a chuva!
        const isBlueSaveCampfire = !!(
          savedCampfire &&
          savedCampfire.tx === tx &&
          savedCampfire.ty === ty &&
          !savedCampfire.isUnderground
        );
        if (isBlueSaveCampfire) {
          prop._rainExtinguishTimer = 0;
          continue;
        }

        // Fogueira comum sob chuva: se apaga aos poucos!
        prop._rainExtinguishTimer = (prop._rainExtinguishTimer || 0) + dt;

        const propWorldX = tx * this.tileSize + this.tileSize / 2;
        const propWorldY = ty * this.tileSize + this.tileSize / 2;
        const distToPlayer = Math.hypot(playerX - propWorldX, playerY - propWorldY);

        const fireLevel = prop.fireLevel || 1;
        if (fireLevel > 1) {
          if (prop._rainExtinguishTimer >= 6.0) {
            prop._rainExtinguishTimer = 0;
            prop.fireLevel = fireLevel - 1;
            prop.sticksFed = Math.max(10, (prop.sticksFed || 10) - 10);
            prop.scale = Math.max(1, (prop.scale || 1) - 0.5);
            prop.namePt = prop.fireLevel === 1 ? "Fogueira Crepitante" : `Fogueira (Nível ${prop.fireLevel})`;
            prop.descriptionPt = `Fogueira diminuída pela chuva (Nível ${prop.fireLevel}). Alimente com galhos para mantê-la forte!`;
            this._cachedCampfireTime = 0;
            this.invalidateTile(tx, ty);
            if (distToPlayer <= 220 && typeof notifyFn === "function") {
              notifyFn("🌧️ A chuva constante está diminuindo o fogo da fogueira!");
            }
          }
        } else {
          if (prop._rainExtinguishTimer >= 8.0) {
            this.extinguishCampfire(tx, ty, "rain");
            this._cachedCampfireTime = 0;
            if (distToPlayer <= 260 && typeof notifyFn === "function") {
              notifyFn("🌧️ A fogueira se apagou com a chuva! Use 2 Pederneiras para acendê-la quando a chuva passar.");
            }
          }
        }
      }
    }
    getNearbyCampfire(t, l, o = 85) {
      const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      if (
        this._cachedCampfireTime &&
        now - this._cachedCampfireTime < 150 &&
        Math.abs(t - (this._cachedCampfirePx || 0)) < 18 &&
        Math.abs(l - (this._cachedCampfirePy || 0)) < 18 &&
        this._cachedCampfireRad === o &&
        this._cachedCampfireUnderground === !!this.isUnderground
      ) {
        return this._cachedCampfireResult;
      }
      const u = Math.round(t / this.tileSize),
        m = Math.round(l / this.tileSize),
        c = Math.ceil(o / this.tileSize) + 2;
      let f = null;
      for (let g = -c; g <= c; g++)
        for (let y = -c; y <= c; y++) {
          const w = u + y,
            v = m + g,
            T = `${this.isUnderground ? "cave_" : "surf_"}${w},${v}`;
          let S = this.customPlacedProps.get(T);
          if (!S) {
            const p = this.getTile(w, v);
            p.prop &&
              (p.prop.kind === "campfire" || p.prop.kind === "clay_oven") &&
              (S = p.prop);
          }
          if (S && (S.kind === "campfire" || S.kind === "clay_oven")) {
            const p = w * this.tileSize + this.tileSize / 2 + (S.offsetX || 0),
              j = v * this.tileSize + this.tileSize / 2 + (S.offsetY || 0),
              P = Math.hypot(t - p, l - j),
              A = o + ((S.scale || 1) - 1) * 35;
            P <= A &&
              (!f || P < f.dist) &&
              (f = { tx: w, ty: v, prop: S, dist: P });
          }
        }
      this._cachedCampfireTime = now;
      this._cachedCampfirePx = t;
      this._cachedCampfirePy = l;
      this._cachedCampfireRad = o;
      this._cachedCampfireUnderground = !!this.isUnderground;
      this._cachedCampfireResult = f;
      return f;
    }
    feedCampfire(t, l, o = 10) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      let m = this.customPlacedProps.get(u);
      if (!m) {
        const p = this.getTile(t, l);
        p.prop &&
          (p.prop.kind === "campfire" || p.prop.kind === "clay_oven") &&
          ((m = { ...p.prop }), this.customPlacedProps.set(u, m));
      }
      if (!m || (m.kind !== "campfire" && m.kind !== "clay_oven"))
        return {
          success: !1,
          level: 1,
          scale: 1,
          sticksFed: 10,
          percentageGrowth: "",
          propName: "",
          description: "Nenhuma fogueira encontrada neste local.",
        };
      const f = (m.sticksFed || 10) + o,
        g = m.scale || 1,
        y = Math.max(1, Math.round((f / 10) * 10) / 10),
        w = Math.round(y);
      let v = "";
      w === 2
        ? (v = "Dobrou de tamanho (+100%)! Agora 2x maior!")
        : w === 3
          ? (v = "Cresceu +50%! Agora 3x maior que a base!")
          : w === 4
            ? (v = "Cresceu proporcionalmente (+33%)! Agora 4x maior!")
            : w === 5
              ? (v = "Atingiu o 5º nível (+25%)! Pira colossal 5x maior!")
              : (v = `Cresceu +${Math.round(((y - g) / g) * 100)}%! Agora ${y.toFixed(1)}x maior!`);
      let T = "Fogueira de Acampamento";
      (w === 2
        ? (T = "Grande Fogueira Crepitante (Nível 2)")
        : w === 3
          ? (T = "Fogueira Majestosa de Chamas Altas (Nível 3)")
          : w === 4
            ? (T = "Fogueira Monumental Flamejante (Nível 4)")
            : w >= 5 && (T = "Pira Ancestral das Chamas Eternas (Nível 5)"),
        (m.scale = y),
        (m.fireLevel = w),
        (m.sticksFed = f),
        (m.namePt = T),
        (m.descriptionPt = `Fogueira alimentada com ${f} galhos. Tamanho ${y.toFixed(1)}x. ${v}`));
      const S = this.interactedProps.get(u) || {};
      return (
        this.interactedProps.set(u, {
          ...S,
          lit: m.lit !== !1,
          fireLevel: w,
          sticksFed: f,
        }),
        this.invalidateTile(t, l),
        {
          success: !0,
          level: w,
          scale: y,
          sticksFed: f,
          percentageGrowth: v,
          propName: T,
          description: m.descriptionPt,
        }
      );
    }
    startRoastingFish(t, l, o) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        m = `${t},${l}`,
        c = {
          fishItem: {
            id: o.id,
            name: o.name,
            color: o.color,
            rarity: o.rarity,
            value: o.value,
            description: o.description,
            hpHeal: o.hpHeal,
            staminaHeal: o.staminaHeal,
          },
          startTime: Date.now(),
          durationMs: 6e4,
        };
      this.customPlacedProps.has(u) &&
        (this.customPlacedProps.get(u).roastingFish = c);
      const g = {
        ...(this.interactedProps.get(u) || this.interactedProps.get(m) || {}),
        roastingFish: c,
      };
      return (
        this.interactedProps.set(u, g),
        this.interactedProps.set(m, g),
        this.invalidateTile(t, l),
        !0
      );
    }
    collectRoastedFish(t, l) {
      var w;
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        u = `${t},${l}`,
        m = this.interactedProps.get(o) || this.interactedProps.get(u);
      let c = m == null ? void 0 : m.roastingFish;
      if (
        (!c &&
          this.customPlacedProps.has(o) &&
          (c =
            (w = this.customPlacedProps.get(o)) == null
              ? void 0
              : w.roastingFish),
        !c)
      )
        return null;
      (this.customPlacedProps.has(o) &&
        delete this.customPlacedProps.get(o).roastingFish,
        m &&
          (delete m.roastingFish,
          this.interactedProps.set(o, { ...m }),
          this.interactedProps.set(u, { ...m })),
        this.invalidateTile(t, l));
      const f = c.fishItem.name
          .replace(" (Cru)", "")
          .replace(" Cru", "")
          .replace(" Fresco", ""),
        g = `${f} Assado no Espeto`;
      return {
        id: `fish_roasted_${c.fishItem.id}_${Date.now()}`,
        name: g,
        icon: "🍢",
        categoryType: "consumable",
        rarity: "raro",
        value: (c.fishItem.value || 40) + 60,
        hpHeal: 70,
        staminaHeal: 90,
        color: "#f59e0b",
        description: `Suculento ${f} assado no espeto de galho sobre as brasas da fogueira durante 1 minuto. Deliciosamente tostado com aroma defumado irresistível. Restaura 70 de Vida e 90 de Stamina.`,
        stackCount: 1,
        maxStack: 10,
      };
    }
    setCookingPot(t, l, o) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        m = `${t},${l}`;
      let c = this.customPlacedProps.get(u);
      if (!c) {
        const S = this.getTile(t, l);
        S.prop &&
          (S.prop.kind === "campfire" || S.prop.kind === "clay_oven") &&
          ((c = { ...S.prop }), this.customPlacedProps.set(u, c));
      }
      if (!c || (c.kind !== "campfire" && c.kind !== "clay_oven"))
        return { success: !1, message: "Nenhuma fogueira neste local." };
      const f = {
        potItem: { id: o.id, name: o.name, icon: o.icon, color: o.color },
        hasWater: !!o.hasWater,
        ingredients: [],
        startTime: Date.now(),
      };
      c.cookingPot = f;
      const g = this.interactedProps.get(u) || this.interactedProps.get(m) || {};
      g.cookingPot = f;
      return (
        this.interactedProps.set(u, g),
        this.interactedProps.set(m, { ...g }),
        this.invalidateTile(t, l),
        { success: !0 }
      );
    }
    removeCookingPot(t, l) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        m = `${t},${l}`;
      let c = null;
      this.customPlacedProps.has(u) &&
        ((c = this.customPlacedProps.get(u).cookingPot || null),
        delete this.customPlacedProps.get(u).cookingPot);
      const f =
        this.interactedProps.get(u) || this.interactedProps.get(m) || null;
      return (
        f &&
          f.cookingPot &&
          ((c = c || f.cookingPot),
          delete f.cookingPot,
          this.interactedProps.set(u, { ...f }),
          this.interactedProps.set(m, { ...f })),
        this.invalidateTile(t, l),
        c
      );
    }
    addIngredientToPot(t, l, o, count = 1) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        m = `${t},${l}`,
        c = this.interactedProps.get(u) || this.interactedProps.get(m);
      let f = c == null ? void 0 : c.cookingPot;
      if (!f && this.customPlacedProps.has(u))
        f = this.customPlacedProps.get(u).cookingPot;
      if (!f) return 0;
      f.ingredients || (f.ingredients = []);
      const added = Math.max(1, Math.min(count | 0, 6 - f.ingredients.length));
      for (let ii = 0; ii < added; ii++)
        f.ingredients.push({ ...o, stackCount: 1, name: o.name, icon: o.icon });
      if (c) {
        this.interactedProps.set(u, { ...c });
        this.interactedProps.set(m, { ...c });
      }
      return (this.invalidateTile(t, l), added);
    }
    // Remove ingredientes do fogo de volta para a mochila (modal da panela)
    takeIngredientsFromPot(t, l, names) {
      const u = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
        m = `${t},${l}`,
        c = this.interactedProps.get(u) || this.interactedProps.get(m);
      let f = c == null ? void 0 : c.cookingPot;
      if (!f && this.customPlacedProps.has(u))
        f = this.customPlacedProps.get(u).cookingPot;
      if (!f || !f.ingredients) return [];
      const taken = [];
      for (const nm of names) {
        const ix = f.ingredients.findIndex(
          (x) => (x.name || "").toLowerCase() === String(nm).toLowerCase(),
        );
        if (ix !== -1) taken.push(f.ingredients.splice(ix, 1)[0]);
      }
      if (c) {
        this.interactedProps.set(u, { ...c });
        this.interactedProps.set(m, { ...c });
      }
      return (this.invalidateTile(t, l), taken);
    }
    finishCooking(t, l) {
      const o = this.removeCookingPot(t, l);
      if (!o) return null;
      const u = (o.ingredients || [])
          .map((m) => (m.name || "").toLowerCase())
          .join(" + "),
        f = [];
      let g = null,
        y = 0,
        burntWater = !1,
        v = "";
      // 🍲 RECEITAS POR COMBINAÇÃO (prioridade sobre a regra genérica de carne)
      const hasCarne = u.includes("carne") || u.includes("meat"),
        hasGosma = u.includes("gosma") || u.includes("slime"),
        hasGelatinaProc = u.includes("gelatina processada"),
        hasCordaP = u.includes("corda de fibra pequena"),
        hasCordaM = u.includes("corda de fibra média"),
        hasCordaG = u.includes("corda de fibra grande"),
        hasGalho = u.includes("galho"),
        hasGordura = u.includes("gordura animal");
      if (hasCarne && hasGosma && o.hasWater) {
        ((g = {
          id: `sopa_nutritiva_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Sopa Nutritiva de Gosma",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "raro",
          value: 90,
          stackCount: 1,
          maxStack: 20,
          icon: "🍲",
          color: "#86efac",
          hpHeal: 75,
          staminaHeal: 100,
          description:
            "Caldo denso de carne com gelatina derretida. Banho de nutrientes que restaura 75 de Vida e 100 de Stamina.",
        }),
          (v = "🍲 Carne e gosma se fundiram em um caldo nutritivo! Sopa Nutritiva pronta."));
      } else if (hasCordaP && (hasGordura || hasGosma || hasGelatinaProc)) {
        ((g = {
          id: `item_corda_elastica_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Corda Elástica",
          categoryType: "material",
          isEquippable: !1,
          rarity: "incomum",
          stackCount: 1,
          maxStack: 20,
          icon: "➰",
          color: "#f59e0b",
          description:
            "Corda pequena impregnada de gordura/gosma quente, elástica como borracha. Base para o Estilingue.",
        }),
          (v = "➰ A corda absorveu a gordura quente e virou Corda Elástica!"));
      } else if (hasCordaG && (hasGosma || hasGelatinaProc)) {
        ((g = {
          id: `item_corda_elastica_grande_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Corda Elástica Grande",
          categoryType: "equipment",
          slot: "cinto",
          isEquippable: !0,
          rarity: "raro",
          description:
            "Cabo grosso saturado de gosma purificada no fogo. Muito elástico — potencial ainda misterioso (+8 Defesa, +35 Vigor).",
          stats: { defense: 8, staminaBonus: 35, speedBonusPercent: 8 },
          icon: "SlidersHorizontal",
          color: "#22c55e",
          value: 160,
        }),
          (v = "➰ A corda grande encharcou-se de gosma elástica! Corda Elástica Grande pronta."));
      } else if (hasCarne && hasGalho && !o.hasWater) {
        ((g = {
          id: `espetinho_carne_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Espetinho de Carne no Galho",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "comum",
          value: 40,
          stackCount: 1,
          maxStack: 20,
          icon: "🍢",
          color: "#d97706",
          hpHeal: 40,
          staminaHeal: 45,
          description:
            "Carne grelhada na ponta de um galho dentro da panela quente. Rústico, mas saboroso (+40 Vida, +45 Stamina).",
        }),
          (y = 1),
          (v = "🍢 A carne assou no galho! Espetinho pronto + 1x Gordura Animal."));
      } else if (hasCarne && hasGelatinaProc && o.hasWater) {
        ((g = {
          id: `caldo_gelatina_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Caldo Gelatinoso Fortificante",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "raro",
          value: 85,
          stackCount: 1,
          maxStack: 20,
          icon: "🥣",
          color: "#4ade80",
          hpHeal: 70,
          staminaHeal: 90,
          description:
            "Caldo espesso e trêmulo feito de carne e gelatina processada. Sustenta muito (+70 Vida, +90 Stamina).",
        }),
          (v = "🥣 O caldo apurou até ficar gelatinoso! Caldo Fortificante pronto."));
      } else if (hasCarne || u.includes("meat"))
        if (o.hasWater)
          ((g = {
            id: `carne_cozida_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Carne Cozida",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "incomum",
            value: 55,
            stackCount: 1,
            maxStack: 20,
            icon: "🍖",
            color: "#d6a47a",
            hpHeal: 45,
            staminaHeal: 60,
            description:
              "Carne macia cozida lentamente na panela com água fervente. Restaura 45 de Vida e 60 de Stamina ao consumir.",
          }),
            (v = "🍲 A carne cozinhou lentamente na água! Obtiveste Carne Cozida."));
        else
          ((g = {
            id: `carne_frita_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Carne Frita",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "incomum",
            value: 60,
            stackCount: 1,
            maxStack: 20,
            icon: "🥩",
            color: "#b45309",
            hpHeal: 55,
            staminaHeal: 50,
            description:
              "Carne selada e dourada na gordura quente da panela. Crocante por fora e suculenta por dentro. Restaura 55 de Vida e 50 de Stamina.",
          }),
            (y = 1 + Math.floor(Math.random() * 2)),
            (v = `🍳 A carne fritou na própria gordura! Carne Frita + ${y}x Gordura Animal.`));
      else
        u.includes("gosma") || u.includes("gelatina")
          ? ((g = {
              id: `gelatina_processada_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: "Gelatina Processada",
              categoryType: "material",
              isEquippable: !1,
              rarity: "incomum",
              value: 40,
              stackCount: 1,
              maxStack: 20,
              icon: "🫧",
              color: "#86efac",
              description:
                "Corpo de gosma derretido e purificado em banho-maria. Base elástica e pegajosa para fusões avançadas de equipamentos.",
            }),
            (v = "⚗️ A gosma derreteu e se purificou em Gelatina Processada!"))
          : o.hasWater
            ? ((v = "♨️ Apenas água fervida... o vapor se dissipou. A panela voltou vazia."),
              (burntWater = !0))
            : (v = "🔥 O conteúdo queimou nas brasas e virou cinzas.");
      if (
        (g && f.push(g),
        y > 0 &&
          f.push({
            id: `gordura_animal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Gordura Animal",
            categoryType: "material",
            isEquippable: !1,
            rarity: "comum",
            value: 15,
            stackCount: y,
            maxStack: 20,
            icon: "🧈",
            color: "#fde68a",
            description:
              "Gordura nobre extraída da carne durante a fritura. Escorregadia, valiosa para receitas, conservas e futuras ligas elásticas.",
          }),
        (o.ingredients || []).length === 0 || burntWater)
      ) {
        const pm = o.potItem || {},
          isCaldeirao =
            pm.name && pm.name.toLowerCase().includes("caldeirão"),
          emptyPot = {
            id: `item_${isCaldeirao ? "caldeirao" : "panela"}_barro_${Date.now()}`,
            name: isCaldeirao
              ? "Caldeirão de Barro Vazio"
              : "Panela de Barro Vazia",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "incomum",
            value: 45,
            stackCount: 1,
            icon: pm.icon || (isCaldeirao ? "🍲" : "🍳"),
            color: "#b45309",
            description: isCaldeirao
              ? "Caldeirão robusto moldado com paredes espessas de argila e curado ao sol. Pode coletar água fresca (+90 Stamina) ou ser usado em receitas no fogo."
              : "Panela robusta de barro com paredes grossas. Pode coletar água fresca na lagoa (+90 Stamina ao beber) ou preparar receitas.",
          };
        f.push(emptyPot);
      }
      return {
        items: f,
        message: v,
        potName: (o.potItem || {}).name || "panela",
      };
    }
    isNearLitCampfire(t, l, o = 190) {
      const u = Math.round(t / this.tileSize),
        m = Math.round(l / this.tileSize),
        c = 14;
      for (let f = -c; f <= c; f++)
        for (let g = -c; g <= c; g++) {
          const y = u + g,
            w = m + f,
            v = `${this.isUnderground ? "cave_" : "surf_"}${y},${w}`,
            T = this.customPlacedProps.get(v);
          if (
            T &&
            (T.kind === "campfire" || T.kind === "clay_oven") &&
            T.lit !== !1
          ) {
            const p = T.scale || 1,
              j = o + (p - 1) * 85,
              P = y * this.tileSize + this.tileSize / 2 + (T.offsetX || 0),
              A = w * this.tileSize + this.tileSize / 2 + (T.offsetY || 0);
            if (Math.hypot(t - P, l - A) <= j) return !0;
          }
          const S = this.getTile(y, w);
          if (
            S.prop &&
            (S.prop.kind === "campfire" || S.prop.kind === "clay_oven") &&
            S.prop.lit !== !1
          ) {
            const p = S.prop.scale || 1,
              j = o + (p - 1) * 85,
              P = y * this.tileSize + this.tileSize / 2 + (S.prop.offsetX || 0),
              A = w * this.tileSize + this.tileSize / 2 + (S.prop.offsetY || 0);
            if (Math.hypot(t - P, l - A) <= j) return !0;
          }
        }
      return !1;
    }
    getClosestLitCampfire(t, l, o = 420) {
      const u = Math.round(t / this.tileSize),
        m = Math.round(l / this.tileSize),
        c = Math.ceil(o / this.tileSize) + 2,
        Tt = `${this.isUnderground ? "c" : "s"}_${u},${m},${o}`,
        St = this.closestCampfireCache.get(Tt);
      if (St && performance.now() - St.time < 250) return St.value;
      let f = null;
      for (let g = -c; g <= c; g++)
        for (let y = -c; y <= c; y++) {
          const w = u + y,
            v = m + g,
            T = `${this.isUnderground ? "cave_" : "surf_"}${w},${v}`;
          let S = this.customPlacedProps.get(T);
          if (!S) {
            const p = this.getTile(w, v);
            p.prop &&
              (p.prop.kind === "campfire" ||
                p.prop.kind === "clay_oven" ||
                p.prop.kind === "corridor_torch") &&
              (S = p.prop);
          }
          if (
            S &&
            (S.kind === "campfire" ||
              S.kind === "clay_oven" ||
              S.kind === "corridor_torch") &&
            S.lit !== !1
          ) {
            const p = S.scale || 1,
              P =
                S.kind === "corridor_torch"
                  ? 165
                  : (this.isUnderground ? 225 : 190) + (p - 1) * 85,
              A = w * this.tileSize + this.tileSize / 2 + (S.offsetX || 0),
              x = v * this.tileSize + this.tileSize / 2 + (S.offsetY || 0),
              M = Math.hypot(t - A, l - x);
            M <= o + P &&
              (!f || M < f.dist) &&
              (f = { fireX: A, fireY: x, dist: M, lightRadius: P, scale: p });
          }
        }
      (this.closestCampfireCache.size > 256 &&
        this.closestCampfireCache.clear(),
        this.closestCampfireCache.set(Tt, {
          time: performance.now(),
          value: f,
        }));
      return f;
    }
    isGroundItemCollected(t, l) {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      return this.collectedGroundItems.has(o);
    }
    collectGroundItem(t, l) {
      const o = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      (this.collectedGroundItems.add(o), this.invalidateTile(t, l));
    }
    lightCorridorTorch(t, l) {
      const u = this.isUnderground ? `underground_${t},${l}` : `${t},${l}`,
        p = `cave_${t},${l}`,
        d = `dungeon_${t},${l}`,
        m = this.interactedProps.get(u) || this.interactedProps.get(p) || this.interactedProps.get(d) || {};
      this.interactedProps.set(u, { ...m, lit: !0 });
      this.interactedProps.set(p, { ...m, lit: !0 });
      this.interactedProps.set(d, { ...m, lit: !0 });
      this.closestCampfireCache.clear();
      this.invalidateTile(t, l);
    }
    unlockAndOpenGate(t, l) {
      const pKey = `dungeon_${t},${l}`;
      const m = this.interactedProps.get(pKey) || {};
      this.interactedProps.set(pKey, { ...m, unlocked: !0, opened: !0 });
      this.invalidateTile(t, l);
    }
    enterCave(t, l, o, u) {
      this.surfaceCoords = { x: o, y: u };
      this.activeCaveEntranceCoords = { tx: t, ty: l };
      const surfB = this._computeSurfaceBaseBiome(t, l);
      const ent = this.getCaveEntranceAt(t, l);
      this.enteredViaStaircase = !!(
        (ent && ent.isStaircase) ||
        (surfB && surfB.id === BiomeId.MEADOW)
      );
      this.activeCaveEntranceBiome = surfB;
      this.activeCaveEntranceIsDesert = !!(
        (ent && ent.isDesertCave) ||
        (surfB && (surfB.id === BiomeId.DESERT || surfB.id === BiomeId.CANYON))
      );
      if (this.activeCaveEntranceIsDesert) {
        const entTx = t;
        const entTy = l;
        const hX = this.hash2D(entTx, entTy, 11);
        const hY = this.hash2D(entTy, entTx, 19);
        const signX = hX > 0.5 ? 1 : -1;
        const signY = hY > 0.5 ? 1 : -1;
        const dx = signX * (14 + Math.floor(hX * 4));
        const dy = signY * (12 + Math.floor(hY * 4));
        this._singleDesertTardigradeNest = {
          cx: entTx + dx,
          cy: entTy + dy,
          entTx: entTx,
          entTy: entTy,
          radius: 8.5,
        };
      } else {
        this._singleDesertTardigradeNest = null;
      }
      this._singleDesertGeodeFissure = null;
      this.isUnderground = !0;
      this.undergroundLevel = 1;
      this.activeCaveSeed = (this.seed + 88888) >>> 0;
      this.caveWallNoise.seed(this.activeCaveSeed + 404);
      this.caveRoomNoise.seed(this.activeCaveSeed + 505);
      this.caveDetailNoise.seed(this.activeCaveSeed + 606);
      this.clearTileCache();
    }
    exitCave(t, l) {
      this.isUnderground = !1;
      this.undergroundLevel = 0;
      this._singleDesertTardigradeNest = null;
      this._singleDesertGeodeFissure = null;
      this.clearTileCache();
      if (t !== undefined && l !== undefined) {
        return {
          x: t * this.tileSize + 14,
          y: l * this.tileSize + 14,
        };
      }
      return this.surfaceCoords;
    }
    enterDungeon(t, l, o, u) {
      this.subsoloCoords = { x: o, y: u };
      this.activeDungeonStairCoords = { tx: t, ty: l };
      this.isUnderground = !0;
      this.undergroundLevel = 2;
      this.clearTileCache();
    }
    exitDungeon(t, l) {
      this.isUnderground = !0;
      this.undergroundLevel = 1;
      this.clearTileCache();
      if (t !== undefined && l !== undefined) {
        return {
          x: t * this.tileSize + 14,
          y: l * this.tileSize + 20,
        };
      }
      return this.subsoloCoords || { x: t * this.tileSize + 14, y: l * this.tileSize + 20 };
    }
    enterGeode(t, l, o, u) {
      this.desertCaveCoords = { x: o, y: u };
      this.activeGeodeFissureCoords = { tx: t, ty: l };
      this.isUnderground = !0;
      this.undergroundLevel = 3;
      this.clearTileCache();
    }
    exitGeode(t, l) {
      this.isUnderground = !0;
      this.undergroundLevel = 1;
      this.clearTileCache();
      if (t !== undefined && l !== undefined) {
        return {
          x: t * this.tileSize + this.tileSize / 2,
          y: (l + 2) * this.tileSize + this.tileSize / 2,
        };
      }
      return this.desertCaveCoords || { x: (t || 0) * this.tileSize + 18, y: ((l || 0) + 2) * this.tileSize + 18 };
    }
    _isRawCaveCandidateAt(t, l) {
      if (!this.rawCaveCandidateCache) this.rawCaveCandidateCache = new Map();
      const key = (t + 1048576) * 2097152 + (l + 1048576);
      if (this.rawCaveCandidateCache.has(key))
        return this.rawCaveCandidateCache.get(key);

      let res = null;
      const isBlockedUndergroundWallOrDoor = (tx, ty) => {
        const lx = ((tx % 32) + 32) % 32,
          ly = ((ty % 32) + 32) % 32;
        if (lx === 0 || lx === 4 || ly === 0 || ly === 4 || ly === 17) return !0;
        if (lx === 13 || lx === 15 || lx === 16 || lx === 20 || lx === 22 || lx === 24) return !0;
        if (ly === 5 || ly === 16 || ly === 18 || ly === 31) return !0;
        return !1;
      };
      if (t === 10 && l === 8) {
        const b10 = this._computeSurfaceBaseBiome(10, 8);
        const isRuins10 = !!(b10 && b10.id === BiomeId.MEADOW);
        res = {
          tx: 10,
          ty: 8,
          subType: isRuins10 ? 2 : 0,
          isStaircase: isRuins10,
          scale: 1.35,
          namePt: isRuins10
            ? "Escadaria para o Subsolo dos Cristais"
            : "Entrada da Caverna dos Cristais",
          descriptionPt: isRuins10
            ? "Uma escadaria ancestral de mármore e pedra lavrada que desce para as galerias subterrâneas dos cristais. Pressione [F] para descer!"
            : "Uma entrada rochosa imponente que desce para galerias subterrâneas inexploradas. Pressione [F] ou Interagir para entrar e explorar!",
        };
      } else {
        const b = this._computeSurfaceBaseBiome(t, l);
        if (b && !b.hasWater && b.category === "land") {
          const gCell = this._getGreekRuinCellAt(t, l);
          const isInOtherCity = !!(
            (typeof window !== "undefined" && window.SnowPeakCity && window.SnowPeakCity.isCityTerritory && window.SnowPeakCity.isCityTerritory(t, l)) ||
            (typeof window !== "undefined" && window.DesertCity && window.DesertCity.isCityTerritory && window.DesertCity.isCityTerritory(t, l)) ||
            (typeof window !== "undefined" && window.PortCity && window.PortCity.isCityTerritory && window.PortCity.isCityTerritory(t, l))
          );
          const isBlockedByRuinWallOrDoor =
            isInOtherCity ||
            (gCell &&
              (gCell.role === "wall" ||
                gCell.role === "rubble_wall" ||
                gCell.role === "door" ||
                gCell.role === "column"));

          // 1. Garante uma Escadaria para o Subsolo na praça de entrada de cada Cidade de Ruínas Gregas!
          if (b.id === BiomeId.MEADOW) {
            const city = this._getMeadowCityDistrict(t, l);
            if (city && t === city.stairTx && l === city.stairTy && !isBlockedByRuinWallOrDoor) {
              res = {
                tx: t,
                ty: l,
                subType: 2,
                isStaircase: !0,
                scale: 1.4,
                namePt: "Escadaria Real para o Subsolo",
                descriptionPt:
                  "A grande escadaria de mármore da Pólis que desce em degraus profundos até o subsolo das ruínas. Pressione [F] para descer!",
              };
            }
          }

          // 2. Demais entradas pelo mundo (podem surgir tanto ao ar livre quanto DENTRO dos Salões na superfície,
          //    desde que não fiquem em cima de paredes ou portas nem na superfície nem no subsolo!)
          if (
            !res &&
            !isBlockedByRuinWallOrDoor &&
            !(b.id === BiomeId.MEADOW && isBlockedUndergroundWallOrDoor(t, l))
          ) {
            const g = this.hash2D(t, l, 99);
            const isPotentialRange =
              (g > 0.0075 && g < 0.0135) ||
              (g > 0.009 && g < 0.0105) ||
              (g > 0.0125 && g < 0.0165);
            if (isPotentialRange) {
              const clusterNoise = this.featureNoise.noise2D(
                t * 0.06 + 410,
                l * 0.06 + 410,
              );
              const isMountainOrHigh =
                b.id === BiomeId.SNOW_PEAK ||
                b.id === BiomeId.VOLCANIC ||
                b.id === BiomeId.MOUNTAIN_25D ||
                b.elevation > 0.65;
              const isRuinsBiome = b.id === BiomeId.MEADOW;
              const isDesertBiome = b.id === BiomeId.DESERT || b.id === BiomeId.CANYON;

              if (isRuinsBiome && g > 0.0075 && g < 0.0135) {
                res = {
                  tx: t,
                  ty: l,
                  subType: 2,
                  isStaircase: !0,
                  scale: 1.35,
                  namePt: gCell
                    ? "Escadaria Interna do Salão para o Subsolo"
                    : "Escadaria para o Subsolo",
                  descriptionPt:
                    "Uma escadaria monumental de mármore helênico que desce em degraus profundos até as galerias do subsolo. Pressione [F] para descer!",
                };
              } else if (isDesertBiome && g > 0.0075 && g < 0.0135) {
                res = {
                  tx: t,
                  ty: l,
                  subType: 3,
                  isDesertCave: !0,
                  scale: 1.3,
                  namePt: "Fenda da Caverna do Deserto",
                  descriptionPt:
                    "Uma fenda profunda talhada nas rochas de arenito e dunas douradas, descendo para túneis estreitos subterrâneos. Pressione [F] para entrar!",
                };
              } else if (isMountainOrHigh && g > 0.0075 && g < 0.0125) {
                res = {
                  tx: t,
                  ty: l,
                  subType: 0,
                  scale: 1.3,
                  namePt: "Boca da Caverna das Montanhas",
                  descriptionPt:
                    "Uma caverna escura esculpida na rocha com brisa gelada emanando do interior. Pressione [F] para entrar e explorar!",
                };
              } else if (g > 0.009 && g < 0.0105) {
                res = {
                  tx: t,
                  ty: l,
                  subType: isRuinsBiome ? 2 : isDesertBiome ? 3 : 1,
                  isStaircase: isRuinsBiome,
                  isDesertCave: isDesertBiome,
                  scale: 1.25,
                  namePt: isRuinsBiome
                    ? "Escadaria para o Subsolo"
                    : isDesertBiome
                      ? "Fenda das Areias Profundas"
                      : "Fenda da Caverna Oculta",
                  descriptionPt: isRuinsBiome
                    ? "Uma escadaria de pedra lavrada que desce para o subsolo das ruínas. Pressione [F] para descer."
                    : isDesertBiome
                      ? "Uma fenda profunda talhada nas dunas que desce para um labirinto de túneis estreitos de arenito. Pressione [F] para descer."
                      : "Uma fenda profunda entre os rochedos conduzindo ao mundo subterrâneo. Pressione [F] para explorar.",
                };
              } else if (clusterNoise > 0.18 && g > 0.0125 && g < 0.0162) {
                res = {
                  tx: t,
                  ty: l,
                  subType: isRuinsBiome ? 2 : isDesertBiome ? 3 : 1,
                  isStaircase: isRuinsBiome,
                  isDesertCave: isDesertBiome,
                  scale: 1.25,
                  namePt: isRuinsBiome
                    ? "Escadaria Antiga para o Subsolo"
                    : isDesertBiome
                      ? "Entrada dos Túneis do Deserto"
                      : "Galeria Rochosa Subterrânea",
                  descriptionPt: isRuinsBiome
                    ? "Degraus antigos de mármore que levam às galerias subterrâneas. Pressione [F] para explorar."
                    : isDesertBiome
                      ? "Abertura entre rochas de arenito conectada aos estreitos túneis subterrâneos do deserto. Pressione [F] para explorar."
                      : "Uma fenda geológica entre os rochedos conectada às galerias subterrâneas. Pressione [F] para explorar.",
                };
              }
            }
          }
        }
      }
      this.rawCaveCandidateCache.set(key, res);
      return res;
    }
    _getMergedCaveInfoAt(t, l) {
      if (!this.mergedCaveCache) this.mergedCaveCache = new Map();
      const key = (t + 1048576) * 2097152 + (l + 1048576);
      if (this.mergedCaveCache.has(key)) return this.mergedCaveCache.get(key);

      const selfRaw = this._isRawCaveCandidateAt(t, l);
      if (!selfRaw) {
        this.mergedCaveCache.set(key, null);
        return null;
      }

      // Raio de fusão: quando houver uma caverna perto da outra (até 8 blocos de distância),
      // elas se juntam em uma única Caverna Maior, Mais Alta e com Mais Pedras na Entrada!
      const mergeR = 8;
      const nearby = [];
      for (let dy = -mergeR; dy <= mergeR; dy++) {
        for (let dx = -mergeR; dx <= mergeR; dx++) {
          const nt = t + dx,
            nl = l + dy;
          const cand = this._isRawCaveCandidateAt(nt, nl);
          if (cand) {
            nearby.push(cand);
          }
        }
      }

      if (nearby.length <= 1) {
        const isMustBeCave =
          (t === 10 && l === 8) ||
          !!selfRaw.isStaircase ||
          this._computeSurfaceBaseBiome(t, l)?.id === BiomeId.MEADOW;
        const isLargeRock = !isMustBeCave && this.hash2D(t, l, 471) < 0.5;
        const singleRes = {
          ...selfRaw,
          isMerged: !1,
          mergedCount: 1,
          isLargeRock: isLargeRock,
        };
        this.mergedCaveCache.set(key, singleRes);
        return singleRes;
      }

      // Define qual das cavernas próximas será a âncora principal (prioriza [10,8] ou a de menor coordenada/hash determinístico)
      nearby.sort((a, b) => {
        if (a.tx === 10 && a.ty === 8) return -1;
        if (b.tx === 10 && b.ty === 8) return 1;
        if (a.ty !== b.ty) return a.ty - b.ty;
        return a.tx - b.tx;
      });
      const leader = nearby[0];
      if (leader.tx !== t || leader.ty !== l) {
        // Esta caverna foi absorvida pela caverna vizinha (se juntaram em uma só maior!)
        this.mergedCaveCache.set(key, null);
        return null;
      }

      const mergedCount = nearby.length;
      const isStair = !!selfRaw.isStaircase;
      const isDesert = !!selfRaw.isDesertCave;
      const isMustBeCave =
        (t === 10 && l === 8) ||
        isStair ||
        this._computeSurfaceBaseBiome(t, l)?.id === BiomeId.MEADOW;
      const isLargeRock = !isMustBeCave && this.hash2D(t, l, 471) < 0.5;
      const mergedRes = {
        ...selfRaw,
        isMerged: !0,
        isStaircase: isStair,
        isDesertCave: isDesert,
        isLargeRock: isLargeRock,
        mergedCount: mergedCount,
        scale: Math.min(1.85, 1.58 + (mergedCount - 2) * 0.12),
        namePt: isStair
          ? `Grande Escadaria Unificada para o Subsolo (${mergedCount} Galerias)`
          : isDesert
            ? `Grande Fenda Arenosa do Deserto (${mergedCount} Túneis)`
            : selfRaw.tx === 10 && selfRaw.ty === 8
              ? "Grande Caverna Unificada dos Cristais"
              : `Grande Caverna Unificada (${mergedCount} Galerias)`,
        descriptionPt: isStair
          ? `Uma escadaria monumental de mármore helênico unificando ${mergedCount} galerias subterrâneas! Pressione [F] para descer ao subsolo.`
          : isDesert
            ? `Grandes fendas nas dunas e rochas de arenito unificadas nesta colossal entrada para os túneis do deserto subterrâneo! Pressione [F] para descer.`
            : `Duas ou mais cavernas próximas se fundiram nesta formação rochosa colossal, mais alta e cercada de rochedos na entrada! Pressione [F] para explorar.`,
      };
      this.mergedCaveCache.set(key, mergedRes);
      return mergedRes;
    }
    getCaveEntranceAt(t, l) {
      if (!this.knownCaveEntrances) this.knownCaveEntrances = new Map();
      const key = (t + 1048576) * 2097152 + (l + 1048576);
      if (this.knownCaveEntrances.has(key))
        return this.knownCaveEntrances.get(key);
      const merged = this._getMergedCaveInfoAt(t, l);
      let res = null;
      if (merged && !merged.isLargeRock) {
        res = {
          kind: "cave_entrance",
          namePt: merged.namePt || "Entrada da Caverna",
          subType: merged.subType || 0,
          isStaircase: !!merged.isStaircase,
          isDesertCave: !!merged.isDesertCave,
          isMerged: !!merged.isMerged,
          mergedCount: merged.mergedCount || 1,
          scale: merged.scale || 1.35,
          tx: t,
          ty: l,
        };
      }
      this.knownCaveEntrances.set(key, res);
      return res;
    }
    getNearbyCaveExit(t, l, maxR = 3.6) {
      const rInt = Math.ceil(maxR);
      for (let dy = -rInt; dy <= rInt; dy++) {
        for (let dx = -rInt; dx <= rInt; dx++) {
          const d = Math.hypot(dx, dy);
          if (d <= maxR) {
            const cave = this.getCaveEntranceAt(t + dx, l + dy);
            if (cave) return { cave, dist: d, dx, dy };
          }
        }
      }
      return null;
    }
    getNearbyFormerCaveStalactite(t, l, maxR = 3.0) {
      const rInt = Math.ceil(maxR);
      for (let dy = -rInt; dy <= rInt; dy++) {
        for (let dx = -rInt; dx <= rInt; dx++) {
          const d = Math.hypot(dx, dy);
          if (d <= maxR) {
            const merged = this._getMergedCaveInfoAt(t + dx, l + dy);
            if (merged && merged.isLargeRock) return { merged, dist: d, dx, dy };
          }
        }
      }
      return null;
    }
    _distanceToSegment(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(px - x1, py - y1);
      let param = ((px - x1) * dx + (py - y1) * dy) / lenSq;
      param = Math.max(0, Math.min(1, param));
      const nx = x1 + param * dx;
      const ny = y1 + param * dy;
      return Math.hypot(px - nx, py - ny);
    }
    getDesertTardigradeNest(t, l) {
      if (this._singleDesertTardigradeNest) {
        return this._singleDesertTardigradeNest;
      }

      // Ninho ÚNICO da caverna do deserto (ancorado determinísticamente à entrada)
      let entTx = 50;
      let entTy = 50;
      if (this.activeCaveEntranceCoords && this.activeCaveEntranceCoords.tx !== undefined) {
        entTx = this.activeCaveEntranceCoords.tx;
        entTy = this.activeCaveEntranceCoords.ty;
      }

      const hX = this.hash2D(entTx, entTy, 11);
      const hY = this.hash2D(entTy, entTx, 19);
      const signX = hX > 0.5 ? 1 : -1;
      const signY = hY > 0.5 ? 1 : -1;
      const dx = signX * (14 + Math.floor(hX * 4));
      const dy = signY * (12 + Math.floor(hY * 4));

      this._singleDesertTardigradeNest = {
        cx: entTx + dx,
        cy: entTy + dy,
        entTx: entTx,
        entTy: entTy,
        radius: 8.5,
        isPrimary: true,
      };

      return this._singleDesertTardigradeNest;
    }
    isTardigradeNest(t, l) {
      const tile = this.getTile(t, l);
      return !!(tile && tile.isTardigradeNest);
    }
    _isDesertCaveFloorRawAt(tx, ty) {
      const nearExit = this.getNearbyCaveExit(tx, ty, 3.5);
      const nearConnector = this.getNearbyCaveExit(tx, ty, 6.5);
      const nest = this.getDesertTardigradeNest(tx, ty);
      let inNestRoom = !1;
      let inNestCorridor = !1;
      if (nest) {
        const distToNestCenter = Math.hypot(tx - nest.cx, ty - nest.cy);
        const nestWobble = this.caveDetailNoise.noise2D(tx * 0.16, ty * 0.16) * 1.5;
        if (distToNestCenter + nestWobble <= nest.radius) inNestRoom = !0;
        if (nest.entTx !== undefined && nest.entTy !== undefined) {
          const segDist = this._distanceToSegment(tx, ty, nest.entTx, nest.entTy, nest.cx, nest.cy);
          const corrWobble = this.caveWallNoise.noise2D(tx * 0.12, ty * 0.12) * 0.75;
          if (segDist + corrWobble <= 2.2) inNestCorridor = !0;
        }
      }
      const isTunnelNoise = (x, y) => {
        const a = Math.abs(this.caveWallNoise.noise2D(x * 0.08, y * 0.08));
        const b = Math.abs(this.caveDetailNoise.noise2D(x * 0.08 + 137, y * 0.08 + 137));
        const c = Math.abs(this.caveRoomNoise.noise2D(x * 0.09 + 351, y * 0.09 + 351));
        return a < 0.088 || b < 0.088 || c < 0.088;
      };
      const inNarrowTunnel =
        isTunnelNoise(tx, ty) ||
        (isTunnelNoise(tx - 1, ty) && isTunnelNoise(tx, ty + 1)) ||
        (isTunnelNoise(tx + 1, ty) && isTunnelNoise(tx, ty + 1)) ||
        (isTunnelNoise(tx - 1, ty) && isTunnelNoise(tx, ty - 1)) ||
        (isTunnelNoise(tx + 1, ty) && isTunnelNoise(tx, ty - 1));
      const atExitPlaza = nearExit && nearExit.dist <= 2.8;
      const inConnectorTunnel =
        nearConnector &&
        ((Math.abs(nearConnector.dx) <= 1.5 && Math.abs(nearConnector.dy) <= 7.0) ||
          (Math.abs(nearConnector.dy) <= 1.5 && Math.abs(nearConnector.dx) <= 7.0));
      return !!(atExitPlaza || inConnectorTunnel || inNarrowTunnel || inNestRoom || inNestCorridor);
    }
    getDesertGeodeFissure(t, l) {
      if (!this._desertGeodeCache) {
        this._desertGeodeCache = new Map();
      }
      // Se o jogador entrou por uma caverna do deserto específica, garante uma fenda de geodo logo nas proximidades dos paredões dessa caverna!
      let anchorTx = Math.floor(t / 44) * 44 + 22;
      let anchorTy = Math.floor(l / 44) * 44 + 22;
      let cacheKey = `region_${Math.floor(t / 44)},${Math.floor(l / 44)}`;
      if (
        this.activeCaveEntranceIsDesert &&
        this.activeCaveEntranceCoords &&
        this.activeCaveEntranceCoords.tx !== undefined &&
        Math.hypot(t - this.activeCaveEntranceCoords.tx, l - this.activeCaveEntranceCoords.ty) <= 36
      ) {
        anchorTx = this.activeCaveEntranceCoords.tx;
        anchorTy = this.activeCaveEntranceCoords.ty;
        cacheKey = `ent_${anchorTx},${anchorTy}`;
      }
      if (this._desertGeodeCache.has(cacheKey)) {
        return this._desertGeodeCache.get(cacheKey);
      }

      const nest = this.getDesertTardigradeNest(anchorTx, anchorTy);
      let bestWallX = null,
        bestWallY = null,
        bestScore = -9999;

      // Procura nos paredões 2.5D do deserto ao redor de anchorTx, anchorTy um paredão cuja face sul dá para um corredor aberto!
      for (let dy = -16; dy <= 16; dy++) {
        for (let dx = -16; dx <= 16; dx++) {
          const dist = Math.hypot(dx, dy);
          if (dist < 4.5 || dist > 16.5) continue;
          const wx = anchorTx + dx;
          const wy = anchorTy + dy;
          if (this.getCaveEntranceAt(wx, wy) || this.getCaveEntranceAt(wx, wy + 1)) continue;
          if (nest && Math.hypot(wx - nest.cx, wy - nest.cy) <= nest.radius + 2.5) continue;
          // O bloco (wx, wy) DEVE ser um paredão do deserto (!isOpen)
          if (this._isDesertCaveFloorRawAt(wx, wy)) continue;
          // E o bloco ao sul (wx, wy + 1) DEVE ser piso aberto da caverna para a face frontal 2.5D do paredão ficar exposta e acessível!
          if (!this._isDesertCaveFloorRawAt(wx, wy + 1)) continue;

          const wallLeft = !this._isDesertCaveFloorRawAt(wx - 1, wy);
          const wallRight = !this._isDesertCaveFloorRawAt(wx + 1, wy);
          const wallTop = !this._isDesertCaveFloorRawAt(wx, wy - 1);
          const floorSouth2 = this._isDesertCaveFloorRawAt(wx, wy + 2);
          const h = this.hash2D(wx, wy, 9417);
          const sc =
            (wallLeft ? 3.0 : 0) +
            (wallRight ? 3.0 : 0) +
            (wallTop ? 2.5 : 0) +
            (floorSouth2 ? 2.0 : 0) -
            Math.abs(dist - 8.5) * 0.45 +
            h * 2.0;
          if (sc > bestScore) {
            bestScore = sc;
            bestWallX = wx;
            bestWallY = wy;
          }
        }
      }

      if (bestWallX === null) {
        bestWallX = anchorTx + 6;
        bestWallY = anchorTy - 5;
      }

      const res = {
        tx: bestWallX,
        ty: bestWallY,
        anchorTx,
        anchorTy,
        geodeCenterX: bestWallX,
        geodeCenterY: bestWallY - 9,
        radiusX: 11.5,
        radiusY: 9.5,
      };
      this._desertGeodeCache.set(cacheKey, res);
      return res;
    }
    isGeodeFissureAt(t, l) {
      const f = this.getDesertGeodeFissure(t, l);
      return f && f.tx === t && f.ty === l ? f : null;
    }
    getGeodeTile(t, l) {
      const u = this.hash2D(t, l, 7);
      const origin = this.activeGeodeFissureCoords || { tx: t, ty: l + 9 };
      const gcx = origin.tx;
      const gcy = origin.ty - 9;
      const exitTx = origin.tx;
      const exitTy = origin.ty;
      const rx = 11.5;
      const ry = 9.5;
      const dx = t - gcx;
      const dy = l - gcy;

      // Fenda de saída na parede sul do Geodo (volta para a caverna de arenito do deserto)
      if (t === exitTx && l === exitTy) {
        return {
          tx: t,
          ty: l,
          elevation: 0.9,
          moisture: 0.4,
          temperature: 0.5,
          biome: BIOMES[BiomeId.DESERT_CAVE_WALL],
          isDesertCave: !0,
          isGeodeInterior: !0,
          isGeodeExitWall: !0,
          isCaveRockWall25D: !0,
          prop: {
            kind: "geode_exit_fissure",
            wallTheme: "earth_mine",
            targetTx: exitTx,
            targetTy: exitTy,
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            interactive: !0,
            namePt: "Fenda Terrosa de Saída do Geodo [Paredão do Deserto]",
            descriptionPt:
              "Abertura estreita esculpida em terra e argila compactada que retorna aos túneis do deserto. Pressione [F] ou caminhe até a fenda para sair!",
          },
          detailHash: u,
        };
      }

      // Passagem de entrada logo ao norte da fenda de saída (garante corredor amplo e livre para entrar e sair)
      const inEntryVestibule = Math.abs(t - exitTx) <= 2 && l >= exitTy - 4 && l < exitTy;

      const angle = Math.atan2(dy, dx);
      const wobble =
        Math.sin(angle * 5 + (gcx * 0.37 + gcy * 0.71)) * 0.055 +
        Math.cos(angle * 3 - gcx * 0.23) * 0.045;
      const normDist = Math.hypot(dx / rx, dy / ry) + wobble;

      const isFloor = inEntryVestibule || (normDist <= 0.80 && l < exitTy);

      if (!isFloor) {
        return {
          tx: t,
          ty: l,
          elevation: 0.95,
          moisture: 0.45,
          temperature: 0.45,
          biome: BIOMES[BiomeId.CAVE_WALL],
          isGeodeInterior: !0,
          isGeodeWall: !0,
          isCaveRockWall25D: !0,
          prop: {
            kind: "cave_wall_25d",
            wallTheme: "geode_crystal",
            subType: Math.floor(u * 4),
            scale: 1,
            namePt: "Casca Cristalina do Geodo",
            descriptionPt:
              "Paredão 2.5D de basalto e ágata bandeada forrado por drusas colossais de ametista, quartzo e safira estelar.",
          },
          detailHash: u,
        };
      }

      // Lago subterrâneo com algas luminosas no centro do Geodo!
      const lakeDist =
        Math.hypot(dx / 4.2, dy / 3.4) +
        Math.sin(angle * 4 + gcx * 0.5) * 0.07 +
        Math.cos(angle * 3 - gcy * 0.4) * 0.05;
      const isCentralLake = !inEntryVestibule && lakeDist <= 0.92;

      const pKey = `underground_${t},${l}`;
      const intState =
        this.interactedProps.get(pKey) ||
        this.interactedProps.get(`cave_${t},${l}`) ||
        this.interactedProps.get(`${t},${l}`) ||
        {};
      let geodeProp = null;
      const placedKey = `cave_${t},${l}`;

      if (isCentralLake) {
        if (this.customPlacedProps.has(placedKey)) {
          geodeProp = { ...this.customPlacedProps.get(placedKey) };
        } else {
          const algaeHash = this.hash2D(t, l, 919);
          const subAlgae = this.hash2D(t, l, 929);
          const isExactCenter = t === gcx && l === gcy;
          if (isExactCenter || algaeHash < 0.62) {
            const aType = isExactCenter ? 0 : Math.floor(subAlgae * 3);
            geodeProp = {
              kind: "luminous_algae",
              subType: aType,
              offsetX: isExactCenter ? 0 : (subAlgae - 0.5) * 8,
              offsetY: isExactCenter ? 0 : (algaeHash - 0.3) * 6,
              scale: isExactCenter ? 1.35 : 0.92 + (algaeHash % 0.35),
              interactive: !0,
              namePt: isExactCenter
                ? "Colônia Real de Algas Luminosas do Geodo"
                : "Algas Luminosas Bioluminescentes",
              descriptionPt:
                "Filamentos aquáticos bioluminescentes que brilham em tons de ciano, esmeralda e turquesa nas águas cristalinas do centro do geodo. Pressione [F] para colher e restaurar vigor!",
            };
          }
        }
        return {
          tx: t,
          ty: l,
          elevation: 0.22,
          moisture: 0.95,
          temperature: 0.48,
          biome: BIOMES[BiomeId.CAVE_LAKE],
          isGeodeInterior: !0,
          isGeodeLake: !0,
          geodeNormDist: normDist,
          roomName: "Lago de Algas Luminosas do Geodo",
          prop: geodeProp,
          detailHash: u,
        };
      }

      // Piso cristalino interno do Geodo ao redor do lago (com drusas de cristal mineráveis abundantes!)
      if (this.customPlacedProps.has(placedKey)) {
        geodeProp = { ...this.customPlacedProps.get(placedKey) };
      } else if (!inEntryVestibule && !(Math.abs(t - exitTx) <= 1 && l >= exitTy - 4)) {
        const cHash = this.hash2D(t, l, 811);
        const subHash = this.hash2D(t, l, 823);
        const isRingEdge = normDist >= 0.56 && normDist <= 0.78;
        const isLakeShore = lakeDist > 0.92 && lakeDist <= 1.22;
        if ((isRingEdge && cHash < 0.42) || (isLakeShore && cHash < 0.28) || (!isRingEdge && !isLakeShore && cHash < 0.16)) {
          const opened = !!intState.opened;
          const cType = Math.floor(subHash * 4);
          const cNames = [
            "Drusa de Ametista do Geodo",
            "Drusa de Safira Estelar do Geodo",
            "Drusa de Rubi Ígneo do Geodo",
            "Drusa de Esmeralda Cristalina do Geodo",
          ];
          geodeProp = {
            kind: "crystal_cluster",
            subType: cType,
            offsetX: (subHash - 0.5) * 6,
            offsetY: -2,
            scale: isRingEdge ? 1.22 : 1.08,
            interactive: !0,
            opened: opened,
            namePt: opened ? `${cNames[cType]} (Minerada)` : cNames[cType],
            descriptionPt: opened
              ? "Esta formação cristalina do geodo já foi extraída."
              : "Formação reluzente de cristais puros crescidos no interior da cavidade do geodo. Pressione [F] para minerar!",
          };
        } else if (cHash > 0.92) {
          const opened = !!intState.opened;
          const oType = Math.floor(subHash * 3);
          const oNames = [
            "Veio de Ouro Puro do Geodo",
            "Veio de Mitril Cristalino",
            "Veio de Ferro Meteórico",
          ];
          geodeProp = {
            kind: "ore_vein",
            subType: oType,
            offsetX: 0,
            offsetY: 0,
            scale: 1.05,
            interactive: !0,
            opened: opened,
            namePt: opened ? `${oNames[oType]} (Extraído)` : oNames[oType],
            descriptionPt: opened
              ? "Este veio mineral já foi extraído."
              : "Veio metálico raro exposto entre as camadas de ágata do geodo. Pressione [F] para extrair!",
          };
        }
      }

      return {
        tx: t,
        ty: l,
        elevation: 0.12,
        moisture: 0.5,
        temperature: 0.45,
        biome: BIOMES[BiomeId.CAVE_CRYSTAL],
        isGeodeInterior: !0,
        isGeodeFloor: !0,
        geodeNormDist: normDist,
        roomName: "Interior do Geodo de Cristais",
        prop: geodeProp,
        detailHash: u,
      };
    }
    hash2D(t, l, o = 0) {
      let u =
        (t * 374761393) ^ (l * 668265263) ^ (this.seed * 31) ^ (o * 1013904223);
      return (
        (u = (u ^ (u >>> 13)) * 1274126177),
        ((u ^ (u >>> 16)) >>> 0) / 4294967296
      );
    }
    getTile(t, l) {
      const o = this._tk(t, l, this.undergroundLevel || (this.isUnderground ? 1 : 0)),
        u = this.tileCache.get(o);
      if (u) {
        return !this.isUnderground && u.biome.id === BiomeId.MOUNTAIN_25D
          ? this._syncBluePlantProp(t, l, u)
          : u;
      }
      if (this.isUnderground) {
        if (this.undergroundLevel === 3) {
          const ue = this.getGeodeTile(t, l);
          return (this.tileCache.set(o, ue), ue);
        }
        if (this.undergroundLevel === 2) {
          const ue = this.getDungeonTile(t, l);
          return (this.tileCache.set(o, ue), ue);
        }
        const ue = this.getUndergroundTile(t, l);
        return (this.tileCache.set(o, ue), ue);
      }
      return this.getSurfaceTile(t, l);
    }
    findTemperateForestSpawn() {
      // Procura espiral a partir da origem por um ladrilho caminhável, plano e limpo em Floresta Temperada (BiomeId.FOREST)
      for (let r = 0; r <= 40; r++) {
        for (let dx = -r; dx <= r; dx++) {
          for (let dy = -r; dy <= r; dy++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const tile = this.getTile(dx, dy);
            if (
              tile &&
              tile.biome &&
              tile.biome.id === BiomeId.FOREST &&
              !tile.biome.hasWater &&
              tile.biome.passable !== false &&
              tile.passable !== false
            ) {
              const hasObstacle = tile.prop && (
                (typeof tile.prop.kind === "string" && (
                  tile.prop.kind.startsWith("tree") ||
                  tile.prop.kind === "rock" ||
                  tile.prop.kind === "boulder" ||
                  tile.prop.kind === "large_rock" ||
                  tile.prop.kind === "cave_entrance" ||
                  tile.prop.kind === "ore" ||
                  tile.prop.kind === "cactus"
                )) ||
                tile.prop.passable === false
              );
              if (!hasObstacle) {
                return {
                  x: dx * this.tileSize + this.tileSize / 2,
                  y: dy * this.tileSize + this.tileSize / 2,
                  tx: dx,
                  ty: dy,
                  biome: tile.biome,
                };
              }
            }
          }
        }
      }
      return { x: 0, y: 0, tx: 0, ty: 0, biome: (this.getTile(0, 0) && this.getTile(0, 0).biome) || BIOMES[BiomeId.FOREST] };
    }
    // Peso (0..1) do "Vale Inicial": 1 = valores fixos de Floresta Temperada, 0 = ruido normal do mundo.
    // - r <= 80: floresta pura (igual a antes, protege o que o jogador construiu perto do inicio).
    // - Depois a transicao vai ate ~SPAWN_BLEND_OUTER blocos, e a DISTANCIA e deformada por ruido de baixa
    //   frequencia (cresce de 0 em r=80 ate o maximo em r=240), entao o contorno do bioma inicial e orgânico e do
    //   tamanho dos outros biomas, em vez de um circulo pequeno (raio ~100) cercado de aneis concentricos.
    // Para voltar ao comportamento antigo (circulo 80..170): window.__legacySpawnBlend = true ANTES de criar o mundo.
    _spawnBlendAt(t, l, w) {
      const r = w === void 0 ? Math.hypot(t, l) : w;
      if (r <= 80) return 1;
      if (typeof window !== "undefined" && window.__legacySpawnBlend) {
        if (r >= 170) return 0;
        return 0.5 * (1 + Math.cos(Math.PI * ((r - 80) / 90)));
      }
      const OUTER = 760; // fim da transicao (distancia deformada)
      const MAX_WARP = 290; // maior deformacao possivel (soma das duas escalas)
      if (r >= OUTER + MAX_WARP) return 0;
      const n1 = this.detailNoise.noise2D(t * 0.0021 + 410, l * 0.0021 + 410);
      const n2 = this.detailNoise.noise2D(t * 0.0035 + 930, l * 0.0035 + 930);
      const ramp = Math.min(1, (r - 80) / 160);
      const rr = r + (n1 * 240 + n2 * 50) * ramp;
      if (rr <= 80) return 1;
      const k = Math.min(1, (rr - 80) / (OUTER - 80));
      return 0.5 * (1 + Math.cos(Math.PI * k));
    }
    _computeSurfaceBaseBiome(t, l) {
      // Escala continental ampliada (6x maior): garante que NENHUM bioma tenha menos de 2.000 blocos!
      const S_BIOME = 0.16;
      const m = this.detailNoise.noise2D(t * 0.00125 * S_BIOME, l * 0.00125 * S_BIOME) * 180,
        c = this.detailNoise.noise2D(t * 0.00125 * S_BIOME + 77, l * 0.00125 * S_BIOME + 77) * 180,
        f = t + m,
        g = l + c,
        y = this.elevNoise.fbm2D(f * 0.000275 * S_BIOME, g * 0.000275 * S_BIOME, 2, 2, 0.4),
        w = Math.hypot(t, l);

      // Vale Inicial de Floresta Temperada em torno da origem (raio de 80 blocos puros; depois uma transição larga
      // e IRREGULAR, ver _spawnBlendAt): garante que qualquer seed inicie na Floresta Temperada verdejante, com solo
      // plano e caminhável, sem cair em paredões rochosos ("montanhas de pedras") ou no deserto.
      const spawnBlend = this._spawnBlendAt(t, l, w);

      let T = Math.max(0, Math.min(1, y * (1 - spawnBlend) + 0.53 * spawnBlend)),
        S = !1,
        p = !1,
        j = !1;
      if (y < 0.24 && spawnBlend === 0) {
        const ue = this.islandNoise.fbm2D(
          t * 0.00055 * S_BIOME + 400,
          l * 0.00055 * S_BIOME + 400,
          2,
          2,
          0.45,
        );
        if (ue > 0.56) {
          S = !0;
          const N = (ue - 0.56) / 0.44;
          T = 0.32 + N * 0.56;
          const Ee = this.featureNoise.fbm2D(
            t * 0.000625 * S_BIOME + 200,
            l * 0.000625 * S_BIOME + 200,
            2,
            2,
            0.5,
          );
          Ee > 0.45 &&
            ((p = !0), (N > 0.4 || (Ee > 0.58 && T > 0.55)) && (j = !0));
        }
      }
      const P = this.tempNoise.fbm2D(f * 0.000225 * S_BIOME + 150, g * 0.000225 * S_BIOME + 150, 2, 2, 0.4) * (1 - spawnBlend) + 0.38 * spawnBlend,
        A = this.moistNoise.fbm2D(
          f * 0.0003 * S_BIOME + 280,
          g * 0.0003 * S_BIOME + 280,
          2,
          2,
          0.4,
        ) * (1 - spawnBlend) + 0.45 * spawnBlend,
        x = this.featureNoise.fbm2D(
          t * 0.00075 * S_BIOME + 320,
          l * 0.00075 * S_BIOME + 320,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        M = this.featureNoise.fbm2D(
          t * 0.0007 * S_BIOME + 560,
          l * 0.0007 * S_BIOME + 560,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        $ = this.canyonNoise.fbm2D(
          t * 0.0007 * S_BIOME + 780,
          l * 0.0007 * S_BIOME + 780,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        z =
          w < 40
            ? 0
            : this.lakeNoise.fbm2D(
                f * 0.00195 * S_BIOME + 920,
                g * 0.00195 * S_BIOME + 920,
                2,
                2,
                0.45,
              ) * (1 - spawnBlend);
      if (typeof window !== "undefined" && window.SnowPeakCity && (window.SnowPeakCity.isCityBiomeArea ? window.SnowPeakCity.isCityBiomeArea(t, l) : window.SnowPeakCity.isCityTerritory(t, l))) {
        return BIOMES.SNOW_PEAK;
      }
      if (typeof window !== "undefined" && window.DesertCity && (window.DesertCity.isCityBiomeArea ? window.DesertCity.isCityBiomeArea(t, l) : window.DesertCity.isCityTerritory(t, l))) {
        return BIOMES.DESERT;
      }
      if (typeof window !== "undefined" && window.PortCity && (window.PortCity.isCityBiomeArea ? window.PortCity.isCityBiomeArea(t, l) : window.PortCity.isCityTerritory(t, l))) {
        if (window.PortCity.getBiomeForTile) {
          const pb = window.PortCity.getBiomeForTile(t, l);
          if (pb) return pb;
        }
        return window.PortCity.isCityWaterArea && window.PortCity.isCityWaterArea(t, l)
          ? BIOMES.COAST_WATER
          : BIOMES.BEACH;
      }
      return Jp(T, A, P, {
        isIsland: S,
        isVolcano: p,
        volcanoCore: j,
        swampVal: x,
        oasisVal: M,
        canyonVal: $,
        lakeVal: z,
      });
    }
    // [PERF] Chave numerica pequena (cabe em inteiro de 31 bits) para os caches de montanha.
    // _tk() gera numeros enormes (> 2^31) que deixam o Map do JS lento; fora do intervalo cai no _tk().
    _mk(t, l) {
      return t > -16384 && t < 16384 && l > -16384 && l < 16384 && (t | 0) === t && (l | 0) === l
        ? (t + 16384) * 32768 + (l + 16384)
        : this._tk(t, l, !1);
    }
    // [PERF] Resultado de "este tile é do bioma de montanha?" guardado por tile.
    // Antes cada chamada refazia ~9 ruidos fbm; os escaneamentos de borda chamam isto milhares de vezes.
    _isMountain25DBiomeAt(t, l) {
      const o = this._mk(t, l);
      let cache = this._mtnBiomeCache;
      if (!cache) cache = this._mtnBiomeCache = new Map();
      const hit = cache.get(o);
      if (hit !== void 0) return hit;
      const u = this.tileCache.get(this._tk(t, l, !1));
      const r = u
        ? u.biome.id === BiomeId.MOUNTAIN_25D
        : this._computeSurfaceBaseBiome(t, l).id === BiomeId.MOUNTAIN_25D;
      if (cache.size > 600000) cache.clear();
      cache.set(o, r);
      return r;
    }
    _clearMountainCaches() {
      this._mtnBiomeCache && this._mtnBiomeCache.clear();
      this._mtnInfoCache && this._mtnInfoCache.clear();
      this._mountainBoundsCache && this._mountainBoundsCache.clear();
      this._bluePeakCache && this._bluePeakCache.clear();
    }
    _isMeadowCityBiomeAt(t, l) {
      const b = this._computeSurfaceBaseBiome(t, l);
      return b.id === BiomeId.MEADOW && !b.hasWater;
    }
    _getMeadowCityDistrict(t, l) {
      // Escaneia a extensão contínua do bioma Planície Florida (MEADOW) onde o tile está,
      // de modo que cada bioma tenha uma Cidade Grega completa com:
      // - Entre 1 a 3 Salões Monumentais (o padrão de 4 salões e corredores em cruz) no bioma!
      // - Várias Casas espalhadas ao redor (cada casa é uma construção própria com as 4 salas e corredores internos)
      // - Piso falhado (onde algumas lajes de mármore sumiram/quebraram deixando a grama/terra aparecer)
      if (!this._isMeadowCityBiomeAt(t, l)) return null;
      if (!this._greekBiomeCityCache) {
        this._greekBiomeCityCache = new Map();
      }
      // Quantiza em blocos de 8 tiles para cache rápido, mas mede as bordas reais do bioma
      const qx = Math.floor(t / 8),
        qy = Math.floor(l / 8),
        qKey = `${qx},${qy}`;
      if (this._greekBiomeCityCache.has(qKey)) {
        return this._greekBiomeCityCache.get(qKey);
      }

      const maxScan = 480;
      let minX = t,
        maxX = t,
        minY = l,
        maxY = l;
      while (t - minX < maxScan && this._isMeadowCityBiomeAt(minX - 1, l)) minX--;
      while (maxX - t < maxScan && this._isMeadowCityBiomeAt(maxX + 1, l)) maxX++;
      while (l - minY < maxScan && this._isMeadowCityBiomeAt(t, minY - 1)) minY--;
      while (maxY - l < maxScan && this._isMeadowCityBiomeAt(t, maxY + 1)) maxY++;

      const midX = Math.round((minX + maxX) * 0.5),
        midY = Math.round((minY + maxY) * 0.5);
      let cMinX = midX,
        cMaxX = midX,
        cMinY = midY,
        cMaxY = midY;
      while (midX - cMinX < maxScan && this._isMeadowCityBiomeAt(cMinX - 1, midY)) cMinX--;
      while (cMaxX - midX < maxScan && this._isMeadowCityBiomeAt(cMaxX + 1, midY)) cMaxX++;
      while (midY - cMinY < maxScan && this._isMeadowCityBiomeAt(midX, cMinY - 1)) cMinY--;
      while (cMaxY - midY < maxScan && this._isMeadowCityBiomeAt(midX, cMaxY + 1)) cMaxY++;

      const cx = Math.round((cMinX + cMaxX) * 0.5),
        cy = Math.round((cMinY + cMaxY) * 0.5),
        width = cMaxX - cMinX + 1,
        height = cMaxY - cMinY + 1;

      // Quantiza o centro do bioma para que todos os tiles da mesma região encontrem a mesma lista de construções
      const anchorX = Math.round(cx / 32) * 32,
        anchorY = Math.round(cy / 32) * 32,
        anchorKey = `city_${anchorX},${anchorY}`;

      if (this._greekBiomeCityCache.has(anchorKey)) {
        const cachedCity = this._greekBiomeCityCache.get(anchorKey);
        this._greekBiomeCityCache.set(qKey, cachedCity);
        return cachedCity;
      }

      if (width < 20 || height < 20 || Math.hypot(anchorX, anchorY) < 26) {
        this._greekBiomeCityCache.set(qKey, null);
        return null;
      }

      const cityHash = this.hash2D(anchorX, anchorY, 503);
      // Quantidade de Grandes Salões (padrão de 4 salões e corredores): entre 1 a 3 apenas no bioma!
      const maxHallsBySize = width >= 64 || height >= 64 ? 3 : width >= 42 || height >= 42 ? 2 : 1;
      const hallCount = Math.min(maxHallsBySize, 1 + (Math.floor(cityHash * 3) % 3)); // 1, 2 ou 3

      const buildings = [];
      const canPlaceBuilding = (bx, by, hw, hh) => {
        if (Math.hypot(bx, by) < 25) return !1;
        if (!this._isMeadowCityBiomeAt(bx, by)) return !1;
        if (
          !this._isMeadowCityBiomeAt(bx - hw, by - hh) ||
          !this._isMeadowCityBiomeAt(bx + hw, by - hh) ||
          !this._isMeadowCityBiomeAt(bx - hw, by + hh) ||
          !this._isMeadowCityBiomeAt(bx + hw, by + hh)
        ) {
          return !1;
        }
        // Evita sobreposição entre salões e casas (deixa ruas/vielas de pelo menos 4 blocos entre eles)
        for (let i = 0; i < buildings.length; i++) {
          const b = buildings[i];
          if (
            Math.abs(bx - b.cx) <= hw + b.halfW + 4 &&
            Math.abs(by - b.cy) <= hh + b.halfH + 4
          ) {
            return !1;
          }
        }
        return !0;
      };

      // 1. Posiciona de 1 a 3 Salões Principais (padrão 4 salões + corredores em cruz, halfW=9, halfH=8)
      const hallOffsets = [
        [0, 0],
        [-26, -6],
        [26, 6],
        [0, -24],
        [0, 24],
        [-24, 18],
        [24, -18],
      ];
      for (let i = 0; i < hallOffsets.length && buildings.filter((b) => b.kind === "hall").length < hallCount; i++) {
        const ox = hallOffsets[i][0],
          oy = hallOffsets[i][1],
          jx = Math.floor((this.hash2D(anchorX + i, anchorY, 521) - 0.5) * 4),
          jy = Math.floor((this.hash2D(anchorX, anchorY + i, 523) - 0.5) * 4),
          bx = anchorX + ox + jx,
          by = anchorY + oy + jy;
        if (canPlaceBuilding(bx, by, 9, 8)) {
          buildings.push({
            kind: "hall",
            index: buildings.length,
            cx: bx,
            cy: by,
            halfW: 9,
            halfH: 8,
            unfinished: i === 2 && cityHash > 0.55, // O 3º salão pode estar em construção inacabada
          });
        }
      }
      // Garante pelo menos 1 Salão Principal caso os offsets precisem de ajuste fino para o centro real (cx, cy)
      if (buildings.length === 0 && Math.hypot(cx, cy) >= 25) {
        buildings.push({
          kind: "hall",
          index: 0,
          cx: cx,
          cy: cy,
          halfW: 9,
          halfH: 8,
          unfinished: !1,
        });
      }

      // 2. Espalha várias CASAS (cada uma com o padrão de 4 salas internas e corredores em cruz!) ao redor dos salões
      //    para formar uma Cidade Grega bem completa!
      const houseCandidates = [
        [-22, -20], [0, -22], [22, -20],
        [-24, 0],             [24, 0],
        [-22, 20],  [0, 22],  [22, 20],
        [-14, -22], [14, -22], [-14, 22], [14, 22],
        [-38, -14], [38, -14], [-38, 14], [38, 14],
        [-38, 0],   [38, 0],   [0, -38],  [0, 38],
      ];
      const baseCx = buildings[0] ? buildings[0].cx : cx;
      const baseCy = buildings[0] ? buildings[0].cy : cy;
      for (let i = 0; i < houseCandidates.length; i++) {
        const hxOff = houseCandidates[i][0],
          hyOff = houseCandidates[i][1],
          jx = Math.floor((this.hash2D(baseCx + i * 7, baseCy, 541) - 0.5) * 4),
          jy = Math.floor((this.hash2D(baseCx, baseCy + i * 7, 547) - 0.5) * 4),
          bx = baseCx + hxOff + jx,
          by = baseCy + hyOff + jy,
          isUnfinishedHouse = (i % 5 === 4);
        // Cada Casa tem 4 salas divididas por corredores em cruz (halfW: 7, halfH: 6 -> 15x13 tiles)
        if (canPlaceBuilding(bx, by, 7, 6)) {
          buildings.push({
            kind: "house",
            index: buildings.length,
            houseVariant: i % 4,
            cx: bx,
            cy: by,
            halfW: 7,
            halfH: 6,
            unfinished: isUnfinishedHouse,
          });
        }
      }

      // Garante que PELO MENOS 2 construções na cidade apareçam 100% COMPLETAS e INTACTAS (sem paredes quebradas e sem piso falhado)!
      // O 1º Salão Principal (buildings[0]) e a 1ª Casa/Construção seguinte (buildings[1], além de mais casas pares) ficam totalmente completos!
      let completeCount = 0;
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        if (!b.unfinished && (i === 0 || i === 1 || i % 3 === 0)) {
          b.isComplete = !0;
          completeCount++;
        } else {
          b.isComplete = !1;
        }
      }
      // Caso por qualquer motivo ainda tenha menos de 2 completas, força as primeiras construções a serem completas
      for (let i = 0; i < buildings.length && completeCount < 2; i++) {
        if (!buildings[i].isComplete) {
          buildings[i].unfinished = !1;
          buildings[i].isComplete = !0;
          completeCount++;
        }
      }

      const city =
        buildings.length > 0
          ? {
              cx: baseCx,
              cy: baseCy,
              halfW: 9,
              halfH: 8,
              stairTx: baseCx,
              stairTy: baseCy + 14,
              buildings,
            }
          : null;
      this._greekBiomeCityCache.set(anchorKey, city);
      this._greekBiomeCityCache.set(qKey, city);
      return city;
    }
    _getGreekRuinCellAt(t, l) {
      if (this.isUnderground) return null;
      const city = this._getMeadowCityDistrict(t, l);
      if (!city || !city.buildings || city.buildings.length === 0) return null;

      // Hash determinístico por tile para irregularidades nas paredes, topos quebrados e PISO FALHADO
      const th = this.hash2D(t, l, 409),
        th2 = this.hash2D(t, l, 419),
        floorHoleHash = this.hash2D(t, l, 431);
      // Topo da parede irregular: 0 = completo com friso, 1 = topo lascado em degraus, 2 = meia altura, 3 = base baixa/inacabada
      let wallHeightState = th < 0.32 ? 0 : th < 0.66 ? 1 : th < 0.88 ? 2 : 3;
      // ~24% dos pisos possuem "piso falhado" (lajes quebradas ou faltando onde a grama/terra aparece)
      const isFloorFailed = floorHoleHash < 0.24;

      // Verifica se o tile (t, l) cai dentro de algum dos Salões (1 a 3) ou de alguma das várias Casas (4 salas cada)
      let activeBld = null;
      let minDist = 9999;
      for (let i = 0; i < city.buildings.length; i++) {
        const b = city.buildings[i],
          rx = t - b.cx,
          ry = l - b.cy;
        if (Math.abs(rx) <= b.halfW && Math.abs(ry) <= b.halfH + (b.kind === "hall" ? 1 : 0)) {
          activeBld = b;
          break;
        }
        const d = Math.max(Math.abs(rx) - b.halfW, Math.abs(ry) - b.halfH);
        if (d < minDist) minDist = d;
      }

      // Entre os salões e casas da cidade (nas ruas/arredores próximos): espalha vasos, estátuas, colunas e pedras caídas
      if (!activeBld) {
        if (t === city.stairTx && l === city.stairTy) {
          return null;
        }
        if (minDist <= 4) {
          if (th < 0.026) {
            return {
              ruin: city,
              rx: t - city.cx,
              ry: l - city.cy,
              role: th2 < 0.34 ? "statue" : th2 < 0.7 ? "vase" : "column",
              roomName: "Via da Cidade Grega em Ruínas",
              subType: Math.floor(th2 * 3),
              wallHeightState: 2,
              floorFailed: !0,
            };
          }
          if (th > 0.968) {
            return {
              ruin: city,
              rx: t - city.cx,
              ry: l - city.cy,
              role: "rubble_wall",
              roomName: "Restos de Estrutura na Cidade",
              subType: 0,
              wallHeightState: 3,
              floorFailed: !0,
            };
          }
          // Calçamento falhado de pedras antigas conectando as casas e salões da cidade
          if (minDist <= 2 && floorHoleHash > 0.58) {
            return {
              ruin: city,
              rx: t - city.cx,
              ry: l - city.cy,
              role: "road",
              roomName: "Rua Antiga da Pólis",
              subType: 0,
              wallHeightState: 0,
              floorFailed: floorHoleHash < 0.74,
            };
          }
        }
        return null;
      }

      const rx = t - activeBld.cx,
        ry = l - activeBld.cy,
        W = activeBld.halfW, // 9 para Salão Monumental, 7 para Casa de 4 Salas
        H = activeBld.halfH, // 8 para Salão Monumental, 6 para Casa de 4 Salas
        isHall = activeBld.kind === "hall",
        isComplete = !!activeBld.isComplete,
        isUnfinished = !isComplete && !!activeBld.unfinished;

      let role = isHall ? "temple_floor" : "house_floor";
      let roomName = isHall
        ? isComplete
          ? `Salão Grego Monumental Completo #${(activeBld.index % 3) + 1}`
          : `Salão Grego Monumental #${(activeBld.index % 3) + 1}`
        : isComplete
          ? `Casa Grega Completa de 4 Cômodos #${activeBld.index}`
          : `Casa Grega de 4 Cômodos #${activeBld.index}`;
      let subType = Math.floor(th * 4);
      let doorVertical = !1;
      let isPreservedRoom = !1;

      if (isComplete) {
        // Construção 100% completa: topo da parede inteiro (0) e sem rachaduras de ruína
        wallHeightState = 0;
        subType = 0;
      } else if (isUnfinished) {
        wallHeightState = th < 0.5 ? 2 : 3;
      }

      // Escadaria e Pórtico Frontal Sul dos Salões Monumentais (ry === H + 1 e ry === H)
      if (isHall && ry === H + 1) {
        if (Math.abs(rx) <= 2) {
          role = "steps";
          roomName = "Escadaria do Propileu Grego";
        } else if (Math.abs(rx) === 4 || Math.abs(rx) === 7) {
          role = "column";
          roomName = "Colunata Dórica Frontal";
        } else {
          role = "porch";
        }
      } else if (isHall && ry === H) {
        if (Math.abs(rx) === 2) {
          role = "column";
          roomName = "Coluna do Portal Grego";
        } else {
          role = "porch";
          roomName = "Pórtico de Entrada (Propileu)";
        }
      } else {
        // =========================================================================
        // PADRÃO ARQUITETÔNICO DE 4 SALAS + CORREDORES EM CRUZ (usado nos 1 a 3 Salões
        // e também nas várias Casas de 4 cômodos espalhadas pela cidade!)
        // =========================================================================
        const southWallY = isHall ? H - 1 : H;
        const northWallY = -H;
        const isOuterWall = Math.abs(rx) === W || ry === northWallY || ry === southWallY;

        isPreservedRoom = !1;
        const inSWQuadrant = rx <= -2 && ry >= 2 && ry <= southWallY;
        if (inSWQuadrant && (isHall || isComplete || activeBld.index === 0 || activeBld.index === 1)) {
          isPreservedRoom = !0;
        }

        // Portas / Entradas na parede externa (Sul, Leste, Oeste)
        const isSouthMainDoor = ry === southWallY && Math.abs(rx) <= 1;
        const isSideCorridorDoor = Math.abs(rx) === W && ry === 0;

        // Paredes internas que dividem o interior nas 4 Salas (Casa/Salão) e Corredores em Cruz:
        // Corredor vertical central: rx in [-1..1]
        // Corredor horizontal central: ry in [-1..1]
        const roomDoorYNorth = isHall ? -4 : -3;
        const roomDoorYSouth = isHall ? 4 : 3;
        const roomDoorX = isHall ? 5 : 4;

        const isVerticalRoomWall =
          Math.abs(rx) === 2 &&
          ry >= northWallY + 1 &&
          ry <= southWallY - 1 &&
          Math.abs(ry) > 1 &&
          ry !== roomDoorYNorth &&
          ry !== roomDoorYSouth;

        const isHorizontalRoomWall =
          Math.abs(ry) === 2 &&
          Math.abs(rx) >= 2 &&
          Math.abs(rx) <= W - 1 &&
          Math.abs(rx) !== roomDoorX;

        const isRoomDoorTile =
          (Math.abs(rx) === 2 && (ry === roomDoorYNorth || ry === roomDoorYSouth)) ||
          (Math.abs(ry) === 2 && Math.abs(rx) === roomDoorX) ||
          (!isHall && ry === southWallY && rx === 0);

        if (isRoomDoorTile && (isComplete || isPreservedRoom || th < 0.72)) {
          role = "door";
          doorVertical = Math.abs(rx) === 2;
          roomName = (rx === -2 && ry === roomDoorYSouth && isPreservedRoom)
            ? "Porta da Biblioteca Preservada"
            : (isHall ? "Porta do Salão Helênico" : "Porta da Casa Grega");
        } else if ((isOuterWall && !isSouthMainDoor && !isSideCorridorDoor) || isVerticalRoomWall || isHorizontalRoomWall) {
          const isCorner =
            (Math.abs(rx) === W && (ry === northWallY || ry === southWallY)) ||
            (Math.abs(rx) === 2 && Math.abs(ry) === 2);
          // Se a construção for COMPLETA ou parte da Sala Preservada, nenhuma parede é quebrada!
          if (isComplete || isPreservedRoom) {
            role = "wall";
            wallHeightState = 0;
          } else if (isUnfinished && (rx + ry) % 3 === 0) {
            role = "unfinished_foundation";
          } else if (!isCorner && th > 0.82) {
            role = "rubble_floor";
          } else {
            role = "wall";
          }
        } else {
          // Interior das 4 Salas da Casa / Salão e Corredores:
          const inNW = rx <= -3 && ry <= -3; // 1ª Sala (Noroeste: Quarto / Ânforas)
          const inNE = rx >= 3 && ry <= -3;  // 2ª Sala (Nordeste: Sala de Banquetes Andron / Tesouro)
          const inSW = rx <= -3 && ry >= 3;  // 3ª Sala (Sudoeste: Cozinha / Estudo / Filósofos)
          const inSE = rx >= 3 && ry >= 3;   // 4ª Sala (Sudeste: Oficina / Guarda / Construção)
          const midRoomX = isHall ? 6 : 5;
          const midRoomYNorth = isHall ? -5 : -4;
          const midRoomYSouth = isHall ? 4 : 4;

          if (isUnfinished && rx === 0 && ry === 0) {
            role = "unfinished_work";
            subType = 0; // Guindaste / Andaime no centro da construção inacabada
            roomName = "Construção Grega Inacabada";
          } else if (rx === 0 && ry === 0) {
            role = "mosaic_center";
            roomName = isHall ? "Átrio Central do Salão" : "Pátio Central da Casa (Oikos)";
          } else if (isHall && rx === 0 && ry === northWallY + 2) {
            role = "altar";
            roomName = "Naos do Templo / Salão Principal";
          } else if (rx === 0 && ry === northWallY + 1) {
            role = "statue";
            subType = isHall ? 0 : 1;
          } else if (inNW) {
            roomName = isHall ? "Câmara Noroeste (Ânforas e Estátuas)" : "1º Cômodo da Casa (Quarto Thalamos)";
            if (rx === -midRoomX && ry === midRoomYNorth) {
              role = isHall ? "vase" : "furniture";
              subType = 0; // Cama/Divã Kline na casa
            } else if (rx === -(midRoomX - 2) && ry === midRoomYNorth - 1) {
              role = "vase";
            } else if (isHall && rx === -4 && ry === -6) {
              role = "column";
            }
          } else if (inNE) {
            roomName = isHall ? "Câmara Nordeste (Tesouro Helênico)" : "2º Cômodo da Casa (Andron de Banquetes)";
            if (rx === midRoomX && ry === midRoomYNorth) {
              role = isHall ? "chest" : "furniture";
              subType = 1; // Mesa Trapeza posta na casa
            } else if (rx === midRoomX - 2 && ry === midRoomYNorth - 1) {
              role = isHall ? "statue" : "vase";
            } else if (isHall && rx === 4 && ry === -6) {
              role = "column";
            }
          } else if (inSW) {
            const isPreservedLibrary = isHall || isComplete || activeBld.index === 0 || activeBld.index === 1;
            if (isPreservedLibrary) {
              isPreservedRoom = !0;
              roomName = isHall
                ? "Biblioteca Preservada dos Filósofos (Arquivo de Manuscritos)"
                : "Biblioteca e Estudo Preservado da Casa Helênica";

              if (isHall) {
                // Sala espaçosa do Salão Monumental (rx in [-8, -3], ry in [3, 7]):
                // Estantes de livros alinhadas na parede norte da sala (ry === 3):
                if (ry === 3 && (rx === -7 || rx === -6 || rx === -4 || rx === -3)) {
                  role = "bookshelf";
                  subType = rx === -7 ? 0 : rx === -6 ? 1 : rx === -4 ? 2 : 3;
                }
                // Mesas e suportes de pergaminhos na área de estudo (ry === 5 e 6):
                else if (ry === 5 && rx === -6) {
                  role = "scroll_stand";
                  subType = 0; // Mesa de estudos com pergaminho aberto
                } else if (ry === 5 && rx === -4) {
                  role = "scroll_stand";
                  subType = 1; // Suporte de rolos de papiro / capsa
                } else if (ry === 6 && rx === -7) {
                  role = "scroll_stand";
                  subType = 2; // Escrivaninha de cartografia e mapas
                } else if (ry === 6 && rx === -3) {
                  role = "scroll_stand";
                  subType = 0; // Suporte de estudos da biblioteca
                }
              } else {
                // Casa de 4 cômodos (rx in [-6, -3], ry in [3, 5]):
                if (ry === 3 && (rx === -5 || rx === -4)) {
                  role = "bookshelf";
                  subType = rx === -5 ? 0 : 1;
                } else if (ry === 5 && rx === -5) {
                  role = "scroll_stand";
                  subType = 0;
                } else if (ry === 5 && rx === -3) {
                  role = "scroll_stand";
                  subType = 1;
                }
              }
            } else {
              roomName = "3º Cômodo da Casa (Cozinha e Despensa)";
              if (rx === -midRoomX && ry === midRoomYSouth) {
                role = "furniture";
                subType = 1; // Mesa Helênica / Bancada de preparo (sem fogueira natural)
              } else if (rx === -(midRoomX - 2) && ry === midRoomYSouth) {
                role = "furniture";
                subType = 2; // Bancos / Assentos
              } else if (rx === -(midRoomX + 1) && ry === midRoomYSouth - 1) {
                role = "vase";
              }
            }
          } else if (inSE) {
            roomName = isHall ? "Câmara Sudeste (Assembleia e Guarda)" : "4º Cômodo da Casa (Sala de Ofícios)";
            if (rx === midRoomX && ry === midRoomYSouth) {
              role = isUnfinished ? "unfinished_work" : isHall ? "chest" : "vase";
              subType = 1;
            } else if (rx === midRoomX - 2 && ry === midRoomYSouth) {
              role = "furniture";
              subType = 3; // Tribuna / Mesa de estudos
            } else if (rx === midRoomX + 1 && ry === midRoomYSouth - 1) {
              role = "statue";
              subType = isComplete ? 1 : 2;
            }
          } else if (isHall && Math.abs(rx) === 4 && ry === 0) {
            role = "column";
          }
        }
      }

      return {
        ruin: activeBld,
        city,
        rx,
        ry,
        role,
        roomName,
        subType,
        wallHeightState: isPreservedRoom ? 0 : (isComplete ? 0 : wallHeightState),
        doorVertical,
        isComplete,
        floorFailed: isPreservedRoom ? !1 : (isComplete ? !1 : (isFloorFailed || isUnfinished)),
      };
    }
    _getMountain25DBounds(t, l) {
      if (!this._mountainBoundsCache) {
        this._mountainBoundsCache = new Map();
      }
      const key = this._mk(t, l);
      const cachedBounds = this._mountainBoundsCache.get(key);
      if (cachedBounds) return cachedBounds;
      // Mede o tamanho horizontal e vertical do bioma a partir deste ponto (escaneia até a borda do bioma)
      const maxScan = 640;
      let minX = t,
        maxX = t,
        minY = l,
        maxY = l;
      while (t - minX < maxScan && this._isMountain25DBiomeAt(minX - 1, l)) minX--;
      while (maxX - t < maxScan && this._isMountain25DBiomeAt(maxX + 1, l)) maxX++;
      while (l - minY < maxScan && this._isMountain25DBiomeAt(t, minY - 1)) minY--;
      while (maxY - l < maxScan && this._isMountain25DBiomeAt(t, maxY + 1)) maxY++;

      // Refina o centro usando o meio da faixa horizontal e vertical para manter o 2º andar coeso
      const midX = Math.round((minX + maxX) * 0.5),
        midY = Math.round((minY + maxY) * 0.5);
      let cMinX = midX,
        cMaxX = midX,
        cMinY = midY,
        cMaxY = midY;
      while (midX - cMinX < maxScan && this._isMountain25DBiomeAt(cMinX - 1, midY)) cMinX--;
      while (cMaxX - midX < maxScan && this._isMountain25DBiomeAt(cMaxX + 1, midY)) cMaxX++;
      while (midY - cMinY < maxScan && this._isMountain25DBiomeAt(midX, cMinY - 1)) cMinY--;
      while (cMaxY - midY < maxScan && this._isMountain25DBiomeAt(midX, cMaxY + 1)) cMaxY++;

      const biomeWidth = Math.max(1, cMaxX - cMinX + 1),
        biomeHeight = Math.max(1, cMaxY - cMinY + 1),
        centerX = (cMinX + cMaxX) * 0.5,
        centerY = (cMinY + cMaxY) * 0.5;

      // Calcula os andares sucessivos dividindo o tamanho por 2 a cada andar (1º -> 2º -> 3º -> 4º...),
      // parando no topo quando o andar atingir o limite mínimo de 20 blocos!
      const floors = [];
      let curW = biomeWidth * 0.5,
        curH = biomeHeight * 0.5,
        floorNum = 2;
      while ((curW >= 20 || curH >= 20) && floorNum <= 12) {
        const w = Math.max(20, curW),
          h = Math.max(20, curH);
        floors.push({
          tier: floorNum,
          width: w,
          height: h,
          rx: w * 0.5,
          ry: h * 0.5,
        });
        if (curW <= 20 && curH <= 20) break;
        const nextW = curW * 0.5,
          nextH = curH * 0.5;
        if (nextW < 20 && nextH < 20) {
          // Se o andar atual ainda era maior que 20 blocos, cria o último andar do topo cravado no limite de 20 blocos
          if (w > 20 || h > 20) {
            floorNum++;
            floors.push({
              tier: floorNum,
              width: 20,
              height: 20,
              rx: 10,
              ry: 10,
            });
          }
          break;
        }
        curW = nextW;
        curH = nextH;
        floorNum++;
      }
      // Caso o bioma seja pequeno mas ainda comporte pelo menos um 2º andar de 20 blocos no topo:
      if (floors.length === 0 && biomeWidth >= 28 && biomeHeight >= 28) {
        floors.push({
          tier: 2,
          width: 20,
          height: 20,
          rx: 10,
          ry: 10,
        });
      }

      const info = {
        centerX,
        centerY,
        biomeWidth,
        biomeHeight,
        floors,
      };
      if (this._mountainBoundsCache.size > 100000) this._mountainBoundsCache.clear();
      this._mountainBoundsCache.set(key, info);
      return info;
    }
    // [PERF] Andar (tier) de um tile e fixo para uma seed: calcula uma vez e guarda.
    // Antes era recalculado ate ~2000x por tile por frame (ver _isBluePlantPeak).
    _getMountain25DInfo(t, l) {
      let cache = this._mtnInfoCache;
      if (!cache) cache = this._mtnInfoCache = new Map();
      const k = this._mk(t, l);
      const hit = cache.get(k);
      if (hit) return hit;
      const r = this._computeMountain25DInfo(t, l);
      if (cache.size > 300000) cache.clear();
      cache.set(k, r);
      return r;
    }
    _computeMountain25DInfo(t, l) {
      if (!this._isMountain25DBiomeAt(t, l)) {
        return { isMountain: !1, tier: 0, tierRaw: -1 };
      }
      // Cada andar divide o tamanho do andar anterior por 2 (1º -> 2º -> 3º -> 4º...) até o topo no limite de 20 blocos!
      const b = this._getMountain25DBounds(t, l);
      let distToOuterEdge = 99;
      for (let d = 1; d <= 5; d++) {
        if (
          !this._isMountain25DBiomeAt(t - d, l) ||
          !this._isMountain25DBiomeAt(t + d, l) ||
          !this._isMountain25DBiomeAt(t, l - d) ||
          !this._isMountain25DBiomeAt(t, l + d)
        ) {
          distToOuterEdge = d;
          break;
        }
      }
      let tier = 1;
      if (distToOuterEdge > 4 && b.floors && b.floors.length > 0) {
        const dx = t - b.centerX,
          dy = l - b.centerY;
        for (let i = 0; i < b.floors.length; i++) {
          const f = b.floors[i],
            nx = dx / Math.max(10, f.rx),
            ny = dy / Math.max(10, f.ry);
          if (nx * nx + ny * ny <= 1.0) {
            tier = f.tier;
          } else {
            break;
          }
        }
      }
      return { isMountain: !0, tier, tierRaw: tier };
    }
    getSurfaceTile(t, l) {
      const o = this._tk(t, l, !1),
        cached = this.tileCache.get(o);
      if (cached) return cached;
      // Escala continental ampliada (6x maior): garante que NENHUM bioma tenha menos de 2.000 blocos!
      const S_BIOME = 0.16;
      const m = this.detailNoise.noise2D(t * 0.00125 * S_BIOME, l * 0.00125 * S_BIOME) * 180,
        c = this.detailNoise.noise2D(t * 0.00125 * S_BIOME + 77, l * 0.00125 * S_BIOME + 77) * 180,
        f = t + m,
        g = l + c,
        y = this.elevNoise.fbm2D(f * 0.000275 * S_BIOME, g * 0.000275 * S_BIOME, 2, 2, 0.4),
        w = Math.hypot(t, l);

      // Vale Inicial de Floresta Temperada em torno da origem (raio de 80 blocos puros; depois uma transição larga
      // e IRREGULAR, ver _spawnBlendAt): garante que qualquer seed inicie na Floresta Temperada verdejante, com solo
      // plano e caminhável, sem cair em paredões rochosos ("montanhas de pedras") ou no deserto.
      const spawnBlend = this._spawnBlendAt(t, l, w);

      let T = Math.max(0, Math.min(1, y * (1 - spawnBlend) + 0.53 * spawnBlend)),
        S = !1,
        p = !1,
        j = !1;
      if (y < 0.24 && spawnBlend === 0) {
        const ue = this.islandNoise.fbm2D(
          t * 0.00055 * S_BIOME + 400,
          l * 0.00055 * S_BIOME + 400,
          2,
          2,
          0.45,
        );
        if (ue > 0.56) {
          S = !0;
          const N = (ue - 0.56) / 0.44;
          T = 0.32 + N * 0.56;
          const Ee = this.featureNoise.fbm2D(
            t * 0.000625 * S_BIOME + 200,
            l * 0.000625 * S_BIOME + 200,
            2,
            2,
            0.5,
          );
          Ee > 0.45 &&
            ((p = !0), (N > 0.4 || (Ee > 0.58 && T > 0.55)) && (j = !0));
        }
      }
      const P = this.tempNoise.fbm2D(f * 0.000225 * S_BIOME + 150, g * 0.000225 * S_BIOME + 150, 2, 2, 0.4) * (1 - spawnBlend) + 0.38 * spawnBlend,
        A = this.moistNoise.fbm2D(
          f * 0.0003 * S_BIOME + 280,
          g * 0.0003 * S_BIOME + 280,
          2,
          2,
          0.4,
        ) * (1 - spawnBlend) + 0.45 * spawnBlend,
        x = this.featureNoise.fbm2D(
          t * 0.00075 * S_BIOME + 320,
          l * 0.00075 * S_BIOME + 320,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        M = this.featureNoise.fbm2D(
          t * 0.0007 * S_BIOME + 560,
          l * 0.0007 * S_BIOME + 560,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        $ = this.canyonNoise.fbm2D(
          t * 0.0007 * S_BIOME + 780,
          l * 0.0007 * S_BIOME + 780,
          2,
          2,
          0.5,
        ) * (1 - spawnBlend),
        z =
          w < 40
            ? 0
            : this.lakeNoise.fbm2D(
                f * 0.00195 * S_BIOME + 920,
                g * 0.00195 * S_BIOME + 920,
                2,
                2,
                0.45,
              ) * (1 - spawnBlend);
      const isSnowCityArea = typeof window !== "undefined" && window.SnowPeakCity && (window.SnowPeakCity.isCityBiomeArea ? window.SnowPeakCity.isCityBiomeArea(t, l) : window.SnowPeakCity.isCityTerritory(t, l));
      const isDesertCityArea = typeof window !== "undefined" && window.DesertCity && (window.DesertCity.isCityBiomeArea ? window.DesertCity.isCityBiomeArea(t, l) : window.DesertCity.isCityTerritory(t, l));
      const isPortCityArea = typeof window !== "undefined" && window.PortCity && (window.PortCity.isCityBiomeArea ? window.PortCity.isCityBiomeArea(t, l) : window.PortCity.isCityTerritory(t, l));
      let K;
      if (isSnowCityArea) {
        K = BIOMES.SNOW_PEAK;
      } else if (isDesertCityArea) {
        K = BIOMES.DESERT;
      } else if (isPortCityArea) {
        K =
          (window.PortCity.getBiomeForTile && window.PortCity.getBiomeForTile(t, l)) ||
          (window.PortCity.isCityWaterArea && window.PortCity.isCityWaterArea(t, l)
            ? BIOMES.COAST_WATER
            : BIOMES.BEACH);
      } else {
        K = Jp(T, A, P, {
          isIsland: S,
          isVolcano: p,
          volcanoCore: j,
          swampVal: x,
          oasisVal: M,
          canyonVal: $,
          lakeVal: z,
        });
      }
      const V = this.hash2D(t, l, 7),
        O = `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`;
      let _ = null;
      if (this.customPlacedProps.has(O)) {
        _ = { ...this.customPlacedProps.get(O) };
        const ue =
          this.interactedProps.get(O) || this.interactedProps.get(`${t},${l}`);
        ((ue == null ? void 0 : ue.lit) !== void 0 &&
          ((_.lit = ue.lit),
          _.lit
            ? ((_.namePt = "Fogueira Crepitante"),
              (_.descriptionPt =
                "Uma fogueira aquecida e crepitante. Pressione [F] para descansar e restaurar vigor."))
            : ((_.namePt = "Fogueira de Acampamento (Apagada)"),
              (_.descriptionPt =
                "Uma fogueira montada com 10 galhos secos. Pressione [F] tendo 2 Pederneiras para acendê-la com faíscas!"))),
          ue != null && ue.roastingFish && (_.roastingFish = ue.roastingFish),
          ue != null && ue.cookingPot && (_.cookingPot = ue.cookingPot));
      } else if (
        ((_ = this.generateProp(t, l, K, V, T)), _ && _.kind === "campfire")
      ) {
        const ue =
          this.interactedProps.get(O) || this.interactedProps.get(`${t},${l}`);
        (ue != null && ue.roastingFish && (_.roastingFish = ue.roastingFish),
          ue != null && ue.cookingPot && (_.cookingPot = ue.cookingPot));
      }
      const se = {
        tx: t,
        ty: l,
        elevation: T,
        moisture: A,
        temperature: P,
        biome: K,
        prop: _,
        detailHash: V,
      };
      if (K.id === BiomeId.MOUNTAIN_25D && !isSnowCityArea) {
        // 1º Andar (tier = 1): O bioma inteiro cercado pelo paredão externo (4 tiles de espessura).
        // 2º Andar (tier = 2): Criado em cima do bioma com metade do tamanho do bioma (tamanho / 2),
        // cercado pelo seu próprio paredão 4x maior!
        const info = this._getMountain25DInfo(t, l),
          myTier = info.tier;
        let isCliffBorder = !1;
        let isOuterFace = !1;
        let minNeighborTier = myTier;
        for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            if (dx === 0 && dy === 0) continue;
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            if (dist <= 4) {
              const nTier = this._getMountain25DInfo(t + dx, l + dy).tier;
              if (nTier < myTier) {
                isCliffBorder = !0;
                if (dist === 1) {
                  isOuterFace = !0;
                  if (nTier < minNeighborTier) minNeighborTier = nTier;
                }
              }
            }
          }
        }
        const isWall = isCliffBorder;

        se.mountainTier = myTier;
        se.lowerTier = isOuterFace ? minNeighborTier : myTier;
        se.isElevatedBiome = !0;
        se.isPerimeterCliff = myTier === 1 && isCliffBorder;
        se.isSecondFloorCliff = myTier === 2 && isCliffBorder;
        se.isOuterCliffEdge = isOuterFace;
        se.isCliffWall = isWall;
        se.isCliffRamp = !1;
        if (se.isCliffWall) {
          const canKeepSpecial =
            _ &&
            (_.kind === "cave_entrance" ||
              _.kind === "shrine" ||
              _.kind === "campfire" ||
              _.kind === "clay_oven" ||
              _.kind === "drying_clay");
          if (canKeepSpecial) {
            se.isCliffWall = !1;
          } else {
            se.prop = {
              kind: "cliff_wall",
              subType: myTier,
              offsetX: 0,
              offsetY: 0,
              scale: 1,
              namePt: `Muralha do ${myTier}º Andar do Platô`,
              descriptionPt:
                myTier === 1
                  ? "Paredão monumental 4x maior que cerca e eleva o 1º andar do bioma de Montanhas 2.5D."
                  : `Paredão do ${myTier}º andar erguido com metade do tamanho do ${myTier - 1}º andar (limite de 10 blocos no topo).`,
            };
          }
        }
        // A planta azul ocupa o centro do último platô, o ponto mais alto da montanha.
        // Ela permanece como ramo durante o dia e abre visualmente somente à noite.
        this._syncBluePlantProp(t, l, se);
      }
      const greekRuin = (K.id === BiomeId.MEADOW) ? this._getGreekRuinCellAt(t, l) : null;
      if (greekRuin) {
        se.isGreekRuin = !0;
        se.greekRuinRole = greekRuin.role;
        se.greekRuinRx = greekRuin.rx;
        se.greekRuinRy = greekRuin.ry;
        se.greekRoomName = greekRuin.roomName;
        se.greekFloorFailed = !!greekRuin.floorFailed;
        const canKeepCustom =
          this.customPlacedProps.has(O) || (_ && _.kind === "cave_entrance");
        if (!canKeepCustom) {
          const intState =
            this.interactedProps.get(O) || this.interactedProps.get(`${t},${l}`) || {};
          if (greekRuin.role === "wall" || greekRuin.role === "rubble_wall") {
            const wHeight =
              greekRuin.isComplete
                ? 0
                : greekRuin.role === "rubble_wall"
                  ? 3
                  : (greekRuin.wallHeightState ?? (Math.abs(t + l * 3) % 4));
            // Paredes com wHeight === 3 são tocos de parede desmoronada/inacabada baixos
            se.isGreekWall = wHeight <= 2;
            se.prop = {
              kind: "greek_wall",
              subType: greekRuin.isComplete ? 0 : (Math.abs(t + l * 3) % 3),
              wallHeightState: wHeight,
              offsetX: 0,
              offsetY: 0,
              scale: 1,
              namePt:
                wHeight === 0
                  ? "Muralha de Mármore Helênico Completa"
                  : wHeight === 1
                    ? "Parede Grega com Topo Irregular Quebrado"
                    : wHeight === 2
                      ? "Parede Grega Semi-Desmoronada (Meia Altura)"
                      : "Base de Parede em Ruínas / Inacabada",
              descriptionPt:
                "Cantaria clássica de mármore com topo irregular desgastado pelos séculos, lascas de pedra e hera mediterrânea.",
            };
          } else if (greekRuin.role === "door") {
            const isOpen = intState.opened !== void 0 ? !!intState.opened : !1;
            se.isGreekDoor = !0;
            se.isGreekDoorOpen = isOpen;
            se.prop = {
              kind: "greek_door",
              subType: greekRuin.doorVertical ? 1 : 0,
              opened: isOpen,
              offsetX: 0,
              offsetY: 0,
              scale: 1,
              interactive: !0,
              namePt: isOpen
                ? `Porta Helênica Aberta (${greekRuin.roomName})`
                : `Porta de Madeira e Bronze (${greekRuin.roomName})`,
              descriptionPt: isOpen
                ? "Portal de mármore com batentes de cedro e cravos de bronze aberto. Pressione [F] para fechar."
                : "Antiga porta grega de madeira de cedro reforçada com bronze sob lintel de mármore. Pressione [F] para abrir ou fechar!",
            };
          } else if (greekRuin.role === "statue") {
            const stType = greekRuin.subType ?? (Math.abs(t + l) % 3);
            const stNames = [
              "Estátua Monumental de Atena Parthenos",
              "Estátua de Filósofo e Orador da Pólis",
              "Kouros de Mármore em Ruínas (Escultura Inacabada)",
            ];
            se.prop = {
              kind: "greek_statue",
              subType: stType,
              offsetX: 0,
              offsetY: -4,
              scale: 1.2,
              interactive: !0,
              namePt: stNames[stType % stNames.length],
              descriptionPt:
                "Escultura clássica de mármore pario sobre pedestal com inscrições em grego antigo. Pressione [F] para contemplar!",
            };
          } else if (greekRuin.role === "vase" || greekRuin.role === "amphora_cluster") {
            const isCol = !!intState.collected;
            if (isCol) {
              se.prop = null;
            } else {
              const vType = greekRuin.subType ?? (Math.abs(t * 3 + l) % 3);
              const vNames = [
                "Ânfora Grega Antiga",
                "Cratera de Cerâmica das Ruínas",
                "Pote de Terracota das Ruínas",
              ];
              se.prop = {
                kind: "greek_vase",
                subType: vType,
                offsetX: 0,
                offsetY: 0,
                scale: 1.08,
                interactive: !0,
                namePt: vNames[vType % vNames.length],
                descriptionPt:
                  "Jarro e pote de cerâmica clássica preservado nas ruínas. Pressione [F] para coletar para seu inventário!",
              };
            }
          } else if (greekRuin.role === "bookshelf") {
            const booksTaken = typeof intState.booksTaken === "number" ? intState.booksTaken : (intState.collected ? 4 : 0);
            const maxBooks = 4;
            const isCol = booksTaken >= maxBooks || !!intState.collected;
            const bNames = [
              "Estante de Culinária e Filosofia",
              "Estante de Construção e Metalurgia",
              "Estante de Geografia, Biomas e Criaturas",
              "Estante de Manuscritos e Mistérios Arcanos",
            ];
            const bType = greekRuin.subType ?? (Math.abs(t * 3 + l) % 4);
            const remaining = Math.max(0, maxBooks - booksTaken);
            se.prop = {
              kind: "greek_bookshelf",
              subType: bType,
              offsetX: 0,
              offsetY: -3,
              scale: 1.15,
              interactive: !0,
              collected: isCol,
              booksTaken: booksTaken,
              maxBooks: maxBooks,
              namePt: isCol ? `${bNames[bType % bNames.length]} (Vasculhada)` : `${bNames[bType % bNames.length]} (${remaining} livro${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""})`,
              descriptionPt: isCol
                ? "Todos os livros desta estante já foram recolhidos para o seu inventário."
                : `Estante nobre de madeira entalhada repleta de tomos antigos (${remaining} disponível${remaining > 1 ? "is" : ""}). Pressione [F] para retirar 1 livro!`,
            };
          } else if (greekRuin.role === "scroll_stand") {
            const scrollsTaken = typeof intState.scrollsTaken === "number" ? intState.scrollsTaken : (intState.collected ? 2 : 0);
            const maxScrolls = 2;
            const isCol = scrollsTaken >= maxScrolls || !!intState.collected;
            const sNames = [
              "Mesa de Estudos e Ferramentas Primitivas",
              "Suporte de Papiro Sagrado e Geometria Rúnica",
              "Escrivaninha de Cartografia e Forja Ancestral",
            ];
            const sType = greekRuin.subType ?? (Math.abs(t * 5 + l) % 3);
            const remaining = Math.max(0, maxScrolls - scrollsTaken);
            se.prop = {
              kind: "greek_scroll_stand",
              subType: sType,
              offsetX: 0,
              offsetY: -2,
              scale: 1.12,
              interactive: !0,
              collected: isCol,
              scrollsTaken: scrollsTaken,
              maxScrolls: maxScrolls,
              namePt: isCol ? `${sNames[sType % sNames.length]} (Vasculhado)` : `${sNames[sType % sNames.length]} (${remaining} pergaminho${remaining > 1 ? "s" : ""})`,
              descriptionPt: isCol
                ? "Os pergaminhos deste suporte de estudos já foram recolhidos para o seu inventário."
                : `Rolos autênticos de papiro e pergaminhos antigos com inscrições (${remaining} disponível${remaining > 1 ? "is" : ""}). Pressione [F] para recolher 1 pergaminho!`,
            };
          } else if (greekRuin.role === "furniture") {
            const fType = greekRuin.subType ?? (Math.abs(t + l * 7) % 4);
            const fNames = [
              "Kline (Divã Grego de Banquete com Almofadas)",
              "Trapeza (Mesa Helênica com Taças Kylix)",
              "Bancada / Cadeira Klismos de Mármore",
              "Bema (Tribuna do Orador com Pergaminhos)",
            ];
            se.prop = {
              kind: "greek_furniture",
              subType: fType,
              offsetX: 0,
              offsetY: 0,
              scale: 1.1,
              interactive: !0,
              namePt: fNames[fType % fNames.length],
              descriptionPt:
                `Mobiliário autêntico da Grécia Antiga situado em: ${greekRuin.roomName}. Pressione [F] para examinar.`,
            };
          } else if (greekRuin.role === "unfinished_work") {
            const uType = greekRuin.subType ?? (Math.abs(t + l) % 2);
            se.prop = {
              kind: "greek_unfinished",
              subType: uType,
              offsetX: 0,
              offsetY: -2,
              scale: 1.15,
              interactive: !0,
              namePt:
                uType === 0
                  ? "Guindaste Helênico (Polyspastos) e Andaime Inacabado"
                  : "Blocos de Mármore Bruto e Tambores de Coluna Inacabados",
              descriptionPt:
                "Canteiro de obras da Grécia Antiga deixado pela metade pelos canteiros e escultores. Pressione [F] para inspecionar as ferramentas e blocos.",
            };
          } else if (greekRuin.role === "column") {
            se.prop = {
              kind: "ruin_pillar",
              subType: greekRuin.isComplete ? 0 : (Math.abs(t * 5 + l) % 2),
              offsetX: 0,
              offsetY: -4,
              scale: 1.15,
              interactive: !0,
              namePt: "Coluna Dórica de Mármore",
              descriptionPt:
                "Coluna grega canelada de mármore branco com capitel dórico esculpido. Pressione [F] para examinar.",
            };
          } else if (greekRuin.role === "altar") {
            se.prop = {
              kind: "shrine",
              subType: 0,
              offsetX: 0,
              offsetY: -4,
              scale: 1.25,
              interactive: !0,
              namePt: "Altar Sagrado do Naos (Templo Grego)",
              descriptionPt:
                intState.activated
                  ? "A chama divina de Atena brilha sobre o mármore sagrado do Naos!"
                  : "Altar central na Cella do Templo Grego, diante da estátua divina. Pressione [F] para receber a bênção do Olimpo!",
            };
          } else if (greekRuin.role === "chest") {
            const opened = !!intState.opened;
            se.prop = {
              kind: "chest",
              subType: 0,
              offsetX: 0,
              offsetY: 0,
              scale: 1.05,
              interactive: !opened,
              opened: opened,
              namePt: opened
                ? "Kibotos / Arca Helênica (Saqueada)"
                : "Kibotos (Arca de Tesouro Helênico)",
              descriptionPt: opened
                ? "Os tesouros desta câmara grega já foram recolhidos."
                : `Arca ornamentada guardada em: ${greekRuin.roomName}. Pressione [F] para abrir!`,
            };
          } else {
            // Corredores, rua da Ágora, pátio da casa e pisos internos ficam limpos de árvores/pedras selvagens
            se.prop = null;
          }
        }
      }
      if (typeof window !== "undefined" && window.SnowPeakCity && (window.SnowPeakCity.isCityBiomeArea ? window.SnowPeakCity.isCityBiomeArea(t, l) : window.SnowPeakCity.isCityTerritory(t, l))) {
        se.biome = BIOMES.SNOW_PEAK;
        se.isElevatedBiome = !1;
        se.isPerimeterCliff = !1;
        se.isSecondFloorCliff = !1;
        se.isOuterCliffEdge = !1;
        se.isCliffWall = !1;
        se.isCliffRamp = !1;
        se.mountainTier = 0;
        if (window.SnowPeakCity.isCityTerritory(t, l)) {
          const scCell = window.SnowPeakCity.getCellAt(t, l, this.interactedProps);
          if (scCell) {
            se.isSnowCity = !0;
            se.snowCityRole = scCell.role;
            se.snowCityRoom = scCell.roomName;
            se.snowCityHouseIndex = scCell.houseIndex;
            se.snowCityOpenConcept = !!scCell.openConcept;
            if (scCell.isWall) se.isSnowCityWall = !0;
            if (scCell.isCollider) se.isSnowCityCollider = !0;
            if (scCell.isDoor) {
              se.isSnowCityDoor = !0;
              se.isSnowCityDoorOpen = !!scCell.isDoorOpen;
              if (scCell.prop && scCell.prop.kind === "iron_bars_gate") {
                se.isIronBars = !0;
                se.isIronBarsOpen = !!scCell.isDoorOpen;
              }
            }
            if (!this.customPlacedProps.has(O)) {
              if (scCell.prop) {
                se.prop = scCell.prop;
              } else {
                se.prop = null;
              }
            }
          }
        }
      }
      if (typeof window !== "undefined" && window.DesertCity && (window.DesertCity.isCityBiomeArea ? window.DesertCity.isCityBiomeArea(t, l) : window.DesertCity.isCityTerritory(t, l))) {
        se.biome = BIOMES.DESERT;
        se.isElevatedBiome = !1;
        se.isPerimeterCliff = !1;
        se.isSecondFloorCliff = !1;
        se.isOuterCliffEdge = !1;
        se.isCliffWall = !1;
        se.isCliffRamp = !1;
        se.mountainTier = 0;
        if (window.DesertCity.isCityTerritory(t, l)) {
          const dcCell = window.DesertCity.getCellAt(t, l, this.interactedProps);
          if (dcCell) {
            se.isDesertCity = !0;
            se.desertCityRole = dcCell.role;
            se.desertCityRoom = dcCell.roomName;
            se.desertCityHouseIndex = dcCell.houseIndex;
            if (dcCell.isWall) se.isDesertCityWall = !0;
            if (dcCell.isCollider) se.isDesertCityCollider = !0;
            if (dcCell.isDoor) {
              se.isDesertCityDoor = !0;
              se.isDesertCityDoorOpen = !!dcCell.isDoorOpen;
            }
            if (!this.customPlacedProps.has(O)) {
              if (dcCell.prop) {
                se.prop = dcCell.prop;
              } else {
                se.prop = null;
              }
            }
          }
        }
      }
      if (typeof window !== "undefined" && window.PortCity && (window.PortCity.isCityBiomeArea ? window.PortCity.isCityBiomeArea(t, l) : window.PortCity.isCityTerritory(t, l))) {
        se.biome =
          (window.PortCity.getBiomeForTile && window.PortCity.getBiomeForTile(t, l)) ||
          (window.PortCity.isCityWaterArea && window.PortCity.isCityWaterArea(t, l)
            ? BIOMES.COAST_WATER
            : BIOMES.BEACH);
        se.isElevatedBiome = !1;
        se.isPerimeterCliff = !1;
        se.isSecondFloorCliff = !1;
        se.isOuterCliffEdge = !1;
        se.isCliffWall = !1;
        se.isCliffRamp = !1;
        se.mountainTier = 0;
        if (window.PortCity.isCityTerritory(t, l)) {
          const pcCell = window.PortCity.getCellAt(t, l, this.interactedProps);
          if (pcCell) {
            se.isPortCity = !0;
            se.portCityRole = pcCell.role;
            se.portCityRoom = pcCell.roomName;
            se.portCityHouseIndex = pcCell.houseIndex;
            se.portCityRoofTheme = pcCell.roofTheme;
            if (pcCell.isPortPier || pcCell.isPier || pcCell.isPortBoat || pcCell.isBoatDeck) se.isPortPier = !0;
            if (pcCell.isPortBoat || pcCell.isBoatDeck) se.isPortBoatDeck = !0;
            if (pcCell.isWall) se.isPortCityWall = !0;
            if (pcCell.isCollider) se.isPortCityCollider = !0;
            if (pcCell.isDoor) {
              se.isPortCityDoor = !0;
              se.isPortCityDoorOpen = !!pcCell.isDoorOpen;
            }
            if (!this.customPlacedProps.has(O)) {
              if (pcCell.prop) {
                se.prop = pcCell.prop;
              } else {
                se.prop = null;
              }
            }
          }
        }
      }
      return (this.tileCache.set(o, se), se);
    }
    getDungeonEntranceStairForBiome(t, l) {
      const city = this._getMeadowCityDistrict(t, l);
      if (!city) return null;
      if (!this._dungeonStairCache) this._dungeonStairCache = new Map();
      const key = `city_${city.cx},${city.cy}`;
      if (this._dungeonStairCache.has(key)) {
        return this._dungeonStairCache.get(key);
      }
      const bx = Math.floor(city.cx / 32);
      const by = Math.floor(city.cy / 32);
      const candidates = [
        { lx: 25, ly: 11 },
        { lx: 26, ly: 10 },
        { lx: 24, ly: 12 },
        { lx: 20, ly: 11 },
        { lx: 18, ly: 10 },
        { lx: 25, ly: 24 },
        { lx: 20, ly: 25 },
        { lx: 10, ly: 10 },
        { lx: 14, ly: 10 },
        { lx: 10, ly: 24 }
      ];
      let chosen = null;
      for (const cand of candidates) {
        const tx = bx * 32 + cand.lx;
        const ty = by * 32 + cand.ly;
        const cell = this._getUndergroundGreekSanctuaryCellAt(tx, ty);
        if (cell && (cell.role === "temple_floor" || cell.role === "house_floor" || cell.role === "mosaic_center")) {
          const caveEnt = this.getCaveEntranceAt(tx, ty);
          if (!caveEnt) {
            chosen = { tx, ty, bx, by, lx: cand.lx, ly: cand.ly, city };
            break;
          }
        }
      }
      if (!chosen) {
        chosen = { tx: bx * 32 + 25, ty: by * 32 + 11, bx, by, lx: 25, ly: 11, city };
      }
      this._dungeonStairCache.set(key, chosen);
      return chosen;
    }
    isDungeonEntranceStairAt(t, l) {
      const surfB = this._computeSurfaceBaseBiome(t, l);
      if (!surfB || (surfB.id !== BiomeId.MEADOW && surfB.id !== BiomeId.MEADOW_LAKE)) return null;
      const stair = this.getDungeonEntranceStairForBiome(t, l);
      if (stair && stair.tx === t && stair.ty === l) {
        return stair;
      }
      return null;
    }
    _getUndergroundGreekSanctuaryCellAt(t, l) {
      // Verifica se este ponto subterrâneo está ESTRITAMENTE abaixo do bioma que tem Ruínas Gregas (MEADOW).
      // Cavernas abaixo de quaisquer outros biomas continuam sendo cavernas naturais normais!
      const surfB = this._computeSurfaceBaseBiome(t, l);
      const isUnderMeadow = !!(
        surfB &&
        (surfB.id === BiomeId.MEADOW || surfB.id === BiomeId.MEADOW_LAKE)
      );
      if (!isUnderMeadow) return null;

      // Se a borda do bioma MEADOW estiver a 1 bloco de distância de outro bioma,
      // fecha com parede intacta de mármore para isolar a estrutura das cavernas normais (sem portas soltas em corredores)!
      const isMeadowAt = (nx, ny) => {
        const nb = this._computeSurfaceBaseBiome(nx, ny);
        return !!(nb && (nb.id === BiomeId.MEADOW || nb.id === BiomeId.MEADOW_LAKE));
      };
      const borderN = !isMeadowAt(t, l - 1),
        borderS = !isMeadowAt(t, l + 1),
        borderW = !isMeadowAt(t - 1, l),
        borderE = !isMeadowAt(t + 1, l);
      if (borderN || borderS || borderW || borderE) {
        return {
          role: "wall",
          rx: 0,
          ry: 0,
          roomName: "Muralha Externa do Palácio Subterrâneo",
          subType: 0,
        };
      }

      // Se este tile for uma Escadaria de Saída (ou imediatamente ao lado dela, dist <= 1),
      // garante piso de mosaico real aberto para nunca prender o jogador ao descer/subir!
      const nearExit = this.getNearbyCaveExit(t, l, 1.5);
      if (nearExit) {
        return {
          role: "mosaic_center",
          rx: Math.round(-nearExit.dx),
          ry: Math.round(-nearExit.dy),
          roomName: "Pátio da Escadaria Subterrânea",
          subType: 0,
        };
      }

      // Se este tile for a Escadaria do Calabouço (ou imediatamente ao lado dela, dist <= 1),
      // garante piso de mosaico aberto no salão para nunca bloquear a escadaria!
      const city = this._getMeadowCityDistrict(t, l);
      if (city) {
        const dStairKey = `city_${city.cx},${city.cy}`;
        const dStair = this._dungeonStairCache ? this._dungeonStairCache.get(dStairKey) : null;
        if (dStair && Math.abs(t - dStair.tx) <= 1 && Math.abs(l - dStair.ty) <= 1) {
          return {
            role: "mosaic_center",
            rx: t - dStair.tx,
            ry: l - dStair.ty,
            roomName: "Pátio da Escadaria do Calabouço",
            subType: 0,
          };
        }
      }

      // =========================================================================
      // ARQUITETURA SUBTERRÂNEA HELÊNICA (100% Intacta — Sem Rochedos Naturais!):
      // 1. REDE DE CORREDORES PRINCIPAIS CONTÍNUOS (Avenidas Subterrâneas de 3 blocos
      //    de largura totalmente livres — ZERO portas no meio dos corredores!).
      // 2. ALAS DE SALÕES CONECTADOS (1, 2 ou até 3 Salões de tamanhos variados):
      //    - Portas existem EXCLUSIVAMENTE para entrar nos Salões:
      //      * Do Corredor Principal para o SALÃO 1 (Salão de Entrada).
      //      * Do SALÃO 1 para o SALÃO 2 (Porta Interna).
      //      * Do SALÃO 2 para o SALÃO 3 (Porta Interna).
      //    - O SALÃO 2 e o SALÃO 3 NÃO têm porta para o corredor!
      // =========================================================================
      const blockSize = 32;
      const bx = Math.floor(t / blockSize),
        by = Math.floor(l / blockSize),
        lx = ((t % blockSize) + blockSize) % blockSize, // 0..31
        ly = ((l % blockSize) + blockSize) % blockSize; // 0..31

      const blockHash = this.hash2D(bx, by, 701),
        wingHashA = this.hash2D(bx, by, 719),
        wingHashB = this.hash2D(bx, by, 733),
        decorHash = this.hash2D(t, l, 709);

      // -------------------------------------------------------------------------
      // A. CORREDORES PRINCIPAIS CONTÍNUOS (lx in 0..4 e ly in 0..4):
      //    - Piso do corredor contínuo: lx in 1..3 ou ly in 1..3 (100% livre, sem portas no meio!)
      //    - Paredes laterais do corredor: lx === 0, lx === 4, ly === 0, ly === 4
      //    - Nas paredes laterais do corredor ficam APENAS as portas que entram no SALÃO 1!
      // -------------------------------------------------------------------------
      const inHorizAvenue = ly >= 1 && ly <= 3;
      const inVertAvenue = lx >= 1 && lx <= 3;

      if (inHorizAvenue || inVertAvenue) {
        // Cruzamento das duas avenidas de corredores (lx in 1..3, ly in 1..3)
        if (inHorizAvenue && inVertAvenue) {
          return {
            role: lx === 2 && ly === 2 ? "mosaic_center" : "corridor",
            rx: lx - 2,
            ry: ly - 2,
            roomName: "Encruzilhada do Grande Corredor Subterrâneo",
            subType: 0,
          };
        }
        // Pontos de Tochas nas laterais dos Corredores Subterrâneos (a cada 8 blocos nas bordas do corredor,
        // deixando o caminho central lx === 2 e ly === 2 100% livre e sem bloquear as portas em lx === 10 e ly === 22!):
        const isHorizTorchSpot =
          inHorizAvenue &&
          (ly === 1 || ly === 3) &&
          (lx === 6 || lx === 14 || lx === 21 || lx === 28);
        const isVertTorchSpot =
          inVertAvenue &&
          (lx === 1 || lx === 3) &&
          (ly === 6 || ly === 14 || ly === 20 || ly === 28);
        if (isHorizTorchSpot || isVertTorchSpot) {
          return {
            role: "corridor_torch",
            rx: inVertAvenue ? lx - 2 : 0,
            ry: inHorizAvenue ? ly - 2 : 0,
            roomName: "Grande Corredor Subterrâneo",
            subType: isHorizTorchSpot ? (ly === 1 ? 0 : 1) : lx === 1 ? 2 : 3,
          };
        }
        return {
          role: "corridor",
          rx: inVertAvenue ? lx - 2 : 0,
          ry: inHorizAvenue ? ly - 2 : 0,
          roomName: "Grande Corredor Subterrâneo",
          subType: 0,
        };
      }

      // Paredes que ladeiam os Corredores Principais (lx === 0, lx === 4, ly === 0, ly === 4)
      const isCorridorWall = lx === 0 || lx === 4 || ly === 0 || ly === 4;
      if (isCorridorWall) {
        // Porta ÚNICA do Corredor Norte (ly === 4) para o SALÃO 1 da Ala A (em lx === 10, ly === 4)
        if (ly === 4 && lx === 10) {
          return {
            role: "door",
            rx: 0,
            ry: 0,
            roomName: "Porta do Salão de Entrada (Conectado ao Corredor)",
            subType: 0,
            doorVertical: !1,
          };
        }
        // Porta ÚNICA do Corredor Oeste (lx === 4) para o SALÃO 1 da Ala B (em lx === 4, ly === 22)
        if (lx === 4 && ly === 22) {
          return {
            role: "door",
            rx: 0,
            ry: 0,
            roomName: "Porta do Salão de Entrada (Conectado ao Corredor)",
            subType: 1,
            doorVertical: !0,
          };
        }
        return {
          role: "wall",
          rx: lx,
          ry: ly,
          roomName: "Muralha do Grande Corredor Subterrâneo",
          subType: 0,
        };
      }

      // -------------------------------------------------------------------------
      // B. INTERIOR DO QUADRANTE (lx in 5..31, ly in 5..31 -> área 27x27):
      //    Dividido por uma parede mestra horizontal em ly === 17 em DUAS ALAS INDEPENDENTES:
      //    - ALA NORTE (ly in 5..17, lx in 5..31):
      //      Pode ter 1 Salão grandioso, 2 Salões conectados em série, ou 3 Salões conectados em série!
      //      * Apenas o SALÃO 1 tem porta para o Corredor Principal (em lx === 10, ly === 4).
      //      * O SALÃO 2 só é acessível por uma porta interna a partir do SALÃO 1!
      //      * O SALÃO 3 só é acessível por uma porta interna a partir do SALÃO 2!
      //    - ALA SUL (ly in 17..31, lx in 5..31):
      //      Pode ter 1, 2 ou 3 Salões de tamanhos diferentes conectados em série!
      //      * Apenas o SALÃO 1 da Ala Sul tem porta para o Corredor Principal (em lx === 4, ly === 22).
      //      * O SALÃO 2 e o SALÃO 3 da Ala Sul conectam-se apenas entre si (Salão 1 -> Salão 2 -> Salão 3),
      //        sem nenhuma porta para o corredor!
      // -------------------------------------------------------------------------

      // Parede mestra separando a Ala Norte da Ala Sul em ly === 17
      if (ly === 17) {
        return {
          role: "wall",
          rx: lx - 18,
          ry: 0,
          roomName: "Muralha Divisória dos Salões",
          subType: 0,
        };
      }

      const isNorthWing = ly < 17;
      const wHash = isNorthWing ? wingHashA : wingHashB;
      // Quantidade de salões conectados em cadeia nesta ala: 1, 2 ou 3 salões!
      // (Prioriza cadeias de 2 e 3 salões conectados um no outro, além de grandes salões únicos)
      const numHallsInChain = wHash < 0.18 ? 1 : wHash < 0.55 ? 2 : 3;

      // Coordenadas verticais da Ala atual:
      // Ala Norte: y de 5 a 16 (altura interna = 12 blocos)
      // Ala Sul:   y de 18 a 31 (altura interna = 14 blocos)
      const wingYMin = isNorthWing ? 5 : 18;
      const wingYMax = isNorthWing ? 16 : 31;
      const wingMidY = Math.floor((wingYMin + wingYMax) / 2);

      // Define as paredes divisórias entre os salões da cadeia (xSplit1 entre Salão 1 e Salão 2; xSplit2 entre Salão 2 e Salão 3)
      // variando os tamanhos para criar Salões Grandes, Médios e Câmaras Menores!
      let xSplit1 = 32,
        xSplit2 = 32;
      if (numHallsInChain === 2) {
        // 2 Salões conectados: Salão 1 (ligado ao corredor) -> Porta Interna -> Salão 2 (exclusivo, sem porta pro corredor!)
        xSplit1 = wHash < 0.36 ? 16 : 20; // Salão 1 médio/grande + Salão 2 grande/médio
      } else if (numHallsInChain === 3) {
        // 3 Salões conectados em série:
        // Salão 1 (ligado ao corredor) -> Porta Interna -> Salão 2 (intermediário) -> Porta Interna -> Salão 3 (profundo)
        // Nem o Salão 2 nem o Salão 3 têm conexão direta com o corredor!
        xSplit1 = wHash < 0.78 ? 13 : 15;
        xSplit2 = wHash < 0.78 ? 22 : 24;
      }

      // Verifica se este tile (lx, ly) está em uma Parede Divisória entre Salão 1 e Salão 2 (xSplit1)
      // ou entre Salão 2 e Salão 3 (xSplit2):
      if (lx === xSplit1 || lx === xSplit2) {
        const isFirstConnection = lx === xSplit1;
        // Porta interna que conecta um salão diretamente no outro!
        const doorY = isFirstConnection ? wingMidY : wingMidY + (blockHash > 0.5 ? 1 : -1);
        if (ly === doorY) {
          return {
            role: "door",
            rx: 0,
            ry: 0,
            roomName: isFirstConnection
              ? "Porta Interna: Salão 1 → Salão 2 (Sem saída para o Corredor)"
              : "Porta Interna: Salão 2 → Salão 3 (Câmara Profunda)",
            subType: 1,
            doorVertical: !0,
          };
        }
        return {
          role: "wall",
          rx: 0,
          ry: ly - wingMidY,
          roomName: "Muralha entre Salões Conectados",
          subType: 0,
        };
      }

      // Identifica em qual dos 3 salões da cadeia estamos (hallIndex: 1, 2 ou 3) e seus limites exatos [hXMin..hXMax]:
      let hallIndex = 1,
        hXMin = 5,
        hXMax = 31;
      if (numHallsInChain === 2) {
        if (lx < xSplit1) {
          hallIndex = 1;
          hXMin = 5;
          hXMax = xSplit1 - 1;
        } else {
          hallIndex = 2;
          hXMin = xSplit1 + 1;
          hXMax = 31;
        }
      } else if (numHallsInChain === 3) {
        if (lx < xSplit1) {
          hallIndex = 1;
          hXMin = 5;
          hXMax = xSplit1 - 1;
        } else if (lx < xSplit2) {
          hallIndex = 2;
          hXMin = xSplit1 + 1;
          hXMax = xSplit2 - 1;
        } else {
          hallIndex = 3;
          hXMin = xSplit2 + 1;
          hXMax = 31;
        }
      }

      // Para dar tamanhos variados também na altura (além da largura), alguns Salões 2 ou 3 são mais estreitos
      // verticalmente, com paredes duplas internas de mármore:
      let hYMin = wingYMin,
        hYMax = wingYMax;
      if (hallIndex === 3 && numHallsInChain === 3 && wHash > 0.82) {
        // Câmara 3 mais compacta verticalmente (mas mantendo a porta em doorY acessível)
        hYMin = wingYMin + 1;
        hYMax = wingYMax - 1;
        if (ly < hYMin || ly > hYMax) {
          return {
            role: "wall",
            rx: lx - Math.floor((hXMin + hXMax) / 2),
            ry: ly - wingMidY,
            roomName: "Muralha da Câmara Interna",
            subType: 0,
          };
        }
      }

      const hCenterX = Math.floor((hXMin + hXMax) / 2),
        hCenterY = Math.floor((hYMin + hYMax) / 2),
        hWidth = hXMax - hXMin + 1,
        hHeight = hYMax - hYMin + 1,
        rx = lx - hCenterX,
        ry = ly - hCenterY,
        arx = Math.abs(rx),
        ary = Math.abs(ry);

      const roomName =
        numHallsInChain === 1
          ? "Grande Salão Imperial (Ligado ao Corredor)"
          : hallIndex === 1
            ? `1º Salão de Entrada (Ligado ao Corredor — Cadeia de ${numHallsInChain} Salões)`
            : hallIndex === 2
              ? `2º Salão Interno (Ligado ao 1º Salão — Cadeia de ${numHallsInChain} Salões)`
              : "3º Salão Profundo do Santuário (Ligado apenas ao 2º Salão)";

      // Decoração e Arquitetura Interna conforme o tamanho e a posição do Salão na cadeia (1º, 2º ou 3º):
      // 1. Centro do Salão (rx === 0, ry === 0):
      if (rx === 0 && ry === 0) {
        if (hallIndex === 3 || (hallIndex === 2 && numHallsInChain === 2)) {
          // O último salão da cadeia guarda um Altar Sagrado ou uma Arca Real Kibotos!
          return {
            role: (bx + by + hallIndex) % 2 === 0 ? "altar" : "chest",
            rx,
            ry,
            roomName,
            subType: 0,
          };
        }
        return {
          role: "mosaic_center",
          rx,
          ry,
          roomName,
          subType: 0,
        };
      }

      // 2. Colunas Dóricas Intactas nos salões largos/grandes (sem bloquear as portas!)
      if (
        hWidth >= 11 &&
        hHeight >= 10 &&
        arx === Math.max(2, Math.floor(hWidth / 4)) &&
        ary === Math.max(2, Math.floor(hHeight / 4))
      ) {
        return {
          role: "column",
          rx,
          ry,
          roomName,
          subType: 0,
        };
      }

      // 3. Estátuas Helênicas Intactas nos salões internos ou grandes
      if (
        rx === 0 &&
        ly === hYMin + 1 &&
        lx !== 10 && // nunca bloqueia a porta do corredor norte!
        hHeight >= 10
      ) {
        return {
          role: "statue",
          rx,
          ry,
          roomName,
          subType: (Math.abs(bx + by) + hallIndex) % 2,
        };
      }

      // 4. Mobiliário Grego Intacto (Divãs Kline, Mesas Trapeza), Ânforas e Arcas nos cantos internos de cada salão
      const isCornerSpot =
        (lx === hXMin + 1 || lx === hXMax - 1) &&
        (ly === hYMin + 1 || ly === hYMax - 1) &&
        !(lx === 10 && ly === 6) && // deixa livre a frente da porta norte
        !(lx === 6 && ly === 22); // deixa livre a frente da porta oeste
      if (isCornerSpot && decorHash < 0.68) {
        if (hallIndex >= 2 && decorHash < 0.26) {
          return { role: "chest", rx, ry, roomName, subType: 0 };
        }
        if (decorHash < 0.48) {
          return {
            role: "furniture",
            rx,
            ry,
            roomName,
            subType: decorHash < 0.36 ? 0 : 1,
          };
        }
        return {
          role: "vase",
          rx,
          ry,
          roomName,
          subType: Math.floor(decorHash * 3) % 3,
        };
      }

      // 5. Piso 100% Intacto (alternando entre mármore de templo e terracota real para diferenciar visualmente os salões conectados!)
      return {
        role: hallIndex === 2 ? "house_floor" : "temple_floor",
        rx,
        ry,
        roomName,
        subType: 0,
      };
    }
    getUndergroundTile(t, l) {
      const u = this.hash2D(t, l, 97);

      // =========================================================================
      // SUBSOLO DO QUARTEL E PRISÃO GLACIAL (SALA DE TORTURA E CELAS SOLITÁRIAS):
      // Avalia primeiro se estamos na estrutura subterrânea do Quartel dos Picos Gelados!
      // =========================================================================
      if (
        typeof window !== "undefined" &&
        window.SnowPeakCity &&
        typeof window.SnowPeakCity.getUndergroundCellAt === "function"
      ) {
        const bCell = window.SnowPeakCity.getUndergroundCellAt(t, l, this.interactedProps);
        if (bCell) {
          let isDungeonWall = !1;
          let isDungeonDoor = !1;
          let isDungeonDoorOpen = !1;
          let isIronBars = !1;
          let isIronBarsOpen = !1;
          let sProp = null;

          if (bCell.role === "earth_mine_wall") {
            return {
              tx: t,
              ty: l,
              elevation: 0.9,
              moisture: 0.3,
              temperature: 0.35,
              biome: BIOMES[BiomeId.CAVE_WALL],
              isEarthMineWall: !0,
              isCaveRockWall25D: !0,
              dungeonRole: "earth_mine_wall",
              dungeonRoomName: bCell.roomName,
              prop: {
                kind: "cave_wall_25d",
                wallTheme: "earth_mine",
                subType: 0,
                scale: 1,
                namePt: "Paredão de Terra Escavada da Mina",
                descriptionPt: `Paredão alto de terra compactada e rocha escavada em: ${bCell.roomName}.`,
              },
              detailHash: u,
            };
          } else if (bCell.role === "earth_mine_floor") {
            return {
              tx: t,
              ty: l,
              elevation: 0.1,
              moisture: 0.4,
              temperature: 0.35,
              biome: BIOMES[BiomeId.CAVE_FLOOR],
              isEarthMineFloor: !0,
              dungeonRole: "earth_mine_floor",
              dungeonRoomName: bCell.roomName,
              prop: bCell.hasTorch
                ? {
                    kind: "corridor_torch",
                    subType: 0,
                    lit: !0,
                    offsetX: 0,
                    offsetY: -2,
                    scale: 1.05,
                    interactive: !1,
                    namePt: "Tocha Acesa da Mina",
                    descriptionPt:
                      "Tocha acesa fincada na parede de terra escavada, iluminando os longos túneis da mina.",
                  }
                : null,
              detailHash: u,
            };
          } else if (bCell.role === "prison_mine_exit") {
            return {
              tx: t,
              ty: l,
              elevation: 0.1,
              moisture: 0.4,
              temperature: 0.35,
              biome: BIOMES[BiomeId.CAVE_FLOOR],
              isEarthMineFloor: !0,
              dungeonRole: "earth_mine_floor",
              dungeonRoomName: bCell.roomName,
              prop: {
                kind: "cave_exit",
                subType: 0,
                isMerged: !0,
                mergedCount: 4,
                isPrisonDeepMine: !0,
                isExcavatorMine: !0,
                surfaceBiome: BIOMES[BiomeId.SNOW_PEAK],
                targetTx: bCell.targetTx,
                targetTy: bCell.targetTy,
                offsetX: 0,
                offsetY: -4,
                scale: 1.9,
                interactive: !0,
                namePt: "Saída da Mina Profunda das Neves",
                descriptionPt:
                  "A grande boca nevada da mina que leva de volta à superfície ao lado da Prisão. Pressione [F] para sair!",
              },
              detailHash: u,
            };
          } else if (bCell.role === "dungeon_wall") {
            isDungeonWall = !0;
            sProp = {
              kind: "dungeon_wall",
              subType: 0,
              scale: 1,
              namePt: "Muralha do Subsolo da Prisão",
              descriptionPt: `Muralha maciça de granito negro selando: ${bCell.roomName}.`,
            };
          } else if (bCell.role === "barracks_stair_exit") {
            sProp = {
              kind: "cave_exit",
              subType: 2,
              isStaircase: !0,
              isBarracksStaircase: !0,
              targetTx: bCell.targetTx,
              targetTy: bCell.targetTy,
              offsetX: 0,
              offsetY: -4,
              scale: 1.38,
              interactive: !0,
              namePt: "Escadaria de Subida para o Quartel e Prisão",
              descriptionPt:
                "Escadaria de pedra e ferro que sobe do Subsolo (Sala de Tortura e Solitárias) de volta para a Ala da Prisão na superfície. Pressione [F] para subir!",
            };
          } else if (bCell.role === "dungeon_door") {
            isDungeonDoor = !0;
            isDungeonDoorOpen = !!bCell.opened;
            sProp = {
              kind: "dungeon_door",
              doorVertical: !!bCell.doorVertical,
              opened: !!bCell.opened,
              scale: 1,
              interactive: !0,
              namePt: bCell.opened ? `${bCell.roomName} (Aberta)` : `${bCell.roomName} (Fechada)`,
              descriptionPt: "Pesada porta blindada do subsolo da prisão. Pressione [F] para abrir ou fechar!",
            };
          } else if (bCell.role === "iron_bars_gate") {
            isIronBars = !0;
            isIronBarsOpen = !!bCell.opened;
            sProp = {
              kind: "iron_bars_gate",
              doorVertical: !!bCell.doorVertical,
              defaultOpened: !0,
              unlocked: !0,
              opened: !!bCell.opened,
              scale: 1,
              interactive: !0,
              namePt: bCell.opened ? `${bCell.roomName} (Aberta)` : `${bCell.roomName} (Fechada)`,
              descriptionPt: "Grade maciça de ferro de isolamento da Cela Solitária. Pressione [F] para abrir ou fechar!",
            };
          } else if (bCell.role === "torture_rack") {
            sProp = {
              kind: "torture_rack",
              subType: 0,
              scale: 1.25,
              interactive: !0,
              namePt: "Cavalete de Tortura (Mesa de Estiramento)",
              descriptionPt: "Mesa de estiramento com manivelas e correntes de ferro na Sala de Tortura do Subsolo.",
            };
          } else if (bCell.role === "iron_maiden") {
            sProp = {
              kind: "iron_maiden",
              subType: 0,
              scale: 1.25,
              interactive: !0,
              namePt: "Donzela de Ferro (Sarcófago de Espinhos)",
              descriptionPt: "Sarcófago de ferro forjado com espinhos afiados no interior, usado nos interrogatórios do quartel.",
            };
          } else if (bCell.role === "torture_brazier") {
            sProp = {
              kind: "torture_brazier",
              subType: 0,
              scale: 1.15,
              interactive: !0,
              namePt: "Braseiro de Tortura com Ferros em Brasa",
              descriptionPt: "Braseiro incandescente aquecendo tenazes e ferros de marcar na Sala de Tortura.",
            };
          } else if (bCell.role === "torture_tools") {
            sProp = {
              kind: "torture_tools",
              subType: 0,
              scale: 1.15,
              interactive: !0,
              namePt: "Mesa de Instrumentos de Tortura e Interrogatório",
              descriptionPt: "Bancada manchada de sangue com alicates, serras, tenazes e chicotes de ferro.",
            };
          } else if (bCell.role === "hanging_cage") {
            sProp = {
              kind: "hanging_cage",
              subType: 0,
              scale: 1.2,
              interactive: !0,
              namePt: "Gaiola Suspensa de Isolamento",
              descriptionPt: "Gaiola de ferro suspensa por correntes no teto do subsolo.",
            };
          } else if (bCell.role === "dungeon_skeleton") {
            sProp = {
              kind: "dungeon_skeleton",
              subType: 0,
              scale: 1.1,
              interactive: !0,
              namePt: "Ossadas de Prisioneiro na Solitária",
              descriptionPt: "Restos mortais acorrentados na parede fria do subsolo.",
            };
          } else if (bCell.role === "dungeon_straw") {
            sProp = {
              kind: "dungeon_straw",
              subType: 0,
              scale: 1.05,
              interactive: !0,
              namePt: "Leito Frio da Solitária",
              descriptionPt: "Fina camada de palha úmida sobre a laje gelada da cela solitária.",
            };
          } else if (bCell.role === "dungeon_latrine_bench") {
            sProp = {
              kind: "dungeon_latrine_bench",
              subType: 0,
              scale: 1.1,
              interactive: !0,
              namePt: "Latrina de Pedra da Solitária",
              descriptionPt: "Fosso sanitário rústico no canto da cela de isolamento.",
            };
          } else if (bCell.role === "weapon_rack") {
            sProp = {
              kind: "weapon_rack",
              subType: 0,
              scale: 1.15,
              interactive: !0,
              namePt: "Suporte de Armas dos Carcereiros",
              descriptionPt: "Armas e bastões de ferro usados pelos guardas do subsolo.",
            };
          } else if (bCell.role === "chest") {
            sProp = {
              kind: "chest",
              subType: 0,
              scale: 1.05,
              interactive: !bCell.opened,
              opened: !!bCell.opened,
              namePt: bCell.opened ? "Baú do Subsolo (Aberto)" : "Baú Reforçado da Sala de Tortura",
              descriptionPt: "Baú trancado no subsolo da prisão. Pressione [F] para abrir!",
            };
          } else if (bCell.role === "corridor_torch") {
            sProp = {
              kind: "corridor_torch",
              subType: 0,
              lit: !0,
              offsetX: 0,
              offsetY: -2,
              scale: 1.05,
              interactive: !1,
              namePt: "Tocha do Subsolo da Prisão",
              descriptionPt: "Tocha bruxuleante iluminando o subsolo de tortura e solitárias.",
            };
          }

          if (sProp) {
            if (sProp.offsetX === undefined) sProp.offsetX = 0;
            if (sProp.offsetY === undefined) sProp.offsetY = 0;
            if (sProp.scale === undefined) sProp.scale = 1;
          }

          return {
            tx: t,
            ty: l,
            elevation: 0.1,
            moisture: 0.7,
            temperature: 0.25,
            biome: isDungeonWall ? BIOMES[BiomeId.CAVE_WALL] : BIOMES[BiomeId.CAVE_FLOOR],
            isDungeonFloor: !isDungeonWall,
            isDungeonWall,
            isDungeonDoor,
            isDungeonDoorOpen,
            isIronBars,
            isIronBarsOpen,
            dungeonRole: bCell.role,
            dungeonRoomName: bCell.roomName,
            prop: sProp,
            detailHash: u,
          };
        }
      }

      const thisMergedCave = this._getMergedCaveInfoAt(t, l);
      if (thisMergedCave && thisMergedCave.isLargeRock) {
        const surfBiome = this._computeSurfaceBaseBiome(t, l);
        const isDesert = !!(
          thisMergedCave.isDesertCave ||
          this.activeCaveEntranceIsDesert ||
          (surfBiome && (surfBiome.id === BiomeId.DESERT || surfBiome.id === BiomeId.CANYON))
        );
        return {
          tx: t,
          ty: l,
          elevation: 0.1,
          moisture: isDesert ? 0.15 : 0.65,
          temperature: isDesert ? 0.65 : 0.45,
          biome: isDesert ? BIOMES[BiomeId.DESERT_CAVE_FLOOR] : BIOMES[BiomeId.CAVE_FLOOR],
          isDesertCave: isDesert,
          prop: {
            kind: "stalactite",
            subType: Math.floor(this.hash2D(t, l, 479) * 3),
            isMerged: !!thisMergedCave.isMerged,
            mergedCount: thisMergedCave.mergedCount || 1,
            surfaceBiome: surfBiome,
            offsetX: 0,
            offsetY: 0,
            scale: thisMergedCave.scale || 1.35,
            interactive: !0,
            namePt: thisMergedCave.isMerged
              ? "Grande Formação de Estalagmites"
              : "Estalagmites do Chão da Caverna",
            descriptionPt:
              "Cones rochosos e calcários milenares que brotam diretamente do chão da caverna logo abaixo de um grande rochedo maciço da superfície.",
          },
          detailHash: u,
        };
      }
      const thisCave = this.getCaveEntranceAt(t, l);
      if (thisCave) {
        const surfBiome = this._computeSurfaceBaseBiome(t, l);
        const isStair = !!(
          thisCave.isStaircase ||
          thisCave.subType === 2 ||
          (surfBiome &&
            (surfBiome.id === BiomeId.MEADOW ||
              surfBiome.id === BiomeId.MEADOW_LAKE))
        );
        const isDesert = !!(
          thisCave.isDesertCave ||
          this.activeCaveEntranceIsDesert ||
          (surfBiome && (surfBiome.id === BiomeId.DESERT || surfBiome.id === BiomeId.CANYON))
        );
        const cleanName = thisCave.namePt
          .replace("Entrada da ", "")
          .replace("Boca da ", "")
          .replace("Fenda da ", "")
          .replace("Fenda das ", "");
        return {
          tx: t,
          ty: l,
          elevation: 0.1,
          moisture: isDesert ? 0.15 : 0.6,
          temperature: isDesert ? 0.65 : 0.45,
          biome: isDesert ? BIOMES[BiomeId.DESERT_CAVE_FLOOR] : BIOMES[BiomeId.CAVE_FLOOR],
          isDesertCave: isDesert,
          isGreekRuin: isStair,
          greekRuinRole: isStair ? "mosaic_center" : void 0,
          greekRuinRx: 0,
          greekRuinRy: 0,
          greekFloorFailed: !1,
          prop: {
            kind: "cave_exit",
            subType: thisCave.subType || 0,
            isStaircase: isStair,
            isDesertCave: isDesert,
            isMerged: !!thisCave.isMerged,
            mergedCount: thisCave.mergedCount || 1,
            surfaceBiome: surfBiome,
            targetTx: t,
            targetTy: l,
            offsetX: 0,
            offsetY: -4,
            scale: thisCave.scale || 1.35,
            interactive: !0,
            namePt: isStair
              ? `Escadaria de Saída do Subsolo [${cleanName}]`
              : isDesert
                ? `Saída dos Túneis do Deserto [${cleanName}]`
                : `Saída da Caverna [${cleanName}]`,
            descriptionPt: isStair
              ? `Escadaria monumental de mármore que sobe do subsolo de volta para o bioma de ruínas em [${t}, ${l}]. Pressione [F] para subir!`
              : isDesert
                ? `Abertura nas rochas de arenito que sobe dos túneis subterrâneos de volta para as dunas e sol do deserto em [${t}, ${l}]. Pressione [F] para sair!`
                : `Portal rochoso em arco conectado com a superfície em [${t}, ${l}] (${thisCave.namePt}). Pressione [F] para emergir no mundo superior!`,
          },
          detailHash: u,
        };
      }

      // =========================================================================
      // PRIORIDADE MÁXIMA NO SUBSOLO DO BIOMA DE RUÍNAS (MEADOW):
      // Avalia a grande estrutura temática de Corredores, Salões de Tamanhos
      // Diferentes e Portas ANTES do gerador de rochedos de caverna!
      // Assim NUNCA surgem rochedos (CAVE_WALL / stalagmites) neste subsolo!
      // =========================================================================
      const p = `cave_${t},${l}`;
      const sanctuary = this._getUndergroundGreekSanctuaryCellAt(t, l);
      if (sanctuary) {
        const dStair = this.isDungeonEntranceStairAt(t, l);
        if (dStair) {
          return {
            tx: t,
            ty: l,
            elevation: 0.15,
            moisture: 0.5,
            temperature: 0.5,
            biome: BIOMES[BiomeId.CAVE_FLOOR],
            isGreekRuin: !0,
            greekRuinRole: "mosaic_center",
            greekRuinRx: 0,
            greekRuinRy: 0,
            greekRoomName: "Salão com Escadaria do Calabouço",
            greekFloorFailed: !1,
            isGreekWall: !1,
            isGreekDoor: !1,
            isGreekDoorOpen: !1,
            prop: {
              kind: "dungeon_staircase_down",
              subType: 0,
              targetTx: t,
              targetTy: l,
              offsetX: 0,
              offsetY: -4,
              scale: 1.35,
              interactive: !0,
              namePt: "Escadaria de Ferro para o Calabouço Inferior",
              descriptionPt:
                "Uma imponente escadaria de ardósia escura com grades e correntes de ferro forjado descendo para as masmorras subterrâneas do andar inferior. Pressione [F] para descer!",
            },
            detailHash: u,
          };
        }

        const intState =
          this.interactedProps.get(p) ||
          this.interactedProps.get(`underground_${t},${l}`) ||
          this.interactedProps.get(`${t},${l}`) ||
          {};
        let sProp = null;
        let isGreekWall = !1;
        let isGreekDoor = !1;
        let isGreekDoorOpen = !1;

        if (this.customPlacedProps.has(p)) {
          sProp = { ...this.customPlacedProps.get(p) };
        } else if (sanctuary.role === "wall") {
          isGreekWall = !0;
          sProp = {
            kind: "greek_wall",
            subType: 0,
            wallHeightState: 0, // 100% Intacto (sem quebras!)
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            namePt: "Muralha Subterrânea Helênica Intacta",
            descriptionPt: `Parede de mármore perfeitamente preservada no subsolo (${sanctuary.roomName}).`,
          };
        } else if (sanctuary.role === "door") {
          const isOpen = !!intState.opened;
          isGreekDoor = !0;
          isGreekDoorOpen = isOpen;
          sProp = {
            kind: "greek_door",
            subType: sanctuary.doorVertical ? 1 : 0,
            opened: isOpen,
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            interactive: !0,
            namePt: isOpen
              ? `${sanctuary.roomName} (Porta Aberta)`
              : `${sanctuary.roomName} (Porta Fechada)`,
            descriptionPt: isOpen
              ? "Os batentes de cedro e bronze desta porta subterrânea estão abertos. Pressione [F] para fechar."
              : "Uma porta intacta de cedro e bronze guardando o salão subterrâneo. Pressione [F] para abrir!",
          };
        } else if (sanctuary.role === "column") {
          sProp = {
            kind: "ruin_pillar",
            subType: 0, // Coluna 100% inteira!
            offsetX: 0,
            offsetY: -4,
            scale: 1.15,
            interactive: !0,
            namePt: "Coluna Dórica Subterrânea Intacta",
            descriptionPt: `Coluna de mármore canelado que sustenta a abóbada de: ${sanctuary.roomName}.`,
          };
        } else if (sanctuary.role === "statue") {
          sProp = {
            kind: "greek_statue",
            subType: sanctuary.subType || 0, // 0 ou 1 (estátuas completas!)
            offsetX: 0,
            offsetY: -4,
            scale: 1.15,
            interactive: !0,
            namePt:
              sanctuary.subType === 0
                ? "Estátua de Palas Atena (Santuário Subterrâneo)"
                : "Estátua Olímpica de Mármore",
            descriptionPt: `Escultura helênica preservada em estado impecável no interior de: ${sanctuary.roomName}. Pressione [F] para examinar.`,
          };
        } else if (sanctuary.role === "vase") {
          const isCol = !!intState.collected;
          if (isCol) {
            sProp = null;
          } else {
            const vNames = [
              "Ânfora Grega do Santuário",
              "Cratera de Cerâmica do Santuário",
              "Pote de Terracota Subterrâneo",
            ];
            const vType = sanctuary.subType || 0;
            sProp = {
              kind: "greek_vase",
              subType: vType,
              offsetX: 0,
              offsetY: -2,
              scale: 1.05,
              interactive: !0,
              namePt: vNames[vType % vNames.length],
              descriptionPt: `Jarro e pote cerâmico preservado em: ${sanctuary.roomName}. Pressione [F] para coletar para seu inventário!`,
            };
          }
        } else if (sanctuary.role === "furniture") {
          sProp = {
            kind: "greek_furniture",
            subType: sanctuary.subType || 0,
            offsetX: 0,
            offsetY: -2,
            scale: 1.08,
            interactive: !0,
            namePt:
              sanctuary.subType === 0
                ? "Kline Real (Divã de Banquete)"
                : "Trapeza (Mesa de Mármore e Bronze)",
            descriptionPt: `Mobiliário helênico intacto no interior de: ${sanctuary.roomName}. Pressione [F] para examinar.`,
          };
        } else if (sanctuary.role === "altar") {
          sProp = {
            kind: "shrine",
            subType: 0,
            offsetX: 0,
            offsetY: -4,
            scale: 1.25,
            interactive: !0,
            activated: !!intState.activated,
            namePt: "Altar Sagrado do Santuário Subterrâneo",
            descriptionPt: intState.activated
              ? "O altar subterrâneo irradia a luz dourada do Olimpo!"
              : "Pressione [F] para despertar a bênção ancestral deste salão subterrâneo.",
          };
        } else if (sanctuary.role === "corridor_torch") {
          const isLit = !!intState.lit;
          sProp = {
            kind: "corridor_torch",
            subType: sanctuary.subType || 0,
            lit: isLit,
            offsetX: 0,
            offsetY: -2,
            scale: 1.05,
            interactive: !isLit,
            namePt: isLit
              ? "Tocha do Corredor Subterrâneo (Acesa)"
              : "Ponto de Tocha do Corredor (Apagada)",
            descriptionPt: isLit
              ? "O braseiro de bronze desta tocha ilumina o corredor de mármore com chamas douradas."
              : "Um suporte de bronze helênico com tocha apagada no corredor. Equipe uma Tocha na mão e pressione [F] para acendê-lo!",
          };
        } else if (sanctuary.role === "chest") {
          const opened = !!intState.opened;
          sProp = {
            kind: "chest",
            subType: 0,
            offsetX: 0,
            offsetY: 0,
            scale: 1.05,
            interactive: !opened,
            opened: opened,
            namePt: opened
              ? "Kibotos Subterrânea (Aberta)"
              : "Kibotos Real (Arca do Tesouro Subterrâneo)",
            descriptionPt: opened
              ? "Os tesouros desta arca já foram recolhidos."
              : `Arca intacta guardada em: ${sanctuary.roomName}. Pressione [F] para abrir!`,
          };
        }

        return {
          tx: t,
          ty: l,
          elevation: 0.15,
          moisture: 0.5,
          temperature: 0.5,
          biome: BIOMES[BiomeId.CAVE_FLOOR],
          isGreekRuin: !0,
          greekRuinRole: sanctuary.role,
          greekRuinRx: sanctuary.rx,
          greekRuinRy: sanctuary.ry,
          greekRoomName: sanctuary.roomName,
          greekFloorFailed: !1, // Piso 100% intacto, sem falhas!
          isGreekWall,
          isGreekDoor,
          isGreekDoorOpen,
          prop: sProp,
          detailHash: u,
        };
      }

      const nearExit = this.getNearbyCaveExit(t, l, 3.5);
      const nearConnector = this.getNearbyCaveExit(t, l, 6.5);
      const surfBiome = this._computeSurfaceBaseBiome(t, l);
      const isDesertCave = !!(
        (nearExit && nearExit.cave && nearExit.cave.isDesertCave) ||
        (surfBiome && (surfBiome.id === BiomeId.DESERT || surfBiome.id === BiomeId.CANYON)) ||
        this.activeCaveEntranceIsDesert
      );

      if (isDesertCave) {
        // =====================================================================
        // CAVERNAS TEMÁTICAS NO DESERTO:
        // Túneis estreitos naturais e a ÁREA MÉDIA DO NINHO DOS TARDÍGRADOS
        // com a Rainha 3 vezes maior, ovos espalhados e filhotes andando!
        // =====================================================================
        const nest = this.getDesertTardigradeNest(t, l);
        let inNestRoom = false;
        let inNestCorridor = false;
        let isNestTile = false;
        let isNestCenter = false;

        if (nest) {
          const distToNestCenter = Math.hypot(t - nest.cx, l - nest.cy);
          const nestWobble = this.caveDetailNoise.noise2D(t * 0.16, l * 0.16) * 1.5;
          if (distToNestCenter + nestWobble <= nest.radius) {
            inNestRoom = true;
            isNestTile = true;
            if (distToNestCenter <= 3.8) {
              isNestCenter = true;
            }
          }

          // Corredor largo de conexão entre a entrada da caverna e o ninho
          if (nest.entTx !== undefined && nest.entTy !== undefined) {
            const segDist = this._distanceToSegment(t, l, nest.entTx, nest.entTy, nest.cx, nest.cy);
            const corrWobble = this.caveWallNoise.noise2D(t * 0.12, l * 0.12) * 0.75;
            if (segDist + corrWobble <= 2.2) {
              inNestCorridor = true;
            }
          }
        }

        const isTunnelNoise = (x, y) => {
          const a = Math.abs(this.caveWallNoise.noise2D(x * 0.08, y * 0.08));
          const b = Math.abs(this.caveDetailNoise.noise2D(x * 0.08 + 137, y * 0.08 + 137));
          const c = Math.abs(this.caveRoomNoise.noise2D(x * 0.09 + 351, y * 0.09 + 351));
          return a < 0.088 || b < 0.088 || c < 0.088;
        };
        const inNarrowTunnel =
          isTunnelNoise(t, l) ||
          (isTunnelNoise(t - 1, l) && isTunnelNoise(t, l + 1)) ||
          (isTunnelNoise(t + 1, l) && isTunnelNoise(t, l + 1)) ||
          (isTunnelNoise(t - 1, l) && isTunnelNoise(t, l - 1)) ||
          (isTunnelNoise(t + 1, l) && isTunnelNoise(t, l - 1));
        const atExitPlaza = nearExit && nearExit.dist <= 2.8;
        const inConnectorTunnel =
          nearConnector &&
          ((Math.abs(nearConnector.dx) <= 1.5 && Math.abs(nearConnector.dy) <= 7.0) ||
            (Math.abs(nearConnector.dy) <= 1.5 && Math.abs(nearConnector.dx) <= 7.0));
        const geodeFissure = this.isGeodeFissureAt(t, l);
        if (geodeFissure) {
          return {
            tx: t,
            ty: l,
            elevation: 0.9,
            moisture: 0.15,
            temperature: 0.65,
            biome: BIOMES[BiomeId.DESERT_CAVE_WALL],
            isDesertCave: !0,
            isGeodeFissureWall: !0,
            isCaveRockWall25D: !0,
            prop: {
              kind: "geode_fissure",
              wallTheme: "desert_cave",
              targetTx: t,
              targetTy: l,
              offsetX: 0,
              offsetY: 0,
              scale: 1,
              interactive: !0,
              namePt: "Fenda no Paredão para o Geodo de Cristais",
              descriptionPt:
                "Uma fenda profunda na escarpa de arenito do deserto que reluz com cristais violetas e safiras no interior. Pressione [F] ou caminhe até a fenda para entrar no Geodo!",
            },
            detailHash: u,
          };
        }

        const nearGeodeFissure = this.getDesertGeodeFissure(t, l);
        let inGeodeAccess = !1;
        if (nearGeodeFissure) {
          // Garante clareira diante da face frontal sul da fenda do paredão e corredor ligado ao túnel ou entrada
          if (Math.abs(t - nearGeodeFissure.tx) <= 1 && l >= nearGeodeFissure.ty + 1 && l <= nearGeodeFissure.ty + 3) {
            inGeodeAccess = !0;
          } else if (
            nearGeodeFissure.anchorTx !== undefined &&
            nearGeodeFissure.anchorTy !== undefined &&
            l > nearGeodeFissure.ty
          ) {
            const dSeg = this._distanceToSegment(
              t,
              l,
              nearGeodeFissure.tx,
              nearGeodeFissure.ty + 1,
              nearGeodeFissure.anchorTx,
              nearGeodeFissure.anchorTy,
            );
            if (dSeg <= 1.45) inGeodeAccess = !0;
          }
        }

        const isOpen =
          atExitPlaza ||
          inConnectorTunnel ||
          inNarrowTunnel ||
          inNestRoom ||
          inNestCorridor ||
          inGeodeAccess;

        if (!isOpen) {
          return {
            tx: t,
            ty: l,
            elevation: 0.9,
            moisture: 0.1,
            temperature: 0.65,
            biome: BIOMES[BiomeId.DESERT_CAVE_WALL],
            isDesertCave: !0,
            isCaveRockWall25D: !0,
            prop: {
              kind: "cave_wall_25d",
              wallTheme: "desert_cave",
              subType: 0,
              scale: 1,
              namePt: "Paredão de Arenito da Caverna",
              descriptionPt: "Paredão alto e escarpado de rocha sedimentar de arenito das cavernas do deserto.",
            },
            detailHash: u,
          };
        }

        // Se estiver dentro da área média do Ninho dos Tardígrados
        if (inNestRoom && nest) {
          let eggProp = null;
          // No centro (raio <= 2.8), o chão fica livre para a Rainha se mover e lutar
          if (!isNestCenter) {
            const eggHash = this.hash2D(t, l, 909);
            // Espalha ninhadas de ovos em cerca de 32% dos tiles do ninho
            if (eggHash < 0.32) {
              const eggSub = Math.floor(this.hash2D(t, l, 919) * 3);
              const pKey = this.isUnderground ? `underground_${t},${l}` : `${t},${l}`;
              const prev = this.interactedProps.get(pKey);
              const opened = !!(prev && prev.opened);
              eggProp = {
                kind: "tardigrade_egg",
                subType: eggSub,
                scale: 0.95 + this.hash2D(t, l, 929) * 0.3,
                interactive: true,
                opened: opened,
                namePt: opened ? "Cascas Vazias de Ovos de Tardígrado" : "Ninhada de Ovos de Tardígrado",
                descriptionPt: opened
                  ? "Cascas translúcidas rompidas de tardígrados que já eclodiram no ninho."
                  : "Aglomerado de ovos translúcidos de tardígrado com casca quitinosa dourada e embriões em estado criptobiótico. Pressione [F] para examinar ou colher!",
              };
            }
          }

          return {
            tx: t,
            ty: l,
            elevation: 0.1,
            moisture: 0.2,
            temperature: 0.65,
            biome: BIOMES[BiomeId.DESERT_CAVE_FLOOR],
            isDesertCave: !0,
            isTardigradeNest: !0,
            isNestCenter: isNestCenter,
            nestCx: nest.cx,
            nestCy: nest.cy,
            roomName: "Ninho dos Tardígrados (Câmara da Rainha e Ninhada)",
            prop: eggProp,
            detailHash: u,
          };
        }

        // Piso dos túneis estreitos do deserto: SEM MINERAIS!
        let w = null;
        if (!nearExit && u < 0.02) {
          w = {
            kind: "dungeon_skeleton",
            subType: 0,
            scale: 0.85,
            interactive: !1,
            namePt: "Ossada Seca nas Areias Subterrâneas",
            descriptionPt: "Restos fósseis de uma criatura nas profundezas dos túneis estreitos do deserto.",
          };
        }

        return {
          tx: t,
          ty: l,
          elevation: 0.1,
          moisture: 0.15,
          temperature: 0.65,
          biome: BIOMES[BiomeId.DESERT_CAVE_FLOOR],
          isDesertCave: !0,
          prop: w,
          detailHash: u,
        };
      }

      const nearStalactite = this.getNearbyFormerCaveStalactite(t, l, 2.5);
      const isConnectorHall =
        nearConnector &&
        (Math.abs(nearConnector.dx) <= 1.4 ||
          Math.abs(nearConnector.dy) <= 1.4);
      const m = Math.abs(this.caveWallNoise.noise2D(t * 0.07, l * 0.07)),
        c = this.caveRoomNoise.noise2D(t * 0.04, l * 0.04),
        f = this.caveDetailNoise.noise2D(t * 0.07 + 77, l * 0.07 + 77),
        fDetail = this.caveDetailNoise.noise2D(t * 0.08, l * 0.08);
      const isOpen =
        !!nearExit ||
        !!nearStalactite ||
        isConnectorHall ||
        m < 0.15 ||
        Math.abs(f) < 0.14 ||
        c > 0.46;
      if (!isOpen)
        return {
          tx: t,
          ty: l,
          elevation: 0.9,
          moisture: 0.2,
          temperature: 0.4,
          biome: BIOMES[BiomeId.CAVE_WALL],
          isCaveRockWall25D: !0,
          prop: {
            kind: "cave_wall_25d",
            wallTheme: "cave_rock",
            subType: 0,
            scale: 1,
            namePt: "Paredão Rochoso da Caverna",
            descriptionPt: "Alto paredão maciço de rocha bruta que forma as galerias subterrâneas da caverna.",
          },
          detailHash: u,
        };
      let y = BIOMES[BiomeId.CAVE_FLOOR];
      fDetail < -0.45 && c > 0.35
        ? (y = BIOMES[BiomeId.CAVE_LAKE])
        : fDetail > 0.45 && c > 0.35
          ? (y = BIOMES[BiomeId.CAVE_CRYSTAL])
          : c > 0.42 && fDetail < -0.15 && (y = BIOMES[BiomeId.CAVE_MUSHROOM]);
      let w = null;
      if (nearExit && nearExit.dist > 1.8 && u < 0.08) {
        w = {
          kind: "stalagmite",
          subType: 0,
          offsetX: u * 8 - 4,
          offsetY: ((u * 13) % 8) - 4,
          scale: 0.85,
        };
      }
      const v = this.hash2D(t, l, 77),
        T = `underground_${t},${l}`,
        S = this.interactedProps.get(T);
      if (!nearExit && y.id !== BiomeId.CAVE_LAKE) {
        if (y.id === BiomeId.CAVE_CRYSTAL && v < 0.09) {
          const j = Math.floor(this.hash2D(t, l, 88) * 4),
            P = (S == null ? void 0 : S.opened) ?? !1,
            A = ["Ametista", "Safira", "Rubi", "Esmeralda"];
          w = {
            kind: "crystal_cluster",
            subType: j,
            offsetX: (this.hash2D(t, l, 91) - 0.5) * 8,
            offsetY: (this.hash2D(t, l, 93) - 0.5) * 8,
            scale: 0.95 + this.hash2D(t, l, 95) * 0.25,
            interactive: !P,
            opened: P,
            namePt: P ? "Formação Mineral (Minerada)" : `Drusa de ${A[j]}`,
            descriptionPt: P
              ? "Esta formação rochosa já foi minerada."
              : "Pressione [F] ou Interagir para extrair minerais!",
          };
        } else if (y.id === BiomeId.CAVE_MUSHROOM && v < 0.07)
          w = {
            kind: "glowing_mushroom",
            subType: Math.floor(this.hash2D(t, l, 82) * 2),
            offsetX: (this.hash2D(t, l, 84) - 0.5) * 8,
            offsetY: (this.hash2D(t, l, 86) - 0.5) * 8,
            scale: 0.85 + this.hash2D(t, l, 87) * 0.25,
            interactive: !0,
            namePt: "Fungo das Profundezas",
            descriptionPt:
              "Esporos fosforescentes muito tênues crescendo na rocha úmida.",
          };
        else if (y.id === BiomeId.CAVE_FLOOR)
          if (v >= 0.008 && v < 0.035) {
            const j = Math.floor(this.hash2D(t, l, 11) * 3),
              P = [
                "Filão de Ouro Maciço",
                "Filão de Mitril Ancestral",
                "Veio de Ferro Cristalino",
              ],
              A = (S == null ? void 0 : S.opened) ?? !1;
            w = {
              kind: "ore_vein",
              subType: j,
              offsetX: (this.hash2D(t, l, 15) - 0.5) * 6,
              offsetY: (this.hash2D(t, l, 17) - 0.5) * 6,
              scale: 0.95,
              interactive: !A,
              opened: A,
              namePt: A ? `${P[j]} (Extraído)` : P[j],
              descriptionPt: A
                ? "Este veio mineral já foi completamente explorado."
                : "Pressione [F] para extrair minérios nobres das profundezas!",
            };
          } else
            v >= 0.035 && v < 0.045
              ? (w = {
                  kind: "miner_cart",
                  subType: 0,
                  offsetX: 0,
                  offsetY: 0,
                  scale: 1,
                  interactive: !0,
                  namePt: "Vagão de Mineração Abandonado",
                  descriptionPt:
                    "Um antigo carrinho de mina esquecido nos túneis.",
                })
              : v >= 0.045 &&
                v < 0.16 &&
                (w = {
                  kind: "stalagmite",
                  subType: Math.floor(this.hash2D(t, l, 21) * 3),
                  offsetX: (this.hash2D(t, l, 23) - 0.5) * 8,
                  offsetY: (this.hash2D(t, l, 25) - 0.5) * 8,
                  scale: 0.85 + this.hash2D(t, l, 27) * 0.4,
                });
      }
      if (this.customPlacedProps.has(p)) {
        w = { ...this.customPlacedProps.get(p) };
        const j = this.interactedProps.get(p);
        ((j == null ? void 0 : j.lit) !== void 0 &&
          ((w.lit = j.lit),
          w.lit
            ? ((w.namePt = "Fogueira Crepitante"),
              (w.descriptionPt =
                "Uma fogueira aquecida e crepitante. Pressione [F] para descansar e restaurar vigor."))
            : ((w.namePt = "Fogueira de Acampamento (Apagada)"),
              (w.descriptionPt =
                "Uma fogueira montada com 10 galhos secos. Pressione [F] tendo 2 Pederneiras para acendê-la com faíscas!"))),
          j != null && j.roastingFish && (w.roastingFish = j.roastingFish),
          j != null && j.cookingPot && (w.cookingPot = j.cookingPot));
      }
      return {
        tx: t,
        ty: l,
        elevation: 0.15,
        moisture: 0.65,
        temperature: 0.45,
        biome: y,
        prop: w,
        detailHash: u,
      };
    }
    _getDungeonCellAt(dx, dy) {
      // 1. Vestíbulo da Escadaria: dx in [-3, 3], dy in [-4, 2]
      if (dx >= -3 && dx <= 3 && dy >= -4 && dy <= 2) {
        if (dy === -4 || dx === -3 || dx === 3 || (dy === 2 && (dx < -1 || dx > 1))) {
          return { role: "dungeon_wall", roomName: "Muralha do Vestíbulo da Escadaria" };
        }
        if (dx === 0 && dy === 0) {
          return { role: "dungeon_staircase_up", roomName: "Vestíbulo da Escadaria do Calabouço" };
        }
        if ((dx === -2 && dy === -3) || (dx === 2 && dy === -3)) {
          return { role: "corridor_torch", roomName: "Vestíbulo da Escadaria do Calabouço" };
        }
        return { role: "dungeon_floor", roomName: "Vestíbulo da Escadaria do Calabouço" };
      }

      // Conexões superiores das muralhas externas entre o Vestíbulo e as Celas/Salões:
      if (dy === 3 && dx >= -7 && dx <= -2) {
        return { role: "dungeon_wall", roomName: "Muralha das Celas" };
      }
      if (dy === 3 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha do Posto do Carcereiro" };
      }

      // 2. Corredor Longo do Calabouço: dx in [-1, 1], dy in [3, 102]
      if (dx >= -1 && dx <= 1 && dy >= 3 && dy <= 102) {
        if ((dx === -1 || dx === 1) && (dy === 8 || dy === 14 || dy === 20 || dy === 26 || dy === 32 || dy === 38 || dy === 44 || dy === 50 || dy === 56 || dy === 62 || dy === 68 || dy === 74 || dy === 80 || dy === 86 || dy === 92 || dy === 98)) {
          return { role: "corridor_torch", roomName: "Grande Corredor das Masmorras" };
        }
        return { role: "corridor_floor", roomName: "Grande Corredor das Masmorras" };
      }

      // 3. Prisões Pequenas com Grades (Ala Oeste): dx in [-7, -2], dy in [4, 102]
      if (dx >= -7 && dx <= -2 && dy >= 4 && dy <= 102) {
        if (dx === -7) {
          return { role: "dungeon_wall", roomName: "Muralha Externa das Celas" };
        }
        if (dy === 102) {
          return { role: "dungeon_wall", roomName: "Muralha Sul das Celas" };
        }
        const isPartition = (dy % 6 === 2) && dy >= 8 && dy <= 98;
        if (isPartition) {
          return { role: "dungeon_wall", roomName: "Parede Divisória de Cela" };
        }

        // Frente voltada para o corredor (dx === -2)
        if (dx === -2) {
          if (dy === 6) return { role: "iron_bars_gate", cellIndex: 1, defaultOpened: false, roomName: "Grade da Cela 1 (Trancada)" };
          if (dy === 11) return { role: "iron_bars_gate", cellIndex: 2, defaultOpened: true, roomName: "Grade da Cela 2 (Aberta)" };
          if (dy === 17) return { role: "iron_bars_gate", cellIndex: 3, defaultOpened: false, roomName: "Grade da Cela 3 (Trancada)" };
          if (dy === 23) return { role: "iron_bars_gate", cellIndex: 4, defaultOpened: true, roomName: "Grade da Cela 4 (Aberta)" };
          if (dy === 29) return { role: "iron_bars_gate", cellIndex: 5, defaultOpened: false, roomName: "Grade da Cela 5 (Trancada)" };
          if (dy === 35) return { role: "iron_bars_gate", cellIndex: 6, defaultOpened: true, roomName: "Grade da Cela 6 (Aberta)" };
          if (dy === 41) return { role: "iron_bars_gate", cellIndex: 7, defaultOpened: false, roomName: "Grade da Cela 7 (Trancada)" };
          if (dy === 47) return { role: "iron_bars_gate", cellIndex: 8, defaultOpened: true, roomName: "Grade da Cela 8 (Aberta)" };
          if (dy === 53) return { role: "iron_bars_gate", cellIndex: 9, defaultOpened: false, roomName: "Grade da Cela 9 (Trancada)" };
          if (dy === 59) return { role: "iron_bars_gate", cellIndex: 10, defaultOpened: true, roomName: "Grade da Cela 10 (Aberta)" };
          if (dy === 65) return { role: "iron_bars_gate", cellIndex: 11, defaultOpened: false, roomName: "Grade da Cela 11 (Trancada)" };
          if (dy === 71) return { role: "iron_bars_gate", cellIndex: 12, defaultOpened: true, roomName: "Grade da Cela 12 (Aberta)" };
          if (dy === 77) return { role: "iron_bars_gate", cellIndex: 13, defaultOpened: false, roomName: "Grade da Cela 13 (Trancada)" };
          if (dy === 83) return { role: "iron_bars_gate", cellIndex: 14, defaultOpened: true, roomName: "Grade da Cela 14 (Aberta)" };
          if (dy === 89) return { role: "iron_bars_gate", cellIndex: 15, defaultOpened: false, roomName: "Grade da Cela 15 (Trancada)" };
          if (dy === 95) return { role: "iron_bars_gate", cellIndex: 16, defaultOpened: true, roomName: "Grade da Cela 16 (Aberta)" };
          if (dy === 100) return { role: "iron_bars_gate", cellIndex: 17, defaultOpened: true, roomName: "Grade da Cela 17 (Aberta)" };
          return { role: "dungeon_wall", roomName: "Frontispício das Celas" };
        }

        let cellIdx = Math.min(17, Math.floor((dy - 3) / 6) + 1);
        const cellName = `Cela Prisional #${cellIdx}`;

        if (cellIdx === 1 && dx === -5 && dy === 5) return { role: "dungeon_skeleton", roomName: cellName };
        if (cellIdx === 2 && dx === -5 && dy === 10) return { role: "dungeon_straw", roomName: cellName };
        if (cellIdx === 3 && dx === -5 && dy === 16) return { role: "chest", roomName: cellName };
        if (cellIdx === 4 && dx === -5 && dy === 22) return { role: "dungeon_latrine_bench", roomName: cellName };
        if (cellIdx === 5 && dx === -5 && dy === 28) return { role: "dungeon_skeleton", roomName: cellName };
        if (cellIdx === 6 && dx === -5 && dy === 35) return { role: "dungeon_straw", roomName: cellName };
        if (cellIdx === 7 && dx === -5 && dy === 41) return { role: "chest", roomName: cellName };
        if (cellIdx === 8 && dx === -5 && dy === 47) return { role: "dungeon_skeleton", roomName: cellName };
        if (cellIdx === 9 && dx === -5 && dy === 53) return { role: "dungeon_straw", roomName: cellName };
        if (cellIdx === 10 && dx === -5 && dy === 59) return { role: "dungeon_latrine_bench", roomName: cellName };
        if (cellIdx === 11 && dx === -5 && dy === 64) return { role: "chest", roomName: cellName };
        if (cellIdx === 12 && dx === -5 && dy === 71) return { role: "dungeon_skeleton", roomName: cellName };
        if (cellIdx === 13 && dx === -5 && dy === 77) return { role: "dungeon_straw", roomName: cellName };
        if (cellIdx === 14 && dx === -5 && dy === 83) return { role: "chest", roomName: cellName };
        if (cellIdx === 15 && dx === -5 && dy === 89) return { role: "dungeon_skeleton", roomName: cellName };
        if (cellIdx === 16 && dx === -5 && dy === 95) return { role: "dungeon_straw", roomName: cellName };
        if (cellIdx === 17 && dx === -5 && dy === 100) return { role: "chest", roomName: cellName };

        return { role: "cell_floor", cellIndex: cellIdx, roomName: cellName };
      }

      // 4. Salão 1: Posto do Carcereiro (dx in [2, 13], dy in [4, 12])
      if (dx >= 2 && dx <= 13 && dy >= 4 && dy <= 12) {
        if (dy === 4 || dy === 12 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha do Posto do Carcereiro" };
        }
        if (dx === 2) {
          if (dy === 8) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta do Posto do Carcereiro" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Posto do Carcereiro das Masmorras";
        if (dx === 7 && dy === 8) return { role: "jailer_table", roomName };
        if (dx === 10 && dy === 6) return { role: "weapon_rack", roomName };
        if (dx === 4 && dy === 6) return { role: "chest", roomName };
        if (dx === 10 && dy === 10) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 1 e Salão 2
      if (dy === 13 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 5. Salão 2: A SALA DE TORTURA (dx in [2, 13], dy in [14, 25])
      if (dx >= 2 && dx <= 13 && dy >= 14 && dy <= 25) {
        if (dy === 14 || dy === 25 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha da Câmara de Tortura" };
        }
        if (dx === 2) {
          if (dy === 19) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta Blindada da Câmara de Tortura" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Câmara de Tortura das Masmorras";
        if (dx === 8 && dy === 19) return { role: "torture_rack", roomName };
        if (dx === 11 && dy === 17) return { role: "iron_maiden", roomName };
        if (dx === 10 && dy === 22) return { role: "hanging_cage", roomName };
        if (dx === 5 && dy === 22) return { role: "torture_brazier", roomName };
        if (dx === 5 && dy === 16) return { role: "torture_tools", roomName };
        if (dx === 8 && dy === 15) return { role: "dungeon_skeleton", roomName };
        if (dx === 8 && dy === 24) return { role: "dungeon_straw", roomName };
        if (dx === 11 && dy === 15) return { role: "corridor_torch", roomName };
        return { role: "torture_floor", roomName };
      }

      // Parede divisória entre Salão 2 e Salão 3
      if (dy === 26 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 6. Salão 3: SALÃO DA FOSSA (Latrinas: dx in [2, 13], dy in [27, 36])
      if (dx >= 2 && dx <= 13 && dy >= 27 && dy <= 36) {
        if (dy === 27 || dy === 36 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha da Câmara da Fossa" };
        }
        if (dx === 2) {
          if (dy === 31) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta da Câmara da Fossa" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Câmara da Fossa e Latrinas Subterrâneas";
        if (dx === 7 && dy === 31) return { role: "dungeon_latrine_pit", roomName };
        if (dx === 11 && dy === 29) return { role: "dungeon_latrine_bench", roomName };
        if (dx === 11 && dy === 33) return { role: "dungeon_latrine_bench", roomName };
        if (dx === 4 && dy === 34) return { role: "dungeon_latrine_bench", roomName };
        if (dx === 11 && dy === 35) return { role: "corridor_torch", roomName };
        return { role: "latrine_floor", roomName };
      }

      // Parede divisória entre Salão 3 e Salão 4
      if (dy === 37 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 7. Salão 4: Cripta dos Condenados e Catacumbas (dx in [2, 13], dy in [38, 48])
      if (dx >= 2 && dx <= 13 && dy >= 38 && dy <= 48) {
        if (dy === 38 || dy === 48 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha da Cripta dos Condenados" };
        }
        if (dx === 2) {
          if (dy === 43) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta de Carvalho da Cripta" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Cripta dos Condenados e Ossuário Subterrâneo";
        if (dx === 8 && dy === 43) return { role: "hanging_cage", roomName };
        if (dx === 5 && dy === 41) return { role: "dungeon_skeleton", roomName };
        if (dx === 11 && dy === 41) return { role: "dungeon_skeleton", roomName };
        if (dx === 8 && dy === 46) return { role: "chest", roomName };
        if (dx === 11 && dy === 46) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 4 e Salão 5
      if (dy === 49 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 8. Salão 5: Armaria e Forja das Correntes (dx in [2, 13], dy in [50, 60])
      if (dx >= 2 && dx <= 13 && dy >= 50 && dy <= 60) {
        if (dy === 50 || dy === 60 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha da Armaria das Masmorras" };
        }
        if (dx === 2) {
          if (dy === 55) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta Reforçada da Armaria" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Armaria e Forja das Correntes das Masmorras";
        if (dx === 7 && dy === 55) return { role: "torture_brazier", roomName };
        if (dx === 11 && dy === 52) return { role: "weapon_rack", roomName };
        if (dx === 4 && dy === 52) return { role: "weapon_rack", roomName };
        if (dx === 10 && dy === 58) return { role: "chest", roomName };
        if (dx === 11 && dy === 59) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 5 e Salão 6
      if (dy === 61 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 9. Salão 6: Laboratório Oculto e Alquimia Proibida (dx in [2, 13], dy in [62, 72])
      if (dx >= 2 && dx <= 13 && dy >= 62 && dy <= 72) {
        if (dy === 62 || dy === 72 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha do Laboratório Oculto" };
        }
        if (dx === 2) {
          if (dy === 67) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta de Bronze do Laboratório" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Laboratório Oculto das Masmorras";
        if (dx === 8 && dy === 67) return { role: "torture_tools", roomName };
        if (dx === 5 && dy === 64) return { role: "chest", roomName };
        if (dx === 11 && dy === 64) return { role: "dungeon_skeleton", roomName };
        if (dx === 5 && dy === 70) return { role: "dungeon_straw", roomName };
        if (dx === 11 && dy === 70) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 6 e Salão 7
      if (dy === 73 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 10. Salão 7: Câmara de Julgamento do Tribunal Sombrio (dx in [2, 13], dy in [74, 84])
      if (dx >= 2 && dx <= 13 && dy >= 74 && dy <= 84) {
        if (dy === 74 || dy === 84 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha da Câmara de Julgamento" };
        }
        if (dx === 2) {
          if (dy === 79) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta do Tribunal Sombrio" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Câmara de Julgamento do Tribunal Sombrio";
        if (dx === 8 && dy === 76) return { role: "jailer_table", roomName };
        if (dx === 5 && dy === 81) return { role: "hanging_cage", roomName };
        if (dx === 11 && dy === 81) return { role: "iron_maiden", roomName };
        if (dx === 8 && dy === 82) return { role: "dungeon_skeleton", roomName };
        if (dx === 11 && dy === 75) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 7 e Salão 8
      if (dy === 85 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 11. Salão 8: Aposentos do Grão-Inquisidor (dx in [2, 13], dy in [86, 96])
      if (dx >= 2 && dx <= 13 && dy >= 86 && dy <= 96) {
        if (dy === 86 || dy === 96 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha dos Aposentos do Inquisidor" };
        }
        if (dx === 2) {
          if (dy === 91) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta dos Aposentos Secretos" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Aposentos do Grão-Inquisidor das Masmorras";
        if (dx === 8 && dy === 91) return { role: "chest", roomName };
        if (dx === 5 && dy === 89) return { role: "weapon_rack", roomName };
        if (dx === 11 && dy === 89) return { role: "dungeon_straw", roomName };
        if (dx === 8 && dy === 94) return { role: "hanging_cage", roomName };
        if (dx === 11 && dy === 94) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // Parede divisória entre Salão 8 e Salão 9
      if (dy === 97 && dx >= 2 && dx <= 13) {
        return { role: "dungeon_wall", roomName: "Muralha Divisória de Salão" };
      }

      // 12. Salão 9: Depósito de Suprimentos Subterrâneos (dx in [2, 13], dy in [98, 102])
      if (dx >= 2 && dx <= 13 && dy >= 98 && dy <= 102) {
        if (dy === 98 || dy === 102 || dx === 13) {
          return { role: "dungeon_wall", roomName: "Muralha do Depósito Subterrâneo" };
        }
        if (dx === 2) {
          if (dy === 100) {
            return { role: "dungeon_door", doorVertical: true, defaultOpened: false, roomName: "Porta do Depósito Subterrâneo" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Corredor" };
        }
        const roomName = "Depósito de Suprimentos e Reservas";
        if (dx === 7 && dy === 100) return { role: "chest", roomName };
        if (dx === 10 && dy === 100) return { role: "weapon_rack", roomName };
        if (dx === 11 && dy === 101) return { role: "corridor_torch", roomName };
        return { role: "hall_floor", roomName };
      }

      // 13. Grande Santuário e Câmara do Tesouro Final (dx in [-6, 6], dy in [103, 118])
      if (dx >= -6 && dx <= 6 && dy >= 103 && dy <= 118) {
        if (dy === 103) {
          if (dx === 0) {
            return { role: "dungeon_door", doorVertical: false, defaultOpened: false, roomName: "Grande Portão do Santuário das Profundezas" };
          }
          return { role: "dungeon_wall", roomName: "Muralha Frontal do Santuário" };
        }
        if (dx === -6 || dx === 6 || dy === 118) {
          if (dy === 118 && dx === 0) {
            return { role: "dungeon_door", doorVertical: false, defaultOpened: false, roomName: "Porta Rústica para o Túnel da Caverna" };
          }
          return { role: "dungeon_wall", roomName: "Muralha do Santuário das Profundezas" };
        }
        const roomName = "Grande Santuário e Tesouro do Calabouço";
        if ((dx === -3 || dx === 3) && (dy === 106 || dy === 112)) return { role: "corridor_torch", roomName };
        if ((dx === -4 || dx === 4) && dy === 108) return { role: "weapon_rack", roomName };
        if ((dx === -4 || dx === 4) && dy === 114) return { role: "hanging_cage", roomName };
        if (dx === 0 && dy === 110) return { role: "torture_brazier", roomName };
        if ((dx === -2 || dx === 0 || dx === 2) && dy === 116) return { role: "chest", roomName };
        if ((dx === -4 || dx === 4) && dy === 116) return { role: "dungeon_skeleton", roomName };
        return { role: "hall_floor", roomName };
      }

      // 14. Túnel Estreito da Caverna (Local de Descarte de Mortos) (dy in [119, 129], dx in [-3, 3])
      if (dy >= 119 && dy <= 129 && dx >= -3 && dx <= 3) {
        if (dx === -1 || dx === 0) {
          const roomName = "Túnel Estreito da Caverna de Descarte";
          if (dy === 121 && dx === -1) return { role: "dungeon_skeleton", isCave: true, roomName };
          if (dy === 124 && dx === 0) return { role: "bone_pile", subType: 1, scale: 1.2, isCave: true, roomName };
          if (dy === 127 && dx === -1) return { role: "dungeon_skeleton", isCave: true, roomName };
          if (dy === 129 && dx === 0) return { role: "bone_pile", subType: 2, scale: 1.25, isCave: true, roomName };
          return { role: "cave_tunnel_floor", isCave: true, roomName };
        }
        return { role: "cave_tunnel_wall", isCave: true, roomName: "Paredão de Rocha da Caverna" };
      }

      // 15. Transição e Abertura para a Caverna dos Mortos (dy in [130, 131])
      if (dy === 130 && dx >= -5 && dx <= 5) {
        if (dx >= -2 && dx <= 1) {
          return { role: "cave_tunnel_floor", isCave: true, roomName: "Entrada da Caverna de Descarte" };
        }
        return { role: "bone_cavern_wall", isCave: true, roomName: "Paredão de Rocha da Caverna" };
      }
      if (dy === 131 && dx >= -9 && dx <= 9) {
        if (dx >= -4 && dx <= 3) {
          return { role: "bone_cavern_floor", isCave: true, roomName: "Entrada da Caverna de Descarte" };
        }
        return { role: "bone_cavern_wall", isCave: true, roomName: "Paredão de Rocha da Caverna" };
      }

      // 16. Grande Caverna de Descarte dos Mortos (Tema de Caverna Comum, dx in [-9, 9], dy in [132, 154])
      if (dx >= -9 && dx <= 9 && dy >= 132 && dy <= 154) {
        if (dy === 154) {
          return { role: "bone_cavern_wall", isCave: true, roomName: "Paredão de Rocha da Caverna de Descarte" };
        }
        if (dx === -9 || dx === 9) {
          return { role: "bone_cavern_wall", isCave: true, roomName: "Paredão de Rocha da Caverna de Descarte" };
        }
        if (dy === 132 && (dx <= -5 || dx >= 4)) {
          return { role: "bone_cavern_wall", isCave: true, roomName: "Paredão de Rocha da Caverna de Descarte" };
        }

        const roomName = "Caverna de Descarte dos Mortos";

        // Pilhas de ossos e carcaças jogadas e acumuladas na caverna
        if (dx === 0 && dy === 144) return { role: "bone_pile", subType: 0, scale: 1.7, isCave: true, roomName };
        if (dx === 0 && dy === 152) return { role: "bone_pile", subType: 0, scale: 1.85, isCave: true, roomName };
        if (dx === -5 && dy === 137) return { role: "bone_pile", subType: 1, scale: 1.4, isCave: true, roomName };
        if (dx === 5 && dy === 137) return { role: "bone_pile", subType: 2, scale: 1.4, isCave: true, roomName };
        if (dx === -2 && dy === 141) return { role: "bone_pile", subType: 3, scale: 1.45, isCave: true, roomName };
        if (dx === 2 && dy === 141) return { role: "bone_pile", subType: 1, scale: 1.45, isCave: true, roomName };
        if (dx === -6 && dy === 145) return { role: "bone_pile", subType: 1, scale: 1.5, isCave: true, roomName };
        if (dx === 6 && dy === 145) return { role: "bone_pile", subType: 2, scale: 1.5, isCave: true, roomName };
        if (dx === -7 && dy === 149) return { role: "bone_pile", subType: 3, scale: 1.4, isCave: true, roomName };
        if (dx === 7 && dy === 149) return { role: "bone_pile", subType: 1, scale: 1.4, isCave: true, roomName };
        if (dx === -3 && dy === 151) return { role: "bone_pile", subType: 2, scale: 1.5, isCave: true, roomName };
        if (dx === 3 && dy === 151) return { role: "bone_pile", subType: 0, scale: 1.5, isCave: true, roomName };
        if (dx === 0 && dy === 135) return { role: "bone_pile", subType: 3, scale: 1.35, isCave: true, roomName };
        if (dx === -4 && dy === 147) return { role: "bone_pile", subType: 1, scale: 1.35, isCave: true, roomName };
        if (dx === 4 && dy === 147) return { role: "bone_pile", subType: 2, scale: 1.35, isCave: true, roomName };

        // Restos mortais e esqueletos de prisioneiros descartados
        if (dx === -8 && dy === 134) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 8 && dy === 134) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -4 && dy === 134) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 4 && dy === 134) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -7 && dy === 139) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 7 && dy === 139) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -8 && dy === 144) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 8 && dy === 144) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -1 && dy === 148) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 1 && dy === 148) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -8 && dy === 151) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 8 && dy === 151) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === -5 && dy === 152) return { role: "dungeon_skeleton", isCave: true, roomName };
        if (dx === 5 && dy === 152) return { role: "dungeon_skeleton", isCave: true, roomName };

        // Cogumelos bioluminescentes naturais da caverna úmida
        if (dx === -8 && dy === 137) return { role: "glowing_mushroom", isCave: true, subType: 0, roomName };
        if (dx === 8 && dy === 137) return { role: "glowing_mushroom", isCave: true, subType: 1, roomName };
        if (dx === -8 && dy === 148) return { role: "glowing_mushroom", isCave: true, subType: 2, roomName };
        if (dx === 8 && dy === 148) return { role: "glowing_mushroom", isCave: true, subType: 0, roomName };
        if (dx === -6 && dy === 153) return { role: "glowing_mushroom", isCave: true, subType: 1, roomName };
        if (dx === 6 && dy === 153) return { role: "glowing_mushroom", isCave: true, subType: 2, roomName };

        return { role: "bone_cavern_floor", isCave: true, roomName };
      }

      return null;
    }
    _isNearDungeonWall(dx, dy) {
      for (let ndy = -2; ndy <= 2; ndy++) {
        for (let ndx = -2; ndx <= 2; ndx++) {
          const cell = this._getDungeonCellAt(dx + ndx, dy + ndy);
          if (cell && (cell.role === "dungeon_wall" || cell.role === "cave_tunnel_wall" || cell.role === "bone_cavern_wall")) {
            return true;
          }
        }
      }
      return false;
    }
    getDungeonTile(t, l) {
      const u = this.hash2D(t, l, 98);
      let stair = this.activeDungeonStairCoords;
      if (!stair) {
        stair = this.getDungeonEntranceStairForBiome(t, l);
        if (stair) this.activeDungeonStairCoords = { tx: stair.tx, ty: stair.ty };
      }
      const stairTx = stair ? stair.tx : t;
      const stairTy = stair ? stair.ty : l;
      const dx = t - stairTx;
      const dy = l - stairTy;

      const pKey = `dungeon_${t},${l}`;
      const intState =
        this.interactedProps.get(pKey) ||
        this.interactedProps.get(`underground_${t},${l}`) ||
        this.interactedProps.get(`${t},${l}`) ||
        {};

      const cell = this._getDungeonCellAt(dx, dy);

      if (cell) {
        let isDungeonWall = !1;
        let isDungeonDoor = !1;
        let isDungeonDoorOpen = !1;
        let isIronBars = !1;
        let isIronBarsOpen = !1;
        let sProp = null;

        if (this.customPlacedProps.has(pKey)) {
          sProp = { ...this.customPlacedProps.get(pKey) };
        } else if (cell.role === "dungeon_wall") {
          isDungeonWall = !0;
          sProp = {
            kind: "dungeon_wall",
            subType: 0,
            scale: 1,
            namePt: "Muralha de Cantaria do Calabouço",
            descriptionPt: `Paredão maciço e intransponível de rocha selando o interior de: ${cell.roomName}.`,
          };
        } else if (cell.role === "cave_tunnel_wall" || cell.role === "bone_cavern_wall") {
          isDungeonWall = !0;
          sProp = {
            kind: "cave_wall_25d",
            wallTheme: "cave_rock",
            subType: 0,
            scale: 1,
            namePt: "Paredão de Rocha da Caverna",
            descriptionPt: `Alto paredão maciço e intransponível de rocha natural selando: ${cell.roomName}.`,
          };
        } else if (cell.role === "dungeon_staircase_up") {
          sProp = {
            kind: "dungeon_staircase_up",
            targetTx: stairTx,
            targetTy: stairTy,
            scale: 1.35,
            interactive: !0,
            namePt: "Escadaria Ascendente do Calabouço",
            descriptionPt: `Escadaria robusta de pedra e ferro que sobe de volta para os salões do subsolo em [${stairTx}, ${stairTy}]. Pressione [F] para subir ao subsolo!`,
          };
        } else if (cell.role === "iron_bars_gate") {
          const isUnlocked = !!intState.unlocked;
          const isDefaultOpened = !!cell.defaultOpened;
          const isOpen = intState.opened !== undefined
            ? !!intState.opened
            : isDefaultOpened;
          isIronBars = !0;
          isIronBarsOpen = isOpen;
          sProp = {
            kind: "iron_bars_gate",
            doorVertical: !0,
            cellIndex: cell.cellIndex || 0,
            defaultOpened: isDefaultOpened,
            unlocked: isUnlocked || isDefaultOpened,
            opened: isOpen,
            scale: 1,
            interactive: !0,
            namePt: isOpen
              ? `${cell.roomName} (Aberta)`
              : isUnlocked || isDefaultOpened
                ? `${cell.roomName} (Fechada)`
                : `${cell.roomName} (Trancada)`,
            descriptionPt: isOpen
              ? "As pesadas barras de ferro forjado desta cela estão abertas. Pressione [F] para fechar a grade."
              : isUnlocked || isDefaultOpened
                ? "Grade de ferro destrancada. Pressione [F] para abrir!"
                : "Grade de ferro fechada com um pesado cadeado. Requer a Chave do Carcereiro para abrir!",
          };
        } else if (cell.role === "dungeon_door") {
          const isOpen = intState.opened !== undefined ? !!intState.opened : !!cell.defaultOpened;
          isDungeonDoor = !0;
          isDungeonDoorOpen = isOpen;
          sProp = {
            kind: "dungeon_door",
            doorVertical: !!cell.doorVertical,
            opened: isOpen,
            scale: 1,
            interactive: !0,
            namePt: isOpen
              ? `${cell.roomName} (Porta Aberta)`
              : `${cell.roomName} (Porta Fechada)`,
            descriptionPt: isOpen
              ? "A pesada porta de madeira reforçada com ferro está aberta. Pressione [F] para fechar."
              : `Porta maciça de madeira com ferragens forjadas dando acesso a: ${cell.roomName}. Pressione [F] para abrir!`,
          };
        } else if (cell.role === "corridor_torch") {
          const isLit = !!intState.lit;
          sProp = {
            kind: "corridor_torch",
            subType: 0,
            lit: isLit,
            offsetX: 0,
            offsetY: -2,
            scale: 1.05,
            interactive: !isLit,
            namePt: isLit
              ? "Tocha do Calabouço (Acesa)"
              : "Suporte de Tocha do Calabouço (Apagada)",
            descriptionPt: isLit
              ? "Tocha de ferro ardendo em chamas, iluminando as masmorras sombrias."
              : "Um suporte de tocha apagado na parede do calabouço. Pressione [F] com uma tocha equipada para acendê-la!",
          };
        } else if (cell.role === "torture_rack") {
          sProp = {
            kind: "torture_rack",
            subType: 0,
            scale: 1.25,
            interactive: !0,
            namePt: "Cavalete de Tortura (Mesa de Estiramento)",
            descriptionPt: "Estrutura sinistra de madeira maciça, manivelas dentadas e correntes de ferro usadas para estirar membros de prisioneiros.",
          };
        } else if (cell.role === "iron_maiden") {
          sProp = {
            kind: "iron_maiden",
            subType: 0,
            scale: 1.25,
            interactive: !0,
            namePt: "Donzela de Ferro (Sarcófago de Espinhos)",
            descriptionPt: "Sarcófago de ferro forjado em pé com o rosto moldado em agonia e o interior forrado de pontas afiadas de metal.",
          };
        } else if (cell.role === "hanging_cage") {
          sProp = {
            kind: "hanging_cage",
            subType: 0,
            scale: 1.2,
            interactive: !0,
            namePt: "Gaiola de Ferro Suspensa com Ossadas",
            descriptionPt: "Gaiola esférica de barras de ferro pendurada no teto por grossas correntes, guardando os restos mortais de uma antiga vítima.",
          };
        } else if (cell.role === "torture_brazier") {
          sProp = {
            kind: "torture_brazier",
            subType: 0,
            scale: 1.15,
            interactive: !0,
            namePt: "Braseiro de Tortura com Ferros em Brasa",
            descriptionPt: "Braseiro de ferro com carvão incandescente e ferros compridos de marcar a brasa aquecendo entre as chamas.",
          };
        } else if (cell.role === "torture_tools") {
          sProp = {
            kind: "torture_tools",
            subType: 0,
            scale: 1.1,
            interactive: !0,
            namePt: "Mesa de Instrumentos de Suplício",
            descriptionPt: "Mesa ensanguentada com tenazes de ferro, pinças, serras e chicotes usados nos interrogatórios da masmorra.",
          };
        } else if (cell.role === "dungeon_latrine_pit") {
          sProp = {
            kind: "dungeon_latrine_pit",
            subType: 0,
            scale: 1.35,
            interactive: !0,
            namePt: "Fossa Negra de Dejetos e Esgoto Subterrâneo",
            descriptionPt: "Poço profundo e fétido escavado na rocha, coberto por tábuas podres e grades de ferro escorrendo líquido escuro.",
          };
        } else if (cell.role === "dungeon_latrine_bench") {
          sProp = {
            kind: "dungeon_latrine_bench",
            subType: 0,
            scale: 1.15,
            interactive: !0,
            namePt: "Assentos de Latrina em Alvenaria",
            descriptionPt: "Bancos rústicos de pedra com orifícios talhados conduzindo à fossa subterrânea.",
          };
        } else if (cell.role === "jailer_table") {
          const hasKey = !!intState.collectedKey;
          sProp = {
            kind: "jailer_table",
            subType: 0,
            hasKey: !hasKey,
            scale: 1.2,
            interactive: !0,
            namePt: "Mesa do Carcereiro",
            descriptionPt: hasKey
              ? "Mesa pesada de madeira carcomida com um diário de registros de antigos prisioneiros esquecidos."
              : "Mesa pesada de madeira com um livro de registros e um molho de chaves de ferro pendurado! Pressione [F] para pegar a Chave do Carcereiro.",
          };
        } else if (cell.role === "weapon_rack") {
          sProp = {
            kind: "weapon_rack",
            subType: 0,
            scale: 1.15,
            interactive: !0,
            namePt: "Suporte de Armas Enferrujadas",
            descriptionPt: "Alabardas, maças e espadas enferrujadas usadas pelos antigos guardas da masmorra.",
          };
        } else if (cell.role === "dungeon_skeleton") {
          sProp = {
            kind: "dungeon_skeleton",
            subType: 0,
            scale: 1.1,
            interactive: !0,
            namePt: "Ossadas de Prisioneiro Acorrentado",
            descriptionPt: "Restos mortais de um prisioneiro cujos pulsos ainda permanecem presos a grilhões chumbados na rocha.",
          };
        } else if (cell.role === "bone_pile") {
          sProp = {
            kind: "bone_pile",
            subType: cell.subType || 0,
            scale: cell.scale || 1.35,
            interactive: !0,
            namePt: "Pilha de Ossos e Crânios Ancestrais",
            descriptionPt: "Montes macabros de ossadas humanas e de feras antigas, crânios rachados e costelas fossilizadas empilhados nas profundezas da caverna.",
          };
        } else if (cell.role === "dungeon_straw") {
          sProp = {
            kind: "dungeon_straw",
            subType: 0,
            scale: 1.05,
            interactive: !0,
            namePt: "Cama de Palha Úmida",
            descriptionPt: "Um monte de palha mofada e úmida servindo de leito desconfortável nas celas frias do calabouço.",
          };
        } else if (cell.role === "chest") {
          const opened = !!intState.opened;
          sProp = {
            kind: "chest",
            subType: 0,
            scale: 1.05,
            interactive: !opened,
            opened: opened,
            namePt: opened
              ? "Baú do Calabouço (Aberto)"
              : "Baú Reforçado do Calabouço",
            descriptionPt: opened
              ? "Os tesouros deste baú já foram recolhidos."
              : `Baú de carvalho com guarnições de ferro guardado em: ${cell.roomName}. Pressione [F] para abrir!`,
          };
        } else if (cell.role === "glowing_mushroom") {
          sProp = {
            kind: "glowing_mushroom",
            subType: cell.subType || 0,
            scale: 1.15,
            interactive: !0,
            namePt: "Cogumelo Bioluminescente da Caverna",
            descriptionPt: "Fungo cavernoso que emite uma suave luz azulada entre as rochas e a terra úmida do fosso de descarte.",
          };
        }
        if (sProp) {
          if (sProp.offsetX === undefined) sProp.offsetX = 0;
          if (sProp.offsetY === undefined) {
            sProp.offsetY = sProp.kind === "dungeon_staircase_up" ? -4 : 0;
          }
          if (sProp.scale === undefined) sProp.scale = 1;
        }

        const isCaveTheme = !!cell.isCave || cell.role === "cave_tunnel_floor" || cell.role === "cave_tunnel_wall" || cell.role === "bone_cavern_floor" || cell.role === "bone_cavern_wall";

        return {
          tx: t,
          ty: l,
          elevation: 0.1,
          moisture: 0.7,
          temperature: 0.35,
          biome: isDungeonWall ? BIOMES[BiomeId.CAVE_WALL] : BIOMES[BiomeId.CAVE_FLOOR],
          isDungeonFloor: isCaveTheme ? false : !isDungeonWall,
          isDungeonWall: isCaveTheme ? false : isDungeonWall,
          isCaveRockWall25D: isCaveTheme && isDungeonWall,
          isDungeonDoor,
          isDungeonDoorOpen,
          isIronBars,
          isIronBarsOpen,
          dungeonRole: cell.role,
          dungeonRoomName: cell.roomName,
          prop: sProp,
          detailHash: u,
        };
      }

      // FORA DA CONSTRUÇÃO DO CALABOUÇO: CAVERNA COMUM
      const isNearWall = this._isNearDungeonWall(dx, dy);
      const m = Math.abs(this.caveWallNoise.noise2D(t * 0.07, l * 0.07)),
        c = this.caveRoomNoise.noise2D(t * 0.04, l * 0.04),
        f = this.caveDetailNoise.noise2D(t * 0.07 + 77, l * 0.07 + 77);
      const isOpen = isNearWall || m < 0.15 || Math.abs(f) < 0.14 || c > 0.46;

      if (!isOpen) {
        return {
          tx: t,
          ty: l,
          elevation: 0.9,
          moisture: 0.2,
          temperature: 0.4,
          biome: BIOMES[BiomeId.CAVE_WALL],
          isCaveRockWall25D: !0,
          prop: {
            kind: "cave_wall_25d",
            wallTheme: "cave_rock",
            subType: 0,
            scale: 1,
            namePt: "Paredão Rochoso da Caverna",
            descriptionPt: "Alto paredão maciço de rocha bruta que forma as galerias subterrâneas da caverna.",
          },
          detailHash: u,
        };
      }

      // Fora da construção do calabouço: caverna limpa (sem pedregulhos, seixos ou estalagmites)
      let caveProp = null;
      let isPedregulhos = !1;

      if (!isNearWall) {
        // Recursos naturais da caverna comum afastados das muralhas
        const rHash = this.hash2D(t, l, 513);
        if (rHash < 0.035) {
          const opened = !!intState.opened;
          caveProp = {
            kind: "crystal_cluster",
            subType: Math.floor(rHash * 100) % 4,
            scale: 1.1,
            interactive: !opened,
            opened: opened,
            namePt: "Formação de Cristais Subterrâneos",
            descriptionPt: "Cristais brilhantes incrustados na rocha da caverna. Pressione [F] para minerar!",
          };
        } else if (rHash < 0.065) {
          const opened = !!intState.opened;
          caveProp = {
            kind: "ore_vein",
            subType: Math.floor(rHash * 100) % 3,
            scale: 1.1,
            interactive: !opened,
            opened: opened,
            namePt: "Veio Mineral Bruto",
            descriptionPt: "Um rico veio de minério despontando da parede rochosa. Pressione [F] para extrair!",
          };
        } else if (rHash < 0.095) {
          caveProp = {
            kind: "glowing_mushroom",
            subType: Math.floor(rHash * 100) % 3,
            scale: 1.05,
            interactive: !0,
            namePt: "Cogumelo Bioluminescente das Profundezas",
            descriptionPt: "Fungo raro que emite luz azulada nas cavernas. Pressione [F] para colher!",
          };
        }
      }

      if (caveProp) {
        if (caveProp.offsetX === undefined) caveProp.offsetX = 0;
        if (caveProp.offsetY === undefined) caveProp.offsetY = 0;
        if (caveProp.scale === undefined) caveProp.scale = 1;
      }

      return {
        tx: t,
        ty: l,
        elevation: 0.1,
        moisture: 0.6,
        temperature: 0.45,
        biome: BIOMES[BiomeId.CAVE_FLOOR],
        isPedregulhos,
        prop: caveProp,
        detailHash: u,
      };
    }
    generateProp(t, l, o, u, m) {
      // Clareira aberta no ponto de spawn inicial da Floresta Temperada (raio de 2.5 tiles livres)
      if (!this.isUnderground && Math.hypot(t, l) < 2.5) {
        return null;
      }
      const c = `${t},${l}`,
        f = this.interactedProps.get(c);
      if (o.hasWater) {
        if (Fs(t, l, this, { biome: o }) && o.passable && u < 0.14) {
          const p = (f == null ? void 0 : f.harvestCount) ?? 0;
          return {
            kind: "clay_deposit",
            subType: 0,
            offsetX: u * 8 - 4,
            offsetY: u * 8 - 4,
            scale: 1.15,
            interactive: !0,
            opened: p >= 3,
            harvestCount: p,
            namePt: "Ponto de Coleta de Argila",
            descriptionPt:
              "Banco rico em argila plástica úmida no leito da lagoa. Pressione [F] para extrair porções de argila pura!",
          };
        }
        return (o.id === BiomeId.COAST_WATER ||
          o.id === BiomeId.MEADOW_LAKE ||
          o.id === BiomeId.FOREST_LAKE ||
          o.id === BiomeId.TAIGA_LAKE) &&
          u < 0.016
          ? {
              kind: "rock",
              subType: 0,
              offsetX: u * 10 - 5,
              offsetY: u * 12 - 6,
              scale: 0.7,
            }
          : null;
      }
      const mergedCave = this._getMergedCaveInfoAt(t, l);
      if (mergedCave) {
        if (mergedCave.isLargeRock) {
          return {
            kind: "large_rock",
            subType: mergedCave.subType || 0,
            isMerged: !!mergedCave.isMerged,
            mergedCount: mergedCave.mergedCount || 1,
            offsetX: 0,
            offsetY: -4,
            scale: mergedCave.scale || 1.35,
            interactive: !0,
            namePt: mergedCave.isMerged
              ? "Grande Maciço Rochoso"
              : "Rocha Grande Maciça",
            descriptionPt:
              "Uma colossal formação de rocha bruta maciça erguida na superfície, sem fendas ou entradas para o subsolo.",
          };
        }
        return {
          kind: "cave_entrance",
          subType: mergedCave.subType || 0,
          isStaircase: !!(mergedCave.isStaircase || o.id === BiomeId.MEADOW),
          isMerged: !!mergedCave.isMerged,
          mergedCount: mergedCave.mergedCount || 1,
          offsetX: 0,
          offsetY: -4,
          scale: mergedCave.scale || 1.35,
          interactive: !0,
          namePt: mergedCave.namePt,
          descriptionPt: mergedCave.descriptionPt,
        };
      }
      const g = this.hash2D(t, l, 99);
      if (g < 0.0018 && m > 0.42 && m < 0.8)
        return {
          kind: "shrine",
          subType: 0,
          offsetX: 0,
          offsetY: -4,
          scale: 1.2,
          interactive: !0,
          namePt: "Santuário de Cristal Ancestral",
          descriptionPt:
            f != null && f.activated
              ? "O santuário pulsa com bênçãos radiantes ativadas!"
              : "Pressione [F] ou Interagir para despertar a bênção mágica do santuário.",
        };
      // Fogueiras não aparecem mais naturalmente pelo mapa — são criadas exclusivamente pelo jogador via receita!
      // Pilares em ruínas aparecem EXCLUSIVAMENTE nas Planícies (BiomeId.MEADOW)
      if (
        g > 0.0055 &&
        g < 0.0075 &&
        o.id === BiomeId.MEADOW
      )
        return {
          kind: "ruin_pillar",
          subType: Math.floor(this.hash2D(t, l, 13) * 2),
          offsetX: 0,
          offsetY: -6,
          scale: 1.1,
          interactive: !0,
          namePt: "Pilar em Ruínas de Pedra Mágica",
          descriptionPt:
            "Inscrições rúnicas esquecidas esculpidas em granito ancestral.",
        };
      // Se este tile era candidato a caverna mas se juntou com uma caverna vizinha próxima, não gera árvore em cima
      if (this._isRawCaveCandidateAt(t, l)) return null;
      const y = this.hash2D(t, l, 23),
        w = this.hash2D(t, l, 41),
        v = (this.hash2D(t, l, 53) - 0.5) * 12,
        T = (this.hash2D(t, l, 67) - 0.5) * 12;
      if (y < o.treeDensity) {
        let S = "tree_oak";
        o.propType === "pine"
          ? (S = "tree_pine")
          : o.propType === "palm"
            ? (S = "tree_palm")
            : o.propType === "cactus"
              ? (S = "cactus")
              : o.propType === "willow"
                ? (S = "tree_willow")
                : o.propType === "burnt" && (S = "tree_burnt");
        if (f && f.chopped) {
          return {
            kind: "tree_stump",
            subType: Math.floor(w * 3),
            offsetX: v,
            offsetY: T - 8,
            scale: 0.9 + w * 0.3,
            interactive: !0,
            namePt: "Toco de Árvore",
            descriptionPt: "Toco remanescente de uma árvore abatida com machado.",
          };
        }
        const isCactus = S === "cactus";
        return {
          kind: S,
          subType: Math.floor(w * 3),
          offsetX: v,
          offsetY: T - 8,
          scale: 0.9 + w * 0.3,
          interactive: !isCactus,
          namePt: S === "tree_pine" ? "Pinheiro Silvestre" : S === "tree_palm" ? "Palmeira Tropical" : S === "tree_willow" ? "Salgueiro-Chorão" : S === "tree_burnt" ? "Árvore Carbonizada" : "Carvalho Ancestral",
          descriptionPt: isCactus ? "Cacto espinhoso do deserto." : "Árvore de madeira densa. Pode ser cortada com um Machado equipado para obter troncos.",
        };
      }
      return y < o.treeDensity + o.rockDensity
        ? {
            kind: "rock",
            subType: Math.floor(w * 3),
            offsetX: v,
            offsetY: T,
            scale: 0.8 + w * 0.4,
          }
        : y < o.treeDensity + o.rockDensity + o.floraDensity
          ? (o.id === BiomeId.SWAMP || o.id === BiomeId.DEEP_FOREST) && w < 0.45
            ? {
                kind: "mushroom",
                subType: Math.floor(w * 4),
                offsetX: v,
                offsetY: T,
                scale: 0.85,
              }
            : (o.id === BiomeId.DESERT || o.id === BiomeId.CANYON)
              ? null
              : {
                  kind:
                    w < 0.33
                      ? "flower_red"
                      : w < 0.66
                        ? "flower_blue"
                        : "flower_yellow",
                  subType: Math.floor(w * 2),
                  offsetX: v,
                  offsetY: T,
                  scale: 0.8 + w * 0.3,
                }
          : null;
    }
    interactWithTile(t, l, context) {
      var c;
      const o = this.getTile(t, l);
      if (!o.prop || !o.prop.interactive) return null;
      const u = this.isUnderground ? `underground_${t},${l}` : `${t},${l}`,
        m = this.interactedProps.get(u) || {};
      if (
        o.prop.kind === "tree_oak" ||
        o.prop.kind === "tree_pine" ||
        o.prop.kind === "tree_palm" ||
        o.prop.kind === "tree_willow" ||
        o.prop.kind === "tree_burnt"
      ) {
        if (m.chopped) {
          return {
            success: !1,
            message: "Este toco de árvore já foi completamente abatido.",
          };
        }
        const hasAxe = !!(context && context.hasAxe);
        if (!hasAxe) {
          return {
            success: !1,
            action: "need_axe",
            message: "🪓 Você precisa de um Machado equipado nas mãos para cortar árvores e conseguir troncos de madeira!",
          };
        }
        const chops = (m.chops || 0) + 1;
        if (chops < 3) {
          this.interactedProps.set(u, { ...m, chops });
          return {
            success: !0,
            action: "chop_tree_hit",
            currentChops: chops,
            maxChops: 3,
            tx: t,
            ty: l,
            treeKind: o.prop.kind,
            treeSubType: o.prop.subType || 0,
            treeScale: o.prop.scale || 1,
            biomeId: o.biome ? o.biome.id : null,
            offsetX: o.prop.offsetX || 0,
            offsetY: o.prop.offsetY || 0,
            message: `🪓 Golpe de machado no tronco! (${chops}/3) Lascas de madeira voando!`,
          };
        }
        const treeKind = o.prop.kind;
        const treeSubType = o.prop.subType || 0;
        const treeScale = o.prop.scale || 1;
        const biomeId = o.biome ? o.biome.id : null;
        const offsetX = o.prop.offsetX || 0;
        const offsetY = o.prop.offsetY || 0;
        this.interactedProps.set(u, { ...m, chopped: !0, chops: 3 });
        this.invalidateTile(t, l);
        const isPine = treeKind === "tree_pine";
        const woodLogs = 2 + Math.floor(this.hash2D(t, l, 81) * 2);
        const sticks = 1 + Math.floor(this.hash2D(t, l, 83) * 2);
        const resin = isPine && this.hash2D(t, l, 85) < 0.65;
        return {
          success: !0,
          action: "chop_tree_fell",
          tx: t,
          ty: l,
          treeKind,
          treeSubType,
          treeScale,
          biomeId,
          offsetX,
          offsetY,
          woodLogs,
          sticks,
          resin,
          treeName: o.prop.namePt || "Árvore",
          message: `🌳 Você derrubou a árvore com seu machado! Obteve ${woodLogs} Troncos de Madeira e ${sticks} Galhos!`,
          reward: `Troncos de Madeira (+45 XP)`,
        };
      }
      if (o.prop.kind === "tree_stump") {
        return {
          success: !1,
          message: "Toco de árvore cortada com machado. Toda a madeira útil já foi retirada.",
        };
      }
      if (o.prop.kind === "cave_entrance")
        return {
          success: !0,
          action: "enter_cave",
          entranceTx: t,
          entranceTy: l,
          message: "Descendo para o labirinto de cavernas subterrâneas...",
          reward: "Caverna Descoberta (+100 XP)",
        };
      if (o.prop.kind === "cave_exit")
        return {
          success: !0,
          action: "exit_cave",
          targetTx: o.prop.targetTx !== undefined ? o.prop.targetTx : t,
          targetTy: o.prop.targetTy !== undefined ? o.prop.targetTy : l,
          message:
            "Atravessando o portal de pedra de volta à luz da superfície!",
          reward: "Retorno à Superfície",
        };
      if (o.prop.kind === "large_rock")
        return {
          success: !0,
          message:
            "🪨 Você examinou a Rocha Grande Maciça: é um afloramento sólido de pedra natural, sem abertura para cavernas.",
          reward: "Rocha Maciça",
        };
      if (o.prop.kind === "stalactite")
        return {
          success: !0,
          message:
            "🪨 Grandes estalagmites pontiagudas erguem-se do chão da caverna exatamente abaixo da grande rocha maciça da superfície.",
          reward: "Estalagmites Examinadas (+35 XP)",
        };
      if (o.prop.kind === "geode_fissure")
        return {
          success: !0,
          action: "enter_geode",
          targetTx: o.prop.targetTx !== undefined ? o.prop.targetTx : t,
          targetTy: o.prop.targetTy !== undefined ? o.prop.targetTy : l,
          message:
            "Atravessando a fenda estreita no paredão de arenito para o interior reluzente de um Geodo de Cristais!",
          reward: "Geodo Descoberto (+120 XP)",
        };
      if (o.prop.kind === "geode_exit_fissure")
        return {
          success: !0,
          action: "exit_geode",
          targetTx: o.prop.targetTx !== undefined ? o.prop.targetTx : t,
          targetTy: o.prop.targetTy !== undefined ? o.prop.targetTy : l,
          message:
            "Saindo pela fenda cristalina do geodo de volta aos túneis de arenito do deserto!",
          reward: "Retorno à Caverna de Arenito",
        };
      if (o.prop.kind === "tardigrade_egg") {
        if (m.opened) {
          return {
            success: !1,
            message: "Estas cascas de ovos de tardígrado já estão vazias e secas.",
          };
        }
        this.interactedProps.set(u, { ...m, opened: !0, collected: !0 });
        this.invalidateTile(t, l);

        const eggItem = {
          id: `item_ovo_tardigrado_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: "Ovo Criptobiótico de Tardígrado",
          categoryType: "consumable",
          isEquippable: !1,
          rarity: "raro",
          value: 70,
          stackCount: 1,
          icon: "sparkles",
          color: "#f59e0b",
          description:
            "Ovo esférico translúcido e dourado recolhido do ninho das cavernas do deserto. Rico em trealose e gel nutritivo (+50 Vida, +50 Stamina e proteção celular ao consumir).",
        };

        let hatched = !1;
        if (
          Math.random() < 0.38 &&
          typeof window !== "undefined" &&
          window.__gameEngine &&
          window.__gameEngine.creaturesManager &&
          typeof window.__gameEngine.creaturesManager.spawnBabyTardigradeAt === "function"
        ) {
          window.__gameEngine.creaturesManager.spawnBabyTardigradeAt(
            t * this.tileSize + 16,
            l * this.tileSize + 16,
          );
          hatched = !0;
        }

        return {
          success: !0,
          action: "collect_tardigrade_egg",
          item: eggItem,
          hatched: hatched,
          message: hatched
            ? "🐣 Ao tocar nos ovos, você colheu uma amostra, mas outro filhote de tardígrado acabou de eclodir na sua frente e começou a correr pelas areias do ninho!"
            : "🥚 Você recolheu com cuidado um Ovo Criptobiótico de Tardígrado translúcido para seu inventário!",
          reward: "Ovo de Tardígrado (+60 XP)",
        };
      }
      if (o.prop.kind === "dungeon_staircase_down")
        return {
          success: !0,
          action: "enter_dungeon",
          entranceTx: t,
          entranceTy: l,
          message: "Descendo a escadaria úmida para as masmorras e calabouços...",
          reward: "Calabouço Descoberto (+150 XP)",
        };
      if (o.prop.kind === "dungeon_staircase_up")
        return {
          success: !0,
          action: "exit_dungeon",
          targetTx: o.prop.targetTx !== undefined ? o.prop.targetTx : t,
          targetTy: o.prop.targetTy !== undefined ? o.prop.targetTy : l,
          message: "Subindo os degraus de pedra de volta aos salões do subsolo!",
          reward: "Retorno ao Subsolo",
        };
      if (o.prop.kind === "iron_bars_gate") {
        const pKey = this.undergroundLevel === 2 ? `dungeon_${t},${l}` : u;
        const prev = this.interactedProps.get(pKey) || m;
        const isLocked = !o.prop.opened && o.prop.defaultOpened === false && !prev.unlocked && !o.prop.unlocked;
        if (isLocked) {
          return {
            success: !1,
            action: "locked_cell",
            tx: t,
            ty: l,
            message: "🔒 Esta cela está trancada com um pesado cadeado de ferro! Você precisa da Chave do Carcereiro (na Sala de Administração dos Oficiais ou no Posto do Carcereiro) para destrancá-la.",
            reward: "Cela Trancada",
          };
        }
        const nextOpen = !o.prop.opened;
        this.interactedProps.set(pKey, { ...prev, opened: nextOpen });
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "toggle_gate",
          message: nextOpen ? "🔓 Você abriu o portão de grades de ferro da cela." : "🔒 Você fechou o portão de grades de ferro da cela.",
          reward: "",
        };
      }
      if (o.prop.kind === "dungeon_door") {
        const nextOpen = !o.prop.opened;
        const pKey = this.undergroundLevel === 2 ? `dungeon_${t},${l}` : u;
        const prev = this.interactedProps.get(pKey) || m;
        this.interactedProps.set(pKey, { ...prev, opened: nextOpen });
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "dungeon_door",
          message: nextOpen ? "🚪 Porta do subsolo aberta." : "🚪 Porta do subsolo fechada.",
          reward: "",
        };
      }
      if (o.prop.kind === "barracks_gallows") {
        return {
          success: !0,
          message: "🪢 Você inspecionou o Cadafalso e a Forca do Pátio de Execução: a trave de carvalho maciço sustenta dois laços de corda sobre o alçapão de ferro.",
          reward: "Pátio de Execução (+45 XP)",
        };
      }
      if (o.prop.kind === "barracks_officer_desk") {
        return {
          success: !0,
          message: "🗺️ Você examinou a Mesa de Comando dos Oficiais: planos estratégicos da guarnição, listas de prisioneiros das grandes celas e ordens assinadas pelo Comandante.",
          reward: "Documentos Militares (+50 XP)",
        };
      }
      if (o.prop.kind === "prison_bunk_bed") {
        return {
          success: !0,
          message: "🛏️ Beliches triplos de madeira bruta amontoados na grande cela coletiva do campo de prisioneiros.",
          reward: "",
        };
      }
      if (o.prop.kind === "torture_rack") {
        return {
          success: !0,
          message: "O cavalete de estiramento range com suas manivelas dentadas, manoplas de ferro e manchas sombrias de sangue antigo.",
          reward: "Horror do Passado (+50 XP)",
        };
      }
      if (o.prop.kind === "iron_maiden") {
        return {
          success: !0,
          message: "A pesada porta da donzela de ferro revela dezenas de espinhos pontiagudos projetados para supliciar quem entrasse.",
          reward: "Donzela Inspecionada (+60 XP)",
        };
      }
      if (o.prop.kind === "hanging_cage") {
        return {
          success: !0,
          message: "A gaiola de ferro suspensa balança suavemente no teto abobadado, guardando restos mortais seculares.",
          reward: "Ossadas Examinadas (+40 XP)",
        };
      }
      if (o.prop.kind === "torture_brazier") {
        return {
          success: !0,
          message: "O braseiro de tortura estala com brasas rubras e ferros compridos de marcar a brasa aquecendo entre as chamas.",
          reward: "Calor Abrasador",
        };
      }
      if (o.prop.kind === "torture_tools") {
        return {
          success: !0,
          message: "Mesa ensanguentada com tenazes de ferro, pinças, serras e chicotes usados nos interrogatórios da masmorra.",
          reward: "Instrumentos Antigos (+30 XP)",
        };
      }
      if (o.prop.kind === "dungeon_latrine_pit") {
        return {
          success: !0,
          message: "Uma lufada fétida e úmida emana do fosso de dejetos escavado no chão de rocha com grades de escoamento enferrujadas.",
          reward: "Odor Nauseante",
        };
      }
      if (o.prop.kind === "dungeon_latrine_bench") {
        return {
          success: !0,
          message: "Antigos assentos de latrina de alvenaria talhados para os prisioneiros e guardas das masmorras.",
          reward: "Ambiente Rústico",
        };
      }
      if (o.prop.kind === "jailer_table") {
        const pKey = `dungeon_${t},${l}`;
        const hasKey = !!m.collectedKey;
        this.interactedProps.set(pKey, { ...m, collectedKey: !0 });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "collect_jailer_key",
          alreadyCollected: hasKey,
          message: hasKey
            ? "A mesa do carcereiro guarda o livro de registros com nomes de antigos prisioneiros esquecidos."
            : "Você revistou a mesa do carcereiro e pegou o pesado Molho de Chaves do Carcereiro! Agora você pode destrancar as celas da prisão.",
          reward: hasKey ? "Registros do Carcereiro" : "Chave do Carcereiro (+60 XP)",
        };
      }
      if (o.prop.kind === "weapon_rack") {
        return {
          success: !0,
          message: "Suporte de madeira carcomida com alabardas pontiagudas e espadas curtas enferrujadas dos guardas da masmorra.",
          reward: "Armas Antigas (+40 XP)",
        };
      }
      if (o.prop.kind === "dungeon_skeleton") {
        return {
          success: !0,
          message: "Restos mortais de um prisioneiro cujos pulsos ainda permanecem presos a grilhões chumbados na rocha.",
          reward: "Vítima das Masmorras (+30 XP)",
        };
      }
      if (o.prop.kind === "dungeon_straw") {
        return {
          success: !0,
          message: "Um monte de palha mofada e úmida servindo de leito desconfortável nas celas frias do calabouço.",
          reward: "Palha Úmida",
        };
      }
      if (o.prop.kind === "bone_pile") {
        return {
          success: !0,
          message: "Montes de ossos antigos, crânios humanos e ossadas de feras misteriosas acumulados no fundo da caverna ao longo de séculos.",
          reward: "Ossada Ancestral (+45 XP)",
        };
      }
      if (o.prop.kind === "pedregulhos") {
        return {
          success: !0,
          message: "Pilhas de pedregulhos e cascalho pontiagudo amontoados durante a escavação das muralhas de cantaria do calabouço.",
          reward: "Cascalho da Escavação",
        };
      }
      if (o.prop.kind === "crystal_cluster") {
        if (m.opened)
          return {
            success: !1,
            message: "Esta formação de cristais já foi minerada.",
          };
        (this.interactedProps.set(u, { ...m, opened: !0 }),
          this.invalidateTile(t, l),
          this.minedCrystals++);
        const f = [
            "Ametista Radiante",
            "Safira Estelar",
            "Rubi Ígneo",
            "Esmeralda das Profundezas",
          ],
          g = f[o.prop.subType % f.length];
        return {
          success: !0,
          action: "mine_crystal",
          message: `Você minerou ${g}! Os cristais resplandecem no seu inventário.`,
          reward: `${g} (+80 XP)`,
        };
      }
      if (o.prop.kind === "ore_vein") {
        if (m.opened)
          return { success: !1, message: "Este veio mineral já foi extraído." };
        (this.interactedProps.set(u, { ...m, opened: !0 }),
          this.invalidateTile(t, l));
        const f = [
            "Pepita de Ouro Puro",
            "Minério de Mitril Raro",
            "Cristal de Ferro Puro",
          ],
          g = f[o.prop.subType % f.length];
        return {
          success: !0,
          action: "mine_ore",
          message: `Você extraiu ${g} da rocha maciça!`,
          reward: `${g} (+60 XP)`,
        };
      }
      if (o.prop.kind === "glowing_mushroom")
        return {
          success: !0,
          action: "harvest_mushroom",
          message:
            "O cogumelo bioluminescente expeliu uma nuvem de esporos restauradores!",
          reward: "Esporos Místicos (+50 Stamina)",
        };
      if (o.prop.kind === "luminous_algae")
        return {
          success: !0,
          action: "harvest_mushroom",
          message:
            "As algas luminosas do lago do geodo liberaram essência bioluminescente revigorante nas águas!",
          reward: "Essência Bioluminescente (+50 Stamina)",
        };
      if (o.prop.kind === "blue_plant") {
        const hasFlowered = this.isNight() || !!m.bluePlantFlowered;
        this.interactedProps.set(u, {
          ...m,
          collected: true,
          collectedNight: this.nightCount,
          bluePlantFlowered: hasFlowered,
        });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "harvest_blue_plant",
          flowered: hasFlowered,
          message: hasFlowered
            ? "Você colheu a Flor Azul do Luar, aberta sob a luz da noite!"
            : "Você colheu o Ramo Azul antes que a planta florescesse.",
          reward: hasFlowered ? "Flor Azul do Luar (+80 XP)" : "Ramo Azul (+35 XP)",
        };
      }
      if (o.prop.kind === "clay_deposit") {
        const f = m.harvestCount ?? 0;
        if (f >= 3)
          return {
            success: !1,
            message:
              "Este ponto de argila foi temporariamente esgotado. A água e a lama da lagoa precisam de tempo para assentar novos sedimentos minerais.",
          };
        const g = f + 1;
        return (
          this.interactedProps.set(u, {
            ...m,
            harvestCount: g,
            opened: g >= 3,
          }),
          this.invalidateTile(t, l),
          {
            success: !0,
            action: "harvest_clay",
            message:
              "Você extraiu porções de Argila Úmida pura do leito da lagoa!",
            reward: "Argila Úmida (+35 XP)",
          }
        );
      }
      if (o.prop.kind === "drying_clay") {
        const f = o.prop.dryingItemType || "pote",
          g = o.prop.dryingStartTime || Date.now(),
          y = o.prop.dryingDurationMs || 12e4,
          w = Date.now() - g,
          v = y - w;
        if (v > 0) {
          const S = Math.ceil(v / 1e3),
            p = Math.floor(S / 60),
            j = S % 60;
          return {
            success: !1,
            action: "clay_still_drying",
            message: `⏳ ${o.prop.namePt || "Peça de Barro"} ainda está secando ao sol! Faltam ${p}m ${j < 10 ? "0" : ""}${j}s para curar e se tornar coletável.`,
          };
        }
        this.removeProp(t, l);
        const T =
          ((c = o.prop.namePt) == null
            ? void 0
            : c.replace(" (Secando ao Sol)", "")) ||
          (f === "frasco"
            ? "Frasco de Barro"
            : f === "caldeirao"
              ? "Caldeirão de Barro Vazio"
              : "Pote de Barro Vazio");
        return {
          success: !0,
          action: "collect_dried_clay",
          dryingItemType: f,
          message: `✨ Você recolheu [${T}] perfeitamente seco e pronto para uso!`,
          reward: `${T} Seco e Coletado`,
        };
      }
      if (o.prop.kind === "wood_log") {
        const count = o.prop.count || 1;
        if (count > 1) {
          o.prop.count = count - 1;
          o.prop.namePt = o.prop.count > 1 ? `Pilha de Troncos (${o.prop.count})` : "Tronco de Madeira";
          o.prop.descriptionPt = o.prop.count >= 5
            ? `Pilha com ${o.prop.count} troncos no chão. Pressione [C] ou toque em CABANA para construir uma cabana, ou [F] para recolher.`
            : o.prop.count > 1
              ? `Pilha com ${o.prop.count} troncos de madeira robustos no chão. Pressione [F] para recolher.`
              : "Tronco robusto de árvore cortada colocado no chão. Pressione [F] para recolher à mochila.";
          this.invalidateTile(t, l);
        } else {
          this.removeProp(t, l);
        }
        return {
          success: !0,
          action: "collect_wood_log",
          message: count > 1
            ? `🪵 Você recolheu 1 Tronco de Madeira da pilha! (Restam ${count - 1} no chão)`
            : "🪵 Você recolheu o Tronco de Madeira do chão para seu inventário!",
          reward: "Tronco Recolhido (+15 XP)",
        };
      }
      if (o.prop.kind === "miner_cart")
        return {
          success: !0,
          message:
            "Você examinou o antigo vagão de mineração e encontrou ferramentas antigas e pedras brilhantes!",
          reward: "Relíquia de Minerador (+40 XP)",
        };
      if (o.prop.kind === "chest") {
        if (m.opened)
          return { success: !1, message: "Este baú já foi saqueado!" };
        (this.interactedProps.set(u, { ...m, opened: !0 }),
          this.invalidateTile(t, l));
        const f = [
          "Rubi Ancestral (+250 XP)",
          "Poção de Vigor Máximo (+100 Stamina)",
          "Moedas de Ouro Douradas (+150 Gold)",
          "Amuleto dos Ventos (+Velocidade)",
          "Pedaço de Mapa Antigo (+Exploração)",
        ];
        return {
          success: !0,
          message: "Baú de Relíquias aberto!",
          reward: f[Math.floor(Math.random() * f.length)],
        };
      }
      if (o.prop.kind === "shrine")
        return (
          this.interactedProps.set(u, { ...m, activated: !0 }),
          this.invalidateTile(t, l),
          {
            success: !0,
            message:
              "Bênção dos Cristais ativada! Sua velocidade e visão aumentaram!",
            reward: "Bênção Radiante (+Speed & Luz)",
          }
        );
      if (o.prop.kind === "campfire") {
        if (o.prop.lit === !1)
          return {
            success: !0,
            action: "unlit_campfire",
            message:
              "Esta fogueira está apagada. Use 2 Pederneiras para acendê-la com faíscas!",
            reward: "Fogueira Apagada",
          };
        if (o.prop.roastingFish) {
          const f = o.prop.roastingFish,
            g = Date.now() - f.startTime;
          if (g >= f.durationMs)
            return {
              success: !0,
              action: "collect_roasted_fish",
              roastedFish: this.collectRoastedFish(t, l),
              message: `🍢 Seu ${f.fishItem.name} assou perfeitamente no espeto sobre as brasas! Está dourado, suculento e pronto.`,
              reward: `${f.fishItem.name} Assado no Espeto`,
            };
          {
            const y = Math.ceil((f.durationMs - g) / 1e3);
            return {
              success: !1,
              action: "fish_still_roasting",
              message: `⏳ ${f.fishItem.name} está assando na brasa no espeto! Faltam ${y}s para ficar no ponto suculento.`,
            };
          }
        }
        if (o.prop.cookingPot) {
          const f = o.prop.cookingPot,
            g = Date.now() - f.startTime;
          if (g >= 45e3)
            return {
              success: !0,
              action: "collect_cooked_meal",
              cookedMeal: this.finishCooking(t, l),
              message: "🍲 A refeição ficou pronta na panela sobre o fogo!",
              reward: "Prato Cozinhado",
            };
          {
            const y = Math.ceil((45e3 - g) / 1e3);
            return {
              success: !1,
              action: "meal_cooking",
              message: `⏳ A ${(f.potItem || {}).name || "panela"} está cozinhando no fogo! Faltam ${y}s. Use [Q] para adicionar ingredientes.`,
            };
          }
        }
        if (o.prop.roastingFishPending) {
          const f = o.prop.roastingFishPending;
          return (
            delete o.prop.roastingFishPending,
            this.customPlacedProps.has(
              `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
            ) &&
              delete this.customPlacedProps.get(
                `${this.isUnderground ? "cave_" : "surf_"}${t},${l}`,
              ).roastingFishPending,
            this.invalidateTile(t, l),
            {
              success: !0,
              action: "start_roast_now",
              fishName: f.fishItem.name,
              message: "",
            }
          );
        }
        return {
          success: !0,
          action: "rest_campfire",
          message:
            "Você descansou junto à fogueira. Saúde e vigor completamente restaurados!",
          reward: "Descanso Revigorante",
        };
      }
      if (o.prop.kind === "corridor_torch") {
        if (o.prop.lit) {
          return {
            success: !0,
            message: "",
            reward: "",
          };
        }
        return {
          success: !0,
          action: "unlit_corridor_torch",
          message: "",
        };
      }
      if (o.prop.kind === "wooden_chest") {
        const items = Array.isArray(o.prop.storageItems) ? o.prop.storageItems : [];
        return {
          success: !0,
          action: "open_wooden_chest",
          tx: t,
          ty: l,
          chestProp: o.prop,
          storageItems: items,
          maxSlots: o.prop.maxSlots || 12,
          message: `📦 Baú de Madeira aberto (${items.length}/${o.prop.maxSlots || 12} slots ocupados).`,
          reward: "",
        };
      }
      if (o.prop.kind === "cabin_door") {
        const nextOpen = !o.prop.opened;
        o.prop.opened = nextOpen;
        this.placeProp(t, l, { ...o.prop, opened: nextOpen });
        if (this.playerCabins) {
          const cab = this.playerCabins.find((c) => c.id === o.prop.cabinId || (c.doorTx === t && c.doorTy === l));
          if (cab) cab.doorOpened = nextOpen;
        }
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "cabin_door",
          message: nextOpen ? "🚪 Você abriu a porta de madeira da cabana." : "🚪 Você fechou a porta da cabana.",
          reward: "",
        };
      }
      if (o.prop.kind === "greek_door") {
        const nextOpen = !o.prop.opened;
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "greek_door",
          message: "",
          reward: "",
        };
      }
      if (o.prop.kind === "desert_city_door") {
        const nextOpen = !o.prop.opened;
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "desert_city_door",
          message: nextOpen ? "🚪 Você abriu a porta da casa de adobe." : "🚪 Você fechou a porta contra o vento e areia do deserto.",
          reward: "",
        };
      }
      if (o.prop.kind === "desert_city_mat") {
        return {
          success: !0,
          action: "desert_city_mat",
          message: "🛏️ Você descansou na esteira fresca de palha trançada à sombra da casa de adobe. Vigor e energia restaurados!",
          reward: "",
        };
      }
      if (o.prop.kind === "desert_city_pots") {
        return {
          success: !0,
          action: "desert_city_pots",
          message: "🏺 Potes de cerâmica com provisões frescas: água mantida fresca na sombra, tâmaras secas doces e grãos.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_door") {
        const nextOpen = !o.prop.opened;
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "snow_city_door",
          message: nextOpen ? "🚪 Você abriu a porta do chalé." : "🚪 Você fechou a porta contra o vento dos picos.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_fireplace") {
        return {
          success: !0,
          message: "🔥 Lareira aconchegante com lenha estalando e chamas ardentes! A fumaça sobe pela chaminé.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_chimney") {
        return {
          success: !0,
          message: "💨 Chaminé sólida de pedras da montanha, expelindo fumaça aquecida no ar gelado dos picos.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_stove") {
        return {
          success: !0,
          message: "🍲 Fogão a lenha de ferro fundido com ensopado quente de inverno na cozinha.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_bathtub") {
        return {
          success: !0,
          message: "🛁 Tina de madeira nórdica com água aquecida para um banho revigorante nos picos gelados.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_bed") {
        return {
          success: !0,
          message: "🛏️ Cama nórdica com cobertor grosso e forro de pele de lã para descansar e se aquecer.",
          reward: "",
        };
      }
      if (o.prop.kind === "snow_city_monument" || o.prop.kind === "snow_city_monument_collider") {
        return {
          success: !0,
          action: "rest_campfire",
          message: "🔥 Você se aqueceu junto à Grande Fogueira Monumental da Praça dos Picos Gelados! Saúde e vigor restaurados.",
          reward: "Calor da Grande Fogueira (+HP / Vigor)",
        };
      }
      if (o.prop.kind === "snow_city_bench") {
        return {
          success: !0,
          action: "rest_campfire",
          message: "🪑 Você sentou no banco da praça de frente para a grande fogueira e descansou ao calor das chamas!",
          reward: "Descanso na Praça (+HP / Vigor)",
        };
      }
      if (o.prop.kind === "port_city_door") {
        const nextOpen = !o.prop.opened;
        this.interactedProps.set(u, { ...m, opened: nextOpen });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "port_city_door",
          message: nextOpen ? "🚪 Você abriu a porta da casa costeira." : "🚪 Você fechou a porta contra a brisa do mar.",
          reward: "",
        };
      }
      if (o.prop.kind === "port_city_hammock") {
        return {
          success: !0,
          action: "rest_campfire",
          message: "🛌 Você deitou na rede de algodão trançado ao som suave das ondas da praia tropical! Saúde e vigor restaurados.",
          reward: "Descanso na Rede (+HP / Vigor)",
        };
      }
      if (o.prop.kind === "port_city_table") {
        return {
          success: !0,
          message: "🍹 Mesa rústica com abacaxis frescos, cocos verdes gelados e peixe grelhado na folha de bananeira.",
          reward: "Banquete Tropical (+35 XP)",
        };
      }
      if (o.prop.kind === "port_city_cargo" || o.prop.kind === "port_city_crates") {
        return {
          success: !0,
          message: "📦 Baú de marinheiro, barris de carvalho com rum tropical, cordas navais e especiarias recém-desembarcadas no porto.",
          reward: "Suprimentos Portuários (+30 XP)",
        };
      }
      if (o.prop.kind === "port_city_monument" || o.prop.kind === "port_city_fountain" || o.prop.kind === "port_city_lighthouse") {
        return {
          success: !0,
          action: "rest_campfire",
          message: "⚓ Você descansou junto ao Farol Portuário & Monumento da Grande Âncora no coração da Cidade Portuária! Saúde e vigor restaurados.",
          reward: "Brisa Marítima (+HP / Vigor)",
        };
      }
      if (o.prop.kind === "port_city_bench") {
        return {
          success: !0,
          action: "rest_campfire",
          message: "🪑 Você sentou no banco do calçadão admirando as embarcações ancoradas entre a praia tropical e o oceano!",
          reward: "Descanso à Beira-Mar (+HP / Vigor)",
        };
      }
      if (o.prop.kind === "port_city_lamppost") {
        return {
          success: !0,
          message: "🏮 Lampião portuário de bronze com chama protegida do vento marítimo para guiar os marinheiros no cais.",
          reward: "",
        };
      }
      if (o.prop.kind === "port_city_bollard") {
        return {
          success: !0,
          message: "⚓ Cabeço de amarração de ferro fundido e madeira naval com grossos cabos segurando as embarcações no píer.",
          reward: "",
        };
      }
      if (o.prop.kind === "port_city_boat_mast" || o.prop.kind === "port_city_ship_mast") {
        return {
          success: !0,
          message: "⛵ Mastro principal da embarcação à vela com gávea de vigia, cordame de cânhamo e velas enfunadas pela brisa do oceano!",
          reward: "Mastro da Embarcação (+40 XP)",
        };
      }
      if (o.prop.kind === "port_city_boat_helm" || o.prop.kind === "port_city_ship_wheel") {
        return {
          success: !0,
          message: "☸️ Você segurou o timão de madeira nobre e latão no convés de comando do navio, olhando para o oceano aberto!",
          reward: "Timão do Capitão (+50 XP)",
        };
      }
      if (o.prop.kind === "port_city_boat") {
        return {
          success: !0,
          message: `⛵ Você examinou ${o.prop.namePt || "a embarcação costeira"}: casco de madeira calafetada flutuando nas águas da baía tropical!`,
          reward: "Embarcação Inspecionada (+45 XP)",
        };
      }
      if (o.prop.kind === "greek_statue") {
        return {
          success: !0,
          message:
            'Inscrição no pedestal da estátua: "Conhece-te a ti mesmo — nada em excesso. A sabedoria da Pólis vive no mármore eterno."',
          reward: "Inspiração Helênica (+75 XP)",
        };
      }
      if (o.prop.kind === "greek_vase") {
        if (m.collected) {
          return {
            success: !1,
            message: "Este jarro já foi recolhido das ruínas.",
          };
        }
        const vType = o.prop.subType || 0;
        let itemData;
        if (vType === 0) {
          itemData = {
            id: `item_anfora_grega_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Ânfora Grega Antiga",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "incomum",
            value: 65,
            stackCount: 1,
            icon: "🏺",
            color: "#ea580c",
            description: "Ânfora cerâmica clássica de figuras negras coletada nas ruínas. Pode ser usada na beira da água para coletar água fresca (+75 Stamina ao beber), armazenar azeite ou usar em receitas.",
          };
        } else if (vType === 1) {
          itemData = {
            id: `item_cratera_grega_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Cratera de Cerâmica das Ruínas",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "raro",
            value: 80,
            stackCount: 1,
            icon: "🏺",
            color: "#d97706",
            description: "Grande vaso cerâmico de banquete das ruínas helênicas. Excelente recipiente para coletar água pura (+90 Stamina ao beber) ou preparar infusões.",
          };
        } else {
          itemData = {
            id: `item_jarro_ruinas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Pote de Terracota das Ruínas",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "comum",
            value: 50,
            stackCount: 1,
            icon: "🏺",
            color: "#c2410c",
            description: "Jarro e pote resistente de terracota recolhido das ruínas antigas. Pode ser levado à água para coletar água fresca (+60 Stamina ao beber) ou guardar líquidos.",
          };
        }

        this.interactedProps.set(u, { ...m, collected: !0, opened: !0 });
        this.invalidateTile(t, l);
        return {
          success: !0,
          action: "collect_greek_vase",
          item: itemData,
          message: `🏺 Você recolheu: ${itemData.name}! O item foi adicionado ao seu inventário.`,
          reward: `${itemData.name} (+55 XP)`,
        };
      }
      if (o.prop.kind === "greek_bookshelf") {
        const pKey = this.isUnderground ? `underground_${t},${l}` : `${t},${l}`;
        const prev = this.interactedProps.get(pKey) || {};
        const booksTaken = typeof prev.booksTaken === "number" ? prev.booksTaken : (prev.collected ? 4 : 0);
        const maxBooks = 4;
        if (booksTaken >= maxBooks || prev.collected) {
          return {
            success: !1,
            message: "Todos os livros e tomos desta estante antiga já foram recolhidos.",
          };
        }
        const bType = o.prop.subType || 0;
        let bookKey;
        if (bType === 0) {
          const keys = ["culinaria_vol1", "culinaria_vol2", "itens_basicos", "armas_e_equipamentos"];
          bookKey = keys[booksTaken % keys.length];
        } else if (bType === 1) {
          const keys = ["itens_basicos", "armas_e_equipamentos", "catalogo_itens", "geografia_biomas"];
          bookKey = keys[booksTaken % keys.length];
        } else if (bType === 2) {
          const keys = ["geografia_biomas", "catalogo_itens", "culinaria_vol1", "culinaria_vol2"];
          bookKey = keys[booksTaken % keys.length];
        } else {
          const keys = ["armas_e_equipamentos", "itens_basicos", "catalogo_itens", "geografia_biomas"];
          bookKey = keys[booksTaken % keys.length];
        }

        let bookItem = (window.Game && window.Game.BooksAndScrolls && typeof window.Game.BooksAndScrolls.createItem === "function")
          ? window.Game.BooksAndScrolls.createItem(bookKey)
          : null;

        if (!bookItem) {
          bookItem = {
            id: `item_livro_${bookKey}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Tomo Antigo Preservado",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "raro",
            value: 120,
            stackCount: 1,
            maxStack: 1,
            isStackable: !1,
            icon: "📖",
            color: "#818cf8",
            description: "Tomo clássico preservado nas ruínas. Não empilhável. [Ler] para folhear.",
          };
        }

        const newTaken = booksTaken + 1;
        const isAllDone = newTaken >= maxBooks;
        this.interactedProps.set(pKey, { ...prev, booksTaken: newTaken, collected: isAllDone });
        this.invalidateTile(t, l);

        return {
          success: !0,
          action: "collect_bookshelf",
          item: bookItem,
          reward: `${bookItem.name} (+80 XP)`,
        };
      }
      if (o.prop.kind === "greek_scroll_stand") {
        const pKey = this.isUnderground ? `underground_${t},${l}` : `${t},${l}`;
        const prev = this.interactedProps.get(pKey) || {};
        const scrollsTaken = typeof prev.scrollsTaken === "number" ? prev.scrollsTaken : (prev.collected ? 2 : 0);
        const maxScrolls = 2;
        if (scrollsTaken >= maxScrolls || prev.collected) {
          return {
            success: !1,
            message: "Todos os pergaminhos deste suporte de estudos já foram recolhidos.",
          };
        }
        const sType = o.prop.subType || 0;
        let scrollKey;
        if (sType === 0) {
          const keys = ["ferramentas_primitivas", "pergaminho_runico_misterio"];
          scrollKey = keys[scrollsTaken % keys.length];
        } else if (sType === 1) {
          const keys = ["pergaminho_runico_misterio", "ferramentas_primitivas"];
          scrollKey = keys[scrollsTaken % keys.length];
        } else {
          const keys = ["ferramentas_primitivas", "pergaminho_runico_misterio"];
          scrollKey = keys[scrollsTaken % keys.length];
        }

        let scrollItem = (window.Game && window.Game.BooksAndScrolls && typeof window.Game.BooksAndScrolls.createItem === "function")
          ? window.Game.BooksAndScrolls.createItem(scrollKey)
          : null;

        if (!scrollItem) {
          scrollItem = {
            id: `item_pergaminho_${scrollKey}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: "Pergaminho de Papiro Antigo",
            categoryType: "consumable",
            isEquippable: !1,
            rarity: "raro",
            value: 120,
            stackCount: 1,
            maxStack: 1,
            isStackable: !1,
            icon: "📜",
            color: "#facc15",
            description: "Pergaminho preservado com antigas escrituras. Não empilhável. [Ler] para desenrolar.",
          };
        }

        const newScrollsTaken = scrollsTaken + 1;
        const isAllDone = newScrollsTaken >= maxScrolls;
        this.interactedProps.set(pKey, { ...prev, scrollsTaken: newScrollsTaken, collected: isAllDone });
        this.invalidateTile(t, l);

        return {
          success: !0,
          action: "collect_scroll_stand",
          item: scrollItem,
          reward: `${scrollItem.name} (+80 XP)`,
        };
      }
      if (o.prop.kind === "greek_furniture") {
        return {
          success: !0,
          message:
            "Você examinou o mobiliário helênico: divãs Kline de banquete, mesas Trapeza e assentos esculpidos onde cidadãos e filósofos debatiam.",
          reward: "Cultura da Pólis (+50 XP)",
        };
      }
      if (o.prop.kind === "greek_unfinished") {
        return {
          success: !0,
          message:
            "Você examinou o canteiro de obras inacabado: blocos de mármore com tenões de içamento, cinzéis de bronze e o guindaste Polyspastos!",
          reward: "Engenharia Helênica (+60 XP)",
        };
      }
      return o.prop.kind === "ruin_pillar"
        ? {
            success: !0,
            message:
              'Você decifrou a inscrição do pilar: "O mundo é infinito para aqueles de coração aventureiro."',
            reward: "Sabedoria Ancestral (+50 XP)",
          }
        : null;
    }
    chopTreeAt(t, l, hasAxe = true) {
      const tile = this.getTile(t, l);
      if (!tile || !tile.prop) return null;
      const k = tile.prop.kind;
      if (
        k === "tree_oak" ||
        k === "tree_pine" ||
        k === "tree_palm" ||
        k === "tree_willow" ||
        k === "tree_burnt"
      ) {
        return this.interactWithTile(t, l, { hasAxe });
      }
      return null;
    }
    isTileCreaturePassable(t, l) {
      const o = this.getTile(t, l);
      if (!o) return !1;
      // Proíbe criaturas de andarem nos paredões (isCliffWall) da montanha!
      if (o.isCliffWall) return !1;
      if (!this.isTilePassable(t, l)) return !1;
      if (this.isUnderground && (o.biome.id === BiomeId.CAVE_WALL || o.biome.id === BiomeId.DESERT_CAVE_WALL || (o.biome && !o.biome.passable))) return !1;
      return !0;
    }
    isTilePassable(t, l) {
      const o = this.getTile(t, l);
      if (!o) return !1;
      if (this.isUnderground && (o.biome.id === BiomeId.CAVE_WALL || o.biome.id === BiomeId.DESERT_CAVE_WALL || (o.biome && !o.biome.passable))) return !1;
      if (!this.isUnderground && o.biome && !o.biome.passable && !o.isPortPier && !o.isPortBoatDeck) return !1;
      if (o && o.isGreekWall) return !1;
      if (o && o.isGreekDoor && !o.isGreekDoorOpen) return !1;
      if (o && o.isSnowCityWall) return !1;
      if (o && o.isSnowCityCollider) return !1;
      if (o && o.isSnowCityDoor && !o.isSnowCityDoorOpen) return !1;
      if (o && o.isDesertCityWall) return !1;
      if (o && o.isDesertCityCollider) return !1;
      if (o && o.isDesertCityDoor && !o.isDesertCityDoorOpen) {
        const isDoorOpenByNpc = !!(
          typeof window !== "undefined" &&
          window.DesertCity &&
          typeof window.DesertCity.isDoorwayUsedByCitizen === "function" &&
          window.DesertCity.isDoorwayUsedByCitizen(t, l)
        );
        if (!isDoorOpenByNpc) return !1;
      }
      if (o && o.isPortCityWall) return !1;
      if (o && o.isPortCityCollider) return !1;
      if (o && o.isPortCityDoor && !o.isPortCityDoorOpen) {
        const isDoorOpenByNpc = !!(
          typeof window !== "undefined" &&
          window.PortCity &&
          typeof window.PortCity.isDoorwayUsedByCitizen === "function" &&
          window.PortCity.isDoorwayUsedByCitizen(t, l)
        );
        if (!isDoorOpenByNpc) return !1;
      }
      if (
        o &&
        o.prop &&
        (o.prop.kind === "snow_city_chimney" ||
          o.prop.kind === "snow_city_fireplace" ||
          o.prop.kind === "snow_city_bathtub" ||
          o.prop.kind === "snow_city_bed" ||
          o.prop.kind === "snow_city_stove" ||
          o.prop.kind === "snow_city_monument" ||
          o.prop.kind === "snow_city_monument_collider" ||
          o.prop.kind === "snow_city_bench" ||
          o.prop.kind === "snow_city_lamppost")
      )
        return !1;
      if (o && o.isDungeonWall) return !1;
      if (o && o.isDungeonDoor && !o.isDungeonDoorOpen) return !1;
      if (o && o.isIronBars && !o.isIronBarsOpen) return !1;
      if (
        o &&
        o.prop &&
        (o.prop.kind === "torture_rack" ||
          o.prop.kind === "iron_maiden" ||
          o.prop.kind === "dungeon_latrine_pit" ||
          o.prop.kind === "jailer_table" ||
          o.prop.kind === "weapon_rack" ||
          o.prop.kind === "bone_pile" ||
          o.prop.kind === "greek_bookshelf")
      )
        return !1;
      // Permite subir e andar livremente em cima de todo o paredão (isCliffWall)!
      const southTile = this.getTile(t, l + 1);
      if (
        southTile &&
        southTile.prop &&
        (southTile.prop.kind === "cave_entrance" ||
          southTile.prop.kind === "cave_exit" ||
          southTile.prop.kind === "large_rock")
      )
        return !1;
      return !0;
    }
    getCabinWallSide(t) {
      if (!t || !t.prop || t.prop.kind !== "cabin_wall") return null;
      if (t.prop.wallSide) return t.prop.wallSide;
      if (this.playerCabins && t.prop.cabinId) {
        const c = this.playerCabins.find((cb) => cb.id === t.prop.cabinId);
        if (c) {
          const isLeft = t.tx === c.originTx;
          const isRight = t.tx === c.originTx + c.width - 1;
          const isTop = t.ty === c.originTy;
          const isBottom = t.ty === c.originTy + c.height - 1;
          return isTop && isLeft
            ? "nw"
            : isTop && isRight
              ? "ne"
              : isBottom && isLeft
                ? "sw"
                : isBottom && isRight
                  ? "se"
                  : isTop
                    ? "north"
                    : isBottom
                      ? "south"
                      : isLeft
                        ? "west"
                        : "east";
        }
      }
      const isCS = (tile) =>
        !!(tile && tile.prop && (tile.prop.kind === "cabin_wall" || tile.prop.kind === "cabin_door"));
      const isFloor = (tile) => !!(tile && tile.prop && tile.prop.kind === "cabin_floor");
      const tL = this.getTile(t.tx - 1, t.ty);
      const tR = this.getTile(t.tx + 1, t.ty);
      const tT = this.getTile(t.tx, t.ty - 1);
      const tB = this.getTile(t.tx, t.ty + 1);
      const nL = isCS(tL), nR = isCS(tR), nT = isCS(tT), nB = isCS(tB);
      if (nR && nB && !nL && !nT) return "nw";
      if (nL && nB && !nR && !nT) return "ne";
      if (nR && nT && !nL && !nB) return "sw";
      if (nL && nT && !nR && !nB) return "se";
      if (isFloor(tB)) return "north";
      if (isFloor(tT)) return "south";
      if (isFloor(tR)) return "west";
      if (isFloor(tL)) return "east";
      return "north";
    }
    getCabinWallRects(t) {
      if (!t || !t.prop) return null;
      const k = t.prop.kind;
      if (k !== "cabin_wall" && k !== "cabin_door") return null;
      const ts = this.tileSize;
      const thick = ts * (10 / 36); // Paredes laterais (leste/oeste: 10px em 36px)
      const southThick = thick * 2; // Parede da frente (sul / porta) com o dobro da altura: 20px em 36px
      const northThick = thick * 3; // Parede do fundo (norte) 50% mais alta que antes (20px * 1.5 = 30px em 36px)
      const x0 = t.tx * ts;
      const y0 = t.ty * ts;

      if (k === "cabin_door") {
        // Porta fechada tem colisor na borda sul (mesma espessura da parede da frente/sul); aberta permite passagem no meio
        if (t.prop.opened) {
          const postW = ts * (5 / 36);
          return [
            { x0, y0: y0 + ts - southThick, x1: x0 + postW, y1: y0 + ts },
            { x0: x0 + ts - postW, y0: y0 + ts - southThick, x1: x0 + ts, y1: y0 + ts },
          ];
        }
        return [{ x0, y0: y0 + ts - southThick, x1: x0 + ts, y1: y0 + ts }];
      }

      const side = this.getCabinWallSide(t);
      const rects = [];
      if (side === "north" || side === "nw" || side === "ne") {
        rects.push({ x0, y0, x1: x0 + ts, y1: y0 + northThick });
      }
      if (side === "south" || side === "sw" || side === "se") {
        rects.push({ x0, y0: y0 + ts - southThick, x1: x0 + ts, y1: y0 + ts });
      }
      if (side === "west" || side === "nw" || side === "sw") {
        rects.push({ x0, y0, x1: x0 + thick, y1: y0 + ts });
      }
      if (side === "east" || side === "ne" || side === "se") {
        rects.push({ x0: x0 + ts - thick, y0, x1: x0 + ts, y1: y0 + ts });
      }
      return rects;
    }
    isCabinWallBlockedAt(x, y, hx = this.footHX, hy = this.footHY) {
      if (this.isUnderground) return !1;
      const ts = this.tileSize,
        tx = Math.floor(x / ts),
        ty = Math.floor(y / ts);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const t = this.getTile(tx + dx, ty + dy);
          if (!t || !t.prop || (t.prop.kind !== "cabin_wall" && t.prop.kind !== "cabin_door")) continue;
          const rects = this.getCabinWallRects(t);
          if (!rects) continue;
          for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (x + hx > r.x0 && x - hx < r.x1 && y + hy > r.y0 && y - hy < r.y1) {
              return !0;
            }
          }
        }
      }
      return !1;
    }
    isCabinWallBetween(x0, y0, x1, y1) {
      if (this.isUnderground || !this.playerCabins || this.playerCabins.length === 0) return !1;
      const dist = Math.hypot(x1 - x0, y1 - y0);
      if (dist < 1) return !1;
      const steps = Math.max(4, Math.ceil(dist / 6));
      for (let s = 1; s < steps; s++) {
        const f = s / steps;
        const qx = x0 + (x1 - x0) * f;
        const qy = y0 + (y1 - y0) * f;
        if (this.isCabinWallBlockedAt(qx, qy, 2, 2)) {
          return !0;
        }
      }
      // Se um está dentro da cabana e o outro está fora, com a porta fechada, nunca pode detectar nem acertar!
      const c0 = this.isPlayerInsideCabin(x0, y0);
      const c1 = this.isPlayerInsideCabin(x1, y1);
      if ((c0 && !c1) || (!c0 && c1)) {
        const cab = c0 || c1;
        const doorTile = this.getTile(cab.doorTx, cab.doorTy);
        const doorOpen = !!(doorTile && doorTile.prop && doorTile.prop.kind === "cabin_door" && doorTile.prop.opened);
        if (!doorOpen) return !0;
      }
      return !1;
    }
    isCliffDarkWallAt(x, y, hx = this.footHX, hy = this.footHY) {
      if (this.isUnderground) return !1;
      const ts = this.tileSize,
        tx = Math.floor(x / ts),
        ty = Math.floor(y / ts);

      for (let dy = -4; dy <= 1; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const t = this.getTile(tx + dx, ty + dy);
          if (!t || !t.isCliffWall) continue;

          const myTier = t.mountainTier || 1,
            isSameOrHigherElev = (tile) =>
              !!(
                tile &&
                tile.biome.id === BiomeId.MOUNTAIN_25D &&
                (tile.mountainTier || 1) >= myTier
              ),
            cx = t.tx * ts + ts / 2,
            cy = t.ty * ts + ts / 2,
            nL = isSameOrHigherElev(this.getTile(t.tx - 1, t.ty)),
            nR = isSameOrHigherElev(this.getTile(t.tx + 1, t.ty)),
            nT = isSameOrHigherElev(this.getTile(t.tx, t.ty - 1)),
            nB = isSameOrHigherElev(this.getTile(t.tx, t.ty + 1)),
            leftX = cx + (nL ? -19.5 : -17.5),
            rightX = cx + (nR ? 19.5 : 17.5),
            platBackY = cy - 19.5,
            platFrontY = cy + 19.5,
            baseY = cy + (nB ? 18 : 112);

          // 1. Parte escura da Face Vertical Sul (estende de platFrontY - 2 até baseY = cy + 112)
          if (!nB) {
            const x0 = leftX - (!nL ? 18 : 0),
              x1 = rightX + (!nR ? 18 : 0),
              y0 = platFrontY - 2,
              y1 = baseY;
            if (x + hx > x0 && x - hx < x1 && y + hy > y0 && y - hy < y1) {
              return !0;
            }
          }

          // 2. Parte escura da Escarpa Norte (estende de platBackY - 24 até platBackY + 1)
          if (!nT) {
            const x0 = leftX,
              x1 = rightX,
              y0 = platBackY - 24,
              y1 = platBackY + 2;
            if (x + hx > x0 && x - hx < x1 && y + hy > y0 && y - hy < y1) {
              return !0;
            }
          }

          // 3. Parte escura da Escarpa Oeste (esquerda: de leftX - 24 até leftX + 2)
          if (!nL) {
            const x0 = leftX - 24,
              x1 = leftX + 2,
              y0 = platBackY,
              y1 = nB ? platFrontY : baseY;
            if (x + hx > x0 && x - hx < x1 && y + hy > y0 && y - hy < y1) {
              return !0;
            }
          }

          // 4. Parte escura da Escarpa Leste (direita: de rightX - 2 até rightX + 24)
          if (!nR) {
            const x0 = rightX - 2,
              x1 = rightX + 24,
              y0 = platBackY,
              y1 = nB ? platFrontY : baseY;
            if (x + hx > x0 && x - hx < x1 && y + hy > y0 && y - hy < y1) {
              return !0;
            }
          }
        }
      }
      return !1;
    }
    isCliffFaceBlockedAt(fromX, fromY, toX, toY) {
      return this.isCliffDarkWallAt(toX, toY);
    }
    isCaveRockAt(x, y) {
      const tx = Math.floor(x / this.tileSize),
        ty = Math.floor(y / this.tileSize);
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const t = this.getTile(tx + dx, ty + dy);
          if (
            t &&
            t.prop &&
            (t.prop.kind === "cave_entrance" ||
              t.prop.kind === "cave_exit" ||
              t.prop.kind === "large_rock")
          ) {
            const isMerged = !!t.prop.isMerged;
            const isStair = !!t.prop.isStaircase;
            const scaleMul = t.prop.isPrisonDeepMine ? (t.prop.scale || 1.95) / 1.35 : 1;
            const cx = t.tx * this.tileSize + this.tileSize / 2;
            const cy =
              t.ty * this.tileSize + this.tileSize / 2 + (t.prop.offsetY || -4);
            const rx = x - cx;
            const ry = y - cy;
            const halfW = (isMerged ? 38 : 24) * scaleMul;
            const topY = (isMerged ? -62 : -38) * scaleMul;
            const sideBottomY = (isMerged ? 10 : 6) * scaleMul;
            if (t.prop.kind === "large_rock") {
              if (Math.abs(rx) <= halfW && ry >= topY && ry <= sideBottomY) return !0;
              continue;
            }
            const doorHalfW = (isStair ? (isMerged ? 16 : 13) : isMerged ? 11.5 : 8.5) * scaleMul;
            const topTriggerY = (isStair ? -11 : -4) * scaleMul;
            if (Math.abs(rx) <= doorHalfW) {
              if (ry < topTriggerY - 2 && ry >= topY) return !0;
            } else if (Math.abs(rx) <= halfW) {
              if (ry >= topY && ry <= sideBottomY) return !0;
            }
          }
          if (t && t.prop && t.prop.kind === "stalactite") {
            const cx = t.tx * this.tileSize + this.tileSize / 2;
            const cy = t.ty * this.tileSize + this.tileSize / 2;
            if (Math.hypot(x - cx, y - cy) <= 13) return !0;
          }
        }
      }
      return !1;
    }
    getNearbyCaveDoorwayAt(x, y) {
      const tx = Math.floor(x / this.tileSize),
        ty = Math.floor(y / this.tileSize);
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const t = this.getTile(tx + dx, ty + dy);
          if (
            t &&
            t.prop &&
            (t.prop.kind === "cave_entrance" || t.prop.kind === "cave_exit")
          ) {
            const isMerged = !!t.prop.isMerged;
            const isStair = !!t.prop.isStaircase;
            const scaleMul = t.prop.isPrisonDeepMine ? (t.prop.scale || 1.95) / 1.35 : 1;
            const doorHalfW = (isStair ? (isMerged ? 16 : 13) : isMerged ? 11.5 : 8.5) * scaleMul;
            const topTriggerY = (isStair ? -11 : -4) * scaleMul;
            const cx = t.tx * this.tileSize + this.tileSize / 2;
            const cy =
              t.ty * this.tileSize + this.tileSize / 2 + (t.prop.offsetY || -4);
            const rx = x - cx;
            const ry = y - cy;
            if (Math.abs(rx) <= doorHalfW && ry >= topTriggerY && ry <= 11 * scaleMul) {
              return {
                action:
                  t.prop.kind === "cave_entrance" ? "enter_cave" : "exit_cave",
                tx: t.tx,
                ty: t.ty,
                prop: t.prop,
              };
            }
          }
          if (
            t &&
            t.prop &&
            (t.prop.kind === "dungeon_staircase_down" || t.prop.kind === "dungeon_staircase_up")
          ) {
            const doorHalfW = 18;
            const topTriggerY = -12;
            const cx = t.tx * this.tileSize + this.tileSize / 2;
            const cy =
              t.ty * this.tileSize + this.tileSize / 2 + (t.prop.offsetY || -4);
            const rx = x - cx;
            const ry = y - cy;
            if (Math.abs(rx) <= doorHalfW && ry >= topTriggerY && ry <= 14) {
              return {
                action:
                  t.prop.kind === "dungeon_staircase_down"
                    ? "enter_dungeon"
                    : "exit_dungeon",
                tx: t.tx,
                ty: t.ty,
                prop: t.prop,
              };
            }
          }
          if (
            t &&
            t.prop &&
            (t.prop.kind === "geode_fissure" || t.prop.kind === "geode_exit_fissure")
          ) {
            const cx = t.tx * this.tileSize + this.tileSize / 2;
            const cy = t.ty * this.tileSize + this.tileSize / 2;
            const rx = x - cx;
            const ry = y - cy;
            const isEnter = t.prop.kind === "geode_fissure";
            // A fenda de entrada fica na face sul do paredão (jogador aproxima vindo do sul: ry entre 16 e 34)
            // A fenda de saída fica no sul da câmara do geodo (jogador aproxima vindo do norte: ry entre -34 e -14)
            if (
              Math.abs(rx) <= 15 &&
              ((isEnter && ry >= 14 && ry <= 31) || (!isEnter && ry >= -31 && ry <= -14))
            ) {
              return {
                action: isEnter ? "enter_geode" : "exit_geode",
                tx: t.tx,
                ty: t.ty,
                prop: t.prop,
              };
            }
          }
        }
      }
      return null;
    }
    canPlayerMoveTo(x, y) {
      const tx = Math.floor(x / this.tileSize),
        ty = Math.floor(y / this.tileSize);
      if (!this.isTilePassable(tx, ty)) return !1;
      if (this.isCabinWallBlockedAt(x, y)) return !1;
      if (this.isCaveRockAt(x, y)) return !1;
      if (this.isCliffDarkWallAt(x, y)) return !1;
      return !0;
    }
    get footHX() {
      return 5;
    }
    get footHY() {
      return 3;
    }
    getTrunkRect(t) {
      const p = t && t.prop;
      if (!p) return null;
      if (p._trunk !== void 0) return p._trunk;
      const k = p.kind;
      const hw =
        k === "tree_oak" || k === "tree_willow"
          ? 5
          : k === "tree_pine" || k === "tree_palm"
            ? 3.5
            : k === "tree_burnt"
              ? 3
              : k === "cactus"
                ? 4.5
                : k === "ruin_pillar" || k === "greek_statue" || k === "greek_unfinished"
                  ? 5.5
                  : 0;
      let r = null;
      if (hw) {
        const sc = p.scale || 1;
        const cx = t.tx * this.tileSize + this.tileSize / 2 + (p.offsetX || 0);
        const cy = t.ty * this.tileSize + this.tileSize / 2 + (p.offsetY || 0);
        r = {
          kind: k,
          cx: cx,
          cy: cy,
          x0: cx - hw * sc,
          x1: cx + hw * sc,
          y0: cy - 3 * sc,
          y1: cy + 4 * sc,
        };
      }
      Object.defineProperty(p, "_trunk", {
        value: r,
        writable: !0,
        configurable: !0,
        enumerable: !1,
      });
      return r;
    }
    findTrunkAt(x, y, hx = this.footHX, hy = this.footHY) {
      if (this.isUnderground) return null;
      const tx = Math.floor(x / this.tileSize),
        ty = Math.floor(y / this.tileSize);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const r = this.getTrunkRect(this.getTile(tx + dx, ty + dy));
          if (
            r &&
            x + hx > r.x0 &&
            x - hx < r.x1 &&
            y + hy > r.y0 &&
            y - hy < r.y1
          )
            return r;
        }
      }
      return null;
    }
    isTrunkAt(x, y, hx = this.footHX, hy = this.footHY) {
      return !!this.findTrunkAt(x, y, hx, hy);
    }
    moveWithSlide(
      x,
      y,
      dx,
      dy,
      isPlayer = !1,
      hx = this.footHX,
      hy = this.footHY,
    ) {
      const escape = !!this.findTrunkAt(x, y, hx, hy);
      const tileOk = (px, py) => {
        const tx = Math.floor(px / this.tileSize),
          ty = Math.floor(py / this.tileSize);
        if (isPlayer) {
          return this.canPlayerMoveTo(px, py) && !this.isCliffFaceBlockedAt(x, y, px, py);
        }
        if (!this.isTileCreaturePassable(tx, ty)) return !1;
        if (this.isCabinWallBlockedAt(px, py, hx, hy)) return !1;
        if (this.isCaveRockAt(px, py)) return !1;
        if (this.isCliffDarkWallAt(px, py)) return !1;
        return !0;
      };
      const startOk = tileOk(x, y);
      const free = (px, py) =>
        (tileOk(px, py) || (!startOk && isPlayer)) && (escape || !this.findTrunkAt(px, py, hx, hy));
      if (free(x + dx, y + dy))
        return { x: x + dx, y: y + dy, blocked: !1, detour: null };
      const fx = dx !== 0 && free(x + dx, y),
        fy = dy !== 0 && free(x, y + dy);
      if (fx && fy)
        return Math.abs(dx) >= Math.abs(dy)
          ? { x: x + dx, y: y, blocked: !0, detour: null }
          : { x: x, y: y + dy, blocked: !0, detour: null };
      if (fx) return { x: x + dx, y: y, blocked: !0, detour: null };
      if (fy) return { x: x, y: y + dy, blocked: !0, detour: null };

      // Deslizamento fracionário nos eixos (aproximação suave da parede sem travar)
      for (const frac of [0.75, 0.5, 0.25]) {
        if (dx !== 0 && free(x + dx * frac, y))
          return { x: x + dx * frac, y: y, blocked: !0, detour: null };
        if (dy !== 0 && free(x, y + dy * frac))
          return { x: x, y: y + dy * frac, blocked: !0, detour: null };
      }

      // Arredondamento e desvio de quinas (corner nudge) em paredes de caverna e corredores
      if (isPlayer) {
        if (Math.abs(dy) > 0.001) {
          for (const s of [2, -2, 4, -4, 6, -6, 8, -8]) {
            if (free(x + s, y + dy * 0.75)) {
              return { x: x + s, y: y + dy * 0.75, blocked: !0, detour: null };
            }
          }
        }
        if (Math.abs(dx) > 0.001) {
          for (const s of [2, -2, 4, -4, 6, -6, 8, -8]) {
            if (free(x + dx * 0.75, y + s)) {
              return { x: x + dx * 0.75, y: y + s, blocked: !0, detour: null };
            }
          }
        }
      }

      // Se o jogador estiver preso dentro de uma parede, permite escapar para o piso livre mais próximo
      if (!startOk && isPlayer) {
        for (const [ox, oy] of [
          [dx, 0], [0, dy], [-dx, 0], [0, -dy],
          [2, 0], [-2, 0], [0, 2], [0, -2],
          [4, 0], [-4, 0], [0, 4], [0, -4]
        ]) {
          if (ox !== 0 || oy !== 0) {
            if (tileOk(x + ox, y + oy)) {
              return { x: x + ox, y: y + oy, blocked: !0, detour: null };
            }
          }
        }
      }
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: x, y: y, blocked: !0, detour: null };
      const tr =
        this.findTrunkAt(x + dx, y + dy, hx, hy) ||
        this.findTrunkAt(x + dx, y, hx, hy) ||
        this.findTrunkAt(x, y + dy, hx, hy);
      if (!tr) return { x: x, y: y, blocked: !0, detour: null };
      const ux = dx / len,
        uy = dy / len;
      const side = (x - tr.cx) * -uy + (y - tr.cy) * ux;
      const sA =
        Math.abs(side) > 0.5
          ? side > 0
            ? 1
            : -1
          : (Math.floor(tr.cx) + Math.floor(tr.cy)) & 1
            ? 1
            : -1;
      for (const sg of [sA, -sA]) {
        const px = -uy * sg,
          py = ux * sg;
        for (const fw of [0.5, 0]) {
          const mx = (px + ux * fw) * len,
            my = (py + uy * fw) * len;
          if (free(x + mx, y + my))
            return {
              x: x + mx,
              y: y + my,
              blocked: !0,
              detour: { ux: px, uy: py },
            };
        }
      }
      return { x: x, y: y, blocked: !0, detour: null };
    }
  }
  if (typeof window !== "undefined") {
    window.World = World;
  }
