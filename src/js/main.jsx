require('../css/main.scss');

import React, {Component} from 'react';
import {render} from 'react-dom';
import routes from './routes';

window.React = React;

render(routes, document.getElementById('app'));
