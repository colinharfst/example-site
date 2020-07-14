import * as React from "react";
import logo from "./react-logo.svg";
import "./app.scss";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home } from "./components/home/home";
import { Baseball } from "./components/baseball/baseball";
import { Resume } from "./components/resume/resume";
import { ChessComp } from "./components/chess/chess";
import { ChessData } from "./components/chess/chess-data";
import { Math } from "./components/math/math";
import { Writing } from "./components/writing/writing";
import { Maps } from "./components/maps/maps";

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
                <Link className="link" to="/math">
                  Math
                </Link>
              </li>
              <li>
                <Link className="link" to="/baseball">
                  Baseball
                </Link>
              </li>
              <li>
                <span className="link">
                  Chess
                  <div className="sublinks">
                    <Link className="link" to="/chess">
                      Games
                    </Link>
                    <Link className="link" to="/chess-data">
                      Data
                    </Link>
                  </div>
                </span>
              </li>
              {/* <li>
                <Link className="link" to="/math">
                  Writing
                </Link>
              </li>
              <li>
                <Link className="link" to="/math">
                  Maps
                </Link>
              </li> */}
            </ul>
          </nav>

          <img src={logo} className="app-logo" alt="logo" />
        </header>

        <Switch>
          <Route path="/resume">
            <Resume />
          </Route>
          <Route path="/baseball">
            <Baseball />
          </Route>
          <Route path="/chess">
            <ChessComp />
          </Route>
          <Route path="/chess-data">
            <ChessData />
          </Route>
          <Route path="/math">
            <Math />
          </Route>
          <Route path="/writing">
            <Writing />
          </Route>
          <Route path="/maps">
            <Maps />
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
