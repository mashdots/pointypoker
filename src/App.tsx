import React, { useState } from 'react';

import './App.css';
import UserSetup from './modules/user/UserSetup';
import { GlobalStyles } from './utils/styles';

const App = (): JSX.Element => {  
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <UserSetup />
      </div>
    </>
  );
};

export default App;
