import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export class Judge extends React.Component {
  state = { playerId: "592450", hrCount: null, isGameFinal: null, noGame: null, lastHRCount: null, lastHRDate: null, wasHRLastGame: null };

  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    await this.loadTodaysHRCount(this.state.playerId);
    await this.getPlayer(this.state.playerId);
  };

  loadTodaysHRCount = async playerId => {
    const game = await fetch("/api/yankees-game-id").then(async resp => await resp.json());
    if (game.gameId) {
      const hrCount = await fetch(`/api/game-player-data/${game.gameId}/${playerId}`).then(async resp => (await resp.json()).hrCount);
      this.setState({ hrCount, isGameFinal: game.isGameFinal });
    } else {
      this.setState({ noGame: true });
    }
  };

  getPlayer = async playerId => {
    const player = await fetch(`/api/player-hr/${playerId}`).then(async resp => await resp.json());
    this.setState({ lastHRCount: player.hrCount, lastHRDate: player.lastHRDate, wasHRLastGame: player.wasHRLastGame });
  };

  updatePlayerHR = async (playerId, hrCount, hrDate) => {
    await fetch(`/api/player-hr/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lastHRCount: hrCount, lastHRDate: hrDate, wasHRLastGame: true })
    });
  };

  updatePlayerNoHR = async playerId => {
    await fetch(`/api/player-hr/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wasHRLastGame: false })
    });
  };

  render() {
    if (this.state.hrCount === null) {
      return <CircularProgress />;
    }
    return (
      <div>
        <h2>{`Here's some judge text, ${this.state.hrCount}`}</h2>
      </div>
    );
  }
}

export default Judge;
