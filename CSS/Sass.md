## Sass 样式复用

[Sass(阮一峰)](https://www.ruanyifeng.com/blog/2012/06/sass.html)

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

extends