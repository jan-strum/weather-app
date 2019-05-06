const msPerMn = 60000

const localDate = new Date()
const localGmtOffsetMn = localDate.getTimezoneOffset()

const localTime = localDate.getTime()
const localGmtOffsetMs = localTime + localGmtOffsetMn * msPerMn

const GmtTime = new Date(localGmtOffsetMs)

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

const getPeriod = date => {
  return date.toLocaleTimeString()
    .split(' ')[1]
}

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

module.exports = {
  getHour,
  getMinute,
  getPeriod,
  checkPeriod,
  msPerMn,
  localDate,
  localTime,
  GmtTime,
  localGmtOffsetMn,
  localGmtOffsetMs
}
