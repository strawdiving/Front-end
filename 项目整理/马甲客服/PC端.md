## WebSocket连接
Websocket仅仅是一种消息传递结构，它是TCP协议上的一个非常薄的层，仅仅将字节转换为消息流（文本或二进制），要由应用程序来解释消息的含义。在 WebSocket 协议中，传入消息中根本没有足够的信息让框架或容器知道如何处理它。 因此，WebSocket 可以说是太低级了

1. SockJS是一个Javascript库，为了应对许多浏览器不支持Websocket协议的问题，设计了备选SockJS。SockJS是WebSocket技术的一种模拟，会尽可能对应WebSocket API，如果WebSocket不可用的话，会自动降为轮询的方式。

SockJS优先选择WebSocket进行连接，当服务器或客户端不支持WebSocket协议时，会自动在XHR流，XDR流，iFrame事件源，XHR轮询，XDR轮询等几个方案中择优进行连接。

2. Stomp.js
STOMP——Simple Text（or Streaming) Oriented Message Protocol，简单（流）文本定向消息协议。

STOMP协议，为浏览器和server之间的通信增加适当的语义消息。它提供了一个可互操作的连接格式，允许STOMP客户端与任意STOMP消息代理进行交互。没有定义实现细节，而是提供了一个易于实现的用于消息传递集成的有线协议。

STOMP只是提供了一些关于如何在使用了WebSocket的客户端和服务器之间交换消息帧的具体方法。

它在WebSocket协议之上提供了更高的语义，并定义了一些映射到WebSocket帧的帧类型，

- connect
- subscribe
- unsubscribe
- send (messages sent to the server)
- message (for messages send from the server) BEGIN, COMMIT, ROLLBACK (transaction management)

设计简单，易于开发客户端，在多种语言和平台上得到广泛应用。

- 创建STOMP客户端
1. 在web浏览器中，使用简单的Web Socket
2. 在web浏览器中使用定制的WebSocket

浏览器提供了不同的WebSocket的协议，一些老的浏览器不支持WebSocket的脚本或使用别的名字。默认下。stomp.js会使用浏览器原生的WebSocket Class去创建WebSocket。

如果用原生的WebSocket就用Stomp.client(url)，如果要使用其他类型的WebSocket，就使用Stomp.over(ws)。

而使用 Stomp.over(ws)这个方法可以使用其他类型的WebSockets，得到一个满足Websocket定义的对象，如，可以使用由SockJS实现的WebSocket

- 连接服务端

一旦Stomp客户端建立了，必须调用它的 connect 方法连接Stomp服务端进行验证。客户端会使用WebSocket打开连接，并发送一个 CONNECT frame。

这个连接是异步的，需要回调函数来处理结果。

```javascript
const socket = new SockJS('chat/ws')
const client = Stomp.over(socket)
client.connect({}, function(frame) {

}, function(err) {

})
```
errorCallback可选，login和password是用户的登录和密码凭证`client.connect(login, password, connectCallback,errorCallback)`

如果需要附加一个headers头部，可以用`client.connect(headers, connectCallback, errorCallback)`，在headers里添加login，password等键值对。

- 断开连接
client.disconnect(callback)

当客户端和服务端断开连接，就不会再发送或接收消息了。

1. Websocket连接超时报错
报错场景：前后端建立websocket连接时，前端使用了SockJS + stomp

报错信息：`Error: Incompatibile SockJS! Main site uses: “1.5.0“, the iframe: “1.0.0“. at s (VM6 sockjs.min.js:2)`

解决办法：将超时时长timeout增加，就连接成功了。

`const socket = Stomp.over(new SockJS('http://localhost:8080/message/ws', null, { timeout: 15000 }))`

### 开发环境配置支持websocket
```javascript
devServer: {
    open: true, // 启动后在浏览器打开
    proxy: {
      '/api': { // 设置普通的http代理
        target: 'http://x.x.x.x:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        ws: true
      },
    }
}
```
### Nginx配置支持websocket
在接口转接中，加入websocket的配置。

```javascript
location /vest {
  #~HOSTS~ 从外部传入
  proxy_pass   http://~HOSTS~;  // 要代理到的url
  rewrite ^/vest/(.*)$ /$1 break; # 去掉vest
  client_max_body_size  50m; // 请求体body的大小限制
  proxy_http_version 1.1; // 代理时使用的 http版本
  proxy_set_header X-Real-IP $remote_addr; // 给代理设置原http请求的ip,填写$remote_addr 即可

  # 支持websocket
  proxy_set_header Upgrade $http_upgrade; // 把代理时http请求头的Upgrade 设置为原来http请求的请求头,wss协议的请求头为websocket
  proxy_set_header Connection "Upgrade"; // 因为代理的wss协议,所以http请求头的Connection设置为Upgrade
}
```

3. div左侧显示两个图标（竖行显示）作为菜单操作

4. 在text上点击，出现悬浮框菜单，可复制/收藏text内容。点击空白处消失，点击菜单选项后消失

5. 右键点击弹出悬浮框右键菜单 --》 context插件
问题：因为app使用了位移，transform，导致context原本应该出现在鼠标位置的，实际发生了偏移
     解决办法：减去app的偏移（左上角的偏移，left，top)
遗留问题：打开F12或者页面缩放时，上述方法会导致出现context的位置不对

解决办法：改为flexbox布局，不用绝对定位及transform

6. 右侧slider的菜单，component动态组件切换时transition不流畅
    修改transition的css动画样式
  vue 的transition的效果
  drawer,fade，可以自己设置css属性
7. icon的active，hover样式先后顺序有关系，会出现样式覆盖

1. 附件上传，el-upload的样式，list的样式处理
上传多个时，调用了多个upload接口，有多个id

2. 公众号消息模板配置, 实时预览模板

3. 用户组管理，分类查询

4. el-dialog的封装，visible的设置

router，route加入props: true 属性，在this.$router.push(...)时，可以传入params，作为组件页面的props

 this.$router.push({name:xxx, params: {userId:xxx, pageType: xxx}
      再对应的route中，设置 props属性为true， 则 params会作为跳转到的组件的props属性
https://router.vuejs.org/zh/guide/essentials/passing-props.html

7. 实现自定义确认框（confirm）

8. 获取dom元素的宽高
在Vue中，要获取指定元素的高度宽度等，可以用ref，加在普通的元素上，使用this.$refs.name，`<div ref="name"></div>`就可以获取到该dom元素。

- offsetHeight——元素的宽度，包括元素content、padding和border的部分,不包括margin
- offsetWidth——元素高度，包括......
- clientWidth——元素宽度，包括content,padding，不包括border和margin
- clientHeight——元素高度，......
- style.width——元素宽度，包括content，不包括padding，border，margin
- style.height——元素高度，.....
- scrollWidth——元素宽度，包括content,padding和溢出尺寸，不包括border和margin，没有溢出的情况下，同clientWidth
- scrollHeight——元素高度，......，没有溢出的情况下，与clientHeight相同

`let height = this.$refs.name.$el.offsetHeight`

还可以获取带有单位的数值

`let height = window.getComputedStyle(this.$ref.name).height`

问题：dom元素内部内容是动态的，重置数据后直接获取DOM元素宽高不准确

原因：重置数据后，获取dom元素宽高时，dom元素还未渲染完毕

解决办法：nextTick(callback)
```javascript
this.$nextTick(() => {
  let height = this.$refs.name.$el.offsetHeight
})
```
