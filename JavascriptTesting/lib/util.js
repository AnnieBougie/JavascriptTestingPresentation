var _ = require('underscore')._;

exports.addArray = function(arr) {
  var total = 0;
  _.each(arr, function(a){
    total += a;
  });
  return total;
};

exports.callOnce = function(cb) {
  var returnValue;
  var called = false;

  return function(){
    if (!called ) {
      called = true;
      returnValue = cb.apply(this, arguments);
    }

    return returnValue;
  }
};

exports.throttle = function (cb) {
  var timer;
  return function () {
    clearTimeout(timer);
    var args = [].slice.call(arguments);
    timer = setTimeout(function () {
      cb.apply(this, args);
    }, 100);
  };
};

exports.callImmediately = function(cb) {
    return function () {
        var args = [].slice.call(arguments);
        cb(this, args);
    };
};

