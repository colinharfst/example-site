import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export class Judge extends React.Component {
  state = { hrVal: null };

  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    await this.loadTodaysHRCount();
  };

  loadTodaysHRCount = async () => {
    const gameId = await fetch("/api/yankees-game-id").then(async resp => {
      const respBody = await resp.json();
      return respBody.gameId;
    });
    const hrVal = await fetch(`/api/yankees-game-data/${gameId}`).then(async resp => {
      const respBody = await resp.json();
      return respBody.hrVal;
    });
    this.setState({ hrVal });
  };

  render() {
    if (this.state.hrVal === null) {
      return <CircularProgress />;
    }
    return (
      <div>
        <h2>{`Here's some judge text, ${this.state.hrVal}`}</h2>
      </div>
    );
  }
}

export default Judge;
