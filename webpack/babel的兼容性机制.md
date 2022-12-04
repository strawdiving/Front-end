# polyfill（用于处理api层）
@babel/preset-env对于一些内置函数promise，或实例方法无法进行转换，这时候就需要polyfill来填补。根据不同浏览器或不同环境下的差异，让新的内置函数、实例方法等在低版本浏览器中也可以使用。

@babel/polyfill模块包含 core-js 和一个自定义 regenerator runtime，用于模拟完整的ES2015+环境。如Promise这样的新内置函数，Array.prototype.includes这样的实例方法，以及generator函数。

- core-js是对ES6+的新特性API提供的polyfill的库，以适配低版本浏览器。

- regenerator runtime，定义生成器函数被babel转译后要调用的方法，因为都是在代码执行时用到的，所以要安装在dependencies中。因为babel 对async/await, yield这样的生成器函数代码转译为在执行时需要调用 regeneratorRuntime方法，该方法就定义在regenerator runtime中，其实就是babel对regenerator runtime的依赖引用。

自Babel 7.4.0起。 @babel/polyfill 已废弃，在我们模拟完整 ES2015+环境的入口文件中，取而代之的是直接包含`core-js/stable`(polyfill ECMAScript功能)以及` regenerator-runtime/runtime`（用于转译generator函数）

```javascript
// Vue中的main.js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

## @babel-polyfill
是一个运行时包，主要通过核心依赖 core-js@2 来完成对应浏览器不支持的新的全局和实例api的添加。升级到 core-js@3后，如果还要保留@babel/polyfill的使用，就要在@babel/polyfill中添加core-js@2 和core-js@3的切换选项，需要包含core-js@2和3两个包。出于这个原因，官方决定弃用
@babel/polyfill。

- 1. 采用@babel/preset-env的polyfill方案

不需要@babel/polyfill的安装为前提，只需要安装core-js（regenerator-runtime会在安装@babel/preset-env的时候自动安装），然后通过设置useBuiltIns选项来开启对api的兼容性处理。

- 2. 不依赖@babel/preset-env提供的处理api兼容性的能力，直接使用@babel/polyfill来处理。如果使用了core-js@3，则需要做如下的替换工作：
  ```javascript
  // before
  import "@babel/polyfill";

  // after
  import "core-js/stable";
  import "regenerator-runtime/runtime";
  ```

## useBuiltIns
@babel/preset-env主要作用是用来转换那些已被正式纳入规范的语法，对还在提案中的语法还无法处理，需要另外安装plugin处理。

@babel/preset-env另一功能是对api的处理，也就是在代码中引入polyfill。@babel/preset-env提供`"useBuiltIns"`配置，来设置 polyfill 引入的方式：
- usage是按需引入
- entry是全部引入

### usage
当设置为`usage`时，实际上针对最后一个版本的浏览器应用优化，只会加载代码中用到的polyfill。

代码中不用主动import，Babel将检查你的所有代码，查找目标环境中缺少的功能，自动将代码里用到的且browserslist环境不支持的polyfill导入，并仅包含所需的polyfill。

```javascript
Promise.resolve().finally()
// 会编译成
require("core-js/modules/es.promise/finally")
Promise.resolve().finally()
```
如果你明确知道需要polyfill的那些功能，可以直接从 core-js 中引用。
### entry
如果没有将`env`preset的`useBuiltIns`设为`usage`，我们必须在入口起点的其他代码之前先完整polyfill一次，即`“useBuiltIns”: "entry"`。

需要在代码运行之前导入，根据浏览器版本的支持情况（target属性或browserslist配置），将browserslist环境不支持的所有polyfill都导入。这样babel就只会在入口处导入所有polyfill，不会在代码再单独添加polyfill代码。
```javascript
import "core-js/stable";
import "regenerator-runtime/runtime";

const result = [1, 2, 3, 4, 5].copyWithin(0, 3)

const instance = new Promise((resolve, reject) => {
  resolve(123)
})
```
### false
只做了代码转换，不会导入任何polyfill进来，且corejs配置将无效。

## corejs属性
@babel/preset-env主要依赖 core-js 来处理api的兼容性。当设置了 useBuiltIns 选项（不为false）时，就会使用core-js来对api进行处理。

@babel/preset-env升级到 7.4.0 以上版本后，同时支持core-js 2和3，所以增加了corejs的配置来控制所需的版本。如果设置了useBuiltIns（不为false）就要设置 corejs属性。

可设置为2或3，建议设置为3，因为新特性都会添加到core-js@3，core-js@2分支已冻结，不再添加新特性。例如，Array.prototype.flat()，"foobar".includes("foo") 之类的实例方法仅适用于 core-js@3。但core-js@3可以使用core-js@2的功能。

如果需要 polyfill，可以直接导入 "core-js" 或使用 @babel/preset-env 的 useBuiltIns 选项。

### core-js
**core-js是api兼容实现的提供者。**

core-js是JS的模块化标准库，包括了ECMAScript到2021年的新api的向后兼容实现。它和babel高度集成，是babel解决新特性在浏览器中兼容问题的核心依赖。

目前core-js版本是3.x，和core-js@2相比有很大调整。

- corejs: 2，只支持Promise和静态属性（例如 Array.from），
- corejs: 3，还支持实例属性 instance properties (如[].includes)。

1. core-js@2
core-js@2被@babel/polyfill，@babel/preset-env，@babel-runtime-corejs2引入来进行新api的兼容处理，包括两个核心模块：
- library：不污染全局的runtime模块，供@babel-runtime-corejs2引入
- modules：污染全局的polyfill模块，供@babel/polyfill，@babel/preset-env引入

不污染全局的runtime模块，主要采用模拟替换api的方式解决兼容性问题；污染全局的polyfill模块主要采用在全局和实例上添加api的方式解决兼容性问题。

2. core-js@3
放弃了对@babel/polyfill的支持，被@babel/preset-env，@babel-runtime-corejs3引入来进行新api的兼容处理。

因为core-js@2包的体积太大（2M），且很多重复的文件被引用，所以core-js@3对包进行拆分，其中两个核心的包分别是：
- core-js，污染全局的polyfill包，供@babel/preset-en使用，执行npm install core-js时安装，等价于 core-js@2中的modules
- core-js-pure，不污染全局的runtime包，供@babel-runtime-corejs3使用，在安装@babel/runtime-corejs3的时候自动安装，等价于core-js@2中的core-js/library

## @babel/plugin-transform-runtime
是为了方便@babel/runtime的使用。通过ast的分析，自动识别并替换代码中的api，解决手动require的烦恼。

@babel/plugin-transform-runtime的特点：
- 实现对helper函数的复用，解决转译语法层时出现的代码冗余
- 解决转译api层出现的全局变量污染

1. 解决编译后的（helper函数）重复定义的问题

@babel/preset-env在处理语法转换的时候，Babel使用非常小的helper来处理常见的功能，如_extend,_createClass，默认情况下，这将添加到每个需要它的文件中，导致多个文件都会有重复的辅助函数，这不利于体积的优化，这种重复有时候是不必要的。例如，如果多个文件中使用了class，则会插入多个_classCallCheck函数。

该插件会开启对Babel注入的helper函数的复用，以节省代码体积。所有的helper都将引用 @babel/runtime 模块（中的helper函数）以避免编译输出的重复。相关的helper函数是以require的方式引入而不是被直接插入进来的，这样就不会冗余了。

要和@babel/runtime搭配使用，所以需要安装@babel/runtime，也是运行时依赖。runtime将编译到构建build中。

```javascript
// 添加@babel/plugin-transform-runtime plugin 前

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sourceCode = "[1, 2, 3].map(n => n+1)";

var Student = /*#__PURE__*/_createClass(function Student(name, age) {
  _classCallCheck(this, Student);

  this.name = name;
  this.age = age;
});
```

```javascript
// 加了@babel/plugin-transform-runtime plugin后
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var sourceCode = "[1, 2, 3].map(n => n+1)";

new _promise.default(function (resolve, reject) {
  resolve(100);
});
var Student = /*#__PURE__*/(0, _createClass2.default)(function Student(name, age) {
  (0, _classCallCheck2.default)(this, Student);
  this.name = name;
  this.age = age;
});

```

```javascript
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false, // false,2,3，默认是false
        "helpers": true,
        "regenerator": true,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```
该插件默认假设所有polyfillable的 API 都将由用户提供，即corejs默认为false。否则需要指定 corejs 选项。

corejs指定一个数字，将需要polyfillable的APIs 的helpers 覆盖为  来自指定的主版本的core-js的reference helpers。

2. 这个插件的另一个目的，是为代码创建一个沙盒环境，可以解决全局变量污染问题

因为polyfill引入是全局引入，polyfill会在全局作用域和类似String这样的内置对象的原型上添加对象或方法。如果直接导入core-js或 @babel/polyfill 以及它提供的 Promise、Set 和 Map 等内置函数，会污染全局作用域。例如，Array.from等会修改这些全局对象的原型prototype，这也会造成全局对象的污染。

```javascript
  require("core-js/modules/es.object.to-string");

  require("core-js/modules/es.promise");

  new Promise(function (resolve, reject) {
    resolve(100);
  });
```
@babel/preset-env在处理Promise这种的api时，只引入了core-js中的相关的js库，这些库重新定义了Promise，然而将其挂载到了全局。

虽然这对于应用程序或命令行工具来说可能没问题，但如果您的代码是打算发布以供其他人使用的库，或者您无法完全控制代码运行的环境，那么它就会成为一个问题。The transformer will alias these built-ins to core-js 因此你可以无缝使用他们，无需使用polyfill。

- core-js aliasing：类似引入helper函数的方式，从@babel/runtime-corejs3包中按需引入函数，
- helper aliasing；
- regenerator aliasing；

解决方式：将core-js交给plugin-transform-runtime处理。
```javascript
{
    "presets": [
        ["@babel/preset-env"]
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime",{
            "corejs":3
        }]
    ]
}
```
将core-js这个属性添加到@babel/plugin-transform-runtime这个插件的配置下，让这个插件处理，同时也不需要配置useBuiltIns了，因为在babel7中已经将其设置为默认值（transform-runtime是利用plugin自动识别并替换代码中的新特性，检测到需要哪个就用哪个）

  ```javascript
  // 用了 @babel/plugin-transform-runtime
  var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

  new _promise.default(function (resolve, reject) {
    resolve(100);
  });
  ```
 这时的代码没有在全局添加一个promise，而是定义了一个_promise['default']方法，这样就不会出现全局污染的情况。

缺点：
- 每个特性都会经历检测和替换，随着应用增大，可能会造成转译效率不高。

默认情况下，@babel/plugin-transform-runtime 不会polyfill proposals。 如果您使用的是 corejs: 3，您可以通过使用 proposals: true 选项来选择加入。

## @babel/runtime
在使用@babel/preset-env提供的语法转换和全局api添加的功能时，难免会造成文件的体积增加以及api的全局污染，为解决这类问题，引入了runtime的概念。**runtime的核心思想是以模拟替换的方式来解决兼容性问题。**

runtime包有三个：
- @babel/runtime，只能处理语法替换
- @babel/runtime-corejs2，比runtime增加了core-js@2来模拟全局api，2仅支持全局变量（例如Promise）和静态属性（例如Array.from）
- @babel/runtime-corejs3，相比runtime-corejs@2，可以模拟实例上的api（例如[].includes），同时支持对ECMAScript提案的api进行模拟

三个包都依赖helpers、regenerator-runtime模块来实现语法的模拟替换，helpers中提供了一些语法模拟的函数，regenerator-runtime中实现了async/await语法的转换。

注：只有在@babel/preset-env的帮助下，runtime包的语法模拟替换功能才会发挥作用。

@babel/runtime-corejs2会从core-js中的library模块去加载对应的runtime代码

@babel/runtime-corejs3会从core-js-pure这个包中去加载对应的runtime代码

从runtime-corejs3一个个导入很麻烦，所以需要借助自动导入插件来帮助完成这个工作。

runtime包是语法和api模拟方案的提供者，是运行时依赖，属于项目生产依赖，不是开发依赖，安装时不要使用 -D（--dev)。


总结：

babel处理兼容性有两种方案：
- @babel/preset-env + core-js@3实现语法转换 + 在全局和实例上添加api，支持全量加载和按需加载，简称polyfill方案
- @babel/preset-env + @babel/runtime-corejs@3 + @babel/plugin-transform-runtime实现语法转换 + 模拟替换api，只支持按需加载，我们简称runtime方案。

一个依赖核心包 core-js，一个依赖core-js-pure，优缺点：
- polyfill方案会造成全局污染，且会注入冗余的工具代码helper。优点是可以根据浏览器对新特性的支持度来选择性进行兼容性处理
- runtime方案解决了polyfill方案的缺点，但不能根据浏览器对新特性的支持度来选择性进行兼容性处理。也就是说只要在代码中识别到的api，并且该api也存在core-js-pure包中，就会自动替换，这样一来就会造成一些不必要的转换，从而增加代码体积。

所以，polyfill方案比较适合单独运行的业务项目，如果你是想开发一些供别人使用的第三方工具库，则建议你使用runtime方案来处理兼容性方案，以免影响使用者的运行环境。

如果两种方案都开启，既设置@babel/preset-env里面的useBuiltIns（不为false）+corejs@3，又配置了@babel/plugin-transform-runtime, 会怎么样呢？

像这种情况的话，会优先采用@babel/plugin-transform-runtime的模拟替换api的方案（plugins的优先级高于preset），语法转化还是利用@babel/preset-env提供的能力。preset里面的target能力会实效，最终还是会增加体积


browserslist

在不同前端工具之间共享目标浏览器和Node.js版本的配置。Autoprefixer，Babel等中都有使用。
```javascript
// package.json中
"browserslist": [
    "defaults",
    "not IE 11",
    "maintained node versions"
  ]
// 或 .browserslistrc文件中
# Browsers that we support
defaults
not IE 11
last 2 versions,
not dead
> 1%
maintained node versions
```
开发者使用查询语句如“last 2 versions”来设置版本列表，从而免于手动更新版本。Browserslist 将使用 caniuse-lite 和 Can I Use 的数据进行此查询。Browserslist 将从工具选项、browserslist 配置、browserslistrc 配置、package.json 中的 browserslist 部分或环境变量中获取查询。