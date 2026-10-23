---
title: 'Bug Bounty Reconnaissance & Application Analysis'
description: 'A comprehensive bug bounty field guide covering reconnaissance, attack surface mapping, and web application analysis, inspired by Jason Haddix’s Bug Hunters Methodology (Day One: Recon and Day Two: Application Analysis), with additional techniques and practical workflows.'
category: 'Bug Bounty'
tags:
  [
    'bug-bounty',
    'reconnaissance',
    'attack-surface-management',
    'web-application-security',
    'application-analysis',
    'methodology',
    'jason-haddix',
  ]
date: '2026-11-24'
---

# Bug Hunter's Recon and Application Analysis Notes

**Purpose:** Working reference for web penetration testing and bug bounty engagements.
**Scope of this file:** Infrastructure recon, application mapping, vulnerability testing, and documentation.
**Status convention:** Items marked (ADDED) were not in the original notes. Items marked (CORRECTED) replace a claim that was inaccurate or unverifiable.

---

## Table of Contents

- [Phase 0: Ground Rules and Setup](#phase-0-ground-rules-and-setup)
- [Phase 1: Organization and Corporate Intelligence](#phase-1-organization-and-corporate-intelligence)
- [Phase 2: Network and IP Discovery](#phase-2-network-and-ip-discovery)
- [Phase 3: Subdomain Discovery](#phase-3-subdomain-discovery)
- [Phase 4: Live Host Validation and Service Mapping](#phase-4-live-host-validation-and-service-mapping)
- [Phase 5: Cloud and Storage Recon](#phase-5-cloud-and-storage-recon)
- [Phase 6: Code, Secrets, and People](#phase-6-code-secrets-and-people)
- [Phase 7: Application Profiling](#phase-7-application-profiling)
- [Phase 8: Content and Endpoint Discovery](#phase-8-content-and-endpoint-discovery)
- [Phase 9: JavaScript and API Analysis](#phase-9-javascript-and-api-analysis)
- [Phase 10: Threat Modeling and Heat Mapping](#phase-10-threat-modeling-and-heat-mapping)
- [Phase 11: Vulnerability Testing by Class](#phase-11-vulnerability-testing-by-class)
- [Phase 12: Automation and Frameworks](#phase-12-automation-and-frameworks)
- [Phase 13: Documentation and Reporting](#phase-13-documentation-and-reporting)
- [Appendix A: Master Checklist](#appendix-a-master-checklist)
- [Appendix B: Tool Reference Index](#appendix-b-tool-reference-index)

---

## Phase 0: Ground Rules and Setup

### 0.1 Ground Rules and Scope Validation

Before any tool runs, the most important task is confirming what you are allowed to touch.

**Bug bounty:** Read the program policy line by line. Note in-scope assets (wildcards such as `*.target.com`, specific apps, mobile apps, APIs), out-of-scope assets, prohibited techniques (automated scanning limits, DoS, social engineering, testing third-party services), and the disclosure rules.

**Penetration test:** Confirm the signed Statement of Work and Rules of Engagement, the authorized IP ranges and domains, testing windows, emergency contacts, and whether third-party hosted services (AWS, Cloudflare, SaaS vendors) require separate authorization.

**Scope validation habits:**

- Resolve every discovered asset and check it against the scope before active testing. Subdomains that CNAME to a third-party SaaS may be out of scope even when the parent domain is in scope.
- Keep a record of when and how each asset was confirmed in scope.
- Rate limit active tools. Assume the target has fragile infrastructure.
- Never retain real user data you encounter. Note its existence, stop, and report it.

**The `.env` principle:** Leaked environment files, configuration files, and version control directories are among the highest-value findings in recon. They expose API keys, database credentials, and cloud secrets in one place. Check for them on every host.

**Recon is a cycle, not a checklist.** A GitHub finding leads to a new subdomain. A subdomain leads to a new IP range. A Shodan result leads to a storage bucket. Move between phases as data surfaces.

### 0.2 Tracking

You will accumulate hundreds of hosts, IP ranges, and endpoints. Without structure you will lose findings and repeat work.

- **Mind map (Xmind or similar):** Scope hierarchy and test status. Use colors: green for tested with no findings, orange for in progress or deferred, red for confirmed findings, struck through for complete.
- **bountycatch.py:** Subdomain database backed by Redis.
- **BBRF:** Team projects with a CouchDB backend and GUI.
- **Plain text or a spreadsheet:** Fine for solo work. Keep columns for host, source, status, interesting flag, and notes.

Example bountycatch usage:

```bash
python3 bountycatch.py --project target --file subdomains.txt
python3 bountycatch.py --project target -o print
python3 bountycatch.py --project target -o add -f new_subs.txt
```

Source: https://gist.github.com/jhaddix/91035a01168902e8130a8e1bb383ae1e

**Track these separately:** apex domains, subdomains, IP ranges, Shodan-interesting hosts, cloud assets, credentials found (stored securely and never in the report body), and the exact commands used so results are reproducible.

### 0.3 Reporting Template (ADDED: structure expanded)

A report is judged on clarity and reproducibility. Use this order:

1. **Title:** Short, specific, technically accurate. Name the class and the location.
2. **Summary:** One paragraph covering what is affected and why it matters.
3. **Affected asset:** Full URL, endpoint, parameter, and version where relevant.
4. **Prerequisites:** Account type, role, preconditions.
5. **Reproduction steps:** Numbered, minimal, and complete enough for a triager to follow without guessing.
6. **Proof of concept:** Request and response excerpts, payload, and screenshots. Redact personal data.
7. **Impact:** Realistic attacker outcomes. Avoid inflated language.
8. **Severity:** CVSS 3.1 or 4.0 vector and score with a one-line justification.
9. **Remediation:** Concrete fixes, not generic advice.
10. **References:** OWASP pages, CWE IDs, CVEs.

**Example skeleton (XSS):**

```
Title: Reflected XSS in /payments via month parameter

Summary: The payments page reflects the month query parameter into the HTML
response without output encoding, allowing script execution in the context of
an authenticated user.

Affected: https://target.example/payments?month=
Prerequisites: Free account (login required)

Reproduction:
1. Log in with a free account.
2. Open the PoC URL below in the same browser.

PoC: https://target.example/payments?month=<script>alert(document.domain)</script>

Impact: An attacker can run script in a victim's session, read account data,
and perform actions as the victim.

Severity: CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:L/A:N (score as computed)

Remediation:
- Apply context-aware output encoding (HTML, attribute, JavaScript, URL).
- Enforce a Content Security Policy that restricts inline script.
- Set HttpOnly and Secure on session cookies.

References: OWASP XSS Prevention Cheat Sheet, CWE-79
```

---

## Phase 1: Organization and Corporate Intelligence

### 1.1 Why

Companies grow by acquisition. Acquired infrastructure is often migrated slowly, left running unpatched, or forgotten. Every acquisition can add apex domains and subdomains to your target surface. Wide scope programs often list these explicitly. Narrow programs may not, so confirm scope before testing.

### 1.2 Sources

- **Crunchbase:** https://www.crunchbase.com. Check the Acquisitions section and record dates.
- **Wikipedia:** Acquisition history, especially for large companies.
- **OCCRP Aleph:** https://aleph.occrp.org. Useful for subsidiaries and investments. Look at the US SEC CorpWatch datasets and the Assets and Shares section.
- **SEC EDGAR:** https://www.sec.gov/edgar. For public companies, the 10-K "Subsidiaries" exhibit (Exhibit 21) lists legal entities and often reveals brand names.
- **Company news and press releases:** Search for "acquires" with the company name.

### 1.3 AI Assistance

LLMs can surface acquisition history from training data, but they miss recent deals and can hallucinate. Treat output as leads to verify, never as facts. Cross-check every name against the sources above.

### 1.4 Workflow

1. Build a list of parent and subsidiary entities.
2. Record acquisition dates and status (integrated, running separately, decommissioned if known).
3. Convert each entity name into candidate apex domains.
4. Verify each candidate against program scope before proceeding.

---

## Phase 2: Network and IP Discovery

### 2.1 ASN Enumeration

Autonomous System Numbers identify large networks. Mapping them reveals IP ranges owned by the target, which surface infrastructure that passive DNS never indexes.

- **Hurricane Electric BGP:** http://bgp.he.net. Search the organization name, record ASNs, and note their prefixes.
- **ARIN (North America):** https://whois.arin.net/ui/query.do
- **RIPE (Europe and Central Asia):** https://apps.db.ripe.net/db-web-ui/#/fulltextsearch
- **APNIC (Asia Pacific):** https://wq.apnic.net

Limitation: Cloud assets often sit in provider ranges, not the organization's ASN. Treat ASN results as one layer.

### 2.2 Reverse IP and Shodan (CORRECTED: wording tightened)

Shodan indexes internet-facing services, including non-standard ports, banners, certificates, and technology signatures. It is a passive source for your recon.

- **Web search:** `https://www.shodan.io/search?query=ssl.cert.subject.CN:"target.com"` (quotes are part of Shodan query syntax here)
- **Common filters:** `org:"Target Corp"`, `hostname:target.com`, `ssl:"target.com"`, `http.title:"Login"`
- **Karma v2:** Automates Shodan collection for red team and bounty workflows.
- **WTFIS:** Enriches Shodan output with additional context.
- **Shosubgo:** Extracts subdomains from Shodan results. Useful for narrow subdomain collection.
- **Shodan CLI:** Better for scripted work. Pipe output to httpx for probing.

```bash
shodan search --fields ip_str,port,hostname "ssl:target.com"
```

**Reference material:**

- Data reference: https://datapedia.shodan.io/
- Filters: https://www.shodan.io/search/filters
- Query fundamentals: https://help.shodan.io/the-basics/search-query-fundamentals
- Awesome Shodan queries: https://github.com/jakejarvis/awesome-shodan-queries

### 2.3 Censys

Censys is a Shodan-style search engine with strong certificate search. Query certificates that mention your target to find hosts that Shodan may have missed.

- https://search.censys.io

### 2.4 Port and Service Discovery (ADDED)

The original notes did not cover port scanning. Use it after you have live IPs and hosts, and keep the scan rate within the program's rules.

- **naabu (ProjectDiscovery):** Fast SYN or connect scan for common ports.
- **nmap:** Service and version detection for confirmed hosts. Use `-sV` for version detection and `-p-` only where authorized and necessary.
- **masscan:** Very fast, but noisy. Only on authorized ranges with agreed rates.

```bash
naabu -list ips.txt -top-ports 1000 -o open_ports.txt
nmap -sV -p $(paste -sd, open_ports.txt | cut -d: -f2) target_ip
```

Ports to prioritize: 8080, 8443, 8000, 8888, 3000, 5000, 9000, 9090, 9200 (Elasticsearch), 5601 (Kibana), 27017 (MongoDB), 6379 (Redis), 2375 (Docker API), 10250 (Kubelet), 15672 (RabbitMQ), 8500 (Consul), 7001 (WebLogic), 4848 (GlassFish).

---

## Phase 3: Subdomain Discovery

### 3.1 Wide vs. Narrow Approach

- **Wide:** Enumerate everything under the organization. Forgotten assets often have weaker security. Lower payout per finding, higher volume.
- **Narrow:** Deep understanding of a single application. Higher payout, more time per target.

Use wide recon to find the assets that deserve narrow attention.

### 3.2 Certificate Transparency (ADDED: primary method)

The original notes mention CT only in a cloud context. CT is one of the most reliable passive subdomain sources for every target.

- **crt.sh:** `https://crt.sh/?q=%25.target.com&output=json`
- **Certspotter:** https://sslmate.com/certspotter/
- **kaeferjaeger.gay:** Weekly SNI and certificate data across cloud IP ranges. Confirm availability before relying on it.

Extract names cleanly from crt.sh JSON:

```bash
curl -s "https://crt.sh/?q=%25.target.com&output=json" | jq -r '.[].name_value' | sed 's/\*\.//g' | sort -u
```

For kaeferjaeger downloads, grep the target domain directly:

```bash
grep -hoE "[a-zA-Z0-9._-]+\.target\.com" *.txt | sort -u
```

(CORRECTED: the original pipeline was fragile. This version extracts matching hostnames directly.)

### 3.3 Passive Scraping

Passive sources include search engines, DNS aggregators, threat intelligence feeds, archive crawlers, and CT logs.

- **Amass (passive):**

```bash
amass enum -passive -d target.com -o amass_passive.txt
amass enum -list                  # show configured sources
amass enum -list | grep -v "\*"   # show sources missing API keys
```

- **Subfinder:**

```bash
subfinder -d target.com -all -o subfinder.txt
```

- **BBOT:**

```bash
bbot -t target.com -f subdomain-enum
```

- **Combine and deduplicate:**

```bash
cat amass_passive.txt subfinder.txt | sort -u > passive_all.txt
```

### 3.4 API Key Configuration (CORRECTED: quantified claim removed)

Passive tools depend on API keys. Each configured source adds coverage, sometimes substantially. Configure at minimum:

- **Chaos (ProjectDiscovery):** https://chaos.projectdiscovery.io
- **GitHub personal access tokens:** https://github.com/settings/tokens. Multiple tokens help with rate limits.
- **SecurityTrails:** Paid, strong historical DNS coverage.
- **Shodan, PassiveTotal (RiskIQ), VirusTotal, BinaryEdge, Censys:** Free or limited tiers.
- **FacebookCT:** Requires a Meta developer app. Get the app ID and client token from the app's security settings.

Amass config file location: `~/.config/amass/config.ini`
Subfinder config file location: `~/.config/subfinder/provider-config.yaml`

### 3.5 Search Engine Dorking

Progressive exclusions surface less common subdomains:

```
site:target.com -www
site:target.com -www -mail -dev
site:*.target.com -www -mail -dev -api
```

Also search for `inurl:` and `intitle:` variations of login, admin, and staging terms.

### 3.6 Analytics and Relationship Mapping

Organizations reuse analytics IDs, tag manager containers, and footer text across properties.

- **BuiltWith Relationships:** https://builtwith.com/relationships/target.com
- **getrelationship.py (m4ll0k/Bug-Bounty-Toolz):** CLI relationship lookup using your BuiltWith session cookie.
- **Google dorks for footer text:**

```
"© 2024 Target Company, Inc." -site:target.com
"Copyright Target Company" inurl:target
```

Also search Terms of Service and Privacy Policy text, which is often identical across a company's domains.

### 3.7 Reverse WHOIS

Find apex domains registered to the same organization or email.

- **Whoxy:** https://www.whoxy.com. Reverse WHOIS by keyword or registrant email. Pricing varies. Check current rates.
- **ViewDNS reverse WHOIS:** https://viewdns.info/reversewhois/ (limited free use)

```bash
curl "https://api.whoxy.com/?key=YOUR_KEY&reverse=whois&keyword=Target+Organization&mode=domains"
```

Recursively run WHOIS on each new domain to continue the chain.

### 3.8 Linked Discovery

- **Burp Suite Pro spider:** Set scope with a keyword match on the organization name to catch related domains. Browse the main site to seed the crawl. Export hosts from the target site map.
- **GoSpider:** Good for pipeline automation and JavaScript-aware crawling.
- **Hakrawler:** Extracts links from HTML and JavaScript.

```bash
echo https://target.com | hakrawler -subs | tee linked_hosts.txt
gospider -s https://target.com -d 3 -o gospider_out
```

### 3.9 Brute Forcing and Permutations

Passive sources miss hosts that were never linked or indexed.

- **Puredns (massdns wrapper):**

```bash
puredns bruteforce wordlist.txt target.com -r resolvers.txt -w brute.txt
puredns resolve candidates.txt -r resolvers.txt -w resolved.txt
```

- **Resolvers:** https://github.com/trickest/resolvers. Refresh before each engagement. Stale resolvers produce false results.
- **Wordlists:** Jason Haddix's `all.txt`, Assetnote `best-dns-wordlist.txt`, and SecLists DNS sets: https://github.com/danielmiessler/SecLists
- **dnsgen (permutations):** Generates variants of discovered names such as `dev1`, `dev-1`, `dev.1`. Pipe to puredns.

```bash
cat passive_all.txt | dnsgen - | puredns resolve -r resolvers.txt -w permutations.txt
```

### 3.10 GitHub Subdomain Extraction

- **github-subdomains (gwen001):**

```bash
github-subdomains -d target.com -t YOUR_TOKEN -o github_subs.txt
```

Run with multiple tokens. Results vary between runs.

---

## Phase 4: Live Host Validation and Service Mapping

This phase was missing from the original notes. Passive lists contain dead hosts, duplicates, and out-of-scope entries. Resolve and probe before screenshotting or scanning.

### 4.1 Resolution and Wildcard Filtering

Puredns handles wildcard detection during resolution. Confirm wildcards manually on suspicious apexes:

```bash
dig +short randomstring12345.target.com
```

If a random label resolves, the zone uses a wildcard. Filter results accordingly.

### 4.2 HTTP Probing with httpx

httpx records status codes, titles, technologies, redirects, and TLS details in one pass.

```bash
cat resolved.txt | httpx -silent -status-code -title -tech-detect -web-server -follow-redirects -o live_hosts.txt
```

Add `-json` for structured output that feeds other tools.

### 4.3 Scope Check

Compare live hosts against the scope definition. Remove or tag out-of-scope results before testing. Note any host that resolves to a third-party provider and confirm its scope status.

### 4.4 Subdomain Takeover Checks

Dangling CNAME records pointing to deprovisioned services (S3, Heroku, GitHub Pages, Azure, Fastly, Shopify) allow an attacker to claim the resource.

- **Nuclei takeover templates:** `nuclei -l live_hosts.txt -t takeovers/`
- **subzy:** `subzy run --targets live_hosts.txt`
- **dnsReaper:** Checks dangling records across many providers.

Verify manually. Automated takeover checks produce false positives, and claiming a resource you do not own may be out of scope or illegal. Report the condition instead unless the program explicitly permits proof of takeover.

### 4.5 Screenshots for Prioritization

- **EyeWitness:** `eyewitness --web -f live_hosts.txt -d eyewitness_out`
- **Aquatone:** Similar workflow, good with large sets.
- **gowitness:** Fast Go-based option.

Look for: login panels, default server pages (Apache, nginx, IIS, Tomcat), staging and dev environments, exposed admin tools (Jenkins, Grafana, Kibana, phpMyAdmin, Kubernetes dashboards, Portainer), error pages revealing versions, and outdated UI frameworks.

### 4.6 Favicon Fingerprinting

When screenshots show blank or customized pages, favicon hashes can identify applications. FavFreak automates hashing and lookup. Shodan supports favicon hash searches via `http.favicon.hash:HASH`.

### 4.7 CDN Origin Discovery

If a WAF or CDN sits in front of the application, the origin IP may accept direct connections. Methods:

- Historical DNS records (SecurityTrails, ViewDNS)
- Certificate matches on other IPs (Censys and Shodan certificate search)
- Email headers from the organization's sent mail (Received lines often reveal origin hosts)
- Subdomains like `direct.`, `origin.`, `mail.`, `ftp.` that bypass the CDN

Test origin access only with the program's permission and only with requests that replicate normal traffic.

### 4.8 Edge Case Indicators

| Indicator                                          | Why it matters                                          |
| -------------------------------------------------- | ------------------------------------------------------- |
| Login on non-standard subdomain                    | Weaker authentication or forgotten SSO bypass           |
| dev, stage, qa, uat, test, beta, sandbox, ww1, ww2 | Weaker controls, debug output, default credentials      |
| 302 redirects to internal hostnames                | Leaks internal naming and infrastructure                |
| HTTP Basic Auth prompts                            | Try documented defaults, then stop (do not brute force) |
| Stale copyright years or old privacy policies      | Unmaintained application                                |
| Non-production API docs (Swagger, ReDoc)           | Full endpoint map                                       |

---

## Phase 5: Cloud and Storage Recon

### 5.1 Storage Buckets

Misconfigured buckets remain a common source of data exposure.

- **cloud_enum:** Enumerates AWS S3, Azure Blob, and GCP storage names from a keyword.

```bash
cloud_enum -k target -k targetcorp
```

- **S3Scanner:** Checks bucket existence and permissions.
- **GCPBucketBrute:** Google Cloud Storage enumeration.
- **Grayhat Warfare:** Searches public S3 bucket indexes. Use only for authorized research.

Check permissions carefully. Listing a bucket is a finding. Downloading arbitrary objects beyond what you need to demonstrate impact is not.

### 5.2 Cloud Asset Discovery from Code

Search GitHub and JavaScript files for `amazonaws.com`, `blob.core.windows.net`, `storage.googleapis.com`, `firebaseio.com`, and `azurewebsites.net` references. Each hit is a candidate asset.

### 5.3 Certificate-Based Cloud Discovery

Use the kaeferjaeger method from Section 3.2 and filter by known provider ranges. Cross-check with crt.sh.

---

## Phase 6: Code, Secrets, and People

### 6.1 GitHub Dorking

Developers commit internal hostnames, credentials, and configuration constantly. Personal repositories and forks often contain the most sensitive material.

- **Dork collection:** https://gist.github.com/jhaddix/1fb7ab2409ab579178d2a79959909b33
- **Useful searches:**

```
org:targetcorp password
org:targetcorp "BEGIN RSA PRIVATE KEY"
"target.com" password
"target.com" api_key
"target.com" filename:.env
"target.com" filename:config.yml
"internal.target.com"
```

Look for hostnames that suggest naming patterns (if `bender.company.com` exists, try `fry.company.com`), cloud storage references, and framework versions.

### 6.2 Secrets Scanning

Scan cloned repositories and downloaded JavaScript with dedicated tools:

- **trufflehog:** Verifies many credential types against live APIs. Verification is active, so confirm the program allows it.
- **gitleaks:** Fast regex and entropy scanning.
- **semgrep:** Custom rules for secrets and insecure patterns.

```bash
trufflehog git https://github.com/targetcorp/repo --only-verified
gitleaks detect --source ./repo -v
```

### 6.3 Exposed Version Control

Check whether `.git` directories are web-accessible:

```
https://target.com/.git/HEAD
https://target.com/.git/config
```

If accessible, reconstruct the repository with git-dumper or GitTools. Recovered history often contains credentials removed in later commits.

### 6.4 Common Sensitive Paths

Check a short list on every live host. Stop at the first clear finding for each path.

```
/.env
/.env.bak
/.git/HEAD
/.svn/entries
/.DS_Store
/config.php.bak
/web.config
/wp-config.php.bak
/phpinfo.php
/server-status
/actuator
/actuator/env
/actuator/heapdump
/swagger-ui.html
/v2/api-docs
/openapi.json
/graphql
/robots.txt
/sitemap.xml
/crossdomain.xml
/security.txt
/.well-known/
```

Spring Boot `/actuator/env` and `/actuator/heapdump` can expose secrets. Report responsibly and avoid downloading large heap dumps unnecessarily.

### 6.5 People and Email OSINT

- **theHarvester:** Collects emails, subdomains, and names from search engines.
- **LinkedIn:** Employee titles reveal technology stacks and internal tooling.
- **Hunter.io:** Email pattern discovery.
- **Email security records:** Check SPF, DMARC, and DKIM with `dig TXT target.com` and `dig TXT _dmarc.target.com`. Weak SPF or missing DMARC matters for phishing-related scope, not usually for web bounties.

Use people data only to inform technical recon. Do not contact employees unless the engagement explicitly includes social engineering.

### 6.6 Mobile Applications (EXPANDED)

Mobile binaries frequently contain API hosts, hardcoded keys, and undocumented endpoints.

- **APKleaks:** `apkleaks -f target.apk -o apk_endpoints.txt`
- **jadx:** Decompile APKs for manual review.
- **MobSF:** Static analysis of Android and iOS packages.
- **Frida and objection:** Dynamic analysis with certificate pinning bypass, where permitted.

---

## Phase 7: Application Profiling

### 7.1 Why

The web server, language, and framework determine likely vulnerability classes, useful wordlists, and which tools to run.

### 7.2 Browser Tools

- **Wappalyzer:** Frameworks, libraries, CMS, CDN, analytics.
- **WhatRuns:** Similar with some different signatures.
- **BuiltWith:** Also useful for relationship mapping.

### 7.3 Command Line

```bash
webanalyze -host https://target.com -crawl 1
whatweb -a 3 https://target.com
```

### 7.4 Record

- Web server and version (headers, error pages)
- Backend language (cookies like `PHPSESSID`, `JSESSIONID`, `ASP.NET_SessionId`, headers like `X-Powered-By`)
- Frontend framework (React, Angular, Vue, Next.js build paths like `/_next/`)
- CMS (WordPress `/wp-content/`, Drupal `/sites/default/`, Joomla)
- CDN, WAF, and cloud provider
- Authentication model (session cookies, JWT, OAuth, SAML, SSO)

### 7.5 Security Headers and Cookies

Review on the main application and login pages:

- `Content-Security-Policy`: Missing or permissive policies affect XSS impact.
- `Strict-Transport-Security`, `X-Frame-Options` or `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`
- Cookie flags: `HttpOnly`, `Secure`, `SameSite`, scope, and expiry
- CORS: `Access-Control-Allow-Origin` reflection with credentials enabled

**Tools:** `securityheaders.com`, `nuclei -t http/misconfiguration/`, or Burp's passive checks.

---

## Phase 8: Content and Endpoint Discovery

### 8.1 Start by Browsing

Walk the application manually as a normal user, then as a second user. This seeds Burp's site map, reveals structure, and shows business logic that tools miss.

### 8.2 Historical URLs

- **Wayback Machine:** `https://web.archive.org/cdx/search/cdx?url=*.target.com/*&output=text&fl=original&collapse=urlkey`
- **gau:** `echo target.com | gau --subs`
- **waymore:** Goes further by downloading archived responses for link mining.
- **URLScan.io, AlienVault OTX, Common Crawl:** Additional sources.

Removed endpoints often still respond. Test them.

### 8.3 Directory and File Brute Forcing

- **ffuf:** Fast and flexible.

```bash
ffuf -u https://target.com/FUZZ -w wordlist.txt -mc 200,204,301,302,401,403 -recursion -recursion-depth 2
```

- **feroxbuster:** Automatic recursion.
- **dirsearch:** Straightforward for beginners.

Use technology-specific wordlists from https://wordlists.assetnote.io and SecLists.

### 8.4 Parameter Discovery

Hidden parameters often lead to unprotected functionality.

- **Arjun:** `arjun -u https://target.com/endpoint -m GET`
- **Param Miner (Burp extension):** Guesses headers and parameters that change the response.

### 8.5 API Discovery

- **Kiterunner:** Brute forces API routes using real API route datasets.
- **Swagger and OpenAPI:** Check `/swagger`, `/api-docs`, `/openapi.json`, `/v3/api-docs`.
- **GraphQL:** Test `/graphql`, `/api/graphql`, and `/v1/graphql`. Introspection queries reveal the schema if enabled. Tools: GraphQL Voyager for visualization, Clairvoyance when introspection is disabled.

### 8.6 Custom Wordlists

```bash
cewl https://target.com -d 3 -m 5 -w custom.txt
cat historical_urls.txt | unfurl paths | sort -u > path_wordlist.txt
```

Custom wordlists from the target's own vocabulary often outperform generic lists.

### 8.7 Recursion

When a directory returns content, recurse into it. Many internal paths appear only one level deeper.

### 8.8 Mobile Route Extraction

Covered in Section 6.6. Compare APK routes with web routes. Mismatches often point to hidden or legacy APIs.

---

## Phase 9: JavaScript and API Analysis

### 9.1 Why

Frontend frameworks define routes, parameters, API base URLs, and sometimes secrets inside JavaScript bundles. Browser views hide most of this.

### 9.2 Collection

- **Burp:** GAP extension extracts endpoints and parameters from all JavaScript in scope.
- **LinkFinder:** Extracts endpoints from JavaScript files.
- **subjs:** Collects JavaScript URLs from a host list.

```bash
cat live_hosts.txt | subjs | tee js_urls.txt
cat js_urls.txt | xargs -I{} python3 linkfinder.py -i {} -o cli
```

### 9.3 Deobfuscation and Unpacking

- **deobfuscate.io:** Unpacks and simplifies obfuscated code.
- **Webpack Exploder (spaceraccoonsec):** Reconstructs source maps and modules from webpack bundles.
- **Source maps:** Check `file.js.map`. Published source maps expose original source code.

### 9.4 Secrets in JavaScript

- **JS Miner (Burp extension):** Passive detection with entropy analysis, not just regex.
- **trufflehog filesystem mode:** `trufflehog filesystem ./js_dump --only-verified`

Hardcoded keys can be public by design (for example, some analytics and map keys). Assess what each key can do before reporting it.

### 9.5 Vulnerable Libraries

- **RetireJS:** Identifies outdated libraries with known vulnerabilities.
- **npm audit and yarn audit:** For source code available to you.

A vulnerable library version does not prove exploitability. Confirm the vulnerable code path is reachable.

### 9.6 Endpoints and Parameters

Record each endpoint with method, parameters, expected types, authentication requirements, and response shape. This list becomes your test matrix.

---

## Phase 10: Threat Modeling and Heat Mapping

### 10.1 The Big Questions

Answer these before testing to focus effort:

1. **How does the app pass data?** Query parameters, JSON bodies, path segments, headers, cookies. RESTful path segments often hide authorization bugs.
2. **Where does the app reference users?** IDs, GUIDs, usernames, emails, and tokens in every request. These are IDOR and access control candidates.
3. **Are there roles or tenants?** Each role boundary and tenant boundary is a privilege escalation point.
4. **What are the crown jewels?** Financial data, health records, credentials, internal employee data. Impact determines severity.
5. **What past research exists?** Disclosed reports on HackerOne and Bugcrowd, CVEs, vendor advisories, and blog posts. Past bugs show where developers struggled.
6. **What does the framework protect against, and where has it failed?** Known bypasses matter more than the framework's marketing.
7. **Where and how is data stored?** Uploads, databases (MySQL, PostgreSQL, MongoDB, Elasticsearch), caches (Redis), object storage. Each has distinct injection and access patterns.

### 10.2 Heat Map (EXPANDED)

Vulnerabilities cluster in predictable areas.

- **File uploads:** Image, document, and archive handling. Test extension filtering, content type validation, polyglot files, path traversal in archive names (zip slip), and SVG handling for XSS and XXE.
- **Document parsers:** DOCX, XLSX, and PDF are XML-based or processed by libraries. Check for XXE and SSRF through embedded external references.
- **Account and profile sections:** Stored XSS in display names, bios, and addresses. Blind XSS fires when admins view the data.
- **Integrations:** Webhooks, OAuth callbacks, import and export features, API key generation.
- **URL and path parameters:** Open redirect, SSRF, path traversal. URL parsers differ between libraries, creating bypasses.
- **Error responses:** Metacharacters that trigger errors show parser reach. Track them with Burp Logger++ and fuzz those parameters.
- **Password reset and email flows:** Host header injection, token leakage in referrers, predictable tokens, and reset links for other accounts.
- **Search, filters, and sorting:** SQL injection candidates, especially in `ORDER BY` clauses that parameterization often misses.
- **Support chatbots and AI features:** Blind XSS in agent dashboards and prompt injection against LLM features that take tools or access data. Practice: https://gandalf.lakera.ai/
- **Multi-step workflows:** Payment, checkout, and approval flows where business logic and race conditions live.

---

## Phase 11: Vulnerability Testing by Class

### 11.1 Working Method

- Start with one class per parameter. Do not spray every payload at every input.
- Establish normal behavior first: baseline status, length, timing, and content.
- Use two accounts (attacker and victim) for authorization tests.
- Record each attempt, even negative results, so you do not repeat them.

### 11.2 Cross-Site Scripting

**Methodology reference:** Ashar Javed's XSS sanitization research (2014) remains a strong guide to context-based injection analysis: https://www.blackhat.com/docs/eu-14/materials/eu-14-Javed-Revisiting-XSS-Sanitization.pdf

**Contexts to identify:** HTML body, HTML attribute (quoted and unquoted), JavaScript string, JavaScript template literal, URL attribute, CSS, and DOM sinks (`innerHTML`, `document.write`, `eval`, `location`, `postMessage` handlers).

**High-yield parameters (HUNT project data):** `q`, `s`, `search`, `id`, `lang`, `keyword`, `query`, `page`, `year`, `view`, `email`, `type`, `name`, `url`, `terms`, `key`, `login`, `begindate`, `enddate`

**Blind XSS:** BXSSHunter or XSS Hunter for payloads that fire in admin panels and support tools.

**DOM XSS:** Use DOM Invader in Burp's browser to trace sources to sinks.

**Automation:** Burp Suite active scan is still among the most reliable scanners for XSS. Confirm every finding manually.

### 11.3 Insecure Direct Object Reference and Access Control

**Tool:** Autorize (Burp extension). Configure a lower-privilege session token. It replays requests with that token and flags responses that should have been denied.

**Manual method:**

1. Create two accounts at the same privilege level and one at a higher level if possible.
2. Record every object identifier in each request.
3. Swap identifiers between accounts for read, update, and delete actions.
4. Test HTTP method changes (GET to PUT, DELETE, PATCH).
5. Test horizontal (same role) and vertical (higher role) access separately.

**High-yield parameters:** `id`, `user`, `account`, `number`, `order`, `doc`, `key`, `email`, `group`, `profile`, `edit`, numeric or GUID path segments.

**Less obvious:** Access controls on API endpoints that the frontend never calls, mass assignment (adding `role` or `isAdmin` to JSON bodies), and function-level authorization on admin paths.

### 11.4 Authentication and Session Testing

Missing from the original notes:

- **Registration:** Duplicate account handling, email verification bypass, username enumeration via error messages and timing.
- **Login:** Rate limiting, lockout behavior, account enumeration, and default credentials on admin and technology panels. Stop at documented defaults. Do not run credential brute forcing unless the program explicitly allows it.
- **Password reset:** Token entropy, token reuse, expiration, token leakage in Referer headers, host header poisoning of reset links, and whether the reset flow confirms account existence.
- **MFA:** Response manipulation (changing a failed response to success in the client), code reuse, rate limits on OTP endpoints, and fallback flows that skip MFA.
- **Sessions:** Session fixation, session invalidation after logout and password change, cookie scope and flags.
- **JWT:** Algorithm confusion (`none`, HS256 with a public key), weak secrets, unverified signatures, and `kid` header injection. Tools: jwt_tool, Burp JSON Web Tokens extension.
- **OAuth and SSO:** Redirect URI validation, state parameter checks, token leakage in redirects, and scope escalation.

### 11.5 Server-Side Request Forgery

**Spray method:** Collect parameters that take URLs and inject a collaborator URL.

```bash
cat all_urls.txt | grep "=" | qsreplace "http://YOUR_COLLABORATOR" > ssrf_candidates.txt
cat ssrf_candidates.txt | httpx -silent -mc 200,301,302,500
```

Use Burp Collaborator or interactsh for out-of-band detection.

**High-yield parameters:** `dest`, `redirect`, `uri`, `path`, `continue`, `url`, `window`, `next`, `data`, `reference`, `site`, `html`, `val`, `validate`, `domain`, `callback`, `return`, `page`, `feed`, `host`, `port`, `to`, `out`, `view`, `dir`, `show`, `navigation`, `open`

**Once confirmed:**

- Probe cloud metadata: `http://169.254.169.254/latest/meta-data/` (AWS IMDSv1), Azure and GCP equivalents.
- Test internal ports and localhost-bound services.
- Try alternative IP encodings and DNS rebinding to bypass allowlists. PayloadsAllTheThings has a good reference: https://github.com/swisskyrepo/PayloadsAllTheThings

**SSRF also lives in:** webhook settings, URL previews, PDF generators, image fetchers, XML external entities, and headers like `X-Forwarded-For` in some backends.

### 11.6 XML External Entity Injection

Payload reference: PayloadBox XXE repository.

Test anywhere XML is parsed: SOAP endpoints, SAML assertions, DOCX, XLSX, SVG uploads, and RSS or feed importers. Try content type switching: if a JSON endpoint accepts `application/xml`, test it.

### 11.7 File Upload Testing

Reference: Soroush Dalili's file upload presentation, and the OWASP File Upload Cheat Sheet.

Check:

- Extension filtering (case variations, double extensions, null bytes on old stacks)
- Content type validation versus actual file signature
- Storage location: is the file served from the same origin? Is it executable there?
- File name handling: path traversal in names, overwriting existing files
- Image processing: ImageMagick and similar libraries (SSRF and file read through specially crafted files)
- Archive extraction: zip slip

### 11.8 SQL Injection

**Tools:**

- **SQLmap:** `sqlmap -u "https://target.com/page?id=1" --batch --level 3 --risk 2`. Use tamper scripts for WAF evasion.
- **Ghauri:** Strong on blind and time-based injection.
- **HBSQLI:** Header-based injection, where SQLmap is weaker.

**High-yield parameters (HUNT project data):** `id`, `select`, `report`, `role`, `update`, `query`, `user`, `name`, `sort`, `where`, `search`, `params`, `process`, `row`, `view`, `table`, `from`, `order`, `keyword`, `column`, `field`, `filter`

**Less obvious locations:** `ORDER BY` and `GROUP BY` clauses, JSON keys, cookies, `User-Agent` and `Referer` headers in logging code.

### 11.9 Server-Side Template Injection

Test template-rendering inputs (name fields, email templates, error messages) with arithmetic probes such as `{{7*7}}`, `${7*7}`, and `<%= 7*7 %>`. A result of `49` indicates evaluation. Identify the engine before exploiting. Tplmap helps with fingerprinting.

### 11.10 Command Injection

Test parameters that reach system utilities such as ping, DNS lookup, PDF conversion, image resizing, and backup features. Use time-based probes (`sleep 5`) or out-of-band callbacks. Keep payloads harmless and avoid writing files on the target unless authorized.

### 11.11 Server-Side Injection and Deserialization

- **Deserialization:** Look for Java serialized objects (`rO0AB` base64 prefix), PHP `unserialize` input, Python pickle, and .NET ViewState. Tools: ysoserial, ysoserial.net. Test only for detection (time delays or DNS callbacks).
- **LDAP and NoSQL injection:** Test authentication forms and search filters with operators (`$ne`, `$gt`) for MongoDB.

### 11.12 Path Traversal and Local File Inclusion

Test parameters that refer to files, templates, or languages. Use encodings (`%2e%2e%2f`, double encoding, `..;/` for Java path normalization differences) and check whether the server normalizes before validating.

### 11.13 Open Redirect

Test redirect parameters and login return URLs. Check bypasses: `//evil.com`, `/\evil.com`, `https:evil.com`, and allowlist suffix tricks such as `target.com.evil.com`. Open redirects matter most when chained with OAuth or phishing scope.

### 11.14 Cross-Site Request Forgery

Check state-changing requests for anti-CSRF tokens, `SameSite` cookie behavior, and whether tokens are validated. Test removing the token, reusing it, and swapping it between accounts. Modern browsers reduce CSRF impact, but login CSRF and token-less APIs still appear.

### 11.15 CORS Misconfiguration

Send requests with `Origin: https://evil.com` and check whether `Access-Control-Allow-Origin` reflects it and whether `Access-Control-Allow-Credentials: true` is set. Test `null` origins and subdomain tricks. Impact requires that the endpoint returns sensitive data to a cross-origin script.

### 11.16 Business Logic and Race Conditions

Automated tools miss these. Test:

- Price, quantity, and discount manipulation (negative values, decimal rounding)
- Coupon and referral reuse
- Workflow skipping (jump to a later step by direct request)
- Multi-step approval bypass
- Race conditions on balance changes, coupon redemption, and invitation acceptance. Turbo Intruder (Burp) with single-packet or last-byte sync techniques.

### 11.17 HTTP-Level Attacks

- **Host header injection:** Password reset poisoning, cache poisoning, and routing bypass.
- **Request smuggling:** Test CL.TE and TE.CL differences with careful timing. Use HTTP Request Smuggler (Burp) and only on authorized hosts, since smuggling can affect other users.
- **Web cache poisoning and deception:** Param Miner identifies unkeyed inputs. Test caching of authenticated responses.

### 11.18 Clickjacking

Confirm the page can be framed (`X-Frame-Options` and `frame-ancestors`), then assess whether a sensitive state-changing action can be triggered through a framed page. Report only when impact is real.

### 11.19 Injection Elicitation

**Backslash Powered Scanner (Burp):** Sends characters that trigger parser errors. Errors reveal where input reaches an interpreter.

**Interpreting fuzzer output:** When reviewing ffuf or feroxbuster results, compare:

| Signal        | What it indicates              |
| ------------- | ------------------------------ |
| Status code   | Valid versus invalid responses |
| Size          | Different content              |
| Word count    | Dynamic content changes        |
| Line count    | Rendering or structure changes |
| Response time | Possible time-based injection  |

**Defined insertion points:** Send a request to Intruder, mark the parameter, and choose "Scan defined insertion points" to focus scanning.

---

## Phase 12: Automation and Frameworks

### 12.1 Automated Vulnerability Scanning

**Nuclei:**

```bash
nuclei -l live_hosts.txt -severity medium,high,critical
nuclei -l live_hosts.txt -t cves/ -t exposures/ -t misconfiguration/
nuclei -update-templates
```

Nuclei is most valuable on fresh or low-visibility hosts, where fewer people have tested. Check templates before running them on production. Some detection templates send intrusive requests.

**Custom templates:** When you reproduce a pattern from published research, a Nuclei YAML template lets you scan the full target list for it.

**Template sources to audit:** AllForOne and CENT add community templates. Many duplicate core templates. Review before adding.

**Security research queries for finding new template ideas:**

```
"IDOR" OR "broken access control" site:hackerone.com
"SSRF" "bypass" site:portswigger.net
"mass assignment" writeup
```

### 12.2 Recon Frameworks

- **ReconFTW:** Broad free framework covering passive collection, brute force, permutations, screenshots, port scanning, content discovery, and GitHub scraping. Includes a web GUI.
- **reNgine:** Web interface and project management. Similar capabilities.

Frameworks give good coverage, not exceptional coverage. Use them to build the first pass, then do manual work where the attack surface is interesting.

### 12.3 Scanning Limits

- WPScan free tier allows a limited number of API requests per day. Check the current limit on wpscan.com before planning.
- Commercial scanners like Burp Pro and Acunetix require licenses. Confirm you have the right edition for the features you rely on.

### 12.4 COTS and Framework Scanning

- **WordPress:** `wpscan --url https://target.com --enumerate vp,vt,u --api-token YOUR_TOKEN`
- **Joomla:** JoomScan
- **Drupal:** droopescan
- **Generic CMS:** Nuclei technology templates, then manual review of default paths

For COTS applications, install a local copy (open source) or request a vendor demo, route it through Burp, and map all routes with Daniel Miessler's Source2URL. Vendor and open-source source code can reveal routes that production traffic never triggers.

**DockerHub and public registries:** Search container registries and public code repositories for vendor images. Confirm the image is legitimately published by the vendor before analyzing it.

---

## Phase 13: Documentation and Reporting

### 13.1 During Testing

- Note the exact time, account used, and request for every confirmed issue.
- Save raw requests and responses from Burp. Use Burp's "Copy as curl" for reproduction.
- Keep screenshots with browser URLs visible.
- Mark findings as confirmed, suspected, or needs more testing.

### 13.2 Duplicate Avoidance

Search the program's disclosed reports and the public write-ups for your bug class before submitting. A strong report on an already reported bug still counts as a duplicate.

### 13.3 Severity Honesty

Do not inflate severity. Triagers reduce payouts and trust for inflated reports. Explain the real attacker path, required preconditions, and mitigating controls.

### 13.4 Data Handling

- Minimize data collected during testing. Proof of access is usually enough.
- Redact personal data in screenshots and reports.
- Delete any test data you created when the program asks, and document cleanup.

---

## Appendix A: Master Checklist

### Phase 0: Ground Rules and Setup

- [ ] Scope definition read and recorded
- [ ] Out-of-scope and prohibited techniques noted
- [ ] Testing window and rate limits confirmed (pentest)
- [ ] Tracking system created (mind map, bountycatch, or spreadsheet)
- [ ] Report templates ready

### Phase 1: Organization Intelligence

- [ ] Crunchbase acquisitions recorded
- [ ] Wikipedia acquisition history checked
- [ ] OCCRP Aleph and SEC EDGAR subsidiaries reviewed
- [ ] Candidate apex domains verified against scope

### Phase 2: Network Discovery

- [ ] ASN enumeration on bgp.he.net
- [ ] ARIN, RIPE, and APNIC searches where relevant
- [ ] Shodan search (org, ssl, hostname filters)
- [ ] Censys certificate search
- [ ] Karma v2 and Shosubgo collection
- [ ] Port scan of confirmed IP ranges (naabu, then nmap for version detection)

### Phase 3: Subdomain Discovery

- [ ] crt.sh and Certspotter queries
- [ ] kaeferjaeger cloud certificate data (if available)
- [ ] Amass, Subfinder, and BBOT passive runs
- [ ] API keys configured (Chaos, GitHub, SecurityTrails, Shodan, VirusTotal, others)
- [ ] Google dorking with progressive exclusions
- [ ] BuiltWith and footer text relationship mapping
- [ ] Reverse WHOIS by organization and registrant email
- [ ] Linked discovery (Burp spider, GoSpider, hakrawler)
- [ ] GitHub subdomain extraction (multiple tokens)
- [ ] Puredns brute force with fresh resolvers
- [ ] dnsgen permutations resolved through puredns
- [ ] Deduplicated master subdomain list created

### Phase 4: Live Validation

- [ ] Wildcard DNS checked
- [ ] httpx probing with status, title, tech, and server data
- [ ] Out-of-scope hosts removed
- [ ] Subdomain takeover checks (verified manually)
- [ ] Screenshots reviewed (EyeWitness or gowitness)
- [ ] Favicon hash analysis
- [ ] CDN origin checks on interesting targets (with permission)
- [ ] Sensitive path checks on live hosts (.env, .git, actuator, swagger)

### Phase 5: Cloud and Storage

- [ ] cloud_enum or equivalent on keyword set
- [ ] Bucket permission checks (S3Scanner, GCPBucketBrute)
- [ ] Cloud asset references collected from code and JavaScript

### Phase 6: Code, Secrets, and People

- [ ] GitHub dorks for credentials and internal hosts
- [ ] trufflehog and gitleaks on accessible repositories
- [ ] .git exposure checked
- [ ] Email security records reviewed (SPF, DMARC)
- [ ] Mobile apps decompiled and endpoints extracted (if in scope)

### Phase 7: Application Profiling

- [ ] Technology stack recorded (Wappalyzer, WhatRuns, BuiltWith, whatweb)
- [ ] Security headers and cookie flags reviewed
- [ ] CORS behavior checked
- [ ] Authentication model identified

### Phase 8: Content and Endpoint Discovery

- [ ] Manual walkthrough with two accounts in Burp
- [ ] Historical URLs collected (gau, waymore, Wayback)
- [ ] Technology-specific wordlists run with ffuf or feroxbuster
- [ ] Recursion on discovered directories
- [ ] Parameter discovery (Arjun, Param Miner)
- [ ] API routes discovered (Kiterunner, Swagger, OpenAPI, GraphQL)

### Phase 9: JavaScript and API

- [ ] JavaScript collected (subjs, Burp GAP)
- [ ] Endpoints extracted (LinkFinder)
- [ ] Bundles unpacked and source maps checked
- [ ] Secrets scanned (JS Miner, trufflehog)
- [ ] Vulnerable libraries checked (RetireJS)
- [ ] Endpoint test matrix created

### Phase 10: Threat Modeling

- [ ] Seven Big Questions answered and written down
- [ ] Crown jewels identified
- [ ] Past disclosed reports reviewed
- [ ] Heat map areas prioritized

### Phase 11: Vulnerability Testing

- [ ] Access control and IDOR tested with two accounts (Autorize)
- [ ] Authentication, reset, MFA, session, and JWT testing
- [ ] XSS tested by context (reflected, stored, DOM, blind)
- [ ] SQL injection on high-yield parameters (SQLmap, Ghauri)
- [ ] SSRF tested with out-of-band callbacks
- [ ] XXE on XML-processing endpoints and document uploads
- [ ] File upload restrictions and storage behavior tested
- [ ] SSTI, command injection, and deserialization detection probes
- [ ] Path traversal, open redirect, and CSRF checks
- [ ] CORS and clickjacking reviewed
- [ ] Business logic and race conditions tested
- [ ] HTTP-level issues tested (host header, smuggling, cache)
- [ ] Prompt injection tested on AI features (if present and in scope)

### Phase 12: Automation

- [ ] Nuclei run on fresh targets with reviewed templates
- [ ] Framework pass completed (ReconFTW or reNgine) and results verified manually
- [ ] COTS scanners run where applicable

### Documentation

- [ ] Findings logged with raw requests and responses
- [ ] Duplicates checked against disclosed reports
- [ ] Severity scored with CVSS and justified
- [ ] Reports reviewed for accuracy and redacted personal data
- [ ] Test accounts and data cleaned up

---

## Appendix B: Tool Reference Index

| Tool                      | Category                       | Source                                                           |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| Xmind                     | Note-taking                    | https://www.xmind.net                                            |
| bountycatch.py            | Target tracking                | https://gist.github.com/jhaddix/91035a01168902e8130a8e1bb383ae1e |
| BBRF                      | Team tracking                  | GitHub: bbrf                                                     |
| Hurricane Electric BGP    | ASN lookup                     | http://bgp.he.net                                                |
| ARIN                      | IP registration                | https://whois.arin.net                                           |
| RIPE                      | IP registration                | https://apps.db.ripe.net                                         |
| APNIC                     | IP registration                | https://wq.apnic.net                                             |
| Shodan                    | Infrastructure search          | https://www.shodan.io                                            |
| Censys                    | Certificate and host search    | https://search.censys.io                                         |
| Karma v2                  | Automated Shodan               | GitHub: karma_v2                                                 |
| WTFIS                     | Shodan enrichment              | GitHub: wtfis                                                    |
| Shosubgo                  | Shodan subdomains              | GitHub: Shosubgo                                                 |
| naabu                     | Port scanning                  | GitHub: projectdiscovery/naabu                                   |
| nmap                      | Service detection              | https://nmap.org                                                 |
| Crunchbase                | Acquisitions                   | https://www.crunchbase.com                                       |
| OCCRP Aleph               | Corporate intelligence         | https://aleph.occrp.org                                          |
| SEC EDGAR                 | Subsidiary filings             | https://www.sec.gov/edgar                                        |
| crt.sh                    | Certificate transparency       | https://crt.sh                                                   |
| Certspotter               | Certificate transparency       | https://sslmate.com/certspotter                                  |
| kaeferjaeger.gay          | Cloud certificate data         | http://kaeferjaeger.gay                                          |
| Whoxy                     | Reverse WHOIS                  | https://www.whoxy.com                                            |
| Amass                     | Subdomain enumeration          | GitHub: owasp-amass/amass                                        |
| Subfinder                 | Subdomain enumeration          | GitHub: projectdiscovery/subfinder                               |
| BBOT                      | Subdomain enumeration          | GitHub: blacklanternsecurity/bbot                                |
| Chaos                     | Subdomain API                  | https://chaos.projectdiscovery.io                                |
| BuiltWith                 | Tech and relationships         | https://builtwith.com                                            |
| getrelationship.py        | Analytics relationships        | GitHub: m4ll0k/Bug-Bounty-Toolz                                  |
| Burp Suite Pro            | Proxy, spider, scanner         | https://portswigger.net                                          |
| GoSpider                  | Spidering                      | GitHub: jaeles-project/gospider                                  |
| Hakrawler                 | Spidering                      | GitHub: hakluke/hakrawler                                        |
| subjs                     | JavaScript collection          | GitHub: lc/subjs                                                 |
| LinkFinder                | JavaScript endpoint extraction | GitHub: GerbenJavado/LinkFinder                                  |
| github-subdomains         | GitHub subdomain extraction    | GitHub: gwen001/github-subdomains                                |
| Puredns                   | DNS resolution and brute force | GitHub: d3mondev/puredns                                         |
| trickest/resolvers        | Fresh DNS resolvers            | https://github.com/trickest/resolvers                            |
| dnsgen                    | Permutation generation         | GitHub: ProjectAnte/dnsgen                                       |
| httpx                     | HTTP probing                   | GitHub: projectdiscovery/httpx                                   |
| subzy                     | Takeover checks                | GitHub: LukaSikic/subzy                                          |
| dnsReaper                 | Takeover checks                | GitHub: punk-security/dnsReaper                                  |
| EyeWitness                | Screenshots                    | GitHub: RedSiege/EyeWitness                                      |
| gowitness                 | Screenshots                    | GitHub: sensepost/gowitness                                      |
| FavFreak                  | Favicon fingerprinting         | GitHub: devanshbatham/FavFreak                                   |
| cloud_enum                | Cloud storage enumeration      | GitHub: initstring/cloud_enum                                    |
| S3Scanner                 | S3 bucket checks               | GitHub: sa7mon/S3Scanner                                         |
| GCPBucketBrute            | GCS bucket checks              | GitHub: RhinoSecurityLabs/GCPBucketBrute                         |
| trufflehog                | Secrets detection              | GitHub: trufflesecurity/trufflehog                               |
| gitleaks                  | Secrets detection              | GitHub: gitleaks/gitleaks                                        |
| git-dumper                | Exposed .git recovery          | GitHub: arthaud/git-dumper                                       |
| theHarvester              | OSINT                          | GitHub: laramies/theHarvester                                    |
| APKleaks                  | APK endpoint extraction        | GitHub: dwisiswant0/apkleaks                                     |
| jadx                      | APK decompilation              | GitHub: skylot/jadx                                              |
| MobSF                     | Mobile static analysis         | GitHub: MobSF/Mobile-Security-Framework-MobSF                    |
| ReconFTW                  | Recon framework                | GitHub: six2dez/reconftw                                         |
| reNgine                   | Recon framework                | GitHub: yogeshojha/rengine                                       |
| Wappalyzer                | Tech profiling                 | https://www.wappalyzer.com                                       |
| WhatRuns                  | Tech profiling                 | https://www.whatruns.com                                         |
| Webanalyze                | Tech profiling CLI             | GitHub: rverton/webanalyze                                       |
| WhatWeb                   | Tech profiling CLI             | GitHub: urbanadventurer/WhatWeb                                  |
| Nuclei                    | Vulnerability templates        | GitHub: projectdiscovery/nuclei                                  |
| RetireJS                  | Vulnerable JS libraries        | https://retirejs.github.io                                       |
| WayMore                   | Historical URLs                | GitHub: xnl-h4ck3r/waymore                                       |
| gau                       | Historical URLs                | GitHub: lc/gau                                                   |
| ffuf                      | Content discovery              | GitHub: ffuf/ffuf                                                |
| feroxbuster               | Content discovery              | GitHub: epi052/feroxbuster                                       |
| dirsearch                 | Content discovery              | GitHub: maurosoria/dirsearch                                     |
| Arjun                     | Parameter discovery            | GitHub: s0md3v/Arjun                                             |
| Kiterunner                | API route discovery            | GitHub: assetnote/kiterunner                                     |
| Clairvoyance              | GraphQL without introspection  | GitHub: nikitastupin/clairvoyance                                |
| CEWL                      | Custom wordlists               | https://digi.ninja/projects/cewl.php                             |
| unfurl                    | URL path parsing               | GitHub: tomnomnom/unfurl                                         |
| qsreplace                 | Parameter replacement          | GitHub: tomnomnom/qsreplace                                      |
| Source2URL                | COTS route mapping             | GitHub: danielmiessler/Source2URL                                |
| deobfuscate.io            | JavaScript deobfuscation       | https://deobfuscate.io                                           |
| Webpack Exploder          | Webpack unpacking              | GitHub: spaceraccoonsec                                          |
| JS Miner                  | JS secret detection            | Burp BApp Store                                                  |
| GAP                       | JS endpoint extraction         | Burp BApp Store                                                  |
| Autorize                  | Authorization testing          | Burp BApp Store                                                  |
| Param Miner               | Hidden parameters and cache    | Burp BApp Store                                                  |
| Turbo Intruder            | Race conditions                | Burp BApp Store                                                  |
| Logger++                  | Request logging                | Burp BApp Store                                                  |
| Backslash Powered Scanner | Injection elicitation          | Burp BApp Store                                                  |
| JSON Web Tokens           | JWT testing                    | Burp BApp Store                                                  |
| HTTP Request Smuggler     | Smuggling detection            | Burp BApp Store                                                  |
| Collaborator Everywhere   | Out-of-band injection          | Burp BApp Store                                                  |
| jwt_tool                  | JWT attacks                    | GitHub: ticarpi/jwt_tool                                         |
| SQLmap                    | SQL injection                  | https://sqlmap.org                                               |
| Ghauri                    | SQL injection                  | GitHub: r0oth3x49/ghauri                                         |
| HBSQLI                    | Header SQL injection           | GitHub: ProbiusOfficial/HBSQLI                                   |
| Tplmap                    | SSTI                           | GitHub: epinna/tplmap                                            |
| ysoserial                 | Deserialization payloads       | GitHub: frohoff/ysoserial                                        |
| BXSSHunter                | Blind XSS                      | GitHub: ismailtasdelen/BXSSHunter                                |
| DOM Invader               | DOM XSS tracing                | Burp built-in browser                                            |
| interactsh                | Out-of-band interaction        | GitHub: projectdiscovery/interactsh                              |
| WPScan                    | WordPress scanning             | https://wpscan.com                                               |
| droopescan                | Drupal scanning                | GitHub: SamJoan/droopescan                                       |
| JoomScan                  | Joomla scanning                | GitHub: OWASP/joomscan                                           |
| PayloadsAllTheThings      | Payload reference              | GitHub: swisskyrepo/PayloadsAllTheThings                         |
| PayloadBox XXE            | XXE payloads                   | GitHub: payloadbox                                               |

---

_Compiled from Jason Haddix's Bug Hunter's Methodology Live (Day One: Recon, Day Two: Application Analysis) and extended with additional methodology. Verify tool availability and current rates before engagements. Test only systems you have explicit written authorization to assess._
