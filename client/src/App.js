import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home } from './components/home';
import { Sample } from './components/sample';
import { ChessComp } from './components/chess';
import { Judge } from './components/judge';
import { Resume } from './components/resume';
import { Math } from './components/math';

function App() {
  return (
    <div className="App">
          <Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sample">Sample</Link>
            </li>
            <li>
              <Link to="/resume">Resume</Link>
            </li>
            <li>
              <Link to="/judge">Judge</Link>
            </li>
            <li>
              <Link to="/chess">Chess</Link>
            </li>
            <li>
              <Link to="/math">Math</Link>
            </li>
          </ul>
        </nav>

      </header>

        <Switch>
          <Route path="/resume">
            <Resume />
          </Route>
          <Route path="/judge">
            <Judge />
          </Route>
          <Route path="/chess">
            <ChessComp />
          </Route>
          <Route path="/math">
            <Math />
          </Route>
          <Route path="/sample">
            <Sample />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
