import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { VARIATIONS } from './utils/colors';

const GlobalStyles = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
  
  body, button {
    background-color: ${ VARIATIONS.structure.bg };

    color: ${ VARIATIONS.structure.textLowContrast };
  }

  :root {
    --shadow-color: 150deg 8% 0%;
    --shadow-elevation-low:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.16),
      0px 0.6px 0.7px -1.2px hsl(var(--shadow-color) / 0.16),
      0px 1.7px 1.9px -2.5px hsl(var(--shadow-color) / 0.16);
    --shadow-elevation-medium:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.16),
      0px 1.3px 1.5px -0.8px hsl(var(--shadow-color) / 0.16),
      0px 3.4px 3.8px -1.7px hsl(var(--shadow-color) / 0.16),
      0px 8.4px 9.5px -2.5px hsl(var(--shadow-color) / 0.16);
    --shadow-elevation-high:
      0px 0.3px 0.3px hsl(var(--shadow-color) / 0.15),
      0px 2.8px 3.2px -0.4px hsl(var(--shadow-color) / 0.15),
      0px 5.3px 6px -0.7px hsl(var(--shadow-color) / 0.15),
      0px 8.9px 10px -1.1px hsl(var(--shadow-color) / 0.15),
      0px 14.3px 16.1px -1.4px hsl(var(--shadow-color) / 0.15),
      0px 22.4px 25.2px -1.8px hsl(var(--shadow-color) / 0.15),
      0px 34.2px 38.5px -2.1px hsl(var(--shadow-color) / 0.15),
      0px 50.4px 56.8px -2.5px hsl(var(--shadow-color) / 0.15);
  }
`;


const App = (): JSX.Element => {
  const [count, setCount] = useState(0);

  return (
    <GlobalStyles>
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
          </button>
          <p>
          Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        </p>
      </div>
    </GlobalStyles>
  );
};

export default App;
