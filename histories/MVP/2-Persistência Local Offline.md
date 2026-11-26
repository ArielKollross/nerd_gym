# Feature 2: Persistência Local Offline

## Objetivo e dependências

Evoluir a interface entregue pelas histórias 0, 6, 7 e 8 para atender à SPEC. Projeto ativo: `gym-app/`; não implementar no legado.

**Dependências:** História 1; repetir cenários de histórico após história 3.

## Situação atual

A História 1 já grava fichas e a biblioteca de exercícios em SQLite. Esta história verifica a persistência entre reinicializações e trata falhas de abertura e escrita. Conta e planos são demonstrações, sem autenticação.

## Tarefas técnicas — TDD antes da implementação

Cada ciclo abaixo é obrigatório antes do código funcional correspondente. Configurar testes não equivale a comprovar o comportamento; BDD e inspeção visual não substituem testes automatizados.

### T2.1 — Inicialização e operação offline

- [x] **RED — antes de implementar:** escrever testes para abrir banco já existente sem rede, reabrir ficha criada e falha de inicialização com recuperação sem apagar dados.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Usar SQLite da história 1 como fonte de verdade e estado React como projeção. Não reinserir demos ao iniciar; banco novo começa vazio. Conferir assets locais e funcionamento do núcleo sem APIs externas ou login.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

### T2.2 — Integridade e interrupções

- [x] **RED — antes de implementar:** escrever testes para transação interrompida não deixa ficha parcial, migrations repetidas preservam registros e erro de escrita não anuncia sucesso.
- [x] Executar os testes e confirmar falha pelo comportamento ausente, não por erro de configuração.
- [x] **GREEN — implementação mínima:** Validar integridade e recuperação com erro explícito e tentativa novamente; não apagar banco silenciosamente. Backup automático, nuvem e exportação ficam futuros.
- [x] Verificar encerramento durante escrita e reabertura no aplicativo instalado em modo avião, sem Metro.
- [x] Executar os mesmos testes e confirmar aprovação.
- [x] **REFACTOR:** melhorar estrutura mantendo testes verdes; executar regressões relacionadas.

## Critérios de aceite e verificação

- Todas as tarefas acima têm testes aprovados com evidência RED → GREEN e comportamento descrito disponível.
- Testes unitários cobrem regras; testes de componentes cobrem entradas e ações; integração com SQLite real comprova persistência e transações. Mocks isolados não comprovam durabilidade.
- Executar `npm test`, `npm run lint` e `npx tsc --noEmit` em `gym-app/`.
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


## Evidências automatizadas

- **T2.1.** No RED, após a falha na leitura inicial, o botão de nova tentativa não abria outra conexão. No GREEN, ele fechou a conexão com erro, abriu o mesmo arquivo e exibiu a ficha. O teste em SQLite real também gravou em disco, fechou a conexão e encontrou a mesma ficha ao reabrir o arquivo.
- **T2.2.** No RED, a transação abortada pelo SQLite devolvia o erro da segunda tentativa de rollback. No GREEN, o repositório devolveu a causa original, preservou a ficha e a biblioteca e aceitou uma nova gravação. Os testes também exercitam migrações repetidas e verificam que a interface mantém o rascunho quando a gravação falha.

## Roteiro para o APK Android sem Metro

1. Com um APK normal instalado, crie uma ficha e encerre o app. Em modo avião, abra o app, consulte e edite a ficha. Encerre e reabra novamente para conferir a edição.
2. Gere um APK de teste com `EXPO_PUBLIC_RUN_SQLITE_TESTS=1` no ambiente da etapa que empacota o JavaScript. Use um dispositivo de teste. Na primeira abertura, o relatório deve exibir “Banco de teste vazio”.
3. Toque em “Pausar edição antes do commit”. Quando a tela indicar que a transação está pausada, encerre pelo ADB com `adb shell am force-stop <pacote>`. Reabra em modo avião e confirme que a tela volta a exibir “Ficha original íntegra”.


## Validação no Galaxy A54

- O APK de produção local iniciou em modo avião, sem Metro. A ficha criada no tema claro reapareceu após encerrar e abrir o app, foi editada no tema escuro e reapareceu com o nome atualizado após nova abertura. A validação via ADB usou os rótulos de acessibilidade dos campos e controles, o teclado para editar o nome e o botão Voltar do Android.
- No APK de integração, os cenários SQLite passaram. O app foi encerrado pelo ADB com a edição pausada antes do commit. Ao reabrir em modo avião, a ficha original e o vínculo com o exercício permaneceram íntegros.
- A conectividade do dispositivo foi restaurada e o APK normal reinstalado.
