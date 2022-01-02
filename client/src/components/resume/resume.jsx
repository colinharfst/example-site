import React from "react";
import "./resume.scss";
import resume from "./Colin_Harfst_Resume_2022.pdf";
import resumeImg from "./Colin_Harfst_Resume_2022.png";

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
