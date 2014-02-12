var earthRoute = require('../../routes/earth'),
	sinon = require('sinon'),
	rewire = require('rewire'),
	should = require('should');


describe('test routes', function() {
	describe('call the earth/index route', function() {
		it('should render the earth index page', function(){
			var res =  {render: function() {}};

			var mock = sinon.mock(res);

			// set up expectations
			var exp = mock.expects("render").once();

			earthRoute.index(null, res);


			mock.verify();
			mock.restore();
		});

		it('should call render with the correct title', function(){
			var res = {};
			res.render = sinon.spy();

			earthRoute.index(null, res);

			res.render.called.should.be.true;

			var args = res.render.args;

			args[0][0].should.eql('earth/index');
			args[0][1].title.should.eql('All About Earth');

		});
	});

	describe('call the earth/locationList route', function(){

		it('should call render with the location list', function(){
			var req = {};
			var res = {};
			res.render = sinon.spy();

			var testEarthRoute = rewire("../../routes/earth.js");
			testEarthRoute.__set__("locations", mockLocations);

			testEarthRoute.locations(req, res);

			var args = res.render.args;

			var returnedLocations = args[0][1].locations;
			returnedLocations.length.should.eql(3);
		});
	});

	describe.only('call the earth elevation route', function(){
		it('should call earth api with correct location', function(){
			var req = {params: {id: 1}};
			var res = {};
			res.render = sinon.spy();

			//earthRoute.elevation(req, res);

			var testEarthRoute = rewire("../../routes/earth.js");
			testEarthRoute.__set__("locations", mockLocations);
			testEarthRoute.__set__("earth", mockEarth);

			testEarthRoute.elevation(req, res);

			var args = res.render.args;

			var result = args[0][1];

			should.exists(result.location);
			should.exists(result.location.elevation);
			result.location.elevation.feet.should.eql(100);

			// if we passed in id = 1, we should get back id = 1
			result.location.id.should.eql(1);
		});
	});
});

var mockLocations = [
	{ "id": 1, "place": "Buenos Aires", "latitude": -34.705493, "longitude": -58.447266, "gmtOffset": -3},
	{ "id": 2, "place": "Yellowstone National Park", "latitude": 44.0689, "longitude": 106.865, "gmtOffset": -6},
	{ "id": 3, "place": "Anchorage", "latitude": 61.21806, "longitude": -149.90028, "gmtOffset": -9}
];

var mockEarth = {
	getElevation: getElevation = function(options, cb){
		cb(null, {feet: 100, meters: 30});
	}
};