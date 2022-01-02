import React from 'react';
import Genuary_1_2022 from './genuary/1-2022.js';

class RandomButton extends React.Component {
  render() {
    return (
      <button
        id='randomBtn'
        onClick={
          (event) =>  {
            new Genuary_1_2022({ ...this.props, refresh: true });
          }
        }
        >
          Random
        </button>
    );
  }
}

export default RandomButton;
