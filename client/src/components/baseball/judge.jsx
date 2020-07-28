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
    document.title = this.props.playerId === "592450" ? "Aaron Judge Stats" : "Cheater José Altuve Stats";
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
      document.title = this.props.playerId === "592450" ? "Aaron Judge Stats" : "Cheater José Altuve Stats";
      // Not making synchronous api/live-baseball will update MongoDB and impact api/stored-baseball
      // await Promise.all([this.getLiveData(), this.getStoredData()]);
      await this.getLiveData();
      await this.getStoredData();
      console.log(this.state);
    }
  };

  getLiveData = async () => {
    const liveData = await fetch(
      `/api/live-baseball/${this.props.playerId === "592450" ? "nyamlb" : "houmlb"}/${this.props.playerId}`
    ).then(async (resp) => await resp.json());
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
    const { playerId } = this.props;
    if (playerId === "592450") {
      return <h1>Did the honorable Aaron Judge homer?</h1>;
    }
    return <h1>Did notorious cheater José Altuve homer?</h1>;
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
                <h2>{`${playerName} hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""} today!`}</h2>
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
            // Game today & Game over & Player didn't play & Homered in last game
            if (playedInLastGame) {
              // Should never happen since if the game is over, playedInLastGame should be false
              // Game today & Game over & Player didn't play & Homered in last game & Played in last game
              return (
                <div>
                  {this.renderPlayerQuestion()}
                  <h1 className="no-text">No</h1>
                  <h2>{`${playerName} didn't play today, but he did hit a homer in the ${teamName}' last game on ${lastHRDate} when he hit ${lastHRCount} home run${
                    lastHRCount > 1 ? "s" : ""
                  }.`}</h2>
                  {this.renderNextPlayerButton()}
                </div>
              );
            } else {
              // Game today & Game over & Player didn't play & Homered in last game & Didn't play in last game
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
            }
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
                <h2>{`${playerName} hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""} today!`}</h2>
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

    // Old implementation, leaving for now although doesn't include postponed scenario
    // if (isGameToday) {
    //   if (hrCount) {
    //     // Homered today
    //     return (
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="yes-text">YES</h1>
    //         <h2>{`${playerName} hit ${lastHRCount} home run${lastHRCount > 1 ? "s" : ""} today!`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   if (isPreGame) {
    //     if (wasHRLastGamePlayed) {
    //       if (playedInLastGame) {
    //         // Homered in team's last game
    //         return (
    //           <div>
    //             {this.renderPlayerQuestion()}
    //             <h1 className="yes-text">YES</h1>
    //             <h2>{`${playerName} hit ${lastHRCount} home run${
    //               lastHRCount > 1 ? "s" : ""
    //             } in the ${teamName}' last game!`}</h2>
    //             {this.renderNextPlayerButton()}
    //           </div>
    //         );
    //       }
    //       // Homered in player's last game
    //       return (
    //         <div>
    //           {this.renderPlayerQuestion()}
    //           <h1 className="yes-text">YES</h1>
    //           <h2>{`Well... ${playerName} didn't play in the ${teamName}' last game, but he did hit ${lastHRCount} home run${
    //             lastHRCount > 1 ? "s" : ""
    //           } in his last game with the team on ${lastHRDate}.`}</h2>
    //           {this.renderNextPlayerButton()}
    //         </div>
    //       );
    //     }
    //     // Didn't homer in player's last game
    //     return (
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="no-text">No</h1>
    //         <h2>{`${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //           lastHRCount > 1 ? "s" : ""
    //         }.`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   if (isGameFinal) {
    //     if (playerPlayed) {
    //       // Didn't homer today
    //       return (
    //         <div>
    //           {this.renderPlayerQuestion()}
    //           <h1 className="no-text">No</h1>
    //           <h2>{`${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //             lastHRCount > 1 ? "s" : ""
    //           }.`}</h2>
    //           {this.renderNextPlayerButton()}
    //         </div>
    //       );
    //     }
    //     if (wasHRLastGamePlayed) {
    //       // Didn't play today, but homered in player's last game
    //       return (
    //         <div>
    //           {this.renderPlayerQuestion()}
    //           <h1 className="yes-text">YES</h1>
    //           <h2>{`Well... ${playerName} didn't play today, but he did hit ${lastHRCount} home run${
    //             lastHRCount > 1 ? "s" : ""
    //           } in his last game with the ${teamName}' on ${lastHRDate}.`}</h2>
    //           {this.renderNextPlayerButton()}
    //         </div>
    //       );
    //     }
    //     return (
    //       // Didn't play today and didn't homer in player's last game
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="no-text">No</h1>
    //         <h2>{`${playerName} didn't play today and he hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //           lastHRCount > 1 ? "s" : ""
    //         }.`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   if (wasHRLastGamePlayed) {
    //     if (playedInLastGame) {
    //       // mmm
    //       return (
    //         <div>
    //           {this.renderPlayerQuestion()}
    //           <h1 className="yes-text">YES</h1>
    //           <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} homered in the ${teamName}' last game when he hit ${lastHRCount} home run${
    //             lastHRCount > 1 ? "s" : ""
    //           }.`}</h2>
    //           {this.renderNextPlayerButton()}
    //         </div>
    //       );
    //     }
    //     if (playerPlayed) {
    //       // mmm
    //       return (
    //         <div>
    //           {this.renderPlayerQuestion()}
    //           <h1 className="yes-text">YES</h1>
    //           <h2>{`Well... the ${teamName} haven't finished playing yet today, but ${playerName} is back in the lineup and he did hit ${lastHRCount} home run${
    //             lastHRCount > 1 ? "s" : ""
    //           } in his last game with the team on ${lastHRDate}.`}</h2>
    //           {this.renderNextPlayerButton()}
    //         </div>
    //       );
    //     }
    //     // mmm
    //     return (
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="yes-text">YES</h1>
    //         <h2>{`Well... the ${teamName} haven't finished playing yet today, and ${playerName} didn't play in the ${teamName}' last game, but he did hit ${lastHRCount} home run${
    //           lastHRCount > 1 ? "s" : ""
    //         } in his last game with the team on ${lastHRDate}.`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   if (playedInLastGame) {
    //     // mmm
    //     return (
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="no-text">No</h1>
    //         <h2>{`The ${teamName} haven't finished playing yet today and ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //           lastHRCount > 1 ? "s" : ""
    //         }.`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   // mmm
    //   return (
    //     <div>
    //       {this.renderPlayerQuestion()}
    //       <h1 className="no-text">No</h1>
    //       <h2>{`The ${teamName} haven't finished playing yet today, but ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //         lastHRCount > 1 ? "s" : ""
    //       }.`}</h2>
    //       {this.renderNextPlayerButton()}
    //     </div>
    //   );
    // }
    // // No game
    // if (wasHRLastGamePlayed) {
    //   if (playedInLastGame) {
    //     // Homered in team's last game
    //     return (
    //       <div>
    //         {this.renderPlayerQuestion()}
    //         <h1 className="yes-text">YES</h1>
    //         <h2>{`The ${teamName} don't play today, but ${playerName} hit ${lastHRCount} home run${
    //           lastHRCount > 1 ? "s" : ""
    //         } in the ${teamName}' last game!`}</h2>
    //         {this.renderNextPlayerButton()}
    //       </div>
    //     );
    //   }
    //   // Homered in player's last game
    //   return (
    //     <div>
    //       {this.renderPlayerQuestion()}
    //       <h1 className="yes-text">YES</h1>
    //       <h2>{`Well... the ${teamName} don't play today, and ${playerName} didn't play in the ${teamName}' last game, but he did hit ${lastHRCount} home run${
    //         lastHRCount > 1 ? "s" : ""
    //       } in his last game with the team on ${lastHRDate}.`}</h2>
    //       {this.renderNextPlayerButton()}
    //     </div>
    //   );
    // }
    // // Didn't homer in player's last game
    // return (
    //   <div>
    //     {this.renderPlayerQuestion()}
    //     <h1 className="no-text">No</h1>
    //     <h2>{`The ${teamName} don't play today and ${playerName} hasn't hit a homer since ${lastHRDate} when he hit ${lastHRCount} home run${
    //       lastHRCount > 1 ? "s" : ""
    //     }.`}</h2>
    //     {this.renderNextPlayerButton()}
    //   </div>
    // );
  }
}

export default Judge;
