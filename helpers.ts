const msPerMn = 60000

const localDate = new Date()
const localGmtOffsetMn = localDate.getTimezoneOffset()

const localTime = localDate.getTime()
const localGmtOffsetMs = localTime + localGmtOffsetMn * msPerMn

const GmtTime = new Date(localGmtOffsetMs)

const getHour = (date: object, GmtOffsetHr = 0) => Number(date
  .toString()
  .split(' ')[4]
  .split(':')[0]
) + GmtOffsetHr
% 24

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
  const hour = getHour(GmtTime, GmtOffsetHr)

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
