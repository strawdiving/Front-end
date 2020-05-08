# Vue
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

## Vue双向绑定原理, vue 发布订阅
利用Object.defineProperty劫持对象的访问器，在属性值发生变化时，可以获取变化，然后根据变化进行后续响应。
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
- Vue组件有一个与之对应的渲染Watcher实例
- Vue的data上的属性会被添加getter和setter属性（在initData中，遍历data中用于视图的属性，用Object.defineProperty劫持各个属性的getter/setter，对数据进行监听）

- 当Vue组件的render函数被执行时，通过一次渲染操作，触发data的getter方法进行依赖收集。（dep.depend()，此时数据和watcher可以看成一种被绑定的状态）
- data数据变化时，setter方法被触发，Vue会通知（dep.notify()遍历所有的订阅者）data的watcher进行update/回调，通知（所有依赖于此data的）组件去调用它们的render函数重新渲染，根据diff算法决定是否发生视图更新。

3. 依赖收集/数据更新
Dep——消息订阅器，内部维护了一个数组，用来收集订阅器（watcher）；
Observer——作用是遍历对象的所有属性，将其进行双向数据绑定

在Vue的mount挂载的过程中，会实例化一个渲染watcher，通过一次渲染操作对实例上的数据访问，触发了数据对象的getter方法，通过dep.depend()，将当前watcher添加到这个数据的dep的subs订阅者数组中（知道这个数据有哪些依赖）。这个过程中，触发所有数据的getter，完成当前实例的依赖收集过程。

初始化完毕后，当数据变化时，observer中的setter方法被触发，立即调用dep.notify()，Dep遍历所有的订阅者（watchers），并调用watcher的update方法，对视图进行相应更新。

## Vue.set的机制 
由于Javascript的限制，Vue不能自动检测以下变动的数组：通过下标设置一个项，或修改数组长度
对象添加属性，Vue也不能自动检测

用Vue.set(target,key,newVal),删除用Vue.del

继承了Array，对数组的所有能改变数组自身的方法重写，重写后先执行它们自身的原有逻辑，并对能增加数组长度push,shift,unshift做了判断，获取到插入值，把新添加的值变成响应式对象，并调用ob.dep.notify手动触发依赖通知。
如果target为数组，通过重写的splice添加进数组，defineReactive，将新添的属性变成响应式对象，dep.notify手动触发依赖通知

Vue3.0使用Proxy代理对象：
- Proxy可以直接监听对象而非属性
- Proxy可以监听数组的变化
- Proxy有很多拦截方法，apply,deleteProperty,has等是defineProperty不具备的
- Proxy返回新对象，我们可以只操作新对象达到目的，而Object.defineProperty只能遍历对象属性进行修改

## vue的v-model原理

## **computed 与 watch 的内在如何实现及其区别**
1. computed，是computed watcher
- 计算属性，也就是计算值，更多用于计算值的场景，常用于模板渲染
- 具有缓存性，computed的值在getter执行后会缓存，只有它依赖的属性发生变化后，下一次获取computed的值时才会重新调用对应的getter来计算
- 适用于计算比较消耗性能的计算场景
2. watch，是user watch
- 更多是“观察”的作用，类似于某些数据的监听回调，用于观察props或本组件的值，当数据变化时执行回调进行后续操作
- 无缓存性，页面重新渲染时值不变化也会执行

需要在某个数据变化时做一些事情，就用watcher来观察这个数据变化
需要进行数值计算时，而且依赖于其他数据，则设计为computed

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
## 页面渲染原理

## 生命周期
Vue实例有一个完整的生命周期，从开始创建，初始化数据，编译模板，挂载DOM，渲染、更新，渲染、卸载等一系列过程，称为生命周期。
new Vue()-->this._init()
initCycle(),initEvent
1. beforeCreate，组件实例被创建之初，组件属性生效之前，initState之前
initState,injection,provide
2. created,**组件实例已经完全创建**，属性也绑定，真实dom未生成，$el不可用,vm可用
编译模板，把Vue代码中的指令进行执行，最终在内存中生成一个编译好的最终模板字符串，把模板字符串渲染为内存中的dom。此时，只是在内存中渲染好了模板，并没有挂载到真正的页面中。
3. beforeMount，挂载开始之前被调用，相关render函数首次被调用
4. mounted，el被新创建的vm.$el替换（将内存中编译好的模板真实替换到页面上），并**挂载到实例上**去之后调用该钩子；如果要操作页面上的DOM，最早在mounted中进行
vue实例初始化完毕，进入运行阶段
5. beforeUpdate，组件数据更新前调用
虚拟DOM树重新渲染，diff后渲染到真实页面中，完成从data->view的更新
6. updated，组件数据更新后，页面和dom已更新同步
7. beforeDestroy，组件销毁前调用，data，method等仍可用
解除watchers，销毁子组件，移除所有事件监听
8. destroyed，组件销毁后调用

异步请求适合在mounted中调用，也可以在created中调用

event类 on once等方法

## Vue的组件通信
1. props/$emit+v-on，通过props将数据从父->子传递，通过$emit和v-on将数据从子->父传递
2. EventBus：通过EventBus进行信息的发布和订阅，通过一个空的vue实例作为中央事件总线，用它来触发和监听事件$emit,$on；在按钮事件中调用Event.$emit
因为不确定何时触发事件，一般在组件的mounted或created中，Event.$on监听事件 
3. vuex全局数据管理库，可通过vuex管理全局的数据流
4. $attr/$listeners，Vue2.4加入，可进行跨级的组件通信，$attr父组件中绑定的非props属性，供子组件访问；通过v-on =‘$listeners'，包含父组件中绑定的非原生事件，子组件可以访问$listeners来自定义监听器
5. provide/inject，父组件通过provide向所有子孙后代注入依赖，不论组件层次多深，在起上下游成立的时间里始终生效。子组件中使用inject注入祖先组件提供的变量。
6. $parent/$children&ref，访问父子实例，ref在普通DOM上使用，指向的是DOM元素，在子组件上，就指向组件实例。

## keep-alive实现原理
用keep-alive，名称匹配的组件会被缓存。在组件间切换，可以保持组件的状态，避免重复渲染。
组件在keep-alive内被切换，activated和deactivated生命周期钩子函数会被对应执行。

react vdom和vue的区别

## Vue的data为什么要写成function，返回一个对象
组件是用来复用的，vue构建的时候会用Vue.extend将组件包成一个类，页面使用的时候，会创建包成类的实例，vue中的data里面的数据，可能不止被一个组件所调用。如果直接写成对象，每一个实例都共享data数据了,在调用的时候就会被修改，各个组件之间的值会有影响
## Vue为什么需要一个根元素
## Vue的挂载怎么实现，el和$mount有什么区别

vue 代码复用的方式
## 技术选型上为何选择Vue，Vue的缺陷

## 了解Vue3吗，相对于Vue2做了哪些优化
## Vue hooks的使用
## 在Vue渲染组件的时候，都是从父到子组件再到父组件，如果你是框架的设计者，你会怎么做
## 如何批量引入组件
require.context()

可以使用require.context（）函数创建自己的上下文。 它允许您传入一个目录进行搜索，一个标志指示是否应该搜索子目录，还有一个正则表达式来匹配文件。

## 组件化
前端主要工作是UI开发，而把UI上的各种元素分解成组件，规定组件的标准，实现组件运行的环境就是组件化了。
符合原本的 JavaScript/CSS/HTML 书写习惯；绑定了 MVVM 模式，直接确定了 UI 架构，数据交互非常简洁。

### 如何设计一个组件
