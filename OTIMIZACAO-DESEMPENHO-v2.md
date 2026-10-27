# Otimizações de desempenho (v2) — sem mudar gráficos nem jogabilidade

- Cache de chunks de terreno com LRU e teto dinâmico: corrige o thrash (apagava 101 chunks de uma vez, inclusive visíveis). Zoom afastado: ~700 ms/frame -> ~220 ms/frame, 0 chunks re-pintados por frame.
- Água, gelo/terreno animado e itens do chão só desenhados na área visível (luzes e props seguem com a janela ampla original).
- Cache de tiles com chave numérica (menos strings por getTile).
- Limite de 60 FPS com passo fixo (caixa "Limitar a 60 FPS" no painel ⚙). ATENÇÃO: o movimento do jogo é por frame; sem o limite, em 120/144 Hz o jogo roda mais rápido. Com o limite, em telas de alta taxa ele fica na velocidade de 60 Hz.
- Gráficos: diferença média de pixels 0,0000 em 8 cenários (pior pixel: 1-2 níveis de 255 em deserto/neve).
- Ganho em frame normal é modesto (0-16% conforme a cena, medido em CPU software). Maior custo restante: iluminação noturna, sombras de props e água.

## Bioma de montanhas (MOUNTAIN_25D) — correção de CPU em `js/core/world.js`

Problema: `getTile()` chama `_syncBluePlantProp` -> `_isBluePlantPeak` para TODO tile de montanha a CADA acesso (todo frame, todo tile visível). Isso refazia, sem cache, até ~2000x `_getMountain25DInfo` por tile, e cada uma refazia ruído fbm e escaneamentos de até 160 tiles. Medido (janela 40x24 dentro da montanha, CPU de Node): gerar a janela ~40 s e **cada frame ~2,9 s** (139 mil cálculos de bioma por frame).

Correção (só cache, mesmo resultado):
- `_isMountain25DBiomeAt`: resultado guardado por tile.
- `_getMountain25DInfo`: memoizado (`_computeMountain25DInfo` é o corpo original).
- `_isBluePlantPeak`: parte geométrica memoizada (`_computeBluePlantPeak` é o corpo original).
- `_getMountain25DBounds`: chave numérica em vez de string e teto de tamanho.
- Chave `_mk()` (inteiro pequeno) nos caches de montanha: `_tk()` gera números > 2^31 e deixa o Map lento.
- `setSeed` limpa esses caches (`_clearMountainCaches`).

Resultado (mesma janela): gerar ~0,34 s; frame com tudo em cache ~0,7 ms, 0 cálculos de bioma. Verificado: 5481 tiles (dia e noite, 4 regiões) e os picos da planta azul em 3 seeds são IDÊNTICOS ao código antigo.

Ainda não tocado (muda pixels, decisão do dono): em janelas do interior da montanha ~78% dos `cliff_wall` desenhados só repintam o platô que o chunk já tem (ver `case "cliff_wall"` em `renderer.js`).

## Paredões da montanha — render (`render-props.js`, `renderer.js`)

- BUG: `getCliffWallFaceGradient` e `getCliffNorthGradient` eram chamadas em `drawCliffWall25D` mas não existiam em nenhum arquivo (ReferenceError ao desenhar qualquer paredão com face externa; como o `requestAnimationFrame` fica depois do `render`, o loop parava). Agora existem em `render-props.js`, com cache por altura. As CORES são uma reconstrução (não havia versão anterior no git): face sul #64748b -> #1e293b, escarpa norte #0f172a -> #475569.
- PERF: paredão com platô nos 4 lados (esq/dir/cima/baixo) só repintava o chão que o chunk já tem; `renderer.js` agora não o desenha (resultado em `tile._wallBuried`). Interior da montanha: ~31% menos operações de canvas por frame. Para voltar ao comportamento antigo: `window.__cliffKeepBuried = true` no console.
