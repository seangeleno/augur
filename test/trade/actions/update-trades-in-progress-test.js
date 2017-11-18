import { describe, it, beforeEach, afterEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'
import { BUY, SELL, tradeTestState } from 'test/trade/constants'

function updateTradesInProgressActionShapeAssertion(updateTradesInProgressAction) {
  const updateTradesInProgressData = updateTradesInProgressAction.data
  const tradeDetails = updateTradesInProgressData.details

  assert.isDefined(updateTradesInProgressAction.type, `updateTradesInProgressAction.type isn't defined`)
  assert.isString(updateTradesInProgressAction.type, `updateTradesInProgressAction.type isn't a String`)
  assert.isDefined(updateTradesInProgressAction.data, `updateTradesInProgressAction.data isn't defined`)
  assert.isObject(updateTradesInProgressAction.data, `updateTradesInProgressAction.data isn't a Object`)

  assert.isDefined(updateTradesInProgressData.marketID, `UpdateTradesInProgressAction.data.marketID isn't defined`)
  assert.isString(updateTradesInProgressData.marketID, `UpdateTradesInProgressAction.data.marketID isn't a String`)
  assert.isDefined(updateTradesInProgressData.outcomeID, `UpdateTradesInProgressAction.data.outcomeID isn't defined`)
  assert.isNumber(updateTradesInProgressData.outcomeID, `UpdateTradesInProgressAction.data.outcomeID isn't a number`)
  assert.isDefined(updateTradesInProgressData.details, `UpdateTradesInProgressAction.data.details isn't defined`)
  assert.isObject(updateTradesInProgressData.details, `UpdateTradesInProgressAction.data.details isn't a Object`)

  assert.isDefined(tradeDetails.side, `tradeDetails.side isn't defined`)
  assert.isString(tradeDetails.side, `tradeDetails.side isn't a string`)
  assert.isDefined(tradeDetails.numShares, `tradeDetails.numShares isn't defined`)
  assert.isString(tradeDetails.numShares, `tradeDetails.numShares isn't a string`)
  assert.isDefined(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't defined`)
  assert.isString(tradeDetails.limitPrice, `tradeDetails.limitPrice isn't a string`)
  assert.isDefined(tradeDetails.totalFee, `tradeDetails.totalFee isn't defined`)
  assert.isString(tradeDetails.totalFee, `tradeDetails.totalFee isn't a string`)
  assert.isDefined(tradeDetails.totalCost, `tradeDetails.totalCost isn't defined`)
  assert.isString(tradeDetails.totalCost, `tradeDetails.totalCost isn't a string`)
  assert.isDefined(tradeDetails.feePercent, `tradeDetails.feePercent isn't defined`)
  assert.isString(tradeDetails.feePercent, `tradeDetails.feePercent isn't a string`)
}

describe('modules/trade/actions/update-trades-in-progress.js', () => {
  describe('should update a trade in progress for a binary market', () => {
    proxyquire.noPreserveCache()
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const state = Object.assign({}, testState, tradeTestState)
    const store = mockStore(state)
    const mockSelectMarket = {}
    const mockLoadAccountPositions = {
      loadAccountPositions: (options, callback) => dispatch => callback(null, ['0', '0'])
    }
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testBinaryMarketID)

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../my-positions/actions/load-account-positions': mockLoadAccountPositions,
      '../../market/selectors/market': mockSelectMarket
    })

    beforeEach(() => {
      store.clearActions()
    })

    afterEach(() => {
      store.clearActions()
    })

    it('should pass shape tests for buying 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for buying 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should pass shape tests for Selling 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 1, SELL, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for selling 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 1, SELL, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 1,
          details: {
            side: 'sell',
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, '0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't clear the tradeDetails object`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, undefined, '0.5', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't return the correct tradeDetails object based on input`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testBinaryMarketID: {
          0: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.01',
            totalCost: '-5.01',
            feePercent: '0.2',
            worstCaseFees: '0'
          }
        }
      }
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, undefined, '0.15', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0.15',
            totalFee: '0',
            totalCost: '-1.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '1.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })

    it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
			// marketID, outcomeID, side, numShares, limitPrice, maxCost
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, undefined, '0', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0',
            totalFee: '0',
            totalCost: '0',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '0',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, '25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-12.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '12.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', 0, BUY, '-25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-12.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '12.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })
  })

  describe('should update a trade in progress for a categorical market', () => {
    proxyquire.noPreserveCache()
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const state = Object.assign({}, testState, tradeTestState)
    const store = mockStore(state)
    const mockLoadAccountPositions = {
      loadAccountPositions: (options, callback) => dispatch => callback(null, ['0', '0'])
    }
    const mockSelectMarket = {}
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testCategoricalMarketID)

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../my-positions/actions/load-account-positions': mockLoadAccountPositions,
      '../../market/selectors/market': mockSelectMarket
    })

    beforeEach(() => {
      store.clearActions()
    })

    afterEach(() => {
      store.clearActions()
    })

    it('should pass shape tests for buying 10 shares of Outcome 0 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for buying 10 shares of Outcome 0 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should pass shape tests for Selling 10 shares of Outcome 0 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, SELL, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for selling 10 shares of Outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, SELL, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'sell',
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, '0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't clear the tradeDetails object`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, undefined, '0.5', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't return the correct tradeDetails object based on input`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testCategoricalMarketID: {
          0: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.004999999999999995',
            totalCost: '-5.004999999999999995',
            tradeActions: [
              {
                action: 'BID',
                shares: '10',
                gasEth: '0.01450404',
                feeEth: '0.004999999999999995',
                feePercent: '0.0999999999999999',
                costEth: '-5.004999999999999995',
                avgPrice: '0.500499999999999999',
                noFeePrice: '0.5'
              }
            ],
            tradingFeesEth: '0.004999999999999995',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.099800399201596707'
          }
        }
      }
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, undefined, '0.15', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0.15',
            totalFee: '0',
            totalCost: '-1.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '1.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })

    it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, undefined, '0', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0',
            totalFee: '0',
            totalCost: '0',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '0',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, '25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-12.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '12.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', 0, BUY, '-25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0',
            totalCost: '-12.5',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '12.5',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, "Didn't produce the expected tradeDetails object")
    })
  })

  describe('should update a trade in progress for a scalar market', () => {
    proxyquire.noPreserveCache()
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const state = Object.assign({}, testState, tradeTestState)
    const store = mockStore(state)
    const mockLoadAccountPositions = {
      loadAccountPositions: (options, callback) => dispatch => callback(null, ['0', '0'])
    }
    const mockSelectMarket = {}
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testScalarMarketID)

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../my-positions/actions/load-account-positions': mockLoadAccountPositions,
      '../../market/selectors/market': mockSelectMarket
    })

    beforeEach(() => {
      store.clearActions()
    })

    afterEach(() => {
      store.clearActions()
    })

    it('should pass shape tests for buying 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for buying 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '55',
            totalFee: '0',
            totalCost: '-650',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '650',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should pass shape tests for Selling 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, SELL, '10.0', undefined, undefined))
      updateTradesInProgressActionShapeAssertion(store.getActions()[0])
    })

    it('should pass calculation tests for selling 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, SELL, '10.0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'sell',
            numShares: '10',
            limitPrice: '55',
            totalFee: '0',
            totalCost: '-650',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '650',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, '0', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '55',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't clear the tradeDetails object`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, undefined, '65', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '65',
            totalFee: '0',
            totalCost: '0'
          }
        }
      }, `Didn't clear the tradeDetails object`)
    })

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testScalarMarketID: {
          0: {
            side: BUY,
            numShares: '10',
            limitPrice: '55',
            totalFee: '5.36982248520710025',
            totalCost: '-555.36982248520710025',
            feePercent: '0.9763313609467455'
          }
        }
      }
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, undefined, '70', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '70',
            totalFee: '0',
            totalCost: '-800',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '800',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })

    it('should handle a trade in progress if limitPrice is set to 0 on a scalar market where 0 should be valid', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, undefined, '0', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0',
            totalFee: '0',
            totalCost: '-100',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '100',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`)
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, '25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '55',
            totalFee: '0',
            totalCost: '-1625',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '1625',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, '-25', undefined, undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '55',
            totalFee: '0',
            totalCost: '-1625',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '1625',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })

    it('should handle the tradeDetails object if limitPrice is negative but valid for this scalar market', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', 0, BUY, undefined, '-5', undefined))
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: 0,
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '-5',
            totalFee: '0',
            totalCost: '-50',
            feePercent: '0',
            settlementFees: '0',
            gasFees: '0',
            sharesDepleted: '0',
            otherSharesDepleted: '0',
            tokensDepleted: '50',
            shareBalances: ['0', '0'],
            worstCaseFees: '0'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`)
    })
  })
})
