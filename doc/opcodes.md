The language
============

## General

It is kind of an interpreted assembly language with tailor made features for the creation of 2D graphics. 

### Opcodes

Are all uppercase. Come at the beginning of the line.

### Literals

Number and string literals are supported. Strings use double quotes.

### Registers

Are arbitrary names. If it's not a number and not a string it's a register.

#### Components of register

If a register stores an object, it's components can be accessed using the `.`-operator. This works for 
arrays as well

```
    LOAD r1, [1, 2, 3, 4]
    LOAD r2, r1.0           # Get's the first element
    LOAD r3, r1.length
```

### At-Access

If the value of a register implements a method called `at` this can be called.

The at-method can should receive a string or a number and return a value.

```
    LOAD r1, Circle1@0.34
    LOAD r1, Circle1@center
    LOAD r2, 0.3
    LOAD r1, Circle1@(r2)
```

This is mostly used on 2D objects to access specific points or make a parametrized access on the outline:

```typescript

    function at(where) {
        if (typeof where === "number") {
            return this.getPointAtPercentage(where);
        } else if (typeof where === "string") {
            return this.pointsOfInterest[POI[where]];
        } else {
            throw new Error(`Unknown location ${where} on ${ObjectType[this.type]}`);
        }
    }

```

## Labels

Labels are the only token on a line. They end with a `:`

```
    LOAD r1, 10
    LOAD r2, 0
LABEL:
    ADD  r2, r2, 10
    SUB  r1, r1, 1
    JNZ  r1, LABEL:
```

## Function calls

Using labels and `CALL` and `RET` you can make function calls:

```
    LOAD r1, 10              # Input
    CALL r3, FUNC:            # Call function: this pushes a stack frame. We'll receive the return value in r3
    JMP END                 # We'll return from the function to here
   
    FUNC:
        INC r1              # r1 was the Input
        RET r1              # return with return value in r3
    
    END:
```

### Arguments

Function declaration and calls can use arguments to pass data to the function.

```
    LOAD r1, 100
        CALL r2, SUBBER:, r1, 1
        HALT
                    
    SUBBER: a, b      
        SUB a, b
        RET a       
```

### Recursion

`CALL` and `RET` support recursive calls:

```
    LOAD r1, 15
    CALL res, FIB: 
    JMP END:
    
    FIB:
        JEQ r1, 0, ZERO:
        JEQ r1, 1, ONE:
        JMP ELSE:
    
        ZERO:
            LOAD r2, 0
            RET r2
            
        ONE:
            LOAD r2, 1
            RET r2
  
        ELSE:                    
            DEC r1
            CALL r3, FIB:
            
            DEC r1
            CALL r4, FIB:
            
            ADD r3, r4
            RET r3
    
  END:
```

This produces the 15th entry of the fibonacci sequence in `res`.

## Stackframes

Stack frames are used to open execution contexts.

```
    LOAD r1, 10
    LOAD r2, 10
    PUSHSF
        DEC r1
        ADD r1, r2
    POPSF            
```

At the end of the program `r1` has still the value `10`.

Read access can read from parent stack frames. Local registers will mask parent registers.

### Write access to parent stack frames

If you want to change the value of the parent stack frame you can prefix the register name with a `^`.

```
    LOAD r1, 10
    LOAD r2, 10
    PUSHSF
    DEC ^r1
    ADD ^r1, r2
    POPSF
```

At the end of this program `r1` will have the value `19`

## Whitespace and comments

Superfluous whitespace is ignored.

Everything after `#` is ignored and thus can be used to create comments.

## Opcodes

### General/Controlflow

| Opcode          | Arguments              | Description                                                                                                                                                    | 
|-----------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| LOAD            | target value           | load a value into target register                                                                                                                              |
| JNZ             | test label             | jump to label if test is not zero                                                                                                                              |
| JEQ             | test reference label   | jump to label if test is equal reference                                                                                                                       |
| JNE             | test reference label   | jump to label if test is not equal reference                                                                                                                   |
| JLT             | test reference label   | jump to label if test is lower than reference                                                                                                                  |
| JLE             | test reference label   | jump to label if test is lower or equal reference                                                                                                              |
| JGT             | test reference label   | jump to label if test is greater reference                                                                                                                     |
| JGE             | test reference label   | jump to label if test is greater or equal reference                                                                                                            |
| JMP             | label                  | Unconditionally jump to a label                                                                                                                                |
| HALT            |                        | Stop the program                                                                                                                                               |
| LOG             | message                | Write something on the console                                                                                                                                 |
| PUSHSF          |                        | Push a new frame on the stack and make it the current stack frame                                                                                              |
| POPSF           | \[return\]             | Pop the topmost frame from the stack and make it the current stack frame. Optionally one register to write data to the parent frame.                           |
| CALL            | \[receiver\] label     | Performs a functioncall. This pushes a frame. RET will return to the next statement. If receiver is provided the return value will be written to that register |   
| RET             | \[return register\]    | Returns from a function call. Pops the stack frame and sets the point to the next statement after the corresponding call.                                      |   
| DEBUG           |                        | stops execution without touching the instruction counter. Execution can be resumed                                                                             |
| DO/ENDDO        | index, maxIteration    | Repeats the block `maxIteration` times. The current iteration is stored in index. creates a new stackframe                                                     |
| FOREACH/ENDEACH | value, \[index\], list | Iterates over a list and repeats the block for each item. Current list value is stored in value. Optionally provides the index. Creates a new stack frame      |
| ITER            | target, list           | Creates an iterator for the list and stores it in `target`                                                                                                     |
| NEXT            | iterator               | Iterates the iterator                                                                                                                                          |
| JINE            | iterator label         | Jumps to the label if the iterator has not fully consumed the list                                                                                             |
| APP             | target, value          | Append a value to a list                                                                                                                                       |

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


### Graphics

For drawing and manipulating drawings there are special Opcodes

| Opcode  | Arguments | Description                               |
|---------|-----------|-------------------------------------------|
| CIRCLE  |           | Create a circle                           |
| RECT    |           | Create a rectangle                        |
| LINE    |           | Create a line                             |
| POLY    |           | Create/start a polygon                    |
| EXTPOLY |           | Add points to a polygon                   |
| QUAD    |           | Create a quadratic bezier (experiemental) |
| BEZIER  |           | Create a bezier (experiemental)           |
| MOVE    |           | Move an object                            |
| ROTATE  |           | Rotate an object                          |
| SCALE   |           | Scale an object                           |
| FILL    |           | Define the fill color                     |
| STROKE  |           | Define the outline width                  |
| MAKE    |           | Make an instance                          |




### Expressions

You can use expressions in statements.

```
 LOAD r1, 5 * 2
 LOAD r2, r1 + 10 * r1
```

Will store `r1 = 10` and `r2 = 110`.