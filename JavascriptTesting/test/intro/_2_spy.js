var testingUtil = require("../../lib/util");
var should = require('should');
var sinon = require('sinon');

describe('show how spies work', function(){
  it('should call the callback function', function(){
    var cb = sinon.spy();

    // send spy for callback
    var proxy = testingUtil.callOnce(cb);

    // check that callback was not executed yet
    cb.called.should.be.false;

    // execute function under test (util.calledOnce)
    proxy();

    // check that callback was executed
    cb.called.should.be.true;
  });


  it('should call the callback function only once', function(){
    var cb = sinon.spy();

    // send spy for callback
    var proxy = testingUtil.callOnce(cb);

    // execute function more than once
    proxy();
    proxy();
    proxy();

      // check that callback was only executed once
    cb.called.should.be.true;
    cb.callCount.should.eql(1);
    cb.calledOnce.should.be.true;
    cb.calledTwice.should.be.false;
  });




  it('should call the callback with the right this', function(){
    var myThis = {};
    var spy = sinon.spy();

    // send spy for callback
    var proxy = testingUtil.callOnce(spy);

    // execute with 'myThis' this
    proxy.call(myThis);

    // check that the right 'this' was used
    spy.calledOn(myThis).should.be.true;
  });




  it('should call the callback with the right args', function(){
    var spy = sinon.spy();

    // send spy for callback
    var proxy = testingUtil.callOnce(spy);

    // execute with my arguments
    proxy('arg1', 'arg2', 'arg3');

    // check args that were called on callback
    spy.calledWith('arg1', 'arg2', 'arg3').should.be.true;
    spy.calledWith('arg1').should.be.true;
    spy.alwaysCalledWithExactly('arg1').should.be.false;
  });
});