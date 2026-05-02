import './App.scss';

import profilePicture from './assets/picture.png'
import favicon from './assets/icon.ico'
import nightModeIcon from './assets/icons8-night-mode-64.png'
import githubIcon from './assets/github-mark/github-mark.svg'
import emailIcon from './assets/email.png'
import replitIcon from './assets/replit-logo.png'
import linkedinIcon from './assets/LI-In-Bug.png'

import foxtrotDemo from './assets/fxt2.webm'
import satVis from './assets/SatelliteVis.webm'
import waterMovement from './assets/watermovement3.webm'

import peachDemo from './assets/peach.mov'
import acheronTunnel from './assets/acheron-tunnel.png'
import hyperionDemo from './assets/ddgi.gif'
import belterDemo from './assets/belter-video.mp4'
import vmDemo from './assets/vm-hello-world.mov'
import asmDemo from './assets/asm-code-screenshot2.png'
import websiteDemo from './assets/website-screenshot2.png'
import godotMovementDemo from './assets/godot-movement.webm'

import pistolModel from './assets/pistol-model.png'

import { useState, useEffect, useRef } from 'react'

const ReactiveContainer = (props) => {
  return (
    <div className={`hp-flex-row hp-tablet-flex-col hp-hero-box ${props.className}`}>
      {props.children}
    </div>
  )
}

const RefLink = (props) => {
  return (
    <a href={props.href} className='hp-ref-link'>[{props.text}]</a>
  );
}

// function VideoComponent({...props }) {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const elem = videoRef.current;

//     if (!elem) {
//       return;
//     }
//     elem.muted = true;
//     elem.defaultMuted = true;
//   }, []);

//   return <video ref={videoRef} muted={true} {...props}  />;
// }

const ProjectVideo = (props) => {
  return (
    <video src={props.src} loop playsInline autoPlay muted alt={props.alt} />
  );
}



const ProjectCard = (props) => {
  return (
    <div className='hp-dark-container hp-project-card'>
      <ReactiveContainer>
        <div className='hp-flex-col hp-title-description-box'>
          <div className='hp-flex-col '>
            <h1 className='hp-title-chunky hp-color-title'>{props.title}</h1>

            {props.links && <div className='hp-flex-row'>
              {props.links['github'] && <a href={props.links['github']} className='hp-social-link'>
                <img className='hp-link-icon-light' src={githubIcon} width='30px' height='30px'></img>
              </a>}

              {props.links['replit'] && <a href={props.links['replit']} className='hp-social-link'>
                <img className='hp-link-icon-light' src={replitIcon} width='30px' height='30px'></img>
              </a>}
            </div>}
          </div>
          {props.description}

        </div>
        <div className='hp-project-card-content'>
          {props.content}
          <p><i>{props.contentCaption}</i></p>

          <div>
            {props.content2}
            <p><i>{props.contentCaption2}</i></p>
          </div>
        </div>

      </ReactiveContainer>
    </div>
  );
}

const SocialLink = (props) => {
    return (
        <a href={props.link} target="_blank" className='hp-social-link'>
            <img className={'hp-link-icon ' + props.className} src={props.icon} height='30px'></img>
        </a>
    );
}

const ProfileContainer = () => {
  return (
    <ReactiveContainer>
      <div className=''>
        <div className='hp-basic-container hp-profile-container'>
          <div className='hp-phone-flex-col hp-tablet-flex-row hp-flex-col hp-hero-box hp-center-x'>
            <div className='hp-flex-col hp-phone-center-x'>
              <img className='hp-no-margin hp-phone-center-x hp-profile-picture' src={profilePicture}></img>
            </div>

            <div className='hp-flex-col'>
              <div>
                <div className='hp-profile-text hp-no-padding hp-no-margin'>
                  <b>Game Engine</b> programmer
                  <p>Experienced with <b>Vulkan</b>, <b>C++</b>, and writing <b>NEON</b> and <b>SSE</b> optimized code.<br />
                  (check out my <a href="https://blog.ethanm.ca/2026/01/simd-or-not-to-be.html">blog post on SIMD!</a>)<br/>

                  </p>
                </div>
                <div className='hp-flex-row hp-margin-top-2'>
                  <SocialLink icon={githubIcon} link='https://www.github.com/emd22/'/>
                  <SocialLink icon={emailIcon} link='mailto:e@ethanm.ca'/>
                  <SocialLink icon={linkedinIcon} className='hp-rounded-0' link='https://www.linkedin.com/in/emd22'/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='hp-flex-one'>
        <div className='hp-light-container'>
          <h1>About Me</h1>
          <p>
            I am a programmer from Nova Scotia, Canada, currently waiting for my graduation for a Bachelor of Computer Science. I spend most of my time working on my FPS game <a href='https://github.com/emd22/foxtrot'>Foxtrot</a> and its custom game engine, as well as <a href="https://github.com/notomorrow/hyperion-engine">Hyperion Engine</a> with my brother.
          </p>

          <p>I am passionate about graphics and low-level programming, and experienced with writing optimized C++.<br />

          </p>

            <h1>Skills</h1>
          <ul>

            <li>
              Developed
              <b> game engines</b>,
              <b> programming languages</b>, <b>operating systems </b>
            as well as <b>virtual machines</b> for personal projects, and to expand my learning.
            </li>
            <li>Very experienced with <b>Godot engine</b>, and used <b>Unity</b> for game development courses in university.</li>
            <li>Experienced with many programming languages including <b>C++</b>, <b>C#</b>, <b>Zig</b>, and <b>Golang</b>. </li>
            <li>Work experience as a <b>full-stack web developer</b>, as well as developing <b>Unreal Engine 4 and 5 plugins and tools</b>.</li>
          </ul>
        </div>
      </div>
    </ReactiveContainer>
  );
}


function App() {
  const checkIfDarkMode = () => {
    let usesDarkTheme = localStorage.getItem("darkTheme");

    if (usesDarkTheme == null) {
      // Get if the OS is set to dark mode
      usesDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem("darkTheme", usesDarkTheme);
      return usesDarkTheme;
    }
    else {
      // Convert value to bool
      usesDarkTheme = usesDarkTheme === 'true';
    }

    return usesDarkTheme;
  }


  const [darkMode, setDarkMode] = useState(checkIfDarkMode());

  useEffect(() => {
    document.body.classList.toggle('darkMode', darkMode);
    localStorage.setItem("darkTheme", darkMode);
  }, [darkMode]);

  return (
    <div className='App'>
      <header className='hp-app-header hp-flex-row hp-space-between'>
        <h1 className=''>ethan macdonald</h1>
        <button className='hp-theme-button hp-center-y ' onClick={() => setDarkMode(!darkMode)}>
          <img className='hp-no-margin hp-link-icon' alt='toggle dark mode' src={nightModeIcon} width='32px' height='32px'></img>
        </button>
      </header>

      <div className='hp-content-container'>
        <div className='hp-main-content'>

          <section>
            <ProfileContainer/>
          </section>


          <section className='hp-project-section'>
            <h1 className='hp-title-chunky hp-no-margin hp-section-title'>Projects</h1>

            <ProjectCard
              title='Foxtrot'
              links={{
                'github': 'https://github.com/emd22/foxtrot'
              }}
              description={
                <div>
                  <p>
                    Foxtrot is an in-development FPS with a custom game engine written in C++.
                    It has a Vulkan backend, a custom memory pooling system, multithreaded asset loading and integrates with Jolt physics. All objects here are loaded from a project file defined in a custom config language, and streamed in asynchronously.
                    <br/>

                  </p>
                  <p>As well, Foxtrot has an in-house scripting language and a SSE+AVX and Arm NEON optimized math library.</p>
                </div>
              }

              content={
                <ProjectVideo src={foxtrotDemo} alt={'Demo of player movement and physics in Foxtrot'} />
              }
              contentCaption='Movement and the basic in-game editor'
            />

            <ProjectCard
              title='Satellite Visualization'
              links={{
                'github': 'https://github.com/emd22/satellite'
              }}
              description={
                <div>
                  <p>
                    For a final project in a visualization course I was tasked with building an interactive visualization using openly accessible data.

                  </p>
                  <p>
                    Future positions and velocities are estimated with SGP4 and precomputed into keyframes. These keyframes are interpolated and combined with data loaded from satellite catalogues.
                  </p>
                </div>
              }

              content={
                <ProjectVideo src={satVis} alt={'Earth with a visualization of satellites and debris orbiting'} />
              }
              contentCaption='Visualization of debris and satellites'
            />



            <ProjectCard
              title='Godot Water Demo'
              links={{
              }}
              description={
                <div>
                  <p>
                    Tried to recreate the aesthetic of deep-sea underwater camera footage, and learned a ton of 3d modelling tricks here. This was built using the C# backend for Godot and did some cool lighting tricks by faking a layered fog, and had a few different movement systems for swimming, ladders, and seated.
                  </p>
                </div>
              }

              content={
                <ProjectVideo src={waterMovement} alt={'Demo of an FPS player controller with openable doors and a flashlight'} />

              }
              contentCaption='Showing off movement types, particles and water effects'
            />

            <ProjectCard
              title='Godot FPS Movement'
              links={{

              }}
              description={
                <div>
                  <p>
                    Using Godot, I worked on a horror game movement system in C#.
                  </p>
                  <p>This has head bob, click and drag to open doors a variable amount, sprint, jump and a basic player attachment system.</p>
                </div>
              }

              content={
                // <video src={godotMovementDemo} autoPlay loop alt='demo of the realtime DDGI in Hyperion engine'></video>
                <ProjectVideo src={godotMovementDemo} alt={'Demo of an FPS player controller with openable doors and a flashlight'} />

              }
              contentCaption="Movement demo with interactable objects and a crude blockout"
            />

            <ProjectCard
              title='Hyperion Engine'
              links={{
                'github': 'https://github.com/notomorrow/hyperion-engine'
              }}
              description={
                <div>
                  <p>
                    A modern Vulkan game engine. Supports multithreaded rendering, VCT, DDGI, raytracing, and much more.
                  </p>
                  <p>Built with my brother Andrew(<a href='https://github.com/ajmd17'>@ajmd17</a>), we are currently working towards building a game with Hyperion.</p>
                </div>
              }

              content={
                <img src={hyperionDemo} alt='demo of the realtime DDGI in Hyperion engine'></img>
              }
              contentCaption='Andrew showing off the realtime DDGI system in Hyperion'
            />



            <ProjectCard
              title='Acheron Engine'
              links={{
                'github': 'https://github.com/emd22/acheron'
              }}
              description={
                <div>
                  <p>
                    Acheron was a 3D OpenGL game engine written completely in C99. This was my main project while I was going through high school, and helped me learn a lot about 3d rendering.
                  </p>
                  <p>Acheron was a way to learn more about how game engines work internally as well as learn how to structure large projects in C.</p>
                </div>
              }

              content={
                <img src={acheronTunnel}></img>
              }
              contentCaption='multiple point lights around a normal mapped cube in a train tunnel.'
            />
          </section>
          <section className='hp-project-section'>
            <h1 className='hp-title-chunky hp-no-margin hp-section-title'>Other things</h1>
            <ProjectCard
              title='3d modelling'
              links={{
              }}
              description={
                <div>
                  <p>
                    Using Blender and Substance Painter, I modelled and textured this pistol using multiple real-life image references to make a modular pistol for using in games.
                  </p>
                  <p>
                    This sits at about 760 triangles total, with the whole GLTF model (including textures) being about 410 KiB.
                  </p>
                  {/* <ProjectLinks github='https://www.github.com/emd22/' replit='https://replit.com/@mynameisjonas/jam2020#README.md'/> */}
                </div>
              }

              content={
                  <img src={pistolModel} alt='an image of the website you are currently on'></img>
                // <div></div>
              }
              contentCaption=''
            />
            <ProjectCard
              title='Peach Language'
              links={{
                'replit': 'https://replit.com/@mynameisjonas/jam2020#README.md',
                'github': 'https://www.github.com/emd22/jam2020',
              }}
              description={
                <div>
                  <p>
                    For a programming language jam from Repl.it in 2020, me and Andrew(<a href='https://github.com/ajmd17'>@ajmd17</a>) wrote PEACH in <b>less than a week</b>.
                  </p>
                  <p>
                    PEACH is a prototypical interpreted language that is written in Python. Shown in the clip here is a mandlebrot fractal visualizer that I wrote <b>completely</b> in PEACH (<a href='https://github.com/emd22/jam2020/blob/master/mandle.peach'>link!</a>).
                  </p>
                  <p>Unfortunately, the original submission thread has been removed over the years.</p>
                  {/* <ProjectLinks github='https://www.github.com/emd22/' replit='https://replit.com/@mynameisjonas/jam2020#README.md'/> */}
                </div>
              }

              content={
                <ProjectVideo src={peachDemo} type={ "video/mp4" } alt={'A terminal slowly printing the mandlebrot fractal, written in the PEACH language.'} />

                // <video src={peachDemo} width='300px' autoPlay loop muted alt='a video of a terminal generating the mandlebrot fractal, written completely in PEACH.'></video>
                // <div></div>
              }
              contentCaption='(slowly) generating the mandlebrot fractal in PEACH'
            />

            <ProjectCard
              title='X16 Macro Assembler'
              links={{
                'github': 'https://github.com/emd22/x16'
              }}
              description={
                <div>
                  <p>
                    A custom CPU architecture, macro assembler, and VM written as a challenge to write the smallest assembler and VM that is still easy to program for.
                  </p>

                  <p>
                    For this project, the assembler is programmed in Python, and the VM is programmed in C. It runs blazingly fast, and has a bunch of cool features!
                  </p>
                </div>
              }

              content={
                  <ProjectVideo src={vmDemo} alt={'demo of the VM running in debug mode, printing "Hello, World"!'} />
              }

              contentCaption='Demo of the VM running with a slow step speed printing "Hello, World"!'

              content2={<img src={asmDemo} alt='demo of the realtime DDGI in Hyperion engine'></img>}

              contentCaption2='Full program written in the custom assembler language'
            />
            <ProjectCard
              title='Belter'
              description={
                <div>
                  <p>Belter was a fun side project to try out Dart and Golang. It was an audio-focused social network that allowed you to share audio clips with friends.</p>
                </div>
              }

              content={
                <video src={belterDemo} autoPlay loop muted alt='demo of the belter app, signing in and going through multiple menus, and scrolling through posts.'></video>
              }
              contentCaption='Demo of Belter on macOS'
            />
            <footer className='hp-footer hp-center-x hp-flex-col hp-center-text'>
              <div className=''>&copy; { new Date().getFullYear()} Ethan MacDonald</div>
              <div className=''><a target="_blank" href='https://icons8.com/icon/uKugxlcnkh3u/night-mode'>Night</a> icon from <a target="_blank" href="https://icons8.com">Icons8</a>, <a href="https://www.flaticon.com/free-icons/gmail" title="email icons">Email icon</a> created by rukanicon, on Flaticon</div>
            </footer>
          </section>
        </div>
      </div>


    </div>
  );
}

export default App;
