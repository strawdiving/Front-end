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
