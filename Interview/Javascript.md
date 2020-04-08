# Javascript
## 类型
1. **JS的基本类型，引用类型分别有哪些？**
基本类型：String，Number，Boolean，Null ，Undefined，Symbol (ES6 中新增的)
引用类型：Array, Object, Function，Date,RegExp
2. **基本类型和引用类型有什么区别**
基本类型值是通过复制值来进行复制和传递的。保存和复制的是值本身；
- 保存位置：引用类型存在堆上，占用空间不固定；值类型存在栈上，占用空间固定
- 保存的对象：值类型保存和复制的是值本身；引用类型保存和复制的是指向对象的一个指针
- 如何检测数据类型：基本类型使用typeof检测，引用类型使用instanceof
- 引用类型可以使用new方法构建

3. **函数参数的传递方法**
按值传递，把函数外部的值复制给函数内部的参数，所以引用类型的值传递时，函数内外引用的是同一个对象。
但若在函数内部修改了参数的值（重写，覆盖）,内部的引用变了,原始的引用仍保持不变，外部变量指向的对象还是原来的。
4. **js深度复制，深拷贝 & 浅拷贝**
- 浅拷贝：拷贝后的对象和源对象，属性相同，但内部的对象指向的是同一个内存空间
- 深拷贝：拷贝后，两个对象除了拷贝了同样的属性外，没有任何关联，里面的对象指向的是不同内存空间

**描述一个深拷贝流程：**
1. 遍历要拷贝的对象的属性
2. 判断对象里每一项的数据类型
3. 如果是非对象，直接赋值；如果是引用类型，进行递归拷贝。如果不想要原型上的对象，用Object.hasOwnProperty(key)
```javascript
function deepClone(obj) {
  if(typeof obj === 'object') {
    var result = Array.isArray(obj)? []:{}
    for(let i in obj) {
      result[i] = typeof i === 'object'? deepClone(obj[i]):obj[i];
    }
  } else {
    var result = obj;
  }
  return result;
}
```
5. **类型强制转换**
两种不同的内置类型间的转换被称为强制转型。显式和隐式:
- 显式：Number('42')
- 隐式： `var a = "42"; var b = a * 1;`
6. **null和undefined，undeclared的区别，该如何检测**
- undefined，表示不存在，还未被定义，尚未初始化
- null：表示此处不应该有值，目前不可用的东西
7. **typeof 和 instanceof 区别，instanceof原理**
- typeof检测给定变量的数据类型
- instanceof，用于检测变量是否是给定引用类型的实例，检测基本类型值时始终返回false
- 最准确的是用Object.prototype.toString 进行类型转换来检测数据类型

**instanceof代码实现**
检测构造函数的prototype属性是否出现在某个实例对象的原型链上。
```javascript
instanceOf(left,right) {
  let proto = left.__proto__;
  let prototype = right.prototype;
  while(true) {
    if(proto === null) return false;
    if(proto === prototype) return true;
    proto = proto.__proto__;
  }
}
```
7. **如何判断一个变量是Array类型/Number类型**？（不止一种方法）
- Array.isArray(obj)
- obj instanceof Array
- obj.constructor === Array
- Object.prototype.toString.call(obj) === '[Object Array]'

Number：
- Number.isNumber(value)
- typeof value为'number'

8. == 和 === 有什么不同 
- 严格比较（例如 ===）在不允许强制转型的情况下检查两个值是否相等
- 抽象比较（例如 ==）在允许强制转型的情况下检查两个值是否相等

[] === [], [] == []，错误，因为引用的不同的对象；
undefined === undefined，undefined == undefined，都为true，基本类型值；

- 如果被比较的任何一个值可能是 true 或 false，要用 ===，而不是 = =。
- 如果被比较的任何一个值是这些特定值（0、“”或 []），要用 = = =，而不是 = =。
- 在其他情况下，可以安全地使用 = =。它不仅安全，而且在很多情况下，它可以简化代码，并且提升代码可读性。

9. **有哪些内置对象和内置函数？为什么扩展 JavaScript 内置对象不是好的做法？扩展内置JavaScript对象的利弊**
内置对象(11个）：Arguments,Math，Error；Number,Boolean,String,Date,RegExp；Array,Function,Object

10. &&和||
短路效应，&&返回最后一个为true的，||返回第一个为true的
console.log("hello" || "world")，// ‘world'
console.log("foo" && "bar")// 'foo'
11. 什么是三元表达式 (Ternary expression)？“三元 (Ternary)” 表示什么意思？

12. 什么是 "use strict"; ? 使用它的好处和坏处分别是什么？
use strict 出现在 JavaScript 代码的顶部或函数的顶部，可以帮助你写出更安全的 JavaScript 代码。如果你错误地创建了全局变量，它会通过抛出错误的方式来警告你。例如，以下程序将抛出错误：

```
 function doSomething(val) {
  "use strict"; 
  x = val + 10;
}
```
它会抛出一个错误，因为 x 没有被定义，并使用了全局作用域中的某个值对其进行赋值，而 use strict 不允许这样做。
使用哪种 language constructions来迭代对象属性和数组项？
- for...in...,遍历可枚举的实例属性和原型属性
- for...of...
- Object.keys()，遍历可枚举的对象的属性key
- Array.keys()，values(),entries(),forEach()

13. 常见字符串API/方法
14. 正则表达式的函数怎么使用 
regexp.exec(); string.match(regexp),string.replace(regexp,str),regexp.test(string)
15. forEach循环和.map（）循环之间的主要区别吗？为什么相对另一个，你要选择这个循环？
 forEach会遍历数组的每个值，对其进行处理，可能会改变数组
 map，遍历数组，返回对每个值处理后的值组成的新数组

16. "attribute" 和 "property" 的区别是什么？

property是DOM中的属性，是JavaScript里的对象；是这个DOM元素作为对象，其附加的内容，例如childNodes、firstChild等。

attribute是HTML标签上的特性，它的值只能够是字符串；dom节点自带的属性，如id、class、title、align等。HTML标签中定义的属性和值会保存该DOM对象的attributes属性里面；

17. 请解释可变 (mutable) 和不变 (immutable) 对象的区别。举出 JavaScript 中一个不变性对象 (immutable object) 的例子？

Object.freeze()，不可以增加删除属性，可以改变属性
不变性 (immutability) 有哪些优缺点？
如何用你自己的代码来实现不变性 (immutability)？

## 函数
1. 匿名（anonymous ）函数的典型用例？
可以模仿块级作用域（私有作用域），IIFE，自执行匿名函数`(function(){// 块级作用域})()`
2. IIFE (立即调用函数表达式)
function foo(){ }(); // 不是IIFE
Javascript将function关键字当做一个函数声明的开始，而函数声明后面不能带圆括号，而函数表达式后面可以跟圆括号。

- 要做哪些改动使它变成 IIFE?  写一个IIFE

将函数声明放在一对圆括号中，表明它实际是一个函数表达式，紧随的另一对圆括号会立即调用该函数。

立即调用函数表达式（Immediately-Invoked Function Expression），简称 IIFE。函数被创建后立即被执行。在避免污染全局命名空间时经常使用这种模式，因为IIFE的内部变量在其作用域之外都是不可见的。

2. 函数表达式和声明
**函数声明提升：**
在代码开始执行之前，Javascript解析器就读取函数声明，并将其放入执行环境中（源代码树的顶端）,并使其在任何代码执行之前可以访问。
即使声明函数的代码在使用它的代码之后，Javascript引擎也能把函数声明提升到顶部

函数表达式不会被提升，必须等到解析器执行到他所在的代码行，才会真正被解析执行。
3. 请解释变量声明提升 (hoisting)

不管变量和函数在何处声明，声明都会被提升到所在作用域的顶部，但是变量和函数初始化的顺序不变。函数的声明优先于变量的声明。

## BOM
- 浏览器的全局变量有哪些？BOM: navigator对象，location和history
- iframe有哪些缺点
1）iframe会阻塞主页面的Onload；
2）搜索引擎的检索程序无法解读这种页面，不利于SEO;
3）iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
4）使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，这样可以绕开以上两个问题。
## 作用域
1. 作用域
（作用域是变量以及如何通过名称访问这些变量的规则的集合。）

作用域：指程序源代码中定义变量的区域。
作用域规定了如何查找变量，也就是 **确定当前执行代码对变量的访问权限**。
Javascript采用词法作用域（lexical scopint），也就是静态作用域。即函数的作用域在函数定义时就决定
了，函数的作用域基于函数创建的位置。
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()(); // local scope
```
函数的执行用到了作用域链，这个作用域链是在函数定义的时候创建的。嵌套的函数 f() 定义在这个作用域链里，其中的变量 scope 一定是局部变量，不管何时何地执行函数 f()，这种绑定在执行 f() 时依然有效。

执行环境：定义了变量或者函数有权访问的其他数据，决定了它们各自的行为。

变量对象：每个执行环境都有关联的变量对象，环境中定义的变量和函数都保存在该对象中。

某个执行环境中的代码执行完以后，该环境被销毁，保存在其中的所有变量和函数都被销毁。

2. 执行上下文
JS引擎创建了执行上下文栈来管理执行上下文。当Javascript引擎执行一段可执行代码时，会创建对应的执行上下文。每个执行上下文有三个重要属性：
- 变量对象
- 作用域链
- this

变量对象是和执行上下文相关的数据作用域，存储了上下文中定义的变量和函数声明。只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活。

- 全局变量对象，是全局变量的宿主，在客户端中，全局对象就是window对象
- 函数上下文，我们用活动对象来表示变量对象，活动对象是在进入函数上下文时被创建的，通过arguments属性初始化，argements属性值是Arguments对象。

**执行过程**
全局上下文的变量对象初始化是全局对象；
函数上下文的变量对象初始化只包括Arguments对象；
进入执行上下文时会给变量对象添加形参，函数声明，变量声明等初始的属性值；
在代码执行阶段，会再次修改变量对象的属性值；

分为：
1. 进入执行上下文
变量对象会包括：（1）函数的所有形参（名称和对应值组成的一个属性被创建），没有实参，属性值设为undefined
（2）函数声明（名称和对应值即函数对象组成的一个属性被创建），如果变量存在同名属性，则完全替代该属性
（3）变量声明（名称和对应值即undefined组成的一个属性被创建），如果变量名和已经声明的形参或函数相同，则变量声明不会干扰已存在的这类属性
```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;
}

foo(1);
```
进入执行上下文时，活动对象如下：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```
2. 执行代码
顺序执行代码，根据代码修改变量对象的值。代码执行后，活动对象是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```
```javascript
function foo() {
    console.log(a);
    a = 1;
}

foo(); // Uncaught ReferenceError: a is not defined,a未通过var声明，不会被存放到AO中，到全局去找也没有，就报错

function bar() {
    a = 1;
    console.log(a);
}
bar(); // 1，全局对象已经被赋予了a属性，可以从全局找到a的值
```
```javascript
console.log(foo);

function foo(){
    console.log("foo");
}
var foo = 1;
```
会打印函数，而不是undefined。
因为进入执行上下文时，首先会处理函数声明，如果变量名和声明的形参或函数相同，变量声明不会干扰已存在的这类属性。
2. js 的作用域有几种？
作用域分为：全局作用域，函数局部作用域，以及块级作用域；
- 全局域是最外围的执行环境，web浏览器中，是window对象。全局作用域中的变量和函数，其他域的变量都可以访问；直到应用程序退出才会销毁；开始要解释执行代码时，初始化时首先向执行上下文栈压入一个全局执行上下文
- 函数域，每个函数都有自己的执行环境，当执行流进入函数内部时，函数的执行环境会被推入一个执行环境栈中，函数执行完后，控制权交给之前的执行环境，函数的执行环境销毁，只有函数中的代码才能访问函数作用域内的变量。
- 块级作用域，只有块级作用域内部的代码可以访问作用域内的变量

**作用域链：**代码在一个执行环境中执行时，会创建变量对象的一个作用域链，保证**对执行环境有权访问的所有变量和和函数的有序访问**。

作用域链最前端是代码所在环境的变量对象。

- JavaScript 引擎如何执行变量查找。
当查找变量时，从作用域链最前端(当前上下文的变量对象中查找)开始，逐级向后（父级执行上下文的变量对象中）搜索，直到找到变量或到达全局作用域（全局上下文的变量对象，即全局对象）。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

同一个作用域中的变量名必须是唯一的。一个作用域可以嵌套在另一个作用域内。如果一个作用域嵌套在另一个作用域内，最内部作用域内的代码可以访问另一个作用域的变量。

3. function Person(){}、var person = Person()、var person = new Person()区别？
- 为什么要创建静态类成员？
### 闭包
1. 什么是闭包？什么时候构成闭包？闭包的实现方法？闭包的优缺点？以及如何/为什么使用
- 闭包：**有权访问另一个函数作用域中变量的函数。**  
- **实现方法**：在一个函数内部创建并返回另一个（匿名）函数 
- 在一个函数内部定义的函数会将包含函数（即外部函数）的变量对象添加到它的作用域链中。即使外层函数执行完毕销毁，闭包还保留着对其变量对象的引用
- 匿名函数的执行环境具有全局性，其this对象通常指向window。
- 用途：数据隐藏、内存化以及动态函数生成。

缺点： 引用变量，不利于垃圾回收，占据内存
2. **this 是如何工作的，this有哪些使用场景？**
this 引用的是函数执行时所在的上下文对象,而不是函数被创建时所在的对象。（箭头函数除外）
它的值取决于调用的模式，按优先级从高到低：
- 使用new的构造函数调用模式
将会创建一个连接到该函数的prototype成员的新对象（新对象为构造函数的一个实例），同时this会被绑定到那个新对象上。

- apply,call,bind显式调用模式
将this绑定到传入的上下文参数上
- 方法调用模式
函数被保存为一个对象的属性时，即对象的方法，this被绑定到该对象。this到对象的绑定发生在调用的时候
- 函数调用模式
this被绑定到全局对象
- **.call 和 .apply ,.bind的作用，区别是什么？对this有什么影响？**
作用：**在特定的作用域中调用函数**，把函数的this对象绑定到特定的上下文对象上；
call()和apply()函数有两个参数：第一个参数都是上下文，如果上下文是null，则使用全局对象代替。

区别在于第二个参数，即传入函数的参数的形式。
call()的是实际传入的参数序列，apply()是参数组成的数组
`function.call(this,1,2,3)`，`function.apply(this,[1,2,3])`

- 请解释 Function.prototype.bind？
返回一个新的函数。第一个参数是上下文对象，作用是将函数绑定到参数中设置的上下文，即改变函数中的this对象

多个bind连接后输出的值，bind函数运行结果，自己实现bind 函数

## 原型和继承
1. 对象原型、构造函数和 mixin；
每个函数都有一个prototype属性，指向函数的原型对象。

原型对象是调用该构造函数创建的所有实例的原型，包含该类型所有实例共享的属性和方法。
每个Javascript对象在创建时就会与之关联另一个对象，即原型，对象从原型“继承”属性。

使用构造函数创建新实例后，该实例的内部包含一个__proto__属性，[ [ prototype] ]指针，指向构造函数的prototype原型对象。**__proto__指针的连接存在于实例和构造函数的原型对象之间。**

**constructor**

每个原型对象都有一个constructor属性指向关联的构造函数。

2. 创建对象的多种方式，new 一个对象时具体做了什么
理解通过使用 new 来自函数 prototype 属性的继承的对象是如何生成的。
- 创建一个新对象
- 将构造函数的作用域赋给新对象（this指向该新对象）res.__proto__ = func.prototype
- 执行构造函数中的代码，为新对象添加属性和方法
- 返回新对象

3. 请解释原型继承 (prototypal inheritance) 的原理
JavaScript 中的继承通过原型链进行工作。（手绘原型链，原型链是什么）

原型链：由相互关联（由__proto__串起来）的原型组成的链状结构就是原型链，如person->Person.prototype->Object.prototype->null

在通过原型链实现继承时，查找属性时，搜索实例->搜索子类的原型对象->搜索父类的原型对象

子类实例的[[Prototype]]指向子类的原型对象，即父类的实例，父类实例的[[prototype]]属性指向父类构造函数的原型对象。

原型继承：利用原型让一个引用类型/对象继承另一个引用类型/对象的实例和方法
         方法： subType.protytype = new SuperType()，将父类型的实例赋给子类的prototype属性/原型对象，即重写子类的原型对象（不再是默认的原型对象）

4. 实现继承的多种方式和优缺点
三个继承方式的优缺点，借用构造继承，几种组合继承方式

- 原型链继承：子类的prototype对象，是父类对象的实例
缺点：
所有实例共享原型的属性和方法，包含引用类型值的属性被共享，一个修改就会引起所有的变化；
且不能在不影响所有实例的情况下，给构造函数传递参数（在创建Child的实例时，不能向Parent传参）

- 借用构造函数（经典继承）：
SuperType.call(this,properties),在子类构造函数内部调用父类构造函数，用apply或call在新创建的对象上执行构造函数；
优点：
  避免了引用类型的属性被所有实例共享；可以在子类中向父类传递参数
问题：
  方法都在构造函数中定义，每次创建实例都会创建一遍方法，无法复用。

- 组合继承，最常用的继承模式

使用原型链实现对原型属性和方法的继承；借调构造函数实现对实例属性的继承（既保证了函数的复用，又保证每个实例有自己的属性）

问题：要调用两次父类构造函数，第一次原型继承时，获得子类原型的属性和方法；第二次借调构造函数时，继承了实例属性，覆盖了原型属性，可能存在Child.prototype和child1实例都有一个属性（父类的实例属性）

- 原型式继承（Object.create的模拟实现）
新建一个构造函数，将传入的对象作为该构造函数的prototype原型对象，返回该构造函数的实例
即：将传入的对象作为创建的对象的原型

缺点：和原型链继承一样，包含引用类型的属性值始终会共享相应的值

- 寄生式继承
创建一个仅用于封装继承过程的函数，该函数内部以某种形式来做增强对象，最后返回对象
先Object.create一个对象，再为其添加一个属性，函数，返回该对象

缺点：和借调构造函数一样，每次创建对象都会创建一遍方法

- 寄生组合式继承
通过借调构造函数来继承实例属性，通过原型链的混成形式来继承方法

不使用Child.Prototype = new Parent()，而是间接让Child.prototype访问到Parent.prototype
```javascript
function object(o) {
  function F() {  }
  F.prototype = o
  return new F()
}

function prototype(child,parent) {
  var prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

// 使用
prototype(Child,Parent)
```

不必为了指定子类型的原型而调用父类的构造函数，只要超类型原型的一个副本，使用寄生式继承来继承超类型的原型，再将结果指定给子类型的原型。

寄生式继承：创建一个封装继承过程的函数
var prototype = object(supertype.prototype)
prototype.constructor = subtype
subtype.prototype = prototype

function object(o) {
  function F() { }
  F.prototype = o
  return new F()
}
借助原型可以基于原有的对象创建新对象，而不必创建自定义类型。
创建一个临时性的构造函数
将传入的对象作为该构造函数的实例
返回该构造函数的一个新实例

这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

5. 类式继承的方案
```javascript
class subType extends superType {
  constructor(x,y,color) {
    super(x,y)
    this.color = color;
  }
  toString() {...}
}
```
通过extends关键字实现继承，子类必须在constructor构造函数中调用super()方法，通过父类的构造函数继承父类的实例属性和方法，再加上子类的属性和方法。

只有调用super()以后，才可以使用this对象。调用super（），先将父类的属性和方法加到this上，再用子类的构造函数修改this

super当对象用时，指向父类的原型对象，但调用父类的方法时，方法内部的this绑定当前的子类实例。

实现一个子类实例可以继承父类的所有方法

- JS如何实现重载和多态
## DOM,事件
-  JavaScript 的事件流模型都有什么？

事件流分为三个阶段：
1. 事件捕获阶段
2. 处于目标阶段
3. 事件冒泡阶段
**事件捕获**：事件先被最外层的元素上触发，再到最内层的元素
**事件冒泡**：嵌套最深的元素触发一个事件，然后这个事件顺着嵌套顺序在父元素上触发。
click DOM 节点的 inner 与 outer 的执行机制，考查事件冒泡与事件捕获 

防止事件冒泡的一种方法是使用 event.cancelBubble 或 event.stopPropagation()（低于 IE 9）。

- 请解释事件委托 (event delegation)。
将事件绑定在尽量高层级的元素上，利用事件冒泡，代理子节点上触发的事件
- DOM事件的绑定的几种方式
1. 行内绑定： `<button onClick="alert(1)"></button>`
2. `<button onClick="click"></button>`
3. DOM元素，button.onclick = function(){...}
4. addEventListener(eventName,callback,true/false),最后一个参数表示是否在事件冒泡阶段处理，true是事件捕获阶段，false是冒泡
- DOM事件中target和currentTarget的区别
1. target: 触发事件的对象
2. currentTarget：当前正在处理事件的对象

- 原生事件绑定（跨浏览器），dom0和dom2的区别？
onclick, addEventListener
- 给定一个元素获取它相对于视图窗口的坐标
- 编写一个通用的事件监听函数

- 手指点击可以触控的屏幕时，是什么事件？
touch

- 回调函数
回调函数是可以作为参数传递给另一个函数的函数，并在某些操作完成后执行。
- JS常见的dom操作api
使用 document.querySelector,querySelectorAll选择或查找节点，在旧版浏览器中使用 document.getElementsByTagName；
上下遍历——Node.parentNode、Node.firstChild、Node.lastChild 和 Node.childNodes；
左右遍历——Node.previousSibling 和 Node.nextSibling；
操作——在 DOM 树中添加、删除、复制和创建节点。修改节点的文本内容以及切换、删除或添加 CSS 类名等操作；
性能——当有很多节点时，修改 DOM 的成本会很高，使用文档片段和节点缓存。

- 在什么时候你会使用 document.write()？
- 请指出 document load 和 document DOMContentLoaded 两个的区别。
- 为何你会使用 load 之类的 (event)？有缺点吗？你是否知道其他替代品，以及为何使用它们？
- requestAnimationFrame 和 setTime、setInterval的区别，requestAnimationFrame 可以做什么

## 异步(Asynchronous）
- 事件循环
理解浏览器是如何处理用户输入、Web 请求和一般事件的。知道如何识别并正确实现异步代码。
js 单线程、
调用栈 (call stack) 和任务队列 (task queue) 的区别,宏任务与微任务的执行顺序
async，setTimeout和promise的执行顺序
Process.nextTick，setImmediate 和promise.then的优先级
理解 JavaScript 中异步和单线程分别是怎样的
- 解释同步 (synchronous) 和异步 (asynchronous) 函数的区别。
- 尽可能详尽的解释 Ajax 的工作原理。使用 Ajax 都有哪些优劣？

Ajax技术的核心是XMLHttpRequest对象，这个对象充当着浏览器中的脚本（客户端）与服务器之间的中间人的角色。Javascript通过这个对象可以自己发送请求，也自己处理请求。

优点:异步方式发送请求。服务器在后台处理请求，脚本可以按需加载和创建页面内容，不会打断用户的浏览体验。Web应用可以呈现出类似桌面应用般的体验。

使用Ajax就可以做到只更新页面中的一小部分,无需刷新和重新加载整个页面

缺点：有其适用范围，依赖Javascript，可能会有浏览器不支持它，而搜索引擎的蜘蛛程序也不会抓取到有关内容。
**同源策略**：使用XMLHttpRequest对象发送的请求只能访问与其所在HTML处于同一个域中的数据，不能向其他域发送请求。

传统的浏览器web应用都要涉及大量的页面刷新：用户点击链接，请求发送回服务器，服务器返回新页面，即使用户看到的只是页面中的一小部分有变化，也要刷新和重新加载整个页面。

- 手写Ajax

## 高阶函数，函数柯里化
-  组合和高阶函数；
- 高阶函数(Higher Order Functions)的定义
理解这些函数是 JavaScript 中的第一类对象以及这意味着什么，了解从另一个函数返回函数是完全合法的。了解闭包和高阶函数允许我们使用的技术。
什么是函数柯里化？你能举一个curry柯里函数的例子吗，为什么这种语法有优势？JS的API有哪些应用到函数柯里化的实现（bind函数和数组的reduce方法）？柯里化以及在函数式编程的应用.

## 性能
- js的垃圾回收机制

- 内存泄漏的原因和场景
- js处理异常
## 浏览器
- 请指出 JavaScript 宿主对象 (host objects) 和原生对象 (native objects) 的区别？
**宿主对象** —— 由浏览器提供的预定义对象被称为宿主对象，包括Form, Image，Element等，可以通过这些对象获得关于网页上表单、图像和各种表单元素等信息。 还有一种宿主对象 document对象，可以用来获得网页上的任何一个元素的信息。
**内建对象** ——

## 其他
- 为何通常会认为保留网站现有的全局作用域 (global scope) 不去改变它，是较好的选择？

- 如何实现下列代码：
 [1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]

- 请实现一个遍历至 100 的 for loop 循环，在能被 3 整除时输出 "fizz"，在能被 5 整除时输出 "buzz"，在能同时被 3 和 5 整除时输出 "fizzbuzz"。
- 请解释什么是单页应用 (single page app), 以及如何使其对搜索引擎友好 (SEO-friendly)。
- 使用一种可以编译成 JavaScript 的语言来写 JavaScript 代码有哪些优缺点？
- 你使用哪些工具和技术来调试 JavaScript 代码？
- 如何在文件之间共享代码？
- js设计模式
总体来说设计模式分为三大类：
创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。
结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。
行为型模式，共十一种：策略模式、模板方法模式、观察者模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式

```
1.使用jq的$.extend(true, target, obj)
2.newobj = Object.create(sourceObj)，// 但是这个是有个问题就是 newobj的更改不会影响到 sourceobj但是 sourceobj的更改会影响到newObj
3.newobj = JSON.parse(JSON.stringify(sourceObj))
```
- 图片预览功能

    <input type="file" name="file" onchange="showPreview(this)" />
	< img id="portrait" src="" width="70" height="75">

	function showPreview(source) {
	  var file = source.files[0];
	  if(window.FileReader) {
      var fr = new FileReader();
      fr.onloadend = function(e) {
        document.getElementById("portrait").src = e.target.result;
      };
      fr.readAsDataURL(file);
	  }
	}

RegExp、异步装载、模板引擎、前端MVC、路由、模块化、Canvas、Nodejs
