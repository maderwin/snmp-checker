import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Chart } from './chart';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const rootUrl = '.';

export class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar fluid staticTop>
          <Navbar.Header>
            <Navbar.Brand>SNMP Checker</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
        <Chart rootUrl={rootUrl} />
      </div>
    );
  }
}
