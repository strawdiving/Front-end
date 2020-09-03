ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。ES6一般是指 ES2015 标准，有时也是泛指“下一代 JavaScript 语言”。

Node.js是Javascript的服务器运行环境（runtime）
# ES6
1. var、let 和 const 区别,及其实现原理是什么，let块作用域是怎么实现的；全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？
   let/const 也存在变量声明提升，只是没有初始化分配内存。 一个变量有三个操作，声明(提到作用域顶部)，初始化(赋默认值)，赋值(继续赋值)。

    1. var  是一开始变量声明提升，然后初始化成 undefined，代码执行到那行的时候赋值。
    2. let  是一开始变量声明提升，然后没有初始化分配内存，代码执行到那行初始化，之后对变量继续操作是赋值。因为没有初始化分配内存，所以会报错，这是暂时性死区。
    3. const  是只有声明和初始化，没有赋值操作，所以不可变。
    const 只是保证了指向的内存地址不变，而不是内部数据结构不变。确保不会被其他类型的值所替代。

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

- 所有的 ES6 特性你都知道吗？如果遇到一个东西不知道是 ES6 还是 ES5, 你该怎么区分它
- ES5/ES6 的继承除了写法以外还有什么区别？
- ES6类class和ES5函数构造函数（function constructors）之间有什么区别？ES6 class原理，class语法，构造函数的语法糖
- 你能为新的arrow =>j箭头函数语法提供一个用例吗？ 这种新语法与其他函数有何不同？箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？介绍箭头函数的this ，在构造函数中的方法中使用箭头语法有什么优势？

箭头函数可以简化回调函数
箭头函数的this的指向：箭头函数本身没有this对象，它的this对象是它的定义生效时所在的对象，即定义时外部代码块的this

而不是执行时所在的对象

不可以当构造函数，因为没有this
不可以使用arguments对象，只能用rest参数

- babel是如何将es6代码编译成es5的，ES6 代码转成 ES5 代码的实现思路是什么，ES6转成ES5的常见例子
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

- ES5和ES6有什么区别，用过ES6的哪些新特性，再针对你所回答的进行深入的提问。
   1. 字符串, 数组, 对象 扩展的api
   2. 变量扩展: 解构赋值 块级作用域
   3. 函数扩展: 箭头函数 默认参数, rest参数
   4. 展开运算符, 模板字符串
   6. 迭代器和生成器函数 next 和 yield的理解
   7. proxy对象  属性代理器: 属性的读取（get）和设置（set）相关操作
   ES6中使用this的不同
   Set、Map、WeakSet 和 WeakMap 的区别？ES6中的map和原生的对象有什么区别