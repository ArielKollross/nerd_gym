# Nerd Gym

Projeto de rastreamento de treinos de academia. Este repositório contém a especificação do produto, histórias de usuário, skills de agentes de IA e o app mobile como submódulo.

| Repositório | Conteúdo |
|---|---|
| [nerd_gym](https://github.com/ArielKollross/nerd_gym) | Specs, histórias MVP e skills |
| [nerd-gym](https://github.com/ArielKollross/nerd-gym) | App Expo/React Native |

## Clonar o projeto

### Opção recomendada (com submódulo)

```bash
git clone --recurse-submodules https://github.com/ArielKollross/nerd_gym.git
cd nerd_gym
```

### Se já clonou sem o submódulo

```bash
git clone https://github.com/ArielKollross/nerd_gym.git
cd nerd_gym
git submodule update --init --recursive
```

### Instalar dependências do app

```bash
cd nerd-gym
npm install
npm start
```

## Estrutura

```
nerd_gym/
├── SPEC.md              # Especificação do produto
├── histories/           # Histórias de usuário (MVP)
├── .cursor/skills/      # Skills para Cursor
├── .claude/skills/      # Skills para Claude
└── nerd-gym/            # App mobile (submódulo Git)
```

## Trabalhar com o submódulo

O código do app fica em `nerd-gym/`, que é um repositório Git separado.

```bash
# Entrar no app
cd nerd-gym

# Fazer alterações, commitar e enviar
git add .
git commit -m "feat: minha alteração"
git push

# Voltar ao repo pai e atualizar a referência do submódulo
cd ..
git add nerd-gym
git commit -m "chore: update nerd-gym submodule"
git push
```

## Atualizar o submódulo (pull)

```bash
git pull
git submodule update --init --recursive
```

Para puxar a última versão do app dentro do submódulo:

```bash
cd nerd-gym
git pull origin master
cd ..
git add nerd-gym
git commit -m "chore: update nerd-gym submodule"
git push
```
