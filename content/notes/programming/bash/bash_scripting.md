---
title: 'Bash Scripting'
description: 'Become a bash wizard'
category: 'Programming'
tags: ['bash', 'bash-scripting', 'linux']
date: '10-11-2026'
---

## Table of contents

1. [What is a Shell](#what-is-a-shell)
2. [What is Bash](#what-is-bash)
3. [Types of Shells](#types-of-shells)
4. [What is a Terminal](#what-is-a-terminal)
5. [Built-in vs External Commands](#built-in-vs-external-commands)
6. [Useful Discovery Commands](#useful-discovery-commands)
7. [PATH Variable](#path-variable)
8. [Quoting: Single Quotes, Double Quotes, and Command Substitution](#quoting-single-quotes-double-quotes-and-command-substitution)
9. [Variables](#variables)
10. [Space Manipulation](#space-manipulation)
11. [Unsetting Variables](#unsetting-variables)
12. [Special Shell Variables](#special-shell-variables)
13. [Shebang Line](#shebang-line)
14. [User Input](#user-input)
15. [Functions](#functions)
16. [Conditionals](#conditionals)
17. [For Loops](#for-loops)
18. [Input / Output](#input--output)
19. [Case Statements](#case-statements)
20. [Indexed Arrays](#indexed-arrays)
21. [Associative Arrays](#associative-arrays)
22. [IFS Variable](#ifs-variable)
23. [Command Substitution](#command-substitution)
24. [Arithmetic Expressions](#arithmetic-expressions)
25. [Process Substitution](#process-substitution)
26. [cut and tr](#cut-and-tr)
27. [sed, awk, and grep](#sed-awk-and-grep)
28. [Find Command](#find-command)
29. [Bash Arguments](#bash-arguments)
30. [Pipe Status](#pipe-status)
31. [Timing Commands](#timing-commands)
32. [Sourcing Code](#sourcing-code)
33. [Curlies vs. Parens](#curlies-vs-parens)
34. [Return vs. Output](#return-vs-output)
35. [Parameter Expansion](#parameter-expansion)
36. [Array Expansion](#array-expansion)
37. [Basic Globbing](#basic-globbing)
38. [Extended Globbing](#extended-globbing)
39. [Glob Shell Options](#glob-shell-options)
40. [Brace Expansion](#brace-expansion)
41. [Braces and Globbing](#braces-and-globbing)
42. [Numeric Brace Expansion](#numeric-brace-expansion)
43. [printf and Date Formatting](#printf-and-date-formatting)
44. [Regular Expressions](#regular-expressions)
45. [mapfile](#mapfile)
46. [Brackets vs. Test](#brackets-vs-test)
47. [Special Strings](#special-strings)
48. [Trap Signals](#trap-signals)
49. [Named Pipes](#named-pipes)
50. [Color Output](#color-output)
51. [Cursor Commands](#cursor-commands)
52. [Is a TTY](#is-a-tty)
53. [PS1 Variable](#ps1-variable)
54. [Customizing Bash](#customizing-bash)
55. [Readline Shortcuts](#readline-shortcuts)
56. [Pitfall: ls](#pitfall-ls)
57. [Aliases with Arguments](#aliases-with-arguments)
58. [Pitfall: String Length](#pitfall-string-length)
59. [Forkbomb](#forkbomb)
60. [Debugging](#debugging)

---

## What is a Shell

A **shell** is a command-line interpreter that acts as an interface between the user and the operating system kernel. It reads commands from the user (or from a script) and passes them to the kernel for execution.

The shell is a user-space program. It does not directly manage hardware; it communicates with the kernel through system calls.

---

## What is Bash

**Bash** (Bourne Again SHell) is a Unix shell and command language written as a free replacement for the Bourne shell (`sh`). It was first released in 1989 and is the default shell on most Linux distributions.

Bash provides:

- Interactive command execution
- Scripting capabilities (variables, loops, conditionals, functions)
- Job control
- Command history and completion

---

## Types of Shells

| Shell          | Name                       | Notes                                                   |
| -------------- | -------------------------- | ------------------------------------------------------- |
| `sh`           | Bourne Shell               | Original Unix shell, minimal feature set                |
| `bash`         | Bourne Again SHell         | Most common on Linux; POSIX-compliant with extensions   |
| `zsh`          | Z Shell                    | Extended bash with better completion and theming        |
| `fish`         | Friendly Interactive SHell | User-friendly, not POSIX-compliant                      |
| `dash`         | Debian Almquist Shell      | Minimal, fast; used as `/bin/sh` on Debian/Ubuntu       |
| `ksh`          | Korn Shell                 | Combines sh and csh features; common on commercial Unix |
| `csh` / `tcsh` | C Shell / TENEX C Shell    | C-like syntax; less common for scripting                |

Shells can be **login shells** (started at login, source `/etc/profile` and `~/.bash_profile`) or **non-login interactive shells** (source `~/.bashrc`).

---

## What is a Terminal

A **terminal** (or terminal emulator) is a program that provides a text-based interface to a shell. It handles input/output: it sends your keystrokes to the shell process and displays the shell's output on screen.

Examples: `gnome-terminal`, `alacritty`, `kitty`, `xterm`, `tmux`, `screen`.

A **TTY** (teletypewriter) is the kernel-level device that the terminal emulator connects to. You can see active TTYs with `tty` or `who`.

The terminal is not the shell. The shell runs inside the terminal.

---

## Built-in vs External Commands

**Built-in commands** are part of the shell itself. They run in the current shell process and have no separate binary on disk.

**External commands** are standalone executables that live somewhere on the filesystem (usually under `/bin`, `/usr/bin`, `/usr/local/bin`). The shell forks a child process to run them.

**Why it matters:** Built-ins like `cd`, `export`, and `source` must be built in because they need to modify the current shell's state. An external `cd` would change directory in a child process, which would have no effect on the parent.

### Identifying command type with `type`

```bash
type echo        # echo is a shell builtin
type ls          # ls is /usr/bin/ls
type cd          # cd is a shell builtin
type type        # type is a shell builtin
```

### List all builtins with `compgen`

```bash
compgen -b       # list all bash builtins
compgen -c       # list all commands available (builtins + PATH)
compgen -k       # list all keywords (if, while, for, etc.)
compgen -a       # list all aliases
compgen -A function  # list all functions
```

---

## Useful Discovery Commands

### `type`

Tells you what a command is: alias, function, builtin, file, or not found.

```bash
type -a ls       # show all matches including aliases and PATH entries
type -t ls       # print only the type: alias, keyword, function, builtin, file
```

### `which`

Searches PATH for an external executable. Does not report builtins or functions.

```bash
which bash       # /usr/bin/bash
which python3    # /usr/bin/python3
```

Prefer `type` over `which` in scripts since `which` only knows about external binaries.

### `tr`

Translates or deletes characters from stdin.

```bash
echo "hello" | tr 'a-z' 'A-Z'    # HELLO
echo "hello world" | tr -d ' '   # helloworld
echo "aabbcc" | tr -s 'a-z'      # abc  (squeeze repeated chars)
echo "hello" | tr -d 'aeiou'     # hll
```

### `cut`

Cuts out sections from each line of input.

```bash
echo "a:b:c:d" | cut -d':' -f2         # b
echo "a:b:c:d" | cut -d':' -f2-3       # b:c
echo "hello world" | cut -c1-5         # hello
cat /etc/passwd | cut -d':' -f1        # list all usernames
```

Options:

- `-d` delimiter
- `-f` field number(s)
- `-c` character position(s)

---

## PATH Variable

`PATH` is an environment variable that holds a colon-separated list of directories. When you type a command, the shell searches each directory in `PATH` in order and runs the first matching executable it finds.

```bash
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/user/.local/bin
```

### Add a directory to PATH

```bash
export PATH="$HOME/.local/bin:$PATH"   # prepend (searched first)
export PATH="$PATH:$HOME/.local/bin"   # append (searched last)
```

Place this line in `~/.bashrc` or `~/.bash_profile` to make it persistent.

### View which binary would be run

```bash
which python3
type python3
```

---

## Quoting: Single Quotes, Double Quotes, and `$()`

This is one of the most important concepts in bash scripting.

### Single quotes `' '`

Everything inside single quotes is treated as a literal string. No variable expansion, no command substitution, no special characters are interpreted.

```bash
var='apple mango'
echo '$var'        # $var  (literal dollar sign and word)
echo 'hello\n'     # hello\n  (backslash is literal)
```

### Double quotes `" "`

Variables and command substitutions inside double quotes are expanded. Most other special characters (like `*`, `?`, `~`) are not. Word splitting does not happen on the result.

```bash
var='apple mango'
echo "$var"        # apple mango
name="world"
echo "hello $name" # hello world
echo "result: $(date)"  # result: Thu Nov 12 10:00:00 IST 2026
```

Always double-quote variable expansions to prevent word splitting and globbing:

```bash
file="my file.txt"
cat "$file"    # correct: treats it as one argument
cat $file      # wrong: splits on space, tries to cat "my" and "file.txt"
```

### Backticks `` ` ` `` vs `$()`

Both perform command substitution (run a command and capture its output), but `$()` is preferred.

```bash
result=`date`     # old style (backticks)
result=$(date)    # modern style (preferred)
```

`$()` is preferred because:

- It is easier to read
- It can be nested: `$(outer $(inner))`
- Backslash behavior inside backticks is confusing

---

## Variables

Bash variables are untyped by default. The variable holds a string; arithmetic operations interpret the string as a number.

### Declaring and assigning

```bash
name="Alice"       # no spaces around =
count=42
path="/usr/local/bin"
```

There must be no spaces around `=`. `name = "Alice"` is a syntax error (bash interprets `name` as a command).

### Accessing variables

```bash
echo $name         # Alice
echo ${name}       # Alice (braces are optional here but useful for disambiguation)
echo "Hello, ${name}!"  # Hello, Alice!
```

### Local variables in functions

```bash
greet() {
    local greeting="Hello"
    echo "$greeting, $1"
}
```

`local` restricts the variable to the function scope. Without `local`, variables are global.

### Read-only variables

```bash
readonly PI=3.14159
PI=3   # bash: PI: readonly variable
```

### Environment variables vs shell variables

A **shell variable** exists only in the current shell. An **environment variable** is exported and inherited by child processes.

```bash
MY_VAR="hello"          # shell variable only
export MY_VAR="hello"   # environment variable
export MY_VAR           # export an already-set variable
```

### Declare

```bash
declare -i num=10       # integer type (arithmetic is auto-applied)
declare -r CONST=5      # readonly
declare -a arr          # indexed array
declare -A map          # associative array
declare -x VAR="val"    # export (same as export)
declare -l str="HELLO"  # lowercase automatically
declare -u str="hello"  # uppercase automatically
```

---

## Space Manipulation

Bash treats spaces as argument separators by default. This causes common bugs.

```bash
var='apple mango'

echo '$var'    # $var    (single quotes: no expansion)
echo "$var"    # apple mango  (double quotes: expanded, spaces preserved)
echo $var      # apple mango  (without quotes: same here, but risky in general)
```

The danger appears when the value contains characters that trigger word splitting or globbing:

```bash
files="*.txt"
ls $files      # expands glob: lists .txt files
ls "$files"    # looks for a file literally named *.txt
```

---

## Unsetting Variables

```bash
var="hello"
echo $var    # hello
unset var
echo $var    # (empty, no output)
```

After `unset`, the variable no longer exists. Referencing it returns an empty string without error (unless `set -u` / `set -o nounset` is active, which causes an error on unset variable access).

---

## Special Shell Variables

```bash
echo $BASH           # path to the current bash binary: /usr/bin/bash
echo $BASH_VERSION   # bash version string: 5.2.15(1)-release
echo $SHELL          # user's default shell from /etc/passwd
echo $HOME           # current user's home directory
echo $USER           # current username
echo $HOSTNAME       # machine hostname
echo $PWD            # current working directory
echo $OLDPWD         # previous working directory
echo $PPID           # PID of the parent process
echo $?              # exit status of the last command (0 = success)
echo $!              # PID of the last background job
echo $$              # PID of the current shell
echo $0              # name of the script or shell
echo $LINENO         # current line number in the script
echo $RANDOM         # random integer between 0 and 32767
```

---

## Shebang Line

The shebang (`#!`) on line 1 tells the kernel which interpreter to use when executing the file.

```bash
#!/bin/bash          # hardcoded path; works on most systems
#!/usr/bin/env bash  # preferred: searches PATH for bash
```

`/bin/bash` is not guaranteed to exist on all systems (e.g., NixOS, some BSD variants). Using `env` is more portable.

Verify bash location:

```bash
which bash
# /usr/bin/bash
```

Make a script executable:

```bash
chmod +x script.sh
./script.sh
```

---

## User Input

### `read`

```bash
read name
echo "Hello, $name"
```

```bash
read -p "Enter your name: " name    # -p prints a prompt
read -s -p "Password: " password    # -s hides input (silent)
read -t 5 -p "Input (5s timeout): " val  # -t timeout in seconds
read -n 1 -p "Press a key: " key    # -n read exactly N characters
read -r line                         # -r disables backslash escaping (recommended)
```

Always use `-r` unless you specifically need backslash interpretation. Without `-r`, a user typing `\n` sends a newline, not the two characters `\n`.

### Reading multiple values

```bash
read first last <<< "John Doe"
echo "$first"   # John
echo "$last"    # Doe
```

### Reading from a file line by line

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

`IFS=` prevents leading and trailing whitespace from being stripped.

---

## Functions

```bash
greet() {
    echo "Hello, $1"
}

greet "Alice"    # Hello, Alice
```

### Syntax variations

```bash
# POSIX style
greet() {
    echo "Hello, $1"
}

# bash keyword style
function greet {
    echo "Hello, $1"
}
```

Both work in bash. The POSIX style (`greet()`) is more portable.

### Arguments

Inside a function, positional parameters refer to the function's own arguments, not the script's.

```bash
show_args() {
    echo "Arg 1: $1"
    echo "Arg 2: $2"
    echo "All args: $@"
    echo "Arg count: $#"
}

show_args one two three
```

### Local scope

```bash
x="global"

modify() {
    local x="local"
    echo "Inside: $x"
}

modify
echo "Outside: $x"
# Inside: local
# Outside: global
```

### Return values

`return` sets the exit status (integer 0-255). To return a string, use stdout.

```bash
add() {
    echo $(( $1 + $2 ))
}

result=$(add 3 4)
echo $result    # 7
```

---

## Conditionals

### `if` statement

```bash
if [ condition ]; then
    # commands
elif [ other_condition ]; then
    # commands
else
    # commands
fi
```

### File tests

```bash
if [ -f "$file" ]; then echo "is a regular file"; fi
if [ -d "$dir" ]; then echo "is a directory"; fi
if [ -e "$path" ]; then echo "exists"; fi
if [ -r "$file" ]; then echo "readable"; fi
if [ -w "$file" ]; then echo "writable"; fi
if [ -x "$file" ]; then echo "executable"; fi
if [ -s "$file" ]; then echo "non-empty file"; fi
if [ -L "$link" ]; then echo "is a symlink"; fi
```

### String tests

```bash
if [ -z "$str" ]; then echo "empty string"; fi
if [ -n "$str" ]; then echo "non-empty string"; fi
if [ "$a" = "$b" ]; then echo "strings equal"; fi
if [ "$a" != "$b" ]; then echo "strings not equal"; fi
```

### Integer comparisons

```bash
if [ "$a" -eq "$b" ]; then echo "equal"; fi       # -eq =
if [ "$a" -ne "$b" ]; then echo "not equal"; fi   # -ne !=
if [ "$a" -lt "$b" ]; then echo "less than"; fi   # -lt <
if [ "$a" -le "$b" ]; then echo "less or equal"; fi
if [ "$a" -gt "$b" ]; then echo "greater than"; fi
if [ "$a" -ge "$b" ]; then echo "greater or equal"; fi
```

### `[[ ]]` (bash-only extended test)

```bash
if [[ "$str" == *"sub"* ]]; then echo "contains 'sub'"; fi   # glob match
if [[ "$str" =~ ^[0-9]+$ ]]; then echo "all digits"; fi      # regex match
if [[ -f "$f" && -r "$f" ]]; then echo "file is readable"; fi
```

`[[ ]]` does not perform word splitting or glob expansion on variables. Prefer it over `[ ]` in bash scripts.

---

## For Loops

### Iterate over a list

```bash
for item in one two three; do
    echo "$item"
done
```

### Iterate over an array

```bash
fruits=("apple" "banana" "cherry")
for fruit in "${fruits[@]}"; do
    echo "$fruit"
done
```

### C-style loop

```bash
for (( i=0; i<5; i++ )); do
    echo "$i"
done
```

### Iterate over files

```bash
for file in *.txt; do
    echo "Processing: $file"
done
```

### Iterate over lines of a file

```bash
while IFS= read -r line; do
    echo "$line"
done < input.txt
```

### `while` and `until`

```bash
count=0
while [ "$count" -lt 5 ]; do
    echo "$count"
    (( count++ ))
done

until [ "$count" -ge 5 ]; do
    echo "$count"
    (( count++ ))
done
```

---

## Input / Output

### Standard streams

| Stream | FD  | Default  |
| ------ | --- | -------- |
| stdin  | 0   | keyboard |
| stdout | 1   | terminal |
| stderr | 2   | terminal |

### Redirection

```bash
command > file.txt       # redirect stdout to file (overwrite)
command >> file.txt      # redirect stdout to file (append)
command 2> err.txt       # redirect stderr to file
command 2>&1             # redirect stderr to wherever stdout goes
command > out.txt 2>&1   # both stdout and stderr to file
command &> file.txt      # bash shorthand: both stdout and stderr
command < input.txt      # redirect stdin from file
command > /dev/null      # discard stdout
command > /dev/null 2>&1 # discard stdout and stderr
```

### Here-document

```bash
cat << EOF
line one
line two
EOF
```

### Here-string

```bash
grep "pattern" <<< "some string to search"
```

### Pipes

Connect stdout of one command to stdin of the next.

```bash
ls -la | grep ".txt" | wc -l
```

---

## Case Statements

```bash
case "$variable" in
    pattern1)
        # commands
        ;;
    pattern2 | pattern3)
        # commands for either
        ;;
    *.txt)
        echo "text file"
        ;;
    *)
        echo "default case"
        ;;
esac
```

Patterns support glob syntax: `*`, `?`, `[abc]`.

```bash
read -p "Enter y or n: " answer
case "$answer" in
    [yY] | [yY][eE][sS])
        echo "Yes"
        ;;
    [nN] | [nN][oO])
        echo "No"
        ;;
    *)
        echo "Invalid"
        ;;
esac
```

---

## Indexed Arrays

```bash
arr=("apple" "banana" "cherry")

echo "${arr[0]}"       # apple
echo "${arr[1]}"       # banana
echo "${arr[@]}"       # all elements
echo "${#arr[@]}"      # number of elements: 3

arr[3]="date"          # add element
arr+=("elderberry")    # append

unset arr[1]           # remove element at index 1
unset arr              # remove entire array
```

### Iterating

```bash
for item in "${arr[@]}"; do
    echo "$item"
done

# with index
for i in "${!arr[@]}"; do
    echo "$i: ${arr[$i]}"
done
```

### Slicing

```bash
echo "${arr[@]:1:2}"   # elements starting at index 1, length 2
```

---

## Associative Arrays

Requires bash 4.0 or later. Must be declared with `declare -A`.

```bash
declare -A person
person["name"]="Alice"
person["age"]="30"
person["role"]="admin"

echo "${person["name"]}"    # Alice
echo "${!person[@]}"        # all keys
echo "${person[@]}"         # all values
echo "${#person[@]}"        # number of pairs
```

### Iterating

```bash
for key in "${!person[@]}"; do
    echo "$key = ${person[$key]}"
done
```

### Check if key exists

```bash
if [[ -v person["name"] ]]; then
    echo "key exists"
fi
```

---

## IFS Variable

`IFS` (Internal Field Separator) determines how bash splits words. Default value is space, tab, and newline.

```bash
echo "$IFS" | cat -A     # shows the default: space, tab, newline
```

### Custom IFS for splitting

```bash
IFS=':' read -ra parts <<< "one:two:three"
echo "${parts[0]}"   # one
echo "${parts[1]}"   # two
```

### IFS in loops

```bash
IFS=$'\n'                   # split on newlines only
for line in $(cat file.txt); do
    echo "$line"
done
unset IFS                   # restore default
```

Always restore IFS after changing it, or use a subshell to contain the change.

### IFS and read

```bash
IFS=',' read -ra fields <<< "a,b,c,d"
# fields = (a b c d)
```

---

## Command Substitution

Captures the stdout output of a command and places it into the script.

```bash
result=$(command)
result=`command`     # older syntax, avoid
```

```bash
today=$(date +%Y-%m-%d)
echo "Today is $today"

files=$(ls *.sh)
count=$(echo "$files" | wc -l)

# nested
upper=$(echo $(hostname) | tr 'a-z' 'A-Z')
```

The output has trailing newlines stripped automatically. Use `printf '%s' "$result"` if you need to preserve them.

---

## Arithmetic Expressions

### `(( ))` double parentheses

```bash
(( a = 5 + 3 ))
echo $a           # 8

(( a++ ))
echo $a           # 9

if (( a > 5 )); then
    echo "greater"
fi
```

`(( ))` returns exit status 0 if the expression is non-zero, 1 if zero. Useful in conditionals.

### `$(( ))` arithmetic expansion

```bash
echo $(( 10 / 3 ))     # 3  (integer division)
echo $(( 10 % 3 ))     # 1  (modulo)
echo $(( 2 ** 8 ))     # 256 (exponentiation)

a=5
b=3
echo $(( a * b ))      # 15
```

### `let`

```bash
let a=5+3
let "a = 5 + 3"
let a++
```

Avoid `let` in favour of `(( ))` for clarity.

### `expr` (external command, avoid)

```bash
expr 5 + 3     # 8  (spaces required)
```

`expr` is an external binary and slower. Use `(( ))` instead.

---

## Process Substitution

Process substitution treats the output of a command as a file. Uses `<(command)` or `>(command)`.

```bash
diff <(sort file1.txt) <(sort file2.txt)
```

This pipes the sorted output of each file into `diff` without creating temporary files.

```bash
# compare two command outputs
diff <(ls dir1) <(ls dir2)

# read from two simultaneous processes
while IFS= read -r line; do
    echo "$line"
done < <(find . -name "*.sh")
```

`<(cmd)` creates a named pipe (or `/dev/fd/N` file descriptor) that the outer command reads from.

---

## cut and tr

### `cut`

Extracts sections from each line.

```bash
# by delimiter and field
echo "root:x:0:0:root:/root:/bin/bash" | cut -d':' -f1    # root
echo "root:x:0:0:root:/root:/bin/bash" | cut -d':' -f1,7  # root:/bin/bash
echo "root:x:0:0:root:/root:/bin/bash" | cut -d':' -f2-   # x:0:0:root:/root:/bin/bash

# by character position
echo "hello world" | cut -c1-5     # hello
echo "hello world" | cut -c7-      # world
```

### `tr`

Translates or deletes characters. Reads stdin, writes stdout.

```bash
echo "Hello World" | tr 'A-Z' 'a-z'     # hello world
echo "Hello World" | tr 'a-z' 'A-Z'     # HELLO WORLD
echo "hello   world" | tr -s ' '        # hello world  (squeeze)
echo "hello" | tr -d 'aeiou'            # hll
echo "hello\nworld" | tr -d '\n'        # helloworld
printf "a1b2c3" | tr -cd '0-9'          # 123  (delete non-digits)
```

---

## sed, awk, and grep

### `grep`

Searches for patterns in input.

```bash
grep "pattern" file.txt
grep -i "pattern" file.txt       # case insensitive
grep -r "pattern" ./dir/         # recursive
grep -v "pattern" file.txt       # invert: lines NOT matching
grep -n "pattern" file.txt       # show line numbers
grep -c "pattern" file.txt       # count matching lines
grep -l "pattern" *.txt          # list files with matches
grep -E "regex" file.txt         # extended regex (ERE)
grep -P "regex" file.txt         # Perl-compatible regex (PCRE)
grep -o "pattern" file.txt       # print only the matched part
```

### `sed`

Stream editor. Processes text line by line.

```bash
sed 's/old/new/' file.txt          # replace first occurrence per line
sed 's/old/new/g' file.txt         # replace all occurrences per line
sed 's/old/new/gi' file.txt        # case insensitive replace
sed -i 's/old/new/g' file.txt      # edit file in place
sed -i.bak 's/old/new/g' file.txt  # in place with backup

sed '3d' file.txt                  # delete line 3
sed '/pattern/d' file.txt          # delete lines matching pattern
sed -n '5,10p' file.txt            # print lines 5 through 10
sed -n '/start/,/end/p' file.txt   # print between patterns
sed 'y/abc/ABC/' file.txt          # transliterate chars (like tr)
```

### `awk`

Pattern-action language. Processes text field by field.

```bash
awk '{print $1}' file.txt          # print first field (space-delimited)
awk '{print $NF}' file.txt         # print last field
awk -F':' '{print $1}' /etc/passwd # colon delimiter, print first field
awk 'NR==5' file.txt               # print line 5 (NR = line number)
awk 'NR>=5 && NR<=10' file.txt     # print lines 5-10
awk '/pattern/' file.txt           # print lines matching pattern
awk '{sum += $1} END {print sum}' nums.txt  # sum first column
awk '{print NR, $0}' file.txt      # prepend line numbers
awk -F',' '{print $2, $3}' csv     # CSV: print columns 2 and 3
```

Built-in variables:

- `NR` current record (line) number
- `NF` number of fields in current record
- `FS` input field separator (default: space/tab)
- `OFS` output field separator
- `RS` record separator (default: newline)
- `$0` entire line, `$1`...`$NF` fields

---

## Find Command

```bash
find /path -name "*.txt"              # by name (glob)
find /path -iname "*.txt"             # case insensitive name
find /path -type f                    # files only
find /path -type d                    # directories only
find /path -type l                    # symlinks only
find /path -size +10M                 # files larger than 10MB
find /path -size -1k                  # files smaller than 1KB
find /path -mtime -7                  # modified in last 7 days
find /path -mtime +30                 # modified more than 30 days ago
find /path -newer file.txt            # newer than file.txt
find /path -user alice                # owned by user alice
find /path -perm 644                  # exact permissions
find /path -perm -u+x                 # user has execute bit set

# execute command on each result
find /path -name "*.log" -exec rm {} \;
find /path -name "*.log" -exec rm {} +    # more efficient (batch)
find /path -name "*.txt" -print0 | xargs -0 grep "word"
```

---

## Bash Arguments

When a script runs, positional parameters hold the command-line arguments.

```bash
$0     # script name
$1     # first argument
$2     # second argument
${10}  # tenth argument (braces required for two-digit index)
$#     # number of arguments
$@     # all arguments as separate words (quoted: each is its own word)
$*     # all arguments as a single word (quoted: one word with IFS separator)
```

```bash
#!/usr/bin/env bash
echo "Script: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Arg count: $#"
```

### `shift`

Shifts positional parameters left by N (default 1).

```bash
while [ "$#" -gt 0 ]; do
    echo "Processing: $1"
    shift
done
```

### `getopts`

Parses short options.

```bash
while getopts "u:p:v" opt; do
    case "$opt" in
        u) user="$OPTARG" ;;
        p) pass="$OPTARG" ;;
        v) verbose=1 ;;
        *) echo "Usage: $0 -u user -p pass [-v]"; exit 1 ;;
    esac
done
```

---

## Pipe Status

`$?` holds the exit status of the last command. In a pipeline, only the exit status of the last command is captured.

```bash
false | true
echo $?    # 0  (exit status of true, not false)
```

### `PIPESTATUS`

An array containing the exit status of every command in the most recent pipeline.

```bash
false | true | false
echo "${PIPESTATUS[@]}"    # 1 0 1
echo "${PIPESTATUS[0]}"    # 1  (exit status of false)
echo "${PIPESTATUS[1]}"    # 0  (exit status of true)
```

### `pipefail`

```bash
set -o pipefail
```

With `pipefail` set, a pipeline fails if any command in it fails (not just the last). The exit status becomes that of the rightmost failing command.

---

## Timing Commands

### `time`

```bash
time sleep 2
# real    0m2.001s
# user    0m0.000s
# sys     0m0.001s
```

- `real`: wall-clock elapsed time
- `user`: CPU time in user space
- `sys`: CPU time in kernel space

```bash
time { command1; command2; }   # time a block
```

### `date` with nanoseconds

```bash
start=$(date +%s%N)
# ... work ...
end=$(date +%s%N)
elapsed=$(( (end - start) / 1000000 ))
echo "Elapsed: ${elapsed}ms"
```

---

## Sourcing Code

Sourcing runs a script in the current shell process (not a subshell), so variables and functions it defines become available in the calling shell.

```bash
source file.sh
. file.sh       # POSIX equivalent
```

**vs executing:**

```bash
./file.sh       # runs in a subshell; changes to variables don't affect parent
bash file.sh    # same: subshell
```

Common use: loading shared functions or configuration.

```bash
# config.sh
DB_HOST="localhost"
DB_PORT=5432

# main.sh
source config.sh
echo "$DB_HOST"
```

---

## Curlies vs. Parens

| Syntax        | Meaning                                                         |
| ------------- | --------------------------------------------------------------- |
| `${var}`      | Variable expansion (braces for disambiguation)                  |
| `$(cmd)`      | Command substitution (runs cmd in a subshell, captures output)  |
| `(( expr ))`  | Arithmetic evaluation (no subshell, sets exit status)           |
| `$(( expr ))` | Arithmetic expansion (returns the result as a string)           |
| `( cmds )`    | Subshell group (commands run in a child process)                |
| `{ cmds; }`   | Current shell group (no subshell, semicolon and space required) |

```bash
x=5
echo ${x}         # 5
echo $(echo 5)    # 5
echo $(( x + 3 )) # 8
(( x = x + 1 ))
echo $x           # 6

{ echo "a"; echo "b"; } > output.txt   # redirect output of group
( echo "a"; echo "b" ) > output.txt    # same but in subshell
```

The key difference between `( )` and `{ }`: curly braces run in the current shell (variable assignments persist); parentheses run in a subshell (variable assignments are lost).

---

## Return vs. Output

A bash function can communicate results in two ways:

### Return (exit status only)

`return N` sets the function's exit status to N (0-255). It does not return a string.

```bash
is_file() {
    [ -f "$1" ]    # [ ] sets $? based on the test
}

if is_file "notes.txt"; then
    echo "it is a file"
fi
```

### Output (capture with command substitution)

```bash
get_name() {
    echo "Alice"
}

name=$(get_name)
echo "$name"    # Alice
```

Capturing output incurs a subshell and is slightly slower. For performance-sensitive code (e.g., inside a tight loop), use a nameref or a global variable instead.

```bash
# using a global variable (avoid when possible)
get_name() {
    RESULT="Alice"
}

get_name
echo "$RESULT"

# using nameref (bash 4.3+)
get_name() {
    local -n ref=$1
    ref="Alice"
}

get_name my_var
echo "$my_var"    # Alice
```

---

## Parameter Expansion

```bash
${var}              # basic expansion
${var:-default}     # use default if var is unset or empty
${var:=default}     # assign default if var is unset or empty
${var:?message}     # error and exit if var is unset or empty
${var:+other}       # use other if var is set (and non-empty)

${#var}             # length of var
${var:offset}       # substring from offset
${var:offset:len}   # substring from offset, length len

${var#pattern}      # remove shortest prefix matching pattern
${var##pattern}     # remove longest prefix matching pattern
${var%pattern}      # remove shortest suffix matching pattern
${var%%pattern}     # remove longest suffix matching pattern

${var/old/new}      # replace first occurrence
${var//old/new}     # replace all occurrences
${var/#old/new}     # replace if at beginning
${var/%old/new}     # replace if at end

${var^}             # uppercase first character
${var^^}            # uppercase all
${var,}             # lowercase first character
${var,,}            # lowercase all
```

```bash
path="/usr/local/bin/bash"
echo "${path##*/}"    # bash  (filename from path)
echo "${path%/*}"     # /usr/local/bin  (directory from path)

str="hello world"
echo "${#str}"        # 11
echo "${str:6}"       # world
echo "${str:0:5}"     # hello
echo "${str/world/bash}"  # hello bash
```

---

## Array Expansion

```bash
arr=("a" "b" "c" "d")

${arr[@]}           # all elements as separate words (use this)
${arr[*]}           # all elements as one word (IFS-separated when quoted)
${#arr[@]}          # number of elements
${!arr[@]}          # all indices
${arr[@]:1:2}       # slice: 2 elements starting at index 1
```

The difference between `"${arr[@]}"` and `"${arr[*]}"`:

```bash
arr=("hello world" "foo" "bar")

for item in "${arr[@]}"; do echo "$item"; done
# hello world
# foo
# bar

for item in "${arr[*]}"; do echo "$item"; done
# hello world foo bar  (all elements in one iteration)
```

Always prefer `"${arr[@]}"` to preserve element boundaries.

---

## Basic Globbing

Globs are filename patterns expanded by the shell before the command runs.

```bash
*       # any string of characters (including empty)
?       # any single character
[abc]   # any one character from the set
[a-z]   # any one character in the range
[!abc]  # any one character NOT in the set
```

```bash
ls *.txt              # all .txt files
ls file?.txt          # file1.txt, fileA.txt, etc.
ls [0-9]*.sh          # scripts starting with a digit
ls [!.]* 2>/dev/null  # files not starting with a dot (non-hidden)
```

Globs do not match `/` in paths. To match across directories, use `**` with `globstar` (see Extended Globbing).

---

## Extended Globbing

Enable with `shopt -s extglob`.

```bash
shopt -s extglob
```

| Pattern      | Matches                     |
| ------------ | --------------------------- |
| `?(pattern)` | zero or one occurrence      |
| `*(pattern)` | zero or more occurrences    |
| `+(pattern)` | one or more occurrences     |
| `@(pattern)` | exactly one occurrence      |
| `!(pattern)` | anything except the pattern |

```bash
ls *.@(jpg|png|gif)       # image files with specific extensions
ls !(*.txt)               # files that are NOT .txt
rm !(important.sh)        # remove everything except important.sh
```

---

## Glob Shell Options

```bash
shopt -s globstar    # ** matches files and dirs recursively
shopt -s nullglob    # unmatched glob expands to nothing (not the literal pattern)
shopt -s extglob     # enable extended glob patterns
shopt -s dotglob     # * matches dot files
shopt -s nocaseglob  # case-insensitive glob matching
shopt -s failglob    # error if glob matches nothing

shopt -u nullglob    # disable
shopt               # list all options and their state
```

```bash
# globstar example
shopt -s globstar
for f in **/*.sh; do
    echo "$f"
done
```

---

## Brace Expansion

Brace expansion is processed before all other expansions and does not require files to exist.

```bash
echo {a,b,c}          # a b c
echo {1..5}           # 1 2 3 4 5
echo {a..e}           # a b c d e
echo {1..10..2}       # 1 3 5 7 9  (step)
echo {a..z..3}        # a d g j m p s v y

mkdir -p project/{src,tests,docs,bin}
cp file.txt{,.bak}    # copy file.txt to file.txt.bak

echo img_{001..005}.jpg    # img_001.jpg img_002.jpg ... img_005.jpg
```

---

## Braces and Globbing

Brace expansion and globbing are distinct mechanisms.

- **Brace expansion** generates strings from a pattern. It runs before globbing and before the filesystem is consulted. The strings do not need to exist.
- **Globbing** matches existing filenames against a pattern.

```bash
echo {a,b,c}.txt        # a.txt b.txt c.txt  (brace expansion, no filesystem check)
echo *.txt               # actual .txt files in current directory (glob)

# combined: brace expansion happens first, then globbing
ls {src,tests}/*.py      # lists .py files in src/ and tests/
```

Brace expansion cannot be used inside `[ ]` or `[[ ]]`. Use it in list contexts.

---

## Numeric Brace Expansion

```bash
echo {1..10}          # 1 2 3 4 5 6 7 8 9 10
echo {01..10}         # 01 02 03 04 05 06 07 08 09 10  (zero-padded)
echo {10..1}          # 10 9 8 7 6 5 4 3 2 1  (descending)
echo {1..20..3}       # 1 4 7 10 13 16 19  (step 3)

for i in {1..5}; do
    echo "item $i"
done
```

---

## printf and Date Formatting

### `printf`

`printf` gives precise control over output formatting. It does not add a trailing newline unless you include `\n`.

```bash
printf "Hello, %s\n" "World"      # Hello, World
printf "%d\n" 42                  # 42
printf "%05d\n" 42                # 00042
printf "%.2f\n" 3.14159           # 3.14
printf "%-10s|\n" "left"          # left      |
printf "%10s|\n" "right"          #      right|
printf "%x\n" 255                 # ff  (hex)
printf "%o\n" 8                   # 10  (octal)
printf "%b\n" "line1\nline2"      # interpret escape sequences
```

### `date`

```bash
date                              # Thu Nov 12 10:00:00 IST 2026
date +"%Y-%m-%d"                  # 2026-11-12
date +"%H:%M:%S"                  # 10:00:00
date +"%Y-%m-%d %H:%M:%S"         # 2026-11-12 10:00:00
date +"%A, %B %d %Y"              # Thursday, November 12 2026
date +%s                          # Unix timestamp (seconds since epoch)
date +%s%N                        # Unix timestamp with nanoseconds
date -d "yesterday" +"%Y-%m-%d"   # yesterday's date (GNU date)
date -d "+7 days" +"%Y-%m-%d"     # one week from now
```

---

## Regular Expressions

Bash supports regex in `[[ ]]` via the `=~` operator. The regex is ERE (extended regular expression).

```bash
str="hello123"
if [[ "$str" =~ ^[a-z]+[0-9]+$ ]]; then
    echo "matches"
fi

# capture groups are stored in BASH_REMATCH
if [[ "2026-11-12" =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2})$ ]]; then
    echo "Year: ${BASH_REMATCH[1]}"   # 2026
    echo "Month: ${BASH_REMATCH[2]}"  # 11
    echo "Day: ${BASH_REMATCH[3]}"    # 12
fi
```

`BASH_REMATCH[0]` is the full match; `[1]`, `[2]`, etc. are capture groups.

Do not quote the regex on the right side of `=~`. Quoting it treats it as a literal string.

---

## mapfile

`mapfile` (also called `readarray`) reads lines from stdin into an indexed array.

```bash
mapfile -t lines < file.txt
echo "${lines[0]}"      # first line
echo "${#lines[@]}"     # number of lines
```

```bash
mapfile -t names < <(cut -d':' -f1 /etc/passwd)
for name in "${names[@]}"; do
    echo "$name"
done
```

Options:

- `-t` strip trailing newlines from each line (almost always use this)
- `-n N` read at most N lines
- `-s N` skip first N lines
- `-d delim` use delim instead of newline as the line separator

---

## Brackets vs. Test

| Construct    | Type             | Notes                                                                   |
| ------------ | ---------------- | ----------------------------------------------------------------------- |
| `test expr`  | External/builtin | POSIX; most portable                                                    |
| `[ expr ]`   | Builtin          | Equivalent to `test`; spaces required inside                            |
| `[[ expr ]]` | Bash keyword     | Extended; supports `&&`, `\|\|`, `=~`, glob matching; no word splitting |
| `(( expr ))` | Bash keyword     | Arithmetic only; returns exit status                                    |

```bash
test -f file.txt && echo "exists"
[ -f file.txt ] && echo "exists"
[[ -f file.txt ]] && echo "exists"
```

Prefer `[[ ]]` in bash scripts. Use `[ ]` or `test` only when writing for POSIX sh compatibility.

Common mistake:

```bash
[ $var == "hello" ]    # breaks if var is empty or contains spaces
[ "$var" == "hello" ]  # correct
[[ $var == "hello" ]]  # also correct: [[ ]] handles unquoted variables safely
```

---

## Special Strings

```bash
$'\n'    # newline
$'\t'    # tab
$'\r'    # carriage return
$'\0'    # null byte
$'\e'    # escape character (for ANSI codes)
$'\a'    # bell
$'\b'    # backspace
$'\\'    # literal backslash
```

```bash
echo $'line1\nline2'    # two lines
printf '%s\n' $'tab\there'

IFS=$'\n'               # set IFS to newline using ANSI-C quoting
```

`$'...'` is ANSI-C quoting. It interprets escape sequences, unlike regular single or double quotes.

---

## Trap Signals

`trap` registers a command to run when the shell receives a signal or exits.

```bash
trap 'echo "Exiting"' EXIT          # run on any exit
trap 'echo "Interrupted"' INT       # run on Ctrl+C (SIGINT)
trap 'echo "Terminated"' TERM       # run on SIGTERM
trap 'echo "Line $LINENO"' ERR      # run on any non-zero exit (with set -e)
trap 'cleanup' EXIT INT TERM        # multiple signals
```

### Cleanup pattern

```bash
tmpfile=$(mktemp)
trap 'rm -f "$tmpfile"' EXIT

# rest of script; tmpfile is always removed on exit
```

### Reset a trap

```bash
trap - INT    # restore default behavior for SIGINT
trap '' INT   # ignore SIGINT
```

### Signal names

```bash
kill -l    # list all signal names and numbers
```

Common signals: `HUP` (1), `INT` (2), `QUIT` (3), `KILL` (9, cannot be trapped), `TERM` (15), `USR1` (10), `USR2` (12).

---

## Named Pipes

A named pipe (FIFO) is a special file that acts as a pipe but persists on the filesystem and can be opened by unrelated processes.

```bash
mkfifo mypipe
```

```bash
# producer (in one terminal or background)
echo "hello" > mypipe

# consumer
cat mypipe
```

The write blocks until a reader opens the pipe, and vice versa.

### Use case: avoiding subshell in loops

```bash
# This runs in a subshell; variable changes are lost
while IFS= read -r line; do
    count=$(( count + 1 ))
done < <(some_command)
echo "$count"    # works with process substitution

# Named pipe alternative
mkfifo /tmp/pipe
some_command > /tmp/pipe &
while IFS= read -r line; do
    count=$(( count + 1 ))
done < /tmp/pipe
rm /tmp/pipe
```

---

## Color Output

ANSI escape codes control terminal text color and style. Format: `\e[CODEm` or `\033[CODEm`.

```bash
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
BOLD='\e[1m'
RESET='\e[0m'

echo -e "${RED}Error${RESET}: something failed"
echo -e "${GREEN}OK${RESET}"
printf "${BOLD}${YELLOW}Warning:${RESET} check this\n"
```

### Common codes

| Code  | Effect                                                            |
| ----- | ----------------------------------------------------------------- |
| 0     | Reset                                                             |
| 1     | Bold                                                              |
| 2     | Dim                                                               |
| 4     | Underline                                                         |
| 7     | Reverse                                                           |
| 30-37 | Foreground: black, red, green, yellow, blue, magenta, cyan, white |
| 90-97 | Bright foreground versions                                        |
| 40-47 | Background colors                                                 |

Always end with `\e[0m` to reset. Without it, the color bleeds into subsequent output.

For scripts, check if the output is a TTY before using color (see [Is a TTY](#is-a-tty)).

---

## Cursor Commands

ANSI escape sequences also control cursor position.

```bash
printf '\e[2J'          # clear screen
printf '\e[H'           # move cursor to top-left (home)
printf '\e[2J\e[H'      # clear screen and go to top

printf '\e[%d;%dH' 5 10  # move cursor to row 5, column 10
printf '\e[A'            # cursor up 1 line
printf '\e[B'            # cursor down 1 line
printf '\e[C'            # cursor right 1 column
printf '\e[D'            # cursor left 1 column
printf '\e[s'            # save cursor position
printf '\e[u'            # restore cursor position
printf '\e[?25l'         # hide cursor
printf '\e[?25h'         # show cursor
```

Used for progress bars, spinners, and TUI scripts.

---

## Is a TTY

A TTY check determines whether stdout (or another file descriptor) is connected to an interactive terminal, as opposed to a file or pipe.

```bash
if [ -t 1 ]; then
    echo "stdout is a terminal"
fi

if [ -t 0 ]; then
    echo "stdin is a terminal"
fi
```

`-t FD` returns true if file descriptor FD is open and refers to a terminal.

Practical use: enable color only in interactive sessions.

```bash
if [ -t 1 ]; then
    RED='\e[31m'; RESET='\e[0m'
else
    RED=''; RESET=''
fi
echo -e "${RED}error${RESET}: something went wrong"
```

When piped (`./script.sh | cat`), the colors are not emitted and the output is clean.

---

## PS1 Variable

`PS1` is the primary prompt string. Bash evaluates it before each interactive prompt.

```bash
echo $PS1
```

### Special escape sequences

| Sequence  | Expands to                              |
| --------- | --------------------------------------- |
| `\u`      | current username                        |
| `\h`      | hostname up to first dot                |
| `\H`      | full hostname                           |
| `\w`      | current working directory (full path)   |
| `\W`      | basename of current directory           |
| `\d`      | date                                    |
| `\t`      | time (HH:MM:SS)                         |
| `\$`      | `#` if root, `$` otherwise              |
| `\n`      | newline                                 |
| `\[...\]` | non-printing sequence (for color codes) |

```bash
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
```

Wrap non-printing characters (escape codes) in `\[` and `\]` so bash does not count them toward the line length. Without this, line editing and history navigation break.

---

## Customizing Bash

Configuration files:

| File               | When sourced                                  |
| ------------------ | --------------------------------------------- |
| `/etc/profile`     | Login shells (all users)                      |
| `~/.bash_profile`  | Login shells (user)                           |
| `~/.bashrc`        | Interactive non-login shells                  |
| `~/.bash_logout`   | On logout                                     |
| `/etc/bash.bashrc` | Interactive shells (all users, Debian/Ubuntu) |

Typical `~/.bashrc` additions:

```bash
# Aliases
alias ll='ls -la --color=auto'
alias gs='git status'
alias ..='cd ..'

# PATH
export PATH="$HOME/.local/bin:$PATH"

# History settings
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoredups:erasedups
shopt -s histappend

# Shell options
shopt -s globstar
shopt -s cdspell        # correct minor typos in cd
shopt -s autocd         # type directory name to cd into it

# Prompt
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
```

Apply changes without logging out:

```bash
source ~/.bashrc
```

---

## Readline Shortcuts

Readline is the library that handles interactive line editing in bash. These shortcuts work at the bash prompt.

| Shortcut | Action                                                   |
| -------- | -------------------------------------------------------- |
| `Ctrl+A` | Move to beginning of line                                |
| `Ctrl+E` | Move to end of line                                      |
| `Ctrl+F` | Move forward one character                               |
| `Ctrl+B` | Move backward one character                              |
| `Alt+F`  | Move forward one word                                    |
| `Alt+B`  | Move backward one word                                   |
| `Ctrl+D` | Delete character under cursor (or exit if line is empty) |
| `Ctrl+H` | Delete character before cursor (backspace)               |
| `Ctrl+K` | Kill (cut) to end of line                                |
| `Ctrl+U` | Kill from cursor to start of line                        |
| `Ctrl+W` | Kill previous word                                       |
| `Ctrl+Y` | Yank (paste) last killed text                            |
| `Ctrl+L` | Clear screen                                             |
| `Ctrl+R` | Reverse incremental history search                       |
| `Ctrl+G` | Cancel current command or search                         |
| `Ctrl+P` | Previous command (like Up arrow)                         |
| `Ctrl+N` | Next command (like Down arrow)                           |
| `Alt+.`  | Insert last argument of previous command                 |
| `!!`     | Repeat last command                                      |
| `!$`     | Last argument of previous command                        |
| `!^`     | First argument of previous command                       |
| `!*`     | All arguments of previous command                        |

---

## Pitfall: ls

Parsing the output of `ls` in scripts is fragile and unreliable. `ls` output can vary by locale, terminal width, and version. Filenames can contain spaces, newlines, and other characters that break parsing.

```bash
# DO NOT do this
for file in $(ls *.txt); do ...

# DO this instead
for file in *.txt; do
    [ -f "$file" ] || continue   # handle the case of no matches
    echo "$file"
done

# Or use find
find . -maxdepth 1 -name "*.txt" -print0 | xargs -0 -I{} echo {}
```

---

## Aliases with Arguments

Bash aliases do not accept arguments directly. The workaround is to use a function instead.

```bash
# This does NOT work as expected
alias greet='echo "Hello, $1"'  # $1 is not the alias argument

# Use a function instead
greet() {
    echo "Hello, $1"
}

# or define it inline to look like an alias
alias greet='_greet() { echo "Hello, $1"; }; _greet'
```

The function approach is clean and correct. Define frequently-used parameterized commands as functions in `~/.bashrc`.

---

## Pitfall: String Length

A common pitfall involves measuring string length when the string contains multibyte (Unicode) characters.

```bash
str="hello"
echo ${#str}    # 5  (correct for ASCII)

str="こんにちは"
echo ${#str}    # 5 in a UTF-8 locale (counts characters, not bytes)
```

If you need byte length instead of character length:

```bash
str="こんにちは"
printf '%s' "$str" | wc -c    # byte length in a UTF-8 locale: 15
```

Also, `wc -c` on a string with a trailing newline from `echo` will count the newline. Use `printf '%s'` to avoid it.

---

## Forkbomb

A forkbomb is a denial-of-service attack that exhausts system resources by recursively spawning processes until the system becomes unresponsive.

```bash
:(){ :|:& };:
```

Breakdown:

- `:` defines a function named `:`
- `:|:&` calls itself twice, one of which is piped to the other, both in background
- `};:` closes the definition and calls the function

**Never run this.** On unprotected systems it will crash the machine.

**Protection:** set process limits in `/etc/security/limits.conf`:

```
username hard nproc 200
```

Or with `ulimit` in a session:

```bash
ulimit -u 200    # max 200 processes for this shell and its children
```

---

## Debugging

### `set` options

```bash
set -x          # trace: print each command before execution
set +x          # disable trace
set -e          # exit immediately on error
set -u          # error on unset variable usage
set -o pipefail # propagate errors through pipelines
set -euo pipefail  # common combination for strict scripts
```

### Shebang with debug flags

```bash
#!/usr/bin/env bash
set -euo pipefail
```

### `bash -x`

Run an entire script with tracing:

```bash
bash -x script.sh
```

### `bash -n`

Check syntax without executing:

```bash
bash -n script.sh
```

### `bash -v`

Print each line before executing (less processed than `-x`):

```bash
bash -v script.sh
```

### Selective tracing

```bash
set -x
# ... commands to trace ...
set +x
```

### `PS4`

Customize the trace prefix (`+` by default):

```bash
export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
set -x
```

This shows the filename, line number, and function name in every trace line.

### `shellcheck`

A static analysis tool that catches common bugs before execution.

```bash
shellcheck script.sh
```

Install: `sudo apt install shellcheck` or `brew install shellcheck`.

It catches: unquoted variables, missing `[ ]` spaces, deprecated syntax, unreachable code, and many common mistakes.
