/* js/data/conhecimento-receitas.js
 * Gerenciador de Descoberta e Estudo de Receitas da Forja (Mesa de Fusão).
 * - Modo normal: as receitas começam ocultas (não reveladas no livro de fórmulas).
 * - Descoberta por tentativa: quando o jogador combina os itens certos na forja, a receita é desbloqueada.
 * - Descoberta por estudo: ao ler e estudar livros/pergaminhos por pelo menos 1 minuto (60s a 120s),
 *   todas as receitas daquele livro são aprendidas e adicionadas à forja.
 * - Modo desenvolvedor: se ativo (window.__devMode), todas as receitas ficam visíveis para testes.
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  const STORAGE_KEY_RECIPES = "rpg_unlocked_recipes";
  const STORAGE_KEY_STUDY = "rpg_studied_books";

  // Carrega receitas desbloqueadas salvas
  function loadUnlockedRecipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RECIPES);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch (e) {
      console.warn("Erro ao carregar receitas desbloqueadas:", e);
    }
    return new Set();
  }

  // Carrega progresso de estudo dos livros
  function loadStudiedBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STUDY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") return obj;
      }
    } catch (e) {
      console.warn("Erro ao carregar livros estudados:", e);
    }
    return {};
  }

  const unlockedSet = loadUnlockedRecipes();
  const studiedMap = loadStudiedBooks();

  function saveUnlockedRecipes() {
    try {
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify([...unlockedSet]));
    } catch (e) {}
  }

  function saveStudiedBooks() {
    try {
      localStorage.setItem(STORAGE_KEY_STUDY, JSON.stringify(studiedMap));
    } catch (e) {}
  }

  // Normalizador para garantir compatibilidade entre IDs e chaves de banco dos livros
  function normalizeBookId(idOrKey) {
    if (!idOrKey) return "";
    const s = String(idOrKey).toLowerCase().trim();
    if (s.includes("culinaria_2") || s.includes("culinaria-2") || s.includes("volume ii") || s.includes("volume 2")) return "culinaria_vol2";
    if (s.includes("culinaria") || s.includes("volume i") || s.includes("volume 1")) return "culinaria_vol1";
    if (s.includes("ferramenta") || s.includes("primitiv")) return "ferramentas_primitivas";
    if (s.includes("basico") || s.includes("básico") || s.includes("construcao") || s.includes("construção")) return "itens_basicos";
    if (s.includes("arma") || s.includes("equipamento")) return "armas_e_equipamentos";
    if (s.includes("catalogo") || s.includes("catálogo") || s.includes("recurso")) return "catalogo_itens";
    if (s.includes("geografia") || s.includes("bioma") || s.includes("bestiario") || s.includes("bestiário") || s.includes("criatura")) return "geografia_biomas";
    if (s.includes("runic") || s.includes("rúnic") || s.includes("misterio") || s.includes("mistério")) return "pergaminho_runico_misterio";
    return s;
  }

  // Listener para eventos de áudio e notificação
  function notifyDiscovery(name, source = "experiment") {
    try {
      if (G.Audio && typeof G.Audio.playTone === "function") {
        G.Audio.playTone(523, "triangle", 0.15, 0.2); // C5
        setTimeout(() => G.Audio.playTone && G.Audio.playTone(659, "triangle", 0.18, 0.25), 120); // E5
        setTimeout(() => G.Audio.playTone && G.Audio.playTone(784, "triangle", 0.25, 0.3), 240); // G5
        setTimeout(() => G.Audio.playTone && G.Audio.playTone(1046, "sine", 0.4, 0.4), 380); // C6
      }
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent("rpg_recipe_unlocked", {
        detail: { name, source },
      }),
    );
  }

  function notifyKnowledgeUpdated(bookId, bookName, completed = false) {
    window.dispatchEvent(
      new CustomEvent("rpg_knowledge_updated", {
        detail: { bookId, bookName, completed },
      }),
    );
  }

  const RecipeKnowledge = {
    normalizeBookId,

    // Verifica se a receita está desbloqueada no livro de fórmulas
    isRecipeUnlocked(recipeId) {
      if (!recipeId) return false;
      // Modo Desenvolvedor: todas as receitas visíveis
      if (typeof window !== "undefined" && Boolean(window.__devMode)) {
        return true;
      }
      return unlockedSet.has(recipeId);
    },

    // Desbloqueia uma receita (por tentativa de criação na forja)
    unlockRecipe(recipeId, recipeName = "Nova Fórmula") {
      if (!recipeId) return false;
      const isNew = !unlockedSet.has(recipeId);
      if (isNew) {
        unlockedSet.add(recipeId);
        saveUnlockedRecipes();
        notifyDiscovery(recipeName, "experiment");
      }
      return isNew;
    },

    // Desbloqueia múltiplas receitas (por estudo concluído de um livro)
    unlockRecipes(recipeIdList, sourceName = "Estudo de Livro") {
      if (!Array.isArray(recipeIdList)) return 0;
      let countNew = 0;
      recipeIdList.forEach((id) => {
        if (id && !unlockedSet.has(id)) {
          unlockedSet.add(id);
          countNew++;
        }
      });
      if (countNew > 0) {
        saveUnlockedRecipes();
        notifyDiscovery(sourceName, "study");
      }
      return countNew;
    },

    // Retorna a lista de todas as receitas desbloqueadas
    getUnlockedList() {
      return [...unlockedSet];
    },

    // Retorna a quantidade de receitas desbloqueadas
    getUnlockedCount() {
      return unlockedSet.size;
    },

    // Progresso de estudo de um livro/pergaminho
    getStudyState(bookId, defaultTotalSeconds = 60) {
      if (!bookId) return { seconds: 0, totalSeconds: defaultTotalSeconds, completed: false, percentage: 0 };
      const norm = normalizeBookId(bookId);
      const entry = studiedMap[norm] || studiedMap[bookId];
      if (!entry) {
        return {
          seconds: 0,
          totalSeconds: defaultTotalSeconds,
          completed: false,
          percentage: 0,
        };
      }
      const total = entry.totalSeconds || defaultTotalSeconds;
      const secs = entry.seconds || 0;
      const completed = Boolean(entry.completed);
      const percentage = Math.min(100, Math.round((secs / total) * 100));
      return {
        seconds: secs,
        totalSeconds: total,
        completed,
        percentage,
      };
    },

    // Adiciona tempo de estudo ao livro
    addStudySeconds(bookId, deltaSeconds, totalSeconds, recipeIdList, bookTitle = "Livro") {
      if (!bookId) return { seconds: 0, completed: false, newlyCompleted: false };
      const norm = normalizeBookId(bookId);
      totalSeconds = Math.max(60, totalSeconds || 60); // Mínimo absoluto de 60 segundos
      const cur = studiedMap[norm] || studiedMap[bookId] || { seconds: 0, totalSeconds, completed: false };
      
      const prevCompleted = Boolean(cur.completed);
      const nextSeconds = Math.min(totalSeconds, (cur.seconds || 0) + deltaSeconds);
      const nextCompleted = nextSeconds >= totalSeconds;

      const record = {
        seconds: nextSeconds,
        totalSeconds,
        completed: nextCompleted,
      };

      studiedMap[norm] = record;
      studiedMap[bookId] = record;
      saveStudiedBooks();

      let newlyCompleted = false;
      if (!prevCompleted && nextCompleted) {
        newlyCompleted = true;
        // Desbloqueia todas as receitas vinculadas a este livro (se houver)
        if (Array.isArray(recipeIdList) && recipeIdList.length > 0) {
          this.unlockRecipes(recipeIdList, bookTitle);
        }
        notifyDiscovery(bookTitle, "study");
        notifyKnowledgeUpdated(norm, bookTitle, true);
      } else {
        notifyKnowledgeUpdated(norm, bookTitle, false);
      }

      return {
        seconds: nextSeconds,
        totalSeconds,
        completed: nextCompleted,
        newlyCompleted,
      };
    },

    // Conclui instantaneamente o estudo de um livro (usado para modo dev ou conclusão direta)
    completeBookStudy(bookId, recipeIdList = null, bookTitle = "Livro") {
      if (!bookId) return false;
      const norm = normalizeBookId(bookId);
      let bookData = null;
      if (G.BooksAndScrolls && typeof G.BooksAndScrolls.getData === "function") {
        bookData = G.BooksAndScrolls.getData(bookId);
      }
      const totalSeconds = (bookData && bookData.studyTime) || 60;
      const recipes = recipeIdList || (bookData && bookData.recipeIds) || [];
      const title = bookTitle !== "Livro" ? bookTitle : (bookData && bookData.name) || "Livro";

      const record = {
        seconds: totalSeconds,
        totalSeconds,
        completed: true,
      };

      studiedMap[norm] = record;
      studiedMap[bookId] = record;
      saveStudiedBooks();

      if (Array.isArray(recipes) && recipes.length > 0) {
        this.unlockRecipes(recipes, title);
      }
      notifyKnowledgeUpdated(norm, title, true);
      return true;
    },

    // Reseta o progresso de estudo de um livro (ou de todos, se bookId for nulo)
    resetBookStudy(bookId = null) {
      if (bookId) {
        const norm = normalizeBookId(bookId);
        delete studiedMap[norm];
        delete studiedMap[bookId];
      } else {
        for (const k in studiedMap) delete studiedMap[k];
      }
      saveStudiedBooks();
      notifyKnowledgeUpdated(bookId || "all", "Reset", false);
    },

    // Verifica se o livro já foi completamente estudado
    isBookCompleted(bookId) {
      if (!bookId) return false;
      const norm = normalizeBookId(bookId);
      return Boolean(studiedMap[norm]?.completed || studiedMap[bookId]?.completed);
    },

    // Retorna os slots de conhecimento que já foram estudados/dominados pelo jogador:
    // Começa vazio, sem revelar nomes, quantidades ou referências de livros não descobertos.
    getKnowledgeSlots(includeUncompleted = false) {
      const allBooks = G.BooksAndScrolls && typeof G.BooksAndScrolls.getAllStudyableBooks === "function"
        ? G.BooksAndScrolls.getAllStudyableBooks()
        : [];

      const categorized = {
        receitas: [],
        catalogo: [],
        mapas: [],
      };

      let completedCount = 0;

      allBooks.forEach((book) => {
        const norm = normalizeBookId(book.id || book.key);
        const state = this.getStudyState(norm, book.studyTime || 60);
        const isCompleted = Boolean(state.completed);
        if (isCompleted) completedCount++;

        // Só inclui no compêndio do jogador se já foi estudado e aprendido
        if (isCompleted || includeUncompleted) {
          const rawCat = (book.learningType || book.category || "receitas").toLowerCase();
          const targetCategory =
            rawCat.includes("catalogo")
              ? "catalogo"
              : rawCat.includes("mapa") || rawCat.includes("geografia")
              ? "mapas"
              : "receitas";

          categorized[targetCategory].push({
            ...book,
            normalizedId: norm,
            isCompleted,
            studyProgress: state,
          });
        }
      });

      return {
        categories: categorized,
        completedCount,
      };
    },
  };

  G.RecipeKnowledge = RecipeKnowledge;
})(window.Game);
