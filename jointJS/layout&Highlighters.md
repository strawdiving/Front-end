## highlighters
可以用来为元素提供视觉强调，例如在用户交互期间。

```javascript
paper.on('cell:pointerclick', function(cellView) {
    cellView.highlight();
}); 
cellView.unhighlight();

cellView.highlight(null/* defaults to cellView.el */, {
    highlighter: {name: 'stroke',options: {width: 3}}});

cellView.highlight(null/* defaults to cellView.el */, {    highlighter:stroke'});
```

- addClass

```javascript
cellView.highlight(null/* defaults to cellView.el */, { highlighter: {
        name: 'addClass',
        options: {
            className: 'some-custom-class'
        } }});
```
在cell view的$el上切换类名。可用选项className - 在cell的$ el上切换的类名

- opacity

```javascript
cellView.highlight(null/* defaults to cellView.el */, {highlighter: {
        name: 'opacity'
   }});
```
更改cell view的$ el的不透明度。当一个cell用不透明度highlighter标记highlight时，其$ el被赋予.joint-highlight-opacity类。要自定义突出显示状态的外观，您可以添加影响此类名称的自定义CSS规则。

- stroke
围绕cell view的$ el添加一个stroke, 可用选项：padding,rx,ry,attrs

### env.addTest
env.addTest(name, fn)
添加一个自定义功能检测测试，其中name是一个唯一标识功能测试的字符串，fn是一个在浏览器支持该功能时返回true的函数，如果不支持，则返回false。

### env.test
env.test(name) 测试浏览器是否支持给定的功能。如果支持该功能，则返回true，否则返回false。
JointJS提供以下测试：svgforeignobject – 测试是否浏览器支持 foreignObject.

## layout.DirectedGraph
有向图的自动布局，该插件在内部使用开源（MIT许可证）Dagre库。它提供了一个包装器，以便您可以直接在JointJS图上调用布局。请注意，如果您希望使用layout.DirectedGraph插件，则必须同时包含Dagre和Graphlib库作为依赖关系。
### Usage
joint.layout.DirectedGraph插件公开joint.layout.DirectedGraph.layout（graphOrElements，opt）函数。第一个参数graphOrElements是我们想要布局的joint.dia.Graph或者一个joint.dia.Elements数组。第二个参数options是一个包含用于配置布局的各种选项的对象。

```javascript
var graphBBox = joint.layout.DirectedGraph.layout(graph, {    nodeSep: 50,    edgeSep: 80,    rankDir: "TB"});
```
### Configuration
下表列出了可以传递给joint.layout.DirectedGraph.layout（graph，opt）函数的选项：
- nodeSep-表示相同等级相邻节点之间的间隔的像素数
- edgeSep-表示相同等级相邻边之间的间隔的像素数
- rankSep-表示rank之间的的间隔的像素数
- rankDir-布局的方向（“TB”（从上到下）/“BT”（从下到上）/“LR”（从左到右）/“RL”（从右到左）中的一个） ）
- marginX-用作图形左侧和右侧边缘的像素数
- margin-用作图形顶部和底部边缘的像素数
- ranker-为输入图中的每个节点分配排名的算法类型，可能值：'network-simplex'（默认），'tight-tree'或'longest-path'
- resizeClusters-如果不希望父元素伸展以适应所有嵌入的子元素，则设置为false。默认值是true。
- clusterPadding-父元素与其嵌入子元素的边界之间的差距，它可以是数字或对象，例如{左：10，右：10，上：30，下：10}。它默认为10
- setPosition(element, position) 一个将用于设置布局末尾的元素位置的函数。当不想用默认的element.set('position', position)，而是想通过transition以动画的方式设置位置时是有用的
- setVertices(link, vertices) 如果设置为true，布局将通过设置顶点来调整链接。它默认为false。如果该选项被定义为一个函数，它将用于设置布局末尾的链接顶点。如果您不想使用默认的link.set（'vertices'，vertices），但希望通过transition以动画方式设置顶点，这非常有用。
- setLabels(link, labelPosition, points) 如果设置为true，布局将通过设置其位置来调整标签。如果选项被定义为一个函数，它将被用来设置布局末尾的链接标签。注意：布局仅定位了第一个标签（link.label（0）;）。


