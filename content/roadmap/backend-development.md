---
title: 'Backend Development'
description: 'A comprehensive roadmap for job ready.'
category: 'Roadmap'
tags: ['backend', 'roadmap']
date: '2026-07-06'
---

> Framework doesn't matter (Python/Node/Java/Go). What matters is understanding how backend systems actually work in production — and whether you can reason through a problem before you write code.

## 0. Pick a Stack

- **Node.js + Express** — fastest to learn, huge job market, JS everywhere. Trade-off: weaker typing (use TypeScript), callback/async pitfalls
- **Python + Django/FastAPI** — strong ecosystem, great for learning, good for AI/data-adjacent roles. Trade-off: slower runtime, GIL limits raw concurrency
- **Java + Spring Boot** — enterprise jobs (esp. India, banking, MNCs), strong typing, long-term stability. Trade-off: steep curve, verbose, slower iteration
- **Go + net/http or Fiber** _(alt)_ — built for concurrency & performance, increasingly hot for infra/backend roles. Trade-off: smaller ecosystem, less beginner material
- **C# + ASP.NET Core** _(alt)_ — enterprise (esp. Microsoft-stack companies), great tooling. Trade-off: Windows-leaning ecosystem, fewer startups use it

> Pick ONE. Commit 3 months. Don't switch early. Switching stacks resets your muscle memory on debugging and idioms — the concepts below transfer, the syntax doesn't.

---

## Phase 1 — Foundations

### 1. Programming Fundamentals

- User input, loops, functions, conditionals/case statements
- DSA (basic–medium) — needed for interviews
- OOP concepts (also study composition-over-inheritance as an alternative style)
- Async/concurrency basics (event loop / asyncio / goroutines depending on stack)
- File handling (read/write, streams, buffers, file modes)
- Error handling (try/catch/except, custom exceptions, error propagation vs. Go-style explicit error returns)
- Working with JSON (parse/stringify, schema validation)
- Working with environment variables & config files — YAML (`.yml`, human-readable, common in Docker/K8s/CI), TOML (`.toml`, used by Rust/Python tooling like `pyproject.toml`, less ambiguous than YAML), and `.conf`/INI-style files (simple key=value, common in Nginx, systemd, older tools)
- Data structures in practice (arrays, maps/dicts, sets, structs)
- String manipulation & regex
- Date/time handling (timezones, epoch, formatting)
- Modules/packages (imports, dependency management)
- Working with CLI args / building small CLI tools
- Serialization formats beyond JSON (YAML, CSV, XML basics)

#### 1a. Logic Building (the part most roadmaps skip)

This is the actual skill interviews and real debugging test — not "do you know DSA," but "can you break an ambiguous problem into steps." Do these _before_ jumping to frameworks:

- **Trace before you code.** For any problem, write the input/output on paper and manually trace what should happen step by step, before touching a keyboard.
- **Pseudocode first, always.** Force yourself to write 5–10 lines of plain-English steps before writing real syntax. If you can't pseudocode it, you don't understand it yet — more code won't fix that.
- **Solve without the language crutch.** Pick 15–20 basic logic problems (FizzBuzz-tier and slightly above: reverse a string without built-ins, find duplicates without a Set, flatten nested arrays manually) and solve them without library functions, to force actual reasoning.
- **Daily small problems, not big projects, for the first month.** 1 problem/day on arrays, strings, hashmaps, recursion (basic tree/graph traversal, no need for hard DP yet). Time-box to 30–45 min; if stuck, look at the approach (not the code), then re-solve from scratch next day.
- **Read code you didn't write.** Pick 3–5 well-written small open-source scripts and explain them out loud, line by line, in your own words — reading logic is a different skill from writing it.
- **Rubber duck every bug.** Before searching Stack Overflow / asking an AI, explain out loud (or in writing) what the code _should_ do vs. what it _is_ doing. Most bugs surface during this explanation, not the fix.
- **Rebuild the same thing 3 ways.** Take one small program (e.g., a to-do CLI) and implement it three times: once with loops, once recursively, once using built-in higher-order functions (map/filter/reduce). This builds flexibility, not just familiarity.
- **Estimate complexity by feel.** For every solution, ask "if the input was 100x bigger, would this still work?" before checking Big-O formally — build the intuition first, formalize it after.

### 2. Linux & Terminal

- File permissions
- Process management (`ps`, `top`, `kill`)
- `systemd`
- Logs (`journalctl`, `/var/log`)
- Package managers
- Cron jobs
- _(alt to cron)_ `systemd` timers — more modern, better logging than cron

### 3. SSH

- Key-based auth
- Tunneling
- `scp` (or `rsync` as a more robust alternative for repeated transfers)
- `~/.ssh/config`

### 4. Git

- Branching
- Merge vs rebase
- Resolving conflicts
- `.gitignore`
- PR workflow
- Git hooks
- _(alt workflows)_ trunk-based development vs. GitFlow — know both, most companies pick one

### 5. curl & Postman

- Requests with headers/auth/body
- Collections & environments
- Testing error cases
- _(alternatives)_ Insomnia, Bruno (open-source, git-friendly), HTTPie (CLI-first)

### 6. HTTP Methods & Status Codes

- GET/POST/PUT/PATCH/DELETE
- Idempotency
- Status codes (2xx–5xx)
- Headers
- Request/response lifecycle

---

## Phase 2 — Core Backend

### 7. Databases (SQL first, then NoSQL)

- Normalization
- Indexes
- Joins
- Transactions
- ACID
- N+1 query problem
- When to use NoSQL (MongoDB/Redis) vs. staying relational
- _(SQL alternatives)_ PostgreSQL (default recommendation) vs. MySQL vs. SQLite (for small/local projects)
- _(NoSQL alternatives)_ MongoDB (documents) vs. DynamoDB (managed, AWS-native) vs. Cassandra (write-heavy, wide-column)
- **Logic drill:** given a slow query, practice reading `EXPLAIN ANALYZE` output and reasoning about _why_ it's slow before adding an index — guessing indexes without understanding the query plan is a common junior mistake.

### 8. SQL Injection Protection

- Parameterized queries / prepared statements
- ORM safety
- Input sanitization

### 9. Caching Layer (Redis)

- Caching strategies (cache-aside, TTL, write-through)
- Pub/sub
- Sessions & rate limiting
- _(alternatives)_ Memcached (simpler, pure caching) vs. in-process caching (fine for single-instance apps, breaks on horizontal scale)

### 10. Auth vs Authz

- Sessions vs JWT
- OAuth2 basics
- Refresh tokens
- RBAC
- _(alt to rolling your own)_ Auth0, Clerk, Supabase Auth, or Firebase Auth — know when "build vs. buy" makes sense for auth specifically, since it's a common source of security bugs

### 11. CSRF & Web Security

- CSRF vs XSS vs CORS
- SameSite cookies
- CORS configuration

### 12. Rate Limiting

- Token bucket / sliding window algorithms — **implement both from scratch once**, don't just use a library first time, so you understand the trade-offs
- Redis-based implementation
- API gateway-level limiting (Nginx, Kong, or cloud API Gateway as alternatives to app-level limiting)

### 13. SSRF

- How it's exploited
- Allow-listing URLs/IPs
- Blocking internal ranges

---

## Phase 3 — Shipping to Production

### 14. Docker

- Dockerfile
- docker-compose (app + db + redis)
- Volumes
- Networking basics
- _(alt/next step)_ Podman (daemonless alternative to Docker); Kubernetes only after Docker is solid — don't skip to K8s early

### 15. CDN

- What a CDN caches
- Cache invalidation
- Edge vs origin
- _(options)_ Cloudflare, Fastly, AWS CloudFront, Bunny CDN

### 16. TLS/SSL

- TLS handshake (high-level)
- Certificate authorities
- Why plain HTTP is insecure
- Let's Encrypt (free, automated certs) as the practical default

### 17. API Design

- REST conventions
- Versioning
- Pagination (offset-based vs. cursor-based — know when cursor is necessary)
- Error response structure
- _(alternatives to REST)_ GraphQL (flexible querying, avoids over/under-fetching) vs. gRPC (fast, typed, internal service-to-service) vs. tRPC (TypeScript-only, skips schema step)
- **Logic drill:** design an API contract on paper (endpoints, methods, request/response shapes, error cases) _before_ writing a single route — this is the single highest-leverage habit for avoiding messy APIs later.

### 18. System Design Basics

- Load balancing (round robin vs. least-connections vs. consistent hashing)
- Horizontal vs vertical scaling
- Caching layers
- Message queues — Kafka (high-throughput streaming) vs. RabbitMQ (traditional task queues) vs. Redis Streams / SQS (simpler, managed alternatives)
- Microservices vs monolith (default to monolith first — most systems don't need microservices until they hit real scale or team-size pain)
- **Logic drill:** for any system design question, practice the "back of the envelope" numbers pass first — estimate requests/sec, data size, and bottlenecks with rough math before proposing an architecture.

### 19. Testing

- Unit tests
- Integration tests
- Mocking
- Basic CI running tests
- _(bonus, underrated)_ Write the test cases (not the test code, just the _cases_ — edge cases, boundary values, invalid input) before writing the function. This is a logic-building exercise disguised as a testing practice.

### 20. Deployment & CI/CD

- Deploy to VPS/cloud
- _(options)_ Railway, Render, Fly.io (simple/managed) vs. AWS/GCP/Azure (full control, steeper learning curve) vs. a raw VPS (DigitalOcean, Hetzner) for understanding the fundamentals
- GitHub Actions basics (or GitLab CI / CircleCI as alternatives)
- Env variables & secrets management (Doppler, AWS Secrets Manager, or `.env` + vault for smaller setups)

### 21. Logging & Monitoring

- Structured logging
- Basic monitoring tools — options: Grafana + Prometheus (self-hosted, free) vs. Datadog / New Relic (managed, paid) vs. Sentry (error-tracking specifically)
- Reading stack traces
- **Logic drill:** given a stack trace with no context, practice identifying the actual failure point vs. the symptom — this is a distinct skill from writing code and rarely practiced deliberately.

---

## Suggested Order

1. Fundamentals + logic-building drills (1a) + pick stack
2. Git, Linux, curl/Postman, HTTP
3. CRUD APIs + SQL + auth
4. Redis, rate limiting, CSRF/CORS/SSRF
5. Docker + deployment
6. System design + CDN/TLS
7. Testing + CI/CD + monitoring
8. Build 2–3 deployed projects covering all of the above

> One well-built, deployed, documented project (auth + DB + Redis + Docker + rate limiting) beats 10 tutorial clones.
>
> But logic-building (1a) should run **in parallel with everything else**, not just at the start — 15–20 min of deliberate problem-solving daily, even during Phase 3, keeps the muscle from atrophying while you're focused on infra/deployment topics.

---
