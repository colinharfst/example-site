import React from "react";
import "./resume.scss";
import resume from "./resume-2021.pdf";
import resumeImg from "./resume-2021.png";

export function Resume() {
  document.title = "Resume";

  return (
    <div className="resume-pdf-wrapper">
      <object className="resume" data={resume} type="application/pdf" width="100%">
        <div style={{ marginBottom: "60px" }}>
          <h3>Click the image below to download my resume.</h3>
          <a href={resume}>
            <img src={resumeImg} alt="resume" />
          </a>
        </div>
      </object>
    </div>
  );
}

export default Resume;
