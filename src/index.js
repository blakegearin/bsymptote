import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import WebFont from 'webfontloader';


import App from "./routes/App";
import RubberBandBalls from './routes/RubberBandBalls';
import './index.css';

WebFont.load({
  google: {
    families: ['Ubuntu', 'sans-serif']
  }
});

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="rubber-band-balls" element={<RubberBandBalls />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
