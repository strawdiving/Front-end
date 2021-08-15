# 组合式API
使用 (data、computed、methods、watch) 组件选项来组织逻辑在通常都很有效，然而当组件变得更大时，逻辑关注点的列表会增长，导致组件难以阅读和理解。

即同一个逻辑关注点（例如同一个功能）的相关代码分散在不同的组件选项块里。

- Vue 选项式API： 按选项类型分组的代码

这种碎片化使得理解和维护复杂组件变得困难，选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断“跳转”相关代码的选项块。

如果将同一个逻辑关注点相关的代码配置在一起，这样会更好。这就是组合式API能够做到的。

为了使用组合式API，首先需要一个可以实际使用它的地方，在Vue组件中，将此位置称为**setup**。

## setup组件选项
setup组件选项在创建组件**之前**执行，一旦 props 被解析，就作为组合式API的入口点。

在执行 setup 时，组件实例尚未被创建，所以 setup 选项中没有 this 。意味着，除了 props 之外，无法访问组件中声明的任何属性 —— **本地状态、计算属性或方法**。

- 只能访问以下property：props、attrs、slots、emit
- 不能访问以下组件选项：data、computed、methods

我们从setup返回的所有内容，都将暴露给组件的其他部分 （计算属性、方法、生命周期钩子等）以及组件的模板。

注：从setup返回的 refs 在模板中访问时是自动解开的，不需要在模板中使用.value。

```html
<template>
  <div> {{readersNumber}} {{book.title}}</div>
</template>
```

```javascript

export default {
  import { ref, reactive } from 'vue'
  components: {},
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    console.log(props)
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3' })
    return {
      readersNumber,
      book
    } // setup 返回的任何内容都可以用于组件的其余部分
  }
  // 组件的其余部分
}
```

setup 函数接受两个参数：
- props
- context

### props
props是响应式的，当传入新的prop时，它将被更新。

注： 因为props是响应式的，**不能使用ES6解构**，因为它会消除prop的响应性。

如果需要解构prop，可以通过使用setup函数中的**toRefs**来安全地完成此操作。

```javascript
import { toRefs } from 'vue'
setup(props) {
  const { title } = toRefs(props)
  console.log(title.value)
}
```
### 上下文 context

context是一个普通的JS对象，它暴露三个组件的property：

- attrs, Attribute(非响应式对象)
- slots，插槽（非响应式对象）
- emit，触发事件（方法）

context是一个普通的JS对象，也就是说它不是响应式的，可以安全地对context使用ES6解构。
```javascript
setup(props，{ attrs, slots, emit }) {
  console.log(attrs)
}
```
attrs和slots是有状态的对象，总是会随组件本身的更新而更新。因此要避免对它们进行解构，并始终以attrs.x或slots.x的方式引用。**attrs和slots是非响应式的**。如果打算根据attrs或slots更改应用副作用，那么应该在 onUpdated 生命周期钩子中执行此操作。

## 带ref的响应式变量
可以通过一个新的 **ref** 函数，使任何响应式变量在任何地方起作用。

即，**ref**为我们的值创建了一个“响应式引用”。

```javascript
import { ref } from 'vue
const counter = ref(0)

console.log(counter.value)
counter.value ++
```
ref接受参数，并将其包裹在一个带有value property的对象中返回，然后就可以使用该property访问或改变响应式变量的值。

将值封装在一个对象中，看似没有必要，但为了保持JS中不同数据类型的行为统一，这是必须的。因为JS中Number或String等基本类型是通过值传递的，而不是通过引用传递的。

在任何值周围都有一个封装对象，这样就可以在整个应用中安全传递它，而不必担心在某个地方失去它的响应性。

## 生命周期钩子注册在 setup 内部
为了使组合式API的功能比选项式API更完整，需要在setup中注册生命周期钩子。

因为setup是围绕 **beforeCreate和created** 生命周期钩子运行的，所以不需要显式定义它们，即，在这些钩子中编写的任何代码都应该直接在setup函数中编写。

这些函数接受一个回调函数，当钩子被组件调用时将会被执行。
```javascript
setup() {
  onMounted(() => {

  })
}
```

## 模板引用
在使用组合式API时，响应式引用 和 模板引用 的概念是统一的。为了获得对模板内元素或组件实例的引用，我们可以 声明 ref 并从 setup() 返回

```javascript
<template>
  <div ref="root"> 这是根元素 </div>
</template>
setup() {
  const root = ref(null)

  onMounted(() => {
    console.log(root.value) // <div>这是根元素</div>
  })

  return {
    root
  }
}
```
在渲染上下文中暴露root，并通过**ref="root"**，将其绑定到div作为其ref。

在虚拟DOM补丁算法中，如果VNode的ref键对应于渲染上下文中的ref，则VNode的相应元素或组件实例将被分配给该 ref 的值。因为在虚拟DOM挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。

作为模板使用的ref的行为与其他任何ref一样，它们是响应式的。

组合式API模板引用在 v-for 内部使用时没有特殊处理。相反，使用函数引用执行自定义处理。

```javascript
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
  {{ item }}
  </div>
</template>

<script>
export default {
  setup() {
    const list = reactive([1,2,3])
    const divs = ref([])

    // 确保每次更新之前重置ref
    onBeforeUpdate(() => {
      divs.value = []
    })

    return {
      list, divs
    }
  }
}
</script>
```
## 使用渲染函数
setup还可以返回一个渲染函数，该函数可以直接使用在同一作用域中声明的响应式状态。

```javascript
import { h, ref, reactive } from 'vue'
export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({title: 'Vue 3'})

    // 这里需要显式公开（explicitly expose)ref值value
    return () => h('div', [[readersNumber.value, book.title]])
  }
}
```

## 使用this
在 setup()内部，this不会是该活跃实例的引用，因为setup()是在解析其他组件选项之前被调用的，所以setup(）内部的this的行为与其它选项中的this完全不同。这在和其它选项式API一起使用setup()时可能会导致混淆。
