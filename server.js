const express = require("express");
const bodyParser = require("body-parser");
const DomParser = require("dom-parser");
const path = require("path");
const request = require("request");

const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_URL = "mongodb+srv://personal-site-user:uXuvpHxKOnhFwZtM@mlb-player-data-hmtxj.azure.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "mlb-player-data";

let database, collection;

// API calls
app.get("/api/yankees-game-id", (_req, res) => {
  const url = "http://gd2.mlb.com/components/game/mlb/year_2019/month_07/day_16/scoreboard.xml";
  let gameId = null;
  request(url, (_error, _response, body) => {
    const parser = new DomParser();
    const xmlDoc = parser.parseFromString(body, "text/xml");
    const games = xmlDoc.getElementsByTagName("game");

    games.forEach(game => {
      // TODO: Check for double headers
      if (game.attributes[0].value.includes("nyamlb")) {
        gameId = game.attributes[0].value;
      }
    });
  });
  res.send({ gameId });
});

app.get("/api/yankees-game-data", (_req, res) => {
  const url = "http://gd2.mlb.com/components/game/mlb/year_2019/month_07/day_16/gid_2019_07_16_tbamlb_nyamlb_1/boxscore.xml";
  let hrVal = null;
  request(url, (_error, _response, body) => {
    const parser = new DomParser();
    const xmlDoc = parser.parseFromString(body, "text/xml");
    const batters = xmlDoc.getElementsByTagName("batter");
    batters.forEach(batter => {
      const isJudge = batter.attributes.some(attrib => attrib.value.includes("592450"));
      if (isJudge) {
        hrVal = batter.attributes.find(attrib => attrib.name === "hr").value;
      }
    });
  });
  res.send({ hrVal });
});

app.post("/api/world", (req, res) => {
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
  app.get("*", (_req, res) => {
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
