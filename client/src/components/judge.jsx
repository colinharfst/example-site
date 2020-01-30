import * as React from "react";

export class Judge extends React.Component {
  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    const response = await fetch("/api/yankees-game-data");
    const body = await response.json();
  };

  render() {
    return (
      <div>
        <h2>Here's some judge text</h2>
      </div>
    );
  }
}

export default Judge;
