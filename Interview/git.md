
## git安装
安装完成后，需要设置：
```bash
git config --global user.name "Your Name"
git config --global user.email "email@email.com"
```
--global参数表示机器上所有的git仓库都使用这个配置。也可以为某个仓库指定不同的用户名和密码。
因为git是分布式版本控制系统，所以，每个机器都必须自报其名字和email地址

## 创建版本库
版本库即respository,可以看作一个目录，目录里的所有文件都可以被git管理起来，每个文件的修改、删除，git都能跟踪，以便任何时刻都可以追踪历史或者还原。

创建： 
1. 创建一个空目录；
2. git init ，将该目录变成git可以管理的仓库；仓库建好了，且会告诉你这是一个empty git respository
目录下多了一个.git目录（默认隐藏），是git来跟踪管理版本库的，不要手动修改，否则会把git仓库破坏。
也可以选择一个已经有东西的目录创建git仓库。

## 把文件添加到版本库
所有的版本控制系统只能跟踪文本文件的改动，如txt，网页，程序代码等，但图片，视频这些二进制文件，没法跟踪文件的变化，只能把每次改动串起来，但到底改了什么不知道。

1. git add < file>/git add .(添加全部)， 告诉git将目录里的文件添加到仓库
2. git commit -m "xxxxx"，告诉git将文件提交到仓库
-m 后面输入的是本次提交的说明。执行成功后会告诉你：1 file changed 2 insertions

可以多次git add不同的文件，再一次commit提交多个文件

## 查看结果 & 提交
**git status** 可以查看仓库当前的状态，比如xxx被修改过了，但还没有准备提交的修改
**git diff** 可以查看文件具体修改了什么

提交修改（和提交新文件一样）：
```git
1. git add file/git add . 
2. git commit
```

## 版本回退
每次commit，就相当于一个“快照”，可以从某个commit恢复。
### 查看commit的历史
**git log** 显示从最近到最远的提交commit日志。日志中可以看到commit的id（版本号），commit message(-m 后面跟的)
想要输出简略的信息，就加上 --pretty=oneline 参数。

### 回退
1. 知道当前版本：
git必须知道当前版本是哪个版本。git用**HEAD**表示当前版本，上一个版本就是HEAD^,上上个版本HEAD^^,...往上100个版本 HEAD~100
2. 回退到上一个版本
```
git reset --hard HEAD
```
git log看一下，此时最新的commit版本已经看不到了。
3. 指定回到某个版本
```
git reset --hard commitId（版本号）
```
只需要指定该版本的版本号，版本号没必要写全，可以只写前几位，git会自动去找。

git的回退很快，因为git内部有个指向当前版本的HEAD指针，回退时，git只是把HEAD从指向版本a改为指向版本b，顺便把工作区的文件更新了。

4. 查找commit版本号
git log， 查看提交历史，以便确定要回退到哪个版本。如果回退了，则后面的提交历史就看不到了，要用git reflog
git reflog， 查看命令历史，以便确定要回到未来的哪个版本

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
## 从当前分支拉出新分支
1. 切换到被copy的分支，从服务器拉取最新版本
```
git checkout master
git pull origin master
``` 
2. 从当前分支copy出新的开发分支，命名为dev分支
```
git checkout -b dev
```
3. 把新建的分支push到远端
```
git push origin dev
```
4. 拉取远端分支
```
git pull origin dev
```
## rebase和merge的区别
git rebase和git merge都是从一个分支获取并合并到当前分支。
如feature/todo分支合并到master主分支，
1. merge，自动创建一个新的commit，如果合并时遇到冲突，仅需修改后重新commit。
优点：记录了真实的commit情况，包括每个分支的详情；
缺点：每次merge自动产生一个merge commit，使用GUI或者commit频繁时，看到分支很杂乱
2. rebase，会合并之前的commit历史
优点：得到简洁的项目历史，去掉了merge commit;
缺点：合并出现问题不容易定位，因为rewrite了history

总结：需要保留详细合并信息时建议使用git merge，特别是需要将分支合并到master;当发现要修改某个功能时，频繁进行git commit提交时，过多提交信息没有必要，用git rebase

## git reset，git revert，git checkout有什么区别
共同点：用来撤销代码仓库中的某些更改
git仓库三个组成部分：
1. 工作区（working directory）：在git管理下的正常目录都算工作区，平时编辑都在这里完成
2. 暂存区（Stage）：临时区域，存放将要提交的文件的快照
3. 历史记录区（History）：git commit后的记录区

working directory-git add files-stage-git commit-history

history- git reset-stage-git checkout-working directory

区别：从commit层面
1. git checkout将HEAD移到一个新分支，并更新工作目录。可能会覆盖本地的修改。执行前需要stash或者commit暂存区和工作区的修改

文件层面：把文件从历史记录区拿到工作区，不影响暂存区

2. git reset

将一个分支的末端指向之前的一个commit，然后下次git执行垃圾回收时，会把这个commit之后的commit都扔掉，可以用标记来标记reset指令影响的范围。

因为reset会直接删除commit记录，影响其他开发人员的分支，所以不要在公共分支做。

文件层面：把文件从历史记录区拿到暂存区，不影响工作区的内容

3. get revert

类似reset，以创建新的commit的方式来撤销commit，可以保留之前的commit历史，比较安全。但可能会覆盖本地的修改，所以要先stash或commit

文件层面：不支持文件层面的操作。