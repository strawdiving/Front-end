## DOM,事件
-  JavaScript 的事件流模型都有什么？
DOM事件流的具体实现机制、不同浏览器的差异、事件代理

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

- 自定义DOM事件
1. new Event
获取不到detail
2. 使用 createEvent('CustomEvent') (DOM3)
返回的对象有 initCustomEvent 方法，接受以下四个参数:
    - type: 字符串，表示触发的事件类型，如此处的'alert'
    - bubbles: 布尔值： 表示事件是否冒泡
    - cancelable: 布尔值，表示事件是否可以取消
    - detail: 任意值，保存在 event 对象的 detail 属性中
3. 使用 new customEvent() (DOM4)
使用起来比 createEvent('CustomEvent') 更加方便

```javascript
// new Event
let btn = document.querySelector('#btn');
let ev = new Event('alert', {
    bubbles: true,    //事件是否冒泡;默认值false
    cancelable: true, //事件能否被取消;默认值false
    composed: false
});
btn.addEventListener('alert', function (event) {
    console.log(event.bubbles); //true
    console.log(event.cancelable); //true
    console.log(event.detail); //undefined
}, false);
btn.dispatchEvent(ev);

// createEvent
let btn = document.querySelector('#btn');
let ev = btn.createEvent('CustomEvent');
ev.initCustomEvent('alert', true, true, 'button');
btn.addEventListener('alert', function (event) {
    console.log(event.bubbles); //true
    console.log(event.cancelable);//true
    console.log(event.detail); //button
}, false);
btn.dispatchEvent(ev);

// new CustomEvent
var btn = document.querySelector('#btn');
/*
 * 第一个参数是事件类型
 * 第二个参数是一个对象
 */
var ev = new CustomEvent('alert', {
    bubbles: 'true',
    cancelable: 'true',
    detail: 'button'
});
btn.addEventListener('alert', function (event) {
    console.log(event.bubbles); //true
    console.log(event.cancelable);//true
    console.log(event.detail); //button
}, false);
btn.dispatchEvent(ev);
```

- 自定义非DOM事件（观察者模式）
EventTarget类型有一个单独的属性handlers，用于存储事件处理程序（观察者）。
addHandler() 用于注册给定类型事件的事件处理程序；
fire() 用于触发一个事件；
removeHandler() 用于注销某个事件类型的事件处理程序。
```javascript
function EventTarget(){
    this.handlers = {};
}

EventTarget.prototype = {
    constructor:EventTarget,
    addHandler:function(type,handler){
        if(typeof this.handlers[type] === "undefined"){
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    },
    fire:function(event){
        if(!event.target){
            event.target = this;
        }
        if(this.handlers[event.type] instanceof Array){
            const handlers = this.handlers[event.type];
            handlers.forEach((handler)=>{
                handler(event);
            });
        }
    },
    removeHandler:function(type,handler){
        if(this.handlers[type] instanceof Array){
            const handlers = this.handlers[type];
            for(var i = 0,len = handlers.length; i < len; i++){
                if(handlers[i] === handler){
                    break;
                }
            }
            handlers.splice(i,1);
        }
    }
}
//使用
function handleMessage(event){
    console.log(event.message);
}
//创建一个新对象
var target = new EventTarget();
//添加一个事件处理程序
target.addHandler("message", handleMessage);
//触发事件
target.fire({type:"message", message:"Hi"}); //Hi
//删除事件处理程序
target.removeHandler("message",handleMessage);
//再次触发事件，没有事件处理程序
target.fire({type:"message",message: "Hi"});
```

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
在 requestAnimationFrame 之前，我们主要使用 setTimeout/setInterval 来编写JS动画。

编写动画的关键是循环间隔的设置，一方面，循环间隔足够短，动画效果才能显得平滑流畅；另一方面，循环间隔还要足够长，才能确保浏览器有能力渲染产生的变化。

大部分的电脑显示器的刷新频率是60HZ，也就是每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会提升。因此，最平滑动画的最佳循环间隔是 1000ms / 60 ，约为16.7ms。

setTimeout/setInterval 有一个显著的缺陷在于时间是不精确的，setTimeout/setInterval 只能保证延时或间隔不小于设定的时间。因为它们实际上只是把任务添加到了任务队列中，但是如果前面的任务还没有执行完成，它们必须要等待。

requestAnimationFrame 采用的是系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

综上所述，requestAnimationFrame 和 setTimeout/setInterval 在编写动画时相比，优点如下:

1. requestAnimationFrame 不需要设置时间，采用系统时间间隔，能达到最佳的动画效果。
2. requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成。
3. 当 requestAnimationFrame() 运行在后台标签页或者隐藏的 <iframe> 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命（大多数浏览器中）。

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

offsetTop和scrollTop和scrollHeight分别代表什么

getComputedStyle用法?

简述 requestAnimationFrame 和 requestIdleCallback 的作用

请解释 CSS 动画和 JavaScript 动画的优缺点。
