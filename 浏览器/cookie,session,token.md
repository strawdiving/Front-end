cookie，session，token的产生背景，原理，有什么问题

HTTP1.x协议 是一种无状态的协议，客户端每次发送请求时，首先要和服务器端建立一个连接，在请求完成后又会断开这个连接。这种方式可以节省传输时占用的连接资源，但同时也存在一个问题：每次请求都是独立的，服务器端无法判断本次请求和上一次请求是否来自同一个用户，进而也就无法判断用户的登录状态。导致比如加了一个产品到购物车，但因识别不出是同一个客户端，刷新一下页面就没有了。

为解决HTTP无状态导致的问题，如，为了使某个域名下的所有网页能共享某些数据，记住会话，记住哪些人登陆了系统，哪些人往自己购物车放了东西等等需求，就出现了Cookie和session

## Cookie
Cookie 是服务器端发送给客户端的一段特殊信息，这些信息以文本的方式存放在客户端，客户端每次向服务器端发送请求时都会带上这些特殊信息。有了 Cookie 之后，服务器端就能够获取到客户端传递过来的信息了，如果需要对信息进行验证，还需要通过 Session。客户端请求服务端，服务端会为这次请求开辟一块内存空间，这个便是 Session 对象。

为解决HTTP无状态导致的问题，就出现了Cookie，来解决客户端和服务端会话状态的问题，这个状态是指后端服务的状态，而非通讯协议的状态。

cookie是浏览器实现的一种数据存储功能，作为一段不超过4kb的小型文本数据，指某些网站为了辨别用户身份而存储在用户本地终端上的数据。

由服务器生成，发送给浏览器，下次请求同一网站时会把该cookie发送给服务器。由于存在客户端，所以浏览器加入了一些限制确保cookie不会被恶意使用，同时不会占据太多磁盘空间。每个域的cookie数量是有限的。

cookie不只是存放在浏览器里，还可以存放在本地文件里。存放在本地，即使关闭了浏览器，cookie依然可以生效。*浏览器把cookie以键值对的形式保存到某个目录下的文本文件内？*
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
- HTTPOnly，防止客户端脚本通过document.cookie等方式访问cookie，有助于避免XSS攻击
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

cookie设置http-only属性后，可以阻止js对cookie操作，h那么 XSS 注入的问题也基本不用担心了。但请求时cookie还是会被自动带到请求头中，无法避免CSRF。
设置secure，cookie只允许通过HTTPS传输，secure可以过滤掉一些使用HTTP协议的XSS注入，但并不能完全阻止

## session
会话，服务器要知道当前发送请求给自己的人是谁。为了区分，服务器要给每个客户端分配不同的“身份标识”，客户端如何保存这个标识可以有很多方式，对于浏览器，一般默认cookie

服务器使用session把用户信息临时保存在服务器上，用户离开网站后，session会被销毁。这种用户存储方式相对cookie来说更安全。但用session，服务器不能做负载均衡，否则下一个操作请求到了另一个服务器时session会丢失。

## Cookie + Session
客户端访问服务器的流程：

1. 客户端发送HTTP请求到服务器
2. 服务器收到HTTP请求，建立一个session，并发送一个http响应给客户端，在响应头里添加一个Set-Cookie字段，这个字段里包含了sessionId，`Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]`
3. 浏览器收到响应后保存下cookie
4. 客户端发起第二次请求，假如服务器给了set-cookie，浏览器会自动在请求头中Cookie字段中添加Cookie信息
5. 服务器接收请求，分解cookie，验证信息，核对后返回响应给客户端
6. 之后对该服务器的每一次请求中都通过发送给服务器

即：

1. HTTP Request
2. HTTP Response + Set-Cookie
3. HTTP Request + Cookie
4. HTTP Response

注：
- cookie只是实现session的其中一种方案，虽然是最常用的，但不是唯一的方法。禁用cookie后还有其他方法存储，如放在url中
- 现在大多都是Session + Cookie，但是只用session不用cookie，或是只用cookie不用session，在理论上都可以保持会话状态。可是实际中因为多种原因，一般不会单独使用
- 用session只需要在客户端保存一个id，实际上大量数据都保存在服务端。如果全部用cookie（session中的信息都给到cookie），数据量大时客户端没有那么大空间（4Kb）
- 如果只用cookie不用session，账户信息全部存储在客户端，一旦被劫持，全部信息都会泄露，且客户端数据量大，网络传输数据量也会变大

简而言之，**session有如用户信息档案表，里面包含了用户的认证信息和登录状态等信息，而cookie就是通行证**。

如果不用session，如何验证客户端发给服务端的session id就是服务端生成的而不是伪造的？

## token
在大多数使用Web API的互联网公司中，tokens 是多用户下处理认证的最佳方式。

JSON Web令牌（JWT）是一种JSON对象，在RFC 7519中定义为在两方之间表示一组信息的安全方式。

简单的说，JWT是具有以下格式的字符串 `header.payload.signature`

存放：一般存放在local storage, cookie，或session storage中

认证过程：

- 用户登录，成功后服务器返回Token给客户端。
- 客户端收到数据后保存在客户端
- 客户端再次访问服务器，将token放入headers中，向业务接口发送请求
- 业务接口执行业务逻辑前，凭token验证用户身份
  合法性（有token),token未过期，token对应的用户权限Auth授权，
  服务器端采用filter过滤器校验。校验成功则返回请求数据，校验失败则返回错误码

token的认证方式类似于**临时的证书签名**，并且是一种服务端无状态的认证方式，非常适合RESTful API的场景。所谓无状态就是服务端不会保存身份认证相关的数据。

用户登录了，服务端给他发一个令牌（token)，里面包含了用户的user id，用HMAC-SHA256算法，加上一个服务端才知道的密钥，对数据做一个签名，把签名和数据一起作为token。由于别人都不知道密钥，就无法伪造token。

*Header + Payload (用户信息数据{ userId: 'u4498294' }) 密钥 ===> 经过HMAC-SHA256算法 => 生成签名token*

用户把token发过来时，再用HMAC-SHA256算法和同样的密钥，对数据进行再一次签名，和token中对签名比较，如果相同，就知道用户已经登录过了，并且可以直接取到用户信息；如果不同，说明被篡改了

*Header + Payload (用户信息数据{ userId: 'u4498294' }) 密钥 ===> 经过HMAC-SHA256算法 => 生成签名token ==> 对比 token中的签名*

token中的数据是明文保存的（虽然用base64做下编码，但这不是加密，仍然可以被别人看到，所以不能存放敏感信息）；用token就不用保存session id，只是生成token验证token，虽然让服务器有一些计算压力（例如加密、编码和解码），用CPU计算时间换取session存储空间。机器集群就可以自由地水平扩展。

- 简述 JWT 的生成过程和优缺点，怎么主动注销 JWT 和续签 JWT
JWT（Json web token)，默认不加密
服务器认证后，生成一个JSON对象，发给client

JWT分为3个部分，Header(头部)，Payload, Signature(签名)，中间用"."隔开，即Header.Payload.Signature，再将JWT对象用base64Url转成字符串，返回给用户。
```javascript
Header: {
  "alg": "HS256", //签名算法 HS256
  "typ": "JWT"，// token的类型，JWT
}
Payload: // 存放实际需要传递的数据

Signature: 对前两部分的签名，防止数据篡改
           需要一个密钥secret（只有服务器知道），用Header里指定的算法，按公式产生签名
```
Header可以有7个字段:
- iss, 签发人
- exp, 过期时间
- sub, 主题
...
- jti, 编号
还可以定义私有字段

- 缺点：
服务器不保存session的状态，使用过程中无法废除某个token，或更改token权限。

jwt 无法作废已经颁布的令牌。由于服务端不需要存储session状态，因此使用过程中无法废弃某个token或更改token的权限。也就是说，token一旦签发了，到期之前就会始终有效，除非服务器部署额外的逻辑。

payload存储的用户信息通过base64加密，可以直接解密，所以不能存放敏感数据。

生成token-- json web token:
```javascript
function(req, res) {
  token = jwt.sign({ _id: user.id, admin: user.role === 'admin' }, 'secret123', { expiresIn: 3600*24*3 })
  res.json({ status: 'ok', data: { token: token } })
}
// 生成token, node的jwt库jsonwebtoken
jsonwebtoken.sign(info, secret, options) // info即payload
// 解析用户数据
jsonwebtoken.verify(token.secret, callback)
// 拦截请求
app.use(function(req, res, next) {
  jsonwebtoken.verify(req.token, ...)}
})
```

## cookie token和session的区别
token的优点：

  无状态，可扩展；支持移动设备；跨程序调用；安全

- 支持移动设备
  当客户端是一个原生平台（iOS, Android，Windows 8等）时，Cookie是不被支持的（你需要通过Cookie容器进行处理），这时采用Token认证机制就会简单得多。
- session存储于服务器，可以理解为一个状态列表，拥有一个唯一识别符号sessionId，通常存放于cookie中。服务器收到cookie后解析出sessionId，再去session列表中查找，才找到对应session。依赖cookie
- cookie类似于一个令牌，装有sessionId，存储在客户端，浏览器通常会自动添加
- token也类似一个令牌，无状态，用户信息都被加密到token中，服务器收到token解密后就可以知道是哪个用户。
- **内存开销。**session每次认证用户发起请求，服务器需要创建一个记录存储登录信息，如果访问服务器的用户增多时，服务器要保存所有人的session，内存开销会变大。通常存放到数据库或Redis中

- **使用灵活，可以选择性认证。**对于session认证，客户端每次发送请求都会发送cookie；token需要开发者手动添加，可以只在需要身份验证的场景下才发送token
- **跨域。**cookie是绑定单域名的，即a域名生成的cookie无法用于b域名，所以sessionId无法作为不同域名的共同认证id；token允许多域名认证，token认证不受跨域限制，可以附加在任何请求上。可以多个域名使用同一token认证体系。
- **在客户端的存储灵活：**在客户端的存储方式不同，session自动存储在cookie，token需要自定义存储的方式。即使token存储在cookie，也可以免疫CSRF，因为cookie中的token并不用于认证？
- **免疫CSRF(跨站请求伪造)。**token认证免疫CSRF(跨站请求伪造)，而session认证则存在遭受CSRF的可能性。

    因为不再依赖于Cookie，所以token不需要考虑对CSRF（跨站请求伪造）的防范?

    token可以抵抗csrf，cookie+session不行

    假如用户正在登陆银行网页，同时登陆了攻击者的网页，并且银行网页未对csrf攻击进行防护。攻击者就可以在网页放一个表单，该表单提交src为http://www.bank.com/api/transfer，body为count=1000&to=Tom。

    倘若是session+cookie，用户打开网页的时候就已经转给Tom 1000元了，因为form 发起的 POST 请求并不受到浏览器同源策略的限制，因此可以任意地使用其他域的 Cookie 向其他域发送 POST 请求，形成 CSRF 攻击。在post请求的瞬间，cookie会被浏览器自动添加到请求头中。

    但token不同，token是开发者为了防范csrf而特别设计的令牌，浏览器不会自动添加到headers里，攻击者也无法访问用户的token，所以提交的表单无法通过服务器过滤，也就无法形成攻击。

    比如token存储cookie的键值叫token_demo，后台验证的Header键值为Authorization，这样伪造的请求到了后台，就取不到token

    即使在客户端使用cookie存储token，cookie也仅仅是存储机制而不是用于认证。不将信息存储在session中，少了对session的操作

- **可扩展性**：在服务端的内存中使用session存储登录信息，伴随来的是可扩展性问题；

   分布式情况下的session和token

   session是有状态的，一般存在服务器内存或硬盘中，当服务器采用分布式或集群时，session就会面临负载均衡问题

   负载均衡多服务器的情况，不好确认当前用户是否登录，因为多服务器不共享session。例如，小F通过机器A登录了系统，那session id会保存在机器A上，假设小F的下一次请求被转发到机器B怎么办？机器B可没有小F的session id。

   如果服务器端是一个集群，为了同步登录态，需要将 SessionId 同步到每一台机器上，无形中增加了服务器端维护成本。

   session sticky，就是让小F的请求一直粘连在机器A上，但是这也不管用，要是机器A挂掉了，还得转到机器B去。就需要做session的复制，把sessionid在多台机器间复制。

   这个问题可以将session存在一个服务器中来解决，如Memcache方式：把sessionid集中存储到一个地方，所有机器都来访问这个地方的数据，这样一来不需要复制了，但是就不能完全达到负载均衡的效果，且增加了单点失败的可能性，负责sessionid的机器崩掉的风险。

   token是无状态的，token字符串就保存了所有用户信息。客户端登录传递信息给服务端，服务端收到用户信息后加密（token）传给客户端，客户端将token存储，客户端每次访问都传递token,服务端解密token就知道用户是谁。通过cpu加解密，服务端就不需要存储session占用存储空间，就很好的解决负载均衡多服务器问题了。NoSession意味着你的程序可以根据需要去增减机器，而不用去担心用户是否登录。

   token能创建与其他程序共享权限的程序，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的API，得出特殊权限的tokens。

   **jwt只是个跨域认证方案**

- XSS（跨站脚本攻击），相对于session认证，token认证更容易遭受XSS

微信公众号平台openID + token认证：

1. 客户端向服务端token接口提交code，请求获取token。此处的code是引导用户进入授权页面后微信服务器附加上去的
2. 服务端通过code向微信公众号平台换取用户的openid。微信授权网页有两种授权scope，只需要openid的话，将scope设为snsapi_base
3. 微信公众平台向服务端返回openid等信息
4. 服务端生成token，将token和用户信息以键值对的形式存储后，服务端返回token给客户端
    服务端获取用户的openid后，在数据库登记用户的信息，并取出用户的id
    **token及用户信息的存储**：服务端以token为key，openid,user id,权限信息等为value，将该键值对存入缓存中，并设置缓存有效时间（过长的有效期存在安全隐患）
    客户端将token附加在header，向业务接口发送请求
    **token认证流程：**业务接口在执行业务逻辑前，凭token验证用户的身份：
      - token的合法性（有记录）
      - token的有效期（没过期）
      - Token对应的用户权限Auth


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

## session
client --> server，建立一个session，发送响应，头部包含set-cookie，里面包含了sessionId
client <-- (set-cookie)-- server

client --cookie--> server，在请求头中加入cookie，server接收请求，分解cookie，验证信息，核对成功后，返回response

用session只需要在client保存一个id，大量数据存在server。session保存了用户的认证信息，登录状态。因为session有状态，一般存在服务器内存中

而token，服务端无状态（server不保存身份认证相关数据）

- token认证灵活，可以选择性认证，只有需要认证时才发送；session每次请求都会发送cookie
- token客户端存储灵活，cookie,localStorage,sessionStorage
- token可跨域，允许多域名认证，可附加在任何请求上；
  cookie绑定单域名，A域名生成的cookie无法用于b域名。sessionId不能作为不同域名的共同认证id
- token免疫CSRF（跨站请求伪造），一般和cookie相关
  不免疫XSS（跨站脚本攻击）

session存于server，可理解为一个状态列表，拥有一个唯一sessionId。通常存于cookie中。server收到cookie后接触sessionId, 再去session列表查找，查找到相应session。依赖于cookie

token，server把用户信息加密（token）传给client，server收到token后解密可知是哪个用户。

## cookie
cookie的工作机制是用户识别和状态管理，为了管理用户状态，web网站会通过浏览器把一些数据临时写入用户计算机，当用户访问该网站时，可通过通信方式取回之前发送的cookie

Cookie，请求首部字段，服务器接收到的当前页面设置的任何cookie
Set-Cookie，响应首部字段，开始状态管理所使用的Cookie信息

当server开始管理client的状态时，会事先告知各种信息：

NAME=VALUE；名称和值
expires=DATE，有效期，没有则是浏览器关闭为止，仅限于维持浏览器回话期间。
path=PATH, server上的文件目录
domain=域名，默认为创建cookie的server的域名
Secure，仅HTTPS通信时才发送cookie
HTTPOnly，加以限制，使cookie不能被JS脚本访问，主要防止XSS 对cookie的窃取


restful API ,rest是无状态的，也就是不用cookie保存session
session表示会话状态，通过sessionId确定client的身份，找回状态
token注重授权，拿到token可享特定的功能权限

一旦cookie从server发送至client，server端就不能显式删除cookie，但可以覆盖已过期的cookie，实现对client cookie的实质性删除操作

Cookie NAME=VALUE
告知server，当client想获取HTTP状态管理支持时，就会在请求中包含从server接收到的cookiehnjnxjjfcdjmm ,./mm,./<,,,,,,,///m.,/?>