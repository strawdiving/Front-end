前端工程化：
- 前端开发要自成体系，包括构建、部署和运维，不再和后端耦合，后端通过RESTful API提供服务
- 设计要分层，来应对需求和技术的变化

模块化就是将一个大文件拆分成相互依赖的小文件，再进行统一的拼装和加载。只有这样，才有多人协作的可能

模块的打包和加载问题：1. 用Webpack+Babel将所有模块打包成一个文件同步加载，也可以打成多个chunk异步加载；

前端项目的性能优化：

vue有很多页面，用vue-router配置路由，打包好项目后，页面打开很慢，使用路由懒加载，进入哪个页面，加载哪个页面

webpack:
  - tree shaking 去除没有使用的代码
  - 提取公共包，有被问到
  - 拆分模块，按需加载
  - 优化图片，使用 base64 代替小图
  - file name with hash (etag)

webpack4，要另外安装独立的webpack-cli命令行工具包
production阶段：
- 开启所有的优化代码
- 更小的bundle大小
- 去除掉只在开发阶段运行的代码
- Scope hoistion和Tree-Shaking
- 自动启用uglifyjs对代码进行压缩
- 按需加载