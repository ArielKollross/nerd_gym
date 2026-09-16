##  Casos de Teste Manuais

| ID  | Cenário                        | Passos                           | Resultado Esperado                               |
|-----|--------------------------------|----------------------------------|--------------------------------------------------|
| CT1 | Criar ficha com 20 exercícios  | Adicionar limite máximo          | Performance aceitável, scroll funcionando        |
| CT2 | Interromper app durante treino | Fechar app e reabrir             | Treino mantém estado ou pergunta se quer retomar |
| CT3 | Modo avião                     | Ativar modo avião                | Todas funcionalidades funcionam normalmente      |
| CT4 | Notificações em background     | Iniciar descanso e minimizar app | Timer continua, alarme toca mesmo em bg          |
| CT5 | Rotação de tela                | Girar dispositivo                | Layout adapta sem quebrar                        |
| CT6 | Acessibilidade                 | Ativar TalkBack/VoiceOver        | Elementos navegáveis por leitor de tela          |


## ⚠️ Riscos e Mitigações

| Risco                                                       | Impacto | Probabilidade | Mitigação                                                               |
|-------------------------------------------------------------|---------|---------------|-------------------------------------------------------------------------|
| Performance com SQLite em dados antigos (>1 ano)            | Médio   | Média         | Implementar paginação e índices desde o início                          |
| Temporizador não funcionar em background (iOS/Android)      | Alto    | Média         | Usar bibliotecas nativas (react-native-background-timer)                |
| Biblioteca de gráficos não suportar customização necessária | Médio   | Baixa         | Avaliar 2-3 bibliotecas antes de implementar                            |
| Complexidade da grade 365 dias                              | Baixo   | Baixa         | Componente já existe em bibliotecas (react-native-github-contributions) |
