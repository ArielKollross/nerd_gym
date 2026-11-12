# Catálogo temporário — Fase 2

Na branch `feat/figma-fase-2`, executar `npm start` e abrir **Abrir catálogo da fase 2** na tela inicial, ou `/catalog` na web. A rota só apresenta o catálogo com `__DEV__`; em produção redireciona para `/`. Sua remoção completa está prevista em T3.8.

## Organização

- `src/components/`: ícones, botões, navegação, tipografia, exercícios/rotinas, atividade anual, publicidade, métricas, formulário, perfil, modal inferior e apresentação de sessão.
- `src/types/workout.ts`: tipos compartilhados `Workout`, `Exercise`, `AccountStatus`.
- `src/screens/component-catalog.tsx`: exemplos e interações locais descartáveis.
- `ThemeScope`: escopo opcional de tema claro/escuro. Sem escopo, `useTheme()` continua seguindo o sistema.
- Componentes recebem dados e callbacks; navegação, autenticação, plano e salvamento não fazem integrações.

## Roteiro de conferência manual

Executar em iOS, Android e web, nos dois temas, com largura estreita (320 pontos na web) e fonte ampliada:

1. Abrir catálogo e alternar o switch **Tema escuro**. Conferir contraste e anúncio do estado com leitor de tela.
2. Acionar botões habilitados e manter pressionados; conferir mudança visual e rótulos longos. Desabilitados não devem atualizar a mensagem. Ícones devem ter nome acessível.
3. Selecionar cada destino na navegação e abrir o perfil pelo cabeçalho. Conferir seleção anunciada, borda ativa e rótulo em destaque.
4. Conferir cartões com nomes extensos, metadados ausentes e com/sem ação; conferir associação de séries/repetições e duração.
5. Percorrer horizontalmente a grade: meses acompanham os dias; legenda permanece abaixo. Consultar um dia e conferir a mensagem com data e nível.
6. Digitar no campo e adicionar exercícios pelo botão e pela submissão do teclado. Conferir foco, erro e campo desabilitado. O botão de salvar depende dos dados locais do catálogo.
7. Alternar logged-out, Free e Premium. Conferir plano atual e recurso indisponível; voltar para Free e sair.
8. Abrir o modal, interagir com campo sem fechar, percorrer até a ação inferior com teclado aberto e fechar pelo botão. No Android, conferir também o botão Voltar; na web, Escape.
9. Conferir séries concluídas/pendentes, prescrição, progresso e rótulos de avanço/finalização. Nenhum relógio ou registro real deve iniciar.
10. Acionar as ofertas e conferir apenas a mensagem demonstrativa.

## Verificações automatizadas

```sh
npm run lint
npx tsc --noEmit
node scripts/activity.test.cjs
npx expo export --platform all --output-dir /tmp/nerd-gym-fase2-export
```

A exportação confirma a geração dos bundles; não substitui validação visual nem uso em dispositivo.

## Registro de validação — 2026-11-11

- Lint, TypeScript, `git diff --check` e os três testes de atividade passaram.
- Exportação gerou bundles iOS, Android e web.
- Chrome headless a 320 × 850: temas claro/escuro, inclusão de exercício, habilitação/salvamento demonstrativo, consulta de dia, troca Free/Premium e abertura/fechamento do modal conferidos sem exceções nem avisos de console. A página permaneceu com largura de 320 px.
- A prévia usou um HTML local de teste com a folha de estilos exportada e o bundle cliente de desenvolvimento. O servidor web normal apresenta `getRouteInfoForMatchedRoute is not a function`: o `@expo/router-server` da CLI chama uma função ausente no `expo-router` instalado. Esse caminho normal de navegação ainda precisa ser validado após alinhar essas dependências; elas não foram atualizadas nesta tarefa.
- Validação visual/interações em iOS e Android, leitor de tela e fonte ampliada ainda pendentes.
- Escala aprovada pela pessoa usuária: três níveis: sem atividade (neutro), 1 atividade (`activitySingle`) e 2 ou mais atividades (`activityMultiple`). Apenas o tom `#cbe5b0` foi removido; os verdes atuais estão tokenizados no tema em ambos os modos. Dados, legenda, tipo e rótulos acessíveis usam a mesma escala.
