import * as React from "react";

export class Judge extends React.Component {
  componentDidMount = async () => {
    document.title = "Aaron Judge Stats";
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return response;
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
