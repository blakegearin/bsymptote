import { render } from 'react-dom';
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';
import WebFont from 'webfontloader';

import reportWebVitals from './reportWebVitals';
import Home from './home/Home';
import RubberBandBalls from './projects/rubber-band-balls/RubberBandBalls';
import Dice from './projects/dice/Dice';
import Space from './projects/space/Space';
import Antipalette from './projects/antipalette/Antipalette';

import './index.css';

WebFont.load({
  google: {
    families: ['Ubuntu', 'sans-serif']
  }
});

const rootElement = document.getElementById('root');
render(
  <HashRouter>
    <Routes>
      <Route
        path='/'
        element={<Home />}
      />
      <Route
        path='rubber-band-balls'
        element={<RubberBandBalls />}
      />
      <Route
        path='dice'
        element={<Dice />}
      />
      <Route
        path='space'
        element={<Space />}
      />
      <Route
        path='antipalette'
        element={<Antipalette />}
      />
      <Route path='*' element={<Home />} />
    </Routes>
  </HashRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
