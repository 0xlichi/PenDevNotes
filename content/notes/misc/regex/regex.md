---
title: 'Regex'
description: 'Regular expressions (regex) are patterns used to match text. This guide takes you from zero to advanced usage, with practical examples throughout, including a few security/pentesting-flavored ones since that is a common use case (log parsing, extracting parameters from URLs, filtering payloads)'
category: 'Misc'
tags: ['regex', 'misc']
date: '2026-09-14'
---

## Table of Contents

- [What Is Regex, Really](#1-what-is-regex-really)
- [Literal Characters](#2-literal-characters)
- [Metacharacters (The Special Symbols)](#3-metacharacters-the-special-symbols)
- [Character Classes](#4-character-classes)
- [Quantifiers (How Many Times)](#5-quantifiers-how-many-times)
- [Anchors (Position Matching)](#6-anchors-position-matching)
- [Groups and Capturing](#7-groups-and-capturing)
- [Alternation (OR Logic)](#8-alternation-or-logic)
- [Greedy vs Lazy Matching](#9-greedy-vs-lazy-matching)
- [Lookahead and Lookbehind](#10-lookahead-and-lookbehind)
- [Backreferences](#11-backreferences)
- [Flags / Modifiers](#12-flags--modifiers)
- [Common Real-World Patterns](#13-common-real-world-patterns)
- [Regex in Different Languages](#14-regex-in-different-languages)
- [Performance and ReDoS](#15-performance-and-redos)
- [Practice Cheat Sheet](#16-practice-cheat-sheet)

---

## 1. What Is Regex, Really

A regex is just a **search pattern** made of normal characters and special symbols. You give it to a "regex engine" (built into Python, JavaScript, grep, Burp Suite, etc.) along with some text, and it tells you:

- Does the pattern match? (yes/no)
- Where does it match? (position)
- What exactly did it match? (the substring, or parts of it)

Think of it like a much more powerful version of Ctrl+F.

**Example:** the pattern `cat` matches the literal text "cat" wherever it appears, such as in "cat", "concatenate", "scatter".

---

## 2. Literal Characters

The simplest regex is just plain text. It matches itself.

```
Pattern: hello
Matches: "hello world" (match, matches "hello")
Matches: "Hello world" (no match, case-sensitive by default)
```

Most letters, digits, and some symbols are "literal": they mean exactly what they look like. The symbols that **don't** behave literally are called metacharacters, covered next.

---

## 3. Metacharacters (The Special Symbols)

These characters have special meaning in regex. To match them literally, you must escape them with a backslash `\`.

| Symbol | Meaning                        |
| ------ | ------------------------------ |
| `.`    | Any character (except newline) |
| `\`    | Escape character               |
| `^`    | Start of string/line           |
| `$`    | End of string/line             |
| `*`    | 0 or more repetitions          |
| `+`    | 1 or more repetitions          |
| `?`    | 0 or 1 repetition (optional)   |
| `\|`   | OR (alternation)               |
| `()`   | Group                          |
| `[]`   | Character class                |
| `{}`   | Specific repetition count      |

**Example: the dot `.`**

```
Pattern: c.t
Matches: "cat", "cot", "c9t", "c t"
```

**Escaping a literal dot** (e.g., to match an actual period in an IP address):

```
Pattern: 192\.168\.1\.1
Matches: exactly "192.168.1.1"
```

If you don't escape it, `192.168.1.1` would also match `192x168x1x1` because `.` means "any character."

---

## 4. Character Classes

A character class matches **one character** from a defined set. Written with square brackets `[]`.

```
Pattern: [aeiou]
Matches: any single vowel

Pattern: [0-9]
Matches: any single digit (0 through 9)

Pattern: [a-zA-Z]
Matches: any single letter, upper or lower case

Pattern: [a-zA-Z0-9]
Matches: any single alphanumeric character
```

### Negation

Add `^` right after `[` to mean "NOT these characters":

```
Pattern: [^0-9]
Matches: any character that is NOT a digit
```

### Shorthand classes

| Shorthand | Equivalent      | Meaning              |
| --------- | --------------- | -------------------- |
| `\d`      | `[0-9]`         | Digit                |
| `\D`      | `[^0-9]`        | Not a digit          |
| `\w`      | `[a-zA-Z0-9_]`  | "Word" character     |
| `\W`      | `[^a-zA-Z0-9_]` | Not a word character |
| `\s`      | `[ \t\n\r\f\v]` | Whitespace           |
| `\S`      | Not whitespace  | Non-whitespace       |

**Example: matching a username (letters, digits, underscore only)**

```
Pattern: ^\w+$
Matches: "user_123" (match)
Matches: "user 123" (no match, has a space)
```

---

## 5. Quantifiers (How Many Times)

Quantifiers control **how many times** the preceding element can repeat.

| Quantifier | Meaning               |
| ---------- | --------------------- |
| `*`        | 0 or more             |
| `+`        | 1 or more             |
| `?`        | 0 or 1 (optional)     |
| `{n}`      | Exactly n times       |
| `{n,}`     | n or more times       |
| `{n,m}`    | Between n and m times |

**Examples:**

```
Pattern: colou?r
Matches: "color" and "colour" (the u is optional)

Pattern: \d{3}
Matches: exactly 3 digits, e.g. "123"

Pattern: \d{2,4}
Matches: 2 to 4 digits, e.g. "12", "123", "1234"

Pattern: go+gle
Matches: "gogle", "google", "gooogle" (one or more o's)

Pattern: colou*r
Matches: "colr", "color", "colouur" (zero or more u's)
```

**Applying quantifiers to groups:**

```
Pattern: (ab)+
Matches: "ab", "abab", "ababab"
```

---

## 6. Anchors (Position Matching)

Anchors don't match characters: they match **positions** in the text.

| Anchor | Meaning                                            |
| ------ | -------------------------------------------------- |
| `^`    | Start of the string (or line, with multiline flag) |
| `$`    | End of the string (or line, with multiline flag)   |
| `\b`   | Word boundary                                      |
| `\B`   | NOT a word boundary                                |

**Examples:**

```
Pattern: ^Hello
Matches: "Hello world" (match, Hello is at the start)
Matches: "Say Hello" (no match, Hello is not at the start)

Pattern: world$
Matches: "Hello world" (match, world is at the end)
Matches: "world hello" (no match)

Pattern: ^\d{5}$
Matches: a string that is EXACTLY 5 digits, nothing more, nothing less
```

**Word boundary `\b`**: matches between a word character and non-word character, useful to avoid partial matches.

```
Pattern: \bcat\b
Matches: "the cat sat" (match, matches "cat" as a whole word)
Matches: "category" (no match, won't match "cat" inside "category")

Without \b:
Pattern: cat
Matches: "category" (match, matches "cat" as substring, often not what you want)
```

---

## 7. Groups and Capturing

Parentheses `()` create a **group**. Groups do two things:

1. They let you apply a quantifier to multiple characters at once.
2. They "capture" the matched text so you can extract or reuse it.

```
Pattern: (ab)+
Applies + to the whole "ab" unit, not just "b"
```

**Capturing example (Python):**

```python
import re
match = re.search(r"(\d{3})-(\d{4})", "Call 555-1234")
print(match.group(0))  # "555-1234" (whole match)
print(match.group(1))  # "555" (first group)
print(match.group(2))  # "1234" (second group)
```

### Named groups

Instead of remembering group numbers, give them names:

```
Pattern: (?P<area>\d{3})-(?P<number>\d{4})
```

```python
match = re.search(r"(?P<area>\d{3})-(?P<number>\d{4})", "Call 555-1234")
print(match.group("area"))    # "555"
print(match.group("number"))  # "1234"
```

### Non-capturing groups

Sometimes you want grouping for logic only, without capturing the text (better performance, cleaner output). Use `(?:...)`:

```
Pattern: (?:https?|ftp)://\w+
```

This groups `http`, `https`, `ftp` as options but doesn't store it as a numbered capture group.

---

## 8. Alternation (OR Logic)

The pipe `|` means "or." It tries to match one option or another.

```
Pattern: cat|dog
Matches: "cat" OR "dog"

Pattern: I like (cats|dogs)
Matches: "I like cats" or "I like dogs"
```

**Important:** alternation has low precedence, so always group it if it's part of a bigger pattern:

```
Pattern: gray|grey        → matches "gray" anywhere, OR "grey" anywhere (fine here)
Pattern: gr(a|e)y         → matches "gray" or "grey" specifically (safer inside a word)
```

---

## 9. Greedy vs Lazy Matching

By default, quantifiers (`*`, `+`, `{n,m}`) are **greedy**: they match as much text as possible.

```
Text: <b>bold</b> and <i>italic</i>
Pattern: <.+>
Greedy match: "<b>bold</b> and <i>italic</i>"  (the WHOLE thing, too much!)
```

Add a `?` after the quantifier to make it **lazy** (matches as little as possible):

```
Pattern: <.+?>
Lazy match: "<b>"  then separately "</b>", "<i>", "</i>"
```

| Greedy  | Lazy     | Meaning         |
| ------- | -------- | --------------- |
| `*`     | `*?`     | 0 or more, lazy |
| `+`     | `+?`     | 1 or more, lazy |
| `{n,m}` | `{n,m}?` | Range, lazy     |

**Rule of thumb:** when working with delimited content like HTML tags, quotes, or brackets, lazy quantifiers usually give you what you actually want.

---

## 10. Lookahead and Lookbehind

These let you match a pattern **only if** it's followed by (or preceded by) something else, without including that "something else" in the match. This is one of the most powerful and most misunderstood features.

| Syntax     | Name                | Meaning             |
| ---------- | ------------------- | ------------------- |
| `(?=...)`  | Positive lookahead  | Followed by ...     |
| `(?!...)`  | Negative lookahead  | NOT followed by ... |
| `(?<=...)` | Positive lookbehind | Preceded by ...     |
| `(?<!...)` | Negative lookbehind | NOT preceded by ... |

**Positive lookahead example**: match a price number only if followed by "USD".

```
Text: 100 USD, 200 EUR
Pattern: \d+(?= USD)
Matches: "100" (not "200", because it's not followed by USD)
```

**Negative lookahead**: match "foo" only if NOT followed by "bar".

```
Text: foobar, foobaz
Pattern: foo(?!bar)
Matches: "foo" in "foobaz" only
```

**Positive lookbehind**: match a number only if preceded by "$".

```
Text: $100, 100 apples
Pattern: (?<=\$)\d+
Matches: "100" (from "$100" only)
```

**Practical security example**: extracting a value from a query string parameter without capturing the parameter name itself.

```
Text: https://example.com/page?token=abc123&user=admin
Pattern: (?<=token=)[^&]+
Matches: "abc123"
```

**Password strength check using multiple lookaheads** (must contain a digit AND an uppercase letter, minimum 8 chars):

```
Pattern: ^(?=.*\d)(?=.*[A-Z]).{8,}$
```

This reads as: "from the start, check ahead for at least one digit, check ahead for at least one uppercase letter, then match any 8+ characters."

---

## 11. Backreferences

A backreference lets you match the **same text** that an earlier group already captured. Written as `\1`, `\2`, etc. (matching group numbers).

```
Pattern: (\w+) \1
Matches: "hello hello" (a repeated word)
Doesn't match: "hello world" (different words)
```

**Practical use: finding duplicate words in text**

```
Pattern: \b(\w+)\s+\1\b
Matches: "the the", "is is" (common typos of doubled words)
```

**Matching balanced quotes** (same quote character opening and closing):

```
Pattern: (["'])(.*?)\1
Text: 'hello' or "hello"
Matches: 'hello' as a whole, capturing "hello" as group 2
```

This ensures a string that starts with `'` also ends with `'` (not mismatched like `'hello"`).

---

## 12. Flags / Modifiers

Flags change how the whole pattern behaves. Syntax differs slightly by language, but the concepts are universal.

| Flag | Name             | Effect                                                          |
| ---- | ---------------- | --------------------------------------------------------------- |
| `i`  | Case-insensitive | `cat` matches "Cat", "CAT"                                      |
| `g`  | Global           | Find ALL matches, not just the first                            |
| `m`  | Multiline        | `^` and `$` match start/end of each line, not just whole string |
| `s`  | Dotall           | `.` also matches newline characters                             |
| `x`  | Extended/verbose | Allows whitespace and comments in the pattern for readability   |

**Python example:**

```python
import re
re.findall(r"cat", "Cat CAT cat", re.IGNORECASE)
# ['Cat', 'CAT', 'cat']
```

**JavaScript example:**

```javascript
'Cat CAT cat'.match(/cat/gi);
// ['Cat', 'CAT', 'cat']
```

---

## 13. Common Real-World Patterns

These are patterns you'll reach for constantly. Treat them as starting points, and always test against your actual data.

**Email address (simple, good enough for most cases):**

```
^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$
```

**IPv4 address:**

```
^(\d{1,3}\.){3}\d{1,3}$
```

(This allows 999.999.999.999 too. For strict validation you'd bound each octet to 0 through 255, which gets verbose.)

**URL:**

```
https?://[^\s/$.?#].[^\s]*
```

**Hex color code:**

```
^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
```

**Date (YYYY-MM-DD):**

```
^\d{4}-\d{2}-\d{2}$
```

**Phone number (US-style, flexible formatting):**

```
^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$
```

**Strong password (min 8 chars, upper, lower, digit, special char):**

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$
```

**Extract all URLs from text:**

```
https?://[^\s"'<>]+
```

**Match a UUID:**

```
^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

**Extract query string parameters from a URL:**

```
[?&]([^=]+)=([^&]*)
```

**Match SQL injection-ish quote patterns (for filtering/detection, not a full defense):**

```
('|\"|;|\-\-|\/\*|\*\/)
```

**Match potential XSS script tags (again, detection heuristic, not a real defense):**

```
<script[^>]*>.*?</script>
```

> Note: regex-based input filtering is easily bypassed and should never be your only defense against injection attacks. Use parameterized queries, output encoding, and proper sanitization libraries. Regex here is useful for logging/detection/recon, not as a security boundary.

---

## 14. Regex in Different Languages

The core concepts are universal, but syntax to invoke regex differs.

### Python

```python
import re

re.search(pattern, text)      # find first match, returns Match object or None
re.match(pattern, text)       # match only at the START of string
re.findall(pattern, text)     # returns list of all matches
re.finditer(pattern, text)    # returns iterator of Match objects
re.sub(pattern, repl, text)   # replace matches
re.split(pattern, text)       # split string by pattern

# Compiling for reuse (faster if used many times)
compiled = re.compile(r"\d+")
compiled.findall("a1 b22 c333")
```

### JavaScript

```javascript
const re = /\d+/g;
'a1 b22 c333'.match(re); // ['1', '22', '333']
re.test('a1'); // true/false
'a1 b22'.replace(/\d+/g, 'X'); // "aX bX"
```

### Bash / grep

```bash
grep -E "^[0-9]+$" file.txt     # extended regex, lines that are only digits
grep -oP "(?<=token=)\w+" file  # Perl regex (-P) for lookbehind support
```

### Burp Suite / general pentest tooling

Burp's match/replace and Logger++ filters use standard Java-flavored regex (very close to what's shown above). Useful for filtering proxy history, e.g. matching `Set-Cookie:.*` headers or extracting JWTs with `eyJ[\w-]+\.[\w-]+\.[\w-]+`.

---

## 15. Performance and ReDoS

Some regex patterns can become catastrophically slow on certain inputs. This is called **ReDoS** (Regular Expression Denial of Service). It happens with **nested quantifiers** or **ambiguous repetition**, where the engine has to try exponentially many ways to match.

**Dangerous pattern (avoid):**

```
(a+)+$
```

On input like `"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"` (many a's, then a non-matching character), this can take the engine an extremely long time because it backtracks through countless combinations.

**Safer alternative:**

```
a+$
```

Achieves the same practical goal without the nested ambiguity.

**Rules to avoid ReDoS:**

- Avoid nesting quantifiers like `(a+)+`, `(a*)*`, `(a|a)*`.
- Be careful with patterns where two parts of the regex can match the same characters.
- Use atomic groups or possessive quantifiers if your engine supports them (`(?>...)`, `a++`).
- Test regex against pathological/long inputs before deploying it in anything user-facing (form validation, WAF rules, log parsers).
- This matters for security work specifically: ReDoS is a real, reportable vulnerability class in bug bounty programs when found in server-side input validation.

---

## 16. Practice Cheat Sheet

Quick reference for everything above:

```
.           any character except newline
\d  \D      digit / not digit
\w  \D      word char / not word char
\s  \S      whitespace / not whitespace
^   $       start / end of string (or line, with m flag)
\b  \B      word boundary / not word boundary

*           0 or more (greedy)
+           1 or more (greedy)
?           0 or 1 (optional) / makes quantifier lazy when placed after one
{n}         exactly n
{n,}        n or more
{n,m}       between n and m
*?  +?      lazy versions

[abc]       any one of a, b, c
[^abc]      none of a, b, c
[a-z]       range
a|b         a OR b

(...)       capturing group
(?:...)     non-capturing group
(?P<name>..) named group (Python style)
\1  \2      backreference to group 1, 2...

(?=...)     positive lookahead
(?!...)     negative lookahead
(?<=...)    positive lookbehind
(?<!...)    negative lookbehind

i           case-insensitive flag
g           global (all matches) flag
m           multiline flag
s           dotall flag
```

**Suggested practice path:**

1. Match literal words and simple character classes.
2. Build patterns for emails, phone numbers, and dates.
3. Practice greedy vs lazy on HTML-like text.
4. Extract query parameters from URLs using lookaheads/lookbehinds.
5. Try [regex101.com](https://regex101.com). It visually explains every part of a pattern and shows step-by-step matching, extremely useful while learning.
