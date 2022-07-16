import React from 'react';
import reactCSS from 'reactcss'
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CopyToClipboard } from 'react-copy-to-clipboard';
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
  document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
}

function randomIntFromInterval(min, max, method = Math.random()) {
  return Math.floor(method * (max - min + 1) + min);
}

// Credit: https://stackoverflow.com/a/41491220/5988852
function pickTextColorBasedOnBgColorSimple(bgColor) {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ? 'black' : 'white';
}

function totalHexColors() {
  return Math.pow(256, 3)
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function setContentSize(antipalette = null) {
  if (antipalette == null) antipalette = document.getElementById('antipalette-content');

  // 120px is the offset of the Random button
  const windowHeight = `${window.innerHeight - 120}px`;
  const windowWidth = `${window.innerWidth}px`;

  antipalette.style.width = windowWidth;
  antipalette.style.height = windowHeight;
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
    let antipalette = document.getElementById('antipalette-content');
    if (antipalette == null) {
      console.error('antipalette-content wasn\'t found');
      return;
    }
    antipalette.innerHTML = '';

    setContentSize(antipalette);

    let targetColor = this.state.hexColor;
    let type = this.state.type;
    if (targetColor == null || type == null) return null;

    let limit = null;
    let colorsFound = [];

    for (let i = 0; i < totalHexColors(); ++i) {
      if (limit != null && limit === 0) break;

      const color = '#' + i.toString(16).padStart(6, '0');

      if (targetColor === blinder[type](color)) {
        colorsFound.push(color);
        document.documentElement.style.setProperty('--palette-amount', colorsFound.length);

        let element = document.createElement('div');
        element.classList = 'palette-color';
        element.style = `
          background-color: ${color};
          color: ${pickTextColorBasedOnBgColorSimple(color)};
        `;
        element.innerText = color;

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
    setContentSize();
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
                  4. when I say "all the colors" I do mean all 16,777,216 RGB color combinations, so please be patient
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
