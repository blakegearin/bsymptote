import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Background from './Background';
import AppLogo from './logo.svg';
import RubberBandBall from '../projects/rubber-band-balls/rubber-band-ball.svg';
import Die from '../projects/dice/die.svg';
import Space from '../projects/space/space.svg';

import './Home.css';

export default function Home() {
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
      <div className='all-center'>
        <img
          id='app-logo'
          src={AppLogo}
          alt='logo'
        />
        <h1 className='no-select'>
          bsymptote
          <br></br>
          <span className='no-select'>xxxxxx</span>
        </h1>
        <Link
          id='rubber-band-balls-link'
          to='/rubber-band-balls'
        >
          <img
          id='rubber-band-ball-icon'
          className='icon'
          src={RubberBandBall}
          alt='rubber band ball icon'
        />
        </Link>
        <Link
          id='dice-link'
          to='/dice'
        >
          <img
          id='rolling-die-icon'
          className='icon'
          src={Die}
          alt='rolling die icon'
        />
        </Link>
        <Link
          id='space-link'
          to='/space'
        >
          <img
          id='space-icon'
          className='icon'
          src={Space}
          alt='space icon'
        />
        </Link>
      </div>
    </div>
  );
}
