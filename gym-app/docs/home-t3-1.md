# Início — T3.1

A rota `/` compõe o hero com imagem local, sequência, próximo treino, três exercícios de prévia, banner demonstrativo e atividade anual. Conteúdo centralizado em até 720 pontos, com rolagem vertical; o calendário anual mantém sua própria rolagem horizontal.

Os dados reproduzem a demonstração do protótipo: quinta-feira, 22 de maio de 2025; Upper Power com quatro exercícios e duração de 52 minutos; 94 treinos, sequência de 8 dias e 12 treinos no mês. Esses números são ilustrativos e não mudam ao abrir a sessão. A grade reutiliza os dados determinísticos e os três níveis já aprovados na fase 2.

`Iniciar treino` abre `/workout/1`, usando a mesma rotina do resumo. Essa entrada mínima mostra Supino reto, prescrição, séries ilustrativas e progresso inicial de 0%. `Fechar treino` retorna ao destino anterior, com retorno a `/` quando não há histórico de navegação do app. Um id não disponível redireciona para `/`.

Avanço e finalização ficam para T3.6. Abas, cabeçalho global e atalho de Perfil ficam para T3.7. O catálogo da fase 2 permanece acessível pelo link no fim da tela em desenvolvimento e pela rota `/catalog`.

## Conferência manual

1. Executar `npm run web` (ou `npm start` para dispositivo) e abrir `/`.
2. Conferir a imagem local, os textos e os três primeiros exercícios de Upper Power, com indicador `+1`.
3. Percorrer a tela até as métricas; rolar horizontalmente a grade e consultar um dia.
4. Repetir em largura estreita (320 pontos) e larga, com temas claro e escuro do sistema. O conteúdo deve permanecer legível e a página não deve transbordar horizontalmente.
5. Iniciar o treino; conferir Upper Power, Supino reto, 4 séries e 8–10 repetições. Fechar e conferir que os dados demonstrativos de Início não mudaram.
6. Na web, acessar diretamente `/workout/1`, fechar e conferir o retorno a Início. Acessar `/workout/999` e conferir o redirecionamento.
7. Em iOS e Android, repetir com áreas seguras, botão Voltar/gesto de retorno, fonte ampliada e leitor de tela.

## Verificações

```sh
npm run lint
npx tsc --noEmit
node scripts/activity.test.cjs
npx expo export --platform all --output-dir /tmp/nerd-gym-t31-export-final
```

Exportar bundles não substitui executar o app em um dispositivo.

## Registro — 2026-11-12

- Lint, TypeScript, três testes de atividade e exportação iOS/Android/web passaram.
- Chrome headless no servidor Expo normal: 320 × 1000 e 1200 × 1000, nos temas claro/escuro, sem transbordamento horizontal da página. A grade apresentou 848 px de conteúdo em áreas de 280/680 px, com rolagem própria.
- Imagem local carregada; conteúdo principal conferido visualmente. Iniciar/fechar, acesso direto à sessão e id inválido passaram, sem exceções nem erros de console/hidratação.
- Capturas locais: `/tmp/nerd-gym-t31-{320,1200}-{light,dark}.png`. Roteiro automatizado da sessão: `/tmp/nerd-gym-t31-browser.cjs`.
- Revisão independente do código, incluindo ajustes de hidratação e acessibilidade, sem achados acionáveis.
- Validação visual e interações em dispositivos iOS/Android, fonte ampliada e leitor de tela permanecem pendentes.
