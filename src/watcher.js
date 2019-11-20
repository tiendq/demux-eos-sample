'use strict';

const { BaseActionWatcher } = require('demux');
const { NodeosActionReader } = require('demux-eos');
const ObjectActionHandler = require('./ObjectActionHandler');
const handler = require('./handlers/v1');

const actionHandler = new ObjectActionHandler([handler]);

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
const actionReader = new NodeosActionReader({
  startAtBlock: -1,
  onlyIrreversible: true,
  nodeosEndpoint: 'http://jungle2.cryptolions.io:80'
});

/*
 * This ready-to-use base class helps coordinate the Action Reader and Action Handler, passing through block information
 * from the Reader to the Handler. The third argument is the polling loop interval in milliseconds.
 */
const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  500
);

async function startWatcher() {
  await actionWatcher.watch();
}

module.exports = {
  startWatcher
};
