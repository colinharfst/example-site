import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export class Judge extends React.Component {
  state = { playerId: "592450", hrCount: null, isGameFinal: null, noGame: null, playerPlayed: null, lastHRCount: null, lastHRDate: null, wasHRLastGamePlayed: null };

  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    await this.loadTodaysHRCount(this.state.playerId);
    await this.getPlayer(this.state.playerId);
  };

  loadTodaysHRCount = async playerId => {
    const game = await fetch("/api/yankees-game").then(async resp => await resp.json());
    if (game.gameId) {
      const gamePlayerData = await fetch(`/api/game-player-data/${game.gameId}/${playerId}`).then(async resp => await resp.json());
      this.setState({ isGameFinal: game.isGameFinal, hrCount: gamePlayerData.hrCount, playerPlayed: gamePlayerData.playerPlayed });
    } else {
      this.setState({ noGame: true });
    }
  };

  getPlayer = async playerId => {
    const player = await fetch(`/api/player-hr/${playerId}`).then(async resp => await resp.json());
    this.setState({ lastHRCount: player.hrCount, lastHRDate: player.lastHRDate, wasHRLastGamePlayed: player.wasHRLastGamePlayed });
  };

  updatePlayerHR = async (playerId, hrCount, hrDate) => {
    await fetch(`/api/player-hr/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lastHRCount: hrCount, lastHRDate: hrDate, wasHRLastGamePlayed: true })
    });
  };

  updatePlayerNoHR = async playerId => {
    await fetch(`/api/player-hr/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wasHRLastGamePlayed: false })
    });
  };

  render() {
    if (this.state.hrCount === null) {
      return <CircularProgress />;
    }
    //  if no game
    //    if DB says hr in last game
    //    if DB says no hr in last game played
    //  if game not final
    //    if hit hr anyway
    //    if DB says hr in last game
    //    if DB says no hr in last game played
    return (
      <div>
        <h2>{`Here's some judge text, ${this.state.hrCount}`}</h2>
      </div>
    );
  }
}

export default Judge;
