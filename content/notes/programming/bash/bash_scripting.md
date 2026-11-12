---
title: 'Bash Scripting'
description: 'Become a Bash Wizard'
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

A **shell** is a program that sits between you and the operating system. You type a command, the shell reads it, figures out what you mean, and asks the kernel (the core of the OS) to actually do it.

Think of it this way: the kernel is the engine, and the shell is the steering wheel. You do not talk to the engine directly; you use the wheel.

```
You --> Shell --> Kernel --> Hardware
```

---

## What is Bash

**Bash** stands for **Bourne Again SHell**. It is a rewrite and improvement of the original Bourne shell (`sh`) from the 1970s. Bash was first released in 1989 and is the default shell on most Linux systems today.

Bash lets you:

- Run commands interactively (type and press Enter)
- Write scripts that automate sequences of commands
- Manage processes, files, and system resources
- Use variables, loops, conditionals, and functions

To check your current shell and its version:

```bash
echo "$SHELL"        # your default login shell, e.g. /bin/bash
echo "$BASH_VERSION" # e.g. 5.2.15(1)-release
```

---

## Types of Shells

Many shells exist. They all do the same core job but differ in features, syntax, and speed.

| Shell  | Full Name                  | Notes                                                                 |
| ------ | -------------------------- | --------------------------------------------------------------------- |
| `sh`   | Bourne Shell               | The original. Minimal but runs everywhere.                            |
| `bash` | Bourne Again SHell         | Most common on Linux. What this guide covers.                         |
| `zsh`  | Z Shell                    | Like bash but with better autocomplete and theming. Default on macOS. |
| `fish` | Friendly Interactive SHell | Very beginner-friendly. Not POSIX-compliant.                          |
| `dash` | Debian Almquist Shell      | Very fast and minimal. Used as `/bin/sh` on Ubuntu.                   |
| `ksh`  | Korn Shell                 | Common on commercial Unix systems (Solaris, AIX).                     |

Shells also have two modes:

- **Login shell**: started when you log in. It reads `/etc/profile` and `~/.bash_profile`.
- **Interactive non-login shell**: started when you open a new terminal tab. It reads `~/.bashrc`.

---

## What is a Terminal

A **terminal emulator** is the graphical window where you type commands. It is not the shell itself. It is a program that displays text and passes your keystrokes to the shell running inside it.

Examples of terminal emulators: `gnome-terminal`, `alacritty`, `kitty`, `xterm`.

The relationship:

```
Terminal emulator  <-->  Shell (bash)  <-->  Kernel
   (the window)         (interprets)        (executes)
```

A **TTY** (short for teletypewriter, a relic from physical terminals in the 1970s) is the kernel-level device file representing the terminal connection. You can check which TTY your session is on:

```bash
tty
# /dev/pts/0
```

---

## Built-in vs External Commands

**Built-in commands** are part of the shell binary itself. They run inside the current shell process without spawning a child process.

**External commands** are separate programs stored on disk (usually under `/bin` or `/usr/bin`). The shell creates a child process to run them.

**Why does this matter?**

Some commands _must_ be built-in because they need to modify the shell's own state. For example, `cd` changes the current directory of your shell session. If `cd` were an external command, it would run in a child process, change the directory there, and then exit. Your shell would remain unchanged.

```bash
# cd is a builtin because it modifies the current shell's state
cd /tmp
pwd   # /tmp

# ls is external because it just prints information
type ls   # ls is /usr/bin/ls
```

### Identifying a command with `type`

```bash
type echo     # echo is a shell builtin
type ls       # ls is /usr/bin/ls
type cd       # cd is a shell builtin
type if       # if is a shell keyword
```

### Listing builtins with `compgen`

`compgen` generates lists of completions. It is useful for exploring what is available.

```bash
compgen -b            # list all bash builtins (cd, echo, export, ...)
compgen -c            # list every command available (builtins + PATH executables)
compgen -k            # list shell keywords (if, while, for, function, ...)
compgen -a            # list all defined aliases
compgen -A function   # list all defined functions
```

---

## Useful Discovery Commands

### `type`

Tells you exactly what a name resolves to: alias, function, builtin, file on disk, or not found.

```bash
type -a python3   # show ALL matches in order (alias, then builtins, then PATH)
type -t ls        # print just the type word: alias, keyword, function, builtin, or file
```

### `which`

Searches `PATH` for an executable file and prints its full path. It only knows about files on disk; it does not report builtins or functions.

```bash
which bash    # /usr/bin/bash
which git     # /usr/bin/git
```

Prefer `type` when writing scripts, since `which` will miss builtins and shell functions.

### `tr` (translate characters)

Reads from stdin, substitutes or removes characters, and writes to stdout. It works character by character, not word by word.

```bash
# Convert lowercase to uppercase
echo "hello world" | tr 'a-z' 'A-Z'
# HELLO WORLD

# Delete all spaces
echo "hello world" | tr -d ' '
# helloworld

# Squeeze repeated characters (e.g., collapse multiple spaces into one)
echo "hello    world" | tr -s ' '
# hello world

# Delete vowels
echo "hello world" | tr -d 'aeiou'
# hll wrld
```

Options:

- `-d` delete matching characters
- `-s` squeeze repeated matching characters into one
- `-c` complement (operate on characters NOT in the set)

### `cut` (extract fields from lines)

Extracts a portion of each line based on a delimiter (like `:` or `,`) or character position.

```bash
# Extract field 1 from colon-separated data
echo "root:x:0:0:/root:/bin/bash" | cut -d ':' -f 1
# root

# Extract fields 1 and 7
echo "root:x:0:0:/root:/bin/bash" | cut -d ':' -f 1,7
# root:/bin/bash

# Extract fields 2 through the end
echo "root:x:0:0:/root:/bin/bash" | cut -d ':' -f 2-
# x:0:0:/root:/bin/bash

# Extract characters 1 through 5
echo "hello world" | cut -c 1-5
# hello

# Real-world use: list all usernames on the system
cut -d ':' -f 1 /etc/passwd
```

Options:

- `-d` specify the delimiter character
- `-f` choose which field(s) to extract
- `-c` choose which character position(s) to extract

---

## PATH Variable

`PATH` is an environment variable that tells the shell where to look for external commands. It is a list of directories separated by colons.

When you type `git`, the shell searches each directory in `PATH` from left to right and runs the first `git` binary it finds.

```bash
echo "$PATH"
# /usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
```

### Adding a directory to PATH

```bash
# Prepend a directory (it gets searched first)
export PATH="$HOME/.local/bin:$PATH"

# Append a directory (it gets searched last)
export PATH="$PATH:$HOME/.local/bin"
```

Put this line in `~/.bashrc` to make it permanent. Changes only apply to new shell sessions (or run `source ~/.bashrc` to reload immediately).

### Checking which binary would run

```bash
which python3    # /usr/bin/python3
type python3     # python3 is /usr/bin/python3
```

---

## Quoting: Single Quotes, Double Quotes, and Command Substitution

Quoting is one of the most important concepts in bash. It controls whether special characters (like `$`, `*`, and spaces) are interpreted or treated literally.

### Single quotes `' '`

Single quotes preserve everything literally. No variable expansion, no command substitution, no escaping. What you see is what you get.

```bash
username="Alice"
echo '$username'   # $username  (the literal text, no expansion)
echo 'hello\n'     # hello\n    (backslash is literal)
echo '2 * 3 = 6'  # 2 * 3 = 6 (asterisk is literal, no glob)
```

### Double quotes `" "`

Double quotes allow variable expansion (`$variable`) and command substitution (`$(command)`) but suppress word splitting and glob expansion on the result.

```bash
username="Alice"
echo "Hello, $username"       # Hello, Alice
echo "Today is $(date)"       # Today is Thu Nov 12 10:00:00 IST 2026
echo "Home directory: $HOME"  # Home directory: /home/alice
```

**Always double-quote variables that might contain spaces:**

```bash
filename="my document.txt"

# Wrong: bash splits on the space and tries to open "my" and "document.txt"
cat $filename

# Correct: bash treats it as a single argument
cat "$filename"
```

### Backticks vs `$()`

Both run a command and substitute the output. `$()` is the modern, preferred syntax.

```bash
# Old style (avoid)
current_date=`date +%Y-%m-%d`

# Modern style (preferred)
current_date=$(date +%Y-%m-%d)
echo "Today: $current_date"
```

`$()` is preferred because:

- It is easier to read
- It can be nested cleanly: `$(echo $(hostname))`
- Backslash behavior inside backticks is confusing and inconsistent

---

## Variables

Bash variables hold text strings by default. There is no need to declare a type first.

### Assigning variables

```bash
username="alice"
item_count=42
install_path="/usr/local/bin"
greeting="Hello, World"
```

**There must be no spaces around `=`.** If you write `username = "alice"`, bash reads `username` as a command and `=` as its first argument, which is an error.

### Reading variables

```bash
echo "$username"              # alice
echo "${username}"            # alice (braces make the boundary clear)
echo "User: ${username}!"     # User: alice!
```

The braces in `${username}` are optional for simple names, but required when you need to separate the variable name from adjacent text:

```bash
env="prod"
echo "${env}ironment"   # prodenvironment (without braces: "envirnoment" variable)
```

### Environment variables vs shell variables

A **shell variable** lives only in the current shell process.

An **environment variable** is exported and inherited by any child process (like a script you run).

```bash
# Shell variable only (child processes cannot see this)
db_password="secret"

# Environment variable (child processes inherit this)
export DB_HOST="localhost"
export DB_PORT=5432

# Export an already-assigned variable
app_env="production"
export app_env
```

By convention, environment variables use `UPPER_CASE` names. Script-local variables use `lower_case`.

### Read-only variables

```bash
readonly MAX_RETRIES=3
readonly CONFIG_DIR="/etc/myapp"

MAX_RETRIES=5   # error: MAX_RETRIES: readonly variable
```

### Local variables in functions

Variables defined inside a function are global by default. Use `local` to restrict them to the function's scope.

```bash
connection_timeout=30

check_connection() {
    local host="$1"
    local timeout=5    # this 'timeout' is local to the function only
    echo "Checking $host with timeout ${timeout}s"
}

check_connection "example.com"
echo "$connection_timeout"   # 30 (unchanged)
```

### `declare` for typed variables

```bash
declare -i retry_count=0        # integer: arithmetic is automatic
declare -r MAX_CONNECTIONS=100  # readonly
declare -a server_list          # indexed array
declare -A config_map           # associative array (key-value)
declare -x EXPORT_ME="value"    # same as export
declare -l lower_str="HELLO"    # auto-converts to lowercase on assignment
declare -u upper_str="hello"    # auto-converts to uppercase on assignment
```

---

## Space Manipulation

Bash uses spaces to separate arguments. This becomes a problem when your data contains spaces.

```bash
fruit_list="apple mango"

echo '$fruit_list'    # $fruit_list    (single quotes: literal, no expansion)
echo "$fruit_list"    # apple mango    (double quotes: expanded, space preserved)
echo $fruit_list      # apple mango    (no quotes: works here, but risky)
```

The danger shows up with filenames and glob patterns:

```bash
report_glob="*.txt"

ls $report_glob    # expands the glob: lists actual .txt files
ls "$report_glob"  # looks for a file literally named *.txt (probably not what you want)
```

The rule: **always quote variables that may contain spaces, special characters, or glob patterns.** This is one of the most common sources of bugs in bash scripts.

---

## Unsetting Variables

```bash
temp_dir="/tmp/myapp"
echo "$temp_dir"   # /tmp/myapp

unset temp_dir
echo "$temp_dir"   # (empty output)
```

After `unset`, the variable ceases to exist. Referencing it returns an empty string.

If you have `set -u` (or `set -o nounset`) active in your script, referencing an unset variable causes the script to exit with an error. This is a good safety setting for scripts.

```bash
set -u
echo "$undefined_var"   # bash: undefined_var: unbound variable
```

---

## Special Shell Variables

These variables are automatically set and maintained by bash itself. You read them but generally do not assign to them.

```bash
echo "$BASH"         # full path to the bash binary: /usr/bin/bash
echo "$BASH_VERSION" # version string: 5.2.15(1)-release
echo "$SHELL"        # your default login shell (from /etc/passwd)
echo "$HOME"         # your home directory: /home/alice
echo "$USER"         # your username: alice
echo "$HOSTNAME"     # machine name: devbox
echo "$PWD"          # current working directory: /home/alice/projects
echo "$OLDPWD"       # previous working directory (where you just came from)
echo "$PPID"         # PID of the parent process (the shell that launched this one)
echo "$?"            # exit status of the last command (0 = success, non-zero = error)
echo "$!"            # PID of the most recent background job
echo "$$"            # PID of the current shell process
echo "$0"            # name of the script (or the shell if interactive)
echo "$LINENO"       # current line number inside the script
echo "$RANDOM"       # a random integer between 0 and 32767 each time you read it
```

**`$?` is especially important.** Every command exits with a status code. `0` means success. Any other value means failure.

```bash
ls /nonexistent_path
echo "$?"   # 2 (non-zero: ls failed)

ls /tmp
echo "$?"   # 0 (success)
```

---

## Shebang Line

The shebang (`#!`) is the very first line of a script. It tells the kernel which interpreter to use to run the file.

```bash
#!/usr/bin/env bash
```

When you run `./deploy.sh`, the kernel reads the first two bytes (`#!`), finds the interpreter path, and runs `bash deploy.sh`.

**Why `env bash` instead of `/bin/bash`?**

`/bin/bash` is hardcoded. On some systems (NixOS, certain BSDs), bash lives elsewhere. `env bash` searches your `PATH` for bash, making the script portable.

```bash
# Less portable (hardcoded path)
#!/bin/bash

# More portable (searches PATH)
#!/usr/bin/env bash
```

Verify where bash is on your system:

```bash
which bash   # /usr/bin/bash
```

Make a script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## User Input

### `read`

`read` pauses the script and waits for the user to type something, then stores it in a variable.

```bash
read -r username
echo "Hello, $username"
```

Always use `-r` to disable backslash interpretation. Without it, a user typing `\n` would produce a newline instead of the two characters `\n`.

```bash
# Common options
read -r -p "Enter your username: " username        # -p: show a prompt
read -r -s -p "Enter your password: " password     # -s: silent (input is hidden)
read -r -t 10 -p "Answer within 10 seconds: " reply  # -t: timeout in seconds
read -r -n 1 -p "Press any key to continue..." key   # -n: read exactly N chars
```

### Reading multiple values at once

```bash
read -r first_name last_name <<< "John Doe"
echo "$first_name"   # John
echo "$last_name"    # Doe
```

`<<<` is a here-string. It feeds the string to the command's stdin directly.

### Reading a file line by line

```bash
while IFS= read -r current_line; do
    echo "$current_line"
done < /etc/hosts
```

`IFS=` (setting IFS to empty) prevents bash from stripping leading and trailing whitespace from each line. Without it, lines starting with spaces would be trimmed.

---

## Functions

A function groups commands under a name so you can reuse them.

```bash
greet_user() {
    echo "Hello, $1"
}

greet_user "Alice"   # Hello, Alice
greet_user "Bob"     # Hello, Bob
```

### Syntax

```bash
# POSIX-compatible style (preferred)
function_name() {
    # commands
}

# bash keyword style (also valid)
function function_name {
    # commands
}
```

Both work in bash. The first style is more portable.

### Positional parameters inside functions

Inside a function, `$1`, `$2`, etc. refer to the function's own arguments, not the script's arguments.

```bash
print_connection_info() {
    local host="$1"
    local port="$2"
    echo "Host: $host"
    echo "Port: $port"
    echo "All args: $@"
    echo "Arg count: $#"
}

print_connection_info "localhost" "8080"
# Host: localhost
# Port: 8080
# All args: localhost 8080
# Arg count: 2
```

### Local scope

Always use `local` for variables inside functions. Otherwise they leak into the global scope.

```bash
max_connections=100

configure_server() {
    local max_connections=50     # local: does not overwrite the global one
    local server_name="$1"
    echo "Configuring $server_name with max_connections=$max_connections"
}

configure_server "web01"
echo "$max_connections"   # 100 (global is unchanged)
```

### Returning values

`return N` sets the function's exit status (0-255). It does not return a string.

To return a string, print it and capture it with `$()`.

```bash
calculate_sum() {
    local num_a="$1"
    local num_b="$2"
    echo $(( num_a + num_b ))
}

total=$(calculate_sum 15 27)
echo "Total: $total"   # Total: 42
```

---

## Conditionals

Conditionals let your script make decisions based on the state of files, variables, or command exit statuses.

### Basic `if` structure

```bash
if [ condition ]; then
    # runs if condition is true
elif [ other_condition ]; then
    # runs if other_condition is true
else
    # runs if nothing above was true
fi
```

### File test operators

```bash
config_file="/etc/app/config.json"
backup_dir="/var/backups"
log_symlink="/var/log/app-latest.log"

if [ -f "$config_file" ]; then echo "is a regular file"; fi
if [ -d "$backup_dir" ]; then echo "is a directory"; fi
if [ -e "$config_file" ]; then echo "exists (file or directory)"; fi
if [ -r "$config_file" ]; then echo "readable by current user"; fi
if [ -w "$config_file" ]; then echo "writable by current user"; fi
if [ -x "$config_file" ]; then echo "executable"; fi
if [ -s "$config_file" ]; then echo "non-empty (size > 0)"; fi
if [ -L "$log_symlink" ]; then echo "is a symbolic link"; fi
```

### String tests

```bash
username=""
role="admin"
environment="production"

if [ -z "$username" ]; then echo "username is empty"; fi
if [ -n "$role" ]; then echo "role is set"; fi
if [ "$role" = "admin" ]; then echo "admin access granted"; fi
if [ "$environment" != "development" ]; then echo "not a dev environment"; fi
```

### Integer comparisons

```bash
retry_count=3
max_retries=5
error_threshold=10
current_errors=7

if [ "$retry_count" -eq "$max_retries" ]; then echo "reached max retries"; fi
if [ "$retry_count" -ne 0 ]; then echo "retries remaining"; fi
if [ "$current_errors" -lt "$error_threshold" ]; then echo "within threshold"; fi
if [ "$retry_count" -le "$max_retries" ]; then echo "can still retry"; fi
if [ "$current_errors" -gt 5 ]; then echo "above warning level"; fi
if [ "$current_errors" -ge "$error_threshold" ]; then echo "threshold reached"; fi
```

### `[[ ]]` extended test (bash only, preferred)

`[[ ]]` is a bash keyword, not a command. It is safer and more powerful than `[ ]`.

```bash
server_name="web-prod-01"
ip_address="192.168.1.100"

# Glob matching inside [[ ]]
if [[ "$server_name" == web-* ]]; then echo "web server"; fi

# Regex matching with =~
if [[ "$ip_address" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "valid IPv4 format"
fi

# Combining conditions with && and ||
if [[ -f "/etc/hosts" && -r "/etc/hosts" ]]; then
    echo "hosts file is readable"
fi
```

`[[ ]]` does not perform word splitting on variables, so unquoted variables are safe inside it.

---

## For Loops

Loops repeat a block of commands multiple times.

### Iterate over a list of values

```bash
for environment in development staging production; do
    echo "Deploying to: $environment"
done
```

### Iterate over an array

```bash
server_list=("web01" "web02" "db01" "cache01")

for server in "${server_list[@]}"; do
    echo "Pinging $server..."
done
```

### C-style loop (like in C or Java)

```bash
for (( index=1; index<=5; index++ )); do
    echo "Attempt $index"
done
```

### Iterate over files matching a pattern

```bash
for log_file in /var/log/*.log; do
    echo "Archiving: $log_file"
done
```

### `while` loop

Runs as long as the condition is true.

```bash
connection_attempts=0
max_attempts=5

while [ "$connection_attempts" -lt "$max_attempts" ]; do
    echo "Connecting... attempt $connection_attempts"
    (( connection_attempts++ ))
done
```

### `until` loop

Runs until the condition becomes true (opposite of `while`).

```bash
retry_count=0

until ping -c 1 example.com &>/dev/null; do
    echo "Host unreachable, retrying..."
    (( retry_count++ ))
    sleep 2
done
echo "Host is up after $retry_count retries"
```

### Reading a file line by line in a loop

```bash
while IFS= read -r current_line; do
    echo "Processing: $current_line"
done < /etc/hosts
```

---

## Input / Output

Every process in Linux has three default data streams:

| Stream | File Descriptor | Default destination |
| ------ | --------------- | ------------------- |
| stdin  | 0               | Keyboard            |
| stdout | 1               | Terminal screen     |
| stderr | 2               | Terminal screen     |

### Redirection operators

```bash
# Redirect stdout to a file (overwrites if file exists)
ls /var/log > file_list.txt

# Append stdout to a file
ls /var/log >> file_list.txt

# Redirect stderr to a file
grep "error" /var/log/syslog 2> grep_errors.txt

# Redirect stderr to wherever stdout currently goes
./build.sh 2>&1

# Redirect both stdout and stderr to the same file
./build.sh > build.log 2>&1

# Bash shorthand: redirect both at once
./build.sh &> build.log

# Feed stdin from a file
mysql -u root < database_dump.sql

# Discard output (send to /dev/null, the "black hole")
./noisy_script.sh > /dev/null 2>&1
```

### Here-document (multi-line input)

A here-document feeds multiple lines of text to a command's stdin. The content between the two `EOF` markers is passed as stdin.

```bash
cat << EOF
Server: web01
IP: 192.168.1.10
Status: active
EOF
```

### Here-string (single-line input)

Feeds a single string directly to a command's stdin without needing a file.

```bash
grep "root" <<< "root:x:0:0:root:/root:/bin/bash"
```

### Pipes

A pipe (`|`) connects the stdout of one command to the stdin of the next. This lets you chain commands to process data step by step.

```bash
# Count how many running processes belong to root
ps aux | grep "^root" | wc -l

# Find the 5 largest files in /var/log
du -sh /var/log/* | sort -rh | head -5
```

---

## Case Statements

A `case` statement is a cleaner alternative to a long `if / elif / elif / else` chain. It matches a variable against patterns and runs the matching block.

```bash
case "$variable" in
    pattern1)
        # commands for pattern1
        ;;
    pattern2 | pattern3)
        # commands for pattern2 OR pattern3
        ;;
    *)
        # default: runs if nothing else matched
        ;;
esac
```

Patterns support glob syntax: `*`, `?`, `[abc]`.

### Example: handling user input

```bash
read -r -p "Start the server? [yes/no]: " user_answer

case "$user_answer" in
    yes | YES | y | Y)
        echo "Starting server..."
        ;;
    no | NO | n | N)
        echo "Cancelled."
        ;;
    *)
        echo "Invalid input. Please enter yes or no."
        exit 1
        ;;
esac
```

### Example: handling file extensions

```bash
input_file="report.pdf"

case "$input_file" in
    *.pdf)
        echo "Opening with PDF viewer"
        ;;
    *.txt | *.md)
        echo "Opening with text editor"
        ;;
    *.sh)
        echo "Running as bash script"
        bash "$input_file"
        ;;
    *)
        echo "Unknown file type"
        ;;
esac
```

---

## Indexed Arrays

An indexed array stores multiple values under one variable name. Each value has a numeric index starting at 0.

```bash
# Create an array
server_names=("web01" "web02" "db01" "cache01")

# Access by index
echo "${server_names[0]}"    # web01
echo "${server_names[2]}"    # db01

# All elements
echo "${server_names[@]}"    # web01 web02 db01 cache01

# Number of elements
echo "${#server_names[@]}"   # 4
```

### Modifying arrays

```bash
# Add an element at a specific index
server_names[4]="backup01"

# Append to the end
server_names+=("monitor01")

# Remove an element (leaves a gap in the index)
unset server_names[1]

# Remove the entire array
unset server_names
```

### Iterating over an array

```bash
backup_dirs=("/var/backups" "/home" "/etc")

for dir in "${backup_dirs[@]}"; do
    echo "Backing up: $dir"
done
```

### Iterating with index

```bash
for index in "${!server_names[@]}"; do
    echo "[$index] = ${server_names[$index]}"
done
```

### Slicing

```bash
all_servers=("web01" "web02" "db01" "db02" "cache01")

# Elements starting at index 1, length 2
echo "${all_servers[@]:1:2}"   # web02 db01
```

---

## Associative Arrays

An associative array (also called a hash map or dictionary) stores key-value pairs. Keys are strings instead of numbers.

Requires bash 4.0 or later. Must be declared with `declare -A` before use.

```bash
declare -A server_config

server_config["host"]="192.168.1.10"
server_config["port"]="8080"
server_config["environment"]="production"
server_config["max_connections"]="500"
```

### Accessing values

```bash
echo "${server_config["host"]}"    # 192.168.1.10
echo "${server_config["port"]}"    # 8080
```

### Inspecting the map

```bash
echo "${!server_config[@]}"   # all keys:   host port environment max_connections
echo "${server_config[@]}"    # all values: 192.168.1.10 8080 production 500
echo "${#server_config[@]}"   # number of pairs: 4
```

### Iterating over key-value pairs

```bash
for config_key in "${!server_config[@]}"; do
    echo "$config_key = ${server_config[$config_key]}"
done
```

### Checking if a key exists

```bash
if [[ -v server_config["host"] ]]; then
    echo "host key exists"
fi
```

---

## IFS Variable

`IFS` stands for **Internal Field Separator**. It is the set of characters bash uses to split words when it expands unquoted variables or processes command output.

The default value is a space, a tab, and a newline.

```bash
# Visualize the default IFS
printf '%s' "$IFS" | cat -A
#   ^I$   (space, tab, newline)
```

### Custom IFS for splitting

```bash
# Split a colon-separated string into an array
csv_data="alice:30:developer"

IFS=':' read -r -a user_fields <<< "$csv_data"
echo "${user_fields[0]}"   # alice
echo "${user_fields[1]}"   # 30
echo "${user_fields[2]}"   # developer
```

### IFS in loops

```bash
# Split on newlines only (preserve spaces in filenames)
IFS=$'\n'

for file_path in $(find /var/log -name "*.log"); do
    echo "Found: $file_path"
done

unset IFS   # always restore IFS after changing it
```

### IFS and CSV parsing

```bash
IFS=',' read -r -a column_values <<< "hostname,ip,status,uptime"
echo "${column_values[0]}"   # hostname
echo "${column_values[3]}"   # uptime
```

Always restore `IFS` after changing it. A changed `IFS` affects all subsequent word splitting in the script.

---

## Command Substitution

Command substitution runs a command and replaces the `$(...)` with the command's stdout output. Trailing newlines are stripped automatically.

```bash
# Capture a command's output into a variable
current_date=$(date +%Y-%m-%d)
echo "Today: $current_date"

hostname_upper=$(hostname | tr 'a-z' 'A-Z')
echo "Host: $hostname_upper"

script_dir=$(dirname "$(realpath "$0")")
echo "Script is in: $script_dir"
```

### Nesting command substitutions

```bash
# Get the username of the owner of /etc/passwd
file_owner=$(stat -c '%U' /etc/passwd)
echo "Owner: $file_owner"

# Nested: get the size of bash in human-readable form
bash_size=$(du -sh "$(which bash)" | cut -f 1)
echo "Bash size: $bash_size"
```

If you need to preserve trailing newlines, use `printf`:

```bash
output=$(printf '%s' "$(some_command)")
```

---

## Arithmetic Expressions

Bash only does integer arithmetic natively. For decimals, use `bc` or `awk`.

### `(( ))` double parentheses

Evaluates arithmetic and sets an exit status. Exit status is 0 (success/true) if the result is non-zero, and 1 (failure/false) if the result is zero.

```bash
page_count=10
items_per_page=25

(( total_items = page_count * items_per_page ))
echo "$total_items"   # 250

(( page_count++ ))
echo "$page_count"    # 11

(( page_count-- ))
echo "$page_count"    # 10

# Use in conditions
if (( total_items > 100 )); then
    echo "Large dataset"
fi
```

### `$(( ))` arithmetic expansion

Returns the computed result as a string to be used inline.

```bash
width=1920
height=1080

pixel_count=$(( width * height ))
echo "Pixels: $pixel_count"       # Pixels: 2073600

echo "Half width: $(( width / 2 ))"   # Half width: 960
echo "Remainder: $(( pixel_count % 1000 ))"
echo "Squared: $(( 2 ** 10 ))"        # 1024
```

### `let` (older syntax, avoid)

```bash
let result=10+5     # result=15
let result++
```

Prefer `(( ))` over `let` for clarity.

### Floating point with `bc`

```bash
# bc handles decimals
result=$(echo "scale=2; 22 / 7" | bc)
echo "Pi approx: $result"   # Pi approx: 3.14
```

---

## Process Substitution

Process substitution lets you use the output of a command as if it were a file, without creating a temporary file on disk. It creates a file descriptor (like `/dev/fd/63`) connected to the command's output.

```bash
# diff the output of two commands directly
diff <(sort /etc/group) <(sort /etc/passwd | cut -d ':' -f 1)
```

```bash
# Compare directory listings of two servers
diff <(ls /var/www/html) <(ssh user@remote-server ls /var/www/html)
```

```bash
# Feed command output into a while loop without a subshell
# (important: variable changes inside the loop are preserved)
line_count=0

while IFS= read -r current_line; do
    (( line_count++ ))
done < <(grep "ERROR" /var/log/syslog)

echo "Found $line_count errors"
```

The key advantage over a pipe (`grep "ERROR" ... | while ...`) is that the `while` loop runs in the current shell, not a subshell, so `line_count` is accessible after the loop ends.

---

## cut and tr

### `cut`

`cut` extracts specific fields or character positions from each line of input. It is very useful for parsing structured text like `/etc/passwd` or CSV files.

```bash
# /etc/passwd format: username:password:uid:gid:comment:home:shell

# Extract just the username (field 1)
cut -d ':' -f 1 /etc/passwd

# Extract username and home directory (fields 1 and 6)
cut -d ':' -f 1,6 /etc/passwd

# Extract fields 3 through 5
cut -d ':' -f 3-5 /etc/passwd

# Extract fields from 2 to end
cut -d ':' -f 2- /etc/passwd

# Extract characters 1 through 7 (useful for fixed-width data)
date | cut -c 1-7
```

### `tr`

`tr` translates or deletes characters. It operates character-by-character on stdin.

```bash
# Uppercase conversion
echo "hello world" | tr 'a-z' 'A-Z'
# HELLO WORLD

# Lowercase conversion
echo "HELLO WORLD" | tr 'A-Z' 'a-z'
# hello world

# Delete all digits
echo "abc123def456" | tr -d '0-9'
# abcdef

# Squeeze multiple spaces into one
echo "hello      world" | tr -s ' '
# hello world

# Replace colons with spaces (useful for PATH inspection)
echo "$PATH" | tr ':' '\n'
# /usr/local/bin
# /usr/bin
# /bin
# ...

# Delete non-printable characters from a file
tr -cd '[:print:]\n' < messy_file.txt > clean_file.txt
```

---

## sed, awk, and grep

### `grep` (search for patterns)

`grep` searches input line by line and prints lines that match a pattern.

```bash
# Basic usage
grep "error" /var/log/syslog

# Case insensitive
grep -i "error" /var/log/syslog

# Search recursively in a directory
grep -r "TODO" ./src/

# Show line numbers alongside matches
grep -n "failed" /var/log/auth.log

# Invert: lines that do NOT match
grep -v "^#" /etc/ssh/sshd_config   # show config without comment lines

# Count matching lines
grep -c "refused" /var/log/auth.log

# Print only the matched part (not the whole line)
grep -o "[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}" access.log

# Extended regex (lets you use +, ?, |, () without backslashes)
grep -E "error|warning|critical" /var/log/syslog

# List just the filenames that contain a match
grep -l "password" /etc/*.conf
```

### `sed` (stream editor)

`sed` processes text line by line and applies transformations. The most common use is find-and-replace.

```bash
# Replace first occurrence per line
sed 's/http/https/' urls.txt

# Replace all occurrences per line (the g flag)
sed 's/localhost/127.0.0.1/g' config.txt

# Edit the file in place (modifies the actual file)
sed -i 's/debug=true/debug=false/g' app.conf

# Edit in place and keep a backup
sed -i.bak 's/debug=true/debug=false/g' app.conf

# Delete lines matching a pattern
sed '/^#/d' /etc/ssh/sshd_config     # delete comment lines

# Delete a specific line number
sed '5d' file.txt

# Print only lines 10 through 20
sed -n '10,20p' access.log

# Print lines between two patterns
sed -n '/START/,/END/p' log.txt
```

### `awk` (field-by-field processing)

`awk` splits each line into fields and lets you process them with a simple programming language. The default field separator is whitespace.

```bash
# Print the first field (column) of each line
awk '{print $1}' /var/log/syslog

# Print the last field of each line
awk '{print $NF}' /var/log/syslog

# Use a custom delimiter (like cut -d)
awk -F ':' '{print $1, $7}' /etc/passwd   # username and shell

# Print only lines where field 3 is greater than 1000
awk -F ':' '$3 > 1000 {print $1}' /etc/passwd

# Sum all values in the first column
awk '{total += $1} END {print "Total:", total}' numbers.txt

# Print line numbers alongside content
awk '{print NR, $0}' file.txt

# Print lines matching a pattern
awk '/error/' /var/log/syslog

# Print lines 5 through 10
awk 'NR>=5 && NR<=10' file.txt
```

**Key `awk` variables:**

| Variable      | Meaning                                    |
| ------------- | ------------------------------------------ |
| `$0`          | The entire current line                    |
| `$1`, `$2`... | Individual fields                          |
| `NF`          | Number of fields in current line           |
| `NR`          | Current record (line) number               |
| `FS`          | Input field separator (default: space/tab) |
| `OFS`         | Output field separator                     |

---

## Find Command

`find` searches for files and directories based on name, type, size, age, permissions, and more. It is far more powerful and reliable than parsing `ls` output.

```bash
# Find by name (glob pattern)
find /var/log -name "*.log"

# Case-insensitive name search
find /home -iname "readme.md"

# Find only regular files
find /etc -type f -name "*.conf"

# Find only directories
find /var -type d -name "cache"

# Find only symbolic links
find /usr/bin -type l

# Find files larger than 100MB
find /var -type f -size +100M

# Find files smaller than 1KB
find /tmp -type f -size -1k

# Find files modified in the last 7 days
find /var/log -type f -mtime -7

# Find files NOT modified in the last 30 days (old files)
find /tmp -type f -mtime +30

# Find files owned by a specific user
find /home -type f -user alice

# Find files with exact permissions
find /etc -type f -perm 644

# Find files where the owner has execute permission
find /usr/bin -type f -perm -u+x
```

### Executing commands on results

```bash
# Delete all .log files older than 30 days
find /var/log -name "*.log" -mtime +30 -exec rm {} \;

# Same but more efficient (batches files into one rm call)
find /var/log -name "*.log" -mtime +30 -exec rm {} +

# Print each file's size and name
find /var/log -type f -exec du -sh {} \;

# Safe piping to xargs (handles filenames with spaces)
find /home -name "*.txt" -print0 | xargs -0 grep "TODO"
```

The `{}` is replaced by the found filename. The `\;` ends the `-exec` expression.

---

## Bash Arguments

When you call a script from the command line, the words you pass become **positional parameters** inside the script.

```bash
./backup.sh /home/alice /var/backups daily
#            $1           $2          $3
```

### Positional parameter reference

```bash
echo "$0"      # script name: ./backup.sh
echo "$1"      # first argument: /home/alice
echo "$2"      # second argument: /var/backups
echo "$3"      # third argument: daily
echo "${10}"   # tenth argument (braces required for two or more digits)
echo "$#"      # number of arguments passed: 3
echo "$@"      # all arguments as separate quoted words (use this in loops)
echo "$*"      # all arguments as one word (IFS-separated when quoted)
```

### Full example

```bash
#!/usr/bin/env bash

script_name="$0"
source_dir="$1"
target_dir="$2"
backup_type="${3:-full}"   # default to "full" if not provided

echo "Script:    $script_name"
echo "Source:    $source_dir"
echo "Target:    $target_dir"
echo "Type:      $backup_type"
echo "Arguments: $#"
```

### `shift`

`shift` removes the first positional parameter and shifts the rest down. `$2` becomes `$1`, `$3` becomes `$2`, and so on.

```bash
while [ "$#" -gt 0 ]; do
    echo "Processing argument: $1"
    shift
done
```

### `getopts` for option parsing

`getopts` parses short-style flags like `-u alice -p secret -v`.

```bash
#!/usr/bin/env bash

target_user=""
db_password=""
verbose=0

while getopts "u:p:v" current_opt; do
    case "$current_opt" in
        u) target_user="$OPTARG" ;;
        p) db_password="$OPTARG" ;;
        v) verbose=1 ;;
        *) echo "Usage: $0 -u username -p password [-v]"; exit 1 ;;
    esac
done

echo "User: $target_user"
echo "Verbose: $verbose"
```

A colon after the flag letter (like `u:`) means the flag takes an argument. The argument is stored in `$OPTARG`.

---

## Pipe Status

### `$?` and the problem with pipelines

`$?` holds the exit status of the most recently completed command. In a pipeline, it only captures the exit status of the **last** command.

```bash
# This pipeline "succeeds" even though grep found nothing
grep "needle" /dev/null | cat
echo "$?"   # 0 (exit status of cat, which succeeded)
```

### `PIPESTATUS`

`PIPESTATUS` is a bash array that holds the exit status of every command in the most recently run pipeline.

```bash
grep "ERROR" /var/log/syslog | sort | uniq -c

echo "${PIPESTATUS[@]}"   # e.g. 0 0 0 (all three succeeded)
echo "${PIPESTATUS[0]}"   # grep exit status
echo "${PIPESTATUS[1]}"   # sort exit status
echo "${PIPESTATUS[2]}"   # uniq exit status
```

### `pipefail`

With `set -o pipefail`, the entire pipeline fails if any command in it fails. The exit status becomes that of the rightmost failing command.

```bash
set -o pipefail

grep "needle" /dev/null | cat
echo "$?"   # 1 (grep failed; pipefail propagates the failure)
```

This is recommended for scripts. Without `pipefail`, a silent failure in the middle of a pipeline can go undetected.

---

## Timing Commands

### `time`

`time` measures how long a command takes to run.

```bash
time du -sh /var/log
# real    0m0.342s    (wall-clock time: total elapsed time)
# user    0m0.021s    (CPU time spent in user space)
# sys     0m0.080s    (CPU time spent in kernel space)
```

You can time a block of commands:

```bash
time {
    find /var -type f -name "*.log" > /tmp/log_list.txt
    wc -l /tmp/log_list.txt
}
```

### Manual timing with `date`

For timing within a script (e.g., to benchmark a section):

```bash
start_time=$(date +%s%N)   # nanoseconds since epoch

# ... code to benchmark ...
sleep 1

end_time=$(date +%s%N)
elapsed_ms=$(( (end_time - start_time) / 1000000 ))
echo "Elapsed: ${elapsed_ms}ms"
```

---

## Sourcing Code

**Sourcing** a file runs it inside the current shell process (not in a child process). Variables and functions defined in the sourced file become available immediately.

```bash
source ./config.sh    # bash-specific
. ./config.sh         # POSIX equivalent (works in sh too)
```

### Sourcing vs executing

```bash
./config.sh      # runs in a child process; variable changes do NOT affect the current shell
source config.sh # runs in the current shell; variable changes DO affect the current shell
bash config.sh   # same as ./config.sh: a subshell
```

### Common use case: shared configuration

```bash
# db_config.sh
DB_HOST="db.internal"
DB_PORT=5432
DB_NAME="app_production"

# deploy.sh
source ./db_config.sh
echo "Connecting to $DB_HOST:$DB_PORT/$DB_NAME"
```

### Common use case: shared functions

```bash
# lib/logging.sh
log_info() { echo "[INFO]  $(date +%T) $*"; }
log_error() { echo "[ERROR] $(date +%T) $*" >&2; }

# main.sh
source ./lib/logging.sh
log_info "Starting deployment"
log_error "Connection failed"
```

---

## Curlies vs. Parens

Bash uses several different bracket and parenthesis combinations, each with a distinct meaning.

| Syntax              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `${variable}`       | Expand a variable (braces clarify the name boundary)         |
| `$(command)`        | Run a command in a subshell, substitute its output           |
| `$(( expression ))` | Evaluate arithmetic, substitute the integer result           |
| `(( expression ))`  | Evaluate arithmetic, set exit status (no substitution)       |
| `( commands )`      | Run commands in a subshell (variable changes are discarded)  |
| `{ commands; }`     | Run commands in the current shell (variable changes persist) |

```bash
server_port=8080

# Variable expansion with braces
echo "${server_port}"            # 8080
echo "port:${server_port}/tcp"   # port:8080/tcp

# Command substitution
current_user=$(whoami)
echo "$current_user"             # alice

# Arithmetic expansion
connection_limit=$(( server_port - 1000 ))
echo "$connection_limit"         # 7080

# Arithmetic evaluation (no output, just sets $?)
(( server_port > 1024 ))
echo "$?"   # 0 (true: port is above 1024)

# Subshell group: changes to variables are lost after )
(
    server_port=9090
    echo "Inside subshell: $server_port"   # 9090
)
echo "Outside subshell: $server_port"      # 8080 (unchanged)

# Current-shell group: changes persist
{
    server_port=9090
    echo "Inside group: $server_port"      # 9090
}
echo "After group: $server_port"           # 9090 (changed)
```

---

## Return vs. Output

A bash function can communicate a result in two ways:

### 1. Exit status (integers 0-255 only)

`return N` sets the function's exit status. `0` means success; non-zero means failure. This is not a "return value" in the programming sense.

```bash
is_port_valid() {
    local port="$1"
    (( port > 0 && port <= 65535 ))
}

if is_port_valid 8080; then
    echo "Port is valid"
fi

if ! is_port_valid 99999; then
    echo "Port out of range"
fi
```

### 2. Output (strings via stdout)

To return a string from a function, `echo` it and capture it with `$()`.

```bash
get_timestamp() {
    echo "$(date +%Y%m%d_%H%M%S)"
}

backup_name="backup_$(get_timestamp).tar.gz"
echo "$backup_name"   # backup_20261112_143005.tar.gz
```

### 3. Nameref (bash 4.3+, avoids a subshell)

Capturing output with `$()` creates a subshell, which is slightly slower. For performance-sensitive code, use a nameref to write directly into a caller's variable.

```bash
get_server_info() {
    local -n result_ref="$1"   # -n makes this a nameref
    result_ref="web01:8080:production"
}

get_server_info server_info
echo "$server_info"   # web01:8080:production
```

---

## Parameter Expansion

Parameter expansion transforms a variable's value at the point of use, without changing the stored value.

### Default values

```bash
deploy_env="${DEPLOY_ENV:-development}"   # use "development" if DEPLOY_ENV is unset or empty
log_level="${LOG_LEVEL:-info}"

# := also assigns the default back to the variable
: "${CONFIG_PATH:=/etc/app/config.json}"  # assign default if unset
echo "$CONFIG_PATH"   # /etc/app/config.json
```

### Error on unset variable

```bash
# Exit with an error message if DB_PASSWORD is not set
db_password="${DB_PASSWORD:?DB_PASSWORD environment variable is required}"
```

### Conditional use

```bash
debug_flag="${DEBUG:+--verbose}"   # expand to --verbose only if DEBUG is set and non-empty
./build.sh $debug_flag
```

### String length

```bash
username="alice"
echo "${#username}"   # 5
```

### Substrings

```bash
version_string="2026-11-12"

echo "${version_string:0:4}"    # 2026   (from position 0, length 4)
echo "${version_string:5:2}"    # 11     (from position 5, length 2)
echo "${version_string:8}"      # 12     (from position 8 to end)
```

### Removing prefixes and suffixes

```bash
file_path="/var/log/app/error.log"

echo "${file_path##*/}"    # error.log        (remove longest prefix up to last /)
echo "${file_path%/*}"     # /var/log/app     (remove shortest suffix after last /)
echo "${file_path%%/*}"    # (empty)          (remove longest prefix: everything after first /)
echo "${file_path#/}"      # var/log/app/error.log  (remove shortest prefix matching /)

filename="backup_2026.tar.gz"
echo "${filename%.gz}"     # backup_2026.tar  (strip .gz)
echo "${filename%%.tar.gz}" # backup_2026     (strip .tar.gz)
```

### Find and replace

```bash
connection_string="host=localhost port=5432 dbname=myapp"

echo "${connection_string/localhost/db.prod.internal}"
# host=db.prod.internal port=5432 dbname=myapp  (first occurrence)

log_line="ERROR: ERROR: connection refused"
echo "${log_line//ERROR/WARN}"
# WARN: WARN: connection refused  (all occurrences)
```

### Case conversion

```bash
environment_name="PRODUCTION"
echo "${environment_name,,}"   # production  (all lowercase)
echo "${environment_name,}"    # pRODUCTION  (first character lowercase)

service_name="nginx"
echo "${service_name^^}"   # NGINX   (all uppercase)
echo "${service_name^}"    # Nginx   (first character uppercase)
```

---

## Array Expansion

```bash
active_servers=("web01" "web02" "db01" "db02")

echo "${active_servers[@]}"    # all elements as separate words: web01 web02 db01 db02
echo "${active_servers[*]}"    # all elements joined (IFS-separated when quoted)
echo "${#active_servers[@]}"   # count: 4
echo "${!active_servers[@]}"   # all indices: 0 1 2 3
echo "${active_servers[@]:1:2}" # slice: web02 db01  (start at index 1, take 2)
```

### The critical difference between `[@]` and `[*]`

```bash
server_descriptions=("primary web server" "backup db" "cache node")

# [@] with double quotes: each element is its own word
for desc in "${server_descriptions[@]}"; do
    echo ">> $desc"
done
# >> primary web server
# >> backup db
# >> cache node

# [*] with double quotes: all elements become ONE word
for desc in "${server_descriptions[*]}"; do
    echo ">> $desc"
done
# >> primary web server backup db cache node
```

Always use `"${array[@]}"` when iterating or passing arrays to commands. `[*]` collapses everything into one string and breaks on elements that contain spaces.

---

## Basic Globbing

A **glob** is a filename pattern that the shell expands to matching filenames before running the command. This expansion happens in the shell, before the command receives its arguments.

| Pattern  | Matches                                                 |
| -------- | ------------------------------------------------------- |
| `*`      | Any string of characters (including empty), but not `/` |
| `?`      | Any single character                                    |
| `[abc]`  | Any one character from the set: a, b, or c              |
| `[a-z]`  | Any one character in the range a through z              |
| `[!abc]` | Any one character NOT in the set                        |

```bash
# All files ending in .log
ls /var/log/*.log

# Files named access_1.log, access_2.log, etc.
ls access_?.log

# Scripts starting with a digit
ls /usr/local/bin/[0-9]*.sh

# All non-hidden files (not starting with a dot)
ls [!.]*
```

If a glob matches nothing, bash leaves it as a literal string by default. Use `shopt -s nullglob` to make an unmatched glob expand to nothing instead.

---

## Extended Globbing

Extended globbing adds more powerful matching patterns. Enable it with `shopt -s extglob`.

```bash
shopt -s extglob
```

| Pattern      | Matches                     |
| ------------ | --------------------------- |
| `?(pattern)` | Zero or one occurrence      |
| `*(pattern)` | Zero or more occurrences    |
| `+(pattern)` | One or more occurrences     |
| `@(pattern)` | Exactly one occurrence      |
| `!(pattern)` | Anything except the pattern |

```bash
# Match only image files
ls *.@(jpg|png|gif|webp)

# Match everything that is NOT a .txt file
ls !(*.txt)

# Delete everything in a directory except one important file
rm !(deploy.sh)

# Match filenames with one or more digits
ls +([0-9])_report.csv
```

---

## Glob Shell Options

`shopt` controls shell options. The following options change how globbing behaves.

```bash
shopt -s globstar    # ** matches files and directories recursively across subdirectories
shopt -s nullglob    # unmatched glob expands to nothing (instead of the literal pattern)
shopt -s extglob     # enable extended glob patterns (?(pat), *(pat), etc.)
shopt -s dotglob     # * and ** also match hidden files (starting with .)
shopt -s nocaseglob  # glob matching is case-insensitive
shopt -s failglob    # unmatched glob causes an error instead of a literal string

shopt -u nullglob    # disable an option (replace -s with -u)
shopt                # list all options with their current state (on/off)
```

```bash
# globstar example: find all Python files in the project tree
shopt -s globstar
for python_file in **/*.py; do
    echo "$python_file"
done
```

---

## Brace Expansion

Brace expansion generates a list of strings from a pattern. It runs before all other expansions and does not check whether the generated strings exist as files.

```bash
# Comma-separated alternatives
echo {dev,staging,production}
# dev staging production

# Ranges
echo {1..5}        # 1 2 3 4 5
echo {a..e}        # a b c d e
echo {1..10..2}    # 1 3 5 7 9  (step of 2)

# Create a project directory structure in one command
mkdir -p my_project/{src,tests,docs,scripts,configs}

# Backup a file (copy with a .bak extension)
cp nginx.conf{,.bak}       # copies nginx.conf to nginx.conf.bak

# Generate numbered filenames
echo report_{001..005}.pdf
# report_001.pdf report_002.pdf report_003.pdf report_004.pdf report_005.pdf
```

---

## Braces and Globbing

Brace expansion and globbing are two separate mechanisms that run at different stages.

**Brace expansion** runs first. It generates strings from a pattern. It does not look at the filesystem.

**Globbing** runs after. It matches the generated strings against actual files on disk.

```bash
# Brace expansion: generates "src/main.py tests/main.py" (no filesystem check)
echo {src,tests}/main.py

# Glob: matches existing .py files in the current directory
echo *.py

# Combined: brace expansion happens first, generating two globs,
# then each glob is matched against the filesystem
ls {src,tests}/*.py
# Effectively: ls src/*.py tests/*.py
```

Brace expansion cannot be used inside `[ ]` or `[[ ]]` test brackets.

---

## Numeric Brace Expansion

```bash
echo {1..10}        # 1 2 3 4 5 6 7 8 9 10
echo {10..1}        # 10 9 8 7 6 5 4 3 2 1  (descending)
echo {01..05}       # 01 02 03 04 05  (zero-padded automatically)
echo {0..20..5}     # 0 5 10 15 20  (step of 5)
echo {100..90..-2}  # 100 98 96 94 92 90  (descending with step)

# Practical use: create numbered log files
touch /tmp/test_log_{01..10}.txt

# Loop over a range
for attempt_num in {1..5}; do
    echo "Attempt $attempt_num of 5"
done
```

---

## printf and Date Formatting

### `printf`

`printf` formats and prints text. Unlike `echo`, it does not add a trailing newline automatically, and it gives you precise control over formatting.

```bash
printf "Hello, %s\n" "World"       # Hello, World
printf "Port: %d\n" 8080           # Port: 8080
printf "ID: %05d\n" 42             # ID: 00042  (zero-padded to 5 digits)
printf "Size: %.2f MB\n" 3.14159   # Size: 3.14 MB
printf "%-20s %s\n" "hostname" "status"   # left-aligned column
printf "%20s %s\n" "hostname" "status"    # right-aligned column
printf "%x\n" 255                  # ff  (hexadecimal)
printf "%08b\n" 42                 # 00101010  (binary)
```

Format specifiers:

- `%s` string
- `%d` decimal integer
- `%f` floating point
- `%x` hexadecimal
- `%o` octal
- `%b` interpret escape sequences in the argument

### `date`

```bash
date                              # Thu Nov 12 10:00:00 IST 2026
date +"%Y-%m-%d"                  # 2026-11-12
date +"%H:%M:%S"                  # 10:00:00
date +"%Y-%m-%d %H:%M:%S"         # 2026-11-12 10:00:00
date +"%A, %d %B %Y"              # Thursday, 12 November 2026
date +%s                          # Unix timestamp (seconds since epoch)
date +%s%N                        # Unix timestamp with nanoseconds
date -d "yesterday" +"%Y-%m-%d"   # yesterday's date  (GNU date only)
date -d "+7 days" +"%Y-%m-%d"     # one week from now (GNU date only)
```

---

## Regular Expressions

Bash supports regex matching inside `[[ ]]` using the `=~` operator. The regex dialect is ERE (Extended Regular Expression), the same used by `grep -E`.

```bash
version_string="2.14.3"

if [[ "$version_string" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Valid semantic version"
fi
```

### Capture groups with `BASH_REMATCH`

After a successful `=~` match, bash stores captured groups in the `BASH_REMATCH` array.

```bash
log_entry="2026-11-12 14:30:05 ERROR connection refused"

if [[ "$log_entry" =~ ^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9:]+) ([A-Z]+) (.+)$ ]]; then
    echo "Date:    ${BASH_REMATCH[1]}"   # 2026-11-12
    echo "Time:    ${BASH_REMATCH[2]}"   # 14:30:05
    echo "Level:   ${BASH_REMATCH[3]}"   # ERROR
    echo "Message: ${BASH_REMATCH[4]}"   # connection refused
fi
```

`BASH_REMATCH[0]` holds the full match. `[1]`, `[2]`, etc. hold the captured groups in order.

**Important:** do not quote the regex on the right side of `=~`. Quoting it makes bash treat it as a literal string, not a regex.

```bash
pattern="^[0-9]+"
[[ "123abc" =~ $pattern ]]   # correct: use a variable, unquoted
[[ "123abc" =~ "^[0-9]+" ]]  # wrong: treated as literal string
```

---

## mapfile

`mapfile` (also called `readarray`) reads lines from stdin directly into an indexed array. It is cleaner and faster than reading lines one at a time in a loop.

```bash
# Read a file into an array
mapfile -t log_lines < /var/log/syslog
echo "${log_lines[0]}"       # first line
echo "${#log_lines[@]}"      # total number of lines
```

```bash
# Read command output into an array
mapfile -t active_users < <(who | awk '{print $1}' | sort -u)

for username in "${active_users[@]}"; do
    echo "Active user: $username"
done
```

Options:

- `-t` strip the trailing newline from each line (almost always use this)
- `-n 100` read at most 100 lines
- `-s 5` skip the first 5 lines before reading
- `-d ','` use `,` as the line delimiter instead of newline

---

## Brackets vs. Test

There are four different ways to test conditions in bash. They look similar but behave differently.

| Syntax       | Type         | Use when                               |
| ------------ | ------------ | -------------------------------------- |
| `test expr`  | Builtin      | Writing POSIX `sh` compatible scripts  |
| `[ expr ]`   | Builtin      | Same as `test`; slightly more readable |
| `[[ expr ]]` | Bash keyword | Writing bash scripts (recommended)     |
| `(( expr ))` | Bash keyword | Arithmetic comparisons only            |

```bash
# All three check if a file exists:
test -f "/etc/hosts" && echo "exists"
[ -f "/etc/hosts" ] && echo "exists"
[[ -f "/etc/hosts" ]] && echo "exists"
```

**Why prefer `[[ ]]`?**

1. No word splitting on unquoted variables: `[[ $filename == *.txt ]]` is safe even if `$filename` contains spaces.
2. Supports `&&` and `||` directly: `[[ -f "$f" && -r "$f" ]]`.
3. Supports regex: `[[ "$str" =~ ^[0-9]+$ ]]`.
4. Supports glob matching: `[[ "$server" == web-* ]]`.

**Common mistake with `[ ]`:**

```bash
[ $log_file == "output.log" ]     # breaks if log_file is empty or contains spaces
[ "$log_file" == "output.log" ]   # correct: always quote variables in [ ]
[[ $log_file == "output.log" ]]   # also correct: [[ ]] is safe without quotes
```

---

## Special Strings

`$'...'` is called **ANSI-C quoting**. It interprets C-style escape sequences inside single quotes. This is the correct way to embed special characters like newlines and tabs in bash strings.

```bash
$'\n'    # newline character
$'\t'    # horizontal tab
$'\r'    # carriage return (used in Windows line endings)
$'\0'    # null byte
$'\e'    # escape character (ASCII 27, used for ANSI color codes)
$'\a'    # bell character (may cause a beep)
$'\\'    # literal backslash
```

```bash
# Print two lines without echo -e
printf '%s\n' $'line one\nline two'

# Set IFS to newline (the correct way)
IFS=$'\n'

# Use a tab as a delimiter
echo $'column1\tcolumn2\tcolumn3'

# ANSI escape codes for color
printf $'\e[32mSuccess\e[0m\n'
```

This is cleaner than `echo -e` or trying to embed a literal newline with `$'...'` inside double quotes.

---

## Trap Signals

`trap` registers a command to run automatically when the shell receives a specific signal or hits a specific condition. It is essential for proper cleanup in scripts.

```bash
trap 'command_to_run' SIGNAL_NAME
```

```bash
trap 'echo "Script exiting"' EXIT          # runs on any exit (normal or error)
trap 'echo "Ctrl+C pressed"' INT           # runs on SIGINT (Ctrl+C)
trap 'echo "Kill signal received"' TERM    # runs on SIGTERM
trap 'echo "Error on line $LINENO"' ERR    # runs when any command fails
trap 'cleanup_function' EXIT INT TERM      # multiple signals, one handler
```

### Cleanup pattern (the most important use case)

Always clean up temporary files, even if the script is interrupted.

```bash
#!/usr/bin/env bash

temp_file=$(mktemp /tmp/deploy_XXXXXX)

cleanup() {
    rm -f "$temp_file"
    echo "Cleaned up temporary files"
}

trap cleanup EXIT   # cleanup() runs no matter how the script exits

# rest of script: temp_file is always removed
echo "Working with $temp_file"
some_command > "$temp_file"
```

### Resetting traps

```bash
trap - INT       # restore the default behavior for SIGINT (crash on Ctrl+C)
trap '' INT      # ignore SIGINT entirely (Ctrl+C does nothing)
trap '' PIPE     # ignore broken pipe errors (useful for scripts piped into head)
```

### Common signals

```bash
kill -l    # list all signal names and their numbers
```

| Signal | Number | Default behavior                          |
| ------ | ------ | ----------------------------------------- |
| `HUP`  | 1      | Hangup (reload config)                    |
| `INT`  | 2      | Interrupt (Ctrl+C)                        |
| `QUIT` | 3      | Quit with core dump                       |
| `KILL` | 9      | Force kill (cannot be trapped or ignored) |
| `TERM` | 15     | Graceful termination                      |
| `USR1` | 10     | User-defined                              |
| `USR2` | 12     | User-defined                              |

---

## Named Pipes

A **named pipe** (also called a FIFO, for First In First Out) is a special file that connects two processes. Unlike a regular pipe (`|`), it has a name on the filesystem and can be used by unrelated processes.

```bash
mkfifo /tmp/data_pipe
```

One process writes to it; another reads from it. The writer blocks until there is a reader, and the reader blocks until there is a writer.

```bash
# Terminal 1: producer writes to the pipe
echo "hello from producer" > /tmp/data_pipe

# Terminal 2: consumer reads from the pipe
cat /tmp/data_pipe
# hello from producer
```

### Practical use: keeping variables after a loop

A regular pipe runs the right side in a subshell, discarding variable changes:

```bash
error_count=0
grep "ERROR" /var/log/syslog | while IFS= read -r line; do
    (( error_count++ ))   # this change is lost after the pipe ends
done
echo "$error_count"   # 0 (the subshell's count is gone)
```

Process substitution solves this cleanly (the loop runs in the current shell):

```bash
error_count=0
while IFS= read -r line; do
    (( error_count++ ))
done < <(grep "ERROR" /var/log/syslog)
echo "$error_count"   # correct count
```

---

## Color Output

ANSI escape codes let you print colored and styled text to the terminal. They are embedded in a string using `\e[` or `\033[` followed by a code and `m`.

```bash
# Define color variables for reuse
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
MAGENTA='\e[35m'
CYAN='\e[36m'
BOLD='\e[1m'
DIM='\e[2m'
UNDERLINE='\e[4m'
RESET='\e[0m'    # always reset at the end, or color bleeds into next output
```

```bash
echo -e "${GREEN}[OK]${RESET} Deployment successful"
echo -e "${RED}[ERROR]${RESET} Connection refused on port 5432"
echo -e "${YELLOW}[WARN]${RESET} Disk usage above 80%%"
echo -e "${BOLD}${BLUE}=== Deployment Report ===${RESET}"
```

### ANSI code reference

| Code  | Effect                                                            |
| ----- | ----------------------------------------------------------------- |
| 0     | Reset all attributes                                              |
| 1     | Bold                                                              |
| 2     | Dim                                                               |
| 4     | Underline                                                         |
| 7     | Reverse (swap foreground and background)                          |
| 30-37 | Foreground: black, red, green, yellow, blue, magenta, cyan, white |
| 90-97 | Bright foreground versions                                        |
| 40-47 | Background colors                                                 |

Always end colored output with `${RESET}` (`\e[0m`). Without it, the color bleeds into everything printed after.

For scripts that may be piped or redirected, check for a TTY before using color (see the next section).

---

## Cursor Commands

ANSI escape codes also move the terminal cursor, letting you build progress indicators and simple TUI (text user interface) scripts.

```bash
printf '\e[2J\e[H'        # clear the screen and move cursor to top-left

printf '\e[%d;%dH' 5 10   # move cursor to row 5, column 10

printf '\e[A'              # move cursor up 1 line
printf '\e[B'              # move cursor down 1 line
printf '\e[C'              # move cursor right 1 column
printf '\e[D'              # move cursor left 1 column

printf '\e[s'              # save current cursor position
printf '\e[u'              # restore cursor to saved position

printf '\e[?25l'           # hide the cursor
printf '\e[?25h'           # show the cursor
```

### Simple progress bar example

```bash
show_progress() {
    local current="$1"
    local total="$2"
    local percent=$(( current * 100 / total ))
    local filled=$(( percent / 2 ))
    local bar=""

    for (( i=0; i<filled; i++ )); do bar+="#"; done
    for (( i=filled; i<50; i++ )); do bar+="-"; done

    printf '\r[%s] %d%%' "$bar" "$percent"
}

for step in {1..100}; do
    show_progress "$step" 100
    sleep 0.05
done
printf '\n'
```

---

## Is a TTY

A **TTY check** tells you whether a file descriptor is connected to an interactive terminal, as opposed to a file or a pipe.

```bash
if [ -t 1 ]; then
    echo "stdout is connected to a terminal"
fi

if [ -t 0 ]; then
    echo "stdin is connected to a terminal"
fi
```

`-t FD` returns true if file descriptor `FD` is open and refers to a terminal.

### Why this matters: color output

Enabling ANSI color codes when stdout is a file or pipe embeds raw escape codes into the output, making it unreadable. Check for a TTY first.

```bash
# Only use color if writing to a real terminal
if [ -t 1 ]; then
    COLOR_RED='\e[31m'
    COLOR_GREEN='\e[32m'
    COLOR_RESET='\e[0m'
else
    COLOR_RED=''
    COLOR_GREEN=''
    COLOR_RESET=''
fi

echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} Build complete"
```

When you run `./build.sh | tee build.log`, the terminal shows colors but the log file contains clean text.

---

## PS1 Variable

`PS1` is the string bash displays as your command prompt. It is evaluated every time before bash shows a new prompt.

```bash
echo "$PS1"   # see your current prompt definition
```

### Escape sequences for PS1

| Sequence  | Expands to                                                 |
| --------- | ---------------------------------------------------------- |
| `\u`      | Current username                                           |
| `\h`      | Hostname up to the first dot                               |
| `\H`      | Full hostname                                              |
| `\w`      | Full path of current directory                             |
| `\W`      | Base name of current directory only                        |
| `\d`      | Date (Mon Nov 12)                                          |
| `\t`      | Time in HH:MM:SS format                                    |
| `\$`      | `#` if running as root, `$` otherwise                      |
| `\n`      | Newline                                                    |
| `\[...\]` | Marks a non-printing sequence (use this around ANSI codes) |

```bash
# A clean, colored prompt: user@host:directory$
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
```

**Always wrap ANSI color codes in `\[` and `\]`.** Bash uses PS1 to calculate line length for cursor positioning and history navigation. Without these markers, bash counts the invisible escape characters as part of the line length, which causes the cursor to jump to the wrong column when you use arrow keys or history.

---

## Customizing Bash

Bash reads configuration files in a specific order depending on how the shell was started.

| File               | When it is read                                  |
| ------------------ | ------------------------------------------------ |
| `/etc/profile`     | Login shells, all users                          |
| `~/.bash_profile`  | Login shells, current user                       |
| `~/.bashrc`        | Interactive non-login shells (new terminal tabs) |
| `~/.bash_logout`   | When a login shell exits                         |
| `/etc/bash.bashrc` | Interactive shells, all users (Debian/Ubuntu)    |

For most day-to-day customization, edit `~/.bashrc`.

```bash
# ~/.bashrc

# Aliases: short names for common commands
alias ll='ls -la --color=auto'
alias la='ls -A --color=auto'
alias grep='grep --color=auto'
alias diff='diff --color=auto'
alias ..='cd ..'
alias ...='cd ../..'

# PATH: add personal tool directories
export PATH="$HOME/.local/bin:$HOME/go/bin:$PATH"

# History: keep a large history and avoid duplicates
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoredups:erasedups   # skip duplicates
shopt -s histappend                # append to history instead of overwriting

# Shell behavior options
shopt -s globstar    # ** works for recursive glob
shopt -s cdspell     # fix minor typos in cd arguments
shopt -s autocd      # type a directory name to cd into it

# Custom prompt
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
```

Apply changes to the current session without logging out:

```bash
source ~/.bashrc
```

---

## Readline Shortcuts

Readline is the library bash uses to handle interactive input. These shortcuts work at the prompt and speed up everyday terminal use significantly.

| Shortcut | Action                                                               |
| -------- | -------------------------------------------------------------------- |
| `Ctrl+A` | Move cursor to the beginning of the line                             |
| `Ctrl+E` | Move cursor to the end of the line                                   |
| `Ctrl+F` | Move cursor forward one character                                    |
| `Ctrl+B` | Move cursor backward one character                                   |
| `Alt+F`  | Move cursor forward one word                                         |
| `Alt+B`  | Move cursor backward one word                                        |
| `Ctrl+D` | Delete the character under the cursor (or exit if the line is empty) |
| `Ctrl+K` | Cut everything from the cursor to the end of the line                |
| `Ctrl+U` | Cut everything from the cursor to the beginning of the line          |
| `Ctrl+W` | Cut the word before the cursor                                       |
| `Ctrl+Y` | Paste (yank) the last cut text                                       |
| `Ctrl+L` | Clear the screen (same as running `clear`)                           |
| `Ctrl+R` | Search history backward (press again to cycle through matches)       |
| `Ctrl+G` | Cancel the current search or command                                 |
| `Ctrl+P` | Previous command (same as the Up arrow)                              |
| `Ctrl+N` | Next command (same as the Down arrow)                                |
| `Alt+.`  | Insert the last argument of the previous command                     |

### History expansion

```bash
!!       # repeat the entire previous command
!$       # last argument of the previous command
!^       # first argument of the previous command
!*       # all arguments of the previous command
!grep    # repeat the most recent command starting with "grep"
```

---

## Pitfall: ls

**Never parse the output of `ls` in scripts.**

`ls` formats its output for human reading. It changes behavior based on terminal width, locale, and version. Filenames can contain spaces, newlines, and other characters that break any parsing you attempt.

```bash
# WRONG: breaks on filenames with spaces
for log_file in $(ls /var/log/*.log); do
    process "$log_file"
done

# CORRECT: use a glob directly
for log_file in /var/log/*.log; do
    [ -f "$log_file" ] || continue   # skip if the glob matched nothing
    process "$log_file"
done

# CORRECT: use find for more complex searches
find /var/log -maxdepth 1 -name "*.log" -print0 | xargs -0 -I{} process {}
```

The direct glob approach is simpler, faster, and handles all edge cases correctly.

---

## Aliases with Arguments

Bash aliases are simple text substitutions. They cannot accept arguments. The word after the alias is appended, not inserted.

```bash
# This does NOT work: $1 is not the argument to the alias
alias backup_home='tar -czf backup_$1.tar.gz $HOME'

backup_home project   # does not work as expected
```

**Use a function instead:**

```bash
backup_directory() {
    local archive_name="$1"
    local source_path="$2"
    tar -czf "${archive_name}.tar.gz" "$source_path"
    echo "Archived $source_path to ${archive_name}.tar.gz"
}

backup_directory "my_project_backup" "/home/alice/my_project"
```

Put frequently used functions in `~/.bashrc`. They behave just like commands once the shell has loaded.

---

## Pitfall: String Length

`${#variable}` counts characters, not bytes. For ASCII text, characters and bytes are the same. For multibyte Unicode text, they differ.

```bash
server_name="nginx"
echo "${#server_name}"    # 5  (correct for ASCII)

japanese_text="こんにちは"
echo "${#japanese_text}"  # 5  (counts characters, not bytes)
```

If you need the byte length (for example, when writing to a fixed-size buffer or computing HTTP Content-Length):

```bash
japanese_text="こんにちは"

# Use printf to avoid echo adding a newline, then count bytes with wc -c
byte_length=$(printf '%s' "$japanese_text" | wc -c)
echo "Byte length: $byte_length"   # 15 (each hiragana is 3 bytes in UTF-8)
```

Also be aware that `echo "$text" | wc -c` counts the newline that `echo` appends. Use `printf '%s'` to avoid this.

---

## Forkbomb

A **forkbomb** is a program that recursively spawns copies of itself until it exhausts all available process slots, making the system unresponsive.

```bash
:(){ :|:& };:
```

**Do not run this.** On an unprotected system, it will crash the machine and require a hard reboot.

**What it does:** Defines a function named `:` that calls itself twice in the background (`:|:&`). Each call spawns two more, which spawn two more, until the system runs out of processes.

### Protection: set process limits

In `/etc/security/limits.conf`:

```
alice hard nproc 300
```

Or for the current session with `ulimit`:

```bash
ulimit -u 300    # limit this shell and all its children to 300 processes
ulimit -a        # view all current limits
```

This is a standard hardening step on multi-user systems and containers.

---

## Debugging

### `set` flags for safer scripts

Add these to the top of every serious script:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

| Flag          | Meaning                                                         |
| ------------- | --------------------------------------------------------------- |
| `-e`          | Exit immediately if any command fails (non-zero exit status)    |
| `-u`          | Treat references to unset variables as errors                   |
| `-o pipefail` | A pipeline fails if any command in it fails (not just the last) |

Combined, these three catch the most common silent failures in bash scripts.

### `set -x` (trace mode)

Prints each command before it runs, with a `+` prefix. Invaluable for understanding what a script is actually doing.

```bash
set -x
db_host="localhost"
psql -h "$db_host" -U admin mydb
set +x    # disable tracing after the section you care about
```

Output looks like:

```
+ db_host=localhost
+ psql -h localhost -U admin mydb
```

### Enabling flags on the command line

You do not need to modify the script:

```bash
bash -x deploy.sh           # run with trace mode
bash -n deploy.sh           # check syntax only (no execution)
bash -v deploy.sh           # print each line before execution (less processed than -x)
bash -xeu deploy.sh         # combine flags
```

### Customizing trace output with `PS4`

By default, trace lines are prefixed with `+`. Customizing `PS4` adds file name and line number to every trace line.

```bash
export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
set -x
```

Output becomes:

```
+(deploy.sh:14): main(): db_host=localhost
+(deploy.sh:15): main(): psql -h localhost -U admin mydb
```

### `shellcheck`: static analysis

`shellcheck` is an external tool that reads your script and reports bugs, anti-patterns, and portability issues before you run it.

```bash
shellcheck deploy.sh
```

Install it:

```bash
sudo apt install shellcheck    # Debian/Ubuntu
brew install shellcheck        # macOS
```

It catches: unquoted variables, missing `[ ]` spaces, use of deprecated syntax, unreachable code, common logic errors, and many more. Run it on every script before committing.
