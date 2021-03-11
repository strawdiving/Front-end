# Class

- ES5/ES6 的继承除了写法以外还有什么区别？
- ES6类class和ES5函数构造函数（function constructors）之间有什么区别？ES6 class原理，class语法，构造函数的语法糖

## 特性
- 本质为对原型链的二次包装
- 类没有提升
- 不能使用字面量定义属性
- 动态继承类的构造方法中super优于this

构造函数 constructor()，在类的实例化过程中会被调用。

类无法像对象一样使用pro: value 或 prop = value的形式定义一个类的属性

## 继承
使用extends关键字，让子类继承父类。

如果子类有构造函数constructor，那么在子类构造函数中使用this对象之前必须使用super()方法运行父类的构造函数以对父类进行初始化。

在子类方法中，也可以使用super对象来调用父类上的方法。
