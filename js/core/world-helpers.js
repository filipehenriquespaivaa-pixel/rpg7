/* js/core/world-helpers.js
 * Auxiliares de mundo/colheita (Zu, tg, Hs, og).
 * Trecho de legacy/app.original.js (linhas 18291-18362); unica mudanca: nomes renomeados (ver RENOMEADOS.md).
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";
  function Zu(e, t, l, o) {
    if (o.isDungeonFloor || o.isDungeonWall || o.dungeonRole || l.undergroundLevel === 2) return !1;
    if (o.biome.id === BiomeId.CAVE_FLOOR) return !0;
    const u = o.elevation;
    return (
      (u >= 0.28 && u <= 0.36 && !o.biome.hasWater) ||
      (o.biome.category === "mountain" &&
        o.biome.id !== BiomeId.SNOW_PEAK &&
        l.hash2D(e, t, 77) > 0.45) ||
      (l.hash2D(e, t, 93) > 0.82 &&
        o.biome.category === "land" &&
        !o.biome.hasWater)
    );
  }
  function tg(e, t, l) {
    for (let o = -1; o <= 1; o++)
      for (let u = -1; u <= 1; u++) {
        const m = l.getTile(e + o, t + u);
        if (m.prop && m.prop.kind.startsWith("tree_")) return !0;
      }
    return !1;
  }
  function Hs(e, t, l) {
    const o = l.getTile(e, t);
    if (!o) return !1;
    if (
      o.isDungeonFloor ||
      o.isDungeonWall ||
      o.dungeonRole ||
      l.undergroundLevel === 2 ||
      (l.isUnderground && l.undergroundLevel === 2) ||
      o.isGreekRuin ||
      o.isSnowCity ||
      (o.prop &&
        (o.prop.kind.startsWith("tree_") ||
          o.prop.kind.startsWith("dungeon_") ||
          o.prop.kind === "iron_bars_gate" ||
          o.prop.kind === "corridor_torch" ||
          o.prop.kind === "shrine" ||
          o.prop.kind === "campfire" ||
          o.prop.kind === "clay_deposit" ||
          o.prop.kind === "cliff_wall" ||
          o.prop.kind === "cliff_ramp" ||
          o.prop.kind === "greek_wall"))
    )
      return !1;
    if (o.biome.hasWater) return null;
    const u = Zu(e, t, l, o),
      m = tg(e, t, l),
      c = o.elevation >= 0.28 && o.elevation <= 0.36,
      f = l.isUnderground,
      g = Fs(e, t, l, o),
      y = l.hash2D(e, t, 107),
      w = {
        tile: o,
        tx: e,
        ty: t,
        hasNearbyTree: m,
        isGravel: u,
        isShore: c,
        isCave: f,
        isClayZone: g,
        isLake: o.biome.hasWater,
        hash: y,
      };
    for (const v of ag) if (v.canSpawnAt(w)) return v;
    return null;
  }
  function og(e, t, l) {
    const o = e.id === "item_galho" || e.name.toLowerCase().includes("galho");
    return {
      id: `ground_${e.id}_${t}_${l}`,
      name: e.name,
      categoryType: o ? "equipment" : e.categoryType,
      slot: o ? "mao_direita" : void 0,
      isEquippable: o,
      stats: o ? { attack: 5 } : void 0,
      rarity: e.rarity,
      description: o
        ? "Galho rígido de madeira colhido sob as copas das árvores. Pode ser empunhado na mão direita como arma (+5 de Ataque) ou usado para manufaturar tochas e ferramentas."
        : `${e.description} (Encontrado: ${e.whereFound} • Dificuldade: ${e.difficultyLabel})`,
      icon: e.icon,
      color: e.color,
      value: e.value,
      stackCount: 1,
    };
  }
