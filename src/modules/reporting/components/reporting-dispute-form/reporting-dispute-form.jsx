/* eslint jsx-a11y/label-has-for: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form.styles'

const validateIsMarketValid = (validations, updateState, isMarketValid) => {
  const updatedValidations = { ...validations }
  updatedValidations.isMarketValid = true

  if (isMarketValid) {
    if (!updatedValidations.hasOwnProperty('selectedOutcome')) {
      updatedValidations.selectedOutcome = false
    }
  } else if (updatedValidations.hasOwnProperty('selectedOutcome') && updatedValidations.selectedOutcome === false) {
    delete updatedValidations.selectedOutcome
  }

  updateState({
    validations: updatedValidations,
    isMarketValid
  })
}

const validateOutcome = (validations, updateState, selectedOutcome) => {
  const updatedValidations = { ...validations }
  updatedValidations.selectedOutcome = true

  updateState({
    validations: updatedValidations,
    selectedOutcome
  })
}

const validateNumber = (validations, updateState, fieldName, value, humanName, min, max) => {
  const updatedValidations = { ...validations }

  const minValue = parseFloat(min)
  const maxValue = parseFloat(max)

  switch (true) {
    case value === '':
      updatedValidations[fieldName] = `The ${humanName} field is required.`
      break
    case (value > maxValue || value < minValue):
      updatedValidations[fieldName] = `Please enter a ${humanName} between ${min} and ${max}.`
      break
    default:
      updatedValidations[fieldName] = true
      break
  }

  updateState({
    validations: updatedValidations,
    [fieldName]: value
  })
}

const validateStake = (validations, updateState, isStakeRequired, stake) => {
  const updatedValidations = { ...validations }

  if (isStakeRequired) {
    switch (true) {
      case stake === '':
        updatedValidations.stake = `The stake field is required.`
        break
      case stake <= 0:
        updatedValidations.stake = `Please enter a stake greater than 0.`
        break
      default:
        updatedValidations.stake = true
        break
    }
  }

  updateState({
    validations: updatedValidations,
    stake
  })
}

const ReportingDisputeForm = p => (
  <ul className={classNames(Styles.ReportingDisputeForm__fields, FormStyles.Form__fields)}>
    { p.market.extraInfo &&
      <li>
        <label>
          <span>Market Details</span>
        </label>
        <p>{ p.market.extraInfo }</p>
      </li>
    }
    <li>
      <label>
        <span>Resolution Source</span>
      </label>
      <p>Outcome will be detailed on a public website: <a href="http://www.example.com" target="_blank" rel="noopener noreferrer">http://www.example.com</a></p>
    </li>
    <li>
      <label>
        <span>Dispute Bond</span>
      </label>
      <p className={FormStyles['text--field-style']}>{ p.disputeBond }</p>
    </li>
    <li>
      <label>
        <span>Current Outcome</span>
      </label>
      <p className={FormStyles['text--field-style']}>{ p.currentOutcome }</p>
    </li>
    <li>
      <label>
        <span>Is Market Valid?</span>
      </label>
      <ul className={FormStyles['Form__radio-buttons--per-line']}>
        <li>
          <button
            className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === true })}
            onClick={(e) => { validateIsMarketValid(p.validations, p.updateState, true) }}
          >Yes</button>
        </li>
        <li>
          <button
            className={classNames({ [`${FormStyles.active}`]: p.isMarketValid === false })}
            onClick={(e) => { validateIsMarketValid(p.validations, p.updateState, false) }}
          >No</button>
        </li>
      </ul>
    </li>
    { p.isMarketValid && p.market.type === BINARY &&
      <li>
        <label>
          <span>Proposed Outcome</span>
        </label>
        <ul className={FormStyles['Form__radio-buttons--per-line']}>
          <li>
            <button
              className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === 'Yes' })}
              onClick={(e) => { validateOutcome(p.validations, p.updateState, 'Yes') }}
            >Yes</button>
          </li>
          <li>
            <button
              className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === 'No' })}
              onClick={(e) => { validateOutcome(p.validations, p.updateState, 'No') }}
            >No</button>
          </li>
        </ul>
      </li>
    }
    { p.isMarketValid && p.market.type === CATEGORICAL &&
      <li>
        <label>
          <span>Proposed Outcome</span>
        </label>
        <ul className={FormStyles['Form__radio-buttons--per-line']}>
          { p.market.outcomes && p.market.outcomes.map(outcome => (
            <li key={outcome.id}>
              <button
                className={classNames({ [`${FormStyles.active}`]: p.selectedOutcome === outcome.name })}
                onClick={(e) => { validateOutcome(p.validations, p.updateState, outcome.name) }}
              >{outcome.name}</button>
            </li>
            ))
          }
        </ul>
      </li>
    }
    { p.isMarketValid && p.market.type === SCALAR &&
      <li className={FormStyles['field--short']}>
        <label>
          <span htmlFor="sr__input--outcome-scalar">Proposed Outcome</span>
          { p.validations.hasOwnProperty('selectedOutcome') && p.validations.selectedOutcome.length &&
            <span className={FormStyles.Form__error}>
              { p.validations.selectedOutcome }
            </span>
          }
        </label>
        <input
          id="sr__input--outcome-scalar"
          type="number"
          min={p.market.minValue}
          max={p.market.maxValue}
          placeholder="0"
          value={p.selectedOutcome}
          onChange={(e) => { validateNumber(p.validations, p.updateState, 'selectedOutcome', e.target.value, 'proposed outcome', p.market.minValue, p.market.maxValue) }}
        />
      </li>
    }
    <li className={FormStyles['field--short']}>
      <label>
        <span htmlFor="sr__input--stake">Stake</span>
        { p.validations.hasOwnProperty('stake') && p.validations.stake.length &&
          <span className={FormStyles.Form__error}>
            { p.validations.stake }
          </span>
        }
      </label>
      <input
        id="sr__input--stake"
        type="number"
        min="0"
        placeholder="0.0000 REP"
        value={p.stake}
        onChange={(e) => { validateStake(p.validations, p.updateState, p.isStakeRequired, e.target.value) }}
      />
    </li>
  </ul>
)

ReportingDisputeForm.propTypes = {
  market: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  validations: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  disputeBond: PropTypes.string.isRequired,
  currentOutcome: PropTypes.string.isRequired,
  isMarketValid: PropTypes.bool,
}

export default ReportingDisputeForm
