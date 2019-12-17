# dia.attributes

定义了图形元素如何在element和link views内呈现，所有标准的SVG样式属性都可用

### event
使所选节点及其后代在点击时（mousedown/touchstart）触发任意事件。事件在view本身和paper上触发。调用paper handler时，带有cellView, evt, x, y参数，而调用cell view handler时只要 evt, x, y

```javascript
element.attr({
  image: {
    // pointerdown on the image SVG node将触发`element:delete` 事件
    event: 'element:delete',     xlinkHref: 'trash.png',    width: 20,    height: 20  }
});
// 将handler绑定到event上
paper.on('element:delete', function(elementView, evt) {
  // Stop any further actions with the element view e.g. dragging
  evt.stopPropagation();
  if (confirm('Are you sure you want to delete this element?')) {
      elementView.model.remove();
  }
});
```
### fill，stroke
fill属性只有在被定义为对象而不是通常的SVG语法（如"#ffaabb"）的情况下才会成为特殊属性，如果它被定义为一个对象，则它被假定为一个渐变定义，必须具有defineGradient（）方法定义的格式

```javascript
element.attr('rect/fill', {
    type: 'linearGradient',
    stops: [
        { offset: '0%', color: '#E67E22' },
        { offset: '20%', color: '#D35400' },
        { offset: '40%', color: '#E74C3C' },
        { offset: '60%', color: '#C0392B' },
        { offset: '80%', color: '#F39C12' }
    ]
});
```
### filter
filter属性只有在被定义为对象而不是通常的SVG语法（如 "url(#myfilter)"）的情况下才会成为特殊属性，如果它被定义为一个对象，则它必须具有filterGradient()方法定义的格式

```javascript
element.attr('rect/filter', {
    name: 'dropShadow',
    args: {dx: 2, dy: 2, blur: 3 }
});
```
### magnet
设置为true时，子元素可以在link重新连接期间成为link的source/target。对于所谓的“ports”很有用.
### port
至少包含一个id属性的对象，该属性唯一标识端口。如果一个link连接到一个也定义了一个port对象的magnet，port对象的id属性将被复制到link 的source/target的port属性
### ref
CSS选择器，指向用作相对定位属性reference参考的元素
### refCx/ refCy
将子元素的cx/cy属性设置为相对于（由ref属性中的selector指向的）元素的宽度/高度，如果该值在[0,1]中（或以百分比表示，例如'80％'），子元素的cx/cy将被设置为引用元素宽度/高度的百分比。如果值为<0或> 1，则子元素的高度将比参考元素的宽度/高度小/大指定的大小amount。注意，这仅适用于支持rx和ry属性（如<ellipse>）的SVG元素。
### refDx/ refDy ——alias: ref-dx/ref-dy
使子元素的x坐标相对于 (ref属性中的选择器引用的元素)的右边缘。
使子元素的y坐标相对于(ref属性中的选择器引用的元素)的底部边缘。
### refHeight——alias: ref-height
将子元素的高度设置为相对于(由ref属性中的选择器引用的)元素的高度。如果该值在[0,1]中（或以百分比表示，例如'80％'），子元素的高度将被设置为引用元素高度的百分比。如果值为<0或> 1，则子元素的高度将比参考元素的高度小/大指定的大小amount。这仅适用于支持宽度和高度属性的SVG元素，例如<rect>。
### refWidth——alias: ref-width
将子元素的宽度设置为相对于(由ref属性中的选择器引用的)元素的高度。如果该值在[0,1]中（或以百分比表示，例如'80％'），子元素的宽度将被设置为引用元素宽度的百分比。如果值为<0或> 1，则子元素的宽度将比参考元素的宽度小/大指定的大小amount。
'ref-width':.75，将子元素的宽度设置为引用元素宽度的75％; 
'ref-width': 20, 使宽度比引用元素的宽度小20px.
这仅适用于支持宽度和高度属性的SVG元素，例如<rect>。
### refRx/refRy
将子元素的rx/ry属性设置为相对于（由ref属性中的selector指向的）元素的宽度/高度，如果该值在[0,1]中（或以百分比表示，例如'80％'），子元素的rx/ry将被设置为引用元素宽度/高度的百分比。如果值为<0或> 1，则子元素的高度将比参考元素的宽度/高度小/大指定的大小amount。注意，这仅适用于支持rx和ry属性（如<ellipse>）的SVG元素。
### refX/refY——alias: ref-x/ref-y
使子元素的x/y坐标相对于(由ref属性中的选择器引用的)元素的x/y坐标。如果该值在[0,1]中（或以百分比表示，例如'80％'）, 偏移量是从引用元素的边界框的fraction中计算出来的, 否则，它是以像素为单位的绝对值.
### refX2/refY2
同refX/refY，当需要同时绝对和相对定位元素时非常有用。
{ refX: '50%', refX2: 20 } //将元素移动参考宽度的50％，再加上额外的20像素.
{ refY: '50%', refY2: 20 }//将元素移动参考高度的50％，再加上额外的20像素
### resetOffset
如果设置为true，则子元素偏移（从x0 y0到最左上点的距离）将重置为x0 y0。
### sourceMarker、targetMarker
对<path>子元素有效。它在路径的beginning/end处绘制一个SVG元素。元素根据路径方向自动旋转。它被定义为一个具有type属性和任何其他visual属性的对象, 类型的有效值是'path', 'circle', 'ellipse', 'rect', 'polyline' 和 'polygon'。
注意，beginning和end处绘图的坐标系被旋转了180度（为了方便起见，可以使用相同的标记作为源和目标，并使它们都面向连接的元素）。
### style
包含子元素的CSS样式的对象。
### text
仅对<text>子元素有效。text属性包含文本，（根据文本是否为多行（包含'\ n'字符）用文本直接设置<text>子元素或其<tspan>子元素。
### textPath
仅对<text>子元素有效. textPath可以是一个字符串或一个对象, 如果它是一个字符串，它指定文本应该沿着的路径。如果它是一个对象，那么它应该包含一个d属性，该属性指定文本应该沿着的路径，以及可选地在自动创建的<textPath> SVG元素上设置的其他属性，例如startOffset
### textWrap
仅对<text>子元素有效. 与text属性类似，但在这种情况下，文本会自动wrap以适应参考边界框。它被定义为具有text属性和宽度和高度（可选，它可以调整包装文本的最终大小；正值加，负值减小尺寸；当需要尺寸的一部分时，将值定义为百分比）属性的对象

```javascript
textWrap: {
  text: 'Here is the text to be wrapped.',
  width: -10, // reference width minus 10
  height: '50%' // half of the reference height
}
```
### xAlignment/yAlignment——alias:x-alignment/y-alignment
如果设置为“middle”，则子元素将围绕其新的x/y坐标居中。


