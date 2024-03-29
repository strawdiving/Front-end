## 客户端路由

**传统导航**

导航以整个Web页面为单位进行。输入新URL时，页面请求从浏览器发往服务器，服务器响应并返回一个完整的HTML。浏览器收到HTML后，获取该文档引用的其他源文件如CSS和JS文件，引用的其他资源如图片，也在浏览器解析文档的HTML代码及遇到相应标签时得以下载。要显示更新内容，浏览器就执行一次完整的刷新动作。

**SPA导航**

对于SPA，需要将应用的状态反映在URL中，建立状态和URL的某种对应关系，当应用的状态发生改变时，URL也随之改变，反之亦然。

为了让用户掌握其导航位置，SPA通常会在设计中融入路由选择（Routing）的设计思路：借助MV*框架或第三方库的代码实现，将URL风格的路径与功能关联起来。

路径通常看起来像相对URL，其充当用户导航时到达特定视图的触发因素。路由器可以动态更新浏览器URL，并允许用户使用前进和后退按钮。

客户端路由（简称路由器）进行单页面环境中的导航。

导航，在用户导航时管理SPA视图、数据及业务事务的状态。路由器承担浏览器导航控制的职责，并依此管理应用程序状态。其允许开发者直接将URL的改变映射到客户端功能上。

通过这种方式，与服务器端的往返已不再是必需的。路由器借助几种侦测浏览器位置发生改变的方法，来决定何时需要变化状态。比如监听特定事件。**只要URL发生改变，路由器就会试着使用其配置里的某个配置项来匹配新URL的某部分。**

### 路由及其配置

通过路由器配置项，来制定路由器在用户导航时如何响应的策略。

每一个路由器配置项被称为一个**路由** ，于开发阶段就在路由器配置项中设置好路由，通过一个个路由，来表示SPA应用中的各个逻辑流程。

一些典型的配置术语：

- 名称（name）——有些路由会被分配名称，有些则将路径作为路由标识
- 动词（verb）——路由有时候定义为匹配HTTP动词的功能名称，如get()或put()；有些路由器使用更加通用的名称，如on()，when()或route()
- 路径（path）——路径是URL的一部分，路径用于配置路由器，以在URL与路由/路由处理程序之间建立链接。只要浏览器的URL发生改变，路由器就会用配置文件中路径列表的所有路由路径跟新URL进行比较，以找出匹配项。如果找到，就执行该路由（**路由器配置项充当下一步动作的指令** ）。路由路径必须是URL的合法部分。通常情况下，路径是简单的文本串，但有些路由器也允许使用正则表达式
- 功能（functionality）——可能执行的相关代码，如控制器或回调函数

**路由事关应用状态的改变，而非产生视图更新。** 有些路由器能够通过配置来定义视图。

- 视图——大多数情况下，如果路由器允许视图作为路由配置的一部分，则该配置项八成是到HTML某部分的路径。当视图配置为路由的一部分时，路由器通常会处理它的显示，并给出访问该视图（或视图的某个代理对象，如视图模型）的功能

Backbone.js的路由器语法（2个步骤）：

1. routes: {"routes/faculty" : "facultyRoute"}
2. on("route : facultyRoute", function() {...})

#### 路由配置项

``` 
// 1. 带有视图功能的路由器
ON MATCH OF "/routes/faculty": // 路径
   FUNCTION NAME: "getListOfFaculty", //待执行功能
   VIEW TO DISPLAY: "App/partials/faclist.html" //要显示的视图

// 2. 路由器只提供匹配路由和某个控制器/回调函数的设置
ON MATCH OF "/routes/faculty": // 路径
   function() { //执行该函数
       //获取教员名单，之后调用MV*代码来渲染并显示视图
   }   
```

路由配置项几乎就是一句话，告知我们，当路由器找到匹配路径的URL时，该如何动作。即，**匹配模式、运行代码，并展示结果**

#### 路由参数

路由参数是指在路由路径中定义的变量。此特性允许我们为URL添加变量，在后续路由执行时会计算变量。

路由参数主要用于：想使用同一功能和同一视图，但根据不同情况又需要不同结果。

要让路由参数正常工作，需要：**1）相对URL中包含需要传递的文本内容，2）接收端有带参数的路由路径**

1. **配置带参数的路由路径**

eg. `/routes/officehrs/{facultyNameParam}或/routes/officehrs/：facultyNameParam`

大多数框架（包括Backbone.js）使用冒号“：”来表示一个路由参数，有的路由器还可能提供更高级的参数选项，如正则表达式

1. **带有传入文本信息的相对URL**——如果使用了路由参数，路由器可以通过路径识别URL哪部分是参数，哪部分必须逐字匹配
2. **多个参数**——大多数路由器允许同时使用多个参数

#### 缺省路由

这种类型的路由适用于路由未指定或路由非法等情况。当用户输入的URL在路由配置中未找到匹配项时，如果存在一条缺省路由，就能立即重定向到该特定路由。

### 客户端路由器的工作机制

绝大多数路由器都至少提供了以下特性（提供最低限度SPA导航功能所必需的）：

- 通过路由定义的路径来匹配URL模式
- 当匹配成功时允许应用程序执行代码
- 当路由触发时允许指定需显示的具体视图
- 允许通过路由路径传入参数
- 允许用户使用标准的浏览器导航方法来进行SPA应用导航

定位本页面所用的URL(base URL)是不能更改的，改变的话会引起页面的刷新，这是我们要避免发生的。

路由器通过两种方式之一来进行导航：

#### 片段标识符方式——不为老式浏览器支持，大多数路由器会自动使用它作为回退方案

```http
http://www.somwsite.com/categ/#hashinfo
```

片段标识符是任意的文本字符串并以#号为前缀，这个URL的可选部分引用当前文档的某部分，并非对新文档的引用。当新的片段标识符添加到URL中时，更改hash，浏览器不会尝试连接服务器端，也不会造成页面的刷新，但是添加的结果会在浏览器历史中新增一个条目。添加完条目后，用户就可以在无须触发页面刷新的情况下载hash间来回导航。

**利用浏览器的location对象**

location对象包含了一个API，允许我们访问浏览器的URL信息，读取或修改页面hash。SPA中，路由器利用location对象以编程方式来访问当前URL，包括片段标识符。

当改变发生时，将用新的hash串来跟路由器配置中各路由的路径进行比较。

```html
<a href="#routes/contact">Contact Us</a>
```

当点击该连接时，浏览器的片段标识符将由初始值变为#routes/contact。

```javascript
window.location.hash = "foo"; //设置hash
```

太过频繁地设置hash会影响性能，尤其是在移动端的浏览器中，可能会造成页面的频繁滚动。

**检测hash的变化**

通过**window的onhashchange事件**来监听URL片段标识符部分的改变。

```javascript
window.addEventListener("haschange"),function(event) {
    // hash发生改变，更改状态
});
```

**抓取Ajax（SEO）**

由于很多搜索引擎爬虫程序无法运行Javascript，因此也无法得到动态创建的内容，页面的hash路由也不会起作用。在爬虫程序眼中，它们看上去都是相同的URL，因为hash字段从来不会发送给服务器。

如果我们想让纯粹的Javascript应用程序在搜序引擎中也能运行的话，需要创建内容的镜像。开发人员会实现一个静态页面版本，将这个特殊的静态HTML内容的快照发送给爬虫程序，而正常的浏览器则继续使用动态生成的内容来展现应用。

Google对引擎做了改进，提出了“Ajax抓取规则”。

```http
http://twitter.com/#!/maccman
```

#后面加了“！”，对Google的爬虫来说，看到感叹号就知道当前页面是遵从“Ajax抓取规则”的，这时爬虫程序会将这个URL转换成

```http
http://twitter.com/?_escaped_fragment_=/maccman
```

这里的hash替换成了URL中的_escaped_fragment _参数，在“规则”中称为“丑陋的URL”，用户接触不到这个地址，爬虫程序会从这个“丑陋的URL”抓取内容。hash片段就可以转换为URL参数，服务器就可以精确地定位到要抓取的资源位置，实现资源的索引。

因为实现了静态页面的版本，因此只需将爬虫抓取的URL重定向到对应的静态页面地址即可。

``` c
curl -v http://twitter.com/?_escaped_fragment_=/maccman
  302 redirected to http://twitter.com/maccman
```

如果你的站点没有实现静态内容的版本，则在URL中带有请求参数_escaped_fragment _时输出静态的HTML或文本片段即可。

如果你的站点不支持“Ajax抓取规则”，虽然通过浏览器访问站点可用，但可能无法在搜索引擎中正确展示你的站点带索引的页面的内容。

#### HTML5 History API方式

路由器可以使用历史对象API中的两个方法——**pushState()和replaceState()**直接访问浏览器历史，修改浏览器历史记录栈，而不需要依赖片段标识符：

pushState()——允许添加新的历史条目

replaceState()——允许用新条目替代已有历史条目

它们都具有三个参数：

1. 状态对象（State Object）——可选的与历史条目相关的Javascript对象
2. 标题（Title）——表示历史记录中的新页面标题
3. URL——将在浏览器地址栏显示的URL，即用来替换当前浏览器地址的URL

```javascript
history.pushState({myObject:"hi"},"A Title","newURL.html");
```

该命令导致URL变成了`http://www.manning.com/newURL.html`，同时在浏览器历史中添加了一个新条目。新添加的URL并未触发浏览器刷新，也未包含#号。

可以通过history.state来观察状态对象是否添加。

##### popstate事件

**window.popstate事件可以监听历史栈的变化** 。只要用户在历史条目间导航，浏览器就会触发该事件。

```javascript
window.addEventListener("popstate",dunction(event) {
    if(event.state) {
    //调用了history.pushstate()
    }
});
```

event对象包含了state属性，这个属性就是pushState的状态对象。

##### 使用HTML5历史API方式

1. 调整路由器设置中的相应配置项，如Backbone.js中：`Backbone.history.start({pushState:true});`

2. 在index页< head >头部设置基准链接（base href）：`<head><base href="/SPA/"></head>`，基准链接必须与部署应用base URL的根路径一致，否则会报404
3. 对服务器端进行调整，以便其总能为根路径返回内容
4. 移除hash，从视图中的链接里移除hash（#）符号

## SPA的布局设计与视图合成

用视图取代页面来设计布局，并设计路由以串起这些布局。

### Region

Region是指屏幕上设计为包含一个或多个视图的某个区域（容器）。如果使用了HTML5，Region可以定义成使用语义元素，如nav，section；如果未使用HTML5，则可以使用诸如div这样的元素。Region提供了UI中的实际空间来显示视图，在一个Region中，视图可以修改及动态切换。

敲定Region的大小和形状，以及在这些Region中布置视图以实现具体布局的功能——称为**视图合成（view composition）**。

Region的使用不局限于SPA应用的Shell，也可以用于视图以嵌套其他视图。

### 路由

路由配置方式影响应用状态，包括UI状态，因此，路由配置也是布局设计的重要考量点。

当设计的路由会导致复杂的Region配置或视图配置时，要使用一个内置了稳健的路由及视图管理方案的一站式框架，来进行状态管理。

## 模块间交互

有两种方式：

- 直接通过模块API——创建了一个直接依赖
- 通过事件方式

### 通过依赖进行模块间交互

模块是一个函数，可以将另一个模块作为参数传入，添加为依赖，这种交互是直接方式，因为一个模块访问了另一个模块的API，通过依赖模块的API来与其交互。

当第一个模块通过直接调用第二个模块的API来与其（第二个模块）交互时，第二个模块称为第一个模块的**依赖** 。

对于传统模块模式，在模块尾部括号内声明依赖，并通过参数（依赖）列表来访问这些依赖。模块声明为另一个模块的依赖后，就可以访问依赖模块的API了。

```javascript
var productMod = (function(prodeuctData,pricingSvc) { // 通过参数列表访问
    ...
    pricingSvc.applyDiscount();
    ...
})(productDataMod,pricingSvcMod); //在尾部括号中声明依赖
```

| 优点                                                         | 缺点                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 不调用中间对象，一个模块直接调用另一个模块的API              | 依赖的引入，也引入了一定程度的耦合，降低了代码修改的灵活度   |
| 直接交互易于调试                                             | 依赖列表可能很长，难于跟踪                                   |
| 通过模块的依赖列表，容易查看源代码，以及该将哪些模块组合在一起 | 模块与其依赖交互时，是一对一关系，此类型的交互涉及面较狭窄，只有一个接收对象 |

### 通过发布/订阅模式进行模块间交互

通过事件交互。事件聚合模式——发布/订阅模式。

发布/订阅模式基于经典的观察者模式，某个对象被直接观察（Observable，可观察对象），其他多个对象（Observer，观察者）可以选择观察它。只要Observable状态发生了改变，其就发送一个通知（通常通过事件），以便Observer能够做出相应的响应。

发布/订阅模式与观察者模式的区别在于：发布/订阅模式由一个中间服务代表另一个对象发布（发送或广播）通知，其他对象可以决定监听与否。

发布/订阅模式是一种消息模式，有两个参与者：发布者与订阅者。发布者向某个信道（channel）发布一条消息，订阅者绑定这个信道，当有消息发布至信道时就会接收到一个通知。发布者和订阅者是完全解耦的，彼此不知晓对方的存在，仅仅共享一个信道名称。

当两个没有联系的模块需要交互，或者某个应用范围的消息需要广播出去而发布者又不关心接收者收到消息后的行为时，这种类型的中介代理是间接实现模块间交互的理想方式。

#### 主题（Topic）

绝大多数发布/订阅模式实现的通知都是基于主题的。主题是一个简单的名称，其用于表示一个特定通知。如果另一个对象想要监听它，这个对象就订阅主题。当一条主题消息发布了，该消息的中介代理就分发通知给所有的主题订阅者。

#### 基本通知类型

```javascript
pSub.publish("hello_world_topic"); //在模块A中发布一条消息
pSub.subscribe("hello_world_topic",functionToCallWhenHeard); // 模块B中订阅该主题，包含要监听的消息的主题名称，以及监听到消息时需产生的动作
```

通常使用基本通知类型来通知所有订阅者发生了某事，之后，每个订阅者根据监听到的消息，以完全不同的方式做出反应。

#### 带数据的通知类型

```javascript
//pSub为消息代理
pSub.publish("hello_world_topic",dataObjectToSend); //模块A中，发布消息时带上数据
pSub.subscribe("hello_world_topic",functionToCallWhenHeard); // 模块B中，接收数据时的唯一不同在于回调函数本身

function functionToCallWhenHeard(paramFromDataPassed) {...} //需要函数签名带有一个参数，用来表示通过订阅传入的数据
```

#### 退订

```javascript
pSub.unsubscribe("hello_world_topic"); //订阅者调用消息代理的退订函数
```

| 优点                                                         | 缺点                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 不直接管理依赖，通过将通知发给消息代理，提升了模块的松耦合程度 | 如果未内建到MV*框架，则消息代理实现库本身就是一个额外的依赖，其必须单独管理 |
| 与使用API一样，容易实现                                      | 通知流只有一个方向，没有反馈                                 |
| 交互涉及面广，通知可以立即广播给多个订阅者                   | 主题是简单的文本串，必须依赖命名约定来保证主题传递到正确的接收者 |
| 应用不同部分可以选择是否观察所发布的消息                     | 调试时很难跟踪贯穿系统的消息流                               |
| 最适合用于功能不相关模块以及应用级通知                       | 通知发布之前，或尚未对主题监听时，代码必须确保订阅者的有效性，而且它要能够监听发布者 |

## 与服务器端通信

单页应用Web服务器最常见的职责是 **认证与授权、数据验证和数据的存储与同步** 。

### 认证和授权

认证（authentication）是确定某人是他所说的身份的过程。应用第三方认证服务时，当和第三方进行认证时，需要用户提供认证信息（通常是用户名和密码）给第三方服务，然后第三方服务器会和我们的服务器进行通信，以此来认证用户。

授权（authorization）是确保只有能访问数据的人和系统才能接收数据。可以给用户绑定权限来完成该功能，这样当用户登入时，就会有一份什饿时他们允许看到的记录。

### 验证

验证是质量控制过程，确保只有正确和合理的数据才能被保存。有助于防止保存错误数据，防止错误数据传播给其他用户或系统。

客户端和服务器端都进行验证很重要：客户端验证是为了快速响应，服务端验证是因为永远不能相信来自客户端的代码是有效的。

### 数据的保存和同步

客户端只用于临时存储，服务器负责持久存储。数据也需要在多个客户端之间进行同步，由服务器把状态广播给所有已认证的客户端。

**互联网媒体类型（Internet Media Type, MIME）** 

互联网媒体类型时一种标准方式，用来识别在两个系统间进行交互的数据。其被很多互联网协议所使用，包括HTTP。互联网媒体类型格式为：类型/子类型，例如，我们使用**application/json**互联网媒体类型，其类型为application，子类型为json。

如果有需要，还可以通过分号添加可选参数。例如，为了指定text媒体类型，其子类型为html，字符编码为UTF-8，可以这么表述：**text/html; charset=UTF-8**。

使用HTTP头信息（HTTP Header）指定互联网媒体类型。

异步获取数据及重绘屏幕各部分区域的能力，是SPA应用架构的主要构成。

使用JSON格式文本作为通用数据交换格式，但它只不过是系统原生对象的表述形式，要让文本为我所用，两端都要对其进行转换。为确保原生对象的正常转换，两端还必须确保在调用中使用约定的JSON格式。可以为数据交换显式声明一种application/json的互联网媒体类型。

Javascript对象转换成JSON文本：`JSON.stringfy(JsObject)`，反之`JSON.parse(JSONText)`。

### 请求生成

- 通过数据模型生成请求——Backbone.js通过扩展框架内建模型对象来显式定义数据模型，并继承了大量功能，包括在远程资源上执行完整的CRUD操作

- 通过数据源对象生成请求——框架提供一种数据源对象，可以把我们的模型传递给它，以生成请求调用。

### 服务器端调用结果的处理

#### 通过回调函数处理

处理异步任务时，在等待服务器端响应时，需要继续处理其他任务，而等待响应放在后台执行。

通过把回调函数传入修改函数来处理修改任务执行完的结果，而非等待修改函数执行完毕后返回值。当回调函数作为参数传进另一个函数时，回调函数就像该函数的延展，能够获取控制并在控制获取点继续执行。——后续传递风格（Continuation-Passing Style, CPS）。

```javascript
// Backbone.js
var cartInstance = new Cart(cartObj);
cartInstance.save(null,{ //调用save（）函数以发起请求
    success: function(updateCart,response) {console.log(updateCart.id);}, //回调函数
    error: function(cartUnchanged,response) {console.log(response.statusText);} //回调函数
});
```

如果调用成功，save()函数就通过XHR对象调用success()函数，并把返回的数据传递给success()函数。如果服务器端调用失败，save()函数就会调用error()，传递失败的具体信息给error()函数。无论哪种情况，处理都会从模型的save()函数继续传递到其中某个回调函数。

但使用回调函数方式，在调用完成后要执行多任务的情况下，后续传递风格有时会显得笨拙。

#### 通过Promise处理

Promise是ECMAScript6实现的一部分，正快速成为大量现代MV*框架处理XHR结果的首选方式。

Peomise是一个对象，代表仍未结束的过程的结果。如果MV*框架支持Promise特性，则MV *框架执行异步服务器调用的函数将返回一个Promise，该Promise作为最终调用结果的代理。

##### Promise状态

其只存在于以下三种状态中的一种：

- **成功** （Fulfilled）——过程处理成功的Promise状态，Promise中**包含的值信息为运行处理结果**（调用结果） 。对上例，则是服务器端返回的修改之后的购物车内容。
- **失败** （Rejected）——过程处理失败的Promise状态。Promise中**包含了失败原因** ，通常是一个Error对象。
- **待决** （Pending）——过程处理完成之前的Promise初始状态。既不是成功，也不是失败状态

三种状态是互斥的。在成功或失败状态之后，则认为过程处理完毕且不能转换成其他状态。

分配给Promise的变量在等待函数返回时不会保持空引用。Promise在待决状态中会立即返回一个完整对象，其带有一个未决的值信息。处理完成时，Promise状态要么变成成功，要么转变为失败状态。

##### 访问处理结果

使用最多的是**then()** 方法。then()方法注册回调函数让Promise返回处理结果。在这里定义的函数称作**Reaction** ，第一个Reaction函数代表Promise成功的情况，第二个可选，代表Promise失败的情况。

```javascript
Promise.then(
    function(value) {
        //处理成功值信息的Reaction
    },
    function(reason) {
        //可选，处理失败原因的Reaction
    });
```

对于Reaction函数，需要记住：不管用哪种代码格式，这**两个函数只有一个会执行** ，Reaction函数的参数是Promise返回结果（要么是成功后的值信息，要么是失败原因）。

##### Promise链

Promise可以链式集中调用多个then()方法（如果服务器端调用之后需要执行多个任务的话）。

通常过程运行之后还希望做一些处理，我们需要这些处理能按序发生，以确保某个事件成功以后才发生下一个事件。

```javascript
promise.then(function(updateCart) { 
    return shoppingCartSvc.calculateCartCosts(updateCart); //返回重新计算后的购物车给接下来的then()使用
})
    .then(function(recalculatedCart) {
    //显示重新计算后的购物车
})
.then(function() {
 // 显示一条用户信息   
})
["catch"](function(errorResult) {
    console.log(errorResult);
})
```

每个then()函数都返回一个Promise。如果前面的then()的Reaction返回一个Promise，则该Promise的值在随后的Promise中使用，会传递给接下来的then()。如果Reaction返回简单值，这个值就成为随后Promise中的值。

**在链上能够有多个异步过程**。

##### 依序链接多个异步过程

有时需要依序运行多个任务时，其中可能有不止一个异步任务。由于不知道异步过程何时会结束，因此视图将其与其他任务一起放入序列中是个挑战。

Promise的每个then()在下一个then()执行之前已得以执行，整个链是顺序执行的。即使多个异步过程存在于链中也一样。

##### Promise错误处理

第一种方式如上所述，第二种方式是在Promise链的最后添加名为 **catch()** 的错误处理方法。

```javascript
.catch(function(errorResult) {
    //失败处理逻辑
});
```

一些浏览器存在catch()方法名冲突，作为替代，可以使用如下语法

```javascript
["catch"](function(errorResult) {
    //失败处理逻辑
});
```

对于任何一种错误处理方式，失败状态都会依链传递下去，直到第一个可用的错误处理程序。如果失败在链上某处发生，并且在链上遇到任何一种错误处理方法（即使在数个then()之后），则错误处理程序将触发，同时抛出的错误会传给它。

### RESTful Web服务调用

#### REST（表述性状态转移 Representational State Transfer）

REST是针对Web站点和Web服务的一种 **架构风格** ，不是协议，也不是规范。

在RESTful服务中，

- API定义了用于表述资源，及驾驭应用状态的媒体类型

- API中的URL和HTTP方法为给出的媒体类型定义处理规则。HTTP方法描述做了什么，URL唯一标识动作影响的资源。

#### REST原则

- 一切皆是资源

资源用类别表示，且从概念上映射到一个实体或实体集。资源可以是文档、图像或代表诸如一个人的对象，也可以是服务，如购物车。

- 每个资源都需要有一个唯一标识

RESTful服务中的每个资源都应该用一个唯一URL来标识它。这通常需要创建并分配一个唯一ID给资源。

得确保URL中使用的任何ID不会危及应用程序的安全性或完整性，常见的安全方式是分配随机生成的ID给所有私人的或保密的资源。为了确保只有预期用户使用这些ID， **服务器端代码需确保请求者是该资源的认证用户，且具备在该资源上执行动作的相应权限** 。

- REST强调组件间接口的一致性

资源标识符及HTTP方法用于提供资源访问的统一方式。

```html
// REST
URL: /shopping/carts/CART_ID_452 //URL唯一标识一个资源
方法：GET                         //HTTP方法描述了在资源上执行的动作
目的：获取购物车

URL: /shopping/carts/CART_ID_452/products/cod_adv_war
方法：POST                        
目的：添加条目到购物车
```

很重要的一点是，所采用的URL风格并不是REST的一部分。

- 交互是无状态的

请求间的应用程序会话状态应在SPA客户端保持，服务器端不该保存客户端上下文。SPA发出给服务器端的每次请求应该传送所有需要的信息，以完成本次请求及允许SPA应用过渡到新状态。

## 客户端任务自动化（Task Runner）

Task Runner可以用来自动化构建过程。使用Task Runner时，要创建一套明确可重复的指令（或任务），用于描述有待自动化的的动作的类型。

 基于Javascript的Task Runner的常见任务： 

| 开发阶段                       |                       构建阶段 |
| :----------------------------- | -----------------------------: |
| 即时刷新Javascript和CSS代码    | 运行Javascript和/或CSS预处理器 |
| 运行Javascript和/或CSS预处理器 |                       文件串接 |
| 代码分析                       |                       代码压缩 |
| 持续单元测试                   |                       持续集成 |

### 常见用途

#### 即时刷新浏览器

靠浏览器自身无法获悉CSS或Javascript文件何时会发生改变。每次修改了文件，浏览器的显示都无法做到同步，为了让更改生效，就不得不重新加载页面。
为自动化这个过程，如LiveReload和Browsersync等工具可以用于在文件改变时自动更新浏览器，而不用停下手头工作去手动加载浏览器。这些工具可以独立使用，但从Task Runner中调用它们使得我们能够在触发浏览器重新加载之前运行任意数量的任务。

#### 自动化Javascript和CSS的预处理过程

**预处理器（Preprocessor）** 是用来创建已有语言新版本或定制版本的程序，其通过扩展或改变原始语法以包含新特性。通俗来说，就是从一种语言编译为另一种语言。

Sass和Less.js是CSS流行预处理器的代表，它们能够让我们通过诸如变量、mix-in以及内嵌规则等特性扩展CSS。CoffeeScript和LiveScript则是独立编程语言，通过预处理过程编译成Javascript代码。

如果我们使用的语言需要一个预处理器，可以通过Task Runner来自动化预处理过程。

#### 自动化Linter代码分析

Javascript和CSS的代码分析工具（或Linter）可以检查代码错误及其他问题。这类工具也可以用于确保代码遵循一套标准的编码实践。对于Javascript，JSHint和Javascript Lint是常见的选择，CSS Lint是CSS领域流行的工具。

在开发过程中使用工具进行代码分析的手工过程，也可以通过Task Runner来实现自动化。

#### 持续单元测试

对某些开发风格，如TDD，需要对代码进行持续单元测试。单元测试的麻烦是，不管何时想要运行单元测试，就不得不停下手头的工作。

Test Runner可以配置成观察文件改变自动触发单元测试，此外，在任务中使用Headless Test Runner还能让我们无须来回切换浏览器就可以看到测试结果。
*Headless指的是无须借助图形化用户界面（如通过命令行方式）就能够访问程序输出内容。*

#### 文件串接（Concatenate）

把众多文件联合进尽可能少的文件中，就节省带宽，减少了网络流量。当创建SPA构建过程时，一个常见的Task Runner执行指导步骤，就是串接Javascript和CSS文件到有意义的更少量文件中去。

#### 代码压缩（Minification）

压缩应用程序源代码。从源代码中移除应用程序运行时不需要的所有字符的过程中被称为 **代码压缩** ，这些字符包括空格、换行符以及注释。

通过改变源代码来减少变量即函数名称的长度（有时候减少到一个字母），压缩工具也可以用于生成紧凑版本的代码。

#### 持续集成（Continuous integration, CI）

持续集成是一种软件开发实践，依托项目组成员全天频繁检入代码。CI同时使用自动化构建过程至少每天一次为应用程序执行代码构建。

大量开发团队使用集中式代码仓库及集中式的CI服务器，如Jenkins，来建立持续构建过程。使用如Jenkins这样的产品，构建及相关测试可以在预定时间间隔上运行，或者只要有新代码检入即执行。

### Task Runner选择

- 任务创建——通过配置，还是编程方式通过函数调用来描述任务
- 处理过程——处理数据的方式，是创建临时文件用于中间处理过程，还是使用I/O流，这些流可以管道化在一起以编排任务流
- 插件数量——大部分Task Runner允许通过插件方式扩展其基本功能。插件是附加模块，用来扩展Task Runner的内建功能

| Task Runner | 任务创建     | 处理数据的方式               | 插件数量 |
| ----------- | ------------ | ---------------------------- | -------- |
| Gulp.js     | 通过代码     | 使用I/O流，管道              |          |
| Grunt.js    | 重度依赖配置 | 创建临时文件用于中间处理过程 | 多       |
| Webpack     | 配置         |                              |          |

如Gulp.js，将多个文件，如Javascript或CSS，可以指定为任务源，多个任务（JSHint，合并，混淆）可以通过流方式管道化在一起并应用到每个任务源，最后输出。

### 基本流程
1. 创建任务，指定任务依赖
2. 创建代码分析任务
3. 创建浏览器刷新任务
4. 自动化单元测试
5. 创建构建过程
    5.1 优化Javascript文件（串接，压缩代码文件）
    5.2 优化CSS
    5.3 优化图像
    5.4 迁移其他的文件
    5.5 动态修改（Javascript和CSS）文件引用