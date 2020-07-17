const express = require("express");
const path = require("path");
const request = require("request");
const requestPromise = require("request-promise");
const fs = require("fs");
const bodyParser = require("body-parser");
const DomParser = require("dom-parser");
const MongoClient = require("mongodb").MongoClient;
const getDateBreakdown = require("./middleware/date-helper").getDateBreakdown;
const areArraysEqual = require("./middleware/array-helper").areArraysEqual;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let collection;

// API calls
app.get("/api/live-baseball/:team/:playerId", async (req, res) => {
  const date = getDateBreakdown();
  // 09/12/2019 for last double-header
  // 10/13/2019 for last homerun
  // Consider using master_scoreboard.xml
  const baseUrl = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${date.month}/day_${date.day}`;

  let isGameToday = false;
  let isGameFinal = false; // Second game of double header, if applicable (assuming games appear in order)
  let playerPlayed = false;
  let hrCount = 0;

  // Get league data
  const body = await requestPromise(baseUrl + "/scoreboard.xml").catch((error) => {
    console.log("Unable to get MLB API league data with error:", error);
    return res.status(500).send(error);
  });

  const parser = new DomParser();
  const xmlDoc = parser.parseFromString(body, "text/xml");

  // Get team's games
  const games = xmlDoc
    .getElementsByTagName("game")
    .filter((game) => game.attributes[0].value.includes(req.params.team));

  await Promise.all(
    games.map(async (game) => {
      isGameToday = true;
      gameId = game.attributes[0].value;
      isGameFinal = game.attributes[2].value === "FINAL";

      // Get game data
      const gameBody = await requestPromise(baseUrl + `/gid_${gameId}/boxscore.xml`).catch((error) => {
        console.log("Unable to get MLB API game data with error:", error);
        return res.status(500).send(error);
      });

      const xmlGameDoc = parser.parseFromString(gameBody, "text/xml");
      const batters = xmlGameDoc.getElementsByTagName("batter");

      batters.forEach((batter) => {
        const isPlayer = batter.attributes.some((attrib) => attrib.value.includes(req.params.playerId));
        if (isPlayer) {
          playerPlayed = true;
          hrCount += parseInt(batter.attributes.find((attrib) => attrib.name === "hr").value);
        }
      });
    })
  );

  // Update player record in DB
  if (hrCount) {
    collection.updateOne(
      { playerId: req.params.playerId },
      { $set: { lastHRCount: hrCount, lastHRDate: new Date(), wasHRLastGamePlayed: true } },
      (error, _result) => {
        if (error) console.log("Unable to update MongoDB player data with error:", error);
      }
    );
  } else if (isGameFinal && playerPlayed) {
    collection.updateOne(
      { playerId: req.params.playerId },
      { $set: { wasHRLastGamePlayed: false } },
      (error, _result) => {
        if (error) console.log("Unable to update MongoDB player data with error:", error);
      }
    );
  }

  console.log("isGameToday:", isGameToday);
  console.log("isGameFinal:", isGameFinal);
  console.log("playerPlayed:", playerPlayed);
  console.log("hrCount:", hrCount);

  return res.send({
    isGameToday: isGameToday,
    isGameFinal: isGameFinal,
    playerPlayed: playerPlayed,
    hrCount: hrCount,
  });
});

app.get("/api/stored-baseball/:playerId", (req, res) => {
  // Get player record in DB
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

app.get("/api/chess-data", async (_req, res) => {
  fs.readFile(
    `text-data/${fs.existsSync("text-data/lichess-data.txt") ? "" : "manual-"}lichess-data.txt`,
    "utf-8",
    (error, data) => {
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
          const elo = parseInt(lines[8].substring(11, 15)) + parseInt(lines[10].split('"')[1]);
          const date = lines[6].substring(10, 20);
          const time = lines[7].substring(10, 18);
          return { elo, date, time };
        } else {
          const elo = parseInt(lines[9].substring(11, 15)) + parseInt(lines[11].split('"')[1]);
          const date = lines[6].substring(10, 20);
          const time = lines[7].substring(10, 18);
          return { elo, date, time };
        }
      });
      data = data.filter((obj) => obj != undefined);
      console.log("mostRecentGame:", data[data.length - 1]);
      return res.send(data);
    }
  );
});

app.get("/api/chess-game-data/:datetime", async (req, res) => {
  fs.readFile(
    `text-data/${fs.existsSync("text-data/lichess-data.txt") ? "" : "manual-"}lichess-data.txt`,
    "utf-8",
    (error, data) => {
      if (error) {
        console.log("Unable to retrieve chess data", error);
        return res.status(500).send(error);
      }
      data = data.split("\n\n\n");

      specificGame = data.reverse().find((game, ind) => {
        if (!game) return false;
        lines = game.split("\n");
        if (!lines[0].includes("Rated Blitz game")) return false;

        const date = lines[6].substring(10, 20).split(".");
        const time = lines[7].substring(10, 18).split(":");

        const givenDate = req.params.datetime.substring(0, 10).split("-");
        const givenTime = req.params.datetime.substring(11, 19).split(":");

        if (date[2] == "00") {
          console.log(date);
        }
        if (ind < 50) {
          console.log(date, givenDate, time, givenTime);
        }
        return areArraysEqual(date, givenDate) && areArraysEqual(time, givenTime);
      });
      // data = data.reverse().map((game) => {
      //   if (!game) return;
      //   lines = game.split("\n");
      //   if (!lines[0].includes("Rated Blitz game")) return;
      //   if (lines[3].includes('White "cph5wr"')) {
      //     const elo = parseInt(lines[8].substring(11, 15)) + parseInt(lines[10].split('"')[1]);
      //     const date = lines[6].substring(10, 20);
      //     const time = lines[7].substring(10, 18);
      //     return { elo, date, time };
      //   } else {
      //     const elo = parseInt(lines[9].substring(11, 15)) + parseInt(lines[11].split('"')[1]);
      //     const date = lines[6].substring(10, 20);
      //     const time = lines[7].substring(10, 18);
      //     return { elo, date, time };
      //   }
      // });
      // data = data.filter((obj) => obj != undefined);
      console.log("foundGame:", specificGame);
      // return res.send(data);
      res.send(true);
    }
  );
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
    "mongodb+srv://personal-site-user:uXuvpHxKOnhFwZtM@mlb-player-data-hmtxj.azure.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true },
    (error, client) => {
      if (error) {
        console.log("MongoDB connection failed with error:", error);
        throw error;
      }
      const database = client.db("mlb-player-data");
      collection = database.collection("yankees-players");
      console.log("Connected to MongoDB");
    }
  );
  request("https://lichess.org/api/games/user/cph5wr", (error, _response, body) => {
    if (error) {
      console.log("Lichess connection failed with error:", error);
      throw error;
    }
    if (body) {
      fs.writeFile("text-data/lichess-data.txt", body, (error) => {
        if (error) {
          console.log("Failed to save Lichess data with error:", error);
          throw error;
        } else {
          console.log("Stored latest Lichess data");
        }
      });
    }
  });
});
