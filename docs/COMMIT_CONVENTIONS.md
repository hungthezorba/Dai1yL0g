# Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) so history is readable, changelogs can be generated later, and agents can tie each commit to a **user story** (`US-XXX`).

## When to Commit

Per `docs/HARNESS.md`, when a user story reaches **`implemented`**:

1. Run validation (`npm run validate:quick` or the story’s listed proof).
2. Update the story packet, test matrix, and harness trace.
3. **Commit** all related product and harness doc changes in one logical commit (or a small, ordered series).
4. **Push to `main`** so `main` always reflects the latest shipped story work.

Do not commit on partial work, failed validation, or `planned` / `in_progress` stories unless the human explicitly asks for a WIP commit.

## Commit Message Format

```text
<type>(<scope>): <short summary>

[optional body — what and why, not a file list]

[optional footer — Refs, Breaking Changes, Co-authored-by]
```

### Rules

| Rule | Detail |
| --- | --- |
| **Subject line** | ≤72 characters; imperative mood (“add”, not “added”). |
| **Type** | Required; see table below. |
| **Scope** | Optional but recommended — feature area (`capture`, `clip`, `harness`, `router`). |
| **Story reference** | Include `US-XXX` in the subject or a `Refs: US-XXX` footer when the change completes or updates a story. |
| **Body** | Explain *why* and non-obvious *what*; wrap at ~72 characters. |
| **Breaking changes** | Start a footer with `BREAKING CHANGE:` and describe migration. |

### Types

| Type | Use for |
| --- | --- |
| `feat` | New user-visible behavior or story acceptance criteria met |
| `fix` | Bug fix (production or dev workflow) |
| `docs` | Documentation only (product, harness, decisions, stories) |
| `refactor` | Code change without behavior change |
| `test` | Tests only |
| `chore` | Tooling, deps, config, scripts (no product behavior) |
| `build` | Native build, EAS, Gradle, Xcode project changes |
| `ci` | CI/CD workflow changes |
| `perf` | Performance improvement |
| `revert` | Reverts a prior commit; include original SHA in body |

Avoid vague subjects: `update code`, `fix stuff`, `WIP`, `changes`.

### Scopes (Dai1yL0g)

| Scope | Area |
| --- | --- |
| `capture` | Camera, record UI, permissions |
| `clip` | Local clip storage, day bucket, upload prep |
| `router` | expo-router, navigation |
| `feed` | Social feed (future) |
| `compile` | Vlog stitch / export (future) |
| `auth` | Sign-in, profile (future) |
| `harness` | Harness docs, CLI records, matrix, traces |
| `deps` | `package.json` / lockfile only |

## Examples

### Feature story completion

```text
feat(capture): US-002 local clip and today timeline

Hold-to-record saves clips under documentDirectory with day bucket index.
Timeline strip sorts by capturedAt; thumbnails optional via native module.

Refs: US-002
```

### Harness-only follow-up

```text
docs(harness): record US-002 native module incidents in decision 0008

Refs: US-002
```

### Bug fix

```text
fix(router): import useIsFocused from expo-router for SDK 56

Removes direct @react-navigation/native dependency that breaks the bundler.

Refs: US-002
```

### Dependency / native

```text
chore(deps): add expo-file-system and expo-haptics for US-002

Rebuild dev client required after this commit.

Refs: US-002
```

## Git Safety (required)

- **Never** commit secrets (`.env`, API keys, credentials, `harness.db`).
- **Never** `git push --force` to `main` unless the human explicitly requests it.
- **Never** skip hooks (`--no-verify`) unless the human explicitly requests it.
- **Never** amend a commit that was already pushed to `main`.
- Before push: `git status`, `git diff`, confirm only intended files are staged.
- If `main` is behind remote: `git pull --rebase origin main` (or merge per team habit), then push.

## Push to `main` Workflow

After a clean commit on the current branch:

```bash
git checkout main
git pull origin main
git merge <your-branch>   # or commit directly on main if already there
git push origin main
```

If you work on a short-lived branch, merge to `main` before push so **`main` is the integration branch** for completed stories.

Prefer **one commit per implemented story** when the diff is cohesive. Use multiple commits only when they are independently revertible (e.g. `feat` then `docs(harness)`).

## Agent Checklist (story → `main`)

- [ ] Story status `implemented` in packet and `harness-cli story update`
- [ ] `npm run validate:quick` (or story proof) passed
- [ ] Harness trace recorded
- [ ] Commit message follows this document and references `US-XXX`
- [ ] Pushed to `origin main`
- [ ] Final response includes commit SHA and push confirmation
