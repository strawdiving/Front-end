1. 使以下代码正常运行

```javascript
const a = [1, 2, 3, 4, 5];
// implement this
a.multiply();
console.log(a); // [1,2,3,4,5,1,4,9,16,25]
```

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
]

使用普通回调，promises，observables，generator 或 async-wait 编写所需的函数。 尝试使用至少 3 种不同的技术解决这个问题。

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

第 65 题：`a.b.c.d` 和 `a['b']['c']['d']`，哪个性能更高？

第 5 题：介绍下深度优先遍历和广度优先遍历，如何实现？
第 6 题：请分别用深度优先思想和广度优先思想实现一个拷贝函数？

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

75： 下面代码的输出是什么
```javascript
function Foo() {
    getName = function() {console.log(1)};
    return this;
}
Foo.getName = function() {console.log(2)};
Foo.prototype.getName = function() {console.log(3)};
var getName = function() {console.log(4)};
function getName() {console.log(5)};

Foo.getName(); // 2,直接调用Foo上getName方法，输出2
getName(); // 4, 输出4，getName被重新赋值了
Foo().getName(); // 1
getName();// 1
new Foo.getName();// 2，new 无参数列表，对应的优先级是18；成员访问操作符 . , 对应的优先级是 19。因此相当于是 new (Foo.getName)();  new操作符会执行构造函数中的方法，因此此处输出为2
new Foo().getName(); // 3，new 带参数列表，对应的优先级是19，和成员访问操作符.优先级相同。同级运算符，按照从左到右的顺序依次计算。new Foo()先初始化 Foo 的实 例化对象，实例上没有getName方法，因此需要原型上去找，即找到了 Foo.prototype.getName，输出3
new new Foo().getName();// 3，new 带参数列表，优先级19，因此相当于是 new (new Foo()).getName()；先初始化 Foo 的实例化对象，然后将其原型上的 getName 函数作为构造函数再次 new ，输出3

// 以上代码编译后
function Foo() {
    getName = function() {console.log(1)};
    return this;
}
function getName() {console.log(5)}; //函数优先(函数首先被提升)
var getName;//重复声明，被忽略
Foo.getName = function() {console.log(2)};
Foo.prototype.getName = function() {console.log(3)};
getName = function() {console.log(4)};

```
1. 首先预编译阶段，变量声明与函数声明提升至其对应作用域的最顶端。
2. Foo().getName();执行Foo()，window的getName被重新赋值，返回this;浏览器环境中，非严格模式，this 指向 window，this.getName();输出为1.
  如果是严格模式，this 指向 undefined，此处会抛出错误。
  如果是node环境中，this 指向 global，node的全局变量并不挂在global上，因为global.getName对应的是undefined，不是一个function，会抛出错误。
3. getName();已经抛错的自然走不动这一步了；继续浏览器非严格模式；window.getName被重新赋过值，此时再调用，输出的是1

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
-
```javascript
var a = {x:1};
var b  = a;
a.x = a = {n:1};
console.log(a);
console.log(b)
```
怎么赋值的，基本数据类型和复杂数据类型的不同

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

```javascript
function Person() {}
const person = new Person();
```
person的原型上有Funciton吗

实现一个函数,该函数接收一个obj, 一个path, 一个value，实现obj[path] = value，obj类似json格式

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

- 如何实现下列代码：
 [1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]

- 如果自己写个转发中间件，思路是什么？

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

`['1', '2', '3'].map(parseInt)` what & why ?
  结果：[1, NaN, NaN]
  `['1', '2', '3'].map((item, index) => parseInt(item, index))`
  实际调用的是parseInt(string, radix)

2.taskSum(1000,()=>{console.log(1)}).task(1200,()=>{console.log(2)}).task(1300,()=>{console.log(3)})，这里等待1s，打印1，之后等待1.2s，打印2，之后打印1.3s，打印3

日期转化为2小时前，1分钟前等、固定日期与当前时间格式化处理；输入一个日期 返回几秒前 几天前或者几月前；

7.手写 懒加载、 下拉刷新、 上拉加载、 预加载等效果