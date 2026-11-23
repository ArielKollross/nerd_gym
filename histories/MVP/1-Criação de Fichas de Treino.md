# Feature 1: Criação de Fichas de Treino

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** Nenhuma; fundação de dados para 2 e 3.

## Situação atual

Treinos, cartões e modal de criação já existem. WorkoutsProvider mantém dados em memória; CreateWorkout define 3 séries e prescrição textual 10–12. Não há SQLite ou edição persistida.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T1.1 — Fundação SQLite e testes

- [ ] Configurar `npm test` com Jest 30, o preset `jest-expo` do SDK 58 e React Native Testing Library v14 com renderizador compatível com React 19.3. Configurar uma suíte de integração executável no Android em modo de desenvolvimento, com `expo-sqlite` e banco de teste separado.
- [ ] **RED — antes de implementar:** escrever testes para migrations em banco vazio e existente, execução repetida sem perda, rollback de escrita parcial e exclusão de ficha preservando exercícios.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Criar a camada de dados e os repositórios de `workout_sheets`, `exercises` e `sheet_exercises` com migrações versionadas e transações. Os parâmetros `sets`, `reps`, `rest_seconds` e `current_weight` pertencem ao vínculo. O nome pertence ao exercício. Usar IDs estáveis, ordem e unicidade do exercício por ficha. Inicializar o banco no layout raiz com carregamento, erro e opção de tentar novamente. O banco começa vazio.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.2 — CRUD de fichas na interface existente

- [ ] **RED — antes de implementar:** testar nomes vazios ou com menos de 3 caracteres após remover espaços nas pontas, nomes repetidos válidos, 1 e 20 exercícios aceitos e 21 rejeitados. Cobrir edição, cancelamento sem escrita, confirmação de exclusão e nova tentativa de salvar após uma falha.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Evoluir o modal e os cartões existentes para criar, editar e excluir fichas com confirmação. Gravar apenas ao salvar e atualizar a lista após a confirmação da escrita. Se a gravação falhar, manter o modal aberto e preservar o rascunho para tentar novamente. Excluir os vínculos da ficha e preservar biblioteca e histórico.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.3 — Biblioteca de exercícios

- [ ] **RED — antes de implementar:** testar busca parcial sem diferenciar maiúsculas, descarte de novo cadastro ao cancelar a ficha, reutilização em duas fichas e alteração do nome refletida nas duas com os parâmetros individuais preservados.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Permitir buscar, selecionar, cadastrar e renomear exercícios da biblioteca pelo modal existente. Identificar exercícios por ID e gravar novos cadastros feitos no formulário na mesma transação da ficha. Manter séries, prescrição de repetições, descanso e carga planejada por ficha. Categorias ficam futuras.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.4 — Configuração e ordenação por ficha

- [ ] **RED — antes de implementar:** testar validação dos parâmetros, bloqueio de exercício duplicado na ficha, independência dos parâmetros entre fichas, mudança de ordem preservada após reabrir e remoção do vínculo com o exercício preservado na biblioteca.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Ampliar os tipos e as linhas do formulário com séries inteiras positivas, prescrição textual de repetições, descanso em segundos inteiros não negativos e carga planejada opcional positiva. Oferecer controles acessíveis para mover e remover vínculos.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T1.5 — Integrar dados nas rotas existentes

- [ ] **RED — antes de implementar:** testar que Início e Treinos abrem a mesma ficha persistida, que a lista vazia oferece criação, que ID ausente ou inválido leva a Início e que fechar um treino válido retorna à tela de origem quando houver histórico de navegação.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Preservar Início, Treinos, Progresso e Perfil. Mostrar em Início a primeira ficha persistida na ordem de criação. Com a lista vazia, levar à criação em Treinos. Abrir fichas por `/workout/[id]` e manter o retorno à tela de origem, com Início como destino quando não houver histórico de navegação.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Usar preferencialmente a React Native Testing Library para componentes, interações e navegação. Usar Jest direto para regras e funções que dispensam renderização. Rodar com SQLite real no Android os testes de migração, rollback, preservação da biblioteca, independência de parâmetros e persistência após fechar e reabrir.
- Executar `npm test`, `npm run lint` e `npx tsc --noEmit` em `gym-app/` na implementação.
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
