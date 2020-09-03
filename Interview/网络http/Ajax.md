异步——你的组件可能需要与服务器进行实时的通信。在设计时需要考虑使用 XHR 或双向调用。如果你的面试官要求你支持旧浏览器，那么你需要在隐藏 iFrame、script 标签或 XHR 之间做出选择。如果没有，你可以建议使用 websocket，或者使用服务器发送事件（SSE），这样会更好；

前端和后端怎么联调
前后端通信使用什么方案
前端发起网络请求的几种方式及其底层实现、可以手写原生 ajax、 fetch、可以熟练使用第三方库

异步请求，低版本fetch如何低版本适配

8. Fetch API 相对于传统的 Ajax 有哪些改进？
使用 Fetch API 有那些缺点/难点吗？那些是 Ajax 可以做的，而 fetch 不能做的？
- fetch取消
- 尽可能详尽的解释 Ajax 的工作原理。使用 Ajax 都有哪些优劣？

Ajax技术的核心是XMLHttpRequest对象，这个对象充当着浏览器中的脚本（客户端）与服务器之间的中间人的角色。Javascript通过这个对象可以自己发送请求，也自己处理请求。

优点:异步方式发送请求。服务器在后台处理请求，脚本可以按需加载和创建页面内容，不会打断用户的浏览体验。Web应用可以呈现出类似桌面应用般的体验。

使用Ajax就可以做到只更新页面中的一小部分,无需刷新和重新加载整个页面

缺点：有其适用范围，依赖Javascript，可能会有浏览器不支持它，而搜索引擎的蜘蛛程序也不会抓取到有关内容。
**同源策略**：使用XMLHttpRequest对象发送的请求只能访问与其所在HTML处于同一个域中的数据，不能向其他域发送请求。

传统的浏览器web应用都要涉及大量的页面刷新：用户点击链接，请求发送回服务器，服务器返回新页面，即使用户看到的只是页面中的一小部分有变化，也要刷新和重新加载整个页面。

- 手写Ajax，XMLHttpRequest
原生Ajax实现过程；
一个 XMLHttpRequest 实例有多少种状态？

- axios和ajax的区别
区别 axios是通过promise实现对ajax技术的一种封装，就像jQuery实现ajax封装一样。 简单来说： ajax技术实现了网页的局部数据刷新，axios实现了对ajax的封装。 axios是ajax ajax不止axios。
有没有封装过axios？
如何在axios中添加登陆验证？

# axios
axios是基于Promise，用于浏览器和node.js的http客户端，本身具有以下特征：
- 从浏览器创建XMLHttpRequest
- 支持Promise API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换JSON数据
- 客户端支持防止CSRF/XSRF

在每个需要发送请求的组件中即时引入。

## 拦截器
添加拦截器，可以拦截请求或响应
```javascript
axios.interceptors.request.use(config => {
// do something before sending request
return config
}, error => {
    //do something with error
    return Promise.reject(error)
})
axios.interceptors.response.use(response => {
// do something to response
return response
}, error => {
    //do something with error
    return Promise.reject(error)
})
```