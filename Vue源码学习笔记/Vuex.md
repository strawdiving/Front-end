## Vuex
Vuex采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。集成到devtool中，提供状态快照导入导出等高级调试功能。

一个简单的Vue应用，状态自管理包含：
- state，驱动应用的数据源  // data
- view，以声明的方式将state映射到视图  // template
- actions，响应在view上的用户输入导致的变化  // methods等

原本是单向数据流（形成一个环）：state-->view-->actions-->state

但是**多个组件共享状态**时，单向数据流的简洁性容易被破坏：
- 多个视图依赖同一状态
- 来自不同视图的行为需要变更同一状态

对于问题一，传参的方法对于多层嵌套的组件会非常繁琐，且对兄弟组件间的状态传递无能为力；
对于问题二，经常采用父子组件直接引用，或通过事件来变更和同步状态的多份拷贝，非常脆弱，通常会导致无法维护的代码。

所以，将组件的共享状态抽取出来，以一个全局单例模式管理。组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

通过定义和隔离状态管理中的各种概念，并通过强制规则维持视图和状态间的独立，代码会更结构化且易维护。

### Vuex的使用场景
如果不是开发大型单页应用，使用Vuex可能是繁琐冗余的，一个简单的store模式就可以了。

单独创建一个
```javascript
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```
componentA和componentB都引用state，所有store中的state的变更，都放置在store自身的 action 中去管理（注意不能替换原始的状态对象，组件和store需要引用同一个共享对象，变更才能被观察到），发生错误时，也会有log记录bug之前发生了什么。

每个组件/实例仍然可以拥有和管理自己的私有状态：
```javascript
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

中大型单页应用，需要考虑如何更好地在组件外部管理状态，就可以用Vuex。

### State
Vuex使用单一状态树，即一个对象就包含全部的应用层级状态，作为“唯一数据源”，每个应用只包含一个store实例。

注：存储在Vuex中的数据和Vue实例中的data遵循相同的规则：如，状态对象必须是纯粹plain的。

store中的状态是响应式的，在组件中调用store的状态仅需要在计算属性中返回即可。

Vuex通过store选项，提供一种机制将状态从根组件“注入”到每一个子组件中（需调用Vue.use(Vuex)）

#### mapState辅助函数
当一个组件需要获取多个状态时，可以用 mapState 辅助函数帮助生成计算属性。

mapState函数返回的是一个对象。

```javascript
import mapState from 'vuex'
export default {
  ......
  computed: mapState({
      count: state => state.count,
      countAlias: 'count', // 传字符串参数 'count' 等同于 'state => state.count'
      // 为了能够使用 this 获取局部状态，必须使用常规函数
      countPlusLocalState (state) {
          return state.count + this.localCount
      }
  })
}

```
当映射的计算属性的名字和 state 的子节点名称相同时，也可以给 mapState 传一个字符串数组。
```javascript
computed: mapState(['count']) // 映射 this.count为store.state.count
```
- 将mapState函数返回的对象和局部计算属性混合使用
```javascript
computed: {
    localComputed () {...},
    // 使用对象展开运算符将该对象混入到外部对象中
    ...mapState({...})
}
```
### Getter
有时候需要从store的state中派生出一些状态，Vuex允许我们在store中定义 'getter' （相当于store的计算属性），像computed属性一样，getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

getters 接受 state 作为其第一个参数
```javascript
const getters = {
  username: state => state.account.name,
  avatar: state => state.account.avatar,
  roles: state => state.account.roles
}
```
#### getter的访问
```javascript
store.getters.doneTools
// 在组件中访问
this.$store.getters.doneToold
// 可以接受其他getter作为第二个参数
getters: {
    doneTodosCount(state,getters) {
        return getters.doneTodos.length
    }
}
```
- 通过方法访问：

让getter返回一个函数，来实现给getter传参。通过方法访问时，每次都会去调用，不会缓存结果。

```javascript
getters: {
    getTodoById: (state)=>(id)=>{
        return state.todos.filter(...)
    }
}

store.getters.getTodoById(2)
```
#### mapGetters
mapGetters辅助函数仅仅是将store中的 getter 映射到局部计算属性。
```javascript
import {mapGetters} from 'vuex'

export default {
    ...mapGetters(['doneTodoCount','anotherGetter'])
}
```

如果要将一个getter属性另取一个名字，使用对象形式：
```javascript
...mapGetters({
    doneCount: 'doneTodoCount'
})
```
### Mutation
mutation的调用/触发：
```javascript
store.commit('increment'，{amount: 10}) //increment是事件类型
```
mutation类似于事件：每个mutation都有一个**事件类型(type)**和一个**回调函数(handler)**。

回调函数是实际状态更改的地方，接受state作为第一个参数。不能直接调用handler，它更像是事件注册，要触发它，必须以相应的type调用 store.commit。

可以向 store.commit 传入额外的参数，即**载荷(payload)**。大多数情况下，载荷应该是一个对象，这样可以包含多个字段，且记录的 mutation 会更易读。

```javascript
mutations: {
    // 回调函数
    increment (state, payload) {
        state.count+= payload.amount
    }
} 
```

更改store的状态的唯一方法是 提交mutation。通过提交mutation的方式，而非直接改变状态，是为了能明确地追踪到状态的变化，以及实现一些能记录每次状态改变、保存状态快照的调试工具。

#### Mutation遵守Vue的响应规则
Vuex的store中的状态是响应式的，变更状态时，监视状态的Vue组件也会自动更新，即mutation也需要和Vue一样遵守：
1. 最好提前在store中初始化好所有所需属性
2. 当需要在对象上添加新属性时，应该使用
   - Vue.set(obj,'newProp',123) 或
   - 新对象替代老对象
   ```javascript
   state.obj = {...state.obj, newPro: 123}
   ```
#### 使用常量替代Mutation事件类型
```javascript
import { SOME_MUTATION } from './mutation_types'
mutations: {
  [SOME_MUTATION] (state) {

  }
}
```
#### Mutation必须是同步函数
每一条mutation被记录，devtools都要捕捉到前一状态和后一状态的快照，mutation中的异步函数中的回调让这不可能完成，因为mutation触发时，回调函数还没有被调用，devtools不知道什么时候回调函数实际上被调用。实质上任何在回调函数中进行的状态的改变都是不可追踪的。
```javascript
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```
#### mapMutations
```javascript
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```
### Action
- 提交的是 mutation，而不是直接变更状态
- 可以包含任意异步操作

Action函数接受一个与store实例具有相同方法和属性的**context**对象，因此可以调用`context.commit`提交一个mutation，也可以通过`context.state`和`context.getters`获取state和getters。

实践中，一般使用参数解构来简化：
```javascript
actions: {
  increment ({ commit, state }, products) {
    commit('increment')
  }
}
```
#### 分发action
```javascript
store.dispatch('increment')
```
和mutation一样可以传递载荷。

可以在action内部执行异步操作，可以调用异步API，分发多重mutation。通过提交mutation来记录action产生的副作用（即状态变更）。

在组件中分发Action:
```javascript
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions ([
      'increment',  // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      // mapActions也支持载荷
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions ({
      add: 'increment'  // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```
#### 组合Action
store.dispatch 可以处理被触发的action的处理函数返回的Promise，并且store.dispatch仍旧返回Promise。
```javascript
actions: {
  actionA ({ commit }) {
    return new Promise((resolve,reject) => {
      setTimeout(()=>{
        commit('someMutation')
        resolve()
      },1000)
    })
  }
}
```
现在可以：
```javascript
store.dispatch('actionA').then(()=>{...})
```
在另一个action中也可以：
```javascript
actions: {
  ...
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispacth, commit }) {
    await dispatch('actionA') // 等待 actionA完成
    commit('getOtherData',await getOtherData())
  }
}
```
### Module
将store分割成 模块（module），每个模块拥有自己的state,mutation,action,getter，甚至是嵌套子模块。
```javascript
const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a //moduleA的状态
```
对模块内部的mutation和getter，接收的第一个参数是**模块的局部状态对象**。
对于模块内部的action，局部状态通过 context.state 暴露出来，根节点状态为 `context.rootState`。
对模块内部的getter，根节点状态会作为第三个参数暴露出来（state,getters,rootState）。

#### 命名空间
默认，模块内部的action,mutation和getter是注册在**全局命名空间**的，这使得多个模块能对同一mutation或action做出响应。

也可以使用`namespaced: true`的方式使模块成为带命名空间的模块，当模块注册后，它的所有getter,action和都会自动根据模块注册的路径调整命名。

嵌套模块，如果没有设置`namespaced:true`，就会继承父模块的命名空间；如果设置了，就要进一步嵌套命名空间：`parentNS/subNS`。

启用了命名空间的getter和action会收到局部化的 getter,dispatch和commit，即，在使用模块内容时，不需要在同一模块内额外添加空间名前缀。更改namespaced属性后不需要修改模块内的代码。

```javascript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },
        // 进一步嵌套命名空间
        posts: {
          namespaced: true,
          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

- 在带命名空间的模块内访问全局内容（Global Assets）
如果希望使用全局state和getter， `rootState和rootGetters`会作为第三和第四参数传入getter，也会通过context对象的属性传入action。

若要在全局命名空间内分发action或提交mutation，将 `{root: true}`作为第三参数传给dispatch 或 commit 即可。
```javascript 
// 在模块中， dispatch 和 commit 也被局部化了
// 他们可以接受 `root` 属性以访问根 dispatch 或 commit
dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'
```
- 在带命名空间的模块注册全局 action

添加 `root: true`
```javascript
 modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
 }
```
- 带命名空间的绑定函数
使用mapState, mapGetters, mapActions 和 mapMutations来绑定带命名空间的模块时，可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。
```javascript
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
}
// 替换为
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```
### 表单处理
```html
<input v-model="obj.message">
```
obj是计算属性中返回的一个属于Vuex store的对象，在用户输入时，v-model会试图直接修改obj.message，在严格模式下会报错，因为不是在mutation函数中执行的。

1. 一种解决办法是：给 < input >中绑定value，然后侦听 input 或 change 事件，在事件回调中调用一个方法。
```html
<input :value="message" @input="updateMessage">
```
```javascript
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage(e) {
    this.$store.commit('updateMessage',e.target.value)
  }
}
```
2. 另一个方法是使用带有setter的双向绑定计算属性
```javascript
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('udateMessage',value)
    }
  }
}
```


1. Vuex action/mutation区别
mutations和actions只是为了devtools追踪状态变化。actions随你操作，只要最后调用mutation修改数据就行；

mutations必须是同步操作，同步的意义在于，每一个mutation执行完都可以对应到一个新的状态，这样devtools查看异步actions就能清楚地查看mutation何时被记录，对应状态。

mutations是可以发异步请求的，但是不推荐，因为devtools拿到的是mutation执行完毕时的快照snapshots，而如果是异步的话，拿不到你想要的快照，devtools就看不到所谓的时间旅行了，所以用action处理异步，拿到异步的结果后，触发mutation，更改state

2. vuex底层流程和实现原理以及数据流向
Vuex的响应式原理
js实现依赖注入
Redux/Vuex区别