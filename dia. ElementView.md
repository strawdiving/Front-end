# dia. ElementView

joint.dia.Element模型的视图，extend自 joint.dia.cellView。继承自joint.dia.CellView，负责：渲染paper内的元素 ；处理元素的pointer事件 ；提供各种处理元素的方法（可视化）
要查找与特定元素（模型）关联的视图，使用paper的findViewByModel方法。
var elementView = paper.findViewByModel(element);

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `_removePorts``_renderPorts``_initializePorts`               | `implemented in ports.js`                                    |
| `className`                                                  | `在cellview的classname以外添加了element类`                   |
| `initialize`                                                 | `侦听model的change:position/size/angle/marker事件，并初始化ports` |
| `update(cell, renderingOnlyAttrs)`                           | `renderingOnlyAttrs属性覆盖model属性，渲染ports`             |
| `renderMarkup`                                               | `默认渲染`prototype.markup`。 如果默认markup不可取，在model上设置“markup”属性。` |
| `render`                                                     | `清空el后，1）renderMarkup(),2）找到'.rotatable'类的节点给rotatableNode，3）找到'.scalable'类的节点给scalableNode（并调用update()），4）resize(),5）rotate(),6）translate()` |
| `resize (cell, changed, opt) ，``translate (model, changes, opt)，``rotate` | ` `                                                          |
| `getBBox([opt])`                                             | `返回元素视图的边界框。如果opt.useModelGeometry选项设为true，将根据元素模型尺寸计算得到边界框（sticking out 突出元素外的SVG子元素将被排除）。与dia.Element.prototype.getBBox的区别在于，这里的边界框将根据joint.dia.Paper translate和scale进行调整。` |
| *Embedding mode methods*                                     |                                                              |
| `prepareEmbedding (opt)`                                     | 触发“to-front”事件                                           |
| `processEmbedding(opt)`                                      | clearEmbedding                                               |
| `finalizeEmbedding(opt)`                                     |                                                              |
| 交互、控制部分                                               |                                                              |
| `pointerdown(evt, x, y)，pointermove(evt, x, y)，pointerup(evt, x, y)，mouseenter(evt)，mouseleave(evt)` | `notify对应的element事件`                                    |


