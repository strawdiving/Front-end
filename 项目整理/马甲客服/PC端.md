
1. Websocket连接超时报错
报错场景：前后端建立websocket连接时，前端使用了SockJS + stomp

报错信息：`Error: Incompatibile SockJS! Main site uses: “1.5.0“, the iframe: “1.0.0“. at s (VM6 sockjs.min.js:2)`

解决办法：将超时时长timeout增加，就连接成功了。

`const socket = Stomp.over(new SockJS('http://localhost:8080/message/ws', null, { timeout: 15000 }))`

3. div左侧显示两个图标（竖行显示）作为菜单操作

4. 在text上点击，出现悬浮框菜单，可复制/收藏text内容。点击空白处消失，点击菜单选项后消失

5. 右键点击弹出悬浮框右键菜单 --》 context插件
问题：因为app使用了位移，transform，导致context原本应该出现在鼠标位置的，实际发生了偏移
     解决办法：减去app的偏移（左上角的偏移，left，top)
遗留问题：打开F12或者页面缩放时，上述方法会导致出现context的位置不对

解决办法：改为flexbox布局，不用绝对定位及transform

6. 右侧slider的菜单，component动态组件切换时transition不流畅
    修改transition的css动画样式
vue 的transition的效果
  drawer,fade，可以自己设置css属性
7. icon的active，hover样式先后顺序有关系，会出现样式覆盖

1. 附件上传，el-upload的样式，list的样式处理
上传多个时，调用了多个upload接口，有多个id

2. 公众号消息模板配置, 实时预览模板

4. 如何从表格中进入模板消息页面（编辑），将值导入生成页面初始值
3. 用户组管理，分类查询

4. el-dialog的封装，visible的设置

router，route加入props: true 属性，在this.$router.push(...)时，可以传入params，作为组件页面的props

 this.$router.push({name:xxx, params: {userId:xxx, pageType: xxx}
      再对应的route中，设置 props属性为true， 则 params会作为跳转到的组件的props属性
https://router.vuejs.org/zh/guide/essentials/passing-props.html

7. 实现自定义确认框（confirm）

8. 获取dom元素的宽高
在Vue中，要获取指定元素的高度宽度等，可以用ref，加在普通的元素上，使用this.$refs.name，`<div ref="name"></div>`就可以获取到该dom元素。

- offsetHeight——元素的宽度，包括元素content、padding和border的部分,不包括margin
- offsetWidth——元素高度，包括......
- clientWidth——元素宽度，包括content,padding，不包括border和margin
- clientHeight——元素高度，......
- style.width——元素宽度，包括content，不包括padding，border，margin
- style.height——元素高度，.....
- scrollWidth——元素宽度，包括content,padding和溢出尺寸，不包括border和margin，没有溢出的情况下，同clientWidth
- scrollHeight——元素高度，......，没有溢出的情况下，与clientHeight相同

`let height = this.$refs.name.$el.offsetHeight`

还可以获取带有单位的数值

`let height = window.getComputedStyle(this.$ref.name).height`

问题：dom元素内部内容是动态的，重置数据后直接获取DOM元素宽高不准确

原因：重置数据后，获取dom元素宽高时，dom元素还未渲染完毕

解决办法：nextTick(callback)
```javascript
this.$nextTick(() => {
  let height = this.$refs.name.$el.offsetHeight
})
```
