# CORS（cross-origin resource sharing）跨域资源共享
[CORS] (https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
## 简单请求
1. 简单请求的条件
- HTTP方法只能是GET，HEAD，POST
- HTTP头只能是Accept/Accept-Language/Content-Language/Content-Type/DPR/Downlink/Save-Data/Viewport-Width/Width
- Content-Type头只能是text/plain,multipart/form-data,application/x-www-form-urlencoded三者之一
- 请求中的任意XMLHttpRequestUpload对象均未注册任何事件监听器
- 请求中没有使用ReadableStream对象

即，简单请求就是普通HTML Form在不依赖脚本的情况下可以发出的请求，比如表单的method如果指定为POST，可以用enctype属性指定用什么方式对表单内容进行编码，合法的值就是前述这三种。

非简单请求，就是HTML Form无法实现的请求，如PUT方法，需要其他的内容编码方式，自定义头之类的。

对于服务器来说，1）许多服务器没有打算给跨域用，当然不给CORS响应头，浏览器也不会使用响应结果，但是请求本身可能已经造成了后果。所以最好是默认禁止跨源请求。
2）要回答某个请求是否接受跨源，可能涉及额外的计算逻辑，这个逻辑可能很简单（如一律放行），也可能比较复杂（如哪个资源哪种操作来自哪个origin)。对浏览器来说，就是某个资源是否允许跨源这么简单。对服务器来说，计算成本却可大可小。所以希望不用每次请求都让服务器计算。

CORS-preflight就是这样一种机制，浏览器先单独请求一次，询问服务器某个资源是否可以跨源，如果不允许就不发实际的请求。先许可再请求等于默认禁止了跨源请求。如果允许的话，浏览器就会记住，然后发实际请求，之后每次就直接请求而不用再询问服务器是否可以跨源。

于是，服务器想支持跨源，就只要针对preflight进行跨源许可计算。本身真正的响应代码则完全不管这个事情。且因为preflight是许可式的，也就是说如果服务器不打算接受跨域，就什么事都不用做。

但是这个机制只能限于非简单请求。在处理简单请求时，如果服务器不打算接受跨源请求，不能依赖preflght机制，因为不通过CORS，普通表单也能发起简单请求，所以默认禁止跨源是做不到的。所以简单请求发prefligt就没意义了，就算发了服务器也省不了后续每次的计算，反而在一开始多了一次preflight。

很多人把简单请求不需要preflight理解为“向下兼容”，理论上浏览器可以区别对待表单请求和非表单请求————对传统的跨源表单提交不发preflight，从而保持兼容，只对非表单跨源请求发preflight

但这样做并没有什么好处，反而把事情搞复杂了。比如本来你可以直接用脚本发跨源普通请求，尽管（在服务器默认没有跨源处理的情况下）你无法得到响应结果，但是你的需求可能只是发送无需返回，比如打个日志。但现在如果服务器不理解 preflight 你就干不了这个事情了。

而且如果真的这样做，服务器就变成了默认允许跨源表单，如果想控制跨源，还是得（跟原本一样）直接在响应处理中执行跨源计算逻辑；另一方面服务器又需要增加对 preflight 请求的响应支持，执行类似的跨源计算逻辑以控制来自非表单的相同跨源请求。服务器通常没有区分表单/非表单差异的需求，这样搞纯粹是折腾服务器端工程师。

所以简单请求不发 preflight 不是因为不能兼容，而是因为兼容的前提下发 preflight 对绝大多数服务器应用来说没有意义，反而把问题搞复杂了。

## 预检请求(preflighted requests，即OPTIONS请求)
1. 非简单请求
- 使用了以下任一方法：PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH
- 人为设置了简单请求外的首部字段
- Content-Type 的值不属于三者之一

【MDN】OPTIONS方法，用于获取目的资源所支持的通信选项。客户端可以对特定的URL使用OPTIONS方法，也可以对整站（通过将URL设置为*）使用该方法。

简单来说，就是可以用options请求去嗅探某个请求在对应的服务器中都支持哪种请求方法。在前端一般不会主动发起这个请求，这是在跨域的情况下，浏览器发起非简单请求时主动发起的。跨域共享标准规范要求，（出于安全原因）对那些可能对服务器数据产生副作用的HTTP请求方法（特别是GET以外的HTTP请求，或搭配某些MIME类型的POST请求），浏览器必须首先使用OPTIONS方法发起一个预检请求，从而获知服务端是否允许跨域该请求，服务器确认允许后，才发起实际的HTTP请求。

2. options关键的请求头字段
request header的关键字段：
- Access-Control-Request-Method，告知服务器，实际请求将使用的方法，如PATCH
- Access-Control-Request-Headers，告知服务器，实际请求将携带的自定义请求首部字段，如X-token

response header的关键字段：
- Access-Control-Allow-Methods，表明服务器允许客户端使用什么方法发起请求
- Access-Control-Allow-Origin，允许跨域请求的域名，如果要允许所有域名则设置为 *
- Access-Control-Allow-Headers，服务器允许的自定义请求首部字段
- Access-Control-Max-Age，指定了预检请求的结果能够被缓存多久

## OPTIONS请求优化
当我们发起跨域请求时，简单请求只会发出一次请求，复杂请求则先发出 options 请求，用于确认目标资源是否支持跨域，然后浏览器会根据服务端响应的 header 自动处理剩余的请求，如果响应支持跨域，则继续发出正常请求，如果不支持，则在控制台显示错误。

所以，我们可以优化 Options 请求，主要有 2 种方法。

1. 转为简单请求，如用 JSONP 做跨域请求
2. 对 options 请求进行缓存，服务器端设置 Access-Control-Max-Age 字段，那么当第一次请求该 URL 时会发出 OPTIONS 请求，浏览器会根据返回的 Access-Control-Max-Age 字段缓存该请求的 OPTIONS 预检请求的响应结果（具体缓存时间还取决于浏览器的支持的默认最大值，取两者最小值，一般为 10 分钟）。在缓存有效期内，该资源的请求（URL 和 header 字段都相同的情况下）不会再触发预检。（chrome 打开控制台可以看到，当服务器响应 Access-Control-Max-Age 时只有第一次请求会有预检，后面不会了。注意要开启缓存，去掉 disable cache 勾选。）