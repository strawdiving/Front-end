# dia. Element
图表elements的模型。它从joint.dia.Cell继承，并添加了一些特定于元素的附加属性和方法。这些属性可以分为三组：
1. Geometry
元素的坐标存储在position属性(具有x和y键的对象)中，position可以使用常规Backbone set（）/ get（）方法或通过translate方法直接访问或设置.
旋转角度存储在angle属性中, 以度为单位，旋转原点始终被认为是元素的中心. angle可以使用常规Backbone set（）/ get（）方法或通过rotate方法直接访问或设置.
元素的大小存储在size属性中，该属性是具有width和height键的对象，size可以使用常规Backbone set（）/ get（）方法或通过resize方法直接访问或设置.
2. Presentation
另一个重要属性是attrs，它是一个对象，其中的key: 与子元素匹配的selectors，value: 将在子元素上设置的SVG属性。在MDN上可以找到SVG属性列表和它们的描述。
值得注意的是，每个joint.dia.Element定义了一个SVG markup，然后由joint.dia.ElementView使用该markup将元素渲染/呈现给paper。
例如，joint.shapes.basic.Rect元素定义它的markup如下：
<g class="rotatable"><g class="scalable"><rect/></g><text/></g>
因此，为了设置矩形子元素的红色填充颜色，attrs对象应该包含：
rect: { fill: 'red' }
不建议直接更改attrs对象，建议使用attr方法。
z属性指定SVG DOM中元素的堆栈顺序。具有较高z等级的元素位于具有较低z等级的元素的前面。（这也适用于具有完全相同属性的link）
3. Nesting
元素的最后两个属性是embeds和parent。这两个元素与包含或包含在其他元素中构成分层结构的元素有关。embeds是嵌入在元素内部的cell ID的列表，parent是embedded 元素的父元素的id。当一个父元素被translate时，它的所有孩子也会被translate。
extend自 BackBone.dia.Cell

```javascript
defaults:	{position: { x: 0, y: 0 },size: { width: 1, height: 1 },angle: 0}
```
|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `initialize`                                                 | `初始化ports，再调用cell的初始化函数`                        |
| `initialize`                                                 | `初始化ports，再调用cell的初始化函数`                        |
| `isElement`                                                  | `true`                                                       |
| `position (x, y, [opt])`` `   el1.position(100, 100);   el1.embed(el2);   el2.position(10, 10, { parentRelative: true });   el2.position() // --> 110@110   el1.position(200,200, { deep: true });   `el2.position() // --> 210@210` | `元素位置设置为x和y坐标, 这几乎等同于element.set（'position'，{x：x，y：y}，opt），但是，此方法提供了一些附加功能。如果将opt.parentRelative标志设置为true，则x和y坐标将相对于此元素的父元素进行处理。如果position（）不带参数被调用，它将返回当前位置。如果在没有x和y坐标的情况下调用position（{parentRealtive：true}），将parentRelative标志设置为true，则该方法返回元素相对于其父元素的当前位置。将opt.deep设置为true将不仅定位元素，还定位其所有后代，以保持（from a child to the element origin）子元素到元素原点的原始距离。` |
| `translate (tx, ty, opt)``size(tx, ty, opt)``resize(tx, ty, opt)``scale(tx, ty, opt)` | ` `                                                          |
| `fitEmbeds([opt])`                                           | `调整元素的大小，使其适应其内部的所有嵌入元素，如果opt.deep=true，对于本身包含嵌入元素的嵌入元素，将递归地调整大小。如果想在所有父元素上进行某些填充，请设置opt.padding。` |
| `rotate (angle, [absolute, origin, opt])`                    | `将元素围绕“origin”（可选地）旋转`angle`度.``如果没有给定`origin`，考虑围绕元素的中心旋转. 如果origin以具有x和y属性的对象的形式传递，则此点将用作旋转转换的origin。```absolute`为`true`, `angle` 为绝对角度，而不是在前一个角度的基础上叠加` |
| `getBBox(opt)`                                               | `返回表示为g.rect对象的元素边界框。`                         |

### events
- change -元素上的任何更改触发的通用事件 - fn(element, opt)
- change:position -当元素改变其位置时触发 - fn(element, newPosition, opt)
- change:angle -元素旋转时触发 - fn(element, newAngle, opt)
- change:size -当元素被resized时触发- fn(element, newSize, opt)
- change:attrs -元素更改其属性时触发- fn(element, newAttrs, opt)
- change:embeds -当其他cell嵌入元素时触发- fn(element, newEmbeds, opt)
- change:parent -当元素嵌入到另一个元素中时触发 - fn(element, newParent, opt)
- change:z -当元素在z级别移动时（toFront和toBack）触发- fn(element, newZ, opt)
- transition:start - transition开始时触发 - fn(element, pathToAttribute)
- transition:end – transition结束时触发. - fn(element, pathToAttribute)

```javascript
element1.on('change:position', function(element1, position) {
  alert('element1 moved to ' + position.x + ',' + position.y);
});
//所有元素事件也传播到graph.
graph.on('change:position', function(element, position) {
  console.log('Element ' + element.id + 'moved to ' + position.x + ',' + position.y);
});
```

### Prototype方法

|                                   |                                                              |
| --------------------------------- | ------------------------------------------------------------ |
| `addTo(graph) `                   | `将元素添加到graph。相当于调用graph.addCell（element）`      |
| `attr(attrs)`                     | `子元素上设置SVG属性（和JointJS特殊属性）。``attr可以是对象或表示nested嵌套属性的路径的字符串。如果它是一个对象，则attrs对象的key是与子元素相匹配的CSS选择器，value是包含SVG属性及其值的对象。``element.attr({``    rect: { fill: 'blue' },``    text: { fill: 'white', 'font-size': 15 },``    '.myrect2': { fill: 'red' }``});``element.attr('text/font-size', 12); //使用字符串路径和值的替代调用``attrs对象将与元素模型的attrs属性混合使用，这是仅重写子元素的一些属性的简便方法。要覆盖所有子元素的所有属性，请使用element.set（attrs）。` |
| `clone(options)`                  | `返回具有相同属性的元素的新实例。如果options.deep === true，那么元素的所有嵌入cell（element，link）也被克隆，在这种情况下，返回值是一个实例数组，而不是单个实例` |
| `embed(cell) `                    | `将cell（element，link）嵌入到元素中，该元素然后成为embeded cell的parent，当parent被移动时，嵌入该parent的所有cells也会移动。``如果link被嵌入，它们的顶点vertices 随parent一起移动。这样，两种选择都可用：1）如果link未嵌入，但其源/目标元素及他们的parent移动，则嵌入元素随父项移动，但链接顶点停留在原地。2）如果link和它的源/目标元素一起嵌入，则它的vertices随parent移动而移动` |
| `unembed(cell)`                   | `将嵌入的cell从其父元素释放`                                 |
| `findView(paper)`                 | `为paper中的元素模型找到view（joint.dia.ElementView）。这是paper.findViewByModel（element）等效调用的快捷方式` |
| `getAncestors()`                  | `从直接parent开始一直到最远的祖先，返回包含此元素所有祖先的数组` |
| `getTransitions()`                | `返回所有活动的transitions（它们的路径）组成的数组`          |
| `getEmbeddedCells([opt])`         | `返回一个包含元素的所有embedded cell的数组。如果你所需要的只是所有embedded cell的ID，用element.get('embeds')，如果opt.deep=true，所有深度嵌入的cell都将被返回，cell的返回顺序取决于所使用的搜索算法。默认情况下，使用深度优先搜索（DFS）算法。如果opt.breadthFirst为true，则将使用广度优先搜索算法` |
| `isEmbeddedIn(element [, opt]) `  | `如果元素嵌入另一个元素元素，则返回true。如果opt.deep为false，则仅检查直接父子关系。opt.deep默认为true` |
| `prop(properties) `               | `在元素模型上设置可能嵌套的属性。等价attr（），但用于自定义数据属性``element.prop('name/first', 'John')``element.prop('name/first')  // 'John'``element.prop({ name: { first: 'John' } })``// Nested arrays are supported too:``element.prop('mylist/0/data/0/value', 50)``element.prop({ mylist: [ { data: [ { value: 50 } ] } ] })` |
| `remove(options) `                | `从graph中删除元素。它的所有嵌入元素也将被删除，并且该元素从其父元素中解除嵌入。默认情况下，所有关联的link也被删除。要抑制此行为，请设置options.disconnectLinks === true，在这种情况下，所有关联的link都会从该元素断开连接，而不是完全从graph中删除` |
| `removeAttr(path, [options])`     | `从元素中删除以前设置的属性。path可以是一个字符串，用于指定要删除的（可能嵌套）属性的路径或多个路径的数组。关联的元素view确保元素得到适当的重新渲染。如果传递options，则options可以包含传递给事件侦听器的数据，该事件侦听器侦听元素本身以及元素所在的graph上触发的change:attrs事件` |
| resize(width, height [, opt])     | Resize an element in place 调整元素的大小，以使 "scalable" group具有宽度和高度。in place在这种情况下意味着元素的左上角在调整大小后保持在相同的位置。换句话说，该元素被向底部/右侧（默认情况下）拉伸。要想改变调整大小的方向，将opt.direction设置为'left',  'right',  'top', 'bottom', 'top-right', 'top-left', 'bottom-left' ``或 'bottom-right' (the default)。``在经典scale 和resize操作之间存在差异。resize实际上并不会缩放（对其所有子元素进行分组的）整个SVG <g>元素，它仅缩放<g class“scalable”/>组的子元素。这是非常有用的，并且在定义哪些子元素应该缩放以及哪些不应该缩放时具有很大的灵活性。``假设有一个里面有文字的简单的矩形元素，通常，当我们调整整个元素的大小时，我们期望矩形被缩放，而文本保持相同的大小，只调整文本的位置使其保持在矩形的中心。只需将<rect />元素添加到标记中的<g class“scalable”/>组，并将文本子元素相对于<rect />元素放置：<text ref-x=".5"ref-y=".5" ref="rect" />。注意，ref-x，ref-y和ref属性都不是SVG标准属性。这些是由JointJS引入的特殊属性。(查看Special sttributes) |
| `scale(sx, sy, origin[, opt])`    | `相对于给定原点缩放元素的位置和大小`                         |
| `stopTransitions([path])`         | `停止所有正在运行的转换。如果提供了参数路径，它将仅停止此路径指定的转换` |
| `toBack([opt]),toFront([opt])`    | `移动元素使其位于所有其他cells（elements/links）的后面/前面，如果opt.deep 为 true，该元素的所有embeded cells将以BFS方式获得比此元素更高的z索引。这在分层结构图中特别有用，例如要将元素放到后层/上层，而不希望子元素（embeded cells）隐藏在该元素后面时。``所有元素都有一个z属性，用于在graph中定义它们的z级别。这个z属性甚至可以直接由element.set（'z'，123）设置，此更改将由与此元素所属的joint.dia.Graph对象相关联的joint.dia.Paper对象自动处理，并且所有SVG元素都将重新排序resorted，以便它们在DOM中的位置反映z级别` |
| `toJSON()`                        | `返回element属性的副本用于JSON序列化`                        |
| translate(tx, ty, [opt])          | 将元素在x轴方向上平移tx像素，y轴方向上平移ty像素。ty是可选的，在这种情况下y轴的平移将被视为零。可选的options 对象opt可用于将其他参数传递给监听'change：position'事件的事件处理程序。如果设置了opt.restrictedArea, 元素的移动将仅限于该区域，restrictedArea是{x：Number，y：Number，width：Number，height：Number}形式的对象。这很有用，例如如果您想限制嵌入元素在其parent中移动，此时唯一需要做的就是将父元素的边界框传递给restrictedArea选项：``myElement.translate(50, 50, { restrictedArea: graph.getCell(myElement.get('parent')).getBBox() })``确保元素myElement永远不会穿过其父元素的边界框。注意，如果元素myElement具有其他嵌入元素，这也适用。换句话说，用于计算限制的myElement的边界框是包括myElement所有子项的总边界框（以防他们突出“sticking out” ）。 |
| `transition(path, value [, opt])` | `允许在一段时间内逐渐改变元素的属性。这个方法让你指定：改变什么属性（path），何时开始转换（options.delay），转换将持续多久（options.duration），转换将如何运行（options.timingFunction），及如何interpolate插值属性值（options.valueFunction）。` |
  
  ```javascript
  element.transition('position/x', 250, {
    delay: 100,
    duration: 500,
    timingFunction: function(t) { return t*t; },
    valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
});
// will start changing the element's x-coordinate in 100ms, for period of 500ms
```
JointJS预建了一些常用的时序和插值函数，timing函数在joint.util.timing命名空间中定义，插值函数在joint.util.interpolate命名空间中定义
