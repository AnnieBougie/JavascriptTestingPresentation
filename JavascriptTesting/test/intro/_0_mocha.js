var testingUtil = require('../../lib/util'),
    http = require('http'),
    parseString = require('xml2js').parseString,
    should = require('should');

describe('Testing Framework Demo', function(){
    it('should execute synchronous code without a callback', function(){
        var a = [7, 18, 22];
        var total = testingUtil.addArray(a);
        should.exist(total);
        total.should.eql(47);
    });

    it('asynchronous test - should get sunrise and sunset times for a given location and date', function(done){
        var location = {latitude: 21.957534, longitude: -159.345016, gmtOffset: -10};
        var url = "http://www.earthtools.org/sun/" + location.latitude + "/" + location.longitude + "/1/7/" + location.gmtOffset + "/0";
        console.log(url);
        http.get(url, function(result){
            result.setEncoding('utf8');
            result.on('data', function(data){
                // console.log(data);
                parseString(data, function(err, result){
                    if (err){
                        console.log('data that caused an error: ' + data);
                    } else {
                        var sunrise = result.sun.morning[0].sunrise[0];
                        var sunset = result.sun.evening[0].sunset[0];
                        console.log("sunrise: " + sunrise + " sunset: " + sunset);
                        sunrise.should.eql("05:48:03");
                        sunset.should.eql("19:18:50");
                    }
                    done();
                });
            });
        });
    });

    it('should describe a test that needs to be written');
});


