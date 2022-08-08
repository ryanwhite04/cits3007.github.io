---
title: |
  CITS3007 Secure Coding\
  C language, intro to buffer overflows
author: "Unit coordinator: Arran Stewart"
include-before: |
  ```{=latex}
  %\setbeameroption{hide notes} % Only slides
  %\setbeameroption{show only notes} % Only notes
  %\setbeameroption{show notes on second screen=right} % Both
  ```
---

### Outline

- C language topics -- which bits of C should you know?
- Systems programming refresher -- privilege levels and system calls
- Vulnerabilities -- buffer overflows
  - the Morris Internet worm

# C language refresher

### Importance

Although created over 50 years ago, the C language has a privileged place
in the software industry.

- Most modern operating systems (e.g. Linux, Windows and macOS) are written in C
  - their *interfaces* are defined in C
- Many programming languages have their primary implementation in C (e.g. Python,
  JavaScript, Lua, Bash)
- As a result, C often serves as a "lingua franca" when extending languages
  or developing programs written in multiple languages
  - For instance, the Python language can be extended by writing
    [new built-in modules][python-extend] in C.

[python-extend]: https://docs.python.org/3.10/extending/extending.html

::: notes

- Well -- V8 JS engine is actually in C++. But bindings are in C.

:::

### Features

C was created as an efficient systems programming language, and was first used
to re-write portions of the Unix operating system so as to make them more portable.

It aims to give the programmer a high level of control
over the organization of data and the operations performed on that data.

It inherited some features from the language [PL/I][pl-i],
but unfortunately in some cases opted for less security than did PL/I.

For instance, [buffer overflows][buffer-overflows] (which we look at
shortly)
were rare in PL/I, as it required that programmers always specify a
maximum length for strings:[^multics] C does not implement this feature.

[pl-i]: https://en.wikipedia.org/wiki/PL/I
[buffer-overflows]: https://en.wikipedia.org/wiki/Buffer_overflow

[^multics]: Karger & Schell (2002)

::: notes

- e.g. C's comment style is copied from PL/I; variable declaration
  style seems to be Ritchie's own invention; `auto` and `static`
  are from B/BCPL; preprocessor was in use by both PL/I and BCPL

see:

- Ritchie, <https://www.bell-labs.com/usr/dmr/www/chist.html>
- PL/I vs C comparison code:
  <http://eberhard-sturm.de/ZIV/PL1andC.html>. (Part of a pro-PL/I
  rant.)

**3 aug 2022**

- UWA reported a data breach last Friday --

:::

### Language standards

We will largely discuss the C11 standard,[^c11] which is still in widespread use.

That said, as long as your code compiles and runs correctly
using the standard CITS3007 development environment, you are welcome
to use the C17 version of the language if you wish.[^gcc-c17]

[^c11]: ISO/IEC 9899:2011. See [ISO/IEC 9899:201x][open-c]
  at <https://www.open-std.org> for a draft version.

[open-c]: https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf

[^gcc-c17]: \texttt{gcc} can be instructed to use C17 by passing
  \texttt{-std=c17} to the compiler.

### Language references and texts

\small

- If you're pretty familiar with C:

  - The \alert{ISO/IEC C11 standard} is a bit
    wordy, and the vocabulary takes a bit of getting used to -- but it's
    not *that* difficult to follow, and it's the final word on what a
    legal C11 program should do.
  - `\alert{`{=latex}<https://cppreference.com>`}`{=latex} actually has
    very good coverage of C header files and functions. \
    Just make sure you're reading the right one.
  - from a corresponding C++ page, follow the "C
    language" links down the bottom of page
  - C language topics should have a URL that looks like
    `https://en.cppreference.com/w/c/SOMETHING`

- Otherwise, the \alert{CITS2002 Systems Programming} website has
  good recommendations on (both free and non-free) C textbooks:
  `\footnotesize`{=latex} <https://teaching.csse.uwa.edu.au/units/CITS2002/c-books.php>

### Integers in C

\small

C has a large number of integral data types.[^int-types]
The most common are:

::: block

\small

#### standard integer types

- standard signed integer types: `signed char`, `short int`, `int`, `long int`,
  and `long long int`
- standard unsigned integer types: `_Bool` (also available as `bool`),
  `unsigned char`, `unsigned short int`, `unsigned int`, `unsigned long int`,
  and `unsigned long long int`
- the `char` type.

:::

What range of integers these can hold, and which of these
types are equivalent to each other, is implementation dependent.

[^int-types]: In fact, nearly every type you see in this
  unit (besides function types) is either an integer type,
  or derived from (array or \texttt{struct} or pointer to) integer types.


::: notes

- C11 - see e.g.  <https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf>.
- bits in byte impl-dependent: 3.6.
- types: 6.2.5

importance:

- Most types we (in this unit) encounter in programs will be
  integers or collections (arrays, structs) of integers!
- Really, the only other types are the floating point types,
  which most people won't deal with much in systems programming

:::

### Integers in C

::: block

\small

#### standard integer types

- standard signed integer types: `signed char`, `short int`, `int`, `long int`,
  and `long long int`
- standard unsigned integer types: `_Bool` (also available as `bool`),
  `unsigned char`, `unsigned short int`, `unsigned int`, `unsigned long int`,
  and `unsigned long long int`
- the `char` type.

:::

\vspace{-0.5em}The C11 standard states that
the `char` type is equivalent to *either* `signed char` or `unsigned char`,
but which one is the case is implementation-defined.`\\`{=latex}
It says the size of a `char` is one byte, and has at least 8
bits, but *doesn't* otherwise constrain
how many bits exist in a byte (this, too, is
implementation-defined).[^nbby]

[^nbby]: The \texttt{CHAR\_BIT} macro in \texttt{<limits.h>} will tell
  you the number of bits per byte. On Unix-like OSs, the macro
  \texttt{NBBY}, defined in \texttt{<sys/param.h>}, will give the same result.

::: notes

- `CHAR_BIT` - see <https://en.cppreference.com/w/c/types/limits>

good reference for C, if you already know roughly what you're
after:

- often, easiest just to go to <https://cppreference.com> as it
  details C standard as well as C -- BUT make sure you're reading
  the right one -- from a corresponding C++ page, follow the "C
  language" links down the bottom of page
- can be a tad forbidding for a novice programmer

:::


### Floating point types

C also has three "real floating types", but we will be less concerned
with them.

::: block

\small

#### real floating types

- `float`
- `double`
- `long double`

:::

(It also has three corresponding types for [complex
numbers][complex-nums], which we won't use at all.)

[complex-nums]: https://en.wikipedia.org/wiki/Complex_number

::: notes

- See C11 standard, 6.2.5, "types"

:::

### Functions in C

All executable statements in C must be written inside a procedure -- C calls
its procedures "functions".

C functions may return a result, in which case the signature of the function
will indicate the return type. For instance:

::: block

####

```C
int square(int x);
```

:::

The function declared above takes one argument (an `int`), and returns
an `int` value.


### Functions in C

::: block

####

```C
void print_int_to_terminal(int x);
```

:::

Alternatively, a function may be declared as having return type `void`,
in which case it *doesn't* return any value as a result.

Both void and non-void functions may have *side effects*: they may
for instance
modify the values of global variables, perform output to the
terminal, or alter the state of files or attached devices.

### Function declarations and definitions

A function \alert{declaration} "tells" code following it
about a function:

::: block

####

```C
int square(int x);
```

:::

A function \alert{definition} provides the "body" of the function:

::: block

####

```C
int square(int x) {
  return x * x;
}
```

:::




### Scope in C

C has two basic types of scope:

- \alert{global scope} (or "file scope"): for variables declared outside all
  functions. These are visible from the declaration, to the end of the file.
- \alert{block scope}: for variables declared within a function or statement block.
  These are visible from the declaration, to the end of the function or statement block.

For global variables (and for functions, which are always global --
C doesn't have nested functions): adding the keyword
`{\bfseries\passthrough{\lstinline!static!}}`{=latex}
before them ensures that the variable or
function is *only* visible from within that file.


Limiting scope is C's primary method of implementing [information
hiding][info-hiding].

[info-hiding]: https://en.wikipedia.org/wiki/Information_hiding


::: notes

- info hiding: originally defined by Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules"
  (1972).
- see also "static functions" -
  <https://stackoverflow.com/questions/558122/what-is-a-static-function-in-c>

:::

### Scope in C


\begin{center}
\includegraphics[width=1.0\textwidth]{images/scope.pdf}
\end{center}


### Arrays in C

C provides support for 1-dimensional and multi-dimensional arrays.

::: block

#### 1-dimensional array

```C
#define ARRAY_SIZE 10
int some_array[ARRAY_SIZE];
```

:::


::: block

#### 2-dimensional array

```C
#define ARRAY_HEIGHT 5
#define ARRAY_WIDTH  10
int two_d_array[ARRAY_HEIGHT][ARRAY_WIDTH];
```

:::

::: notes

- Arrays decay to pointers

:::


### Strings in C

C does not provide a separate datatype for strings -- rather,
strings are considered to be arrays of `char`s, with the `NUL`
character (which has ASCII code 0) acting as a terminator.

::: block

#### String

```C
// this declaration:
char my_str = "cat";
// is equivalent to:
char my_str[4] = { 'c', 'a', 't', '\0'};
```

:::



### Pointers in C



```{=latex}
\begin{columns}[t]
\begin{column}{0.45\textwidth}
```

\alert{Pointer} types in C hold a reference to an entity of some *other* type.
For instance a "pointer to `int`" (written `int *`) holds a reference to an
`int`.

&nbsp;

It's usually convenient to think of this "reference" as the address of a location
in memory, but the C11 standard does not require that to be the case.


```{=latex}
\end{column}
\begin{column}{0.55\textwidth}
```

`\begin{center}`{=latex}

![A pointer and the variable it references\footnotemark[1]](lect02-images/Pointers.svg){ width=80% }

`\end{center}`{=latex}



```{=latex}
\end{column}
\end{columns}
```

`\footnotetext[1]{`{=latex}
Image courtesy of Wikipedia, <https://commons.wikimedia.org/wiki/File:Pointers.svg>
`}`{=latex}

::: notes

- "address in memory": could instead be a memory segment plus offset, etc.

- "entity": the C standard uses the term "object". I avoid it here
  to prevent confusion with the OO meaning.

:::

### Pointers in C

C allows the use of \alert{pointer arithmetic}. In addition to
performing (say) addition on two integer values, we can perform it
on one pointer value and one integer value.

::: block

####

```C
int * p1 = NULL;
int * p2 = p1 + 4;
```

:::

Adding `4` to a pointer doesn't move it along by 4 memory locations;
it moves it along by `4` $\times$ the size of whatever is being pointed
to (an `int`, in the example above).

We can also subtract one pointer from another, and perform equality and
inequality comparisons on two pointers (`==`, `<`, `>`, `<=`, and `>=`).

::: notes

- pointer addition is defined in C11 at 6.5.6 Additive operators.
- And see the corresponding sections for subtraction, equality, etc.

:::

### Pointers in C

Many languages disallow pointer arithmetic, since its use can
easily result in invalid pointers (pointers that
do not reference a properly initialized object of the correct type).

C allows it; it is up to the programmer to ensure they comply
with the standard's rules as to when a pointer is valid.

If the programmer fails to comply with those rules,
the result usually is that the behaviour of the
program is *undefined*.

(In other words: the program has no well-defined "meaning",
according to the C11 standard; and the standard places no
constraints on what behaviour it may have.)

::: notes

- cf Java: is careful about where it lets you get pointers from (you can't
  **forge** references)
- is careful *when* you can have them (only once ctor executed);
- is careful about what you can do with them (no ptr arith)

UB:

- nasal demons

:::


### Pointers in C

\begin{center}
\includegraphics[width=0.8\textwidth,height=\textheight]{images/array.pdf}
\end{center}

For instance: if arithmetic is performed on a pointer which references
some element of an array, and the resulting pointer would go outside the
bounds of the array,[^bounds] then the behaviour of the program is
undefined.

[^bounds]: To be precise: the pointer must point either to an element
  of the array, or the position one past the last element.

### Pointers in C

A pointer to a variable can be obtained using the '`&`' ("address-of")
operator, and pointers can be dereferenced using  '`*`' (the dereference
operator).


\begin{center}
\includegraphics[width=1.0\textwidth]{images/pointerops.pdf}
\end{center}



### Lifetime

Variables have a \alert{storage duration} that determines their
"lifetime".

- Memory for \alert{global} variables is allocated when the program
  starts running, and persists until the program exits

- However, the majority of variables in a program are \alert{local}
  variables, and have what is called "automatic storage duration"
  - This basically means they "disappear" when the function they
    are declared in exits, and the memory allocated to them is reclaimed
  - If you've somehow managed to hang onto a reference to this memory,
    the behaviour of your program is *undefined*

::: notes

- technically it's *objects* that have a storage duration -- C11,
  6.2.4. But near enough

:::

### Automatic lifetime and dangling pointers

\small

Consider this function:

::: block

####

```C
int * myfunc() {
  int a_local_var = 36;
  int * a_pointer = &a_local_var;
  return a_pointer;
}
```

:::

There's nothing wrong with returning a pointer -- lots of functions
do it (like the standard function [\texttt{getenv}][getenv] --
`char* getenv (const char* name)` -- which gives you the value of
an environment variable).

But a caller of `myfunc` will receive a pointer to memory which
has been reclaimed -- a "[dangling pointer][dangling-pointer]" --
and such a pointer results in undefined behaviour.

[getenv]: https://en.cppreference.com/w/c/program/getenv
[dangling-pointer]: https://en.wikipedia.org/wiki/Dangling_pointer

::: notes

- You don't even have to dereference the pointer -- the standard
  says "If an object is referred to outside of its
  lifetime, the behavior is undefined. The value of a pointer becomes indeterminate when
  the object it points to (or just past) reaches the end of its
  lifetime." (6.2.4)

:::

### dangling pointers

\footnotesize

::: block

#### myfile.c


![](images/danglingpointer.pdf){ width=70% }

:::

\small

Compilers will generally not warn you about this -- the above
code compiles with `gcc -pedantic -Wall -Wextra` with no warnings.

Code [static analyzers][static-analyzers] exist which *will* warn you --
more about them, later.

e.g. `clang-tidy myfile.c` will give the output

::: block

####

\scriptsize
\vspace{-1em}

```
1 warning generated.
myfile.c:4:3: warning: Address of stack memory associated with local
variable 'a_local_var' returned to caller [clang-analyzer-core.StackAddrEscapeBase]
  return a_pointer;
  ^
```

:::

[static-analyzers]: https://en.wikipedia.org/wiki/Static_program_analysis

### Dynamically allocated memory

- Data which we want to persist beyond the execution time of a function
  needs either to be global, or to be allocated in a region of memory
  called the \alert{heap}.
- Memory allocated on the heap is said to be "[dynamically
  allocated][dyn-alloc]"
- The primary C functions used to manage dynamic memory are
  - [\texttt{malloc}][malloc], for allocating memory, and
  - [\texttt{free}][free], for releasing it.

[dyn-alloc]: https://en.wikipedia.org/wiki/C_dynamic_memory_allocation
[malloc]: https://en.cppreference.com/w/c/memory/malloc
[free]: https://en.cppreference.com/w/c/memory/free

&nbsp;

::: block

####

\vspace{-0.5em}

```C
void *malloc(size_t size);
void free(void *ptr);
```

:::

::: notes

- and this also lets us allocate arrays for which
  we'll only know the size at run-time -- hence, "dynamic" \
  (as opposed to "static" -- the size of any global variable
  or automatic variable can be known at compile-time).

:::

### Dynamically allocated memory

::: block

####

\small
\vspace{-1em}

```C
#include <stdio.h>
#include <stdlib.h>

int* make_arr(int n) {
  int* arr = malloc(n * sizeof(int));
  return arr;
}
int main() {
  int n;
  printf("How big an array to allocate? ");
  scanf("%d",&n); // insecure, prefer scanf_s
  int* arr = make_arr(n);
  for(i = 0; i < n; i++)
    arr[i] = n;
  free(arr);
}
```

:::

\footnotesize
\vspace{-1em}

(See cppreference.com for details of [\texttt{scanf\_s}][scanf_s].)

[scanf_s]: https://en.cppreference.com/w/c/io/fscanf

### Dynamically allocated memory

- Once a pointer has been `free`d, using that pointer's value at all --
  even without dereferencing it -- is undefined behaviour.

  ::: block

  ####

  \small
  \vspace{-1em}

  ```C
  int *p = malloc(sizeof(int));
  free(p);
  if (p == NULL) {
    // ...
  ```

  :::

- So is calling `free` on a pointer more than once.

- Attempting to read from `malloc`ed memory before it has been
  initialized results in an "indeterminate value" -- not undefined,
  but almost certainly not what you want

::: notes

- malloc indeterminate - see C11, 7.22.3.4 The malloc function

:::

### Memory: call stack

On most architectures, calls to C functions work something like this:

- Every time a C function starts executing, space is allocated
  for its parameters and local variables on the [call stack][call-stack]
  - for each function that is entered, a [stack frame][stack-frame]
    gets pushed *on*to the call stack
  - the stack frame consists of enough memory to store the
    function parameters, local variables and a record of where to return
    to
  - when the function is exited, a stack frame gets taken
    *off* the call stack


[call-stack]: https://en.wikipedia.org/wiki/Call_stack
[stack-frame]: https://en.wikipedia.org/wiki/Call_stack

::: notes

- i.e. nothing in the C standard mandates this, it's just
  how most compilers do, in fact, work

:::

### Memory: call stack

```{=latex}
\begin{columns}
\begin{column}{6.2cm}
```


::: block

####

\scriptsize
\vspace{-1em}

```C
void draw_line(point* p1, point* p2){
 // ...
}
void draw_rect(point* topLeft, point* botRight){
 point p1 = {.x=topLeft->x, .y=topLeft->y };
 point p2 = {.x=botRight->x,.y=topLeft->y };
 draw_line(&p1, &p2);
 // ...
}
```

:::

```{=latex}
\end{column}
\begin{column}{5cm}
```

![](lect02-images/call-stack.svg){ width=108% }

```{=latex}
\end{column}
\end{columns}
```

### Memory: process memory layout


\footnotesize
The layout of a process's data in virtual memory looks something like
this.

```{=latex}
\begin{columns}[t]
\begin{column}{0.55\textwidth}
```


![](lect02-images/virt-mem.svg){ width=6.5cm }



```{=latex}
\end{column}
\begin{column}{0.45\textwidth}
```

\scriptsize

On Linux,
`\textcolor{verdant}{\fontfamily{fvm} cat /proc/\slshape some\_pid\normalfont/maps}`{=latex}
shows the virtual address space of a process. (Try
`\textcolor{verdant}{\fontfamily{fvm}cat /proc/self/maps}`{=latex}
to get the address space of
the `cat` process itself.)

&nbsp;

The \alert{text} segment is typically made *shareable*,
so that multiple processes can be run from one executable file and share
a single copy (safe, since it's read-only).




```{=latex}
\end{column}
\end{columns}
```



<!--
{ width=% }
-->


### Typedefs

C allows types to be given "aliases", using the `typedef` keyword.

The original type comes *first*, then the alias.

::: block

####

```C
typedef int colour;
```

:::

### Structs

\small

C provides `struct`s to create composite data types ("product types")
in which
a related set of variables can be grouped together in one contiguous
block of memory.

::: block

####

\footnotesize
\vspace{-1em}

```C
struct address {
  char * street_number;
  char * street_name;
  char * suburb;
  int postcode;
};
void my_func() {
  // we can initialize ...
  struct address some_addr = { // like this:
      "13a", "Cooper St", "Nedlands", 6009
  };
  struct address other_addr = { // or like this (since C99)
      .postcode = 6009, .suburb = "Nedlands",
      .street_number = "13a", .street_name = "Cooper St"
  };
}
```

:::

### Structs and typedefs

Often for convenience, a `struct` is combined with a typedef.

::: block

####

\footnotesize

```C
typedef struct { // define an anonymous struct
  char * street_number;
  char * street_name;
  char * suburb;
  int postcode;
} address; // and give it a name

// now we can just use "address", instead of
// "struct address".

void my_func() {
  address some_addr = { "13a", "Cooper St", "Nedlands", 6009 };
}
```

:::


::: notes

- but note: anonymous structs won't work for recursive
  data types (e.g. linked list node containing a ptr to
  a node).
- you need to make the struct non-anonymous:

  ```C
  typedef struct Node {
      struct Node* next;
      int data;
  } Node;
  ```
- also note that some coding style guides recommend
  against typedef-ing your structs, unless you want
  them to be opaque "handles" to some structure
  (and then, you'll often rather typedef a POINTER to a struct)

:::

### Struct members

::: block

####

\scriptsize

```C
typedef struct {
  char * street_number;
  char * street_name;
  char * suburb;
  int postcode;
} address;
```

:::

\small

`struct` members can be accessed using the "`.`" (member access)
operator.

If, rather than a struct, you have a *pointer* to a struct, you can use
the "`->`" (member access through pointer) operator.

::: block

####

\small

```C
void my_func(struct address a, struct address *pa) {
  printf("postcode of a: %d\n",  a.postcode);
  printf("postcode of pa: %d\n", pa->postcode);
}
```

:::


### enums

\small

C allows user-defined data types which assign meaningful names to
integral constants:

::: block

####

```C
enum shape_operation {
  draw = -1,
  move,
  delete = 4,
  hide
};
```

:::

Enumerated types are *integer types*, and so can be used anywhere
an integer could be. As a result, they offer no real *type safety*:
nothing distinguishes an `enum shape_operation` from (say) a
`signed int`.[^compatibility]

[^compatibility]: Each enumerated type is compatible with some *integral* type
  which can hold all the values, but it's implementation-defined
  what type that is.

### Unions

A C \alert{\texttt{union}} may hold *multiple* different types, of
different sizes -- but only one type at a time.

For instance, suppose we receive a "blob" of data from over the
network which represents a message. The first 8 bits (1 byte) are a code that
tell us what the rest of the
"blob" means:

- `0` indicates it's a double
- `1` indicates it's an int

### Unions

We could use the following to represent these messages:

::: block

####

```C
union double_or_int {
  double d;
  int i;
};

struct message {
  char message_type;
  union double_or_int;
};
```

:::

### Unions

::: block

####

\scriptsize
\vspace{-1em}

```C
union double_or_int {
  double d;
  int i;
};

struct message {
  char message_type;
  union double_or_int;
};
```

:::

\footnotesize
\vspace{-0.5em}
We can then correctly decode a message with code like this:

::: block

####

\footnotesize
\vspace{-1em}

```C
void decode_message(struct message * m) {
  if (m.message_type == 0) {
    double d = m->d;
    printf("It's a double: %f\n", d;
  } else if (m.message_type == 1) {
    int i = m->i;
    printf("It's an int: %d\n", i;
  }
}
```

:::

### Unions -- a problem

::: block

####

\scriptsize
\vspace{-1em}

```C
void decode_message(struct message * m) {
  if (m.message_type == 0) {
    double d = m->d;
    printf("It's a double: %f\n", d;
  } else if (m.message_type == 1) {
    int i = m->i;
    printf("It's an int: %d\n", i;
  }
}
```

:::

\footnotesize

We've *assumed* here that a `char` is 8 bits in size. And on every
reasonable platform available today, it is (but see [here][char-size]).

If we want to make sure, we can use C11's \alert{static assert} feature
to verify the size.

::: code

####

\scriptsize
\vspace{-1em}

```C
#include <assert.h>
#include <limits.h>
// This will be checked at compile time.
static_assert(CHAR_BIT == 8, "only works if a char is 8 bits");
```

:::

[char-size]: https://stackoverflow.com/questions/2098149/what-platforms-have-something-other-than-8-bit-char

::: notes

- `static_assert`: see
  <https://en.cppreference.com/w/c/language/_Static_assert>

:::

### Function pointers

\small

Pointers to *functions* can be passed around and used in C.

The syntax for function pointers is not especially pleasant.

::: block

####

\footnotesize
\vspace{-1em}

```C
// pointer to a void function taking an int
void (*func_ptr)(int);

void use_ptr(void (*p)(int)) {
  p(42); // call pointed-to function
}

void print_num(int n) {
  printf("the number is %d\n", n);
}

int main() {
  func_ptr = print_num;
  use_ptr(func_ptr);
}
```

:::

# Operating system services


### Privilege levels

```{=latex}
\begin{columns}[t]
\begin{column}[T]{5cm}
\begin{minipage}{5.5cm}
```

\footnotesize

Access to devices, particular data, or some CPU instructions
may be *protected* by hardware -- only sufficiently privileged code
(e.g. kernel code) may access them.

&nbsp;

(Why? Suppose all user applications could directly access the
disk hardware at any time. The filesystem would be in danger
of becoming corrupted. The OS manages orderly access to the
hardware.)

&nbsp;

For instance, Intel's processors provide 4 privilege levels,
conceptualized as rings, where inner rings are the most "trusted",
and outer rings the least.

```{=latex}
\end{minipage}
\end{column}
\begin{column}[T]{6cm}
~\vspace{2em}
```

![](lect02-images/priv_rings.svg){ width=108% }


```{=latex}
\end{column}
\end{columns}
```

### Privilege levels

A user application is normally executed at a low level of privilege,
and is prohibited from
accessing or modifying the memory of other
programs, or resources belonging to inner rings; attempting to do so
triggers a particular type of *fault* (which can be thought of
as a sort of "exception"), e.g. a [general protection fault][gen-prot-fault].

[gen-prot-fault]: https://en.wikipedia.org/wiki/General_protection_fault



### System calls

\alert{System calls} constitute the "API" of an operating system kernel --
they are the programmatic way to request a service from the kernel.

They allow code running in one of the outer levels (user programs)
to obtain a service from one of the inner levels.

An example system call:\
the `open` system call on Unix-like systems opens
a file for reading or writing.


::: block

####

```C
int open(const char *pathname, int flags, mode_t mode);
```

:::


### System calls

\small

From a programmer's point of view, system calls "look" like functions;
however, rather than having a normal function body, they typically
are implemented as assembly code routines, which do the following:

- store all the information the kernel needs to provide the requested
  service in a fixed location
- execute a "software interrupt", which causes the kernel to jump to
  an "interrupt handler", which examines the information provided
- the kernel executes some fragment of kernel code that provides
  the requested service
- control is then returned to the program that requested the service.

(For more details, refer to e.g.
<https://www.cs.montana.edu/courses/spring2005/518/Hypertextbook/jim/index.html>
or any operating systems textbook.)


# Vulnerabilities: buffer overflows

### Historical case: Morris worm

- Robert Tappan Morris, a graduate student at Cornell, created the
  "worm" in 1988 to see if it could be done
- It was a program intended to propagate slowly from host to host
  and measure the size of the Internet
- But due to coding errors on Morris's part, the worm
  created new copies as fast as it could, and infected
  machines became overloaded

\pause

- Morris was convicted under the Computer Fraud and Abuse
  Act, and sentenced to 3 years probation and 400 hours
  community service

::: notes

sources:

- wikipedia on morris worm
- <https://spaf.cerias.purdue.edu/tech-reps/823.pdf>
- <http://www.cs.unc.edu/~jeffay/courses/nidsS05/attacks/seely-RTMworm-89.html>

why historical cases?

- simpler: the Internet was less secure, hacks were simpler
  - e.g. web security is an arms race -- browser insecurity
    revealed, standards get added to and browsers more complex --
    can be tricky to explain all the details of a modern exploit
- usually provide *lots* of examples of things not to do

aside: accountability/non-repudiation

- check out the website GitHub repo at
  <https://github.com/cits3007/cits3007.github.io>
  and look at "commits" (top right of the center panel)

  - it records what changes I made to the website and lab
    sheets, and when ... or does it?
  - Actually, GitHub will let you do a `git push --force`, which
    "overwrites history" on the repo. And `git` will also quite
    happily let you set timestamps other than the current time, if you
    want
  - So public commits are *usually* a good record of what happened,
    but can be tampered with

:::

### Morris worm

The Morris worm used multiple vulnerabilities to copy itself
from host to host -- two are of interest to us.

- The worm exploited a bug in the `sendmail` program
- It exploited a buffer overflow in the `fingerd` network
  service


### Morris worm -- sendmail

- `sendmail` runs on a system and waits for other systems
  to connect to it and give it email for delivery
- It originated at a time when security was not a major consideration,
  and suffered from a number of security vulnerabilities
- At the time, most mail servers ran `sendmail`, and often allowed
  anyone to connect to it, from any other host \
  (i.e. there was little in the way of *authentication*
  or *integrity* protection)
- Configuration of `sendmail` was (and is) extremely complex --
  it's said many system administrators would rather write
  their own device driver than attempt to configure `sendmail`\
  (ideally, our software should make it *easy to do the right thing*)

::: notes

- see <https://spaf.cerias.purdue.edu/tech-reps/823.pdf>
- `sendmail` uses a baroque config format based on M4 macros.

:::

### Morris worm -- sendmail

- A feature which could be enabled in `sendmail` was a *debug mode* --
  a client program could connect to `sendmail` and issue the `DEBUG`
  command
- The client program would then provide an "email" message
  which, instead of email recipients, contained arbitrary commands
  to execute
  - the intention is to allow testers to use these commands to
    verify that email is being delivered correctly
- At the time, many vendors enabled this debug option by default\
  (i.e. used an *unsafe default*)
- The worm executed commands to copy itself over to the machine
  running `sendmail`, run itself, and start infecting new machines

### Morris worm -- fingerd

- A second avenue of attack was the `finger` service
- The `finger` service was once used to report information about
  a user on a host -- full name, office location, phone extension, etc
  - It is rarely run these days -- its place is filled by services
    like LDAP
    (the [Lightweight Directory Access Protocol][ldap]) -- UWA uses
    a version of this
- Like `sendmail`, the `fingerd` ("finger daemon") program runs in the
  background waiting for client programs to connect
- Like `sendmail`, `fingerd`  typically allowed anyone to connect

[ldap]: https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol

### Morris worm -- fingerd

`fingerd` used a function called `gets` to read the incoming
request.

If you type `man gets`, you will see the following


::: block

####

```
NAME
       gets - get a string from standard input (DEPRECATED)

SYNOPSIS
       #include <stdio.h>

       char *gets(char *s);

DESCRIPTION
       Never use this function.
```

:::

### Morris worm -- gets

::: block

####

\small

```
BUGS
       Never use gets().  Because it is impossible to tell
       without knowing the data in advance how many characters
       gets() will read, and because gets()  will  continue
       to store characters past the end of the buffer, it is
       extremely dangerous to use. It has been used to break
       computer security.  Use fgets() instead.

       For more information, see CWE-242 (aka "Use of Inherently
       Dangerous Function") at
       http://cwe.mitre.org/data/definitions/242.html
```

:::

And if you try to compile code containing `gets`, `gcc` will tell you

\small

`warning: the 'gets' function is dangerous and should not be used.`

### Morris worm -- gets

\small

[Rusty Russell][russell] (an Australian Linux kernel contributor)
proposed a [rating scheme][api-rating] for APIs ranging from +10 ("It's impossible
to get wrong") to -10 ("It's impossible to get right.").

::: block

####

\scriptsize

\begin{itemize}
\tightlist
\item [10.] It's impossible to get wrong.
\item [9.]  The compiler/linker won't let you get it wrong.
\item [8.]  The compiler will warn if you get it wrong.
\item [7.]  The obvious use is (probably) the correct one.

\end{itemize}

...

\begin{itemize}
\tightlist
\item [-7.]   The obvious use is wrong.
\item [-8.]   The compiler will warn if you get it right.
\item [-9.]   The compiler/linker won't let you get it right.
\item [-10.]  It's impossible to get right.
\end{itemize}

:::

The `gets` function falls firmly into the "-10" level.

So what's the issue?


[russell]: https://en.wikipedia.org/wiki/Rusty_Russell
[api-rating]: http://sweng.the-davies.net/Home/rustys-api-design-manifesto

### gets

The signature for `gets` is:


::: block


####

\footnotesize

```C
char *gets(char *s);
```

:::

It reads a line of input from the standard input stream.
The idea is that you pass it the address of a \alert{buffer} (array)
into which it should copy the line it read.

Here's an example of use:

::: block

####

\footnotesize
\vspace{-1em}

```C
#define BUFSIZE 512
// ...
char buf[BUFSIZE];
printf("Please enter your name and press <Enter>\n");
gets(buf);
```

:::

### gets

::: code

####

\footnotesize
\vspace{-1em}

```C
#define BUFSIZE 512
// ...
char buf[BUFSIZE];
printf("Please enter your name and press <Enter>\n");
gets(buf);
```

:::

The problem is that there is *no* way of telling `gets` how big the
buffer `buf` is. If there are more than 512 characters on the
line being read, `gets` doesn't stop -- it just keeps copying
characters into memory, past the end of `buf`.

As we saw when we discussed pointers, this is *undefined behaviour* --
at this point, there are no guarantees about what the program will do.

### buffer overflows

::: code

####

\footnotesize
\vspace{-1em}

```C
#define BUFSIZE 512
// ...
char buf[BUFSIZE];
printf("Please enter your name and press <Enter>\n");
gets(buf);
```

:::

So what will be sitting in memory after `buf`?

`buf` here is a local variable, sitting in the current stack frame.
After it come other local variables, so those will get overwritten;
and then the *return address*, the location in memory to go to once the
current function has finished; and then the parameters passed to the
current function.

### buffer overflows

::: code

####

\footnotesize
\vspace{-1em}

```C
#define BUFSIZE 512
// ...
char buf[BUFSIZE];
printf("Please enter your name and press <Enter>\n");
gets(buf);
```

:::

If you're sending a message to the `fingerd` process, and you know
the structure of its stack frame, you can deliberately overwrite the
return address so that execution jumps to code of your choosing
(known as "smashing the stack").

In fact, the data you send could include instructions for
executing some arbitrary program (e.g. the shell), and you could
force the program to jump to the instructions you just wrote.

### buffer overflows

At least, that's how the stack could be exploited at the time
the Morris worm was written.

On modern machines, there are several protections in place
against this sort of attack:

- stack canaries
- address-space layout randomisation (ASLR)
- write XOR execute permissions
- source fortification

More on these next week!


::: notes

- **stack canaries**: Known data injected between the local
  variables and the return address. Before returning, the function
  checks that this "stack canary" has the right value (which it
  won't if we overwrote it with gibberish).
- **address-space layout randomisation** (ASLR): where functions
  and library end up in memory is *randomized* by the kernel.
  As a result, it's no longer easy for an attacker to know *where*
  to tell the program to jump to.
- **write XOR execute** permissions: the process's memory is
  marked as either writeable (e.g. the stack), *or* executable
  (e.g. the text segment -- the program instructions), but never both.
  Hence an attacker can't execute instructions placed in stack memory.
- **source fortification**: when known unsafe functions (like `gets`)
  are called, the compiler adds code which calculates the size of the
  destination buffer and checks at runtime that no more than that
  many bytes are written (else the program will abort).

:::

### References


- Karger, P. A., and R. R. Schell. "Thirty Years Later: Lessons from the
  Multics Security Evaluation." 18th Annual Computer Security Applications
  Conference, 2002. Proceedings., IEEE Comput. Soc, 2002, pp. 119–26,
  <https://doi.org/10.1109/CSAC.2002.1176285>.

::: notes

- why are there references? for my benefit, not yours --
  it's so I know where the information is from (and where an
  inaccuracy came from, if it's not my own)

:::

<!--
  vim: tw=72 :
-->
