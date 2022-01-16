## 了解Vue3吗，相对于Vue2做了哪些优化。Vue2.0和Vue3.0区别
- Vue3.0都有哪些重要新特性？
 Composition API 和 Tree-shaking 方面，对应比较React Hooks和webpack 的Tree-shaking
- Vue3.0 对比Vue2.0的优势在哪？
- Vue3.0和React 16.X 都有哪些区别和相似处？
重点突出两者开始相互借鉴，互有优点。记得夸夸Vue3.0抄过来，却做得更好的部分。
- Vue3.0是如何实现代码逻辑复用的？
可以先对比Composition API和mixin的差异，并凸显出Vue2.0那种代码上下反复横跳的缺点

参考：
《抄笔记：尤雨溪在 Vue3.0 Beta 直播里聊到了这些…》

《Vue3 究竟好在哪里？（和 React Hook 的详细对比）》

## vue3.0 特性的了解
1. 监测机制的改变

Object.defineProperty默认只能劫持值类型数据，对引用类型的数据内部修改无法劫持，要重写覆盖原型方法。
- 无法监控数组下标的变化，`arr[2]=1`这样的下标赋值操作无法被监听。监控数组对象时，实质上监控的是数组的地址，地址不变就不会被监测到；
- 无法监听数组的length，`arr.length`这样的数据更改无法被监听
- 只能劫持对象的属性，所以要对对象的每个属性进行遍历，可能需要深度遍历（Vue 2.x通过递归+遍历data对象来实现对数据的监控），如果能劫持一个完整的对象，才是更好的选择

Vue3.0 使用了ES6的Proxy代理对象，用于取代defineProperty
- Proxy可以直接监听对象而非属性;可劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到目的。而Object.defineProperty只能遍历对象属性直接修改
- Proxy可以监听数组的变化
- Proxy有有多达13种拦截方法,不限于apply、ownKeys、deleteProperty,has等是defineProperty不具备的
- Proxy返回新对象，我们可以只操作新对象达到目的，而Object.defineProperty只能遍历对象属性进行修改

问题：ES6新特性，兼容性不好，且无法用polyfill兼容，Object.defineProperty的优势就是兼容性好,支持IE9

[Vue3为什么选择Proxy做双向绑定？](https://mp.weixin.qq.com/s?__biz=MzI3NjM1OTI3Mw==&mid=2247483695&idx=1&sn=8f4d74b58f4102eced8089bcaac4c443&chksm=eb77f029dc00793f502d4a39819e488d560e6bf7d268f3e987a03d43d71a07a2edab59d8d78f&scene=21#wechat_redirect)

Vue3.0 将带来基于代理 Proxy 的 observer 实现，提供全语言覆盖的反应性跟踪。这消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：①只能监测属性，不能监测对象；②检测属性的添加和删除；③检测数组索引和长度的变更；④支持 Map、Set、WeakMap 和 WeakSet。
新的 observer 还提供了以下特性：
用于创建 observable 的公开 API。这为中小规模场景提供了简单轻量级的跨组件状态管理解决方案。
默认采用惰性观察。在 2.x 中，不管反应式数据有多大，都会在启动时被观察到。如果你的数据集很大，这可能会在应用启动时带来明显的开销。在 3.x 中，只观察用于渲染应用程序最初可见部分的数据。
更精确的变更通知。在 2.x 中，通过 Vue.set 强制添加新属性将导致依赖于该对象的 watcher 收到变更通知。在 3.x 中，只有依赖于特定属性的 watcher 才会收到通知。
不可变的 observable：我们可以创建值的“不可变”版本（即使是嵌套属性），除非系统在内部暂时将其“解禁”。这个机制可用于冻结 prop 传递或 Vuex 状态树以外的变化。
更好的调试功能：我们可以使用新的 renderTracked 和 renderTriggered 钩子精确地跟踪组件在什么时候以及为什么重新渲染。

2. 模板
模板方面没有大的变更，只改了作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。

3. 对象式的组件声明方式
vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易。
此外，vue 的源码也改用了 TypeScript 来写。其实当代码的功能复杂之后，必须有一个静态类型系统来做一些辅助管理。现在 vue3.0 也全面改用 TypeScript 来重写了，更是使得对外暴露的 api 更容易结合 TypeScript。静态类型系统对于复杂代码的维护确实很有必要。

4. 其它方面的更改
vue3.0 的改变是全面的，上面只涉及到主要的 3 个方面，还有一些其它的更改：
支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
支持 Fragment（多个根节点）和 Protal（在 dom 其它部分渲染组建内容）组件，针对一些特殊的场景做了处理。
基于 treeshaking 优化，提供了更多的内置功能。

## 生命周期的变化
名字大部分需要加`on`，功能上类似。使用上，Vue3组合式API需要先引入，Vue2选项API则可以直接调用
```javascript
<script setup>
import { onMounted } from 'vue

onMounted(() => {

})
</script>
```
### Vue2.x
- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

### Vue3
- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted

setup是围绕beforeCreate和created生命钩子运行的，所以不需要显式地去定义

## 多根节点——Fragment
支持了多根节点组件，也就是`fragment`

Vue2中，编写页面时，template只能有一个根组件，需要将组件包裹在div中，否则报警警告；

原因：代表任何Vue组件的Vue实例，都需要绑定到单个DOM元素中，创建具有多个DOM节点的组件的唯一方法，就是创建一个没有基础Vue实例的功能组件。

而Vue3中，template可以包含多个根节点。

Fragment的虚拟元素，看起来像普通的DOM元素，但它是虚拟的，根本不会在DOM树中渲染，这样就可以将组件功能绑定到单个元素中，而无需创建冗余的DOM节点。
## 组合式API
### 什么是组合式API
Vu3引入的一种新的编写Vue组件的方式

### 为什么引入组合式API——对象/选项式API存在的问题
- 不利于复用
- 潜在命名冲突
- 上下文丢失
- 有限的类型支持
- 按API类型组织

Vue2是选项式API（Option API），一个逻辑会散乱在文件不同位置（data,props,computed,watch,生命周期函数等），导致代码可读性变差，需要上下来回跳转文件位置

### 组合式API提供的能力
- 极易复用（原生JS函数）
- 可灵活组合（生命周期钩子可多次使用）
- 提供更好的上下文支持
- 更好的TypeScript类型支持
- 按功能/逻辑组织
- 可独立于Vue组件使用

Vue3组合式API（Composition API）很好的解决了这个问题，可将同一逻辑的内容写到一起。

### 可组合的函数 —— 可复用逻辑的集合，专注点分离
```javascript
export function useDark(options: useDarkOptions = {}) {
  const preferredDark = usePreferredDark()
  const store = useLocalStorage('vueuse-dark', 'auto')

  return computed<boolean>({
    get() {
      return store.value === 'auto' ? preferredDark.value : store.value === 'dark'
    },
    set(v) {
      store.value = v === preferredDark.value ? 'auto' : v ? 'dark' : 'light'
    }
  })
}
```
### 编写可复用、可组合的逻辑
1. Ref
- 优点：显式调用，类型检查；相比reactive局限更少
- 缺点：使用的时候要 .value

2. Reactive
- 优点：自动Unwrap, 不需要 .value
- 缺点：在类型上和一般对象没有区别
       使用ES6解构会使响应性丢失
       需要使用箭头函数包装，才能使用'watch'

组合关系： useDark -- useLocalStorage -- useStorage -- useEventListener
                ｜__usePreferredDark -- useMediaQuery -- useEventListener

其中，每一个函数都可以独立使用，专注点分离

- Vue的setup()只在组件建立时执行一次，并建立数据与逻辑之间的连结
  - 建立 输入->输出的连结
  - 输出会自动根据输入的改变而改变

3. Ref自动解包

在众多情况下，可以减少.value的使用

- 'watch'直接接受Ref作为监听对象，并在回调函数中返回解包后的值
- Ref在模板中自动解包
- 使用Reactive解包嵌套的Ref

```javascript
import { ref, reactive } from 'vue'
const counter = ref(0)
watch(counter, count => {
  console.log(count)
})

const foo = ref('foo')
const data = reactive({ foo, id: 10 })

```
4. unref —— Ref的反操作
如果传入一个Ref，返回其值；否则原样返回
```javascript
function unref<T>(r: Ref<T> | T) : T {
  return isRef(r) ? r.value : r
}
```

5. 传入Ref作为函数参数
```javascript
// 纯函数
function add(a: number, b: number) {
  return a + b
}
// 接受Ref作为参数，返回一个响应式的结果
function add(a: Ref<number>, b: Ref<number>) {
  return computed(() => a.value + b.value)
}

const a = ref(1)
const b = ref(2)

const c = add(a, b)
c.value // 3

// 同时接受传入值和Ref
function add(a: Ref<number> | number, b: Ref<number> | number) {
  return computed(() => unref(a) + unref(b))
}
const a = ref(1)
const c = add(a, 5)
c.value //6
```
6. 重复使用已有Ref
如果将一个'ref'传递给'ref()'构造函数，它将会原样将其返回

```javascript
const foo = ref(1) // Ref<1>
const bar = ref(foo) // Ref<1>

foo === bar // true
function useFoo(foo: Ref<stirng> | string) {
  const bar = isRef(foo) ? foo : ref(foo)
  // 和上面的代码等效
  const bar = ref(foo)
}
```

7. 状态共享（不兼容SSR）
由于组合式API天然提供的灵活性，状态可以独立于组件被创建并使用
```javascript
// shared.ts
import { reactive } from 'vue'
export const state = reactive({
  foo: 1,
  bar: 'hello'
})

// A.vue
import { state } from './shared.ts'
share.foo +=1

// B.vue
import { state } from './shared.ts'
console.log(state.foo)

```

8. 由Ref组成的对象
以在使用可组合的函数式，同时获得'ref'和'reactive'的好处
```javascript
import { ref, reactive } from 'vue'
function useMouse() {
  return {
    x: ref(0),
    y: ref(0)
  }
}
const { x, y } = useMouse()
const mouse = reactive(useMouse())
mouse.x === x.value // true
```
可以直接使用ES6解构其中的Ref使用；根据使用方式，当想要自动解包的功能时，可以用reactive将其转换为对象。

9. 将异步操作转换为“同步”
使用组合式API，可以将异步请求转换为同步
```javascript
const data = await fetch('https://api.github.com').then(r => r.json())

// use data 组合式API
const { data } = useFetch('https://api.github.com').json()
const user_url = computed(() => data.value?.user_url)
```
先建立数据间的“连结”，然后再等异步请求返回将数据填充。

```javascript
export function useFetch<R>(url: Ref<string>) {
  const data = shallowRef<T | undefined>()
  const error = shallowRef<Error | undefined>()

  fetch(unref(url)).then(r => r.json()).then(r => data.value = r).catch(e => err.value = e)

  return {
    data, error
  }
}
```

10. 副作用自动清除
Vue中原生的'watch'和'computed' API会在组件销毁时自动解除其内部的依赖监听。我们编写函数时，遵循同样的模式

```javascript
import { onUnMounted } from 'vue'
export function useEventListener(target: EventTarget, name: string, fn: any) {
  target.addEventListener(name, fn)

  onUnMounted(() => {
    target.removeEventListener(name, fn)
  })
}

```

## 代码重用
除了增强代码的可读性，内聚性，组合式API还提供了较为完美的逻辑复用性方案。

Vue2的时候，要在组件间共享一些代码，有两个选择：
- Mixin

```javascript
import CounterMixin from './mixins/counter'
export default {
  mixins: [CounterMixin]
}
```

mixins的缺点：我们对它实际上添加到组件中的行为一无所知，这不仅使代码更难理解，命名冲突隐患（还可能导致名称和现有属性和函数发生冲突），依赖关系不明确。

- 作用域插槽
```html
<template>
  <Counter v-slot="{ count, increment }">
     {{ count }}
    <button @click="increment">Increment</button>
  </Counter>
</template>
```
可以确切知道v-slot属性访问了哪些属性，代码更容易理解，但只能在模板中访问，且限于某个组件作用域内使用。不同组件间配置化使用不够灵活。

### Vue3的组合式API
不受模板和组件作用域的限制，且确切知道可以访问哪些属性。

```html
<template>
  <span>mouse position {{x}} {{y}}</span>
</template>
```
```javascript
<script setup>
import { ref } from 'vue'
import useMousePosition from './useMousePosition'

const { x, y } = useMousePosition()
</script>

// useMousePosition.js
import { ref, onMounted, onUnMounted } from 'vue'

function useMousePosition() {
  let x = ref(0)
  let y = ref(0)

  function update(e) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return {
    x, y
  }
}
```
## 响应式原理
### Vue2是基于Object.defineProperty
基本用法：直接在一个对象上定义新的属性火修改现有的属性，并返回对象（注：writable和value，与getter和setter不共存）
```javascript
let obj = {}
let name = 'dd'

Object.defineProperty(obj, 'name', {
  enumerable: true,
  configurable: true,
  // value: '', // 任意类型的值，默认undefined
  // writable: true, // 可重写
  get: function() {
    return name
  },
  set: function(value) {
    name = value
  }
})
```
- 缺点：无法监听对象，或数组新增、删除元素
- 解决方案：针对常用数组原型方法，push,pop,shift,unshift,splice,sort,reverse进行了hacker处理
          提供了Vue.set，监听对象/数组新增属性
          对象的新增、删除响应，还可以new个新对象，新增则合并新属性和旧对象，删除则将删除属性后的对象深拷贝给新对象。

- Object.defineProperty是可以监听数组已有元素，但Vue2没提供的原因是性能问题。

### Vue3是基于Proxy
Proxy是ES6新特性，通过第二个参数handler拦截目标对象的行为，相比较defineproperty提供语言全范围的响应能力，消除了局限性，但兼容性上放弃了（IE11以下）

- 局限性
  - 对象/数组的新增/删除
  - 检测.length的修改
  - Map,Set,WeakMap,WeakSet的支持

- 基本用法

创建对象的代理，从而实现基本操作的拦截和自定义操作

```javascript
const handler = {
  get: function(obj, prop) {
    return prop in obj? obj[pro] : ''
  },
  set: function (val) {

  }
}
```

## 异步组件——Suspense
Suspense组件，允许程序在等待异步组件时渲染兜底的内容，如loading，使用户体验更丝滑。

能暂停你的组件渲染，并渲染后备组件，直到条件满足为止。

在default中的组件完全渲染前，将会显示后备内容。挂起可以等待，直到该组件被下载（异步组件），或者在setup中执行一些异步操作。

使用：在模板中声明，并包括两个命名插槽：default, fallback
```html
<template>
  <suspense>
    <template #default>
      <todo-list/>
    </template>
    <template #fallback>
      <div> loading </div>
    </template>
  </suspense>
</template>
```

## Teleport
提供Teleport组件，可将部分DOM移到Vue app之外的位置，如常见的Dialog组件

## 虚拟DOM
增加了patchFlag字段。

`_createElementVMode('div', null, _toDisplayString(_ctx.name), 1)`

第四个参数即patchFlag字段类型，1为动态文本节点，那么在diff过程中，只需要比对文本内容，无需关注class,style等。所有的静态节点，都保存为一个变量进行静态提升，可在重新渲染时直接引用，无需重新创建。

```javascript
export const enum PatchFlags {
  TEXT = 1, // 动态文本内容
  CLASS = 1 << 1, // 动态类名
  STYLE = 1 << 2, // 动态样式
  PROPS = 1 << 3, // 动态属性，不包含类名和样式
  FULL_PROPS = 1 << 4, // 具有动态 key 属性，当 key 改变，需要进行完整的 diff 比较
  ...
}
```

Diff优化：

patchFlag帮助diff时区分静态节点，以及不同类型的动态节点，一定程度上减少节点本身及其属性的比对。

## 打包优化 —— tree-shaking
移除Javascript上下文中未被引用的代码。主要依赖于import和export语句，用来检测代码模块是否被导出、导入，且被Javascript文件使用。

在Vue2中，全局API暴露在Vue实例上，即使未使用，也无法通过tree-shaking进行消除
```javascript
// Vue2
import Vue from 'vue'
Vue.nextTick(() => {

})

//Vue3
import { nextTick } from 'vue'
nextTick(() => {})
```

Vue3针对全局和内部API进行了重构，并考虑到tree-shaking的支持，因此全局API现在只能作为ES模块构建的命名导出进行访问。`In Vue 3, the global and internal APIs have been restructured with tree-shaking support in mind.`。没有用到的方法（代码）不会被打包到最终的包中，这可以优化项目体积。

只要2模块绑定器支持tree-shaking，则Vue应用程序中未使用的api将从最终的捆绑包中消除，获得最佳文件大小。



- 受到更改影响的全局API
  - Vue.nextTick, observable(用Vue.reactive替换),version, compile(仅全构建)，set(仅兼容构建)，delete(仅兼容构建)

内部 API 也有诸如 transition、v-model等标签或者指令被命名导出。只有在程序真正使用才会被捆绑打包。

## 自定义渲染API
Vue3的createApp默认将template映射成html，但若想生成canvas，就需要使用 custom renderer api 自定义render生成函数

## TypeScript支持
Vue3由TS重写，相对Vue2更好地支持TypeScript。
- Vue2的Option API中，option是个简单对象，而TS是一种类型系统，面向对象的语法，不是特别匹配
- Vue2需要vue-class-component强化vue原生组件，也需要vue-property-decorator增加更多结合Vue特性的装饰器，写法繁琐

## 异步组件需要显式定义
```javascript
import { defineAsyncComponent } from 'vue'
const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))
```

## $attrs将包含class和style
Vue2中，class和style会被直接设置在组件的根元素上，并且不会出现在$attrs中

Vue3中，如果子组件只有一个根组件，则class和style会被直接设置在该元素上。超过一个则不会设置，如果组件中设置了 inheritAttrs: false,则无论如何都不会设置根元素的class和style

$listeners也被包含在了 $attrs 中。

## $children被移除，使用 $refs
## 事件API（$on,$off,$once）被移除,EventBus的方法不再使用

## 监听数组变化，需要用deep

## template允许设置key

## scopedSlots正式弃用

## filter被移除

## useXXX
第三方库更优雅的使用方式，不会污染Vue原型。

