1. 有些数据项如运行编号太长，显示在表格中时不完整（设置了min-width），需要可以复制(原来的属性show-tooltip可以实现，但体验不好)，===》用span的方式
表格用expand时，span太长，需要换行
3. 菜单，按钮的权限配置。前端配置权限后传给后端，最初页面加载时读取权限，根据权限进行菜单/按钮的显示/隐藏
4. 表格用select多选
   换页时，记住之前页面的选择  table-column，设置reserve-selection属性， table必须设置row-key
5. 表格中某一列中加入操作，根据状态显示不同的按钮选项
   根据状态text的颜色不同
   表格的 slot-scope, template

6. 可分页的select组件，long-list-select长列表
   分页功能问题，下拉后会不停请求下一页，滚动下拉请求速度太快。按照正确的写法：

在分页请求表格数据时，页面变化后，点击查询时，应该把page置为1

mixin的使用，以及注意点：可能会影响其他页面的数据

表单验证--》正则表达式：ip,mail,phone, creditcard, ID等
注意点：
ip: 按网上常规的，对于256.0.0.1 ==》 56.0.0。1 或251.0.0。300 ==》 251.0.0.30
这种部分匹配的，无法检测出input输入错误
解决：前面加上 ^, 后面加上 $
问题：对001.1.1.1这种无法甄别

font-awesome图标库版本要注意：
5.11.x，写法：fas fa-xxx，在中台业务系统里，argon封装成 <icon type="" name=""></icon> 组件，可以用font-awesome,也可以用ni的图标

信息发送管理中，人员信息查询，keyword分页获取所有用户

日期时间组件：
   对日期进行筛选，设定defaultTime，设定禁用日期/可选日期时间范围disableDate

