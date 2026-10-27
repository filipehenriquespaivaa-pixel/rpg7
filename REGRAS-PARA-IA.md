# REGRAS PARA IA — leia ANTES de editar este projeto

> **Continuando o trabalho de organização?** Leia `PROXIMOS-PASSOS-IA.md` (estado atual, como migrar criaturas/itens com segurança, como verificar e armadilhas).


Jogo RPG 2D procedural em HTML/Canvas, que roda abrindo o `index.html` (file://), sem servidor e sem build.
O código do jogo está dividido em arquivos em **`js/`** (e terceiros em `assets/vendor/`). **Leia `ARQUITETURA.md` antes**: mostra a ordem de carregamento e onde fica cada coisa. O antigo bundle único está em `legacy/app.original.js` (só referência).

## O ponto mais importante

O código veio de um **bundle compilado** (saída do Vite/React), depois dividido em arquivos sem alterar o conteúdo. Os nomes de variáveis foram
encurtados (`t`, `l`, `o`, `ItemIcon`, `drawItemIcon`, `kG`...). **Não existe código-fonte legível original**; os nomes curtos continuam.

Consequência: nomes curtos **se repetem com significados diferentes** em cada função/componente.
Exemplo real: `Ga` é um `useRef` de atalhos no componente principal, mas é a prop `onCookingPot`
dentro do modal de item. **Nunca assuma o significado de um nome só pelo que ele é em outro lugar.**
Leia o trecho em volta antes de usar. **Todos os arquivos de `js/` dividem o mesmo escopo global**: a ordem dos `<script>` no `index.html` importa e nomes novos não podem repetir os existentes.

## Regras de ouro

1. **Procure antes de criar.** Se o jogo precisa de ícone, botão, modal, som ou cálculo, busque se já existe
   (`grep -n`). Já houve retrabalho por recriar algo que existia e estava aprovado.
2. **Ícones de item: sempre `h.jsx(ItemIcon, { item: x, size: 28 })`.** Nunca desenhe `item.icon` como texto.
   `icon` pode ser um nome ("Slingshot", "Infinity") ou um emoji, e quem sabe desenhar o ícone certo
   é o `ItemIcon` (que usa `drawItemIcon` no canvas). Por isso, qualquer lugar que guarde um item para exibir depois
   (panela, baú, etc.) deve guardar o **item completo** (`{ ...item }`), não só `{ name, icon }`.
3. **Edições cirúrgicas.** Troque só o trecho necessário. Nunca regenere ou reformate o arquivo inteiro.
   Ao editar por script, confirme que o trecho antigo aparece **exatamente 1 vez** antes de substituir.
4. **Valide sempre:** `for f in $(find js assets/vendor -name "*.js"); do node --check "$f"; done` depois de cada edição. Se falhar, desfaça.
5. **Atalhos de teclado** passam pelo `switch` de teclas (procure `KeyR` / `handleCookingPot`) e chamam
   `Ga.current.handleXxx()`. Ação nova = criar o handler, registrá-lo nos **dois** objetos `Ga`
   (o `useRef({...})` inicial e a atribuição `Ga.current = {...}`) e ligar a tecla.
6. **Celular:** botões de toque ficam na HUD (`Hud`), e toques no mapa são tratados no `useEffect` do
   canvas (procure `touchstart` / `tapPot`). Toda função que existe no teclado precisa de equivalente por toque.
7. **Não toque em `legacy/`.** Contém o bundle original, o antigo exportador HTML (removido do jogo) e a antiga pasta `js/game/` (código morto, o jogo não usa). Editar lá não muda nada. Ao usar `grep -r`, ignore `legacy/`.
8. **Saves:** a chave é `rpg_campfire_save_v1` (funções `saveGameState` salvar, `loadGameState` carregar, `clearGameState` apagar).
   Se mudar o formato de algo que é salvo, mantenha compatibilidade com saves antigos.
9. **Textos para o jogador em português**, com emoji, no mesmo estilo dos avisos existentes.
10. **Não commite arquivos `.zip`.** Nem apague arquivos do projeto sem pedir.

> **Criaturas:** criaturas migradas ficam em `js/creatures/` (hoje: coelho, lobo, cervo e golem, em `rabbit.js`, `wolf.js`, `deer.js` e `golem.js`). Para mexer numa delas (nome, vida, loot, ficha, carcaça, desenho, IA), edite o arquivo da criatura, não os arquivos antigos. Veja `ARQUITETURA.md`.

> Alguns nomes curtos foram renomeados (ex.: `eg` virou `World`). Tabela antigo -> novo em `RENOMEADOS.md`. Nomes que não aparecem lá continuam curtos.

## Mapa de nomes (use `grep -rn` em `js/` para achar a posição atual)

Fora do componente principal (escopo global do bundle):

| Nome | O que é | Arquivo |
|---|---|---|
| `J` / `h` | React (`J.useState`, `J.useRef`...) / criador de JSX (`h.jsx`, `h.jsxs`) | — |
| `ItemIcon` | Componente que **desenha o ícone de um item** (canvas) | `js/ui/item-icon.js` |
| `drawItemIcon(ctx, item, w, h, t, clear)` | Função de canvas que realmente desenha o ícone do item | 26045 |
| `World` | Classe do **mundo** (tiles, fogueiras, panela, cavernas, `getTile`, `getNearbyCampfire`) | `js/core/world.js` |
| `SimplexNoise` | Gerador de ruído (Simplex) usado pelo mundo | — |
| `WorldRenderer` | **Renderizador** do mundo (cache de chunks de terreno, luzes, partículas) | `js/engine/renderer.js` |
| `AudioManager` | **Gerenciador de áudio** (sons sintéticos: `playItemPickup`, `playTorchIgnite`...) | `js/engine/audio.js` |
| `CreatureManager` | Gerenciador de **criaturas/entidades** (monstros, carcaças, itens no chão, projéteis) | `js/engine/creatures-manager.js` |
| `FUSION_RECIPES` | Lista de **receitas de fusão** (cada uma com `match` e `createResult`) | `js/data/receitas-fusao.js` |
| `Ua` | Auxiliar usado pelas receitas para comparar ingredientes | `js/data/receitas-fusao.js` |
| `Hud` | **HUD** (minimapa, botões de toque, barras de vida/stamina) | `js/ui/hud.js` |
| `InventoryModal` | Modal do **inventário** (mochila, equipamento, mesa de fusão) | `js/ui/inventory.js` |
| `ItemDetailPanel` | Painel de **detalhe do item** (botões Equipar, Colocar no Fogo, etc.) | `js/ui/inventory.js` |
| `GameMain` | **Componente principal** do jogo (estado, loop, atalhos, modais) | `js/ui/game-main.js` |
| `saveGameState` / `loadGameState` / `clearGameState` | Salvar / carregar / apagar o save (`localStorage`) | `js/core/save.js` |

Dentro de `GameMain` (só valem lá):

| Nome | O que é |
|---|---|
| `o.current` | O mundo (`new World(...)`) |
| `f.current` | O jogador (`x`, `y`, `hp`, `stamina`, `isDead`...) |
| `m.current` | O áudio (`new AudioManager()`) |
| `c.current` | As criaturas/entidades (`new CreatureManager(...)`) |
| `Ve` / `ra` | Mochila (array de itens) / função para alterá-la |
| `Oe` | Equipamento (`Oe.mao_esquerda`, `Oe.mao_direita`...) |
| `ct` | Ouro |
| `ve("texto")` | Mostra um aviso (toast) na tela |
| `Ga.current` | Todos os handlers de atalho (`handleCookingPot`, `handleInteract`...) |
| `qo` | Interagir (tecla E / botão) |
| `Qt` | Abrir/fechar inventário |

## Formato de um item

```js
{
  id: "item_estilingue_173..._ab",   // único
  name: "Estilingue",
  categoryType: "weapon",            // weapon | equipment | material | consumable ...
  slot: "mao_esquerda",              // onde equipa (se equipável)
  isEquippable: true,
  rarity: "incomum",
  stackCount: 1, maxStack: 20,       // empilhável
  description: "...",
  stats: { attack: 4 },
  icon: "Cross",                     // nome ou emoji — quem desenha é o ItemIcon
  color: "#a16207",
  value: 90
}
```

Slots conhecidos: `mao_esquerda`, `mao_direita`, `cinto_slot1`, `cinto_slot2`, `cinto`, `mochila`
(veja o `LEIA-ME.txt` para a lista completa de 12 slots).

## Como a panela/cozinha funciona (exemplo de fluxo completo)

- Mundo (`World`): `setCookingPot` → `addIngredientToPot` → `takeIngredientsFromPot` → `removeCookingPot` → `finishCooking` (aqui ficam as receitas de cozinha).
- Colocar/recolher a panela: botão do inventário → `zK` (dentro de `GameMain`).
- Adicionar ingrediente: `wK`. Abrir o modal: tecla **R** (`kG`) **ou toque/clique na panela** (`tapPot` no efeito do canvas).
- O modal **nunca** deve abrir sozinho ao colocar a panela.
- Modal: procure `cookingModalOpen`. Ele usa `ItemIcon` para todos os ícones.

## Chicote de Gosma (arma de alcance)

- Detecção: `isWhipItemX(item)` (pelo nome/id "chicote"). Vale também para saves antigos.
- Ícone: `drawWhipIcon` (chamado no começo de `drawItemIcon`). Pose na mão: `drawWhipHeldX` (via `drawWeaponItem`).
- Golpe: `drawWhipSwingX` (chamado em `drawArmsAndCombat`). A tira é calculada por `whipLashX`; o estalo é `drawWhipCrackX`.
- Alcance: no `Sl` (handler de ataque), `whipReach = 76` e golpe de 0.4s. O dano usa `performAttack(..., rangeOverride, ..., whipFlag)`, que acerta em linha reta (raio) e não desenha o arco de espada.
- Som: `playWhipCrack` em `AudioManager` (o estalo toca em ~0.26s, junto com a ponta esticando).

## Controles do jogo

E interagir · Espaço atacar · Shift seixo · I inventário · L tocha · U coletar água · P pesca ·
G alimentar fogueira · T assar peixe · **R panela (modal)** · Q ingrediente rápido · 1/2 itens do cinto · C recentrar câmera.

## Receitas rápidas de busca

```bash
grep -rn "nomeDaFuncao\|palavra-chave" js/     # achar onde algo é usado
grep -rn "KeyR" js/                            # onde uma tecla é tratada
grep -rn "ItemIcon, {" js/                           # exemplos de uso do ícone correto
node --check <arquivo>                              # validar sintaxe
```

## Git (para quem comita)

- Branch por tarefa; commits pequenos, um assunto por commit.
- Tags `estavel-N` **só depois que o Filipe testou e aprovou** a versão. Antes disso, use `candidata-N`.
- Nunca commitar `.zip`, `node_modules` ou `.env`.
- Ao entregar, enviar o **projeto completo** (zip inteiro), não só o arquivo alterado.
