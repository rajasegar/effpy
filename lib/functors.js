var t = require("./type_safety");
// Functors
module.exports = {
  // map :: (a -> b) -> [a] -> [b]
  map: function(f, a) {
    return t.arr(a).map(t.func(f));
  },

  // arrayOf :: (a -> b) -> ([a] -> [b])
  arrayOf: function(f) {
    var _this = this;
    return function(a) {
      return _this.map(t.func(f), t.arr(a));
    };
  }
};
