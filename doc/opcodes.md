Opcodes
=======

## General

### Opcodes

Are all uppercase. Come at the beginning of the line.

### Literals

Number and string literals are supported. Strings use double quotes.

### Registers

Are arbitrary names. If it's not a number and not a string it's a register.

## Labels

Labels are the only token on a line. They end with a :

```
    LOAD r1 10
    LOAD r2 0
LABEL:
    ADD  r2 r2 10
    SUB  r1 r1 1
    JNZ  r1 LABEL
```

## Opcodes

### General/Controlflow

| Opcode | Parameters           | Description                                                                        | 
|--------|----------------------|------------------------------------------------------------------------------------|
| LOAD   | target value         | load a value into target register                                                  |
| JNZ    | test label           | jump to label if test is not zero                                                  |
| JNE    | test reference label | jump to label if test is not equal reference                                       |
| LOG    | message              | Write something on the console                                                     |
| PUSHSF |                      | Push a new frame on the stack and make it the current stack frame                  |
| POPSF  |                      | Pop the topmost frame from the stack and make it the current stack frame           |
| DEBUG  |                      | stops execution without touching the instruction counter. Execution can be resumed |   

### Math

Binary operations like ADD, SUB, ... can take two or three arguments. 
If three are given, then the result `arg2 op arg3` is store in `arg1`.
If only two are given then the result of `arg1 op arg2` is stored in `arg1`

| Opcode | Parameters         | Description                       | 
|--------|--------------------|-----------------------------------|
| ADD    | target op1 \[op2\] | add two registers or values       |
| SUB    | target op1 \[op2\] | subtract two registers or values  |
| MUL    | target op1 \[op2\] | multiply two registers or values  |
| DIV    | target op1 \[op2\] | divide two registers or values    |
| EXP    | target op1 \[op2\] | calculate op1 ^ op2               |
