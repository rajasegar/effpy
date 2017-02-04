var typeOf = function(type) {
  return function(x) {
    if (typeof x === type) {
      return x;
    } else {
      throw new TypeError("Error: "+type+" expected, "+typeof x+" given.");
    }
  };
};

var objectTypeOf = function(name) {
  return function(o) {
    if (Object.prototype.toString.call(o) === "[object "+name+"]") {
      return o;
    } else {
      throw new TypeError('Error: ' + name + ' expected, something else given.');
    }
  };
};

module.exports = {
  str:  typeOf('string'),
  num:  typeOf('number'),
  func: typeOf('function'),
  bool: typeOf('boolean'),
  obj:  objectTypeOf('Object'),
  arr: objectTypeOf('Array')
  // var date = objectTypeOf('Date');
  // var div = objectTypeOf('HTMLDivElement');
};
