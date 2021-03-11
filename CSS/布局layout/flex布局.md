## flex样式
flex属性是`flex-grow`,`flex-shrink`,`flex-basis`的缩写。只有flex-basis的属性值是长度值。
flex-grow, flex-shrink, flex-basis的默认值是`flex: 0 1 auto`。

```css
flex: none | auto | [<'flex-grow'> <'flex-shrink'>? || <'flex-basis'>]
```
1. |，单管道符，表示排他，即不能同时出现，所以只有以下三种：
```css
flex: none;
flex: auto;
flex: [<'flex-grow'> <'flex-shrink'>? || <'flex-basis'>]
```
2. [...]，方括号表示范围，也就是支持的属性值在这个范围内，flex属性值支持空格分隔的3个值
3. ？,问号表示0或1个，也就是 flex-shrink属性可有可无。
4. ||, 双管道符，或的意思，表示前后可以分开独立使用

所以 flex属性还可以有以下几种：
 ```css
 flex: 1; // 1个值，flex-grow，相当于 flex: 1 1 auto
 flex: 100px; // 1个值，flex-basis，相当于 flex: 0 1 100px
 flex: 1 100px; // 2个值，flex-grow和flex-basis，相当于 flex: 1  1 100px
 flex: 1 1; // 2个值，flex-grow和flex-shrink，相当于 flex: 1 1 auto
 flex: 1 1 100px; // 3个值
 ```

### 关键字属性值
- initial

初始值，`flex: initial`关键字的计算值是 `flex: 0 1 auto`，即flex属性的默认值。

含义：1. 不会增长变大占据flex容器中额外的剩余空间（flex_grow:0）
      2. 会收缩变小以适合容器（flex-shrink:1）。如果子项内容多的话，如果容器收缩的话，子项会缩小（例如，表现为文字换行）
      3. 尺寸根据自身宽高属性进行调整（flex-basis:auto）
- auto

等同于设置 `flex: 1 1 auto`

含义：1. 子项会变大，占据flex容器的剩余空间。每个子项元素的flex-grow都是1，因此会等比例变大。
     2. 会收缩变小以适合容器（flex-shrink:1）
     3. 尺寸根据自身宽高属性进行调整（flex-basis:auto）

- none

等同于设置 `flex: 0 0 auto`

含义： 子项不会增大，也不会缩小，尺寸根据自身宽高属性进行调整。
表现： 缩小时，子项宽度超过了容器的尺寸，子项的内容溢出到了容器外。

### flex
- flex-grow，指定了容器剩余空间多余时的分配规则，（增加变大），默认值为0，即多余空间不分配
- flex-shrink，指定了容器剩余空间不足时的分配规则，（收缩变小），默认值为1，即空间不足要分配
- flex-basis，指定了固定的分配数量，默认为auto。如果该属性未设置的时候，需要同时设置width或height属性

e.g.
范张，范鑫和范旭每人100万固定家产，范帅和范哥则20万保底家产。如果范闲归西那天家产还有富余，范帅和范哥按照3:2比例分配；如果没有剩余财产，则范张，范鑫和范旭三位兄长按照2:1:1的比例给两人匀20万保底家产。
```html
<div class="container">
    <item clas="zhang">范张</item>
    <item clas="xin">范鑫</item>
    <item clas="xu">范旭</item>
    <item clas="shuai">范帅</item>
    <item clas="ge">范哥</item>
</div>
```

```css
.container {
    display: flex;
}
.zhang {
    flex: 0 2 100px; // 空间多余时不占用，空间不足时范张，范鑫，范旭 按照 2：1：1的比例分出部分空间给范帅和范哥
}
.xin, .xu {
    flex: 0 1 100px; // 或 flex: 100px
}
.shuai {
    flex: 3 0 20px; // 有多余宽度时 范帅和范哥 按 3：2分配多余宽度
}
.ge {
    flex: 2 0 20px;
}
```

- 介绍flex布局，Flexbox用法；
1. 解释一下css3的flexbox术语，以及适用场景，flex弹性布局: 主轴 辅助轴的几个属性， flex-grow和flex-shrink，flex-direction必须掌握。而且对于弹性盒里面的元素的是否会被缩减，以及缩减的规则都会被考察到。对于高级前端一些深度的特性也会被考察到。
使用 CSS flexbox，有时 flex-items/children 会不考虑 flex 容器设置的宽度/高度？为什么会这样？

web应用有不同设备尺寸和分辨率，需要响应式界面设计来满足复杂的布局需求，flexbox的优势在于，只要声明布局应该有的行为，而不要给出具体的实现方式，浏览器负责完成实际布局。
    当布局涉及到不定宽度，分布对齐的场景，就要优先考虑flexbox。

- space-between和space-around的区别

按水平布局来说， space-between在左右两侧没有边距，而 space-around在左右两侧会留下边距，垂直布局同理