# Universal Templating Preprocessor (utpp) Specification

## 1. Overview

This document defines a **Universal Templating Preprocessor (utpp)** designed to be used with multiple host languages including but not limited to:

- HTML/JS/CSS
- PHP
- C/C++
- Configuration files (INI, YAML, JSON, csv, etc.)
- Raw text files

The language uses **custom delimiters** to minimize syntax collisions and supports:

- Conditional logic
- Loops
- Variable interpolation
- Direct JavaScript evaluation (using backticks)
- Literal escaping
- Configurable delimiters

The utpp preprocessor runs **before** the host language compiler/interpreter, replacing all utpp constructs with generated code. Similar to templating engines like Jinja2, Handlebars, or EJS, but designed for **universal applicability**.

---

## 2. Delimiters

### Default Delimiters

- **Opening delimiter:** "@["
- **Closing delimiter:** "]"

### Escaping Delimiters

To output literal "@[" or "]":

- `@@[` → outputs `@[`
- `]@`  → outputs `]`

> Example:
> ```text
> @@[this is a literal @[, not a directive]@
> ```

> Output:
> ```text
> @[this is a literal @[, not a directive]@
> ```

Escaped delimiters are not processed as utpp directives and kept as-is in the output.

### Configurable Delimiters (Optional)

For compatibility with languages like JavaScript (where `$[` might conflict), delimiters can be configured.

Example configuration (in a settings file or command-line flag):

```json
{
  "open": "[%",
  "close": "%]",
  "escape_open": "[[%",
  "escape_close": "%]]"
}
```

Then use:

```text
[%if 1 == 1%]
Hello
[%end%]
```

And escape with `[[%` and `%]]`.

### Local File Config Override

These configuration can be directly embedded in the source file as the first line starting with `///utpp` until `///`. Content in that line is treated as JSON configuration. These settings override any global or command-line settings, only for the current file.

```text
///utpp {"open":"<%","close":"%>","escape_open":"<%%","escape_close":"%%>"} ///
rest of file...
```

---

## 3. Syntax

All utpp constructs are enclosed in delimiters.

### 3.1 Inline Expression / Interpolation

```text
@[= expression ]
```

Evaluates `expression` and inserts the result. `=` is a function. `print` also accepted.

#### 3.1.1 Plain Expression

```text
Hello, @[= userName]!
const N = @[= 1 + 2];
```

#### 3.1.2 JavaScript Evaluation with Backticks

```text
@[= `user.name.toUpperCase()` ]
@[= `${name} is ${age} years old` ]
```

> Example:
> ```text
> const config = {
>   apiUrl: @[= `process.env.API_URL || "http://localhost:3000"` ]
> };
> ```

> Output (after JS eval and preprocessing):
> ```js
> const config = {
>   apiUrl: "https://api.example.com"
> };
> ```

---

### 3.2 Conditional Blocks

```text
@[if condition ]
   ...
@[elif condition ]
   ...
@[else ]
   ...
@[end]
```

#### Conditions

- Conditions are evaluated by the **utpp engine** (not JS unless using `= ` with backticks).
- Supported operators:
  - `==`, `!=`
  - `<`, `<=`, `>`, `>=`
  - `&&`, `||`
  - Parentheses `()`
  - Variables: `varName`, `$varName`, `var.sub`

#### Examples

```text
@[if DEBUG == 1 ]
console.log("Debug mode enabled");
@[end]

@[if user.loggedIn && user.role == "admin" ]
<!-- Show admin panel -->
@[else]
<!-- Show user panel -->
@[end]

@[if `Date.now() > ${birthday.getTime() + 18 * 365 * 24 * 60 * 60 * 1000}` ]
User is an adult
@[end]
```

---

### 3.3 Loop Block

```text
@[for var in list ]
   ...
@[end]
```

- `var`: loop variable name
- `list`: array or iterable (evaluated by the utpp engine)

#### Examples

```text
@[for item in items ]$
<li>@[= item]</li>
@[end]

@[for key, value in settings ]$
${key}: @[= value]
@[end]
```

---

### 3.4 Include Block

```text
@[include "path/to/file.php"]
```

- Inserts the contents of another file and preprocesses it as utpp.
- Supports relative paths.
- Recursive includes allowed (with cycle detection recommended).

#### Example

```text
@[include "headers.html"]

<body>
  @[= pageTitle]
</body>

@[include "footers.html"]
```

---

### 3.5 Literal Output Block

```text
@[literal "text"]
```

- Outputs text **without parsing**.
- Useful for escaping or outputting raw utpp syntax.

#### Example

```text
@[literal "@[if DEBUG]"]
This will be printed literally, not evaluated.
@[literal "@[end]"]
```

---

### 3.6 Match / Case Block

Provides switch-like control flow to select one branch based on a single expression.

Syntax:
```text
@[match expression ]
@[case value ]
  ...
@[case value2 ]
  ...
@[default ]
  ...
@[end]
```

- `expression` is evaluated by the utpp engine.
- Each `case` compares `value` to the evaluated `expression` using equality (`==` semantics).
- A `case` may contain multiple literal/comma-separated values: `@[case "a", "b", 3 ]`
- `value` can be a plain expression or a backtick JS-evaluated expression: `@[case `Date.now() % 2` ]`
- The first matching `case` is taken; there is no fall-through between cases.
- `@[default ]` is optional and executed when no case matches.
- The block ends with `@[end]`.

Examples:

Simple match:
```text
@[match status ]
@[case "ok" ]
  Status: OK
@[case "error" ]
  Status: Error
@[default ]
  Status: Unknown
@[end]
```

Multiple-case values:
```text
@[match role ]
@[case "admin", "superuser" ]
  Show admin UI
@[case "user" ]
  Show user UI
@[end]
```

Backtick evaluation:
```text
@[match `new Date().getDay()` ]
@[case 0 ] Sunday
@[case 6 ] Saturday
@[default ] Weekday
@[end]
```

Escaping rules:
- Use the same delimiter escaping rules as other directives (e.g., `@@[` / `]@`) to include literal utpp tokens inside case bodies.

---

## 4. Whitespace Handling

- Whitespace inside directives is optional.
- Newlines and tabs inside blocks are preserved in output.

#### Examples

```text
@[if x > 5]
  Hello
@[end]
```

→ Output:
```text
  Hello
```

```text
@[if x > 5 ]$
Hello
@[ end ]$
```

→ Same output.

---

## 5. Variables

- Variables are identified by name or dot notation.
- Names may be:
  - `varName`
  - `$varName` (PHP-style, optional)
  - `var.sub.sub`

#### Examples

```text
@[= userName]
@[= $userName]
@[= config.db.host]
```

> The utpp preprocessor must resolve variables from a context (e.g., JSON config, environment, command-line args).

---

## 6. Examples Across Host Languages

### 6.1 C Code

**Input:**
```c
#include <stdio.h>

int main() {
    @[if DEBUG]
    printf("Debug: x = %d\n", x);
    @[end]

    printf("Hello, @[= APP_NAME]!\n");
    return 0;
}
```

**Preprocessed (DEBUG=1, APP_NAME="MyApp"):**
```c
#include <stdio.h>

int main() {
    printf("Debug: x = %d\n", x);

    printf("Hello, MyApp!\n");
    return 0;
}
```

CLI (example):
- Using a context file:
```
utpp -c context.json template.c -o generated.c
```
- Inline JSON:
```
utpp -c '{"DEBUG":1,"APP_NAME":"MyApp"}' template.c -o generated.c
```
- Using -v flags:
```
utpp -v DEBUG=1 -v APP_NAME=MyApp template.c -o generated.c
```

---

### 6.2 JavaScript Code

**Input:**
```js
// template.js
const CONFIG = {
  apiBase: "@[= apiBaseUrl]",
  @[if useMock]
  mode: "mock",
  @[else]
  mode: "real",
  @[end]
  features: @[= `JSON.parse('${featureList}')` ]
};
```

**Preprocessed (apiBaseUrl="https://api.com", useMock=true, featureList="['dark-mode', 'auth']"):**
```js
// generated.js
const CONFIG = {
  apiBase: "https://api.com",
  mode: "mock",
  features: ["dark-mode", "auth"]
};
```

CLI (example):
```
utpp -c '{"apiBaseUrl":"https://api.com","useMock":true,"featureList":"[\\\"dark-mode\\\",\\\"auth\\\"]"}' template.js -o generated.js
```
Or with a context file:
```
utpp -c context.json template.js -o generated.js
```
- Using -v flags (JSON array or repeated -v for arrays):
```
utpp -v apiBaseUrl=https://api.com -v useMock=true -v featureList='["dark-mode","auth"]' template.js -o generated.js
```
- Or repeated -v to build an array:
```
utpp -v featureList=dark-mode -v featureList=auth -v apiBaseUrl=https://api.com template.js -o generated.js
```

---

### 6.3 Configuration File (INI-style)

**Input:**
```ini
[server]
host = @[= host]
port = @[= port]

@[if enable_tls]
tls = true
@[else]
tls = false
@[end]

[database]
url = @[= `${db.driver}://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}` ]
```

**Preprocessed (host="127.0.0.1", port=8080, enable_tls=false, db={driver:"mysql",user:"root",...}):**
```ini
[server]
host = 127.0.0.1
port = 8080
tls = false

[database]
url = mysql://root:@127.0.0.1:8080/mydb
```

CLI (example):
```
utpp -c '{"host":"127.0.0.1","port":8080,"enable_tls":false,"db":{"driver":"mysql","user":"root","pass":"","host":"127.0.0.1","port":8080,"name":"mydb"}}' template.ini -o generated.ini
```
Or:
```
utpp -c context.json template.ini -o generated.ini
```
- Using -v flags:
```
utpp -v host=127.0.0.1 -v port=8080 -v enable_tls=false -v db='{"driver":"mysql","user":"root","pass":"","host":"127.0.0.1","port":8080,"name":"mydb"}' template.ini -o generated.ini
```
- Arrays via repeated -v or JSON array:
```
utpp -v tags=alpha -v tags=beta template.ini -o generated.ini
utpp -v tags='["alpha","beta"]' template.ini -o generated.ini
```

---

## 7. Grammar (Simplified)

```ebnf
document  ::= block+
block     ::= directive | text
directive ::= if_block | for_block | include_block | literal_block | inline_expr | match_block
if_block  ::= OPEN "if" expr CLOSE body
             (OPEN "elif" expr CLOSE body)*
             (OPEN "else" CLOSE body)?
             OPEN "end" CLOSE
match_block ::= OPEN "match" expr CLOSE
               (OPEN "case" case_values CLOSE body)+
               (OPEN "default" CLOSE body)?
               OPEN "end" CLOSE
case_values ::= value ("," value)*
body      ::= block*
for_block  ::= OPEN "for" var "in" list CLOSE body OPEN "end" CLOSE
include_block ::= OPEN "include" string CLOSE
literal_block ::= OPEN "literal" string CLOSE
inline_expr ::= OPEN "=" (backtick_expr | plain_expr) CLOSE
backtick_expr ::= `+ (any_except_`)+`
plain_expr  ::= expr
expr       ::= term (("&&"|"||") term)*
term       ::= factor ("<"|">"|"<="|">="|"=="|"!=") factor | factor
factor     ::= primary ("." primary)*
primary    ::= "(" expr ")" | var | number | string
var        ::= IDENTIFIER | "$" IDENTIFIER
```

---

## 8. Implementation Notes

- **Context:** The utpp preprocessor must receive a data context (e.g., JSON, env vars, config file) to resolve variables.
- **JavaScript Evaluation:** Uses full unrestricted bun/node runtime.
- **Error Handling:** Report syntax errors with line/column numbers.
- **Performance:** Preprocess once; cache results.
- CLI: basic usage examples: Use yargs for parsing.
```
utpp [options] <input-file> [-o <output-file>]
```
Common options:
- `-c, --context <file|json>`  Provide context as a JSON file or inline JSON.
- `-v, --var <name=value>`     Provide a variable; may be repeated. Values parsed as JSON when possible.
                              Use repeated `-v name=value` to collect array elements, or pass a JSON array value.
- `--open <str>`, `--close <str>`  Override delimiters.
- `--escape-open <str>`, `--escape-close <str>`  Override escape tokens.
- `--max-include-depth <n>`  Limit include recursion depth.
- `--help`  Show usage.
- `--eval / --no-eval`   JS evaluation (backticks cause error). Default: enabled.
- `--net / --no-net`   network access and relevant functions. Default: enabled.

If no output file is specified, output to stdout.

Notes on arrays:
- Repeat `-v name=value` multiple times to accumulate an array (e.g., `-v tag=a -v tag=b` → tags: ["a","b"]).
- Or pass a JSON array as the value: `-v tags='["a","b"]'`.
- If a single `-v` value parses as valid JSON (object/array/number/true/false/null), it's used as that type; otherwise it's a string.

Examples:
```
utpp -c context.json template -o out.txt
utpp -v key=value template
utpp -v list=one -v list=two template
utpp -v list='["one","two"]' template
```

---

## 9. Security Considerations

- **Backticks (`= `` `)**: Evaluate only trusted JS. Never inject user input.
- **Includes:** Validate paths; prevent directory traversal.
- **Recursion:** Limit depth to prevent infinite loops.

---

## 10. Version

**Version:** 1.0  
**Date:** 2025-04-05  
**Author:** AI Assistant  
**License:** MIT (implied, adapt as needed)

---

## Summary

| Feature                        | Syntax                                |
|-------------------------------|------------------------------------------|
| Inline expression             | `@[= expr ]`                            |
| JS eval in expression         | `@[= `` js_code `` ]`                   |
| Conditional                    | `@[if ...] ... @[elif ...] ... @[else] ... @[end]` |
| Loop                           | `@[for v in l] ... @[end]`              |
| Include file                   | `@[include "path"]`                       |
| Literal output                 | `@[literal "text"]`                       |
| Match / Case                   | `@[match expr] @[case v] ... @[default] ... @[end]` |
| Escape delimiter               | `@@[` → `@[`, `]@` → `]`                 |
| Configurable delimiters       | Supported via settings                    |

This design balances **clarity**, **collision resistance**, and **flexibility**, making it ideal for cross-language templating.