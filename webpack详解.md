webpack是一个打包工具，它的宗旨是一切静态资源皆可打包。webpack是现代前端技术的基石，常规的jquery,css,html静态网页开发已经落后，现在是MVVM的时代，数据驱动界面。 且前端社区涌现很多好的实践

- 模块化
- TypeScript
- Scss,less等CSS预处理器

利用他们开发的文件往往需要额外的处理才能被浏览器识别，而手动处理很繁琐，所以有了自动化构建工具，如Grunt,Gulp, Webpack

webpack的工作方式：webpack是模块化的解决方案，把项目当做一个整体，通过一个给定的主文件（入口文件，如index.js），webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后
打包成一个（或多个）浏览器能识别的Javascript文件（Bundled Javascript）

（注：Grunt和Gulp的工作方式：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具可以自动替你完成这些任务。是能够优化前端的开发流程的工具）
如：
Source Folder(Javascript ES6)---> Read all files from folder ---> Process files through first task(plugin) ---> Transpile to JS(es5)
---> Save or Stream file to next task ---> Bundles JS modules ---> Save file ---> Bundled Javascript

webpack的处理速度更快更直接，能打包更多不同类型的文件。

webpack的生态圈：
- Express：搭建本地开发环境
- Babel：配置ES2015
- HMR：配置本地热更新
- ESlint：检查代码格式
- Tree-shaking：去除无用的代码
- Vue-cli：项目脚手架

webpack将现代js开发中的各种新型有用的技术，集合打包。

## 1. 前端环境搭建
### 1.1 安装
```javascript
//全局安装
npm install webpack webpack-cli -g
//安装到项目目录
npm install webpack webpack-cli --save-dev
```
在webpack4中，webpack和webpack-cli分开来，更好地管理。

### 1.2 初始化
新建一个webpack-test的文件夹，进入文件夹中，初始化和配置webpack
```javascript
npm init // 加-y，即默认所有的配置

```
终端会问一系列项目名称，描述，作者等信息。
初始化完成后，自动创建了package.json文件。这是一个标准的npm说明文件，包含了丰富的信息，如项目的依赖模块，自定义的脚本任务等。

## 1.3 部署webpack
开发时一般会打包的文件类型：
- 发布时需要的html，css,js
- css预编译器stylus,less,sass
- 图片资源png,gif,jpg等
- es6的高级语法
- 文件间的require
- 别名@等修饰符

分别进行配置。
在项目的根目录下新建**webpack.config.js**文件，再新建一个**index.html**文件

```javascript
const path = require('path'); //引入我们的node模块里的path

module.exports = {
    entry: './src/index.js', //入口文件  在vue-cli main.js
    output: {       //webpack如何向外输出
        path: path.resolve(__dirname, 'dist'),//定位，输出文件的目标路径
        filename: '[name].js' //文件名[name].js默认，也可自行配置
    }
 }
```

在index.html文件中写入最基础的html代码，它的目的在于引入打包后的js文件。

### webpack的使用
webpack可以在终端中使用，
```javascript
webpack {entry file} {destination for bundled file} //指定入口文件，和打包文件的存放路径
```
指定入口文件后，webpack将自动识别项目所依赖的其他文件，注意：如果你的webpack不是全局安装的，当你在终端中使用此命令时，需要额外指定其在
node_modules中的地址
```javascript
node_modules/.bin/webpack src/main.js dist/main.js
```

但是终端中进行复杂的操作很不方便，一般通过配置文件来使用webpack。配置文件也是一个简单的Javascript模块，我们可以把所有的与打包相关的信息放在里面。

### Html在webpack中的配置
引入html-webpack-plugin,并在module.exports里配置插件plugins。
配置好后，在终端输入npm run dev后，webpack将我们的html打包好，并自动将js文件引进来了。

### css在webpack中的配置
可以用css去写样式，也可以使用高级的stylus，less，sass等预编译器。
首先安装对应的loader，安装好后，在module.exports里配置。
注：**如果要在dist目录下将css和html分离，引入extract-text-webpack-plugin,webpack4使用mini-css-extract-plugin**

[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

原来的webpack配置里，是css in js的，即打包时css是打包在js里的，所以引入了mini-css-extract-plugin插件，将css从里面剥离出来。

### js在webpack中的配置
随着es6的普及，es6的使用非常广泛，但很多浏览器不支持es6,因此需要引用babel来把es6的代码编译为es5
安装babel及其依赖
在module.exports中进行配置
根目录下新建 .babelrc，进行配置

### 图片资源在webpack中的配置
file-loader

### 别名在webpack中的配置——resolve

### 其他静态资源在webpack中的配置
- src下其他的文件直接复制到dist目录下，并不是每个文件都需要打包处理，很多资源可能就直接复制过去，使用**CopyWebpackPlugin插件**
- jquery，lodash等工具库是很多组件会复用的，使用**webpack.ProvidePlugin插件**

### proxy
```javascript
proxy: {
    '*': {
        target: config.target,
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}
```
changeOrigin 加了这个，代理服务器会在请求头中加入相应Host首部，然后目标服务器就可以根据这个首部来区别要访问的站点了。假如你在本地80端口
起了apache服务器，服务器配了两个虚拟站点a.com,b.com，设置代理之后并且changeOrigin为true，此时可以正确访问虚拟主机下的文档内容，否则访问a,b站点等同于访问localhost。
webpack dev server用的是node-http-proxy

## npm run dev 和 npm run build
dev——在webpack里创建了一个node进程，通过webpack-dev-server,其内部封装了一个node的express模块，其配置如下：
//  package.json
```javascript
"scripts": { //声明使用脚本 npm run dev和 npm run build
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development"
  }
  ```
  
  // webpack.config.js
  ```javascript
  module.exports = {
  ...
devServer: {
        port: '8080',
        before(app) {
            app.get('/api/test.json', (req, res) => {
                res.json({
                    code: 200,
                    message: 'Hello World'
                })
            })
        }
    }  //服务于webpack-dev-server  内部封装了一个express 
  }
```

## 生成Source Maps（使调试更容易）
通过打包后的文件，不容易找到出错了的地方对应的你写的代码的位置，Source Maps就是解决这个问题的。
通过简单的配置，webpack就可以在打包时为我们生成source maps，提供了一种对应编译文件和源文件的方法，使编译后的代码可读性更高，更容易调试。

```javascript
module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
```
在webpack的配置文件中配置source maps，需要配置devtool，有四种不同的配置：
- source-map
- cheap-module-source-map
- eval-source-map
- cheap-module-eval-source-map

对小到中型项目，eval-source-map是一个很好的选项。

**注：只应该开发阶段使用**


