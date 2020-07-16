import React from "react";
import "./math.scss";
import research from "./research.pdf";
import researchImg1 from "./research-1.png";
import researchImg2 from "./research-2.png";

export function Math() {
  document.title = "Math Research";

  return (
    <div className="research-pdf-wrapper">
      <object
        className="research"
        data={research}
        type="application/pdf"
        width="100%"
      >
        <h3>Click the images below to download my research.</h3>
        <a href={research}>
          <img src={researchImg1} alt="research page 1" />
        </a>
        <a href={research}>
          <img src={researchImg2} alt="research page 2" />
        </a>
      </object>
    </div>
  );
}

export default Math;
