# dia. Link

图表link的基本模型，继承自joint.dia.Cell，并添加了一些links特定的属性和方法。
links有两个关键属性：source和target，定义了link的起点和终点。可以如下定义：
new joint.dia.Link({
        source: { id: 'source-id' },
        target: { id: 'target-id', port: 'port_id'}
});

### 属性

|                   |                                                              |
| ----------------- | ------------------------------------------------------------ |
| `markup`          | `links默认的markup，``'<path class="connection" stroke="black" d="M 0 0 0 0"/>',``'<path class="marker-source" fill="black" stroke="black" d="M 0 0 0 0"/>',``'<path class="marker-target" fill="black" stroke="black" d="M 0 0 0 0"/>',``'<path class="connection-wrap" d="M 0 0 0 0"/>',``'<g class="labels"/>',``'<g class="marker-vertices"/>',``'<g class="marker-arrowheads"/>',``'<g class="link-tools"/>'` |
| `labelMarkup`     | label的markup                                                |
| `toolMarkup`      | link-tool的markup                                            |
| `vertexMarkup`    | 显示/删除顶点的默认markup. 这些元素是.marker-vertices元素的子元素（请参阅`this.markup`）。只有.marker-vertex 和 .marker-vertex-remove元素有特殊意义，前者用于拖动顶点（改变它们的位置），后者用于移除vertices. |
| `arrowheadMarkup` | 箭头的markup                                                 |
| `defaults`        | {type,source,target}                                         |

### events
- change – link上的任何改变触发的通用事件
- change:source – link改变source时触发
- change:target - link改变target时触发
- change:attrs - link改变attributes时触发
- change:smooth - link 切换插值interpolation时触发
- change:manhattan - link toggled orthogonal routing切换正交路由时触发
- change:vertices - link 更改其顶点vertices数组时触发
- change:z - link在z级别移动时触发 (toFront and toBack)
- transition:start - transition开始时触发
- transition:end – transiton结束时触发

link.on('change:source', function() { alert('source of the link changed') })

### Prototype方法

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `addTo(graph) `                                              | `将link添加到graph上，等同于graph.addCell(link)`             |
| `attr(attrs)`                                                | `在子元素上设置SVG属性。这类似于Joint.dia.Element的attr方法。attrs对象的键是和（组成link的）SVG元素相匹配的CSS选择器，值是包含SVG属性及其值的对象。`` attrs对象将与link模型的attrs属性混合使用。这是仅重写SVG元素的部分属性的简便方法。要覆盖所有SVG元素的所有属性，使用link.set（'attrs'，attrs）。在link的标记如下` |                                                         |
| `clone()`                                                    | `返回具有相同属性的link的新实例`                             |
| `disconnect()`                                               | `断开与源和目标元素的连接。源和目标然后成为[0,0]处的一个点`  |
| `findView(paper)`                                            | `在paper中查找link模型的视图，等价调用paper.findViewByModel（link）的快捷方式` |
| `getSourceElement()/getTargetElement()`                      | `返回link的源/目标元素，如果没有则返回null`                  |
| `getAncestors()`                                             | `返回从直接parent一直到最远祖先的该link的所有祖先组成的数组` |
| `getTransitions()`                                           | `返回所有活动的transitions（它们的路径）组成的数组`          |
| `hasLoop([opt]) `                                            | `如果此link是” loop link ”（即source和target相等），返回true。如果opt.deep 为true，” loop link ”的概念扩展到深层次结构。例如，如果link将父元素和其中一个嵌入元素相连接，则也被视为” loop link ”` |
| `isEmbeddedIn(element [, opt]) `                             | `如果link嵌入到element元素中，则返回true。opt.deep为false，只有直接的parentage血统会被检查，默认为true` |
| `label(index, properties, opt)`                              | `在按index索引的标签上设置properties。link可以有多个标签，每个标签有不同的位置和属性。` |
| `prop(properties) `                                          | 在元素模型上设置可能嵌套的属性。等价attr（），但用于自定义数据属性 |
| `remove() `                                                  | 从graph中移除link                                            |
| `removeAttr(path, [options])`                                | 从链接中删除以前设置的属性。path可以是一个字符串，用于指定要删除的（可能嵌套）属性的路径或多个路径的数组。关联的link view确保link得到适当的重新渲染。如果传递options，则options可以包含传递给事件侦听器的数据，该事件侦听器侦听link本身以及link所在的graph上触发的change:attrs事件。 |
| `reparent()`                                                 | 自动查找并设置链接的最佳父元素，以便在移动父元素时，链接及其所有顶点也会移动。最好的parent被确定为该链接的源元素和目标元素的共同祖先。对分层图很有用。请参阅DEVS demo如何使用它 |
| `scale(sx, sy, origin[, opt])`                               | 相对于给定原点缩放link的点（vertices）                       |
| `stopTransitions([path])`                                    | 停止所有正在运行的转换。如果提供了参数路径，它将仅停止此路径指定的转换 |
| `toBack(),toFront()`                                         | 移动link使其位于所有其他cells（elements/links）的后面/前面。类似于element的该方法 |
| `toJSON()`                                                   | 返回link属性的副本用于JSON序列化。类似于element的该方法。    |
| `translate(tx, ty, [opt])`                                   | 平移link的vertices（以及source和target，如果他们也是点的话），在x轴方向上平移tx像素，y轴方向上平移ty像素。可选的options 对象opt可用于将其他参数传递给监听link或graph上change事件的事件处理程序 |
| `transition(path, value [, opt])`                            | 允许在一段时间内逐渐改变link的属性。类似element的该方法      |

```javascript
{  markup: <string>, 
position: <number>, 
attrs: { <selector>: <SVG attributes | JointJS attributes> }
}

默认标签markup定义如下：
<g class="label">
<rect />
<text />
</g>  // rect是标签下方的一个box
link.label(0, {
    position: .5,
    attrs: { rect: { fill: 'white' },text: { fill: 'blue', text: 'my label' }}
});
//注意，所有标签都存储在link模型中属性labels下的的数组中。
link.prop('labels'); // 返回label properties的数组
```
- position是标签相对于link .connection SVG路径的位置，它应该是一个具有distance和offset属性的对象，distance定义如下：
- 如果distance是在[0,1]间隔内，标签的位置被认为是定义为.connection路径总长度的百分比
- distance >1，标签将放置在距离.connection路径的开始处distance像素远的地方
- distance <0，标签将放置在距离.connection路径的末尾Math.abs（distance）像素远的地方
offset定义如下：
- 如果将offset定义为数字，则标签的位置会沿垂直于路径的方向向左（<0）或向右（> 0）方向移动Math.abs（offset）距离
- 如果定义为具有x和y属性的对象，标签在paper局部坐标系中移动x和y

```javascript

 <path class="connection"/ >   
 < path class="marker-source"/>   
 < path class="marker-target"/>   
 < path class="connection-wrap"/>   
 < g class="labels" />   
 < g class="marker-vertices"/>   
 < g class="marker-arrowheads"/>   
 < g class="link-tools" /> 
 
 link由几个SVG path元素和几个SVG group元素组成：
 ``.connection  link的实际线
 ``.connection-wrap  一个SVG路径元素，覆盖（cover）.connection元素并且通常更thicker以便link能处理那些没能精确指向（通常很thin的）.connection路径的pointer事件（mousedown，mousemove，mouseup）
 ``.marker-source和.marker-target是link的箭头
 ```
 
 ### dia.link自己实现的
 
 |                                                              |                                                    |
| ------------------------------------------------------------ | -------------------------------------------------- |
| disconnect(), label(index, properties, opt), translate(tx, ty, [opt]), scale(sx, sy, origin[, opt]), getSourceElement()/getTargetElement() , reparent(),hasLoop([opt]) |                                                    |
| `applyToPoints(fn,opt)`                                      |                                                    |
| `getRelationshipAncestor`                                    | 返回源元素，目标元素和链接本身的共同祖先           |
| `isRelationshipEmbeddedIn(cell)`                             | 源，目标和链接本身是否嵌入给定的cell中             |
| `endsEqual(a,b)`                                             | a、b的id相等，如果有port，port也相等时，才返回true |

### presentation
link的形状由vertices, connector 和 router属性决定。vertices数组包含点的列表，这些点是link会交叉的点。
link.get('vertices')
link.set('vertices', [{ x: 100, y: 120 }, { x: 150, y: 60 }])
router采集在模型上定义的vertices数组，并将它们转换为link应该通过的点的数组（route）
vertice和route的区别在于vertice是用户定义的，而route是计算出来的。

有四个内置的routers  (manhattan, metro, orthogonal and oneSide) 供使用。前两个是所谓的“smarter router”，它们会自动避免妨碍他们的元素。
orthogonal, manhattan 和 oneSide routers生成只能通过垂直和水平线段连接的点， metro router生成可以用对角线段连接的点。
link.set('router', { name: 'manhattan' });

manhattan router有一些额外的有用选项可以决定算法的行为。这些选项可以传递给args属性，并且是：
- excludeTypes - 不应被视为障碍的元素类型数组
- excludeEnds - “source”或“target”字符串，用于告诉算法处于link该指定端的元素不应被视为障碍物
- startDirections - link可以从其开始的link source元素的边的数组，默认是所有边['left', 'right', 'top', 'bottom']，如果您想要link，例如始终从源元素的底部开始（值将为['bottom']）
- endDirections - link可以指向的link target元素的边数组。默认是所有的边['left', 'right', 'top', 'bottom']

```javascript
link.set('router', {
    name: 'manhattan',
    args: {
        startDirections: ['top'],
        endDirections: ['bottom'],
        excludeTypes: ['myNamespace.MyCommentElement']
    }
});

link.set('router', {  name: oneSide',  args: {side: 'top', padding: 30}});
```
oneSide在给定方向上routes该link，恰好创建三个正交段。它接受以下选项：
side ——路线的方向，either 'left', 'right', 'top' or 'bottom' (default).
padding——连接点与 first/last vertex之间的最小间隙，默认为40

connector获取由router返回的点，并生成SVG路径命令以渲染link。有四个连接器（normal, smooth, rounded和jumpover）供使用。
- normal connector用直线连接点；
- rounded connector一样，但它平滑了所有的边缘，也以通过传递给rounded connector的radius参数来指定。
- smooth connector使用三次贝塞尔曲线对点进行插值
link.set('connector', { name: 'rounded', args: { radius: 10 }});
- jumpover connector绘制直线, 并在和另一个link交叉的位置绘制小弧形，接受以下选项：
- size——jump的大小，默认为5
- jump——jump的风格，'arc' (default), 'cubic' 或 'gap'.
link.set('connector', { name: 'jumpover', args: { type: 'gap' }});
router和connector都可以自定义，详见API文档


