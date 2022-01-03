import React from "react";
import "./resume.scss";

export function Resume() {
	document.title = "Resume";

	return (
		<div className="resume-pdf-wrapper">
			<object className="resume" data="/Colin-Harfst-Resume-2022.pdf" type="application/pdf" width="100%">
				<div style={{ marginBottom: "60px" }}>
					<h3>Click the image below to download my resume.</h3>
					<a href="/Colin-Harfst-Resume-2022.pdf">
						<img src="/Colin-Harfst-Resume-2022.png" alt="resume" />
					</a>
				</div>
			</object>
		</div>
	);
}

export default Resume;
