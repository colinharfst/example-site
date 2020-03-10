import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

export class Judge extends React.Component {
  state = { hrCount: null, isGameFinal: null, isGameToday: null, playerPlayed: null, lastHRCount: null, lastHRDate: null, wasHRLastGamePlayed: null };

  componentDidMount = async () => {
    document.title = this.props.playerId === "592450" ? "Aaron Judge Stats" : "Cheater Jose Altuve Stats";
    await this.loadTodaysHRCount(this.props.playerId);
    await this.getPlayer(this.props.playerId);
  };

  componentDidUpdate = async prevProps => {
    if (this.props.playerId !== prevProps.playerId) {
      this.setState({ hrCount: null, isGameFinal: null, isGameToday: null, playerPlayed: null, lastHRCount: null, lastHRDate: null, wasHRLastGamePlayed: null });
      document.title = this.props.playerId === "592450" ? "Aaron Judge Stats" : "Cheater Jose Altuve Stats";
      await this.loadTodaysHRCount(this.props.playerId);
      await this.getPlayer(this.props.playerId);
    }
  };

  loadTodaysHRCount = async playerId => {
    // Alternatively
    // const game = await fetch("/api/master-scorecard").then(async resp => await resp.json());
    const game = await fetch(`/api/game/${this.props.playerId === "592450" ? "nyamlb" : "houmlb"}`).then(async resp => await resp.json());
    if (game.gameId) {
      this.setState({ isGameToday: true });
      const gamePlayerData = await fetch(`/api/game-player-data/${game.gameId}/${playerId}`).then(async resp => await resp.json());
      this.setState({ isGameFinal: game.isGameFinal, hrCount: parseInt(gamePlayerData.hrCount) || null, playerPlayed: gamePlayerData.playerPlayed });
      console.log("loadHRCount", this.state);
    } else {
      this.setState({ isGameToday: false });
    }
  };

  getPlayer = async playerId => {
    const player = await fetch(`/api/player-hr/${playerId}`).then(async resp => await resp.json());
    this.setState({ lastHRCount: player.lastHRCount, lastHRDate: player.lastHRDate, wasHRLastGamePlayed: player.wasHRLastGamePlayed });
    console.log("getPlayer", this.state);
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

  // updatePlayerNoHR = async playerId => {
  //   await fetch(`/api/player-hr/${playerId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ wasHRLastGamePlayed: false })
  //   });
  // };

  render() {
    const { playerName, teamName } = this.props;
    const { isGameToday, isGameFinal, playerPlayed, hrCount, wasHRLastGamePlayed, lastHRDate, lastHRCount } = this.state;

    if (isGameToday === null || lastHRCount === null) {
      return <CircularProgress />;
    }

    if (isGameToday) {
      if (hrCount) {
        return (
          <div>
            <h1>YES</h1>
            <h2>{`${playerName} hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""} today!`}</h2>
            <button onClick={this.props.changePlayer}>
              <ArrowRightIcon />
            </button>
          </div>
        );
      }
      if (isGameFinal) {
        if (playerPlayed) {
          return (
            <div>
              <h1>No</h1>
              <h2>{`${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}`}</h2>
              <button onClick={this.props.changePlayer}>
                <ArrowRightIcon />
              </button>
            </div>
          );
        }
        if (wasHRLastGamePlayed) {
          return (
            <div>
              <h1>YES</h1>
              <h2>{`${playerName} didn't play today, but he homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}.`}</h2>
              <button onClick={this.props.changePlayer}>
                <ArrowRightIcon />
              </button>
            </div>
          );
        }
        return (
          <div>
            <h1>No</h1>
            <h2>{`${playerName} didn't play today and he hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}`}</h2>
            <button onClick={this.props.changePlayer}>
              <ArrowRightIcon />
            </button>
          </div>
        );
      }
      if (wasHRLastGamePlayed) {
        return (
          <div>
            <h1>YES</h1>
            <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${
              lastHRCount > 1 ? "s" : ""
            }.`}</h2>
            <button onClick={this.props.changePlayer}>
              <ArrowRightIcon />
            </button>
          </div>
        );
      }
      return (
        <div>
          <h1>No</h1>
          <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}`}</h2>
          <button onClick={this.props.changePlayer}>
            <ArrowRightIcon />
          </button>
        </div>
      );
    }
    if (wasHRLastGamePlayed) {
      return (
        <div>
          <h1>YES</h1>
          <h2>{`The ${teamName} didn't play today, but ${playerName} homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}.`}</h2>
          <button onClick={this.props.changePlayer}>
            <ArrowRightIcon />
          </button>
        </div>
      );
    }
    return (
      <div>
        <h1>No</h1>
        <h2>{`The ${teamName} didn't play today, but ${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""}`}</h2>
        <button onClick={this.props.changePlayer}>
          <ArrowRightIcon />
        </button>
      </div>
    );
  }
}

export default Judge;
