# Fundação Visual do Figma — Plano de Implementação

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIA: Use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar este plano tarefa a tarefa. As etapas usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** preparar no app Expo tokens para temas claro/escuro, tipografia local DM Sans/Manrope e o recurso local do hero para uso nas fases posteriores.

**Arquitetura:** centralizar os tokens semânticos e a hierarquia tipográfica nos módulos existentes de tema; carregar fontes locais na raiz Expo Router com fallback durante o carregamento; disponibilizar a imagem como asset estático importável. Não compor telas da Fase 3 nesta entrega.

**Stack:** Expo SDK 58, React Native 0.88, Expo Router, NativeWind 4.2.7, `expo-font` e `expo-splash-screen` já instalados.

**Spec:** `docs/superpowers/specs/2026-11-11-gym-figma-phase-1-design.md`; aceite detalhado em `histories/MVP/6-Implementação Figma - Fase 1 Fundação Visual.md`.

## Restrições globais

- Expo `~58.0.17`; NativeWind `4.2.7`; seguir documentação Expo v58 para APIs.
- Implementar em React Native; não copiar DOM ou CSS da referência web.
- Código compartilhado fica fora de `gym-app/src/app/`, exceto a integração no layout raiz necessária para carregar fontes.
- A preferência do sistema continua padrão; a ação do Perfil e a propagação ao treino ativo ficam para a Fase 3.
- Antes de cada tarefa, revalidar os anchors no protótipo atual. Divergência material exige consulta à pessoa usuária antes de continuar aquela tarefa.
- Não introduzir integração remota para fontes ou imagem nem adicionar dependência se os pacotes atuais resolverem a tarefa.

## Foco de revisão

- Falha ao carregar arquivos de fonte: o app deve continuar legível com fallback e não ficar preso na tela de abertura. (Tarefa 2: garantir caminho de fallback em carregamento com erro.)
- Pesos e nomes de família divergentes entre iOS, Android e web: os nomes registrados devem corresponder aos nomes usados pelos tokens. (Tarefa 2: conferir configuração e tipo.)
- Mudança da preferência do sistema entre claro e escuro: tokens de ambas as aparências devem existir sem exigir controle manual nesta fase. (Tarefa 1: conferir pares semânticos.)
- Imagem não empacotada ou importada por URL: o recurso deve ser local e referenciável estaticamente. (Tarefa 3: conferir caminho e referência estática.)
- Referências de protótipo alteradas ou anchors errados: não transportar valores incorretos. (Cada tarefa: reabrir os anchors em `App.tsx`/`index.css` e parar para perguntar se houver divergência.)

---

### Task 1: Tokens e temas claro/escuro

**Arquivos:**
- Modificar: `gym-app/src/constants/theme.ts`
- Referência: `UI_example_figma/src/index.css` (`:root` e `.theme-dark`); `UI_example_figma/src/App.tsx` (estado `theme` e uso no hero/treino ativo)

**Interfaces:**
- Consome: valores atuais da referência, revalidados antes da edição.
- Produz: paletas tipadas `light` e `dark` com papéis semânticos. Valores de referência light: ink `#171915`, paper `#f6f7f1`, muted `#73786e`, line `#dfe1d9`, lime `#c8f04c`, green `#1f6a46`; valores dark: ink `#f2f4ed`, paper `#151713`, muted `#989d93`, line `#343831`, lime `#c8f04c`, green `#9bcc70`. Mapear textos/superfícies recorrentes adicionais às cores observadas no protótipo, sem inventar estados de tela.

- [x] **Etapa 1:** conferir os anchors atuais `:root` e `.theme-dark` em `UI_example_figma/src/index.css`, e os usos de `theme` no `App.tsx`; se os valores/seletores descritos na Fase 1 não corresponderem, interromper e perguntar.
- [x] **Etapa 2:** ampliar os tipos e objetos `Colors`, `Spacing` e demais tokens existentes em `gym-app/src/constants/theme.ts`, preservando exports usados por `use-theme.ts`, nomeando papéis em vez de seletores CSS e evitando duplicar paletas em Tailwind.
- [x] **Etapa 3:** executar `npx tsc --noEmit` em `gym-app/` e confirmar que o tema tipado e o hook existente continuam válidos.

### Task 2: Fontes locais e hierarquia tipográfica

**Arquivos:**
- Criar: arquivos DM Sans e Manrope necessários em `gym-app/assets/fonts/`
- Modificar: `gym-app/src/constants/theme.ts`
- Modificar: `gym-app/src/app/_layout.tsx`
- Referência: `UI_example_figma/src/index.css` (fontes globais, `.brand`, títulos, `.eyebrow`, `.streak` e `.section-heading`)

**Interfaces:**
- Consome: tokens da Tarefa 1; dependências atuais `expo-font` e `expo-splash-screen`.
- Produz: famílias tipográficas nomeadas em um local tipado; registro/carregamento local no layout raiz, com renderização normal após sucesso ou fallback legível após erro.

- [x] **Etapa 1:** revalidar no protótipo as famílias e pesos usados nos papéis de corpo, marca, títulos, rótulos e números; interromper e perguntar se divergirem da história.
- [x] **Etapa 2:** incluir arquivos de fonte variáveis licenciados de DM Sans e Manrope que cobrem os pesos usados, sem dependência de URL em runtime; manter licença/crédito correspondente junto aos assets.
- [x] **Etapa 3:** registrar os nomes das famílias e a hierarquia nos tokens tipográficos de `theme.ts`, alinhando cada peso aos arquivos locais disponíveis.
- [x] **Etapa 4:** carregar as fontes variáveis locais com `useFonts` no layout raiz conforme a documentação oficial do Expo v58; chamar `SplashScreen.preventAutoHideAsync()` em escopo global, manter a tela de abertura durante a carga e chamar `hideAsync()` após sucesso ou erro, liberando o app com fallback legível.
- [x] **Etapa 5:** executar lint e typecheck do app; conferir que layout, mapa de fontes e imports estão tipados. `npx tsc --noEmit` e lint focado dos arquivos alterados passaram; o lint global apontou erro preexistente em `src/hooks/use-color-scheme.web.ts`.

### Task 3: Asset local do hero

**Arquivos:**
- Criar: `gym-app/assets/images/home-hero.jpg` (ou formato equivalente otimizado mantendo o recorte e qualidade da origem)
- Criar: `gym-app/src/constants/assets.ts`
- Referência: `UI_example_figma/src/index.css` (`.hero` e `.hero:after`); `UI_example_figma/src/App.tsx` (seção `.hero`)

**Interfaces:**
- Consome: cores/contraste da Tarefa 1 e URL da imagem que já consta na referência do protótipo.
- Produz: referência estática local tipada/exportada para a futura tela Início; nenhuma leitura de rede em runtime.

- [x] **Etapa 1:** conferir o URL, enquadramento `center 33%` e sobreposições atuais do hero; se a referência estiver diferente do descrito, perguntar antes de escolher a imagem.
- [x] **Etapa 2:** obter a imagem de origem da referência, otimizar para uso no app sem alterar a composição reconhecível e guardar a informação de licença/crédito aplicável.
- [x] **Etapa 3:** exportar o asset com referência estática em `src/constants/assets.ts`, sem adicionar a exibição/composição do hero nesta fase.
- [x] **Etapa 4:** executar `npm run lint` e `npx tsc --noEmit` em `gym-app/`; conferir que o import estático do asset é aceito pelo TypeScript/Metro. Typecheck passou, lint focado passou, Expo Web export passou; lint global ainda sinaliza o erro preexistente descrito na Tarefa 2. A imagem fica local e pronta para empacotamento quando a tela Início consumir o export na Fase 3.

### Verificação da fase

- Executar `npm run lint` e `npx tsc --noEmit` em `gym-app/` após as três tarefas.
- Verificar que as fontes e a imagem são arquivos locais prontos para empacotamento, sem URLs de recursos essenciais em runtime.
- A história pede validação visual em iOS, Android e web. A validação da composição final do hero e do alternador manual fica para a Fase 3, quando essas telas e controles existirem.
- Neste estágio, o Expo Web export confirmou as duas fontes locais; o asset do hero é mantido como referência estática no projeto e só entra no bundle quando a futura tela o importar.
- `npm run lint` permanece bloqueado por `react-hooks/set-state-in-effect` em `src/hooks/use-color-scheme.web.ts` e um aviso de import não usado em `src/app/index.tsx`, ambos existentes antes das alterações da Fase 1.

### Fontes oficiais consultadas

- [Expo Font para SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/font/): fontes em recursos locais; `useFonts` atende iOS, Android e web; configuração de build é alternativa nativa.
- [Expo Image para SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/image/): recursos de imagem e compatibilidade multiplataforma.
- [Expo SplashScreen para SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen/): retenção e liberação da abertura enquanto recursos carregam.
