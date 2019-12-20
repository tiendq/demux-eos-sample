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
  // #2
  async handleWithState(handle) {
    debug('=== Pre handleWithState ===');
    // sync. calls
    await handle(state) // calls updateTransferData, updateIndexState

    // #4
    debug('=== Post handleWithState ===');
  }

  // #1 - call order by watcher
  async loadIndexState() {
    debug('=== loadIndexState ===');
    return state.indexState;
  }

  // #3
  async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
    ++ stateObj.blockCount;

    debug('=== updateIndexState ===');
    debug('blockCount: %d', stateObj.blockCount);
    debug('blockInfo: %O', block.block.blockInfo);
    debug('first tracked action: %O', block.block.actions.filter(action => 'badge.can::createcert' === action.type).slice(0, 1));
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
