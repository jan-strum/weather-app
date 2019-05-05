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

module.exports = {
  getLocationData
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
