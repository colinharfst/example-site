import React, { Component } from "react";

export class Sample extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: ""
  };

  componentDidMount() {
    this.getJudgeHRDate()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }

  getJudgeHRDate = async () => {
    const response = await fetch("/api/hr-date/592450");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.hrDate;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  render() {
    return (
      <div>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input type="text" value={this.state.post} onChange={e => this.setState({ post: e.target.value })} />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default Sample;
