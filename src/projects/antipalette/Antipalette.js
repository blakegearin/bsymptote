import React from 'react';
import reactCSS from 'reactcss'
import { useNavigate, useSearchParams } from 'react-router-dom';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SketchPicker } from 'react-color'
import Select from 'react-select'

import Button from '../Button';
import Copy from './copy.svg';
import Check from './check.svg';

import './Antipalette.css';

const blinder = require('color-blind');

const typesOfColorBlindness = [
  'protanomaly',
  'protanopia',
  'deuteranomaly',
  'deuteranopia',
  'tritanomaly',
  'tritanopia',
  'achromatomaly',
  'achromatopsia',
];

function toggleSpinner(loading) {
  console.log('toggling spinner')
  document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
}

function randomIntFromInterval(min, max, method = Math.random()) {
  return Math.floor(method * (max - min + 1) + min);
}

function randomFromArray(array) {
  let randomInteger = randomIntFromInterval(0, (Object.keys(array).length - 1));
  return array[randomInteger];
}

function totalHexColors() {
  return Math.pow(256, 3)
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

class Antipalette extends React.Component {
  constructor(props) {
    super(props);

    let hexColor = props.searchParams.get('color') || null;
    let type = props.searchParams.get('type') || null;

    let r, g, b;
    if (hexColor != null) {
      let rgb = hexToRgb(hexColor);
      r = rgb.r;
      g = rgb.g;
      b = rgb.g;
    }

    this.state = {
      loading: false,
      windowWidth: window.innerWidth,
      windowHeight: (window.innerHeight - 120),
      displayColorPicker: false,
      type: type,
      hexColor: hexColor,
      color: {
        r: r,
        g: g,
        b: b,
        a: '1',
      },
      colorPresentOnLoad: (hexColor != null),
    };
  }

  generativeArt = () => {
    console.log('LOADING');

    // Get a reference to the div
    let antipalette = document.getElementById('antipalette-content')
    if (antipalette == null) {
      console.error('antipalette-content wasn\'t found');
      return;
    }
    antipalette.innerHTML = '';

    // 120px is the offset of the Random button
    const windowHeight = `${window.innerHeight - 120}px`;
    const windowWidth = `${window.innerWidth}px`;

    antipalette.style.width = windowWidth;
    antipalette.style.height = windowHeight;

    let targetColor = this.state.hexColor;
    console.log(`targetColor`);
    console.dir(targetColor);

    let type = this.state.type;
    console.log(`type`);
    console.dir(type);

    if (targetColor == null || type == null) return null;

    let limit = null;

    let colorsFound = [];

    // console.log('done early')
    // return true;

    for (let i = 0; i < totalHexColors(); ++i) {
      if (limit != null && limit === 0) break;

      let color = '#' + ('00000' + i.toString(16)).slice(-6);

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

    if (colorsFound.length === 0) {
      document.documentElement.style.setProperty('--palette-amount', 1);

      let element = document.createElement('div');
      element.classList = 'palette-color';
      element.style = 'background-color: #ffffff;';

      let span = document.createElement('span');
      span.innerText = 'No colors found. This may sound bad but it is good.';
      element.appendChild(span);

      document.getElementById('antipalette-content').appendChild(element);
    }

    document.querySelectorAll('.palette-color').forEach((element) => {
      element.style.cssText += `height: calc(${this.state.windowHeight}px / var(--palette-amount));`;
    });

    console.log('DONE');
    console.log(`colorsFound`);
    console.dir(colorsFound);
    this.setState({ antipalette: colorsFound });
  }

  randomColor = () => {
    return Math.floor(this.state.rand() * (totalHexColors() - 1)).toString(16);
  }

  showCopyIcon() {
    let checkMarkIconClasses = document.getElementById('check-mark-icon').className.split(' ');

    if (checkMarkIconClasses.includes('hide')) {
      document.getElementById('copy-icon').classList.remove('hide');
    }
  }

  copiedToClipboard() {
    document.getElementById('copy-icon').classList.add('hide');
    document.getElementById('check-mark-icon').classList.remove('hide');
    setTimeout(
      () => {
        document.getElementById('check-mark-icon').classList.add('fadeOut');
        setTimeout(
          () => {
            document.getElementById('check-mark-icon').classList.add('hide');
            document.getElementById('check-mark-icon').classList.remove('fadeOut');
          },
          1000
        );
      },
      2000
    );
  }

  handleResize = () => {
    this.setState(
      {
        windowWidth: window.innerWidth,
        windowHeight: (window.innerHeight - 120),
      }
    );
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = (color) => {
    this.setState(
      {
        color: color.rgb,
        hexColor: color.hex,
      }
    );
  };

  handleTypeChange = (selectedOption) => {
    this.setState({ type: selectedOption.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    toggleSpinner(true);

    const newUrl =
      `/antipalette?color=${encodeURIComponent(this.state.hexColor)}&type=${this.state.type}`;
    console.log(`newUrl`);
    console.dir(newUrl);

    window.location.replace(newUrl);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.generativeArt();
    toggleSpinner(false);
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.handleResize);
  }

  render() {
    const { type, colorPresentOnLoad } = this.state;
    const isAntipalettePopulated = this.state.antipalette && this.state.antipalette.length !== 0;

    const descriptiveText = {
      value: (colorPresentOnLoad && isAntipalettePopulated) ? 'copy me' : 'generate me',
      class: (colorPresentOnLoad && isAntipalettePopulated) ? 'copy-me' : 'generate-me',
    };

    const colorStyles = reactCSS({
      'default': {
        color: {
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
      },
    });

    const selectOptions = typesOfColorBlindness.map(t => { return { value: t, label: t} });

    return (
      <div id='antipalette' className='center'>
        {
          this.state.displayColorPicker ?
          <div id='popover'>
            <div
              id='cover'
              onClick={this.handleClose}
            />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleColorChange}
            />
          </div>
          : null
        }
        <div
          id='page-title'
          onMouseEnter={
            (colorPresentOnLoad && isAntipalettePopulated) ? this.showCopyIcon : null
          }
          onMouseLeave={() => {
            if (colorPresentOnLoad && isAntipalettePopulated) {
              document.getElementById('copy-icon').classList.add('hide');
            }
          }}
        >
          <h1>Antipalette</h1>
          {
            colorPresentOnLoad ?
            <CopyToClipboard
              id='copy-to-clipboard'
              text={this.state.antipalette}
              onCopy={this.copiedToClipboard}
            >
              <div>
                <img
                  id='copy-icon'
                  className='hide'
                  src={Copy}
                  alt='copy to clipboard icon'
                />
                <img
                  id='check-mark-icon'
                  src={Check}
                  className='hide'
                  alt='check mark icon'
                />
              </div>
            </CopyToClipboard> :
            <div id="definition">
              <h2 className="word">antipalette</h2>
              <span className="noun">noun</span>
              <p>an·​ti·pal·​ette</p>
              <p>\ ˈan-ˌtīpa-lət, ˈan-tēpa-lət \</p>
              <div className="definitions">
                <p>
                  1. a set of colors virtually indistinguishable when viewed with a specific color deficiency
                </p>
                <p>
                  2. yes I made this word up, all words are made up
                </p>
                <p>
                  3. choose a color deficiency & target color to generate an antipalette of all the colors that look the same as the target color (according to <a href="https://www.npmjs.com/package/color-blind" target="_blank" rel="noopener noreferrer">this</a>)
                </p>
                <p>
                  4. when I say "all the colors" I do mean all 16,777,216 RGB color combinations (256<sup>3</sup>), so please be patient
                </p>
              </div>
            </div>
          }
        </div>
        <p
          id='descriptive-text'
          className={descriptiveText.class}
        >
          ({descriptiveText.value})
        </p>
        <div id='antipalette-content'></div>
        <Button
          title={'Home'}
          className='no-select home-button'
          onClick={() => {
            toggleSpinner(true);
            this.props.navigate(`/`);
          }}
        />
        <form>
          <div id='inputs'>
            <Select
              id='select-color-deficiency'
              placeholder='color deficiency'
              options={selectOptions}
              value={selectOptions.filter(o => o.value === type)[0]}
              menuPlacement='top'
              onChange={this.handleTypeChange}
            />
            <div id='color-input'>
              <label htmlFor='swatch'>Color&nbsp;&nbsp;</label>
              <div
                id='swatch'
                onClick={this.handleClick}
              >
                <div id='color' style={colorStyles.color}/>
              </div>
            </div>
          </div>
          <Button
            id='roll-button'
            type='submit'
            title='Generate'
            className='no-select activate-button'
            disabled={this.state.loading}
            onClick={this.onSubmit}
          />
        </form>
      </div>
    );
  }
}

export default function AntipaletteFunction(props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return <Antipalette
    {...props}
    navigate={navigate}
    searchParams={searchParams}
    setSearchParams={setSearchParams}
  />;
}
