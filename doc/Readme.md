What is this
============

This is an experimental bytecode vm. It is a register-machine.

It has some [opcodes](opcodes.md) that can be used. New operations are fairly simple to implement. See
[../src/interpreter/operations](../src/interpreter/operations)
for examples.

After you have implemented a new operation, either register it in the constructor of
the [interpreter](..src/interpreter/Interpreter.ts) or add it at runtime using the method `addOperation`.

## Registers

The vm uses "infinite" virtual registers. There is no concept of an accumulator.

## Stack frames

Stack frames are used to setup scopes. Use `PUSHSF` and `POPSF` to push and pop frames onto and from the stack. Access
to registers on the top frame is delegated to frames lower on the stack, if the top frame does not store the requested
register.

After a frame is popped it is closed, i.e. all registers that where accessed through the frame but where stored in a
frame lower on the stack are copied. The frame is then attached to all operations that used that frame as a closure.

## Update after execution

The VM keeps track of what operation within what stack frame accesses which register (read and write). This info can be
used to update register values after the program is run. All operations depending on the updated register are
re-executed. It works recursively but is kind of inefficient.

This is probably a stupid idea.