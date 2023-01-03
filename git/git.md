
## to-do 
git rebase

## 创建版本库
git init 时，会多出来一个 .git ，。 

1. 创建一个空目录；
2. git init ，将该目录变成git可以管理的仓库；仓库建好了，且会告诉你这是一个empty git respository

目录下多了一个.git目录（默认隐藏），称之为版本库respository，是git来跟踪管理版本库的，目录里的所有文件都可以被git管理起来，每个文件的修改、删除，git都能跟踪，以便任何时刻都可以追踪历史或者还原。

不要手动修改，否则会把git仓库破坏。

也可以选择一个已经有东西的目录创建git仓库。

## 工作区和暂存区
使用git管理文件时，比如 

git仓库三个组成部分：
1. 工作区（working directory）
本地项目存放文件的位置。workspace

在git管理下的正常目录都算工作区，平时编辑都在这里完成。本地编写的代码，不执行任何git命令，处于工作区。
工作区有一个隐藏的目录.git，是git的版本库respository。创建 .git 时，会同时创建

- git为我们自动创建的第一个分支 master
- 指向master的一个指针 HEAD

2. 暂存区（Stage）：暂时存放文件的临时区域，存放将要提交的文件的快照，通常通过 add 命令将工作区的文件添加到缓冲区。
3. 本地仓库（Repository):使用commit命令可以将暂存区的文件添加到本地仓库
4. 远程仓库(Remote)
5. 历史记录区（History）：git commit后的记录区

## git配置
 
```bash
git config --list // 列出当前配置
git config --local --list // 列出Repository配置
git config --global --list // 列出全局配置
git config --system --list // 列出系统配置

git config --global user.name "Your Name" // 配置用户名
git config --global user.email "email@email.com" // 配置用户邮箱
```
--global参数表示机器上所有的git仓库都使用这个配置。也可以为某个仓库指定不同的用户名和密码。
因为git是分布式版本控制系统，所以，每个机器都必须自报其名字和email地址

## 把文件添加到版本库
所有的版本控制系统只能跟踪文本文件的改动，如txt，网页，程序代码等，但图片，视频这些二进制文件，没法跟踪文件的变化，只能把每次改动串起来，但到底改了什么不知道。

1. git add < file>/git add .(添加全部)， 告诉git将目录里的文件添加到仓库
2. git commit -m "xxxxx"，告诉git将文件提交到仓库
-m 后面输入的是本次提交的说明。执行成功后会告诉你：1 file changed 2 insertions

可以多次git add不同的文件，再一次commit提交多个文件

git add 实际是把文件修改添加到暂存区；
git commit 提交修改，实际是把暂存区的所有内容提交到当前分支。 因为创建git 版本库时，git自动创建了一个master分支，所以现在是往master分支上提交修改。

## 查看结果 & 提交
### Git文件状态
**git status** 可以查看仓库当前的状态，比如xxx被修改过了，但还没有准备提交的修改
    - Changes not staged for commit // 工作区有内容，但是暂存区没有，需要git add
    - Changes to be committed // 文件再暂存区，需要 git commit
    - nothing to commit. working tree clean // 这个时候，可以将代码推到remote

**git diff** 可以查看文件具体修改了什么
- git diff: 比较工作区与暂存区
- git diff --cached：比较暂存区与本地库最近一次commit内容
- git diff HEAD：比较工作区与本地库最近一次commit内容
- git diff commit_id1 commit_id2 // 比较两个commit之间差异

git diff查看时，如何退出该流程：  **press q**,不行的话就 Shift + q, win + q

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

### 1. 在未暂存前，撤销本地修改
git checkout --<filename>（该操作一旦撤销，无法找回）
- 作用：丢弃工作区的修改，让这个文件回到最近一次 git commit 或 git add 时的状态
注：“--”很重要，否则就变成“切换到另一个分支”的命令了。
可以通过 git checkout --. 撤销本地修改。也可以 git checkout --<filename> 指定具体的文件路径，撤销该文件的修改

git add 命令，把工作取得文件标记为已暂存，保存在暂存区。
git commit命令，把已暂存的文件保存到本地git仓库，并生成一个快照

可以通过 git diff 查看本地修改。

在没有暂存之前，即没有执行git add之前，如果不想要这些本地代码（比如一些临时的测试代码），把file在工作区的修改全部撤销：

1. 文件修改后还没有被放到暂存区，撤销修改就回到和版本库一样的状态，**让文件回到最近一次git commit时的状态**
2. 文件已经添加到暂存区后，又做了修改，撤销修改就回到添加到暂存区后的状态，**让文件回到最近一次 git add 时的状态**

撤销后再执行 git diff 命名，没有任何输出，即没有文件在暂存区

注：git checkout只恢复修改过的文件，想删除未被tracked的文件（即还未进行过git add等操作的文件），用**git clean -df**

### 2. 在暂存之后，撤销暂存区的修改
"撤销暂存区的修改”是指撤销git add .这个命令，回到执行git add .之前的状态，即已修改未暂存状态

执行 git add 命令后， git diff 就看不到对应文件的修改
用 git diff -staged，可以看到文件的修改

要一次性撤销暂存区的全部/部分修改， git reset . 或 git reset <fileName> 

撤销后， git diff -staged 没有记录， git diff 可以看到已修改未暂存的记录

git reset --hard 相当于：
- 1. git reset .
- 2. git checkout --.
即把已暂存的文件直接抛弃

### 3. 提交到本地仓库后，未推送到远程仓库，撤销此次提交
git commit -m "modify"后，提交历史里会有一条记录（有commit id)

撤销当前提交的方法：
1. 回到当前提交的父对象（即上一次提交），就等于撤销了本次提交
    - git log，查看提交记录，查看本次提交的上一次提交parent_commit_id
    - git checkout parent_commit_id，即撤销了本次提交
2. 重置之前的提交
    - git reset --hard HEAD~1
    该命令可以二次反悔：
        - 找到被重置的提交 git reflog
        - git reset --hard commit_id 回到该提交

- git reset --soft
把所有更改的文件更改为“要提交的更改”，即回退已提交的commit，**并将commit的修改内容放回到暂存区**。

- git reset --hard 能让commit记录强制回溯到某一个节点；回退全部，包括HEAD,index, working tree
- git reset --soft 除了回溯节点外，还会保留节点的修改内容(可以再次修改重新提交，保持干净的commit记录)，只回退HEAD

```javascript
git reset --soft HEAD^ // 恢复最近一次commit
```

注：在用 reset --soft 指定commit号时，会将该commit到最近一次commit的所有修改内容全部恢复，而不是只针对该commit.
e.g. commit记录有 c、b、a，reset到a，此时HEAD到了a，b、c的修改内容都回到了暂存区。

### 4. 修改提交
场景：原本打算修改两个文件，但只提交了一个，又不想生产两个提交记录，即 **添加遗漏文件，又不重新生成新的Commit ID**

- git add <fileName>
- git commit --amend

没有遗漏的文件，只是提交信息里有一个单词写错了，可以使用以下命令进行修补：

- git commit --amend -m "add test container"

--amend修补参数会将改变之前的Commit ID，但不会生成新的Commit ID

### 5. 撤销提交历史中的某一次指定的提交
git revert commit_id， 撤销该次提交（将提交的内容反操作），并生成一个新的提交在最前面。
revert之后，会在提交历史的最前面生成一个新的commit id，这次提交做的事情就是将前一个commit_id里的内容反操作

### 6. 合并出现冲突时，撤销合并操作
两个分支修改了同一个文件的同一个地方，合并时会出现冲突。如果要撤销合并：
-- git merge --abort
abort之后，将恢复合并前的状态。

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

## 工具
Gogs
sourceTree
VS Code插件：Git Blame，查看代码的书写者

## git使用
- 下载分支：git clone -b 分支名仓库地址
- 初始化开发流程
    - 本地创建公钥 ssh-keygen -t rsa -C "your email address"并配置
    - 克隆最新主分支项目代码： git clone地址
    - 创建并切换到本地分支： git checkout -b 分支名
    - 本地分支推送到远程分支： git push <远程仓库> <本地分支>:<远程分支>

- 一般工作流程
工作区
1. git status 查看状态
2. git add . 将所有修改加入暂存区
3. git commit -m "提交描述" 将代码提交到本地仓库
4. git push 将本地仓库代码更新到远程库

## git remote
为远程仓库指定别名，以便于管理远程主机，默认只有一个时为origin

1. 查看主机名： git remote
2. 查看主机名即网址： git remote -v
    默认克隆远程仓库到本地，远程主机为origin，如需指定别名，使用 git clone -o <别名> <远程git地址>
3. 查看主机详细信息 git remote show <主机名>
4. 添加远程主机 git remote add <主机名> <网址>
5. 删除远程主机 git remote rm <主机名>
6. 修改远程主机的别名：git remote rename <原主机名> <新主机名>

## git fetch
将某个远程主机的更新，全部/分支取回本地，此时只更新了 Repository,取回的代码对本地的开发代码没有影响。如需彻底更新需合并，或使用 git pull

1. 远程主机的更新，全部拉回本地 git fetch <远程主机名>
2. 远程主机特定分支的更新，拉回本地 git fetch <远程主机名> <分支名>

如果需要将更新拉取，但本地工作代码需要合并到本地某一分支 git merge <被合并的远程分支> 或者在此基础上创建出新分支并切换 git checkout -b <分支名> <在此分支上创建>

git fetch origin <branch-name>:<local-branch-name>
- origin: 远程主机名，一般默认origin
- branch-name: 要拉取的分支
- local-branch-name： 本地新建一个分支，将origin下的某个分支代码下载到本地分支

## git pull
拉取远程主机某分支的更新，再与本地的指定分支合并（fetch + 合并分支）
1. 拉取远程某分支，并与本地某分支合并（没有则默认会创建）：git pull <远程主机名> <远程分支名>：<本地分支名>
2. 如果远程分支是与当前所在分支合并，则 本地分支名 可以省略: git pull <远程主机名> <远程分支名>
3. 如果当前分支与远程分支存在追踪关系，则可以忽略分支名： git pull <远程主机名>
4. 如果当前分支只有一个追踪分支，则远程主机名可以忽略： git pull

## git push
将本地分支的更新，推送到远程主机，命令格式和git pull 相似

1. 将本地分支推送到远程分支：git push <远程主机名> <本地分支名>:<远程分支名>
2. 如果省略远程分支名，则默认为将本地分支推送到与之关联的远程分支：(一般设置本地分支和与之关联的远程分支同名，防止混淆)：git push <远程主机名> <本地分支名>

3. 如果对应的远程分支不存在，则会被创建（默认与本地分支同名）
如果省略本地分支名，则表示删除指定的远程分支，这等同于推送一个空的本地分支到对应远程分支：git push origin :<远程分支> 等同于 git push origin --delete <远程分支>

4. 如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略git push origin

5. 如果当前分支只有一个追踪分支，那么主机名也可以省略：git push

6. 如果当前分支与多个主机存在追踪关系(使用场景相对来说较少)，可以使用-u指定默认推送主机git push -u origin <主机名>，设置时候需推送便可以直接使用git push
7. 将本地的所有分支都推送到远程主机:git push --all origin
8. 如果远程主机的版本比本地版本更新，推送时Git会报错，要求先在本地做git pull合并差异，然后再推送到远程主机。如果一定要推送，可以使用--force选项(谨慎使用，除非你非常确认): git push --force origin

注意:**分支推送顺序的格式为<来源地>:<目的地>**，所以git pull格式：<远程分支>:<本地分支>，git push格式为：<本地分支>:<远程分支>。


## 修改撤销

2. git reset HEAD <filename>: 把暂存区的修改撤销掉（unstage），重新放回工作区
3. git reset --hard commit_id：git版本回退，回退到特定的 commit_id 版本
    流程：
    1. git log 查看提交历史，以便确定要回退到哪个版本（commit_id)
    2. git reset --hard commit_id, 回退到commit_id版本
    - git reflog: 查看历史命令/操作记录，以便确定要回到未来的哪个版本
    - 更新远程代码到本地
      git fetch origin master（分支）
      git pull // 将fetch下来的代码pull到本地
      git diff master origin/master //查看本地分支代码和远程仓库的差异

      拉取远程分支并创建本地分支
      1. git checkout -b 本地分支名 origin/远程分支名：使用此方法会在本地新建并切换到新分支
      2. git fetch origin 远程分支名:本地分支名，使用此方式会在本地新建分支，但是不会自动切换到该本地分支，需要手动checkout。

### git reset
1. 作用是，当你希望提交的commit从历史记录中完全消失就可以用。
2. 如果是协作开发。大家都把分支合并到主分支，就不能用reset强行回滚，这样会把别人的提交记录冲掉，这时候用revert来操作

进行代码分支合并的时候，有时候会提示代码没有更新，因为当前开发分支的commi记录时落后于要合并的目标分支的，可能就是reset引起
的，reset要慎用。

1. git log 查找commit_id
2. git reset commit_id
3. 直接 git push 会报错，这是因为我们的回滚已经落后于仓库的代码了，需要用 git push -f 进行强制提交

### git revert
将现有的提交还原，恢复提交的内容，并生成一条还原记录。

git reset会把其他人提交的代码也撤回了。而revert会把之前那个commit_id的内容revert掉，并生成一条新的提交记录，（会让你编辑提交信息，编辑完后 :wq 保存退出。此时，之前的提交记录还会保留，但你修改的代码内容已经被撤回了

还有一种类型是**合并提交** merge类的，这种用revert的方法是不一样的。
 对于merge类的commit，通常无法revert合并，因为合并提交是两条分支的交集节点，而git不知道需要撤销的是哪一条分支（不知道合并的哪一侧被视为主线），需要添加参数 -m 指定主线分支，保留主线分支的代码，而另一条被撤销

 -m 后面要跟一个parent number 标识出“主线”，一般用 1 保留主分支代码
 ```javascript
 git revert -m 1 commit_id
 ```
 在master分支revert合并提交后，切到feature分支修复好bug,再合并到master分支时，发现之前被revert的修改内容没有重新合并进来。因为使用revert后，feature分支的commit还保留在master分支的记录中，再次合并时，git判断有相同commit_id，旧忽略了相关commit修改的内容。就需要revert掉之前revert的合并提交

 再次使用revert，之前被revert的修改内容就又回来了。

1. revert的原理是，在当前提交后面，新增一次提交，抵消掉上一次提交导致的所有变化。他不会改变过去的历史， 没有丢失代码的风险。
2. revert可以抵消掉上一个提交，如果想要抵消多个，需要执行 git revert 倒数第一个commit_id, 倒数第二个commit_id
3. 可用于，很多人提交过代码后，想改之前的某一次commit记录，又不想影响后面的提交记录，就可以用 revert，它会把你后面提交的记录都放到工作区。合并的时候需要注意

使用revert后，增加了一条 revert commit_id的记录，原来的commit_id的记录还在

### git reset，git revert，git checkout有什么区别
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

如果你可以向 master 强推代码，且想让 git log 里不再出现被回退代码的痕迹，可以使用 git reset --hard + git push --force 的方式。

3. get revert

类似reset，以创建新的commit的方式来撤销commit，可以保留之前的commit历史，比较安全。但可能会覆盖本地的修改，所以要先stash或commit

revert 适合需要回退的历史提交不多，且无合并冲突的情景。

文件层面：不支持文件层面的操作。

### git stash

stash命令，能将还未commit的代码存起来，让工作目录变干净。

场景：feature分支开发新功能，突然要修复bug，切换到别的分支。此时需要工作区干净才能切换分支。只能紧急commit上去，添加了一条提交历史。

1. 使用 -- git stash，把代码存起来
2. 切回该分支，恢复代码， 使用 --git stash apply
```javascript
git stash // 保存当前未commit的代码
git stash save "remark" // 保存当前未commit的代码并添加备注
git stash list // 列出stash的记录
git stash clear // 删除stash的所有记录
git stash apply // 应用最近一次stash
git stash pop // 应用最近一次stash, 随后删除该记录
git stash drop // 删除最近一次stash

// 有多条stash时，操作指定stash
git stash list
git stash apply stash@{1} // pop, drop同理
```

### git rebase
rebase把多个提交合并成一个提交。
这里的base，是指多次commit形成的git workflow，使用rebase，可以改变历史提交， 修改commit信息，将多个commit进行组合。

使用git rebase进行代码回退的步骤:
1. 切除一个新分支F，git log 查询要回退到的commit_id
2. 使用 git rebase -i commit_id， -i 指定交互模式后，会打开git rebase编辑界面
3. 界面上，commit自旧到新排列，只需要在commit_id前添加操作命令即可，在合并xommit这个需求里，可以选择pick(p)最旧的commit1, 再在后续的commit_id前添加 squash(s)命令。将这些commits都合并到最旧的commit1上
4. 保存rebase结果后，再编辑commit信息，使这次rebase失效。git 会将之前的这些 commit 都删除，并将其更改合并为一个新的 commit5，如果出错了，也可以使用 git rebase --abort/--continue/--edit-todo 对之前的编辑进行撤销、继续编辑。
5. 这时候，主分支上的提交记录是 older, commit1, commit2, commi3, commit4，而F上的提交记录是older, commit5/由于F分支的祖先节点是older，明显落后于主分支的commit4, 所以将F合并到主分支是不允许的，先要git merge master, 合并后 git 会发现 commit1 到 commit4 提交的内容和 F 分支上 commit5 的修改内容是完全相同的，会自动进行合并，内容不变，但多了一个 commit5。
6. 再在 F 分支上对 commit5 进行一次 revert 反提交，就实现了把 commit1 到 commit4 的提交全部回退。

rebase 操作历史提交的功能和 git 识别修改相同自动合并的特性，操作虽然复杂，但历史提交保留得还算完整。

rebase 这种修改历史提交的功非常实用，能够很好地解决我们遇到的一个小功能提交了好多次才好使，而把 git 历史弄得乱七八糟的问题，只需要注意避免在多人同时开发的分支使用就行了。

### 文件操作
对文件操作，然后让 git 来识别变更，具体是：

1. 从主分支上切出一个跟主分支完全相同的分支 F。
2. 从文件管理系统复制项目文件夹为 bak，在 bak 内使用 git checkout N 将代码切到想要的历史提交，这时候 git 会将 bak 内的文件恢复到 N 状态。
3. 在从文件管理系统内，将 bak 文件夹下 除了 .git 文件夹下的所有内容复制粘贴到原项目目录下。git 会纯从文件级别识别到变更，然后更新工作区。
4. 在原项目目录下执行 add 和 commit，完成反提交。
这种方式的巧妙之处在于利用 git 本身对文件的识别，不牵涉到对 workflow 操作。

## 配置
- git config -l 列出所有git配置项
- git config core.ignorecase false 配置git不忽略大小写（默认忽略）

## 暂存
git stash 暂存当前正在进行的工作
- 添加缓存栈： git stash
- 查看缓存栈： git stash list
- 推出缓存栈： git stash pop
- 取出特定缓存内容： git stash apply stash2{1}

## cherry-pick
给定一个或多个现有commit，应用每个commit引入的更改，为每个commit记录一个新的commit。

将已经提交的commit,复制出新的commit应用到分支里。

场景：1）其中的某些开发完的需求要临时上线，或正在开发的需求卡住了已开发完成的需求上线，就需要把commit抽出来单独处理， 2）开发分支中的代码记录被污染了，导致开发分支合到线上分支有问题，需要拉一条干净的开发分支，再从旧开发分支中，把commit复制到新分支

- 复制单个
1. 在feature分支上，查看commi记录，把需要的commit_id复制下来
2. 切换到master分支， git cherry-pick commit_id，把该commit_id的内容应用到master分支
3. 可以看到已经有了一个新的commit，commit_id和之前的不一样，但提交时间还是保留之前的

- 复制多个
git cherry-pick commit_id1 commit_id2

- 区间复制（多个连续的commit,包括头尾两个commit，左边的是最早的提交)
git cherry-pick commit_id1^..commitid_2

- cherry-pick 代码冲突
有多个commit时，可能会遇到代码冲突，这时cherry-pick会停下来，让用户决定如何继续操作

不如要把c d e都复制到master分支上，c成功了，到d时发现代码冲突，cherry-pick中断。这时需要解决代码冲突，重新提交到暂存区

在使用 cherry-pick --continue 让 cherry-pick 继续，最后e也被复制进去，流程完成。

如果在代码冲突后，要放弃或退出流程：

```javascript
git cherry-pick --abort // 放弃，回到cherry-pick前的样子
git cherry-pick --quit // 不回到操作前的样子，即保留已经cherry-pick成功的commit，并退出流程
```
### reflog
reflog记录了所有commit操作记录，便于错误操作后找回记录。找到错误提交的那次commit_id，再reset回去

### 设置短命令
git config --global alias.ps push

或打开全局配置文件
```javascript
vim ~/.gitconfig

[alias] 
    cp = cherry-pick

// 使用
git cp commit_id
```

### git HEAD detached from a branch
会有一条commit，
```javascript
$git branch
*(detached from rear-1.16)
master
```
solution: **create a temporary branch from the detached HEAD, and then merge that branch into master, to get the missing commits back into the master branch**
```javascript
git branch temp-branch
git checkout master
get merge temp-branch
git push origin master
git branch -d temp
```

如果此 detached state 是你期望的，可以强制推送： git push origin HEAD:master --force. 但是会影响到其他check out了这个分支的用户。

基本流程
1. 创建本地仓库 git init
2. 链接本地仓库与远端仓库 git remote add origin URL，origin默认是远程仓库别名，url可以使用https,或ssh的方式新建
3. 检查配置信息 git config --list
4. 配置用户名和邮箱 git config --global user.name ....
5. 生成SSH密钥
6. 查看远端仓库信息 git remote -v
开始开发