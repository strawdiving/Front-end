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

## loader，加载器
让webpack拥有了加载和解析非Javascript文件的能力。webpack把一切文件视为模块，但webpack原生只能解析js文件，如果要把其他文件也打包，就会用到loader

1. 配置

loader在module.rules中配置，作为文件模块的解析规则存在，类型为数组，每一项是一个object，描述对于什么类型的文件（test),使用什么加载（loader),和使用的参数（options）
`module: { rules: [{test: /\.vue$/,loader: 'vue-loader',options: vueLoaderConfig}]}`

2. 常见的loader:
- vue-loader,解析和转换 .vue 文件，**提取**出其中的逻辑代码script、样式代码style、以及HTML 模版template，再分别把它们交给对应的 Loader 去处理
- file-loader,把文件输出到一个文件夹中，代码中通过相对URL去引用输出的文件
- url-loader，在文件很小的情况下以base64的方式把文件内容注入到代码中
- image-loader，加载并压缩图片文件
- babel-loader，ES6转为ES5
- css-loader，加载CSS，支持模块化，压缩，文件导入等
- style-loader，把CSS代码注入Javascript中，通过DOM操作去加载CSS
- eslint-loader，通过ESLint检查Javascript代码
- source-map-loader,加载额外的Source Map文件，以方便断点调试

## plugin 插件
扩展webpack的功能，让webpack具有更多灵活性。webpack的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API输出结果。

1. 配置

在plugins中单独配置，类型为数组，每一项是一个plugin的实例，参数通过构造函数传入
- webpack-parallel-uglify-plugin，多核压缩，提高压缩速度
- mini-css-extract-plugin，CSS提取到单独的文件中，支持按需加载

dev版本：

webpack自带的：
- define-plugin：定义环境变量，'process.env'
- HotModuleReplacementPlugin,热更新模块
- NamedModulePlugin，HMR在更新时在console中显示正确的文件名
- no-emit-on-errors-plugin

加载的：
- html-webpack-plugin，简化html文件创建
- copy-webpack-plugin，拷贝自定义的静态assets,如/static文件夹中的文件
- friendly-errors-webpack-plugin

prod版本：
- uglifyjs-webpack-plugin，通过uglifyES压缩ES6代码
- extract-text-webpack-plugin，将CSS提取到它自己的文件中
- optimise-css-assets-webpack-plugin，压缩提取的CSS，对来自不同组件的重复CSS进行重复数据删除
- html-webpack-plugin，简化html文件创建

webpack自带的：
- HashedModuleIdsPlugin：vendor modules没有改变时保持module.id稳定
- optimize.ModuleConcatenationPlugin，使能scope hoisting
- optimize.CommonsChunkPlugin，split vendor js into its own file

加载的plugin
- compression-webpack-plugin，压缩文件
- copy-webpack-plugin，拷贝自定义的静态assets,如/static文件夹中的文件
- webpack-bundle-analyzer，可视化webpack输出文件的体积

## 进阶： 写一个loader，plugin
loader把读到的源文件的内容转义成新的文件内容，且每个loader通过链式操作，把源文件一步步翻译成想要的样子。
要遵循单一原则，即一个loader只做一种“转义”工作。
每个loader拿到的是源文件内容，以通过返回值的方式将处理后的内容输出，也可调用this.callback()方法，将内容返回给webpack，还可以通过this.async生成一个callback函数。还有提供的loader-utils工具函数集

plugin监听webpack广播的事件，在合适时通过webpack的API改变结果。

## webpack优化前端性能
优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。
- 压缩删除多余的代码，注释，简化代码的写法等，UglifyJSPlugin,ParallelUglifyPlugin压缩JS文件optimise-css-assets-webpack-plugin压缩css
- 利用CDN加速，在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。利用webpack的output参数和各个loader的publicPath参数来修改资源路径
- Tree Shaking,将代码中永远不会走到的片段删除掉。在启动webpack时追加参数 --optimize-minimize来实现
- Code Splitting，将代码按路由维度或组件分块，这样做到按需加载，同时充分利用浏览器缓存
- 提取公共第三方库，SplitChunksPlugin插件（webpack4)（webpack4)进行公共模块提取，利用浏览器缓存可以长期缓存这些无需频繁变动的公共代码

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

## babel原理
babel的转译过程分为3个阶段：
1. 解析Parse（babylon），将代码解析生成抽象语法树（AST），即词法分析与语法分析
2. 转换Transform，对AST进行变换一系列的操作，babel接受得到AST并通过babel-tranverse对其进行遍历，在此过程中进行添加、更新、移除等操作
3. 生成Generate,将变换后的AST再转换为JS代码，使用babel-generator

### 进阶： 如何写一个babel插件

## wepack-dev-server热更新HMR的原理
热替换HMR，不用刷新浏览器就可以用变更的模块代替旧模块。

1. 在webpack的watch模式下，watch监听到文件系统中的文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的Javascript对象保存在内存中；
2. webpack-dev-server（主要是中间件webpack-dev-middleware）和webpack之间的接口交互，中间件调用webpack的API对代码变化进行监控，并告诉webpack，将代码打包到内存中
3. webpack-dev-server对文件变化的监控，当在配置中
4. webpack-dev-server，通过sockjs，在c/s之间建立一个websocket长连接，将webpack编译打包各个阶段的状态信息告知浏览器，同时也包括3中Server监听静态文件变化的信息。浏览器根据socket消息进行不同操作，server传递的最主要信息是新模块的hash值，后面的步骤根据这一hash值进行模块热替换。

## webpack的劣势
## webpack针对模块化做的处理

