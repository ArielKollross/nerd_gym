## Feature 5: Acompanhamento de Progresso por Exercício
Prioridade: 🟡 Média | Dependências: Feature 3

### 📝 Histórias de Usuário

- HU-17: Como usuário, quero visualizar a evolução de cargas por exercício
- HU-18: Como usuário, quero ver meu histórico de treinos realizados

## 🧩 Tarefas Técnicas

T5.1 - Implementar tela de histórico

- Listar todos os treinos realizados
- Exibir data, ficha utilizada, duração total
- Permitir filtrar por período

T5.2 - Criar detalhamento por exercício

- Gráfico de evolução de carga por exercício
- Mostrar volume total ao longo do tempo
- Exibir tabela com últimos registros

T5.3 - Exportar dados (futuro)

- Preparar estrutura para exportação JSON/CSV

### 🧪 Especificações BDD

```gherkin
# language: pt-br
Funcionalidade: Histórico e Progresso
  Como usuário
  Quero ver meu histórico de treinos
  Para acompanhar minha evolução em cada exercício

  Cenário: Ver histórico de treinos realizados
    Dado que realizei 5 treinos nos últimos 30 dias
    Quando eu acessar a tela de Histórico
    Então devo ver uma lista com os 5 treinos
    E cada item deve mostrar data, nome da ficha e volume total

  Cenário: Ver evolução de carga por exercício
    Dado que selecionei o exercício "Supino Reto"
    Quando eu visualizar o gráfico de evolução
    Então devo ver a progressão de cargas ao longo do tempo
    E devo ver o maior peso registrado em destaque

  Cenário: Filtrar histórico por período
    Dado que estou na tela de Histórico
    Quando eu filtrar por "Últimos 7 dias"
    Então devo ver apenas os treinos dessa semana
```