## plugin 插件
扩展webpack的功能，让webpack具有更多灵活性。webpack的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API输出结果。可用于bundle文件的优化，资源管理和环境变量注入，运行可在打包的整个周期。

plugins是用来扩展webpack功能的，它们会在整个构建过程中生效，执行相关的任务。
loaders是在打包过程中用来处理源文件的，一次处理一个。
plugins并不操作单个文件，它直接对整个构建过程起作用。

### 使用插件的方法
首先要npm安装。

1. 配置
在webpack配置中的plugins关键字部分配置，plugins是一个**数组**。每一项是一个plugin的实例，参数通过构造函数传入
```javascript
module.exports = {
  ...
  plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究')
    ],
  }

```
常见的plugin:
- SplitChunksPlugin，从v4开始已经移除CommonsChunkPlugin，用optimization.splitChunks取代。作用是提取公共模块，减小bundle体积，优化首屏渲染。
- copy-webpack-plugin，拷贝自定义的静态assets,如/static文件夹中的文件，将文件或文件夹拷贝到构建的输出目录
- mini-css-extract-plugin，从v4开始，代替了ExtractTextWebpackPlugin，将CSS从bundle文件中提取到单独的css文件，以link标签的形式注入到html中，支持按需加载
- html-webpack-plugin，简化html文件创建，创建html文件，将静态文件插入到这个html文件中

- CssMinimizerWebpackPlugin，压缩CSS代码

- webpack-parallel-uglify-plugin，多核压缩，提高压缩速度

dev：
- HotModuleReplacementPlugin,热更新模块
- friendly-errors-webpack-plugin

production:
- UglifyjsPlugin，通过uglifyjs压缩JS代码，从v4开始已经内置
- TerserWebpackPlugin，压缩JS代码，从v5开始已经内置

- optimise-css-assets-webpack-plugin，压缩提取的CSS，对来自不同组件的重复CSS进行重复数据删除
- HashedModuleIdsPlugin：vendor modules没有改变时保持module.id稳定
- optimize.ModuleConcatenationPlugin，使能scope hoisting
- compression-webpack-plugin，压缩文件
- webpack-bundle-analyzer，可视化webpack输出文件的体积

- CleanWebpackPlugin，清理构建目录
- define-plugin：定义环境变量，'process.env'
- NamedModulePlugin，HMR在更新时在console中显示正确的文件名
- no-emit-on-errors-plugin

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

### Html在webpack中的配置——HtmlWebpackPlugin
这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的js文件的新index.html，这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。
配置好后，在终端输入npm run dev后，webpack将我们的html打包好，并自动将js文件引进来了。

这个插件自动完成了我们之前手动做的一些事情，对项目结构要有一定更改：

### 热更新——Hot Module Replacement（HMR）
HMR允许你在修改组件代码后，自动刷新实时预览修改后的效果。只需要做两项配置：
- webpack配置文件中添加HMR插件
- webpack dev server中添加“hot"参数
### 其他静态资源在webpack中的配置
- src下其他的文件直接复制到dist目录下，并不是每个文件都需要打包处理，很多资源可能就直接复制过去，使用**CopyWebpackPlugin插件**
- jquery，lodash等工具库是很多组件会复用的，使用**webpack.ProvidePlugin插件**

## 进阶： 写一个plugin
plugin监听webpack广播的事件，在合适时通过webpack的API改变结果。

## plugin与loader的区别
## webpack里面的插件是怎么实现的

## plugin的运行流程
1. Webpack 通过 Plugin 机制让其更加灵活，以适应各种应用场景。在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
2. Webpack 启动后，在读取配置的过程中会先执行 new BasicPlugin(options) 初始化一个 BasicPlugin 获得其实例。在初始化 compiler 对象后，再调用 basicPlugin.apply(compiler) 给插件实例传入 compiler 对象。插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。并且可以通过 compiler 对象去操作 Webpack。
3. 在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。Compiler 和 Compilation 的含义如下：Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
4. Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
5. 开发插件时需要注意：只要能拿到 Compiler 或 Compilation 对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其它插件监听使用、传给每个插件的 Compiler 和 Compilation 对象都是同一个引用。也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件、有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下一处理流程。

