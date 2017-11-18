import { describe, it } from 'mocha'
import { assert } from 'chai'
import reducer from 'modules/markets/reducers/markets-data'

describe(`modules/markets/reducers/markets-data.js`, () => {
  describe('UPDATE_MARKET_TOPIC', () => {
    const test = t => it(t.description, () => {
      t.assertions(reducer(t.marketsData, t.action))
    })
    test({
      description: 'no market ID = no change to markets data',
      marketsData: {
        '0xa1': {
          id: '0xa1',
          topic: undefined
        },
        '0xa2': {
          id: '0xa2',
          topic: 'regular potables'
        }
      },
      action: {
        type: 'UPDATE_MARKET_TOPIC',
        marketID: undefined,
        topic: 'potent potables'
      },
      assertions: (reducedData) => {
        assert.deepEqual(reducedData, {
          '0xa1': {
            id: '0xa1',
            topic: undefined
          },
          '0xa2': {
            id: '0xa2',
            topic: 'regular potables'
          }
        })
      }
    })
    test({
      description: 'set market topic',
      marketsData: {
        '0xa1': {
          id: '0xa1',
          topic: undefined
        },
        '0xa2': {
          id: '0xa2',
          topic: 'regular potables'
        }
      },
      action: {
        type: 'UPDATE_MARKET_TOPIC',
        marketID: '0xa1',
        topic: 'potent potables'
      },
      assertions: (reducedData) => {
        assert.deepEqual(reducedData, {
          '0xa1': {
            id: '0xa1',
            topic: 'potent potables'
          },
          '0xa2': {
            id: '0xa2',
            topic: 'regular potables'
          }
        })
      }
    })
    test({
      description: 'unset market topic',
      marketsData: {
        '0xa1': {
          id: '0xa1',
          topic: 'potent potables'
        },
        '0xa2': {
          id: '0xa2',
          topic: 'regular potables'
        }
      },
      action: {
        type: 'UPDATE_MARKET_TOPIC',
        marketID: '0xa1',
        topic: undefined
      },
      assertions: (reducedData) => {
        assert.deepEqual(reducedData, {
          '0xa1': {
            id: '0xa1',
            topic: undefined
          },
          '0xa2': {
            id: '0xa2',
            topic: 'regular potables'
          }
        })
      }
    })
    test({
      description: 'update market topic',
      marketsData: {
        '0xa1': {
          id: '0xa1',
          topic: 'regular potables'
        },
        '0xa2': {
          id: '0xa2',
          topic: 'regular potables'
        }
      },
      action: {
        type: 'UPDATE_MARKET_TOPIC',
        marketID: '0xa1',
        topic: 'potent potables'
      },
      assertions: (reducedData) => {
        assert.deepEqual(reducedData, {
          '0xa1': {
            id: '0xa1',
            topic: 'potent potables'
          },
          '0xa2': {
            id: '0xa2',
            topic: 'regular potables'
          }
        })
      }
    })
  })
  // describe('UPDATE_MARKETS_LOADING_STATUS', () => {
  //   const test = t => it(t.description, () => {
  //     t.assertions(reducer(t.marketsData, t.action))
  //   })
  //   test({
  //     description: 'no market IDs = no change to markets data',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: true
  //       },
  //       '0xa2': {
  //         id: '0xa2',
  //         isLoading: false
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: [],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         },
  //         '0xa2': {
  //           id: '0xa2',
  //           isLoading: false
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status from undefined to true for 1 market ID',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: undefined
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status from false to true for 1 market ID',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: false
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status from true to true for 1 market ID',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: true
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status from true to false for 1 market ID',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: true
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: false
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: false
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status to true for 1 out of 2 market IDs',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: false
  //       },
  //       '0xa2': {
  //         id: '0xa2',
  //         isLoading: false
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         },
  //         '0xa2': {
  //           id: '0xa2',
  //           isLoading: false
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status to false for 1 out of 2 market IDs',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: true
  //       },
  //       '0xa2': {
  //         id: '0xa2',
  //         isLoading: false
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1'],
  //       isLoading: false
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: false
  //         },
  //         '0xa2': {
  //           id: '0xa2',
  //           isLoading: false
  //         }
  //       })
  //     }
  //   })
  //
  //   test({
  //     description: 'update loading status to true for 2 out of 3 market IDs',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: false
  //       },
  //       '0xa2': {
  //         id: '0xa2',
  //         isLoading: false
  //       },
  //       '0xa3': {
  //         id: '0xa3',
  //         isLoading: false
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa1', '0xa3'],
  //       isLoading: true
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         },
  //         '0xa2': {
  //           id: '0xa2',
  //           isLoading: false
  //         },
  //         '0xa3': {
  //           id: '0xa3',
  //           isLoading: true
  //         }
  //       })
  //     }
  //   })
  //   test({
  //     description: 'update loading status to false for 2 out of 3 market IDs',
  //     marketsData: {
  //       '0xa1': {
  //         id: '0xa1',
  //         isLoading: true
  //       },
  //       '0xa2': {
  //         id: '0xa2',
  //         isLoading: true
  //       },
  //       '0xa3': {
  //         id: '0xa3',
  //         isLoading: true
  //       }
  //     },
  //     action: {
  //       type: 'UPDATE_MARKETS_LOADING_STATUS',
  //       marketIDs: ['0xa2', '0xa3'],
  //       isLoading: false
  //     },
  //     assertions: (reducedData) => {
  //       assert.deepEqual(reducedData, {
  //         '0xa1': {
  //           id: '0xa1',
  //           isLoading: true
  //         },
  //         '0xa2': {
  //           id: '0xa2',
  //           isLoading: false
  //         },
  //         '0xa3': {
  //           id: '0xa3',
  //           isLoading: false
  //         }
  //       })
  //     }
  //   })
  // })
  describe('UPDATE_MARKETS_DATA', () => {
    it('should update markets data', () => {
      const marketsData = {
        '0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
          id: 2,
          outcomeID: 'someoutcome',
          details: {
            example: 'test'
          }
        }
      }
      const marketsData2 = {
        '0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
          id: 1,
          outcomeID: 'an outcomeID',
          details: {
            test: 'example'
          }
        },
        '0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
          id: 2,
          outcomeID: 'someoutcome',
          details: {
            example: 'test'
          }
        }
      }
      const curMarketsData1 = {
        '0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
          id: 1,
          outcomeID: 'an outcomeID',
          hasLoadedMarketInfo: false,
          details: {
            test: 'example'
          }
        }
      }
      const curMarketsData2 = {
        '0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
          id: 1,
          outcomeID: 'an outcomeID',
          hasLoadedMarketInfo: false,
          details: {
            test: 'example'
          }
        },
        '0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
          id: 2,
          outcomeID: 'a different outcome',
          details: {
            example: 'test2'
          }
        }
      }
      const expectedOutput = {
        '0x0131d98e878803e113e2accc457ad57f5b97a87910be31d60e931c08ca4d5ef1': {
          id: 1,
          outcomeID: 'an outcomeID',
          hasLoadedMarketInfo: false,
          details: {
            test: 'example'
          }
        },
        '0x04be50f6303babc4e5400a6ebfaa77a8a76f620dd9f6394466e552842f585801': {
          id: 2,
          outcomeID: 'someoutcome',
          hasLoadedMarketInfo: false,
          details: {
            example: 'test'
          }
        }
      }
      const action = {
        type: 'UPDATE_MARKETS_DATA',
        marketsData
      }
      const action2 = {
        type: 'UPDATE_MARKETS_DATA',
        marketsData: marketsData2
      }
      assert.deepEqual(reducer(curMarketsData1, action), expectedOutput, `didn't add a new market to markets data`)
      assert.deepEqual(reducer(curMarketsData2, action), expectedOutput, `didn't update a market in markets data`)
      assert.deepEqual(reducer(undefined, action2), expectedOutput, `didn't get the correct output when marketsData is empty`)
    })
  })
})
