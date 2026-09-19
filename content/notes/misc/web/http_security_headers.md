---
title: 'HTTP Security Headers'
description: 'A beginner-to-intermediate guide to HTTP security headers, what each header does, why it matters, common misconfigurations, and hands-on curl commands to test them yourself.'
category: 'Misc'
tags: ['http', 'http-security-headers', 'bug-bounty', web-pentesting]
date: '2026-09-15'
---

# HTTP Security Headers: A Complete Beginner's Guide

Let’s start from the basics and build everything up properly. By the end, you’ll understand what each header does, why it exists, what breaks without it, and how to test it yourself.

## Table of Contents

1. [What Are HTTP Security Headers?](#what-are-http-security-headers)
2. [Why Do They Matter?](#why-do-they-matter)
3. [How to Check Headers Yourself](#how-to-check-headers-yourself)
4. [The Core Security Headers](#the-core-security-headers)
   - [1. Content-Security-Policy (CSP)](#1-content-security-policy-csp)
   - [2. X-Frame-Options](#2-x-frame-options)
   - [3. Strict-Transport-Security (HSTS)](#3-strict-transport-security-hsts)
   - [4. X-Content-Type-Options](#4-x-content-type-options)
   - [5. Referrer-Policy](#5-referrer-policy)
   - [6. Permissions-Policy](#6-permissions-policy)
   - [7. Set-Cookie Security Flags](#7-set-cookie-security-flags)
   - [8. Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP)](#8-cross-origin-opener-policy-coop-and-cross-origin-embedder-policy-coep)
   - [9. CORS (Cross-Origin Resource Sharing)](#9-cors-cross-origin-resource-sharing)
   - [10. CSP Bypasses](#10-csp-bypasses)
   - [11. CSP Nonces and Hashes (Practical Modern CSP)](#11-csp-nonces-and-hashes-practical-modern-csp)
   - [12. CSP Reporting](#12-csp-reporting)
   - [13. Cross-Origin-Resource-Policy (CORP)](#13-cross-origin-resource-policy-corp)
   - [14. Origin-Agent-Cluster](#14-origin-agent-cluster)
   - [15. Cache-Control](#15-cache-control)
   - [16. Clear-Site-Data](#16-clear-site-data)
   - [17. Cookie Prefixes: `__Host-` and `__Secure-`](#17-cookie-prefixes-__host--and-__secure-)
   - [18. Practical Testing Commands](#18-practical-testing-commands)
   - [19. Header Misconfiguration Examples](#19-header-misconfiguration-examples)
5. [Quick Reference Table](#quick-reference-table)
6. [How to Test a Site's Headers (For Practice)](#how-to-test-a-sites-headers-for-practice)
7. [Summary](#summary)

## What Are HTTP Security Headers?

Before we look at any specific header, you need a clear mental model of where headers even live. Every time your browser talks to a website, the server sends back a response. That response has two parts: headers and a body. The body is the actual content you see rendered, the HTML, the images, the text. The headers are metadata, instructions the server attaches to that response telling the browser how to handle it.

Now, security headers are a particular subset of these instructions. Instead of describing content (like "this is a JPEG" or "this response is 4KB"), they describe safety rules. They tell the browser things like:

- Only load scripts from trusted sources
- Never show this page inside another site's frame
- Always use HTTPS, never HTTP
- Don't guess the file type, trust what I told you

Picture it this way: the server is handing the browser a package, and stapled to the outside of that package is a list of handling instructions. The browser is expected to read those instructions and follow them exactly, and that is the entire job of a security header.

## Why Do They Matter?

Here's the question you should be asking yourself right now: what actually goes wrong if a site skips all of this? Let's walk through it.

Without proper security headers, a website is exposed to a handful of very common, very well understood attack classes:

- Cross-Site Scripting (XSS): an attacker injects malicious JavaScript into a page, and it runs as if it belonged there
- Clickjacking: an attacker tricks a user into clicking something hidden inside an invisible frame
- MIME sniffing attacks: the browser misreads a file's type and runs something dangerous that was never meant to be executed
- Man-in-the-middle attacks: an attacker intercepts traffic because the site allowed plain HTTP somewhere in the chain

Here's the part that should stick with you: security headers are one of the cheapest, highest-leverage defenses that exist in web security. They cost almost nothing to add, usually just a few lines of server configuration, yet a single missing or misconfigured header can be the difference between an attack landing and an attack being blocked outright by the browser itself. This is why, when you eventually move into pentesting or bug bounty work, checking headers is one of the very first things you'll do against any target.

## How to Check Headers Yourself

Let's not stay theoretical. Before we go through each header one by one, you should know how to actually look at them yourself, on any site, right now.

The fastest way, from the terminal:

```bash
curl -I https://example.com
```

That `-I` flag tells curl to fetch only the headers, not the page body, which keeps the output clean and easy to scan.

You can also do this visually in the browser: open Developer Tools, go to the Network tab, click on any request in the list, and look at the Response Headers section.

And if you want a quick graded overview without doing any of this manually, there are free tools like securityheaders.com that scan a site and score its headers for you. That's a good sanity check, but you should still know how to read the raw headers yourself, because automated graders miss context that you, as the analyst, will catch.

## The Core Security Headers

Now we get into the headers themselves. I've grouped these roughly from foundational to advanced, so work through them in order.

### 1. Content-Security-Policy (CSP)

Let's start with the big one. If you only learn one header well, make it this one. CSP is the most powerful and most important security header, because it controls what sources of content, scripts, styles, images, fonts, and more, the browser is allowed to load on a given page.

Here's what it looks like in practice:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
```

Let's break that down piece by piece:

- `default-src 'self'` means by default, only load resources from the same origin as the page itself
- `script-src 'self' https://trusted-cdn.com` narrows things further for scripts specifically: scripts can only come from the site itself or from that one named CDN

Now think about why this matters. Even if an attacker manages to inject a `<script>` tag into your page, which is exactly what an XSS attempt tries to do, the browser will simply refuse to execute it if it violates the policy. The malicious script gets delivered, but it never runs. This is what makes CSP one of the strongest defenses against XSS that exists at the browser level.

Here are the directives you'll see most often:

| Directive         | What it controls                               |
| ----------------- | ---------------------------------------------- |
| `default-src`     | Fallback for all resource types                |
| `script-src`      | Where JavaScript can load from                 |
| `style-src`       | Where CSS can load from                        |
| `img-src`         | Where images can load from                     |
| `connect-src`     | Where fetch/XHR/WebSocket can connect to       |
| `frame-ancestors` | Who is allowed to embed this page in an iframe |
| `object-src`      | Controls Flash/plugins (usually set to `none`) |

One practical tip before you move on: when you're rolling out a new CSP on a real site, start with `Content-Security-Policy-Report-Only` while testing. It logs violations to the browser console instead of actually blocking anything, which lets you catch problems before you break the site for real users.

### 2. X-Frame-Options

Next, let's talk about a much simpler, older header, but still relevant.

X-Frame-Options controls whether your page can be placed inside an iframe on another site. Why would that matter? Because it directly protects against clickjacking, where an attacker overlays your page inside an invisible iframe and tricks a user into clicking buttons they can't actually see, buttons that belong to your site, not the attacker's.

The header looks like this:

```
X-Frame-Options: DENY
```

You have two real options here:

- `DENY`: nobody is allowed to frame this page, not even the site itself
- `SAMEORIGIN`: only pages from the same site are allowed to frame it

One thing worth knowing: this header is gradually being replaced by the `frame-ancestors` directive inside CSP, which does the same job more flexibly. That said, it's still good practice to set both, since older browsers may not support `frame-ancestors` yet.

### 3. Strict-Transport-Security (HSTS)

This next one deserves a slower walkthrough, because the reasoning behind it is a little more subtle than the others.

HSTS tells the browser: always use HTTPS for this site, never fall back to plain HTTP, even if the user types "http://" manually or clicks on an old link somewhere.

Here's what it looks like:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Let's go through each piece:

- `max-age=31536000` tells the browser to remember this rule for one year, expressed in seconds
- `includeSubDomains` extends the rule to every subdomain of the site, not just the exact domain named
- `preload` allows the site to be added to a browser's built-in preload list, so that even the very first request the browser ever makes to that domain is forced onto HTTPS

Now, why does any of this matter? Without HSTS, an attacker sitting on the same network as the user, say, public wifi at a coffee shop, can intercept the first HTTP request before it gets the chance to redirect to HTTPS, and from there steal or modify the traffic. This attack has a name: SSL stripping. The attacker positions themselves between the user and the real site, quietly downgrades every request to plain HTTP, while relaying the HTTPS version back and forth with the real server, so the user never notices anything is wrong. HSTS closes this gap entirely by making the browser refuse plain HTTP outright, so there's nothing left for the attacker to strip once that first HTTPS visit has happened.

But here's the catch, and this is the part students often miss: what protects that very first request, before the browser has ever seen the HSTS header even once? This is called the trust-on-first-use problem. If that first-ever connection to a domain happens over HTTP on a hostile network, an attacker can strip it before the browser has learned the rule at all. This is exactly why the preload list exists. Browsers ship with a hardcoded list of domains, maintained at hstspreload.org, that are forced onto HTTPS starting from the very first connection, closing the trust-on-first-use gap completely.

Now let's talk about how this goes wrong in practice, because it does, often:

- Setting a short `max-age`, like a few minutes, for testing purposes, and then forgetting to raise it before the site goes live, which leaves almost no real protection in place
- Forgetting `includeSubDomains`, which means an attacker can still target something like `dev.example.com` or `old.example.com` over plain HTTP, even though the main domain looks protected
- Requesting inclusion on the preload list without `includeSubDomains` and a `max-age` of at least one year, both of which hstspreload.org requires before it will accept a domain
- Only serving the HSTS header on the HTTPS response, and not accounting for the fact that the very first plain HTTP request remains unprotected until the header has been received at least once, unless the domain is preloaded

To test HSTS yourself:

```bash
curl -I https://example.com | grep -i strict-transport-security
```

If that header comes back missing entirely, or if `max-age` is suspiciously low, that's worth flagging in a recon report. You can also check a domain's preload status directly at hstspreload.org.

### 4. X-Content-Type-Options

This one is short, but don't skip it, it closes a surprisingly sneaky hole.

```
X-Content-Type-Options: nosniff
```

Here's the problem it solves: browsers sometimes try to guess the type of a file instead of trusting the `Content-Type` header the server actually sent. This behavior is called MIME sniffing. Attackers can abuse this. For example, imagine uploading a file that looks like an image on the surface, but the browser decides, based on its own guess, to treat it as JavaScript and execute it instead.

Setting `nosniff` is the browser equivalent of saying: trust the Content-Type I gave you, stop guessing.

### 5. Referrer-Policy

Let's move to a header about information leakage rather than execution.

Referrer-Policy controls how much information is sent in the `Referer` header when a user clicks a link from your site out to another site.

```
Referrer-Policy: strict-origin-when-cross-origin
```

Ask yourself why this matters: by default, the full URL of the page a user is leaving, which might contain sensitive information like a search query or even a session token embedded in the URL, can leak to whatever destination site they land on next. This header is how you limit exactly how much of that gets shared.

Here are the values you'll run into most often:

| Value                             | Behavior                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `no-referrer`                     | Never send referrer info                                                                    |
| `same-origin`                     | Only send it when staying on the same site                                                  |
| `strict-origin-when-cross-origin` | Send full URL on same-origin, only the domain on cross-origin, nothing on downgrade to HTTP |

### 6. Permissions-Policy

Now let's look at a header that isn't about scripts or navigation at all, it's about hardware and browser features.

Permissions-Policy controls which browser features and APIs a page, and any iframes embedded inside it, are allowed to use. Think camera, microphone, geolocation, USB access, and similar sensitive capabilities.

```
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

In this example, geolocation, camera, and microphone access are all disabled completely for the page. Why bother? Because this limits the blast radius if a malicious script, or a compromised third-party iframe embedded on your page, tries to reach for these features. Even if something malicious does execute, it simply can't touch the camera or the user's location if the policy forbids it.

### 7. Set-Cookie Security Flags

This next one is technically not a dedicated security header on its own, but you need to know it, because cookies are one of the most commonly attacked pieces of a web application, and their security depends entirely on a few flags set inside `Set-Cookie`.

```
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict
```

Let's walk through each flag and what it actually buys you:

- `Secure`: the cookie is only ever sent over HTTPS, never over plain HTTP
- `HttpOnly`: the cookie cannot be accessed by JavaScript at all, which is a direct defense against XSS attacks that try to steal session cookies through injected scripts
- `SameSite=Strict` (or `Lax`): the cookie is not sent on cross-site requests, which is your main defense against CSRF (Cross-Site Request Forgery) attacks

### 8. Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP)

Now we start getting into the more advanced, process-level isolation headers. Don't worry if these feel abstract at first, they're solving a different kind of problem than the ones above: not "can this script run" but "can this origin's memory be observed by another origin at all."

These headers isolate your page from other origins at the browser's process level.

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

- COOP prevents other windows or tabs from holding a reference to your window object, which protects against certain cross-window attacks, including Spectre-style side channel attacks
- COEP requires that any cross-origin resource loaded by your page has explicitly opted in to being loaded that way, adding another layer of isolation on top

You won't need these for every site. They're mainly relevant for sites doing genuinely sensitive work, think banking platforms or high-security applications, or sites that rely on features like `SharedArrayBuffer`.

### 9. CORS (Cross-Origin Resource Sharing)

We're now moving from single headers into something that's actually a whole mechanism, so pay close attention here, because CORS misconfigurations are one of the most commonly found real-world vulnerabilities you'll encounter once you start doing bug bounty or pentest work.

CORS is not one header, it's a set of headers that control whether a script running on one origin, say `evil.com`, is allowed to read a response coming back from a different origin, say `api.example.com`, when it makes a request using `fetch` or `XMLHttpRequest`.

Here's the baseline behavior you need to understand first: by default, browsers block cross-origin reads of a response unless the server explicitly grants permission. CORS headers are exactly how a server grants that permission.

The key headers involved:

```
Access-Control-Allow-Origin: https://trusted-app.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

Let's go through what each one is actually doing:

- `Access-Control-Allow-Origin` tells the browser which origin is allowed to read the response. It can be a specific origin, or it can be `*`, meaning any origin at all.
- `Access-Control-Allow-Credentials: true` allows the cross-origin request to include cookies or authorization headers. Important detail here: this flag only works if `Access-Control-Allow-Origin` names a specific origin. Browsers will flatly refuse to combine `*` with credentials, because that combination would be catastrophically insecure.
- `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` define which HTTP methods and which headers are permitted in the actual cross-origin request.

Now, here's where it gets interesting for you specifically, since this is directly relevant to the kind of work you're heading toward. These are the common misconfigurations you'll actually find in the wild:

- Reflecting the request's `Origin` header straight back into `Access-Control-Allow-Origin`, combined with `Access-Control-Allow-Credentials: true`. Think about what this actually does: it effectively lets any website on the internet read authenticated responses, because the server will say yes to whatever origin happens to ask.
- Using `Access-Control-Allow-Origin: *` on an endpoint that returns sensitive data, under the assumption that it's safe because there are no cookies involved, while forgetting that API keys or tokens sitting in the response body are still exposed to any site that asks.
- Trusting origins based on a substring match, like anything that merely contains `example.com`, which can be bypassed with a crafted domain like `example.com.evil.com` or `evilexample.com`.
- Allowing `null` as a trusted origin, which can actually be triggered from sandboxed iframes or local files, letting an attacker forge that origin value entirely.

To test CORS yourself, send a request with a spoofed Origin header and see how the server reacts:

```bash
curl -I -H "Origin: https://evil.com" https://target.com/api/data
```

Look closely at what comes back in `Access-Control-Allow-Origin`. If it reflects `evil.com` straight back, and `Access-Control-Allow-Credentials: true` is also present, you've found a real, reportable issue.

### 10. CSP Bypasses

We introduced CSP back in section 1 as one of the strongest defenses against XSS. Now let's get honest about its weaknesses, because a CSP is only ever as strong as its weakest directive, and knowing how CSPs get bypassed is just as important as knowing how to write one.

Let's go through the common bypass patterns one at a time.

`unsafe-inline`:

```
Content-Security-Policy: script-src 'self' 'unsafe-inline'
```

This allows inline `<script>` tags and inline event handlers, like `onclick="..."`, to execute. Think through the consequence: if an attacker can inject HTML into the page at all, which is exactly what a classic XSS entry point gives them, `unsafe-inline` means their injected script runs anyway, completely defeating the point of having a CSP in the first place.

`unsafe-eval`:

```
Content-Security-Policy: script-src 'self' 'unsafe-eval'
```

This one permits `eval()`, `new Function()`, and similar dynamic code execution mechanisms. If an attacker can control any string that eventually reaches `eval`, this directive lets that string run as real code.

Wildcards:

```
Content-Security-Policy: script-src *
```

This allows scripts from literally any domain, which strips away nearly all the protection CSP was meant to provide. A subtler version of the same mistake is something like `script-src https:`, which allows any HTTPS source at all, still far too permissive to be meaningful.

JSONP endpoint abuse:

Here's a more advanced one worth sitting with. Even with a strict `script-src` that only allows a trusted CDN or one specific whitelisted domain, if that domain happens to host a JSONP endpoint, meaning an endpoint that reflects a callback parameter directly into executable JavaScript, an attacker can point a script tag at that endpoint and get arbitrary code to run. Why does this work? Because the browser sees the request as coming from a source the policy already allows.

```
<script src="https://trusted-cdn.com/jsonp?callback=alert(document.cookie)"></script>
```

Trusted CDN abuse:

Allowing a large, general-purpose CDN in `script-src`, one that hosts thousands of different open source libraries, carries its own risk. An attacker who can't inject into your site directly might still find an old, vulnerable library version hosted on that same CDN, and load that instead.

The lesson to take away: a CSP that includes `unsafe-inline`, `unsafe-eval`, wildcards, or overly broad trusted domains gives you a false sense of security. A genuinely strong CSP avoids all of these wherever it possibly can.

### 11. CSP Nonces and Hashes (Practical Modern CSP)

So if `unsafe-inline` is dangerous but plenty of real applications still need some inline scripts to function, what's the actual solution? This is where modern CSP gives you two much safer alternatives: nonces and hashes.

Nonces:

A nonce is a random, single-use token, generated fresh by the server on each page load, and it gets added both to the CSP header and to the script tag itself.

```
Content-Security-Policy: script-src 'self' 'nonce-r4nd0mBase64Value'
```

```html
<script nonce="r4nd0mBase64Value">
  console.log('this is allowed to run');
</script>
```

Any script tag that doesn't carry the matching nonce gets blocked, even if an attacker manages to inject one, since they can't predict that random value ahead of time. Here's the critical rule: a new nonce must be generated on every single page load. Reusing the same nonce across requests defeats the entire purpose.

Hashes:

A hash-based CSP takes a different approach: it allows one specific, known inline script by its exact content hash, rather than by a token.

```
Content-Security-Policy: script-src 'self' 'sha256-abc123examplehashvalue='
```

The browser hashes the content of every inline script it encounters and only executes it if that hash matches one already listed in the policy. This approach works well for static inline scripts that never change, but it breaks the instant the script's content is edited even slightly, since the hash would no longer match.

As a rule of thumb: nonces are generally preferred for dynamic, server-rendered pages, while hashes work well for static content that rarely, if ever, changes.

### 12. CSP Reporting

One more piece of the CSP picture before we move on. CSP doesn't have to just silently block violations, it can also report them back to the server, which is extremely useful both for catching real attacks in progress and for catching legitimate breakages caused by a policy that turned out to be too strict.

Older syntax, `report-uri`:

```
Content-Security-Policy: default-src 'self'; report-uri /csp-violation-report
```

Newer syntax, `report-to`, which works together with a separate `Reporting-Endpoints` header:

```
Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"
Content-Security-Policy: default-src 'self'; report-to csp-endpoint
```

When a resource gets blocked, the browser sends back a JSON report describing exactly what was blocked and why. In real deployments you'll often see both directives included together, since `report-to` is newer and not yet supported everywhere.

Remember `Content-Security-Policy-Report-Only` from section 1? Using it alongside a reporting endpoint is the standard, safe way to test a new, stricter policy in production without actually breaking anything for real users, since violations are only logged, never enforced, until you've confirmed the policy is safe to flip into full enforcement mode.

### 13. Cross-Origin-Resource-Policy (CORP)

Think of this as the smaller, simpler sibling of COOP and COEP from section 8. CORP controls whether a resource, an image, a script, any file, can be loaded by a different origin at all, and it operates at the network response level.

```
Cross-Origin-Resource-Policy: same-origin
```

Here are the three values you'll encounter:

- `same-origin`: only the exact same origin is allowed to load this resource
- `same-site`: only the same site, including different subdomains, can load it
- `cross-origin`: any origin at all can load it

Why should you care? Without CORP, a malicious site can embed your images, scripts, or fonts, and combined with certain browser side-channel techniques, sometimes infer information about the response, like its size, even without directly reading its contents. CORP is also a required building block for enabling COEP's `require-corp` mode, since COEP checks that every cross-origin resource has explicitly opted in via CORP, or via CORS.

### 14. Origin-Agent-Cluster

```
Origin-Agent-Cluster: ?1
```

This header asks the browser to isolate the page into its own dedicated operating system process, keyed by the full origin, meaning scheme plus host plus port, rather than sharing a process with other pages from the same broader site.

Why does process isolation matter here? Because it's a strong defense against side-channel attacks, including Spectre-class attacks, where malicious code running in one tab attempts to read memory that actually belongs to another origin. Browsers already try to isolate origins automatically in many cases, but this header gives an explicit, guaranteed signal that this particular origin should always get its own dedicated process. It also affects how synchronous access to things like `document.domain` behaves. It's a low-effort header to add, and it pairs naturally with COOP and COEP for sites that want strong isolation guarantees.

### 15. Cache-Control

Let's shift gears for a moment. Cache-Control isn't exclusively a security header, but misusing it is one of the most common, and most avoidable, ways sensitive data ends up leaking. If a page containing personal data, tokens, or account details gets cached by the browser or by an intermediate proxy, that cached copy can be read later by someone else using the same machine, or sitting on the same caching layer.

For any page containing sensitive or user-specific data, you want:

```
Cache-Control: no-store, no-cache, must-revalidate, private
Pragma: no-cache
```

Let's walk through what each directive is actually enforcing:

- `no-store`: never save this response anywhere, not even temporarily
- `no-cache`: the response can technically be stored, but it must be revalidated with the server before it's ever reused
- `must-revalidate`: once a cached copy is considered stale, it must not be reused without checking back with the server first
- `private`: only the end user's own browser may cache this response, shared proxies and CDNs are not allowed to

Here's a very common real-world finding you'll run into: an authenticated page, say an account settings page or an admin panel, served without any `Cache-Control` header at all. That means the browser falls back to its own default caching heuristics, and may keep a copy sitting on disk. On a shared or public computer, the next person to use that machine can sometimes hit the back button and see the previous logged-in user's cached page.

To be clear, this isn't a blanket rule against caching. For genuinely public, non-sensitive content, static assets, marketing pages, and so on, caching is fine, and often actively good for performance. This guidance applies specifically to anything carrying session data, personal information, or tokens.

### 16. Clear-Site-Data

This header tells the browser to wipe stored data associated with the current origin, and it's especially useful to send on logout.

```
Clear-Site-Data: "cache", "cookies", "storage"
```

Here's what each value clears:

- `"cache"`: clears the browser's HTTP cache for this origin
- `"cookies"`: clears cookies belonging to this origin
- `"storage"`: clears localStorage, sessionStorage, IndexedDB, and similar storage mechanisms
- `"*"`: clears everything available, all at once

Why bother with this at all? A plain logout that only deletes the session cookie on the server side can still leave stale tokens or cached authenticated pages sitting around in the browser. Sending this header on the logout response ensures a genuinely clean slate, which matters a great deal on shared or public devices.

### 17. Cookie Prefixes: `__Host-` and `__Secure-`

Back in section 7 we covered the `Secure`, `HttpOnly`, and `SameSite` flags. Cookie prefixes take that idea one step further: instead of relying on the server to remember to set the right flags correctly every single time, they get the browser itself to enforce certain security properties.

`__Secure-` prefix:

```
Set-Cookie: __Secure-session=abc123; Secure; Path=/
```

A cookie named with the `__Secure-` prefix will only be accepted by the browser at all if it also carries the `Secure` flag, meaning it was set over HTTPS. If that flag is missing, the browser rejects the cookie outright, no exceptions.

`__Host-` prefix:

```
Set-Cookie: __Host-session=abc123; Secure; Path=/; SameSite=Strict
```

The `__Host-` prefix goes even further. A cookie carrying this prefix must have `Secure` set, must not have a `Domain` attribute at all (meaning it belongs strictly to the exact host, and cannot be shared with subdomains), and must have `Path=/`. Think about what this buys you: it effectively locks the cookie to one specific origin only, which prevents subdomain-based cookie injection attacks, where a compromised or malicious subdomain tries to set a cookie that the main domain would otherwise trust.

Why does this matter so much? These prefixes shift cookie security from "the developer needs to remember to configure this correctly every time" to "the browser simply refuses to accept the cookie at all if it's misconfigured." That removes an entire category of accidental mistakes from the equation.

### 18. Practical Testing Commands

Let's consolidate everything into something you can actually use. Here's a short, practical toolkit for checking these headers directly from the terminal, the kind of thing you'll run constantly once you're doing recon on real targets.

View all response headers:

```bash
curl -I https://target.com
```

View the full request and response, including redirects and TLS details:

```bash
curl -v https://target.com
```

Follow redirects and show headers at each hop, useful for checking whether HTTP properly redirects to HTTPS, and whether HSTS shows up at each step:

```bash
curl -IL http://target.com
```

Check what cookies are being set and inspect their flags:

```bash
curl -I https://target.com | grep -i set-cookie
```

Send a custom Origin header to test CORS behavior:

```bash
curl -I -H "Origin: https://evil.com" https://target.com/api/endpoint
```

Test whether credentials are allowed cross-origin:

```bash
curl -I -H "Origin: https://evil.com" -H "Cookie: session=test" https://target.com/api/endpoint
```

Check a specific header quickly with grep:

```bash
curl -sI https://target.com | grep -i "content-security-policy\|strict-transport-security\|x-frame-options"
```

One more thing worth knowing: these same checks can be scripted into a broader recon workflow, checking every subdomain you find during enumeration for missing or weak headers, as an easy, fast first pass before you move into deeper manual testing.

### 19. Header Misconfiguration Examples

Let's finish this section by putting vulnerable and properly configured versions side by side. Seeing the difference laid out this way tends to make it stick far better than reading descriptions alone.

Content-Security-Policy:

```
# Vulnerable: allows inline scripts and eval, defeats the purpose of CSP
Content-Security-Policy: script-src 'self' 'unsafe-inline' 'unsafe-eval'

# Better: strict source list with a nonce for the few inline scripts that are needed
Content-Security-Policy: script-src 'self' 'nonce-r4nd0mValue'; object-src 'none'; base-uri 'self'
```

CORS:

```
# Vulnerable: reflects any origin and allows credentials, any site can read authenticated data
Access-Control-Allow-Origin: https://evil.com
Access-Control-Allow-Credentials: true

# Better: explicit allow-list of one trusted origin only
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

Cookies:

```
# Vulnerable: no flags at all, readable by JavaScript, sent over HTTP, sent cross-site
Set-Cookie: session=abc123

# Better: locked down with Secure, HttpOnly, SameSite, and a host prefix
Set-Cookie: __Host-session=abc123; Secure; HttpOnly; SameSite=Strict; Path=/
```

HSTS:

```
# Vulnerable: max-age far too short to matter, and subdomains left unprotected
Strict-Transport-Security: max-age=60

# Better: a full year, covering all subdomains, eligible for preload
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Cache-Control on a sensitive page:

```
# Vulnerable: no cache headers at all on an authenticated account page
(no Cache-Control header present)

# Better: explicitly prevents storage of sensitive content
Cache-Control: no-store, no-cache, must-revalidate, private
```

X-Frame-Options:

```
# Vulnerable: missing entirely, page can be framed by any site (clickjacking risk)
(no X-Frame-Options or frame-ancestors present)

# Better: explicitly denies framing
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

## Quick Reference Table

Once you've gone through everything above, this table is what you'll actually come back to for a quick refresher.

| Header                                   | Main Purpose                                              |
| ---------------------------------------- | --------------------------------------------------------- |
| Content-Security-Policy                  | Controls what resources can load, blocks XSS              |
| X-Frame-Options                          | Prevents clickjacking via iframes                         |
| Strict-Transport-Security                | Forces HTTPS only                                         |
| X-Content-Type-Options                   | Stops MIME type guessing                                  |
| Referrer-Policy                          | Limits data leaked in the Referer header                  |
| Permissions-Policy                       | Restricts browser feature access (camera, mic, etc)       |
| Set-Cookie flags                         | Secures cookies (Secure, HttpOnly, SameSite)              |
| Cross-Origin-Opener-Policy               | Isolates browsing context from other origins              |
| Cross-Origin-Embedder-Policy             | Requires explicit opt-in for cross-origin resources       |
| Access-Control-Allow-Origin (CORS)       | Controls which origins can read cross-origin responses    |
| Cross-Origin-Resource-Policy             | Controls which origins can load this resource at all      |
| Origin-Agent-Cluster                     | Requests dedicated process isolation per origin           |
| Cache-Control                            | Prevents sensitive pages from being cached                |
| Clear-Site-Data                          | Wipes cookies, cache, and storage, useful on logout       |
| Cookie prefixes (`__Host-`, `__Secure-`) | Forces browser-level enforcement of cookie security flags |

## How to Test a Site's Headers (For Practice)

Now it's your turn to actually go do this. As a security learner, this is a genuinely good exercise, and it's exactly how you'll start most real assessments:

1. Pick a few real websites, either ones you have explicit permission to test, or targets that are in scope for a public bug bounty program
2. Run `curl -I https://target.com` to view the headers
3. Compare what comes back against the table above: which headers are missing, and which ones look misconfigured?
4. Check securityheaders.com for a second opinion, a grade, and an explanation of each finding
5. Note down, in your own words, what a weak CSP or a missing HSTS header could actually allow an attacker to do on that specific target

This kind of header review is often one of the very first checks done in a real penetration test or during the recon phase of a bug bounty engagement, precisely because misconfigured headers are extremely common, and they're easy to spot once you know what to look for.

## Summary

Let's bring this all together. HTTP security headers are instructions from the server to the browser about how to handle a page safely. They are not a replacement for secure coding elsewhere in the application, but they are a strong extra layer of defense sitting right at the browser boundary. A well-configured site usually has:

- A tight Content-Security-Policy, using nonces or hashes instead of `unsafe-inline`
- X-Frame-Options or `frame-ancestors` set
- HSTS enabled with a full year `max-age`, `includeSubDomains`, and preload eligibility
- `nosniff` set
- A sensible Referrer-Policy
- A locked-down CORS configuration with no reflected origins combined with credentials
- Secure, HttpOnly, and SameSite flags on cookies, ideally using the `__Host-` prefix
- Cache-Control set to prevent sensitive pages from being stored
- Clear-Site-Data sent on logout

Checking for these headers is a fast, reliable way to spot obvious weaknesses in a target during recon, and setting them correctly on your own applications is one of the easiest wins available in web security. The practical testing commands and misconfiguration examples above are a good starting checklist to run against any target during the recon phase of a pentest or bug bounty engagement, so keep coming back to them as you practice.
