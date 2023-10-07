import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';

import './Dice.css';

const possibleSides = [
  'side one wb',
  'side two wb',
  'side two wb flip',
  'side three wb',
  'side three wb flip',
  'side four wb',
  'side five wb',
  'side six wb',
  'side six wb flip',
  'side one bw',
  'side two bw',
  'side two bw flip',
  'side three bw',
  'side three bw flip',
  'side four bw',
  'side five bw',
  'side six bw',
  'side six bw flip',
];

const dieColorOptions = {
  white: 'wb',
  black: 'bw',
  mix: 'mix',
};

function toggleSpinner(loading) {
  document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
}

function randomIntFromInterval(min, max, method = Math.random()) {
  return Math.floor(method * (max - min + 1) + min);
}

function randomRotation() {
  return Math.round(Math.random()) * 90;
}

function changeColor(oldColor, newColor) {
  var searchColor = `.${oldColor}`;
  if (oldColor === 'mix') searchColor = '.wb,.bw';

  [...document.querySelectorAll(searchColor)].forEach(
    (element) => {
      if (newColor === 'mix') {
        element.classList.replace(oldColor, ((Math.random() > 0.5) ? 'wb' : 'bw'));
      } else if (oldColor === 'mix') {
        if (element.classList.contains(newColor)) return;

        var currentOldColor = (newColor === 'wb') ? 'bw' : 'wb';
        element.classList.replace(currentOldColor, newColor);
      } else {
        element.classList.replace(oldColor, newColor);
      }
    }
  );
}

function rollDie(die, dieColor, d2 = true) {
  // 2D
  if (d2) {
    const possibleSides = [
      'side one',
      'side two',
      'side two flip',
      'side three',
      'side three flip',
      'side four',
      'side five',
      'side six',
      'side six flip',
    ];
    if (dieColor === 'mix') dieColor = (Math.random() > 0.5) ? 'wb' : 'bw';
    var newValue = `${possibleSides[randomIntFromInterval(0, (possibleSides.length - 1))]} ${dieColor}`;
    die.className = newValue;
  } else {
    const newValue = Math.floor((Math.random() * 6) + 1);

    for (var i = 1; i <= 6; i++) {
      var newClass = `show-${i}`;
      if (newValue === i) {
        die.classList.add(newClass);

        switch(i) {
          case 2:
            die.style.transform = `rotateX(-900deg) rotateZ(${1080 + randomRotation()}deg)`;
            break;
          case 3:
            die.style.transform = `rotateY(810deg) rotateZ(720deg) rotateX(${randomRotation()}deg)`;
            break;
          case 6:
            die.style.transform = `rotateY(-450deg) rotateZ(-1440deg) rotateX(${randomRotation()}deg)`;
            break;
          default:
            die.style.transform = null;
        }
      } else {
        die.classList.remove(newClass);
      }
    }
  }
}

function rollDice(dieColor) {
  [...document.getElementsByClassName('side')].forEach(
    (element) => {
      rollDie(element, dieColor);
    }
  );
}

class Dice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: 2,
      dieColor: 'white',
      loading: false,
      windowWidth: window.innerWidth,
      windowHeight: (window.innerHeight - 120),
    };
  }

  handleResize = (e) => {
    this.setState(
      {
        windowWidth: window.innerWidth,
        windowHeight: (window.innerHeight - 120),
      }
    );
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const dice = document.querySelectorAll('.dice');

    dice.forEach(
      die => {
        die.addEventListener('click', function handleClick(event) {
          var side = die.firstElementChild;

          var currentPosition = possibleSides.indexOf(side.classList.toString());
          var newPosition = currentPosition + 1;
          if (newPosition > possibleSides.length - 1) newPosition = 0;

          side.className = possibleSides[newPosition];
        });
      }
    );

    toggleSpinner(false);
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    const { windowWidth, windowHeight } = this.state;

    const diceSize = 10;
    const diceMargin = 1;

    const dieArea = diceSize + (diceMargin * 2);

    const horizontalFits = Math.floor(windowWidth / dieArea);
    const verticalFits = Math.floor(windowHeight / dieArea);

    const horizontalAlignPadding = (windowWidth % dieArea) / 2;

    // 2D
    var dice = '';
    const dieInnerHtml = `
      <div class='side one wb'>
        <div class='dot dot-1'></div>
        <div class='dot dot-2'></div>
        <div class='dot dot-3'></div>
        <div class='dot dot-4'></div>
        <div class='dot dot-5'></div>
        <div class='dot dot-6'></div>
      </div>
    `;

    for (let i = 0; i < horizontalFits; i++) {
      for (let j = 0; j < verticalFits; j++) {

        const dieStyle = `
          margin: ${diceMargin}px;
          top: ${(j * dieArea) + horizontalAlignPadding}px;
          left: ${(i * dieArea) + horizontalAlignPadding}px;
        `;

        dice += `
          <div
            id='dice${i}-${j}'
            class='dice'
            style='${dieStyle}'
          >
            ${dieInnerHtml}
          </div>
        `
      }
    }

    document.body.style.backgroundColor = 'grey';

    return (
      <div id='dice' className='center'>
        <div
          style={{ height: windowHeight, width: windowWidth }}
          dangerouslySetInnerHTML={{ __html: dice }}
        >
        </div>
        <Button
          title={'Home'}
          className='no-select home-button'
          onClick={() => {
            toggleSpinner(true);
            this.props.navigate(`/`);
          }}
        />
        <Button
          id='color-button'
          title='<div>Die Color</div>'
          className={`no-select ${dieColorOptions[this.state.dieColor]}`}
          onClick={() => {
            const oldColor = dieColorOptions[this.state.dieColor];
            const currentPosition = Object.keys(dieColorOptions).indexOf(this.state.dieColor);
            var newPosition = currentPosition + 1;

            if (newPosition > (Object.keys(dieColorOptions).length - 1)) newPosition = 0

            const newColor = Object.keys(dieColorOptions)[newPosition];
            this.setState({ dieColor: newColor });
            changeColor(oldColor, dieColorOptions[newColor]);
          }}
        />
        <Button
          id='roll-button'
          title='Roll'
          className='no-select activate-button right'
          disabled={this.state.loading}
          onClick={() => {
            this.setState({ loading: true });

            const dieColor = dieColorOptions[this.state.dieColor];
            rollDice(dieColor);

            if (this.state.dimensions === 3) {
              setTimeout(() => {
                // setListofNotes(countRef.current)
                // document.getElementById('roll-button').disabled = false;
                this.setState({ loading: false });
              }, 2000);
            } else {
              this.setState({ loading: false });
            }
          }}
        />
      </div>
    );
  }
}

export default function DiceFunction(props) {
  const navigate = useNavigate();

  return <Dice {...props} navigate={navigate} />;
}
