// import logo from './logo.svg';
import './App.scss';

import { useState, useEffect } from 'react'

// import LasEnterFont from './las-enter-font/LasEnterPersonalUseOnly-D301.ttf';

// let isDark = true;

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

const RefCollection = (props) => {
  return (
    <div className='hp-ref-link'>
      {props.links.map((link, index) => {
        return link;
      })}
    </div>
  );
}

const ProjectCard = (props) => {
  return (
    <div className='hp-dark-container hp-project-card'>
      <ReactiveContainer>
        <div className='hp-flex-col'>
          <h1 className='hp-title-chunky hp-color-title'>{props.title}</h1>
          {props.description}
        </div>
        <div className='hp-flex-col'>
          {props.content}
          <p><i>{props.contentCaption}</i></p>
        </div>
      </ReactiveContainer>
    </div>
  );
}

// const setDarkMode = () => {
  
// }



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
        <button className='hp-theme-button hp-center-y ' onClick={() => setDarkMode(!darkMode)}>
          <img className='hp-no-margin hp-link-icon' src={'/icons8-night-mode-64.png'} width='32px' height='32px'></img>
        </button>
      </header>

      <div className='hp-content-container'>
        <div className='hp-main-content'>

          <section>
            <ReactiveContainer>
              <div className=''>
                <div className='hp-basic-container hp-profile-container'>
                  <div className='hp-tablet-flex-row hp-flex-col hp-hero-box hp-center-x'>
                    <div className='hp-flex-col'>
                      <img className='hp-no-margin' src={'/picture.jpg'} width='300px' height='300px'></img>
                      
                    </div>
                    
                    <div className='hp-flex-col'>
                      <div>
                        
                        {/* <h1 className='hp-profile-text hp-no-padding hp-no-margin'>ethan macdonald</h1> */}
                        <p className='hp-profile-text hp-no-padding hp-no-margin'>
                          <b>baremetal</b> programmer, <b>3d rendering</b> developer, and <b>full-stack</b> web.<br/><br/>
                          currently a full-time student at Dalhousie University.
                        </p>
                        <div className='hp-flex-row'>
                          <a href='https://www.github.com/emd22/' className=''>
                            <img className='hp-link-icon' src='/github-mark/github-mark.svg' width='30px' height='30px'></img>
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
          </section>


          <section className='hp-project-section'>
            <h1 className='hp-title-chunky'>personal projects</h1>
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
                <video src={'/belter-video.mp4'} width='300px' autoPlay loop muted></video>
              }
              contentCaption='a video of belter in action, demoed on MacOS.'
            />
            <ProjectCard 
              title='acheron engine'
              description={
                <div>
                  <p>
                    A 3D OpenGL game engine written completely in C99 for speed, and to learn plain ANSI C better.
                  </p>
                  <p>Acheron was a way to learn more about how game engines work internally, through one of the lowest level languages.</p>
                </div>
              }
            
              content={
                <img src={'/acheron-tunnel.png'} width='400'></img>
              }
              contentCaption='multiple point lights around a bumpy textured cube in a train tunnel.'
            />


          </section>
        </div>
      </div>

      <div className='footer'></div>
    </div>
  );
}

export default App;
 