import { render } from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import WebFont from 'webfontloader';

import reportWebVitals from './reportWebVitals';
import Home from './home/Home';
import RubberBandBalls from './projects/rubber-band-balls/RubberBandBalls';
import Dice from './projects/dice/Dice';

import './index.css';

WebFont.load({
  google: {
    families: ['Ubuntu', 'sans-serif']
  }
});

const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
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
        path='d'
        element={<Dice />}
      />
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
