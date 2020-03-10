import React, { useState } from "react";
import Judge from "./judge";

export function Baseball() {
  const [playerId, setPlayerId] = useState("592450");
  const [playerName, setPlayerName] = useState("Judge");
  const [teamName, setTeamName] = useState("Yankees");
  const switchPlayers = () => {
    console.log("here");
    if (playerName === "Judge") {
      setPlayerId("514888");
      setPlayerName("Notorious Cheater Jose Altuve");
      setTeamName("Astr*s");
    } else {
      setPlayerId("592450");
      setPlayerName("Judge");
      setTeamName("Yankees");
    }
  };
  return <Judge playerId={playerId} playerName={playerName} teamName={teamName} changePlayer={switchPlayers} />;
}

export default Baseball;
