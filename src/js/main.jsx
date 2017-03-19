require('../css/main.scss');

import React, {Component} from 'react';
import {render} from 'react-dom';

class TestJsxConfig extends Component{
  render() {
    return (
      <h1> React config Works :) </h1>
    );
  }
}

render(<TestJsxConfig />, document.getElementById('app'));