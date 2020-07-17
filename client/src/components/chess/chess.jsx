import React, { useEffect } from "react";
import "./chess.scss";
import SetRandomGame from "./chess-game";
import Chessboard from "chessboardjsx";
import { useParams } from "react-router-dom";

export function ChessComp() {
  document.title = "Chess ft. the Immortal Game";

  const x = useParams();

  useEffect(() => {
    loadGameData(x.datetime);
    // console.log(x);
  }, [x]);

  // const paramm = () => {
  //   return useParams();
  // };
  // async componentDidMount() {
  const loadGameData = async (datetime) => {
    console.log(await fetch(`/api/chess-game-data/${datetime}`).then(async (resp) => await resp.json()));
  };
  //   console.log(useParams());
  //   // const x = await fetch("/api/chess-game-data").then(async (resp) => await resp.json());
  // }

  // const colinWinning = {
  //   gameArray: ['Nf3', 'd5', 'b3', 'Nc6', 'Bb2', 'Bg4', 'e3', 'Qd7', 'h3', 'Bh5', 'Be2', 'O-O-O', 'Nd4',
  //     'Nxd4', 'Bxd4', 'Bxe2', 'Qxe2', 'f6', 'Bxa7','b6','Qa6#'],
  //   label: 'A recent win',
  //   white: 'Colin Harfst',
  //   black: 'letsmateout',
  //   orientation: 'white',
  //   winner: 'white'
  // };

  // render() {
  return (
    <SetRandomGame setGame={false}>
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
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
    </SetRandomGame>
  );
  // }
}

export default ChessComp;
