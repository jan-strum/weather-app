const axios = require('axios')
const express = require('express')
const app = express()

const { localGmtOffsetMs } = require('./helpers')

const { API_KEY } = require('./secrets')

const getLocationData = async (location: string | number) => {
  try {
    const response = await axios({
      method: 'get',
      url: `http://dataservice.accuweather.com/locations/v1/search?q=${location}&apikey=${API_KEY}`
    })

    if (response.data[0]) {
      const name = response.data[0].LocalizedName
      const locationKey = response.data[0].Key
      const GmtOffsetHr = response.data[0].TimeZone.GmtOffset

      return { name, locationKey, GmtOffsetHr }
    } else {

      return { error: `No location matching "${location}" could be found. Please try again.\n` }
    }
  } catch (error) {
    console.log(error)
  }
}

const getDate = (GmtOffsetHr: number) => {
  const msPerHr = 3600000
  const remoteGmtOffsetMs = GmtOffsetHr * msPerHr
  const totalGmtOffsetMs = localGmtOffsetMs + remoteGmtOffsetMs

  const date = new Date(totalGmtOffsetMs)

  return date // We will return a date instance so that we can easily test that the period (AM/PM) is correct, but we will coerce this into a LocalTimeString in buildMessage for logging purposes.
}

const getCurrentConditions = async (locationKey: string) => {
  try {
    const response = await axios({
      method: 'get',
      url: `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}.json?language=en&apikey=${API_KEY}`
    })

    const temperature = response.data[0].Temperature.Imperial.Value
    const unit = response.data[0].Temperature.Imperial.Unit

    const currentconditions = `${temperature} ${unit}`

    return currentconditions

  } catch (error) {
    console.log(error)
  }
}

const buildMessage = async (location: string | number) => {
  const locationData = await getLocationData(location)
  let message: object | string

  if (!locationData.error) {
    const { name, locationKey, GmtOffsetHr } = locationData
    const time = getDate(GmtOffsetHr).toLocaleTimeString()
    const currentConditions = await getCurrentConditions(locationKey)
    message = `The time in ${name} is ${time}. The temperature is ${currentConditions}.\n`
  } else {
    message = locationData.error
  }

  return message
}

const printmessages = (locations: (string|number)[]) => {
  const messages = []

  locations.forEach(async location => {
    const message = await buildMessage(location)
    console.log(message)
    messages.push(message)
  })

  return messages // We will return the messages for ease of testing.
}

module.exports = {
  getLocationData,
  getDate,
  getCurrentConditions,
  buildMessage,
  printmessages
}

const PORT = 1337

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
