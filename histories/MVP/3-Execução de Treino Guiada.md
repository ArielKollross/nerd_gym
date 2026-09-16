## Feature 3: Execução de Treino Guiada
Prioridade: 🔴 Alta | Dependências: Feature 1

### 📝 Histórias de Usuário

- HU-07: Como usuário, quero iniciar um treino baseado em uma ficha
- HU-08: Como usuário, quero visualizar a sequência de exercícios
- HU-09: Como usuário, quero marcar séries como concluídas
- HU-10: Como usuário, quero ver o temporizador de descanso
- HU-11: Como usuário, quero ouvir alarme ao fim do descanso
- HU-12: Como usuário, quero pular exercícios durante o treino
- HU-13: Como usuário, quero registrar o peso utilizado em cada série

### 🧩 Tarefas Técnicas
T3.1 - Criar tela de execução de treino

- Desenvolver layout com lista de exercícios da ficha
- Implementar navegação entre exercícios
- Exibir dados do exercício atual (nome, repetições planejadas)

T3.2 - Implementar conclusão de séries

- Criar botão "Concluir Série" por exercício
- Registrar timestamp de conclusão
- Calcular e armazenar volume (peso × repetições)
- Prevenir duplo clique acidental

T3.3 - Desenvolver temporizador de descanso

- Iniciar contagem regressiva automaticamente após concluir série
- Exibir contador em tela cheia ou overlay
- Permitir pular/adiantar descanso manualmente
- Implementar lógica em background (AppState)

T3.4 - Configurar alarme sonoro

- Integrar biblioteca de áudio (react-native-sound)
- Disparar som ao final do temporizador
- Respeitar modo silencioso do dispositivo
- Oferecer opção de vibração

T3.5 - Implementar registro de peso por série

- Criar input de peso antes de concluir série
- Sugerir último peso utilizado (histórico)
- Validar entrada numérica
- Salvar no banco na tabela workout_logs

T3.6 - Permitir pular exercícios

- Adicionar ação "Pular" no exercício atual
- Registrar exercício como pulado no log
- Avançar para próximo exer## ✅ Critérios de Aceite por Feature

### 🧪 Especificações BDD

```gherkin
# language: pt-br
Funcionalidade: Executar Treino
  Como usuário
  Quero ser guiado durante meu treino na academia
  Para manter o ritmo e registrar meu desempenho

  Cenário: Iniciar treino baseado em ficha
    Dado que tenho a ficha "Treino de Costas" com 3 exercícios
    Quando eu tocar em "Iniciar Treino"
    Então devo ver o primeiro exercício "Puxada Alta"
    E ver "Repetições: 3"
    E ver o campo para informar o peso

  Cenário: Concluir série com peso
    Dado que estou executando "Puxada Alta"
    E informei o peso "40" kg
    Quando eu tocar em "Concluir Série"
    Então o temporizador de descanso de 60s deve iniciar
    E o volume de 120kg (40×3) deve ser registrado

  Cenário: Temporizador de descanso automático
    Dado que concluí uma série
    Quando o temporizador iniciar
    Então devo ver a contagem regressiva de 60 segundos
    E ao chegar em 0 um alarme sonoro deve tocar
    E o próximo exercício deve ser exibido

  Cenário: Pular exercício durante treino
    Dado que estou no exercício "Remada Curvada"
    Quando eu tocar em "Pular Exercício"
    Então devo avançar para o próximo exercício
    E o exercício pulado deve ser registrado como "não realizado"

  Cenário: Pular descanso manualmente
    Dado que o temporizador está em 45s restantes
    Quando eu tocar em "Pular Descanso"
    Então devo ir imediatamente para o próximo exercício
    E o temporizador deve ser cancelado

  Cenário: Finalizar treino
    Dado que completei todos os exercícios da ficha
    Quando o último exercício for concluído
    Então devo ver um resumo do treino
    E ver o volume total levantado
    E o treino deve ser salvo no histórico

  Cenário: Visualizar sequência de exercícios
    Dado que estou executando o treino
    Quando eu deslizar para baixo
    Então devo ver a lista completa de exercícios da ficha
    E o exercício atual deve estar destacado
    E os concluídos devem estar marcados com ✓
    E os pulados devem estar marcados como ignorados

  Cenário: Alarme sonoro respeitar modo silencioso
    Dado que o dispositivo está no modo silencioso
    Quando o temporizador chegar a 0
    Então o alarme sonoro NÃO deve tocar
    Mas o dispositivo deve vibrar
```

## ✅ Critérios de Aceite por Feature

| ID    | Critério                                                       | Tipo      |
|-------|----------------------------------------------------------------|-----------|
| CA3.1 | Temporizador inicia automaticamente após concluir série        | Funcional |
| CA3.2 | Alarme sonoro toca ao fim do descanso (exceto modo silencioso) | Funcional |
| CA3.3 | Temporizador continua rodando se app for para background       | Funcional |
| CA3.4 | Usuário pode pular exercício sem perder progresso dos demais   | Funcional |
| CA3.5 | Peso registrado deve ser numérico e positivo                   | Validação |
| CA3.6 | Volume calculado automaticamente (peso × repetições)           | Funcional |
