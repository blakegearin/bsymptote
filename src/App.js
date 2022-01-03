import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Button from './Button';
import Genuary_1_2022 from './genuary/1-2022.js';
import './App.css';

export default function App() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function toggleSpinner(loading) {
    document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
  }

  function generateTilt() {
    var tiltDegrees = randomIntFromInterval(-12, 12);
    const tiltCSS = `
      transform: rotate(${tiltDegrees}deg);
      -ms-transform: rotate(${tiltDegrees}deg);
      -webkit-transform: rotate(${tiltDegrees}deg);
      display: inline-block;
    `

    return tiltCSS;
  }

  function spanEachCharacterWithTilt(string) {
    var result = '';
    [...string].forEach(
      c => result += `<span style="${generateTilt()}">${c}</span>`
    );
    return result;
  }

  useEffect(() => {
    new Genuary_1_2022(
      { params, location, navigate, searchParams, setSearchParams }
    );
    document.getElementById('randomBtn').style.display = '';
    toggleSpinner(false);
  }, [params, location, navigate, searchParams, setSearchParams]);

  function randomIntFromInterval(min, max, method = Math.random()) {
    return Math.floor(method * (max - min + 1) + min);
  }

  return (
    <div className='app'>
      <canvas id='myCanvas'></canvas>
      <Button
        id='randomBtn'
        title={spanEachCharacterWithTilt('Random')}
        className='no-select'
        onClick={() => {
          toggleSpinner(true);
          navigate(`/`);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
