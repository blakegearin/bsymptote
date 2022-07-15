import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import blinder from 'color-blind';
import { CompactPicker } from 'react-color'

import Button from '../Button';
import SeedRand from '../SeedRand'

export default function Antipalette() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function generativeArt({ params, location, navigate, searchParams, setSearchParams }) {
    console.log('loading');

    // 120px is the offset of the Random button
    const windowHeight = window.innerHeight - 120;
    const windowWidth = window.innerWidth;

    let antipalette = document.getElementById('antipalette-content')
    if (antipalette == null) {
      console.log(`antipalette is null`);
      return;
    }
    antipalette.innerHTML = '';

    let targetColor = '#42dead'
    // let targetColor = document.getElementById('target-color').value;
    console.log(`targetColor`);
    console.dir(targetColor);

    let type = 'protanopia';

    let colorsFound = [];
    let limit = null;

    console.log('done early');
    return;

    for (var i = 0; i < totalHexColors(); ++i) {
      if (limit != null && limit === 0) break;

      let color = '#' + ('00000' + i.toString(16)).slice(-6);

      if (color === '#42dead') {
        // debugger;
      }

      if (targetColor === blinder[type](color)) {
        colorsFound.push(color);
        document.documentElement.style.setProperty('--palette-amount', colorsFound.length);

        let element = document.createElement('div');
        element.classList = 'palette-color';
        element.style = `
          background-color: ${color};
          color: ${(totalHexColors()/2) > i ? 'white' : 'black'};
        `;

        let span = document.createElement('span');
        span.innerText = color;
        element.appendChild(span);

        document.getElementById('antipalette-content').appendChild(element);

        if (limit != null) limit -= 1;
      }
    }

    document.querySelectorAll('.palette-color').forEach((element) => {
      element.style.cssText += `height: calc(${windowHeight}px / var(--palette-amount));`;
    });

    console.log('done');
    console.log(`colorsFound`);
    console.dir(colorsFound);
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
      c => result += `<span style='${generateTilt()}'>${c}</span>`
    );
    return result;
  }

  function toggleSpinner(loading) {
    document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
  }

  function randomIntFromInterval(min, max, method = rand()) {
    return Math.floor(method * (max - min + 1) + min);
  }




  function totalHexColors() {
    return Math.pow(256, 3)
  }

  function randomColor() {
    return Math.floor(rand() * (totalHexColors() - 1)).toString(16);
  }

  function generateAntipalette(windowHeight, limit = null) {
    console.log('loading');
    let antipalette = document.getElementById('antipalette-content')
    if (antipalette == null) return;
    antipalette.innerHTML = '';

    let targetColor = document.getElementById('target-color').value;
    console.log(`targetColor`);
    console.dir(targetColor);

    let type = 'protanopia';

    let colorsFound = [];

    return true;

    for (var i = 0; i < totalHexColors(); ++i) {
      if (limit != null && limit === 0) break;

      let color = '#' + ('00000' + i.toString(16)).slice(-6);

      if (color === '#42dead') {
        // debugger;
      }

      if (targetColor === blinder[type](color)) {
        colorsFound.push(color);
        document.documentElement.style.setProperty('--palette-amount', colorsFound.length);

        let element = document.createElement('div');
        element.classList = 'palette-color';
        element.style = `
          background-color: ${color};
          color: ${(totalHexColors()/2) > i ? 'white' : 'black'};
        `;

        let span = document.createElement('span');
        span.innerText = color;
        element.appendChild(span);

        document.getElementById('antipalette-content').appendChild(element);

        if (limit != null) limit -= 1;
      }
    }

    document.querySelectorAll('.palette-color').forEach((element) => {
      element.style.cssText += `height: calc(${windowHeight}px / var(--palette-amount));`;
    });

    console.log('done');
    return colorsFound;
  }

  function handleChangeComplete(color, _e) {
    console.log(`color`);
    console.dir(color);
  }





  useEffect(() => {
    // generativeArt(
    //   { params, location, navigate, searchParams, setSearchParams }
    // );
    // document.getElementById('random-button').style.display = '';
    // document.getElementsByClassName('home-button')[0].style.display = '';
    // toggleSpinner(false);

    document.getElementById('rc-editable-input-1').addEventListener('change', this.handleChangeComplete());

  });


  var seed = searchParams.get('seed');

  if (seed === null || seed === 0 || seed === '') {
    seed = randomIntFromInterval(1, 10000, Math.random());
    setSearchParams({ seed: seed });
  }

  toggleSpinner(false);

  var rand = SeedRand(seed);

  return (
    <div id='antipalette'>
      <div>
          <h1>Antipalette</h1>
          <div id="color-input">
            <label htmlFor="target-color">Color&nbsp;&nbsp;</label>
            <CompactPicker
              // type="color"
              id="target-color"
              name="target-color"
              color={randomColor()}
              onChangeComplete={handleChangeComplete()}
              // onChangeComplete={generativeArt({ params, location, navigate, searchParams, setSearchParams })}
            />
          </div>
          <div id="antipalette-content"></div>
        </div>
      <Button
        title='Home'
        className='no-select home-button'
        onClick={() => {
          toggleSpinner(true);
          navigate(`/`);
        }}
        style={{ display: 'none' }}
      />
      <Button
        id='random-button'
        title={spanEachCharacterWithTilt('Random')}
        className='no-select activate-button'
        onClick={() => {
          toggleSpinner(true);
          navigate(`/space`);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
