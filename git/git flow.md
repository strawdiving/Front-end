# git工具流
gitflow——git操作流程标准，可实现并行开发，可以多个feature并行，feature新功能开发完成才并到develop开发分支。可支持协作开发
- master，主分支
- develop，主开发分支，主要用于暂时保存未发布的内容。一个新feature开发完成，会被合并到develop分支。如果还要开发新分支，只需从develop分支创建新分支，就可包含所有已完成的feature。
- feature，新功能分支，一般一个新功能对应一个分支，拆分要合理
- release，发布分支，发布时用，测试发现bug在此分支修复
- hotfix，紧急修复bug时用，从某个已发布的tag上创建出来并做一个紧急修复，只影响这个已经发布的tag，而不会影响正在开发的新feature

feature分支都是从develop创建，最后再合并到develop分支，等待发布；

需要发布时，从develop创建一个release分支

release分支会发布到测试环境进行测试，发现问题就在这个分支直接修复，在所有问题修复前，不停重复发布-测试-修复-重新发布-重新测试这个流程。

发布结束后，release分支合并到develop和master分支，保证不会有代码丢失

master分支只跟踪已经发布的代码，合并到master上的commit只能来自release和hotfix

hotfix分支是紧急修复一些bug。他们都是从master分支上的某个tag建立，修复结束后再合并到develop和master上。