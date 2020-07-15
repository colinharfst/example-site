import React, { useState, useEffect } from "react";
import "./chess-data.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

export function ChessData() {
  document.title = "Chess Data";

  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const getGameData = async () => {
      const x = await fetch("/api/chess-data").then(
        async (resp) => await resp.json()
      );
      console.log(x);
      setGameData(x);
    };
    getGameData();
  }, []);

  if (!gameData) {
    return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
  }
  return (
    <div>
      <h3>Chess Data Incoming.</h3>
    </div>
  );
}

export default ChessData;
