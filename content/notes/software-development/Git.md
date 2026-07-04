---
title: "Git"
description: "A comprehensive guide/cheetsheet on Git."
category: "Software Development"
tags: ["git", "development", "DVCS", "cheetsheet"]
date: "2026-06-01"
source: "Internet"
---

> `Info` About this guide
> A complete reference covering Git fundamentals through advanced usage. 

---

## Core Concepts Explained

Before diving into commands, understanding these building blocks will make everything else click.

### What is a Repository?

A **repository (repo)** is a folder that Git is tracking. It contains your project files plus a hidden `.git/` folder — Git's brain. Everything Git knows about your project lives in `.git/`.

```bash
my-project/
├── .git/          ← Git's internal database (never touch this manually)
├── src/
├── README.md
└── package.json
```

There are two kinds:
- **Local repo** — lives on your machine
- **Remote repo** — lives on a server (GitHub, GitLab, etc.)

### What is a Commit?

A **commit** is a permanent snapshot of your project at a point in time. Think of it like a save point in a video game — you can always return to it.

Each commit stores:
- A unique hash (ID) like `a3f92bc`
- The author name and email
- A timestamp
- A commit message describing what changed
- A reference to the previous commit (forming a chain / history)

```
[Initial setup] → [Add login page] → [Fix auth bug] → [Add tests]
    a1b2c3            d4e5f6            g7h8i9           j0k1l2
```

> `Tip` Think of history as a linked list
> Each commit points back to its parent. This chain is your entire project history — and it's permanent and tamper-evident.

### What is the Staging Area?

The **staging area** (also called the **index**) is a preparation zone between your working directory and your committed history.

```
[Working Directory] --git add--> [Staging Area] --git commit--> [Repository]
    (your edits)                  (selected changes)             (permanent snapshot)
```

**Why does it exist?** You might change 10 files but only want to commit 3 of them together as one logical change. The staging area lets you pick exactly what goes into each commit.

> `Example` Real scenario
> You fix a bug in `auth.js` and also start refactoring `utils.js`.
> Stage only `auth.js` → commit "Fix auth null pointer bug"
> Later stage `utils.js` → commit "Refactor utility functions"
> Result: two clean, focused commits instead of one messy one.

### What is a Branch?

A **branch** is a lightweight, movable pointer to a commit. When you make a new commit, the branch pointer automatically moves forward to it.

```
main:    A → B → C → D
                  ↘
feature:            E → F → G
```

- `main` is at commit D
- `feature` branched off at C and has 3 new commits

Creating a branch is instant — it's just a file containing a 40-character hash. This is why Git branching is so fast compared to older VCS tools.

### What is HEAD?

`HEAD` is a special pointer that always tells Git: **"this is where you are right now."**

Normally: `HEAD → branch name → commit hash`
In detached HEAD state: `HEAD → commit hash` (directly)

```bash
git log --oneline
# a3f92bc (HEAD -> main) Add login page   ← HEAD is on main, at this commit
```

### What is a Remote?

A **remote** is a named URL pointing to another copy of the repository (usually on GitHub/GitLab). The default remote name is `origin`.

```bash
origin  https://github.com/you/repo.git   # fetch
origin  https://github.com/you/repo.git   # push
```

Remote-tracking branches like `origin/main` are local snapshots of what the remote looked like last time you fetched. They don't update automatically — you have to run `git fetch`.

---

## Setup & Configuration

Before using Git, verify it's installed and set your identity. Every commit permanently embeds your name and email.

```bash
git --version          # verify installation, e.g. "git version 2.44.0"
```

### Identity (required before your first commit)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

> `Warning` Use your GitHub email
> Use the same email as your GitHub/GitLab account so your commits link to your profile and contributions graph.

### Recommended Global Settings

```bash
git config --global color.ui auto                 # colored output in terminal
git config --global core.editor "code --wait"     # VS Code as default editor
git config --global core.autocrlf input           # mac/linux: "input" | windows: "true"
git config --global init.defaultBranch main       # use "main" instead of "master"
git config --global pull.rebase true              # rebase on pull (cleaner history)
git config --global rerere.enabled true           # remember conflict resolutions
git config --global push.autoSetupRemote true     # auto-track remote on first push
git config set advice.forceDeleteBranch false     # disables the warning message shown when force-deleting a Git branch
```

### View & Manage Config

```bash
git config --list                                         # all active settings
git config --get user.name                                # read a specific value
git config --unset user.name                              # remove an entry
git config --add --local user.email "work@company.com"   # per-repo override
```

> `Info` Config layers (lower overrides higher)
> **system** (all users on machine) → **global** (`~/.gitconfig`) → **local** (`.git/config`)
> Use `--local` to override for a single repo without affecting your global config.

---

## Initialize & Clone

### Start a New Repository

```bash
mkdir my-project && cd my-project
git init              # creates a hidden .git/ folder — your repo's brain
```

### Clone an Existing Repository

```bash
git clone https://github.com/user/repo.git            # clone into ./repo/
git clone https://github.com/user/repo.git my-dir     # clone into custom folder
git clone --depth 1 https://github.com/user/repo.git  # shallow clone (no full history)
git clone -b develop https://github.com/user/repo.git # clone a specific branch
```

> `Tip`
> `git clone` automatically sets up the `origin` remote and checks out the default branch. You only need `git remote add origin` when you created the repo locally with `git init`.

---

## Status & Inspection

```bash
git status            # most-used command — shows modified, staged, untracked files
git status -s         # short format: M = modified, A = added, ?? = untracked
```

### Understanding `git status -s` output

**Git Status Symbols**

- **`??`** — Untracked file (Git doesn't know about it yet)
- **`A `** — Newly staged file (added to index)
- **`M `** — Modified and staged
- **` M`** — Modified but NOT staged
- **`MM`** — Modified, partially staged
- **`D `** — Deleted and staged
- **`R `** — Renamed

```bash
git show <hash>          # full commit details: author, date, message, diff
git show HEAD            # details of the most recent commit
git show HEAD~2          # details of the commit 2 steps back
git blame <file>         # who wrote each line and in which commit
git shortlog -sn         # contributor summary: commit count per author
git cat-file -p <hash>   # inspect raw Git objects (advanced — Git internals)
```

---

## The 4-Zone Workflow

Git is a 4-step pipeline. Every operation maps to moving changes between these zones.

```
┌─────────────────┐    git add     ┌─────────────────┐   git commit  ┌─────────────────┐   git push   ┌─────────────┐
│  Working Dir    │ ─────────────► │  Staging Area   │ ────────────► │   Local Repo    │ ───────────► │   Remote    │
│  (edit & save)  │                │  (git add)      │               │   (committed)   │              │  (GitHub)   │
└─────────────────┘                └─────────────────┘               └─────────────────┘              └─────────────┘
         ▲                                  │                                  │
         │◄─────── git restore ─────────────┘                                  │
         │◄─────────────────────────── git reset ──────────────────────────────┘
```

Moving backwards:
- `git restore <file>` — discard working dir changes
- `git restore --staged <file>` — move from staging back to working dir
- `git reset` — move commits back to staging or working dir

> `Tip` The staging area is Git's superpower
> It lets you craft clean, focused commits even when you've changed many files at once — only stage the changes that logically belong together.

---

## What is the Staging Area?

See [[#Core Concepts Explained]] above for a full explanation. In practice:

```bash
# You edited 5 files. Only want to commit 2 of them:
git add auth.js login.js    # stage just those 2
git status                  # confirm what's staged vs unstaged
git diff --staged           # preview exactly what will be committed
git commit -m "Add auth and login"

# Now stage the rest
git add .
git commit -m "Update other files"
```

---

## Staging Files

```bash
git add .                    # stage all changes in current directory
git add file1.js file2.css   # stage specific files
git add src/                 # stage all changes in a folder
git add -p                   # interactive: pick individual hunks within a file
git add -i                   # interactive menu (add, update, revert, patch, etc.)
```

> `Tip` `git add -p` is incredibly powerful
> It walks you through each changed chunk (hunk), letting you choose which parts to stage. Use it to keep commits clean and atomic when you've made multiple unrelated changes in the same file.

### Unstage Files

```bash
git restore --staged <file>   # modern way to unstage (Git 2.23+)
git rm --cached <file>        # stop tracking a file entirely, keep it on disk
```

---

## What is a Commit?

See [[#Core Concepts Explained]] for the conceptual explanation. Here's the practical detail:

Every commit has:
- **Hash**: `a3f92bc1d4e5...` (SHA-1, globally unique)
- **Tree**: snapshot of all tracked files at that moment
- **Parent**: pointer to the previous commit
- **Author + timestamp**
- **Message**: your description of the change

`HEAD~1` means "one commit before HEAD". `HEAD~3` means three back. You can also use the hash directly: `git show a3f92bc`.

---

## Committing

```bash
git commit -m "Add user login page"       # commit with inline message
git commit                                # opens editor for multi-line message
git commit -am "Fix typo in README"       # stage all tracked files + commit in one step
```

> `Tip` Write commit messages in the imperative mood
> *"Add login page"* not *"Added login page"*. Think of it as completing: *"If applied, this commit will… add login page."*

### Good Commit Message Format

```
Short summary (50 chars or less)

Longer explanation if needed. Wrap at 72 chars.
Explain the WHY, not just the WHAT — the diff already
shows what changed.

Refs: #123
```

### Amend the Last Commit

```bash
git commit --amend                     # edit message or include newly staged files
git commit --amend --no-edit           # add staged changes without changing the message
git commit --amend -m "New message"    # change just the message
```

> `Warning` Never amend pushed commits
> Amending rewrites history. If the commit is already on a shared branch, collaborators will face conflicts. Only amend commits that exist locally only.

---

## Restoring Files

`git restore` was introduced in Git 2.23 as an explicit, purpose-built command for discarding changes. It replaces the confusing overloaded uses of `git checkout` for file operations.

```bash
git restore <file>                       # discard unstaged changes in working dir
git restore --staged <file>              # unstage a file (keep changes in working dir)
git restore --staged --worktree <file>   # unstage AND discard changes entirely
git restore --source <hash> <file>       # restore a file to its state at a specific commit
git restore .                            # discard ALL unstaged changes in working dir
```

> `Danger` Common mistake
> Using `git checkout -- file` to discard changes. This still works, but is confusing because `git checkout` also switches branches — the same command does two completely different things.
> Use `git restore <file>` instead. It's unambiguous and safe.

---

## Logs & History

```bash
git log                               # full history: hash, author, date, message
git log --oneline                     # condensed: short-hash + message
git log --oneline --graph             # adds ASCII branch/merge graph on the left
git log --oneline --graph --all       # show ALL branches, not just current
git log --stat                        # show files changed in each commit
git log --patch                       # show full diff for each commit (verbose)
git log -n 5                          # show only last 5 commits
```

### Filtering History

```bash
git log --author="Alice"              # commits by a specific person
git log --since="2 weeks ago"         # commits in a time window
git log --until="2024-01-01"          # commits before a date
git log --grep="bugfix"               # commits whose message contains a string
git log -p <file>                     # full diff history for a specific file
git log --follow <file>               # track a file even if it was renamed
git log --all --full-history -- <file> # find a deleted file in history
git shortlog -sn                      # contributor summary: commit count per author
```

> `Tip` No-pager for scripts
> Add `--no-pager` to print output directly without opening a pager:
> `git --no-pager log --oneline --graph --all`

---

## Differences (git diff)

```bash
git diff                          # unstaged changes (working dir vs staging)
git diff --staged                 # staged changes — what will actually be committed
git diff HEAD                     # all changes since last commit (staged + unstaged)
git diff <hash1> <hash2>          # diff between any two commits
git diff main..feature            # diff between two branches
git diff HEAD~1 HEAD              # exactly what changed in the last commit
git diff --stat                   # summary: files changed, insertions, deletions
git diff --word-diff              # highlight changed words inline (good for prose)
```

> `Danger` Common mistake
> Running `git diff` and seeing nothing, then assuming nothing changed.
> `git diff` only shows **unstaged** changes. If you've already run `git add`, use `git diff --staged` to see what's going into your commit.

### Diff a Specific File

```bash
git diff HEAD -- path/to/file.js       # changes to one file since last commit
git diff main..feature -- src/auth.js  # one file's difference between branches
```

---

## What is a Branch?

See [[#Core Concepts Explained]] for the conceptual explanation.

Key facts:
- Creating a branch is **free** (O(1) operation — just writes a tiny file)
- Branches don't copy files — they're pointers
- You can have hundreds of branches with zero performance impact
- `main` (or `master`) is just a branch like any other — it has no special Git powers

---

## Branches

### List Branches

```bash
git branch            # local branches — * marks current
git branch -a         # local + remote-tracking branches
git branch -r         # remote-tracking branches only
git branch -v         # local branches with last commit message
git branch --merged   # branches already merged into current
git branch --no-merged # branches NOT yet merged
```

### Create & Switch

```bash
git switch -c feature/login        # create AND switch (modern, preferred)
git switch main                    # switch to an existing branch
git switch -                       # switch back to the previous branch

# Older syntax — still works, but switch is less ambiguous
git checkout -b feature/login
git checkout main
```

### Rename & Delete

```bash
git branch -m old-name new-name    # rename a branch
git branch -d feature/login        # safe delete (fails if unmerged)
git branch -D feature/login        # force delete even if unmerged

# Delete a remote branch
git push origin --delete feature/login
git fetch --prune                  # remove stale remote-tracking refs locally
```

> `Tip` Use naming conventions
> `feature/`, `fix/`, `chore/`, `docs/`, `hotfix/`
> This keeps branches organized and communicates intent at a glance.

### Tracking Branches

```bash
git branch -u origin/main          # set upstream for current branch
git branch --set-upstream-to=origin/feature feature  # explicit form
git branch -vv                     # show tracking info for all local branches
```

---

## Merging

### Basic Merge

```bash
# Always switch to the branch you want to merge INTO first
git switch main
git merge feature/login            # merge a local branch into current branch
git merge origin/feature/login     # merge a remote-tracking branch
```

> `Danger` Syntax error found in many tutorials
> `git merge origin feature` (with a space) is **wrong**. Git interprets "origin" and "feature" as two separate branch names to merge simultaneously.
> Correct forms:
> - `git merge feature` — merge a local branch
> - `git merge origin/feature` — merge a remote-tracking branch (**slash**, not space)

### Merge Strategies

```bash
git merge feature                  # default: fast-forward if possible
git merge --no-ff feature          # always create a merge commit (preserves branch history)
git merge --squash feature         # squash all feature commits into one staged change
```

**Git Merge Strategies**

- **Default (fast-forward)** — No merge commit if linear; Use for simple updates
- **`--no-ff`** — Always creates merge commit; Use when you want branch history preserved
- **`--squash`** — No merge commit (staged only); Use for cleaning up feature branch before merging

### Pull (fetch + merge)

```bash
git pull                           # fetch + merge in one step
git pull --rebase                  # fetch + rebase (cleaner history, no merge commits)
git pull origin main               # explicitly pull main from origin
git pull --no-commit               # fetch + merge but don't auto-commit
```

---

## Resolving Merge Conflicts

Conflicts happen when two branches modify the same lines differently. Git marks the sections, stops, and asks you to decide.

### What a Conflict Looks Like

```
<<<<<<< HEAD                     ← your current branch
console.log("Hello World");
=======
console.log("Hello Git");        ← incoming branch
>>>>>>> feature/greeting
```

### Resolution Workflow

```bash
# 1. See which files have conflicts
git status

# 2. Open each conflicted file, edit it — remove the <<<,===,>>> markers
#    and keep the code you want (your version, theirs, or a blend of both)

# 3. Stage each resolved file
git add <resolved-file>

# 4. Complete the merge commit
git commit          # Git pre-fills a merge commit message

# Or bail out entirely and undo the merge
git merge --abort
```

> `Tip` Use a merge tool
> VS Code shows **Accept Current / Accept Incoming / Accept Both** buttons directly in the editor during conflicts. For complex merges run `git mergetool` to launch your configured GUI tool.

### Accept One Side Entirely (Skip Manual Editing)

```bash
git checkout --ours <file>     # keep your branch's version of the file
git checkout --theirs <file>   # keep the incoming branch's version
git add <file>                 # mark as resolved
```

### Prevent Conflicts Proactively

```bash
# Keep your branch up to date with main frequently
git fetch origin
git rebase origin/main         # integrate changes before conflicts accumulate

# Check for potential conflicts before merging
git merge --no-commit --no-ff feature   # dry run — see what would conflict
git merge --abort                        # then abort if you want to handle it differently
```

---

## Git Stash

Stash temporarily shelves uncommitted changes so you can switch branches cleanly without committing half-finished work. Think of it as a clipboard for your working directory.

```bash
git stash                                    # save working dir + staged changes
git stash push -m "wip: auth middleware"     # stash with a descriptive name
git stash -u                                 # also stash untracked (new) files
git stash -a                                 # stash everything including ignored files
```

### Viewing & Applying Stashes

```bash
git stash list                    # show all stashes: stash@{0}, stash@{1}, ...
git stash show stash@{0}          # summary of what's in a stash
git stash show -p stash@{0}       # full diff of a stash

git stash pop                     # apply most recent stash AND remove it from list
git stash apply stash@{1}         # apply a specific stash but KEEP it in the list
git stash drop stash@{0}          # delete a specific stash
git stash clear                   # delete ALL stashes permanently
```

### Stash to a New Branch

```bash
git stash branch feature/new-branch    # create branch + apply stash on it
# Useful when your stashed work has grown into a full feature
```

> `Warning` Untracked files aren't stashed by default
> `git stash` does **not** stash untracked files (brand new files you haven't run `git add` on yet). Use `git stash -u`, otherwise those files will still be present when you switch branches, which can cause confusion.

---

## Git Blame

`git blame` shows you **who last changed each line** of a file and in which commit. Essential for understanding why code exists.

```bash
git blame <file>                     # annotate every line with author, hash, date
git blame -L 10,25 <file>            # blame only lines 10 to 25
git blame -L 10,+15 <file>           # blame 15 lines starting at line 10
git blame --since="3 months ago" <file>  # only show changes in time range
git blame -w <file>                  # ignore whitespace changes
git blame -M <file>                  # detect lines moved within the same file
git blame -C <file>                  # detect lines copied from other files
git blame <hash> -- <file>           # blame at a specific commit in the past
```

### Reading Blame Output

```
a3f92bc1 (Alice Chen  2024-01-15 10:23:45 +0000  42) const login = async (req, res) => {
^d4e5f67 (Bob Smith   2023-11-02 08:11:00 +0000  43)   const { email, password } = req.body;
```

- `^` prefix on a hash means the commit is the very first commit that introduced this file
- Columns: `hash (author date line#) content`

> `Tip` Use blame in VS Code
> The **GitLens** extension adds inline blame directly in the editor — hover any line to see full commit details without leaving your file.

### Ignoring Reformatting Commits in Blame

```bash
# Create a file listing commits to ignore (e.g. mass formatting runs)
echo "abc1234" >> .git-blame-ignore-revs
echo "def5678" >> .git-blame-ignore-revs

git blame --ignore-revs-file .git-blame-ignore-revs <file>

# Or configure permanently
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

---

## Remote Repositories

```bash
git remote add origin https://github.com/user/repo.git  # link local to remote
git remote -v                            # show all remotes with their URLs
git remote rename origin upstream        # rename a remote
git remote remove origin                 # remove a remote link
git remote set-url origin git@github.com:user/repo.git  # change URL (HTTPS → SSH)
git remote show origin                   # detailed info: branches, tracking, etc.
```

### Fork Workflow — Adding Upstream

```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git merge upstream/main       # pull the original repo's updates into your fork
```

> `Info`
> `git clone` automatically creates a remote named `origin`. You only need `git remote add origin ...` when you created the repo locally with `git init` and need to connect it to a remote for the first time.

---

## Fetching

`git fetch` downloads changes from the remote and updates your **remote-tracking branches** (like `origin/main`), but does **not** touch your local branches or working directory. It is always safe to run.

```bash
git fetch                      # fetch all changes from origin
git fetch origin               # explicitly fetch from origin
git fetch --all                # fetch from all configured remotes
git fetch --prune              # also delete local refs to deleted remote branches
git fetch origin main          # fetch just the main branch
```

### Fetch vs Pull — What's the Difference?

**Git Fetch vs Pull**

- **`git fetch`** — Downloads changes, updates remote-tracking refs (`origin/main`); Never modifies working branch
- **`git pull`** — `git fetch` + `git merge` (or `--rebase`); Yes, modifies working branch

```bash
# Inspect before merging — see what's on remote that you don't have yet
git log HEAD..origin/main --oneline

# See local commits not yet pushed
git log origin/main..HEAD --oneline
```

> `Tip` Develop the fetch habit
> `git fetch` first → inspect with `git log HEAD..origin/main` → then decide whether to `git merge` or `git rebase`. This prevents surprise conflicts during a blind `git pull`.

---

## Pushing

```bash
git push                              # push current branch to its tracked upstream
git push -u origin main               # push + set default upstream (first-time push)
git push origin feature/login         # push a specific branch by name
git push --force-with-lease           # force push after a rebase (safer than --force)
git push origin --delete old-branch   # delete a remote branch
git push origin v1.0.0                # push a specific tag
git push origin --tags                # push all local tags
git push --dry-run                    # preview what would be pushed without doing it
```

> `Danger` Never `--force` on shared branches
> It overwrites the remote history without checking and will corrupt everyone else's local copy.
> Always use `--force-with-lease` instead — it fails if someone else has pushed since your last fetch, protecting you from overwriting their work.

---

## SSH Setup

SSH authentication eliminates password prompts on every push/pull. Do this once per machine.

```bash
# 1. Generate an SSH key pair using the modern Ed25519 algorithm
ssh-keygen -t ed25519 -C "you@example.com"
# Accept the default path (~/.ssh/id_ed25519). Add a passphrase for extra security.

# 2. Start the SSH agent and load your key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copy your PUBLIC key and paste it into:
#    GitHub → Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub

# 4. Verify the connection works
ssh -T git@github.com
# Expected: "Hi username! You've successfully authenticated..."

# 5. Update your remote URL from HTTPS to SSH
git remote set-url origin git@github.com:user/repo.git
```

---

## Reset & Revert

Three ways to undo. Choose based on whether the commits are shared and whether you want to preserve the changes.

**Git Undo Commands**

- **`git reset --soft HEAD~1`** — Undoes commits, keeps changes staged; Not safe after push
- **`git reset HEAD~1`** — Undoes commits, keeps changes unstaged; Not safe after push
- **`git reset --hard HEAD~1`** — Undoes commits, discards changes; Not safe after push
- **`git revert <hash>`** — Preserves commits + creates new undo commit, inverts changes; Safe after push

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged (default: --mixed)
git reset HEAD~1

# Undo last commit AND discard all changes — use with caution
git reset --hard HEAD~1

# Jump back to any commit, wiping everything after it
git reset --hard <commit-hash>

# Safe undo on public branches — creates a new reverting commit
git revert <commit-hash>

# Revert a merge commit
git revert -m 1 <merge-commit-hash>
```

> `Danger` Common mistake
> Using `git reset --hard` to discard changes in a single file — this resets your **entire** working directory.
> To discard changes in just one file, use `git restore <file>` instead.

---

## Reflog — Your Safety Net

Reflog records every position HEAD has ever pointed to — including commits you "deleted" with `reset --hard`. Git keeps this log for ~90 days. Almost nothing is truly lost.

```bash
git reflog                   # complete history of every HEAD movement
# Output looks like:
# abc1234 HEAD@{0}: commit: Add login page
# def5678 HEAD@{1}: reset: moving to HEAD~1  ← the commit you "lost"
# bcd9012 HEAD@{2}: commit: Initial setup

# Recover a "deleted" commit by creating a branch pointing to it
git switch -c recovery-branch abc1234

# Reflog for a specific branch
git reflog show feature/login
```

> `Tip` Nothing is truly lost
> If you just ran `git reset --hard` and immediately regret it, `git reflog` shows the commit hash you just lost. Create a new branch from it to recover everything. You have roughly 90 days before Git garbage-collects it.

---

## Detached HEAD

Normally: `HEAD → branch name → commit`. In detached HEAD state, HEAD points directly to a commit hash instead of a branch. Commits made here belong to no branch and are easily lost.

### What Causes It

```bash
git checkout 6f1a2b3        # checking out a commit hash directly
git checkout v1.0.0         # checking out a tag (tags point to commits, not branches)
```

### What You Can Do

**Detached HEAD State**

- **Browse code at that point in history** — Safe
- **Run / test the code** — Safe
- **Make commits** — They won't belong to any branch
- **Switch away without saving** — Those commits become unreachable

### How to Recover

```bash
git switch main                  # return to main (any detached commits are abandoned)
git switch -c new-branch         # save work by creating a branch from current position
```

---

## Interactive Rebase

Interactive rebase rewrites commit history. Use it to clean up a messy feature branch before merging — squash WIP commits, fix typos in messages, or reorder changes.

```bash
git rebase -i HEAD~4           # edit the last 4 commits interactively
git rebase -i main             # rebase all commits since branching off main
git rebase -i origin/main      # rebase against the remote main
```

### Actions Available in the Rebase Editor

**Git Rebase Interactive Commands**

- **`pick` / `p`** — Keep the commit as-is
- **`reword` / `r`** — Keep the commit, edit its message
- **`edit` / `e`** — Pause to amend the commit's content
- **`squash` / `s`** — Merge into the previous commit, combining both messages
- **`fixup` / `f`** — Merge into the previous commit, discard this message
- **`drop` / `d`** — Delete the commit entirely
- **`exec` / `x`** — Run a shell command after this commit

```bash
git rebase --continue          # after resolving a conflict or finishing an edit
git rebase --skip              # skip the current conflicting commit
git rebase --abort             # cancel and restore original state completely

# After rebase, force push is required (history was rewritten)
git push --force-with-lease
```

> `Warning` Golden rule of rebase
> Never rebase commits that have already been pushed to a shared branch. Rebase rewrites every commit's hash — anyone who pulled the original commits will see diverged history and face painful conflicts.

---

## Cherry Pick

Apply a specific commit from any branch to your current branch, without merging anything else. Useful for backporting a hotfix to an older release branch.

```bash
git cherry-pick <hash>               # apply a single commit
git cherry-pick a1b2c3..d4e5f6       # apply a range of commits (exclusive..inclusive)
git cherry-pick <hash> --no-commit   # apply changes but don't auto-commit (review first)
git cherry-pick -x <hash>            # include original hash reference in commit message

git cherry-pick --continue           # after resolving a conflict
git cherry-pick --skip               # skip this commit and continue
git cherry-pick --abort              # cancel and restore to before cherry-pick
```

> `Info` Cherry-pick creates a new commit
> The cherry-picked commit gets a **new hash** on your branch, even though it has the same changes. The original commit is untouched. This means the change now exists in two branches with different hashes.

---

## Git Bisect

Binary search through commit history to find the exact commit that introduced a bug. Git halves the search space each step — finding the culprit among 1,000 commits takes only ~10 steps.

```bash
git bisect start            # begin a bisect session
git bisect bad              # the current commit is broken
git bisect good <hash>      # this older commit was working fine

# Git checks out a commit halfway between good and bad.
# Test it, then tell Git the result:
git bisect bad              # this commit is also broken
git bisect good             # this commit works

# Git keeps narrowing down until it identifies the culprit.
# When done:
git bisect reset            # end session, return to original branch
```

### Automated Bisect

```bash
git bisect run npm test     # fully automated — exit 0 = good, non-zero = bad
git bisect run ./test.sh    # any script works
```

```bash
git bisect log              # show the bisect history for this session
git bisect visualize        # open visual graph of remaining commits to test
```

---

## Tags

Tags permanently mark release points like `v1.0.0`. Unlike branches, they don't move when new commits are added.

```bash
git tag                                      # list all tags
git tag -l "v1.*"                            # list tags matching a pattern
git tag v1.0.0                               # lightweight tag at current commit
git tag -a v1.0.0 -m "First stable release" # annotated tag with message (use for releases)
git tag v0.9.0 <hash>                        # tag a specific past commit

git push origin v1.0.0                       # push a tag (NOT pushed by default with git push)
git push origin --tags                       # push all local tags

git tag -d v1.0.0                            # delete a local tag
git push origin --delete v1.0.0             # delete a remote tag

git checkout v1.0.0                          # check out a tag (enters detached HEAD)
git show v1.0.0                              # show what this tag points to
```

> `Tip` Always use annotated tags for releases
> Annotated tags (`-a`) store the tagger's name, date, and a message, and are proper Git objects with their own hash. Lightweight tags are just named pointers, better for personal bookmarks.

---

## .gitignore & .gitkeep

### .gitignore — Files to Never Track

Create a `.gitignore` file at the root of your repo and commit it. Git won't track any files matching these patterns.

```gitignore
# Dependencies
node_modules/

# Logs
*.log
logs/

# Environment and secrets — CRITICAL: never commit secrets
.env
.env.local
.env.*.local

# Build output
dist/
build/
out/
.next/

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Language-specific
*.pyc
__pycache__/
.pytest_cache/
*.class
target/

# Test coverage
coverage/
.nyc_output/
```

> `Danger` Never commit `.env` files
> Secrets pushed to GitHub are public and are scraped by bots within seconds. Even deleting the file in a later commit doesn't help — they remain in the history forever. If you accidentally commit a secret, consider it compromised and **rotate it immediately**.

```bash
# Fix: you accidentally committed a file and want to stop tracking it
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Stop tracking .env"

# Check why a file IS or IS NOT being ignored
git check-ignore -v path/to/file      # shows which rule is ignoring it
git check-ignore -v --no-index path/to/file  # check even tracked files
```

### Global .gitignore

```bash
# Ignore OS/editor files on all your repos without polluting project .gitignore
git config --global core.excludesFile ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
echo ".idea/" >> ~/.gitignore_global
```

### .gitkeep — Track Empty Directories

Git only tracks files, not empty directories. `.gitkeep` is a community convention (not a Git feature) — an empty placeholder file added so Git includes the directory in the repo.

```bash
touch logs/.gitkeep       # forces an otherwise empty directory into the repo
```

---

## Common Workflows

### Feature Branch Workflow (Everyday Development)

```bash
# 1. Always start from an up-to-date main
git switch main
git pull

# 2. Create a dedicated branch for your feature
git switch -c feature/user-authentication

# 3. Work in small, focused commits
git add -p
git commit -m "Add JWT token generation"
git commit -m "Add /login endpoint"
git commit -m "Add token refresh logic"

# 4. Keep your branch up to date with main while you work
git fetch origin
git rebase origin/main      # rebase rather than merge for cleaner history

# 5. Clean up commit history before opening a PR
git rebase -i origin/main   # squash/fixup WIP commits

# 6. Push your branch and open a Pull Request
git push -u origin feature/user-authentication

# 7. After PR is merged, clean up locally
git switch main
git pull
git branch -d feature/user-authentication
```

### Hotfix Workflow (Urgent Production Bug)

```bash
# Branch from the release tag, not from main
git switch -c hotfix/null-pointer-auth v2.1.0

# Fix the bug, commit, tag the fix
git commit -am "Fix null pointer in auth middleware"
git tag -a v2.1.1 -m "Patch: fix null pointer crash"
git push origin hotfix/null-pointer-auth --tags

# Merge the fix back into both main and your release branch
git switch main
git merge hotfix/null-pointer-auth
git switch release/2.x
git merge hotfix/null-pointer-auth
```

### Recovering Lost Work

```bash
# Scenario A: accidentally ran git reset --hard
git reflog                              # find the commit you lost
git switch -c recovery-branch abc1234  # restore it to a new branch

# Scenario B: accidentally deleted a branch
git reflog                              # find the tip commit of the deleted branch
git switch -c restored-branch abc1234

# Scenario C: lost stash
git fsck --unreachable | grep commit    # find dangling commits
git show <hash>                         # inspect each to find your stash
```

### Cleaning Up a Messy History Before Merging

```bash
# You have 8 commits including WIP checkpoints, typo fixes, etc.
# Before opening your PR, clean it up:
git rebase -i origin/main
or
git rebase -i HEAD~n

# In the editor:
# pick abc1234 Add user model
# fixup bcd2345 wip
# fixup cde3456 fix typo
# pick def4567 Add login endpoint
# squash efg5678 Add tests for login
# fixup fgh6789 fix test

# Result: 2 clean, focused commits ready to review
```

### Sync a Fork

```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git switch main
git rebase upstream/main      # or: git merge upstream/main
git push origin main          # update your fork on GitHub
```

### Undo a Pushed Commit Safely

```bash
# On a shared branch: use revert (adds a new commit, doesn't rewrite history)
git revert <commit-hash>
git push

# On your own branch (before PR): reset + force push
git reset --soft HEAD~1        # or --hard to discard changes entirely
git push --force-with-lease
```

---

## Git Quick Reference

- **See what's changed** — `git status`
- **Stage all changes** — `git add .`
- **Stage interactively** — `git add -p`
- **Commit** — `git commit -m "message"`
- **Undo last commit (keep changes)** — `git reset --soft HEAD~1`
- **Discard file changes** — `git restore <file>`
- **Create & switch branch** — `git switch -c branch-name`
- **Merge branch into current** — `git merge branch-name`
- **Stash work in progress** — `git stash push -m "description"`
- **Restore stash** — `git stash pop`
- **Download remote changes** — `git fetch`
- **Download + integrate** — `git pull --rebase`
- **Upload changes** — `git push`
- **See who changed a line** — `git blame <file>`
- **Find a bug's origin** — `git bisect start`
- **View all history** — `git log --oneline --graph --all`
- **Recover anything** — `git reflog`
---
