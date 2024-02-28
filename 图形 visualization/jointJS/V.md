# v, g, joint

 三个全局变量

1、v 称为Vectorizer的轻量级SVG库，使SVG操作更容易

2、g JointJS内部使用的轻量级库，提供几何操作

3、 joint 包含了所有用于建立图表的对象

## Vectorizer

V变量是一个叫做Vectorizer的小型SVG辅助函数库的函数，此库位于其自己的命名空间而不在joint命名空间内的，因为即使没有JointJS它也可以完全独立使用。使处理SVG更轻松，可以把它看作是一个非常轻量级的用于SVG的jQuery。

|                                                              |                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| constructor                                                  | V(svg) var vel = V('<g><rect/><text/></g>')返回一个Vectorizer对象，如果svg参数是一个字符串，则从字符串标记中构造SVG DOM元素；如果svg是一个SVG DOM元素，只需用Vectorizer元素包装该元素并返回即可。除了V函数不接受选择器之外，您可以将此函数视为jQuery $ 函数。Vectorizer对象在其node属性中包含对原始SVG DOM元素的引用|
| prototype (vel.xxx如vel.addClass(“joint-”))                  |                                                              |                                                              |
| addClass(className)                                          | 将className附加到元素class属性, 返回Vectorizer对象以实现简单的chaining |  |
| animateAlongPath(attrs, path)                                | 沿path SVG元素（或Vectorizer对象）设置元素的动画效果。attrs包含描述动画的 [Animation Timing attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#Animation_timing_attributes), 以下示例显示如何沿JointJS链接元素发送令牌： |                                                              |
|                                                              | var c = V('circle', { r: 8, fill: 'red' }); c.animateAlongPath({ dur: '4s', repeatCount: 'indefinite' }, paper.findViewByModel(myLink).$('.connection')[0]);       V(paper.svg).append(c);                  |  |
| append(els)                                                  | 追加另一个元素（或多个元素）els作为元素的最后一个子元素。els可以是Vectorizer对象或SVG DOM元素 |                                                              |
| appendTo(node)                                               | 将vel.node作为子节点添加到节点node                           |                                                              |
| attr(name, value)                                            | 在元素上设置name和value的SVG属性，如果name是{[name]：[value]}形式的对象，则会一次设置更多属性 |                                                              |
| bbox([withoutTransformations, target])                       | 应用transformations后返回元素的边界框，withoutTransformations为true，计算边界框时不考虑元素的变换，如果指定target，边界框将相对于目标元素进行计算 |                                                              |
| before(els)                                                  | 将给定元素（或元素们）els添加到Vectorizer元素vel之前，添加为父节点的子元素。els可以是Vectorizer对象或SVG DOM元素。 |                                                              |
| children()                                                   | 返回此元素节点的Vectorizer包装的子元素的数组。               |                                                              |
| clone()                                                      | 克隆Vectorizer对象，创建元素的全新副本，该克隆不会自动添加到DOM。 |                                                              |
| contains(element)                                            | 如果vel.node是DOM中element节点的父/祖，则返回true。另外，如果vel.node就是element节点，则返回true。 |                                                              |
| convertToPath()                                              | 将SVG元素转换为SVG路径元素，它目前适用于<path>，<line>，<polygon>，<polyline>，<ellipse>，<circle>和<rect> |                                                              |
| convertToPathData()                                          | 将SVG元素转换为SVG路径数据（SVG路径命令字符串）。适用于同上  |                                                              |
| defs()                                                       | 返回根SVG元素的第一个<defs>元素的Vectorizer对象。注意，<defs>元素是放置引用的SVG元素（如gradients, clip paths, filters等）的好地方 |                                                              |
| empty()                                                      | 从Vectorizer元素中移除所有的子节点。                         |                                                              |
| find(selector)                                               | 返回Vectorizer对象中与选择器匹配的所有元素。                 |                                                              |
| findIntersection(ref, target)                                | 找到从SVG节点中心开始到点ref（形式为{x：Number，y：Number}的对象）结束的一条线的交点。这个节点的转换是相对于SVG元素target进行的，在JointJS中，target通常是SVG group元素paper.viewport 。注意，ref点必须位于target的坐标系中才能正常工作。如果找到交点，该函数返回target的坐标系中的一个点，否则返回undefined。 |                                                              |
| findOne(selector)                                            | 返回Vectorizer对象中与选择器匹配的第一个元素，找不到则返回undefined |                                                              |
| `findParentByClass(className [, terminator])`                | 向外遍历DOM层次结构，直至可选的terminator终止节点（该节点除外），找到具有指定class的第一个祖先节点。如果terminator之前没有祖先有className，则返回null。 |                                                              |
| `getBBox([options])`                                         | 应用transformations后返回元素的边界框，与vel.bbox（）不同，此函数修复了浏览器执行错误，如果此元素是一组svg元素（如果指定了options.recursive），则返回正确的边界框。   options参数是可选的，可以提供两个属性。如果options.target不是未定义的，则边界框将相对于target元素的transformations进行计算; 如果未定义，则相对于调用函数的元素计算边界框。如果options.recursive为true，则边界框计算为所有单个后代边界框的联合。 |                                                              |
| `getTransformToElement(toElement)`                           | 返回一个SVGMatrix，它指定了将vel坐标系转换为toElement坐标系所需的转换。 |                                                              |
| `hasClass(className)`                                        | 如果元素在其class属性中包含className，则返回true             |                                                              |
| `index()`                                                    | 返回SVG元素在其兄弟中的索引                                  |                                                              |
| `prepend(els)`                                               | 在元素的第一个子元素之前加上另一个元素（或多个元素els。 els可以是Vectorizer对象或SVG DOM元素。 |                                                              |
| `remove()`                                                   | 从DOM中移除元素                                              | `removeAttr(attribute)`                                      |
| `removeAttr(attribute)`                                      | 从vel.node删除指定的属性                                     |                                                              |
| `removeClass(className)`                                     | 如果包含它，则从元素类属性中移除className。返回Vectorizer对象以实现简单的链接 |                                                              |
| `rotate(angle [, cx, cy])`                                   | 以angle角度旋转元素。如果传递了可选的cx和cy坐标，则它们将用作旋转的原点 |                                                              |
| `scale(sx [, sy])`                                           | 通过sx和sy因子来缩放元素。如果没有sy，则被视为与sx相同       |                                                              |
| `setAttribute(name, value)`                                  | 赋value给具有name的属性, 属性名称可以加上命名空间;如img的 xlink：href属性 |                                                              |
| `setAttributes(attributes)`                                  | 将包含{attribute：value}对的attributes对象赋值给vel          |                                                              |
| `svg()`                                                      | 返回元素的根SVG元素的Vectorizer对象                          |                                                              |
| `text(content [, opt])`` ``t.text('another text that goes along a path', { textPath: { d: 'M 0 100 Q 30 10 100 0', startOffset: 50 } });` | 设置元素的文本content，只对<text>元素有意义，此方法可处理多行文本（如果内容字符串包含“\ n”字符）。   opt.lineHeight可以选择用于设置文本的行高，默认为'1em'，opt.lineHeight也可以设置为'auto'，在这种情况下，它会保留给Vectorizer以设置最佳行高，如果您将文本标注为富文本并且您不想将所有行的行高设置为固定值   opt.textPath可以是字符串或对象。如果它是一个字符串，它指定文本应该沿着的路径；如果它是一个对象，那么它应该包含一个d属性，该属性指定文本应该沿着的路径，并且可以选择在自动创建的<textPath> SVG元素上设置的其他属性，例如startOffset   如果opt.annotations数组已设置，文本将由annotations数组中定义的属性注释。这意味着您可以轻松呈现富文本   如果opt.includeAnnotationIndices设置为true，则每个<tspan>都将包含'annotations'属性，其中包含应用于该段文本的以逗号分隔的注释索引。 |                                                              |
| `toggleClass(className, switch)`                             | 根据类的存在或switch参数的值，从元素类属性中添加或删除className。 |                                                              |
| `toLocalPoint(x, y)`                                         | 将坐标为x和y的全局点转换为元素的坐标空间                     |                                                              |
| `transform([matrix], [opt])`                                 | 未提供矩阵时，返回Vectorizer元素的当前变换矩阵。当提供矩阵时，将提供的变换矩阵应用于Vectorizer元素。、可以通过传递opt（属性absolute：true）来清除以前的转换 |                                                              |
| `translate(tx [, ty])`                                       | 将元素x轴上平移tx像素，y轴上平移ty像素。 ty是可选的，在这种情况下y轴的平移被认为是零。 |                                                              |
| `translateAndAutoOrient(position, reference, target)`        | 自动定位元素。这基本上实现了标记的orient = auto属性，理解这种做法的最简单方法是想象这个元素是一个箭头，在箭头上调用此方法使其指向位置position点，同时朝向reference点自动定向（正确旋转）。target是应用转换相对于的元素，没有指定target时则默认为根元素 |                                                              |
| `translateCenterToPoint(p)`                                  | 平移元素，使其新中心将在点p。 p是{x：[number]，y：[number]}形式的对象。 |                                                              |
| 非prototype方法，调用格式V.xxx                               |                                                              |                                                              |
| `createSVGDocument（content）`                               | 创建一个SVG document element, 如果传递了`content`，则将其用作 `<svg>` 根元素的SVG content |                                                              |
| `createSVGMatrix(extension)`                                 | 返回用矩阵extension初始化的SVG变换矩阵，扩展是{ a: [number], b: [number], c: [number],d: [number], e: [number], f: [number]}形式的对象 |                                                              |
| `createSVGPoint(x, y)`                                       | 返回用x和y坐标初始化的SVG点对象                              |                                                              |
| `createSVGTransform([matrix])`                               | 返回一个SVG transform对象                                    |                                                              |
| `decomposeMatrix(matrix)`                                    | 将SVG转换矩阵matrix分解为单独的转换, 返回对象：{translateX：[number]，translateY：[number]，scaleX：[number]，scaleY：[number]，skewX：[number]，skewY：[number]，rotation：[number]} |                                                              |
| `findAnnotationsAtIndex(annotations, index)`                 | 找到适用于开始和结束范围内所有字符的所有注释（请参阅v.text（）） |                                                              |
| `isVElement(object)`                                         | 如果object是一个vectorizer元素，则返回true                   |                                                              |
| `rectToPath(r)`                                              | 将矩形r转换为SVG路径命令。r格式{x：[number]，y：[number]，width：[number]，height：[number]，top-ry：[number]，top-ry：[number]，bottom- rx：[number]，bottom-ry：[number]}。其中x，y，width，height是通常的矩形属性，而[top- / bottom-] rx / ry允许为其所有边指定矩形的半径（与仅具有rx和ry属性的内置SVG矩形相反） |                                                              |
| `shiftAnnotations(annotations, index, offset)`               | 将索引后的字符后面的所有注释（请参阅v.text（））按偏移位置移动。 |                                                              |
| `transformPoint(p, matrix)`                                  | 用matrix表示的SVG transformation 变换点p。这是调用的方便的捷径 |                                                              |
| `transformRect(r, matrix)`                                   | 用matrix表示的SVG transformation 变换矩形r，该函数在V.prototype.bbox方法内部使用，以返回SVG元素相对于另一个SVG父元素的边界框。无论何时需要将边界框转换为另一个元素的坐标系时，请使用此功能。要获得target元素（需要相对于该元素转换矩形）的转换矩阵matrix，使用例如本地SVG方法：var matrix = svgSourceElement.getTransformToElement（svgTargetElement） |                                                              |
| `transformStringToMatrix(transformString)`                   | 返回从transformString构建的SVG转换矩阵，例如'translate（10.10）scale（2.2）'将返回矩阵{a：2，b：0，c：0，d：2，e：10，f：10} |                                                              |
|                                                             
