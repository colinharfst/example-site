import * as React from "react";

export function Home() {
  React.useEffect(() => {
    document.title = "Colin Harfst - Home";
  }, []);

  return (
    <div>
      <h2>Here's some home text</h2>
    </div>
  );
}

export default Home;
