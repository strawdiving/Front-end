## Vue Router路由
### 功能
1. 嵌套的路由/视图表
2. 模块化的、基于组件的路由配置
3. 路由参数、查询、通配符
4. 基于Vue过渡系统的视图过渡效果
5. 细粒度的导航控制
6. 带有自动激活的CSS class的链接
7. HTML5历史模式或hash模式，在IE9中自动降级
8. 自定义的滚动条行为

### 配置路由
1. 定义路由组件
可以是直接定义，也可以是导入已定义好的组件：`import Home from './components/home.vue`
2. 定义路由（路由对象数组）
  ```javascript
  const routes = [
    { path: '/home', component: Home },
    { path: '*', redirect: '/home' }
  ]
  // path是自定义的路径，通过该路径可以找到对应的组件，component是该路由对应的组件
  ```
3. 实例化Vue Router对象
```javascript
const router = new Vue Router({ routes, mode: 'history' })
```

## vue单页多页的区别
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

当使用history模式时，URL就像正常的url，例如 http://yoursite.com/user/id。以通常的页面访问路径，需要服务端配置。

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
## Vue路由跳转方式有哪几种？
1. router-link

**不带参数**
```html
<router-link :to="{name:'home'}">
<router-link :to="{path:'/home'}"> //name,path都行, 建议用name
// 注意：router-link中链接如果是'/'开始就是从根路由开始，如果开始不带'/'，则从当前路由开始。
带参数
<router-link :to="{name:'home', params: {id:1}}">
// params传参数 (类似post)
// 路由配置 path: "/home/:id" 或者 path: "/home:id"
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
// html 取参  $route.params.id
// script 取参  this.$route.params.id
<router-link :to="{name:'home', query: {id:1}}">
// query传参数 (类似get,url后面会显示参数)
// 路由可不配置
// html 取参  $route.query.id
// script 取参  this.$route.query.id
```
2. this.$router.push() (函数里面调用)

不带参数
```javascript
this.$router.push('/home')
this.$router.push({name:'home'})
this.$router.push({path:'/home'})
query传参
this.$router.push({name:'home',query: {id:'1'}})
this.$router.push({path:'/home',query: {id:'1'}})
// html 取参  $route.query.id
// script 取参  this.$route.query.id
```
2.1 params传参
```javascript
this.$router.push({name:'home',params: {id:'1'}})  // 只能用 name
// 路由配置 path: "/home/:id" 或者 path: "/home:id" ,
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
// html 取参  $route.params.id
// script 取参  this.$route.params.id
```
2.2 query和params区别

query类似 get, 跳转之后页面 url后面会拼接参数,类似?id=1, 非重要性的可以这样传, 密码之类还是用params，刷新页面id还在
params类似 post, 跳转之后页面 url后面不会拼接参数 , 但是刷新页面id 会消失

// 传递
this.$router.push({path: './xxx', params: {xx:xxx}})
this.$router.push({path: './xxx', query: {xx:xxx}})

// 接收
this.$route.params；this.$route.query
params 是路由的一部分,必须要有。query 是拼接在 url 后面的参数，没有也没关系
params 不设置的时候，刷新页面或者返回参数会丢，query 则不会有这个问题

使用params进行传参，不能用path，要用name，否则接收不到参数的，

3. this.$router.replace() (用法同上,push)

# 路由实现
ReactRouter和 VueRouter的底层实现原理、动态加载实现原理
前端router 如何实现？vue路由实现原理

vue-router 路由实现（https://zhuanlan.zhihu.com/p/37730038）
路由就是用来跟后端服务器进行交互的一种方式，通过不同的路径，来请求不同的资源，请求不同的页面是路由的其中一种功能

## $route和$router的区别
- $router 为 VueRouter 路由实例，对象包括了路由的跳转方法，钩子函数等。想要导航到不同 URL，则使用 $router.push 方法
- $route 为“路由信息对象”，当前 router 跳转对象里面可以获取path，params，hash，query，fullPath，matched，name等路由信息参数

## Vue 如何去除url中的 #
vue-router 默认使用 hash 模式，所以在路由加载的时候，项目中的 url 会自带 #。如果不想使用 #， 可以使用 vue-router 的另一种模式 history

new Router({
  mode: 'history',
  routes: [ ]
})
需要注意的是，当我们启用 history 模式的时候，由于我们的项目是一个单页面应用，所以在路由跳转的时候，就会出现访问不到静态资源而出现 404 的情况，这时候就需要服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面

## 怎么定义 vue-router 的动态路由? 怎么获取传过来的值
答：在 router 目录下的 index.js 文件中，对 path 属性加上 /:id，使用 router 对象的 params.id 获取。

## Vue的路由实现：hash模式 、 history模式、abstract模式
hash模式：在浏览器中符号“#”，#以及#后面的字符称之为hash，用window.location.hash读取；
特点：hash虽然在URL中，但不被包括在HTTP请求中；用来指导浏览器动作，对服务端安全无用，hash不会重加载页面。
hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 http://www.xxx.com，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。
hash 模式的实现原理
早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：

https://www.abc.com#search
hash 路由模式的实现主要是基于下面几个特性：
URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用  JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

history模式：history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。
history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.xxx.com/items/id。后端如果缺少对 /items/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”
history 模式的实现原理
HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
history 路由模式的实现主要基于存在下面几个特性：
pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。

abstract模式 : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.
(后续补上)

## 路由参数变化组件不更新
同一path的页面跳转时路由参数变化，但是组件没有对应的更新。

原因：主要是因为获取参数写在了created或者mounted路由钩子函数中，路由参数变化的时候，这个生命周期不会重新执行。

解决方案1：watch监听路由

```javascript
watch: {
 // 方法1 //监听路由是否变化
  '$route' (to, from) {
   if(to.query.id !== from.query.id){
            this.id = to.query.id;
            this.init();//重新加载数据
        }
  }
}
//方法 2  设置路径变化时的处理函数
watch: {
'$route': {
    handler: 'init',
    immediate: true
  }
}
```
解决方案2 ：为了实现这样的效果可以给router-view添加一个不同的key，这样即使是公用组件，只要url变化了，就一定会重新创建这个组件。
```javascript
<router-view :key="$route.fullpath"></router-view>
```


路由的动态加载模块
前端怎么控制管理路由
使用路由时出现问题如何解决

- <a>标签默认事件禁掉之后做了什么才实现了跳转
使用@click.native。原因：router-link会阻止click事件，.native指直接监听一个原生事件

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
