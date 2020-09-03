# 浏览器
结构层——HTML标签对网页内容的语义含义做出了描述，不包括内容如何显示的信息。
表示层——CSS完成，描述页面内容应该如何呈现
行为层——负责内容应该如何响应事件这一问题，Javascript和DOM

10. src和href的区别
凡是替换型元素，都是使用 src 属性来引用文件的，
链接型元素是使用 href 标签的。

- **什么是渐进式渲染 (progressive rendering)？**
渐进式呈现是用于提高网页性能（尤其是提高用户感知的加载速度），以尽快呈现页面的技术。
- 打开谷歌浏览器会有多少进程

常见浏览器内核：chrome,safari——webkit,Firefox——Gecko

浏览器主要组成：
1. 用户界面（地址栏，书签菜单，前进后退按钮
2. 浏览器引擎：用户界面和呈现引擎之间传送指令
3. 呈现引擎：负责显示请求的内容，是html,就负责解析html和css，并将解析的内容显示在屏幕上。
4. 网络：用于网络调用，接口与平台无关，为所有平台提供顶层实现
5. 用户界面后端：用于绘制基本的窗口小部件，如组合框和窗口，其公开了和平台无关的通用接口，在底层使用操作系统的用户界面方法
6. Javascript解释器：解析和执行Javascript代码
7. 数据存储：持久层，浏览器需要在硬盘上保存各种数据

chrome每个标签页都分别对应一个呈现引擎实例，每个标签页都是一个独立的进程

### 请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？

    不同浏览器对Javascript的支持程度不一样，有些脚本不一定能正常工作。

    特性检测：

    检测浏览器对Javascript的支持程度。在使用某个特定的方法或属性之前，使用if语句，先测试它是否存在（浏览器是否支持），确保“古老的”浏览器不会因为我的脚本代码出问题，让脚本有更好的向后兼容性。

    **浏览器嗅探技术（browser sniffing）**

    指通过提取浏览器供应商提供的信息来解决向后兼容问题。可以通过Javascript代码检索关于浏览器的品牌和版本的信息，这些信息可以用来改善Javascript脚本代码的向后兼容性。但这是一种风险非常大的技术：1）浏览器可能会'撒谎'，会把自己报告为另一种浏览器，或者允许用户任意修改这些信息，2）为了适用于多种不同的浏览器，浏览器嗅探脚本会越变越复杂，这是个无穷尽的任务，测试组合（供应商和版本）情况越多，代码越复杂和冗长。3）许多浏览器嗅探脚本在进行这类测试时要求浏览器的版本号必须得到精确的匹配，市场上每当有新版本时，就要修改这些脚本。
## 会话机制session


# HTML

HTML
1.从规范的角度理解 HTML，从分类和语义的角度使用标签；知道哪些 HTML 标签最能代表你正在显示的内容以及相关属性，应该掌握手工知识。
2.常用页面标签的默认样式、自带属性、不同浏览器的差异、处理浏览器兼容问题的方式；标记属性，例如 disabled、async、defer 以及何时使用 data-*；
3.元信息类标签( head、 title、 meta)的使用目的和配置方法；知道如何声明 doctype以及可以使用哪些元标签；
5.可以使用 CanvasAPI、 SVG等绘制高性能的动画
可访问性问题，例如，确保输入复选框具有更大的响应区域（使用标签“for”）。另外还有 role=“button”、role=“presentation”，等等。
说说HTML难点,语义化的体现?

1. html语义化标签的理解; 结构化的理解; 能否写出简洁的html结构; SEO优化
html模板语言

1. **doctype(文档类型) 的作用是什么？**
HTML5标准网页声明，告知浏览器的解析器用什么文档标准来解析文档。不同模式会影响浏览器对于CSS代码甚至Javascript脚本的解析。必须声明在HTML文档的第一行。

DTD(文档类型定义)是一组机器可读的规则，它们定义XML或HTML的特定版本中允许有什么，不允许有什么。在解析网页时，浏览器将用这些规则检查页面的有效性并采取相应的措施。
- Doctype不存在会发生什么
- 使用了 HTML4 Doctype，但 HTML 页面使用了 HTML5 的标签，如 <audio> 或 <video>。它会导致任何错误吗？
- 使用了无效的 Doctype会发生什么

2. **浏览器标准模式 (standards mode) 、几乎标准模式（almost standards mode）和怪异模式 (quirks mode) 之间的区别是什么？**
标准模式，浏览器根据规范(HTML和CSS的定义)呈现页面；
混杂模式，页面以一种比较宽松的向后兼容的方式显示，混杂模式通常模拟老式浏览器的行为以防止老站点无法工作。呈现方面的其他差异比较小，而且是与特定浏览器有关的，包括对于十六进制颜色值不需要#号，使用关键字时将字号增加一级；
几乎标准模式（Mozilla和Safari），除了在处理表格的方式上有细微差异，其他与标准模式相同。
3. **HTML 和 XHTML 有什么区别？**
HTML:html4.0之前先有实现再有标准，导致HTML混乱，松散
XML：主要用于存储数据和结构，可扩展，相比之下，JSON更轻量高效。
XHTML：为了规范HTML，W3C结合XML制定了XHTML 1.0标准，没有增加新的tag，只是按照XML的要求来规范HTML。基于此诞生了HTML5，开头加<! DOCTYPE html>，不加就是兼容混乱的HTML模式，加了就是标准模式。


**如果页面使用 'application/xhtml+xml' 会有什么问题吗？**
使用xhtml,页面结构中必须包含head标签,并且每个标签结构都要关闭,包括空标签。所有标签都要小写。使用了'application/xhtml+xml'之后,部分老浏览器不会支持
5. **meta标签 viewport原理**
meta标签`<meta charset = 'UTF-8>`，用name和content两个属性来定义，描述一个HTML网页文档的属性，如作者，role，网页描述等。常用：
viewpot，控制视口的大小和比例；
http-equiv,相当于http头文件作用，可以设置http缓存过期日期
`http-equiv='expires' content='Wed, 20 Jun... '`
charset,描述HTML文档的编码形式
6. **如果网页内容需要支持多语言，你会怎么做？**
采用统一编码UTF-8方式编码。对提供了多语言版本的网站来说，Unicode字符集是最理想的选择，双字节编码机制的字符集，中英文在Unicode中一律用两个字节表示。
unicode，utf8，gbk编码的了解，乱码的解决
**在设计和开发多语言网站时，有哪些问题你必须要考虑？**
要先把非中文页面的字符集定义为“utf-8”格式。否则可能要重新输入内容。
7. **HTML语义化**
Web语义化：使用恰当语义的html标签，让页面具有良好的结构和含义，如article表示正文内容，p表示段落；（选择何种标签取决于标签本身的语义和文档内容的结构，而不是HTML元素的样式）。

语义化的好处：1. 开发者友好，可读性强，可清晰看出页面结构，维护方便；2. 机器友好，适合搜索引擎的爬虫爬取有效信息。

- 可访问性问题

例如，确保输入复选框具有更大的响应区域（使用标签“for”）。另外还有 role=“button”、role=“presentation”，等等。

8. **HTML5的新特性**
新元素：section,video,nav,aside,header,footer,figure,figcaption,canvas等
input新类型：date,email,url等
新属性：async(用于script)，charset（用于meta)，如自定义属性data, 类名className等, 新增表单元素
新的全域属性：draggable，dropzone，spellcheck，contextmenu，contenteditable

h5中新增的API, 修改的API, 废弃的API 稍作了解 (离线存储, audio, video)

**如果把 HTML5 看作一个开放平台，那它的构建模块有哪些？**
标签及属性，地理位置，canvas画布,video,audio,dragdrop,微数据,应用缓存,Web存储,web workers,
服务器发送事件
9. **使用 data- 属性的好处**
HTML的（自定义）数据属性，在生成DOM结构时将数据储存到标准的HTML元素中作为额外信息，可以通过js（element.dataset）访问他，获取自定义数据，不用ajax去后台取得数据。

前端框架出现后就不流行了。

- **为什么要在图像标记中使用srcset属性？ 解释浏览器在评估此属性的内容时使用的过程。**

26. Canvas和SVG
canvas通过Javascript来绘制2D图形，SVG是一种使用XML描述2D图形的语言

### 如果你参与到一个项目中，发现他们使用 Tab 来缩进代码，但是你喜欢空格，你会怎么做？
- 请谈谈你对网页标准和标准制定机构(standards bodies)重要性的理解。
- 什么是 FOUC (无样式内容闪烁)？你如何来避免 FOUC？
- 请解释什么是 ARIA 和屏幕阅读器 (screenreaders)，以及如何使网站实现无障碍访问 (accessible)。

# 测试相关问题
- 对代码进行测试有什么优缺点？
- 你会用什么工具测试你的代码的功能？
- 单元测试与功能/集成测试的区别是什么？
- 前端怎么做单元测试

1. BOM，DOM，ECMAScript vs Javascript
27. SEO
在了解搜索引擎自然排名机制的基础上，对网站进行内部及外部的调整优化，改进网站在搜索引擎中关键词的自然排名
网站SEO怎么处理
爬虫的实现原理?爬虫引擎是怎样抓取页面的？如何实现一个爬虫,如何解析文件?
如何解决爬虫慢的问题?

navigator对象，location和history
24. History操作

3. 使用单页面应用将文件上传到服务器的方法有哪些？
提示：XMLHttpRequest2（streaming），fetch（non-streaming），File API

现在我们有 HTTP/2 和 ES 模块，它们真的很有用吗？

Web Components，Security，CSS transform，Web Assembly，Service Workers，PWA，CSS 架构等

写过响应式网站吗？ --》 媒体查询和rem控制字体大小

-  跨标签页的通讯方式有哪些
(1) BroadCast Channel
(2) Service Worker
(3) LocalStorage + window.onstorage监听
(4) Shared Worker + 定时器轮询(setInterval)
(5) IndexedDB + 定时器轮询(setInterval)
(6) cookie + 定时器轮询(setInterval)
(7) window.open + window.postMessage
(8) Websocket


浏览器的全局变量有哪些
浏览器同一时间能够从一个域名下载多少资源
按需加载，不同页面的元素判断标准
拆解url的各部分


常见兼容性问题,列举(移动端/PC端)　
了解xpath吗

