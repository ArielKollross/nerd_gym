# Fase 1 — Fundação Visual

## História de usuário

- HU-01: Como pessoa usuária do app, quero uma base visual legível e consistente para reconhecer sua identidade nos temas claro e escuro.
- HU-02: Como pessoa usuária, quero que tipografia e imagem de destaque estejam disponíveis localmente para que a interface tenha aparência consistente sem depender de recursos visuais remotos essenciais.

## Escopo e dependências

Esta fase prepara tokens, fontes e imagem para os componentes da fase 2. A aplicação ativa é `gym-app/`, que usa Expo Router e NativeWind; consulte `gym-app/AGENTS.md` e a versão Expo em `gym-app/package.json` antes de escolher APIs de implementação. Use documentação correspondente à versão instalada. Não copie seletores CSS ou elementos DOM: converta as referências em tokens/classes NativeWind e componentes React Native.

Antes de implementar cada tarefa, confira as referências no protótipo atual. Se a descrição divergir do protótipo ou uma referência indicar o seletor/componente errado, pergunte à pessoa usuária como proceder e aguarde a orientação antes de implementar a tarefa afetada.

## Tarefas técnicas

### T1.1 — Definir tokens e temas claro/escuro

**Objetivo:** estabelecer cores, superfícies, linhas, espaçamentos, raios e tipografia base que cubram os elementos vistos no protótipo nos dois temas.

**Origem na referência:**
- `UI_example_figma/src/index.css:4-20`, seletor `:root`: variáveis `--ink`, `--paper`, `--muted`, `--line`, `--lime` e `--green`, além das fontes globais e fundo da página.
- `UI_example_figma/src/index.css:199-239`, seletor `.theme-dark` e regras descendentes: valores escuros e ajustes de superfícies, cartões, campos, navegação, heatmap e treino ativo.
- `UI_example_figma/src/App.tsx:309-349`, componente `App`: estado demonstrativo `theme` e aplicação do modo na tela, inclusive no treino ativo.
- `UI_example_figma/src/App.tsx:453-469`, bloco `.theme-setting`: rótulo, ícone e controle que alterna claro/escuro.

**Resultado esperado em Expo:** definir tokens reutilizáveis e estratégia de tema claro/escuro adequada ao app. A preferência do dispositivo pode ser considerada onde fizer sentido, mantendo o controle demonstrativo do perfil. Recriar superfícies e contraste com NativeWind/React Native sem transportar CSS literal.

**Dependência:** nenhuma; base das tarefas desta fase e das fases 2 e 3.

**Critérios de aceite:**
- Há tokens para cores, superfícies, texto, linhas e demais valores recorrentes identificados na referência.
- As telas e estados contemplados pelas próximas fases permanecem legíveis nos temas claro e escuro, inclusive controles, estados inativos e desabilitados.
- A opção de tema possui estado visual claro e escuro e pode ser acionada pelo perfil; a troca afeta também o fluxo de treino ativo.

### T1.2 — Preparar tipografia da aplicação

**Objetivo:** reproduzir a hierarquia tipográfica da referência com DM Sans e Manrope de forma consistente.

**Origem na referência:**
- `UI_example_figma/src/index.css:1-2`, importações globais das famílias DM Sans e Manrope; `UI_example_figma/src/index.css:4-20`, seletor `:root` e regras globais incluindo `body` (linha 18): aplicação base da fonte.
- `UI_example_figma/src/index.css:23-38`, seletores `.brand`, `.hero h1`, `.eyebrow`, `.streak strong`: exemplos de marca, títulos, rótulos e números.
- `UI_example_figma/src/App.tsx:361-368`, bloco `.hero`: título de destaque e sequência de dias; `UI_example_figma/src/App.tsx:371-374`, `.section-heading`: título e duração do próximo treino.

**Resultado esperado em Expo:** incluir e carregar as famílias e pesos necessários como recursos locais do app, mapear a hierarquia visual a estilos/tokens NativeWind e garantir que o layout aguente o período de carregamento das fontes sem conteúdo ilegível. Verificar a API compatível com a versão Expo instalada antes da implementação.

**Dependência:** T1.1 para associar famílias e pesos aos tokens tipográficos.

**Critérios de aceite:**
- DM Sans e Manrope aparecem nos papéis visuais equivalentes à referência, incluindo títulos, corpo, números e rótulos.
- Fontes carregadas e fallback não provocam texto invisível ou mudança que corte títulos e controles em telas estreitas.
- A hierarquia continua legível nos temas claro e escuro.

### T1.3 — Disponibilizar a imagem de destaque localmente

**Objetivo:** remover a dependência de URL remota para a imagem essencial do hero da tela inicial.

**Origem na referência:**
- `UI_example_figma/src/index.css:28-30`, seletores `.hero` e `.hero:after`: imagem Unsplash, enquadramento, sobreposição e camada de contraste.
- `UI_example_figma/src/App.tsx:361-368`, componente `App` / seção `.hero`: texto e sequência sobrepostos à imagem.

**Resultado esperado em Expo:** adicionar um recurso de imagem local apropriado ao projeto e reproduzir enquadramento, sobreposição/contraste e posicionamento com componentes e estilos React Native/NativeWind. Não copiar a regra `background` CSS nem depender de URL remota no app.

**Dependência:** T1.1; a composição final é usada pela tarefa de Início na fase 3.

**Critérios de aceite:**
- O hero usa uma imagem empacotada localmente e é exibido sem conexão de rede.
- Texto e indicadores mantêm contraste e hierarquia sobre a imagem nos temas previstos.
- O recorte e a composição permanecem utilizáveis em telas estreitas e largas.

## Critério de conclusão da fase

Tokens, tipografia e imagem local estão prontos para consumo pelos componentes compartilhados. Esta fase não implementa telas completas, navegação nem integrações.
