import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import syncBlockchain from 'modules/app/actions/sync-blockchain';
import syncUniverse from 'modules/universe/actions/sync-universe';
import updateAssets from 'modules/auth/actions/update-assets';
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
    const { eventsAPI, contractAddresses } = getState()
    console.log(eventsAPI, contractAddresses)
    augur.events.startListeners({
      Augur: {
        MarketCreated: (...args) => {
          console.log("Augur", "MarketCreated", args)
          if (args && args.marketID) {
            console.log('marketCreated:', args);
            dispatch(loadMarketsInfo([args.marketID]));
            if (args.sender === getState().loginAccount.address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.MARKET_CREATED, [args]));
            }
          }
        },
        TokensTransferred: (...args) => console.log("Augur", "TokensTransferred", args),
        OrderCanceled: (...args) => console.log("Augur", "OrderCanceled", args),
        OrderCreated: (...args) => console.log("Augur", "OrderCreated", args),
        OrderFilled: (...args) => console.log("Augur", "OrderFilled", args),
        TradingProceedsClaimed: (...args) => console.log("Augur", "TradingProceedsClaimed", args),
        DesignatedReportSubmitted: (...args) => console.log("Augur", "DesignatedReportSubmitted", args),
        ReportSubmitted: (...args) => console.log("Augur", "ReportSubmitted", args),
        WinningTokensRedeemed: (...args) => console.log("Augur", "WinningTokensRedeemed", args),
        ReportsDisputed: (...args) => console.log("Augur", "ReportsDisputed", args),
        MarketFinalized: (...args) => console.log("Augur", "MarketFinalized", args),
        UniverseForked: (...args) => console.log("Augur", "UniverseForked", args),
      },
      LegacyReputationToken: {
        Transfer: (...args) => console.log("LegacyReputationToken", "Transfer", args),
        Approval: (...args) => console.log("LegacyReputationToken", "Approval", args),
      },
    }, (...args) => {
      // TODO: figure this out, i get an error when trying to call syncBlockchain() and i believe that's what i need.
      console.log(args)
      // dispatch(syncBlockchain())
      // dispatch(updateAssets())
      // dispatch(syncBlockchain)
      dispatch(syncUniverse())
    },
    (...x) => console.log('removal of block', x),
    (...y) => console.log('listener sync complete', y))
    // TODO subscribe to augur-node updates
  }
}
