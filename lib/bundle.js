'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var curryN$1 = createCommonjsModule(function (module, exports) {
//  Ramda v0.26.1
//  https://github.com/ramda/ramda
//  (c) 2013-2019 Scott Sauyet, Michael Hurley, and David Chambers
//  Ramda may be freely distributed under the MIT license.

(function (global, factory) {
  factory(exports);
}(commonjsGlobal, (function (exports) { 'use strict';

  function _arity(n, fn) {
    /* eslint-disable no-unused-vars */
    switch (n) {
      case 0: return function() { return fn.apply(this, arguments); };
      case 1: return function(a0) { return fn.apply(this, arguments); };
      case 2: return function(a0, a1) { return fn.apply(this, arguments); };
      case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
      case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
      case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
      case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
      case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
      case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
      case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
      case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
      default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
  }

  function _isPlaceholder(a) {
    return a != null &&
           typeof a === 'object' &&
           a['@@functional/placeholder'] === true;
  }

  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a)
            ? f2
            : _curry1(function(_b) { return fn(a, _b); });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b)
            ? f2
            : _isPlaceholder(a)
              ? _curry1(function(_a) { return fn(_a, b); })
              : _isPlaceholder(b)
                ? _curry1(function(_b) { return fn(a, _b); })
                : fn(a, b);
      }
    };
  }

  /**
   * Internal curryN function.
   *
   * @private
   * @category Function
   * @param {Number} length The arity of the curried function.
   * @param {Array} received An array of arguments received thus far.
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curryN(length, received, fn) {
    return function() {
      var arguments$1 = arguments;

      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length &&
            (!_isPlaceholder(received[combinedIdx]) ||
             argsIdx >= arguments$1.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments$1[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0
        ? fn.apply(this, combined)
        : _arity(left, _curryN(length, combined, fn));
    };
  }

  /**
   * Returns a curried equivalent of the provided function, with the specified
   * arity. The curried function has two unusual capabilities. First, its
   * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.5.0
   * @category Function
   * @sig Number -> (* -> a) -> (* -> a)
   * @param {Number} length The arity for the returned function.
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curry
   * @example
   *
   *      const sumArgs = (...args) => R.sum(args);
   *
   *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */
  var curryN = _curry2(function curryN(length, fn) {
    if (length === 1) {
      return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
  });

  exports.curryN = curryN;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
});

unwrapExports(curryN$1);

var curryn$1 = curryN$1.curryN;

var _isFunction_1_0_1_isFunction = isFunction;

var toString = Object.prototype.toString;

function isFunction (fn) {
  var string = toString.call(fn);
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
}

var set$1 = createCommonjsModule(function (module, exports) {
//  Ramda v0.26.1
//  https://github.com/ramda/ramda
//  (c) 2013-2019 Scott Sauyet, Michael Hurley, and David Chambers
//  Ramda may be freely distributed under the MIT license.

(function (global, factory) {
  factory(exports);
}(commonjsGlobal, (function (exports) { 'use strict';

  function _isPlaceholder(a) {
    return a != null &&
           typeof a === 'object' &&
           a['@@functional/placeholder'] === true;
  }

  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a)
            ? f2
            : _curry1(function(_b) { return fn(a, _b); });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b)
            ? f2
            : _isPlaceholder(a)
              ? _curry1(function(_a) { return fn(_a, b); })
              : _isPlaceholder(b)
                ? _curry1(function(_b) { return fn(a, _b); })
                : fn(a, b);
      }
    };
  }

  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a)
            ? f3
            : _curry2(function(_b, _c) { return fn(a, _b, _c); });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b)
            ? f3
            : _isPlaceholder(a)
              ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
              : _isPlaceholder(b)
                ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
                : _curry1(function(_c) { return fn(a, b, _c); });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c)
            ? f3
            : _isPlaceholder(a) && _isPlaceholder(b)
              ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
              : _isPlaceholder(a) && _isPlaceholder(c)
                ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
                : _isPlaceholder(b) && _isPlaceholder(c)
                  ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
                  : _isPlaceholder(a)
                    ? _curry1(function(_a) { return fn(_a, b, c); })
                    : _isPlaceholder(b)
                      ? _curry1(function(_b) { return fn(a, _b, c); })
                      : _isPlaceholder(c)
                        ? _curry1(function(_c) { return fn(a, b, _c); })
                        : fn(a, b, c);
      }
    };
  }

  /**
   * Returns a function that always returns the given value. Note that for
   * non-primitives the value returned is a reference to the original value.
   *
   * This function is known as `const`, `constant`, or `K` (for K combinator) in
   * other languages and libraries.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig a -> (* -> a)
   * @param {*} val The value to wrap in a function
   * @return {Function} A Function :: * -> val.
   * @example
   *
   *      const t = R.always('Tee');
   *      t(); //=> 'Tee'
   */
  var always = _curry1(function always(val) {
    return function() {
      return val;
    };
  });

  // `Identity` is a functor that holds a single value, where `map` simply
  // transforms the held value with the provided function.
  var Identity = function(x) {
    return {value: x, map: function(f) { return Identity(f(x)); }};
  };


  /**
   * Returns the result of "setting" the portion of the given data structure
   * focused by the given lens to the result of applying the given function to
   * the focused value.
   *
   * @func
   * @memberOf R
   * @since v0.16.0
   * @category Object
   * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
   * @sig Lens s a -> (a -> a) -> s -> s
   * @param {Lens} lens
   * @param {*} v
   * @param {*} x
   * @return {*}
   * @see R.prop, R.lensIndex, R.lensProp
   * @example
   *
   *      const headLens = R.lensIndex(0);
   *
   *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
   */
  var over = _curry3(function over(lens, f, x) {
    // The value returned by the getter function is first transformed with `f`,
    // then set as the value of an `Identity`. This is then mapped over with the
    // setter function of the lens.
    return lens(function(y) { return Identity(f(y)); })(x).value;
  });

  /**
   * Returns the result of "setting" the portion of the given data structure
   * focused by the given lens to the given value.
   *
   * @func
   * @memberOf R
   * @since v0.16.0
   * @category Object
   * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
   * @sig Lens s a -> a -> s -> s
   * @param {Lens} lens
   * @param {*} v
   * @param {*} x
   * @return {*}
   * @see R.prop, R.lensIndex, R.lensProp
   * @example
   *
   *      const xLens = R.lensProp('x');
   *
   *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
   *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
   */
  var set = _curry3(function set(lens, v, x) {
    return over(lens, always(v), x);
  });

  exports.set = set;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
});

unwrapExports(set$1);

var set = set$1.set;

function isThenable(f) {
  return f && _isFunction_1_0_1_isFunction(f.then)
}

// eval trackFn before fn
var before = curryn$1(2, function (trackFn, fn) { return function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  try {
    _isFunction_1_0_1_isFunction(trackFn) && trackFn.apply(this, args);
  } catch (e) {
    console.error(e);
  }

  return fn.apply(this, args)
}; });

// eval trackFn after fn
var after = curryn$1(2, function (trackFn, fn) { return function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var r = fn.apply(this, args);

  var self = this;

  var evalF = function () {
    try {
      trackFn.apply(self, args);
    } catch (e) {
      console.error(e);
    }
  };

  if (isThenable(r)) {
    return r.then(function (rr) {
      evalF();
      return rr
    })
  }

  evalF();
  return r
}; });

//
/* track by decorator
 * class SomeComponent {
 *     @track(before(() => console.log('hello, trackpoint')))
 *     onClick = () => {
 *         ...
 *     }
 * } */
var track = function (partical) { return function (target, key, descriptor) {
  if (!_isFunction_1_0_1_isFunction(partical)) {
    throw new Error('trackFn is not a function ' + partical)
  }
  var value = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return partical.call(this, descriptor.value, this).apply(this, args)
  };
  if (descriptor.initializer) {
    return set('initializer', function () {
      var value = descriptor.initializer.apply(this);
      return function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return partical.call(this, value, this).apply(this, args);
      }
    }, descriptor);
  }
  return set('value', value, descriptor)
}; };

exports.before = before;
exports.after = after;
exports.track = track;
//# sourceMappingURL=bundle.js.map
