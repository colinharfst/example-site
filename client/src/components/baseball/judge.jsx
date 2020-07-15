import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

export class Judge extends React.Component {
  state = {
    hrCount: null,
    isGameFinal: null,
    isGameToday: null,
    playerPlayed: null,
    lastHRCount: null,
    lastHRDate: null,
    wasHRLastGamePlayed: null,
  };

  componentDidMount = async () => {
    document.title =
      this.props.playerId === "592450"
        ? "Aaron Judge Stats"
        : "Cheater José Altuve Stats";
    await this.loadTodaysHRCount(this.props.playerId);
    await this.getPlayer(this.props.playerId);
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.playerId !== prevProps.playerId) {
      this.setState({
        hrCount: null,
        isGameFinal: null,
        isGameToday: null,
        playerPlayed: null,
        lastHRCount: null,
        lastHRDate: null,
        wasHRLastGamePlayed: null,
      });
      document.title =
        this.props.playerId === "592450"
          ? "Aaron Judge Stats"
          : "Cheater José Altuve Stats";
      await this.loadTodaysHRCount(this.props.playerId);
      await this.getPlayer(this.props.playerId);
    }
  };

  loadTodaysHRCount = async (playerId) => {
    // Alternatively
    // const game = await fetch("/api/master-scorecard").then(async resp => await resp.json());
    const game = await fetch(
      `/api/game/${this.props.playerId === "592450" ? "nyamlb" : "houmlb"}`
    ).then(async (resp) => await resp.json());
    if (game.gameId) {
      this.setState({ isGameToday: true });
      const gamePlayerData = await fetch(
        `/api/game-player-data/${game.gameId}/${playerId}`
      ).then(async (resp) => await resp.json());
      this.setState({
        isGameFinal: game.isGameFinal,
        hrCount: parseInt(gamePlayerData.hrCount) || null,
        playerPlayed: gamePlayerData.playerPlayed,
      });
      console.log("loadHRCount", this.state);
    } else {
      this.setState({ isGameToday: false });
    }
  };

  getPlayer = async (playerId) => {
    const player = await fetch(`/api/player-hr/${playerId}`).then(
      async (resp) => await resp.json()
    );
    this.setState({
      lastHRCount: player.lastHRCount,
      lastHRDate: this.getDateString(player.lastHRDate),
      wasHRLastGamePlayed: player.wasHRLastGamePlayed,
    });
    console.log("getPlayer", this.state);
  };

  // updatePlayerHR = async (playerId, hrCount, hrDate) => {
  //   await fetch(`/api/player-hr/${playerId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ lastHRCount: hrCount, lastHRDate: hrDate, wasHRLastGamePlayed: true })
  //   });
  // };

  // updatePlayerNoHR = async playerId => {
  //   await fetch(`/api/player-hr/${playerId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ wasHRLastGamePlayed: false })
  //   });
  // };

  getDateString = (date) => {
    const d = new Date(date);
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
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  renderPlayerQuestion = () => {
    const { playerId } = this.props;
    if (playerId === "592450") {
      return <h1>Did Aaron Judge homer?</h1>;
    }
    return <h1>Did José Altuve homer?</h1>;
  };

  renderNextPlayerButton = () => {
    const { playerId, changePlayer } = this.props;
    if (playerId === "592450") {
      return (
        <button className="next-player-button" onClick={changePlayer}>
          <h3>What about notorious cheater José Altuve?</h3>
          <ArrowRightIcon />
        </button>
      );
    }
    return (
      <button className="next-player-button" onClick={changePlayer}>
        <h3>Try Aaron Judge</h3>
        <ArrowRightIcon />
      </button>
    );
  };

  render() {
    const { playerName, teamName } = this.props;
    const {
      isGameToday,
      isGameFinal,
      playerPlayed,
      hrCount,
      wasHRLastGamePlayed,
      lastHRDate,
      lastHRCount,
    } = this.state;

    if (isGameToday === null || lastHRCount === null) {
      return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
    }

    if (isGameToday) {
      if (hrCount) {
        return (
          <div>
            {this.renderPlayerQuestion()}
            <h1 className="yes-text">YES</h1>
            <h2>{`${playerName} hit ${lastHRCount} home run${
              lastHRCount > 1 ? "s" : ""
            } today!`}</h2>
            {this.renderNextPlayerButton()}
          </div>
        );
      }
      if (isGameFinal) {
        if (playerPlayed) {
          return (
            <div>
              {this.renderPlayerQuestion()}
              <h1 className="no-text">No</h1>
              <h2>{`${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${
                lastHRCount > 1 ? "s" : ""
              }.`}</h2>
              {this.renderNextPlayerButton()}
            </div>
          );
        }
        if (wasHRLastGamePlayed) {
          return (
            <div>
              {this.renderPlayerQuestion()}
              <h1 className="yes-text">YES</h1>
              <h2>{`${playerName} didn't play today, but he homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${
                lastHRCount > 1 ? "s" : ""
              }.`}</h2>
              {this.renderNextPlayerButton()}
            </div>
          );
        }
        return (
          <div>
            {this.renderPlayerQuestion()}
            <h1 className="no-text">No</h1>
            <h2>{`${playerName} didn't play today and he hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${
              lastHRCount > 1 ? "s" : ""
            }.`}</h2>
            {this.renderNextPlayerButton()}
          </div>
        );
      }
      if (wasHRLastGamePlayed) {
        return (
          <div>
            {this.renderPlayerQuestion()}
            <h1 className="yes-text">YES</h1>
            <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${
              lastHRCount > 1 ? "s" : ""
            }.`}</h2>
            {this.renderNextPlayerButton()}
          </div>
        );
      }
      return (
        <div>
          {this.renderPlayerQuestion()}
          <h1 className="no-text">No</h1>
          <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${
            lastHRCount > 1 ? "s" : ""
          }.`}</h2>
          {this.renderNextPlayerButton()}
        </div>
      );
    }
    if (wasHRLastGamePlayed) {
      return (
        <div>
          {this.renderPlayerQuestion()}
          <h1 className="yes-text">YES</h1>
          <h2>{`The ${teamName} didn't play today, but ${playerName} homered in his last game played on ${lastHRDate}. He hit ${lastHRCount} home run${
            lastHRCount > 1 ? "s" : ""
          }.`}</h2>
          {this.renderNextPlayerButton()}
        </div>
      );
    }
    return (
      <div>
        {this.renderPlayerQuestion()}
        <h1 className="no-text">No</h1>
        <h2>{`The ${teamName} didn't play today, but ${playerName} hasn't hit a homer since ${lastHRDate}. He hit ${lastHRCount} home run${
          lastHRCount > 1 ? "s" : ""
        }.`}</h2>
        {this.renderNextPlayerButton()}
      </div>
    );
  }
}

export default Judge;
