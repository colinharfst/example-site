import React, { Component } from "react";
import PropTypes from "prop-types";
import Chess from "chess.js";
import Chessboard from "chessboardjsx";

// prettier-ignore
const colinWinning = {
  gameArray: ['b3', 'd5', 'Bb2', 'c5', 'Nf3', 'Nf6', 'd4', 'e6', 'e3', 'Nc6', 'Bd3', 'Qb6', 'Nbd2',
    'Bd7', 'O-O', 'Nb4', 'Be2', 'Be7', 'c4', 'dxc4', 'Nxc4', 'Qc7', 'Nce5', 'O-O', 'a3', 'Nc6', 'dxc5',
    'Bxc5', 'b4','Bb6', 'Nxd7', 'Nxd7', 'Rc1', 'Rad8', 'Bd3', 'Nde5', 'Nxe5'],
  label: 'A recent win',
  white: 'Colin Harfst',
  black: 'Theoden52',
  orientation: 'white',
  winner: 'white'
};

// prettier-ignore
const colinLosing = {
  gameArray: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4', 'Bf5', 'e3', 'e6', 'Bd3', 'Bg6', 'Ne5', 'Be4', 'Nd2', 'Bxg2',
    'Rg1', 'Bh3', 'Rg3', 'Bf5', 'Qe2', 'c5', 'O-O-O', 'Bxd3', 'Qxd3', 'c4', 'Qe2', 'Qa5', 'Kb1', 'Nc6', 'c3',
    'g6', 'Rdg1', 'Bd6', 'Ndxc4', 'Qb5', 'Nxd6+'],
  label: 'A shameful loss',
  white: 'RomanBenedetti',
  black: 'Colin Harfst',
  orientation: 'black',
  winner: 'white'
};

// prettier-ignore
const immortalGame = {
  gameArray: ['e4', 'e5', 'f4', 'exf4', 'Bc4', 'Qh4+', 'Kf1', 'b5', 'Bxb5', 'Nf6', 'Nf3', 'Qh6', 'd3', 'Nh5', 
    'Nh4', 'Qg5', 'Nf5', 'c6', 'g4', 'Nf6', 'Rg1', 'cxb5', 'h4', 'Qg6', 'h5', 'Qg5', 'Qf3', 'Ng8', 'Bxf4', 'Qf6',
    'Nc3', 'Bc5', 'Nd5', 'Qxb2', 'Bd6', 'Bxg1', 'e5', 'Qxa1', 'Ke2', 'Na6', 'Nxg7', 'Kd8', 'Qf6', 'Nxf6', 'Be7'],
  label: 'Immortal Game (1851)',
  white: 'Anderssen',
  black: 'Kieseritzky',
  orientation: 'white',
  winner: 'white'
};

class RandomVsRandom extends Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: "start", gameRandomSeed: -1 };

  componentDidMount() {
    this.game = new Chess();
    const gameRandomSeed = Math.floor(Math.random() * 3);
    this.setState({ gameRandomSeed });
    const gameRecord = this.getGameOfRecord(gameRandomSeed);
    setTimeout(() => this.makeNextRandomMove(gameRecord.gameArray, 0), 650);
  }

  getGameOfRecord = gameRandomSeed => {
    switch (gameRandomSeed) {
      case 0:
        return colinWinning;
      case 1:
        return colinLosing;
      default:
        return immortalGame;
    }
  };

  makeNextRandomMove = (gameMoves, index) => {
    let possibleMoves = this.game.moves();

    // exit if the game is over
    if (index === gameMoves.length || this.game.game_over() === true || this.game.in_draw() === true || possibleMoves.length === 0) return;

    this.game.move(gameMoves[index]);
    this.setState({ fen: this.game.fen() });

    setTimeout(() => this.makeNextRandomMove(gameMoves, index + 1), 650);
  };

  render() {
    const { fen } = this.state;
    const gameRecord = this.getGameOfRecord(this.state.gameRandomSeed);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {this.props.children({ position: fen })}
        <h1>{gameRecord.label}</h1>
        <h2 style={{ marginBottom: "0" }}>White: {gameRecord.white}</h2>
        <h2 style={{ marginBottom: "0" }}>Black: {gameRecord.black}</h2>
      </div>
    );
  }
}

/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
export default function RandomVsRandomGame() {
  return (
    <RandomVsRandom>
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
    </RandomVsRandom>
  );
}
