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

16. "attribute" 和 "property" 的区别是什么？

property是DOM中的属性，是JavaScript里的对象；是这个DOM元素作为对象，其附加的内容，例如childNodes、firstChild等。

attribute是HTML标签上的特性，它的值只能够是字符串；dom节点自带的属性，如id、class、title、align等。HTML标签中定义的属性和值会保存该DOM对象的attributes属性里面；