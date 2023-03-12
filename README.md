![](ufpp.png)
![](p1.png)
![](p2.png)
```
Universal File Pre-Processor ('ufpp') is a tool for preprocessing any file

Usage: ufpp [options] <file> [variables]

Positionals:
  file, f  the file to preprocess                                       [string]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -o, --output   the output file                    [string] [default: "stdout"]
  -c, --check    checks/validates the file only       [boolean] [default: false]
  -v, --verbose  makes the preprocessor verbose       [boolean] [default: false]
  -q, --quiet    makes the preprocessor quiet         [boolean] [default: false]
      --no-eval  disables the eval function           [boolean] [default: false]
      --no-vars  disables the variables replacement   [boolean] [default: false]

Examples:
  ufpp -o out.txt input.txt    runs the preprocessor on input.txt and write
                               output to out.txt
  ufpp input.txt foo=bar       runs the preprocessor on input.txt and sets
                               variable foo to bar
  ufpp input.txt -m "<#" "#>"  runs the preprocessor on input.txt and write
                               output to out.txt with markers <# and #>
  ufpp -c input.txt            validates the syntax of input.txt file

for more info and support visit https://github.com/adrianschubek/ufpp
```
## Use Cases
- Dynamically modifiy static config files based on user input
- Replace placeholder with custom eval'd JavaScript at runtime
- Start specific service conditionally on docker run arguments. 
- and many more...
## Installation

#### Using Precompiled binaries

Precompiled binaries for
- Windows x64
- Linux x64
- Linux arm64
- Alpine Linux x64
- MacOS x64
- MacOS arm64

are published every [release](https://github.com/adrianschubek/ufpp/releases) and are also available in [/dist](/dist/) folder.

#### Compile binaries yourself

1. clone this repo
2. run `npm install`
3. run `tsc` to compile TypeScript files
4. run `npm run pack`
5. binaries for various platforms are compiled in `/dist`

#### Using node (and tsc)

1. clone this repo
2. run `npm install`
3. run `tsc` to compile TypeScript files
4. run `node out/index.js`

## Usage



## Roadmap
- [ ] custom markers
- [ ] no-template option


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
$[end]$