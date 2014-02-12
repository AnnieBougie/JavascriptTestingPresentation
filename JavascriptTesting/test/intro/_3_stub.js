var sinon = require('sinon'),
  should = require('should'),
  earth = require('../../lib/earth');

var getPhrase = function(location){
	var hemisphere = earth.getHemisphere(location.gmtOffset);
	if (hemisphere == "East"){
	 return "Wow! You are a long, long way away from here. It is nighttime where you are.";
	} else if (hemisphere == "West"){
	 return "You're right next door to me.";
	} else {
	 throw new Error("You're not from around here, are you?");
	}
};

// integration test of eaarth api getHemisphere function
describe('Tests for getting the correct hemisphere and getting the correct phrase', function(){
   it('should return the western hemisphere', function(){
		var phrase = getPhrase(locations["green bay"]);
		should.exist(phrase);
		phrase.should.eql("You're right next door to me.");
   });

	it('should return the eastern hemisphere', function(){
		var phrase = getPhrase(locations["moscow"]);
		should.exist(phrase);
		phrase.should.eql("Wow! You are a long, long way away from here. It is nighttime where you are.");
	});
});

describe('Tests for getting the correct phrase', function(){
  before(function(){
    var hemisphereStub = sinon.stub(earth, "getHemisphere");
    hemisphereStub.withArgs(-5).returns("West");
    hemisphereStub.withArgs(4).returns("East");
    hemisphereStub.withArgs(0).returns("Nowhere");
  });

  after(function(){
    earth.getHemisphere.restore();
  });

  it('should return the correct phrase when the location is in the west', function(){
    var phrase = getPhrase(locations["green bay"]);
    phrase.should.eql("You're right next door to me.");
  });

  it('should return the correct phrase when the location is in the east', function(){
    var phrase = getPhrase(locations["moscow"]);
    phrase.should.eql("Wow! You are a long, long way away from here. It is nighttime where you are.");
  });

  it('should throw an error when the location is not recognized', function(){
    (function(){
      getPhrase({latitude: 0, longitude: 0, gmtOffset: 0}).should.throw(/^not from around here.*/);
    });
  });
});

var locations = {
  "lihue": {latitude: 21.957534, longitude: -159.345016, gmtOffset: -10},
  "waimea canyon": {latitude: 22.075459, longitude: -159.6698, gmtOffset: -10},
  "moscow": {latitude: 55.751242, longitude: 37.618422, gmtOffset: 4},
  "green bay": {latitude: 44.43378, longitude: -88.000488, gmtOffset: -5},
  "buenos aires": {latitude: -34.705493, longitude: -58.447266, gmtOffset: -3}
}