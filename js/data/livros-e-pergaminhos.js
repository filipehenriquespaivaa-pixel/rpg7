/* js/data/livros-e-pergaminhos.js
 * Conteúdo completo, páginas, receitas e dados dos Livros e Pergaminhos do mundo.
 * Suporta livros de Culinária (Vol I e II), Ferramentas Primitivas, Construção Básica,
 * Armas e Equipamentos Comuns, Pergaminho Rúnico Sagrado (Totalmente em Runas),
 * Catálogo de Recursos da Terra, Atlas de Biomas e Bestiário de Criaturas.
 * Inclui dados de forja visual (forgeRecipe) e tempos de estudo (mínimo de 60 segundos).
 * Padrão global: window.Game.BooksAndScrolls
 */
"use strict";

window.Game = window.Game || {};

(function (G) {
  // Catálogo com todo o conteúdo formatado em páginas para Livros e seções para Pergaminhos
  const BOOKS_AND_SCROLLS_DB = {
    // 1. LIVRO DE CULINÁRIA - VOLUME I
    culinaria_vol1: {
      type: "book",
      id: "item_livro_culinaria_1",
      learningType: "receitas",
      category: "receitas",
      name: "Livro de Culinária — Volume I: Pratos Rústicos e Assados",
      shortTitle: "Culinária Rústica (Vol. I)",
      author: "Mestre Gastrônomo Teodoro de Delfos",
      coverColor: "#9a3412", // Terracota / Couro avermelhado
      accentColor: "#fbbf24",
      icon: "📖",
      rarity: "incomum",
      description: "Compêndio gastronômico com receitas tradicionais de fogueira e forno de barro. Contém instruções para pães, peixes no espeto, carnes defumadas e caldos silvestres.",
      value: 135,
      studyTime: 75, // 1 minuto e 15 segundos
      recipeIds: ["fuse_pao_campo", "fuse_espeto_peixe", "fuse_carne_defumada", "fuse_potion_vigor"],
      pages: [
        {
          chapter: "Prefácio Gastrônomo",
          title: "A Arte das Brasas & Sabores da Terra",
          subtitle: "Volume I — O Fogo como Primeiro Alquimista",
          content: `Nas terras selvagens, alimentar-se é mais que sobrevivência: é renovar o espírito e temperar a resistência do corpo.
          
O viajante prudente jamais despreza o poder de uma fogueira acesa. O calor brando das brasas transforma ingredientes ásperos em manjares revitalizantes.
          
Este primeiro volume reúne o conhecimento das cozinhas rústicas dos povoados e acampamentos de caçadores. Domine o ponto do fogo e jamais temerás a fome nem o cansaço.`,
          flavor: "“A paciência diante das brasas é o tempero mais nobre da culinária.” — Provérbio dos Caçadores",
        },
        {
          chapter: "Receita I — Panificação",
          title: "Pão Rústico de Trigo e Sementes",
          subtitle: "Cozido sob Cinzas Quentes ou Forno de Barro",
          content: `🌾 INGREDIENTES:
• Grãos de Trigo Seco colhidos das campinas
• Água fresca de nascente cristalina

🔥 PREPARO:
Misture a farinha rústica até formar uma massa consistente e elástica. Asse na brasa viva ou no Forno de Barro por 2 minutos até a crosta dourar.

✨ EFEITO VITAL:
Restaura +65 de Vida instantaneamente e concede +80 de Stamina ao viajante.`,
          flavor: "Dica: Conserve o pão envolvido em folhas largas para mantê-lo macio por dias.",
          forgeRecipe: {
            recipeId: "fuse_pao_campo",
            slot1: { name: "Trigo Silvestre", icon: "🌾" },
            slot2: { name: "Trigo Silvestre", icon: "🌾" },
            result: { name: "Pão Rústico Assado", icon: "🍞" },
          },
        },
        {
          chapter: "Receita II — Frutos das Águas",
          title: "Peixe na Brasa ao Ramo de Alecrim",
          subtitle: "Assado Tradicional no Espeto de Carvalho",
          content: `🐟 INGREDIENTES:
• 1 Peixe fresco (Lambari, Tilápia ou Truta dos riachos)
• 1 Galho seco de Carvalho para servir de espeto

🔥 PREPARO:
Limpe as escamas e atravesse o galho no sentido longitudinal. Posicione sobre as chamas e gire lentamente até a pele dourar com aroma defumado.

✨ EFEITO VITAL:
Restaura +70 de Vida e fornece +90 de Stamina. Fortalece o fôlego para corridas prolongadas.`,
          flavor: "Aviso: Peixe cru pode causar desconforto; sempre asse nas chamas antes de consumir.",
          forgeRecipe: {
            recipeId: "fuse_espeto_peixe",
            slot1: { name: "Peixe Fresco", icon: "🐟" },
            slot2: { name: "Galho de Carvalho", icon: "🪵" },
            result: { name: "Espeto de Peixe Grelhado", icon: "🍢" },
          },
        },
        {
          chapter: "Receita III — Carnes da Caça",
          title: "Carne de Caça Seca & Defumada",
          subtitle: "Provisão de Longa Jornada para Mochilas",
          content: `🥩 INGREDIENTES:
• Fatias de Carne fresca de Coelho ou Cervo nobre
• Galho aromático para defumação no fogo

🔥 PREPARO:
Corte a carne em tiras delgadas. Suspenda sobre fumaça branda da fogueira para desidratação gradual, preservando nutrientes sem estragar na mochila.

✨ EFEITO VITAL:
Proporciona +85 de Vida e +60 de Stamina contínua, alimento essencial para expedições profundas.`,
          flavor: "Dura semanas na mochila sem perder o sabor marcante e a maciez fibrosa.",
          forgeRecipe: {
            recipeId: "fuse_carne_defumada",
            slot1: { name: "Carne Crua de Caça", icon: "🥩" },
            slot2: { name: "Galho de Madeira", icon: "🪵" },
            result: { name: "Carne de Caça Assada Defumada", icon: "🍖" },
          },
        },
        {
          chapter: "Receita IV — Caldeirão de Ervas",
          title: "Caldo Silvestre de Cogumelos & Raízes",
          subtitle: "Tônico Aquecedor para Noites Gélidas",
          content: `🍄 INGREDIENTES:
• Ervas medicinais ou cogumelos da floresta
• Frasco com água pura de lagoa ou oásis

🔥 PREPARO:
Aproxime-se de um caldeirão sobre brasas incandescentes. Ferva a água e adicione as folhas até adquirir coloração esmeralda e brilhante.

✨ EFEITO VITAL:
Recupera +50 de Vida e acelera a regeneração natural de Stamina durante 3 minutos inteiros.`,
          flavor: "Indispensável ao cruzar biomas montanhosos de neve e ventos cortantes.",
          forgeRecipe: {
            recipeId: "fuse_potion_vigor",
            slot1: { name: "Erva Medicinal", icon: "🌿" },
            slot2: { name: "Frasco com Água", icon: "🧪" },
            result: { name: "Caldo Concentrado de Vigor", icon: "🍵" },
          },
        },
        {
          chapter: "Encerramento do Volume I",
          title: "Conselhos do Mestre das Panelas",
          subtitle: "O Caminho Rumo ao Segundo Volume",
          content: `Quem domina o pão, o peixe no espeto, a carne defumada e o caldo de raízes já é capaz de sobreviver em qualquer canto deste mundo.
          
Entretanto, a verdadeira alta gastronomia helênica vai além: banquetes nobres, ensopados e elixires são detalhados no **Volume II: Banquetes e Elixires Gastronômicos**.
          
Mantenha seus potes de cerâmica sempre limpos e suas pederneiras sempre secas!`,
          flavor: "Registrado com tinta de noz-de-galha na Biblioteca de Delfos.",
        },
      ],
    },

    // 2. LIVRO DE CULINÁRIA - VOLUME II
    culinaria_vol2: {
      type: "book",
      id: "item_livro_culinaria_2",
      learningType: "receitas",
      category: "receitas",
      name: "Livro de Culinária — Volume II: Banquetes e Elixires Gastronômicos",
      shortTitle: "Banquetes & Elixires (Vol. II)",
      author: "Mestre Gastrônomo Teodoro de Delfos",
      coverColor: "#831843", // Vinho nobre / Púrpura imperial
      accentColor: "#f472b6",
      icon: "📕",
      rarity: "raro",
      description: "Segunda parte do compêndio culinário. Revela banquetes nobres, ensopados campais, peixes ao vapor de ervas e elixires revigorantes de vitalidade.",
      value: 180,
      studyTime: 80, // 1 minuto e 20 segundos
      recipeIds: ["fuse_banquete_guerreiro", "fuse_guisado_cogumelo", "fuse_peixe_vapor", "fuse_slime_potion"],
      pages: [
        {
          chapter: "Prólogo Imperial",
          title: "Os Festins dos Reis e Sábios",
          subtitle: "Volume II — A Alquimia da Boa Mesa",
          content: `Se o primeiro volume ensinou a manter o fôlego da sobrevivência, este segundo volume consagra a culinária como arte divina.
          
Na corte dos heróis antigos, guerreiros não partiam para combater feras temíveis sem antes partilharem de um Banquete Nobre. As combinações aqui transcritas fortalecem a fibra muscular e aguçam os reflexos de combate.
          
Reúna caldeirões de barro, carnes assadas, ervas e a água límpida dos riachos.`,
          flavor: "“O banquete certo antes da batalha vale por dez escudos reforçados.” — Arquitas de Tarento",
        },
        {
          chapter: "Receita V — O Grande Prato",
          title: "Banquete dos Campeões",
          subtitle: "O Festim Completo para Batalhas Épicas",
          content: `👑 INGREDIENTES:
• 1 Peça suculenta de Carne de Caça Assada
• 1 Pão Rústico Dourado fatiado
• 1 Recipiente de cerâmica com Água límpida

🔥 PREPARO:
Junte os alimentos no caldeirão para harmonizar os caldos e nutrientes em uma refeição completa de guerreiro.

✨ EFEITO VITAL:
Aumenta a Vida temporariamente (+150 HP) e concede +150 de Stamina máxima ao personagem.`,
          flavor: "O prato predileto dos campeões da arena helênica antes das grandes provações.",
          forgeRecipe: {
            recipeId: "fuse_banquete_guerreiro",
            slot1: { name: "Carne Assada", icon: "🍖" },
            slot2: { name: "Pão Rústico", icon: "🍞" },
            slot3: { name: "Água da Lagoa", icon: "💧" },
            result: { name: "Banquete do Guerreiro", icon: "🍱" },
          },
        },
        {
          chapter: "Receita VI — Cozido de Caça",
          title: "Guisado Silvestre com Cogumelos",
          subtitle: "Cozimento Lento de Carne e Fungos da Mata",
          content: `🍲 INGREDIENTES:
• Carne fresca de animal caçado
• Cogumelos vermelhos ou marrons das árvores
• Água pura de nascente

🔥 PREPARO:
Cozinhe lentamente em fogo brando no caldeirão até a carne desfiar e os cogumelos liberarem aroma silvestre espesso.

✨ EFEITO VITAL:
Regenera +120 de Vida e remove a fadiga acumulada em terrenos difíceis.`,
          flavor: "O perfume adocicado revigora o viajante após dias de exploração exaustiva.",
          forgeRecipe: {
            recipeId: "fuse_guisado_cogumelo",
            slot1: { name: "Carne Crua de Caça", icon: "🥩" },
            slot2: { name: "Cogumelo da Mata", icon: "🍄" },
            slot3: { name: "Água Fresca", icon: "💧" },
            result: { name: "Guisado Silvestre Encorpado", icon: "🍲" },
          },
        },
        {
          chapter: "Receita VII — Peixe Nobre",
          title: "Peixe ao Vapor com Ervas Frescas",
          subtitle: "Cocção Delicada no Pote de Argila",
          content: `🐟 INGREDIENTES:
• Peixe fresco recém-pescado
• Ervas medicinais aromáticas
• Água límpida de riacho cristalino

🔥 PREPARO:
No forno de barro ou panela de cerâmica, cozinhe o peixe no vapor d'água perfumado pelas ervas, sem queimar as escamas.

✨ EFEITO VITAL:
Cura +100 HP e concede velocidade de corrida ampliada por 4 minutos.`,
          flavor: "Prato apreciado pelos sábios e filósofos da costa marítima.",
          forgeRecipe: {
            recipeId: "fuse_peixe_vapor",
            slot1: { name: "Peixe Nobre", icon: "🐟" },
            slot2: { name: "Erva Medicinal", icon: "🌿" },
            slot3: { name: "Água Fresca", icon: "💧" },
            result: { name: "Peixe Nobre ao Vapor", icon: "🥘" },
          },
        },
        {
          chapter: "Receita VIII — Alquimia da Vitalidade",
          title: "Elixir Restaurador de Vitalidade",
          subtitle: "Bebida Energética de Extrato de Slime",
          content: `✨ INGREDIENTES:
• Gosma purificada de Slime verde ou azul
• Folhas frescas de Erva Medicinal

🔥 PREPARO:
Macere a gosma com as ervas em tigela cerâmica até que a emulsão adquira consistência límpida e borbulhante.

✨ EFEITO VITAL:
Recupera instantaneamente +90 de Stamina e confere imunidade a cansaço durante a noite.`,
          flavor: "Um pequeno frasco cabe confortavelmente em qualquer bolso do cinto de equipamentos.",
          forgeRecipe: {
            recipeId: "fuse_slime_potion",
            slot1: { name: "Gosma de Slime", icon: "🧪" },
            slot2: { name: "Erva Medicinal", icon: "🌿" },
            result: { name: "Elixir da Vitalidade", icon: "✨" },
          },
        },
        {
          chapter: "O Mito dos Deuses",
          title: "A Ambrosia Divina",
          subtitle: "O Alimento dos Imortais do Olimpo",
          content: `Dizem os pergaminhos preservados nos templos que acima das nuvens os deuses não comem o trigo da terra, mas sim a *Ambrosia* — substância de pureza absoluta.
          
Quem prova deste néctar esquece a dor, o envelhecimento e o medo da derrota. Os ingredientes exatos pertencem aos rituais arcanos das ruínas ocultas.
          
Que estas receitas guiem sua jornada pelas terras infinitas!`,
          flavor: "Fim do Compêndio Culinário Completo (Volumes I & II).",
        },
      ],
    },

    // 3. PERGAMINHO DE FERRAMENTAS PRIMITIVAS
    ferramentas_primitivas: {
      type: "scroll",
      id: "item_pergaminho_ferramentas_primitivas",
      learningType: "receitas",
      category: "receitas",
      name: "Pergaminho de Ferramentas Primitivas",
      shortTitle: "Ferramentas Primitivas",
      author: "Papiro Antigo dos Primeiros Nômades",
      scrollTheme: "primitive",
      accentColor: "#f59e0b",
      icon: "📜",
      rarity: "comum",
      description: "Rolo de papiro rústico descrevendo o lascamento de pedra, machados de sílex, picaretas primitivas e tochas de resina.",
      value: 110,
      studyTime: 60, // 1 minuto exato (mínimo)
      recipeIds: ["fuse_pedra_galho_faca", "fuse_pedra_corda_galho", "fuse_torch_pinho", "fuse_seixo_pedras_lascadas"],
      sections: [
        {
          title: "I. O Dom do Lascamento de Pedra",
          glyph: "🪨",
          text: `Antes do bronze e do ferro forjado, a humanidade dominou o mundo com a pedra lascada. Encontre seixos e rochas sedimentares rígidas à beira de rios e encostas.
          
Golpeie um seixo contra outro em ângulo agudo de 45 graus: lascas finas e afiadas como navalhas se desprenderão. Estas lascas são o embrião de todas as ferramentas de sobrevivência.`,
        },
        {
          title: "II. Machadinha Rústica de Sílex",
          glyph: "🪓",
          text: `FABRICAÇÃO NA FORJA:
Junte um pedaço de pedra lascada afiada com um galho de madeira resistente. A amarra de fibras consolida a lâmina com firmeza absoluta. Permite derrubar arbustos e colher madeira rapidamente.`,
          forgeRecipe: {
            recipeId: "fuse_pedra_galho_faca",
            slot1: { name: "Pedra Lascada", icon: "🪨" },
            slot2: { name: "Galho de Madeira", icon: "🪵" },
            result: { name: "Faca / Machadinha de Pedra", icon: "🪓" },
          },
        },
        {
          title: "III. Picareta Primitiva de Mineração",
          glyph: "⛏️",
          text: `FABRICAÇÃO NA FORJA:
Três materiais são necessários: uma rocha pontiaguda firme, uma corda de fibra vegetal trançada e um galho reforçado.
          
Essencial para fraturar veios minerais expostos na superfície e extrair fragmentos de carvão, sílex e minérios.`,
          forgeRecipe: {
            recipeId: "fuse_pedra_corda_galho",
            slot1: { name: "Pedra Firme", icon: "🪨" },
            slot2: { name: "Corda de Fibra", icon: "🪢" },
            slot3: { name: "Galho de Madeira", icon: "🪵" },
            result: { name: "Picareta de Mineração", icon: "⛏️" },
          },
        },
        {
          title: "IV. Tocha Incandescente de Resina",
          glyph: "🔥",
          text: `FABRICAÇÃO NA FORJA:
Combine um galho seco com resina ou seiva vegetal inflamável. A tocha é o sol portátil das noites ermas: seu calor afugenta predadores e ilumina o raio do personagem em cavernas e ruínas escuras.`,
          forgeRecipe: {
            recipeId: "fuse_torch_pinho",
            slot1: { name: "Galho de Madeira", icon: "🪵" },
            slot2: { name: "Resina / Seiva", icon: "🔥" },
            result: { name: "Tocha Acesa do Explorador", icon: "🕯️" },
          },
        },
      ],
    },

    // 4. LIVRO DE COMO CONSTRUIR ITENS BÁSICOS
    itens_basicos: {
      type: "book",
      id: "item_livro_itens_basicos",
      learningType: "receitas",
      category: "receitas",
      name: "Manual de Construção: Itens Básicos & Sobrevivência",
      shortTitle: "Construção de Itens Básicos",
      author: "Arquiteto e Construtor Hélio de Corinto",
      coverColor: "#166534", // Verde floresta profundo
      accentColor: "#4ade80",
      icon: "📗",
      rarity: "incomum",
      description: "Manual prático ensinando a montar fogueiras no solo, fornos cúpula de argila, cordas de linho e recipientes de barro.",
      value: 125,
      studyTime: 90, // 1 minuto e 30 segundos
      recipeIds: ["fuse_campfire_unlit", "fuse_forno_barro", "fuse_moldagem_argila", "fuse_tijolo_argila"],
      pages: [
        {
          chapter: "Capítulo I",
          title: "O Ponto de Partida do Sobrevivente",
          subtitle: "Transformando Recursos Brutos em Abrigo",
          content: `A natureza oferece materiais abundantes, mas desordenados: árvores caídas, pedras dispersas, barro nas margens e fibras na relva.
          
O artífice experiente não necessita de oficina sofisticada para dar os primeiros passos. Com as próprias mãos e noções de geometria rústica, constrói os esteios da sobrevivência.
          
Leia com atenção cada diagrama deste manual antes de gastar seus preciosos recursos.`,
          flavor: "“Quem sabe erguer seu fogo e moldar o barro é soberano em qualquer terra.” — Hélio de Corinto",
        },
        {
          chapter: "Capítulo II — Fogo no Solo",
          title: "Montagem da Fogueira Campal",
          subtitle: "O Centro de Todo Acampamento Seguro",
          content: `🪵 MATERIAIS NECESSÁRIOS:
• 10 Galhos de carvalho no Slot 1 e 10 Galhos no Slot 2

🔨 PROCEDIMENTO:
Junte os feixes de galhos na mesa de trabalho para montar a armação de fogueira. Colocada no solo, ela ilumina a escuridão, assa carnes e serve de marco seguro de descanso.`,
          flavor: "Aproxime-se da fogueira acesa para recuperar vida e vigor.",
          forgeRecipe: {
            recipeId: "fuse_campfire_unlit",
            slot1: { name: "10x Galho de Carvalho", icon: "🪵" },
            slot2: { name: "10x Galho de Carvalho", icon: "🪵" },
            result: { name: "Fogueira Campal no Mapa", icon: "🏕️" },
          },
        },
        {
          chapter: "Capítulo III — Cúpula Térmica",
          title: "Forno Rústico de Barro e Argila",
          subtitle: "Retenção de Calor e Assados Perfeitos",
          content: `🧱 MATERIAIS NECESSÁRIOS:
• 1 Estrutura de fogueira campal
• Argila úmida colhida das margens de lagoas

🔨 PROCEDIMENTO:
Una o fogo campal com a argila plástica. A cúpula assa o barro até vitrificá-lo, criando um forno permanente capaz de reter brasas para assar pães e fundir cerâmica.`,
          flavor: "O Forno de Barro instalado no mapa não se apaga com a chuva fraca.",
          forgeRecipe: {
            recipeId: "fuse_forno_barro",
            slot1: { name: "Fogueira Campal", icon: "🏕️" },
            slot2: { name: "Argila Úmida", icon: "🧱" },
            result: { name: "Forno Rústico de Barro", icon: "🏺" },
          },
        },
        {
          chapter: "Capítulo IV — Moldagem Cerâmica",
          title: "Panela e Caldeirão de Argila",
          subtitle: "Recipientes para Água e Caldos",
          content: `🥣 MATERIAIS NECESSÁRIOS:
• Duas porções generosas de Argila Úmida

🔨 PROCEDIMENTO:
Modele a argila em formato côncavo de paredes espessas. O utensílio cozido ao calor serve tanto para colher água fresca na lagoa quanto para preparar receitas culinárias.`,
          flavor: "Essencial para coletar água e recuperar até +90 de Stamina.",
          forgeRecipe: {
            recipeId: "fuse_moldagem_argila",
            slot1: { name: "Argila Úmida", icon: "🧱" },
            slot2: { name: "Argila Úmida", icon: "🧱" },
            result: { name: "Panela / Caldeirão de Barro", icon: "🥣" },
          },
        },
        {
          chapter: "Capítulo V — Cordoaria Prática",
          title: "Trançado de Fibras & Cordas Rústicas",
          subtitle: "O Vínculo Forte de Todas as Construções",
          content: `🌿 MATERIAIS NECESSÁRIOS:
• Feixes de Fibra Vegetal colhidos das campinas

🔨 PROCEDIMENTO:
Entrelace duas mechas de fibra vegetal em torção contínua para criar a corda pequena. Ela serve de suporte para bolsas, cintos e fixação de lâminas em armas.`,
          flavor: "Umedeça as fibras com água doce antes de trançar para evitar quebras.",
          forgeRecipe: {
            recipeId: "fuse_corda_pequena",
            slot1: { name: "Fibra Vegetal", icon: "🌿" },
            slot2: { name: "Fibra Vegetal", icon: "🌿" },
            result: { name: "Corda de Fibra Pequena", icon: "🪢" },
          },
        },
        {
          chapter: "Encerramento da Construção",
          title: "O Legado das Mãos Habilidosas",
          subtitle: "Conselhos do Mestre Hélio de Corinto",
          content: `Com uma fogueira, um forno de barro, panelas e cordas resistentes, o desbravador tem todas as bases estruturais necessárias para se estabelecer em qualquer terreno.
          
Expanda seus horizontes para a metalurgia e a alfaiataria militar com o Tratado de Armas & Equipamentos Comuns.`,
          flavor: "Fim das Instruções de Construção Básica.",
        },
      ],
    },

    // 5. LIVRO DE CONSTRUÇÃO DE EQUIPAMENTOS E ARMAS COMUNS
    armas_e_equipamentos: {
      type: "book",
      id: "item_livro_armas_equipamentos",
      learningType: "receitas",
      category: "receitas",
      name: "Tratado de Armas & Equipamentos Comuns",
      shortTitle: "Armas & Equipamentos Comuns",
      author: "Mestre Armeiro Calícrates de Esparta",
      coverColor: "#1e3a8a", // Azul marinho metálico
      accentColor: "#60a5fa",
      icon: "⚔️",
      rarity: "incomum",
      description: "Tratado metalúrgico detalhando a forja de espadas de ferro, o chicote de couro trançado, escudos redondos, túnicas de fibra, botas velozes e pingentes.",
      value: 160,
      studyTime: 120, // 2 minutos (conteúdo rico)
      recipeIds: ["fuse_iron_sword", "fuse_chicote_gosma", "fuse_iron_shield", "fuse_cinto_tunica_fibra", "fuse_travel_boots", "fuse_gold_pendant"],
      pages: [
        {
          chapter: "Exórdio Marcial",
          title: "O Peso da Lâmina e a Firmeza do Escudo",
          subtitle: "Fundamentos da Armaria e Equipamento de Batalha",
          content: `Nas fronteiras do mundo civilizado, feras e criaturas sombrias não negociam: respeitam apenas a solidez do metal forjado e a flexibilidade das vestes de combate.
          
O combatente sábio não confia na sorte: veste-se com equipamentos adequados para cada desafio e empunha armas que potencializam seus reflexos.
          
Neste tomo, o guerreiro aprenderá as 6 principais fórmulas de armaria comum testadas nos campos de Esparta.`,
          flavor: "“A espada protege a vida; o escudo preserva a honra; as botas garantem a fuga tática.” — Ditado Espartano",
        },
        {
          chapter: "Lâmina Primária",
          title: "Espada Forjada de Ferro",
          subtitle: "Arma Equilibrada de Ataque Rápido e Fio Nobre",
          content: `🗡️ FORJA MARCIAL:
Junte uma Barra de Ferro fundida com um cabo firme de Galho de Madeira. Golpeie com o martelo até conferir lâmina reta de dois gumes com contraforte maciço. Concede grande poder de ataque corpo a corpo contra slimes e lobos.`,
          flavor: "Causa dano afiado com alto alcance frontal no botão de ataque [Barra de Espaço].",
          forgeRecipe: {
            recipeId: "fuse_iron_sword",
            slot1: { name: "Barra de Ferro", icon: "⚔️" },
            slot2: { name: "Galho de Madeira", icon: "🪵" },
            result: { name: "Espada Forjada de Ferro", icon: "🗡️" },
          },
        },
        {
          chapter: "Arma de Alcance Tático",
          title: "Chicote Tático de Gosma e Corda",
          subtitle: "Açoite Flexível para Controle de Múltiplos Inimigos",
          content: `➰ FORJA MARCIAL:
Combine uma Corda de Fibra vegetal com Gosma purificada de Slime. A gosma concede elasticidade elástica sem romper os nós, transformando a corda em chicote ágil que golpeia em arco circular rápido à frente do herói.`,
          flavor: "Excelente para atingir grupos de inimigos sem se expor a ataques de perto.",
          forgeRecipe: {
            recipeId: "fuse_chicote_gosma",
            slot1: { name: "Corda de Fibra", icon: "🪢" },
            slot2: { name: "Gosma de Slime", icon: "🧪" },
            result: { name: "Chicote Tático Trançado", icon: "➰" },
          },
        },
        {
          chapter: "Defesa Pessoal",
          title: "Escudo Redondo de Ferro",
          subtitle: "Absorção de Impactos Pesados na Mão Esquerda",
          content: `🛡️ FORJA MARCIAL:
Combine duas Barras de Ferro no fogo da forja. O escudo redondo é forjado com umbo central reforçado, bloqueando projéteis e mordidas de feras quando empunhado no slot Secundário.`,
          flavor: "Concede bônus substancial de Defesa física ao personagem.",
          forgeRecipe: {
            recipeId: "fuse_iron_shield",
            slot1: { name: "Barra de Ferro", icon: "🛡️" },
            slot2: { name: "Barra de Ferro", icon: "🛡️" },
            result: { name: "Escudo Redondo de Ferro", icon: "🛡️" },
          },
        },
        {
          chapter: "Vestuário de Batalha",
          title: "Túnica de Fibra & Cinto de Utilidades",
          subtitle: "Armadura Leve para Agilidade Máxima",
          content: `🥋 ALFAIATARIA MARCIAL:
Entrelace duas cordas de fibra reforçadas na bancada. O entrelaçamento cruzado forma uma túnica leve que protege o tronco sem comprometer a flexibilidade nem a velocidade de caminhada.`,
          flavor: "Oferece bônus de Defesa e Stamina com peso quase imperceptível.",
          forgeRecipe: {
            recipeId: "fuse_cinto_tunica_fibra",
            slot1: { name: "Corda de Fibra", icon: "🪢" },
            slot2: { name: "Corda de Fibra", icon: "🪢" },
            result: { name: "Túnica de Fibra Reforçada", icon: "🥋" },
          },
        },
        {
          chapter: "Passos Rápidos",
          title: "Botas de Andarilho Reforçadas",
          subtitle: "Calçado para Marchas Longas em Terrenos Difíceis",
          content: `👢 CALÇADO MARCIAL:
Junte uma Corda de Fibra com um Galho de Madeira firme para estruturar o solado e a fixação do tornozelo. Aumenta a velocidade de locomoção do herói pelo mapa infinito.`,
          flavor: "Reduz o consumo de energia ao correr e explorar o mundo.",
          forgeRecipe: {
            recipeId: "fuse_travel_boots",
            slot1: { name: "Corda de Fibra", icon: "🪢" },
            slot2: { name: "Galho de Madeira", icon: "🪵" },
            result: { name: "Botas de Andarilho Veloz", icon: "👢" },
          },
        },
        {
          chapter: "Adorno e Talismã",
          title: "Pingente Dourado da Lua",
          subtitle: "Joia Encantada para Fortalecer o Vigor",
          content: `📿 OURIVESARIA:
Junte uma Barra de Ouro nobre com uma amarra fina de Corda de Fibra. O brilho da relíquia aumenta o vigor do aventureiro e a resistência a ataques sombrios.`,
          flavor: "Equipe no slot Pingente do peito para efeitos duradouros.",
          forgeRecipe: {
            recipeId: "fuse_gold_pendant",
            slot1: { name: "Barra de Ouro", icon: "🟡" },
            slot2: { name: "Corda de Fibra", icon: "🪢" },
            result: { name: "Pingente Dourado da Lua", icon: "📿" },
          },
        },
      ],
    },

    // 6. PERGAMINHO ESPECIAL RÚNICO (TOTALMENTE ESCRITO EM RUNAS ANCESTRAIS)
    pergaminho_runico_misterio: {
      type: "scroll",
      id: "item_pergaminho_runico_misterio",
      learningType: "runas",
      category: "runas",
      name: "᚛ ᛈ ᛖ ᚱ ᚷ ᚨ ᛗ ᛁ ᚾ ᚺ ᛟ ᛫ ᚱ ᚢ ᚾ ᛁ ᚲ ᛟ ᛫ ᚨ ᚾ ᚲ ᛖ ᛋ ᛏ ᚱ ᚨ ᛚ ᚜",
      shortTitle: "᚛ ᚱ ᚢ ᚾ ᚨ ᛋ ᛫ ᚨ ᚾ ᚲ ᛖ ᛋ ᛏ ᚱ ᚨ ᛁ ᛋ ᚜",
      author: "᚛ ᚺ ᛁ ᛖ ᚱ ᛟ ᚠ ᚨ ᚾ ᛏ ᛖ ᛫ ᛞ ᛖ ᛫ ᛞ ᛖ ᛚ ᚠ ᛟ ᛋ ᚜",
      scrollTheme: "runic_mystery",
      accentColor: "#a855f7", // Púrpura cósmico luminoso
      icon: "📜",
      rarity: "lendario",
      description: "Pergaminho sagrado inteiramente gravado em runas enigmáticas, círculos concêntricos e triângulos sagrados. O texto está indecifrável no momento — um grande enigma e objetivo de longo prazo a ser desvendado.",
      value: 500,
      hasGeometrySVG: true,
      isUndecipherable: true,
      sections: [
        {
          title: "᚛ ᛟ ᛫ ᛋ ᛖ ᛚ ᛟ ᛫ ᛞ ᛟ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ ᚜",
          glyph: "🔯",
          text: `ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᛫ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛫ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ
ᛋ ᛟ ᛚ ᛫ ᛚ ᚢ ᚾ ᚨ ᛫ ᚨ ᛋ ᛏ ᚱ ᚢ ᛗ ᛫ ᛏ ᛖ ᛏ ᚱ ᚨ ᛫ ᚲ ᛟ ᛋ ᛗ ᛟ ᛋ
ᛟ ᛫ ᛏ ᚱ ᛁ ᚨ ᚾ ᚷ ᚢ ᛚ ᛟ ᛫ ᛞ ᛟ ᛫ ᚠ ᛟ ᚷ ᛟ ᛫ ᛖ ᛫ ᛞ ᚨ ᛫ ᚨ ᚷ ᚢ ᚨ
ᛟ ᛫ ᛟ ᛚ ᚺ ᛟ ᛫ ᛞ ᛟ ᛫ ᛖ ᛏ ᛖ ᚱ ᛫ ᛈ ᚢ ᛚ ᛋ ᚨ ᛫ ᚾ ᚨ ᛫ ᛖ ᛋ ᚲ ᚢ ᚱ ᛁ ᛞ ᚨ ᛟ
ᛈ ᛖ ᚱ ᚷ ᚨ ᛗ ᛁ ᚾ ᚺ ᛟ ᛫ ᚨ ᚱ ᚲ ᚨ ᚾ ᛟ ᛫ ᛞ ᛟ ᛫ ᛞ ᛖ ᛋ ᛏ ᛁ ᚾ ᛟ`,
        },
        {
          title: "᚛ ᛏ ᛖ ᛏ ᚱ ᚨ ᚷ ᚱ ᚨ ᛗ ᚨ ᛏ ᛟ ᚾ ᚜",
          glyph: "🜂 🜄 🜁 🜃",
          text: `🜂 ᚠ ᛟ ᚷ ᛟ ᛫ 🜄 ᚨ ᚷ ᚢ ᚨ ᛫ 🜁 ᚨ ᛖ ᚱ ᛫ 🜃 ᛏ ᛖ ᚱ ᚱ ᚨ
᚛ ᚲ ᚢ ᚨ ᛏ ᚱ ᛟ ᛫ ᛈ ᛟ ᛞ ᛖ ᚱ ᛖ ᛋ ᛫ ᚢ ᛗ ᛫ ᛋ ᛟ ᛫ ᛞ ᛖ ᛋ ᛏ ᛁ ᚾ ᛟ ᚜
ᛏ ᚱ ᛖ ᛋ ᛫ ᚲ ᚺ ᚨ ᚹ ᛖ ᛋ ᛫ ᛋ ᛟ ᛒ ᛫ ᚨ ᛋ ᛫ ᚱ ᚢ ᛁ ᚾ ᚨ ᛋ ᛫ ᛞ ᛖ ᛫ ᛗ ᚨ ᚱ ᛗ ᛟ ᚱ ᛖ
ᛟ ᛫ ᛈ ᛟ ᚱ ᛏ ᚨ ᛟ ᛫ ᛞ ᛟ ᛫ ᛏ ᛖ ᛗ ᛈ ᛚ ᛟ ᛫ ᛈ ᛖ ᚱ ᛗ ᚨ ᚾ ᛖ ᚲ ᛖ ᛫ ᛚ ᚨ ᚲ ᚱ ᚨ ᛞ ᛟ`,
        },
        {
          title: "᚛ ᛈ ᚱ ᛟ ᚠ ᛖ ᚲ ᛁ ᚨ ᛫ ᛞ ᛟ ᛫ ᚨ ᛒ ᛁ ᛋ ᛗ ᛟ ᚜",
          glyph: "🏛️",
          text: `ᛞ ᛖ ᛋ ᛈ ᛖ ᚱ ᛏ ᚨ ᛫ ᛟ ᛫ ᚷ ᚢ ᛖ ᚱ ᚱ ᛖ ᛁ ᚱ ᛟ ᛫ ᛞ ᛟ ᛫ ᛁ ᚾ ᚠ ᛁ ᚾ ᛁ ᛏ ᛟ
ᛋ ᛟ ᛒ ᛫ ᚨ ᛫ ᛒ ᛁ ᛒ ᛚ ᛁ ᛟ ᛏ ᛖ ᚲ ᚨ ᛫ ᚺ ᚨ ᛫ ᛈ ᛟ ᚱ ᛏ ᚨ ᛋ ᛫ ᛚ ᚨ ᚲ ᚱ ᚨ ᛞ ᚨ ᛋ
ᛟ ᛫ ᛞ ᛖ ᛋ ᛏ ᛁ ᚾ ᛟ ᛫ ᛋ ᛖ ᚱ ᚨ ᛫ ᚱ ᛖ ᚹ ᛖ ᛚ ᚨ ᛞ ᛟ ᛫ ᚨ ᛟ ᛫ ᛏ ᛖ ᛗ ᛈ ᛟ ᛫ ᚲ ᛖ ᚱ ᛏ ᛟ
ᛋ ᛟ ᛗ ᛖ ᚾ ᛏ ᛖ ᛫ ᛟ ᛫ ᛈ ᛟ ᚱ ᛏ ᚨ ᛞ ᛟ ᚱ ᛫ ᛞ ᚨ ᛫ ᛋ ᚨ ᛒ ᛖ ᛞ ᛟ ᚱ ᛁ ᚨ ᛫ ᛖ ᚾ ᛏ ᚱ ᚨ ᚱ ᚨ`,
        },
        {
          title: "᚛ ᚨ ᛚ ᚲ ᚺ ᛁ ᛗ ᛁ ᚨ ᛫ ᛋ ᚢ ᛈ ᚱ ᛖ ᛗ ᚨ ᚜",
          glyph: "👁️",
          text: `✦ ☿ ☉ ☽ ♃ ♄ ♂ ♀ ᚛ ᚠ ᛟ ᚱ ᛃ ᚨ ᛫ ᚨ ᚱ ᚲ ᚨ ᚾ ᚨ ᚜
ᚹ ᛁ ᛏ ᚨ ᛫ ᛖ ᛏ ᛖ ᚱ ᚾ ᚨ ᛫ ᛈ ᛟ ᛞ ᛖ ᚱ ᛫ ᛟ ᚲ ᚢ ᛚ ᛏ ᛟ
᚛ ᛖ ᛋ ᛏ ᛖ ᛫ ᛖ ᛫ ᛟ ᛫ ᛟ ᛒ ᛃ ᛖ ᛏ ᛁ ᚹ ᛟ ᛫ ᛋ ᚢ ᛈ ᚱ ᛖ ᛗ ᛟ ᚜
ᚱ ᚢ ᚾ ᚨ ᛋ ᛫ ᛁ ᚾ ᛞ ᛖ ᚲ ᛁ ᚠ ᚱ ᚨ ᚹ ᛖ ᛁ ᛋ ᛫ ᚨ ᛟ ᛫ ᛟ ᛚ ᚺ ᚨ ᚱ ᛫ ᛗ ᛟ ᚱ ᛏ ᚨ ᛚ`,
        },
      ],
    },

    // 7. LIVRO DE CATÁLOGO DE ITENS BÁSICOS
    catalogo_itens: {
      type: "book",
      id: "item_livro_catalogo_itens",
      learningType: "catalogo",
      category: "catalogo",
      name: "Compêndio & Catálogo Ilustrado de Recursos da Terra",
      shortTitle: "Catálogo de Recursos da Terra",
      author: "Erudito Teofrasto de Lesbos",
      coverColor: "#713f12", // Marrom terra mineral
      accentColor: "#facc15",
      icon: "📚",
      rarity: "comum",
      description: "Catálogo completo com ilustrações, raridades e usos de todos os recursos brutos, minerais, botânicos e restos orgânicos encontrados no mundo.",
      value: 140,
      studyTime: 60, // 1 minuto de estudo
      pages: [
        {
          chapter: "Classificação Mineral",
          title: "Rochas, Seixos e Minérios",
          subtitle: "A Estrutura Mineral das Montanhas e Cavernas",
          content: `🪨 PEDRA COMUM & SEIXOS:
Abundantes na orla de rios e encostas. Matéria-prima de machados, pontas de picareta e alicerces.

⛏️ MINÉRIO DE FERRO & LINGOTES:
Rochas com veios avermelhados profundos. Após fusão na forja, geram barras metálicas indispensáveis para espadas e armaduras pesadas.

🟡 PEPITAS DE OURO:
Raras e preciosas, encontradas em leitos de cascalho e filões subterrâneos. Usadas em joias, braceletes mágicos e trocas com mercadores.`,
          flavor: "A dureza da pedra mede a paciência do explorador.",
        },
        {
          chapter: "Classificação Vegetal",
          title: "Árvores, Fibras e Resinas",
          subtitle: "A Riqueza Viva dos Biomas Florestais",
          content: `🪵 GALHOS DE CARVALHO & CEDRO:
Colhidos das copas caídas. Servem como cabos de armas, lenha de fogueiras e sustentação de abrigos.

🌿 FIBRAS VEGETAIS & LINHO:
Fios tenazes colhidos nas campinas. Base para cordas, linhas de pesca, arcos e roupas leves de combate.

🔥 RESINA & SEIVA INFLAMÁVEL:
Exsudada de troncos de pinheiro. Extremamente pegajosa e combustível, é o coração das tochas acesas.`,
          flavor: "Sem a fibra e o galho, o metal não teria cabo para ser empunhado.",
        },
        {
          chapter: "Classificação de Caça",
          title: "Couros, Penas e Matérias Animais",
          subtitle: "Despojos Coletados da Fauna Silvestre",
          content: `🥩 CARNE DE CAÇA:
Alimento nobre obtido de cervos e coelhos. Fornece energia quando assada na fogueira.

🪶 PENAS DE PÁSSARO:
Coletadas nos ninhos e margens. Emprestam leveza a flechas e botas de agilidade.

🧪 GOSMA DE SLIME:
Fluido viscoso e translúcido dos gelatinosos dos pântanos. Elemento essencial para poções de vitalidade e chicotes elásticos.`,
          flavor: "Honre a caça aproveitando da carne ao couro curtido.",
        },
        {
          chapter: "Classificação Aquática",
          title: "Peixes, Argilas e Algas",
          subtitle: "Os Tesouros das Margens e Lagoas Naturais",
          content: `🧱 ARGILA ÚMIDA:
Barro maleável das margens rasas. Moldável em tigelas, caldeirões e fornos cúpula.

🐟 PEIXES DE ÁGUA DOCE:
Lambaris, trutas e cascudos que nadam nos riachos. Alimento de digestão rápida e sabor suave.

💧 ÁGUA FRESCA CRISTALINA:
Coletada em recipientes cerâmicos. Alivia o calor, restaura vigor e integra receitas de caldos nobres.`,
          flavor: "A água é a mãe de toda a vida nas terras sem fim.",
        },
      ],
    },

    // 8. LIVRO DE GEOGRAFIA DE BIOMAS E BESTIÁRIO DE CRIATURAS
    geografia_biomas: {
      type: "book",
      id: "item_livro_geografia_biomas",
      learningType: "mapas",
      category: "mapas",
      name: "Atlas Geográfico dos Biomas & Bestiário Silvestre",
      shortTitle: "Atlas dos Biomas & Bestiário",
      author: "Cartógrafo Estrabão de Amásia",
      coverColor: "#0f766e", // Verde azulado / Teal oceânico
      accentColor: "#2dd4bf",
      icon: "🗺️",
      rarity: "raro",
      description: "Atlas detalhado sobre florestas temperadas, desertos com oásis, pântanos brumosos, montanhas nevadas e hábitos dos lobos, cervos, slimes e monstros.",
      value: 190,
      studyTime: 60, // 1 minuto de estudo
      pages: [
        {
          chapter: "Atlas — Bioma Floresta",
          title: "As Florestas Temperadas & Bosques Antigos",
          subtitle: "O Berço da Vida e das Primeiras Expedições",
          content: `🌲 CARACTERÍSTICAS:
Cobertura densa de carvalhos, bétulas e pinheiros centenários. O clima é ameno e os solos são úmidos, repletos de cogumelos, flores e gravetos caídos.

🐇 FAUNA HABITUAL:
Coelhos velozes que saltam entre os arbustos e Cervos nobres de galhadas majestosas. Predadores como Lobos cinzentos caçam em matilhas durante o crepúsculo.

⚠️ PONTOS DE ATENÇÃO:
Evite caminhar desarmado à noite: a copa das árvores esconde slimes vorazes que caem das folhagens.`,
          flavor: "O som do vento nas folhas é o melhor guia para encontrar riachos.",
        },
        {
          chapter: "Atlas — Bioma Deserto & Oásis",
          title: "As Areias Escaldantes & Oásis Cristalinos",
          subtitle: "Onde o Sol Racha as Pedras e a Água é Ouro Puro",
          content: `🏜️ CARACTERÍSTICAS:
Dunas infinitas de areia dourada e ventos quentes. Durante o dia, a stamina se esgota rapidamente sob a insolação intensa.

🌴 OS OÁSIS OCULTOS:
Pontos preciosos no deserto guardam lagoas cristalinas cercadas de tamareiras e palmeiras verdes. Neles é possível saciar a sede e recuperar toda a energia.

⚠️ PONTOS DE ATENÇÃO:
Escorpiões gigantes e serpentes das dunas camuflam-se na areia e golpeiam com pinças colossais e cauda demolidora.`,
          flavor: "Carregue sempre dois recipientes cheios de água antes de entrar no deserto.",
        },
        {
          chapter: "Atlas — Pântanos & Mangues",
          title: "Os Brejos Sombrios das Brumas",
          subtitle: "Águas Turvas e Criaturas Gelatinosas",
          content: `🌾 CARACTERÍSTICAS:
Águas rasas lamacentas cobertas por névoa densa. A locomoção é mais lenta e exige botas reforçadas para evitar afundar no lodo.

🧪 HABITANTES:
Slimes de todas as cores proliferam nos brejos, alimentando-se da matéria em decomposição. Também habitam aranhas gigantes tecedoras de teias pegajosas.

⚠️ PONTOS DE ATENÇÃO:
Use tochas acessas: a luz dispersa a névoa e reduz a agressividade das criaturas rastejantes.`,
          flavor: "Fonte inesgotável de argila nobre e fungos medicinais raros.",
        },
        {
          chapter: "Atlas — Picos Nevados",
          title: "As Montanhas Gélidas do Vento Cortante",
          subtitle: "O Domínio do Gelo Eterno e das Alturas",
          content: `❄️ CARACTERÍSTICAS:
Picos rochosos cobertos de neve espessa e tempestades de gelo. O frio constante drena a energia caso o viajante não esteja com roupas aquecidas ou tochas.

🐺 FAUNA HABITUAL:
Lobos brancos da neve, com pelagem espessa e mordida devastadora. Corujas noturnas e cabras montesas ágeis.

⚠️ PONTOS DE ATENÇÃO:
Nunca suba as cordilheiras sem uma fogueira no inventário ou caldos aquecidos na mochila.`,
          flavor: "O ar rarefeito revela minérios raros em veios expostos pelo gelo.",
        },
        {
          chapter: "Bestiário — Criaturas Silvestres",
          title: "Hábitos do Lobo, Cervo, Coelho e Slimes",
          subtitle: "Guia Prático de Caça e Defesa Pessoal",
          content: `🐺 LOBO SELVAGEM:
Predador agressivo de visão noturna. Circunda o jogador antes do bote. O golpe de espada no momento do salto interrompe seu ataque.

🦌 CERVO NOBRE:
Criatura pacífica e assustadiça. Foge ao menor ruído de passos. Requer aproximação lenta e ataque surpresa para coleta de carne nobre.

🟢 SLIMES GELATINOSOS:
Massas pulsantes de gosma verde, azul ou vermelha. Dividem-se ao sofrerem certos impactos. Seu núcleo fornece a valiosa Gosma de Slime para elixires.`,
          flavor: "Conhecer a presa é metade da vitória na caçada.",
        },
      ],
    },
  };

  // Helper para buscar dados de um livro ou pergaminho a partir de seu item ou id
  function getBookOrScrollData(itemOrId) {
    if (!itemOrId) return null;
    const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id || itemOrId.typeId || "";
    
    // Procura por ID exato ou chave
    if (BOOKS_AND_SCROLLS_DB[id]) return BOOKS_AND_SCROLLS_DB[id];

    for (const key in BOOKS_AND_SCROLLS_DB) {
      const entry = BOOKS_AND_SCROLLS_DB[key];
      if (entry.id === id) return entry;
    }

    // Heurística pelo nome ou id
    const str = (typeof itemOrId === "string" ? itemOrId : itemOrId.name || itemOrId.id || "").toLowerCase();
    if (str.includes("runic") || str.includes("rúnic") || str.includes("misterio") || str.includes("mistério")) {
      return BOOKS_AND_SCROLLS_DB.pergaminho_runico_misterio;
    }
    if (str.includes("culinaria_2") || str.includes("culinária — volume ii") || str.includes("volume ii")) {
      return BOOKS_AND_SCROLLS_DB.culinaria_vol2;
    }
    if (str.includes("culinaria") || str.includes("culinária") || str.includes("volume i")) {
      return BOOKS_AND_SCROLLS_DB.culinaria_vol1;
    }
    if (str.includes("ferramenta") || str.includes("primitiv")) {
      return BOOKS_AND_SCROLLS_DB.ferramentas_primitivas;
    }
    if (str.includes("arma") || str.includes("equipamento")) {
      return BOOKS_AND_SCROLLS_DB.armas_e_equipamentos;
    }
    if (str.includes("geografia") || str.includes("bioma") || str.includes("bestiario") || str.includes("bestiário")) {
      return BOOKS_AND_SCROLLS_DB.geografia_biomas;
    }
    if (str.includes("catalogo") || str.includes("catálogo") || str.includes("recurso")) {
      return BOOKS_AND_SCROLLS_DB.catalogo_itens;
    }
    if (str.includes("basico") || str.includes("básico") || str.includes("construcao") || str.includes("construção")) {
      return BOOKS_AND_SCROLLS_DB.itens_basicos;
    }

    return null;
  }

  // Retorna todos os livros e pergaminhos que podem ser estudados e arquivados no inventário
  // Exclui expressamente o pergaminho de runas ancestrais (que necessita de sistema futuro de decifração)
  function getAllStudyableBooks() {
    const list = [];
    for (const key in BOOKS_AND_SCROLLS_DB) {
      const entry = BOOKS_AND_SCROLLS_DB[key];
      // Ignora indecifráveis (runas)
      if (entry.isUndecipherable || entry.learningType === "runas") continue;
      list.push({
        key,
        ...entry,
      });
    }
    return list;
  }

  // Cria um objeto de item completo para inventário/mochila a partir de chave, id ou item
  function createItem(keyOrId) {
    if (!keyOrId) return null;
    const data = getBookOrScrollData(keyOrId);
    const uniqueSuffix = Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);

    if (data) {
      const isScroll = data.type === "scroll";
      return {
        id: `${data.id || "item_livro_" + keyOrId}_${uniqueSuffix}`,
        typeId: data.id || keyOrId,
        bookKey: keyOrId,
        name: data.name,
        shortTitle: data.shortTitle || data.name,
        categoryType: "consumable",
        isEquippable: false,
        rarity: data.rarity || (isScroll ? "comum" : "incomum"),
        value: data.value || (isScroll ? 100 : 130),
        stackCount: 1,
        maxStack: 1,
        isStackable: false,
        icon: data.icon || (isScroll ? "📜" : "📖"),
        color: data.coverColor || data.accentColor || (isScroll ? "#facc15" : "#f59e0b"),
        description: data.description || (isScroll ? "Pergaminho antigo com ensinamentos. [Ler] para desenrolar." : "Tomo antigo encadernado. [Ler] para folhear."),
        studyTime: data.studyTime || 60,
        recipeIds: Array.isArray(data.recipeIds) ? [...data.recipeIds] : [],
        learningType: data.learningType || data.category || "receitas",
        isUndecipherable: Boolean(data.isUndecipherable),
      };
    }

    // Fallbacks para nomes genéricos das estantes e suportes de pergaminhos
    const str = String(keyOrId).toLowerCase();
    const isScroll = str.includes("scroll") || str.includes("pergaminho") || str.includes("cartografia") || str.includes("forja") || str.includes("alquimia");

    let fallbackName = isScroll ? "Pergaminho de Papiro Antigo" : "Tomo Antigo Preservado";
    let fallbackDesc = isScroll ? "Pergaminho preservado com antigas escrituras. [Ler] para desenrolar." : "Tomo clássico preservado nas ruínas. [Ler] para folhear.";
    let fallbackColor = isScroll ? "#facc15" : "#818cf8";
    let fallbackIcon = isScroll ? "📜" : "📖";

    if (str.includes("botanica") || str.includes("botânica")) {
      fallbackName = "Tratado de Botânica & Ervas Raras";
      fallbackDesc = "Manuscrito ilustrado sobre ervas medicinais, raízes comestíveis e seivas da floresta. [Ler] para folhear.";
      fallbackColor = "#10b981";
      fallbackIcon = "🌿";
    } else if (str.includes("estrategia") || str.includes("estratégia")) {
      fallbackName = "Manual de Estratégia & Táticas de Caça";
      fallbackDesc = "Pergaminho tático sobre o comportamento das feras e posicionamento em combate. [Ler] para folhear.";
      fallbackColor = "#f43f5e";
      fallbackIcon = "⚔️";
    } else if (str.includes("cartografia")) {
      fallbackName = "Carta Náutica & Traçado Cartográfico Antigo";
      fallbackDesc = "Pergaminho cartográfico com rotas e notas sobre os relevos do mundo. [Ler] para desenrolar.";
      fallbackColor = "#38bdf8";
      fallbackIcon = "🗺️";
    } else if (str.includes("alquimia")) {
      fallbackName = "Pergaminho de Princípios Alquímicos";
      fallbackDesc = "Papiro antigo descrevendo reações de essências, óleos e extratos naturais. [Ler] para desenrolar.";
      fallbackColor = "#a855f7";
      fallbackIcon = "⚗️";
    }

    return {
      id: `item_${isScroll ? "pergaminho" : "livro"}_${keyOrId}_${uniqueSuffix}`,
      typeId: `item_${isScroll ? "pergaminho" : "livro"}_${keyOrId}`,
      bookKey: keyOrId,
      name: fallbackName,
      shortTitle: fallbackName,
      categoryType: "consumable",
      isEquippable: false,
      rarity: "raro",
      value: 120,
      stackCount: 1,
      maxStack: 1,
      isStackable: false,
      icon: fallbackIcon,
      color: fallbackColor,
      description: fallbackDesc,
      studyTime: 60,
      recipeIds: [],
      learningType: isScroll ? (str.includes("cartografia") ? "mapas" : "receitas") : (str.includes("botanica") ? "catalogo" : "receitas"),
    };
  }

  G.BooksAndScrolls = {
    DB: BOOKS_AND_SCROLLS_DB,
    getData: getBookOrScrollData,
    createItem: createItem,
    getAllStudyableBooks: getAllStudyableBooks,
  };
})(window.Game);
