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