

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
第 56 题：要求设计 LazyMan 类，实现以下功能。

```javascript
LazyMan("Tony");
// Hi I am Tony

LazyMan("Tony").sleep(10).eat("lunch");
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan("Tony").eat("lunch").sleep(10).eat("dinner");
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan("Tony")
  .eat("lunch")
  .eat("dinner")
  .sleepFirst(5)
  .sleep(10)
  .eat("junk food");
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```
考察如何组合多个Promise和链式调用。

可以用数组将sleep, eat等函数暂存，同时为了能链式调用，所以每个函数需返回Promise对象。

根据事件循环机制，用setTimeout来执行数组中的方法，在定时器的回调函数中，相关的事件已经添加到数组中了。链式执行数组中的方法前，需要构建一个Promise对象来执行then方法，可以通过Promise.resolve()返回一个Promise对象

```javascript
function lazyMan(name) {
    this.task = [];
    this.task.push(() => {
        return new Promise(res => {
            console.log('name:' + name);
            res()
        })
    })
    let run = () => {
        let sequence = Promise.resolve()
        for (const func of this.task) {
            sequence = sequence.then(()=>func())
        }
    }
    setTimeout(() => {run()}, 0)
    this.eat = (str) => {
        this.task.push(() => {
            return new (res => {
                console.log('eat:' + str);
                res()
            })
        })
        return this;
    }
    this.sleep = (time) => {
        this.task.push(() => {
            return new Promise(res => {
                setTimeout(() => {
                    console.log(`Wake up after ` + time);
                    res()
                }, time)
            })
        })
        return this;
    }
    this.sleepFirst = (time) => {
        this.task.unshift(() => {
            return new Promise(res => {
                setTimeout(() => {
                    console.log(`sleepFirst up after ` + time);
                    res()
                }, time)
            })
        })
        return this;
    }
    return this;
}
```

通过什么做到并发请求，并发请求资源数上限（6个）
写一个函数，可以控制最大并发数
1. function request(urls, maxNumber, callback) 要求编写函数实现，可以批量请求数据，所有的 URL 地址在 urls 参数中，根据urls数组内的url地址进行并发网络请求，最大并发数maxNumber,当所有请求完毕后调用callback函数(已知请求网络的方法可以使用fetch api)

任务队列可不断添加异步任务，但同时只能处理maxNumber个任务，执行完后才能执行下一组，任务队列为空时暂停执行，当有新任务加入则自动执行。
```javascript
const maxNumber = 5
class RunQune{
    constructor(){
        this.list = []; // 任务队列
        this.target = maxNumber; // 并发数量
        this.flag = false; // 任务执行状态
        this.time = Date.now()
    }
    async sleep(time){
        return new Promise(res => setTimeout(res,time))
    }
    // 执行任务
    async run(){
        while(this.list.length>0){
            this.flag = true;
            let runList = this.list.splice(0,this.target);
            this.time = Date.now()
            await this.runItem(runList)
            await this.sleep(300) // 模拟执行时间
        }
        this.flag = false;
    }
    async runItem(list){
        return new Promise((res)=>{
            while(list.length>0){
                const fn = list.shift();
                fn().then().finally(()=>{
                    if(list.length === 0){
                        res()
                    }
                })
            }
        })
    }
    // 添加任务
    push(task){
        this.list.push(...task);
        !this.flag && this.run()
    }
}
```
如果不需要等待一组完成再执行下一组，只要并发量没有满，就可以加入新的任务执行，实现的思路没太大变化，在 finally 中改为新增任务。

- 期望id按顺序打印 0 1 2 3 4 ，且只能修改 start 函数
```javascript
function start(id) {
    execute(id)
}
for (let i = 0; i < 5; i++) {
    start(i);
}
function sleep() {
    const duration = Math.floor(Math.random() * 500);
    return new Promise(resolve => setTimeout(resolve, duration));
}
function execute(id) {
    return sleep().then(() => {
        console.log("id", id);
    });
}
```
id 的打印是个异步事件，在 setTimeout 回调执行，按照上面的代码，谁的倒计时先结束，id就先打印，那么想要id按顺序打印，就需要将多个异步事件同步执行，promise 的链式调用可以派上用场。代码如下
```javascript
function start(id) {
    // execute(id)
    // 第一种：promise 链式调用，execute 函数返回的就是 promise ，所以可以利用这一点，通过 promise.then 依次执行下一个打印
    this.promise = this.promise ? this.promise.then(()=>execute(id)) : execute(id)

    // 第二种：先用数组存储异步函数，利用事件循环的下一个阶段，即 setTimeout 的回调函数中执行 promise 的链式调用，这方法本质上和第一种是一样的
    this.list = this.list ? this.list : []
    this.list.push(() => execute(id))
    this.t;
    if (this.t) clearTimeout(this.t)
    this.t = setTimeout(() => {
        this.list.reduce((re, fn) => re.then(() => fn()), Promise.resolve())
    })

    // 第三种：数组存储id的值，在通过 await 异步执行 execute 函数
    this.list = this.list ? this.list : []
    this.list.push(id)
    clearTimeout(this.t)
    this.t = setTimeout(async () => {
        let _id = this.list.shift()
        while (_id !== undefined) {
            await execute(_id);
            _id = this.list.shift()
        }
    })
}
```