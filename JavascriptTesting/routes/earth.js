var earth = require('../lib/earth');

var locations = [
    { "id": 1, "place": "Lihue", "latitude": 22.108374, "longitude": -159.614868, "gmtOffset": -10},
    { "id": 2, "place": "Wimea Canyon", "latitude": 22.075459, "longitude": -159.6698, "gmtOffset": -10},
    { "id": 3, "place": "Moscow", "latitude": 55.751242, "longitude": 37.618422, "gmtOffset": 4},
    { "id": 4, "place": "Green Bay", "latitude": 44.43378, "longitude": -88.000488, "gmtOffset": -5},
    { "id": 5, "place": "Buenos Aires", "latitude": -34.705493, "longitude": -58.447266, "gmtOffset": -3},
    { "id": 6, "place": "Yellowstone National Park", "latitude": 44.0689, "longitude": 106.865, "gmtOffset": -6},
    { "id": 7, "place": "Anchorage", "latitude": 61.21806, "longitude": -149.90028, "gmtOffset": -9}
];

exports.index = function(req, res) {
    res.render('earth/index', {title: 'All About Earth'});
};

exports.locations = function(req, res) {
    res.render('earth/locationList', {title: 'Locations', locations: locations})
};

exports.suntimes = function(req, res) {
    var id = req.params.id;
    var options = locations[id-1];
    var today = new Date();

    options.year = today.getFullYear();
    options.month = today.getMonth();
    options.day = today.getDay();
    earth.getSunriseSunset(options, function(err, result){
        var loc = locations[id-1];
        loc.sunrise = result.sunrise;
        loc.sunset = result.sunset;
        res.render('earth/sunTimes', {title: 'Sunrise and Sunset Times', location: loc});
    });
};

exports.elevation = function(req, res) {
    var id = req.params.id;
    var options = locations[id];
    earth.getElevation(options, function(err, result){
        var loc = locations[id];
        loc.elevation = {feet:result.feet, meters:result.meters};
        res.render('earth/elevation', {title: 'Elevation', location: loc});
    });
};