## loader，加载器
让webpack拥有了加载和解析非Javascript文件的能力。webpack把一切文件视为模块，但webpack原生只能解析js文件，如果要把其他文件也打包，就会用到loader

1. 配置

loader在module.rules中配置，作为文件模块的解析规则存在，类型为数组，每一项是一个object，描述对于什么类型的文件（test),使用什么加载（loader),和使用的参数（options）
`module: { rules: [{test: /\.vue$/,loader: 'vue-loader',options: vueLoaderConfig}]}`

2. 常见的loader:
- vue-loader, 解析和转换 .vue 文件，**提取**出其中的逻辑代码script、样式代码style、以及HTML 模版template，再分别把它们交给对应的 Loader 去处理（template/js/style转换成js模块）

用途：js可以写es6、style样式可以scss或less、template可以加jade等

- file-loader,把文件输出到一个文件夹中，代码中通过相对URL去引用输出的文件
- url-loader，在文件很小的情况下以base64的方式把文件内容注入到代码中
- image-loader，加载并压缩图片文件
- babel-loader，ES6转为ES5
- css-loader，加载CSS，支持模块化，压缩，文件导入等

css-loader原理,过程
webpack配sass需要哪些loader，配css需要哪些loader

- style-loader，把CSS代码注入Javascript中，通过DOM操作去加载CSS
- eslint-loader，通过ESLint检查Javascript代码
- source-map-loader,加载额外的Source Map文件，以方便断点调试

3. loader的执行顺序为什么是后写的先执行

## 进阶： 写一个loader
loader把读到的源文件的内容转义成新的文件内容，且每个loader通过链式操作，把源文件一步步翻译成想要的样子。
要遵循单一原则，即一个loader只做一种“转义”工作。
每个loader拿到的是源文件内容，以通过返回值的方式将处理后的内容输出，也可调用this.callback()方法，将内容返回给webpack，还可以通过this.async生成一个callback函数。还有提供的loader-utils工具函数集