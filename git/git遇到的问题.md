1. detached HEAD 游离HEAD
```
$ git commit rear-release-notes.txt
# HEAD detached from rear-1.16
```
从一个分支rear-1.16上进行commit
解决办法：
```
git branch temp-branch
git checkout master
git merge temp-branch
git branch -d temp-branch
git push origin master
```
即从detached HEAD创建一个临时branch，再将临时branch合并到master分支上

1. [stack overflow](https://stackoverflow.com/questions/5772192/how-can-i-reconcile-detached-head-with-master-origin)
2. [stack overflow1](https://stackoverflow.com/questions/30471557/git-push-master-fatal-you-are-not-currently-on-a-branch)
3. [How to fix git HEAD detached from a branch](http://www.it3.be/2014/05/07/git-head-detached/)


2. git多人协作时如何解决冲突
冲突主要是出现在多人在修改同一个文件的同一部分内容时，对方在你之前 push，然后你后 push的时候git检测到两次提交内容不匹配，提示你 Conflict，然后你 pull下来的代码会在冲突的地方使用 =====隔开，此时你需要找到对应的开发人员商量代码的取舍，切不可随意修改并强制提交，解决冲突后再次 push即可。

- 基本操作
- git rebase vs git merge

git merge

记录下合并动作 很多时候这种合并动作是垃圾信息
不会修改原 commit ID
冲突只解决一次
分支看着不大整洁，但是能看出合并的先后顺序
记录了真实的 commit 情况，包括每个分支的详情


git rebase

改变当前分支 branch out 的位置
得到更简洁的项目历史
每个 commit 都需要解决冲突
修改所有 commit ID

回答时候没有答出很多，这是后面总结，深刻发现日常做总结的必要性，一直觉得自己是了解的，等到总结时候才发现有一些 point 还是不清楚的。
- 修改 commit message

没有问很深，只是基础操作多一点。如果日常是使用 git 开发，一般比较轻松应对。

版本控制
1.理解 Git的核心原理、工作流程、和 SVN的区别

2.熟练使用常规的 Git命令、 git rebase、 git stash等进阶命令

3.可以快速解决 线上分支回滚、 线上分支错误合并等复杂问题

Q: Git撤销已经push到远端仓库的commit信息

在git push后，发现一些代码需要小改动，但原则上不应该作为一次新的提交，此时需要撤销这次push和commit，然后修改代码，再重新提交和推送。

1. git log, 查看提交信息，获取需要回退至的commit id 版本号
2. git reset --soft < 版本号 >，重置至指定版本的commit，达到撤销提交的目的
--soft，保留当前工作区，以便重新提交
--hard，会撤销相应工作区的修改
3. git log 看是否成功撤销
4. git push origin master --force，强制提交当前版本号，以达到撤销版本号的目的
注：必须加参数--force，否则会提交失败并报错，原因是，本地项目版本号低于远端仓库版本号
5. 修改代码，重新commit和push

Q: 报错 error: You have not concluded your merge(MERGE_HEAD exists)
   原因：可能是以前pull下来的代码自动合并失败

   解决：git merge --abort
        git reset --merge
        git pull
  git pull之后重新解决冲突，再push


Q: git fetch 和 git pull 的区别
   都可以从远程获取最新版本到本地

   git fetch: 只从远程获取最新版本到本地，不会merge
      git fetch origin master //从远程的master分支上获取最新版本到origin/master
      git merge master  //合并

   git pull: 从远程获取最新版并merge到本地，相当于进行了 git pull + git merge
      git pull origin master


经验：

来回切换分支协同开发的时候，不小心把 git stash 的内容给删掉（clear）了，然后 feature 分支上写了一下午的代码就这么没了[泪]

不死心查了一下是否能够恢复被 clear 的 stash 内容，折腾了半天终于被我还原了（上 G 的仓库里头查找很痛苦）。不得不说，git 的设计真的太棒了，只要是通过 git command 操作的代码，一定会以某种方式储存在 .git 中，而且是可以被提交到仓库的。

git stash clear 的代码 sha 会被记录到 .git/lost-found 中，通过 git fsck —lost-found 可以找到这些 sha，不过需要注意的是，这些 sha 有很多种格式，blob/tree/commit 等，需要找到对应代码所在的 commit，然后通过 git stash apply SHA 给恢复回来。

我用了比较傻的办法，将所有的 lost-found 的 diff 代码输出到一个临时文件中，然后全局遍历我修改的代码关键词，这样比较方便找到对应的 sha：

git fsck --lost-found | awk '/dangling commit/ {print $3}' | xargs -I {} git show {} >> TMP_FILE;

这个经验也说明了另外一个问题，你要很小心，很可能你 stash/focePush/forceDeleteBranch 仍然可以在仓库中找到，如果在代码中不小心提交过密码或其他敏感信息，通过简单的 delete branch 或者 reset —hard && force push 等方式是不够的。

## github连不上

获取github.com地址

访问：https://github.com.ipaddress.com/#ipinfo 获取cdn和ip：

得到：140.82.114.4 http://github.com

修改 hosts文件映射上面查找到的IP

在hosts文件里添加 `140.82.114.4 github.com`

