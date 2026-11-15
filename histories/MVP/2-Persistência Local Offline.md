# Feature 2: Persistência Local Offline

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** História 1; repetir cenários de histórico após história 3.

## Situação atual

Dados de treino ainda são demonstrativos e perdidos ao reiniciar. Conta e planos são demonstrações, sem autenticação.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T2.1 — Inicialização e operação offline

- [ ] **RED — antes de implementar:** escrever testes para abrir banco já existente sem rede, reabrir ficha criada e falha de inicialização com recuperação sem apagar dados.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Usar SQLite da história 1 como fonte de verdade e estado React como projeção. Não reinserir demos ao iniciar; banco novo começa vazio. Conferir assets locais e funcionamento do núcleo sem APIs externas ou login.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T2.2 — Integridade e interrupções

- [ ] **RED — antes de implementar:** escrever testes para transação interrompida não deixa ficha parcial, migrations repetidas preservam registros e erro de escrita não anuncia sucesso.
- [ ] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [ ] **GREEN — implementação mínima:** Validar integridade e recuperação com erro explícito e tentativa novamente; não apagar banco silenciosamente. Verificar encerramento durante escrita e reabertura no aplicativo instalado em modo avião, sem Metro. Backup automático, nuvem e exportação ficam futuros.
- [ ] Executar os mesmos testes e confirmar aprovação.
- [ ] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar testes automatizados, `npm run lint` e `npx tsc --noEmit` em `gym-app/` na futura implementação. Configurar script de testes na T1.1; hoje não existe.
- Validar fluxos em Android físico via ADB quando disponível, depois emulador/simulador; web como complemento. Conferir tema claro/escuro, teclado, acessibilidade e retorno de navegação.
- Não incluir autenticação, cobrança, anúncios reais ou sincronização para concluir esta história.

## Cenários BDD

```gherkin
# language: pt-br
Funcionalidade: Persistência Local Offline

  Cenário: Usar sem internet
    Dado que o aplicativo instalado contém uma ficha salva
    Quando abro o app em modo avião sem servidor de desenvolvimento
    Então posso consultar e editar a ficha

  Cenário: Interromper escrita
    Dado que uma alteração de ficha está em transação
    Quando a escrita falha antes do commit
    Então a ficha anterior permanece íntegra e o erro é exibido
```
