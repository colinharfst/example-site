import React from "react";
import "./app.scss";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header } from "./components/header/header";
import { Home } from "./components/home/home";
import { Resume } from "./components/resume/resume";
import { Math } from "./components/math/math";
import { Baseball } from "./components/baseball/baseball";
import { ChessComp } from "./components/chess/chess";
import { ChessData } from "./components/chess/chess-data";
import { Writing } from "./components/writing/writing";
import { Maps } from "./components/maps/maps";
import { Icons } from "./components/widgets/icons";
import { DarkMode } from "./components/widgets/dark-mode";

export function App() {
  console.log("\\ o  ");
  console.log(" ( )>");
  console.log(" / \\ ");

  return (
    <div className="app">
      <Router>
        <Header />
        <Switch>
          <Route path="/resume">
            <Resume />
          </Route>
          <Route path="/math">
            <Math />
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
      <Icons />
      <DarkMode />
    </div>
  );
}

export default App;
