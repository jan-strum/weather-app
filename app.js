/* eslint-disable quotes */
const axios = require('axios')
const express = require('express')
const app = express()

const PORT = 1337

const API_KEY = 'QryQ0OtaX1UugKQiAG2UXAWUschkpVsX'

const getLocationData = async locationString => {
  locationString = locationString + ''
  try {
    const response = await axios({
      method: 'get',
      url: `http://dataservice.accuweather.com/locations/v1/search?q=${locationString}&apikey=${API_KEY}`
    })
    if (response.data[0]) {
      const name = response.data[0].LocalizedName
      const locationKey = response.data[0].Key
      const GmtOffset = response.data[0].TimeZone.GmtOffset
      return { name, locationKey, GmtOffset }
    } else {
      return {
        name: undefined,
        locationKey: undefined,
        GmtOffset: undefined,
        error: `No location matching "${locationString}" could be found. Please try again.`
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const getDate = GmtOffset => {
  const msPerMinute = 60000,
    msPerHour = 3600000

  const remoteUtc = GmtOffset * msPerHour

  const localDate = new Date()
  const localUtc =
    localDate.getTime() + localDate.getTimezoneOffset() * msPerMinute

  const remoteDate = new Date(localUtc + remoteUtc)

  return remoteDate // We will return a date instance so that we can easily test that the period (AM/PM) is correct, but we will coerce this into a LocalTimeString in printTimeAndConditions for logging purposes.
}

const getConditions = async locationKey => {
  locationKey = locationKey + ''
  try {
    const response = await axios({
      method: 'get',
      url: `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}.json?language=en&apikey=${API_KEY}`
    })
    const temperature = response.data[0].Temperature.Imperial.Value
    const unit = response.data[0].Temperature.Imperial.Unit

    return `${temperature} ${unit}`
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getLocationData,
  getDate,
  getConditions
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
