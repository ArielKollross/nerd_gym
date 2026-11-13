# T3.6 — Fluxo de treino ativo

**Objetivo:** completar a tela existente conforme a T3.6 da história de fase 3.
**Arquitetura:** reutilizar os componentes da fase 2 e a rota atual. Contar exercícios concluídos em estado local; derivar índice e percentual desse contador, limitado ao total. Usar uma chave por rotina para reiniciar a sessão quando o destino mudar.
**Escopo:** sem persistência, temporizador real, edição de cargas ou alternância individual de séries. Fechar preserva o retorno existente por Expo Router.

- [x] Testar avanço, rotina única, finalização idempotente e sequência completa com o runner Node existente.
- [x] Integrar estado e WorkoutNextButton em `src/screens/workout-entry.tsx`; voltar o scroll ao topo ao avançar.
- [x] Validar lint, TypeScript e testes existentes; percorrer web em largura estreita/larga e temas claro/escuro quando disponível.
- [x] Revisar o diff contra a referência e registrar limitações de validação nativa.

## Evidências

- Os dois testes novos falharam pela ausência das funções e passaram após implementação.
- `npm run lint`, `./node_modules/.bin/tsc --noEmit` e `node --test scripts/*.test.cjs` passaram (quatro arquivos de testes).
- Chrome: 320, 390, 720 e 1280 px nos temas claro e escuro; entrada por Treinos em Lower Strength, exercícios e percentuais 0/25/50/75/100, finalização repetida mantendo o último exercício, relógio fixo, fechar retornando a Treinos e reabrir em 0%; sem overflow horizontal ou erros de console.
- Capturas temporárias: `/tmp/nerd-gym-t36-<largura>-<tema>.png`.
- Entrada pelo Início abre Upper Power, avança de Supino reto a Desenvolvimento e fecha retornando ao Início.
- Revisão independente do diff sem achados de bug.
- iOS e Android não foram executados neste ambiente; validação nativa permanece pendente.
