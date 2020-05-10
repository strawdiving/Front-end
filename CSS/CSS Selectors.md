### Type selectors
通过节点名称匹配元素, 选择文档中给定类型的所有元素，`element { style properties }`
### Class selectors
根据其class属性的内容匹配元素 `.class_name { style properties }`
### ID selectors
根据其id属性的值匹配元素
`#id_value { style properties }`，相当于`[id=id_value] { style properties }`
### Universal selectorsCSS
通用选择器（*）匹配任何类型的元素

可以选择某个元素下的所有元素。在与其他选择器结合使用时，通配选择器可以对特定元素的所有后代应用样式。
```css
/* 为 .demo 元素的所有后代，添加一个灰色背景*/
.demo * { background: gray; }
```
### Attribute selectors
根据给定属性的存在或值匹配元素

- [attr] 有属性attr的元素
- [attr=value] 有属性attr的元素，且其值为value的元素
- [attr~=value] 有属性attr的元素，其值是一个空格分隔的单词列表，其中一个单词是value
- [attr|=value] 有属性attr的元素，其值可以是value，或者以value开头，紧跟连字符- （U + 002D）。它通常用于语言子代码匹配。
- [attr^=value] 有属性attr的元素，其值以value为前缀。
- [attr$=value] 有属性attr的元素，其值以value为后缀。
- [attr*=value] 有属性attr的元素，其值的字符串中至少包含一个value。

```css
/* <a> elements with a title attribute */
a[title] {
  color: purple;
}
/* <a> elements with an href ending ".org" */
a[href$=".org"] {
  font-style: italic;
}
/* <a> elements with an href containing "example" */
a[href*="example"] {
  font-size: 2em;
}
/* <a> elements with an href matching "https://example.org" */
a[href="https://example.org"] {
  color: green;
}
```
### Pseudo-classes
CSS伪类是一个添加到选择器的关键字，用于指定选定元素的特殊状态。伪类可以用来根据元素的状态来设置元素的样式。

伪类将样式应用于元素，不仅仅是与文档树的内容有关，而且还涉及外部因素，如导航的历史（例如: visited）, 其内容的状态（如某些表单元素:checked）, 或鼠标的位置（如: hover，它可以让你知道鼠标是否在元素上）。

像常规类一样，可以在选择器中链接尽可能多的伪类。

`selector:pseudo-class {
  property: value;
}`
#### :not()
表示与选择器列表不匹配的元素。由于它阻止选择特定项目，因此它被称为否定伪类。

该选择器仅适用于一个元素，你不能用它来排除所有的祖先。
```css
/* <p> elements that are not in the class `.fancy` */
p:not(.fancy) {
  color: green;
}
/* Elements that are not <p> elements */
body :not(p) {
  text-decoration: underline;
}
/* Elements that are not <div> or <span> elements */
body :not(div):not(span) { 
font-weight: bold;
}
/* Selects any element that is NOT a paragraph */
:not(p) {
  color: blue;
}
：not（.foo）将匹配任何不是.foo的东西，包括<html>和<body>
```
#### :hover
当用户使用指针设备与元素进行交互时匹配，但不一定激活它。它通常在用户通过光标（鼠标指针）悬停在元素上时触发。

要适当地设置链接样式，请将：hover规则放置在：link和：visited规则之后，但在：active 之前，按照LVHA-order：：link - ：visited - ：hover - ：active定义的顺序。
:hover伪类在触摸屏上存在问题。

#### :active
表示由用户激活的元素（例如按钮），当使用鼠标时，“activation”通常在用户按下主鼠标按钮时开始，并在释放时结束。常用于< a>和< button>元素，但也可用于其他元素。
```css
/* Selects any <a> that is being activated */
a:active {
  color: red;
}
```
由：active伪类定义的样式将被任何后续与链接相关的伪类（：link，：hover或：visited）重写，这些类至少具有相同的特定性specificity。要适当地设置链接的样式，请将：active规则放在所有其他链接相关规则之后，如LVHA-order：：link - ：visited - ：hover - ：active所定义。
#### :first-child/:last-child/nth-child(n)
代表了一组兄弟元素中的第一个、最后一个元素、第n个元素
```css
<div>
  <p>This text isn't selected.</p>
  <p>This text is selected!</p>
</div>
<div>
  <p>This text isn't selected.</p>
</div>
p:last-child {
  color: lime;
  background-color: black;
  padding: 5px;
}
```
#### :empty
代表没有孩子的任何元素，孩子可以是元素节点或文本（包括空格）。注释或处理指令不影响元素是否被视为空。
```css 
/* Selects any <div> that contains no content */
div:empty {
background: lime;
}
```
#### :focus
表示已获得焦点的元素（如form input）, 当用户click或tap某个元素或通过键盘的“tab”键选择它时，通常会触发focus。
```css
<input class="blue-input" value="I'll be blue when focused.">
.blue-input:focus {
  background: yellow;
  color: blue;
}
```
#### :checked
代表任何radio（< input type =“radio”>），checkbox（< input type =“checkbox”>）或option（< option in a < select>）被checked或切换到on状态。

用户可以通过检查/选择元素来参与该状态，或者通过取消选中/取消选择该元素来解除该状态。
```css
/* Matches any checked/selected radio, checkbox, or option */
:checked {
  margin-left: 25px;
  border: 1px solid blue;
}
```
### Pseudo-elements
一个添加到选择器的关键字，可以style所选元素的特定部分。例如:: first-line可用于更改paragraph第一行的字体。
```css
selector::pseudo-element {
  property: value;
}
```
#### :after/:before
```css
/* CSS3 syntax */
::after, ::before

/* CSS2 syntax */
:after, :before
```
创建一个伪元素，它是所选元素的最后一个/第一个子元素。它通常用于将cosmetic content添加到具有content属性的元素上。它默认是内联的。由:: before和:: after生成的伪元素由元素的formatting box包含，因此不适用于replaced元素，如< img>或< br>元素。
```html
<q>Some quotes,</q> he said, <q>are better than none.</q>
```
```css
q::before {
  content: "«";
  color: blue;
}
q::after {
  content: "»";
  color: red;
}
```
效果：

![after](./after.png)

#### ::placeholder
表示表单（form）元素的占位符文本
```html
<input placeholder="Type something here!">
```
```css
input::placeholder {
  color: red;
  font-size: 1.2em;
  font-style: italic;
}
```
![placeholder](./placeholder.png)

## Combinator
### Adjacent sibling combinatory（+）
相邻同胞选择器，用于定位同一父元素下某个元素之后的元素。

相邻兄弟组合子,分隔两个选择器，并且仅当它紧跟在第一个元素之后时才匹配第二个元素，并且两个元素都是同一父元素的子元素

`former_element + target_element  { style properties }`
```css
<ul>
  <li>One</li>
  <li>Two!</li>
  <li>Three</li>
</ul>

li:first-of-type + li {
  color: red;
}
```
![sibling](./sibling.png)
### General sibling combinator（~）
一般兄弟组合子, 分离两个选择器并仅在第二个元素跟随第一个元素（但不一定立即）时匹配第二个元素，并且二者都是同一父元素的子元素。

`former_element ~ target_element { style properties }`
```html
<span>
```This is not red.</span>
<p>Here is a paragraph.</p>
<code>Here is some code.</code>
<span>And here is a red span!</span>
<code>More code...</code>
<span>And this is a red span!</span>
```
```css
p ~ span {
  color: red;
}
```
![sibling1](./sibling1.png)
### Child combinator（>）
放置在两个CSS选择器之间。它仅匹配由第二个选择器匹配的元素，由第二个选择器匹配的元素必须是由第一个选择器匹配的元素的直接子元素。

`selector1 > selector2 { style properties }`
```html
<div>
  <span>Span #1, in the div.
    <span>Span #2, in the span that's in the div.</span>
  </span>
</div>
<span>Span #3, not in the div at all.</span>
```
```css
span {
  background-color: white;
}
div > span {
  background-color: DodgerBlue;
}
```
![child](./child.png)
### Descendant combinator（ ）
通常由单个空格字符表示，组合两个选择器，以便如果第二个选择器具有与第一个选择器匹配的祖先元素，则会选择由第二个选择器匹配的元素。使用descendant combinator的选择器称为descendant selectors。

`selector1 selector2 { /* property declarations */ }`
即匹配selector1的元素的后代元素中，匹配selector2的所有元素（即都具有匹配selector1的祖先），selector2作为selector1的后代
```css
/* 列出"my-things" list的后代元素 */
ul.my-things li {
  margin: 2em;
}
```
descendant combinator一般是一个或多个CSS空白字符——space character和/或4个控制字符（carriage return, form feed, new line, and tab characters回车，换页，换行和制表符）之一

**注：当css selector之间没有空格时，表示“且”的关系，要同时符合这几个selectors才能生效**


选择器    | 例子     | 例子描述 |CSS
---------|----------|---------|--------
 .class  | .intro   | 选择 class="intro" 的所有元素      |1
 #id     | #firstname | 选择 id="firstname" 的所有元素   |1
 *       | *         |选择所有元素     |2
 element | p         |选择所有< p>元素 |1
 element,element     | div, p |选择所有< div> 元素和所有< p> 元素     |1
 element element 后代 | div p  |选择 < div> 元素内部的所有 < p> 元素    |1
 element>element 子代 | div>p  |选择父元素为 < div> 元素的所有 < p> 元素 |2
 element+element 紧邻同辈 | div+p  |选择紧接在 < div> 元素之后的所有 < p> 元素 |2
 element1~element2    | p~ul     |选择前面有 < p> 元素的每个 < ul> 元素|3
 [attribute]         |[target]        |选择带有 target 属性所有元素|2
 [attribute=value]   |[target=_blank] |选择 target="_blank" 的所有元素|2
 [attribute~=value]  |[title~=flower] |选择 title 属性包含单词 "flower" 的所有元素|2
 [attribute|=value]  |[lang|=en]      |选择 lang 属性值以 "en" 开头的所有元素|2
 [attribute^=value]  |a[src^="https"] |选择其 src 属性值以 "https" 开头的每个  < a> 元素|3
 [attribute$=value]  |a[src$=".pdf"]  |选择其 src 属性以 ".pdf" 结尾的所有 < a> 元素|3
 [attribute*=value]  |a[src*="abc"]   |选择其 src 属性中包含 "abc" 子串的每个 < a> 元素|3
 :link    |a:link    |选择所有未被访问的链接 |1
 :visited |a:visited |选择所有已被访问的链接 |1
 :active  |a:active  |选择活动链接          |1
 :hover   |a:hover   |选择鼠标指针位于其上的链接|1
 :focus   |input:focus|选择获得焦点的 input 元素|2
 :checked |input: checked|选择每个被选中的 < input> 元素|3
 :enabled |input: enabled|选择每个启用的 < input> 元素 |3
 :disabled|input: disabled|选择每个禁用的 < input> 元素|3
 :first-letter|p:first-letter|选择每个 < p> 元素的首字母|1
 :first-line  |p:first-line  |选择每个 < p> 元素的首行  |1
 :lang(language)|p:lang(it)|选择带有以 "it" 开头的 lang 属性值的每个 < p> 元素|2
 :first-of-type|p:first-of-type|选择属于其父元素的首个 < p> 元素的每个 <p> 元素|3
 :last-of-type|p:last-of-type|选择属于其父元素的最后 < p> 元素的每个 < p> 元素|3
 :nth-of-type(n)|p:nth-of-type(2)|选择属于其父元素第二个 < p> 元素的每个 < p> 元素|3
 :nth-last-of-type(n)|p:nth-last-of-type(2)|同上，但是从最后一个子元素开始计数|3
 :only-of-type|p:only-of-type|选择属于其父元素唯一的 < p> 元素的每个 < p> 元素|3
 :first-child| p:first-child| 选择属于父元素的第一个子元素的每个< p> 元素|2
 :last-child | p:last-child | 选择属于其父元素最后一个子元素每个< p> 元素|3
 :nth-child(n)|p:nth-child(2)|选择属于其父元素的第二个子元素的每个< p> 元素|3
 :nth-last-child(n)|p:nth-last-child(2)|同上，从最后一个子元素开始计数|3
 :only-child|p:only-child|选择属于其父元素的唯一子元素的每个< p> 元素|3
 :empty| :p:empty|选择没有子元素的每个 < p> 元素（包括文本节点）|3
 :root | :root|选择文档的根元素|3
 :target|#news:target|选择当前活动的 #news 元素|3
 :not(selector)|:not(p)|选择非 < p> 元素的每个元素|3
 ::after |p::after|在每个 < p> 元素的内容之后插入内容|3
 ::before|p::before|在每个 < p> 元素的内容之前插入内容|3
 ::selection|::selection|选择被用户选取的元素部分|3







