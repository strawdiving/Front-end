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
