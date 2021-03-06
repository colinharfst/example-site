import React from "react";
import "./math.scss";
import research from "./research.pdf";
import researchImg1 from "./research-1.png";
import researchImg2 from "./research-2.png";

export function Math() {
  document.title = "Math Research";

  return (
    <div className="research-pdf-wrapper">
      <h3>Click the images below to download my research.</h3>
      <div style={{ marginBottom: "60px" }}>
        <a href={research}>
          <img src={researchImg1} alt="research page 1" />
        </a>
        <a href={research}>
          <img src={researchImg2} alt="research page 2" />
        </a>
      </div>
    </div>
  );
}

export default Math;
