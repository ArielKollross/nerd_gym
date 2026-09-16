##  Fluxo do Usuário – Tela de Treino Ativo

### 1. Início do Exercício

- Ao iniciar um treino a partir de uma ficha, o primeiro exercício é carregado.
- O usuário vê:
  - Nome do exercício (ex: "Supino Reto").
  - Total de séries representado por círculos cinzas ⚪ (um para cada série).
  - Botão "Concluir Série" (habilitado apenas se houver séries não concluídas).
  - Campo de peso (kg) para preencher antes de concluir a série (sugere o último peso usado, se disponível).
  - Indicação do descanso programado (ex: "Descanso: 90s").

### 2. Marcação de Série Concluída

- O usuário executa o exercício.
- Preenche o peso utilizado (ou mantém o sugerido).
- Toca em "Concluir Série".
- Efeito imediato:
  - O círculo correspondente à série atual muda de ⚪ cinza para ✅ verde com check. (Use icones para isso marcar como concluido e não emojis)
  - O botão "Concluir Série" é desabilitado.
  - O temporizador de descanso inicia automaticamente, ocupando uma área de destaque na tela.

### 3. Temporizador de Descanso

- Exibe contagem regressiva em segundos (ex: "90s", "89s", ...).
- O usuário pode pular o descanso a qualquer momento tocando em "Pular Descanso".
- Ao final do tempo (ou ao pular):
  - Um alarme sonoro é disparado (se o dispositivo não estiver em modo silencioso; caso contrário, vibra).
  - O temporizador some.
  - O botão "Concluir Série" é reabilitado para a próxima série.
  - O campo de peso é limpo ou mantém o último valor (configurável).

### 4. Transição entre Séries e Exercícios

- O ciclo se repete até que todas as séries do exercício estejam concluídas (todos os círculos verdes ✅).
- Quando o usuário conclui a **última série**:
  - Se houver próximo exercício na ficha, a tela transiciona suavemente para ele, mostrando seus círculos (todos cinzas).
  - Se não houver mais exercícios, o treino é finalizado automaticamente e uma tela de resumo é exibida.

### 5. Pular Exercício

- Durante qualquer momento (inclusive durante o descanso), o usuário pode tocar em "Pular Exercício".
-Isso marca todas as séries restantes do exercício atual como "não realizadas" (círculos com ❌ ou traço) e avança para o próximo exercício imediatamente.

## Biblioteca para Temporizador (Expo)

- expo-notifications (já incluso no SDK do Expo): Agenda uma notificação local para o momento exato do fim do descanso. Se o app estiver em segundo plano, o sistema exibe a notificação com som/vibração.

- Contador em tela: Use a lib `expo-task-manager`, sincronizado com o horário alvo (calculado a partir do momento em que o descanso iniciou). Isso garante que, mesmo que o app volte do background, o contador mostre o tempo restante correto.


## BDD – Execução de Treino (Refinado)

```gherkin
# language: pt-br
Funcionalidade: Execução de treino com marcador de séries e descanso
  Como usuário
  Quero acompanhar o progresso de cada exercício, série por série
  E descansar entre as séries com um temporizador automático

  Contexto:
    Dado que tenho a ficha "Treino A" com o exercício "Supino" (3 séries, 90s descanso)
    E inicio o treino dessa ficha

  Cenário: Visualizar total de séries ao iniciar exercício
    Quando o treino carrega
    Então devo ver 3 círculos cinzas para o exercício "Supino"
    E o botão "Concluir Série" deve estar habilitado

  Cenário: Concluir primeira série e iniciar descanso
    Quando preencho o peso 50 kg
    E toco em "Concluir Série"
    Então o primeiro círculo deve mudar para verde com ✅
    E o temporizador deve exibir "90s" e iniciar a contagem regressiva
    E o botão "Concluir Série" deve ficar desabilitado

  Cenário: Pular descanso manualmente
    Dado que o temporizador está em "45s"
    Quando toco em "Pular Descanso"
    Então o temporizador deve desaparecer
    E o botão "Concluir Série" deve ser habilitado novamente
    E eu devo poder concluir a segunda série

  Cenário: Descanso finaliza naturalmente
    Dado que o temporizador está em "1s"
    Quando o tempo chega a 0
    Então um alarme sonoro deve tocar (ou vibrar, no modo silencioso)
    E o temporizador deve desaparecer
    E o botão "Concluir Série" deve ficar habilitado

  Cenário: Concluir todas as séries de um exercício
    Quando concluo a terceira série do "Supino"
    Então todos os círculos devem estar verdes ✅
    E a tela deve avançar para o próximo exercício da ficha
    E seus círculos devem aparecer todos cinzas

  Cenário: Pular exercício inteiro
    Dado que estou na segunda série do "Supino"
    Quando toco em "Pular Exercício"
    Então as duas séries restantes devem ser marcadas como não realizadas (❌)
    E devo ser levado ao próximo exercício imediatamente
```

## ✅ Critérios de Aceite Refinados

| ID     | Critério                                                               | Tipo        |
|-------|------------------------------------------------------------------------|-------------|
| CA3.1 | Todos os círculos de série aparecem cinzas no início do exercício      | Funcional   |
| CA3.2 | Ao concluir série, círculo correspondente muda para verde com check    | Visual      |
| CA3.3 | Só é possível concluir uma série se o peso for um número > 0           | Validação   |
| CA3.4 | Temporizador inicia automaticamente após conclusão de série            | Funcional   |
| CA3.5 | Botão "Concluir Série" fica desabilitado durante o descanso            | UX          |
| CA3.6 | Alarme sonoro dispara ao fim do descanso, exceto em modo silencioso    | Funcional   |
| CA3.7 | Temporizador continua preciso se o app ficar em segundo plano          | Resiliência |
| CA3.8 | Ao pular descanso, a próxima série já pode ser concluída imediatamente | Funcional   |
| CA3.9 | Última série do exercício concluída avança automaticamente ao próximo  | Funcional   |
