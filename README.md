[![travis](https://img.shields.io/travis/standard/eslint-config-standard/master.svg)](https://travis-ci.org/standard/eslint-config-standard)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

This project was developed with a simple create-react-app followed by initializing an express server and connecting to a MongoDB cluster in the cloud.

## To Develop

To run this project locally, you should do the following:

`cd client && npm i`

This installs the dependencies for our client-side processes.

`cd .. && npm i`

This installs the dependencies for our server-side processes.

`npm run dev`

This concurrently builds the front-end and back-end for our application<br />
The front-end is available at [http://localhost:3000](http://localhost:3000).<br/>
The back-end is proxied through [http://localhost:5000/api/](http://localhost:5000/api/hello).

### Deployment

This app will be deployed through [heroku](www.heroku.com).
