介绍下Promise，Promise有几个状态,内部实现,异常捕获,用途和性质;特性,精髓，以及优缺点
Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？
Promise 链式调用的时候怎么终止它?
promise如何实现then处理
promise里面和then里面执行有什么区别
模拟实现一个 Promise.finally
设计并实现 Promise.race()
实现promise.retry
Promise.all 使用、原理实现及错误处理,如何设计并实现Promise.all()
如何实现多层异步回调?
Promise接收的函数中resolve()后的代码是否会执行
promise封装ajax
Promise链式，实现必须上一个异步完成后再去跑下一个任务
代码实现中断 Promise 的运行

JS怎么实现异步,如何处理异常捕获
Promise有没有解决异步的问题（promise链是真正强大的地方）
Promise和Async处理失败的时候有什么区别
promise、Generator的区别

Promise的错误如果统一捕获？
Promise中的ajax 可以try catch 到么？

用Promise.race 再外面自己封装一层

a，b两个按钮，点击aba，返回顺序可能是baa，如何保证是aba（Promise.then）

- 你使用过 Promises 及其 polyfills 吗? 请写出 Promise 的基本用法（ES6）。
new Promise((resolve,reject) {
  if(...) resolve()
  else reject()
}).then((val)=>{},(err)=>{})
.catch((err)=>{

})

- 将一个异步方法promise化
- 将一个同步callback包装成promise形式

一般先把框架搭好，边写边讲解

- 提示：及早求值（eager evaluation），尴尬的取消机制，用 then() 方法伪装 map() 和 flatMap() 等。

- fulfill(解决): 指一个promise成功时进行的一系列操作，如状态的改变，回调的执行。promise实现中多以resolve来指代
- reject（拒绝）: 指一个promise失败时进行的一系列操作
- eventual value(终值)：promise被resolve时，传递给onFulfill 回调的值。因为promise有 一次性 的特征，所以当这个值被传递时，标志着promise pending态的结束，故称之为终值，有时直接简称为 值（value)
- reason（拒因）: 拒绝原因，指在promise被拒绝时传递给回调的值

# Promise/A+规范
Promise表示一个异步操作的最终结果，与之进行交互的主要是then方法，该方法注册了两个回调函数，用于接收promise的终值或本promise不能执行的原因。

本规范详细列出了 then 方法的执行过程，所有遵循 Promises/A+ 规范实现的 promise 均可以本标准作为参照基础来实施 then 方法。
## 1. 术语
1. promise: 是一个拥有then方法的对象或函数，其行为符合本规范
2. thenable: 是一个定义了then方法的对象或函数，“拥有then方法”
3. value（值）: 任何JS的合法值（包括undefined，thenable和promise)
4. exception（异常）: 使用throw语句抛出的值
5. reason（拒因）: 表示promise为什么rejected的值，即promise的拒绝原因

## 2. 要求
### 2.1 Promise 状态
一个promise的状态必须是以下3种状态中的一种：**等待态（Pending), 执行态（Fulfilled), 和拒绝态（Rejected）**
- Pending，处于等待态时，promise可以迁移至fulfilled或rejected状态
- Fulfilled，执行态时
  - 不能迁移至其他任何状态
  - 必须拥有一个不可再变的终值value
- Rejected，拒绝态时
  - 不能迁移至其他任何状态
  - 必须拥有一个不可再变的拒因reason

不可变，指的是恒等（即可用===判断相等），而不意味着更深层次的不可变（指当value或reason不是基本值时，只要求其引用地址相等，但属性值可被更改）

### 2.2 then 方法
一个promise必须提供一个then方法，来访问其当前值或终值value或拒因reason。

一个promise的then方法接受2个参数：
`promise.then(onFulfilled, onRejected)`

2.2.1 **参数可选** onFulfilled和onRejected都是可选的参数

如果onFulfilled、onRejected不是函数，其必须被忽略

2.2.2 **onFulfilled特性** 如果onFulfilled是函数
  - 当promise执行结束（fulfilled）后必须被调用，其第一个参数是promise的终值value
  - promise执行结束前，其不可被调用
  - 其调用次数不可超过一次

2.2.3 **onRejected特性** 如果onRejected是函数
  - 当promise被拒绝（rejected）后必须被调用，其第一个参数是promise的拒因reason
  - promise被拒绝前，其不可被调用
  - 其调用次数不可超过一次

2.2.4 **调用时机**: onFulfilled和onRejected 只有在执行环境堆栈仅包含**平台代码**时才可被调用。

平台代码(platform code)：指的是引擎，环境以及promise的实施代码。实践中要确保onFulfilled和onRejected方法异步执行，且应该在then方法被调用的那一轮事件循环之后的新执行栈中执行。事件队列可采用“宏任务”或“微任务”机制来实现。由于promise的实施代码本身就是平台代码，故代码自身在处理程序时可能已经包含一个任务调度队列。

macro-task: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering

micro-task: process.nextTick, Promises（这里指浏览器实现的原生 Promise）, Object.observe, MutationObserver

2.2.5 **调用要求**: onFulfilled和onRejected 必须被作为函数调用（即没有this值）

即，在**严格模式**中，函数 this 的值为 undefined ；在非严格模式中其为全局对象。

2.2.6 **多次调用**
then方法可以被同一个promise调用多次

- 当promise成功执行fulfilled时，所有相应的 onFulfilled 回调必须按照其（then的）注册顺序依次执行
- 当promise被拒绝执行rejected时，所有相应的 onRejected 回调必须按照其（then的）注册顺序依次执行

2.2.7 **返回**
then方法必须返回一个promise对象`promise2 = promise1.then(onFulfilled, onRejected)`

- 如果onFulfilled或onRejected返回一个值 x，则运行下面的 Promise 解决过程（Promise Resolution Procedure）`[[Resolve]](promise2, x)`
- 如果onFulfilled或onRejected抛出一个异常 e， 则promise2必须拒绝执行reject，并返回拒因 e
- 如果 onFulfilled不是函数，且 promise1成功执行 fulfilled， promise2 必须被fulfilled，并返回和promise1 相同的值value
- 如果 onRejected不是函数，且 promise1拒绝执行 rejected， promise2必须被rejected，并返回和promise1 相同的拒因

不论 promise1 被 reject 还是被 resolve 时，promise2 都会被 resolve，只有出现异常时才会被 rejected。 ？？

### Promise 解决过程（Promise Resolution Procedure）
Promise解决过程是一个抽象的操作，其需输入一个promise和一个值，表示为`[[Resolve]](promise, x)`。如果 x 是thenable，且看上去像一个 Promise，Promise解决过程试图让promise接受 x 的状态，否则 用 x的值来fulfill promise。

thenable的特性使得Promise的实现更具有通用性：只要暴露出一个遵循 Promise/A+ 的then方法即可。

运行`[[Resolve]](promise, x)`需遵循以下步骤：

- 如果 promise 和 x 指向同一个对象，reject 拒绝执行promise，据因是TypeError
- 如果 x 是一个promise，则使promise接受x的状态
  - 如果x处于pending，promise需保持为等待态直至x被fulfilled或rejected
  - 如果x处于fulfilled，用相同的值fulfill promise
  - 如果x处于rejected，用相同的reason reject promise
- x为对象或函数
  - 将 x.then 赋值给 then `let then = x.then`
  （这步我们先是存储了一个指向 x.then 的引用，然后测试并调用该引用，以避免多次访问 x.then 属性。这种预防措施确保了该属性的一致性，因为其值可能在检索调用时被改变。）
  - 如果取x.then的值时抛出错误e，则reject promise，以e为reason
  - 如果then是函数，将x作为函数的作用域this调用then函数，第一个参数 resolvePromise, 第二个参数 rejectPromise

  `then.call(x, resolvePromise, rejectPromise)`
    - 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
    - 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
    - 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    - 如果调用 then 方法抛出了异常 e：
      - 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
      - 否则以 e 为据因拒绝 promise
    - 如果 then 不是函数，以 x 为参数执行 promise (fulfill promise with x)
- 如果 x 不为对象或者函数，以 x 为参数执行 promise (fulfill promise with x)

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// new Promise 时需要传递一个执行器，执行器立即执行
function Promise(executor) {
    this.status = PENDING
    // 使用数组的原因是，一个promise可以同时执行多个 then 方法， 也就会同时存在多个then回调
    this.onFulfilled = [] // 成功的回调
    this.onRejected = [] // 失败的回调
    const self = this

    // promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
    // promise 的状态一旦确认，就不会再改变
    function resolve(value) {
        // 使用 setTimeout 实现异步
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                // 当promise成功执行fulfilled时，所有相应的 onFulfilled 回调必须按照其（then的）注册顺序依次执行
                self.onFulfilled.forEach(func => {
                    func(value)
                })
            }
        })
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = REJECTED
                self.reason = reason
                // 当promise被拒绝执行rejected时，所有相应的 onRejected 回调必须按照其（then的）注册顺序依次执行
                self.onRejected.forEach(fn => fn())
            }
        })
    }

    try {
      // 执行器接受两个参数，分别是resolve和reject
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

// then接收2个参数，分别是promise成功的回调onFulfilled，和失败的回调onRejected
// onFulfilled和onRejected都是可选的参数
Promise.prototype.then = function (onFulfilled, onRejected) {
    // 如果 onFulfilled不是函数，且 promise1成功执行 fulfilled， promise2 必须被fulfilled，并返回和promise1 相同的值value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    // 如果 onRejected不是函数，且 promise1拒绝执行 rejected， promise2必须被rejected，并返回和promise1 相同的拒因
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    // then方法必须返回一个promise对象`promise2 = promise1.then(onFulfilled, onRejected)`
    let promise2 = new Promise((resolve, reject) => {
        // 区分不同状态下的处理
        // 如果onFulfilled或onRejected返回一个值 x，则运行下面的 Promise 解决过程（Promise Resolution Procedure）`[[Resolve]](promise2, x)`
         // 如果onFulfilled或onRejected抛出一个异常 e， 则promise2必须拒绝执行rejected，并返回拒因 e

        if (this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            });
        }
        if (this.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        }
        if (this.status === PENDING) {
            this.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            });
            this.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            });
        }
    })
    return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise 和 x 指向同一个对象，reject 拒绝执行promise，据因是TypeError
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle'))
  }

  if (x && typeof x === 'object' || typeof x === 'function') {
    // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    let used;
    try {
        // x为对象或函数
        // 将 x.then 赋值给 then `let then = x.then`
      let then = x.then
      if (typeof then === 'function') {
        // 如果then是函数，将x作为函数的作用域this调用then函数，第一个参数 resolvePromise, 第二个参数 rejectPromise
        // `then.call(x, resolvePromise, rejectPromise)`
        then.call(x, (y) => {
          // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
          if (used) return
          used = true
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          resolvePromise(promise2, y, resolve, reject)
        }, (reason) => {
          if (used) return
          used = true
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          reject(r)
        })
      } else {
        // 如果 then 不是函数，以 x 为参数执行 promise (fulfill promise with x)
        if (used) return
        used = true
        resolve(x)
      }
    } catch (e) {
      // 如果取x.then的值时抛出错误e，则reject promise，以e为reason
      // 如果调用 then 方法抛出了异常 e：
      // - 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
      // - 否则以 e 为据因拒绝 promise
      if (used) return
      used = true
      reject(e)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise (fulfill promise with x)
    resolve(x)
  }
}
```

- 说明：onFulfilled和onFulfilled的调用需要放在setTimeout，因为规范中：

**调用时机**: onFulfilled和onRejected 只有在执行环境堆栈仅包含**平台代码**时才可被调用。

平台代码(platform code)：指的是引擎，环境以及promise的实施代码。实践中要确保onFulfilled和onRejected方法异步执行，且应该在then方法被调用的那一轮事件循环之后的新执行栈中执行。

- Promise.all
返回一个promise对象。
1. 如果传入的参数是一个空的可迭代对象，那么此promise对象回调完成(resolve),只有此情况，是同步执行的，其它都是异步返回的。
2. 如果传入的参数不包含任何 promise，则返回一个异步完成.
3. promises 中所有的promise都“完成”时或参数中不包含 promise 时回调完成。
4. 如果参数中有一个promise失败，那么Promise.all返回的promise对象失败
5. 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组
```javascript
/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 */
Promise.all = function (promises) {
    promises = Array.from(promises);//将可迭代对象转换为数组
    return new Promise((resolve, reject) => {
        let index = 0;
        let result = [];
        if (promises.length === 0) {
            resolve(result);
        } else {
            function processValue(i, data) {
                result[i] = data;
                if (++index === promises.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                  //promises[i] 可能是普通值
                  Promise.resolve(promises[i]).then((data) => {
                    processValue(i, data);
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        }
    });
}
```
测试用例如下：
```javascript
var promise1 = new Promise((resolve, reject) => {
    resolve(3);
})
var promise2 = 42;
var promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values); //[3, 42, 'foo']
},(err)=>{
    console.log(err)
});

var p = Promise.all([]); // will be immediately resolved
var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log(p);
console.log(p2)
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p2);
});
```
- Promise.race
返回一个Promise，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。
1. 如果传的参数数组是空，则返回的 promise 将永远等待。
2. 如果迭代包含一个或多个非promise值和/或已解决/拒绝的promise，则 Promise.race 将解析为迭代中找到的第一个值。

```javascript
/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(resolve, reject);
        });
    });
}

Promise.race = function (promises) {
    promises = Array.from(promises);//将可迭代对象转换为数组
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then((data) => {
                    resolve(data);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        }
    });
}
```
测试代码：
```javascript
Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    undefined,
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
]).then((data) => {
    console.log('success ', data);
}, (err) => {
    console.log('err ',err);
});

Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve(200) }, 200) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
]).then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
});
```
- Promise.resolve
Promise.resolve(value)返回一个以给定值解析后的Promise对象。

1. 如果value是一个thenable的对象，返回的promise会“跟随”这个thenable的对象，采用它的最终状态
2. 如果传入的value本身是一个promise对象，那么Promise.resolve将不做任何修改、原封不动地返回这个promise对象。
3. 其他情况，直接返回以该值为成功状态的promise对象。

```javascript
Promise.resolve = function (param) {
    if (param instanceof Promise) {
      return param;
    }
    return new Promise((resolve, reject) => {
        if (param && typeof param === 'object' && typeof param.then === 'function') {
            setTimeout(() => {
                param.then(resolve, reject);
            });
        } else {
            resolve(param);
        }
    });
}
```
thenable对象的执行加 setTimeout的原因是根据原生Promise对象执行的结果推断的，如下的测试代码，原生的执行结果为: 20  400  30;为了同样的执行顺序，增加了setTimeout延时。

```javascript
// 测试用例
let p = Promise.resolve(20);
p.then((data) => {
    console.log(data);
});


let p2 = Promise.resolve({
    then: function(resolve, reject) {
        resolve(30);
    }
});

p2.then((data)=> {
    console.log(data)
});

let p3 = Promise.resolve(new Promise((resolve, reject) => {
    resolve(400)
}));
p3.then((data) => {
    console.log(data)
});
```
- Promise.reject
和Promise.resolve不同，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
```javascript
Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
```
- Promise.prototype.catch
用于指定出错时的回调，是特殊的then方法。catch之后，可以继续.then。
```javascript
Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
```

- Promise.prototype.finally
不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then.
```javascript
Promise.prototype.finally = function (callback) {
    return this.then((value) => {
        return Promise.resolve(callback()).then(() => {
            return value;
        });
    }, (err) => {
        return Promise.resolve(callback()).then(() => {
            throw err;
        });
    });
}
```
- tips
有专门的测试脚本可以测试所编写的代码是否符合PromiseA+的规范。在promise实现的代码中，增加：
```javascript
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
```
安装测试脚本:
```javascript
npm install -g promises-aplus-tests
//如果当前的promise源码的文件名为promise.js,那么在对应的目录执行以下命令:
promises-aplus-tests promise.js
```
promises-aplus-tests中共有872条测试用例