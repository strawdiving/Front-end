## Vue Router路由
1. vue单页多页的区别
单页面应用，是把多个页面的内容实现在同一个实际页面内的技术，因为失去了页面的天然解耦，所以要解决耦合问题。要在一个“物理页面”内，通过架构设计实现若干个“逻辑页面”。
逻辑页面应该做到独立开发和独立发布，一种思路是每个逻辑页面一个js，用一个SPA框架加载js文件。

涉及到保存页面的前进后退历史，一般用URL的Hash来控制

vue路由实现原理


场景题：Vue CheckBoxGroup/CheckBox设计

2. 前端路由Hash模式和History模式的区别
- vue-router默认hash模式——使用URL的hash来模拟一个完整的URL，于是当URL改变时，页面不会重新加载。
- history模式，充分利用**history.pushState** API来完成URL跳转而无须重新加载页面。
```javascript
const router = new VueRouter({
    mode: 'history',
    routes:[]
})
```
当使用history模式时，URL就像正常的url，例如 http://yoursite.com/user/id。
不过，history模式需要后台配置支持，因为我们的应用是单页面应用，如果后台没有正确的配置，当用户在浏览器直接访问http://yoursite.com/user/id 就会返回404。

所以，要在服务端增加一个覆盖所有情况的候选资源：如果URL匹配不到任何静态资源，则应该返回同一个index.html页面，这个页面就是你app依赖的页面。

或者给个警告，这么做以后，服务器就不再返回404错误页面，因为所有路径都会返回index.html文件。

应该在Vue应用里覆盖所有的路由情况，然后再给出一个404页面。

或者如果使用Node.js服务器，可以用服务端路由匹配到来的URL，并在没有匹配到路由时返回404，以实现回退。
```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

React-Router版本号
如何配置React-Router
路由的动态加载模块
前端怎么控制管理路由
使用路由时出现问题如何解决
React怎么做数据的检查和变化
介绍路由的history
react-router怎么实现路由切换
react-router里的<Link>标签和<a>标签有什么区别
<a>标签默认事件禁掉之后做了什么才实现了跳转

- active-class是哪个组件的属性？嵌套路由怎么定义
vue-router模块的router-link组件

前端router 如何实现？
   1. vue-router: 搭建SPA
       路由,组件的配置
       路由间的传值
       路由跳转
       路由的导航守卫

       记住在router.js 和 组件页面中的使用方式
注意点：
1.params只能用name来引入路由，query用path来引入
2.params类似于post，query更加类似于我们ajax中get传参，说的再简单一点，前者在浏览器地址栏中不显示参数，后者显示，所以params传值相对安全一些。
3.取值用法类似分别是this.$route.params.name和this.$route.query.name。
4.params传值一刷新就没了，query传值刷新还存在

5.路由实现
ReactRouter和 VueRouter的底层实现原理、动态加载实现原理