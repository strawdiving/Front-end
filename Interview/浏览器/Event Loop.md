2. Event Loop
JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：
（1）所有同步任务都在主线程上执行，形成一个执行栈。
（2）主线程之外，还存在一个"任务队列"。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
（4）主线程不断重复上面的第三步。
event loop 基本每次都会被问到，一般就是说微任务、宏任务，怎么样的运行过程，以上是比较书面一点的回答，我自己也没记得。

- 事件循环
理解浏览器是如何处理用户输入、Web 请求和一般事件的。知道如何识别并正确实现异步代码。
js 单线程、
调用栈 (call stack) 和任务队列 (task queue) 的区别,宏任务与微任务的执行顺序
async，setTimeout和promise的执行顺序
Process.nextTick，setImmediate 和promise.then的优先级
理解 JavaScript 中异步和单线程分别是怎样的

宏任务、微任务、UI渲染等的执行顺序，浏览器端的必须要掌握，node端的有精力的最好也能掌握。

- 解释同步 (synchronous) 和异步 (asynchronous) 函数的区别。

　JS的解析是由浏览器中的JS解析引擎完成的，比如谷歌的是V8。JS是单线程运行，也就是说，在同一个时间内只能做一件事，所有的任务都需要排队，前一个任务结束，后一个任务才能开始。但是又存在某些任务比较耗时，如IO读写等，所以需要一种机制可以先执行排在后面的任务，这就是：同步任务(synchronous)和异步任务(asynchronous)。

　　JS的执行机制就可以看做是一个主线程加上一个任务队列(task queue)。同步任务就是放在主线程上执行的任务，异步任务是放在任务队列中的任务。所有的同步任务在主线程上执行，形成一个执行栈;异步任务有了运行结果就会在任务队列中放置一个事件；脚本运行时先依次运行执行栈，然后会从任务队列里提取事件，运行任务队列中的任务，这个过程是不断重复的，所以又叫做事件循环(Event loop)。

- JS线程
执行：JS引擎线程
协助：事件触发线程，定时器触发线程，HTTP异步请求线程

JS引擎线程是真正执行的，其他是协助。

- JS引擎线程：也叫JS内核，负责解析执行JS脚本程序的主线程，如V8引擎
- 事件触发线程：属于浏览器内核线程，主要用于控制事件，如鼠标，键盘等，当事件被触发时，就会把事件的处理函数推进事件队列，等待JS引擎线程执行
- 定时器触发线程：主要控制setInterval和setTimeout，用来计时，计时完毕后，把定时器的处理函数推进事件队列中，等待JS引擎线程执行
- HTTP异步请求线程：通过XMLHttpRequest连接后，通过浏览器新开的一个线程，监控readyState状态变更时，如果设置了该状态的回调函数，则将该状态的回调函数推进事件队列中，等待JS引擎线程执行。

**浏览器对同一域名的并发连接数是有限的，通常为6个**

- **宏任务**
分为：
  - 同步任务：按顺序执行，前一个任务完成后，才能执行后一个任务
  - 异步任务： 不直接执行，只有满足触发条件时，相关线程才将该异步任务推进任务队列中，等到JS引擎主线程上的任务执行完毕时才开始执行，如DOM事件，setTimeout，异步Ajax等

- **微任务**
微任务是ES6和Node环境下，主要API有：Promise，process.nextTick

微任务的执行在宏任务的同步任务之后，在异步任务之前。

Node与浏览器 EventLoop的差异


- 请说出下面代码的执行顺序

```javascript
async function async1() {
  console.log(1);
  const result = await async2();
  console.log(3);
}
async function async2() {
  console.log(2);
}

Promise.resolve().then(() => {
  console.log(4);
});

setTimeout(() => {
  console.log(5);
});

async1();

console.log(6);
```

解答：[1,2,6,4,3,5]。这道题目主要考对 JS 宏任务和微任务的理解程度，JS 的事件循环中每个宏任务称为一个 Tick(标记)，在每个标记的末尾会追加一个微任务队列，一个宏任务执行完后会执行所有的微任务，直到队列清空。上题中我觉得稍微复杂点的在于 async1 函数，async1 函数本身会返回一个 Promise，同时 await 后面紧跟着 async2 函数返回的 Promise， console.log(3)其实是在 async2 函数返回的 Promise 的 then 语句中执行的，then 语句本身也会返回一个 Promise 然后追加到微任务队列中，所以在微任务队列中 console.log(3)在 console.log(4)后面，

第 10 题：（头条）异步笔试题

```javascript
// 写出以下代码的运行结果
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
```
