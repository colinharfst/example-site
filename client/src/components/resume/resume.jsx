import * as React from "react";
import resume from "./resume-2020.pdf";
import "./resume.scss";

export function Resume() {
  document.title = "Resume";

  return (
    <div className="pdf-wrapper">
      <object className="resume" data={resume} type="application/pdf" width="100%">
        <a href={resume} target="_blank" rel="noopener noreferrer">
          Try looking here if that's not loading
        </a>
      </object>
    </div>
  );
}

export default Resume;
