# 浏览器兼容性
## browserslist
有的package.json文件里的 `browserslist` 字段，或 `.browerserslistrc`文件，指定了项目的目标浏览器的范围。

这个值会被 `@babel/preset-env`和`Autoprefixer`用来确定需要转译的Javascript特性和需要添加的CSS浏览器前缀。

## Polyfill
`useBuiltIns: 'usage'`

一个默认的Vue CLI项目会使用 @vue/babel-preset-app，通过 @babel/preset-env 和 browerserslist 配置来决定项目需要的 polyfill。

默认会把`useBuiltIns: 'usage'`传递给 @babel/preset-env

# HTML和静态资源
## HTML
1. Index文件
`public/index.html`文件是一个会被 `html-webpack-plugin`处理的模板。构建过程中，资源链接会被自动注入。VUE CLI还会自动注入 resource hint (preload/prefetch、manifest、图标链接)以及构建过程中处理的JS和CSS文件的资源链接。

2. Preload
`<link rel="preload">`是一种 resource hint，用来指定页面加载后很快会被用到的资源。所以在页面加载的过程中，我们希望在浏览器开始主体渲染前尽早 preload。

默认情况下，一个 VUE CLI 应用会为所有初始化渲染需要的文件自动生成preload提示。

3. Prefetch
`<link rel="preload">`是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。

默认情况下，一个 VUE CLI 应用会为所有作为 async chunk 生成的Javascript文件（通过动态 import()按需 code splitting 的产物）自动生成prefetch 提示。

Preload/Prefetch 提示会被 `@vue/preload-webpack-plugin`注入，并且可以通过`chainWebpack`的`config.plugin('preload')`和`config.plugin('prefetch')`进行修改和删除。

```javascript
chainWebpack: config => {
    config.plugins
      .delete('prefetch')
      .delete('preload')

    // 或修改选项
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
}
```

Prefetch 链接将会消耗带宽。如果你的应用很大且有很多 async chunk，而用户主要使用的是对带宽较敏感的移动端，那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块。

```javascript
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```
## 处理静态资源
可以用两种方式处理：
- 在Javascript被导入或在 template/CSS中通过相对路径被引用。这类引用会被webpack处理。
- 放置在 public 目录下或通过绝对路径被引用。这类资源会直接被拷贝，不经过webpack的处理。
### 从相对路径导入
当你在Javascript，CSS或.vue文件中使用相对路径（**必须以.开头**）引用一个静态资源时，该资源会被包含进webpack的依赖图中。

在其编译过程中，所有诸如 `<img src="">`、`background:url(...)`和CSS `@import`的资源URL，**都会被解析为一个模块依赖**。

`url(./img.png)` --> 翻译为 `require('./img.png)`
`<img src="./image.png">` --> 编译到 `h('img', { attrs: { src: require('./image.png') }})`

在其内部，我们通过`file-loader`用版本hash值和正确的公共基础路径，来决定最终的文件路径；
再用`url-loader` 将小于4kb的资源内联，以减少http请求的数量。

可以通过chainWebpack调整（url-loader）内联文件的大小限制。

### URL转换规则
- URL是一个绝对路径，它将会被保留不变
- 以`.`开头，**作为相对模块请求被解释且基于文件系统中的目录结构进行解析**
- 以`~`开头，其后的任何内容都会作为一个模块请求被解析。可以引用Node模块中的资源。
- 以`@`开头，也会作为一个模块请求被解析。用处在于VUE CLI默认会设置一个指向 `<projectRoot>/src`的别名（alias） (仅作用于模版中)

### public 文件夹
任何放置在public文件夹的静态资源都会被简单的复制，而不经过webpack。需要通过绝对路径来引用他们。

推荐将资源作为模块依赖图的一部分导入，webpack会：
- 脚本和样式表会被压缩并打包到一起，从而避免额外的网络请求
- 文件丢失会直接在编译时报错，而不是到了用户端才产生404错误
- 最终生成的文件名包含了内容hash，不必担心浏览器会缓存它们的老版本

public目录提供的是一个应急手段，当通过绝对路径引用它时，留意应用将会部署到哪里，如果应用未部署在域名的根部，则需要为URL配置 publicPath 前缀

- 在 public/index.html 或其他通过 html-webpack-plugin 用作模板的HTML文件中
```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico>
```
- 在模板中，首先需要向你的组件传入基础URL
```javascript
data() {
    return {
        publicPath: process.env.BASE_URL
    }
}
```
```html
<img :src="`${publicPath}my-img.png`">
```
#### 何时使用public文件夹
- 需要在构建输出中指定一个文件的名字
- 有上千的图片，需要动态引用它们的路径
- 有些和webpack不兼容的库，只能通过< script >引入

# CSS相关
