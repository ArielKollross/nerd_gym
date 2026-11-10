# Repository Guidelines

## Project Structure

This repository contains the product specification in `SPEC.md` and MVP stories and manual workflows in `histories/`. The active mobile app is `gym-app/`, an Expo and React Native project. Read its `AGENTS.md` for app-specific architecture and coding guidance. `UI_example_figma/` is a visual prototype/reference, not the production app. `nerd-gym/` is a legacy project scheduled for discontinuation; do not add new features there.

## Build, Test, and Development

Run app commands from the relevant project directory. For the active app, use:

```bash
cd gym-app
npm install       # install dependencies
npm start         # start Expo development server
npm run android   # launch on Android
npm run ios       # launch on iOS
npm run web       # launch web target
npm run lint      # run Expo lint checks
```

There is no root-level build or test command. `UI_example_figma/` has its own scripts; consult its `package.json` before running prototype tasks.

## Coding and Documentation Style

Follow the conventions in the target project's `AGENTS.md` and existing code. Keep product requirements in sync with `SPEC.md` and the relevant history when a change affects documented behavior. Prefer focused changes and descriptive names consistent with nearby files. Do not duplicate app-specific instructions in this root guide.

## Testing

No shared test framework or coverage requirement is configured at the repository root. Run `npm run lint` in `gym-app/` for app changes and use any project-specific checks documented in its guide. In pull requests, state which checks were run and note any manual platform verification.

## Commits and Pull Requests

Recent root commits use conventional prefixes such as `docs:` and `chore:`. Use a short, scoped subject (for example, `docs: clarify active app location`). Describe the purpose and affected project in each pull request, link related issues or specs, and include relevant screenshots for UI changes. Commit app changes within the app repository when applicable, then update the parent repository's submodule reference only if that project is still in use.
