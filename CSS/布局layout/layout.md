1. display:
- 块级元素: div,p,form,以及HTML5的header,footer,section等
- inline元素: span, a
- none, 和 visibility不同，display：none会渲染页面，即使元素不存在，visibility: hidden会隐藏元素，但元素仍然占据其可见时所占据的空间
- table
- list-item
- inline-block
- flex

block和inline-block区别?
inline和block的区别，渲染的区别
内联元素包含块元素的表现？

对行内元素设置宽高有用吗，为什么对 img 标签起作用，对行内元素设置边距有效吗
span包含12px大小英文'abc',问span高度? baseline怎么理解?

display:inline-block 什么时候会显示间隙？
有空格时候会有间隙 解决：移除空格
margin正值的时候 解决：margin使用负值
使用font-size时候 解决：font-size:0、letter-spacing、word-spacing

vertical-align & line-height
vertical-align 为什么没有绝对垂直居中？

32. 你对line-height是如何理解的？

line-height: height 有被问到该值是不是等于高度设置的值?，回来测试发现是跟盒模型相关的，需要是 computed height
行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是height和line-height，没有定义height属性，最终其表现作用一定是line-height。

单行文本垂直居中：把line-height值设置为height一样大小的值可以实现单行文字的垂直居中，其实也可以把height删除。
多行文本垂直居中：需要设置display属性为inline-block。

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

clearfix css属性如何有用

float的元素后面的元素会围绕float元素浮动，如果不想要围绕，只想显示在下方，就要用clear

有时候，float的元素比包含它的父元素高，就会overflow溢出它的父容器。此时对父容器使用使用一个clearfix
```css
  .clearfix {
      overflow: auto;
  }
```

解决页面过窄时的显示问题，考虑用媒体查询

- sticky

HTML文档流的排版规则， CSS几种定位的规则、定位参照物、对文档流的影响，如何选择最好的定位方式，

## 页面布局：

- 如何实现高度自适应

有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度
外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

标准文档流(padding + margin + 负margin) + 浮动float + 定位
百分比布局(流式布局):  px单位 用 %num代替, 占父级元素的百分比
- float， 浮动元素引起的问题和解决办法？如何清除浮动？绝对定位和相对定位，元素浮动后的display值

rem布局的优缺点

