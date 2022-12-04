Vite是下一代前端开发和构建工具

基于原生ES-Module的前端构建工具，

在ES6出现之前，我们的代码模块化都是使用的社区规范，如node.js中的CommonJS规范，客户端的AMD、CMD模块化规范

ES6出现后，代码模块化有了语言规范，即ES-Module，是原生js模块化解决方案。

抛弃社区规范，使用语言规范成为前端模块化开发的趋势。

ESM出现之前，由于浏览器缺少JS模块化的机制以及页面加载性能问题，开发者都会打包来构建Web App，期间webpack等打包工具被广泛使用在项目中。

模块化打包工具（webpack,rollup, parcel)的出现，可以解决：
- ES-Module的浏览器兼容性问题
- 模块文件过多导致的频繁发送网络请求的问题
- 资源文件模块化问题

随着项目的维护，项目内部的JS模块越来越多，这些打包工具遇到了性能瓶颈，webpack的大型项目中需要等很长时间才能启动Dev Server，更新文件后，也需要经过一些时间页面才能展示出更新的更改，这非常降低了开发者的效率及开发体验，Vite正是为了提高开发者的开发体验而开发的工具，拥有极速的服务启动，和轻量快速的热更新。

尽管JS生态系统为专业开发人员提供了很多出色的工具，但webpack等逐渐变得复杂和效率低下。

Webpack v.s. Vite
webpack服务启动时间更长，但页面加载性能好于vite

Vite的构建指令，是通过rollup来打包你的代码。rollup对代码模块使用新的标准化格式，这些标准都包含在JS的ES6版本中，而不是以前的CommonJS和AMD.

Vite构建工具提供了快速而精益的开发体验，有很多特性：

- 快速的冷启动
- 即时的模块热更新HMR
- 真正的按需编译
- 对Typescript和JSX的内置支持
- 一条将你的工具与Rollup打包在一起的构建命令

Vite对待源代码和依赖项的机制是不一样的，依赖项在开发过程中很少更改。Vite使用esbuild预打包依赖项。Esbuild是用Go语言编写的一个JS打包器，其打包依赖项的速度比基于JS的webpack和parcel等快10-100倍。

它通过原生ES模块（ESM）提供源代码，让浏览器处理实际的打包工作。

Vite支持HMR，确保在编辑文件时替换相关模块，而不是重建整个包（后者将触发页面重载并重置状态）。与其他打包器不同，Vite在原生ES模块上执行HMR，意味着在编辑文件时只需要处理受影响的模块，这种机制可以让更新时间保持在很低的水平上，而不是随着应用程序的规模增长而线性增长。

1. Webpack如何工作
Webpack是 Bundle-Based Dev Server，dev server的启动方式：
- 从entry开始，分析依赖，bundle依赖（性能瓶颈），同时将入口文件注入到index.html中
- 启动 Webpack-dev-server，等待浏览器访问，问题很明显
  - Dev Server必须等所有模块构建完成，应用越大，启动时间越长
  - 分片的模块也要构建

Vite dev server如何提高性能？

ESM是ES6引入的模块化能力，现已被主流浏览器支持，当import模块时，浏览器就会下载被导入的模块。

Vite的Dev Server基于浏览器原生支持ESM的能力实现的，因此不需要通过Bundler即可加载JS模块，但要求用户的代码必须是ESM模块，而且需要在index.html中使用`<script type="module" src="./main.js"/> `来引入模块。

原理：利用ES6的import会发送请求去加载文件的特性，拦截这些请求，做一些预编译，省去webpack冗长的打包时间。

Vite的启动方式：
- 不经过Bundle，直接启动Dev Server
- 等待浏览器访问文件，当请求文件时，进行对文件那边进行转换返回给浏览器（性能瓶颈）

Vite dev server避免了bundle的性能问题，但是也有一些新问题：
- 文件transform性能
  - 模块转换时尽可能用性能高的工具
  - 缓存transform的结果
- 非ESM模块兼容（TS/JSX）
  - 将非ESM模块转换成ESM，依靠文件类型来辨别模块类型
  - 用esbuild转换TS/JSX，代替TSC/Babel
- Browser ESM 不能加载Node模块
  - 使用es-module-lexer扫描import语法
  - magic-string重写Node模块的引入路径
- Node 模块其他问题
  - Node CJS模块兼容
  - Node模块一般文件数量较多，如果直接加载，一个文件会产生一个请求，导致页面加载性能降低

为解决Node模块的问题，Vite引入了 Pre-Bundle Node 模块方案。

在项目启动前，扫描项目内所使用的node模块，将node模块打包成单个文件，这个操作是耗时的，但是由于Node模块有自己的版本，可以将其写入硬盘，下次启动时如果版本匹配，就可以跳过Pre-Bundle，使用硬盘缓存的结果。Pre-Bundle会生成模块的元信息，通过识别引入的模块对其进行转换，支持了CJS模块的Named Import。

v2版本，esbuild期支持cjs的方案是生成helper函数，兼容性好。vite怎么识别Node模块进行Pre-Bundle呢？vite支持用户自己配置和自动依赖扫描的功能。自动依赖扫描是扫描用户全部代码，并识别其中引入的node模块，由于esbuld性能是rollup的10-100倍，性能也没有造成下降。

## ESM HMR
Vite ESM HMR API 借鉴于 Webpack HMR API，当某个模块发生变化时，不用刷新页面就可以更新对应的模块

boundary代表接受更新的模块。通过注入 helper 函数，给模块引入了 import.meta.hot API，这个API会在浏览器运行时记录boundary与模块之间的映射关系（包含更新执行的回调函数），

当ws接收到某个模块更新信息（boundary和发生更新的模块）时，会发起对更新模块的加载，并且会根据模块的更新信息，从映射关系中查找到更新需要执行的回调函数，执行并传入更新后的模块。这样就可以无需刷新页面就可以更新JS模块了。

### Vite的HMR是如何工作的？
1. 构建模块依赖图
当一个文件请求时，Vite会扫描其中的import语法，记录模块之间的依赖关系（Record Import Chains)

2. 同时，如果发现文件引用了 import.meta.hot时，会注入helper函数，并且模块中含有import.meta.hot.accept的调用，则将模块标记成boundary

3. 当文件变更时，依据模块依赖图寻找boundaries

4. 发送websocket消息到浏览器端，浏览器会重新加载变更模块并执行更新

5. 如果没有查找到boundaries，页面则会重新加载

只吃了ESM Dev Server，但是并不能直接用于生产环境。为了在生产环境获得等好的加载性能，还需要生产构建，对代码进行体积优化（tree-shaking, minify)、chunk合并分割等

## 基于Rollup的Bundle和Plugins.(Bundle,打包)
由于已有的Bundler很成熟且有良好的生态，vite选择在它们的基础上进行用户代码的Bundle。

Rollup同样基于ESM，而且其灵活的Plugin API 以及体积更小、运行速度更快的构建产物显然更合适。但由于其对Web APP的支持度较低，且配置复杂，不利于用户使用。因此Vite内置了开发Web APP 常用的plugins，尽可能让用户可以零配置的使用。
- PostCSS/CSS Modules/CSS Pre-processors
- Assets
- JSON
- TS/JSX

对框架的支持，Vite官方集成了Vue3 (@vitejs/plugin-vue)，且提供了开箱即用的模板供用户选择。
