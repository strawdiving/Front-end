## React
对React看法，它的优缺点，使用过程中遇到的问题，如何解决的
react异步渲染的概念,介绍Time Slicing 和 Suspense

react生命周期，常用的生命周期
对应的生命周期做什么事
遇到性能问题一般在哪个生命周期里解决
16.X生命周期的改变，16.X中props改变后在哪个生命周期中处理，state和props触发更新的生命周期分别有什么区别
React 类组件的新老生命周期


详细介绍一下 Redux 状态管理，如何和 React 组件连接
Mobx 的实现原理

介绍JSX
React使用过的一些组件
react设计思路/理念（拿函数式编程来做页面渲染）
React数据流
props和state的区别
介绍react context
React15/16.x的区别
哪些方法会触发react重新渲染
重新渲染render会做些什么
setState是同步还是异步
setState的执行机制/原理
如何有效的管理状态
对无状态组件的理解

介绍下React的Filber架构，画Filber渲染树，Fiber工作原理，解决了什么问题
介绍React高阶组件,和普通组件有什么区别
绑定connect的过程
connect原理
可熟练应用 ReactAPI、生命周期等，可应用 HOC、 render props、 Hooks等高阶用法解决问题
React HOC 的用途，什么是装饰器模式
React Hooks 的使用有哪些注意事项
基于 React的特性和原理，手动实现一个简单的 React

一个对象数组，每个子对象包含一个id和name，React如何渲染出全部的name
在哪个生命周期里写
其中有几个name不存在，通过异步接口获取，如何做
react中的key的作用,渲染的时候key给什么值，可以使用index吗，用id好还是index好
key主要是解决哪一类的问题，为什么不建议用索引index（重绘）

react性能优化，有哪些细节可以优化
介绍DOM树对比
如何解决props层级过深的问题

事件底层实现机制
Emit事件怎么发，需要引入什么
React组件中怎么做事件代理，事件代理的原理， React的事件机制（绑定一个事件到一个组件上）
React 的合成事件机制

React中Dom结构发生变化后内部经历了哪些变化
React挂载的时候有3个组件，textComponent、composeComponent、domComponent，区别和关系，Dom结构发生变化时怎么区分data的变化，怎么更新，更新怎么调度，如果更新的时候还
function component
有其他任务存在怎么处理

虚拟DOM本身是什么（JS对象）
虚拟DOM主要做了什么
为什么虚拟DOM比真实DOM性能好
React的虚拟 DOM和 Diff算法的内部实现
为什么3大框架出现以后就出现很多native（RN）框架（虚拟DOM）


## Redux
Redux中异步的请求怎么处理
Redux中间件是什么东西，接受几个参数（两端的柯里化函数）
redux的设计思想
接入redux的过程
Redux在状态管理方面解决了React本身不能解决的问题
Redux有没有做过封装
Redux怎么实现属性传递，介绍下原理
Redux状态管理器和变量挂载到window中有什么区别
介绍下redux整个流程原理
介绍redux接入流程
redux状态树的管理
redux整体的工作流程
redux和全局对象之间的区别
Redux数据回溯设计思路
介绍Redux工作流程
介绍Redux数据流的流程
Redux如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理
多个组件之间如何拆分各自的state，每块小的组件有自己的状态，它们之间还有一些公共的状态需要维护，如何思考这块
使用过的Redux中间件
介绍redux，主要解决什么问题
redux请求中间件如何处理并发
Redux中哪些功能用到了哪些设计模式
rudux和全局管理有什么区别（数据可控、数据响应）

React非父子、兄弟组件传值：状态管理--Redux、Mobx等等。

中间件是怎么拿到store和action，然后怎么处理
state是怎么注入到组件的，从reducer到组件经历了什么样的过程
redux/redux-saga
其他状态管理？Mobx