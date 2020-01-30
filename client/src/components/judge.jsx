import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export class Judge extends React.Component {
  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    const gameId = await fetch("/api/yankees-game-id").then(async resp => await resp.json().gameId);
    const hrVal = await fetch(`/api/yankees-game-data/${gameId}`).then(async resp => await resp.json().hrVal);
  };

  render() {
    if (true) {
      return <CircularProgress />;
    }
    return (
      <div>
        <h2>Here's some judge text</h2>
      </div>
    );
  }
}

export default Judge;
