/*
 * The role of the Action Handler is to receive block data passed from the Action Reader,
 * and populate some external state deterministically derived from that data,
 * as well as trigger side-effects.
 */

const debug = require('debug')('actionHandler');
const { AbstractActionHandler } = require('demux');

let state = {
  blockCount: 0,
  indexState: {
    blockNumber: 0,
    blockHash: '',
    isReplay: false,
    handlerVersionName: 'v1'
  }
};

class ObjectActionHandler extends AbstractActionHandler {
  async handleWithState(handle) {
    debug('=== Pre handleWithState ===');
    await handle(state) // calls updateTransferData, updateIndexState
    debug('=== Post handleWithState ===');
  }

  async loadIndexState() {
    debug('=== loadIndexState ===');
    return state.indexState;
  }

  async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
    ++ stateObj.blockCount;

    debug('=== updateIndexState ===');
    debug('blockCount: %d', stateObj.blockCount);
    debug('blockInfo: %O', block.block.blockInfo);
    debug('first tracked action: %O', block.block.actions.filter(action => 'eosio.token::transfer' === action.type).slice(0, 1));
    debug('blockMeta: %O', block.blockMeta);
    debug('lastIrreversibleBlockNumber: %d', block.lastIrreversibleBlockNumber);

    stateObj.indexState.blockNumber = block.block.blockInfo.blockNumber;
    stateObj.indexState.blockHash = block.block.blockInfo.blockHash;
    stateObj.indexState.isReplay = isReplay;
    stateObj.indexState.handlerVersionName = handlerVersionName;
  }

  async rollbackTo(blockNumber) {
  }

  async setup() {
  }
}

module.exports = ObjectActionHandler
