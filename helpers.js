"use strict";
exports.__esModule = true;
var msPerMn = 60000;
var localDate = new Date();
var localGmtOffsetMn = localDate.getTimezoneOffset();
var localTime = localDate.getTime();
var localGmtOffsetMs = localTime + localGmtOffsetMn * msPerMn;
var GmtTime = new Date(localGmtOffsetMs);
var getHour = function (date) { return Number(date
    .toString()
    .split(' ')[4]
    .split(':')[0]) % 24; };
var getHourWithGmtOffset = function (date, GmtOffsetHr) { return (getHour(date) + GmtOffsetHr) % 24; };
var getMinute = function (date) { return Number(date
    .toString()
    .split(' ')[4]
    .split(':')[1]); };
var getPeriod = function (date) { return date.toLocaleTimeString()
    .split(' ')[1]; }; // Typescript does not recognize the toLocaleTimeString method on type object, so I am using type any.
var checkPeriod = function (date, GmtOffsetHr) {
    if (GmtOffsetHr % 1 !== 0) {
        GmtOffsetHr =
            getMinute(GmtTime) < 30
                ? Math.floor(GmtOffsetHr)
                : Math.ceil(GmtOffsetHr);
    }
    var remotePeriod = getPeriod(date);
    var hour = getHourWithGmtOffset(GmtTime, GmtOffsetHr);
    console.log('offset', GmtOffsetHr);
    console.log('rounded', GmtOffsetHr);
    console.log('remotePeriod', remotePeriod);
    console.log('hour ' + hour + '\n');
    if (hour < 12 &&
        remotePeriod === 'AM') {
        return true;
    }
    else if (hour >= 12 &&
        remotePeriod === 'PM') {
        return true;
    }
    else {
        return false;
    }
};
module.exports = {
    getHour: getHour,
    getHourWithGmtOffset: getHourWithGmtOffset,
    getMinute: getMinute,
    getPeriod: getPeriod,
    checkPeriod: checkPeriod,
    msPerMn: msPerMn,
    localDate: localDate,
    localTime: localTime,
    GmtTime: GmtTime,
    localGmtOffsetMn: localGmtOffsetMn,
    localGmtOffsetMs: localGmtOffsetMs
};
