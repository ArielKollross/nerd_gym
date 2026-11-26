---
name: create-pull-request
description: Prepara ou abre pull requests do Nerd Gym com evidências de validação, checklist manual e capturas de tela para alterações visuais ou novas funcionalidades.
---

# Criar pull request do Nerd Gym

Confira a branch atual, o diff com `origin/master` e os commits incluídos. Use `master` como branch base e escreva o título e a descrição em PT-BR. Vincule a história, a SPEC ou a issue relevante. Use o [PR #16](https://github.com/ArielKollross/nerd_gym/pull/16) como exemplo de organização.

## Descrição

- **Resumo** — Explique o comportamento entregue e o motivo da mudança.
- **Evidências** — Registre os comandos executados, seus resultados e as verificações manuais realizadas. Indique o dispositivo, a plataforma e as condições relevantes. Para histórias com TDD, descreva o comportamento que falhou no RED e o que passou no GREEN. Identifique verificações pendentes.
- **Capturas de tela** — Inclua quando houver alteração visual ou nova funcionalidade. Capture o app em execução com dados de teste e mostre a tela ou o fluxo afetado. Para uma mudança visual, inclua antes e depois quando houver uma referência comparável. Para uma nova funcionalidade sem tela própria, mostre seu efeito no fluxo existente ou o resultado verificável da execução. Use legendas curtas e incorpore imagens acessíveis aos revisores no corpo do PR. Se a captura estiver bloqueada, registre o motivo e deixe a verificação pendente.
- **Checklist de testes manuais** — Escreva caixas desmarcadas com os pré-requisitos, as ações e o resultado esperado para o revisor reproduzir. Registre testes já realizados na seção de evidências.

## Publicação

Quando o usuário pedir a abertura, publique a branch de trabalho e crie o PR com base em `master`. Se já houver um PR aberto para a branch, use-o em vez de criar uma duplicata. Com GitHub CLI, salve a descrição em um arquivo temporário e passe-o com `gh pr create --body-file`. Confira a URL retornada e informe-a ao usuário.
