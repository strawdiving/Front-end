ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。ES6一般是指 ES2015 标准，有时也是泛指“下一代 JavaScript 语言”。

Node.js是Javascript的服务器运行环境（runtime）
# ES6

## 解构赋值
为简化提取信息，ES6提出了解构，就是将数据结构分解为更小的部分的过程。允许按一定模式，模式匹配，从数组和对象中提取值，对变量进行赋值

解构赋值分类：数组、对象、字符串、数字及布尔值、函数参数的解构赋值

字符串本身也是一个对象，有时候可以当成一个数组解构。

允许使用类似数组或对象字面量的语法将数组和对象的属性赋给各种变量。通过解构，我们可以很容易的把对象的方法复制给变量。

解构赋值允许指定默认值

可以把参数默认值和解构赋值的默认值结合起来使用。

```javascript
function foo (x, y=5) {
    console.log(x,y)
}

foo({}) //undefined, 5
foo({x:1, y:2}) //1, 2
foo() // TypeError:cannot read property 'x' of undefined
```
只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值而生成。

### 1. 解构数组
数组解构，使用变量声明关键字声明一个形参数组，等号后跟一个待解构目标数组。

解构时可以通过留空的方式跳过数组中间的个别元素，但在形参数组中必须留有相应的空位，才可以继续解构之后的元素。如果要跳过的元素处于数组末端，则在形参数组中可以不予留空。

### 2. 解构对象
对象解构与数组解构大体相同，但要注意：

形参对象的属性或方法名必须与待解构对象中的属性或方法名完全相同才能解构到对应的属性或方法。

对象匹配解构，是对象解构的一种延伸用法，可以在形参对象中使用":"来更改解构后的变量名。

```javascript
const obj = {
    first: 'a',
    last: 'b',
    name: 'name'
}

let name = 'name'
let { first, last } = obj
let { name } = obj // uncaught SyntaxError: Identifier 'name' has already been declared
```
通过{}声明变量，告诉JS创建上述变量，然后各自分配属性给对应的first,last。

如果已经声明过变量，我们不能用let或const再次声明同一个变量。

### 3. 函数入参解构
函数入参解构是对象解构的一种延伸用法，可以通过改写入参对象目标值为变量名的方式，在函数内部直接获取到入参对象中某个属性或方法的值。`function example({param: value}) { return value }`

函数入参默认值解构，可以在入参对象的形参属性或方法中使用等号的方式给入参对象的某些属性或方法设定默认值。 `function example({x, y, z = 0}) { return x + y + z }`

- 使用扩展语法有什么好处？它与rest语法有什么不同？
rest语法，形式为“...变量名”，用于获取函数的多余参数，rest参数搭配的变量是一个数组，该变量将多余的参数放入其中，可以直接用数组的方法。

注意，rest参数只能是最后一个参数，之后不能再有其他参数，否则会报错。函数的length属性不包括rest参数。

```javascript
let {a, b, ...rest} = {a:10, b:20, c:30, d:40}
// rest = {c:30, d: 40}
```

- Spread Operator展开运算符

扩展运算符（spread)为“...”，它好比rest参数的逆运算，将一个数组转为用逗号分割的参数序列。

## 函数扩展
箭头函数，默认参数, rest参数

ES5中，函数的默认值设定是，通过“｜｜”进行设定的，当函数参数是undefined时，取默认值。给函数传参数，然后在函数体内设置默认值 ，如num = num || 6

设置了默认值的参数，应该放在未设置默认值的参数之后。

ES6，当我们定义一个参数，可以添加 **“=”** 号为参数设置默认值。当参数未定义，自动使用默认值。function a(num=6) { }。
你能为新的arrow =>j箭头函数语法提供一个用例吗？ 这种新语法与其他函数有何不同？箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？介绍箭头函数的this ，在构造函数中的方法中使用箭头语法有什么优势？

不需要function关键字来创建函数
当函数有且仅有一个参数时，可以省略括号（）
当函数返回有且仅有一个表达式时，可以省略 { } 和 return

1. 箭头函数：

可以简化回调函数
箭头函数的this的指向：箭头函数本身没有this对象，它的this对象是它的定义生效时所在的对象，即定义时外部代码块的this，而不是执行时所在的对象。

在箭头函数中，函数体内部没有自己的 this，默认在其内部调用 this 的时候，会自动查找其父级上下文的 this 对象（如果父级同样是箭头函数，则会按照作用域链继续向上查找）

this来自于父级最近的非箭头函数，并且不能改变this的指向，而普通函数可以通过call, apply, bind改变this的指向。

不可以当构造函数，不能用new，因为没有this
箭头函数没有arguments对象，只能用rest参数替代。箭头函数本身没有 arguments 对象，所以如果他的上层函数都是箭头函数的话，那么 arguments 对象将不可用。
不可以使用yield命令，因此箭头函数不能用作Generator函数

箭头函数没有super
不支持重复的命名参数

注：1. 某些情况下我们可能需要函数有自己的this，例如DOM事件绑定的事件回调函数中，往往需要this来操作当前DO吗，这时候需要用传统匿名函数，而非箭头函数

- 所有的 ES6 特性你都知道吗？如果遇到一个东西不知道是 ES6 还是 ES5, 你该怎么区分它
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

## 字符串扩展

1. includes, 判断是否包含参数字符串，返回Boolean值, str.includes(str1)
2. repeat, 将原字符串重复n次，str.repeat(n)
3. startsWith, endsWith，判断是否以给定参数字符串开始或结束 str.startsWith(str1), str.endsWith(str2)
4. padStart & padEnd，如果字符串不够指定长度，在头部/尾部补全指定字符。

   接收两个参数，（1）指定字符串的最小长度，（2）如果指定字符串的长度，等于或大于指定的最小长度，就直接返回原字符串；如果忽略参数2，就用空格补全原字符串 str='123', str.padEnd(10,'444') => '1234444444'

## 数值扩展
Number
  1. isNaN，检查一个值是否是NaN，Number.isNaN(NaN)为true, Number.isNaN(15)为false
  2. isInteger，判断一个值是否为整数，注：1和1.0都是整数，Number.isInteger（1.0）
  3. 全局函数 parseInt() 与 parseFloat() 被移植到 Number 对象上。

Math
  1. trunc，去除一个数的小数部分，返回整数部分， Math.trunc(1.1)，返回1
  2. sign()，判断一个函数的正负

## 对象扩展
1. 键值对重名的情况，简化了语法
```javascript
// ES5
function person (name,age) {
    return { name: name, age: age }
}
// ES6
function person(name, age) {
    return { name, age }
}
```
2. 改进了为对象字面量方法赋值的语法：
为对象添加方法，ES6通过省略冒号和function关键字，使这个语法变得更简洁

```javascript
const person = {
    name: 'afa',
    getName () {
        return this.name
    }
}
```
3. Object.assign()方法
ES6提供了Object.assign方法，来实现浅复制。

可以把任意多个源对象**自身可枚举**的属性拷贝给目标对象，然后返回目标对象。参数1为目标对象。

使用源对象的[[ Get ]]和[[ Set ]]，所以会调用相关getter和setter。

4. Object.keys(), Object.values(), Object.entries()
根据对象自身可遍历的键名，键值，键值对进行遍历，返回一个数组

5. for of


## 数组新增方法
1. from，用于将类数组对象和可遍历的对象转为真正的数组
2. find，用于找到第一个符合条件的数组成员，如果没找到就返回undefined
3. findIndex，用于找到第一个符合条件的数组成员的索引
4. includes，用于某个数组是否包含给定的值，返回一个布尔值。如果没找到符合条件的成员就返回undefined
5. fill，用新元素替换掉数组内的元素，可以指定替换下标范围 arr.fill(value, start, end)
6. copyWithin，选择数组的某个下标，从该位置开始复制数组元素，默认从0开始复制，也可指定要复制的元素范围 arr.copyWithin(target,start,end)
7. of

## Iterator
遍历器是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署了Iterator接口，就可以完成遍历工作。

Iterator的作用：
  1. 为各种数据结构，提供一个统一的，简便的访问接口
  2. 使得数据结构的成员能按某种次序排列
  3. for...of循环

数组，类数组对象，Set，Map原生具备Iterator接口。

## proxy对象  属性代理器: 属性的读取（get）和设置（set）相关操作

- ES5和ES6有什么区别，用过ES6的哪些新特性，再针对你所回答的进行深入的提问。
- ES6中使用this的不同
