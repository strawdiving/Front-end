## dia.Paper
joint.dia.Paper是joint.dia.Graph模型的视图，继承自Backbone.View，extend自 joint.mvc.View，当paper与graph相关联时，paper会确保添加到graph中的所有cells都自动渲染。

```javascript
var graph = new joint.dia.Graph
var paper = new joint.dia.Paper({
    el: $('#paper'),    width: 600,    height: 400,    gridSize: 10,    model: graph
});
var rect = new joint.shapes.basic.Rect({
    position: { x: 50, y: 70 },    size: { width: 100, height: 40 }
});
graph.addCell(rect);
```
paper会自动处理此更改并将该矩形呈现给其内部保存的SVG文档。

|                             |                                                              |
| --------------------------- | ------------------------------------------------------------ |
| className                   | **'paper'**                                                  |
| paper.options               |                                                              |
| `async`                     | 启用时，纸张通过graph.resetCells（）或graph.addCells（）异步地渲染添加到graph中的cells。当您想要将大量cells添加到graph中时，这非常有用。渲染性能的提升非常重要，并且不会阻挡用户界面UI。   该选项接受true，在这种情况下使用默认值，或接受{batchSize：<value>}格式的对象，您可以在其中指定每个动画帧中渲染的cell数量（默认值为50）。通常情况下，默认的batchSize可以很好地工作，但如果遇到性能问题，您可能需要尝试使用不同的值。   需要注意的是，当使用异步渲染时，某些cell views可能尚未出现在纸张中，要尝试通过paper.findViewByModel（），element.findView（）或link.findView（）方法访问它们。如果使用异步渲染，应该等待纸张触发render：done事件。 |
| `background`                | 定义纸张背景颜色和图像的对象。它默认为false，表示没有背景设置。配置对象可以具有以下属性：   color 设置paper背景颜色. 它接受CSS background-color属性接受的所有值   image 定义了背景图像文件的路径   position 对象 { x: Number, y: Number } 定义了背景图像文件的位置. 允许使用所有CSS background-position 属性值. 在这种情况下，所有的纸张转换都不会影响背景图像的位置。默认为 center.   size 对象{ width: Number, height: Number } 定义了背景图像文件的尺寸. 允许使用所有CSS background-size 属性值. 在这种情况下，所有的纸张转换都不会影响背景图像的位置。默认为auto.   repeat 定义了背景图像如何重复. 它接受CSS background-repeat属性接受的所有值以及很少的由JointJS定义的值：flip-x, flip-y, flip-xy和 watermark.默认 no-repeat.   quality 指定图像质量的系数(如 0.5 仅使用图像大小的50％来创建图案). 仅适用于JointJS repeat选项值。默认 1.   opacity 是 [0,1]范围内的值，制定背景图像的透明度 (0 完全透明).默认 1.   watermarkAngle 以度数表示的角度，表示水印图像的斜率。仅适用于 'watermark' repeat 选项. 默认20度.                 background: {color: '#6764A7',image: 'jointjs-logo.png',repeat: 'watermark',     opacity: 0.3} |
| `cellViewNamespace`         | joint.shapes(默认)，定义所有cell views的命名空间, 此选项可用于更改JointJS的默认行为。设置了cellViewNamespace，则纸张将从myShapesNamespace.myshapes.MyElementView   对象读取视图定义. 当不想使用joint.shapes命名空间来定义自己的自定义形状时有用。该选项通常与joint.dia.Graph对象的cellNamespace选项结合使用。 |
| `clickThreshold`            | 当mousemove事件数量超过clickThreshold时，mouseup后不再会触发pointerclick事件。它默认为0。 |
| `defaultConnector`          | 在model上没有定义connector时，links使用的connector，可以是对象如{ name: 'rounded', args: { radius: 5 }} 或一个函数。请参阅joint.dia.Link的Presentation部分以获取有关连接器的更多信息. |
| `defaultLink `              | 默认为new joint.dia.Link。定义在用户点击一个active magnet后添加到graph的link model（当用户click、drag和active magnet时应创建的链接（当通过UI从port创建链接时））。它也可以是格式如function（cellView，magnet）{}的函数，该函数必须返回一个类型为joint.dia.Link的对象 |
| `defaultRouter`             | 在model上没有定义router时，links使用的router,如对象{ name: 'oneSide', args: { padding: 10 }} 或一个函数 |
| `drawGrid`                  | 是否在paper的DOM元素上绘制网格线.e.g drawGrid: true, drawGrid: { color: 'red',   thickness: 2 }，详见[下方解释](#_drawGrid) |
| `el`                        | holding the container for the paper保存paper的容器的CSS选择器，jQuery对象或DOM元素 |
| `elementView`               | 负责将元素模型渲染到纸张中的对象. 默认为joint.dia.ElementView. 它也可以是一个形如function(element)的函数，接受element model ，并且应该返回一个负责将该模型渲染到屏幕上的对象（大多数情况下是joint.dia.ElementView的子类型）。 |
| `embeddingMode`             | 当设置为true时，纸张设置为嵌入模式. 在这种模式下，当拖动一个元素并拖放到另一个元素中时，下面的元素将成为所拖动元素的父元素（拖动元素会自动嵌入到父元素中）。同样，将某个元素从其父项中拖出时，该元素将自动从其父项中解除嵌入。嵌入模式还确保所有连接的链接和子元素具有适当的z索引集，以便它们保持可见。要控制哪些元素可以嵌入到其他元素中，请使用纸张上的validateEmbedding（）函数。这对分层图很有用。请参阅 DEVS demo看如何使用它。 |
| `gridSize`                  | 网格的大小,以像素为单位                                      |
| `guard(evt, view)`          | 防范paper处理浏览器UI事件. 这个函数的形式是function（evt，view），如果你想防止paper处理事件evt则返回true，否则返回false。这是一个高级选项,如果您有自己的处理事件的逻辑时可用。 |
| `width、height`             | paper的高度/宽度（以像素为单位）800，600                     |
| `highlighting`              | 配置每种交互类型使用哪个highlighter（以及哪个选项）。List of highlighting interactions:1)default -当没有指定时，默认的highlighter (及选项)， 2)connecting -当一个有效的link connection可以对一个元素进行时，3）embedding -在嵌入模式下当一个cell被拖拽到另一个cell上时,4)magnetAvailability -当显示可以进行有效连接的所有magnets时,5)elementAvailability - 当显示可以进行有效连接的所有elements时   new joint.dia.Paper({         highlighting: {             'default': {name: 'stroke', options: {padding: 3}},             connecting: {name: 'addClass', options: {className:   'highlight-connecting'}}         }   }) |
| `interactive`               | 如果设置为false，则与元素和链接的所有交互都将被禁用。如果它被定义为一个函数，那么函数被调用时，元素/链接视图（用户即将与之交互）作为第一个参数，后跟事件名称（'pointerdown'，'pointermove'，...），如果此函数的返回值为false，则此操作禁用交互。返回的值也可以定义为一个对象，以实现对交互的细粒度控制。以下是interactive对象的所有属性的列表，以仅禁用/启用交互的某些方面。此对象中未使用的属性在默认情况下处于启用状态。默认为{labelMove：false}。 |
|                             | LINK     arrowheadMove 箭头可移动、vertexMove vertex可移动、vertexAdd 可添加vertex、vertexRemove 可删除vertex、labelMove  可移动label、useLinkTools 使用link tool |
|                             | Elements: elementMove 可移动元素、addLinkFromMagnet 可以给magnet添加link |
| `linkConnectionPoint`       | linkConnectionPoint(linkView, view, magnet, reference) 此函数可让您自定义链接的sticky point ，函数必须返回链接粘贴到元素的点（带有x和y属性）。该函数采用链接视图，元素视图，链接应stick to的magnet（SVG元素）和参考点（最近的顶点或链接另一侧的sticky point ）。请注意，有一个实用函数shapePerimeterConnectionPoint可以直接传递给linkConnectionPoint参数。该功能试图在连接形状的周边找到最佳可能的连接点。详细信息请参阅功能文档。 |
| `linkPinning`               | 设为true，则link可以固定pinned到paper上. 即link source/target可以是一个点，e.g. link.get('source') ==> { x: 100, y: 100 }   如果您不想让用户拖动链接并将其放在paper空白区域的某个位置，则设置为false，结果是，只要用户将其放置在paper空白区域的某处，链接就会返回到其原始位置 |
| `linkView`                  | 负责将链接模型渲染到纸张中的对象。默认为joint.dia.LinkView. 它也可以是接收链接模型的形式为 function(link) 的函数，并且应该返回一个负责将该模型渲染到屏幕上的对象（大多数情况下是joint.dia.LinkView的子类型） |
| `markAvailable`             | 拖动链接（正在重新连接）时标记所有可用的magnet或元素。默认为false. 这给用户提示该链接可以连接哪些其他元素/端口. 可用的magnet/cell由validateConnection函数确定。在内部，可用magnet（SVG元素）被赋予'available-magnet'类名称，所有可用cells被赋予“'available-cell'”类名称。这使您可以更改highlight效果的样式。开始拖动link时标记它们，拖动停止时取消标记 |
| `model`                     | joint.dia.Graph对象                                          |
| `moveThreshold`             | 触发第一个pointermove事件之前所需的mousemove事件的数量，默认为0 |
| `multiLinks`                | 当设置为false时，一个元素可能不会有超过1个链接具有相同的来源和目标元素 |
| `origin`                    | paper的零坐标位置（默认为{x：0，y：0}，即左上角）            |
| `perpendicularLinks`        | 如果为true，链接将倾向于垂直于其关联的对象。默认为false      |
| `preventContextMenu`        | 阻止默认的上下文菜单动作（点击鼠标右键时）。默认为true       |
| `preventDefaultBlankAction` | 防止单击空白纸张区域时blank:pointer<action>的默认动作。将该选项设置为false将使纸张在触摸设备上的容器内可移动。默认为true。 |
| `restrictTranslate`         | 按给定bounding box限制元素的平移，   Option接受一个boolean: true，用户无法将元素移动到paper区域边界外,false 没有限制（默认false）；   或 方法 restrictTranslate: function(elementView) {   var parentId =   elementView.model.get('parent');   return parentId &&   this.model.getCell(parentId).getBBox();     },在这种情况下，它必须返回一个边界框，该对象定义了elementView所表示的元素可以移动的区域,例如，要通过由其父元素定义的边界框来限制嵌入元素的平移；   或bounding box: restrictTranslate: { x: 10,   y: 10, width: 790, height: 590 } |
| `snapLinks`                 | 启用后，强制一个拖动中的链接捕捉到给定半径内最近的元素/端口。该选项接受true，在这种情况下，使用默认值；或形式为{radius：<value>}的对象，可以指定半径（默认值为50）。 |
| `validateConnection`        | validateConnection(cellViewS, magnetS,   cellViewT, magnetT, end, linkView) 决定是否允许或禁止源 view/magnet（cellViewS / magnetS）和目标 view/magnet（cellViewT / magnetT）之间的连接。end 告知链接的哪一端(source/ target)正在被拖动，当改变end时，检查link connection是否可用。这对定义例如从元素A的POut端口开始的链接是否能连接到B的端口PIn有用。默认情况下，允许所有链接。 |
| `validateEmbedding`         | 默认为true。当一个元素被translated时，检查是否允许或禁止element embedding   一个函数，允许您在paper设为embeddingMode时控制将哪些元素嵌入到哪些其他元素中。函数签名是function（childView，parentView），如果childView元素可以嵌入到parentView元素中，则返回true。默认情况下，所有元素都可以嵌入到所有其他元素中（即无论如何，函数都会返回true）。 |
| `validateMagnet`            | validateMagnet(cellView, magnet) 决定当用户点击magnet时是否创建链接，默认情况下，这个函数对于没有明确设置为“passive”（通常是输入端口的情况）的magnet返回true。 |
| `findParentBy`              | 确定cell在paper上拖动时如何找到合适的parent.   有最高z-index 的cell (visually on the top)将会被选中. |
| `frontParentOnly`           | 如果enabled， 只有最前面的元素才会考虑嵌入is taken into account for the embedding.   如果disabled，（元素under the dragged view）拖动视图下的元素将逐个(from front to back)进行测试，直到找到有效的父元素 |
| `highlighterNamespace`      | 定义所有highlighters的命名空间                               |
| `events`                    | 'mousedown': 'pointerdown',     'dblclick': 'mousedblclick',       'click': 'mouseclick',   'touchstart': 'pointerdown',       'touchend': 'mouseclick',        'touchmove': 'pointermove',        'mousemove': 'pointermove',      'mouseover .joint-cell':   'cellMouseover',   'mouseout .joint-cell':   'cellMouseout',   'contextmenu': 'contextmenu',     'mousewheel': 'mousewheel',    'DOMMouseScroll': 'mousewheel',   'mouseenter .joint-cell':   'cellMouseenter',     'mouseleave   .joint-cell': 'cellMouseleave',   'mousedown .joint-cell [event]': 'cellEvent',    'touchstart .joint-cell [event]':   'cellEvent' |

### drawGrid
选择是否绘制纸张网格. 它可能是一个布尔值或一个对象。它默认为false。定义color和thickness以调整默认网格pattern：

|                             |                                                              |                                                              |
| --------------------------- | ------------------------------------------------------------ |------------------------------------------------------------ |
| color	                      |字符串	|默认网格模式的color|
| thickness	                  |number	|默认网格图案的thickness|
                  
还有一些预定义的网格模式dot, fixedDot, mesh, doubleMesh。如果您想要使用这些模式，请按以下方式定义drawGrid选项：

|                             |                                                              |                                                              |
| --------------------------- | ------------------------------------------------------------ |------------------------------------------------------------ |
|name	                      |字符串	|预定义模式的名称，dot, fixedDot, mesh, doubleMesh|
| args	                  |object 或array	|预定义网格模式的额外参数，它可以是对象（例如dot, mesh）或数组（例如doubleMesh）|

使用默认设置的预定义网格：来自下面图像的纸张已被缩放2倍，并且gridSize设置为10。

```javascript
drawGrid: true // default pattern (dot) with default settings
drawGrid: 'mesh' // pre-defined pattern with default settings
drawGrid: { name: 'mesh', args: { color: 'black' }}
drawGrid: {
    name: 'doubleMesh',
    args: [
        { color: 'red', thickness: 1 }, // settings for the primary mesh
        { color: 'green', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
```

