# Fundação visual do Nerd Gym — Fase 1

## Intenção

Preparar no app Expo ativo (`gym-app/`) a fundação visual usada pelas telas das fases seguintes: tokens coerentes para os temas claro e escuro, DM Sans e Manrope empacotadas localmente e a imagem do hero disponível como recurso local. O objetivo é aproximar a identidade visual do protótipo sem portar HTML ou CSS da web.

## Escopo

- Consolidar cores, superfícies, texto, bordas, espaçamentos, raios e papéis tipográficos identificados no protótipo em tokens consumíveis por React Native e NativeWind.
- Preservar o acompanhamento da preferência do sistema que já existe e deixar os dois esquemas preparados para o controle manual demonstrativo a ser conectado ao Perfil na Fase 3.
- Carregar localmente os pesos necessários de DM Sans e Manrope com a API compatível com Expo SDK 58, incluindo comportamento de carregamento que não deixe texto invisível.
- Empacotar localmente a imagem usada pelo hero do protótipo, pronta para composição responsiva e camada de contraste na tela Início da Fase 3.

## Fora de escopo

- Compor telas, navegação, controle de tema no Perfil, treino ativo ou a composição final do hero.
- Implementar persistência, autenticação, anúncios integrados, métricas ou outros comportamentos funcionais.
- Copiar seletores CSS ou elementos DOM para o app nativo.

## Abordagens consideradas

1. **Completar a fundação antes das telas (escolhida):** introduzir tokens, fontes e imagem na Fase 1; ligar controle e apresentação nas fases 2 e 3. Respeita as dependências e a ordem da história, com o custo de não demonstrar ainda a troca manual de tema.
2. **Antecipar Perfil e treino ativo:** criar telas mínimas agora para comprovar imediatamente o alternador. Isso adianta navegação e componentes e mistura o escopo das fases; foi descartado.
3. **Manter fontes/imagem remotas e apenas estilizar:** reduz trabalho inicial, mas não atende ao requisito de recursos essenciais locais nem garante aparência offline; foi descartado.

## Restrições

- O app ativo é Expo SDK 58, React Native e NativeWind 4; rotas ficam em `gym-app/src/app/` e código compartilhado fora dessa pasta.
- A referência visual é `UI_example_figma/`; a implementação deve ser nativa e funcionar em iOS, Android e web.
- Antes de cada tarefa, revalidar os componentes e seletores no protótipo. Se a referência descrita divergir do protótipo atual, interromper essa tarefa e perguntar.
- Não há mudança de comportamento do produto nesta fase. A preferência do dispositivo continua como padrão até o controle de tema ser conectado ao Perfil na Fase 3.

## Decisões deixadas ao implementador

- Estender o tema e o CSS/configuração NativeWind existentes, evitando duplicar sistemas de tokens.
- Consultar a documentação oficial do Expo SDK 58 antes de usar APIs de fontes ou imagem, e selecionar recursos locais adequados ao licenciamento e ao empacotamento do app.
- Manter valores e estados nomeados segundo seus papéis visuais; não transportar nomes de seletores CSS como uma API de componentes.

## Referências e aceite

- `histories/MVP/0-implementar-figma.md`
- `histories/MVP/6-Implementação Figma - Fase 1 Fundação Visual.md`
- `UI_example_figma/src/index.css` e `UI_example_figma/src/App.tsx` (âncoras atuais devem ser verificadas tarefa a tarefa)
- Aceite da fase: tokens claros/escuros prontos para consumo, fontes locais carregadas sem texto invisível e imagem local disponível com enquadramento/contraste a compor na Fase 3.

## Verificação planejada

Executar `npm run lint` e `npx tsc --noEmit` em `gym-app/` ao concluir a fase. A história também pede validação visual em iOS, Android e web; qualquer plataforma indisponível será informada no relatório.
