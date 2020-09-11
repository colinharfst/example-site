import React, { useState, useEffect } from "react";
import "./news.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

export function News() {
  document.title = "News";

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/api/climate-articles").then(async (resp) => setArticles(await resp.json()));
  }, []);

  if (!articles.length) {
    return <CircularProgress style={{ margin: "40px", color: "#282c34" }} />;
  }
  console.log(articles);
  return (
    <div className="climate-articles">
      <h2>Here are some recent articles from the New York Times on the climate and environment.</h2>
      <br />
      <div className="grid-container">
        <h2 className="title">
          <a href={articles[0].url}>{articles[0].title}</a>
        </h2>
        <h3 className="abstract">{articles[0].abstract}</h3>
        <img className="image" src={articles[0].multimedia[0].url} alt={articles[0].multimedia[0].caption} />
      </div>
      <br />
      <br />
      <div className="grid-container-inverse">
        <h2 className="title">
          <a href={articles[1].url}>{articles[1].title}</a>
        </h2>
        <h3 className="abstract">{articles[1].abstract}</h3>
        <img className="image" src={articles[1].multimedia[0].url} alt={articles[1].multimedia[0].caption} />
      </div>
      <br />
      <br />
      <div className="grid-container">
        <h2 className="title">
          <a href={articles[2].url}>{articles[2].title}</a>
        </h2>
        <h3 className="abstract">{articles[2].abstract}</h3>
        <img className="image" src={articles[2].multimedia[0].url} alt={articles[2].multimedia[0].caption} />
      </div>
      <br />
      <br />
      <p style={{ fontSize: "12px", margin: "0 64px 2vw 104px" }}>
        It is not my intention to be misusing the NYT API. The purpose of this page is for technical experimentation and
        to share interesting content. All articles are linked.
      </p>
    </div>
  );
}

export default News;
