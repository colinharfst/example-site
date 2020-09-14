const express = require("express");
const path = require("path");
const request = require("request");
const requestPromise = require("request-promise");
const fs = require("fs");
const bodyParser = require("body-parser");
const DomParser = require("dom-parser");
const MongoClient = require("mongodb").MongoClient;
const getDateBreakdown = require("./middleware/date-helpers").getDateBreakdown;
const getEasternTimeTuple = require("./middleware/date-helpers").getEasternTimeTuple;
const customTimeAdder = require("./middleware/date-helpers").customTimeAdder;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let collection;

// API calls
app.get("/api/live-baseball/:team/:playerId", async (req, res) => {
  const date = getDateBreakdown();

  // Temporary fix for games ending after midnight, treat as though it's yesterday
  let shouldFakeDate = false;
  const easternTimeTuple = getEasternTimeTuple();
  if (easternTimeTuple.hours <= 3) {
    let tmpMonth, tmpDay;
    if (date.day === "01") {
      tmpMonth = String(date.month - 1).padStart(2, "0");
      const monthMapping = {
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
      };
      tmpDay = monthMapping[tmpMonth];
    } else {
      tmpMonth = date.month;
      tmpDay = String(date.day - 1).padStart(2, "0");
    }

    // Use to create buffer for Kaffeine to ping Heroku
    // when it's between midnight and 12:35 p.m
    // and the game ended between 11:30 to midnight
    // https://kaffeine.herokuapp.com/
    let roundUp = false;
    if (easternTimeTuple.hours === 0 && easternTimeTuple.minutes <= 35) roundUp = true;

    // Get league data
    const baseUrl_ = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${tmpMonth}/day_${tmpDay}`;
    const body_ = await requestPromise(baseUrl_ + "/scoreboard.xml").catch((error) => {
      console.log("Unable to get MLB API league data with error:", error);
      return res.status(500).send(error);
    });

    const parser_ = new DomParser();
    const xmlDoc_ = parser_.parseFromString(body_, "text/xml");

    // Get team's games
    const games_ = xmlDoc_
      .getElementsByTagName("game")
      .filter((game) => game.attributes[0].value.includes(req.params.team));

    await Promise.all(
      games_.map(async (game) => {
        const gameId = game.attributes[0].value;
        const gameStartTime = game.attributes[3].value;
        // Get game data
        const gameBody = await requestPromise(baseUrl_ + `/gid_${gameId}/boxscore.xml`).catch((error) => {
          console.log("Unable to get MLB API game data with error:", error);
          return res.status(500).send(error);
        });

        const xmlGameDoc = parser_.parseFromString(gameBody, "text/xml");
        const splitX = xmlGameDoc.rawHTML.split("<b>T</b>: ");
        const splitY = splitX.length > 1 ? splitX[1].split(".") : [];
        const gameLength = splitY.length ? splitY[0] : null;

        if (gameLength && customTimeAdder(gameStartTime, gameLength, roundUp) >= 24) shouldFakeDate = true;
      })
    );

    const allGamesAreFinal = games_.every((game) => game.attributes[2].value === "FINAL");

    if (!allGamesAreFinal || shouldFakeDate) {
      shouldFakeDate = true;
      date.month = tmpMonth;
      date.day = tmpDay;
    }
  }

  // 09/12/2019 for last double-header
  // 10/13/2019 for last homerun
  // Consider using master_scoreboard.xml
  const baseUrl = `http://gd2.mlb.com/components/game/mlb/year_${date.year}/month_${date.month}/day_${date.day}`;

  let isGameToday = false;
  const isPreGameArray = [];
  const isGameFinalArray = [];
  const isPostponedArray = [];
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
    games.map(async (game, index) => {
      isGameToday = true;
      const gameId = game.attributes[0].value;
      isGameFinalArray.splice(index, 0, game.attributes[2].value === "FINAL");
      isPreGameArray.splice(index, 0, game.attributes[2].value === "PRE_GAME");

      // Get game data
      const gameBody = await requestPromise(baseUrl + `/gid_${gameId}/boxscore.xml`).catch((error) => {
        console.log("Unable to get MLB API game data with error:", error);
        return res.status(500).send(error);
      });

      const xmlGameDoc = parser.parseFromString(gameBody, "text/xml");
      const batters = xmlGameDoc.getElementsByTagName("batter");

      if (isGameFinalArray[index] & !batters.length) {
        isPostponedArray.splice(index, 0, true);
      } else {
        isPostponedArray.splice(index, 0, false);
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

  const isPreGame =
    isPreGameArray.length &&
    isPostponedArray.length &&
    isPreGameArray.every((isPre, index) => isPre || isPostponedArray[index]);
  const isGameFinal = isGameFinalArray.length && isGameFinalArray.every((isFin) => isFin);
  const isPostponed = isPostponedArray.length && isPostponedArray.every((isPPD) => isPPD);

  // Update player record in DB
  if (hrCount) {
    const d = new Date();
    if (shouldFakeDate) {
      d.setDate(d.getDate() - 1);
    }
    collection.updateOne(
      { playerId: req.params.playerId },
      {
        $set: {
          lastHRCount: hrCount,
          lastHRDate: d,
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
    console.log("lastHRDate:", result.lastHRDate);
    console.log("lastHRCount:", result.lastHRCount);
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
          const datetime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
          const elo = parseInt(lines[8].substring(11, 15)) + parseInt(lines[10].split('"')[1]);
          return { datetime, elo };
        } else {
          const date = lines[6].substring(10, 20).split(".");
          const time = lines[7].substring(10, 18).split(":");
          const datetime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
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
        const gameDatetime = new Date(gameDate[0], gameDate[1] - 1, gameDate[2], gameTime[0], gameTime[1], gameTime[2]);
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
      console.log("white:", gameInfo.white);
      console.log("black:", gameInfo.black);
      console.log("result:", gameInfo.result);
      console.log("whiteElo:", gameInfo.whiteElo);
      console.log("blackElo:", gameInfo.blackElo);
      res.send(gameInfo);
    }
  );
});

app.get("/api/climate-articles", async (req, res) => {
  const baseUrl = "https://api.nytimes.com/svc/topstories/v2/climate.json?api-key=";
  if (process.env.NODE_ENV === "production") {
    await requestPromise(baseUrl + process.env.NYT_API_KEY).then((resp) => {
      const body = JSON.parse(resp);
      const selectedArticles = [];
      // Add one random article
      let len = body.results.length;
      let randomIndex = Math.floor(Math.random() * Math.floor(len));
      selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
      // Add another random article
      len = body.results.length;
      randomIndex = Math.floor(Math.random() * Math.floor(len));
      selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
      // Add a third random article
      len = body.results.length;
      randomIndex = Math.floor(Math.random() * Math.floor(len));
      selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
      // Return articles
      return res.send(selectedArticles);
    });
  } else {
    fs.readFile("local.env", "utf-8", async (error, data) => {
      if (error) {
        console.log("Unable to read environment variable:", error);
        throw error;
      }
      await requestPromise(baseUrl + data.split('"')[3]).then((resp) => {
        const body = JSON.parse(resp);
        const selectedArticles = [];
        // Add one random article
        let len = body.results.length;
        let randomIndex = Math.floor(Math.random() * Math.floor(len));
        selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
        // Add another random article
        len = body.results.length;
        randomIndex = Math.floor(Math.random() * Math.floor(len));
        selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
        // Add a third random article
        len = body.results.length;
        randomIndex = Math.floor(Math.random() * Math.floor(len));
        selectedArticles.push(body.results.splice(randomIndex, 1)[0]);
        // Return articles
        return res.send(selectedArticles);
      });
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure || req.url.includes("favicon") || req.url.includes("manifest")) {
      // Request was via https, so do no special handling
      next();
    } else {
      // Request was via http, so redirect to https
      res.redirect("https://" + req.hostname + req.url);
    }
  });

  app.use("/", (req, _res, next) => {
    // Using these so that when Kaffeine pings Heroku, MongoDB is updated
    // https://kaffeine.herokuapp.com/
    if (req.path !== "/") return next();
    request("http://www.colinharfst.com/api/live-baseball/nyamlb/592450");
    request("http://www.colinharfst.com/api/live-baseball/nyamlb/519317");
    request("http://www.colinharfst.com/api/live-baseball/nyamlb/650402");
    request("http://www.colinharfst.com/api/live-baseball/houmlb/514888");
    request("http://www.colinharfst.com/api/live-baseball/phimlb/544369");
    // Using this so that when Kaffeine pings Heroku, Lichess data is updated
    // https://kaffeine.herokuapp.com/
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
    next();
  });

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

  const connect = (connection) =>
    MongoClient.connect(connection, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
      if (error) {
        console.log("MongoDB connection failed with error:", error);
        throw error;
      }
      const database = client.db("mlb-player-data");
      collection = database.collection("yankees-players");
      console.log("Connected to MongoDB");
    });

  if (process.env.NODE_ENV === "production") {
    connect(process.env.MONGODB_SERVER);
  } else {
    fs.readFile("local.env", "utf-8", (error, data) => {
      if (error) {
        console.log("Unable to read environment variable:", error);
        throw error;
      }
      connect(data.split('"')[1]);
    });
  }
});
