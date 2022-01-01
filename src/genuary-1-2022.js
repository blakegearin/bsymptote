import { paper } from 'paper';

window.onload = function (){
  // Get a reference to the canvas object
  var canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log("window.innerWidth: " + window.innerWidth);
  console.log("window.innerHeight: " + window.innerHeight);

  // Create an empty project and a view for the canvas
  paper.setup(canvas);

  Math.seed = function (s) {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

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

      var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
      var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
      var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

      return "#" + RR + GG + BB;
    }

    function randomFromArray(array) {
      return array[Math.floor(rand() * array.length)];
    }

    function randomIntFromInterval(min, max) {
      return Math.floor(rand() * (max - min + 1) + min)
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
        var rubberBand = new paper.Path.Line({
          from: getRandomCirclePoint(ballSize, square),
          to: getRandomCirclePoint(ballSize, square),
          strokeColor: rubberBandColor,
          strokeWidth: rubberBandSize,
          opacity: 1,
          strokeCap: 'round',
          shadowColor: lightenDarkenColor(rubberBandColor, -50),
          shadowBlur: ballSize / 100,
          shadowOffset: new paper.Point(0, (ballSize / 100)),
        });

        if (rubberBand.length < (ballSize / 1.33)) {
          rubberBand.remove();
          badRubberBand = true;
        }
      }
    }

    function randomColor() {
      return new paper.Color(rand(), rand(), rand());
    }

    const bandSize = ballSize / 25;
    const square = new paper.Rectangle({
      from: startPoint,
      to: endPoint,
    });

    const centerPoint = square.center;
    var ball = new paper.Path.Circle({
      center: centerPoint,
      radius: ballSize * ballRadiusPercentage,
      fillColor: 'tan',
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

    for (let i = 0; i < numberOfRubberBands; i++) {
      const rubberBandColor = new paper.Color(randomFromArray(colorArray)).toCSS(true);
      addRubberBand(square, ballSize * rubberBandRadiusPercentage, bandSize, rubberBandColor);
    }

    if (ballCutoutPercentage !== 0) {
      const fillColor = (ballBackgroundColor === 'random') ? randomColor() : ballBackgroundColor;

      const area = new paper.Path.Rectangle({
        from: startPoint,
        to: endPoint,
        fillColor: fillColor,
      });

      var hole = new paper.Path.Circle({
        center: centerPoint,
        radius: ballSize * ballCutoutPercentage,
        fillColor: 'transparent',
      });

      var drilled = area.subtract(hole);

      area.remove()
    }
  }

  function addRubberBandBalls(
    ballSize,
    ballCutoutPercentage,
    ballRadiusPercentage,
    ballBackgroundColor,
    numberOfRubberBands,
    rubberBandRadiusPercentage,
    rubberBandColors,
    ballMargin
  ) {

    var ballSquare = (ballSize + ballMargin) * 2;

    var horizontalFits = Math.floor(window.innerWidth / ballSquare);
    var verticalFits = Math.floor(window.innerHeight / ballSquare);

    console.log("horizontalFits: " + horizontalFits);
    console.log("verticalFits: " + verticalFits)
    console.log("\n");

    const horizontalAlignPadding = (window.innerWidth % ballSquare);
    const verticalAlignPadding = (window.innerHeight % ballSquare);

    console.log("horizontalAlignPadding: " + horizontalAlignPadding);
    console.log("verticalAlignPadding: " + verticalAlignPadding);
    console.log("\n");

    for (let i = 0; i < horizontalFits; i++) {
      for (let j = 0; j < verticalFits; j++) {
        var startX = (i * ballSquare) + ballMargin + (horizontalAlignPadding / 2);
        var startY = (j * ballSquare) + ballMargin + (verticalAlignPadding / 2);
        const startPoint = [startX, startY];

        var endX = startX + (ballSize * 2);
        var endY = startY + (ballSize * 2);
        const endPoint = [endX, endY];

        // console.log("X: " + i, "Y: " + j);
        // console.log("startPoint: " + startPoint);
        // console.log("endPoint: " + endPoint);
        // console.log("\n");

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

  // Amounts

  const seed = Math.random();
  const ballSize = 200;
  const numberOfRubberBands = 150;
  const rubberBandRadiusPercentage = .96;
  const ballMargin = 20;
  const ballCutoutPercentage = .9;
  const ballRadiusPercentage = .89;

  // Colors

  const rubberBandColors = 'random';
  const backgroundColor = '';
  var ballBackgroundColor = 'random';

  // Main

  var rand = Math.seed(seed);

  document.body.style.backgroundColor = backgroundColor;
  addRubberBandBalls(
    ballSize,
    ballCutoutPercentage,
    ballRadiusPercentage,
    ballBackgroundColor,
    numberOfRubberBands,
    rubberBandRadiusPercentage,
    rubberBandColors,
    ballMargin
  );

  // Draw the view
  paper.view.draw();
}
