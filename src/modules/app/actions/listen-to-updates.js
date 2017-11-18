import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import syncBlockchain from 'modules/app/actions/sync-blockchain';
import syncUniverse from 'modules/universe/actions/sync-universe';
import updateAssets from 'modules/auth/actions/update-assets';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import * as TYPES from 'modules/transactions/constants/types';

export function listenToUpdates() {
  return (dispatch, getState) => {
    // const { eventsAPI, contractAddresses } = getState()
    augur.events.startListeners({
      Augur: {
        MarketCreated: (msg) => {
          console.log("Augur", "MarketCreated", msg)
          if (msg && msg.market) {
            console.log('marketCreated:', msg);
            dispatch(loadMarketsInfo([msg.market]));
            if (msg.marketCreator === getState().loginAccount.address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.MARKET_CREATED, [msg]));
            }
          }
        },
        TokensTransferred: (msg) => {
          if (msg) {
            console.log('TokensTransferred:', msg);
            const { address } = getState().loginAccount;
            if (msg.from === address || msg.to === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.TOKENS_TRANSFERED, [msg]));
            }
          }
        },
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
        Transfer: (msg) => {
          if (msg) {
            console.log('Transfer:', msg);
            const { address } = getState().loginAccount;
            if (msg._from === address || msg._to === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.TRANSFER, [msg]));
            }
          }
        },
        Approval: (msg) => {
          if (msg) {
            console.log('Approval:', msg);
            const { address } = getState().loginAccount;
            if (msg._owner === address || msg._spender === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.APPROVAL, [msg]));
            }
          }
        },
      },
    }, (...args) => {
      // TODO: figure this out, i get an error when trying to call syncBlockchain() and i believe that's what i need.
      // console.log(args)
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
