import './App.scss';

import profilePicture from './assets/picture.png'
import nightModeIcon from './assets/icons8-night-mode-64.png'
import githubIcon from './assets/github-mark/github-mark.svg'
import emailIcon from './assets/email.png'
import replitIcon from './assets/replit-logo.png'

import peachDemo from './assets/peach.mov'
import acheronTunnel from './assets/acheron-tunnel.png'
import hyperionDemo from './assets/ddgi.gif'
import belterDemo from './assets/belter-video.mp4'

import { useState, useEffect } from 'react'

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

const ProjectCard = (props) => {
  return (
    <div className='hp-dark-container hp-project-card'>
      <ReactiveContainer>
        <div className='hp-flex-col'>
          <div className='hp-flex-col'>
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
        <div className='hp-flex-col hp-project-card-content'>
          {props.content}
          <p><i>{props.contentCaption}</i></p>
        </div>
      </ReactiveContainer>
    </div>
  );
}

const ProfileContainer = (props) => {
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
                {/* <h1 className='hp-profile-text hp-no-padding hp-no-margin'>ethan macdonald</h1> */}
                <p className='hp-profile-text hp-no-padding hp-no-margin'>
                  <b>baremetal</b> programmer, <b>3d rendering</b> developer, and <b>full-stack</b> web.<br/><br/>
                  currently a full-time student at Dalhousie University.
                </p>
                <div className='hp-flex-row hp-margin-top-2'>
                  <a href='https://www.github.com/emd22/' className='hp-social-link'>
                    <img className='hp-link-icon' src={githubIcon} width='30px' height='30px'></img>
                  </a>
                  <a href='mailto:e@ethanm.ca' className='hp-social-link'>
                    <img className='hp-link-icon' src={emailIcon} width='30px' height='30px'></img>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='hp-flex-one'>
        <div className='hp-light-container'>
          <h1>about me</h1>
          <p>I am a software developer from Nova Scotia, Canada. I have over <b>9 years of experience</b> programming and working on projects. I am currently taking a Bachelors of Computer Science at Dalhousie University.</p>

          <ul>
            <h2>some quick info</h2>

            <li>
              developed <b>operating systems</b> and drivers,
              <b> game engines</b>, 
              <b> programming languages</b>, 
              as well as <b>virtual machines</b> for personal projects, and to expand my learning.
            </li>
            <li>work experience as a <b>full-stack web developer</b>, as well as developing <b>Unreal Engine 4 and 5 plugins and tools</b>.</li>
            <li>worked with Linux for over <b>7 years</b> as a desktop operating system, as well as headless as a server.</li>
            <li>web and app development experience with <b>Node.js</b>, <b>React</b>, <b>Go</b>, <b>Dart + Flutter</b>, and much more.</li>
            <li>negative letter spacing addict</li>
          </ul>
        </div>
      </div>
    </ReactiveContainer>
  );
}


function App() {
  const checkIfDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [darkMode, setDarkMode] = useState(checkIfDarkMode());

  useEffect(() => {
    document.body.classList.toggle('darkMode', darkMode);
  }, [darkMode]);
  
  return (
    <div className='App'>
      <header className='hp-app-header hp-flex-row hp-space-between'>
        <h1 className=''>ethan macdonald</h1>
        {/* <h1 className=''>et</h1> */}
        <button className='hp-theme-button hp-center-y ' onClick={() => setDarkMode(!darkMode)}>
          <img className='hp-no-margin hp-link-icon' src={nightModeIcon} width='32px' height='32px'></img>
        </button>
      </header>

      <div className='hp-content-container'>
        <div className='hp-main-content'>

          <section>
            <ProfileContainer/>
          </section>


          <section className='hp-project-section'>
            <h1 className='hp-title-chunky hp-no-margin hp-section-title'>projects</h1>
            <ProjectCard 
              title='hyperion engine'
              links={{
                'github': 'https://github.com/notomorrow/hyperion-engine'
              }}
              description={
                <div>
                  <p>
                    A modern vulkan game engine written completely from the ground up. Supports multithreaded rendering, VCT, DDGI, raytracing, and much more.
                  </p>
                  <p>Built with my brother Andrew(<a href='https://github.com/ajmd17'>@ajmd17</a>), we've been working on this engine for the past 4 years and constantly implementing new technologies and features.</p>
                  <p>I'm currently working on a level/game editor with a highly modified version of WxWidgets!</p>
                </div>
              }
            
              content={
                <img src={hyperionDemo}></img>
              }
              contentCaption='Andrew showing off the realtime DDGI system in Hyperion'
            />
            <ProjectCard 
              title='belter'
              description={
                <div>
                  <p>
                    An audio focused <b>social media network</b>. Have a conversation with your friends, shout to the world, or just have fun.
                  </p>
                  <p>
                    This project was started in <b>November 2023</b> to learn more about a few technologies that i've always wanted to give a try. I wrote the backend and API
                    completely in <b>Go</b> and the frontend in <b>Dart</b>, using <b>Flutter</b> as the UI framework. Using Dart makes it much easier to have a consistent 
                    UI look over multiple platforms, and only have to worry about one codebase.
                  </p>
                </div>
              }
            
              content={
                <video src={belterDemo} width='300px' autoPlay loop muted></video>
              }
              contentCaption='a video of belter in action, demoed on MacOS.'
            />
            <ProjectCard 
              title='acheron engine'
              links={{
                'github': 'https://github.com/emd22/acheron'
              }}
              description={
                <div>
                  <p>
                    A 3D OpenGL game engine written completely in C99 for speed, and to learn plain ANSI C better.
                  </p>
                  <p>Acheron was a way to learn more about how game engines work internally, through one of the lowest level languages.</p>
                </div>
              }
            
              content={
                <img src={acheronTunnel}></img>
              }
              contentCaption='multiple point lights around a bumpy textured cube in a train tunnel.'
            />
          </section>
          <section className='hp-project-section'>
            <h1 className='hp-title-chunky hp-no-margin hp-section-title'>other cool things</h1>
            <ProjectCard 
              title='peach language'
              links={{
                'replit': 'https://replit.com/@mynameisjonas/jam2020#README.md',
                'github': 'https://www.github.com/emd22/',
              }}
              description={
                <div>
                  <p>
                    For a programming language jam from Repl.it in 2020, me and Andrew(<a href='https://github.com/ajmd17'>@ajmd17</a>) wrote PEACH in <b>less than a week</b>.
                  </p>
                  <p>
                    PEACH is a prototypical interpreted language that is written in Python <b>from scratch</b>. Shown in the clip here is a mandlebrot fractal visualizer that I wrote <b>completely</b> in PEACH (<a href='https://github.com/emd22/jam2020/blob/master/mandle.peach'>link!</a>).
                  </p>
                  <p>Unfortunately, the original submission thread has been removed over the years.</p>
                  {/* <ProjectLinks github='https://www.github.com/emd22/' replit='https://replit.com/@mynameisjonas/jam2020#README.md'/> */}
                </div>
              }
            
              content={
                <video src={peachDemo} width='300px' autoPlay loop muted></video>
                // <div></div>
              }
              contentCaption='(slowly) generating the mandlebrot fractal in PEACH'
            />
            <footer className='hp-footer hp-center-x hp-flex-col hp-center-text'>
              <div className=''>&copy; 2024 Ethan MacDonald</div>
              <div className=''><a target="_blank" href='https://icons8.com/icon/uKugxlcnkh3u/night-mode'>Night</a> icon from <a target="_blank" href="https://icons8.com">Icons8</a>, <a href="https://www.flaticon.com/free-icons/gmail" title="email icons">Email icon</a> created by rukanicon, on Flaticon</div>
            </footer>
          </section>
        </div>
      </div>

      
    </div>
  );
}

export default App;
 