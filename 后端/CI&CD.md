# 概念
## CI（持续集成）
## CD（持续交付）

CI/CD工具：Jenkins和GitLab CI/CD

## Jenkins
开源的JAVA编写的CI/CD工具，用于自动化部署。有一组强大的功能，可以自动执行软件构建、测试、部署、集成和发布相关的任务。易于设置，自动构建过程，提供大量文档。

Jenkins只是一个平台，真正运作的都是插件，这就是jenkins流行的原因。

可以通过本机安装软件包，也可以独立安装或作为Docker安装在任何有Java Runtime Environment(JRE)的计算机上。

### Jenkins自动部署Vue项目
目标：

本地push代码到Github，WebHook自动触发Jenkins上的构建动作，完成安装node插件并且打包，
然后通过Publish Over SSH 插件，将打包出的文件，部署到目标服务器上。



1.理解 CI/CD技术的意义
2.可以独自完成架构设计、技术选型、环境搭建、全流程开发、部署上线等一套完整的开发流程（包括 Web应用、移动客户端应用、 PC客户端应用、小程序、 H5等等)
是如何进行code review的，这里讲了持续化集成

8. 全链路及DevOps认知
- docker 准备流程？
- DevOps平台关键功能点？
- 自动化测试，CI/CD 的关键核心都有哪些？
- 接口如何做优化？Mock平台搭建方案？
- 如何保障DevOps推动？

