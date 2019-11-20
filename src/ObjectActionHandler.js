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
    // debug('block: %O', block);

    stateObj.indexState.blockNumber = block.blockInfo.blockNumber;
    stateObj.indexState.blockHash = block.blockInfo.blockHash;
    stateObj.indexState.isReplay = isReplay;
    stateObj.indexState.handlerVersionName = handlerVersionName;
  }

  async rollbackTo(blockNumber) {
  }

  async setup() {
  }
}

module.exports = ObjectActionHandler
