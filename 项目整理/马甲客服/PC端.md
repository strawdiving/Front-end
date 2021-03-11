
Websocket

3. div左侧显示两个图标（竖行显示）作为菜单操作

4. 在text上点击，出现悬浮框菜单，可复制/收藏text内容。点击空白处消失，点击菜单选项后消失
5. 右键点击弹出悬浮框右键菜单 --》 context插件
问题：因为app使用了位移，transform，导致context原本应该出现在鼠标位置的，实际发生了偏移
     解决办法：减去app的偏移（左上角的偏移，left，top)
遗留问题：打开F12或者页面缩放时，上述方法会导致出现context的位置不对

6. 右侧slider的菜单，component动态组件切换时transition不流畅
    修改transition的css动画样式
vue 的transition的效果
  drawer,fade，可以自己设置css属性
7. icon的active，hover样式先后顺序有关系，会出现样式覆盖

1. 附件上传，el-upload的样式，list的样式处理
上传多个时，调用了多个upload接口，有多个id
2. 通过链接点击下载附件
2. 公众号消息模板配置, 实时预览模板

4. 如何从表格中进入模板消息页面（编辑），将值导入生成页面初始值
3. 用户组管理，分类查询

4. el-dialog的封装，visible的设置

router，route加入props: true 属性，在this.$router.push(...)时，可以传入params，作为组件页面的props

 this.$router.push({name:xxx, params: {userId:xxx, pageType: xxx}
      再对应的route中，设置 props属性为true， 则 params会作为跳转到的组件的props属性
https://router.vuejs.org/zh/guide/essentials/passing-props.html

5. Websocket连接超时报错

6. 富文本编辑
   普通的div变成富文本可编辑：
     显示：v-html
     编辑：contenteditable = true

   input输入中文时，拼音在输入框内会触发input事件

7. 实现自定义确认框（confirm）

8. 获取dom元素的宽高






