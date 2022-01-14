import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

export class Judge extends React.Component {
  state = {
    isGameToday: null,
    isPreGame: null,
    isGameFinal: null,
    isPostponed: null,
    playerPlayed: null,
    hrCount: null,
    lastHRCount: null,
    lastHRDate: null,
    wasHRLastGamePlayed: null,
    playedInLastGame: null,
  };

  componentDidMount = async () => {
    document.title = this.getDocumentTitle();
    await Promise.all([this.getLiveData(), this.getStoredData()]);
    console.log(this.state);
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.playerId !== prevProps.playerId) {
      this.setState({
        isGameToday: null,
        isPreGame: null,
        isGameFinal: null,
        isPostponed: null,
        playerPlayed: null,
        hrCount: null,
        lastHRCount: null,
        lastHRDate: null,
        wasHRLastGamePlayed: null,
        playedInLastGame: null,
      });
      document.title = this.getDocumentTitle();
      await Promise.all([this.getLiveData(), this.getStoredData()]);
      console.log(this.state);
    }
  };

  getDocumentTitle = () => {
    switch (this.props.playerId) {
      case "592450":
        return "Aaron Judge Stats";
      case "514888":
        return "Cheater José Altuve Stats";
      case "519317":
        return "Giancarlo Stanton Stats";
      case "650402":
        return "Gleyber Torres Stats";
      case "544369":
        return "Didi Gregorius Stats";
      default:
        return null;
    }
  };

	getLiveData = async () => {
		const { playerId } = this.props;
		console.log("in func");
		const liveData = await fetch(
			`/api/live-baseball/${playerId === "514888" ? "houmlb" : playerId === "544369" ? "phimlb" : "nyamlb"}/${
				this.props.playerId
			}`
		).then(async resp => {
			if (resp.ok) return await resp.json();
			else return { isGameToday: false };
		});
		this.setState({ ...liveData });
	};

  getStoredData = async () => {
    const storedData = await fetch(`/api/stored-baseball/${this.props.playerId}`).then(
      async (resp) => await resp.json()
    );
    this.setState({
      lastHRCount: storedData.lastHRCount,
      lastHRDate: this.getDateString(storedData.lastHRDate),
      wasHRLastGamePlayed: storedData.wasHRLastGamePlayed,
      playedInLastGame: storedData.playedInLastGame,
    });
  };

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
    switch (this.props.playerId) {
      case "592450":
        return <h1>Did the honorable Aaron Judge homer?</h1>;
      case "514888":
        return <h1>Did notorious cheater José Altuve homer?</h1>;
      case "519317":
        return <h1>Did Giancarlo Stanton homer?</h1>;
      case "650402":
        return <h1>Did Gleyber Torres homer?</h1>;
      case "544369":
        return <h1>Did former Yankee Didi Gregorius homer?</h1>;
      default:
        return null;
    }
  };

  renderNextPlayerButton = () => {
    const { playerId, changePlayer } = this.props;
    switch (playerId) {
      case "592450":
        return (
          <button className="next-player-button" onClick={() => changePlayer("Altuve")}>
            <h3>What about notorious cheater José Altuve?</h3>
            <ArrowRightIcon />
          </button>
        );
      case "514888":
        return (
          <div className="next-player-button-flex">
            <button className="next-player-button" onClick={() => changePlayer("G")}>
              <h3>Try Giancarlo Stanton</h3>
              <ArrowRightIcon />
            </button>
            <button className="next-player-button" onClick={() => changePlayer("GT")}>
              <h3>Or Gleyber Torres</h3>
              <ArrowRightIcon />
            </button>
          </div>
        );
      case "519317":
        return (
          <div className="next-player-button-flex">
            <button className="next-player-button" onClick={() => changePlayer("GT")}>
              <h3>Try Gleyber Torres</h3>
              <ArrowRightIcon />
            </button>
            <button className="next-player-button" onClick={() => changePlayer("Didi")}>
              <h3>Or former Yankee Didi Gregorius</h3>
              <ArrowRightIcon />
            </button>
          </div>
        );
      case "650402":
        return (
          <div className="next-player-button-flex">
            <button className="next-player-button" onClick={() => changePlayer("G")}>
              <h3>Try Giancarlo Stanton</h3>
              <ArrowRightIcon />
            </button>
            <button className="next-player-button" onClick={() => changePlayer("Didi")}>
              <h3>Or former Yankee Didi Gregorius</h3>
              <ArrowRightIcon />
            </button>
          </div>
        );
      case "544369":
        return (
          <button className="next-player-button" onClick={() => changePlayer("Judge")}>
            <h3>Try Aaron Judge</h3>
            <ArrowRightIcon />
          </button>
        );
      default:
        break;
    }
  };

  // This is pretty out of control with ifs, but oh well
  render() {
    const { playerName, teamName } = this.props;
    const {
      isGameToday,
      isPreGame,
      isGameFinal,
      isPostponed,
      playerPlayed,
      hrCount,
      lastHRCount,
      lastHRDate,
      wasHRLastGamePlayed,
      playedInLastGame,
    } = this.state;

    if (isGameToday === null || lastHRCount === null) {
      return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
    }

    if (isGameToday && !isPostponed) {
      // Game today
      if (isPreGame) {
        // Game today & Pre-game
        if (wasHRLastGamePlayed) {
          // Game today & Pre-game & Homered in last game
          if (playedInLastGame) {
            // Game today & Pre-game & Homered in last game & Played in last game
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="yes-text">YES</h1>
                <h2>{`${playerName} did hit a homer in the ${teamName}' last game on ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          } else {
            // Game today & Pre-game & Homered in last game & Didn't play in last game
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="no-text">No</h1>
                <h2>{`${playerName} didn't play in the ${teamName}' last game, but he did hit a homer in his last game with the team on ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          }
        } else {
          // Game today & Pre-game & Didn't homer in last game
          return (
            <div>
              {this.renderPlayerQuestion()}
              <h1 className="no-text">No</h1>
              <h2>{`${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
                lastHRCount > 1 ? "s" : ""
              }.`}</h2>
              {this.renderNextPlayerButton()}
            </div>
          );
        }
      } else if (isGameFinal) {
        // Game today & Game over
        if (playerPlayed) {
          //  Game today & Game over & Player played
          if (hrCount) {
            // Game today & Game over & Player played & Homered today
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="yes-text">YES</h1>
                <h2>{`${playerName} hit ${hrCount} home run${hrCount > 1 ? "s" : ""} today!`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          } else {
            // Game today & Game over & Player played & Didn't homer today
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="no-text">No</h1>
                <h2>{`${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          }
        } else {
          // Game today & Game over & Player didn't play
          if (wasHRLastGamePlayed) {
            // Game today & Game over & Player didn't play & Homered in last game & Didn't play in last game
            // We can infer "Didn't play in last game" since the "Game over" and "Player didn't play"
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="no-text">No</h1>
                <h2>{`${playerName} didn't play today, but he did hit a homer in his last game with the ${teamName} on ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          } else {
            // Game today & Game over & Player didn't play & Didn't homer in last game
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="no-text">No</h1>
                <h2>{`${playerName} didn't play today and he hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          }
        }
      } else {
        // Game today & Game in progress
        if (playerPlayed) {
          // Game today & Game in progress & Player played
          if (hrCount) {
            // Game today & Game in progress & Player played & Homered today
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="yes-text">YES</h1>
                <h2>{`${playerName} hit ${hrCount} home run${hrCount > 1 ? "s" : ""} today!`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          } else {
            // Game today & Game in progress & Player played & Didn't homer yet
            if (wasHRLastGamePlayed) {
              // Game today & Game in progress & Player played & Didn't homer yet & Homered in last game
              if (playedInLastGame) {
                // Game today & Game in progress & Player played & Didn't homer yet & Homered in last game & Played in last game
                return (
                  <div>
                    {this.renderPlayerQuestion()}
                    <h1 className="yes-text">YES</h1>
                    <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} did hit a homer in the team's last game on ${lastHRDate} when he hit ${lastHRCount} home run${
                      lastHRCount > 1 ? "s" : ""
                    }.`}</h2>
                    {this.renderNextPlayerButton()}
                  </div>
                );
              } else {
                // Game today & Game in progress & Player played & Didn't homer yet & Homered in last game & Didn't play in last game
                return (
                  <div>
                    {this.renderPlayerQuestion()}
                    <h1 className="no-text">No</h1>
                    <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} did hit a homer in his last game with the team on ${lastHRDate} when he hit ${lastHRCount} home run${
                      lastHRCount > 1 ? "s" : ""
                    }.`}</h2>
                    {this.renderNextPlayerButton()}
                  </div>
                );
              }
            } else {
              // Game today & Game in progress & Player played & Didn't homer yet & Didn't homer in last game
              return (
                <div>
                  {this.renderPlayerQuestion()}
                  <h1 className="no-text">No</h1>
                  <h2>{`The ${teamName} haven't finished playing yet today and ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
                    lastHRCount > 1 ? "s" : ""
                  }.`}</h2>
                  {this.renderNextPlayerButton()}
                </div>
              );
            }
          }
        } else {
          // Game today & Game in progress & Player hasn't played yet
          if (wasHRLastGamePlayed) {
            // Game today & Game in progress & Player hasn't played yet & Homered in last game
            if (playedInLastGame) {
              // Game today & Game in progress & Player hasn't played yet & Homered in last game & Played in last game
              return (
                <div>
                  {this.renderPlayerQuestion()}
                  <h1 className="yes-text">YES</h1>
                  <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} did hit a homer in the team's last game on ${lastHRDate} when he hit ${lastHRCount} home run${
                    lastHRCount > 1 ? "s" : ""
                  }.`}</h2>
                  {this.renderNextPlayerButton()}
                </div>
              );
            } else {
              // Game today & Game in progress & Player hasn't played yet & Homered in last game & Didn't play in last game
              return (
                <div>
                  {this.renderPlayerQuestion()}
                  <h1 className="no-text">No</h1>
                  <h2>{`The ${teamName} haven't finished playing yet today and ${playerName} didn't play in the team's last game, but he did hit a homer in his last game with the team on ${lastHRDate} when he hit ${lastHRCount} home run${
                    lastHRCount > 1 ? "s" : ""
                  }.`}</h2>
                  {this.renderNextPlayerButton()}
                </div>
              );
            }
          } else {
            // Game today & Game in progress & Player hasn't played yet & Didn't homer in last game
            return (
              <div>
                {this.renderPlayerQuestion()}
                <h1 className="no-text">No</h1>
                <h2>{`The ${teamName} haven't finished playing yet today and ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
                  lastHRCount > 1 ? "s" : ""
                }.`}</h2>
                {this.renderNextPlayerButton()}
              </div>
            );
          }
        }
      }
    } else {
      // No game today
      if (wasHRLastGamePlayed) {
        // No game today & Homered in last game
        if (playedInLastGame) {
          // No game today & Homered in last game & Played in last game
          return (
            <div>
              {this.renderPlayerQuestion()}
              <h1 className="yes-text">YES</h1>
              <h2>{`The ${teamName} ${
                isPostponed ? "aren't playing" : "don't play"
              } today, but ${playerName} did hit a homer in the team's last game on ${lastHRDate} when he hit ${lastHRCount} home run${
                lastHRCount > 1 ? "s" : ""
              }.`}</h2>
              {this.renderNextPlayerButton()}
            </div>
          );
        } else {
          // No game today & Homered in last game & Didn't play in last game
          return (
            <div>
              {this.renderPlayerQuestion()}
              <h1 className="no-text">No</h1>
              <h2>{`The ${teamName} ${
                isPostponed ? "aren't playing" : "don't play"
              } today and ${playerName} didn't play in the team's last game, but he did hit a homer in his last game with the team on ${lastHRDate} when he hit ${lastHRCount} home run${
                lastHRCount > 1 ? "s" : ""
              }.`}</h2>
              {this.renderNextPlayerButton()}
            </div>
          );
        }
      } else {
        // No game today & Didn't homer in last game
        return (
          <div>
            {this.renderPlayerQuestion()}
            <h1 className="no-text">No</h1>
            <h2>{`The ${teamName} ${
              isPostponed ? "aren't playing" : "don't play"
            } today and ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
              lastHRCount > 1 ? "s" : ""
            }.`}</h2>
            {this.renderNextPlayerButton()}
          </div>
        );
      }
    }
  }
}

export default Judge;
