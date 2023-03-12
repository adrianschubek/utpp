# upp
Universal File Pre-Processor


any file with 

./tool test.txt --VAR=bla > out.txt

ifeq 
ifne (!=)
iflt (<) 
ifgt 
ifge 
ifle (<=)

--- test.txt
!!ifeq VAR bla!!  
  lol
!!endif!!

--- alternative same zeile

test !#ifeq 