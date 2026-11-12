# Fase 2 — Componentes Reutilizáveis

## História de usuário

- HU-01: Como pessoa usuária do app, quero reconhecer controles e informações recorrentes em diferentes telas para navegar e entender meus treinos com consistência.
- HU-02: Como implementador, quero componentes reutilizáveis com estados visíveis bem definidos para compor as telas da fase 3 sem duplicar apresentação.

## Escopo e dependências

Depende dos tokens, fontes e recurso local da [Fase 1 — Fundação Visual](6-Implementação%20Figma%20-%20Fase%201%20Fundação%20Visual.md). Estes são componentes para uso compartilhado, não a especificação dos fluxos completos de tela. A referência web deve ser convertida para React Native no Expo e estilos NativeWind; não copiar HTML, DOM nem CSS. Manter código compartilhado fora de `gym-app/src/app/`, conforme `gym-app/AGENTS.md`. Validar o uso em iOS, Android e web.

Antes de implementar cada tarefa, confira as referências no protótipo atual. Se a descrição divergir do protótipo ou uma referência indicar o seletor/componente errado, pergunte à pessoa usuária como proceder e aguarde a orientação antes de implementar a tarefa afetada.

## Tarefas técnicas

### T2.1 — Criar ícones e botões com variantes

**Origem na referência:** `UI_example_figma/src/App.tsx:3-54`, tipos `IconName`, mapa `paths` e componente `Icon`; `UI_example_figma/src/App.tsx:384-386`, botão “Iniciar treino”; `UI_example_figma/src/index.css:51-54`, seletores `.primary` e `.full`; `UI_example_figma/src/index.css:78`, `.round-add`; `UI_example_figma/src/index.css:87`, `.card-arrow`; `UI_example_figma/src/index.css:152-164`, `.secondary`, `.icon-button` e `.icon-button.muted`.

**Resultado esperado em Expo:** componentes nativos de ícone e botão com variantes de ação primária, secundária, redonda e apenas ícone; acomodar rótulo, ícone, largura e acessibilidade sem fixar API antes de consultar dependências do app.

**Dependência:** fase 1.

**Aceite:** variantes habilitadas, desabilitadas e pressionadas são distinguíveis; rótulos longos não quebram o controle; botões de ícone oferecem nome acessível; aparências funcionam nos dois temas e nas três plataformas.

### T2.2 — Criar cabeçalho e navegação inferior

**Origem na referência:** `UI_example_figma/src/App.tsx:350-356`, `.topbar`, `.brand` e `.profile`; `UI_example_figma/src/App.tsx:560-575`, `.bottom-nav` e estado ativo; `UI_example_figma/src/index.css:22-27`, `.topbar`, `.brand` e `.profile`; `UI_example_figma/src/index.css:70-73`, `.bottom-nav` e botão ativo.

**Resultado esperado em Expo:** superfícies nativas reutilizáveis para a marca/atalho de perfil e navegação com quatro destinos, ícones, rótulos e indicação do destino ativo. A conexão das rotas é detalhada na fase 3.

**Dependência:** T2.1 e fase 1.

**Aceite:** destino ativo é reconhecível sem depender só de cor; rótulos e alvos de toque cabem em larguras estreitas; estados claro/escuro e áreas seguras são atendidos nas plataformas-alvo.

### T2.3 — Criar títulos, rótulos e cabeçalhos de seção

**Origem na referência:** `UI_example_figma/src/App.tsx:363-374`, `.eyebrow`, `.section-heading` e `.duration`; `UI_example_figma/src/App.tsx:407-409`, `.page-title` e `.page-subtitle`; `UI_example_figma/src/index.css:31-43`, `.eyebrow` e `.section-heading`; `UI_example_figma/src/index.css:74-77`, `.page-section`, `.page-title` e `.page-subtitle`.

**Resultado esperado em Expo:** elementos tipográficos reutilizáveis para rótulo, título, subtítulo, cabeçalho e metadado de duração, usando tokens da fase 1.

**Dependência:** fase 1.

**Aceite:** variantes claras/escuras e hierarquia são consistentes; textos longos quebram sem sobrepor ações ou metadados; tamanho e contraste continuam legíveis nas larguras suportadas.

### T2.4 — Criar cartões e linhas de exercícios/treinos

**Origem na referência:** `UI_example_figma/src/App.tsx:56-62`, tipo `Workout`; `UI_example_figma/src/App.tsx:375-382`, linhas `.exercise-preview`; `UI_example_figma/src/App.tsx:410-421`, `.workout-card` e `.workout-info`; `UI_example_figma/src/index.css:44-50`, `.exercise-preview` e `.exercise-number`; `UI_example_figma/src/index.css:79-87`, `.workout-list`, `.workout-card`, `.workout-index`, `.workout-info` e `.card-arrow`.

**Resultado esperado em Expo:** cartões/linhas reutilizáveis para resumo de rotina ou exercício, com título, foco, duração, séries/repetições, ordem e ação opcional.

**Dependência:** T2.1, T2.3 e fase 1.

**Aceite:** dados ausentes ou nomes extensos não quebram a estrutura; metadados permanecem associados ao item correto; estados com e sem ação ficam visualmente claros nos dois temas.

### T2.5 — Criar grade anual de atividade e legenda

**Origem na referência:** `UI_example_figma/src/App.tsx:151-182`, componente `Heatmap`; `UI_example_figma/src/index.css:58-64`, seletores `.heatmap-shell`, `.heatmap-months`, `.heatmap`, `.heat-cell`, `.level-1` a `.level-4` e `.heatmap-legend`.

**Resultado esperado em Expo:** representar os dias e três níveis visuais com componentes nativos, legenda e adaptação para a largura disponível: 0 sem atividade em cor neutra, 1 atividade em verde `#4b9a60` e 2 ou mais atividades em verde `#1f6a46`. O conjunto da grade é determinístico e demonstrativo, não histórico persistido.

**Ajuste aprovado:** reduzir a escala para três níveis (0, 1 e 2 ou mais atividades), removendo apenas o tom `#cbe5b0`. Os verdes devem ser tokens do tema, preservados nos modos claro e escuro. A legenda, os dias e os rótulos acessíveis devem usar a mesma escala.

**Dependência:** fase 1.

**Aceite:** todos os níveis e a legenda são distinguíveis nos temas claro/escuro; a grade mantém associação temporal e pode ser percorrida/consultada em tela estreita sem esconder a legenda.

### T2.6 — Criar banner promocional demonstrativo

**Origem na referência:** `UI_example_figma/src/App.tsx:105-149`, dados `adContent` e componente `AdBanner`; `UI_example_figma/src/index.css:102-115`, seletores `.ad-banner`, `.ad-meta`, `.ad-body`, `.ad-copy` e `.ad-brand`.

**Resultado esperado em Expo:** componente visual com identificação explícita de publicidade, marca, texto e ação ilustrativa, sem SDK, rastreamento, compra nem integração de anúncios.

**Dependência:** T2.1 e fase 1.

**Aceite:** conteúdo demonstrativo continua identificável como tal; textos maiores e rótulos de ação cabem sem cortes; contraste se mantém nos temas claro/escuro.

### T2.7 — Criar campos, ações de formulário e linhas adicionadas

**Origem na referência:** `UI_example_figma/src/App.tsx:226-259`, campos e lista de exercícios em `CreateWorkout`; `UI_example_figma/src/App.tsx:481-505`, campos de entrada em `App`; `UI_example_figma/src/index.css:165-174`, `.field`, `.input-action` e `.new-exercise`.

**Resultado esperado em Expo:** campos nativos com rótulo, placeholder, foco/erro/desabilitado quando aplicável, ação adjacente e linha de item adicionado. Teclado, foco e submissão devem seguir padrões da plataforma; não usar elementos HTML.

**Dependência:** T2.1 e fase 1.

**Aceite:** estados vazio e preenchido são claros; rótulos permanecem associados aos campos; conteúdo longo e teclado não ocultam o contexto ou a ação principal; tema escuro oferece contraste adequado.

### T2.8 — Criar cartões de progresso e marcos

**Origem na referência:** `UI_example_figma/src/App.tsx:432-444`, `.progress-hero`, `.progress-card` e `.milestone`; `UI_example_figma/src/index.css:88-101`, seletores correspondentes.

**Resultado esperado em Expo:** superfícies reutilizáveis para métricas, tendência, visualização anual e próximo marco, recebendo dados demonstrativos da tela.

**Dependência:** T2.3, T2.5 e fase 1.

**Aceite:** métricas e unidades permanecem associadas; valores e descrições maiores não se sobrepõem; cartões ficam legíveis nos dois temas e em tela estreita.

### T2.9 — Criar cartões de perfil e controles de tema/plano

**Origem na referência:** `UI_example_figma/src/App.tsx:453-469`, `.theme-setting`; `UI_example_figma/src/App.tsx:471-558`, estados de conta e plano; `UI_example_figma/src/index.css:117-157`, seletores `.theme-setting`, `.theme-toggle`, `.account-card`, `.plan-card`, `.plan-badge` e `.account-actions`.

**Resultado esperado em Expo:** compor superfícies de preferência de tema, resumo da conta e apresentação de plano Free/Premium demonstrativos, com estados acessíveis e sem autenticação ou cobrança real.

**Dependência:** T2.1, T2.7 e fase 1.

**Aceite:** tema ligado/desligado é anunciado e visível; plano atual e recursos indisponíveis são distinguíveis; estados logged-out, Free e Premium demonstrativos mantêm consistência visual; textos longos não escondem controles.

### T2.10 — Criar superfície modal inferior

**Origem na referência:** `UI_example_figma/src/App.tsx:213-263`, estrutura do componente `CreateWorkout`; `UI_example_figma/src/index.css:158-164`, `.overlay`, `.sheet`, `.sheet-handle` e `.sheet-heading`.

**Resultado esperado em Expo:** superfície nativa apresentada a partir da borda inferior, com conteúdo rolável, ação de fechar e comportamento de área segura apropriado. O fluxo e validações de criação pertencem à fase 3.

**Dependência:** T2.1, T2.3, T2.7 e fase 1.

**Aceite:** pode ser aberta/fechada pela ação prevista sem fechar ao interagir com o conteúdo; conteúdo longo continua alcançável por rolagem; aparência adapta-se às alturas e larguras suportadas.

### T2.11 — Criar cabeçalho, progresso e controles de treino ativo

**Origem na referência:** `UI_example_figma/src/App.tsx:265-307`, componente `ActiveWorkout`; `UI_example_figma/src/index.css:175-197`, `.active-screen`, `.active-header`, `.active-progress`, `.prescription`, `.sets`, `.set` e `.workout-next`.

**Resultado esperado em Expo:** conjunto de apresentação para nome/status da sessão, progresso, prescrição, séries e ação de avanço/finalização. Valores fixos da referência continuam demonstrativos; não implementar temporizador real, registro de carga nem histórico.

**Dependência:** T2.1, T2.3, T2.4 e fase 1.

**Aceite:** estados de série concluída e pendente são identificáveis; progresso e exercício atual mantêm relação clara; controles funcionam em alvos de toque adequados nos dois temas e nas três plataformas.

## BDD de componentes

```gherkin
# language: pt-br
Funcionalidade: Usar controles e componentes compartilhados

  Cenário: Identificar a ação atualmente selecionada na navegação
    Dado que a navegação inferior mostra quatro destinos
    Quando um destino estiver selecionado
    Então seu ícone e rótulo devem indicar o estado ativo
    E os demais destinos devem continuar identificáveis

  Cenário: Mostrar um campo vazio e preenchido
    Dado que um formulário usa os campos compartilhados
    Quando um campo estiver vazio ou receber texto
    Então seu rótulo, valor e estado de foco devem permanecer legíveis

  Cenário: Consultar a legenda da grade anual em tela estreita
    Dado que a grade anual excede a largura disponível
    Quando eu percorrer a área da grade
    Então os níveis e a legenda devem continuar compreensíveis
```

## Critério de conclusão da fase

Os componentes necessários às composições da fase 3 estão disponíveis, cobrem variantes e estados descritos e foram conferidos em iOS, Android e web. Os fluxos completos continuam especificados na fase 3.
