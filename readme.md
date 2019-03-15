[![Build Status](https://travis-ci.org/Qquanwei/trackpoint-tools.svg?branch=master)](https://travis-ci.org/Qquanwei/trackpoint-tools)
[![npm](https://img.shields.io/npm/v/trackpoint-tools.svg)](https://www.npmjs.com/package/trackpoint-tools)

# 此项目 fork 自https://github.com/Qquanwei/trackpoint-tools,主要做了以下精简和优化：1.去除不需要的方法 2.减小包体积（优化前约 200k，优化后 15k）

# 只包含 before after 两个 api

# 不能再让埋点继续侵入我们的逻辑了，我们需要做点什么

## trackpoint-tools-min

埋点逻辑往往是侵入性的，我们需要将这块代码拆分出去。
幸运的是 es6,es7 给我们提供了可能。

```
npm i trackpoint-tools-min --save
```

使用 trackpoint-tools 你可能会用下面的方式写埋点信息, 完全不侵入原有逻辑

```
class SomeComponent {
  @track(composeWith(ms => (element) => ajax.post(url, {ms, name: element.name}), time))
  onClick (element) {
    return element.someMethod()
  }
}
```

示例(React 全): https://codesandbox.io/s/wqxr0j2qj5
示例(Vue 演示):https://codesandbox.io/s/oxxw580yz5

## API 列表

- [before](#before)
- [after](#after)
- [once](#once)
- [track](#track)
- [nop](#nop)
- [composeWith](#composeWith)
- [evolve](#evolve)
- [time](#time)
- [identity](#identity)
- [createCounter](#createCounter)

所有的 API 都满足 curryable, 所有的 trackFn 都不会影响正常逻辑执行。

trackFn 指实际执行逻辑的跟踪函数， fn 为普通的业务函数。

### <a name="before"></a> before(trackFn, fn)

```
import { before } from 'trackpoint-tools'

class SomeComponent {
    onClick = before((name) => console.log('seed some ', name))((name) => {
       // normal
       console.log('normal click ', name)
    })
}
```

onClick('me')

->

```
  seed some me
  normal click me
```

### <a name="after"></a>after(trackFn, fn)

```
import { after } from 'trackpoint-tools'

class SomeComponent {
  onClick = after(() => console.log('send after'))(() => {
    // normal
    console.log('normal click')
  })
}
```

onClick

->

```
    normal click
    send after

```

Using Promise

```
import { after } from 'trackpoint-tools'

class SomeComponent {
    onClick = after(() => console.log('send after'))(() => {
         return ajax.post(...).then(() => {
             console.log('normal click')
         })
    })
}
```

onClick

->

```
    normal click
    send after

```

### <a name="once"></a>once(fn)

same as lodash/once
[lodash/once](https://lodash.com/docs/4.17.4#once)

### <a name="track"></a>track(fn)

借助 es7 的 decorator 提案可以让我们以一种非常优雅的方式使用高阶函数， track 用来将普通的 class 函数包装成 decorator
使用起来非常简单

babel plugin: https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy

```
class SomeComponent {
  @track(before(() => console.log('before')))
  onClick () {
    console.log('click')
  }

  @track(after(() => console.log('after')))
  onClickAjax () {
    return ajax.get(...').then(() => {
        console.log('request done')
    })
  }
}
```

->

```
 before
 click
```

->

```
 request done
 after
```

### <a name="nop"></a> nop()

do nothing , empty function

### <a name="composeWith"></a> composeWith(convergeFn, [ops])

composeWith 类似 after, 主要执行收集执行期间性能的操作, 并将参数传给普通 trackFn 更高一阶函数

ops 会被展开为 `fn -> (...args) -> {}`, 执行顺序为从右到左，如果只有一项操作
可省略数组直接传入 ops 函数

```
class SomeComponent {
  @track(composeWith(m => (...args) => console.log(m + 'ms'), [time]))
  onClick () {
     ...
     ...
     return 0
  }
}
```

->

```
 somecomponent.onClick() // return 0 . output 100ms

```

### <a name="evolve"></a> evolve(evols)

evols 是一个求值对象，value 为实际求值操作(例如 time, identity).
与 composeWith 结合使用.

注意，evolve 中每个操作都有可能跟踪 fn，但是 fn 只能执行一次，所以只有 fn 第一次执行才能进行有效的性能计算。
所以需要将性能计算写在 evols 的第一行(但其实顺序并不能保障 [ref](https://github.com/lodash/lodash/blob/npm/mapValues.js#L27))。

例如

```
const evols = {
  timeMs: trackpoint.time,
  value: trackpoint.identity
}

const trackFn = ({timeMs, value}) => (...args) => {
  console.log('timeMs ', timeMs)
  console.log('value ', value)
}

const evolve = trackpoint,evolve

class SomeComponent {
  @track(composeWith(trackFn, evolve(evols)))
  onClick() {
    // some sync operation, about 300ms
    return 101
  }
}
```

output->

```
timeMs 301
value 101
```

### <a name="time"></a> time(fn) -> (...) -> ms

测量普通函数与 thenable 函数执行时间, 单位毫秒

```
 time(() => console.log('out'))() // return 1
```

### <a name="identity"></a> identity(fn) -> (...) -> value

输出 fn 的执行结果

### <a name="createCounter"></a> createCounter() -> (fn) -> (...) -> value

创建一个计数器，可以用来统计 fn 函数被调用的次数

```
const trackFn = ({count}) => (...args) => console.log('count is:', count)
const fn = () => { console.log('why always click me?')}


const composeFn = composeWith(trackFn, evolve({count: createCounter()}))(fn)

composeFn()
// why always click me?
// count is 1
composeFn()
// why always click me?
// count is 2
...
...
```

## 关于 this

使用

```
class SomeComponent {
  @track(before(function () {
  }))
  onClick () {
  }
}
```

会自动将 this 绑定到 before 的函数体中。

注意： JS 中此处如果有箭头函数会绑定到全局的 this(null), 所以在此处不建议使用箭头函数

## TL;DR

推荐使用 es7 的 decorator
大量流程控制虽然为高阶函数, 但实际调用的参数皆为用户输入的参数

## 贡献

欢迎 fork, 有新的想法可以直接提 PR

- build

`npm run build`

- test

`npm run test`
