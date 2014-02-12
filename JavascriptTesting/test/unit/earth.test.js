var should = require('should'),
  http = require('http'),
  parseString = require('xml2js').parseString,
  sinon = require('sinon'),
  events = require('events'),
  util = require('util'),
  earth = require('../../lib/earth'),
  rewire = require('rewire'),
  _ = require('underscore')._;

describe.skip('long-running earth integration tests', function(){
	it('should call the earth web site directly to get sunrise and sunset times for a given locaiton and date', function(done){
		var options = locations["lihue"];
		var url = "http://www.earthtools.org/sun/"
			+ options.latitude
			+ "/" + options.longitude
			+ "/" + 7
			+ "/" + 1
			+ "/" + options.gmtOffset
			+ "/0";
		http.get(url, function(result){
			if (result.statusCode != 200){
				cb('status code ' + result.statusCode);
			} else {
				result.setEncoding('utf8');
				result.on('data', function(xml){
					parseString(xml, function(err, times){
						var sunrise = times.sun.morning[0].sunrise[0];
						var sunset = times.sun.evening[0].sunset[0];
						done();
					});
				});
			}
		});
	});

  it('should call the earth module directly to get sunrise and sunset times for a given location and date', function(done){
    var location = locations["lihue"];
    earth.getSunriseSunset({
      latitude:  location.latitude,
      longitude: location.longitude,
      month: 7,
      day: 1,
      gmtOffset: location.gmtOffset
    }, function(err, sunTimes){
      if (err) {
        console.log("error: " + err);
        done();
      } else {
        console.log('direct call' + JSON.stringify(sunTimes));
        done();
      }
    });
  });

});

describe('Fast tests using mocked http calls and canned responses', function(){

  it('should stub http in test and deliver a canned xml response', function(){
    var HttpResponse = function(){
      events.EventEmitter.call(this);
      this.data = function(){
        var data = xmlResponse;
        this.emit('data', data);
      }
    };

    util.inherits(HttpResponse, events.EventEmitter);
    var httpResponse = new HttpResponse();
    httpResponse.statusCode = 200;
    httpResponse.setEncoding = function(){};

    // stub calls method with method at index 1 as callback -- stub will call callback
    sinon.stub(http, "get").callsArgWith(1, httpResponse);
    var cb = sinon.spy();
    var url = "/url";
    var mock = sinon.mock(httpResponse);

	 // set expectation that setEncoding is called with argument of utf8
    mock.expects("setEncoding").once().withArgs('utf8');

    http.get(url, function(result){
      if (result.statusCode != 200){
        cb('status code ' + result.statusCode);
      } else {
        result.setEncoding('utf8');
        result.on('data', function(xml){
          parseString(xml, function(err, times){
            var sunrise = times.sun.morning[0].sunrise[0];
            var sunset = times.sun.evening[0].sunset[0];
            cb(null, {sunrise: sunrise, sunset: sunset});
          });
        });
      }
    });

	 // call the data response
    httpResponse.data();

	 // verify that callback was called
    cb.called.should.be.true;

	 // verify that mocked expectations were met
    mock.verify();
    mock.restore();
    console.log('mocked* sunrise: ' + cb.args[0][1].sunrise + ' sunset: ' + cb.args[0][1].sunset);
    http.get.restore();
  });

	it('should return a server error', function(){
		var HttpResponse = function(){
			events.EventEmitter.call(this);
			this.data = function(){
				var data = xmlResponse;
				this.emit('data', data);
			}
		};

		util.inherits(HttpResponse, events.EventEmitter);
		var httpResponse = new HttpResponse();
		httpResponse.statusCode = 500;
		httpResponse.setEncoding = function(){};

		// stub calls method with method at index 1 as callback -- stub will call callback
		sinon.stub(http, "get").callsArgWith(1, httpResponse);
		var cb = sinon.spy();
		var url = "/url";
		var mock = sinon.mock(httpResponse);

		// set expection that setEncoding is never called
		mock.expects("setEncoding").never();

		http.get(url, function(result){
			if (result.statusCode != 200){
				cb('status code ' + result.statusCode);
			} else {
				result.setEncoding('utf8');
				result.on('data', function(xml){
					parseString(xml, function(err, times){
						var sunrise = times.sun.morning[0].sunrise[0];
						var sunset = times.sun.evening[0].sunset[0];
						cb(null, {sunrise: sunrise, sunset: sunset});
					});
				});
			}
		});

		cb.called.should.be.true;
		cb.calledWith('status code 500');
		mock.verify();
		mock.restore();
		http.get.restore();
	});

  it.only('should use a stub for http to return a canned response', function(){
    var HttpResponse = function(){
      events.EventEmitter.call(this);
      this.data = function(){
        var data = xmlResponse;
        this.emit('data', data);
      }
    };
    util.inherits(HttpResponse, events.EventEmitter);
    var httpResponse = new HttpResponse();
    httpResponse.statusCode = 200;
    httpResponse.setEncoding = function(){};
    
    // test
    var cb = sinon.spy();

    var mockHttp = sinon.stub();
    mockHttp.get = sinon.stub().callsArgWith(1, httpResponse);

    var testEarth = rewire("../../lib/earth.js");
    testEarth.__set__("http", mockHttp);

    var location = locations["moscow"];
    testEarth.getSunriseSunset({
      latitude:  location.latitude,
      longitude: location.longitude,
      month: 7,
      day: 1,
      gmtOffset: location.gmtOffset
    }, function(err, sunTimes){
      if (err) {
        console.log("error: " + err);
      } else {
        console.log('dependency injection call' + JSON.stringify(sunTimes));
      }
    });

    httpResponse.data();
  });

  it('should stub the http call in the earth module to return a canned response', function(){

  });
});

var locations = {
  "lihue": {latitude: 21.957534, longitude: -159.345016, gmtOffset: -10},
  "waimea canyon": {latitude: 22.075459, longitude: -159.6698, gmtOffset: -10},
  "moscow": {latitude: 55.751242, longitude: 37.618422, gmtOffset: 4},
  "green bay": {latitude: 44.43378, longitude: -88.000488, gmtOffset: -5},
  "buenos aires": {latitude: -34.705493, longitude: -58.447266, gmtOffset: -3}
}

var xmlResponse = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<sun> \
	<version>1.0</version> \
	<location>\
		<latitude>44.31</latitude> \
		<longitude>-88.1</longitude> \
	</location> \
	<date> \
		<day>1</day> \
		<month>1</month> \
		<timezone>-5</timezone> \
		<dst>0</dst> \
	</date> \
	<morning> \
		<sunrise>09:57:13</sunrise> \
		<twilight> \
			<civil>07:25:27</civil> \
			<nautical>06:49:59</nautical> \
			<astronomical>06:15:31</astronomical> \
		</twilight> \
	</morning> \
	<evening> \
		<sunset>17:23:58</sunset> \
		<twilight> \
			<civil>17:55:43</civil> \
			<nautical>18:31:10</nautical> \
			<astronomical>19:05:37</astronomical> \
		</twilight> \
	</evening> \
</sun>";
