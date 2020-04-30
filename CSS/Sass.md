
[Sass(阮一峰)](https://www.ruanyifeng.com/blog/2012/06/sass.html)
[Sass中文网](https://www.sass.hk/docs/)

## Q: @extend 和 @mixin 如何选择 
编译出来的代码风格不一样
[Sass：@mixin和@extend该如何选择](https://www.w3cplus.com/preprocessor/sass-mixin-or-extend.html)

## Sass 样式复用
@mixin 混合器，一般用于复用大段样式
使用@mixin标识符定义一个混合器，它具有一个名字和一堆包含在花括号中的规则，通过@include引入这个混合器（通过混合器的名字），混合器中的样式规则就会被提取到调用@include的地方。
此外，混合器中也可以包含CSS规则，可以包含选择器和选择器中的规则，甚至可以用父选择器标识符&。

@mixin rounded-corners{
-moz-border-radius:5px;
-webkit-border-redius:5px;
border-radius:5px;
}

.notice{
background-color:green;
border:2px solid #0a0;
@include rounded-corners;
}

//导出的css如下
.notice{
background-color:green;
border:2px solid #0a0;
-moz-border-radius:5px;
-webkit-border-redius:5px;
border-radius:5px;
}

变量variables

## @extend
用于：一个元素使用的样式与另一个元素完全相同，但又添加了额外的样式。
通常会在HTML中给元素定义两个class，一个通用样式，一个特殊样式。
```html
<div class="error seriousError">
  Oh no! You've been hacked!
</div>
```

```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  border-width: 3px;
}
```
@extend 告诉Sass将一个选择器下的所有样式继承给另一个选择器。它的作用是将重复使用的样式（.error）延伸（extend）给需要包含这个样式的特殊样式（.seriousError）
```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error
  border-width: 3px;
}
```
这样，.error下的所有样式继承给.seriousError，这样，使用.seriousError的地方可以不再使用.error




## 占位符选择器 %foo
Sass额外提供一种特殊类型的选择器：占位符选择器（placeholder selector）,与id和class选择器写法相似，用“%”。
必须通过@extend 指令调用。当占位符选择器单独使用时（未通过 @extend 调用），不会编译到CSS文件中。

```scss
%full {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

#app {
    @extend %full;
}
```