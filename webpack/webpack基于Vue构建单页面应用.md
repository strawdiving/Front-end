# 0.安装webpack（webpack v4+）
[webpack文档](https://webpack.docschina.org/concepts/)
官方：[webpack安装](https://webpack.docschina.org/guides/installation/)

```javascript
//全局安装
npm install webpack webpack-cli -g
//安装到项目目录
npm install webpack webpack-cli --save-dev
```
在webpack4中，webpack和webpack-cli分开来，更好地管理。

# 项目初始化
进入项目目录，初始化和配置webpack
```javascript
npm init // 加-y，即默认所有的配置

```
终端会问一系列项目名称，描述，作者等信息。
初始化完成后，自动创建了package.json文件。这是一个标准的npm说明文件，包含了丰富的信息，如项目的依赖模块，自定义的脚本任务等。

![package.json](http://baidu.com/pic/doge.png)

1. 根目录下新建index.html
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
在 Vue项目中，在src目录下新建html模板文件，并添加挂载点dom（#app）
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

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
  entry: './src/index.js',
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

2. 新建入口文件
新建src目录，用来存放各种组件和静态文件，在src目录下新建入口文件main.js
3. 配置webpack.config.js

根目录下新建webpack的配置文件webpack.config.js。
配置入口、出口路径、打包后的文件名，devServer相关配置项。

### webpack的运行

只需在终端里运行webpack(非全局安装需使用node_modules/.bin/webpack)命令，这条命令会自动引用webpack.config.js文件中的配置选项。

为了简化在命令行中输入复杂指令的操作，可以设置快捷方式，用npm引导任务执行。

调整package.json文件，对npm进行配置，在npm scripts中添加一个npm命令。

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

注：**package.json中的scripts会按照一定顺序寻找命令对应位置，本地的node_modules/.bin路径就在这个寻找清单中，所以无论是全局还是局部安装的webpack，都不需要指明详细的路径了**

npm的start命令是一个特殊的脚本名称，在命令行中使用npm start就可以执行其对应的命令，`npm start`,其他的需要这样用`npm run {script name}`

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

1. 安装依赖
```javascript
npm i --save-dev babel-loader @babel/core  @babel/cli @babel/preset-env
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
**注： babel的6.0和7.0不兼容，如果package.json中版本混乱建议降级或升级以统一版本**

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

# 参考引用
[webpack搭建vue项目开发环境【文档向学习】](https://segmentfault.com/a/1190000016494957)
[使用webpack手动搭建一个基于vue的单页面应用](https://segmentfault.com/a/1190000015132838)


# 从"npm init"开始，实现一套完整的前端工程架构方案
一套完整的前端工程架构涉及很多技术栈：
1. 构建工具： Webpack5.x
2. 前端框架： Vue 3.x
3. 路由工具： Vue Router 4.x
4. CSS预编译： Less
5. Git hook工具： Husky
6. 代码规范： Prettier + ESLint + Airbnb standard
7. 自动部署：Github Actions

## 1. 架构搭建
- npm init
- 安装webpack三件套 webpack webpack-cli webpack-dev-server
- 区分development和production环境。在根目录添加build文件夹，添加
  - webpack.common.config 公共配置
  - webpack.dev.config，mode为development的配置
  - webpack.prod.config，mode为peoduction的配置
  - webpack.loader.config, 配置loader
  再用某种方式来组合他们，通常是合并数组和对象———— webpack-merge

  使用webpack的webpack-merge把当前文件配置合并到公共配置，那么后续如果想增加测试环境、预发布环境 、生产环境只要添加对应的配置文件就可以区分出来。
  ```javascript
  const { merge } = require('webpack-merge')
  const webpackConfigBase = require('./webpack.common.config')

  module.exports = merge(webpackConfigBase(false), {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    module: {},
    plugins: [],
    devServer: {
      hot: true
    }
  })
  ```
  - 安装dotenv、cross-env 配置环境变量
  在根目录添加两个文件 .env.dev, .env.prod，里面可以添加自己定义的全局变量，然后按照不同环境写入不同的变量。
  ```javascript
  NODE_ENV = 'development'
  VUE_SHOWCONSOLE = true  //是否显示console
  VUE_DEV_URL ='www.xxx.com' //开发环境接口地址
  ```
  - 修改 webpack.common.config.js 将写好的变量配置到该文件
  ```javascript
  const { resolve } = require('path')
  const webpack = require('webpack')

  require('dotenv').config({ path: `.env.${process.env.envMode}` })
  let env = {}
  // 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
  for (const key in process.env) {
    if (key === 'NODE_ENV' || key === 'BASE_URL' || /^VUE_APP_/.test(key)) {
      env[key] = JSON.stringify(process.env[key])
    }
  }

  module.exports = (mode) => {
    return {
      .../
      plugins: [
        new webpack.DefinePlugin({
          // 定义环境和变量
          'process.env': {
            ...env
          }
        })
      ]
    }
  }
  ```
  packgae.json 文件增加两条命令分别对应开发环境和生产坏境
  ```javascript
  "scripts": {
    "dev": "cross-env envMode=dev webpack serve --config build/webpack.dev.config.js  --color",
    "build": "cross-env envMode=prod webpack --config build/webpack.prod.config.js  --color"
  },
  ```
  如果还有其他环境可以按照自己的需求去添加，比如测试环境、预发布环境等等

  ## 添加各种技术栈
  安装vue3,vue-loader,webpack.loader.config中添加 vue-loader.
  webpack.common.config.js 添加 VueLoaderPlugin

  ES6+转ES5 -- babel

  安装html-webpack-plugin

  安装vue-router,index.js修改路由规则，main.js中挂载路由配置

  添加less预处理器 ： install style-loader, css-loader, less-loader，在webpack.loader.config中添加loader

  ## 配置webpack
  alias，图片等静态资源，清除dist目录（webpack5.20以下版本一般使用插件 clean-webpack-plugin， 5.20版本以后output新增特性clean，用于清除dist目录）
  ```javascript
  // webpack.prod.config.js
  module.exports = {
  //...
    output: {
      clean: true, // Clean the output directory before emit.
    },
  };
  ```
  - FileSystem Cache 加速二次构建

  Webpack5 之前，我们会使用 cache-loader 缓存一些性能开销较大的 loader ，或者是使用 hard-source-webpack-plugin为模块提供一些中间缓存。
  在 Webpack5 之后，默认就为我们集成了一种自带的缓存能力（对 module 和 chunks 进行缓存）。通过如下配置，即可在二次构建时提速。
  ```javascript
  module.exports = {
    //...
    cache: {
        type: 'filesystem',
        // 可选配置
        buildDependencies: {
            config: [__filename],  // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        },
        name: '',  // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
        //...
    },
  }
  ```
  
  ## 代码规范
  Prettier：在项目根目录下创建 .prettierrc 文件，在这个文件可以配置团队统一的格式化风格。
  如果想保存文件之后格式化可以在VS Code设置找到file wathcer ，添加 prettierrc

  ESLint：安装并执行 npx eslint \--init ,按操作提示完成一系列设置来创建配置文件。

  根目录添加.eslintignore, .eslintrc.js

  webpack5.20以后不需要eslint-loader直接在webpack.common.config.js添加如下代码

  ```javascript
  plugins:[
    new ESLintPlugin({
      // fix: true,
      extensions: ['js', 'json', 'vue'],
      exclude: '/node_modules/'
    })
  ]
  ```

  ## Github Actions 自动部署项目
  创建一个有 repo 和 workflow 权限的 GitHub Token。注意：新生成的 Token 只会显示一次，保存起来，后面要用到。如有遗失，重新生成即可。

  在仓库中添加 secret: 仓库 -> settings -> Secrets -> New repository secret
  将上面新创建的 Token 添加到 GitHub 仓库的 Secrets 里，并将这个新增的 secret 命名为 NIGO_DEV （名字无所谓，看你喜欢）。

  - 创建 Actions 配置文件
  在项目根目录下创建 .github 目录。
  在 .github 目录下创建 workflows 目录。
  在 workflows 目录下创建 deploy.yml 文件。
  修改 deploy.yml 文件，添加如下代码
  ```javascript
  name: deploy

  on:
    push:
      branches: [master] # master 分支有 push 时触发

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2

        - name: Setup Node.js v14.x
          uses: actions/setup-node@v1
          with:
            node-version: '14.x'

        - name: Install
          run: yarn install # 安装依赖

        - name: Build
          run: npm run build # 打包

        - name: Deploy
          uses: peaceiris/actions-gh-pages@v3 # 使用部署到 GitHub pages 的 action
          with:
            publish_dir: ./dist # 部署打包后的 dist 目录
            github_token: ${{ secrets.NIGO_DEV }} # secret 名
            user_name: ${{ secrets.MY_USER_NAME }}
            user_email: ${{ secrets.MY_USER_EMAIL }}
            commit_message: Update # 部署时的 git 提交信息，自由填写
  ```

  接着只要提交修改代码，Github Actions就会运行自动部署

  这里部署后的代码会放到gh-pages分支，gh-pages分支是自动创建的

  github仓库 -> settings -> pages 读取gh-pages分支，然后访问shinewen189.github.io/nigo-cli/
