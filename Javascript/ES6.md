# ES6 
1. let,const
块级作用域：为加强对变量生命周期的控制。存在于：
- 函数内部
- 块中（大括号{ }区域内）

块级声明用于声明在指定块的作用域之外无法访问的变量。let和const都是块级声明的一种。

- 使用let，var或const创建的变量之间有什么区别？
1. let，const声明的变量，只在当前代码块中有效
2. 不存在变量提升，必须在声明后才能使用
3. 不允许重复声明
4. var声明的全局变量，是顶层对象的属性，let和const声明的不是

- 暂时性死区

let和const声明的变量不会被提升到作用域顶部。只要块级作用域内存在let命令，它声明的变量就绑定这个作用域，形成封闭作用域，外界对变量没有影响。凡声明之前使用这些变量就会报错。即声明变量之前，都是该变量的死区。 

因为Javascript引擎在代码执行之前，会扫描代码，在块级作用域扫描发现变量声明时，要么将它们提升到作用域顶部（遇到var)，要么将声明放到TDZ中（遇到let和const），访问TDZ中的变量会触发运行时错误，只有执行过变量声明语句后，变量才会从TDZ中移出，然后方可访问。

const声明常量（只读的常量），一旦声明就必须初始化，因为后面不能修改，对引用类型，只保证指针指向固定的地址，但指向的数据结构是可变的。

- 循环中的块级作用域
```javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3
```
解决方案：闭包
```javascript
var funcs = [];
for(var i = 0; i < 3; i++) {
  funcs[i] = (function (i) {
    return function() {
      console.log(i)
    }    
  }(i))
}
funcs[0]();//0
```
解决方案：let
```javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3
```
问题：let不提升，不能重复声明，不能绑定全局作用域。
```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
在for循环中使用let和var，底层会使用不同的处理方式。
使用let时，在`for(let i = 0; i < 3; i++)`中，圆括号之内建立一个隐藏的作用域，所以以上程序不报错。

然后，每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化，
```javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```
就相当于
```javascript
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
```
当执行函数时，根据词法作用域就可以找到正确的值，其实也可以理解为let声明模仿了闭包的做法来简化循环过程。

改成var以后：
```javascript
for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
// abc
```
因为i变为'abc'，'abc'++为NAN，而'abc'++ < 3返回false，退出循环

如果改成const？
```javascript
var funcs = [];
for (const i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // Uncaught TypeError: Assignment to constant variable.
```
虽然每次都创建了一个新的变量，但我们却在每次迭代中尝试修改const的值，所以最终会报错。

for in 循环
```javascript
var funcs = [], object = {a: 1, b: 1, c: 1};
for (var key in object) {
    funcs.push(function(){
        console.log(key)
    });
}

funcs[0]() // 'c'
```
把var改成let，结果为'a'，改成const，还是打印'a'，因为for in循环中，每次迭代不会修改已有的绑定，而是会创建一个新的绑定。

- 最佳实践
默认使用const，只有当确实需要改变变量的值时才使用let。因为大部分的变量的值在初始化后不应再改变。

2. 模板字符串

ES6模板文法在生成字符串方面提供了很大的灵活性。

基础用法：
在字符串中如果要用反撇号，可以用反斜杠转义；
模板字符串中，空格，缩进，换行都会被保留；

- 嵌入变量
支持嵌入变量，只需将变量名写在${}中，不止变量，还可以嵌入任意Javascript表达式，可以进行运算，可以引用对象的属性

可以嵌套

可以调用函数

- 标签模板

模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。
```javascript
let x = 'Hi',y='Kevin';
var res = message`${x},I am ${y}`;

function message(literals,...values) {
  console.log(literals)//["",",I am",""]
  console.log(values[0])// Hi
  console.log(values[1])// Kevin

  // 将参数拼回去--方法1
  let result = ''

  for(let i=0;i<values.length;i++) {
    result += literals[i]
    result += values[i]
  }
  result += literals[literals.length - 1]
  return result

  // 将参数拼回去--方法2
  let result = literals.reduce((prev,next,i) => {
    let value = values[i-1];
    return prev + value + next
  })

  return result
}

```


注：当大括号中的值不是字符串时，会将其转为字符串，如数组[1,2,3]就会被转为1,2,3

- 你能给出一个解构（destructuring ）对象或数组的例子吗？
允许按一定模式，模式匹配，从数组和对象中提取值，对变量进行赋值

- 使用扩展语法有什么好处？它与rest语法有什么不同？
rest语法，用于获取函数的多余参数，rest参数搭配的变量是一个数组，可以直接用数组的方法。

只能是最后一个参数，函数的length属性不包括rest

- 你使用过 Promises 及其 polyfills 吗? 请写出 Promise 的基本用法（ES6）。
new Promise((resolve,reject) {
  if(...) resolve()
  else reject()
}).then((val)=>{},(err)=>{})
.catch((err)=>{
  
})

- 所有的 ES6 特性你都知道吗？如果遇到一个东西不知道是 ES6 还是 ES5, 你该怎么区分它
- es6的继承和es5的继承有什么区别
- promise封装ajax
- es6 generator 是什么，async/await 实现原理
- ES6和node的commonjs模块化规范区别
CommonJS是一种模块规范，成为Node.js的模块规范，ES6之前，前端也实现了一套相同的模块规范，如AMD，用来对前端模块进行管理。

ES6引入了一套新的模块规范，在语言标准层面上实现了模块功能，且实现得很简单，有望成为浏览器和服务器通用的模块解决方案。目前浏览器对ES6模块兼容性还不太好，在webpack中使用的export和import，会经过Babel转换为CommonJS规范。使用上的区别有：

1. CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用

import读入的变量都是只读的，不允许修改，但可以改变变量的属性；

内部的所有变量要用export导出，与其对应的值是动态绑定的关系，取到的是实时值；而CommonJS输出的是值的缓存，不存在动态更新

2. commonjs的模块是**运行时加载**的，（整体加载模块，生成一个对象，再从对象上获取属性和方法。CommonJS模块就是对象）；
  ESS6模块是**静态加载**的，在**编译时就完成模块加载**，编译时输出接口。（效率更高，且模块不是对象）
3. CommonJS是单个值导出，ES6模块可以导出多个
4. ES6模块是静态语法，import必须在模块的顶层（会被JS引擎静态分析，先于其他语句执行，)；
而CommonJS是动态语法，可以写在判断里（require是动态加载，只有运行时才知道加载的是什么模块，所以可以放在任何地方）

- 异步编程各个优缺点，使用 Promises 而非回调 (callbacks) 优缺点是什么？generator,Promise,async/await比较
- 怎么将一个异步方法promise化，以及实现promise.all()方法，promise.then 的调用，promise封装setstate
- 如何将一个同步函数包装为异步函数
- fetch取消



- ES6类class和ES5函数构造函数（function constructors）之间有什么区别？
- 你能为新的arrow =>j箭头函数语法提供一个用例吗？ 这种新语法与其他函数有何不同？

箭头函数可以简化回调函数
箭头函数的this的指向：箭头函数本身没有this对象，它的this对象是它的定义生效时所在的对象，即定义时外部代码块的this

而不是执行时所在的对象

不可以当构造函数，因为没有this
不可以使用arguments对象，只能用rest参数

- 在构造函数中的方法中使用箭头语法有什么优势？



- babel是如何将es6代码编译成es5的
  babel如何编译let和const（ES6深入系列）

  Babel直接将let编译成了var

  如果作用域内外都有同名变量，则改变变量名，使内外层的变量名称不一样
  ```javascript
  let value = 1;
{
    let value = 2;
}
value = 3;
编译为：
var value = 1;
{
    var _value = 2;
}
value = 3;
  ```
const修改值时报错，重复声明报错，Babel在编译时直接报错。

对于循环中的let声明：
```javascript
var funcs = [];
for (let i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```
Bebel会编译成：
```javascript
var funcs = [];

var _loop = function _loop(i) {
    funcs[i] = function () {
        console.log(i);
    };
};

for (var i = 0; i < 10; i++) {
    _loop(i);
}
funcs[0](); // 0
```

- 说出ES6中使用this的不同
- proxy