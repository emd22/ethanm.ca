import React from 'react';

import nightModeIcon from './assets/icons8-night-mode-64.png'

// import './App.scss';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className='hp-app-header hp-flex-row hp-space-between'>
      <h1 className=''>ethan macdonald</h1>
      <button className='hp-theme-button hp-center-y ' onClick={() => setDarkMode(!darkMode)}>
        <img className='hp-no-margin hp-link-icon hp-img-logo' alt='toggle dark mode' src={nightModeIcon}></img>
      </button>
    </div>
  );


}

export default Navbar;
