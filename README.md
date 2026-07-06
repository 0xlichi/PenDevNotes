# PenDevNotes

A community-driven knowledge base for pentesters, programmers, researchers,
and developers. PenDevNotes is not a personal note-taking app. 
It's a shared, growing collection of clear, accurate, and genuinely useful notes,
written by contributors and reviewed through pull requests.

If you've solved a tricky bug, worked through a pentesting methodology, or
written a cheatsheet you keep coming back to, that's exactly the kind of note
that belongs here.

Anyone can read the notes. Anyone can contribute one.

## How to contribute a note

1. **Write your note in Markdown.** Keep it clear, accurate, and complete —
   something a stranger could follow without needing to ask you questions.
   Avoid scratchpads, unfinished drafts, or raw commands with no explanation.
2. **Add the required front matter** at the top of the file (see below).
3. **Place the file** under `content/`, organized into a topic folder that
   makes sense (see [Folder structure](#folder-structure)).
4. **Open a pull request** with a clear, descriptive commit message
   explaining what the note covers.
5. Your note will be reviewed for quality and accuracy, then merged.

### Front matter format

Every note needs a front matter block at the top:

```markdown
---
title: "SQL Injection Basics"
description: "Core concepts of SQL injection, from detection to extraction."
category: "Web Pentest"
tags: ["sql-injection", "web", "burp-suite"]
date: "2026-01-15"
---

## Your content starts here
```

### Template
```markdown
---
title: ""
description: ""
category: ""
tags: []
date: ""
---
```
---

### Folder structure

Notes live under `content/`, organized into nested topic folders. The folder
path becomes part of the note's URL, but is otherwise independent of the
`category` field in front matter — folders are just for organizing files on
disk.
