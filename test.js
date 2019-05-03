/* eslint-disable no-unused-expressions */
const { expect } = require("chai")
const { getLocationData, getDate, getConditions } = require("./app")

describe("getLocationData", () => {
  it("should take a string or a number as an argument", () => {
    expect(getLocationData({ postalCode: 60616 })).to.throw(TypeError)
    expect(getLocationData(null)).to.throw(TypeError)
    expect(getLocationData(NaN)).to.throw(TypeError)
    expect(getLocationData(true)).to.throw(TypeError)
    expect(getLocationData(undefined)).to.throw(TypeError)
  })
  it("should return an object with name, locationKey, and GmtOffset properties given a valid input", async () => {
    const locationData = await getLocationData("Berlin")
    expect(locationData).to.be.an("object")
    expect(locationData).to.have.property("name")
    expect(locationData).to.have.property("locationKey")
    expect(locationData).to.have.property("GmtOffset")
  })
})

describe("getDate", () => {
  it("should take a number as an argument", () => {
    expect(getDate("-7")).to.throw(TypeError)
    expect(getDate({ offset: 7 })).to.throw(TypeError)
    expect(getDate(null)).to.throw(TypeError)
    expect(getDate(NaN)).to.throw(TypeError)
    expect(getDate(true)).to.throw(TypeError)
    expect(getDate(undefined)).to.throw(TypeError)
  })
  it("should return a time as a Date instance", () => {
    const time = getDate(-6)
    expect(time).to.be.an.instanceOf(Date)
  })
  it("should return the correct time provided a UTC offset", () => {
    const msPerHour = 3600000
    const localDate = new Date()
    // const localTime = localDate.toLocaleTimeString()
    const localTimezoneOffset = localDate.getTimezoneOffset() / -60

    const GmtTime = new Date(
      localDate.getTime() + localTimezoneOffset * msPerHour
    )

    const localTimeTest = getDate(localTimezoneOffset),
      chicago = getDate(-5),
      newYork = getDate(-4),
      mumbai = getDate(5.5)

    // We will compare hours, minutes, and period (AM and PM), but not seconds, so as to account for computation time.
    const getHour = date =>
      date
        .toString()
        .split(" ")[4]
        .split(":")[0]

    const getMinute = date =>
      date
        .toString()
        .split(" ")[4]
        .split(":")[1]

    const getPeriod = date => date.toLocaleTimeString().split(" ")[1]

    const checkPeriod = date => {
      const GmtOffset = date.getTimezoneOffset() / -60
      if (getHour(GmtTime) + GmtOffset < 12 && getPeriod(date) === "AM") {
        return true
      } else if (
        getHour(GmtTime) + GmtOffset >= 12 &&
        getPeriod(date) === "PM"
      ) {
        return true
      } else {
        return false
      }
    }

    expect(getHour(localTimeTest)).to.equal(getHour(localDate))
    expect(getMinute(localTimeTest)).to.equal(getMinute(localDate))
    expect(getPeriod(localTimeTest)).to.equal(getPeriod(localDate))

    expect(getHour(chicago)).to.equal(getHour(GmtTime - 5))
    expect(getMinute(chicago)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(chicago)).to.be.true

    expect(getHour(newYork)).to.equal(getHour(GmtTime - 4))
    expect(getMinute(newYork)).to.equal(getMinute(GmtTime))
    expect(checkPeriod(newYork)).to.be.true

    expect(getHour(mumbai)).to.equal(getHour(GmtTime + 5))
    expect(getMinute(mumbai) % 60).to.equal((getMinute(GmtTime) + 30) % 60)
    expect(checkPeriod(mumbai)).to.be.true
  })
})

describe("getConditions", () => {
  it("should take a string as an argument", () => {
    expect(getConditions(60616)).to.throw(TypeError)
    expect(getConditions({ postalCode: 60616 })).to.throw(TypeError)
    expect(getConditions(null)).to.throw(TypeError)
    expect(getConditions(NaN)).to.throw(TypeError)
    expect(getConditions(true)).to.throw(TypeError)
    expect(getConditions(undefined)).to.throw(TypeError)
  })
  it("should return a string containing a temperature and a unit", () => {
    const conditions = getConditions(348308)
    const temperature = conditions.split(" ")[0]
    const unit = conditions.split(" ")[1]

    expect(temperature * 0).to.equal(0)
    expect(unit).to.equal("F")
  })
})
