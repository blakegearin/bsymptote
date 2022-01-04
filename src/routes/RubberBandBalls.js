import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Paper, { Color, Path, Point, Rectangle} from 'paper';

import Button from '../Button';
import './RubberBandBalls.css';

export default function RubberBandBalls() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function generativeArt({ params, location, navigate, searchParams, setSearchParams }) {
    // Get a reference to the canvas object
    var canvas = document.getElementById('rubber-band-balls-canvas');

    // 120px is the offset of the Random button
    const windowHeight = window.innerHeight - 120;
    const windowWidth = window.innerWidth;

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    // console.log('windowWidth: ' + windowWidth);
    // console.log('windowHeight: ' + windowHeight);

    // Create an empty project and a view for the canvas
    Paper.setup(canvas);

    Math.seed = function (s) {
      return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    };

    function findMinimum(value) {
      if (toString.call(value) !== '[object Array]') return false;
      return Math.min.apply(null, value);
  }

    function randomIntFromInterval(min, max, method = rand()) {
      return Math.floor(method * (max - min + 1) + min);
    }

    function randomColor() {
      return new Color(rand(), rand(), rand());
    }

    function addRubberBandBall(
      startPoint,
      endPoint,
      ballSize,
      ballBackgroundColor,
      ballCutoutPercentage,
      ballRadiusPercentage,
      numberOfRubberBands,
      rubberBandRadiusPercentage,
      rubberBandColors,
    ) {

      function lightenDarkenColor(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

        return '#' + RR + GG + BB;
      }

      function randomFromArray(array) {
        return array[Math.floor(rand() * array.length)];
      }

      function getRandomCirclePoint(radius, square) {
        const angle = rand() * Math.PI * 2;
        const x = Math.cos(angle) * (radius + 0);
        const y = Math.sin(angle) * (radius + 0);

        return [
          x + square.center.x,
          y + square.center.y,
        ];
      }

      function addRubberBand(square, ballSize, rubberBandSize, rubberBandColor) {
        var badRubberBand = true;
        while (badRubberBand) {
          badRubberBand = false;
          var rubberBand = new Path.Line({
            from: getRandomCirclePoint(ballSize, square),
            to: getRandomCirclePoint(ballSize, square),
            strokeColor: rubberBandColor,
            strokeWidth: rubberBandSize,
            opacity: 1,
            strokeCap: 'round',
            shadowColor: lightenDarkenColor(rubberBandColor, -50),
            shadowBlur: ballSize / 100,
            shadowOffset: new Point(0, (ballSize / 100)),
          });

          if (rubberBand.length < (ballSize / 1.33)) {
            rubberBand.remove();
            badRubberBand = true;
          }
        }
      }

      const bandSize = ballSize / 25;
      const square = new Rectangle({
        from: startPoint,
        to: endPoint,
      });

      const colorPallettes = {
        webRainbow: [
          'coral',
          'gold',
          'skyblue',
          'darkseagreen',
          'pink',
        ],
        rainbow: [
          '#D35758', // red
          '#DCBC26', // yellow
          '#92B55C', // green
          '#60A7BE', // blue
          '#DBD5C3', // white
          '#717F93',  // grey
        ],
        neon: [
          '#F65C6E', // red
          '#FEDF16', // yellow
          '#27D8BC', // green
          '#4BB5E4', // blue
        ],
        vaporwave: [
          '#F26865', // red
          '#FEE968', // yellow
          '#33CCAE', // green
          '#B98CE1', // purple
          '#EBDED6', // tan
        ],
        tan: [
          '#E1D4C1',
          '#EDD1A6',
          '#F3DFBB',
          '#F4DBAF',
          '#DFC79C',
          '#D3BA95',
          '#DDB984',
          '#D3BC8B',
          '#CEAA74',
          '#CDB28C',
        ],
      };

      var colorArray = null;
      if (rubberBandColors === 'random' || colorPallettes[rubberBandColors] === undefined) {
        var randomNumber = randomIntFromInterval(0, (Object.keys(colorPallettes).length - 1));
        colorArray = colorPallettes[Object.keys(colorPallettes)[randomNumber]]
      } else {
        colorArray = colorPallettes[rubberBandColors];
      };

      const centerPoint = square.center;
      new Path.Circle({
        center: centerPoint,
        radius: ballSize * ballRadiusPercentage,
        fillColor: new Color(randomFromArray(colorArray)).toCSS(true),
      });

      for (let i = 0; i < numberOfRubberBands; i++) {
        const rubberBandColor = new Color(randomFromArray(colorArray)).toCSS(true);
        addRubberBand(square, ballSize * rubberBandRadiusPercentage, bandSize, rubberBandColor);
      }

      if (ballCutoutPercentage !== 0) {
        const fillColor = (ballBackgroundColor === 'random') ? randomColor() : ballBackgroundColor;

        const area = new Path.Rectangle({
          from: startPoint,
          to: endPoint,
          fillColor: fillColor,
        });

        var hole = new Path.Circle({
          center: centerPoint,
          radius: ballSize * ballCutoutPercentage,
          fillColor: 'transparent',
        });

        area.subtract(hole);
        area.remove()
      }
    }

    function addRubberBandBalls(
      ballSize,
      ballMargin,
      ballSquare,
      horizontalFits,
      verticalFits,
      ballCutoutPercentage,
      ballRadiusPercentage,
      ballBackgroundColor,
      numberOfRubberBands,
      rubberBandRadiusPercentage,
      rubberBandColors,
    ) {

      const horizontalAlignPadding = (windowWidth % ballSquare);
      const verticalAlignPadding = (windowHeight % ballSquare);

      for (let i = 0; i < horizontalFits; i++) {
        for (let j = 0; j < verticalFits; j++) {
          var startX = (i * ballSquare) + ballMargin + (horizontalAlignPadding / 2);
          var startY = (j * ballSquare) + ballMargin + (verticalAlignPadding / 2);
          const startPoint = [startX, startY];

          var endX = startX + (ballSize * 2);
          var endY = startY + (ballSize * 2);
          const endPoint = [endX, endY];

          addRubberBandBall(
            startPoint,
            endPoint,
            ballSize,
            ballBackgroundColor,
            ballCutoutPercentage,
            ballRadiusPercentage,
            numberOfRubberBands,
            rubberBandRadiusPercentage,
            rubberBandColors
          );
        }
      }
    }

    // Inputs

    var seed = searchParams.get('seed');

    if (seed === null || seed === 0 || seed === '') {
      seed = randomIntFromInterval(1, 10000, Math.random());
      setSearchParams({ seed: seed });
    }

    // console.log('seed: ' + seed);
    var rand = Math.seed(seed);

    var ballSize, ballMargin, ballSquare;
    var [horizontalFits, verticalFits] = [0, 0];
    const ballSizeMaximum = findMinimum([windowWidth, windowHeight]);

    while(horizontalFits === 0 || verticalFits === 0) {
      ballSize = randomIntFromInterval(20, ballSizeMaximum);
      ballMargin = randomIntFromInterval(0, 100);

      ballSquare = (ballSize + ballMargin) * 2;
      horizontalFits = Math.floor(windowWidth / ballSquare);
      verticalFits = Math.floor(windowHeight / ballSquare);
    }

    const numberOfRubberBands = randomIntFromInterval(100, 200);
    const rubberBandRadiusPercentage = .96;

    const ballCutoutPercentage = .9;
    const ballRadiusPercentage = .89;

    // Colors

    const rubberBandColors = searchParams.get('rubberBandColors') || 'random';
    const backgroundColor = randomColor().toCSS(true);
    var ballBackgroundColor = 'random';

    // Main

    document.body.style.backgroundColor = backgroundColor;
    addRubberBandBalls(
      ballSize,
      ballMargin,
      ballSquare,
      horizontalFits,
      verticalFits,
      ballCutoutPercentage,
      ballRadiusPercentage,
      ballBackgroundColor,
      numberOfRubberBands,
      rubberBandRadiusPercentage,
      rubberBandColors,
    );
  }

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
      c => result += `<span style='${generateTilt()}'>${c}</span>`
    );
    return result;
  }

  function randomIntFromInterval(min, max, method = Math.random()) {
    return Math.floor(method * (max - min + 1) + min);
  }

  useEffect(() => {
    generativeArt(
      { params, location, navigate, searchParams, setSearchParams }
    );
    document.getElementById('random-button').style.display = '';
    document.getElementById('home-button').style.display = '';
    toggleSpinner(false);
  }, [params, location, navigate, searchParams, setSearchParams]);

  return (
    <div className='rubber-band-balls'>
      <canvas id='rubber-band-balls-canvas'></canvas>
      <Button
        id='home-button'
        title={'Home'}
        className='no-select'
        onClick={() => {
          toggleSpinner(true);
          navigate(`/`);
        }}
        style={{ display: 'none' }}
      />
      <Button
        id='random-button'
        title={spanEachCharacterWithTilt('Random')}
        className='no-select'
        onClick={() => {
          toggleSpinner(true);
          navigate(`/rubber-band-balls`);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
