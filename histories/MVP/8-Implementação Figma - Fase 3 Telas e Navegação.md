# Fase 3 — Telas e Navegação

## História de usuário

- HU-01: Como pessoa usuária do app, quero acessar Início, Treinos, Progresso e Perfil para consultar informações demonstrativas e navegar pelos fluxos apresentados.
- HU-02: Como pessoa usuária, quero criar uma rotina e percorrer visualmente um treino para entender o fluxo do protótipo sem depender de serviços externos.

## Escopo e dependências

Depende dos componentes da [Fase 2 — Componentes Reutilizáveis](7-Implementação%20Figma%20-%20Fase%202%20Componentes%20Reutilizáveis.md) e da tipagem compartilhada de treino/exercício prevista no índice. Use Expo Router nas rotas em `gym-app/src/app/` e mantenha componentes compartilhados fora dessa pasta, conforme `gym-app/AGENTS.md`. Converta a referência web para React Native e NativeWind; não copie HTML, DOM ou CSS. Estados locais são demonstrativos e não implicam persistência offline ou integração real.

Antes de implementar cada tarefa, confira as referências no protótipo atual. Se a descrição divergir do protótipo ou uma referência indicar o componente/seletor errado, pergunte à pessoa usuária como proceder e aguarde a orientação antes de implementar a tarefa afetada.

## Tarefas técnicas

### T3.1 — Compor a tela Início

**Origem na referência:** `UI_example_figma/src/App.tsx:359-402`, bloco condicional `tab === "Início"`: hero, sequência, próximo treino, prévia, banner e atividade anual; `UI_example_figma/src/App.tsx:384-386`, ação “Iniciar treino”; `UI_example_figma/src/index.css:28-69`, `.hero`, `.next-workout`, `.exercise-preview`, `.primary`, `.year-section`, `.heatmap-shell` e `.stats-row`.

**Resultado esperado em Expo:** compor o hero com imagem local da fase 1, sequência demonstrativa, resumo do próximo treino, prévia de exercícios, banner demonstrativo e atividade anual. A ação de início abre a sessão demonstrativa correspondente.

**Dependência:** T2.1–T2.8 e T2.11 conforme componentes usados.

**Aceite:** tela inicia como destino padrão; conteúdo principal pode ser percorrido em telas estreitas e largas; o botão inicia a rotina demonstrativa mostrada; métricas e banner permanecem demonstrativos.

### T3.2 — Compor Treinos: listagem e início

**Origem na referência:** `UI_example_figma/src/App.tsx:66-103`, dados iniciais `initialWorkouts`; `UI_example_figma/src/App.tsx:405-425`, bloco `tab === "Treinos"`; `UI_example_figma/src/index.css:79-87`, `.workout-list`, `.workout-card`, `.workout-info` e `.card-arrow`; `UI_example_figma/src/index.css:245-248`, adaptação larga da lista.

**Resultado esperado em Expo:** exibir rotinas demonstrativas com foco, duração e exercícios e permitir selecionar uma para iniciar o fluxo ativo. Tipos compartilhados cobrem os dados necessários à listagem e execução.

**Dependência:** T2.1–T2.4 e T2.6.

**Aceite:** rotinas e metadados correspondem aos dados demonstrativos; a ação de uma rotina abre essa rotina; lista permanece utilizável em larguras estreitas e largas sem truncar ações.

### T3.3 — Compor Treinos: criação demonstrativa

**Origem na referência:** `UI_example_figma/src/App.tsx:184-263`, componente `CreateWorkout` (estado, inclusão de exercícios, validação e submissão); `UI_example_figma/src/App.tsx:321-325`, função `createWorkout`; `UI_example_figma/src/App.tsx:408`, botão `.round-add` que abre o modal; `UI_example_figma/src/index.css:158-174`, `.overlay`, `.sheet`, `.field`, `.input-action` e `.new-exercise`.

**Resultado esperado em Expo:** abrir/fechar a superfície inferior; inserir nome e exercícios; impedir salvamento sem nome ou exercício; salvar a rotina no estado em memória da sessão atual do app e retornar à listagem. Não persistir entre reinicializações.

**Dependência:** T2.1, T2.7 e T2.10; T3.2.

**Aceite:** campos vazios não permitem salvar; inclusão de exercício atualiza a lista visível; fechar cancela o fluxo; salvar adiciona a rotina à listagem corrente; teclado e conteúdo longo não ocultam ação ou campos em telas estreitas.

### T3.4 — Compor a tela Progresso

**Origem na referência:** `UI_example_figma/src/App.tsx:427-447`, bloco `tab === "Progresso"`: métricas, cartão de atividade, marco e banner; `UI_example_figma/src/index.css:88-101`, `.progress-hero`, `.progress-card`, `.status-pill` e `.milestone`.

**Resultado esperado em Expo:** exibir métricas, heatmap anual e próximo marco usando dados determinísticos/demonstrativos do protótipo.

**Ajuste aprovado:** reutilizar a grade da T2.5 com três níveis: 0 sem atividade, 1 atividade e 2 ou mais atividades. A referência web usa cinco níveis (0–4); essa diferença é intencional no app. Preservar a geração determinística de 364 dias, o ano demonstrativo de 2025 e a legenda e os rótulos acessíveis da escala de três níveis. Os valores de 94 treinos e 16 dias são métricas ilustrativas do protótipo, não totais calculados a partir da grade.

**Dependência:** T2.3, T2.5, T2.6 e T2.8.

**Aceite:** métricas, níveis da grade e marco têm rótulos compreensíveis; conteúdo adapta-se a telas estreitas e largas; alterações no estado de conta podem ocultar o banner conforme demonstração, sem publicidade integrada.

### T3.5 — Compor Perfil: tema e estados demonstrativos de conta

**Origem na referência:** `UI_example_figma/src/App.tsx:314-338`, estados `accountStatus`, `email`, `password`, `theme`, `login` e `logout`; `UI_example_figma/src/App.tsx:449-558`, bloco `tab === "Perfil"`; `UI_example_figma/src/index.css:117-157`, seletores `.theme-setting`, `.theme-toggle`, `.account-card`, `.plan-card` e `.account-actions`; `UI_example_figma/src/index.css:199-239`, seletor `.theme-dark` e regras descendentes para o tema escuro.

**Resultado esperado em Expo:** oferecer alternância de tema e reproduzir visualmente os estados logged-out, Free e Premium, incluindo retorno a Free e saída. Credenciais digitadas só controlam a demonstração local: não há autenticação ou cobrança real.

**Dependência:** T2.1, T2.7 e T2.9; fase 1.

**Aceite:** alternar tema atualiza a tela e mantém contraste; dados preenchidos permitem transição visual para Free; ação demonstrativa alterna para Premium e permite retornar a Free; sair retorna ao estado logged-out e limpa os campos; nenhuma ação comunica autenticação ou transação real.

### T3.6 — Compor o fluxo de treino ativo

**Origem na referência:** `UI_example_figma/src/App.tsx:265-307`, componente `ActiveWorkout` e função `complete`; `UI_example_figma/src/App.tsx:340-345`, apresentação do fluxo ativo; `UI_example_figma/src/index.css:175-197`, seletores `.active-screen`, `.active-header`, `.active-progress`, `.prescription`, `.sets`, `.set` e `.workout-next`; `UI_example_figma/src/index.css:234-239`, seletores `.theme-dark .prescription` e `.theme-dark .set` no tema escuro.

**Resultado esperado em Expo:** mostrar rotina selecionada, exercício atual, prescrição, séries e progresso; permitir concluir o exercício atual, avançar e fechar. No último exercício, a ação já é rotulada “Finalizar treino”; acioná-la atualiza o progresso visual para 100%, mas mantém a tela no último exercício. A referência não tem ação individual para alternar cada série: o primeiro item aparece apenas como estado visual demonstrativo. Séries/cargas e relógio não devem registrar carga nem iniciar temporizador real.

**Dependência:** T2.1, T2.3, T2.4 e T2.11; T3.1 ou T3.2 como ponto de entrada.

**Aceite:** rotina selecionada aparece corretamente; avançar atualiza exercício e progresso visual; concluir no último exercício leva o indicador visual a 100% e mantém a tela aberta; fechar retorna ao contexto anterior; nenhum dado vira histórico persistido.

### T3.7 — Conectar abas, perfil e rotas Expo Router

**Origem na referência:** `UI_example_figma/src/App.tsx:309-325`, estado `tab` e ação de criação; `UI_example_figma/src/App.tsx:350-356`, atalho de perfil; `UI_example_figma/src/App.tsx:560-575`, destinos e atualização de aba; `UI_example_figma/src/index.css:70-77`, navegação e conteúdo das telas.

**Resultado esperado em Expo:** implementar rotas e layout com Expo Router para Início, Treinos, Progresso e Perfil; manter indicador ativo e atalho para Perfil. O fluxo ativo e a criação devem poder ser abertos a partir dos pontos previstos, sem confundir rotas com estado persistente.

**Dependência:** T2.2 e telas T3.1–T3.6.

**Aceite:** quatro abas e atalho de perfil são alcançáveis; estado ativo corresponde à rota atual; app abre em Início; modal e treino ativo abrem/fecham sem perder o destino apropriado; navegação atende telas estreitas e largas.

## Especificações BDD

```gherkin
# language: pt-br
Funcionalidade: Navegar pelas telas demonstrativas

  Cenário: Abrir as quatro abas e o perfil pelo cabeçalho
    Dado que estou na tela Início
    Quando eu selecionar Treinos, Progresso ou Perfil na navegação
    Então a tela selecionada deve ser exibida
    E sua opção deve indicar o estado ativo
    Quando eu acionar o atalho de perfil no cabeçalho
    Então devo chegar à tela Perfil

  Cenário: Criar uma rotina apenas durante a sessão atual
    Dado que estou na tela Treinos
    Quando eu abrir a criação, informar um nome e adicionar um exercício
    E salvar a rotina
    Então ela deve aparecer na listagem atual
    E não deve ser apresentada como salva em conta ou entre reinicializações

  Cenário: Impedir salvar rotina incompleta
    Dado que estou criando uma rotina
    Quando o nome ou a lista de exercícios estiver vazio
    Então a ação de salvar deve permanecer indisponível

  Cenário: Abrir, avançar e finalizar o treino demonstrativo
    Dado que uma rotina demonstrativa está disponível
    Quando eu iniciar o treino e concluir o exercício atual
    Então o próximo exercício e o progresso visual devem ser atualizados
    Quando eu acionar “Finalizar treino” no último exercício
    Então o progresso visual deve chegar a 100%
    E a tela do último exercício deve permanecer aberta até eu fechá-la
    E nenhum temporizador real, carga ou histórico deve ser registrado

  Cenário: Fechar o treino ativo
    Dado que um treino demonstrativo está em andamento
    Quando eu acionar Fechar treino
    Então devo retornar ao contexto anterior

  Cenário: Alternar tema e estados de conta demonstrativos
    Dado que estou no Perfil
    Quando eu alternar o tema
    Então a interface deve atualizar entre claro e escuro
    Quando eu preencher os campos e confirmar a entrada demonstrativa
    Então devo ver o estado Free
    Quando eu alternar o plano demonstrativo e depois sair
    Então devo poder retornar a Free e ao estado logged-out
    E nenhuma autenticação ou cobrança real deve ocorrer
```

## Critérios de aceite da fase

- O app inicia em Início e as quatro abas e o Perfil são alcançáveis por Expo Router.
- Início, Treinos, Progresso, Perfil e treino ativo compõem os componentes da fase 2 e permanecem utilizáveis em telas estreitas e largas.
- Criação, tema, estados de conta e sessão ativa têm apenas o comportamento local/demonstrativo especificado.
- Validar visualmente e percorrer as interações em iOS, Android e web; executar `npm run lint` e `npx tsc --noEmit` em `gym-app/` durante a implementação do app.
