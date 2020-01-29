import * as React from "react";

export function Math() {
  React.useEffect(() => {
    document.title = "Math Research";
  }, []);

  return (
    <div>
      <h2>Here's some math text</h2>
    </div>
  );
}

export default Math;
