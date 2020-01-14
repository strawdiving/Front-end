# 模块系统
## Node.js REPL交互解释器（Node.js自带）
表示一个电脑的环境，类似 Window 系统的终端或 Unix/Linux shell，我们可以在终端中输入命令，并接收系统的响应。可以很好的调试 Javascript 代码。
- 读取 - 读取用户输入，解析输入的Javascript 数据结构并存储在内存中。
- 执行 - 执行输入的数据结构
- 打印 - 输出结果
- 循环 - 循环操作以上步骤直到用户两次按下 ctrl-c 按钮退出。

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

