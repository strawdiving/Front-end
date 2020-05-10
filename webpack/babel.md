
## babel原理
babel的转译过程分为3个阶段：
1. 解析Parse（babylon），将代码解析生成抽象语法树（AST），即词法分析与语法分析
2. 转换Transform，对AST进行变换一系列的操作，babel接受得到AST并通过babel-tranverse对其进行遍历，在此过程中进行添加、更新、移除等操作
3. 生成Generate,将变换后的AST再转换为JS代码，使用babel-generator

- babel是如何将es6代码编译成es5的

### 进阶： 如何写一个babel插件