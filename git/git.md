
## 工作区和暂存区
git仓库三个组成部分：
1. 工作区（working directory）

在git管理下的正常目录都算工作区，平时编辑都在这里完成。
工作区有一个隐藏的目录.git，是git的版本库respository。

git的版本库里，有
- 暂存区stage
- git为我们自动创建的第一个分支 master
- 指向master的一个指针 HEAD

2. 暂存区（Stage）

临时区域，存放将要提交的文件的快照

3. 历史记录区（History）：git commit后的记录区

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

git add 实际是把文件修改添加到暂存区；
git commit 提交修改，实际是把暂存区的所有内容提交到当前分支。 因为创建git 版本库时，git自动创建了一个master分支，所以现在是往master分支上提交修改。

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
前提是，还没有把本地版本库推送到远程。
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

## 撤销修改
注：最新的git
**用git restore  < file >代替git checkout -- file**，丢弃工作区的修改
**用git restore --staged < file >代替git reset HEAD < file >**，取消暂存区的修改

### git checkout -- file
注：“--”很重要，否则就变成“切换到另一个分支”的命令了。
把file在工作区的修改全部撤销：
1. 文件修改后还没有被放到暂存区，撤销修改就回到和版本库一样的状态（该文件必须进入过git 版本库，曾经git add过或git commit过）
2. 文件已经添加到暂存区后，又做了修改，撤销修改就回到添加到暂存区后的状态

即，**让文件回到最近一次git commit（1）或git add（2）时的状态**

注：git checkout只恢复修改过的文件，想删除未被tracked的文件（即还未进行过git add等操作的文件），用**git clean -df**
### git reset HEAD < file >

可以把暂存区的修改撤销掉（unstage），重新放回工作区。用HEAD时，表示最新的版本

## 删除文件
如果新建一个文件，并且git add和git commit了。想要从版本库中删除的话：
1. 文件管理器中先手动删除
2. git rm < file >或git add < file >，两者效果是一样的
3. git commit

如果误删了，因为版本库中还有，仍然可以恢复到最新版本
git checkout -- < file >或git restore < file >
即用版本库里的版本替换工作区里的版本，无论工作区是修改还是删除，都可以用该命令还原。但只能恢复到最新版本，会丢失最近一次提交后你修改的内容。

注：**从未被添加到版本库就被删除的文件，是无法恢复的**

## 远程仓库
git是分布式版本控制系统，同一个git仓库，可以分布到不同机器上。一般找一台电脑充当服务器的角色，其他每个人都从这个“服务器”仓库克隆一份到自己电脑上，且各自把各自的提交推送到服务器仓库里。也从服务器仓库中拉取别人的提交。

git本地工作不需要考虑远程库，不联网也可以正常工作，而SVN在没有联网时是拒绝干活的。

git默认的远程仓库的名字就是 **origin**，可以改成别的。

### github
本地git仓库和github仓库间传输通过SSH加密，需要提供你的公钥，让github确认是你推送的。如果有若干电脑，则要把每个电脑的key都添加到github，这样每台电脑都可以向github推送了。
需要设置：
1. 创建SSH Key
在用户主目录下（cd ~），看看有没有.ssh目录，目录下是否有 id_rsa和id_rsa.pub文件。如果没有，则在git bash中创建
```bash
ssh-keygen -t rsa -C "youremail@example.com"
```
一路回车，使用默认值。
id_rsa是私钥不可泄漏，id_rsa.pub是公钥
2. 登录github，Account settings，SSH Keys页面，点击“Add SSH Key"，填上任意title,key文本中粘贴id_rsa.pub文件的内容
3. git bash中，在用户主目录下，输入 `ssh git@github.com`进行连接认证

## 先有本地库，后有远程库，如何关联远程库
在github上新建仓库后，将本地已有的仓库推送上去，即在本地关联远程库：

1. 在本地的仓库下运行
```
git reomote add origin git@github.com:path/repo-name.git
```
2. 把本地库的内容推送到远程
第一次推送master分支时，加上 -u 参数（git push -u origin master）

git在推送时，还把本地master分支和远程的master分支关联起来，实际是把当前分支 master 推送到远程。

3. 后面推送时：
以后的推送和拉取时就可以简化命令，直接用 git push origin master

## 先创建远程库，然后从远程库克隆
- SSH方式：git clone git@github.com: path/repo-name.git，默认的git:// 使用ssh,速度快。
- https方式： git clone https://github.com/path/repo-name.git ，每次都需要输入账号密码。

## fork
github上可以fork任意开源库，自己拥有fork后的仓库的读写权限。

可以对fork后的库进行一些修改，然后创建一个pull request给官方仓库来贡献代码。

## git reset，git revert，git checkout有什么区别
共同点：用来撤销代码仓库中的某些更改

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

## 工具
Gogs
sourceTree
