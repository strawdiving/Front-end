# Mixin混入
分发Vue组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

```javascript
// 定义一个混入对象
var mixin = {
    data: function() {
        return {
            message: 'hello',
            foo: 'abc'
        }
    },
    created: function () {
      this.hello()
    },
    methods: {
        hello: function () {
        console.log('hello from mixin!')
        }
    }
}

new Vue({
    // 使用混入对象
    mixins: [mixin], 
    data: function() {
        return {
            message: 'goodbye',
            bar: 'def'
        }
    },
    created: function () {
        console.log(this.$data) //{ message: 'goodbye',  bar: 'def', foo: 'abc' }
    }

})
```
## 选项合并
当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。
1. 数据对象在内部会进行递归合并，并在发生冲突时**以组件数据优先**
2. 同名钩子函数将合并为一个数组，因此都将被调用。**混入对象的钩子将在组件自身钩子之前调用**
3. 值为对象的选项，如methods，components和directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对

## 全局混入
混入可以全局注册，但使用时要小心，一旦全局混入，它将影响每一个之后创建的Vue实例。使用恰当时，这可以用来为自定义选项注入处理逻辑。
```javascript
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello!'
})
// => "hello!"
```
注：**谨慎使用。大多数情况下，只应当应用于如上的自定义选项**

## 自定义选项合并策略
自定义选项将使用默认策略，即简单覆盖已有值。如果想让自定义选项以自定义逻辑合并：
```javascript
Vue.config.optionMergeStrategies.myOption = funtion (toVal, fromVal) {
    // 返回合并后的值
}
```
Vuex中使用了自定义混入策略。