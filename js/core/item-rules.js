/* js/core/item-rules.js
 * Regras de equipar item (To, fn, Qs).
 * Trecho de legacy/app.original.js (linhas 36371-36559); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function To(e) {
    var g;
    if (!e)
      return {
        allowed: !1,
        categoryName: "Vazio",
        maxCapacity: 0,
        reason: "Nenhum item selecionado.",
      };
    const t = (e.name || "").toLowerCase(),
      l = (e.id || "").toLowerCase();
    return t.includes("lobo") ||
      l.includes("lobo") ||
      l.includes("wolf") ||
      t.includes("cervo") ||
      l.includes("cervo") ||
      l.includes("deer") ||
      t.includes("dragão") ||
      t.includes("dragao") ||
      l.includes("dragon") ||
      t.includes("golem") ||
      l.includes("golem") ||
      ((t.includes("escorpião") || t.includes("escorpiao") || l.includes("scorpion")) &&
        (t.includes("gigante") || l.includes("giant")))
      ? {
          allowed: !1,
          categoryName: "Criatura Grande (Não Permitida)",
          maxCapacity: 0,
          reason:
            "Criaturas grandes como Lobos, Cervos, Escorpiões Gigantes e Dragões não cabem nos bolsos do cinto!",
        }
      : t.includes("panela") ||
          l.includes("panela") ||
          t.includes("caldeirão") ||
          t.includes("caldeirao") ||
          l.includes("caldeirao") ||
          t.includes("jarra") ||
          l.includes("jarra") ||
          t.includes("baú") ||
          t.includes("bau") ||
          t.includes("forno") ||
          t.includes("bancada")
        ? {
            allowed: !1,
            categoryName: "Item Grande / Panela",
            maxCapacity: 0,
            reason:
              "Itens primários ou secundários grandes (como panelas, caldeirões e jarras) não cabem no cinto!",
          }
        : t.includes("lança") ||
            t.includes("lanca") ||
            l.includes("spear") ||
            t.includes("escudo") ||
            l.includes("shield") ||
            t.includes("alabarda") ||
            l.includes("halberd") ||
            t.includes("tridente") ||
            l.includes("trident")
          ? {
              allowed: !1,
              categoryName: "Ferramenta/Arma Grande (Proibida no Cinto)",
              maxCapacity: 0,
              reason:
                "Ferramentas e armas grandes (como Lança ou Escudo) não cabem no cinto!",
            }
          : t.includes("frasco") ||
              l.includes("frasco") ||
              t.includes("poção") ||
              t.includes("pocao") ||
              l.includes("pocao") ||
              l.includes("potion") ||
              t.includes("elixir") ||
              l.includes("elixir") ||
              t.includes("vial") ||
              l.includes("vial") ||
              t.includes("ampola") ||
              l.includes("ampola") ||
              (e.categoryType === "consumable" &&
                (t.includes("água") ||
                  t.includes("agua") ||
                  t.includes("cura") ||
                  t.includes("vida") ||
                  t.includes("vigor")))
            ? {
                allowed: !0,
                category: "flask",
                categoryName: "Frasco / Poção",
                maxCapacity: 3,
              }
            : t.includes("aranha") ||
                l.includes("aranha") ||
                l.includes("spider") ||
                t.includes("escorpião") ||
                t.includes("escorpiao") ||
                l.includes("scorpion") ||
                t.includes("morcego") ||
                l.includes("bat") ||
                t.includes("tardígrado") ||
                t.includes("tardigrado") ||
                l.includes("tardigrade")
              ? {
                  allowed: !0,
                  category: "creature_spider_scorpion",
                  categoryName: "Aranha / Escorpião / Tardígrado",
                  maxCapacity: 3,
                }
              : t.includes("gosma") ||
                  l.includes("gosma") ||
                  l.includes("slime") ||
                  t.includes("gelatina") ||
                  t.includes("coelho") ||
                  l.includes("coelho") ||
                  l.includes("rabbit")
                ? {
                    allowed: !0,
                    category: "creature_small",
                    categoryName: "Criatura Pequena (Gosma/Coelho)",
                    maxCapacity: 1,
                  }
                : (((g = e.stats) == null ? void 0 : g.attack) !== void 0 &&
                      e.stats.attack > 0) ||
                    e.slot === "mao_direita" ||
                    e.slot === "mao_esquerda" ||
                    t.includes("faca") ||
                    l.includes("faca") ||
                    l.includes("knife") ||
                    t.includes("espada") ||
                    l.includes("espada") ||
                    l.includes("sword") ||
                    t.includes("adaga") ||
                    l.includes("adaga") ||
                    l.includes("dagger") ||
                    t.includes("machado") ||
                    l.includes("machado") ||
                    l.includes("axe") ||
                    t.includes("picareta") ||
                    l.includes("picareta") ||
                    l.includes("pickaxe") ||
                    t.includes("foice") ||
                    l.includes("foice") ||
                    l.includes("sickle") ||
                    t.includes("arco") ||
                    l.includes("arco") ||
                    l.includes("bow") ||
                    t.includes("tocha") ||
                    l.includes("torch") ||
                    t.includes("pederneira") ||
                    l.includes("flint") ||
                    t.includes("cajado") ||
                    l.includes("staff") ||
                    t.includes("vara") ||
                    l.includes("fishing_rod")
                  ? {
                      allowed: !0,
                      category: "weapon_tool",
                      categoryName: "Ferramenta / Arma",
                      maxCapacity: 1,
                    }
                  : {
                      allowed: !1,
                      categoryName: "Não permitido no cinto",
                      maxCapacity: 0,
                      reason:
                        "O cinto suporta apenas: frascos (até 3x), ferramentas/armas (1x), aranhas/escorpiões (até 3x) ou criaturas pequenas como gosmas/coelhos (1x). Demais itens ou recipientes grandes (ex: panelas) não cabem no cinto.",
                    };
  }
  function fn(e) {
    return e ? !!e.cinto : !1;
  }
  function Qs(e, t) {
    const l = To(e);
    if (!l.allowed)
      return {
        allowed: !1,
        maxAllowedToAdd: 0,
        reason: l.reason || "Item não permitido nos bolsos do cinto.",
      };
    if (!t) return { allowed: !0, maxAllowedToAdd: l.maxCapacity };
    if (t.name !== e.name && t.id !== e.id)
      return {
        allowed: !1,
        maxAllowedToAdd: 0,
        reason: `Este bolso do cinto já contém ${t.name}. Esvazie o bolso antes de colocar outro item.`,
      };
    const o = t.stackCount || 1,
      u = l.maxCapacity - o;
    return u <= 0
      ? {
          allowed: !1,
          maxAllowedToAdd: 0,
          reason: `Capacidade máxima atingida para este item no bolso do cinto (${l.maxCapacity}/${l.maxCapacity} unidades).`,
        }
      : { allowed: !0, maxAllowedToAdd: u };
  }
