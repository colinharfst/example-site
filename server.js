const express = require("express");
const path = require("path");
const request = require("request");
const fs = require("fs");
const bodyParser = require("body-parser");
const DomParser = require("dom-parser");
const MongoClient = require("mongodb").MongoClient;
// const ObjectID = require("mongodb").ObjectID;
const getDateBreakdown = require("./middleware/date-helper").getDateBreakdown;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const CONNECTION_URL =
  "mongodb+srv://personal-site-user:uXuvpHxKOnhFwZtM@mlb-player-data-hmtxj.azure.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "mlb-player-data";

let database, collection;

// API calls
app.get("/api/game/:team", (req, res) => {
  const date = getDateBreakdown();
  const url = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${date.month}/day_${date.day}/scoreboard.xml`;
  // const url = "http://gd2.mlb.com/components/game/mlb/year_2019/month_10/day_13/scoreboard.xml";

  let gameId = null;
  let isGameFinal = null;
  request(url, (error, _response, body) => {
    if (error) {
      console.log("Unable to get MLB API game data with error:", error);
      return res.status(500).send(error);
    }

    const parser = new DomParser();
    const xmlDoc = parser.parseFromString(body, "text/xml");
    const games = xmlDoc.getElementsByTagName("game");

    games.forEach((game) => {
      // TODO: Check for double headers
      if (game.attributes[0].value.includes(req.params.team)) {
        gameId = game.attributes[0].value;
        isGameFinal = game.attributes[2].value === "FINAL";
      }
    });
    console.log("gameId:", gameId);
    console.log("isGameFinal:", isGameFinal);
    return res.send({ gameId: gameId, isGameFinal: isGameFinal });
  });
});

app.get("/api/game-player-data/:gameId/:playerId", (req, res) => {
  const date = getDateBreakdown();
  const url = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${date.month}/day_${date.day}/gid_${req.params.gameId}/boxscore.xml`;
  // const url = `http://gd2.mlb.com/components/game/mlb/year_2019/month_10/day_13/gid_${req.params.gameId}/boxscore.xml`;

  let hrCount = null;
  request(url, (error, _response, body) => {
    if (error) {
      console.log("Unable to get MLB API player data with error:", error);
      return res.status(500).send(error);
    }

    const parser = new DomParser();
    const xmlDoc = parser.parseFromString(body, "text/xml");
    const batters = xmlDoc.getElementsByTagName("batter");

    let playerPlayed = false;
    batters.forEach((batter) => {
      const isJudge = batter.attributes.some((attrib) =>
        attrib.value.includes(req.params.playerId)
      );
      if (isJudge) {
        hrCount = batter.attributes.find((attrib) => attrib.name === "hr")
          .value;
        playerPlayed = true;
      }
    });

    console.log("hrCount:", hrCount);
    console.log("playerPlayed:", playerPlayed);
    return res.send({ hrCount: hrCount, playerPlayed: playerPlayed });
  });
});

// app.get("/api/master-scorecard", (_req, res) => {
//   const date = getDateBreakdown();
//   // const url = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${date.month}/day_${date.day}/master_scoreboard.xml`
//   const url = `http://gd2.mlb.com/components/game/mlb/year_2019/month_10/day_12/master_scoreboard.xml`;

//   let gameId = null;
//   let isGameFinal = null;
//   request(url, (error, _response, body) => {
//     if (error) {
//       console.log("Unable to get MLB API game data with error:", error);
//       return res.status(500).send(error);
//     }

//     const parser = new DomParser();
//     const xmlDoc = parser.parseFromString(body, "text/xml");
//     // console.log("get mlb", xmlDoc);
//     const games = xmlDoc.getElementsByTagName("game");
//     ...
//     const status = games.getElementsByTagName('status');
// });

app.get("/api/player-hr/:playerId", (req, res) => {
  collection.findOne({ playerId: req.params.playerId }, (error, result) => {
    if (error) {
      console.log("Unable to find MongoDB player data with error:", error);
      return res.status(500).send(error);
    }
    console.log("lastHRCount:", result.lastHRCount);
    console.log("lastHRDate:", result.lastHRDate);
    console.log("wasHRLastGamePlayed:", result.wasHRLastGamePlayed);
    return res.send(result);
  });
});

// Could refactor to PATCH
app.put("/api/player-hr/:playerId", (req, res) => {
  // if !(req.body contains lastHRCount, lastHRDate, or  etc. && req.params.playerId has value) return 400;
  console.log(req.body);
  collection.updateOne(
    { playerId: req.params.playerId },
    { $set: req.body },
    (error, result) => {
      if (error) {
        console.log("Unable to update MongoDB player data with error:", error);
        return res.status(500).send(error);
      }
      return res.send(result);
    }
  );
});

// app.post("/api/player-hr", (req, res) => {
//   // if !(req.body contains playerId, lastHRCount, lastHRDate, and wasHRLastGamePlayed) return 400;
//   collection.insertOne(req.body, (error, result) => {
//     if (error) {
//       console.log("Unable to insert MongoDB player data with error:", error);
//       return res.status(500).send(error);
//     }
//     return res.send(result);
//   });
// });

app.get("/api/chess-data", (_req, res) => {
  // https://lichess.org/api/games/user/cph5wr
  fs.readFile("manual-data/lichess-data.txt", "utf-8", (error, data) => {
    if (error) {
      console.log("Unable to retrieve chess data", error);
      return res.status(500).send(error);
    }
    data = data.split("\n\n\n");
    data = data.reverse().map((game) => {
      if (!game) return;
      lines = game.split("\n");
      if (!lines[0].includes("Rated Blitz game")) return;
      if (lines[3].includes('White "cph5wr"')) {
        const elo =
          parseInt(lines[8].substring(11, 15)) +
          parseInt(lines[10].split('"')[1]);
        const date = lines[6].substring(10, 20);
        const time = lines[7].substring(10, 18);
        return { elo, date, time };
      } else {
        const elo =
          parseInt(lines[9].substring(11, 15)) +
          parseInt(lines[11].split('"')[1]);
        const date = lines[6].substring(10, 20);
        const time = lines[7].substring(10, 18);
        return { elo, date, time };
      }
    });
    data = data.filter((obj) => obj != undefined);
    console.log(data[0], data[1], data[1200]);
    return res.send(data);
  });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (_req, res) => {
    return res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Listen here
app.listen(port, () => {
  console.log("\\ o  ");
  console.log(" ( )>");
  console.log(" / \\ ");
  console.log("Listening on port", port);
  MongoClient.connect(
    CONNECTION_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    (error, client) => {
      if (error) {
        console.log("MongoDB connection failed with error:", error);
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("yankees-players");
      console.log(`Connected to '${DATABASE_NAME}'`);
    }
  );
});
