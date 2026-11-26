# Feature 3: Execução de Treino Guiada

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** Histórias 1 e 2; fornece registros para 4 e 5.

## Implementação

A rota de treino abre uma sessão SQLite com a prescrição original. A tela registra as séries, mostra a sequência e restaura o descanso pelo horário alvo. O resumo é exibido ao resolver o último exercício. A finalização grava uma sessão no histórico quando houve ao menos uma série realizada.

Os avisos usam o som padrão de notificações e um canal com vibração no Android. A entrega respeita as permissões e configurações do sistema e pode ocorrer depois do prazo. O treino e o contador continuam disponíveis com notificações desativadas.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T3.1 — Sessão real e sequência

- [x] **RED — antes de implementar:** escrever testes para iniciar ficha válida com todas as séries pendentes, rejeitar ficha vazia e preservar prescrição após edição posterior da ficha.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Evoluir rota e tela existentes. Criar sessão persistida com snapshot dos nomes, ordem e prescrições, IDs da ficha e exercícios, início e estado. Mostrar sequência com estados atual, concluído e pulado. Retomar sessão aberta da mesma ficha; impedir segunda sessão simultânea.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.2 — Conclusão individual de séries

- [x] **RED — antes de implementar:** escrever testes para 50 kg e 10 repetições geram volume 500, toque duplicado grava uma vez e peso ou repetições inválidos impedem conclusão.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Adicionar entrada de carga positiva e repetições realizadas inteiras positivas. Registrar timestamp e volume por série em transação, com chave única sessão/exercício/série. Sugerir última carga realizada do exercício, com fallback para carga planejada. Não calcular volume pela string de prescrição.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.3 — Descanso e transições

- [x] **RED — antes de implementar:** escrever testes para descanso de 60s termina no horário alvo, retorno após 40s mostra 20s, pular cancela o prazo e não permite concluir durante descanso.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Persistir horário alvo e recalcular por relógio ao retornar do background. Após série intermediária iniciar descanso; término libera próxima série. Última série avança ao próximo exercício sem descanso final; último exercício leva ao resumo. Descanso zero libera imediatamente. Usar relógio controlado nos testes, sem esperas reais.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.4 — Aviso de fim de descanso

- [x] **RED — antes de implementar:** escrever testes para fim natural emite aviso uma vez, pular cancela aviso e permissão negada mantém contador funcional.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Avaliar módulos oficiais compatíveis com a versão instalada antes de integrar áudio, vibração e notificações locais. Pular descanso cancela o aviso agendado pelo sistema.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.5 — Sugestão de carga e recuperação

- [x] **RED — antes de implementar:** escrever testes para histórico sugere última carga, edição da sugestão não altera séries anteriores e reinício recupera série e descanso.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Consultar último registro por identidade de exercício e data; manter carga anterior no campo após descanso. Restaurar sessão persistida com timestamps. Erro de gravação mantém entrada e permite tentativa sem duplicidade.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T3.6 — Pular, cancelar e finalizar

- [x] **RED — antes de implementar:** escrever testes para pular mantém séries feitas e marca restantes ignoradas, cancelamento não conta treino concluído e finalizar repetidamente não duplica histórico.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Pular cancela descanso e avança; no último exercício leva ao resumo. Fechar exige escolher continuar ou cancelar sessão, preservando séries realizadas. Finalizar grava término, duração e volume uma vez e mostra resumo; não manter comportamento demonstrativo de ficar no último exercício. Sessão sem séries feitas não conta como treino realizado.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar testes automatizados, `npm run lint` e `npx tsc --noEmit` em `gym-app/`. O script `npm test` executa Jest e os testes de regras com Node.
- Validar fluxos em Android físico via ADB quando disponível, depois emulador/simulador; web como complemento. Conferir tema claro/escuro, teclado, acessibilidade e retorno de navegação.
- Não incluir autenticação, cobrança, anúncios reais ou sincronização para concluir esta história.

### Evidência automatizada

| Ciclo | RED | GREEN |
| --- | --- | --- |
| T3.1 | A sessão persistida e a retomada pelo ID estavam ausentes. | O SQLite preserva a prescrição e impede uma segunda sessão. |
| T3.2 | A conclusão individual não estava disponível. | O SQLite guarda uma série e volume 500 após duas tentativas concorrentes. Entradas inválidas são rejeitadas. |
| T3.3 | A série concluída não retornava um horário alvo. | Um descanso de 60 s retorna 20 s após 40 s. A série seguinte fica bloqueada antes do prazo. |
| T3.4 | O agendamento e o cancelamento do aviso estavam ausentes. | Os testes verificam um agendamento, cancelamento mesmo durante a retomada e tolerância a falhas de permissão. |
| T3.5 | A consulta à última carga estava ausente. | A reabertura em disco recupera série, carga e descanso. A falha forçada entre escritas reverte a série e permite nova tentativa. |
| T3.6 | Pular e cancelar estavam ausentes. | O SQLite preserva séries realizadas e finaliza uma única vez. O teste da tela mantém o resumo de ficha excluída. |

Os testes de componentes também verificam entrada decimal, repetição da gravação após erro e confirmação ao fechar.

### Verificação em dispositivo

No Galaxy A54 com Android 16 e Expo Go SDK 58, foi possível registrar 50 kg × 10 repetições, retomar a série após forçar o fechamento, recuperar 24 s de um descanso de 60 s e liberar a série seguinte após voltar do segundo plano. O botão Voltar do Android abriu a confirmação. Após pular a série restante, o resumo preservou duas séries e gravou volume de 1.000 kg. Uma nova sessão sugeriu a carga de 50 kg. A retomada também foi conferida em tema escuro.

Com notificações desativadas, o contador continuou funcional. Com notificações autorizadas e o Android em modo vibrar, o sistema registrou um aviso em segundo plano aproximadamente 32 s após o prazo. Pular um descanso seguinte removeu o agendamento pendente. A confirmação audível do som e a validação em iOS continuam pendentes.

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
