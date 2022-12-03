## 什么是Babel
是一个Javascript编译器，是下一代Javascript语法的编译器。

主要用于在当前和旧的浏览器或环境中，将ECMAScript2015+代码转换为JS向后兼容版本的代码。
- 让你使用最新的Javascript代码（ES6，ES7）,不用管新标准是否被当前使用的浏览器完全支持
- 让你能使用基于Javascript进行了扩展的语言，如React的JSX

Babel可以做的主要事情：
- 语法转换
- 对目标环境中缺少的功能补充Polyfill（通过如core-js的第三方polyfill)
- 源代码转换

```javascript
// Babel 输入：箭头函数
[1,2,3].map(n => n+1)
// babel输出：ES5等价语法
[1,2,3].map(function(n) { return n+1 })
```

## babel原理
babel的转译过程分为3个阶段：
1. 解析Parse（@babel/parser，解析器是babylon），主要进行词法分析与语法分析，将代码解析生成抽象语法树（AST）（字符串形式的代码code --> tokens令牌流 --> AST)
2. 转译Traverse，接收AST，通过@babel/traverse（plugins, presets)对其进行遍历，在此过程中对节点进行添加、更新、移除等操作，转换为目标AST语法树。输入为原始AST和自定义的转换规则，返回结果为转换后的AST。plugin是在转译这一步对代码做处理。
3. 生成Generate,将变换后的AST转换为最终的字符串形式的JS代码，同时会创建源码映射。使用@babel/generator，生成过程可以对是否压缩以及是否删除注释等进行配置，并且支持 sourceMap。
### 可调试
支持Source map。可以调试编译过的代码。

使用`@babel/cli`从终端运行Babel，`@babel/polyfill`用于polyfill所有新的Javascript功能，`env`preset只包含我们使用的功能的转换规则，polyfills用于填充目标浏览器中缺少的功能。

网上补充内容：

由于浏览器版本和兼容性问题，很多JS新方法不能使用。而Babel可以让你放心地在当前项目中使用大部分的JS的新的标准的方法，然后编译成兼容绝大多数的主流浏览器的代码。


Babel6.x版本之后，所有插件都是可插拔的。也就是说，安装了Babel后，需要配置对应的.babelrc文件才能发挥完整的作用。
## Babel的配置
想要编译node-modules，用 babel.config.json。
配置仅适用于项目的单个部分，用 .babelrc.json
### babel.config.json
1. 安装 `npm install --save-dev @babel/core @babel/cli @babel/preset-env`
2. 在项目的根目录中创建`babel.config.json` (v.7.8.0及以上版本) 的配置文件；
其中包含

```json
// babel.config.json 或 .babelrc.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "chrome": "67",
          "firefox": "60"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ],
  "plugins": [...]
}
```
```javascript
module.exports = {
  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: "usage",
        corejs: "3.6.4",
      },
    ],
  ]
  const plugins = [...]
  return {
    presets,
    plugins
  }
}
```
还可以在`package.json`中的key `babel`中指定.babelrc.json配置
```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": [ ... ],
    "plugins": [ ... ],
  }
}
```
## Babel的presets和plugins配置
babel将es6+分为：
- 语法层
let, const, class，箭头函数等，这些需要在构建时进行转译，是指在语法层面上的转译，比如class转成 var function...
- api层
Promise, includes, map等，这些是在全局或者Object, Array等的原型上新增的方法，它们可以由相应es5的方式重新定义

babel对这两个分类的转译的做法是不一样的。我们也需要给出相应的配置。

处理const等的插件是默认包含在 @babel/preset-env里的，但是includes等API默认是没有处理它的包的。
###presets

babel从6.0起，就不再对代码进行transform，只负责parse和generate过程，代码的transform过程都交给一个个plugin去做。没有配置plugin的情况下，经过babel输出的代码是没有改变的。

有的环境下可能需要转换几十种不同语法的代码，则需要配置几十个plugin。所以babel提供了预设插件机制preset，presets也是plugins的集合，preset中可以预设置一组插件来便捷的使用这些插件所提供的功能。

官方为常见环境组合了几个预设：
- @babel/preset-env，用于编译ES2015+
- @babel/preset-typescript，用于TypeScript
- @babel/preset-react，用于React
- @babel/preset-floe，用于Flow(静态类型checker)

用的最多的是解析ES6的babel-env-preset和解析JSX的babel-preset-react，在options中添加对应参数处理。官方推荐使用@babel/preset-env进行定义。@babel/preset-env 所包含的插件将支持所有最新的JS特性(ES2015,ES2016等，不包含 stage 阶段)

### 使用预设
在Babel中，如果presets在npm上，可以传入presets的名称，Babel将检查它是否已经安装在node_modules中。这将添加到presets配置选项中。presets接收一个数组。

```json
{
  "presets": ["@babel/preset-env"]
}
```
此外，还可以指定presets的相对或绝对路径
```json
{
  "presets": ["./MyProject/myPreset"]
}
```
presets的排序是倒序，`"presets":["a","b","c"]`，运行顺序是 c, b, a。主要是为了确保向后兼容。

### presets选项
插件和presets都可以通过将名称和选项对象包装在你配置的一个数组内来指定选项。

如果指定可选项，以下都是等效的：
```json
{
  "presets": [
    "presetA", // 单字符串
    ["presetA"], // 包装在数组中
    ["presetA", {}] // 第二个参数是一个空的配置对象
  ]
}
```

若要指定选项，传递一个以键作为选项名称的对象：
```json
{
  "presets":[
    ["@babel/preset-env",
    {
      "modules": false,"loose": true
    }]
  ]
}
```
### preset-env原理
@babel/preset-env可以理解为根据宿主环境版本预设编译生成的代码的版本。比如高版本的现代浏览器已经支持了async/await关键词，编译出的文件就不需要生成Polyfill代码了，直接使用async/await关键词就可以了，这样避免冗余的代码增大代码包体积。

babel运用 browserslist 来设置默认宿主环境版本，默认的仅包含浏览器市场份额大于 0.25% 的用户所需的 polyfill 和代码转换（忽略没有安全更新的浏览器，如 IE 10 和 BlackBerry）。

可以在项目根目录加一个 .browserslistrc 文件，设置 `> 0.5%, last 2 versions, Firefox ESR, not dead`。也可以在targets属性里设置浏览器的版本。

根据浏览器的宿主环境，来决定使用哪些转译plugin。

在presets的options选项里添加 `debug:true`，`Using targets`可以看出配置的个浏览器宿主环境默认的版本是什么，也可以看出针对哪些浏览器使用了哪些plugin `transform-arrow-functions { ie }`，表明如果用了IE浏览器，就需要对剪头函数进行转译。
### 插件
babel的架构设计：功能粒度尽量细，保证babel的高灵活性、强扩展性。

通过在配置文件中应用插件（或presets），可以启用Babel的代码转换。

对每一个你需要的功能或扩展，需要安装另外的包或插件。Babel是用plugins构建的，为了babel有更好的扩展性，也为了更灵活的实现代码编译，babel提供了plugin功能，可以让用户自己实现符合自己需求的编译规则。babel所有的转译规则都是以plugin为基础的，plugin可以更灵活的配置js转译规则，从而扩展代码的转译功能，这些plugins允许你现在就使用新语法，而无需等待浏览器的支持。

可以使用现有plugins编写自己的转换管道pipeline，或编写自己的plugin。

plugins分为
- 语法插件（syntax plugin），语法插件只用于识别语法，但不包含转换语法，一般以@babel/plugin-syntax-开头
- 转换插件（transform plugin），可以对语法进行转换，一般以@babel/plugin-transform-开头
### 使用一个插件
如果插件在npm中，可以传入插件的名称，Babel会检查它是否安装在node_modules中。这将被添加到plugins配置项，该选项接受一个数组。
```json
{
  "plugins": ["babel-plugin-myPlugin", "@babel/plugin-transform-runtime", "@babel/plugin-transform-arrow-functions"]
}
```
也可以指定插件的相对/绝对路径
```json
{
  "presets": ["./MyProject/myPreset"]
}
```
转换类（plugin-transform-xxx)插件可以转译代码。转换类插件将启用相应的语法类插件，如果你已经使用了相应的转换插件，则不需要指定语法插件，因为它会自动启用。
### 插件顺序
如果两次转译都访问了“Program"节点，则转译将按插件或presets的顺序执行：
- plugins在presets之前运行
- plugins排序是从第一个到最后一个
- presets是倒序的，从最后一个到第一个
```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"], // 从前到后的顺序执行
  "presets": ["@babel/preset-env", "@babel/preset-react"] // 从后到前的顺序执行
}
```

插件和预设都可以通过将名称和选项对象包装在数组中来指定配置内的选项。写法类似。

## 进阶： 如何写一个babel插件
## 网上整理资料
- 编译解析的两种方式
  - 编程的方式，@babel/core，在文件中引入@babel/core，调用其中的方法进行编译解析，如transform方法，即其他transform的API。
  ```javascript
    import { transform } from '@babel/core'
    babel.transform('code()', options, function(err, result) {})
  ```
  - 安装@babel/cli，通过命令行触发

为了项目工程化的需要，官方还提供了@babel/cli，开发者可以使用命令行的方式对代码进行转换。提供多种参数来实现编译效果。可以直接将源代码文件进行编译，直接生成目标文件。@babel/cli是依赖于@babel/core和@babel/preset-env的，所以这两个包也必须安装。@babel/core，@babel/preset-env已经满足转译代码的需要，但是当需要转译的代码量非常大的时候，需要一个源代码文件，执行一个命令，直接生成一个转译好的目标文件，而不是一个长长的字符串。

使用指令的方式：`npx babel ./src/testBabel.js --out-file ./src/testBabel-compiled.js --presets=@babel/preset-env`，可以生成转译后的目标文件。

比较好的方式是创建 babel.config.js文件，执行babel命令就可以自动读取该文件里的配置信息。再执行指令 `npx babel ./src/testBabel.js --out-file ./src/testBabel-compiled.js`。从babel7开始babel.config.js相当于全局性配置文件，.babelrc相当于模块的配置文件。

- vue-cli

使用Vue的时候，presets一般是@vue/app，它在@babel/preset-env包含的plugins上又加了很多自定义的plugin。所有的 Vue CLI 应用都使用 @vue/babel-preset-app，它包含了 babel-preset-env、JSX 支持以及为最小化包体积优化过的配置。@vue/babel-preset-app已经默认配置了@babel/plugin-transform-runtime。

vue-cli中的@vue/cli-plugin-babel插件是对babel功能做了封装，里面包含Babel 7、babel-loader和@vue/babel-preset-app，@vue/babel-preset-app就是vue-cli的默认预设选项，实现了vue、babel和webpack的集成。vue-cli也使用了@babel/plugin-transform-runtime插件来优化编译结果。

因为babel-loader很慢，所以webpack官方推荐转译尽可能少的文件（参考），所以vue-cli配置了该loader的exclude选项，将node_modules中的文件排除了，但是这样可能会造成某个依赖出现兼容性问题。

所以，如果你的项目中某个依赖出现了兼容性问题，这可能就是原因。解决办法就是在vue.config.js中配置transpileDependencies这个选项，Babel就会 显式转译这个依赖。见 `@vue/cli-plugin-babel/index.js`

首先要安装依赖，Babel其实是几个模块化的包，
```javascript
npm i --save-dev babel-core babel-loader babel-preset-env
```

babel只能把import语句转换为require语句，这个语句浏览器也不识别，需要webpack对require模块引入问题再次处理。

vue-loader把.vue文件转换为ES6版本的js模块，需要添加babel-loader再对js模块中的代码进行向下兼容的转译。

## babel-core
babel-core是Babel的核心包，包含各个核心API，供 Babel 插件和打包工具使用。

- transform功能：把源码转译为能运行在当前和旧版本的浏览器或其他环境中。

```javascript
// code-要转译的代码字符串，options，可选的babel配置项
babel.transform(code: String, options?: Object)

// 返回一个对象，主要包括三个部分：
// 1. generated code ，生成的代码
// 2. sources map，源映射
// 3. AST， 抽象语法树
```

@babel/core负责解析(parse)，转译(traverse)，产生（generator)，但具体转译为什么版本的js，是要自定义的。

它把转化的功能都分解到一个个plugin里面。没有配置plugin时，babel输出的结果和输入是相同的。

配置：建立babel.config.js文件。babel会自动查找这个文件。

babel还可配置target或者提供.browserlistrc文件，用于指定目标环境，这样能使你的代码体积保持更小

- babel-types
Babel Types模块是一个用于 AST 节点的 Lodash 式工具库，它包含了构造、验证以及变换 AST 节点的方法。该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。
