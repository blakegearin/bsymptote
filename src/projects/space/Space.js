import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Paper, { Color, Group, Path, Point, PointText, Rectangle } from 'paper';

import Button from '../Button';
import SeedRand from '../SeedRand'
import './Space.css';

export default function RubberBandBalls() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function generativeArt({ params, location, navigate, searchParams, setSearchParams }) {
    // Get a reference to the canvas object
    var canvas = document.getElementById('space-canvas');

    // 120px is the offset of the Random button
    const windowHeight = window.innerHeight - 120;
    const windowWidth = window.innerWidth;

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    // Create an empty project and a view for the canvas
    Paper.setup(canvas);

    function randomFromArray(array) {
      return array[Math.floor(rand() * array.length)];
    }

    function randomIntFromInterval(min, max, method = rand()) {
      return Math.floor(method * (max - min + 1) + min);
    }

    function randomColor() {
      return new Color(rand(), rand(), rand());
    }

    const backgroundColor = 'black';
    document.body.style.backgroundColor = backgroundColor;
    document.getElementById('space').style.background = backgroundColor;
    canvas.style.background = backgroundColor;

    var numberOfStars = randomIntFromInterval(10, 100);

    for (var i = 0; i < numberOfStars; i++) {
      const point = new Point(
        randomIntFromInterval(0, windowWidth),
        randomIntFromInterval(0, windowHeight)
      );
      new Path.Star({
        center: point,
        points: randomIntFromInterval(4, 12),
        radius1: randomIntFromInterval(1, 5),
        radius2: randomIntFromInterval(1, 5),
        fillColor: 'white',
      });
    }
    var widthFifth = windowWidth / 5;

    var word = 'SPACE';
    [...word].forEach((char, index) => {
      const fontSize = randomIntFromInterval(10, 500);
      const point = new Point(
        (widthFifth / 2) + (widthFifth * index), 
        randomIntFromInterval(fontSize, (windowHeight - fontSize))
      );
      const fontFamily = randomFromArray([
        'AppleGothic',
        'Arial',
        'Baskerville',
        'Brush Script MT',
        'Bodoni MT',
        'Bookman Old Style',
        'Calibri',
        'Calisto MT',
        'Cambria',
        'Candara',
        'Century Gothic',
        'Charcoal',
        'Consolas',
        'Copperplate Gothic',
        'Courier New',
        'Dejavu Sans',
        'Didot',
        'Franklin Gothic',
        'Garamond',
        'Georgia',
        'Gill Sans',
        'Goudy Old Style',
        'Helvetica',
        'Helvetica Inserat',
        'Hoefler Text',
        'Impact',
        'Lucida Bright',
        'Optima',
        'Palatino',
        'Segoe UI',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana',
      ]);
      new PointText(
        {
          point: point, 
          content: char,
          fontFamily: `${fontFamily}, serif, sans-serif`,
          fontWeight: randomIntFromInterval(100, 900),
          fillColor: randomColor(),
          fontSize: `${fontSize}px`,
          strokeColor: randomColor(),
          strokeWidth: randomIntFromInterval(0, 100),
          strokeCap: randomFromArray(['round', 'square', 'butt']),
          strokeScaling: randomFromArray([true, false]),
          rotation: randomIntFromInterval(-179, 180),
          blendMode: randomFromArray(['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'lighten', 'difference', 'exclusion', 'hue']),
        }
      );
    });
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

  useEffect(() => {
    generativeArt(
      { params, location, navigate, searchParams, setSearchParams }
    );
    document.getElementById('random-button').style.display = '';
    document.getElementsByClassName('home-button')[0].style.display = '';
    toggleSpinner(false);
  }, [params, location, navigate, searchParams, setSearchParams]);


  var seed = searchParams.get('seed');

  if (seed === null || seed === 0 || seed === '') {
    seed = randomIntFromInterval(1, 10000, Math.random());
    setSearchParams({ seed: seed });
  }

  toggleSpinner(false);

  var rand = SeedRand(seed);

  return (
    <div id='space'>
      <canvas id='space-canvas'></canvas>
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
