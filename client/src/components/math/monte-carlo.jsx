import React, { useEffect, useState } from "react";
import "./monte-carlo.scss";

export function MonteCarlo() {
  document.title = "Monte Carlo Simulation";

  const [squareCount, setSquareCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const radius = 80;
  const canvasWidth = 5.25 * radius;
  const canvasHeight = 2.5 * radius;

  useEffect(
    () => {
      const canvas = document.getElementById("simulation");
      if (canvas.getContext) {
        const context = canvas.getContext("2d");
        context.lineWidth = 3;
        context.strokeStyle = "#047695";
        context.fillStyle = "#047695";

        const square = new Path2D();
        const squareTopLeftCorner = { x: 0.75 * radius, y: 0.75 * radius };
        square.rect(squareTopLeftCorner.x, squareTopLeftCorner.x, radius, radius);
        context.stroke(square);

        const circle = new Path2D();
        const circleCenter = { x: 3.5 * radius, y: 1.25 * radius };
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
            x >= squareTopLeftCorner.x &&
            x < squareTopLeftCorner.x + radius &&
            y >= squareTopLeftCorner.y &&
            y < squareTopLeftCorner.y + radius
          )
            return true;
          return false;
        };

        const inCircle = (x, y) => {
          const dist = Math.sqrt((x - circleCenter.x) ** 2 + (y - circleCenter.y) ** 2);
          if (dist <= radius) return true;
          return false;
        };

        let sqCount = 0;
        let circCount = 0;
        const timeout = 100;

        const fillPoint = (i) => {
          if (i < len) {
            context.fillRect(pixArray[i].x, pixArray[i].y, 2, 2);
            if (inSquare(pixArray[i].x, pixArray[i].y)) {
              setSquareCount(++sqCount);
            }
            if (inCircle(pixArray[i].x, pixArray[i].y)) {
              setCircleCount(++circCount);
            }
            setTotalCount(i + 1);
            setTimeout(() => fillPoint(++i), timeout);
          }
        };

        context.lineWidth = 1;
        setTimeout(() => fillPoint(0), timeout);
      }
    },
    // Was getting a warning without canvasWidth or canvasHeight in this array, but nothing about radius
    [radius, canvasWidth, canvasHeight]
  );

  const calcPi = (pi) => {
    if (isNaN(pi) || !isFinite(pi)) return "Undefined";
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

  return (
    <>
      <canvas id="simulation" width={canvasWidth} height={canvasHeight}>
        <h3>Monte Carlo</h3>
      </canvas>
      <h3>Total Count: {totalCount}</h3>
      <h3>Square Count: {squareCount}</h3>
      <h3>Circle Count: {circleCount}</h3>
      <h3>Mysterious Ratio: {calcPi(circleCount / squareCount)}</h3>
    </>
  );
}

export default MonteCarlo;
