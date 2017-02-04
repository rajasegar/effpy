var assert = require("assert");
var _ = require('../index');

describe("Function Factory", function(){


  function nums2hex() {
    function componentToHex(component) {
      var hex = component.toString(16);
      // make sure the return value is 2 digits, i.e., 0c or 12
      if(hex.length == 1) {
        return "0" + hex;
      } else {
        return hex;
      }
    }

    return [].map.call(arguments, componentToHex).join('');
  }

  it("should bind first argument", function() {
    var powersofTwo = _.bindFirstArg(Math.pow,2);
    assert.equal(powersofTwo(3),8);
    assert.equal(powersofTwo(5),32);
  });

  it("should bind second argument", function() {
    var squareOf = _.bindSecondArg(Math.pow, 2);
    var cubeOf = _.bindSecondArg(Math.pow, 3);
    assert.equal(squareOf(3),9);
    assert.equal(cubeOf(3), 27);
  });

  it("should create bindable functions", function() {
    var makePowersOf = _.bindFirstArg(_.bindFirstArg, Math.pow);
    var powersOfThree = makePowersOf(3);
    assert.equal(powersOfThree(2), 9);
    assert.equal(powersOfThree(3), 27);
  });

  it("should partial apply arguments from left", function(){

    // assert(nums2hex(),'');
    // assert(nums2hex(100,200),'64c8');
    // assert(nums2hex(100,200,255,0,123),'64c8ff007b');

    var myOUI = 123;
    var getMacAddress = _.partialApply(nums2hex,myOUI);
    // assert.equal(getMacAddress(),'7b');
    assert.equal(getMacAddress(100,200,2,123,66,0,1),'7b64c8027b420001');

    var shadesOfRed = _.partialApply(nums2hex,255);
    assert.equal(shadesOfRed(123,0),'ff7b00');
    assert.equal(shadesOfRed(100,200),'ff64c8');

  });


  it("should partial apply arguments from right", function() {
    var shadesOfBlue = _.partialApplyRight(nums2hex,255);
    assert.equal(shadesOfBlue(123,0),'7b00ff');
    assert.equal(shadesOfBlue(100,200),'64c8ff');

    var shadesofGreen = _.partialApplyRight(nums2hex,255,0);
    assert.equal(shadesofGreen(123),'7bff00');
    assert.equal(shadesofGreen(100),'64ff00');
  });

  it("should curry the given function", function(){

    function rgb2hex(r,g,b) {
      return '#' + nums2hex(r) + nums2hex(g) + nums2hex(b);
    }

    var hexColors = _.curry(rgb2hex);
    // assert.equal(hexColors(11),[Function]);
    // assert.equal(hexColors(11,12,13),'');
    assert.equal(hexColors(11)(12)(123),'#0b0c7b');
    assert.equal(hexColors(210)(12)(0),'#d20c00');

    var reds = function(g,b){ return hexColors(255)(g)(b);};
    var greens = function(r,b){ return hexColors(r)(255)(b);};
    var blues  = function(r,g){ return hexColors(r)(g)(255);};

    assert.equal(reds(11, 12),'#ff0b0c');
    assert.equal(greens(11, 12),'#0bff0c');
    assert.equal(blues(11, 12),'#0b0cff');

    var hexs = _.curry(nums2hex,2);
    assert.equal(hexs(11)(12),'0b0c');
    // assert.equal(hexs(11),'');
    // assert.throws(hexs(11)(12)(0));
  });

  it("should compose two or more functions", function(){

    var negate = function(a) { return -a; };
    var square = function(a) { return a*a; };
    var mult2 = function(a) { return 2 * a; };
    var add1 = function(a) { return a + 1; };

    var f = _.compose(negate, square, mult2, add1);
    assert.equal(f(2), -36);

    function function1(a){return a + ' 1';}
    function function2(b){return b + ' 2';}
    function function3(c){return c + ' 3';}
    var composition = _.compose(function1, function2, function3);
    assert.equal( composition('count'), 'count 3 2 1'); 


  });


  it("should sequence two or more functions", function(){

    function function1(a){return a + ' 1';}
    function function2(b){return b + ' 2';}
    function function3(c){return c + ' 3';}
    var sequence = _.sequence(function3, function2, function1);
    assert.equal( sequence('sequence'), 'sequence 3 2 1');


  });

});
