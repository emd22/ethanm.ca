Unreal Engine has always had C++ as a primary programming language alongside a scripting language but for many gameplay systems as well. From UE1 to UE3, Unreal had a custom scripting language called UnrealScript. Around the release of UE4 (2014ish) Epic Games unveiled Blueprints, a visual scripting language, which up until recently was the defacto for many developers.

Verse tries to take a user-friendly approach to new programmers who wish to learn how to program gameplay systems. Using a text-based language seems to also play into Epic Game's hard-on for generative AI.

# UnrealScript (UE1 - UE3)

UnrealScript is not much different from other game specific scripting languages, such as the scripting language in the Call of Duty game engines.

```
function Initialize(int NumberOfBots)
{
    local int i;
    local int NumSuccesses = 0;

    for (i = 0; i < NumberOfBots) {
        if (SpawnBot()) {
            NumSuccesses++;
        }
    }

    return NumberOfBots;
}
```

ConVersely, the same basic script in Verse looks like this:

```
Initialize(NumberOfBots : int) : int =
    var NumSuccesses : int = 0;

    # Seems like `I` is redefined as a constant per iteration.
    for (I := 0..NumberOfBots):
        success : logic = SpawnBot()
        if (success?):
          set NumSuccesses = NumSuccesses + 1

    # Return the number of successes
    NumSuccesses
```

# Syntax

Variables are lovingly inconsistent compared to other languages commonly used for gameplay programming. Mutable variables are defined with a `var` keyword, a la Javascript, while constants omit the keyword altogether. But how would you accurately and concisely describe an assignment? By using a `set` keyword!

```
var Text : string = "This is some text"
MaxHealth : float = 100.0

set Text = "What the hell"
```

## Functions, Blocks and Conditionals

Who likes braces anyway? nested blocks should be hard to read and reliant on your text editor's settings!

Have you ever looked at a large codebase and realized that some developers don't adhere to the style of the rest of the project? Well in Verse, tabs are not premitted and indentation MUST be 4 spaces.

Imagine a 3-space warrior pushes up a new script to Perforce last minute and breaks a critical feature of your game. Thats what we like to see!

```
if (Value = 20):
    if (SomeValue > 10):
        Print("Foo")
    else:
        Print("Bar")
```

And there is lovely syntax to go along with this when writing functions.

```
SimpleFunction() : float =
    var LocalVariable : float = 10.0
    # This is the only way to return a value in a function
    LocalVariable

# Where these becomes even better:
OtherFunction() : float =
    ConstToReturn : float = 25.0
    var SomeValue : float = SimpleFunction()

    if (SomeValue < 10):
        # This returns `SomeValue` as a result
        return

    # This returns `ConstToReturn`.
    ConstToReturn
```

And even better, classes forego the previously set out syntax rules with a typeless, bizarre keyword and whitespace reliant combo that could make any programmer weep.

```
worker := class:
    # Class members
    Name : string
    NetWorth : float = 10.0

    # Function definition
    Earn(Amount : float) : void =
        set NetWorth = NetWorth + Amount
```

## Booleans

Designing a language is hard. Luckily there are thousands of languages out there to give you inspiration when designing your own. The design of Verse shows no evidence of this approach.

Booleans are not named booleans in Verse. The type is called `logic`, but the name is anything but logical.

```
var What : logic = false
set What = true
```

And to make matters worse, the if statements require that logic operations end with a free-of-charge question mark.

```
if (ThisIsStupid?):
    DoWhatever()
```

[IR Generator](https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Source/Runtime/VerseCompiler/Private/uLang/SemanticAnalyzer/IRGenerator.cpp)
