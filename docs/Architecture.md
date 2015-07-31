# VM Architecture

 Stack based (stack grows up).  All operations are performed on the top of the stack.  Callers are responsible for cleaning up calls.
 
 Registers:
   - ci: Current instruction pointer
   - sp: Stack pointer - points at top of stack
   - fb: Frame base - points at base of current frame
  
 
 Stack Frame:
 
 | Offset    | What is it |
 |:--------- |:---------- |
 |  `[fb+1]` | Locals
 |  `[fb]`   | Previous `fb` value
 |  `[fb-1]` | Return address
 |  `[fb-2]` | Space for return value
 |  `[fb-3]` | Parameter x
 |  `[fb-.]` | Parameter .
 |  `[fb-x]` | Parameter 1
 
 Instructions:
 
   - `push` Pushes the operand onto the stack
   - `pop`  Pops the top value off the stack, optionally into an operand
   - `call` Pushes return value space on to the stack.  Pushes `ci` onto the stack.  Pushes `fb` onto the stack.  Sets `fb` to `sp`.  Sets `ci` to operand
   - `ret`  Pops values off the top of the stack until `sp` == `fb`.  Pops top value off stack into `fb`.  Pops top value off stack into `ci`.
   - `add`  Pops two topmost values off the stack and adds together, storing result on the stack.  If one is a string, concatenates instead.