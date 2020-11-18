import React from "react";
import "./signature.scss";

const isWideScreen = false;

export function Signature() {
  if (isWideScreen) {
    return (
      <svg width="532" height="76" viewBox="0 0 532 76" fill="none">
        <g>
          {/* Letters are 60 tall x 40 wide (except L, I, F, & T which are 35 wide) */}
          {/* Letters are 10 thick */}
          {/* Everything has a margin of 8 */}
          <path
            d="m 48 8 c -50 -5 -50 65 0 60 l 0 -10 c -36 5 -36 -45 0 -40 l 0 -11"
            id="C"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 76 8 c -20 0 -20 30 -20 30 c 0 0 0 30 20 30 c 20 0 20 -30 20 -30 c 0 0 0 -30 -20 -30 m 0 10 c -10 0 -10 20 -10 20 c 0 0 0 20 10 20 c 10 0 10 -20 10 -20 c 0 0 0 -20 -10 -20"
            id="O"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path d="m 104 8 l 0 60 35 0 0 -10 -25 0 0 -50 -11 0" id="L" stroke="#D3D3D3" stroke-width="2" />
          <path
            d="m 159.5 8 l -12.5 0 0 10 12.5 0 0 40 -12.5 0 0 10 35 0 0 -10 -12.5 0 0 -40 12.5 0 0 -10 -22.5 0"
            id="I"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 190 8 l 0 60 10 0 0 -37.5 20 37.5 10 0 0 -60 -10 0 0 37.5 -20 -37.5 -11 0"
            id="N"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 292 33 l -20 0 0 -25 -10 0 0 60 10 0 0 -25 20 0 0 25 10 0 0 -60 -10 0 0 25 -1 0"
            id="H"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 324 8 l -15 60 10 0 5 -20 10 0 5 20 10 0 -15 -60 -11 0 m 3.5 30 5 0 -2.5 -10 -2.5 10 1 0 "
            id="A"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 358 8 l 0 60 10 0 0 -25 7.5 0 12.5 25 10 0 -15 -30 c 12 -6 25 -36 -25 -30 l -1 0 m 10 10 l 0 15 7.5 0 c 12 -6 15 -18 -7.5 -15 l -1 0"
            id="R"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 441 8 l -35 0 0 60 10 0 0 -30 15 0 0 -10 -15 0 0 -10 25 0 0 -10 -1 0"
            id="F"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 489 23 c 0 -20 -40 -20 -40 0 c 0 15 12 20 20 20 c 8 0 10 4 10 10 c 0 8 -18 8 -20 0 l -10 0 c 0 20 40 20 40 0 c 0 -15 -12 -20 -20 -20 c -8 0 -10 -4 -10 -10 c 0 -8 18 -8 20 0 l 11 0"
            id="S"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 512 8 l -17.5 0 0 10 12.5 0 0 50 10 0 0 -50 12.5 0 0 -10 -17.5 0"
            id="T"
            stroke="#D3D3D3"
            stroke-width="2"
          />
        </g>
      </svg>
    );
  } else {
    return (
      <svg width="286" height="160" viewBox="0 0 286 160" fill="none">
        <g>
          {/* Letters are 60 tall x 40 wide (except L, I, F, & T which are 35 wide) */}
          {/* Letters are 10 thick */}
          {/* Everything has a margin of 8 */}
          <path
            d="m 72 8 c -50 -5 -50 65 0 60 l 0 -10 c -36 5 -36 -45 0 -40 l 0 -11"
            id="C"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 100 8 c -20 0 -20 30 -20 30 c 0 0 0 30 20 30 c 20 0 20 -30 20 -30 c 0 0 0 -30 -20 -30 m 0 10 c -10 0 -10 20 -10 20 c 0 0 0 20 10 20 c 10 0 10 -20 10 -20 c 0 0 0 -20 -10 -20"
            id="O"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path d="m 128 8 l 0 60 35 0 0 -10 -25 0 0 -50 -11 0" id="L" stroke="#D3D3D3" stroke-width="2" />
          <path
            d="m 183.5 8 l -12.5 0 0 10 12.5 0 0 40 -12.5 0 0 10 35 0 0 -10 -12.5 0 0 -40 12.5 0 0 -10 -22.5 0"
            id="I"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 214 8 l 0 60 10 0 0 -37.5 20 37.5 10 0 0 -60 -10 0 0 37.5 -20 -37.5 -11 0"
            id="N"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 38 117 l -20 0 0 -25 -10 0 0 60 10 0 0 -25 20 0 0 25 10 0 0 -60 -10 0 0 25 -1 0"
            id="H"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 71 92 l -15 60 10 0 5 -20 10 0 5 20 10 0 -15 -60 -11 0 m 3.5 30 5 0 -2.5 -10 -2.5 10 1 0 "
            id="A"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 104 92 l 0 60 10 0 0 -25 7.5 0 12.5 25 10 0 -15 -30 c 12 -6 25 -36 -25 -30 l -1 0 m 10 10 l 0 15 7.5 0 c 12 -6 15 -18 -7.5 -15 l -1 0"
            id="R"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 187 92 l -35 0 0 60 10 0 0 -30 15 0 0 -10 -15 0 0 -10 25 0 0 -10 -1 0"
            id="F"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 235 107 c 0 -20 -40 -20 -40 0 c 0 15 12 20 20 20 c 8 0 10 4 10 10 c 0 8 -18 8 -20 0 l -10 0 c 0 20 40 20 40 0 c 0 -15 -12 -20 -20 -20 c -8 0 -10 -4 -10 -10 c 0 -8 18 -8 20 0 l 11 0"
            id="S"
            stroke="#D3D3D3"
            stroke-width="2"
          />
          <path
            d="m 260.5 92 l -17.5 0 0 10 12.5 0 0 50 10 0 0 -50 12.5 0 0 -10 -17.5 0"
            id="T"
            stroke="#D3D3D3"
            stroke-width="2"
          />
        </g>
      </svg>
    );
  }
}

export default Signature;
