const msPerMn = 60000

const localDate = new Date()
const localGmtOffsetMn = localDate.getTimezoneOffset()

const localTime = localDate.getTime()
const localGmtOffsetMs = localTime + localGmtOffsetMn * msPerMn

const GmtTime = new Date(localGmtOffsetMs)

const getHour = (date: object) => Number(date
  .toString()
  .split(' ')[4]
  .split(':')[0]
) % 24


const getHourWithGmtOffset = (date: object, GmtOffsetHr: number) => (getHour(date) + GmtOffsetHr) % 24

const getMinute = date => Number(
  date
    .toString()
    .split(' ')[4]
    .split(':')[1]
)

const getPeriod = (date: any) => date.toLocaleTimeString()
  .split(' ')[1] // Typescript does not recognize the toLocaleTimeString method on type object, so I am using type any.

const checkPeriod = (date: object, GmtOffsetHr: number) => {
  if (GmtOffsetHr % 1 !== 0) {
    GmtOffsetHr =
    getMinute(GmtTime) < 30
      ? Math.floor(GmtOffsetHr)
      : Math.ceil(GmtOffsetHr)
  }

  const remotePeriod = getPeriod(date)
  const hour = getHourWithGmtOffset(GmtTime, GmtOffsetHr)

  console.log('offset', GmtOffsetHr)
  console.log('rounded', GmtOffsetHr)
  console.log('remotePeriod', remotePeriod)
  console.log('hour ' + hour + '\n')

  if (hour < 12 &&
    remotePeriod === 'AM') {
    return true
  } else if (hour >= 12 &&
    remotePeriod === 'PM') {
    return true
  } else {
    return false
  }

}

module.exports = {
  getHour,
  getHourWithGmtOffset,
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

export {}
