import React, { Component } from "react";

import RandomVsRandomGame from "./chess/attempt";

export class ChessComp extends Component {
  render() {
    return (
      <div style={boardsContainer}>
        <RandomVsRandomGame />
      </div>
    );
  }
}

export default ChessComp;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50
};
