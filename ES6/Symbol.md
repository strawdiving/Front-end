# Symbol数据类型
ES6引入一种新的数据类型为Symbol，表示为“独一无二”的值，用来定义独一无二的对象属性名。

## Symbol的定义
一种Symbol类型，可以通过使用Symbol()来生成。

Symbol()可以接收一个字符串作为参数
```javascript
let s1 = Symbol('web')
let s2 = Symbol('web')

console.log(s1 === s2) // false
console.log(typeof s1) // symbol
console.log(typeof s2) // symbol
```

Symbol()函数接收的参数相同，其变量的值也不同

## Symbol作为对象属性名
可以通过三种方式作为对象属性名：

```javascript
let symbol = Symbol()

// 第1种
let a = {}
a[symbol] = 'web'

// 第2种
let a = {
  [symbol]: 'web'
}

// 第3种
let a = {}
Object.defineProperty(a, symbol, {value: 'web'})
```
**Symbol的值作为对象属性名，是不能用点运算符的。**

## Symbol使用场景
两种使用场景：

1. 因为Symbol的值都是不相等的，所以Symbol类型的值作为对象属性名，不会出现重复
2. 代码形成强耦合的某一个具体的字符串

## Symbol获取
通过`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有Symbols属性名

