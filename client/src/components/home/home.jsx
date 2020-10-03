import React from "react";
import "./home.scss";
import self from "./self.png";
import selfie from "./selfie.png";

export function Home() {
  document.title = "Colin Harfst - Home";

  return (
    <>
      <img
        src={Math.floor(Math.random() * 2) ? self : selfie}
        alt={Math.floor(Math.random() * 2) ? "not a selfie" : "a selfie"}
        height={250}
      />
      <div className="home-text">
        <h3>
          Hi! Somehow you've made it to my website. You probably know me personally or are a recruiter. In either case,
          welcome.
        </h3>
        <h3>
          On this site you'll be able to find my resume and a collection of small projects that I've worked on for my
          own entertainment.
        </h3>
        <h3>
          Within this minimalist site there are some signs of a modern full-stack application, built with ReactJS and
          NodeJS, connected to a MongoDB cloud database, deployed via a GitLab CI/CD pipeline, and hosted with Heroku.
        </h3>
      </div>
    </>
  );
}

export default Home;
