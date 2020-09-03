简述 JWT 的生成过程和优缺点，怎么主动注销 JWT 和续签 JWT

- cookie session
cookie放哪里(memory)，cookie能做的事情和存在的价值
跨域时如何处理cookie
cookie和session有哪些方面的区别，并引申到 sessionStorage, localStorage, cookie 区别
cookie 和 token 都存放在 header 中，为什么不会劫持 token？
cookie,session,token,withCredentials，httpOnly
介绍下如何实现 token 加密
介绍下前端加密的常见场景和方法
    MD5/RSA
介绍下数字签名的原理

cookie token和session的区别

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


Cookie的作用：
1. 会话状态管理，如用户登录状态，购物车，游戏分数或其他需要记录的信息
2. 个性化设置，如用户自定义设置，主题等
3. 浏览器行为跟踪，如跟踪分析用户行为等

Cookie的缺点：从大小，安全，增加请求大小等方面回答