/* js/ui/game-main.js
 * Componente principal do jogo (GameMain): estado, loop, atalhos, modais.
 * Trecho de legacy/app.original.js (linhas 44919-48807); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const GameMain = (props) => {
    var ur, Vo, at, vi, wi, Ti, Co, Uo, Kp, Wp;
    const initialSeed = (props && typeof props.randomSeed === "number")
      ? props.randomSeed
      : (typeof window.generateRandomSeed === "function" ? window.generateRandomSeed() : (Math.floor(Math.random() * 900000) + 10000));
    const activeSlotId = (props && props.slotId)
      ? props.slotId
      : (typeof window.getActiveSaveSlot === "function" ? window.getActiveSaveSlot() : 1);
    const e = J.useRef(null),
      t = J.useRef(null),
      l = J.useRef(null),
      o = J.useRef(null),
      u = J.useRef(null),
      m = J.useRef(new AudioManager()),
      c = J.useRef(null);
    // O argumento de useRef(...) e avaliado a CADA render: antes, new World(...) rodava em todo render e o mundo
    // descartavel reconfigurava as cidades (setSeed) com a seed errada. Agora o mundo e criado so na primeira vez.
    if (o.current === null) o.current = new World(initialSeed);
    if (c.current === null) c.current = new CreatureManager(o.current);
    const initialSpawn = (o.current && o.current.findTemperateForestSpawn)
      ? o.current.findTemperateForestSpawn()
      : { x: 0, y: 0, tx: 0, ty: 0, biome: BIOMES[BiomeId.FOREST] };
    const f = J.useRef({
      x: initialSpawn.x,
      y: initialSpawn.y,
      vx: 0,
      vy: 0,
      direction: "down",
      isMoving: !1,
      walkCycle: 0,
      speed: 3.4,
      sprinting: !1,
      stamina: 100,
      hp: 100,
      maxHp: 100,
      isDead: !1,
      deathTimer: 0,
      invulnerableTimer: 0,
      name: "Aventureiro",
    }),
      __autoCaveTimer = J.useRef(0),
      g = J.useRef({}),
      y = J.useRef({ up: !1, down: !1, left: !1, right: !1 }),
      [dodgeMode, setDodgeMode] = J.useState(!1),
      dodgeModeRef = J.useRef(!1),
      [w, v] = J.useState(initialSpawn.biome || BIOMES[BiomeId.FOREST] || BIOMES[BiomeId.MEADOW]),
      [T, S] = J.useState({ tx: initialSpawn.tx, ty: initialSpawn.ty }),
      [p, j] = J.useState(initialSeed),
      [P, A] = J.useState(0.5),
      timeOfDayRef = J.useRef(0.5),
      nightCountRef = J.useRef(0),
      [cycleDurationSec, setCycleDurationSecState] = J.useState(() => {
        try {
          const v = Number(localStorage.getItem("rpg2d_cycle_duration_sec"));
          return v >= 5 ? v : 1200;
        } catch (e) {
          return 1200;
        }
      }),
      cycleDurationRef = J.useRef(cycleDurationSec),
      [cyclePaused, setCyclePausedState] = J.useState(() => {
        try {
          return localStorage.getItem("rpg2d_cycle_paused") === "1";
        } catch (e) {
          return !1;
        }
      }),
      cyclePausedRef = J.useRef(cyclePaused),
      setTimeOfDaySync = J.useCallback((valOrFn) => {
        A((prev) => {
          const raw = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
          const num = Number(raw);
          const next = (((isFinite(num) ? num : 0.5) % 1) + 1) % 1;
          timeOfDayRef.current = next;
          o.current.setTimeState(next, nightCountRef.current);
          if (rr.current) rr.current.timeOfDay = next;
          return next;
        });
      }, []),
      setCycleDurationSec = J.useCallback((sec) => {
        const clean = Math.max(5, Math.min(86400, Number(sec) || 1200));
        cycleDurationRef.current = clean;
        setCycleDurationSecState(clean);
        try {
          localStorage.setItem("rpg2d_cycle_duration_sec", String(clean));
        } catch (e) {}
      }, []),
      setCyclePaused = J.useCallback((paused) => {
        const b = !!paused;
        cyclePausedRef.current = b;
        setCyclePausedState(b);
        try {
          localStorage.setItem("rpg2d_cycle_paused", b ? "1" : "0");
        } catch (e) {}
      }, []),
      [x, M] = J.useState(!1),
      [$, z] = J.useState(!1),
      [K, V] = J.useState(1),
      [O, _] = J.useState(!1),
      [se, ue] = J.useState(null),
      [N, Ee] = J.useState(100),
      [ne, ke] = J.useState(100),
      [G, de] = J.useState(!1),
      W = J.useRef(100),
      le = J.useRef(!1),
      [te, oe] = J.useState(100),
      [Ne, X] = J.useState(100),
      [C, I] = J.useState(!1),
      [be, Me] = J.useState(!1),
      [Te, Fe] = J.useState(!1),
      [_e, xe] = J.useState(null),
      [nearbyLogPile, setNearbyLogPile] = J.useState(null),
      nearbyLogPileRef = J.useRef(null),
      [cabinPlacementPreview, setCabinPlacementPreview] = J.useState(null),
      cabinPlacementPreviewRef = J.useRef(null),
      cabinMoveRepeatTimerRef = J.useRef(0),
      // Modal de cozinha: [R] com panela no fogo abre selecao de itens (6 slots)
      [cookingModalOpen, setCookingModalOpen] = J.useState(!1),
      [activeWoodenChest, setActiveWoodenChest] = J.useState(null),
      [readerItem, setReaderItem] = J.useState(null),
      [readerOpen, setReaderOpen] = J.useState(!1),
      cookingPotRef = J.useRef(null),
      Ue = J.useRef(null),
      [$a, Ie] = J.useState(null),
      ee = J.useRef(null);
    ee.current = $a;
    if (typeof window !== "undefined") ((window.__worldEngine = o.current), (window.__playerRef = f));
    const He = J.useRef(100),
      Sa = J.useRef(100),
      oa = J.useRef(!1),
      ga = J.useRef(!1),
      we = J.useRef(!1),
      je = J.useRef({ tx: 0, ty: 0 }),
      Be = J.useRef(""),
      Se = J.useRef({ up: 0, down: 0, left: 0, right: 0 }),
      Ae = J.useRef({ up: !1, down: !1, left: !1, right: !1 }),
      fa = J.useRef(0),
      [Oe, Wa] = J.useState(createEmptyEquipment),
      [Ve, ra] = J.useState($b),
      [ct, _t] = J.useState(0),
      [qr, zo] = J.useState(!1),
      [Lo, tr] = J.useState(!1),
      So = J.useRef(!1),
      pebbleKeyRef = J.useRef({ pressedAt: 0, aiming: !1, angle: void 0, distance: void 0, cancelled: !1 }),
      mouseScreenPos = J.useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0, active: !1 });
    So.current = Lo;
    const [We, Aa] = J.useState(null),
      ma = J.useRef(null),
      Ya = J.useMemo(() => {
        const E = (D) => {
          if (!D) return !1;
          const Q = (D.name || "").toLowerCase(),
            q = (D.id || "").toLowerCase();
          return (
            Q.includes("lança") || Q.includes("lanca") || q.includes("spear")
          );
        };
        return E(Oe.mao_direita)
          ? Oe.mao_direita
          : E(Oe.mao_esquerda)
            ? Oe.mao_esquerda
            : Ve.find(E) || null;
      }, [Oe.mao_direita, Oe.mao_esquerda, Ve]),
      ko = J.useRef(null);
    ko.current = Ya;
    const or = J.useMemo(
        () =>
          Ve.find((E) => {
            const D = (E.name || "").toLowerCase(),
              Q =
                D.includes("frasco") ||
                D.includes("jarra") ||
                D.includes("pote") ||
                D.includes("panela") ||
                D.includes("caldeirão") ||
                D.includes("caldeirao"),
              q = D.includes("com água") || D.includes("com agua");
            return Q && !q;
          }) || null,
        [Ve],
      ),
      Br = J.useRef(null);
    Br.current = or;
    const Da = J.useRef(Oe);
    Da.current = Oe;
    const Zt = J.useRef(Ve);
    Zt.current = Ve;
    const [yl, pn] = J.useState(null),
      Oa = J.useRef({ x: 0, y: 0 }),
      [At, Et] = J.useState(!1),
      Ka = J.useRef(K);
    Ka.current = K;
    const isDevModeActive = Boolean(
      typeof (props && props.devMode) === "boolean"
        ? props.devMode
        : window.__devMode
    );
    J.useEffect(() => {
      if (!isDevModeActive) {
        Ka.current = 1;
        V(1);
        Oa.current = { x: 0, y: 0 };
        Et(!1);
      }
    }, [isDevModeActive]);
    const oc = !!(
        ((ur = Oe.mao_esquerda) != null && ur.id.includes("torch")) ||
        ((Vo = Oe.mao_direita) != null && Vo.id.includes("torch")) ||
        ((at = Oe.mao_esquerda) != null &&
          at.name.toLowerCase().includes("tocha")) ||
        ((vi = Oe.mao_direita) != null &&
          vi.name.toLowerCase().includes("tocha"))
      ),
      vl = !!(
        ((wi = Oe.mao_esquerda) != null && wi.id.includes("sword")) ||
        ((Ti = Oe.mao_direita) != null && Ti.id.includes("sword")) ||
        ((Co = Oe.mao_esquerda) != null &&
          Co.name.toLowerCase().includes("espada")) ||
        ((Uo = Oe.mao_direita) != null &&
          Uo.name.toLowerCase().includes("espada"))
      ),
      wl = oc && $,
      rr = J.useRef({
        showGrid: O,
        timeOfDay: timeOfDayRef.current,
        zoom: K,
        enableWeather: !0,
        lanternActive: wl,
        hasSword: vl,
        combatManager: c.current,
        equipment: Da.current,
        savedCampfire: ee.current,
      });
    rr.current = {
      showGrid: O,
      timeOfDay: timeOfDayRef.current,
      zoom: K,
      enableWeather: !0,
      lanternActive: wl,
      hasSword: vl,
      combatManager: c.current,
      equipment: Da.current,
      savedCampfire: ee.current,
    };
    const lr = J.useRef(null),
      lastSaveToastAt = J.useRef(0),
      ve = J.useCallback((E) => {
        // Toast de Ponto de Salve: aparece apenas uma vez a cada 60s, por pouco tempo
        if (typeof E === "string" && E.includes("Ponto de Salve")) {
          const nowT = Date.now();
          if (nowT - lastSaveToastAt.current < 60000) return;
          lastSaveToastAt.current = nowT;
          ue(E);
          lr.current && window.clearTimeout(lr.current);
          lr.current = window.setTimeout(() => ue(null), 2800);
          return;
        }
        (ue(E),
          lr.current && window.clearTimeout(lr.current),
          (lr.current = window.setTimeout(() => {
            ue(null);
          }, 3500)));
      }, []),
      Qt = J.useCallback(() => {
        zo((E) => {
          const D = !E;
          return (
            D ? m.current.playInventoryOpen() : m.current.playInventoryClose(),
            D
          );
        });
      }, []),
      ir = J.useCallback(
        (E, requestedSlot) => {
          const isPebble = ((E.name || "").toLowerCase().includes("seixo") || (E.id || "").toLowerCase().includes("pebble"));
          if ((!E.slot && !isPebble) || (!E.isEquippable && !isPebble)) return;
          const D = requestedSlot || E.slot || "mao_direita";
          Wa((Q) => {
            var ie;
            const q = Q[D];
            (ra((ge) => {
              let re = [...ge];
              const me = re.findIndex((ce) => ce.id === E.id);
              if (
                (me !== -1 &&
                  (re[me].stackCount && re[me].stackCount > 1
                    ? (re[me] = {
                        ...re[me],
                        stackCount: (re[me].stackCount || 1) - 1,
                      })
                    : (re = re.filter((ce) => ce.id !== E.id))),
                q)
              ) {
                const ce = re.findIndex((Re) => Re.name === q.name);
                ce !== -1 &&
                (q.stackCount !== void 0 ||
                  q.name.toLowerCase().includes("galho"))
                  ? (re[ce] = {
                      ...re[ce],
                      stackCount:
                        (re[ce].stackCount || 1) + (q.stackCount || 1),
                    })
                  : re.push(q);
              }
              return re;
            }),
              m.current.playEquipItem());
            return (
              (E.id.includes("torch") ||
                E.name.toLowerCase().includes("tocha")) &&
                z(!0),
              { ...Q, [D]: { ...E, stackCount: 1 } }
            );
          });
        },
        [],
      ),
      Vr = J.useCallback(
        (E) => {
          Wa((D) => {
            const Q = D[E];
            if (!Q) return D;
            if (E === "mochila") {
              if (Ve.length >= 6)
                return (
                  ve(
                    `Não é possível desequipar a bolsa/mochila: você possui ${Ve.length} itens (capacidade básica é de 6 slots). Libere espaço primeiro!`,
                  ),
                  D
                );
            } else if (E === "cinto") {
              const q = ot(D.mochila),
                F = D.cinto_slot1,
                ie = D.cinto_slot2;
              let ge = 1;
              if (
                (F && !Ve.some((me) => me.name === F.name) && ge++,
                ie && !Ve.some((me) => me.name === ie.name) && ge++,
                Ve.length + ge > q)
              )
                return (
                  ve(
                    "Espaço insuficiente na mochila! Libere espaço antes de desequipar o Cinto com itens nos bolsos.",
                  ),
                  D
                );
              const re = [Q];
              return (
                F && re.push(F),
                ie && re.push(ie),
                ra((me) => {
                  let ce = [...me];
                  for (const Re of re) {
                    const Ce = ce.findIndex((la) => la.name === Re.name),
                      ze = Re.stackCount || 1;
                    Ce !== -1 &&
                    (Re.stackCount !== void 0 ||
                      Re.name.toLowerCase().includes("galho") ||
                      Re.name.toLowerCase().includes("frasco"))
                      ? (ce[Ce] = {
                          ...ce[Ce],
                          stackCount: (ce[Ce].stackCount || 1) + ze,
                        })
                      : ce.push(Re);
                  }
                  return ce;
                }),
                m.current.playUnequipItem(),
                { ...D, cinto: null, cinto_slot1: null, cinto_slot2: null }
              );
            } else if (E === "cinto_slot1" || E === "cinto_slot2") {
              const q = ot(D.mochila);
              if (
                Ve.findIndex((ge) => ge.name === Q.name) === -1 &&
                Ve.length >= q
              )
                return (
                  ve(
                    `Espaço de itens cheio (${Ve.length}/${q} slots)! Libere espaço para retirar o item do cinto.`,
                  ),
                  D
                );
              const ie = Q.stackCount || 1;
              return (
                ra((ge) => {
                  const re = ge.findIndex((me) => me.name === Q.name);
                  if (re !== -1) {
                    const me = [...ge];
                    return (
                      (me[re] = {
                        ...me[re],
                        stackCount: (me[re].stackCount || 1) + ie,
                      }),
                      me
                    );
                  }
                  return [...ge, Q];
                }),
                m.current.playUnequipItem(),
                { ...D, [E]: null }
              );
            } else {
              const q = ot(D.mochila);
              const canStackInBp = Ve.some(
                (ge) =>
                  ge.name === Q.name &&
                  (Q.stackCount !== void 0 || Q.name.toLowerCase().includes("galho")),
              );
              if (!canStackInBp && Ve.length >= q) {
                const isDev = Boolean(
                  typeof (props && props.devMode) === "boolean"
                    ? props.devMode
                    : window.__devMode,
                );
                if (isDev && (!D.mochila || D.mochila.id !== "item_mochila_reforcada") && Ve.length < 21) {
                  const devBackpack = {
                    id: "item_mochila_reforcada",
                    name: "Mochila de Couro Reforçada",
                    icon: "🎒",
                    color: "#6366f1",
                    slot: "mochila",
                    categoryType: "equipment",
                    isEquippable: true,
                    rarity: "raro",
                    description: "Mochila resistente com múltiplos compartimentos (+15 slots extras).",
                    value: 120,
                  };
                  D = { ...D, mochila: devBackpack };
                  Da.current.mochila = devBackpack;
                } else {
                  return (
                    ve(
                      `Espaço de itens cheio (${Ve.length}/${q} slots)! Libere espaço antes de desequipar.`,
                    ),
                    D
                  );
                }
              }
            }
            return (
              (Q.id.includes("torch") ||
                Q.name.toLowerCase().includes("tocha")) &&
                z(!1),
              ra((q) => {
                const F = q.findIndex((ie) => ie.name === Q.name);
                if (
                  F !== -1 &&
                  (Q.stackCount !== void 0 ||
                    Q.name.toLowerCase().includes("galho"))
                ) {
                  const ie = [...q];
                  return (
                    (ie[F] = {
                      ...ie[F],
                      stackCount: (ie[F].stackCount || 1) + 1,
                    }),
                    ie
                  );
                }
                return [...q, Q];
              }),
              m.current.playUnequipItem(),
              { ...D, [E]: null }
            );
          });
        },
        [Ve],
      ),
      gn = J.useCallback(
        (E, D) => {
          if (!Da.current.cinto) {
            ve(
              "⚠️ Você precisa ter um Cinto equipado para usar os bolsos de utilidade!",
            );
            return;
          }
          const q = Da.current[D],
            F = Qs(E, q);
          if (!F.allowed) {
            ve(`⚠️ ${F.reason || "Item não permitido no cinto!"}`);
            return;
          }
          const ie = F.maxAllowedToAdd,
            ge = E.stackCount || 1,
            re = Math.min(ge, ie);
          if (re <= 0) {
            ve("⚠️ Este bolso do cinto já está com a capacidade máxima!");
            return;
          }
          (ra((me) => {
            const ce = me.findIndex(
              (Ce) => Ce.id === E.id || Ce.name === E.name,
            );
            if (ce === -1) return me;
            const Re = me[ce].stackCount || 1;
            if (Re <= re) return me.filter((Ce, ze) => ze !== ce);
            {
              const Ce = [...me];
              return ((Ce[ce] = { ...Ce[ce], stackCount: Re - re }), Ce);
            }
          }),
            Wa((me) => {
              const ce = me[D];
              return ce && ce.name === E.name
                ? {
                    ...me,
                    [D]: { ...ce, stackCount: (ce.stackCount || 1) + re },
                  }
                : { ...me, [D]: { ...E, stackCount: re } };
            }),
            m.current.playEquipItem(),
            ve(
              `🎒 Guardou ${re > 1 ? `${re}x ` : ""}${E.name} no ${D === "cinto_slot1" ? "Bolso 1" : "Bolso 2"} do cinto!`,
            ));
        },
        [ve],
      ),
      rc = J.useCallback(
        (E, D = !1, Q) => {
          const q = f.current,
            F = o.current.isUnderground,
            ie = (D && E.stackCount) || 1;
          let ge = 0,
            re = 0;
          const qDir = q.direction || q.facing || "down";
          qDir === "left"
            ? (ge = -20)
            : qDir === "right"
              ? (ge = 20)
              : qDir === "up"
                ? (re = -20)
                : (re = 20);
          const me = q.x + ge,
            ce = q.y + re;
          if ((c.current.dropItem(E, me, ce, F, ie), Q)) {
            if (Q === "mochila" && Ve.length > 6) {
              ve(
                "Não é possível jogar fora a mochila enquanto houver mais de 6 itens guardados nela!",
              );
              return;
            }
            ((E.id.includes("torch") ||
              E.name.toLowerCase().includes("tocha")) &&
              z(!1),
              Wa((Ce) => {
                const ze = { ...Ce };
                return (delete ze[Q], ze);
              }),
              ve(`🗑️ ${E.name} jogado fora no chão! (Desaparecerá em 60s)`),
              m.current.playUnequipItem());
            return;
          }
          ra((Ce) => {
            const ze = Ce.findIndex((ia) => ia.id === E.id);
            if (ze < 0) return Ce;
            const la = Ce[ze],
              na = la.stackCount || 1;
            if (!D && na > 1) {
              const ia = [...Ce];
              return ((ia[ze] = { ...la, stackCount: na - 1 }), ia);
            } else return Ce.filter((ia, Je) => Je !== ze);
          });
          const Re = ie > 1 ? ` (${ie}x)` : "";
          (ve(`🗑️ ${E.name}${Re} jogado no chão! (Desaparecerá em 60s)`),
            m.current.playItemPickup());
        },
        [Ve.length, ve],
      ),
      handlePlaceWoodLog = J.useCallback(
        (E, requestedQty = 1) => {
          const player = f.current,
            world = o.current;
          if (!player || !world) return;
          const isWoodLogItem = (ia) =>
            !!ia &&
            (ia.id === E?.id ||
              et(ia, "wood_log", "tronco") ||
              (ia.id || "").toLowerCase().includes("wood_log") ||
              (ia.id || "").toLowerCase().includes("tronco") ||
              (ia.name || "").toLowerCase().includes("tronco"));

          const currentPack = Zt.current || Ve || [];
          const totalAvailable = currentPack.reduce(
            (sum, ia) => (isWoodLogItem(ia) ? sum + (ia.stackCount || 1) : sum),
            0,
          );
          if (totalAvailable <= 0) {
            ve("⚠️ Você não possui troncos de madeira no inventário!");
            return;
          }
          const qtyToPlace = Math.max(
            1,
            Math.min(Math.floor(Number(requestedQty) || 1), totalAvailable),
          );

          const tileSize = world.tileSize || 32;
          const pDir = player.direction || player.facing || "down";
          let dirX = 0,
            dirY = 0;
          if (pDir === "left") dirX = -1;
          else if (pDir === "right") dirX = 1;
          else if (pDir === "up") dirY = -1;
          else dirY = 1;

          const pTx = Math.floor(player.x / tileSize),
            pTy = Math.floor(player.y / tileSize);

          const isTileValidForLog = (tx, ty) => {
            const tile = world.getTile(tx, ty);
            if (!tile || !tile.biome || !tile.biome.passable) return false;
            const placed = world.getPlacedProp(tx, ty);
            if (placed && placed.kind === "wood_log") return true;
            if (placed && placed.kind !== "flower_patch") return false;
            if (tile.prop) {
              if (tile.prop.kind === "wood_log") return true;
              if (tile.prop.kind.startsWith("flower_") || tile.prop.kind === "flower_patch") return true;
              return false;
            }
            return true;
          };

          const frontTx = pTx + dirX,
            frontTy = pTy + dirY;

          // Candidatos de posicionamento sempre colados/próximos do player
          const candidateOffsets = [
            [dirX, dirY], // 1º: à frente do player no sentido em que olha
            [0, 0],       // 2º: no próprio tile do player
            dirX !== 0 ? [dirX, -1] : [-1, dirY],
            dirX !== 0 ? [dirX, 1] : [1, dirY],
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ];

          // Prioridade 1: se já existir pilha de troncos próxima, empilha diretamente nela
          let targetTx = null,
            targetTy = null;
          for (const [ox, oy] of candidateOffsets) {
            const cx = pTx + ox,
              cy = pTy + oy;
            const placed = world.getPlacedProp(cx, cy);
            const tile = world.getTile(cx, cy);
            if (
              (placed && placed.kind === "wood_log") ||
              (tile && tile.prop && tile.prop.kind === "wood_log")
            ) {
              targetTx = cx;
              targetTy = cy;
              break;
            }
          }

          // Prioridade 2: primeiro espaço livre transitável adjacente mais próximo do player
          if (targetTx === null) {
            for (const [ox, oy] of candidateOffsets) {
              const cx = pTx + ox,
                cy = pTy + oy;
              if (isTileValidForLog(cx, cy)) {
                targetTx = cx;
                targetTy = cy;
                break;
              }
            }
          }

          // Fallback de segurança
          if (targetTx === null) {
            targetTx = isTileValidForLog(frontTx, frontTy) ? frontTx : pTx;
            targetTy = isTileValidForLog(frontTx, frontTy) ? frontTy : pTy;
          }

          ra((Ce) => {
            let remaining = qtyToPlace;
            const next = [...Ce];
            // Consome primeiro do próprio item selecionado (E.id), se presente
            if (E && E.id) {
              const selectedIdx = next.findIndex((ia) => ia && ia.id === E.id);
              if (selectedIdx >= 0 && remaining > 0) {
                const item = next[selectedIdx];
                const st = item.stackCount || 1;
                if (st > remaining) {
                  next[selectedIdx] = { ...item, stackCount: st - remaining };
                  remaining = 0;
                } else {
                  remaining -= st;
                  next.splice(selectedIdx, 1);
                }
              }
            }
            // Consome o restante de outros slots de tronco na mochila
            for (let i = next.length - 1; i >= 0 && remaining > 0; i--) {
              const item = next[i];
              if (isWoodLogItem(item)) {
                const st = item.stackCount || 1;
                if (st > remaining) {
                  next[i] = { ...item, stackCount: st - remaining };
                  remaining = 0;
                } else {
                  remaining -= st;
                  next.splice(i, 1);
                }
              }
            }
            return next;
          });

          const existingProp =
            world.getPlacedProp(targetTx, targetTy) ||
            (world.getTile(targetTx, targetTy).prop &&
            world.getTile(targetTx, targetTy).prop.kind === "wood_log"
              ? world.getTile(targetTx, targetTy).prop
              : null);

          const buildLogDescription = (cnt) =>
            cnt >= 5
              ? `Pilha com ${cnt} troncos no chão. Pressione [C] ou toque em CABANA para construir uma cabana, ou [F] para recolher.`
              : cnt > 1
                ? `Pilha com ${cnt} troncos de madeira robustos no chão. Pressione [F] para recolher à mochila.`
                : "Tronco robusto de árvore cortada colocado no chão. Pressione [F] para recolher à mochila.";

          if (existingProp && existingProp.kind === "wood_log") {
            const newCount = (existingProp.count || 1) + qtyToPlace;
            world.placeProp(targetTx, targetTy, {
              ...existingProp,
              count: newCount,
              namePt: newCount > 1 ? `Pilha de Troncos (${newCount})` : "Tronco de Madeira",
              descriptionPt: buildLogDescription(newCount),
            });
          } else {
            const newCount = qtyToPlace;
            world.placeProp(targetTx, targetTy, {
              kind: "wood_log",
              subType: 0,
              count: newCount,
              offsetX: 0,
              offsetY: 2,
              scale: 1,
              interactive: !0,
              namePt: newCount > 1 ? `Pilha de Troncos (${newCount})` : "Tronco de Madeira",
              descriptionPt: buildLogDescription(newCount),
            });
          }
          m.current && m.current.playWoodChop && m.current.playWoodChop();
        },
        [],
      );
      window.__placeWoodLog = handlePlaceWoodLog;
      const bn = J.useCallback(
        (E) => {
          const D = ac(E);
          if (!D) {
            ve("Esta carcaça não pode ser destrinchada.");
            return;
          }
          const Q = u0(Zt.current, Da.current);
          if (!Q) {
            ve("Você precisa de uma faca para destrinchar esta carcaça!");
            return;
          }
          (ra((q) => {
            const F = q.findIndex((ge) => ge.id === E.id || ge.name === E.name);
            if (F === -1) return q;
            const ie = q[F];
            if ((ie.stackCount || 1) > 1) {
              const ge = [...q];
              return (
                (ge[F] = { ...ie, stackCount: (ie.stackCount || 1) - 1 }),
                ge
              );
            } else return q.filter((ge, re) => re !== F);
          }),
            m.current.playFusionSuccess(),
            zo(!1),
            pn({ creatureType: D, carcassItem: E, knifeItem: Q }));
        },
        [ve],
      ),
      bi = J.useCallback(
        (E) => {
          const D = ot(Da.current.mochila);
          let Q = !1;
          return (
            ra((q) => {
              const canStack = (E.maxStack === undefined || E.maxStack > 1) && E.isStackable !== !1;
              const F = canStack
                ? q.findIndex((ie) => ie.name === E.name && (ie.stackCount || 1) < (ie.maxStack || 20))
                : -1;
              if (F >= 0) {
                // Anti-dupe: respeitar o limite de pilha do item (impede loot infinito ao re-clique)
                const mx = E.maxStack || q[F].maxStack || 20;
                const cur = q[F].stackCount || 1;
                const add = Math.min(E.stackCount || 1, Math.max(0, mx - cur));
                if (add <= 0) return q;
                const ie = [...q];
                return (
                  (ie[F] = {
                    ...ie[F],
                    stackCount: cur + add,
                  }),
                  (Q = !0),
                  ie
                );
              }
              return q.length >= D ? q : ((Q = !0), [...q, E]);
            }),
            Q && m.current.playItemPickup(),
            Q
          );
        },
        [ve],
      ),
      Ut = J.useCallback(
        (E) => {
          const D = o.current,
            Q = f.current;
          if (!D || !Q) return !1;
          const q = Math.floor(Q.x / D.tileSize),
            F = Math.floor(Q.y / D.tileSize);
          let ie = !1,
            ge = "Lagoa";
          for (let Re = -1; Re <= 1; Re++) {
            for (let Ce = -1; Ce <= 1; Ce++) {
              const ze = D.getTile(q + Re, F + Ce);
              if (ze.biome.hasWater) {
                ((ie = !0), (ge = ze.biome.namePt));
                break;
              }
            }
            if (ie) break;
          }
          if (!ie)
            return (
              m.current.playPunchWhoosh(),
              ve(
                "⚠️ Você precisa estar na margem de uma lagoa, rio ou oásis para coletar água fresca!",
              ),
              !1
            );
          let re = E || null;
          if (
            (re ||
              (re =
                Ve.find((Re) => {
                  const Ce = (Re.name || "").toLowerCase(),
                    ze =
                      Ce.includes("frasco") ||
                      Ce.includes("jarra") ||
                      Ce.includes("pote") ||
                      Ce.includes("panela") ||
                      Ce.includes("caldeirão") ||
                      Ce.includes("caldeirao"),
                    la = Ce.includes("com água") || Ce.includes("com agua");
                  return ze && !la;
                }) || null),
            !re)
          )
            return (
              m.current.playPunchWhoosh(),
              ve(
                "⚠️ Você não possui recipientes vazios (frascos, jarras, potes ou panelas) na mochila para coletar água!",
              ),
              !1
            );
          const me = (re.name || "").toLowerCase();
          let ce;
          if (me.includes("frasco"))
            ce = {
              id: `water_frasco_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Frasco com Água Fresca",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "comum",
              icon: "💧",
              color: "#38bdf8",
              value: 35,
              stackCount: 1,
              description: `Frasco cerâmico abastecido com água límpida e fresca de ${ge}. Pressione [Usar] para beber e restaurar +40 de Stamina. O frasco ficará vazio e reutilizável.`,
            };
          else if (me.includes("jarra") || me.includes("jarro") || me.includes("ânfora") || me.includes("anfora") || me.includes("cratera")) {
            const isAnfora = me.includes("ânfora") || me.includes("anfora");
            const isCratera = me.includes("cratera");
            ce = {
              id: `water_jarra_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: isAnfora ? "Ânfora com Água Fresca" : isCratera ? "Cratera com Água Fresca" : "Jarro com Água Fresca",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: isCratera ? "raro" : "incomum",
              icon: "🏺",
              color: "#0ea5e9",
              value: isCratera ? 85 : isAnfora ? 70 : 50,
              stackCount: 1,
              description: `Vaso cerâmico das ruínas cheio de água pura e refrescante de ${ge}. Pressione [Usar] para saciar a sede e restaurar ${isCratera ? "+90" : isAnfora ? "+75" : "+60"} de Stamina. O recipiente ficará vazio e reutilizável.`,
            };
          } else if (me.includes("pote"))
            ce = {
              id: `water_pote_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: "Pote de Barro com Água",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "comum",
              icon: "🏺",
              color: "#0284c7",
              value: 40,
              stackCount: 1,
              description: `Pote de barro rústico contendo água fresca recolhida de ${ge}. Pressione [Usar] para beber e recuperar +55 de Stamina. O pote ficará vazio e reutilizável.`,
            };
          else {
            const Re = me.includes("caldeirão") || me.includes("caldeirao");
            ce = {
              id: `water_panela_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              name: Re
                ? "Caldeirão de Barro com Água"
                : "Panela de Barro com Água",
              categoryType: "consumable",
              isEquippable: !1,
              rarity: "incomum",
              icon: Re ? "🍲" : "🍳",
              color: "#0369a1",
              value: 60,
              stackCount: 1,
              description: `Recipiente robusto de barro transbordando de água límpida de ${ge}. Pressione [Usar] para beber e recuperar +90 de Stamina ou utilize para receitas de cozidos no fogo. Esvazia após o uso.`,
            };
          }
          return (
            ra((Re) => {
              const Ce = Re.findIndex((na) => na.id === re.id);
              if (Ce === -1) return Re;
              const ze = [...Re],
                la = ze[Ce].stackCount || 1;
              return (
                la > 1
                  ? ((ze[Ce] = { ...ze[Ce], stackCount: la - 1 }), ze.push(ce))
                  : (ze[Ce] = ce),
                ze
              );
            }),
            m.current.playCaveExit(),
            !0
          );
        },
        [Ve, ve],
      ),
      lc = J.useCallback(
        (E) => {
          if (E.categoryType !== "consumable") return;
          const D = E.name.toLowerCase();
          if (D.includes("forno de barro") || E.isPlaceableOven) {
            const F = o.current,
              ie = f.current;
            if (!F || !ie) return;
            const ge = F.tileSize,
              re = Math.floor(ie.x / ge),
              me = Math.floor(ie.y / ge);
            (F.placeProp(re, me, {
              kind: "clay_oven",
              subType: 0,
              offsetX: 0,
              offsetY: 2,
              scale: 1,
              interactive: !0,
              lit: !0,
              namePt: "Forno de Barro",
              descriptionPt:
                "Forno cúpula artesanal de argila aquecido. Pressione [F] para descansar, salvar e assar peixes!",
            }),
              ra((ce) => {
                const Re = ce.findIndex((ze) => ze.id === E.id);
                if (Re === -1) return ce;
                const Ce = ce[Re];
                if (Ce.stackCount && Ce.stackCount > 1) {
                  const ze = [...ce];
                  return (
                    (ze[Re] = { ...Ce, stackCount: Ce.stackCount - 1 }),
                    ze
                  );
                } else return ce.filter((ze) => ze.id !== E.id);
              }),
              m.current.playChestChime(),
              ve(
                "🔥 Forno de Barro instalado no solo! Ele mantém brasas ativas para assar peixes e descansar.",
              ));
            return;
          }
          if (
            E.isPlaceableChest ||
            D.includes("baú de madeira") ||
            D.includes("bau de madeira")
          ) {
            const F = o.current,
              ie = f.current;
            if (!F || !ie) return;
            const ge = F.tileSize,
              re = Math.floor(ie.x / ge),
              me = Math.floor(ie.y / ge);
            const candidates = [
              [re, me + 1],
              [re + 1, me],
              [re - 1, me],
              [re, me - 1],
              [re, me],
              [re + 1, me + 1],
              [re - 1, me + 1],
            ];
            let initTx = re;
            let initTy = me + 1;
            for (const [cx, cy] of candidates) {
              if (F.isChestPlacementValid && F.isChestPlacementValid(cx, cy)) {
                initTx = cx;
                initTy = cy;
                break;
              }
            }
            const previewObj = {
              active: !0,
              mode: "chest",
              chestItemId: E.id,
              chestItemName: E.name,
              pileTx: re,
              pileTy: me,
              originTx: initTx,
              originTy: initTy,
              width: 1,
              height: 1,
            };
            cabinPlacementPreviewRef.current = previewObj;
            if (typeof window !== "undefined") window.__cabinPlacementPreview = previewObj;
            setCabinPlacementPreview(previewObj);
            zo(!1);
            m.current && m.current.playEquipItem && m.current.playEquipItem();
            return;
          }
          if (
            D.includes("livro") ||
            D.includes("tomo") ||
            D.includes("tratado") ||
            D.includes("compêndio") ||
            D.includes("compendio") ||
            D.includes("manuscrito") ||
            D.includes("pergaminho") ||
            (E.id && (E.id.includes("livro") || E.id.includes("pergaminho")))
          ) {
            m.current.playChestChime && m.current.playChestChime();
            const xpGained = D.includes("tratado") || D.includes("segredos") || D.includes("runic") || D.includes("misterio") ? 100 : 75;
            _t((xp) => xp + xpGained);
            setReaderItem(E);
            setReaderOpen(!0);
            ve(`📖 Abrindo: ${E.name} (+${xpGained} XP)!`);
            return;
          }
          if (D.includes("com água") || D.includes("com agua")) {
            m.current.playCaveExit();
            const F = f.current.maxStamina ?? 100;
            let ie = 40,
              ge = "Frasco de Barro",
              re = "🏺",
              me = "#ea580c",
              ce =
                "Frasco cerâmico torneado em pura argila e seco ao sol. Pode ser usado na beira da água para coletar água fresca (+40 Stamina ao beber).";
            (D.includes("ânfora") || D.includes("anfora")
              ? ((ie = 75),
                (ge = "Ânfora Grega Antiga"),
                (re = "🏺"),
                (me = "#ea580c"),
                (ce =
                  "Ânfora cerâmica clássica recolhida das ruínas. Pode ser usada na água para coletar água fresca (+75 Stamina ao beber)."))
              : D.includes("cratera")
                ? ((ie = 90),
                  (ge = "Cratera de Cerâmica das Ruínas"),
                  (re = "🏺"),
                  (me = "#d97706"),
                  (ce =
                    "Grande vaso cerâmico de banquete das ruínas. Pode ser usado para coletar água fresca (+90 Stamina ao beber)."))
                : D.includes("jarro")
                  ? ((ie = 60),
                    (ge = "Pote de Terracota das Ruínas"),
                    (re = "🏺"),
                    (me = "#c2410c"),
                    (ce =
                      "Jarro e pote resistente de terracota recolhido das ruínas antigas (+60 Stamina ao beber)."))
                  : D.includes("jarra")
                    ? ((ie = 70),
                      (ge = "Jarra de Barro Vazia"),
                      (re = "🏺"),
                      (me = "#d97706"),
                      (ce =
                        "Jarra cerâmica com alça e bico torneada em argila pura. Pode ser mergulhada na água para coletar água fresca (+70 Stamina ao beber)."))
              : D.includes("pote")
                ? ((ie = 55),
                  (ge = "Pote de Barro Vazio"),
                  (re = "🏺"),
                  (me = "#c2410c"),
                  (ce =
                    "Pote de cerâmica rústica moldado em argila e seco ao sol. Pode ser levado à beira da água para coletar água fresca (+55 Stamina ao beber)."))
                : D.includes("panela")
                  ? ((ie = 90),
                    (ge = "Panela de Barro Vazia"),
                    (re = "🍳"),
                    (me = "#b45309"),
                    (ce =
                      "Panela robusta de barro com paredes grossas. Pode coletar água fresca na lagoa (+90 Stamina ao beber) ou preparar receitas."))
                  : (D.includes("caldeirão") || D.includes("caldeirao")) &&
                    ((ie = 90),
                    (ge = "Caldeirão de Barro Vazio"),
                    (re = "🍲"),
                    (me = "#9a3412"),
                    (ce =
                      "Caldeirão robusto moldado com paredes espessas de argila. Pode coletar água fresca (+90 Stamina) ou ser usado em receitas no fogo.")),
              (f.current.stamina = Math.min(F, (f.current.stamina ?? 0) + ie)),
              (f.current.isExhausted = !1),
              (He.current = f.current.stamina),
              (oa.current = !1),
              oe(f.current.stamina),
              I(!1),
              ra((Re) => {
                const Ce = Re.findIndex((na) => na.id === E.id);
                if (Ce === -1) return Re;
                const ze = Re[Ce],
                  la = {
                    id: `item_empty_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                    name: ge,
                    categoryType: "consumable",
                    isEquippable: !1,
                    rarity: "comum",
                    value: Math.max(25, (ze.value || 35) - 10),
                    stackCount: 1,
                    icon: re,
                    color: me,
                    description: ce,
                  };
                if (ze.stackCount && ze.stackCount > 1) {
                  const na = [...Re];
                  return (
                    (na[Ce] = { ...ze, stackCount: ze.stackCount - 1 }),
                    na.push(la),
                    na
                  );
                } else {
                  const na = [...Re];
                  return ((na[Ce] = la), na);
                }
              }));
            return;
          }
          if (
            D.includes("frasco") ||
            D.includes("jarra") ||
            D.includes("pote") ||
            D.includes("panela") ||
            D.includes("caldeirão") ||
            D.includes("caldeirao")
          ) {
            if (ma.current) {
              Ut(E);
              return;
            }
            (m.current.playChestChime(),
              ve(
                `🏺 ${E.name}: este recipiente está vazio. Aproxime-se da margem de uma lagoa, rio ou oásis e clique [Usar] (ou aperte U) para coletar água fresca!`,
              ));
            return;
          }
          if (D.includes("assado") || D.includes("espeto")) {
            m.current.playShrineActivation();
            const F = f.current.maxHp ?? 100,
              ie = f.current.maxStamina ?? 100;
            ((f.current.hp = Math.min(F, (f.current.hp ?? 0) + 70)),
              (f.current.stamina = Math.min(ie, (f.current.stamina ?? 0) + 90)),
              (f.current.isExhausted = !1),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              (oa.current = !1),
              Ee(f.current.hp),
              oe(f.current.stamina),
              I(!1));
          } else if (D.includes("tijolo"))
            m.current.playMiningStrike();
          else if (D.includes("lambari")) {
            m.current.playShrineActivation();
            const F = f.current.maxHp ?? 100,
              ie = f.current.maxStamina ?? 100;
            ((f.current.hp = Math.min(F, (f.current.hp ?? 0) + 15)),
              (f.current.stamina = Math.min(ie, (f.current.stamina ?? 0) + 25)),
              (f.current.isExhausted = !1),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              (oa.current = !1),
              Ee(f.current.hp),
              oe(f.current.stamina),
              I(!1));
          } else if (D.includes("tilápia") || D.includes("tilapia")) {
            m.current.playShrineActivation();
            const F = f.current.maxHp ?? 100,
              ie = f.current.maxStamina ?? 100;
            ((f.current.hp = Math.min(F, (f.current.hp ?? 0) + 35)),
              (f.current.stamina = Math.min(ie, (f.current.stamina ?? 0) + 45)),
              (f.current.isExhausted = !1),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              (oa.current = !1),
              Ee(f.current.hp),
              oe(f.current.stamina),
              I(!1));
          } else if (D.includes("truta")) {
            m.current.playShrineActivation();
            const F = f.current.maxHp ?? 100,
              ie = f.current.maxStamina ?? 100;
            ((f.current.hp = Math.min(F, (f.current.hp ?? 0) + 50)),
              (f.current.stamina = Math.min(ie, (f.current.stamina ?? 0) + 70)),
              (f.current.isExhausted = !1),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              (oa.current = !1),
              Ee(f.current.hp),
              oe(f.current.stamina),
              I(!1));
          } else if (D.includes("cascudo") || D.includes("peixe")) {
            m.current.playShrineActivation();
            const F = f.current.maxHp ?? 100,
              ie = f.current.maxStamina ?? 100;
            ((f.current.hp = Math.min(F, (f.current.hp ?? 0) + 25)),
              (f.current.stamina = Math.min(ie, (f.current.stamina ?? 0) + 35)),
              (f.current.isExhausted = !1),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              (oa.current = !1),
              Ee(f.current.hp),
              oe(f.current.stamina),
              I(!1));
          } else
            (m.current.playShrineActivation(),
              (f.current.stamina = f.current.maxStamina ?? 100),
              (f.current.isExhausted = !1),
              (He.current = f.current.stamina),
              (oa.current = !1),
              oe(f.current.stamina),
              I(!1));
          ra((F) => {
            const ie = F.findIndex((re) => re.id === E.id);
            if (ie === -1) return F;
            const ge = F[ie];
            if (ge.stackCount && ge.stackCount > 1) {
              const re = [...F];
              return ((re[ie] = { ...ge, stackCount: ge.stackCount - 1 }), re);
            } else return F.filter((re) => re.id !== E.id);
          });
        },
        [Ve, Ut, ve],
      ),
      Ur = J.useCallback(
        (E) => {
          if (!Da.current.cinto) {
            (m.current.playBowEmpty(),
              ve(
                "⚠️ Você precisa ter um Cinto equipado para usar a troca rápida!",
              ));
            return;
          }
          const Q = E === "cinto_slot2",
            q = Q ? "mao_direita" : "mao_esquerda",
            F = Da.current[q],
            ie = Da.current[E];
          if (!F && !ie) {
            ve(
              `O ${Q ? "Bolso Direito" : "Bolso Esquerdo"} e a ${Q ? "Mão Direita" : "Mão Esquerda"} estão vazios.`,
            );
            return;
          }
          let ge = null,
            re = null;
          if (ie) {
            const Ce = To(ie).category === "flask",
              ze = ie.stackCount || 1;
            Ce && ze > 1
              ? ((ge = { ...ie, stackCount: 1 }),
                (re = { ...ie, stackCount: ze - 1 }))
              : ((ge = ie), (re = null));
          }
          let me = re,
            ce = !1;
          if (F) {
            let Re = !1;
            if (re === null) {
              const Ce = To(F),
                ze = F.stackCount || 1;
              Ce.allowed && ze <= Ce.maxCapacity && (Re = !0);
            }
            if (Re)
              ((me = F),
                ((F.name || "").toLowerCase().includes("tocha") ||
                  (F.id || "").toLowerCase().includes("torch")) &&
                  $ &&
                  z(!1));
            else {
              ((ce = !0),
                ((F.name || "").toLowerCase().includes("tocha") ||
                  (F.id || "").toLowerCase().includes("torch")) &&
                  $ &&
                  z(!1));
              const ze = ot(Da.current.mochila);
              if (
                Zt.current.findIndex((Je) => Je.name === F.name) >= 0 ||
                Zt.current.length < ze
              )
                (ra((Je) => {
                  const he = Je.findIndex(($e) => $e.name === F.name);
                  if (he >= 0) {
                    const $e = [...Je];
                    return (
                      ($e[he] = {
                        ...$e[he],
                        stackCount:
                          ($e[he].stackCount || 1) + (F.stackCount || 1),
                      }),
                      $e
                    );
                  }
                  return [...Je, F];
                }),
                  ve(
                    `📦 "${F.name}" guardado no inventário (sem espaço no cinto).`,
                  ));
              else {
                const Je = f.current,
                  he = o.current;
                if (Je && he) {
                  let $e = 0,
                    da = 0;
                  Je.facing === "left"
                    ? ($e = -20)
                    : Je.facing === "right"
                      ? ($e = 20)
                      : Je.facing === "up"
                        ? (da = -20)
                        : (da = 20);
                  const Ye = Je.x + $e,
                    Ge = Je.y + da;
                  (c.current.dropItem(
                    F,
                    Ye,
                    Ge,
                    !!he.isUnderground,
                    F.stackCount || 1,
                  ),
                    m.current.playUnequipItem(),
                    ve(
                      `🗑️ Inventário e cinto sem espaço! "${F.name}" foi jogado no chão!`,
                    ));
                }
              }
            }
          }
          Wa((Re) => ({ ...Re, [q]: ge, [E]: me }));
          m.current.playEquipItem();
        },
        [$],
      ),
      Oo = J.useCallback(() => {
        ((Oa.current = { x: 0, y: 0 }),
          Et(!1));
      }, []),
      nr = J.useCallback(() => {
        if (!ma.current) {
          ve("⚠️ Você precisa estar na beira do lago ou rio para pescar!");
          return;
        }
        if (!ko.current) {
          ve(
            "⚠️ Você precisa de uma Lança para pescar! Crie uma na Bancada ou equipe uma lança.",
          );
          return;
        }
        (m.current.playCaveExit(),
          tr(!0),
          ve(
            `🎣 Câmera aproximada na água! Mire e arremesse sua ${ko.current.name} para fisgar peixes.`,
          ));
      }, [ve]),
      $r = J.useCallback(() => {
        tr(!1);
      }, []),
      yi = J.useCallback(
        (E) => {
          ra((D) => {
            const Q = ot(Da.current.mochila);
            return D.length >= Q
              ? (ve(`Mochila cheia (${D.length}/${Q})! ${E.name} escapou.`), D)
              : [...D, E];
          });
        },
        [ve],
      ),
      sr = J.useCallback(
        (E, D, Q) => {
          const q = o.current,
            F = f.current;
          if (!q || !F) return !1;
          const ie = {
            tx: E,
            ty: D,
            isUnderground: !!q.isUnderground,
            undergroundLevel: q.undergroundLevel !== undefined ? q.undergroundLevel : (q.isUnderground ? 1 : 0),
            activeDungeonStairCoords: q.activeDungeonStairCoords || null,
            x: F.x,
            y: F.y,
            savedAt: Date.now(),
            name: Q || "Fogueira Crepitante",
          };
          (Ie(ie), (ee.current = ie));
          const ge = q.exportSaveData(),
            re = {
              version: 1,
              slotId: activeSlotId,
              timestamp: Date.now(),
              checkpoint: ie,
              player: {
                hp: F.hp ?? 100,
                maxHp: F.maxHp ?? 100,
                stamina: F.stamina ?? 100,
                maxStamina: F.maxStamina ?? 100,
                name: F.name || "Aventureiro",
              },
              inventory: { backpack: Ve, equipment: Da.current, gold: ct },
              world: {
                seed: q.seed,
                timeOfDay: timeOfDayRef.current,
                nightCount: nightCountRef.current,
                interactedProps: ge.interactedProps,
                customPlacedProps: ge.customPlacedProps,
                collectedGroundItems: ge.collectedGroundItems,
                playerCabins: ge.playerCabins,
              },
            },
            me = saveGameState(re, activeSlotId);
          m.current.playShrineActivation();
          const ce = E * q.tileSize + q.tileSize / 2,
            Re = D * q.tileSize + q.tileSize / 2;
          c.current && typeof c.current.addDamageNumber === "function" &&
            c.current.addDamageNumber(ce, Re - 30, `💾 SALVO NO SLOT ${activeSlotId}!`, "#38bdf8");
          return me;
        },
        [Ve, ct, P, activeSlotId],
      );

    J.useEffect(() => {
      if (props && props.isNewGame) {
        if (typeof window.setActiveSaveSlot === "function") {
          window.setActiveSaveSlot(activeSlotId);
        }
        const spawn = o.current && o.current.findTemperateForestSpawn ? o.current.findTemperateForestSpawn() : { x: 0, y: 0, tx: 0, ty: 0, biome: BIOMES[BiomeId.FOREST] };
        f.current.x = spawn.x;
        f.current.y = spawn.y;
        S({ tx: spawn.tx, ty: spawn.ty });
        v(spawn.biome);
        ve(`✨ Bem-vindo à Floresta Temperada! Seed: #${initialSeed} (Slot ${activeSlotId})`);
        return;
      }
      const E = (typeof loadGameState === "function") ? loadGameState(activeSlotId) : null;
      if (E)
        try {
          (E.world &&
            (typeof E.world.seed == "number" &&
              (o.current.setSeed(E.world.seed), j(E.world.seed)),
            typeof E.world.timeOfDay == "number" && setTimeOfDaySync(E.world.timeOfDay),
            Number.isFinite(E.world.nightCount) && (nightCountRef.current = Math.max(0, Math.floor(E.world.nightCount))),
            o.current.importSaveData(E.world)),
            E.checkpoint &&
              (Ie(E.checkpoint),
              (ee.current = E.checkpoint),
              (o.current.isUnderground = !!E.checkpoint.isUnderground),
              (o.current.undergroundLevel = E.checkpoint.undergroundLevel !== undefined ? E.checkpoint.undergroundLevel : (E.checkpoint.isUnderground ? 1 : 0)),
              (o.current.activeDungeonStairCoords = E.checkpoint.activeDungeonStairCoords || null),
              (f.current.x = E.checkpoint.x),
              (f.current.y = E.checkpoint.y),
              S({
                tx: Math.floor(E.checkpoint.x / o.current.tileSize),
                ty: Math.floor(E.checkpoint.y / o.current.tileSize),
              })),
            E.player &&
              ((f.current.hp = E.player.hp ?? 100),
              (f.current.maxHp = E.player.maxHp ?? 100),
              (f.current.stamina = E.player.stamina ?? 100),
              (f.current.maxStamina = E.player.maxStamina ?? 100),
              (W.current = f.current.hp),
              (He.current = f.current.stamina),
              Ee(f.current.hp),
              ke(f.current.maxHp),
              oe(f.current.stamina),
              X(f.current.maxStamina)),
            E.inventory &&
              (E.inventory.backpack && ra(E.inventory.backpack),
              E.inventory.equipment && Wa(E.inventory.equipment),
              typeof E.inventory.gold == "number" && _t(E.inventory.gold)),
            ve(`💾 Jogo restaurado do Slot ${activeSlotId}!`));
        } catch (D) {
          console.warn("Erro ao carregar salve:", D);
        }
    }, [ve, activeSlotId]);
    const Tl = J.useCallback(() => {
      const E = f.current,
        D = o.current,
        Q = ee.current;
      if (Q) {
        D.isUnderground = !!Q.isUnderground;
        D.undergroundLevel = Q.undergroundLevel !== undefined ? Q.undergroundLevel : (Q.isUnderground ? 1 : 0);
        if (Q.activeDungeonStairCoords) D.activeDungeonStairCoords = Q.activeDungeonStairCoords;
        const q = Q.tx * D.tileSize + D.tileSize / 2,
          F = Q.ty * D.tileSize + D.tileSize / 2 + D.tileSize * 0.7;
        (c.current.respawnPlayer(E, q, F),
          c.current.scareMonstersNearFire(
            q,
            F,
            (D.isUnderground ? 225 : 190) * 0.6,
          ),
          ve("✨ Você renasceu junto à sua fogueira de salve protegida!"));
      } else {
        if (D.isUnderground) {
          const q = D.exitCave();
          c.current.respawnPlayer(E, q.x, q.y);
        } else {
          const spawn = D.findTemperateForestSpawn ? D.findTemperateForestSpawn() : { x: 0, y: 0 };
          c.current.respawnPlayer(E, spawn.x, spawn.y);
        }
        ve("✨ Você renasceu revigorado na Floresta Temperada!");
      }
      ((Oa.current = { x: 0, y: 0 }),
        Et(!1),
        (W.current = E.hp ?? 100),
        (le.current = !1),
        Ee(E.hp ?? 100),
        de(!1),
        (E.stamina = E.maxStamina ?? 100),
        (E.isExhausted = !1),
        (E.sprinting = !1),
        (E.paralyzedTimer = 0),
        (dodgeModeRef.current = !1),
        setDodgeMode(!1),
        (He.current = E.stamina),
        (oa.current = !1),
        (ga.current = !1),
        oe(E.stamina),
        I(!1),
        Me(!1));
    }, [ve]);
    J.useEffect(() => {
      m.current.setEnabled(x);
    }, [x]);
    const mo = J.useCallback(() => {
        const E = Math.floor(Math.random() * 9e5) + 1e4;
        (o.current.setSeed(E),
          c.current.reset(),
          clearGameState(),
          Ie(null),
          (ee.current = null),
          j(E));
        const spawn = o.current && o.current.findTemperateForestSpawn ? o.current.findTemperateForestSpawn() : { x: 0, y: 0, tx: 0, ty: 0, biome: BIOMES[BiomeId.FOREST] };
        (f.current.x = spawn.x),
        (f.current.y = spawn.y),
        S({ tx: spawn.tx, ty: spawn.ty }),
        v(spawn.biome),
        ve(`Novo mundo gerado! Seed: #${E} — Floresta Temperada`);
      }, [ve]),
      dt = J.useCallback(
        (E) => {
          const D = o.current;
          if (!D) return;
          const isSpecialTarget = (E === "DUNGEON_LOWER" || E === "SUBSOLO_HALL" || E === "DUNGEON_STAIR_TARGET");
          const Q = BIOMES[E] || (isSpecialTarget ? { namePt: "Calabouço / Escadaria", passable: true } : null);
          if (!Q) return;
          c.current.reset();
          const isCave = Q.category === "cave" || E.startsWith("CAVE_") || E.startsWith("DESERT_CAVE_");
          if (isCave && !D.isUnderground) {
            const ge = Math.floor(f.current.x / D.tileSize),
              re = Math.floor(f.current.y / D.tileSize);
            D.enterCave(ge, re, f.current.x, f.current.y);
            m.current.playCaveEnter();
          } else if (!isCave && !isSpecialTarget && D.isUnderground) {
            const ge = D.exitCave();
            f.current.x = ge.x;
            f.current.y = ge.y;
            m.current.playCaveExit();
          }
          // Se o alvo for um bioma de caverna natural (ex: CAVE_CRYSTAL, CAVE_MUSHROOM, CAVE_LAKE, CAVE_FLOOR, CAVE_WALL),
          // garante que o subsolo não esteja preso no modo deserto estrito
          if (isCave && !E.startsWith("DESERT_CAVE")) {
            D.activeCaveEntranceIsDesert = !1;
            D.undergroundLevel = 1;
            D.clearTileCache();
          }
          const isImpassable = !Q.passable;
          const originTx = Math.floor(f.current.x / D.tileSize);
          const originTy = Math.floor(f.current.y / D.tileSize);

          let found = !1,
            targetPixelX = 0,
            targetPixelY = 0,
            foundDist = 0;

          // Passos calibrados conforme o tamanho real do bioma no gerador procedural:
          // - Cavernas (CAVE_*): câmaras variam a cada 6~15 tiles
          // - Lagos / Oásis / Vulcão / Cânion / Pântano: manchas de 25~120 tiles
          // - Biomas continentais: manchas de 300~2500 tiles
          const isSmallFeatureBiome =
            E.endsWith("_LAKE") ||
            E === "OASIS" ||
            E === "VOLCANIC" ||
            E === "CANYON" ||
            E === "SWAMP" ||
            E === "BEACH" ||
            E === "COAST_WATER";
          const tiers = isCave
            ? [
                { minR: 0, maxR: 250, rStep: 4, arcStep: 5 },
                { minR: 250, maxR: 1200, rStep: 10, arcStep: 12 },
                { minR: 1200, maxR: 4000, rStep: 25, arcStep: 28 },
              ]
            : isSmallFeatureBiome
              ? [
                  { minR: 0, maxR: 1800, rStep: 24, arcStep: 28 },
                  { minR: 1800, maxR: 7500, rStep: 55, arcStep: 65 },
                  { minR: 7500, maxR: 28000, rStep: 120, arcStep: 140 },
                ]
              : [
                  { minR: 0, maxR: 2500, rStep: 45, arcStep: 55 },
                  { minR: 2500, maxR: 10000, rStep: 110, arcStep: 130 },
                  { minR: 10000, maxR: 32000, rStep: 240, arcStep: 260 },
                ];

          // Refina um tile encontrado (tx, ty) para o centro da mancha daquele bioma,
          // evitando pousar na borda exata onde 1 passo já trocaria de bioma!
          const refineBiomeCenter = (startTx, startTy, targetBiomeId) => {
            const checkMatch = (x, y) => {
              if (D.isUnderground) {
                const tb = D.getTile(x, y).biome;
                return !!(tb && tb.id === targetBiomeId);
              }
              const sb = D._computeSurfaceBaseBiome(x, y);
              return !!(sb && sb.id === targetBiomeId);
            };
            const maxSpan = isCave ? 18 : isSmallFeatureBiome ? 45 : 90;
            let minX = startTx,
              maxX = startTx,
              minY = startTy,
              maxY = startTy;
            while (startTx - minX < maxSpan && checkMatch(minX - 1, startTy)) minX--;
            while (maxX - startTx < maxSpan && checkMatch(maxX + 1, startTy)) maxX++;
            const midX = Math.round((minX + maxX) * 0.5);
            while (startTy - minY < maxSpan && checkMatch(midX, minY - 1)) minY--;
            while (maxY - startTy < maxSpan && checkMatch(midX, maxY + 1)) maxY++;
            const midY = Math.round((minY + maxY) * 0.5);
            if (checkMatch(midX, midY)) {
              return { tx: midX, ty: midY };
            }
            return { tx: startTx, ty: startTy };
          };

          if (E === "DUNGEON_LOWER") {
            let stair = null;
            if (D.getDungeonEntranceStairForBiome) {
              stair = D.getDungeonEntranceStairForBiome(originTx, originTy);
            }
            if (!stair) {
              for (let r = 0; r <= 35 && !stair; r++) {
                for (let dy = -r; dy <= r && !stair; dy++) {
                  for (let dx = -r; dx <= r && !stair; dx++) {
                    if (r > 0 && Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                    const sampleTx = originTx + dx * 24;
                    const sampleTy = originTy + dy * 24;
                    const candidate = D.getDungeonEntranceStairForBiome(sampleTx, sampleTy);
                    if (candidate) {
                      stair = candidate;
                      break;
                    }
                  }
                }
              }
            }
            if (!stair) stair = D.getDungeonEntranceStairForBiome(0, 0);
            if (stair) {
              if (!D.isUnderground) {
                const ge = Math.floor(f.current.x / D.tileSize),
                  re = Math.floor(f.current.y / D.tileSize);
                D.enterCave(ge, re, f.current.x, f.current.y);
              }
              D.enterDungeon(stair.tx, stair.ty, stair.tx * D.tileSize + 14, stair.ty * D.tileSize + 20);
              targetPixelX = stair.tx * D.tileSize + 14;
              targetPixelY = (stair.ty + 2) * D.tileSize + 14;
              foundDist = 0;
              found = !0;
              ve(`⚡ Teleportado diretamente para o Calabouço Inferior em [${stair.tx}, ${stair.ty}]!`);
            }
          }

          if (E === "SUBSOLO_HALL" || E === "DUNGEON_STAIR_TARGET") {
            let stair = null;
            if (D.getDungeonEntranceStairForBiome) {
              stair = D.getDungeonEntranceStairForBiome(originTx, originTy);
            }
            if (!stair) {
              for (let r = 0; r <= 35 && !stair; r++) {
                for (let dy = -r; dy <= r && !stair; dy++) {
                  for (let dx = -r; dx <= r && !stair; dx++) {
                    if (r > 0 && Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                    const sampleTx = originTx + dx * 24;
                    const sampleTy = originTy + dy * 24;
                    const candidate = D.getDungeonEntranceStairForBiome(sampleTx, sampleTy);
                    if (candidate) {
                      stair = candidate;
                      break;
                    }
                  }
                }
              }
            }
            if (!stair) stair = D.getDungeonEntranceStairForBiome(0, 0);
            if (stair) {
              if (!D.isUnderground) {
                const ge = Math.floor(f.current.x / D.tileSize),
                  re = Math.floor(f.current.y / D.tileSize);
                D.enterCave(ge, re, f.current.x, f.current.y);
              }
              if (E === "SUBSOLO_HALL") {
                D.isUnderground = !0;
                D.undergroundLevel = 1;
              } else if (D.undergroundLevel !== 2) {
                D.isUnderground = !0;
                D.undergroundLevel = 1;
              }
              D.clearTileCache();
              targetPixelX = stair.tx * D.tileSize + 14;
              targetPixelY = (stair.ty + 2) * D.tileSize + 14;
              foundDist = 0;
              found = !0;
              ve(D.undergroundLevel === 2
                ? `🧭 Teleportado diretamente para a Escadaria de Retorno ao Subsolo em [${stair.tx}, ${stair.ty}]!`
                : `🧭 Teleportado diretamente para a Escadaria do Calabouço em [${stair.tx}, ${stair.ty}]!`);
            }
          }

          if (E === "SNOW_PEAK" && !D.isUnderground) {
            // Ao teleportar para Picos Glaciais (SNOW_PEAK), leva diretamente para a Praça da Cidade dos Picos Gelados (em frente à grande fogueira/monumento, área livre e desobstruída)!
            const snowCity = typeof window !== "undefined" && window.SnowPeakCity;
            const targetTx = snowCity ? snowCity.centerX : -380;
            const targetTy = (snowCity ? snowCity.centerY : -1220) + 3;
            targetPixelX = targetTx * D.tileSize + D.tileSize / 2;
            targetPixelY = targetTy * D.tileSize + D.tileSize / 2;
            foundDist = Math.round(Math.hypot(targetTx - originTx, targetTy - originTy));
            found = !0;
          }

          if (E === "DESERT" && !D.isUnderground) {
            // Ao teleportar para o Deserto Dourado (DESERT), leva diretamente para o Povoado das Areias Douradas!
            const desertCity = typeof window !== "undefined" && window.DesertCity;
            const targetTx = desertCity ? desertCity.centerX : 520;
            const targetTy = desertCity ? desertCity.centerY : 360;
            targetPixelX = targetTx * D.tileSize + D.tileSize / 2;
            targetPixelY = targetTy * D.tileSize + D.tileSize / 2;
            foundDist = Math.round(Math.hypot(targetTx - originTx, targetTy - originTy));
            found = !0;
          }

          if ((E === "BEACH" || E === "PORT_CITY") && !D.isUnderground) {
            // Ao teleportar para Praia Tropical (BEACH) ou Cidade Portuária, leva diretamente para o Calçadão Costeiro entre a Praia, os Píeres e o Oceano!
            const portCity = typeof window !== "undefined" && window.PortCity;
            const targetTx = portCity ? portCity.centerX : -680;
            const targetTy = portCity ? portCity.centerY : 620;
            targetPixelX = targetTx * D.tileSize + D.tileSize / 2;
            targetPixelY = targetTy * D.tileSize + D.tileSize / 2;
            foundDist = Math.round(Math.hypot(targetTx - originTx, targetTy - originTy));
            found = !0;
          }

          if (E === "DESERT_GEODE") {
            let fissure = D.getDesertGeodeFissure ? D.getDesertGeodeFissure() : null;
            if (fissure) {
              if (!D.isUnderground) {
                D.enterCave(fissure.tx, fissure.ty + 2, fissure.tx * D.tileSize + 18, (fissure.ty + 2) * D.tileSize + 18);
              }
              D.enterGeode(fissure.tx, fissure.ty, fissure.tx * D.tileSize + 18, (fissure.ty + 2) * D.tileSize + 18);
              targetPixelX = fissure.tx * D.tileSize + D.tileSize / 2;
              targetPixelY = (fissure.ty - 2) * D.tileSize + D.tileSize / 2;
              foundDist = Math.round(Math.hypot(fissure.tx - originTx, fissure.ty - originTy));
              found = !0;
              ve(`💎 Teleportado diretamente para dentro do Geodo de Cristais em [${fissure.tx}, ${fissure.ty - 2}]!`);
            }
          }

          if (E === "DESERT_CAVE" || E === "DESERT_CAVE_FLOOR" || E === "DESERT_CAVE_WALL") {
            const fissure = D.getDesertGeodeFissure ? D.getDesertGeodeFissure() : null;
            if (E === "DESERT_CAVE_WALL" && fissure) {
              D.enterCave(fissure.tx, fissure.ty + 2, fissure.tx * D.tileSize + 18, (fissure.ty + 2) * D.tileSize + 18);
              targetPixelX = fissure.tx * D.tileSize + D.tileSize / 2;
              targetPixelY = (fissure.ty + 2) * D.tileSize + D.tileSize / 2;
              foundDist = Math.round(Math.hypot(fissure.tx - originTx, fissure.ty - originTy));
              found = !0;
              ve(`💎 Teleportado para o Paredão do Deserto com a Fenda do Geodo em [${fissure.tx}, ${fissure.ty}]!`);
            } else {
              // Encontra a caverna do deserto mais próxima e desce o jogador diretamente nos túneis estreitos!
              let targetCave = null;
              for (let r = 1; r <= 35 && !targetCave; r++) {
                for (let dy = -r; dy <= r && !targetCave; dy++) {
                  for (let dx = -r; dx <= r && !targetCave; dx++) {
                    if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                    // centro da busca = Povoado do Deserto (posicao dinamica por seed; 520,360 era o ponto fixo antigo)
                    const tx = (window.DesertCity ? window.DesertCity.centerX : 520) + dx * 14,
                      ty = (window.DesertCity ? window.DesertCity.centerY : 360) + dy * 14;
                    const b = D._computeSurfaceBaseBiome(tx, ty);
                    if (b && (b.id === BiomeId.DESERT || b.id === BiomeId.CANYON)) {
                      for (let sy = -8; sy <= 8 && !targetCave; sy++) {
                        for (let sx = -8; sx <= 8 && !targetCave; sx++) {
                          const cand = D.getCaveEntranceAt(tx + sx, ty + sy);
                          if (cand && (cand.isDesertCave || b.id === BiomeId.DESERT)) {
                            targetCave = cand;
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (targetCave) {
                D.enterCave(targetCave.tx, targetCave.ty, targetCave.tx * D.tileSize + 14, targetCave.ty * D.tileSize + 14);
                targetPixelX = targetCave.tx * D.tileSize + 14;
                targetPixelY = (targetCave.ty + 2) * D.tileSize + 14;
                foundDist = Math.round(Math.hypot(targetCave.tx - originTx, targetCave.ty - originTy));
                found = !0;
                ve(`🦂 Teleportado para os túneis estreitos da Caverna do Deserto em [${targetCave.tx}, ${targetCave.ty}]! (Fenda do Geodo em [${fissure ? fissure.tx : "?"}, ${fissure ? fissure.ty : "?"}])`);
              }
            }
          }

          if (E === "MEADOW" && !D.isUnderground) {
            // Ao teleportar para Planície Florida (MEADOW), tenta levar para a Cidade Grega se houver uma próxima
            for (let r = 1; r <= 8 && !found; r++) {
              for (let dy = -r; dy <= r && !found; dy++) {
                for (let dx = -r; dx <= r && !found; dx++) {
                  if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                  const sampleTx = dx * 48,
                    sampleTy = dy * 48;
                  if (!D._isMeadowCityBiomeAt(sampleTx, sampleTy)) continue;
                  const city = D._getMeadowCityDistrict && D._getMeadowCityDistrict(sampleTx, sampleTy);
                  if (city && city.buildings && city.buildings.length > 0) {
                    const mainHall = city.buildings[0],
                      entranceTx = mainHall.cx,
                      entranceTy = mainHall.cy + mainHall.halfH + 2;
                    targetPixelX = entranceTx * D.tileSize + D.tileSize / 2;
                    targetPixelY = entranceTy * D.tileSize + D.tileSize / 2;
                    foundDist = Math.round(Math.hypot(entranceTx - originTx, entranceTy - originTy));
                    found = !0;
                    break;
                  }
                }
              }
            }
          }

          // Para biomas de caverna natural (CAVE_FLOOR, CAVE_CRYSTAL, CAVE_MUSHROOM, CAVE_LAKE, CAVE_WALL),
          // se a posição atual estiver debaixo de Planície (Santuário Grego) ou Quartel Glacial,
          // desloca a origem de busca para uma região fora de MEADOW para achar cavernas naturais imediatamente!
          let searchOriginTx = originTx;
          let searchOriginTy = originTy;
          if (isCave && !E.startsWith("DESERT_CAVE")) {
            const surfAtOrigin = D._computeSurfaceBaseBiome(searchOriginTx, searchOriginTy);
            if (surfAtOrigin && (surfAtOrigin.id === BiomeId.MEADOW || surfAtOrigin.id === BiomeId.MEADOW_LAKE || surfAtOrigin.id === BiomeId.DESERT || surfAtOrigin.id === BiomeId.CANYON)) {
              for (let sr = 1; sr <= 40; sr++) {
                let shifted = !1;
                for (let i = 0; i < 16; i++) {
                  const ang = (i / 16) * Math.PI * 2;
                  const candX = Math.round(originTx + Math.cos(ang) * sr * 35);
                  const candY = Math.round(originTy + Math.sin(ang) * sr * 35);
                  const sb = D._computeSurfaceBaseBiome(candX, candY);
                  if (sb && sb.id !== BiomeId.MEADOW && sb.id !== BiomeId.MEADOW_LAKE && sb.id !== BiomeId.DESERT && sb.id !== BiomeId.CANYON && !sb.hasWater) {
                    searchOriginTx = candX;
                    searchOriginTy = candY;
                    shifted = !0;
                    break;
                  }
                }
                if (shifted) break;
              }
            }
          }

          for (const tier of tiers) {
            if (found) break;
            for (let r = tier.minR; r <= tier.maxR; r += tier.rStep) {
              if (r === 0) {
                const b0 = D.isUnderground ? D.getTile(searchOriginTx, searchOriginTy).biome : D._computeSurfaceBaseBiome(searchOriginTx, searchOriginTy);
                if (b0 && b0.id === E && (isImpassable || b0.passable)) {
                  const centered = refineBiomeCenter(searchOriginTx, searchOriginTy, E);
                  const landingTile = D.getTile(centered.tx, centered.ty);
                  if (isImpassable || (landingTile.biome.passable && !landingTile.isCliffWall && D.isTilePassable(centered.tx, centered.ty))) {
                    targetPixelX = centered.tx * D.tileSize + D.tileSize / 2;
                    targetPixelY = centered.ty * D.tileSize + D.tileSize / 2;
                    foundDist = Math.round(Math.hypot(centered.tx - originTx, centered.ty - originTy));
                    found = !0;
                    break;
                  }
                }
                continue;
              }
              const steps = Math.max(16, Math.floor((2 * Math.PI * r) / tier.arcStep));
              for (let i = 0; i < steps; i++) {
                const angle = (i / steps) * 2 * Math.PI;
                const me = Math.round(searchOriginTx + Math.cos(angle) * r);
                const ce = Math.round(searchOriginTy + Math.sin(angle) * r);
                const b = D.isUnderground ? D.getTile(me, ce).biome : D._computeSurfaceBaseBiome(me, ce);
                if (b && b.id === E) {
                  if (E === "CAVE_WALL" || E === "DESERT_CAVE_WALL") {
                    let foundFloor = !1;
                    for (let sr = 1; sr <= 4 && !foundFloor; sr++) {
                      for (let dx = -sr; dx <= sr && !foundFloor; dx++) {
                        for (let dy = -sr; dy <= sr && !foundFloor; dy++) {
                          const adj = D.getTile(me + dx, ce + dy);
                          if (adj && adj.biome && adj.biome.passable && D.isTilePassable(me + dx, ce + dy)) {
                            targetPixelX = (me + dx) * D.tileSize + D.tileSize / 2;
                            targetPixelY = (ce + dy) * D.tileSize + D.tileSize / 2;
                            foundFloor = !0;
                          }
                        }
                      }
                    }
                    if (!foundFloor) continue;
                    foundDist = Math.round(Math.hypot(me - originTx, ce - originTy));
                    found = !0;
                    break;
                  }
                  // Centraliza na mancha do bioma para não pousar na borda!
                  const centered = refineBiomeCenter(me, ce, E);
                  let landingTx = centered.tx,
                    landingTy = centered.ty,
                    landedSafe = !1;
                  for (let sr = 0; sr <= 6 && !landedSafe; sr++) {
                    for (let dy = -sr; dy <= sr && !landedSafe; dy++) {
                      for (let dx = -sr; dx <= sr && !landedSafe; dx++) {
                        if (sr > 0 && Math.abs(dx) !== sr && Math.abs(dy) !== sr) continue;
                        const candX = centered.tx + dx,
                          candY = centered.ty + dy;
                        const candTile = D.getTile(candX, candY);
                        if (candTile && candTile.biome && candTile.biome.id === E) {
                          if (
                            isImpassable ||
                            (candTile.biome.passable &&
                              !candTile.isCliffWall &&
                              D.isTilePassable(candX, candY) &&
                              !D.isTrunkAt(candX * D.tileSize + D.tileSize / 2, candY * D.tileSize + D.tileSize / 2) &&
                              !D.getNearbyCaveDoorwayAt(candX * D.tileSize + D.tileSize / 2, candY * D.tileSize + D.tileSize / 2))
                          ) {
                            landingTx = candX;
                            landingTy = candY;
                            landedSafe = !0;
                          }
                        }
                      }
                    }
                  }
                  if (!landedSafe && !isImpassable) continue;
                  targetPixelX = landingTx * D.tileSize + D.tileSize / 2;
                  targetPixelY = landingTy * D.tileSize + D.tileSize / 2;
                  foundDist = Math.round(Math.hypot(landingTx - originTx, landingTy - originTy));
                  found = !0;
                  break;
                }
              }
              if (found) break;
            }
            if (found) break;
          }

          if (found) {
            __autoCaveTimer.current = 1.2;
            f.current.x = targetPixelX;
            f.current.y = targetPixelY;
            f.current.vx = 0;
            f.current.vy = 0;
            Oa.current = { x: 0, y: 0 };
            Et(!1);
            D.clearTileCache();
            const finalTx = Math.floor(targetPixelX / D.tileSize),
              finalTy = Math.floor(targetPixelY / D.tileSize),
              finalTile = D.getTile(finalTx, finalTy);
            if (finalTile && finalTile.biome) {
              Be.current = finalTile.biome.id;
              v(finalTile.biome);
            }
            je.current = { tx: finalTx, ty: finalTy };
            S({ tx: finalTx, ty: finalTy });
            // Remove o foco de qualquer <select> ou <button> para que pressionar WASD ou Setas não troque o bioma sozinho!
            if (typeof document !== "undefined" && document.activeElement && typeof document.activeElement.blur === "function") {
              document.activeElement.blur();
            }
            if (!isSpecialTarget) {
              ve(`Teletransportado para ${Q.namePt} (${foundDist} blocos de distância)!`);
            }
            m.current.playShrineActivation();
          } else {
            ve(isSpecialTarget ? "Escadaria do calabouço não localizada nas proximidades." : `Nenhum ${Q.namePt} localizado nas proximidades.`);
          }
        },
        [ve],
      ),
      ut = J.useCallback(
        (E, D) => {
          const Q = o.current;
          if (Q.isGroundItemCollected(E, D)) return !1;
          const q = Hs(E, D, Q);
          if (!q) return !1;
          const F = ot(Da.current.mochila);
          if (
            Zt.current.findIndex((re) => re.name === q.name) < 0 &&
            Zt.current.length >= F
          )
            return (
              ve(`Inventário de itens cheio (máximo de ${F} slots)!`),
              !1
            );
          Q.collectGroundItem(E, D);
          const ge = og(q, E, D);
          return (
            m.current.playItemPickup(),
            ra((re) => {
              const me = re.findIndex((ce) => ce.name === ge.name);
              if (me >= 0) {
                const ce = [...re];
                return (
                  (ce[me] = {
                    ...ce[me],
                    stackCount: (ce[me].stackCount || 1) + 1,
                  }),
                  ce
                );
              }
              return re.length >= F
                ? (ve(`Inventário de itens cheio (máximo de ${F} slots)!`), re)
                : [...re, ge];
            }),
            !0
          );
        },
        [ve],
      ),
      cr = J.useRef(ut);
    J.useEffect(() => {
      cr.current = ut;
    }, [ut]);
    const cancelPebbleAim = J.useCallback(() => {
      const E = f.current;
      if (E) {
        E.isAiming = !1;
        E.aimAngle = void 0;
        E.aimDistance = void 0;
      }
      pebbleKeyRef.current = { pressedAt: 0, aiming: !1, angle: void 0, distance: void 0, cancelled: !0 };
    }, []);
    const Rl = J.useCallback((aimAngle, aimDistance) => {
        const E = f.current;
        if (E.isDead || (E.paralyzedTimer && E.paralyzedTimer > 0)) return;
        const D = c.current;
        const Q = o.current;
        const equipment = Da.current;
        const isPebble = (item) => {
          const name = (item?.name || "").toLowerCase();
          const id = (item?.id || "").toLowerCase();
          return name.includes("seixo") || id.includes("seixo") || id.includes("pebble");
        };
        const isSlingshot = (item) => {
          if (!item) return !1;
          const nm = (item.name || "").toLowerCase(),
            idv = (item.id || "").toLowerCase();
          return nm.includes("estilingue") || idv.includes("estilingue") || idv.includes("slingshot");
        };
        // 🎯 ESTILINGUE: equipado em qualquer das mãos equivale a estar pronto para atirar
        // e pode disparar seixos que estiverem na mão OU diretamente no inventário/mochila!
        const hasSlingshot = isSlingshot(equipment.mao_esquerda) || isSlingshot(equipment.mao_direita);
        const hand = isPebble(equipment.mao_direita)
          ? "mao_direita"
          : isPebble(equipment.mao_esquerda)
            ? "mao_esquerda"
            : null;
        const backpackPebbleIdx = Zt.current.findIndex(isPebble);
        if (!hand && !(hasSlingshot && backpackPebbleIdx >= 0)) {
          if (hasSlingshot) {
            ve("⚠️ Você está com o Estilingue equipado, mas não tem nenhum Seixo no inventário para disparar!");
          } else {
            ve("⚠️ Equipe um Seixo ou um Estilingue (com Seixos no inventário) para disparar.");
          }
          return;
        }
        const maxRange = hasSlingshot ? 660 : 330;
        const nearest = D.findNearestMonster(E.x, E.y, hasSlingshot ? 660 : 450, Q.isUnderground);
        const isAutoAim = aimAngle === void 0;
        let angle = aimAngle;
        let throwDist = aimDistance;
        if (isAutoAim) {
          if (nearest) {
            angle = Math.atan2(nearest.monster.y - E.y, nearest.monster.x - E.x);
            throwDist = Math.max(25, Math.min(maxRange, nearest.distance));
          } else {
            const moveX = (g.current.KeyD || g.current.ArrowRight || y.current.right ? 1 : 0) - (g.current.KeyA || g.current.ArrowLeft || y.current.left ? 1 : 0);
            const moveY = (g.current.KeyS || g.current.ArrowDown || y.current.down ? 1 : 0) - (g.current.KeyW || g.current.ArrowUp || y.current.up ? 1 : 0);
            angle = moveX || moveY ? Math.atan2(moveY, moveX) : ({ right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[E.direction] || 0);
            throwDist = maxRange;
          }
        } else {
          if (angle === void 0) {
            angle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[E.direction] || 0;
          }
          if (throwDist === void 0) {
            throwDist = maxRange;
          }
        }
        const stats = Ks(equipment);
        throwDist = Math.max(25, Math.min(maxRange, throwDist));
        const snapshotPoint = (isAutoAim && nearest)
          ? { x: nearest.monster.x, y: nearest.monster.y }
          : { x: E.x + Math.cos(angle) * throwDist, y: E.y + Math.sin(angle) * throwDist };
        const pebbleDamage = Math.max(1, stats.attack - 2) * (hasSlingshot ? 1.5 : 1);
        D.queuePebbleProjectile(E, angle, pebbleDamage, Q.isUnderground, throwDist, snapshotPoint);
        E.direction = angle > Math.PI * 0.25 && angle < Math.PI * 0.75 ? "down" : angle < -Math.PI * 0.25 && angle > -Math.PI * 0.75 ? "up" : angle >= 0 ? "right" : "left";
        E.attackTimer = 0.32;
        E.attackDuration = 0.32;
        E.attackType = "throw";
        E.attackAngle = angle;
        E.isAiming = !1;
        E.aimAngle = void 0;
        E.aimDistance = void 0;
        m.current.playPunchWhoosh();
        // Se tinha seixo equipado na mão, consome da mão (e repõe da mochila se houver);
        // se estava apenas com o Estilingue na mão, consome 1 seixo diretamente da mochila/inventário!
        if (hand) {
          Wa((previous) => {
            const current = previous[hand];
            if (!current) return previous;
            const count = current.stackCount || 1;
            if (count > 1) return { ...previous, [hand]: { ...current, stackCount: count - 1 } };
            const replacementIndex = Zt.current.findIndex(isPebble);
            if (replacementIndex >= 0) {
              const replacement = Zt.current[replacementIndex];
              ra((backpack) => {
                const next = [...backpack];
                const item = next[replacementIndex];
                const count = item.stackCount || 1;
                if (count > 1) next[replacementIndex] = { ...item, stackCount: count - 1 };
                else next.splice(replacementIndex, 1);
                return next;
              });
              return { ...previous, [hand]: { ...replacement, stackCount: 1 } };
            }
            return { ...previous, [hand]: null };
          });
        } else {
          ra((backpack) => {
            const idx = backpack.findIndex(isPebble);
            if (idx < 0) return backpack;
            const next = [...backpack];
            const item = next[idx];
            const count = item.stackCount || 1;
            if (count > 1) next[idx] = { ...item, stackCount: count - 1 };
            else next.splice(idx, 1);
            return next;
          });
        }
      }, [ve]);
    const startPebbleAim = J.useCallback((customAngle, customDist) => {
      const E = f.current;
      if (E && E.paralyzedTimer && E.paralyzedTimer > 0) return;
      pebbleKeyRef.current = { pressedAt: performance.now(), aiming: !0, angle: customAngle, distance: customDist, cancelled: !1 };
      if (E) {
        E.isAiming = !0;
        if (customAngle !== void 0) E.aimAngle = customAngle;
        if (customDist !== void 0) E.aimDistance = customDist;
      }
    }, []);
    const endPebbleAim = J.useCallback((customAngle, customDist) => {
      if (pebbleKeyRef.current.cancelled || pebbleKeyRef.current.pressedAt === 0) {
        cancelPebbleAim();
        return;
      }
      const E = f.current;
      const angle = customAngle !== void 0 ? customAngle : (pebbleKeyRef.current.angle !== void 0 ? pebbleKeyRef.current.angle : E.aimAngle);
      const dist = customDist !== void 0 ? customDist : (pebbleKeyRef.current.distance !== void 0 ? pebbleKeyRef.current.distance : E.aimDistance);
      cancelPebbleAim();
      Rl(angle, dist);
    }, [Rl, cancelPebbleAim]);
    const updatePebbleAim = J.useCallback((angle, distance) => {
      if (pebbleKeyRef.current.pressedAt && !pebbleKeyRef.current.cancelled) {
        pebbleKeyRef.current.angle = angle;
        if (distance !== void 0) {
          pebbleKeyRef.current.distance = distance;
          if (f.current) f.current.aimDistance = distance;
        }
        if (angle !== void 0 && f.current) {
          f.current.aimAngle = angle;
          f.current.isAiming = !0;
        }
      }
    }, []);
    const Sl = J.useCallback(() => {
        var ia, Je, he, $e, da, Ye;
        const E = f.current;
        if (E.isDead || (E.paralyzedTimer && E.paralyzedTimer > 0)) return;
        // Se estiver mirando com o seixo, desiste de jogar o seixo ao lutar no botão normal!
        if (E.isAiming || pebbleKeyRef.current.pressedAt || g.current.ShiftLeft || g.current.ShiftRight || g.current.Shift) {
          cancelPebbleAim();
        }
        const D = c.current,
          Q = o.current,
          q = Da.current,
          F = Ks(q),
          isRangedOnlyItem = (it) => {
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
          ie = !!(
            (q.mao_direita && !isRangedOnlyItem(q.mao_direita)) ||
            ((ia = q.mao_esquerda) != null && ia.id.includes("sword")) ||
            ((Je = q.mao_esquerda) != null &&
              Je.name.toLowerCase().includes("espada")) ||
            vl
          ),
          ge = !!(
            (
              ((he = q.mao_direita) == null ? void 0 : he.name) ||
              (($e = q.mao_direita) == null ? void 0 : $e.id) ||
              ""
            )
              .toLowerCase()
              .match(/lança|lanca|spear/) ||
            (
              ((da = q.mao_esquerda) == null ? void 0 : da.name) ||
              ((Ye = q.mao_esquerda) == null ? void 0 : Ye.id) ||
              ""
            )
              .toLowerCase()
              .match(/lança|lanca|spear/)
          ),
          whip = isWhipItemX(q.mao_direita) || isWhipItemX(q.mao_esquerda),
          whipReach = 76,
          {
            reach: re,
            hitRadius: me,
            maxRange: ce,
          } = D.getAttackReachAndRadius(ie, ge),
          Re = whip ? whipReach + 24 : ge ? Math.max(ce * 2, 85) : ce * 1.5;
        let Ce;
        const ze = D.findNearestMonster(E.x, E.y, Re, Q.isUnderground);
        if (ze) {
          const { monster: Ge, distance: Pe } = ze,
            aa = Ge.x - E.x,
            Ke = Ge.y - E.y;
          Ce = Math.atan2(Ke, aa);
          let De;
          if (
            (Math.abs(aa) > Math.abs(Ke)
              ? (De = aa > 0 ? "right" : "left")
              : (De = Ke > 0 ? "down" : "up"),
            (E.direction = De),
            !(whip ? Pe <= whipReach : D.isTargetInAttackRange(E.x, E.y, De, Ge.x, Ge.y, ie, ge, Ce)))
          ) {
            let Ze = E.x,
              sa = E.y;
            ge && Ce !== void 0
              ? ((Ze += Math.cos(Ce) * re), (sa += Math.sin(Ce) * re))
              : De === "up"
                ? (sa -= re)
                : De === "down"
                  ? (sa += re)
                  : De === "left"
                    ? (Ze -= re)
                    : (Ze += re);
            const Pa = Math.hypot(Ge.x - Ze, Ge.y - sa),
              va = Math.max(1, Pa - me),
              Nt = va <= 9 ? 1 : 2,
              rt = Nt === 1 ? Math.min(va + 4, 10) : Math.min(va + 4, 18),
              ka = aa / (Pe || 1),
              ht = Ke / (Pe || 1),
              ho = E.x + ka * rt,
              Jt = E.y + ht * rt,
              eo = Math.floor(ho / Q.tileSize),
              Rt = Math.floor(Jt / Q.tileSize);
            (Q.isTilePassable(eo, Rt)
              ? ((E.x = ho), (E.y = Jt))
              : Q.isTilePassable(eo, Math.floor(E.y / Q.tileSize))
                ? (E.x = ho)
                : Q.isTilePassable(Math.floor(E.x / Q.tileSize), Rt) &&
                  (E.y = Jt),
              (E.walkCycle += Nt === 1 ? 0.35 : 0.7));
            const ft = Math.floor(E.x / Q.tileSize),
              qa = Math.floor(E.y / Q.tileSize),
              Xa = Q.getTile(ft, qa);
            m.current.playFootstep(Xa.biome.hasWater);
            const za = Ge.x - E.x,
              It = Ge.y - E.y;
            ((Ce = Math.atan2(It, za)),
              Math.abs(za) > Math.abs(It)
                ? (E.direction = za > 0 ? "right" : "left")
                : (E.direction = It > 0 ? "down" : "up"));
          }
        } else if (ge || whip) {
          const Ge = g.current,
            Pe = y.current,
            aa = !!(Ge.KeyW || Ge.ArrowUp || Pe.up),
            Ke = !!(Ge.KeyS || Ge.ArrowDown || Pe.down),
            De = !!(Ge.KeyA || Ge.ArrowLeft || Pe.left),
            Ze =
              (!!(Ge.KeyD || Ge.ArrowRight || Pe.right) ? 1 : 0) - (De ? 1 : 0),
            sa = (Ke ? 1 : 0) - (aa ? 1 : 0);
          Ze !== 0 || sa !== 0
            ? (Ce = Math.atan2(sa, Ze))
            : (Ce =
                E.direction === "right"
                  ? 0
                  : E.direction === "left"
                    ? Math.PI
                    : E.direction === "up"
                      ? -Math.PI / 2
                      : Math.PI / 2);
        }
        const la = whip ? 0.4 : ge ? 0.24 : 0.28;
        ((E.attackTimer = la),
          (E.attackDuration = la),
          (E.attackCombo = ((E.attackCombo || 0) + 1) % 2),
          (E.attackType = ie ? "weapon" : "punch"),
          (E.attackAngle = Ce));
        const na = D.performAttack(E, F.attack, ie, Q.isUnderground, ge || whip, Ce, whip ? whipReach : void 0, void 0, whip);
        na.hitCount > 0
          ? (ge
              ? m.current.playSpearHit()
              : ie
                ? (whip && m.current.playWhipCrack(), m.current.playHitImpact())
                : m.current.playPunchImpact(),
            na.defeatedCount > 0 && m.current.playMonsterDefeated())
          : ge
            ? m.current.playSpearThrust()
            : whip
              ? m.current.playWhipCrack()
              : ie
                ? m.current.playSwordSlash()
                : m.current.playPunchWhoosh();
        const hasAxeInHands = !!(
          (Oe.mao_direita &&
            ((Oe.mao_direita.id || "").toLowerCase().includes("machado") ||
              (Oe.mao_direita.name || "").toLowerCase().includes("machado") ||
              (Oe.mao_direita.id || "").toLowerCase().includes("axe"))) ||
          (Oe.mao_esquerda &&
            ((Oe.mao_esquerda.id || "").toLowerCase().includes("machado") ||
              (Oe.mao_esquerda.name || "").toLowerCase().includes("machado") ||
              (Oe.mao_esquerda.id || "").toLowerCase().includes("axe")))
        );
        if (hasAxeInHands && !Q.isUnderground) {
          const chopReach = 28;
          const hitX = E.x + Math.cos(Ce) * chopReach;
          const hitY = E.y + Math.sin(Ce) * chopReach;
          const hitTx = Math.floor(hitX / Q.tileSize);
          const hitTy = Math.floor(hitY / Q.tileSize);
          const chopRes = Q.chopTreeAt && Q.chopTreeAt(hitTx, hitTy, true);
          if (chopRes) {
            const treeCenterX = (chopRes.tx * Q.tileSize) + (Q.tileSize / 2) + (chopRes.offsetX || 0);
            const treeCenterY = (chopRes.ty * Q.tileSize) + (Q.tileSize / 2) + (chopRes.offsetY || 0);
            const hitDir = E.x < treeCenterX ? 1 : -1;
            if (chopRes.action === "chop_tree_hit") {
              m.current.playWoodChop && m.current.playWoodChop();
              window.shakeTree && window.shakeTree(chopRes.tx, chopRes.ty, hitDir, 7.0);
              window.__spawnWoodChips && window.__spawnWoodChips(treeCenterX, treeCenterY, 10);
              window.__spawnLeavesBurst && window.__spawnLeavesBurst(treeCenterX, treeCenterY - 14, 6);
              ve(chopRes.message);
            } else if (chopRes.action === "chop_tree_fell") {
              m.current.playWoodChop && m.current.playWoodChop();
              m.current.playTreeFall && m.current.playTreeFall();
              window.startFallingTree && window.startFallingTree({
                tx: chopRes.tx,
                ty: chopRes.ty,
                x: treeCenterX,
                y: treeCenterY,
                kind: chopRes.treeKind || "tree_oak",
                subType: chopRes.treeSubType || 0,
                scale: chopRes.treeScale || 1,
                biomeId: chopRes.biomeId,
                dir: hitDir,
              });
              window.__spawnWoodChips && window.__spawnWoodChips(treeCenterX, treeCenterY, 14);
              window.__spawnLeavesBurst && window.__spawnLeavesBurst(treeCenterX, treeCenterY - 16, 12);
              const woodLogsCount = chopRes.woodLogs || 2;
              const sticksCount = chopRes.sticks || 1;
              ra((prev) => {
                const maxSlots = ot(Da.current.mochila);
                const nextInv = [...prev];
                for (let i = 0; i < woodLogsCount; i++) {
                  if (nextInv.length < maxSlots) {
                    nextInv.push(pi("wood_log"));
                  }
                }
                for (let i = 0; i < sticksCount; i++) {
                  if (nextInv.length < maxSlots) {
                    nextInv.push({
                      id: `item_galho_${Date.now()}_${i}`,
                      name: "Galho de Madeira",
                      difficulty: "facil",
                      rarity: "comum",
                      description: "Galho rígido de madeira colhido sob as copas das árvores.",
                      categoryType: "equipment",
                      slot: "mao_direita",
                      isEquippable: true,
                      stats: { attack: 5 },
                      icon: "🪵",
                      color: "#a16207",
                      value: 2,
                      stackCount: 1,
                    });
                  }
                }
                if (chopRes.resin && nextInv.length < maxSlots) {
                  nextInv.push({
                    id: `item_resina_${Date.now()}`,
                    name: "Resina de Pinheiro",
                    difficulty: "media",
                    rarity: "incomum",
                    description: "Resina pegajosa e combustível exsudada de pinheiros. Excelente para tochas.",
                    categoryType: "material",
                    isEquippable: false,
                    icon: "💧",
                    color: "#f59e0b",
                    value: 12,
                    stackCount: 1,
                  });
                }
                return nextInv;
              });
              _t((xp) => xp + 45);
              ve(chopRes.message);
            }
          }
        }
      }, [vl]),
      handleToggleDodgeMode = J.useCallback(() => {
        const he = f.current;
        if (he.isDead) return;
        const maxStamina = he.maxStamina ?? 100;
        const staminaCost = maxStamina * 0.25;
        if (!dodgeModeRef.current) {
          if (he.isExhausted || (he.stamina !== undefined && he.stamina < staminaCost)) {
            if (m.current && typeof m.current.playExhaustedSigh === "function") {
              m.current.playExhaustedSigh();
            }
            return;
          }
          dodgeModeRef.current = !0;
          setDodgeMode(!0);
          if (m.current && typeof m.current.playEquipItem === "function") {
            m.current.playEquipItem();
          }
        } else {
          dodgeModeRef.current = !1;
          setDodgeMode(!1);
          if (m.current && typeof m.current.playUnequipItem === "function") {
            m.current.playUnequipItem();
          }
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("rpg_extra_button_action", {
              detail: { player: he, dodgeMode: dodgeModeRef.current, timestamp: Date.now() },
            }),
          );
          if (window.Game && typeof window.Game.onExtraAction === "function") {
            window.Game.onExtraAction(he, dodgeModeRef.current);
          }
        }
      }, [ve]),
      handleExtraAction = handleToggleDodgeMode,
      handleDodge = J.useCallback((dir) => {
        const he = f.current;
        if (he.isDead || he.capturedByScorpionId) return;
        const maxStamina = he.maxStamina ?? 100;
        const staminaCost = maxStamina * 0.25;
        if (he.isExhausted || (he.stamina !== undefined && he.stamina < staminaCost)) {
          dodgeModeRef.current = !1;
          setDodgeMode(!1);
          if (m.current && typeof m.current.playExhaustedSigh === "function") {
            m.current.playExhaustedSigh();
          }
          return;
        }

        // Gasta 1/4 da energia do personagem
        he.stamina = Math.max(0, (he.stamina ?? maxStamina) - staminaCost);
        fa.current = 0.55;
        if (he.stamina <= 0) {
          he.stamina = 0;
          he.isExhausted = !0;
          dodgeModeRef.current = !1;
          setDodgeMode(!1);
          if (m.current && typeof m.current.playExhaustedSigh === "function") {
            m.current.playExhaustedSigh();
          }
        }
        He.current = he.stamina;
        oa.current = !!he.isExhausted;
        oe(he.stamina);
        I(!!he.isExhausted);

        let dx = 0, dy = 0;
        if (dir === "up") dy = -1;
        else if (dir === "down") dy = 1;
        else if (dir === "left") dx = -1;
        else if (dir === "right") dx = 1;
        if (dx === 0 && dy === 0) return;

        const dodgeDist = 58;
        const dodgeDuration = 0.25;
        const oldX = he.x;
        const oldY = he.y;
        const preservedDirection = (he.dodgeTimer && he.dodgeTimer > 0 && he.dodgeFacing) ? he.dodgeFacing : he.direction; // Detalhe: sem virar o personagem!

        he.dodgeTimer = dodgeDuration;
        he.dodgeDuration = dodgeDuration;
        he.dodgeDir = dir;
        he.dodgeDX = dx;
        he.dodgeDY = dy;
        he.dodgeDist = dodgeDist;
        he.dodgeStartX = oldX;
        he.dodgeStartY = oldY;
        he.dodgeFacing = preservedDirection;
        he.dodgeEasePrev = 0;
        he.direction = preservedDirection; // Mantém a direção em que estava olhando!
        he.invulnerableTimer = Math.max(he.invulnerableTimer || 0, 0.36); // Desvio de ataques

        if (m.current && typeof m.current.playPunchWhoosh === "function") {
          m.current.playPunchWhoosh();
        }
        const cEngine = c.current;
        if (cEngine && Array.isArray(cEngine.slimeParticles)) {
          for (let i = 0; i < 7; i++) {
            cEngine.slimeParticles.push({
              x: oldX + (Math.random() - 0.5) * 14,
              y: oldY + 1 + (Math.random() - 0.5) * 6,
              vx: -dx * (2.6 + Math.random() * 2.2) + (Math.random() - 0.5) * 1.8,
              vy: -dy * (2.6 + Math.random() * 2.2) + (Math.random() - 0.5) * 1.8,
              life: 0.28 + Math.random() * 0.08,
              maxLife: 0.34,
              type: "bubble",
              color: i % 2 === 0 ? "#38bdf8" : "#bae6fd",
              size: 1.6 + Math.random() * 1.1,
            });
          }
        }
      }, [ve]),
      ic = J.useCallback(
        (E, D, Q, q) => {
          const F = s0(E, D, Q);
          if (!F)
            return (
              m.current.playFusionFail(),
              ve(
                "⚠️ Esses materiais não se combinam em nenhuma fórmula conhecida.",
              ),
              null
            );
          const ie = F.createResult(q);
          if (
            !!ie.isClayDrying ||
            F.id === "fuse_moldagem_argila" ||
            (q == null ? void 0 : q.includes("choice_frasco_barro")) ||
            (q == null ? void 0 : q.includes("choice_jarra_barro")) ||
            (q == null ? void 0 : q.includes("choice_pote_barro")) ||
            (q == null ? void 0 : q.includes("choice_panela_barro")) ||
            (q == null ? void 0 : q.includes("choice_caldeirao_barro"))
          ) {
            const me = Ve.reduce(
              (Ye, Ge) =>
                Ge.name.toLowerCase().includes("argila") ||
                Ge.id.includes("argila")
                  ? Ye + (Ge.stackCount || 1)
                  : Ye,
              0,
            );
            if (me < 2)
              return (
                m.current.playFusionFail(),
                ve(
                  `⚠️ Você precisa de pelo menos 2 unidades de Argila Úmida para moldar a peça! (Você possui: ${me}/2).`,
                ),
                null
              );
            ra((Ye) => {
              const Ge = [...Ye];
              let Pe = 2;
              for (let aa = Ge.length - 1; aa >= 0 && Pe > 0; aa--) {
                const Ke = Ge[aa];
                if (
                  Ke.name.toLowerCase().includes("argila") ||
                  Ke.id.includes("argila")
                ) {
                  const qe = Ke.stackCount || 1;
                  qe <= Pe
                    ? ((Pe -= qe), Ge.splice(aa, 1))
                    : ((Ge[aa] = { ...Ke, stackCount: qe - Pe }), (Pe = 0));
                }
              }
              return Ge;
            });
            const ce =
                ie.dryingItemType ||
                (q != null && q.includes("frasco")
                  ? "frasco"
                  : q != null && q.includes("jarra")
                    ? "jarra"
                    : q != null && q.includes("panela")
                      ? "panela"
                      : q != null && q.includes("caldeirao")
                        ? "caldeirao"
                        : "pote"),
              Ce =
                {
                  frasco: "Frasco de Barro",
                  jarra: "Jarra de Barro Vazia",
                  pote: "Pote de Barro Vazio",
                  panela: "Panela de Barro Vazia",
                  caldeirao: "Caldeirão de Barro Vazio",
                }[ce] || "Peça de Barro";
            let ze = 2;
            ce === "frasco"
              ? (ze = 0)
              : ce === "caldeirao"
                ? (ze = 1)
                : ce === "jarra"
                  ? (ze = 3)
                  : ce === "panela" && (ze = 4);
            const la = o.current,
              na = la.tileSize,
              ia = Math.floor(f.current.x / na),
              Je = Math.floor(f.current.y / na);
            let he = ia,
              $e = Je;
            const da = la.getTile(ia, Je);
            if (
              la.getPlacedProp(ia, Je) ||
              (da.prop && da.prop.kind !== "flower_patch")
            ) {
              const Ye = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1],
              ];
              for (const [Ge, Pe] of Ye) {
                const aa = ia + Ge,
                  Ke = Je + Pe,
                  De = la.getTile(aa, Ke);
                if (
                  !la.getPlacedProp(aa, Ke) &&
                  (!De.prop || De.prop.kind === "flower_patch") &&
                  De.biome.passable
                ) {
                  ((he = aa), ($e = Ke));
                  break;
                }
              }
            }
            return (
              la.placeProp(he, $e, {
                kind: "drying_clay",
                subType: ze,
                offsetX: 0,
                offsetY: 2,
                scale: 1,
                interactive: !0,
                dryingItemType: ce,
                dryingStartTime: Date.now(),
                dryingDurationMs: 12e4,
                namePt: `${Ce} (Secando ao Sol)`,
                descriptionPt:
                  "Moldado com pura argila da lagoa. Precisa de 2 minutos de secagem ao ar livre para virar um item coletável.",
              }),
              m.current.playClayHarvest(),
              ve(
                `🧱 [${Ce}] moldado no solo com sucesso! Aguarde 2 minutos de secagem para virar um item coletável.`,
              ),
              ie
            );
          }
          if (
            ie.mapPropKind === "clay_oven" ||
            q === "choice_forno_barro_mapa"
          ) {
            ra((ia) => {
              const Je = [...ia],
                he = [E.id, D.id];
              Q && he.push(Q.id);
              const $e = {};
              for (const da of he) $e[da] = ($e[da] || 0) + 1;
              for (const [da, Ye] of Object.entries($e)) {
                const Ge = Je.findIndex((Pe) => Pe.id === da);
                if (Ge !== -1) {
                  const Pe = Je[Ge].stackCount || 1;
                  Pe > Ye
                    ? (Je[Ge] = { ...Je[Ge], stackCount: Pe - Ye })
                    : Je.splice(Ge, 1);
                }
              }
              return Je;
            });
            const me = o.current,
              ce = me.tileSize,
              Re = Math.floor(f.current.x / ce),
              Ce = Math.floor(f.current.y / ce);
            let ze = Re,
              la = Ce;
            const na = me.getTile(Re, Ce);
            if (
              me.getPlacedProp(Re, Ce) ||
              (na.prop && na.prop.kind !== "flower_patch")
            ) {
              const ia = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [1, 1],
                [-1, 1],
                [1, -1],
                [-1, -1],
              ];
              for (const [Je, he] of ia) {
                const $e = Re + Je,
                  da = Ce + he,
                  Ye = me.getTile($e, da);
                if (
                  !me.getPlacedProp($e, da) &&
                  (!Ye.prop || Ye.prop.kind === "flower_patch") &&
                  Ye.biome.passable
                ) {
                  ((ze = $e), (la = da));
                  break;
                }
              }
            }
            return (
              me.placeProp(ze, la, {
                kind: "clay_oven",
                subType: 0,
                offsetX: 0,
                offsetY: 2,
                scale: 1,
                interactive: !0,
                lit: !0,
                namePt: "Forno de Barro",
                descriptionPt:
                  "Forno cúpula artesanal de argila aquecido. Pressione [F] para descansar, salvar o jogo e assar peixes!",
              }),
              m.current.playChestChime(),
              ve(
                "🔥 Forno de Barro instalado no terreno com sucesso! Mantém brasas constantes para assar peixes e descansar.",
              ),
              ie
            );
          }
          if (
            (F.id === "fuse_campfire_unlit" || q === "choice_campfire_unlit") &&
            ie.mapPropKind !== "clay_oven"
          ) {
            const me = Ve.reduce(
              (la, na) =>
                na.name.toLowerCase().includes("galho") ||
                na.id.includes("galho")
                  ? la + (na.stackCount || 1)
                  : la,
              0,
            );
            if (me < 10)
              return (
                m.current.playFusionFail(),
                ve(
                  `⚠️ Você precisa de um conjunto de pelo menos 10 Galhos de Madeira para montar a fogueira! (Você tem ${me}/10).`,
                ),
                null
              );
            ra((la) => {
              const na = [...la];
              let ia = 10;
              for (let Je = na.length - 1; Je >= 0 && ia > 0; Je--) {
                const he = na[Je];
                if (
                  he.name.toLowerCase().includes("galho") ||
                  he.id.includes("galho")
                ) {
                  const da = he.stackCount || 1;
                  da <= ia
                    ? ((ia -= da), na.splice(Je, 1))
                    : ((na[Je] = { ...he, stackCount: da - ia }), (ia = 0));
                }
              }
              return na;
            });
            const ce = o.current,
              Re = ce.tileSize,
              Ce = Math.floor(f.current.x / Re),
              ze = Math.floor(f.current.y / Re);
            return (
              ce.placeProp(Ce, ze, {
                kind: "campfire",
                subType: 0,
                offsetX: 0,
                offsetY: 2,
                scale: 1,
                interactive: !0,
                lit: !1,
                namePt: "Fogueira de Acampamento (Apagada)",
                descriptionPt:
                  "Uma fogueira montada com 10 galhos secos. Pressione [F] tendo 2 Pederneiras para acendê-la com faíscas!",
              }),
              m.current.playChestChime(),
              ve(
                "🏕️ Fogueira apagada montada no terreno com 10 galhos! Ela não ocupa slots do inventário. Use 2 Pederneiras para acendê-la.",
              ),
              ie
            );
          }
          return (
            ra((me) => {
              const ce = [...me],
                Re = [E.id, D.id];
              Q && Re.push(Q.id);
              const Ce = {};
              for (const ze of Re) Ce[ze] = (Ce[ze] || 0) + 1;
              for (const [ze, la] of Object.entries(Ce)) {
                const na = ce.findIndex((ia) => ia.id === ze);
                if (na !== -1) {
                  const ia = ce[na].stackCount || 1;
                  ia > la
                    ? (ce[na] = { ...ce[na], stackCount: ia - la })
                    : ce.splice(na, 1);
                }
              }
              if (
                ie.categoryType === "material" ||
                ie.categoryType === "consumable"
              ) {
                const ze = ce.findIndex(
                  (la) =>
                    la.name.trim().toLowerCase() ===
                      ie.name.trim().toLowerCase() && la.rarity === ie.rarity,
                );
                if (ze !== -1) {
                  const la = ce[ze];
                  return (
                    (ce[ze] = {
                      ...la,
                      stackCount: (la.stackCount || 1) + (ie.stackCount || 1),
                    }),
                    ce
                  );
                }
              }
              return (ce.push(ie), ce);
            }),
            m.current.playFusionSuccess(),
            (ie.isPlaceableChest || F.id === "fuse_bau_madeira") &&
              setTimeout(() => {
                const world = o.current,
                  pl = f.current;
                if (!world || !pl) return;
                const ts = world.tileSize,
                  ptx = Math.floor(pl.x / ts),
                  pty = Math.floor(pl.y / ts);
                const cands = [
                  [ptx, pty + 1],
                  [ptx + 1, pty],
                  [ptx - 1, pty],
                  [ptx, pty - 1],
                  [ptx, pty],
                ];
                let oTx = ptx,
                  oTy = pty + 1;
                for (const [cx, cy] of cands) {
                  if (world.isChestPlacementValid && world.isChestPlacementValid(cx, cy)) {
                    oTx = cx;
                    oTy = cy;
                    break;
                  }
                }
                const prev = {
                  active: !0,
                  mode: "chest",
                  chestItemId: ie.id,
                  chestItemName: ie.name,
                  pileTx: ptx,
                  pileTy: pty,
                  originTx: oTx,
                  originTy: oTy,
                  width: 1,
                  height: 1,
                };
                cabinPlacementPreviewRef.current = prev;
                if (typeof window !== "undefined") window.__cabinPlacementPreview = prev;
                setCabinPlacementPreview(prev);
                zo(!1);
              }, 80),
            ve(`⚗️ Fusão Concluída: [${ie.name}] forjado com sucesso!`),
            ie
          );
        },
        [ve, Ve],
      ),
      qo = J.useCallback(() => {
        var ce, Re, Ce, ze, la, na, ia, Je, he, $e, da;
        const E = o.current,
          D = f.current;
        if (D.isDead) return;
        const Q = E.tileSize,
          q = Math.floor(D.x / Q),
          F = Math.floor(D.y / Q);
        const pDir = D.direction || D.facing || "down";
        let fdx = 0, fdy = 0;
        if (pDir === "left") fdx = -1;
        else if (pDir === "right") fdx = 1;
        else if (pDir === "up") fdy = -1;
        else fdy = 1;

        // Função para testar se um alvo (em coordenadas do mundo x,y) está na frente do jogador ou dentro de uma tolerância imediata
        // Retorna: -1 se estiver atrás (ignorar), ou score positivo (quanto mais alinhado à frente e mais próximo, maior prioridade)
        const getDirectionalScore = (targetX, targetY) => {
          const dx = targetX - D.x;
          const dy = targetY - D.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 10) return 1000 - dist; // Praticamente em cima do jogador
          // Produto escalar com vetor de direção
          const dot = dx * fdx + dy * fdy;
          // Se o produto escalar for negativo além de tolerância estrita (ex: -12px), está atrás
          if (dot < -12) return -1;
          // Score de prioridade: peso para estar na frente + proximidade
          const alignment = dot / (dist || 1); // 1 = perfeitamente na frente, 0 = 90 graus lado
          return (alignment * 200) + (100 - dist);
        };

        // 1. Verificar se há itens caídos na frente do jogador (ignora os que estão atrás)
        const droppedCandidate = (() => {
          let best = null, bestScore = -1;
          for (const it of c.current.droppedItems) {
            if (it.isUnderground !== !!E.isUnderground) continue;
            const dist = Math.hypot(it.x - D.x, it.y - D.y);
            if (dist > 52) continue;
            const score = getDirectionalScore(it.x, it.y);
            if (score > 0 && score > bestScore) {
              bestScore = score;
              best = it;
            }
          }
          return best;
        })();
        const ie = droppedCandidate;
        if (ie) {
          const Ye = ot(Da.current.mochila),
            Ge = Zt.current.findIndex((Ke) => Ke.name === ie.item.name),
            Pe = ie.quantity || ie.item.stackCount || 1;
          if (Ge < 0 && Zt.current.length >= Ye) {
            ve(
              `Mochila cheia (${Zt.current.length}/${Ye}) para recolher ${ie.item.name}!`,
            );
            return;
          }
          const aa = c.current.collectDroppedItem(ie.id);
          if (aa) {
            (m.current.playItemPickup(),
              ra((Ke) => {
                const De = Ke.findIndex((qe) => qe.name === aa.item.name);
                if (De >= 0) {
                  const qe = [...Ke];
                  return (
                    (qe[De] = {
                      ...qe[De],
                      stackCount: (qe[De].stackCount || 1) + Pe,
                    }),
                    qe
                  );
                }
                return [...Ke, { ...aa.item, stackCount: Pe }];
              }));
            return;
          }
        }

        // 2. Verificar carcaças na frente do jogador (ignora as que estão atrás)
        const carcassCandidate = (() => {
          let best = null, bestScore = -1;
          for (const carc of c.current.carcasses) {
            if (carc.collected || carc.isUnderground !== !!E.isUnderground) continue;
            const dist = Math.hypot(carc.x - D.x, carc.y - D.y);
            if (dist > 56) continue;
            const score = getDirectionalScore(carc.x, carc.y);
            if (score > 0 && score > bestScore) {
              bestScore = score;
              best = carc;
            }
          }
          return best;
        })();
        const ge = carcassCandidate;
        if (ge) {
          const Ye = c.current.collectCarcass(ge.id);
          if (Ye) {
            const Ge = {
              id: `creature_${Ye.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: Ye.lootItemName,
              categoryType: "material",
              isEquippable: !1,
              rarity: Ye.lootItemRarity,
              description: Ye.lootItemDescription,
              icon: Ye.lootItemIcon,
              color: Ye.lootItemColor,
              value: Ye.lootItemValue,
              stackCount: 1,
            };
            (ra((Pe) => {
              const aa = Pe.findIndex((De) => De.name === Ge.name);
              if (aa >= 0) {
                const De = [...Pe];
                return (
                  (De[aa] = {
                    ...De[aa],
                    stackCount: (De[aa].stackCount || 1) + 1,
                  }),
                  De
                );
              }
              const Ke = ot(Da.current.mochila);
              return Pe.length >= Ke
                ? (ve(`Inventário cheio (máximo de ${Ke} itens)!`), Pe)
                : [...Pe, Ge];
            }),
              Ye.gold > 0 && _t((Pe) => Pe + Ye.gold),
              m.current.playSlimePickup());
            return;
          }
        }

        // 3. Verificar itens naturais do chão (seixos, cogumelos, flores, gravetos) na frente do jogador
        let re = null;
        let reBestScore = -1;
        for (let Ye = -1; Ye <= 1; Ye++)
          for (let Ge = -1; Ge <= 1; Ge++) {
            const Pe = q + Ye,
              aa = F + Ge;
            if (!E.isGroundItemCollected(Pe, aa) && Hs(Pe, aa, E)) {
              const De = E.getTile(Pe, aa),
                qe = ((De.detailHash * 13) % 10) - 5,
                Ze = ((De.detailHash * 19) % 10) - 5,
                sa = Pe * Q + Q / 2 + qe,
                Pa = aa * Q + Q / 2 + Ze,
                va = Math.hypot(D.x - sa, D.y - Pa);
              if (va < 50) {
                const score = getDirectionalScore(sa, Pa);
                if (score > 0 && score > reBestScore) {
                  reBestScore = score;
                  re = { tx: Pe, ty: aa, dist: va };
                }
              }
            }
          }
        if (re) {
          ut(re.tx, re.ty);
          return;
        }
        if (
          typeof window !== "undefined" &&
          window.SnowPeakCity &&
          typeof window.SnowPeakCity.interactWithNearbyCitizen === "function"
        ) {
          const npcChat = window.SnowPeakCity.interactWithNearbyCitizen(
            D.x,
            D.y,
            !!E.isUnderground,
          );
          if (npcChat && npcChat.success) {
            m.current.playChestChime && m.current.playChestChime();
            ve(npcChat.message);
            return;
          }
        }
        if (
          typeof window !== "undefined" &&
          window.DesertCity &&
          typeof window.DesertCity.interactWithNearbyCitizen === "function"
        ) {
          const desertChat = window.DesertCity.interactWithNearbyCitizen(
            D.x,
            D.y,
            !!E.isUnderground,
          );
          if (desertChat && desertChat.success) {
            m.current.playChestChime && m.current.playChestChime();
            ve(desertChat.message);
            return;
          }
        }
        if (
          typeof window !== "undefined" &&
          window.PortCity &&
          typeof window.PortCity.interactWithNearbyCitizen === "function"
        ) {
          const portChat = window.PortCity.interactWithNearbyCitizen(
            D.x,
            D.y,
            !!E.isUnderground,
          );
          if (portChat && portChat.success) {
            m.current.playChestChime && m.current.playChestChime();
            ve(portChat.message);
            return;
          }
        }
        const hasAxeInHands = !!(
          (Oe.mao_direita &&
            ((Oe.mao_direita.id || "").toLowerCase().includes("machado") ||
              (Oe.mao_direita.name || "").toLowerCase().includes("machado") ||
              (Oe.mao_direita.id || "").toLowerCase().includes("axe"))) ||
          (Oe.mao_esquerda &&
            ((Oe.mao_esquerda.id || "").toLowerCase().includes("machado") ||
              (Oe.mao_esquerda.name || "").toLowerCase().includes("machado") ||
              (Oe.mao_esquerda.id || "").toLowerCase().includes("axe")))
        );

        // Grid 3x3 de tiles adjacentes com filtro de direção rigoroso:
        // Apenas tiles à frente do jogador ou no mesmo tile; tiles que estão nas costas (dot < -0.3) são descartados!
        const allAdjacentTiles = [
          { tx: q + fdx, ty: F + fdy, isFacingFront: true }, // Tile exatamente à frente
          { tx: q, ty: F, isFacingFront: false },            // Tile sob os pés
          { tx: q + 1, ty: F, isFacingFront: false },
          { tx: q - 1, ty: F, isFacingFront: false },
          { tx: q, ty: F + 1, isFacingFront: false },
          { tx: q, ty: F - 1, isFacingFront: false },
          { tx: q + 1, ty: F + 1, isFacingFront: false },
          { tx: q - 1, ty: F + 1, isFacingFront: false },
          { tx: q + 1, ty: F - 1, isFacingFront: false },
          { tx: q - 1, ty: F - 1, isFacingFront: false },
        ];

        // Filtra tiles descartando os que estão claramente nas costas
        const validTilesFacing = allAdjacentTiles.filter((c) => {
          if (c.tx === q && c.ty === F) return true; // Mesmo tile
          const dtx = c.tx - q;
          const dty = c.ty - F;
          const dot = dtx * fdx + dty * fdy;
          // Se dot < 0, está nas costas! Ignorar!
          return dot >= 0;
        });

        const isPriorityDoorOrChest = (coord) => {
          const tile = E.getTile(coord.tx, coord.ty);
          const kind = tile && tile.prop ? tile.prop.kind : "";
          return (
            kind === "cabin_door" ||
            kind === "wooden_chest" ||
            kind === "greek_door" ||
            kind === "snow_city_door" ||
            kind === "desert_city_door" ||
            kind === "port_city_door" ||
            kind === "dungeon_door" ||
            kind === "iron_bars_gate"
          );
        };

        // Ordenação por prioridade:
        // 1. Portas / baús exatamente à frente
        // 2. Portas / baús adjacentes na visão frontal/lateral
        // 3. Tile exatamente à frente (fdx, fdy)
        // 4. Outros objetos na frente/lados
        // 5. O que estiver nas costas foi excluído pelo filtro acima!
        const me = [
          ...validTilesFacing.filter((c) => c.isFacingFront && isPriorityDoorOrChest(c)),
          ...validTilesFacing.filter((c) => !c.isFacingFront && isPriorityDoorOrChest(c)),
          ...validTilesFacing.filter((c) => c.isFacingFront && !isPriorityDoorOrChest(c)),
          ...validTilesFacing.filter((c) => !c.isFacingFront && !isPriorityDoorOrChest(c)),
        ];
        for (const Ye of me) {
          const Ge = E.getTile(Ye.tx, Ye.ty),
            Pe = (ce = Ge.prop) == null ? void 0 : ce.kind,
            aa = ((Re = Ge.prop) == null ? void 0 : Re.subType) ?? 0;
          if (
            Pe === "corridor_torch" &&
            ((Ce = Ge.prop) == null ? void 0 : Ce.lit) === !1
          ) {
            const hasTorchInHand = !!(
              (Oe.mao_esquerda &&
                ((Oe.mao_esquerda.id || "").toLowerCase().includes("torch") ||
                  (Oe.mao_esquerda.name || "").toLowerCase().includes("tocha"))) ||
              (Oe.mao_direita &&
                ((Oe.mao_direita.id || "").toLowerCase().includes("torch") ||
                  (Oe.mao_direita.name || "").toLowerCase().includes("tocha")))
            );
            if (hasTorchInHand) {
              E.lightCorridorTorch(Ye.tx, Ye.ty);
              m.current.playTorchIgnite();
              const qe = Ye.tx * E.tileSize + E.tileSize / 2,
                Ze = Ye.ty * E.tileSize + E.tileSize / 2;
              c.current &&
                c.current.scareMonstersNearFire &&
                c.current.scareMonstersNearFire(qe, Ze, 110);
              _t((xp) => xp + 25);
              return;
            } else {
              m.current.playPunchWhoosh();
              return;
            }
          }
          if (
            Pe === "campfire" &&
            ((Ce = Ge.prop) == null ? void 0 : Ce.lit) === !1
          ) {
            let De = 0;
            for (const qe of Ve) {
              const Ze = (qe.name || "").toLowerCase(),
                sa = (qe.id || "").toLowerCase();
              (Ze.includes("pederneira") ||
                Ze.includes("pedreneira") ||
                sa.includes("pederneira") ||
                sa.includes("pedreneira")) &&
                (De += qe.stackCount || 1);
            }
            for (const qe of ["mao_direita", "mao_esquerda"]) {
              const Ze = Oe[qe];
              if (Ze) {
                const sa = (Ze.name || "").toLowerCase(),
                  Pa = (Ze.id || "").toLowerCase();
                (sa.includes("pederneira") ||
                  sa.includes("pedreneira") ||
                  Pa.includes("pederneira") ||
                  Pa.includes("pedreneira")) &&
                  (De += Ze.stackCount || 1);
              }
            }
            if (De >= 2) {
              (E.lightCampfire(Ye.tx, Ye.ty), m.current.playTorchIgnite());
              const qe = Ye.tx * E.tileSize + E.tileSize / 2,
                Ze = Ye.ty * E.tileSize + E.tileSize / 2;
              (c.current.scareMonstersNearFire(
                qe,
                Ze,
                (E.isUnderground ? 225 : 190) * 0.55,
              ),
                (D.hp = D.maxHp ?? 100),
                (D.stamina = D.maxStamina ?? 100),
                (D.isExhausted = !1),
                (W.current = D.hp),
                (He.current = D.stamina),
                (oa.current = !1),
                Ee(D.hp),
                oe(D.stamina),
                I(!1),
                sr(Ye.tx, Ye.ty, "Fogueira Crepitante"),
                ve(
                  "🔥 Fogueira acesa! Ponto de Salve registrado com sucesso. Suas 2 pederneiras foram preservadas.",
                ));
              return;
            } else {
              (m.current.playPunchWhoosh(),
                ve(
                  `⚠️ Esta fogueira está apagada! Você precisa de 2 Pederneiras para golpear e produzir faíscas (Você possui: ${De}/2).`,
                ));
              return;
            }
          }
          const Ke = E.interactWithTile(Ye.tx, Ye.ty, { hasAxe: hasAxeInHands });
          if (Ke) {
            if (Ke.action === "enter_cave") {
              __autoCaveTimer.current = 1.0;
              const oldX = D.x,
                oldY = D.y;
              (m.current.playCaveEnter(),
                E.enterCave(Ye.tx, Ye.ty, oldX, oldY),
                (Oa.current = { x: 0, y: 0 }),
                Et(!1),
                (D.x = Ye.tx * Q + 14),
                (D.y = Ye.ty * Q + 20),
                (D.vx = 0),
                (D.vy = 0),
                (D.direction = "down"));
              const trM =
                c.current && c.current.transferChasingMonsters
                  ? c.current.transferChasingMonsters(oldX, oldY, D.x, D.y, !0)
                  : 0;
              const De = E.getTile(Ye.tx, Ye.ty);
              (v(De.biome),
                S({ tx: Ye.tx, ty: Ye.ty }),
                !!(
                  ((ze = Oe.mao_esquerda) != null && ze.id.includes("torch")) ||
                  ((la = Oe.mao_direita) != null && la.id.includes("torch")) ||
                  ((na = Oe.mao_esquerda) != null &&
                    na.name.toLowerCase().includes("tocha")) ||
                  ((ia = Oe.mao_direita) != null &&
                    ia.name.toLowerCase().includes("tocha"))
                )
                  ? (z(!0),
                    m.current.playTorchIgnite())
                  : z(!1));
              trM > 0 &&
                ve(
                  `⚠️ ${trM === 1 ? "A criatura que te perseguia atravessou" : `${trM} criaturas que te perseguiam atravessaram`} a caverna com você!`,
                );
            } else if (Ke.action === "exit_cave") {
              __autoCaveTimer.current = 1.0;
              const oldX = D.x,
                oldY = D.y;
              m.current.playCaveExit();
              const targetTx =
                  Ke.targetTx !== undefined ? Ke.targetTx : Math.floor(D.x / Q),
                targetTy =
                  Ke.targetTy !== undefined ? Ke.targetTy : Math.floor(D.y / Q);
              const De = E.exitCave(targetTx, targetTy);
              ((Oa.current = { x: 0, y: 0 }),
                Et(!1),
                (D.x = De.x),
                (D.y = De.y + 16),
                (D.vx = 0),
                (D.vy = 0),
                (D.direction = "down"));
              const trM =
                c.current && c.current.transferChasingMonsters
                  ? c.current.transferChasingMonsters(oldX, oldY, D.x, D.y, !1)
                  : 0;
              const qe = Math.floor(D.x / Q),
                Ze = Math.floor(D.y / Q),
                sa = E.getTile(qe, Ze);
              (v(sa.biome),
                S({ tx: qe, ty: Ze }),
                ve(
                  `Emergindo de volta à superfície ensolarada [${qe}, ${Ze}]!`,
                ));
              trM > 0 &&
                ve(
                  `⚠️ ${trM === 1 ? "A criatura que te perseguia atravessou" : `${trM} criaturas que te perseguiam atravessaram`} a saída com você!`,
                );
            } else if (Ke.action === "enter_dungeon") {
              __autoCaveTimer.current = 1.0;
              const oldX = D.x,
                oldY = D.y;
              m.current.playCaveEnter();
              E.enterDungeon(Ye.tx, Ye.ty, oldX, oldY);
              Oa.current = { x: 0, y: 0 };
              Et(!1);
              D.x = Ye.tx * Q + 14;
              D.y = (Ye.ty + 1) * Q + 14;
              D.vx = 0;
              D.vy = 0;
              D.direction = "down";
              v(E.getTile(Ye.tx, Ye.ty + 1).biome);
              S({ tx: Ye.tx, ty: Ye.ty + 1 });
            } else if (Ke.action === "exit_dungeon") {
              __autoCaveTimer.current = 1.0;
              m.current.playCaveExit();
              const targetTx =
                  Ke.targetTx !== undefined ? Ke.targetTx : Math.floor(D.x / Q),
                targetTy =
                  Ke.targetTy !== undefined ? Ke.targetTy : Math.floor(D.y / Q);
              const De = E.exitDungeon(targetTx, targetTy);
              Oa.current = { x: 0, y: 0 };
              Et(!1);
              D.x = De.x;
              D.y = De.y;
              D.vx = 0;
              D.vy = 0;
              D.direction = "down";
              const qe = Math.floor(D.x / Q),
                Ze = Math.floor(D.y / Q);
              v(E.getTile(qe, Ze).biome);
              S({ tx: qe, ty: Ze });
            } else if (Ke.action === "enter_geode") {
              __autoCaveTimer.current = 1.0;
              const oldX = D.x,
                oldY = D.y;
              m.current.playCaveEnter();
              const targetTx = Ke.targetTx !== undefined ? Ke.targetTx : Ye.tx,
                targetTy = Ke.targetTy !== undefined ? Ke.targetTy : Ye.ty;
              E.enterGeode(targetTx, targetTy, oldX, oldY);
              Oa.current = { x: 0, y: 0 };
              Et(!1);
              D.x = targetTx * Q + Q / 2;
              D.y = (targetTy - 2) * Q + Q / 2;
              D.vx = 0;
              D.vy = 0;
              D.direction = "up";
              const qe = Math.floor(D.x / Q),
                Ze = Math.floor(D.y / Q);
              v(E.getTile(qe, Ze).biome);
              S({ tx: qe, ty: Ze });
            } else if (Ke.action === "exit_geode") {
              __autoCaveTimer.current = 1.0;
              m.current.playCaveExit();
              const targetTx = Ke.targetTx !== undefined ? Ke.targetTx : Math.floor(D.x / Q),
                targetTy = Ke.targetTy !== undefined ? Ke.targetTy : Math.floor(D.y / Q);
              const De = E.exitGeode(targetTx, targetTy);
              Oa.current = { x: 0, y: 0 };
              Et(!1);
              D.x = De.x;
              D.y = De.y;
              D.vx = 0;
              D.vy = 0;
              D.direction = "down";
              const qe = Math.floor(D.x / Q),
                Ze = Math.floor(D.y / Q);
              v(E.getTile(qe, Ze).biome);
              S({ tx: qe, ty: Ze });
            } else if (Ke.action === "mine_crystal") {
              m.current.playMineCrystal();
              const De = pi("crystal", aa);
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              });
            } else if (Ke.action === "mine_ore") {
              m.current.playChestChime();
              const De = pi("ore", aa);
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              });
            } else if (Ke.action === "harvest_mushroom") {
              m.current.playChestChime();
              const De = pi("mushroom");
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              });
            } else if (Ke.action === "harvest_luminous_algae") {
              m.current.playChestChime();
              const De = {
                id: `alga_luminosa_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
                name: "Alga Luminosa do Geodo",
                icon: "herb",
                color: "#2dd4bf",
                isEquippable: !1,
                isConsumable: !0,
                healAmount: 18,
                hydrationAmount: 25,
                description: "Filamento bioluminescente colhido no lago central do Geodo. Restaura vida e sede.",
              };
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              });
            } else if (Ke.action === "harvest_blue_plant") {
              m.current.playChestChime();
              const De = Ke.flowered
                ? {
                    id: `flor_azul_${Date.now()}`,
                    name: "Flor Azul do Luar",
                    icon: "flower_blue",
                    color: "#2563eb",
                    isEquippable: !1,
                    categoryType: "material",
                    rarity: "raro",
                    value: 80,
                    stackCount: 1,
                    description: "Flor azul luminosa que só abre à noite no ponto mais alto das montanhas de pedra.",
                  }
                : {
                    id: `ramo_azul_${Date.now()}`,
                    name: "Ramo Azul",
                    icon: "branch_blue",
                    color: "#2563eb",
                    isEquippable: !1,
                    categoryType: "material",
                    rarity: "incomum",
                    value: 35,
                    stackCount: 1,
                    description: "Ramo azul colhido antes da floração da Planta Azul do Luar.",
                  };
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                const existing = qe.findIndex((Pa) => Pa.name === De.name);
                if (existing >= 0) {
                  const next = [...qe];
                  next[existing] = { ...next[existing], stackCount: (next[existing].stackCount || 1) + 1 };
                  return next;
                }
                return qe.length >= Ze ? (ve(`Inventário cheio (máximo de ${Ze} itens)!`), qe) : [...qe, De];
              });
              _t((qe) => qe + (Ke.flowered ? 80 : 35));
              ve(Ke.message);
            } else if (Ke.action === "harvest_clay") {
              m.current.playClayHarvest();
              const De = {
                id: `item_argila_${Date.now()}`,
                name: "Argila Úmida",
                icon: "🧱",
                color: "#c2410c",
                isEquippable: !1,
                description:
                  "Argila mineral pura, densa e maleável extraída do leito da lagoa. Essencial para moldar frascos, caldeirões, potes e tijolos.",
                categoryType: "material",
                rarity: "comum",
                value: 4,
                stackCount: 2,
              };
              (ra((qe) => {
                const Ze = qe.findIndex((Pa) => Pa.name.includes("Argila"));
                if (Ze >= 0) {
                  const Pa = [...qe],
                    va = Pa[Ze];
                  return (
                    (Pa[Ze] = { ...va, stackCount: (va.stackCount ?? 1) + 2 }),
                    Pa
                  );
                }
                const sa = ot(Da.current.mochila);
                return qe.length >= sa
                  ? (ve(`Inventário cheio (máximo ${sa} itens)!`), qe)
                  : [...qe, De];
              }),
                _t((qe) => qe + 5));
            } else if (Ke.action === "need_axe") {
              m.current.playPunchWhoosh && m.current.playPunchWhoosh();
              ve(Ke.message);
            } else if (Ke.action === "chop_tree_hit") {
              // Ativa animação de corte de arma no personagem
              D.attackTimer = 0.28;
              D.attackDuration = 0.28;
              D.attackCombo = ((D.attackCombo || 0) + 1) % 2;
              D.attackType = "weapon";
              const treeCenterX = (Ke.tx * E.tileSize) + (E.tileSize / 2) + (Ke.offsetX || 0);
              const treeCenterY = (Ke.ty * E.tileSize) + (E.tileSize / 2) + (Ke.offsetY || 0);
              const hitDir = D.x < treeCenterX ? 1 : -1;
              m.current.playWoodChop && m.current.playWoodChop();
              window.shakeTree && window.shakeTree(Ke.tx, Ke.ty, hitDir, 7.0);
              window.__spawnWoodChips && window.__spawnWoodChips(treeCenterX, treeCenterY, 10);
              window.__spawnLeavesBurst && window.__spawnLeavesBurst(treeCenterX, treeCenterY - 14, 6);
              ve(Ke.message);
            } else if (Ke.action === "chop_tree_fell") {
              D.attackTimer = 0.32;
              D.attackDuration = 0.32;
              D.attackCombo = ((D.attackCombo || 0) + 1) % 2;
              D.attackType = "weapon";
              const treeCenterX = (Ke.tx * E.tileSize) + (E.tileSize / 2) + (Ke.offsetX || 0);
              const treeCenterY = (Ke.ty * E.tileSize) + (E.tileSize / 2) + (Ke.offsetY || 0);
              const hitDir = D.x < treeCenterX ? 1 : -1;
              m.current.playWoodChop && m.current.playWoodChop();
              m.current.playTreeFall && m.current.playTreeFall();
              window.startFallingTree && window.startFallingTree({
                tx: Ke.tx,
                ty: Ke.ty,
                x: treeCenterX,
                y: treeCenterY,
                kind: Ke.treeKind || "tree_oak",
                subType: Ke.treeSubType || 0,
                scale: Ke.treeScale || 1,
                biomeId: Ke.biomeId,
                dir: hitDir,
              });
              window.__spawnWoodChips && window.__spawnWoodChips(treeCenterX, treeCenterY, 14);
              window.__spawnLeavesBurst && window.__spawnLeavesBurst(treeCenterX, treeCenterY - 16, 12);
              const woodLogsCount = Ke.woodLogs || 2;
              const sticksCount = Ke.sticks || 1;
              ra((prev) => {
                const maxSlots = ot(Da.current.mochila);
                const nextInv = [...prev];
                for (let i = 0; i < woodLogsCount; i++) {
                  if (nextInv.length < maxSlots) {
                    nextInv.push(pi("wood_log"));
                  }
                }
                for (let i = 0; i < sticksCount; i++) {
                  if (nextInv.length < maxSlots) {
                    nextInv.push({
                      id: `item_galho_${Date.now()}_${i}`,
                      name: "Galho de Madeira",
                      difficulty: "facil",
                      rarity: "comum",
                      description: "Galho rígido de madeira colhido sob as copas das árvores.",
                      categoryType: "equipment",
                      slot: "mao_direita",
                      isEquippable: true,
                      stats: { attack: 5 },
                      icon: "🪵",
                      color: "#a16207",
                      value: 2,
                      stackCount: 1,
                    });
                  }
                }
                if (Ke.resin && nextInv.length < maxSlots) {
                  nextInv.push({
                    id: `item_resina_${Date.now()}`,
                    name: "Resina de Pinheiro",
                    difficulty: "media",
                    rarity: "incomum",
                    description: "Resina pegajosa e combustível exsudada de pinheiros. Excelente para tochas.",
                    categoryType: "material",
                    isEquippable: false,
                    icon: "💧",
                    color: "#f59e0b",
                    value: 12,
                    stackCount: 1,
                  });
                }
                return nextInv;
              });
              _t((xp) => xp + 45);
              ve(Ke.message);
            } else if (Ke.action === "collect_pebbles") {
              m.current.playRockBreak && m.current.playRockBreak();
              const De = pi("stone");
              ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              });
              ve("Você recolheu pedregulhos pontiagudos ao lado da muralha do calabouço!");
            } else if (Ke.action === "collect_jailer_key") {
              if (!Ke.alreadyCollected) {
                m.current.playChestChime && m.current.playChestChime();
                const keyItem = {
                  id: `jailer_key_${Date.now()}`,
                  name: "Chave do Carcereiro",
                  icon: "🗝️",
                  color: "#eab308",
                  isEquippable: !1,
                  categoryType: "material",
                  rarity: "raro",
                  value: 80,
                  stackCount: 1,
                  description:
                    "Molho de pesadas chaves de ferro forjado do antigo carcereiro. Destranca as grades das celas da prisão do calabouço.",
                };
                ra((prev) => {
                  const maxSlots = ot(Da.current.mochila);
                  return prev.length >= maxSlots ? prev : [...prev, keyItem];
                });
                _t((xp) => xp + 60);
              }
              ve(Ke.message);
            } else if (Ke.action === "collect_greek_vase") {
              const maxSlots = ot(Da.current.mochila);
              if (Ve.length >= maxSlots) {
                const pKey = E.isUnderground ? `underground_${Ye.tx},${Ye.ty}` : `${Ye.tx},${Ye.ty}`;
                const prev = E.interactedProps.get(pKey) || {};
                E.interactedProps.set(pKey, { ...prev, collected: !1 });
                E.invalidateTile(Ye.tx, Ye.ty);
                m.current.playPunchWhoosh && m.current.playPunchWhoosh();
                ve(`⚠️ Inventário cheio (máximo ${maxSlots} itens)! Libere espaço para coletar o jarro/pote.`);
                return;
              }
              m.current.playItemPickup && m.current.playItemPickup();
              const item = Ke.item;
              if (item) {
                ra((prev) => [...prev, item]);
              }
              _t((xp) => xp + 55);
              ve(Ke.message || `🏺 Você recolheu: ${item ? item.name : "Jarro Antigo"}!`);
              return;
            } else if (Ke.action === "collect_bookshelf" || Ke.action === "collect_scroll_stand") {
              const maxSlots = ot(Da.current.mochila);
              if (Ve.length >= maxSlots) {
                const pKey = E.isUnderground ? `underground_${Ye.tx},${Ye.ty}` : `${Ye.tx},${Ye.ty}`;
                const prev = E.interactedProps.get(pKey) || {};
                E.interactedProps.set(pKey, { ...prev, collected: !1 });
                E.invalidateTile(Ye.tx, Ye.ty);
                m.current.playPunchWhoosh && m.current.playPunchWhoosh();
                ve(`⚠️ Inventário cheio (máximo ${maxSlots} itens)! Libere espaço para coletar o livro/pergaminho.`);
                return;
              }
              m.current.playItemPickup && m.current.playItemPickup();
              const item = Ke.item;
              if (item) {
                ra((prev) => [...prev, item]);
              }
              _t((xp) => xp + 80);
              // Sem aviso de toast ao coletar livros e pergaminhos
              return;
            } else if (Ke.action === "locked_cell") {
              const hasKey = Ve.some(
                (it) =>
                  (it.name || "").toLowerCase().includes("carcereiro") ||
                  (it.name || "").toLowerCase().includes("chave") ||
                  (it.id || "").toLowerCase().includes("jailer_key") ||
                  (it.id || "").toLowerCase().includes("key"),
              );
              if (hasKey) {
                E.unlockAndOpenGate(Ke.tx || Ye.tx, Ke.ty || Ye.ty);
                m.current.playChestChime && m.current.playChestChime();
              } else {
                m.current.playPunchWhoosh && m.current.playPunchWhoosh();
                ve(Ke.message);
              }
              return;
            } else if (Ke.action === "cabin_door") {
              m.current && m.current.playWoodChop && m.current.playWoodChop();
              ve(Ke.message);
              return;
            } else if (Ke.action === "clay_still_drying")
              (m.current.playPunchWhoosh(), ve(Ke.message));
            else if (Ke.action === "collect_wood_log") {
              const qe = ot(Da.current.mochila);
              if (Ve.length >= qe) {
                const existing = E.getPlacedProp(Ye.tx, Ye.ty);
                if (existing && existing.kind === "wood_log") {
                  existing.count = (existing.count || 1) + 1;
                  existing.namePt = existing.count > 1 ? `Pilha de Troncos (${existing.count})` : "Tronco de Madeira";
                  existing.descriptionPt = `Pilha com ${existing.count} troncos de madeira robustos no chão. Pressione [F] para recolher.`;
                  E.invalidateTile(Ye.tx, Ye.ty);
                } else {
                  E.placeProp(Ye.tx, Ye.ty, {
                    kind: "wood_log",
                    count: 1,
                    interactive: true,
                    namePt: "Tronco de Madeira",
                    descriptionPt: "Tronco robusto de árvore cortada colocado no chão. Pressione [F] para recolher à mochila.",
                  });
                }
                ve(`⚠️ Inventário cheio (máximo ${qe} itens)! Libere espaço para recolher o tronco de madeira.`);
                return;
              }
              ra((prev) => [...prev, pi("wood_log")]);
              m.current && m.current.playItemPickup && m.current.playItemPickup();
              ve(Ke.message);
              return;
            } else if (Ke.action === "collect_dried_clay") {
              const De = Ke.dryingItemType || "pote",
                qe = ot(Da.current.mochila);
              if (Ve.length >= qe) {
                (E.placeProp(Ye.tx, Ye.ty, {
                  kind: "drying_clay",
                  subType: De === "frasco" ? 0 : De === "caldeirao" ? 1 : 2,
                  offsetX: 0,
                  offsetY: 2,
                  scale: 1,
                  interactive: !0,
                  dryingItemType: De,
                  dryingStartTime: Date.now() - 13e4,
                  dryingDurationMs: 12e4,
                  namePt: `${De === "frasco" ? "Frasco de Barro" : De === "caldeirao" ? "Caldeirão de Barro" : "Pote de Barro"} (Seco)`,
                  descriptionPt:
                    "Perfeitamente curado ao sol e pronto para recolher.",
                }),
                  ve(
                    `Inventário cheio (máximo ${qe} itens)! Libere espaço para recolher a peça de barro.`,
                  ));
                return;
              }
              let Ze;
              (De === "frasco"
                ? (Ze = {
                    id: `item_frasco_barro_${Date.now()}`,
                    name: "Frasco de Barro",
                    categoryType: "consumable",
                    isEquippable: !1,
                    rarity: "comum",
                    value: 30,
                    stackCount: 1,
                    icon: "🏺",
                    color: "#ea580c",
                    description:
                      "Frasco cerâmico torneado em pura argila e seco ao sol. Pode ser usado na beira da lagoa para coletar água fresca (+40 Stamina ao beber).",
                  })
                : De === "jarra"
                  ? (Ze = {
                      id: `item_jarra_barro_${Date.now()}`,
                      name: "Jarra de Barro Vazia",
                      categoryType: "consumable",
                      isEquippable: !1,
                      rarity: "incomum",
                      value: 40,
                      stackCount: 1,
                      icon: "🏺",
                      color: "#d97706",
                      description:
                        "Jarra cerâmica com alça e bico torneada em argila pura. Pode ser mergulhada na água para coletar água fresca (+70 Stamina ao beber).",
                    })
                  : De === "panela"
                    ? (Ze = {
                        id: `item_panela_barro_${Date.now()}`,
                        name: "Panela de Barro Vazia",
                        categoryType: "consumable",
                        isEquippable: !1,
                        rarity: "incomum",
                        value: 45,
                        stackCount: 1,
                        icon: "🍳",
                        color: "#b45309",
                        description:
                          "Panela robusta de barro com paredes grossas. Pode coletar água fresca na lagoa (+90 Stamina ao beber) ou preparar receitas.",
                      })
                    : De === "caldeirao"
                      ? (Ze = {
                          id: `item_caldeirao_barro_${Date.now()}`,
                          name: "Caldeirão de Barro Vazio",
                          categoryType: "consumable",
                          isEquippable: !1,
                          rarity: "incomum",
                          value: 45,
                          stackCount: 1,
                          icon: "🍲",
                          color: "#9a3412",
                          description:
                            "Caldeirão robusto moldado com paredes espessas de argila e curado ao sol. Pode coletar água fresca (+90 Stamina) ou ser usado em receitas no fogo.",
                        })
                      : (Ze = {
                          id: `item_pote_barro_${Date.now()}`,
                          name: "Pote de Barro Vazio",
                          categoryType: "consumable",
                          isEquippable: !1,
                          rarity: "comum",
                          value: 30,
                          stackCount: 1,
                          icon: "🏺",
                          color: "#c2410c",
                          description:
                            "Pote de cerâmica rústica moldado em argila e seco ao sol. Pode ser usado na beira da água para coletar água fresca (+55 Stamina ao beber).",
                        }),
                m.current.playChestChime(),
                ra((sa) => [...sa, Ze]));
            } else if (Pe === "chest") {
              m.current.playChestChime();
              const De = pi("chest");
              (ra((qe) => {
                const Ze = ot(Da.current.mochila);
                return qe.length >= Ze
                  ? (ve(`Inventário cheio (máximo ${Ze} itens)!`), qe)
                  : [...qe, De];
              }),
                _t((qe) => qe + 60));
            } else if (Ke.action === "collect_roasted_fish") {
              m.current.playChestChime();
              const De = Ke.roastedFish;
              De &&
                ra((Ze) => {
                  const sa = ot(Da.current.mochila);
                  return Ze.length >= sa
                    ? (ve(
                        "Inventário cheio! Libere um espaço para pegar o peixe assado.",
                      ),
                      Ze)
                    : [...Ze, De];
                });
              const qe = E.getNearbyCampfire(D.x, D.y, 95);
              ((Ue.current = qe), xe(qe));
              return;
            } else if (Ke.action === "fish_still_roasting") {
              (m.current.playPunchWhoosh(), ve(Ke.message));
              return;
            } else if (Ke.action === "start_roast_now") {
              (m.current.playTorchIgnite(),
                ve(
                  `🍢 Espeto montado sobre as brasas! O ${Ke.fishName} está assando. Aguarde 1 minuto e pressione [F] para recolher.`,
                ));
              const De = E.getNearbyCampfire(D.x, D.y, 95);
              ((Ue.current = De), xe(De));
              return;
            } else if (Ke.action === "collect_cooked_meal") {
              m.current.playChestChime();
              const De = Ke.cookedMeal;
              if (!De) return;
              (ra((qe) => {
                const Ze = [...qe],
                  sa = ot(Da.current.mochila);
                for (const Pa of De.items || []) {
                  if (Ze.length >= sa) {
                    ve("⚠️ Mochila cheia! Alguns pratos ficaram de fora.");
                    continue;
                  }
                  const va = Ze.findIndex((Nt) => Nt.name === Pa.name);
                  if (
                    va >= 0 &&
                    (Ze[va].stackCount || 1) + (Pa.stackCount || 1) <=
                      (Ze[va].maxStack || 20)
                  )
                    Ze[va] = {
                      ...Ze[va],
                      stackCount:
                        (Ze[va].stackCount || 1) + (Pa.stackCount || 1),
                    };
                  else Ze.push(Pa);
                }
                return Ze;
              }),
                ve(De.message || "🍲 Refeição coletada da panela!"));
              const qe = E.getNearbyCampfire(D.x, D.y, 95);
              ((Ue.current = qe), xe(qe));
              return;
            } else if (Ke.action === "meal_cooking") {
              (m.current.playPunchWhoosh(), ve(Ke.message));
              return;
            } else if (Pe === "campfire" || Pe === "clay_oven") {
              const De = Pe === "clay_oven",
                qe = !!(
                  ((Je = Oe.mao_esquerda) != null && Je.id.includes("torch")) ||
                  ((he = Oe.mao_direita) != null && he.id.includes("torch")) ||
                  (($e = Oe.mao_esquerda) != null &&
                    $e.name.toLowerCase().includes("tocha")) ||
                  ((da = Oe.mao_direita) != null &&
                    da.name.toLowerCase().includes("tocha")) ||
                  Ve.some(
                    (ka) =>
                      ka.id.includes("torch") ||
                      ka.name.toLowerCase().includes("tocha"),
                  )
                ),
                Ze = ot(Oe.mochila);
              if (!qe && Ve.length < Ze) {
                const ka = pi("chest", 1);
                (ra((ht) => [...ht, ka]), m.current.playTorchIgnite());
              } else m.current.playShrineActivation();
              ((D.hp = D.maxHp ?? 100),
                (D.stamina = D.maxStamina ?? 100),
                (D.isExhausted = !1),
                (W.current = D.hp),
                (He.current = D.stamina),
                (oa.current = !1),
                Ee(D.hp),
                oe(D.stamina),
                I(!1));
              const sa = E.getNearbyCampfire(D.x, D.y, 95);
              ((Ue.current = sa), xe(sa));
              const Pa = sa ? sa.tx : Ye.tx,
                va = sa ? sa.ty : Ye.ty,
                Nt =
                  (sa == null ? void 0 : sa.prop.namePt) ||
                  Ge.prop.namePt ||
                  (De ? "Forno de Barro" : "Fogueira Crepitante");
              sr(Pa, va, Nt);
              const rt = Ve.reduce(
                (ka, ht) =>
                  ht.name.toLowerCase().includes("galho") ||
                  ht.id.includes("galho")
                    ? ka + (ht.stackCount || 1)
                    : ka,
                0,
              );
              De
                ? ve(
                    "🔥 Salve no Forno de Barro! HP e Vigor restaurados. Brasas ativas para assar peixes [T]!",
                  )
                : rt >= 10
                  ? ve(
                      "💾 Ponto de Salve Registrado! HP e Vigor restaurados. Pressione [G] para alimentar a fogueira com 10 Galhos!",
                    )
                  : ve(
                      "💾 Ponto de Salve Registrado! Esta fogueira é seu novo ponto de retorno com HP e Vigor restaurados.",
                    );
            } else if (Ke.action === "open_wooden_chest") {
              m.current.playInventoryOpen && m.current.playInventoryOpen();
              if (E.updateWoodenChestStorage) {
                E.updateWoodenChestStorage(Ke.tx, Ke.ty, Ke.storageItems || [], !0);
              }
              setActiveWoodenChest({
                tx: Ke.tx,
                ty: Ke.ty,
                maxSlots: Ke.maxSlots || 12,
                items: Array.isArray(Ke.storageItems) ? [...Ke.storageItems] : [],
              });
              return;
            } else if (
              Ke.action === "toggle_gate" ||
              Ke.action === "dungeon_door" ||
              Ke.action === "greek_door" ||
              Ke.action === "snow_city_door" ||
              Ke.action === "desert_city_door" ||
              Ke.action === "cabin_door"
            ) {
              m.current.playInventoryOpen && m.current.playInventoryOpen();
              return;
            } else if (Ke.action === "desert_city_mat") {
              D.hp = D.maxHp ?? 100;
              D.stamina = D.maxStamina ?? 100;
              D.isExhausted = !1;
              W.current = D.hp;
              He.current = D.stamina;
              oa.current = !1;
              Ee(D.hp);
              oe(D.stamina);
              I(!1);
              m.current.playShrineActivation && m.current.playShrineActivation();
              ve("🛏️ Você descansou na esteira à sombra fresca da casa de adobe! HP e Vigor restaurados ao máximo.");
              return;
            } else if (Ke.action === "desert_city_pots") {
              D.stamina = Math.min(D.maxStamina ?? 100, (D.stamina || 0) + 30);
              He.current = D.stamina;
              oe(D.stamina);
              m.current.playInventoryOpen && m.current.playInventoryOpen();
              ve("🏺 Você bebeu da água fresca na cerâmica e comeu tâmaras secas do deserto (+30 Vigor)!");
              return;
            } else if (Ke.action === "unlit_corridor_torch") {
              m.current.playPunchWhoosh && m.current.playPunchWhoosh();
              return;
            } else
              Ke.reward
                ? m.current.playChestChime()
                : m.current.playShrineActivation();
            return;
          }
        }
        if (ma.current && ko.current) {
          nr();
          return;
        }
        if (ma.current && Br.current) {
          Ut();
          return;
        }
      }, [Oe, Ve, z, ve, sr, nr, Ut]),
      Yr = J.useCallback(
        (E = 10) => {
          const D = o.current,
            Q = f.current;
          if (!D || !Q) return;
          const q = D.getNearbyCampfire(Q.x, Q.y, 95);
          if (!q) {
            (m.current.playPunchWhoosh(),
              ve(
                "⚠️ Nenhuma fogueira por perto para alimentar! Aproxime-se de uma fogueira.",
              ));
            return;
          }
          const F = Ve.reduce(
            (ge, re) =>
              re.name.toLowerCase().includes("galho") || re.id.includes("galho")
                ? ge + (re.stackCount || 1)
                : ge,
            0,
          );
          if (F < E) {
            (m.current.playFusionFail(),
              ve(
                `⚠️ Você precisa de pelo menos ${E} Galhos de Madeira para alimentar esta fogueira! (Você possui: ${F}/${E}).`,
              ));
            return;
          }
          ra((ge) => {
            const re = [...ge];
            let me = E;
            for (let ce = re.length - 1; ce >= 0 && me > 0; ce--) {
              const Re = re[ce];
              if (
                Re.name.toLowerCase().includes("galho") ||
                Re.id.includes("galho")
              ) {
                const ze = Re.stackCount || 1;
                ze <= me
                  ? ((me -= ze), re.splice(ce, 1))
                  : ((re[ce] = { ...Re, stackCount: ze - me }), (me = 0));
              }
            }
            return re;
          });
          const ie = D.feedCampfire(q.tx, q.ty, E);
          if (ie.success) {
            m.current.playCampfireFeed();
            const ge = q.tx * D.tileSize + D.tileSize / 2,
              re = q.ty * D.tileSize + D.tileSize / 2;
            c.current && typeof c.current.addDamageNumber === "function" &&
              c.current.addDamageNumber(
                ge,
                re - 24,
                `${ie.scale.toFixed(1)}x TAMANHO 🔥`,
                "#f97316",
              );
            const me = D.getNearbyCampfire(Q.x, Q.y, 95);
            if (((Ue.current = me), xe(me), q.prop.lit !== !1)) {
              const Re = (D.isUnderground ? 225 : 190) + (ie.scale - 1) * 85;
              (c.current.scareMonstersNearFire(ge, re, Re * 0.5),
                (Q.hp = Math.min(Q.maxHp ?? 100, (Q.hp ?? 100) + 30)),
                (Q.stamina = Q.maxStamina ?? 100),
                (Q.isExhausted = !1),
                (W.current = Q.hp),
                (He.current = Q.stamina),
                (oa.current = !1),
                Ee(Q.hp),
                oe(Q.stamina),
                I(!1),
                sr(q.tx, q.ty, ie.propName));
            }
            ve(
              `🔥 Fogueira alimentada com +${E} galhos! ${ie.percentageGrowth} (${ie.propName})`,
            );
          }
        },
        [Ve, ve, sr],
      ),
      Mo = J.useCallback(() => {
        const E = o.current,
          D = f.current,
          Q = E.getNearbyCampfire(D.x, D.y, 95);
        if (!Q) {
          (m.current.playPunchWhoosh(),
            ve("⚠️ Aproxime-se de uma fogueira para assar peixe no espeto."));
          return;
        }
        if (Q.prop.lit === !1) {
          (m.current.playPunchWhoosh(),
            ve(
              "⚠️ Esta fogueira está apagada. Acenda-a primeiro com as 2 pederneiras!",
            ));
          return;
        }
        if (Q.prop.roastingFish) {
          const re = Date.now() - Q.prop.roastingFish.startTime;
          if (re >= Q.prop.roastingFish.durationMs) qo();
          else {
            const me = Math.ceil((Q.prop.roastingFish.durationMs - re) / 1e3);
            (m.current.playPunchWhoosh(),
              ve(
                `⏳ O peixe já está assando nas brasas! Faltam ${me}s para ficar no ponto.`,
              ));
          }
          return;
        }
        const q = Ve.findIndex((re) => {
          const me = (re.id || "").toLowerCase(),
            ce = (re.name || "").toLowerCase();
          return (
            (me.includes("fish") ||
              ce.includes("peixe") ||
              ce.includes("lambari") ||
              ce.includes("tilapia") ||
              ce.includes("tilápia") ||
              ce.includes("cascudo") ||
              ce.includes("truta")) &&
            !ce.includes("assado") &&
            !ce.includes("espeto")
          );
        });
        if (q === -1) {
          (m.current.playFusionFail(),
            ve(
              "⚠️ Você precisa ter um peixe cru no inventário para colocar no espeto!",
            ));
          return;
        }
        const F = Ve.findIndex((re) => {
          const me = (re.id || "").toLowerCase(),
            ce = (re.name || "").toLowerCase();
          return me.includes("galho") || ce.includes("galho");
        });
        if (F === -1) {
          (m.current.playFusionFail(),
            ve(
              "⚠️ Você precisa de 1 Galho de madeira para montar o espeto de assar!",
            ));
          return;
        }
        const ie = Ve[q];
        (ra((re) => {
          const me = [...re],
            ce = me[F];
          (ce.stackCount || 1) > 1
            ? (me[F] = { ...ce, stackCount: (ce.stackCount || 1) - 1 })
            : me.splice(F, 1);
          const Re = me.findIndex((Ce) => Ce.id === ie.id);
          if (Re !== -1) {
            const Ce = me[Re];
            (Ce.stackCount || 1) > 1
              ? (me[Re] = { ...Ce, stackCount: (Ce.stackCount || 1) - 1 })
              : me.splice(Re, 1);
          }
          return me;
        }),
          E.startRoastingFish(Q.tx, Q.ty, ie),
          m.current.playTorchIgnite(),
          ve(
            `🍢 ${ie.name} colocado no espeto de galho sobre a fogueira! Aguarde 1 minuto para ficar assado.`,
          ));
        const ge = E.getNearbyCampfire(D.x, D.y, 95);
        ((Ue.current = ge), xe(ge));
      }, [Ve, qo, ve]),
      kG = J.useCallback(() => {
        const E = o.current,
          D = f.current;
        if (!E || !D || D.isDead) return;
        const Q = E.getNearbyCampfire(D.x, D.y, 120);
        if (!Q) {
          (m.current.playPunchWhoosh(),
            ve(
              "⚠️ Aproxime-se de uma fogueira acesa. Para colocar a panela no fogo, abra o inventário e clique nela.",
            ));
          return;
        }
        if (Q.prop.lit === !1) {
          (m.current.playPunchWhoosh(),
            ve("⚠️ Esta fogueira está apagada. Acenda-a primeiro com [F]!"));
          return;
        }
        const q = Q.prop.cookingPot;
        if (q) {
          // ✅ Panela já está no fogo: [R] ABRE O MODAL de ingredientes (6 slots).
          // Colocar/recolher panela é feito pelo botão do inventário.
          cookingPotRef.current = { tx: Q.tx, ty: Q.ty };
          setCookingModalOpen(!0);
          m.current.playItemPickup();
          return;
        }
        // Sem panela no fogo: [R] não faz nada (silencioso, a pedido do jogador).
        // Colocar a panela no fogo é feito pelo botão do inventário.
      }, [Ve, qo, ve]),
      // Botão do inventário: coloca/recolhe a panela/caldeirão clicada no fogo
      zK = J.useCallback((potItem) => {
        const E = o.current,
          D = f.current;
        if (!E || !D || D.isDead || !potItem) return;
        const Q = E.getNearbyCampfire(D.x, D.y, 120);
        if (!Q) {
          (m.current.playPunchWhoosh(),
            ve("⚠️ Aproxime-se de uma fogueira para usar esta opção."));
          return;
        }
        if (Q.prop.lit === !1) {
          (m.current.playPunchWhoosh(),
            ve("⚠️ Esta fogueira está apagada. Acenda-a primeiro com [F]!"));
          return;
        }
        const potOnFire = Q.prop.cookingPot;
        if (potOnFire) {
          // Recolher a panela que está no fogo (ingredientes voltam pra mochila)
          const finished = Date.now() - potOnFire.startTime >= 45e3;
          if (finished) {
            qo();
          } else {
            const back = E.removeCookingPot(Q.tx, Q.ty);
            if (back) {
              const items = [];
              const pn = ((back.potItem || {}).name || "").toLowerCase();
              items.push({ ...(back.potItem || {}), hasWater: !!back.hasWater });
              for (const ing of back.ingredients || [])
                items.push({ ...ing, id: ing.id || `cook_ing_${(ing.name || "").toLowerCase().replace(/\s+/g, "_")}` });
              ra((Ce) => {
                const la = [...Ce];
                for (const it of items) {
                  const ix = la.findIndex((x) => x.name === it.name);
                  if (ix >= 0)
                    la[ix] = { ...la[ix], stackCount: (la[ix].stackCount || 1) + 1 };
                  else la.push({ ...it, stackCount: 1 });
                }
                return la;
              });
              m.current.playItemPickup();
              ve(`↩️ ${pn.includes("caldeir") ? "Caldeirão" : "Panela"} recolhido(a) do fogo com seus ingredientes.`);
            }
          }
          (() => {
            const Ce = E.getNearbyCampfire(D.x, D.y, 120);
            ((Ue.current = Ce), xe(Ce));
          })();
          return;
        }
        // Colocar a panela clicada no fogo
        const pn = ((potItem.id || "") + " " + (potItem.name || "")).toLowerCase();
        if (!(pn.includes("panela") || pn.includes("caldeir"))) {
          (m.current.playFusionFail(), ve("⚠️ Este item não é uma panela ou caldeirão."));
          return;
        }
        if ((potItem.stackCount || 1) > 1) {
          (m.current.playPunchWhoosh(),
            ve("⚠️ Separe a panela do monte antes de colocá-la no fogo (pilhas não vão ao fogo)."));
          return;
        }
        const withWater = pn.includes("com água") || pn.includes("com agua") || !!potItem.hasWater;
        ra((Ce) => {
          const ze = Ce.findIndex((na) => na.id === potItem.id);
          if (ze === -1) return Ce;
          const la = [...Ce];
          return (la[ze].stackCount || 1) > 1
            ? ((la[ze] = { ...la[ze], stackCount: (la[ze].stackCount || 1) - 1 }), la)
            : (la.splice(ze, 1), la);
        });
        E.setCookingPot(Q.tx, Q.ty, potItem),
          m.current.playTorchIgnite(),
          ve(
            withWater
              ? `🍳 ${potItem.name} colocada no fogo com ÁGUA! Pressione [R] perto da fogueira (ou toque na panela) para escolher os ingredientes.`
              : `🍳 ${potItem.name} colocada no fogo VAZIA (ideal para fritar carnes)! Pressione [R] (ou toque na panela) para escolher os ingredientes.`,
          ),
          (() => {
            const Ce = E.getNearbyCampfire(D.x, D.y, 120);
            ((Ue.current = Ce), xe(Ce));
          })();
      }, [Ve, qo, ve]),
      wK = J.useCallback((chosenItem) => {
        const E = o.current,
          D = f.current;
        if (!E || !D || D.isDead) return;
        const Q = E.getNearbyCampfire(D.x, D.y, 120);
        if (!Q || !Q.prop.cookingPot) {
          (m.current.playPunchWhoosh(),
            ve(
              "⚠️ Nenhuma panela no fogo por aqui! Coloque uma panela na fogueira com [R] primeiro.",
            ));
          return;
        }
        const q = Q.prop.cookingPot;
        if ((q.ingredients || []).length >= 6) {
          (m.current.playFusionFail(),
            ve("🍲 O caldeirão já está cheio (6 ingredientes no máximo)!"));
          return;
        }
        let ie = null, F = -1;
        if (chosenItem) {
          // Modal: item escolhido pelo jogador (sem filtro de tipo)
          F = Ve.findIndex((me) => me.id === chosenItem.id);
          if (F === -1) {
            (m.current.playFusionFail(),
              ve("⚠️ Este item não está mais na sua mochila."));
            return;
          }
          ie = Ve[F];
        } else {
          F = Ve.findIndex((me) => {
            const ce = ((me.id || "") + " " + (me.name || "")).toLowerCase();
            return (
              (ce.includes("carne") ||
                ce.includes("meat") ||
                ce.includes("gosma") ||
                ce.includes("gelatina")) &&
              !ce.includes("cozida") &&
              !ce.includes("frita")
            );
          });
          if (F === -1) {
            (m.current.playFusionFail(),
              ve(
                "🥩 Nenhum ingrediente cozinhável na mochila! Traga Carne, Corpo de Gosma ou Gelatina.",
              ));
            return;
          }
          ie = Ve[F];
        }
        ra((me) => {
          const ce = me.findIndex((Re) => Re.id === ie.id);
          if (ce === -1) return me;
          const ze = [...me],
            la = ze[ce].stackCount || 1;
          return (
            la > 1
              ? ((ze[ce] = { ...ze[ce], stackCount: la - 1 }), ze)
              : (ze.splice(ce, 1), ze),
            ze
          );
        }),
          E.addIngredientToPot(Q.tx, Q.ty, ie),
          m.current.playItemPickup(),
          (() => {
            const me = E.getNearbyCampfire(D.x, D.y, 120);
            ((Ue.current = me), xe(me));
          })();
      }, [Ve, ve]),
      dr = J.useCallback(() => {
        const isTorchItem = (it) =>
          !!(
            it &&
            ((it.id && it.id.toLowerCase().includes("torch")) ||
              (it.name && it.name.toLowerCase().includes("tocha")))
          );
        const equippedSlot = isTorchItem(Oe.mao_esquerda)
          ? "mao_esquerda"
          : isTorchItem(Oe.mao_direita)
            ? "mao_direita"
            : null;
        if (equippedSlot) {
          Vr(equippedSlot);
          return;
        }
        const D = Ve.find(isTorchItem);
        if (D) {
          (ir(D), z(!0), m.current.playTorchIgnite());
          return;
        }
        (m.current.playCaveExit(), z(!1));
      }, [Oe, Ve, ir, Vr]),
      Gr = (E, D) =>
        E === "KeyW" ||
        E === "ArrowUp" ||
        D === "ArrowUp" ||
        D === "Up" ||
        D === "w" ||
        D === "W"
          ? "up"
          : E === "KeyS" ||
              E === "ArrowDown" ||
              D === "ArrowDown" ||
              D === "Down" ||
              D === "s" ||
              D === "S"
            ? "down"
            : E === "KeyA" ||
                E === "ArrowLeft" ||
                D === "ArrowLeft" ||
                D === "Left" ||
                D === "a" ||
                D === "A"
              ? "left"
              : E === "KeyD" ||
                  E === "ArrowRight" ||
                  D === "ArrowRight" ||
                  D === "Right" ||
                  D === "d" ||
                  D === "D"
                ? "right"
                : null,
      moveCabinPlacementPreview = J.useCallback((dir) => {
        const cur = cabinPlacementPreviewRef.current;
        if (!cur || !cur.active) return false;
        let dx = 0,
          dy = 0;
        if (dir === "up") dy = -1;
        else if (dir === "down") dy = 1;
        else if (dir === "left") dx = -1;
        else if (dir === "right") dx = 1;
        if (dx === 0 && dy === 0) return false;
        const maxRange = 14;
        const nextOriginTx = Math.max(cur.pileTx - maxRange, Math.min(cur.pileTx + maxRange, cur.originTx + dx));
        const nextOriginTy = Math.max(cur.pileTy - maxRange, Math.min(cur.pileTy + maxRange, cur.originTy + dy));
        if (nextOriginTx === cur.originTx && nextOriginTy === cur.originTy) return true;
        const nextPreview = {
          ...cur,
          originTx: nextOriginTx,
          originTy: nextOriginTy,
        };
        cabinPlacementPreviewRef.current = nextPreview;
        if (typeof window !== "undefined") window.__cabinPlacementPreview = nextPreview;
        setCabinPlacementPreview(nextPreview);
        if (m.current && typeof m.current.playFootstep === "function") {
          m.current.playFootstep(false);
        }
        return true;
      }, []),
      cancelCabinPlacementPreview = J.useCallback(() => {
        const cur = cabinPlacementPreviewRef.current;
        if (!cur) return false;
        cabinPlacementPreviewRef.current = null;
        if (typeof window !== "undefined") window.__cabinPlacementPreview = null;
        setCabinPlacementPreview(null);
        return true;
      }, []),
      Bo = J.useCallback((E, D) => {
        if (cabinPlacementPreviewRef.current && cabinPlacementPreviewRef.current.active) {
          y.current[E] = D;
          if (D) {
            moveCabinPlacementPreview(E);
            cabinMoveRepeatTimerRef.current = performance.now() + 220;
          }
          return;
        }
        if (dodgeModeRef.current) {
          if (D) {
            handleDodge(E);
          }
          return;
        }
        if (((y.current[E] = D), D)) {
          const Q = performance.now(),
            q = Se.current[E] || 0,
            F = Q - q;
          (F > 40 && F < 360 && (Ae.current[E] = !0), (Se.current[E] = Q));
        } else Ae.current[E] = !1;
      }, [handleDodge, moveCabinPlacementPreview]),
      handleReadBook = J.useCallback(() => {
        if (readerOpen) {
          setReaderOpen(!1);
          return;
        }
        if (readerItem) {
          setReaderOpen(!0);
          return;
        }
        const b = Ve.find((i) => {
          const n = (i.name || "").toLowerCase();
          const d = (i.id || "").toLowerCase();
          return (
            n.includes("livro") ||
            n.includes("tomo") ||
            n.includes("tratado") ||
            n.includes("compêndio") ||
            n.includes("compendio") ||
            n.includes("manuscrito") ||
            n.includes("pergaminho") ||
            d.includes("livro") ||
            d.includes("pergaminho")
          );
        });
        if (b) {
          setReaderItem(b);
          setReaderOpen(!0);
          ve(`📖 Abrindo: ${b.name}`);
        } else {
          ve("📚 Nenhum livro ou pergaminho na mochila no momento.");
        }
      }, [readerOpen, readerItem, Ve, ve]),
      _readerEffect = J.useEffect(() => {
        const onOpenReaderEvt = (evt) => {
          if (evt.detail && evt.detail.item) {
            setReaderItem(evt.detail.item);
            setReaderOpen(!0);
            if (evt.detail.item.name) {
              ve(`📖 Consultando Grimório: ${evt.detail.item.name}`);
            }
          }
        };
        const onKnowledgeEvt = (evt) => {
          if (evt.detail && evt.detail.completed) {
            ve(`🎓 Conhecimento arquivado no slot de aprendizado do Inventário!`);
          }
        };
        window.addEventListener("rpg_open_reader", onOpenReaderEvt);
        window.addEventListener("rpg_knowledge_updated", onKnowledgeEvt);
        return () => {
          window.removeEventListener("rpg_open_reader", onOpenReaderEvt);
          window.removeEventListener("rpg_knowledge_updated", onKnowledgeEvt);
        };
      }, [ve]),
      handleBuildCabin = J.useCallback(() => {
        const world = o.current;
        if (!world) return false;

        // 2º clique / confirmação: se já estiver no modo de posicionamento verde, confirma e cria a cabana ou o baú!
        const activePreview = cabinPlacementPreviewRef.current;
        if (activePreview && activePreview.active) {
          if (activePreview.mode === "chest") {
            const res = world.buildPlayerChest
              ? world.buildPlayerChest(activePreview.originTx, activePreview.originTy, [])
              : null;
            if (res && res.success) {
              cabinPlacementPreviewRef.current = null;
              if (typeof window !== "undefined") window.__cabinPlacementPreview = null;
              setCabinPlacementPreview(null);
              ra((bp) => {
                let idx = bp.findIndex((it) => it.id === activePreview.chestItemId);
                if (idx === -1) {
                  idx = bp.findIndex(
                    (it) =>
                      it.isPlaceableChest ||
                      (it.name || "").toLowerCase().includes("baú de madeira") ||
                      (it.name || "").toLowerCase().includes("bau de madeira"),
                  );
                }
                if (idx === -1) return bp;
                const target = bp[idx];
                if ((target.stackCount || 1) > 1) {
                  const next = [...bp];
                  next[idx] = { ...target, stackCount: target.stackCount - 1 };
                  return next;
                }
                return bp.filter((_, i) => i !== idx);
              });
              m.current && m.current.playWoodChop && m.current.playWoodChop();
              m.current && m.current.playChestChime && m.current.playChestChime();
              return true;
            } else {
              m.current && m.current.playFusionFail && m.current.playFusionFail();
              ve(res ? res.message : "⚠️ Local bloqueado! Mova o quadrado verde para um piso ou terreno livre.");
              return true;
            }
          }
          const result = world.buildCabin(
            activePreview.pileTx,
            activePreview.pileTy,
            activePreview.originTx,
            activePreview.originTy,
          );
          if (result && result.success) {
            cabinPlacementPreviewRef.current = null;
            if (typeof window !== "undefined") window.__cabinPlacementPreview = null;
            setCabinPlacementPreview(null);
            m.current && m.current.playWoodChop && m.current.playWoodChop();
            m.current && m.current.playChestChime && m.current.playChestChime();
            const remainingPile = world.getNearbyWoodLogPile
              ? world.getNearbyWoodLogPile(f.current.x, f.current.y, 90, 5)
              : null;
            nearbyLogPileRef.current = remainingPile;
            setNearbyLogPile(remainingPile);
            return true;
          } else {
            m.current && m.current.playFusionFail && m.current.playFusionFail();
            ve(result ? result.message : "⚠️ Local bloqueado! Mova a área verde para um terreno livre.");
            return true;
          }
        }

        // 1º clique: abre o modo de posicionamento (área verde da cabana que se move com os botões de andar)
        const pile =
          nearbyLogPileRef.current ||
          (world.getNearbyWoodLogPile
            ? world.getNearbyWoodLogPile(f.current.x, f.current.y, 90, 5)
            : null);
        if (!pile || !pile.prop || (pile.prop.count || 1) < 5) {
          ve("⚠️ Você precisa de pelo menos 5 troncos na pilha no chão para construir a cabana!");
          return false;
        }
        if (world.isUnderground) {
          ve("⚠️ Cabanas só podem ser construídas na superfície!");
          return false;
        }

        const width = 4;
        const height = 4;
        const candidateOrigins = [
          [pile.tx - 1, pile.ty - 2],
          [pile.tx - 2, pile.ty - 2],
          [pile.tx - 1, pile.ty - 1],
          [pile.tx - 2, pile.ty - 1],
          [pile.tx, pile.ty - 2],
          [pile.tx - 1, pile.ty - 4],
          [pile.tx + 1, pile.ty - 2],
          [pile.tx - 4, pile.ty - 2],
        ];
        let initialOriginTx = pile.tx - 1;
        let initialOriginTy = pile.ty - 2;
        for (const [cx, cy] of candidateOrigins) {
          if (world.isCabinPlacementValid && world.isCabinPlacementValid(cx, cy, width, height)) {
            initialOriginTx = cx;
            initialOriginTy = cy;
            break;
          }
        }

        const previewObj = {
          active: true,
          pileTx: pile.tx,
          pileTy: pile.ty,
          originTx: initialOriginTx,
          originTy: initialOriginTy,
          width,
          height,
        };
        cabinPlacementPreviewRef.current = previewObj;
        if (typeof window !== "undefined") window.__cabinPlacementPreview = previewObj;
        setCabinPlacementPreview(previewObj);
        m.current && m.current.playEquipItem && m.current.playEquipItem();
        return true;
      }, [ve]),
      Ga = J.useRef({
        handleAttack: Sl,
        handleThrowPebble: Rl,
        handleInteract: qo,
        handleBuildCabin: handleBuildCabin,
        cancelCabinPlacementPreview: cancelCabinPlacementPreview,
        moveCabinPlacementPreview: moveCabinPlacementPreview,
        handleStartFishing: nr,
        handleStopFishing: $r,
        handleCollectWater: Ut,
        handleFeedCampfire: Yr,
        handleRoastFish: Mo,
        handleCookingPot: kG,
        handleAddIngredient: wK,
        handleToggleInventory: Qt,
        handleReadBook: handleReadBook,
        handleToggleTorch: dr,
        handleRecenterCamera: Oo,
        handleRespawn: Tl,
        handleUseBeltSlot: Ur,
        handleExtraAction: handleExtraAction,
        setSoundEnabled: M,
        showToast: ve,
      });
    return (
      (Ga.current = {
        handleAttack: Sl,
        handleThrowPebble: Rl,
        startPebbleAim: startPebbleAim,
        endPebbleAim: endPebbleAim,
        handleInteract: qo,
        handleBuildCabin: handleBuildCabin,
        cancelCabinPlacementPreview: cancelCabinPlacementPreview,
        moveCabinPlacementPreview: moveCabinPlacementPreview,
        handleStartFishing: nr,
        handleStopFishing: $r,
        handleCollectWater: Ut,
        handleFeedCampfire: Yr,
        handleRoastFish: Mo,
        handleCookingPot: kG,
        handleAddIngredient: wK,
        handleToggleInventory: Qt,
        handleReadBook: handleReadBook,
        handleToggleTorch: dr,
        handleRecenterCamera: Oo,
        handleRespawn: Tl,
        handleUseBeltSlot: Ur,
        handleExtraAction: handleExtraAction,
        setSoundEnabled: M,
        showToast: ve,
      }),
      J.useEffect(() => {
        const E = (q) => {
            if (
              typeof document !== "undefined" &&
              document.activeElement &&
              document.activeElement.tagName === "SELECT" &&
              /^(Key[WASDEFIRTLGCUQPBJM]|Arrow|Space|Digit)/i.test(q.code || "")
            ) {
              q.preventDefault();
              document.activeElement.blur();
            }
            const isArrowKey =
              ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(q.code) ||
              ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Up", "Down", "Left", "Right"].includes(q.key);
            if (!(dodgeModeRef.current && isArrowKey)) {
              ((g.current[q.code] = !0), (g.current[q.key] = !0));
              const F = Gr(q.code, q.key);
              if (F && !q.repeat) {
                const ie = performance.now(),
                  ge = Se.current[F] || 0,
                  re = ie - ge;
                (re > 40 && re < 360 && (Ae.current[F] = !0),
                  (Se.current[F] = ie));
              }
            }
            if (q.code === "ShiftLeft" || q.code === "ShiftRight" || q.key === "Shift") {
              if (!q.repeat && Ga.current.startPebbleAim) {
                Ga.current.startPebbleAim();
              }
              return;
            }
            if (
              (([
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Up",
                "Down",
                "Left",
                "Right",
                "Space",
              ].includes(q.key) ||
                [
                  "ArrowUp",
                  "ArrowDown",
                  "ArrowLeft",
                  "ArrowRight",
                  "Space",
                ].includes(q.code)) &&
                q.preventDefault(),
              So.current)
            ) {
              q.code === "Escape" && Ga.current.handleStopFishing();
              return;
            }
            if (cabinPlacementPreviewRef.current && cabinPlacementPreviewRef.current.active) {
              const moveDir = Gr(q.code, q.key);
              if (moveDir) {
                q.preventDefault();
                if (!q.repeat && Ga.current.moveCabinPlacementPreview) {
                  Ga.current.moveCabinPlacementPreview(moveDir);
                  cabinMoveRepeatTimerRef.current = performance.now() + 220;
                }
                return;
              }
              if (q.code === "Escape") {
                q.preventDefault();
                if (Ga.current.cancelCabinPlacementPreview) {
                  Ga.current.cancelCabinPlacementPreview();
                }
                return;
              }
              if (q.code === "Enter" || q.code === "KeyC" || q.key === "c" || q.key === "C") {
                q.preventDefault();
                if (!q.repeat && Ga.current.handleBuildCabin) {
                  Ga.current.handleBuildCabin();
                }
                return;
              }
            }
            if (q.code === "Escape" && props && typeof props.onReturnToMenu === "function") {
              props.onReturnToMenu();
              return;
            }
            if (
              dodgeModeRef.current &&
              (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(q.code) ||
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Up", "Down", "Left", "Right"].includes(q.key)
              )
            ) {
              if (!q.repeat) {
                const dir = (q.code === "ArrowUp" || q.key === "ArrowUp" || q.key === "Up")
                  ? "up"
                  : (q.code === "ArrowDown" || q.key === "ArrowDown" || q.key === "Down")
                    ? "down"
                    : (q.code === "ArrowLeft" || q.key === "ArrowLeft" || q.key === "Left")
                      ? "left"
                      : "right";
                handleDodge(dir);
              }
              q.preventDefault();
              return;
            }
            q.code === "Space"
              ? Ga.current.handleAttack()
              : q.code === "KeyF" || q.key === "f" || q.key === "F"
                ? Ga.current.handleInteract()
                : q.code === "KeyE" ||
                    q.key === "e" ||
                    q.key === "E" ||
                    q.code === "KeyI" ||
                    q.key === "i" ||
                    q.key === "I" ||
                    q.code === "KeyB" ||
                    q.key === "b" ||
                    q.key === "B"
                  ? Ga.current.handleToggleInventory()
                  : q.code === "KeyU" || q.key === "u" || q.key === "U"
                    ? Ga.current.handleCollectWater()
                    : q.code === "KeyP" || q.key === "p" || q.key === "P"
                      ? ma.current && ko.current
                        ? Ga.current.handleStartFishing()
                        : ma.current && !ko.current
                          ? Ga.current.showToast(
                              "💧 Você precisa de uma Lança para pescar! Crie uma na Bancada ou equipe uma.",
                            )
                          : Ga.current.showToast(
                              "⚠️ Aproxime-se da margem do lago para usar a pesca com lança!",
                            )
                      : q.code === "KeyG" || q.key === "g" || q.key === "G"
                        ? Ga.current.handleFeedCampfire(10)
                        : q.code === "KeyT" || q.key === "t" || q.key === "T"
                          ? Ga.current.handleRoastFish()
                          : q.code === "KeyR" || q.key === "r" || q.key === "R"
                            ? Ga.current.handleCookingPot()
                            : q.code === "KeyQ" || q.key === "q" || q.key === "Q"
                              ? Ga.current.handleAddIngredient()
                              : q.code === "Digit1" || q.key === "1"
                            ? Ga.current.handleUseBeltSlot("cinto_slot1")
                            : q.code === "Digit2" || q.key === "2"
                              ? Ga.current.handleUseBeltSlot("cinto_slot2")
                              : q.code === "KeyJ" ||
                                  q.key === "j" ||
                                  q.key === "J"
                                ? Ga.current.handleReadBook()
                                : q.code === "KeyL" ||
                                  q.key === "l" ||
                                  q.key === "L"
                                ? Ga.current.handleToggleTorch()
                                : q.code === "KeyM" ||
                                    q.key === "m" ||
                                    q.key === "M"
                                  ? Ga.current.setSoundEnabled((ie) => !ie)
                                  : q.code === "KeyC" ||
                                      q.key === "c" ||
                                      q.key === "C"
                                    ? (Ga.current.handleBuildCabin && Ga.current.handleBuildCabin() ? null : Ga.current.handleRecenterCamera())
                                    : (q.code === "KeyR" ||
                                        q.key === "r" ||
                                        q.key === "R") &&
                                      (f.current.isDead
                                        ? Ga.current.handleRespawn()
                                        : Ga.current.handleCookingPot());
          },
          D = (q) => {
            ((g.current[q.code] = !1), (g.current[q.key] = !1));
            if (q.code === "ShiftLeft" || q.code === "ShiftRight" || q.key === "Shift") {
              if (Ga.current.endPebbleAim) {
                Ga.current.endPebbleAim();
              }
            }
            const F = Gr(q.code, q.key);
            F && (Ae.current[F] = !1);
          },
          Q = () => {
            ((g.current = {}),
              (pebbleKeyRef.current = { pressedAt: 0, aiming: !1, angle: void 0 }),
              (Ae.current = { up: !1, down: !1, left: !1, right: !1 }));
          };
        return (
          window.addEventListener("keydown", E),
          window.addEventListener("keyup", D),
          window.addEventListener("blur", Q),
          () => {
            (window.removeEventListener("keydown", E),
              window.removeEventListener("keyup", D),
              window.removeEventListener("blur", Q));
          }
        );
      }, []),
      J.useEffect(() => {
        const E = t.current;
        if (!E) return;
        const D = E.getContext("2d", { alpha: !1 });
        if (!D) return;
        const Q = o.current,
          q = new Ws(D, Q);
        u.current = q;
        let F,
          ie = 0;
        const ge = () => {
          const vv = window.visualViewport,
            Je = Math.min(window.devicePixelRatio || 1, 2),
            he = Math.floor(vv ? vv.width : window.innerWidth),
            $e = Math.floor(vv ? vv.height : window.innerHeight);
          ((E.width = Math.floor(he * Je)),
            (E.height = Math.floor($e * Je)),
            (E.style.width = `${he}px`),
            (E.style.height = `${$e}px`),
            D.setTransform(Je, 0, 0, Je, 0, 0));
        };
        (window.addEventListener("resize", ge),
          window.visualViewport && window.visualViewport.addEventListener("resize", ge),
          ge());
        let re = null;
        const me = {};
        let ce = -999999,
          Re = -999999;
        const Ce = (Je, he = !1) => {
          const $e = l.current;
          if (!$e) return;
          const da = $e.getContext("2d");
          if (!da) return;
          const Ye = Math.floor(Je.x / Q.tileSize),
            Ge = Math.floor(Je.y / Q.tileSize);
          if (!he && Ye === ce && Ge === Re && re) return;
          ((ce = Ye), (Re = Ge));
          const Pe = $e.width,
            aa = $e.height;
          (!re || re.width !== Pe || re.height !== aa) &&
            (re = da.createImageData(Pe, aa));
          const Ke = re.data,
            De = Pe / 2,
            qe = aa / 2;
          for (let Ze = 0; Ze < aa; Ze += 2)
            for (let sa = 0; sa < Pe; sa += 2) {
              const Pa = Ye + Math.floor((sa - De) * 0.9),
                va = Ge + Math.floor((Ze - qe) * 0.9),
                tileAt = Q.getTile(Pa, va),
                rt = tileAt.isCliffWall
                  ? "#1e293b"
                  : tileAt.isPortBoatDeck
                    ? "#b45309"
                    : tileAt.isPortPier
                      ? "#78350f"
                      : tileAt.isPortCityWall
                        ? "#f8fafc"
                        : tileAt.biome.groundColor;
              let ka = me[rt];
              ka ||
                ((ka = [
                  parseInt(rt.slice(1, 3), 16) || 70,
                  parseInt(rt.slice(3, 5), 16) || 120,
                  parseInt(rt.slice(5, 7), 16) || 60,
                ]),
                (me[rt] = ka));
              const ht = ka[0],
                ho = ka[1],
                Jt = ka[2];
              for (let eo = 0; eo < 2; eo++)
                for (let Rt = 0; Rt < 2; Rt++) {
                  const ft = ((Ze + eo) * Pe + (sa + Rt)) * 4;
                  ((Ke[ft] = ht),
                    (Ke[ft + 1] = ho),
                    (Ke[ft + 2] = Jt),
                    (Ke[ft + 3] = 255));
                }
            }
          da.putImageData(re, 0, 0);
          // 🧭 Bússola e Marcador da Escadaria do Calabouço no Minimapa (Modo Desenvolvedor)
          if (
            window.__devMode &&
            Q.isUnderground &&
            typeof Q.getDungeonEntranceStairForBiome === "function"
          ) {
            const isL2 = Q.undergroundLevel === 2;
            const stair = isL2 ? (Q.activeDungeonStairCoords || Q.getDungeonEntranceStairForBiome(Ye, Ge)) : Q.getDungeonEntranceStairForBiome(Ye, Ge);
            if (stair) {
              const dx = stair.tx - Ye;
              const dy = stair.ty - Ge;
              const sx = De + dx / 0.9;
              const sy = qe + dy / 0.9;
              da.save();
              const isInside =
                sx >= 8 && sx <= Pe - 8 && sy >= 8 && sy <= aa - 8;
              if (isInside) {
                const pulse = (Math.sin(performance.now() * 0.007) + 1) * 0.5;
                da.strokeStyle = isL2 ? `rgba(251, 191, 36, ${0.55 + pulse * 0.45})` : `rgba(239, 68, 68, ${0.45 + pulse * 0.5})`;
                da.lineWidth = 2.0;
                da.beginPath();
                da.arc(sx, sy, 5.5 + pulse * 3.5, 0, Math.PI * 2);
                da.stroke();

                da.fillStyle = isL2 ? "#fbbf24" : "#ef4444";
                da.beginPath();
                da.arc(sx, sy, 3.8, 0, Math.PI * 2);
                da.fill();

                da.fillStyle = "#ffffff";
                da.beginPath();
                da.arc(sx, sy, 1.8, 0, Math.PI * 2);
                da.fill();
              } else {
                const angle = Math.atan2(dy, dx);
                const edgeR = Math.min(De, qe) - 6;
                const bx = De + Math.cos(angle) * edgeR;
                const by = qe + Math.sin(angle) * edgeR;

                da.save();
                da.translate(bx, by);
                da.rotate(angle);
                da.fillStyle = "#ef4444";
                da.beginPath();
                da.moveTo(5.5, 0);
                da.lineTo(-4.5, -4);
                da.lineTo(-2, 0);
                da.lineTo(-4.5, 4);
                da.closePath();
                da.fill();
                da.restore();
              }
              da.restore();
            }
          }
        };
        c.current.setAudio(m.current);
        let ze = 0,
          la = performance.now(),
          na = performance.now();
        let __nt = 0;
        const ia = (Je) => {
          const __cap = window.__rpgFpsCap === void 0 ? 60 : window.__rpgFpsCap;
          if (__cap > 0) {
            const __iv = 1e3 / __cap;
            if (Je < __nt - 2) {
              F = requestAnimationFrame(ia);
              return;
            }
            __nt = Je > __nt + __iv ? Je + __iv : __nt + __iv;
          }
          var Jt, eo, Rt, ft;
          const he = f.current,
            $e = g.current,
            da = y.current,
            Ye = Math.min(0.1, (Je - la) / 1e3);
          if (!cyclePausedRef.current && Ye > 0) {
            const activeCycleSec = Math.max(5, Number(cycleDurationRef.current) || 1200);
            const previousTime = timeOfDayRef.current;
            const nextTime = (timeOfDayRef.current + Ye / activeCycleSec) % 1;
            if (nextTime < previousTime) nightCountRef.current += 1;
            timeOfDayRef.current = nextTime;
            Q.setTimeState(nextTime, nightCountRef.current);
            if (rr.current) rr.current.timeOfDay = nextTime;
          }
          const isHoldingPebble = pebbleKeyRef.current.pressedAt > 0;
          const isPebbleItem = (item) => {
            const name = (item?.name || "").toLowerCase();
            const id = (item?.id || "").toLowerCase();
            return name.includes("seixo") || id.includes("seixo") || id.includes("pebble");
          };
          const isSlingshotItem = (item) => {
            const name = (item?.name || "").toLowerCase();
            const id = (item?.id || "").toLowerCase();
            return name.includes("estilingue") || id.includes("estilingue") || id.includes("slingshot");
          };
          const handHasPebble = [Da.current.mao_esquerda, Da.current.mao_direita].some(isPebbleItem);
          const handHasSlingshot = [Da.current.mao_esquerda, Da.current.mao_direita].some(isSlingshotItem);
          const hasPebbleInPack = Zt.current.some(isPebbleItem);
          const canAimPebble = handHasPebble || (handHasSlingshot && hasPebbleInPack);
          const maxAimDist = handHasSlingshot ? 660 : 330;
          const aimHeld = isHoldingPebble && canAimPebble && !pebbleKeyRef.current.cancelled;
          he.isAiming = !!aimHeld;
          he.hasSlingshotAim = !!handHasSlingshot;
          if (aimHeld) {
            if (pebbleKeyRef.current.angle !== void 0) {
              he.aimAngle = pebbleKeyRef.current.angle;
              if (pebbleKeyRef.current.distance !== void 0) {
                he.aimDistance = pebbleKeyRef.current.distance;
              }
            } else if (mouseScreenPos.current.active && E) {
              const rect = E.getBoundingClientRect();
              const zoom = Ka.current || 1;
              const playerScreenX = rect.left + rect.width / 2 - Oa.current.x * zoom;
              const playerScreenY = rect.top + rect.height / 2 - Oa.current.y * zoom;
              const dx = mouseScreenPos.current.x - playerScreenX;
              const dy = mouseScreenPos.current.y - playerScreenY;
              const screenDist = Math.hypot(dx, dy);
              if (screenDist > 6) {
                he.aimAngle = Math.atan2(dy, dx);
                const worldDist = screenDist / zoom;
                he.aimDistance = Math.max(35, Math.min(maxAimDist, worldDist));
              }
            }
            const aimX = ($e.KeyD || $e.ArrowRight || da.right ? 1 : 0) - ($e.KeyA || $e.ArrowLeft || da.left ? 1 : 0);
            const aimY = ($e.KeyS || $e.ArrowDown || da.down ? 1 : 0) - ($e.KeyW || $e.ArrowUp || da.up ? 1 : 0);
            if ((aimX !== 0 || aimY !== 0) && !mouseScreenPos.current.active && pebbleKeyRef.current.angle === void 0) {
              he.aimAngle = Math.atan2(aimY, aimX);
            }
            if (he.aimAngle === void 0) {
              he.aimAngle = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 }[he.direction] || 0;
            }
            if (he.aimDistance === void 0) {
              he.aimDistance = maxAimDist;
            }
          } else {
            he.aimDistance = void 0;
          }
          ((la = Je),
            he.attackTimer &&
              he.attackTimer > 0 &&
              ((he.attackTimer = Math.max(0, he.attackTimer - Ye)),
              he.attackTimer === 0 && (he.attackAngle = void 0)));
          if (he.paralyzedTimer && he.paralyzedTimer > 0) {
            he.paralyzedTimer = Math.max(0, he.paralyzedTimer - Ye);
            if (he.isAiming) {
              cancelPebbleAim();
            }
          }
          const Ge = Math.floor(he.x / Q.tileSize),
            Pe = Math.floor(he.y / Q.tileSize),
            aa = Q.getTile(Ge, Pe),
            Ke = rr.current.timeOfDay ?? 0.5,
            De = Ks(Da.current),
            qe = Da.current,
            isRainingSurface = !!(
              !Q.isUnderground &&
              typeof window !== "undefined" &&
              window.weatherSystem &&
              typeof window.weatherSystem.isWetWeather === "function" &&
              window.weatherSystem.isWetWeather()
            ),
            Ze = !!(
              !isRainingSurface &&
              ((qe.mao_esquerda != null &&
                ((qe.mao_esquerda.id && qe.mao_esquerda.id.includes("torch")) ||
                  (qe.mao_esquerda.name &&
                    qe.mao_esquerda.name.toLowerCase().includes("tocha")))) ||
                (qe.mao_direita != null &&
                  ((qe.mao_direita.id && qe.mao_direita.id.includes("torch")) ||
                    (qe.mao_direita.name &&
                      qe.mao_direita.name.toLowerCase().includes("tocha"))))) &&
              (rr.current ? rr.current.lanternActive : !0)
            ),
            sa = Q.isNearLitCampfire(he.x, he.y, 190);
          (isRainingSurface && rr.current && rr.current.lanternActive && ((rr.current.lanternActive = !1), z(!1)),
            (he.hasTorch = Ze),
            (he.isNearCampfire = sa),
            (he.fireProtected = Ze || sa),
            he.fireProtected !== we.current &&
              ((we.current = !!he.fireProtected), Fe(!!he.fireProtected)));
          const rawCampfire = Q.getNearbyCampfire(he.x, he.y, 90);
          let Pa = rawCampfire;
          if (rawCampfire) {
            const cpX = rawCampfire.tx * Q.tileSize + Q.tileSize / 2 + (rawCampfire.prop.offsetX || 0);
            const cpY = rawCampfire.ty * Q.tileSize + Q.tileSize / 2 + (rawCampfire.prop.offsetY || 0);
            const cdx = cpX - he.x;
            const cdy = cpY - he.y;
            const pFDir = he.direction || he.facing || "down";
            const cfDx = pFDir === "left" ? -1 : pFDir === "right" ? 1 : 0;
            const cfDy = pFDir === "up" ? -1 : pFDir === "down" ? 1 : 0;
            const cDot = cdx * cfDx + cdy * cfDy;
            // Se a fogueira estiver claramente nas costas do personagem (cDot < -16), não foca nela
            if (cDot < -16) {
              Pa = null;
            }
          }
          const va = Ue.current;
          if (
            (Pa
              ? (!va ||
                  va.tx !== Pa.tx ||
                  va.ty !== Pa.ty ||
                  va.prop.scale !== Pa.prop.scale ||
                  va.prop.lit !== Pa.prop.lit ||
                  va.prop.fireLevel !== Pa.prop.fireLevel ||
                  va.prop.sticksFed !== Pa.prop.sticksFed ||
                  va.prop.roastingFish !== Pa.prop.roastingFish) &&
                ((Ue.current = Pa), xe(Pa))
              : va && ((Ue.current = null), xe(null)),
            (() => {
              const currentLogPile = Q.getNearbyWoodLogPile ? Q.getNearbyWoodLogPile(he.x, he.y, 90, 5) : null,
                prevLogPile = nearbyLogPileRef.current;
              if (
                currentLogPile
                  ? (!prevLogPile ||
                      prevLogPile.tx !== currentLogPile.tx ||
                      prevLogPile.ty !== currentLogPile.ty ||
                      (prevLogPile.prop && prevLogPile.prop.count) !== (currentLogPile.prop && currentLogPile.prop.count)) &&
                    ((nearbyLogPileRef.current = currentLogPile), setNearbyLogPile(currentLogPile))
                  : prevLogPile && ((nearbyLogPileRef.current = null), setNearbyLogPile(null))
              );
            })(),
            typeof window !== "undefined" &&
              window.weatherSystem &&
              typeof window.weatherSystem.update === "function" &&
              (window.weatherSystem.setAudio(m.current),
              window.weatherSystem.update(
                Ye,
                he,
                Q,
                c.current,
                aa.biome.id,
              )),
            Q &&
              typeof Q.updateRainExtinguishCampfires === "function" &&
              Q.updateRainExtinguishCampfires(
                Ye,
                isRainingSurface,
                ee.current,
                he.x,
                he.y,
                ve,
              ),
            c.current.update(
              Ye,
              he,
              Q.isUnderground,
              aa.biome.id,
              Ke,
              De.defense,
            ),
            he.hp !== void 0 &&
              (he.hp !== W.current || !!he.isDead !== le.current) &&
              ((W.current = he.hp),
              (le.current = !!he.isDead),
              Ee(he.hp),
              de(!!he.isDead)),
            he.isDead)
          )
            ((he.isMoving = !1), (he.vx = 0), (he.vy = 0));
          else {
            const isCurrentlyDodging = !!(he.dodgeTimer && he.dodgeTimer > 0);
            if (isCurrentlyDodging) {
              he.dodgeTimer = Math.max(0, he.dodgeTimer - Ye);
              const dDur = he.dodgeDuration || 0.25,
                dProg = Math.max(0, Math.min(1, 1 - he.dodgeTimer / dDur)),
                dEase = 1 - Math.pow(1 - dProg, 2.45),
                dDelta = Math.max(0, dEase - (he.dodgeEasePrev || 0));
              he.dodgeEasePrev = dEase;
              const stepDist = dDelta * (he.dodgeDist || 58);
              if (stepDist > 0.001) {
                const _dSlide = Q.moveWithSlide(
                  he.x,
                  he.y,
                  (he.dodgeDX || 0) * stepDist,
                  (he.dodgeDY || 0) * stepDist,
                  !0,
                );
                he.x = _dSlide.x;
                he.y = _dSlide.y;
              }
              if (he.dodgeFacing) {
                he.direction = he.dodgeFacing;
              }
              if (he.dodgeTimer === 0) {
                const landTile = Q.getTile(
                  Math.floor(he.x / Q.tileSize),
                  Math.floor(he.y / Q.tileSize),
                );
                m.current.playFootstep && m.current.playFootstep(landTile.biome.hasWater);
              }
            }
            const isPlacingCabin = !!(cabinPlacementPreviewRef.current && cabinPlacementPreviewRef.current.active);
            if (isPlacingCabin) {
              const nowMs = performance.now();
              if (nowMs >= cabinMoveRepeatTimerRef.current) {
                const holdDir =
                  ($e.KeyW || $e.ArrowUp || $e.Up || da.up)
                    ? "up"
                    : ($e.KeyS || $e.ArrowDown || $e.Down || da.down)
                      ? "down"
                      : ($e.KeyA || $e.ArrowLeft || $e.Left || da.left)
                        ? "left"
                        : ($e.KeyD || $e.ArrowRight || $e.Right || da.right)
                          ? "right"
                          : null;
                if (holdDir && Ga.current.moveCabinPlacementPreview) {
                  Ga.current.moveCabinPlacementPreview(holdDir);
                  cabinMoveRepeatTimerRef.current = nowMs + 135;
                }
              }
            }
            const allowArrowWalk = !dodgeModeRef.current && !isPlacingCabin;
            let qa = 0,
              Xa = 0;
            (($e.KeyW || (allowArrowWalk && ($e.ArrowUp || $e.Up || da.up))) && (Xa -= 1),
              ($e.KeyS || (allowArrowWalk && ($e.ArrowDown || $e.Down || da.down))) && (Xa += 1),
              ($e.KeyA || (allowArrowWalk && ($e.ArrowLeft || $e.Left || da.left))) && (qa -= 1),
              ($e.KeyD || (allowArrowWalk && ($e.ArrowRight || $e.Right || da.right))) && (qa += 1),
              (isPlacingCabin || he.isAiming || isCurrentlyDodging || he.capturedByScorpionId) && ((qa = 0), (Xa = 0)),
              (he.isMoving = qa !== 0 || Xa !== 0));
            const za = 100 + (De.staminaBonus || 0);
            ((he.maxStamina = za), he.stamina === void 0 && (he.stamina = za));
            const It =
                (Ae.current.up && ($e.KeyW || $e.ArrowUp || $e.Up || da.up)) ||
                (Ae.current.down &&
                  ($e.KeyS || $e.ArrowDown || $e.Down || da.down)) ||
                (Ae.current.left &&
                  ($e.KeyA || $e.ArrowLeft || $e.Left || da.left)) ||
                (Ae.current.right &&
                  ($e.KeyD || $e.ArrowRight || $e.Right || da.right)),
              yn = It && he.isMoving,
              kl = 24,
              Ml = 30,
              vn = 18,
              wt = 0.25;
            if (yn && !he.isExhausted && he.stamina > 0)
              ((he.sprinting = !0),
                (he.stamina = Math.max(0, he.stamina - kl * Ye)),
                (fa.current = 0.45),
                he.stamina <= 0 &&
                  ((he.stamina = 0),
                  (he.isExhausted = !0),
                  (he.sprinting = !1),
                  m.current.playExhaustedSigh()));
            else if (((he.sprinting = !1), fa.current > 0))
              fa.current = Math.max(0, fa.current - Ye);
            else {
              const Hr = he.isMoving ? vn : Ml;
              ((he.stamina = Math.min(za, he.stamina + Hr * Ye)),
                he.isExhausted &&
                  he.stamina >= za * wt &&
                  (he.isExhausted = !1));
            }
            if (he.isExhausted && dodgeModeRef.current) {
              dodgeModeRef.current = !1;
              setDodgeMode(!1);
            }
            const ao = he.sprinting;
            ((Math.abs((He.current ?? 100) - he.stamina) >= 2 ||
              (he.stamina <= 0.5 && He.current > 0.5) ||
              (he.stamina >= za - 0.5 && He.current < za - 0.5) ||
              he.isExhausted !== oa.current ||
              he.sprinting !== ga.current ||
              za !== Sa.current) &&
              ((He.current = he.stamina),
              (oa.current = !!he.isExhausted),
              (ga.current = !!he.sprinting),
              (Sa.current = za),
              oe(he.stamina),
              X(za),
              I(!!he.isExhausted),
              Me(!!he.sprinting)),
              qa !== 0 && Xa !== 0 && ((qa *= 0.7071), (Xa *= 0.7071)),
              So.current && ((qa = 0), (Xa = 0)));
            const Xr = Math.floor(he.x / Q.tileSize),
              fr = Math.floor(he.y / Q.tileSize),
              wn = Q.getTile(Xr, fr),
              Si = wn.isPortPier || wn.isPortBoatDeck ? 1 : wn.biome.moveSpeedMultiplier,
              ki = 1 + (De.speedBonusPercent || 0) / 100,
              Fr = c.current.getPlayerSpeedMultiplier(),
              Cl = he.poisonTimer && he.poisonTimer > 0 ? 0.88 : 1,
              Tn = he.isExhausted ? 0.88 : 1,
              Sn = (ao ? he.speed * 1.6 : he.speed * Tn) * Si * ki * Fr * Cl;
            if (((he.isMoving = qa !== 0 || Xa !== 0), he.isMoving)) {
              const Hr = he.x + qa * Sn,
                Mi = he.y + Xa * Sn;
              ((() => {
                const _r = Q.moveWithSlide(
                  he.x,
                  he.y,
                  Hr - he.x,
                  Mi - he.y,
                  !0,
                );
                ((he.x = _r.x), (he.y = _r.y));
              })(),
                (he.walkCycle += ao ? 0.32 : 0.22),
                Math.abs(qa) > Math.abs(Xa)
                  ? (he.direction = qa > 0 ? "right" : "left")
                  : (he.direction = Xa > 0 ? "down" : "up"),
                Je - ie > (ao ? 240 : 340) &&
                  (m.current.playFootstep(wn.biome.hasWater), (ie = Je)));
            }
            if (he._pulledOutOfCaveByScorpion) {
              const pullOut = he._pulledOutOfCaveByScorpion;
              delete he._pulledOutOfCaveByScorpion;
              __autoCaveTimer.current = 1.4;
              m.current.playCaveExit();
              Q.exitCave(pullOut.tx, pullOut.ty);
              Oa.current = { x: 0, y: 0 };
              Et(!1);
              he.x = pullOut.x;
              he.y = pullOut.y;
              he.vx = 0;
              he.vy = 0;
              const qe_t = Math.floor(he.x / Q.tileSize),
                Ze_t = Math.floor(he.y / Q.tileSize),
                sa = Q.getTile(qe_t, Ze_t);
              v(sa.biome);
              S({ tx: qe_t, ty: Ze_t });
            } else if (__autoCaveTimer.current > 0) {
              __autoCaveTimer.current -= Ye;
            } else if (!he.capturedByScorpionId) {
              const autoC = Q.getNearbyCaveDoorwayAt(he.x, he.y);
              if (autoC) {
                __autoCaveTimer.current = 1.0;
                const oldX = he.x,
                  oldY = he.y;
                if (autoC.action === "enter_cave") {
                  (m.current.playCaveEnter(),
                    Q.enterCave(autoC.tx, autoC.ty, oldX, oldY),
                    (Oa.current = { x: 0, y: 0 }),
                    Et(!1),
                    (he.x = autoC.tx * Q.tileSize + 14),
                    (he.y = autoC.ty * Q.tileSize + 20),
                    (he.vx = 0),
                    (he.vy = 0),
                    (he.direction = "down"));
                  const trM =
                    c.current && c.current.transferChasingMonsters
                      ? c.current.transferChasingMonsters(
                          oldX,
                          oldY,
                          he.x,
                          he.y,
                          !0,
                        )
                      : 0;
                  const De = Q.getTile(autoC.tx, autoC.ty);
                  (v(De.biome),
                    S({ tx: autoC.tx, ty: autoC.ty }),
                    !!(
                      (qe.mao_esquerda != null &&
                        qe.mao_esquerda.id.includes("torch")) ||
                      (qe.mao_direita != null &&
                        qe.mao_direita.id.includes("torch")) ||
                      (qe.mao_esquerda != null &&
                        qe.mao_esquerda.name.toLowerCase().includes("tocha")) ||
                      (qe.mao_direita != null &&
                        qe.mao_direita.name.toLowerCase().includes("tocha"))
                    )
                      ? (z(!0),
                        m.current.playTorchIgnite())
                      : z(!1));
                  trM > 0 &&
                    ve(
                      `⚠️ ${trM === 1 ? "A criatura que te perseguia atravessou" : `${trM} criaturas que te perseguiam atravessaram`} a caverna com você!`,
                    );
                } else if (autoC.action === "exit_cave") {
                  m.current.playCaveExit();
                  const De = Q.exitCave(autoC.tx, autoC.ty);
                  ((Oa.current = { x: 0, y: 0 }),
                    Et(!1),
                    (he.x = De.x),
                    (he.y = De.y + 16),
                    (he.vx = 0),
                    (he.vy = 0),
                    (he.direction = "down"));
                  const trM =
                    c.current && c.current.transferChasingMonsters
                      ? c.current.transferChasingMonsters(
                          oldX,
                          oldY,
                          he.x,
                          he.y,
                          !1,
                        )
                      : 0;
                  const qe_t = Math.floor(he.x / Q.tileSize),
                    Ze_t = Math.floor(he.y / Q.tileSize),
                    sa = Q.getTile(qe_t, Ze_t);
                  (v(sa.biome),
                    S({ tx: qe_t, ty: Ze_t }),
                    ve(
                      `Emergindo de volta à superfície ensolarada [${qe_t}, ${Ze_t}]!`,
                    ));
                  trM > 0 &&
                    ve(
                      `⚠️ ${trM === 1 ? "A criatura que te perseguia atravessou" : `${trM} criaturas que te perseguiam atravessaram`} a saída com você!`,
                    );
                } else if (autoC.action === "enter_dungeon") {
                  m.current.playCaveEnter();
                  Q.enterDungeon(autoC.tx, autoC.ty, oldX, oldY);
                  Oa.current = { x: 0, y: 0 };
                  Et(!1);
                  he.x = autoC.tx * Q.tileSize + 14;
                  he.y = (autoC.ty + 1) * Q.tileSize + 14;
                  he.vx = 0;
                  he.vy = 0;
                  he.direction = "down";
                  const qe_t = Math.floor(he.x / Q.tileSize),
                    Ze_t = Math.floor(he.y / Q.tileSize);
                  v(Q.getTile(qe_t, Ze_t).biome);
                  S({ tx: qe_t, ty: Ze_t });
                } else if (autoC.action === "exit_dungeon") {
                  m.current.playCaveExit();
                  const targetTx =
                      autoC.prop?.targetTx !== undefined ? autoC.prop.targetTx : autoC.tx,
                    targetTy =
                      autoC.prop?.targetTy !== undefined ? autoC.prop.targetTy : autoC.ty;
                  const De = Q.exitDungeon(targetTx, targetTy);
                  Oa.current = { x: 0, y: 0 };
                  Et(!1);
                  he.x = De.x;
                  he.y = De.y;
                  he.vx = 0;
                  he.vy = 0;
                  he.direction = "down";
                  const qe_t = Math.floor(he.x / Q.tileSize),
                    Ze_t = Math.floor(he.y / Q.tileSize);
                  v(Q.getTile(qe_t, Ze_t).biome);
                  S({ tx: qe_t, ty: Ze_t });
                } else if (autoC.action === "enter_geode") {
                  m.current.playCaveEnter();
                  Q.enterGeode(autoC.tx, autoC.ty, oldX, oldY);
                  Oa.current = { x: 0, y: 0 };
                  Et(!1);
                  he.x = autoC.tx * Q.tileSize + Q.tileSize / 2;
                  he.y = (autoC.ty - 2) * Q.tileSize + Q.tileSize / 2;
                  he.vx = 0;
                  he.vy = 0;
                  he.direction = "up";
                  const qe_t = Math.floor(he.x / Q.tileSize),
                    Ze_t = Math.floor(he.y / Q.tileSize);
                  v(Q.getTile(qe_t, Ze_t).biome);
                  S({ tx: qe_t, ty: Ze_t });
                } else if (autoC.action === "exit_geode") {
                  m.current.playCaveExit();
                  const targetTx =
                      autoC.prop?.targetTx !== undefined ? autoC.prop.targetTx : autoC.tx,
                    targetTy =
                      autoC.prop?.targetTy !== undefined ? autoC.prop.targetTy : autoC.ty;
                  const De = Q.exitGeode(targetTx, targetTy);
                  Oa.current = { x: 0, y: 0 };
                  Et(!1);
                  he.x = De.x;
                  he.y = De.y;
                  he.vx = 0;
                  he.vy = 0;
                  he.direction = "down";
                  const qe_t = Math.floor(he.x / Q.tileSize),
                    Ze_t = Math.floor(he.y / Q.tileSize);
                  v(Q.getTile(qe_t, Ze_t).biome);
                  S({ tx: qe_t, ty: Ze_t });
                }
              }
            }
          }
          if (!window.__devMode) {
            Oa.current.x = 0;
            Oa.current.y = 0;
            Ka.current = 1;
          }
          const Nt = { x: he.x + Oa.current.x, y: he.y + Oa.current.y },
            rt = window.__devMode ? Ka.current : 1,
            ka = { ...rr.current, zoom: rt },
            ht = window.innerWidth,
            ho = window.innerHeight;
          if ((q.render(he, ht, ho, ka, Nt), ze++, ze % 10 === 0)) {
            (A(timeOfDayRef.current),
              Ce(he),
              (Ge !== je.current.tx || Pe !== je.current.ty) &&
                ((je.current = { tx: Ge, ty: Pe }), S({ tx: Ge, ty: Pe })),
              aa.biome.id !== Be.current &&
                ((Be.current = aa.biome.id), v(aa.biome)));
            let qa = null;
            for (let za = -1; za <= 1; za++) {
              for (let It = -1; It <= 1; It++) {
                const $o = Q.getTile(Ge + za, Pe + It);
                if ($o.biome.hasWater) {
                  qa = { tx: Ge + za, ty: Pe + It, biomeName: $o.biome.namePt };
                  break;
                }
              }
              if (qa) break;
            }
            const Xa = ma.current;
            ((!Xa && qa) ||
              (Xa && !qa) ||
              (Xa && qa && (Xa.tx !== qa.tx || Xa.ty !== qa.ty))) &&
              ((ma.current = qa), Aa(qa));
          }
          (Je - na > 1e4 && ((na = Je), Q.pruneTileCache(Ge, Pe, 75, 2400)),
            (F = requestAnimationFrame(ia)));
        };
        return (
          (F = requestAnimationFrame(ia)),
          () => {
            (cancelAnimationFrame(F), window.removeEventListener("resize", ge));
          }
        );
      }, []),
      J.useEffect(() => {
        const E = t.current;
        if (!E) return;
        let D = 0,
          Q = 0,
          q = 0,
          F = 0,
          ie = !1,
          ge = 0,
          re = 1,
          me = 0;
        // 🍲 Toque/clique na panela que está no fogo -> abre o modal de ingredientes (igual à tecla R)
        const tapPot = (cx, cy) => {
          const Kr = E.getBoundingClientRect(),
            zz = Ka.current,
            pl = f.current,
            wx = (cx - Kr.left - E.width / 2) / zz + pl.x + Oa.current.x,
            wy = (cy - Kr.top - E.height / 2) / zz + pl.y + Oa.current.y,
            cf = o.current.getNearbyCampfire(wx, wy, Math.max(55, 30 / zz));
          if (cf && cf.prop && cf.prop.cookingPot) {
            Ga.current.handleCookingPot();
            return !0;
          }
          return !1;
        };
        const ce = (Pe) => {
            if (Pe.touches.length === 1) {
              ((ie = !0),
                (D = Pe.touches[0].clientX),
                (Q = Pe.touches[0].clientY),
                (q = Oa.current.x),
                (F = Oa.current.y));
              if (window.__devMode) {
                const aa = Date.now();
                (aa - me < 320 && Oo(), (me = aa));
              }
            } else if (Pe.touches.length === 2 && window.__devMode) {
              ((ie = !1),
                (ge = Math.hypot(
                  Pe.touches[0].clientX - Pe.touches[1].clientX,
                  Pe.touches[0].clientY - Pe.touches[1].clientY,
                )),
                (re = Ka.current));
            }
          },
          Re = (Pe) => {
            if (!window.__devMode) return;
            if (Pe.touches.length === 1 && ie) {
              const aa = Pe.touches[0].clientX - D,
                Ke = Pe.touches[0].clientY - Q,
                De = Ka.current;
              ((Oa.current.x = q - aa / De),
                (Oa.current.y = F - Ke / De),
                Math.hypot(Oa.current.x, Oa.current.y) > 15 && Et(!0),
                Pe.cancelable && Pe.preventDefault());
            } else if (Pe.touches.length === 2 && ge > 0) {
              const Ke =
                  Math.hypot(
                    Pe.touches[0].clientX - Pe.touches[1].clientX,
                    Pe.touches[0].clientY - Pe.touches[1].clientY,
                  ) / ge,
                De = Math.min(2.5, Math.max(0.25, +(re * Ke).toFixed(2)));
              (V(De), (Ka.current = De), Pe.cancelable && Pe.preventDefault());
            }
          },
          Ce = (Pe) => {
            const wasPan = ie,
              tp = Pe && Pe.type === "touchend" && Pe.changedTouches && Pe.changedTouches[0];
            ((ie = !1), (ge = 0));
            if (
              wasPan &&
              tp &&
              Pe.touches.length === 0 &&
              Math.hypot(tp.clientX - D, tp.clientY - Q) < 10 &&
              tapPot(tp.clientX, tp.clientY)
            )
              Pe.cancelable && Pe.preventDefault();
          };
        let ze = !1,
          la = 0,
          na = 0,
          ia = 0,
          Je = 0;
        const he = (Pe) => {
            if (Pe.button === 0) {
              mouseScreenPos.current = { x: Pe.clientX, y: Pe.clientY, active: !0 };
              const Ke = E.getBoundingClientRect();
              const De = Pe.clientX - Ke.left;
              const qe = Pe.clientY - Ke.top;
              const dx = De - E.width / 2;
              const dy = qe - E.height / 2;
              const angle = Math.atan2(dy, dx);
              const sa = f.current;
              if (sa && !sa.isDead) {
                sa.direction = angle > Math.PI * 0.25 && angle < Math.PI * 0.75 ? "down" : angle < -Math.PI * 0.25 && angle > -Math.PI * 0.75 ? "up" : angle >= 0 ? "right" : "left";
                sa.attackAngle = angle;
                Sl();
              }
              ze = !0;
              la = Pe.clientX;
              na = Pe.clientY;
              ia = Oa.current.x;
              Je = Oa.current.y;
            } else if (Pe.button === 1) {
              Pe.preventDefault();
              handleExtraAction();
            } else if (Pe.button === 2) {
              Pe.preventDefault();
              mouseScreenPos.current = { x: Pe.clientX, y: Pe.clientY, active: !0 };
              const Ke = E.getBoundingClientRect();
              const zoom = Ka.current || 1;
              const playerScreenX = Ke.left + Ke.width / 2 - Oa.current.x * zoom;
              const playerScreenY = Ke.top + Ke.height / 2 - Oa.current.y * zoom;
              const dx = Pe.clientX - playerScreenX;
              const dy = Pe.clientY - playerScreenY;
              const angle = Math.atan2(dy, dx);
              const worldDist = Math.hypot(dx, dy) / zoom;
              const hasSlingshot = [Da.current.mao_esquerda, Da.current.mao_direita].some((it) => {
                const nm = (it?.name || "").toLowerCase(), idv = (it?.id || "").toLowerCase();
                return nm.includes("estilingue") || idv.includes("estilingue") || idv.includes("slingshot");
              });
              startPebbleAim(angle, Math.max(35, Math.min(hasSlingshot ? 660 : 330, worldDist)));
            }
          },
          $e = (Pe) => {
            mouseScreenPos.current = { x: Pe.clientX, y: Pe.clientY, active: !0 };
            if (pebbleKeyRef.current.pressedAt && !pebbleKeyRef.current.cancelled) {
              const Ke = E.getBoundingClientRect();
              const zoom = Ka.current || 1;
              const playerScreenX = Ke.left + Ke.width / 2 - Oa.current.x * zoom;
              const playerScreenY = Ke.top + Ke.height / 2 - Oa.current.y * zoom;
              const dx = Pe.clientX - playerScreenX;
              const dy = Pe.clientY - playerScreenY;
              const angle = Math.atan2(dy, dx);
              const worldDist = Math.hypot(dx, dy) / zoom;
              const hasSlingshot = [Da.current.mao_esquerda, Da.current.mao_direita].some((it) => {
                const nm = (it?.name || "").toLowerCase(), idv = (it?.id || "").toLowerCase();
                return nm.includes("estilingue") || idv.includes("estilingue") || idv.includes("slingshot");
              });
              updatePebbleAim(angle, Math.max(35, Math.min(hasSlingshot ? 660 : 330, worldDist)));
            }
            if (!ze || !window.__devMode) return;
            const aa = Pe.clientX - la,
              Ke = Pe.clientY - na;
            if (Math.hypot(aa, Ke) > 4) {
              const De = Ka.current;
              ((Oa.current.x = ia - aa / De),
                (Oa.current.y = Je - Ke / De),
                Math.hypot(Oa.current.x, Oa.current.y) > 15 && Et(!0));
            }
          },
          da = (Pe) => {
            if (Pe.button === 2) {
              Pe.preventDefault();
              if (pebbleKeyRef.current.pressedAt) {
                const Ke = E.getBoundingClientRect();
                const zoom = Ka.current || 1;
                const playerScreenX = Ke.left + Ke.width / 2 - Oa.current.x * zoom;
                const playerScreenY = Ke.top + Ke.height / 2 - Oa.current.y * zoom;
                const dx = Pe.clientX - playerScreenX;
                const dy = Pe.clientY - playerScreenY;
                const angle = Math.atan2(dy, dx);
                const worldDist = Math.hypot(dx, dy) / zoom;
                const hasSlingshot = [Da.current.mao_esquerda, Da.current.mao_direita].some((it) => {
                  const nm = (it?.name || "").toLowerCase(), idv = (it?.id || "").toLowerCase();
                  return nm.includes("estilingue") || idv.includes("estilingue") || idv.includes("slingshot");
                });
                endPebbleAim(angle, Math.max(35, Math.min(hasSlingshot ? 660 : 330, worldDist)));
              }
              return;
            }
            if (!ze) return;
            if (((ze = !1), Math.hypot(Pe.clientX - la, Pe.clientY - na) < 6)) {
              tapPot(Pe.clientX, Pe.clientY);
            }
          },
          Ye = () => {
            if (!window.__devMode) return;
            Oo();
          },
          noContext = (Pe) => {
            Pe.preventDefault();
          },
          Ge = (Pe) => {
            Pe.preventDefault();
            if (!window.__devMode) return;
            const aa = Pe.deltaY < 0 ? 1.15 : 0.87;
            V((Ke) => {
              const De = Math.min(2.5, Math.max(0.25, +(Ke * aa).toFixed(2)));
              return ((Ka.current = De), De);
            });
          },
          handleAuxClickGlobal = (Pe) => {
            if (Pe.button === 1) {
              Pe.preventDefault();
              handleExtraAction();
            }
          };
        return (
          E.addEventListener("touchstart", ce, { passive: !1 }),
          E.addEventListener("touchmove", Re, { passive: !1 }),
          E.addEventListener("touchend", Ce),
          E.addEventListener("touchcancel", Ce),
          E.addEventListener("mousedown", he),
          E.addEventListener("auxclick", handleAuxClickGlobal),
          E.addEventListener("contextmenu", noContext),
          window.addEventListener("mousemove", $e),
          window.addEventListener("mouseup", da),
          window.addEventListener("auxclick", handleAuxClickGlobal),
          E.addEventListener("dblclick", Ye),
          E.addEventListener("wheel", Ge, { passive: !1 }),
          () => {
            (E.removeEventListener("touchstart", ce),
              E.removeEventListener("touchmove", Re),
              E.removeEventListener("touchend", Ce),
              E.removeEventListener("touchcancel", Ce),
              E.removeEventListener("mousedown", he),
              E.removeEventListener("auxclick", handleAuxClickGlobal),
              E.removeEventListener("contextmenu", noContext),
              window.removeEventListener("mousemove", $e),
              window.removeEventListener("mouseup", da),
              window.removeEventListener("auxclick", handleAuxClickGlobal),
              E.removeEventListener("dblclick", Ye),
              E.removeEventListener("wheel", Ge));
          }
        );
      }, [Oo, handleExtraAction]),
      h.jsxs("div", {
        ref: e,
        className: "relative w-full h-full overflow-hidden bg-slate-950",
        children: [
          h.jsx("canvas", {
            ref: t,
            id: "game-canvas",
            className:
              "block w-full h-full touch-none select-none " +
              (isDevModeActive ? "cursor-grab active:cursor-grabbing" : "cursor-default"),
          }),
          h.jsx(Hud, {
            currentBiome: w,
            coords: T,
            seed: p,
            timeOfDay: P,
            setTimeOfDay: setTimeOfDaySync,
            cycleDurationSec: cycleDurationSec,
            setCycleDurationSec: setCycleDurationSec,
            cyclePaused: cyclePaused,
            setCyclePaused: setCyclePaused,
            soundEnabled: x,
            setSoundEnabled: M,
            lanternActive: wl,
            setLanternActive: z,
            zoom: K,
            setZoom: V,
            showGrid: O,
            setShowGrid: _,
            onRerollSeed: mo,
            onTeleportToBiome: dt,
            onInteract: qo,
            onAttack: Sl,
            onThrowPebble: Rl,
            onPebbleAimStart: startPebbleAim,
            onPebbleAimEnd: endPebbleAim,
            onPebbleAimUpdate: updatePebbleAim,
            toastMessage: se,
            minimapRef: l,
            onMobileDirection: Bo,
            dodgeMode: dodgeMode,
            onExtraAction: handleExtraAction,
            isCameraOffset: At,
            onRecenterCamera: Oo,
            onToggleTorch: dr,
            onOpenInventory: Qt,
            inventoryItemCount: Ve.length,
            equipment: Oe,
            backpack: Ve,
            gold: ct,
            playerHp: N,
            playerMaxHp: ne,
            isDead: G,
            onRespawn: Tl,
            playerStamina: te,
            playerMaxStamina: Ne,
            isExhausted: C,
            isSprinting: be,
            isFireProtected: Te,
            nearbyCampfire: _e,
            nearbyLogPile: nearbyLogPile,
            cabinPlacementPreview: cabinPlacementPreview,
            onBuildCabin: handleBuildCabin,
            onCancelCabinPlacement: cancelCabinPlacementPreview,
            onFeedCampfire: Yr,
            onRoastFish: Mo,
            onCookingPot: kG,
            savedCampfire: $a,
            onUseBeltSlot: Ur,
            worldEngine: o.current,
            devMode:
              typeof (props && props.devMode) === "boolean"
                ? props.devMode
                : Boolean(window.__devMode),
          }),
          h.jsx(InventoryModal, {
            isOpen: qr,
            onClose: Qt,
            equipment: Oe,
            backpack: Ve,
            onEquipItem: ir,
            onUnequipSlot: Vr,
            onUseConsumable: lc,
            onFuseItems: ic,
            gold: ct,
            nearbyCampfire: _e,
            onFeedCampfire: Yr,
            onRoastFish: Mo,
            onCookingPot: zK,
            onOpenCookingModal: () => setCookingModalOpen(!0),
            onButcherCarcass: bn,
            onPlaceWoodLog: handlePlaceWoodLog,
            onDropItem: rc,
            onMoveToBeltSlot: gn,
            onInvertBeltSlot: Ur,
            currentBiome: w,
            onTeleportToBiome: dt,
            devMode:
              typeof (props && props.devMode) === "boolean"
                ? props.devMode
                : Boolean(window.__devMode),
            onDevAddItem: (item, count = 1) => {
              if (!Da.current.mochila || Da.current.mochila.id !== "item_mochila_reforcada") {
                const devBackpack = {
                  id: "item_mochila_reforcada",
                  name: "Mochila de Couro Reforçada",
                  icon: "🎒",
                  color: "#6366f1",
                  slot: "mochila",
                  categoryType: "equipment",
                  isEquippable: true,
                  rarity: "raro",
                  description: "Mochila resistente com múltiplos compartimentos (+15 slots extras).",
                  value: 120,
                };
                Wa((prevEq) => ({ ...prevEq, mochila: devBackpack }));
                Da.current.mochila = devBackpack;
              }
              const maxSlots = 21;
              const isStackable =
                item.stackCount !== undefined ||
                item.categoryType === "material" ||
                item.categoryType === "consumable";
              const baseId = (item.id || "item").replace(/^dev_/, "");
              ra((prev) => {
                const idx = prev.findIndex((i) => i.name === item.name);
                if (idx >= 0 && isStackable) {
                  const next = [...prev];
                  next[idx] = {
                    ...next[idx],
                    stackCount: (next[idx].stackCount || 1) + count,
                  };
                  return next;
                }
                const newItem = {
                  ...item,
                  id: `item_${baseId}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                  stackCount: count,
                };
                if (prev.length >= maxSlots) {
                  return [...prev.slice(1), newItem];
                }
                return [...prev, newItem];
              });
              ve(`🎒 [DEV] +${count}x ${item.name} no inventário comum!`);
              m.current && m.current.playChestChime && m.current.playChestChime();
            },
            onDevEquipItem: (item) => {
              if (item.isEquippable && item.slot) {
                const baseId = (item.id || "item").replace(/^dev_/, "");
                const newItem = {
                  ...item,
                  id: `eq_${baseId}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                  stackCount: 1,
                };
                const isTorch =
                  (newItem.id || "").toLowerCase().includes("torch") ||
                  (newItem.name || "").toLowerCase().includes("tocha");
                if (isTorch) {
                  z(!0);
                }
                Wa((prev) => {
                  const oldItem = prev[item.slot];
                  if (oldItem) {
                    const oldIsTorch =
                      (oldItem.id || "").toLowerCase().includes("torch") ||
                      (oldItem.name || "").toLowerCase().includes("tocha");
                    if (oldIsTorch && !isTorch) {
                      z(!1);
                    }
                    ra((bp) => {
                      const idx = bp.findIndex((i) => i.name === oldItem.name);
                      if (idx !== -1 && (oldItem.stackCount !== void 0 || (oldItem.name || "").toLowerCase().includes("galho"))) {
                        const nextBp = [...bp];
                        nextBp[idx] = { ...nextBp[idx], stackCount: (nextBp[idx].stackCount || 1) + 1 };
                        return nextBp;
                      }
                      return [...bp, oldItem];
                    });
                  }
                  return { ...prev, [item.slot]: newItem };
                });
                ve(`⚡ [DEV] Equipou: ${item.name}!`);
                m.current && m.current.playEquipItem && m.current.playEquipItem();
              }
            },
            onDevAddGold: (amount) => {
              _t((prevGold) => prevGold + amount);
              ve(`🛠️ [DEV] +${amount} Ouro adicionado!`);
              m.current && m.current.playCoinPickup && m.current.playCoinPickup();
            },
            onDevClearBackpack: () => {
              ra([]);
              ve("🛠️ [DEV] Mochila esvaziada!");
            },
            onDevEquipBackpack: () => {
              const mochilaItem = {
                id: `dev_backpack_${Date.now()}`,
                name: "Mochila de Couro Reforçada",
                slot: "mochila",
                isEquippable: true,
                categoryType: "equipment",
                rarity: "incomum",
                description:
                  "Mochila reforçada com correias resistentes. Concede +15 slots de itens (+15 slots anil, total 21)!",
                stats: { defense: 3, staminaBonus: 35 },
                icon: "Briefcase",
                color: "#6366f1",
                value: 90,
              };
              Wa((prev) => ({ ...prev, mochila: mochilaItem }));
              ve("🛠️ [DEV] Mochila de Couro Reforçada (+15 slots) equipada!");
              m.current && m.current.playEquipItem && m.current.playEquipItem();
            },
          }),
          cookingModalOpen &&
            (() => {
              const E = o.current,
                D = f.current;
              let potState = null;
              if (E && D) {
                const Q = E.getNearbyCampfire(D.x, D.y, 140);
                if (Q && Q.prop.cookingPot) potState = Q.prop.cookingPot;
              }
              if (!potState) {
                setTimeout(() => setCookingModalOpen(!1), 50);
                return null;
              }
              const elapsed = Date.now() - potState.startTime,
                ready = elapsed >= 45e3,
                remain = Math.max(0, Math.ceil((45e3 - elapsed) / 1e3)),
                contents = potState.ingredients || [],
                potName = (potState.potItem || {}).name || "Panela",
                isBig = String(potName).toLowerCase().includes("caldeir"),
                slots = 6;
              return h.jsx("div", {
                className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",
                onClick: () => setCookingModalOpen(!1),
                children: h.jsxs("div", {
                  className: "w-full max-w-2xl rounded-2xl border border-orange-500/40 bg-slate-950/95 p-4 shadow-2xl flex flex-col md:flex-row gap-4",
                  onClick: (ev) => ev.stopPropagation(),
                  children: [
                    // ESQUERDA: inventario completo sem filtros
                    h.jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        h.jsxs("div", {
                          className: "text-xs font-bold text-amber-300 uppercase tracking-wider mb-2",
                          children: ["🎒 Mochila — clique para colocar dentro (até ", slots, ")"],
                        }),
                        h.jsx("div", {
                          className: "max-h-64 overflow-y-auto grid grid-cols-2 gap-1.5 pr-1",
                          children: Ve.length === 0
                            ? h.jsx("div", { className: "col-span-2 text-slate-500 text-xs py-4 text-center", children: "Mochila vazia." })
                            : Ve.map((it) =>
                                h.jsxs("button", {
                                  className:
                                    "flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/80 hover:bg-slate-800 hover:border-orange-500/60 px-2 py-1.5 text-left transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                                  disabled: contents.length >= slots,
                                  onClick: () => wK(it),
                                  children: [
                                    h.jsx(ItemIcon, { item: it, size: 28 }),
                                    h.jsxs("span", {
                                      className: "min-w-0",
                                      children: [
                                        h.jsx("span", { className: "block text-[11px] font-semibold text-slate-100 truncate", children: it.name }),
                                        h.jsx("span", { className: "block text-[9px] text-slate-400", children: `x${it.stackCount || 1}` }),
                                      ],
                                    }),
                                  ],
                                }, it.id || it.name),
                              ),
                        }),
                      ],
                    }),
                    // DIREITA: visual do caldeirao/panela com os slots
                    h.jsxs("div", {
                      className: "w-full md:w-64 shrink-0 flex flex-col items-center gap-2 rounded-xl border border-orange-800/50 bg-gradient-to-b from-slate-900 to-orange-950/40 p-3",
                      children: [
                        h.jsx("div", { className: "text-base font-extrabold text-orange-200", children: [potState.potItem ? h.jsx(ItemIcon, { item: potState.potItem, size: 26, className: "align-middle mr-1.5" }) : (isBig ? "🍲 " : "🍳 "), potName] }),
                        h.jsx("div", { className: "text-[10px] text-slate-300", children: potState.hasWater ? "💧 Com água (cozido)" : "🔥 Vazia (fritura)" }),
                        h.jsx("div", {
                          className: "grid grid-cols-3 gap-1.5 w-full",
                          children: Array.from({ length: slots }).map((_, i) => {
                            const ing = contents[i];
                            return h.jsxs("div", {
                              className:
                                "h-14 rounded-lg border flex flex-col items-center justify-center text-center p-1 " +
                                (ing
                                  ? "border-amber-500/70 bg-amber-900/40"
                                  : "border-dashed border-slate-600/60 bg-slate-900/40"),
                              children: [
                                ing
                                  ? h.jsx(ItemIcon, { item: ing, size: 28 })
                                  : h.jsx("span", { className: "text-lg leading-none", children: "＋" }),
                                ing
                                  ? h.jsx("span", { className: "text-[8px] text-amber-100 truncate max-w-full mt-0.5", children: ing.name })
                                  : h.jsx("span", { className: "text-[8px] text-slate-500 mt-0.5", children: "vazio" }),
                              ],
                            }, i);
                          }),
                        }),
                        ready
                          ? h.jsxs("div", { className: "text-[11px] font-bold text-green-400 animate-pulse", children: ["✅ PRONTO! ", contents.length > 0 ? "Recolha a refeição:" : "(panela só com água/vazia — recolha de volta)"] })
                          : h.jsxs("div", { className: "text-[11px] text-amber-300", children: ["⏳ Cozinhando… faltam ", remain, "s"] }),
                        h.jsxs("div", { className: "flex flex-col gap-1.5 w-full mt-1", children: [
                          h.jsxs("button", {
                            className:
                              "py-2 rounded-xl text-xs font-bold transition cursor-pointer " +
                              (ready
                                ? "bg-green-600 hover:bg-green-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"),
                            onClick: () => {
                              qo();
                              setCookingModalOpen(!1);
                            },
                            children: [ready ? "🍽️ Recolher Prato Pronto" : `⏳ Aguardar (${remain}s) — recolher mesmo assim`],
                          }),
                          h.jsx("button", {
                            className: "py-1.5 rounded-xl text-[11px] font-semibold bg-slate-800/70 hover:bg-slate-700 text-slate-300 transition cursor-pointer",
                            onClick: () => setCookingModalOpen(!1),
                            children: "✖ Fechar (panela continua no fogo)",
                          }),
                        ] }),
                        h.jsx("div", { className: "text-[9px] text-slate-500 text-center", children: "Cada combinação de ingredientes pode dar um resultado diferente após ~45s no fogo." }),
                      ],
                    }),
                  ],
                }),
              });
            })(),
          activeWoodenChest &&
            (() => {
              const chestTx = activeWoodenChest.tx;
              const chestTy = activeWoodenChest.ty;
              const maxChestSlots = activeWoodenChest.maxSlots || 12;
              const chestItems = Array.isArray(activeWoodenChest.items) ? activeWoodenChest.items : [];
              const maxBackpackSlots = ot(Da.current.mochila);

              const closeChestModal = () => {
                if (o.current && o.current.updateWoodenChestStorage) {
                  o.current.updateWoodenChestStorage(chestTx, chestTy, chestItems, !1);
                }
                m.current && m.current.playInventoryClose && m.current.playInventoryClose();
                setActiveWoodenChest(null);
              };

              const handleStoreInChest = (bpItem, storeAll = false) => {
                if (!bpItem) return;
                const isStackable =
                  bpItem.stackCount !== undefined ||
                  bpItem.categoryType === "material" ||
                  bpItem.categoryType === "consumable";
                const existingIdx = isStackable
                  ? chestItems.findIndex(
                      (ci) =>
                        ci.name.trim().toLowerCase() === bpItem.name.trim().toLowerCase() &&
                        ci.rarity === bpItem.rarity,
                    )
                  : -1;
                if (existingIdx === -1 && chestItems.length >= maxChestSlots) {
                  m.current && m.current.playFusionFail && m.current.playFusionFail();
                  ve(`⚠️ O Baú de Madeira está cheio (${maxChestSlots}/${maxChestSlots} slots)!`);
                  return;
                }
                const qtyToMove = storeAll ? (bpItem.stackCount || 1) : 1;
                const nextChestItems = [...chestItems];
                if (existingIdx >= 0) {
                  nextChestItems[existingIdx] = {
                    ...nextChestItems[existingIdx],
                    stackCount: (nextChestItems[existingIdx].stackCount || 1) + qtyToMove,
                  };
                } else {
                  nextChestItems.push({
                    ...bpItem,
                    stackCount: qtyToMove,
                  });
                }
                ra((prevBp) => {
                  const idx = prevBp.findIndex((i) => i.id === bpItem.id);
                  if (idx === -1) return prevBp;
                  const curStack = prevBp[idx].stackCount || 1;
                  if (curStack > qtyToMove) {
                    const copy = [...prevBp];
                    copy[idx] = { ...prevBp[idx], stackCount: curStack - qtyToMove };
                    return copy;
                  }
                  return prevBp.filter((_, i) => i !== idx);
                });
                if (o.current && o.current.updateWoodenChestStorage) {
                  o.current.updateWoodenChestStorage(chestTx, chestTy, nextChestItems, !0);
                }
                setActiveWoodenChest({
                  ...activeWoodenChest,
                  items: nextChestItems,
                });
                m.current && m.current.playItemPickup && m.current.playItemPickup();
              };

              const handleTakeFromChest = (chItem, chIdx, takeAll = false) => {
                if (!chItem) return;
                const isStackable =
                  chItem.stackCount !== undefined ||
                  chItem.categoryType === "material" ||
                  chItem.categoryType === "consumable";
                const existingBpIdx = isStackable
                  ? Ve.findIndex(
                      (bi) =>
                        bi.name.trim().toLowerCase() === chItem.name.trim().toLowerCase() &&
                        bi.rarity === chItem.rarity,
                    )
                  : -1;
                if (existingBpIdx === -1 && Ve.length >= maxBackpackSlots) {
                  m.current && m.current.playFusionFail && m.current.playFusionFail();
                  ve(`⚠️ Sua mochila está cheia (${Ve.length}/${maxBackpackSlots} slots)!`);
                  return;
                }
                const qtyToTake = takeAll ? (chItem.stackCount || 1) : 1;
                const nextChestItems = [...chestItems];
                const curStack = chItem.stackCount || 1;
                if (curStack > qtyToTake) {
                  nextChestItems[chIdx] = { ...chItem, stackCount: curStack - qtyToTake };
                } else {
                  nextChestItems.splice(chIdx, 1);
                }
                ra((prevBp) => {
                  const bpMatchIdx = isStackable
                    ? prevBp.findIndex(
                        (bi) =>
                          bi.name.trim().toLowerCase() === chItem.name.trim().toLowerCase() &&
                          bi.rarity === chItem.rarity,
                      )
                    : -1;
                  if (bpMatchIdx >= 0) {
                    const copy = [...prevBp];
                    copy[bpMatchIdx] = {
                      ...copy[bpMatchIdx],
                      stackCount: (copy[bpMatchIdx].stackCount || 1) + qtyToTake,
                    };
                    return copy;
                  }
                  return [
                    ...prevBp,
                    {
                      ...chItem,
                      id: `item_chest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                      stackCount: qtyToTake,
                    },
                  ];
                });
                if (o.current && o.current.updateWoodenChestStorage) {
                  o.current.updateWoodenChestStorage(chestTx, chestTy, nextChestItems, !0);
                }
                setActiveWoodenChest({
                  ...activeWoodenChest,
                  items: nextChestItems,
                });
                m.current && m.current.playItemPickup && m.current.playItemPickup();
              };

              const slotBoxStyle = (hasItem, isChestSlot) => ({
                width: "54px",
                height: "54px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                backgroundColor: hasItem ? "#3b3228" : "#26201a",
                borderTop: "2px solid #14100c",
                borderLeft: "2px solid #14100c",
                borderRight: "2px solid #574a3b",
                borderBottom: "2px solid #574a3b",
                boxShadow: hasItem
                  ? "inset 0 0 8px rgba(245, 158, 11, 0.22)"
                  : "inset 1px 1px 4px rgba(0, 0, 0, 0.65)",
                cursor: hasItem ? "pointer" : "default",
                padding: "2px",
                userSelect: "none",
              });

              const beltSlots = [
                { key: "cinto_slot1", label: "Cinto 1", item: Oe.cinto_slot1 },
                { key: "cinto_slot2", label: "Cinto 2", item: Oe.cinto_slot2 },
                { key: "mao_direita", label: "Mão Dir.", item: Oe.mao_direita },
                { key: "mao_esquerda", label: "Mão Esq.", item: Oe.mao_esquerda },
              ];

              return h.jsx("div", {
                style: {
                  position: "fixed",
                  inset: 0,
                  zIndex: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(2, 6, 23, 0.78)",
                  backdropFilter: "blur(4px)",
                  padding: "12px",
                },
                onClick: closeChestModal,
                children: h.jsxs("div", {
                  style: {
                    width: "100%",
                    maxWidth: "430px",
                    backgroundColor: "#2d241c",
                    borderTop: "3px solid #6b5744",
                    borderLeft: "3px solid #6b5744",
                    borderRight: "3px solid #17120e",
                    borderBottom: "3px solid #17120e",
                    borderRadius: "12px",
                    padding: "14px",
                    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.85)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    color: "#f5f5f4",
                  },
                  onClick: (ev) => ev.stopPropagation(),
                  children: [
                    // CABEÇALHO ESTILO CONTAINER MINECRAFT
                    h.jsxs("div", {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "2px solid #1c1611",
                        paddingBottom: "8px",
                      },
                      children: [
                        h.jsxs("div", {
                          style: { display: "flex", alignItems: "center", gap: "8px" },
                          children: [
                            h.jsx(ItemIcon, {
                              item: { id: "bau_madeira", name: "Baú de Madeira", isPlaceableChest: true },
                              size: 28,
                            }),
                            h.jsxs("div", {
                              children: [
                                h.jsx("div", {
                                  style: {
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    color: "#fde68a",
                                    letterSpacing: "0.03em",
                                    lineHeight: 1.1,
                                  },
                                  children: "Baú de Madeira",
                                }),
                                h.jsxs("div", {
                                  style: {
                                    fontSize: "10px",
                                    color: "#a8a29e",
                                    marginTop: "2px",
                                  },
                                  children: [
                                    "Clique p/ mover Tudo • Botão direito (ou +1) move 1 un.",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        h.jsx("button", {
                          type: "button",
                          onClick: closeChestModal,
                          style: {
                            backgroundColor: "#44372b",
                            borderTop: "2px solid #6b5744",
                            borderLeft: "2px solid #6b5744",
                            borderRight: "2px solid #1c1611",
                            borderBottom: "2px solid #1c1611",
                            borderRadius: "6px",
                            color: "#fca5a5",
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "4px 9px",
                            cursor: "pointer",
                          },
                          children: "✕",
                        }),
                      ],
                    }),

                    // SEÇÃO SUPERIOR: BAÚ (12 SLOTS EM GRADE 6x2 ESTILO MINECRAFT)
                    h.jsxs("div", {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        backgroundColor: "#211a14",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #3f3328",
                      },
                      children: [
                        h.jsxs("div", {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#fcd34d",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          },
                          children: [
                            h.jsx("span", { children: "Baú (Armazenamento)" }),
                            h.jsxs("span", {
                              style: { fontFamily: "monospace", color: "#d6d3d1" },
                              children: [chestItems.length, "/", maxChestSlots],
                            }),
                          ],
                        }),
                        h.jsx("div", {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 54px)",
                            gap: "6px",
                            justifyContent: "center",
                          },
                          children: Array.from({ length: maxChestSlots }).map((_, idx) => {
                            const it = chestItems[idx];
                            return h.jsxs(
                              "div",
                              {
                                style: slotBoxStyle(!!it, true),
                                title: it
                                  ? `${it.name} (x${it.stackCount || 1})\nClique: Retirar Tudo para a Mochila\nBotão Direito: Retirar 1`
                                  : `Slot do Baú #${idx + 1} (Vazio)`,
                                onClick: () => {
                                  if (it) handleTakeFromChest(it, idx, true);
                                },
                                onContextMenu: (ev) => {
                                  ev.preventDefault();
                                  if (it) handleTakeFromChest(it, idx, false);
                                },
                                children: [
                                  it &&
                                    h.jsx(ItemIcon, {
                                      item: it,
                                      size: 40,
                                    }),
                                  it &&
                                    (it.stackCount || 1) > 1 &&
                                    h.jsx("span", {
                                      style: {
                                        position: "absolute",
                                        bottom: "1px",
                                        right: "3px",
                                        fontSize: "11px",
                                        fontWeight: 900,
                                        fontFamily: "monospace",
                                        color: "#ffffff",
                                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                                        lineHeight: 1,
                                        pointerEvents: "none",
                                      },
                                      children: it.stackCount,
                                    }),
                                  it &&
                                    (it.stackCount || 1) > 1 &&
                                    h.jsx("button", {
                                      type: "button",
                                      onClick: (ev) => {
                                        ev.stopPropagation();
                                        handleTakeFromChest(it, idx, false);
                                      },
                                      style: {
                                        position: "absolute",
                                        top: "1px",
                                        left: "1px",
                                        fontSize: "8px",
                                        fontWeight: 800,
                                        backgroundColor: "rgba(15, 23, 42, 0.85)",
                                        color: "#6ee7b7",
                                        border: "1px solid rgba(52, 211, 153, 0.5)",
                                        borderRadius: "3px",
                                        padding: "0px 3px",
                                        lineHeight: 1.2,
                                        cursor: "pointer",
                                      },
                                      title: "Retirar apenas 1 unidade",
                                      children: "-1",
                                    }),
                                ],
                              },
                              it ? it.id || `chest_slot_${idx}` : `empty_chest_${idx}`,
                            );
                          }),
                        }),
                      ],
                    }),

                    // SEÇÃO INFERIOR: INVENTÁRIO PESSOAL DO JOGADOR (MOCHILA + HOTBAR/CINTO)
                    h.jsxs("div", {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        backgroundColor: "#211a14",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #3f3328",
                      },
                      children: [
                        h.jsxs("div", {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#93c5fd",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          },
                          children: [
                            h.jsx("span", { children: "Inventário Pessoal (Mochila)" }),
                            h.jsxs("span", {
                              style: { fontFamily: "monospace", color: "#d6d3d1" },
                              children: [Ve.length, "/", maxBackpackSlots, " slots"],
                            }),
                          ],
                        }),
                        h.jsx("div", {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 54px)",
                            gap: "6px",
                            justifyContent: "center",
                            maxHeight: "238px",
                            overflowY: "auto",
                            padding: "2px",
                          },
                          children: Array.from({ length: Math.max(6, maxBackpackSlots) }).map((_, idx) => {
                            const it = Ve[idx];
                            return h.jsxs(
                              "div",
                              {
                                style: slotBoxStyle(!!it, false),
                                title: it
                                  ? `${it.name} (x${it.stackCount || 1})\nClique: Guardar Tudo no Baú\nBotão Direito: Guardar 1`
                                  : `Slot da Mochila #${idx + 1} (Vazio)`,
                                onClick: () => {
                                  if (it) handleStoreInChest(it, true);
                                },
                                onContextMenu: (ev) => {
                                  ev.preventDefault();
                                  if (it) handleStoreInChest(it, false);
                                },
                                children: [
                                  it &&
                                    h.jsx(ItemIcon, {
                                      item: it,
                                      size: 40,
                                    }),
                                  it &&
                                    (it.stackCount || 1) > 1 &&
                                    h.jsx("span", {
                                      style: {
                                        position: "absolute",
                                        bottom: "1px",
                                        right: "3px",
                                        fontSize: "11px",
                                        fontWeight: 900,
                                        fontFamily: "monospace",
                                        color: "#ffffff",
                                        textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                                        lineHeight: 1,
                                        pointerEvents: "none",
                                      },
                                      children: it.stackCount,
                                    }),
                                  it &&
                                    (it.stackCount || 1) > 1 &&
                                    h.jsx("button", {
                                      type: "button",
                                      onClick: (ev) => {
                                        ev.stopPropagation();
                                        handleStoreInChest(it, false);
                                      },
                                      style: {
                                        position: "absolute",
                                        top: "1px",
                                        left: "1px",
                                        fontSize: "8px",
                                        fontWeight: 800,
                                        backgroundColor: "rgba(15, 23, 42, 0.85)",
                                        color: "#fcd34d",
                                        border: "1px solid rgba(251, 191, 36, 0.5)",
                                        borderRadius: "3px",
                                        padding: "0px 3px",
                                        lineHeight: 1.2,
                                        cursor: "pointer",
                                      },
                                      title: "Guardar apenas 1 unidade",
                                      children: "+1",
                                    }),
                                ],
                              },
                              it ? it.id || `bp_chest_slot_${idx}` : `empty_bp_chest_${idx}`,
                            );
                          }),
                        }),

                        // BARRA RÁPIDA (CINTO & MÃOS EQUIPADAS) ESTILO HOTBAR DO MINECRAFT
                        h.jsxs("div", {
                          style: {
                            marginTop: "6px",
                            paddingTop: "8px",
                            borderTop: "1px dashed #44372b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "6px",
                          },
                          children: [
                            h.jsx("span", {
                              style: {
                                fontSize: "10px",
                                fontWeight: 700,
                                color: "#a8a29e",
                                textTransform: "uppercase",
                              },
                              children: "Equips / Cinto:",
                            }),
                            h.jsx("div", {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              },
                              children: beltSlots.map((bs) => {
                                const eqItem = bs.item;
                                return h.jsxs(
                                  "div",
                                  {
                                    style: {
                                      ...slotBoxStyle(!!eqItem, false),
                                      width: "48px",
                                      height: "48px",
                                    },
                                    title: eqItem
                                      ? `${bs.label}: ${eqItem.name} (Clique para guardar no Baú)`
                                      : `${bs.label} (Vazio)`,
                                    onClick: () => {
                                      if (!eqItem) return;
                                      if (chestItems.length >= maxChestSlots) {
                                        m.current && m.current.playFusionFail && m.current.playFusionFail();
                                        ve(`⚠️ O Baú de Madeira está cheio (${maxChestSlots}/${maxChestSlots} slots)!`);
                                        return;
                                      }
                                      const nextChestItems = [
                                        ...chestItems,
                                        { ...eqItem, stackCount: eqItem.stackCount || 1 },
                                      ];
                                      Wa((prevEq) => ({ ...prevEq, [bs.key]: null }));
                                      if (o.current && o.current.updateWoodenChestStorage) {
                                        o.current.updateWoodenChestStorage(chestTx, chestTy, nextChestItems, !0);
                                      }
                                      setActiveWoodenChest({
                                        ...activeWoodenChest,
                                        items: nextChestItems,
                                      });
                                      m.current && m.current.playItemPickup && m.current.playItemPickup();
                                    },
                                    children: [
                                      eqItem
                                        ? h.jsx(ItemIcon, { item: eqItem, size: 34 })
                                        : h.jsx("span", {
                                            style: { fontSize: "8px", color: "#78716c", textAlign: "center" },
                                            children: bs.label,
                                          }),
                                      eqItem &&
                                        (eqItem.stackCount || 1) > 1 &&
                                        h.jsx("span", {
                                          style: {
                                            position: "absolute",
                                            bottom: "1px",
                                            right: "2px",
                                            fontSize: "10px",
                                            fontWeight: 900,
                                            fontFamily: "monospace",
                                            color: "#ffffff",
                                            textShadow: "1px 1px 0 #000",
                                          },
                                          children: eqItem.stackCount,
                                        }),
                                    ],
                                  },
                                  bs.key,
                                );
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              });
            })(),
          yl &&
            h.jsx(r1, {
              creatureType: yl.creatureType,
              carcassItem: yl.carcassItem,
              knifeItem: yl.knifeItem,
              backpack: Ve,
              maxBackpackSlots: ot(Oe.mochila),
              onStoreItem: bi,
              onClose: () => pn(null),
            }),
          readerOpen &&
            readerItem &&
            h.jsx(window.Game.BookScrollReaderModal, {
              item: readerItem,
              isOpen: readerOpen,
              onClose: () => setReaderOpen(!1),
            }),
          We &&
            !Lo &&
            (or || Ya) &&
            h.jsxs("div", {
              id: "spearfishing-action-prompt",
              className:
                "fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2",
              children: [
                or &&
                  h.jsxs("button", {
                    id: "btn-collect-water",
                    onClick: Ut,
                    className:
                      "flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-blue-950/80 border border-sky-300/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer",
                    title: "Coletar água fresca da lagoa",
                    children: [
                      h.jsx("div", {
                        className:
                          "p-1.5 rounded-xl bg-white/20 shadow-inner text-base",
                        children: or.icon || "🏺",
                      }),
                      h.jsxs("div", {
                        className: "flex flex-col text-left",
                        children: [
                          h.jsxs("span", {
                            className:
                              "flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] sm:text-xs text-blue-100",
                            children: [
                              "Coletar Água",
                              h.jsx("span", {
                                className:
                                  "px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/20",
                                children: "U",
                              }),
                            ],
                          }),
                          h.jsx("span", {
                            className:
                              "text-[10px] sm:text-[11px] text-blue-200/90 font-medium",
                            children: or.name,
                          }),
                        ],
                      }),
                    ],
                  }),
                Ya &&
                  h.jsxs("button", {
                    id: "btn-start-spearfishing",
                    onClick: nr,
                    className:
                      "flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-950/80 border border-cyan-300/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer hover:shadow-cyan-500/30",
                    title: "Pescar com lança na margem da água",
                    children: [
                      h.jsx("div", {
                        className: "p-1.5 rounded-xl bg-white/20 shadow-inner",
                        children: h.jsx(Dp, {
                          className:
                            "h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse",
                        }),
                      }),
                      h.jsxs("div", {
                        className: "flex flex-col text-left",
                        children: [
                          h.jsxs("span", {
                            className:
                              "flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] sm:text-xs text-cyan-100",
                            children: [
                              "Pesca com Lança",
                              h.jsx("span", {
                                className:
                                  "px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/20",
                                children: "P",
                              }),
                            ],
                          }),
                          h.jsxs("span", {
                            className:
                              "text-[10px] sm:text-[11px] text-cyan-200/90 font-medium",
                            children: [
                              "Margeando ",
                              We.biomeName,
                              " • ",
                              Ya.name,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
          Lo &&
            Ya &&
            We &&
            h.jsx(o1, {
              spearItem: Ya,
              biomeName: We.biomeName,
              audio: m.current,
              onCatchFish: yi,
              onClose: $r,
            }),
        ],
      })
    );
  };
