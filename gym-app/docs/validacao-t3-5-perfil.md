# Validação da T3.5 — Perfil

Rota: `/profile`. A conexão das abas e do atalho de Perfil pertence à T3.7.

1. Abrir a rota: tema inicial claro, formulário vazio e entrada indisponível.
2. Alternar tema e conferir contraste de campos, cartões, botões e textos.
3. Preencher apenas um campo ou usar espaços: entrada continua indisponível.
4. Usar e-mail e senha fictícios: entrada mostra o nome, e-mail e plano Free. A senha deixa de permanecer no formulário.
5. Acionar Experimentar Premium: cartão e selo mostram Premium. Voltar para o plano Free restaura Free.
6. Sair a partir de Free e Premium: formulário retorna com e-mail e senha vazios.
7. Confirmar aviso de demonstração nos três estados. Recuperação de senha, dados da conta e preferências ficam indisponíveis como ações sem fluxo implementado.
8. Recarregar o app: conta volta a logged-out e tema a claro, sem persistência.
9. Abrir diretamente `/profile` e acionar Voltar ao Início: destino `/`.
10. Repetir em 320, 390, 720 e 1280 px, nos dois temas. Usar conteúdo longo e rolar até as ações. Em iOS/Android, abrir o teclado e conferir que os campos e a entrada continuam alcançáveis; verificar também VoiceOver/TalkBack.
11. No campo SENHA, acionar Mostrar senha e Ocultar senha: o texto digitado permanece intacto e pode continuar sendo editado nos dois modos. Após entrar e sair, a senha volta a ficar oculta.

Verificação automatizada: `node --test --test-isolation=none scripts/*.test.cjs`, `npm run lint` e `npx tsc --noEmit`, dentro de `gym-app/`.

Validação nativa em iOS e Android permanece pendente neste ambiente.
