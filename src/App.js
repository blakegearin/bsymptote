import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import RandomButton from './RandomButton';
import Genuary_1_2022 from './genuary/1-2022.js';
import './App.css';

function App() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function newGenuary_1_2022(refresh = false) {
    new Genuary_1_2022(
      { params, location, navigate, searchParams, setSearchParams, refresh }
    );
  }

  useEffect(() => {
    newGenuary_1_2022();
  });

  return (
    <div>
      <canvas id='myCanvas'></canvas>
      <RandomButton
        location={location}
        navigate={navigate}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}

export default App;
