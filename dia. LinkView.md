# dia. LinkView
joint.dia.Link模型的视图。继承自joint.dia.CellView，负责：
- 渲染paper内的link 
- 处理link的pointer事件 
- 提供各种处理link的方法（可视化）
要查找与特定link（模型）关联的视图，使用paper的findViewByModel方法。
var elementView = paper.findViewByModel(link);

### Custom LinkView
可以在paper中为所有links使用自定义link view, 这可以通过paper对象上的linkView选项进行设置。当从joint.dia.LinkView继承并决定使用自己的link view时，可以使用几个选项。这些在LinkView的options属性中，包括：
- shortLinkLength 当link比指定的长度短时，link view会自动将链接工具缩小一半。默认为40。
- doubleLinkTools 有时当链接互相重叠时，链接工具会堆叠在一起，无法到达顶层以下的链接工具。通过将doubleLinkTools设置为true，可以强制link view图创建链接工具的副本并将其放置在链接的另一端。请注意，只有链接长度超过longLinkLength时才会发生这种情况。
- longLinkLength 当链接超过指定的长度且doubleLinkTools设为true，链接工具的副本将显示在链接的另一端
- linkToolsOffset  链接工具距离链接起始端的偏移量。它默认为40
- doubleLinkToolsOffset 链接工具副本距离链接末尾的偏移量，默认60，这只有在doubleLinkTools设置为true时才有意义

```javascript
var paper = new joint.dia.Paper({
  linkView: joint.dia.LinkView.extend({
      options: _.defaults({
          doubleLinkTools: true
      }, joint.dia.LinkView.prototype.options)
  })
});
```
### Prototype方法

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `className`                                                  | `在cellview的classname以外添加了link类`                      |
| `initialize`                                                 | `调用cellView的initialize方法`                               |
| `startListening`                                             | `开始监听所有link相关的事件`                                 |
| `onSourceChange(cell,source,opt)`                            | `change:source的回调`                                        |
| `onTargetChange(cell,target,opt)`                            | `change:target的回调`                                        |
| `onVerticesChange(cell,changed,opt)`                         | `change:vertices change:vertexMarkup的回调`                  |
| `onToolsChange()`                                            | `change:toolMarkup的回调`                                    |
| `onLabelsChange(link,labels,opt)`                            | `change:labels change:labelMarkup的回调`                     |
|                                                              |                                                              |
| `render()`                                                   | `change:markup的回调，依次渲染markup的各个部分，`            |
| `renderLabels()、updateLabels()`                             | `渲染label，更新label属性`                                   |
| `renderTools()、renderVertexMarkers()、renderArrowheadMarkers()` | `渲染link tools、vertex markers、arrowhead markers`          |
| `update(model,attributes,opt)`                               | `change:smooth, change:manhattan, change:router,   change:connector事件的回调，依次更新各个部分` |
| updateConnection(opt)、updateLabelPositions()、updateToolsPosition()、updateArrowheadMarkers() |                                                              |
| `createWatcher(endType)`                                     | `返回一个函数，观测链接末尾的变化。如果发生变化而新的end是新的model，它将停止监听前一个model并开始监听新model。` |
| `onEndModelChange(endType,endModel,opt)`                     | `end处的model发生变化时调用`                                 |
| `removeVertex(idx)`                                          | `移除idx索引处的vertex`                                      |
| `findRoute(oldVertices)`                                     | ` `                                                          |
| `getPathData(vertices)`                                      | `返回表示`source`和`target`之间链接的`<path>`元素的`d`属性值` |
|                                                              |                                                              |
| `getConnectionPoint(end, selectorOrPoint, referenceSelectorOrPoint``)` | 找到连接的开始点. 如果`selectorOrPoint`是一个点，那么那个点就是连接的开始。 如果`selectorOrPoint`是一个元素，但是我们需要知道链接所引用的参考点（或元素），以便确定原始元素上的连接的开始。 |
| `getPointAtLength(length)`                                   |                                                              |
| `交互、控制部分`                                             |                                                              |
| `startArrowheadMove (end, opt)`                              | `允许将另一个视图中的事件委托给此链接视图，以便无需单击实际的箭头dom元素即可触发arrowhead move` |
| `pointerdown(evt, x, y)，pointermove(evt, x, y)，pointerup(evt, x, y)，mouseenter(evt)，mouseleave(evt),event(evt,eventName,x,y)` | `notify对应的element事件`                                    |
| API 文档中列出的方法                                         |                                                              |
| `addVertex`                                                  | 将新的vertex（具有x和y属性的对象）添加到link。通常，顶点是通过链接模型的vertices属性设置的。然而，有时候向链接添加一个新的顶点，并且让链接决定该顶点应该被添加到vertices数组的哪个索引。link view尝试将顶点添加到vertices数组中的不同索引，渲染connection SVG路径，并检查路径长度是否发生了显著变化，如果是这样，它会尝试另一个索引，如果没有，找到的索引最有可能是我们希望添加新的vertex的那个索引。例如，假设您想要在双击上添加一个新的顶点而不是默认的点击事件。您可以通过以下方式创建paper |
| `getBBox()`                                                  | 返回链接视图的边界框                                         |
| `getConnectionLength()`                                      | 以像素为单位返回链接的总长度                                 |
| `sendToken(token, [options], [callback])`                    | 沿link发送token，token是一个SVG元素（或Vectorizer元素），它将沿着connection路径选项进行options.duration毫秒（默认值为1000毫秒）的动画处理。一旦令牌到达链接路径的末尾，callback将被调用。   options.direction指定动画是否应play fowards（“normal” - 从link源到目标，这是默认）或向后（“reverse”）。         参考 Petri Net simulator demo |
