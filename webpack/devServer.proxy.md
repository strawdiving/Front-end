# devServer.proxy ( vue-cli 3 )
[vue-cli3 devServer.proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)

## devServer ( Object )
所有webpack-dev-server的选项都支持。 
- host,port,https可能会被命令行参数覆写；
- publicPath和historyApiFallback不应该被修改，因为他们需要和开发服务器的publicPath同步以保障正常的工作。

## devServer.proxy  (String | Object)
如果前端应用和后端API服务没有运行在同一个主机上，需要在开发环境下将API请求代理到API服务器。通过vue.config.js中的devServer.proxy来配置。

devServer.proxy可以是一个指向开发环境API的字符串。
```javascript
module.exports = {
    devServer: {
        proxy: 'http://localhost:4000'
    }
}
```
告诉开发服务器将任何未知请求（没有匹配到静态文件的请求）代理到http://localhost:4000。

如果想要更多的代理控制行为，可以使用一个path:options成对的对象。完整的选项可以查阅

[ http-proxy-middleware ](https://github.com/chimurai/http-proxy-middleware#proxycontext-config) 

可用选项包含所有 **http-proxy** 的选项，还包括额外的**http-proxy-middleware** 的选项

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/auth' : {
        target: 'http://10.38.64.178:8096',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/auth': '/auth'}, // 把..../auth变为/auth
        logLevel: 'debug'
      },
       '/api': {
        target: 'http://10.20.53.80:8083',
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/operate': ''} // 会把路径中的/operate去掉
      },
    }
  }
}

```
```javascript
target: 'http://www.example.org', // 目标host
changeOrigin: true, // needed for virtual hosted sites
ws: true, // 代理websocket
pathRewrite: {
  '^/api/old-path': '/api/new-path', // rewrite path
  '^/api/remove/path': '/path', // remove base path
},
router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'dev.localhost:3000': 'http://localhost:8000',
},
logLevel: 'debug', // string, ['debug', 'info', 'warn', 'error', 'silent']. Default: 'info'
// logProvider: function, modify or replace log provider. Default: console.
```
