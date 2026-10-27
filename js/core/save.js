/* js/core/save.js
 * Salvar/carregar/apagar save no localStorage com suporte a até 3 Slots de Salve.
 * A chave legada SAVE_KEY fica em ui/inventory.js ("rpg_campfire_save_v1").
 * Escopo global compartilhado entre os <script>: a ORDEM em index.html importa.
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  var LEGACY_SAVE_KEY = typeof SAVE_KEY !== "undefined" ? SAVE_KEY : "rpg_campfire_save_v1";
  var MAX_SAVE_SLOTS = 3;
  var ACTIVE_SLOT_KEY = "rpg_active_save_slot";

  function getSlotStorageKey(slotId) {
    var id = parseInt(slotId, 10);
    if (isNaN(id) || id < 1 || id > MAX_SAVE_SLOTS) {
      id = 1;
    }
    return "rpg_save_slot_" + id;
  }

  function getActiveSaveSlot() {
    try {
      var raw = localStorage.getItem(ACTIVE_SLOT_KEY);
      var id = parseInt(raw, 10);
      if (!isNaN(id) && id >= 1 && id <= MAX_SAVE_SLOTS) {
        return id;
      }
      return 1;
    } catch (e) {
      return 1;
    }
  }

  function setActiveSaveSlot(slotId) {
    try {
      var id = parseInt(slotId, 10);
      if (isNaN(id) || id < 1 || id > MAX_SAVE_SLOTS) {
        id = 1;
      }
      localStorage.setItem(ACTIVE_SLOT_KEY, String(id));
      return id;
    } catch (e) {
      return 1;
    }
  }

  function generateRandomSeed() {
    return Math.floor(Math.random() * 900000) + 10000;
  }

  function saveGameState(e, targetSlot) {
    try {
      var slot = targetSlot ? parseInt(targetSlot, 10) : getActiveSaveSlot();
      if (isNaN(slot) || slot < 1 || slot > MAX_SAVE_SLOTS) {
        slot = 1;
      }
      e.slotId = slot;
      e.savedAt = Date.now();
      
      var serialized = JSON.stringify(e);
      var key = getSlotStorageKey(slot);
      localStorage.setItem(key, serialized);

      // Compatibilidade retroativa com chave única antiga se for o Slot 1
      if (slot === 1) {
        try {
          localStorage.setItem(LEGACY_SAVE_KEY, serialized);
        } catch (ignored) {}
      }
      return true;
    } catch (err) {
      console.warn("[SaveManager] Failed to save game state:", err);
      return false;
    }
  }

  function loadGameState(targetSlot) {
    try {
      var slot = targetSlot ? parseInt(targetSlot, 10) : getActiveSaveSlot();
      if (isNaN(slot) || slot < 1 || slot > MAX_SAVE_SLOTS) {
        slot = 1;
      }
      var key = getSlotStorageKey(slot);
      var raw = localStorage.getItem(key);

      // Fallback para chave antiga se slot 1 estiver vazio
      if (!raw && slot === 1) {
        raw = localStorage.getItem(LEGACY_SAVE_KEY);
      }
      if (!raw) return null;

      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.checkpoint || typeof parsed.checkpoint.tx !== "number") {
        return null;
      }
      return parsed;
    } catch (err) {
      console.warn("[SaveManager] Failed to parse save state:", err);
      return null;
    }
  }

  function clearGameState(targetSlot) {
    try {
      var slot = targetSlot ? parseInt(targetSlot, 10) : getActiveSaveSlot();
      if (isNaN(slot) || slot < 1 || slot > MAX_SAVE_SLOTS) {
        slot = 1;
      }
      var key = getSlotStorageKey(slot);
      localStorage.removeItem(key);

      if (slot === 1) {
        try {
          localStorage.removeItem(LEGACY_SAVE_KEY);
        } catch (ignored) {}
      }
      return true;
    } catch (err) {
      console.warn("[SaveManager] Failed to clear save state:", err);
      return false;
    }
  }

  function getAllSaveSlots() {
    var slots = [];
    for (var i = 1; i <= MAX_SAVE_SLOTS; i++) {
      var data = loadGameState(i);
      if (!data) {
        slots.push({
          slotId: i,
          isEmpty: true,
          data: null,
        });
      } else {
        var ts = data.timestamp || data.savedAt || (data.checkpoint && data.checkpoint.savedAt) || Date.now();
        var dateObj = new Date(ts);
        var formattedDate = !isNaN(dateObj.getTime())
          ? dateObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Data desconhecida";

        var seed = (data.world && data.world.seed) || (data.checkpoint && data.checkpoint.seed) || null;
        var hp = data.player ? (data.player.hp ?? 100) : 100;
        var maxHp = data.player ? (data.player.maxHp ?? 100) : 100;
        var gold = (data.inventory && typeof data.inventory.gold === "number") ? data.inventory.gold : 0;
        var timeOfDay = (data.world && typeof data.world.timeOfDay === "number") ? data.world.timeOfDay : 0.5;
        var nightCount = (data.world && typeof data.world.nightCount === "number") ? data.world.nightCount : 0;
        var checkpointName = (data.checkpoint && data.checkpoint.name) || "Fogueira Crepitante";
        var isUnderground = !!(data.checkpoint && data.checkpoint.isUnderground);

        slots.push({
          slotId: i,
          isEmpty: false,
          data: data,
          timestamp: ts,
          formattedDate: formattedDate,
          seed: seed,
          hp: Math.round(hp),
          maxHp: Math.round(maxHp),
          gold: gold,
          timeOfDay: timeOfDay,
          nightCount: nightCount,
          checkpointName: checkpointName,
          isUnderground: isUnderground,
        });
      }
    }
    return slots;
  }

  // Exporta para o escopo global (usado por game-main.js e menu.js)
  window.MAX_SAVE_SLOTS = MAX_SAVE_SLOTS;
  window.getActiveSaveSlot = getActiveSaveSlot;
  window.setActiveSaveSlot = setActiveSaveSlot;
  window.generateRandomSeed = generateRandomSeed;
  window.saveGameState = saveGameState;
  window.loadGameState = loadGameState;
  window.clearGameState = clearGameState;
  window.getAllSaveSlots = getAllSaveSlots;

  G.save = {
    MAX_SAVE_SLOTS: MAX_SAVE_SLOTS,
    getActiveSaveSlot: getActiveSaveSlot,
    setActiveSaveSlot: setActiveSaveSlot,
    generateRandomSeed: generateRandomSeed,
    saveGameState: saveGameState,
    loadGameState: loadGameState,
    clearGameState: clearGameState,
    getAllSaveSlots: getAllSaveSlots,
  };
})(window.Game);
