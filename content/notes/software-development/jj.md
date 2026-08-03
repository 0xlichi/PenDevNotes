---
title: 'Jujutsu (jj) VCS Guide'
description: 'A practical reference for the Jujutsu version control system: setup, core concepts, daily commands, and common pitfalls.'
category: 'Version Control'
tags: ['jj', 'jujutsu', 'git', 'vcs', 'cli']
date: '2026-08-03'
---

# The Jujutsu (jj) VCS Guide

A practical reference for Jujutsu, a Git-compatible version control system with a simpler, safer working model.

> **Audience:** developers who know Git and want a clear mental model of jj, the commands you'll actually use, and the mistakes to avoid.

---

## 1. What jj Actually Is

Jujutsu (`jj`) is a separate version control system, not a Git wrapper, but it uses Git repositories as its storage backend. That means:

- It works on any existing Git repo (GitHub, GitLab, etc.), even if nobody else knows you're using it.
- You can run `git` commands alongside it ("colocated" mode).
- Your team can keep using plain Git while you use jj locally.

### Git vs. jj, at a glance

| Concept             | Git                              | jj                                                     |
| ------------------- | -------------------------------- | ------------------------------------------------------ |
| Staging area        | `git add` required               | None, your working copy _is_ the commit                |
| Branches            | Named pointer you're "on"        | "Bookmarks," optional labels, no "current branch"      |
| Editing old commits | `rebase -i`, easy to mess up     | Built-in; everything downstream auto-rebases           |
| Conflicts           | Block you until resolved         | Saved inside the commit; you keep working              |
| Undo                | Reflog, manual and opaque        | `jj undo`, one command, always works                   |
| Commit identity     | Just the hash (changes on amend) | Stable **change ID** plus a hash that changes on amend |

The one idea to internalize: **your working directory is always a commit.** There's no add/stage/commit ladder, you just edit files, and jj keeps the current commit in sync automatically.

---

## 2. Installation & Setup

```bash
brew install jj                     # macOS
cargo install --locked --git https://github.com/jj-vcs/jj.git jj-cli
pacman -S jujutsu                   # Arch Linux
```

Set your identity (note: `--user`, not Git's `--global`):

### List configuration

```bash
jj config list --user      # only user-level settings (global)
jj config list --repo      # only repo-level settings (local)
```

### Configuration

```bash
jj config set --user user.name "Your Name"           # author name shown in commits
jj config set --user user.email "you@example.com"    # author email shown in commits
jj config set --user ui.default-command "log"        # what runs when you type `jj` with no args
jj config set --user ui.editor "nvim"                 # editor for commands like `jj describe`
jj config set --user ui.pager "less -FRX"             # pager for long output (log, diff)
jj config set --user ui.diff-editor "nvim"            # editor for `jj split` / interactive diff editing
jj config set --user ui.color "auto"                  # enable color if terminal supports it
jj config set --user git.auto-local-branch true       # auto-create local bookmark when tracking a git branch
jj config set --user git.push-branch-prefix "push-"   # prefix for branch names when pushing anonymous changes
jj config set --user diff.format "git"                # show diffs in git-style unified diff format
jj config set --user signing.behavior "own"           # sign only your own commits
jj config set --user signing.backend "gpg"            # signing backend: gpg / gpg2 / ssh
jj config set --user signing.key "YOUR_KEY_ID"        # GPG/SSH key ID used for signing

[aliases]
l = ["log", "-r", "@ | ancestors(immutable_heads().., 2)"]  # shorthand: `jj l`
s = ["status"]                                                # shorthand: `jj s`
```

**Initialize JJ**

```bash
# Initialize a fresh project (new repo, no existing Git history)
jj git init

# Add jj to an existing Git repo (recommended starting point)
cd my-existing-git-repo
jj git init --colocate
```

This adds a `.jj` folder next to `.git`. Nothing about your Git repo changes, you can drop jj at any time. To clone fresh: `jj git clone <url>` (there's no native jj hosting yet, so cloning always goes through Git).

---

## 3. The Core Mental Model

**Change ID vs. commit hash.** Every commit has two IDs:

- **Change ID** (e.g. `kntqzsqt`), never changes, even as you edit the commit.
- **Commit hash** (e.g. `d7439b06`), the Git-compatible hash, which changes every time the content changes.

Use the change ID to refer to "that piece of work" across an entire editing session, even while you're rewriting it repeatedly.

**No staging.** Editing a tracked file instantly updates the current commit, there's no `git add` step, and new/deleted files are tracked automatically.

**`@` and revsets.** `@` means "the commit I'm on right now." A few you'll use constantly:

| Expression | Meaning                          |
| ---------- | -------------------------------- |
| `@`        | current commit                   |
| `@-`       | its parent                       |
| `@+`       | its children                     |
| `::@`      | all ancestors of `@`             |
| `main..@`  | commits in `@` but not in `main` |

These are called **revsets**, a small query language usable almost anywhere with `-r`.

---

## 4. Daily Commands

```bash
jj status               # jj st, what changed
jj diff                 # jj diff --git for a clean unified diff
jj log                  # graph view of history
jj describe -m "msg"    # jj desc, set the message on @
jj new [-m "msg"]       # finish this change, start a new one
```

**The everyday loop:** edit files, then `jj describe -m "..."`, then `jj new` to move on. Think of `jj new` as "I'm done here, start fresh." As a shortcut, `jj commit -m "msg"` does describe plus new in one step; it's the closest thing jj has to `git commit`.

**Editing an old commit:**

```bash
jj edit <change-id>
```

Moves `@` there. Make your edits, everything built on top of it rebases automatically. No `rebase --continue`, no manual replay.

**Rebasing:**

```bash
jj rebase -d main            # move @ onto main
jj rebase -s <rev> -d main   # move a commit + its descendants
jj rebase -b <rev> -d main   # move a whole bookmark's branch
```

Rebases always succeed, even if they produce conflicts, jj just flags the conflicted files in `jj status` and lets you keep going.

**Splitting and combining:**

```bash
jj split                  # break @ into two commits interactively
jj squash                 # fold @ into its parent
jj squash --into <rev>    # fold @ into any ancestor
jj absorb                 # auto-distribute uncommitted edits into the right ancestor commits
```

`jj absorb` is worth knowing: if you fix something that really belongs in an earlier commit (not the one you're on), it figures out which ancestor each hunk belongs to and applies it there automatically.

**Undo, your safety net:**

```bash
jj op log      # every operation you've ever run
jj undo        # revert the last operation
jj op restore <op-id>   # jump back to any earlier state
```

Since every command is logged and reversible, there's effectively no destructive command in jj.

---

## 5. Bookmarks (jj's Branches)

```bash
jj bookmark create <name> -r @    # create, pointing at @
jj bookmark set <name> -r <rev>   # move it
jj bookmark list
jj bookmark delete <name>
```

How they differ from Git branches:

- **No "current branch."** You never check one out, you just work on commits and point bookmarks at them when ready to push.
- **They don't follow you.** Committing more work doesn't move the bookmark forward automatically, you have to `jj bookmark set` it yourself.
- **They can conflict** (shown as `??`) if moved from two places at once. Resolve like any other conflict, it's not a hard failure.

Typical flow:

```bash
jj new main -m "Add feature X"
# ... edit ...
jj bookmark create feature-x -r @
jj git push -b feature-x
```

---

## 6. SSH Setup & Pushing to GitHub, GitLab, etc.

jj reuses your existing Git remote and SSH configuration, there's nothing jj-specific to set up beyond what Git already needs. If you can `git push` to a host today, jj can too.

### Generating an SSH key (skip if you already have one)

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Accept the default file location, set a passphrase if you want one, then start the agent and add the key:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Copy the public key and add it to your host:

```bash
cat ~/.ssh/id_ed25519.pub
```

- **GitHub:** Settings, SSH and GPG keys, New SSH key. Paste the contents.
- **GitLab:** Preferences, SSH Keys. Paste the contents.

Test the connection:

```bash
ssh -T git@github.com
ssh -T git@gitlab.com
```

### Cloning and connecting a remote

```bash
jj git clone git@github.com:user/repo.git
```

For a repo you already cloned with Git, or one you started fresh with `jj git init --colocate`, check or add the remote directly:

```bash
jj git remote list
jj git remote add origin git@github.com:user/repo.git
```

Use the SSH URL form (`git@host:user/repo.git`), not the HTTPS form, so your SSH key is what authenticates rather than a token or password prompt.

### Pushing

```bash
jj bookmark create main -r @        # if the bookmark doesn't exist yet
jj git push -b main                 # push one bookmark
jj git push --all                   # push every tracked bookmark
```

If you cloned with `jj git clone`, the remote is already named `origin` and set up correctly, `jj git push` just works once a bookmark points at your commit.

### Multiple remotes (GitHub and GitLab together)

```bash
jj git remote add github git@github.com:user/repo.git
jj git remote add gitlab git@gitlab.com:user/repo.git

jj git push --remote github -b main
jj git push --remote gitlab -b main
```

---

## 7. Working with Git Remotes

```bash
jj git fetch
jj git push -b <bookmark>
jj git push --all
```

Pushing is safe by default: jj only moves a remote bookmark if it still matches what jj last fetched, similar to `git push --force-with-lease`, without you having to ask for it. Note that jj doesn't infer the remote from "tracked" branches the way Git does, use `--remote` to target a non-default one.

---

## 8. Conflict Resolution

Conflicts live _inside_ commits rather than halting the whole repo:

- No `rebase --continue` or `merge --continue`, you just edit the file, and the commit updates itself.
- A rebase that produces a conflict still **succeeds**. You resolve on your own schedule.

```bash
jj resolve --list     # see what's conflicted
jj resolve <path>     # open a merge tool for one file
jj resolve            # walk through all of them
```

Once you clean up the conflict markers in a file and save, jj picks that up automatically, there's no separate "mark resolved" step.

---

## 9. Useful Tips

- **Call `jj new` often.** It's instant and cheap, use it like a checkpoint, not a rare event.
- **Type short ID prefixes.** jj highlights the shortest unique prefix of any ID in its output, so you almost never need the full string.
- **Check `jj log` before anything big.** It's your map. Scope it with `jj log -r 'main..@'` to cut noise.
- **Use `jj interdiff` after addressing review comments:**
  ```bash
  jj interdiff --from <old-rev> --to <new-rev>
  ```
  Shows exactly what changed between two versions of the same work.
- **Skip the stash, use a new commit instead.** Create a commit before your current one, make your fix, move back. Nothing disappears into a hidden stack.
- **Alias your most common command.** If you rebase onto `main` constantly, bind `jj rebase -b@ -d main` to a shortcut, a handful of commands cover most of your day.
- **Untrack a path** by adding it to `.gitignore` and running `jj file untrack <path>`, jj tracks new files automatically, so this is the one manual step you'll need.
- **Use `--at-op=<id>`** to look at the repo as it was at any past operation, without changing anything, good for "when did this break?"

---

## 10. What NOT to Do

- **Don't look for `git checkout` or `git merge`.** They don't exist in jj (they're deprecated even in early builds), `jj new` and `jj edit` cover those jobs. Trying to force Git muscle memory here just causes confusion.
- **Don't forget bookmarks are manual.** New work doesn't move a bookmark on its own. If you push and nothing shows up, you probably forgot `jj bookmark set <name> -r @` first.
- **Don't run raw `git` commands in a colocated repo carelessly.** After jj operations, the Git side is often in a detached state. If you need plain Git commands, check out a branch first.
- **Don't assume your working copy is inert.** Every jj command snapshots it. If you're calling jj from a script or shell prompt where that's unwanted, pass `--ignore-working-copy`.
- **Don't casually override immutable commits.** jj blocks rewriting commits that are already shared (like `main`) on purpose. `--ignore-immutable` exists, but treat it as a rare escape hatch, not a habit.
- **Don't share change IDs with non-jj teammates.** They only mean something inside your local jj repo. On GitHub or GitLab, share the commit hash or the PR link instead.
- **Don't chain multiple `jj undo` calls blindly.** Check `jj op log` first, undoing several steps without looking gets confusing fast.
- **Don't skip `--colocate` if you rely on Git tooling.** IDE Git integration, hooks, and local CI checks expect a visible `.git` folder, non-colocated mode hides it.
- **Don't leave conflicts to pile up.** jj lets you keep working through conflicts, which is convenient, but run `jj resolve --list` regularly so nothing gets forgotten.
- **Don't use the HTTPS remote URL if you set up SSH keys.** Mixing the two means jj/Git may still prompt for a token or password. Keep the remote on the `git@host:...` form once your SSH key is configured.

---

## 11. Quick Reference Cheat Sheet

```bash
# Setup
jj git init --colocate
jj git clone git@github.com:user/repo.git
jj config set --user user.name "X"
jj config set --user user.email "x@example.com"

# SSH & remotes
ssh-keygen -t ed25519 -C "you@example.com"
ssh-add ~/.ssh/id_ed25519
jj git remote list
jj git remote add origin git@github.com:user/repo.git

# Inspect
jj status  (jj st)
jj diff  (jj diff --git)
jj log
jj show <rev>
jj op log

# Work
jj new [-m "msg"]
jj commit -m "msg"        # describe + new in one step
jj describe -m "msg"      # jj desc
jj edit <change-id>
jj split
jj squash [--into <rev>]
jj absorb

# Bookmarks & remotes
jj bookmark create <name> -r @
jj bookmark set <name> -r <rev>
jj git fetch
jj git push -b <bookmark>
jj git push --remote <name> -b <bookmark>

# History
jj rebase -d <dest>
jj rebase -s <rev> -d <dest>
jj rebase -b <bookmark> -d <dest>
jj interdiff --from <a> --to <b>

# Conflicts
jj resolve --list
jj resolve <path>

# Safety net
jj undo
jj op restore <op-id>
jj --at-op=<op-id> st
```

---

## 12. Further Reading

- Official docs: https://docs.jj-vcs.dev/
- `jj help -k tutorial` from the CLI

Once the core loop, `new` then edit then `describe` then `bookmark` then `push`, feels natural, it's worth exploring revsets, templating, and workspaces in more depth.
