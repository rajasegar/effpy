var t = require('./lib/type_safety');
var f = require('./lib/functors');

module.exports = {

  bindFirstArg: function(func, a){
    return function(b) {
      return func(a,b);
    };
  },

  bindSecondArg: function(func, b) {
    return function(a) {
      return func(a,b);
    };
  },

  partialApply: function(func) {
    var args = Array.prototype.slice.call(arguments,1);
    return function() {
      return func.apply(this, args.concat(
        Array.prototype.slice.call(arguments)
      ));
    };
  },

  partialApplyRight: function(func) {
    var args = [].slice.call(arguments,1);
    return function(){
      return func.apply(
        this,
        [].slice.call(arguments, 0).concat(args)
      );
    };
  },

  curry: function(func, numArgs) {
    numArgs = numArgs || func.length;

    // recursively acquire the arguments
    function subCurry(prev) {
      return function(arg) {
        var args = prev.concat(arg);
        if(args.length < numArgs) {
          // recursive case: we still need more args
          return subCurry(args);
        } else {
          // base case: apply the function
          return func.apply(func, args);
        }
      };
    }

    return subCurry([]);
  },

  // compose
  compose: function() {

    // first make sure all arguments are functions
    var argsOfCompose = Array.prototype.slice.call(arguments);
    var funcs = f.arrayOf(t.func)(argsOfCompose);

    // return a function that applies all the functions
    return function() {
      var argsOfFuncs = arguments;
      for (var i = funcs.length; i > 0; i -= 1) {
        argsOfFuncs = [funcs[i-1].apply(this, argsOfFuncs)];
      }
      return argsOfFuncs[0];
    };
  },


  // sequence
  sequence: function(){
    // first make sure all arguments are functions
    var argsOfSequence = [].slice.call(arguments);
    var funcs = f.arrayOf(t.func)(argsOfSequence);

    // return a function that applies all the functions
    return function(){
      var argsOfFuncs = arguments;
      for(var i = 0; i < funcs.length; i++) {
        argsOfFuncs = [funcs[i].apply(this, argsOfFuncs)];
      }
      return argsOfFuncs[0];
    };
  }
};

