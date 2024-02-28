# dia.Cell
extend自 BackBone.Model， diagram cells的基本模型。这是一个具有一些附加属性和方法的Backbone模型，具有唯一标识符，每个cell都有一个存储在id属性中的唯一ID。

### Methods

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `constructor (attributes, options)`                          | `和Backbone.Model基本相同，唯一差别是使用joint.util.merge而不仅仅使用_.extend.原因是我们想mixin在upper classes上层类中设置的属性.将attributes和defaults属性值合并，来设置attrs属性值` |
| `initialize(options)`                                        | `设置id, 收集`attrs`中定义的ports并且每当`attrs`对象发生变化时继续收集` |
| `toJSON、remove(opt)、toFront(opt)、toBack (opt)、getAncestors、isEmbeddedIn(cell, opt)、clone(opt)、prop(props, value, opt)、attr(attrs, value, opt)、removeAttr(path, opt)、transition (path, value, opt, delim)、getTransitions、stopTransitions(path, delim)、addTo(graph, opt)、findView(paper)` | `ele和link各自实现`                                          |
| `embed(cell, opt)、unembed(cell, opt)、getEmbeddedCells(opt)` | ele实现                                                      |
| `isElement，isLink`                                          | `均返回false，对应元素和link时返回true`                      |
| `isEmbedded`                                                 |                                                              |
| `removeProp(path, opt)`                                      |                                                              |
| `startBatch(name, opt)``stopBatch(name, opt)`                | `调用graph的startBatch和stopBacth函数，传入{cell:this}属性`  |
| `getAttributeDefinition(attrName)`                           |                                                              |
| **define**                                                   | 帮助定义新的Cell类或扩展现有的类。type必须是类的唯一标识符，它决定了class definition在joint.shapes命名空间中的位置（typ是由“.”分隔的class definition的路径）。在创建cell的实例时，任何未指定的属性都将设置为defaultAttributes中的值。 |
| define(type [,defaultAttributes, prototypeProperties, staticProperties]) |                                                              |

```javascript
var Ellipse = joint.dia.Element.define('examples.Ellipse', {。。。});
var el1 = (new Ellipse).position(100,100).size(120,50).addTo(graph);

// Define a new ColoredEllipse class that inherits from Ellipse.
var BlueEllipse = Ellipse.define('examples.ColoredEllipse', {  attrs: { ellipse: {fill: black'}}
}, {
  // Prototype methods
  changeColor: function() {return this.attr('ellipse/stroke', this.constructor.getRandomColor());}  
}, {
  // Static methods
  getRandomColor: function() {return '#' + Math.floor(Math.random() * 16777215).toString(16);}
});
var el2 = (new ColoredEllipse).changeColor().size(120,50).addTo(graph);
```
# dia.CellView
joint.dia.Cell模型的view。继承自Backbone.View并负责：渲染paper内的cell；处理cell的pointer事件；提供各种处理cell的方法（可视化）
要查找与特定cell（模型）关联的view，请使用paper的findViewByModel方法:
var cellView = paper.findViewByModel(cell);
extend自 BackBone.mvc.View

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `tagName`                                                    | `‘g’`                                                        |
| **svgElement**                                               | **true**                                                     |
| Methods                                                      |                                                              |
| `constructor (options)`                                      | `确保为此view分配全局唯一标识global unique id，guid()`       |
| `init`                                                       | `设置id, 收集`attrs`中定义的ports并且每当`attrs`对象发生变化时继续收集` |
| `className`                                                  | `如 cell type-custom type-custom-movel,根据type添加classnames` |
| `attributes`                                                 | `初始只有model-id属性`                                       |
| `onChangeAttrs (cell, attrs, opt)`                           | `render或者update attrs`                                     |
| `can (feature)`                                              | `如果允许cell link 执行certain UI `feature`，则返回`true` ``example: `can('vertexMove')`, `can('labelMove')`` |
| `findBySelector (selector, root)`                            | `通过selector查找元素`                                       |
| `notify (eventName)`                                         | `在元素本身和paper上触发事件`                                |
| `getStrokeBBox (el)`                                         | `返回考虑stroke的边框bounding box矩形`                       |
| `getBBox`                                                    | ` `                                                          |
| `highlight (el, opt)``unhighlight(el, opt)`                  | `触发cell:highlight, cell:unhighlight事件`                   |
| `findMagnet(el)`                                             | `找到“magnet”属性设置为“true”的最近元素. 找不到则返回cell view的根元素` |
| `getSelector (el, prevSelector)`                             | `在这个视图中为`el`元素构造一个唯一的选择器.```prevSelector` 正在通过递归调用收集``No value for `prevSelector` is expected when using this method.``el.tagName:nth-child(n)>xxx` |
| `getAttributeDefinition(attrName)`                           | `调用model的该方法`` `                                       |
| `setNodeAttributes (node, attrs)`                            | `设置node的attrs属性`                                        |
| `processNodeAttributes(node, attrs)`                         | `将node的attributes分类存储，分为raw, normal, set, position, offset` |
| `updateRelativeAttributes (node, attrs, refBBox, opt)`       | `对normal, set, position, offset几类特殊的属性分别处理`      |
| `getNodeScale (node, scalableNode)`                          | `检查node是否是scalable group的后代，返回scale对象`          |
| `findNodesAttributes (attrs, root, selectorCache)`           | ` `                                                          |
| `updateDOMSubtreeAttributes (rootNode, attrs, opt)`          | `默认是处理`model.attributes.attrs`对象，除非传递了`attrs`参数,否则设置subelements based on the selectors的属性` |
| `mergeProcessedAttributes (processedAttrs, roProcessedAttrs)` | ` `                                                          |
| 交互、控制部分                                               |                                                              |
| `pointerdblclick(evt, x, y)，pointerclick(evt, x, y)，pointerdown(evt, x, y)，pointermove(evt, x, y)，pointerup(evt, x, y)，mouseover(evt)，mouseout(evt)，mouseenter(evt)，mouseleave(evt)，mousewheel(evt, x, y, delta)，contextmenu(evt, x, y)，event(evt, eventName, x, y)，setInteractivity(value)` | `notify对应事件``交互由paper处理并委托给the view in interest.``// 传递给这些函数的`x` & `y` 参数表示已经被捕获/对齐到paper网格(snapped to the paper grid)的坐标``// 如有必要，可以从`evt`事件对象获得真实坐标.``// 这些函数应该被从`joint.dia.Cell`继承的views, 即`joint.dia.Element` 和`joint.dia.Link`覆盖` |
| **prorotype.highlight/unhighlight**                          | cellView.highlight([el[, options]]) 突出显示cell view cellView.unhighlight([el[, options]]) 删除正在对cell执行的突出显示 |
|                                                              | 参数：el-如果未提供， 就使用cell view的$el；options- highlighter: 1）name – highlighter的名字；2）options -一个将直接传递给name指定的highlighter的选项对象；type: highlighting的类型（embedding, connecting, magnetAvailability, or elementAvailability）。                 注意，如果使用自定义选项突出显示单元格，则在使用unhighlight方法时必须提供完全相同的选项。 |
|                                                              |                                                              |

