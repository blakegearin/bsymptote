import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Button from './Button';
import Genuary_1_2022 from './genuary/1-2022.js';
import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function toggleSpinner(loading) {
    document.getElementById('spinnerBackground').style.display = loading ? '' : 'none';
  }

  useEffect(() => {
    new Genuary_1_2022(
      { params, location, navigate, searchParams, setSearchParams, refresh: false }
    )
    document.getElementById('randomBtn').style.display = '';
    setLoading(false);
  }, []);

  return (
    <div className='app'>
      <canvas id='myCanvas'></canvas>
      <Button
        id='randomBtn'
        title='Random'
        className='no-select'
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            new Genuary_1_2022(
              { params, location, navigate, searchParams, setSearchParams, refresh: true }
            );
            setLoading(false);
          }, 500);
        }}
        style={{display: 'none'}}
      />
      {toggleSpinner(loading)}
    </div>
  );
}
