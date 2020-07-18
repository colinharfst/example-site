import React, { useState, useEffect } from "react";
import "./chess.scss";
import SetRandomGame from "./chess-game";
import Chessboard from "chessboardjsx";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

export function ChessComp() {
  document.title = "Chess ft. the Immortal Game";

  const x = useParams();

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (x && x.datetime) {
      loadGameData(x.datetime);
    } else {
      setGameData(false);
    }
  }, [x]);

  const loadGameData = async (datetime) => {
    const game = await fetch(`/api/chess-game-data/${datetime}`).then(async (resp) => await resp.json());
    const gameInfo = {
      gameArray: game.gameMoves,
      label: "How did I do?",
      white: game.white === '[White "cph5wr"]' ? "Colin Harfst" : "",
      black: game.black === '[Black "cph5wr"]' ? "Colin Harfst" : "",
      orientation: game.white === '[White "cph5wr"]' ? "white" : "black",
      winner: game.result === '[Result "1-0"]' ? "white" : game.result === '[Result "0-1"]' ? "black" : "draw",
    };
    setGameData(gameInfo);
  };

  if (gameData === null) {
    return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
  }
  return (
    <SetRandomGame setGame={gameData}>
      {({ position }) => (
        <Chessboard
          className="chessboard"
          width={320}
          id="random"
          position={position}
          // TODO: Figure out how to pass orientation from gameData
          // orientation={gameData.orientation}
          draggable={false}
          transitionDuration={300}
          boardStyle={{
            borderRadius: "5px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
    </SetRandomGame>
  );
  // }
}

export default ChessComp;
