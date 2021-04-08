# Vue
## Vue 的核心是什么
数据驱动 组件系统

## vue 等单页面应用的优缺点
1. 优点：
- 良好的交互体验
- 良好的前后端工作分离模式
- 减轻服务器压力

2. 缺点：
- SEO难度较高
- 前进、后退管理
- 初次加载耗时多

## 对 MVC、MVVM的理解 (阮一峰 （http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html）)
1. MVC

特点：
- View 传送指令到 Controller
- Controller 完成业务逻辑后，要求 Model 改变状态
- Model 将新的数据发送到 View，用户得到反馈
- 所有通信都是单向的

2. MVVM

MVVM 模式，顾名思义即 Model-View-ViewModel 模式。它萌芽于2005年微软推出的基于 Windows 的用户界面框架 WPF ，前端最早的 MVVM 框架 knockout 在2010年发布。

- Model 层: 对应数据层的域模型，它主要做域模型的同步。通过 Ajax/fetch 等 API 完成客户端和服务端业务 Model 的同步。在层间关系里，它主要用于抽象出 ViewModel 中视图的 Model。

也可以在Model中定义数据修改和操作的业务逻辑。

- View 层:作为视图模板存在，在 MVVM 里，整个 View 是一个动态模板。除了定义结构、布局外，它展示的是 ViewModel 层的数据和状态。View 层不负责处理状态，View 层做的是 数据绑定的声明、 指令的声明、 事件绑定的声明。

- ViewModel 层:把 View 需要的层数据暴露，并对 View 层的 数据绑定声明、 指令声明、 事件绑定声明 负责，也就是处理 View 层的具体业务逻辑。ViewModel 底层会做好绑定属性的监听。当 ViewModel 中数据变化，View 层会得到更新；而当 View 中声明了数据的双向绑定（通常是表单元素），框架也会监听 View 层（表单）值的变化。一旦值变化，View 层绑定的 ViewModel 中的数据也会得到自动更新。

View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互，Model 和
ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

3. 特点：
- 各部分之间的通信，都是双向的
- 采用双向绑定：View 的变动，自动反映在 ViewModel，反之亦然

4. 优点:
- 分离视图（View）和模型（Model）,降低代码耦合，提高视图或者逻辑的重用性: 比如视图（View）可以独立于Model变化和修改，一个ViewModel可以绑定不同的"View"上，当View变化的时候Model不可以不变，当Model变化的时候View也可以不变。你可以把一些视图逻辑放在一个ViewModel里面，让很多view重用这段视图逻辑
- 提高可测试性: ViewModel的存在可以帮助开发者更好地编写测试代码
- 自动更新dom: 利用双向绑定,数据更新后视图自动更新,让开发者从繁琐的手动dom中解放

5. 缺点:

- Bug很难被调试: 因为使用双向绑定的模式，当你看到界面异常了，有可能是你View的代码有Bug，也可能是Model的代码有问题。数据绑定使得一个位置的Bug被快速传递到别的位置，要定位原始出问题的地方就变得不那么容易了。另外，数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的
- 一个大的模块中model也会很大，虽然使用方便了也很容易保证了数据的一致性，当时长期持有，不释放内存就造成了花费更多的内存
- 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高

## 实现mvvm，vue数据驱动视图原理
1. MVVM(Model-View-ViewModel)
model层，对应数据层，通过Ajax等API完成client和server业务model的同步
view层，作为视图模板存在，是一个动态模板，展示ViewModel层的数据和状态。完成数据，指令，事件绑定的声明
ViewModel层，把View需要的数据暴露，处理View层的具体业务逻辑。
viewmodel层做好绑定属性的监听，viewmodel中数据变化时，view层得到更新；
view中声明了数据的双向绑定，框架也会监听view层（表单）值的变化。一旦值变化，view层绑定的viewmodel层的数据也自动更新。

优点：分离view和model，提供视图的重用性
     利用双向绑定，数据更新后自动更新视图，免去手动更新dom
缺点：bug难调试，无法定位问题；视图状态多的化，viewmodel的构建维护成本都会较高。

## 单向数据流和双向数据绑定
- 单向数据流： 顾名思义，数据流是单向的。数据流动方向可以跟踪，流动单一，追查问题的时候可以更快捷。缺点就是写起来不太方便。要使UI发生变更就必须创建各种 action 来维护对应的 state

- 双向数据绑定：数据之间是相通的，将数据变更的操作隐藏在框架内部。优点是在表单交互较多的场景下，会简化大量与业务无关的代码。缺点就是无法追踪局部状态的变化，增加了出错时 debug 的难度

## Vue双向绑定原理, vue 发布订阅
利用Object.defineProperty劫持对象的访问器，在属性值发生变化时，可以获取变化，然后根据变化进行后续响应。

采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调

```javascript
const data = {
    name : '',
}
Object.keys(data).forEach(function(key) {
    Object.defineProperty(data,key,{
        enumerable: true,
        configurable: true,
        get:function() {
            console.log('get');
        },
        set: function(newVal) {
            console.log(`newVal is ${newVal}`)
        }
    });
});

data.name = 'xxx';
```

2. 响应式系统：
- 任何一个Vue组件有一个与之对应的渲染Watcher实例
- Vue的data上的属性会被添加getter和setter属性（在initData中，遍历data中用于视图的属性，用Object.defineProperty劫持各个属性的getter/setter，对数据进行监听）

- 当Vue组件的render函数被执行时，data 上会被 触碰(touch),即被读, 通过一次渲染操作，触发data的getter方法进行依赖收集(记录此 Vue component 所依赖的所有 data)。（dep.depend()，此时数据和watcher可以看成一种被绑定的状态）
- data数据变化时，setter方法被触发，Vue会通知（dep.notify()遍历所有的订阅者）data的watcher进行update/回调，通知（所有依赖于此data的）组件去调用它们的render函数重新渲染，根据diff算法决定是否发生视图更新。

3. 依赖收集/数据更新
Dep——消息订阅器，内部维护了一个数组，用来收集订阅器（watcher）；
Observer——作用是遍历对象的所有属性，将其进行双向数据绑定

在Vue的mount挂载的过程中，会实例化一个渲染watcher，通过一次渲染操作对实例上的数据访问，触发了数据对象的getter方法，通过dep.depend()，将当前watcher添加到这个数据的dep的subs订阅者数组中（知道这个数据有哪些依赖）。这个过程中，触发所有数据的getter，完成当前实例的依赖收集过程。

初始化完毕后，当数据变化时，observer中的setter方法被触发，立即调用dep.notify()，Dep遍历所有的订阅者（watchers），并调用watcher的update方法，对视图进行相应更新。

在vue3.0中通过Proxy代理对象进行类似的操作。

### js实现简单的双向绑定
vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。

<body>
    <div id="app">
    <input type="text" id="txt">
    <p id="show"></p>
</div>
</body>
<script type="text/javascript">
    var obj = {}
    Object.defineProperty(obj, 'txt', {
        get: function () {
            return obj
        },
        set: function (newValue) {
            document.getElementById('txt').value = newValue
            document.getElementById('show').innerHTML = newValue
        }
    })
    document.addEventListener('keyup', function (e) {
        obj.txt = e.target.value
    })
</script>



## Proxy与Object.defineProperty的优劣对比?

[Vue3为什么选择Proxy做双向绑定？](https://mp.weixin.qq.com/s?__biz=MzI3NjM1OTI3Mw==&mid=2247483695&idx=1&sn=8f4d74b58f4102eced8089bcaac4c443&chksm=eb77f029dc00793f502d4a39819e488d560e6bf7d268f3e987a03d43d71a07a2edab59d8d78f&scene=21#wechat_redirect)
Proxy的优势如下:

Proxy可以直接监听对象而非属性

Proxy可以直接监听数组的变化

Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的

Proxy返回的是一个新对象,我们可以只操作新的对象达到目的,而Object.defineProperty只能遍历对象属性直接修改

Proxy作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利

Object.defineProperty的优势如下:

兼容性好,支持IE9

## 直接给一个数组项赋值，Vue 能检测到变化吗？
由于 JavaScript 的限制，Vue 不能检测到以下数组的变动：
当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
当你修改数组的长度时，例如：vm.items.length = newLength

为了解决第一个问题，Vue 提供了以下操作方法：

```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// vm.$set，Vue.set的一个别名
vm.$set(vm.items, indexOfItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
为了解决第二个问题，Vue 提供了以下操作方法：

// Array.prototype.splice
vm.items.splice(newLength)
```

## Vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？
受现代 JavaScript 的限制 ，Vue 无法检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。但是 Vue 提供了 Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value) 来实现为对象添加响应式属性，那框架本身是如何实现的呢？

Vue 源码
```javascript
export function set (target: Array<any> | Object, key: any, val: any): any {
  // target 为数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度, 避免索引>数组长度导致splcie()执行有误
    target.length = Math.max(target.length, key)
    // 利用数组的splice变异方法触发响应式
    target.splice(key, 1, val)
    return val
  }
  // key 已经存在，直接修改属性值
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // target 本身就不是响应式数据, 直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 对属性进行响应式处理
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```
阅读以上源码可知，vm.$set 的实现原理是：
- 如果目标是数组，直接使用数组的 splice 方法触发相应式；
- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

## Vue.set的机制
由于Javascript的限制，Vue不能自动检测以下变动的数组：通过下标设置一个项，或修改数组长度
对象添加属性，Vue也不能自动检测

变异方法：
Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新。这些方法如下：
push(), pop(), shift() ,unshift(), splice(), sort(), reverse()

替换数组：
filter(), concat() 和 slice() 。这些不会改变原始数组，但总是返回一个新数组。当使用非变异方法时，可以用新数组替换旧数组：

注意事项:
由于 JavaScript 的限制，Vue 不能检测以下变动的数组：

- 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如：vm.items.length = newLength

变通方法：

Vue.set(vm.items, indexOfItem, newValue)
vm.items.splice(indexOfItem, 1, newValue)

用Vue.set(target,key,newVal),删除用Vue.del

继承了Array，对数组的所有能改变数组自身的方法重写，重写后先执行它们自身的原有逻辑，并对能增加数组长度push,shift,unshift做了判断，获取到插入值，把新添加的值变成响应式对象，并调用ob.dep.notify手动触发依赖通知。
如果target为数组，通过重写的splice添加进数组，defineReactive，将新添的属性变成响应式对象，dep.notify手动触发依赖通知

Vue3.0使用Proxy代理对象：
- Proxy可以直接监听对象而非属性
- Proxy可以监听数组的变化
- Proxy有很多拦截方法，apply,deleteProperty,has等是defineProperty不具备的
- Proxy返回新对象，我们可以只操作新对象达到目的，而Object.defineProperty只能遍历对象属性进行修改

## vue的v-model原理
v-model，怎么封装的？
怎么封装个组件，把 v-model 暴露出去

说说对v-model的了解？
我们在 vue 项目中主要使用 v-model 指令在表单 input、textarea、select 等元素上创建双向数据绑定，我们知道 v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：
text 和 textarea 元素使用 value 属性和 input 事件；
checkbox 和 radio 使用 checked 属性和 change 事件；
select 字段将 value 作为 prop 并将 change 作为事件。
以 input 表单元素为例：

<input v-model='something'>
相当于

<input v-bind:value="something" v-on:input="something = $event.target.value">
如果在自定义组件中，v-model 默认会利用名为 value 的 prop 和名为 input 的事件，如下所示：
父组件：

<ModelChild v-model="message"></ModelChild>
子组件：

<div>{{value}}</div>

props:{
    value: String
},
methods: {
  test1(){
     this.$emit('input', '小红')
  },
},

## 什么是vue的计算属性？
答：在模板中放入太多的逻辑会让模板过重且难以维护，在需要对数据进行复杂处理，且可能多次使用的情况下，尽量采取计算属性的方式。好处：①使得数据处理结构清晰；②依赖于数据，数据更新，处理结果自动更新；③计算属性内部this指向vm实例；④在template调用时，直接写计算属性名即可；⑤常用的是getter方法，获取数据，也可以使用set方法改变数据

## **computed 与 watch 的内在如何实现及其区别**
1. computed，是computed watcher
- 计算属性，也就是计算值，更多用于计算值的场景，常用于模板渲染
- 具有缓存性，computed的值在getter执行后会缓存，只有它依赖的属性发生变化后，下一次获取computed的值时才会重新调用对应的getter来计算
- 适用于计算比较消耗性能的计算场景,当你在模板内使用了复杂逻辑的表达式时，应当使用计算属性。
2. watch，是user watch
- 更多是“观察”的作用，类似于某些数据的监听回调，用于观察props或本组件的值，当数据变化时执行回调进行后续操作
- 无缓存性，页面重新渲染时值不变化也会执行

需要在某个数据变化时做一些事情，就用watcher来观察这个数据变化
需要进行数值计算时，而且依赖于其他数据，则设计为computed

watch与computed的区别
  1.watch擅长处理的场景：一个数据影响多个数据
  2.computed擅长处理的场景：一个数据受多个数据影响

侦听属性是一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。
当你有一些数据需要随着其它数据变动而变动时，或者当需要在数据变化时执行异步或开销较大的操作时，你可以使用 watch。

## 计算属性computed 和事件 methods 有什么区别
我们可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的

不同点：

computed: 计算属性是基于它们的依赖进行缓存的,只有在它的相关依赖发生改变时才会重新求值
对于 method ，这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

只要发生重新渲染，method 调用总会执行该函数

计算属性（computed）、方法（methods）和侦听属性（watch）的区别与使用场景
m

总之，重新计算开销很大的话请选计算属性，不希望有缓存的请选methods。

## 异步更新视图
当状态发送变化时，Vue异步执行DOM更新。

将渲染操作推迟到本轮事件循环的最后，或者下一轮事件循环。即在本轮事件循环的最后，等更新状态的语句都执行完后，再执行一次渲染操作。优先推迟到本轮事件循环的最后（micro tasks），如果执行环境不支持，降到下一轮（macro tasks）

工作流程：
- vue在每次状态变化时发出渲染的信号，收到信号后检查队列中是否存在该任务，保证不重复；不存在，就将渲染操作添加到队列中。当一轮事件循环中反复修改状态时，不会反复向队列中添加相同的渲染操作
- 通过异步的方式延迟执行队列中的所有渲染操作（用nextTick将渲染操作的回调加到microtask或task中，异步触发），并清空队列。
- 当执行栈空了，会检查micro tasks中是否有任务，将其执行完后，去macro拿一个任务执行，再去检查microtasks，清空后再去执行一个macro task——这样持续交替执行任务，叫做事件循环。

## 合成事件原理
## $nextTick
目的是产生一个回调函数，加入task或micro task中，起到异步触发（下一个tick触发）的目的。

将传入的回调压入callbacks数组，当不在等待状态时，调用timerFunc（优先检测是否支持promise，mutationObserver，timerFunc返回Promise,不支持流返回setImediate,setTimeout），加回调加入microtask或task中，继续进入等待状态

执行的时候，当主线程执行栈执行完毕时，对callbacks进行遍历，依次执行相应的回调函数。

$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM

## 页面渲染原理
vue从data改变到页面渲染的过程

## 生命周期
Vue实例有一个完整的生命周期，从开始创建，初始化数据，编译模板，挂载DOM，渲染、更新，渲染、卸载等一系列过程，称为生命周期。

生命周期的作用：生命周期中有多个事件钩子，让我们在控制整个Vue实例的过程时更容易形成好的逻辑。
new Vue()-->this._init()
initCycle(),initEvent
1. beforeCreate，组件实例被创建之初，组件属性生效之前，initState之前。在实例创建之间执行，数据未加载状态；
initState,injection,provide
2. created,**组件实例已经完全创建**，属性也绑定，真实dom未生成，$el不可用,vm可用。在实例创建、数据加载后，能初始化数据，dom渲染之前执行；
编译模板，把Vue代码中的指令进行执行，最终在内存中生成一个编译好的最终模板字符串，把模板字符串渲染为内存中的dom。此时，只是在内存中渲染好了模板，并没有挂载到真正的页面中。
3. beforeMount，挂载开始之前被调用，相关render函数首次被调用。虚拟dom已创建完成，在数据渲染前最后一次更改数据；
4. mounted，页面、数据渲染完成，真实dom挂载完成；el被新创建的vm.$el替换（将内存中编译好的模板真实替换到页面上），并**挂载到实例上**去之后调用该钩子；如果要操作页面上的DOM，最早在mounted中进行
vue实例初始化完毕，进入运行阶段
5. beforeUpdate，组件数据更新前调用，重新渲染之前触发；发生在虚拟 DOM 打补丁之前
虚拟DOM树重新渲染，diff后渲染到真实页面中，完成从data->view的更新
6. updated，组件数据更新后，dom 也重新 render 完成，页面和dom已更新同步，
7. beforeDestroy，组件销毁前调用（实例仍然完全可用），data，method等仍可用
解除watchers，销毁子组件，移除所有事件监听
8. destroyed，组件销毁后调用

activited	keep-alive专属，组件被激活时调用
deadctivated	keep-alive专属，组件被销毁时调用


### 第一次页面加载会触发哪几个钩子？
答：会触发 下面这几个beforeCreate, created, beforeMount, mounted 。

A组件包裹B组件，B组件包裹C组件，它们的 componentDidMount 触发顺序如何
Vue 的父组件和子组件生命周期钩子执行顺序是什么

生命周期及对应的行为，vue父子组件生命周期执行顺序
  - created和beformounted 中间发生了什么
    created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
    mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
在Vue渲染组件的时候，都是从父到子组件再到父组件，如果你是框架的设计者，你会怎么做

## 在哪个生命周期内调用异步请求？
官方实例的异步请求是在mounted生命周期中调用的，而实际上也可以在created生命周期中调用

可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是本人推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

能更快获取到服务端数据，减少页面 loading 时间；
ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## 父组件可以监听到子组件的生命周期吗
比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

// Parent.vue
```html
<Child @mounted="doSomething"/>

// Child.vue
mounted() {
  this.$emit("mounted");
}
```
以上需要手动通过 $emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

//  Parent.vue
```html
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},
```

//  Child.vue
```javascript
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},
```
// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
当然 @hook 方法不仅仅是可以监听 mounted，其它的生命周期事件，例如：created，updated 等都可以监听

## Vue为什么没有类似于React中shouldComponentUpdate的生命周期？
考点: Vue的变化侦测原理

前置知识: 依赖收集、虚拟DOM、响应式系统

根本原因是Vue与React的变化侦测方式有所不同

React是pull的方式侦测变化,当React知道发生变化后,会使用Virtual Dom Diff进行差异检测,但是很多组件实际上是肯定不会发生变化的,这个时候需要用shouldComponentUpdate进行手动操作来减少diff,从而提高程序整体的性能.

Vue是pull+push的方式侦测变化的,在一开始就知道那个组件发生了变化,因此在push的阶段并不需要手动控制diff,而组件内部采用的diff方式实际上是可以引入类似于shouldComponentUpdate相关生命周期的,但是通常合理大小的组件不会有过量的diff,手动优化的价值有限,因此目前Vue并没有考虑引入shouldComponentUpdate这种手动优化的生命周期.

## Vue的组件通信
1. props/$emit+v-on，通过props将数据从父->子传递，通过$emit和v-on将数据从子->父传递
2. EventBus：通过EventBus进行信息的发布和订阅，通过一个空的vue实例作为中央事件总线，用它来触发和监听事件$emit,$on；在按钮事件中调用Event.$emit
因为不确定何时触发事件，一般在组件的mounted或created中，Event.$on监听事件
3. vuex全局数据管理库，可通过vuex管理全局的数据流
4. $attr/$listeners，Vue2.4加入，可进行跨级的组件通信，$attr父组件中绑定的非props属性，供子组件访问；通过v-on =‘$listeners'，包含父组件中绑定的非原生事件，子组件可以访问$listeners来自定义监听器
5. provide/inject，父组件通过provide向所有子孙后代注入依赖，不论组件层次多深，在起上下游成立的时间里始终生效。子组件中使用inject注入祖先组件提供的变量。
6. $parent/$children&ref，访问父子实例，ref在普通DOM上使用，指向的是DOM元素，在子组件上，就指向组件实例。

组件间通信方法（父子, 兄弟, 跨级）, $listener和$attr

## keep-alive实现原理
keep-alive是 Vue 内置的一个组件，名称匹配的组件会被缓存。在组件间切换，可以使被包含的组件保留状态，避免重复渲染。

组件在keep-alive内被切换，activated和deactivated生命周期钩子函数会被对应执行。

```html
<keep-alive>
  <component>
    <!-- 该组件将被缓存！ -->
  </component>
</keep-alive>
```
可以使用API提供的props，实现组件的动态缓存

在vue 2.1.0 版本之后，keep-alive新加入了两个属性: include(包含的组件缓存) 与 exclude(排除的组件不缓存，优先级大于include) 。

```html
<keep-alive include='include_components' exclude='exclude_components'>
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>
```
参数解释
- include - 字符串或正则表达式，只有名称匹配的组件会被缓存
- exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind 。

```html
<!-- 逗号分隔字符串，只有组件a与b被缓存。 -->
<keep-alive include="a,b">
  <component></component>
</keep-alive>

<!-- 正则表达式 (需要使用 v-bind，符合匹配规则的都会被缓存) -->
<keep-alive :include="/a|b/">
  <component></component>
</keep-alive>

<!-- Array (需要使用 v-bind，被包含的都会被缓存) -->
<keep-alive :include="['a', 'b']">
  <component></component>
</keep-alive>
```
## Vue的data为什么要写成function，返回一个对象
组件是用来复用的，vue构建的时候会用Vue.extend将组件包成一个类，页面使用的时候，会创建包成类的实例，vue中的data里面的数据，可能不止被一个组件所调用。如果直接写成对象，每一个实例都共享data数据了,在调用的时候就会被修改，各个组件之间的值会有影响

如果 data 是一个对象，对象本身属于引用类型，当我们修改其中的一个属性时，会影响到所有Vue实例的数据。如果将 data 作为一个函数返回一个对象，那么每一个实例的 data 属性都是独立的，不会相互影响了

## Vue为什么需要一个根元素
## Vue的挂载怎么实现，el和$mount有什么区别

vue 代码复用的方式
## 技术选型上为何选择Vue，Vue的缺陷

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

1.监测机制的改变
Vue3.0 将带来基于代理 Proxy 的 observer 实现，提供全语言覆盖的反应性跟踪。这消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：①只能监测属性，不能监测对象；②检测属性的添加和删除；③检测数组索引和长度的变更；④支持 Map、Set、WeakMap 和 WeakSet。
新的 observer 还提供了以下特性：
用于创建 observable 的公开 API。这为中小规模场景提供了简单轻量级的跨组件状态管理解决方案。
默认采用惰性观察。在 2.x 中，不管反应式数据有多大，都会在启动时被观察到。如果你的数据集很大，这可能会在应用启动时带来明显的开销。在 3.x 中，只观察用于渲染应用程序最初可见部分的数据。
更精确的变更通知。在 2.x 中，通过 Vue.set 强制添加新属性将导致依赖于该对象的 watcher 收到变更通知。在 3.x 中，只有依赖于特定属性的 watcher 才会收到通知。
不可变的 observable：我们可以创建值的“不可变”版本（即使是嵌套属性），除非系统在内部暂时将其“解禁”。这个机制可用于冻结 prop 传递或 Vuex 状态树以外的变化。
更好的调试功能：我们可以使用新的 renderTracked 和 renderTriggered 钩子精确地跟踪组件在什么时候以及为什么重新渲染。

2.模板
模板方面没有大的变更，只改了作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。
3.对象式的组件声明方式
vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易。
此外，vue 的源码也改用了 TypeScript 来写。其实当代码的功能复杂之后，必须有一个静态类型系统来做一些辅助管理。现在 vue3.0 也全面改用 TypeScript 来重写了，更是使得对外暴露的 api 更容易结合 TypeScript。静态类型系统对于复杂代码的维护确实很有必要。
4.其它方面的更改
vue3.0 的改变是全面的，上面只涉及到主要的 3 个方面，还有一些其它的更改：
支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
支持 Fragment（多个根节点）和 Protal（在 dom 其它部分渲染组建内容）组件，针对一些特殊的场景做了处理。
基于 treeshaking 优化，提供了更多的内置功能。

## Vue hooks的使用
## 如何批量引入组件
require.context()

可以使用require.context（）函数创建自己的上下文。 它允许您传入一个目录进行搜索，一个标志指示是否应该搜索子目录，还有一个正则表达式来匹配文件。

## vue常用的修饰符？
答：.prevent: 提交事件不再重载页面；.stop: 阻止单击事件冒泡；.self: 当事件发生在该元素本身而不是子元素的时候会触发；.capture: 事件侦听，事件发生的时候会调用

## 组件化
前端主要工作是UI开发，而把UI上的各种元素分解成组件，规定组件的标准，实现组件运行的环境就是组件化了。
符合原本的 JavaScript/CSS/HTML 书写习惯；绑定了 MVVM 模式，直接确定了 UI 架构，数据交互非常简洁。

## Vue-Cli
vue.js的脚手架工具。说白了就是一个自动帮你生成好项目目录，配置好Webpack，以及各种依赖包的工具。

### 如何设计一个组件

第 94 题：vue 在 v-for 时给每项元素绑定事件需要用事件代理吗？为什么？

数据双向绑定单向绑定优缺点
Vue 的响应式原理中 Object.defineProperty 有什么缺陷？
为什么在 Vue3.0 采用了 Proxy，抛弃了 Object.defineProperty？
使用 JavaScript Proxy 实现简单的数据绑定

1. React和 vue选型和优缺点、核心架构的区别

熟练使用 Vue的 API、基本指令、钩子函数，实例的属性和方法； 组件基础: 创建,注册,添加属性方法,套用等...
插槽slot：v-slot, slot-scope
在 Vue 中，子组件为何不可以修改父组件传递的 Prop；如果修改了，Vue 是如何监控到属性的修改并给出警告的。

observer，watcher，compile
从 template转换成真实 DOM的实现机制
vue构建过程原理,具体流程
模板到DOM大致流程:
  template模板经过parse处理后返回AST 获得一棵AST后再经过generate()生成渲染函数
  执行渲染函数后会获得一个VNode，即虚拟DOM patch函数，负责把虚拟DOM变为真正DOM。

自定义插件

## 如何实现一个指令
  -- - 自定义指令（v-check、v-focus）的方法有哪些?它有哪些钩子函数？还有哪些钩子函数参数
    全局定义指令：在vue对象的directive方法里面有两个参数，一个是指令名称，另外一个是函数。
    组件内定义指令：directives 钩子函数：bind（绑定事件触发）、inserted(节点插入的时候触发)、update（组件内相关更新） 钩子函数参数：el、binding

1.创建局部指令

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
## vue如何自定义一个过滤器？

可以用全局方法 Vue.filter() 注册一个自定义过滤器，它接收两个参数：过滤器 ID 和过滤器函数。过滤器函数以值为参数，返回转换后的值
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
<!-- 'abc' => 'cba' -->
<span v-text="message | reverse"></span>
过滤器也同样接受全局注册和局部注册

html代码：

```html
<div id="app">
     <input type="text" v-model="msg" />
     {{msg| capitalize }}
</div>
```
JS代码：

```javascript
var vm=new Vue({
    el:"#app",
    data:{
        msg:''
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
})
```

全局定义过滤器

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```
过滤器接收表达式的值 (msg) 作为第一个参数。capitalize 过滤器将会收到 msg的值作为第一个参数。


vue2新增内容?独立构建（standalone）和运行时构建（runtime-only）的差别和应用?

介绍状态机

怎么看待组件层级嵌套很多层

vue 怎么进行性能优化的

9. v-if 和 v-show 区别
使用了 v-if 的时候，如果值为 false ，那么页面将不会有这个 html 标签生成。
v-show 则是不管值为 true 还是 false ，html 元素都会存在，只是 CSS 中的 display 显示或隐藏

## 服务端渲染 SSR or 预渲染
Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

即：SSR大致的意思就是vue在客户端将标签渲染成的整个 html 片段的工作在服务端完成，服务端形成的html 片段直接返回给客户端这个过程就叫做服务端渲染。

1. 优点：
- 更好的 SEO： 因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
- 更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

2. 缺点：
- 更多的开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
- 更多的服务器负载：在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用CPU 资源。因此如果你预料在高流量环境下使用，请准备相应的服务器负载，并明智地采用缓存策略。

3. 预渲染

如果你的项目的 SEO 和 首屏渲染是评价项目的关键指标，那么你的项目就需要服务端渲染来帮助你实现最佳的初始加载性能和 SEO。如果你的 Vue 项目只需改善少数营销页面（例如  /products， /about， /contact 等）的 SEO，那么你可能需要预渲染，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点，具体你可以使用 prerender-spa-plugin 就可以轻松地添加预渲染 。

## 对 SPA 单页面的理解，它的优缺点分别是什么？
SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。
优点：
用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
基于上面一点，SPA 相对对服务器压力小；
前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；
缺点：
初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。

### vue等单页面应用及其优缺点
答：优点：Vue 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件，核心是一个响应的数据绑定系统。MVVM、数据驱动、组件化、轻量、简洁、高效、快速、模块友好。

缺点：不支持低版本的浏览器，最低只支持到IE9；不利于SEO的优化（如果要支持SEO，建议通过服务端来进行渲染组件）；第一次加载首页耗时相对长一些；不可以使用浏览器的导航按钮需要自行实现前进、后退。

