## Feature 2: Persistência Local Offline
Prioridade: 🔴 Alta | Dependências: Feature 1

### 📝 Histórias de Usuário

- HU-05: Como usuário, quero acessar meus dados sem conexão com internet
- HU-06: Como usuário, quero que meus dados estejam seguros no dispositivo

### 🧩 Tarefas Técnicas

T2.1 - Garantir funcionamento offline

- Verificar ausência de chamadas de rede
- Testar inicialização do app em modo avião
- Implementar verificação de integridade do banco local

T2.2 - Estratégia de armazenamento

- Confirmar SQLite como única fonte de verdade
- Implementar backup automático em arquivo (futuro)

### ✅ Critérios de Aceite por Feature

| ID    | Critério                                                          | Tipo        |
|-------|-------------------------------------------------------------------|-------------|
| CA2.1 | App funciona completamente offline após primeiro download         | Funcional   |
| CA2.2 | Dados persistem após fechar e reabrir o app                       | Funcional   |
| CA2.3 | Não há chamadas de API externas (verificar via network inspector) | Técnico     |
| CA2.4 | Banco SQLite não corrompe com interrupção durante escrita         | Resiliência |



