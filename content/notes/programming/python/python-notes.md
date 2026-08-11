---
title: 'Python Programming'
description: 'Comprehensive notes on Python programming, from fundamentals and data structures to modern type hints, OOP, async programming, networking, databases, APIs, testing, performance, design patterns, and security.'
category: 'Programming'
tags: ['python', 'programming', 'development']
date: '2026-06-01'
---

# Python Mastery: From Zero to Advanced

_A single, self-contained reference and course. Read it top to bottom, or jump to any chapter when you need it._

---

## Table of Contents

- [00. How to Use This Book](#00-how-to-use-this-book)
- [01. Python Fundamentals](#01-python-fundamentals)
- [02. Variables and Data Types](#02-variables-and-data-types)
- [03. Operators](#03-operators)
- [04. Control Flow](#04-control-flow)
- [05. Functions](#05-functions)
- [06. Data Structures](#06-data-structures)
- [07. Strings](#07-strings)
- [08. Modules and Packages](#08-modules-and-packages)
- [09. File Handling](#09-file-handling)
- [10. Error Handling](#10-error-handling)
- [11. Object-Oriented Programming](#11-object-oriented-programming)
- [12. Advanced OOP](#12-advanced-oop)
- [13. Type Hints: Deep Section](#13-type-hints-deep-section)
- [14. Modern Python Features](#14-modern-python-features)
- [15. Iterators and Generators](#15-iterators-and-generators)
- [16. Decorators](#16-decorators)
- [17. Context Managers](#17-context-managers)
- [18. Functional Python](#18-functional-python)
- [19. Regular Expressions](#19-regular-expressions)
- [20. JSON, CSV and Serialization](#20-json-csv-and-serialization)
- [21. Logging](#21-logging)
- [22. Testing](#22-testing)
- [23. Debugging](#23-debugging)
- [24. Virtual Environments and Packaging](#24-virtual-environments-and-packaging)
- [25. Networking](#25-networking)
- [26. Socket Programming](#26-socket-programming)
- [27. HTTP Programming](#27-http-programming)
- [28. Async Python](#28-async-python)
- [29. Concurrency and Parallelism](#29-concurrency-and-parallelism)
- [30. Databases (SQLite)](#30-databases-sqlite)
- [31. APIs](#31-apis)
- [32. CLI Applications](#32-cli-applications)
- [33. Python Internals](#33-python-internals)
- [34. Performance](#34-performance)
- [35. Clean Code](#35-clean-code)
- [36. Design Patterns](#36-design-patterns)
- [37. Security-Oriented Python](#37-security-oriented-python)
- [38. Real-World Projects](#38-real-world-projects)
- [39. Learning Method Recap](#39-learning-method-recap)
- [40. Exams by Level](#40-exams-by-level)
- [41. Final Python Exam](#41-final-python-exam)
- [42. 90-Day Python Plan](#42-90-day-python-plan)
- [43. 6-Month Python Mastery Plan](#43-6-month-python-mastery-plan)

---

## 00. How to Use This Book

### Concept

This is not a book you read once. It's a **workbook**. Every major topic follows the same shape, so you always know what's coming next:

| Section             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| **Concept**         | Explains the idea in plain English                      |
| **Why?**            | Explains why the feature exists: what problem it solves |
| **Syntax**          | Shows the bare-bones pattern                            |
| **Example**         | A small, real example                                   |
| **Explanation**     | The example, line by line                               |
| **Common Mistakes** | What beginners get wrong                                |
| **Best Practice**   | The modern, idiomatic way                               |
| **Practice**        | Exercises for you to do                                 |
| **Mini Challenge**  | A slightly harder problem, no hand-holding              |
| **Exam Question**   | A question to check you actually understood it          |

### Why?

If every chapter has the same shape, your brain stops spending energy on "what am I reading" and spends it on "do I understand this." That's the whole point.

### Difficulty Markers

Exercises are tagged so you know what you're walking into:

- 🟢 Easy: you should get this on the first try
- 🟡 Medium: needs a bit of thinking
- 🟠 Hard: combines multiple ideas
- 🔴 Very Hard: treat it like a mini-project

### How to actually learn from this

1. Read **Concept** and **Why?** slowly. Don't skip "Why?": it's the part that makes the syntax stick.
2. Type the **Example** yourself. Don't copy-paste. Typing it forces your brain to notice details.
3. Break the example on purpose. Change a value, delete a line, see what error you get. Errors are not failures: they're the fastest way to learn Python's rules.
4. Do **Practice** before looking anything up.
5. Do **Mini Challenge** without help. If you get stuck, walk away for 10 minutes, then come back.
6. Answer **Exam Question** out loud or in writing, as if explaining to someone else. If you can't explain it simply, you don't understand it yet: that's fine, that's what re-reading is for.

### A note on how solutions work in this book

When a challenge doesn't hand you a solution immediately, that's intentional (see Chapter 39 later in this book for the full method). If you want a solution to something in this book right now, just ask for it directly: the hints-first approach is the _default_ teaching style, not a rule that blocks you from getting help.

### A note on your setup

You're on Arch Linux using Neovim and `uv` as your package manager. Everything in this book uses standard Python: nothing here is tied to a specific editor or OS: but wherever a chapter talks about installing packages or managing environments, `uv` is mentioned as the fast modern option alongside the standard `pip`/`venv` tools, since that's what you already use.

---

## 01. Python Fundamentals

### Concept

Python is a **programming language**: a way of writing instructions that a computer can carry out. Python code is stored in plain text files ending in `.py`, and a program called the **Python interpreter** reads that text and executes it, line by line.

### Why?

Before touching syntax, you need to know _how Python code actually gets run_, because "I don't know why this isn't running" is the single most common beginner problem: and it's almost always about the environment, not the code.

### Installing Python

## 1. Installation & Setup

- Download Python from [python.org](https://python.org/) — installs the Python **virtual machine (interpreter)** that converts `.py` code → bytecode → runs on the PVM.
- IDE = Integrated Development Environment. Popular ones: **VS Code**, PyCharm, Jupyter, Zed, Neovim.

### VS Code setup:

Install the **Python** extension + **Code Runner** extension.

- Check installation:

```bash
python --version
python3 --version
which python3
```

### Neovim setup:

**`none-ls`:** format + lint

```bash
ruff
```

```bash
require("none-ls.formatting.ruff_format"),

```

**`lsp`:** auto complete, go to definition, find all references etc

```bash
      basedpyright = {
        settings = {
          python = {
            pythonPath = (function()
              local venv = vim.fn.getcwd() .. "/.venv/bin/python"
              if vim.fn.executable(venv) == 1 then
                return venv
              end
              return vim.fn.exepath("python3")
            end)(),
            analysis = {
              typeCheckingMode = "standard",
              diagnosticMode = "workspace",
              autoSearchPaths = true,
              useLibraryCodeForTypes = true,
              inlayHints = {
                variableTypes = true,
                functionReturnTypes = true,
                callArgumentNames = true,
                pytestParameters = true,
              },
            },
          },
        },
      },

      ruff = {
        on_attach = function(client)
          client.server_capabilities.hoverProvider = false
          client.server_capabilities.documentFormattingProvider = false
          client.server_capabilities.documentRangeFormattingProvider = false
        end,
      },


```

---

- **Modern addition — use `uv` or `venv` instead of installing packages globally:**

```bash
python -m venv .venv
source .venv/bin/activate      # Linux/Mac
.venv\Scripts\activate         # Windows
pip install requests

# or the much faster modern tool
uv venv
uv pip install requests
```

### `print()`

```python
print("Hello, World!")
```

`print()` is a **function**: a reusable block of code you can call by name. This one takes whatever you give it and displays it on the screen (this is called "standard output").

```python
print("Name:", "Lichi", "Age:", 20)
# Name: Lichi Age: 20
```

`print()` can take multiple values, separated by commas, and it will space them out automatically.

### Comments

```python
# This is a comment. Python ignores this line completely.
print("This line runs")  # comments can also go at the end of a line
```

Comments exist for humans, not the computer. Use them to explain _why_ you did something, not to restate _what_ the code obviously does.

```python
# ❌ Bad: restates the obvious
x = x + 1  # add 1 to x

# ✅ Better: explains the reason
x = x + 1  # compensate for the off-by-one in the API's page index
```

### Variables

A variable is a **name that points to a value**. You can tell Python, and more importantly tell yourself and your editor, what type that value is by adding a type hint after the name:

```python
name: str = "Lichi"
age: int = 20
```

The `: str` and `: int` are **type hints**. Python doesn't check them while the program runs; they exist to document your intent and let tools like `mypy` and your editor catch mistakes before you ever run the code. This book writes variables with type hints from here on, even in simple examples, so the habit is built in early. (Function type hints are covered properly in Chapter 05, and a full deep dive on the typing system is in Chapter 13.)

```text
name  ────►  "Lichi"   (a string object in memory)
age   ────►  20        (an integer object in memory)
```

Python doesn't "copy" the value into a box labeled `name`. Instead, `name` is a label pointing at an object that already exists somewhere in memory. This matters a lot later (Chapter 06, when we talk about mutability and copying): for now, just know: **a variable is a name, not a container.**

### Naming Conventions

```python
# ✅ good names
user_age: int = 25
total_price: float = 19.99
is_active: bool = True

# ❌ bad names
a: int = 25
x1: float = 19.99
flag: bool = True
```

Rules Python **enforces**:

- Must start with a letter or underscore, not a digit
- Can only contain letters, digits, underscores
- Case-sensitive (`age` and `Age` are different variables)
- Can't be a reserved keyword (`class`, `for`, `import`, etc.)

Rules Python **doesn't enforce but you should follow** (PEP 8, the official style guide):

- `snake_case` for variables and functions: `user_age`, not `userAge` or `UserAge`
- `UPPER_CASE` for constants: `MAX_RETRIES = 5`
- `PascalCase` for classes (Chapter 11): `class UserAccount:`

### Constants

Python has no true "constant" keyword: there's no way to make a variable truly unchangeable at the language level. Instead, the _convention_ is: if the name is in `UPPER_CASE`, everyone agrees not to reassign it.

```python
MAX_LOGIN_ATTEMPTS: int = 3
PI: float = 3.14159
```

This is a social contract enforced by style, not by the interpreter. (Type checkers like `mypy` _can_ enforce real immutability using `Final`: covered in Chapter on Type Hints.)

### A quick look at types

Python has several built-in data types. We'll go deep on each in Chapter 02: here's just enough to recognize them:

```python
age: int = 20                  # whole numbers
price: float = 19.99           # decimal numbers
name: str = "Lichi"            # text
is_admin: bool = False         # True or False
nothing: None = None           # represents "no value"
```

Check any value's type with the built-in `type()` function:

```python
print(type(age))     # <class 'int'>
print(type(name))    # <class 'str'>
```

### Type Conversion

Converting one type to another is called **casting**.

```python
age_text: str = "20"
age_number: int = int(age_text)       # str -> int
price: float = float("19.99")         # str -> float
as_text: str = str(42)                # int -> str
```

### `input()`

```python
name: str = input("What's your name? ")
print("Hello,", name)
```

`input()` always returns a **string**: even if the user types a number. This trips up almost everyone:

```python
age: str = input("Enter your age: ")
next_year = age + 1
# ❌ TypeError: can only concatenate str (not "int") to str
```

Writing `age: str = input(...)` explicitly is a small habit with a real payoff here: a type checker sees `age` is a `str` and flags `age + 1` as an error before you even run the program, not after.

```python
# ✅ Fixed
age: int = int(input("Enter your age: "))
next_year: int = age + 1
```

### Example

```python
# fundamentals_demo.py
name: str = input("What's your name? ")
age: int = int(input("What's your age? "))

print("Hello,", name)
print("Next year you'll be", age + 1)
print("Your name has", len(name), "letters")
```

### Explanation

1. `input("What's your name? ")`: shows the prompt, waits for the user to type, returns what they typed as a string.
2. `int(input(...))`: the inner `input()` runs first (returns a string), then `int()` converts that string to a number, all in one line.
3. `print("Hello,", name)`: prints two comma-separated values with a space between them.
4. `age + 1`: since `age` is already an `int`, this is normal number addition.
5. `len(name)`: a built-in function that returns how many characters are in a string.

### Common Mistakes

```python
# ❌ Forgetting input() returns a string
age: str = input("Age: ")
print(age + 1)   # TypeError

# ❌ Using = instead of == (covered fully in Operators)
if age = 20:      # SyntaxError: = is assignment, == is comparison
    ...

# ❌ Inconsistent naming
userAge: int = 20
user_name: str = "Lichi"   # mixing camelCase and snake_case in the same file
```

### Best Practice

- Use `snake_case` consistently.
- Convert `input()` immediately if you need a number: don't carry a "number that's secretly a string" through your program.
- Prefer clear names over short ones: `total_price`, not `tp`.

### Practice

- 🟢 Write a program that asks for your name and prints `"Hi, <name>! Welcome."`
- 🟢 Write a program that asks for two numbers and prints their sum. (Remember to convert them!)
- 🟡 Write a program that asks for a temperature in Celsius and prints it converted to Fahrenheit (`F = C * 9/5 + 32`).

### Mini Challenge

🟡 Write a program that asks for your birth year, calculates your age this year (2026), and prints a sentence like `"You are 20 years old (or will turn 20 this year)."`

### Exam Question

- What's the difference between the Python REPL and running a `.py` file? When would you use each?
- Why does `input("Age: ") + 1` crash, and what's the fix?
- Why does Python enforce `snake_case` for some things and not others?

---

## 02. Variables and Data Types

### Concept

Python's core built-in types are: `int`, `float`, `str`, `bool`, and `None` (the "no value" type). Every value you work with in Python is an **object** of one of these types (or a type built from them).

### Why?

Every operation in Python behaves differently depending on type. `"2" + "2"` gives `"22"`, but `2 + 2` gives `4`. Knowing types precisely: not "kind of knowing": is what separates code that works from code that crashes in production.

### Integers (`int`)

Whole numbers, positive or negative, with no size limit (Python automatically handles huge numbers).

```python
age: int = 20
big_number: int = 10_000_000   # underscores are allowed as visual separators, ignored by Python
negative: int = -5
```

### Floats (`float`)

Decimal numbers.

```python
price: float = 19.99
pi: float = 3.14159
```

Floats are **not perfectly precise**: this is true in almost every programming language, not just Python:

```python
print(0.1 + 0.2)
# 0.30000000000000004
```

This happens because computers store decimals in binary, and most decimal fractions can't be represented exactly in binary: the same way `1/3` can't be written exactly in decimal. For money or anything requiring exact decimals, use the `decimal` module (covered later) instead of `float`.

### Strings (`str`)

Text, wrapped in quotes.

```python
name: str = "Lichi"
message: str = 'single quotes work too'
multiline: str = """
This spans
multiple lines
"""
```

Strings are covered in full depth in Chapter 07: here you just need the basics.

### Booleans (`bool`)

Only two possible values: `True` or `False` (capitalized: this is required).

```python
is_admin: bool = False
is_logged_in: bool = True
```

Under the hood, `bool` is actually a subtype of `int`: `True == 1` and `False == 0` both evaluate to `True`. This is occasionally useful (`sum([True, True, False])` gives `2`) but don't rely on it to write unclear code.

### `None`

Represents "no value" or "nothing here." It is its own type, `NoneType`, and there's only ever one `None` in the whole program.

```python
result: int | None = None   # we don't have an answer yet

def find_user(user_id: int) -> str | None:
    ...
    return None   # explicitly says "not found"
```

`None` is _not_ the same as `0`, `False`, or `""`, even though all of them are "falsy" (more in Chapter 03).

### Type Conversion (casting), in more depth

```python
int("42")           # 42
int("42.5")         # ❌ ValueError: int() can't parse a decimal string directly
int(42.9)           # 42: truncates, doesn't round!
float("3.14")       # 3.14
str(42)             # "42"
bool(0)             # False
bool(1)             # True
bool("")            # False: empty string is falsy
bool("False")       # True : non-empty string, so it's truthy, even though it *says* "False"!
```

That last one is a classic trap: `bool("False")` is `True`, because any non-empty string is truthy: Python doesn't look at _what the string says_, only whether it has characters.

### Example

```python
raw_price: str = "1250"
price: int = int(raw_price)
discount_rate: float = 0.15

final_price: float = price * (1 - discount_rate)
print(f"Final price: {final_price}")
print(type(final_price))
```

### Explanation

1. `raw_price` starts as a string (as it would if it came from user input or a web form).
2. `int(raw_price)` converts it to a real number so arithmetic works.
3. `price * (1 - discount_rate)`: `int * float` in Python automatically produces a `float`. Python "promotes" the result to the more general type.
4. The f-string `f"..."` embeds the variable directly in the text (full details in Chapter 07).

### Common Mistakes

```python
# ❌ Trying to int() a decimal-looking string directly
int("19.99")     # ValueError

# ✅ Fix: go through float first if you truly need to
int(float("19.99"))   # 19 (truncated)

# ❌ Assuming int() rounds
int(4.9)    # 4, not 5: it truncates toward zero

# ✅ If you want rounding, use round()
round(4.9)   # 5
```

### Best Practice

- Use `float` for general decimals, `decimal.Decimal` for money.
- Be explicit about conversions: don't let Python silently guess.
- Check truthiness intentionally: `if name:` is fine for "is this string non-empty," but don't rely on it if `0` is a valid, meaningful value in your logic (since `if count:` is `False` when `count == 0`, which might not be what you want).

### Practice

- 🟢 Predict the output of `bool("0")` before running it. Were you right?
- 🟢 Convert the string `"3.9"` to an integer using two different valid approaches.
- 🟡 Explain, in your own words, why `0.1 + 0.2 != 0.3` in Python.

### Mini Challenge

🟡 Write a program that takes a price as a string input (e.g., `"499.50"`), applies an 18% tax, and prints the final price rounded to 2 decimal places using `round()`.

### Exam Question

- Why is `bool("False")` equal to `True`? What rule explains this?
- What's the practical difference between `int(4.9)` and `round(4.9)`?
- Why might you avoid `float` for financial calculations?

---

## 03. Operators

### Concept

Operators are symbols that perform actions on values: math (`+`), comparison (`==`), logic (`and`), membership (`in`), identity (`is`), and assignment (`=`).

### Why?

Almost every line of real Python code uses at least one operator. Getting `==` vs `is` wrong, or misjudging operator precedence, causes some of the most confusing bugs beginners hit: bugs that don't crash, they just silently do the wrong thing.

### Arithmetic Operators

```python
5 + 3     # 8   addition
5 - 3     # 2   subtraction
5 * 3     # 15  multiplication
5 / 3     # 1.666...  true division: always returns a float
5 // 3    # 1   floor division: rounds down to nearest whole number
5 % 3     # 2   modulo: the remainder
5 ** 3    # 125 exponent (5 to the power of 3)
```

`/` vs `//` trips people up constantly:

```python
10 / 2    # 5.0   (float, even though it divides evenly)
10 // 2   # 5     (int)
10 // 3   # 3     (rounds down, not to nearest)
-7 // 2   # -4    (rounds toward negative infinity, not toward zero!)
```

### Comparison Operators

```python
5 == 5    # True  : equal value
5 != 3    # True  : not equal
5 > 3     # True
5 < 3     # False
5 >= 5    # True
5 <= 4    # False
```

### `==` vs `is`: the most important distinction in this chapter

```python
a: list[int] = [1, 2, 3]
b: list[int] = [1, 2, 3]

print(a == b)   # True : same VALUES
print(a is b)   # False: different OBJECTS in memory
```

- `==` asks: **"do these have the same value?"** (calls the object's `__eq__` method)
- `is` asks: **"are these literally the same object in memory?"** (compares memory identity)

```python
c = a
print(a is c)   # True: c points to the exact same list object as a
```

The one place `is` is _correct and idiomatic_ to use instead of `==`: comparing to `None`.

```python
# ✅ Best practice
if value is None:
    ...

# ❌ Works, but not idiomatic (and can misbehave with custom __eq__)
if value == None:
    ...
```

Why? Because there is only ever _one_ `None` object in the entire running program, so checking identity is both correct and slightly faster, and it's the community-agreed convention (PEP 8 says so explicitly).

A famous gotcha: small integers (`-5` to `256`) and short strings are cached by CPython for performance, so `is` can _appear_ to work on them even though it's semantically wrong:

```python
x: int = 5
y: int = 5
print(x is y)   # True: but only because small ints are cached! Don't rely on this.

x = 500
y = 500
print(x is y)   # False (in most cases): same value, different objects
```

**Rule of thumb: use `==` for values, `is` only for `None`, `True`, `False`, and genuine identity checks.**

### Logical Operators

```python
True and False    # False: both must be True
True or False     # True : at least one must be True
not True          # False: flips the value
```

Real usage:

```python
age: int = 25
has_id: bool = True

if age >= 18 and has_id:
    print("Entry allowed")
```

Python's `and`/`or` also do **short-circuit evaluation** and return one of the actual operand values, not just `True`/`False`:

```python
print(0 or "default")       # "default" : 0 is falsy, so evaluates the right side
print("hi" and "bye")       # "bye"     : "hi" is truthy, so returns the right side
print([] or "fallback")     # "fallback": empty list is falsy
```

This pattern: `value or default`: is common for providing fallback values, though in modern Python you'll often see it replaced by clearer alternatives depending on context.

### Membership Operators

```python
fruits: list[str] = ["apple", "banana", "cherry"]

print("banana" in fruits)       # True
print("mango" not in fruits)    # True
```

Works on strings, lists, tuples, sets, dicts (checks keys), and any object that defines `__contains__`.

### Identity Operators

```python
a is b        # same object?
a is not b    # not the same object?
```

Already covered above under `==` vs `is`.

### Assignment Operators

```python
x: int = 5
x += 1    # same as x = x + 1  -> 6
x -= 1    # x = x - 1
x *= 2    # x = x * 2
x /= 2    # x = x / 2
x //= 2   # x = x // 2
x **= 2   # x = x ** 2
x %= 2    # x = x % 2
```

### Operator Precedence

Python evaluates in this general order (highest priority first: abbreviated to the ones you'll actually hit early on):

```text
()                  parentheses (always first)
**                  exponent
* / // %            multiplication/division group
+ -                 addition/subtraction
== != > < >= <=     comparisons
not
and
or
```

```python
print(2 + 3 * 4)            # 14, not 20: * happens before +
print((2 + 3) * 4)          # 20: parentheses force order
print(not True and False)   # False -> `not True` first (=False), then `False and False`
```

**Best practice: when precedence isn't obvious at a glance, add parentheses: even if they're technically unnecessary. Clarity beats cleverness.**

### Example

```python
age: int = 20
has_ticket: bool = True
is_vip: bool = False

can_enter: bool = (age >= 18 and has_ticket) or is_vip
print(can_enter)   # True
```

### Explanation

1. `age >= 18` → `True`
2. `has_ticket` → `True`
3. `True and True` → `True`
4. `True or is_vip (False)` → `True` (short-circuits: never even needs to check `is_vip`)
5. The parentheses aren't strictly required here since `and` binds tighter than `or` automatically, but they make the _intent_ obvious to a human reader.

### Common Mistakes

```python
# ❌ Using = when you mean ==
if age = 20:     # SyntaxError

# ❌ Using == to compare with None
if value == None:   # works, but not idiomatic

# ❌ Assuming 'and'/'or' return True/False
result = "" or "backup"
print(result)   # "backup", not True

# ❌ Misjudging // with negative numbers
print(-7 // 2)   # -4, a common source of off-by-one bugs
```

### Best Practice

- `is` only for `None` / `True` / `False` / genuine identity checks; `==` for everything else.
- Parenthesize mixed logical expressions for readability, even when not required.
- Never rely on small-int/string caching behavior: it's a CPython implementation detail, not a language guarantee.

### Practice

- 🟢 Predict: `10 % 3`, `10 // 3`, `-10 // 3`. Check your answers.
- 🟢 Write an `if` statement that checks whether a number is between 1 and 100 (inclusive) using `and`.
- 🟡 Predict the output of `[] == []` and `[] is []`. Explain the difference.

### Mini Challenge

🟠 Without running it, predict the output of this, then verify:

```python
a = "hello"
b = "hel" + "lo"
print(a == b)
print(a is b)
```

Then explain _why_ the `is` result might differ between running this in a `.py` file vs typing it line-by-line in the REPL. (Hint: it involves how CPython compiles code.)

### Exam Question

- In your own words: what's the difference between `==` and `is`?
- Why is `if x is None` preferred over `if x == None`?
- Why does `5 or 0` return `5`, not `True`?

---

## 04. Control Flow

### Concept

Control flow is how a program decides _what to run_ and _how many times_: branching with `if`, and repeating with loops.

### Why?

Without control flow, a program is just a fixed sequence of steps, always the same, no matter the input. Control flow is what lets code _respond_ to data.

### `if` / `elif` / `else`

```python
age: int = 20

if age < 13:
    print("child")
elif age < 20:
    print("teenager")
else:
    print("adult")
```

- Python checks conditions top to bottom, runs the **first** one that's `True`, then skips the rest.
- Indentation (4 spaces, by convention) is not a style choice in Python: it's _how Python knows what's inside the block_. This is different from languages that use `{}`.

### `for` loops

```python
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)
```

A `for` loop in Python is fundamentally different from many other languages: it doesn't count `i = 0; i < n; i++`: it **iterates over items in a sequence** directly. Counting is something you ask for explicitly with `range()`.

### `while` loops

```python
count: int = 0
while count < 5:
    print(count)
    count += 1
```

Runs as long as the condition is `True`. **You must change something inside the loop that eventually makes the condition `False`, or you get an infinite loop.**

```python
# ❌ Infinite loop: count never changes
count: int = 0
while count < 5:
    print(count)
```

### `break`, `continue`, `pass`

```python
for n in range(10):
    if n == 5:
        break        # exits the loop entirely
    print(n)
# prints 0 1 2 3 4

for n in range(5):
    if n == 2:
        continue     # skips just this iteration, keeps looping
    print(n)
# prints 0 1 3 4

if True:
    pass             # does literally nothing: a placeholder
```

`pass` is useful when Python _requires_ a code block (like inside an `if` or a function you haven't written yet) but you have nothing to put there.

```python
def not_implemented_yet():
    pass   # TODO: write this later
```

### `range()`

```python
range(5)          # 0, 1, 2, 3, 4        (stops BEFORE 5)
range(2, 5)        # 2, 3, 4
range(0, 10, 2)     # 0, 2, 4, 6, 8      (step of 2)
range(10, 0, -1)     # 10, 9, 8, ... 1   (counting down)

for i in range(5):
    print(i)
```

`range()` doesn't build a full list in memory: it generates numbers one at a time, on demand. This matters a lot once you get to Chapter 15 (Generators).

### `enumerate()`

When you need both the index _and_ the value while looping:

```python
fruits: list[str] = ["apple", "banana", "cherry"]

# ❌ clunky, un-pythonic
for i in range(len(fruits)):
    print(i, fruits[i])

# ✅ pythonic
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

### `zip()`

When you need to loop over two sequences together, in parallel:

```python
names: list[str] = ["Alice", "Bob", "Carol"]
scores: list[int] = [90, 85, 95]

for name, score in zip(names, scores):
    print(name, "scored", score)
```

`zip()` stops as soon as the _shortest_ sequence runs out: it doesn't error on mismatched lengths.

### Pythonic Looping Patterns

```python
# ❌ Un-pythonic: manual indexing
i: int = 0
while i < len(fruits):
    print(fruits[i])
    i += 1

# ✅ Pythonic: loop directly over items
for fruit in fruits:
    print(fruit)

# ✅ Pythonic: need index too? enumerate, not range(len())
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

The guiding idea in Python (sometimes summarized as "EAFP" and covered more in Exceptions) is: **loop over what you actually need, don't manufacture indices you don't need.**

### Example

```python
scores: list[int] = [55, 82, 91, 40, 76]

for i, score in enumerate(scores):
    if score < 60:
        print(f"Student {i}: FAIL ({score})")
        continue
    print(f"Student {i}: PASS ({score})")
```

### Explanation

1. `enumerate(scores)` gives us `(0, 55), (1, 82), ...` pairs.
2. For each pair, we unpack it directly into `i, score`.
3. If the score is below 60, we print FAIL and `continue`: skipping the PASS print below it, but not stopping the loop.
4. Otherwise, we fall through and print PASS.

### Common Mistakes

```python
# ❌ Off-by-one with range
for i in range(1, 10):   # this is 1 through 9, NOT 1 through 10!
    ...

# ❌ Infinite while loop
i = 0
while i < 5:
    print(i)   # forgot i += 1

# ❌ Mixing tabs and spaces (Python will error: pick one, spaces are standard)

# ❌ Using range(len(x)) when you don't need the index at all
for i in range(len(fruits)):
    print(fruits[i])   # just do: for fruit in fruits:
```

### Best Practice

- Prefer `for item in collection` over manual indexing.
- Use `enumerate()` instead of `range(len(...))` when you need the index.
- Use `zip()` for parallel iteration instead of indexing two lists separately.
- Keep loop bodies short: if a loop body is doing five different things, consider a function (Chapter 05).

### Practice

- 🟢 Print numbers 1 through 20, but print "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both. (Classic exercise for a reason.)
- 🟢 Given a list of numbers, use `enumerate()` to print each number alongside its position.
- 🟡 Given two lists: `names` and `emails`: use `zip()` to print `"<name>: <email>"` for each pair.

### Mini Challenge

🟠 Write a program that asks the user to guess a secret number (pick one yourself, e.g. `42`) in a `while` loop. After each guess, tell them "too high," "too low," or "correct!": and stop the loop once they get it. Track and print how many guesses it took.

### Exam Question

- Why does `range(5)` not include `5`?
- What's the difference between `break` and `continue`?
- Why is `for item in collection` generally preferred over `for i in range(len(collection))`?

---

## 05. Functions

### Concept

A function is a named, reusable block of code that takes inputs (**parameters**), does something, and optionally gives back an output (**return value**).

### Why?

Functions let you write logic once and use it everywhere, give complex operations a readable name, and isolate behavior so bugs are easier to find (a bug is in _one_ function, not scattered across your whole file).

### Basic Syntax

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Lichi")
print(message)   # Hello, Lichi!
```

- `def` starts a function definition.
- `greet` is the function's name.
- `(name)` is the parameter: the input the function expects.
- `return` sends a value back to whoever called the function. Without `return`, a function returns `None` by default.

### Modern Type Hints on Functions

```python
def add(a: int, b: int) -> int:
    return a + b
```

`a: int` and `b: int` say "this parameter should be an `int`." `-> int` says "this function returns an `int`." **Python does not enforce these at runtime**: they're documentation for humans and instructions for external tools like `mypy` (full deep-dive in the Type Hints chapter). Nothing stops you from calling `add("a", "b")` and getting `"ab"` back with no error: type hints are a promise, not a lock.

### Parameters vs Arguments

```python
def greet(name):     # 'name' here is a PARAMETER: the placeholder
    return f"Hi, {name}"

greet("Lichi")        # "Lichi" here is an ARGUMENT: the actual value passed in
```

### Positional vs Keyword Arguments

```python
def describe(name, age):
    print(f"{name} is {age} years old")

describe("Lichi", 20)              # positional: order matters
describe(age=20, name="Lichi")      # keyword: order doesn't matter
describe("Lichi", age=20)            # mixed: positional first, then keyword
```

### Default Arguments

```python
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

greet("Lichi")                   # "Hello, Lichi!"
greet("Lichi", "Welcome back")    # "Welcome back, Lichi!"
```

Classic trap: **never use a mutable object (list, dict) as a default argument.**

```python
# ❌ Dangerous
def add_item(item, cart=[]):
    cart.append(item)
    return cart

print(add_item("apple"))    # ['apple']
print(add_item("banana"))    # ['apple', 'banana']  <- SURPRISE! Same list reused!
```

Default argument values are created **once**, when the function is defined: not every time it's called. So a mutable default gets shared and mutated across every call that doesn't override it.

```python
# ✅ Fixed
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart
```

### `*args` and `**kwargs`

```python
def total(*args: int) -> int:
    return sum(args)

total(1, 2, 3)          # 6
total(1, 2, 3, 4, 5)     # 15
```

`*args` collects any number of extra **positional** arguments into a tuple.

```python
def profile(**kwargs: str) -> None:
    for key, value in kwargs.items():
        print(f"{key}: {value}")

profile(name="Lichi", role="student")
```

`**kwargs` collects any number of extra **keyword** arguments into a dict.

### Keyword-Only and Positional-Only Arguments

```python
def create_user(
    name: str,
    /,
    age: int,
    *,
    active: bool = True,
) -> dict[str, object]:
    return {"name": name, "age": age, "active": active}
```

- Everything **before `/`** must be passed **positionally only**: you can't do `create_user(name="Lichi", age=20)`, `name` has to come first as a plain value.
- Everything **after `*`** must be passed **as a keyword only**: you can't do `create_user("Lichi", 20, True)`, `active` has to be `active=True`.
- Everything between `/` and `*` can be either.

```python
create_user("Lichi", 20)                      # ✅
create_user("Lichi", age=20)                   # ✅
create_user("Lichi", 20, active=False)          # ✅
create_user(name="Lichi", age=20)                # ❌ TypeError: name is positional-only
create_user("Lichi", 20, False)                   # ❌ TypeError: active is keyword-only
```

**Why bother?** It makes function calls unambiguous and self-documenting at the call site, and it lets library authors change parameter _names_ later without breaking anyone's code (if a param is positional-only, callers never referenced its name in the first place).

### Scope and LEGB

Python looks up a variable name using the **LEGB** rule, in this order:

1. **L**ocal: inside the current function
2. **E**nclosing: inside any function this one is nested in
3. **G**lobal: at the top level of the file/module
4. **B**uilt-in: Python's own built-ins (`print`, `len`, etc.)

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)   # "local": found immediately in Local scope
    inner()

outer()
```

```python
count = 0

def increment():
    count += 1   # ❌ UnboundLocalError!
```

This fails because assigning to `count` inside the function makes Python treat it as a **local** variable for the _entire function body_: so `count += 1` tries to read a local `count` before it's been created. Fix with `global`:

```python
count = 0

def increment():
    global count
    count += 1
```

(In practice, reaching for `global` is usually a sign to redesign: pass values in and return values out instead. It's shown here so you recognize the error when you see it, not as a pattern to reach for.)

### Closures

A function that "remembers" variables from the scope it was created in, even after that outer function has finished running.

```python
def make_multiplier(factor: int):
    def multiply(number: int) -> int:
        return number * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))   # 10
print(triple(5))    # 15
```

`multiply` "closes over" `factor`: it keeps access to it even though `make_multiplier` already returned. This is the foundation for decorators (Chapter 12).

### Recursion

A function that calls itself.

```python
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120
```

Every recursive function needs a **base case** (a condition that stops the recursion): without one, you get infinite recursion and a `RecursionError`.

### Lambda Functions

Small, anonymous, single-expression functions.

```python
square = lambda x: x * x
print(square(5))   # 25

# equivalent to:
def square(x):
    return x * x
```

Lambdas are most useful as short throwaway functions passed to something else:

```python
numbers = [5, 2, 8, 1]
numbers.sort(key=lambda n: -n)   # sort descending
print(numbers)   # [8, 5, 2, 1]
```

**Best practice: if a lambda needs a comment to explain it, write a regular `def` function instead.** Lambdas are for genuinely trivial one-liners.

### Higher-Order Functions

A function that takes another function as an argument, or returns one.

```python
def apply_twice(func, value):
    return func(func(value))

def add_one(x):
    return x + 1

print(apply_twice(add_one, 5))   # 7
```

`make_multiplier` above is also a higher-order function (it returns a function).

### Example

```python
def calculate_total(
    prices: list[float],
    /,
    tax_rate: float = 0.0,
    *,
    discount: float = 0.0,
) -> float:
    subtotal = sum(prices)
    after_discount = subtotal - discount
    return after_discount * (1 + tax_rate)

total = calculate_total([10.0, 25.5, 8.0], tax_rate=0.1, discount=5.0)
print(round(total, 2))
```

### Explanation

1. `prices` is positional-only: you must always pass the price list as a plain argument.
2. `tax_rate` can be positional or keyword, with a default of `0.0`.
3. `discount` is keyword-only, also defaulting to `0.0`.
4. `sum(prices)` adds up the list.
5. We subtract the discount, then apply tax as a multiplier.
6. `round(total, 2)` rounds the final float to 2 decimal places for display.

### Common Mistakes

```python
# ❌ Mutable default argument
def add(item, items=[]):
    ...

# ❌ Forgetting a base case in recursion
def countdown(n):
    print(n)
    countdown(n - 1)   # never stops -> RecursionError

# ❌ Overusing lambda for complex logic
process = lambda x: x * 2 if x > 0 else -x if x < -10 else 0   # unreadable

# ❌ Confusing return with print
def add(a, b):
    print(a + b)   # this DISPLAYS the result but returns None!

result = add(2, 3)   # result is None, not 5
```

### Best Practice

- Type-hint your functions, even in small scripts: it pays off fast.
- Avoid mutable default arguments; use `None` and initialize inside.
- Prefer `return` over `print` inside functions that other code will use: let the _caller_ decide whether to print.
- Use positional-only/keyword-only markers (`/`, `*`) when writing library-style functions others will call.

### Practice

- 🟢 Write a function `is_even(n: int) -> bool` that returns whether a number is even.
- 🟢 Write a function `full_name(first: str, last: str) -> str` that returns `"First Last"`.
- 🟡 Write a function that accepts any number of numbers with `*args` and returns their average.
- 🟡 Write a closure `make_counter()` that returns a function which, each time it's called, returns the next integer starting from 0 (0, then 1, then 2, ...).

### Mini Challenge

🟠 Write a recursive function `flatten(nested: list) -> list` that takes a list which might contain other lists inside it (nested to any depth) and returns one flat list of all the values. Example: `flatten([1, [2, 3, [4, 5]], 6])` → `[1, 2, 3, 4, 5, 6]`.

### Exam Question

- Why does using a mutable default argument (like `[]`) cause bugs across multiple calls?
- What does `/` mean in a function signature? What does `*` mean?
- Explain, step by step, why this fails: a function does `count += 1` on a variable defined outside it, without using `global`.

---

## 06. Data Structures

### Concept

Python's built-in collection types are `list`, `tuple`, `set`, `frozenset`, and `dict`. Each stores multiple values, but they differ in **order**, **mutability**, **duplicates**, and **lookup speed**.

### Why?

Picking the wrong data structure is one of the most common sources of slow or buggy code. "Should this be a list or a set?" is a question with a real, often performance-critical answer.

### Quick Comparison

| Type        | Ordered                     | Mutable | Duplicates  | Access by       |
| ----------- | --------------------------- | ------- | ----------- | --------------- |
| `list`      | yes                         | yes     | yes         | index           |
| `tuple`     | yes                         | no      | yes         | index           |
| `set`       | no                          | yes     | no          | membership only |
| `frozenset` | no                          | no      | no          | membership only |
| `dict`      | yes (insertion order, 3.7+) | yes     | keys unique | key             |

### `list`

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")           # add to end
fruits.insert(0, "apricot")      # insert at position
fruits.remove("banana")           # remove by value
popped = fruits.pop()              # remove & return last item
fruits[0] = "avocado"                # mutate by index
```

### `tuple`

```python
point = (3, 4)
x, y = point   # unpacking

# Tuples are IMMUTABLE: this fails:
point[0] = 5   # ❌ TypeError
```

Use tuples for values that shouldn't change, and as dictionary keys (lists can't be dict keys: more below).

### `set`

```python
unique_ids = {1, 2, 2, 3, 3, 3}
print(unique_ids)   # {1, 2, 3}: duplicates automatically removed

a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # union: {1, 2, 3, 4}
print(a & b)   # intersection: {2, 3}
print(a - b)   # difference: {1}
```

Sets are extremely fast for **membership checks** (`x in my_set`): much faster than `x in my_list` for large collections, because of hashing (explained below).

### `frozenset`

An immutable version of `set`. Useful when you need a set-like object that can itself be a dict key or a member of another set (regular sets can't, because they're mutable and unhashable).

```python
frozen = frozenset([1, 2, 3])
```

### `dict`

```python
user = {"name": "Lichi", "age": 20}
user["role"] = "student"     # add/update a key
del user["age"]                # remove a key
print(user.get("email", "N/A"))   # safe lookup with a default
```

### Mutability vs Immutability

**Mutable** = can be changed after creation (`list`, `dict`, `set`).
**Immutable** = cannot be changed after creation (`tuple`, `str`, `int`, `float`, `frozenset`).

```python
a = [1, 2, 3]
b = a          # b points to the SAME list object
b.append(4)
print(a)       # [1, 2, 3, 4]: a changed too! Because a and b are the same object.
```

This is the single most important mental model shift for anyone coming from a language with more "copy by default" behavior. In Python, assignment (`=`) never copies: it just makes another name point at the same object.

### Copying: Shallow vs Deep

```python
import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)          # or original.copy(), or original[:]
deep = copy.deepcopy(original)

shallow[0].append(99)
print(original)   # [[1, 2, 99], [3, 4]]  <- changed! shallow copy shares inner lists

deep[1].append(99)
print(original)   # unaffected: deepcopy copies everything, recursively
```

- **Shallow copy** duplicates the outer container, but inner objects (like nested lists) are still shared references.
- **Deep copy** recursively duplicates everything, so nothing is shared.

```text
original ──► [ptr, ptr]
                │    │
                ▼    ▼
shallow ─────► [ptr, ptr]   (same inner list objects!)

deep ────────► [new_list, new_list]   (fully independent)
```

### Indexing and Slicing

```python
letters = ["a", "b", "c", "d", "e"]

letters[0]      # "a"
letters[-1]      # "e" : negative indexes count from the end
letters[1:3]      # ["b", "c"] : slice: start included, stop excluded
letters[:3]        # ["a", "b", "c"]
letters[2:]          # ["c", "d", "e"]
letters[::2]           # ["a", "c", "e"] : every 2nd item
letters[::-1]            # ["e", "d", "c", "b", "a"] : reversed
```

### Hashing and Dictionary Internals

A `dict` (and `set`) gets its speed from **hashing**: every key is run through a hash function that turns it into a number, and that number determines where the key-value pair is stored internally. That's why lookups (`user["name"]`) are close to instant regardless of dict size, unlike searching through a list one item at a time.

**Only hashable (immutable) objects can be dict keys or set members**: that's why `list` can't be a key, but `tuple` can:

```python
locations = {
    (28.6, 77.2): "Delhi",
    (22.5, 88.3): "Kolkata",
}
# locations[[28.6, 77.2]] = "Delhi"  ❌ TypeError: unhashable type: 'list'
```

### Comprehensions

A concise way to build a new collection from an existing one.

```python
numbers = [1, 2, 3, 4, 5]

squares = [x * x for x in numbers]                  # list comprehension
evens = [x for x in numbers if x % 2 == 0]            # with a filter
unique_lengths = {len(w) for w in ["hi", "bye", "ok"]}  # set comprehension
squares_dict = {x: x * x for x in numbers}                # dict comprehension
```

Equivalent to, but more compact and (once you're used to it) more readable than:

```python
squares = []
for x in numbers:
    squares.append(x * x)
```

### Nested Comprehensions

```python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

flat = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

Read nested comprehensions left to right, same order as the equivalent nested `for` loops:

```python
flat = []
for row in matrix:
    for num in row:
        flat.append(num)
```

**Best practice: if a comprehension needs more than 2 nested `for`/`if` clauses to read clearly, write it as a regular loop instead.** Comprehensions should make code _more_ readable, not less.

### Example

```python
orders = [
    {"item": "keyboard", "price": 45.0, "qty": 2},
    {"item": "mouse", "price": 20.0, "qty": 1},
    {"item": "monitor", "price": 150.0, "qty": 1},
]

totals = {order["item"]: order["price"] * order["qty"] for order in orders}
print(totals)
# {'keyboard': 90.0, 'mouse': 20.0, 'monitor': 150.0}

grand_total = sum(totals.values())
print(grand_total)   # 260.0
```

### Explanation

1. `orders` is a `list` of `dict`s: a common real-world shape for structured data.
2. The dict comprehension builds a new dict: for each order, `order["item"]` becomes the key, `price * qty` becomes the value.
3. `totals.values()` gives us a view of just the values, and `sum()` adds them up.

### Common Mistakes

```python
# ❌ Mutating a list while looping over it
items = [1, 2, 3, 4]
for item in items:
    if item % 2 == 0:
        items.remove(item)   # skips elements! Modifying while iterating is unsafe.

# ✅ Fix: loop over a copy, or build a new list
items = [item for item in items if item % 2 != 0]

# ❌ Assuming = copies
a = [1, 2, 3]
b = a
b.append(4)   # this also changes a!

# ❌ Using a list as a dict key
cache = {}
cache[[1, 2]] = "value"   # TypeError: unhashable type

# ❌ KeyError from direct dict access
user = {"name": "Lichi"}
print(user["age"])   # KeyError: use .get("age", default) instead
```

### Best Practice

- Use `list` for ordered, changeable collections; `tuple` for fixed records; `set` for uniqueness/fast membership; `dict` for key-value lookups.
- Copy explicitly (`.copy()`, `list(x)`, `copy.deepcopy(x)`): never assume `=` copies.
- Use `.get()` on dicts when a missing key is expected/acceptable.
- Prefer comprehensions for simple transforms; prefer loops when there's real branching logic.

### Practice

- 🟢 Given `nums = [4, 1, 7, 3, 9, 2]`, write a list comprehension that returns only numbers greater than 3.
- 🟢 Create a dict comprehension that maps each word in a list to its length.
- 🟡 Given two lists of equal length, `keys` and `values`, build a dict using a comprehension (hint: combine with `zip()` from Chapter 04).
- 🟡 Explain why `set()` membership checks (`x in my_set`) are faster than `list` membership checks for large collections.

### Mini Challenge

🟠 You have a list of dicts representing students: `[{"name": "A", "grade": 85}, {"name": "B", "grade": 62}, ...]`. Using a single dict comprehension, build a dict mapping each student's name to `"pass"` if grade >= 60 else `"fail"`.

### Exam Question

- Why can't a `list` be used as a dictionary key, but a `tuple` can?
- What's the difference between a shallow copy and a deep copy? Give an example where the difference actually matters.
- Why is modifying a list while iterating over it dangerous? What's the safe alternative?

---

## 07. Strings

### Concept

Strings (`str`) represent text. In Python, strings are **immutable sequences of characters**: every "modification" actually creates a brand-new string.

### Why?

Text processing is everywhere: file paths, user input, network data, log parsing (very relevant to your security work). Strings have a huge, well-designed set of built-in methods, and knowing them well means writing far less code.

### Creating Strings

```python
single = 'hello'
double = "hello"
triple = """
multi
line
"""
raw = r"C:\Users\name"        # raw string: backslashes are literal, not escape codes
```

### Immutability

```python
s = "hello"
s[0] = "H"   # ❌ TypeError: strings can't be modified in place

s = "H" + s[1:]   # ✅ this creates a NEW string, doesn't modify the old one
```

### Indexing and Slicing

Works exactly like list slicing (Chapter 06), since a string is a sequence:

```python
s = "Python"
s[0]       # "P"
s[-1]        # "n"
s[0:3]         # "Pyt"
s[::-1]           # "nohtyP" : reversed
```

### Common String Methods

```python
s = "  Hello, World!  "

s.strip()             # "Hello, World!"      : remove leading/trailing whitespace
s.lower()               # "  hello, world!  "
s.upper()                 # "  HELLO, WORLD!  "
s.replace("Hello", "Hi")   # "  Hi, World!  "
s.split(",")                 # ["  Hello", " World!  "]
",".join(["a", "b", "c"])       # "a,b,c"
s.startswith("  Hel")            # True
"World" in s                       # True
s.find("World")                      # index of "World", or -1 if not found
len(s)                                  # length, including whitespace
```

### String Formatting

Three ways exist; **use f-strings** (Python 3.6+, current best practice):

```python
name = "Lichi"
age = 20

# ✅ f-strings: best practice
print(f"{name} is {age} years old")

# .format(): older, still seen in codebases
print("{} is {} years old".format(name, age))

# % formatting: legacy, mostly seen in old code / logging module
print("%s is %d years old" % (name, age))
```

F-strings can also do inline expressions and formatting specs:

```python
price = 1234.5678
print(f"Price: ${price:.2f}")      # Price: $1234.57
print(f"{age * 2 = }")                # age * 2 = 40   (self-documenting debug syntax)
print(f"{'yes' if age >= 18 else 'no'}")   # inline conditional
```

### String Immutability and Performance

Since strings are immutable, repeatedly concatenating in a loop creates a new string every single time: wasteful for large loops:

```python
# ❌ Slow for many iterations: creates a new string each time
result = ""
for word in words:
    result += word + " "

# ✅ Fast: build a list, join once at the end
result = " ".join(words)
```

### Encoding Basics

Text you see is Unicode characters; text stored/transmitted (files, network, HTTP) is **bytes**. Converting between them is **encoding** (str → bytes) and **decoding** (bytes → str).

```python
text = "hello"
encoded = text.encode("utf-8")     # b'hello'  <- bytes object
decoded = encoded.decode("utf-8")   # 'hello'  <- back to str

# non-ASCII example
text = "café"
print(text.encode("utf-8"))    # b'caf\xc3\xa9' : é takes 2 bytes in UTF-8
```

`utf-8` is the standard modern default: use it unless you have a specific reason not to.

### Example

```python
log_line = "  2026-08-11 14:32:01 | ERROR | login failed for user admin  "

cleaned = log_line.strip()
parts = cleaned.split(" | ")

timestamp, level, message = parts
print(f"[{level}] {message} (at {timestamp})")
```

### Explanation

1. `.strip()` removes the extra whitespace on both ends.
2. `.split(" | ")` breaks the line into 3 pieces wherever `" | "` appears.
3. We unpack the 3-element list directly into 3 named variables: this only works if the list has _exactly_ 3 items, or Python raises a `ValueError`.
4. The f-string reassembles it in a cleaner format.

### Common Mistakes

```python
# ❌ Trying to mutate a string in place
s = "hello"
s[0] = "H"   # TypeError

# ❌ Building strings in a loop with +=
result = ""
for x in big_list:
    result += str(x)   # slow for large lists

# ❌ Forgetting split() returns a list, not separate variables
parts = "a,b,c".split(",")
a, b = parts   # ❌ ValueError: too many values to unpack (expected 2)

# ❌ Mixing up .strip() with .replace()
"  hi  ".strip("h")   # doesn't do what you'd guess: strip() removes CHARACTERS from ends, not substrings
```

### Best Practice

- Use f-strings for almost everything.
- Use `"".join(list_of_strings)` instead of repeated `+=` in loops.
- Use raw strings (`r"..."`) for Windows paths and regex patterns (Chapter 20) to avoid backslash escaping headaches.
- Default to `utf-8` encoding explicitly rather than relying on system defaults.

### Practice

- 🟢 Given `"Python Is Awesome"`, produce `"python_is_awesome"` using string methods.
- 🟢 Use an f-string to print a float rounded to 3 decimal places.
- 🟡 Given a comma-separated string of numbers `"4,8,15,16,23,42"`, split it and compute the sum as integers.

### Mini Challenge

🟠 Write a function `is_palindrome(text: str) -> bool` that checks if a string reads the same forwards and backwards, ignoring case, spaces, and punctuation (so `"A man, a plan, a canal: Panama"` should return `True`).

### Exam Question

- Why does `s[0] = "H"` fail on a string but work on a list?
- Why is `"".join(list)` preferred over `+=` in a loop for building large strings?
- What's the difference between encoding and decoding?

---

## 08. Modules and Packages

### Concept

A **module** is just a `.py` file. A **package** is a folder of modules (with an `__init__.py` marking it as importable). `import` is how you use code from one file in another.

### Why?

Real programs are never one file. Splitting code into modules keeps things organized, reusable, and testable in isolation. Understanding the import system also prevents a whole category of confusing "why can't Python find my module" errors.

### `import` Basics

```python
import math
print(math.sqrt(16))   # 4.0

from math import sqrt
print(sqrt(16))          # 4.0: no "math." prefix needed now

from math import sqrt as square_root
print(square_root(16))

import math as m
print(m.sqrt(16))
```

```python
# ❌ Avoid: pollutes your namespace, makes it unclear where names come from
from math import *
```

### `__name__` and `if __name__ == "__main__":`

Every module has a built-in variable `__name__`. When you run a file directly, Python sets `__name__` to `"__main__"`. When that same file is _imported_ by another file, `__name__` is set to the module's actual name instead.

```python
# tools.py
def helper():
    return "helping"

if __name__ == "__main__":
    print("Running tools.py directly")
    print(helper())
```

```bash
python3 tools.py
# Running tools.py directly
# helping
```

```python
# main.py
import tools
print(tools.helper())   # "helping": but "Running tools.py directly" does NOT print,
                          # because __name__ is "tools", not "__main__", when imported
```

This pattern lets a file work both as a standalone script _and_ as an importable module: extremely common in real Python projects, including test scripts and CLI tools.

### Packages

```text
myproject/
├── main.py
└── mypackage/
    ├── __init__.py
    ├── utils.py
    └── models.py
```

```python
# main.py
from mypackage import utils
from mypackage.models import User
```

`__init__.py` marks a folder as a package. It can be empty, or it can control what gets exposed when someone does `from mypackage import *`, or run setup code for the package.

### Absolute vs Relative Imports

```python
# absolute import: full path from the project root
from mypackage.utils import helper

# relative import: relative to the CURRENT module's location (only valid inside a package)
from .utils import helper        # same folder
from ..otherpackage import thing  # one folder up
```

**Best practice: prefer absolute imports.** They're clearer, and they don't break as easily when files get moved around. Relative imports are common inside large packages but can get confusing fast.

### Circular Imports

```python
# a.py
import b
def func_a():
    return b.func_b()

# b.py
import a          # ❌ circular! a imports b, b imports a
def func_b():
    return a.func_a()
```

This raises an `ImportError` (or partial-import weirdness) because Python can't fully finish loading `a` before it's asked to load `b`, which itself needs `a`. Fixes:

- Restructure so shared logic lives in a third module both import.
- Move the import inside the function (delays it until call time: works, but is usually a sign of a design problem).

### Example

```python
# stringutils.py
def shout(text: str) -> str:
    return text.upper() + "!"

if __name__ == "__main__":
    print(shout("test"))   # only runs when executed directly
```

```python
# main.py
from stringutils import shout

print(shout("hello"))   # HELLO!
```

### Explanation

1. `stringutils.py` defines one function and a self-test block guarded by `__name__ == "__main__"`.
2. `main.py` imports just the `shout` function directly, so it can call `shout(...)` without a prefix.
3. Running `python3 stringutils.py` alone triggers the self-test. Running `python3 main.py` does not: it only uses `shout` as a library function.

### Common Mistakes

```python
# ❌ from module import *  (unclear where names came from, risk of name collisions)
from math import *
from mymodule import *
print(sqrt(4))   # whose sqrt is this??

# ❌ Missing __init__.py (older Python versions require it; even in 3.3+ "namespace packages"
#     it's still best practice to include one for clarity)

# ❌ Circular imports from tightly coupled modules

# ❌ Naming your own file the same as a standard library module
# e.g. creating "random.py" in your project shadows the real `random` module
```

### Best Practice

- Import only what you need: `from module import specific_thing`.
- Never name your own files the same as standard library modules.
- Keep `if __name__ == "__main__":` blocks for scripts you might also import.
- Prefer absolute imports within a project.

### Practice

- 🟢 Create two files: `mathutils.py` with a function `square(n)`, and `main.py` that imports and uses it.
- 🟢 Add an `if __name__ == "__main__":` self-test block to `mathutils.py` that prints `square(5)`.
- 🟡 Create a small package `shapes/` with `__init__.py`, `circle.py`, and `square.py`, and import both from a `main.py` at the project root.

### Mini Challenge

🟡 Deliberately create a circular import between two files, run it, read the actual error Python gives you, and then fix it by moving the shared function into a third module.

### Exam Question

- What does `if __name__ == "__main__":` actually check, and why is it useful?
- Why is `from module import *` discouraged?
- What causes a circular import, and name one way to fix it?

---

## 09. File Handling

### Concept

Reading and writing files lets your programs persist data beyond a single run: configs, logs, exported data, and more.

### Why?

Nearly every real program touches the filesystem eventually. Doing it safely (closing files properly, handling missing files, using the right mode) prevents data loss and resource leaks.

### `open()`: the classic way

```python
file = open("notes.txt", "r")
content = file.read()
file.close()   # must remember to close, or risk resource leaks / unflushed writes
```

**Better: use `with`, which closes the file automatically, even if an error happens inside the block:**

```python
with open("notes.txt", "r") as file:
    content = file.read()
# file is automatically closed here, guaranteed
```

(`with` is a **context manager**: the full mechanics are in Chapter 14; for now, just know it's the standard, correct way to handle files.)

### File Modes

```python
"r"    # read (default): file must exist
"w"    # write: CREATES the file if missing, OVERWRITES if it exists (careful!)
"a"    # append: adds to the end, creates if missing
"x"    # exclusive create: fails if the file already exists
"rb"   # read binary
"wb"   # write binary
```

### Reading

```python
with open("notes.txt") as f:
    content = f.read()          # whole file as one string

with open("notes.txt") as f:
    lines = f.readlines()        # list of lines, each ending with \n

with open("notes.txt") as f:
    for line in f:                 # ✅ best practice for large files: reads one line at a time
        print(line.strip())
```

Looping directly over the file object is preferred for large files because it doesn't load the whole thing into memory at once.

### Writing and Appending

```python
with open("notes.txt", "w") as f:
    f.write("First line\n")
    f.write("Second line\n")

with open("notes.txt", "a") as f:
    f.write("Appended line\n")
```

### `pathlib`: the modern way to handle paths

```python
from pathlib import Path

path = Path("data") / "notes.txt"       # cross-platform path joining, no manual "/" or "\"
print(path.exists())                       # True/False
print(path.name)                             # "notes.txt"
print(path.suffix)                             # ".txt"
print(path.parent)                               # Path("data")

path.write_text("hello\n")                          # write, shorthand: opens & closes for you
content = path.read_text()                            # read, shorthand

for file in Path(".").glob("*.py"):                     # find files matching a pattern
    print(file)

Path("output_dir").mkdir(exist_ok=True)                   # create a directory safely
```

### Why `pathlib` over manual string paths

```python
# ❌ Old style: error-prone, not cross-platform
path = "data" + "/" + "notes.txt"     # breaks on Windows (\ vs /)

# ✅ pathlib: correct on every OS automatically
path = Path("data") / "notes.txt"
```

`pathlib` also gives you a rich, readable object instead of a plain string: `.exists()`, `.is_file()`, `.stem`, `.suffix`, and more, all without manual string slicing.

### Binary Files and Encoding

```python
with open("image.png", "rb") as f:
    data = f.read()   # bytes, not str

with open("notes.txt", "r", encoding="utf-8") as f:
    content = f.read()   # be explicit about encoding: don't rely on OS defaults
```

### Temporary Files

```python
import tempfile

with tempfile.NamedTemporaryFile(mode="w", delete=True) as tmp:
    tmp.write("scratch data")
    tmp.flush()
    print(tmp.name)
# file is deleted automatically when the block exits
```

Useful for scratch data you don't want to clutter the filesystem with, especially in tools and tests.

### Example

```python
from pathlib import Path

log_path = Path("app.log")

def log_event(message: str) -> None:
    with log_path.open("a", encoding="utf-8") as f:
        f.write(message + "\n")

log_event("Server started")
log_event("User admin logged in")

print(log_path.read_text())
```

### Explanation

1. `log_path` is a `Path` object pointing to `app.log`, relative to the current directory.
2. `log_path.open("a", ...)` opens it in append mode using the `Path` object's own `.open()` method (equivalent to `open(log_path, "a")`).
3. Each call to `log_event` appends one line, then the `with` block closes the file.
4. `log_path.read_text()` reads the entire accumulated log at the end, as a shorthand.

### Common Mistakes

```python
# ❌ Forgetting to close a file
f = open("data.txt")
content = f.read()
# f never closed: leaks a file handle

# ❌ Using "w" when you meant "a": silently destroys existing content
with open("important.txt", "w") as f:   # this WIPES the file first!
    f.write("oops")

# ❌ Not specifying encoding: can behave differently across systems
with open("data.txt") as f:   # relies on OS default encoding
    ...

# ❌ Manual path string concatenation instead of pathlib
path = folder + "/" + filename   # breaks on Windows
```

### Best Practice

- Always use `with` for files: never call `.close()` manually if you can avoid it.
- Use `pathlib.Path` instead of raw strings for paths.
- Be explicit with `encoding="utf-8"`.
- Double-check `"w"` vs `"a"` before writing: `"w"` destroys existing content immediately, with no confirmation.

### Practice

- 🟢 Write a program that writes 3 lines to a file, then reads and prints them back.
- 🟢 Use `pathlib` to check whether a file exists before trying to read it, and print a friendly message if it doesn't.
- 🟡 Write a function `count_lines(path: Path) -> int` that returns how many lines are in a text file, without loading the whole file into memory at once.

### Mini Challenge

🟠 Write a small "log analyzer": read a text file where each line looks like `2026-08-11 | ERROR | message here`, and print a count of how many lines had each log level (`ERROR`, `INFO`, `WARNING`). (This connects directly to Chapter 21's Real-World Projects list: you'll build a fuller version there.)

### Exam Question

- Why is `with open(...) as f:` preferred over manually calling `.close()`?
- What's the danger of opening a file in `"w"` mode by mistake?
- Name two advantages of `pathlib.Path` over manually building path strings.

---

## 10. Error Handling

### Concept

Errors ("exceptions") are Python's way of signaling that something went wrong while running. `try`/`except` lets you catch those errors and decide what to do instead of letting the whole program crash.

### Why?

Real programs deal with things outside their control: missing files, bad user input, network failures, unexpected data. Good error handling is the difference between a program that fails gracefully with a clear message, and one that crashes with a wall of confusing traceback text (or worse: fails silently and corrupts data).

### `try` / `except`

```python
try:
    age = int(input("Enter your age: "))
except ValueError:
    print("That's not a valid number.")
```

1. Python runs the `try` block.
2. If an exception happens, Python stops the `try` block immediately and jumps to a matching `except`.
3. If no exception happens, all `except` blocks are skipped entirely.

### Catching Specific Exceptions

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Can't divide by zero")
except ValueError:
    print("Invalid value")
```

**Best practice: catch the most specific exception you can.** A bare `except:` (or `except Exception:`) catches _everything_, including bugs you didn't anticipate, which can hide real problems.

```python
# ❌ Dangerous: silently swallows ALL errors, including typos and bugs
try:
    do_something()
except:
    pass

# ✅ Specific and honest about what you expect to go wrong
try:
    do_something()
except FileNotFoundError:
    print("File missing, using defaults")
```

### `else` and `finally`

```python
try:
    file = open("data.txt")
except FileNotFoundError:
    print("File not found")
else:
    print("File opened successfully")    # runs ONLY if no exception happened
    file.close()
finally:
    print("Done attempting to open file")  # ALWAYS runs, error or not
```

- `else`: runs only if the `try` block succeeded with no exception.
- `finally`: always runs, whether there was an exception or not (great for cleanup, though `with` usually handles this more cleanly for files/resources: Chapter 14).

### `raise`

You can trigger exceptions yourself:

```python
def withdraw(balance: float, amount: float) -> float:
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount
```

### Custom Exceptions

```python
class InsufficientFundsError(Exception):
    """Raised when a withdrawal exceeds the available balance."""
    pass

def withdraw(balance: float, amount: float) -> float:
    if amount > balance:
        raise InsufficientFundsError(f"Tried to withdraw {amount}, only {balance} available")
    return balance - amount

try:
    withdraw(100, 150)
except InsufficientFundsError as e:
    print(f"Transaction failed: {e}")
```

Custom exceptions make your error handling _self-documenting_: `except InsufficientFundsError` tells the reader exactly what went wrong, unlike a generic `ValueError` that could mean a hundred different things in a large codebase.

### `Exception` vs `BaseException`

```text
BaseException
├── SystemExit
├── KeyboardInterrupt
└── Exception
    ├── ValueError
    ├── TypeError
    ├── KeyError
    ├── FileNotFoundError
    └── ... (your custom exceptions typically go here)
```

**Always inherit custom exceptions from `Exception`, not `BaseException`.** `BaseException` includes things like `KeyboardInterrupt` (Ctrl+C) and `SystemExit`, which you almost never want to accidentally catch: catching `Exception` (not `BaseException`) lets those pass through normally.

### Exception Chaining

```python
def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            return parse(f.read())
    except FileNotFoundError as exc:
        raise RuntimeError(f"Could not load config from {path}") from exc
```

`raise ... from exc` preserves the **original** exception as context, so when this error is printed, you see both: "this is what ultimately failed" _and_ "here's the underlying cause that triggered it." Without `from exc`, Python still shows the original error during an active `except` block, but being explicit makes the _intentional_ re-raising clear versus an _accidental_ new error happening inside the `except` block.

### Good vs Bad Exception Handling

```python
# ❌ Bad: catches everything, hides real bugs, gives no useful info
try:
    process_data(data)
except:
    print("Something went wrong")

# ❌ Bad: catches an exception just to immediately re-raise it, adds nothing
try:
    process_data(data)
except Exception as e:
    raise e

# ✅ Good: specific, informative, only handles what you actually expect
try:
    process_data(data)
except KeyError as e:
    print(f"Missing required field: {e}")
except ValueError as e:
    print(f"Invalid data format: {e}")
```

### Example

```python
class InvalidAgeError(Exception):
    """Raised when an age value is outside a realistic range."""
    pass

def validate_age(raw_age: str) -> int:
    try:
        age = int(raw_age)
    except ValueError as exc:
        raise InvalidAgeError(f"'{raw_age}' is not a number") from exc

    if not (0 <= age <= 120):
        raise InvalidAgeError(f"{age} is not a realistic age")

    return age

for test_value in ["25", "abc", "-5", "200"]:
    try:
        print(f"{test_value} -> {validate_age(test_value)}")
    except InvalidAgeError as e:
        print(f"{test_value} -> REJECTED: {e}")
```

### Explanation

1. `InvalidAgeError` is a custom exception representing exactly one thing: a bad age value.
2. Inside `validate_age`, a `ValueError` from `int()` is caught and re-raised as our more meaningful `InvalidAgeError`, chained with `from exc` to preserve the original cause.
3. A second check validates the _range_, raising the same custom exception for a different reason.
4. The loop tries each test value and prints either the valid result or a clear rejection message: no crash, no raw traceback shown to the "user."

### Common Mistakes

```python
# ❌ Bare except
try:
    risky()
except:
    pass

# ❌ Catching Exception too broadly when specific exceptions are known
try:
    int(user_input)
except Exception:   # should be except ValueError
    ...

# ❌ Using exceptions for normal control flow when a simple if would do
try:
    value = my_dict["key"]
except KeyError:
    value = default
# often clearer as:
value = my_dict.get("key", default)

# ❌ Silently swallowing errors that should be logged or surfaced
except Exception:
    pass   # the error just... vanishes, with no trace
```

### Best Practice

- Catch the narrowest exception type that makes sense.
- Never use a bare `except:` in real code.
- Use custom exceptions to make error handling self-documenting.
- Use `from exc` when re-raising a different exception type, to preserve the original cause.
- Reserve `try`/`except` for genuinely exceptional situations: don't use it as a substitute for a simple `if` check when one would do.

### Practice

- 🟢 Write a function that safely converts a string to an integer, catching `ValueError` and returning `None` on failure.
- 🟢 Write a `try`/`except`/`else`/`finally` block that opens a file, and demonstrate all four sections actually running (with a real and a missing file).
- 🟡 Create a custom exception `NegativeValueError` and raise it from a function that computes a square root, if given a negative number.

### Mini Challenge

🟠 Write a small CLI calculator that reads two numbers and an operator from `input()` in a loop, handling `ZeroDivisionError`, `ValueError` (bad number format), and an unsupported-operator case with a custom exception: without ever crashing the program, no matter what the user types.

### Exam Question

- Why is a bare `except:` considered bad practice?
- What's the difference in _when_ `else` and `finally` run, relative to the `try` block?
- Why should custom exceptions inherit from `Exception` rather than `BaseException`?

---

## 11. Object-Oriented Programming

### Concept

A **class** is a blueprint for creating **objects**: bundles of data (**attributes**) and behavior (**methods**) that belong together.

### Why?

OOP models real-world "things" naturally: a `User`, a `BankAccount`, a `Socket`. It lets you group related data and logic instead of passing loose variables between unrelated functions, and it's the foundation almost every framework and library you'll use is built on.

### Class, Object, `__init__`, `self`

```python
class User:
    def __init__(self, name: str, age: int) -> None:
        self.name = name     # instance attribute
        self.age = age

    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

lichi = User("Lichi", 20)     # lichi is an OBJECT (an "instance" of User)
print(lichi.greet())           # Hi, I'm Lichi
```

- `class User:` defines the blueprint.
- `__init__` is the **constructor**: runs automatically when you create a new object, to set up its initial state.
- `self` refers to _this specific object_. Every regular method takes `self` as its first parameter, and Python passes it in automatically: `lichi.greet()` is really `User.greet(lichi)` under the hood.

### Instance vs Class Variables

```python
class User:
    total_users = 0            # CLASS variable: shared by ALL instances

    def __init__(self, name: str) -> None:
        self.name = name         # INSTANCE variable: unique per object
        User.total_users += 1

a = User("A")
b = User("B")
print(User.total_users)   # 2: shared across every instance
```

Mutable class variables are a classic trap for the same reason as mutable default arguments (Chapter 05):

```python
class Team:
    members = []   # ❌ shared by every Team instance!

t1 = Team()
t2 = Team()
t1.members.append("Lichi")
print(t2.members)   # ['Lichi']: surprise, they share the SAME list
```

### Instance, Class, and Static Methods

```python
class Circle:
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def area(self) -> float:                  # instance method: needs self
        return 3.14159 * self.radius ** 2

    @classmethod
    def from_diameter(cls, diameter: float) -> "Circle":   # gets the CLASS, not an instance
        return cls(diameter / 2)

    @staticmethod
    def is_valid_radius(radius: float) -> bool:              # gets NEITHER self nor cls
        return radius > 0

c = Circle.from_diameter(10)
print(c.area())
print(Circle.is_valid_radius(-5))   # False
```

- **Instance method**: operates on one specific object (`self`).
- **Class method** (`@classmethod`): operates on the class itself; commonly used as an alternative constructor (`from_diameter`).
- **Static method** (`@staticmethod`): doesn't need the instance _or_ the class: it's just a related utility function grouped inside the class for organization.

### Inheritance

```python
class Animal:
    def __init__(self, name: str) -> None:
        self.name = name

    def speak(self) -> str:
        return "..."

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} says Meow!"

for animal in [Dog("Rex"), Cat("Tom")]:
    print(animal.speak())
```

`Dog` and `Cat` **inherit** from `Animal`: they automatically get `__init__` and can override `speak()` with their own version. This overriding is **polymorphism**: the same method name (`speak`) behaves differently depending on the actual object's type.

### Composition (vs Inheritance)

```python
class Engine:
    def start(self) -> str:
        return "Engine started"

class Car:
    def __init__(self) -> None:
        self.engine = Engine()   # Car HAS-AN Engine (composition), not IS-AN Engine

    def start(self) -> str:
        return self.engine.start()
```

**"Favor composition over inheritance"** is a well-known guideline: use inheritance for genuine **is-a** relationships (`Dog` _is an_ `Animal`), and composition for **has-a** relationships (`Car` _has an_ `Engine`). Overusing inheritance leads to fragile, deeply nested class hierarchies that are hard to change.

### Encapsulation

```python
class BankAccount:
    def __init__(self, balance: float) -> None:
        self._balance = balance          # "protected": convention only, not enforced
        self.__pin = "1234"                # "private": name-mangled, harder to access accidentally

account = BankAccount(100)
print(account._balance)     # works: Python doesn't truly enforce "protected"
# print(account.__pin)       # AttributeError: name mangling makes this awkward on purpose
```

Python doesn't have true private attributes like some languages. A single leading underscore (`_balance`) is a _convention_ meaning "internal, don't touch from outside." A double leading underscore (`__pin`) triggers **name mangling** (it becomes `_BankAccount__pin` internally), which discourages accidental external access but doesn't make it impossible.

### `@property`

```python
class BankAccount:
    def __init__(self, balance: float) -> None:
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Balance can't be negative")
        self._balance = value

account = BankAccount(100)
print(account.balance)     # 100: called like an attribute, not a method (no parentheses!)
account.balance = 50        # runs the setter, validates before assigning
# account.balance = -10       # raises ValueError
```

`@property` lets you add validation/logic to attribute access while keeping the clean `object.attribute` syntax: callers never need to know it's actually running code.

### `@dataclass`: modern, boilerplate-free classes

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)          # Point(x=1.0, y=2.0)  <- auto-generated __repr__
print(p1 == p2)      # True: auto-generated __eq__ compares field values
```

`@dataclass` automatically generates `__init__`, `__repr__`, and `__eq__` for you based on the type-hinted fields: no more writing that boilerplate by hand. Use it for classes that are mainly structured data (like `Point`, `User`, `Config`), and write a regular class when there's substantial custom behavior.

### Important Dunder ("magic") Methods

```python
class Point:
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    def __str__(self) -> str:                 # user-friendly display, used by print()/str()
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:                  # unambiguous, developer-facing display
        return f"Point(x={self.x}, y={self.y})"

    def __eq__(self, other: object) -> bool:       # defines what == means for this class
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __len__(self) -> int:                        # lets len(point) work
        return 2

p = Point(1, 2)
print(p)           # calls __str__: (1, 2)
print(repr(p))       # calls __repr__: Point(x=1, y=2)
print(len(p))          # calls __len__: 2
```

Other common dunders: `__hash__` (makes objects usable as dict keys/set members: must be defined consistently with `__eq__`), `__iter__` (makes objects loopable: see Chapter 15), `__getitem__` (enables `obj[index]` syntax).

### Example

```python
from dataclasses import dataclass, field

@dataclass
class Task:
    title: str
    done: bool = False

class TodoList:
    def __init__(self) -> None:
        self._tasks: list[Task] = []

    def add(self, title: str) -> None:
        self._tasks.append(Task(title))

    def complete(self, title: str) -> None:
        for task in self._tasks:
            if task.title == title:
                task.done = True
                return
        raise ValueError(f"No task named {title!r}")

    @property
    def pending(self) -> list[Task]:
        return [t for t in self._tasks if not t.done]

todo = TodoList()
todo.add("Write report")
todo.add("Review PR")
todo.complete("Write report")
print(todo.pending)   # [Task(title='Review PR', done=False)]
```

### Explanation

1. `Task` is a `@dataclass`: pure data, no custom behavior needed.
2. `TodoList` is a regular class that _contains_ a list of `Task` objects (composition).
3. `add` and `complete` are instance methods that mutate the internal `_tasks` list.
4. `pending` is a `@property`: callers read `todo.pending` like an attribute, but it's actually computed fresh each time from `_tasks`.

### Common Mistakes

```python
# ❌ Mutable class variable shared across instances
class Team:
    members = []

# ❌ Forgetting self
class Dog:
    def bark():        # missing self!
        return "Woof"

# ❌ Comparing dataclass-like objects without __eq__ on a regular class
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

print(Point(1, 2) == Point(1, 2))   # False! Regular classes compare by identity by default

# ❌ Overusing inheritance for "has-a" relationships that should be composition
```

### Best Practice

- Use `@dataclass` for simple data-holding classes.
- Use `@property` instead of plain getter/setter methods (`get_balance()`/`set_balance()`): it keeps the clean attribute syntax while still allowing validation.
- Favor composition over inheritance unless there's a genuine is-a relationship.
- Define `__repr__` on classes you'll debug often: it makes `print()` and debuggers far more useful.

### Practice

- 🟢 Create a `Rectangle` class with `width` and `height`, and a method `area()`.
- 🟢 Convert your `Rectangle` class into a `@dataclass` and compare the code.
- 🟡 Add a `@property` called `is_square` to `Rectangle` that returns `True` when `width == height`.
- 🟡 Create a base class `Shape` with an `area()` method that raises `NotImplementedError`, then subclass it with `Circle` and `Square`, each overriding `area()`.

### Mini Challenge

🟠 Build a small `Library` class that manages `Book` objects (title, author, `is_checked_out: bool`). Add methods `check_out(title)` and `return_book(title)` that raise a custom exception (Chapter 10!) if the book doesn't exist or is already in that state.

### Exam Question

- What's the difference between an instance method, a class method, and a static method?
- Why does `Point(1, 2) == Point(1, 2)` return `False` on a plain class but `True` on a `@dataclass`?
- When would you choose composition over inheritance? Give a concrete example.

---

## 12. Advanced OOP

### Concept

Beyond basic classes: multiple inheritance, abstract base classes, protocols, descriptors, `__slots__`, and metaclasses: the mechanisms that make Python's object system flexible enough to build frameworks with.

### Why?

You'll encounter all of these reading real-world (and security-tooling) codebases, even if you rarely write metaclasses yourself. Understanding what's actually happening removes the "magic" and makes advanced libraries far less intimidating.

### Multiple Inheritance and MRO

```python
class A:
    def greet(self):
        return "A"

class B:
    def greet(self):
        return "B"

class C(A, B):
    pass

print(C().greet())          # "A"
print(C.__mro__)              # (C, A, B, object): Method Resolution Order
```

When `C` inherits from both `A` and `B`, Python needs a rule for which `greet()` wins if there's a naming conflict. That rule is the **MRO (Method Resolution Order)**, computed with the **C3 linearization algorithm**: in practice, for simple cases: left-to-right, depth-first, but consistent. You can always inspect it directly with `ClassName.__mro__` or `ClassName.mro()`.

### `super()`

```python
class Animal:
    def __init__(self, name: str) -> None:
        self.name = name

class Dog(Animal):
    def __init__(self, name: str, breed: str) -> None:
        super().__init__(name)     # calls Animal.__init__ without hardcoding "Animal"
        self.breed = breed
```

`super()` calls the next class in the MRO: usually the parent, but in multiple-inheritance chains, it follows the _computed_ MRO, not necessarily the class literally written as the parent. This is what lets cooperative multiple inheritance work correctly.

### Abstract Base Classes (`abc`)

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

class Circle(Shape):
    def __init__(self, radius: float) -> None:
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

# shape = Shape()     # ❌ TypeError: Can't instantiate abstract class
circle = Circle(5)      # ✅ fine: Circle implements area()
```

An `ABC` **cannot be instantiated directly**, and any subclass **must** implement every method marked `@abstractmethod`, or it also can't be instantiated. This enforces a contract: "anything calling itself a `Shape` _must_ know how to compute its `area()`."

### Protocols: structural typing

```python
from typing import Protocol

class Speaker(Protocol):
    def speak(self) -> str: ...

class Dog:
    def speak(self) -> str:
        return "Woof"

def make_it_speak(thing: Speaker) -> str:
    return thing.speak()

make_it_speak(Dog())   # ✅ works: Dog "quacks like" a Speaker, no inheritance needed!
```

Unlike `ABC` (nominal typing: you must explicitly inherit), `Protocol` uses **structural typing**: "if it has the right methods, it counts": no inheritance relationship required. Type checkers like `mypy` understand this. This is Python's version of duck typing, made checkable.

### Descriptors

A descriptor is an object that customizes attribute access via `__get__`, `__set__`, and/or `__delete__`. `@property` is actually implemented _using_ the descriptor protocol under the hood.

```python
class PositiveNumber:
    def __set_name__(self, owner, name):
        self._name = "_" + name

    def __get__(self, instance, owner):
        return getattr(instance, self._name)

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError(f"{self._name} must be positive")
        setattr(instance, self._name, value)

class Product:
    price = PositiveNumber()    # reusable validation, without repeating @property everywhere

    def __init__(self, price: float) -> None:
        self.price = price

p = Product(10)
# p.price = -5   # ValueError
```

Descriptors let you write validation/behavior **once** and reuse it across many attributes/classes: `@property` only handles one attribute per class.

### `__slots__`

```python
class Point:
    __slots__ = ("x", "y")     # only these attributes are allowed: nothing else

    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

p = Point(1, 2)
# p.z = 3   # ❌ AttributeError: not in __slots__
```

By default, every instance has a hidden `__dict__` for storing attributes, which uses more memory. `__slots__` tells Python to allocate a fixed, smaller structure instead, which is faster and uses less memory: meaningful when creating _millions_ of small objects. Trade-off: you lose the flexibility of adding arbitrary attributes later, and multiple inheritance with slots gets tricky.

### Metaclasses (explained simply, not as magic)

A class is itself an object: and the "class of a class" is its **metaclass**. By default, every class's metaclass is `type`.

```python
print(type(3))          # <class 'int'>
print(type(int))          # <class 'type'> : int itself is an instance of `type`!
print(type(str))            # <class 'type'>
```

A metaclass lets you customize **how classes themselves get created**: the same way a class customizes how instances get created.

```python
class Meta(type):
    def __new__(mcs, name, bases, namespace):
        print(f"Creating class: {name}")
        return super().__new__(mcs, name, bases, namespace)

class MyClass(metaclass=Meta):
    pass
# prints: Creating class: MyClass
```

**In plain terms:** just like `__init__` runs when you create an _instance_ of a class, a metaclass's `__new__`/`__init__` runs when Python creates the _class itself_, at the moment the `class` statement executes. This is genuinely rare to need: frameworks like Django's ORM use it to auto-register model fields: but recognizing the pattern (`class Foo(metaclass=Bar)`) when you see it in a library is valuable, even if you rarely write one yourself.

### Example

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount: float) -> str: ...

class CreditCard(PaymentMethod):
    def __init__(self, last_four: str) -> None:
        self.last_four = last_four

    def pay(self, amount: float) -> str:
        return f"Charged ${amount} to card ending in {self.last_four}"

class UPI(PaymentMethod):
    def __init__(self, upi_id: str) -> None:
        self.upi_id = upi_id

    def pay(self, amount: float) -> str:
        return f"Paid ${amount} via UPI ({self.upi_id})"

def checkout(method: PaymentMethod, amount: float) -> None:
    print(method.pay(amount))

for method in [CreditCard("4242"), UPI("lichi@upi")]:
    checkout(method, 49.99)
```

### Explanation

1. `PaymentMethod` is an `ABC`: it defines _what every payment method must be able to do_ (`pay`), without saying _how_.
2. `CreditCard` and `UPI` each implement `pay()` differently.
3. `checkout()` doesn't care which concrete type it gets: it only relies on the `PaymentMethod` contract. This is polymorphism enforced by an abstract base class.

### Common Mistakes

```python
# ❌ Trying to instantiate an ABC directly
shape = Shape()   # TypeError

# ❌ Forgetting to implement all abstract methods
class Circle(Shape):
    pass   # TypeError at instantiation: area() never implemented

# ❌ Assuming __slots__ saves memory even with inheritance from a non-slotted class
class Base:
    pass   # no __slots__ here

class Derived(Base):
    __slots__ = ("x",)   # still gets a __dict__ from Base: slots didn't help!

# ❌ Reaching for a metaclass when a simpler decorator or __init_subclass__ would do
```

### Best Practice

- Use `ABC` when subclasses _must_ implement specific behavior.
- Use `Protocol` when you want flexible, structural typing without forcing inheritance.
- Reach for `__slots__` only when memory/performance actually matters (many instances).
- Avoid metaclasses unless you're building a framework-level tool: 99% of problems have a simpler solution (a decorator, a regular base class, `__init_subclass__`).

### Practice

- 🟢 Create an `ABC` called `Vehicle` with an abstract `move()` method, and two subclasses that implement it differently.
- 🟡 Create a `Protocol` called `Drawable` with a `draw()` method, and show that a class implementing `draw()` satisfies it without inheriting from `Drawable`.
- 🟡 Add `__slots__` to a simple class and confirm (by trying to set an undeclared attribute) that it actually restricts attributes.

### Mini Challenge

🔴 Write a descriptor class `Validated` that takes a validation function in its `__init__` (e.g. `lambda x: x > 0`) and can be reused across multiple attributes on multiple classes, raising `ValueError` with a clear message when validation fails.

### Exam Question

- What problem does MRO solve, and what determines the order?
- What's the practical difference between an `ABC` and a `Protocol`?
- In your own words, what does a metaclass actually control?

---

## 13. Type Hints: Deep Section

### Concept

Type hints let you annotate what type a variable, parameter, or return value is _expected_ to be. Python doesn't enforce them at runtime: but external tools (`mypy`, `pyright`) and your editor use them to catch bugs before you ever run the code.

### Why?

On a small script, types feel like overhead. On anything bigger: the kind of tooling you'll build for security work: types turn "which shape of data does this function actually want" from a guessing game (or a dig through the code) into something your editor tells you instantly. They're also essentially required for professional Python codebases today.

### Basics

```python
x: int = 5
name: str = "Lichi"
is_valid: bool = True
```

### Modern Generic Syntax (Python 3.9+)

```python
numbers: list[int] = [1, 2, 3]
scores: dict[str, int] = {"Lichi": 90}
point: tuple[int, str] = (1, "x")
unique: set[str] = {"a", "b"}
```

### `list[int]` vs `List[int]`

```python
# ✅ Modern (Python 3.9+): use built-in generics directly
def process(items: list[int]) -> None: ...

# Old style (still valid, needed pre-3.9): required importing from typing
from typing import List
def process(items: List[int]) -> None: ...
```

Modern Python prefers `list[int]` because it needs no import, is one less thing to remember, and the standard library moved toward making built-in types directly usable as generics (PEP 585). You'll still see `List`, `Dict`, etc. constantly in older codebases: recognize both, write the modern form.

### Optional Values: `str | None`

```python
def find_user(user_id: int) -> str | None:
    ...

# Older equivalent (still common in code targeting <3.10, or older style)
from typing import Optional
def find_user(user_id: int) -> Optional[str]:
    ...
```

`str | None` (PEP 604, Python 3.10+) reads naturally: "a string, or nothing." `Optional[str]` means exactly the same thing, just older syntax.

### `Callable`

```python
from typing import Callable

def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

apply(lambda x, y: x + y, 3, 4)   # 7
```

`Callable[[int, int], int]` means "a function that takes two `int`s and returns an `int`."

### `TypeVar` and `Generic`

```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

first([1, 2, 3])          # inferred as int
first(["a", "b"])           # inferred as str
```

`TypeVar` lets a function or class be generic: "works for _some_ type `T`, and whatever `T` is, the return type matches it." Without it, `first(items: list) -> object` would technically work but lose all the useful type information for the caller.

```python
from typing import Generic, TypeVar

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

int_stack: Stack[int] = Stack()
int_stack.push(5)
```

### `Protocol`, `TypedDict`, `Literal`, `Final`, `ClassVar`, `Self`

```python
from typing import Protocol, TypedDict, Literal, Final, ClassVar, Self

class Comparable(Protocol):               # structural typing (Chapter 12)
    def __lt__(self, other) -> bool: ...

class UserDict(TypedDict):                   # a dict with a FIXED, known shape
    name: str
    age: int

user: UserDict = {"name": "Lichi", "age": 20}   # type checker verifies the shape

Status = Literal["pending", "active", "closed"]     # only these exact string values allowed

def set_status(status: Status) -> None: ...
set_status("active")     # ✅
# set_status("done")       # ❌ mypy error: not one of the allowed literals

MAX_RETRIES: Final = 3    # type checker will error if you try to reassign MAX_RETRIES

class Config:
    instance_count: ClassVar[int] = 0    # marks this as a class variable, not instance

class Builder:
    def set_name(self, name: str) -> Self:   # returns "this exact class", enabling chaining
        self.name = name
        return self
```

- **`Protocol`**: structural interfaces (Chapter 12).
- **`TypedDict`**: a dict with a fixed, checkable set of keys/types (great for JSON-shaped config or API payloads).
- **`Literal`**: restricts a value to a specific fixed set of literals (very useful for "modes" or "statuses").
- **`Final`**: marks something that shouldn't be reassigned/overridden; checked by `mypy`, not by Python at runtime.
- **`ClassVar`**: marks an annotation as a class-level variable, not an instance attribute.
- **`Self`**: represents "the exact class this method was called on": essential for fluent/chained builder methods, especially with inheritance.

### `Any`, `Never`, `NoReturn`, `Sequence`, `Iterable`, `Iterator`

```python
from typing import Any, Never, NoReturn, Sequence, Iterable, Iterator

def process(data: Any) -> None: ...          # opts OUT of type checking entirely for this value

def fail() -> NoReturn:                        # this function never returns normally (always raises/exits)
    raise RuntimeError("always fails")

def unreachable() -> Never:                       # signals code that should be impossible to reach
    raise AssertionError("should never happen")

def total(nums: Sequence[int]) -> int:               # accepts list, tuple, or anything indexable+sized
    return sum(nums)

def process_all(items: Iterable[str]) -> None:          # accepts ANYTHING loopable: list, generator, set...
    for item in items:
        ...

def counter() -> Iterator[int]:                            # a function that yields values one at a time
    n = 0
    while True:
        yield n
        n += 1
```

### `Any` vs `object`

```python
def log_any(x: Any) -> None:
    x.whatever_method_i_want()     # type checker allows this: no checking at all

def log_object(x: object) -> None:
    # x.whatever_method_i_want()   # ❌ mypy error: object has no guaranteed methods
    print(str(x))                    # only methods every object has (like str(), repr()) are allowed
```

`Any` **disables type checking** for that value: it's an escape hatch, use it sparingly. `object` is the actual root of every type in Python and **is** type-checked: it just means "could be anything, so only assume the bare minimum."

### Type Narrowing and `isinstance()`

```python
def describe(value: int | str) -> str:
    if isinstance(value, int):
        return f"Number: {value * 2}"       # type checker KNOWS value is int here
    else:
        return f"Text: {value.upper()}"        # type checker KNOWS value is str here
```

This is **type narrowing**: type checkers track `isinstance()` (and other) checks and "narrow" the type within each branch, so you get accurate autocomplete and error checking in each path: without you doing anything extra.

### `TypeAlias`

```python
from typing import TypeAlias

UserId: TypeAlias = int
UserRecord: TypeAlias = dict[str, str | int]

def get_user(user_id: UserId) -> UserRecord: ...
```

Gives a complex or repeated type a clear, reusable name: purely for readability, no runtime effect.

### Static Type Checking Tools

```bash
pip install mypy
mypy myscript.py

# or, matching your existing tooling:
uv pip install mypy
uv run mypy myscript.py

pip install pyright
pyright myscript.py
```

`mypy` and `pyright` read your type hints and report mismatches **before you run the code**: catching an entire category of bugs (passing a `str` where an `int` was expected, forgetting a `None` check) at write-time instead of at runtime, sometimes in production.

### Example

```python
from dataclasses import dataclass
from typing import Literal

Role = Literal["admin", "member", "guest"]

@dataclass
class User:
    name: str
    role: Role
    email: str | None = None

def can_delete(user: User) -> bool:
    return user.role == "admin"

users: list[User] = [
    User("Lichi", "admin"),
    User("Guest1", "guest"),
]

for user in users:
    print(user.name, "->", can_delete(user))
```

### Explanation

1. `Role` restricts the field to exactly `"admin"`, `"member"`, or `"guest"`: a typo like `"admni"` gets caught by `mypy`, not by a crash at 3am.
2. `email: str | None = None` documents that email is optional and defaults to missing.
3. `can_delete` narrows nothing fancy here, but the return type `bool` makes the function's contract explicit for every caller.

### Common Mistakes

```python
# ❌ Using Any everywhere "to make errors go away": defeats the entire purpose
def process(data: Any) -> Any: ...

# ❌ Forgetting hints don't run: this still executes even though the type is "wrong"
def add(a: int, b: int) -> int:
    return a + b
add("x", "y")   # runs fine at runtime, returns "xy": only a type checker catches this

# ❌ Using List/Dict from typing in new code instead of list/dict
from typing import List
def f(x: List[int]) -> None: ...   # prefer list[int] in modern code

# ❌ Confusing Optional[str] with "has a default value of None": they're unrelated!
def f(name: Optional[str]) -> None: ...   # still REQUIRED, just allowed to be None
def g(name: str | None = None) -> None: ...   # optional to pass AND allowed to be None
```

### Best Practice

- Type-hint public function signatures at minimum, always.
- Use `str | None` over `Optional[str]` in new code (3.10+).
- Reach for `Any` only when you genuinely can't express the type, not as a shortcut.
- Run `mypy` (or `pyright`) in CI/pre-commit, not just locally when you remember.

### Practice

- 🟢 Add full type hints to a function that takes a `list[str]` and returns the longest string.
- 🟢 Rewrite a function using `Optional[int]` to use `int | None` instead.
- 🟡 Create a `TypedDict` called `Config` with keys `debug: bool`, `retries: int`, `base_url: str`, and a function that accepts it.
- 🟡 Write a generic `Box[T]` class using `TypeVar`/`Generic` that can hold and return any single value of type `T`.

### Mini Challenge

🟠 Install `mypy` and run it against one of your earlier chapter exercises. Deliberately introduce 3 type errors (wrong argument type, missing return, mismatched `Optional`) and read what `mypy` reports for each.

### Exam Question

- Why does `mypy` catch `add("x", "y")` as wrong when Python itself runs it without complaint?
- What's the difference between `Any` and `object`?
- What does "type narrowing" mean, and how does `isinstance()` enable it?

---

## 14. Modern Python Features

### Concept

Python has evolved fast. This chapter is a focused tour of syntax added in recent versions that you'll see constantly in modern codebases.

### Why?

Recognizing modern syntax (and knowing roughly which version introduced it) prevents confusion when you hit unfamiliar-looking code, and helps you write code that takes advantage of real improvements instead of sticking to older patterns out of habit.

### Walrus Operator `:=` (3.8+)

```python
# ❌ Without walrus: calls len() twice
data = [1, 2, 3]
if len(data) > 2:
    print(f"Big list: {len(data)}")

# ✅ With walrus: assigns AND checks in one expression
if (n := len(data)) > 2:
    print(f"Big list: {n}")
```

Lets you assign a value **as part of** an expression (like an `if` condition or a comprehension), avoiding repeated computation.

```python
# common real pattern: while reading data until exhausted
while (line := input_file.readline()):
    process(line)
```

### Structural Pattern Matching (`match`/`case`, 3.10+)

```python
def handle_command(command: str | tuple) -> str:
    match command:
        case "start":
            return "Starting..."
        case "stop":
            return "Stopping..."
        case ("move", direction) if direction in ("up", "down"):
            return f"Moving {direction}"
        case ("move", _):
            return "Invalid direction"
        case _:
            return "Unknown command"

print(handle_command("start"))              # Starting...
print(handle_command(("move", "up")))         # Moving up
```

`match` is more powerful than a chain of `if`/`elif`: it can **destructure** data (unpack tuples, check dict shapes, match class types) as part of the matching itself, not just compare simple equality. `case _:` is the catch-all, like `else`.

```python
match point:
    case (0, 0):
        print("origin")
    case (x, 0):
        print(f"on the x-axis at {x}")
    case (0, y):
        print(f"on the y-axis at {y}")
    case (x, y):
        print(f"at ({x}, {y})")
```

### `f"{value=}"` Debug Syntax (3.8+)

```python
age = 20
print(f"{age=}")            # age=20 : prints both the expression AND its value
print(f"{age * 2=}")          # age * 2=40
```

Great for quick debug prints: no need to type `print("age:", age)` manually.

### Improved Error Messages (3.10+ / 3.11+)

Since 3.10, tracebacks point more precisely at the exact sub-expression that failed (not just the whole line), and 3.11 added even more context to exception messages: a real quality-of-life improvement when debugging.

### `X | Y` Union Syntax for Types (3.10+)

Already covered in Chapter 13: `str | None` instead of `Optional[str]`, `int | str` instead of `Union[int, str]`.

### `tomllib` (3.11+): built-in TOML parsing

```python
import tomllib

with open("pyproject.toml", "rb") as f:
    config = tomllib.load(f)

print(config["project"]["name"])
```

Before 3.11, reading `.toml` files (like `pyproject.toml`) required a third-party library. Now it's built in for _reading_ (writing still needs a third-party package).

### `except*`: Exception Groups (3.11+)

```python
try:
    raise ExceptionGroup("multiple failures", [ValueError("bad value"), TypeError("bad type")])
except* ValueError as eg:
    print("Caught value errors:", eg.exceptions)
except* TypeError as eg:
    print("Caught type errors:", eg.exceptions)
```

Mainly relevant when working with `asyncio.TaskGroup` (Chapter 28), where multiple concurrent tasks can fail _simultaneously_: a single `try`/`except` can't naturally represent "several different errors happened at once," so exception groups exist to handle exactly that.

### `tomllib`/`Self`/generics recap aside: checking your version

```bash
python3 --version
```

Since your environment uses `uv`, pinning and switching versions per-project is straightforward:

```bash
uv python pin 3.12
uv run python --version
```

### Example

```python
def classify(value: int | str | list) -> str:
    match value:
        case int() if value < 0:
            return "negative number"
        case int():
            return "number"
        case str() if len(value) == 0:
            return "empty string"
        case str():
            return "text"
        case []:
            return "empty list"
        case [first, *rest]:
            return f"list starting with {first}, {len(rest)} more items"
        case _:
            return "unknown"

for v in [-5, 10, "", "hi", [], [1, 2, 3]]:
    print(v, "->", classify(v))
```

### Explanation

1. `case int() if value < 0:` matches any `int`, with an extra guard condition (`if`) narrowing it further.
2. `case [first, *rest]:` destructures a list, binding the first element and the remaining elements separately: similar spirit to `*args` unpacking, but as a pattern.
3. `case _:` is the fallback that always matches, same role as `else`.

### Common Mistakes

```python
# ❌ Forgetting the catch-all case: match falls through silently if nothing matches
match value:
    case 1:
        ...
    # no case _: → if value is 2, NOTHING happens, no error, easy to miss

# ❌ Using walrus for readability where it hurts more than helps
result = (x := compute()) if (y := check()) else (z := fallback())   # unreadable

# ❌ Assuming match is just a fancier switch statement: it's structural, not just equality
```

### Best Practice

- Use `match` when you're branching on the _shape_ or _type_ of data, not just plain value equality (a chain of `if`/`elif` is often still clearer for simple value checks).
- Always include `case _:` unless you deliberately want silent fall-through.
- Use the walrus operator to eliminate genuine duplication, not to cram multiple statements into one line.

### Practice

- 🟢 Rewrite an `if`/`elif` chain that checks a string against 4 possible commands, using `match`/`case` instead.
- 🟢 Use the walrus operator to simplify a loop that repeatedly checks `len()` of a shrinking list.
- 🟡 Write a `match` statement that destructures a `(status_code, message)` tuple and returns a friendly string for `200`, `404`, `500`, and an "unknown" fallback for everything else.

### Mini Challenge

🟡 Write a function using `match`/`case` that takes a parsed JSON-like structure (nested dicts/lists of ints and strings) and returns a one-line human-readable summary of its shape (e.g., `"list of 3 items"`, `"dict with keys: name, age"`).

### Exam Question

- What does the walrus operator actually save you from doing twice?
- Why is `match`/`case` described as "structural" rather than just a switch statement?
- What real problem do exception groups (`except*`) solve that a normal `try`/`except` can't?

---

## 15. Iterators and Generators

### Concept

An **iterable** is anything you can loop over (`list`, `str`, `dict`, ...). An **iterator** is the object that actually does the stepping, one item at a time. A **generator** is the easiest way to create an iterator, using `yield`.

### Why?

Generators let you process huge (even infinite) sequences of data using almost no memory, since values are produced one at a time, on demand: instead of building the entire sequence in memory up front. Extremely relevant for reading large log files, streaming network data, or scanning large ranges (all things you'll do in security tooling).

### `iter()` and `next()`

```python
numbers = [1, 2, 3]
it = iter(numbers)     # get an iterator FROM the iterable

print(next(it))    # 1
print(next(it))      # 2
print(next(it))        # 3
print(next(it))          # ❌ StopIteration: exhausted
```

A `for` loop is really just this pattern automated: it repeatedly calls `next()` on an iterator until it catches `StopIteration`, then stops cleanly.

### Generator Functions and `yield`

```python
def count_up_to(n: int):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(5):
    print(num)   # 1 2 3 4 5
```

`yield` is what makes this a generator function instead of a regular one. Calling `count_up_to(5)` doesn't run the body at all yet: it returns a **generator object**. Each call to `next()` (or each loop iteration) runs the function _up to the next `yield`_, pauses there, and remembers exactly where it left off for next time.

```python
gen = count_up_to(3)
print(gen)           # <generator object count_up_to at 0x...>
print(next(gen))       # 1 : runs until the first yield
print(next(gen))         # 2 : resumes right after the yield, runs to the next one
```

### Generator Expressions

Like a list comprehension, but lazy: built with `()` instead of `[]`:

```python
squares_list = [x * x for x in range(1000000)]     # builds ALL 1,000,000 values in memory NOW
squares_gen = (x * x for x in range(1000000))         # builds NOTHING yet: values computed on demand

print(sum(squares_gen))   # values are generated one at a time as sum() consumes them
```

### `yield from`

```python
def inner():
    yield 1
    yield 2

def outer():
    yield from inner()    # delegates to inner()'s values directly
    yield 3

print(list(outer()))   # [1, 2, 3]
```

`yield from` flattens a nested generator delegation: without it, you'd have to manually loop and re-yield each value from `inner()`.

### Memory Efficiency: `list` vs Generator

```python
# ❌ Loads all 10 million numbers into memory at once
big_list = [x for x in range(10_000_000)]

# ✅ Never holds more than one number in memory at a time
big_gen = (x for x in range(10_000_000))
```

```text
list:      [1][2][3][4][5]...[10,000,000]   <- all in memory simultaneously
generator: (•)  produces 1, then 2, then 3, ... one at a time, on request
```

The trade-off: a generator can only be iterated **once** (it's exhausted after use), while a list can be looped over repeatedly and indexed directly. Use a generator when you're processing a stream once, front to back; use a list when you need to reuse, index, or measure the length of the data.

### Example

```python
def read_large_file_lines(path: str):
    """Yields one stripped, non-empty line at a time: never loads the whole file."""
    with open(path) as f:
        for line in f:
            stripped = line.strip()
            if stripped:
                yield stripped

def count_error_lines(path: str) -> int:
    return sum(1 for line in read_large_file_lines(path) if "ERROR" in line)
```

### Explanation

1. `read_large_file_lines` is a generator function: it processes the file one line at a time, `yield`ing each non-empty stripped line.
2. Because it's a generator, even a multi-gigabyte log file is processed with almost no extra memory: only one line is ever "in flight."
3. `count_error_lines` uses a generator expression `(1 for line in ... if "ERROR" in line)` combined with `sum()`: a common, memory-efficient counting pattern.

### Common Mistakes

```python
# ❌ Trying to reuse an exhausted generator
gen = (x for x in range(3))
print(list(gen))    # [0, 1, 2]
print(list(gen))     # [] : already exhausted, can't be reused!

# ❌ Calling next() on a plain list
next([1, 2, 3])   # ❌ TypeError: lists aren't iterators, only iterables

# ❌ Using a generator when you need len() or repeated access
gen = (x for x in range(10))
len(gen)   # ❌ TypeError: generators don't support len()
```

### Best Practice

- Use generators for one-pass, potentially large or unbounded data streams.
- Use lists when you need random access, repeated iteration, or `len()`.
- Prefer a generator expression over a list comprehension inside `sum()`, `any()`, `all()`, `max()` when you don't need the intermediate list at all.

### Practice

- 🟢 Write a generator function `even_numbers(limit)` that yields even numbers from 0 up to `limit`.
- 🟢 Convert a list comprehension you wrote earlier in this book into an equivalent generator expression.
- 🟡 Write a generator function `fibonacci()` that yields an infinite sequence of Fibonacci numbers (use it with `itertools.islice` or a manual `break` to limit output).

### Mini Challenge

🟠 Write a generator-based pipeline: `read_numbers(path)` yields each number in a file, `filter_positive(numbers)` yields only positive ones, `square_all(numbers)` yields each squared: then chain them together (`square_all(filter_positive(read_numbers(path)))`) and confirm the whole file is never fully loaded into memory at once.

### Exam Question

- What's the practical difference between an iterable and an iterator?
- Why can a generator only be iterated once?
- When would you deliberately choose a list over a generator, even knowing generators use less memory?

---

## 16. Decorators

### Concept

A decorator is a function that **wraps another function**, adding behavior before/after it runs, without modifying the original function's code.

### Why?

Decorators let you add cross-cutting behavior: timing, logging, authentication checks, retries, caching: in one reusable place, applied with a single line (`@decorator`), instead of copy-pasting the same logic into every function that needs it.

### Functions as Objects (the foundation)

```python
def greet():
    return "Hello"

say_hi = greet     # functions can be assigned to variables, just like any other value
print(say_hi())      # Hello

def shout(func):
    def wrapper():
        return func().upper()
    return wrapper     # functions can be RETURNED from other functions

loud_greet = shout(greet)
print(loud_greet())   # HELLO
```

This is the entire foundation of decorators: functions are ordinary objects, so one function can accept, wrap, and return another.

### Basic Decorator

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} finished")
        return result
    return wrapper

@decorator
def add(a, b):
    return a + b

print(add(2, 3))
# Calling add
# add finished
# 5
```

```python
@decorator
def add(a, b):
    return a + b

# is exactly equivalent to:
def add(a, b):
    return a + b
add = decorator(add)
```

`@decorator` is just syntax sugar for `func = decorator(func)`, applied at the point where the function is defined.

### `functools.wraps`

```python
import functools

def decorator(func):
    @functools.wraps(func)     # preserves func's real __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@decorator
def add(a, b):
    """Adds two numbers."""
    return a + b

print(add.__name__)   # "add": WITHOUT @wraps, this would print "wrapper" instead!
print(add.__doc__)      # "Adds two numbers."
```

**Always use `functools.wraps`** inside a decorator's inner function. Without it, the wrapped function loses its identity (name, docstring), which breaks introspection, debugging tools, and documentation generators.

### Decorators with Arguments

```python
import functools

def repeat(times: int):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello, {name}")

greet("Lichi")
# Hello, Lichi
# Hello, Lichi
# Hello, Lichi
```

This is a **decorator factory**: `repeat(times=3)` is called first, and _its return value_ (`decorator`) is what actually gets applied to `greet`. Three layers: `repeat` (takes decorator arguments) → `decorator` (takes the function) → `wrapper` (takes the function's actual call arguments).

### Class Decorators

```python
def add_greeting(cls):
    cls.greet = lambda self: f"Hi, I'm {self.name}"
    return cls

@add_greeting
class User:
    def __init__(self, name):
        self.name = name

u = User("Lichi")
print(u.greet())   # Hi, I'm Lichi
```

A class decorator works the same way as a function decorator, but wraps/modifies an entire class instead of one function.

### Practical Decorators

```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def require_auth(func):
    @functools.wraps(func)
    def wrapper(user, *args, **kwargs):
        if not user.get("is_authenticated"):
            raise PermissionError("Login required")
        return func(user, *args, **kwargs)
    return wrapper

@timer
@require_auth
def get_dashboard(user):
    return f"Dashboard for {user['name']}"

user = {"name": "Lichi", "is_authenticated": True}
print(get_dashboard(user))
```

### Decorator Execution Order

```python
@timer
@require_auth
def get_dashboard(user):
    ...

# equivalent to:
get_dashboard = timer(require_auth(get_dashboard))
```

Decorators apply **bottom-up** when stacked, but **run outside-in** when called: `require_auth` wraps the original function first, then `timer` wraps _that_. When you call `get_dashboard(user)`, `timer`'s wrapper runs first (starts the clock), which calls `require_auth`'s wrapper (checks auth), which finally calls the real function.

### Example

```python
import functools

def cache(func):
    stored = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in stored:
            stored[args] = func(*args)
        return stored[args]
    return wrapper

@cache
def slow_square(n: int) -> int:
    print(f"Computing square of {n}...")
    return n * n

print(slow_square(4))    # Computing square of 4... / 16
print(slow_square(4))      # 16 : no "Computing..." printed, served from cache
```

### Explanation

1. `stored = {}` is created **once**, when `cache(slow_square)` runs: and because of the closure, `wrapper` keeps access to that same dict forever, across every call.
2. `args` (a tuple, from `*args`) is used as the dict key, since tuples are hashable (Chapter 06).
3. First call: not cached, computes and stores. Second call with the same arguments: found in `stored`, returns instantly without recomputing.
4. This is a simplified version of what `functools.lru_cache` (Chapter 34) does for you, built-in.

### Common Mistakes

```python
# ❌ Forgetting functools.wraps: breaks introspection
def decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper   # func.__name__ is now "wrapper" for every decorated function

# ❌ Forgetting *args, **kwargs in the wrapper: breaks any decorated function that takes arguments
def decorator(func):
    def wrapper():           # ❌ only works on zero-argument functions!
        return func()
    return wrapper

# ❌ Confusing a decorator factory with a plain decorator
@repeat        # ❌ missing (): this passes the FUNCTION as `times`, breaking everything
def greet(): ...
```

### Best Practice

- Always accept and forward `*args, **kwargs` in the wrapper unless you have a specific reason not to.
- Always apply `functools.wraps(func)`.
- Keep decorators focused on one concern each (logging, timing, auth): stack multiple small decorators rather than writing one that does everything.

### Practice

- 🟢 Write a `@shout` decorator that uppercases whatever string a function returns.
- 🟢 Write a `@timer` decorator (as shown above) and apply it to a function that sleeps for a second (`time.sleep(1)`).
- 🟡 Write a decorator factory `@retry(times=3)` that re-calls the decorated function up to `times` times if it raises an exception, then re-raises the last error if all attempts fail.

### Mini Challenge

🟠 Write a `@require_auth` decorator (like the example) but generalize it into `@require_role("admin")`: a decorator factory that checks a `user` dict's `"role"` key matches the required role, raising `PermissionError` with a clear message otherwise.

### Exam Question

- What does `@decorator` actually translate to under the hood?
- Why is `functools.wraps` important, even though skipping it doesn't cause a crash?
- In a stack of two decorators, which one's wrapper code runs _first_ when the final function is called?

---

## 17. Context Managers

### Concept

A context manager is an object that defines what happens when entering and exiting a `with` block: most commonly used to guarantee cleanup (closing a file, releasing a lock, closing a network connection) happens, even if an error occurs.

### Why?

Manually pairing "setup" and "cleanup" code (`open()`/`close()`, `lock.acquire()`/`lock.release()`) is easy to get wrong, especially when exceptions can happen in between. Context managers make that pairing automatic and exception-safe.

### `with`, `__enter__`, `__exit__`

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self       # what "as x" binds to, if you write "with Timer() as x:"

    def __exit__(self, exc_type, exc_value, traceback):
        import time
        elapsed = time.perf_counter() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False        # False (or None) means: don't suppress any exception that happened

with Timer():
    total = sum(range(1_000_000))
```

- `__enter__` runs when the `with` block starts, and its return value is what `as name` binds to.
- `__exit__` runs when the block ends: **whether it ended normally or via an exception**: and receives details about any exception that occurred (`exc_type`, `exc_value`, `traceback`, all `None` if nothing went wrong).
- If `__exit__` returns `True`, it **suppresses** the exception (the `with` block acts as if nothing went wrong: used sparingly and deliberately).

### `contextlib`: writing context managers the easy way

```python
from contextlib import contextmanager
import time

@contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield              # everything BEFORE yield = __enter__, everything AFTER = __exit__
    finally:
        elapsed = time.perf_counter() - start
        print(f"Elapsed: {elapsed:.4f}s")

with timer():
    total = sum(range(1_000_000))
```

`@contextmanager` turns a generator function into a context manager without writing a full class: code before `yield` is the setup, code after `yield` (typically in a `finally`, so it runs even on error) is the cleanup.

### `contextlib.suppress`

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    import os
    os.remove("maybe_missing.txt")
# no error raised even if the file doesn't exist: cleaner than try/except/pass
```

### Multiple Context Managers

```python
with open("input.txt") as infile, open("output.txt", "w") as outfile:
    outfile.write(infile.read().upper())
```

### Example

```python
from contextlib import contextmanager

@contextmanager
def db_transaction(connection):
    print("BEGIN transaction")
    try:
        yield connection
        print("COMMIT")
    except Exception:
        print("ROLLBACK")
        raise

class FakeConnection:
    def execute(self, query):
        print(f"Executing: {query}")

conn = FakeConnection()

with db_transaction(conn) as tx:
    tx.execute("INSERT INTO users VALUES ('Lichi')")
```

### Explanation

1. `db_transaction` prints `BEGIN`, then yields the connection to the `with` block's body.
2. If the body completes without error, execution resumes after `yield`, prints `COMMIT`.
3. If the body raises an exception, the `except` block catches it, prints `ROLLBACK`, then **re-raises** with a bare `raise`: so the caller still sees the original error, but the rollback logic still ran first.
4. This is the real-world shape of how database libraries implement transaction context managers.

### Common Mistakes

```python
# ❌ Forgetting `finally` in a manual __exit__/class-based context manager
def __exit__(self, *args):
    self.cleanup()   # if the body raised BEFORE reaching here somehow, cleanup could be skipped
                       # (usually not an issue since __exit__ itself always runs, but be careful
                       # inside contextmanager generator functions specifically: use try/finally)

# ❌ Returning True from __exit__ by accident, silently swallowing real errors
def __exit__(self, exc_type, exc_value, tb):
    return True   # ALL exceptions from the with block just vanish!

# ❌ Not using `finally` inside a @contextmanager generator
@contextmanager
def bad_timer():
    start = time.perf_counter()
    yield
    print(time.perf_counter() - start)   # ❌ SKIPPED if the with-block body raises!
```

### Best Practice

- Use `@contextmanager` for simple cases; write a full class only when you need more state or multiple reusable methods.
- Always put cleanup code after `yield` inside a `try`/`finally` in generator-based context managers.
- Only return `True` from `__exit__` when you deliberately intend to suppress exceptions: and comment why.

### Practice

- 🟢 Write a class-based context manager `Suppressor` (roughly like `contextlib.suppress`) for a single specific exception type.
- 🟢 Write a `@contextmanager` function `temporary_value(obj, attr, new_value)` that temporarily sets an attribute, then restores its original value afterward.
- 🟡 Write a context manager that opens two files (input and output) and guarantees both close even if an error happens mid-processing.

### Mini Challenge

🟠 Write a context manager `change_directory(path)` that temporarily changes the current working directory (`os.chdir`) for the duration of the `with` block, then reliably restores the original directory afterward: even if the code inside the block raises an exception.

### Exam Question

- What do `__enter__` and `__exit__` each get called for, and when?
- What does returning `True` from `__exit__` actually do, and why is that dangerous if done by accident?
- Why must cleanup code in a `@contextmanager` generator go in a `finally` block?

---

## 18. Functional Python

### Concept

Functional programming treats functions as first-class values and favors composing small, pure functions over mutating shared state. Python isn't a purely functional language, but it borrows many of these tools.

### Why?

Some problems (data transformation pipelines, especially) are genuinely clearer expressed as "map this, filter that, reduce to one value" than as loops with manual accumulator variables. Knowing when functional style helps: and when it doesn't: is the actual skill.

### First-Class Functions (recap)

Already seen in Chapter 05 and 16: functions can be assigned to variables, passed as arguments, and returned from other functions.

### `map()`, `filter()`, `reduce()`

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]

doubled = list(map(lambda x: x * 2, numbers))          # [2, 4, 6, 8, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))      # [2, 4]
total = reduce(lambda acc, x: acc + x, numbers, 0)          # 15  (0 is the starting value)
```

`map()` transforms each item; `filter()` keeps only matching items; `reduce()` folds the whole sequence down into a single value, one item at a time, carrying an accumulator forward.

### Comprehensions vs `map`/`filter`

```python
# map/filter style
doubled = list(map(lambda x: x * 2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))

# comprehension style: generally considered more Pythonic and readable
doubled = [x * 2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]
```

**Best practice: prefer comprehensions over `map`/`filter` + `lambda` in Python**: they read left-to-right like English and don't need a `list()` wrapper. `reduce()` doesn't have as clean a comprehension equivalent, so it's the one of these three still commonly used directly.

### Closures (recap)

Already covered in Chapter 05 (`make_multiplier`): a function remembering variables from its enclosing scope. This is the mechanism decorators (Chapter 16) are built on.

### Partial Functions

```python
from functools import partial

def power(base: float, exponent: float) -> float:
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))   # 25
print(cube(5))       # 125
```

`partial` creates a new function with some arguments already "locked in": useful for adapting a general function to a more specific use without writing a full wrapper `def`.

### `functools` Highlights

```python
import functools

functools.reduce(...)         # fold a sequence to one value (seen above)
functools.partial(...)         # pre-fill arguments (seen above)
functools.lru_cache(...)         # memoization: caches return values by argument (Chapter 34: Performance)
functools.wraps(...)               # preserve metadata in decorators (Chapter 16)
functools.total_ordering             # generate __lt__/__le__/__gt__/__ge__ from just __eq__ + __lt__
```

### Pure Functions and Immutability

A **pure function** always returns the same output for the same input, and has no side effects (doesn't modify anything outside itself, doesn't print, doesn't touch global state).

```python
# ✅ Pure: same input always gives same output, no side effects
def add(a: int, b: int) -> int:
    return a + b

# ❌ Impure: depends on and mutates external state
total = 0
def add_to_total(x: int) -> None:
    global total
    total += x
```

Pure functions are easier to test (no setup needed beyond the input), easier to reason about (no hidden dependencies), and safe to run in parallel (no shared state to race over: very relevant in Chapter 29).

### When Functional Style Helps: and When It Hurts

```python
# ✅ Genuinely clearer as a pipeline
result = sum(x * x for x in range(100) if x % 2 == 0)

# ❌ Forced functional style, harder to read than a plain loop
result = list(
    map(lambda x: x[1],
        filter(lambda x: x[0] % 2 == 0,
               enumerate(data)))
)
# vs, just:
result = [value for i, value in enumerate(data) if i % 2 == 0]
```

**Rule of thumb:** functional style shines for straightforward transform/filter/aggregate pipelines. It gets in the way when the logic involves multiple steps, branching, or side effects (logging, I/O): a plain loop or a few named functions is clearer there.

### Example

```python
from functools import reduce

transactions = [
    {"amount": 100, "type": "credit"},
    {"amount": 50, "type": "debit"},
    {"amount": 200, "type": "credit"},
    {"amount": 30, "type": "debit"},
]

credits = [t["amount"] for t in transactions if t["type"] == "credit"]
debits = [t["amount"] for t in transactions if t["type"] == "debit"]

balance = reduce(lambda acc, t: acc + t["amount"] if t["type"] == "credit" else acc - t["amount"],
                  transactions, 0)

print(f"Total credits: {sum(credits)}")
print(f"Total debits: {sum(debits)}")
print(f"Balance: {balance}")
```

### Explanation

1. Two comprehensions extract just the amounts for each transaction type: clear and Pythonic.
2. `reduce` folds the entire transaction list into a running balance in one pass, adding for credits and subtracting for debits.
3. This mixes styles deliberately: comprehensions where they're the clearest tool, `reduce` where it genuinely fits (a running accumulation).

### Common Mistakes

```python
# ❌ Reaching for map/filter/lambda when a comprehension would be clearer
result = list(map(lambda x: x * 2, filter(lambda x: x > 0, numbers)))
# vs:
result = [x * 2 for x in numbers if x > 0]

# ❌ Writing "impure" functions and being surprised by unexpected shared state
def append_item(item, target=[]):     # mutable default (Chapter 05) strikes again
    target.append(item)
    return target

# ❌ Overusing reduce for things that have a clearer built-in
reduce(lambda acc, x: acc + x, numbers, 0)    # just use sum(numbers)
reduce(lambda acc, x: max(acc, x), numbers)     # just use max(numbers)
```

### Best Practice

- Prefer comprehensions over `map`/`filter` + `lambda`.
- Prefer built-ins (`sum`, `max`, `min`, `any`, `all`) over `reduce` when one exists for your exact case.
- Write pure functions where practical: push side effects (printing, writing files) to the edges of your program, not scattered through your core logic.

### Practice

- 🟢 Rewrite a `map`/`lambda` transformation as a list comprehension.
- 🟢 Use `functools.partial` to create a `double(x)` function from a general `multiply(x, factor)` function.
- 🟡 Write a pure function `apply_discount(price: float, rate: float) -> float` and a separate, deliberately impure function that logs the discounted price: keeping the two responsibilities cleanly separated.

### Mini Challenge

🟠 Given a list of word strings, use `reduce` to build a single dict counting how many times each word appears (a manual word-frequency counter): then compare it to using `collections.Counter` and explain which you'd actually use in real code.

### Exam Question

- Why are comprehensions generally preferred over `map()`/`filter()` with `lambda` in Python?
- What makes a function "pure," and why does that property matter for testing and concurrency?
- Give an example of when `reduce()` is still the clearest tool, despite comprehensions generally being preferred.

---

## 19. Regular Expressions

### Concept

Regular expressions (regex) describe **patterns** in text, letting you search, validate, and extract data far more powerfully than plain string methods. Python's `re` module implements them.

### Why?

Parsing log files, validating input formats, and extracting structured data from unstructured text (all common in security tooling: think parsing scan output, log analysis, or crafting input validation) is where regex earns its reputation as tedious-but-essential.

### Basic Matching

```python
import re

text = "My phone number is 555-1234"

match = re.search(r"\d{3}-\d{4}", text)
if match:
    print(match.group())   # "555-1234"
```

- `r"..."`: a **raw string** (Chapter 07); regex patterns are full of backslashes, and raw strings prevent Python from interpreting them as escape codes first.
- `\d`: matches any digit.
- `{3}`: exactly 3 repetitions of the previous token.
- `re.search` finds the **first** match anywhere in the string; returns `None` if nothing matches.

### Common Building Blocks

```python
\d        # digit             [0-9]
\D        # NOT a digit
\w        # word character     [a-zA-Z0-9_]
\W        # NOT a word character
\s        # whitespace (space, tab, newline)
\S        # NOT whitespace
.         # any character (except newline, by default)
^         # start of string (or line, with re.MULTILINE)
$         # end of string (or line, with re.MULTILINE)
*         # 0 or more of the previous token
+         # 1 or more
?         # 0 or 1 (optional)
{n}       # exactly n
{n,m}     # between n and m
```

### `re.match` vs `re.search` vs `re.findall`

```python
re.match(r"\d+", "abc123")    # None: match() only checks from the START of the string
re.search(r"\d+", "abc123")     # matches "123": search() scans the WHOLE string
re.findall(r"\d+", "a1b22c333")   # ["1", "22", "333"]: ALL non-overlapping matches
```

### Character Classes

```python
re.findall(r"[aeiou]", "hello world")     # every individual vowel: ['e', 'o', 'o']
re.findall(r"[^aeiou\s]", "hello world")    # everything that's NOT a vowel or whitespace
re.findall(r"[A-Z][a-z]+", "Alice and Bob")   # capitalized words: ['Alice', 'Bob']
```

### Groups and Named Groups

```python
match = re.search(r"(\w+)@(\w+)\.com", "contact: lichi@example.com")
print(match.group(0))   # "lichi@example.com" : the whole match
print(match.group(1))     # "lichi"            : first parenthesized group
print(match.group(2))       # "example"          : second group

match = re.search(r"(?P<user>\w+)@(?P<domain>\w+)\.com", "lichi@example.com")
print(match.group("user"))       # "lichi"
print(match.group("domain"))       # "example"
```

Named groups (`(?P<name>...)`) make code that uses the match result far more readable than remembering what `group(2)` refers to.

### Lookahead and Lookbehind

```python
# Lookahead: match "foo" only if followed by "bar", WITHOUT including "bar" in the match
re.findall(r"foo(?=bar)", "foobar foobaz")   # ['foo']

# Negative lookahead: match "foo" only if NOT followed by "bar"
re.findall(r"foo(?!bar)", "foobar foobaz")     # ['foo']  (from foobaz)

# Lookbehind: match "bar" only if preceded by "foo"
re.findall(r"(?<=foo)bar", "foobar bazbar")      # ['bar']  (from foobar)

# Negative lookbehind
re.findall(r"(?<!foo)bar", "foobar bazbar")        # ['bar']  (from bazbar)
```

Lookarounds check for a condition **without consuming characters as part of the match**: useful for password/format validation (e.g., "must be followed by a digit, but the digit itself isn't part of what we extract").

### Flags

```python
re.search(r"hello", "HELLO", re.IGNORECASE)     # matches, case-insensitive
re.findall(r"^\d+", "1 two\n3 four", re.MULTILINE)   # ^ matches at the start of EACH line, not just the string
re.search(r"a.b", "a\nb", re.DOTALL)                     # . also matches newlines
```

### Substitution

```python
text = "Call me at 555-1234 or 555-5678"
redacted = re.sub(r"\d{3}-\d{4}", "[REDACTED]", text)
print(redacted)   # "Call me at [REDACTED] or [REDACTED]"

# using a captured group in the replacement
text = "2026-08-11"
reformatted = re.sub(r"(\d{4})-(\d{2})-(\d{2})", r"\3/\2/\1", text)
print(reformatted)   # "11/08/2026"
```

### Compiling Patterns

```python
pattern = re.compile(r"\d{3}-\d{4}")

# reuse the compiled pattern many times: faster if used repeatedly
for text in ["555-1234", "no number here", "555-9999"]:
    match = pattern.search(text)
    if match:
        print(match.group())
```

`re.compile` pre-processes the pattern once; worthwhile when the same pattern is used across many strings (e.g., scanning many log lines), not necessary for a single one-off `re.search`.

### Example

```python
import re

log_lines = [
    "2026-08-11 10:23:45 [ERROR] Failed login for user admin from 192.168.1.5",
    "2026-08-11 10:24:01 [INFO] User lichi logged in from 10.0.0.2",
    "2026-08-11 10:24:15 [ERROR] Failed login for user root from 192.168.1.7",
]

pattern = re.compile(
    r"(?P<timestamp>[\d-]+ [\d:]+) \[(?P<level>\w+)\] .*from (?P<ip>[\d.]+)"
)

for line in log_lines:
    match = pattern.search(line)
    if match and match.group("level") == "ERROR":
        print(f"{match.group('timestamp')}: suspicious IP: {match.group('ip')}")
```

### Explanation

1. The pattern uses three named groups: `timestamp`, `level`, and `ip`.
2. `[\d-]+` matches digits and dashes (the date part), `[\d:]+` matches digits and colons (the time part).
3. `.*from` skips over whatever's in between, up to the literal word `from`.
4. `[\d.]+` matches the IP address (digits and dots).
5. We filter for `level == "ERROR"` and print a focused summary: a simplified version of a real log-triage tool.

### Common Mistakes

```python
# ❌ Forgetting the raw string prefix: backslashes get double-interpreted
pattern = "\d+"     # \d isn't a recognized Python escape, may warn or behave unexpectedly
pattern = r"\d+"      # ✅ correct

# ❌ Using .match() expecting it to search anywhere in the string
re.match(r"\d+", "abc123")   # None: match() only checks from position 0

# ❌ Greedy quantifiers grabbing more than intended
re.search(r"<.+>", "<a><b>")   # matches "<a><b>" (greedy!) not just "<a>"
re.search(r"<.+?>", "<a><b>")    # ✅ "?" makes it non-greedy: matches just "<a>"

# ❌ Writing an unreadable, uncommented complex pattern with no named groups
```

### Best Practice

- Always use raw strings (`r"..."`) for regex patterns.
- Use named groups for anything with more than 1–2 capture groups.
- Compile patterns you'll reuse across a loop or many calls.
- For simple string checks (`"foo" in text`, `text.startswith(...)`), use plain string methods: regex is powerful but not always the right tool for simple cases.

### Practice

- 🟢 Write a regex that validates a basic email format (`someone@example.com`).
- 🟢 Use `re.findall` to extract all hashtags (`#word`) from a piece of text.
- 🟡 Write a regex with named groups to parse a URL into `scheme`, `host`, and `path`.

### Mini Challenge

🟠 Write a function `extract_ips(text: str) -> list[str]` that finds all IPv4 addresses in a block of text using regex, and validates that each octet is between 0 and 255 (a naive `[\d.]+` pattern will also match invalid ones like `999.999.999.999`: think about how to tighten it, or filter matches after extraction).

### Exam Question

- Why should regex patterns almost always be written as raw strings?
- What's the difference between `re.match()` and `re.search()`?
- What does a lookahead check, and why doesn't it "consume" characters from the match?

---

## 20. JSON, CSV and Serialization

### Concept

**Serialization** converts a Python object into a storable/transmittable format (text or bytes). **Deserialization** converts it back. JSON and CSV are the two most common text formats you'll work with.

### Why?

APIs speak JSON. Spreadsheets and data exports speak CSV. Config files, caches, and saved application state often need some form of serialization. This is one of the most practically-used skills in everyday Python.

### JSON

```python
import json

data = {"name": "Lichi", "age": 20, "skills": ["python", "security"]}

json_string = json.dumps(data)                  # Python object -> JSON string
json_string_pretty = json.dumps(data, indent=2)    # human-readable formatting

parsed = json.loads(json_string)                     # JSON string -> Python object
print(parsed["name"])                                  # "Lichi"

with open("data.json", "w") as f:
    json.dump(data, f, indent=2)      # write directly to a file

with open("data.json") as f:
    loaded = json.load(f)               # read directly from a file
```

### JSON Type Mapping

```text
Python          JSON
------          ----
dict      <->   object
list      <->   array
str       <->   string
int/float <->   number
True/False <->  true/false
None      <->   null
```

JSON has no `tuple`, `set`, or `datetime` type: those need custom handling:

```python
import json
from datetime import datetime

def default(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

data = {"created": datetime.now()}
print(json.dumps(data, default=default))
```

### CSV

```python
import csv

# Writing
with open("users.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age"])
    writer.writerow(["Lichi", 20])
    writer.writerow(["Guest", 25])

# Reading (raw rows)
with open("users.csv") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        print(row)   # ['Lichi', '20']

# Reading as dicts: usually more convenient
with open("users.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])   # named access instead of positional
```

`newline=""` when opening a CSV file for writing is required on some platforms to avoid extra blank lines: always include it.

### `pickle`: Python-specific serialization

```python
import pickle

data = {"name": "Lichi", "scores": [90, 85, 95]}

with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

with open("data.pkl", "rb") as f:
    loaded = pickle.load(f)
```

`pickle` can serialize almost _any_ Python object (including custom classes, unlike JSON), but the output is Python-specific binary data: not readable by other languages, and not stable across Python versions in every case.

### Security Risk of `pickle`

**Never unpickle data from an untrusted source.** Unpickling can execute arbitrary code: a maliciously crafted pickle file can run any code the attacker wants the moment you call `pickle.load()`, since deserialization can invoke arbitrary constructors and methods.

```python
# ❌ NEVER do this with data from the internet, a user upload, or any untrusted source
with open("downloaded_file.pkl", "rb") as f:
    data = pickle.load(f)   # could execute arbitrary attacker-controlled code
```

**When NOT to use pickle:** anything crossing a trust boundary: network data, user uploads, files you didn't create yourself. Use JSON (which can only represent data, never executable code) for anything that might be tampered with. Reserve `pickle` for trusted, internal use: like caching your own program's internal state between runs.

### Example

```python
import json
import csv
from pathlib import Path

def csv_to_json(csv_path: Path, json_path: Path) -> None:
    with csv_path.open() as f:
        rows = list(csv.DictReader(f))

    with json_path.open("w") as f:
        json.dump(rows, f, indent=2)

csv_to_json(Path("users.csv"), Path("users.json"))
```

### Explanation

1. `csv.DictReader` reads each CSV row as a dict, using the header row as keys.
2. `list(...)` collects all rows into memory (fine for reasonably sized files; use streaming for huge ones).
3. `json.dump` writes the resulting list of dicts as a formatted JSON array to a new file: a common, small but genuinely useful data-conversion utility.

### Common Mistakes

```python
# ❌ Forgetting newline="" when writing CSV
with open("out.csv", "w") as f:   # missing newline="": extra blank lines on Windows
    writer = csv.writer(f)

# ❌ Trying to json.dumps() a non-JSON-serializable object without a default handler
json.dumps({"time": datetime.now()})   # ❌ TypeError: Object of type datetime is not JSON serializable

# ❌ Unpickling untrusted data
pickle.load(open("suspicious_file.pkl", "rb"))   # security risk

# ❌ Assuming JSON preserves tuple/set types
json.loads(json.dumps((1, 2, 3)))   # returns [1, 2, 3]: a LIST, tuple identity is lost
```

### Best Practice

- Use JSON for anything crossing a trust boundary or leaving Python.
- Use `csv.DictReader`/`DictWriter` over the plain reader/writer for named-field clarity.
- Never `pickle.load()` untrusted data: treat this rule as a hard line, not a judgment call.
- Always pass `indent=2` (or similar) when writing JSON meant for humans to read later.

### Practice

- 🟢 Write a Python dict to a JSON file, then read it back and print one field.
- 🟢 Write a small CSV file with 3 rows using `csv.writer`, then read it back with `csv.DictReader`.
- 🟡 Write a function that converts a list of dataclass instances (Chapter 11) into a JSON array (hint: `dataclasses.asdict`).

### Mini Challenge

🟠 Write a small "JSON database" tool: a class `JSONStore` with `load()`, `save()`, `add(record)`, and `all()` methods, backed by a single JSON file on disk that persists between program runs. (This connects to Chapter 38's project list.)

### Exam Question

- Why is unpickling untrusted data a genuine security risk, in your own words?
- Name two Python types that JSON can't represent natively, and how you'd work around it.
- Why does `newline=""` matter when opening a file for CSV writing?

---

## 21. Logging

### Concept

The `logging` module is the standard, production-grade way to record what a program is doing: far more capable than scattering `print()` statements through your code.

### Why?

`print()` has no levels, no timestamps, no way to route messages to a file vs the console, and no easy way to turn it off in production without deleting code. `logging` solves all of that, and it's what real applications (and most security tools) actually use.

### Basic Usage

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.debug("Detailed diagnostic info")      # won't show: below INFO level
logger.info("Server started")                    # shows
logger.warning("Disk space low")                   # shows
logger.error("Failed to connect to database")        # shows
logger.critical("System is shutting down")              # shows
```

### Log Levels (lowest to highest severity)

```text
DEBUG    : detailed diagnostic info, useful only while actively debugging
INFO     : confirmation that things are working as expected
WARNING  : something unexpected happened, but the program can continue
ERROR    : a real problem; some functionality failed
CRITICAL : a serious error; the program may not be able to continue
```

Setting `level=logging.INFO` means: show `INFO` and everything _more severe_ (`WARNING`, `ERROR`, `CRITICAL`), but hide `DEBUG`. This is how you dial verbosity up/down without touching your actual logging calls.

### `__name__` as the Logger Name

```python
logger = logging.getLogger(__name__)
```

Using `__name__` (the module's name: Chapter 08) means logs are automatically labeled by which file they came from, which becomes essential once a project has more than one file.

### Handlers and Formatters

```python
import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()             # sends logs to the console
file_handler = logging.FileHandler("app.log")            # sends logs to a file

formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.info("This goes to both the console AND app.log")
```

A **handler** decides _where_ logs go (console, file, network, ...). A **formatter** decides _how_ each log line is structured. You can attach multiple handlers to one logger, each with its own level and format: e.g., `DEBUG`-and-up to a file, `WARNING`-and-up to the console.

### Logging Exceptions

```python
try:
    1 / 0
except ZeroDivisionError:
    logger.exception("Division failed")   # automatically includes the full traceback
```

`logger.exception(...)` must be called from inside an `except` block: it automatically attaches the traceback, which is far more useful for debugging than a plain error message.

### Structured Logging (concept)

For larger systems, plain text logs get hard to search/filter at scale. **Structured logging** means logging key-value data (often as JSON) instead of a free-text sentence:

```python
import json
import logging

logger = logging.getLogger(__name__)

def log_event(event: str, **details) -> None:
    logger.info(json.dumps({"event": event, **details}))

log_event("login_attempt", user="admin", success=False, ip="192.168.1.5")
# INFO:__main__:{"event": "login_attempt", "user": "admin", "success": false, "ip": "192.168.1.5"}
```

This makes logs machine-parseable: easy to filter/aggregate with tools like `grep`, `jq`, or a real log-analysis platform, instead of relying on fragile string matching.

### Example

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("security.log"),
    ],
)
logger = logging.getLogger(__name__)

def check_login(username: str, success: bool) -> None:
    if success:
        logger.info(f"Successful login: {username}")
    else:
        logger.warning(f"Failed login attempt: {username}")

check_login("lichi", True)
check_login("admin", False)
```

### Explanation

1. `basicConfig` sets up logging once, for the whole program: minimum level `INFO`, a timestamped format, and two handlers (console + file) applied simultaneously.
2. `check_login` logs at different levels depending on outcome: a failed login is more notable than a successful one, hence `WARNING` vs `INFO`.
3. Both the console and `security.log` receive every message, formatted identically.

### Common Mistakes

```python
# ❌ Using print() for anything beyond quick, throwaway debugging
print("User logged in")   # no level, no timestamp, no easy way to disable

# ❌ Calling basicConfig() more than once: only the FIRST call has any effect
logging.basicConfig(level=logging.DEBUG)
logging.basicConfig(level=logging.ERROR)   # silently ignored!

# ❌ Logging sensitive data
logger.info(f"User logged in with password {password}")   # never log secrets/passwords/tokens

# ❌ Using the root logger everywhere instead of getLogger(__name__)
logging.info("message")   # uses the root logger: fine for tiny scripts, not for real projects
```

### Best Practice

- Use `logging`, not `print()`, for anything beyond quick local debugging.
- Always use `getLogger(__name__)`, not the bare root logger, in real modules.
- Never log passwords, tokens, API keys, or other secrets: even at DEBUG level.
- Use `logger.exception()` inside `except` blocks to capture full tracebacks.

### Practice

- 🟢 Set up basic logging with `INFO` level and log messages at each of the 5 levels; confirm `DEBUG` is hidden.
- 🟢 Add a `FileHandler` so logs are written to `app.log` in addition to the console.
- 🟡 Wrap a risky operation (like a file read that might fail) in `try`/`except`, and use `logger.exception()` to log the failure with a full traceback.

### Mini Challenge

🟠 Build a small login-monitoring tool: a function that logs every login attempt (success/failure, username, timestamp is automatic via the formatter) to `security.log`, then write a second function that reads that log file back and reports how many failed attempts came from each username: a mini log analyzer combining Chapters 09, 19, and 21.

### Exam Question

- Why is `logging` preferred over `print()` in real applications?
- What's the difference between a handler and a formatter?
- Why should `logging.basicConfig()` generally only be called once, at the start of a program?

---

## 22. Testing

### Concept

Testing means writing code that automatically checks whether your other code behaves correctly: so you find bugs by running a test suite in seconds, instead of manually re-checking behavior (or worse, finding out in production).

### Why?

Tests let you change code confidently: if you refactor something and all tests still pass, you have real evidence nothing broke. Without tests, every change is a leap of faith. This matters even more in security tooling, where a silent bug can mean a false negative in a scan.

### `assert`: the foundation

```python
def add(a: int, b: int) -> int:
    return a + b

assert add(2, 3) == 5
assert add(-1, 1) == 0
assert add(0, 0) == 0
print("All assertions passed")
```

`assert condition` does nothing if `condition` is `True`; raises `AssertionError` if it's `False`. This is the raw mechanism testing is built on, but writing tests as loose scripts of asserts doesn't scale: that's what `pytest` is for.

### `pytest` Basics

```bash
pip install pytest
# or, with your tooling:
uv add --dev pytest
```

```python
# test_math_utils.py
def add(a: int, b: int) -> int:
    return a + b

def test_add_positive_numbers():
    assert add(2, 3) == 5

def test_add_negative_numbers():
    assert add(-1, -1) == -2

def test_add_zero():
    assert add(0, 5) == 5
```

```bash
pytest test_math_utils.py
pytest              # run every test_*.py file it finds
pytest -v             # verbose output: shows each test name
```

`pytest` discovers test functions by naming convention: files named `test_*.py` (or `*_test.py`), functions named `test_*`. No special imports or base classes needed for basic tests: this simplicity is a big part of why `pytest` is the modern standard.

### Testing for Exceptions

```python
import pytest

def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_divide_by_zero_raises():
    with pytest.raises(ValueError):
        divide(10, 0)
```

### Fixtures

```python
import pytest

@pytest.fixture
def sample_users():
    return [
        {"name": "Lichi", "age": 20},
        {"name": "Guest", "age": 25},
    ]

def test_user_count(sample_users):
    assert len(sample_users) == 2

def test_first_user_name(sample_users):
    assert sample_users[0]["name"] == "Lichi"
```

A **fixture** provides reusable setup data/objects to any test that asks for it by parameter name: `pytest` automatically calls `sample_users()` and passes its return value into each test that declares it as a parameter. Fixtures can also handle setup _and teardown_ (using `yield` instead of `return`, similar in spirit to a context manager).

```python
@pytest.fixture
def temp_file(tmp_path):        # tmp_path is a BUILT-IN pytest fixture
    path = tmp_path / "data.txt"
    path.write_text("test data")
    yield path
    # anything after yield runs AFTER the test finishes (teardown)
```

### Parametrization

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

`@pytest.mark.parametrize` runs the _same_ test function once for each set of inputs: instead of writing 4 nearly-identical test functions, you write one test and a list of cases.

### Mocking

```python
from unittest.mock import Mock, patch

def get_weather(api_client) -> str:
    data = api_client.fetch("/weather")
    return data["condition"]

def test_get_weather():
    mock_client = Mock()
    mock_client.fetch.return_value = {"condition": "sunny"}

    result = get_weather(mock_client)

    assert result == "sunny"
    mock_client.fetch.assert_called_once_with("/weather")
```

**Mocking** replaces a real dependency (an API client, a database, a network call) with a fake stand-in you fully control: so your test doesn't actually hit a real network or database, runs fast, and is deterministic (no flakiness from external services being slow or down).

```python
@patch("mymodule.requests.get")
def test_fetch_data(mock_get):
    mock_get.return_value.json.return_value = {"status": "ok"}
    result = fetch_data()
    assert result["status"] == "ok"
```

`@patch` temporarily replaces a real object/function (specified by its import path as a string) with a `Mock` for the duration of the test, then restores it automatically afterward.

### Test Organization

```text
myproject/
├── myapp/
│   ├── __init__.py
│   └── utils.py
└── tests/
    ├── __init__.py
    └── test_utils.py
```

Keep tests in a parallel `tests/` directory (or alongside modules as `test_*.py`), mirroring your source layout: makes it obvious what's tested and what isn't.

### Coverage

```bash
pip install pytest-cov
pytest --cov=myapp
```

**Coverage** measures what percentage of your actual code lines were executed by your tests. High coverage doesn't guarantee correctness (you can execute a line without properly checking its result), but low coverage reliably tells you there are untested paths.

### Example

```python
# password_checker.py
def is_strong_password(password: str) -> bool:
    if len(password) < 8:
        return False
    has_digit = any(c.isdigit() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    return has_digit and has_upper and has_lower


# test_password_checker.py
import pytest
from password_checker import is_strong_password

@pytest.mark.parametrize("password, expected", [
    ("short1A", False),          # too short
    ("alllowercase1", False),      # no uppercase
    ("ALLUPPERCASE1", False),        # no lowercase
    ("NoDigitsHere", False),           # no digit
    ("StrongPass1", True),               # meets all requirements
])
def test_is_strong_password(password, expected):
    assert is_strong_password(password) == expected
```

### Explanation

1. `is_strong_password` is the function under test: pure, no side effects, easy to test.
2. `@pytest.mark.parametrize` covers 5 distinct cases (each requirement failing individually, plus a fully valid password) in one compact block.
3. Running `pytest -v` would show 5 separate test results, each clearly labeled with its parameters.

### Common Mistakes

```python
# ❌ Tests that depend on execution order or shared mutable state
counter = 0
def test_a():
    global counter
    counter += 1
    assert counter == 1   # breaks if test order changes or tests run in parallel

# ❌ Testing implementation details instead of behavior
def test_internal_helper_called():
    # tightly coupled to HOW the function works, breaks on any refactor
    ...

# ❌ One giant test function checking 10 unrelated things: a failure doesn't tell you WHICH thing broke
def test_everything():
    assert add(2, 3) == 5
    assert subtract(5, 2) == 3
    assert multiply(2, 3) == 6
    # if this fails, which assertion? pytest tells you, but splitting into 3 tests is clearer

# ❌ Not testing edge cases (empty input, zero, negative numbers, None)
```

### Best Practice

- One test function per specific behavior/case; keep tests small and focused.
- Use fixtures for shared setup, parametrize for repeated logic with different inputs.
- Mock external dependencies (network, filesystem, time) so tests are fast and deterministic.
- Test behavior (inputs → outputs), not internal implementation details: so refactors don't break tests unnecessarily.

### Practice

- 🟢 Write `pytest` tests for the `is_even` function from Chapter 05's practice.
- 🟢 Use `pytest.raises` to test that your Chapter 10 `validate_age` function raises `InvalidAgeError` for bad input.
- 🟡 Write a fixture that provides a temporary directory with 3 pre-created files, and a test that confirms a function correctly counts files in a directory.
- 🟡 Use `@pytest.mark.parametrize` to test your Chapter 07 `is_palindrome` function against at least 5 cases, including edge cases.

### Mini Challenge

🟠 Write tests for a function `fetch_user_status(api_client, user_id)` that calls `api_client.get(f"/users/{user_id}")` and returns `"active"` or `"inactive"` based on the response: using `unittest.mock.Mock` so no real network call ever happens, and cover both the success case and a case where the API returns an error status.

### Exam Question

- Why is testing behavior generally better than testing implementation details?
- What problem does mocking solve when testing code that depends on a network call?
- What does test coverage actually measure, and why doesn't 100% coverage guarantee bug-free code?

---

## 23. Debugging

### Concept

Debugging is the systematic process of finding _why_ code isn't doing what you expect: reading error messages carefully, forming hypotheses, and testing them, rather than guessing randomly.

### Why?

You will spend a significant fraction of your programming time debugging, no matter how skilled you become: even expert developers do. Getting _systematically_ good at it (rather than randomly changing things and hoping) is a force multiplier on everything else you learn.

### Reading Tracebacks

```python
def divide(a, b):
    return a / b

def process(data):
    return divide(data["value"], 0)

process({"value": 10})
```

```text
Traceback (most recent call last):
  File "app.py", line 7, in <module>
    process({"value": 10})
  File "app.py", line 5, in process
    return divide(data["value"], 0)
  File "app.py", line 2, in divide
    return a / b
ZeroDivisionError: division by zero
```

**Read tracebacks bottom to top.** The very last line (`ZeroDivisionError: division by zero`) is _what_ went wrong. The lines above it, read upward, show the **call chain** that led there: `process()` called `divide()`, which is where the actual error occurred. The bottom tells you the error; working upward tells you the path that got you there.

### A Debugging Strategy (not just "add print statements")

1. **Reproduce it reliably.** If you can't make it happen consistently, you can't confirm you fixed it.
2. **Read the full error message and traceback carefully**, don't skim: the exact line number and exception type usually narrow things down fast.
3. **Form a hypothesis**: "I think `data` doesn't have the key I expect here."
4. **Test the hypothesis**: the smallest way possible: a print statement, a debugger breakpoint, or an isolated test.
5. **Fix, then verify**: re-run and confirm the _original_ problem is gone, not just that your test case passes.

### `print()` Debugging

```python
def process(data):
    print(f"DEBUG: data = {data!r}")   # !r uses repr(): shows quotes, type distinctions clearly
    result = data["value"] * 2
    print(f"DEBUG: result = {result}")
    return result
```

Fast and simple, but gets messy quickly in larger programs, and it's easy to forget to remove debug prints before committing code. Fine for quick, local investigation.

### `breakpoint()`

```python
def process(data):
    total = 0
    for item in data:
        breakpoint()   # pauses execution here, drops into an interactive debugger (pdb)
        total += item["value"]
    return total
```

When execution hits `breakpoint()`, you get an interactive prompt right there, in that exact program state:

```text
(Pdb) item          # inspect the current value of `item`
(Pdb) item["value"]   # try expressions directly
(Pdb) n                 # next line
(Pdb) c                   # continue running
(Pdb) q                     # quit debugger
```

This is far more powerful than scattered `print()` calls: you can inspect _any_ variable in scope, step line by line, and even call functions interactively, all without editing your code.

### Common Python Errors, Decoded

```text
SyntaxError       : the code isn't valid Python at all (typo, missing colon, mismatched parens)
IndentationError  : inconsistent/wrong indentation
NameError         : using a variable/name that doesn't exist (typo, or used before assignment)
TypeError          : an operation applied to the wrong type ("abc" + 5)
ValueError           : right type, wrong value (int("abc"))
KeyError               : dict key doesn't exist
IndexError               : list/sequence index out of range
AttributeError              : object doesn't have the attribute/method you tried to use
ImportError / ModuleNotFoundError : module doesn't exist or isn't installed/on the path
RecursionError                       : recursive function never hit its base case
```

Learning to recognize these by name (not just "it's broken") massively speeds up debugging: each one points you toward a specific _category_ of mistake.

### Logging as a Debugging Tool

Already covered in Chapter 21: for anything beyond quick local investigation, `logger.debug(...)` messages you can toggle on/off are more sustainable than scattered `print()` calls you have to remember to delete.

### Example: walking through a real bug

```python
def get_average_score(scores: dict[str, list[int]], student: str) -> float:
    student_scores = scores[student]
    return sum(student_scores) / len(student_scores)

data = {"Lichi": [90, 85, 95], "Guest": []}
print(get_average_score(data, "Guest"))
```

```text
ZeroDivisionError: division by zero
```

**Debugging walkthrough:**

1. Traceback says `ZeroDivisionError` at the `return` line: so `len(student_scores)` must be `0`.
2. Hypothesis: the `"Guest"` student has an empty scores list.
3. Confirm: `print(data["Guest"])` → `[]`. Hypothesis confirmed.
4. Fix: decide the _correct_ behavior for an empty list (return `0.0`? raise a clearer error? skip the student?), and implement it explicitly instead of letting the division crash:

```python
def get_average_score(scores: dict[str, list[int]], student: str) -> float:
    student_scores = scores[student]
    if not student_scores:
        return 0.0
    return sum(student_scores) / len(student_scores)
```

### Common Mistakes

```python
# ❌ Randomly changing code hoping it fixes things, without understanding why it broke
# ❌ Only reading the last line of a traceback, ignoring the call chain above it
# ❌ Leaving debug print() statements in committed/shared code
# ❌ Debugging by adding MORE complexity (extra try/except swallowing the real error) instead of finding the root cause
try:
    result = risky_operation()
except Exception:
    result = None   # hides the actual bug instead of fixing it
```

### Best Practice

- Read the full traceback, bottom to top, before touching any code.
- Form a specific hypothesis before making a change: "I think X is None here" is testable; "something's wrong" is not.
- Use `breakpoint()` for anything non-trivial instead of sprinkling `print()` calls.
- Fix the root cause, not just the symptom that happened to surface first.

### Practice

- 🟢 Deliberately write code that raises `IndexError`, `KeyError`, and `AttributeError`, and read each traceback carefully.
- 🟢 Add a `breakpoint()` inside a loop and practice inspecting variables and stepping through with `n` and `c`.
- 🟡 Take a function you wrote in an earlier chapter, introduce a subtle bug on purpose, then debug it using only the traceback and `breakpoint()`: no rewriting from scratch.

### Mini Challenge

🟠 You're given this buggy function (don't fix it yet: debug it methodically first): `def find_max(numbers): result = 0; for n in numbers: if n > result: result = n; return result`. Find and explain the bug (hint: think about an input list of all-negative numbers), then fix it.

### Exam Question

- Why should you read a traceback bottom to top?
- What's an actual advantage of `breakpoint()` over `print()` debugging?
- Why is "wrap it in try/except and ignore the error" usually the wrong fix?

---

## 24. Virtual Environments and Packaging

### Concept

A **virtual environment** is an isolated Python installation for one project, so its dependencies don't clash with other projects (or your system Python). **Packaging** is how you organize, declare dependencies for, and (optionally) distribute a Python project.

### Why?

Without isolation, installing `requests==2.0` for one project and `requests==3.0` for another on the _same_ system Python is a direct conflict: one project breaks. Virtual environments solve this by giving every project its own private set of installed packages.

### The Standard Way: `venv` + `pip`

```bash
python3 -m venv .venv           # create a virtual environment in .venv/
source .venv/bin/activate         # activate it (Linux/macOS)
pip install requests                # installs INTO the venv, not system-wide
pip freeze > requirements.txt         # snapshot installed packages
pip install -r requirements.txt         # install from that snapshot elsewhere
deactivate                                # leave the venv
```

### The Modern, Fast Way: `uv`

Since this is already your package manager, here's the direct equivalent workflow:

```bash
uv venv                    # create a virtual environment
uv pip install requests      # install a package (much faster than pip)
uv pip freeze                  # snapshot dependencies
uv add requests                  # add + record a dependency in pyproject.toml (project mode)
uv sync                            # install everything pyproject.toml/uv.lock declares
uv run python script.py              # run a script using the project's environment automatically
uv python pin 3.12                     # pin the Python version for this project
```

`uv` combines what used to require several separate tools (`venv`, `pip`, `pip-tools`, sometimes `pyenv`) into one fast, unified command, and it's what you're already using: the concepts below (dependency declarations, lockfiles, `pyproject.toml`) apply either way, `uv` just makes the workflow faster and more integrated.

### Why Isolation Matters: a Concrete Example

```text
Project A needs:  requests==2.28
Project B needs:  requests==2.31

Without venvs:  ❌ only ONE version of requests can be installed system-wide: conflict!
With venvs:     ✅ Project A's .venv has 2.28, Project B's .venv has 2.31: no conflict
```

### `pyproject.toml`: the modern project manifest

```toml
[project]
name = "hash-gen"
version = "0.1.0"
description = "A CLI hash generation tool"
requires-python = ">=3.11"
dependencies = [
    "click>=8.0",
]

[project.optional-dependencies]
dev = ["pytest>=7.0", "mypy>=1.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

`pyproject.toml` is the current standard for declaring a project's metadata and dependencies in one file (replacing the older, less standardized combination of `setup.py` + `requirements.txt`). Both `pip` (with a build backend) and `uv` read it directly.

### Dependency Management Concepts

```text
requirements.txt  : a flat, simple list of exact packages (older/simpler style)
pyproject.toml     : modern, structured project + dependency declaration
lock file (uv.lock)  : pins EXACT versions of every dependency (including sub-dependencies)
                          for fully reproducible installs across machines
```

A **lock file** solves the problem of `requirements.txt` files that only pin your _direct_ dependencies: without locking sub-dependencies too, two installs on different days can silently get different versions of something you never directly asked for.

### Basic Package Structure

```text
hash-gen/
├── pyproject.toml
├── README.md
├── src/
│   └── hash_gen/
│       ├── __init__.py
│       └── cli.py
└── tests/
    └── test_cli.py
```

The `src/` layout (package code nested inside a `src/` folder) is the current best-practice structure: it prevents accidentally importing your package from the local folder instead of the properly installed version, which is a surprisingly common source of confusing bugs in flatter layouts.

### Building a Package (brief overview)

```bash
uv build          # produces a .whl and .tar.gz in dist/
# or:
python -m build
```

This produces distributable artifacts that could, if desired, be published (e.g., to PyPI with `twine upload` or `uv publish`): not something you'll need for every project, but good to recognize when you see `dist/`, `.whl`, or `pyproject.toml`'s `[build-system]` section in a real repo.

### Example

```bash
# starting a brand-new project with uv
uv init hash-gen
cd hash-gen
uv add click
uv add --dev pytest mypy

# your pyproject.toml now lists click as a dependency,
# pytest + mypy as dev-only dependencies

uv run pytest        # runs tests inside the project's isolated environment
uv run mypy src/         # runs the type checker the same way
```

### Explanation

1. `uv init` scaffolds a new project with a `pyproject.toml` already in place.
2. `uv add click` both installs `click` _and_ records it as a declared dependency: one command instead of "install, then remember to also edit requirements.txt."
3. `--dev` marks `pytest`/`mypy` as development-only dependencies: not needed by someone just _using_ your tool, only by someone developing it.
4. `uv run` executes a command inside the project's virtual environment automatically, without needing to manually `activate` first.

### Common Mistakes

```bash
# ❌ Installing packages globally, outside any virtual environment
pip install requests   # (without an active venv): pollutes system Python, causes future conflicts

# ❌ Forgetting to activate a venv before installing: packages silently go to the wrong place

# ❌ Committing .venv/ itself to version control (huge, unnecessary, machine-specific)
# ✅ Instead: commit pyproject.toml / requirements.txt / uv.lock, and .gitignore the venv folder

# ❌ Editing requirements.txt by hand and letting it drift out of sync with what's actually installed
```

### Best Practice

- One virtual environment per project, always.
- Use `pyproject.toml` for new projects over a bare `requirements.txt`.
- Commit the lock file (`uv.lock`) for reproducible installs across machines/CI.
- `.gitignore` the `.venv/` folder itself: it's regenerated from the manifest, never hand-edited.

### Practice

- 🟢 Create a new virtual environment for a throwaway project and install `requests` into it, confirming (`pip list` or `uv pip list`) it doesn't appear in your global Python.
- 🟢 Write a `pyproject.toml` from scratch for a small CLI tool with one dependency and one dev dependency.
- 🟡 Take one of your earlier chapter exercises, turn it into a proper mini-package with a `src/` layout, and get it running via `uv run`.

### Mini Challenge

🟡 Set up your `hash-gen` project (from your existing roadmap) with a clean `src/` layout, a `pyproject.toml` declaring `pytest` as a dev dependency, and at least one real `pytest` test file that runs successfully via `uv run pytest`.

### Exam Question

- What real problem do virtual environments solve?
- What's the difference between what `requirements.txt` and a lock file (like `uv.lock`) each guarantee?
- Why should `.venv/` be excluded from version control?

---

## 25. Networking

### Concept

Before writing network code, you need the vocabulary: IP addresses, ports, TCP/UDP, DNS, and the client/server model: the concepts every networked Python program (sockets, HTTP clients, APIs) sits on top of.

### Why?

Socket and HTTP code will make far more sense once you have a mental model of _what's actually happening_ underneath the Python API calls: especially valuable given your interest in security and pentesting, where understanding the network layer isn't optional.

### IP Addresses and Ports

An **IP address** identifies a machine on a network (e.g., `192.168.1.5`, or `127.0.0.1` for "this same machine": called **localhost**). A **port** identifies a specific _service_ running on that machine (a number from 0–65535). Together, `IP:port` (e.g., `192.168.1.5:443`) uniquely identifies one service on one machine.

```text
192.168.1.5:80    -> a web server on that machine
192.168.1.5:22      -> SSH on that same machine
192.168.1.5:443       -> HTTPS on that same machine
```

Common well-known ports: `80` (HTTP), `443` (HTTPS), `22` (SSH), `21` (FTP), `53` (DNS), `3306` (MySQL).

### TCP vs UDP

```text
TCP (Transmission Control Protocol)
  - Connection-oriented: a handshake establishes a connection first
  - Reliable: guarantees delivery and correct order (retransmits lost packets)
  - Slower overhead, used for: HTTP, SSH, file transfer, anything needing reliability

UDP (User Datagram Protocol)
  - Connectionless: just fires packets, no handshake
  - Unreliable: no guarantee of delivery or order
  - Lower overhead, faster, used for: DNS queries, video streaming, gaming
```

### Client/Server Model

```text
     request
CLIENT ──────────► SERVER
     response
CLIENT ◄──────────
```

A **server** listens on a specific port, waiting for connections. A **client** initiates a connection to a known server address+port. The server typically handles many clients; the client typically talks to one server at a time (per connection).

### DNS

**DNS (Domain Name System)** translates human-readable names (`example.com`) into IP addresses (`93.184.216.34`), since machines route traffic by IP, not by name.

```python
import socket
print(socket.gethostbyname("example.com"))   # resolves the domain to an IP
```

### HTTP (preview: full chapter later)

HTTP is a request/response protocol built **on top of** TCP: a client sends a structured request (method, headers, body), the server sends back a structured response (status code, headers, body). Full details in Chapter 27.

### Example

```python
import socket

def resolve_and_check_port(host: str, port: int) -> None:
    try:
        ip = socket.gethostbyname(host)
        print(f"{host} resolves to {ip}")
    except socket.gaierror:
        print(f"Could not resolve {host}")
        return

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((ip, port))    # returns 0 if the port is open/reachable
    sock.close()

    status = "open" if result == 0 else "closed/filtered"
    print(f"{host}:{port} -> {status}")

resolve_and_check_port("example.com", 80)
```

### Explanation

1. `socket.gethostbyname` performs DNS resolution: turning the domain into an IP address.
2. `socket.socket(AF_INET, SOCK_STREAM)` creates a TCP socket (`AF_INET` = IPv4, `SOCK_STREAM` = TCP: full detail in the next chapter).
3. `connect_ex` attempts a connection and returns an error code instead of raising an exception on failure: `0` means success (port open and reachable).
4. This is a minimal, educational single-port connectivity check: the conceptual seed of what Chapter 26 builds on with real socket programming.

**Only ever run connectivity checks like this against systems you own or have explicit permission to test.**

### Common Mistakes

```python
# ❌ Confusing "port closed" with "host unreachable": connect_ex returning nonzero doesn't
#     always distinguish these; a real tool needs more careful error handling per case

# ❌ Assuming HTTP == web browsing only: HTTP is used for APIs, webhooks, and much more

# ❌ Not setting a timeout: a hung connection attempt can block a script indefinitely
sock.connect((ip, port))   # ❌ no timeout: could hang forever on a filtered port
```

### Best Practice

- Always set a timeout on network operations: an unresponsive host shouldn't hang your entire program.
- Understand the layer you're working at: DNS resolves names, TCP/UDP move bytes, HTTP structures those bytes into requests/responses.
- Only test hosts/ports you're authorized to test.

### Practice

- 🟢 Use `socket.gethostbyname()` to resolve 3 different domain names and print their IPs.
- 🟢 Explain, in your own words, why DNS is needed at all: why not just use IP addresses everywhere?
- 🟡 Write a function that checks whether a given port is open on `localhost` (127.0.0.1), with a 1-second timeout.

### Mini Challenge

🟠 Extend the port-check example into a tiny scanner that checks a _list_ of common ports (80, 443, 22, 21, 3306) against a single host you own or control (e.g., your own machine, `127.0.0.1`), and prints a clean open/closed report for each.

### Exam Question

- What's the practical difference between TCP and UDP, and why does HTTP use TCP?
- What does DNS actually do, in one sentence?
- Why is setting a timeout important for any network operation?

---

## 26. Socket Programming

### Concept

The `socket` module gives direct access to the OS's networking layer: this is how HTTP libraries, SSH clients, and every other network tool are ultimately built, just at a lower level than you'll normally work at.

### Why?

Understanding sockets demystifies _everything_ built on top of them, and hand-rolling simple network tools (a scanner, a basic chat server, a protocol) is one of the best ways to deeply understand how networked systems actually behave: highly relevant to red teaming, where you'll often need to understand exactly what's happening at this layer.

> Every example in this chapter is for **local, educational use only**: run clients/servers against `localhost` or systems you explicitly own/control.

### Core Socket Functions

```python
socket()      # create a new socket
bind()          # attach a socket to a specific address+port (server side)
listen()          # start listening for incoming connections (server side)
accept()            # accept an incoming connection, returns a new socket for that client
connect()             # connect to a server (client side)
send() / sendall()      # send data
recv()                     # receive data
close()                       # close the socket
```

### 1. Basic TCP Server

```python
# server.py
import socket

HOST = "127.0.0.1"
PORT = 65432

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen(1)
print(f"Listening on {HOST}:{PORT}")

conn, addr = server.accept()      # blocks here until a client connects
print(f"Connected by {addr}")

data = conn.recv(1024)              # receive up to 1024 bytes
print(f"Received: {data!r}")

conn.sendall(b"Hello from server")
conn.close()
server.close()
```

### 2. Basic TCP Client

```python
# client.py
import socket

HOST = "127.0.0.1"
PORT = 65432

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((HOST, PORT))
client.sendall(b"Hello from client")

data = client.recv(1024)
print(f"Received: {data!r}")

client.close()
```

Run `server.py` first, then `client.py` in a second terminal: you'll see them exchange one message each.

### 3. Handling Multiple Clients (threaded server)

```python
# threaded_server.py
import socket
import threading

def handle_client(conn: socket.socket, addr) -> None:
    print(f"Connected by {addr}")
    with conn:
        while True:
            data = conn.recv(1024)
            if not data:      # empty bytes means the client disconnected
                break
            conn.sendall(data.upper())    # simple "echo, but uppercase" protocol

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)   # allow quick restart
server.bind(("127.0.0.1", 65432))
server.listen()
print("Server listening...")

while True:
    conn, addr = server.accept()
    thread = threading.Thread(target=handle_client, args=(conn, addr), daemon=True)
    thread.start()
```

Each connected client gets its own thread (Chapter 29 covers threading in depth), so the server can handle multiple clients simultaneously instead of one at a time.

### 4. Echo Server / Client (full round-trip pattern)

The threaded server above already implements an "echo" server (returns whatever it receives, uppercased). A minimal echo _client_ loop:

```python
# echo_client.py
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(("127.0.0.1", 65432))

while True:
    message = input("Send: ")
    if message == "quit":
        break
    client.sendall(message.encode())
    response = client.recv(1024)
    print(f"Echo: {response.decode()}")

client.close()
```

### 5. Simple Multi-Client Chat Server (concept)

Building on the threaded server: keep a shared list of connected client sockets, and when one client sends a message, loop through the list and `sendall()` it to every _other_ connected client. The key new idea is a shared, thread-safe list of active connections (needs a `threading.Lock`: covered in Chapter 29: to avoid race conditions when clients connect/disconnect concurrently).

### 6. File Transfer Example (concept)

To send a file over a socket: first send its size (as a fixed-length header, e.g., 8 bytes representing an integer), then send the file's bytes in chunks (`sock.sendall(chunk)` in a loop reading from the file). The receiver reads the header first to know exactly how many bytes to expect, then reads that many bytes total, writing them to a new file: because TCP is a _stream_, not "one message per `send()` call," the receiver can't just call `recv()` once and assume it got everything.

### `select`: handling many sockets without threads (concept)

```python
import select

readable, writable, exceptional = select.select(sockets_to_watch, [], [], timeout)
```

`select()` lets a single-threaded program monitor many sockets at once and react only when one actually has data ready: an alternative to spawning a thread per connection. `asyncio` (Chapter 28) is the modern, higher-level evolution of this same idea.

### Simple Protocol Design

A "protocol" here just means: an agreed-upon message format both sides understand. Even something simple like:

```text
COMMAND|ARG1|ARG2\n
```

...is a protocol. Real protocols (HTTP, SSH, custom tool protocols) are the same idea, just more formally specified. When designing your own:

- Decide how a message's **boundaries** are marked (a delimiter like `\n`, or a length-prefixed header, as in the file-transfer example).
- Decide the **structure** of each message (fixed fields? key-value pairs? JSON?).
- Handle **partial reads**: TCP can deliver your message split across multiple `recv()` calls, or multiple messages combined into one `recv()` call. Never assume one `recv()` == one message.

### Common Mistakes

```python
# ❌ Assuming recv() gets the WHOLE message in one call
data = conn.recv(1024)   # might be a PARTIAL message, or MULTIPLE messages concatenated

# ❌ Forgetting to close sockets (use `with conn:` or explicit .close())

# ❌ Not handling an empty recv() (b"") as "the other side disconnected"
while True:
    data = conn.recv(1024)
    # if data is b"", this loops forever doing nothing useful: must check and break

# ❌ Hardcoding a fixed buffer size and assuming it's always enough for any message

# ❌ Testing/scanning hosts you don't own or have permission to test
```

### Best Practice

- Always define a clear message boundary/protocol: never assume `recv()` aligns perfectly with your logical messages.
- Use `with` (sockets support the context manager protocol) or explicit `.close()` in a `finally` block.
- Set timeouts (`sock.settimeout(seconds)`) to avoid indefinite hangs.
- Only ever run these against `localhost` or systems you're explicitly authorized to test.

### Practice

- 🟢 Run the basic TCP server and client examples yourself, on `localhost`, and confirm the message exchange works.
- 🟢 Modify the echo server to reverse the received message instead of uppercasing it.
- 🟡 Modify the threaded server to keep a count of how many total connections it has served, printed to the console each time a client disconnects.

### Mini Challenge

🟠 Build a simple length-prefixed message protocol: sender sends a 4-byte big-endian integer (the message length) followed by that many bytes of UTF-8 text; receiver reads the 4-byte header first, then reads exactly that many bytes total (looping on `recv()` until it has everything) before decoding and printing the message. Test it with a message deliberately longer than your `recv()` buffer size, to confirm your receiver correctly handles multiple `recv()` calls for one message.

### Exam Question

- Why can't you assume one `recv()` call returns exactly one "logical" message?
- What does an empty bytes object (`b""`) from `recv()` signal?
- Why does a threaded server let it handle multiple clients "at once," in your own words?

---

## 27. HTTP Programming

### Concept

HTTP structures communication between clients and servers as **requests** (method, URL, headers, optional body) and **responses** (status code, headers, body): the protocol underneath virtually every web API you'll ever call.

### Why?

Consuming APIs is one of the most common real-world Python tasks: pulling data from services, automating web interactions, and (relevant to your interests) interacting with web applications during testing.

### HTTP Requests and Responses

```text
REQUEST:
GET /users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer abc123

RESPONSE:
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 42, "name": "Lichi"}
```

### HTTP Methods

```text
GET    : retrieve data, no body, should not change server state
POST   : create something new, typically with a body
PUT    : replace/update a resource entirely, with a body
PATCH  : partially update a resource
DELETE : remove a resource
```

### Status Codes

```text
2xx  Success       : 200 OK, 201 Created, 204 No Content
3xx  Redirection    : 301 Moved Permanently, 302 Found
4xx  Client Error     : 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests
5xx  Server Error       : 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable
```

### Headers, Query Parameters, Request Bodies

```text
Headers         : metadata about the request/response (auth tokens, content type, user agent)
Query parameters: ?key=value pairs appended to a URL (GET /search?q=python&limit=10)
Request body      : the actual payload sent with POST/PUT/PATCH, often JSON
```

### `urllib` (standard library, no install needed)

```python
import urllib.request
import json

with urllib.request.urlopen("https://api.example.com/data") as response:
    data = json.loads(response.read())
```

Built into Python, so no dependency needed, but noticeably more verbose than the alternatives below: mostly seen in minimal-dependency scripts or older code.

### `requests` (the most popular third-party library)

```python
import requests

response = requests.get("https://api.example.com/users/42")
print(response.status_code)     # 200
print(response.json())            # parsed JSON body, as a Python dict

response = requests.post(
    "https://api.example.com/users",
    json={"name": "Lichi", "role": "student"},
    headers={"Authorization": "Bearer abc123"},
)

response = requests.get(
    "https://api.example.com/search",
    params={"q": "python", "limit": 10},   # becomes ?q=python&limit=10
)
```

`requests` is synchronous (blocks until each call finishes), simple, and extremely widely used: the default choice for most scripts and small tools.

### `httpx` (modern alternative, sync AND async)

```python
import httpx

response = httpx.get("https://api.example.com/data")
print(response.json())

# httpx ALSO supports async (pairs with Chapter 28):
import asyncio

async def fetch():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
        return response.json()

asyncio.run(fetch())
```

### When to Use Each

```text
urllib   : zero dependencies needed, simple one-off requests, or dependency-constrained environments
requests : the default choice for most synchronous scripts: simple, mature, huge ecosystem
httpx    : needed when you want async support, or requests' modern near-drop-in replacement
```

### Error Handling and Timeouts

```python
import requests

try:
    response = requests.get("https://api.example.com/data", timeout=5)
    response.raise_for_status()      # raises an exception for 4xx/5xx status codes
    data = response.json()
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.ConnectionError:
    print("Could not connect")
```

**Always set a `timeout`.** Without one, `requests` will wait indefinitely for a slow or unresponsive server: a single hung request can freeze an entire script.

### Retries

```python
import time
import requests

def get_with_retries(url: str, retries: int = 3, backoff: float = 1.0):
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(backoff * (attempt + 1))    # simple linear backoff
```

### Example

```python
import requests

def fetch_user(user_id: int) -> dict | None:
    try:
        response = requests.get(
            f"https://jsonplaceholder.typicode.com/users/{user_id}",
            timeout=5,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError:
        print(f"User {user_id} not found or server error")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

user = fetch_user(1)
if user:
    print(f"{user['name']} <{user['email']}>")
```

### Explanation

1. `timeout=5` guarantees the request won't hang indefinitely.
2. `raise_for_status()` turns any 4xx/5xx response into a raised `HTTPError`: so a "successful call that got an error response" is handled the same way as a network failure, via `except`, instead of needing a separate manual status-code check.
3. Two separate `except` blocks distinguish "the server responded with an error" from "the request never even completed": different situations that might warrant different handling in a bigger program.

### Common Mistakes

```python
# ❌ No timeout: can hang forever
requests.get(url)

# ❌ Not checking status codes
response = requests.get(url)
data = response.json()   # might be an error page's JSON (or not JSON at all!), not real data

# ❌ Assuming response.json() always works
response = requests.get(url)
data = response.json()   # ❌ raises if the response isn't valid JSON

# ❌ Building query strings manually instead of using params=
url = f"https://api.example.com/search?q={query}"   # doesn't properly URL-encode special characters
```

### Best Practice

- Always set a `timeout`.
- Always call `raise_for_status()` (or manually check `response.status_code`) before trusting the body.
- Use `params=` for query strings, `json=` for JSON bodies: let the library handle encoding.
- Use `httpx` when you need async; `requests` otherwise, for its simplicity and ecosystem maturity.

### Practice

- 🟢 Use `requests` to `GET` a public test API (e.g., `https://jsonplaceholder.typicode.com/posts/1`) and print the response JSON.
- 🟢 Add a `timeout` and `try`/`except` around that request, and test what happens when you point it at an unreachable URL.
- 🟡 Write a function that `POST`s a JSON payload to a test endpoint and returns `True`/`False` based on the response status code.

### Mini Challenge

🟠 Write a small CLI weather-lookup tool (using any free public weather API) that takes a city name as a command-line argument, handles network errors, missing-city errors, and timeouts gracefully, and prints a clean one-line summary: no crashes on any bad input.

### Exam Question

- Why is setting a `timeout` on every network request non-negotiable in production code?
- What does `raise_for_status()` actually check, and why is it useful?
- When would you choose `httpx` over `requests`?

---

## 28. Async Python

### Concept

Asynchronous programming lets a single thread handle many I/O-bound operations (network calls, file reads, sleeps) **concurrently**, by voluntarily pausing at `await` points instead of blocking: so while one operation is waiting on the network, the program can work on something else.

### Why?

For I/O-heavy tasks (calling many APIs, handling many simultaneous network connections), async can be dramatically faster than doing things one at a time: without the complexity and overhead of spinning up real OS threads or processes for each one.

### What "Asynchronous" Actually Means

```text
SYNCHRONOUS (blocking):
call_api_1()  ─wait 2s─►  call_api_2()  ─wait 2s─►  call_api_3()  ─wait 2s─►  done
Total: ~6 seconds, one at a time

ASYNCHRONOUS (concurrent):
call_api_1()  ┐
call_api_2()  ├─ all waiting on network AT THE SAME TIME ─► done
call_api_3()  ┘
Total: ~2 seconds (roughly the time of the SLOWEST single call)
```

Async doesn't make any _individual_ operation faster: it lets you overlap the _waiting time_ of many operations, which is where the real-world speedup comes from for I/O-bound work.

### `async def` and `await`

```python
import asyncio

async def say_hello():
    print("Hello...")
    await asyncio.sleep(1)     # pauses THIS coroutine, lets others run meanwhile
    print("...world")

asyncio.run(say_hello())
```

- `async def` defines a **coroutine function**: calling it doesn't run the body immediately, it returns a coroutine object (similar in spirit to how calling a generator function doesn't run it immediately either: Chapter 15).
- `await` pauses the current coroutine at that point, yielding control back to the **event loop**, until the awaited thing completes.
- `asyncio.run(...)` starts the event loop and runs a coroutine to completion: the standard entry point.

### The Event Loop

The **event loop** is the engine that runs coroutines, switching between them whenever one hits an `await` and is waiting on something. It's a single thread: async concurrency comes from _cooperative_ pausing/resuming, not from parallel execution across CPU cores (that's what multiprocessing is for: Chapter 29).

### Coroutine, Task, Future, Awaitable

```text
Coroutine : the result of calling an `async def` function; represents work not yet started/scheduled
Task      : a coroutine that's been SCHEDULED to run on the event loop (via create_task)
Future    : a lower-level, more general "eventually has a result" object; Tasks are built on Futures
Awaitable : anything usable with `await` (coroutines, Tasks, Futures all qualify)
```

### `asyncio.create_task()`: running things concurrently

```python
import asyncio

async def fetch(name: str, delay: int):
    print(f"Starting {name}")
    await asyncio.sleep(delay)
    print(f"Finished {name}")
    return f"{name} result"

async def main():
    task1 = asyncio.create_task(fetch("A", 2))
    task2 = asyncio.create_task(fetch("B", 1))
    # both tasks are now running "concurrently": task2 will actually finish FIRST

    result1 = await task1
    result2 = await task2
    print(result1, result2)

asyncio.run(main())
# Starting A
# Starting B
# Finished B      <- finishes first, even though started second, because its delay is shorter
# Finished A
```

If you just did `await fetch("A", 2)` then `await fetch("B", 1)` directly (without `create_task`), they'd run **sequentially**, taking 3 seconds total instead of 2: `create_task` is what actually makes them run concurrently.

### `asyncio.gather()`

```python
async def main():
    results = await asyncio.gather(
        fetch("A", 2),
        fetch("B", 1),
        fetch("C", 3),
    )
    print(results)   # ['A result', 'B result', 'C result']: waits for ALL to finish

asyncio.run(main())
```

`gather()` runs multiple awaitables concurrently and collects all their results in order, once every one of them has finished: the common pattern for "fetch N things at once, then use them all together."

### `asyncio.TaskGroup` (3.11+, the modern preferred way)

```python
async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch("A", 2))
        task2 = tg.create_task(fetch("B", 1))
    # by the time we exit the `async with` block, BOTH tasks are guaranteed done
    print(task1.result(), task2.result())
```

`TaskGroup` is the modern replacement for many `gather()` use cases: it handles error propagation more robustly (if one task fails, the others are automatically cancelled, and errors are collected via exception groups: Chapter 14).

### Cancellation and Timeouts

```python
async def main():
    try:
        async with asyncio.timeout(2):     # 3.11+
            await fetch("slow_task", 10)
    except TimeoutError:
        print("Task took too long, cancelled")
```

```python
task = asyncio.create_task(fetch("A", 10))
await asyncio.sleep(1)
task.cancel()    # requests cancellation; the coroutine gets a CancelledError raised inside it
```

### Async Context Managers and Iterators

```python
class AsyncResource:
    async def __aenter__(self):
        print("Acquiring resource")
        await asyncio.sleep(0.1)
        return self

    async def __aexit__(self, *args):
        print("Releasing resource")
        await asyncio.sleep(0.1)

async def main():
    async with AsyncResource() as resource:
        print("Using resource")

asyncio.run(main())
```

```python
async def async_range(n: int):
    for i in range(n):
        await asyncio.sleep(0.1)
        yield i          # an ASYNC GENERATOR: yields inside an async def

async def main():
    async for num in async_range(5):
        print(num)
```

`__aenter__`/`__aexit__` are the async equivalents of `__enter__`/`__exit__` (Chapter 17), used with `async with`. Async generators (`async def` + `yield`) work with `async for`, for cases where each "next value" itself requires an async operation to produce.

### sync vs threading vs multiprocessing vs asyncio: when to use which

```text
                  Good for I/O-bound   Good for CPU-bound   Parallel execution   Overhead
sync (plain)      no (one at a time)   yes (but blocks)      no                   none
threading         yes                  no (GIL limits it)    no* (see Ch. 29)     low
multiprocessing   yes                  yes                   yes                  high
asyncio           yes (best for MANY   no                    no                   very low
                  concurrent I/O ops)
```

**Rule of thumb:**

- Many concurrent network calls / I/O waits → **asyncio** (most efficient for large numbers of concurrent I/O operations)
- A moderate number of blocking I/O calls, working with libraries that aren't async-aware → **threading**
- Heavy CPU computation that needs to use multiple cores → **multiprocessing**
- One simple, sequential task → plain **sync** code: don't add async complexity you don't need

Full depth on threading/multiprocessing/the GIL is next, in Chapter 29.

### Example

```python
import asyncio
import time

async def check_host(name: str, delay: float) -> str:
    await asyncio.sleep(delay)   # simulates a network call
    return f"{name}: reachable ({delay}s)"

async def main():
    start = time.perf_counter()

    async with asyncio.TaskGroup() as tg:
        tasks = [
            tg.create_task(check_host(f"host{i}", delay))
            for i, delay in enumerate([1.0, 0.5, 1.5, 0.8], start=1)
        ]

    for task in tasks:
        print(task.result())

    print(f"Total time: {time.perf_counter() - start:.2f}s")

asyncio.run(main())
```

### Explanation

1. Four "host checks" are created as tasks inside one `TaskGroup`, all starting essentially simultaneously.
2. Even though the delays sum to 3.8 seconds, the **total** run time is roughly 1.5 seconds: the length of the _longest_ individual delay: because they all run concurrently.
3. This is the core payoff of async for I/O-bound work: many operations overlap their waiting time instead of stacking it up sequentially.

### Common Mistakes

```python
# ❌ Awaiting sequentially when you meant to run concurrently
result1 = await fetch("A", 2)
result2 = await fetch("B", 1)   # this doesn't start until fetch("A") is DONE: no concurrency gained!

# ✅ Fix
result1, result2 = await asyncio.gather(fetch("A", 2), fetch("B", 1))

# ❌ Using time.sleep() instead of asyncio.sleep() inside a coroutine
async def bad():
    time.sleep(2)   # ❌ BLOCKS the entire event loop: nothing else can run meanwhile!

# ❌ Forgetting asyncio.run() and just calling a coroutine directly
say_hello()   # ❌ does nothing but return a coroutine object: never actually executes

# ❌ Mixing blocking, CPU-heavy code into async functions expecting it to speed up: it won't;
#    asyncio doesn't help CPU-bound work, only I/O-bound waiting
```

### Best Practice

- Use `create_task`/`gather`/`TaskGroup` whenever you want operations to actually run concurrently: plain sequential `await` gives you no concurrency benefit at all.
- Never use blocking calls (`time.sleep`, blocking `requests.get`) inside async code: use their async equivalents (`asyncio.sleep`, `httpx.AsyncClient`).
- Prefer `TaskGroup` over `gather()` in new code (3.11+) for cleaner error handling.
- Reach for asyncio specifically for I/O-bound concurrency: not as a general "make it faster" tool.

### Practice

- 🟢 Write two coroutines that each `asyncio.sleep()` for a different duration, and run them sequentially vs concurrently (with `gather`), timing both to see the difference.
- 🟢 Deliberately use `time.sleep()` inside an `async def` function running alongside another coroutine, and observe how it blocks everything.
- 🟡 Write an async function `fetch_all(urls: list[str])` using `httpx.AsyncClient` and `asyncio.gather` that fetches multiple URLs concurrently and returns their status codes.

### Mini Challenge

🟠 Build an async "host checker" that takes a list of 10 fake hosts (each simulated with a random `asyncio.sleep` between 0.1–2 seconds, and a random chance of "failing"), runs all checks concurrently with a `TaskGroup`, and prints a final summary of which succeeded/failed and the total elapsed time: compare the elapsed time to what a fully sequential version would have taken.

### Exam Question

- Why doesn't async make any single operation run faster?
- What's the difference in behavior between `await fetch(...)` called twice in a row, vs wrapping both in `asyncio.gather()`?
- Why is calling `time.sleep()` inside a coroutine a serious mistake?

---

## 29. Concurrency and Parallelism

### Concept

**Concurrency** means dealing with multiple tasks by interleaving their progress (not necessarily at the exact same instant). **Parallelism** means actually running multiple tasks at the exact same instant, on multiple CPU cores. Python gives you three tools: threading, multiprocessing, and asyncio: each suited to different situations.

### Why?

Picking the wrong concurrency tool for the job is a common, costly mistake: threading won't speed up CPU-heavy work in Python (because of the GIL, explained below), and multiprocessing has real overhead that's wasted on I/O-bound work asyncio would handle better.

### The GIL, in Simple Language

**GIL = Global Interpreter Lock.** In CPython (the standard Python implementation), only **one thread** can execute Python bytecode at any given instant, even on a multi-core machine: the GIL enforces this.

```text
Without GIL (conceptually, what you might expect):
Core 1: thread A running Python code
Core 2: thread B running Python code AT THE SAME TIME

With the GIL (what ACTUALLY happens in CPython):
Core 1: thread A running Python code
Core 2: thread B is WAITING for the GIL, even though the core is free
(threads take turns holding the GIL, switching rapidly, but never truly simultaneous
 for pure Python code)
```

**Why does this matter?** Threading in Python does **not** give you true parallelism for CPU-bound Python code: multiple threads doing heavy computation don't actually run at the same time; they take turns. Threading _does_ still help for I/O-bound work, because a thread waiting on the network/disk releases the GIL while it waits, letting another thread run.

_(Note: newer CPython versions have experimental work toward an optional "free-threaded" build without the GIL, but as of this writing it's not yet the default: the GIL is still the standard behavior to plan around.)_

### Threading: for I/O-bound work

```python
import threading
import time

def download(name: str, delay: float) -> None:
    print(f"Starting {name}")
    time.sleep(delay)     # simulates a blocking I/O wait: releases the GIL while waiting
    print(f"Finished {name}")

threads = [
    threading.Thread(target=download, args=(f"file{i}", 1))
    for i in range(5)
]

start = time.perf_counter()
for t in threads:
    t.start()
for t in threads:
    t.join()      # wait for this thread to finish before continuing
print(f"Total: {time.perf_counter() - start:.2f}s")   # ~1s, not ~5s: they overlapped their waiting
```

`.start()` begins running the thread; `.join()` blocks the main program until that thread finishes. Without `.join()`, the main program could exit before the threads finish their work.

### Threading Pitfalls: Race Conditions

```python
import threading

counter = 0

def increment():
    global counter
    for _ in range(100_000):
        counter += 1     # NOT atomic! read-modify-write can be interrupted mid-operation

threads = [threading.Thread(target=increment) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(counter)   # often NOT 400,000: a classic race condition!
```

`counter += 1` looks like one step, but is really three: read `counter`, add 1, write it back. Two threads can interleave these steps and lose an update. Fix with a **lock**:

```python
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100_000):
        with lock:          # only ONE thread can hold the lock at a time
            counter += 1

# now counter reliably ends up at 400,000
```

### Multiprocessing: for CPU-bound work

```python
import multiprocessing
import time

def cpu_heavy_task(n: int) -> int:
    total = 0
    for i in range(n):
        total += i * i
    return total

if __name__ == "__main__":     # REQUIRED on some platforms for multiprocessing
    start = time.perf_counter()

    with multiprocessing.Pool(processes=4) as pool:
        results = pool.map(cpu_heavy_task, [10_000_000] * 4)

    print(f"Total: {time.perf_counter() - start:.2f}s")
    print(results)
```

`multiprocessing` runs each task in a **separate OS process**, each with its own Python interpreter and memory space: completely sidestepping the GIL, since each process has its own. This gives _true_ parallelism for CPU-bound work, at the cost of higher overhead (starting a process is more expensive than starting a thread) and the need to explicitly share data between processes (they don't share memory by default, unlike threads).

`if __name__ == "__main__":` is **required** when using `multiprocessing` on some platforms (notably Windows, and when using the `spawn` start method): without it, child processes can re-import and re-execute your whole script, causing infinite process spawning. Always include it as a habit.

### Sharing Data Across Processes

```python
from multiprocessing import Pool, Manager

def worker(shared_list, item):
    shared_list.append(item * 2)

if __name__ == "__main__":
    with Manager() as manager:
        shared_list = manager.list()
        with Pool(4) as pool:
            pool.starmap(worker, [(shared_list, i) for i in range(5)])
        print(list(shared_list))
```

Since processes don't share memory, `multiprocessing.Manager()` provides special proxy objects (`manager.list()`, `manager.dict()`) that _can_ be safely shared and updated across processes: at the cost of some overhead per access, since it involves inter-process communication under the hood.

### Choosing the Right Tool: CPU-bound vs I/O-bound

```text
TASK TYPE                    BEST TOOL
─────────────────────────────────────────
CPU-bound (heavy computation, no waiting)   → multiprocessing
I/O-bound, few operations, blocking libs    → threading
I/O-bound, MANY concurrent operations       → asyncio
File I/O (usually fast, local)                → often fine sync, or threading if bulk
Network tasks (many requests)                   → asyncio (most efficient) or threading
```

### Example

```python
import time
import multiprocessing
import threading

def cpu_task(n):
    return sum(i * i for i in range(n))

def io_task(delay):
    time.sleep(delay)

def run_sequential(n_tasks, work_size, is_cpu):
    start = time.perf_counter()
    for _ in range(n_tasks):
        cpu_task(work_size) if is_cpu else io_task(work_size)
    return time.perf_counter() - start

def run_threaded(n_tasks, work_size, is_cpu):
    start = time.perf_counter()
    target = cpu_task if is_cpu else io_task
    threads = [threading.Thread(target=target, args=(work_size,)) for _ in range(n_tasks)]
    for t in threads: t.start()
    for t in threads: t.join()
    return time.perf_counter() - start

if __name__ == "__main__":
    print("I/O-bound (sleep):")
    print(f"  Sequential: {run_sequential(4, 0.5, is_cpu=False):.2f}s")
    print(f"  Threaded:   {run_threaded(4, 0.5, is_cpu=False):.2f}s")   # threading WINS here

    print("CPU-bound (sum of squares):")
    print(f"  Sequential: {run_sequential(4, 3_000_000, is_cpu=True):.2f}s")
    print(f"  Threaded:   {run_threaded(4, 3_000_000, is_cpu=True):.2f}s")   # threading barely helps (GIL)
```

### Explanation

Running this yourself is more convincing than reading about it: for the I/O-bound case, threading gives a real, large speedup (the GIL is released during `time.sleep`). For the CPU-bound case, threading gives little to no speedup (the GIL prevents true parallel execution of Python bytecode): you'd need `multiprocessing.Pool` instead to see a real improvement there.

### Common Mistakes

```python
# ❌ Expecting threading to speed up CPU-bound work
threads = [threading.Thread(target=cpu_heavy_function) for _ in range(4)]
# barely faster than sequential: GIL prevents true parallel Python execution

# ❌ Forgetting locks around shared mutable state accessed by multiple threads
counter += 1   # race condition without a lock

# ❌ Forgetting if __name__ == "__main__": with multiprocessing
# (causes runaway process spawning on some platforms)

# ❌ Assuming multiprocessing shares memory like threading does
results = []
def worker(n):
    results.append(n)   # ❌ each process has its OWN copy of `results`: the main process never sees these appends
```

### Best Practice

- CPU-bound → `multiprocessing`. I/O-bound with many operations → `asyncio`. I/O-bound with a moderate number of operations, or working with non-async libraries → `threading`.
- Always use a `Lock` (or other synchronization primitive) around shared mutable state accessed by multiple threads.
- Always guard multiprocessing entry points with `if __name__ == "__main__":`.
- Don't assume more threads/processes always means faster: measure. Overhead is real, and beyond a certain point, more workers can even make things slower.

### Practice

- 🟢 Run 4 I/O-bound tasks (using `time.sleep`) sequentially, then with threading, and time both: confirm threading wins.
- 🟢 Run 4 CPU-bound tasks (a heavy loop) sequentially, then with threading, and time both: confirm threading barely helps.
- 🟡 Fix a deliberately broken race-condition counter example (like the one above) using a `threading.Lock`.

### Mini Challenge

🟠 Rewrite the CPU-bound example using `multiprocessing.Pool` instead of threading, and confirm it _does_ show a real speedup over sequential execution: then explain in your own words exactly why multiprocessing succeeds where threading failed for this specific workload.

### Exam Question

- What does the GIL actually prevent, precisely?
- Why does threading help with I/O-bound work despite the GIL?
- Why is `if __name__ == "__main__":` required for safe `multiprocessing` usage?

---

## 30. Databases (SQLite)

### Concept

`sqlite3` (built into Python's standard library) lets you store and query structured data in a real relational database, without installing or running a separate database server.

### Why?

SQLite is the most practical way to add persistent, structured, queryable storage to a Python tool: no server setup, the whole database is a single file, and it's genuinely production-grade for many use cases (not just a toy).

### Connecting and Basic Queries

```python
import sqlite3

conn = sqlite3.connect("app.db")     # creates the file if it doesn't exist
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER
    )
""")

conn.commit()      # writes are NOT saved until you commit
conn.close()
```

### Inserting Data: Parameterized Queries

```python
import sqlite3

conn = sqlite3.connect("app.db")
cursor = conn.cursor()

cursor.execute(
    "INSERT INTO users (name, age) VALUES (?, ?)",
    ("Lichi", 20),
)
conn.commit()

users_to_add = [("Guest1", 25), ("Guest2", 30)]
cursor.executemany(
    "INSERT INTO users (name, age) VALUES (?, ?)",
    users_to_add,
)
conn.commit()
```

### SQL Injection and Why Parameterized Queries Matter

```python
# ❌ DANGEROUS: building SQL with string formatting
name = "Lichi'; DROP TABLE users; --"
cursor.execute(f"INSERT INTO users (name) VALUES ('{name}')")
# the attacker-controlled string breaks OUT of the intended query and injects new SQL!

# ✅ SAFE: parameterized query, the DB driver handles escaping correctly
cursor.execute("INSERT INTO users (name) VALUES (?)", (name,))
# the malicious string is treated as pure DATA, never as SQL syntax, no matter what it contains
```

**Never build SQL queries with string formatting/concatenation using untrusted (or even just variable) input.** The `?` placeholder syntax tells the database driver "this is data, not code": it handles all escaping correctly, and it's immune to this entire class of attack. This is directly relevant to your security interests: SQL injection remains one of the most common and dangerous real-world vulnerabilities, and the fix is almost always exactly this: always use parameterized queries.

### Querying Data

```python
cursor.execute("SELECT id, name, age FROM users WHERE age > ?", (18,))
rows = cursor.fetchall()      # get ALL matching rows as a list of tuples
for row in rows:
    print(row)   # (1, 'Lichi', 20)

cursor.execute("SELECT * FROM users WHERE id = ?", (1,))
row = cursor.fetchone()         # get just ONE row (or None)
```

### Row Factory: dict-like rows

```python
conn = sqlite3.connect("app.db")
conn.row_factory = sqlite3.Row     # rows behave like dicts AND tuples
cursor = conn.cursor()

cursor.execute("SELECT * FROM users WHERE id = ?", (1,))
row = cursor.fetchone()
print(row["name"], row["age"])       # access by column name, much more readable than row[1], row[2]
```

### Transactions, Commit, Rollback

```python
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

try:
    cursor.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    cursor.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    conn.commit()      # both updates succeed together, or...
except sqlite3.Error:
    conn.rollback()      # ...neither does: the transaction is undone entirely
    raise
```

A **transaction** groups multiple operations so they succeed or fail _together_: critical for operations like a money transfer, where you never want "money left one account" without also "money arrived in the other."

### Using `with` for Connections

```python
with sqlite3.connect("app.db") as conn:
    conn.execute("INSERT INTO users (name, age) VALUES (?, ?)", ("Lichi", 20))
    # auto-commits on successful exit, auto-rollbacks on an exception
```

Note: unlike file objects, `sqlite3` connections used as a context manager handle the **transaction** (commit/rollback), not closing the connection itself: you still typically call `conn.close()` separately, or wrap the whole thing in a `try`/`finally`.

### Database Design Basics

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

- **Primary key**: uniquely identifies each row.
- **Foreign key**: links a row to a row in another table (here, each `post` belongs to one `user`), enforcing referential integrity.
- Basic normalization idea: don't repeat the same data (like a user's full name) across many rows in another table: reference it by ID instead.

### Example

```python
import sqlite3
from contextlib import closing

DB_PATH = "notes.db"

def init_db() -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

def add_note(content: str) -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.execute("INSERT INTO notes (content) VALUES (?)", (content,))
        conn.commit()

def list_notes() -> list[sqlite3.Row]:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.execute("SELECT * FROM notes ORDER BY created_at DESC")
        return cursor.fetchall()

init_db()
add_note("Finish security chapter")
add_note("Review pentest roadmap")

for note in list_notes():
    print(f"[{note['id']}] {note['content']} ({note['created_at']})")
```

### Explanation

1. `closing(sqlite3.connect(...))` (from `contextlib`) ensures the connection is closed properly even if something fails, since `sqlite3.Connection` doesn't close itself via `with` automatically.
2. `init_db` creates the table only if it doesn't already exist: safe to call every time the program starts.
3. `add_note` uses a parameterized query, safe against injection even though this example doesn't take untrusted input.
4. `list_notes` uses `row_factory = sqlite3.Row` so results can be accessed by column name: this is a minimal but complete CLI-notes-app data layer (ties directly into Chapter 38's project list).

### Common Mistakes

```python
# ❌ SQL injection via string formatting
cursor.execute(f"SELECT * FROM users WHERE name = '{user_input}'")

# ❌ Forgetting conn.commit(): writes silently don't persist
cursor.execute("INSERT INTO users (name) VALUES (?)", ("Lichi",))
conn.close()   # ❌ never committed! the insert is lost

# ❌ Forgetting to close connections, leaking file handles over a long-running program

# ❌ Not using transactions for multi-step operations that must succeed/fail together
```

### Best Practice

- **Always** use parameterized queries (`?` placeholders): never string-format SQL with variable data, ever.
- Always `commit()` after writes (or use `with conn:` for automatic transaction handling).
- Use `sqlite3.Row` as the row factory for readable, dict-like access.
- Wrap multi-step writes in explicit transactions with rollback on error.

### Practice

- 🟢 Create a `users` table and insert 3 rows using parameterized queries.
- 🟢 Query all users older than a given age and print the results using `sqlite3.Row`.
- 🟡 Write a function `transfer_balance(from_id, to_id, amount)` that updates two rows inside a single transaction, rolling back cleanly if either update fails.

### Mini Challenge

🟠 Build a small SQLite-backed "expense tracker": a table for expenses (`amount`, `category`, `date`), functions to add an expense and to query total spending by category, and a simple CLI loop (using `input()`) to add and view expenses. (Ties directly into Chapter 38's project list.)

### Exam Question

- Why does parameterizing a query prevent SQL injection, in your own words?
- What's the difference between `commit()` and `rollback()`, and when would you call each?
- What does a foreign key enforce between two tables?

---

## 31. APIs

### Concept

An API (Application Programming Interface) here means a web service you interact with over HTTP. Chapter 27 covered the mechanics of making HTTP requests; this chapter focuses on the parts specific to working with real-world APIs: the remaining verbs, authentication, and putting it together into a small CLI tool.

### Why?

Nearly every external service you'll touch, whether it's a weather service, a threat-intelligence feed, or an internal company tool, is exposed as an API. Knowing how to build a clean, reusable client for one means you can build a client for any of them.

### The Full Verb Set, in Practice

```python
import requests

BASE_URL: str = "https://api.example.com"

requests.get(f"{BASE_URL}/tasks/1")                                  # read one
requests.post(f"{BASE_URL}/tasks", json={"title": "New task"})         # create
requests.put(f"{BASE_URL}/tasks/1", json={"title": "Replaced", "done": False})   # replace entirely
requests.patch(f"{BASE_URL}/tasks/1", json={"done": True})                 # partial update
requests.delete(f"{BASE_URL}/tasks/1")                                        # remove
```

`PUT` expects the _entire_ resource, since it's a full replacement; missing fields are often reset to defaults or rejected. `PATCH` sends only the fields that changed. Many APIs support both; some only implement one. Read the specific API's documentation rather than assuming.

### Authentication Concepts

```python
# API key in a header (very common)
headers: dict[str, str] = {"X-API-Key": "your-key-here"}
requests.get(url, headers=headers)

# Bearer token (common for OAuth-style APIs)
headers = {"Authorization": "Bearer eyJhbGciOi..."}
requests.get(url, headers=headers)

# Basic auth (username + password, base64-encoded automatically by requests)
requests.get(url, auth=("username", "password"))

# API key as a query parameter (less secure, still common on older APIs)
requests.get(url, params={"api_key": "your-key-here"})
```

Never hardcode real keys/tokens directly in source code. Load them from environment variables instead:

```python
import os

api_key: str | None = os.environ.get("API_KEY")
if api_key is None:
    raise RuntimeError("API_KEY environment variable is not set")

headers = {"Authorization": f"Bearer {api_key}"}
```

This keeps secrets out of your codebase and version control, a habit worth building early and covered again from the security angle in Chapter 37.

### Building a Reusable API Client

```python
import os
import requests

class ApiClient:
    def __init__(self, base_url: str, api_key: str | None = None) -> None:
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"

    def get(self, path: str, **kwargs) -> dict:
        response = self.session.get(f"{self.base_url}{path}", timeout=5, **kwargs)
        response.raise_for_status()
        return response.json()

    def post(self, path: str, payload: dict, **kwargs) -> dict:
        response = self.session.post(f"{self.base_url}{path}", json=payload, timeout=5, **kwargs)
        response.raise_for_status()
        return response.json()

client = ApiClient("https://jsonplaceholder.typicode.com", api_key=os.environ.get("API_KEY"))
post = client.get("/posts/1")
print(post["title"])
```

`requests.Session()` reuses the underlying TCP connection across multiple calls (faster for many requests to the same host) and lets you set headers once instead of repeating them on every call. Wrapping it in a small class like this is the standard shape of a real API client: one place that knows the base URL, auth, and error handling, so the rest of your code just calls clean methods.

### Example: a small CLI API client

```python
import argparse
import sys
import requests

BASE_URL: str = "https://jsonplaceholder.typicode.com"

def get_post(post_id: int) -> dict | None:
    try:
        response = requests.get(f"{BASE_URL}/posts/{post_id}", timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError:
        print(f"Post {post_id} not found", file=sys.stderr)
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}", file=sys.stderr)
    return None

def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch a post by ID")
    parser.add_argument("post_id", type=int)
    args = parser.parse_args()

    post = get_post(args.post_id)
    if post is None:
        sys.exit(1)

    print(f"{post['title']}\n\n{post['body']}")

if __name__ == "__main__":
    main()
```

### Explanation

1. `argparse` (covered fully in Chapter 32) parses a required `post_id` command-line argument.
2. `get_post` wraps the request with proper error handling, printing to `stderr` and returning `None` on failure rather than letting an exception crash the whole program.
3. `main()` exits with status code `1` on failure, the standard convention for "something went wrong" in a CLI tool, and prints the result to `stdout` on success.
4. This is a complete, small, real tool: it belongs directly on your `hash-gen`-style project list.

### Common Mistakes

```python
# ❌ Hardcoding secrets directly in source
API_KEY = "sk-abc123realkeyhere"   # never commit real keys

# ❌ Assuming PUT and PATCH are interchangeable
requests.put(url, json={"done": True})   # if the API expects a FULL resource for PUT,
                                            # this may silently wipe out every other field

# ❌ Not reusing a Session for many requests to the same host, paying full connection setup cost each time
for i in range(100):
    requests.get(f"{BASE_URL}/items/{i}")   # 100 separate connections instead of one reused session

# ❌ Swallowing errors from the API client silently, with no way for the caller to know something failed
```

### Best Practice

- Load secrets from environment variables (or a secrets manager), never hardcode them.
- Use `PATCH` for partial updates, `PUT` only when you intend to replace the entire resource.
- Wrap repeated API access in a small client class, using `requests.Session()` for connection reuse.
- Exit CLI tools with a non-zero status code on failure, so shell scripts and automation can detect it.

### Practice

- 🟢 Write a function that sends a `PATCH` request to update one field on a test API, and prints the resulting JSON.
- 🟢 Read an API key from an environment variable, and raise a clear error if it isn't set.
- 🟡 Build a small `ApiClient` class (like the example) for a public test API of your choice, with `get`, `post`, and `delete` methods.

### Mini Challenge

🟠 Extend the CLI API client example into a small multi-command tool (`get`, `create`, `delete`) using `argparse` subcommands (preview of Chapter 32), each calling the appropriate HTTP verb against a test API, with consistent error handling and exit codes across all three commands.

### Exam Question

- Why should API keys live in environment variables rather than in source code?
- What's the practical difference in what `PUT` and `PATCH` each expect from the request body?
- Why does reusing a `requests.Session()` matter when making many requests to the same host?

---

## 32. CLI Applications

### Concept

`argparse` (standard library) turns command-line arguments and flags into a structured, validated Python object, and helps you build tools that behave like the CLI programs you already use every day.

### Why?

Nearly every tool you build for your own workflow, and virtually every security tool, is a CLI application. `argparse` gives you help text, validation, and error messages for free, instead of hand-parsing `sys.argv`.

### Basic Usage

```python
import argparse

parser = argparse.ArgumentParser(description="Greet someone by name")
parser.add_argument("name", type=str, help="the name to greet")
parser.add_argument("--loud", action="store_true", help="shout the greeting")

args = parser.parse_args()

greeting: str = f"Hello, {args.name}!"
print(greeting.upper() if args.loud else greeting)
```

```bash
python3 greet.py Lichi
# Hello, Lichi!

python3 greet.py Lichi --loud
# HELLO, LICHI!

python3 greet.py --help
# auto-generated help text, built from your add_argument() calls
```

### Positional Arguments vs Flags

```python
parser.add_argument("filename")             # positional: required, order matters
parser.add_argument("--verbose", "-v", action="store_true")   # optional flag
parser.add_argument("--output", "-o", type=str, default="out.txt")   # optional, takes a value
```

- **Positional arguments** are required by position (`greet.py Lichi`, not `greet.py --name Lichi`).
- **Flags** (starting with `--` or `-`) are optional by default, and can appear in any order.

### Types and Validation

```python
parser.add_argument("count", type=int)                       # auto-converts and validates as int
parser.add_argument("--rate", type=float, default=1.0)
parser.add_argument("--mode", choices=["fast", "slow"], default="fast")   # restricts to specific values
```

```bash
python3 tool.py abc
# error: argument count: invalid int value: 'abc'
```

`argparse` handles the type conversion and error message automatically, exiting with a clear usage message on bad input, so you don't write that validation logic yourself.

### Multiple Values and `nargs`

```python
parser.add_argument("files", nargs="+")     # one or more values, collected into a list

args = parser.parse_args()
for f in args.files:
    print(f)
```

```bash
python3 tool.py file1.txt file2.txt file3.txt
```

### Subcommands

```python
import argparse

def cmd_add(args: argparse.Namespace) -> None:
    print(f"Adding: {args.title}")

def cmd_list(args: argparse.Namespace) -> None:
    print("Listing all items")

parser = argparse.ArgumentParser(prog="todo")
subparsers = parser.add_subparsers(dest="command", required=True)

add_parser = subparsers.add_parser("add", help="add a new item")
add_parser.add_argument("title")
add_parser.set_defaults(func=cmd_add)

list_parser = subparsers.add_parser("list", help="list all items")
list_parser.set_defaults(func=cmd_list)

args = parser.parse_args()
args.func(args)
```

```bash
python3 todo.py add "Write report"
# Adding: Write report

python3 todo.py list
# Listing all items
```

Subcommands (like `git commit`, `git push`) are the standard shape for a tool that does several distinct things. Each subcommand gets its own arguments, help text, and handler function, all under one program.

### Exit Codes

```python
import sys

def main() -> None:
    if something_went_wrong:
        print("Error: could not process file", file=sys.stderr)
        sys.exit(1)     # non-zero = failure
    print("Done")
    sys.exit(0)          # zero = success (this is also the default if you just let main() return)
```

Exit codes let shell scripts, CI pipelines, and other tools check whether your program succeeded (`$?` in bash) without parsing its output text. `0` always means success; any non-zero value conventionally means some kind of failure, and different non-zero values can distinguish different failure types if useful.

### Configuration: combining CLI args, env vars, and defaults

```python
import argparse
import os

def get_config() -> dict[str, str]:
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-key", default=os.environ.get("API_KEY"))
    parser.add_argument("--timeout", type=int, default=int(os.environ.get("TIMEOUT", "10")))
    args = parser.parse_args()

    if not args.api_key:
        parser.error("--api-key is required (or set the API_KEY environment variable)")

    return {"api_key": args.api_key, "timeout": args.timeout}
```

A common, sensible precedence order: explicit command-line flag overrides environment variable, which overrides a hardcoded default. `parser.error(...)` prints a usage-style error and exits with status `2`, matching `argparse`'s own built-in validation errors.

### Example

```python
# port_report.py
import argparse
import socket
import sys

def check_port(host: str, port: int, timeout: float) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        return sock.connect_ex((host, port)) == 0

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check whether specific ports are open on a host you control."
    )
    parser.add_argument("host", help="target host, e.g. 127.0.0.1")
    parser.add_argument("ports", type=int, nargs="+", help="one or more ports to check")
    parser.add_argument("--timeout", type=float, default=1.0, help="connection timeout in seconds")
    args = parser.parse_args()

    any_open = False
    for port in args.ports:
        is_open = check_port(args.host, port, args.timeout)
        status = "OPEN" if is_open else "closed"
        print(f"{args.host}:{port} -> {status}")
        any_open = any_open or is_open

    sys.exit(0 if any_open else 1)

if __name__ == "__main__":
    main()
```

```bash
python3 port_report.py 127.0.0.1 22 80 443 --timeout 0.5
```

### Explanation

1. `ports` uses `nargs="+"` to accept one or more port numbers on the command line, each auto-converted to `int`.
2. `check_port` reuses the socket connectivity approach from Chapter 25/26, wrapped as a small reusable function.
3. The exit code reflects whether _any_ port was found open, useful if this script were chained into a larger automated workflow.
4. Only ever point this at hosts you own or are explicitly authorized to test.

### Common Mistakes

```python
# ❌ Manually parsing sys.argv instead of using argparse
import sys
name = sys.argv[1]   # no help text, no validation, breaks confusingly on missing args

# ❌ Forgetting `required=True` on subparsers, letting the program run with no command at all

# ❌ Not providing --help-friendly descriptions, leaving users guessing at usage

# ❌ Using print() for errors instead of stderr, mixing normal output with error output
print("Error: file not found")   # should be: print("Error: file not found", file=sys.stderr)
```

### Best Practice

- Use `argparse` (or a well-known third-party alternative) rather than parsing `sys.argv` by hand.
- Give every argument a `help=` string; the auto-generated `--help` output is often the only documentation a small tool ever gets.
- Print errors to `stderr`, normal output to `stdout`, and use meaningful exit codes.
- Use subcommands once a tool does more than one distinct thing.

### Practice

- 🟢 Build a CLI tool that takes a filename and an optional `--uppercase` flag, printing the file's contents (uppercased if the flag is set).
- 🟢 Add a `--verbose` flag to a script that prints extra diagnostic information only when set.
- 🟡 Build a two-subcommand CLI tool (`convert` and `validate`, or similar) using `add_subparsers`, each with its own arguments.

### Mini Challenge

🟠 Turn your Chapter 30 SQLite expense tracker into a proper CLI tool with subcommands: `add-expense`, `list-expenses`, and `summary` (total by category), using `argparse` throughout, with sensible exit codes and error messages for bad input.

### Exam Question

- What does `argparse` give you for free that hand-parsing `sys.argv` doesn't?
- Why should error messages go to `stderr` rather than `stdout`?
- What does an exit code of `0` conventionally mean, and why does that convention matter for scripting?

---

## 33. Python Internals

### Concept

A look under the hood at what actually happens when Python code runs: bytecode, the interpreter loop, memory management, and the object model. You don't need this to write working Python, but it explains _why_ Python behaves the way it does in cases that otherwise feel like unexplained magic.

### Why?

Several things covered earlier (why small integers cache, why the GIL exists, why mutable default arguments misbehave) are direct consequences of these internals. Understanding this layer turns "Python just does this" into "Python does this because of how it's built," which makes debugging genuinely strange behavior far more tractable.

### Bytecode and the Interpreter

Python source code isn't executed directly. It's first compiled to **bytecode**, a lower-level, platform-independent instruction set, which the **CPython interpreter** (a virtual machine, written in C) then executes.

```python
import dis

def add(a: int, b: int) -> int:
    return a + b

dis.dis(add)
```

```text
  2           0 LOAD_FAST                0 (a)
              2 LOAD_FAST                1 (b)
              4 BINARY_OP                0 (+)
              8 RETURN_VALUE
```

`dis` (disassemble) shows you the actual bytecode instructions your function compiles down to. You'll rarely need this day to day, but it's genuinely useful when you want to understand exactly what a piece of code does, or compare the cost of two approaches at a low level.

### CPython

**CPython** is the reference, most widely used implementation of Python, written in C. When people say "Python," they usually mean CPython specifically. Other implementations exist (PyPy, for speed via JIT compilation; Jython, for the JVM), but CPython is what you're using by default, and is assumed throughout this book.

### Memory Management: References and Garbage Collection

Every Python object has a **reference count**: the number of names/places currently pointing to it. When that count reaches zero, the object's memory is freed automatically.

```python
import sys

x = [1, 2, 3]
print(sys.getrefcount(x))   # includes the temporary reference from getrefcount's own argument

y = x            # a second reference to the SAME object
print(sys.getrefcount(x))     # count went up

del y              # one fewer reference
```

Reference counting alone can't handle **circular references** (object A refers to object B, which refers back to A, so neither ever hits zero on its own). Python's garbage collector periodically scans for and cleans up such cycles, on top of the primary reference-counting mechanism.

```python
import gc
gc.collect()   # manually trigger a garbage collection cycle (rarely needed explicitly)
```

### The Object Model

Genuinely everything in Python, including integers, functions, classes, and modules, is an **object**. This is why `type(3)`, `type(int)`, and `type(print)` all give a meaningful answer, and why functions can be passed around like any other value (Chapter 05, Chapter 16).

```python
print(type(3))          # <class 'int'>
print(type(int))          # <class 'type'>
print(type(print))          # <class 'builtin_function_or_method'>
print(3 .__add__(4))          # 7 : the + operator IS a method call underneath
```

`3 .__add__(4)` demonstrates directly that `3 + 4` is really `int.__add__(3, 4)` under the hood, which is exactly the mechanism that makes operator overloading via dunder methods (Chapter 11) work at all.

### Namespaces, Stack, and Frames

A **namespace** is a mapping of names to objects (what LEGB scoping, Chapter 05, actually operates on: `locals()`, `globals()`, and built-ins are each a namespace). Each function call creates a new **frame**, holding that call's local namespace, and frames are pushed onto a **call stack** as functions call other functions, and popped as they return.

```python
def a():
    x = 1
    b()

def b():
    y = 2
    print("inside b")

a()
```

```text
Call stack while inside b():
┌─────────────┐
│ frame: b()  │  locals: {y: 2}
├─────────────┤
│ frame: a()  │  locals: {x: 1}
├─────────────┤
│ frame: <module>│
└─────────────┘
```

This is exactly what a traceback (Chapter 23) is showing you: a snapshot of the call stack at the moment an exception occurred, frame by frame.

### Import System (recap, with more detail)

When you `import module`, Python: checks if it's already loaded (in `sys.modules`, to avoid re-running it), searches `sys.path` for a matching file, compiles it to bytecode (caching the result in a `__pycache__` directory as a `.pyc` file for faster future imports), and executes the module's code top to bottom exactly once.

```python
import sys
print(sys.path)          # the list of directories Python searches for modules
print("os" in sys.modules)   # True, once you've imported os anywhere in the program
```

### Descriptors, Revisited

Chapter 12 covered descriptors as a class-authoring tool. Internally, this is _also_ how regular attribute access, methods, and `@property` all work: when you write `obj.attr`, Python's attribute lookup machinery checks for a descriptor on the class before falling back to the instance's own `__dict__`. This is genuinely how the object model is implemented, not a separate special case.

### Example

```python
import dis

def loop_sum(n: int) -> int:
    total = 0
    for i in range(n):
        total += i
    return total

def builtin_sum(n: int) -> int:
    return sum(range(n))

# Compare instruction counts as a rough proxy for work being done
print("loop_sum instructions:", len(list(dis.get_instructions(loop_sum))))
print("builtin_sum instructions:", len(list(dis.get_instructions(builtin_sum))))
```

### Explanation

1. Both functions compute the same result, but `loop_sum` executes many more bytecode instructions per call (loop setup, comparison, addition, and jump instructions repeated `n` times) versus `builtin_sum`, which delegates the looping to a single optimized C-level `sum()` call.
2. This is a concrete, inspectable illustration of why built-in functions are almost always faster than a hand-written Python loop doing equivalent work, a theme picked up properly in Chapter 34 (Performance).

### Common Mistakes

```python
# ❌ Assuming Python variables work like boxes that copy values (Chapter 06 already covered this,
#    but it's worth restating: it's a direct consequence of the object/reference model above)

# ❌ Believing garbage collection means memory is freed the instant an object becomes unreachable
#    for every case: reference counting usually IS immediate, but cyclic references wait for a
#    garbage collection pass

# ❌ Assuming all Python implementations behave identically (e.g. relying on CPython-specific
#    reference-counting timing in code meant to be portable to PyPy or other implementations)
```

### Best Practice

- Use `dis.dis()` when you genuinely want to understand what a piece of code costs, not as a routine habit.
- Don't rely on CPython-specific implementation details (like reference counting timing, or small-integer caching from Chapter 03) in code that needs to be portable or robust.
- Treat this chapter as a mental model for debugging strange behavior, not a toolkit for everyday programming.

### Practice

- 🟢 Run `dis.dis()` on a simple function of your own and try to read what each instruction does.
- 🟢 Use `sys.getrefcount()` to observe a reference count increasing and decreasing as you create and delete references to the same object.
- 🟡 Create a deliberate circular reference (two objects each pointing at the other) and confirm, using `gc`, that Python still cleans it up.

### Mini Challenge

🟠 Write two versions of a function that builds a large string: one using repeated `+=` in a loop (Chapter 07's anti-pattern), one using `"".join()`. Use `dis.dis()` or `timeit` (Chapter 34) to compare them, and explain in your own words, using what you now know about objects and immutability, exactly why one is slower.

### Exam Question

- What's the difference between Python source code and Python bytecode?
- Why can't reference counting alone clean up circular references?
- In your own words, what does it mean that "everything in Python is an object"?

---

## 34. Performance

### Concept

Making code faster, measured, not guessed. Profiling tells you _where_ time is actually being spent; benchmarking tells you _how much_ a specific change helped; caching avoids redoing work you've already done.

### Why?

Optimizing the wrong part of a program wastes effort and often makes the code harder to read for no real benefit. The first rule of performance work is: measure before you optimize.

### Big O, Briefly

Big O notation describes how an algorithm's cost grows as input size grows, not exact timing.

```text
O(1)        constant     : dict/set lookup, list indexing
O(log n)      logarithmic  : binary search
O(n)            linear       : looping through a list once
O(n log n)        log-linear   : efficient sorting (Python's sort())
O(n^2)              quadratic    : nested loop over the same data (e.g. checking every pair)
```

```python
# O(n) - checks each item once
def contains(items: list[int], target: int) -> bool:
    return target in items

# O(1) - hashing gets you there directly (Chapter 06)
def contains_fast(items: set[int], target: int) -> bool:
    return target in items
```

Converting a list you search repeatedly into a `set` is one of the single highest-leverage, lowest-effort performance changes you can make in real code.

### `timeit` for Micro-benchmarks

```python
import timeit

def using_loop() -> list[int]:
    result = []
    for i in range(1000):
        result.append(i * i)
    return result

def using_comprehension() -> list[int]:
    return [i * i for i in range(1000)]

loop_time: float = timeit.timeit(using_loop, number=1000)
comp_time: float = timeit.timeit(using_comprehension, number=1000)

print(f"loop: {loop_time:.4f}s, comprehension: {comp_time:.4f}s")
```

`timeit` runs a snippet many times and reports total/average time, smoothing out noise from a single run. Use it for comparing small, isolated pieces of code, not for profiling a whole program.

### `cProfile` for Whole-Program Profiling

```python
import cProfile

def slow_function() -> None:
    total = 0
    for i in range(1_000_000):
        total += i ** 2

cProfile.run("slow_function()")
```

```text
         3 function calls in 0.089 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.089    0.089    0.089    0.089 script.py:3(slow_function)
```

`cProfile` shows you exactly which functions consumed the most time across an entire run, which is how you find the _actual_ bottleneck in a larger program, rather than guessing. Optimize the function at the top of that list; optimizing anything else first is usually wasted effort.

### Memory Usage, Briefly

```python
import sys

small_list: list[int] = [1, 2, 3]
print(sys.getsizeof(small_list))   # size in bytes of the list object itself (not its contents' full depth)
```

For memory-heavy workloads, prefer generators over lists when you don't need random access (Chapter 15), and `__slots__` for classes you'll instantiate in large numbers (Chapter 12).

### Caching with `functools.lru_cache`

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(35))   # fast, thanks to caching every unique call's result
```

Without caching, naive recursive Fibonacci recomputes the same values an exponential number of times. `lru_cache` remembers the result for each unique set of arguments (this is the built-in, production-ready version of the hand-rolled `@cache` decorator from Chapter 16), and returns the cached value instantly on repeat calls. `maxsize=None` means unbounded caching; a specific number limits how many results are kept, evicting the least-recently-used entry once full.

### Premature Optimization

> "Premature optimization is the root of all evil." A famous line from Donald Knuth, often quoted (and often quoted a little out of context).

The practical reading: don't spend time optimizing code before you've confirmed, with profiling, that it's actually a bottleneck. Optimizing a function that runs once at startup, or that already runs in milliseconds, trades away readability for a speedup nobody will ever notice. Optimize the parts that profiling actually points to, and only after you have a correct, working version to compare against.

### Example

```python
import cProfile
from functools import lru_cache

def fib_no_cache(n: int) -> int:
    if n < 2:
        return n
    return fib_no_cache(n - 1) + fib_no_cache(n - 2)

@lru_cache(maxsize=None)
def fib_cached(n: int) -> int:
    if n < 2:
        return n
    return fib_cached(n - 1) + fib_cached(n - 2)

print("Without caching:")
cProfile.run("fib_no_cache(28)")

print("With caching:")
cProfile.run("fib_cached(28)")
```

### Explanation

1. Both functions compute the same value, `fib(28)`, correctly.
2. `cProfile.run` reports the total number of function calls and time for each; the uncached version makes an exponential number of recursive calls, the cached version makes a linear number, since every unique input is only ever actually computed once.
3. This makes the abstract idea of "caching avoids repeated work" directly visible as a concrete difference in call counts and timing.

### Common Mistakes

```python
# ❌ Optimizing code before measuring where the actual bottleneck is
# (rewriting a function that's 0.1% of total runtime, while ignoring one that's 80%)

# ❌ Using a list where a set would give O(1) membership checks instead of O(n)
big_list = list(range(1_000_000))
999_999 in big_list   # scans up to a million items

# ❌ Applying @lru_cache to a function with mutable/unhashable arguments (it requires hashable args)
@lru_cache
def process(data: list):   # ❌ TypeError at call time: list isn't hashable

# ❌ Caching a function whose result can legitimately change between calls (e.g. depends on current time)
```

### Best Practice

- Profile first (`cProfile`), then optimize the specific bottleneck it identifies, not what you assume is slow.
- Reach for the right data structure (Chapter 06) before reaching for micro-optimizations.
- Use `lru_cache` for pure, deterministic functions (Chapter 18) with hashable arguments and genuine repeated calls.
- Don't sacrifice readability for a speedup that profiling hasn't confirmed matters.

### Practice

- 🟢 Use `timeit` to compare `x in my_list` vs `x in my_set` for a large collection, and note the difference.
- 🟢 Add `@lru_cache` to a slow recursive function and measure the improvement.
- 🟡 Use `cProfile` on a small program with two or three functions, and identify which one dominates total runtime.

### Mini Challenge

🟠 Take your Chapter 21 log analyzer (or a similar text-processing function you've written) and profile it against a large generated test file. Identify the actual bottleneck with `cProfile`, then apply one targeted fix, and confirm with `timeit`/`cProfile` again that it measurably helped.

### Exam Question

- Why is "measure first, then optimize" better practice than optimizing by instinct?
- Why does converting a list to a set often meaningfully speed up membership checks?
- What kind of function is a bad candidate for `@lru_cache`, and why?

---

## 35. Clean Code

### Concept

Clean code is code written primarily to be read by humans (including your future self), not just executed by a computer. This chapter collects the conventions and habits that separate code that merely works from code that's genuinely maintainable.

### Why?

Code is read far more often than it's written. A clever one-liner that takes five minutes to decipher costs far more time, across everyone who reads it later, than it saved to write. Professional Python is judged as much on clarity as on correctness.

### PEP 8, the Official Style Guide

```python
# ✅ PEP 8 style
def calculate_total(price: float, tax_rate: float) -> float:
    return price * (1 + tax_rate)

# ❌ violates several PEP 8 conventions
def CalculateTotal(Price,TaxRate):
    return Price*(1+TaxRate)
```

Key conventions: `snake_case` for functions/variables, `PascalCase` for classes, 4 spaces per indent level (never tabs), spaces around operators, two blank lines between top-level functions/classes. Most editors (including Neovim, with the right plugins) and tools like `ruff` or `black` can enforce this automatically, so you rarely need to check it by hand.

### Naming

```python
# ❌ unclear
def calc(x, y, z):
    return x * y * (1 - z)

# ✅ clear
def calculate_discounted_total(price: float, quantity: int, discount_rate: float) -> float:
    return price * quantity * (1 - discount_rate)
```

A good name answers "what does this hold or do" without needing a comment. If you find yourself writing a comment to explain what a poorly-named variable or function actually represents, renaming it is usually the better fix.

### Functions: Do One Thing

```python
# ❌ does too much: fetches, validates, transforms, AND prints
def process_user(user_id: int) -> None:
    user = fetch_user(user_id)
    if not user:
        print("not found")
        return
    user["name"] = user["name"].strip().title()
    print(f"Processed: {user['name']}")

# ✅ each function has one clear job
def fetch_user(user_id: int) -> dict | None: ...
def normalize_name(name: str) -> str:
    return name.strip().title()
def display_user(user: dict) -> None:
    print(f"Processed: {user['name']}")
```

Small, single-purpose functions are easier to name well, easier to test in isolation (Chapter 22), and easier to reuse elsewhere.

### Docstrings

```python
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate Body Mass Index.

    Args:
        weight_kg: Weight in kilograms.
        height_m: Height in meters.

    Returns:
        BMI as a float, rounded to one decimal place.
    """
    return round(weight_kg / (height_m ** 2), 1)
```

A docstring, not a comment, is the right place to document what a function does, its parameters, and its return value. Tools (editors, `help()`, documentation generators) read docstrings specifically; they're part of the object at runtime (`function.__doc__`), unlike a regular `#` comment.

### Error Handling as Part of Clean Code

Already covered in depth in Chapter 10: specific exceptions, no bare `except:`, custom exceptions where they clarify intent. Worth restating here as a code-quality habit, not just a mechanism: how a function fails is as much a part of its design as what it returns on success.

### Project Structure

```text
myproject/
├── pyproject.toml
├── README.md
├── src/
│   └── myproject/
│       ├── __init__.py
│       ├── core.py
│       ├── cli.py
│       └── utils.py
└── tests/
    ├── test_core.py
    └── test_cli.py
```

Consistent, predictable structure (Chapter 24) is itself a form of clean code: a new contributor (or you, six months later) should be able to guess where something lives without searching.

### "Readable code is more important than clever code"

```python
# ❌ clever, but takes real effort to parse
result = [y for y in (x**2 for x in range(20) if x % 2 == 0) if y > 50]

# ✅ same result, obvious at a glance
evens = [x for x in range(20) if x % 2 == 0]
squares = [x ** 2 for x in evens]
result = [y for y in squares if y > 50]
```

A one-liner that saves three lines but costs thirty seconds of squinting is not a net win. Optimize for the reader's time, not the writer's line count.

### Example

```python
from dataclasses import dataclass

@dataclass
class Order:
    """Represents a single customer order."""
    item: str
    unit_price: float
    quantity: int

def calculate_order_total(order: Order, tax_rate: float = 0.0) -> float:
    """Calculate the total price for an order, including tax.

    Args:
        order: The order to calculate a total for.
        tax_rate: Tax rate as a decimal (e.g. 0.08 for 8%).

    Returns:
        The total price, rounded to 2 decimal places.
    """
    subtotal = order.unit_price * order.quantity
    return round(subtotal * (1 + tax_rate), 2)

def format_receipt_line(order: Order, total: float) -> str:
    """Format a single human-readable receipt line."""
    return f"{order.quantity}x {order.item}: ${total:.2f}"

order = Order(item="Keyboard", unit_price=45.0, quantity=2)
total = calculate_order_total(order, tax_rate=0.08)
print(format_receipt_line(order, total))
```

### Explanation

1. `Order` is a `@dataclass`, a clean, minimal way to represent structured data (Chapter 11).
2. `calculate_order_total` and `format_receipt_line` each do exactly one job, are fully type-hinted, and are documented with docstrings explaining intent, not just restating the code.
3. Names are specific and self-explanatory: no `calc()`, no `x`, no ambiguity about what each piece does.

### Common Mistakes

```python
# ❌ Inconsistent naming conventions in the same file
userAge = 20
total_price = 50.0

# ❌ Deeply nested conditionals instead of early returns
def process(data):
    if data:
        if data.get("valid"):
            if data.get("active"):
                return "ok"
    return "invalid"

# ✅ Early returns flatten the logic and are easier to follow
def process(data):
    if not data:
        return "invalid"
    if not data.get("valid"):
        return "invalid"
    if not data.get("active"):
        return "invalid"
    return "ok"

# ❌ Comments that just restate the code instead of explaining intent
x += 1   # increment x by 1
```

### Best Practice

- Use a linter/formatter (`ruff`, `black`) so style is enforced automatically, not remembered manually.
- Prefer several small, clearly-named functions over one large function doing several things.
- Write docstrings for anything another person (or future you) would need explained.
- Prefer early returns over deeply nested conditionals.

### Practice

- 🟢 Take a function you wrote in an earlier chapter and add a proper docstring to it.
- 🟢 Rewrite a deeply nested `if` chain from an earlier exercise using early returns instead.
- 🟡 Pick one of your earlier, more compressed one-liners (a comprehension or a chained call) and rewrite it as clearer, multi-step code, then decide honestly which version you'd rather maintain.

### Mini Challenge

🟠 Take the largest function you've written so far in this book and refactor it into two or three smaller, single-purpose functions, each with a clear name, type hints, and a docstring, without changing its overall behavior. Write a quick test (Chapter 22) confirming the refactor didn't break anything.

### Exam Question

- Why is a good name often better than a comment explaining a bad one?
- Why do early returns often make code easier to follow than deeply nested conditionals?
- In your own words, why is "readable" not the same goal as "short"?

---

## 36. Design Patterns

### Concept

Design patterns are named, reusable solutions to problems that come up repeatedly in software design. Knowing the name and shape of a pattern lets you recognize it in other people's code, and reach for it deliberately instead of reinventing it clumsily.

### Why?

Patterns aren't about memorizing structures to force onto every problem. They're a shared vocabulary: saying "this needs a Factory" communicates an entire design idea in one word to anyone who knows the pattern. The value is in recognizing which problem you actually have, not in using patterns for their own sake.

### Factory

Problem: creating an object involves logic (choosing between subclasses, reading configuration) that shouldn't be scattered across every place an object gets created.

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...

class EmailNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"Emailing: {message}")

class SmsNotifier(Notifier):
    def send(self, message: str) -> None:
        print(f"Texting: {message}")

def create_notifier(kind: str) -> Notifier:
    if kind == "email":
        return EmailNotifier()
    if kind == "sms":
        return SmsNotifier()
    raise ValueError(f"Unknown notifier kind: {kind}")

notifier = create_notifier("email")
notifier.send("Hello")
```

The calling code never needs to know the concrete class names, only the `create_notifier` function and the shared `Notifier` interface.

### Strategy

Problem: you need to swap between different algorithms for the same task, at runtime, without a tangle of `if`/`elif` at every call site.

```python
from typing import Callable

def sort_by_price(items: list[dict]) -> list[dict]:
    return sorted(items, key=lambda i: i["price"])

def sort_by_name(items: list[dict]) -> list[dict]:
    return sorted(items, key=lambda i: i["name"])

def display_items(items: list[dict], strategy: Callable[[list[dict]], list[dict]]) -> None:
    for item in strategy(items):
        print(item["name"], item["price"])

items = [{"name": "B", "price": 20}, {"name": "A", "price": 10}]
display_items(items, sort_by_price)     # pass in whichever strategy you want, interchangeably
display_items(items, sort_by_name)
```

This is the same idea as passing a function as an argument (Chapter 05, Chapter 18), formalized: the "strategy" (how to sort) is decoupled from the code that uses it.

### Adapter

Problem: you need to use an existing class/library whose interface doesn't match what your code expects, without modifying that original code.

```python
class LegacyLogger:
    def write_log(self, text: str) -> None:
        print(f"[legacy] {text}")

class ModernLoggerInterface:
    def log(self, message: str) -> None: ...

class LoggerAdapter(ModernLoggerInterface):
    def __init__(self, legacy: LegacyLogger) -> None:
        self._legacy = legacy

    def log(self, message: str) -> None:
        self._legacy.write_log(message)   # translates the modern call into the legacy one

logger: ModernLoggerInterface = LoggerAdapter(LegacyLogger())
logger.log("Server started")
```

The adapter wraps an incompatible interface and presents the one your code actually expects, without touching the original class.

### Observer

Problem: several parts of your program need to react whenever something happens elsewhere, without that "something" needing to know who's listening.

```python
from typing import Callable

class EventEmitter:
    def __init__(self) -> None:
        self._listeners: list[Callable[[str], None]] = []

    def subscribe(self, listener: Callable[[str], None]) -> None:
        self._listeners.append(listener)

    def emit(self, event: str) -> None:
        for listener in self._listeners:
            listener(event)

def log_event(event: str) -> None:
    print(f"LOG: {event}")

def alert_admin(event: str) -> None:
    if "ERROR" in event:
        print(f"ALERT: {event}")

emitter = EventEmitter()
emitter.subscribe(log_event)
emitter.subscribe(alert_admin)
emitter.emit("ERROR: disk full")
```

Both `log_event` and `alert_admin` react independently to the same event, and `EventEmitter` never needed to know about either of them specifically. This is the foundation of GUI event handling, webhook systems, and pub/sub architectures.

### Singleton, and Why It's Often Discouraged

Problem (as originally framed): ensure a class has exactly one instance, globally accessible.

```python
class Config:
    _instance: "Config | None" = None

    def __new__(cls) -> "Config":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Config()
b = Config()
print(a is b)   # True: always the same instance
```

**Why it's often discouraged:** a Singleton is effectively global mutable state with extra ceremony, and global state makes testing harder (state leaks between tests unless carefully reset), hides dependencies (a function using the Singleton doesn't announce that dependency in its signature), and complicates anything that later needs more than one instance (multiple configs, multiple environments). In Python specifically, a module-level object (Chapter 08, since modules are only ever imported once and cached) often achieves the same "one shared instance" goal more simply, without a special class pattern at all.

### Repository

Problem: your business logic shouldn't need to know _how_ data is stored (SQLite today, a different database tomorrow, a mock in tests).

```python
from abc import ABC, abstractmethod

class UserRepository(ABC):
    @abstractmethod
    def get(self, user_id: int) -> dict | None: ...
    @abstractmethod
    def save(self, user: dict) -> None: ...

class SqliteUserRepository(UserRepository):
    def get(self, user_id: int) -> dict | None:
        ...  # real SQLite query (Chapter 30)

    def save(self, user: dict) -> None:
        ...  # real SQLite insert/update

class InMemoryUserRepository(UserRepository):
    def __init__(self) -> None:
        self._users: dict[int, dict] = {}

    def get(self, user_id: int) -> dict | None:
        return self._users.get(user_id)

    def save(self, user: dict) -> None:
        self._users[user["id"]] = user

def register_user(repo: UserRepository, user: dict) -> None:
    repo.save(user)
    print(f"Registered {user['name']}")

register_user(InMemoryUserRepository(), {"id": 1, "name": "Lichi"})   # fast, no real DB, great for tests
```

`register_user` doesn't care which repository it gets, only that it satisfies the `UserRepository` interface (Chapter 12's `Protocol`/`ABC` ideas applied directly). This makes testing (swap in `InMemoryUserRepository`) and future storage changes (swap in a different concrete repository) both trivial.

### Dependency Injection

Problem: a function/class that creates its own dependencies internally is hard to test and hard to reconfigure.

```python
# ❌ hard to test: EmailNotifier is hardcoded inside
class OrderService:
    def __init__(self) -> None:
        self.notifier = EmailNotifier()

    def place_order(self, order: dict) -> None:
        self.notifier.send(f"Order placed: {order['id']}")

# ✅ the dependency is passed IN, not created internally
class OrderService:
    def __init__(self, notifier: Notifier) -> None:
        self.notifier = notifier

    def place_order(self, order: dict) -> None:
        self.notifier.send(f"Order placed: {order['id']}")

service = OrderService(EmailNotifier())      # real usage
test_service = OrderService(FakeNotifier())    # trivially swappable in a test (Chapter 22's mocking)
```

**Dependency injection** just means: instead of a class reaching out and constructing what it needs internally, that dependency is handed to it from the outside (usually via `__init__`). This is the single idea underlying most of the "testability" improvements in this chapter: it's what makes the Repository pattern's swap-in-a-fake trick, and Chapter 22's mocking, actually possible in the first place.

### The Problem Each Pattern Solves, in One Line

```text
Factory       : centralizes object creation logic
Strategy      : swaps interchangeable algorithms at runtime
Adapter       : bridges an incompatible interface without modifying it
Observer      : lets multiple parts react to an event without tight coupling
Singleton     : ensures exactly one instance (use sparingly, prefer alternatives)
Repository    : decouples business logic from how/where data is stored
Dependency Injection: makes dependencies explicit and swappable, instead of hardcoded
```

### Example

```python
from abc import ABC, abstractmethod

class ScanStrategy(ABC):
    @abstractmethod
    def scan(self, host: str) -> list[int]: ...

class QuickScan(ScanStrategy):
    def scan(self, host: str) -> list[int]:
        return [80, 443]   # only checks the most common ports

class FullScan(ScanStrategy):
    def scan(self, host: str) -> list[int]:
        return list(range(1, 1025))   # checks every well-known port

class PortScanner:
    def __init__(self, strategy: ScanStrategy) -> None:
        self.strategy = strategy   # dependency injection: the strategy is passed in

    def run(self, host: str) -> None:
        ports = self.strategy.scan(host)
        print(f"Checking {len(ports)} ports on {host}")

scanner = PortScanner(QuickScan())
scanner.run("127.0.0.1")

scanner.strategy = FullScan()   # swap the strategy at runtime
scanner.run("127.0.0.1")
```

### Explanation

1. `ScanStrategy` defines the shared interface (an `ABC`, Chapter 12) for "how to decide which ports to check."
2. `QuickScan` and `FullScan` are two interchangeable strategies, each implementing `scan()` differently.
3. `PortScanner` receives its strategy via dependency injection, doesn't hardcode either concrete class, and can swap strategies at runtime, tying together Strategy and Dependency Injection in one small, genuinely useful example for the kind of tooling you're building toward.

### Common Mistakes

```python
# ❌ Forcing a pattern where a simple function would do
class AdderFactory:            # unnecessary ceremony for something this simple
    def create_adder(self):
        return lambda a, b: a + b

# ❌ Reaching for Singleton by default for anything "global," instead of considering
#    a plain module-level object or dependency injection first

# ❌ Confusing Factory (creates objects) with Strategy (swaps algorithms): they solve
#    different problems even though both involve interchangeable classes
```

### Best Practice

- Learn to recognize the _problem_ each pattern solves, not just its code shape, so you reach for the right one.
- Prefer the simplest solution that works; a pattern is a tool for a specific recurring problem, not a goal in itself.
- Favor dependency injection over hardcoded dependencies, especially for anything you'll want to test or swap out later.

### Practice

- 🟢 Implement a simple `Factory` function that creates one of three different shape objects based on a string argument.
- 🟢 Rewrite a function that hardcodes a dependency (like creating its own logger or client internally) to instead receive that dependency via its constructor or parameters.
- 🟡 Implement the `Observer` pattern for a simple event: a `TaskCompleted` event that both logs the completion and updates a counter, via two independent subscribed listener functions.

### Mini Challenge

🟠 Apply the Repository pattern to your Chapter 30 SQLite notes/expense tracker: define an abstract `Repository` interface, a real `SqliteRepository` implementation, and an `InMemoryRepository` implementation for tests, then write at least one `pytest` test (Chapter 22) that exercises your business logic against the in-memory version, with zero real database involved.

### Exam Question

- What specific problem does the Adapter pattern solve that Strategy does not?
- Why is Singleton often considered an anti-pattern in modern software design?
- In your own words, what does "dependency injection" mean, and what does it make easier?

---

## 37. Security-Oriented Python

### Concept

A tour of defensive, security-conscious Python practices: handling input safely, hashing passwords correctly, generating secure randomness, avoiding injection vulnerabilities, and running subprocesses safely. This chapter builds directly on patterns already introduced (Chapter 19's regex, Chapter 20's pickle warning, Chapter 30's parameterized queries), collected here with the security lens made explicit.

### Why?

Given where you're headed (offensive security, web pentesting, red teaming), understanding these defensive patterns deeply is directly useful in two ways: writing secure tooling of your own, and recognizing the _absence_ of these patterns as a vulnerability when you're assessing someone else's code.

> Every example in this chapter is for defensive, educational understanding. Apply anything here only to systems and code you own or are explicitly authorized to test.

### Input Validation and Sanitization

**Validation** checks that input meets expectations before you use it. **Sanitization** transforms input to make it safe. They're related but distinct: validation can reject bad input outright; sanitization tries to clean it up instead.

```python
import re

def is_valid_username(username: str) -> bool:
    return bool(re.fullmatch(r"[a-zA-Z0-9_]{3,20}", username))

def sanitize_filename(filename: str) -> str:
    # strips anything that isn't a safe filename character
    return re.sub(r"[^a-zA-Z0-9_.-]", "_", filename)
```

**Prefer validation (reject) over sanitization (silently transform) whenever you can.** Silently modifying bad input can hide the fact that something suspicious was submitted at all, and can itself introduce bugs if the transformation isn't as safe as assumed.

### Secure Password Handling: Hashing, Not Encryption

Passwords should never be stored in plain text, and should never be reversibly _encrypted_ either; they should be **hashed** with a purpose-built, slow, salted algorithm.

```python
import hashlib
import secrets

def hash_password(password: str) -> tuple[str, str]:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return hashed.hex(), salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return secrets.compare_digest(candidate.hex(), stored_hash)
```

A few details that matter here, each for a specific reason:

- **`pbkdf2_hmac` with a high iteration count** (or, better in real production systems, a dedicated library like `bcrypt` or `argon2-cffi`) is deliberately slow, making brute-force attacks on stolen hashes far more expensive. A fast general-purpose hash like plain `sha256(password)` is a serious mistake here precisely because it's fast.
- **A unique salt per password** means two users with the same password get different hashes, defeating precomputed rainbow-table attacks.
- **`secrets.compare_digest`** compares in constant time, regardless of where the strings first differ, preventing a timing attack that could otherwise leak information about the correct hash byte by byte.

```python
# ❌ Never do this
def bad_hash(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()   # fast, unsalted, broken for this purpose

# ❌ Never do this either
def compare_unsafely(a: str, b: str) -> bool:
    return a == b   # regular == can leak timing information about secret comparisons
```

### `secrets` vs `random`

```python
import random
import secrets

random.randint(1, 100)          # fine for games, simulations, non-security randomness
secrets.token_hex(16)             # cryptographically secure, for tokens, keys, passwords, salts
secrets.token_urlsafe(16)           # cryptographically secure, URL-safe (good for session tokens, links)
secrets.choice(["a", "b", "c"])       # cryptographically secure random choice
```

**`random` is not cryptographically secure.** Its output is predictable given enough observed values, since it's a deterministic pseudorandom generator designed for statistical distribution, not unpredictability. Anything security-relevant (tokens, password reset links, session IDs, salts) must use `secrets` instead.

### Environment Variables for Secrets

```python
import os

api_key: str | None = os.environ.get("API_KEY")
db_password: str | None = os.environ.get("DB_PASSWORD")

if api_key is None:
    raise RuntimeError("API_KEY must be set")
```

Already introduced in Chapter 31: secrets belong in environment variables (or a dedicated secrets manager for production systems), never hardcoded in source, and never committed to version control. A `.env` file, loaded at startup and excluded via `.gitignore`, is a common local-development pattern.

### Safe File Handling

```python
from pathlib import Path

def safe_read(base_dir: Path, filename: str) -> str:
    target = (base_dir / filename).resolve()
    if not target.is_relative_to(base_dir.resolve()):
        raise ValueError("Path traversal attempt detected")
    return target.read_text()
```

Without a check like `is_relative_to`, a `filename` of `"../../etc/passwd"` could let user input escape the intended directory entirely, a classic **path traversal** vulnerability. Always resolve and validate that a user-supplied path stays within its intended boundary before touching the filesystem with it.

### Safe Subprocess Usage: Preventing Command Injection

```python
import subprocess

# ❌ DANGEROUS: shell=True interprets the string as a shell command
filename = "somefile.txt; rm -rf ~"
subprocess.run(f"cat {filename}", shell=True)   # the attacker-controlled `;` breaks out into a NEW command!

# ✅ SAFE: pass arguments as a list, no shell interpretation involved
subprocess.run(["cat", filename])   # filename is treated as ONE literal argument, no matter its content
```

This is command injection, the same category of vulnerability as SQL injection (Chapter 30), just at the operating-system level: untrusted input gets interpreted as _commands_ instead of _data_ because of how the string was assembled. **Avoid `shell=True` whenever the command or its arguments include anything derived from user input.** Passing a list of arguments (no shell involved at all) is both safer and, in most cases, exactly what you actually want.

```python
# If shell features (pipes, globbing) are genuinely required, at minimum use shlex.quote()
import shlex
import subprocess

safe_filename = shlex.quote(filename)
subprocess.run(f"cat {safe_filename}", shell=True)   # still shell=True, but the argument is now escaped
```

### SQL Injection Prevention (recap)

Already covered in full in Chapter 30: always use parameterized queries (`?` placeholders), never string-formatted SQL built from variable input. Worth restating here as the same underlying pattern as command injection above: **untrusted input must never be concatenated directly into something that gets interpreted as code** (SQL, shell commands, or otherwise).

### Safe Deserialization (recap)

Already covered in Chapter 20: never `pickle.load()` data from an untrusted source, since unpickling can execute arbitrary code. Use JSON (which can only represent data, never executable instructions) for anything crossing a trust boundary.

### TLS Concepts, Briefly

**TLS (Transport Layer Security)** encrypts data in transit between a client and server, and (via certificates) lets the client verify it's actually talking to the server it thinks it is, not an impersonator.

```python
import requests

response = requests.get("https://example.com", verify=True)   # verify=True is the DEFAULT, and correct

# ❌ Never disable certificate verification outside of a controlled, understood test environment
response = requests.get("https://example.com", verify=False)   # accepts ANY certificate, including a forged one
```

Disabling certificate verification (`verify=False`) defeats the entire point of TLS: it will silently accept a connection to an impersonating server performing a man-in-the-middle attack. It's sometimes used temporarily against a local test server with a self-signed certificate; it should never ship in real code that talks to anything over an untrusted network.

### Socket Security Basics

Building on Chapter 26: always validate and bound data received from a socket before trusting it (an attacker-controlled peer can send anything: oversized payloads, malformed data, or unexpected message formats). Set timeouts to prevent a malicious or broken peer from hanging your program indefinitely, and never `eval()` or otherwise execute data received over a network connection.

```python
# ❌ Never do this, ever
data = conn.recv(1024)
eval(data.decode())   # executes ARBITRARY code sent by whoever is on the other end of the socket
```

### Example

```python
import hashlib
import secrets
from dataclasses import dataclass

@dataclass
class StoredCredential:
    username: str
    password_hash: str
    salt: str

def register(username: str, password: str) -> StoredCredential:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    ).hex()
    return StoredCredential(username=username, password_hash=password_hash, salt=salt)

def login(credential: StoredCredential, attempted_password: str) -> bool:
    attempted_hash = hashlib.pbkdf2_hmac(
        "sha256", attempted_password.encode(), credential.salt.encode(), 100_000
    ).hex()
    return secrets.compare_digest(attempted_hash, credential.password_hash)

stored = register("lichi", "correct-horse-battery-staple")
print(login(stored, "correct-horse-battery-staple"))   # True
print(login(stored, "wrong-password"))                    # False
```

### Explanation

1. `register` hashes the password immediately with a per-user random salt; the plain-text password is never stored anywhere.
2. `login` re-derives the hash from the attempted password using the _same_ salt, then compares using `secrets.compare_digest` rather than `==`, closing the timing-attack gap.
3. `StoredCredential` never holds the plain-text password at any point after `register` returns, only the hash and salt.

### Common Mistakes

```python
# ❌ Storing plain-text passwords
user_password = "hunter2"   # never store this directly, ever

# ❌ Using a fast, general-purpose hash for passwords
hashlib.sha256(password.encode()).hexdigest()   # fast is exactly the wrong property here

# ❌ Reusing the same salt for every user (defeats the entire purpose of salting)
GLOBAL_SALT = "fixed-salt-123"

# ❌ Using random.random() or random.randint() to generate a security token
token = str(random.randint(100000, 999999))   # predictable, not cryptographically secure

# ❌ shell=True with any string built from user input
subprocess.run(f"ping {user_input}", shell=True)

# ❌ Disabling TLS verification outside a genuinely controlled test scenario
requests.get(url, verify=False)
```

### Best Practice

- Hash passwords with a slow, salted, purpose-built algorithm; never encrypt them, never store them plain.
- Use `secrets`, never `random`, for anything security-relevant.
- Never build shell commands or SQL queries by string-formatting untrusted input; pass arguments as lists/parameters instead.
- Never unpickle untrusted data, never disable TLS verification against real endpoints, never `eval()` untrusted input of any kind.
- Keep secrets in environment variables or a secrets manager, never in source code.

### Practice

- 🟢 Write a function that generates a cryptographically secure random token suitable for a password-reset link.
- 🟢 Write a function that validates a username against a strict allowed-character pattern, rejecting (not silently modifying) anything that doesn't match.
- 🟡 Take a `subprocess.run(f"...", shell=True)` call built from a variable, and rewrite it as a safe list-based call with no shell involved.

### Mini Challenge

🟠 Build a small, self-contained "credential store" module: `register(username, password)` and `login(username, password)` functions backed by your Chapter 30 SQLite database (storing only hash and salt, never the plain password), with proper parameterized queries throughout, and a `pytest` test suite (Chapter 22) confirming a correct password succeeds and an incorrect one fails.

### Exam Question

- Why is hashing the right approach for passwords, while encryption is not?
- Why is `random` unsuitable for generating a security token, in your own words?
- Explain, using the shell-injection example, why passing arguments as a list is safer than building a shell command string.

---

## 38. Real-World Projects

### Concept

Reading about a concept and building something with it are different skills. This chapter is a project list spanning beginner to advanced, each with a spec you implement yourself, not a solution to copy. Chapters referenced next to each project tell you which parts of this book it draws on.

### Why?

Projects force you to combine concepts, make design decisions nobody hands you, and hit real bugs in real context, which is where most durable learning actually happens.

### How to use this chapter

For each project: read the requirements, sketch your own architecture before looking at the suggested one, build it in the implementation steps order, then attempt the extension ideas once the core works. Don't skip straight to extensions; a working simple version beats a half-built ambitious one.

---

### Beginner Projects

**1. Calculator** (Chapters 03, 05, 10)
Requirements: a CLI tool that reads two numbers and an operator, performs the operation, handles division by zero and invalid input without crashing.
Steps: parse input, look up the operator, compute, format output, wrap it in a loop with `try`/`except`.
Extension: support a chained expression like `2 + 3 * 4` using `operator precedence` rules instead of one operation at a time.

**2. Number Guessing Game** (Chapters 04, 10, 21)
Requirements: pick a random number in a range, loop accepting guesses, respond too high/too low/correct, track guess count.
Hint: `random.randint(1, 100)` for the target.
Extension: add a difficulty setting that changes the range and a maximum allowed number of guesses.

**3. To-Do CLI** (Chapters 06, 09, 20, 32)
Requirements: add, list, and remove tasks, persisted to a JSON file between runs, driven by `argparse` subcommands.
Architecture: one function per operation, a small `load_tasks()`/`save_tasks()` pair around the JSON file.
Tests: write `pytest` tests using a temporary file path (Chapter 22's `tmp_path` fixture) so tests never touch your real task file.

**4. Password Generator** (Chapter 37)
Requirements: generate a random password of a given length, with configurable character sets (letters, digits, symbols), using `secrets`, not `random`.
Extension: add a `--check-strength` flag that reports whether a given password would pass your own strength checker from Chapter 22's exercises.

**5. File Organizer** (Chapters 08, 09)
Requirements: scan a directory and move files into subfolders by extension (`.pdf` to `pdfs/`, `.jpg` to `images/`, etc).
Hint: use `pathlib.Path.iterdir()` and `Path.suffix`.
Extension: add a `--dry-run` flag that prints what it _would_ do without moving anything, a genuinely important safety habit for any tool that touches the filesystem.

---

### Intermediate Projects

**6. Expense Tracker** (Chapters 20 or 30, 32)
Requirements: add expenses (amount, category, date), view totals by category, backed by either JSON or SQLite (build both versions if you want to compare the two approaches directly).
Extension: add a monthly summary report and a simple bar-chart-in-text visualization of spending by category.

**7. Log Analyzer** (Chapters 19, 21, 23)
Requirements: parse a log file with a consistent format, count entries by level, extract and report the top N most frequent error messages.
Hint: this is a natural extension of the Chapter 09 and Chapter 19 mini challenges; combine them.
Tests: generate a small synthetic log file as a fixture, and test your parser against known expected counts.

**8. JSON Database** (Chapter 20)
Requirements: a small class-based `JSONStore` supporting `add`, `get`, `update`, `delete`, and `query` (filter by a field), all persisted to a single JSON file.
Architecture: keep the class's public methods small; push all file I/O behind `_load()`/`_save()` private helpers.
Extension: add basic indexing (a dict mapping a field's values to record IDs) so `query` doesn't need to scan every record.

**9. CLI Notes Application** (Chapters 09, 30, 32)
Requirements: `add`, `list`, `search` (by keyword), and `delete` subcommands, backed by SQLite, each note with a timestamp.
Hint: `sqlite3`'s `LIKE` operator, still parameterized, works well for the search subcommand.
Tests: use an in-memory SQLite database (`sqlite3.connect(":memory:")`) for fast, isolated tests.

**10. SQLite Application (your choice of domain)** (Chapter 30)
Requirements: pick a small domain you actually care about (a reading list, a workout log, a study tracker) and design your own schema with at least two related tables (a foreign key relationship).
This one is intentionally open-ended: the skill being practiced is translating a real need into a schema and a small set of operations on it.

---

### Advanced Projects

**11. REST API Client** (Chapters 27, 31)
Requirements: a reusable client class for a real public API of your choice, with authentication, retries, and clear error handling, plus a small CLI wrapping it (Chapter 32).
Tests: mock the HTTP layer (Chapter 22) so tests run without a real network call.

**12. Async Web Scraper for Permitted or Public Data** (Chapter 28)
Requirements: fetch multiple pages concurrently with `httpx.AsyncClient` and `asyncio.gather`/`TaskGroup`, respecting the target site's `robots.txt` and rate limits, only against data you have permission to collect.
Extension: add a concurrency limit (a `asyncio.Semaphore`) so you don't hammer the target with unlimited simultaneous requests.

**13. TCP Chat Application** (Chapter 26)
Requirements: a threaded server supporting multiple simultaneous clients, broadcasting messages to everyone connected, with clean connect/disconnect handling.
Hint: revisit the Chapter 26 "simple multi-client chat server" concept section; this project is that idea, fully built out.

**14. Async TCP Server** (Chapters 26, 28)
Requirements: rebuild project 13 using `asyncio.start_server` instead of threads, and compare the two implementations directly: what got simpler, what got harder.

**15. Port/Service Information Tool for Systems You Own** (Chapters 25, 26, 32)
Requirements: a CLI tool that checks a list of ports on a host you control, reports open/closed, and optionally attempts a basic banner grab (reading the first bytes a service sends after connecting) on open ports.
Only ever run this against hosts you own or are explicitly authorized to test.

**16. Concurrent File Scanner** (Chapters 09, 29)
Requirements: recursively scan a directory tree and compute a hash (Chapter 37's `hashlib`) of every file, using `multiprocessing.Pool` to parallelize the CPU-bound hashing work.
Extension: detect and report duplicate files (same hash, different path).

**17. Log Monitoring Application** (Chapters 09, 19, 21, 29)
Requirements: watch a log file for new lines as they're written (tail-like behavior), match them against a set of alert patterns (regex), and print/log an alert when one matches.
Hint: reading a growing file means seeking to the end, then periodically checking for and reading new content, a different pattern from Chapter 09's straightforward read-the-whole-file approach.

**18. Plugin-Based CLI Application** (Chapters 08, 12, 32, 36)
Requirements: a CLI tool that discovers and loads "plugins" (separate modules implementing a shared `Protocol` or `ABC` interface) from a plugins directory, without hardcoding their names.
Hint: this combines Chapter 08's import system with Chapter 36's Factory and Strategy ideas: each plugin is a strategy, discovered and instantiated dynamically.

---

### Final Capstone Projects

Each capstone should combine OOP, type hints, async or networking, a database, tests, logging, a CLI, proper error handling, and clean project structure, everything this book has covered, into one cohesive tool.

**Capstone A: A mini vulnerability scanner (for hosts you own).**
Combines: sockets (Chapter 26), concurrency (Chapter 29 or async in Chapter 28), SQLite for storing scan history (Chapter 30), a CLI (Chapter 32), and security-conscious input handling throughout (Chapter 37).

**Capstone B: A personal API-backed dashboard tool.**
Combines: an API client (Chapter 31), caching (Chapter 34), SQLite for local persistence, a CLI with subcommands (Chapter 32), and a full test suite with mocked network calls (Chapter 22).

**Capstone C: A pluggable log-analysis and alerting platform.**
Combines: the plugin architecture idea from project 18, async or concurrent file watching (Chapters 28/29), regex-based rule matching (Chapter 19), structured logging (Chapter 21), and a clean, documented, tested codebase (Chapters 22, 35).

For each capstone: write out your own requirements and architecture before writing any code, choose a folder structure (Chapters 24, 35), implement in small, tested increments rather than all at once, and write a short extension-ideas list of your own once the core is working. That process, not just the finished tool, is the actual skill this chapter is building.

---

## 39. Learning Method Recap

### Concept

A short, standalone reference for the study loop this whole book has been built around, restated here as its own chapter so you can return to it any time without re-reading Chapter 00.

### The Loop

```text
Learn        -> read Concept and Why?, slowly
Understand    -> read Syntax and Example, type the example yourself
Code            -> break the example on purpose, see what happens
Practice          -> do the Practice exercises without looking anything up
Debug               -> when something breaks, use Chapter 23's method, not guesswork
Challenge              -> attempt the Mini Challenge with no hints first
Exam                     -> answer the Exam Question as if explaining it to someone else
```

### Working Through Hints

When you're stuck on a Mini Challenge or a project, resist jumping straight to a full solution. A useful sequence:

```text
Hint 1: what's the general approach or concept this needs?
Hint 2: what's the first concrete step?
Hint 3: what's the specific piece of syntax or logic you're missing?
Solution: the full working answer
Explanation: why it works, and why the earlier hints pointed here
```

If you want a solution to something in this book right now, just ask directly. The hints-first approach is this book's default teaching style, not a barrier.

### Why This Loop Works

Reading alone creates a false sense of understanding: recognizing an explanation feels like knowing it, but recall (writing the code yourself, answering the exam question unaided) is what actually tests and builds understanding. Debugging your own mistakes, specifically, teaches Python's actual rules far faster than reading correct code, because a bug forces you to build an accurate mental model of what really happened, not just what was supposed to happen.

### A Note on Pace

Some chapters (Type Hints, Async, Concurrency, Security) are denser than others. Don't measure progress by chapters completed per day; measure it by whether you can do the Practice exercises without looking back at the Example. If you can't yet, that's normal, not a failure: reread the Concept and Why sections, then retry.

---

## 40. Exams by Level

### Level 1: Beginner

Covers Chapters 01 to 10 (fundamentals through error handling).

1. What's the difference between `==` and `is`? Give an example where they'd produce different results.
2. Write a function that takes a list of numbers and returns only the even ones, using a comprehension.
3. What does `range(2, 10, 2)` produce?
4. Write a `for` loop using `enumerate()` that prints each item in a list alongside its position.
5. What's the difference between `append()` and `extend()` on a list?
6. Write a dictionary comprehension that maps each string in a list to its length.
7. Why does `bool("False")` evaluate to `True`?
8. Write a function with a default argument, and explain the mutable-default-argument trap in your own words.
9. What's the difference between `try`/`except`/`else` and `try`/`except`/`finally`, in terms of when each block runs?
10. Write a custom exception and raise it from a function when a given number is negative.

### Level 2: Intermediate

Covers Chapters 11 to 24 (OOP through virtual environments).

1. What's the difference between an instance method, a class method, and a static method?
2. Write a `@dataclass` representing a `Product` with `name`, `price`, and `in_stock`.
3. What problem does `@property` solve that a plain attribute doesn't?
4. Write a generator function that yields the first `n` square numbers without building a list.
5. Write a decorator that logs how long a function took to run, using `functools.wraps`.
6. What's the difference between a list comprehension and a generator expression, and when does the difference actually matter?
7. Write a context manager (using `@contextmanager`) that temporarily suppresses print output.
8. What does `str | None` mean, and how is it different from just leaving a parameter untyped?
9. Write two `pytest` tests, one using `pytest.raises` and one using `@pytest.mark.parametrize`.
10. Why should virtual environments be created per-project rather than sharing one globally?

### Level 3: Advanced

Covers Chapters 25 to 37 (networking through security).

1. Explain the difference between TCP and UDP, and why HTTP uses TCP.
2. Write a minimal TCP client that connects to `127.0.0.1:9999`, sends a message, and prints the response.
3. Why doesn't `await fetch_a()` followed by `await fetch_b()` run them concurrently? What would?
4. What does the GIL prevent, and why does multiprocessing sidestep it while threading doesn't?
5. Write a parameterized SQLite query that inserts a new row, and explain why parameterization matters.
6. What's the difference between an `ABC` and a `Protocol`, in terms of how a class satisfies each?
7. Explain, precisely, why `subprocess.run(f"cmd {user_input}", shell=True)` is dangerous, and show the safe alternative.
8. What does `functools.lru_cache` actually do, and name one kind of function it should never be applied to.
9. Why is `pickle.load()` on untrusted data a security risk, in your own words?
10. Design (in words, not full code) a database schema for a simple blog with users and posts, including the foreign key relationship.

---

## 41. Final Python Exam

A comprehensive exam spanning the entire book. Attempt it without referring back to earlier chapters first; use it afterward to identify exactly which chapters to revisit.

### Part A: Multiple Choice (25 questions)

Sample questions in this style (write out the remaining ones yourself, covering topics from across the book, as a study exercise in itself):

1. What does `range(5)` produce? (a) 1-5 (b) 0-4 (c) 0-5 (d) 1-4
2. Which of these is mutable? (a) `tuple` (b) `str` (c) `list` (d) `frozenset`
3. What does `is` compare? (a) value (b) type (c) identity (d) hash
4. Which decorator preserves a wrapped function's `__name__`? (a) `@property` (b) `@functools.wraps` (c) `@staticmethod` (d) none of these
5. What does `await asyncio.gather(a(), b())` do, compared to `await a(); await b()`?

_(Continue writing 20 more, drawing one or two from each chapter you've completed, as part of your own review process.)_

### Part B: Predict the Output (15 questions)

Sample:

```python
def f(items=[]):
    items.append(1)
    return items

print(f())
print(f())
```

```python
x = 5
y = 5
x is y   # ?

x = [1, 2]
y = [1, 2]
x is y   # ?
```

_(Write 13 more of these yourself, drawn from tricky examples across the book: mutable defaults, `is` vs `==`, generator exhaustion, decorator order, async concurrency timing, and MRO are all good sources.)_

### Part C: Debugging (10 broken programs)

Take 10 small, deliberately broken snippets (a mutable default argument bug, an off-by-one `range()`, a missing `self`, an unhandled `KeyError`, a race condition, a circular import, an un-parameterized SQL query, a blocking call inside a coroutine, a bare `except:`, and a `__slots__` misuse) and fix each one, explaining the root cause in one sentence per fix. Writing these 10 snippets yourself, based on the Common Mistakes sections throughout this book, doubles as a strong review exercise.

### Part D: Coding (10 problems)

1. Write a function that checks whether a string is a valid palindrome, ignoring case and non-alphanumeric characters.
2. Write a generator that yields prime numbers indefinitely.
3. Implement a `LRUCache` class from scratch (without `functools.lru_cache`) using a `dict` and tracking access order.
4. Write a decorator `@retry(times=3)` that retries a function on failure.
5. Write a context manager that times a block of code and logs the result.
6. Write a function that reads a CSV file and returns the average of a given numeric column.
7. Write an async function that fetches multiple URLs concurrently and returns their status codes.
8. Write a SQLite-backed function that safely inserts a user and returns their new row ID.
9. Write a CLI tool (using `argparse`) that counts word frequency in a text file.
10. Write a class implementing the Observer pattern for a simple event system.

### Part E: Architecture (5 problems)

Design, in words and a rough class/module sketch (not full implementations), a system for each:

1. A URL shortener service: what components, what storage, what happens on a collision.
2. A rate limiter for an API client: what state it needs, how it decides to block or allow a request.
3. A plugin system for a CLI tool: how plugins are discovered, loaded, and invoked.
4. A logging pipeline that writes to both a local file and a remote service, without blocking the main program.
5. A test strategy for a class that depends on both a database and a network API.

### Part F: Capstone

Build one complete project from Chapter 38's Advanced or Capstone list, end to end: requirements, architecture, implementation, tests, and a short README explaining how to run it. This is the real final exam; everything above is preparation for being able to do this confidently and cleanly.

---

## 42. 90-Day Python Plan

A day-by-day pace assumes roughly 1 to 2 hours per weekday, with lighter weekend review; adjust freely to your own schedule.

```text
Days 1-10    Chapters 01-04  (fundamentals, variables, operators, control flow)
                + Beginner Project 1 (Calculator)

Days 11-20   Chapters 05-07  (functions, data structures, strings)
                + Beginner Projects 2-3 (Guessing Game, To-Do CLI)

Days 21-30   Chapters 08-10  (modules, files, error handling)
                + Beginner Projects 4-5 (Password Generator, File Organizer)
                + Level 1 Exam (Chapter 40)

Days 31-40   Chapters 11-13  (OOP, advanced OOP, type hints)
                + revisit earlier projects, adding classes and type hints throughout

Days 41-50   Chapters 14-17  (modern features, generators, decorators, context managers)
                + Intermediate Project 7 (Log Analyzer)

Days 51-60   Chapters 18-22  (functional Python, regex, serialization, logging, testing)
                + Intermediate Projects 6, 8, 9 (Expense Tracker, JSON Database, Notes App)
                + Level 2 Exam (Chapter 40)

Days 61-70   Chapters 23-27  (debugging, packaging, networking, sockets, HTTP)
                + Intermediate Project 10, start Advanced Project 11 (REST API Client)

Days 71-80   Chapters 28-31  (async, concurrency, databases, APIs)
                + Advanced Projects 12-13 (Async Scraper, TCP Chat)

Days 81-90   Chapters 32-37  (CLI apps, internals, performance, clean code, patterns, security)
                + Advanced Projects 15-16 (Port Tool, Concurrent File Scanner)
                + Level 3 Exam (Chapter 40)
```

Weekly revision: at the end of each 10-day block, redo the Mini Challenges from that block from memory, without looking at your earlier solutions.

---

## 43. 6-Month Python Mastery Plan

For a slower, deeper pace, or alongside your existing coursework and the `bounty-pentest-roadmap` and CPTS track you're already working through.

### Month 1: Fundamentals

Chapters 01-10. Daily target: one sub-topic worked through with its full Practice section, not just read. Projects: Calculator, Guessing Game, To-Do CLI, Password Generator, File Organizer (all 5 beginner projects). Revision: Level 1 Exam at month's end.

### Month 2: Intermediate Python

Chapters 11-18 (OOP through functional Python). Daily target: one chapter every 2-3 days, with the Mini Challenge always attempted before moving on. Projects: Expense Tracker, Log Analyzer. Revision: redo 3 Chapter 01-10 Mini Challenges from memory as a retention check.

### Month 3: OOP + Type Hints, Applied

Chapters 19-24 (regex through packaging), revisiting Chapters 11-13 in the context of real projects. Projects: JSON Database, CLI Notes Application, SQLite Application. Revision: Level 2 Exam.

### Month 4: Advanced Python

Chapters 33-37 (internals, performance, clean code, design patterns, security), read early but practiced throughout the remaining months as you write more code. Projects: revisit Months 1-3 projects, refactoring with design patterns (Chapter 36) and adding tests you didn't write the first time.

### Month 5: Networking + Async

Chapters 25-31 (networking through APIs). Daily target: hands-on socket and async exercises, not just reading, since this material rewards typing code over reading about it. Projects: REST API Client, Async Web Scraper, TCP Chat Application, Async TCP Server. Revision: Level 3 Exam.

### Month 6: Projects + Advanced Topics

Chapters 32, 38-41 (CLI applications, real-world projects, learning method, exams). Projects: remaining Advanced Projects (Port Tool, Concurrent File Scanner, Log Monitoring, Plugin-Based CLI), then one full Capstone from Chapter 38. Revision: the full Final Python Exam (Chapter 41), attempted cold, then reviewed against whichever chapters exposed gaps.

### Throughout, every month

- Weekly: redo one old Mini Challenge from memory.
- Monthly: reread this book's Table of Contents and rate your own confidence per chapter, honestly; low-confidence chapters get revisited before moving forward, not after.
- Ongoing: keep building your `hash-gen` tool and the rest of your existing roadmap alongside this book. The two reinforce each other directly, since this book's later chapters (testing, packaging, CLI design, security) apply straight onto tools like that one.

---

_This completes the book: 00 through 43, fundamentals through capstone projects, exams, and a study plan to structure it all. Revisit any chapter directly by its heading whenever you need a refresher; the format never changes, so you always know where to find what you need._
---
