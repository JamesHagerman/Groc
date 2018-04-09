import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '@blueprintjs/core/dist/blueprint.css'
// import '@blueprintjs/core/dist/blueprint-icons.css'

import { Button, Intent, Spinner, DatePickerFactory } from '@blueprintjs/core';


class App extends Component {
  render() {
    return (
      <div className="App" className='pt-dark'>
        <div>
          <button type='button' className='pt-button' tabIndex='0'>Some Button</button>
          <Spinner intent={Intent.PRIMARY} />
          <Button intent={Intent.SUCCESS}>
            deeeeeerp
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
