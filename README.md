[![build-passing-badge](https://img.shields.io/travis/standard/eslint-config-standard/master.svg)](https://gitlab.com/colinharfst/example-site)
[![js-standard-style-badge](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

This project was developed with a simple create-react-app followed by initializing an express server and connecting to a [MongoDB](https://cloud.mongodb.com/v2/5e2f0d4879358e745601aacd#clusters/detail/mlb-player-data) cluster in the cloud.

## To Develop

To run this project locally, you should do the following:

`cd client && npm i` - This installs the dependencies for our client-side processes.

`cd .. && npm i` - This installs the dependencies for our server-side processes.

`npm run dev` - This concurrently builds the front-end and back-end for our application.

<br/>The front-end is available at [http://localhost:3000](http://localhost:3000).
<br/>The back-end is proxied through [http://localhost:5000/api](http://localhost:5000/api/live-baseball/nyamlb/592450).
<br/>Certain pages won't work unless local.env is populated with the correct database connection string.

### Deployment

This app is deployed through [GitLab CI](https://gitlab.com/colinharfst/example-site) and [Heroku](https://dashboard.heroku.com/apps/colin-harfst-site).
