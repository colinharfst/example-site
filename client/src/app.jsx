import React from "react";
import "./app.scss";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header } from "./components/header/header";
import { Home } from "./components/home/home";
import { Resume } from "./components/resume/resume";
import { Math } from "./components/math/math";
import { MonteCarlo } from "./components/math/monte-carlo";
import { Baseball } from "./components/baseball/baseball";
import { ChessComp } from "./components/chess/chess";
import { ChessData } from "./components/chess/chess-data";
import { News } from "./components/news/news";
import { Writing } from "./components/writing/writing";
import { Maps } from "./components/maps/maps";
import { Icons } from "./components/widgets/icons";
import { DarkMode } from "./components/widgets/dark-mode";

export function App() {
  console.log("\\ o  ");
  console.log(" ( )>");
  console.log(" / \\ ");

  return (
    <div className="app dark-mode">
      <Router>
        <Header />
        <Switch>
          <Route path="/resume">
            <Resume />
          </Route>
          <Route path="/math">
            <Math />
          </Route>
          <Route path="/simulation">
            <MonteCarlo />
          </Route>
          <Route path="/baseball">
            <Baseball />
          </Route>
          <Route path="/chess">
            <ChessComp key="random-game" />
          </Route>
          <Route path="/chess-game/:datetime">
            <ChessComp key="specific-game" />
          </Route>
          <Route path="/chess-data">
            <ChessData />
          </Route>
          <Route path="/news">
            <News />
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
