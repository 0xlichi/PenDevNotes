---
title: 'Web Server Fingerprinting and enumeration'
description: 'A complete guide to fingerprinting modern webstack annd attacks'
category: '0xlichi'
tags: ['attack', 'bug-bounty', 'web-pentesting', 'pentesting', 'webstack']
date: '28-11-2026'
---

# Web Server Fingerprinting and Misconfiguration Guide

A simplified, easy to read version of the notes on identifying web servers and finding common misconfigurations.

## Table of Contents

1. [Identifying Web Servers](#1-identifying-web-servers)
2. [Python HTTP Server](#2-python-http-server)
3. [Apache](#3-apache)
4. [Node.js (Express)](#4-nodejs-express)
5. [Nginx](#5-nginx)
6. [Common Misconfigurations Across Servers](#6-common-misconfigurations-across-servers)
7. [IIS Fingerprinting and Enumeration](#7-iis-fingerprinting-and-enumeration)
8. [IIS Tilde (Short Filename) Enumeration](#8-iis-tilde-short-filename-enumeration)
9. [WebDAV Exploitation](#9-webdav-exploitation)
10. [ASPX Web Shell](#10-aspx-web-shell)
11. [IIS Misconfigurations](#11-iis-misconfigurations)
12. [Automation Methods](#12-automation-methods)

## Learning Objectives

- Identify web server software and versions using response headers and default error pages
- Understand the risks of Python's built in HTTP server when it is accidentally exposed
- Find Apache directory listings, exposed status pages, and unlinked backup files
- Spot debug endpoints, verbose errors, and environment variable leaks in Node.js Express apps
- Detect Nginx directory listing (autoindex) and exposed status pages
- Run a security header check across multiple servers using curl

## 1. Identifying Web Servers

Before digging into folders or testing inputs on a website, it helps to first find out what software is running it. Knowing the server software tells you what kind of mistakes are common for it, which paths are worth checking, and which tools will work best. This step is not just a formality, it shapes everything that comes after.

Most servers reveal themselves if you know where to look, because many are left in their default setup, and default setups are often quite talkative about version details.

### The Server Response Header

The simplest clue is the `Server` header sent back with every response. Different software formats this header differently, which makes it a reliable identifier.

Use curl with `-I` to request only the headers, not the full page:

```bash
# -s hides the progress bar
# -I sends a HEAD request, which returns only the headers
curl -sI http://10.48.162.234:80
```

This header often tells you the software and version directly. A properly secured server may hide this, but many default setups (like Ubuntu's Apache) still show it.

Default headers you may see in a typical lab setup:

| Port | Server             | Default Header               |
| ---- | ------------------ | ---------------------------- |
| 80   | Apache2            | Apache/2.4.x (Ubuntu)        |
| 8000 | Python HTTP Server | SimpleHTTP/0.6 Python/3.xx.x |
| 3000 | Node.js Express    | None by default              |
| 8080 | Nginx              | nginx/1.xx.x                 |

Node.js Express normally does not send a `Server` header at all, so its absence is itself a clue. Instead, look for the `X-Powered-By` header, which Express adds automatically.

### The X-Powered-By Header

Some frameworks add this header to show what is running underneath. Express sets it by default:

```bash
X-Powered-By: Express
```

This is separate from the `Server` header, and for Express it is usually the main clue. Always check for it when the `Server` header is missing or too generic to be useful.

### Browser DevTools

You can see the same header information in a browser without any extra tools. Open the site in Firefox, press F12 (or right click and choose Inspect) to open Developer Tools, go to the Network tab, refresh the page, click the main request, and look under Response Headers.

### Default Error Pages

A HEAD request (`-I`) only returns headers. To see the full page content, including error pages, use a plain GET request:

```bash
# HEAD request, headers only
curl -sI http://10.48.162.234:PORT/

# GET request, full page content
curl -s http://10.48.162.234:PORT/nonexistent-page-xyz
```

When you request a page that does not exist, most servers show a default 404 error page, and each one looks different. Python shows plain text. Nginx includes its version in the page footer. Apache names itself in the body text. These differences can help you identify the server even when the `Server` header has been hidden.

## 2. Python HTTP Server

Python comes with a built in HTTP server that anyone can start with one command. This convenience is exactly why it shows up during security testing.

```bash
# Serves the current folder over HTTP on port 8000
python3 -m http.server 8000
```

People use it to quickly share files or test a simple website. The problem is that this quick, temporary server sometimes gets left running by mistake on a public facing machine, with no login requirement, no access control, and barely any logging.

### What It Serves

This server shares the entire folder it is run in, including hidden files like `.env`. There is no equivalent to `.htaccess`, no blocklist, and no way to restrict certain files. If a file exists in that folder, anyone who can reach the server can download it. This is different from Apache or Nginx, where listing files is turned off by default and admins can restrict specific paths.

### Directory Listing

If there is no `index.html` file in the folder, Python's server automatically creates a page listing every file inside it.

```bash
curl -s http://10.48.162.234:8000/
```

You should see a page titled "Directory listing for /". Every file shown there can be opened directly.

### Accessing Hidden Files (Dotfiles)

Files starting with a dot, like `.env`, are normally hidden on Linux, but this server ignores that convention and serves them like any other file. The `.env` file is a common target since it often stores passwords and other settings:

```bash
curl -s http://10.48.162.234:8000/.env
SECRET_KEY=dev-secret-key-do-not-use
DATABASE_URL=postgresql://webapp:S3cur3DBPass!@localhost/production
DEBUG=True
```

### Downloading and Checking Archives

If you spot a `.zip` or `.tar.gz` file in the listing, download it and look inside. Developers sometimes leave backup archives in the same folder, and these can contain source code, database dumps, or configuration files.

### Why This Matters

This is a realistic and common finding because no actual exploit is needed. The server works exactly as it was designed to. The real problem is that it is running somewhere it should not be, sharing files that were never meant to be public.

Note: if the folder contains an `index.html` file, Python will show that page instead of the file listing. If you do not see a listing at the root, try other folder paths directly.

## 3. Apache

Apache is the most widely used web server in the world, so it shows up in almost every test involving websites. Its default Ubuntu setup leaves a few things turned on that testers find often: directory listing on certain paths, the status module, and backup files sitting in the main web folder.

### Version Disclosure

Start by checking the `Server` header:

```bash
curl -SI http://10.48.162.234:80 | grep -i server
```

Ubuntu's Apache usually shows both the operating system name and the exact version number. Knowing the version lets you check it against known security issues.

### Directory Listing

Apache has a setting called `Options +Indexes` that tells it to show a file list whenever a folder has no `index.html` page. Sometimes this is turned on intentionally for internal file sharing, and sometimes it is left on by accident in a folder that holds sensitive data.

Visit `http://10.48.162.234/files/` and you should see a page titled "Index of /files" with filenames, sizes, and dates. Whenever you find a listing like this, it is worth checking every file inside, since developers sometimes leave notes, exports, or backups there without realizing anyone can see them.

### The mod\_status Page

Apache has a built in status page (`mod_status`). It is supposed to only be visible from the same machine (localhost), but if it is misconfigured it can be reached by anyone:

`http://10.48.162.234:80/server-status`

This page shows active connections, total requests served, worker states, and the server version and start time. On a live server, this leaks real time details about what others are doing and what internal paths exist.

Note: `mod_status` is restricted to localhost by default on Ubuntu, but a stray `Require all granted` rule anywhere in the site configuration can silently remove that restriction. Always check `/server-status`, even if the rest of the server looks properly locked down.

### Finding Hidden Files with Gobuster

Not everything is linked from a visible page. Backup files and forgotten test files often sit in the main folder with nothing pointing to them. A tool like Gobuster finds these by guessing file names from a wordlist:

```bash
# -u target URL
# -w wordlist path
# -x extensions to try with each guessed name
gobuster dir -u http://TARGET_IP:80 -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt -x bak,txt,html -t 20
```

If Gobuster finds a `.bak` file, it is almost always worth opening since backup files often contain configuration details or source code.

Also watch for `.htpasswd` files. Apache uses these to store usernames and password hashes for basic login protection. Finding one gives you a password hash you can try to crack offline, and confirms that some part of the site uses this kind of login.

```bash
curl -s http://10.48.162.234:80/backup.bak
```

## 4. Node.js (Express)

Node.js applications work differently from Apache or Python's server. They are not just serving static files from a folder, they are running real application code that decides what to send back for every request. This flexibility is powerful, but it is also where mistakes often happen.

These applications often get tested specifically because developers leave features meant only for development turned on in production. Debug endpoints, detailed error messages, and exposed settings all come from the same habit: code written for testing that went live without being cleaned up.

### Framework Fingerprinting

Check the headers on port 3000:

```bash
curl -sI http://10.48.162.234:3000
```

You should see `X-Powered-By: Express`. This header is added automatically unless a developer turns it off, so seeing it confirms you are dealing with an Express app.

### Reading the Application Version

The main page of many Express apps returns a short status message in JSON format:

```bash
curl -s http://10.48.162.234:3000
```

If it includes a version number, note it down, it can be checked against known issues for that version.

### Triggering Detailed Error Messages

Express normally hides detailed error messages when the app is set to run in production mode. But developers often write their own custom error handling code, and that custom code can leak details regardless of the mode setting.

```bash
curl -s http://10.48.162.234:3000/api/users | jq
```

A 500 error from an endpoint like this is worth a closer look. In a poorly configured app, the response can include the full error message, the exact line of code that failed, internal file paths, and sometimes even the database command that caused the problem.

### Finding Routes Through Debug Endpoints

Some Express apps include a convenience feature built during development that lists every page or function the app handles, and this sometimes gets left in by mistake:

```bash
curl -s http://10.48.162.234:3000/api/routes
```

If this works, you get a full map of the app's structure instantly, saving time compared to guessing paths with a tool like Gobuster.

Note: this kind of endpoint usually works by reading an internal Express property, and the exact structure can change between Express versions. If the output looks unusual or broken, the app may be using a newer or older version of Express than expected.

### Exposed Settings and Passwords

Application settings in Node.js often include database passwords, API keys, and other configuration flags. If a debug endpoint returns all of these at once, it is a serious finding:

```bash
curl -s http://10.48.162.234:3000/api/debug/env
```

If you see fields like `DB_PASSWORD` or `SECRET_KEY`, write them down. Also note whether the app reports it is running in development mode, since that on a live server is itself a warning sign.

### Static File Serving

Express apps commonly serve files like JavaScript, stylesheets, and configuration directly to visitors. These are technically meant to be public, but sometimes contain more information than intended, such as internal server names or hidden settings:

```bash
curl -s http://10.48.162.234:3000/static/config.js
```

Once you know the app's routes, check what files are being served this way.

Note: by default, Express will not serve hidden files like `.env` through this static file feature, it quietly returns a 404 instead. This is the opposite of Python's server, which shows hidden files without any restriction. A 404 here does not necessarily mean the file is missing, it may just mean this particular route is blocking it.
