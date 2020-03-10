import * as React from "react";
import resume from "./resume-2020.pdf";
import "./resume.scss";

export function Resume() {
  document.title = "Resume";

  return (
    <div className="pdf-wrapper">
      <object className="resume" data={resume} type="application/pdf" width="100%">
        <h2>
          Look{" "}
          <a href={resume} target="_blank" rel="noopener noreferrer">
            here
          </a>{" "}
          if the PDF isn't loading on your device
        </h2>
      </object>
    </div>
  );
}

export default Resume;
