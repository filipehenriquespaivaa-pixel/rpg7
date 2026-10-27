/* js/extras/colisores-debug.js
 * Gerenciamento do estado dos colisores de depuração (window.__showColliders).
 * O botão flutuante anterior no canto superior direito foi removido a pedido do jogador
 * e integrado diretamente na Sidebar de Configurações do Modo Desenvolvedor.
 */
(function () {
  "use strict";
  if (window.__colliderManagerInit) return;
  window.__colliderManagerInit = !0;

  try {
    window.__showColliders = localStorage.getItem("rpg2d_colliders") === "1";
    window.__devMode = localStorage.getItem("rpg2d_dev_mode") === "1";
  } catch (e) {
    window.__showColliders = !1;
    window.__devMode = !1;
  }

  // Remove qualquer botão legado flutuante que possa ter ficado no DOM
  function removeLegacyBtn() {
    const old = document.getElementById("btn-colisores");
    if (old && old.parentNode) {
      old.parentNode.removeChild(old);
    }
  }

  window.toggleColliders = function () {
    window.__showColliders = !window.__showColliders;
    try {
      localStorage.setItem(
        "rpg2d_colliders",
        window.__showColliders ? "1" : "0",
      );
    } catch (e) {}
    if (typeof window.__onCollidersChanged === "function") {
      window.__onCollidersChanged(window.__showColliders);
    }
    return window.__showColliders;
  };

  window.setColliders = function (val) {
    window.__showColliders = !!val;
    try {
      localStorage.setItem(
        "rpg2d_colliders",
        window.__showColliders ? "1" : "0",
      );
    } catch (e) {}
    if (typeof window.__onCollidersChanged === "function") {
      window.__onCollidersChanged(window.__showColliders);
    }
    return window.__showColliders;
  };

  window.updateColliderBtnVisibility = function () {
    removeLegacyBtn();
  };

  if (document.body) removeLegacyBtn();
  else document.addEventListener("DOMContentLoaded", removeLegacyBtn);
})();
