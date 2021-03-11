Vue的事件机制

# Vue Events API
Vue.js提供了四个实例方法/事件API，$on, $off, $once, $emit。
事件的初始化在`/src/core/instance/events.js`中。
## 事件初始化
```javascript
export function initEvents (vm: Component) {
  /*创建一个_events对象，用来存放事件*/
  vm._events = Object.create(null)

  /*标志位，表明是否存在钩子事件*/
  vm._hasHookEvent = false
  // init parent attached events，初始化父组件attach的事件
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```
初始化事件在vm上创建一个_events对象，用于存放事件，_events的格式：
```javascript
{
    // eventName:事件名，string
    eventName: [cb1,cb2,cb3,...]
}
```
存放事件名以及对应的回调函数。

## vm.$on(event,callback)
- 参数：
  - { string | Array<string> } event，事件名或事件名数组
  - { Function } callback，事件的回调函数
- 用法：

  监听当前实例上的自定义事件，事件可以由`vm.$emit`触发。回调函数会接收所有传入事件触发函数的额外参数。
```javascript
/*
event: string | Array<string>
*/
const hookRE = /^hook:/
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    // 如果是数组，则递归调用$on，为每一个成员都绑定fn回调函数
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
    // 将事件加入_events中
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      /*在事件注册时，用一个bool值标记是否是hook钩子事件，替代hash查找，可以减少开销，优化性能*/
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
```
- 示例：
```javascript
vm.$on('test',function(msg) {
    console.log(msg)
})
vm.$emit('test','hi')
// => "hi"
```
## vm.$once(event,callback)
- 参数：
  - { string } event，事件名
  - { Function } callback，事件的回调函数
- 用法：

  监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。

```javascript
Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      // 在第一次执行时将该事件销毁
      vm.$off(event, on)
      // 执行注册的方法
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }
```
## vm.$off([event,callback])
- 参数：
  - { string | Array<string> } event，事件名或事件名数组
  - { Function } callback，事件的回调函数
- 用法：

  移除自定义事件监听器。
  - 如果没有提供参数，则移除所有的事件监听器
  - 如果只提供了事件，则移除该事件所有的监听器
  - 如果同时提供了事件和回调，则只移除这个回调的监听器

```javascript
Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    // 没有提供参数，则移除所有的事件监听器
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    // event为数组，则递归移除事件监听器
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    // 特定的事件
    const cbs = vm._events[event]
    // 事件不存在，直接返回
    if (!cbs) {
      return vm
    }
    // 只提供了事件，则移除该事件所有的监听器
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    // 同时提供了事件和回调
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      // 只移除这个回调的监听器
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }
```
## vm.$emit(eventName,[...args]])
- 参数：
  - { string } eventName，事件名
  - [...args]

触发当前实例上指定的事件。附加参数都会传给监听器回调。

```javascript
Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      //将类数组对象转换成数组
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      //遍历执行事件的回调，带错误处理
      for (let i = 0, l = cbs.length; i < l; i++) {
        //该函数在 /src/core/util/error.js中
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
```
执行函数 `invokeWithErrorHandling(cbs[i], vm, args, vm, info)` ，invokeWithErrorHandling的定义在/src/core/util/error.js中，带错误处理。
```javascript
export function invokeWithErrorHandling (
  handler: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res
  try {
    //执行监听器回调，附加参数args都会传给监听器回调
    res = args ? handler.apply(context, args) : handler.call(context)
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(e => handleError(e, vm, info + ` (Promise/async)`))
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true
    }
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}
```
- 官方示例：
只配合一个事件名使用`$emit`:
```javascript
Vue.component('welcome-button',{
    template:`
      <button v-on:click = "$emit('welcome')">
        Click me to be welcomed
      </button>
    `
})
```
```html
<div id="emit-example-simple">
  <welcome-button v-on:welcome="sayHi"></welcome-button>
</div>
```
```javascript
new Vue({
    el: '#emit-example-simple',
    methods: {
        sayHi: function () {
            alert('Hi')
        }
    }
})
```

## 事件绑定与监听
v-on可以绑定实例属性methods中的方法作为事件的处理器，v-on:后面可以接受所有的原生事件名称。

简写 @:
- 可以绑定methods函数，也支持内联js，但是仅限一个语句。
- 绑定methods函数和内联js都可以获取原生dom元素event.
- 绑定多个事件时，为顺序执行。
