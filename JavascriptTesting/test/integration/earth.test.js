var earth = require('../../lib/earth.js'),
  should = require('should'),
  dateformat = require('dateformat');

describe('earth library integration tests', function(done){
  it('should get elevation of a location', function(done){
    var location = locations["waimea canyon"];
    earth.getElevation(location, function(err, result){
      console.log(JSON.stringify(result));
      result.feet.should.eql('3369.4');
      result.meters.should.eql('1027');
      done();
    });
  });

  it('should get current time of a location', function(done){
    var location = locations["lihue"];
    earth.getCurrentTime(location, function(err, result){
      console.log(dateformat(result.currentDate));
      done();
    });
  });

  it('should get difference in hours between two locations', function(done){
    var location1 = locations["lihue"];
    var location2 = locations["green bay"];
    earth.getTimeDifference([location1, location2], function(err, result){
      console.log(result);
      done();
    });
  });

  it('should get sunrise and sunset times for a location', function(done){
    var location = locations["lihue"];
    location.day = 1;
    location.month = 7;
    location.year = 2013;
    earth.getSunriseSunset(location, function(err, result){
      console.log(JSON.stringify(result));
      done();
    });
  });

  it('should get length of day for a location', function(done){
    var location = locations["waimea canyon"];
    location.day = 1;
    location.month = 7;
    location.year = 2013;
    earth.getDaytimeLength(location, function(err, result){
      console.log(JSON.stringify(result));
      done();
    });
  });
});

var locations = {
  "lihue": {latitude: 21.957534, longitude: -159.345016, gmtOffset: -10},
  "waimea canyon": {latitude: 22.075459, longitude: -159.6698, gmtOffset: -10},
  "moscow": {latitude: 55.751242, longitude: 37.618422, gmtOffset: 4},
  "green bay": {latitude: 44.43378, longitude: -88.000488, gmtOffset: -5},
  "buenos aires": {latitude: -34.705493, longitude: -58.447266, gmtOffset: -3},
  "new york": {latitude: 40.71417, longitude: -74.00639},
  "anchorage": {"latitude": 61.21806, "longitude": -149.90028, "gmtOffset": -9}
};