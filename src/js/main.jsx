require('../css/main.scss');

import React, {PropTypes, Component} from 'react';
import {render} from 'react-dom';
import routes from './routes';

import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducer from './reducers'

const store = createStore(reducer);

window.React = React;
window.store = store;


render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app')
);
