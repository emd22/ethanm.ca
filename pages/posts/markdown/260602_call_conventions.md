## Introduction

When programming, how can we call a function and ensure that we get back to the same place?

We can save an address to return back to, but the issue with this is that if the called function calls another function, it overwrites our return address, leading to a big mess.

On top of this, we need to be able to transfer values in and out of these functions. How can we do this while being certain that the return address will not be overwritten?

In programming, the method used for calling functions and passing parameters is called the **calling convention**. Each architecture, operating system, and sometimes even programming languages handle calling functions differently and each have their pros and cons.

To outline some of the problems that can occur when calling functions, here is an example using a pseudo-bytecode:

```
// This function does not call another function, so therefore
// we do not need to store the previous return address.
// This type of function is called a "leaf function".

FUNCTION Callee ( X, Y )
  ADD X, Y

  // Should the return address be popped into an internal
  // register before the result?

  PUSH RESULT

  // If it is done implicitly with the RETURN instruction,
  // the result will be consumed instead
  RETURN
END FUNCTION

FUNCTION Caller
  // How do we pass the return address to the callee?
  // Should it be pushed before pushing parameters?

  // Push parameters
  PUSH 10
  PUSH 20

  // Or pushed implicitly from the CALL instruction?
  CALL Callee
END FUNCTION
```

## Native code calling conventions

### x86 and x64: "We have return addresses at home"

When calling a function, parameters are placed firstly into registers and then spill over onto the stack when the registers run out.

- For Linux, parameters can be in the `rdi`, `rsi`, `rdx`, `rcx`, `r8`, and `r9` registers.
- For Windows, parameters can be in the `rcx`, `rdx`, `r8`, and `r9` registers.

When calling a function, The `call` instruction pushes the return address onto the stack, with the `ret` popping the last value and passing it to the program counter.

Because of this design, loading values from the stack pointer (`rsp`) or the base pointer (`rbp`) need to be offset due to the return address being stored on the stack.

For example:

```x86asm
; int test(int a, int b)
test:
  ; Setup stack frame
  push  rbp
  mov   rbp, rsp

  ; To prevent clobbering the register values from the caller, we need to
  ; preserve the arguments by copying to the predefined stack memory determined
  ; by the caller.
  mov   dword ptr [rbp - 4], edi
  mov   dword ptr [rbp - 8], esi

  ; Load `a` into a 32-bit A register and add with preserved `b`.
  ; Note the offset by 4!
  mov   eax, dword ptr [rbp - 4]
  add   eax, dword ptr [rbp - 8]

  ; Cleanup stack frame and return the addition result.
  pop   rbp
  ret
```

An easy to make mistake when programming x64 assembler is using a wrong offset when accessing memory. If the value at `[rbp]` was modified as opposed to `[rbp - 4]`, then the return address would be clobbered and likely leading to an interrupt being thrown.

### ARM64: 2 Fast 2 Hard to compile

ARM takes a similar method to x64 when it comes to parameters, with `x0` to `x7` being used for parameter passing and result regiters, but keeping the additional `x9` to `x15` to use for scratch registers.

The largest difference is that ARM64 tries to keep commonly modified and accessed values in registers at all times. This leads to the **Link Register**.

ARM64 also brings in the idea of optimizing **Leaf functions** – functions that do not call other functions – to always use the link register (`LR`, or `X30`) to store the return adddress, and forego the stack altogether.

When calling a function that does call another function, the return address and frame pointer are pushed to the stack when setting up the stack frame and popped during destruction. This is often done through two specialized instructions Load Pair (`ldp`) and Store Pair (`stp`) to modify both values in one instruction.

Using a register for return addresses greatly reduces latency as there is no need to wait on memory speeds. For small functions called frequently, this speed boost can improve congestion in the MMU and therefore lower clock speeds and reduce power consumption.

For example:

```armasm
; Leaf function, no need to preserve any values or locations
F_Leaf:
  mov     w0, #5

  ; Return via link register
  ret

F_NotLeaf:
  ; Store x29(Frame Pointer) and x30(Link Register) into stack
  stp     x29, x30, [sp, #-16]!

  ; Setup frame, set frame pointer to current position in stack
  mov     x29, sp

  ; Call leaf function
  bl      F_Leaf

  ; Destroy frame by popping frame pointer and link register
  ; off of the stack
  ldp     x29, x30, [sp], #16
  ret
```

## Scripting Languages: POP Rocks?

Many scripting languages such as Python or Lua take a simple path to dealing with return addresses.

Both Lua and Python push a little chunk of metadata onto an internal queue for each function call. This is popped off when returning, restoring the previous state.

It is important to note that there is no connection between the stack and this specialized internal queue in both scenarios; the queue is managed by the VM and automatically pushes and pops these values.

There are a few (minor) issues with this approach:

- Missed optimizations – Using a stack over primitive variables (virtualized registers) prevents a compiler from potentially optimizing down to using actual hardware registers.
- Poor memory locality – The call queues are likely allocated separately from the normal stack, leading to CPU caches needing to fetch parts of the call queue at each setup and destroy of a call frame.
- Higher memory usage when using recursive functions
- Fragmentation for dynamically allocated queues

Although this is a good solution for rewinding stack frames and memory, it can be more fragmented and potentially slower than other solutions.

## A Specialized Solution

Since my scripting language is very purpose built, I wanted to go for a hybrid approach to reduce complexity in the bytecode compiler and improve on what general purpose scripting languages do.

Since values and refs in the script are 32-bit (scripts should not be above 4 GiB in size anyway lol), and there will be limited recursion depth, we can use a preallocated stack to hold the return addresses. Given we have 2 KiB allocated, that allows for a recursion depth of 512 calls!

Building onto this, I defined the top few KiB of the script's stack would be designated 'system'. This means that return addresses can be pushed here separately, and I can implement checks to ensure that the values cannot be accidentally overwritten by a misplaced pop.

Separately, parameters are pushed onto the lower portion of the script stack as per normal. This means that all of those values are stored closely together, while avoiding offsetting pointers (in the case of x64), dealing with leaf functions (for ARM64), or high memory usage, fragmentation or poor cache locality of other scripting languages.

## Conclusion

In conclusion, calling and returning are among the most frequently executed instructions in a computer. Your CPU does a great job of making sure they are fast, and scripting languages have a separate purpose for their calling convention – holding internal states, data and ensuring no memory can be leaked.

If you are designing a custom language, choose what works best for you. Do you need performance? Do you want better debug info? Should there be lists of arguments, variable counts, etc?

Thats it for now,

Ethan
