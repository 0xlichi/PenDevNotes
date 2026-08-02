# Commit Message Guidelines

First of all, thank you for taking the time to contribute! ❤️

To help keep the project's history clean and easy to navigate, I'd appreciate it if commit messages followed the conventions below. This makes it easier for everyone to understand changes and review the project's history.

## Commit Format

```text
<type>: <short description>
```

### A few recommendations

* Use **lowercase** for the description.
* Keep the message short and descriptive.
* Describe **what was changed**, not how it was implemented.
* Try to keep each commit focused on a single change whenever possible.

## Commit Types

| Type       | When to Use                                       | Example                               |
| ---------- | ------------------------------------------------- | ------------------------------------- |
| `feat`     | Adding a new feature                              | `feat: added mermaid renderer`        |
| `fix`      | Fixing a bug                                      | `fix: resolve search button overlap`  |
| `style`    | UI or styling changes                             | `style: improve scrollbar visibility` |
| `refactor` | Improving existing code without changing behavior | `refactor: simplify markdown parser`  |
| `docs`     | Documentation updates                             | `docs: update installation guide`     |
| `note`     | Adding or updating notes                          | `note: added ssh note`                |
| `chore`    | Maintenance tasks                                 | `chore: update dependencies`          |
| `test`     | Adding or updating tests                          | `test: add markdown renderer tests`   |
| `perf`     | Performance improvements                          | `perf: optimize content search`       |

## Examples

```text
feat: added content search button
feat: added mermaid renderer

fix: enable markdown tables
fix: resolve mobile sidebar issue

style: improve scrollbar visibility

note: added ssh note
note: added comprehensive sqli note
note: added jujutsu (jj)

docs: update readme
chore: update dependencies
refactor: simplify search logic
perf: optimize markdown rendering
```

## Pull Requests

When opening a pull request, it would be helpful if you could:

* Keep each pull request focused on a single feature, fix, or note.
* Use a descriptive branch name, such as:

  * `feat/mermaid-renderer`
  * `fix/copy-button`
  * `notes/ssh`
  * `notes/jj`
* Make sure the project builds successfully before submitting your pull request.

These aren't strict rules—they're simply guidelines to help keep the repository organized and make collaboration easier for everyone.

Thanks again for your contribution! Every improvement, big or small, is greatly appreciated.
