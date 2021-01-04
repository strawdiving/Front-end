PC 端：
1. 在管理后台添加时，使用的富文本，导致会有html格式的知识内容，在card里清除掉格式
   div(v-html="content") 用v-html进行显示，{{content}}形式默认是v-text
2. 到输入框里，也要按Html格式进行渲染显示
   原先是textarea，只支持纯文本
   解决办法：使用div(contenteditable="true")  其中内容实现双向绑定：使用 v-model，@input事件

   注意：链接以及图片内容如何处理？

移动端：
   Q：长按触摸事件，touchstart中使用了e.preventDefault(),导致内容中有链接时，点击链接无法跳转