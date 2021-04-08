普通的div变成富文本可编辑：
     显示：v-html
     编辑：contenteditable = true


## input输入中文时，拼音在输入框内会触发input事件

问题描述：监听文本输入框的input事件，在拼写汉字（输入法）但汉字并未实际填充到文本框中（选词）时会触发input事件。需要实现的功能是在选词完成后触发input事件，只触发一次。

原因：在输入中文时，会先后触发 compositionstart，compositionend事件，类似于keydown和keyup的组合。

触发compositionstart事件时，文本框会填入“虚拟文本”（待确认文本），同时触发 input 事件；在触发compositionend事件时，就是填入事件内容后（已确认文本）

解决办法：声明一个flag，默认为true，在触发compositionstart时，flag为false，compositionend事件时flag置为true，在input事件中通过flag的值来判断当前输入的状态（flag为false时，表示正在输入中文）

