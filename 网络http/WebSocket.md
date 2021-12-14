
Websocket,websocket的工作原理和机制
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

- websocket是如何进行握手的
websocket的使用场景
理解 WebSocket协议的底层原理、与 HTTP的区别

## Websocket是HTML5中的新协议，支持持久连接。HTTP不支持持久连接
HTTP是一个请求，一个响应，且响应时被动的，不能主动发起；
WebSocket，服务器完成协议升级后，HTTP-->Websocket，server能主动推送消息给client
Websocket只需要一次HTTP握手，整个通讯建立在一次连接/状态中，避免了HTTP的非状态性，server一直知道client的信息，直到关闭请求

Websocket主要提供了全双工、持久化的连接，和HTTP一样工作在TC层上，主要解决了长轮询的问题

websocket可以广播

缺点：资源消耗大

### 长轮询
client发送消息后，如果没等到server的响应，请求就阻塞等server返回消息，知道server返回消息，client才发起新的HTTP轮询请求（HTTP会复用前一个HTTP请求的TCP链接）

阻塞等待模式，此时如果client需再发一次消息，就要建立新的TCP连接，资源浪费

而server想再推新的响应消息给client，要等待client发起新的请求

WebSocket允许c/s在任意时间任意发送消息，且异步处理接收到的消息

Websocket第一次连接时，跟server握手，会用到HTTP协议，在Upgrade里指明该次握手是建立Websocket（Upgrage: Websocket)，握手后，c/s间通信将按照websocket的协议来通信

Websocket只需要建立一次连接，随后websocket报文只有6字节的开销，没有很大的header要处理

websocket是异步通信模式。