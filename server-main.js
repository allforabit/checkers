import path from 'path';
import Express from 'express';
import qs from 'qs';

import React from 'react';
import { Provider } from 'react-redux';

import {configureStore} from './store';
import {App} from './containers';
import { fetchGame } from './api';

const app = new Express();
const port = 3000;

// Use this middleware to server up static files built into dist
app.use(require('serve-static')(path.join(__dirname, './dist')));

// This is fired every time the server side receives a request
app.use(handleRender);

function handleRender(req, res) {
  // Query our mock API asynchronously
  fetchGame(apiResult => {
    // Read the counter from the request, if provided
    // const params = qs.parse(req.query);
    const game = apiResult || {};

    // Compile an initial state
    const initialState = { game };

    // Create a new Redux store instance
    const store = configureStore(initialState);

    // Render the component to a string
    const html = React.renderToString(
      <Provider store={store}>
        { () => <App/> }
      </Provider>);

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState));

  });
}

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
        <link href="http://d2v52k3cl9vedd.cloudfront.net/basscss/5.0.1/basscss.min.css" rel="stylesheet">
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});
