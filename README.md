# ufpp
Universal File Pre-Processor


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

s

$[if "foo bar"]$

$[end]$

--- alternative same zeile TODO: roadmap

test $[ifeq foo bar]$baz$[end]$ 

$[if 1]$ 
a
$[else]$ 
b
$[end]$