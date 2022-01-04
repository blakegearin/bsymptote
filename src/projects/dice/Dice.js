import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../Button';

import './Dice.css';

function toggleSpinner(loading) {
  document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
}

function randomRotation() {
  return Math.round(Math.random()) * 90;
}

function rollDie(die) {
  var newValue = Math.floor((Math.random() * 6) + 1);

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

class Dice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: (window.innerHeight- 120),
    };

    toggleSpinner(false);
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
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    const { windowWidth, windowHeight } = this.state;

    const diceSize = 50;
    const diceMargin = 2;

    const dieArea = diceSize + (diceMargin * 2);

    // const horizontalFits = (windowWidth % dieArea);
    // const verticalFits = (windowHeight % dieArea);

    const horizontalFits = Math.floor(windowWidth / dieArea);
    const verticalFits = Math.floor(windowHeight / dieArea);

    const horizontalAlignPadding = (windowWidth % dieArea) / 2;

    // console.log('dieArea: ' + dieArea);
    // console.log('horizontalFits: ' + horizontalFits);
    // console.log('verticalFits: ' + verticalFits);
    // console.log('horizontalAlignPadding: ' + horizontalAlignPadding);

    var dice = '';
    const dieInnerHtml = `
      <div class='side one'>
        <div class='dot one-1'></div>
      </div>
      <div class='side two'>
        <div class='dot two-1'></div>
        <div class='dot two-2'></div>
      </div>
      <div class='side three'>
        <div class='dot three-1'></div>
        <div class='dot three-2'></div>
        <div class='dot three-3'></div>
      </div>
      <div class='side four'>
        <div class='dot four-1'></div>
        <div class='dot four-2'></div>
        <div class='dot four-3'></div>
        <div class='dot four-4'></div>
      </div>
      <div class='side five'>
        <div class='dot five-1'></div>
        <div class='dot five-2'></div>
        <div class='dot five-3'></div>
        <div class='dot five-4'></div>
        <div class='dot five-5'></div>
      </div>
      <div class='side six'>
        <div class='dot six-1'></div>
        <div class='dot six-2'></div>
        <div class='dot six-3'></div>
        <div class='dot six-4'></div>
        <div class='dot six-5'></div>
        <div class='dot six-6'></div>
      </div>
    `;

    for (let i = 0; i < horizontalFits; i++) {
      for (let j = 0; j < verticalFits; j++) {

        const dieStyle = `
          background-color: red;
          width: ${diceSize}px;
          height: ${diceSize}px;
          margin: ${diceMargin}px;
          position: absolute;
          top: ${(j * dieArea) + horizontalAlignPadding}px;
          left: ${(i * dieArea) + horizontalAlignPadding}px;
        `;

        dice += `
          <div
            id='dice${i}-${j}'
            class='dice'
            style='${dieStyle}'
          >
          </div>
        `
      }
    }

    return (
      <div>
        <div
          style={{ height: windowHeight, width: windowWidth, backgroundColor: 'white' }}
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
          id='roll-button'
          title={'Roll'}
          className='no-select activate-button'
          onClick={() => {
            [...document.getElementsByClassName('dice')].forEach(
              (element) => {
                rollDie(element);
              }
            );
          }}
        />
      </div>
    );
  }
}

export default function(props) {
  const navigate = useNavigate();

  return <Dice {...props} navigate={navigate} />;
}
