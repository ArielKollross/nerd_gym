# Feature 5: Acompanhamento de Progresso por Exercício

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** História 3; acesso pela aba Progresso.

## Situação atual

Progresso possui cartões e grade, mas não há histórico, filtros ou gráfico por exercício.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T5.1 — Histórico de sessões

- [ ] **RED — antes de implementar:** escrever testes para cinco sessões finalizadas aparecem ordenadas por término decrescente, filtro inclui limites e canceladas não aparecem como concluídas.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Adicionar acesso em Progresso para histórico com período e detalhes: data, nome snapshot da ficha, duração, séries e volume. Últimos 7 dias inclui hoje e seis dias anteriores; oferecer também 30 dias e todo período. Preservar as quatro abas.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T5.2 — Evolução por exercício

- [ ] **RED — antes de implementar:** escrever testes para cargas 40 e 50 destacam máximo 50, volumes somam séries realizadas, séries ignoradas não entram e renomear não divide identidade.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Adicionar detalhe acessível pelo histórico e seleção de exercício no Progresso. Gráfico de maior carga por sessão em kg, volume por sessão e tabela dos registros ordenados por data. Reutilizar SVG e filtros; distinguir ausência de dados de volume zero. Consultar somente sessões finalizadas com séries feitas, usando ID estável e nomes snapshot nos detalhes.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T5.3 — Preservação histórica

- [ ] **RED — antes de implementar:** escrever testes para excluir ou editar ficha não altera nome snapshot, cargas, volume nem vínculo histórico do exercício.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Preservar snapshots e impedir exclusão destrutiva dos exercícios referenciados por histórico, usando arquivamento quando necessário. Exportação JSON/CSV permanece futura, sem tarefa de implementação no MVP.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar testes automatizados, `npm run lint` e `npx tsc --noEmit` em `gym-app/` na futura implementação. Configurar script de testes na T1.1; hoje não existe.
- Validar fluxos em Android físico via ADB quando disponível, depois emulador/simulador; web como complemento. Conferir tema claro/escuro, teclado, acessibilidade e retorno de navegação.
- Não incluir autenticação, cobrança, anúncios reais ou sincronização para concluir esta história.

## Cenários BDD

```gherkin
# language: pt-br
Funcionalidade: Acompanhamento de Progresso por Exercício

  Cenário: Consultar evolução
    Dado que concluí sessões do mesmo exercício com cargas de 40 e 50 kg
    Quando abro o detalhe do exercício
    Então vejo carga máxima de 50 kg e os registros por sessão

  Cenário: Preservar histórico
    Dado que uma sessão finalizada referencia uma ficha
    Quando excluo a ficha e abro o histórico
    Então a sessão mantém nome original, séries e volume
```
