What is this
============

This is an experimental vm. It is a register-machine.

It has some [opcodes](opcodes.md) that can be used. New operations are fairly simple to implement. See
[../src/interpreter/operations](../src/runtime/interpreter/operations)
for examples.

After you have implemented a new operation, either register it in the constructor of
the [interpreter](..src/interpreter/Interpreter.ts) or add it at runtime using the method `addOperation`.

## Registers

The vm uses "infinite" virtual registers. There is no concept of an accumulator.

## Stack frames

Since it is a register machine it has no stack but uses stack frames instead to mask execution contexts.

Stack frames are used to setup scopes. Use `PUSHSF` and `POPSF` to push and pop frames onto and from the stack. Access
to registers on the top frame is delegated to frames lower on the stack, if the top frame does not store the requested
register.

After a frame is popped it is closed, i.e. all registers that where accessed through the frame but where stored in a
frame lower on the stack are copied. The frame is then attached to all operations that used that frame as a closure.

## Function calls and stacks

The passing of arguments to function calls is stack based. But this is not a feature of the interpreter but is just
an implementation detail of the CALL/RET operations