# 盒模型
解释您对盒子模型的理解，以及如何告诉CSS浏览器在不同的盒子模型中呈现布局。以及标准情况和IE下的区别

对文档进行布局时，浏览器的渲染引擎会根据标准之一的CSS基础框盒模型（basic box model），将所有元素表示为一个个矩形的盒子，CSS决定盒子的大小，位置，属性。

指的是页面在渲染时，DOM元素所采用的布局模型，一个元素占用的空间大小由几个部分组成，内容(content)、内边距(padding)，边框(border)和外边距(margin)。可以通过 box-sizing来进行设置，其中IE盒模型的content包含了padding和border，这是区别于W3C标准盒模型的地方。

盒模型由content，padding，border，margin组成。

## 元素竖向的百分比设定是相对于容器的高度吗？
当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

## box-sizing
请解释*{box-sizing:border-box;}的作用，并说明使用它的好处
标准盒模型的width，height为content的宽高，默认使用标准盒模型。box-sizing = content-box
将box-sizing属性设为 border-box，设置属性使用的时候更方便

## 外边距合并

# 请描述 BFC(Block Formatting Context) 及其如何工作
  对BFC规范(块级格式化上下文：block formatting context)的理解？如何创建bfc？

  box是CSS布局的基本单位，页面由很多box（盒模型）组成
  Formatting context：块级上下文格式化，页面中的一块渲染区域，有一套渲染规则，BFC规定了内部的Block Box如何布局：

  定位方案：
  - 内部的Box会在垂直方向上一个接一个放置。
  - Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠。
  - 每个元素的margin box 的左边，与包含块border box的左边相接触。
  - BFC的区域不会与float box重叠。
  - 计算BFC的高度时，浮动元素也会参与计算。
  - BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。外面的元素也不会影响到容器里面的子元素。
  可以把它看做一块独立的区域，让处于BFC内部的元素与外部的相互隔离

  满足下列条件之一就可触发BFC：
  - 根元素，即html/body，默认情况下只有这一个块级上下文
  - float的值不为none（默认）
  - overflow的值不为visible（默认）
  - display的值为inline-block、table-cell、table-caption、flex
  - position的值为absolute或fixed
  作用是防止margin重叠，两栏布局，防止文字环绕，防止元素塌陷等。

介绍下 BFC、IFC、GFC 和 FFC，
- BFC概念，实现原理，怎么应用，可以解决哪些问题

bfc (set middle area overflow is hidden)
