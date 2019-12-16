# dia.Graph

joint.dia.Graph是包含graph的所有cells（元素和链接）的模型，是一个Backbone model。所有cells的collection存储在cells属性中。graph是所有JointJS图表背后的强大的数据模型。它不仅为directed graphs提供了高效的存储，而且为遍历graphs提供了有用的算法。
extend自 BackBone.Model

|                              |                                                              |
| ---------------------------- | ------------------------------------------------------------ |
| `_batches`                   | `{ }`                                                        |
| 在initialize中设置的私有属性 |                                                              |
| `_out`                       | `Outgoing edges per node.使用hash-table作为outgoing edges列表，用于快速查找,[node ID] -> Object [edge] -> true, 即this. _out:{ node.id: { edge: true }}` |
| `_in`                        | `Ingoing edges per node.``[node ID] -> Object [edge] -> true, 即this. _in:{ node.id: { edge: true }}` |
| `_nodes`                     | ``_nodes` 对于快速查找graph中的所有elements很有用, 无需go through整个cells array.`` [node ID] -> true, 即this. _nodes: { node.id: true }` |
| `_edges`                     | ``_edges` 对于快速查找graph中的所有links非常有用，无需go through整个cells array.``[edge ID] -> true, 即this. _edges: { edge.id: true }` |

### Methods

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| constructor                                                  | 此外，graph在其构造函数中接受一个option对象，该对象可包含cellNamespace选项，此选项可用于更改JointJS的默认行为，即默认情况下从joint.shapes名称空间读取cell 模型定义。例如，如果一个cell的类型为'myshapes.MyElement'，那么当从JSON格式反序列化一个graph时，graph就会查找joint.shapes.myshapes.MyElement模型。如果该图被实例化为例如var graph = new joint.dia.Graph（{}，{cellNamespace：myShapesNamespace}），那么该图将从myShapesNamespace.myshapes.MyElement对象中读取模型定义。这在不想使用joint.shapes命名空间来定义自己的自定义形状时非常有用。此选项通常与joint.dia.Paper对象上的cellNamespaceView选项结合使用。 |
| `initialize(attrs,opt)`                                      | `设置model的cells属性，初始化_out,_in,_nodes,_edges对象，设置add/remove/reset/change:source/remove等事件` |
| `_sortOnChangeZ`                                             | `根据batchName，对cells重新排序`                             |
| `_onBatchStop(data)`                                         | `根据batchName，对cells重新排序`                             |
| `_restructureOnAdd(cell)` `_restructureOnRemove(cell)` `_restructureOnReset(cell)`   _restructureOnChangeSource(cell)   _restructureOnChangeTarget(cell) | `cells的add、remove、reset、change: source，change: target事件调用,处理相关联的_out, _in, _nodes属性对象` |
| `getOutboundEdges(node)``getInboundEdges(node)`              | `返回节点的所有向外、向内的边outbound edges. 返回值是一个对象，格式为：[edge] - > true, {edge: true}` |
| `_prepareCell: function(cell, opt)`                          | `将this对象设置为cell的graph`                                |
| `_removeCell(cell, collection, options)`                     | `从cells collection里Silently 移除cell`                      |
| `set (key, val, opt)`                                        | `用key,value或{key: value}来设置attrs属性`                   |
| `maxZIndex`                                                  | ` `                                                          |
| bfs(element, iteratee, opt)                           dfs(element, iteratee, opt)` | `广度优先搜索/深度优先搜索,`iteratee` 是形式为`function(element, distance) {}`的函数.`` `element` 是当前访问的元素，`distance` 是该元素与传递给`bfs（）`的根元素（即我们开始搜索的元素）的距离.`distance` 不是最短或最长的距离, 仅仅是我们第一次访问`element`时所穿过的层数。这对于树形图特别有用``如果`iteratee`明确返回了`false`，则停止搜索` |
| `getCellsBBox (cells, opt)`                                  | `Return the bounding box of all cells in array provided. 忽略Links` |
| `resize (width, height, opt) ``resizeCells (width, height, cells, opt)` | `resize cells`                                               |
| `startBatch (name, data)`                                    | `触发batch:start事件`                                        |
| `stopBatch (name, data)`                                     | `触发batch:stop事件`                                         |
| `hasActiveBatch (name)`                                      | `this._batches是否有（名为name）batch`                       |

### prototype方法

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `addCell(cell[, opt])`                                       | `添加cell或cells，并设置cell的z索引``向graph中添加一个新的cell。如果cell是数组，则数组中的所有cell都将添加到图形中。` |
| `addCells(cells[, opt]) 或addCells(cell, cell, ..[, opt])`   | `向graph中添加新cells，一个个添加cell.。这只是一个包含addCell方法的便利方法。` |
| `clear([options])`                                           | `删除图中的所有cell。options对象可以可选地包含传递给graph cells remove事件的事件侦听器的附加数据。` |
| `cloneCells(cells)`                                          | `克隆cells数组中的所有cells（elements和/或 links），并返回一个对象，该对象将原始cell 的ID映射到clone（即格式为{[原始cell ID]：[clone]}），返回此对象而不是clone数组是因为这样可以知道为哪个对象创建了clone。``返回的clone总数等于cells.length。相比只循环遍历cells并在每个cell上调用cell.clone（），这个函数并不简单地clone所有的cells，它也重构了cells内的所有source/target和parent/embed引用。例如，对于图A --- L ---> B，cloneCells（[A，L，B]）{返回A.id：A2，L.id：L2，B.id：B2}，产生图A2 --- L2 ---> B2，即link L2的源和目标被改变为指向A2和B2。` |
| `cloneSubgraph(cells[, opt])`                                | `Clone整个子图(包括所有source/target位于子图中的connected links). 这相当于调用graph.cloneCells（graph.getSubgraph（cells））``If`opt.deep`is`true`, 也考虑到所有subgraph cells的所有embedded cells.``返回a map，格式: {[original cell ID]:[clone]}.` |
| `disconnectLinks (element[, opt])`                           | `断开所有与元素相关联的链接`                                 |
| `findModelsFromPoint (p)`                                    | `在graph中的某个点下查找elements（joint.dia.Element的实例）, 即元素的BBOx包含该点。返回边界框包含point的element的数组。注意，可能有多个elements，因为elements可能会重叠。` |
| `findModelsInArea (rect, opt)`                               | `在grap中的某个区域查找elements（joint.dia.Element的实例）.rect是具有x，y，width和height属性的对象。返回边界框top/left坐标落入rect矩形的elements的数组。` |
| `findModelsUnderElement (element[, opt])`                    | `查找位于element下的所有元素。opt.searchBy参数可以可选地确定“元素位于另一个元素below下面”的含义。可能的值是'bbox'（默认），'center'，'origin'，'corner'，'topRight'和'bottomLeft'。` |
| `fromJSON(json, [options])`                                  | `从JSON对象（不是字符串）加载graph。用JSON数据来设置attrs属性``var jsonString = JSON.stringify(graph)``// ... send jsonString to the server, store it to the // localStorage or do whatever you want ... later on``graph.fromJSON(JSON.parse(jsonString))` |
| `getBBox (cells[, opt])`                                     | `Return bounding box of all elements``返回包围所有给定cells的边界框。link被忽略。``var bbox = graph.getBBox(graph.getElements());``// { x: Number, y: Number, width: Number, height: Number }` |
| `getCell(id)`                                                | `通过cell的id从图中得到一个cell`                             |
| `getCells`                                                   | `获取graph中所有的elements和links`                           |
| `getCommonAncestor: (/* cells */)`                           | `返回所有作为参数传递的cells的共同祖先。例如，如果元素B嵌入在元素A中并且元素C也嵌入元素A中，则调用函数返回元素A。这也适用于任意的深层次结构。` |
| `getConnectedLinks(element, opt)`                            | `获取连接到cell`element`的所有inbound和outbound links``获取所有与该element相关的links。如果opt.inbound === true，只返回outbound links ，如果opt.deep为true, 所有连接到任何后代（embedded和深度embedded的）元素的link都将被返回。` |
| `getElements`                                                | `获取所有element，this. _nodes`                              |
| `getFirstCell、getLastCell`                                  | `获取图中的第一个/最后一个cell（元素或链接）。第一个/最后一个cell被定义为具有最低（最后面）/最高（最前面）z属性的单元格。` |
| `getLinks`                                                   | `获取图表中的所有link，this. _edges`                         |
| `getNeighbors(element[, opt])`                               | `获得element在图中的的所有邻居节点, 邻居是通过inbound或outbound link连接到element的所有元素。如果opt.inbound 为 true，只返回 inbound邻居（即连接这些邻居的link的target都是element）；opt.outbound 为 true，只返回 outbound邻居。如果opt.deep为true，也返回element内嵌入的所有元素的所有邻居。` |
| `getPredecessors(element[, opt]) getSuccessors(element, opt)` | `返回element的所有前置/后置元素的数组. 默认情况下，使用DFS算法（对返回元素的顺序很重要）。如果opt.breadthFirst设置为true，则改为使用广度优先搜索算法。 如果opt.deep设置为true，则也要考虑嵌入的元素。` |
| `getSources 即roots``getSinks 即leafs`                       | `获取graph的所有roots/leafs的数组. 即没有in/out edge的node，时间复杂度O(|V|)。` |
| `getSubgraph(cells[, opt])`                                  | `查找连接到cells数组参数中任何cell的cell（元素/链接），返回数组，数组元素为查找的结果。``这个函数循环遍历cells数组参数，如果当前cell是链接，它会收集其source/target元素；如果是element，则如果incoming和outgoing links的link两端（源/目标）都在cells数组参数中，收集其incoming和outgoing links。``例如，对于单个元素，结果就是该元素，对于一个link连接的两个元素：A --- L ---> B，getSubgraph（[A，B]）的结果是[A，L，B]，且getSubgraph（[L]）的结果也是[A，L，B]。``如果opt.deep为true, 当发现相邻的链接/元素时，也要考虑所有的嵌入式单元。` |
| `isNeighbor(elementA, element[, opt])`                       | `如果`elementB`是`elementA`的邻居，返回true``如果opt.deep设置为true，则考虑嵌入的元素``如果opt.outbound/ opt.inbound设置为true，则仅当elementB是elementA的successing/ preceeding邻居时才返回true` |
| `isPredecessor(elementA, elementB)``isSuccessor(elementA, elementB)` | `如果`elementB`是`elementA`的predecessor（前任） /successor（后任，继承者），返回true` |
| `isSource(element)``isSink(element)`                         | `如果`element`是root(即没有链接指向元素)/leaf(即没有链接从元素中出来)返回true.时间复杂度：O（1）。` |
| `removeCells(cells[, opt])或``removeCells(cell, cell, ..[, opt])` | `从图中移除给定的cells`                                      |
| `removeLinks (element, opt)`                                 | `删除所有与element关联的链接`                                |
| `resetCells(cells[, opt])或``resetCells(cell, cell, ..[, opt])` | `重置图中的cells，一次性更新图表中的所有cells。如果想要一次性替换所有cells，则这是一种向graph中添加cells的更高效的方法,用于批量操作和优化。使用新的模型列表替换collection``options对象可以选择性地包含传递给graph reset事件的事件侦听器的额外参数` |
| `search(element, iterate[, opt])`                            | `从element开始，跟着links遍历graph。这个函数是dfs（）或bfs（）的封装。默认情况下，它使用dfs（）。如果opt.breadthFirst设置为true，则将使用bfs（）。``通过将`opt.inbound`设为`true`, 可以改变搜索的方向.```opt.deep` 为`true`, 也要考虑embedded elements.```iteratee`是形式如`function(element) {}`的函数. 如果`iteratee`明确返回了`false`，则停止搜索.` |
| `toJSON（）`                                                 | `返回对象，表示已准备好用于JSON序列化的graph。这可以用于持久性或序列化。注意，此方法不会返回JSON字符串，而是可以使用JSON.stringify（）序列化为JSON的对象。``将model转化为JSON格式，且必须明确地在cells collection上调用`toJSON（）`` |

# dia.GraphCells
extend自Backbone.Collection

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| cellNamespace	                                               |joint.shapes                                                  |

### Methods

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| initialize(models, opt)                                      |设置集合的cellNamespace和graph属性                             |
| model(attrs, options)                                      |根据attrs.type属性，获取collection包含的model类实例（cell对象，Link或element）                            |
| comparator(model))                                      |`comparator` 获取cell的‘z' index, 便于cells基于`z` index排序                             |

### events
以下列表包含您可以互动的事件：
- change - graph中的任何更改触发的通用事件
- add -当新的cell添加到graph时触发
- remove -当从graph中移除cell时触发
而且，在elements或 links上触发的所有事件也会传播到graph中。

```javascript
graph.on('add', function(cell) { 
    alert('New cell with id ' + cell.id + ' added to the graph.') 
})
```
