# ufpp

```
Universal File Pre-Processor ('ufpp') is a tool for preprocessing any file

Positionals:
  file, f  the file to preprocess                                       [string]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -o, --output   the output file                    [string] [default: "stdout"]
  -m, --markers  set markers for preprocessor     [array] [default: ["$[","]$"]]
  -c, --check    checks/validates the file only       [boolean] [default: false]
  -v, --verbose  makes the preprocessor verbose       [boolean] [default: false]
  -q, --quiet    makes the preprocessor quiet         [boolean] [default: false]
      --no-eval  disables the eval function           [boolean] [default: false]

Examples:
  ufpp -o out.txt input.txt               runs the preprocessor on input.txt and
                                          write output to out.txt
  ufpp -o out.txt input.txt -m "<#" "#>"  runs the preprocessor on input.txt and
                                          write output to out.txt with markers
                                          <# and #>
  ufpp -c input.txt                       validates the syntax of input.txt file
```

### Install & Update
```bash
curl -FfSL
```

### Roadmap
- [ ] custom markers


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