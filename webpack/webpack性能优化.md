
前端项目的性能优化：

vue有很多页面，用vue-router配置路由，打包好项目后，页面打开很慢，使用路由懒加载，进入哪个页面，加载哪个页面

webpack:
  - 优化图片，使用 base64 代替小图
  - file name with hash (etag)

production阶段：
- 开启所有的优化代码
- 更小的bundle大小
- 去除掉只在开发阶段运行的代码
- Scope hoistion和Tree-Shaking
- 自动启用uglifyjs对代码进行压缩
- 按需加载

## webpack优化前端性能
优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。
- 压缩删除多余的代码，注释，简化代码的写法等，UglifyJSPlugin,ParallelUglifyPlugin压缩JS文件；optimise-css-assets-webpack-plugin压缩css
- 利用CDN加速，在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。利用webpack的output参数和各个loader的publicPath参数来修改资源路径
- Tree Shaking,将代码中永远不会走到的片段删除掉。在启动webpack时追加参数 --optimize-minimize来实现。使用tree-shaking和scope hoisting来删除多余代码
- Code Splitting，将代码按路由维度或组件分块，这样做到按需加载，同时充分利用浏览器缓存
将代码分块，（目的是为了利用缓存），需要某个代码块时再加载它，还可以利用缓存，下次用到时直接从缓存读取
  - 分离业务代码和第三方库，第三方库不太更新，利用缓存来加载
  - 按需加载（import()),访问某个路由时再加载对应组件。尤其是用户权限只能访问某些页面时，没必要加载无权限的页面
- 提取公共第三方库，SplitChunksPlugin插件（webpack4)进行公共模块提取，利用浏览器缓存可以长期缓存这些无需频繁变动的公共代码

移除了commonchunck插件，改用optimization属性进行更灵活的配置——optimize.splitChunks

找到依赖2次以上的模块，移到vendor chunk里，比如app.js和vendor.js中，都引用了vuex和axios，移到vendor chunk里。

```javascript
module.exports = {
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: true, // [new UglifyJsPlugin({...})]，production模式下自动为true
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  }
}
```
manifest——当编译器开始执行、解析和映射应用程序时，会保留所有模块的详细要点，这个数据集合成为Manifest，当打包完成并发送到浏览器时，会在运行时通过manifest来解析和加载模块。
通过使用manifest中的数据，runtime能查询模块标识符，检索出背后对应的模块。

用新的CSS文件提取插件mini-css-extract-plugin(以前是ExtractWebpackPlugin)
处理CSS文件提取，单独打包
```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
          "css-loader"
        ]
      }
    ]
  }
}
```
生产环境下：
```javascript
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
    ],
    splitChuncks: {
        cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.scss|css$/,
          chunks: 'all',    //将多个css chunk合并成一个css文件 merge all the css chunk to one file
          enforce: true
        }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/app.[name].css',
      chunkFilename: 'css/app.[contenthash:12].css'  // use contenthash *
    })
  ]
  ....
}
```
NoEmitOnErrorsPlugin- > optimization.noEmitOnErrors（默认情况下处于生产模式）
ModuleConcatenationPlugin- > optimization.concatenateModules（默认情况下处于生产模式）
NamedModulesPlugin- > optimization.namedModules（在开发模式下默认开启）

1. 利用打包工具，如webpack打包压缩代码
<!-- webpack的配置,loader解析器只解析我们需要解析的代码，如babel-loader，最常见的优化，是用include和exclude来帮我们避免不必要的转译，如node_modules依赖 -->

<!-- 配置loader时，使用缓存设置，将loader转译结果缓存至文件系统，loader: 'babel-loader?cacheDirectory=true -->

可借助webpack-bundle-analyzer代码压缩结果图形化展示工具，分析打包后的chunk，看看哪些代码体积比较大（第三方库占体积大）。它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; module.exports = { plugins: [ new BundleAnalyzerPlugin() ] }
```

### Tree-Shaking —— webpack --optimize-minimize 进行压缩
作用：删除项目中的冗余代码和废弃代码，Tree-Shaking插件基于import/export语法，可以在编译过程中获悉哪些模块没有真正被使用，这些没用的代码在最后打包时会被去除。

webpack默认es6规范编写的模块都能使用tree-shaking。

如何才能生效：

可以将这句写到package.json的scripts字段，通过npm start来自动执行。可以在生产环境的webpack.config.js里配置插件
在tree-shaking触发打包后，仅仅是撇开了模块的引用，但还是要结合压缩工具来进行，这才是完整的一次tree-shaking

工作原理：

--optimize-minimize的底层实现是一个UglifyJsPlugin（webpack4已经内部配置，删除代码中的console 语句 注释的语句 以及空格等）

```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  plugins:
   [ new UglifyJsPlugin({
     // 允许并发
     parallel: true,
      // 开启缓存
      cache: true,
       compress:
       { // 删除所有的console语句
        drop_console: true
        },
        output: {
            // 不保留注释
            comment: false, // 使输出的代码尽可能紧凑
            beautify: false
        }
      })
   ]
}
```
<!-- ## 提高webpack的打包速度
- 外部扩展（externals）,将不怎么需要更新的第三方库脱离webpack打包，不被打入bundle中，从而减少打包时间
- happypack/thread-loader，利用进程并行编译loader，利用缓存使rebuild更快
- dll，DllPlugin和DllReferencePlugin引入dll，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费资源。
- 利用缓存，webpack.cache，babel-loader.cacheDirectory都可以利用缓存提高rebuild效率
- 缩小文件搜索范围，如babel-loader，可以用include: path.resolve(__dirname,'src'),效率提升有限，一般要exclude node_modules

## 提高webpack构建速度
- externals，提取常用库
- 多入口情况下，使用CommonsChunksPlugin提取公共代码
- happypack多线程加速编译
- DllPlugin和DllReferencePlugin预编译资源模块，对引用了但绝不会修改的npm包进行预编译，再用DllReferencePlugin将预编译的模块加载进来。
- webpack-uglify-parellel多核压缩来提升uglifyPlugin的压缩速度
- 使用tree-shaking和scope hoisting来删除多余代码 -->

### 去除build文件中的残余文件
添加hash后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，可以使用clean-webpack-plugin

### externals + CDN
将这部分代码拆出去，用CDN引入
```javascript
configureWebpack: (config) => {
  config.externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    echarts: 'echarts',
    moment: 'moment',
    'element-ui': 'ELEMENT',
    vant: 'vant',
  }
}
```
可用CDN外链方式引入，在index.html中script
```html
<html>
  <head>
     <link
      rel="stylesheet"
      href="https://static.fanneng.com/static/comments/element/2.13.0/element-ui.css?download=0"
    />
    <link
      rel="stylesheet"
      href="https://static.fanneng.com/static/comments/vant/2.5/index.css?download=0"
    />
  </head>

  <body>
    <script src="https://static.fanneng.com/static/comments/vue/2.6.10/vue.min.js"></script>
    <script src="https://static.fanneng.com/static/comments/vue-router/3.1.3/vue-router.min.js"></script>
    <script src="https://static.fanneng.com/static/comments/element/2.13.0/element-ui.js"></script>
    <script src="https://static.fanneng.com/static/comments/vant/2.5/vant.min.js"></script>
    <script src="https://static.fanneng.com/static/comments/echarts/4.5.0/echarts.min.js"></script>
  </body>
</html>
```

## Scope Hoisting： 作用域提升,让webpack打包出来的代码文件更小

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
}
```