## createApp
```javascript
const app = Vue.createApp({})
```
createApp之后可以链式调用其他方法，在应用API中。

### 参数
- 接收一个根组件选项对象作为第一个参数
- 使用第二个参数，可以将根 prop 传给应用程序

```javascript
const app = Vue.createApp(
  {
    data() {
      return {}
    },
    props: ['username']
  },
 { username: 'Evan' }
)
```

```html
<div id="app">
  {{ username }}
</div>
```
不再使用new Vue，new Vue会共享一个全局配置，对Vue对象所做的任何更改都会影响每个Vue实例和组件。

而是使用application概念，创建一个App。

Vue3中，改变全局Vue行为的API现在被移动到了由新的createApp方法创建的应用实例上，且现在它们的影响仅限于该特定应用实例。

调用createApp返回一个应用实例。该实例提供了一个应用上下文，应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在Vue2.x中“全局”的配置。每个配置都限于使用createApp定义的某个Vue实例。

使代码更易于理解，且不易出现由第三方插件引发的意外问题（如果第三方插件修改Vue对象，尤其全局混合，会影响程序）。

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

`app.mount('#app')`
## provide
设置一个可以被注入到应用范围内所有组件中的值。组件应该使用 inject 来接收提供的值。
## unmount
在提供的 DOM 元素上卸载应用实例的根组件。
## use
安装Vue.js插件

## 去除了Vue.prototype
```javascript
// Vue2
Vue.prototype.$http = () => {

}
// Vue3
const app = Vue.createApp({})
app.config.globalProperties.$http=() => {}
```