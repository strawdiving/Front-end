## Vue Router路由

1. vue单页多页的区别
单页面应用，是把多个页面的内容实现在同一个实际页面内的技术，因为失去了页面的天然解耦，所以要解决耦合问题。要在一个“物理页面”内，通过架构设计实现若干个“逻辑页面”。

逻辑页面应该做到独立开发和独立发布，一种思路是每个逻辑页面一个js，用一个SPA框架加载js文件。

"更新视图但不重新请求页面“是前端路由原理的核心之一。

SPA开发模式，在路由切换时只替换DOM树中最小修改的部分DOM，来减少原理因为多页面应用跳转带来的巨量性能损耗。（@angular/router，React-Router和 Vue-Router）

目前在浏览器环境中这一功能的实现主要有两种方式：
- Hash：利用URL中的 hash (#)
- History：利用History API在HTML5中新增的方法


在Vue-Router中是用了外观模式将几种不同的路由方式提供了一个一致的高层接口，让我们可以更解耦的在不同路由方式中切换。

另外，Hash模式的状态保存需要另行传递，而HTML5 History原生提供了自定义状态传递的能力，我们可以直接利用其来传递信息。

场景题：Vue CheckBoxGroup/CheckBox设计

2. 前端路由Hash模式和History模式的区别

## Hash模式
vue-router默认hash模式——使用URL的hash来模拟一个完整的URL，于是当URL改变时，页面不会重新加载。
涉及到保存页面的前进后退历史，一般用URL的Hash来控制 ？

hash的本来作用是加在URL中指示网页中的位置。hash虽然出现在URL中，但不会被包括在HTTP请求中。它是用来指导浏览器动作的，改变hash不会重新加载页面。

### 相关API
Hash方法是在路由中带有一个“#”，URL的片段标识符 ——> 跟在＃符号后面的URL部分，包括＃符号。

每一次改变hash，就会在浏览器的访问历史中增加一个记录。

当URL的片段标识符更改时，将触发（window的）haschange事件。主要原理是通过监听“#”后的URL路径标识符的更改而触发的浏览器 haschange 事件，然后通过获取 location.hash 得到当前的路径标识符，而进行一些路由跳转的操作。

- location.href，完整的URL
- location.hash，URL的锚部分
- location.pathname，URL路径名
- haschange事件，当location.hash发生改变时，将触发这个事件

```javascript
// http://sherlocked93.club/base/#/page1
{
  href:  'http://sherlocked93.club/base/#/page1',
  pathname: '/base/',
  hash: '#/page1'
}
```

注：因为Hash方法是利用了相当于页面锚点的功能，所以与原来的通过锚点定位来实现页面滚动定位的方式冲突，导致定位到错误的路由路径，所以需要采用别的办法。

## history模式
HTML5提供了一些路由操作的API：

在用户历史记录中向前/后跳转
- history.go(n)，n为0是刷新页面
- history.forward()，相当于 history.go(1)，和浏览器前进按钮效果相同
- history.back()，相当于 history.go(-1)，和浏览器回退按钮效果相同


- history.pushState() 添加一条路由历史记录，如果设置跨域网址则报错
- history.replaceState()，替换当前页在路由历史记录的信息
- popstate事件：当活动的历史记录发生变化，就会触发popstate事件，在点击浏览器的前进后退按钮，或调用go,forward,back方法时都会触发

充分利用**history.pushState** API来完成URL跳转而无须重新加载页面。
```javascript
const router = new VueRouter({
    mode: 'history',
    routes:[]
})
```
Hash模式是使用URL的Hash来模拟一个完整的URL，因此URL改变时页面并不会重载

当使用history模式时，URL就像正常的url，例如 http://yoursite.com/user/id。

History模式则会直接改变URL，所以在路由跳转时会丢失一些地址信息，在刷新或者直接访问路由地址的时候会匹配不到静态资源。因为我们的应用是要后台配置单页面应用，如果后台没有正确的配置，例如，当用户在浏览器直接访问http://yoursite.com/user/id 就会返回404。

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

在一般的需求场景中，两种模式是差不多的，但几乎所有文章都推荐使用history模式。

调用history.pushState()，相比于直接修改hash主要有以下优势（参考MDN History API）：
- pushState设置新的URL，新URL可以是与当前URL同源的任意URL；而hash只可修改#后面的部分，即设置window.location只能是同一个document，必须是与当前同文档的URL。
- pushState设置新的URL可以与当前URL一样，这样也会把记录添加到栈中。而hash设置的新的hash值必须与原来不一样才会触发记录添加到栈中
- pushState通过stateObject可以将任意类型的数据添加到记录中；而hash只可添加短字符串，要把所有相关数据编码为短字符串。
- pushState可额外设置title属性供后续使用。

history模式的问题：

对SPA应用来讲，理想的使用场景是仅在进入应用时加载index.html，后续的操作通过Ajax完成，不会根据URL重新i去那个i去页面。但难免遇到特殊情况，比如用户直接在地址栏输入并回车，浏览器重启重新加载应用等。

hash模式仅改变hash部分的内容，而hash部分是不会包含在http请求中的：
`http://site.com/#/user/id`，如果重新请求只会发送`http://site.com/`，故在hash模式下遇到根据URL请求页面的情况不会有问题。

而history模式则会将URL修改得就和正常请求后端的URL一样：`http://site.com/user/id`，在此情况下重新向后段发送请求，如果后段没有配置对应/user/id的路由处理，则会返回404错误。

官方推荐的解决办法是在服务端增加一个覆盖所有情况的候选资源，如果URL匹配不到任何静态资源，则应该返回同一个index.html页面，这个页面就是你app依赖的页面。同时，这么做以后，服务器就不再返回404错误页面，因为对于所有路径都会返回index.html文件。为了避免这种情况，在Vue应用里覆盖所有的路由情况，然后再给出一个404页面。

或者如果使用Node.js服务器，可以用服务端路由匹配到来的URL，并在没有匹配到路由时返回404，以实现回退。


如何配置React-Router
路由的动态加载模块
前端怎么控制管理路由
使用路由时出现问题如何解决
React怎么做数据的检查和变化
react-router怎么实现路由切换
react-router里的<Link>标签和<a>标签有什么区别
<a>标签默认事件禁掉之后做了什么才实现了跳转

- active-class是哪个组件的属性？嵌套路由怎么定义
vue-router模块的router-link组件


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
前端router 如何实现？vue路由实现原理