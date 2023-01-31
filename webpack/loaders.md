## loader，加载器
webpack只支持Javascript和JSON类型，所以提供loader让webpack拥有了加载和解析非Javascript文件的能力，帮助webpack去处理其他不支持的文件类型，并将它们转化为有效模块，以供应用程序使用，以及被添加到依赖图中。

webpack把一切文件都当作模块处理，如果要把其他文件也打包，就会用到loader。Javascript代码，CSS，fonts和图片等资源通过合适的loader都可以被处理。通过使用不同的loader，webpack有能力调用外部的工具或脚本，实现对不同格式文件的处理，如分析转换scss为css，或者把es6的高级语法转换为现代浏览器兼容的JS文件。

1. 配置

loader在module.rules中配置，作为文件模块的解析规则存在，类型为数组，每一项是一个object，描述对于什么类型的文件（test),使用什么加载（loader),和使用的参数（options）
`module: { rules: [{test: /\.vue$/,loader: 'vue-loader',options: vueLoaderConfig}]}`

2. 常见的loader:
- vue-loader, 解析和转换 .vue 文件，**提取**出其中的逻辑代码script、样式代码style、以及HTML 模版template，再分别把它们交给对应的 Loader 去处理（template/js/style转换成js模块）

用途：js可以写es6、style样式可以scss或less、template可以加jade等

- file-loader，图片、字体、视频等静态资源打包，把文件输出到一个文件夹中，代码中通过相对URL去引用输出的文件
- url-loader，类似于file-loader，在文件很小（文件低于限定值）的情况下转base64，以base64的方式把文件内容注入到代码中
- image-loader，加载并压缩图片文件
- babel-loader，处理ES6+语法，将其编译为浏览器可执行的js语法
- vue-loader，支持.vue文件的加载和解析
- css-loader，支持.css文件的加载和解析，加载CSS，支持模块化，压缩，文件导入等
- less-loader/sass-loader，将sass/less文件转换成css
css-loader原理,过程
webpack配sass需要哪些loader，配css需要哪些loader

- style-loader，把CSS代码以style标签插入到html文件中，注入Javascript中，通过DOM操作去加载CSS
- eslint-loader，通过ESLint检查Javascript代码
- source-map-loader,加载额外的Source Map文件，以方便断点调试

- ts-loader，将TS转换成JS
- raw-loader，将文件以字符串的形式导入

3. loader的配置
Loaders需要单独安装，且需要在webpack.config.js的modules关键字下进行配置，Loaders的配置包括以下几方面：
<!-- - text:一个用以匹配loaders所处理文件的扩展名的正则表达式（必须）
- loader: loader的名称（必须）
- include/exclude: 手动添加必须处理的文件/文件夹，或屏蔽不需要处理的文件/文件夹（可选）
- query: 为loaders提供额外的设置选项（可选） -->
loader有两个属性：
- test: 一个用以匹配loaders所处理文件的扩展名的正则表达式（必须）
- use：文件转换使用的loader

### css在webpack中的配置
可以用css去写样式，也可以使用高级的stylus，less，sass等预编译器。
- css-loader,使你能够使用类似@import和url(...)的方法实现require()的功能
- style-loader，将所有计算后的样式加入页面中

两者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中

首先安装对应的loader，安装好后，在module.exports里配置。

**CSS modules**技术，把模块化的思想带入CSS，通过CSS模块，所有的类名，动画名默认只作用于当前模块。
```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        {
            loader: "style-loader"
        }, {
            loader: "css-loader",
            options: {
                modules: true, // 指定启用css modules
                localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
        }
      ]
    }
  ]
}
```
详见官方文档
**CSS预处理器**
Sass和Less之类的预处理器是对原生CSS的扩展，它允许你使用类似variables,nesting,mixin,inheritance等特性来写CSS，CSS预处理可以将这些特殊类型的语句转化为浏览器可识别的CSS语言。使用相应的loaders(Less Loadee,Sass loader, stylus loader)

**autoprefixer**自动添加前缀

注：**如果要在dist目录下将css和html分离，引入extract-text-webpack-plugin,webpack4使用mini-css-extract-plugin**

[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

原来的webpack配置里，是css in js的，即打包时css是打包在js里的，所以引入了mini-css-extract-plugin插件，将css从里面剥离出来。


### js在webpack中的配置
随着es6的普及，es6的使用非常广泛，但很多浏览器不支持es6,因此需要引用babel来把es6的代码编译为es5
安装babel及其依赖
在module.exports中进行配置
根目录下新建 .babelrc，进行配置

### 图片资源在webpack中的配置
file-loader

3. loader的执行顺序为什么是后写的先执行

## 进阶： 写一个loader
loader把读到的源文件的内容转义成新的文件内容，且每个loader通过链式操作，把源文件一步步翻译成想要的样子。
要遵循单一原则，即一个loader只做一种“转义”工作。
每个loader拿到的是源文件内容，以通过返回值的方式将处理后的内容输出，也可调用this.callback()方法，将内容返回给webpack，还可以通过this.async生成一个callback函数。还有提供的loader-utils工具函数集

webpack loader是webpack为了处理各种类型文件的一个中间层。webpack本质上就是一个mode模块，不能处理js以外的文件。loader就帮webpack做了一层转换，把所有文件转成字符串，可以对字符串进行任意操作/修改，然后返回给webpack一个包含这个字符串的对象，让webpack进行后续处理。

一个 Loader 的职责是单一的，只需要完成一种转换。如果一个源文件需要经历多步转换才能正常使用，就通过多个 Loader 去转换。在调用多个 Loader 去转换一个文件时，每个 Loader 会链式的顺序执行， 第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果会传给下一个接着处理，最后的 Loader 将处理后的最终结果返回给 Webpack。

所以，在你开发一个 Loader 时，请保持其职责的单一性，你只需关心输入和输出。