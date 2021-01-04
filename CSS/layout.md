1. display:
- 块级元素: div,p,form,以及HTML5的header,footer,section等
- inline元素: span, a
- none, 和 visibility不同，display：none会渲染页面，即使元素不存在，visibility: hidden会隐藏元素，但元素仍然占据其可见时所占据的空间
- table
- list-item
- inline-block
- flex

2. margin: auto

设置块级元素的宽度，然后设置left和right的margin为auto，使元素在其父容器内水平居中。该元素会占据你指定的宽度，剩下的空间将在两个margin之间平均分配。

如果浏览器窗口宽度比元素宽度小时，页面会出现横向滚动条。

此时，可以使用max-width代替width，可以改善这个问题。当使网站在移动设备上可用时，这一点很重要。

3. position
- static,默认值，静态元素被称为未定位的，其他任何值都被称为已定位(positioned)的。
- relative，不设置其他属性的话，和static表现一致；
  设置top,left,right,bottom属性会导致该元素调整远离其正常位置，其他内容不会进行调整来填充该元素调整位置所留下的任何间隙
- fixed，相对于viewport进行定位，即使页面滚动，元素仍然保持在原来的位置。可以通过设置left,right,top,bottom来调整元素的位置，固定元素不会在其正常所处位置的地方留下空白
- absolute, 表现类似于fixed，但其相对于最近的定位（非static）的祖先元素进行定位，如果没有positioned祖先，元素就相对于document body进行定位，会随页面滚动而移动。
- float, Float本用于在图像周围包裹文本
clear属性对于控制float的行为很重要

float的元素后面的元素会围绕float元素浮动，如果不想要围绕，只想显示在下方，就要用clear

有时候，float的元素比包含它的父元素高，就会overflow溢出它的父容器。此时对父容器使用使用一个clearfix
```css
  .clearfix {
      overflow: auto;
  }
```

解决页面过窄时的显示问题，考虑用媒体查询
## 页面布局：
- 两栏布局
双栏固定布局
元素分别向两边靠
两个元素块，一左一右，中间相距10像素
CSS两列布局，右列定宽，左列自适应

- 一个页面上两个div左右铺满整个浏览器
要保证左边的div一直为100px，右边的div跟随浏览器大小变化（比如浏览器为500，右边div为400，浏览器为900，右边div为800），请写出大概的css代码。

    1.使用flex

```html
	//html
	<div class='box'><div class='left'></div> <div class='right'></div></div>
```
```css
	//css
	.box {
        width: 400px;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid #c3c3c3;
	}
	.left {
        flex-basis：100px;
        -webkit-flex-basis: 100px;
        /* Safari 6.1+ */
        background-color: red;
        height: 100%;
	}
	.right {
        background-color: blue;
        flex-grow: 1;
	}

    2.浮动布局

	<div id="left">Left sidebar</div>
	<div id="content">Main Content</div>

	<style type="text/css">
	* {
    margin: 0;
    padding: 0;
	}
	#left {
    float: left;
    width: 220px;
    background-color: green;
	}
	#content {
    background-color: orange;
    margin-left: 220px;
    /*==等于左边栏宽度==*/
	}
	</style>
```

- 三列布局怎么做？如果中间是自适应又怎么做？
topbar,navbar,appMain布局，常见布局的实现方式（普通方式，flex方式）
实现三栏布局（圣杯布局，双飞翼布局，flex布局）
上中下三栏布局
上下固定，中间滚动布局如何实现
实现常用布局（三栏、圣杯、双飞翼、吸顶），可是说出多种方式并理解其优缺点
- 四栏布局
table布局的作用
流式布局如何实现
响应式布局如何实现：响应式: 媒体查询@media；媒体查询的原理是什么？——根据浏览器宽度大小更改元素的尺寸；掌握一套完整的响应式布局方案
自适应设计——根据特定断点更改元素的尺寸；
移动端布局方案
让最后一行靠左对齐
屏幕占满和未占满的情况下，使footer固定在底部，尽量多种方法。

如何实现高度自适应

- 介绍flex布局，Flexbox用法；
1. 解释一下css3的flexbox术语，以及适用场景，flex弹性布局: 主轴 辅助轴的几个属性， flex-grow和flex-shrink，flex-direction必须掌握。而且对于弹性盒里面的元素的是否会被缩减，以及缩减的规则都会被考察到。对于高级前端一些深度的特性也会被考察到。
使用 CSS flexbox，有时 flex-items/children 会不考虑 flex 容器设置的宽度/高度？为什么会这样？


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
- grid栅格布局，解释 CSS Grid
如果你用过 CSS Flex / CSS Grid（网格）布局，请说明你为什么要使用它？它为你解决了什么问题？
使用  CSS Grid，百分比％和 fr 单位有何不同？
可以使用 CSS Grid创建 Masonry layout（瀑布流布局）吗？如果可以，怎么做？
浮动元素（float：left | right;）如何在 CSS Grid 和 flexbox 中渲染？
提示：等高的列，垂直居中，复杂网格等。


标准文档流(padding + margin + 负margin) + 浮动float + 定位
百分比布局(流式布局):  px单位 用 %num代替, 占父级元素的百分比
- float， 浮动元素引起的问题和解决办法？如何清除浮动？绝对定位和相对定位，元素浮动后的display值

- space-between和space-around的区别

按水平布局来说， space-between在左右两侧没有边距，而 space-around在左右两侧会留下边距，垂直布局同理

新的CSS Flexbox 或者 Grid 标准规格？
    web应用有不同设备尺寸和分辨率，需要响应式界面设计来满足复杂的布局需求，flexbox的优势在于，只要声明布局应该有的行为，而不要给出具体的实现方式，浏览器负责完成实际布局。
    当布局涉及到不定宽度，分布对齐的场景，就要优先考虑flexbox。

rem布局的优缺点

-  一个满屏品字布局如何设计?
第一种真正的品字：
三块高宽是确定的；
上面那块用margin: 0 auto;居中；
下面两块用float或者inline-block不换行；
用margin调整位置使他们居中。
第二种全屏的品字布局:
上面的div设置成100%，下面的div分别宽50%，然后使用float或者inline使其不换行。

