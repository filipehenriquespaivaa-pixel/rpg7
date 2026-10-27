# Arquitetura do projeto

HTML + JS puro, sem npm e sem build. Abre com duplo clique no `index.html` (`file://`).

> Para continuar a organização (criaturas, itens, verificação), veja `PROXIMOS-PASSOS-IA.md`.

## Como carrega

O jogo era um bundle único (`assets/app.js`, 48 mil linhas). Foi dividido em arquivos **só movendo o código, sem alterar nenhuma linha** (o original está em `legacy/app.original.js`). Todos os `<script defer>` do `index.html` compartilham o **mesmo escopo global**, então:

- **A ordem dos `<script>` importa.** Um arquivo usa nomes definidos nos anteriores. Não reordene.
- `js/ui/main.js` monta o React e **deve ser o último** do jogo.
- Os nomes continuam curtos (`World`, `CreatureManager`, `GameMain`...), vindos do bundle. O mapa está abaixo e em `REGRAS-PARA-IA.md`.

## Mapa de arquivos (na ordem de carregamento)

### Terceiros (não editar)

- `assets/vendor/tailwind-css.js` (59 linhas): CSS do Tailwind (injetado via <style>). Terceiros: nao editar.
- `assets/vendor/react.js` (14496 linhas): React 19 + ReactDOM + scheduler. Terceiros: nao editar.
- `assets/vendor/lucide-icons.js` (995 linhas): Icones lucide-react + gerador de ruido Simplex (vt), que o bundler colou na mesma declaracao. Terceiros: nao editar.

### Núcleo: regras e mundo, sem desenho

- `js/core/noise-e-biomas.js` (669 linhas): Ruido (SimplexNoise), enum de biomas (BiomeId), tabela de biomas (BIOMES), funcoes de bioma (Jp, Fs) e dificuldade (RESOURCE_DIFFICULTY).
- `js/core/snow-peak-city.js`: Vila Glacial dos Picos Gelados (24 casas com quarto, banheiro, sala, cozinha, chaminés com fumaça e ruas de paralelepípedo).
- `js/core/world.js` (1827 linhas): Mundo procedural: classe World (tiles, cavernas, fogueiras, panela) + item de argila (Gu).
- `js/core/world-helpers.js` (78 linhas): Auxiliares de mundo/colheita (Zu, tg, Hs, og).
- `js/core/item-rules.js` (195 linhas): Regras de equipar item (To, fn, Qs).
- `js/core/save.js` (36 linhas): Salvar/carregar/apagar save no localStorage (saveGameState, loadGameState, clearGameState). A chave SAVE_KEY fica em ui/inventory.js.

### Dados: itens, receitas, recursos

- `js/creatures/registry.js`: núcleo do registro de criaturas (`CREATURES` e funções de consulta).
- `js/creatures/rabbit.js`: o coelho, **criatura completa** num arquivo só (modelo para as próximas).
- `js/creatures/wolf.js`: o lobo (predador), criatura completa, com dois nascimentos (bosques e neve). Carrega **entre** `rabbit.js` e `deer.js`.
- `js/creatures/deer.js`: o cervo (presa), criatura completa.
- `js/creatures/golem.js`: o golem (monstro hostil, **não destrinchável**: sem `carcass`/`sheet`/`loot`/`detect`), com dois nascimentos (vulcânico e `MOUNTAIN_25D`). Carrega depois de `deer.js`.
- `js/creatures/bat.js`: o morcego das profundezas (monstro aéreo hostil), criatura completa. Carrega depois de `golem.js`.
- `js/creatures/tardigrade.js`: o tardígrado cavernoso (invertebrado criptobiótico predador das fendas da caverna do deserto com 8 patas, micro-garras, tamanhos variados até 3x maiores e caçador/devorador de escorpiões). Carrega depois de `bat.js`.
- `js/creatures/spider.js`: a aranha (monstro hostil, **não destrinchável**: sem `carcass`/`sheet`/`loot`/`detect`, como o golem), com quatro nascimentos: `spawn` (Aranha Cavernosa) e `spawnVariants.sand` (Fendas Arenosas, caverna do deserto), `.swamp` (Tarântula Pantaneira) e `.forest` (Aranha dos Bosques). O **escorpião é uma criatura separada** e ainda não foi migrado. Carrega depois de `tardigrade.js`.
- `js/creatures/scorpion.js`: o escorpião (monstro hostil, **não destrinchável**: sem `carcass`/`sheet`/`loot`/`detect`), com `spawn` (Escorpião das Areias na superfície do deserto), `spawnVariants.cave` (túneis da caverna do deserto) e `spawnVariants.giant` (Escorpião Gigante Noturno, lido por `CreatureManager.createGiantScorpion`). Reúne **todo o desenho**: corpo (com a animação de emergir/enterrar na areia), carcaça, ícone e as funções globais `getScorpionHitColliders` (também em `window`) e `drawGiantScorpionCaveReachClaw`, mais os auxiliares `drawScorpionBody/Side/Front/Back/Claw`. A IA (enterrar-se, capturar o jogador, ataques) continua em `creatures-manager.js` e o clima em `weather.js`, que comparam `type === "scorpion"`. A aranha é uma criatura separada. Carrega depois de `spider.js`.
- `js/creatures/dragon.js`: o Dragão Ancião (boss do bioma vulcânico, 35% de chance no lugar do golem). **Destrinchável**: tem `carcass` (com `rarity: "lendario"` e `value: 250`, campos opcionais lidos por `createCarcassForMonster`), `sheet`, `detect` e `loot` (ossos, carne, chifre, dente, escamas, asas e crânio), além do desenho (corpo com asas e fogo, carcaça e ícone). `behavior.fearsFire: false`: não foge de fogueira. A IA de combate (alcance, dano) continua em `creatures-manager.js` e a reação ao clima em `weather.js`, que comparam `type === "dragon"`. Carrega por último (a ordem define a prioridade de detecção por nome).
- `js/creatures/slime.js`: o slime/gosma, **a última criatura a migrar**. Reúne os dados de nascimento (`spawn` = Gosma Verde da Floresta; `spawnVariants` com 13 variantes por bioma/local: geodo, caverna, 8 lagos, pântano, floresta profunda e prados; `swarm` = o enxame ao redor do jogador), a carcaça "Gosma Sem Vida" (`carcass`), `behavior`, `detectIcon` e o desenho: corpo (emergir, pular, grudado no jogador), **`carcassFull`** (carcaça inteira com sombra própria; gancho novo do registro, lido por `Ag`) e ícone. **A IA fica em `creatures-manager.js`** (grudar no jogador e `attachedSlimes`, enxame, dano do sol, lodo/partículas, fuga do fogo) e o clima em `weather.js`, que comparam `type === "slime"`. Sem `sheet`/`loot`/`detect` (como golem, aranha e escorpião: itens com "gosma" no nome são excluídos em `ac()`). `deathParticles: 12` vale para `creatureDeathParticles`; o caminho de morte em combate usa 8 literal para o slime (diferença antiga, mantida). Carrega por último.
- `js/data/recursos-coletaveis.js` (278 linhas): Definicoes de recursos coletaveis do mundo (Xu, Fu, Hu, Wu, Ku, ag).
- `js/data/itens.js` (558 linhas): Slots de equipamento (EQUIPMENT_SLOTS), raridades (RARITIES), fabrica de item (pi) e utilitarios de mochila (Ks, createEmptyEquipment, Zs, ot, t0).
- `js/data/receitas-fusao.js` (1850 linhas): Detectores de ingrediente (et, mn, o0, gi...), Ua e lista de receitas de fusao (FUSION_RECIPES...bl).
- `js/data/fusao-e-loot.js` (943 linhas): Auxiliares de fusao (s0), configs de slots (c0...), deteccao de criatura (ac, f0) e loot (e1).

### Motor: desenho no Canvas e áudio

- `js/engine/render-props.js` (1768 linhas): Desenho dos props do cenario no canvas (rg...Pg), incluindo a fogueira (hg).
- `js/engine/renderer.js` (3073 linhas): Renderizador do mundo (WorldRenderer): cache de chunks, luz, particulas, agua.
- `js/engine/audio.js` (845 linhas): Audio sintetico (classe AudioManager) e instancia hi.
- `js/engine/draw-personagem-e-efeitos.js` (2067 linhas): Desenho de personagens/criaturas animadas e efeitos (Ag, Eg, Ng...Ig).
- `js/engine/weapon-whip.js` (274 linhas): Chicote de Gosma: icone, golpe, estalo, pose na mao (isWhipItemX, drawWhip*).
- `js/engine/draw-itens-e-armas.js` (1316 linhas): Icone de item no canvas (drawItemIcon) e armas/itens desenhados na mao (zg...rb).
- `js/engine/draw-criaturas.js` (2423 linhas): Desenho de criaturas/monstros (lb, ib, nb...zb) e predicado gl.
- `js/engine/creatures-manager.js` (2376 linhas): Gerenciador de criaturas/entidades (CreatureManager): monstros, carcacas, itens no chao, projeteis.

### Interface React e componente principal

- `js/ui/item-icon.js` (47 linhas): Componente ItemIcon: desenha o icone de um item (usa drawItemIcon). Use SEMPRE este para icones.
- `js/ui/hud.js` (1866 linhas): HUD (Hud): minimapa, botoes de toque, barras de vida/stamina.
- `js/ui/inventory.js` (3694 linhas): Detalhe do item (ItemDetailPanel), modal do inventario (InventoryModal...) e chave do save (SAVE_KEY).
- `js/ui/game-main.js` (3895 linhas): Componente principal do jogo (GameMain): estado, loop, atalhos, modais.
- `js/ui/menu.js`: Tela de menu inicial (MenuScreen) com botão Modo Desenvolvedor antes de iniciar o jogo, opções de teste e barra flutuante in-game.
- `js/ui/main.js`: Componente raiz (App) e montagem do React. DEVE ser o ultimo script.

### Extras de debug

- `js/extras/colisores-debug.js` (48 linhas): Botao "Colisores: ON/OFF" (debug). Movido SEM alteracoes de legacy/app.original.js.
- `js/extras/mapa-global.js`: **Mapa Global** em tela cheia (so Modo Desenvolvedor): arrastar, zoom (roda, pinca, botoes, teclas), grade com coordenadas, legenda de biomas com destaque, marcador do jogador e da origem. Abre pelo botao "🗺️ Mapa Global" da barra dev do HUD, clicando no Radar, ou por `window.toggleMapaGlobal()`. Le `window.__worldEngine` e `window.__playerRef` (definidos em `game-main.js`) e usa so `World._computeSurfaceBaseBiome` (pura: nao grava no `tileCache`). Desenho progressivo por blocos de 64x64 amostras em cache, por nivel de zoom. Mostra o bioma BASE (ruido + areas das cidades), sem lagos de relevo/rios/props. Teclas com o mapa aberto: Esc fecha, +/- zoom, setas/WASD movem, C jogador, O origem, G grade, L legenda (o teclado nao chega ao jogo enquanto estiver aberto).

## Registro de habitantes das cidades (`js/citizens/`)
Cada tipo de habitante tem um arquivo com as suas **skins**, os **perfis** e o **desenho**, registrado em `CITIZEN_KINDS` (`registry.js`; consulta com `getCitizenKind(id)`). Carregam depois das criaturas e antes do motor (só são lidos em tempo de execução).

| Arquivo | Habitante | Dados | Linhas |
|---|---|---|---|
| `desert-citizen.js` | morador do Povoado do Deserto | `skinTones` (8), `hairColors` (7), `outfitPalettes` (8), `profiles` | ~740 |
| `port-citizen.js` | morador da Cidade Portuária | `skinTones` (6), `outfitColors` (5), `profiles` | ~480 |
| `snow-citizen.js` | morador da Vila Glacial | `skinTones` (8), `hairColors` (7), `outfitPalettes` (7), `femaleNames` | ~490 |
| `snow-prisoner.js` | prisioneiro (mina e celas) | usa as paletas de `snow-citizen` | ~315 |
| `snow-soldier.js` | soldado do quartel | usa as paletas de `snow-citizen` | ~380 |

- **O que está no registro:** as paletas/perfis e a função `draw(ctx, npc, timeOfDay, animTimer, player)`. Os desenhos eram funções sem nenhuma dependência do módulo da cidade (só globais do JavaScript), por isso foram movidos sem alteração (conferido por árvore sintática: 16 de 16 blocos idênticos).
- **O que continua nas cidades** (`desert-city.js`, `port-city.js`, `snow-peak-city.js`): criação (`_initCitizens`, que lê as paletas do registro), movimento, rotas, portas e conversas (`RUNIC_CHATTER`, `PORT_CHATTER`, `CHAT_PHRASES`, `PRISONER_PHRASES`, `MILITARY_PHRASES`). Na neve, os três tipos são criados pelo mesmo `_initCitizens` com os mesmos índices de pele/cabelo/roupa, por isso as paletas ficam em `snow-citizen` e os outros dois apontam para elas.
- **Skin não é sorteada:** pele, cabelo e roupa saem de uma conta fixa sobre o id do morador e o índice da casa (estável por seed; no deserto a planta é fixa, então as skins são iguais em toda seed). Só um pequeno desvio de posição ao nascer usa `Math.random`.
- **Como adicionar um habitante:** crie `js/citizens/<tipo>.js` com `CITIZEN_KINDS["<tipo>"] = { id, city, ..., draw }`, inclua o `<script>` em `index.html` depois de `registry.js`, e faça a cidade ler as paletas (`const { skinTones } = CITIZEN_KINDS["<tipo>"]`) e chamar `CITIZEN_KINDS["<tipo>"].draw(...)`.

## Registro de criaturas (`js/creatures/`)

`registry.js` define `CREATURES` e as funções de consulta (`getCreature`, `creatureDraw`, `creatureBehavior`, `creatureCarcass`, `isPreyType`, `creatureDeathParticles`, `detectMigratedCreature`, `detectCreatureForIcon`). Cada criatura migrada tem **um arquivo** `js/creatures/<nome>.js` que faz `CREATURES.<tipo> = {...}` com:

- `spawn` (nome, cores, vida, ataque, velocidade, escala) e `behavior` (`prey`, `deathParticles`, e para presas `wolfHitFleeTimer`, `playerHitFleeTimer` e `preyAI` com os números usados por `updatePreyAI`; para predadores `predator` (as presas fogem dele), `threatName`, `attackCooldown` e `hunter` com os números da IA de caça: raio, velocidade, alcance do bote, recarga, espera e velocidade ao vagar). Uma criatura com mais de um nascimento usa `spawnVariants` (o lobo tem `spawnVariants.snow`; o golem tem `spawnVariants.mountain`); `behavior.fearsFire: false` faz a criatura **ignorar fogueira e tocha** (toda criatura do registro foge delas por padrão; o golem não);
- `carcass` (textos), `sheet` (ficha ao destrinchar) e `loot` (despojos);
- `detect` (reconhecer por nome/id/ícone na ficha e no loot) e `detectIcon` (idem, para escolher o desenho do ícone);
- `draw.body` (corpo vivo), `draw.carcass` (carcaça no chão) e `draw.icon` (ícone).

Criaturas **não migradas** continuam nos lugares antigos e funcionam como antes. **Migradas por completo: coelho (`rabbit.js`), lobo (`wolf.js`), cervo (`deer.js`), golem (`golem.js`), morcego (`bat.js`), tardígrado (`tardigrade.js`), aranha (`spider.js`), escorpião (`scorpion.js`), dragão (`dragon.js`) e slime (`slime.js`). Todas as criaturas estão migradas.** (Truta e tilápia **não são criaturas**: existem só como item/ícone, sem entidade no mundo.) A IA de fuga das presas (`updatePreyAI`) lê os números de `behavior.preyAI`; uma presa nova só precisa preencher esses campos. A IA de caça do lobo lê `behavior.hunter`; quem tem `hunter` caça presas no raio e não usa a exploração padrão. **Tipos sem desenho próprio caem no corpo do lobo** (era assim no código antigo: o desenho do lobo era o ramo final de `Eg`; agora `Eg` chama `CREATURES.wolf.draw.body`). **Ordem de carga = prioridade de detecção por nome:** coelho > lobo > cervo (o golem não participa de `detect`; o ícone dele é testado na mesma posição da cadeia antiga de `lb`, via `CREATURES.golem.detectIcon`). **Atenção ao registrar uma criatura nova:** `gl(tipo)` (em `draw-criaturas.js`) passa a ser verdadeiro para ela, e `gl` liga o medo de fogueira/tocha e o susto de `scareMonstersNearFire`. Para criaturas que não devem ter esse medo (golem, dragão), use `behavior.fearsFire: false`.

**Ainda fora do registro, mesmo para coelho, lobo, cervo e golem** (são coisas de item ou de sorteio, não da criatura):
- Ícone do coelho segurado na mão e peças de item com cor de coelho, lobo ou cervo (`isRabbit`, `isWolf`, `isDeer`): `renderer.js` e `draw-criaturas.js` (função `Ab`).
- Regra de equipar/cinto por palavra (`includes("coelho")`, `includes("lobo")`) em `core/item-rules.js`.
- Nomes dos métodos `getNearestPreyForWolf` e `wolfAttackPrey` (`creatures-manager.js`) ainda têm "Wolf" no nome, mas agora leem `behavior.hunter`; e o campo `wolfRadius` da IA de presa significa "raio de fuga de predador".
- O sorteio de quem nasce em cada bioma (`creatures-manager.js`) ainda escolhe o tipo no código; só os valores do nascimento vêm do registro.

**Para criar uma criatura nova hoje:** (1) copie `js/creatures/rabbit.js`, ajuste dados e desenhos; (2) inclua o arquivo no `index.html` depois de `registry.js`; (3) adicione o tipo ao sorteio de spawn por bioma em `creatures-manager.js`; (4) se for presa, `behavior.prey: true`. Migrar as demais criaturas (gosma, aranha, morcego, escorpião, dragão...) tira o passo 3 e os pontos antigos. Se a criatura for predadora, preencha `behavior.predator` e `behavior.hunter` como em `wolf.js`.

## Onde mexer para...

- **Item, receita, recurso novo:** `js/data/` (itens, receitas-fusao, recursos-coletaveis).
- **Arma ou mecânica nova:** crie um arquivo em `js/engine/` (modelo: `weapon-whip.js`), ligue em `js/ui/game-main.js` e registre o atalho nos dois objetos `Ga`.
- **Tela ou modal novo:** `js/ui/` (use `ItemIcon` de `item-icon.js` para ícones).
- **Mudar o formato do save:** `js/core/save.js` + `js/ui/game-main.js` (função de salvar); mantenha compatibilidade com saves antigos.

## Como adicionar um arquivo novo

1. Crie `js/<pasta>/nome.js` começando com `"use strict";`.
2. Adicione `<script defer src="./js/<pasta>/nome.js"></script>` no `index.html`, **depois** dos arquivos que ele usa e **antes** de `js/ui/main.js`.
3. Dê um nome descritivo e único: tudo é global, nomes repetidos quebram (`const` duplicado dá erro de carregamento).

## Pontos de atenção conhecidos
- **Povoado do Deserto com posição por seed:** o centro (`CITY_CX`/`CITY_CY` em `desert-city.js`) deixou de ser fixo. `DesertCity.setSeed(seed, world)` é chamado pelo `World` (construtor e `setSeed`, **depois** de os ruídos da seed estarem prontos) e procura, em anéis crescentes a partir da origem (500 a 8000 blocos), o ponto mais próximo em que um disco de 220 blocos (bioma forçado 180 + margem 40) é todo `DESERT` **natural** (lido com o disco forçado desligado por `_siteSearchActive`); depois ajusta o centro para o ponto de maior folga em volta. Casas e moradores acompanham (`HOUSES` são atualizadas no lugar e `CITIZENS` é esvaziado para renascer). `centerX`/`centerY` agora são getters, então quem lê `window.DesertCity.centerX` (teleporte do modo dev, Mapa Global) sempre pega o valor atual; `DesertCity.siteInfo` diz `{mode: "natural"|"fixed", margin, distance, checked}`. **O deserto é raro neste mundo** (1,6% a 4,5% da área): em ~40% das seeds não há disco que caiba em 8000 blocos e a cidade cai no ponto antigo (520, 360) com o disco forçado, como antes (`mode: "fixed"`). Para desligar tudo: `window.__legacyDesertCity = true` antes de criar o mundo. O teleporte "Caverna do Deserto" do modo dev busca a partir do centro dinâmico. `DesertCity.setSeed` ignora chamadas repetidas com a mesma seed.
- **Cidade dos Picos Gelados (e a mina) com posição por seed:** mesmo sistema do deserto, em `snow-peak-city.js`. `SnowPeakCity.setSeed(seed, world)` (chamado pelo `World` **antes** do deserto, depois de os ruídos estarem prontos) procura, em anéis crescentes a partir da origem (500 a 10000 blocos, passo 96), o ponto mais próximo onde um disco de 272 blocos é todo `SNOW_PEAK` **natural**, e ajusta o centro para o ponto de maior folga. Tudo que depende do centro acompanha: casas (reconstruídas por `_buildHousesForSeed`, que guarda posição absoluta), telhados do quartel (`BARRACKS_ROOFS`, deslocados no lugar por `_shiftBarracksRoofs`), escadaria do quartel, **entrada e subsolo da mina** (entrada em +46,+56 do centro; o subsolo vai ~156 blocos ao sul), moradores, prisioneiros e soldados (esvaziados e recriados sob demanda). `centerX/centerY/prisonMineTx/Ty/barracksStairTx/Ty` e `biomeRadius` agora são getters. No modo natural o disco de bioma forçado cai de 1050 para 232 blocos (cabe todo dentro do `SNOW_PEAK` natural, sem círculo visível); no modo fixo (sem `SNOW_PEAK` que caiba, ou `window.__legacySnowCity = true`) volta ao ponto antigo (-380, -1220) com o disco de 1050, idêntico ao anterior. `siteInfo` = `{mode, margin, distance, checked}`.
- **Cidade Portuária com posição por seed (costa natural):** `PortCity.setSeed(seed, world)` procura, em anéis crescentes a partir da origem (500 a 9000 blocos, passo 112), uma praia (`BEACH`) cujo **mar fica ao sul**, e testa se o trecho cabe no layout atual: costa com desvio <= 3 blocos e inclinação <= 2,5° em +-60 colunas, praia natural por >= 44 blocos atrás, terra a 100 blocos atrás, mar por >= 100 blocos à frente e >= 12 de água rasa. O centro fica 2 blocos ao norte da costa (`SITE_SHORE_OFFSET`; com 3, a proa de alguns barcos caía em terra). **Modo natural:** sem disco de bioma forçado nem costa sintética: `isCityBiomeArea` vira só o **território** (105 blocos; o `World` só desenha casas, calçadão, píeres e barcos quando ele é verdadeiro), `getBiomeForTile` devolve o bioma natural lido do próprio mundo (`_naturalBiomeAt`, com a trava `_inNaturalQuery` contra recursão) e `getShorelineY`/`getDeepOceanStartY` leem a costa natural exata, coluna por coluna (cache). Casas, píeres, barcos e moradores são reconstruídos no centro novo (mesma planta por seed). **Modo fixo** (sem costa que sirva, ~46% das seeds, ou `window.__legacyPortCity = true`): ponto antigo (-680, 620), disco de 460 e costa sintética, idêntico ao anterior. `siteInfo` = `{mode, distance, maxDev, slopeDeg, checked}`. Só serve costa voltada ao **sul**: o layout é alinhado aos eixos (girar o porto exigiria traduzir as coordenadas em todas as funções).
- **Determinismo das posições de cidade:** durante a busca da neve, `window.__citySiteSearch = true` desliga os discos forçados de **todas** as cidades dinâmicas (o resultado não pode depender da posição que outra cidade tinha na seed anterior; as cidades são singletons de módulo). O porto é calculado **primeiro** (com todos os discos desligados) e **ignora** a bandeira global ao ser lido pelos outros: a busca da neve e a do deserto enxergam o estado final do porto (se ele ficar no modo fixo, o disco de 460 vale e elas não caem dentro dele); a busca do deserto desliga só o próprio disco e enxerga o da neve. Resultado: a posição de cada cidade depende só da seed, qualquer que seja a ordem/histórico de mundos criados (testado com 3 históricos diferentes e 6 seeds). Ordem de chamada em `world.js`, no construtor **e** no `setSeed`, sempre **depois** de os ruídos da seed estarem prontos: Porto, Neve, Deserto (no `setSeed` o porto ainda estava antes dos ruídos e mostrava o lugar da seed anterior; corrigido).
- **`new World(...)` só uma vez em `game-main.js`:** `useRef(new World(seed))` avalia o argumento a CADA render do React, então antes cada render criava um mundo descartável cujo construtor chamava `SnowPeakCity/PortCity/DesertCity.setSeed(...)` com uma seed errada (a inicial, ou uma aleatória no fluxo de carregar jogo), reconfigurando as cidades. Agora `o` e `c` (World e CreatureManager) são criados uma vez (`if (o.current === null) ...`). Mesmo padrão ainda existe em `m = J.useRef(new AudioManager())` (cria um AudioManager descartável por render; não mexi). Como cidades são singletons de módulo, **nunca** crie um `World` temporário com outra seed no jogo.
- **Bioma inicial (Vale Inicial de Floresta):** o peso `spawnBlend` agora vem de `World._spawnBlendAt(t, l, w)` (`js/core/world.js`), usado pelas **duas** cópias da geração (`_computeSurfaceBaseBiome` e `getSurfaceTile`, que continuam duplicadas: mexa nas duas se mudar o resto). Até 80 blocos da origem é floresta pura (igual ao antigo); depois a transição vai até ~760 blocos com a distância deformada por ruído, então o contorno é irregular e do tamanho dos outros biomas (antes: círculo de ~200 blocos de diâmetro com anel de campo ao redor). Só o anel 80 a ~1050 blocos muda; fora disso o mundo é idêntico ao antigo. Para voltar ao antigo: `window.__legacySpawnBlend = true` antes de criar o mundo. Os círculos perfeitos que sobram perto do início são as áreas de bioma das cidades (`isCityBiomeArea` em `snow-peak-city.js`, `desert-city.js`, `port-city.js`), não o bioma inicial.

- `js/engine/draw-itens-e-armas.js` e `draw-criaturas.js` foram nomeados por amostragem; os nomes de função dentro deles ainda são os curtos.
- Arquivos ainda grandes: `ui/game-main.js` (~3,9 mil linhas), `ui/inventory.js` (~3,7 mil), `engine/renderer.js` (~3 mil).
- `legacy/` guarda o original (`app.original.js`), o antigo exportador "HTML autônomo" (`standalone-html-antigo.js`, removido do jogo junto com o botão HTML) e a pasta antiga `js/game/` (código morto, nunca usado pelo jogo). Ao buscar com `grep -r`, ignore `legacy/`.

## Próximos passos sugeridos (cada um pequeno e reversível)

1. Quebrar `game-main.js` em partes (atalhos, salvar/carregar, loop) mantendo o mesmo comportamento.
2. Renomear os nomes curtos por escopo (`World` → `World`) com ferramenta, nunca por busca e troca de texto.
