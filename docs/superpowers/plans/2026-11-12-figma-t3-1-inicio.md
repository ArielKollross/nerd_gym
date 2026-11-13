# T3.1 — Tela Início Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compor somente a tela Início do protótipo e sua entrada mínima na sessão Upper Power.

**Architecture:** Rotas finas no Expo Router e composição em `gym-app/src/screens/`. Reutilizar os componentes da fase 2 e a imagem local da fase 1, com uma única rotina demonstrativa compartilhada entre resumo e sessão. A sessão mostra apenas o primeiro exercício e permite fechar; avanço e finalização pertencem à T3.6.

**Tech Stack:** Expo 58, React Native 0.88, NativeWind 4, TypeScript, react-native-svg existente.

**Spec:** `histories/MVP/8-Implementação Figma - Fase 3 Telas e Navegação.md`, T3.1; delimitação de escopo na conversa de 2026-11-12.

## Global Constraints

- Somente T3.1; abas e atalho de Perfil ficam para T3.7.
- Dados locais e determinísticos; sem persistência, publicidade integrada ou relógio real.
- Cores tokenizadas nos dois temas; compartilhados fora de `src/app/`.
- Preservar catálogo da fase 2 acessível em desenvolvimento.
- Branch `feat/figma-t3-1-inicio`, criada de `master` (279dcfe); executar no checkout atual, sem publicação ou commit automático.

## Review Focus

- 320 px: rolagem vertical sem transbordamento horizontal da página; grade rola internamente.
- Tela larga: conteúdo centralizado, largura limitada e ações alcançáveis.
- Temas claro/escuro: hero mantém contraste e métricas continuam legíveis.
- Navegação: iniciar abre Upper Power/Supino reto; fechar retorna a Início; acesso direto pode retornar a Início.
- Métricas fixas e banner explicitamente demonstrativos; iniciar/fechar não altera os números.

### Task 1: Compor Início e sua entrada de sessão

**Files:** criar `gym-app/src/data/demo-workouts.ts`, `gym-app/src/screens/home.tsx`, `gym-app/src/screens/workout-entry.tsx`, `gym-app/src/app/workout/[id].tsx`; alterar `gym-app/src/app/index.tsx`, `gym-app/src/constants/{theme,assets}.ts`, `gym-app/src/components/active-workout.tsx`; documentar em `gym-app/docs/home-t3-1.md`.

**Interfaces:** `nextDemoWorkout` satisfaz `Workout`; `HomeScreen` renderiza o próximo treino; `WorkoutEntryScreen({workout, onClose})` apresenta o primeiro exercício. Expo Router transporta apenas o id da rotina.

- [x] Conferir referências, componentes e base limpa; consultar documentação do SDK 58.
- [x] Registrar verificação de navegador antes da alteração: a rota inicial ainda não apresenta Upper Power nem Iniciar treino.
- [x] Compor hero local com data fixa de 22/05/2025, sequência de 8 dias, resumo Upper Power (52 min), três exercícios e +1, banner e atividade anual (94 treinos; 12 neste mês).
- [x] Abrir sessão com primeiro exercício e fechar pelo Expo Router; rota inválida retorna a Início. Não compor ações da T3.6.
- [x] Verificar navegador em 320 px e largura larga, ambos os temas, início/fechamento e acesso direto; salvar capturas locais.
- [x] Executar `npm run lint`, `npx tsc --noEmit`, `node scripts/activity.test.cjs`, exportação iOS/Android/web e `git diff --check`.
- [x] Revisar alterações e registrar evidências e limitações de verificação nativa.

## Registro de execução

- O usuário confirmou entrega focada somente na T3.1 após a proposta de abrir o primeiro exercício e deixar avanço/finalização para T3.6.
- Sem novo framework de testes para composição visual: verificação real no navegador e testes existentes. Não alterar dependências.
- Base: lint somente leitura, TypeScript e três testes existentes passaram. Roteiro de navegador inicialmente falhou pela ausência de Upper Power/Iniciar treino, como esperado.
- Ajustes de integração: imagem local tipada como `ImageRequireSource` para consumo por `expo-image`; id fixo do gradiente evita divergência de `useId` entre árvores SSR/cliente do Router; `aria-hidden` evita atributo nativo inválido no SVG web; propriedades ARIA numéricas expõem o progresso no react-native-web, preservando `accessibilityValue` nativo.
- Navegador: PASS no servidor Expo normal; 320/1200 px, temas claro/escuro, imagem carregada, rolagem própria da grade, abrir/fechar, acesso direto e id inválido; nenhuma exceção ou erro de console/hidratação. Capturas em `/tmp/nerd-gym-t31-{320,1200}-{light,dark}.png`.
- Lint, TypeScript, três testes existentes, exportação final das três plataformas e diff passaram. Revisão independente sem achados acionáveis. Conferência visual nativa, leitor de tela e fonte ampliada continuam pendentes; roteiro em `gym-app/docs/home-t3-1.md`.
