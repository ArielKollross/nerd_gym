---

name: gym-app-changes
description: Use when implementing or changing a feature, fixing a bug, or updating behavior in the Nerd Gym Expo and React Native app.
---

# Changing the Gym App

Use this workflow for focused product changes in the active `gym-app/` application. Keep changes aligned with the user's request, the product specification, and the app's existing patterns.

## Start every task from `master` on a new branch

Before editing files:

1. Find the Git repository root and inspect `git status --short --branch`, the current branch, and `master`.
2. Never edit or commit task changes directly on `master`. Start each separate task from `master`, updating it only with a fast-forward from `origin/master` when available.
3. Preserve existing work. Do not reset, discard, or stash user changes. If the working tree is dirty, use an isolated worktree based on `master` when the task can be separated safely; if existing edits overlap or cannot be separated, clarify before editing.
4. Create a fresh branch from `master`, named for the work: `feat/<short-name>` for a feature, `fix/<short-name>` for a bug, or `chore/<short-name>` for maintenance. If that name already exists, add a short numeric suffix.
5. Confirm the new branch is active and based on `master` before editing. If Git cannot establish that safely, stop before editing and explain the blocker.

Creating the branch is mandatory, including for urgent fixes. A deadline is not a reason to edit on the current branch; if the new branch cannot be created safely, stop before changing files. Create one branch when a task starts and continue that same task on it across turns; create another branch from `master` for a separate task, even if the current branch already looks task-specific. Keep all task commits on the task branch. Open PRs against `master`; changes reach `master` through an approved PR and code review, never through direct commits. Do not push or publish unless the user asks.

## Understand the change

- Read the applicable `AGENTS.md` files and inspect nearby routes, components, hooks, and utilities before choosing where code belongs.
- For behavior or product-flow changes, consult the root `SPEC.md` and relevant `histories/` stories/workflows when present. Keep those documents in sync when requirements change.
- For a bug, attempt a focused reproduction or inspect relevant logs and trace the cause before changing code. Separate observed facts from assumptions. If reproduction or diagnosis is not possible, record why and which assumptions remain; do not present an unconfirmed cause as established.
- For an underspecified feature, infer only what existing product materials and patterns support. Ask about missing decisions that would materially change behavior, while continuing independent work.
- Keep the implementation focused. Do not add a dependency or broaden scope without a concrete need.

## Expo and app conventions

Before touching Expo, EAS, or React Native APIs, read the `expo` major version from `package.json`, then consult the matching versioned Expo documentation. For other Expo documentation, use the official docs index at `https://docs.expo.dev/llms.txt` and follow it to the relevant page; do not rely on remembered APIs.

- Use Expo Router for navigation. Screen routes belong in `src/app/`; shared components, hooks, and utilities belong outside it.
- If a dependency is needed, check SDK compatibility, Expo Go support, and native requirements first. Check whether native setup or a config plugin is needed, then use `npx expo install <package>`. Explain when a development build is required and verify the available setup path before treating the dependency as integrated.
- When Continuous Native Generation is in use and `ios/` or `android/` are absent, configure native behavior through app config or config plugins; do not create those directories by hand.
- Prefer mobile-first, performant, cross-platform solutions that match the current app.

## Verify and report

- Add or update automated checks when the repository has an appropriate test setup and the change benefits from regression coverage. Do not invent a test framework for a small change; document the available verification instead.
- Before calling an app change complete, run the app's required lint and typecheck commands from its `AGENTS.md`, plus focused checks relevant to the change. If a deadline prevents a check or platform verification, report that plainly and leave the work unverified rather than calling it complete.
- Summarize what changed, why, and the branch name. Keep the user informed if an unexpected constraint changes the approach.
