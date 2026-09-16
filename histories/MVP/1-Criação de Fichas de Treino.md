## Feature 1: Criação de Fichas de Treino

### 📝 Histórias de Usuário

- HU-01: Como usuário, quero criar uma ficha de treino personalizada
- HU-02: Como usuário, quero adicionar exercícios à minha ficha de treino
- HU-03: Como usuário, quero definir parâmetros para cada exercício (repetições, descanso)
- HU-04: Como usuário, quero visualizar todas as minhas fichas de treino

### 🧩 Tarefas Técnicas

T1.1 - Configurar banco de dados SQLite

- Criar schema inicial com tabelas: workout_sheets, exercises, sheet_exercises
- Implementar migrations
- Criar camada de repositório

T1.2 - Desenvolver CRUD de Fichas

- Criar tela de listagem de fichas
- Criar formulário de criação/edição de ficha, com campo: Nome da Ficha
- Implementar exclusão com confirmação
- Adicionar validações (nome obrigatório, min. 1 exercício)

T1.3 - Desenvolver CRUD de Exercícios

- Criar tela de cadastro de exercícios
- Criar formulário com campos: nome, repetições, tempo descanso (segundos)
- Implementar busca/filtro de exercícios existentes
- Permitir reutilização de exercícios em múltiplas fichas

T1.4 - Vincular Exercícios à Ficha

- Criar interface de adição de exercícios à ficha
- Permitir ordenação dos exercícios na ficha
- Remover exercícios da ficha (não exclui do banco)

## 🧪 Especificações BDD

```gherkin
# language: pt-br
Funcionalidade: Gerenciar Fichas de Treino
  Como usuário
  Quero criar e personalizar fichas de treino
  Para organizar meus exercícios

  Cenário: Criar nova ficha com exercícios
    Dado que estou na tela de listagem de fichas
    Quando eu tocar em "Nova Ficha"
    E preencher o nome "Treino de Costas"
    E adicionar o exercício "Puxada Alta" com 3 repetições e 60s de descanso
    E adicionar o exercício "Remada Curvada" com 4 repetições e 90s de descanso
    E tocar em "Salvar"
    Então devo ver a ficha "Treino de Costas" na listagem
    E ao abrir a ficha devo ver 2 exercícios

  Cenário: Editar ficha existente
    Dado que tenho a ficha "Treino de Costas"
    Quando eu editar o nome para "Costas e Bíceps"
    E adicionar o exercício "Rosca Direta"
    E salvar
    Então o nome deve ser atualizado
    E a ficha deve conter 3 exercícios

  Cenário: Excluir ficha sem treinos vinculados
    Dado que tenho a ficha "Treino Teste"
    Quando eu deslizar para excluir
    E confirmar a exclusão
    Então a ficha não deve aparecer na listagem
    E os vínculos com exercícios devem ser removidos

  Cenário: Tentar salvar ficha sem nome
    Dado que estou criando uma nova ficha
    Quando eu deixar o nome vazio
    E tocar em "Salvar"
    Então devo ver a mensagem "Nome da ficha é obrigatório"
    E a ficha não deve ser salva

  Cenário: Reutilizar exercício em múltiplas fichas
    Dado que o exercício "Supino Reto" existe no banco
    Quando eu adicioná-lo na ficha "Peito"
    E também adicioná-lo na ficha "Full Body"
    Então ambas as fichas devem exibir o exercício
    E o exercício deve ter os mesmos dados base
```

```gherkin
# language: pt-br
Funcionalidade: Gerenciar Exercícios
  Como usuário
  Quero criar exercícios personalizados
  Para montar minhas fichas de treino

  Cenário: Criar novo exercício
    Dado que estou na tela de criação de exercício
    Quando eu preencher nome "Agachamento Livre"
    E definir 4 repetições
    E definir 120 segundos de descanso
    E salvar
    Então o exercício deve aparecer na lista de exercícios disponíveis

  Cenário: Buscar exercício por nome
    Dado que existem os exercícios "Supino Reto" e "Supino Inclinado"
    Quando eu buscar por "Supino"
    Então devo ver ambos os exercícios nos resultados

  Cenário: Editar parâmetros do exercício
    Dado que o exercício "Puxada Alta" tem 3 repetições
    Quando eu alterar para 4 repetições
    E salvar
    Então as fichas que usam este exercício devem refletir a alteração
```


## ✅ Critérios de Aceite por Feature

| ID    | Critério                                                                  | Tipo        |
|-------|---------------------------------------------------------------------------|-------------|
| CA1.1 | Usuário pode criar ficha com nome único (mín. 3 caracteres)               | Funcional   |
| CA1.2 | Usuário pode adicionar de 1 a 20 exercícios por ficha                     | Funcional   |
| CA1.3 | Exercícios podem ser reutilizados em múltiplas fichas                     | Funcional   |
| CA1.4 | Ao editar parâmetros de exercício, alteração reflete em todas as fichas   | Funcional   |
| CA1.5 | Exclusão de ficha não remove exercícios do banco                          | Integridade |
| CA1.6 | Validação em tempo real: nome vazio, exercícios duplicados na mesma ficha | UX          |
| CA1.7 | Operações CRUD respondem em < 100ms com até 50 fichas cadastradas         | Performance |