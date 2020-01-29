import React, { Component } from "react";
import SetRandomGame from "./chessGame";
import Chessboard from "chessboardjsx";
import "./chess.scss";

export class ChessComp extends Component {
  render() {
    return (
      <SetRandomGame>
        {({ position }) => (
          <Chessboard
            className="chessboard"
            width={320}
            id="random"
            position={position}
            // TODO: Figure out how to pass orientation from gameRecord
            // orientation={gameRecord.orientation}
            draggable={false}
            transitionDuration={300}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)"
            }}
          />
        )}
      </SetRandomGame>
      // </div>
    );
  }
}

export default ChessComp;
