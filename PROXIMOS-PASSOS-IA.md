# Próximos passos para outra IA (continuidade)

Leia este arquivo inteiro antes de mexer. Depois leia `ARQUITETURA.md` (mapa de arquivos), `REGRAS-PARA-IA.md` (regras de código) e `RENOMEADOS.md` (nomes novos x antigos).

## 1. Objetivo do dono do projeto

Deixar o jogo **fácil de escalar e de manter, sem criar bugs nem perder funcionalidades**. O dono quer principalmente adicionar **criaturas e itens** de forma simples e organizar o código em módulos.

## 2. Regras que NÃO podem ser quebradas

- **HTML + JS puro.** Sem npm, sem bundler, sem build, sem biblioteca nova **dentro do projeto**. O jogo tem de abrir com **duplo clique no `index.html` (`file://`)**. Módulos ES (`import`) não funcionam assim: não use.
- **Não adicione testes ao projeto** (o dono recusou). A verificação é feita **fora do projeto** (seção 5) e você relata o resultado.
- **Não apague arquivos** sem o dono pedir. Mova para `legacy/` se necessário. **Não edite `legacy/`**: é só referência.
- **Mover código, não reescrever.** Em migrações, o código movido deve ficar idêntico. Nada de "limpar", reformatar ou renomear de passagem.
- **Não renomeie por busca e troca de texto.** Só por análise de escopo (ver seção 6).
- Um **branch por tarefa**, **commits pequenos** em português, descrevendo o que mudou e que o comportamento não mudou.
- Sempre responda ao dono em **português**, curto, dizendo **o que foi verificado e o que NÃO foi** (o dono quase nunca consegue testar no navegador; você também não tem navegador real).
- Entregue o projeto inteiro em zip (incluindo `.git`) e use a ferramenta de apresentar arquivo.

## 3. Estado atual (resumo)

- O antigo `assets/app.js` (bundle compilado de 48 mil linhas) foi dividido em arquivos: terceiros em `assets/vendor/`, jogo em `js/` (`core`, `data`, `engine`, `ui`, `creatures`, `extras`). O original está em `legacy/app.original.js`.
- **Todos os `<script defer>` do `index.html` compartilham o mesmo escopo global.** A ordem importa. `js/ui/main.js` é o último.
- 24 nomes-chave foram renomeados (ex.: `eg`→`World`, `qb`→`CreatureManager`, `s1`→`GameMain`). Os demais nomes curtos continuam (`pi`, `To`, `Ua`, `Zu`, `hi`...).
- O exportador "HTML autônomo" foi removido (guardado em `legacy/standalone-html-antigo.js`).
- **Registro de criaturas** em `js/creatures/`: `registry.js` (núcleo), `rabbit.js` (**coelho**), `wolf.js` (**lobo**), `deer.js` (**cervo**) e `golem.js` (**golem**), `bat.js` (**morcego**), `tardigrade.js` (**tardígrado**) e `spider.js` (**aranha**), `scorpion.js` (**escorpião**) e `dragon.js` (**dragão**) e `slime.js` (**slime**), criaturas completas: dados, IA de presa, desenho do corpo, carcaça e ícone. São o **modelo** para as demais.
- Versão atual: **`rpg2d5-main`** (a mais completa: menu inicial, livros/pergaminhos, exportação, bioma `MOUNTAIN_25D`). Ela veio **sem a pasta `.git`**; os branches antigos (`criatura-lobo` → `criatura-cervo` → `registro-criaturas` → `modularizacao`) existem só no repositório anterior. Se for versionar, comece com `git init` e um commit desta versão como ponto de partida.
- Última verificação: jogo carrega no jsdom sem erro; terreno da seed 4289 idêntico ao original; dados, IA de presa, detecção por nome (400 nomes) e desenho do coelho, do lobo e do cervo idênticos à versão anterior; spawn por bioma, IA de caça (mordida em presa, ataque ao jogador, vagar), morte do lobo pelo jogador e carcaças idênticos em cenários dirigidos.
- Migração da **aranha** (`spider.js`): sintaxe de todos os arquivos ok; jogo carrega no jsdom sem erro (43 scripts, `#root` com o mesmo tamanho da versão anterior); ficha, loot, `ac`, `lb` (6433 casos), `gl`, presa, partículas, carcaça gerada, desenho do corpo, da carcaça e do ícone (13 tipos × 8 situações, com Canvas gravador) e nascimento por bioma (4 variantes da aranha, 400 sorteios por bioma, na superfície e no subsolo) idênticos à versão anterior; um defeito injetado de propósito no `spider.js` foi detectado pelo teste.
- Migração do **escorpião** (`scorpion.js`): sintaxe ok; jogo carrega no jsdom sem erro (45 scripts); ficha, loot, `ac`, `lb` (2444 casos de escorpião), `gl`, carcaça gerada, nascimento por bioma (superfície e caverna do deserto) e criação do gigante idênticos à versão anterior; corpo, carcaça, colisores de golpe e garra da caverna idênticos em 80 estados (normal e gigante, 4 direções, emergindo, enterrando, garra, ferrão, flash, veneno, puxando da caverna); defeitos injetados de propósito no `scorpion.js` foram detectados (40 pontos).
- Migração do **dragão** (`dragon.js`): sintaxe ok; jogo carrega no jsdom sem erro (46 scripts); ficha, despojos (`e1`), detecção (`ac` e `lb`), `gl`, presa, partículas, carcaça gerada (lendária, valor 250), ícone e nascimento no bioma vulcânico idênticos à versão anterior; corpo e carcaça idênticos em 72 estados (4 direções, parado, andando, atacando, flash de dano, escalas); defeito injetado de propósito foi detectado (82 pontos). A segunda cadeia de carcaça (no caminho de morte, ~linha 3990) leva o mesmo ajuste, mas o teste automático não a alcança: vale conferir no jogo matando um dragão.
- **Povoado do Deserto por seed** (`desert-city.js` + `world.js` + teleporte em `game-main.js`): 80 seeds testadas; 48 acharam deserto natural (distância da origem: mediana ~3.250, mín 916, máx 7.424; folga mediana 360 blocos; mundo leva ~50 ms para criar, máx ~115 ms); 32 caíram no ponto antigo por não haver deserto (seed 3 tem 0% de deserto em 9.000 blocos). Com `window.__legacyDesertCity = true`, e nas seeds que caem no ponto antigo, o terreno, as casas e o centro ficam idênticos à versão anterior. Moradores (29) renascem a até 36 blocos do centro novo, inclusive em novo mundo/reroll depois de já terem sido criados (bug corrigido: `_relocate` precisa zerar `_citizensInitialized`, senão `_initCitizens` não recria e o povoado fica vazio; o teste de reposicionar só antes da primeira criação não pegava isso, o de `probe` com mundos em sequência pega). Em 12 de 12 seeds naturais a busca do teleporte achou caverna do deserto a 90-115 blocos da cidade. Não testado no jogo real (desenho do povoado, jogabilidade).
- **Troca de seed e re-render** (`game-main.js`): o jogo era montado de verdade no jsdom (React) e reproduziu o defeito: 50 chamadas de `DesertCity.setSeed` só ao montar (mundos descartáveis de `useRef(new World(...))`) e, depois de trocar a seed, a cidade voltava para o local da seed inicial no render seguinte. Corrigido (mundo criado uma vez; `setSeed` da mesma seed é ignorado). Verificado: 1 chamada ao montar, 0 depois; carregar jogo (seed inicial aleatória por render) e trocas 4289, 1, 4289 com 2 renders cada ficam no centro certo da seed. Efeito colateral bom: os layouts das casas de Picos Gelados e do Porto (que dependem da seed) também deixam de ser reescritos por mundos descartáveis.
- **Cidade dos Picos Gelados + mina por seed** (`snow-peak-city.js`, `world.js`, `desert-city.js`): 40 seeds, 40 acharam `SNOW_PEAK` natural (distância da origem: mín 642, mediana ~3.650, máx 9.503; 35% até 1.000 blocos, 55% até 4.000, 85% até 8.000; folga mediana 440; criar o mundo leva ~100 ms, máx ~185); 0 de 17.320 pontos do disco (r<=234) fora do bioma natural. Modo legado idêntico à versão anterior (bioma, casas, telhados, tiles da superfície, subsolo da mina/prisão/tortura, escada e área da mina; 3 seeds). Natural vs legado na mesma seed: 2.600 células de superfície + 3.107 de subsolo + 41 casas + 7 telhados iguais, só deslocados (4 seeds, 0 divergências). Posições determinísticas em 3 históricos de criação de mundos. Povo (68-71 moradores, prisioneiros e soldados) renasce a até ~96 blocos do centro novo, inclusive em novo mundo/reroll. Jogo montado no jsdom com 4289→1→4289→1→2 e re-renders: as três cidades ficam estáveis e iguais na 2ª vez. Não testado no jogo real (desenho, mina em jogo, jogabilidade). Seeds sem deserto continuam no ponto antigo (17 de 40); nesse caso o disco forçado antigo do deserto (520,360, raio 180) pode tocar levemente o disco de 232 da neve quando ela cai perto (visto na seed 99999: ~30 blocos de sobreposição só do bioma, não dos territórios).
- **Cidade Portuária por seed (costa natural, voltada ao sul)** (`port-city.js`, `world.js`): 24 seeds, 13 acharam costa (distância da origem: mín 1.233, mediana ~6.475, máx 8.751; só 3 a até 1.500 blocos); 11 ficaram no ponto antigo (2, 3, 7, 13, 777, 65535, 99999, 300, 500, 900, 12345). Criar o mundo leva em média ~325 ms (máx ~614; a busca do porto é a mais cara). Layout no modo natural: 0 de 7.635 pontos de casas, 0 de 104 de píeres, 0 de 790 de barcos e 0 de 611 do calçadão fora do lugar certo (com `SITE_SHORE_OFFSET = 2`; com 3, 5 proas de barco caíam em terra; com 1, 7 inícios de píer na água). Natural vs legado na mesma seed: casas, píeres e barcos idênticos, só deslocados (4 seeds, 0 divergências); dentro do território o bioma gerado é o natural (0 de 3.769 tiles diferentes) e fora também. Modo legado idêntico à versão anterior (bioma, casas, píeres, barcos, células, tiles com papel de cidade, costa, flags; 3 seeds). Moradores (22-27) renascem a até ~55 blocos do centro novo, inclusive em novo mundo/reroll. As três cidades dinâmicas são determinísticas em 3 históricos. Jogo montado no jsdom com 4289→1→4289→1→2: as três ficam estáveis (e o teste achou e corrigiu a ordem no `World.setSeed`). Não testado no jogo real (desenho, jogabilidade, barcos e píeres em jogo). Próximo passo possível: girar o porto em múltiplos de 90° para cobrir costas voltadas a N/L/O (praticamente todas as seeds têm costa nessas direções).
- Migração do **slime** (`slime.js`): sintaxe ok; jogo carrega no jsdom sem erro (47 scripts) e monta o React com troca de seed e re-renders sem erro; ficha/despojos/detecção (`f0`, `e1`, `ac`, `lb`, 4.085 casos de slime), `gl`, presa, partículas, carcaça gerada ("Gosma Sem Vida", incomum, valor 28), ícone, os 13 nascimentos por bioma (superfície e subsolo, 400 sorteios por bioma) e o enxame (8 biomas) idênticos à versão anterior; corpo e carcaça inteira idênticos em 120 estados (4 direções, parado, flash, grudado, pulando em 3 pontos, emergindo, na água, rápido/lento, escalas e 2 níveis de qualidade); defeitos injetados de propósito foram detectados (177 pontos). A segunda cadeia de carcaça (no caminho de morte em combate, ~linha 3980) leva o mesmo ajuste, mas o teste automático não a alcança: vale matar um slime no jogo e conferir "Gosma Sem Vida" e o som de coleta.
- **Registro de habitantes** (`js/citizens/`): as skins, os perfis e os 5 desenhos (morador do deserto, do porto e da neve, prisioneiro e soldado; ~2.200 linhas) saíram dos módulos das cidades sem alteração: 16 de 16 blocos (paletas, perfis, nomes e funções de desenho) idênticos por **árvore sintática** (~15.000 nós); nenhuma referência solta nos módulos; jogo carrega (53 scripts) e monta o React sem erro. Teste dinâmico pela API pública (criar os moradores, pedir os itens de desenho em 5 horários do dia, 3 posições do jogador e 14 passos, comparando o log completo do Canvas): idêntico em deserto (29 moradores), porto (22) e neve (68, com prisioneiros e soldados). Chamadas de desenho por tipo no teste: 380, 360, 900, 240 e 320. Limite honesto do teste dinâmico: um defeito injetado em uma cor de ramo raro (morador do deserto e prisioneiro) não é pego por ele; quem garante o desenho inteiro é a comparação por árvore. Próximos passos possíveis: (1) mover as falas (`*_CHATTER`, `*_PHRASES`) para os tipos; (2) extrair um desenho de humanoide em comum (os 5 desenhos repetem muito código); (3) mover a criação/movimento, que depende das casas e portas.
- **Nunca foi testado em navegador real** desde a modularização.

## 4. Tarefa principal: migrar as criaturas restantes (uma por vez)

**Todas as criaturas estão migradas:** `rabbit`, `wolf`, `deer`, `golem`, `bat`, `tardigrade`, `spider`, `scorpion`, `dragon` e `slime` (aranha e escorpião são arquivos separados; a categoria de cinto `creature_spider_scorpion` em `item-rules.js`, `draw-criaturas.js` e `renderer.js` é só de inventário e continua como está). **Truta e tilápia não são criaturas**: só existem como item/ícone (sem entidade no mundo; o desenho do ícone fica em `draw-criaturas.js`), então não há o que migrar no sentido do registro. As funções `isDragon` em `draw-criaturas.js` (ícones de partes e itens) não são da criatura em si e ficaram onde estão. O que sobra de específico por criatura está na **IA**, que continua em `creatures-manager.js`/`weather.js` por texto (`type === "slime"` etc.), e é uma refatoração separada.

Modelo para criatura com **muitas variantes de nascimento e carcaça desenhada inteira** (`carcassFull`, `swarm`): `js/creatures/slime.js` (13 variantes lidas por `spawnMonsterNearPlayer` e o enxame por `spawnSwarmSlimeNearPlayer`; a IA de grudar no jogador não entra no registro).

Modelo para criatura **sem carcaça/ficha/loot** e com **vários nascimentos por bioma**: `js/creatures/spider.js` (`spawn` + `spawnVariants`, sem `carcass`/`sheet`/`loot`/`detect`). Os quatro pontos de nascimento em `creatures-manager.js` (`spawnMonsterNearPlayer`) leem esses dados. O tardígrado, a IA de fuga em `creatures-manager.js` e o `weather.js` ainda comparam `type === "scorpion"`/`"spider"` por texto: isso é regra de outras criaturas e continua funcionando.

Modelo para criatura **com variante e funções de desenho próprias** (a IA continua no gerenciador): `js/creatures/scorpion.js`. Ele tem o `spawnVariants.giant` (lido por `createGiantScorpion`) e leva para dentro do arquivo as funções de desenho que só ele usa (`drawScorpionBody`/`Side`/`Front`/`Back`/`Claw`, `getScorpionHitColliders`, `drawGiantScorpionCaveReachClaw`), mantendo os nomes globais que outros arquivos chamam. Modelo para criatura **destrinchável com carcaça especial**: `js/creatures/dragon.js` (`carcass` com `rarity`/`value` opcionais, `sheet`, `detect` e `loot` saíram de `fusao-e-loot.js`; `fearsFire: false` mantém o comportamento antigo de não fugir do fogo). Quem registra uma criatura passa a entrar em `gl` (foge do fogo) a menos que declare `fearsFire: false`: confira isso em toda migração.

### Como funciona o registro

`registry.js` define `CREATURES` e: `getCreature`, `creatureDraw(type, "body"|"carcass"|"icon")`, `creatureCarcass`, `isPreyType`, `creatureDeathParticles`, `detectMigratedCreature`, `detectCreatureForIcon`. Cada arquivo `js/creatures/<tipo>.js` faz `CREATURES.<tipo> = {...}` com `spawn`, `behavior`, `carcass`, `sheet`, `detect`, `detectIcon`, `loot`, `draw`. Os consumidores consultam o registro e, se a criatura não está nele, caem no código antigo (por isso dá para migrar uma de cada vez).

### Passo a passo para migrar um tipo `X`

1. `git checkout -b criatura-X` a partir do branch atual. Anote o commit anterior para comparar depois.
2. Mapeie os pontos: `grep -rn '"X"' js` e também as palavras em português (`includes("lobo")` etc.). Pontos típicos:
   - `js/engine/creatures-manager.js`: valores de nascimento (literal do spawn, procure `(v = "X")`), textos de carcaça (**2 lugares**, cadeias `? ... :`), regras de presa/hostilidade, partículas de morte, IA.
   - `js/data/fusao-e-loot.js`: `f0` (ficha, `case "X"`), `e1` (loot, `case "X"`), `ac` (detecção por nome).
   - `js/engine/draw-personagem-e-efeitos.js`: `Eg` (despacho do corpo vivo) e `Ag` (ramo da carcaça).
   - `js/engine/draw-criaturas.js`: `ib` (`case "X"` do ícone), `lb` (detecção do desenho), `gl` (lista de criaturas) e lista de carcaças.
3. Crie `js/creatures/X.js` copiando `rabbit.js`. **Copie os valores e os corpos das funções do código existente por script/cópia exata, não digite à mão.** Mantenha `function (...) {...}` (não arrow) para preservar `this`; confira que o corpo movido não usa `this`/`arguments` nem variáveis locais da função de origem.
4. Ligue os consumidores no **mesmo ponto da cadeia** onde o ramo antigo estava (a ordem importa), usando o registro, e **remova** o ramo/`case` antigo. Veja como foi feito para o coelho com `git show 5093de1` e `git show b3b596a`.
5. Registre o arquivo no `index.html` **depois de `registry.js`** e antes dos motores.
6. **Lobo (feito, `wolf.js`):** modelo para predadores. Números da IA de caça em `behavior.hunter`; `behavior.predator` faz as presas fugirem dele; dois nascimentos via `spawn` + `spawnVariants.snow`. Detalhe importante: o desenho do corpo do lobo era o **ramo `else` final** de `Eg` (tipos desconhecidos caíam nele); esse fallback foi mantido chamando `CREATURES.wolf.draw.body`. Em `lb` (ícone) o teste do lobo continua **na mesma posição da cadeia** (antes de morcego e golem), agora chamando `CREATURES.wolf.detectIcon`.
7. **Prioridade de detecção:** `detectMigratedCreature` e `detectCreatureForIcon` testam as criaturas na ordem de carga (`index.html`) e rodam **antes** das cadeias antigas. Se uma nova criatura migrada tiver nome que casa com outra ainda não migrada que antes tinha prioridade, o resultado muda; teste com a lista de nomes (seção 5, item 3) e, se preciso, ajuste a ordem de carga (hoje: coelho, lobo, cervo, preservando a prioridade antiga) ou use uma guarda.
8. Verifique (seção 5), atualize `ARQUITETURA.md` (lista de migradas e pontos restantes), commite.

### Depois das criaturas

- Mover o **sorteio de nascimento por bioma** (em `creatures-manager.js`) para dados no registro (`spawn.biomes`/pesos), mantendo as mesmas probabilidades. Só então "criar criatura nova" vira: um arquivo + uma linha no `index.html`.
- Revisar `detect` x `detectIcon`: têm regras ligeiramente diferentes por herdarem de funções antigas diferentes (`ac` e `lb`). Unificar muda comportamento nos casos limite, então só faça com o dono ciente.

## 5. Como verificar sem mexer no projeto

Faça tudo **fora do projeto** (ex.: `/home/claude/tools` ou `/tmp`); `npm install jsdom acorn` lá é permitido, **nunca no projeto**. Relate ao dono o que passou.

1. **Sintaxe:** `for f in $(find js assets/vendor -name "*.js"); do node --check "$f"; done`.
2. **Carregar no jsdom:** `new JSDOM('<div id="root"></div>', {runScripts:'outside-only', pretendToBeVisual:true, url:'http://localhost/'})`; ler a lista de scripts do `index.html` e rodar **cada arquivo em ordem com `new vm.Script(codigo).runInContext(dom.getInternalVMContext())`** (assim `const`/`class` ficam compartilhados, como no navegador). Para testes de dados, pule `ui/main.js` e `extras/colisores-debug.js`. Fixe `Math.random` (gerador simples com semente) e `Date.now` antes de carregar.
3. **Equivalência antes x depois (obrigatória):** (inclua, além disto, `updatePreyAI`/IA em simulação passo a passo com `Math.random` de semente fixa, e `ac`/`lb` aplicados a **todos os nomes `name: "..."` e ids encontrados no código** × vários ícones) carregue a versão anterior com `git show <commit>:<arquivo>` e a nova, e compare `JSON.stringify` de:
   - `f0(tipo)` (ficha), `e1(tipo)` (loot), `ac(item)` (detecção) para todos os tipos e vários itens de teste;
   - `CreatureManager.prototype.createCarcassForMonster.call({nextId:7, engine:{}}, monstro)`;
   - `lb(item)`, `gl(tipo)`, `isPreyType(tipo)`, `creatureDeathParticles(tipo)`.
4. **Equivalência de desenho:** use um **Canvas gravador** (Proxy que registra cada chamada de método e cada atribuição, com números arredondados a 6 casas) e compare os logs antes x depois ao chamar `Eg(ctx, monstro)`, `Ag(ctx, carcaca, 0.5)` e `ib(ctx, 10, 12, 1.1, 0.7, tipo, item)` para **todos os tipos** (a criatura migrada e as outras, para provar que as outras não mudaram) e várias situações (parado, atingido, na água, no subsolo, virado à esquerda). Esqueleto:
   ```js
   const mk = (path, log) => new Proxy(function(){}, {
     get: (t,k) => k===Symbol.toPrimitive ? () => 0 : k==='then' ? undefined
                 : k==='measureText' ? s => ({width:String(s).length*5}) : mk(path+'.'+String(k), log),
     apply: (t,th,a) => { log.push(path+'('+a.map(x=>typeof x==='object'&&x?'[obj]':Math.round(x*1e6)/1e6).join(',')+')'); return mk(path+'()', log); },
     set: (t,k,v) => { log.push(path+'.'+String(k)+'='+(typeof v==='object'&&v?'[obj]':v)); return true; } });
   ```
5. **Terreno:** com `new World(4289)`, o hash sha256 de `JSON.stringify(getTile(x,y))` (ignorando funções) em regiões de 64×64 a partir de `[0,0]`, `[500,-300]`, `[-2000,1500]`, `[10000,10000]` deve dar, na ordem: `8559c7019998c503`, `31d80afdb01b5090`, `d4c955cef2096280`, `fb431983689267ab` (primeiros 16 hex).
6. **Renderização completa:** com `getContext` do canvas simulado (Proxy acima), `ResizeObserver` e `AudioContext` simulados, carregar todos os scripts e esperar ~2,5 s: o `#root` deve ter conteúdo e **não pode haver erros** (`window 'error'` e `console.error`). Compare com `legacy/app.original.js` (o HTML varia poucos caracteres porque há barras animadas por tempo).

## 6. Armadilhas conhecidas

- **Registrar uma criatura muda `gl()`.** `gl(tipo)` é verdadeiro para qualquer tipo registrado e liga o medo de fogueira/tocha (`getAnimalFireDeterrence`, `scareMonstersNearFire` e o bloco de fuga em `update`). Se a criatura antiga NÃO tinha esse medo (golem, dragão), ponha `behavior.fearsFire: false`, senão ela passa a fugir de fogo. Foi o único efeito colateral escondido da migração do golem; os testes dirigidos (tocha a 40 px, `scareMonstersNearFire`) pegam isso, e removi o campo de propósito para confirmar que o teste acusa.
- **Criatura sem carcaça própria** (golem, aranha): não defina `carcass`, `sheet`, `loot` nem `detect`; `ac()` em `fusao-e-loot.js` continua excluindo itens com "golem" no nome e o corpo deixado é o genérico ("Corpo intacto de ...").
- **Detecção do ícone na mesma posição da cadeia:** em `lb` (`draw-criaturas.js`) a aranha continua testada **antes** de lobo e morcego, agora via `CREATURES.spider.detectIcon`, como o lobo e o golem. Nomes que casam com mais de uma criatura dependem dessa ordem.
- **Observação (não corrigida, fora do escopo):** `ac()` em `fusao-e-loot.js` devolve `null` para qualquer item com "morcego"/"bat" no nome (a exclusão roda **antes** de `detectMigratedCreature`), então "Corpo de Morcego" não é reconhecido como destrinchável e o `loot`/`sheet` do `bat.js` não chegam a ser usados na prática. Confirme com o dono se isso é intencional antes de mexer.

- **Ao montar cenários de teste da IA:** monstros a mais de **680 px** do jogador são descartados no mesmo frame (então o jogador tem de ficar perto, ex.: a ~400 px); `spawnMonsterNearPlayer` recebe `(jogador, subterraneo, bioma, hora)` e `update` recebe `(dt, jogador, subterraneo, bioma, hora, defesa)`; confira que os contadores (mordidas, mortes, carcaças) são maiores que zero, senão o teste "passa" sem exercitar o código alterado.

- **Escopo global compartilhado:** nomes novos não podem repetir nomes existentes (`const` duplicado dá erro de carga e derruba o jogo). Evite nomes de `window` (`Audio`, `Image`, `Event`, `Map`...).
- **Ordem de carga:** declarações de função **não** são içadas entre arquivos. Código executado **na carga** (fora de funções) só pode usar o que já foi carregado. Dentro de funções (executadas depois) tudo é visível.
- **Acentos e palavras:** vários reconhecimentos são `includes("pé de coelho")`/`includes("pe de coelho")`. Já houve bugs por acento; mantenha as duas grafias.
- **Cadeias `if/else if` e `? :`:** a ordem decide quem ganha. Ao trocar um ramo por consulta ao registro, **mantenha-o na mesma posição**.
- **`Date.now()` e `Math.random()`** geram ids no loot e no mundo. O terreno é determinístico (seed); não troque essas chamadas.
- **Renomear:** só com análise de escopo (ex.: `eslint-scope` no seu ambiente de análise), conferindo que cada nome mantém o mesmo número de ligações e que nenhum nome novo já existe. Atualize `RENOMEADOS.md`, `ARQUITETURA.md` e `REGRAS-PARA-IA.md`.
- **Save:** chave `rpg_campfire_save_v1`, `version: 1`, **sem código de migração**. Não mude o formato sem criar migração e manter saves antigos funcionando.
- **Atalhos:** o objeto `Ga` aparece duplicado em `GameMain`; um atalho novo precisa ser registrado nos dois (ver `REGRAS-PARA-IA.md`).

## 7. Backlog sugerido (depois das criaturas)

1. **Registro de itens**, no mesmo estilo (`js/items/<nome>.js`): id, nome, raridade, ícone (hoje `drawItemIcon` decide por **texto do nome**), regras de equipar (`js/core/item-rules.js`), receitas (`js/data/receitas-fusao.js`), de onde vem (recurso do mundo, loot de criatura). Itens de loot hoje são criados direto dentro do `switch` de `e1` com ids gerados na hora; ao migrar, o loot das criaturas passa a referenciar o registro de itens. Migre um item por vez, com a mesma equivalência de antes/depois.
2. Peças de item com cor de coelho (`isRabbit` em `draw-criaturas.js`), ícone na mão em `renderer.js` e regra de equipar por palavra em `item-rules.js`: ficam com a migração de itens.
3. Dividir `js/ui/game-main.js` (~3,9 mil linhas, um componente React com estado compartilhado). **Não é corte mecânico.** Extrair só funções que não usam variáveis do componente, com verificação a cada passo.
4. Registro único de atalhos (acabar com o `Ga` duplicado).
5. Migração de versão do save.
6. Renomear mais nomes curtos de forma segura (lista por escopo, ver seção 6).

## 8. Roteiro de teste manual para o dono (cole no relatório de cada etapa)

Andar pelo mundo; entrar na caverna; colocar a panela e cozinhar; usar o chicote; salvar e recarregar; **e, para a criatura migrada:** vê-la nascer, atacá-la, ver se ela foge/ataca como antes, olhar a carcaça no chão, destrinchar com uma faca (ficha e itens), e ver o ícone no inventário.

## 9. Definição de pronto de cada etapa

- Sintaxe OK em todos os arquivos; jogo carrega no jsdom sem erro; terreno idêntico.
- Equivalência de dados e de desenho **sem diferenças** (ou diferenças explicadas e aprovadas pelo dono).
- Docs atualizados (`ARQUITETURA.md`, e `RENOMEADOS.md` se renomeou).
- Commit com mensagem clara; zip gerado e apresentado; relatório curto ao dono com o que foi e **o que não foi** verificado.
