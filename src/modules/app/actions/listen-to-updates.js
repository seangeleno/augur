import { augur } from 'services/augurjs'
import BigNumber from 'bignumber.js'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
// import syncBlockchain from 'modules/app/actions/sync-blockchain'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { updateMarketTopicPopularity } from 'modules/topics/actions/update-topics'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateAccountBidsAsksData, updateAccountCancelsData } from 'modules/my-positions/actions/update-account-trades-data'
// updateAccountTradesData
import * as TYPES from 'modules/transactions/constants/types'

export function listenToUpdates() {
  return (dispatch, getState) => {
    // const { eventsAPI, contractAddresses } = getState()
    augur.events.startListeners({
      Augur: {
        MarketCreated: (msg) => {
          if (msg && msg.market) {
            console.log(TYPES.MARKET_CREATED, msg)
            dispatch(loadMarketsInfo([msg.market]))
            if (msg.marketCreator === getState().loginAccount.address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.MARKET_CREATED, [msg]))
            }
          }
        },
        TokensTransferred: (msg) => {
          if (msg) {
            console.log(TYPES.TOKENS_TRANSFERED, msg)
            const { address } = getState().loginAccount
            if (msg.from === address || msg.to === address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.TOKENS_TRANSFERED, [msg]))
            }
          }
        },
        OrderCanceled: (msg) => {
          console.log(TYPES.ORDER_CANCELED, msg)
          if (msg && msg.marketID && msg.outcome != null) {
            // if this is the user's order, then add it to the transaction display
            if (msg.sender === getState().loginAccount.address) {
              dispatch(updateAccountCancelsData({
                [msg.marketID]: { [msg.outcome]: [msg] }
              }))
              dispatch(updateAssets())
            }
          }
        },
        OrderCreated: (msg) => {
          console.log(TYPES.ORDER_CREATED, msg)
          if (msg && msg.marketID && msg.outcome != null) {
            if (msg.isShortAsk) {
              const market = getState().marketsData[msg.marketID]
              if (market && market.numOutcomes) {
                dispatch(updateMarketTopicPopularity(msg.market, new BigNumber(msg.amount, 10).times(market.numOutcomes)))
              } else {
                dispatch(loadMarketsInfo([msg.market], () => {
                  const market = getState().marketsData[msg.market]
                  if (market && market.numOutcomes) {
                    dispatch(updateMarketTopicPopularity(msg.market, new BigNumber(msg.amount, 10).times(market.numOutcomes)))
                  }
                }))
              }
            }

            // if this is the user's order, then add it to the transaction display
            if (msg.sender === getState().loginAccount.address) {
              dispatch(updateAccountBidsAsksData({
                [msg.market]: {
                  [msg.outcome]: [msg]
                }
              }))
              dispatch(updateAssets())
            }
          }
        },
        OrderFilled: (...args) => console.log('Augur', TYPES.ORDER_FILLED, args),
        TradingProceedsClaimed: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log(TYPES.TRADING_PROCEEDS_CLAIMED, msg)
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.TRADING_PROCEEDS_CLAIMED, [msg]))
          }
        },
        DesignatedReportSubmitted: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log(TYPES.DESIGNATED_REPORT_SUBMITTED, msg)
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.DESIGNATED_REPORT_SUBMITTED, [msg]))
          }
        },
        ReportSubmitted: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log(TYPES.REPORT_SUBMITTED, msg)
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.REPORT_SUBMITTED, [msg]))
          }
        },
        WinningTokensRedeemed: (msg) => {
          if (msg) {
            console.log(TYPES.WINNING_TOKENS_REDEEMED, msg)
            const { address } = getState().loginAccount
            if (msg.from === address || msg.to === address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.WINNING_TOKENS_REDEEMED, [msg]))
            }
          }
        },
        ReportsDisputed: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log(TYPES.REPORTS_DISPUTED, msg)
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.REPORTS_DISPUTED, [msg]))
          }
        },
        MarketFinalized: (msg) => {
          if (msg && msg.market) {
            console.log(TYPES.MARKET_FINALIZED, msg)
            dispatch(loadMarketsInfo([msg.market]))
            if (msg.marketCreator === getState().loginAccount.address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.MARKET_FINALIZED, [msg]))
            }
          }
        },
        UniverseForked: (msg) => {
          if (msg) {
            console.log(TYPES.UNIVERSE_FORKED, msg)
            dispatch(updateAssets())
            dispatch(convertLogsToTransactions(TYPES.UNIVERSE_FORKED, [msg]))
          }
        },
      },
      LegacyReputationToken: {
        Transfer: (msg) => {
          if (msg) {
            console.log(TYPES.TRANSFER, msg)
            const { address } = getState().loginAccount
            if (msg.from === address || msg.to === address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.TRANSFER, [msg]))
            }
          }
        },
        Approval: (msg) => {
          if (msg) {
            console.log(TYPES.APPROVAL, msg)
            const { address } = getState().loginAccount
            if (msg.owner === address || msg.spender === address) {
              dispatch(updateAssets())
              dispatch(convertLogsToTransactions(TYPES.APPROVAL, [msg]))
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
