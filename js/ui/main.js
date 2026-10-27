/* js/ui/main.js
 * Componente raiz (App) e montagem do React. DEVE ser o ultimo script.
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";

window.Game = window.Game || {};

function App() {
  const [inGame, setInGame] = J.useState(false);
  const [devMode, setDevMode] = J.useState(() => {
    try {
      return localStorage.getItem("rpg2d_dev_mode") === "1";
    } catch (e) {
      return false;
    }
  });

  const [gameOptions, setGameOptions] = J.useState(() => ({
    slotId: typeof window.getActiveSaveSlot === "function" ? window.getActiveSaveSlot() : 1,
    isNewGame: false,
    randomSeed: null,
  }));

  // Atualiza flags globais e sincroniza exatamente com a área visível real (visualViewport / innerHeight)
  J.useEffect(() => {
    window.__inGame = inGame;
    window.__devMode = devMode;
  }, [inGame, devMode]);

  J.useEffect(() => {
    const syncVisibleViewport = () => {
      const vv = window.visualViewport;
      const w = vv ? vv.width : window.innerWidth;
      const h = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;
      const rootEl = document.documentElement;
      if (rootEl && w > 0 && h > 0) {
        rootEl.style.setProperty("--vvw", `${Math.floor(w)}px`);
        rootEl.style.setProperty("--vvh", `${Math.floor(h)}px`);
        rootEl.style.setProperty("--vv-top", `${Math.floor(offsetTop)}px`);
      }
    };
    syncVisibleViewport();
    window.addEventListener("resize", syncVisibleViewport);
    window.addEventListener("orientationchange", syncVisibleViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncVisibleViewport);
      window.visualViewport.addEventListener("scroll", syncVisibleViewport);
    }
    return () => {
      window.removeEventListener("resize", syncVisibleViewport);
      window.removeEventListener("orientationchange", syncVisibleViewport);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", syncVisibleViewport);
        window.visualViewport.removeEventListener("scroll", syncVisibleViewport);
      }
    };
  }, []);

  const [normalSettingsOpen, setNormalSettingsOpen] = J.useState(false);

  const handleStartGame = J.useCallback((options) => {
    const opts = options || {};
    const slotId = opts.slotId || (typeof window.getActiveSaveSlot === "function" ? window.getActiveSaveSlot() : 1);
    const isNew = opts.isNewGame !== undefined ? !!opts.isNewGame : false;
    const seed = opts.randomSeed || (typeof window.generateRandomSeed === "function" ? window.generateRandomSeed() : (Math.floor(Math.random() * 900000) + 10000));

    if (typeof window.setActiveSaveSlot === "function") {
      window.setActiveSaveSlot(slotId);
    }

    setGameOptions({
      slotId: slotId,
      isNewGame: isNew,
      randomSeed: seed,
    });
    setNormalSettingsOpen(false);
    setInGame(true);
  }, []);

  const handleReturnToMenu = J.useCallback(() => {
    setNormalSettingsOpen(false);
    setInGame(false);
  }, []);

  const handleToggleDevMode = J.useCallback((active) => {
    setDevMode(active);
  }, []);

  const MenuComponent = window.MenuScreen || (window.Game && window.Game.MenuScreen);

  return h.jsx("main", {
    className:
      "w-full h-full overflow-hidden bg-slate-950 font-sans select-none text-slate-100 relative",
    children: inGame
      ? h.jsxs("div", {
          className: "relative w-full h-full",
          children: [
            h.jsx(GameMain, {
              key: `game_${gameOptions.slotId}_${gameOptions.randomSeed || "load"}`,
              onReturnToMenu: handleReturnToMenu,
              devMode: devMode,
              slotId: gameOptions.slotId,
              isNewGame: gameOptions.isNewGame,
              randomSeed: gameOptions.randomSeed,
            }),
            devMode
              ? h.jsxs("button", {
                  type: "button",
                  onClick: handleReturnToMenu,
                  title: "Voltar ao Menu Principal (Esc)",
                  className:
                    "fixed top-[calc(112px+var(--sat,0px))] left-[calc(10px+var(--sal,0px))] z-40 px-3 py-1.5 bg-slate-900/85 hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 backdrop-blur shadow-lg transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto active:scale-95",
                  children: [
                    h.jsx("span", { children: "🏰" }),
                    h.jsx("span", { children: "Menu" }),
                  ],
                })
              : h.jsxs("div", {
                  className: "fixed z-50 pointer-events-auto flex flex-col items-end",
                  style: {
                    top: "calc(0.75rem + env(safe-area-inset-top, 0px))",
                    right: "calc(0.75rem + env(safe-area-inset-right, 0px))",
                  },
                  children: [
                    h.jsx("button", {
                      id: "normal-mode-settings-btn",
                      type: "button",
                      onClick: () => setNormalSettingsOpen((prev) => !prev),
                      title: "Configurações",
                      className: `w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-xl backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
                        normalSettingsOpen
                          ? "bg-amber-600 border-amber-300 text-white shadow-amber-950/60"
                          : "bg-slate-900/85 hover:bg-slate-800 border-amber-500/40 text-amber-300 hover:text-amber-200"
                      }`,
                      children: "⚙️",
                    }),
                    normalSettingsOpen &&
                      h.jsxs("div", {
                        className:
                          "mt-2 w-48 rounded-2xl bg-slate-900/95 border border-amber-500/40 p-2.5 shadow-2xl backdrop-blur-md flex flex-col gap-2 animate-in fade-in duration-150",
                        children: [
                          h.jsxs("div", {
                            className:
                              "flex items-center justify-between px-1 pb-1.5 border-b border-white/10",
                            children: [
                              h.jsx("span", {
                                className:
                                  "text-[11px] font-bold uppercase tracking-wider text-amber-300",
                                children: "Configurações",
                              }),
                              h.jsx("button", {
                                type: "button",
                                onClick: () => setNormalSettingsOpen(false),
                                className:
                                  "text-slate-400 hover:text-white text-xs px-1 cursor-pointer",
                                title: "Fechar",
                                children: "✖",
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            id: "normal-mode-return-menu-btn",
                            type: "button",
                            onClick: handleReturnToMenu,
                            className:
                              "w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer",
                            children: [
                              h.jsx("span", { children: "🏰" }),
                              h.jsx("span", { children: "Voltar ao Menu" }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
          ],
        })
      : h.jsx(MenuComponent, {
          onStartGame: handleStartGame,
          devMode: devMode,
          onToggleDevMode: handleToggleDevMode,
        }),
  });
}

pp.createRoot(document.getElementById("root")).render(
  h.jsx(J.StrictMode, { children: h.jsx(App, {}) }),
);
