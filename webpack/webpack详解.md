
## 1.3 部署webpack
开发时一般会打包的文件类型：
- 发布时需要的html，css,js
- css预编译器stylus,less,sass
- 图片资源png,gif,jpg等
- es6的高级语法
- 文件间的require
- 别名@等修饰符

分别进行配置。
在项目的根目录下新建**webpack.config.js**文件，再新建一个**index.html**文件

```javascript
const path = require('path'); //引入我们的node模块里的path

module.exports = {
    entry: './src/index.js', //入口文件  在vue-cli main.js
    output: {       //webpack如何向外输出
        path: path.resolve(__dirname, 'dist'),//定位，输出文件的目标路径，__dirname总是指向被执行js文件的绝对路径
        filename: '[name].js' //文件名[name].js默认，也可自行配置
    }
 }
```

在index.html文件中写入最基础的html代码，它的目的在于引入打包后的js文件。

在package.json的scripts中添加打包命令；
```javascript
"scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
+  "build": "webpack"
},
```
npm script 可运行webpack，原理是 package.json文件可以读取 node_modules/.bin目录下的命令，耳鸣了是在模块局部安装时创建的软链接。
打包完成后，根目录下会多一个dist文件夹。

1. entry——入口，指定webpack打包入口，仅支持Javascript文件。
output—— 出口，指定webpack文件打包出口，以及命名出口文件。

- path.resolve()，顺序从右向左，如果字符串以/开头，不拼接前面的路径；如果以‘../'开头，拼接前面的路径，且不包含最后一节的路径；若以'./'开头或没有符号，则拼接前面的路径
- path.join：顺序从右向左，只是拼接各个path片段

分为单页面和多页面。

单页面配置：
```javascript
entry: './src/index.js', // 单页面的entry是一个字符串
output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  }
```

多页面配置，[name]中name变量与entry对象的key对应。

```javascript
entry: {  // 多页面下，entry是一个对象
  app: './src/app.js',
  app2: './src/app2.js'
},
output: {
    path: path.join(__dirname, 'dist')
    filename: [name].js,
  }
```
2. mode —— 模式
区分环境是生产、开发还是测试，默认是production

### 别名在webpack中的配置——resolve
### webpack的使用
webpack可以在终端中使用，
```javascript
webpack {entry file} {destination for bundled file} //指定入口文件，和打包文件的存放路径
```
指定入口文件后，webpack将自动识别项目所依赖的其他文件，注意：如果你的webpack不是全局安装的，当你在终端中使用此命令时，需要额外指定其在
node_modules中的地址
```javascript
node_modules/.bin/webpack src/main.js dist/main.js
```

但是终端中进行复杂的操作很不方便，一般通过配置文件来使用webpack。配置文件也是一个简单的Javascript模块，我们可以把所有的与打包相关的信息放在里面。

## 使用webpack构建本地服务器
想让浏览器监听代码的修改，并自动刷新显示修改后的结果，webpack提供了一个可选的本地开发服务器webpack-dev-server，它是一个单独的组件，需要单独安装。
```javascript
npm install --save-dev webpack-dev-server
```
在webpack里创建了一个node进程，通过webpack-dev-server,这个本地服务器基于node.js构建，其内部封装了一个node的express模块，其配置如下：

  devServer是webpack配置选项中的一项，
  - contentBase 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另一个目录下的文件提供本地服务器，应该在这里设置所在目录
  - port 设置默认监听端口，如果省略，则默认为8080
  - hitoryApiFallback，开发单页应用时很有用，它依赖于HTML5 history API，如果设为true，所有跳转将指向index.html
  - inline 设为true，源文件改变时会自动刷新页面
  // webpack.config.js
  ```javascript
  module.exports = {
  ...
devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        port: '8080',
        historyApiFallback: true，// 不跳转
        inline:true, //实时刷新
        before(app) {
            app.get('/api/test.json', (req, res) => {
                res.json({
                    code: 200,
                    message: 'Hello World'
                })
            })
        }
    }  //服务于webpack-dev-server  内部封装了一个express
  }
```
在package.json中的scripts对象中添加命令，用以启动本地服务器：
//  package.json
```javascript
"scripts": { //声明使用脚本 npm run dev和 npm run build
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development"
    "dev": "webpack-dev-server --open"
  }
  ```

在终端输入npm run dev即可在本地8080端口查看结果。

## 生成Source Maps（使调试更容易）
通过打包后的文件，不容易找到出错了的地方对应的你写的代码的位置，Source Maps就是解决这个问题的。
通过简单的配置，webpack就可以在打包时为我们生成source maps，提供了一种对应编译文件和源文件的方法，使编译后的代码可读性更高，更容易调试。

```javascript
module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
```
在webpack的配置文件中配置source maps，需要配置devtool，有四种不同的配置：
- source-map
- cheap-module-source-map
- eval-source-map
- cheap-module-eval-source-map

对小到中型项目，eval-source-map是一个很好的选项。

**注：只应该开发阶段使用**

# 开发阶段 vs 产品阶段
一般构建一个项目至少需要两种功能：本地开发调试，构建产品代码，其他还有诸如测试、部署到服务器、代码检查，格式优化等

## 产品阶段的构建
产品阶段，还需要对打包文件进行额外的处理，如优化，压缩，缓存以及分离CSS和JS。
对复杂的项目，需要复杂的配置，这时候可以将配置文件分解为小的文件。我们创建一个webpack.production.config.js文件，里面加上基本的配置
```javascript
// webpack.production.config.js
module.exports = {

    devtool: 'null', //注意修改了这里，这能大大压缩我们的打包代码
    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        hot: true
    },
};
```
package.json
```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "dev": "webpack-dev-server --open",
    "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"
  },
```
注意:如果是window电脑，build需要配置为"build": "set NODE_ENV=production && webpack --config ./webpack.production.config.js --progress".
