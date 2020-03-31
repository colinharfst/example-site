import React, { useState } from "react";
import Judge from "./judge";
import "./baseball.scss";

export function Baseball() {
  const [playerId, setPlayerId] = useState("592450");
  const [playerName, setPlayerName] = useState("Judge");
  const [teamName, setTeamName] = useState("Yankees");
  const switchPlayers = () => {
    if (playerName === "Judge") {
      setPlayerId("514888");
      setPlayerName("Notorious Cheater José Altuve");
      setTeamName("Astr*s");
    } else {
      setPlayerId("592450");
      setPlayerName("Judge");
      setTeamName("Yankees");
    }
  };
  return (
    <div className={playerName === "Judge" ? "baseball yankees-player" : "baseball astros-player"}>
      <Judge playerId={playerId} playerName={playerName} teamName={teamName} changePlayer={switchPlayers} />
    </div>
  );
}

export default Baseball;
