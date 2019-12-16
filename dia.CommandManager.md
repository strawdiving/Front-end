## rappid- dia.CommandManager
CommandManager跟踪graph变化并允许来回追溯这些变化的历史记录，对可以撤消/重做的层数没有限制。

CommandManager监听graph变化，当任何cell的属性发生变化时，它将存储差异（command）, CommandManager将图形cell上的所有更改存储到undoStack中，并将每个还原reverted的更改存储到redoStack中，它允许您恢复存储在这些堆栈中的更改。

| `constructor`          | 最多需要3个参数                                              |
| ---------------------- | ------------------------------------------------------------ |
| `graph`                | 监听的graph                                                  |
| `cmdBeforeAdd`         | 在添加任何命令之前评估的一个函数，如果该函数返回false，则该命令不会被存储。通过这种方式，您可以控制哪些命令不会被注册为撤销/重做 |
| `cmdNameRegex`         | 指定CommandManager侦听的cell的属性的正则表达式，默认是/ ^（?:添加\|删除\|更改：\ w +）$ / |
| `revertOptionsList`    | 一组options属性名称，旨在传递给undo操作。它默认为['propertyPath']，也可以被定义为一个函数 |
| `applyOptionsList`     | 一组options属性名称，旨在传递给redo操作。它默认为['propertyPath']，也可以被定义为一个函数 |
| `undo(opt)`            | 将历史的一个命令传回去, 它接受一个选项参数（opt），它在函数对图形进行更改时应用。例如commandManager.undo（{undoneBy：'user123'}） |
| `redo(opt)`            | 回到之前的任何undo（）编辑的                                 |
| `cancel(opt)`          | 与undo（）相同，但不会将undo-ed命令存储到redoStack。因此取消的命令不能被重做 |
| `hasUndo()/hasRedo()`  | 如果在undoStack/redoStack中有东西，则返回true。              |
| `reset()`              | 清空undoStack和redoStack                                     |
| `initBatchCommand（）` | 使您能够将多个changes收集到一个command中, 这些commands可以用单个undo（）调用恢复. 从函数被调用的那一刻起，每一次在图上做出的改变都不会被存储到undoStack中。在调用storeBatchCommand（）之前，临时将更改保存在CommandManager中。 |
| `storeBatchCommand()`  | 调用函数storeBatchCommand（）通知CommandManager存储临时保存在undoStack中的所有更改. 为了存储更改，调用此函数的次数必须与调用initBatchCommand（）的次数相同。 |
|                        |                                                              |
|                        |                                                              |
