---
title: "Python Programming"
description: "Notes on Python Programming with Modern Type Hints."
category: "Programming"
tags: ["python", "cybersecurity", "programming"]
date: "2026-06-01"
---

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

---

## 2. Comments & Variables

```python
# Single-line comment
"""
Multi-line "comment" — technically a docstring,
Python has no true multiline comment syntax.
"""
```

**Variables**

```python
name = "Alex"
age = 12
```

Rules:

- Cannot start with a number (`1age = 5` ❌)
- Cannot contain spaces
- Cannot use special characters (except `_`)
- Case-sensitive (`Age` ≠ `age`)

**Naming conventions**

- **camelCase** — Example: `myVariable`; Used for: rare in Python, common in JS
- **PascalCase** — Example: `MyClassName`; Used for: class names
- **snake_case** — Example: `my_variable`; Used for: variables & functions (PEP8 standard)
- **SCREAMING_SNAKE** — Example: `MAX_SIZE`; Used for: constants

---

## 3. Data Types

- **Numeric** — `int`, `float`, `complex`
- **Text** — `str`
- **Boolean** — `bool`
- **Sequence** — `list`, `tuple`, `range`
- **Mapping** — `dict`
- **Set** — `set`, `frozenset`
- **Binary** — `bytes`, `bytearray`, `memoryview`
- **None** — `NoneType`

```python
x: int = 12
y: float = 3.14
z: complex = 2 + 3j
flag: bool = True
```

Check type at runtime:

```python
print(type(x))          # <class 'int'>
print(isinstance(x, int))  # True — preferred over type() == comparisons
```

---

## 4. Strings Deep Dive

- Strings take more space than `int`/`float` because **every character is stored via its Unicode code point**.
- `ord("A")` → `65`, `chr(65)` → `"A"`.
- Emoji like 😊 also have unicode values — `ord("😊")` → `128522`.

**Indexing**

```python
a = "Hello"
a[0]    # 'H'
a[-1]   # 'o'  (negative index starts from the end)
```

**Slicing** — `string[start:stop:step]`

```python
a = "hello"
a[1:4:1]   # 'ell'  (stop index is exclusive)
a[::-1]    # 'olleh'  — reverse a string, classic trick
a[::2]     # every 2nd character
```

**Strings are immutable** — any "modification" creates a new string object.

**Useful string methods:**

```python
s = "  Hello World  "
s.strip()          # 'Hello World'   — remove leading/trailing whitespace
s.lower()           # 'hello world'
s.upper()
s.replace("o", "0")
s.split()           # ['Hello', 'World']
"-".join(["a","b"]) # 'a-b'
s.startswith("He".strip())
s.find("World")     # index or -1
s.count("l")
s.zfill(5)          # pad with zeros
f"{3.14159:.2f}"    # f-string formatting → '3.14'
```

**f-strings (Python 3.6+, and the standard now):**

```python
name = "Alex"
print(f"Hello, {name}! You have {len(name)} letters.")
print(f"{3.14159:.2f}")     # 2 decimal places
print(f"{1000000:,}")       # 1,000,000
print(f"{name=}")           # debug specifier → name='Alex' (Python 3.8+)
```

---

## 5. Type Conversion

```python
a = 12
a = str(a)     # '12'
b = float("3.14")
c = bool(0)    # False
```

### Implicit vs Explicit

- **Python auto-converts (e.g. `int / int → float`)** — You manually call `int()`, `float()`, `str()`, `list()`, `tuple()`, `set()`, `dict()`, `bool()`, `complex()`

```python
print(6 / 2)   # 3.0 — implicitly becomes float
```

### Truthy / Falsy values

Only **these are falsy** in Python — everything else is truthy:

```python
0
0.0
False
""      # empty string
[]      # empty list
{}      # empty dict
set()   # empty set
None    # very important, often overlooked!
```

---

## 6. Input / Output

```python
print("Hello")                       # output
name = input("Enter your name: ")    # input — ALWAYS returns a string
print(f"Hello, {name}!")
```

- `input()` always returns `str` — you must manually convert:

```python
age = int(input("Enter age: "))
```

**print() tricks:**

```python
print("a", "b", "c", sep="-")     # a-b-c
print("no newline", end=" ")      # controls line ending
print("x", "y", file=sys.stderr)  # print to stderr instead of stdout
```

---

## 7. Operators

**Arithmetic**

- **`+`** — Add
- **`-`** — Subtract
- **`*`** — Multiply
- **`/`** — True division (always float)
- **`//`** — Floor division
- **`%`** — Modulus
- **`**`** — Exponentiation

**Assignment / Compound assignment**

```python
x = 5
x += 1   # x = x + 1
x -= 1
x *= 2
x /= 2
x //= 2
x %= 2
x **= 2
```

**Comparison**: `==`, `!=`, `>`, `<`, `>=`, `<=`

> Strings compare using ASCII/Unicode values character by character.

**Logical**: `and`, `or`, `not`

**Identity & Membership operators:**

```python
a is b          # identity — same object in memory (not just equal value)
a is not b
x in [1,2,3]    # membership
x not in "abc"
```

⚠️ Common bug: use `==` for value comparison, `is` only for identity (e.g. `is None`, `is True`).

**Bitwise operators** (used constantly in security/networking tools):

```python
a & b     # AND
a | b     # OR
a ^ b     # XOR
~a        # NOT
a << 2    # left shift
a >> 2    # right shift
```

---

## 8. Conditional Statements

```python
if condition:
    ...
elif condition2:
    ...
else:
    ...
```

**Ternary (conditional expression):**

```python
status = "Even" if x % 2 == 0 else "Odd"
```

**Walrus operator `:=`** (Python 3.8+):

```python
if (n := len(data)) > 10:
    print(f"Data too long: {n}")
```

**Match-case (Python 3.10+, Python's version of switch):**

```python
match status_code:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 400 | 401 | 403:
        print("Client error")
    case _:
        print("Unknown")
```

---

## 9. Loops

### `range()`

```python
range(start, stop, step)   # stop is exclusive; default start=0, step=1
```

### `for` loop

```python
for i in range(1, 6):
    print(i)

a = "Nature"
for i in range(len(a)):     # by index
    print(a[i])
for char in a:              # by value (preferred, more Pythonic)
    print(char)
```

### `while` loop

```python
while condition:
    ...
```

### break / continue / else

```python
for i in range(10):
    if i == 5:
        break        # exits loop entirely
    if i == 3:
        continue     # skips this iteration
else:
    # runs ONLY if loop completes without break
    print("Loop finished normally")
```

### `enumerate()` and `zip()` in loops

```python
for index, value in enumerate(["a", "b", "c"]):
    print(index, value)   # 0 a / 1 b / 2 c

for x, y in zip([1,2,3], ["a","b","c"]):
    print(x, y)            # 1 a / 2 b / 3 c
```

---

## 10. Functions

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alex")
```

### Types of arguments

```python
def add(a, b):
    return a + b
add(3, 5)                     # positional

def introduce(name, age):
    print(f"{name}, {age}")
introduce(age=25, name="Alex")  # keyword

def greet(name="Guest"):
    print(f"Hello, {name}")
greet()                        # default argument
```

### return vs print

- `print()` only displays output; it does not give the value back to the program.
- `return` sends a value back to the caller so it can be reused.

```python
def add(a, b):
    return a + b

result = add(2, 3)   # result = 5, usable elsewhere
```

### Keyword-only and positional-only params (modern Python)

```python
def f(a, b, /, c, d, *, e, f):
    ...
# a, b -> positional-only (before /)
# c, d -> positional or keyword
# e, f -> keyword-only (after *)
```

### Scope

```python
x = 10  # global

def foo():
    x = 5      # local, shadows global
    print(x)

def bar():
    global x
    x = 20     # modifies the global variable
```

---

## 11. Data Structures

Python has 4 built-in: **List, Tuple, Set, Dictionary**.

### List — `[]`

- **Mutable** — Yes
- **Duplicates** — Allowed
- **Ordered** — Yes
- **Heterogeneous** — Yes

```python
numbers = [10, 20, 30]
numbers[1] = 99          # mutable

numbers.append(10)
numbers.insert(2, 15)
numbers.extend([20, 25, 30])
numbers.remove(5)        # removes first occurrence
numbers.pop(3)           # removes & returns by index
numbers.index(6)
numbers.count(5)
numbers.sort()
numbers.reverse()
numbers.copy()
numbers.clear()
```

### Tuple — `()`

- **Mutable** — No
- **Duplicates** — Allowed
- **Ordered** — Yes
- **Heterogeneous** — Yes

```python
t = (5, 2, 9, 1, 5, 6)
t.index(9)
t.count(5)
```

Only 2 methods since tuples are immutable. Used for fixed data (coordinates, RGB, function returns).

### Set — `{}`

- **Mutable** — Yes
- **Duplicates** — No
- **Ordered** — No
- **Heterogeneous** — Only hashable types

```python
s = {1, 2, 3}
s.add(4)
s.remove(2)     # error if not found
s.discard(5)    # no error if not found
s.pop()         # removes a random element

A = {1, 2, 3}
B = {3, 4, 5}
A.union(B)                  # {1,2,3,4,5}
A.intersection(B)           # {3}
A.difference(B)             # {1,2}
A.symmetric_difference(B)   # {1,2,4,5}
```

### Dictionary — `{key: value}`

- **Mutable** — Yes (values)
- **Duplicate keys** — No (values can dup)
- **Order** — Insertion order preserved (Python 3.7+)
- **Heterogeneous** — Yes

```python
student = {"name": "Alex", "age": 20}
student["name"]              # 'Alex'

for k in student:
    print(k, ":", student[k])

student.get("email", "N/A")  # safe access with default
student.keys()
student.values()
student.items()
student.update({"age": 21})
student.pop("age")
```

---

## 12. Exception Handling

### Errors vs Exceptions

- **Syntax errors / Indentation errors** — cannot be handled, must be fixed before running.
- **Exceptions** — runtime errors that CAN be handled.

```python
try:
    print(10 / 0)
except ZeroDivisionError as e:
    print(f"Error: {e}")
else:
    print("Runs only if no exception occurred")
finally:
    print("Always runs")
```

- **`try`** — wrap code that might fail
- **`except`** — handle the exception
- **`else`** — run only if no exception occurred
- **`finally`** — always runs (cleanup)
- **`raise`** — manually throw an exception

**Custom exceptions & multiple except blocks:**

```python
class InvalidAgeError(Exception):
    pass

def check_age(age: int) -> None:
    if age < 0:
        raise InvalidAgeError("Age cannot be negative")

try:
    check_age(-1)
except InvalidAgeError as e:
    print(e)
except (ValueError, TypeError) as e:   # catch multiple types
    print(e)
except Exception as e:                  # generic fallback (catch last, be specific first)
    print(f"Unexpected: {e}")
```

---

## 13. File Handling

### Modes

- **`"r"`** — Read (default), file must exist
- **`"w"`** — Write, creates or overwrites
- **`"a"`** — Append
- **`"x"`** — Create, fails if exists
- **`"r+"`** — Read + write
- **`"rb"` / `"wb"`** — Binary mode (essential for non-text files)

```python
file = open("myfile.txt", "r")
print(file.read())
# file.readline()   # one line
# file.readlines()  # list of lines
file.close()
```

**Always prefer `with` — auto-closes the file even if an error occurs:**

```python
with open("data.txt", "r") as f:
    content = f.read()

with open("out.txt", "w") as f:
    f.write("Hello\n")
    f.writelines(["line1\n", "line2\n"])
```

**Reading line by line efficiently (important for big log files):**

```python
with open("huge_log.txt") as f:
    for line in f:          # doesn't load whole file into memory
        process(line)
```

**JSON files (used constantly for config, API data, wordlists):**

```python
import json

with open("data.json") as f:
    data = json.load(f)

with open("out.json", "w") as f:
    json.dump(data, f, indent=2)
```

**CSV handling:**

```python
import csv

with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

**pathlib (the modern replacement for `os.path`):**

```python
from pathlib import Path

p = Path("data") / "file.txt"
p.exists()
p.read_text()
p.write_text("hello")
p.suffix          # '.txt'
p.stem             # 'file'
for file in Path(".").glob("*.py"):
    print(file)
```

---

## 14. OOP in Python

### Why OOP — 3 approaches for the same task

```python
# Imperative
a, b = 12, 12
print(a + b)

# Functional
def addition(a, b):
    return a + b
print(addition(12, 12))

# OOP
class Addition:
    def __init__(self, a, b):
        print(a + b)
obj = Addition(12, 12)
```

### Classes & Objects

```python
class Animal:
    species = "Dog"          # class attribute

    def make_sound(self):    # instance method
        print("Bark!")

a = Animal()
print(a.species)
a.make_sound()
```

### Constructor

```python
class Student:
    def __init__(self, name: str) -> None:
        self.name = name     # instance attribute, self targets THIS object

s = Student("Alex")
print(s.name)
```

### Class vs Instance attributes / methods

```python
class Car:
    wheels = 4                    # class attribute — shared by all instances

    def __init__(self, color: str) -> None:
        self.color = color        # instance attribute — unique per object

    def instance_method(self):
        print("Works with the object")

    @classmethod
    def class_method(cls):
        print("Works with the class itself")

    @staticmethod
    def static_method():
        print("Doesn't touch class or instance — just grouped here")
```

### Inheritance

```python
class Parent:
    def __init__(self, name: str) -> None:
        self.name = name
    def speak(self):
        print("I can speak!")

class Child(Parent):
    def __init__(self, name: str, age: int) -> None:
        super().__init__(name)   # calls Parent's constructor
        self.age = age
    def display(self):
        print(f"My name is {self.name}, and I am {self.age} years old.")
```

Types:

- **Single** — one parent, one child.
- **Multiple** — child inherits from 2+ parents. MRO (Method Resolution Order) decides which method wins on conflicts.
- **Multilevel** — grandparent → parent → child.
- **Hierarchical** — one parent, multiple children.
- **Hybrid** — combination of the above.

```python
class Father:
    def skills(self): print("Coding")
class Mother:
    def skills(self): print("Cooking")
class Child(Father, Mother):     # multiple inheritance
    pass

print(Child.__mro__)             # inspect method resolution order
```

### Polymorphism

- **Method Overriding** — child class redefines a parent's method.

```python
class Animal:
    def sound(self): print("Animal makes a sound")
class Dog(Animal):
    def sound(self): print("Dog barks")   # overrides parent
```

- **Duck typing** — Python doesn't care about the class, only whether the object has the method being called ("if it walks like a duck and quacks like a duck...").

```python
class Duck:
    def talk(self): print("Quack!")
class Human:
    def talk(self): print("Hello!")

def make_it_talk(entity):
    entity.talk()     # works for both — duck typing
```

- Python does **not** support method overloading (same name, different params) — the latest definition overwrites earlier ones.

### Encapsulation

- **Public** — Syntax: `self.name`; Access: accessible anywhere
- **Protected** — Syntax: `self._name`; Access: convention only — accessible but "please don't"
- **Private** — Syntax: `self.__name`; Access: name-mangled, hard to access from outside

```python
class Demo:
    def __init__(self):
        self.name = "Public"       # public
        self._age = 21             # protected (convention)
        self.__salary = 50000      # private (name-mangled to _Demo__salary)

    def show(self):
        print(self.name, self._age, self.__salary)
```

### Abstraction

Python doesn't have true abstraction natively — achieved via the `abc` module.

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def make_sound(self): ...

class Dog(Animal):
    def make_sound(self):
        print("Woof!")

# Animal() would raise TypeError — can't instantiate abstract class
```

### Dunder (magic) methods

```python
class Person:
    def __init__(self, name: str) -> None:
        self.name = name

    def __str__(self) -> str:          # controls print(obj) / str(obj)
        return f"Person({self.name})"

    def __repr__(self) -> str:         # controls repr(obj), used in debugging
        return f"Person(name={self.name!r})"

    def __eq__(self, other) -> bool:   # controls ==
        return self.name == other.name

    def __len__(self) -> int:          # controls len(obj)
        return len(self.name)

    def __add__(self, other):          # controls +
        return Person(self.name + other.name)
```

Common dunders you'll actually use: `__init__`, `__str__`, `__repr__`, `__eq__`, `__lt__`, `__len__`, `__iter__`, `__enter__`/`__exit__` (context managers), `__call__`.

---

## 15. Decorators

A decorator wraps a function to modify/extend its behavior without changing its code.

```python
def my_decorator(func):
    def wrapper():
        print("Something before the function runs.")
        func()
        print("Something after the function runs.")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
```

**Decorators with arguments (using `*args, **kwargs`):**

```python
def logger(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@logger
def add(a, b):
    return a + b

add(3, 5)
```

**Using `functools.wraps` to preserve metadata (important, avoids subtle bugs):**

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)          # keeps func.__name__, __doc__ etc. intact
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

**Useful built-in decorators:**

```python
from functools import lru_cache
import time

@lru_cache(maxsize=None)   # caches results — huge speedup for recursive/expensive calls
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

def timer(func):
    def wrapper(*a, **kw):
        start = time.perf_counter()
        result = func(*a, **kw)
        print(f"{func.__name__} took {time.perf_counter()-start:.4f}s")
        return result
    return wrapper
```

---

## 16. *args and **kwargs

```python
def fun(*args, **kwargs):
    print("args:", args)      # tuple of positional args
    print("kwargs:", kwargs)  # dict of keyword args

fun(1, 2, 3, name="Alex", age=21)
# args: (1, 2, 3)
# kwargs: {'name': 'Alex', 'age': 21}
```

- `*args` → any number of positional args, collected as a **tuple**.
- `**kwargs` → any number of keyword args, collected as a **dict**.
- The names `args`/`kwargs` are just convention — only `*` and `**` matter.

**Unpacking (the reverse direction):**

```python
def add(a, b, c): return a + b + c
nums = [1, 2, 3]
add(*nums)                # unpacks list into positional args

info = {"a": 1, "b": 2, "c": 3}
add(**info)                # unpacks dict into keyword args
```

---

## 17. Comprehensions & Lambda

```python
labels = ["Even" if x % 2 == 0 else "Odd" for x in range(5)]
evens = {x: x*x for x in range(10) if x % 2 == 0}          # dict comprehension
unique_squares = {x*x for x in range(10) if x % 2 == 0}    # set comprehension
```

**Generator expressions** (memory-efficient, lazy evaluation, huge for large data/log files):

```python
gen = (x*x for x in range(1000000))   # doesn't build the whole list in memory
sum(x for x in range(10) if x % 2 == 0)
```

### Lambda

```python
square = lambda x: x**2
check_even = lambda x: "Even" if x % 2 == 0 else "Odd"
```

- Anonymous, single-expression function.
- Best for short, throwaway logic (sort keys, map/filter callbacks).

---

## 18. map, filter, zip, reduce

```python
numbers = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, numbers))          # [2, 4, 6, 8]
evens = list(filter(lambda x: x % 2 == 0, numbers))    # [2, 4]

# zip — pairs elements from multiple iterables
names = ["a", "b"]
ages = [1, 2]
list(zip(names, ages))    # [('a', 1), ('b', 2)]
```

**`functools.reduce`:**

```python
from functools import reduce
total = reduce(lambda acc, x: acc + x, [1, 2, 3, 4])   # 10
```

---

## 19. Modules & Packages

- **Module** = a single `.py` file with reusable code.
- **Package** = a folder of modules (with `__init__.py` in older Python, optional since 3.3+ namespace packages).

```python
import math
print(math.sqrt(16))    # 4.0

from math import sqrt, pi
import numpy as np       # alias — very common convention
from datetime import datetime
import random
```

**The `if __name__ == "__main__":` guard** (essential, every real script needs this):

```python
def main():
    print("Running as script")

if __name__ == "__main__":
    main()   # only runs when the file is executed directly, not when imported
```

**Common standard library modules worth knowing:**

- **`os`** — filesystem, environment variables
- **`sys`** — interpreter internals, argv, stdout/stderr
- **`subprocess`** — run shell commands from Python
- **`re`** — regular expressions
- **`argparse`** — build CLI tools with proper `--flag` parsing
- **`logging`** — proper logging instead of print()
- **`datetime`** — dates and times
- **`random` / `secrets`** — random numbers (`secrets` for crypto-safe randomness)
- **`hashlib`** — hashing (md5, sha256, etc.)
- **`socket`** — raw networking
- **`threading` / `multiprocessing`** — concurrency
- **`asyncio`** — async I/O

---

## 20. Type Hints — Modern Python

Type hints don't change runtime behavior (Python stays dynamically typed) — they help editors, linters (`mypy`, `pyright`), and other devs understand your code.

### Basic hints

```python
def greet(name: str) -> str:
    return f"Hello, {name}"

age: int = 25
price: float = 9.99
is_valid: bool = True
```

### Modern collection hints (Python 3.9+ — use built-ins directly, no `typing.List` needed anymore)

```python
def total(nums: list[int]) -> int:
    return sum(nums)

def lookup(data: dict[str, int]) -> int | None:   # 3.10+ union syntax
    return data.get("key")

coords: tuple[float, float] = (12.5, 45.2)
names: set[str] = {"a", "b"}
```

Old style (still works, but outdated):

```python
from typing import List, Dict, Optional
def f(x: List[int]) -> Optional[str]: ...
```

Modern style (3.10+):

```python
def f(x: list[int]) -> str | None: ...
```

### Optional / union types

```python
def find_user(uid: int) -> dict[str, str] | None:
    ...

def process(value: int | str) -> None:   # accepts either type
    ...
```

### Function type hints with defaults

```python
def connect(host: str, port: int = 8080, timeout: float | None = None) -> bool:
    ...
```

### Type aliases (clean up complex signatures)

```python
type UserId = int                       # Python 3.12+ native syntax
type Headers = dict[str, str]

def fetch(uid: UserId, headers: Headers) -> bytes:
    ...

# pre-3.12 way (still valid everywhere):
UserId = int
Headers = dict[str, str]
```

### Callable, Any, and function hints

```python
from typing import Any, Callable

def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

def parse(data: Any) -> dict:   # escape hatch — avoid overusing
    ...
```

### TypedDict — structured dict shapes (great for JSON/config)

```python
from typing import TypedDict

class UserInfo(TypedDict):
    name: str
    age: int
    active: bool

user: UserInfo = {"name": "Alex", "age": 21, "active": True}
```

### Generics (Python 3.12+ new syntax)

```python
class Box[T]:                          # 3.12+ generic class syntax
    def __init__(self, item: T) -> None:
        self.item = item
    def get(self) -> T:
        return self.item

def first[T](items: list[T]) -> T:     # 3.12+ generic function syntax
    return items[0]

# pre-3.12 generics (still common in real-world code today):
from typing import TypeVar, Generic
T = TypeVar("T")
class Box(Generic[T]):
    def __init__(self, item: T) -> None:
        self.item = item
```

### Dataclasses — typed, boilerplate-free classes (huge upgrade over manual `__init__`)

```python
from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int
    tags: list[str] = field(default_factory=list)   # mutable default — safe way
    active: bool = True

u = User(name="Alex", age=21)
print(u)                 # auto-generated __repr__: User(name='Alex', age=21, ...)
print(u == User(name="Alex", age=21, tags=[]))  # auto-generated __eq__ → True
```

Frozen (immutable) dataclasses:

```python
@dataclass(frozen=True)
class Point:
    x: float
    y: float
# p.x = 5  -> raises FrozenInstanceError
```

### Protocol — structural typing / "duck typing with type checking"

```python
from typing import Protocol

class Sized(Protocol):
    def __len__(self) -> int: ...

def print_length(obj: Sized) -> None:
    print(len(obj))    # works with any object that HAS __len__, no inheritance needed
```

### Literal — restrict to specific values

```python
from typing import Literal

def set_mode(mode: Literal["read", "write", "append"]) -> None:
    ...
```

### Self type (3.11+) — for fluent/chained methods

```python
from typing import Self

class Builder:
    def add(self, item: str) -> Self:
        ...
        return self
```

### Checking types at runtime

```bash
pip install mypy --break-system-packages
mypy script.py
```

Type hints are NOT enforced at runtime by default — `mypy`/`pyright` are static checkers you run separately.

---

## 21. More Fundamentals

### Mutable default argument trap (classic Python gotcha)

```python
# WRONG — the list is shared across ALL calls!
def add_item(item, items=[]):
    items.append(item)
    return items

# CORRECT
def add_item(item, items: list | None = None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Shallow vs deep copy

```python
import copy

a = [[1, 2], [3, 4]]
b = a.copy()             # shallow — inner lists still shared!
c = copy.deepcopy(a)     # deep — fully independent copy
```

### Iterators and generators

```python
def count_up(n):
    i = 1
    while i <= n:
        yield i           # generator function — lazy, memory efficient
        i += 1

for num in count_up(5):
    print(num)
```

- `yield` pauses and resumes a function, unlike `return` which ends it.
- Generators are used for streaming large datasets, wordlists, or infinite sequences.

### Context managers (the `with` statement, beyond files)

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Elapsed: {time.time() - self.start:.2f}s")

with Timer():
    do_something_slow()
```

Or the simpler decorator way:

```python
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield
    print(f"Elapsed: {time.time()-start:.2f}s")

with timer():
    do_something_slow()
```

### String formatting — old vs new

```python
"Hello %s" % name              # old, avoid
"Hello {}".format(name)        # .format(), still seen
f"Hello {name}"                # modern, use this
```

### Virtual environments & dependency management

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip freeze > requirements.txt
```

### Command-line arguments

```python
import sys
print(sys.argv)              # list of CLI args, argv[0] is script name

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("-u", "--url", required=True)
parser.add_argument("-v", "--verbose", action="store_true")
args = parser.parse_args()
print(args.url, args.verbose)
```

### Logging instead of print (important for real tools)

```python
import logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logging.info("Started scan")
logging.warning("Rate limit approaching")
logging.error("Request failed")
```

---

## 22. Pro Tricks & Idioms

```python
# Swap without a temp variable
a, b = 1, 2
a, b = b, a

# Multiple assignment / unpacking
x, y, z = 1, 2, 3
first, *rest = [1, 2, 3, 4]     # first=1, rest=[2,3,4]
*rest, last = [1, 2, 3, 4]      # rest=[1,2,3], last=4

# Chained comparisons
if 0 < x < 10:
    ...

# Flattening a list of lists
matrix = [[1,2],[3,4]]
flat = [item for row in matrix for item in row]

# Counting elements — Counter
from collections import Counter
Counter("mississippi")     # {'i': 4, 's': 4, 'p': 2, 'm': 1}
Counter("mississippi").most_common(2)

# Default dict — avoids KeyError boilerplate
from collections import defaultdict
d = defaultdict(list)
d["missing_key"].append(1)   # auto-creates the list, no KeyError

# Merging dicts (3.9+)
a = {"x": 1}
b = {"y": 2}
merged = a | b               # {'x': 1, 'y': 2}
a |= b                       # in-place merge

# Named tuples — lightweight, typed-ish records
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
p.x, p.y

# One-liner file read
content = open("file.txt").read()   # ok for quick scripts, prefer `with` for real code

# Enumerate with custom start
for i, val in enumerate(["a","b"], start=1):
    print(i, val)   # 1 a / 2 b

# Sorting with key functions
data = [("a", 3), ("b", 1)]
sorted(data, key=lambda x: x[1])
sorted(data, key=lambda x: x[1], reverse=True)

# Any / all
any(x > 5 for x in [1, 2, 6])   # True
all(x > 0 for x in [1, 2, 3])   # True

# Set for fast membership checks (O(1) vs O(n) for lists)
allowed = {"admin", "user"}
if role in allowed:   # much faster than `if role in ["admin","user"]` for large sets
    ...
```

---

## 23. Security / Scripting-Specific Python

A few things worth having in your notes for web pentesting/tooling:

```python
# requests basics
import requests
r = requests.get("https://example.com", timeout=5)
r.status_code, r.headers, r.text

r = requests.post("https://example.com/login", data={"user": "admin"})
r = requests.get(url, params={"id": 1}, headers={"User-Agent": "custom"})

# Session for keeping cookies across requests
s = requests.Session()
s.get("https://example.com/login")
s.post("https://example.com/login", data={...})

# hashing
import hashlib
hashlib.md5(b"data").hexdigest()
hashlib.sha256(b"data").hexdigest()

# base64 / url encoding — used constantly in web pentesting
import base64
base64.b64encode(b"payload").decode()
base64.b64decode("cGF5bG9hZA==").decode()

from urllib.parse import quote, unquote
quote("' OR 1=1--")        # url-encode payload
unquote("%27%20OR%201%3D1--")

# threading for concurrent requests (basic fuzzing/recon speedup)
from concurrent.futures import ThreadPoolExecutor

def check(url):
    return requests.get(url, timeout=3).status_code

urls = [f"https://target.com/{i}" for i in range(100)]
with ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(check, urls))

# regex for extracting patterns (emails, tokens, params)
import re
re.findall(r'[\w.-]+@[\w.-]+', text)          # emails
re.findall(r'name="(\w+)"', html)              # form field names

# reading wordlists efficiently
with open("wordlist.txt") as f:
    for word in f:
        payload = word.strip()
        # use payload...
```

**Type-hinted example tying it together:**

```python
from dataclasses import dataclass
import requests

@dataclass
class ScanResult:
    url: str
    status: int
    length: int

def probe(url: str, timeout: float = 5.0) -> ScanResult | None:
    try:
        r = requests.get(url, timeout=timeout)
        return ScanResult(url=url, status=r.status_code, length=len(r.content))
    except requests.RequestException:
        return None

def scan(urls: list[str]) -> list[ScanResult]:
    results: list[ScanResult] = []
    for url in urls:
        if (res := probe(url)) is not None:
            results.append(res)
    return results
```

---

## Quick Reference — Falsy values

```
0, 0.0, False, "", [], {}, set(), None
```

## Quick Reference — Mutable vs Immutable

- **list** — str
- **dict** — tuple
- **set** — int, float, bool, complex
- **(none)** — frozenset

---

_Notes on Python programming, covering modern type hints (3.10–3.12 syntax), core fundamentals, and practical tricks for scripting/security work._
