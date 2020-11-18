import React, { useEffect, useState, useRef } from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import "./monte-carlo.scss";

export function MonteCarlo() {
  document.title = "Monte Carlo Simulation";

  const [squareCount, setSquareCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const radius = 80;
  const canvasWidth = 5.25 * radius;
  const canvasHeight = 2.5 * radius;
  const squareTopLeftCorner = { x: 0.75 * radius, y: 0.75 * radius };
  const circleCenter = { x: 3.5 * radius, y: 1.25 * radius };

  let timeoutFunction = useRef(null);

  useEffect(() => {
    const canvas = document.getElementById("simulation");
    if (canvas.getContext) {
      const context = canvas.getContext("2d");
      context.lineWidth = 3;
      context.strokeStyle = "#047695";
      context.fillStyle = "#047695";

      const square = new Path2D();
      square.rect(squareTopLeftCorner.x, squareTopLeftCorner.x, radius, radius);
      context.stroke(square);

      const circle = new Path2D();
      circle.arc(circleCenter.x, circleCenter.y, radius, 0, 2 * Math.PI);
      context.stroke(circle);

      const len = 10000;
      const pixArray = [];

      for (let i = 0; i < len; i++) {
        const x = Math.floor(canvasWidth * Math.random());
        const y = Math.floor(canvasHeight * Math.random());
        pixArray.push({ x, y });
      }

      const inSquare = (x, y) => {
        if (
          x + 1 >= squareTopLeftCorner.x &&
          x + 1 <= squareTopLeftCorner.x + radius &&
          y + 1 >= squareTopLeftCorner.y &&
          y + 1 <= squareTopLeftCorner.y + radius
        )
          return true;
        return false;
      };

      const inCircle = (x, y) => {
        const dist = Math.sqrt((x + 1 - circleCenter.x) ** 2 + (y + 1 - circleCenter.y) ** 2);
        if (dist <= radius) return true;
        return false;
      };

      let sqCount = 0;
      let circCount = 0;
      const timeout = 100;

      const fillPoint = (i) => {
        if (i < len) {
          if (inSquare(pixArray[i].x, pixArray[i].y)) {
            context.fillStyle = "#ff7695";
            context.fillRect(pixArray[i].x, pixArray[i].y, 2, 2);
            setSquareCount(++sqCount);
          } else if (inCircle(pixArray[i].x, pixArray[i].y)) {
            context.fillStyle = "#ff7695";
            context.fillRect(pixArray[i].x, pixArray[i].y, 2, 2);
            setCircleCount(++circCount);
          } else {
            context.fillStyle = "#61dafb";
            context.fillRect(pixArray[i].x, pixArray[i].y, 2, 2);
          }
          setTotalCount(i + 1);
          timeoutFunction.current = setTimeout(() => fillPoint(++i), timeout);
        }
      };

      timeoutFunction.current = setTimeout(() => fillPoint(0), timeout);
    }
  }, [canvasHeight, canvasWidth, squareTopLeftCorner.x, squareTopLeftCorner.y, circleCenter.x, circleCenter.y]);

  const calcPi = (pi) => {
    if (isNaN(pi) || !isFinite(pi)) return "Undefined...";
    if (!isFinite(pi)) return "Infinity!";
    let piFormatted = "3.14";
    if (squareCount) {
      const exp = new RegExp("^-?\\d+(?:.\\d{0," + (2 || -1) + "})?");
      const truncated = pi.toString().match(exp)[0];
      if (truncated.includes(".")) {
        const dec = truncated.split(".")[1];
        if (dec.length === 2) piFormatted = truncated;
        if (dec.length === 1) piFormatted = truncated + "0";
      } else piFormatted = truncated + ".00";
    }
    return piFormatted;
  };

  const restartRandomFilling = () => {
    const canvas = document.getElementById("simulation");
    if (canvas.getContext) {
      const context = canvas.getContext("2d");
      context.fillStyle = "#047695";

      const len = 10000 - totalCount;
      const pixArray = [];

      for (let i = 0; i < len; i++) {
        const x = Math.floor(canvasWidth * Math.random());
        const y = Math.floor(canvasHeight * Math.random());
        pixArray.push({ x, y });
      }

      const inSquare = (x, y) => {
        if (
          x + 1 >= squareTopLeftCorner.x &&
          x + 1 <= squareTopLeftCorner.x + radius &&
          y + 1 >= squareTopLeftCorner.y &&
          y + 1 <= squareTopLeftCorner.y + radius
        )
          return true;
        return false;
      };

      const inCircle = (x, y) => {
        const dist = Math.sqrt((x + 1 - circleCenter.x) ** 2 + (y + 1 - circleCenter.y) ** 2);
        if (dist <= radius) return true;
        return false;
      };

      let sqCount = squareCount;
      let circCount = circleCount;
      const timeout = 100;

      const fillPoint = (i) => {
        const modifiedIndex = i - totalCount;
        if (modifiedIndex < len) {
          if (inSquare(pixArray[modifiedIndex].x, pixArray[modifiedIndex].y)) {
            context.fillStyle = "#ff7695";
            context.fillRect(pixArray[modifiedIndex].x, pixArray[modifiedIndex].y, 2, 2);
            setSquareCount(++sqCount);
          } else if (inCircle(pixArray[modifiedIndex].x, pixArray[modifiedIndex].y)) {
            context.fillStyle = "#ff7695";
            context.fillRect(pixArray[modifiedIndex].x, pixArray[modifiedIndex].y, 2, 2);
            setCircleCount(++circCount);
          } else {
            context.fillStyle = "#61dafb";
            context.fillRect(pixArray[modifiedIndex].x, pixArray[modifiedIndex].y, 2, 2);
          }
          setTotalCount(i + 1);
          timeoutFunction.current = setTimeout(() => fillPoint(++i), timeout);
        }
      };

      timeoutFunction.current = setTimeout(() => fillPoint(totalCount), timeout);
    }
  };

  return (
    <>
      <canvas id="simulation" width={canvasWidth} height={canvasHeight}>
        <h3>Monte Carlo</h3>
      </canvas>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => clearTimeout(timeoutFunction.current)}>
          <PauseIcon />
        </button>
        <span style={{ width: "300px" }}>
          <h3>Total Count: {totalCount}</h3>
          <h3>Square Count: {squareCount}</h3>
          <h3>Circle Count: {circleCount}</h3>
          <h3>Mysterious Ratio: {calcPi(circleCount / squareCount)}</h3>
        </span>
        <button onClick={() => restartRandomFilling()}>
          <PlayArrowIcon />
        </button>
      </div>
    </>
  );
}

export default MonteCarlo;
