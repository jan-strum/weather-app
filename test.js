/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const {
  getLocationData,
  getDate,
  getConditions,
  printTimeAndConditions
} = require('./app')

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
  it('should return the correct time provided a GMT offset', () => {
    const msPerMn = 60000

    const localDate = new Date()
    const localTimezoneOffset = localDate.getTimezoneOffset()
    const localGmtOffsetHr = localTimezoneOffset / -60

    const localTime = localDate.getTime()
    const localGmtOffsetMs = localTime + localTimezoneOffset * msPerMn

    const GmtTime = new Date(localGmtOffsetMs)

    const localDateTest = getDate(localGmtOffsetHr),
      chicagoDate = getDate(-5),
      newYorkDate = getDate(-4),
      mumbaiDate = getDate(5.5)

    // We will compare hours, minutes, and period (AM and PM), but not seconds, so as to account for computation time.
    const getHour = date => {
      return Number(
        date
          .toString()
          .split(' ')[4]
          .split(':')[0]
      )
    }

    const getMinute = date => {
      return Number(
        date
          .toString()
          .split(' ')[4]
          .split(':')[1]
      )
    }

    const getPeriod = date => date.toLocaleTimeString()
      .split(' ')[1]


    const checkPeriod = (date, GmtOffsetHr) => {
      const roundedGmtOffset =
        getMinute(GmtTime) < 30
          ? Math.floor(GmtOffsetHr)
          : Math.ceil(GmtOffsetHr)
      const remotePeriod = getPeriod(date)
      const GmtHour = getHour(GmtTime)

      if (GmtHour + roundedGmtOffset < 12 &&
        remotePeriod === 'AM') {
        return true
      } else if (GmtHour + roundedGmtOffset >= 12 &&
        remotePeriod === 'PM') {
        return true
      } else {
        return false
      }
    }

    expect(getHour(localDateTest)).to.equal(getHour(localDate))
    expect(getMinute(localDateTest)).to.equal(getMinute(localDate))
    expect(getPeriod(localDateTest)).to.equal(getPeriod(localDate))

    expect(getHour(chicagoDate)).to.equal(getHour(GmtTime) - 5)
    expect(getMinute(chicagoDate)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(chicagoDate, -5)).to.be.true

    expect(getHour(newYorkDate)).to.equal(getHour(GmtTime) - 4)
    expect(getMinute(newYorkDate)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(newYorkDate, -4)).to.be.true

    if (getMinute(mumbaiDate) >= 30) {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime) + 5)
    } else {
      expect(getHour(mumbaiDate)).to.equal(getHour(GmtTime) + 6)
    }
    expect(getMinute(mumbaiDate) % 60).to.equal((getMinute(GmtTime) + 30) % 60)
    expect(checkPeriod(mumbaiDate, 5.5)).to.be.true
  })
})

describe('getConditions', () => {
  it('should return a string containing a temperature and a unit', async () => {
    const conditions = await getConditions(348308)
    const temperature = conditions.split(' ')[0]
    const unit = conditions.split(' ')[1]

    expect(temperature * 0).to.equal(0)
    expect(unit).to.equal('F')
  })
})

describe('printTimeAndConditions', () => {
  it('should return an array of strings', async () => {
    const output = await printTimeAndConditions([
      'Chicago',
      10028,
      'Mumbai',
      "No Man's Land"
    ])
    expect(output).to.be.an('array')
    output.forEach(e => expect(e).to.be.a('string'))
  })
})
