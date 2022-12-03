## 实现原理
Async函数是使用Generator函数进行异步处理的增强版，Generator的语法糖。相对于Generator函数的改进：

用途：按顺序完成异步操作，实现更简洁，最符合语义。

1. 更好的语义
- Generator函数是通过在function后面使用"*"来标识此为Generator函数；
- Generator函数中使用yield命令暂停执行，交出执行权；
- Async函数是在function前加上 async 关键字；
- Async函数中使用await来等待异步返回结果

async函数完全可以看作多个异步操作包装成的一个Promise对象。

await就是内部then命令的语法糖

2. 内置执行器和返回值是Promise
- Async函数**内置执行器**，调用async函数就会一步步自动执行和等待异步操作，直到结束。
- Generator函数要想自动执行异步操作，需要为其创建一个自执行器，通过自执行器来自动化G函数的执行。

## async函数

async函数在定义时，在function关键字前需要有**async**关键字（意为异步，表示函数里有异步操作），在async函数内部可以使用await关键字（意为等待），表示会将其后面跟随的结果当成异步操作并等待其完成。

几种定义方式：
```javascript
// 声明式
async function A() {}
// 表达式
let A = async function() {}
//作为对象属性
let o = {
  A: async function() {}
}
//作为对象属性的简写
let o = {
  async A() {}
}
//箭头函数
let o = {
  A: async () => {}
}
```

执行async函数，会固定地返回一个Promise对象。得到该对象后便可设置成功或失败时的回调函数进行监听。如果函数执行顺利并结束，返回的P对象的状态会从等待转变成成功，并**输出return命令的返回结果（没有则为undefined）**。如果函数执行途中失败，JS会认为A函数已经完成执行，返回的P对象的状态会从等待转变成失败，并输出错误信息。

async函数返回一个Promise对象，可使用then添加回调函数。async函数内部return语句返回的值，会成为then方法回调函数的参数。async函数内部抛出的错误，会导致返回的Promise对象变为rejected状态，抛出的错误对象会被catch方法回调函数接收到。
```javascript
async function f() {
  throw new Error('error')
}

f().then( v => console.log(v), e => console.log(e) )
```

```javascript
A1().then(res => console.log(res)) // 10

async function A1() {
  let n = 10
  return n
}
 ```
### 状态变化
async函数返回的Promise对象，必须等到内部所有的await命令后面的Promise对象执行完，才会发生状态变化。除非遇到return语句，或抛出错误。

即，只有async函数内部的异步操作执行完，才会执行then的回调。
## await
只有在async函数内部才可以使用await命令，存在于async函数内部的普通函数也不行。

表示紧跟在后面的表达式需要等待结果，后面可以跟Promise对象和原始类型的值（但这时会自动转成立即resolve的Promise对象）

一般会跟Promise对象，返回该对象的结果，如果非Promise对象，直接返回相应值。
```javascript
async function f() { return await 123 }
f().then(v => console.log(v)) // 123

async function f1() {
  await Promise.reject('出错了')
  await Promise.resolve('hello') // 不会执行
}
```
- await后面的Promise对象变为rejected状态，则整个async函数都会中断执行。
- 如果await后面的异步操作出错，等同于async返回的Promise对象被reject。

- 注意点：await后面的Promise对象，运行结果可能是rejected，最好把异步操作代码放到 try...catch代码块中

  多个await命令后面的异步操作，如果不存在继发关系，最好让他们同时触发
  ```javascript
  // 继发关系
  let foo = await getFoo()
  let bar = await getBar()
  // 改为
  let [foo, bar] = await Promise.all([getFoo(), getBar()])
  // 或
  let fooPromise = getFoo() // 同时触发
  let barPromise = getBar() // 同时触发
  let foo = await fooPromise
  let bar = barPromise

  ```
```javascript
try {
  await new Promise(function(resolve, reject) {
    throw new Error('err')
  })
} catch (e) {

}
return await 'hello'
```

引擎会统一将await后面的跟随值视为一个Promise，对于不是Promise对象的值，会调用Promise.resolve()进行转化。即便此值为一个Error实例，经过转化后，引擎依然视其为一个成功的Promise，这个成功的Promise传递的数据为Error的实例

当函数执行到await命令时，会暂停执行并等待其后的Promise结束。如果该对象最终成功，将返回成功的返回值，相当于将await xxx替换为返回值。如果P对象最终失败，且错误没有被捕获，引擎会直接停止执行async函数，并将其返回对象的状态改为失败，输出错误信息。

当async函数执行时，一旦遇到await就先返回，等到异步操作完成，再接着执行函数体后面的语句。

async函数中的return x表达式，相当于return await x的简写。

```javascript
A1().then(res => console.log(res)) //2s后输出100

async function A1 () {
  let n1 = 10
  let n2 = await new Promise(resolve => {
    setTimeout(() => {
      resolve(10)
    }, 2000)
  })
  return n1 * n2
}

A2().catch(err => console.log(err)) // 2秒后输出10

async function A2 () {
  let n1 = 10
  let n2 = await new ((resolve, reject) => {
    setTimeout(() => {
      reject(10)
    }, 2000)
  })
  return n1 * n2
}
```



## 继发与并发
对于存在于JS循环（for，while等）的await命令，引擎遇到时也会暂停执行。意味着可以利用循环语句处理多个异步。

### 继发
```javascript
async function A1() {
  let n1 = await createPromise()
  console.log(n1)
  let n2 = await createPromise()
  console.log(n2)
  let n3 = await createPromise()
  console.log(n3)
}

async function A2() {
  for (let i = 0; i < 3; i++) {
    let n = await createPromise()
    console.log(n)
  }
}

function createPromise() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}
```

两个方法A1和A2的行为结果相同，都是每隔1s输出10，输出3次。

### 并发
```javascript
async function A1() {
  let res = Promise.all([createPromise(), createPromise(), createPromise()])
  console.log('data', res)
}

async function A2() {
  let res = []
  let reqs = [createPromise(), createPromise(), createPromise()]
  for (let i = 0; i < reqs.length; i++) {
    res[i] = await reqs[i]
  }
  console.log('data', res)
}

async function A3() {
  let res = []
  let reqs = [9,9,9].map((item) => {
    let n = createPromise(item)]
    return n + 1
  })
  for (let i = 0; i < reqs.length; i++) {
    res[i] = await reqs[i]
  }
  console.log('data', res)
}

function createPromise(n = 10) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(n);
    }, 1000);
  });
}
```

1. A1使用Promise.all生成一个聚合异步，首先生成一个要运行的promise的列表（promise对象的数组promises），将其作为参数传递给Promise.all，返回一个Promise让我们去await它完成（await Promise.all(promises)）。当所有操作都结束时，它就会进行resolve处理。

这种方法简单，但灵活性降低？，只有都成功和失败两种情况。

2. A2函数使用了循环语句，实际是继发的获取到各个异步值，但是总体但时间上相当并发，因为一开始创建reqs数组时，就已经开始执行了各个异步，之后虽然是逐一继发获取异步值，但是总花费与遍历顺序无关，恒等于耗时最多的异步所花费的时间。

3. A3函数相对于A2，仅仅为了说明如何配合数组的方法使用async函数。

A1，A2，A3的行为结果相同，都是约1秒后输出【10，10，10】

## 错误处理
一旦await后面的Promise转变为rejected，整个async函数便会终止。有时候并不希望一个异步操作的失败就终止整个函数，因此需要进行合理错误处理。这里的错误仅指状态变为rejected的Promise对象。

处理的方式有两种：
1. 先行包装Promise对象，使其始终返回一个成功的Promise对象。
2. 使用try.catch捕获错误

```javascript
A1().then(console.log)
A2().then(console.log)

async function A1() {
  let n
  n = await createPromise(true)
  return n
}

async function A2() {
  let n
  try {
    n = await createPromise(false)
  } catch (e) {
    n = e
  }
  return n
}

function createPromise(needCatch) {
  let p = new Promise((resolve, reject) => reject(10))
  return needCatch? p.catch(err => err) : p // 如果 onRejected 抛出一个错误或返回一个本身失败的 Promise ，  通过 catch() 返回的Promise 被rejected；否则，它将显示为成功（resolved）。
}
```
A1,A2都执行成功，且返回值为10。

如果 onRejected 抛出一个错误或返回一个本身失败的 Promise ，通过 catch() 返回的Promise 被rejected；否则，它将显示为成功（resolved）。

异步错误处理一般要涉及到为每个操作编写错误处理的回调。将错误传递到调用堆栈的顶部可能会非常复杂，通常要在每个回调开始的地方显式检查是否有错误抛出，这种方法冗长且容易出错。此外，如果没有恰当进行处理，Promise中抛出的异常将导致悄无声息的失败，导致错误检查不全面。

promise链式调用，最后使用一个catch函数，为所有操作提供一个错误处理器。但这还需要用特定的回调来处理异步错误，而不能像处理正常的JS错误那样来进行处理。

async/await方式：

使用正常的try/catch块，将整个操作包装在一个try/catch块中，这样，我们可以按照完全相同的方式，抛出和捕获同步代码和异步代码中的错误。

3. 组合
带有async标签的函数实际上会返回一个promise。可以非常容易地组合异步控制流。

```javascript
async function getUserInfo () {
  const api = new Api()
  const user = await api.getUser()
  const friends = await api.getFriends(user.id)
  const photo = await api.getPhoto(user.id)
  return { user, friends, photo }
}

// promise的写法
function promiseUserInfo () {
  getUserInfo().then(({ user, friends, photo }) => {
    console.log('promiseUserInfo', { user, friends, photo })
  })
}

// async的写法
async function awaitUserInfo () {
  const { user, friends, photo } = await getUserInfo()
  console.log('awaitUserInfo', { user, friends, photo })
}

// 想获取前十个用户的数据
async function getLotsOfUserData () {
  const users = []
  while (users.length < 10) {
    users.push(await getUserInfo())
  }
  console.log('getLotsOfUserData', users)
}

// 并行
sync function getLotsOfUserDataFaster () {
  try {
    const userPromises = Array(10).fill(getUserInfo())
    const users = await Promise.all(userPromises)
    console.log('getLotsOfUserDataFaster', users)
  } catch (err) {
    console.error(err)
  }
}
```

## 执行顺序
为Promise的实例方法（then,catch) 是推迟到本轮事件循环末尾才执行的后执行操作。

Generator函数是通过调用实例方法来切换控制权进而控制程序执行顺序。

```javascript
F(A1) // 1 3 4 2 5
F(A2) // 1 3 2 4 5
F(A3) // 1 3 2 , 隔2s后打印：4 9

function F(A) {
  console.log(1)
  A().then(console.log)
  console.log(2)
}

async A1() {
  console.log(3)
  console.log(4)
  return 5
}

async A2() {
  console.log(3)
  let n = await 5
  console.log(4)
  return 5
}

async A3() {
  console.log(3)
  let n = await createPromise()
  console.log(4)
  return n
}

function createPromise() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(9)
    }, 2000)
  })
}
```

执行async函数，会即刻执行其函数体，直到遇到await命令；遇到await命令后，执行权会转向async函数外部，即不管async函数内部执行而开始执行外部代码。执行完外部代码（本轮事件循环）后，才继续执行之前await命令后面的代码。

await指令，会使用Promise.resolve包裹其后的表达式，并为其设置回调函数。无论Promise是立刻有结果，还是过段时间后，其回调函数都会被推迟到本轮事件循环的末尾执行。

## 问题
手动实现 async await
对async、await的理解，内部原理,Async/Await怎么实现
Async/Await 如何通过同步的方式实现异步
使用Async会注意哪些东西
Async里面有多个await请求，可以怎么优化（请求是否有依赖）
async + await: 异步编程的终极方案 promise + generator的语法糖
es6 generator 是什么，async/await 实现原理
## 用async/await代替promise
使异步代码形式上更接近于同步代码，语义更明确，语法更简洁，代码阅读性高。

async定义的函数，表明内有异步事件，返回Promise对象，其最终resolve的值就是函数中return的内容

await getJSON()，await后面跟的是Promise，在resolve之后才执行并输出resolve的值

用async/await，要加错误处理，try catch

错误处理：promise串行的错误，会在最近的catch中被捕获，不能定位是哪个环节的错误；async/await异常堆栈指向了正确的函数

调试：async/await容易调试，可以执行步进操作，就像同步调用。而then调试器不会进入后续then，只能跟踪同步。

只有一个异步请求，用promise, then, catch
嵌套请求，用async/await

并行请求：await Promise.all([a(), b()])

## async函数实际上是Generator函数的语法糖

async function 声明用于定义一个返回 AsyncFunction 对象的异步函数。执行async函数时，遇到await关键字时，await 语句产生一个promise，await 语句以后的代码被暂停执行，等promise有结果（状态变为settled）之后再接着执行。

关键字await

await是一个让出线程的标志，await后面的函数会先执行一遍，然后就跳出整个async函数来执行后面的执行栈的代码，等本轮事件循环执行完了之后，又会跳回到async函数中等待await

await 后面表达式的返回值，如果返回值为非promise则继续执行async函数后面的代码，否则将返回的promise放入promise队列

关键字await使async函数一直等待（执行栈固然不可能停下来等待，await将其后面的内容包装成promise交给web APIs后，执行栈会跳出async函数，继续执行），直到promise执行完并返回结果

await下面的代码只有当await后面的promise返回结果后才会执行

而 await func(),像执行普通函数一样，执行func(), 然后跳出async函数，继续向下执行
