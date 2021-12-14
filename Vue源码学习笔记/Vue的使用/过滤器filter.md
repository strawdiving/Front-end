## vue如何自定义一个过滤器？

可以用全局方法 Vue.filter() 注册一个自定义过滤器，它接收两个参数：过滤器 ID 和过滤器函数。过滤器函数以值为参数，返回转换后的值

Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
<!-- 'abc' => 'cba' -->
<span v-text="message | reverse"></span>
过滤器也同样接受全局注册和局部注册

1. 局部注册
```html
<div id="app">
  <input type="text" v-model="msg" />
  {{msg| capitalize }}
</div>
```
JS代码：

```javascript
var vm = new Vue({
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

2. 全局定义过滤器

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```
过滤器接收表达式的值 (msg) 作为第一个参数。capitalize 过滤器将会收到 msg的值作为第一个参数。
