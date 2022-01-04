import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import './App.css';
import Background from './Background';
import AppLogo from './logo.svg';
import RubberBandBall from './rubber-band-ball.svg';

export default function App() {
  function toggleSpinner(loading) {
    document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
  }

  useEffect(() => {
    new Background();
  });

  toggleSpinner();

  return (
    <div>
      <canvas id='backgroundCanvas'></canvas>
      <div className='center'>
        <img
          id='app-logo'
          src={AppLogo}
          alt='logo'
        />
        <h1 className='no-select'>
          bysmptote
          <br></br>
          <span className='no-select'>xxxxxx</span>
        </h1>
        <Link
          id='rubber-band-balls-link'
          to="/rubber-band-balls"
        >
          <img
          id='rubber-band-ball-icon'
          src={RubberBandBall}
          alt='rubber band ball icon'
        />
        </Link>
      </div>
    </div>
  );
}
