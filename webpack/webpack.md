# 前端工程化-Webpack
前端工程化的理解，webpack等工具在项目中的作用
## webpack打包原理
webpack是基于模块化打包的工具。自动化处理模块，webpack把一切当成模块，当webpack处理应用程序时，它会递归地构建一个依赖图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个bundle。
webpack有强大的loader和plugin插件生态，打包后的文件实际上是一个立即执行函数，这个函数执行一个参数，参数是模块对象，键为各个模块的路径，值为模块内容。立即执行函数内部处理模块之间的引用，执行模块等。更适合文件依赖复杂的应用。

Grunt，Gulp是基于任务运行的工具：它们会自动执行指定的任务，像流水线，把资源放上去，通过不同的插件进行加工。它们包含活跃的社区，丰富的插件，能方便的打造各种工作流。

rollup将各个模块打包进一个文件中，且通过tree-shaking删除无用的代码，可最大程度降低代码体积，但没有webpack那么多的代码分割，按需加载等功能，更聚焦于库的打包，适用于基础库的打包，如vue，d3等。

## webpack打包流程
串行的过程，依次执行：
1. 初始化参数：从配置文件，webpack.config.js，读取和合并参数，得出最终的参数；
2. 开始编译：用参数初始化Compiler对象，加载所有plugin，执行对象的run方法开始编译
3. 确定入口：根据配置中的entry找到文件入口
4. 编译模块：从入口文件出发，调用所有配置的loader对模块进行翻译，找出模块所依赖的模块，再递归本步骤，直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译： 得到每个模块被翻译后的最终内容，以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成单独的文件加入到输出列表。这一步是修改输出内容的最后机会
7. 输出完成：根据配置确定输出的路径和文件名，把文件内容写入到文件系统

以上过程中，webpack会在特定时间点广播出特定的事件，插件在监听到感兴趣的事件后执行特定的逻辑，且插件可以调用webpack提供的API改变webpack的运行结果。

## bundle，chunk，module
bundle是webpack打包出来的文件
chunk是代码块，一个chunk由多个模块组合而成，用于代码的合并和分割
module是开发中的单个模块，webpack中一切皆模块，一个模块对应一个文件，从ectry文件开始找出所有依赖的模块

## 提高webpack的打包速度
- happypack/thread-loader，利用进程并行编译loader，利用缓存使rebuild更快
- 外部扩展（externals）,将不怎么需要更新的第三方库脱离webpack打包，不被打入bundle中，从而减少打包时间，不如jQuery用script标签引入
- dll，DllPlugin和DllReferencePlugin引入dll，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费资源。
- 利用缓存，webpack.cache，babel-loader.cacheDirectory都可以利用缓存提高rebuild效率
- 缩小文件搜索范围，如babel-loader，可以用include: path.resolce(__dirname,'src'),效率提升有限，一般要exclude node_modules

## 提高webpack构建速度
- 多入口情况下，使用CommonsChunksPlugin提取公共代码
- externals，提取常用库
- DllPlugin和DllReferencePlugin预编译资源模块，对引用了但绝不会修改的npm包进行预编译，再用DllReferencePlugin将预编译的模块加载进来。
- happypack多线程加速编译
- webpack-uglify-parellel多核压缩来提升uglifyPlugin的压缩速度
- 使用tree-shaking和scope hoisting来删除多余代码

scope hoisting： 作用域提升,让webpack打包出来的代码文件更小

    代码体积更小，因为函数声明语句会产生大量代码；
    代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。
分析出模块之间的依赖关系，尽可能把打散的模块合并到一个函数中去，前提是不能造成代码冗余。 只有那些被引用了一次的模块才能被合并。
因为要分析模块之间的依赖，所以必须使用ES6模块化语句。
```javascript
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
    resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ],
};
```
## 如何配置单页应用，多页应用
webpack单页应用，entry入口指定单页应用的入口即可；

多页面应用，webpack的AutoWebPlugin完成简单自动化的构建，前提是项目目录结构符合预设的规范。
- 每个页面都有公共的代码，如公共的css样式表。可以抽离出来，避免重复加载
- 页面可能不断追加，所以入口配置足够灵活，避免每次添加新页面要修改构建配置。


## wepack-dev-server热更新HMR的原理
热替换HMR，不用刷新浏览器就可以用变更的模块代替旧模块。

1. 在webpack的watch模式下，watch监听到文件系统中的文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的Javascript对象保存在内存中；
2. webpack-dev-server（主要是中间件webpack-dev-middleware）和webpack之间的接口交互，中间件调用webpack的API对代码变化进行监控，并告诉webpack，将代码打包到内存中
3. webpack-dev-server对文件变化的监控，当在配置中
4. webpack-dev-server，通过sockjs，在c/s之间建立一个websocket长连接，将webpack编译打包各个阶段的状态信息告知浏览器，同时也包括3中Server监听静态文件变化的信息。浏览器根据socket消息进行不同操作，server传递的最主要信息是新模块的hash值，后面的步骤根据这一hash值进行模块热替换。

## 是如何做到在不刷新浏览器的前提下更新页面的?

## webpack的劣势

## 前端的工作流程
## webpack针对模块化做的处理

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

import { Button } from 'antd'，打包的时候只打包button，分模块加载，是怎么做到的

webpack的入口文件怎么配置，多个入口怎么分割。
webpack的常用配置
抽取公共文件是怎么配置的
webpack 配置文件中的 externals，UMD 了解吗
使用webpack构建时有无做一些自定义操作
如何实现分模块打包（多入口）
如何配置把js、css、html单独打包成一个文件
webpack配sass需要哪些loader，配css需要哪些loader
使用import时，webpack对node_modules里的依赖会做什么
一般怎么组织CSS（Webpack）
项目如何管理模块
webpack整个生命周期
webpack介绍，webpack做了什么
webpack打包的整个过程/webpack 是如何进行打包的
webpack执行的过程
dev-server是怎么跑起来
打包时Hash码是怎么生成的
随机值存在一样的情况，如何避免
Webpack的编译原理、构建流程、热更新原理， chunk、 bundle和 module的区别和应用
tree-shaking作用，工作原理，如何才能生效
code splitting用的什么插件，怎么做？
sourcemap原理是什么？
webpack 动态 import 是如何实现的
如何自己实现一个文件打包，比如一个JS文件里同时又ES5 和ES6写的代码，如何编译兼容他们


用过哪些loader和plugin，各种loader，plugin的名字和使用方法
可熟练配置已有的 loaders和 plugins解决问题，
plugin与loader的区别
webpack里面的插件是怎么实现的
有没有写过Webpack插件。如何编写一个loader、plugin
loader的执行顺序为什么是后写的先执行
- vue-loader是什么？使用它的用途有哪些；
解析.vue文件的一个加载器，跟template/js/style转换成js模块。
用途：js可以写es6、style样式可以scss或less、template可以加jade等
- css-loader原理,过程

对webpack,gulp，grunt等有没有了解?对比。
gulp的具体使用
rollup了解过没？
为什么rollup打包赘余代码比较少？

是否配置过webpack、做过哪些优化/如何做工程上的优化
webpack配置优化
webpack打包优化（happypack、dll）
webpack构建速度优化（dllplugin预编译资源模块，HappyPack加速代码构建）

1. vue-cli脚手架搭建 和 功能配置 vue.config.js
  3. 项目构建 打包
  1. 项目分类; 各类文件整理,分类
  2. 各类功能封装
  3. 组件和功能模块的抽离, 解耦, 复用；模块化, 组件化开发能力

项目构建
1.理解 npm、 yarn依赖包管理的原理，两者的区别
2.可以使用 npm运行自定义脚本

3.理解ESLint
  ESLint规则检测原理，常用的 ESLint配置

5. Babel在项目中承担的作用。Babel的核心原理，可以自己编写一个 Babel插件
6.可以配置一种前端代码兼容方案，如 Polyfill




