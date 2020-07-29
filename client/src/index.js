import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./app";
import * as serviceWorker from "./service-worker";

ReactDOM.render(<App />, document.getElementById("root"));

// Using these so that when Kaffeine pings Heroku, MongoDB is updated
// https://kaffeine.herokuapp.com/
fetch("/api/live-baseball/nyamlb/592450");
fetch("/api/live-baseball/nyamlb/519317");
fetch("/api/live-baseball/nyamlb/650402");
fetch("/api/live-baseball/houmlb/514888");
fetch("/api/live-baseball/phimlb/544369");

serviceWorker.register();
