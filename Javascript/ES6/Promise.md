对async、await的理解，内部原理,Async/Await怎么实现
Async/Await 如何通过同步的方式实现异步
使用Async会注意哪些东西
Async里面有多个await请求，可以怎么优化（请求是否有依赖）
async + await: 异步编程的终极方案 promise + generator的语法糖

介绍下Promise，Promise有几个状态,内部实现,异常捕获,用途和性质;特性,精髓，以及优缺点
Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？
Promise 链式调用的时候怎么终止它?
promise如何实现then处理
promise里面和then里面执行有什么区别
模拟实现一个 Promise.finally
设计并实现 Promise.race()
Promise.all 使用、原理实现及错误处理,如何设计Promise.all()
promiseAll如何实现,以及如何实现多层异步回调?
Promise接收的函数中resolve()后的代码是否会执行
promise封装ajax

promise、async/await 都问比较多，包括比较火的问打印顺序那种题还有捕获异常的问题，只要对语法非常熟悉加上稍微了解实现细节都是没问题。

JS 异步解决方案的发展历程以及优缺点，异步编程四种方法以及优缺点
JS怎么实现异步,如何处理异常捕获
JS执行过程中分为哪些阶段,异步整个执行周期
JS为什么要区分微任务和宏任务，介绍宏任务和微任务
使用回调、promise、await 和 async 处理异步调用；
Promise有没有解决异步的问题（promise链是真正强大的地方）
promise 和 async/await 和 callback的区别
Promise和Async处理失败的时候有什么区别
promise、async await、Generator的区别
Promise和setTimeout的区别（Event Loop, 执行先后的区别）

Promise的错误如果统一捕获？
Promise中的ajax 可以try catch 到么？
用Promise.race 再外面自己封装一层

a，b两个按钮，点击aba，返回顺序可能是baa，如何保证是aba（Promise.then）

promise对象, 异步编程的解决方案

- 你使用过 Promises 及其 polyfills 吗? 请写出 Promise 的基本用法（ES6）。
new Promise((resolve,reject) {
  if(...) resolve()
  else reject()
}).then((val)=>{},(err)=>{})
.catch((err)=>{

})

- promise封装ajax
- es6 generator 是什么，async/await 实现原理
- 异步编程各个优缺点，使用 Promises 而非回调 (callbacks) 优缺点是什么？generator,Promise,async/await比较
- 怎么将一个异步方法promise化，以及实现promise.all()方法，promise.then 的调用，promise封装setstate
- 如何将一个同步函数包装为异步函数

手动实现符合 Promise/A+规范的 Promise、手动实现 async await

手写实现Promise，一般先把框架搭好，边写边讲解
Promise链式，实现必须上一个异步完成后再去跑下一个任务
实现promise.all
实现promise.retry
将一个同步callback包装成promise形式
- 代码实现中断 Promise 的运行

讨论与 Promise 相关的问题。
- 提示：及早求值（eager evaluation），尴尬的取消机制，用 then() 方法伪装 map() 和 flatMap() 等。