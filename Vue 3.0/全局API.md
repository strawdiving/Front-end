

## h
h返回一个“虚拟节点” VNode：一个普通对象，其中包含向Vue描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。它的目的是用于手动编写的渲染函数：
```javascript
render() {
  return Vue.h('h1', {}, 'Some Title)
}
```
### 参数
接收3个参数：
- type（必需）
  - 类型：String | Object | Function
  - 详细：HTML标签名，组件，或异步组件。使用返回null的函数将渲染一个注释。
- props（可选）
  - 类型：Object
  - 详细：一个对象，与我们将在模板中使用的attribute、prop和事件相对应
- children（可选）
  - 类型：String ｜ Array | Object
  - 详细：子代VNode，使用 h() 生成，或者使用字符串来获取 “文本VNode”，或带有插槽的对象

```javascript
h('div',
  {},
  [
    'some text comes first',
    h('h1', 'A headline'),
    h(MyComponent, { someProp: 'foobar' })
  ]
)
```
## defineComponent
从实现上看，defineComponent只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、TSX和IDE工具支持。
### 参数
- 具有组件选项的对象
```javascript
const component = defineComponent({
  data() {
    return { count: 1 }
  },
  methods: {

  }
})
```
- 或者一个 setup函数，函数名称将作为组件名称来使用
```javascript
const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return {
    count
  }
})
```
## defineAsyncComponent
创建一个只有在需要时才会加载的异步组件。
### 参数
- 对于基本用法，defineAsyncComponent可以接受一个**返回Promise的工厂函数**。

Promise的resolve回调应该在服务端返回组件定义后被调用，也可以调用reject(reason)来表示加载失败。

```javascript
const AsyncComp = defineAsyncComponent(() => import('./components/AsyncComponent.vue'))
app.component('async-component', AsyncComp)
```

当使用局部注册时，也可以直接提供一个返回Promise的函数:
```javascript
createApp({
  // ...
  components: {
    AsyncComp: defineAsyncComponent(() => import('./components/AsyncComponent.vue'))
  }
})
```
- 对于高阶用法，defineAsyncComponent可以接受一个对象(详见官方文档)

```javascript
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Foo.vue'),
  loadingComponent: LoadingComponent,
  ......
})
```

## resolveComponent —— 只能在 render 或 setup 函数中使用
如果在当前应用实例中可用，则允许按名称解析 component。
### 参数
接受一个参数：name，
- 类型：String
- 详细：已加载的组件的名称
- 返回一个 Component。如果没有找到，则返回 undefined

```javascript
const app = Vue.createApp({})
app.component('MyComp', {})
```

```javascript
import { resolveComponent } from 'vue'
render() {
  const myComponent = resolveComponent('MyComp')
}
```
## resolveDynamicComponent—— 只能在 render 或 setup 函数中使用
允许使用与 <component :is="">相同的机制来解析一个 component。

### 参数
接受一个参数：component，
- 类型：String | Object（组件的选项对象）
- 详细：参阅“动态组件”的文档
- 返回已解析的 Component 或 新创建的 VNode，其中组件名称作为节点标签，如果找不到Component，将发出警告

## resolveDirective —— 只能在 render 或 setup 函数中使用
如果在当前应用实例中可用，则允许通过其名称解析一个 directive
### 参数
接受一个参数：name
- 类型：String
- 详细：已加载的指令的名称
- 返回：返回一个 Directive，没找到，则返回undefined

## withDirectives —— 只能在 render 或 setup 函数中使用
允许将指令应用于VNode。返回一个包含应用指令的VNode。
### 参数
接受两个参数：
- vnode
  - 类型：vnode
  - 详细：一个虚拟节点，通常用h()创建
- directives
  - 类型：Array
  - 详细：一个指令数组，每个指令本身都是一个数组，最多可以定义4个索引，详见文档

```javascript
import { resolveDirective, withDirectives } from 'vue'

const app = Vue.createApp({})
app.directive('highlight', {})

render() {
  const highlightDirective = resolveDirective('highlight')
  const nodeWithDirectives = withDirectives(h('div'), [[highlightDirective]])
}

```

## nextTick
将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新。
```javascript
import { createApp, nextTick } from 'vue'
const app = createApp({
  setup() {
    const message=ref('hello')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Dom is updated')
    }
  }
})
```
