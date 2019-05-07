var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var axios = require('axios');
var express = require('express');
var app = express();
var localGmtOffsetMs = require('./helpers').localGmtOffsetMs;
var API_KEY = require('./secrets').API_KEY;
var getLocationData = function (location) { return __awaiter(_this, void 0, void 0, function () {
    var response, name_1, locationKey, GmtOffsetHr, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios({
                        method: 'get',
                        url: "http://dataservice.accuweather.com/locations/v1/search?q=" + location + "&apikey=" + API_KEY
                    })];
            case 1:
                response = _a.sent();
                if (response.data[0]) {
                    name_1 = response.data[0].LocalizedName;
                    locationKey = response.data[0].Key;
                    GmtOffsetHr = response.data[0].TimeZone.GmtOffset;
                    return [2 /*return*/, { name: name_1, locationKey: locationKey, GmtOffsetHr: GmtOffsetHr }];
                }
                else {
                    return [2 /*return*/, { error: "No location matching \"" + location + "\" could be found. Please try again.\n" }];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getDate = function (GmtOffsetHr) {
    var msPerHr = 3600000;
    var remoteGmtOffsetMs = GmtOffsetHr * msPerHr;
    var totalGmtOffsetMs = localGmtOffsetMs + remoteGmtOffsetMs;
    var date = new Date(totalGmtOffsetMs);
    return date; // We will return a date instance so that we can easily test that the period (AM/PM) is correct, but we will coerce this into a LocalTimeString in buildMessage for logging purposes.
};
var getCurrentConditions = function (locationKey) { return __awaiter(_this, void 0, void 0, function () {
    var response, temperature, unit, currentconditions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios({
                        method: 'get',
                        url: "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + ".json?language=en&apikey=" + API_KEY
                    })];
            case 1:
                response = _a.sent();
                temperature = response.data[0].Temperature.Imperial.Value;
                unit = response.data[0].Temperature.Imperial.Unit;
                currentconditions = temperature + " " + unit;
                return [2 /*return*/, currentconditions];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var buildMessage = function (location) { return __awaiter(_this, void 0, void 0, function () {
    var locationData, message, name_2, locationKey, GmtOffsetHr, time, currentConditions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getLocationData(location)];
            case 1:
                locationData = _a.sent();
                if (!!locationData.error) return [3 /*break*/, 3];
                name_2 = locationData.name, locationKey = locationData.locationKey, GmtOffsetHr = locationData.GmtOffsetHr;
                time = getDate(GmtOffsetHr).toLocaleTimeString();
                return [4 /*yield*/, getCurrentConditions(locationKey)];
            case 2:
                currentConditions = _a.sent();
                message = "The time in " + name_2 + " is " + time + ". The temperature is " + currentConditions + ".\n";
                return [3 /*break*/, 4];
            case 3:
                message = locationData.error;
                _a.label = 4;
            case 4: return [2 /*return*/, message];
        }
    });
}); };
var printmessages = function (locations) {
    var messages = [];
    locations.forEach(function (location) { return __awaiter(_this, void 0, void 0, function () {
        var message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buildMessage(location)];
                case 1:
                    message = _a.sent();
                    console.log(message);
                    messages.push(message);
                    return [2 /*return*/];
            }
        });
    }); });
    return messages; // We will return the messages for ease of testing.
};
module.exports = {
    getLocationData: getLocationData,
    getDate: getDate,
    getCurrentConditions: getCurrentConditions,
    buildMessage: buildMessage,
    printmessages: printmessages
};
var PORT = 1337;
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
