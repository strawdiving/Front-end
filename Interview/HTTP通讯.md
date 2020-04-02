## 跨域
同源策略(same-origin policy)，限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互，用来隔离潜在恶意文件。

同源是指：“协议+域名+端口”三者相同，即使两个相同的域名指向同一个IP，也非同源。
浏览器中大部分内容都是受同源策略限制，但三个标签可以不受限制：`img，link，script`

## 如何实现跨域
1. image PING

2. 通过jsonp跨域，JSONP 的工作原理，
jsonp的实现（要代码）方式；带超时，带防重名的 JSONP 的实现；

后台响应头要加什么？
Content-Type=text/javascript

它为什么不是真正的 Ajax？ 
- ajax的核心是通过XmlHttpRequest获取非本页内容
- jsonp的核心是动态添加< script >标签来调用服务器提供的js脚本

区别不在于是否跨域，ajax通过服务端代理一样可以实现跨域，jsonp本身也不排斥同域的数据的获取。jsonp是一种方式或者说非强制性协议，如同ajax一样，它也不一定非要用json格式来传递数据，字符串也行，只是不利于用jsonp提供公开服务

jsonp利用script标签（拥有src属性的标签都可以，如script,image,iframe）不受同源策略限制的特性进行跨域操作。实现简单，兼容性好；
缺点：只支持get请求，script只能get；易受xss攻击；需要服务端配合jsonp进行一定程度改造。

所以用纯前端的方式跨域访问数据只有一种可能，就是在远程服务器上设法把数据装进js格式的文件里，供客户端调用和进一步处理；

web客户端通过与调用脚本一模一样的方式，来调用跨域服务器上动态生成的js格式文件（一般以json为后缀），服务器之所以要动态生成JSON文件，目的在于把客户端需要的数据装入进去。

客户端在对JSON文件调用成功后，获得了自己所需的数据。
JSONP的要点就是允许用户传递一个callback参数给服务端，然后服务端返回数据时会将这个callback参数作为函数名包裹住JSON数据，这样客户端就可以随意定制自己的函数来自动处理返回数据了。
如何让服务端知道本地的函数名呢？只要服务端提供的js脚本是动态生成的就行了，这样调用者可以传一个参数过去告诉服务端“我想要一段调用XXX函数的js代码，请你返回给我”，于是服务器就可以按照客户端的需求来生成js脚本并响应了。

前端：1）定义callback函数，2）传入请求参数，3）动态生成script标签
example:
```javascript
    <script type="text/javascript">
    // 得到航班信息查询结果后的回调函数
    var flightHandler = function(data){
        alert('你查询的航班结果是：票价 ' + data.price + ' 元，' + '余票 ' + data.tickets + ' 张。');
    };
    // 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
    var url = "http://flightQuery.com/jsonp/flightResult.aspx?code=CA1998&callback=flightHandler";
  code参数告知服务器要返回的数据，callback参数告知本地回调函数的名字，请把查询结果传入该函数中进行调用

    // 创建script标签，设置其属性
    var script = document.createElement('script');
    script.setAttribute('src', url);
    // 把script标签加入head，此时调用开始
    document.getElementsByTagName('head')[0].appendChild(script); 
    </script>
```
服务端返回一个定制的js文件，调用callback函数并且将JSON 数据形式作为参数传递，文件内容： 

flightHandler({
    "code": "CA1998",
    "price": 1780,
    "tickets": 5
});
传给flightHandler函数的是一个json。
Content-Type = text/javascript

实现：
```javascript
function JSONP({url,params,callbackKey,callback}) {
  window.jsonpCallback = callback
  const paramKeys = Object.keys(params)
  const paramString = paramKeys.map(key=>`${key} = ${params[key]}`).join('&'))

  const script = document.createElement('script')
  script.setAttribute('src','$(url).?${paramString}')
  document.body.appendChild(script)
}
JSONP({
    url:'http://sss.weibo.com',
    params: {key: 'test'},
    callbackKey: '_cb',
    callback(result) {console.log(result.data)} });
```

3. CORS,目前主流的跨域解决方案
用额外的HTTP头来告诉浏览器一个origin/domain上的web应用被准许访问来自不同源服务器上的指定的资源。当一个资源从和该资源所在server不同的域请求一个资源时，资源会发起一个跨域HTTP请求。
如果用express，可以这样在后端设置：
```javascript
var allowCrossDomain = function(req,res,next) {
	res.header('Access-Control-Allow-Origin','http://example.com');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers','Content-Type');
     
	next()
}

app.configure(function() {
	...
	app.use(express.session({secret: 'cool beans'});
	app.use(allowCrossDomain));
	...
})
```
4. nginx反向代理,优点是轻量级，启动快，高并发。
我们用node开发的服务通常都要经过nginx的反向代理。

反向代理的原理：所有client的请求都必须先经过nginx的处理，nginx作为代理服务器再将请求转发给node服务，这样就规避了同源请求。不用目标服务器配合.

5. Websocket,websocket的工作原理和机制
一次http请求，目的是建立websocket通信，建立连接之后，Websocket的c和s都能主动向对方发送和接收数据，之间的通信和HTTP无关了，因此可以跨域。

传统http请求，其并发请求能力依赖于同时发起多个TCP连接访问服务器实现的，websocket允许在一条ws连接上同时并发多个请求；
http协议头太大，且请求携带的头大部分是重复的，无法利用上一条请求的连接，而websocket是复用长连接
需要实现客户端刷新消息时，传统利用定时ajax请求实现，大多数时候都浪费资源
websocket支持服务端推送消息

websocket实现全双工通信，可以传输基于消息的文本和二进制数据。除了最初建立连接时需要借助HTTP协议，其他时候基于TCP完成通信。
在server和client之间实现各种应用数据交换（包括JSON和自定义的二进制消息格式）。

接收到文本数据，会转为DOMString对象；二进制数据或Blob对象，将其转交给应用或将其转化为ArrayBuffer，由应用对其进一步处理。

websocket的send方法是异步的，提供的数据会在客户端排队，而函数立即返回，即回调执行时数据很可能还在排队。

缺点：对开发者要求高，需要维持住ws连接；服务器长期维持长连接需要一定成本
在提供自定义数据交换协议的同时，不再享有由服务器提供的服务和优化，如状态管理，压缩，缓存等。
没有HTTP的首部来沟通，server和client要约定以确定一种固定的消息格式，如JSON；如果要发送不同的数据类型，可以确定一个双方都知道的消息首部，利用它来沟通说明信息；websocket提供了机制来协商，即构造器的第二个可选参数。

协议可以扩展，如压缩扩展，多路复用扩展（多个websocket实现共享底层的TCP连接）

XHR是专为请求/响应通信而优化的，客户端发送请求，服务器返回响应；

SSE可以实现server到client的高效、低延迟的文本数据流，clent发起SSE连接，server使用事件源协议将更新流式发送给client。client在初次握手后，不向server发送任何数据；

websocket通过同一个TCP连接实现双向通信，两边随时可以交换数据，保证低延迟交付。

对XHR 轮询而言，排队延迟就是客户端轮询间隔：服务器上的消息可用之后，必须等到下一次客户端XHR 请求才能发送。相对来说，SSE 和WebSocket 使用持久连接，这样服务器（和客户端——如果是WebSocket）就可以在消息可用时立即发送它，消除了消息的排队延迟，也就使得总的传输延迟更小。

在完成最初的升级协商之后，客户端和服务器即可通过WebSocket 协议双向交换数据，消息分帧之后每帧会添加2~14 字节的开销；SSE 会给每个 消息添加 5 字节，但仅限于 UTF-8 内容(SSE 不是为传输二进制载荷而设计的！如果有必要，可以把二进制对象编码为base64 形式，然后再使用SSE)； HTTP 1.x 请求(XHR 及其他常规请求)会携带 500~800 字节的 HTTP 元数据，加上cookie； HTTP 2.0 压缩 HTTP 元数据，可以显著减少开销，如果请求都不修改首部，那么开销可以低至8 字节。WebSocket专门为双向通信而设计，开销很小，在实时通知应用开发中是不错的选择。

 在使用HTTP协议传输数据时，每个请求都可以协商最优的传输编码格式（如对文本数据采用gzip 压缩）；SSE 只能传输UTF-8 格式数据，事件流数据可以在整个会话期间使用gzip 压缩；WebSocket 可以传输文本和二进制数据，压缩整个会话行不通，二进制的净荷也可能已经压缩过了！

鉴于WebSocket的特殊性，它需要实现自己的压缩机制，并针对每个消息选择应用。

WebSocket 协议为实时双向通信而设计，提供高效、灵活的文本和二进制数据传输，同时也错过了浏览器为HTTP提供的一些服务，在使用时需要应用自己实现。在进行应用数据传输时，需要根据不同的场景选择恰当的协议，WebSocket 并不能取代HTTP、XHR 或SSE，关键还是要利用这些机制的长处以求得最佳性能。

 鉴于现在不同的平台及浏览器版本对WebSocket支持的不同，有开发者做了一个叫做http://socket.io 的为实时应用提供跨平台实时通信的库，我们可以使用它完成向WebSocket的切换。http://socket.io 旨在使实时应用在每个浏览器和移动设备上成为可能，模糊不同的传输机制之间的差异。http://socket.io 的名字源于它使用了浏览器支持并采用的 HTML5 WebSocket 标准，因为并不是所有的浏览器都支持 WebSocket ，所以该库支持一系列降级功能：

    WebsocketAdobe:registered: Flash:registered: SocketAJAX long pollingAJAX multipart streamingForever IframeJSONP Polling

在大部分情境下，你都能通过这些功能选择与浏览器保持类似长连接的功能

- websockets是如何进行握手的

6. 使用HTML5中新引进的window.postMessage方法来跨域传送数据（ie 67 不支持）
允许来自不同源的脚本采用异步方式进行有限的通信。可以跨文档，多窗口，跨域消息传递。

- 页面访问Cookie的限制条件
 1）跨域问题
 2）设置了HttpOnly
- web端cookie的设置和获取,cookie 结构有什么字段

### 前端如何实现即时通讯
- Long-Polling、Websockets 和 Server-Sent Event 之间有什么区别？
1. 短轮询：每隔一段时间客户端就发出一个请求，去获取server最新的数据，一定程度模拟了即时通讯
2. commet，一种是基于Ajax的长轮询方式，一种是基于iframe的流方式，一般叫做长连接
长轮询的缺点：服务器hold连接会消耗资源，返回数据顺序无保证，
长连接的缺点：server维护长连接消耗资源
3. SSE（Server-Sent-Events）：一种允许server向client推送数据的HTML5技术。client发起请求，打开event stream，后端就会一直向client推送数据。
优点：基于HTTP而生，不需太多改造就能用
缺点：基于文本传输效率没有websocket高，不是严格的双向通信，client向server发送请求，无法复用之前的连接，需要重新发独立的请求。
4. Websocket（双向通信）
全新的，独立的协议，基于TCP协议，和http兼容，不融入http。作用是建立全双工，持久化通信。

websocket的工作原理和机制

web worker,为Javascript创造多线程环境，允许主线程创建Worker线程，将一些任务分配给后者执行。
Service Workers，本质上充当Web应用程序与client之间的代理服务器，也可在网络可用时充当网络和浏览器之间的代理，创建有效的离线体验。

# HTTP
HTTP协议基于TCP协议出现，TCP是一条双向的通讯通道，HTTP在TCP基础上，规定了Request-Response的模式，决定了请求必须是浏览器首先发起的。

HTTP是纯粹的文本协议，它是使用 TCP 协议来传输文本格式的一个应用层协议。在TCP通道中传输的完全是文本。

1. 请求报文格式：
1）request line 请求行(请求方法 请求路径URL HTTP协议及版本)：GET / HTTP/1.1， path完全由server决定
2）heade 请求头部：若干行，每一行是用冒号分隔的名称和值
3）空行，
4）body 请求体：PUT,POST等携带的数据

2. 响应报文格式：
1）response line 响应行：协议版本 状态码 状态码的原因短语：HTTP/1.1 200 OK
2）head 响应头：响应首部字段组成
3）空行
4）body 响应体：服务器响应的数据
## HTTP Method方法
HTTP1.0: 
- GET，请求server发送资源，浏览器通过地址访问页面都是GET
- POST，发送数据给server，表单提交产生POST
- HEAD：和GET类似,只返回请求资源的头部信息，多数由JS发起，使用场景之一：下载一个大文件之前先获取其大小再决定是否要下载，以节约带宽

HTTP1.1: 
- PUT：添加资源，或用请求中的有效负载更新目标资源
- DELETE：删除资源
上述2者只是语义的约束，没有强约束
- CONNECT：预留给能够将连接改为管道方式的代理服务器
多用于HTTPS和WebSocket
- PATCH：用于对资源进行部分修改

- OPTIONS：用于获取目的资源所支持的通信选项（Access-Control-Allow-xxx）
- TRACE：回显server收到的请求，主要用于测试或诊断
一般用于调试，多数线上服务都不支持

### restful的method —— GET,POST,PUT,DELETE

### 不同请求类型的区别
1.1 GET VS POST
- 数据传输方式：GET通过URL传输数据，POST数据通过请求体传输
- 安全性：POST数据在请求体，有一定安全保证，GET在URL中，通过历史记录，缓存很容易查到数据信息
- 数据类型：GET,ASCII字符；POST无限制
- 刷新后退等操作对GET无害，POST可能会重复提交表单
- 特性不同，GET只读，不会引起server状态变化，且幂等；POST非安全非幂等

HTTP method Post一个file的时候file放在哪的？
1.2 http 请求幂等性
幂等，同一个请求方法执行多次和仅执行一次的效果完全相同

1.3 PUT VS POST VS PATCH

根本区别： 两者都能创建资源，PUT是幂等的，POST非幂等
PUT的URI指向具体单一资源，POST可以指向资源集合。
`POST https://www.jianshu.com/articles`
`PUT https://www.jianshu.com/articles/839545`

例：如创建文章时，用post，在articles的资源集合下创建一篇新文章，多次提交会创建多个文章，非幂等。

put的语义是更新对应文章下的资源，幂等

PATCH,用来对已知资源进行局部更新，只需要携带需要修改的信息。

PUT是直接覆盖资源，局部修改时会带很多无用信息。
## HTTP状态码和状态文本，301 与 302 的区别？200和304的区别
1xx，临时回应，表示客户端请继续
1. 2xx，请求成功
200，OK，请求成功

201，Created，请求已被实现，新资源已根据请求的需要而建立
202，Accepted，表示请求已接受，但还没执行，不保证完成请求
204，No Content,请求成功，响应报文不含实体的主体部分
206，Partial Content，进行范围请求

2. 3xx，重定向，表示请求的目标有变化，希望客户端进一步处理
301，moved permanently,永久性重定向，表示当前资源已被转移，接近于报错，提示客户端下次别再来了
302，found，临时性重定向，表示资源临时被转移
**304，not modified，跟客户端缓存没有更新。**客户端已经有缓存的版本，并且在 Request 中告诉了服务端，当服务端通过时间或者 tag，发现没有更新的时候，就会返回一个不含 body 的 304 状态。

303，see other，表示资源存在着另一个URL，应使用GET方法定向获取资源
307，临时重定向，和302含义相同
303明确表示客户端应用get获取资源，把post请求变为get请求进行重定向
307遵循浏览器标准，不会从post变为get

3. 4xx 客户端请求错误
403，Forbidden，无权限，对请求资源的访问被server拒绝
404，not found，请求页面不存在，在server上未找到请求的资源

400，bad request，请求报文存在语法错误
401，Unthorized，表示请求需要有通过HTTP认证的认证信息
408，Request Timeout，请求超时
409，Conflict，请求的资源可能引起冲突

5. 5xx，server端请求错误
500，interval server error，服务端错误，执行请求时发生了错误
503，Service Unavailable，服务器暂时超负载或在维护，server暂时性错误，可以一会儿再试

501，Not Implemented，请求超出server能力范围（如是server不支持的方法）
505，http version not supported，服务器不支持或拒绝支持请求中使用的HTTP版本

## HTTP Head（键值对）
1. HTTP Request/Response的Header
**常用请求头部：**
- Accept：浏览器接受的格式（内容/媒体类型）
- Accept-Encoding/Language/Charset：浏览器接受的编码格式，语言（用于server判断多语言），字符集
- Cache-Control：控制缓存的时效性
- Connection：连接方式，如果是keep-alive，且server支持，会**复用连接**
- Host：HTTP访问使用的域名，允许多个域名同除一个IP，即虚拟主机
- If-Modified-Since，上次访问时的资源更改时间，server发回的资源更新时间（Last Modified），server认为此时间后自己未更新，返回304
- If-None-Match，上次访问时使用的E-Tag，通常是页面的信息摘要，比更改时间更准确。
- User-Agent：产生请求的浏览器类型
- Cookie，客户端存储的cookie字符串

**常用响应头部：**
- Cache-Control：缓存控制，用于通知各级缓存保存的时间，如max-age=0，表示无需缓存
- Connection：连接方式，keep-alive表示**复用连接**
- Content-Language,Encoding,Length,Type，实体资源的语言，编码格式（通常是gzip），大小（有利于浏览器判断内容是否已经结束），内容类型（网页text/html）
- Date，创建报文的日期，当前的服务器日期
- ETag，页面的信息摘要，用于判断是否需要重新到服务端取回页面
- Expires，实体主体的过期时间，用于判断下次请求是否需要到server取回页面
- Keep-Alive，保持连接不断时需要的一些信息，如timeout=5,max=100
- Last-Modified，资源最后的修改时间
- Server，server软件的类型
- Set-Cookie，设置cookie，可以存在多个
- via：server的请求链路，对一些调试场景很重要，代理服务器相关信息
- Allow，资源可支持的http请求的方法

通用首部字段（req和res都会用）:
- Cache-Control:控制缓存
- Connection：连接管理，逐条首部
- Upgrade：升级为其他协议
- via：代理服务器相关信息
- Warning：错误和警告通知
- Transfor-Encoding，报文主体的传输编码格式
- Date，创建报文的日期

其他请求头部：
- If-Unmodified-Since
- If-Match
- Referer：请求原始放的url
- If-Ranges，资源未更新时发送实体byte的范围请求
- Range，实体的字节范围请求
- Authorization，web的认证信息
- Proxy-Authorization，代理服务器要求的web认证信息
- TE，传输编码的优先级
- Max-Forwards，最大的逐跳次数
- Expect，期待server的特定行为

其他响应头部：
- Location，令server重定向的URI
- Accept-Ranges，能接受的字节范围
- Age，推算资源创建经过的时间
- WWW-Authenticare，server要求client的验证信息
- Proxy-Authenticare，代理server...
- Retry-After，和状态码503一起使用，表示下次请求server的时间

实体首部字段（针对req和res报文的实体部分使用首部）：
- Last-Modified，资源最后的修改时间
- Expires，实体主体的过期时间
- Content-Language,Encoding,Length,Type，实体资源的语言，编码格式，大小，媒体类型
- Content-MD5 实体报文的摘要
- Content-Location， 实体主体的位置返回

**Connection:keep-alive**
每次http请求都要创建一个连接，消耗资源和时间，Connection:keep-alive**重用连接**，表明请求响应后不要关闭，保持长连接。

优点：
- 较少CPU和内存的使用（同时打开的连接少了）
- 允许请求和应答的管线化
- 降低拥塞控制（TCP连接少了）
- 减少了后续请求的延迟（无需握手）
- 报告错误无需关闭TCP连接

## HTTP Request Body请求体
主要用于提交表单场景，只要发送的body服务器端认可就行。常见的格式：application/json,application/x-www-form-urlencoded（form标签提交产生的请求）,multipart/form-data（文件上传）,text/xml

## 完整描述从输入 URL 到整个网页加载完毕及显示在屏幕上的整个流程。
输入地址
- 浏览器查找域名的 IP 地址
- 这一步包括 DNS 具体的查找过程，包括：浏览器缓存->系统缓存->路由器缓存…
- 浏览器向 web 服务器发送一个 HTTP 请求
- 服务器的永久重定向响应（从 http://example.com 到 http://www.example.com）
- 浏览器跟踪重定向地址
- 服务器处理请求
- 服务器返回一个 HTTP 响应
- 浏览器显示 HTML
- 浏览器发送请求获取嵌入在 HTML 中的资源（如图片、音频、视频、CSS、JS等等）
- 浏览器发送异步请求

## dns解析原理，输入网址后如何查找服务器
## HTTPS
HTTPS有两个作用：一是确定请求的目标服务端身份，二是保证传输的数据不会被网络中间节点窃听或篡改。

HTTPS是使用加密通道来传输HTTP的内容。HTTPS首先与服务端建立一条TLS加密通道，TLS构建于TCP协议之上，实际上是对传输的内容做一次加密，所以传输内容跟HTTP没有任何区别。
14. http有几次挥手和握手？TLS的中文名？TLS在哪一网络层？https（对是https）有几次握手和挥手？https协议的过程,获取加密密钥的过程。都说要减少 https 的请求，https 为什么慢 ？
## HTTP2 与http1 的区别
### 一个tcp连接能发几个http请求？
HTTP1.0版本，一般不支持长连接，每次请求发完，TCP连接就会断开，因此一个TCP连接发送一个HTTP请求；
但是有种情况可以将一条TCP连接保持在活跃状态，通过Connection和Keep-Alive首部，在请求头带上Connection:Keep-Alive，并且可以通过Keep-Alive通用首部中指定的，用逗号分隔的选项调节Keep-Alive的行为，如果客户端和服务端都支持，可以发送多条。但该方式有限制（HTTP权威指南4.5.5对于Keep-Alive连接的限制和规则）

HTTP1.1支持了长连接，只要TCP连接不断开，就可以一直发HTTP请求，持续不断，没有上限。

HTTP2.0,支持多连接复用，一个TCP请求可以并发多个HTTP请求，同样也支持长连接，只要不断开TCP，HTTP请求数也可以无上限地持续发送。

最大的改进有2点：一是支持服务端推送，二是支持TCP连接复用
- 服务器推送
在客户端发送第一个请求到服务端时，提前把一部分内容推送给客户端，放入缓存当中，避免客户端请求顺序带来的并行度不高，从而导致的性能问题。

server可以在发送HTML时主动推送其它资源（如JS和CSS文件），而不用等到浏览器解析到相应位置，发起请求再响应。

server可以主动推送，client也有权利选择是否接收。如果server推送的资源已被浏览器缓存过，client可以发送RST_STREAM来拒收。主动推送也遵循同源策略，不会推送第三方资源给client

- TCP连接复用（持久连接，管线化）HTTP2是如何实现多路复用的？
使用一个TCP连接来传输多个HTTP请求，避免TCP连接时产生的三次握手开销，和创建TCP连接时传输窗口小的问题。

HTTP1中，想并发多个请求，必须使用多个TCP连接，浏览器为了控制资源，还会对单个域名有6-8个TCP连接请求限制
HTTP2，同域名下所有通信都在单个连接上完成，单个连接可以承受任意数量的双向数据流；
数据流以消息的形式发送，消息由多个帧组成，多个帧之间可以乱序发送，根据帧首流标志可以重新组装。

- 二进制分帧
帧：HTTP2数据通信的最小单位
消息：HTTP2中逻辑上的HTTP消息，如请求和响应等，由1或多个帧组成
流：存在于连接中的一个虚拟通道，可以承载双向消息，每个流都有一个唯一的整数ID

使用二进制格式传输数据，而非HTTP1.x的文本格式，解析起来更高效。

- 头部压缩
HTTP1在请求和响应中重复地携带不常改变的、冗长的头部数据，给网络带来额外负担

1. HTTP2在c和s端使用“首部表”来跟踪和存储之前发送的键值对，对相同数据，不再通过每次请求和响应发送
2. 首部表在连接存续期内始终存在，由c和s端共同维护
3. 每个新的首部键值对要么被追加到当前表末尾，要么替换表中之前的值（只发送差异数据，从而减少头部信息量）

了解HTTP3吗，HTTP3做了哪些优化

## TCP,UDP
1. 网络协议一共有几层，能具体讲讲他们的协议吗
1. TCP连接的特点，TCP连接如何保证安全可靠的？
2. 为什么tcp要三次握手四次挥手？tcp的三次握手和四次挥手画图（当场画写ack 和 seq的值）？
3. tcp与udp的区别
UDP场景：
- 实时音视频可以而且应该用UDP，一方面常涉及到网络穿透，另一方面不需要重传，中间丢帧完全不重要。为了重传往往会造成延迟和不同步，某一帧因为重传导致延后才到，则整个音视频就延迟了，这种延迟是累加的，随着持续丢帧，延迟会越来越大，达到数秒甚至分钟级，会严重影响实时音视频的用户体验。因此，实时音视频聊天功能通常都用UDP实现。
- 网络真的非常可靠，以至于完全不需要考虑UDP丢包问题的情况。典型的例子应该是专门为有线局域网设计的协议。
- TCP是纯粹的流式数据，所以制定传输协议的时候，接受方需要自行判定一个包的开始和结束，因为可能接受到半个包或两个包（粘包情况）。如果数据报的起止判定对具体的程序会成为大问题，也可以考虑UDP

采用UDP有3个关键点：
 网络带宽需求较小，而实时性要求高
 大部分应用无需维持连接
 需要低功耗

4. 域名解析时是tcp还是udp
5. 域名发散和域名收敛
3. 什么是tcp流，什么是http流

9. 服务器如何知道你？
## 前端安全
1. xss，csrf…攻击原理及防范措施
2. 接口攻击的方式和防御措施，DOS
### 浏览器缓存，强缓存和协商缓存（从200缓存，到cache到etag再到）
1. client向server请求资源
2. server返回资源，并通过**响应头决定缓存策略**
3. client根据响应头的缓存决策决定是否缓存资源，如果要缓存，就将响应头与资源缓存下来
4. 在client再次请求并命中资源时，此时client会去检查上次的缓存策略，根据策略的不同，是否过期等决定是直接读取本地缓存，还是和server协商缓存

**强缓存：**
离不开响应头Cache-Control和Expires
- Cache-Control，优先级高于Expires，
`Cache-Control:max-age =3145250450`，用max-age控制过期时间（相对时间）
- Expires，表示过期时间（绝对时间），受限于本地时间，如果修改了本地时间，可能导致缓存失效

1. 如果是no-store，不产生任何缓存，不能重用缓存的资源
2. 如果是no-cache，缓存每次都生效，先缓存本地，但命中缓存后必须与server验证缓存的新鲜度
3. 看能否被中继缓存，public被所有用户缓存,包括中继缓存server，private只能被终端浏览器缓存
4. 再判断max-age，如果超过了最大缓存时间，在缓存有效期内命中缓存，则直接读取本地的缓存资源；过期之后和server协商缓存

**协商缓存：**
当第一次请求时server的响应头中没有Cache-Control和Expires，或者过期，或者为no-cache时，则浏览器第二次请求时就会与服务器协商

1. 如果缓存和server中资源最新版本一致，就无需下载该资源，直接返回304 Not Modified
2. 如果浏览器中的缓存已经是旧版本，server就会把最新资源的完整内容返回，状态码200

判断缓存是否新鲜：

1. Last-Modified/If-Modified-Since
client首次请求资源时，server会把资源的最新修改时间Last-Modified通过响应首部发送给client，再次发送请求时，client将server返回的修改时间放在请求头If-Modified-Since中发给server，server再跟对应资源进行比对，如果资源更新了，200，如果资源是最新的，返回304，表示客户端直接用缓存即可
2. ETag/If-None-Match
类似，Etag是根据资源内容进行hash，生成一个信息摘要，只要资源有变化，ETag就发生巨变，通过摘要信息比对，就可确定缓存是否为最新，精确度更高。

流程如下：
1. 用户请求资源，判断是否存在缓存
2. 如果不存在，向server请求资源
3. server响应请求，缓存协商，返回展示资源
4. 如果存在缓存，判断缓存是否过期，如果未过期则直接使用缓存，返回展示资源
5. 如果缓存过期（Expires，Cache-Control:max-age），进行协商缓存
6. 先判断ETag，向服务器请求If-None-Match，根据返回200还是304,判断是否读取本地缓存
7. 如果没有ETag，判断Last-Modified，向服务器请求If-Modified-Since，根据200还是304判断

10. cookie token和session的区别

cookie，session，token的产生背景，原理，有什么问题

HTTP1.x协议是一个无状态的协议，即使同一个客户端连续两次发送请求给服务器，服务器也识别不出这是同一个客户端发送的请求，导致比如加了一个产品到购物车，但因识别不出是同一个客户端，刷新一下页面就没有了。

- Cookie
为解决HTTP无状态导致的问题，就出现了Cookie，来解决客户端和服务端会话状态的问题，这个状态是指后端服务的状态，而非通讯协议的状态。

作为一段不超过4kb的小型文本数据，指某些网站为了辨别用户身份而存储在用户本地终端上的数据。
cookie不只是存放在浏览器里，还可以存放在本地文件里。存放在本地，即使关闭了浏览器，cookie依然可以生效。
如果没有设置过期时间或设置为0，关闭浏览器后cookie就消失；

Cookie的设置：
1. 客户端发送HTTP请求到服务器
2. 服务器收到HTTP请求，在响应头里添加一个Set-Cookie字段
3. 浏览器收到响应后保存下cookie
4. 之后对该服务器的每一次请求中都通过Cookie字段将Cookie信息发送给服务器

cookies的属性:
- Name/Value，用Javascript操作cookie时注意对value进行编码处理
- Expires，设置cookie的过期时间 `Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;`,缺省时，表示会话性cookie（Session），值保存在客户端内存中，用户关闭浏览器时失效。有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 Cookie 也会被保留下来，就好像浏览器从来没有关闭一样。

持久性Cookie，会保存在用户的硬盘中，直至过期或者清除。设定的日期和时间只和客户端相关，而非服务端。
- Max-Age，设置cookie失效之前需要经过的秒数，为正数时（浏览器会将其持久化，即写到对应的cookie文件中），为负数时（表示为会话性cookie），为0（立即删除这个cookie）
Max-Age比Expires优先级更高

Domain和Path标识共同定义了Cookie的作用域：即Cookie应该发送给哪些URL。

- Domain，指定了cookie可以送达的主机名，未指定就默认为当前文档访问地址中的主机部分（不包含子域名），如.taobao.com。**不能跨域设置cookie**
- Path，指定了URL路径，必须出现在要请求的资源的路径中才可以发送Cookie首部，如Path=/docs，/docs下的资源才会带Cookie首部，/test就不带

- Secure，标记为Secure的Cookie只应通过被HTTPS协议加密过的请求发送给服务端。使用HTTPS安全协议，保护Cookie在传输过程中不被窃取和篡改。
- HTTPOnly，防止客户端脚本通过document.cookie等方式访问cookie，有助于避免XSS攻击。
- SameSite，2月发布的chrome80版本默认屏蔽了第三方的cookie，导致很多应用出现问题。
可以让Cookie在跨站请求时不被发送，从而阻止跨站请求伪造攻击（CSRF）。有三种值：
1）Strict，仅允许一方请求携带Cookie，即浏览器将只发送相同站点请求的Cookie，当前网页URL和请求目标URL完全一致。
2）Lax，允许部分第三方请求携带Cookie
3）None，无论是否跨站都会发送Cookie

之前默认是None，Chrome80后默认Lax

**跨域&跨站**
跨站和跨域是不同的，同站same-site和跨站cross-site，第一方first-party和第三方third-party是等价的，而和浏览器同源策略中的同源same-origin和跨域cross-origin是完全不同的

同源策略： 同源是指两个URL的协议、主机名、端口都一致，比较严格
Cookie的同站：只要两个URL的eTLD+1相同即可（eTLD表示有效顶级域名，如.github.io,.com，eTLD+1则表示，有效顶级域名+二级域名，如taobao.com等

www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。

接下来看下从 None 改成 Lax 到底影响了哪些地方的 Cookies 的发送？
对大部分 web 应用而言，Post 表单，iframe，AJAX，Image 这四种情况从以前的跨站会发送三方 Cookie，变成了不发送。

Post表单：应该的，学 CSRF 总会举表单的例子。

iframe：iframe 嵌入的 web 应用有很多是跨站的，都会受到影响。

AJAX：可能会影响部分前端取值的行为和结果。

Image：图片一般放 CDN，大部分情况不需要 Cookie，故影响有限。但如果引用了需要鉴权的图片，可能会受到影响。

除了这些还有 script 的方式，这种方式也不会发送 Cookie，像淘宝的大部分请求都是 jsonp，如果涉及到跨站也有可能会被影响。
问题

我们再看看会出现什么的问题？举几个例子：

    天猫和飞猪的页面靠请求淘宝域名下的接口获取登录信息，由于 Cookie 丢失，用户无法登录，页面还会误判断成是由于用户开启了浏览器的“禁止第三方 Cookie”功能导致而给与错误的提示

    淘宝部分页面内嵌支付宝确认付款和确认收货页面、天猫内嵌淘宝的登录页面等，由于 Cookie 失效，付款、登录等操作都会失败

    阿里妈妈在各大网站比如今日头条，网易，微博等投放的广告，也是用 iframe 嵌入的，没有了 Cookie，就不能准确的进行推荐

    一些埋点系统会把用户 id 信息埋到 Cookie 中，用于日志上报，这种系统一般走的都是单独的域名，与业务域名分开，所以也会受到影响。

    一些用于防止恶意请求的系统，对判断为恶意请求的访问会弹出验证码让用户进行安全验证，通过安全验证后会在请求所在域种一个Cookie，请求中带上这个Cookie之后，短时间内不再弹安全验证码。在Chrome80以上如果因为Samesite的原因请求没办法带上这个Cookie，则会出现一直弹出验证码进行安全验证。

    天猫商家后台请求了跨域的接口，因为没有 Cookie，接口不会返回数据

    ……

解决方案就是设置 SameSite 为 none。

Cookie的作用：
1. 会话状态管理，如用户登录状态，购物车，游戏分数或其他需要记录的信息
2. 个性化设置，如用户自定义设置，主题等
3. 浏览器行为跟踪，如跟踪分析用户行为等

Cookie的缺点：从大小，安全，增加请求大小等方面回答

11. 一个 XMLHttpRequest 实例有多少种状态？
- 抓包知识，调试
