# T3.7 — Navegação

As rotas `/`, `/workouts`, `/progress` e `/profile` compartilham o navegador `(tabs)`, o cabeçalho e a barra da fase 2. O treino `/workout/[id]` permanece no Stack raiz; fechar retorna ao contexto anterior, com Início como fallback em acesso direto. A criação continua em Modal dentro de Treinos, sem persistência. Tema, conta e rotinas ficam nos providers da raiz durante a sessão.

## Reproduzir a validação web

1. Em `gym-app/`, executar `npm run web -- --port 8092`.
2. Iniciar Chrome com `--remote-debugging-port=9232` usando perfil de teste.
3. Executar `node scripts/navigation.browser.cjs` (Node com WebSocket global).

O script cobre quatro abas e seleção acessível, atalho de perfil, cancelamento da criação, retorno do treino a Início/Treinos, URLs diretas e larguras 320/390/720/1280. Também verifica criação, troca de tema entre abas, execução da rotina criada e descarte da rotina após reinicializar a sessão web. Capturas em `/tmp/nerd-gym-t37-*.png`.

## Resultado automatizado

Em 13/11/2026: lint sem avisos, `npx tsc --noEmit` sem erros, quatro arquivos de testes Node aprovados e todos os cenários do script de navegação aprovados.

## Verificação nativa pendente

O layout da barra foi conferido em Android físico, conforme registro abaixo. A validação completa dos fluxos em Android e iOS permanece pendente: repetir os fluxos acima e verificar áreas seguras, teclado no Perfil/criação, botão Voltar do Android e retorno do treino. A validação web não substitui essas verificações.

## Correção no Android físico

Após relato de abas sem espaçamento, a captura do aparelho confirmou botões agrupados à esquerda. O estilo funcional de `Pressable` não estava aplicando `flex: 1`, altura e espaçamentos nessa renderização nativa. Os estilos de layout das abas passaram a ser um objeto estático. A captura após Fast Refresh confirmou quatro abas igualmente distribuídas, com rótulos separados e indicador ativo visível. Lint e TypeScript passaram após a correção. Isso valida o layout inferior no aparelho conectado; os demais fluxos nativos e iOS continuam pendentes.

## Capturas

- [Barra corrigida no Android](screenshots/t3-7/android-navigation.png)
- [Navegação web em 1280 px](screenshots/t3-7/web-navigation.png)
