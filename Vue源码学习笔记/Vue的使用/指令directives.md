## 如何实现一个指令
  - 自定义指令（v-check、v-focus）的方法有哪些?它有哪些钩子函数？还有哪些钩子函数参数
  - 全局定义指令：在vue对象的directive方法里面有两个参数，一个是指令名称，另外一个是函数。
  - 组件内定义指令：directives 钩子函数：bind（绑定事件触发）、inserted(节点插入的时候触发)、update（组件内相关更新）

  以下皆为可选

    1. bind: 只调用一次，指令第一次绑定到元素的时候调用，用这个钩子可以定义一个绑定时执行一次的初始化动作。
    2. inserted：被绑定的元素插入父节点的时候调用(父节点存在即可调用，不必存在document中)
    3. update: 被绑定的元素所在模板更新时调用(可能发生在其子vnode更新之前)，而且无论绑定值是否有变化，通过比较更新前后的绑定值，忽略不必要的模板更新
    4. componentUpdate :被绑定的元素所在模板完成一次更新更新周期的时候调用
    5. unbind: 只调用一次，指令绑定的元素解绑的时候调用

钩子函数参数：el、binding

  1. el：指令绑定元素，可以用来直接操作DOM
  2. binding：对象，包含属性
    - name，指令名，不含含‘v-'
    - value，指令的绑定值，`v-directive="1+1" `,value为2
    - oldValue，指令绑定的前一个值，只在updated和componentUpdated中可用
    - expression，字符串形式的指令表达式，如前面的“1+1”
    - arg，传给指令的参数，可选，`v-directive:foo`，foo就是arg
    - modifiers，一个包含修饰符的对象，`v-directive.foo.bar`, modifiers就是{ foo: true, bar: true }
    - vnode， 虚拟节点
    - oldVnode，上一个虚拟节点，只在componentUpdated中可用

```html
<div id="hook" v-demo:foo.a.b="message"></div>
```

```javascript
Vue.directive('demo', {
  bind: function(el, binding) {
     // name: 'demo'
     // value: 'hello'
     // expression: 'message'
     // arg: 'foo'
     // modifiers: { a: true, b: true }
  }
})

new Vue({ el: "#hook", data: { message: 'hello' } })

```

1. 创建局部指令

```javascript
var app = new Vue({
  el: '#app',
  data: {
  },
  // 创建指令(可以多个)
  directives: {
    // 指令名称
    dir1: {
      inserted(el) {
      // 指令中第一个参数是当前使用指令的DOM
        console.log(el);
        console.log(arguments);
        // 对DOM进行操作
        el.style.width = '200px';
        el.style.height = '200px';
        el.style.background = '#000';
      }
    }
  }
})
```
2. 全局指令

```javascript
Vue.directive('dir2', {
    inserted(el) {
        console.log(el);
    }
})
```
3. 指令的使用
```html
<div id="app">
    <div v-dir1></div>
    <div v-dir2></div>
</div>
```
## 动态指令参数
```html
// v-mydirective:[argument] = 'value'
<div id="exam" v-pin:[direction]="zoo"></div>
```
```javascript
Vue.directive('pin', {
  bind: function(el, binding, vnode) {
    el.style.position = 'fixed'
    const s = binding.arg === 'left'? 'left' : 'right'
    el.style[s] = binding.value + 'px'
  }
})

new Vue({
  el: '#exam',
  data: function() {
    return {
      direction: 'left'
    }
  }
})
```

可以传入JS对象字面量

```html
<div id="exam" v-demo="{ color: 'white', text: 'zoo'}"></div>
```
```javascript
// 函数简写，不关心bind和update以外的钩子

Vue.directive('demo', function(el, binding, vnode) {
    console.log(binding.value.color) // white
  }
)
```
