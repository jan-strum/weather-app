const { expect } = require('chai')
const { getLocationData, getTime } = require('./app')

describe('getLocationData', () => {
  it('should return an object with name, locationKey, and GmtOffset properties', async () => {
    const locationData = await getLocationData()
    expect(locationData).to.be.an('object')
    expect(locationData).to.have.property('name')
    expect(locationData).to.have.property('locationKey')
    expect(locationData).to.have.property('GmtOffset')
  })
})

describe('getTime', () => {
  it('should take a number as an argument', () => {
    expect(getTime('-7')).to.throw(TypeError)
    expect(getTime({ offset: 7 })).to.throw(TypeError)
    expect(getTime(null)).to.throw(TypeError)
    expect(getTime(NaN)).to.throw(TypeError)
    expect(getTime(true)).to.throw(TypeError)
    expect(getTime(undefined)).to.throw(TypeError)
  })
  it('should return a time as a string', () => {
    const time = getTime(-6)
    expect(time).to.be.a('string')
  })
  it('should return the correct time provided a UTC offset', () => {
    const localDate = new Date(),
      localTime = localDate.toLocaleTimeString(),
      localTimezoneOffset = localDate.getTimezoneOffset() / -60

    const GmtTime = new Date(
      localDate.getTime() + localTimezoneOffset * 1000 * 60 * 60
    )

    const localTimeTest = getTime(localTimezoneOffset),
      chicago = getTime(-5),
      newYork = getTime(-4),
      mumbai = getTime(5.5)

    // We will compare hours, minutes, and period (AM and PM), but not seconds, so as to account for computation time.
    const getHour = dateString => Number(dateString.split(':')[0])
    const getMinute = dateString => Number(dateString.split(':')[1])
    const getPeriod = dateString => dateString.split(' ')[1]

    expect(getHour(localTimeTest)).to.equal(getHour(localTime))
    expect(getMinute(localTimeTest)).to.equal(getMinute(localTime))
    expect(getPeriod(localTimeTest)).to.equal(getPeriod(localTime))

    expect(getHour(chicago)).to.equal(getHour(GmtTime - 5))
    expect(getMinute(chicago)).to.equal(getMinute(GmtTime))
    // For now, we will assume that if the hours and minutes are the correct, the period is as well.

    expect(getHour(newYork)).to.equal(getHour(GmtTime - 4))
    expect(getMinute(newYork)).to.equal(getMinute(GmtTime))
    // For now, we will assume that if the hours and minutes are the correct, the period is as well.

    expect(getHour(mumbai)).to.equal(getHour(GmtTime + 5))
    expect(getMinute(mumbai) % 60).to.equal((getMinute(GmtTime) + 30) % 60)
    // For now, we will assume that if the hours and minutes are the correct, the period is as well.
  })
})
