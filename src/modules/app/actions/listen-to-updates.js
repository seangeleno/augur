import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import syncUniverse from 'modules/universe/actions/sync-universe';
import * as TYPES from 'modules/transactions/constants/types';

export function listenToUpdates() {
  return (dispatch, getState) => {
    /**
     * Start listening for events emitted by the Ethereum blockchain.
     * @param {Object.<function>=} onEventCallbacks Callbacks to fire when events are received, keyed by contract name and event name.
     * @param {function=} onBlockAdded Callback to fire when new blocks are received.
     * @param {function=} onBlockRemoved Callback to fire when blocks are removed.
     * @param {function=} onSetupComplete Called when all listeners are successfully set up.
     */
    augur.events.startListeners({
      Augur: {
        MarketCreated: console.log("Augur", "MarketCreated"),
        TokensTransferred: console.log("Augur", "TokensTransferred"),
        OrderCanceled: console.log("Augur", "OrderCanceled"),
        OrderCreated: console.log("Augur", "OrderCreated"),
        OrderFilled: console.log("Augur", "OrderFilled"),
        TradingProceedsClaimed: console.log("Augur", "TradingProceedsClaimed"),
        DesignatedReportSubmitted: console.log("Augur", "DesignatedReportSubmitted"),
        ReportSubmitted: console.log("Augur", "ReportSubmitted"),
        WinningTokensRedeemed: console.log("Augur", "WinningTokensRedeemed"),
        ReportsDisputed: console.log("Augur", "ReportsDisputed"),
        MarketFinalized: console.log("Augur", "MarketFinalized"),
        UniverseForked: console.log("Augur", "UniverseForked"),
      },
      LegacyReputationToken: {
        Transfer: console.log("LegacyReputationToken", "Transfer"),
        Approval: console.log("LegacyReputationToken", "Approval"),
      },
    }, syncUniverse, )
    // TODO subscribe to augur-node updates
  }
}
