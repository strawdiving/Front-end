## dia.Paper
### events
- cell: pointerdown – 在cell上按下指针时触发cell. 参数cellView, evt, x 和 y.
- cell: pointermove – 已处理过cell: pointerdown事件之后，当指针在paper上移动时触发，参数为cellView, evt, x 和y
- cell: pointerup - 已处理过cell:pointerdown事件之后，当指针在paper上释放时触发。参数为cellView和 evt.
- cell: pointerdblclick - 当用户双击cell时触发 , 参数 cellView, evt, x 和 y 
- cell: pointerclick - 当用户点击cell时触发. 参数 cellView, evt, x 和 y
- cell: mouseover -当用户进入enters cellView或其子元素时触发. 参数为cellView和evt
- cell: mouseout -当用户离开enters cellView或其子元素时触发. 参数为cellView和evt 
- cell: mouseenter -当用户进入cell view区域时触发. 参数为cellView和evt
- cell: mouseleave - 当用户离开cell view区域时触发. 参数为cellView和evt
- link: mouseenter -当用户进入link view区域时触发. 参数为cellView和evt
- link: mouseleave -当用户离开link view区域时触发. 参数为cellView和evt.
- element: mouseenter -当用户进入element view区域时触发. 参数为cellView和evt 
- element: mouseleave -当用户离开element view区域时触发. 参数为cellView和evt.
- blank: pointerdown – 在paper上的空白区域按指针时触发. 参数为evt, x和 y
- blank: pointerdblclick - 在paper上的空白区域双击时触发. 参数为evt, x和 y
- blank: pointerclick - 在paper上的空白区域单击时触发. 参数为evt, x和 y.
- cell: mousewheel -当鼠标在paper上的cell上，用户转动鼠标滚轮时触发，参数为cellView, evt, x, y, delta.
- blank: mousewheel -当鼠标在paper上的空白区域上，用户转动鼠标滚轮时触发，参数为evt, x, y, delta
- cell: contextmenu – 用户在paper上右击cell时触发，参数为cellView, evt, x 和 y
- blank: contextmenu -用户在paper上右击空白区域时触发. 参数为 evt, x和y.
- render: done - 当paper已完成渲染所有cell views时触发，以防启用async rendering异步渲染。triggered when the paper has finished rendering all the cell views in case async rendering is enabled.
- link: connect -当link连接到cell时触发，参数为 linkView, evt, elementViewConnected, magnet, arrowhead.
- link: disconnect -当link从cell断开时触发参数为linkView, evt, elmentViewDisconnected, magnet, arrowhead
- cell: highlight -在元素或链接上调用highlight（）方法时触发. 注意，当用户重新connect link并且connection有效时（validateConnection（）返回true），或者如果在paper上启用了embeddingMode，并且拖动元素位于另一个（该拖动元素可以被拖放到dropped in的，即validateEmbedding（）返回true）元素的上方时，该方法也会被调用。该事件的处理程序具有以下签名：function（cellView，el），处理程序默认为函数function(cellView, el) { V(el).addClass('highlighted') }。换句话说，添加了'higlighted'CSS类，因此可以在CSS中突出显示元素的样式。如果要使用不同的方法突出显示单元格，请首先调用paper.off（'cell：highlight'）以取消注册默认处理程序，然后使用paper.on（'cell：highlight'，myHandler）注册自己的。
- cell: unhighlight -在元素或链接上调用unhighlight（）方法时触发

```javascript
paper.on('blank:pointerdown', function(evt, x, y) {
    alert('pointerdown on a
blank area in the paper.')})
```

### prototype方法

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `cancelRenderViews()`                                        | 当调用该方法时，任何正在进行的异步渲染都将被取消。           |
| `clearGrid()`                                                | 隐藏当前网格                                                 |
| `clientOffset()`                                             | 返回相对于应用程序的client area的paper viewport的坐标        |
| `clientToLocalPoint(p)/ pageToLocalPoint(p)/ paperToLocalPoint(p) ` | 将由点p表示的客户端坐标转换为paper的本地坐标。当你有一个鼠标事件对象，并且想要paper内的对应于事件clientX和clientY点的坐标时特别有用。   将页面/paper坐标系中定义的点p转换为本地坐标系。   var localPoint1 =   paper.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });   // alternative method signature   var localPoint2 =   paper.clientToLocalPoint(evt.clientX, evt.clientY); |
| `clientToLocalRect(rect)/ pageToLocalRect(rect)/ paperToLocalRect(rect)` | 将客户端/页面/paper坐标系中定义的矩形rect转换到本地坐标系中  ||
| `localToClientPoint(p)/ localToPagePoint(p)/ localToPaperPoint(p)` | 将本地坐标系中定义的点p转换为客户端/页面/paper坐标系。   var rightMidPoint =   element.getBBox().rightMiddle();   var clientPoint1 =   paper.localToClientPoint(rightMidPoint); |
| `localToClientRect(rect)/ localToPageRect(rect) / localToPaperRect(rect)` | 将本地坐标系中定义的rect矩形转换为客户端/页面/paper坐标系    |
| `defineFilter(filterDefinition)`                             | 定义一个SVG过滤器，以便以后在paper上重复使用。该方法返回过滤器ID，并且filterDefinition必须具有以下形式：   {name: <name of the filter>, args:   <filter arguments>}   以下是内置过滤器的列表（blur/dropShadow/grayScale）。所有这些过滤器都在joint.util.filter命名空间中定义。该命名空间可以扩展。   详见API文档 |
| `defineGradient(gradientDefinition)`                         | 定义一个SVG gradient，以便以后在paper上重复使用。该方法返回gradient ID，并且gradientDefinition必须具有以下形式：   {      type: <type of gradient>,         stops: <stop colors>,         attrs: <additional attributes>   }详见API文档 |
| `defineMarker(markerDefinition)`                             | 定义SVG标记以便以后在paper中重复使用。该方法返回标记ID，markerDefinition是一个具有type属性和任何其他可视属性的对象, 类型的有效值为 'path', 'circle', 'ellipse', 'rect',   'polyline' 和 'polygon' |
| `drawBackground(opt) `                                       | 用opt定义的对象设置paper背景                                 |
| `drawGrid([opt]) `                                           | 在纸上绘制可视网格线。可能的选项：   color-网格线的颜色，thickness-网格线的粗细（pix） |
| `findView(element)`                                          | 查找与纸张中DOM元素关联的视图（joint.dia.ElementView或joint.dia.LinkView的实例）。元素可以是DOM元素，jQuery对象或CSS选择器。   `有时候，为DOM中的元素查找view对象是很有用的。此方法找到view元素的任何子元素的最近视图。` |
| `findViewByModel(model)`                                     | 查找与模型关联的视图（joint.dia.ElementView或joint.dia.LinkView的实例）。模型可以是joint.dia.Element或joint.dia.Link的一个实例。 |
| `findViewsFromPoint(point)`                                  | 在paper中的某个点查找views（joint.dia.ElementView的实例）, 返回边界框包含点的视图数组。注意，视图可能会重叠，因此可能会有多个视图。这个方法和joint.dia.Graph：findModelsFromPoint方法有差异，视图的边界框可以不同于由元素模型position和size计算的面积。例如，如果shape中的<text> SVG元素相对定位并向下移动到正常shape区域下方（例如使用JointJS特殊属性）, 视图的边界框将比模型的边框更大。 |
| `findViewsInArea(rect[, opt])`                               | 在纸张的某个区域查找视图（joint.dia.ElementView的实例）. 返回其边界框与矩形rect相交的views的数组。如果opt.strict为true，返回边界框包含在矩形rect内的视图数组（即不仅与其相交）。 |
| `fitToContent([opt])`                                        | 展开/收缩纸张以适应其内容. 将结果宽度/高度捕捉到由opt.gridWidth / opt.gridHeight定义的网格，opt.padding会增加纸张的宽度/高度。   opt.padding可以是一个数字，在这种情况下，它表示所有边上的填充；或者它可以格式如下的一个对象{top：Number，right：Number，bottom：Number，left：Number}。   默认情况下，该方法将纸张仅适用于具有正坐标的内容，并将结果纸张的原点设置为（0,0）。要改变这种行为，请使用allowNewOrigin：['negative'\|'positive'\|'any']选项，将allowNewOrigin设置为'negative'考虑使用负坐标的内容，将allowNewOrigin设置为'positive'以允许将原点设置为内容的左上角坐标，将allowNewOrigin设置为'any'，对两者都适用。   这种方法可能会内部触发可以通过监听纸对象（paper.on（'resize'，myHandler））来处理的“resize”和“translate”事件。opt.minWidth和opt.minHeight定义纸张的最小宽度和高度, opt.maxWidth和opt.maxHeight在将纸张适应内容后定义纸张的最大宽度和高度。   例子可见paper demo |
| `getContentBBox()`                                           | 返回paper内内容的边界框                                      |
| `isDefined() `                                               | 如果在paper中已经定义了带graphicalObjectId的 graphical对象（gradient, filter, marker），则返回true。否则返回false。 |
| `matrix([SVGMatrix])`                                        | 当不带参数调用时，该方法返回paper的当前转换矩阵（SVGMatrix的实例）, 否则，它将基于SVGMatrix设置新的 viewport transformation。   paper.matrix({ a: 2, b: 0, c: 0, d: 2, e:   0, f: 0 }); // scale the paper twice |
| `pageOffset()`                                               | 返回paper viewport相对于document的坐标                       |
| `properties属性`                                             | 以下列表包含paper对象公开的properties属性：         -  svg – paper的（用于渲染所有图形的）SVG文档对象的引用reference。      -  viewport - SVG   group <g> 元素的引用，paper用该元素将所有rendered elements和links包装起来。在这个元素上执行scale等paper transformations   -  defs - [SVG 元素](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs)的引用，该元素用于定义SVG元素供后续使用，这也是放置SVG patterns, filters和gradients的好地方。   `通常不需要直接访问这些属性，但在某些（高级）情况下，访问它们非常方便。` |
| `scale([sx, sy, ox, oy])`                                    | 通过x轴上的sx因子和y轴上的sy因子来缩放纸张。ox和oy是可选的，用于确定scale变换的原点。该方法有效地实现了纸张放大/缩小。如果该方法被调用，则在纸上触发“scale”事件。当不带参数调用该方法时，将返回当前的纸张scale transformation。   paper.scale(2) // scale 2x (uniformly)   paper.scale(2,3) // scale 2x in `x` axis   3x in `y` axis (non-uniformly)   paper.scale(2,2,100,100) // scale with the   origin of the transformation at point `x=100` and `y=100`   `paper.scale() // returns e.g. { sx: 2, sy: 2 }` |
| `scaleContentToFit([opt])`                                   | 缩放纸张内容以适合纸张尺寸。详见API文档，及paper demo        |
| `setDimensions(width, height)`                               | 更改纸张的尺寸。应始终将尺寸传递给joint.dia.Paper构造函数的选项对象。如果需要，使用setDimensions（）稍后更改纸张的尺寸。如果调用该方法，则会在纸张上触发“resize”事件 |
| `setGridSize(gridSize)`                                      | 设置纸张的网格大小                                           |
| `setInteractivity(interactive)`                              | 设置纸张的交互性。例如，要禁用交互性：paper.setInteractivity(false); |
| `setOrigin(x, y) `                                           | 不推荐使用translate（）, 让您修改纸张的原点（零坐标）。原点也可以传递给joint.dia.Paper构造函数的options对象。如果该方法被调用，则在纸上触发“translate”事件 |
| `translate(x, y)`                                            | 让您修改纸张的原点（零坐标）. 如果在没有参数的情况下调用该方法，则返回当前的paper translate transformation |
|                                                              |                                                              |

```javascript
 var bcr = paper.svg.getBoundingClientRect();<br/>var localRect1 = paper.clientToLocalRect({ x: bcr.left, y: bcr.top, width: bcr.width, height: bcr.height }); // alternative
method signature
var localRect2 = paper.clientToLocalRect(bcr.left, bcr.top, bcr.width, bcr.height);
// Move the
element to the center of the paper viewport.
var localCenter = localRect1.center();
var elSize = element.size();
`element.position(localCenter.x - elSize.width, localCenter.y - elSize.height);
```
