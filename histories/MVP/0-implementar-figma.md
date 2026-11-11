# Plano: portar o protótipo Figma Web para Expo/React Native

## Objetivo

Recriar no app Expo ativo (`gym-app/`) o visual e as interações demonstrativas do protótipo em `UI_example_figma/`, seguindo a ordem das três fases abaixo. O protótipo é referência visual e funcional; o resultado deve usar Expo Router, React Native e NativeWind, sem copiar HTML, DOM ou CSS para telas nativas.

## Premissas compartilhadas

- Conferir os intervalos de linha atuais em `UI_example_figma/src/App.tsx` e `UI_example_figma/src/index.css` antes de implementar cada tarefa; os nomes de componentes e seletores são âncoras mais estáveis que as linhas.
- Se houver divergência entre a descrição da tarefa e o protótipo atual, ou se uma referência apontar para o componente/seletor errado, perguntar à pessoa usuária como proceder antes de implementar essa tarefa. Não escolher uma interpretação por conta própria.
- Manter código compartilhado fora de `gym-app/src/app/`, que contém as rotas Expo Router, conforme [`gym-app/AGENTS.md`](../../gym-app/AGENTS.md).
- Login, assinatura, anúncios, métricas e conteúdo continuam demonstrativos, sem backend, autenticação real, cobrança ou publicidade integrada.
- Persistência offline, descanso real, registro de cargas e histórico por exercício continuam nas histórias funcionais existentes.
- Validar cada componente em iOS, Android e web. Para implementação do app, executar `npm run lint` e `npx tsc --noEmit` em `gym-app/`.

## Fases

1. [Fase 1 — Fundação Visual](6-Implementação%20Figma%20-%20Fase%201%20Fundação%20Visual.md): temas, tipografia e recursos visuais locais.
2. [Fase 2 — Componentes Reutilizáveis](7-Implementação%20Figma%20-%20Fase%202%20Componentes%20Reutilizáveis.md): catálogo de componentes e variantes compartilhadas.
3. [Fase 3 — Telas e Navegação](8-Implementação%20Figma%20-%20Fase%203%20Telas%20e%20Navegação.md): composição das telas, rotas e fluxos demonstrativos.

## Dependências

A fase 1 fornece tokens, fontes e recursos para a fase 2. A fase 2 fornece componentes para compor as telas da fase 3. Na fase 3, preservar tipagem compartilhada de treino e exercício suficiente para listagem, criação em memória durante a sessão atual do app e execução visual de exercícios.
