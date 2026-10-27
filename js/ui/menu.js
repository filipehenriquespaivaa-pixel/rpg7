/* js/ui/menu.js
 * Tela de Menu Principal e Gerenciamento Limpo de Slots de Salve.
 * Carregado antes de js/ui/main.js.
 * Padrão global: window.Game.MenuScreen e window.MenuScreen.
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  // Inicialização segura de variáveis de estado a partir do localStorage
  function getStoredBool(key, defaultVal) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? defaultVal : v === "1";
    } catch (e) {
      return defaultVal;
    }
  }

  function setStoredBool(key, val) {
    try {
      localStorage.setItem(key, val ? "1" : "0");
    } catch (e) {}
  }

  // Sincroniza globais no escopo da janela (Modo Comum por padrão)
  window.__devMode = getStoredBool("rpg2d_dev_mode", false);
  window.__showColliders = getStoredBool("rpg2d_colliders", false);
  window.__godMode = getStoredBool("rpg2d_god_mode", false);
  window.__infiniteStamina = getStoredBool("rpg2d_infinite_stamina", false);
  window.__superSpeed = getStoredBool("rpg2d_super_speed", false);
  window.__showTelemetry = getStoredBool("rpg2d_show_telemetry", false);

  /* Componente: MenuScreen */
  function MenuScreen(props) {
    const onStartGame = props.onStartGame;
    const onToggleDevMode = props.onToggleDevMode;
    const canvasRef = J.useRef(null);

    const [showSlotsModal, setShowSlotsModal] = J.useState(false);
    const [saveSlots, setSaveSlots] = J.useState(() => {
      return typeof window.getAllSaveSlots === "function" ? window.getAllSaveSlots() : [];
    });

    const refreshSlots = J.useCallback(() => {
      if (typeof window.getAllSaveSlots === "function") {
        setSaveSlots(window.getAllSaveSlots());
      }
    }, []);

    J.useEffect(() => {
      refreshSlots();
    }, [refreshSlots]);

    const hasAnySave = saveSlots.some((s) => !s.isEmpty);

    // Arte do menu desenhada em Canvas: Céu noturno, montanhas, floresta de pinheiros e fogueira viva
    J.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animId;
      const getViewportSize = () => {
        const vv = window.visualViewport;
        return {
          w: Math.floor(vv ? vv.width : window.innerWidth),
          h: Math.floor(vv ? vv.height : window.innerHeight),
        };
      };
      const initialSize = getViewportSize();
      let width = (canvas.width = initialSize.w);
      let height = (canvas.height = initialSize.h);

      const handleResize = () => {
        const sz = getViewportSize();
        width = canvas.width = sz.w;
        height = canvas.height = sz.h;
        initStars();
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleResize);
        window.visualViewport.addEventListener("scroll", handleResize);
      }

      // Estrelas fixas no céu
      let stars = [];
      function initStars() {
        stars = [];
        const count = Math.floor((width * height) / 3800);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.65),
            size: Math.random() * 1.6 + 0.4,
            baseAlpha: Math.random() * 0.7 + 0.3,
            blinkSpeed: Math.random() * 0.03 + 0.01,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      initStars();

      // Partículas de fagulhas subindo da fogueira
      const embers = [];
      const emberCount = 50;

      // Desenha pinheiro estilizado
      function drawPineTree(x, y, treeWidth, treeHeight, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y - treeHeight);
        ctx.lineTo(x + treeWidth / 2, y);
        ctx.lineTo(x - treeWidth / 2, y);
        ctx.closePath();
        ctx.fill();

        // Tronco
        ctx.fillStyle = "rgba(15, 10, 8, 0.7)";
        ctx.fillRect(x - treeWidth * 0.08, y, treeWidth * 0.16, treeHeight * 0.18);
      }

      let tick = 0;

      const render = () => {
        tick++;
        ctx.clearRect(0, 0, width, height);

        // 1. Céu noturno com gradiente profundo
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, "#030712");
        skyGrad.addColorStop(0.35, "#0b0f19");
        skyGrad.addColorStop(0.65, "#15162c");
        skyGrad.addColorStop(0.85, "#1e1b4b");
        skyGrad.addColorStop(1, "#090d16");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Brilho suave da lua no alto
        const moonGlow = ctx.createRadialGradient(
          width * 0.82,
          height * 0.22,
          5,
          width * 0.82,
          height * 0.22,
          width * 0.45
        );
        moonGlow.addColorStop(0, "rgba(224, 231, 255, 0.12)");
        moonGlow.addColorStop(0.4, "rgba(99, 102, 241, 0.04)");
        moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = moonGlow;
        ctx.fillRect(0, 0, width, height);

        // Lua prateada crescente
        const mx = width * 0.82;
        const my = height * 0.22;
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(248, 250, 252, 0.6)";
        ctx.fillStyle = "rgba(241, 245, 249, 0.88)";
        ctx.beginPath();
        ctx.arc(mx, my, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(mx - 8, my - 4, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Estrelas cintilantes
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const alpha = s.baseAlpha + Math.sin(tick * s.blinkSpeed + s.phase) * 0.3;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Montanhas distantes (Camada 1 - Silhueta azulada escura)
        ctx.fillStyle = "#0c1122";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        ctx.lineTo(width * 0.18, height * 0.52);
        ctx.lineTo(width * 0.38, height * 0.64);
        ctx.lineTo(width * 0.62, height * 0.46);
        ctx.lineTo(width * 0.82, height * 0.62);
        ctx.lineTo(width, height * 0.54);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Montanhas médias (Camada 2)
        ctx.fillStyle = "#080c18";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.78);
        ctx.lineTo(width * 0.28, height * 0.62);
        ctx.lineTo(width * 0.52, height * 0.73);
        ctx.lineTo(width * 0.76, height * 0.58);
        ctx.lineTo(width, height * 0.75);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // 4. Floresta de Pinheiros na silhueta
        const horizonY = height * 0.84;
        const treeBaseY = horizonY;

        // Pinheiros ao fundo
        const bgTrees = 26;
        for (let i = 0; i < bgTrees; i++) {
          const tx = (width / bgTrees) * (i + 0.3 * Math.sin(i * 3));
          const th = 45 + ((i * 19) % 35);
          const tw = th * 0.52;
          drawPineTree(tx, treeBaseY, tw, th, "rgba(5, 8, 16, 0.95)");
        }

        // Chão em primeiro plano com colina suave
        ctx.fillStyle = "#04060d";
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.quadraticCurveTo(width * 0.5, horizonY - 14, width, horizonY);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // 5. Fogueira viva no centro inferior
        const fireX = width * 0.5;
        const fireY = horizonY - 4;

        // Luz da fogueira refletida no chão e ambiente (pulsando organicamente)
        const flamePulse = Math.sin(tick * 0.12) * 8 + Math.cos(tick * 0.23) * 6;
        const fireLightRadius = Math.min(width, height) * 0.42 + flamePulse;

        const groundGlow = ctx.createRadialGradient(
          fireX,
          fireY,
          5,
          fireX,
          fireY,
          fireLightRadius
        );
        groundGlow.addColorStop(0, "rgba(245, 158, 11, 0.32)");
        groundGlow.addColorStop(0.3, "rgba(217, 119, 6, 0.14)");
        groundGlow.addColorStop(0.65, "rgba(180, 83, 9, 0.04)");
        groundGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = groundGlow;
        ctx.fillRect(0, 0, width, height);

        // Pedras ao redor da fogueira
        ctx.fillStyle = "#1e293b";
        const rockOffsets = [-22, -14, -6, 6, 14, 22];
        for (let r = 0; r < rockOffsets.length; r++) {
          ctx.beginPath();
          ctx.arc(fireX + rockOffsets[r], fireY + 3, 6 + ((r % 3) * 1.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Troncos de madeira cruzados
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(fireX - 18, fireY + 4);
        ctx.lineTo(fireX + 18, fireY - 3);
        ctx.moveTo(fireX + 18, fireY + 4);
        ctx.lineTo(fireX - 18, fireY - 3);
        ctx.stroke();

        // Camadas de chamas dançantes
        const f1 = Math.sin(tick * 0.18) * 4;
        const f2 = Math.cos(tick * 0.25) * 5;
        const f3 = Math.sin(tick * 0.31) * 3;

        // Labareda externa
        ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
        ctx.beginPath();
        ctx.moveTo(fireX - 14, fireY);
        ctx.quadraticCurveTo(fireX - 8 + f1, fireY - 26, fireX, fireY - 38 + f2);
        ctx.quadraticCurveTo(fireX + 8 - f2, fireY - 26, fireX + 14, fireY);
        ctx.closePath();
        ctx.fill();

        // Labareda média
        ctx.fillStyle = "rgba(245, 158, 11, 0.95)";
        ctx.beginPath();
        ctx.moveTo(fireX - 10, fireY);
        ctx.quadraticCurveTo(fireX - 5 + f2, fireY - 20, fireX, fireY - 28 + f1);
        ctx.quadraticCurveTo(fireX + 5 - f1, fireY - 20, fireX + 10, fireY);
        ctx.closePath();
        ctx.fill();

        // Núcleo da chama
        ctx.fillStyle = "rgba(254, 240, 138, 0.98)";
        ctx.beginPath();
        ctx.moveTo(fireX - 5, fireY);
        ctx.quadraticCurveTo(fireX + f3, fireY - 14, fireX, fireY - 18 + f3);
        ctx.quadraticCurveTo(fireX - f3, fireY - 14, fireX + 5, fireY);
        ctx.closePath();
        ctx.fill();

        // 6. Fagulhas subindo
        if (embers.length < emberCount && Math.random() < 0.65) {
          embers.push({
            x: fireX + (Math.random() - 0.5) * 16,
            y: fireY - 10,
            vx: (Math.random() - 0.5) * 1.3,
            vy: -(Math.random() * 2.2 + 1.2),
            size: Math.random() * 2.4 + 0.8,
            alpha: 1,
            decay: Math.random() * 0.018 + 0.008,
            hue: Math.random() > 0.3 ? 38 + Math.random() * 16 : 14 + Math.random() * 15,
          });
        }

        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.x += e.vx + Math.sin((tick + e.y) * 0.05) * 0.4;
          e.y += e.vy;
          e.alpha -= e.decay;

          if (e.alpha <= 0 || e.y < 0) {
            embers.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `hsla(${e.hue}, 95%, 65%, ${e.alpha})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vignette suave nas bordas
        const vignette = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.45,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.8
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.65)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        animId = requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", handleResize);
          window.visualViewport.removeEventListener("scroll", handleResize);
        }
        if (animId) cancelAnimationFrame(animId);
      };
    }, []);

    // Ação do Botão Start Principal (SEMPRE SEED ALEATÓRIA)
    const handleStartNewGame = () => {
      setStoredBool("rpg2d_dev_mode", false);
      try {
        localStorage.setItem("rpg2d_cycle_duration_sec", "1200");
        localStorage.setItem("rpg2d_cycle_paused", "0");
      } catch (e) {}
      window.__devMode = false;
      window.__showColliders = false;
      window.__godMode = false;
      window.__infiniteStamina = false;
      window.__superSpeed = false;
      window.__showTelemetry = false;
      if (typeof onToggleDevMode === "function") {
        onToggleDevMode(false);
      }
      if (typeof window.updateColliderBtnVisibility === "function") {
        window.updateColliderBtnVisibility();
      }

      // Encontra primeiro slot livre ou usa o slot ativo
      const slots = typeof window.getAllSaveSlots === "function" ? window.getAllSaveSlots() : [];
      let targetSlot = 1;
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].isEmpty) {
          targetSlot = slots[i].slotId;
          break;
        }
      }

      const seed = typeof window.generateRandomSeed === "function"
        ? window.generateRandomSeed()
        : (Math.floor(Math.random() * 900000) + 10000);

      if (typeof window.setActiveSaveSlot === "function") {
        window.setActiveSaveSlot(targetSlot);
      }

      if (typeof onStartGame === "function") {
        onStartGame({
          slotId: targetSlot,
          isNewGame: true,
          randomSeed: seed,
        });
      }
    };

    // Ação do Botão Start (Modo Desenvolvedor - também seed aleatória)
    const handleStartDevMode = () => {
      setStoredBool("rpg2d_dev_mode", true);
      window.__devMode = true;
      if (typeof onToggleDevMode === "function") {
        onToggleDevMode(true);
      }
      if (typeof window.updateColliderBtnVisibility === "function") {
        window.updateColliderBtnVisibility();
      }

      const seed = typeof window.generateRandomSeed === "function"
        ? window.generateRandomSeed()
        : (Math.floor(Math.random() * 900000) + 10000);

      if (typeof onStartGame === "function") {
        onStartGame({
          slotId: typeof window.getActiveSaveSlot === "function" ? window.getActiveSaveSlot() : 1,
          isNewGame: true,
          randomSeed: seed,
        });
      }
    };

    // Ações de Carregamento de Salves (Continuar)
    const handleLoadSlot = (slotId) => {
      if (typeof window.setActiveSaveSlot === "function") {
        window.setActiveSaveSlot(slotId);
      }
      setShowSlotsModal(false);
      if (typeof onStartGame === "function") {
        onStartGame({
          slotId: slotId,
          isNewGame: false,
        });
      }
    };

    const handleNewGameInSlot = (slotId) => {
      const seed = typeof window.generateRandomSeed === "function"
        ? window.generateRandomSeed()
        : (Math.floor(Math.random() * 900000) + 10000);

      if (typeof window.setActiveSaveSlot === "function") {
        window.setActiveSaveSlot(slotId);
      }
      setShowSlotsModal(false);
      if (typeof onStartGame === "function") {
        onStartGame({
          slotId: slotId,
          isNewGame: true,
          randomSeed: seed,
        });
      }
    };

    const handleDeleteSlot = (slotId) => {
      if (typeof window.clearGameState === "function") {
        window.clearGameState(slotId);
      }
      refreshSlots();
    };

    return h.jsxs("div", {
      className:
        "relative w-full h-full overflow-hidden flex flex-col items-center select-none",
      style: {
        width: "var(--vvw, 100%)",
        height: "var(--vvh, 100%)",
      },
      children: [
        // Canvas de pintura de fundo viva (arte cinematográfica)
        h.jsx("canvas", {
          ref: canvasRef,
          className: "fixed inset-0 w-full h-full pointer-events-none z-0",
        }),

        // TÍTULO DO JOGO (Ancorado no topo)
        h.jsxs("div", {
          className:
            "menu-title-container fixed left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-center px-2 w-full",
          style: {
            top: "calc(1.75rem + env(safe-area-inset-top, 0px))",
          },
          children: [
            h.jsxs("div", {
              className: "flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2",
              children: [
                h.jsx("span", {
                  className: "text-2xl sm:text-4xl drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse",
                  children: "⚔️",
                }),
                h.jsx("span", {
                  className:
                    "text-[10px] sm:text-sm uppercase tracking-[0.35em] text-amber-300/80 font-bold font-mono",
                  children: "RPG 2D",
                }),
                h.jsx("span", {
                  className: "text-2xl sm:text-4xl drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse",
                  children: "🛡️",
                }),
              ],
            }),

            // Logo estilizado com degradê dourado metálico escalável
            h.jsx("h1", {
              className:
                "text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] uppercase font-serif",
              children: "Mundo RPG",
            }),
          ],
        }),

        // CENTRO DA TELA VISÍVEL: BOTÕES ELEGANTES E LIMPOS
        h.jsxs("div", {
          className:
            "menu-btn-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[320px] sm:max-w-sm px-3",
          children: [
            // Botão Principal: Start (Sempre Seed Aleatória)
            h.jsxs("button", {
              type: "button",
              onClick: handleStartNewGame,
              className:
                "group relative w-full py-3 sm:py-4 px-4 sm:px-8 rounded-2xl font-black text-base sm:text-lg text-amber-200 bg-slate-950/85 hover:bg-slate-900 border-2 border-amber-500/80 hover:border-amber-400 shadow-[0_0_30px_rgba(217,119,6,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.65)] backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-3 overflow-hidden",
              children: [
                h.jsx("div", {
                  className:
                    "absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                }),
                h.jsx("span", {
                  className:
                    "text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-125",
                  children: "⚔️",
                }),
                h.jsx("span", {
                  className:
                    "tracking-wide uppercase font-serif text-amber-100 group-hover:text-white drop-shadow-md text-sm sm:text-base",
                  children: "Start (Novo Jogo)",
                }),
              ],
            }),

            // Botão Continuar: Aparece para permitir continuar um dos até 3 slots
            hasAnySave &&
              h.jsxs("button", {
                type: "button",
                onClick: () => setShowSlotsModal(true),
                className:
                  "group relative w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-2xl font-black text-sm sm:text-base text-emerald-300 hover:text-emerald-100 bg-slate-950/80 hover:bg-slate-900/95 border-2 border-emerald-500/70 hover:border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5 overflow-hidden",
                children: [
                  h.jsx("span", {
                    className:
                      "text-lg sm:text-xl transition-transform duration-300 group-hover:scale-115",
                    children: "💾",
                  }),
                  h.jsx("span", {
                    className:
                      "tracking-wide uppercase font-serif text-emerald-200 group-hover:text-white drop-shadow",
                    children: "Continuar (Salves)",
                  }),
                ],
              }),

            // Botão Secundário: Start (Modo Desenvolvedor)
            h.jsxs("button", {
              type: "button",
              onClick: handleStartDevMode,
              className:
                "group relative w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm text-amber-300/80 hover:text-amber-200 bg-slate-950/75 hover:bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/60 shadow-md backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5 overflow-hidden",
              children: [
                h.jsx("span", {
                  className:
                    "text-base sm:text-lg transition-transform duration-300 group-hover:scale-110",
                  children: "🛠️",
                }),
                h.jsx("span", {
                  className:
                    "tracking-wide uppercase font-serif text-slate-300 group-hover:text-amber-200 drop-shadow text-xs sm:text-sm",
                  children: "Start (Modo Desenvolvedor)",
                }),
              ],
            }),
          ],
        }),

        // MODAL LIMPO E ELEGANTE: 3 SLOTS DE SALVE (Abre apenas se o jogador clicar em Continuar)
        showSlotsModal &&
          h.jsx("div", {
            className:
              "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200",
            children: h.jsxs("div", {
              className:
                "w-full max-w-md bg-slate-950/95 border border-amber-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100",
              children: [
                // Topo do Modal
                h.jsxs("div", {
                  className: "flex items-center justify-between pb-2 border-b border-white/10",
                  children: [
                    h.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        h.jsx("span", { className: "text-xl", children: "💾" }),
                        h.jsxs("div", {
                          children: [
                            h.jsx("h3", {
                              className: "text-sm font-bold uppercase tracking-wider text-amber-300 font-serif",
                              children: "Escolher Salve para Continuar",
                            }),
                            h.jsx("p", {
                              className: "text-[10px] text-slate-400",
                              children: "Até 3 slots salvos no seu navegador",
                            }),
                          ],
                        }),
                      ],
                    }),
                    h.jsx("button", {
                      type: "button",
                      onClick: () => setShowSlotsModal(false),
                      className:
                        "text-slate-400 hover:text-white text-base px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer",
                      title: "Fechar",
                      children: "✖",
                    }),
                  ],
                }),

                // Lista compacta dos 3 Slots
                h.jsx("div", {
                  className: "flex flex-col gap-2.5",
                  children: [1, 2, 3].map((slotNumber) => {
                    const slot = saveSlots.find((s) => s.slotId === slotNumber) || {
                      slotId: slotNumber,
                      isEmpty: true,
                    };

                    if (slot.isEmpty) {
                      return h.jsxs("div", {
                        key: slotNumber,
                        className:
                          "flex items-center justify-between p-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-slate-400 text-xs",
                        children: [
                          h.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              h.jsx("span", { className: "text-base text-slate-600", children: "📁" }),
                              h.jsxs("div", {
                                children: [
                                  h.jsxs("span", {
                                    className: "font-mono font-bold text-slate-400",
                                    children: [`SLOT ${slotNumber} `],
                                  }),
                                  h.jsx("span", {
                                    className: "text-[10px] text-slate-500",
                                    children: "— Vazio",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          h.jsxs("button", {
                            type: "button",
                            onClick: () => handleNewGameInSlot(slotNumber),
                            className:
                              "py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition cursor-pointer active:scale-95 flex items-center gap-1",
                            children: [
                              h.jsx("span", { children: "＋" }),
                              h.jsx("span", { children: "Novo Jogo" }),
                            ],
                          }),
                        ],
                      });
                    }

                    return h.jsxs("div", {
                      key: slotNumber,
                      className:
                        "flex items-center justify-between p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 text-xs shadow-md",
                      children: [
                        h.jsxs("div", {
                          className: "flex flex-col gap-0.5 max-w-[200px] sm:max-w-xs",
                          children: [
                            h.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                h.jsxs("span", {
                                  className: "font-mono font-black text-amber-300 text-xs",
                                  children: [`SLOT ${slotNumber}`],
                                }),
                                h.jsxs("span", {
                                  className: "font-mono text-[10px] text-slate-400",
                                  children: [`#${slot.seed || "—"}`],
                                }),
                              ],
                            }),
                            h.jsxs("div", {
                              className: "text-[10px] text-slate-400 truncate",
                              children: [
                                slot.formattedDate,
                                " • ",
                                slot.checkpointName || "Fogueira",
                              ],
                            }),
                          ],
                        }),
                        h.jsxs("div", {
                          className: "flex items-center gap-1.5",
                          children: [
                            h.jsxs("button", {
                              type: "button",
                              onClick: () => handleLoadSlot(slotNumber),
                              className:
                                "py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer active:scale-95 flex items-center gap-1",
                              children: [
                                h.jsx("span", { children: "▶" }),
                                h.jsx("span", { children: "Continuar" }),
                              ],
                            }),
                            h.jsx("button", {
                              type: "button",
                              onClick: () => handleDeleteSlot(slotNumber),
                              title: "Apagar este salve",
                              className:
                                "p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs border border-red-800/40 transition cursor-pointer active:scale-95",
                              children: "🗑️",
                            }),
                          ],
                        }),
                      ],
                    });
                  }),
                }),

                // Botão Voltar do modal
                h.jsx("button", {
                  type: "button",
                  onClick: () => setShowSlotsModal(false),
                  className:
                    "w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer active:scale-95 text-center mt-1",
                  children: "Voltar ao Menu",
                }),
              ],
            }),
          }),
      ],
    });
  }

  // Exporta para o namespace global
  G.MenuScreen = MenuScreen;
  window.MenuScreen = MenuScreen;
})(window.Game);
