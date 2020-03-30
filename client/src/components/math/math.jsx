import React from "react";
// import { Document, Page } from "react-pdf/dist/entry.webpack";
// remember .env.development GENERATE_SOURCEMAP=false
import research from "./research.pdf";

import "./math.scss";

export function Math() {
  document.title = "Math Research";

  // const [page, setPage] = useState(1);

  return (
    <div className="pdf-wrapper">
      <object className="research" data={research} type="application/pdf" width="100%">
        <h2>
          Look <a href={research}>here</a> if my research isn't showing on your device
        </h2>
      </object>
    </div>
    // <div>
    //   <h2>Here's some math text</h2>
    //   {page === 2 && (
    //     <button type="button" onClick={() => setPage(1)}>
    //       Next Pg.
    //     </button>
    //   )}
    //   {page === 1 && (
    //     <button type="button" onClick={() => setPage(2)}>
    //       Next Pg.
    //     </button>
    //   )}
    //   <Document file={writeup2} style={{ display: "flex", flexDirection: "row" }}>
    //     <Page pageNumber={page} />
    //     <Page pageNumber={2} />
    //   </Document>
    // </div>
  );
}

export default Math;
