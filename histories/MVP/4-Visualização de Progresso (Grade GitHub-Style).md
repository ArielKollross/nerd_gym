## Feature 4: Visualização de Progresso (Grade GitHub-Style)
Prioridade: 🟡 Média | Dependências: Feature 3 (precisa de dados de treino)

### 📝 Histórias de Usuário

- HU-14: Como usuário, quero ver uma grade anual dos meus treinos
- HU-15: Como usuário, quero identificar dias com mais treinos pela intensidade da cor
- HU-16: Como usuário, quero ver meu progresso mensal em gráficos

### 🧩 Tarefas Técnicas

T4.1 - Criar componente de grade de contribuição

- Implementar grid 7×53 (dias da semana × semanas do ano)
- Desenvolver lógica de cálculo de intensidade:
- 0 treinos: cinza claro
- 1 treino: verde claro
- 2 treinos: verde médio
- 3+ treinos: verde escuro
- Criar tooltip com informações do dia (data, nº de treinos)
- Permitir scroll horizontal para ver ano completo

T4.2 - Desenvolver gráfico mensal de evolução

- Gráfico de linha/barra mostrando volume total por treino
- Filtro por período mensal
- Exibir dados de uma ficha específica
- Calcular volume total (somatório de peso × repetições)
- Implementar com biblioteca de charts (victory-native ou react-native-chart-kit)

T4.3 - Criar queries de agregação

- Query para contar treinos por dia
- Query para calcular volume mensal por ficha
- Indexar tabela workout_logs por data

### 🧪 Especificações BDD

```gherkin
# language: pt-br
Funcionalidade: Grade de Contribuição Anual
  Como usuário
  Quero visualizar minha frequência de treinos no ano
  Para acompanhar minha consistência

  Cenário: Exibir grade com diferentes intensidades
    Dado que treinei 3 vezes no dia 15 de junho
    E treinei 1 vez no dia 20 de junho
    E não treinei no dia 25 de junho
    Quando eu visualizar a grade anual
    Então o dia 15 deve aparecer em verde escuro
    E o dia 20 deve aparecer em verde claro
    E o dia 25 deve aparecer cinza

  Cenário: Ver detalhes de um dia específico
    Dado que a grade está visível
    Quando eu tocar em um quadrado do dia 10 de março
    Então devo ver um tooltip com "10/03/2026 - 2 treinos"

  Cenário: Grade de ano sem treinos
    Dado que nunca realizei nenhum treino
    Quando eu visualizar a grade
    Então todos os quadrados devem estar cinza
    E devo ver uma mensagem "Inicie seu primeiro treino!"

  Cenário: Navegar entre meses na grade
    Dado que estou vendo a grade anual
    Quando eu deslizar horizontalmente
    Então devo navegar pelos meses do ano
```
```gherkin
# language: pt-br
Funcionalidade: Gráfico Mensal de Evolução
  Como usuário
  Quero acompanhar a evolução dos meus treinos
  Para medir meu progresso ao longo do tempo

  Cenário: Visualizar evolução mensal por ficha
    Dado que selecionei a ficha "Treino de Costas"
    E estou vendo o mês de Junho/2026
    Quando o gráfico for carregado
    Então devo ver uma linha do volume total por dia de treino
    E o eixo X deve mostrar os dias do mês
    E o eixo Y deve mostrar o volume em kg

  Cenário: Mês sem treinos da ficha selecionada
    Dado que selecionei a ficha "Treino de Pernas"
    E não há treinos registrados em Junho/2026
    Quando o gráfico for carregado
    Então devo ver a mensagem "Nenhum treino registrado neste período"

  Cenário: Navegar entre meses
    Dado que estou vendo o gráfico de Junho/2026
    Quando eu tocar na seta "mês anterior"
    Então devo ver os dados de Maio/2026
```

## ✅ Critérios de Aceite por Feature

| ID    | Critério                                                                 | Tipo        |  
|-------|--------------------------------------------------------------------------|-----------  |
| CA4.1 | Grade mostra exatamente 365 dias (ou 366 em ano bissexto)                | Funcional   |
| CA4.2 | Cores calculadas: 0=cinza, 1=verde claro, 2=verde médio, 3+=verde escuro | Funcional   |
| CA4.3 | Tooltip mostra data e quantidade de treinos ao tocar quadrado            | UX          |
| CA4.4 | Gráfico mensal mostra volume total por dia                               | Funcional   |
| CA4.5 | Navegação entre meses é fluida (transição < 300ms)                       | Performance |
| CA4.6 | Grade carrega em < 500ms com 365 dias de dados                           | Performance |
