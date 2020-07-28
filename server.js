const express = require("express");
const path = require("path");
const request = require("request");
const requestPromise = require("request-promise");
const fs = require("fs");
const bodyParser = require("body-parser");
const DomParser = require("dom-parser");
const MongoClient = require("mongodb").MongoClient;
const getDateBreakdown = require("./middleware/date-helpers").getDateBreakdown;
// const getEasternTimeHour = require("./middleware/date-helpers").getEasternTimeHour;

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

  // console.log(getEasternTimeHour());

  let isGameToday = false;
  let isPreGame = false; // Second game of double header, if applicable (assuming games appear in order)
  let isGameFinal = false; // Second game of double header, if applicable (assuming games appear in order)
  // Possible defect on the rare occasion where a double header also includes a PPD
  let isPostponed = false; // Second game of double header, if applicable (assuming games appear in order)
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
      isPreGame = game.attributes[2].value === "PRE_GAME";

      // Get game data
      const gameBody = await requestPromise(baseUrl + `/gid_${gameId}/boxscore.xml`).catch((error) => {
        console.log("Unable to get MLB API game data with error:", error);
        return res.status(500).send(error);
      });

      const xmlGameDoc = parser.parseFromString(gameBody, "text/xml");
      const batters = xmlGameDoc.getElementsByTagName("batter");

      if (isGameFinal & !batters.length) {
        isPostponed = true;
      }

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
      {
        $set: {
          lastHRCount: hrCount,
          lastHRDate: new Date(),
          wasHRLastGamePlayed: true,
          playedInLastGame: true,
        },
      },
      (error, _result) => {
        if (error) console.log("Unable to update MongoDB player data with error:", error);
      }
    );
  } else if (isGameFinal & !isPostponed) {
    collection.updateOne(
      { playerId: req.params.playerId },
      {
        $set: playerPlayed ? { wasHRLastGamePlayed: false, playedInLastGame: true } : { playedInLastGame: false },
      },
      (error, _result) => {
        if (error) console.log("Unable to update MongoDB player data with error:", error);
      }
    );
  }

  console.log("isGameToday:", isGameToday);
  console.log("isPreGame:", isPreGame);
  console.log("isGameFinal:", isGameFinal);
  console.log("isPostponed:", isPostponed);
  console.log("playerPlayed:", playerPlayed);
  console.log("hrCount:", hrCount);

  return res.send({
    isGameToday: isGameToday,
    isPreGame: isPreGame,
    isGameFinal: isGameFinal,
    isPostponed: isPostponed,
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
    console.log("playedInLastGame:", result.playedInLastGame);
    return res.send(result);
  });
});

app.get("/api/chess-record", async (_req, res) => {
  fs.readFile(
    `text-data/${fs.existsSync("text-data/lichess-data.txt") ? "" : "manual-"}lichess-data.txt`,
    "utf-8",
    (error, data) => {
      if (error) {
        console.log("Unable to retrieve chess data:", error);
        return res.status(500).send(error);
      }
      data = data.split("\n\n\n");
      data = data.reverse().map((game) => {
        if (!game) return;
        const lines = game.split("\n");
        if (!lines[0].includes("Rated Blitz game")) return;
        if (lines[3].includes('White "cph5wr"')) {
          const date = lines[6].substring(10, 20).split(".");
          const time = lines[7].substring(10, 18).split(":");
          let datetime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
          datetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6000);
          const elo = parseInt(lines[8].substring(11, 15)) + parseInt(lines[10].split('"')[1]);
          return { datetime, elo };
        } else {
          const date = lines[6].substring(10, 20).split(".");
          const time = lines[7].substring(10, 18).split(":");
          let datetime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
          datetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6000);
          const elo = parseInt(lines[9].substring(11, 15)) + parseInt(lines[11].split('"')[1]);
          return { datetime, elo };
        }
      });
      data = data.filter((obj) => obj != undefined);
      console.log("mostRecentGame:", data[data.length - 1]);
      return res.send(data);
    }
  );
});

app.get("/api/chess-game/:datetime", async (req, res) => {
  fs.readFile(
    `text-data/${fs.existsSync("text-data/lichess-data.txt") ? "" : "manual-"}lichess-data.txt`,
    "utf-8",
    (error, data) => {
      if (error) {
        console.log("Unable to retrieve chess game data:", error);
        return res.status(500).send(error);
      }
      data = data.split("\n\n\n");
      const givenDatetime = new Date(req.params.datetime);
      specificGame = data.reverse().find((game, ind) => {
        if (!game) return false;
        const lines = game.split("\n");
        if (!lines[0].includes("Rated Blitz game")) return false;
        const gameDate = lines[6].substring(10, 20).split(".");
        const gameTime = lines[7].substring(10, 18).split(":");
        let gameDatetime = new Date(gameDate[0], gameDate[1] - 1, gameDate[2], gameTime[0], gameTime[1], gameTime[2]);
        gameDatetime = new Date(gameDatetime.getTime() - gameDatetime.getTimezoneOffset() * 6000);
        return givenDatetime.getTime() === gameDatetime.getTime();
      });
      if (!specificGame) {
        console.log("Unable to find chess game");
        return res.status(500).send("Unable to find chess game");
      }
      const lines = specificGame.split("\n");
      let gameMoves = lines[17].split(" ");
      gameMoves.pop();
      gameMoves = gameMoves.filter((x) => !x.includes("."));
      const gameInfo = {
        white: lines[3],
        black: lines[4],
        result: lines[5],
        whiteElo: parseInt(lines[8].substring(11, 15)) + parseInt(lines[10].split('"')[1]),
        blackElo: parseInt(lines[9].substring(11, 15)) + parseInt(lines[11].split('"')[1]),
        timeControl: lines[13],
        ending: lines[15],
        gameMoves: gameMoves,
      };
      console.log("gameInfo:", gameInfo);
      res.send(gameInfo);
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
