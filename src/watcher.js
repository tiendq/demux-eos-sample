'use strict';

const { BaseActionWatcher } = require('demux');
const { StateHistoryPostgresActionReader } = require('demux-eos/v1.8');
const ObjectActionHandler = require('./ObjectActionHandler');
const handler = require('./handlers/v1');

const actionHandler = new ObjectActionHandler([handler], {
  logLevel: 'debug'
});

/*
 * Since we're reading from the EOS main net, we can use the NodeosActionReader supplied by the demux-eos package. This
 * utilizes any public Nodeos endpoint as a source of block data.
 *
 * The second argument defines at what block this should start at. For values less than 1, this switches to a "tail"
 * mode, where we start at an offset of the most recent blocks.
 *
 * More information can be found on the main demux-eos repository:
 * https://github.com/EOSIO/demux-js-eos
 */
const actionReader = new StateHistoryPostgresActionReader({
  startAtBlock: -1, // 16839643
  onlyIrreversible: true,
  dbSchema: process.env.BLOCKCHAIN_DB_SCHEMA,
  massiveConfig: {
    host: process.env.BLOCKCHAIN_DB_HOST,
    port: Number(process.env.BLOCKCHAIN_DB_PORT),
    database: process.env.BLOCKCHAIN_DB_NAME,
    user: process.env.BLOCKCHAIN_DB_USER,
    password: process.env.BLOCKCHAIN_DB_PASSWORD
  },
  logLevel: 'debug'
});

/*
 * This ready-to-use base class helps coordinate the Action Reader and Action Handler, passing through block information
 * from the Reader to the Handler. The third argument is the polling loop interval in milliseconds.
 */
const actionWatcher = new BaseActionWatcher(actionReader, actionHandler, {
  pollInterval: 500,
  logLevel: 'debug'
});

async function startWatcher() {
  await actionReader.initialize();
  await actionWatcher.watch();
}

module.exports = {
  startWatcher
};
