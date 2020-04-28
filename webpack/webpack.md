# 前端工程化-Webpack
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
