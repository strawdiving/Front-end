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