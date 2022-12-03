一、Promise对象
Promise对象表示一个异步操作的结果，可以为异步操作的成功或失败绑定执行函数，让异步方法可以像同步方法一样返回值，但立即返回的是一个能代表未来可能出现结果的Promise对象。

promise是一个值的占位符，这个值在未来的某个时间要么resolve要么reject。

使用一个接收一个回调函数的Promise构造器创建一个promise。

```javascript
// 控制台输入：
new Promise(() => {})

// 结果：
__proto__: Promise
[[PromiseState]]: "pending"
[[PromiseResult]]: undefined

```
Promise是一个对象，它包含一个状态[[PromiseState]]和一个值[[PromiseResult]]，（并不能和这个对象交互，访问这两个值）

1. PromiseState
它的值就是Promise的状态，可以是以下三个值之一：
- pending：Promise暂时还没有被resolved也没有被rejected，仍处于pending状态
- fulfilled：Promise已经被resolved，在promise内部也没有发生错误
- rejected：Promise已经被rejected，某些事情出错了

2. PromiseResult
promise的值，即[[PromiseResult]]的值，是我们作为参数传递给resolve或reject方法的值。

Promise是一个构造函数，用new操作符来创建。

构造函数Promise的参数是一个函数，这个函数实际上有两个参数：resolve和reject，它们分别是两个函数：
- resolve，在Promise应该解决（resolve）的时候会被调用，将promise的状态从pending转换为fulfilled。（当异步数据准备好了，且没有错误发生的时候，将数据传给resolve方法）
- reject，在Promise出现一些错误应该被拒绝(reject)的时候被调用，将Promise的状态从pending转换为rejected。（当任务期间有错误发生，将error传给reject方法）

可以理解为：Promise函数体的内部包裹着一个异步的请求或操作或函数，我们可以在这个异步操作完成时使用resolve函数，将我们获得的结果传递出去，或者用reject函数将错误的消息传递出去。

`new Promise((resolve,reject) => {...} ，返回Promise对象`

```javascript
// 控制台输入：
new Promise((resolve,reject) => {resolve('yes!')})

// 结果：
__proto__: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "yes!"
```

```javascript
// 控制台输入：
new Promise((resolve,reject) => {reject('Error!')})

// 结果：
__proto__: Promise
[[PromiseState]]: "rejected"
[[PromiseResult]]: "Error!"
```

二、Promise的方法

创建后的promise有一些方法：then和catch。也可以人为的在Promise函数上添加一些满足我们自己需求的方法，方便每个promise对象使用。

- then()，在一个promise被resolve后调用，then方法接收传递给resolve方法的值
- catch()，在一个promise被reject后调用，catch方法接收传递给reject方法的值
- finally()，不论promise被resolve还是reject，总是调用

当你知道一个promise总是resolve或者总是reject的时候，可以写Promise.resolve或Promise.reject，传入你想要reject或resolve的promise的值。
```javascript
new Promise(res => res('say'))  ===>  Promise.resolve('say')
new Promise(rej => rej('Error'))  ===>  Promise.reject('Error')
```

Promise对象可以通过then方法，将上一步的结果获取过来（不管是fulfilled还是rejected)；还可以通过catch方法捕获Promise对象在使用catch之前的异常。
- then方法可以接受两个函数作为参数：
  - 第一个参数，是一个函数，用来处理resolve的结果，即通过函数resolve()传递出去的结果可以被第一个then方法的第一个函数捕获，作为它的参数
  - 第二个参数，可选，用来处理reject的结果。即通过函数reject()传递出去的结果可以被第一个then方法的第二个函数捕获，作为它的参数

  我们还可以在每一个then方法中创建新的Promise对象，然后将这个对象返回，之后就可以在后面的then方法中继续对这个对象进行操作

  一旦创建一个Promise对象之后，我们就可以使用then方法来进行链式的调用，而且我们可以把每一次的结果都返还给下一个then方法，然后在下一个then方法中对这个值进行处理。每一个then方法中都可以再次新创建一个Promise对象，然后返还给下一个then方法处理。

  then自己的执行结果是一个promise对象，意味着我们可以链接任意数量的then，前一个then回调的结果将会作为参数传给下一个then回调。

  ```javascript
  Promise.resolve(5)  // Promise {5}
  .then(res => res * 2) // Promise {10}
  .then(res => res * 2) // Promise {20}
  .then(res => res * 2) // Promise {40}
  ```

- catch方法，可以用来捕获整个then函数链中的异常。

执行异步操作setTimeout，2s后调用 resolve()方法。

```javascript
let p = new Promise((resolve, reject) => {
  // 一些异步操作
  setTimeout(function () {
    console.log('执行成功')
    resolve()
  }, 2000)
})
```
注：只是new了一个Promise对象，并没有调用它，我们传进去的函数就已经执行了。所以用Promise时，一般是包在一个函数中，在需要时才去运行这个函数。

```javascript
function asyncFunc () {
  let p = new Promise((resolve, reject) => {
    .....
  })
  return p
}

asyncFunc() //此处调用函数后才执行，执行该函数后，返回了一个Promise对象

asyncFunc().then((data) => {
  console.log(data)
})
```
在asyncFunc()的返回上直接调用then方法，then接收一个参数，是一个函数，该函数会拿到调用resolve时传的参数。

then里的函数就类似我们平时的回调函数，在asyncFunc这个异步任务执行完之后执行。这样就能把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方法执行回调函数。

Promise的优势在于，可以在then方法中继续写Promise对象并返回，然后继续调用then来进行回调作用。从表面上看，Promise只是能简化层层回调的写法，实质上精髓是“状态”，用维护状态，传递状态的方法来使得回调函数能及时调用，比传递callback简单、灵活。

可以在then里传递两个参数，第二个参数是函数，指定reject的回调，函数的参数是reject()函数传递的错误信息，第二个参数和catch方法的参数一样，用来指定reject的回调。

catch函数还有一个作用，在执行resolve的回调时，如果抛出异常了（代码出错了），并不会报错卡死，而是进到catch方法中。

```javascript
getNumber()
.then(function(data){
    console.log('resolved');
    console.log(data);
    console.log(somedata); //此处的somedata未定义
})
.catch(function(reason){
    console.log('rejected');
    console.log(reason);
}); // ReferenceError: somedata id not defined...
```
somedata未定义，进到catch方法，并且错误原因传到了reason中。

3. Promise.all
Promise.all(iterable)：iterable参数对象里的所有promise对象都成功的时候才会触发成功，只要有一个Promise被reject，立即触发返回promise对象的失败。

用来包装许多个Promise实例，组成一个新的Promise对象。新的Promise对象的状态由被包裹的Promise对象的状态决定，如果都被resolve了，则新的Promise对象的状态才是resolve的；只要有一个Promise被reject，则新的Promise对象的状态也是reject的。

提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。接收一个数组参数，里面的值最终都算返回Promise对象，异步操作是并行执行的，等到它们都执行完后才会进到then里面。那么，三个异步操作返回的数据哪里去了呢？都在then里面呢，all会把所有异步操作的结果放进一个数组中传给then

4. Promise.race
Promise.race(iterable)：iterable参数中的一个成功或失败都会立即触发返回promise对象的成功或失败。

包装许多个Promise实例，组成一个新的Promise对象。被包裹的Promise对象中有一个的状态发生了改变，新的Promise对象的状态就是那个最先改变的Promise实例的状态。

5. Promise.resolve

Promise.resolve(value)，返回一个状态由value给定的Promise对象，通常用于将一个值以Promise的方式使用。

主要是将一个值转变为一个Promise对象，且生成的Promise的状态是fulfilled，然后使它具有Promise的一些方法和特性，为了满足我们一些特殊情况下的要求。

```javascript
let arr = [ null, 0, 'hello', { then: function () { console.log('a thenable object')}}]

arr.map((value) => {
  return Promise.resolve(value)
})

console.log(arr)
```
输出结果为

```javascript
[ null, 0, 'hello', { then: [Function: then] } ]
 a thenable obj // Promise.resolve方法会将具有then方法的对象转换为一个Promise对象，然后就立即执行then方法。
```
Promise.resolve方法会将具有then方法的对象转换为一个Promise对象，然后就立即执行then方法。

6. Promise.reject

Promise.resolve(reason)，返回一个状态为失败的Promise对象。

和Promise.resolve方法一样，只是产生的Promise对象的状态是rejected

```javascript
let p = Promise.reject('fail');
p.catch((err) => {
    console.log(err);
}); // fail
```

