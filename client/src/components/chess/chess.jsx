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
    const loadGameData = async (datetime) => {
      const game = await fetch(`/api/chess-game/${datetime}`).then(async (resp) => await resp.json());
      const gameInfo = {
        gameArray: game.gameMoves,
        // label: "How did I do?",
        white: game.white === '[White "cph5wr"]' ? "Colin Harfst" : "",
        black: game.black === '[Black "cph5wr"]' ? "Colin Harfst" : "",
        orientation: game.white === '[White "cph5wr"]' ? "white" : "black",
        winner: game.result === '[Result "1-0"]' ? "white" : game.result === '[Result "0-1"]' ? "black" : "draw",
        whiteElo: game.whiteElo,
        blackElo: game.blackElo,
        timeControl: game.timeControl,
        ending: game.ending,
      };
      gameInfo.label =
        gameInfo.orientation === gameInfo.winner
          ? `A win with the ${gameInfo.orientation} pieces`
          : `A loss with the ${gameInfo.orientation} pieces`;
      gameInfo.sublabel1 = `Played on ${getDateString(datetime)}`;
      gameInfo.sublabel2 = `${gameInfo.orientation === gameInfo.winner ? "Putting" : "Leaving"} me at a rating of ${
        gameInfo.orientation === "white" ? gameInfo.whiteElo : gameInfo.blackElo
      }`;
      setGameData(gameInfo);
    };

    if (x && x.datetime) {
      loadGameData(x.datetime);
    } else {
      setGameData(false);
    }
  }, [x]);

  const getHoursString = (date) => {
    const hours = date.getHours();
    if (hours === 0) return "midnight";
    if (1 <= hours && hours <= 11) return `${hours} a.m.`;
    if (hours === 12) return "noon";
    return `${hours - 12} p.m.`;
  };

  const getDateString = (date) => {
    const d = new Date(date);
    const correctedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      monthNames[correctedDate.getMonth()]
    } ${correctedDate.getDate()}, ${correctedDate.getFullYear()} at ${getHoursString(correctedDate)}`;
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
