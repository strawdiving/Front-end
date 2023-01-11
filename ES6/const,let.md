1. var、let 和 const 区别,及其实现原理是什么，let块作用域是怎么实现的；全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？
   let/const 也存在变量声明提升，只是没有初始化分配内存。 一个变量有三个操作，声明(提到作用域顶部)，初始化(赋默认值)，赋值(继续赋值)。

    1. var  是一开始变量声明提升，然后初始化成 undefined，代码执行到那行的时候赋值。
    2. let  是一开始变量声明提升，然后没有初始化分配内存，代码执行到那行初始化，之后对变量继续操作是赋值。因为没有初始化分配内存，所以会报错，这是暂时性死区。
    3. const  是只有声明和初始化，没有赋值操作，所以不可变。
    const 只是保证了指向的内存地址不变，而不是内部数据结构不变，对象包含的值是可以被修改的。确保不会被其他类型的值所替代。

块级作用域：为加强对变量生命周期的控制。存在于：
- 函数内部
- 代码块中（大括号{ }区域内）

块级声明用于声明在指定块的作用域之外无法访问的变量。let和const都是块级声明的一种。

- 使用let，var或const创建的变量之间有什么区别？
1. let，const声明的变量，块级作用域，只在当前代码块中有效
2. let，const声明的变量不存在变量提升，必须在声明后才能使用，如果在声明前使用，会抛出错误（形成了暂时性死区），var不会
3. let，const声明的变量不允许重复声明
4. var声明的全局变量，是顶层对象的属性，let和const声明的不是
5. const声明常量（只读的常量），一旦声明就必须初始化，因为后面不能修改，对引用类型，只保证指针指向固定的地址，但指向的数据结构是可变的。

- 暂时性死区

let和const声明的变量不会被提升到作用域顶部。只要块级作用域内存在let命令，它声明的变量就绑定这个作用域，形成封闭作用域，外界对变量没有影响。凡声明之前使用这些变量就会报错。即声明变量之前，都是该变量的死区，该变量都是不可用的。

因为Javascript引擎在代码执行之前，会扫描代码，在块级作用域扫描发现变量声明时，要么将它们提升到作用域顶部（遇到var)，要么将声明放到TDZ中（遇到let和const），访问TDZ中的变量会触发运行时错误，只有执行过变量声明语句后，变量才会从TDZ中移出，然后方可访问。
（只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。）

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
