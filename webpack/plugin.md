## plugin 插件
扩展webpack的功能，让webpack具有更多灵活性。webpack的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API输出结果。

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

## 优化插件
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

## 进阶： 写一个plugin
plugin监听webpack广播的事件，在合适时通过webpack的API改变结果。