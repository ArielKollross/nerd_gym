# Design: detalhar e separar o roteiro de implementação do Figma

## Intenção

Refinar `histories/MVP/0-implementar-figma.md` para que cada fase da migração do protótipo `UI_example_figma` para o app Expo seja executável como uma história independente. O roteiro deve ajudar um agente a localizar a referência original, entender o comportamento esperado e recriá-lo com componentes e estilos nativos.

## Objetivos

- Criar um arquivo Markdown para cada uma das três fases atuais: fundação visual, componentes reutilizáveis e telas/navegação.
- Seguir a estrutura do modelo `histories/MVP/1-Criação de Fichas de Treino.md`: histórias de usuário, tarefas técnicas, cenários BDD quando aplicáveis e critérios de aceite.
- Em cada tarefa, indicar os arquivos e as linhas da referência web, incluindo o JSX/comportamento em `UI_example_figma/src/App.tsx` e o estilo correspondente em `UI_example_figma/src/index.css`.
- Instruir explicitamente o implementador a converter a referência web para equivalentes de React Native no Expo e aplicar estilos com NativeWind; HTML, DOM e CSS não devem ser copiados diretamente para as telas nativas.
- Tornar dependências entre tarefas e limites do escopo visíveis.

## Fora do escopo

- Implementar o app ou alterar o protótipo Figma.
- Introduzir backend, autenticação real, cobrança, anúncios integrados ou persistência além do estado demonstrativo já previsto.
- Substituir as histórias funcionais MVP existentes.

## Restrições e contexto

- A aplicação ativa está em `gym-app/`; `UI_example_figma/` é somente referência visual e funcional.
- O app usa Expo Router e deve manter código compartilhado fora de `src/app/`, conforme `gym-app/AGENTS.md`.
- As referências devem citar `App.tsx` para estrutura, conteúdo e interação e `index.css` para cores, dimensões, tipografia, estados e responsividade. Quando um elemento for puramente visual, indicar o trecho CSS pertinente.
- O exemplo do botão “Iniciar treino” é `App.tsx:384-386` e `index.css:51-54`.
- Linhas são âncoras úteis, mas podem mudar; cada citação deve também nomear a função/componente ou seletor correspondente.

## Abordagens consideradas

1. **Um arquivo para cada fase atual (escolhida).** Mantém as três fases e sua ordem de dependência, com tarefas menores dentro de cada arquivo. Atende diretamente ao pedido e conserva a visão de execução por etapa.
2. **Um arquivo para cada tela ou grupo de componentes.** Produziria mais documentos e granularidade, porém deixaria de mapear diretamente uma fase por arquivo e fragmentaria dependências que hoje estão agrupadas.

## Decisões

- Produzir exatamente três documentos de fase, preservando as fases e o escopo de alto nível existentes.
- Manter `0-implementar-figma.md` como índice/resumo com links para os três documentos, em vez de apagar o ponto de entrada do roteiro.
- Cada tarefa terá: objetivo, origem na referência (arquivo, linhas e identificador do trecho), resultado esperado em Expo/React Native/NativeWind, dependências quando houver e critérios de aceite.
- Incluir BDD para fluxos com interação ou estado; para componentes visuais sem fluxo próprio, critérios de aceite observáveis são suficientes.
- Preservar as premissas do plano atual: conteúdo e contas demonstrativos; sem integrações reais; persistência offline, descanso real, cargas e histórico por exercício pertencem às histórias funcionais já existentes.
- O implementador verificará as linhas atuais antes de usar cada tarefa, pois alterações no protótipo podem deslocar as âncoras.

## Arquivos propostos

- `histories/MVP/6-Implementação Figma - Fase 1 Fundação Visual.md`
- `histories/MVP/7-Implementação Figma - Fase 2 Componentes Reutilizáveis.md`
- `histories/MVP/8-Implementação Figma - Fase 3 Telas e Navegação.md`
- Atualização de `histories/MVP/0-implementar-figma.md` para índice e resumo das dependências.

## Em aberto para o implementador

- Confirmar cada intervalo de linha no protótipo ao escrever as tarefas.
- Detalhar os critérios específicos de cada componente e fluxo a partir da referência, sem ampliar as premissas de produto já registradas.
- Usar os scripts de lint e typecheck descritos pelo projeto como critérios de validação da implementação futura, não como ações deste trabalho documental.
