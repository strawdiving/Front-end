## Node.js REPL交互解释器（Node.js自带）
表示一个电脑的环境，类似 Window 系统的终端或 Unix/Linux shell，我们可以在终端中输入命令，并接收系统的响应。可以很好的调试 Javascript 代码。
- 读取 - 读取用户输入，解析输入的Javascript 数据结构并存储在内存中。
- 执行 - 执行输入的数据结构
- 打印 - 输出结果
- 循环 - 循环操作以上步骤直到用户两次按下 ctrl-c 按钮退出。

## Node.js应用
Node.js 应用是由几部分组成的：
1. 引入 required 模块：使用 require 指令来载入Node.js 自带的模块（npm install安装模块，安装到node_modules文件夹中）。
2. 创建服务器：服务器可以监听客户端的请求，类似于 Apache 、Nginx 等 HTTP 服务器。
3. 接收请求与响应请求：客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。

在项目的根目录下创建一个app.js文件，
```javascript
var http = require("http");//使用require指令来载入http模块,并将实例化的HTTP赋值给变量
// 2创建服务器
var server = http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});// 发送 HTTP 头部 ,HTTP 状态值: 200 : OK,内容类型: text/plain
        response.end('Hello World\n');  // 发送响应数据
});

server.listen(8888,function(){ //服务器监听端口
     console.log('Server running at http://127.0.0.1:8888/';); // 终端打印如下信息
});
```
### NPM
随同NodeJS一起安装的包管理工具。

允许用户从NPM服务器下载别人编写的第三方包、下载并安装别人编写的命令行程序到本地使用；允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

## 模块系统
提供了一个简单的文件系统，让Node.js的文件可以相互调用。模块是Node.js应用程序的基本组成部分，文件和模块是一一对应的，一个 Node.js 文件就是一个模块，这个文件可能是JavaScript 代码、JSON 或者编译过的C/C++扩展。

### 创建模块
```javascript
// main.js文件
var hello = require('./hello');// 引入当前目录下的hello.js文件
hello.world();

// hello.js文件
exports.world = function() { //通过exports对象把world作为模块的访问接口，在main.js中通过require加载这个模块后，就可以直接访问这里的exports对象的 成员函数了
	console.log(“hello world!”);
}
```

提供了两个对象：
1. exports：是模块公开的接口
2. require：从外部获取一个模块的接口（即所获取模块的exports对象）

#### 把一个对象封装到模块中
`module.exports = function() { ...	}`

例：
```javascript
//hello.js
function Hello() {
  var name;
  this.setName = function(thyName) {
    name = thyName;
  };
  this.sayHello = function() {
    console.log('Hello ' + name);
  };
};

module.exports = Hello;
```
调用：
```javascript
//main.js
var Hello = require('./hello');
hello = new Hello();
hello.setName('BYVoid');
hello.sayHello();
```
模块接口的唯一变化是使用**module.exports = Hello**代替了**exports.world = function(){}**。 在外部引用该模块时，其接口对象就是要输出的Hello对象本身，而不是原先的exports。

### require方法中的文件查找
![require方法中的文件查找]()

存在4类模块：原生模块和3种文件模块，加载优先级不同。

从高到低：
- 优先从文件模块的缓存中加载已经存在的模块
- 解析文件名后，优先检查模块是否在原生模块列表中
- 优先从原生模块缓存区中加载
- 原生模块缓存区中没有被加载过，则调用原生模块的加载方式进行加载和执行
- 解析require方法传入的参数，并从文件系统中加载实际的文件

require方法接受参数：
- http、fs、path等原生模块——返回内置模块，停止执行
- ./mod或../mod，相对路径的文件模块
- /path/to/module/mod，绝对路径的文件模块
- mod，非原生模块的文件模块

## Node.js路由
我们要为路由提供一一请求的URL和其他需要的GET及POST参数，随后路由需要根据这些数据来执行相应的代码。因此，我们需要查看HTTP请求，从中提取出请求的URL及GET/POST参数。

可以通过请求的 URL 路径来区别不同请求，使用路由来将请求以 URL 路径为基准映射到处理程序上。

我们需要的所有数据都会包含在 **request** 对象中，要解析这些数据，要额外的**url**和**querystring**模块。URL用 .parse方法来将一个URL字符串转换为URL对象，QueryString模块用于实现URL参数字符串与参数对象的互相转换。
```javascript
//查询字符串中的参数部分（问号后面部分字符串），或者使用 querystring.parse() 解析后返回的对象
url.parse(string).query
//URL的路径部分，位于主机名之后请求查询之前
url.parse(string).pathname

http:/ /localhost:8888/start?foo=bar&hello=world” //url.parse(string).pathname为start
querystring.parse(queryString)["foo"]// bar
querystring.parse(queryString)["hello"]// world
```

// server.js
```javascript
var http = require("http");
var url = require("url");

function start(route) {  //将路由函数作为参数传递
http. createServer (function(request, response) {
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname + " received.");

      route(pathname);

      response.writeHead(200, {"Content-Type": "text/plain"});
      response.write("Hello World");
      response.end();
}.listen(8888);
console.log("Server has started.");
}
exports.start = start;
```

现在可以通过请求的 URL 路径来区别不同请求了，在我们所要构建的应用中，这意味着来自 /start 和 /upload 的请求可以使用不同的代码来处理。
我们的服务器应当知道路由的存在并加以有效利用。下面编写路由：

// router.js
```javascript
function route(pathname)
 { console.log("About to route a request for " + pathname); }
exports.route = route;
```
扩展index.js文件代码，使路由函数可以被注入到服务器中
```javascript
var server = require("./server");
var router = require("./router");

server.start(router.route);
```

## Node.js回调函数
Node.js异步编程依托于回调来实现。回调函数在完成任务后就会被调用，Node 所有 API 都支持回调函数。大大提高了Node.js的性能，可以大量处理并发任务。
- 阻塞代码（未带回调函数）: 在文件读取完后才执行完程序，按顺序执行
```javascript
var fs = require("fs");
var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("程序执行结束!");

// 输出结果： 先输出input.txt中的内容，再输出“程序执行结束！”

```
- 非阻塞代码（带回调函数）
在读取文件时同时执行接下来的代码，不需要按顺序，如果需要处理回调函数的参数，就需要写在回调函数内。
```javascript
var fs = require("fs");
fs.readFile('input.txt', function (err, data) {
  if (err) return console.error(err);
  console.log(data.toString());
});
console.log("程序执行结束!");

// 输出结果： 先输出“程序执行结束！”，再输出input.txt中的内容
```
Node.js中，执行异步操作的函数将回调函数作为最后一个参数，回调函数接收错误对象作为第一个参数。

fs.readFile()是异步函数，用于读取文件。如果在读取文件过程中发生错误，错误 err 对象就会输出错误信息；如果没发生错误，readFile 跳过 err 对象的输出，文件内容就通过回调函数输出。

- __dirname
当前模块的文件夹名称。等同于__filename的path. dirname ( )的值。
- __filename
当前模块的文件名称——解析后的绝对路径
例如：运行位于/Users/mjr目录下的example.js文件，其__dirname为/Users/mjr，__filename为/Users/mjr/example.js
- path.resolve([...paths])
把一个路径或路径片段的序列解析为一个绝对路径。

给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。

如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上。

生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。

长度为零的 path 片段会被忽略。

如果没有传入 path 片段，则返回当前工作目录的绝对路径。

`path.resolve('/foo/bar', './baz');`返回/foo/bar/baz

## 事件循环
Node.js 是单进程单线程应用程序，但是通过事件和回调支持并发，所以性能非常高。
- 每一个 API 都是异步的，并作为一个独立线程运行，使用异步函数调用，并处理并发。
- 基本上所有的事件机制都是用设计模式中的观察者模式实现
- 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数。

### 事件驱动程序（非阻塞式IO / 事件驱动IO）
![事件驱动程序](https://app.yinxiang.com/shard/s3/res/3158de4d-c850-4848-9b81-eeb18e2c0fd9.jpg)

在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数。

Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。

这个模型非常高效可扩展性非常强，因为webserver一直接受请求而不等待任何读写操作。（这也被称之为非阻塞式IO / 事件驱动IO）。

Node.js所有的异步IO操作在完成时都会发送一个事件到事件队列。

Node.js里很多对象都会分发事件：如net.Server对象在每次有新连接时，fs.readStream对象在文件被打开时等，所有这些产生事件的对象都是 events.EventEmitter 的实例。大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它。包括 fs、net、 http 在内的，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

#### EventEmitter
events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

EventEmitter 对象如果在实例化时发生错误，会触发 error 事件。当添加新的监听器时，newListener 事件会触发，当监听器被移除时，removeListener 事件被触发。

EventEmitter 的每个事件由一个事件名和若干个参数组成，事件名是一个字符串，通常表达一定的语义。

步骤：
1. 引入events模块 `var events = require('events');`
2. 创建eventEmitter对象 `var eventEmitter = new event.EventEmitter();`
3. 绑定事件及事件的处理程序  `eventEmitter.on(“eventName”,eventHandler);`
4. 触发事件 `eventEmitter.emit(“eventName”);`

```javascript
var events = require('events'); // 引入 events 模块
var eventEmitter = new events.EventEmitter();// 创建 eventEmitter 对象
var connectHandler = function connected() {// 创建事件处理程序
   console.log('连接成功。');
   eventEmitter.emit('data_received'); // 触发data_received事件
}
eventEmitter.on('connection', connectHandler); // 绑定connection事件处理程序
// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});
eventEmitter.emit('connection'); // 触发 connection 事件
console.log("程序执行完毕。");

$ node main.js
连接成功。
数据接收成功。
程序执行完毕。
```
对于每个事件，EventEmitter 支持若干个事件监听器。当事件触发时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。
```javascript
//为事件someEvent注册了两个事件监听器, 两个事件监听器回调函数被先后调用
emitter.on('someEvent', function(arg1, arg2) {
    console.log('listener1', arg1, arg2);
});
emitter.on('someEvent', function(arg1, arg2) {
    console.log('listener2', arg1, arg2);
});
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数'); //触发someEvent 事件

$ node event.js
listener1 arg1 参数 arg2 参数
listener2 arg1 参数 arg2 参数
```
## Node.js
nodejs适合做什么样的业务？
nodejs与php，java有什么区别
nodejs相关的应用（答：开发命令行工具、web服务，ssr，数据库操作等）
你的Nodejs在处理什么模块。
node 网关
Node中的事件循环是什么？process.nextTick() 的作用

require 的解析规则
服务端怎么做统一的状态处理
如何对相对路径引用进行优化
NodeJS 中存在哪些流，怎么理解 pipe() 及其优点
Nodejs中的Stream和Buffer有什么区别？
node的异步问题是如何解决的？
node是如何实现高并发的？

CommonJS 的实现原理

介绍一下负载均衡，NodeJS 的 cluster 和 child_process 是什么
有没有涉及到Cluster，Node 的Cluster模式是什么？
Node 中的进程和线程啥区别？
进程和线程的区别（一个node实例就是一个进程，node是单线程，通过事件循环来实现异步）
NodeJS 是单线程还是多线程，都有哪些线程，JS 为什么是单线程的
Node 中如何创建一个进程？
Node的多个进程如何通信？
node多线程实现

Node中的错误怎么捕获？
Node中遇到错误，进程退出了怎么办？
如何监控Node？
Node中的日志如何保整串行？
Node 挂掉怎么办？怎么发现其中的问题？
node起服务如何保证稳定性，平缓降级，重启等

如何和MySQL进行通信
node接口转发有无做什么优化
常用的中间件，介绍自己写过的中间件
项目中的中间层Node 在处理什么问题？

Koa2 中的 context如何实现？
介绍koa2
koa原理，为什么要用koa(express和koa对比)
使用过的koa2中间件
Koa 的中间件原理，介绍一下 compose 函数
koa-body原理
koa中response.send、response.rounded、response.json发生了什么事，浏览器为什么能识别到它是一个json结构或是html
koa-bodyparser怎么来解析request
express ctx 中间件代码实现
express技术相关应用

介绍pm2
master挂了的话pm2怎么处理
pm2怎么做进程管理，进程挂掉怎么处理
不用pm2怎么做进程管理

我们需要理清语言和环境的关系：

ECMAScript描述了 JavaScript语言的语法和基本对象规范

浏览器作为 JavaScript的一种运行环境，为它提供了：文档对象模型（ DOM），描述处理网页内容的方法和接口、浏览器对象模型（ BOM），描述与浏览器进行交互的方法和接口

Node也是 JavaScript的一种运行环境，为它提供了操作 I/O、网络等 API

1.理解 Node在应用程序中的作用，可以使用 Node搭建前端运行环境、使用 Node操作文件、操作数据库等等

2.掌握一种 Node开发框架，如 Express， Express和 Koa的区别

3.熟练使用 Node提供的 API如 Path、 Http、 ChildProcess等并理解其实现原理

4. Node的底层运行原理、和浏览器的异同

5. Node事件驱动、非阻塞机制的实现原理

多线程如何保障各个线程的安全?
node了解哪些?node各个模块的底层原理?

## node文件查找优先级
Q：es6 import Vue from 'vue'，如何找到node_moduled目录下的文件？

模块系统的约定及实现。

在Node.js模块系统中，如果require的模块不是核心模块，而且没有'./'之类的开头，就需要从当前package的node_modules里面找，找不到就到当前package目录上层node_modules里面取......一直找到全局node_modules目录。

这样找到的往往是文件夹，所以接下来就是处理一个文件目录作为Node模块的情况。如果文件目录下有package.json，就根据它的main字段找到js文件，如果没有package.json，就默认取文件夹下的index.js。

由于webpack browsersify等模块打包工具是兼容node的模块系统的，自然也会进行同样的处理流程。它们还支持更灵活的配置，比如webpack中，可以通过 alias 和 externals 字段配置，实现对默认import逻辑的自定义。

```javascript
// webpack.config.js
alias: {
  Icon: path.resolve(__dirname, 'src/components/Icon.jsx')
}

// test.js
import Icon from 'Icon' // -> /path/to/src/components/Icon.jsx
```

Node 的多线程，高并发，安全
听说过 PWA 吗？
