import React, { useState, useEffect } from "react";
import "./chess-data.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries } from "react-vis";
import { useHistory } from "react-router-dom";

export function ChessData() {
  document.title = "Chess Data";
  const history = useHistory();

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
    const x = await fetch("/api/chess-record").then(async (resp) => await resp.json());
    const data = x.map((game) => {
      return {
        x: new Date(game.datetime),
        y: game.elo,
      };
    });
    console.log(data);
    setGameData(data);
  };

  const getXAxisTicks = (viewWidth) => {
    const year = new Date().getFullYear();
    const dateAxisTicks = [];
    for (let yr = 2018; yr <= year; yr++) {
      for (let month = 0; month < 12; month += 2) {
        const beginRangeConstraint = !(yr === 2018 && month < 6);
        const endRangeConstraint = !(yr === year && month > new Date().getMonth());
        const sizeConstraint = viewWidth <= 675 ? month % 4 !== 2 : true;
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
    <div className="chess-data">
      <h3>Click along the graph below to see a game from that stretch of time.</h3>
      <XYPlot width={vw} height={400} yDomain={[1075, 1750]} margin={{ left: 40, right: 20, top: 10, bottom: 40 }}>
        <XAxis
          tickValues={xAxisTicks}
          tickFormat={(v) => {
            const d = new Date(v); // Using to reverse valueOf()
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          }}
        />
        <YAxis title="ELO" tickValues={[1100, 1200, 1300, 1400, 1500, 1600, 1700]} tickFormat={(v) => parseInt(v)} />
        <HorizontalGridLines />
        <LineMarkSeries
          data={gameData}
          lineStyle={{ stroke: "#047695" }}
          size={6}
          onNearestX={(value, { event, innerX, index }) => {
            // console.log(value, innerX, index);
          }}
          onValueClick={(datapoint, event) => {
            history.push(`/chess-game/${datapoint.x.toISOString()}`);
          }}
        />
      </XYPlot>
    </div>
  );
}

export default ChessData;
