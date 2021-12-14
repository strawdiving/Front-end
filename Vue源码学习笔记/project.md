# 双向数据绑定
Vue(2.6)

## 程序结构梳理
Vue.js的源代码都放在src目录中。src目录下有多个并列的文件夹，我们关注比较核心的几个目录：
- compiler/
  - directives/
  - parser/，把template转化为AST

- core/
  - observer/
    - dep.js，Dep类，数据观察和视图依赖相关联的关键
    - watcher.js，Watcher类，解析表达式，收集依赖项，且当表达式值更改时触发回调
    - index.js，Observer类，附加（attach）到每个被观察的对象，一旦附加以后，观察者observer将目标对象的属性转换成getter/setter来收集依赖关系，并分发更新
  - instance/
    - index.js，vm构造函数
    - init.js，vm实例初始化，初始化data,props,methods,computed,watch
    _init() ——> initLifecycle, initEvents, initRender, initInjection(在data,props之前), initState, initeProvide(在data,props之后解析)
    callHook, "beforeCreated", callHOok, "created"
    - state.js，初始化data,props,methods,computed,watch
    - lifecycle.js，生命周期
    - events.js，事件
  - vdom/
    - patch.js，virtual dom patching算法
    - vnode.js，virtual dom node
    - modules/directives.js
  - global-api/，全局接口
    - index.js，initGlobalAPI()函数
    - use.js，initUse()
    - mixin.js，initMixin()
    - extend.js，initExtend()
    - assets.js，initAssetRegisters()
  - config.js,默认配置项
  - util/，工具方法集合
- platforms/
## MVVM

View和Model不发生联系，通过ViewModel传递。
- View层用户操作时，ViewModel层数据同步更新
- ViewModel数据变化时，支持同步更新到View层

—— View和ViewModel之间的双向同步过程，称之为**双向绑定**。

这种方式提升了数据频繁变化时的代码的可维护性。

Vue的MVVM工作方式的核心，即如何实现observer，directive(parser)，watcher三样东西。
1. 通过observer对data进行监听，并提供订阅某个数据项的变化的能力
2. 把template解析成一段document fragment，然后解析其中的指令（directive,如v-on，v-if，v-for等），得到每一个directive所依赖的数据项及其更新方法。
3. 通过watcher把上述两部分结合起来，即把directive中的数据依赖订阅在对应的数据的observer上，这样当数据变化时，就触发observer，进而触发相关依赖对应的视图更新方法，最后达到模板原本的关联效果。

### 双向数据绑定


- **Observer数据监听器**，  能对数据对象的所有属性进行监听，如有变动，可拿到最新值并通知订阅者。

实现方法：使用Object.defineProperty，来劫持各个属性的getter/setter（数据劫持），在数据变动时，（在setter里）发布消息给订阅者（Watcher），触发相应的监听回调。

*Object.defineProperty，可在一个对象上定义一个新的属性，或修改已存在的属性，并返回该对象。*

- **Compiler指令解析器**，  对每个元素节点的指令（directive）进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数；
- **Watcher订阅者**，  作为连接Observer和Compiler的桥梁，能订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数；
- **Dep消息订阅器**，  内部维护了一个数组，用来收集订阅者（watcher），数据变动触发dep.notify()函数,再调用订阅者的update方法。

```javascript
// 这是将要被劫持的对象
const data = {
  name: '',
};

function say(name) {
  if (name === '古天乐') {
    console.log('给大家推荐一款超好玩的游戏');
  } else if (name === '渣渣辉') {
    console.log('戏我演过很多,可游戏我只玩贪玩懒月');
  } else {
    console.log('来做我的兄弟');
  }
}

// 遍历对象,对其属性值进行劫持
Object.keys(data).forEach(function(key) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log('get');
    },
    set: function(newVal) {
      // 当属性值发生变化时我们可以进行额外操作
      console.log(`大家好,我系${newVal}`);
      say(newVal);
    },
  });
});

data.name = '渣渣辉';
//大家好,我系渣渣辉
//戏我演过很多,可游戏我只玩贪玩懒月
```

#### 工作流程
- new Vue() ——Vue进入初始化阶段，
1. 遍历data选项中的属性，用Object.defineProperty将它们转为getter/setter，实现数据变化监听功能

在src/core/observer/index.js中，
```javascript
Object.defineProperty(obj,key,{
    get(){...},
    set(newVal) {...}
});

```
在src/core/observer/array.js中，实现了对数组的监听。

对几乎每一个可能改变数组数据的方法进行prototype更改。

2. Vue的指令编译器Compiler对元素节点的指令（directive）进行扫描和解析，初始化视图，并订阅watcher更新视图，此时watcher会将自己添加到消息订阅器（Dep）中

- 初始化完毕后，当数据变化时，Observer中的setter方法被触发，setter会立即调用Dep.notify(),Dep开始遍历所有的订阅者（watcher）,并调用订阅者的update方法，订阅者收到通知后，对视图进行相应更新。

