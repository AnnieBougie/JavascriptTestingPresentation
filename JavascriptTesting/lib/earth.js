var http = require('http'),
  parseString = require('xml2js').parseString,
  _ = require('underscore')._;

//var months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12};

// get raw sunrise/sunset data
var getSunriseSunset = function(options, cb){
  var url = "http://www.earthtools.org/sun/" 
    + options.latitude
    + "/" + options.longitude
    + "/" + options.day
    + "/" + options.month
    + "/" + options.gmtOffset
    + "/0";
  http.get(url, function(result){
    if (result.statusCode != 200){
      cb('status code ' + result.statusCode);
    } else {
      // result.setEncoding('utf8');
      result.on('data', function(xml){
        cb(xml);
      });
    }
  });
};

// get row timezone data
var getTimezone = function(options, cb){
  var url = "http://www.earthtools.org/timezone-1.1/"
    + options.latitude
    + "/" + options.longitude;

  http.get(url, function(result){
    if (result.statusCode != 200){
      cb('status code ' + result.statusCode);
    } else {
      result.setEncoding('utf8');
      result.on('data', function(xml){
        cb(xml);
      });
    }
  });
};

// get the gmt offset for a location
var getTimezoneOffset = function(options, cb){
  getTimezone(options, function(xml){
    parseString(xml, function(err, time){
      if (err) {
        cb(err);
      } else {
        cb(null, {
          offset: time.timezone.offset[0]
        });  
      }
    });
  });
};

// gets sunrise and sunset times
exports.getSunriseSunset = function(options, cb){
  getSunriseSunset(options, function(xml){
    parseString(xml, function(err, times){
      if (err) {
        cb(err);
      } else {
        var sunrise = times.sun.morning[0].sunrise[0];
        var sunset = times.sun.evening[0].sunset[0];
        cb(null, {sunrise: sunrise, sunset: sunset});
      }
    });
  });

};

// get the length of day for a location and date
exports.getDaytimeLength = function(options, cb){
  getSunriseSunset(options, function(xml){
    parseString(xml, function(err, times){
      if (err) {
        cb(err);
      } else {
        var sunriseTime = times.sun.morning[0].sunrise[0].split(':');
        var sunsetTime = times.sun.evening[0].sunset[0].split(':');
        var sunrise = new Date(options.year, options.month, options.day, sunriseTime[0], sunriseTime[1], sunriseTime[2]);
        var sunset = new Date(options.year, options.month, options.day, sunsetTime[0], sunsetTime[1], sunsetTime[2]);
        var diff = sunset.getTime() - sunrise.getTime();
        var msecPerMinute = 1000 * 60;
        var msecPerHour = msecPerMinute * 60;
        var hours = Math.floor(diff / msecPerHour );
        diff -= hours * msecPerHour;
        var minutes = Math.floor(diff  / msecPerMinute);
        diff -= minutes * msecPerMinute;
        var seconds = Math.floor(diff / 1000);
        cb(null, {hours: hours, minutes: minutes, seconds: seconds});
      }
    });
  });
};

// gets time data about a location
exports.getCurrentTime = function(options, cb){
  getTimezone(options, function(xml){
    parseString(xml, function(err, time){
      if (err) {
        cb(err);
      } else {
        var isoDate = new Date(time.timezone.isotime[0]);
        var current = new Date(time.timezone.localtime[0]);
        var utcTime = new Date(time.timezone.utctime[0]);
        cb(null, {isoDate: isoDate, currentDate: current, utcDate: utcTime});  
      }
    });
  });
};

// gets the difference in timbe between two locations, no dst
exports.getTimeDifference = function(options, cb){
  var time1, time2, error = "";
  getTimezoneOffset(options[0], function(err, data){
    time1 = parseInt(data.offset, 10);
    if (err) {
      error += err;
    } 
    getTimezoneOffset(options[1], function(err, data){
      time2 = parseInt(data.offset, 10);
      if (err) {
        error += err;
      } 
      if (error) {
        cb(error);
      } else {
        var difference;
        if (time1 > time2){
          difference = (time1 - time2);
        } else {
          difference = (time2 - time1);
        }
        cb(null, difference);
      }
    });
  });
};

// gets the feet or meters above sea level of a location
exports.getElevation = function(options, cb){
  var url = "http://www.earthtools.org/height/"
    + options.latitude 
    + "/" + options.longitude;

  http.get(url, function(result){
    if (result.statusCode != 200){
      cb('status code ' + result.statusCode);
    } else {
      result.setEncoding('utf8');
      result.on('data', function(xml){
        parseString(xml, function(err, elevation){
          cb(null, {feet: elevation.height.feet[0], meters: elevation.height.meters[0]});
        });
      });
    }
  });
};

exports.getHemisphere = function(offset){
  if (offset > 0){
    return "West";
  } else {
    return "East";
  }
};