import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home } from "./components/home";
import { Sample } from "./components/sample";
import { ChessComp } from "./components/chess/chess";
import { Judge } from "./components/judge";
import { Resume } from "./components/resume";
import { Math } from "./components/math";

const linkStyle = { textDecoration: "none", color: "white" };

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav style={{ width: "100%" }}>
            <ul style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", padding: "0" }}>
              <li>
                <Link style={{ ...linkStyle, paddingRight: "24px" }} to="/">
                  --Welcome--
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/sample">
                  Sample
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/resume">
                  Resume
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/judge">
                  Judge
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/chess">
                  Chess
                </Link>
              </li>
              <li>
                <Link style={linkStyle} to="/math">
                  Math
                </Link>
              </li>
            </ul>
          </nav>

          <img src={logo} className="App-logo" alt="logo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
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
