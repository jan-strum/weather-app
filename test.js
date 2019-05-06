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
  getPeriod,
  checkPeriod,
  localDate,
  GmtTime,
  localGmtOffsetMn,
} = require('./helpers')

describe('getLocationData', () => {
  it('should return an object with name, locationKey, and GmtOffset properties given a valid input', async () => {
    const locationData = await getLocationData('Berlin')
    expect(locationData).to.be.an('object')
    expect(locationData).to.have.property('name')
    expect(locationData).to.have.property('locationKey')
    expect(locationData).to.have.property('GmtOffset')
  })
})

describe('getDate', () => {
  it('should return a time as a Date instance', () => {
    const time = getDate(-6)
    expect(time).to.be.an.instanceOf(Date)
  })
  it('should return the correct time provided a GMT offset that is a whole number', () => {  // We will compare hours, minutes, and period (AM and PM), but not seconds, so as to account for computation time.
    const chicagoDate = getDate(-5),
          newYorkDate = getDate(-4)

    expect(getHour(chicagoDate)).to.equal(getHour(GmtTime) - 5)
    expect(getMinute(chicagoDate)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(chicagoDate, -5)).to.be.true

    expect(getHour(newYorkDate)).to.equal(getHour(GmtTime) - 4)
    expect(getMinute(newYorkDate)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(newYorkDate, -4)).to.be.true
  })
  it('should return the correct time provided a GMT offset that is a decimal', () => {
    const mumbaiDate = getDate(5.5)

    if (getMinute(mumbaiDate) >= 30) {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime) + 5)
    } else {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime) + 6)
    }
    expect(getMinute(mumbaiDate) % 60).to.equal((getMinute(GmtTime) + 30) % 60)
    expect(checkPeriod(mumbaiDate, 5.5)).to.be.true
  })

})

describe('getCurrentConditions', () => {
  it('should return a string containing a temperature and a unit', async () => {
    const conditions = await getCurrentConditions(348308)
    const temperature = conditions.split(' ')[0]
    const unit = conditions.split(' ')[1]

    expect(temperature * 0).to.equal(0)
    expect(unit).to.equal('F')
  })
})

describe('buildMessage', () => {
  it('should return a string', async () => {
    const locationData = await getLocationData('Oaxaca')
    const message = await buildMessage(locationData)
    expect(message).to.be.a('string')
  })
})

describe('printmessages', () => {
  it('should return an array of strings', async () => {
    const messages = await printmessages([
      "No Man's Land",
      'Chicago',
      10028,
      'Mumbai',
    ])
    expect(messages).to.be.an('array')
    messages.forEach(message => expect(message).to.be.a('string'))
  })
})
