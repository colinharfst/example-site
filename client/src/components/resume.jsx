import * as React from "react";

export function Resume() {
  React.useEffect(() => {
    document.title = "Resume";
  }, []);

  return (
    <div>
      <h2>Here's some resume text</h2>
    </div>
  );
}

export default Resume;
