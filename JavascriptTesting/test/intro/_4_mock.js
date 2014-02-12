var sinon = require('sinon'),
  should = require('should'),
  earth = require('../../lib/earth'),
  testingUtil = require("../../lib/util");

describe('Mocking tests', function(){
	var myAPI = { canCall: function () {console.log("call me maybe")}, mustCall: function(){console.log("I must be called, or else")} };

	it('should return the return value from the original function', function(){
		// set up mock for method
		var mock = sinon.mock(myAPI);

		// set up expectations
		var exp = mock.expects("canCall").once().returns(42);
		mock.expects("mustCall").once();

		// create proxies
		var canCallProxy = testingUtil.callOnce(myAPI.canCall);

		// execute proxy
		var result = canCallProxy();

		// test return value
		result.should.eql(42);

		// call must call method so test can pass
		//myAPI.mustCall();

		// test method was called
		mock.verify();

		// restore
		mock.restore();
	});
});



// mocking without stubbing
describe('test alert behavior', function(){
	var timeApi;
	timeApi = {
		getDaytimeLength: function (options, alerter, cb) {
			var me = this;
			me.alert = alerter;
			earth.getDaytimeLength(options, function (err, result) {
				if (result.hours <= 10) {
					me.alert();
				}

				cb();
			});
		},
		alwaysCreateAlert: function (alerter, cb) {
			alerter();
			cb();
		}
	};

	var alertApi = {
		createAlert : function() {
			console.log("The days are too short this time of year. Take a vacation elsewhere.");
		}
	};

	var mock;

	beforeEach(function(){
		mock = sinon.mock(alertApi);

	});

	afterEach(function(){
		mock.verify();
		mock.restore();
	});

	it('should always create alert', function(){
		mock.expects("createAlert").once();
		timeApi.alwaysCreateAlert(alertApi.createAlert, function(){});
	});

	it('should create alert if days are shorter than 10 hours', function(done){

		mock.expects("createAlert").once();

		var options = locations["anchorage"];
		var date = new Date(2014, 12, 21);
		options.year = date.getFullYear();
		options.month = date.getMonth();
		options.day = date.getDate();
		timeApi.getDaytimeLength(options, alertApi.createAlert, done);

	});

	it('should not create an alert if days are longer than 10 hours', function(done){
		mock.expects("createAlert").never();

		var options = locations["buenos aires"];
		var date = new Date(2014, 12, 21);
		options.year = date.getFullYear();
		options.month = date.getMonth();
		options.day = date.getDate();
		timeApi.getDaytimeLength(options, alertApi.createAlert, done);
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