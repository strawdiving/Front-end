# 前端工程化-Webpack
前端工程化的理解，webpack等工具在项目中的作用

前端工程化：
- 前端开发要自成体系，包括构建、部署和运维，不再和后端耦合，后端通过RESTful API提供服务
- 设计要分层，来应对需求和技术的变化

模块化就是将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载。只有这样，才有多人协作的可能

模块的打包和加载问题：1. 用Webpack+Babel将所有模块打包成一个文件同步加载，也可以打成多个chunk异步加载；
## webpack打包原理
webpack是一个JS的静态模块打包工具，它的宗旨是一切静态资源皆可打包。webpack是现代前端技术的基石，常规的jquery,css,html静态网页开发已经落后，现在是MVVM的时代，数据驱动界面。 且前端社区涌现很多好的实践

- 模块化
- TypeScript
- Scss,less等CSS预处理器

利用他们开发的文件往往需要额外的处理才能被浏览器识别，而手动处理很繁琐，所以有了自动化构建工具，如Grunt,Gulp, Webpack

webpack的工作方式：webpack是模块化的解决方案，把项目当做一个整体，通过一个给定的主文件（入口文件，如index.js），webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包成一个（或多个）浏览器能识别的Javascript文件（Bundled Javascript）。

webpack只支持Javascript文件类型（包含JSON)。其他类型需要loaders来支持。

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

简化版：
1. 从入口文件开始，对其进行依赖分析
2. 对其所有依赖再次递归进行依赖分析
3. 构建出模块的依赖图集
4. 进行打包，根据依赖图集，使用CommonJS规范实现加载，构建出最终代码
通过构造一个立即执行函数(function () {})()，手动定义module，exports和require变量，最后实现代码在浏览器运行的目的。

### webpack,gulp，grunt
gulp的具体使用
rollup了解过没？
为什么rollup打包赘余代码比较少？

（注：Grunt和Gulp的工作方式：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，工具可以自动替你完成这些任务。是能够优化前端的开发流程的工具）
如：
Source Folder(Javascript ES6)---> Read all files from folder ---> Process files through first task(plugin) ---> Transpile to JS(es5)
---> Save or Stream file to next task ---> Bundles JS modules ---> Save file ---> Bundled Javascript

webpack的处理速度更快更直接，能打包更多不同类型的文件。

webpack的生态圈：
- Babel：配置ES2015
- HMR：配置本地热更新
- ESlint：检查代码格式
- Tree-shaking：去除无用的代码
- Vue-cli：项目脚手架

webpack将现代js开发中的各种新型有用的技术，集合打包。

webpack是基于模块化打包的工具。自动化处理模块，webpack把一切当成模块，当webpack处理应用程序时，它会递归地构建一个依赖图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个bundle。

webpack有强大的loader和plugin插件生态，打包后的文件实际上是一个立即执行函数，这个函数执行一个参数，参数是模块对象，键为各个模块的路径，值为模块内容。立即执行函数内部处理模块之间的引用，执行模块等。更适合文件依赖复杂的应用。

Grunt，Gulp是基于任务运行的工具：它们会自动执行指定的任务，像流水线，把资源放上去，通过不同的插件进行加工。它们包含活跃的社区，丰富的插件，能方便的打造各种工作流。

rollup将各个模块打包进一个文件中，且通过tree-shaking删除无用的代码，可最大程度降低代码体积，但没有webpack那么多的代码分割，按需加载等功能，更聚焦于库的打包，适用于基础库的打包，如vue，d3等。

## bundle，chunk，module，区别和应用
bundle是webpack打包出来的文件
chunk是代码块，一个chunk由多个模块组合而成，用于代码的合并和分割
module是开发中的单个模块，webpack中一切皆模块，一个模块对应一个文件，从entry文件开始找出所有依赖的模块

### bundle
bundle是一个立即执行函数，可以认为它是把所有模块捆绑在一起的一个巨型模块
webpack把所有模块打包成了bundle的依赖，通过一个对象注入
0模块就是入口
webpack通过 __webpack_require__引入模块，__webpack_require__ 是我们用的require被webpack封装了一层


## 如何配置单页应用，多页应用。webpack的入口文件怎么配置，如何实现分模块打包（多入口）,多个入口怎么分割。
webpack单页应用，entry入口指定单页应用的入口即可；

多页面应用，webpack的AutoWebPlugin完成简单自动化的构建，前提是项目目录结构符合预设的规范。
- 每个页面都有公共的代码，如公共的css样式表。可以抽离出来，避免重复加载
- 页面可能不断追加，所以入口配置足够灵活，避免每次添加新页面要修改构建配置。

## webpack-dev-server热更新HMR的原理
热替换HMR，不用刷新浏览器就可以用变更的模块代替旧模块。

1. 在webpack的watch模式下，watch监听到文件系统中的文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的Javascript对象保存在内存中；
2. webpack-dev-server（主要是中间件webpack-dev-middleware）和webpack之间的接口交互，中间件调用webpack的API对代码变化进行监控，并告诉webpack，将代码打包到内存中
3. webpack-dev-server对文件变化的监控，当在配置中
4. webpack-dev-server，通过sockjs，在c/s之间建立一个websocket长连接，将webpack编译打包各个阶段的状态信息告知浏览器，同时也包括3中Server监听静态文件变化的信息。浏览器根据socket消息进行不同操作，server传递的最主要信息是新模块的hash值，后面的步骤根据这一hash值进行模块热替换。

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
使用import时，webpack对node_modules里的依赖会做什么；

## webpack 动态 import 是如何实现的
import是动态加载的，只有使用的时候才回去加载；require是声明了就会加载，即webpack遇到require就会把它当成一个模块加载到bundle的依赖里。

import()动态加载的打包结果：
  除了正常的bundle外，还可以看见一个 0.bundle.js，这就是我们动态加载的模块。这个文件将我们import的模块放进了一个单独的js文件中。
  原理是利用jsonp的实现原理加载模块，只是这里并不是从server拿数据，而是从其他模块中拿数据：
  1. 调用模块时，在window上注册一个 webpackJsonp 数组，window['webpackJsonp'] = window['webpackJsonp'] || []
  2. 当我们import时，webpack会调用__webpack_require__.e(0) 方法，也就是 requireEnsure
  3. webpack会动态创建一个script标签去加载这个模块，加载成功后会将该模块注入到webpackJsonp中
  ```javascript
  (window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [0],
  {
    './node_modules/css-loader/dist/runtime/api.js': function(
      module,
      exports,
      __webpack_require__
    ) {
      'use strict';
      eval(`
        ...
      `);
    },

    './src/style/index.css': function(module, exports, __webpack_require__) {
      eval(`
        exports = module.exports = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(false));
        exports.push([module.i, \`body {
          width: 100%;
          height: 100vh;
          background-color: orange;
        },"\`]
      `);
    }
  }
  ]);
  ```
  4. webpackJson.push会调用webpackJsonpCallback拿到模块
  5. 模块加载完(then)再使用__webpack_require__获取模块

import()内部调用promises，该函数返回Promise对象

### webpack-chain
方式更灵活，尝试通过提供可链式或顺流式的 API 创建和修改 webpack 配置。API 的 Key 部分可以由用户指定的名称引用，这有助于跨项目修改配置方式的标准化。

### tree-shaking
如何使用：
1. 确保代码是 ES6 格式，模块化
2. package.json中，设置 sideEffects ?
3. 确保 tree-shaking 的函数没有副作用
4. babelrc中设置presets:  [["@babel/preset-env", { "modules": false }]] 禁止转换模块，交由webpack进行模块化处理
5. 结合 uglyfy-webpack-plugin

webpack4中不需要做这些了，因为 webpack 在生产环境已经帮我们默认添加好了，开箱即用


webpack 配置文件中的UMD

一般怎么组织CSS（Webpack）
项目如何管理模块
webpack整个生命周期
webpack执行的过程
Webpack的编译原理、构建流程

dev-server是怎么跑起来
打包时Hash码是怎么生成的
随机值存在一样的情况，如何避免

sourcemap原理是什么？

如何自己实现一个文件打包，比如一个JS文件里同时有ES5 和ES6写的代码，如何编译兼容他们

  1. vue-cli脚手架搭建 和 功能配置 vue.config.js
  3. 项目构建 打包
  1. 项目分类; 各类文件整理,分类
  2. 各类功能封装
  3. 组件和功能模块的抽离, 解耦, 复用；模块化, 组件化开发能力

项目构建
1. 理解 npm、 yarn依赖包管理的原理，两者的区别
2. 可以使用 npm运行自定义脚本

## webpack编译流程
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程，
1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。