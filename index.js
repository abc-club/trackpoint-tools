import curryN from '@ramda/curryn'
import isFunction from 'is-function'
import propSet from '@ramda/set'

function isThenable(f) {
  return f && isFunction(f.then)
}

// eval trackFn before fn
export const before = curryN(2, (trackFn, fn) => function (...args) {
  try {
    isFunction(trackFn) && trackFn.apply(this, args)
  } catch (e) {
    console.error(e)
  }

  return fn.apply(this, args)
})

// eval trackFn after fn
export const after = curryN(2, (trackFn, fn) => function (...args) {
  const r = fn.apply(this, args)

  const self = this

  const evalF = () => {
    try {
      trackFn.apply(self, args)
    } catch (e) {
      console.error(e)
    }
  }

  if (isThenable(r)) {
    return r.then(rr => {
      evalF()
      return rr
    })
  }

  evalF()
  return r
})

//
/* track by decorator
 * class SomeComponent {
 *     @track(before(() => console.log('hello, trackpoint')))
 *     onClick = () => {
 *         ...
 *     }
 * } */
export const track = partical => (target, key, descriptor) => {
  if (!isFunction(partical)) {
    throw new Error('trackFn is not a function ' + partical)
  }
  const value = function (...args) {
    return partical.call(this, descriptor.value, this).apply(this, args)
  }
  if (descriptor.initializer) {
    return propSet('initializer', function () {
      const value = descriptor.initializer.apply(this);
      return function (...args) {
        return partical.call(this, value, this).apply(this, args);
      }
    }, descriptor);
  }
  return propSet('value', value, descriptor)
}
