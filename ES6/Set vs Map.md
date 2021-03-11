# Map和Set

## Set
Set类似于数组，但成员的值都是唯一的，没有重复的值。Set是有序列表，含有相互独立的非重复值。

Set使用add()方法添加元素，不会添加重复的值，所以Set可以用来对数组进行去重操作。

使用new Set()构造函数来声明Set；使用for...of来遍历集合中的值

操作方法：
    - delete，删除
    - has，是否包含元素
    - clear，清空
    - add，添加

Set常被用来检查对象中是否存在某个键名。

1. Array和Set对比
都是存储多值的容器，两者可以互换，但在使用场景上有区别。如下：
  - Array的indexOf方法比Set的has方法效率低下
  - Set不含重复值（可以利用这一特性实现数组去重）
  - Set可通过delete删除某个值，Array只能通过splice，前者更方便
  - Array的很多方法，如map,filter等，Set是没有的（但两者可以互相转换来使用）

2. Object和Map对比
  - Object是 字符串-值，键为String类型；Map是值-值，键可以是任意类型
  - 需要手动计算Object的尺寸，Map.size可以获取尺寸
  - Map的排序是插入排序
  - Object有原型，所以映射中有一些缺省值。可以理解为 Map = Object.create(null)

## Map
Map类似于对象，键名的值可以是各种类型的值。

使用new Map()构造函数来声明Map.

操作方法：
    - delete，删除
    - has，是否包含元素
    - clear，清空
    - set，新增/修改元
    - get，获取

Map集合常被用来获取已存的信息


Set 和 Map 的方法合集，和其他数据结构的互相转换

Set、Map、WeakSet 和 WeakMap 的区别？ES6中的map和原生的对象有什么区别