Vue3中，改变全局Vue行为的API现在被移动到了由新的createApp方法创建的应用实例上，且现在它们的影响仅限于该特定应用实例。

调用createApp返回一个应用实例。该实例提供了一个应用上下文，应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在Vue2.x中“全局”的配置。

因为createApp返回一个应用实例，因此可以在createApp()之后链式调用以下方法：

## component
注册或检索全局组件。注册还会使用给定的name参数自动设置组件的name
## config
包含应用配置的对象
## directive
注册或检索全局指令
## mixin
在整个应用范围内应用混入，一旦注册，就可以在当前的应用中任何组件模板内使用它，不建议在应用代码中使用
## mount
将应用实例的根组件挂载在提供的DOM元素上。
参数：
- { Element ｜ string } rootContainer
- { boolean } isHydrate
返回：
- 根组件实例
## provide
设置一个可以被注入到应用范围内所有组件中的值。组件应该使用 inject 来接收提供的值。
## unmount
在提供的 DOM 元素上卸载应用实例的根组件。
## use
安装Vue.js插件
