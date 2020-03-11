import * as React from "react";

export function Home() {
  document.title = "Colin Harfst - Home";

  return (
    <div>
      <h2>Somehow you've made it to my website. You probably know me personally or are a recruiter. In either case, I don't have much to show you.</h2>
      <h3>
        On this site you'll be able to find my resume, some math research from college, and a collection of projects. Some of these projects are ideas that I've abandoned, while others are an attempt
        to track my interests.
      </h3>
      <h3>On this site you'll be able to find unstyled html. You'll be able to see dynamic content generated with basic front-end and back-end procedures.</h3>
      <h3>
        I'd be remiss to not mention the ReactJS + NodeJS tech stack running the site, or the Mongo cloud database that the site is connected to, or the CI/CD pipeline deploying the site using GitLab.
      </h3>
      <h3>I'd love to be designing this site with the hopes of it being the next billion dollar idea or with the intention of it landing me an incredible job, but instead I'm designing a blog.</h3>
    </div>
  );
}

export default Home;
