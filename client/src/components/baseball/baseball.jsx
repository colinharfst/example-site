import React, { useState } from "react";
import Judge from "./judge";
import "./baseball.scss";

export function Baseball() {
  const [playerId, setPlayerId] = useState("592450");
  const [playerName, setPlayerName] = useState("Judge");
  const [teamName, setTeamName] = useState("Yankees");
  const switchPlayers = (fixedNameId) => {
    switch (fixedNameId) {
      case "Altuve":
        setPlayerId("514888");
        setPlayerName("Altuve");
        setTeamName("Astr*s");
        break;
      case "Judge":
        setPlayerId("592450");
        setPlayerName("Judge");
        setTeamName("Yankees");
        break;
      case "G":
        setPlayerId("519317");
        setPlayerName("Stanton");
        setTeamName("Yankees");
        break;
      case "GT":
        setPlayerId("650402");
        setPlayerName("Gleyber");
        setTeamName("Yankees");
        break;
      case "Didi":
        setPlayerId("544369");
        setPlayerName("Didi");
        setTeamName("Phillies");
        break;
      default:
        break;
    }
  };
  return (
    <div
      className={
        playerName === "Altuve"
          ? "baseball astros-player"
          : playerName === "Didi"
          ? "baseball phillies-player"
          : "baseball yankees-player"
      }
    >
      <Judge playerId={playerId} playerName={playerName} teamName={teamName} changePlayer={switchPlayers} />
    </div>
  );
}

export default Baseball;
