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
VUE CLI支持 PostCSS, CSS Modules和 Sass, Stylus, Less等预处理器。
## 引用静态资源
所有编译后的CSS都会通过`css-loader`来解析其中的`url()`引用，并将这些引用作为模块请求来处理。即可以根据文件结构使用相对路径来引用静态资源。

**如果要引用一个npm依赖中的文件，或使用webpack alias，需要在路径前加上`"~"`前缀来避免歧义。**

## 预处理器
可以在创建项目时选择预处理器，如果没选，则内置的webpack仍会被预配置成可以完成所有的处理。

可以手动安装相应的webpack loader：sass-loader, less-loader, stylus-loader。然后可以导入相应的文件类型，或在.vue中使用 `<style lang="scss"></style>`
### 自动化导入
如果想要自动化导入文件（用于颜色，变量，mixin...），可以使用`style-resources-loader
## PostCSS
VUE CLI内部使用了PostCSS，可以通过 .postcssrc 或 任何 postcss-loader-config支持的配置源来配置postCSS。也可以通过 vue.config.js 中的 `css.loaderOptions.postcss`配置 `postcss-loader`

默认开启了`autoprefixer`。生产环境中，VUE CLI会优化CSS，并基于目标浏览器抛弃不必要的浏览器前缀规则。因为默认开启了，所以**只需要使用无前缀的CSS规则**即可。

## CSS Modules
可以通过 < style >直接在.vue文件中使用CSS Modules。

如果想在Javascript中作为CSS Modules导入CSS或其他预处理文件，则该文件应该以 `.module.(css|less|sass|scss|styl)`结尾。
```javascript
import styles from './foo.module.css'
```
如果想去掉文件名里的 `.module`，可设置 vue.config.js 中的 `css.requireModuleExtension`为`false`:

```javascript
// vue.config.js
module.exports = {
  css: {
    requireModuleExtention: false
  }
}
```
自定义生成的CSS Module模块的类名：
```javascript
module.exports = {
  css: {
    loaderOptions: {
      css: {
        // 可参考 css-loader v1 文档
        modules: {
          localIdentName: '[name]-[hash]'
        },
        localsConvention: 'camelCaseOnly'
      }
    }
  }
}
```
所有的 css-loader 选项在这里都是支持的。

## 向预处理器Loader传递选项
可以使用 vue.config.js 中的 `css.loaderOptions`选项，向webpack的预处理器loader传递选项。如，向所有Sass/Less样式传入共享的全局变量：
```javascript
module.exports = {
  css: {
    loaderOptions: {
      scss: {
      // 也是用sass-loader，注：sass-loader v7中，该选项名是 "data"
      // 因为有别名 webpack alias,需要加上~来避免歧义
        prependData: `@import "~@/variables.scss"`
      },
      sass: {
      // 注：sass-loader v7中，该选项名是 "data"
      // 因为有别名 webpack alias,需要加上~来避免歧义
        prependData: `@import "~@/variables.sass"`
      }
    }
  }
}
```
Loader可以通过 `loaderOptions`配置，包括：
- css-loader
- postcss-loader
- sass-loader
- less-loader
- stylus-loader

**这样做比使用 chainWebpack 手动指定 loader 更推荐，因为这些选项需要应用在使用了相应 loader 的多个地方。**

# webpack相关
## 简单的配置方式
在 vue.config.js 中的 `configureWebpack` 选项提供一个对象：
```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```
该对象会被 webpack-merge 合并入最终的webpack配置。

如果需要基于环境有条件地配置行为，或想要直接修改配置，就换成一个函数（在环境变量被设置之后懒执行）。该方法的第一个参数会收到已经解析好的配置，在函数内，可以直接修改配置值，或返回一个将会被合并的对象。
```javascript
module.exports = {
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {

    } else {

    }
  }
}
```
## 链式操作
VUE CLI内部的webpack配置是通过 webpack-chain 维护的。这个库提供了一个webpack原始配置的上层抽象，使其可以定义具名的loader规则和具名插件，并在后期有机会进入这些规则并对它们的选项进行修改。

## 修改Loader选项
```javascript
module.exports = {
  chainWebpack: config => {
    config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => { 
      // 修改其选项
      return options
    })
  }
}
```
注： 对CSS相关的loader，推荐使用 css.loaderOptions而不是直接链式指定loader。每种css文件类型都有多个规则，而css.loaderOptions可以确保你通过一个地方影响所有的规则。

## 添加一个新的Loader
```javascript
module.exports = {
  chainWebpack: config => {
    config.module.rule('graphql').test(/\.graphql$/).use('graphql-tag/loader').loader('graghql-tag/loader').end()
    // 再添加一个loader
    .use('other-loader').loader('other-loader').end()
  }
}
```

## 替换一个规则里的Loader
```javascript
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // 清楚已有的所有loader，否则接下来的loader会附加在该规则现有的loader之后。
    svgRule.uses.clear()
    // 添加要替换的loader
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')
  }
}
```

## 修改插件选项
```javascript
module.exports = {
  chanWebpack: config => {
    config.plugin('html').tap(args => {
      return [/* 传递给 html-webpack-plugin's 构造函数的新参数 */]
    })
  }
}
```
需要熟悉webpack-chain的API，以便了解如何最大程度利用好，比起直接修改webpack配置更安全。

# 环境变量和模式
可以替换项目根目录下的下列文件来指定环境变量：
```javascript
.env          # 在所有环境中被载入
.env.local    # 在所有环境中被载入，但会被git忽略
.env.[mode]   # 只在指定的模式中被载入
.env.local.[mode] # 只在指定的模式中被载入,但会被git忽略
```
在这些环境文件中，只包含环境变量的“key-value”对：
```javascript
FOO=bar
VUE_APP_SECRET=secret
```
被载入的变量将会对 vue-cli-service 的所有命令、插件和依赖可用。

**为一个特定模式准备的环境文件（如.env.production）将比一般的环境文件（如.env）拥有更高优先级**

**VUE CLI启动时已经存在的环境变量拥有最高优先级，并不会被 .env 文件覆写**

### NODE_ENV
如果在环境中有默认的 NODE_ENV ,应该移除它或在运行 vue-cli-service命令时明确的设置 NODE_ENV

## 模式
默认地，一个VUE CLI项目有三个模式：
- development，用于 vue-cli-service serve
- production， 用于vue-cli-service build和vue-cli-service test:e2e
- test，用于vue-cli-service test:unit

注：模式不同于 NODE_ENV，一个模式包含多个环境变量。也就是说，每个模式都会将 NODE_ENV 的值设置为模式的名称。如 development模式下，NODE_ENV的值会被设置为“development”

可以通过 `.env`文件增加后缀来设置某个模式下特有的环境变量。如在根目录下创建 `.env.development`文件，则该文件里声明过的变量就只会在 development 模式下被载入。

可以通过传递 `--mode`选项参数为命令行覆写默认的模式，

eg. 有一个.env文件
```javascript
VUE_APP_TITLE=My App
```
.env.staging文件
```javascript
NODE_ENV=production
VUE_APP_TITLE=My App (Staging)
```
- `vue-cli-service build` 会加载可能存在的 .env, .env.production, .env.production.local文件

- `vue-cli-service build --mode staging` 会在staging模式下加载可能存在的.env, .env.staging, .env.staging.local文件然后构建出生产环境应用。

这两种情况，根据NODE_ENV，构建出的都是生产环境应用，但staging版本中，环境变量 process.env.VUE_APP_TITLE 被覆写成了另一个值。

## 在客户端侧代码中使用环境变量
只有以`VUE_APP_`开头的变量会被`webpack.DefinePlugin`静态嵌入到客户端侧的包中，可以在应用的代码中这样访问：`console.log(process.env.VUE_APP_SECRET)`

构建过程中，VUE_APP_SECRET会被相应的值取代。

在应用代码中始终可用的两个特殊变量：
- **NODE_ENV**，会是`development`,`production`,`test`中的一个，具体的值取决于应用运行的模式。
- **BASE_URL**，会和 vue.config.js 中的 `publicPath` 选项相符，即你的应用会部署到的基础路径。

可以在vue.config.js 文件中计算环境变量，仍需要以VUE_APP_前缀开头，如：
```javascript
process.env.VUE_APP_VERSION = require('./package.json').version
```

# 构建目标
当运行`vue-cli-service build`时，你可以通过 `--target` 选项指定不同的构建目标。它允许你将相同的源代码根据不同的用例生成不同的构建。

## 应用
应用模式是默认的模式：
- index.html 会带有注入的资源和resource hint
- 第三方库会被分到一个独立包以便更好地缓存
- 小于4Kb的静态资源会被内联在Javascript中
- public 中的静态资源会被复制到输出目录中

# 部署
Docker容器中使用Nginx部署
Netlify
