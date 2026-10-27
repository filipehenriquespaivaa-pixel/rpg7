/* js/ui/hud.js
 * HUD (Hud): minimapa, botoes de toque, barras de vida/stamina.
 * Trecho de legacy/app.original.js (linhas 36560-38419); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  const Hud = ({
    currentBiome: e,
    coords: t,
    seed: l,
    timeOfDay: o,
    setTimeOfDay: u,
    cycleDurationSec: cycleDurationSec = 1200,
    setCycleDurationSec: setCycleDurationSec = () => {},
    cyclePaused: cyclePaused = !1,
    setCyclePaused: setCyclePaused = () => {},
    soundEnabled: m,
    setSoundEnabled: c,
    lanternActive: f,
    setLanternActive: g,
    zoom: y,
    setZoom: w,
    showGrid: v,
    setShowGrid: T,
    onRerollSeed: S,
    onTeleportToBiome: p,
    onInteract: j,
    onAttack: P,
    onThrowPebble: R = () => {},
    onPebbleAimStart: Qi,
    onPebbleAimEnd: Xi,
    onPebbleAimUpdate: Zi,
    toastMessage: A,
    minimapRef: x,
    onMobileDirection: M,
    isCameraOffset: $ = !1,
    onRecenterCamera: z,
    onToggleTorch: K,
    onOpenInventory: V,
    inventoryItemCount: O = 0,
    equipment: _,
    backpack: se,
    gold: ue,
    playerHp: N = 100,
    playerMaxHp: Ee = 100,
    isDead: ne = !1,
    onRespawn: ke,
    playerStamina: G = 100,
    playerMaxStamina: de = 100,
    isExhausted: W = !1,
    isSprinting: le = !1,
    isFireProtected: te = !1,
    nearbyCampfire: oe = null,
    onFeedCampfire: Ne,
    onRoastFish: X,
    savedCampfire: C = null,
    nearbyLogPile: nearbyLogPileProp = null,
    cabinPlacementPreview: cabinPlacementPreviewProp = null,
    onBuildCabin: onBuildCabinProp = null,
    onCancelCabinPlacement: onCancelCabinPlacementProp = null,
    onUseBeltSlot: I,
    onExtraAction: onExtraActionProp,
    dodgeMode: dodgeModeProp,
    devMode: devModeProp,
    worldEngine: worldEngineProp,
  }) => {
    var So;
    const [extraActive, setExtraActive] = J.useState(false);

    J.useEffect(() => {
      const onExtraEvt = () => {
        setExtraActive(true);
        setTimeout(() => setExtraActive(false), 280);
      };
      window.addEventListener("rpg_extra_button_action", onExtraEvt);
      return () => window.removeEventListener("rpg_extra_button_action", onExtraEvt);
    }, []);

    const handleExtraClick = (We) => {
      if (We && typeof We.preventDefault === "function") We.preventDefault();
      setExtraActive(true);
      setTimeout(() => setExtraActive(false), 280);
      if (typeof onExtraActionProp === "function") {
        onExtraActionProp();
      } else {
        window.dispatchEvent(
          new CustomEvent("rpg_extra_button_action", { detail: { timestamp: Date.now() } })
        );
      }
    };
    const isDevMode = Boolean(
      typeof devModeProp === "boolean"
        ? devModeProp
        : (typeof window !== "undefined" && window.__devMode)
    );
    const worldEngine =
      worldEngineProp ||
      (typeof window !== "undefined" &&
        (window.__worldEngine || window.__gameEngine?.world));

    const dungeonStairInfo = J.useMemo(() => {
      if (!isDevMode || !worldEngine || !worldEngine.isUnderground) return null;
      const isSubsolo1 = !worldEngine.undergroundLevel || worldEngine.undergroundLevel === 1;
      const isDungeonL2 = worldEngine.undergroundLevel === 2;
      if (!isSubsolo1 && !isDungeonL2) return null;
      let stair = null;
      if (isDungeonL2) {
        stair = worldEngine.activeDungeonStairCoords || (typeof worldEngine.getDungeonEntranceStairForBiome === "function" ? worldEngine.getDungeonEntranceStairForBiome(t.tx, t.ty) : null);
      } else {
        if (typeof worldEngine.getDungeonEntranceStairForBiome !== "function") return null;
        stair = worldEngine.getDungeonEntranceStairForBiome(t.tx, t.ty);
      }
      if (!stair) return null;
      const dx = stair.tx - t.tx;
      const dy = stair.ty - t.ty;
      const distance = Math.round(Math.hypot(dx, dy));
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      const cardinals = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
      const cardIndex = Math.round(deg / 45) % 8;
      const cardinal = cardinals[cardIndex];
      return {
        stair,
        dx,
        dy,
        distance,
        deg,
        cardinal,
        isExit: isDungeonL2,
        label: isDungeonL2 ? "Subsolo 1 (Saída):" : "Calabouço:",
      };
    }, [isDevMode, worldEngine, t.tx, t.ty]);
    const [be, Me] = J.useState(() => isDevMode || !1),
      [Te, Fe] = J.useState(() => isDevMode || window.innerWidth > 768),
      [_e, xe] = J.useState(() => isDevMode || window.innerWidth > 1024),
      [Ue, $a] = J.useState(!0),
      [Ie, ee] = J.useState(() => !isDevMode),
      [He, Sa] = J.useState(!1),
      [showDevSettings, setShowDevSettings] = J.useState(!1),
      [collidersActive, setCollidersActive] = J.useState(
        () => typeof window !== "undefined" && !!window.__showColliders,
      ),
      [weatherUiState, setWeatherUiState] = J.useState(() => {
        const ws = typeof window !== "undefined" ? window.weatherSystem : null;
        return {
          mode: ws ? ws.mode : "auto",
          current: ws ? ws.currentWeather : "clear",
          intensity: ws ? ws.intensity : 0,
        };
      }),
      isImmersive = !isDevMode || Ie,
      oa = !!(oe && oe.prop.lit !== !1),
      ga = !!(C && oe && C.tx === oe.tx && C.ty === oe.ty),
      we = _ ? ot(_.mochila) : 6,
      je = se ? se.length : O,
      Be = _ ? Zs(_.mochila) : "none",
      Se = J.useMemo(
        () =>
          se
            ? se.reduce(
                (We, Aa) =>
                  Aa.name.toLowerCase().includes("galho") ||
                  Aa.id.includes("galho")
                    ? We + (Aa.stackCount || 1)
                    : We,
                0,
              )
            : 0,
        [se],
      ),
      Ae = J.useMemo(
        () =>
          se
            ? se.reduce((We, Aa) => {
                const ma = (Aa.id || "").toLowerCase(),
                  Ya = (Aa.name || "").toLowerCase();
                return (ma.includes("fish") ||
                  Ya.includes("peixe") ||
                  Ya.includes("lambari") ||
                  Ya.includes("tilapia") ||
                  Ya.includes("tilápia") ||
                  Ya.includes("cascudo") ||
                  Ya.includes("truta")) &&
                  !Ya.includes("assado") &&
                  !Ya.includes("espeto")
                  ? We + (Aa.stackCount || 1)
                  : We;
              }, 0)
            : 0,
        [se],
      ),
      fa =
        (So = oe == null ? void 0 : oe.prop) == null ? void 0 : So.roastingFish,
      [Oe, Wa] = J.useState(0),
      [isPebbleAiming, setIsPebbleAiming] = J.useState(!1);

    J.useEffect(() => {
      window.__onCollidersChanged = (val) => setCollidersActive(val);
      const weatherInterval = setInterval(() => {
        const ws = typeof window !== "undefined" ? window.weatherSystem : null;
        if (ws) {
          setWeatherUiState((prev) =>
            prev.mode === ws.mode &&
            prev.current === ws.currentWeather &&
            Math.abs(prev.intensity - ws.intensity) < 0.05
              ? prev
              : {
                  mode: ws.mode,
                  current: ws.currentWeather,
                  intensity: ws.intensity,
                },
          );
        }
      }, 450);
      return () => {
        clearInterval(weatherInterval);
        if (window.__onCollidersChanged) delete window.__onCollidersChanged;
      };
    }, []);
    const activeWeatherInfo =
      (typeof window !== "undefined" &&
        window.WEATHER_INFO &&
        window.WEATHER_INFO[weatherUiState.current]) || {
        id: "clear",
        namePt: "Céu Limpo",
        icon: "☀️",
        visibilityFactor: 1,
        descriptionPt: "Visibilidade plena.",
      };
    const handleSelectWeather = (wKey) => {
      const ws = typeof window !== "undefined" ? window.weatherSystem : null;
      if (!ws) return;
      ws.setManualWeather(wKey);
      setWeatherUiState({
        mode: ws.mode,
        current: ws.currentWeather,
        intensity: ws.intensity,
      });
    };
    const pebbleAimTouchStart = J.useRef(null);
    const pebbleAimStartTime = J.useRef(0);
    const pebbleAimHasDragged = J.useRef(!1);
    const pebbleAimTimer = J.useRef(null);
    const isPebbleItem = (item) => {
      if (!item) return !1;
      const name = (item.name || "").toLowerCase();
      const id = (item.id || "").toLowerCase();
      return name.includes("seixo") || id.includes("seixo") || id.includes("pebble");
    };
    const isSlingshotItem = (item) => {
      if (!item) return !1;
      const name = (item.name || "").toLowerCase();
      const id = (item.id || "").toLowerCase();
      return name.includes("estilingue") || id.includes("estilingue") || id.includes("slingshot");
    };
    const hasSlingshotEquipped = _ ? (isSlingshotItem(_.mao_direita) || isSlingshotItem(_.mao_esquerda)) : !1;
    const hasPebbleEquipped = _ ? (isPebbleItem(_.mao_direita) || isPebbleItem(_.mao_esquerda) || hasSlingshotEquipped) : !1;
    const maxPebbleRange = hasSlingshotEquipped ? 660 : 330;
    const pebbleCount = J.useMemo(() => {
      const inHands = (_ && isPebbleItem(_.mao_direita) ? (_.mao_direita.stackCount || 1) : 0) +
                      (_ && isPebbleItem(_.mao_esquerda) ? (_.mao_esquerda.stackCount || 1) : 0);
      const inPack = se ? se.reduce((acc, it) => isPebbleItem(it) ? acc + (it.stackCount || 1) : acc, 0) : 0;
      return inHands + inPack;
    }, [_, se]);

    const handlePebbleAimDown = (e) => {
      if (e && e.preventDefault && e.type && e.type.startsWith("touch")) e.preventDefault();
      pebbleAimStartTime.current = performance.now();
      pebbleAimHasDragged.current = !1;
      if (e && e.touches && e.touches[0]) {
        pebbleAimTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e && e.clientX !== void 0) {
        pebbleAimTouchStart.current = { x: e.clientX, y: e.clientY };
      }
      if (pebbleAimTimer.current) clearTimeout(pebbleAimTimer.current);
      pebbleAimTimer.current = setTimeout(() => {
        if (pebbleAimStartTime.current > 0) {
          setIsPebbleAiming(!0);
        }
      }, 200);
      if (Qi) Qi();
    };
    const handleCombatClick = (e) => {
      if (pebbleAimTimer.current) clearTimeout(pebbleAimTimer.current);
      setIsPebbleAiming(!1);
      pebbleAimTouchStart.current = null;
      pebbleAimStartTime.current = 0;
      pebbleAimHasDragged.current = !1;
      P(e);
    };
    const handlePebbleAimMove = (e) => {
      if (!pebbleAimTouchStart.current) return;
      let cx, cy;
      if (e && e.touches && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if (e && e.clientX !== void 0) {
        cx = e.clientX;
        cy = e.clientY;
      }
      if (cx !== void 0 && cy !== void 0) {
        const dx = cx - pebbleAimTouchStart.current.x;
        const dy = cy - pebbleAimTouchStart.current.y;
        const dragDist = Math.hypot(dx, dy);
        if (dragDist > 10) {
          pebbleAimHasDragged.current = !0;
          setIsPebbleAiming(!0);
          const angle = Math.atan2(dy, dx);
          const distance = Math.max(35, Math.min(maxPebbleRange, 45 + (dragDist / 70) * (maxPebbleRange - 45)));
          if (Zi) Zi(angle, distance);
        }
      }
    };
    const handlePebbleAimUp = (e) => {
      if (e && e.preventDefault && e.type && e.type.startsWith("touch")) e.preventDefault();
      if (pebbleAimTimer.current) clearTimeout(pebbleAimTimer.current);
      const heldMs = pebbleAimStartTime.current ? performance.now() - pebbleAimStartTime.current : 0;
      const isManual = pebbleAimHasDragged.current || heldMs >= 200;
      setIsPebbleAiming(!1);
      let finalAngle, finalDist;
      if (isManual && pebbleAimTouchStart.current && e) {
        let cx, cy;
        if (e.changedTouches && e.changedTouches[0]) {
          cx = e.changedTouches[0].clientX;
          cy = e.changedTouches[0].clientY;
        } else if (e.clientX !== void 0) {
          cx = e.clientX;
          cy = e.clientY;
        }
        if (cx !== void 0 && cy !== void 0) {
          const dx = cx - pebbleAimTouchStart.current.x;
          const dy = cy - pebbleAimTouchStart.current.y;
          const dragDist = Math.hypot(dx, dy);
          if (dragDist > 8) {
            finalAngle = Math.atan2(dy, dx);
            finalDist = Math.max(35, Math.min(maxPebbleRange, 45 + (dragDist / 70) * (maxPebbleRange - 45)));
          }
        }
      }
      pebbleAimTouchStart.current = null;
      pebbleAimStartTime.current = 0;
      pebbleAimHasDragged.current = !1;
      if (Xi) Xi(isManual ? finalAngle : void 0, isManual ? finalDist : void 0);
      else if (R) R(isManual ? finalAngle : void 0, isManual ? finalDist : void 0);
    };
    J.useEffect(() => {
      if (!fa) {
        Wa(0);
        return;
      }
      const We = () => {
        const ma = Date.now() - fa.startTime,
          Ya = Math.max(0, Math.ceil((fa.durationMs - ma) / 1e3));
        Wa(Ya);
      };
      We();
      const Aa = setInterval(We, 500);
      return () => clearInterval(Aa);
    }, [fa]);
    const Ve = J.useMemo(
        () =>
          _ != null && _.cinto_slot1
            ? To(_.cinto_slot1).category === "flask"
            : !1,
        [_ == null ? void 0 : _.cinto_slot1],
      ),
      ra = J.useMemo(
        () =>
          _ != null && _.cinto_slot2
            ? To(_.cinto_slot2).category === "flask"
            : !1,
        [_ == null ? void 0 : _.cinto_slot2],
      ),
      ct = J.useMemo(() => {
        var ma;
        if (!(_ != null && _.mao_esquerda)) return !1;
        const We = To(_.mao_esquerda),
          Aa = _.mao_esquerda.stackCount || 1;
        return Ve &&
          (((ma = _ == null ? void 0 : _.cinto_slot1) == null
            ? void 0
            : ma.stackCount) || 1) > 1
          ? !0
          : !We.allowed || Aa > We.maxCapacity;
      }, [
        _ == null ? void 0 : _.mao_esquerda,
        _ == null ? void 0 : _.cinto_slot1,
        Ve,
      ]),
      _t = J.useMemo(() => {
        var ma;
        if (!(_ != null && _.mao_direita)) return !1;
        const We = To(_.mao_direita),
          Aa = _.mao_direita.stackCount || 1;
        return ra &&
          (((ma = _ == null ? void 0 : _.cinto_slot2) == null
            ? void 0
            : ma.stackCount) || 1) > 1
          ? !0
          : !We.allowed || Aa > We.maxCapacity;
      }, [
        _ == null ? void 0 : _.mao_direita,
        _ == null ? void 0 : _.cinto_slot2,
        ra,
      ]),
      qr = J.useMemo(() => {
        const We = _ == null ? void 0 : _.mao_esquerda,
          Aa = _ == null ? void 0 : _.cinto_slot1;
        let ma = `Troca Rápida [1]: Mão Esquerda ⇄ Bolso 1
• Mão Esquerda: ${We ? `${We.name} (${We.stackCount || 1}x)` : "Vazia"}
• Bolso 1: ${Aa ? `${Aa.name} (${Aa.stackCount || 1}x)` : "Vazio"}`;
        return (
          Aa &&
            Ve &&
            (Aa.stackCount || 1) > 1 &&
            (ma += `
🧪 Frascos: Retira 1 por vez para a mão (restam ${(Aa.stackCount || 1) - 1}x no cinto).`),
          ct &&
            We &&
            (ma += `
📦 "${We.name}" na mão irá para o inventário (ou chão se cheio).`),
          ma
        );
      }, [
        _ == null ? void 0 : _.mao_esquerda,
        _ == null ? void 0 : _.cinto_slot1,
        Ve,
        ct,
      ]),
      zo = J.useMemo(() => {
        const We = _ == null ? void 0 : _.mao_direita,
          Aa = _ == null ? void 0 : _.cinto_slot2;
        let ma = `Troca Rápida [2]: Mão Direita ⇄ Bolso 2
• Mão Direita: ${We ? `${We.name} (${We.stackCount || 1}x)` : "Vazia"}
• Bolso 2: ${Aa ? `${Aa.name} (${Aa.stackCount || 1}x)` : "Vazio"}`;
        return (
          Aa &&
            ra &&
            (Aa.stackCount || 1) > 1 &&
            (ma += `
🧪 Frascos: Retira 1 por vez para a mão (restam ${(Aa.stackCount || 1) - 1}x no cinto).`),
          _t &&
            We &&
            (ma += `
📦 "${We.name}" na mão irá para o inventário (ou chão se cheio).`),
          ma
        );
      }, [
        _ == null ? void 0 : _.mao_direita,
        _ == null ? void 0 : _.cinto_slot2,
        ra,
        _t,
      ]);
    J.useEffect(() => {
      const We = () => {
        if (!isDevMode && window.innerWidth < 768) {
          Fe(!1);
          xe(!1);
        }
      };
      return (
        window.addEventListener("resize", We),
        () => window.removeEventListener("resize", We)
      );
    }, [isDevMode]);
    J.useEffect(() => {
      // O modo comum deve ser imersivo por padrão; no modo dev os controles de teste iniciam visíveis
      ee(!isDevMode);
    }, [isDevMode]);
    const Lo = () => {
        const We = (typeof Bb === "function" ? Bb : (typeof buildStandaloneHtml === "function" ? buildStandaloneHtml : () => ("")))({
            seed: l,
            timeOfDay: o,
            coords: t,
            soundEnabled: m,
            lanternActive: f,
            equipment: _,
            backpack: se,
            gold: ue,
          }),
          Aa = new Blob([We], { type: "text/html;charset=utf-8" }),
          ma = URL.createObjectURL(Aa),
          Ya = document.createElement("a");
        ((Ya.href = ma),
          (Ya.download = `mundo-procedural-rpg-seed-${l}.html`),
          document.body.appendChild(Ya),
          Ya.click(),
          document.body.removeChild(Ya),
          URL.revokeObjectURL(ma));
      },
      tr = () =>
        o >= 0.2 && o < 0.35
          ? "Amanhecer"
          : o >= 0.35 && o < 0.65
            ? "Meio-dia"
            : o >= 0.65 && o < 0.8
              ? "Pôr do Sol"
              : "Noite",
      isDayPhase = o >= 0.25 && o < 0.75,
      darknessPct = Math.round(
        Math.pow((1 + Math.cos(o * Math.PI * 2)) * 0.5, 1.15) * 100,
      ),
      formatClock = () => {
        const totalMin = Math.floor((((o % 1) + 1) % 1) * 1440);
        const hh = String(Math.floor(totalMin / 60) % 24).padStart(2, "0");
        const mm = String(totalMin % 60).padStart(2, "0");
        return `${hh}:${mm}`;
      },
      formatCycleLabel = (sec) => {
        const s = Math.max(5, Number(sec) || 1200);
        const half = s / 2;
        if (s < 120) {
          return `${Math.round(s)}s (${Math.round(half)}s Dia / ${Math.round(half)}s Noite)`;
        }
        const totalMin = +(s / 60).toFixed(1);
        const halfMin = +(half / 60).toFixed(1);
        return `${totalMin} min (${halfMin}m Dia / ${halfMin}m Noite)`;
      };
    return h.jsxs("div", {
      className:
        "pointer-events-none absolute inset-0 z-20 overflow-hidden select-none",
      children: [
        isDevMode &&
          h.jsxs("div", {
            className:
              "pointer-events-auto absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-1.5 z-30",
            children: [
              h.jsxs("div", {
                className:
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 border border-amber-500/60 shadow-lg shadow-black/60 backdrop-blur-md text-[11px]",
                children: [
                  h.jsx("span", {
                    className: "text-amber-400 font-bold whitespace-nowrap",
                    children: "⛰️ Bioma (Dev):",
                  }),
                  h.jsx("select", {
                    id: "hud-top-dev-biome-select",
                    value: (e && e.id) || "",
                    onChange: (We) => {
                      const val = We.target.value;
                      if (We.target && typeof We.target.blur === "function") {
                        We.target.blur();
                      }
                      if (val && p) p(val);
                    },
                    onKeyDown: (We) => {
                      if (
                        ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(We.code)
                      ) {
                        We.preventDefault();
                        if (We.target && typeof We.target.blur === "function") {
                          We.target.blur();
                        }
                      }
                    },
                    className:
                      "bg-slate-900 text-amber-200 font-bold rounded-lg px-2 py-0.5 border border-amber-500/40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 max-w-[190px] sm:max-w-[230px]",
                    title: "Selecionar e Teleportar para Bioma",
                    children: Object.values(BIOMES).map((We) =>
                      h.jsx(
                        "option",
                        { value: We.id, children: We.namePt },
                        We.id,
                      ),
                    ),
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("SUBSOLO_HALL"),
                    className:
                      "px-2 py-0.5 rounded-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Teleportar direto para os Salões do Subsolo",
                    children: "Ir p/ Subsolo",
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("DUNGEON_LOWER"),
                    className:
                      "px-2 py-0.5 rounded-full bg-red-700 hover:bg-red-600 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Teleportar direto para o Calabouço Inferior",
                    children: "Ir p/ Calabouço",
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("MOUNTAIN_25D"),
                    className:
                      "px-2 py-0.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Ir direto para Montanhas 2.5D (Paredões)",
                    children: "Ir p/ Montanhas 2.5D",
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("DESERT_CAVE"),
                    className:
                      "px-2 py-0.5 rounded-full bg-amber-700 hover:bg-amber-600 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Teleportar direto para a Caverna do Deserto (Túneis Estreitos)",
                    children: "🦂 Ir p/ Caverna Deserto",
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("SNOW_PEAK"),
                    className:
                      "px-2 py-0.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Teleportar direto para a Cidade dos Picos Gelados",
                    children: "❄️ Ir p/ Cidade Glacial",
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => p && p("PORT_CITY"),
                    className:
                      "px-2 py-0.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Teleportar direto para a Cidade Portuária na Praia Tropical e suas Embarcações",
                    children: "⚓ Ir p/ Cidade Portuária",
                  }),
                  h.jsx("button", {
                    type: "button",
                    id: "hud-dev-mapa-global-btn",
                    onClick: () => window.toggleMapaGlobal && window.toggleMapaGlobal(),
                    className:
                      "px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow",
                    title: "Abrir o Mapa Global em tela cheia (arrastar e zoom) para ver como os biomas são construídos",
                    children: "🗺️ Mapa Global",
                  }),
                  h.jsxs("div", {
                    className:
                      "flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-sky-500/50 text-[10px]",
                    children: [
                      h.jsx("span", {
                        className: "text-sky-300 font-bold whitespace-nowrap",
                        children: `${activeWeatherInfo.icon} Clima:`,
                      }),
                      h.jsxs("select", {
                        id: "hud-top-dev-weather-select",
                        value: weatherUiState.mode === "auto" ? "auto" : weatherUiState.current,
                        onChange: (We) => {
                          const val = We.target.value;
                          if (We.target && typeof We.target.blur === "function") {
                            We.target.blur();
                          }
                          handleSelectWeather(val);
                        },
                        className:
                          "bg-slate-950 text-sky-200 font-bold rounded px-1.5 py-0.5 border border-sky-500/40 cursor-pointer focus:outline-none",
                        title: "Alterar Clima no Canvas (Afeta visibilidade e comportamento das criaturas)",
                        children: [
                          h.jsx("option", { value: "auto", children: `🔄 Automático (${activeWeatherInfo.namePt})` }),
                          h.jsx("option", { value: "clear", children: "☀️ Céu Limpo" }),
                          h.jsx("option", { value: "rain", children: "🌧️ Chuva" }),
                          h.jsx("option", { value: "thunderstorm", children: "⛈️ Tempestade com Raios" }),
                          h.jsx("option", { value: "sandstorm", children: "🌪️ Tempestade de Areia" }),
                          h.jsx("option", { value: "snow", children: "🌨️ Tempestade de Neve" }),
                        ],
                      }),
                    ],
                  }),
                  h.jsxs("button", {
                    id: "hud-dev-settings-sidebar-toggle-btn",
                    type: "button",
                    onClick: () => setShowDevSettings(!showDevSettings),
                    className: `px-2.5 py-0.5 rounded-full font-bold text-[10px] transition cursor-pointer active:scale-95 whitespace-nowrap shadow flex items-center gap-1 border ${
                      showDevSettings
                        ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-300 shadow-amber-950/60"
                        : "bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border-amber-500/50"
                    }`,
                    title: "Abrir/Fechar Sidebar de Configurações Dev",
                    children: [
                      h.jsx("span", { children: "⚙️" }),
                      h.jsx("span", { children: "Configurações" }),
                    ],
                  }),
                ],
              }),
              h.jsxs("button", {
                id: "hud-toggle-visibility-btn",
                onClick: () => ee(!Ie),
                className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all shadow-md backdrop-blur-md border ${Ie ? "bg-sky-600/90 hover:bg-sky-500 text-white border-sky-400/50 shadow-sky-900/40" : "bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 hover:text-white border-white/10"}`,
                title: Ie
                  ? "Restaurar Interface (Dev)"
                  : "Ocultar Interface para Visão Limpa",
                children: [
                  Ie
                    ? h.jsx(xp, { className: "h-3.5 w-3.5 text-sky-200" })
                    : h.jsx(jp, { className: "h-3.5 w-3.5 text-slate-400" }),
                  h.jsx("span", {
                    className: "hidden sm:inline",
                    children: Ie ? "Exibir Interface Dev" : "Modo Imersivo (Dev)",
                  }),
                ],
              }),
            ],
          }),
        isDevMode &&
          dungeonStairInfo &&
          h.jsxs("div", {
            id: "hud-dungeon-compass-bar",
            className: `pointer-events-auto absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/95 border-2 ${
              dungeonStairInfo.isExit
                ? "border-amber-500/90 shadow-xl shadow-amber-950/70"
                : "border-red-500/80 shadow-xl shadow-red-950/70"
            } backdrop-blur-md z-30 select-none animate-in fade-in slide-in-from-top-2 duration-200`,
            children: [
              h.jsxs("div", {
                className: `relative w-7 h-7 rounded-full bg-slate-900 border ${
                  dungeonStairInfo.isExit
                    ? "border-amber-500/60"
                    : "border-red-500/60"
                } flex items-center justify-center shadow-inner shrink-0`,
                title: `${dungeonStairInfo.isExit ? "Direção da Escadaria de Retorno ao Subsolo 1" : "Direção da Escadaria do Calabouço"}: ${dungeonStairInfo.cardinal} (${Math.round(dungeonStairInfo.deg)}°)`,
                children: [
                  h.jsx("div", {
                    className: `absolute inset-0 rounded-full border border-dashed ${
                      dungeonStairInfo.isExit
                        ? "border-amber-400/30"
                        : "border-red-400/30"
                    }`,
                  }),
                  h.jsx("div", {
                    className:
                      "w-full h-full flex items-center justify-center transition-transform duration-200 ease-out",
                    style: { transform: `rotate(${dungeonStairInfo.deg}deg)` },
                    children: h.jsx("div", {
                      className: `w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[10px] ${
                        dungeonStairInfo.isExit
                          ? "border-b-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]"
                          : "border-b-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.9)]"
                      } -translate-y-1.5`,
                    }),
                  }),
                  h.jsx("div", {
                    className:
                      "absolute w-1.5 h-1.5 rounded-full bg-amber-400 border border-slate-950",
                  }),
                ],
              }),
              h.jsxs("div", {
                className: "flex items-center gap-1.5 text-xs font-mono",
                children: [
                  h.jsxs("span", {
                    className: `font-bold ${
                      dungeonStairInfo.isExit
                        ? "text-amber-400"
                        : "text-red-400"
                    } flex items-center gap-1`,
                    children: [
                      h.jsx("span", { children: dungeonStairInfo.isExit ? "🏰" : "🧭" }),
                      h.jsx("span", {
                        className: "hidden xs:inline",
                        children: dungeonStairInfo.label || (dungeonStairInfo.isExit ? "Subsolo 1:" : "Calabouço:"),
                      }),
                    ],
                  }),
                  h.jsxs("span", {
                    className: `font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      dungeonStairInfo.distance <= 4
                        ? "bg-emerald-950 border border-emerald-500/60 text-emerald-300 animate-pulse"
                        : dungeonStairInfo.distance <= 18
                          ? "bg-amber-950 border border-amber-500/60 text-amber-300"
                          : dungeonStairInfo.isExit
                            ? "bg-amber-950/80 border border-amber-500/60 text-amber-300"
                            : "bg-red-950 border border-red-500/60 text-red-300"
                    }`,
                    children: [
                      dungeonStairInfo.distance,
                      "m (",
                      dungeonStairInfo.cardinal,
                      ")",
                    ],
                  }),
                  h.jsxs("span", {
                    className:
                      "text-[10px] text-slate-400 font-mono hidden sm:inline",
                    children: [
                      "[",
                      dungeonStairInfo.stair.tx,
                      ",",
                      dungeonStairInfo.stair.ty,
                      "]",
                    ],
                  }),
                ],
              }),
              h.jsxs("button", {
                type: "button",
                onClick: () => {
                  p && p("DUNGEON_STAIR_TARGET");
                },
                className: `px-2 py-0.5 rounded-full ${
                  dungeonStairInfo.isExit
                    ? "bg-amber-600 hover:bg-amber-500"
                    : "bg-red-600 hover:bg-red-500"
                } active:scale-95 text-white font-bold text-[10px] transition cursor-pointer shadow flex items-center gap-1 shrink-0`,
                title: dungeonStairInfo.isExit
                  ? `Teleportar instantaneamente para a frente da Escadaria de Retorno ao Subsolo 1 em [${dungeonStairInfo.stair.tx}, ${dungeonStairInfo.stair.ty}]`
                  : `Teleportar instantaneamente para a frente da Escadaria do Calabouço em [${dungeonStairInfo.stair.tx}, ${dungeonStairInfo.stair.ty}]`,
                children: [
                  h.jsx("span", { children: "⚡" }),
                  h.jsx("span", { children: dungeonStairInfo.isExit ? "Ir p/ Saída" : "Ir até Lá" }),
                ],
              }),
            ],
          }),
        !isImmersive &&
          h.jsxs(h.Fragment, {
            children: [
              h.jsxs("div", {
                className:
                  "pointer-events-auto absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-900/75 hover:bg-slate-900/90 p-2 sm:p-2.5 shadow-xl backdrop-blur-md max-w-[200px] sm:max-w-xs transition-all",
                children: [
                  h.jsxs("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      h.jsxs("span", {
                        className:
                          "inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-sky-400 uppercase truncate",
                        children: [
                          h.jsx("span", {
                            className:
                              "inline-block h-2 w-2 rounded-full shrink-0",
                            style: { backgroundColor: e.groundColor },
                          }),
                          h.jsx("span", {
                            className: "truncate",
                            children: e.namePt,
                          }),
                        ],
                      }),
                      h.jsx("button", {
                        id: "hud-collapse-biome-btn",
                        onClick: () => Fe(!Te),
                        className:
                          "p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition shrink-0",
                        title: Te ? "Minimizar Painel" : "Expandir Detalhes",
                        children: Te
                          ? h.jsx(Cp, { className: "h-3 w-3" })
                          : h.jsx(xu, { className: "h-3 w-3" }),
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "flex items-center justify-between text-[11px] font-mono text-slate-300",
                    children: [
                      h.jsxs("div", {
                        className:
                          "flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/5",
                        children: [
                          h.jsx(Ap, {
                            className: "h-3 w-3 text-amber-400 shrink-0",
                          }),
                          h.jsxs("span", { children: [t.tx, ",", t.ty] }),
                        ],
                      }),
                      h.jsxs("span", {
                        className:
                          "text-[10px] text-slate-500 font-mono hidden sm:inline",
                        children: ["#", l],
                      }),
                    ],
                  }),
                  !(worldEngine && worldEngine.isUnderground) &&
                    h.jsxs("div", {
                      className:
                        "flex items-center justify-between gap-1.5 bg-black/40 px-2 py-1 rounded border border-white/5 text-[10px]",
                      title: activeWeatherInfo.descriptionPt,
                      children: [
                        h.jsxs("span", {
                          className: "flex items-center gap-1 font-semibold text-sky-300 truncate",
                          children: [
                            h.jsx("span", { children: activeWeatherInfo.icon }),
                            h.jsx("span", { className: "truncate", children: activeWeatherInfo.namePt }),
                          ],
                        }),
                        h.jsxs("span", {
                          className: "font-mono text-[9px] text-slate-400 shrink-0",
                          children: [
                            "Visib: ",
                            Math.round(
                              (typeof window !== "undefined" &&
                              window.weatherSystem &&
                              typeof window.weatherSystem.getEffectiveVisibilityMultiplier === "function"
                                ? window.weatherSystem.getEffectiveVisibilityMultiplier(!1)
                                : 1) * 100,
                            ),
                            "%",
                          ],
                        }),
                      ],
                    }),
                  h.jsxs("div", {
                    className:
                      "flex flex-col gap-1 bg-black/40 px-2 py-1.5 rounded border border-white/5",
                    children: [
                      h.jsxs("div", {
                        className:
                          "flex items-center justify-between text-[11px] font-semibold",
                        children: [
                          h.jsxs("span", {
                            className: "flex items-center gap-1 text-rose-400",
                            children: [
                              h.jsx(Op, {
                                className:
                                  "h-3 w-3 fill-rose-500 text-rose-500 shrink-0",
                              }),
                              h.jsx("span", { children: "Vida" }),
                            ],
                          }),
                          h.jsxs("span", {
                            className: `font-mono text-[10px] ${ne ? "text-rose-500 font-bold" : (N ?? 100) < 30 ? "text-rose-400" : "text-slate-300"}`,
                            children: [
                              ne ? "0" : Math.round(N ?? 100),
                              " / ",
                              Ee ?? 100,
                            ],
                          }),
                        ],
                      }),
                      h.jsx("div", {
                        className:
                          "h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10",
                        children: h.jsx("div", {
                          className: `h-full transition-all duration-200 ${ne ? "w-0 bg-slate-700" : (N ?? 100) > 50 ? "bg-gradient-to-r from-emerald-500 to-green-400" : (N ?? 100) > 25 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse"}`,
                          style: {
                            width: `${Math.max(0, Math.min(100, ((N ?? 100) / (Ee ?? 100)) * 100))}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "flex flex-col gap-1 bg-black/40 px-2 py-1.5 rounded border border-white/5",
                    children: [
                      h.jsxs("div", {
                        className:
                          "flex items-center justify-between text-[11px] font-semibold",
                        children: [
                          h.jsxs("span", {
                            className: `flex items-center gap-1.5 ${W ? "text-rose-400" : le ? "text-emerald-300" : "text-amber-300"}`,
                            children: [
                              h.jsx(Yu, {
                                className: `h-3 w-3 shrink-0 ${le ? "fill-emerald-400 text-emerald-400 animate-pulse" : W ? "text-rose-400 fill-rose-400" : "fill-amber-400 text-amber-400"}`,
                              }),
                              h.jsx("span", { children: "Cansaço / Vigor" }),
                              le &&
                                h.jsx("span", {
                                  className:
                                    "text-[9px] px-1 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold leading-none tracking-tight",
                                  children: "CORRENDO",
                                }),
                              W &&
                                h.jsx("span", {
                                  className:
                                    "text-[9px] px-1 py-0.5 bg-rose-500/30 text-rose-300 rounded font-mono font-bold leading-none tracking-tight animate-pulse",
                                  children: "EXAUSTO",
                                }),
                            ],
                          }),
                          h.jsxs("span", {
                            className: `font-mono text-[10px] ${W ? "text-rose-400 font-bold" : (G ?? 100) < 30 ? "text-amber-400" : "text-slate-300"}`,
                            children: [Math.round(G ?? 100), " / ", de ?? 100],
                          }),
                        ],
                      }),
                      h.jsx("div", {
                        className:
                          "h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10",
                        children: h.jsx("div", {
                          className: `h-full transition-all duration-100 ${W ? "bg-gradient-to-r from-rose-600 to-amber-500 animate-pulse" : le ? "bg-gradient-to-r from-emerald-400 to-teal-300" : (G ?? 100) > 40 ? "bg-gradient-to-r from-amber-400 to-yellow-300" : "bg-gradient-to-r from-rose-500 to-amber-400"}`,
                          style: {
                            width: `${Math.max(0, Math.min(100, ((G ?? 100) / (de ?? 100)) * 100))}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                  (Te || isDevMode) &&
                    h.jsxs("div", {
                      className:
                        "flex flex-col gap-1.5 pt-1.5 border-t border-white/10 text-xs animate-in fade-in duration-150",
                      children: [
                        h.jsx("p", {
                          className:
                            "text-[11px] text-slate-300 leading-snug line-clamp-2",
                          children: e.descriptionPt,
                        }),
                        h.jsxs("button", {
                          id: "hud-teleport-toggle",
                          onClick: () => Me(!be),
                          className:
                            "flex items-center justify-between px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-sky-300 hover:text-sky-200 transition text-[11px] w-full",
                          title: "Explorar outros biomas",
                          children: [
                            h.jsxs("div", {
                              className: "flex items-center gap-1.5",
                              children: [
                                h.jsx(Vp, {
                                  className: "h-3 w-3 text-sky-400",
                                }),
                                h.jsx("span", { children: "Explorar Biomas" }),
                              ],
                            }),
                            h.jsx(xu, {
                              className: `h-3 w-3 transition-transform ${be ? "rotate-180" : ""}`,
                            }),
                          ],
                        }),
                        be &&
                          h.jsx("div", {
                            className:
                              "mt-1 flex flex-col gap-0.5 border-t border-white/10 pt-1.5 max-h-60 overflow-y-auto pr-1",
                            children: Object.values(BIOMES).map((We) =>
                              h.jsx(
                                "button",
                                {
                                  onClick: () => {
                                    p(We.id);
                                    if (!isDevMode) Me(!1);
                                  },
                                  className: `flex items-center justify-between text-left px-1.5 py-1 rounded text-[11px] transition ${
                                    We.id === "MOUNTAIN_25D"
                                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold hover:bg-amber-500/30"
                                      : (e && e.id === We.id)
                                        ? "bg-sky-500/20 text-sky-200 font-semibold"
                                        : "text-slate-200 hover:bg-slate-800 hover:text-white"
                                  }`,
                                  children: h.jsxs("div", {
                                    className:
                                      "flex items-center gap-1.5 truncate",
                                    children: [
                                      h.jsx("span", {
                                        className:
                                          "h-1.5 w-1.5 rounded-full shrink-0",
                                        style: {
                                          backgroundColor: We.groundColor,
                                        },
                                      }),
                                      h.jsx("span", {
                                        className: "truncate",
                                        children: We.namePt,
                                      }),
                                    ],
                                  }),
                                },
                                We.id,
                              ),
                            ),
                          }),
                      ],
                    }),
                ],
              }),
              h.jsxs("div", {
                className:
                  "pointer-events-auto absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col items-end gap-1.5 sm:gap-2",
                children: [
                  h.jsxs("div", {
                    className: "flex flex-col items-end",
                    children: [
                      h.jsx("div", {
                        className: "flex items-center gap-1 mb-1",
                        children: h.jsx("button", {
                          id: "hud-toggle-minimap-btn",
                          onClick: () => $a(!Ue),
                          className:
                            "px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 transition",
                          title: Ue ? "Ocultar Radar" : "Mostrar Radar",
                          children: Ue ? "Radar ▼" : "Radar ▲",
                        }),
                      }),
                      Ue &&
                        h.jsxs("div", {
                          className:
                            "relative rounded-xl border border-white/15 bg-slate-900/80 p-1 shadow-2xl backdrop-blur-md",
                          children: [
                            h.jsx("canvas", {
                              ref: x,
                              width: 90,
                              height: 90,
                              onClick: isDevMode
                                ? () => window.toggleMapaGlobal && window.toggleMapaGlobal()
                                : void 0,
                              title: isDevMode ? "Clique para expandir: Mapa Global (arrastar e zoom)" : void 0,
                              className:
                                "block rounded-lg w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" +
                                (isDevMode ? " cursor-zoom-in pointer-events-auto" : ""),
                            }),
                            h.jsx("div", {
                              className:
                                "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                              children: h.jsxs("div", {
                                className:
                                  "relative flex h-2.5 w-2.5 items-center justify-center",
                                children: [
                                  h.jsx("span", {
                                    className:
                                      "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75",
                                  }),
                                  h.jsx("span", {
                                    className:
                                      "relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500 border border-white shadow",
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "flex items-center gap-1 bg-slate-900/75 hover:bg-slate-900/90 p-1 rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-all",
                    children: [
                      h.jsx("button", {
                        id: "hud-sound-btn",
                        onClick: () => c(!m),
                        className: `p-1.5 rounded-lg text-xs transition ${m ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`,
                        title: m ? "Silenciar Áudio" : "Ativar Efeitos Sonoros",
                        children: m
                          ? h.jsx(Hp, { className: "h-3.5 w-3.5" })
                          : h.jsx(Wp, { className: "h-3.5 w-3.5" }),
                      }),
                      !isDevMode &&
                        h.jsxs("button", {
                          id: "hud-combat-btn",
                          onClick: handleCombatClick,
                          className:
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 active:scale-95 text-white text-xs font-semibold shadow-md transition border border-rose-500/50",
                          title: "Golpe de Combate / Atacar (Clique Esquerdo ou Espaço)",
                          children: [
                            h.jsx(Xs, { className: "h-3.5 w-3.5 text-rose-200" }),
                            h.jsx("span", {
                              className: "text-[11px]",
                              children: "Combate",
                            }),
                            h.jsx("span", {
                              className:
                                "hidden xl:inline text-[9px] bg-rose-950/80 px-1 py-0.5 rounded text-rose-300 font-mono",
                              children: "Espaço",
                            }),
                          ],
                        }),
                      !isDevMode &&
                        h.jsxs("button", {
                          id: "hud-pebble-btn",
                          onMouseDown: handlePebbleAimDown,
                          onMouseUp: handlePebbleAimUp,
                          onTouchStart: handlePebbleAimDown,
                          onTouchEnd: handlePebbleAimUp,
                          onClick: () => { if (!isPebbleAiming && R) R(); },
                          className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-xs font-semibold shadow-md transition border active:scale-95 ${
                            isPebbleAiming
                              ? "bg-amber-600 border-amber-300 ring-2 ring-amber-400 animate-pulse"
                              : "bg-slate-700 hover:bg-slate-600 border-slate-500/50"
                          }`,
                          title: "Mirar e Disparar Seixo (Clique Direito do Mouse)",
                          children: [
                            h.jsx("span", { className: "text-[13px]", children: "⚪" }),
                            h.jsx("span", { className: "text-[11px]", children: isPebbleAiming ? "Mirando..." : "Seixo" }),
                            h.jsx("span", { className: "hidden xl:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-slate-200 font-mono", children: "Shift" })
                          ],
                        }),
                      !isDevMode &&
                        h.jsxs("button", {
                          id: "hud-interact-btn",
                          onClick: j,
                          className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md transition border active:scale-95 ${oa ? "bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-400/60 ring-1 ring-emerald-400/50" : "bg-blue-700 hover:bg-blue-600 text-white border-blue-500/50"}`,
                          title: oa
                            ? "Descansar & Salvar Jogo (Tecla F)"
                            : "Interagir / Coletar / Usar (Tecla F)",
                          children: [
                            oa
                              ? h.jsx(Bu, {
                                  className: "h-3.5 w-3.5 text-emerald-200",
                                })
                              : h.jsx(Lp, {
                                  className: "h-3.5 w-3.5 text-blue-200",
                                }),
                            h.jsx("span", {
                              className: "text-[11px] whitespace-nowrap",
                              children: oa
                                ? ga
                                  ? "Salvar Novamente"
                                  : "Descansar & Salvar"
                                : "Interagir",
                            }),
                            h.jsx("span", {
                              className:
                                "hidden xl:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-slate-200 font-mono",
                              children: "E",
                            }),
                          ],
                        }),
                      oa &&
                        (fa
                          ? h.jsxs("button", {
                              id: "hud-roasting-status-btn",
                              onClick: Oe === 0 ? j : X,
                              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md transition border active:scale-95 ${Oe === 0 ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 shadow-emerald-950/50 animate-bounce" : "bg-amber-950/90 text-amber-200 border-amber-500/50"}`,
                              title:
                                Oe === 0
                                  ? "🍢 Peixe assado e pronto para saborear! Pressione [F] para coletar"
                                  : `⏳ Assando nas brasas da fogueira... Faltam ${Oe} segundos.`,
                              children: [
                                h.jsx("span", {
                                  className: "text-xs",
                                  children: "🍢",
                                }),
                                h.jsx("span", {
                                  className:
                                    "text-[11px] whitespace-nowrap font-mono",
                                  children:
                                    Oe === 0
                                      ? "Coletar Peixe!"
                                      : `Assando (${Oe}s)`,
                                }),
                                Oe === 0 &&
                                  h.jsx("span", {
                                    className:
                                      "hidden xl:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-emerald-200 font-mono",
                                    children: "E",
                                  }),
                              ],
                            })
                          : h.jsxs("button", {
                              id: "hud-roast-fish-btn",
                              onClick: X,
                              className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md transition border active:scale-95 ${Ae > 0 && Se >= 1 ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-300/80 shadow-amber-950/40 animate-pulse" : "bg-slate-800/80 text-slate-400 border-slate-700/60"}`,
                              title:
                                Ae > 0 && Se >= 1
                                  ? "Deixar peixe assando no espeto de galho (1 minuto) - Tecla T"
                                  : "Requer 1 Peixe Cru e 1 Galho no inventário para assar no espeto",
                              children: [
                                h.jsx("span", {
                                  className: "text-xs",
                                  children: "🍢",
                                }),
                                h.jsx("span", {
                                  className: "text-[11px] whitespace-nowrap",
                                  children: "Assar Peixe",
                                }),
                                h.jsx("span", {
                                  className:
                                    "hidden xl:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-amber-200 font-mono",
                                  children: "T",
                                }),
                              ],
                            })),
                      h.jsxs("button", {
                        id: "hud-torch-btn",
                        onClick: K || (() => g(!f)),
                        className: `flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition ${f ? "bg-amber-500 text-slate-950 shadow-md border border-amber-300/40" : "text-slate-300 hover:text-white hover:bg-slate-800"}`,
                        title: "Tocha das Cavernas (Tecla L)",
                        children: [
                          h.jsx(Lr, {
                            className: `h-3.5 w-3.5 ${f ? "fill-amber-300" : "text-amber-400"}`,
                          }),
                          h.jsx("span", {
                            className: "hidden md:inline text-[11px]",
                            children: "Tocha",
                          }),
                        ],
                      }),
                      (_ == null ? void 0 : _.cinto) &&
                        h.jsxs("div", {
                          className:
                            "flex items-center gap-1 bg-black/45 p-0.5 rounded-lg border border-amber-500/40",
                          children: [
                            h.jsxs("button", {
                              id: "hud-belt-slot-1-btn",
                              onClick: () => I && I("cinto_slot1"),
                              className: `relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-900/90 border hover:border-amber-400 active:scale-95 transition cursor-pointer ${ct ? "border-sky-500/60" : "border-amber-500/40"}`,
                              title: qr,
                              children: [
                                _.cinto_slot1
                                  ? h.jsx(ItemIcon, { item: _.cinto_slot1, size: 20 })
                                  : h.jsx("span", {
                                      className:
                                        "text-[9px] font-mono text-amber-500/40 font-bold",
                                      children: "1",
                                    }),
                                _.cinto_slot1 &&
                                  (_.cinto_slot1.stackCount || 1) > 1 &&
                                  h.jsx("span", {
                                    className:
                                      "absolute -bottom-1 -right-1 px-1 rounded-full bg-amber-500 text-black text-[7px] font-mono font-bold leading-tight shadow",
                                    children: _.cinto_slot1.stackCount,
                                  }),
                                h.jsx("span", {
                                  className:
                                    "absolute -top-1 -left-1 px-0.5 rounded bg-black/80 text-[7px] font-mono text-amber-300 font-bold border border-amber-500/40",
                                  children: "1",
                                }),
                              ],
                            }),
                            h.jsxs("button", {
                              id: "hud-belt-slot-2-btn",
                              onClick: () => I && I("cinto_slot2"),
                              className: `relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-900/90 border hover:border-amber-400 active:scale-95 transition cursor-pointer ${_t ? "border-sky-500/60" : "border-amber-500/40"}`,
                              title: zo,
                              children: [
                                _.cinto_slot2
                                  ? h.jsx(ItemIcon, { item: _.cinto_slot2, size: 20 })
                                  : h.jsx("span", {
                                      className:
                                        "text-[9px] font-mono text-amber-500/40 font-bold",
                                      children: "2",
                                    }),
                                _.cinto_slot2 &&
                                  (_.cinto_slot2.stackCount || 1) > 1 &&
                                  h.jsx("span", {
                                    className:
                                      "absolute -bottom-1 -right-1 px-1 rounded-full bg-amber-500 text-black text-[7px] font-mono font-bold leading-tight shadow",
                                    children: _.cinto_slot2.stackCount,
                                  }),
                                h.jsx("span", {
                                  className:
                                    "absolute -top-1 -left-1 px-0.5 rounded bg-black/80 text-[7px] font-mono text-amber-300 font-bold border border-amber-500/40",
                                  children: "2",
                                }),
                              ],
                            }),
                          ],
                        }),
                      !isDevMode &&
                        h.jsxs("button", {
                          id: "hud-inventory-btn",
                          onClick: V,
                          className:
                            "flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition border border-amber-400/40",
                          title: `Abrir Inventário e Equipamentos (Tecla E) - ${je}/${we} slots`,
                          children: [
                            h.jsx(uo, { className: "h-3.5 w-3.5" }),
                            h.jsx("span", {
                              className: "hidden sm:inline text-[11px]",
                              children: "Inventário",
                            }),
                            h.jsxs("span", {
                              className: `text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${Be === "mochila" ? "bg-indigo-950/90 border-indigo-400/60 text-indigo-200" : Be === "bolsa" ? "bg-emerald-950/90 border-emerald-400/60 text-emerald-200" : "bg-black/50 border-white/20 text-amber-200"}`,
                              children: [je, "/", we],
                            }),
                          ],
                        }),
                      h.jsx("button", {
                        id: "hud-toggle-more-tools-btn",
                        onClick: () => xe(!_e),
                        className: `p-1.5 rounded-lg text-xs transition ${_e ? "bg-slate-700 text-sky-300" : "text-slate-400 hover:text-white hover:bg-slate-800"}`,
                        title: _e
                          ? "Recolher ferramentas extras"
                          : "Mais ferramentas (Zoom, Hora, Seed)",
                        children: h.jsx(Lu, { className: "h-3.5 w-3.5" }),
                      }),
                    ],
                  }),
                  _e &&
                    h.jsxs("div", {
                      className:
                        "flex flex-col items-end gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-md animate-in fade-in duration-150",
                      children: [
                        h.jsxs("div", {
                          className:
                            "flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/10",
                          children: [
                            h.jsx("button", {
                              id: "hud-zoom-out-btn",
                              onClick: () =>
                                w((We) =>
                                  Math.max(0.25, +(We - 0.15).toFixed(2)),
                                ),
                              className:
                                "p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition",
                              title: "Afastar Zoom",
                              children: h.jsx(Qp, { className: "h-3 w-3" }),
                            }),
                            h.jsxs("span", {
                              className:
                                "text-[10px] font-mono text-sky-300 min-w-[32px] text-center font-semibold",
                              children: [Math.round(y * 100), "%"],
                            }),
                            h.jsx("button", {
                              id: "hud-zoom-in-btn",
                              onClick: () =>
                                w((We) =>
                                  Math.min(2.5, +(We + 0.15).toFixed(2)),
                                ),
                              className:
                                "p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition",
                              title: "Aproximar Zoom",
                              children: h.jsx(Zp, { className: "h-3 w-3" }),
                            }),
                            h.jsx("button", {
                              id: "hud-grid-btn",
                              onClick: () => T(!v),
                              className: `p-1 rounded text-xs transition ml-1 ${v ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`,
                              title: "Alternar Grade de Tiles",
                              children: h.jsx(zp, { className: "h-3 w-3" }),
                            }),
                          ],
                        }),
                        h.jsxs("div", {
                          className:
                            "flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-sky-500/30 w-full justify-between",
                          children: [
                            h.jsxs("div", {
                              className:
                                "flex items-center gap-1 text-[10px] text-sky-300 font-semibold shrink-0",
                              children: [
                                h.jsx(Vp, { className: "h-3 w-3 text-sky-400" }),
                                h.jsx("span", { children: "Bioma:" }),
                              ],
                            }),
                            h.jsx("select", {
                              id: "hud-dev-biome-select",
                              value: (e && e.id) || "",
                              onChange: (We) => {
                                const val = We.target.value;
                                if (We.target && typeof We.target.blur === "function") We.target.blur();
                                if (val && p) p(val);
                              },
                              onKeyDown: (We) => {
                                if (/^(Key[WASD]|Arrow|Space)/i.test(We.code || "")) {
                                  We.preventDefault();
                                  if (We.currentTarget && typeof We.currentTarget.blur === "function") We.currentTarget.blur();
                                }
                              },
                              className:
                                "bg-slate-800 text-sky-100 text-[10px] font-medium rounded px-1.5 py-0.5 border border-sky-400/40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-400 max-w-[130px] truncate",
                              title: "Teleportar para Bioma (Modo Desenvolvedor)",
                              children: Object.values(BIOMES).map((We) =>
                                h.jsx(
                                  "option",
                                  { value: We.id, children: We.namePt },
                                  We.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                        h.jsxs("div", {
                          className:
                            "flex flex-col gap-1 bg-black/40 px-2 py-1.5 rounded-lg border border-white/10 w-full",
                          children: [
                            h.jsxs("div", {
                              className: "flex items-center gap-1.5 w-full justify-between",
                              children: [
                                h.jsx(Fp, {
                                  className: "h-3 w-3 text-amber-400 shrink-0",
                                }),
                                h.jsx("input", {
                                  id: "hud-time-slider",
                                  type: "range",
                                  min: "0",
                                  max: "1",
                                  step: "0.005",
                                  value: o,
                                  onChange: (We) => u(parseFloat(We.target.value)),
                                  className:
                                    "w-20 accent-amber-400 cursor-pointer h-1 bg-slate-700 rounded",
                                  title: "Horário do Ciclo Dia/Noite",
                                }),
                                h.jsx(Bp, {
                                  className: "h-3 w-3 text-indigo-400 shrink-0",
                                }),
                                h.jsxs("span", {
                                  className:
                                    "text-[9px] font-mono text-slate-300 text-right truncate",
                                  title: `Horário: ${formatClock()} | Escurecimento: ${darknessPct}%`,
                                  children: [tr(), " (", darknessPct, "%)"],
                                }),
                              ],
                            }),
                            h.jsxs("div", {
                              className: "flex items-center justify-between gap-1 pt-0.5 border-t border-white/5",
                              children: [
                                h.jsx("span", {
                                  className: "text-[9px] text-amber-300/90 font-semibold shrink-0",
                                  children: "⏱️ Ciclo:",
                                }),
                                h.jsx("select", {
                                  id: "hud-cycle-duration-select",
                                  value: [30, 60, 120, 300, 600, 1200, 1800, 2400, 3600].includes(Number(cycleDurationSec))
                                    ? String(cycleDurationSec)
                                    : "custom",
                                  onChange: (We) => {
                                    const v = Number(We.target.value);
                                    if (v > 0) setCycleDurationSec(v);
                                  },
                                  className:
                                    "bg-slate-800 text-amber-200 text-[9px] font-mono rounded px-1 py-0.5 border border-amber-500/40 cursor-pointer focus:outline-none",
                                  title: "Escolher duração do ciclo Dia/Noite (Modo Desenvolvedor)",
                                  children: [
                                    h.jsx("option", { value: "30", children: "30s (15s D / 15s N)" }),
                                    h.jsx("option", { value: "60", children: "1m (30s D / 30s N)" }),
                                    h.jsx("option", { value: "120", children: "2m (1m D / 1m N)" }),
                                    h.jsx("option", { value: "300", children: "5m (2.5m D / 2.5m N)" }),
                                    h.jsx("option", { value: "600", children: "10m (5m D / 5m N)" }),
                                    h.jsx("option", { value: "1200", children: "20m (10m D / 10m N)" }),
                                    h.jsx("option", { value: "1800", children: "30m (15m D / 15m N)" }),
                                    h.jsx("option", { value: "2400", children: "40m (20m D / 20m N)" }),
                                    h.jsx("option", { value: "3600", children: "60m (30m D / 30m N)" }),
                                    ![30, 60, 120, 300, 600, 1200, 1800, 2400, 3600].includes(Number(cycleDurationSec)) &&
                                      h.jsx("option", {
                                        value: "custom",
                                        children: `${+(cycleDurationSec / 60).toFixed(1)}m (${+(cycleDurationSec / 120).toFixed(1)}m D/N)`,
                                      }),
                                  ],
                                }),
                                h.jsx("button", {
                                  type: "button",
                                  onClick: () => setCyclePaused(!cyclePaused),
                                  className: `px-1.5 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                                    cyclePaused
                                      ? "bg-rose-600/80 text-white"
                                      : "bg-emerald-700/80 text-emerald-100 hover:bg-emerald-600"
                                  }`,
                                  title: cyclePaused ? "Retomar avanço automático do tempo" : "Pausar ciclo Dia/Noite",
                                  children: cyclePaused ? "⏸️" : "▶️",
                                }),
                              ],
                            }),
                          ],
                        }),
                        h.jsxs("div", {
                          className:
                            "flex items-center gap-1 w-full justify-end",
                          children: [
                            h.jsxs("button", {
                              id: "hud-reroll-seed-btn",
                              onClick: S,
                              className:
                                "flex items-center gap-1 px-2 py-1 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white text-[10px] font-medium transition shadow-sm",
                              title: "Gerar Novo Mundo Aleatório",
                              children: [
                                h.jsx(Gp, { className: "h-3 w-3" }),
                                h.jsx("span", { children: "Seed" }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  $ &&
                    z &&
                    h.jsxs("button", {
                      id: "hud-recenter-camera-btn",
                      onClick: z,
                      className:
                        "flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold shadow-xl border border-sky-300/40 backdrop-blur-md transition-all animate-pulse",
                      title: "Recentralizar no Personagem (Tecla C)",
                      children: [
                        h.jsx(Ou, { className: "h-3 w-3" }),
                        h.jsx("span", { children: "Recentralizar" }),
                      ],
                    }),
                ],
              }),
            ],
          }),
        A &&
          h.jsx("div", {
            className:
              "pointer-events-none absolute bottom-24 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 transition-all animate-bounce",
            children: h.jsxs("div", {
              className:
                "flex items-center gap-2 rounded-full border border-sky-400/80 bg-slate-950/95 px-4 py-2 text-xs sm:text-sm font-semibold text-sky-200 shadow-2xl backdrop-blur-md",
              children: [
                h.jsx(Or, { className: "h-4 w-4 text-amber-400" }),
                h.jsx("span", { children: A }),
              ],
            }),
          }),
        !isImmersive &&
          h.jsxs("div", {
            className:
              "pointer-events-auto hidden md:flex items-center gap-1 absolute bottom-36 left-4 z-20",
            children: [
              h.jsxs("button", {
                id: "hud-toggle-help-legend-btn",
                onClick: () => Sa(!He),
                className:
                  "flex items-center gap-1 bg-slate-900/60 hover:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-slate-400 hover:text-slate-200 backdrop-blur-md transition",
                title: "Ver controles do teclado",
                children: [
                  h.jsx(Du, { className: "h-3 w-3 text-sky-400" }),
                  h.jsx("span", { children: "Controles" }),
                ],
              }),
              He &&
                h.jsxs("div", {
                  className:
                    "flex items-center gap-2 bg-slate-900/85 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 backdrop-blur-md shadow-lg animate-in fade-in duration-150",
                  children: [
                    h.jsxs("div", {
                      className: "flex items-center gap-1",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white",
                          children: "WASD",
                        }),
                        h.jsx("span", {
                          className: "text-slate-400",
                          children: "Mover",
                        }),
                      ],
                    }),
                    h.jsx("span", {
                      className: "text-slate-600",
                      children: "•",
                    }),
                    h.jsxs("div", {
                      className: "flex items-center gap-1 text-emerald-300",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-emerald-300",
                          children: "2x Toque / Shift",
                        }),
                        h.jsx("span", { children: "Correr" }),
                      ],
                    }),
                    h.jsx("span", {
                      className: "text-slate-600",
                      children: "•",
                    }),
                    h.jsxs("div", {
                      className: "flex items-center gap-1 text-amber-200",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white",
                          children: "E",
                        }),
                        h.jsx("span", { children: "Coletar / Usar" }),
                      ],
                    }),
                    h.jsx("span", {
                      className: "text-slate-600",
                      children: "•",
                    }),
                    h.jsxs("div", {
                      className: "flex items-center gap-1 text-rose-300",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white",
                          children: "Espaço / F",
                        }),
                        h.jsx("span", { children: "Combate" }),
                      ],
                    }),
                    h.jsx("span", {
                      className: "text-slate-600",
                      children: "•",
                    }),
                    h.jsxs("div", {
                      className: "flex items-center gap-1 text-amber-300",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white",
                          children: "I",
                        }),
                        h.jsx("span", { children: "Inventário" }),
                      ],
                    }),
                    h.jsx("span", {
                      className: "text-slate-600",
                      children: "•",
                    }),
                    h.jsxs("div", {
                      className: "flex items-center gap-1 text-sky-300",
                      children: [
                        h.jsx("span", {
                          className:
                            "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white",
                          children: "C",
                        }),
                        h.jsx("span", { children: "Câmera" }),
                      ],
                    }),
                    (_ == null ? void 0 : _.cinto) &&
                      h.jsxs(h.Fragment, {
                        children: [
                          h.jsx("span", {
                            className: "text-slate-600",
                            children: "•",
                          }),
                          h.jsxs("div", {
                            className: "flex items-center gap-1 text-amber-300",
                            children: [
                              h.jsx("span", {
                                className:
                                  "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-amber-300 font-bold",
                                children: "1",
                              }),
                              h.jsx("span", { children: "Mão Esq ⇄ Bolso 1" }),
                            ],
                          }),
                          h.jsx("span", {
                            className: "text-slate-600",
                            children: "•",
                          }),
                          h.jsxs("div", {
                            className: "flex items-center gap-1 text-amber-300",
                            children: [
                              h.jsx("span", {
                                className:
                                  "font-mono bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-amber-300 font-bold",
                                children: "2",
                              }),
                              h.jsx("span", { children: "Mão Dir ⇄ Bolso 2" }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
            ],
          }),
        !isImmersive &&
          (_ == null ? void 0 : _.cinto) &&
          h.jsxs("div", {
            id: "hud-belt-quickswap-bar",
            className:
              "pointer-events-auto hidden md:flex items-center gap-2.5 fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-950/92 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-500/50 shadow-2xl shadow-black/80 select-none animate-in fade-in slide-in-from-bottom-2 duration-200",
            style: { bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" },
            children: [
              h.jsxs("div", {
                className:
                  "flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider pr-2 border-r border-amber-500/30",
                children: [
                  h.jsx("span", { className: "text-base", children: "🥋" }),
                  h.jsx("span", {
                    className:
                      "hidden xl:inline text-[10px] tracking-widest text-amber-300",
                    children: "Cinto",
                  }),
                ],
              }),
              h.jsxs("button", {
                id: "hud-quickswap-btn-slot1",
                onClick: () => I && I("cinto_slot1"),
                className: `group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-md ${ct ? "bg-slate-900/90 border-sky-500/50 hover:border-sky-400 hover:bg-slate-800/90 hover:shadow-sky-500/20" : "bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:bg-slate-800/90 hover:shadow-amber-500/20"}`,
                title: qr,
                children: [
                  h.jsx("span", {
                    className:
                      "font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow",
                    children: "1",
                  }),
                  h.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      _.mao_esquerda
                        ? h.jsxs("div", {
                            className:
                              "relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-amber-500/30 shadow-inner",
                            children: [
                              h.jsx(ItemIcon, { item: _.mao_esquerda, size: 18 }),
                              (_.mao_esquerda.stackCount || 1) > 1 &&
                                h.jsx("span", {
                                  className:
                                    "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-1 bg-amber-500 text-black rounded-full leading-tight shadow",
                                  children: _.mao_esquerda.stackCount,
                                }),
                            ],
                          })
                        : h.jsx("div", {
                            className:
                              "flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/80 border border-dashed border-white/20 text-slate-500 text-xs",
                            title: "Mão Esquerda Vazia",
                            children: "✋",
                          }),
                      h.jsxs("div", {
                        className: "flex flex-col text-left",
                        children: [
                          h.jsx("span", {
                            className:
                              "text-[9px] text-slate-400 font-medium leading-none",
                            children: "Mão Esq",
                          }),
                          h.jsx("span", {
                            className:
                              "text-[11px] font-bold text-slate-200 truncate max-w-[65px] leading-tight",
                            children: _.mao_esquerda
                              ? _.mao_esquerda.name
                              : "Vazia",
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsx("div", {
                    className:
                      "p-1 rounded-full bg-black/40 border border-amber-500/30 text-amber-400 group-hover:text-amber-300 group-hover:scale-110 group-hover:rotate-180 transition-all duration-300",
                    children: h.jsx(di, { className: "h-3.5 w-3.5" }),
                  }),
                  h.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      h.jsxs("div", {
                        className: "flex flex-col text-right",
                        children: [
                          h.jsx("span", {
                            className:
                              "text-[9px] text-amber-400/80 font-medium leading-none",
                            children: "Bolso 1",
                          }),
                          h.jsx("span", {
                            className:
                              "text-[11px] font-bold text-amber-200 truncate max-w-[65px] leading-tight",
                            children: _.cinto_slot1
                              ? _.cinto_slot1.name
                              : "Vazio",
                          }),
                        ],
                      }),
                      _.cinto_slot1
                        ? h.jsxs("div", {
                            className:
                              "relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-amber-500/40 shadow-inner",
                            children: [
                              h.jsx(ItemIcon, { item: _.cinto_slot1, size: 18 }),
                              (_.cinto_slot1.stackCount || 1) > 1 &&
                                h.jsx("span", {
                                  className:
                                    "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-1 bg-amber-500 text-black rounded-full leading-tight shadow",
                                  children: _.cinto_slot1.stackCount,
                                }),
                            ],
                          })
                        : h.jsx("div", {
                            className:
                              "flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/80 border border-dashed border-amber-500/30 text-amber-500/50 text-[10px] font-mono font-bold",
                            title: "Bolso 1 Vazio",
                            children: "1",
                          }),
                    ],
                  }),
                  ct &&
                    h.jsx("span", {
                      className:
                        "text-[8px] font-bold px-1 rounded bg-sky-950/90 text-sky-200 border border-sky-500/40",
                      children: "→ Mochila",
                    }),
                ],
              }),
              h.jsxs("button", {
                id: "hud-quickswap-btn-slot2",
                onClick: () => I && I("cinto_slot2"),
                className: `group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-md ${_t ? "bg-slate-900/90 border-sky-500/50 hover:border-sky-400 hover:bg-slate-800/90 hover:shadow-sky-500/20" : "bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:bg-slate-800/90 hover:shadow-amber-500/20"}`,
                title: zo,
                children: [
                  h.jsx("span", {
                    className:
                      "font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow",
                    children: "2",
                  }),
                  h.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      _.mao_direita
                        ? h.jsxs("div", {
                            className:
                              "relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-amber-500/30 shadow-inner",
                            children: [
                              h.jsx(ItemIcon, { item: _.mao_direita, size: 18 }),
                              (_.mao_direita.stackCount || 1) > 1 &&
                                h.jsx("span", {
                                  className:
                                    "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-1 bg-amber-500 text-black rounded-full leading-tight shadow",
                                  children: _.mao_direita.stackCount,
                                }),
                            ],
                          })
                        : h.jsx("div", {
                            className:
                              "flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/80 border border-dashed border-white/20 text-slate-500 text-xs",
                            title: "Mão Direita Vazia",
                            children: "✋",
                          }),
                      h.jsxs("div", {
                        className: "flex flex-col text-left",
                        children: [
                          h.jsx("span", {
                            className:
                              "text-[9px] text-slate-400 font-medium leading-none",
                            children: "Mão Dir",
                          }),
                          h.jsx("span", {
                            className:
                              "text-[11px] font-bold text-slate-200 truncate max-w-[65px] leading-tight",
                            children: _.mao_direita
                              ? _.mao_direita.name
                              : "Vazia",
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsx("div", {
                    className:
                      "p-1 rounded-full bg-black/40 border border-amber-500/30 text-amber-400 group-hover:text-amber-300 group-hover:scale-110 group-hover:rotate-180 transition-all duration-300",
                    children: h.jsx(di, { className: "h-3.5 w-3.5" }),
                  }),
                  h.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      h.jsxs("div", {
                        className: "flex flex-col text-right",
                        children: [
                          h.jsx("span", {
                            className:
                              "text-[9px] text-amber-400/80 font-medium leading-none",
                            children: "Bolso 2",
                          }),
                          h.jsx("span", {
                            className:
                              "text-[11px] font-bold text-amber-200 truncate max-w-[65px] leading-tight",
                            children: _.cinto_slot2
                              ? _.cinto_slot2.name
                              : "Vazio",
                          }),
                        ],
                      }),
                      _.cinto_slot2
                        ? h.jsxs("div", {
                            className:
                              "relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-amber-500/40 shadow-inner",
                            children: [
                              h.jsx(ItemIcon, { item: _.cinto_slot2, size: 18 }),
                              (_.cinto_slot2.stackCount || 1) > 1 &&
                                h.jsx("span", {
                                  className:
                                    "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-1 bg-amber-500 text-black rounded-full leading-tight shadow",
                                  children: _.cinto_slot2.stackCount,
                                }),
                            ],
                          })
                        : h.jsx("div", {
                            className:
                              "flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/80 border border-dashed border-amber-500/30 text-amber-500/50 text-[10px] font-mono font-bold",
                            title: "Bolso 2 Vazio",
                            children: "2",
                          }),
                    ],
                  }),
                  _t &&
                    h.jsx("span", {
                      className:
                        "text-[8px] font-bold px-1 rounded bg-sky-950/90 text-sky-200 border border-sky-500/40",
                      children: "→ Mochila",
                    }),
                ],
              }),
            ],
          }),
        $ &&
          z &&
          h.jsxs("button", {
            id: "mobile-floating-recenter-btn",
            onClick: z,
            className:
              "pointer-events-auto md:hidden absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold shadow-xl border border-sky-300/50 animate-pulse active:scale-95",
            children: [
              h.jsx(Ou, { className: "h-3.5 w-3.5" }),
              h.jsx("span", { children: "Recentralizar Câmera" }),
            ],
          }),
        h.jsxs("div", {
          id: "hud-bottom-left-controls",
          className:
            "pointer-events-auto fixed bottom-6 left-4 z-30 flex flex-col items-start gap-2 select-none",
          style: { bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" },
          children: [
            (_ == null ? void 0 : _.cinto) &&
              h.jsxs("div", {
                className: "flex items-center gap-1.5",
                children: [
                  h.jsxs("button", {
                    id: "touch-belt-swap-1-btn",
                    onClick: () => I && I("cinto_slot1"),
                    className: `flex items-center gap-1.5 px-2 py-1.5 rounded-xl border backdrop-blur-md shadow-lg active:scale-90 transition-transform ${ct ? "bg-slate-900/95 border-sky-500/70 text-sky-100 shadow-sky-950/40" : "bg-slate-900/95 border-amber-500/70 text-amber-100 shadow-amber-950/40"}`,
                    title: qr,
                    children: [
                      h.jsx("span", {
                        className:
                          "font-mono text-[9px] font-black px-1 py-0.2 rounded bg-amber-500 text-slate-950",
                        children: "1",
                      }),
                      h.jsxs("div", {
                        className: "flex items-center gap-1",
                        children: [
                          _.mao_esquerda
                            ? h.jsx(ItemIcon, { item: _.mao_esquerda, size: 15 })
                            : h.jsx("span", {
                                className: "text-[10px]",
                                children: "✋",
                              }),
                          h.jsx(di, { className: "h-3 w-3 text-amber-400" }),
                          _.cinto_slot1
                            ? h.jsxs("div", {
                                className: "relative",
                                children: [
                                  h.jsx(ItemIcon, { item: _.cinto_slot1, size: 15 }),
                                  (_.cinto_slot1.stackCount || 1) > 1 &&
                                    h.jsx("span", {
                                      className:
                                        "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-0.5 bg-amber-500 text-black rounded-full leading-none",
                                      children: _.cinto_slot1.stackCount,
                                    }),
                                ],
                              })
                            : h.jsx("span", {
                                className:
                                  "text-[9px] font-mono text-amber-500/60 font-bold",
                                children: "B1",
                              }),
                        ],
                      }),
                      h.jsx("span", {
                        className:
                          "text-[9px] font-bold text-amber-200 whitespace-nowrap",
                        children: "Troca Esq",
                      }),
                    ],
                  }),
                  h.jsxs("button", {
                    id: "touch-belt-swap-2-btn",
                    onClick: () => I && I("cinto_slot2"),
                    className: `flex items-center gap-1.5 px-2 py-1.5 rounded-xl border backdrop-blur-md shadow-lg active:scale-90 transition-transform ${_t ? "bg-slate-900/95 border-sky-500/70 text-sky-100 shadow-sky-950/40" : "bg-slate-900/95 border-amber-500/70 text-amber-100 shadow-amber-950/40"}`,
                    title: zo,
                    children: [
                      h.jsx("span", {
                        className:
                          "font-mono text-[9px] font-black px-1 py-0.2 rounded bg-amber-500 text-slate-950",
                        children: "2",
                      }),
                      h.jsxs("div", {
                        className: "flex items-center gap-1",
                        children: [
                          _.mao_direita
                            ? h.jsx(ItemIcon, { item: _.mao_direita, size: 15 })
                            : h.jsx("span", {
                                className: "text-[10px]",
                                children: "✋",
                              }),
                          h.jsx(di, { className: "h-3 w-3 text-amber-400" }),
                          _.cinto_slot2
                            ? h.jsxs("div", {
                                className: "relative",
                                children: [
                                  h.jsx(ItemIcon, { item: _.cinto_slot2, size: 15 }),
                                  (_.cinto_slot2.stackCount || 1) > 1 &&
                                    h.jsx("span", {
                                      className:
                                        "absolute -bottom-1 -right-1 text-[7px] font-mono font-bold px-0.5 bg-amber-500 text-black rounded-full leading-none",
                                      children: _.cinto_slot2.stackCount,
                                    }),
                                ],
                              })
                            : h.jsx("span", {
                                className:
                                  "text-[9px] font-mono text-amber-500/60 font-bold",
                                children: "B2",
                              }),
                        ],
                      }),
                      h.jsx("span", {
                        className:
                          "text-[9px] font-bold text-amber-200 whitespace-nowrap",
                        children: "Troca Dir",
                      }),
                    ],
                  }),
                ],
              }),
            h.jsxs("div", {
              className: "flex items-end gap-2",
              style: { display: "flex", alignItems: "flex-end", gap: "8px" },
              children: [
                h.jsxs("div", {
                  className: "campfire-vertical-col flex flex-col items-center gap-2",
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
                  children: [
                    ((nearbyLogPileProp &&
                      nearbyLogPileProp.prop &&
                      (nearbyLogPileProp.prop.count || 1) >= 5) ||
                      (cabinPlacementPreviewProp && cabinPlacementPreviewProp.active)) &&
                      h.jsxs("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                          cabinPlacementPreviewProp &&
                            cabinPlacementPreviewProp.active &&
                            onCancelCabinPlacementProp &&
                            h.jsxs("button", {
                              id: "touch-cancel-cabin-btn",
                              onClick: onCancelCabinPlacementProp,
                              style: {
                                width: "38px",
                                height: "44px",
                                minWidth: "38px",
                                minHeight: "44px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              className:
                                "flex flex-col items-center justify-center rounded-xl border font-bold shadow-lg backdrop-blur-sm active:scale-90 transition-all bg-slate-800/80 border-white/20 text-rose-300",
                              title: "Cancelar posicionamento (Esc)",
                              children: [
                                h.jsx("span", {
                                  className: "text-xs leading-none",
                                  style: { fontSize: "12px", lineHeight: 1 },
                                  children: "✖",
                                }),
                                h.jsx("span", {
                                  className: "text-[8px] font-black tracking-wider uppercase leading-none mt-0.5 font-mono",
                                  style: { fontSize: "6.5px", lineHeight: 1, letterSpacing: "0.02em", marginTop: "2px", whiteSpace: "nowrap" },
                                  children: "SAIR",
                                }),
                              ],
                            }),
                          h.jsxs("button", {
                            id: "touch-build-cabin-btn",
                            onClick: onBuildCabinProp,
                            style: {
                              width: cabinPlacementPreviewProp && cabinPlacementPreviewProp.active ? "58px" : "44px",
                              height: "44px",
                              minWidth: cabinPlacementPreviewProp && cabinPlacementPreviewProp.active ? "58px" : "44px",
                              minHeight: "44px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "2px",
                            },
                            className:
                              cabinPlacementPreviewProp && cabinPlacementPreviewProp.active
                                ? "flex flex-col items-center justify-center rounded-xl border border-amber-400/50 bg-amber-600/85 text-white font-bold shadow-lg active:scale-90 transition-all backdrop-blur-sm"
                                : "flex flex-col items-center justify-center w-11 h-11 rounded-xl border border-white/20 bg-slate-800/80 text-amber-400 font-bold shadow-lg active:scale-90 transition-all backdrop-blur-sm",
                            title:
                              cabinPlacementPreviewProp && cabinPlacementPreviewProp.active
                                ? cabinPlacementPreviewProp.mode === "chest"
                                  ? "Confirmar local e posicionar Baú de Madeira (Tecla C ou Enter)"
                                  : "Confirmar local e construir Cabana (Tecla C ou Enter)"
                                : "Escolher local para construir Cabana (5 Troncos) - Tecla C",
                            children: [
                              h.jsx("span", {
                                className: "text-sm leading-none",
                                style: { fontSize: "14px", lineHeight: 1 },
                                children:
                                  cabinPlacementPreviewProp && cabinPlacementPreviewProp.active
                                    ? cabinPlacementPreviewProp.mode === "chest"
                                      ? "📦"
                                      : "✅"
                                    : "🛖",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[8px] font-black tracking-wider uppercase leading-none mt-0.5 font-mono",
                                style: { fontSize: "7px", lineHeight: 1, letterSpacing: "0.02em", marginTop: "2px", whiteSpace: "nowrap" },
                                children:
                                  cabinPlacementPreviewProp && cabinPlacementPreviewProp.active
                                    ? cabinPlacementPreviewProp.mode === "chest"
                                      ? "BAÚ"
                                      : "OK"
                                    : "CASA",
                              }),
                            ],
                          }),
                        ],
                      }),
                    oe &&
                      h.jsxs("div", {
                        id: "touch-campfire-options-col",
                        className: "campfire-vertical-col flex flex-col items-center gap-2",
                        style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
                        children: [
                          oa &&
                            (fa
                              ? h.jsxs("button", {
                                  id: "touch-roast-fish-btn",
                                  onClick: Oe === 0 ? j : X,
                                  style: { width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
                                  className: `flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 font-bold shadow-xl backdrop-blur-sm active:scale-90 transition-transform ${Oe === 0 ? "bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-300 text-white shadow-emerald-950/60 animate-bounce" : "bg-amber-950/90 border-amber-500/80 text-amber-200"}`,
                                  title: Oe === 0 ? "Peixe assado e pronto! Toque para saborear" : `Assando na fogueira... Faltam ${Oe}s`,
                                  children: [
                                    h.jsx("span", {
                                      className: "text-sm leading-none",
                                      children: "🍢",
                                    }),
                                    h.jsx("span", {
                                      className:
                                        "text-[8px] font-black tracking-wider uppercase leading-none mt-0.5 font-mono",
                                      style: { fontSize: "7px", lineHeight: 1, marginTop: "2px", whiteSpace: "nowrap" },
                                      children: Oe === 0 ? "COLETAR" : `${Oe}S`,
                                    }),
                                  ],
                                })
                              : h.jsxs("button", {
                                  id: "touch-roast-fish-btn",
                                  onClick: X,
                                  disabled: Ae === 0 || Se < 1,
                                  style: { width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
                                  className: `flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 font-bold shadow-xl backdrop-blur-sm active:scale-90 transition-transform ${Ae > 0 && Se >= 1 ? "bg-gradient-to-br from-amber-600 to-amber-700 border-amber-300/90 text-white shadow-amber-950/60 animate-pulse" : "bg-slate-800/80 border-slate-700/60 text-slate-400 opacity-60"}`,
                                  title: Ae > 0 && Se >= 1 ? "Assar Peixe no Espeto (1 minuto) - Tecla T" : "Requer 1 Peixe Cru e 1 Galho para assar",
                                  children: [
                                    h.jsx("span", {
                                      className: "text-sm leading-none",
                                      children: "🍢",
                                    }),
                                    h.jsx("span", {
                                      className:
                                        "text-[8px] font-black tracking-wider uppercase leading-none mt-0.5",
                                      children: "ASSAR",
                                    }),
                                  ],
                                })),
                          h.jsxs("button", {
                            id: "touch-feed-campfire-btn",
                            onClick: () => (Ne == null ? void 0 : Ne(10)),
                            disabled: Se < 10,
                            style: { width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
                            className: `flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 font-bold shadow-xl backdrop-blur-sm active:scale-90 transition-transform ${Se >= 10 ? "bg-gradient-to-br from-emerald-600 to-emerald-700 active:from-emerald-700 border-emerald-400/90 text-white shadow-emerald-950/60 animate-pulse" : "bg-slate-800/80 border-slate-700/60 text-slate-400 opacity-60"}`,
                            title: `Alimentar Fogueira (+10 Galhos) - Tecla G (Você tem: ${Se}/10)`,
                            children: [
                              h.jsx(Lr, { className: "h-4 w-4 text-emerald-100" }),
                              h.jsx("span", {
                                className:
                                  "text-[8px] font-black tracking-wider text-emerald-100 uppercase leading-none mt-0.5",
                                children: "+10 G",
                              }),
                            ],
                          }),
                          h.jsx("button", {
                            id: "touch-interact-btn",
                            onClick: j,
                            style: { width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
                            className: `flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 text-white font-bold shadow-xl backdrop-blur-sm active:scale-90 transition-transform ${oa ? "bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400/90 shadow-emerald-950/70 animate-pulse" : "bg-gradient-to-br from-amber-600 to-amber-700 border-amber-400/80 shadow-amber-950/60"}`,
                            title: oa
                              ? (ga ? "Salvar Novamente (Tecla F)" : "Descansar & Salvar Jogo (Tecla F)")
                              : "Acender Fogueira (Tecla F)",
                            children: oa
                              ? h.jsxs(h.Fragment, {
                                  children: [
                                    h.jsx(Bu, { className: "h-4 w-4 text-emerald-100" }),
                                    h.jsx("span", {
                                      className:
                                        "text-[8px] font-black tracking-wider text-emerald-100 uppercase leading-none mt-0.5",
                                      children: "SALVAR",
                                    }),
                                  ],
                                })
                              : h.jsxs(h.Fragment, {
                                  children: [
                                    h.jsx(Lr, { className: "h-4 w-4 text-amber-200" }),
                                    h.jsx("span", {
                                      className:
                                        "text-[8px] font-black tracking-wider text-amber-100 uppercase leading-none mt-0.5",
                                      children: "ACENDER",
                                    }),
                                  ],
                                }),
                          }),
                        ],
                      }),
                    h.jsx("button", {
                      id: "touch-torch-btn",
                      onClick: K || (() => g(!f)),
                      style: { width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" },
                      className: `flex items-center justify-center w-11 h-11 rounded-xl border text-sm font-bold shadow-lg transition-all backdrop-blur-sm active:scale-90 ${f ? "bg-amber-500/90 border-amber-300 text-slate-950 shadow-amber-500/40" : "bg-slate-800/80 border-white/20 text-amber-400"}`,
                      title: f ? "Desequipar e Guardar Tocha no Inventário (L)" : "Equipar Tocha (L)",
                      children: h.jsx(Lr, { className: "h-4 w-4" }),
                    }),
                  ],
                }),
                h.jsxs("button", {
                  id: "touch-inventory-btn",
                  onClick: V,
                  className:
                    "relative flex items-center justify-center w-11 h-11 rounded-xl border border-amber-400/50 bg-amber-600/85 text-white text-sm font-bold shadow-lg active:scale-90 transition-all backdrop-blur-sm",
                  title: `Abrir Itens e Forja (I) - ${je}/${we}`,
                  children: [
                    h.jsx(uo, { className: "h-4 w-4" }),
                    h.jsxs("span", {
                      className: `absolute -top-1.5 -right-1.5 text-[9px] font-mono font-bold px-1 rounded-full border ${Be === "mochila" ? "bg-indigo-950 text-indigo-300 border-indigo-400/70 shadow-sm" : Be === "bolsa" ? "bg-emerald-950 text-emerald-300 border-emerald-400/70 shadow-sm" : "bg-black/90 text-amber-300 border-amber-400/60"}`,
                      children: [je, "/", we],
                    }),
                  ],
                }),
              ],
            }),
            h.jsxs("div", {
              className: "flex items-center gap-2.5",
              children: [
                h.jsxs("button", {
                  id: "touch-combat-btn",
                  onClick: handleCombatClick,
                  className:
                    "flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 active:from-rose-700 active:to-rose-800 border-2 border-rose-400/80 text-white font-bold shadow-xl shadow-rose-950/60 backdrop-blur-sm active:scale-90 transition-transform",
                  title: "Atacar / Combate (Espaço ou F)",
                  children: [
                    h.jsx(Xs, { className: "h-5 w-5 text-rose-100" }),
                    h.jsx("span", {
                      className:
                        "text-[10px] font-black tracking-wider text-rose-100 uppercase",
                      children: "ATK",
                    }),
                  ],
                }),
                h.jsxs("button", {
                  id: "touch-pebble-btn",
                  onMouseDown: handlePebbleAimDown,
                  onMouseMove: handlePebbleAimMove,
                  onMouseUp: handlePebbleAimUp,
                  onTouchStart: handlePebbleAimDown,
                  onTouchMove: handlePebbleAimMove,
                  onTouchEnd: handlePebbleAimUp,
                  onTouchCancel: () => {
                    setIsPebbleAiming(!1);
                    pebbleAimTouchStart.current = null;
                    if (Xi) Xi();
                  },
                  onClick: () => {
                    if (!isPebbleAiming && !pebbleAimTouchStart.current && R) R();
                  },
                  className: `relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 font-bold shadow-xl backdrop-blur-sm select-none touch-none active:scale-90 transition-transform ${
                    isPebbleAiming
                      ? "bg-gradient-to-br from-amber-500 to-amber-700 active:from-amber-600 border-amber-300 text-white shadow-amber-950/70 scale-105 animate-pulse ring-2 ring-amber-400/80"
                      : hasPebbleEquipped
                        ? "bg-gradient-to-br from-slate-700 to-slate-800 active:from-slate-800 border-sky-400/80 text-white shadow-slate-950/60"
                        : "bg-gradient-to-br from-slate-800/90 to-slate-900/90 active:from-slate-900 border-slate-600/60 text-slate-300 shadow-slate-950/50"
                  }`,
                  title: "Arremessar Seixo / Mirar (Shift) - Toque rápido ou segure para mirar e arremessar",
                  children: [
                    h.jsx("span", {
                      className: `text-lg leading-none transition-transform ${isPebbleAiming ? "scale-125" : ""}`,
                      children: "⚪",
                    }),
                    h.jsx("span", {
                      className:
                        "text-[9px] font-black tracking-wider uppercase mt-0.5 text-slate-100",
                      children: isPebbleAiming ? "MIRANDO" : "SEIXO",
                    }),
                    h.jsx("span", {
                      className:
                        "absolute -bottom-1 text-[7px] font-mono px-1 rounded bg-black/70 text-amber-300 border border-white/10 leading-none",
                      children: "SHIFT",
                    }),
                    pebbleCount > 0 &&
                      h.jsx("span", {
                        className:
                          "absolute -top-1 -right-1 text-[8px] font-mono font-bold px-1 rounded-full bg-amber-500 text-black border border-amber-300 shadow leading-tight",
                        children: `${pebbleCount}x`,
                      }),
                  ],
                }),
                h.jsx("button", {
                  id: "touch-interact-btn",
                  onClick: j,
                  className:
                    "flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 text-white font-bold shadow-xl backdrop-blur-sm active:scale-90 transition-transform bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400/80 shadow-blue-950/60",
                  title: "Interagir / Abrir Porta / Coletar Item (Tecla E)",
                  children: h.jsxs(h.Fragment, {
                    children: [
                      h.jsx("span", {
                        className:
                          "text-base font-black leading-none text-white",
                        children: "E",
                      }),
                      h.jsx("span", {
                        className:
                          "text-[9px] font-semibold tracking-wide text-blue-100 uppercase mt-0.5",
                        children: "AÇÃO",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
        h.jsxs("div", {
          id: "hud-bottom-right-controls",
          className:
            "pointer-events-auto fixed bottom-6 right-4 z-30 flex flex-col items-center gap-2 select-none",
          style: { bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" },
          children: [
            h.jsx("button", {
              id: "touch-extra-btn",
              onClick: handleExtraClick,
              onAuxClick: handleExtraClick,
              onContextMenu: (We) => We.preventDefault(),
              className: `flex items-center justify-center w-12 h-12 rounded-2xl border-2 shadow-xl backdrop-blur-sm transition-all active:scale-95 cursor-pointer select-none ${
                dodgeModeProp
                  ? "bg-cyan-500 border-cyan-300 shadow-cyan-500/60 ring-2 ring-cyan-400/60 scale-105"
                  : extraActive
                    ? "bg-amber-500 border-amber-300 shadow-amber-500/50 scale-105"
                    : "bg-slate-800/85 hover:bg-slate-700/85 border-white/25 hover:border-white/50"
              }`,
              title: "Desvio",
              children: h.jsx("div", {
                className: `w-4 h-4 rounded-full transition-all ${
                  dodgeModeProp
                    ? "bg-slate-950 shadow-sm scale-110"
                    : "bg-slate-400/60"
                }`,
              }),
            }),
            h.jsxs("div", {
              className:
                "grid grid-cols-3 grid-rows-3 gap-1.5 w-32 h-32 opacity-80 hover:opacity-100 active:opacity-100 transition-opacity",
              children: [
                h.jsx("div", {}),
                h.jsx("button", {
                  id: "touch-up-btn",
                  onMouseDown: () => M("up", !0),
                  onMouseUp: () => M("up", !1),
                  onTouchStart: (We) => {
                    (We.preventDefault(), M("up", !0));
                  },
                  onTouchEnd: (We) => {
                    (We.preventDefault(), M("up", !1));
                  },
                  className: `flex items-center justify-center rounded-xl border text-base shadow-lg backdrop-blur-sm active:scale-95 transition-transform ${
                    dodgeModeProp
                      ? "bg-sky-950/85 border-cyan-400/70 text-cyan-200 active:bg-cyan-500 active:text-slate-950 shadow-cyan-950/50"
                      : "bg-slate-800/80 border-white/20 text-white active:bg-sky-600"
                  }`,
                  title: "Cima",
                  children: "▲",
                }),
                h.jsx("div", {}),
                h.jsx("button", {
                  id: "touch-left-btn",
                  onMouseDown: () => M("left", !0),
                  onMouseUp: () => M("left", !1),
                  onTouchStart: (We) => {
                    (We.preventDefault(), M("left", !0));
                  },
                  onTouchEnd: (We) => {
                    (We.preventDefault(), M("left", !1));
                  },
                  className: `flex items-center justify-center rounded-xl border text-base shadow-lg backdrop-blur-sm active:scale-95 transition-transform ${
                    dodgeModeProp
                      ? "bg-sky-950/85 border-cyan-400/70 text-cyan-200 active:bg-cyan-500 active:text-slate-950 shadow-cyan-950/50"
                      : "bg-slate-800/80 border-white/20 text-white active:bg-sky-600"
                  }`,
                  title: "Esquerda",
                  children: "◀",
                }),
                h.jsx("div", {
                  className: `flex flex-col items-center justify-center rounded-xl border text-[9px] font-bold transition-all ${
                    dodgeModeProp
                      ? "bg-cyan-500/85 border-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/40 font-black animate-pulse"
                      : le
                        ? "bg-emerald-600/80 border-emerald-400 text-white shadow-lg shadow-emerald-950/40 animate-pulse"
                        : W
                          ? "bg-rose-900/70 border-rose-500 text-rose-300"
                          : "bg-slate-900/60 border-white/10 text-slate-400"
                  }`,
                  title: "2x para correr",
                  children: dodgeModeProp ? "⚡DODGE" : le ? "⚡RUN" : W ? "EXAUSTO" : "2x",
                }),
                h.jsx("button", {
                  id: "touch-right-btn",
                  onMouseDown: () => M("right", !0),
                  onMouseUp: () => M("right", !1),
                  onTouchStart: (We) => {
                    (We.preventDefault(), M("right", !0));
                  },
                  onTouchEnd: (We) => {
                    (We.preventDefault(), M("right", !1));
                  },
                  className: `flex items-center justify-center rounded-xl border text-base shadow-lg backdrop-blur-sm active:scale-95 transition-transform ${
                    dodgeModeProp
                      ? "bg-sky-950/85 border-cyan-400/70 text-cyan-200 active:bg-cyan-500 active:text-slate-950 shadow-cyan-950/50"
                      : "bg-slate-800/80 border-white/20 text-white active:bg-sky-600"
                  }`,
                  title: "Direita",
                  children: "▶",
                }),
                h.jsx("div", {}),
                h.jsx("button", {
                  id: "touch-down-btn",
                  onMouseDown: () => M("down", !0),
                  onMouseUp: () => M("down", !1),
                  onTouchStart: (We) => {
                    (We.preventDefault(), M("down", !0));
                  },
                  onTouchEnd: (We) => {
                    (We.preventDefault(), M("down", !1));
                  },
                  className: `flex items-center justify-center rounded-xl border text-base shadow-lg backdrop-blur-sm active:scale-95 transition-transform ${
                    dodgeModeProp
                      ? "bg-sky-950/85 border-cyan-400/70 text-cyan-200 active:bg-cyan-500 active:text-slate-950 shadow-cyan-950/50"
                      : "bg-slate-800/80 border-white/20 text-white active:bg-sky-600"
                  }`,
                  title: "Baixo",
                  children: "▼",
                }),
                h.jsx("div", {}),
              ],
            }),
          ],
        }),
        ne &&
          h.jsx("div", {
            className:
              "pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300",
            children: h.jsxs("div", {
              className:
                "flex flex-col items-center text-center max-w-sm w-full bg-slate-900/95 border border-rose-500/40 rounded-2xl p-6 shadow-2xl shadow-rose-950/60",
              children: [
                h.jsx("div", {
                  className:
                    "h-16 w-16 rounded-full bg-rose-950/80 border border-rose-500/60 flex items-center justify-center mb-3 shadow-inner",
                  children: h.jsx(Xp, {
                    className: "h-9 w-9 text-rose-400 animate-pulse",
                  }),
                }),
                h.jsx("h2", {
                  className:
                    "text-xl font-bold text-white tracking-wide uppercase mb-1",
                  children: "Você foi Derrotado!",
                }),
                h.jsx("p", {
                  className: "text-xs text-rose-200/80 mb-5 leading-relaxed",
                  children:
                    "Seus pontos de vida chegaram a zero diante das criaturas deste reino.",
                }),
                h.jsxs("button", {
                  id: "respawn-hero-btn",
                  onClick: ke,
                  className:
                    "w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-950/60 active:scale-95 transition-all border border-amber-400/40 cursor-pointer",
                  children: [
                    h.jsx(Up, {
                      className: "h-4 w-4 text-amber-200 animate-spin",
                    }),
                    h.jsx("span", {
                      children: C
                        ? "Renascer na Fogueira Salva (R)"
                        : "Renascer no Início (R)",
                    }),
                  ],
                }),
                h.jsx("span", {
                  className:
                    "text-[11px] text-amber-200/90 mt-2.5 leading-tight",
                  children: C
                    ? `Você retornará em segurança à sua Fogueira Salva (${C.isUnderground ? "Subsolo" : "Superfície"} [${C.tx}, ${C.ty}]) protegido contra criaturas.`
                    : "Você retornará ao ponto de partida inicial com vida e vigor restaurados.",
                }),
              ],
            }),
          }),
        showDevSettings &&
          h.jsxs("aside", {
            id: "hud-dev-settings-sidebar",
            className:
              "pointer-events-auto fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-slate-950/95 border-l border-amber-500/40 text-slate-100 z-50 flex flex-col shadow-2xl backdrop-blur-md select-none",
            children: [
              h.jsxs("div", {
                className:
                  "p-3.5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between",
                children: [
                  h.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      h.jsx("span", { className: "text-lg", children: "⚙️" }),
                      h.jsxs("div", {
                        children: [
                          h.jsx("h3", {
                            className:
                              "text-xs font-bold font-serif uppercase tracking-wider text-amber-300",
                            children: "Configurações Dev",
                          }),
                          h.jsx("p", {
                            className: "text-[10px] text-slate-400 font-mono",
                            children: "Opções de Depuração e Cenário",
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsx("button", {
                    type: "button",
                    onClick: () => setShowDevSettings(!1),
                    className:
                      "p-1 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white transition border border-white/10 cursor-pointer text-xs font-bold",
                    title: "Fechar Sidebar",
                    children: "✖",
                  }),
                ],
              }),
              h.jsxs("div", {
                className:
                  "flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs font-sans",
                children: [
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col gap-2 shadow-sm",
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              h.jsx("span", {
                                className: "text-sm",
                                children: "🛡️",
                              }),
                              h.jsx("span", {
                                className: "font-bold text-slate-200",
                                children: "Caixas de Colisão",
                              }),
                            ],
                          }),
                          h.jsx("span", {
                            className: `text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              collidersActive
                                ? "bg-emerald-950 border border-emerald-500/50 text-emerald-400"
                                : "bg-slate-800 border border-slate-600 text-slate-400"
                            }`,
                            children: collidersActive ? "ON" : "OFF",
                          }),
                        ],
                      }),
                      h.jsx("p", {
                        className: "text-[11px] text-slate-400 leading-relaxed",
                        children:
                          "Desenha os colisores e caixas físicas de árvores, rochas, paredes, montanhas e entidades diretamente no canvas.",
                      }),
                      h.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          const next = !collidersActive;
                          if (window.setColliders) {
                            window.setColliders(next);
                          } else {
                            window.__showColliders = next;
                            try {
                              localStorage.setItem(
                                "rpg2d_colliders",
                                next ? "1" : "0",
                              );
                            } catch (e) {}
                          }
                          setCollidersActive(next);
                        },
                        className: `w-full py-2 px-3 rounded-lg font-bold font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 shadow ${
                          collidersActive
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                        }`,
                        children: [
                          h.jsx("span", {
                            children: collidersActive ? "🟩" : "⬜",
                          }),
                          h.jsx("span", {
                            children: collidersActive
                              ? "Colisores: ATIVADOS (ON)"
                              : "Colisores: DESATIVADOS (OFF)",
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-2 shadow-sm",
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              h.jsx("span", {
                                className: "text-sm",
                                children: "👁️",
                              }),
                              h.jsx("span", {
                                className: "font-bold text-slate-200",
                                children: "Modo Imersivo",
                              }),
                            ],
                          }),
                          h.jsx("span", {
                            className: `text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              Ie
                                ? "bg-sky-950 border border-sky-500/50 text-sky-400"
                                : "bg-slate-800 border border-slate-600 text-slate-400"
                            }`,
                            children: Ie ? "OCULTO" : "VISÍVEL",
                          }),
                        ],
                      }),
                      h.jsx("p", {
                        className: "text-[11px] text-slate-400 leading-relaxed",
                        children:
                          "Oculta a interface e botões para visualização limpa e cinematográfica do mapa.",
                      }),
                      h.jsx("button", {
                        type: "button",
                        onClick: () => ee(!Ie),
                        className:
                          "w-full py-2 px-3 rounded-lg font-bold text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-white/10 transition cursor-pointer flex items-center justify-center gap-2",
                        children: Ie
                          ? "Exibir Interface Completa"
                          : "Ativar Modo Imersivo (Ocultar HUD)",
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-2.5 shadow-sm",
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              h.jsx("span", {
                                className: "text-sm",
                                children: isDayPhase ? "☀️" : "🌙",
                              }),
                              h.jsx("span", {
                                className: "font-bold text-slate-200",
                                children: "Ciclo Dia / Noite",
                              }),
                            ],
                          }),
                          h.jsxs("span", {
                            className:
                              "text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold",
                            children: [
                              isDayPhase ? "Dia" : "Noite",
                              " • ",
                              tr(),
                              " (",
                              formatClock(),
                              ")",
                            ],
                          }),
                        ],
                      }),
                      h.jsxs("div", {
                        className:
                          "flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-white/5",
                        children: [
                          h.jsxs("span", {
                            children: ["Escurecimento gradual: ", h.jsxs("strong", { className: "text-amber-300", children: [darknessPct, "%"] })],
                          }),
                          h.jsx("button", {
                            type: "button",
                            onClick: () => setCyclePaused(!cyclePaused),
                            className: `px-2 py-0.5 rounded font-bold text-[10px] transition cursor-pointer ${
                              cyclePaused
                                ? "bg-rose-600 hover:bg-rose-500 text-white"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white"
                            }`,
                            children: cyclePaused ? "⏸️ Pausado" : "▶️ Automático",
                          }),
                        ],
                      }),
                      h.jsx("input", {
                        type: "range",
                        min: "0",
                        max: "1",
                        step: "0.002",
                        value: o,
                        onChange: (We) => u(parseFloat(We.target.value)),
                        className:
                          "w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded my-1",
                      }),
                      h.jsxs("div", {
                        className: "grid grid-cols-4 gap-1 pt-0.5",
                        children: [
                          h.jsx("button", {
                            type: "button",
                            onClick: () => u(0.25),
                            className:
                              "py-1 px-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 text-center transition cursor-pointer",
                            children: "Amanhecer",
                          }),
                          h.jsx("button", {
                            type: "button",
                            onClick: () => u(0.5),
                            className:
                              "py-1 px-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-yellow-300 text-center transition cursor-pointer",
                            children: "Meio-dia",
                          }),
                          h.jsx("button", {
                            type: "button",
                            onClick: () => u(0.75),
                            className:
                              "py-1 px-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-orange-400 text-center transition cursor-pointer",
                            children: "Pôr do Sol",
                          }),
                          h.jsx("button", {
                            type: "button",
                            onClick: () => u(0.0),
                            className:
                              "py-1 px-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-indigo-300 text-center transition cursor-pointer",
                            children: "Meia-noite",
                          }),
                        ],
                      }),
                      h.jsxs("div", {
                        className:
                          "mt-1 pt-2.5 border-t border-white/10 flex flex-col gap-2",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              h.jsx("span", {
                                className: "text-[11px] font-bold text-amber-300",
                                children: "⏱️ Duração do Ciclo (Modo Dev)",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded",
                                children: formatCycleLabel(cycleDurationSec),
                              }),
                            ],
                          }),
                          h.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              h.jsxs("label", {
                                className:
                                  "flex flex-col gap-1 bg-slate-950/70 p-2 rounded-lg border border-white/5 text-[10px] text-slate-300",
                                children: [
                                  h.jsx("span", {
                                    className: "font-semibold text-amber-200",
                                    children: "Cada Fase (Dia / Noite) [min]:",
                                  }),
                                  h.jsx("input", {
                                    type: "number",
                                    min: "0.1",
                                    max: "720",
                                    step: "0.5",
                                    value: +(cycleDurationSec / 120).toFixed(2),
                                    onChange: (We) => {
                                      const val = parseFloat(We.target.value);
                                      if (isFinite(val) && val > 0) {
                                        setCycleDurationSec(Math.max(5, Math.round(val * 120)));
                                      }
                                    },
                                    className:
                                      "w-full bg-slate-800 border border-amber-500/40 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none",
                                  }),
                                ],
                              }),
                              h.jsxs("label", {
                                className:
                                  "flex flex-col gap-1 bg-slate-950/70 p-2 rounded-lg border border-white/5 text-[10px] text-slate-300",
                                children: [
                                  h.jsx("span", {
                                    className: "font-semibold text-sky-200",
                                    children: "Ciclo Completo (Total) [min]:",
                                  }),
                                  h.jsx("input", {
                                    type: "number",
                                    min: "0.1",
                                    max: "1440",
                                    step: "1",
                                    value: +(cycleDurationSec / 60).toFixed(2),
                                    onChange: (We) => {
                                      const val = parseFloat(We.target.value);
                                      if (isFinite(val) && val > 0) {
                                        setCycleDurationSec(Math.max(5, Math.round(val * 60)));
                                      }
                                    },
                                    className:
                                      "w-full bg-slate-800 border border-sky-500/40 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          h.jsx("input", {
                            type: "range",
                            min: "10",
                            max: "3600",
                            step: "10",
                            value: Math.min(3600, Math.max(10, cycleDurationSec)),
                            onChange: (We) =>
                              setCycleDurationSec(parseInt(We.target.value, 10)),
                            className:
                              "w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded",
                          }),
                          h.jsxs("div", {
                            className: "grid grid-cols-3 gap-1",
                            children: [
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(30),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 30
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`,
                                children: "30s (15s/15s)",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(120),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 120
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`,
                                children: "2m (1m/1m)",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(300),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 300
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`,
                                children: "5m (2.5m/2.5m)",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(600),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 600
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`,
                                children: "10m (5m/5m)",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(1200),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 1200
                                    ? "bg-amber-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-amber-300"
                                }`,
                                children: "20m (10m/10m Padrão)",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setCycleDurationSec(2400),
                                className: `py-1 px-1.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                                  cycleDurationSec === 2400
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`,
                                children: "40m (20m/20m)",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-sky-500/30 flex flex-col gap-2.5 shadow-sm",
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              h.jsx("span", {
                                className: "text-sm",
                                children: activeWeatherInfo.icon,
                              }),
                              h.jsx("span", {
                                className: "font-bold text-slate-200",
                                children: "Clima Dinâmico (Canvas)",
                              }),
                            ],
                          }),
                          h.jsxs("span", {
                            className:
                              "text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold",
                            children: [
                              weatherUiState.mode === "auto" ? "Auto • " : "Fixo • ",
                              activeWeatherInfo.namePt,
                            ],
                          }),
                        ],
                      }),
                      h.jsx("p", {
                        className: "text-[11px] text-slate-300 leading-relaxed",
                        children: activeWeatherInfo.descriptionPt,
                      }),
                      h.jsxs("div", {
                        className: "grid grid-cols-2 gap-1.5",
                        children: [
                          [
                            { key: "auto", label: "🔄 Automático" },
                            { key: "clear", label: "☀️ Céu Limpo" },
                            { key: "rain", label: "🌧️ Chuva" },
                            { key: "thunderstorm", label: "⛈️ Tempestade + Raios" },
                            { key: "sandstorm", label: "🌪️ Temp. de Areia" },
                            { key: "snow", label: "🌨️ Temp. de Neve" },
                          ].map((opt) => {
                            const isSelected =
                              opt.key === "auto"
                                ? weatherUiState.mode === "auto"
                                : weatherUiState.mode === "manual" && weatherUiState.current === opt.key;
                            return h.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => handleSelectWeather(opt.key),
                                className: `py-1.5 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center gap-1 border ${
                                  isSelected
                                    ? "bg-sky-600 text-white border-sky-300 shadow"
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10"
                                }`,
                                children: opt.label,
                              },
                              opt.key,
                            );
                          }),
                        ],
                      }),
                      weatherUiState.current === "thunderstorm" &&
                        h.jsx("button", {
                          type: "button",
                          onClick: () => {
                            const ws = typeof window !== "undefined" ? window.weatherSystem : null;
                            if (ws && worldEngine) {
                              const pl = window.__gameEngine?.player || { x: t.tx * 32, y: t.ty * 32 };
                              ws.triggerLightningStrike(pl, worldEngine, window.__gameEngine?.creatures);
                            }
                          },
                          className:
                            "w-full py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition cursor-pointer shadow flex items-center justify-center gap-1",
                          children: "⚡ Disparar Raio Agora!",
                        }),
                    ],
                  }),
                  dungeonStairInfo &&
                    h.jsxs("div", {
                      className:
                        "p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex flex-col gap-2 shadow-sm",
                      children: [
                        h.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            h.jsxs("div", {
                              className: "flex items-center gap-1.5",
                              children: [
                                h.jsx("span", { className: "text-sm", children: "🧭" }),
                                h.jsx("span", {
                                  className: "font-bold text-red-300",
                                  children: "Bússola do Calabouço",
                                }),
                              ],
                            }),
                            h.jsxs("span", {
                              className:
                                "text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-300 font-bold",
                              children: [
                                dungeonStairInfo.distance,
                                "m ",
                                dungeonStairInfo.cardinal,
                              ],
                            }),
                          ],
                        }),
                        h.jsxs("p", {
                          className: "text-[11px] text-slate-300 leading-relaxed",
                          children: [
                            "A escadaria que desce para o calabouço está nas coordenadas ",
                            h.jsxs("span", {
                              className: "text-amber-300 font-mono font-bold",
                              children: [
                                "[",
                                dungeonStairInfo.stair.tx,
                                ", ",
                                dungeonStairInfo.stair.ty,
                                "]",
                              ],
                            }),
                            ". Siga na direção ",
                            h.jsx("span", {
                              className: "text-red-400 font-bold",
                              children: dungeonStairInfo.cardinal,
                            }),
                            ".",
                          ],
                        }),
                        h.jsxs("button", {
                          type: "button",
                          onClick: () => {
                            p && p("DUNGEON_STAIR_TARGET");
                            setShowDevSettings(!1);
                          },
                          className:
                            "w-full py-1.5 px-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow",
                          children: [
                            h.jsx("span", { children: "⚡" }),
                            h.jsx("span", {
                              children: "Teleportar Direto para a Escadaria",
                            }),
                          ],
                        }),
                      ],
                    }),
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-2 shadow-sm",
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                          h.jsx("span", {
                            className: "text-sm",
                            children: "⚡",
                          }),
                          h.jsx("span", {
                            className: "font-bold text-slate-200",
                            children: "Teleportes Imediatos",
                          }),
                        ],
                      }),
                      h.jsxs("div", {
                        className: "flex flex-col gap-1.5 pt-1",
                        children: [
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("DUNGEON_LOWER");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "🏰 Calabouço Inferior (Masmorras)",
                              }),
                              h.jsx("span", {
                                className: "text-[10px] font-mono text-red-400",
                                children: "Nível 2",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("SUBSOLO_HALL");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "🏛️ Salões do Subsolo (Escadaria)",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[10px] font-mono text-indigo-400",
                                children: "Nível 1",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("DESERT_GEODE");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "💎 Geodo de Cristais (Fenda no Paredão do Deserto)",
                              }),
                              h.jsx("span", {
                                className: "text-[10px] font-mono text-purple-400",
                                children: "Subsolo",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("MOUNTAIN_25D");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "⛰️ Montanhas 2.5D (Paredões)",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[10px] font-mono text-amber-400",
                                children: "Superfície",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("SNOW_PEAK");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-400/50 text-sky-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "❄️ Cidade Glacial (Picos Gelados)",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[10px] font-mono text-sky-400",
                                children: "Picos Gelados",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => {
                              p && p("MEADOW");
                              setShowDevSettings(!1);
                            },
                            className:
                              "py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-sm",
                            children: [
                              h.jsx("span", {
                                children: "🌸 Cidades Helênicas (Planície)",
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[10px] font-mono text-emerald-400",
                                children: "Superfície",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  h.jsxs("div", {
                    className:
                      "p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between shadow-sm",
                    children: [
                      h.jsxs("div", {
                        children: [
                          h.jsx("span", {
                            className: "font-bold text-slate-200 block text-xs",
                            children: "🎲 Seed do Mundo",
                          }),
                          h.jsxs("span", {
                            className: "text-[10px] text-slate-400 font-mono",
                            children: ["Atual: #", l],
                          }),
                        ],
                      }),
                      h.jsxs("button", {
                        type: "button",
                        onClick: S,
                        className:
                          "px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow",
                        children: [
                          h.jsx(Gp, { className: "h-3.5 w-3.5" }),
                          h.jsx("span", { children: "Nova Seed" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
      ],
    });
  };
