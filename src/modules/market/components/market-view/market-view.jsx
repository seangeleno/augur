import React, { Component } from 'react'

import MarketHeader from 'modules/market/containers/market-header'
import MarketOutcomesChart from 'modules/market/containers/market-outcomes-chart'
import MarketOutcomeGraphs from 'modules/market/containers/market-outcome-graphs'
import MarketOutcomesAndPositions from 'modules/market/containers/market-outcomes-and-positions'
import MarketTrading from 'modules/market/containers/market-trading'

import Styles from 'modules/market/components/market-view/market-view.styles'

export default class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOutcomes: [],
    }

    this.updateSelectedOutcomes = this.updateSelectedOutcomes.bind(this)
    this.clearSelectedOutcomes = this.clearSelectedOutcomes.bind(this)
  }

  updateSelectedOutcomes(selectedOutcome) {
    const newSelectedOutcomes = [...this.state.selectedOutcomes]
    const selectedOutcomeIndex = newSelectedOutcomes.indexOf(selectedOutcome)

    if (selectedOutcomeIndex !== -1) {
      newSelectedOutcomes.splice(selectedOutcomeIndex, 1)
    } else {
      newSelectedOutcomes.push(selectedOutcome)
    }

    this.setState({ selectedOutcomes: newSelectedOutcomes })
  }

  clearSelectedOutcomes() {
    this.setState({ selectedOutcomes: [] })
  }

  render() {
    const s = this.state

    return (
      <section>
        <div className={Styles.Market__upper}>
          <MarketHeader
            selectedOutcomes={s.selectedOutcomes}
            updateSelectedOutcomes={this.updateSelectedOutcomes}
            clearSelectedOutcomes={this.clearSelectedOutcomes}
          />
          {s.selectedOutcomes.length === 0 &&
            <MarketOutcomesChart
              selectedOutcomes={s.selectedOutcomes}
              updateSelectedOutcomes={this.updateSelectedOutcomes}
            />
          }
          {s.selectedOutcomes.length > 0 &&
            <MarketOutcomeGraphs
              selectedOutcomes={s.selectedOutcomes}
            />
          }
        </div>
        <section className={Styles.Market__details}>
          <div className={Styles['Market__details-outcomes']}>
            <MarketOutcomesAndPositions
              selectedOutcomes={s.selectedOutcomes}
              updateSelectedOutcomes={this.updateSelectedOutcomes}
            />
          </div>
          <div className={Styles['Market__details-trading']}>
            <MarketTrading
              selectedOutcomes={s.selectedOutcomes}
            />
          </div>
        </section>
      </section>
    )
  }
}

// OLD
// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Helmet } from 'react-helmet'
//
// import MarketActive from 'modules/market/components/market-active'
// import MarketReported from 'modules/market/components/market-reported'
// import NullStateMessage from 'modules/common/components/null-state-message'
//
// import parseMarketTitle from 'modules/market/helpers/parse-market-title'
// import parseQuery from 'modules/routes/helpers/parse-query'
// import getValue from 'utils/get-value'
// import speedomatic from 'speedomatic'
//
// import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
//
// export default class MarketView extends Component {
//   static propTypes = {
//     isConnected: PropTypes.bool.isRequired,
//     location: PropTypes.object.isRequired,
//     updateSelectedMarketID: PropTypes.func.isRequired,
//     clearSelectedMarketID: PropTypes.func.isRequired,
//     loadFullMarket: PropTypes.func.isRequired,
//     market: PropTypes.object.isRequired
//   }
//
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       isAvailable: getValue(props, 'market.id'),
//       isOpen: getValue(props, 'market.isOpen'),
//       marketId: null
//     }
//   }
//
//   componentWillMount() {
//     const marketId = speedomatic.formatInt256(parseQuery(this.props.location.search)[MARKET_ID_PARAM_NAME])
//
//     this.props.updateSelectedMarketID(marketId)
//     this.setState({ marketId })
//
//     if (this.props.isConnected && getValue(this.props, 'universe.id') && marketId) this.props.loadFullMarket(marketId)
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (getValue(this.props, 'market.id') !== getValue(nextProps, 'market.id')) this.setState({ isAvailable: getValue(nextProps, 'market.id') })
//     if (getValue(this.props, 'market.isOpen') !== getValue(nextProps, 'market.isOpen')) this.setState({ isOpen: getValue(nextProps, 'market.isOpen') })
//   }
//
//   componentWillUpdate(nextProps, nextState) {
//     if (
//       (
//         this.props.isConnected !== nextProps.isConnected ||
//         getValue(this.props, 'universe.id') !== getValue(nextProps, 'universe.id') ||
//         this.state.marketId !== nextState.marketId
//       ) &&
//       nextProps.isConnected &&
//       getValue(nextProps, 'universe.id') !== null &&
//       nextState.marketId !== null
//     ) {
//       this.props.loadFullMarket(nextState.marketId)
//     }
//   }
//
//   componentWillUnmount() {
//     this.props.clearSelectedMarketID()
//   }
//
//   render() {
//     const p = this.props
//     const s = this.state
//
//     return (
//       <section id="market_view">
//         {!s.isAvailable && <NullStateMessage message={'No Market Data'} />}
//
//         {s.isAvailable &&
//           <Helmet>
//             <title>{parseMarketTitle(p.market.description)}</title>
//           </Helmet>
//         }
//
//         {s.isAvailable && s.isOpen &&
//           <MarketActive
//             {...p}
//             isSnitchTabVisible={getValue(p, 'market.isSnitchTabVisible')}
//             isReportTabVisible={getValue(p, 'market.isReportTabVisible')}
//             isPendingReport={getValue(p, 'market.isPendingReport')}
//           />
//         }
//
//         {s.isAvailable && !s.isOpen && <MarketReported {...p} />}
//       </section>
//     )
//   }
// }
