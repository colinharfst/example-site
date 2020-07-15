import React from "react";
import resume from "./resume-2020.pdf";
import "./resume.scss";

export function Resume() {
  document.title = "Resume";

  return (
    <div className="pdf-wrapper">
      <object
        className="resume"
        data={resume}
        type="application/pdf"
        width="100%"
      >
        <h2>
          Look <a href={resume}>here</a> if my resume isn't showing on your
          device
        </h2>
      </object>
    </div>
  );
}

export default Resume;
