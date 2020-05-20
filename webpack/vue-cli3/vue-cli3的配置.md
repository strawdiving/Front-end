vue-cli3的配置  https://cli.vuejs.org/zh/guide/

vue-cli3是基于Vue.js快速开发的完整系统，可以：
- 通过 @vue/cli 搭建交互式的项目脚手架
- 通过 @vue/cli + @vue/cli-service-global 快速开始零配置原型开发
- 一个运行时依赖（@vue/cli-service），该依赖
  - 可升级
  - 基于webpack构建，并带有合理的默认配置
  - 可通过项目内的配置文件进行配置
  - 可以通过插件进行扩展
- 丰富的官方插件合集
- 完全图形化的创建和管理Vue.js项目的用户界面

# vue-cli3的组件
## CLI（@vue/cli） 
*如果全局安装了旧版本的 vue-cli，需要先 `npm uninstall vue-cli`卸载它。*

全局安装的npm包，提供了终端里的 vue 命令
- vue create，快速创建一个新项目的脚手架
- vue serve ，构建新想法的原型
- vue ui 通过图形化界面管理所有项目

## CLI服务（@vue/cli-service）
开发环境依赖。一个npm包，局部安装在每个@vue/cli创建的项目中。

构建于 webpack 和 webpack-dev-server 之上，包含：
- 加载其他CLI插件的核心服务
- 针对绝大部分应用优化过的内部的webpack配置
- 项目内部的 vue-cli-service 命令，提供**serve, build, inspect 命令**

```javascript
// package.json
"scripts": {
    "serve": "vue-cli-service serve --open",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "build:netlify": "vue-cli-service build --mode netlify",
    "build:nomock": "vue-cli-service build --mode nomock",
    "build:travis": "vue-cli-service build --mode travis",
    "dev": "npm run serve",
    "i18n:report": "vue-cli-service i18n:report --src './src/**/*.?(js|vue)' --locales './src/locales/**/*.json'",
    "start": "npm run serve",
    "test:unit": "vue-cli-service test:unit"
  }
 "devDependencies": {
    "@vue/cli-service": "^3.8.0"
    ......
    "@vue/cli-plugin-babel": "^3.8.0",
    "@vue/cli-plugin-eslint": "^3.9.2",
    "@vue/cli-plugin-unit-jest": "^3.8.0",
    "@vue/eslint-config-standard": "^4.0.0",
    "@vue/test-utils": "1.0.0-beta.29"
    ......
 }
```
## CLI插件
向Vue项目提供可选功能的npm包，如BabeL/TypeScript转译，ESLint集成，单元测试，end-to-end测试等。

名字以 **@vue/cli-plugin-**（内建插件）或 **vue-cli-plugin-**（社区插件）开头。

在项目内部运行 vue-cli-service 命令时，会自动解析并加载 package.json 中列出的所有CLI插件

# vue-cli3 的安装
`npm install -g @vue-cli`
安装后就可以在命令行中使用 `vue`命令。

# 使用
## 快速原型开发
使用 vue serve 和 vue build 对单个 *.vue文件进行快速原型开发，但是需要先额外安装一个全局扩展 `npm install -g @vue/cli-service-global`

1. vue serve

在开发环境下零配置为.js或.vue文件启动一个服务器。使用了和 vue create 相同的默认配置（webpack,babel,postcss,eslint），它会在当前目录自动推导入口文件 —— main.js, index.js, App.vue 或 app.vue中的一个。

一般仅需要一个 App.vue 文件，在App.vue 文件所在目录下运行 vue serve。

```javascript
vue serve [options] [entry]
```

也可以显式指定入口文件 `vue serve Component.vue `

2. vue build
```javascript
vue build [options] [entry]
```
在生成环境下零配置构建一个.js或.vue文件。

可以使用 vue build 将目标文件构建成一个生产环境的包并用来部署。 `vue build Component.vue `

## 创建一个项目
1. vue create 

创建一个由 vue-cli-service 提供支持的新项目

```javascript
vue create [options] <app-name>
```
2. vue ui

以图形化界面创建和管理项目。会打开一个浏览器窗口，并以图形化界面将你引导至项目创建的流程。
vue ui 命令还可以使用 GUI 安装和管理插件

# vue-cli3 插件和Preset
## 插件
Vue CLI使用了一套基于插件的架构。插件可以修改webpack的内部配置，也可以向 vue-cli-service 注入命令。

每个CLI插件包含：
- 一个生成器，用来创建文件
- 一个运行时插件，用来调整webpack核心配置和注入命令

当使用vue create时，有些插件会根据选择的特性被预安装好（如ESLint，Babel等）。
1. 安装插件

在已经被创建好的项目中安装插件，可以用 `vue add xxx`，vue add的设计意图时为了安装和调用Vue CLI插件，普通包仍然需要包管理器。

注：vue add之前将项目的最新状态提交，该命令可能调用插件的文件生成器，并可能更改现有的文件。

eg.
```javascript
vue add eslint
// 等价于
vue add cli-plugin-service
// 可以向被安装的插件传递生成器选项 （会跳过命令提示）
vue add eslint --config standard --lintOn save
```
将@vue/eslint 解析为完整的包名 @vue/cli-plugin-eslint， 然后从npm安装它，调用它的生成器。

如果不带 @vue前缀，该命令会换作解析一个 unscoped 的包，
```javascript
vue add apollo
// 安装并调用vue-cli-plugin-apollo

// 如果一个插件名为 @foo/vue-cli-plugin-bar
vue add @foo/bar
```
## Preset
Vue CLI preset 是一个包含创建新项目所需**预定义选项**和**插件**的JSON对象，让用户无需在命令提示行中选择它们。

在 vue create过程中保存的preset会放到home目录下的一个配置文件 （~/.vuerc, Windows下为C:/users/userName/.vuerc），可以直接编辑该文件来调整保存好的 preset。
```json
{
  "useTaobaoRegistry": true,
  "presets": {
    "default-setting": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-router": {
          "historyMode": true
        },
        "@vue/cli-plugin-vuex": {},
        "@vue/cli-plugin-eslint": {
          "version": "^3.0.0",
          "config": "standard",
          "lintOn": [
            "save"
          ]
        }
      },
      "cssPreprocessor": "node-sass"
    }
  }
}
```
Preset的数据会被插件生成器用来生成相应的项目文件。

可以为集成工具添加配置，这些额外的配置会根据 `useConfigFiles`（Boolean）的值被合并到 package.json或相应的配置文件中。
```json
{
  "useConfigFiles": true,
  "plugins": {...},
  "configs": {
    "vue": {...},
    "postcss": {...},
    "eslintConfig": {...},
    "jest": {...}
  }
}
```
如，当 useConfigFiles 为 true 时，configs 的值会被合并到 vue.config.js中，否则合并到package.json中。
### Preset 插件的版本管理
可以显式地指定用到的插件的版本。这对于官方插件不是必须的，忽略时CLI会使用 registry 中的最新版本

# CLI服务
@vue/cli-service 安装了 vue-cli-service 的命令， 可以
- 在npm scripts 中以 vue-cli-service 
- 从终端中以 ./node_modules/.bin/vue-cli-service 

访问这个命令。 
```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  }
``` 
用 `npm run serve`可以调用这些scripts。

## vue-cli-service serve
会启动一个开发服务器（基于 webpack-dev-server），并附 HMR 热重载模块。

```json
// 命令行参数
vue-cli-service serve [options] [entry]

options:
-- open 服务端启动时打开浏览器
-- mode 指定环境模式（默认 development）
-- host 指定 host（默认 0.0.0.0）
-- port 指定 port （默认 8080）
-- https 使用 https （默认 false）
```

除了通过命令行参数，也可以使用 vue.config.js 里的 `dev.Server` 字段配置开发服务器。

命令行参数 [ entry ] 将被指定为唯一接口，而非额外的追加入口。尝试用[ entry ]覆盖  config.pages 中的 entry 将可能引发错误。

## vue-cli-service build
```json
// 命令行参数
vue-cli-service build [options] [entry|pattern]

options:
-- mode 指定环境模式（默认 development）
-- dest 指定输出目录 （默认 dest）
-- report 生成 report.html 以帮助分析包内容
-- report-json 生成 report.json 以帮助分析包内容
-- watch 监听文件变化
-- modern 使用现代模式构建应用，为现代浏览器交付原生支持的ES2015代码，并生成一个兼容老浏览器的包用来自动回退
```

`vue-cli-service build` 会在 `dist/`目录下产生一个可用于生产环境的包，带有html/css/js的压缩，和为更好的缓存而做的自动的 **vendor chunk splitting**，它的 chunk manifest 会内联在html里。 

## 查看所有的可用命令
有些应用，如@vue/cli-plugin-eslint 会注入 `vue-cli-service lint`命令。

查看所有注入的命令：`npx vue-cli-service help`

学习每个命令可用的选项：`npx vue-cli-service help [command]`
## 缓存和并行处理
- `cache-loader` 默认为Vue/Babel/TypeScript编译开启。文件缓存在 node_modules/.cache中。如果遇到了编译方面的问题，记得先删掉缓存目录后再看
- `thread-loader` 在多核CPU的机器上为Babel/TypeScript转译开启。

通过 Vue CLI 创建的项目让你无需 eject 就能够配置工具的几乎每个角落
