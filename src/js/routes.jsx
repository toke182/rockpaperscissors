import React from 'react';
import {HashRouter, Route} from 'react-router-dom';

import Instructions from './pages/instructions';
import Countdown from './pages/countdown';
import Results from './pages/results';

const routes = (
  <HashRouter>
    <div>
      <Route exact path="/" component={Instructions}/>
      <Route path="/countdown" component={Countdown}/>
      <Route path="/results" component={Results}/>
    </div>
  </HashRouter>
);

export default routes;