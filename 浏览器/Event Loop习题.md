

```javascript
console.log('start') //1. console.log加入到调用栈中，控制台输出，从调用栈弹出
setTimeout(() => {console.log('timeout')}, 0) // 2. setTimeout弹入到调用栈中，它的回调函数被添加到Web API，直到计时器完成计时。即使时间为0，在它被添加到宏任务队列之后，回调还是会被首先推入Web API
Promise.resolve('Promise').then(res => console.log(res)) // 3. Promise.resolve被添加到调用栈，在resolve之后，它的then中的回调函数被添加到微任务队列
console.log('end') // 4. console.log加入到调用栈中，控制台输出，从调用栈弹出

// 5. 此时调用栈为空，去检查微任务队列中是否有在排队的任务。此时Promise的then的回调正在微任务队列中，弹入调用栈，控制台输出，从调用栈弹出
// 6. 调用栈和微任务队列都为空，检查宏任务队列，setTimeout的回调正在宏任务队列中，被弹入调用栈，回调函数返回console.log，控制台输出，从调用栈弹出
```
打印顺序：
start
end
Promise
timeout

Async/Await的情况：
```javascript
const one = Promise.resolve('one')
async function myFunc () {
  console.log('in function')  // 1. 打印第一行'in function'
  const res = await one() // 2. 遇到await关键字，函数one被弹入调用栈，并返回一个resolved的promise。
  console.log(res)
}

console.log('before function')
myFunc() // 调用函数
console.log('after function')
```
打印顺序：
before function
in function
after function
one

await关键字会使异步函数在执行promise的时候被暂停，之后的内容在promise被resolve后，在then方法的onFulfilled函数（then的第一个参数，回调函数）执行时继续执行，所以async函数中剩余的代码会在微任务中运行，而不是一个常规任务。

遇到await时，异步函数myFunc被暂停，JS引擎跳出异步函数，并在异步函数被调用的执行上下文中继续执行代码。等调用的执行上下文中没有更多任务时，去检查微任务队列，在resolve了one的值以后，异步函数myFunc开始排队，myFunc被弹出调用栈中，在它之前中断的地方继续运行。

区别：使用Promise的then方法的话，promise的主体将会被继续执行。而await关键字则暂停了async函数。

解答：[1,2,6,4,3,5]。这道题目主要考对 JS 宏任务和微任务的理解程度，JS 的事件循环中每个宏任务称为一个 Tick(标记)，在每个标记的末尾会追加一个微任务队列，一个宏任务执行完后会执行所有的微任务，直到队列清空。上题中我觉得稍微复杂点的在于 async1 函数，async1 函数本身会返回一个 Promise，同时 await 后面紧跟着 async2 函数返回的 Promise， console.log(3)其实是在 async2 函数返回的 Promise 的 then 语句中执行的，then 语句本身也会返回一个 Promise 然后追加到微任务队列中，所以在微任务队列中 console.log(3)在 console.log(4)后面，


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

// 1 2 6 4 3 5
```
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

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```
