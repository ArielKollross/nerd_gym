# Feature 4: Visualização de Progresso Anual e Mensal

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** História 3 e persistência local.

## Situação atual

ActivityHeatmap, activity.ts e cartões de progresso existem. Grade tem 364 dias demonstrativos; ano 2025, 94 treinos, sequências e marco são ilustrativos.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T4.1 — Grade anual real

- [ ] **RED — antes de implementar:** escrever testes para 2026 contém 365 dias, 2028 contém 366, preenchimentos fora do ano não são dias e contagens 0/1/2/3 produzem níveis 0/1/2/2.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Reutilizar grade e createActivityWeeks com dados completos do ano selecionado, inicialmente ano atual. Preservar três níveis aprovados e tokens nos dois temas. Detalhe do dia mostra contagem exata, mesmo acima de dois; manter rolagem e controles acessíveis.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T4.2 — Volume mensal por ficha

- [ ] **RED — antes de implementar:** escrever testes para duas sessões da mesma ficha no dia somam volumes, filtro não mistura fichas e mês vazio mostra estado vazio.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Adicionar gráfico mensal na aba Progresso com seleção de ficha e mês anterior/próximo. Eixos indicam dia e volume em kg × repetições. Reutilizar react-native-svg já instalado, com tabela textual acessível dos valores, sem impor biblioteca nova.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T4.3 — Agregações e métricas compartilhadas

- [ ] **RED — antes de implementar:** escrever testes para canceladas não contam, finalizada com séries conta uma vez, limites de mês e meia-noite respeitam data local e sequências não duplicam dias.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Agregar sessões finalizadas com pelo menos uma série realizada. Fixar data local da conclusão no registro para agrupamento estável; indexar datas e IDs usados nas consultas. Compartilhar dados entre Início e Progresso; calcular total anual, mensal, melhor sequência e atual (até hoje ou ontem). Marco seguinte é próximo múltiplo de 100; tendência compara ano até a data com período equivalente anterior, sem percentual quando base zero. Remover rótulos demonstrativos somente dos dados substituídos.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar testes automatizados, `npm run lint` e `npx tsc --noEmit` em `gym-app/` na futura implementação. Configurar script de testes na T1.1; hoje não existe.
- Validar fluxos em Android físico via ADB quando disponível, depois emulador/simulador; web como complemento. Conferir tema claro/escuro, teclado, acessibilidade e retorno de navegação.
- Não incluir autenticação, cobrança, anúncios reais ou sincronização para concluir esta história.
- Medir grade completa: alvo inferior a 500 ms; mudança de mês inferior a 300 ms, registrando dispositivo e volume de dados.

## Cenários BDD

```gherkin
# language: pt-br
Funcionalidade: Visualização de Progresso Anual e Mensal

  Cenário: Consultar contagem exata
    Dado que há três sessões finalizadas no mesmo dia
    Quando seleciono esse dia na grade
    Então vejo 3 treinos e a cor do nível duas ou mais atividades

  Cenário: Mostrar ano bissexto
    Dado que selecionei o ano de 2028
    Quando consulto a grade
    Então existem 366 dias reais incluindo 29 de fevereiro
```
