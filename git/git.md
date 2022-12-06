
## 工作区和暂存区
git仓库三个组成部分：
1. 工作区（working directory）

在git管理下的正常目录都算工作区，平时编辑都在这里完成。本地编写的代码，不执行任何git命令，出于工作区。
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

### 2. 
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

## 分支操作
1. 创建本地分支： git branch xxx
2. 切换分支： git checkout xxx
3. 创建并切换分支： git checkout -b xxx(相当于1, 2的合并)
4. 查看本地分支： git branch
5. 查看远程仓库所有分支： git branch -a 
6. 删除本地分支： git branch -d xxx
7. 分支合并： git merge master (将master分支合并到当前分支)
8. 本地分支重命名： git branch -m oldName newName
9. 远程分支重命名
    - 1. 重命名远程分支对应的本地分支： git branch -m oldName newName
    - 2. 删除远程分支： git push -delete origin oldName
    - 3. 上传新命名的本地分支： git push origin newName
    - 4. 把修改后的本地分支与远程分支关联： git branch --set-upstream-to origin/newName

### 分支关联
1. 查看当前的本地分支与远程分支的关联关系： git branch -vv
2. 把当前分支与远程origin的某分支进行关联处理（--set-upstream-to命令）：git branch --set-upstream-to origin/branchName

### 分支差异查看
1. 查看本地当前分支与远程某一分支的差异： git diff origin/feature/list
2. 查看本地特定分支与远程某一分支的差异： git diff master(本地分支) origin/feature/list（远程分支）

## 修改撤销

2. git reset HEAD <filename>: 把暂存区的修改撤销掉（unstage），重新放回工作区
3. git reset --hard commit_id：git版本回退，回退到特定的 commit_id 版本
    流程：
    1. git log 查看提交历史，以便确定要回退到哪个版本（commit_id)
    2. git reset --hard commit_id, 回退到commit_id版本
    - git reflog: 查看历史命令，以便确定要回到未来的哪个版本
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

### tag
commit记录打tag。上线前对当前的commit记录打一个tag，方便上线的代码有问题可以及时回滚。
1. git tag: 列出所有的tag列表
2. 创建一个tag： git tag <name>
3. 查看tag对应的commit信息： git show <tagName> ,上线后若有问题就可以根据此commit_id进行代码回滚。

## 配置
- git config -l 列出所有git配置项
- git config core.ignorecase false 配置git不忽略大小写（默认忽略）

## 暂存
git stash 暂存当前正在进行的工作
- 添加缓存栈： git stash
- 查看缓存栈： git stash list
- 推出缓存栈： git stash pop
- 取出特定缓存内容： git stash apply stash2{1}