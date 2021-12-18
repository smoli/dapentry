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

Labels are the only token on a line. They end with a `:`

```
    LOAD r1 10
    LOAD r2 0
LABEL:
    ADD  r2 r2 10
    SUB  r1 r1 1
    JNZ  r1 LABEL
```

## Function calls

Using labels and `CALL` and `RET` you can make function calls:

```
    LOAD r1 10              # Input
    CALL r3 FUNC            # Call function: this pushes a stack frame. We'll receive the return value in r3
    JMP END                 # We'll return from the function to here
   
    FUNC:
        INC r1              # r1 was the Input
        RET r1              # return with return value in r3
    
    END:
```

Right now function calls **do not support update after execution**.

### Recursion

`CALL` and `RET` support recursive calls:

```
    LOAD r1 15
    CALL res FIB 
    JMP END
    
    FIB:
        JEQ r1 0 ZERO
        JEQ r1 1 ONE
        JMP ELSE
    
        ZERO:
            LOAD r2 0
            RET r2
            
        ONE:
            LOAD r2 1
            RET r2
  
        ELSE:                    
            DEC r1
            CALL r3 FIB
            
            DEC r1
            CALL r4 FIB
            
            ADD r3 r4
            RET r3
    
  END:
```

This produces the 15th entry of the fibonacci sequence in `res`.

## Whitespace and comments

Superfluous whitespace is ignored.

Everything after `#` is ignored and thus can be used to create comments.

## Opcodes

### General/Controlflow

| Opcode | Arguments            | Description                                                                                                                                                    | 
|--------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| LOAD   | target value         | load a value into target register                                                                                                                              |
| JNZ    | test label           | jump to label if test is not zero                                                                                                                              |
| JEQ    | test reference label | jump to label if test is equal reference                                                                                                                   |
| JNE    | test reference label | jump to label if test is not equal reference                                                                                                                   |
| JLT    | test reference label | jump to label if test is lower than reference                                                                                                                  |
| JLE    | test reference label | jump to label if test is lower or equal reference                                                                                                              |
| JGT    | test reference label | jump to label if test is greater reference                                                                                                                     |
| JGE    | test reference label | jump to label if test is greater or equal reference                                                                                                            |
| LOG    | message              | Write something on the console                                                                                                                                 |
| PUSHSF |                      | Push a new frame on the stack and make it the current stack frame                                                                                              |
| POPSF  | \[return\]           | Pop the topmost frame from the stack and make it the current stack frame. Optionally one register to write data to the parent frame.                           |
| CALL   | \[receiver\] label   | Performs a functioncall. This pushes a frame. RET will return to the next statement. If receiver is provided the return value will be written to that register |   
| RET    | \[return register\]  | Returns from a function call. Pops the stack frame and sets the point to the next statement after the corresponding call.                                      |   
| DEBUG  |                      | stops execution without touching the instruction counter. Execution can be resumed                                                                             |   

### Math

Binary operations like ADD, SUB, ... can take two or three arguments. If three are given, then the result `arg2 op arg3`
is store in `arg1`. If only two are given then the result of `arg1 op arg2` is stored in `arg1`

| Opcode | Arguments          | Description                      | 
|--------|--------------------|----------------------------------|
| ADD    | target op1 \[op2\] | add two registers or values      |
| SUB    | target op1 \[op2\] | subtract two registers or values |
| MUL    | target op1 \[op2\] | multiply two registers or values |
| DIV    | target op1 \[op2\] | divide two registers or values   |
| EXP    | target op1 \[op2\] | calculate op1 ^ op2              |
| INC    | target             | increase target by one           |
| DEC    | target             | decrease target by one           |
