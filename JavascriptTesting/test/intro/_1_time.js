var sinon = require('sinon'),
  should = require('should'),
	testingUtil = require('../../lib/util');

var clock;

describe('Fake out time functions with a specific date', function(){
    it('should use a fake date with Javascript Date', function(){
        var testDate = new Date(2014, 2, 14, 18, 31, 022);

        // set up time faking with a date
        var clock = sinon.useFakeTimers(testDate.getTime());

        // create a new date
        var newDate = new Date();

        // check that date is equal to the date supplied
        newDate.getTime().should.eql(testDate.getTime());
        newDate.getMonth().should.eql(2);
        newDate.getFullYear().should.eql(2014);
        clock.restore();
    });
});

describe('time tests without sinon timer', function(){
    it('should take at least 100 milliseconds to run', function(done){
       var cb = function() {
			 console.log('function was executed');
          done();
       };

       var throttled = testingUtil.throttle(cb);
		 throttled();
    });
});


describe('time tests', function(){

  // set up time faking
  before(function(){
    clock = sinon.useFakeTimers();
  });

  after(function(){
    clock.restore();
  });

  it('should call the callback function immediately', function(done){

      // simple function
      var cb = function() {
          console.log('I am done.');
          done();
      };

      // set up a callback function
      var callme = testingUtil.callImmediately(cb);

      // execute the function
      callme();
  });

  it('should not call the callback until the timer goes off', function(){
      // set up a callback function
    var cb = sinon.spy();
    var throttled = testingUtil.throttle(cb);

    // execute a method using setTimeout
    throttled();

    // check during the time before it executes to make sure it was not executed yet
    clock.tick(99);
    cb.called.should.be.false;

    // check after it executed
    clock.tick(100);
    cb.called.should.be.true;

  });
});

