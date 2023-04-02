<div align="center">

![](utpp.png)
![](p1.png)
![](p2.png)
![](p3.png)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white)
[![npm](https://img.shields.io/npm/v/utpp?color=blue&style=flat-square)](https://www.npmjs.com/package/utpp)

</div>

## Documentation

<h2 align="center">

  [utpp.adriansoftware.de](https://utpp.adriansoftware.de)

</h2>

## Features
- **Universal**: works with any file format
- **Branching**: use if/else logic to include/exclude/modify parts of your file
- **Variables**: use placeholders in your file and replace them with variables
- **Scripting**: execute custom JavaScript code anywhere
- **Portable**: works on any platform (Windows, Linux, MacOS, Docker containers etc.)

## Use Cases
- Dynamically modifiy static config files based on user input
- Replace placeholder with custom eval'd JavaScript on startup
- Start a supervisor service conditionally using docker run arguments. 
- Use different compile commands based on user's current architecture
- and many more...
## Installation

#### Using [npm](https://www.npmjs.com/package/utpp) (recommended)

```
npm install -g utpp
```

or if you want to test it without installing it globally:

```
npx utpp
```

#### Using Precompiled binaries

```
sudo curl -fSsL https://github.com/adrianschubek/utpp/releases/latest/download/utpp-linux -o /usr/local/bin/utpp && sudo chmod +x /usr/local/bin/utpp
```

Precompiled binaries for  **Linux** (x64, alpine) and **Windows** (x64) are published every [release](https://github.com/adrianschubek/utpp/releases).

Both compressed (.tar.gz) and uncompressed binaries are available.

*Linux-alpine* binaries are designed to be used in docker containers.

**MacOS** and *arm* binaries are not published yet, but you can compile them yourself (see below).

#### Compile binaries yourself

1. clone this repo
2. run `npm install`
3. run `npm run build:npm`
4. run `npm run pack`
5. binaries for various platforms are compiled in `/dist`

> Move the executable to `/usr/local/bin` for easier CLI access: `sudo mv <your-file> /usr/local/bin/utpp`

## Usage

```
Universal Text Pre-Processor ('utpp') is a tool for preprocessing any file

Usage: utpp [options] <file> [variables]

Positionals:
  file, f  the file to preprocess                                       [string]

Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -o, --output       the output file                [string] [default: "stdout"]
  -c, --check        checks/validates the file only   [boolean] [default: false]
  -v, --verbose      makes the preprocessor verbose   [boolean] [default: false]
  -q, --quiet        makes the preprocessor quiet     [boolean] [default: false]
      --no-eval      disables eval function                            [boolean]
      --no-files     disables inclusion from files                     [boolean]
      --no-urls      disables inclusion from urls                      [boolean]
      --no-template  disables template replacement                     [boolean]
      --no-vars      disables variables replacement                    [boolean]

Examples:
  utpp -o out.txt input.txt    runs the preprocessor on input.txt and write
                               output to out.txt
  utpp input.txt foo=bar       runs the preprocessor on input.txt and sets
                               variable foo to bar
  utpp input.txt -m "<#" "#>"  runs the preprocessor on input.txt and write
                               output to out.txt with markers <# and #>
  utpp -c input.txt            validates the syntax of input.txt file

for more info and support visit https://github.com/adrianschubek/utpp
```
> Show this help page by running `utpp`.

### Syntax

#### Blocks

A (template) block can be declared by using one or more `$[<command>]$` statements where `<command>` is a valid command (see API reference below) and must end in a `$[end]$` statement. 

A block's statements are evaluated from top to bottom. If the result of a command is truthy, the guarded section will be outputted and all other commands in this block ignored. 

Otherwise this statement will be skipped and the next statement is evaluated. If no statement in this block is truthy, the `else` section will be outputted and if no `else` section is present, nothing will be outputted.

There can be any number of blocks declared in a file, but blocks **cannot** be nested.

#### Commands
A command generally follows this syntax `$[<name> [arg1] [arg2] ... [argN]]$` where `<name>` is a [command's name](#commands-reference) `[arg]` is a [*Value*](#values). All commands return either `true` or `false`.

#### Values
- Values can reference Variables by using their name (e.g. `foo` where `foo` is  variable).
- Values are treated as strings by default and cannot contain spaces (e.g. `foobar123`).
- Values surrounded by `"` are treated as strings and can contain spaces (e.g. `"foo bar"`).
- Values surrounded by `` ` `` (backticks) are evaluated using JavaScript's `eval` function. This means you can use any valid JavaScript expression inside (e.g. `` `0.1 + 0.2` ``).
- Values starting with `file:` are treated as file paths and the file's content is used as the value (e.g. `file:foo.txt` where `foo.txt` is a file relative to the preprocessed file.).
- Values starting with `url:` are treated as URLs and the URL's content is used as the value (e.g. `url:https://myapi.com/version`).
- Values starting with `env:` are treated as environment variables and the environment variable's value is used as the value (e.g. `env:HOME`).


#### Variables

A variable can be used inside a template block's *Value* argument by using its name. Variables are stored globally and changes to a variable can only affect statements declared **after** the current one. 

Variables can be declared on CLI execution using `key=value` pairs or just a `key`. Multiple variables can be passed as arguments by using spaces like `foo=bar foz="baz 123" foobar`.

Statements ending in `s` (e.g. `ifeqs`) can set a variable when their statement evaluates to `true`. (see [reference](#commands-reference))

#### Printing
Outputting a variable can be done using `${{<value>}}$` (curly braces) where `<value>` is any value defined [above](#values).

> *Note:* Since version 0.3.0+ the syntax for printing variables has changed from `${<value>}$` to `${{<value>}}$` to avoid some common conflicts.

## Examples

*Example: test.txt*
```
foobar
$[if `1 + 2 == 4`]$
a
$[ifeq foo bar]$
b ${{foo}}$
$[else]$
c
$[end]$

${{`0.1 + 0.2`}}$

${{file:incl.txt}}$

${{url:https://httpbin.org/uuid}}$

${{env:HOME}}$
```
*and incl.txt:* `This was included from incl.txt`

Running this example with `utpp test.txt foo=bar` will result in the following output:
```
foobar

b bar


0.30000000000000004

This was included from incl.txt

{
  "uuid": "ba95cd1c-2bb9-4a54-a1a4-5379ce1f2fac"
}


/home/adrian
```


### Commands Reference 

#### Commands without side effects

`if <value>` - return true when `<value>` is truthy, otherwise false.

`ifdef <name>` - return true when a variable with name `<name>` is defined, otherwise false.

`ifndef <name>` - return true when a variable with name `<name>` is not defined, otherwise false.

`ifeq <value1> <value2>` - return true when `<value1>` is equal to `<value2>`, otherwise false.

`ifne <value1> <value2>` - return true when `<value1>` is not equal to `<value2>`, otherwise false.

`iflt <value1> <value2>` - return true when `<value1>` is less than `<value2>`, otherwise false.

`ifgt <value1> <value2>` - return true when `<value1>` is greater than `<value2>`, otherwise false.

`ifge <value1> <value2>` - return true when `<value1>` is greater than or equal to `<value2>`, otherwise false.

`ifle <value1> <value2>` - return true when `<value1>` is less than or equal to `<value2>`, otherwise false.

#### Commands with side effects

`ifdefs <name> <variable> <newvalue>` - return true when a variable with name `<name>` is defined, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifndefs <name> <variable> <newvalue>` - return true when a variable with name `<name>` is not defined, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifeqs <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is equal to `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifnes <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is not equal to `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`iflts <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is less than `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifgts <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is greater than `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifges <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is greater than or equal to `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

`ifles <value1> <value2> <variable> <newvalue>` - return true when `<value1>` is less than or equal to `<value2>`, otherwise false. If the statement is true, `<variable>` will be set to `<newvalue>`.

#### Special Commands

`else` - used in a block to define an alternative output when no statement in the block is truthy.	

`end` - used to end a block.

## Roadmap
- [x] no-template option
- [x] include data from other files
- [x] include data from urls
- [x] support mutliple files as input
- [ ] custom markers
- [ ] possibility to reference variables inside JavaScript expressions

## Development

1. clone this repo
2. run `npm install`
3. run `npm run build:watch` 
4. run `node out/index.js`


<!-- 
any file with 

./tool test.txt --VAR=bla > out.txt

ifeq NAME VALUE
ifne (!=) NAME VALUE
iflt (<) NAME VALUE
ifgt NAME VALUE
ifge NAME VALUE
ifle (<=) NAME VALUE
ifdef NAME
ifndef NAME
else
endif
TODFO: print value echo

VALUE: foo
VALUE: "foo bar"
VALUE: `2+3` (backticks) will be interpreted (eval'd) as javascript

! NO nesting !

--- test.txt
$[ifeqs show bla didShow 1]$
  lol
$[if `1+2 == 5`]$
 aa
$[else]$
  bar
$[end]$

${foo}$ <- variable print

$[if "foo bar"]$

$[end]$

--- alternative same zeile TODO: roadmap

test $[ifeq foo bar]$baz$[end]$ 

$[if 1]$ 
a
$[else]$ 
b
$[end]$ -->
