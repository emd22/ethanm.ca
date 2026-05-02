import React from 'react';

import { ReactiveContainer, BlogContainer } from './Components';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import GameScriptSyntax from './syntax/gamescript';
import SyntaxTheme from './syntax/theme'

SyntaxHighlighter.registerLanguage('GameScript', GameScriptSyntax);


const PostCard = (props) => {
  return (
    <div className='hp-dark-container hp-project-card'>
      <BlogContainer>
        <h1>{ props.title }</h1>

        <div className='hp-blog-content'>
          {props.content}
        </div>

      </BlogContainer>
    </div>
  );
}




const BlogPost = (props) => {

  const sourceBlock =
    `// Demo.SCR
func SomeOperation(int A, int B, int C) -> int
{
 	int result = (A + B) * C;
 	return result;
}

// e.g SomeOperation(2, 5, 3) -> 7 * 3 = 21.`;

  const bytecodeBlock = `
    // Demo.BC
    FUNC SomeOperation
     	// STACK = {2, 5, 3}

     	// Load 'C' on the stack into LOCAL0
     	LOCAL0

     	// STACK = {2, 5}

     	// As A and B are already on the stack, we can add them without
     	// popping, saving two opcodes and two fetches.
     	ADD

     	// STACK = {7}

     	// Push 'C' back onto the stack
     	PUSH LOCAL0

     	// STACK = {7, 3}

     	// Multiply the result by C (value of 3)
     	MUL

     	// STACK = {21}


     	// If we have an optimization pass, we could figure out that
     	// the result is the last thing on the stack. But generally
     	// that will not always be the case.

     	// Because of this, we will load the result into some temporary
     	// variable.
     	LOCAL0

     	// ... Do remaining operations ...

     	// Save the result onto the stack for the return value.
     	PUSH LOCAL0

     	RETURN
    ENDFUNC
  `;


  return (
    <div className='hp-dark-container hp-project-card'>
      <BlogContainer>
        <h1>{props.title}</h1>

        <div className='hp-blog-content'>
          <h2>Preface</h2>
          First of all I want to clarify I am in no means a professional with game development or programming languages, but through tons of trial and error decided to write down some notes that other people might find helpful.

          ## Custom or General Purpose Language?
          Should a game use a language like Lua, C#, or another general purpose language or spend the time developing a fully custom language?

          As everything with game development, it fully revolves around you or your team's wants and/or needs. An established studio might have trouble hiring someone who is able to work with a custom language or even maintain the codebase, which might lead them to choose something more general. As well, a scripting language requires comprehensive documentation to be suitable for a large team, so that might be another scenario that would be avoided by using a general purpose language.

          One of the main questions here is: **Do you need X feature to be able to write Y?**
          For many scenarios you might find out you actually need less language features than you think.

          As well, there is no contest in being able to modify a scripting language at any point and having the VM directly integrated with the game engine. This can be invaluable when it comes to customizability, debugging script behaviour or monitoring states.

          As well, with a custom scripting language you can _enforce or expect_ the programmer to write the scripts in a particular way which can lead to the potential for additional optimizations.

          For example,


          <div className='hp-code-blocks'>
            <SyntaxHighlighter className='hp-code-block' language='GameScript' style={ SyntaxTheme }>
              { sourceBlock }
            </SyntaxHighlighter>


          </div>
        </div>

      </BlogContainer>
    </div>
  );


}






export function Blog() {
  return (
    <>
      {/* <PostCard title={ 'Title' } content={"Hello, world" } />*/}
      <BlogPost />
    </>
  );
}
