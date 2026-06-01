## Introduction

Welcome to my new blog on C++, Graphics, and SIMD!

Due to my interest (obsession) with vectorizing code, I have been collecting a little roster of tips and tricks that I would like to put in one organized place for others to find.

For this blog, I will be mainly focusing on presenting code as Neon or SSE with some AVX sprinkled in, but expect some posts related to just one or the others occasionally. As well, I am not a writer and some of the anecdotes in here are just my own thoughts and should not be taken as fact (but I do work hard to make sure everything is correct.)

In these posts I will use "vector" and "register" interchangeably when referring to the collection of data that is operated on by the vector unit in the processor.

## The Rules

SIMD (Single Instruction Multiple Data) is used for doing exactly that– doing things on multiple bits of data in one instruction.

The general process behind SIMD is:

1. Load data into vectors
2. (Optionally) shuffle the vector
3. Perform operations
4. Store back to normal CPU registers

Seems simple enough, but the real trick to programming vectorized code is to minimize the amount of loads and stores we do. Loads and stores incur **latency**, which can cause the vector unit to wait for data from the CPU to be transferred into vectors and vice versa. This often also goes for operating with vectors and scalar values together.

An example of what **not** to do with loads would be:

```cpp
for (int i = 0; i < 128; i++) {
    // Load a 4 component vector of 1.0's every iteration (BAD)
    float4 one_v = Load4(1.0f);

    // Increment a vector by {1.0, 1.0, 1.0, 1.0}
    vectors[i] = Add4(vectors[i], one_v);
}
```

This code uses the pseudo-code `Load4`, which in a real system loads the scalar value from the cache into a vector register and splats it across all components. It is possible that a smart compiler will hoist this up to the top of the function, but it is not something that you should expect to be there when using intrinsics.

Corrected code:

```cpp
float4 one_v = Load4(1.0f);

for (int i = 0; i < 128; i++) {
    // Increment a vector by {1.0, 1.0, 1.0, 1.0}
    vectors[i] = Add4(vectors[i], one_v);
}
```

Building onto this, one big easy to make mistake is to extract every little operation to its own function, or use tons of external calls to do vector operations. This can causing stalling, mess with the vector pipeline, or be unpredictable performance-wise. Inline functions are generally fine, but the best option is to just program vector stuff directly when you need it.

## The Intel shaped elephant in the room

Intel's little gremlin SSE is somewhat equivalent to Neon. It is extremely powerful, while also having its own unique set of limitations. For instance, rearranging vectors is extremely easy with SSE using the `_mm_permute` or `_mm_shuffle` intrinsics, while being much more granular and sometimes agonizing in Neon. A strange limitation is that SSE does not have any instructions for horizontal operations. Something like `vaddvq` in Neon adds all components of the vector together, while you would need to employ liberal use of shuffles for SSE.

At the other end, Neon does not allow performing bitwise operations on floating point numbers much like C++ or C. To do so, you need to use a `reinterpret` intrinsic or similar. SSE comes in with a zinger with `_mm_xor_ps`. This might make you wonder, why are there bitwise floating point operations?

The biggest reason for this is that Neon uses a pool of [shared, arbitrarily typed 128 and 64 bit registers](https://developer.arm.com/documentation/dht0002/a/ch01s03s02), while SSE employs separate floating point and integer vector registers. This means if we only had access to integer bitwise operations, we would need to transfer the value into an integer register, incurring latency, and then transfer back after the bitwise operation is complete.

Something that I often hear is to never use bitwise operations on floating point numbers. But when programming SSE or Neon, you might not have a choice, and the cheapest way to flip the sign of a float is an OR or XOR.

The reasons behind the differences in limitations are the different goals of each architecture. x64 prioritizes high performance applications with no real worry about power consumption or heat constraints (_cough_ Pentium 4) while ARM is designed around mobile devices that have strict thermal and power constraints. As well, many of the large instructions in x64 are handed off nowadays to the microcode on the CPU which converts a large instruction into a bunch of small instructions. ARM tries to move a lot of this reinterpretation over to the developer and/or compiler, leading to the sometimes verbose syntax of Neon.

This leads to an interesting challenge: Neon is focused on providing a solid foundation to build custom implementations of all the staples (dot product, matrix work, etc.), while SSE contains instructions for dot product, 4x4 matrix transposition, streaming extensions and more. This makes life a lot easier, but can easily bring us to **implementation hell**, where there can be [slightly different results across CPUs](https://robert.ocallahan.org/2021/09/rr-trace-portability-diverging-behavior.html). **Sometimes the best option is to do it yourself**, and avoid the intrinsics given certain platforms.

## A Few Gotchas

### Vex Encoding

One of the biggest overlooked issues on the Intel side of things is about VEX-encoding. VEX is something that came around about the time of the release of AVX, which is essentially a next generation SSE with support for new larger vector registers and many more instructions. To use the additional instructions and new registers, a new 3 byte instruction prefix called the VEX prefix was introduced to tell the CPU to operate in AVX mode.

While the legacy SSE instructions operate on the XMM registers, VEX SSE operated on the lower half of AVX's YMM registers. This is great for new code as there is no penalty between executing AVX and SSE, but how can we use the legacy encoded instructions?

When we begin to execute legacy code (non VEX-encoded instructions), we get a [VEX-SSE transition](https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf) that stalls the vector pipeline. This can lead to significant performance loss, and it might not be an issue in your project, but keep this in mind when using legacy libraries.

### Global Constants

Here is a nasty one that I have encountered in the wild:

```cpp
// SSE
static const __m128 scSomeSSE = *reinterpret_cast<__m128*>((float[4]){ 1.0f, 2.0f, 3.0f, 4.0f });
// Neon
static const float32x4_t scSomeNeon = {1.0f, 2.0f, 3.0f, 4.0f};
```

Storing constants like this does not cache any values from vector. On every usage of these variables, it reloads the values into a register, even if its in the same scope as a previous usage. [Link to an example](https://godbolt.org/z/e8xf7ozKM).

Never do this! You can always store a static float array with the constant values and load it at the start of the scope before usage, but never use the vector as a global variable.

## Conclusion

I'll likely update this page as time goes on and I have time to add some more details or things I have missed.

Ethan

### Helpful Resources

- [Intel Intrinsics Reference](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#)
- [ARM Neon Reference](https://arm-software.github.io/acle/neon_intrinsics/advsimd.html)
- [Felix Cloutier's x86 Reference](https://www.felixcloutier.com/x86/)
