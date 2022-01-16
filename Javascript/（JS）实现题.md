1. 使以下代码正常运行

```javascript
const a = [1, 2, 3, 4, 5];
// implement this
a.multiply();
console.log(a); // [1,2,3,4,5,1,4,9,16,25]
```

2. 0.1+0.2===0.3 为何返回 false
4. 解决以下异步代码问题
   检索并计算属于同一教室中每个学生的平均分数，例子中教室 ID 为 75。每个学生可以在一年内参加一门或多门课程。以下 API 可用于检索所需数据。

```javascript
// get list of all students
GET /api/students
Response:
[
  {
    "id": 1,
    "name": "John",
    "classRoomId": 75
  }
]

// get courses for given a student
GET /api/courses?filter=studentId eq 1
Response:
[
  {
    "id": "history",
    "studentId": 1
  },
  {
    "id": "algebra",
    "studentId": 1
  }
]

// get evaluation for each course
GET /api/evaluation/history?filter=studentId eq 1
Response:
[
  {
    "id": 200,
    "score": 50,
    "totalScore": 100
  }
]
```

编写一个接受教室 ID 的函数，并根据该函数计算该教室中每个学生的平均值。该函数的最终输出应该是带有平均分数的学生列表

[
{ "id": 1, "name": "John", "average": 70.5 },
{ "id": 3, "name": "Lois", "average": 67 },
】

使用普通回调，promises，observables，generator 或 async-wait 编写所需的函数。 尝试使用至少 3 种不同的技术解决这个问题。

4. 使用 Javascript Proxy 实现简单的数据绑定

提示：ES Proxy 允许你拦截对任何对象属性或方法的调用。首先，每当更改底层绑定时，都应更新 DOM

5. 解释 Javascript 并发模型
   是否熟悉 Java 等其他编程语言中使用的任何其他并发模型？提示：事件循环，任务队列，调用栈，堆等。

6. Javascript 中有哪些不同的函数调用模式，详细解释

四种模式：函数调用，方法调用，call(), apply()
call 和 apply 的区别是什么，哪个性能更好一些

7. new 关键字的作用

在 Javascript 中，new 是用于实例化对象的运算符。另，要注意[[Construct]]和[[Call]]

8. JavaScript 中的迭代器（iterators）和迭代（iterables）是什么？ 你知道什么是内置迭代器吗？

9. 如何在 JSON 中序列化以下对象？如果我们将以下对象转换为 JSON 字符串，会发生什么？

```javascript
const a = {
  key1: Symbol(),
  key2: 10,
};

// what will happen
console.log(JSON.stringify(a));
```

10. 你熟悉 Typed Arrays 吗？ 如果熟悉，请解释他们与 JavaScript 中的传统数组相比的异同？

11. 默认参数如何工作？

如果我们在调用 makeAPIRequest 函数时必须使用 timeout 的默认值，那么正确的语法是什么？

```javascript
function makeAPIRequest(url, timeout = 200, headers) {
  // some code to fetch data
}
```

第 2 题：`['1', '2', '3'].map(parseInt)` what & why ?
  结果：[1, NaN, NaN]
  `['1', '2', '3'].map((item, index) => parseInt(item, index))`
  实际调用的是parseInt(string, radix)
第 65 题：`a.b.c.d` 和 `a['b']['c']['d']`，哪个性能更高？
第 72 题：为什么普通 `for` 循环的性能远远高于 `forEach` 的性能，请解释其中的原因。
第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣
Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

第 5 题：介绍下深度优先遍历和广度优先遍历，如何实现？
第 6 题：请分别用深度优先思想和广度优先思想实现一个拷贝函数？
第 95 题：模拟实现一个深拷贝，并考虑对象相互引用以及 Symbol 拷贝的情况

第 31 题：改造下面的代码，使之输出 0 - 9，写出你能想到的所有解法。

```javascript
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

第 33 题：下面的代码打印什么内容，为什么？

```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b); // 20
})();
```

第 34 题：简单改造下面的代码，使之分别打印 10 和 20

```javascript
var b = 10;
// console.log(b)
(function b() {
  b = 20;
  console.log(b);
})();
```

第 41 题：下面代码输出什么

```javascript
var a = 10;
(function () {
  console.log(a); // undefined
  a = 5;
  console.log(window.a); // 10
  var a = 20;
  console.log(a); // 20
})();
```

第 46 题：输出以下代码执行的结果并解释为什么

```javascript
var obj = {
  2: 3,
  3: 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj.push(1);
obj.push(2);
console.log(obj);
```

第 53 题：输出以下代码的执行结果并解释为什么

```javascript
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

// a: { n: 2 }, b: { n:1, x: { n:2 } } }

console.log(a.x); // undefined
console.log(b.x); // { n:2 }
```

第 50 题：（百度）实现 (5).add(3).minus(2) 功能。
例：5 + 3 - 2，结果为 6
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

第 84 题：请实现一个 add 函数，满足以下功能。
add(1); // 1
add(1)(2); // 3
add(1)(2)(3)；// 6
add(1)(2, 3); // 6
add(1, 2)(3); // 6
add(1, 2, 3); // 6


第 98 题：（京东）写出如下代码的打印结果

```javascript
function changeObjProperty(o) {
  o.siteUrl = "http://www.baidu.com";
  o = new Object();
  o.siteUrl = "http://www.google.com";
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl); // "http://www.baidu.com"
```

第 100 题：（京东）请写出如下代码的打印结果

```javascript
function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  this.a = function () {
    console.log(2);
  };
}
Foo.prototype.a = function () {
  console.log(3);
};
Foo.a = function () {
  console.log(4);
};
Foo.a(); // 4
let obj = new Foo();
obj.a(); // 2
Foo.a(); // 1
```

第 42 题：（喜马拉雅）实现一个 sleep 函数
比如 sleep(1000) 意味着等待 1000 毫秒，可从 Promise、Generator、Async/Await 等角度实现

- 说出以下打印结果

```javascript
let a = { a: 10 };
let b = { b: 10 };
let obj = {
  a: 10,
};
obj[b] = 20;
console.log(obj[a]);
```

解答： 20；
考察 JS 数据类型，ES6 中属性名表达式。在上题中 obj[b]=20 的赋值操作后， obj 其实已经变成了 {a:10,[objectObject]:20}，这是因为如果属性名表达式是一个对象的话，那么默认情况下会自动将对象转为字符串 [objectObject]，最后一步获取 obj[a]时，a 本身也是一个对象，所以会被转换为获取 obj[objectObject]也就是上一步赋值的 20。

第 76 题：输出以下代码运行结果

```javascript
// example 1
var a={}, b='123', c=123;
a[b]='b';
a[c]='c';
console.log(a[b]); // 'c'

---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');
a[b]='b';
a[c]='c';
console.log(a[b]); // 'b'

---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};
a[b]='b';
a[c]='c';
console.log(a[b]); // 'c'
```

- 说出以下代码的执行结果
```javascript
var a =10
var obj = {
  a: 20,
  say: function () {
    console.log(this.a) //20
  }
}
obj.say()
```
如何输出10
```javascript
// 方式一
var a = 10
var obj = {
  a: 20,
  say: () => {
    console.log(this.a)
  }
}
obj.say()

// 方式2
加一个obj.say.call(this)

// 方式3
var say = obj.say //创建一个临时变量存放函数定义，然后单独调用
say()
```

- 以下代码的执行结果
```javascript
parseInt('2017-07-01') //2017
parseInt('2017abcdef') //2017
parseInt('abcdef2017') //NaN
```

- 实现一个函数判断数据类型
```javascript
 function getType(obj) {
   if (obj === null) {
     return String(obj)
   }
   return typeof obj === 'object' ? Object.prototype.toString.call(obj).replace('[object ]', '').replace(']', '').toLowerCase() : typeof obj
 }
```

- 手动封装一个请求函数，可以设置最大请求次数，请求成功则不再请求，请求失败则继续请求直到超过最大次数

```javascript
function request(url, body, successCb, errorCb, maxCount=3) {
  return fetch(url,body).then(response => successCb(response))
                        .catch(err => {
                          if (maxCount <= 0) {
                            return errorCb('请求超时')
                          }
                          return request(url,body,successCb,errorCb, --maxCount)
                        })
}

request('https://some/path',
  { method: 'GET' },
  (response) => { console.log(response.json())},
  (err) => { console.log(err)}
})
```
-
```javascript
var a = {x:1};
var b  = a;
a.x = a = {n:1};
console.log(a);
console.log(b)
```
怎么赋值的，基本数据类型和复杂数据类型的不同，typeof 能正确判断数据类型吗，怎么正确判断数据类型

实现 sum 函数
```javascript
sum(1)(2)(3) == 6; // true
sum(1, 2, 3) == 6; // true
```
实现 sum2 函数
```javascript
console.log(sum2(1)(2)(3)()) // 6
console.log(sum2(1, 2, 3)()); // 6
```
- 实现 co 函数
- 实现以下功能，当对一个 arr 做 push 操作时，会自动打印一行提示消息
```javascript
const arr = [1,2,3];
arr.push(4);
// arr pushed a new element: 4
```

- 为 Test 类添加方法，打印指定内容
```javascript
class Test {
    constructor() {
        this.person = { name: "jack", age: 38, position: "CTO" };
    }
    // ......
}

const test = new Test();
for (const ele of test) {
    console.log(ele);
}
// [ 'name', 'jack' ]
// [ 'age', 38 ]
// [ 'position', 'CTO' ]
```
- 实现 handler 函数，遇到 b 和 ac 都要去除
```javascript
console.log(handler("aabaa")); // 'aaaa'
console.log(handler("abaccbc")); // 'c'
console.log(handler("aaccc")); // 'c'
console.log(handler("aaabccc")); // ''
```

- 实现 decode 函数
```javascript
decode('HG[3|B[2|CA]]F') === 'HGBCACABCACABCACAF' // true
```

- 实现 _bind 函数，使打印 success
```javascript
function Animal(name, color) {
  this.name = name;
  this.color = color;
}
Animal.prototype.say = function() {
  return `I'm a ${this.color} ${this.name}`;
};
const Cat = Animal._bind(null, "cat");
const cat = new Cat("white");
if (
  cat.say() === "I'm a white cat" &&
  cat instanceof Cat &&
  cat instanceof Animal
) {
  console.log("success");
}
```
- 说出以下打印内容
```javascript
console.log(-1 >>> 32);
console.log(-1 << 32);
console.log(1 >> 32);
console.log(5 >>> 2);

var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };
console.log(a.x);
console.log(b.x);
```

如何对请求进行缓存，例如有10个异步请求，如果有一个异步请求返回结果剩下的请求就用这个结果，并且能过传入成功和失败的回调函数

```javascript
function Person() {}
const person = new Person();
```
person的原型上有Funciton吗

实现(10).add(10).add(10)

实现一个函数,该函数接收一个obj, 一个path, 一个value，实现obj[path] = value，obj类似json格式
reduce实现map
实现一个函数，每隔wait秒执行func，一共执行times次

```javascript
let arr = [1, 2, 3];
let fnArray = [];
for (var i = 0; i < arr.length; i++) {
    fnArray[i] = function () {
        return arr[i] * 2;
    }
}
let result = fnArray.find((fn) => {
    return fn() === 4;
})
console.log(result);
```

写一个url解析函数，包括hash

如何对请求进行缓存，例如有10个异步请求，如果有一个异步请求返回结果，剩下的请求就用这个结果，并且能够传入成功和失败的回调函数

- 如何实现下列代码：
 [1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]

如何保证一次只能并发10个任务~（用JavaScript实现指定数量的并发限制）

```javascript
let arr = [1, 2, 3];
let fnArray = [];
for (var i = 0; i < arr.length; i++) {
    fnArray[i] = function () {
        return arr[i] * 2;
    }
}
let result = fnArray.find((fn) => {
    return fn() === 4;
})
console.log(result);

```
setInterval需要注意的点，使用 setTimeout实现 setInterval

- 如果自己写个转发中间件，思路是什么？
实现 deepClone，要求能成功克隆带有循环引用的对象
多种方式实现深拷贝、对比优缺点; 实现一个deepClone需要兼容set、map、symbol、object；深浅clone，以及优化方案

通过什么做到并发请求，并发请求资源数上限（6个）
手写防抖和节流（防抖debounce和节流throttle）工具函数、并理解其内部原理和应用场景
打印出来html里所有标签
实现一个lazyMan

多种方式实现数组去重、扁平化、对比优缺点
- 数组去重的方法

```javascript
let originalArray = [1,2,3,4,5,3,2,4,1]

// 方式1
const result = Array.from(new Set(originalArray))
// -> [1, 2, 3, 4, 5]

// 方式2
const result = []
const map = new Map()

for (let v of originalArray) {
  if (!map.has(v)) {
    map.set(v,true)
    result.push(v)
  }
}
// -> [1, 2, 3, 4, 5]

// 方式3
const result = []
for (let v of originalArray) {
  if (!result.includes(v)) {
    result.push(v)
  }
}
// -> [1, 2, 3, 4, 5]

// 方式4

for (let i=0; i<originalArray.length; i++) {
  for (let j=i+1; j<originalArray.length; j++) {
    if (originalArray[i] === originalArray[j]) {
      originalArray.splice(j,1)
      j--
    }
  }
}
// -> [1, 2, 3, 4, 5]

// 方式5
const obj = {}
const result = originalArray.filter(item => obj.hasOwnProperty(typeof item+item) ? false: (obj[typeof item+item] = true))
}
```
- 对象数组如何去重？
心里想着每个对象的内存地址本身就不一样，去重的意义何在，非要去重的话，那只能通过 JSON.stringify序列化成字符串(这个方法有一定的缺陷)后进行对比，或者递归的方式进行键-值对比，但是对于大型嵌套对象来说还是比较耗时的.

根据每个对象的某一个具体属性来进行去重，因为考虑到服务端返回的数据中可能存在id重复的情况，需要前端进行过滤，如下：
```javascript
const list = [
  {id:1, a:1},
  {id:2, a:2},
  {id:3, a:3},
  {id:1, a:4},
]
const result = list.reduce((acc,cur) => {
  const ids = acc.map(item => item.id)
  return ids.includes(cur.id) ? acc : [...acc,cur]
}, [])
```

数组乱序
手写call、apply、bind
- 手动实现一个bind
```javascript
Function.prototype.bind = function(context,...args1) {
  if (typeof this !== 'function) {
    throw new Error('not a function')
  }
  let fn = this
  let resFn = function(...args) {
    return fn.apply(this instanceof resFn ? this : context, args1.concat(args2))
  }

  const DumpFunction = function DumpFunction() {}
  DumpFunction.prototype = this.prototype
  resFn.prototype = new DumpFunction()

  return resFn
}
```
继承（ES5/ES6）
写一个函数，可以控制最大并发数
jsonp的实现
eventEmitter实现事件发布、订阅, eventBus(先把框架搭好，包含emit,on,off,once)
实现instanceof
实现new

实现数组flat、filter等方法
第 36 题：使用迭代的方式实现 flatten 函数。

可以说出两种实现双向绑定的方案、可以手动实现；手写 Proxy / Object.defineProperty  要求两者的比较以及如何运用。
3.手写函数柯里化工具函数、并理解其应用场景和优势
5.手写 JSON.stringify、 JSON.parse
6.手写一个模版引擎，并能解释其中原理
7.手写 懒加载、 下拉刷新、 上拉加载、 预加载等效果
什么是防抖和节流？有什么区别？如何实现？
-
```javascript
alert(a)
a();
var a=3;
function a(){
    alert(10)
}
alert(a)
a=6;
a();
```
运行结果：
1.函数声明优先于变量声明，所以，刚开始，a就是function a(){alert(10)} ，就会看到这个函数。
2.a()，执行函数，就是出现alert(10)
3.执行了var a=3; 所以alert(a)就是显示3
4.由于a不是一个函数了，所以往下在执行到a()的时候， 报错。

```javascript
alert(a)
a();
var a=3;
var a=function(){
    alert(10)
}
alert(a)
a=6;
a();
```
考点：第一变量声明提前，第二函数声明优先于变量声明！

1.undefined
2.报错
在之前说过，预解析是把带有var和function关键字的事先声明，但不会赋值。所以一开始是undefined，然后报错是因为执行到a()的时候，a并不是一个函数。

```javascript
//函数表达式，和变量声明同等
var a=function(){
    alert(10)
}
//函数声明，优于变量声明
function a(){
    alert(10)
}
```
实现一个方法，参数是一个generator函数，执行结果是执行完所有generator中的yield

7. [1,2,3].map(parseInt) 执行结果
1、实现sum(1)(2)(3).valueOf()，实现这么一个sum函数，返回6
3. 实现（10）.add(10).add(10) 函数柯里化？
2.taskSum(1000,()=>{console.log(1)}).task(1200,()=>{console.log(2)}).task(1300,()=>{console.log(3)})，这里等待1s，打印1，之后等待1.2s，打印2，之后打印1.3s，打印3

1、多空格字符串格式化为数组
日期转化为2小时前，1分钟前等、固定日期与当前时间格式化处理；输入一个日期 返回几秒前 几天前或者几月前；
倒计时功能
换行字符串格式化

写一个url解析函数，包括hash
1. function request(urls, maxNumber, callback) 要求编写函数实现，可以批量请求数据，所有的 URL 地址在 urls 参数中，根据urls数组内的url地址进行并发网络请求，最大并发数maxNumber,当所有请求完毕后调用callback函数(已知请求网络的方法可以使用fetch api)
