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

9. 服务器如何知道你？

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

- 抓包知识，调试

http content-type 有哪几种，有什么区别
http1.1时如何复用tcp连接
Http报文的请求会有几个部分
介绍下HTTP状态码
403、301、302是什么
说一下200和304的理解和区别

- get和post有什么区别?什么情况下用到?

(1) GET请求在浏览器回退和刷新时是无害的，而POST请求会告知用户数据会被重新提交；
(2) GET请求可以收藏为书签，POST请求不可以收藏为书签；
(3) GET请求可以被缓存，POST请求不可以被缓存；
(4) GET请求只能进行url编码，而POST请求支持多种编码方式。
(5) GET请求的参数可以被保留在浏览器的历史中，POST请求不会被保留；
(6) GET请求长度有限制，发送数据时，GET请求向URL添加数据，URL长度是有限制的，最大长度是2048个字符，POST请求无长度限制；
(7) GET请求只允许ASCII字符，POST请求无限制，支持二进制数据；
(8) GET请求的安全性较差，数据被暴露在浏览器的URL中，所以不能用来传递敏感信息，POST请求的安全性较好，数据不会暴露在URL中；
(9) GET请求具有幂等性(多次请求不会对资源造成影响)，POST请求不幂等；
(10) GET请求会产生一个TCP数据包，POST请求会产生两个TCP数据包，因为GET请求会将http header和data数据一并发送出去，而POST请求会先发送http header数据，服务端响应100(continue)，然后POST请求再发送http data数据，服务端再响应200返回数据。

Post一个file的时候file放在哪的？
HTTP Response的Header里面都有些啥？

Http请求的过程与原理
HTTP 请求——GET 和 POST 以及相关标头，如 Cache-Control、ETag、Status Codes 和 Transfer-Encoding；
浏览器向服务器发送请求，相应数据包被拦截怎么办
http缓存控制
缓存相关的HTTP请求头
性能优化为什么要减少 HTTP 访问次数？
http有几次挥手和握手？
REST 与 RPC；

从浏览器里访问一个地址，从网络的 tcp/ip 协议、聊到操作系统 io、内存管理、进程管理和文件管理，再聊到负载均衡、限流算法、分布式事务，相比之下前端真的简单很多，不过知识储备多肯定是有用的。

HTTP 首部（Header）和实体（Body）的分隔符是什么，用正则如何匹配
HTTP请求报文和响应报文的具体组成，能理解常见请求头的含义，有几种请求方式，区别是什么
- HTTP 报文
  请求行 + 头部信息 + 空白行 + body  有被问到说空白行的意义，我一直以为就是纯粹来标识 headers 的结束，但是面试官说不止这个功能，我后面看了HTTP 权威指南 也没有找到，Stack Overflow 也没找到。。。希望有人知道可以跟我说一下。
HTTP所有状态码的具体含义，看到异常状态码能快速定位问题
HTTP 状态码：301、302、307 的区别

如何实现 Tab（标签）页之间，客户端与服务器的实时通讯

5. CDN的作用和原理

