---
title: 'Bug Bounty Reconnaissance & Application Analysis'
description: 'A comprehensive bug bounty field guide covering reconnaissance, attack surface mapping, and web application analysis, inspired by Jason Haddix Bug Hunters Methodology (Day One: Recon and Day Two: Application Analysis), with additional techniques and practical workflows.'
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
- **bountycatch.py:** Subdomain database backed by Redis. Stores subdomains per project, deduplicates, and lets you print or add to the list at any point.
- **BBRF:** Team projects with a CouchDB backend and GUI. Good when multiple testers share a scope.
- **Plain text or a spreadsheet:** Fine for solo work. Keep columns for host, source, status, interesting flag, and notes.

```bash
# Add subdomains from a file into a named project database
python3 bountycatch.py --project target --file subdomains.txt
# --project  : name of the engagement/project bucket
# --file     : path to a newline-separated list of subdomains

# Print all stored subdomains for a project
python3 bountycatch.py --project target -o print
# -o print   : output mode — prints stored entries to stdout

# Append new subdomains to an existing project
python3 bountycatch.py --project target -o add -f new_subs.txt
# -o add     : output mode — adds entries rather than overwriting
# -f         : file of new subdomains to merge in
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

**Shodan** — indexes internet-facing services, including non-standard ports, banners, TLS certificates, and technology signatures. Passive source; does not generate traffic to the target.

- **Web search:** `https://www.shodan.io/search?query=ssl.cert.subject.CN:"target.com"`
- **Common filters:**
  - `org:"Target Corp"` — all hosts registered to that organization
  - `hostname:target.com` — hosts with that domain in their DNS record
  - `ssl:"target.com"` — hosts with that string in any TLS field
  - `http.title:"Login"` — hosts whose HTTP title contains "Login"
- **Karma v2** — automates bulk Shodan collection for red team and bounty workflows; stores results per project.
- **WTFIS** — enriches a hostname or IP with Shodan, VirusTotal, and Whois data in one terminal output.
- **Shosubgo** — extracts subdomains specifically from Shodan results; useful for narrow, certificate-driven subdomain collection.

```bash
# Search Shodan and return only specific fields, no interactive UI
shodan search --fields ip_str,port,hostname "ssl:target.com"
# --fields   : comma-separated list of fields to output (ip_str=IP, port=port, hostname=DNS name)
# "ssl:..."  : Shodan filter — match any host with target.com in its TLS certificate
```

**Alternative — download all results to a file:**

```bash
shodan download --limit 1000 results "ssl:target.com"
shodan parse --fields ip_str,port,hostname results.json.gz
# download   : saves results as a compressed JSON file for offline processing
# --limit    : max number of results to fetch (use 0 for all, costs query credits)
# parse      : reads the downloaded file and extracts chosen fields
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

- **naabu** — fast SYN or connect-scan from ProjectDiscovery; designed for pipelines; outputs open host:port pairs.
- **nmap** — the standard; does service fingerprinting, version detection, OS detection, and script-based probing.
- **masscan** — extremely fast raw packet scanner; very noisy. Use only on authorized ranges with agreed rates.

```bash
# Scan a list of IPs for the top 1000 most common ports
naabu -list ips.txt -top-ports 1000 -o open_ports.txt
# -list        : file of target IPs or hostnames, one per line
# -top-ports   : scan this many of the most statistically common ports
# -o           : write results to this output file (host:port format)

# Version-detect services on whatever ports naabu found
nmap -sV -p $(paste -sd, open_ports.txt | cut -d: -f2) target_ip
# -sV          : probe open ports to determine service name and version
# -p           : comma-separated port list (extracted from naabu output above)
# paste -sd,   : joins lines with commas to make a port list nmap accepts
# cut -d: -f2  : strips the host part, keeps only the port number
```

**Alternative — full port scan with service detection and output to all formats:**

```bash
nmap -sV -sC -p- --open -T4 -oA nmap_full target_ip
# -sC          : run default NSE scripts (safe, informational)
# -p-          : scan all 65535 ports (slow; use only when authorized)
# --open       : only show ports that are open (filters filtered/closed noise)
# -T4          : timing template 4 (aggressive but not maximum)
# -oA          : save output in all three formats: .nmap, .xml, and .gnmap
```

**Alternative — quick scan of specific high-value ports:**

```bash
nmap -sV --script=banner -p 8080,8443,8000,9200,6379,27017,2375 target_ip
# --script=banner  : grab raw service banners from open ports
# -p               : explicit port list; adjust to match your priority list
```

Ports to prioritize: 8080, 8443, 8000, 8888, 3000, 5000, 9000, 9090, 9200 (Elasticsearch), 5601 (Kibana), 27017 (MongoDB), 6379 (Redis), 2375 (Docker API), 10250 (Kubelet), 15672 (RabbitMQ), 8500 (Consul), 7001 (WebLogic), 4848 (GlassFish).

---

## Phase 3: Subdomain Discovery

### 3.1 Wide vs. Narrow Approach

- **Wide:** Enumerate everything under the organization. Forgotten assets often have weaker security. Lower payout per finding, higher volume.
- **Narrow:** Deep understanding of a single application. Higher payout, more time per target.

Use wide recon to find the assets that deserve narrow attention.

### 3.2 Certificate Transparency (ADDED: primary method)

Certificate Transparency is a public audit log of every TLS certificate ever issued. Every subdomain that has ever had HTTPS is logged. One of the most reliable passive subdomain sources.

- **crt.sh:** `https://crt.sh/?q=%25.target.com&output=json`
- **Certspotter:** https://sslmate.com/certspotter/
- **kaeferjaeger.gay:** Weekly SNI and certificate data across cloud IP ranges. Confirm availability before relying on it.

```bash
# Fetch all certificate entries for target.com subdomains and extract unique names
curl -s "https://crt.sh/?q=%25.target.com&output=json" \
  | jq -r '.[].name_value' \
  | sed 's/\*\.//g' \
  | sort -u
# curl -s          : fetch URL silently (no progress bar)
# ?q=%25.target.com: %25 is URL-encoded %, so this searches *.target.com
# &output=json     : return JSON instead of HTML
# jq -r '.[].name_value' : extract the name_value field from every array element
# sed 's/\*\.//g'  : strip wildcard prefixes (*.) to get clean hostnames
# sort -u          : sort and remove duplicates
```

**Alternative — save crt.sh results directly to file:**

```bash
curl -s "https://crt.sh/?q=%25.target.com&output=json" \
  | jq -r '.[].name_value' \
  | sed 's/\*\.//g' \
  | grep -v "^$" \
  | sort -u > crtsh_subs.txt
# grep -v "^$"  : remove blank lines before deduplication
```

For kaeferjaeger downloads, grep the target domain directly:

```bash
grep -hoE "[a-zA-Z0-9._-]+\.target\.com" *.txt | sort -u
# -h   : suppress filename prefix in output (just the match)
# -o   : print only the matching part of each line, not the whole line
# -E   : use extended regex
# pattern: matches any valid subdomain ending in .target.com
# *.txt: apply to all downloaded text files in the current directory
```

(CORRECTED: the original pipeline was fragile. This version extracts matching hostnames directly.)

### 3.3 Passive Scraping

Passive sources include search engines, DNS aggregators, threat intelligence feeds, archive crawlers, and CT logs.

**Amass** — comprehensive subdomain enumeration tool from OWASP; queries dozens of passive sources (APIs, CT logs, search engines, DNS datasets); the most thorough single tool for passive collection.

```bash
# Passive-only enumeration (no DNS brute force, no active probing)
amass enum -passive -d target.com -o amass_passive.txt
# enum      : enumeration subcommand
# -passive  : use only passive data sources, do not touch the target directly
# -d        : target domain
# -o        : output file

# List all configured data sources
amass enum -list
# -list     : shows every source Amass supports (configured or not)

# Show only sources missing API keys (these will produce no results)
amass enum -list | grep -v "\*"
# grep -v "\*" : lines without an asterisk are unconfigured sources
```

**Alternative — active enumeration with brute force disabled but DNS resolution on:**

```bash
amass enum -d target.com -src -ip -o amass_active.txt
# -src  : print the data source that found each subdomain
# -ip   : resolve each subdomain and print its IP addresses
# (no -passive flag means Amass also does DNS resolution and scraping)
```

**Subfinder** — fast, lightweight passive subdomain enumerator from ProjectDiscovery; simpler than Amass, excellent for quick passes.

```bash
subfinder -d target.com -all -o subfinder.txt
# -d    : target domain
# -all  : use all configured sources (slower but more complete)
# -o    : output file
```

**Alternative — run against multiple domains at once:**

```bash
subfinder -dL domains.txt -all -o subfinder_multi.txt
# -dL   : file containing multiple target domains, one per line
```

**BBOT** — modular recon framework that goes beyond subdomains; runs subdomain enumeration alongside email harvesting, port scanning, and vulnerability detection in a single pipeline.

```bash
bbot -t target.com -f subdomain-enum
# -t   : target (domain, IP, URL, or CIDR)
# -f   : flag to select a preset module group; subdomain-enum loads all subdomain modules
```

**Alternative — output to a structured report and JSON:**

```bash
bbot -t target.com -f subdomain-enum -o bbot_out -om json,txt
# -o   : output directory
# -om  : output modules (json for machine-readable, txt for plain list)
```

- **Combine and deduplicate:**

```bash
cat amass_passive.txt subfinder.txt | sort -u > passive_all.txt
# cat    : concatenate both files
# sort -u: sort all lines and remove duplicates in one pass
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
- **getrelationship.py (m4ll0k/Bug-Bounty-Toolz):** CLI relationship lookup using your BuiltWith session cookie; finds other domains sharing the same analytics or tag manager IDs.
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
# Search Whoxy API for all domains registered by an organization keyword
curl "https://api.whoxy.com/?key=YOUR_KEY&reverse=whois&keyword=Target+Organization&mode=domains"
# key=YOUR_KEY          : your Whoxy API key
# reverse=whois         : use the reverse WHOIS endpoint
# keyword=...           : search for this string in registrant name/org fields
# mode=domains          : return a flat list of matching domain names
```

**Alternative — search by registrant email instead of keyword:**

```bash
curl "https://api.whoxy.com/?key=YOUR_KEY&reverse=whois&email=admin@target.com&mode=domains"
# email=...  : look up all domains registered with this exact email address
```

Recursively run WHOIS on each new domain to continue the chain.

### 3.8 Linked Discovery

**GoSpider** — web crawler that follows links across pages, extracts URLs from HTML, JavaScript, and comments, and respects scope boundaries.

**Hakrawler** — lightweight crawler focused on extracting links from HTML source and JavaScript files; faster than full crawlers for large lists.

```bash
# Crawl one host and collect all subdomains found in links
echo https://target.com | hakrawler -subs | tee linked_hosts.txt
# echo ...    : pass the seed URL via stdin (hakrawler reads from stdin)
# -subs       : include subdomains of the target in the output
# tee         : write to file and also print to terminal simultaneously

# Crawl with GoSpider to depth 3, saving all output
gospider -s https://target.com -d 3 -o gospider_out
# -s   : seed URL to start crawling from
# -d   : maximum crawl depth (3 means follow links 3 levels deep)
# -o   : output directory; creates one file per domain found
```

**Alternative — GoSpider with multiple threads and JavaScript parsing:**

```bash
gospider -s https://target.com -d 3 -c 10 --js -o gospider_out
# -c    : number of concurrent goroutines (threads); default is 5
# --js  : extract URLs from JavaScript files found during crawl
```

**Burp Suite Pro spider:** Set scope with a keyword match on the organization name to catch related domains. Browse the main site to seed the crawl. Export hosts from the target site map.

### 3.9 Brute Forcing and Permutations

Passive sources miss hosts that were never linked or indexed. Brute forcing tries wordlist-based subdomain names directly against DNS.

**Puredns** — fast DNS brute forcer and resolver built on top of massdns; includes wildcard detection to filter junk results.

```bash
# Brute force subdomains using a wordlist against a target domain
puredns bruteforce wordlist.txt target.com -r resolvers.txt -w brute.txt
# bruteforce   : subcommand to test every word in the wordlist as a subdomain
# wordlist.txt : the wordlist of subdomain names to try
# -r           : file of public DNS resolver IPs (refresh before each engagement)
# -w           : write confirmed results to this file

# Resolve a pre-existing list of candidate subdomains (no wordlist)
puredns resolve candidates.txt -r resolvers.txt -w resolved.txt
# resolve      : subcommand to take an existing list and resolve each entry
# candidates.txt : the list to test (one hostname per line)
```

**Alternative — brute force with a rate limit to stay under radar:**

```bash
puredns bruteforce wordlist.txt target.com -r resolvers.txt -w brute.txt --rate-limit 3000
# --rate-limit : max DNS queries per second; lower this on restrictive targets
```

- **Resolvers:** https://github.com/trickest/resolvers. Refresh before each engagement. Stale resolvers produce false results.
- **Wordlists:** Jason Haddix's `all.txt`, Assetnote `best-dns-wordlist.txt`, and SecLists DNS sets: https://github.com/danielmiessler/SecLists

**dnsgen** — generates permutation variants of known subdomains (dev1, dev-api, api-dev, etc.) to catch hosts that simple wordlists miss.

```bash
# Generate permutations from known subdomains and pipe directly into puredns
cat passive_all.txt | dnsgen - | puredns resolve -r resolvers.txt -w permutations.txt
# cat passive_all.txt : read the known subdomains list
# dnsgen -            : generate permutations; `-` means read from stdin
# puredns resolve     : resolve each permutation (only valid ones survive)
```

### 3.10 GitHub Subdomain Extraction

**github-subdomains** — searches GitHub code, commits, and issues for references to your target domain, extracting subdomains that developers accidentally exposed in public repositories.

```bash
github-subdomains -d target.com -t YOUR_TOKEN -o github_subs.txt
# -d   : target domain to search for
# -t   : GitHub personal access token (required for API access)
# -o   : output file for discovered subdomains
```

**Alternative — use multiple tokens to avoid rate limiting:**

```bash
github-subdomains -d target.com -t TOKEN1,TOKEN2,TOKEN3 -o github_subs.txt
# -t with commas : supply multiple tokens; the tool rotates between them
```

Run with multiple tokens. Results vary between runs.

---

## Phase 4: Live Host Validation and Service Mapping

This phase was missing from the original notes. Passive lists contain dead hosts, duplicates, and out-of-scope entries. Resolve and probe before screenshotting or scanning.

### 4.1 Resolution and Wildcard Filtering

Puredns handles wildcard detection during resolution. Confirm wildcards manually on suspicious apexes:

```bash
dig +short randomstring12345.target.com
# dig           : DNS lookup tool
# +short        : print only the answer, not the full DNS response
# randomstring..: a made-up label; if it resolves, the zone has a wildcard DNS record
```

If a random label resolves, the zone uses a wildcard. Filter results accordingly.

### 4.2 HTTP Probing with httpx

**httpx** — sends HTTP/HTTPS requests to a list of hosts and returns metadata: status code, page title, detected tech stack, web server, redirect chain, and TLS info. Filters live hosts from a large passive list efficiently.

```bash
cat resolved.txt | httpx -silent -status-code -title -tech-detect -web-server -follow-redirects -o live_hosts.txt
# -silent          : suppress banner and progress output
# -status-code     : include HTTP status code in output
# -title           : extract and print the HTML <title> tag
# -tech-detect     : fingerprint technologies (frameworks, CMS, CDN, etc.)
# -web-server      : print the Server response header value
# -follow-redirects: follow HTTP redirects and report the final URL
# -o               : save results to this file
```

**Alternative — JSON output for feeding other tools:**

```bash
cat resolved.txt | httpx -silent -status-code -title -tech-detect -json -o live_hosts.json
# -json : structured output; each host becomes a JSON object with all fields
```

**Alternative — filter to only show specific status codes:**

```bash
cat resolved.txt | httpx -silent -mc 200,301,302,401,403 -o filtered_hosts.txt
# -mc  : match code; only include hosts that return one of these status codes
```

Add `-json` for structured output that feeds other tools.

### 4.3 Scope Check

Compare live hosts against the scope definition. Remove or tag out-of-scope results before testing. Note any host that resolves to a third-party provider and confirm its scope status.

### 4.4 Subdomain Takeover Checks

Dangling CNAME records pointing to deprovisioned services (S3, Heroku, GitHub Pages, Azure, Fastly, Shopify) allow an attacker to claim the resource.

- **Nuclei takeover templates** — checks hosts against a library of fingerprints for services known to be takeover-able.
- **subzy** — dedicated subdomain takeover checker; tests each subdomain's CNAME against a fingerprint database of vulnerable services.
- **dnsReaper** — checks dangling DNS records across many cloud providers; good for thorough coverage.

```bash
nuclei -l live_hosts.txt -t takeovers/
# -l          : input file with list of hosts to test
# -t takeovers/ : use only templates from the takeovers/ directory

subzy run --targets live_hosts.txt
# run          : execute takeover checks
# --targets    : file containing hostnames to check
```

Verify manually. Automated takeover checks produce false positives, and claiming a resource you do not own may be out of scope or illegal. Report the condition instead unless the program explicitly permits proof of takeover.

### 4.5 Screenshots for Prioritization

**EyeWitness** — captures screenshots of web services, RDP, and VNC; organizes output as an HTML report you can scroll through quickly to spot interesting panels.

**gowitness** — lightweight Go-based screenshot tool; faster than EyeWitness for large lists; stores results in a SQLite database.

**Aquatone** — similar workflow to EyeWitness with good support for Burp output formats.

```bash
eyewitness --web -f live_hosts.txt -d eyewitness_out
# --web   : capture HTTP/HTTPS targets (as opposed to RDP or VNC)
# -f      : input file with list of URLs
# -d      : output directory for screenshots and HTML report

gowitness file -f live_hosts.txt --timeout 10 -P screenshots/
# file        : subcommand to read targets from a file
# -f          : input file
# --timeout   : seconds to wait for each page to load before skipping
# -P          : directory to save screenshot images
```

**Alternative — gowitness with a built-in web server to browse results:**

```bash
gowitness report serve --db-location gowitness.sqlite3
# report serve  : launch a local web UI to browse screenshots and metadata
# --db-location : path to the gowitness results database
```

Look for: login panels, default server pages (Apache, nginx, IIS, Tomcat), staging and dev environments, exposed admin tools (Jenkins, Grafana, Kibana, phpMyAdmin, Kubernetes dashboards, Portainer), error pages revealing versions, and outdated UI frameworks.

### 4.6 Favicon Fingerprinting

**FavFreak** — downloads favicons from a host list, computes their MurmurHash3 hash, and looks up known hashes to identify applications even when banners are hidden or pages return 200 with custom content.

When screenshots show blank or customized pages, favicon hashes can identify applications. Shodan supports favicon hash searches via `http.favicon.hash:HASH`.

```bash
cat live_hosts.txt | python3 favfreak.py -o favfreak_output
# reads hosts from stdin
# -o   : output file for hash results and identified technologies
```

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

**cloud_enum** — enumerates storage resources (S3, Azure Blob, GCS) by generating name variations from a keyword and checking each one's existence and access level.

**S3Scanner** — checks S3 buckets for existence, listing permissions, and public read/write access.

**GCPBucketBrute** — brute-forces Google Cloud Storage bucket names from a wordlist.

```bash
# Check multiple keyword variations for storage buckets across AWS, Azure, and GCP
cloud_enum -k target -k targetcorp
# -k   : keyword to use for name generation; add multiple -k flags for more variations
```

**Alternative — also check for open files and output results to a file:**

```bash
cloud_enum -k target -k targetcorp --disable-azure --threads 20 -l cloud_results.txt
# --disable-azure : skip Azure checks if not relevant (speeds up run)
# --threads       : number of concurrent threads
# -l              : log results to this file
```

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

**trufflehog** — scans git history, filesystems, and URLs for secrets; unique feature is live verification (it tries the credential against the real API to confirm it works before reporting).

**gitleaks** — regex and entropy-based secret scanner; fast and configurable; does not verify credentials but is quieter and safer to run.

**semgrep** — static analysis engine with rules for secrets, insecure patterns, and framework-specific vulnerabilities; useful on source code you have access to.

```bash
# Scan a GitHub repo for verified secrets only (makes live API calls to check)
trufflehog git https://github.com/targetcorp/repo --only-verified
# git            : scan a git repository (local or remote URL)
# --only-verified: only report secrets that were confirmed active against the real service

# Scan a local repository for any secrets (no verification)
gitleaks detect --source ./repo -v
# detect         : scan for secrets
# --source       : path to the local repository
# -v             : verbose output — shows each finding with full context
```

**Alternative — trufflehog scanning a local filesystem (not just git history):**

```bash
trufflehog filesystem ./downloaded_js --only-verified
# filesystem  : scan a directory rather than a git repo (good for JS dumps)
```

**Alternative — gitleaks with JSON output for piping into other tools:**

```bash
gitleaks detect --source ./repo --report-format json --report-path leaks.json
# --report-format : output format (json, csv, or sarif)
# --report-path   : file to write the report to
```

### 6.3 Exposed Version Control

Check whether `.git` directories are web-accessible:

```
https://target.com/.git/HEAD
https://target.com/.git/config
```

If accessible, reconstruct the repository with git-dumper or GitTools. Recovered history often contains credentials removed in later commits.

**git-dumper** — downloads an exposed `.git` directory from a web server and reconstructs the full repository locally.

```bash
git-dumper https://target.com/.git ./recovered_repo
# first arg  : URL to the exposed .git directory
# second arg : local directory to save the reconstructed repository
```

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

- **theHarvester** — collects emails, subdomains, and names from search engines, LinkedIn, and DNS sources; useful for building a target employee profile.
- **LinkedIn:** Employee titles reveal technology stacks and internal tooling.
- **Hunter.io:** Email pattern discovery (e.g. reveals that the company uses firstname@company.com format).
- **Email security records:** Check SPF, DMARC, and DKIM with `dig TXT target.com` and `dig TXT _dmarc.target.com`. Weak SPF or missing DMARC matters for phishing-related scope, not usually for web bounties.

Use people data only to inform technical recon. Do not contact employees unless the engagement explicitly includes social engineering.

### 6.6 Mobile Applications (EXPANDED)

Mobile binaries frequently contain API hosts, hardcoded keys, and undocumented endpoints.

- **APKleaks** — decompiles an APK and extracts URLs, API endpoints, and secrets using regex patterns; good for a quick first pass.
- **jadx** — full APK decompiler that produces readable Java source code for manual review.
- **MobSF** — static and dynamic analysis platform for Android and iOS; generates a full report with findings.
- **Frida and objection** — dynamic analysis with certificate pinning bypass, where permitted. Frida hooks into running processes; objection wraps Frida with common mobile pentest commands.

```bash
apkleaks -f target.apk -o apk_endpoints.txt
# -f   : path to the APK file
# -o   : output file for extracted endpoints and strings
```

---

## Phase 7: Application Profiling

### 7.1 Why

The web server, language, and framework determine likely vulnerability classes, useful wordlists, and which tools to run.

### 7.2 Browser Tools

- **Wappalyzer:** Frameworks, libraries, CMS, CDN, analytics.
- **WhatRuns:** Similar with some different signatures.
- **BuiltWith:** Also useful for relationship mapping.

### 7.3 Command Line

**webanalyze** — CLI version of Wappalyzer's detection engine; identifies technologies from HTTP headers and page content without a browser.

**WhatWeb** — fingerprints web servers, frameworks, and CMS from response headers, cookies, HTML, and JavaScript.

```bash
webanalyze -host https://target.com -crawl 1
# -host    : target URL
# -crawl   : number of pages to crawl beyond the root (1 = root + one level)

whatweb -a 3 https://target.com
# -a 3     : aggression level 3 (makes additional HTTP requests for more detail)
#            level 1 = passive only, level 3 = moderate, level 4 = aggressive
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

**gau (Get All URLs)** — fetches archived URLs for a domain from Wayback Machine, Common Crawl, URLScan, and AlienVault OTX in one command.

**waymore** — extends gau by also downloading the archived responses themselves, letting you mine the actual content of old pages for endpoints.

```bash
# Fetch all historical URLs for a domain and include subdomains
echo target.com | gau --subs
# (reads domain from stdin)
# --subs  : include URLs from subdomains of the target, not just the apex

# Full historical URL collection including archived responses
waymore -i target.com -mode U -oU waymore_urls.txt
# -i      : target domain
# -mode U : URL-only mode (use -mode R to also download responses)
# -oU     : output file for the collected URLs
```

- **Wayback Machine CDX:**

```bash
curl "https://web.archive.org/cdx/search/cdx?url=*.target.com/*&output=text&fl=original&collapse=urlkey"
# url=*.target.com/*  : search all subdomains and paths
# output=text         : plain text output, one URL per line
# fl=original         : only return the original URL field
# collapse=urlkey     : deduplicate by canonical URL key (removes near-duplicates)
```

- **URLScan.io, AlienVault OTX, Common Crawl:** Additional sources.

Removed endpoints often still respond. Test them.

### 8.3 Directory and File Brute Forcing

**ffuf** — fast web fuzzer written in Go; highly configurable for directory, parameter, and virtual host brute forcing.

**feroxbuster** — recursive content discovery tool; automatically recurses into discovered directories without extra configuration.

**dirsearch** — straightforward Python-based directory scanner; good default wordlist and easy to use.

```bash
# Brute force directories and files with recursion
ffuf -u https://target.com/FUZZ -w wordlist.txt -mc 200,204,301,302,401,403 -recursion -recursion-depth 2
# -u               : target URL; FUZZ is the placeholder for wordlist entries
# -w               : wordlist file
# -mc              : match codes — only show responses with these HTTP status codes
# -recursion       : automatically recurse into discovered directories
# -recursion-depth : how many levels deep to recurse

# feroxbuster with auto-recursion (default behaviour)
feroxbuster -u https://target.com -w wordlist.txt -x php,html,js,txt
# -u   : target URL
# -w   : wordlist
# -x   : file extensions to append to each word (tries word, word.php, word.html, etc.)
```

**Alternative — ffuf with rate limiting and output filtering by size:**

```bash
ffuf -u https://target.com/FUZZ -w wordlist.txt -mc 200,301,302,401,403 \
  -fs 1234 -rate 50 -o ffuf_results.json -of json
# -fs     : filter by response size (exclude responses of exactly this byte count)
#           useful for filtering generic 200 error pages that all look the same
# -rate   : max requests per second (throttle to avoid triggering rate limits)
# -o      : output file
# -of     : output format (json, csv, or ejson)
```

Use technology-specific wordlists from https://wordlists.assetnote.io and SecLists.

### 8.4 Parameter Discovery

Hidden parameters often lead to unprotected functionality.

**Arjun** — discovers hidden HTTP parameters by trying a large wordlist and detecting when the response changes.

**Param Miner (Burp extension)** — passively and actively discovers unlinked parameters and headers that affect caching or behavior; particularly good at finding cache poisoning vectors.

```bash
arjun -u https://target.com/endpoint -m GET
# -u   : target URL
# -m   : HTTP method (GET or POST)
```

**Alternative — POST body parameter discovery:**

```bash
arjun -u https://target.com/api/login -m POST --stable
# --stable : only report parameters where the difference is consistent across multiple requests
```

### 8.5 API Discovery

- **Kiterunner** — brute-forces API routes using real-world API route datasets (not generic wordlists); detects APIs that only respond correctly to specific HTTP methods or content types.
- **Swagger and OpenAPI:** Check `/swagger`, `/api-docs`, `/openapi.json`, `/v3/api-docs`.
- **GraphQL:** Test `/graphql`, `/api/graphql`, and `/v1/graphql`. Introspection queries reveal the schema if enabled.
  - **GraphQL Voyager** — visualizes a GraphQL schema as an interactive graph.
  - **Clairvoyance** — recovers GraphQL schema when introspection is disabled, by using field suggestions.

```bash
kr scan https://target.com -w routes-small.kite
# kr      : kiterunner binary
# scan    : scan subcommand
# -w      : wordlist/routes file (.kite format from the Assetnote dataset)
```

**Alternative — kiterunner against a list of hosts:**

```bash
kr scan -w routes-small.kite -A=apiroutes-210228:20000 https://target.com
# -A      : use a named Assetnote dataset instead of a local file
```

### 8.6 Custom Wordlists

```bash
# Generate a wordlist from words found on the target site itself
cewl https://target.com -d 3 -m 5 -w custom.txt
# -d   : crawl depth (how many links deep to follow)
# -m   : minimum word length (ignore words shorter than this)
# -w   : output wordlist file

# Extract path segments from historical URLs as a wordlist
cat historical_urls.txt | unfurl paths | sort -u > path_wordlist.txt
# unfurl paths  : parse each URL and output only the path component
# sort -u       : deduplicate
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

**subjs** — fetches all JavaScript file URLs from a list of hosts; extracts script src attributes from HTML and collects them for further analysis.

**LinkFinder** — parses JavaScript files and extracts relative and absolute URL endpoints using regex; good for finding undocumented API routes.

**GAP (Burp extension)** — passively extracts endpoints and parameters from all JavaScript that flows through Burp scope; more accurate than regex alone because it parses AST structure.

```bash
# Collect all JavaScript URLs from a list of live hosts
cat live_hosts.txt | subjs | tee js_urls.txt
# (reads hosts from stdin via cat)
# tee  : write to js_urls.txt and also print to terminal

# Extract endpoints from each JavaScript file URL
cat js_urls.txt | xargs -I{} python3 linkfinder.py -i {} -o cli
# xargs -I{}  : run the command once per line, replacing {} with the line content
# -i {}       : input JavaScript URL (the {} placeholder)
# -o cli      : output to terminal (use -o results.html for an HTML report)
```

**Alternative — download JavaScript files first, then scan offline:**

```bash
cat js_urls.txt | xargs -n 1 wget -q -P js_dump/
python3 linkfinder.py -i "js_dump/*.js" -o results.html
# wget -q     : download quietly
# -P js_dump/ : save files into this directory
# -i "*.js"   : scan all downloaded files as a batch
```

### 9.3 Deobfuscation and Unpacking

- **deobfuscate.io** — web-based tool that unpacks and simplifies common JavaScript obfuscation techniques without manual effort.
- **Webpack Exploder (spaceraccoonsec)** — reconstructs original source files from webpack bundles by parsing the module map.
- **Source maps:** Check `file.js.map`. Published source maps expose original source code. If `app.bundle.js` exists, try `app.bundle.js.map`.

### 9.4 Secrets in JavaScript

- **JS Miner (Burp extension)** — passive detection with entropy analysis, not just regex; flags high-entropy strings that look like tokens or keys while you browse.
- **trufflehog filesystem mode:** `trufflehog filesystem ./js_dump --only-verified`

Hardcoded keys can be public by design (for example, some analytics and map keys). Assess what each key can do before reporting it.

### 9.5 Vulnerable Libraries

**RetireJS** — identifies JavaScript libraries with known CVEs by comparing version strings against a database of vulnerable versions.

```bash
retire --path ./js_dump --outputformat json
# --path         : directory of JavaScript files to scan
# --outputformat : output format (json or text)
```

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

**Methodology reference:** Ashar Javed's XSS sanitization research (2014): https://www.blackhat.com/docs/eu-14/materials/eu-14-Javed-Revisiting-XSS-Sanitization.pdf

**Contexts to identify:** HTML body, HTML attribute (quoted and unquoted), JavaScript string, JavaScript template literal, URL attribute, CSS, and DOM sinks (`innerHTML`, `document.write`, `eval`, `location`, `postMessage` handlers).

**High-yield parameters (HUNT project data):** `q`, `s`, `search`, `id`, `lang`, `keyword`, `query`, `page`, `year`, `view`, `email`, `type`, `name`, `url`, `terms`, `key`, `login`, `begindate`, `enddate`

**BXSSHunter** — hosts a payload server and provides payloads that call back when they execute; used for blind XSS where the injection fires in an admin panel you cannot see.

**DOM Invader (Burp)** — built into Burp's browser; automatically traces data from DOM sources (URL, postMessage, localStorage) to dangerous sinks (innerHTML, eval) and generates exploitation suggestions.

**Automation:** Burp Suite active scan is still among the most reliable scanners for XSS. Confirm every finding manually.

### 11.3 Insecure Direct Object Reference and Access Control

**Autorize (Burp extension)** — replays every in-scope request using a lower-privilege session token you configure; automatically flags responses that returned data they should not have. Saves significant manual testing time.

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
- **JWT:** Algorithm confusion (`none`, HS256 with a public key), weak secrets, unverified signatures, and `kid` header injection.
  - **jwt_tool** — tests JWT tokens for common vulnerabilities: algorithm confusion, signature bypass, weak secret cracking, and injection attacks.
  - **JSON Web Tokens (Burp extension)** — decodes JWTs inline in Burp, lets you modify claims and re-sign, and tests algorithm confusion automatically.
- **OAuth and SSO:** Redirect URI validation, state parameter checks, token leakage in redirects, and scope escalation.

### 11.5 Server-Side Request Forgery

**Spray method:** Collect parameters that take URLs and inject a collaborator URL.

**interactsh** — open-source out-of-band interaction server (like Burp Collaborator but self-hosted); receives DNS and HTTP callbacks from SSRF, blind XSS, and XXE payloads.

```bash
# Replace all parameter values with a collaborator URL to find SSRF candidates
cat all_urls.txt | grep "=" | qsreplace "http://YOUR_COLLABORATOR" > ssrf_candidates.txt
# grep "="       : filter to only URLs that have query parameters
# qsreplace      : replaces all parameter values with the given string
# YOUR_COLLABORATOR : your Burp Collaborator or interactsh URL

# Probe the candidate list for live responses
cat ssrf_candidates.txt | httpx -silent -mc 200,301,302,500
# -mc  : only show responses with these status codes (500 can indicate SSRF errors)
```

**Alternative — use ffuf to spray SSRF payloads across a single parameter:**

```bash
ffuf -u "https://target.com/fetch?url=FUZZ" -w ssrf_payloads.txt -mc 200,302,500
# FUZZ : placeholder for each SSRF bypass payload in the wordlist
```

Use Burp Collaborator or interactsh for out-of-band detection.

**High-yield parameters:** `dest`, `redirect`, `uri`, `path`, `continue`, `url`, `window`, `next`, `data`, `reference`, `site`, `html`, `val`, `validate`, `domain`, `callback`, `return`, `page`, `feed`, `host`, `port`, `to`, `out`, `view`, `dir`, `show`, `navigation`, `open`

**Once confirmed:**

- Probe cloud metadata: `http://169.254.169.254/latest/meta-data/` (AWS IMDSv1), Azure and GCP equivalents.
- Test internal ports and localhost-bound services.
- Try alternative IP encodings and DNS rebinding to bypass allowlists. PayloadsAllTheThings: https://github.com/swisskyrepo/PayloadsAllTheThings

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

**SQLmap** — the standard automated SQL injection tool; detects and exploits injection across many database types and injection techniques.

**Ghauri** — modern SQLi tool with stronger detection for time-based and error-based blind injection; handles some WAF evasion that SQLmap struggles with.

**HBSQLI** — specifically targets SQL injection in HTTP headers (User-Agent, Referer, X-Forwarded-For); fills a gap that SQLmap's default mode misses.

```bash
# Automated SQL injection test on a URL parameter
sqlmap -u "https://target.com/page?id=1" --batch --level 3 --risk 2
# -u        : target URL with the injectable parameter
# --batch   : non-interactive mode; use default answers for all prompts
# --level   : number of tests to perform (1-5); 3 includes cookies and User-Agent
# --risk    : risk of tests (1-3); 2 adds time-based tests, 3 adds OR-based tests

# SQLmap with WAF evasion tamper scripts
sqlmap -u "https://target.com/page?id=1" --batch --tamper=space2comment,randomcase
# --tamper  : apply these obfuscation scripts to payloads (comma-separated)
#             space2comment: replaces spaces with SQL comments /**/
#             randomcase: randomizes character casing in keywords
```

**Alternative — test a POST request captured from Burp:**

```bash
sqlmap -r request.txt --batch --level 3 --risk 2 --dbs
# -r        : load a raw HTTP request from a file (saved from Burp using "Copy to file")
# --dbs     : enumerate database names after injection is confirmed
```

**High-yield parameters (HUNT project data):** `id`, `select`, `report`, `role`, `update`, `query`, `user`, `name`, `sort`, `where`, `search`, `params`, `process`, `row`, `view`, `table`, `from`, `order`, `keyword`, `column`, `field`, `filter`

**Less obvious locations:** `ORDER BY` and `GROUP BY` clauses, JSON keys, cookies, `User-Agent` and `Referer` headers in logging code.

### 11.9 Server-Side Template Injection

**Tplmap** — automated SSTI detection and exploitation tool; identifies the template engine and generates appropriate payloads.

Test template-rendering inputs (name fields, email templates, error messages) with arithmetic probes such as `{{7*7}}`, `${7*7}}`, and `<%= 7*7 %>`. A result of `49` indicates evaluation. Identify the engine before exploiting.

```bash
tplmap -u "https://target.com/page?name=test"
# -u   : URL with the parameter to test; tplmap tests all parameters automatically
```

### 11.10 Command Injection

Test parameters that reach system utilities such as ping, DNS lookup, PDF conversion, image resizing, and backup features. Use time-based probes (`sleep 5`) or out-of-band callbacks. Keep payloads harmless and avoid writing files on the target unless authorized.

### 11.11 Server-Side Injection and Deserialization

- **Deserialization:** Look for Java serialized objects (`rO0AB` base64 prefix), PHP `unserialize` input, Python pickle, and .NET ViewState.
  - **ysoserial** — generates Java deserialization payloads for common vulnerable libraries (Commons Collections, Spring, etc.); use time-delay gadgets for detection only.
  - **ysoserial.net** — equivalent for .NET ViewState and other .NET deserialization vectors.
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
- Race conditions on balance changes, coupon redemption, and invitation acceptance.

**Turbo Intruder (Burp extension)** — sends large numbers of requests with fine-grained timing control; supports single-packet and last-byte synchronization techniques to trigger race conditions reliably.

### 11.17 HTTP-Level Attacks

- **Host header injection:** Password reset poisoning, cache poisoning, and routing bypass.
- **Request smuggling:** Test CL.TE and TE.CL differences with careful timing.
  - **HTTP Request Smuggler (Burp extension)** — automates detection of CL.TE and TE.CL smuggling variants; sends a probe and checks for timing or response anomalies. Use only on authorized hosts.
- **Web cache poisoning and deception:** Param Miner identifies unkeyed inputs. Test caching of authenticated responses.

### 11.18 Clickjacking

Confirm the page can be framed (`X-Frame-Options` and `frame-ancestors`), then assess whether a sensitive state-changing action can be triggered through a framed page. Report only when impact is real.

### 11.19 Injection Elicitation

**Backslash Powered Scanner (Burp extension)** — sends characters that trigger parser errors in various injection contexts; helps find injection points that standard scanners miss by observing differential responses.

**Logger++ (Burp extension)** — advanced request/response logging with filtering and highlighting; useful for tracking which parameters produced anomalous responses during fuzzing.

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

**Nuclei** — template-based vulnerability scanner from ProjectDiscovery; runs a large community-maintained library of checks for CVEs, misconfigurations, and exposed panels.

```bash
# Scan live hosts for medium, high, and critical severity findings
nuclei -l live_hosts.txt -severity medium,high,critical
# -l          : input file with one host per line
# -severity   : only run templates that match these severity levels

# Run specific template categories
nuclei -l live_hosts.txt -t cves/ -t exposures/ -t misconfiguration/
# -t          : path to a template file or directory; use multiple -t flags for multiple categories

# Update templates to the latest version before running
nuclei -update-templates
```

**Alternative — run against a single host with rate limiting:**

```bash
nuclei -u https://target.com -severity high,critical -rate-limit 20 -timeout 10
# -u          : single target URL
# -rate-limit : maximum requests per second
# -timeout    : seconds before a request times out
```

Nuclei is most valuable on fresh or low-visibility hosts. Check templates before running them on production. Some detection templates send intrusive requests.

**Custom templates:** When you reproduce a pattern from published research, a Nuclei YAML template lets you scan the full target list for it.

**Template sources to audit:** AllForOne and CENT add community templates. Many duplicate core templates. Review before adding.

**Security research queries for finding new template ideas:**

```
"IDOR" OR "broken access control" site:hackerone.com
"SSRF" "bypass" site:portswigger.net
"mass assignment" writeup
```

### 12.2 Recon Frameworks

- **ReconFTW** — automated recon pipeline covering passive collection, brute force, permutations, screenshots, port scanning, content discovery, and GitHub scraping; includes a web GUI. Good for rapid wide-scope coverage.
- **reNgine** — web-based recon platform with project management, scheduling, and multi-user support; similar capabilities to ReconFTW with a UI-first approach.

Frameworks give good coverage, not exceptional coverage. Use them to build the first pass, then do manual work where the attack surface is interesting.

### 12.3 Scanning Limits

- WPScan free tier allows a limited number of API requests per day. Check the current limit on wpscan.com before planning.
- Commercial scanners like Burp Pro and Acunetix require licenses. Confirm you have the right edition for the features you rely on.

### 12.4 COTS and Framework Scanning

**WPScan** — WordPress-specific vulnerability scanner; checks for vulnerable plugins, themes, and user enumeration.

**droopescan** — CMS scanner for Drupal, SilverStripe, and WordPress; identifies version and installed modules.

**JoomScan** — OWASP Joomla scanner; enumerates components and checks for known vulnerabilities.

```bash
# WordPress scan with plugin and theme enumeration
wpscan --url https://target.com --enumerate vp,vt,u --api-token YOUR_TOKEN
# --enumerate vp  : enumerate vulnerable plugins
# --enumerate vt  : enumerate vulnerable themes
# --enumerate u   : enumerate usernames
# --api-token     : WPScan API token (required for vulnerability data)
```

**Alternative — aggressive WordPress plugin enumeration without the API:**

```bash
wpscan --url https://target.com --enumerate ap --plugins-detection aggressive
# --enumerate ap         : enumerate all plugins (not just known-vulnerable ones)
# --plugins-detection    : aggressive mode tries more plugin paths (slower, more findings)
```

For COTS applications, install a local copy (open source) or request a vendor demo, route it through Burp, and map all routes with Daniel Miessler's Source2URL. Vendor and open-source source code can reveal routes that production traffic never triggers.

**Source2URL** — extracts all routes from a web framework's source code and converts them to testable URLs; useful when you have access to source or a vendor-provided image.

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

| Tool                      | Category                       | Purpose (short)                                                              | Source                                                           |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Xmind                     | Note-taking                    | Mind maps for scope hierarchy and test status tracking                       | https://www.xmind.net                                            |
| bountycatch.py            | Target tracking                | Redis-backed subdomain database per engagement                               | https://gist.github.com/jhaddix/91035a01168902e8130a8e1bb383ae1e |
| BBRF                      | Team tracking                  | CouchDB-backed team scope and finding management                             | GitHub: bbrf                                                     |
| Hurricane Electric BGP    | ASN lookup                     | Maps organization names to ASNs and IP prefixes                              | http://bgp.he.net                                                |
| ARIN                      | IP registration                | North American IP range and ASN registration lookup                          | https://whois.arin.net                                           |
| RIPE                      | IP registration                | European and Central Asian IP registration lookup                            | https://apps.db.ripe.net                                         |
| APNIC                     | IP registration                | Asia-Pacific IP registration lookup                                          | https://wq.apnic.net                                             |
| Shodan                    | Infrastructure search          | Indexes internet-facing banners, ports, and certificates passively           | https://www.shodan.io                                            |
| Censys                    | Certificate and host search    | Certificate and host search engine; strong on TLS data                       | https://search.censys.io                                         |
| Karma v2                  | Automated Shodan               | Automates bulk Shodan collection per project                                 | GitHub: karma_v2                                                 |
| WTFIS                     | Shodan enrichment              | Enriches a host or IP with Shodan, VT, and Whois in one output               | GitHub: wtfis                                                    |
| Shosubgo                  | Shodan subdomains              | Extracts subdomains from Shodan certificate data                             | GitHub: Shosubgo                                                 |
| naabu                     | Port scanning                  | Fast SYN/connect port scanner built for pipelines                            | GitHub: projectdiscovery/naabu                                   |
| nmap                      | Service detection              | Port scan, service fingerprinting, version detection, NSE scripts            | https://nmap.org                                                 |
| masscan                   | Port scanning                  | Extremely fast raw-packet scanner; noisy, authorized ranges only             | GitHub: robertdavidgraham/masscan                                |
| Crunchbase                | Acquisitions                   | Acquisition history and investor data                                        | https://www.crunchbase.com                                       |
| OCCRP Aleph               | Corporate intelligence         | Investigative database of subsidiaries and corporate relationships           | https://aleph.occrp.org                                          |
| SEC EDGAR                 | Subsidiary filings             | Public company filings including Exhibit 21 subsidiary lists                 | https://www.sec.gov/edgar                                        |
| crt.sh                    | Certificate transparency       | CT log search; reveals every subdomain that ever had HTTPS                   | https://crt.sh                                                   |
| Certspotter               | Certificate transparency       | Real-time CT log monitoring and search                                       | https://sslmate.com/certspotter                                  |
| kaeferjaeger.gay          | Cloud certificate data         | Weekly SNI and certificate dumps across cloud IP ranges                      | http://kaeferjaeger.gay                                          |
| Whoxy                     | Reverse WHOIS                  | Find domains registered by same org or email                                 | https://www.whoxy.com                                            |
| Amass                     | Subdomain enumeration          | Comprehensive passive and active subdomain enum; many API sources            | GitHub: owasp-amass/amass                                        |
| Subfinder                 | Subdomain enumeration          | Fast passive subdomain enum from ProjectDiscovery                            | GitHub: projectdiscovery/subfinder                               |
| BBOT                      | Subdomain enumeration          | Modular recon framework; subdomains plus email, ports, and vulns             | GitHub: blacklanternsecurity/bbot                                |
| Chaos                     | Subdomain API                  | ProjectDiscovery's dataset of bug bounty program subdomains                  | https://chaos.projectdiscovery.io                                |
| BuiltWith                 | Tech and relationships         | Technology detection and cross-domain relationship mapping                   | https://builtwith.com                                            |
| getrelationship.py        | Analytics relationships        | CLI lookup for domains sharing analytics IDs                                 | GitHub: m4ll0k/Bug-Bounty-Toolz                                  |
| Burp Suite Pro            | Proxy, spider, scanner         | Intercept proxy, active scanner, and extensible testing platform             | https://portswigger.net                                          |
| GoSpider                  | Spidering                      | Web crawler with JavaScript parsing and concurrent threads                   | GitHub: jaeles-project/gospider                                  |
| Hakrawler                 | Spidering                      | Lightweight link extractor from HTML and JavaScript                          | GitHub: hakluke/hakrawler                                        |
| subjs                     | JavaScript collection          | Collects JavaScript file URLs from a list of hosts                           | GitHub: lc/subjs                                                 |
| LinkFinder                | JavaScript endpoint extraction | Extracts URLs and endpoints from JavaScript files via regex                  | GitHub: GerbenJavado/LinkFinder                                  |
| github-subdomains         | GitHub subdomain extraction    | Searches GitHub for target domain references to find subdomains              | GitHub: gwen001/github-subdomains                                |
| Puredns                   | DNS resolution and brute force | Fast DNS resolver and brute forcer with wildcard detection                   | GitHub: d3mondev/puredns                                         |
| trickest/resolvers        | Fresh DNS resolvers            | Maintained list of working public DNS resolvers                              | https://github.com/trickest/resolvers                            |
| dnsgen                    | Permutation generation         | Generates subdomain permutations from known names                            | GitHub: ProjectAnte/dnsgen                                       |
| httpx                     | HTTP probing                   | Probes host lists for status, title, tech, and redirects                     | GitHub: projectdiscovery/httpx                                   |
| subzy                     | Takeover checks                | Tests subdomains for dangling CNAMEs to vulnerable services                  | GitHub: LukaSikic/subzy                                          |
| dnsReaper                 | Takeover checks                | Checks DNS records for takeover conditions across many providers             | GitHub: punk-security/dnsReaper                                  |
| EyeWitness                | Screenshots                    | Screenshots web, RDP, and VNC services; HTML report output                   | GitHub: RedSiege/EyeWitness                                      |
| gowitness                 | Screenshots                    | Fast Go screenshot tool with SQLite storage and web UI                       | GitHub: sensepost/gowitness                                      |
| Aquatone                  | Screenshots                    | Screenshots and host reporting; good Burp integration                        | GitHub: michenriksen/aquatone                                    |
| FavFreak                  | Favicon fingerprinting         | Hashes favicons to identify applications via Shodan lookup                   | GitHub: devanshbatham/FavFreak                                   |
| cloud_enum                | Cloud storage enumeration      | Enumerates S3, Azure Blob, and GCS buckets from keywords                     | GitHub: initstring/cloud_enum                                    |
| S3Scanner                 | S3 bucket checks               | Checks S3 bucket existence and read/write/list permissions                   | GitHub: sa7mon/S3Scanner                                         |
| GCPBucketBrute            | GCS bucket checks              | Brute-forces Google Cloud Storage bucket names                               | GitHub: RhinoSecurityLabs/GCPBucketBrute                         |
| trufflehog                | Secrets detection              | Detects secrets in git history and filesystems; verifies against APIs        | GitHub: trufflesecurity/trufflehog                               |
| gitleaks                  | Secrets detection              | Regex and entropy-based secret scanner for git repos                         | GitHub: gitleaks/gitleaks                                        |
| git-dumper                | Exposed .git recovery          | Downloads and reconstructs exposed .git directories                          | GitHub: arthaud/git-dumper                                       |
| theHarvester              | OSINT                          | Collects emails, subdomains, and names from search engines                   | GitHub: laramies/theHarvester                                    |
| APKleaks                  | APK endpoint extraction        | Decompiles APKs and extracts endpoints and secrets via regex                 | GitHub: dwisiswant0/apkleaks                                     |
| jadx                      | APK decompilation              | Full APK decompiler producing readable Java source code                      | GitHub: skylot/jadx                                              |
| MobSF                     | Mobile static analysis         | Static and dynamic analysis for Android and iOS apps                         | GitHub: MobSF/Mobile-Security-Framework-MobSF                    |
| Frida                     | Dynamic instrumentation        | Injects JavaScript into running processes for dynamic analysis               | https://frida.re                                                 |
| objection                 | Mobile dynamic analysis        | Frida wrapper with common mobile pentest commands including pin bypass       | GitHub: sensepost/objection                                      |
| ReconFTW                  | Recon framework                | Automated wide-scope recon pipeline covering most passive and active methods | GitHub: six2dez/reconftw                                         |
| reNgine                   | Recon framework                | Web-based recon platform with scheduling and project management              | GitHub: yogeshojha/rengine                                       |
| Wappalyzer                | Tech profiling                 | Browser extension and CLI for technology fingerprinting                      | https://www.wappalyzer.com                                       |
| WhatRuns                  | Tech profiling                 | Browser extension for technology detection; complements Wappalyzer           | https://www.whatruns.com                                         |
| Webanalyze                | Tech profiling CLI             | CLI Wappalyzer engine; good for scripted tech detection                      | GitHub: rverton/webanalyze                                       |
| WhatWeb                   | Tech profiling CLI             | Fingerprints web servers, CMS, and frameworks from HTTP responses            | GitHub: urbanadventurer/WhatWeb                                  |
| Nuclei                    | Vulnerability templates        | Template-based scanner for CVEs, misconfigs, and exposed panels              | GitHub: projectdiscovery/nuclei                                  |
| RetireJS                  | Vulnerable JS libraries        | Identifies JavaScript libraries with known CVEs by version                   | https://retirejs.github.io                                       |
| WayMore                   | Historical URLs                | Fetches and optionally downloads archived pages for link mining              | GitHub: xnl-h4ck3r/waymore                                       |
| gau                       | Historical URLs                | Fetches historical URLs from Wayback, Common Crawl, URLScan, OTX             | GitHub: lc/gau                                                   |
| ffuf                      | Content discovery              | Fast, highly configurable web fuzzer for directories and parameters          | GitHub: ffuf/ffuf                                                |
| feroxbuster               | Content discovery              | Recursive content discovery with automatic directory recursion               | GitHub: epi052/feroxbuster                                       |
| dirsearch                 | Content discovery              | Straightforward directory and file brute forcer                              | GitHub: maurosoria/dirsearch                                     |
| Arjun                     | Parameter discovery            | Discovers hidden GET and POST parameters by response diffing                 | GitHub: s0md3v/Arjun                                             |
| Kiterunner                | API route discovery            | Brute-forces API routes using real-world route datasets                      | GitHub: assetnote/kiterunner                                     |
| Clairvoyance              | GraphQL without introspection  | Recovers GraphQL schema using field suggestions when introspection is off    | GitHub: nikitastupin/clairvoyance                                |
| GraphQL Voyager           | GraphQL visualization          | Renders a GraphQL schema as an interactive relationship graph                | GitHub: graphql-kit/graphql-voyager                              |
| CEWL                      | Custom wordlists               | Generates wordlists by crawling a target site for its own vocabulary         | https://digi.ninja/projects/cewl.php                             |
| unfurl                    | URL path parsing               | Parses and extracts components (path, params, domain) from URLs              | GitHub: tomnomnom/unfurl                                         |
| qsreplace                 | Parameter replacement          | Replaces all query string values in URLs with a given payload                | GitHub: tomnomnom/qsreplace                                      |
| Source2URL                | COTS route mapping             | Extracts routes from framework source code and converts to testable URLs     | GitHub: danielmiessler/Source2URL                                |
| deobfuscate.io            | JavaScript deobfuscation       | Web-based tool for unpacking and simplifying obfuscated JavaScript           | https://deobfuscate.io                                           |
| Webpack Exploder          | Webpack unpacking              | Reconstructs source files from webpack module bundles                        | GitHub: spaceraccoonsec                                          |
| JS Miner                  | JS secret detection            | Burp extension; passive entropy analysis for secrets in JavaScript           | Burp BApp Store                                                  |
| GAP                       | JS endpoint extraction         | Burp extension; extracts endpoints and params from in-scope JavaScript       | Burp BApp Store                                                  |
| Autorize                  | Authorization testing          | Burp extension; replays requests with a low-priv token to find IDOR          | Burp BApp Store                                                  |
| Param Miner               | Hidden parameters and cache    | Burp extension; discovers unkeyed params and cache poisoning vectors         | Burp BApp Store                                                  |
| Turbo Intruder            | Race conditions                | Burp extension; high-speed requests with single-packet sync support          | Burp BApp Store                                                  |
| Logger++                  | Request logging                | Burp extension; advanced logging with filtering and highlighting             | Burp BApp Store                                                  |
| Backslash Powered Scanner | Injection elicitation          | Burp extension; finds injection points via parser-error differential         | Burp BApp Store                                                  |
| JSON Web Tokens           | JWT testing                    | Burp extension; decodes, modifies, and tests JWT algorithm confusion         | Burp BApp Store                                                  |
| HTTP Request Smuggler     | Smuggling detection            | Burp extension; detects CL.TE and TE.CL request smuggling                    | Burp BApp Store                                                  |
| Collaborator Everywhere   | Out-of-band injection          | Burp extension; injects collaborator payloads into all request fields        | Burp BApp Store                                                  |
| jwt_tool                  | JWT attacks                    | CLI tool for JWT algorithm confusion, secret cracking, and injection         | GitHub: ticarpi/jwt_tool                                         |
| SQLmap                    | SQL injection                  | Automated SQL injection detection and exploitation across DB types           | https://sqlmap.org                                               |
| Ghauri                    | SQL injection                  | Modern SQLi tool; strong on blind/time-based and some WAF evasion            | GitHub: r0oth3x49/ghauri                                         |
| HBSQLI                    | Header SQL injection           | Targets SQLi in HTTP headers that standard tools miss                        | GitHub: ProbiusOfficial/HBSQLI                                   |
| Tplmap                    | SSTI                           | Automated SSTI detection and exploitation across template engines            | GitHub: epinna/tplmap                                            |
| ysoserial                 | Deserialization payloads       | Generates Java deserialization gadget payloads for detection/exploit         | GitHub: frohoff/ysoserial                                        |
| ysoserial.net             | Deserialization payloads       | .NET equivalent of ysoserial for ViewState and other vectors                 | GitHub: pwntester/ysoserial.net                                  |
| BXSSHunter                | Blind XSS                      | Hosts callback server and payloads for blind XSS in admin panels             | GitHub: ismailtasdelen/BXSSHunter                                |
| DOM Invader               | DOM XSS tracing                | Burp browser tool; traces sources to sinks and suggests DOM XSS exploits     | Burp built-in browser                                            |
| interactsh                | Out-of-band interaction        | Self-hosted collaborator for DNS and HTTP callbacks from SSRF/blind XSS      | GitHub: projectdiscovery/interactsh                              |
| WPScan                    | WordPress scanning             | Enumerates WordPress plugins, themes, users, and known vulnerabilities       | https://wpscan.com                                               |
| droopescan                | Drupal scanning                | CMS scanner for Drupal and SilverStripe version and module detection         | GitHub: SamJoan/droopescan                                       |
| JoomScan                  | Joomla scanning                | OWASP Joomla scanner for components and known vulnerabilities                | GitHub: OWASP/joomscan                                           |
| semgrep                   | Static analysis                | Rule-based static analysis for secrets and insecure code patterns            | https://semgrep.dev                                              |
| PayloadsAllTheThings      | Payload reference              | Comprehensive payload and bypass reference for all vuln classes              | GitHub: swisskyrepo/PayloadsAllTheThings                         |
| PayloadBox XXE            | XXE payloads                   | Curated collection of XXE injection payloads                                 | GitHub: payloadbox                                               |

---

_Compiled from Jason Haddix's Bug Hunter's Methodology Live (Day One: Recon, Day Two: Application Analysis) and extended with additional methodology. Verify tool availability and current rates before engagements. Test only systems you have explicit written authorization to assess._
