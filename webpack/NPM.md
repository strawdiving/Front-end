1. package-lock.json
yarn-lock.json

锁定安装时的包的版本号，并且需要上传到git上，以保证其他人在npm install时大家的依赖能保持一致。
根据官方文档，这个package-lock.json 是在 `npm install`时候生成一份文件，用以记录当前状态下实际安装的各个npm package的具体来源和版本号。
https://www.cnblogs.com/cangqinglang/p/8336754.html package-lock.json的作用
https://blog.csdn.net/aaa333qwe/article/details/78021704  npm 5 package-lock.json
https://www.jianshu.com/p/818833b2dd5a  package-lock.json

2. 介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？

3. npm2和npm3+有什么区别
