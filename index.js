'use strict';

const debug = require('debug')('app');
const express = require('express');
const { startWatcher } = require('./src');

const app = express();

app.get('/', (request, response) => {
  response.status(200).end('Server running.');
});

app.listen(8080, () => {
  debug('Listening on 8080...');

  try {
    startWatcher();
    debug('Watching blockchain events...');
  } catch (error) {
    debug('Fail to watch %o', error);
    process.exit(1);
  }
});
