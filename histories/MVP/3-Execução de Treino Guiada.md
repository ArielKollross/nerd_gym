# Feature 3: Execução de Treino Guiada

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** Histórias 1 e 2; fornece registros para 4 e 5.

## Situação atual

workout/[id], workout-entry e componentes active-workout existem. O avanço é por exercício; primeira série e 80 kg são ilustrativos. Finalizar chega a 100% e mantém a tela aberta, sem histórico.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T3.1 — Sessão real e sequência

- [ ] **RED — antes de implementar:** escrever testes para iniciar ficha válida com todas as séries pendentes, rejeitar ficha vazia e preservar prescrição após edição posterior da ficha.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Evoluir rota e tela existentes. Criar sessão persistida com snapshot dos nomes, ordem e prescrições, IDs da ficha e exercícios, início e estado. Mostrar sequência com estados atual, concluído e pulado. Retomar sessão aberta da mesma ficha; impedir segunda sessão simultânea.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.2 — Conclusão individual de séries

- [ ] **RED — antes de implementar:** escrever testes para 50 kg e 10 repetições geram volume 500, toque duplicado grava uma vez e peso ou repetições inválidos impedem conclusão.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Adicionar entrada de carga positiva e repetições realizadas inteiras positivas. Registrar timestamp e volume por série em transação, com chave única sessão/exercício/série. Sugerir última carga realizada do exercício, com fallback para carga planejada. Não calcular volume pela string de prescrição.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.3 — Descanso e transições

- [ ] **RED — antes de implementar:** escrever testes para descanso de 60s termina no horário alvo, retorno após 40s mostra 20s, pular cancela o prazo e não permite concluir durante descanso.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Persistir horário alvo e recalcular por relógio ao retornar do background. Após série intermediária iniciar descanso; término libera próxima série. Última série avança ao próximo exercício sem descanso final; último exercício leva ao resumo. Descanso zero libera imediatamente. Usar relógio controlado nos testes, sem esperas reais.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.4 — Aviso de fim de descanso

- [ ] **RED — antes de implementar:** escrever testes para fim natural emite aviso uma vez, pular cancela aviso e permissão negada mantém contador funcional.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Avaliar módulos oficiais compatíveis com a versão instalada antes de integrar áudio, vibração e notificações locais. Validar som e modo silencioso em Android/iOS; não prometer execução contínua de JavaScript em background ou precisão absoluta de entrega do sistema. Pular descanso não dispara alarme.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.5 — Sugestão de carga e recuperação

- [ ] **RED — antes de implementar:** escrever testes para histórico sugere última carga, edição da sugestão não altera séries anteriores e reinício recupera série e descanso.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Consultar último registro por identidade de exercício e data; manter carga anterior no campo após descanso. Restaurar sessão persistida com timestamps. Erro de gravação mantém entrada e permite tentativa sem duplicidade.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.6 — Pular, cancelar e finalizar

- [ ] **RED — antes de implementar:** escrever testes para pular mantém séries feitas e marca restantes ignoradas, cancelamento não conta treino concluído e finalizar repetidamente não duplica histórico.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Pular cancela descanso e avança; no último exercício leva ao resumo. Fechar exige escolher continuar ou cancelar sessão, preservando séries realizadas. Finalizar grava término, duração e volume uma vez e mostra resumo; não manter comportamento demonstrativo de ficar no último exercício. Sessão sem séries feitas não conta como treino realizado.
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
Funcionalidade: Execução de Treino Guiada

  Cenário: Concluir série
    Dado que estou na primeira de três séries com descanso de 60 segundos
    Quando informo 50 kg e 10 repetições e concluo a série
    Então um único registro de volume 500 é salvo e o descanso inicia

  Cenário: Retornar do background
    Dado que o descanso começou há 40 segundos com duração de 60 segundos
    Quando retorno ao aplicativo
    Então o contador mostra 20 segundos restantes

  Cenário: Finalizar sessão
    Dado que concluí o último exercício
    Quando a sessão é finalizada
    Então vejo resumo e um único registro histórico
```
