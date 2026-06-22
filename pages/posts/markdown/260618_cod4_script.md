# Introduction

# Call of Duty 4: Modern Warfare

The design of this scripting language is to be as simple as possible while being flexible for scripters and map designers.

The IW scripting language appears to have originated back from Medal of Honor, which itself seems to be a heavily modified version of the language found in Ritual Entertainment's [Ubertools](http://www.ritualistic.com/games/ef2/gdkdocs/content/scripting_syntax.html). Example from [Medal of Honor](https://code.idtech.space/2015/mohaa-sdk/src/branch/master/m4l0/m4l0.scr).

Maps in the game are defined by CSV files, which contain a list of linked assets, scripts and shaders.

The script files are compiled to a bytecode and then linked with local assets such as shaders and materials. These assets are all bundled together into a compressed archive, called a [FastFile](https://wiki.zeroy.com/index.php?title=Call_of_Duty_4:_FastFile_Format).

CoD4 uses the `.gsc` file extension for most scripts, but this file type was reserved in later titles for server-side specific scripts which execute on the hosts PC or console.

Later Call of Duty titles such as World at War and Black Ops also added "client-side" `.csc` files, which are executed on the connected users and the host independently.

## Syntax

Variables defines in scripts are loosely typed and defined implicitly.

```
some_int = 20;
some_double = 1.5;
some_string = "Hello, World";
some_assignment = some_int;
```

Functions are defined in a similarily simple way:

```
some_function()
{
    return 0;
}
```

There are also many keywords to ease the development of missions.

The `thread` keyword calles the function asynchronously and continues execution.

```
thread battlechatter_on("allies");
self thread some_long_function();
```

There is also an event system that allows waiting and signalling for states.

```
some_ent = getent("entname", "entkey");
if (!isdefined(some_ent)) {
    assertmsg("entity not found");
    return;
}

// Note that output_ent will be defined as its passed in here


some_ent waittill("trigger", output_ent);

// Notify the entity with the output ent
level notify("entname", output_ent);
```

There is also the wicked ability to call other script's functions without including them:

```
maps\_javelin::init();
```

## Additional Sources

[Metal of Honor SDK](https://code.idtech.space/ea-la/mohaa-spearhead-sdk)

[WaW Scripting Guide](https://wiki.ugx-mods.com/Modding/World-at-War-Modtools/Script/Scripting-Guide)

[Object Floating Script](https://code.idtech.space/iw/cod4-sdk/src/branch/master/raw/maps/_float.gsc)

[Community-made Reference](https://wiki.zeroy.com/index.php?title=Call_of_Duty_4:_CoD_Script_Handbook)
