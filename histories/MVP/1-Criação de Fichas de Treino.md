# Feature 1: Criação de Fichas de Treino

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** Nenhuma; fundação de dados para 2 e 3.

## Situação atual

Treinos, cartões e modal de criação já existem. WorkoutsProvider mantém dados em memória; CreateWorkout define 3 séries e prescrição textual 10–12. Não há SQLite ou edição persistida.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T1.1 — Fundação SQLite e testes

- [ ] **RED — antes de implementar:** escrever testes para migrations em banco vazio e existente, execução repetida sem perda, rollback de escrita parcial e exclusão de ficha preservando exercícios.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Configurar executor compatível com o Expo instalado e testes de integração SQLite no dispositivo. Criar camada db e repositórios para workout_sheets, exercises e sheet_exercises; migrations versionadas e transações. Parâmetros sets, reps, rest_seconds e current_weight pertencem ao vínculo; nome do exercício pertence à biblioteca. Usar IDs estáveis, ordem e unicidade do exercício por ficha. Integrar inicialização ao layout raiz com carregamento, erro e tentativa novamente.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.2 — CRUD de fichas na interface existente

- [ ] **RED — antes de implementar:** escrever testes para nome vazio ou menor que 3 caracteres, nomes repetidos válidos, 1 e 20 exercícios aceitos, 21 rejeitados, cancelamento sem escrita e falha ao salvar sem fechar o formulário.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Evoluir screens/workouts.tsx, components/create-workout.tsx e contexts/workouts.tsx. Persistir somente ao salvar; adicionar edição e exclusão com confirmação, mantendo o modal e cartões. Excluir vínculos sem apagar biblioteca ou histórico. Atualizar a lista apenas após confirmação da escrita.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.3 — Biblioteca de exercícios

- [ ] **RED — antes de implementar:** escrever testes para busca parcial sem diferenciar maiúsculas, reutilização em duas fichas e alteração do nome refletida nas duas sem alterar parâmetros individuais.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Adicionar seleção e cadastro de exercício a partir do formulário existente. Identificar por ID, não por nome. Editar nome na biblioteca; manter séries, prescrição de repetições, descanso e carga planejada por ficha. Categorias ficam futuras.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.4 — Configuração e ordenação por ficha

- [ ] **RED — antes de implementar:** escrever testes para mesmo exercício bloqueado duas vezes na ficha, parâmetros independentes entre fichas, ordem preservada após reabrir e remoção sem excluir exercício.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Ampliar tipos/workout.ts e linhas do formulário com séries inteiras positivas, prescrição de repetições, descanso em segundos não negativo e carga planejada opcional positiva. Ordenar por controles acessíveis e permitir remover vínculos.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.5 — Integrar dados nas rotas existentes

- [ ] **RED — antes de implementar:** escrever testes para Início e Treinos iniciam a mesma ficha persistida, ID ausente não quebra navegação e lista vazia oferece criação.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Preservar Início, Treinos, Progresso e Perfil. Substituir nextDemoWorkout em Início por primeira ficha persistida na ordem de criação; em lista vazia oferecer criação em Treinos. Manter /workout/[id] e retorno ao contexto anterior. Não criar abas de biblioteca nem substituir a navegação entregue.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar testes automatizados, `npm run lint` e `npx tsc --noEmit` em `gym-app/` na futura implementação. Configurar script de testes na T1.1; hoje não existe.
- Validar fluxos em Android físico via ADB quando disponível, depois emulador/simulador; web como complemento. Conferir tema claro/escuro, teclado, acessibilidade e retorno de navegação.
- Não incluir autenticação, cobrança, anúncios reais ou sincronização para concluir esta história.
- Medir CRUD com até 50 fichas: alvo inferior a 100 ms; registrar dispositivo e condições. Categorias da SPEC permanecem futuras. Nomes repetidos são permitidos; alterar parâmetros afeta somente a ficha editada.

## Cenários BDD

```gherkin
# language: pt-br
Funcionalidade: Criação de Fichas de Treino

  Cenário: Criar e reabrir ficha
    Dado que estou em Treinos com banco inicializado
    Quando salvo uma ficha com nome e um exercício e reabro o app
    Então a ficha e seus parâmetros permanecem disponíveis

  Cenário: Isolar parâmetros
    Dado que o mesmo exercício está em duas fichas
    Quando altero a carga planejada em uma ficha
    Então a outra ficha mantém sua carga anterior

  Cenário: Permitir nomes repetidos
    Dado que já existe uma ficha chamada Costas
    Quando salvo outra ficha chamada Costas
    Então as duas possuem IDs distintos e aparecem na lista
```
