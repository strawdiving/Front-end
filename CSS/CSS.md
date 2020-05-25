# CSS
## 知识点
CSS基本功：布局、HTML5、CSS3
知道如何在页面上布局元素，如何使用子元素或直接后代选择器来定位元素，以及什么时候该用类、什么时候该用 ID。
布局——安排彼此相邻的元素的位置，以及如何将元素布置成两列或三列；
响应式设计——根据浏览器宽度大小更改元素的尺寸；
自适应设计——根据特定断点更改元素的尺寸；

适当的命名空间和类命名。

1. What is CSS selector specificity and how does it work?
   **CSS选择器的特异性/特指度以及它如何工作**
2. CSS 中字母 'C' 的意思是叠层 (Cascading)。请问在确定样式的过程中优先级是如何决定的 (请举例)？如何有效使用此系统？
#####    常用的选择器
**CSS选择器**：id选择器(#myid)、类选择器(.myclassname)、类型/标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（*）、属性选择器（a[rel="external"]）、伪类选择器（a:hover, li:nth-child）

`element { style properties }`
- 后代选择器——用来寻找特定元素或元素组的后代，由其他两个选择器之间的空格表示
- ID选择器和类选择器（#和 . 表示）
- 伪类选择器（: 表示）——伪类是一个添加到选择器的关键字，用于指定选定元素的特殊状态。伪类将样式应用于元素，如链接的状态：active，鼠标的位置：hover，：focus

**链接的样式**
链接有4种状态，可以用4个伪类装饰：
a:link——访客尚未访问，鼠标没有悬停其上，也没有正在单击的链接。即尚未单击的普通链接。
a:visited——根据Web浏览器的历史判断已由访客单击的链接
a:hover——用于修改鼠标悬停其上的链接外观
a:active——用于设定访客点击链接时链接的外观。即访客按下鼠标按钮到松开前的那几秒
**CSS3新增伪类**：
- p:first-of-type last-of-type 选择属于其父元素的首个元素/最后元素
- p:only-of-type 选择属于其父元素唯一的元素
- p:only-child 选择属于其父元素的唯一子元素
- p:nth-child(2) 选择属于其父元素的第二个子元素
- :enabled :disabled 表单控件的禁用状态。
- :checked 单选框或复选框被选中。

#####  伪元素
 ****Describe pseudo-elements and discuss what they are used for. 请描述伪元素 (pseudo-elements) 及其用途****
一个添加到选择器的关键字（:: 表示），可以style所选元素的特定部分，如:: first-line，:: before和:: after表示所选元素的第一个/最后一个元素，通常将cosmetic content添加到具有content属性的元素上。
**::before** 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素，即在指定元素前添加内容。
**::after**在元素之后添加生成的内容
通过这种方式添加的内容，技术术语叫做“生成的内容”，因为这种内容是Web浏览器生成的，并不存在于dom之中，只存在在页面之中。
**::selection**CSS3新增内容，用于指代访客在网页中选中的内容。在这个选择符定义的样式中只能设置color和background-color两个属性。
##### 通用选择器（* 表示）
- 作用就像通配符，它匹配任何类型的元素。在与其他选择器结合使用时，通用选择器可以用来对某个元素的所有后代应用样式。
##### 高级选择器
大多数现代浏览器支持，但IE6和更低版本不支持。
- 子选择器——只选择元素的直接后代，即子元素（>）
**选取特定的子代元素的特殊伪类:**
**:first-child/ :last-child** 元素的第一个/最后一个子元素
p:first-child 为段落的第一个子元素定义样式
**:only-child** 元素的唯一的子代，仅当指定的标签是另一个标签的唯一子元素时，这个选择符定义的样式才有效。
**:nth-child(xxx)** 可以为表格中相隔的行、列表中相隔两个项目的项目或相隔其他数目的子代元素定义样式。该选择符需要一个值，用于确定选取哪些子代，1）关键字 odd/even，用于选取奇数或偶数子代元素，2）指定数字a，精确选择某个子代，3）选取多个元素  an+b，如3n+2，即从第2个子元素算起，选取每隔两个元素的第三个子代元素
**:first-of-type/ :last-of-type**选取特定类型的第一个/最后一个子元素
**:nth-of-type(xxx)**类似：nth-child(xxx)，选取的是相隔的特定类型的子代标签。eg. .sidebar p:first-of-type，为侧边栏里的第一个段落定义样式
- 相邻同胞选择器——定位同一个父元素下某个元素之后相邻的元素（+）
eg. h2+p 定位紧随h2标签之后的段落
- 普通同辈组合选择符——选取所有指定类型的同辈标签（~）
eg. h2~p 选取h2标签的所有同辈p标签
- 属性选择器——可以根据某个属性是否存在或属性的值来寻找元素（[ ]），筛选出设定了特定属性的标签。一些属性可以有多个值，值之间用空格分隔。属性选择器允许根据属性值之一寻找元素。
^= 以...开头
$= 以...结尾
*= 包含...
eg. a[href^="http://"]
- **:target选择符** 该选择符依赖于ID属性，要使用ID链接到网页中的特定位置。
只要浏览器地址栏中的URL包含#号和ID，ID对应的元素就会成为目标。所以当某个元素的ID出现在URL中时，可以为那个元素定义特定的样式。
```
<a href="#signupForm">Sign up</a>
<form id="signupForm">
<input type="email" id="email"/>
</form> 
//单击链接时，后面的表单会成为目标
```
- **:not()选择符** 否定伪类，用于选择不符合指定条件的标签
eg. a[href^="http://"]:not(href^="http://mysite.com") 选取绝对地址不是mysite.com的链接。
使用:not()选择符的限制条件：
- 只能使用简单的选择符，可使用的选择符有：元素选择符，通用选择符（*），类选择符，ID选择符，和伪类选择符
- 不能使用后代选择符，伪元素选择符，群组选择符或组合选择符
- 不能把多个:not()选择符连在一起使用，即一个选择符中只能使用一次:not()。
### 层叠和特殊性
#### 层叠
样式冲突的两种情况：继承——从多个祖辈那里继承同样的属性；同一个元素有多个样式。
如果没有专门为标签定义样式，继承的属性出现冲突时，最近的祖辈胜出。
标签专用样式里的属性会击败所有继承的属性。
如果一个元素有多个样式，浏览器会合并这些样式里的属性，前提是样式之间没有冲突。

层叠（cascade）用于管控样式之间相互作用的方式，出现冲突时判定哪个样式的优先级高。
层叠给每个规则分配一个重要度，采用以下重要度次序：
- 标有！important的用户样式
- 标有！important的作者样式
- 作者样式
- 用户样式
- 浏览器/用户代理应用的样式
作者的样式表——由站点开发者编写的，被认为是最重要的样式表
用户样式——用户可以通过浏览器应用自己的样式，重要度低一级
浏览器/用户代理使用的默认样式表，重要度最低，总是可以覆盖他们。
为了让用户有更多的控制能力，可以通过将任何规则指定为!important来提高它的重要度，让它优先于任何规则，甚至优先于作者加上！important标志的规则。
!important声明的样式优先级最高。
继承得到的样式的优先级最低。

然后，根据选择器的特殊性决定规则的次序，具有更特殊选择器的规则优于具有一般选择器的规则。如果两个规则的特殊性相同，则后定义的规则优先。
#### 特殊性（specificity）
为了计算规则的特殊性，给每种选择器都分配一个数字值，然后，将规则的每个选择器的值加在一起，计算出规则的特殊性。特殊性的计算不是以10为基数的，而是采用一个更高的未指定的基数，这确保非常特殊的选择器（比如ID）不会被大量一般选择器所超越。但是，为了简化，如果在一个特定选择器中的选择器数量少于10个，则可以以10为基数计算特殊性。
值越大，特殊性越高，优先级越高。
特殊性相同时，样式表中后出现的样式胜出。

选择器的特殊性分为4个成分等级：a、b、c、d
- 如果样式是行内样式，那么a=1，即，用style属性编写的规则总是比其他任何规则特殊
- b 等于ID选择器的总数
- c 等于类、伪类和属性选择器的数量
- d 等于类型选择器和伪元素选择器的数量
优先级（就近原则）：!important >内联> [ id > class > tag ] 

| 选择器      |     特殊性 |   以10为基数的特殊性   |
| :-------- | --------:| :------: |
| Style=""    |   1,0,0,0 |  1000  |
| #wrapper #content {}    |   0,2,0,0 |  200  |

浏览器中，右键单击元素，菜单中选择“审查元素”，在弹出的面板中会看到应用到所选元素上的样式，通常会有计算得到的属性，列出继承和层叠之后应用到元素上的所有CSS属性。下面还会列出应用到所选元素上的各个样式，按照特殊性从高到低从上而下列出。有些属性被划掉了，说明该属性未应用到元素上，或者被更具体的样式覆盖了。

如果外部样式表里的规则和内部样式表里的规则冲突，则样式表的位置很重要，如果先用< style>添加内部样式表，再使用< link>添加外部样式表，则外部样式表里的样式胜出，即后出现的样式胜出。
### 继承
应用样式的元素的后代会继承样式的某些属性，如颜色和字号。直接应用于元素的任何样式总会覆盖继承而来的样式，因为继承而来的样式特殊性为空。

可继承的属性：font-xxx,letter-spacing,color,line-height,text-xxx,vertical-align,white-space
list-style-xxx
Web浏览器渲染标签时会继承各自的内部样式。文本属性大多数都会继承
不可继承的样式：border-xxx, padding-xxx, margin-xxx, width, height，background-xxx,box-xxx,bottom/top/left/right,clear,display,float,overflow,position,visibility,z-index
一般来说，影响元素在页面中所在位置的属性，以及设置元素外边距、背景色和边框的属性不会被继承；动画，变形和过渡属性@keyframes, animation-xxx，transform-xxx，表格属性，
### 如何有效使用此系统
在编写CSS时特殊性很有用，因为它可以对一般元素应用一般样式，然后在更特殊的元素上覆盖它们。但为了避免过分混乱，尽量保持一般性样式非常一般，特殊样式尽可能特殊，就不需要覆盖特殊样式了。
3.  CSS 中类 (classes) 和 ID 的区别
ID用于标识页面上的特定元素，而且必须是唯一的。
一般原则：类应该应用于概念上相似的元素，这些元素可以出现在页面上的多个位置（类可以应用于页面上的任意多个元素），而ID应该应用于不同的唯一的元素（ID只能应用于页面上的一个元素）。只有在绝对确定这个元素只会出现一次的情况下，才应该使用ID，如果你认为以后可能需要相似的元素，就使用类。
**尽量避免使用ID选择符。**大多数情况下，ID选择符都能替换成简单的类选择符或标签选择符，ID选择符的特殊性太高，不易覆盖，会把样式表变得异常复杂。
2. 请问 "resetting" 和 "normalizing" CSS 之间的区别？你会如何选择，为什么？
    **为什么要初始化CSS样式？**——因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
    浏览器为各种标签提供了默认的样式，但是浏览器内置样式之间有差异，为了避免浏览器之间的不一致性，编写样式表时最好统一标准，也就是说，要清除浏览器内置的格式，自行指定相应的格式。
    CSS重置就是在样式表开头放一些核心标签的样式，在这些样式中设置在各种浏览器中表现不一致的属性，统一基准。
4. 描述z-index和及堆栈上下文的形成方式
    控制重叠元素的垂直叠加顺序，可以控制它控制元素的图层位置，只能影响设置了position值的元素。
5. 请描述 BFC(Block Formatting Context) 及其如何工作
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
8. 有哪些的隐藏内容的方法 (如果同时还要保证屏幕阅读器可用呢)

9. 你用过栅格系统 (grid system) 吗？如果使用过，你最喜欢哪种？介绍一下bootstrap的栅格系统是如何实现的？
10. 你用过媒体查询，或针对移动端的布局/CSS 吗（响应式设计、Zepto；@media、viewport、JavaScript 正则表达式判断平台）？媒体查询的原理？
    通过媒体查询可以为不同大小和尺寸的媒体定义不同的css，适应相应的设备的显示。允许内容的呈现针对特定设备进行裁剪，而不必改变内容。
    包含一个可选的媒体类型，以及0-多个表达式（宽度、高度、颜色）描述设备的特征，表达式最终被解析为true或false，如果媒体查询中指定的媒体类型匹配设备，且表达式都为true，媒体查询内的样式生效

```
<head>里边
<link rel="stylesheet" type="text/css" href="xxx.css" media="only screen and (max-device-width:480px)">

CSS : @media only screen and (max-device-width:480px) {/css样式/}
```
13. 举例 @media 属性除了screen?
写高效的CSS的“陷阱”
14. 使用 CSS 预处理器的优缺点有哪些？请描述你曾经使用过的 CSS 预处理器的优缺点。
    Less sass
    - 按照一定的逻辑， 把css代码分到了多个较小的文件中， 在做预处理时会自动把多个较小的文件合并成一个CSS文件，以便提升加载速度。还能压缩最终得到的CSS文件。
    - 可以轻易更新共用的值
    - 编写的代码量更少。用Sass混入，只需编写一行代码，Sass会将其转换成所有带厂商前缀的版本。此外，如果发现要在多个不同的样式中使用相同的CSS属性，可以让Sass自动添加那一部分代码。 
15. 如果设计中使用了非标准的字体，你该如何去实现？
    Web浏览器支持Web字体——访问网站时浏览器下载的字体。Web字体也使用font-family属性设置，不过除此以外还要使用一个CSS命令——@ font-face，该指令的作用是告诉Web浏览器从哪儿下载Web字体。
    **使用Web字体**
    使用Web字体时，浏览器会从Web服务器中下载字体，然后显示网页中的文字。
    CSS中设定Web字体的方式：使用@ font-face指令，负责告诉Web浏览器字体的名称和下载地址，让浏览器下载字体；再用font-family属性指定Web字体。
    一般使用Google Fonts提供的简单且免费的Web字体服务
    **使用@ font-face指令**
    下载到所需的字体文件后，首先把字体文件复制到本地保存网站文件的位置，一般会在根目录下或保存CSS文件的文件夹 下，建立一个命名为fonts的文件夹。
    font-face的根本作用是设置字体名称，并告诉浏览器从哪里下载字体文件：

    ```css
    @font-face: {
        font-family: "League Gothic"; //为字体设定名称
        src: url('fonts/League_Gothic-webfont.woff');
    }
    ```
    这里的font-family属性的作用是为字体设定名称，如果想在某个样式中使用这个字体，就要引用这里设定的名称。src属性告诉浏览器在服务器的什么位置寻找字体文件。

    p {
        font-family: "League Gothic";
    }


    如果要支持旧版浏览器、手机等，就要指定特定的字体格式。
    如果要在网站中使用某种字体的所有格式，要在字体的URL后面加上`format('字体格式如woff')`，来指明字体格式，每种字体格式的URL后面都要加上这些代码。
```css
font-face {
    font-family:'League Gothic';
    src: url('fonts/Legue_Gothic-webfont.woff2') format('woff2'),
         url('fonts/Legue_Gothic-webfont.woff') format('woff'); //在指定一系列字体文件之后，要加上分号，表明src属性结束
}
```
对Web字体，不同的变体必须在不同的字体文件中加载。在@font-face指令中，用**font-weight**和**font-style**属性来指定粗体和斜体等变体。
```css
font-face {
    font-family:'League Gothic';
    src: url('fonts/Legue_Gothic-webfont.woff2') format('woff2'),
         url('fonts/Legue_Gothic-webfont.woff') format('woff'); 
    font-weight: bold;
    font-style: italic;
}
```
一个@font-face指令只能定义一个字体，要使用四个@font-face指令才能加载某个字体的正常，粗体，斜体和粗斜体字形。其中每个指令中font-family属性的值都一样，只有src属性，font-weight属性和font-style属性的值有变化。
这种方法的好处是，我们只需要指定常规的字体，然后在HTML中使用< em>和< strong>标签，让浏览器判断该加载和使用哪个字体文件。
如果要支持IE8及以前的版本，不能用上述方法。

23. 你在开发或生产环境中使用过哪些 CSS 框架？你觉得应该如何改善他们

24. 解释您对盒子模型的理解，以及如何告诉CSS浏览器在不同的盒子模型中呈现布局。
    对文档进行布局时，浏览器的渲染引擎会根据标准之一的CSS基础框盒模型（basic box model），将所有元素表示为一个个矩形的盒子，CSS决定盒子的大小，位置，属性。

    盒模型由content，padding，border，margin组成。
    标准盒模型的width，height为content的宽高，默认使用标准盒模型。box-sizing = content-box

    将box-sizing属性设为 border-box，设置属性使用的时候更方便
24. 新的CSS Flexbox 或者 Grid 标准规格？
    web应用有不同设备尺寸和分辨率，需要响应式界面设计来满足复杂的布局需求，flexbox的优势在于，只要声明布局应该有的行为，而不要给出具体的实现方式，浏览器负责完成实际布局。
    当布局涉及到不定宽度，分布对齐的场景，就要优先考虑flexbox。
25. 响应式网站编程与使用移动优先策略之间的区别
    **响应式设计**
    响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
    **基本原理**——通过媒体查询检测不同的设备屏幕尺寸做处理。
    页面头部必须有meta声明的viewport。

```
<meta name=’viewport’ content=”width=device-width, initial-scale=1. maximum-scale=1,user-scalable=no”>
```

26. 你有兼容 retina 屏幕的经历吗？如果有，在什么地方使用了何种技术？
27. 请问为何要使用 translate() 而非 absolute positioning，或反之的理由？为什么？
translate()是transform的一个值，改变transform和opacity不会触发浏览器回流或重绘，只会触发复合compositions。transform使浏览器为元素创建一个GPU图层，更高效，可以缩短平滑动画的绘制时间。
translate改变位置时，元素依然会占据其原始空间。

改变绝对定位会触发重新布局，进而触发重绘和复合。会用到CPU

28. 为什么响应式设计 (responsive design) 和自适应设计 (adaptive design) 不同？

- setTimeout 动画与 CSS animation 区别
30. CSS里的visibility属性有个collapse属性值？在不同浏览器下以后什么区别？
当一个元素的visibility属性被设置成collapse值后，对于一般的元素，它的表现跟hidden是一样的。
chrome中，使用collapse值和使用hidden没有区别。
firefox，opera和IE，使用collapse值和使用display：none没有什么区别。
31. 在网页中的应该使用奇数还是偶数的字体？为什么呢？
使用偶数字体。偶数字号相对更容易和 web 设计的其他部分构成比例关系。
32. 你对line-height是如何理解的？
行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是height和line-height，没有定义height属性，最终其表现作用一定是line-height。
单行文本垂直居中：把line-height值设置为height一样大小的值可以实现单行文字的垂直居中，其实也可以把height删除。
多行文本垂直居中：需要设置display属性为inline-block。
33. display各个属性值
33.  CSS属性overflow属性定义溢出元素内容区的内容会如何处理?
参数是scroll时候，必会出现滚动条。
参数是auto时候，子元素内容大于父元素时出现滚动条。
参数是visible时候，溢出的内容出现在父元素之外。
参数是hidden时候，溢出隐藏。overflow:hidden有什么缺点？
34. CSS 3 如何实现旋转图片（transform: rotate）
35. link和@import引入css的区别
36. css dpi
38. css3动画，transition和animation的区别，animation的属性，加速度，重力的模拟实现
39. css 单行和多行截断
40. CSS中的长度单位（px,pt,rem,em,ex,vw,vh,vh,vmin,vmax）
    px是像素值，与浏览器的设置完全无关。
    em——相对于父元素的值，1em，和父元素相同，nem，是父元素属性的n倍
    rem——相对于根元素< html>，如果没有设置，将以16px为基准，2rem=32px
    percentage 指定为包含块的宽度、高度的百分比
41. CSS 的加载是异步的吗？表现在什么地方？
42. clearfix css属性如何有用
43. * { box-sizing: border-box; }作用及优势
44. 描述伪元素并讨论它们的用途
    伪类：以冒号做前缀，添加到选择器末尾的关键字，表示元素的特定状态，即，通过在元素选择器上加入伪类改变元素状态；

    伪元素：用于创建一些不在文档树中的元素，并为其添加样式，::before可以在元素前添加content，并为其添加样式，虽然可以看到，但不在文档树中。即，**通过对元素的操作进行对元素的改变**
48. 您将如何解决特定于浏览器的样式问题
49. float，以及它们是如何工作的
## 实践及优化
- CSS三行省略
- CSS硬件加速

-  一个满屏品字布局如何设计?
第一种真正的品字：
三块高宽是确定的；
上面那块用margin: 0 auto;居中；
下面两块用float或者inline-block不换行；
用margin调整位置使他们居中。
第二种全屏的品字布局:
上面的div设置成100%，下面的div分别宽50%，然后使用float或者inline使其不换行。

- grid布局
table布局的作用
<<<<<<< HEAD
实现两栏布局有哪些方法？
css布局问题？css实现三列布局怎么做？如果中间是自适应又怎么做？
流式布局如何实现，响应式布局如何实现
移动端布局方案
实现三栏布局（圣杯布局，双飞翼布局，flex布局）
上中下三栏布局 
双栏固定布局

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


=======
>>>>>>> 3a213e11741f733a89c4b15d90527d59d82d10b0

9 CSS3有哪些新特性？
RGBA和透明度
background-image background-origin(content-box/padding-box/border-box) background-size background-repeat
word-wrap（对长的不可分割单词换行）word-wrap：break-word
文字阴影：text-shadow： 5px 5px 5px #FF0000;（水平阴影，垂直阴影，模糊距离，阴影颜色）
font-face属性：定义自己的字体
圆角（边框半径）：border-radius 属性用于创建圆角
边框图片：border-image: url(border.png) 30 30 round
盒阴影：box-shadow: 10px 10px 5px #888888
媒体查询：定义两套css，当浏览器的尺寸变化时会采用不同的属性

13 常遇到的浏览器兼容性问题有哪些？常用的hack的技巧
不同浏览器的标签默认的margin和padding不一样。
*{margin:0;padding:0;}

IE6双边距bug：块属性标签float后，又有横行的margin情况下，在IE6显示margin比设置的大。hack：display:inline;将其转化为行内属性。
渐进识别的方式，从总体中逐渐排除局部。首先，巧妙的使用“9”这一标记，将IE浏览器从所有情况中分离出来。接着，再次使用“+”将IE8和IE7、IE6分离开来，这样IE8已经独立识别。
{
background-color:#f1ee18;/*所有识别*/
.background-color:#00deff\9; /*IE6、7、8识别*/
+background-color:#a200ff;/*IE6、7识别*/
_background-color:#1e0bd1;/*IE6识别*/
}
设置较小高度标签（一般小于10px），在IE6，IE7中高度超出自己设置高度。hack：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。
IE下，可以使用获取常规属性的方法来获取自定义属性,也可以使用getAttribute()获取自定义属性；Firefox下，只能使用getAttribute()获取自定义属性。解决方法:统一通过getAttribute()获取自定义属性。
Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。
超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}

25 CSS优化、提高性能的方法有哪些？
避免过度约束
避免后代选择符
避免链式选择符
使用紧凑的语法
避免不必要的命名空间
避免不必要的重复
最好使用表示语义的名字。一个好的类名应该是描述他是什么而不是像什么（根据用途而不是体现外观或位置的名称来命名类）
避免！important，可以选择其他选择器
尽可能的精简规则，你可以合并不同类里的重复规则

创建多个外部样式表，装饰网站中不同的元素；创建一个外部样式表（为通用样式表），用@import指令导入前面创建的各个样式表；最后在网站的html页面中用link标签或@import指令链接上一步创建的通用样式表。

29 元素竖向的百分比设定是相对于容器的高度吗？
当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

30 全屏滚动的原理是什么？用到了CSS的哪些属性？
原理：有点类似于轮播，整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500%，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现
overflow：hidden；transition：all 1000ms ease；

32 视差滚动效果？
视差滚动（Parallax Scrolling）通过在网页向下滚动的时候，控制背景的移动速度比前景的移动速度慢来创建出令人惊叹的3D效果。
CSS3实现
优点：开发时间短、性能和开发效率比较好，缺点是不能兼容到低版本的浏览器
jQuery实现
通过控制不同层滚动速度，计算每一层的时间，控制滚动效果。
优点：能兼容到各个版本的，效果可控性好
缺点：开发起来对制作者要求高
插件实现方式
例如：parallax-scrolling，兼容性十分好

35 怎么让Chrome支持小于12px 的文字？
p{font-size:10px;-webkit-transform:scale(0.8);} //0.8是缩放比例

36 让页面里的字体变清晰，变细用CSS怎么做？
-webkit-font-smoothing在window系统下没有起作用，但是在IOS设备上起作用-webkit-font-smoothing：antialiased是最佳的，灰度平滑。

37 position:fixed;在android下无效怎么处理？
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>

38 如果需要手动写动画，你认为最小时间间隔是多久，为什么？
多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms。

39 li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。
解决方法：
可以将<li>代码全部写在一排
浮动li中float：left
在ul中用font-size：0（谷歌不支持）；可以使用letter-space：-3px

40 display:inline-block 什么时候会显示间隙？
有空格时候会有间隙 解决：移除空格
margin正值的时候 解决：margin使用负值
使用font-size时候 解决：font-size:0、letter-spacing、word-spacing

41 有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度
外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

42 png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？
png是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。 大多数地方都可以用。
jpg是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。
gif是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.
webp格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

30. 规划、组织和维护样式表
     1. 对文档应用样式——将所有样式放在一个或多个外部样式表中，再将外部样式表附加到网页上（链接或导入）。如果将样式放在style标签之间，则可移植和可维护性差
     2. 在使用多个CSS文件时，速度相关的问题——1）多个文件会导致从服务器发送更多数据包，这些数据包的数量（而非内容）会影响下载时间，2）浏览器只能从同一个域同时下载数量有限的文件（对老式浏览器常常是2个文件，现代浏览器把限制提到了8）——使用结构良好的单一CSS文件可以显著提高下载速度
     3. 添加注释，为了更好地寻找样式，在每个注释头中添加一个标志
     4. 设计代码的结构
     为了便于维护，最好把样式表划分为几大块：
    - 常常把最一般的规则放在最前面（包括应用于body的、应该由站点上所有元素继承的样式，接下来是可能需要的所有全局reset样式，然后是链接、标题和其他元素）
    - 完成一般样式后，开始处理更特殊的样式和辅助样式（这些是在整个站点中使用的一般类，包括表单和错误消息方面，然后处理布局和导航等结构性元素）
    - 处理完页面结构元素之后，处理与特定页面相关的组件
    - 在页面内底部处理覆盖和例外情况
    
    文档的结构如下所示：
    - 一般性样式
      - 主体样式
      - reset样式
      - 链接
      - 标题
      - 其他元素
    - 辅助样式
	    - 表单
	    - 通知和错误
	    - 一致的条目
	 - 页面结构
		 - 标题、页脚和导航
		 - 布局
		 - 其他页面结构元素
	- 页面组件
		- 各个页面
	- 覆盖

7. 如何为功能受限的浏览器提供页面服务
