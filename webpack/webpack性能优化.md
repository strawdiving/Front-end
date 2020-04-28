## webpack优化前端性能
优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。
- 压缩删除多余的代码，注释，简化代码的写法等，UglifyJSPlugin,ParallelUglifyPlugin压缩JS文件；optimise-css-assets-webpack-plugin压缩css
- 利用CDN加速，在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。利用webpack的output参数和各个loader的publicPath参数来修改资源路径
- Tree Shaking,将代码中永远不会走到的片段删除掉。在启动webpack时追加参数 --optimize-minimize来实现                              
- Code Splitting，将代码按路由维度或组件分块，这样做到按需加载，同时充分利用浏览器缓存
- 提取公共第三方库，SplitChunksPlugin插件（webpack4)（webpack4)进行公共模块提取，利用浏览器缓存可以长期缓存这些无需频繁变动的公共代码
- 使用tree-shaking和scope hoisting来删除多余代码

scope hoisting： 作用域提升,让webpack打包出来的代码文件更小

    代码体积更小，因为函数声明语句会产生大量代码；
    代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。
分析出模块之间的依赖关系，尽可能把打散的模块合并到一个函数中去，前提是不能造成代码冗余。 只有那些被引用了一次的模块才能被合并。
因为要分析模块之间的依赖，所以必须使用ES6模块化语句。

移除了commonchunck插件，改用optimization属性进行更灵活的配置
optimize.splitChunks
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

ExtractWebpackPlugin调整，用新的CSS文件提取插件mini-css-extract-plugin
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
webpack的配置,loader解析器只解析我们需要解析的代码，如babel-loader，最常见的优化，是用include和exclude来帮我们避免不必要的转译，如node_modules依赖

配置loader时，使用缓存设置，将loader转译结果缓存至文件系统，loader: 'babel-loader?cacheDirectory=true

可借助webpack-bundle-analyzer代码压缩结果图形化展示工具看看打包后的项目中，哪些代码体积比较大
它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; module.exports = { plugins: [ new BundleAnalyzerPlugin() ] }
```

删除项目中的冗余代码和废弃代码
Tree-Shaking插件，基于import/export语法，Tree-Shaking可以在编译过程中获悉哪些模块没有真正被使用，这些没用的代码在最后打包时会被去除
webpack默认es6规范编写的模块都能使用tree-shaking。

webpack --optimize-minimize 进行压缩
可以将这句写到package.json的scripts字段，通过npm start来自动执行
--optimize-minimize的底层实现是一个UglifyJsPlugin（webpack4已经内部配置，删除代码中的console 语句 注释的语句 以及空格等）
```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); module.exports = { plugins:
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
 ] }
```

可以在生产环境的webpack.config.js里配置插件
在tree-shaking触发打包后，仅仅是撇开了模块的引用，但还是要结合压缩工具来进行，这才是完整的一次tree-shaking

### 去除build文件中的残余文件
添加hash后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，可以使用clean-webpack-plugin