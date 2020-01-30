import * as React from "react";
import logo from "./react-logo.svg";
import "./app.scss";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home } from "./components/home";
import { Judge } from "./components/judge";
import { Resume } from "./components/resume";
import { ChessComp } from "./components/chess/chess";
import { Math } from "./components/math";

export function App() {
  console.log("\\ o  ");
  console.log(" ( )>");
  console.log(" / \\ ");

  return (
    <div className="app">
      <Router>
        <header className="app-header">
          <nav style={{ width: "100%" }}>
            <ul className="app-header-list">
              <li className="welcome-link">
                <Link className="link" to="/">
                  --Welcome--
                </Link>
              </li>
              <li>
                <Link className="link" to="/resume">
                  Resume
                </Link>
              </li>
              <li>
                <Link className="link" to="/judge">
                  Judge
                </Link>
              </li>
              <li>
                <Link className="link" to="/chess">
                  Chess
                </Link>
              </li>
              <li>
                <Link className="link" to="/math">
                  Math
                </Link>
              </li>
            </ul>
          </nav>

          <img src={logo} className="app-logo" alt="logo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
