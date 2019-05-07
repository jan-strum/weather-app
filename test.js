/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const {
  getLocationData,
  getDate,
  getCurrentConditions,
  buildMessage,
  printmessages
} = require('./app')
const {
  getHour,
  getMinute,
  checkPeriod,
  GmtTime,
} = require('./helpers')

describe('getLocationData', () => {
  it('should return an object with name, locationKey, and GmtOffset data given a valid input.', async () => {
    const validLocationData = await getLocationData('Berlin')
    expect(validLocationData).to.be.an('object')
    expect(validLocationData).to.have.property('name')
    expect(validLocationData.name).to.be.a('string')
    expect(validLocationData.locationKey).to.be.a('string')
    expect(validLocationData.GmtOffsetHr).to.be.a('number')
  })
  it('should return an object with an error property when given an invalid input.', async () => {
    const invalidLocationData = await getLocationData('Neverland')
    expect(invalidLocationData).to.be.an('object')
    expect(invalidLocationData).to.have.property('error')
    expect(invalidLocationData.error).to.be.a('string')
  })
})

describe('getDate', () => {
  let chicagoDate, newYorkDate
  beforeEach(() => {
    chicagoDate = getDate(-5)
    newYorkDate = getDate(-4)
  })

  it('should return a time as a Date instance.', () => {
    const time = getDate(-6)
    expect(time).to.be.an.instanceOf(Date)
  })
  it('should return a time with the correct hour.', () => {  // We will check hours, minutes, and period (AM and PM), but not seconds, so as to account for differences in seconds due to computation time.
    expect(getHour(chicagoDate)).to.equal(getHour(GmtTime, -5))
    expect(getHour(newYorkDate)).to.equal(getHour(GmtTime, -4))
  })
  it('should return a time with the correct minute.', () => {
    expect(getMinute(chicagoDate)).to.equal(getMinute(GmtTime))
    expect(getMinute(newYorkDate)).to.equal(getMinute(GmtTime))
  })
  it('should return a time with the correct period.', () => {
    expect(checkPeriod(chicagoDate, -5)).to.be.true
    expect(checkPeriod(newYorkDate, -4)).to.be.true
  })
  it('should return the correct time provided a GMT offset that is a decimal.', () => {
    const mumbaiDate = getDate(5.5)

    if (getMinute(mumbaiDate) >= 30) {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime, 5))
    } else {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime, 6))
    }
    expect(getMinute(mumbaiDate) % 60).to.equal((getMinute(GmtTime) + 30) % 60)
    expect(checkPeriod(mumbaiDate, 5.5)).to.be.true
  })
})

describe('getCurrentConditions', () => {
  it('should return a string containing a temperature and a unit.', async () => {
    const conditions = await getCurrentConditions(348308)
    const temperature = conditions.split(' ')[0]
    const unit = conditions.split(' ')[1]

    expect(temperature * 0).to.equal(0)
    expect(unit).to.equal('F')
  })
})

describe('buildMessage', () => {
  it('should return a string.', async () => {
    const message = await buildMessage('Oaxaca')
    expect(message).to.be.a('string')
  })
})

describe('printmessages', () => {
  it('should return an array of strings.', async () => {
    const messages = await printmessages(["No Man's Land", 'Chicago', 10028, 'Mumbai'])
    expect(messages).to.be.an('array')
    messages.forEach(message => expect(message).to.be.a('string'))
  })
})
