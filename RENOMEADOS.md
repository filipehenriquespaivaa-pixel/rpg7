# Nomes renomeados

O código veio compilado, com nomes curtos. Estes foram renomeados (só a variável e todos os seus usos, com análise de escopo). Use a tabela para ler commits antigos e `legacy/app.original.js`. Os demais nomes curtos continuam como estavam.

| Antigo | Novo | O que é | Arquivo |
|---|---|---|---|
| `eg` | `World` | Mundo procedural (tiles, cavernas, fogueiras, panela) | `js/core/world.js` |
| `Vt` | `SimplexNoise` | Gerador de ruído Simplex | `js/core/noise-e-biomas.js` |
| `ye` | `BiomeId` | Enum dos IDs de bioma | `js/core/noise-e-biomas.js` |
| `ya` | `BIOMES` | Tabela de biomas | `js/core/noise-e-biomas.js` |
| `Kt` | `RESOURCE_DIFFICULTY` | Dificuldade dos recursos coletáveis | `js/core/noise-e-biomas.js` |
| `fo` | `WorldRenderer` | Renderizador do mundo (Canvas) | `js/engine/renderer.js` |
| `Qu` | `AudioManager` | Gerenciador de áudio sintético | `js/engine/audio.js` |
| `qb` | `CreatureManager` | Gerenciador de criaturas/entidades | `js/engine/creatures-manager.js` |
| `Vb` | `EQUIPMENT_SLOTS` | Definição dos slots de equipamento | `js/data/itens.js` |
| `un` | `RARITIES` | Estilos por raridade | `js/data/itens.js` |
| `Ub` | `createEmptyEquipment` | Cria equipamento vazio (todos os slots null) | `js/data/itens.js` |
| `Ja` | `ItemIcon` | Componente que desenha o ícone de um item | `js/ui/item-icon.js` |
| `a0` | `drawItemIcon` | Função de canvas que desenha o ícone do item | `js/engine/draw-itens-e-armas.js` |
| `Yb` | `Hud` | HUD (minimapa, botões de toque, barras) | `js/ui/hud.js` |
| `Xb` | `FUSION_RECIPES` | Lista de receitas de fusão | `js/data/receitas-fusao.js` |
| `a1` | `ItemDetailPanel` | Painel de detalhe do item | `js/ui/inventory.js` |
| `t1` | `InventoryModal` | Modal do inventário | `js/ui/inventory.js` |
| `s1` | `GameMain` | Componente principal do jogo | `js/ui/game-main.js` |
| `c1` | `App` | Componente raiz (monta o React) | `js/ui/main.js` |
| `l1` | `saveGameState` | Salvar o jogo | `js/core/save.js` |
| `i1` | `loadGameState` | Carregar o jogo | `js/core/save.js` |
| `n1` | `clearGameState` | Apagar o save | `js/core/save.js` |
| `tc` | `SAVE_KEY` | Chave do save no localStorage | `js/ui/inventory.js` |
| `xg` | `drawScorpionBody` | Corpo do escorpião (escolhe a direção) | `js/creatures/scorpion.js` |
| `Ju` | `drawScorpionSide` | Escorpião de lado (esquerda/direita) | `js/creatures/scorpion.js` |
| `Dg` | `drawScorpionFront` | Escorpião de frente (olhando para baixo) | `js/creatures/scorpion.js` |
| `Ig` | `drawScorpionBack` | Escorpião de costas (olhando para cima) | `js/creatures/scorpion.js` |
| `e0` | `drawScorpionClaw` | Garra do escorpião | `js/creatures/scorpion.js` |
| `sb` | `CREATURES.scorpion.draw.icon` | Ícone do escorpião (antes função em `draw-criaturas.js`) | `js/creatures/scorpion.js` |
| `cb` | `CREATURES.spider.draw.icon` | Ícone da aranha (antes função em `draw-criaturas.js`) | `js/creatures/spider.js` |
| `jg` | `CREATURES.dragon.draw.body` | Corpo do dragão (antes função em `draw-personagem-e-efeitos.js`) | `js/creatures/dragon.js` |
| `Ob` | `CREATURES.dragon.draw.icon` | Ícone do dragão (antes função em `draw-criaturas.js`) | `js/creatures/dragon.js` |
| `nb` | `CREATURES.slime.draw.icon` | Ícone do slime (antes função em `draw-criaturas.js`) | `js/creatures/slime.js` |
| `_renderDesertCitizen` | `CITIZEN_KINDS["desert-citizen"].draw` | Desenho do morador do deserto | `js/citizens/desert-citizen.js` |
| `_renderPortCitizen` | `CITIZEN_KINDS["port-citizen"].draw` | Desenho do morador do porto | `js/citizens/port-citizen.js` |
| `_renderCitizen` | `CITIZEN_KINDS["snow-citizen"].draw` | Desenho do morador da neve | `js/citizens/snow-citizen.js` |
| `_renderPrisoner` | `CITIZEN_KINDS["snow-prisoner"].draw` | Desenho do prisioneiro | `js/citizens/snow-prisoner.js` |
| `_renderSoldier` | `CITIZEN_KINDS["snow-soldier"].draw` | Desenho do soldado | `js/citizens/snow-soldier.js` |
| `SKIN_TONES`, `HAIR_COLORS`, `OUTFIT_PALETTES`, `CITIZEN_PROFILES`, `PORT_PROFILES`, `OUTFIT_COLORS`, `FEMALE_NAMES` | `skinTones`, `hairColors`, `outfitPalettes`, `profiles`, `outfitColors`, `femaleNames` | Paletas e nomes dos habitantes (os nomes antigos continuam como variáveis locais em `_initCitizens`) | `js/citizens/*.js` |
