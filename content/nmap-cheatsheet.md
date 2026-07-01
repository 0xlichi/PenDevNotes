---
title: "Nmap Cheatsheet"
description: "The Nmap scan flags and workflows I actually reach for during recon."
category: "Recon"
tags: ["nmap", "recon", "cli"]
date: "2026-01-05"
---

## Quick Scan

```bash
nmap -sV -sC -oA scan_initial <target>
```

- `-sV` service/version detection
- `-sC` default scripts
- `-oA` output in all formats (normal, XML, grepable)

## Full Port Scan

```bash
nmap -p- --min-rate 5000 -oA scan_allports <target>
```

Once you have the open ports, feed them into a focused second pass:

```bash
nmap -p 22,80,443,8080 -sV -sC -oA scan_focused <target>
```

## UDP Scan (Top Ports)

```bash
nmap -sU --top-ports 20 <target>
```

UDP scans are slow - narrowing to the top ports first saves a lot of time.

## Useful NSE Scripts

```bash
nmap --script vuln <target>
nmap --script http-enum -p 80,443 <target>
```

## Output Parsing

Grepable output (`.gnmap`) is handy for quick `awk`/`grep` pipelines:

```bash
grep "open" scan_allports.gnmap | awk '{print $2}'
```
