import React from "react";
import PropTypes from "prop-types";
import Chess from "chess.js";

// prettier-ignore
const colinWinning = {
  gameArray: ['Nf3', 'd5', 'b3', 'Nc6', 'Bb2', 'Bg4', 'e3', 'Qd7', 'h3', 'Bh5', 'Be2', 'O-O-O', 'Nd4',
    'Nxd4', 'Bxd4', 'Bxe2', 'Qxe2', 'f6', 'Bxa7','b6','Qa6#'],
  label: 'A recent win',
  white: 'Colin Harfst',
  black: 'letsmateout',
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

export class SetRandomGame extends React.Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: "start", gameRandomSeed: -1 };

  componentDidMount() {
    this.game = new Chess();
    if (this.props.setGame) {
    } else {
      const gameRandomSeed = Math.floor(Math.random() * 3);
      this.setState({ gameRandomSeed });
      const gameRecord = this.getGameOfRecord(gameRandomSeed);
      setTimeout(() => this.makeMoves(gameRecord.gameArray, 0), 650);
    }
  }

  getGameOfRecord = (gameRandomSeed) => {
    switch (gameRandomSeed) {
      case 0:
        return colinWinning;
      case 1:
        return colinLosing;
      default:
        return immortalGame;
    }
  };

  makeMoves = (gameMoves, index) => {
    let possibleMoves = this.game.moves();

    // exit if the game is over
    if (
      index === gameMoves.length ||
      this.game.game_over() === true ||
      this.game.in_draw() === true ||
      possibleMoves.length === 0
    )
      return;

    this.game.move(gameMoves[index]);
    this.setState({ fen: this.game.fen() });

    setTimeout(() => this.makeMoves(gameMoves, index + 1), 650);
  };

  render() {
    const { fen, gameRandomSeed } = this.state;
    const gameRecord = this.getGameOfRecord(this.state.gameRandomSeed);
    return (
      <div className="board-container">
        <h1>{gameRecord.label}</h1>
        {this.props.children({ position: fen })}

        {/* Show both white and black */}
        {gameRandomSeed > 1 && (
          <>
            <h2 style={{ marginTop: "24px", marginBottom: "0" }}>White: {gameRecord.white}</h2>
            <h2 style={{ marginTop: "20px", marginBottom: "0" }}>Black: {gameRecord.black}</h2>
          </>
        )}
        {/* Show just my name */}
        {gameRandomSeed <= 1 &&
          (gameRecord.orientation === "white" ? (
            <h2 style={{ marginTop: "24px", marginBottom: "0" }}>White: {gameRecord.white}</h2>
          ) : (
            <h2 style={{ marginTop: "24px", marginBottom: "0" }}>Black: {gameRecord.black}</h2>
          ))}
      </div>
    );
  }
}

export default SetRandomGame;
