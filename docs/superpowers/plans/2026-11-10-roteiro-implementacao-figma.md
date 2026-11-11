# Refinar roteiro Figma para Expo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o roteiro atual em um índice e três histórias detalhadas, uma para cada fase de implementação do protótipo Figma no app Expo.

**Architecture:** Manter o arquivo `0-implementar-figma.md` como ponto de entrada e dividir os detalhes em documentos separados para fundação visual, componentes reutilizáveis e telas/navegação. Cada tarefa aponta para a estrutura/interação no `App.tsx`, aparência no `index.css` e descreve o equivalente a implementar no app Expo com React Native e NativeWind.

**Tech Stack:** Markdown; protótipo de referência em React/DOM e CSS; app de destino em Expo, React Native, Expo Router e NativeWind.

**Spec:** `docs/superpowers/specs/2026-11-10-refinar-roteiro-figma-expo-design.md`

## Global Constraints

- A aplicação ativa está em `gym-app/`; `UI_example_figma/` é somente referência visual e funcional.
- O app usa Expo Router e deve manter código compartilhado fora de `src/app/`, conforme `gym-app/AGENTS.md`.
- Cada tarefa deve citar `App.tsx` para estrutura, conteúdo e interação e `index.css` para estilo, incluindo caminho, linhas e identificador (componente ou seletor).
- O implementador deve converter a referência web para equivalentes de React Native no Expo e aplicar estilos com NativeWind; HTML, DOM e CSS não devem ser copiados diretamente para telas nativas.
- Linhas são âncoras mutáveis; verificar intervalos atuais e incluir o nome do componente/seletor.
- Se a descrição de uma tarefa divergir do protótipo atual ou sua referência apontar para o componente/seletor errado, perguntar à pessoa usuária como proceder e aguardar orientação antes de implementar a tarefa afetada.
- Preservar os limites demonstrativos do produto: sem backend, autenticação real, cobrança, publicidade integrada ou expansão para persistência offline, descanso real, cargas e histórico por exercício.

## Review Focus

- Linhas deslocadas no protótipo podem apontar para o trecho errado; cada tarefa identifica também o componente ou seletor para localização por busca.
- O protótipo mistura estrutura DOM, handlers web e CSS; cada tarefa explicita a conversão RN/Expo/NativeWind e não prescreve cópia literal.
- Componentes de tela podem ser confundidos com itens funcionais já definidos em histórias MVP; as tarefas limitam-se ao fluxo e ao estado demonstrativos descritos no protótipo.
- O Figma usa layout responsivo web; critérios das histórias devem preservar uso em telas estreitas e largas sem carregar regras DOM/CSS como requisitos de implementação.
- Os cenários podem transformar estados demonstrativos em requisitos de integração real; os BDD devem explicitar os limites de dados locais/demonstrativos.

---

### Task 1: Converter o roteiro original em índice

**Files:**
- Modify: `histories/MVP/0-implementar-figma.md`

**Interfaces:**
- Consumes: decisões de escopo e arquivos definidos em `docs/superpowers/specs/2026-11-10-refinar-roteiro-figma-expo-design.md`.
- Produces: ponto de entrada com objetivo, dependências e links relativos para os três arquivos de fase.

- [x] **Step 1: Mapear os tópicos do roteiro atual às fases**

  Confirmar que tema/fontes/imagens estão na fase 1; componentes compartilhados na fase 2; telas, fluxo e navegação na fase 3. Manter premissas e critérios globais no índice somente quando forem compartilhados pelas três fases.

- [x] **Step 2: Atualizar o índice e links relativos**

  Preservar resumo e premissas globais, remover a repetição das listas detalhadas de tarefas e incluir links para os nomes exatos dos três documentos novos.

- [x] **Step 3: Conferir navegação e cobertura**

  Verificar que os três links resolvem e que cada item de alto nível do roteiro original aparece em exatamente uma fase ou está explicitamente marcado como requisito compartilhado.

### Task 2: Escrever a história da fase 1 — fundação visual

**Files:**
- Create: `histories/MVP/6-Implementação Figma - Fase 1 Fundação Visual.md`
- Reference: `UI_example_figma/src/App.tsx`
- Reference: `UI_example_figma/src/index.css`
- Reference: `gym-app/AGENTS.md`

**Interfaces:**
- Consumes: escopo e limites do índice da Task 1.
- Produces: tarefas para tokens/tema claro e escuro, fontes e imagem local, com referências verificáveis e critérios de aceite.

- [x] **Step 1: Localizar as fontes da fundação no protótipo**

  Anotar seletores e linhas dos tokens globais e modo escuro em `index.css` (incluindo `:root` e `.theme-dark`), importação de fontes e imagem do hero. Em `App.tsx`, indicar os usos relevantes do tema, do hero e de tipografia. Confirmar os intervalos com `nl -ba` ao redigir.

- [x] **Step 2: Especificar tarefas de tema, tipografia e recursos locais**

  Para cada tarefa, incluir intenção, trechos-fonte com caminho/linhas/nome do seletor ou componente, resultado a converter para tokens e classes NativeWind em React Native/Expo, e dependências. Não fixar solução de API Expo sem base na versão do app; orientar a consulta ao `package.json` e documentação compatível antes de implementação nativa.

- [x] **Step 3: Incluir aceite observável e validar o documento**

  Cobrir tema claro/escuro, legibilidade, uso consistente de fontes e carregamento local da imagem. Garantir que cada tarefa tem critério verificável e que referências incluem ambos os arquivos quando há estrutura e estilo.

### Task 3: Escrever a história da fase 2 — componentes reutilizáveis

**Files:**
- Create: `histories/MVP/7-Implementação Figma - Fase 2 Componentes Reutilizáveis.md`
- Reference: `UI_example_figma/src/App.tsx`
- Reference: `UI_example_figma/src/index.css`
- Reference: `gym-app/AGENTS.md`

**Interfaces:**
- Consumes: tokens, fontes e recursos previstos na fase 1.
- Produces: catálogo de tarefas de componentes compartilhados, com entradas/estados de referência e critérios de aceite independentes.

- [x] **Step 1: Mapear componentes e referências JSX/CSS**

  Para cada item listado na fase 2 original — ícones/botões, cabeçalho/navegação inferior, títulos/rótulos, cartões/linhas de exercício, heatmap, banners, campos/formulários, progresso/marcos, perfil/controles, modal inferior e cabeçalho/controles de treino ativo — localizar componente ou trecho JSX em `App.tsx` e seletores correlatos em `index.css`. Registrar linhas atuais e nomes estáveis.

- [x] **Step 2: Detalhar as tarefas por componente ou família coesa**

  Agrupar itens somente quando compartilham função e estados; descrever props/estados visíveis para implementação futura sem inventar API de código. Instruir conversão para equivalentes nativos (por exemplo, controles de formulário e superfícies) e classes NativeWind. Registrar dependência da fase 1 e a validação iOS, Android e web já exigida pelo roteiro.

- [x] **Step 3: Incluir aceites para variantes e estados**

  Cobrir estado ativo/inativo, claro/escuro, habilitado/desabilitado, vazio/preenchido e conteúdo longo quando aplicáveis. Usar BDD somente para interação própria; não repetir cenários completos de telas que pertencem à fase 3.

- [x] **Step 4: Conferir correspondência das referências**

  Verificar toda tarefa contra os nomes dos componentes/selectores e linhas atuais, incluindo os botões do exemplo (`App.tsx:384-386`, `.primary` e `.full` em `index.css:51-54`) como padrão de citação.

### Task 4: Escrever a história da fase 3 — telas e navegação

**Files:**
- Create: `histories/MVP/8-Implementação Figma - Fase 3 Telas e Navegação.md`
- Reference: `UI_example_figma/src/App.tsx`
- Reference: `UI_example_figma/src/index.css`
- Reference: `gym-app/AGENTS.md`

**Interfaces:**
- Consumes: componentes da fase 2 e tipagem compartilhada de treino/exercício prevista no roteiro.
- Produces: tarefas de composição de telas e conexão dos fluxos Início, Treinos, Progresso, Perfil e treino ativo.

- [x] **Step 1: Mapear telas e interações do protótipo**

  Anotar os blocos JSX da tela inicial, listagem/início/criação de treino, progresso, estados demonstrativos de perfil e execução ativa, além dos handlers/estado de abas e modal. Identificar seletores CSS por tela e validar números de linha no momento da escrita.

- [x] **Step 2: Especificar tarefas por fluxo de tela**

  Detalhar composição, dados demonstrativos, ações, estados vazios/ativos e navegação Expo Router conforme os limites já estabelecidos. Explicitar que componentes DOM/CSS serão reexpressos em React Native e NativeWind. Separar apresentação e interação visual demonstrativa de persistência/integrações cobertas em outras histórias.

- [x] **Step 3: Escrever cenários BDD e critérios de aceite**

  Cobrir acesso às quatro abas e perfil, criação demonstrativa de rotina, abertura/fechamento do fluxo ativo, avanço/conclusão visual, alternância de tema e estados de conta demonstrativos. Garantir que nenhum cenário implique autenticação, cobrança, anúncios reais ou persistência offline.

- [x] **Step 4: Conferir dependências e cobertura**

  Relacionar cada tela às tarefas de componentes necessárias e assegurar que cada interação do escopo original tenha um cenário ou critério explícito, inclusive responsividade em telas estreitas e largas.

### Task 5: Revisar o conjunto e as referências

**Files:**
- Review: `histories/MVP/0-implementar-figma.md`
- Review: `histories/MVP/6-Implementação Figma - Fase 1 Fundação Visual.md`
- Review: `histories/MVP/7-Implementação Figma - Fase 2 Componentes Reutilizáveis.md`
- Review: `histories/MVP/8-Implementação Figma - Fase 3 Telas e Navegação.md`

**Interfaces:**
- Consumes: os quatro documentos redigidos nas Tasks 1–4.
- Produces: conjunto coerente, navegável e rastreável até o protótipo.

- [x] **Step 1: Revisar cobertura contra o roteiro aprovado**

  Comparar tarefas e premissas com o design aprovado e o arquivo original; corrigir itens ausentes, repetidos ou que ampliem o escopo.

- [x] **Step 2: Conferir referências e instruções de conversão**

  Reabrir os trechos citados em `App.tsx` e `index.css`, ajustar linhas e nomes e confirmar que todas as tarefas orientam conversão para Expo/React Native/NativeWind.

- [x] **Step 3: Conferir links, idioma e modelo**

  Verificar links relativos, português consistente e presença das seções de histórias de usuário, tarefas técnicas, BDD aplicável e critérios de aceite segundo o modelo citado.

- [x] **Step 4: Registrar validação documental**

  Fazer revisão textual e de links; não executar lint/typecheck do app, pois esta entrega altera somente documentação.
