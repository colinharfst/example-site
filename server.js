const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require("request");

const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_URL = "mongodb+srv://personal-site-user:uXuvpHxKOnhFwZtM@mlb-player-data-hmtxj.azure.mongodb.net/test?retryWrites=true&w=majority";
// const CONNECTION_URL = "mongodb+srv://personal-site-user:8Is6KBRlAqqbViWS@mlb-player-data-haaan.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "mlb-player-data";

let database, collection;

// API calls
app.get("/api/hello", (req, res) => {
  const url = "http://gd2.mlb.com/components/game/mlb/year_2019/month_07/day_16/scoreboard.xml";
  request(url, function(error, response, body) {
    console.log(body, typeof body);
    // find 'nyamlb' in body
    // console.error("error:", error); // Print the error if one occurred
    // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    // console.log("body:", body); // Print the HTML for the Google homepage.
  });
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
});

app.get("/api/hr-date/:playerId", (request, response) => {
  collection.findOne({ playerId: request.params.playerId }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Listen here
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
    if (error) {
      console.log("MongoDB connection failed with error: ", error);
      throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("yankees-players");
    console.log("Connected to '" + DATABASE_NAME + "'");
  });
});
