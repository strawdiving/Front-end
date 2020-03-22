webpack是一个打包工具，它的宗旨是一切静态资源皆可打包。webpack是现代前端技术的基石，常规的jquery,css,html静态网页开发已经落后，现在是MVVM的时代，数据驱动界面。 且前端社区涌现很多好的实践

- 模块化
- TypeScript
- Scss,less等CSS预处理器

利用他们开发的文件往往需要额外的处理才能被浏览器识别，而手动处理很繁琐，所以有了自动化构建工具，如Grunt,Gulp, Webpack

webpack的工作方式：webpack是模块化的解决方案，把项目当做一个整体，通过一个给定的主文件（入口文件，如index.js），webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后
打包成一个（或多个）浏览器能识别的Javascript文件（Bundled Javascript）

1. 从入口文件开始，对其进行依赖分析
2. 对其所有依赖再次递归进行依赖分析
3. 构建出模块的依赖图集
4. 进行打包，根据依赖图集，使用CommonJS规范实现加载，构建出最终代码
通过构造一个立即执行函数(function () {})()，手动定义module，exports和require变量，最后实现代码在浏览器运行的目的。


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

## loaders
webpack把所有的文件都当作模块处理，Javascript代码，CSS，fonts和图片等资源通过合适的loader都可以被处理。

通过使用不同的loader，webpack有能力调用外部的工具或脚本，实现对不同格式文件的处理，如分析转换scss为css，或者把es6的高级语法转换为现代浏览器兼容的JS文件。

Loaders需要单独安装，且需要在webpack.config.js的modules关键字下进行配置，Loaders的配置包括以下几方面：
- text:一个用以匹配loaders所处理文件的扩展名的正则表达式（必须）
- loader: loader的名称（必须）
- include/exclude: 手动添加必须处理的文件/文件夹，或屏蔽不需要处理的文件/文件夹（可选）
- query: 为loaders提供额外的设置选项（可选）

### css在webpack中的配置
可以用css去写样式，也可以使用高级的stylus，less，sass等预编译器。
- css-loader,使你能够使用类似@import和url(...)的方法实现require()的功能
- style-loader，将所有计算后的样式加入页面中

两者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中

首先安装对应的loader，安装好后，在module.exports里配置。

**CSS modules**技术，把模块化的思想带入CSS，通过CSS模块，所有的类名，动画名默认只作用于当前模块。
```javascript
module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }
                ]
            }
        ]
    }
```
详见官方文档
**CSS预处理器**
Sass和Less之类的预处理器是对原生CSS的扩展，它允许你使用类似variables,nesting,mixin,inheritance等特性来写CSS，CSS预处理可以将这些特殊类型的语句转化为浏览器可识别的CSS语言。使用相应的loaders(Less Loadee,Sass loader, stylus loader)

**autoprefixer**自动添加前缀

注：**如果要在dist目录下将css和html分离，引入extract-text-webpack-plugin,webpack4使用mini-css-extract-plugin**

[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

原来的webpack配置里，是css in js的，即打包时css是打包在js里的，所以引入了mini-css-extract-plugin插件，将css从里面剥离出来。

## Babel
Babel其实是一个编译Javascript的平台，它可以编译代码以帮你达到以下目的：
- 让你使用最新的Javascript代码（ES6，ES7）,不用管新标准是否被当前使用的浏览器完全支持
- 让你能使用基于Javascript进行了扩展的语言，如React的JSX

Babel其实是几个模块化的包，其核心功能位于babel-core中，webpack可以把其不同的包整合在一起使用，对每一个你需要的功能或扩展，都需要安装独立的包（用的最多的是解析ES6的babel-env-preset和解析JSX的babel-preset-react）
```javascript
npm i --save-dev babel-core babel-loader babel-preset-env
```
在webpack中配置Babel modeule:rules
Babel的配置
新建名为.babelrc的配置文件（webpack会自动调用.babelrc里的babel配置选项）

### js在webpack中的配置
随着es6的普及，es6的使用非常广泛，但很多浏览器不支持es6,因此需要引用babel来把es6的代码编译为es5
安装babel及其依赖
在module.exports中进行配置
根目录下新建 .babelrc，进行配置

### 图片资源在webpack中的配置
file-loader

## Plugins
plugins是用来扩展webpack功能的，它们会在整个构建过程中生效，执行相关的任务。
loaders是在打包过程中用来处理源文件的，一次处理一个。
plugins并不操作单个文件，它直接对整个构建过程起作用。

### 使用插件的方法
首先要npm安装，然后在webpack配置中的plugins关键字部分添加该插件的一个实例，plugins是一个**数组**。
```javascript
module.exports = {
  ...
  plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究')
    ],
  }

```

#### Html在webpack中的配置——HtmlWebpackPlugin
引入html-webpack-plugin,并在module.exports里配置插件plugins。
这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的js文件的新index.html，这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。
配置好后，在终端输入npm run dev后，webpack将我们的html打包好，并自动将js文件引进来了。

这个插件自动完成了我们之前手动做的一些事情，对项目结构要有一定更改：

#### 热更新——Hot Module Replacement（HMR）
HMR允许你在修改组件代码后，自动刷新实时预览修改后的效果。只需要做两项配置：
- webpack配置文件中添加HMR插件
- webpack dev server中添加“hot"参数




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



## 使用webpack构建本地服务器
想让浏览器监听代码的修改，并自动刷新显示修改后的结果，webpack提供了一个可选的本地开发服务器webpack-dev-server，它是一个单独的组件，需要单独安装。
```javascript
npm install --save-dev webpack-dev-server
```
在webpack里创建了一个node进程，通过webpack-dev-server,这个本地服务器基于node.js构建，其内部封装了一个node的express模块，其配置如下：

  devServer是webpack配置选项中的一项，
  - contentBase 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另一个目录下的文件提供本地服务器，应该在这里设置所在目录
  - port 设置默认监听端口，如果省略，则默认为8080
  - hitoryApiFallback，开发单页应用时很有用，它依赖于HTML5 history API，如果设为true，所有跳转将指向index.html
  - inline 设为true，源文件改变时会自动刷新页面
  // webpack.config.js
  ```javascript
  module.exports = {
  ...
devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        port: '8080',
        historyApiFallback: true，// 不跳转
        inline:true, //实时刷新
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
在package.json中的scripts对象中添加命令，用以启动本地服务器：
//  package.json
```javascript
"scripts": { //声明使用脚本 npm run dev和 npm run build
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development"
    "dev": "webpack-dev-server --open"
  }
  ```

在终端输入npm run dev即可在本地8080端口查看结果。

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

# 开发阶段 vs 产品阶段
一般构建一个项目至少需要两种功能：本地开发调试，构建产品代码，其他还有诸如测试、部署到服务器、代码检查，格式优化等

## 产品阶段的构建
产品阶段，还需要对打包文件进行额外的处理，如优化，压缩，缓存以及分离CSS和JS。
对复杂的项目，需要复杂的配置，这时候可以将配置文件分解为小的文件。我们创建一个webpack.production.config.js文件，里面加上基本的配置
```javascript
// webpack.production.config.js
module.exports = {

    devtool: 'null', //注意修改了这里，这能大大压缩我们的打包代码
    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        hot: true
    },
};
```
package.json
```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "dev": "webpack-dev-server --open",
    "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"
  },
```
注意:如果是window电脑，build需要配置为"build": "set NODE_ENV=production && webpack --config ./webpack.production.config.js --progress".

### 优化插件
- UglifyJsPlugin：压缩JS代码，内置插件
- ExtractTextPlugin: 分离JS和CSS文件

要安装非内置插件，在配置文件的plugins中引用;内置插件可以直接引用。
```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports={
...
plugins: [
  new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css")
      ]
```
### 缓存
使用缓存最好的方法是保证文件名和文件内容是匹配的（内容改变，名称相应改变）

webpack可以把一个hash值添加到打包的文件名中，使用方法如下，添加特殊的字符串混合体到输出文件名前（[name],[id] and [hash]）
```javascript
const webpack = require('webpack');

module.exports = {
..
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
   ...
};
```
### 去除build文件中的残余文件
添加hash后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，可以使用clean-webpack-plugin
