import React, { useEffect } from "react";
import "./home.scss";

export function Home() {
  document.title = "Colin Harfst - Home";

  useEffect(() => {
    // Using these so that when Kaffeine pings Heroku, MongoDB is updated
    // https://kaffeine.herokuapp.com/
    fetch("/api/live-baseball/nyamlb/592450");
    fetch("/api/live-baseball/houmlb/514888");
  }, []);

  return (
    <div className="home-text">
      <h3>
        Somehow you've made it to my website. You probably know me personally or are a recruiter. In either case,
        welcome.
      </h3>
      <h3>
        On this site you'll be able to find my resume, some math research from college, and a collection of projects.
        Most of these projects have been abandoned and now serve as an artifact of something I was once interested in.
      </h3>
      <h3>
        Within this minimalist site there are some signs of a modern full-stack application, built with ReactJS and
        NodeJS, connected to a MongoDB cloud database, deployed via a GitLab CI/CD pipeline, and hosted with Heroku.
        Otherwise, this site is mostly underwhelming, unstyled HTML serving as a blog.
      </h3>
    </div>
  );
}

export default Home;
