import React, { useEffect } from "react";
import "./chess-data.scss";

export function ChessData() {
  document.title = "Chess Data";

  useEffect(() => {
    const func = async () => {
      return await fetch("/api/chess-data");
    };
    func();
  });

  return (
    <div>
      <h3>Chess Data Incoming.</h3>
    </div>
  );
}

export default ChessData;
