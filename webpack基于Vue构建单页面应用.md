# 0.安装webpack
[webpack文档](https://webpack.docschina.org/concepts/)
官方：[webpack安装](https://webpack.docschina.org/guides/installation/) 

本地安装webpack
```javascript
npm i --save-dev webpack
```
全局安装webpack
```
npm i -g webpack
```
如果使用 webpack v4+ 版本，还需要安装 CLI
```
npm i save-dev webpack-cli
```

# 项目初始化
进入项目目录，初始化项目
```
npm init
```
系统会提示你填写一些项目相关信息，随后产生package.json文件，
```json
package name: (webpack)
version: (1.0.0)
description: webpack for vue SPA project
entry point: (index.js) main.js
test command:
git repository:
keywords:
author: strawdiving
license: (ISC)
```
![package.json](http://baidu.com/pic/doge.png)

### 安装webpack-dev-server

[使用 webpack-dev-server](https://webpack.docschina.org/guides/development/#%E4%BD%BF%E7%94%A8-webpack-dev-server)

webpack-dev-server 提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能

```
npm i webpack-dev-server --save-dev
```
### 创建目录结构、文件
1. 新建入口文件
新建src目录，用来存放各种组件和静态文件，在src目录下新建入口文件main.js

2. 根目录下新建index.html
新建index.html作为项目的主体页面，留出入口文件，入口文件的路径为webpack打包后输出的路径
```html
<!doctype html>
<html>
  <head>
    <title>webpack</title>
  </head>
  <body>
    <script src="/dist/main.js"></script>
  </body>
</html>
```
# Webpack配置
### 配置webpack.config.js

根目录下新建webpack的配置文件webpack.config.js。
配置入口、出口路径、打包后的文件名，devServer相关配置项。

[使用一个webpack的配置文件](https://webpack.docschina.org/guides/getting-started/#%E4%BD%BF%E7%94%A8%E4%B8%80%E4%B8%AA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
  //项目入口文件
  entry: './src/main.js',
  output: {
    //打包出口路径
    path: path.resolve(__dirname, './dist'),
    //通过devServer访问路径
    publicPath: '/dist/',
    //打包后的文件名
    filename: 'main.js'
  },
  mode:'development',
  devServer: {
    historyApiFallback: true,
    overlay: true
  }
};
```
为了简化在命令行中输入复杂指令的操作，可以设置快捷方式，调整package.json文件，在npm scripts中添加一个npm命令：

package.json
``` json
"scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
```
可以添加 --config 指向指定文件，默认文件为webpack.config.js
```json
webpack [--config webpack.config.js]
```
现在，可以使用npm run build命令，来替代在命令行中输入复杂指令的操作
更多配置见：[命令行接口](https://webpack.docschina.org/api/cli/)

运行npm run build后，会在项目中生成一个 dist文件夹。

### 配置webpack解析(resolve)
[webpack解析（resolve）](https://webpack.docschina.org/configuration/resolve/)

webpack.config.js中增加：
```javascript
resolve: {
  //路径别名
  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    '@':path.resolve(__dirname, './src'),
  },
  //路径别名自动解析确定的扩展
  extensions: ['.js', '.vue', '.json']
},
```
resolve是webpack关于解析的配置项，alias允许你在项目中使用路径别名代替复杂的路径。
extensions,会让webpack自动查找特定后缀的文件，能够使用户在引入模块时不带扩展，即在项目中引入文件时将不必再书写文件后缀。

# 引入Vue
安装Vue
```javascript
npm i vue --save-dev
```
[vue的安装](https://cn.vuejs.org/v2/guide/installation.html)

根据说明，引入vue实际上是引用node_modules/vue/dist/vue.esm.js，路径别名是据此来配置的。

### 在index.html中添加挂载点dom（#app）
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>webpack</title>
</head>
<body>
  <div id="app">{{message}}</div>
  <script src="/dist/main.js"></script>
</body>
</html>
```
### 在main.js中引入vue
```javascript
import Vue from 'vue'

var app = new Vue({
  el: "#app",
  data: {
    message: 'hello webpack!!'
  }
})
```
启动server，可以预览到页面显示 'hello webpack!!',且项目中生成一个dist文件夹。
```javascript
npm run build
```
此时文件夹内已经生成好打包文件，但是只要js，没有html

### html-webpack-plugin
引入[html-webpack-plugin](https://webpack.docschina.org/plugins/html-webpack-plugin/)插件，让webpack把html文件也打包进去。
```javascript
npm i --save-dev html-webpack-plugin
```

```javascript 
var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  //项目入口文件
  entry: './src/main.js',
  output: {
    //打包出口路径
    path: path.resolve(__dirname, './dist'),
    //通过devServer访问路径
    publicPath: '/dist/',
    //打包后的文件名
    filename: 'main.js'
  },
  mode:'development',
  devServer: {
    historyApiFallback: true,
    overlay: true
  },
  plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    })
  ]     
};
```
这将会产生一个包含以下内容的文件 dist/index.html：
而webpack入口点会在生成的HTML文件中的 script 标签内。

# 配置loader
webpack默认只能解析js文件，因此需要在webpack.config.js中配置相应的解析器。
loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，
并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。
loader 甚至允许你直接在 JavaScript 模块中 import CSS文件。

### 样式文件和图片文件loader配置
```javascript
// 安装scss和相应样式文件解析器
npm i --save-dev node-sass css-loader vue-style-loader sass-loader 
// 安装图片文件解析器
npm i --save-dev file-loader
```
- css-loader,解析css文件
- style-loader，解析dom中通过<style></style>注入的样式，vue-style-loader是vue官方基于style-loader开发的适用于vue的样式解析
- sass-loader，解析sass/scss文件
- file-loader，将图片当做模块解析

然后指示webpack对相应文件使用对应的loader：
```javascript
module: {
    rules: [{
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader']
    },{
        test: /\.scss$/,
        use: ['vue-style-loader','css-loader','sass-loader']
    },
    {
        test: /\.sass$/,
        use: ['vue-style-loader','css-loader','sass-loader?indentedSyntax']
    },
    {
         test: /\.(png|jpg|gif|svg)$/,  
         loader: 'file-loader',
         options: {
           name: '[name].[ext]?[hash]'
         }
    }]
  },
  ```
.css为后缀的文件使用css-loader，vue-style-loader解析，.scss和.sass为后缀的文件使用sass-loader，css-loader, vue-style-loader解析。

注意： loader加载有先后顺序，后加载的放在前面，要先了解每个loader之间的依赖关系

### 使用babel的loader配置
Babel 是一个工具链，主要用于在旧的浏览器或环境中将 ECMAScript 2015+ 代码转换为向后兼容版本的 JavaScript 代码，babel可以让我们在项目中自由的使用es6语法，他会为我们将es6语法编译成浏览器普遍通用的es5语法。
[babel的配置](https://babel.docschina.org/setup#installation)

1. 安装依赖
```javascript
npm i --save-dev babel-loader @babel/core @babel/cli
npm i --save @babel/polyfill //--save 选项而不是 --save-dev，因为这是一个需要在源代码之前运行的 polyfill。
```
- babel-loader,webpack中babel的解析器
- polyfill，babel的一个依赖
使用 @babel/cli 从终端运行 Babel，@babel/polyfill 来实现所有新的 JavaScript 功能。

2. 在webpack.config.js中配置Babel
```javascript
module: {
  rules: [
    { test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ]

```

3. 创建.babelrc配置文件
要让babel真正生效，需要在项目的根目录中创建一个.babelrc文件并启用转换ES5的[env preset](https://babel.docschina.org/docs/en/babel-preset-env)
```javascript
 npm i --sae-dev @babel/preset-env
```
为了让preset生效，需要这样定义.babelrc文件
```javascript
{
  "presets": [
    "@babel/preset-env",
    {
      "useBuiltIns": "entry"
    }
  ]
}
```
入口文件更改为：
```javascript
entry: ["@babel/polyfill", './src/main.js'],
```
**注： babel的6.0和7.0不兼容，如果package.json中版本混乱建议降级活升级以统一版本**

# Vue单页面应用
[Vue单页面应用的webpack配置](https://vue-loader.vuejs.org/zh/guide/#%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE)
## 使用Vue单文件组件
1. 安装[vue-loader](https://vue-loader.vuejs.org/zh/#vue-loader-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)及依赖
```javascript
npm i vue-loader vue-template-compiler --save-dev
```
Vue Loader 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。
每个 vue 包的新版本发布时，一个相应版本的 vue-template-compiler 也会随之发布。编译器的版本必须和基本的 vue 包保持同步，这样 vue-loader 就会生成兼容运行时的代码。这意味着你每次升级项目中的 vue 包时，也应该匹配升级 vue-template-compiler。

2. webpack 配置
```javascript
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```
**这个插件是必须的！** 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。

3. 准备单文件组件
src目录下创建App.vue
src目录下创建components用来存放其他单文件组件
App.vue
```vue
<template>
  <div>
    <header></header>
  </div>
</template>

<script>
  import Header from '@/components/header.vue'
  export default {
    name:'app',
    components:{
      Header
    }
  }
</script>

<style lang="scss" scoped>
  $txtColor:red;
  .sg{
    color:$txtColor
  }
</style>
```
header.vue
```vue
<template>
  <div>
    header
    <span>color</span>
    {{this.message}}
  </div>
</template>

<script>
  export default {
    name:'Header',
    data () {
      return {
        message:'hello world'
      }
    }
  }
</script>

<style lang="scss" scoped>
  span{
    color:green
  }
</style>
```
main.js
```javascript
import Vue from 'vue'
import App from './App.vue'
import './assets/styles/index.scss'

new Vue({
  render:h => h(App)
}).$mount('#app')
```
