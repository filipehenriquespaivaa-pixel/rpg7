/* js/engine/renderer.js
 * Renderizador do mundo (WorldRenderer): cache de chunks, luz, particulas, agua.
 * Trecho de legacy/app.original.js (linhas 20125-23191); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const _g = [
      { bx: 200, by: 350, rx: 180, ry: 95, speed: 1 },
      { bx: 1200, by: 900, rx: 230, ry: 115, speed: 0.9 },
      { bx: 2100, by: 450, rx: 190, ry: 100, speed: 1.1 },
      { bx: 2700, by: 1600, rx: 250, ry: 125, speed: 0.95 },
      { bx: 800, by: 1900, rx: 200, ry: 105, speed: 1.05 },
    ],
    WorldRenderer = class fo {
      constructor(t, l) {
        ((this.particles = []),
          (this.birds = []),
          (this.animTimer = 0),
          (this.lightCanvas = null),
          (this.lightCtx = null),
          (this.visibleTiles = []),
          (this.lightSources = []),
          (this.renderQueue = []),
          (this.groundBitmapCache = new Map()),
          (this.waterBaseCache = new Map()),
          (this.cachedGroundCacheId = null),
          (this.ctx = t),
          (this.engine = l),
          this.initBirds());
        if (typeof window !== "undefined") window.__worldRenderer = this;
      }
      initBirds() {
        this.birds = [];
        for (let t = 0; t < 6; t++)
          this.birds.push({
            x: (Math.random() - 0.5) * 1e3,
            y: (Math.random() - 0.5) * 1e3,
            vx: 1.5 + Math.random() * 1.5,
            vy: -0.4 + Math.random() * 0.8,
            wingPhase: Math.random() * Math.PI * 2,
            scale: 0.8 + Math.random() * 0.4,
          });
      }
      render(t, l, o, u, m) {
        const c = this.ctx,
          f = this.engine.tileSize,
          g = u.zoom;
        this.animTimer += 0.025;
        const y = m ? m.x : t.x,
          w = m ? m.y : t.y;
        (c.save(),
          (c.fillStyle = this.engine.isUnderground ? "#11100f" : "#2d5a27"),
          c.fillRect(0, 0, l, o),
          c.save(),
          c.translate(l / 2, o / 2),
          c.scale(g, g),
          c.translate(-y, -w));
        const v = l / 2 / g,
          T = o / 2 / g,
          S = y - v,
          p = y + v,
          j = w - T,
          P = w + T;
        ((c.fillStyle = this.engine.isUnderground ? "#11100f" : "#2d5a27"),
          c.fillRect(S - 64, j - 64, p - S + 128, P - j + 128));
        const A = Math.floor(S / f) - 2,
          x = Math.ceil(p / f) + 2,
          M = Math.floor(j / f) - 2,
          $ = Math.ceil(P / f) + 2,
          z = this.visibleTiles;
        z.length = 0;
        const K = this.lightSources;
        K.length = 0;
        const V =
          this.engine.isUnderground || u.timeOfDay < 0.28 || u.timeOfDay > 0.72;
        this.invalidateGroundBitmapsIfNeeded();
        const O = fo.GROUND_CHUNK_TILES,
          _ = Math.floor(A / O),
          se = Math.floor(x / O),
          ue = Math.floor(M / O),
          N = Math.floor($ / O);
        this._visChunks = (se - _ + 1) * (N - ue + 1);
        const __wLo = Math.floor((S - f - 6) / f) + 1,
          __wHi = Math.ceil((p + 6) / f) - 1,
          __wTop = Math.floor((j - f - 6) / f) + 1,
          __wBot = Math.ceil((P + 6) / f) - 1;
        for (let ne = ue; ne <= N; ne++)
          for (let ke = _; ke <= se; ke++) {
            const G = this.getGroundChunkBitmap(ke, ne),
              de = O * f;
            c.drawImage(G, ke * O * f, ne * O * f, de + 0.6, de + 0.6);
          }
        for (let ne = M; ne <= $; ne++)
          for (let ke = A; ke <= x; ke++) {
            const G = this.engine.getTile(ke, ne);
            if (
              (z.push(G),
              (G.biome.hasWater || fo.ANIMATED_GROUND_BIOMES.has(G.biome.id)) &&
                ke >= __wLo &&
                ke <= __wHi &&
                ne >= __wTop &&
                ne <= __wBot &&
                this.renderTileGround(G, ke * f, ne * f, f, u),
              V && G.prop)
            )
              if (
                (G.prop.kind === "campfire" ||
                  G.prop.kind === "clay_oven" ||
                  G.prop.kind === "corridor_torch") &&
                G.prop.lit !== !1
              ) {
                const de = G.prop.scale || 1,
                  isCorrTorch = G.prop.kind === "corridor_torch",
                  te = isCorrTorch
                    ? 165 + Math.sin(this.animTimer * 6 + ke * 3 + ne * 2) * 6
                    : (this.engine.isUnderground ? 225 : 190) +
                      (de - 1) * 85 +
                      Math.sin(this.animTimer * 5 + ke * 3) *
                        (6 * Math.min(2.5, de));
                K.push({
                  x: ke * f + f / 2 + (G.prop.offsetX || 0),
                  y: ne * f + f / 2 + (G.prop.offsetY || 0),
                  radius: te,
                  color: isCorrTorch
                    ? "rgba(251, 191, 36, 0.34)"
                    : G.prop.kind === "clay_oven"
                      ? "rgba(249, 115, 22, 0.35)"
                      : "rgba(251, 146, 60, 0.32)",
                  intensity: isCorrTorch
                    ? 0.92
                    : Math.min(1, 0.95 + (de - 1) * 0.05),
                  isCampfire: !0,
                });
              } else if (G.prop.kind === "shrine")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 - 8,
                  radius: 110 + Math.cos(this.animTimer * 2) * 6,
                  color: "rgba(56, 189, 248, 0.8)",
                  intensity: 0.85,
                });
              else if (G.prop.kind === "snow_city_monument")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 320 + Math.sin(this.animTimer * 5) * 12,
                  color: "rgba(251, 146, 60, 0.42)",
                  intensity: 1,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "snow_city_lamppost" || G.prop.kind === "snow_city_fireplace")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 150 + Math.sin(this.animTimer * 4 + ke) * 5,
                  color: "rgba(251, 191, 36, 0.34)",
                  intensity: 0.9,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "port_city_lighthouse" || G.prop.kind === "port_city_monument")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 - 12,
                  radius: 260 + Math.sin(this.animTimer * 4.5 + ke) * 10,
                  color: "rgba(251, 191, 36, 0.45)",
                  intensity: 0.98,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "port_city_lamppost" || G.prop.kind === "port_city_boat" || G.prop.kind === "port_city_boat_mast")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 130 + Math.sin(this.animTimer * 3.5 + ke) * 4,
                  color: "rgba(251, 146, 60, 0.34)",
                  intensity: 0.85,
                  isCampfire: !0,
                });
              else if (
                G.prop.kind === "cave_entrance" &&
                (G.prop.isPrisonDeepMine || G.prop.isExcavatorMine)
              )
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 120 + Math.sin(this.animTimer * 3) * 6,
                  color: "rgba(251, 191, 36, 0.85)",
                  intensity: 0.88,
                });
              else if (G.prop.kind === "geode_fissure")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 + 4,
                  radius: 135 + Math.sin(this.animTimer * 3.5) * 8,
                  color: "rgba(180, 105, 45, 0.55)",
                  intensity: 0.82,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "geode_exit_fissure")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 + 4,
                  radius: 145 + Math.sin(this.animTimer * 3.2) * 8,
                  color: "rgba(180, 105, 45, 0.58)",
                  intensity: 0.85,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "luminous_algae")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 95 + Math.sin(this.animTimer * 3.8 + ke) * 6,
                  color: "rgba(45, 212, 191, 0.52)",
                  intensity: 0.78,
                });
              else if (G.prop.kind === "dungeon_staircase_up")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 - 6,
                  radius: 160 + Math.sin(this.animTimer * 3) * 8,
                  color: "rgba(251, 191, 36, 0.95)",
                  intensity: 0.95,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "dungeon_staircase_down")
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2 - 4,
                  radius: 140 + Math.sin(this.animTimer * 3) * 6,
                  color: "rgba(239, 68, 68, 0.9)",
                  intensity: 0.9,
                  isCampfire: !0,
                });
              else if (G.prop.kind === "crystal_cluster" && !G.prop.opened) {
                const de = [
                    "rgba(192, 132, 252, 0.15)",
                    "rgba(56, 189, 248, 0.15)",
                    "rgba(244, 63, 94, 0.15)",
                    "rgba(52, 211, 153, 0.15)",
                  ],
                  W = de[G.prop.subType % de.length];
                K.push({
                  x: ke * f + f / 2,
                  y: ne * f + f / 2,
                  radius: 16,
                  color: W,
                  intensity: 0.14,
                });
              } else
                G.prop.kind === "glowing_mushroom" &&
                  K.push({
                    x: ke * f + f / 2,
                    y: ne * f + f / 2,
                    radius: 14,
                    color: "rgba(45, 212, 191, 0.15)",
                    intensity: 0.12,
                  });
          }
        if (u.showGrid) {
          ((c.strokeStyle = "rgba(255, 255, 255, 0.08)"), (c.lineWidth = 0.8));
          for (let ne = A; ne <= x; ne++)
            (c.beginPath(),
              c.moveTo(ne * f, j),
              c.lineTo(ne * f, P),
              c.stroke());
          for (let ne = M; ne <= $; ne++)
            (c.beginPath(),
              c.moveTo(S, ne * f),
              c.lineTo(p, ne * f),
              c.stroke());
        }
        const Ee = this.renderQueue;
        Ee.length = 0;
        const activeSnowRoofId =
          !this.engine.isUnderground &&
          typeof window !== "undefined" &&
          window.SnowPeakCity &&
          typeof window.SnowPeakCity.getActiveHouseForPlayer === "function"
            ? window.SnowPeakCity.getActiveHouseForPlayer(t.x, t.y, f)
            : null;
        const activeDesertRoofId =
          !this.engine.isUnderground &&
          typeof window !== "undefined" &&
          window.DesertCity &&
          typeof window.DesertCity.getActiveHouseForPlayer === "function"
            ? window.DesertCity.getActiveHouseForPlayer(t.x, t.y, f)
            : null;
        const activePortRoofId =
          !this.engine.isUnderground &&
          typeof window !== "undefined" &&
          window.PortCity &&
          typeof window.PortCity.getActiveHouseForPlayer === "function"
            ? window.PortCity.getActiveHouseForPlayer(t.x, t.y, f)
            : null;
        for (const ne of z) {
          if (ne.prop) {
            const ke = ne.prop;
            // [PERF] Se o objeto é mobília interna de uma casa ou ala coberta pelo telhado (onde o jogador NÃO está dentro),
            // pula seu desenho e suas luzes internas, pois o telhado 2.5D cobre 100% do interior!
            if (
              ne.snowCityHouseIndex !== void 0 &&
              ne.snowCityHouseIndex !== activeSnowRoofId &&
              ke.kind !== "snow_city_wall" &&
              ke.kind !== "snow_city_door" &&
              ke.kind !== "snow_city_chimney" &&
              ke.kind !== "iron_bars_gate"
            ) {
              continue;
            }
            if (
              ne.desertCityHouseIndex !== void 0 &&
              ne.desertCityHouseIndex !== activeDesertRoofId &&
              ke.kind !== "desert_city_wall" &&
              ke.kind !== "desert_city_door"
            ) {
              continue;
            }
            if (
              ne.portCityHouseIndex !== void 0 &&
              ne.portCityHouseIndex !== activePortRoofId &&
              ke.kind !== "port_city_wall" &&
              ke.kind !== "port_city_door"
            ) {
              continue;
            }
            const offX = (typeof ke.offsetX === "number" && isFinite(ke.offsetX)) ? ke.offsetX : 0,
              offY = (typeof ke.offsetY === "number" && isFinite(ke.offsetY)) ? ke.offsetY : 0,
              G = ne.tx * f + f / 2 + offX,
              de = ne.ty * f + f / 2 + offY;
            // [PERF] Paredao totalmente cercado por platô/rocha (esq/dir/cima/baixo) so repintava o topo que o chunk ja tem:
            // pula o desenho e reduz drasticamente a fila de ordenacao Y nas cavernas e montanhas!
            let __skipWall = !1;
            if (ke.kind === "cliff_wall" && !window.__cliffKeepBuried) {
              if (ne._wallBuried === void 0) {
                const myT = ne.mountainTier || ke.subType || 1,
                  el = (a, b) => {
                    const n = this.engine.getTile(a, b);
                    return !!(n && n.biome.id === BiomeId.MOUNTAIN_25D && (n.mountainTier || 1) >= myT);
                  };
                ne._wallBuried =
                  el(ne.tx - 1, ne.ty) && el(ne.tx + 1, ne.ty) && el(ne.tx, ne.ty - 1) && el(ne.tx, ne.ty + 1);
              }
              if (ne._wallBuried) __skipWall = !0;
            } else if (ke.kind === "cave_wall_25d") {
              let nb = ne._cw25Nb;
              if (!nb) {
                const eng = this.engine,
                  tx = ne.tx,
                  ty = ne.ty,
                  isCW = (tile) =>
                    !!(
                      tile &&
                      tile.biome &&
                      (tile.biome.id === BiomeId.CAVE_WALL ||
                        tile.biome.id === BiomeId.DESERT_CAVE_WALL)
                    );
                nb = ne._cw25Nb = {
                  left: isCW(eng.getTile(tx - 1, ty)),
                  right: isCW(eng.getTile(tx + 1, ty)),
                  top: isCW(eng.getTile(tx, ty - 1)),
                  bottom: isCW(eng.getTile(tx, ty + 1)),
                };
              }
              if (nb.left && nb.right && nb.top && nb.bottom && !ne.isDungeonWall) {
                // O interior maciço da rocha usa o topo pré-renderizado no chunk ou 1 único drawImage sem face frontal
              }
            }
            // Desenha o paredão (cliff_wall), a rampa (cliff_ramp) e o piso da cabana (cabin_floor) na camada de terreno
            // abaixo dos pés do personagem para que o piso nunca fique na frente do jogador!
            let sortY = de;
            if (ke.kind === "cliff_wall" || ke.kind === "cliff_ramp" || ke.kind === "cabin_floor") {
              sortY = de - f * 4.5;
            } else if (ke.kind === "cabin_wall" || ke.kind === "cabin_door" || ke.onCabinFloor) {
              // Desenha o piso de tábuas sob a parede/porta/baú na camada do chão (sempre atrás dos pés do personagem)
              if (typeof drawCabinFloor === "function") {
                Ee.push({
                  y: de - f * 4.5,
                  draw: () => {
                    c.save();
                    c.translate(G, de);
                    drawCabinFloor(c, f);
                    c.restore();
                  },
                });
              }
              if (ke.kind === "cabin_wall" || ke.kind === "cabin_door") {
                const wSide =
                ke.kind === "cabin_door"
                  ? "south"
                  : ke.wallSide ||
                    (this.engine && typeof this.engine.getCabinWallSide === "function"
                      ? this.engine.getCabinWallSide(ne)
                      : "north");
                if (wSide === "south" || wSide === "sw" || wSide === "se") {
                  sortY = de + f * 0.36;
                } else if (wSide === "north") {
                  sortY = de - f * 0.36;
                }
              }
            }
            __skipWall || Ee.push({ y: sortY, draw: () => this.renderProp(ke, G, de, ne, u) });
          }
          if (
            ne.tx >= __wLo &&
            ne.tx <= __wHi &&
            ne.ty >= __wTop &&
            ne.ty <= __wBot &&
            !ne.isDungeonFloor &&
            !ne.isDungeonWall &&
            !ne.dungeonRole &&
            !ne.isPortCity &&
            this.engine.undergroundLevel !== 2 &&
            !this.engine.isGroundItemCollected(ne.tx, ne.ty)
          ) {
            ne.groundItem === void 0 &&
              (ne.groundItem = Hs(ne.tx, ne.ty, this.engine));
            const ke = ne.groundItem;
            if (ke) {
              const G = ((ne.detailHash * 13) % 10) - 5,
                de = ((ne.detailHash * 19) % 10) - 5,
                W = ne.tx * f + f / 2 + G,
                le = ne.ty * f + f / 2 + de,
                te = Math.hypot(t.x - W, t.y - le);
              Ee.push({
                y: le - 4,
                draw: () => {
                  if ((ke.render(c, W, le, 1, this.animTimer), te < 46)) {
                    const oe = Math.sin(this.animTimer * 5) * 0.15 + 0.85;
                    (c.save(),
                      (c.strokeStyle = ke.color),
                      (c.lineWidth = 1.2),
                      (c.globalAlpha = 0.45 * oe),
                      c.beginPath(),
                      c.ellipse(
                        W,
                        le + 4,
                        11 * oe,
                        5.5 * oe,
                        0,
                        0,
                        Math.PI * 2,
                      ),
                      c.stroke(),
                      (c.fillStyle = ke.color),
                      (c.globalAlpha = 0.75 * oe),
                      c.beginPath(),
                      c.arc(
                        W,
                        le - 9 - Math.sin(this.animTimer * 6) * 2,
                        1.8,
                        0,
                        Math.PI * 2,
                      ),
                      c.fill(),
                      c.restore());
                  }
                },
              });
            }
          }
        }
        if (
          (Ee.push({
            y: t.y,
            draw: () =>
              this.renderPlayer(
                t,
                u.lanternActive,
                u.hasSword,
                u.timeOfDay,
                u.equipment,
              ),
          }),
          u.combatManager)
        ) {
          const ne = u.combatManager.getRenderItems(c, S, p, j, P);
          for (const ke of ne) Ee.push(ke);
        }
        if (
          typeof window !== "undefined" &&
          window.SnowPeakCity &&
          typeof window.SnowPeakCity.updateAndGetCitizenRenderItems === "function"
        ) {
          const citItems = window.SnowPeakCity.updateAndGetCitizenRenderItems(
            c,
            f,
            t,
            u.timeOfDay,
            this.animTimer,
            S,
            p,
            j,
            P,
            !!this.engine.isUnderground,
          );
          for (const ci of citItems) Ee.push(ci);
        }
        if (
          typeof window !== "undefined" &&
          window.DesertCity &&
          typeof window.DesertCity.updateAndGetCitizenRenderItems === "function"
        ) {
          const dcCitItems = window.DesertCity.updateAndGetCitizenRenderItems(
            c,
            f,
            t,
            u.timeOfDay,
            this.animTimer,
            S,
            p,
            j,
            P,
            !!this.engine.isUnderground,
          );
          for (const dci of dcCitItems) Ee.push(dci);
        }
        if (
          typeof window !== "undefined" &&
          window.PortCity &&
          typeof window.PortCity.updateAndGetCitizenRenderItems === "function"
        ) {
          const pcCitItems = window.PortCity.updateAndGetCitizenRenderItems(
            c,
            f,
            t,
            u.timeOfDay,
            this.animTimer,
            S,
            p,
            j,
            P,
            !!this.engine.isUnderground,
          );
          for (const pci of pcCitItems) Ee.push(pci);
        }
        Ee.sort((ne, ke) => ne.y - ke.y);
        for (const ne of Ee) ne.draw();
        this.renderFallingTrees(c);
        if (!this.engine.isUnderground && typeof drawSnowCityHouseRoofs === "function") {
          drawSnowCityHouseRoofs(c, f, t.x, t.y, S, p, j, P, this.animTimer);
        }
        if (!this.engine.isUnderground && typeof drawDesertCityHouseRoofs === "function") {
          drawDesertCityHouseRoofs(c, f, t.x, t.y, S, p, j, P, this.animTimer);
        }
        if (!this.engine.isUnderground && typeof drawPortCityHouseRoofs === "function") {
          drawPortCityHouseRoofs(c, f, t.x, t.y, S, p, j, P, this.animTimer);
        }
        if (!this.engine.isUnderground && typeof drawCabinRoofs === "function") {
          drawCabinRoofs(c, f, t.x, t.y, S, p, j, P, this.animTimer, this.engine);
        }
        if (!this.engine.isUnderground && typeof drawCabinPlacementPreview === "function") {
          drawCabinPlacementPreview(c, f, this.animTimer, this.engine);
        }
        (u.combatManager && u.combatManager.renderEffects(c),
          typeof window !== "undefined" &&
            window.weatherSystem &&
            typeof window.weatherSystem.renderWorldEffects === "function" &&
            window.weatherSystem.renderWorldEffects(c, S, p, j, P),
          window.__showColliders &&
            this.renderColliderDebug(c, t, u.combatManager),
          this.renderCloudShadows(S, p, j, P, u.timeOfDay),
          this.updateAndRenderParticles(t, S, p, j, P),
          this.engine.isUnderground || this.updateAndRenderBirds(t, S, p, j, P),
          c.restore(),
          this.renderSunRays(l, o, u.timeOfDay),
          this.renderLightingOverlay(t, l, o, g, u, K, y, w),
          typeof window !== "undefined" &&
            window.weatherSystem &&
            typeof window.weatherSystem.renderScreenWeather === "function" &&
            window.weatherSystem.renderScreenWeather(
              c,
              l,
              o,
              g,
              y,
              w,
              !!this.engine.isUnderground,
            ),
          c.restore());
      }
      renderColliderDebug(c, pl, cm) {
        const e = this.engine,
          ts = e.tileSize,
          hx = e.footHX,
          hy = e.footHY;
        c.save();
        c.lineWidth = 1;
        for (const t of this.visibleTiles) {
          if (!e.isTilePassable(t.tx, t.ty)) {
            c.fillStyle = "rgba(239,68,68,0.28)";
            c.strokeStyle = "rgba(239,68,68,0.9)";
            c.fillRect(t.tx * ts, t.ty * ts, ts, ts);
            c.strokeRect(t.tx * ts + 0.5, t.ty * ts + 0.5, ts - 1, ts - 1);
          } else if (t.isCliffWall) {
            // Topo do paredão caminhável (azul ciano translúcido no debug de colisores)
            c.fillStyle = "rgba(56,189,248,0.18)";
            c.strokeStyle = "rgba(56,189,248,0.65)";
            c.strokeRect(t.tx * ts + 1, t.ty * ts + 1, ts - 2, ts - 2);
            // Partes escuras do paredão (proibido andar - vermelho no debug de colisores)
            const myTier = t.mountainTier || 1,
              isElev = (tile) =>
                !!(
                  tile &&
                  tile.biome.id === BiomeId.MOUNTAIN_25D &&
                  (tile.mountainTier || 1) >= myTier
                );
            const cx = t.tx * ts + ts / 2,
              cy = t.ty * ts + ts / 2,
              nL = isElev(e.getTile(t.tx - 1, t.ty)),
              nR = isElev(e.getTile(t.tx + 1, t.ty)),
              nT = isElev(e.getTile(t.tx, t.ty - 1)),
              nB = isElev(e.getTile(t.tx, t.ty + 1)),
              leftX = cx + (nL ? -19.5 : -17.5),
              rightX = cx + (nR ? 19.5 : 17.5),
              platBackY = cy - 19.5,
              platFrontY = cy + 19.5,
              baseY = cy + (nB ? 18 : 112);
            c.fillStyle = "rgba(239,68,68,0.32)";
            c.strokeStyle = "rgba(239,68,68,0.9)";
            if (!nB) {
              c.fillRect(leftX, platFrontY - 2, rightX - leftX, baseY - (platFrontY - 2));
              c.strokeRect(leftX, platFrontY - 2, rightX - leftX, baseY - (platFrontY - 2));
            }
            if (!nT) {
              c.fillRect(leftX, platBackY - 24, rightX - leftX, 26);
              c.strokeRect(leftX, platBackY - 24, rightX - leftX, 26);
            }
            if (!nL) {
              c.fillRect(leftX - 24, platBackY, 26, (nB ? platFrontY : baseY) - platBackY);
              c.strokeRect(leftX - 24, platBackY, 26, (nB ? platFrontY : baseY) - platBackY);
            }
            if (!nR) {
              c.fillRect(rightX - 2, platBackY, 26, (nB ? platFrontY : baseY) - platBackY);
              c.strokeRect(rightX - 2, platBackY, 26, (nB ? platFrontY : baseY) - platBackY);
            }
          }
          const r = e.getTrunkRect(t);
          if (r) {
            c.fillStyle = "rgba(250,204,21,0.45)";
            c.strokeStyle = "#facc15";
            c.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
            c.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
          }
          if (
            t.prop &&
            (t.prop.kind === "cabin_wall" || t.prop.kind === "cabin_door") &&
            typeof e.getCabinWallRects === "function"
          ) {
            const cwRects = e.getCabinWallRects(t);
            if (cwRects && cwRects.length > 0) {
              c.fillStyle = t.prop.kind === "cabin_door" ? "rgba(249,115,22,0.38)" : "rgba(239,68,68,0.38)";
              c.strokeStyle = t.prop.kind === "cabin_door" ? "#f97316" : "#ef4444";
              for (const cr of cwRects) {
                c.fillRect(cr.x0, cr.y0, cr.x1 - cr.x0, cr.y1 - cr.y0);
                c.strokeRect(cr.x0 + 0.5, cr.y0 + 0.5, cr.x1 - cr.x0 - 1, cr.y1 - cr.y0 - 1);
              }
            }
          }
          if (
            t.prop &&
            (t.prop.kind === "cave_entrance" || t.prop.kind === "cave_exit")
          ) {
            const cx = t.tx * ts + ts / 2,
              cy = t.ty * ts + ts / 2 + (t.prop.offsetY || -4);
            c.fillStyle = "rgba(59,130,246,0.35)";
            c.strokeStyle = "#3b82f6";
            for (const q of [
              [cx - 24, cy - 38, 48, 36],
              [cx - 24, cy - 2, 15.5, 8],
              [cx + 8.5, cy - 2, 15.5, 8],
            ]) {
              c.fillRect(q[0], q[1], q[2], q[3]);
              c.strokeRect(q[0], q[1], q[2], q[3]);
            }
          }
        }
        const foot = (x, y, col) => {
          c.fillStyle = col.replace("1)", "0.4)");
          c.strokeStyle = col;
          c.fillRect(x - hx, y - hy, hx * 2, hy * 2);
          c.strokeRect(x - hx, y - hy, hx * 2, hy * 2);
          c.fillStyle = col;
          c.fillRect(x - 1, y - 1, 2, 2);
        };
        if (cm && cm.monsters)
          for (const m of cm.monsters) {
            if (
              m.isGiantScorpion &&
              !m.isUnderground &&
              e.isUnderground &&
              ((m.caveReachProg && m.caveReachProg > 0) || m.isPullingFromCave) &&
              m._caveClawTipX !== void 0
            ) {
              c.save();
              const active = m.isPullingFromCave || (m.caveReachProg >= 0.2 && m.caveReachProg <= 0.82);
              c.fillStyle = active ? "rgba(239,68,68,0.45)" : "rgba(251,191,36,0.22)";
              c.strokeStyle = active ? "#ef4444" : "rgba(251,191,36,0.9)";
              c.lineWidth = active ? 2 : 1.2;
              c.beginPath();
              c.arc(m._caveClawTipX, m._caveClawTipY, m._caveClawRadius || 13, 0, Math.PI * 2);
              c.fill();
              c.stroke();
              c.restore();
              continue;
            }
            if (!m.isUnderground === !e.isUnderground) {
              foot(m.x, m.y, "rgba(249,115,22,1)");
              if (m.type === "scorpion" && typeof getScorpionHitColliders === "function") {
                const cols = getScorpionHitColliders(m);
                for (const col of cols) {
                  c.save();
                  const isStinger = col.part === "stinger";
                  const isLeg = col.isLeg || (col.part && col.part.startsWith("leg"));
                  const strokeCol = col.active
                    ? "#ef4444"
                    : isStinger
                      ? "rgba(236,72,153,0.9)"
                      : isLeg
                        ? "rgba(34,197,94,0.85)"
                        : "rgba(251,191,36,0.9)";
                  const fillCol = col.active
                    ? "rgba(239,68,68,0.45)"
                    : isStinger
                      ? "rgba(236,72,153,0.22)"
                      : isLeg
                        ? "rgba(34,197,94,0.18)"
                        : "rgba(251,191,36,0.22)";
                  c.fillStyle = fillCol;
                  c.strokeStyle = strokeCol;
                  c.lineWidth = col.active ? 2 : 1.2;
                  c.beginPath();
                  c.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
                  c.fill();
                  c.stroke();
                  c.fillStyle = strokeCol;
                  c.fillRect(col.x - 1, col.y - 1, 2, 2);
                  c.restore();
                }
              }
            }
          }
        foot(pl.x, pl.y, "rgba(34,197,94,1)");
        c.restore();
      }
      invalidateGroundBitmapsIfNeeded() {
        const uLvl = this.engine.undergroundLevel ?? (this.engine.isUnderground ? 1 : 0);
        const t = `lvl${uLvl}_${this.engine.seed}_${window.__rpgQuality?.terrain ?? 1}`;
        t !== this.cachedGroundCacheId &&
          (this.groundBitmapCache.clear(), (this.cachedGroundCacheId = t));
      }
      bakeGroundChunkBitmap(t, l) {
        const o = fo.GROUND_CHUNK_TILES,
          u = Math.max(
            12,
            Math.round(
              fo.GROUND_BAKE_TILE_PX * (window.__rpgQuality?.terrain ?? 1),
            ),
          ),
          m = document.createElement("canvas");
        ((m.width = o * u), (m.height = o * u));
        const c = m.getContext("2d"),
          f = t * o,
          g = l * o;
        for (let y = 0; y < o; y++)
          for (let w = 0; w < o; w++) {
            const v = this.engine.getTile(f + w, g + y);
            v.biome.hasWater ||
              this.renderTileGround(v, w * u, y * u, u, void 0, c, !0);
          }
        return m;
      }
      getGroundChunkBitmap(t, l) {
        const o = `${t},${l}`;
        let u = this.groundBitmapCache.get(o);
        if (u) {
          this.groundBitmapCache.delete(o);
          this.groundBitmapCache.set(o, u);
        } else {
          u = this.bakeGroundChunkBitmap(t, l);
          this.groundBitmapCache.set(o, u);
          const cap = Math.max(
            fo.MAX_CACHED_GROUND_CHUNKS,
            (this._visChunks || 0) + 24,
          );
          if (this.groundBitmapCache.size > cap)
            for (const k of this.groundBitmapCache.keys()) {
              if (this.groundBitmapCache.size <= cap) break;
              this.groundBitmapCache.delete(k);
            }
        }
        return u;
      }
      renderTileGround(t, l, o, u, m, c, f) {
        const g = c || this.ctx,
          y = t.biome;
        if (y.hasWater) {
          this.renderWaterTile(t, l, o, u, m);
          return;
        }
        ((g.fillStyle = y.groundColor), g.fillRect(l, o, u + 1.2, u + 1.2));
        const w = [
          { t: this.engine.getTile(t.tx, t.ty - 1), side: "top" },
          { t: this.engine.getTile(t.tx, t.ty + 1), side: "bottom" },
          { t: this.engine.getTile(t.tx - 1, t.ty), side: "left" },
          { t: this.engine.getTile(t.tx + 1, t.ty), side: "right" },
        ];
        for (const S of w)
          S.t.biome.id !== y.id &&
            y.id !== BiomeId.MOUNTAIN_25D &&
            S.t.biome.id !== BiomeId.MOUNTAIN_25D &&
            (S.t.biome.hasWater
              ? ((g.fillStyle = "rgba(15, 23, 42, 0.16)"),
                g.beginPath(),
                S.side === "top" &&
                  g.ellipse(l + u / 2, o + 2, u * 0.52, 4.5, 0, 0, Math.PI * 2),
                S.side === "bottom" &&
                  g.ellipse(
                    l + u / 2,
                    o + u - 2,
                    u * 0.52,
                    4.5,
                    0,
                    0,
                    Math.PI * 2,
                  ),
                S.side === "left" &&
                  g.ellipse(l + 2, o + u / 2, 4.5, u * 0.52, 0, 0, Math.PI * 2),
                S.side === "right" &&
                  g.ellipse(
                    l + u - 2,
                    o + u / 2,
                    4.5,
                    u * 0.52,
                    0,
                    0,
                    Math.PI * 2,
                  ),
                g.fill())
              : ((g.fillStyle = S.t.biome.groundColor),
                (g.globalAlpha = 0.55),
                g.beginPath(),
                S.side === "top"
                  ? (g.ellipse(l + u * 0.22, o + 3, 9, 5, 0, 0, Math.PI * 2),
                    g.ellipse(l + u * 0.55, o + 2, 11, 4, 0, 0, Math.PI * 2),
                    g.ellipse(l + u * 0.82, o + 3.5, 8, 4.5, 0, 0, Math.PI * 2))
                  : S.side === "bottom"
                    ? (g.ellipse(
                        l + u * 0.2,
                        o + u - 3,
                        9,
                        5,
                        0,
                        0,
                        Math.PI * 2,
                      ),
                      g.ellipse(
                        l + u * 0.52,
                        o + u - 2,
                        11,
                        4.5,
                        0,
                        0,
                        Math.PI * 2,
                      ),
                      g.ellipse(
                        l + u * 0.8,
                        o + u - 3.5,
                        8,
                        5,
                        0,
                        0,
                        Math.PI * 2,
                      ))
                    : S.side === "left"
                      ? (g.ellipse(
                          l + 3,
                          o + u * 0.22,
                          5,
                          9,
                          0,
                          0,
                          Math.PI * 2,
                        ),
                        g.ellipse(
                          l + 2,
                          o + u * 0.55,
                          4,
                          11,
                          0,
                          0,
                          Math.PI * 2,
                        ),
                        g.ellipse(
                          l + 3.5,
                          o + u * 0.82,
                          4.5,
                          8,
                          0,
                          0,
                          Math.PI * 2,
                        ))
                      : S.side === "right" &&
                        (g.ellipse(
                          l + u - 3,
                          o + u * 0.2,
                          5,
                          9,
                          0,
                          0,
                          Math.PI * 2,
                        ),
                        g.ellipse(
                          l + u - 2,
                          o + u * 0.52,
                          4.5,
                          11,
                          0,
                          0,
                          Math.PI * 2,
                        ),
                        g.ellipse(
                          l + u - 3.5,
                          o + u * 0.8,
                          5,
                          8,
                          0,
                          0,
                          Math.PI * 2,
                        )),
                g.fill(),
                (g.globalAlpha = 1)));
        const v = [
          { t: this.engine.getTile(t.tx - 1, t.ty - 1), cx: l, cy: o },
          { t: this.engine.getTile(t.tx + 1, t.ty - 1), cx: l + u, cy: o },
          { t: this.engine.getTile(t.tx - 1, t.ty + 1), cx: l, cy: o + u },
          { t: this.engine.getTile(t.tx + 1, t.ty + 1), cx: l + u, cy: o + u },
        ];
        for (const S of v)
          S.t.biome.id !== y.id &&
            y.id !== BiomeId.MOUNTAIN_25D &&
            S.t.biome.id !== BiomeId.MOUNTAIN_25D &&
            !S.t.biome.hasWater &&
            ((g.fillStyle = S.t.biome.groundColor),
            (g.globalAlpha = 0.38),
            g.beginPath(),
            g.arc(S.cx, S.cy, 6, 0, Math.PI * 2),
            g.fill(),
            (g.globalAlpha = 1));
        const T = t.detailHash;
        if (t.isEarthMineWall) {
          // Parede maciça de TERRA ESCAVADA da Mina Profunda (marrom terroso escuro com camadas de solo, sem pedras azuis nem neve)
          const isAlt = (Math.abs(t.tx * 5 + t.ty * 11) % 2) === 0;
          g.fillStyle = isAlt ? "#26150a" : "#1f1108";
          g.fillRect(l, o, u + 1, u + 1);
          g.fillStyle = "#361e0f";
          g.fillRect(l + 1, o + 1, u - 2, u - 2);
          // Topo de terra compactada e raízes/veios de barro escuro
          g.fillStyle = "#4a2a16";
          g.fillRect(l, o, u, 4);
          g.strokeStyle = "rgba(18, 9, 4, 0.9)";
          g.lineWidth = 1.2;
          g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
          if (T > 0.45) {
            g.fillStyle = "rgba(92, 58, 33, 0.35)";
            g.fillRect(l + 4, o + 8 + (t.tx % 3) * 5, u - 8, 3);
          }
          return;
        } else if (t.isEarthMineFloor) {
          // Piso de TERRA BATIDA dos longos túneis em espinha da Mina Profunda (sem trilhos, sem água, sem minérios!)
          const isAlt = (Math.abs(t.tx + t.ty) % 2) === 0;
          g.fillStyle = isAlt ? "#4d2f18" : "#422814";
          g.fillRect(l, o, u + 1, u + 1);
          // Textura orgânica de terra pisoteada nos túneis
          g.fillStyle = T > 0.5 ? "rgba(92, 58, 33, 0.45)" : "rgba(42, 22, 9, 0.4)";
          g.beginPath();
          g.ellipse(l + u * 0.5, o + u * 0.5, u * 0.35, u * 0.24, T * Math.PI, 0, Math.PI * 2);
          g.fill();
          if (T > 0.35) {
            g.fillStyle = "#694122";
            g.fillRect(l + 5 + T * 14, o + 6 + (1 - T) * 14, 3, 2.2);
          }
          return;
        } else if (t.isDungeonWall) {
          if (t.dungeonRole === "cave_tunnel_wall" || t.dungeonRole === "bone_cavern_wall") {
            // Parede natural de caverna rochosa escura e irregular
            g.fillStyle = "#070a10";
            g.fillRect(l, o, u, u);
            g.fillStyle = "#111827";
            g.fillRect(l + 1, o + 1, u - 2, u - 2);
            g.strokeStyle = "rgba(2, 6, 23, 0.95)";
            g.lineWidth = 1;
            g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
            if (T > 0.5) {
              g.fillStyle = "rgba(71, 85, 105, 0.25)";
              g.fillRect(l + 3, o + 3, u - 6, 2);
            }
          } else {
            // Fundação e base maciça da muralha do calabouço
            g.fillStyle = "#090d16";
            g.fillRect(l, o, u, u);
            g.fillStyle = "#1e293b";
            g.fillRect(l + 1, o + 1, u - 2, u - 2);
            g.strokeStyle = "rgba(15, 23, 42, 0.9)";
            g.lineWidth = 1;
            g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
          }
        } else if (t.isDungeonFloor) {
          if (t.dungeonRole === "bone_cavern_floor" || t.dungeonRole === "cave_tunnel_floor") {
            // Piso natural de caverna úmida e pedregosa com fragmentos de ossos
            const isAlt = (Math.abs(t.tx * 7 + t.ty * 13) % 2) === 0;
            g.fillStyle = isAlt ? "#141923" : "#0f141c";
            g.fillRect(l, o, u, u);
            // Cascalho miúdo e fragmentos de ossos no piso
            if (T > 0.35) {
              g.fillStyle = "rgba(203, 213, 225, 0.22)";
              g.beginPath();
              g.arc(l + u * 0.35, o + u * 0.65, 1.4, 0, Math.PI * 2);
              g.arc(l + u * 0.75, o + u * 0.3, 1.1, 0, Math.PI * 2);
              g.fill();
            }
            if (T > 0.65) {
              g.strokeStyle = "rgba(2, 6, 23, 0.6)";
              g.lineWidth = 0.8;
              g.strokeRect(l + 2, o + 2, u - 4, u - 4);
            }
          } else {
            // Lajes maciças de pedra escura do calabouço
            const isAlt = (Math.abs(t.tx + t.ty) % 2) === 0;
            g.fillStyle = isAlt ? "#1e293b" : "#172033";
            g.fillRect(l, o, u, u);

            // Borda de argamassa escura / rejunte entre as lajes
            g.strokeStyle = "rgba(2, 6, 23, 0.75)";
            g.lineWidth = 1.2;
            g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);
          }

          // Detalhes por sala
          if (t.dungeonRole === "torture_floor") {
            // Manchas escuras de sangue antigo impregnado na rocha
            if (T > 0.45) {
              g.fillStyle = "rgba(127, 29, 29, 0.45)";
              g.beginPath();
              g.ellipse(l + u * 0.5, o + u * 0.5, u * 0.3, u * 0.22, T * 3, 0, Math.PI * 2);
              g.fill();
            }
          } else if (t.dungeonRole === "latrine_floor") {
            // Umidade pútrida e limo verde no chão da fossa
            g.fillStyle = "rgba(20, 83, 45, 0.35)";
            g.fillRect(l + 2, o + 2, u - 4, u - 4);
            if (T > 0.6) {
              g.fillStyle = "rgba(2, 6, 23, 0.5)";
              g.beginPath();
              g.arc(l + u * 0.5, o + u * 0.5, 3, 0, Math.PI * 2);
              g.fill();
            }
          } else if (t.dungeonRole === "cell_floor") {
            // Poeira e marcas de grilhões arrastados
            if (T > 0.5) {
              g.fillStyle = "rgba(2, 6, 23, 0.4)";
              g.fillRect(l + 4, o + 4, u - 8, 2);
            }
          }

          // Fissuras ou rachaduras nas lajes
          if (T > 0.7) {
            g.strokeStyle = "rgba(15, 23, 42, 0.9)";
            g.lineWidth = 0.9;
            g.beginPath();
            g.moveTo(l + u * 0.2, o + u * 0.3);
            g.lineTo(l + u * 0.5, o + u * 0.6);
            g.lineTo(l + u * 0.8, o + u * 0.55);
            g.stroke();
          }
        } else if (t.isSnowCity) {
          drawSnowCityFloor(g, l, o, u, t, this.animTimer);
        } else if (t.isPortCity && typeof drawPortCityFloor === "function") {
          drawPortCityFloor(g, l, o, u, t, this.animTimer);
        } else if (t.isGreekRuin) {
          // Pisos em tons de Terracota Helênica, Travertino Dourado e Calcário Escuro para contrastar fortemente
          // com as Paredes de Mármore Branco/Marfim e Topo de Telha/Cornija!
          const rx = t.greekRuinRx || 0,
            ry = t.greekRuinRy || 0,
            role = t.greekRuinRole || "floor",
            floorFailed = !!t.greekFloorFailed,
            isChecker = (Math.abs(t.tx + t.ty) % 2) === 0;

          if (role === "unfinished_foundation" || role === "rubble_floor" || role === "rubble_wall") {
            // Brecha de parede caída / alicerce inacabado: terra ocre escura com fragmentos de pedra
            g.fillStyle = "rgba(120, 53, 15, 0.38)";
            g.fillRect(l + 2, o + 2, u - 4, u - 4);
            g.fillStyle = "#b45309";
            g.fillRect(l + 5 + T * 12, o + 6 + T * 10, 6, 5);
            g.fillStyle = "#78716c";
            g.fillRect(l + 16 - T * 8, o + 18 - T * 6, 7, 5);
          } else if (floorFailed && role !== "mosaic_center" && role !== "steps") {
            // PISO FALHADO: O chão natural do bioma (grama/terra) fica visível por baixo e desenhamos
            // apenas cacos/pedaços quebrados de ladrilho de terracota/travertino nas bordas do bloco!
            const slabColor =
              role === "house_floor"
                ? isChecker
                  ? "#b45309"
                  : "#92400e"
                : isChecker
                  ? "#a16207"
                  : "#854d0e";
            if (T < 0.35) {
              // Seção de piso que falhou quase por completo (apenas um canto de laje quebrada restou)
              g.fillStyle = slabColor;
              g.beginPath();
              g.moveTo(l, o);
              g.lineTo(l + u * 0.58, o);
              g.lineTo(l + u * 0.42, o + u * 0.48);
              g.lineTo(l, o + u * 0.62);
              g.closePath();
              g.fill();
              g.strokeStyle = "rgba(69, 26, 3, 0.65)";
              g.lineWidth = 1.2;
              g.stroke();
            } else {
              // Laje com buraco irregular no meio mostrando a grama/terra por baixo
              g.fillStyle = slabColor;
              g.fillRect(l, o, u * 0.46, u);
              g.fillRect(l + u * 0.64, o, u * 0.36, u * 0.72);
              g.strokeStyle = "rgba(69, 26, 3, 0.6)";
              g.lineWidth = 1.1;
              g.strokeRect(l + 0.5, o + 0.5, u * 0.45, u - 1);
              g.strokeRect(l + u * 0.64, o + 0.5, u * 0.35, u * 0.71);
            }
          } else {
            // Paleta de Piso Quente e Escura (Terracota, Travertino Âmbar e Laje Basáltica nas Ruas)
            // para nunca confundir com o Mármore Branco/Gelo das Paredes!
            g.fillStyle =
              role === "steps" || role === "porch"
                ? "#78716c"
                : role === "temple_floor"
                  ? isChecker
                    ? "#a16207"
                    : "#854d0e"
                  : role === "house_floor"
                    ? isChecker
                      ? "#b45309"
                      : "#9a3412"
                    : role === "road"
                      ? "#57534e"
                      : isChecker
                        ? "#92400e"
                        : "#78350f";
            g.fillRect(l, o, u + 1, u + 1);

            // Rejunte escuro profundo entre os ladrilhos do piso
            g.strokeStyle = "rgba(41, 37, 36, 0.55)";
            g.lineWidth = 1.2;
            g.strokeRect(l + 0.5, o + 0.5, u - 1, u - 1);

            // Detalhe interno de mosaico de ladrilho
            g.strokeStyle = "rgba(254, 243, 199, 0.16)";
            g.lineWidth = 0.8;
            g.strokeRect(l + 2.5, o + 2.5, u - 5, u - 5);

            // Tapete / Friso de Meandro Grego Azul-Olímpico e Ouro nos corredores principais (|rx| <= 1 ou |ry| <= 1)
            if (Math.abs(rx) <= 1 || Math.abs(ry) <= 1) {
              g.fillStyle =
                role === "house_floor"
                  ? "rgba(120, 53, 15, 0.42)"
                  : "rgba(12, 74, 110, 0.45)";
              g.fillRect(l + 3, o + 3, u - 6, u - 6);
              g.strokeStyle = "rgba(251, 191, 36, 0.65)";
              g.lineWidth = 1.2;
              g.strokeRect(l + 4, o + 4, u - 8, u - 8);
            }

            // Mosaico Helênico / Implúvio da Casa ou Centro do Salão
            if (role === "mosaic_center") {
              g.fillStyle = "#0369a1";
              g.beginPath();
              g.arc(l + u / 2, o + u / 2, u * 0.38, 0, Math.PI * 2);
              g.fill();
              g.strokeStyle = "#fbbf24";
              g.lineWidth = 2.2;
              g.stroke();
            }

            // Degraus esculpidos na Escadaria
            if (role === "steps") {
              for (let sy = 4; sy < u; sy += 8) {
                g.fillStyle = "#a8a29e";
                g.fillRect(l + 1, o + sy, u - 2, 3);
                g.fillStyle = "#44403c";
                g.fillRect(l + 1, o + sy + 3, u - 2, 2);
              }
            }
          }

          // Fendas e musgo mediterrâneo em algumas lajes
          if (T > 0.66) {
            g.fillStyle = "rgba(21, 128, 61, 0.42)";
            g.beginPath();
            g.arc(l + 6 + T * 16, o + 7 + T * 14, 2.5, 0, Math.PI * 2);
            g.fill();
          }
        } else if (y.id === BiomeId.BEACH)
          ((g.fillStyle = "rgba(212, 176, 98, 0.45)"),
            g.fillRect(l + 3, o + T * 18, u - 6, 2),
            (g.fillStyle = "rgba(254, 243, 199, 0.35)"),
            g.fillRect(l + 5, o + T * 18 + 2, u - 10, 1),
            T > 0.72 &&
              ((g.fillStyle = "rgba(255, 247, 237, 0.92)"),
              g.beginPath(),
              g.arc(l + 6 + T * 18, o + 8 + T * 14, 2.2, 0, Math.PI * 2),
              g.fill(),
              (g.fillStyle = "rgba(249, 115, 22, 0.6)"),
              g.beginPath(),
              g.arc(l + 6 + T * 18, o + 8 + T * 14, 1, 0, Math.PI * 2),
              g.fill()));
        else if (
          y.id === BiomeId.MEADOW ||
          y.id === BiomeId.FOREST ||
          y.id === BiomeId.DEEP_FOREST
        ) {
          const S = l + 5 + T * 18,
            p = o + 8 + T * 14;
          ((g.fillStyle = "rgba(0, 0, 0, 0.15)"),
            g.beginPath(),
            g.ellipse(S + 1, p + 1, 4, 1.8, 0, 0, Math.PI * 2),
            g.fill(),
            (g.fillStyle = y.groundAccentColor),
            g.beginPath(),
            g.moveTo(S - 3, p),
            g.lineTo(S - 5, p - 6),
            g.lineTo(S - 2, p - 3),
            g.lineTo(S, p - 7),
            g.lineTo(S + 2, p - 4),
            g.lineTo(S + 4, p - 8),
            g.lineTo(S + 3, p),
            g.fill(),
            (g.fillStyle = "#86efac"),
            g.beginPath(),
            g.arc(S - 5, p - 6, 0.8, 0, Math.PI * 2),
            g.arc(S, p - 7, 0.8, 0, Math.PI * 2),
            g.arc(S + 4, p - 8, 0.8, 0, Math.PI * 2),
            g.fill());
        } else if (y.id === BiomeId.DESERT)
          ((g.fillStyle = "rgba(180, 130, 60, 0.35)"),
            g.fillRect(l + 2, o + (t.tx % 3) * 8, u - 4, 2.5),
            (g.fillStyle = "rgba(254, 240, 138, 0.25)"),
            g.fillRect(l + 2, o + (t.tx % 3) * 8 - 1.5, u - 4, 1.5));
        else if (y.id === BiomeId.OASIS) {
          const S = l + 5 + T * 18,
            p = o + 8 + T * 14;
          if (
            ((g.fillStyle = "rgba(21, 128, 61, 0.16)"),
            g.beginPath(),
            g.ellipse(
              l + 8 + T * 14,
              o + 7 + ((T * 17) % 1) * 14,
              7 + T * 4,
              4 + T * 3,
              T * Math.PI,
              0,
              Math.PI * 2,
            ),
            g.fill(),
            T > 0.48 &&
              ((g.fillStyle = "rgba(4, 120, 87, 0.14)"),
              g.beginPath(),
              g.ellipse(
                l + 20 - T * 8,
                o + 20 - T * 8,
                5 + T * 3,
                3.5 + T * 2,
                -T * Math.PI,
                0,
                Math.PI * 2,
              ),
              g.fill()),
            (g.fillStyle = "rgba(6, 78, 59, 0.22)"),
            g.beginPath(),
            g.ellipse(S + 1, p + 1, 4.5, 2, 0, 0, Math.PI * 2),
            g.fill(),
            (g.fillStyle = "#15803d"),
            g.beginPath(),
            g.moveTo(S - 4, p),
            g.quadraticCurveTo(S - 6, p - 4, S - 5, p - 7),
            g.quadraticCurveTo(S - 3, p - 3, S - 2, p),
            g.quadraticCurveTo(S, p - 6, S + 1, p - 9),
            g.quadraticCurveTo(S + 2, p - 4, S + 3, p),
            g.quadraticCurveTo(S + 5, p - 3, S + 6, p - 6),
            g.quadraticCurveTo(S + 4, p - 2, S + 4, p),
            g.closePath(),
            g.fill(),
            (g.fillStyle = "#86efac"),
            g.fillRect(S - 5, p - 7, 1.2, 1.8),
            g.fillRect(S + 1, p - 9, 1.2, 2),
            g.fillRect(S + 5, p - 6, 1.2, 1.6),
            T > 0.4)
          ) {
            const j = S + 5,
              P = p - 4,
              A = T > 0.78 ? "#f43f5e" : T > 0.6 ? "#fb923c" : "#38bdf8";
            ((g.fillStyle = A),
              g.beginPath(),
              g.arc(j - 1.8, P, 1.7, 0, Math.PI * 2),
              g.arc(j + 1.8, P, 1.7, 0, Math.PI * 2),
              g.arc(j, P - 1.8, 1.7, 0, Math.PI * 2),
              g.arc(j, P + 1.8, 1.7, 0, Math.PI * 2),
              g.fill(),
              (g.fillStyle = "#fef08a"),
              g.beginPath(),
              g.arc(j, P, 1, 0, Math.PI * 2),
              g.fill());
          }
        } else if (y.id === BiomeId.CANYON)
          ((g.fillStyle = "rgba(124, 45, 18, 0.45)"),
            g.fillRect(l + 1, o + (t.tx % 4) * 7, u - 2, 3),
            (g.fillStyle = "rgba(251, 146, 60, 0.3)"),
            g.fillRect(l + 2, o + (t.tx % 4) * 7 + 2.5, u - 4, 1.2),
            (g.fillStyle = "#7c2d12"),
            g.fillRect(l + 6 + T * 14, o + 4 + T * 16, 3.5, 2.5));
        else if (y.id === BiomeId.MOUNTAIN_25D) {
          // Todo o bioma está exatamente no mesmo nível de platô elevado (cor uniforme em todo o interior)
          g.fillStyle = "#64748b";
          g.fillRect(l, o, u + 1.2, u + 1.2);
          // Borda externa do platô elevado apenas quando faz fronteira com outro bioma
          const nTop = this.engine.getTile(t.tx, t.ty - 1);
          const nBot = this.engine.getTile(t.tx, t.ty + 1);
          const nLeft = this.engine.getTile(t.tx - 1, t.ty);
          const nRight = this.engine.getTile(t.tx + 1, t.ty);
          if (nTop.biome.id !== BiomeId.MOUNTAIN_25D) {
            g.fillStyle = "#e2e8f0";
            g.fillRect(l, o, u + 1, 3);
            g.fillStyle = "rgba(15, 23, 42, 0.35)";
            g.fillRect(l, o + 3, u + 1, 2.5);
          }
          if (nBot.biome.id !== BiomeId.MOUNTAIN_25D && !t.isCliffWall) {
            g.fillStyle = "#f1f5f9";
            g.fillRect(l, o + u - 6, u + 1, 2.5);
            g.fillStyle = "#0f172a";
            g.fillRect(l, o + u - 3.5, u + 1, 3.5);
          }
          if (nLeft.biome.id !== BiomeId.MOUNTAIN_25D) {
            g.fillStyle = "rgba(248, 250, 252, 0.32)";
            g.fillRect(l, o, 3, u);
          }
          if (nRight.biome.id !== BiomeId.MOUNTAIN_25D) {
            g.fillStyle = "rgba(15, 23, 42, 0.38)";
            g.fillRect(l + u - 3.5, o, 3.5, u);
          }
          g.fillStyle = "rgba(30, 41, 59, 0.26)";
          g.fillRect(l + 3, o + ((t.tx + t.ty) % 3) * 9 + 4, u - 6, 2);
          g.fillStyle = "rgba(241, 245, 249, 0.22)";
          g.fillRect(l + 4, o + ((t.tx + t.ty) % 3) * 9 + 2.8, u - 8, 1.2);
        }
        else if (y.id === BiomeId.GLACIER) {
          const S =
            (Math.sin(this.animTimer * 5 + l * 0.2 + o * 0.2) + 1) * 0.5;
          ((g.fillStyle = "rgba(186, 230, 253, 0.28)"),
            g.beginPath(),
            g.ellipse(
              l + 10 + T * 10,
              o + 10 + T * 10,
              8 + T * 3,
              5 + T * 2,
              T * Math.PI,
              0,
              Math.PI * 2,
            ),
            g.fill(),
            (g.strokeStyle = "#0284c7"),
            (g.lineWidth = 1.3),
            g.beginPath(),
            g.moveTo(l + 4, o + 5),
            g.lineTo(l + u / 2, o + u - 7),
            g.lineTo(l + u - 4, o + u - 3),
            g.stroke(),
            f ||
              ((g.fillStyle = `rgba(255, 255, 255, ${0.5 + S * 0.5})`),
              g.beginPath(),
              g.arc(l + 10 + T * 12, o + 8 + T * 14, 1.5, 0, Math.PI * 2),
              g.fill()));
        } else if (y.id === BiomeId.SNOW_TAIGA || y.id === BiomeId.SNOW_PEAK) {
          if (
            ((g.fillStyle = "rgba(255, 255, 255, 0.75)"),
            g.fillRect(l + 4, o + 4, 8, 2.5),
            g.fillRect(l + 14, o + 16, 10, 2.5),
            !f && T > 0.6)
          ) {
            const S = (Math.sin(this.animTimer * 4 + l) + 1) * 0.5;
            ((g.fillStyle = `rgba(224, 242, 254, ${0.4 + S * 0.5})`),
              g.beginPath(),
              g.arc(l + 8 + T * 14, o + 6 + T * 16, 1.2, 0, Math.PI * 2),
              g.fill());
          }
        } else if (y.id === BiomeId.VOLCANIC) {
          if (!f) {
            const S = (Math.sin(this.animTimer * 3 + l + o) + 1) * 0.5;
            ((g.strokeStyle = `rgba(239, 68, 68, ${0.65 + S * 0.35})`),
              (g.lineWidth = 1.8),
              g.beginPath(),
              g.moveTo(l + 3, o + 3),
              g.lineTo(l + u / 2, o + u / 2),
              g.lineTo(l + u - 5, o + u - 3),
              g.stroke(),
              (g.strokeStyle = `rgba(254, 240, 138, ${0.5 + S * 0.4})`),
              (g.lineWidth = 0.8),
              g.stroke());
          }
        } else if (y.id === BiomeId.CAVE_WALL)
          ((g.fillStyle = "#11100f"),
            g.fillRect(l, o, u, u),
            (g.fillStyle = "#292524"),
            g.fillRect(l, o, u, 4),
            (g.strokeStyle = "#000000"),
            (g.lineWidth = 1.4),
            g.beginPath(),
            g.moveTo(l + 4, o + T * 18),
            g.lineTo(l + 16, o + 10 + T * 10),
            g.lineTo(l + u - 4, o + 8 + T * 14),
            g.stroke(),
            (g.fillStyle = "rgba(0, 0, 0, 0.45)"),
            g.fillRect(l, o + u - 6, u, 6));
        else if (y.id === BiomeId.DESERT_CAVE_WALL) {
          g.fillStyle = "#4a321a";
          g.fillRect(l, o, u, u);
          g.fillStyle = "#6b4725";
          g.fillRect(l, o, u, 4);
          g.strokeStyle = "#29180b";
          g.lineWidth = 1.4;
          g.beginPath();
          g.moveTo(l + 3, o + T * 16);
          g.lineTo(l + 15, o + 8 + T * 8);
          g.lineTo(l + u - 3, o + 7 + T * 12);
          g.stroke();
          g.fillStyle = "rgba(180, 83, 9, 0.25)";
          g.fillRect(l, o + u - 6, u, 6);
        } else if (y.id === BiomeId.DESERT_CAVE_FLOOR) {
          g.fillStyle = "rgba(180, 83, 9, 0.24)";
          g.fillRect(l + 5 + T * 12, o + 5 + T * 10, 4, 3);
          if (T > 0.5) {
            g.fillStyle = "rgba(254, 240, 138, 0.18)";
            g.fillRect(l + 7 + T * 9, o + 3 + T * 15, 3, 2);
          }
        } else if (y.id === BiomeId.CAVE_FLOOR)
          ((g.fillStyle = "rgba(0, 0, 0, 0.28)"),
            g.fillRect(l + 6 + T * 14, o + 6 + T * 12, 4, 3),
            T > 0.6 &&
              ((g.fillStyle = "rgba(255, 255, 255, 0.08)"),
              g.fillRect(l + 8 + T * 10, o + 4 + T * 16, 3, 2)));
        else if (y.id === BiomeId.CAVE_CRYSTAL) {
          if (t.isGeodeInterior) {
            const isAlt = (Math.abs(t.tx * 3 + t.ty * 5) % 2) === 0;
            g.fillStyle = isAlt ? "#1e1b4b" : "#17143a";
            g.fillRect(l, o, u + 1, u + 1);
            g.strokeStyle = "rgba(139, 92, 246, 0.22)";
            g.lineWidth = 1;
            g.strokeRect(l + 1, o + 1, u - 2, u - 2);
            if (T > 0.35) {
              g.fillStyle = T > 0.68 ? "rgba(192, 132, 252, 0.22)" : "rgba(56, 189, 248, 0.18)";
              g.beginPath();
              g.moveTo(l + 4 + T * 14, o + 6 + (1 - T) * 14);
              g.lineTo(l + 9 + T * 14, o + 4 + (1 - T) * 14);
              g.lineTo(l + 7 + T * 14, o + 11 + (1 - T) * 14);
              g.closePath();
              g.fill();
            }
          }
          if (!f) {
            const S = (Math.sin(this.animTimer * 3 + l * 0.1) + 1) * 0.5;
            ((g.fillStyle = `rgba(192, 132, 252, ${0.35 + S * 0.45})`),
              g.beginPath(),
              g.arc(l + 8 + T * 16, o + 8 + T * 14, 2, 0, Math.PI * 2),
              g.fill());
          }
        } else
          y.id === BiomeId.CAVE_MUSHROOM &&
            ((g.strokeStyle = "rgba(45, 212, 191, 0.35)"),
            (g.lineWidth = 1.2),
            g.beginPath(),
            g.moveTo(l + 4, o + 10 + T * 12),
            g.lineTo(l + 16, o + 8 + T * 8),
            g.lineTo(l + u - 6, o + 14 + T * 10),
            g.stroke());
        Zu(t.tx, t.ty, this.engine, t) &&
          !y.hasWater &&
          ((g.fillStyle = "rgba(30, 41, 59, 0.42)"),
          g.beginPath(),
          g.ellipse(
            l + 8 + T * 12,
            o + 10 + T * 8,
            3.2,
            2,
            0.25,
            0,
            Math.PI * 2,
          ),
          g.ellipse(
            l + 22 + T * 6,
            o + 22 + T * 6,
            2.6,
            1.8,
            -0.3,
            0,
            Math.PI * 2,
          ),
          g.fill(),
          (g.fillStyle = "rgba(203, 213, 225, 0.35)"),
          g.beginPath(),
          g.ellipse(
            l + 14 + T * 8,
            o + 25 + T * 5,
            2.2,
            1.4,
            0.1,
            0,
            Math.PI * 2,
          ),
          g.fill());
      }
      getWaterBase(t) {
        const q = Math.max(0.5, Math.min(1, window.__rpgQuality?.water ?? 1)),
          r = Math.max(8, Math.round(36 * q));
        let l = this.waterBaseCache.get(t + "_" + q);
        if (l) return l;
        const o = document.createElement("canvas");
        o.width = o.height = r;
        const u = o.getContext("2d"),
          m = u.createLinearGradient(0, 0, 0, r),
          c = {
            DEEP_OCEAN: ["#0c223f", "#08172c"],
            COAST_WATER: ["#0284c7", "#0ea5e9", "#0284c7"],
            OASIS_LAKE: ["#06b6d4", "#22d3ee", "#0891b2"],
            MEADOW_LAKE: ["#0284c7", "#38bdf8", "#0369a1"],
            FOREST_LAKE: ["#0f766e", "#14b8a6", "#0d9488"],
            SWAMP_LAKE: ["#14532d", "#166534", "#134e4a"],
            SAVANNA_LAKE: ["#0369a1", "#0284c7", "#075985"],
            TAIGA_LAKE: ["#0c4a6e", "#0284c7", "#075985"],
            GLACIER_LAKE: ["#0891b2", "#38bdf8", "#06b6d4"],
            CAVE_LAKE: ["#0f172a", "#0369a1", "#1e1b4b"],
          }[t] || ["#0284c7", "#0ea5e9", "#0284c7"];
        (m.addColorStop(0, c[0]),
          c.length > 2 && m.addColorStop(0.5, c[1]),
          m.addColorStop(1, c[c.length - 1]),
          (u.fillStyle = m),
          u.fillRect(0, 0, r + 2, r + 2),
          this.waterBaseCache.set(t + "_" + q, o));
        return o;
      }
      renderWaterTile(t, l, o, u, m) {
        const c = this.ctx,
          f = t.biome.id,
          g = f === BiomeId.DEEP_OCEAN,
          y = f === BiomeId.COAST_WATER,
          w = f === BiomeId.OASIS_LAKE,
          v = f === BiomeId.MEADOW_LAKE,
          T = f === BiomeId.FOREST_LAKE,
          S = f === BiomeId.SWAMP_LAKE,
          p = f === BiomeId.SAVANNA_LAKE,
          j = f === BiomeId.TAIGA_LAKE,
          P = f === BiomeId.GLACIER_LAKE,
          A = f === BiomeId.CAVE_LAKE,
          x = this.animTimer,
          M = (m == null ? void 0 : m.timeOfDay) ?? 0.5,
          $ = this.getWaterBase(f);
        if (
          (c.drawImage($, l, o, u + 1.2, u + 1.2),
          Fs(t.tx, t.ty, this.engine, t))
        ) {
          ((c.fillStyle = "rgba(154, 52, 18, 0.32)"),
            c.fillRect(l, o, u + 1.2, u + 1.2));
          const X = t.detailHash;
          ((c.fillStyle = "rgba(124, 45, 18, 0.36)"),
            c.beginPath(),
            c.ellipse(
              l + u * 0.5 + (X * 8 - 4),
              o + u * 0.5 + (X * 6 - 3),
              u * 0.36,
              u * 0.24,
              X * 2,
              0,
              Math.PI * 2,
            ),
            c.fill());
        } else
          w
            ? ((c.fillStyle = "rgba(251, 191, 36, 0.16)"),
              c.fillRect(l, o, u + 1.2, u + 1.2))
            : p
              ? ((c.fillStyle = "rgba(217, 119, 6, 0.14)"),
                c.fillRect(l, o, u + 1.2, u + 1.2))
              : S
                ? ((c.fillStyle = "rgba(20, 83, 45, 0.22)"),
                  c.fillRect(l, o, u + 1.2, u + 1.2))
                : T
                  ? ((c.fillStyle = "rgba(13, 148, 136, 0.12)"),
                    c.fillRect(l, o, u + 1.2, u + 1.2))
                  : P
                    ? ((c.fillStyle = "rgba(224, 242, 254, 0.22)"),
                      c.fillRect(l, o, u + 1.2, u + 1.2))
                    : y &&
                      ((c.fillStyle = "rgba(245, 158, 11, 0.08)"),
                      c.fillRect(l, o, u + 1.2, u + 1.2));
        if (t.isGeodeLake) {
          const alPulse = (Math.sin(x * 3.0 + t.tx * 0.7 + t.ty * 0.9) + 1) * 0.5;
          c.fillStyle = `rgba(16, 185, 129, ${0.22 + alPulse * 0.14})`;
          c.fillRect(l, o, u + 1.2, u + 1.2);
          c.fillStyle = `rgba(45, 212, 191, ${0.28 + alPulse * 0.25})`;
          c.beginPath();
          c.ellipse(
            l + u * (0.28 + t.detailHash * 0.44),
            o + u * (0.3 + ((t.detailHash * 7) % 1) * 0.4),
            4 + t.detailHash * 4,
            2.5 + t.detailHash * 2,
            t.detailHash * Math.PI,
            0,
            Math.PI * 2,
          );
          c.fill();
        }
        const K = t.tx * u,
          V = t.ty * u,
          O = Math.sin(K * 0.045 + x * 1.5 + V * 0.035) * 3 + u * 0.35;
        ((c.strokeStyle = g
          ? "rgba(56, 189, 248, 0.18)"
          : "rgba(224, 242, 254, 0.4)"),
          (c.lineWidth = g ? 1.8 : 2.2),
          c.beginPath(),
          c.moveTo(l, o + O),
          c.bezierCurveTo(
            l + u * 0.33,
            o + O + Math.sin(x * 1.8 + K * 0.06) * 2.2,
            l + u * 0.66,
            o + O - Math.cos(x * 1.8 + V * 0.06) * 2.2,
            l + u,
            o + O,
          ),
          c.stroke());
        const _ = Math.cos(K * 0.05 - x * 1.1 + V * 0.04) * 2.5 + u * 0.72;
        ((c.strokeStyle = g
          ? "rgba(30, 64, 175, 0.32)"
          : "rgba(186, 230, 253, 0.32)"),
          (c.lineWidth = 1.6),
          c.beginPath(),
          c.moveTo(l, o + _),
          c.bezierCurveTo(
            l + u * 0.38,
            o + _ - 1.8,
            l + u * 0.75,
            o + _ + 1.8,
            l + u,
            o + _,
          ),
          c.stroke());
        const se = this.engine.getTile(t.tx, t.ty - 1),
          ue = this.engine.getTile(t.tx, t.ty + 1),
          N = this.engine.getTile(t.tx - 1, t.ty),
          Ee = this.engine.getTile(t.tx + 1, t.ty),
          ne = !se.biome.hasWater,
          ke = !ue.biome.hasWater,
          G = !N.biome.hasWater,
          de = !Ee.biome.hasWater;
        if (ne || ke || G || de) {
          const C =
            3.5 +
            (Math.sin(x * 2.2 + (t.tx * 0.9 + t.ty * 0.7)) * 0.5 + 0.5) * 3.5;
          if (ne) {
            ((c.fillStyle = "rgba(56, 189, 248, 0.45)"),
              c.fillRect(l, o, u, C + 2),
              (c.fillStyle = "rgba(255, 255, 255, 0.88)"));
            for (let I = 0; I < u; I += 7) {
              const be = o + C + Math.sin(I * 0.6 + x * 2.8) * 1.5;
              (c.beginPath(), c.arc(l + I + 3.5, be, 3, 0, Math.PI), c.fill());
            }
            ((c.fillStyle = "rgba(224, 242, 254, 0.8)"),
              c.fillRect(l + 5 + t.detailHash * 12, o + C + 2, 2.5, 2.5),
              c.fillRect(l + 22, o + C + 1.5, 2, 2));
          }
          if (ke) {
            ((c.fillStyle = "rgba(56, 189, 248, 0.45)"),
              c.fillRect(l, o + u - C - 2, u, C + 2),
              (c.fillStyle = "rgba(255, 255, 255, 0.88)"));
            for (let I = 0; I < u; I += 7) {
              const be = o + u - C - Math.sin(I * 0.6 + x * 2.8) * 1.5;
              (c.beginPath(), c.arc(l + I + 3.5, be, 3, Math.PI, 0), c.fill());
            }
            ((c.fillStyle = "rgba(224, 242, 254, 0.8)"),
              c.fillRect(l + 8 + t.detailHash * 14, o + u - C - 3, 2.5, 2.5));
          }
          if (G) {
            ((c.fillStyle = "rgba(56, 189, 248, 0.45)"),
              c.fillRect(l, o, C + 2, u),
              (c.fillStyle = "rgba(255, 255, 255, 0.88)"));
            for (let I = 0; I < u; I += 7) {
              const be = l + C + Math.sin(I * 0.6 + x * 2.8) * 1.5;
              (c.beginPath(),
                c.arc(be, o + I + 3.5, 3, Math.PI * 0.5, Math.PI * 1.5),
                c.fill());
            }
            ((c.fillStyle = "rgba(224, 242, 254, 0.8)"),
              c.fillRect(l + C + 2, o + 10 + t.detailHash * 10, 2.5, 2.5));
          }
          if (de) {
            ((c.fillStyle = "rgba(56, 189, 248, 0.45)"),
              c.fillRect(l + u - C - 2, o, C + 2, u),
              (c.fillStyle = "rgba(255, 255, 255, 0.88)"));
            for (let I = 0; I < u; I += 7) {
              const be = l + u - C - Math.sin(I * 0.6 + x * 2.8) * 1.5;
              (c.beginPath(),
                c.arc(be, o + I + 3.5, 3, -Math.PI * 0.5, Math.PI * 0.5),
                c.fill());
            }
            ((c.fillStyle = "rgba(224, 242, 254, 0.8)"),
              c.fillRect(l + u - C - 3, o + 12 + t.detailHash * 10, 2.5, 2.5));
          }
        }
        if (y) {
          if (se.biome.id === BiomeId.DEEP_OCEAN) {
            const X = c.createLinearGradient(l, o, l, o + 8);
            (X.addColorStop(0, "rgba(12, 34, 63, 0.65)"),
              X.addColorStop(1, "rgba(12, 34, 63, 0)"),
              (c.fillStyle = X),
              c.fillRect(l, o, u, 8));
          }
          if (ue.biome.id === BiomeId.DEEP_OCEAN) {
            const X = c.createLinearGradient(l, o + u, l, o + u - 8);
            (X.addColorStop(0, "rgba(12, 34, 63, 0.65)"),
              X.addColorStop(1, "rgba(12, 34, 63, 0)"),
              (c.fillStyle = X),
              c.fillRect(l, o + u - 8, u, 8));
          }
          if (N.biome.id === BiomeId.DEEP_OCEAN) {
            const X = c.createLinearGradient(l, o, l + 8, o);
            (X.addColorStop(0, "rgba(12, 34, 63, 0.65)"),
              X.addColorStop(1, "rgba(12, 34, 63, 0)"),
              (c.fillStyle = X),
              c.fillRect(l, o, 8, u));
          }
          if (Ee.biome.id === BiomeId.DEEP_OCEAN) {
            const X = c.createLinearGradient(l + u, o, l + u - 8, o);
            (X.addColorStop(0, "rgba(12, 34, 63, 0.65)"),
              X.addColorStop(1, "rgba(12, 34, 63, 0)"),
              (c.fillStyle = X),
              c.fillRect(l + u - 8, o, 8, u));
          }
        }
        const isWithin3OfLand = (() => {
          if (!y) return !0;
          if (ne || ke || G || de) return !0;
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              if (Math.max(Math.abs(dx), Math.abs(dy)) > 3) continue;
              const nt = this.engine.getTile(t.tx + dx, t.ty + dy);
              if (nt && nt.biome && !nt.biome.hasWater) return !0;
            }
          }
          return !1;
        })();
        if (
          !t.isPortPier &&
          !(t.prop && t.prop.kind && t.prop.kind.startsWith("port_city_")) &&
          (w || v || T || S || (y && isWithin3OfLand)) &&
          t.detailHash > (y ? 0.87 : 0.78)
        ) {
          const X = Math.sin(x * 1.6 + t.detailHash * 8) * 1.5,
            C = l + 8 + t.detailHash * 16,
            I = o + 8 + t.detailHash * 14 + X,
            be = S ? 4.5 : 5.5;
          ((c.fillStyle = "rgba(2, 44, 34, 0.35)"),
            c.beginPath(),
            c.arc(C + 1, I + 2, be, 0, Math.PI * 2),
            c.fill(),
            (c.fillStyle = S ? "#166534" : "#15803d"),
            c.beginPath(),
            c.arc(C, I, be, 0.25 * Math.PI, 1.95 * Math.PI),
            c.lineTo(C, I),
            c.fill(),
            (c.strokeStyle = S ? "#4ade80" : "#86efac"),
            (c.lineWidth = 0.8),
            c.stroke(),
            t.detailHash > 0.81 &&
              ((c.fillStyle = S ? "#f3e8ff" : "#fdf2f8"),
              c.beginPath(),
              c.arc(C - 1, I - 2, 2.2, 0, Math.PI * 2),
              c.arc(C + 2, I - 1, 2.2, 0, Math.PI * 2),
              c.arc(C, I + 1.5, 2.2, 0, Math.PI * 2),
              c.fill(),
              (c.fillStyle = w ? "#ec4899" : S ? "#c084fc" : "#f472b6"),
              c.beginPath(),
              c.arc(C - 1, I - 2.5, 1.2, 0, Math.PI * 2),
              c.arc(C + 2.5, I - 1, 1.2, 0, Math.PI * 2),
              c.fill(),
              (c.fillStyle = "#facc15"),
              c.beginPath(),
              c.arc(C + 0.5, I - 0.5, 1.2, 0, Math.PI * 2),
              c.fill()));
        }
        if ((P || (j && t.detailHash > 0.68)) && t.detailHash > 0.52) {
          const X = Math.sin(x * 1.3 + t.detailHash * 6) * 1,
            C = l + 6 + t.detailHash * 18,
            I = o + 6 + t.detailHash * 16 + X;
          ((c.fillStyle = "rgba(241, 245, 249, 0.88)"),
            c.beginPath(),
            c.moveTo(C, I),
            c.lineTo(C + 9, I - 2),
            c.lineTo(C + 13, I + 4),
            c.lineTo(C + 7, I + 9),
            c.lineTo(C - 2, I + 6),
            c.closePath(),
            c.fill(),
            (c.strokeStyle = "#bae6fd"),
            (c.lineWidth = 1),
            c.stroke(),
            (c.fillStyle = "#ffffff"),
            c.fillRect(C + 2, I + 1, 4, 2));
        }
        if (
          (w || v || T || S || p) &&
          (ne || ke || G || de) &&
          t.detailHash > 0.42
        ) {
          const X = Math.sin(x * 2.2 + t.detailHash * 9) * 1.2,
            C = l + (G ? 3 : de ? u - 6 : 8 + t.detailHash * 12),
            I = o + (ne ? 3 : ke ? u - 8 : 8 + t.detailHash * 10);
          ((c.strokeStyle = S ? "#14532d" : p ? "#78350f" : "#166534"),
            (c.lineWidth = 1.2),
            c.beginPath(),
            c.moveTo(C, I + 8),
            c.lineTo(C + X * 0.7, I - 3),
            c.moveTo(C + 4, I + 9),
            c.lineTo(C + 4 - X * 0.5, I - 1),
            c.stroke(),
            (c.fillStyle = "#451a03"),
            c.fillRect(C + X * 0.7 - 1.2, I - 4, 2.5, 5));
        }
        const oe = M >= 0.22 && M <= 0.72,
          Ne = (M > 0.18 && M < 0.22) || (M > 0.72 && M < 0.82);
        if (t.detailHash > (g ? 0.80 : 0.38)) {
          const X = Math.sin(x * 3.2 + t.detailHash * 18 + t.tx * 0.8);
          if (X > 0.45) {
            const C = (X - 0.45) / 0.55,
              I = l + 6 + t.detailHash * 22,
              be = o + 8 + t.detailHash * 18,
              Me = 2 + C * 2.5;
            let Te = `rgba(255, 255, 255, ${C * 0.9})`;
            (Ne
              ? (Te = `rgba(254, 215, 170, ${C * 0.95})`)
              : oe || (Te = `rgba(224, 242, 254, ${C * 0.5})`),
              (c.strokeStyle = Te),
              (c.lineWidth = 1.2),
              c.beginPath(),
              c.moveTo(I - Me, be),
              c.lineTo(I + Me, be),
              c.moveTo(I, be - Me),
              c.lineTo(I, be + Me),
              c.stroke(),
              (c.fillStyle = Te),
              c.fillRect(I - 0.75, be - 0.75, 1.5, 1.5));
          }
        }
        if (t.isPortCity && (t.isPortPier || t.isPortBoatDeck) && typeof drawPortCityFloor === "function") {
          drawPortCityFloor(c, l, o, u, t, this.animTimer);
        }
      }
      getSunVector(t = 0.5) {
        if (this.engine.isUnderground)
          return {
            dx: 0,
            dy: 0.35,
            length: 0.3,
            shadowAlpha: 0.35,
            shadowColor: "rgba(0, 0, 0, 0.4)",
            isDay: !1,
          };
        if (t >= 0.2 && t <= 0.8) {
          const o = (t - 0.2) / 0.6,
            u = o * Math.PI,
            m = (o - 0.5) * 2.2,
            c = Math.sin(u),
            f = Math.max(0.35, Math.min(2.2, 0.45 + (1 - c) * 1.6));
          let g = "rgba(15, 23, 42, 0.28)";
          return (
            (o < 0.18 || o > 0.82) && (g = "rgba(30, 18, 48, 0.32)"),
            {
              dx: m,
              dy: 0.5 * (1 - c * 0.3),
              length: f,
              shadowAlpha: 0.28 + (1 - c) * 0.1,
              shadowColor: g,
              isDay: !0,
            }
          );
        } else
          return {
            dx: 0.3,
            dy: 0.4,
            length: 0.4,
            shadowAlpha: 0.22,
            shadowColor: "rgba(2, 6, 23, 0.24)",
            isDay: !1,
          };
      }
      drawPropDirectionalShadow(t, l, o, u) {
        if (l.startsWith("tree_") && (window.__rpgQuality?.trees ?? 1) < 0.75)
          return;
        let m = 11 * o,
          c = 5.5 * o,
          f = 30 * o,
          g = !1;
        l.startsWith("tree_")
          ? ((m = 11 * o),
            (c = 5.5 * o),
            (f = (l === "tree_palm" ? 44 : 36) * o),
            (g = !0))
          : l === "rock"
            ? ((m = 10 * o), (c = 5 * o), (f = 14 * o))
            : l === "cactus"
              ? ((m = 7 * o), (c = 4 * o), (f = 28 * o))
              : l === "campfire" || l === "chest" || l === "clay_oven"
                ? ((m = 9 * o), (c = 4.5 * o), (f = 10 * o))
                : l === "shrine" || l === "ruin_pillar"
                  ? ((m = 12 * o), (c = 6 * o), (f = 26 * o))
                  : l === "cliff_wall"
                    ? ((m = 18 * o), (c = 8 * o), (f = 34 * o))
                    : (l.startsWith("flower_") ||
                        l === "mushroom" ||
                        l === "glowing_mushroom") &&
                      ((m = 4 * o), (c = 2.5 * o), (f = 5 * o));
        const y = u.length;
        if (
          ((t.fillStyle = u.shadowColor),
          t.beginPath(),
          t.ellipse(0, 3 * o, m, c, 0, 0, Math.PI * 2),
          t.fill(),
          y > 0.15 && f > 7 * o)
        ) {
          const w = u.dx * f * y * 0.55,
            v = u.dy * f * y * 0.45;
          g
            ? (t.beginPath(),
              t.moveTo(-3 * o, 2 * o),
              t.lineTo(w * 0.4 - 3.5 * o, v * 0.4),
              t.lineTo(w, v),
              t.lineTo(w * 0.4 + 3.5 * o, v * 0.4),
              t.lineTo(3 * o, 2 * o),
              t.closePath(),
              t.fill(),
              t.beginPath(),
              t.ellipse(
                w,
                v,
                m * 1.8,
                c * 1.5 * Math.max(0.6, y),
                Math.atan2(u.dy, u.dx),
                0,
                Math.PI * 2,
              ),
              t.fill())
            : (t.beginPath(),
              t.moveTo(-m * 0.75, 2 * o),
              t.lineTo(w - m * 0.35, v),
              t.lineTo(w + m * 0.35, v),
              t.lineTo(m * 0.75, 2 * o),
              t.closePath(),
              t.fill(),
              t.beginPath(),
              t.ellipse(
                w,
                v,
                m * 0.85,
                c * Math.max(0.5, y),
                0,
                0,
                Math.PI * 2,
              ),
              t.fill());
        }
      }
      renderProp(t, l, o, u, m) {
        const c = this.ctx,
          f = (typeof t.scale === "number" && !isNaN(t.scale) && t.scale > 0) ? t.scale : 1,
          g = (m == null ? void 0 : m.timeOfDay) ?? 0.5,
          y = this.getSunVector(g);
        c.save();
        c.translate(l, o);
        const isTreeKind =
          t.kind === "tree_oak" ||
          t.kind === "tree_pine" ||
          t.kind === "tree_palm" ||
          t.kind === "tree_willow" ||
          t.kind === "tree_burnt";
        if (isTreeKind && u && typeof window !== "undefined" && window.__treeShakes) {
          const sKey = `${u.tx},${u.ty}`;
          const sk = window.__treeShakes.get(sKey);
          if (sk) {
            const nowMs = performance.now();
            const elapsed = nowMs - sk.startTime;
            if (elapsed < sk.duration) {
              const p = elapsed / sk.duration;
              const decay = Math.pow(1 - p, 1.6);
              const wobbleX = Math.sin(p * Math.PI * 12) * sk.intensity * decay * (sk.dir || 1);
              const wobbleRot = Math.sin(p * Math.PI * 9) * (sk.intensity * 0.024) * decay * (sk.dir || 1);
              c.translate(wobbleX, 0);
              c.rotate(wobbleRot);
            } else {
              window.__treeShakes.delete(sKey);
            }
          }
        }
        switch (
          (t.kind !== "cliff_wall" &&
            t.kind !== "cliff_ramp" &&
            t.kind !== "greek_wall" &&
            t.kind !== "dungeon_wall" &&
            t.kind !== "cave_wall_25d" &&
            t.kind !== "geode_fissure" &&
            t.kind !== "geode_exit_fissure" &&
            this.drawPropDirectionalShadow(c, t.kind, f, y),
          t.kind)
        ) {
          case "tree_oak":
            rg(c, f, this.animTimer);
            break;
          case "tree_pine":
            lg(
              c,
              f,
              u.biome.id === BiomeId.SNOW_TAIGA || u.biome.id === BiomeId.SNOW_PEAK,
              this.animTimer,
            );
            break;
          case "tree_palm":
            ig(c, f, this.animTimer);
            break;
          case "tree_willow":
            ng(c, f, this.animTimer);
            break;
          case "tree_burnt":
            sg(c, f, this.animTimer);
            break;
          case "tree_stump":
            drawTreeStump(c, f);
            break;
          case "wood_log":
            drawPlacedWoodLog(c, f, t.count || 1);
            break;
          case "cactus":
            cg(c, f);
            break;
          case "rock":
            dg(c, f, t.subType, u.biome.id);
            break;
          case "flower_red":
          case "flower_blue":
          case "flower_yellow":
            ug(c, t.kind, f, this.animTimer);
            break;
          case "blue_plant":
            drawBluePlant(c, t.kind, f, this.animTimer, y.isDay === !1);
            break;
          case "mushroom":
            fg(c, f);
            break;
          case "shrine":
            mg(c, f, t, this.animTimer);
            break;
          case "campfire":
            (hg(
              c,
              f,
              this.animTimer,
              t.lit !== !1,
              { roasting: t.roastingFish, cookingPot: t.cookingPot },
              m != null &&
                m.savedCampfire &&
                m.savedCampfire.tx === u.tx &&
                m.savedCampfire.ty === u.ty &&
                !!m.savedCampfire.isUnderground === this.engine.isUnderground,
              t._rainExtinguishTimer || 0
            ),
              t.lit !== !1 &&
                m != null &&
                m.savedCampfire &&
                m.savedCampfire.tx === u.tx &&
                m.savedCampfire.ty === u.ty &&
                !!m.savedCampfire.isUnderground === this.engine.isUnderground);
            break;
          case "clay_oven":
            (Pg(c, f, this.animTimer, t.lit !== !1, { roasting: t.roastingFish, cookingPot: t.cookingPot }),
              t.lit !== !1 &&
                m != null &&
                m.savedCampfire &&
                m.savedCampfire.tx === u.tx &&
                m.savedCampfire.ty === u.ty &&
                !!m.savedCampfire.isUnderground === this.engine.isUnderground);
            break;
          case "chest":
          case "wooden_chest":
            pg(c, f, t.opened, this.animTimer);
            break;
          case "cave_wall_25d": {
            let nb = u._cw25Nb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty,
                isCaveW = (tile) =>
                  !!(
                    tile &&
                    (tile.isCaveRockWall25D ||
                      tile.isEarthMineWall ||
                      (tile.biome &&
                        (tile.biome.id === BiomeId.CAVE_WALL ||
                          tile.biome.id === BiomeId.DESERT_CAVE_WALL)))
                  );
              nb = u._cw25Nb = {
                left: isCaveW(eng.getTile(tx - 1, ty)),
                right: isCaveW(eng.getTile(tx + 1, ty)),
                top: isCaveW(eng.getTile(tx, ty - 1)),
                bottom: isCaveW(eng.getTile(tx, ty + 1)),
              };
            }
            const theme =
              t.wallTheme ||
              (u.isEarthMineWall
                ? "earth_mine"
                : u.isGeodeInterior
                  ? "geode_crystal"
                  : u.isDesertCave || (u.biome && u.biome.id === BiomeId.DESERT_CAVE_WALL)
                    ? "desert_cave"
                    : "cave_rock");
            drawCaveRockWall25D(c, f, theme, u.detailHash || 0.5, nb);
            break;
          }
          case "geode_fissure":
          case "geode_exit_fissure": {
            let nb = u._gf25Nb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty,
                isCW = (tile) =>
                  !!(
                    tile &&
                    (tile.isCaveRockWall25D ||
                      tile.isGeodeFissure ||
                      tile.isGeodeExitFissure ||
                      (tile.biome &&
                        (tile.biome.id === BiomeId.CAVE_WALL ||
                          tile.biome.id === BiomeId.DESERT_CAVE_WALL)))
                  );
              nb = u._gf25Nb = {
                left: isCW(eng.getTile(tx - 1, ty)),
                right: isCW(eng.getTile(tx + 1, ty)),
                top: isCW(eng.getTile(tx, ty - 1)),
                bottom: !1,
              };
            }
            if (typeof drawGeodeWallFissure25D === "function") {
              drawGeodeWallFissure25D(
                c,
                f,
                nb,
                t.kind === "geode_exit_fissure",
                this.animTimer || 0,
              );
            }
            break;
          }
          case "dungeon_wall": {
            let nb = u._dwNb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty;
              nb = u._dwNb = {
                left: !!eng.getTile(tx - 1, ty).isDungeonWall,
                right: !!eng.getTile(tx + 1, ty).isDungeonWall,
                top: !!eng.getTile(tx, ty - 1).isDungeonWall,
                bottom: !!eng.getTile(tx, ty + 1).isDungeonWall,
              };
            }
            drawDungeonWall25D(c, f, nb);
            break;
          }
          case "dungeon_staircase_down":
            drawDungeonStaircase(c, f, !1, this.animTimer);
            break;
          case "dungeon_staircase_up":
            drawDungeonStaircase(c, f, !0, this.animTimer);
            break;
          case "iron_bars_gate": {
            const isGateOpenByNpc = !!(
              typeof window !== "undefined" &&
              window.SnowPeakCity &&
              typeof window.SnowPeakCity.isDoorwayUsedByCitizen === "function" &&
              window.SnowPeakCity.isDoorwayUsedByCitizen(u.tx, u.ty)
            );
            drawIronBarsGate(
              c,
              f,
              t.doorVertical !== undefined ? !!t.doorVertical : !0,
              !!t.opened || isGateOpenByNpc,
            );
            break;
          }
          case "dungeon_door":
            drawDungeonDoor(c, f, !!t.doorVertical, !!t.opened);
            break;
          case "torture_rack":
            drawTortureRack(c, f);
            break;
          case "iron_maiden":
            drawIronMaiden(c, f);
            break;
          case "hanging_cage":
            drawHangingCage(c, f, this.animTimer);
            break;
          case "torture_brazier":
            drawTortureBrazier(c, f, this.animTimer);
            break;
          case "torture_tools":
            drawTortureTools(c, f);
            break;
          case "dungeon_latrine_pit":
            drawLatrinePit(c, f, this.animTimer);
            break;
          case "dungeon_latrine_bench":
            drawLatrineBench(c, f);
            break;
          case "jailer_table":
            drawJailerTable(c, f);
            break;
          case "weapon_rack":
            drawWeaponRack(c, f);
            break;
          case "dungeon_skeleton":
            drawDungeonSkeleton(c, f);
            break;
          case "bone_pile":
            drawBonePile(c, f, t.subType || 0);
            break;
          case "dungeon_straw":
            drawDungeonStraw(c, f);
            break;
          case "tardigrade_egg":
            if (typeof drawTardigradeEggs === "function") {
              drawTardigradeEggs(c, f, t.subType || 0, !!t.opened);
            }
            break;
          case "pedregulhos":
            drawPedregulhos(c, f, t.subType || 0);
            break;
          case "cabin_wall": {
            if (typeof drawCabinWall === "function") {
              const eng = this.engine;
              const wallSide =
                t.wallSide ||
                (eng && typeof eng.getCabinWallSide === "function" ? eng.getCabinWallSide(u) : "north");
              drawCabinWall(c, (eng && eng.tileSize) || 36, t.subType || 0, { wallSide, skipFloor: true });
            }
            break;
          }
          case "cabin_door": {
            if (typeof drawCabinDoor === "function") {
              drawCabinDoor(c, (this.engine && this.engine.tileSize) || 36, !!t.opened, true);
            }
            break;
          }
          case "cabin_floor": {
            if (typeof drawCabinFloor === "function") {
              drawCabinFloor(c, (this.engine && this.engine.tileSize) || 36);
            }
            break;
          }
          case "ruin_pillar":
            gg(c, f, t.subType);
            break;
          case "desert_city_wall": {
            let nb = u._dcwNb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty;
              nb = u._dcwNb = {
                left: !!(eng.getTile(tx - 1, ty) && eng.getTile(tx - 1, ty).isDesertCityWall),
                right: !!(eng.getTile(tx + 1, ty) && eng.getTile(tx + 1, ty).isDesertCityWall),
                top: !!(eng.getTile(tx, ty - 1) && eng.getTile(tx, ty - 1).isDesertCityWall),
                bottom: !!(eng.getTile(tx, ty + 1) && eng.getTile(tx, ty + 1).isDesertCityWall),
              };
            }
            if (typeof drawDesertCityWall === "function") {
              drawDesertCityWall(c, f, t.subType || 0, nb);
            }
            break;
          }
          case "desert_city_door": {
            const isDoorOpenByNpc = !!(
              window.DesertCity &&
              typeof window.DesertCity.isDoorwayUsedByCitizen === "function" &&
              window.DesertCity.isDoorwayUsedByCitizen(u.tx, u.ty)
            );
            if (typeof drawDesertCityDoor === "function") {
              drawDesertCityDoor(c, f, !!t.opened || isDoorOpenByNpc, !!t.doorVertical);
            }
            break;
          }
          case "desert_city_mat": {
            if (typeof drawDesertCityMat === "function") {
              drawDesertCityMat(c, f);
            }
            break;
          }
          case "desert_city_pots": {
            if (typeof drawDesertCityPots === "function") {
              drawDesertCityPots(c, f);
            }
            break;
          }
          case "desert_city_floor": {
            if (typeof drawDesertCityFloor === "function") {
              drawDesertCityFloor(c, f);
            }
            break;
          }
          case "port_city_wall": {
            let nb = u._pcwNb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty;
              nb = u._pcwNb = {
                left: !!(eng.getTile(tx - 1, ty) && eng.getTile(tx - 1, ty).isPortCityWall),
                right: !!(eng.getTile(tx + 1, ty) && eng.getTile(tx + 1, ty).isPortCityWall),
                top: !!(eng.getTile(tx, ty - 1) && eng.getTile(tx, ty - 1).isPortCityWall),
                bottom: !!(eng.getTile(tx, ty + 1) && eng.getTile(tx, ty + 1).isPortCityWall),
              };
            }
            if (typeof drawPortCityWall === "function") {
              drawPortCityWall(c, f, t.subType || 0, nb, t.roofTheme || u.portCityRoofTheme || "terracotta");
            }
            break;
          }
          case "port_city_door": {
            const isDoorOpenByNpc = !!(
              typeof window !== "undefined" &&
              window.PortCity &&
              typeof window.PortCity.isDoorwayUsedByCitizen === "function" &&
              window.PortCity.isDoorwayUsedByCitizen(u.tx, u.ty)
            );
            if (typeof drawPortCityDoor === "function") {
              drawPortCityDoor(c, f, !!t.opened || isDoorOpenByNpc, !!t.doorVertical);
            }
            break;
          }
          case "port_city_hammock": {
            if (typeof drawPortCityHammock === "function") {
              drawPortCityHammock(c, f, this.animTimer);
            }
            break;
          }
          case "port_city_table": {
            if (typeof drawPortCityTable === "function") {
              drawPortCityTable(c, f);
            }
            break;
          }
          case "port_city_cargo":
          case "port_city_crates": {
            if (typeof drawPortCityCargo === "function") {
              drawPortCityCargo(c, f, t.subType || 0);
            } else if (typeof drawPortCityCrates === "function") {
              drawPortCityCrates(c, f, t.subType || 0);
            }
            break;
          }
          case "port_city_monument":
          case "port_city_fountain":
          case "port_city_lighthouse": {
            if (typeof drawPortCityMonument === "function") {
              drawPortCityMonument(c, f, this.animTimer);
            } else if (typeof drawPortCityLighthouse === "function") {
              drawPortCityLighthouse(c, f, this.animTimer);
            }
            break;
          }
          case "port_city_lamppost":
          case "port_city_bench": {
            if (typeof drawPortCityLamppost === "function") {
              drawPortCityLamppost(c, f, this.animTimer);
            }
            break;
          }
          case "port_city_bollard": {
            if (typeof drawPortCityBollard === "function") {
              drawPortCityBollard(c, f);
            }
            break;
          }
          case "port_city_boat_mast":
          case "port_city_ship_mast": {
            if (typeof drawPortCityBoatStructure === "function") {
              const bSpec =
                t.boatSpec ||
                (typeof window !== "undefined" &&
                  window.PortCity &&
                  window.PortCity.getBoatAt &&
                  window.PortCity.getBoatAt(u.tx, u.ty));
              drawPortCityBoatStructure(c, f, bSpec, this.animTimer);
            }
            break;
          }
          case "port_city_boat_helm":
          case "port_city_ship_wheel": {
            if (typeof drawPortCityBoatHelm === "function") {
              drawPortCityBoatHelm(c, f);
            }
            break;
          }
          case "port_city_boat": {
            if (typeof drawPortCityBoatStructure === "function") {
              drawPortCityBoatStructure(c, f, t.boatSpec, this.animTimer);
            }
            break;
          }
          case "snow_city_wall": {
            let nb = u._scwNb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty;
              nb = u._scwNb = {
                left: !!(eng.getTile(tx - 1, ty) && eng.getTile(tx - 1, ty).isSnowCityWall),
                right: !!(eng.getTile(tx + 1, ty) && eng.getTile(tx + 1, ty).isSnowCityWall),
                top: !!(eng.getTile(tx, ty - 1) && eng.getTile(tx, ty - 1).isSnowCityWall),
                bottom: !!(eng.getTile(tx, ty + 1) && eng.getTile(tx, ty + 1).isSnowCityWall),
              };
            }
            drawSnowCityWall(c, f, t.subType || 0, nb);
            break;
          }
          case "snow_city_door": {
            const isDoorOpenByNpc = !!(
              typeof window !== "undefined" &&
              window.SnowPeakCity &&
              typeof window.SnowPeakCity.isDoorwayUsedByCitizen === "function" &&
              window.SnowPeakCity.isDoorwayUsedByCitizen(u.tx, u.ty)
            );
            drawSnowCityDoor(c, f, !!t.opened || isDoorOpenByNpc, !!t.doorVertical);
            break;
          }
          case "snow_city_chimney":
            drawSnowCityChimney(c, f, this.animTimer);
            break;
          case "snow_city_fireplace":
            drawSnowCityFireplace(c, f, this.animTimer);
            break;
          case "snow_city_stove":
            drawSnowCityStove(c, f, this.animTimer);
            break;
          case "snow_city_bathtub":
            drawSnowCityBathtub(c, f, this.animTimer);
            break;
          case "snow_city_bed":
            drawSnowCityBed(c, f);
            break;
          case "snow_city_nightstand":
          case "snow_city_wardrobe":
          case "snow_city_sink":
          case "snow_city_toilet":
          case "snow_city_sofa":
          case "snow_city_table":
          case "snow_city_counter":
          case "snow_city_pantry":
            drawSnowCityFurniture(c, f, t.kind);
            break;
          case "snow_city_monument":
            drawSnowCityMonument(c, f, this.animTimer);
            break;
          case "snow_city_monument_collider":
            // Os 8 tiles ao redor do centro da pira usam o desenho monumental central (scale 2.35) e possuem colisor
            break;
          case "snow_city_bench":
            drawSnowCityBench(c, f, t.subType || 0, t.benchFacing || "south");
            break;
          case "snow_city_lamppost":
            drawSnowCityLamppost(c, f, this.animTimer);
            break;
          case "barracks_gallows":
            drawBarracksGallows(c, f, this.animTimer);
            break;
          case "barracks_officer_desk":
            drawBarracksOfficerDesk(c, f, t.subType || 0);
            break;
          case "prison_bunk_bed":
            drawPrisonBunkBed(c, f);
            break;
          case "excavated_dirt_mound":
            drawExcavatedDirtMound(c, f, t.subType || 0);
            break;
          case "greek_wall": {
            let nb = u._gwNb;
            if (!nb) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty;
              nb = u._gwNb = {
                left: !!eng.getTile(tx - 1, ty).isGreekWall,
                right: !!eng.getTile(tx + 1, ty).isGreekWall,
                top: !!eng.getTile(tx, ty - 1).isGreekWall,
                bottom: !!eng.getTile(tx, ty + 1).isGreekWall,
              };
            }
            drawGreekRuinWall25D(c, f, t.subType || 0, nb, t.wallHeightState ?? 0);
            break;
          }
          case "greek_statue":
            drawGreekStatue(c, f, t.subType || 0, this.animTimer);
            break;
          case "greek_vase":
            drawGreekVaseCluster(c, f, t.subType || 0);
            break;
          case "greek_bookshelf":
            drawBookshelf(c, f, t.subType || 0, !!t.collected, typeof t.booksTaken === "number" ? t.booksTaken : (t.collected ? 4 : 0));
            break;
          case "greek_scroll_stand":
            drawScrollStand(c, f, t.subType || 0, !!t.collected, typeof t.scrollsTaken === "number" ? t.scrollsTaken : (t.collected ? 2 : 0));
            break;
          case "greek_furniture":
            drawGreekFurniture(c, f, t.subType || 0);
            break;
          case "greek_door": {
            let isVertDoor = u._gdVert;
            if (isVertDoor === void 0) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty,
                hasVertWalls =
                  !!eng.getTile(tx, ty - 1).isGreekWall ||
                  !!eng.getTile(tx, ty + 1).isGreekWall,
                hasHorizWalls =
                  !!eng.getTile(tx - 1, ty).isGreekWall ||
                  !!eng.getTile(tx + 1, ty).isGreekWall;
              isVertDoor = u._gdVert =
                t.subType === 1 || (hasVertWalls && !hasHorizWalls);
            }
            drawGreekDoor(c, f, isVertDoor, !!t.opened);
            break;
          }
          case "greek_unfinished":
            drawGreekUnfinishedWork(c, f, t.subType || 0);
            break;
          case "corridor_torch":
            drawGreekCorridorTorch(c, f, !!t.lit, this.animTimer);
            break;
          case "cave_entrance":
            bg(c, f, this.animTimer, u.biome, !!t.isMerged, t.mergedCount || 1, !!t.isStaircase, !!t.isBarracksStaircase, !!(t.isPrisonDeepMine || t.isExcavatorMine));
            break;
          case "large_rock":
            if (typeof drawLargeCaveRock === "function") {
              drawLargeCaveRock(c, f, this.animTimer, u.biome, !!t.isMerged, t.mergedCount || 1, t.subType || 0);
            }
            break;
          case "cave_exit":
            yg(c, f, this.animTimer, t.surfaceBiome || u.biome, !!t.isMerged, t.mergedCount || 1, !!t.isStaircase, !!t.isBarracksStaircase);
            break;
          case "stalactite":
            if (typeof drawCaveExitStalactites === "function") {
              drawCaveExitStalactites(c, f, t.subType || 0, this.animTimer || 0, !!t.isMerged, t.surfaceBiome || u.biome);
            } else {
              Tg(c, f, t.subType);
            }
            break;
          case "crystal_cluster":
            vg(c, f, t.subType, t.opened);
            break;
          case "ore_vein":
            wg(c, f, t.subType, t.opened);
            break;
          case "stalagmite":
            Tg(c, f, t.subType);
            break;
          case "miner_cart":
            Sg(c, f);
            break;
          case "glowing_mushroom":
            kP(c, f, t.subType);
            break;
          case "luminous_algae":
            if (typeof drawLuminousAlgae === "function") {
              drawLuminousAlgae(c, f, t.subType || 0, this.animTimer || 0);
            }
            break;
          case "clay_deposit":
            Mg(c, f, this.animTimer, t.opened);
            break;
          case "drying_clay":
            Cg(
              c,
              f,
              this.animTimer,
              t.dryingItemType || "pote",
              t.dryingStartTime || 0,
              t.dryingDurationMs || 12e4,
            );
            break;
          case "cliff_ramp": {
            const eng = this.engine,
              tx = u.tx,
              ty = u.ty,
              rampNeighbors = {
                leftWall: !!eng.getTile(tx - 1, ty).isCliffWall,
                rightWall: !!eng.getTile(tx + 1, ty).isCliffWall,
                topRamp: !!eng.getTile(tx, ty - 1).isCliffRamp,
                bottomRamp: !!eng.getTile(tx, ty + 1).isCliffRamp,
              };
            drawCliffRamp25D(
              c,
              f,
              t.subType || 1,
              t.lowerTier ?? 0,
              t.rampDir || "up",
              rampNeighbors,
            );
            break;
          }
          case "cliff_wall": {
            let neighbors = u._cwNb;
            if (!neighbors) {
              const eng = this.engine,
                tx = u.tx,
                ty = u.ty,
                myTier = u.mountainTier || t.subType || 1,
                tL = eng.getTile(tx - 1, ty),
                tR = eng.getTile(tx + 1, ty),
                tT = eng.getTile(tx, ty - 1),
                tB = eng.getTile(tx, ty + 1),
                tTL = eng.getTile(tx - 1, ty - 1),
                tTR = eng.getTile(tx + 1, ty - 1),
                tBL = eng.getTile(tx - 1, ty + 1),
                tBR = eng.getTile(tx + 1, ty + 1),
                isElevatedOrWall = (tile) =>
                  !!(
                    tile &&
                    tile.biome.id === BiomeId.MOUNTAIN_25D &&
                    (tile.mountainTier || 1) >= myTier
                  );
              neighbors = u._cwNb = {
                left: isElevatedOrWall(tL),
                right: isElevatedOrWall(tR),
                top: isElevatedOrWall(tT),
                bottom: isElevatedOrWall(tB),
                topLeft: isElevatedOrWall(tTL),
                topRight: isElevatedOrWall(tTR),
                bottomLeft: isElevatedOrWall(tBL),
                bottomRight: isElevatedOrWall(tBR),
                wallLeft: !!(tL && tL.isCliffWall && (tL.mountainTier || 1) === myTier),
                wallRight: !!(tR && tR.isCliffWall && (tR.mountainTier || 1) === myTier),
                wallTop: !!(tT && tT.isCliffWall && (tT.mountainTier || 1) === myTier),
                wallBottom: !!(tB && tB.isCliffWall && (tB.mountainTier || 1) === myTier),
              };
            }
            // Só desenha sombra direcional quando o sul é externo (fora do platô elevado)
            if (!neighbors.bottom) {
              this.drawPropDirectionalShadow(c, t.kind, f, y);
            }
            drawCliffWall25D(
              c,
              f,
              t.subType || 1,
              u.detailHash || 0.5,
              this.animTimer,
              neighbors,
            );
            break;
          }
        }
        c.restore();
      }
      // REMOVIDO a pedido do jogador: circulo/halo giratorio sobre a fogueira-azul de save nao e mais desenhado em lugar nenhum.
      renderPlayer(t, l, o, u, m) {
        const c = this.ctx,
          f = t.x,
          g = t.y,
          y = t.isMoving,
          w = t.direction,
          v = y ? Math.sin(t.walkCycle) : 0,
          T = y ? Math.abs(v) * 1.5 : Math.sin(this.animTimer * 2.2) * 0.3,
          S = m || {},
          p = S.chapeu,
          j = S.camisa,
          P = S.calca,
          A = S.botas,
          x = S.capa,
          M = S.mochila,
          $ = S.cinto,
          z = S.pingente,
          K = S.bracelete_esquerdo,
          V = S.bracelete_direito,
          O = S.mao_esquerda,
          _ = S.mao_direita;

        const skinColor = t.skinColor || "#e6b89c";
        let shirtColor = "#2563eb";
        if (j) {
          const cName = (j.name || "").toLowerCase();
          if (
            cName.includes("armadura") ||
            cName.includes("ferro") ||
            cName.includes("aço") ||
            cName.includes("cota")
          ) {
            shirtColor = "#64748b";
          } else if (cName.includes("couro")) {
            shirtColor = "#854d0e";
          } else if (
            cName.includes("arcano") ||
            cName.includes("mago") ||
            cName.includes("linho")
          ) {
            shirtColor = "#7c3aed";
          } else {
            shirtColor = j.color || "#2563eb";
          }
        }
        this._currentShirtColor = shirtColor;
        this._currentSkinColor = skinColor;
        this._isPlayerRunning = !!t.sprinting;
        this._playerLanternLit = !!l;
        if (typeof window !== "undefined") window.__currentPlayerSkinColor = skinColor;

        const isRangedHandItem = (it) => {
            if (!it) return !1;
            const nm = (it.name || "").toLowerCase(),
              idv = (it.id || "").toLowerCase();
            return (
              nm.includes("estilingue") ||
              idv.includes("estilingue") ||
              idv.includes("slingshot") ||
              nm.includes("seixo") ||
              idv.includes("seixo") ||
              idv.includes("pebble")
            );
          },
          se = !!(
            (_ && !isRangedHandItem(_)) ||
            o ||
            (O &&
              O.categoryType === "equipment" &&
              (O.name.toLowerCase().includes("espada") ||
                O.name.toLowerCase().includes("bastão") ||
                O.name.toLowerCase().includes("bastao")))
          ),
          ue = !!(t.attackTimer && t.attackTimer > 0),
          N = t.attackDuration || 0.28,
          Ee = ue ? Math.max(0, Math.min(1, 1 - t.attackTimer / N)) : 0;
        let ne = 0;
        ue &&
          (Ee < 0.38
            ? (ne = Math.sin((Ee / 0.38) * (Math.PI / 2)))
            : (ne = Math.cos(((Ee - 0.38) / 0.62) * (Math.PI / 2))));
        const ke = ue && (t.attackCombo || 0) % 2 === 1,
          G = ue && (t.attackCombo || 0) % 2 === 0,
          de = y ? v * 2.8 : 0,
          W = y ? -v * 2.8 : 0,
          isDodging = !!(t.dodgeTimer && t.dodgeTimer > 0),
          dodgeDur = t.dodgeDuration || 0.25,
          dodgeProg = isDodging ? Math.max(0, Math.min(1, 1 - t.dodgeTimer / dodgeDur)) : 0,
          dodgeSin = isDodging ? Math.sin(dodgeProg * Math.PI) : 0,
          dodgeDir = t.dodgeDir || w,
          dodgeDX = t.dodgeDX !== void 0 ? t.dodgeDX : (dodgeDir === "left" ? -1 : dodgeDir === "right" ? 1 : 0),
          dodgeDY = t.dodgeDY !== void 0 ? t.dodgeDY : (dodgeDir === "up" ? -1 : dodgeDir === "down" ? 1 : 0),
          dodgeHopY = isDodging ? dodgeSin * 6.8 : 0;
        let dodgeTilt = 0;
        if (isDodging) {
          if (w === "down" || w === "up") {
            if (dodgeDir === "left") dodgeTilt = -0.21 * dodgeSin;
            else if (dodgeDir === "right") dodgeTilt = 0.21 * dodgeSin;
            else dodgeTilt = (dodgeDir === w ? 0.05 : -0.05) * dodgeSin;
          } else if (w === "left") {
            if (dodgeDir === "left") dodgeTilt = -0.24 * dodgeSin;
            else if (dodgeDir === "right") dodgeTilt = 0.20 * dodgeSin;
            else if (dodgeDir === "up") dodgeTilt = 0.14 * dodgeSin;
            else dodgeTilt = -0.14 * dodgeSin;
          } else {
            if (dodgeDir === "right") dodgeTilt = 0.24 * dodgeSin;
            else if (dodgeDir === "left") dodgeTilt = -0.20 * dodgeSin;
            else if (dodgeDir === "up") dodgeTilt = -0.14 * dodgeSin;
            else dodgeTilt = 0.14 * dodgeSin;
          }
        }
        this._dodgeState = isDodging
          ? { active: !0, prog: dodgeProg, sin: dodgeSin, dir: dodgeDir, dx: dodgeDX, dy: dodgeDY, facing: w }
          : null;
        (c.save(),
          c.translate(f, g),
          t.isAiming && t.aimAngle !== void 0 && (() => {
            const aim = t.aimAngle;
            const maxReach = t.hasSlingshotAim ? 660 : 330;
            const guideLength = Math.max(35, Math.min(maxReach, t.aimDistance !== void 0 ? t.aimDistance : maxReach));
            c.save();
            c.rotate(aim);
            c.globalAlpha = 0.85;
            c.strokeStyle = "rgba(226, 232, 240, 0.75)";
            c.lineWidth = 1.5;
            c.setLineDash([7, 6]);
            c.beginPath();
            c.moveTo(10, 0);
            c.lineTo(guideLength, 0);
            c.stroke();
            c.setLineDash([]);
            c.strokeStyle = "#f8fafc";
            c.lineWidth = 2;
            c.beginPath();
            c.arc(guideLength, 0, 7 + Math.sin(this.animTimer * 8) * 1.5, 0, Math.PI * 2);
            c.stroke();
            c.beginPath();
            c.moveTo(guideLength - 11, 0);
            c.lineTo(guideLength + 11, 0);
            c.moveTo(guideLength, -11);
            c.lineTo(guideLength, 11);
            c.stroke();
            c.restore();
          })(),
          !isDodging &&
            t.invulnerableTimer &&
            t.invulnerableTimer > 0 &&
            Math.sin(this.animTimer * 26) < 0 &&
            (c.globalAlpha = 0.35),
          t.isDead && (c.rotate(Math.PI / 2.2), (c.globalAlpha = 0.6)));
        const le = this.engine.getTile(
            Math.floor(f / this.engine.tileSize),
            Math.floor(g / this.engine.tileSize),
          ),
          te = le.biome.hasWater && !le.isPortPier && !le.isPortBoatDeck;
        if (te)
          for (let ga = 0; ga < 2; ga++) {
            const we = (this.animTimer * 2 + ga * 1.25) % 2.5,
              je = 6 + we * 7,
              Be = Math.max(0, (1 - we / 2.5) * 0.7);
            ((c.strokeStyle =
              le.biome.id === BiomeId.DEEP_OCEAN
                ? `rgba(186, 230, 253, ${Be})`
                : `rgba(255, 255, 255, ${Be})`),
              (c.lineWidth = 1.4),
              c.beginPath(),
              c.ellipse(0, 3, je, je * 0.5, 0, 0, Math.PI * 2),
              c.stroke());
          }
        else {
          const ga = this.getSunVector(u ?? 0.5),
            shadowShrink = isDodging ? 1 - dodgeSin * 0.24 : 1;
          if (
            ((c.fillStyle = ga.shadowColor),
            c.beginPath(),
            c.ellipse(0, 2.5, 8.0 * shadowShrink, 4.3 * shadowShrink, 0, 0, Math.PI * 2),
            c.fill(),
            ga.length > 0.15)
          ) {
            const we = ga.dx * 18 * ga.length * 0.5,
              je = ga.dy * 18 * ga.length * 0.45;
            (c.beginPath(),
              c.ellipse(
                we,
                je,
                7 * shadowShrink,
                4.2 * Math.max(0.5, ga.length) * shadowShrink,
                0,
                0,
                Math.PI * 2,
              ),
              c.fill());
          }
          if (y && t.sprinting)
            for (let we = 0; we < 3; we++) {
              const je = (this.animTimer * 6 + we * 1.1) % 1,
                Be = 1.2 + je * 2.2,
                Se = Math.max(0, (1 - je) * 0.45),
                Ae =
                  (we === 1 ? -6 : we === 2 ? 6 : 0) -
                  (w === "left" ? -8 : w === "right" ? 8 : 0),
                fa = 2 + (w === "up" ? 8 : w === "down" ? -4 : 0);
              ((c.fillStyle = `rgba(203, 213, 225, ${Se})`),
                c.beginPath(),
                c.arc(Ae, fa, Be, 0, Math.PI * 2),
                c.fill());
            }
        }
        if (isDodging) {
          const startOffX = (t.dodgeStartX !== void 0 ? t.dodgeStartX : f) - f,
            startOffY = (t.dodgeStartY !== void 0 ? t.dodgeStartY : g) - g,
            isProfileGhost = w === "left" || w === "right",
            torsoW = isProfileGhost ? 9.4 : 13.4,
            torsoX = w === "left" ? -5.5 : w === "right" ? -3.9 : -6.7;
          // 1. Anel de impulso e poeira no ponto exato de saída no chão
          c.save();
          const ringAlpha = Math.max(0, (1 - dodgeProg) * 0.55);
          c.strokeStyle = `rgba(186, 230, 253, ${ringAlpha})`;
          c.lineWidth = 1.5;
          c.beginPath();
          c.ellipse(startOffX, startOffY + 2.5, 6.5 + dodgeProg * 12, 3.4 + dodgeProg * 5.5, 0, 0, Math.PI * 2);
          c.stroke();
          for (let dp = -1; dp <= 1; dp++) {
            const puffX = startOffX + dp * 4.5 - dodgeDX * dodgeProg * 8,
              puffY = startOffY + 2 + Math.abs(dp) * 1.5 - dodgeDY * dodgeProg * 6;
            c.fillStyle = `rgba(226, 232, 240, ${ringAlpha * 0.75})`;
            c.beginPath();
            c.arc(puffX, puffY, 2.0 + dodgeProg * 2.4, 0, Math.PI * 2);
            c.fill();
          }
          // 2. Rastro de silhuetas direcionais (afterimages) acompanhando a direção para onde o personagem olha
          for (let gi = 1; gi <= 3; gi++) {
            const frac = gi / 4,
              gx = startOffX * (1 - frac),
              gy = startOffY * (1 - frac) - Math.sin(frac * Math.PI) * 5.2,
              gAlpha = Math.max(0, (1 - dodgeProg * 0.72) * (0.11 + frac * 0.22));
            c.save();
            c.translate(gx, gy);
            c.rotate(dodgeTilt * Math.sin(frac * Math.PI));
            c.globalAlpha = gAlpha;
            c.fillStyle = gi === 3 ? shirtColor : "#38bdf8";
            // Silhueta da cabeça na direção atual
            c.beginPath();
            c.arc(0, -21.5, 5.8, 0, Math.PI * 2);
            c.fill();
            // Silhueta do tronco respeitando frente/costas vs perfil esquerdo/direito
            c.fillRect(torsoX, -16, torsoW, 12.8);
            // Silhueta das pernas em impulso
            if (isProfileGhost) {
              c.save();
              c.translate(-1.5, -3.5);
              c.rotate((dodgeDX !== 0 ? -dodgeDX * 0.55 : -0.4) * frac);
              c.fillRect(-1.8, 0, 3.6, 7.2);
              c.restore();
              c.save();
              c.translate(1.5, -3.5);
              c.rotate((dodgeDX !== 0 ? dodgeDX * 0.55 : 0.4) * frac);
              c.fillRect(-1.8, 0, 3.6, 7.2);
              c.restore();
            } else {
              c.fillRect(-5.0 - dodgeDX * 1.8 * frac, -3.5 - frac * 1.5, 3.6, 7.2);
              c.fillRect(1.4 + dodgeDX * 1.8 * frac, -3.5 + frac * 1.0, 3.6, 7.2);
            }
            c.restore();
          }
          // 3. Linhas de vento aerodinâmicas no sentido contrário ao deslocamento
          c.strokeStyle = `rgba(125, 211, 252, ${Math.max(0, dodgeSin * 0.75)})`;
          c.lineWidth = 1.35;
          c.lineCap = "round";
          const streakOffsets = [-21, -14, -7, -1];
          for (let si = 0; si < streakOffsets.length; si++) {
            const sy = streakOffsets[si] - dodgeHopY * 0.6,
              perp = (si - 1.5) * 4.2,
              sx = -dodgeDX * 6 + (dodgeDY !== 0 ? perp : 0),
              by = sy - dodgeDY * 4 + (dodgeDX !== 0 ? perp * 0.35 : 0),
              len = 11 + (si % 2) * 6;
            c.beginPath();
            c.moveTo(sx, by);
            c.lineTo(sx - dodgeDX * len, by - dodgeDY * len);
            c.stroke();
          }
          c.restore();
        }
        c.save();
        if (isDodging) {
          c.translate(0, -dodgeHopY);
          c.rotate(dodgeTilt);
        }
        w !== "up" &&
          (this.drawCape(w, T, y, ne, x), this.drawBackpack(w, T, M));

        // PERNAS E BOTAS ANATÔMICAS COM PIVÔ FIXO NO QUADRIL (balanço pendular real)
        // O quadril (y = -3.5) é o ponto de ancoragem estático fixo na pelve do personagem.
        // As pernas giram por rotação pendular sobre esse pivô, sem deslizar horizontalmente.
        const isRun = !!t.sprinting,
          walkNorm = y ? Math.sin(t.walkCycle || 0) : 0;
        let X = "#3b4252";
        P && (X = P.color || "#334155");
        let C = "#5c3a21",
          I = "#18181b";
        if (A) {
          C = A.color || "#78350f";
          if (
            A.name.toLowerCase().includes("ágeis") ||
            A.name.toLowerCase().includes("veloz")
          ) {
            I = "#10b981";
          } else if (
            A.name.toLowerCase().includes("ferro") ||
            A.name.toLowerCase().includes("aço")
          ) {
            C = "#64748b";
            I = "#cbd5e1";
          }
        }
        if (w === "up") {
          // VISTA TRASEIRA (COSTAS): Estilo vertical clássico + postura de esquiva nas 4 direções
          const legMult = isRun ? 3.6 : 2.8;
          let legSwingL = y ? -walkNorm * legMult : 0,
            legSwingR = y ? walkNorm * legMult : 0,
            dodgeLegDXL = 0,
            dodgeLegDXR = 0,
            dodgeLegRotL = 0,
            dodgeLegRotR = 0;
          if (isDodging) {
            if (dodgeDir === "left") {
              // Esquiva lateral p/ esquerda olhando p/ cima: perna esquerda lidera aberta, direita impulsiona
              dodgeLegDXL = -2.4 * dodgeSin;
              legSwingL = -2.6 * dodgeSin;
              dodgeLegRotL = 0.24 * dodgeSin;
              dodgeLegDXR = 2.6 * dodgeSin;
              legSwingR = 1.4 * dodgeSin;
              dodgeLegRotR = -0.28 * dodgeSin;
            } else if (dodgeDir === "right") {
              // Esquiva lateral p/ direita olhando p/ cima: perna direita lidera aberta, esquerda impulsiona
              dodgeLegDXR = 2.4 * dodgeSin;
              legSwingR = -2.6 * dodgeSin;
              dodgeLegRotR = -0.24 * dodgeSin;
              dodgeLegDXL = -2.6 * dodgeSin;
              legSwingL = 1.4 * dodgeSin;
              dodgeLegRotL = 0.28 * dodgeSin;
            } else if (dodgeDir === "up") {
              // Avanço rápido p/ frente (norte) olhando p/ cima
              legSwingL = -3.6 * dodgeSin;
              legSwingR = 3.4 * dodgeSin;
              dodgeLegDXL = -0.7 * dodgeSin;
              dodgeLegDXR = 0.7 * dodgeSin;
              dodgeLegRotL = 0.12 * dodgeSin;
              dodgeLegRotR = -0.12 * dodgeSin;
            } else {
              // Salto evasivo de costas (recuo p/ sul mantendo o olhar p/ cima)
              legSwingL = -3.0 * dodgeSin;
              legSwingR = -1.6 * dodgeSin;
              dodgeLegDXL = -1.3 * dodgeSin;
              dodgeLegDXR = 1.3 * dodgeSin;
              dodgeLegRotL = 0.16 * dodgeSin;
              dodgeLegRotR = -0.16 * dodgeSin;
            }
          }

          // Perna Esquerda
          c.save();
          c.translate(-3.3 + dodgeLegDXL, -3.5 + legSwingL);
          if (dodgeLegRotL) c.rotate(dodgeLegRotL);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(0, 0, 0, 0.22)";
          c.fillRect(0.1, 0, 0.9, 4.6);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.8);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = "rgba(0, 0, 0, 0.28)";
          c.fillRect(-0.2, 5.0, 1.0, 2.8);
          c.fillStyle = "#18181b";
          c.fillRect(-1.9, 7.2, 3.8, 1.2);
          c.restore();

          // Perna Direita
          c.save();
          c.translate(3.3 + dodgeLegDXR, -3.5 + legSwingR);
          if (dodgeLegRotR) c.rotate(dodgeLegRotR);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(0, 0, 0, 0.22)";
          c.fillRect(0.1, 0, 0.9, 4.6);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.8);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = "rgba(0, 0, 0, 0.28)";
          c.fillRect(-0.2, 5.0, 1.0, 2.8);
          c.fillStyle = "#18181b";
          c.fillRect(-1.9, 7.2, 3.8, 1.2);
          c.restore();
        } else if (w === "down") {
          // VISTA FRONTAL: Estilo vertical clássico + postura de esquiva nas 4 direções
          const legMult = isRun ? 3.6 : 2.8;
          let legSwingL = y ? -walkNorm * legMult : 0,
            legSwingR = y ? walkNorm * legMult : 0,
            dodgeLegDXL = 0,
            dodgeLegDXR = 0,
            dodgeLegRotL = 0,
            dodgeLegRotR = 0;
          if (isDodging) {
            if (dodgeDir === "left") {
              // Esquiva lateral p/ esquerda olhando p/ baixo: perna esquerda lidera aberta, direita impulsiona
              dodgeLegDXL = -2.4 * dodgeSin;
              legSwingL = -2.6 * dodgeSin;
              dodgeLegRotL = 0.24 * dodgeSin;
              dodgeLegDXR = 2.6 * dodgeSin;
              legSwingR = 1.4 * dodgeSin;
              dodgeLegRotR = -0.28 * dodgeSin;
            } else if (dodgeDir === "right") {
              // Esquiva lateral p/ direita olhando p/ baixo: perna direita lidera aberta, esquerda impulsiona
              dodgeLegDXR = 2.4 * dodgeSin;
              legSwingR = -2.6 * dodgeSin;
              dodgeLegRotR = -0.24 * dodgeSin;
              dodgeLegDXL = -2.6 * dodgeSin;
              legSwingL = 1.4 * dodgeSin;
              dodgeLegRotL = 0.28 * dodgeSin;
            } else if (dodgeDir === "down") {
              // Avanço rápido p/ frente (sul) olhando p/ baixo
              legSwingL = -3.6 * dodgeSin;
              legSwingR = 3.4 * dodgeSin;
              dodgeLegDXL = -0.7 * dodgeSin;
              dodgeLegDXR = 0.7 * dodgeSin;
              dodgeLegRotL = 0.12 * dodgeSin;
              dodgeLegRotR = -0.12 * dodgeSin;
            } else {
              // Salto evasivo p/ trás (norte) mantendo o olhar fixo p/ baixo
              legSwingL = -3.0 * dodgeSin;
              legSwingR = -1.6 * dodgeSin;
              dodgeLegDXL = -1.3 * dodgeSin;
              dodgeLegDXR = 1.3 * dodgeSin;
              dodgeLegRotL = 0.16 * dodgeSin;
              dodgeLegRotR = -0.16 * dodgeSin;
            }
          }

          // Perna Esquerda
          c.save();
          c.translate(-3.3 + dodgeLegDXL, -3.5 + legSwingL);
          if (dodgeLegRotL) c.rotate(dodgeLegRotL);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(255, 255, 255, 0.12)";
          c.fillRect(-1.2, 1.8, 2.4, 2.2);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.8);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = C;
          c.fillRect(-1.7, 6.6, 3.4, 1.2);
          c.fillStyle = "#18181b";
          c.fillRect(-1.9, 7.2, 3.8, 1.2);
          c.restore();

          // Perna Direita
          c.save();
          c.translate(3.3 + dodgeLegDXR, -3.5 + legSwingR);
          if (dodgeLegRotR) c.rotate(dodgeLegRotR);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(255, 255, 255, 0.12)";
          c.fillRect(-1.2, 1.8, 2.4, 2.2);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.8);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = C;
          c.fillRect(-1.7, 6.6, 3.4, 1.2);
          c.fillStyle = "#18181b";
          c.fillRect(-1.9, 7.2, 3.8, 1.2);
          c.restore();
        } else if (w === "left") {
          // VISTA LATERAL ESQUERDA: Pêndulo com pivôs no quadril + postura de esquiva nas 4 direções
          const strideRange = isRun ? 0.65 : 0.48;
          let frontAngle = -walkNorm * strideRange,
            backAngle = walkNorm * strideRange,
            frontDY = 0,
            backDY = 0;
          if (isDodging) {
            if (dodgeDir === "left") {
              // Dash frontal p/ esquerda: tesoura ampla de avanço
              frontAngle = 0.78 * dodgeSin;
              backAngle = -0.82 * dodgeSin;
              frontDY = -1.4 * dodgeSin;
            } else if (dodgeDir === "right") {
              // Backstep (recuo p/ direita olhando p/ esquerda): salto reverso mantendo o olhar à esquerda
              backAngle = -0.76 * dodgeSin;
              frontAngle = 0.66 * dodgeSin;
              frontDY = -2.0 * dodgeSin;
              backDY = -0.6 * dodgeSin;
            } else if (dodgeDir === "up") {
              // Esquiva lateral p/ cima em perfil esquerdo: abertura 2.5D em profundidade
              backDY = -2.8 * dodgeSin;
              frontDY = 1.5 * dodgeSin;
              backAngle = -0.44 * dodgeSin;
              frontAngle = 0.48 * dodgeSin;
            } else {
              // Esquiva lateral p/ baixo em perfil esquerdo: abertura 2.5D em profundidade
              frontDY = 2.6 * dodgeSin;
              backDY = -1.8 * dodgeSin;
              frontAngle = -0.46 * dodgeSin;
              backAngle = 0.42 * dodgeSin;
            }
          }

          // Perna de trás (direita, pivô em 1.6, -3.5)
          c.save();
          c.translate(1.6, -3.5 + backDY);
          c.rotate(backAngle);
          c.fillStyle = X;
          c.fillRect(-1.8, 0, 3.6, 4.6);
          c.fillStyle = "rgba(0, 0, 0, 0.28)";
          c.fillRect(-1.8, 0, 3.6, 4.6);
          c.fillStyle = C;
          c.fillRect(-1.8, 4.0, 3.6, 3.2);
          c.fillStyle = I;
          c.fillRect(-1.8, 4.0, 3.6, 1.2);
          c.fillStyle = C;
          c.fillRect(-3.0, 5.4, 2.0, 1.8);
          c.fillStyle = "#18181b";
          c.fillRect(-3.0, 6.8, 4.8, 1.2);
          c.fillStyle = "rgba(0, 0, 0, 0.22)";
          c.fillRect(-3.0, 4.0, 4.8, 4.0);
          c.restore();

          // Perna da frente (esquerda, pivô em -1.6, -3.5)
          c.save();
          c.translate(-1.6, -3.5 + frontDY);
          c.rotate(frontAngle);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(255, 255, 255, 0.12)";
          c.fillRect(-1.4, 1.8, 2.8, 2.0);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.2);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = C;
          c.fillRect(-3.3, 5.4, 2.2, 1.8);
          c.fillStyle = "#18181b";
          c.fillRect(-3.3, 6.8, 5.2, 1.2);
          c.restore();
        } else {
          // VISTA LATERAL DIREITA: Pêndulo com pivôs no quadril + postura de esquiva nas 4 direções
          const strideRange = isRun ? 0.65 : 0.48;
          let frontAngle = walkNorm * strideRange,
            backAngle = -walkNorm * strideRange,
            frontDY = 0,
            backDY = 0;
          if (isDodging) {
            if (dodgeDir === "right") {
              // Dash frontal p/ direita: tesoura ampla de avanço
              frontAngle = -0.78 * dodgeSin;
              backAngle = 0.82 * dodgeSin;
              frontDY = -1.4 * dodgeSin;
            } else if (dodgeDir === "left") {
              // Backstep (recuo p/ esquerda olhando p/ direita): salto reverso mantendo o olhar à direita
              backAngle = 0.76 * dodgeSin;
              frontAngle = -0.66 * dodgeSin;
              frontDY = -2.0 * dodgeSin;
              backDY = -0.6 * dodgeSin;
            } else if (dodgeDir === "up") {
              // Esquiva lateral p/ cima em perfil direito: abertura 2.5D em profundidade
              backDY = -2.8 * dodgeSin;
              frontDY = 1.5 * dodgeSin;
              backAngle = 0.44 * dodgeSin;
              frontAngle = -0.48 * dodgeSin;
            } else {
              // Esquiva lateral p/ baixo em perfil direito: abertura 2.5D em profundidade
              frontDY = 2.6 * dodgeSin;
              backDY = -1.8 * dodgeSin;
              frontAngle = 0.46 * dodgeSin;
              backAngle = -0.42 * dodgeSin;
            }
          }

          // Perna de trás (esquerda, pivô em -1.6, -3.5)
          c.save();
          c.translate(-1.6, -3.5 + backDY);
          c.rotate(backAngle);
          c.fillStyle = X;
          c.fillRect(-1.8, 0, 3.6, 4.6);
          c.fillStyle = "rgba(0, 0, 0, 0.28)";
          c.fillRect(-1.8, 0, 3.6, 4.6);
          c.fillStyle = C;
          c.fillRect(-1.8, 4.0, 3.6, 3.2);
          c.fillStyle = I;
          c.fillRect(-1.8, 4.0, 3.6, 1.2);
          c.fillStyle = C;
          c.fillRect(1.0, 5.4, 2.0, 1.8);
          c.fillStyle = "#18181b";
          c.fillRect(-1.8, 6.8, 4.8, 1.2);
          c.fillStyle = "rgba(0, 0, 0, 0.22)";
          c.fillRect(-1.8, 4.0, 4.8, 4.0);
          c.restore();

          // Perna da frente (direita, pivô em 1.6, -3.5)
          c.save();
          c.translate(1.6, -3.5 + frontDY);
          c.rotate(frontAngle);
          c.fillStyle = X;
          c.fillRect(-1.9, 0, 3.8, 4.6);
          c.fillStyle = "rgba(255, 255, 255, 0.12)";
          c.fillRect(-1.4, 1.8, 2.8, 2.0);
          c.fillStyle = C;
          c.fillRect(-1.9, 4.0, 3.8, 3.2);
          c.fillStyle = I;
          c.fillRect(-1.9, 4.0, 3.8, 1.2);
          c.fillStyle = C;
          c.fillRect(1.1, 5.4, 2.2, 1.8);
          c.fillStyle = "#18181b";
          c.fillRect(-1.9, 6.8, 5.2, 1.2);
          c.restore();
        }

        if (te) {
          c.fillStyle = "rgba(2, 132, 199, 0.55)";
          c.fillRect(-7, -2 - T, 14, 9);
          c.fillStyle = "rgba(255, 255, 255, 0.85)";
          c.fillRect(-8, -3 - T, 16, 2);
        }

        let be = 0,
          Me = 0;
        if (ue) {
          if (w === "left") be = -ne * 2;
          else if (w === "right") be = ne * 2;
          else if (w === "up") Me = -ne * 2;
          else Me = ne * 2;
        }
        if (isDodging) {
          be += dodgeDX * 2.6 * dodgeSin;
          Me += dodgeDY * 2.2 * dodgeSin;
        }

        this.drawArmsAndCombat(w, T, be, Me, ue, se, ne, Ee, ke, G, de, W, l, O, _, K, V, t.attackAngle, "back"); this.drawTorsoArmor(w, T + Me, be, j);
        this.drawBelt(w, T + Me, be, $, S.cinto_slot1, S.cinto_slot2);
        if (z && w !== "up") this.drawPendant(w, T + Me, be, z);
        if (w === "up") {
          this.drawCape(w, T, y, ne, x);
          this.drawBackpack(w, T, M);
        }

        // Cabeça, pescoço e traços faciais proporcionais idênticos aos soldados (raio 6.1 a Y = -22)
        const Te = -22 - T + Me * 0.5,
          Fe = be * 0.5;

        // Pescoço de ligação anatômica com o colarinho
        c.fillStyle = skinColor;
        c.fillRect(-2.2 + Fe, Te + 3.2, 4.4, 3.0);

        // Cabeça proporcional
        c.fillStyle = skinColor;
        c.beginPath();
        c.arc(Fe, Te, 6.1, 0, Math.PI * 2);
        c.fill();

        // Cabelo volumoso de aventureiro sobrevivente (desenhado antes dos olhos para não obstruir o olhar)
        c.fillStyle = t.hairColor || "#5c2c16";
        c.beginPath();
        c.arc(Fe, Te - 1.2, 6.2, Math.PI, 0);
        c.fill();
        if (w === "down") {
          // Mechas laterais nas têmporas e franja frontal acima dos olhos
          c.fillRect(Fe - 6.2, Te - 4.0, 2.2, 5.0);
          c.fillRect(Fe + 4.0, Te - 4.0, 2.2, 5.0);
          c.fillRect(Fe - 3.0, Te - 4.8, 3.0, 2.0);
        } else if (w === "up") {
          c.beginPath();
          c.arc(Fe, Te, 6.2, 0, Math.PI * 2);
          c.fill();
        } else if (w === "left") {
          // VISTA LATERAL ESQUERDA: Cabelo na nuca (atrás, à direita) e franja na testa acima da sobrancelha (sem tampar o olho)
          c.fillRect(Fe + 1.8, Te - 3.2, 4.4, 6.8); // Nuca / cabelo traseiro
          c.fillRect(Fe - 5.6, Te - 4.6, 2.8, 2.3); // Franja na testa (acima da sobrancelha, livre do olho)
          c.fillRect(Fe - 0.4, Te - 1.8, 1.8, 3.4); // Costeleta junto à orelha (atrás do olho)
        } else if (w === "right") {
          // VISTA LATERAL DIREITA: Cabelo na nuca (atrás, à esquerda) e franja na testa acima da sobrancelha (sem tampar o olho)
          c.fillRect(Fe - 6.2, Te - 3.2, 4.4, 6.8); // Nuca / cabelo traseiro
          c.fillRect(Fe + 2.8, Te - 4.6, 2.8, 2.3); // Franja na testa (acima da sobrancelha, livre do olho)
          c.fillRect(Fe - 1.4, Te - 1.8, 1.8, 3.4); // Costeleta junto à orelha (atrás do olho)
        }

        // Olhos e traços definidos no estilo soldado (desenhados em primeiro plano com visão nítida)
        if (w !== "up") {
          c.fillStyle = "#0f172a";
          if (w === "down") {
            c.fillRect(Fe - 3.2, Te - 0.4, 1.9, 1.9);
            c.fillRect(Fe + 1.3, Te - 0.4, 1.9, 1.9);
            c.fillStyle = "#ffffff";
            c.fillRect(Fe - 2.8, Te - 0.4, 0.9, 0.9);
            c.fillRect(Fe + 1.7, Te - 0.4, 0.9, 0.9);
            c.fillStyle = "#5c2c16";
            c.fillRect(Fe - 3.4, Te - 2.0, 2.3, 0.9);
            c.fillRect(Fe + 1.1, Te - 2.0, 2.3, 0.9);
          } else if (w === "left") {
            c.fillRect(Fe - 4.2, Te - 0.4, 1.9, 1.9);
            c.fillStyle = "#ffffff";
            c.fillRect(Fe - 3.9, Te - 0.4, 0.9, 0.9);
            c.fillStyle = "#5c2c16";
            c.fillRect(Fe - 4.4, Te - 2.0, 2.3, 0.9);
          } else if (w === "right") {
            c.fillRect(Fe + 2.3, Te - 0.4, 1.9, 1.9);
            c.fillStyle = "#ffffff";
            c.fillRect(Fe + 2.6, Te - 0.4, 0.9, 0.9);
            c.fillStyle = "#5c2c16";
            c.fillRect(Fe + 2.1, Te - 2.0, 2.3, 0.9);
          }
        }
        (p && this.drawHeadgear(w, Fe, Te, p),
          this.drawArmsAndCombat(
            w,
            T,
            be,
            Me,
            ue,
            se,
            ne,
            Ee,
            ke,
            G,
            de,
            W,
            l,
            O,
            _,
            K,
            V,
            t.attackAngle, "front"
          ),
          c.restore(),
          (this._dodgeState = null));
        const _e = !!(t.poisonTimer && t.poisonTimer > 0),
          isBleeding = !!(t.bleedTimer && t.bleedTimer > 0),
          xe = t.attachedSlimes || 0;
        if (_e) {
          const ga = Math.sin(this.animTimer * 6) * 0.15 + 0.25;
          ((c.fillStyle = `rgba(34, 197, 94, ${ga})`),
            c.beginPath(),
            c.ellipse(0, -8, 12, 16, 0, 0, Math.PI * 2),
            c.fill());
          for (let we = 0; we < 3; we++) {
            const je = (this.animTimer * 3 + we * 1.3) % 1.5,
              Be = Math.sin(this.animTimer * 2 + we * 2) * 8,
              Se = -4 - je * 18,
              Ae = Math.max(0, 1 - je / 1.5);
            ((c.fillStyle = `rgba(74, 222, 128, ${Ae})`),
              c.beginPath(),
              c.arc(Be, Se, 1.2, 0, Math.PI * 2),
              c.fill());
          }
        }
        if (isBleeding) {
          const bAlpha = Math.sin(this.animTimer * 8) * 0.12 + 0.22;
          c.fillStyle = `rgba(220, 38, 38, ${bAlpha})`;
          c.beginPath();
          c.ellipse(0, -8, 13, 17, 0, 0, Math.PI * 2);
          c.fill();
          for (let we = 0; we < 3; we++) {
            const dropProg = (this.animTimer * 3.5 + we * 1.1) % 1.2;
            const dropX = Math.sin(this.animTimer * 1.8 + we * 2.3) * 6;
            const dropY = -6 + dropProg * 16;
            const dropA = Math.max(0, 1 - dropProg / 1.2);
            c.fillStyle = `rgba(239, 68, 68, ${dropA})`;
            c.beginPath();
            c.arc(dropX, dropY, 1.4, 0, Math.PI * 2);
            c.fill();
          }
        }
        const Ue = t.hp ?? 100,
          $a = t.maxHp ?? 100,
          Ie = t.stamina ?? 100,
          ee = t.maxStamina ?? 100,
          He = !!t.sprinting,
          Sa = !!t.isExhausted,
          oa = He || Sa || Ie < ee - 2;
        if (Ue < $a || _e || isBleeding || xe > 0 || oa) {
          // Posicionamento acima da cabeça e do chapéu/capacete (sem sobrepor a cabeça)
          const headTopY = Te - (p ? 13.5 : 8.5);
          let je = Math.round(headTopY - 7);
          if (Ue < $a || _e || isBleeding || xe > 0) {
            ((c.fillStyle = "rgba(15, 23, 42, 0.85)"),
              c.fillRect(-28 / 2 - 1, je - 1, 30, 3.5 + 2));
            const Be = Math.max(0, Math.min(1, Ue / $a));
            ((c.fillStyle = isBleeding ? "#ef4444" : _e ? "#4ade80" : Be > 0.4 ? "#22c55e" : "#ef4444"),
              c.fillRect(-28 / 2, je, 28 * Be, 3.5),
              isBleeding ? (
                (c.fillStyle = "#ef4444"),
                (c.font = "bold 8px sans-serif"),
                (c.textAlign = "center"),
                c.fillText("🩸", -28 / 2 - 5, je + 3.5)
              ) : _e && (
                (c.fillStyle = "#4ade80"),
                (c.font = "bold 8px monospace"),
                (c.textAlign = "center"),
                c.fillText("☠", -28 / 2 - 5, je + 3.5)
              ),
              xe > 0 &&
                ((c.fillStyle = "#38bdf8"),
                (c.font = "bold 7px sans-serif"),
                (c.textAlign = "left"),
                c.fillText(`${xe}x LENTO`, 28 / 2 + 3, je + 3.5)),
              (je -= 6));
          }
          if (oa) {
            ((c.fillStyle = "rgba(15, 23, 42, 0.85)"),
              c.fillRect(-28 / 2 - 1, je - 1, 30, 2.8 + 2));
            const Se = Math.max(0, Math.min(1, Ie / ee));
            ((c.fillStyle = Sa
              ? Math.sin(this.animTimer * 12) > 0
                ? "#ef4444"
                : "#f97316"
              : He
                ? "#10b981"
                : Se > 0.35
                  ? "#f59e0b"
                  : "#f97316"),
              c.fillRect(-28 / 2, je, 28 * Se, 2.8),
              Sa &&
                ((c.fillStyle = "#f87171"),
                (c.font = "bold 6.5px sans-serif"),
                (c.textAlign = "center"),
                c.fillText("CANSAÇO", 0, je - 2)));
          }
        }
        if (t.isDead)
          (c.save(),
            c.rotate(-Math.PI / 2.2),
            (c.fillStyle = "#f43f5e"),
            (c.font = "bold 9px sans-serif"),
            (c.textAlign = "center"),
            (c.shadowColor = "rgba(0,0,0,0.8)"),
            (c.shadowBlur = 4),
            c.fillText("☠ DERROTADO", 0, -22),
            c.restore());
        else if (t.invulnerableTimer && t.invulnerableTimer > 0) {
          const ga = Math.sin(this.animTimer * 8) * 1.5;
          ((c.strokeStyle = "rgba(56, 189, 248, 0.75)"),
            (c.lineWidth = 1.5),
            c.beginPath(),
            c.ellipse(0, -9, 14 + ga, 20 + ga, 0, 0, Math.PI * 2),
            c.stroke());
        }
        c.restore();
      }
      drawCape(t, l, o, u, m) {
        if (!m) return;
        const c = this.ctx,
          f = m.color || "#b91c1c",
          ds = this._dodgeState,
          dodgeBillow = ds && ds.active ? ds.sin * 5.2 : 0,
          dodgeShiftX = ds && ds.active ? -ds.dx * ds.sin * 3.8 : 0,
          g = (o ? Math.cos(this.animTimer * 8) * 2.5 : u * 3) + dodgeBillow;
        ((c.fillStyle = f),
          t === "down"
            ? (c.fillRect(-8 + dodgeShiftX * 0.5, -15 - l, 16, 17 + g * 0.5),
              (c.fillStyle = "#f59e0b"),
              c.fillRect(-8, -15 - l, 3, 3),
              c.fillRect(5, -15 - l, 3, 3))
            : t === "up"
              ? (c.fillRect(-8 + dodgeShiftX * 0.5, -16 - l, 16, 19 + g),
                (c.fillStyle = "rgba(0, 0, 0, 0.2)"),
                c.fillRect(-2 + dodgeShiftX * 0.35, -15 - l, 4, 18 + g))
              : t === "left"
                ? (c.fillRect(2, -16 - l, 6 + Math.max(0, g + dodgeShiftX), 18),
                  (c.fillStyle = "#f59e0b"),
                  c.fillRect(1, -15 - l, 3, 3))
                : (c.fillRect(-8 - Math.max(0, g - dodgeShiftX), -16 - l, 6 + Math.max(0, g - dodgeShiftX), 18),
                  (c.fillStyle = "#f59e0b"),
                  c.fillRect(-4, -15 - l, 3, 3)));
      }
      drawBackpack(t, l, o) {
        if (!o) return;
        const u = this.ctx,
          m = o.color || "#78350f";
        t === "up"
          ? ((u.fillStyle = m),
            u.fillRect(-6, -15 - l, 12, 11),
            (u.fillStyle = "#451a03"),
            u.fillRect(-4, -13 - l, 8, 7),
            (u.fillStyle = "#fbbf24"),
            u.fillRect(-1.5, -11 - l, 3, 2),
            (u.fillStyle = "#d97706"),
            u.fillRect(-7, -18 - l, 14, 4),
            (u.fillStyle = "#1c1917"),
            u.fillRect(-4, -18 - l, 1.5, 4),
            u.fillRect(2.5, -18 - l, 1.5, 4))
          : t === "left"
            ? ((u.fillStyle = m),
              u.fillRect(4, -14 - l, 5, 10),
              (u.fillStyle = "#d97706"),
              u.fillRect(3, -17 - l, 6, 3.5))
            : t === "right"
              ? ((u.fillStyle = m),
                u.fillRect(-9, -14 - l, 5, 10),
                (u.fillStyle = "#d97706"),
                u.fillRect(-9, -17 - l, 6, 3.5))
              : ((u.fillStyle = "#451a03"),
                u.fillRect(-6, -16 - l, 2.5, 12),
                u.fillRect(3.5, -16 - l, 2.5, 12),
                (u.fillStyle = "#fbbf24"),
                u.fillRect(-6, -10 - l, 2.5, 2),
                u.fillRect(3.5, -10 - l, 2.5, 2));
      }
      drawTorsoArmor(t, l, o, u) {
        const m = this.ctx,
          c = ((u == null ? void 0 : u.name) || "").toLowerCase(),
          f =
            c.includes("armadura") ||
            c.includes("ferro") ||
            c.includes("aço") ||
            c.includes("cota"),
          g = c.includes("couro"),
          y = c.includes("arcano") || c.includes("mago") || c.includes("linho");
        let w = "#2563eb";
        if (u) {
          if (f) w = "#64748b";
          else if (g) w = "#854d0e";
          else if (y) w = "#7c3aed";
          else w = u.color || "#2563eb";
        } else {
          w = "#2563eb";
        }

        const trimColor = f ? "#475569" : g ? "#713f12" : y ? "#6d28d9" : "#1d4ed8";
        const collarColor = f ? "#334155" : g ? "#582f0e" : y ? "#581c87" : "#1e40af";
        const darkHemColor = f ? "#475569" : g ? "#713f12" : y ? "#581c87" : "#1e3a8a";
        const skinColor = this._currentSkinColor || "#e6b89c";

        if (t === "down") {
          // VISTA FRONTAL (olhando para a câmera / descendo)
          // 1. Túnica frontal larga atlética
          m.fillStyle = w;
          m.fillRect(-6.8 + o, -16.2 - l, 13.6, 13.2);

          // 2. Ombreiras anatômicas simétricas dos dois lados
          m.fillStyle = trimColor;
          m.fillRect(-8.4 + o, -16.5 - l, 3.4, 2.2);
          m.fillRect(5.0 + o, -16.5 - l, 3.4, 2.2);

          // 3. Gola frontal com decote em V aberto de sobrevivente
          m.fillStyle = collarColor;
          m.fillRect(-5.5 + o, -17.2 - l, 11.0, 2.0);
          m.fillStyle = skinColor;
          m.beginPath();
          m.moveTo(-2.2 + o, -16.8 - l);
          m.lineTo(0 + o, -13.5 - l);
          m.lineTo(2.2 + o, -16.8 - l);
          m.fill();

          // 4. Detalhes frontais do peitoral
          if (f) {
            m.fillStyle = "#94a3b8";
            m.fillRect(-5.2 + o, -14.8 - l, 10.4, 8.5);
            m.fillStyle = "#cbd5e1";
            m.fillRect(-1.8 + o, -14.2 - l, 3.6, 7.5);
            m.fillStyle = "#475569";
            m.fillRect(-8.8 + o, -16.8 - l, 3.8, 3.0);
            m.fillRect(5.0 + o, -16.8 - l, 3.8, 3.0);
            m.fillStyle = "#f8fafc";
            m.fillRect(-4.5 + o, -14.0 - l, 1.2, 1.2);
            m.fillRect(3.3 + o, -14.0 - l, 1.2, 1.2);
          } else if (g) {
            m.fillStyle = "#a16207";
            m.fillRect(-5.4 + o, -15.2 - l, 10.8, 8.8);
            m.strokeStyle = "#fef08a";
            m.lineWidth = 1.2;
            m.beginPath();
            m.moveTo(-2.5 + o, -14.0 - l);
            m.lineTo(2.5 + o, -11.0 - l);
            m.moveTo(2.5 + o, -14.0 - l);
            m.lineTo(-2.5 + o, -11.0 - l);
            m.stroke();
          } else if (y) {
            m.strokeStyle = "#fbbf24";
            m.lineWidth = 1.2;
            m.beginPath();
            m.moveTo(-4 + o, -16 - l);
            m.lineTo(0 + o, -9 - l);
            m.lineTo(4 + o, -16 - l);
            m.stroke();
          } else {
            m.fillStyle = "rgba(15, 23, 42, 0.2)";
            m.fillRect(-0.9 + o, -15.2 - l, 1.8, 11.0);
            m.strokeStyle = "#e2e8f0";
            m.lineWidth = 1.0;
            m.beginPath();
            m.moveTo(-2.2 + o, -14.2 - l);
            m.lineTo(2.2 + o, -12.0 - l);
            m.moveTo(2.2 + o, -14.2 - l);
            m.lineTo(-2.2 + o, -12.0 - l);
            m.stroke();
          }

          // 5. Barra inferior da túnica frontal
          m.fillStyle = darkHemColor;
          m.fillRect(-6.8 + o, -4.2 - l, 13.6, 1.3);
        } else if (t === "up") {
          // VISTA TRASEIRA (costas do personagem / subindo)
          // 1. Túnica traseira
          m.fillStyle = w;
          m.fillRect(-6.8 + o, -16.2 - l, 13.6, 13.2);

          // 2. Ombreiras traseiras simétricas
          m.fillStyle = trimColor;
          m.fillRect(-8.4 + o, -16.5 - l, 3.4, 2.2);
          m.fillRect(5.0 + o, -16.5 - l, 3.4, 2.2);

          // 3. Gola alta fechada na nuca (sem decote frontal)
          m.fillStyle = collarColor;
          m.fillRect(-5.5 + o, -17.6 - l, 11.0, 2.6);
          m.fillStyle = "rgba(0, 0, 0, 0.25)";
          m.fillRect(-5.5 + o, -15.2 - l, 11.0, 1.0);

          // 4. Costura dorsal central da coluna e relevos das costas
          m.fillStyle = "rgba(0, 0, 0, 0.28)";
          m.fillRect(-1.0 + o, -15.5 - l, 2.0, 11.5);
          m.fillStyle = "rgba(0, 0, 0, 0.12)";
          m.fillRect(-4.8 + o, -14.5 - l, 2.2, 7.0);
          m.fillRect(2.6 + o, -14.5 - l, 2.2, 7.0);

          if (f) {
            // Placa dorsal de aço com reforço da coluna e rebites nos cantos
            m.fillStyle = "#475569";
            m.fillRect(-5.2 + o, -14.8 - l, 10.4, 8.5);
            m.fillStyle = "#64748b";
            m.fillRect(-1.6 + o, -14.5 - l, 3.2, 8.0);
            m.fillStyle = "#94a3b8";
            m.fillRect(-4.5 + o, -14.0 - l, 1.5, 1.5);
            m.fillRect(3.0 + o, -14.0 - l, 1.5, 1.5);
            m.fillRect(-4.5 + o, -8.0 - l, 1.5, 1.5);
            m.fillRect(3.0 + o, -8.0 - l, 1.5, 1.5);
          } else if (g) {
            // Arnês de couro em X cruzado nas costas com anel central de latão
            m.strokeStyle = "#582f0e";
            m.lineWidth = 1.8;
            m.beginPath();
            m.moveTo(-4.5 + o, -14.5 - l);
            m.lineTo(4.5 + o, -7.5 - l);
            m.moveTo(4.5 + o, -14.5 - l);
            m.lineTo(-4.5 + o, -7.5 - l);
            m.stroke();
            m.fillStyle = "#fbbf24";
            m.beginPath();
            m.arc(0 + o, -11.0 - l, 1.8, 0, Math.PI * 2);
            m.fill();
          } else if (y) {
            // Capuz/manto dobrado pendurado nas costas da túnica arcana
            m.fillStyle = "#581c87";
            m.beginPath();
            m.moveTo(-5.0 + o, -15.0 - l);
            m.lineTo(0 + o, -8.0 - l);
            m.lineTo(5.0 + o, -15.0 - l);
            m.closePath();
            m.fill();
            m.strokeStyle = "#fbbf24";
            m.lineWidth = 1.0;
            m.stroke();
          } else {
            // Túnica básica com costura horizontal nos ombros
            m.fillStyle = "rgba(15, 23, 42, 0.25)";
            m.fillRect(-5.0 + o, -12.5 - l, 10.0, 1.0);
          }

          // 5. Barra inferior da túnica com fenda central de cavaleiro
          m.fillStyle = darkHemColor;
          m.fillRect(-6.8 + o, -4.2 - l, 13.6, 1.3);
          m.fillStyle = "rgba(0, 0, 0, 0.35)";
          m.fillRect(-0.7 + o, -4.2 - l, 1.4, 1.3);
        } else if (t === "left") {
          // VISTA LATERAL ESQUERDA (perfil esquerdo, peito à esquerda, costas à direita)
          // 1. Tronco em perfil anatômico esguio (largura 9.4px)
          m.fillStyle = w;
          m.fillRect(-5.6 + o, -16.2 - l, 9.4, 13.2);
          // Projeção/curvatura do peito avançando à esquerda
          m.fillRect(-6.2 + o, -14.5 - l, 1.0, 6.0);

          // 2. Ombreira esquerda em evidência (visão lateral)
          m.fillStyle = trimColor;
          m.fillRect(-3.8 + o, -16.8 - l, 4.8, 2.4);
          // Ombreira direita encoberta atrás
          m.fillStyle = "rgba(0, 0, 0, 0.2)";
          m.fillRect(3.0 + o, -16.5 - l, 1.2, 1.8);

          // 3. Gola inclinada em perfil (mais alta na nuca à direita, descendo ao peito à esquerda)
          m.fillStyle = collarColor;
          m.beginPath();
          m.moveTo(3.8 + o, -17.6 - l);
          m.lineTo(-5.6 + o, -16.4 - l);
          m.lineTo(-5.6 + o, -15.2 - l);
          m.lineTo(3.8 + o, -15.8 - l);
          m.closePath();
          m.fill();

          // 4. Costura lateral do flanco (da axila à cintura)
          m.fillStyle = "rgba(0, 0, 0, 0.24)";
          m.fillRect(-0.8 + o, -14.5 - l, 1.6, 10.5);

          if (f) {
            // Peitoral de aço à esquerda e placa traseira à direita unidos por fivela lateral
            m.fillStyle = "#94a3b8";
            m.fillRect(-5.4 + o, -14.6 - l, 4.4, 8.0);
            m.fillStyle = "#475569";
            m.fillRect(0.8 + o, -14.6 - l, 2.8, 8.0);
            m.fillStyle = "#1e293b";
            m.fillRect(-1.8 + o, -11.5 - l, 3.6, 1.4);
            m.fillStyle = "#cbd5e1";
            m.fillRect(-0.6 + o, -11.8 - l, 1.4, 2.0);
          } else if (g) {
            // Amarração lateral de couro do colete
            m.fillStyle = "#713f12";
            m.fillRect(-1.4 + o, -12.5 - l, 2.8, 1.3);
            m.fillRect(-1.4 + o, -9.5 - l, 2.8, 1.3);
            m.fillStyle = "#fef08a";
            m.fillRect(-0.4 + o, -12.5 - l, 0.9, 1.3);
            m.fillRect(-0.4 + o, -9.5 - l, 0.9, 1.3);
          } else if (y) {
            // Friso lateral dourado da túnica arcana
            m.strokeStyle = "#fbbf24";
            m.lineWidth = 1.1;
            m.beginPath();
            m.moveTo(-0.6 + o, -15.0 - l);
            m.lineTo(-0.6 + o, -4.5 - l);
            m.stroke();
          } else {
            // Realce do contorno do peito
            m.fillStyle = "rgba(255, 255, 255, 0.12)";
            m.fillRect(-5.2 + o, -13.5 - l, 1.2, 5.0);
          }

          // 5. Barra inferior em perfil
          m.fillStyle = darkHemColor;
          m.fillRect(-5.6 + o, -4.2 - l, 9.4, 1.3);
        } else {
          // VISTA LATERAL DIREITA (perfil direito, costas à esquerda, peito à direita)
          // 1. Tronco em perfil anatômico esguio (largura 9.4px)
          m.fillStyle = w;
          m.fillRect(-3.8 + o, -16.2 - l, 9.4, 13.2);
          // Projeção/curvatura do peito avançando à direita
          m.fillRect(5.2 + o, -14.5 - l, 1.0, 6.0);

          // 2. Ombreira direita em evidência (visão lateral)
          m.fillStyle = trimColor;
          m.fillRect(-1.0 + o, -16.8 - l, 4.8, 2.4);
          // Ombreira esquerda encoberta atrás
          m.fillStyle = "rgba(0, 0, 0, 0.2)";
          m.fillRect(-4.2 + o, -16.5 - l, 1.2, 1.8);

          // 3. Gola inclinada em perfil (mais alta na nuca à esquerda, descendo ao peito à direita)
          m.fillStyle = collarColor;
          m.beginPath();
          m.moveTo(-3.8 + o, -17.6 - l);
          m.lineTo(5.6 + o, -16.4 - l);
          m.lineTo(5.6 + o, -15.2 - l);
          m.lineTo(-3.8 + o, -15.8 - l);
          m.closePath();
          m.fill();

          // 4. Costura lateral do flanco (da axila à cintura)
          m.fillStyle = "rgba(0, 0, 0, 0.24)";
          m.fillRect(-0.8 + o, -14.5 - l, 1.6, 10.5);

          if (f) {
            // Placa traseira à esquerda e peitoral à direita unidos por fivela
            m.fillStyle = "#475569";
            m.fillRect(-3.6 + o, -14.6 - l, 2.8, 8.0);
            m.fillStyle = "#94a3b8";
            m.fillRect(1.0 + o, -14.6 - l, 4.4, 8.0);
            m.fillStyle = "#1e293b";
            m.fillRect(-1.8 + o, -11.5 - l, 3.6, 1.4);
            m.fillStyle = "#cbd5e1";
            m.fillRect(-0.6 + o, -11.8 - l, 1.4, 2.0);
          } else if (g) {
            // Amarração lateral de couro do colete
            m.fillStyle = "#713f12";
            m.fillRect(-1.4 + o, -12.5 - l, 2.8, 1.3);
            m.fillRect(-1.4 + o, -9.5 - l, 2.8, 1.3);
            m.fillStyle = "#fef08a";
            m.fillRect(-0.4 + o, -12.5 - l, 0.9, 1.3);
            m.fillRect(-0.4 + o, -9.5 - l, 0.9, 1.3);
          } else if (y) {
            // Friso lateral dourado da túnica arcana
            m.strokeStyle = "#fbbf24";
            m.lineWidth = 1.1;
            m.beginPath();
            m.moveTo(0.6 + o, -15.0 - l);
            m.lineTo(0.6 + o, -4.5 - l);
            m.stroke();
          } else {
            // Realce do contorno do peito
            m.fillStyle = "rgba(255, 255, 255, 0.12)";
            m.fillRect(4.0 + o, -13.5 - l, 1.2, 5.0);
          }

          // 5. Barra inferior em perfil
          m.fillStyle = darkHemColor;
          m.fillRect(-3.8 + o, -4.2 - l, 9.4, 1.3);
        }
      }
      drawBelt(t, l, o, u, m, c) {
        // Sem cinto a pedido do jogador
        if (m) this.drawBeltSlotItem(t, "left", l, o, m);
        if (c) this.drawBeltSlotItem(t, "right", l, o, c);
      }
      drawBeltSlotItem(t, l, o, u, m) {
        if (!m) return;
        const c = this.ctx,
          f = (m.name || "").toLowerCase(),
          g = (m.id || "").toLowerCase(),
          y = l === "left",
          v = (y ? -7.5 : 7.5) + u,
          T = -6.8 - o;
        let S = 1,
          p = 0;
        if (
          (t === "left"
            ? (y || (S = 0.35), (p = y ? -1 : 1))
            : t === "right"
              ? (y && (S = 0.35), (p = y ? -1 : 1))
              : t === "up" && (p = y ? -0.5 : 0.5),
          c.save(),
          (c.globalAlpha = S),
          c.translate(v + p, T),
          (c.fillStyle = "#451a03"),
          c.fillRect(y ? -1.5 : -0.5, -2, 2.5, 3.5),
          (c.fillStyle = "#fbbf24"),
          c.fillRect(y ? -1 : 0, -1, 1.5, 1.5),
          f.includes("espada") ||
            g.includes("espada") ||
            g.includes("sword") ||
            f.includes("adaga") ||
            g.includes("adaga") ||
            g.includes("dagger") ||
            f.includes("faca") ||
            g.includes("faca") ||
            g.includes("knife"))
        ) {
          const A =
              f.includes("faca") ||
              f.includes("adaga") ||
              g.includes("knife") ||
              g.includes("dagger")
                ? 8
                : 13,
            x = y ? Math.PI * 0.16 : -Math.PI * 0.16;
          (c.save(),
            c.rotate(x),
            (c.fillStyle = "#1c1917"),
            c.fillRect(-1.2, 0, 2.4, A),
            (c.fillStyle = "#f59e0b"),
            c.fillRect(-1.2, A - 2.5, 2.4, 2.5),
            (c.fillStyle = "#eab308"),
            c.fillRect(-3, -2, 6, 2),
            (c.fillStyle = "#78350f"),
            c.fillRect(-0.9, -5.5, 1.8, 3.5),
            (c.fillStyle = "#fbbf24"),
            c.beginPath(),
            c.arc(0, -6, 1.4, 0, Math.PI * 2),
            c.fill(),
            c.restore());
        } else if (f.includes("tocha") || g.includes("torch")) {
          const P = y ? Math.PI * 0.12 : -Math.PI * 0.12;
          (c.save(),
            c.rotate(P),
            (c.fillStyle = "#854d0e"),
            c.fillRect(-1, -2, 2, 11),
            (c.fillStyle = "#262626"),
            c.fillRect(-1.8, -6, 3.6, 4.5),
            (c.fillStyle = "#78716c"),
            c.fillRect(-1.8, -4, 3.6, 1.2),
            c.restore());
        } else if (
          f.includes("machado") ||
          g.includes("axe") ||
          f.includes("picareta") ||
          g.includes("pickaxe")
        ) {
          const P = f.includes("picareta") || g.includes("pickaxe"),
            A = y ? Math.PI * 0.1 : -Math.PI * 0.1;
          (c.save(),
            c.rotate(A),
            (c.fillStyle = "#78350f"),
            c.fillRect(-0.9, -3, 1.8, 12),
            (c.fillStyle = "#94a3b8"),
            P
              ? (c.fillRect(-3.5, -4, 7, 2),
                (c.fillStyle = "#64748b"),
                c.fillRect(-4.5, -3.5, 1.5, 1.5))
              : (c.fillRect(y ? -4.5 : 0.5, -4.5, 4, 3.5),
                (c.fillStyle = "#cbd5e1"),
                c.fillRect(y ? -5.2 : 3.8, -4.5, 1.2, 3.5)),
            c.restore());
        } else if (
          f.includes("frasco") ||
          g.includes("frasco") ||
          f.includes("poção") ||
          f.includes("pocao") ||
          g.includes("potion") ||
          f.includes("elixir") ||
          (m.categoryType === "consumable" && f.includes("água"))
        ) {
          const P = Math.min(3, Math.max(1, m.stackCount || 1)),
            A =
              f.includes("água") || f.includes("agua")
                ? "#38bdf8"
                : f.includes("vida") || f.includes("cura")
                  ? "#ef4444"
                  : f.includes("vigor")
                    ? "#22c55e"
                    : "#ea580c";
          for (let x = 0; x < P; x++) {
            const M = (x - (P - 1) / 2) * 2.8,
              $ = (x % 2) * 1.5;
            ((c.fillStyle = "#d97706"),
              c.fillRect(M - 0.7, $ - 0.5, 1.4, 1.5),
              (c.fillStyle = A),
              c.beginPath(),
              c.arc(M, $ + 3.2, 2, 0, Math.PI * 2),
              c.fill(),
              (c.fillStyle = "rgba(255, 255, 255, 0.7)"),
              c.fillRect(M - 1.2, $ + 2, 0.8, 1.2));
          }
        } else if (
          f.includes("aranha") ||
          g.includes("spider") ||
          f.includes("escorpião") ||
          f.includes("escorpiao") ||
          g.includes("scorpion")
        ) {
          const P = Math.min(3, Math.max(1, m.stackCount || 1));
          ((c.fillStyle = "#292524"),
            c.fillRect(-2.5, 0, 5, 5.5),
            (c.strokeStyle = "#ca8a04"),
            (c.lineWidth = 0.8),
            c.strokeRect(-2.5, 0, 5, 5.5),
            (c.fillStyle = f.includes("escorp") ? "#7f1d1d" : "#0f172a"),
            c.beginPath(),
            c.arc(0, 2.5, 1.8, 0, Math.PI * 2),
            c.fill());
          for (let A = 0; A < P; A++)
            ((c.fillStyle = "#facc15"),
              c.fillRect(-1.5 + A * 1.5, 6, 1.2, 1.2));
        } else if (
          f.includes("gosma") ||
          g.includes("slime") ||
          f.includes("coelho") ||
          g.includes("rabbit")
        )
          if (f.includes("gosma") || g.includes("slime")) {
            const P = Math.sin(this.animTimer * 5) * 0.4;
            ((c.fillStyle = "rgba(34, 197, 94, 0.85)"),
              c.beginPath(),
              c.ellipse(0, 3, 2.8 + P, 3.2 - P, 0, 0, Math.PI * 2),
              c.fill(),
              (c.fillStyle = "#14532d"),
              c.fillRect(-0.8, 2.2, 0.9, 0.9),
              c.fillRect(0.6, 2.2, 0.9, 0.9));
          } else
            ((c.fillStyle = "#a8a29e"),
              c.fillRect(-2.5, 1, 5, 4.5),
              (c.fillStyle = "#f5f5f4"),
              c.fillRect(-1.8, -1.8, 1.2, 2.8),
              c.fillRect(0.6, -1.8, 1.2, 2.8),
              (c.fillStyle = "#f472b6"),
              c.fillRect(-1.5, -1.2, 0.6, 1.8),
              c.fillRect(0.9, -1.2, 0.6, 1.8));
        else
          ((c.fillStyle = m.color || "#94a3b8"),
            c.fillRect(-2, 0, 4, 5),
            (c.fillStyle = "#f59e0b"),
            c.fillRect(-1, 1, 2, 2));
        c.restore();
      }
      drawPendant(dir, t, l, o) {
        if (typeof dir !== "string") {
          o = l; l = t; t = dir; dir = "down";
        }
        const u = this.ctx,
          m = (o && o.color) || "#38bdf8",
          c = Math.sin(this.animTimer * 5) * 0.3 + 0.7,
          pX = (dir === "left" ? -2.8 : dir === "right" ? 2.8 : 0) + l;
        ((u.strokeStyle = "#f59e0b"),
          (u.lineWidth = 1.2),
          u.beginPath(),
          u.moveTo(-3 + pX, -16 - t),
          u.quadraticCurveTo(0 + pX, -11 - t, 3 + pX, -16 - t),
          u.stroke(),
          (u.fillStyle = m),
          u.beginPath(),
          u.arc(0 + pX, -12 - t, 2 * c, 0, Math.PI * 2),
          u.fill(),
          (u.fillStyle = `rgba(56, 189, 248, ${c * 0.4})`),
          u.beginPath(),
          u.arc(0 + pX, -12 - t, 4.5 * c, 0, Math.PI * 2),
          u.fill());
      }
      drawHeadgear(t, l, o, u) {
        const m = this.ctx,
          c = u.name.toLowerCase();
        if (c.includes("coroa"))
          ((m.fillStyle = "#fbbf24"),
            m.beginPath(),
            m.moveTo(l - 6, o - 4),
            m.lineTo(l - 6, o - 11),
            m.lineTo(l - 3, o - 7),
            m.lineTo(l, o - 12),
            m.lineTo(l + 3, o - 7),
            m.lineTo(l + 6, o - 11),
            m.lineTo(l + 6, o - 4),
            m.closePath(),
            m.fill(),
            (m.fillStyle = "#ef4444"),
            m.fillRect(l - 1, o - 8, 2, 2));
        else if (
          c.includes("elmo") ||
          c.includes("capacete") ||
          c.includes("ferro") ||
          c.includes("aço")
        )
          ((m.fillStyle = "#64748b"),
            m.beginPath(),
            m.arc(l, o - 1, 7.2, Math.PI, 0),
            m.fill(),
            m.fillRect(l - 7, o - 2, 14, 5),
            t === "down"
              ? ((m.fillStyle = "#0f172a"), m.fillRect(l - 5, o - 1, 10, 2))
              : t === "left"
                ? ((m.fillStyle = "#0f172a"), m.fillRect(l - 6, o - 1, 6, 2))
                : t === "right" &&
                  ((m.fillStyle = "#0f172a"), m.fillRect(l, o - 1, 6, 2)),
            (m.fillStyle = "#f59e0b"),
            m.fillRect(l - 1.5, o - 10, 3, 5));
        else if (c.includes("capuz"))
          ((m.fillStyle = "#334155"),
            m.beginPath(),
            m.arc(l, o - 1, 8, Math.PI, 0),
            m.fill(),
            m.fillRect(l - 8, o - 2, 16, 6));
        else {
          const f = u.color || "#78350f";
          ((m.fillStyle = "#92400e"),
            m.beginPath(),
            m.ellipse(l, o - 4, 11, 4.5, 0, 0, Math.PI * 2),
            m.fill(),
            (m.fillStyle = f),
            m.beginPath(),
            m.arc(l, o - 6, 6, Math.PI, 0),
            m.fill(),
            (m.fillStyle = "#f59e0b"),
            m.fillRect(l - 5.5, o - 6, 11, 2));
        }
      }
      drawArmsAndCombat(t, l, o, u, m, c, f, g, y, w, v, T, S, p, j, P, A, x, passPhase) {
        const M = this.ctx,
          skin = this._currentSkinColor || "#e6b89c",
          shirtColor = this._currentShirtColor || "#2563eb",
          isPebble = (item) => {
            const name = (item?.name || "").toLowerCase();
            const id = (item?.id || "").toLowerCase();
            return (
              name.includes("seixo") ||
              id.includes("seixo") ||
              id.includes("pebble") ||
              name.includes("estilingue") ||
              id.includes("estilingue") ||
              id.includes("slingshot")
            );
          },
          $ = !!(
            p &&
            (p.name.toLowerCase().includes("escudo") || p.id.includes("shield"))
          );
        if (m) {
          if (passPhase === "back") return;
          if (!c) {
          const z = y,
            K = f * 4.5,
            V = z ? 3.5 + o : -3.5 + o,
            O = -9 - l + u;
          ((M.fillStyle = skin),
            M.beginPath(),
            M.arc(V, O, 2.6, 0, Math.PI * 2),
            M.fill());
          let _ = 0,
            se = 0,
            ue = z ? -4.5 + o : 4.5 + o,
            N = -11 - l + u;
          (t === "down"
            ? ((_ = ue), (se = N + 6 + K))
            : t === "up"
              ? ((_ = ue), (se = N - 5 - K))
              : t === "left"
                ? ((_ = -5.5 + o - K), (se = -9 - l + u))
                : ((_ = 5.5 + o + K), (se = -9 - l + u)),
            (M.strokeStyle = skin),
            (M.lineWidth = 3.4),
            (M.lineCap = "round"),
            M.beginPath(),
            M.moveTo(ue, N),
            M.lineTo(_, se),
            M.stroke());
          const Ee = z ? P : A;
          if (Ee) {
            ((M.strokeStyle = Ee.color || "#d97706"),
              (M.lineWidth = 4.2),
              M.beginPath());
            const ne = (ue + _) / 2,
              ke = (N + se) / 2;
            (M.moveTo(ne - 1, ke - 1), M.lineTo(ne + 1, ke + 1), M.stroke());
          }
          if (
            ((M.fillStyle = skin),
            M.beginPath(),
            M.arc(_, se, 3, 0, Math.PI * 2),
            M.fill(),
            (M.fillStyle = "#e2e8f0"),
            M.beginPath(),
            M.arc(_, se, 1.5, 0, Math.PI * 2),
            M.fill(),
            f > 0.45)
          ) {
            const ne = (f - 0.45) / 0.55;
            ((M.strokeStyle = `rgba(255, 255, 255, ${ne * 0.85})`),
              (M.lineWidth = 1.8),
              M.beginPath(),
              t === "right"
                ? M.arc(_ + 3.5, se, 4.5, -Math.PI * 0.4, Math.PI * 0.4)
                : t === "left"
                  ? M.arc(_ - 3.5, se, 4.5, Math.PI * 0.6, Math.PI * 1.4)
                  : t === "down"
                    ? M.arc(_, se + 3.5, 4.5, Math.PI * 0.1, Math.PI * 0.9)
                    : M.arc(_, se - 3.5, 4.5, Math.PI * 1.1, Math.PI * 1.9),
              M.stroke());
          }
          return;
        } else {
          const z =
            j ||
            (p &&
            p.name
              .toLowerCase()
              .match(/espada|lança|lanca|machado|martelo|maca|cajado|bastao/)
              ? p
              : null);
          if (isWhipItemX(z)) {
            drawWhipSwingX(M, t, x, g, o, l, u, z, P, A, !1);
          } else if (
            !!(
              (
                (z == null ? void 0 : z.name) ||
                (z == null ? void 0 : z.id) ||
                ""
              )
                .toLowerCase()
                .match(/lança|lanca|spear/) ||
              (
                (j == null ? void 0 : j.name) ||
                (j == null ? void 0 : j.id) ||
                ""
              )
                .toLowerCase()
                .match(/lança|lanca|spear/) ||
              (
                (p == null ? void 0 : p.name) ||
                (p == null ? void 0 : p.id) ||
                ""
              )
                .toLowerCase()
                .match(/lança|lanca|spear/)
            )
          ) {
            const V =
                t === "right"
                  ? 0
                  : t === "left"
                    ? Math.PI
                    : t === "up"
                      ? -Math.PI / 2
                      : Math.PI / 2,
              O = x !== void 0 ? x : V,
              _ = Math.cos(O),
              se = Math.sin(O),
              ue = Math.sin(Math.pow(g, 0.6) * Math.PI) * 16,
              N = _ < -0.15 || (Math.abs(_) <= 0.15 && t === "left"),
              Ee = (N ? -4 : 4) + o,
              ne = -11 - l + u + (se < -0.3 ? -1 : 0),
              G = 3.5 + ue,
              de = Ee + _ * G,
              W = ne + se * G;
            ((M.strokeStyle = skin),
              (M.lineWidth = 3.4),
              (M.lineCap = "round"),
              M.beginPath(),
              M.moveTo(Ee, ne),
              M.lineTo(de, W),
              M.stroke());
            const le = N ? P || A : A || P;
            if (
              (le &&
                ((M.strokeStyle = le.color || "#d97706"),
                (M.lineWidth = 4.2),
                M.beginPath(),
                M.moveTo((Ee + de) / 2 - 0.5, (ne + W) / 2 - 0.5),
                M.lineTo((Ee + de) / 2 + 0.5, (ne + W) / 2 + 0.5),
                M.stroke()),
              M.save(),
              M.translate(de, W),
              M.rotate(O + Math.PI / 2),
              (M.fillStyle = skin),
              M.beginPath(),
              M.arc(0, 0, 2.8, 0, Math.PI * 2),
              M.fill(),
              ue > 7 &&
                ((M.strokeStyle = "rgba(255, 255, 255, 0.7)"),
                (M.lineWidth = 1.2),
                M.beginPath(),
                M.moveTo(-3, -20),
                M.lineTo(-3, -32),
                M.moveTo(3, -20),
                M.lineTo(3, -32),
                M.stroke()),
              this.drawWeaponItem(z, t, "right"),
              M.restore(),
              !S && !$)
            ) {
              const te = (N ? 2 : -2) + o + _ * (G * 0.35),
                oe = -9 - l + u + se * (G * 0.35);
              ((M.fillStyle = skin),
                M.beginPath(),
                M.arc(te, oe, 2.4, 0, Math.PI * 2),
                M.fill());
            }
          } else if (t === "down") {
            const V = 5 + o,
              O = -11 - l + u,
              _ = 5.5 - g * 3.5 + o,
              se = -10 + Math.sin(g * Math.PI) * 7 - l + u;
            ((M.strokeStyle = skin),
              (M.lineWidth = 3.4),
              (M.lineCap = "round"),
              M.beginPath(),
              M.moveTo(V, O),
              M.lineTo(_, se),
              M.stroke(),
              A &&
                ((M.strokeStyle = A.color || "#d97706"),
                (M.lineWidth = 4.2),
                M.beginPath(),
                M.moveTo((V + _) / 2 - 0.5, (O + se) / 2 - 0.5),
                M.lineTo((V + _) / 2 + 0.5, (O + se) / 2 + 0.5),
                M.stroke()),
              M.save(),
              M.translate(_, se));
            const ue = 0.45 + g * (Math.PI * 1.3 - 0.45);
            (M.rotate(ue),
              (M.fillStyle = skin),
              M.beginPath(),
              M.arc(0, 0, 2.8, 0, Math.PI * 2),
              M.fill(),
              this.drawWeaponItem(z, t, "right"),
              M.restore());
          } else if (t === "right") {
            const V = 4 + o,
              O = -11 - l + u,
              _ = 5 + Math.sin(g * Math.PI) * 5 + o,
              se = -9 + g * 3 - l + u;
            ((M.strokeStyle = skin),
              (M.lineWidth = 3.4),
              (M.lineCap = "round"),
              M.beginPath(),
              M.moveTo(V, O),
              M.lineTo(_, se),
              M.stroke(),
              A &&
                ((M.strokeStyle = A.color || "#d97706"),
                (M.lineWidth = 4.2),
                M.beginPath(),
                M.moveTo((V + _) / 2 - 0.5, (O + se) / 2 - 0.5),
                M.lineTo((V + _) / 2 + 0.5, (O + se) / 2 + 0.5),
                M.stroke()),
              M.save(),
              M.translate(_, se));
            const ue = -0.6 + g * 2.8;
            (M.rotate(ue),
              (M.fillStyle = skin),
              M.beginPath(),
              M.arc(0, 0, 2.8, 0, Math.PI * 2),
              M.fill(),
              this.drawWeaponItem(z, t, "right"),
              M.restore());
          } else if (t === "left") {
            const V = -4 + o,
              O = -11 - l + u,
              _ = -5 - Math.sin(g * Math.PI) * 5 + o,
              se = -9 + g * 3 - l + u;
            ((M.strokeStyle = skin),
              (M.lineWidth = 3.4),
              (M.lineCap = "round"),
              M.beginPath(),
              M.moveTo(V, O),
              M.lineTo(_, se),
              M.stroke(),
              A &&
                ((M.strokeStyle = A.color || "#d97706"),
                (M.lineWidth = 4.2),
                M.beginPath(),
                M.moveTo((V + _) / 2 - 0.5, (O + se) / 2 - 0.5),
                M.lineTo((V + _) / 2 + 0.5, (O + se) / 2 + 0.5),
                M.stroke()),
              M.save(),
              M.translate(_, se),
              M.scale(-1, 1));
            const ue = -0.6 + g * 2.8;
            (M.rotate(ue),
              (M.fillStyle = skin),
              M.beginPath(),
              M.arc(0, 0, 2.8, 0, Math.PI * 2),
              M.fill(),
              this.drawWeaponItem(z, t, "right"),
              M.restore());
          } else {
            const V = -4 + o,
              O = -12 - l + u,
              _ = -4 - g * 2 + o,
              se = -12 - Math.sin(g * Math.PI) * 4 - l + u;
            ((M.strokeStyle = skin),
              (M.lineWidth = 3.4),
              (M.lineCap = "round"),
              M.beginPath(),
              M.moveTo(V, O),
              M.lineTo(_, se),
              M.stroke(),
              A &&
                ((M.strokeStyle = A.color || "#d97706"),
                (M.lineWidth = 4.2),
                M.beginPath(),
                M.moveTo((V + _) / 2 - 0.5, (O + se) / 2 - 0.5),
                M.lineTo((V + _) / 2 + 0.5, (O + se) / 2 + 0.5),
                M.stroke()),
              M.save(),
              M.translate(_, se));
            const ue = -(0.8 - g * 1.8);
            (M.rotate(ue),
              (M.fillStyle = skin),
              M.beginPath(),
              M.arc(0, 0, 2.8, 0, Math.PI * 2),
              M.fill(),
              this.drawWeaponItem(z, t, "right"),
              M.restore());
          }
          if (S) this.drawHeldTorch(t, l);
          else if ($) this.drawHeldShield(t, l, o, p);
          else if (isPebble(p)) {
            const V = (t === "left" ? -8 : t === "right" ? -5 : (t === "up" ? 8 : -8)) + o,
              O = -8 - l + u;
            M.save();
            M.translate(V, O);
            M.fillStyle = skin;
            M.beginPath();
            M.arc(0, 0, 2.5, 0, Math.PI * 2);
            M.fill();
            this.drawWeaponItem(p, t, "left");
            M.restore();
          } else {
            const V = (t === "left" ? 4 : t === "right" ? -4 : (t === "up" ? 6 : -6)) + o,
              O = -8 - l + u;
            ((M.fillStyle = skin),
              M.beginPath(),
              M.arc(V, O, 2.5, 0, Math.PI * 2),
              M.fill());
          }
          return;
        }
      }

        // BRAÇOS E MÃOS ANATÔMICAS COM PIVÔ FIXO NOS OMBROS (balanço pendular real + impulso no salto de esquiva)
        // Os ombros são pontos de ancoragem fixos no topo do tórax.
        // Durante a esquiva, ambos os braços e qualquer item equipado na mão esquerda ou direita
        // acompanham o movimento de salto (abertura aérea, balanço pendular e rotação do punho).
        const isRun = this._isPlayerRunning || false,
          walkNorm = v ? Math.max(-1, Math.min(1, v / 2.8)) : 0,
          ds = this._dodgeState,
          isDodgingArm = !!(ds && ds.active),
          dProg = isDodgingArm ? ds.prog : 0,
          dSin = isDodgingArm ? ds.sin : 0,
          dWave = isDodgingArm ? Math.sin(dProg * Math.PI * 2) : 0,
          dDir = isDodgingArm ? ds.dir : t,
          dDX = isDodgingArm ? ds.dx : 0,
          dDY = isDodgingArm ? ds.dy : 0,
          isLeftTorch = !!(
            S ||
            (p &&
              ((p.name || "").toLowerCase().includes("tocha") ||
                (p.id || "").toLowerCase().includes("torch")))
          ),
          isRightTorch = !!(
            j &&
            ((j.name || "").toLowerCase().includes("tocha") ||
              (j.id || "").toLowerCase().includes("torch"))
          ),
          isRightShield = !!(
            j &&
            ((j.name || "").toLowerCase().includes("escudo") ||
              (j.id || "").toLowerCase().includes("shield"))
          );

        const renderEquippedHandItem = (item, isTorchItem, isShieldItem, facingDir, handRot, mirrorX, handSide = "right") => {
          if (!item && !isTorchItem) return;
          M.save();
          if (mirrorX) M.scale(-1, 1);
          M.rotate(handRot);
          if (isTorchItem) {
            this.drawHeldTorch(facingDir, 0, 0, 0, 0);
          } else if (isShieldItem) {
            this.drawHeldShield(facingDir, 0, 0, item, 0, 0, 0);
          } else {
            this.drawWeaponItem(item, facingDir, handSide);
          }
          M.restore();
        };

        if ((t === "down" || t === "up") && passPhase === "back") return; if (t === "down" || t === "up") {
          // VISTA FRONTAL / TRASEIRA: Ombros ancorados ao corpo com rotação real no salto + balanço de itens nas duas mãos
          const isUp = t === "up",
            swingL = walkNorm * (isRun ? 1.0 : 0.65),
            swingR = -walkNorm * (isRun ? 1.0 : 0.65),
            shoulderTopY = -15.2 - l + u,
            shoulderLX = (isUp ? 7.1 : -7.1) + o,
            shoulderRX = (isUp ? -7.1 : 7.1) + o;

          // Ângulos de abertura e impulso dos braços durante o salto nas 4 direções
          let armRotL = (isUp ? -1 : 1) * swingL * 0.16,
            armRotR = (isUp ? -1 : 1) * -swingR * 0.16,
            armExtendL = swingL,
            armExtendR = swingR,
            shoulderLiftL = 0,
            shoulderLiftR = 0;

          if (isDodgingArm) {
            const isForwardDodge = dDir === t,
              isBackwardDodge = (t === "down" && dDir === "up") || (t === "up" && dDir === "down");
            if (isForwardDodge) {
              // Salto frontal: braços lançados para trás/lados no impulso + chicoteiam à frente na aterrissagem
              armRotL = (isUp ? -1 : 1) * (0.72 * dSin - 0.25 * dWave);
              armRotR = (isUp ? -1 : 1) * (-0.72 * dSin + 0.25 * dWave);
              armExtendL = -1.6 * dSin + 0.8 * dWave;
              armExtendR = -1.6 * dSin + 0.8 * dWave;
              shoulderLiftL = -1.2 * dSin;
              shoulderLiftR = -1.2 * dSin;
            } else if (isBackwardDodge) {
              // Backstep (salto p/ trás): braços abrem alto para equilíbrio aéreo e guarda frontal
              armRotL = (isUp ? -1 : 1) * (0.95 * dSin + 0.22 * dWave);
              armRotR = (isUp ? -1 : 1) * (-0.95 * dSin - 0.22 * dWave);
              armExtendL = -2.0 * dSin;
              armExtendR = -2.0 * dSin;
              shoulderLiftL = -1.8 * dSin;
              shoulderLiftR = -1.8 * dSin;
            } else if (dDir === "left") {
              if (isUp) {
                armRotR = -0.92 * dSin - 0.20 * dWave;
                armRotL = 0.58 * dSin - 0.28 * dWave;
                armExtendR = -1.4 * dSin;
                armExtendL = -1.0 * dSin;
                shoulderLiftR = -1.5 * dSin;
                shoulderLiftL = -0.9 * dSin;
              } else {
                armRotL = 0.92 * dSin + 0.20 * dWave;
                armRotR = -0.58 * dSin + 0.28 * dWave;
                armExtendL = -1.4 * dSin;
                armExtendR = -1.0 * dSin;
                shoulderLiftL = -1.5 * dSin;
                shoulderLiftR = -0.9 * dSin;
              }
            } else if (dDir === "right") {
              if (isUp) {
                armRotR = -0.58 * dSin + 0.28 * dWave;
                armRotL = 0.92 * dSin + 0.20 * dWave;
                armExtendR = -1.0 * dSin;
                armExtendL = -1.4 * dSin;
                shoulderLiftR = -0.9 * dSin;
                shoulderLiftL = -1.5 * dSin;
              } else {
                armRotL = 0.58 * dSin - 0.28 * dWave;
                armRotR = -0.92 * dSin - 0.20 * dWave;
                armExtendL = -1.0 * dSin;
                armExtendR = -1.4 * dSin;
                shoulderLiftL = -0.9 * dSin;
                shoulderLiftR = -1.5 * dSin;
              }
            }
          }

          // 1. Braço Esquerdo (rotaciona a partir do ombro esquerdo e move qualquer item na mão esquerda)
          const armLenL = Math.max(4.4, 6.2 + armExtendL);
          M.save();
          M.translate(shoulderLX, shoulderTopY + shoulderLiftL);
          M.rotate(armRotL);
          M.fillStyle = shirtColor;
          M.fillRect(-1.3, 0, 2.6, armLenL);
          M.fillStyle = P ? (P.color || "#d97706") : "rgba(15, 23, 42, 0.25)";
          M.fillRect(-1.3, armLenL - 1.2, 2.6, 1.6);
          M.fillStyle = skin;
          M.fillRect(-1.2, armLenL + 0.3, 2.4, 2.2);

          if (p || isLeftTorch) {
            M.save();
            M.translate(0, armLenL + 1.3);
            const leftItemRot =
              (isUp ? 0.24 : -0.24) +
              (isDodgingArm ? ((isUp ? -1 : 1) * 0.42 * dSin + 0.22 * dWave + dDX * 0.25 * dSin) : (isUp ? 1 : -1) * -swingL * 0.08);
            renderEquippedHandItem(p, isLeftTorch, $, t, leftItemRot, false, "left");
            M.restore();
          }
          M.restore();

          // 2. Braço Direito (rotaciona a partir do ombro direito e move qualquer item na mão direita)
          const armLenR = Math.max(4.4, 6.2 + armExtendR);
          M.save();
          M.translate(shoulderRX, shoulderTopY + shoulderLiftR);
          M.rotate(armRotR);
          M.fillStyle = shirtColor;
          M.fillRect(-1.3, 0, 2.6, armLenR);
          M.fillStyle = A ? (A.color || "#d97706") : "rgba(15, 23, 42, 0.25)";
          M.fillRect(-1.3, armLenR - 1.2, 2.6, 1.6);
          M.fillStyle = skin;
          M.fillRect(-1.2, armLenR + 0.3, 2.4, 2.2);

          if (j) {
            M.save();
            M.translate(0, armLenR + 1.3);
            const rightItemRot =
              (isUp ? -0.24 : 0.28) +
              (isUp ? -1 : 1) * swingR * 0.08 +
              (isDodgingArm ? ((isUp ? 1 : -1) * -0.45 * dSin - 0.25 * dWave + dDX * 0.32 * dSin) : 0);
            renderEquippedHandItem(j, isRightTorch, isRightShield, t, rightItemRot, false, "right");
            M.restore();
          }
          M.restore();
        } else {
          // VISTA LATERAL EM PERFIL (ESQUERDA / DIREITA):
          // Regra anatômica e de perspectiva:
          // - Se olhando para a DIREITA: braço DIREITO fica à vista (em primeiro plano, acima do corpo);
          //   braço ESQUERDO fica atrás (no fundo).
          // - Se olhando para a ESQUERDA: braço ESQUERDO fica à vista (em primeiro plano, acima do corpo);
          //   braço DIREITO fica atrás (no fundo).
          // Os equipamentos acompanham estritamente a mão que os segura (mão direita -> arma; mão esquerda -> secundária/tocha/escudo).
          const isLeft = t === "left",
            frontShoulderX = (isLeft ? -1.0 : 0.8) + o,
            backShoulderX = (isLeft ? 1.8 : -2.0) + o,
            shoulderPivotY = -14.2 - l + u + (isDodgingArm ? -1.2 * dSin : 0),
            baseWalkAngle = (isLeft ? 1 : -1) * walkNorm * (isRun ? 0.60 : 0.45);

          let frontDodgeAngle = 0,
            backDodgeAngle = 0,
            frontItemExtraRot = 0,
            backItemExtraRot = 0;

          if (isDodgingArm) {
            const forwardSign = isLeft ? 1 : -1;
            if ((isLeft && dDir === "left") || (!isLeft && dDir === "right")) {
              // Dash frontal em perfil
              frontDodgeAngle = forwardSign * (0.88 * dSin + 0.32 * dWave);
              backDodgeAngle = -forwardSign * (0.95 * dSin - 0.30 * dWave);
              frontItemExtraRot = forwardSign * (0.45 * dSin + 0.25 * dWave);
              backItemExtraRot = -forwardSign * (0.38 * dSin);
            } else if ((isLeft && dDir === "right") || (!isLeft && dDir === "left")) {
              // Backstep em perfil
              frontDodgeAngle = forwardSign * (1.05 * dSin - 0.28 * dWave);
              backDodgeAngle = forwardSign * (0.55 * dSin + 0.35 * dWave);
              frontItemExtraRot = -forwardSign * (0.52 * dSin - 0.22 * dWave);
              backItemExtraRot = forwardSign * (0.35 * dSin);
            } else if (dDir === "up") {
              // Esquiva lateral para cima visto de perfil
              frontDodgeAngle = forwardSign * (0.78 * dSin + 0.25 * dWave);
              backDodgeAngle = -forwardSign * (0.72 * dSin + 0.25 * dWave);
              frontItemExtraRot = forwardSign * 0.40 * dSin;
              backItemExtraRot = -forwardSign * 0.35 * dSin;
            } else {
              // Esquiva lateral para baixo visto de perfil
              frontDodgeAngle = -forwardSign * (0.72 * dSin - 0.25 * dWave);
              backDodgeAngle = forwardSign * (0.82 * dSin - 0.25 * dWave);
              frontItemExtraRot = -forwardSign * 0.38 * dSin;
              backItemExtraRot = forwardSign * 0.40 * dSin;
            }
          }

          const frontArmAngle = baseWalkAngle + frontDodgeAngle,
            backArmAngle = -baseWalkAngle * 0.85 + backDodgeAngle;

          // Se indo para a direita:
          // - Braço da frente (à vista/acima) = DIREITO -> item da mão direita (j), bracelete direito (A), tocha da mão direita (isRightTorch)
          // - Braço de trás (no fundo) = ESQUERDO -> item da mão esquerda (p), bracelete esquerdo (P), tocha da mão esquerda (isLeftTorch), escudo (isLeftShield/$)
          // Se indo para a esquerda:
          // - Braço da frente (à vista/acima) = ESQUERDO -> item da mão esquerda (p), bracelete esquerdo (P), tocha da mão esquerda (isLeftTorch), escudo (isLeftShield/$)
          // - Braço de trás (no fundo) = DIREITO -> item da mão direita (j), bracelete direito (A), tocha da mão direita (isRightTorch)
          const frontItem = isLeft ? p : j,
            frontIsTorch = isLeft ? isLeftTorch : isRightTorch,
            frontIsShield = isLeft ? $ : isRightShield,
            frontBracer = isLeft ? P : A,
            backItem = isLeft ? j : p,
            backIsTorch = isLeft ? isRightTorch : isLeftTorch,
            backIsShield = isLeft ? isRightShield : $,
            backBracer = isLeft ? A : P;

          // 1. Braço de Trás (no fundo do corpo: mais escuro, desenhado ATRÁS DO DORSO)
          // Se olhando para a direita -> braço esquerdo fica atrás do dorso
          // Se olhando para a esquerda -> braço direito fica atrás do dorso
          if (passPhase !== "front") {
            if (backItem || backIsTorch || isDodgingArm || Math.abs(walkNorm) > 0.15) {
              M.save();
              M.translate(backShoulderX, shoulderPivotY - (isDodgingArm ? 0.6 * dSin : 0));
              M.rotate(backArmAngle);
              M.fillStyle = shirtColor;
              M.fillRect(-1.2, 0, 2.4, 5.8);
              M.fillStyle = "rgba(0, 0, 0, 0.28)"; // Tom mais escuro representando o braço de trás
              M.fillRect(-1.2, 0, 2.4, 5.8);
              M.fillStyle = backBracer ? (backBracer.color || "#d97706") : "rgba(15, 23, 42, 0.35)";
              M.fillRect(-1.2, 4.4, 2.4, 1.5);
              M.fillStyle = skin;
              M.fillRect(-1.1, 5.9, 2.2, 2.2);
              M.fillStyle = "rgba(0, 0, 0, 0.25)"; // Tom mais escuro na mão de trás
              M.fillRect(-1.1, 5.9, 2.2, 2.2);
              if (backItem || backIsTorch) {
                M.save();
                M.translate(isLeft ? -1.2 : 1.2, 7.0);
                const backBaseRot = isLeft ? -0.32 : 0.32;
                renderEquippedHandItem(
                  backItem,
                  backIsTorch,
                  backIsShield,
                  t,
                  backBaseRot + backItemExtraRot,
                  false,
                  isLeft ? "right" : "left"
                );
                M.restore();
              }
              M.restore();
            }
          }
          // 2. Braço da Frente (à vista, em primeiro plano: desenhado ACIMA DO DORSO)
          // Se olhando para a direita -> braço direito fica em primeiro plano (à vista)
          // Se olhando para a esquerda -> braço esquerdo fica em primeiro plano (à vista)
          if (passPhase !== "back") {
            M.save();
            M.translate(frontShoulderX, shoulderPivotY);
            M.rotate(frontArmAngle);
            M.fillStyle = shirtColor;
            M.fillRect(-1.3, 0, 2.6, 6.2);
            M.fillStyle = frontBracer ? (frontBracer.color || "#d97706") : "rgba(15, 23, 42, 0.25)";
            M.fillRect(-1.3, 4.8, 2.6, 1.6);
            M.fillStyle = skin;
            M.fillRect(-1.2, 6.4, 2.4, 2.4);
            if (frontItem || frontIsTorch) {
              M.save();
              M.translate(isLeft ? -1.5 : 1.5, 7.4);
              const frontBaseRot = isLeft ? -0.35 : 0.35;
              renderEquippedHandItem(
                frontItem,
                frontIsTorch,
                frontIsShield,
                t,
                frontBaseRot + frontItemExtraRot,
                false,
                isLeft ? "left" : "right"
              );
              M.restore();
            }
            M.restore();
          }
        }
      }
      drawWeaponItem(t, facingDir = "down", handSide = "right") {
        const l = this.ctx,
          o = ((t == null ? void 0 : t.name) || "").toLowerCase(),
          u = ((t == null ? void 0 : t.id) || "").toLowerCase();

        let forwardSign = 1;
        if (facingDir === "left") forwardSign = -1;
        else if (facingDir === "right") forwardSign = 1;
        else if (facingDir === "down") forwardSign = (handSide === "left" ? -1 : 1);
        else if (facingDir === "up") forwardSign = (handSide === "left" ? 1 : -1);

        if (isWhipItemX(t)) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          drawWhipHeldX(l, t, this.animTimer);
          l.restore();
        } else if (
          o.includes("estilingue") ||
          u.includes("estilingue") ||
          u.includes("slingshot")
        ) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.lineCap = "round";
          l.lineJoin = "round";
          l.strokeStyle = "#451a03";
          l.lineWidth = 3.2;
          l.beginPath();
          l.moveTo(0, 2);
          l.lineTo(0, -6);
          l.moveTo(0, -5.5);
          l.lineTo(-4.2, -12.5);
          l.moveTo(0, -5.5);
          l.lineTo(4.2, -12.5);
          l.stroke();

          l.strokeStyle = "#854d0e";
          l.lineWidth = 2;
          l.beginPath();
          l.moveTo(0, 2);
          l.lineTo(0, -6);
          l.moveTo(0, -5.5);
          l.lineTo(-4.2, -12.5);
          l.moveTo(0, -5.5);
          l.lineTo(4.2, -12.5);
          l.stroke();

          l.strokeStyle = "#84cc16";
          l.lineWidth = 1.4;
          l.beginPath();
          l.moveTo(-4.2, -12);
          l.quadraticCurveTo(0, -8.5, 4.2, -12);
          l.stroke();

          l.fillStyle = "#78350f";
          l.beginPath();
          l.ellipse(0, -9.8, 2.2, 1.3, 0, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (o.includes("galho")) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#5c3a21";
          l.fillRect(-1.5, -16, 3, 19);
          l.fillStyle = "#854d0e";
          l.fillRect(-0.8, -15, 1.6, 17);
          l.strokeStyle = "#713f12";
          l.lineWidth = 1.8;
          l.beginPath();
          l.moveTo(1, -9);
          l.lineTo(4.5, -13);
          l.stroke();
          l.fillStyle = "#65a30d";
          l.beginPath();
          l.ellipse(4.5, -13.5, 1.8, 1.2, 0.4, 0, Math.PI * 2);
          l.fill();
          l.beginPath();
          l.ellipse(0, -17, 1.5, 2.2, 0, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (o.includes("maça") || o.includes("maca") || o.includes("mace")) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#5c3a21";
          l.fillRect(-1.5, -15, 3, 18);
          l.fillStyle = "#854d0e";
          l.fillRect(-0.8, -14, 1.6, 16);
          l.fillStyle = "#b45309";
          l.fillRect(-1.8, -4, 3.6, 5);
          l.strokeStyle = "#fef3c7";
          l.lineWidth = 0.8;
          l.beginPath();
          l.moveTo(-1.8, -3);
          l.lineTo(1.8, -2);
          l.moveTo(-1.8, -1);
          l.lineTo(1.8, 0);
          l.stroke();
          l.fillStyle = "#475569";
          l.beginPath();
          l.arc(0, 3, 2, 0, Math.PI * 2);
          l.fill();
          l.fillStyle = "#a16207";
          l.fillRect(-2.2, -12.5, 4.4, 2.5);
          l.fillStyle = "#64748b";
          l.beginPath();
          l.moveTo(-4, -18);
          l.lineTo(0, -21);
          l.lineTo(4, -18);
          l.lineTo(5.5, -14.5);
          l.lineTo(4, -11);
          l.lineTo(-4, -11);
          l.lineTo(-5.5, -14.5);
          l.closePath();
          l.fill();
          l.fillStyle = "#94a3b8";
          l.beginPath();
          l.moveTo(0, -21);
          l.lineTo(-4, -18);
          l.lineTo(-2, -14.5);
          l.lineTo(0, -14.5);
          l.closePath();
          l.fill();
          l.fillStyle = "#334155";
          l.beginPath();
          l.moveTo(4, -18);
          l.lineTo(5.5, -14.5);
          l.lineTo(4, -11);
          l.lineTo(0, -14.5);
          l.closePath();
          l.fill();
          l.fillStyle = "#cbd5e1";
          l.beginPath();
          l.arc(-4.5, -14.5, 1.2, 0, Math.PI * 2);
          l.arc(4.5, -14.5, 1.2, 0, Math.PI * 2);
          l.arc(0, -19.5, 1.2, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (o.includes("martelo") || o.includes("hammer")) {
          l.save();
          if (forwardSign === 1) l.scale(-1, 1);
          l.fillStyle = "#5c3a21";
          l.fillRect(-1.5, -15, 3, 18);
          l.fillStyle = "#854d0e";
          l.fillRect(-0.8, -14, 1.6, 16);
          l.fillStyle = "#b45309";
          l.fillRect(-1.8, -3, 3.6, 4);
          l.fillStyle = "#a16207";
          l.fillRect(-2.2, -12, 4.4, 2.5);
          l.fillStyle = "#475569";
          l.fillRect(-6.5, -18, 13, 6);
          l.fillStyle = "#94a3b8";
          l.fillRect(-6.5, -18, 13, 2);
          l.fillStyle = "#cbd5e1";
          l.fillRect(-6.5, -18, 2, 6);
          l.restore();
        } else if (
          o.includes("lança") ||
          o.includes("lanca") ||
          o.includes("spear")
        ) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#78350f";
          l.fillRect(-1.2, -20, 2.4, 23);
          l.fillStyle = "#a16207";
          l.fillRect(-0.6, -19, 1.2, 21);
          l.fillStyle = "#b45309";
          l.fillRect(-1.5, -4, 3, 4);
          l.fillStyle = "#a16207";
          l.fillRect(-1.8, -21, 3.6, 2);
          l.fillStyle = "#64748b";
          l.beginPath();
          l.moveTo(0, -28);
          l.lineTo(3, -21);
          l.lineTo(-3, -21);
          l.closePath();
          l.fill();
          l.fillStyle = "#94a3b8";
          l.beginPath();
          l.moveTo(0, -28);
          l.lineTo(-3, -21);
          l.lineTo(0, -21);
          l.closePath();
          l.fill();
          l.restore();
        } else if (
          o.includes("cajado") ||
          o.includes("bastão") ||
          o.includes("bastao")
        ) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#78350f";
          l.fillRect(-1.5, -18, 3, 22);
          l.fillStyle = "#a16207";
          l.fillRect(-0.7, -17, 1.4, 20);
          l.fillStyle = "#b45309";
          l.fillRect(-1.8, -3, 3.6, 5);
          l.fillStyle = "#d97706";
          l.fillRect(-2.2, -19, 4.4, 1.8);
          l.fillStyle = "#38bdf8";
          l.beginPath();
          l.arc(0, -20.5, 3.8, 0, Math.PI * 2);
          l.fill();
          l.fillStyle = "#e0f2fe";
          l.beginPath();
          l.arc(-1, -21.5, 1.3, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (o.includes("machado")) {
          l.save();
          if (forwardSign === 1) l.scale(-1, 1);
          l.fillStyle = "#5c3a21";
          l.fillRect(-1.5, -15, 3, 18);
          l.fillStyle = "#a16207";
          l.fillRect(-2, -12, 4, 2.5);
          l.fillStyle = "#64748b";
          l.beginPath();
          l.moveTo(1, -14);
          l.lineTo(-7, -17);
          l.quadraticCurveTo(-9, -11, -7, -6);
          l.lineTo(1, -9);
          l.closePath();
          l.fill();
          l.fillStyle = "#cbd5e1";
          l.beginPath();
          l.moveTo(-5, -16);
          l.quadraticCurveTo(-9, -11, -5, -7);
          l.lineTo(-7, -6);
          l.quadraticCurveTo(-9, -11, -7, -17);
          l.closePath();
          l.fill();
          l.restore();
        } else if (
          o.includes("adaga") ||
          u.includes("adaga") ||
          u.includes("dagger") ||
          o.includes("faca") ||
          u.includes("faca") ||
          u.includes("knife")
        ) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#78350f";
          l.fillRect(-1, 0, 2, 3);
          l.fillStyle = "#fbbf24";
          l.beginPath();
          l.arc(0, 3.2, 1.2, 0, Math.PI * 2);
          l.fill();
          l.fillStyle = "#eab308";
          l.fillRect(-2.5, -1.5, 5, 1.5);
          l.fillStyle = "#cbd5e1";
          l.fillRect(-1.2, -10, 2.4, 8.5);
          l.beginPath();
          l.moveTo(-1.2, -10);
          l.lineTo(0, -12.5);
          l.lineTo(1.2, -10);
          l.closePath();
          l.fill();
          l.restore();
        } else if (o.includes("seixo") || u.includes("seixo") || u.includes("pebble")) {
          Hu.render(l, 0, -7, 0.7, this.animTimer);
        } else if (
          o.includes("frasco") ||
          u.includes("frasco") ||
          o.includes("poção") ||
          o.includes("pocao") ||
          o.includes("potion") ||
          o.includes("elixir")
        ) {
          const m =
            o.includes("água") || o.includes("agua")
              ? "#38bdf8"
              : o.includes("vida")
                ? "#ef4444"
                : "#ea580c";
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#d97706";
          l.fillRect(-1, -7, 2, 2);
          l.fillStyle = m;
          l.beginPath();
          l.arc(0, -3, 3, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (
          o.includes("aranha") ||
          o.includes("escorpião") ||
          o.includes("escorpiao")
        ) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#292524";
          l.fillRect(-3, -7, 6, 6);
          l.strokeStyle = "#ca8a04";
          l.strokeRect(-3, -7, 6, 6);
          l.restore();
        } else if (o.includes("gosma") || u.includes("slime")) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "rgba(34, 197, 94, 0.9)";
          l.beginPath();
          l.arc(0, -4, 3.5, 0, Math.PI * 2);
          l.fill();
          l.restore();
        } else if (o.includes("coelho") || u.includes("rabbit")) {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#f5f5f4";
          l.beginPath();
          l.ellipse(0, -4, 3, 4, 0, 0, Math.PI * 2);
          l.fill();
          l.fillStyle = "#f472b6";
          l.fillRect(-1.5, -9, 1, 3);
          l.fillRect(0.5, -9, 1, 3);
          l.restore();
        } else {
          l.save();
          if (forwardSign === -1) l.scale(-1, 1);
          l.fillStyle = "#f59e0b";
          l.fillRect(-4, -3, 8, 2);
          l.fillStyle = "#cbd5e1";
          l.fillRect(-1.5, -16, 3, 13);
          l.beginPath();
          l.moveTo(-1.5, -16);
          l.lineTo(0, -19);
          l.lineTo(1.5, -16);
          l.closePath();
          l.fill();
          l.fillStyle = "#f59e0b";
          l.fillRect(-1, 2, 2, 2);
          l.restore();
        }
      }
      drawHeldShield(t, l, o, u, swingOffset = 0, overrideX, overrideY) {
        const m = this.ctx,
          c = ((u == null ? void 0 : u.name) || "").toLowerCase(),
          f = c.includes("ferro") || c.includes("aço"),
          skin = this._currentSkinColor || "#e6b89c";
        let g = overrideX !== undefined ? overrideX : (-8.6 + o),
          y = overrideY !== undefined ? overrideY : (-7.2 - l + swingOffset);
        if (overrideX === undefined) {
          if (t === "left") g = -6.5 + o;
          else if (t === "right") g = -4.5 + o;
          else if (t === "up") g = 8.6 + o;
        }
        m.save();
        m.translate(g, y);
        m.fillStyle = skin;
        m.beginPath();
        m.arc(0, 0, 2.2, 0, Math.PI * 2);
        m.fill();
        m.fillStyle = f ? "#475569" : "#78350f";
        m.beginPath();
        m.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
        m.fill();
        m.strokeStyle = "#cbd5e1";
        m.lineWidth = 1.4;
        m.stroke();
        m.fillStyle = "#fbbf24";
        m.beginPath();
        m.arc(0, 0, 2, 0, Math.PI * 2);
        m.fill();
        m.restore();
      }
      drawHeldTorch(t, l, swingOffset = 0, overrideX, overrideY) {
        const o = this.ctx,
          skin = this._currentSkinColor || "#e6b89c";
        let u = overrideX !== undefined ? overrideX : -8.6,
          m = overrideY !== undefined ? overrideY : (-7.2 - l + swingOffset),
          c = overrideX !== undefined ? 0 : -0.2;
        if (overrideX === undefined) {
          if (t === "left") {
            u = -6.5;
            m = -7.2 - l + swingOffset;
            c = -0.32;
          } else if (t === "right") {
            u = -4.5;
            m = -7.2 - l + swingOffset;
            c = 0.32;
          } else if (t === "up") {
            u = 8.6;
            m = -10.5 - l + swingOffset;
            c = 0.12;
          } else {
            u = -8.6;
            m = -7.2 - l + swingOffset;
            c = -0.22;
          }
        }
        o.save();
        o.translate(u, m);
        if (c !== 0) o.rotate(c);
        o.fillStyle = skin;
        o.beginPath();
        o.arc(0, 0, 2.2, 0, Math.PI * 2);
        o.fill();
        o.fillStyle = "#78350f";
        o.fillRect(-1.5, -12, 3, 16);
        o.fillStyle = "#451a03";
        o.fillRect(-0.5, -12, 1, 16);
        o.fillStyle = "#b45309";
        o.fillRect(-1.8, -10, 3.6, 2.5);
        o.fillStyle = "#475569";
        o.fillRect(-1.8, -6, 3.6, 1.5);
        o.fillStyle = "#1c1917";
        o.fillRect(-2.2, -13.5, 4.4, 3.5);
        const isWetSurface =
          !this.engine.isUnderground &&
          typeof window !== "undefined" &&
          window.weatherSystem &&
          typeof window.weatherSystem.isWetWeather === "function" &&
          window.weatherSystem.isWetWeather();
        if (this._playerLanternLit !== !1 && !isWetSurface) {
          o.fillStyle = "#ea580c";
          o.fillRect(-2, -14, 4, 1.5);
          this.drawTorchFlame(0, -14);
        }
        o.restore();
      }
      drawTorchFlame(t, l) {
        const o = this.ctx,
          u = this.animTimer,
          m = Math.sin(u * 14) * 1.5,
          c = Math.cos(u * 18 + 0.8) * 1.6,
          f = 11 + Math.sin(u * 10) * 2.5;
        (o.save(),
          o.translate(t, l),
          (o.shadowColor = "#f97316"),
          (o.shadowBlur = 10),
          (o.fillStyle = "#ea580c"),
          o.beginPath(),
          o.moveTo(-3.5, 0),
          o.quadraticCurveTo(-4.2, -f * 0.45, m, -f),
          o.quadraticCurveTo(4.2, -f * 0.45, 3.5, 0),
          o.closePath(),
          o.fill(),
          (o.fillStyle = "#fbbf24"),
          o.beginPath(),
          o.moveTo(-2.2, 0),
          o.quadraticCurveTo(-2.6, -f * 0.4, c * 0.6, -f * 0.75),
          o.quadraticCurveTo(2.6, -f * 0.4, 2.2, 0),
          o.closePath(),
          o.fill(),
          (o.fillStyle = "#fef08a"),
          o.beginPath(),
          o.ellipse(0, -2, 1.5, 2.6, 0, 0, Math.PI * 2),
          o.fill());
        for (let g = 0; g < 3; g++) {
          const y = (u * 3.2 + g * 0.33) % 1,
            w = Math.sin(u * 8 + g * 2.2) * (2 + y * 3.5),
            v = -f - y * 9,
            T = (1 - y) * 0.85;
          ((o.fillStyle =
            g === 1 ? `rgba(254, 240, 138, ${T})` : `rgba(249, 115, 22, ${T})`),
            o.fillRect(w - 0.7, v - 0.7, 1.4, 1.4));
        }
        o.restore();
      }
      updateAndRenderParticles(t, l, o, u, m) {
        const c = this.ctx;
        if (this.particles.length < 50)
          if (this.engine.isUnderground) {
            const f = Math.random() > 0.45;
            this.particles.push({
              x: l + Math.random() * (o - l),
              y: u + Math.random() * (m - u),
              vx: (Math.random() - 0.5) * 0.15,
              vy: f ? -0.2 - Math.random() * 0.2 : 0.8 + Math.random() * 0.6,
              life: 0,
              maxLife: 120 + Math.random() * 100,
              size: f ? 1.2 : 1.8,
              color: f ? "#c084fc" : "#38bdf8",
              alpha: 0.65,
              type: "spark",
            });
          } else {
            const px = l + Math.random() * (o - l);
            const py = u + Math.random() * (m - u);
            const tile = this.engine.getTile(
              Math.floor(px / this.engine.tileSize),
              Math.floor(py / this.engine.tileSize)
            );
            const isGrassBiome = tile && tile.biome && (
              tile.biome.id === BiomeId.MEADOW ||
              tile.biome.id === BiomeId.FOREST ||
              tile.biome.id === BiomeId.DEEP_FOREST ||
              tile.biome.id === BiomeId.SAVANNA ||
              tile.biome.id === BiomeId.SWAMP
            );
            const pType = isGrassBiome
              ? (Math.random() > 0.4 ? "leaf" : "firefly")
              : (tile && tile.biome && tile.biome.ambientParticle === "sand" ? "sand" : "firefly");

            this.particles.push({
              x: px,
              y: py,
              vx: (Math.random() - 0.5) * 0.8 + 0.3,
              vy: (Math.random() - 0.5) * 0.4 + 0.2,
              life: 0,
              maxLife: 150 + Math.random() * 150,
              size: 1.5 + Math.random() * 2,
              color: pType === "leaf" ? "#86efac" : pType === "sand" ? "#eab308" : "#fef08a",
              alpha: 0.7,
              type: pType,
            });
          }
        t.isMoving &&
          Math.random() < 0.35 &&
          ((() => {
            const curT = this.engine.getTile(
              Math.floor(t.x / this.engine.tileSize),
              Math.floor(t.y / this.engine.tileSize),
            );
            return curT && curT.biome.hasWater && !curT.isPortPier && !curT.isPortBoatDeck;
          })()
            ? this.particles.push({
                x: t.x + (Math.random() - 0.5) * 12,
                y: t.y + 2 + (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -0.6 - Math.random() * 0.9,
                life: 0,
                maxLife: 24,
                size: 2.2,
                color: "#e0f2fe",
                alpha: 0.85,
                type: "bubble",
              })
            : this.particles.push({
                x: t.x + (Math.random() - 0.5) * 8,
                y: t.y + 2,
                vx: (Math.random() - 0.5) * 0.2,
                vy: -0.3,
                life: 0,
                maxLife: 30,
                size: 2.5,
                color: "rgba(255, 255, 255, 0.4)",
                alpha: 0.5,
                type: "footstep",
              }));
        for (let f = this.particles.length - 1; f >= 0; f--) {
          const g = this.particles[f];
          if ((g.life++, (g.x += g.vx), (g.y += g.vy), g.life >= g.maxLife)) {
            this.particles.splice(f, 1);
            continue;
          }
          if (
            g.x < l - 300 ||
            g.x > o + 300 ||
            g.y < u - 300 ||
            g.y > m + 300
          ) {
            this.particles.splice(f, 1);
            continue;
          }
          if (g.x < l - 16 || g.x > o + 16 || g.y < u - 16 || g.y > m + 16)
            continue;
          const y = g.life / g.maxLife,
            w = Math.sin(y * Math.PI) * g.alpha;
          if (((c.fillStyle = g.color), (c.globalAlpha = w), g.type === "leaf"))
            (c.beginPath(),
              c.ellipse(
                g.x,
                g.y,
                g.size * 1.5,
                g.size * 0.8,
                g.life * 0.05,
                0,
                Math.PI * 2,
              ),
              c.fill());
          else if (g.type === "firefly") {
            const v = Math.sin(this.animTimer * 5 + g.life * 0.1) * 0.5 + 0.5;
            ((c.shadowColor = "#fef08a"),
              (c.shadowBlur = 6),
              (c.fillStyle = `rgba(254, 240, 138, ${v * w})`),
              c.beginPath(),
              c.arc(g.x, g.y, g.size, 0, Math.PI * 2),
              c.fill(),
              (c.shadowBlur = 0));
          } else if (g.type === "wood_chip") {
            c.save();
            c.translate(g.x, g.y);
            c.rotate(g.life * 0.18 + (g.rotOffset || 0));
            c.fillStyle = g.color;
            c.fillRect(-g.size, -g.size * 0.55, g.size * 2, g.size * 1.1);
            c.restore();
          } else
            g.type === "bubble"
              ? ((c.fillStyle = "rgba(255, 255, 255, 0.9)"),
                c.beginPath(),
                c.arc(g.x, g.y, g.size, 0, Math.PI * 2),
                c.fill(),
                (c.strokeStyle = "#38bdf8"),
                (c.lineWidth = 0.8),
                c.stroke())
              : (c.beginPath(),
                c.arc(g.x, g.y, g.size, 0, Math.PI * 2),
                c.fill());
        }
        c.globalAlpha = 1;
      }
      spawnWoodChips(x, y, count = 10) {
        const colors = ["#d4a373", "#8b5e34", "#5c3826", "#a16207", "#78350f"];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 2.6;
          const color = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            life: 0,
            maxLife: 35 + Math.random() * 25,
            size: 1.5 + Math.random() * 2.2,
            color,
            alpha: 0.95,
            rotOffset: Math.random() * Math.PI,
            type: "wood_chip",
          });
        }
      }
      spawnLeavesBurst(x, y, count = 12) {
        const leafColors = ["#22c55e", "#15803d", "#16a34a", "#4ade80", "#86efac"];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 2.2;
          const color = leafColors[Math.floor(Math.random() * leafColors.length)];
          this.particles.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 16,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            life: 0,
            maxLife: 45 + Math.random() * 30,
            size: 2.0 + Math.random() * 2.5,
            color,
            alpha: 0.9,
            type: "leaf",
          });
        }
      }
      renderFallingTrees(c) {
        if (typeof window === "undefined" || !window.__fallingTrees || window.__fallingTrees.length === 0) return;
        const now = performance.now();
        for (let i = window.__fallingTrees.length - 1; i >= 0; i--) {
          const ft = window.__fallingTrees[i];
          const elapsed = now - ft.startTime;
          const prog = Math.min(1, Math.max(0, elapsed / ft.duration));
          const fallEase = Math.pow(prog, 2.2);
          const targetAngle = (Math.PI / 2) * ft.dir;
          const currentAngle = fallEase * targetAngle;

          let alpha = 1;
          if (prog > 0.82) {
            alpha = Math.max(0, 1 - (prog - 0.82) / 0.18);
          }

          c.save();
          c.translate(ft.x, ft.y);
          c.rotate(currentAngle);
          c.globalAlpha = alpha;

          switch (ft.kind) {
            case "tree_oak":
              rg(c, ft.scale, this.animTimer);
              break;
            case "tree_pine":
              lg(
                c,
                ft.scale,
                ft.biomeId === BiomeId.SNOW_TAIGA || ft.biomeId === BiomeId.SNOW_PEAK,
                this.animTimer,
              );
              break;
            case "tree_palm":
              ig(c, ft.scale, this.animTimer);
              break;
            case "tree_willow":
              ng(c, ft.scale, this.animTimer);
              break;
            case "tree_burnt":
              sg(c, ft.scale, this.animTimer);
              break;
          }
          c.restore();

          if (prog > 0.15 && prog < 0.9 && Math.random() < 0.35) {
            const leafX = ft.x + Math.cos(currentAngle) * (ft.scale * 15 * ft.dir);
            const leafY = ft.y - Math.sin(Math.abs(currentAngle)) * (ft.scale * 15);
            this.spawnLeavesBurst(leafX, leafY, 2);
          }

          if (prog >= 0.92 && !ft.hasImpacted) {
            ft.hasImpacted = true;
            const impactX = ft.x + ft.dir * (ft.scale * 28);
            const impactY = ft.y + 4;
            this.spawnWoodChips(impactX, impactY, 14);
            this.spawnLeavesBurst(impactX, impactY - 6, 16);
          }

          if (prog >= 1.0) {
            window.__fallingTrees.splice(i, 1);
          }
        }
      }
      updateAndRenderBirds(t, l, o, u, m) {
        const c = this.ctx;
        for (const f of this.birds) {
          if (
            ((f.x += f.vx),
            (f.y += f.vy),
            (f.wingPhase += 0.2),
            f.x > o + 300 && (f.x = l - 300),
            f.x < l - 300 && (f.x = o + 300),
            f.y > m + 300 && (f.y = u - 300),
            f.y < u - 300 && (f.y = m + 300),
            f.x < l - 60 || f.x > o + 60 || f.y < u - 90 || f.y > m + 60)
          )
            continue;
          const g = Math.sin(f.wingPhase) * 4 * f.scale;
          ((c.fillStyle = "rgba(0, 0, 0, 0.15)"),
            c.beginPath(),
            c.ellipse(
              f.x + 30,
              f.y + 70,
              6 * f.scale,
              3 * f.scale,
              0,
              0,
              Math.PI * 2,
            ),
            c.fill(),
            (c.strokeStyle = "#1e293b"),
            (c.lineWidth = 2 * f.scale),
            c.beginPath(),
            c.moveTo(f.x - 8 * f.scale, f.y + g),
            c.quadraticCurveTo(f.x - 4 * f.scale, f.y - 2, f.x, f.y),
            c.quadraticCurveTo(
              f.x + 4 * f.scale,
              f.y - 2,
              f.x + 8 * f.scale,
              f.y + g,
            ),
            c.stroke());
        }
      }
      renderCloudShadows(t, l, o, u, m) {
        if (
          this.engine.isUnderground ||
          (window.__rpgQuality?.effects ?? 1) < 0.75 ||
          !(m >= 0.2 && m <= 0.8)
        )
          return;
        const f = this.ctx,
          g = 14,
          y = 4,
          w = this.animTimer * g,
          v = this.animTimer * y,
          T = 3200,
          S = 2400;
        (f.save(), (f.fillStyle = "rgba(15, 23, 42, 0.075)"));
        for (const p of _g) {
          const j = p.bx + w * p.speed,
            P = p.by + v * p.speed,
            A = Math.floor((t - 400 - j) / T),
            x = Math.floor((l + 400 - j) / T),
            M = Math.floor((o - 400 - P) / S),
            $ = Math.floor((u + 400 - P) / S);
          for (let z = A; z <= x; z++)
            for (let K = M; K <= $; K++) {
              const V = j + z * T,
                O = P + K * S;
              (f.beginPath(),
                f.ellipse(V, O, p.rx, p.ry, 0.18, 0, Math.PI * 2),
                f.ellipse(
                  V + p.rx * 0.42,
                  O - p.ry * 0.22,
                  p.rx * 0.72,
                  p.ry * 0.65,
                  0.1,
                  0,
                  Math.PI * 2,
                ),
                f.ellipse(
                  V - p.rx * 0.42,
                  O + p.ry * 0.18,
                  p.rx * 0.68,
                  p.ry * 0.6,
                  -0.1,
                  0,
                  Math.PI * 2,
                ),
                f.fill());
            }
        }
        f.restore();
      }
      renderSunRays(t, l, o) {
        if (
          this.engine.isUnderground ||
          (window.__rpgQuality?.effects ?? 1) < 0.75
        )
          return;
        const u = o >= 0.22 && o <= 0.38,
          m = o >= 0.65 && o <= 0.78;
        if (!u && !m) return;
        const c = Math.sin(
          u ? ((o - 0.22) / 0.16) * Math.PI : ((o - 0.65) / 0.13) * Math.PI,
        );
        if (c <= 0.04) return;
        const f = this.ctx;
        f.save();
        const g = u ? 0.38 : -0.38,
          y = u ? "rgba(254, 240, 138, " : "rgba(251, 146, 60, ";
        for (let w = 0; w < 5; w++) {
          const T =
              (0.035 + Math.sin(this.animTimer * 0.9 + w * 1.5) * 0.02) * c,
            S = t * 0.15 + w * (t * 0.2),
            p = 50 + Math.sin(this.animTimer * 0.6 + w) * 16,
            j = f.createLinearGradient(S, 0, S + Math.tan(g) * l, l);
          (j.addColorStop(0, `${y}${T * 1.8})`),
            j.addColorStop(0.5, `${y}${T})`),
            j.addColorStop(1, `${y}0)`),
            (f.fillStyle = j),
            f.beginPath(),
            f.moveTo(S - p * 0.5, 0),
            f.lineTo(S + p * 0.5, 0),
            f.lineTo(S + p * 1.6 + Math.tan(g) * l, l),
            f.lineTo(S - p * 0.8 + Math.tan(g) * l, l),
            f.closePath(),
            f.fill());
        }
        f.restore();
      }
      renderLightingOverlay(t, l, o, u, m, c, f, g) {
        const y = this.ctx,
          w =
            (((typeof m.timeOfDay === "number" && isFinite(m.timeOfDay)
              ? m.timeOfDay
              : 0.5) %
              1) +
              1) %
            1;
        let v = 0,
          T = "";
        if (this.engine.isUnderground) v = 0.94;
        else {
          // Elevação solar contínua: +1 ao meio-dia (0.50), 0 às 06h (0.25) e 18h (0.75), -1 à meia-noite (0.00/1.00)
          const sunElev = -Math.cos(w * Math.PI * 2);
          // Escurecimento 100% gradual conforme o tempo passa (0.0 ao meio-dia -> 0.40 no pôr do sol/amanhecer -> 0.88 à meia-noite)
          const rawNight = (1 - sunElev) * 0.5;
          v = Math.pow(rawNight, 1.15) * 0.88;

          const dawnDist = Math.abs(w - 0.25);
          const duskDist = Math.abs(w - 0.75);
          const dawnF =
            dawnDist < 0.15
              ? Math.pow(Math.cos((dawnDist / 0.15) * (Math.PI * 0.5)), 1.6)
              : 0;
          const duskF =
            duskDist < 0.15
              ? Math.pow(Math.cos((duskDist / 0.15) * (Math.PI * 0.5)), 1.6)
              : 0;
          const nightF =
            sunElev < 0
              ? Math.pow(-sunElev, 1.1) * (1 - Math.max(dawnF, duskF))
              : 0;
          const wDawn = dawnF * 0.22;
          const wDusk = duskF * 0.19;
          const wNight = nightF * 0.25;
          const tAlpha = wDawn + wDusk + wNight;
          if (tAlpha > 0.002) {
            const tr = Math.round(
              (251 * wDawn + 225 * wDusk + 15 * wNight) / tAlpha,
            );
            const tg = Math.round(
              (146 * wDawn + 29 * wDusk + 15 * wNight) / tAlpha,
            );
            const tb = Math.round(
              (60 * wDawn + 72 * wDusk + 42 * wNight) / tAlpha,
            );
            T = `rgba(${tr}, ${tg}, ${tb}, ${tAlpha.toFixed(4)})`;
          }
          // Clima adverso (Chuva, Tempestade com Raios, Tempestade de Areia, Neve) escurece o ambiente e reduz a visibilidade!
          if (typeof window !== "undefined" && window.weatherSystem && window.weatherSystem.intensity > 0.02) {
            const ws = window.weatherSystem;
            const wInfo = ws.getWeatherInfo(ws.currentWeather);
            const wDarkBoost = (wInfo.darknessBoost || 0) * ws.intensity;
            v = Math.min(0.92, v + wDarkBoost * (1 - v * 0.55));
            // Durante o clarão de um raio, ilumina subitamente o mundo
            if (ws.flashAlpha > 0.05) {
              v = Math.max(0.05, v * (1 - ws.flashAlpha * 0.85));
            }
          }
        }
        if (v > 0.002) {
          const lScale = 0.5,
            lw = Math.max(1, Math.ceil(l * lScale)),
            lh = Math.max(1, Math.ceil(o * lScale));
          (this.lightCanvas ||
            ((this.lightCanvas = document.createElement("canvas")),
            (this.lightCtx = this.lightCanvas.getContext("2d"))),
            (this.lightCanvas.width !== lw || this.lightCanvas.height !== lh) &&
              ((this.lightCanvas.width = lw), (this.lightCanvas.height = lh)));
          const P = this.lightCtx;
          if (!P) return;
          P.setTransform(lScale, 0, 0, lScale, 0, 0);
          P.clearRect(0, 0, l, o);
          const A = this.engine.isUnderground
            ? `rgba(5, 7, 14, ${v})`
            : `rgba(8, 12, 24, ${v})`;
          ((P.fillStyle = A),
            P.fillRect(0, 0, l, o),
            (P.globalCompositeOperation = "destination-out"));
          const isWetWeatherOnSurface =
              !this.engine.isUnderground &&
              typeof window !== "undefined" &&
              window.weatherSystem &&
              typeof window.weatherSystem.isWetWeather === "function" &&
              window.weatherSystem.isWetWeather(),
            x = !!m.lanternActive && !isWetWeatherOnSurface,
            safeU = (typeof u === "number" && isFinite(u) && u > 0) ? u : 1,
            weatherVisMult =
              !this.engine.isUnderground &&
              typeof window !== "undefined" &&
              window.weatherSystem &&
              typeof window.weatherSystem.getEffectiveVisibilityMultiplier === "function"
                ? window.weatherSystem.getEffectiveVisibilityMultiplier(!1)
                : 1.0,
            M = l / 2 + (t.x - f) * safeU,
            $ = o / 2 + (t.y - g) * safeU;
          if (x && isFinite(M) && isFinite($)) {
            const baseSight = this.engine.isUnderground
              ? 220
              : 165 * (0.65 + 0.35 * weatherVisMult);
            const K =
                Math.sin(this.animTimer * 7) * 4.5 +
                Math.cos(this.animTimer * 12) * 2.5,
              V = Math.max(40, baseSight * safeU + K),
              r0 = Math.max(1, Math.min(V * 0.5, 14 * safeU)),
              O = P.createRadialGradient(M, $, r0, M, $, V);
            (O.addColorStop(0, "rgba(0, 0, 0, 1.0)"),
              O.addColorStop(0.45, "rgba(0, 0, 0, 0.92)"),
              O.addColorStop(0.75, "rgba(0, 0, 0, 0.55)"),
              O.addColorStop(1, "rgba(0, 0, 0, 0)"),
              (P.fillStyle = O),
              P.beginPath(),
              P.arc(M, $, V, 0, Math.PI * 2),
              P.fill());
          }
          for (const z of c) {
            const rad = (typeof z.radius === "number" && isFinite(z.radius) && z.radius > 0) ? z.radius : 40,
              K = l / 2 + (z.x - f) * safeU,
              V = o / 2 + (z.y - g) * safeU,
              O = rad * safeU;
            if (isFinite(K) && isFinite(V) && isFinite(O) && O > 0 && K >= -O && K <= l + O && V >= -O && V <= o + O) {
              const r0 = Math.max(1, Math.min(O * 0.5, 8 * safeU)),
                _ = P.createRadialGradient(K, V, r0, K, V, O);
              (z.isCampfire
                ? (_.addColorStop(0, "rgba(0, 0, 0, 1.0)"),
                  _.addColorStop(0.42, "rgba(0, 0, 0, 1.0)"),
                  _.addColorStop(0.72, "rgba(0, 0, 0, 0.65)"),
                  _.addColorStop(1, "rgba(0, 0, 0, 0)"))
                : (_.addColorStop(0, `rgba(0, 0, 0, ${z.intensity})`),
                  _.addColorStop(0.55, `rgba(0, 0, 0, ${z.intensity * 0.65})`),
                  _.addColorStop(1, "rgba(0, 0, 0, 0)")),
                (P.fillStyle = _),
                P.beginPath(),
                P.arc(K, V, O, 0, Math.PI * 2),
                P.fill());
            }
          }
          if (
            ((P.globalCompositeOperation = "source-over"),
            y.drawImage(this.lightCanvas, 0, 0, lw, lh, 0, 0, l, o),
            x && v > 0.15 && isFinite(M) && isFinite($))
          ) {
            const z = (this.engine.isUnderground ? 220 : 160) * safeU,
              K = Math.sin(this.animTimer * 7) * 3.5,
              outerRad = Math.max(20, z + K),
              r0 = Math.max(1, Math.min(outerRad * 0.5, 10 * safeU)),
              V = y.createRadialGradient(M, $, r0, M, $, outerRad);
            (V.addColorStop(0, "rgba(251, 146, 60, 0.22)"),
              V.addColorStop(0.45, "rgba(245, 158, 11, 0.11)"),
              V.addColorStop(0.8, "rgba(234, 88, 12, 0.03)"),
              V.addColorStop(1, "rgba(0, 0, 0, 0)"),
              (y.fillStyle = V),
              y.beginPath(),
              y.arc(M, $, outerRad, 0, Math.PI * 2),
              y.fill());
          }
          y.save();
          for (const z of c) {
            if (z.intensity < 0.4) continue;
            const rad = (typeof z.radius === "number" && isFinite(z.radius) && z.radius > 0) ? z.radius : 40,
              K = l / 2 + (z.x - f) * safeU,
              V = o / 2 + (z.y - g) * safeU,
              O = rad * safeU * 0.9;
            if (isFinite(K) && isFinite(V) && isFinite(O) && O > 0 && K >= -O && K <= l + O && V >= -O && V <= o + O)
              if (z.isCampfire) {
                y.globalCompositeOperation = "lighter";
                const r0 = Math.max(1, Math.min(O * 0.5, 8 * safeU)),
                  _ = y.createRadialGradient(K, V, r0, K, V, O);
                (_.addColorStop(0, "rgba(251, 146, 60, 0.25)"),
                  _.addColorStop(0.38, "rgba(245, 158, 11, 0.14)"),
                  _.addColorStop(0.72, "rgba(234, 88, 12, 0.04)"),
                  _.addColorStop(1, "rgba(0, 0, 0, 0)"),
                  (y.fillStyle = _),
                  y.beginPath(),
                  y.arc(K, V, O, 0, Math.PI * 2),
                  y.fill(),
                  (y.globalCompositeOperation = "source-over"));
              } else {
                const r0 = Math.max(1, Math.min(O * 0.5, 4 * safeU)),
                  _ = y.createRadialGradient(K, V, r0, K, V, O);
                (_.addColorStop(0, z.color),
                  _.addColorStop(1, "rgba(0, 0, 0, 0)"),
                  (y.fillStyle = _),
                  y.beginPath(),
                  y.arc(K, V, O, 0, Math.PI * 2),
                  y.fill());
              }
          }
          (y.restore(),
            !this.engine.isUnderground &&
              T &&
              ((y.fillStyle = T), y.fillRect(0, 0, l, o)));
        }
      }
    };
  ((WorldRenderer.GROUND_CHUNK_TILES = 8),
    (WorldRenderer.GROUND_BAKE_TILE_PX = 40),
    (WorldRenderer.MAX_CACHED_GROUND_CHUNKS = 192),
    (WorldRenderer.ANIMATED_GROUND_BIOMES = new Set([
      BiomeId.VOLCANIC,
    ])));
  let Ws = WorldRenderer;
  if (typeof window !== "undefined") {
    window.__treeShakes = window.__treeShakes || new Map();
    window.__fallingTrees = window.__fallingTrees || [];
    window.shakeTree = (tx, ty, dir = 1, intensity = 6.0) => {
      window.__treeShakes.set(`${tx},${ty}`, {
        startTime: performance.now(),
        duration: 380,
        intensity: intensity,
        dir: dir,
      });
    };
    window.startFallingTree = (treeData) => {
      window.__fallingTrees.push({
        tx: treeData.tx,
        ty: treeData.ty,
        x: treeData.x,
        y: treeData.y,
        kind: treeData.kind,
        subType: treeData.subType || 0,
        scale: treeData.scale || 1,
        biomeId: treeData.biomeId,
        startTime: performance.now(),
        duration: 920,
        dir: treeData.dir || 1,
        hasImpacted: false,
      });
    };
    window.__spawnWoodChips = (x, y, count) => {
      if (window.__worldRenderer && typeof window.__worldRenderer.spawnWoodChips === "function") {
        window.__worldRenderer.spawnWoodChips(x, y, count);
      }
    };
    window.__spawnLeavesBurst = (x, y, count) => {
      if (window.__worldRenderer && typeof window.__worldRenderer.spawnLeavesBurst === "function") {
        window.__worldRenderer.spawnLeavesBurst(x, y, count);
      }
    };
  }
