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
如何阻止默认事件？

addEventListener绑定事件?参数不同的执行顺序.

比如在代码中有a.addEventListener('click', fn1), a.addEventListener('click', fn2)这个时候fn1和fn2会执行吗，假如加上说阻止冒泡呢

- 请解释事件委托/代理 (event delegation)。
将事件绑定在尽量高层级的元素上，利用事件冒泡，代理子节点上触发的事件

优缺点,主要解决什么问题，手写例子

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

16. "attribute" 和 "property" 的区别是什么？

property是DOM中的属性，是JavaScript里的对象；是这个DOM元素作为对象，其附加的内容，例如childNodes、firstChild等。

attribute是HTML标签上的特性，它的值只能够是字符串；dom节点自带的属性，如id、class、title、align等。HTML标签中定义的属性和值会保存该DOM对象的attributes属性里面；

JS常见的dom操作api

表单可以跨域吗

4. 手指点击可以触控的屏幕时，是什么事件？如何在 JavaScript 中检测触摸事件？

你是否不看好检测设备对触摸事件的支持？如果是，为什么？比较触摸事件和点击事件。

当设备同时支持触摸和鼠标事件时，你认为这些事件的正确事件顺序是什么或应该是什么？

知道如何遍历和操作 DOM 非常重要，在不使用第三方库的情况下，你需要知道如何执行以下这些操作：

使用 document.querySelector 选择或查找节点，在旧版浏览器中使用 document.getElementsByTagName；
querySelectAll和ByClassName所获取元素的区别?如何绑定事件?
上下遍历——Node.parentNode、Node.firstChild、Node.lastChild 和 Node.childNodes；
左右遍历——Node.previousSibling 和 Node.nextSibling；
操作——在 DOM 树中添加、删除、复制和创建节点。你应该了解如何修改节点的文本内容以及切换、删除或添加 CSS 类名等操作；

性能——当有很多节点时，修改 DOM 的成本会很高，如何使用文档片段和节点缓存。

2. 浏览器提供的浏览器对象模型 ( BOM)提供的所有全局 API、浏览器差异、兼容性
1. 浏览器提供的符合 W3C标准的 DOM操作 API、浏览器差异、兼容性
3. 大量 DOM操作、海量数据的性能优化(合并操作、 Diff、 requestAnimationFrame等)
4. 浏览器海量数据存储、操作性能优化
5. DOM事件流的具体实现机制、不同浏览器的差异、事件代理

offsetTop和scrollTop和scrollHeight分别代表什么

getComputedStyle用法?

简述 requestAnimationFrame 和 requestIdleCallback 的作用

请解释 CSS 动画和 JavaScript 动画的优缺点。
