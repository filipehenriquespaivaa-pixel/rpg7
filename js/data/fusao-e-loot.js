/* js/data/fusao-e-loot.js
 * Auxiliares de fusao (s0), configs de slots (c0...), deteccao de criatura (ac, f0) e loot (e1).
 * Trecho de legacy/app.original.js (linhas 40264-41200); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function s0(e, t, l) {
    const o = [e, t, l].filter(Boolean);
    if (o.length === 0) return null;
    if (o.length === 1) {
      const u = o[0];
      if (et(u, "galho") && (u.stackCount || 1) >= 10) {
        for (const m of bl) if (m.id === "fuse_campfire_unlit") return m;
      }
      if (et(u, "argila") && (u.stackCount || 1) >= 2) {
        for (const m of bl) if (m.id === "fuse_moldagem_argila") return m;
      }
      return null;
    }
    if (o.length === 2) {
      const u = o[0],
        m = o[1];
      for (const c of bl)
        if (!c.ingredient3Name && c.match(u, m, null)) return c;
    } else if (o.length === 3) {
      const u = o[0],
        m = o[1],
        c = o[2];
      for (const f of bl) if (f.ingredient3Name && f.match(u, m, c)) return f;
    }
    return null;
  }
  const c0 = {
      primary: {
        name: "Primário",
        badge: "Primário",
        badgeClass: "bg-amber-950/85 text-amber-300 border-amber-500/50",
        emptyBorderClass: "border-amber-500/35 hover:border-amber-400/60",
        emptyBgClass: "bg-amber-950/15",
        emptyTextClass: "text-amber-400/80",
        cardBorderClass: "border-amber-500/60 hover:border-amber-300",
        cardBgClass:
          "bg-gradient-to-b from-amber-950/30 via-slate-900/90 to-slate-950",
        glowColor: "#f59e0b",
        dotColor: "bg-amber-400",
      },
      bolsa: {
        name: "Bolsa",
        badge: "Bolsa +6",
        badgeClass: "bg-emerald-950/90 text-emerald-300 border-emerald-400/60",
        emptyBorderClass: "border-emerald-500/40 hover:border-emerald-400/70",
        emptyBgClass: "bg-emerald-950/20",
        emptyTextClass: "text-emerald-400/80",
        cardBorderClass: "border-emerald-500/70 hover:border-emerald-300",
        cardBgClass:
          "bg-gradient-to-b from-emerald-950/35 via-slate-900/90 to-slate-950",
        glowColor: "#10b981",
        dotColor: "bg-emerald-400",
      },
      mochila: {
        name: "Mochila",
        badge: "Mochila +15",
        badgeClass: "bg-indigo-950/90 text-indigo-300 border-indigo-400/60",
        emptyBorderClass: "border-indigo-500/40 hover:border-indigo-400/70",
        emptyBgClass: "bg-indigo-950/20",
        emptyTextClass: "text-indigo-400/80",
        cardBorderClass: "border-indigo-500/70 hover:border-indigo-300",
        cardBgClass:
          "bg-gradient-to-b from-indigo-950/35 via-slate-900/90 to-slate-950",
        glowColor: "#6366f1",
        dotColor: "bg-indigo-400",
      },
    },
    Kb = (e, t = "h-6 w-6 text-slate-600/80") => {
      switch (e) {
        case "chapeu":
          return h.jsx(Np, { className: t });
        case "capa":
          return h.jsx(Kp, { className: t });
        case "pingente":
          return h.jsx(Ip, { className: t });
        case "camisa":
          return h.jsx(Yp, { className: t });
        case "calca":
          return h.jsx(Lu, { className: t });
        case "botas":
          return h.jsx(zu, { className: t });
        case "mao_esquerda":
          return h.jsx(Ys, { className: t });
        case "mao_direita":
          return h.jsx(Uu, { className: t });
        case "cinto":
          return h.jsx(Gs, { className: t });
        case "cinto_slot1":
        case "cinto_slot2":
          return h.jsx(uo, { className: t });
        case "bracelete_esquerdo":
        case "bracelete_direito":
          return h.jsx(_p, { className: t });
        case "mochila":
          return h.jsx(uo, { className: t });
        default:
          return h.jsx(Or, { className: t });
      }
    },
    d0 = {
      chapeu: "Elmo",
      capa: "Capa",
      pingente: "Amuleto",
      camisa: "Peitoral",
      calca: "Pernas",
      botas: "Botas",
      mao_esquerda: "Secundária",
      mao_direita: "Arma",
      cinto: "Cinto",
      cinto_slot1: "Bolso I",
      cinto_slot2: "Bolso II",
      bracelete_esquerdo: "Brac. E",
      bracelete_direito: "Brac. D",
      mochila: "Bolsa",
    },
    Zb = ({
      isOpen: e,
      onClose: t,
      backpack: l,
      canPlayerCraftRecipe: o,
      onAutoFillRecipe: u,
      onFuseItems: m,
      onCloseParentModal: c,
    }) => {
      const [f, g] = J.useState("all");
      return e
        ? h.jsxs("div", {
            className:
              "rounded-2xl border border-amber-500/40 bg-slate-950/95 p-3.5 shadow-2xl flex flex-col gap-2.5 max-h-80 overflow-y-auto animate-in slide-in-from-top-2",
            children: [
              h.jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-white/10 pb-2",
                children: [
                  h.jsxs("div", {
                    className:
                      "flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs",
                    children: [
                      h.jsx(ju, { className: "h-4 w-4 text-amber-400" }),
                      h.jsxs("span", {
                        children: [
                          "Livro de Fórmulas (",
                          bl.filter((y) =>
                            window.Game && window.Game.RecipeKnowledge
                              ? window.Game.RecipeKnowledge.isRecipeUnlocked(y.id)
                              : true,
                          ).length,
                          "/",
                          bl.length,
                          " Descobertas",
                          typeof window !== "undefined" && window.__devMode
                            ? " • Dev"
                            : "",
                          ")",
                        ],
                      }),
                    ],
                  }),
                  h.jsx("button", {
                    onClick: t,
                    className: "text-slate-400 hover:text-white p-1 rounded",
                    children: h.jsx(mi, { className: "h-4 w-4" }),
                  }),
                ],
              }),
              h.jsx("div", {
                className: "flex items-center gap-1 text-[10px]",
                children: [
                  "all",
                  "arma",
                  "armadura",
                  "acessorio",
                  "utilitario",
                  "pocao",
                ].map((y) =>
                  h.jsx(
                    "button",
                    {
                      onClick: () => g(y),
                      className: `px-2 py-0.5 rounded-md font-semibold capitalize transition ${f === y ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`,
                      children: y === "all" ? "Todas" : y,
                    },
                    y,
                  ),
                ),
              }),
              h.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                children: bl
                  .filter((y) => f === "all" || y.category === f)
                  .map((y) => {
                    const isUnlocked =
                      window.Game && window.Game.RecipeKnowledge
                        ? window.Game.RecipeKnowledge.isRecipeUnlocked(y.id)
                        : true;

                    if (!isUnlocked) {
                      return h.jsxs(
                        "div",
                        {
                          className:
                            "p-2.5 rounded-xl border border-dashed border-amber-900/40 bg-black/60 flex flex-col justify-between gap-1.5 opacity-70 transition text-xs",
                          children: [
                            h.jsxs("div", {
                              className:
                                "flex items-start justify-between gap-1",
                              children: [
                                h.jsxs("span", {
                                  className:
                                    "font-bold text-stone-400 font-serif flex items-center gap-1 text-xs",
                                  children: [
                                    h.jsx("span", { children: "🔒" }),
                                    "Fórmula Não Descoberta",
                                  ],
                                }),
                                h.jsx("span", {
                                  className:
                                    "text-[9px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-500 shrink-0 font-mono",
                                  children: y.categoryLabel || y.category,
                                }),
                              ],
                            }),
                            h.jsx("div", {
                              className:
                                "text-[11px] text-stone-500 italic font-mono",
                              children: "??? + ??? ➔ ???",
                            }),
                            h.jsx("div", {
                              className:
                                "text-[10px] text-amber-500/70 border-t border-white/5 pt-1",
                              children:
                                "💡 Experimente na Forja ou estude livros de receitas!",
                            }),
                          ],
                        },
                        y.id,
                      );
                    }

                    const w = o(y);
                    return h.jsxs(
                      "div",
                      {
                        className: `p-2 rounded-xl border flex flex-col justify-between gap-1 transition text-xs ${w ? "border-emerald-500/40 bg-emerald-950/20" : "border-white/5 bg-black/40 opacity-85"}`,
                        children: [
                          h.jsxs("div", {
                            className: "flex items-start justify-between gap-1",
                            children: [
                              h.jsx("span", {
                                className:
                                  "font-bold text-white leading-tight font-serif",
                                children: y.name,
                              }),
                              h.jsx("span", {
                                className:
                                  "text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 shrink-0 font-mono",
                                children: y.categoryLabel,
                              }),
                            ],
                          }),
                          h.jsxs("div", {
                            className:
                              "text-[11px] text-slate-300 flex items-center gap-1 flex-wrap",
                            children: [
                              h.jsx("span", {
                                className: "text-amber-400",
                                children: y.ingredient1Name,
                              }),
                              h.jsx("span", {
                                className: "text-slate-500",
                                children: "+",
                              }),
                              h.jsx("span", {
                                className: "text-amber-400",
                                children: y.ingredient2Name,
                              }),
                              y.ingredient3Name &&
                                h.jsxs(h.Fragment, {
                                  children: [
                                    h.jsx("span", {
                                      className: "text-slate-500",
                                      children: "+",
                                    }),
                                    h.jsx("span", {
                                      className: "text-amber-300 font-semibold",
                                      children: y.ingredient3Name,
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          y.results &&
                            y.results.length > 1 &&
                            h.jsxs("div", {
                              className:
                                "text-[10px] text-amber-200/90 font-mono bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20",
                              children: [
                                "Opções: ",
                                y.results.map((v) => v.name).join(" OU "),
                              ],
                            }),
                          h.jsxs("div", {
                            className:
                              "flex items-center justify-between pt-1 border-t border-white/5 mt-1",
                            children: [
                              h.jsx("span", {
                                className: `text-[10px] font-semibold ${w ? "text-emerald-400" : "text-slate-500"}`,
                                children: w
                                  ? "✓ Materiais na mochila"
                                  : "Faltam ingredientes",
                              }),
                              w &&
                                h.jsxs("div", {
                                  className: "flex items-center gap-1",
                                  children: [
                                    y.id === "fuse_campfire_unlit" &&
                                      h.jsxs("button", {
                                        onClick: () => {
                                          const v = l.find(
                                            (T) =>
                                              T.name
                                                .toLowerCase()
                                                .includes("galho") ||
                                              T.id.includes("galho"),
                                          );
                                          v &&
                                            m &&
                                            (m(
                                              v,
                                              v,
                                              null,
                                              "choice_campfire_unlit",
                                            ),
                                            t(),
                                            c());
                                        },
                                        className:
                                          "px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold transition shadow cursor-pointer flex items-center gap-1",
                                        title:
                                          "Construir fogueira no terreno agora",
                                        children: [
                                          h.jsx(Lr, {
                                            className:
                                              "h-3 w-3 text-yellow-300",
                                          }),
                                          "Construir",
                                        ],
                                      }),
                                    h.jsx("button", {
                                      onClick: () => u(y),
                                      className:
                                        "px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition shadow cursor-pointer",
                                      children: "Preencher Forja",
                                    }),
                                  ],
                                }),
                            ],
                          }),
                        ],
                      },
                      y.id,
                    );
                  }),
              }),
            ],
          })
        : null;
    };
  function hn(e) {
    if (!e) return !1;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase(),
      o = (e.description || "").toLowerCase();
    return (
      t.includes("faca") ||
      t.includes("adaga") ||
      t.includes("knife") ||
      t.includes("dagger") ||
      l.includes("faca") ||
      l.includes("knife") ||
      l.includes("adaga") ||
      l.includes("dagger") ||
      o.includes("destrinchar")
    );
  }
  function Qb(e, t) {
    for (const l of Object.keys(t)) {
      const o = t[l];
      if (o && hn(o)) return !0;
    }
    return e.some((l) => hn(l));
  }
  function u0(e, t) {
    for (const l of Object.keys(t)) {
      const o = t[l];
      if (o && hn(o)) return o;
    }
    return e.find((l) => hn(l)) || null;
  }
  function Jb(e) {
    return e ? ac(e) !== null : !1;
  }
  function ac(e) {
    if (!e) return null;
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase(),
      o = (e.icon || "").toLowerCase();
    // 🔒 CORREÇÃO DO BUG: peças extraídas ao destrinchar (carne, ossos, pele...)
    // NÃO podem ser destrinchadas novamente — impede loot infinito.
    if (
      e.isCreaturePart === true ||
      l.startsWith("butcher_") ||
      l.startsWith("item_carne_") ||
      l.startsWith("item_osso_") ||
      l.startsWith("item_pele_") ||
      l.startsWith("item_entranhas_") ||
      l.startsWith("item_dente_") ||
      l.startsWith("item_chifre_") ||
      l.startsWith("item_pe_de_coelho") ||
      l.startsWith("item_escama_") ||
      l.startsWith("item_asa_") ||
      l.startsWith("item_cranio_") ||
      // 🔒 CORREÇÃO: "Carne de Coelho" NÃO é o coelho inteiro — a checagem de
      // espécie abaixo não pode casar com nomes de peças ("... de X").
      /^carne\s/.test(t) ||
      /^pele\s/.test(t) ||
      /^couro\s/.test(t) ||
      /^osso/.test(t) ||
      /^entranhas\s/.test(t) ||
      /^dente\s/.test(t) ||
      /^chifre\s/.test(t) ||
      /^escama/.test(t) ||
      /^asa\s/.test(t) ||
      /^asas\s/.test(t) ||
      /^cr[aâ]nio\s/.test(t) ||
      t.includes("carne ") ||
      t.includes("ossos") ||
      t.includes("osso ") ||
      t.includes("pele ") ||
      t.includes("couro ") ||
      t.includes("entranhas") ||
      t.includes("dente ") ||
      t.includes("chifre ") ||
      t.includes("pé de coelho") ||
      t.includes("pe de coelho") ||
      t.includes("escamas") ||
      t.includes("asa ") ||
      t.includes("asas ") ||
      t.includes("crânio") ||
      t.includes("cranio")
    )
      return null;
    return t.includes("gosma") ||
      t.includes("slime") ||
      t.includes("gelatina") ||
      t.includes("aranha") ||
      t.includes("spider") ||
      t.includes("escorpião") ||
      t.includes("escorpiao") ||
      t.includes("scorpion") ||
      t.includes("morcego") ||
      t.includes("bat") ||
      t.includes("serpente") ||
      t.includes("cobra") ||
      t.includes("snake") ||
      t.includes("peixe") ||
      t.includes("fish") ||
      t.includes("lambari") ||
      t.includes("tilapia") ||
      t.includes("tilápia") ||
      t.includes("cascudo") ||
      t.includes("truta") ||
      t.includes("golem")
      ? null
      : detectMigratedCreature(t, l, o);
  }
  function f0(e) {
    const creatureDef = getCreature(typeof e == "string" ? e : ac(e) || "wolf");
    if (creatureDef && creatureDef.sheet) return { ...creatureDef.sheet };
  }
  function e1(e) {
    const t = Date.now(),
      l = () => Math.random().toString(36).substring(2, 6);
    const creatureDef = getCreature(e);
    if (creatureDef && creatureDef.loot) return creatureDef.loot(t, l);
  }
