const debug = require('debug')('app');
const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.status(200).end('Server running.');
});

app.listen(8080, () => {
  debug('Listening on 8080...');
});
