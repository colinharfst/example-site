import React, { useState, useEffect } from "react";
import "./chess-data.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries } from "react-vis";

export function ChessData() {
  document.title = "Chess Data";

  const [gameData, setGameData] = useState(null);
  const [xAxisTicks, setXAxisTicks] = useState([]);
  const [vw, setViewWidth] = useState(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));

  useEffect(() => {
    loadGameData();
    window.addEventListener("resize", () =>
      setViewWidth(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
    );
  }, []);

  useEffect(() => {
    setXAxisTicks(getXAxisTicks(vw));
  }, [vw]);

  const loadGameData = async () => {
    const x = await fetch("/api/chess-data").then(async (resp) => await resp.json());
    const data = x.map((game) => {
      const dateStr = game.date.split(".");
      const timeStr = game.time.split(":");
      return {
        x: new Date(dateStr[0], dateStr[1], dateStr[2], timeStr[0], timeStr[1], timeStr[2]),
        y: game.elo,
      };
    });
    setGameData(data);
  };

  const getXAxisTicks = (viewWidth) => {
    const year = new Date().getFullYear();
    const dateAxisTicks = [];
    for (let yr = 2018; yr <= year; yr++) {
      for (let month = 1; month < 12; month += 2) {
        const beginRangeConstraint = !(yr === 2018 && month < 7);
        const endRangeConstraint = !(yr === year && month > new Date().getMonth() + 1);
        const sizeConstraint = viewWidth <= 675 ? month % 4 !== 1 : true;
        if (beginRangeConstraint && endRangeConstraint && sizeConstraint) {
          dateAxisTicks.push(new Date(yr, month, 1).valueOf()); // Using valueOf() to supress warning regarding invalid prop type
        }
      }
    }
    return dateAxisTicks;
  };

  if (!gameData) {
    return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
  }
  return (
    <div>
      <h3>Chess Data Incoming.</h3>
      <XYPlot width={vw} height={400} yDomain={[1100, 1600]} margin={{ left: 45, right: 20, top: 10, bottom: 40 }}>
        <XAxis
          tickValues={xAxisTicks}
          tickFormat={(v) => {
            const d = new Date(v); // Using to reverse valueOf()
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          }}
        />
        <YAxis title="ELO" tickValues={[1100, 1200, 1300, 1400, 1500, 1600]} tickFormat={(v) => parseInt(v)} />
        <HorizontalGridLines />
        <LineMarkSeries
          data={gameData}
          lineStyle={{ stroke: "red" }}
          size={6}
          onNearestX={(value, { event, innerX, index }) => {
            // console.log(value, innerX, index);
          }}
          onValueClick={(datapoint, event) => {
            // console.log("cliccckk", datapoint);
          }}
        />
      </XYPlot>
    </div>
  );
}

export default ChessData;
