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

## 权限设置
### 指令权限：实现按钮级别的权限判断
1.  v-permission指令

```javascript
const roles = store.getter.roles
const { value } = binding

if(value && value instanceof Array && value.length > 0) {
   const permissionRoles = value
   // 看当前用户的roles是否符合v-permission中列出来的，来控制组件/按钮的可见性
   const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
   })
   if(!hasPermission) {
      { el.parentNode && el.parentNode.removeChild(el) }
   }
} else {
   报错 'need roles'
}
```

- 使用：`<el-tag v-permission="['admin']"></el-tag>`，表明admin角色可见

根据当前用户的roles是否匹配v-permission中列出来的角色，来控制组件/按钮的可见性。

如：v-permission=['admin', 'editor']

- 局限：Tab组件不可用v-permission，必须手动设置v-if；解决办法：可以使用全局权限判断函数
```javascript
<el-tab-pane v-if="checkPermission(['admin'])"/>
```
checkPermission用法和v-permission类似

### 菜单权限
通过获取当前用户的权限，去对比路由表，生成当前用户具有权限可访问的路由表，通过 router.addRoutes 动态挂载到router上。

另一个思路：在后台给每个页面动态配置权限，将路由表存到后端，用户登录后得到roles，前端根据roles向后端请求可访问的路由表，从而动态生成可访问页面，用router.addRoutes挂载到router上。

高级用户配置其他用户可见的图表，页面上根据roles显示可见的图表。

main.js中，导航卫士beforeRoute，如果没有login信息，则在每个route前加上/login

登录：不同权限对应不同路由，菜单也根据不同权限异步生成。
填写账号密码后，向服务器端验证是否正确，通过后，服务器端返回一个token，拿到token后，存储在cookie中，保证刷新页面后能记住登录状态。

权限验证：通过token获取用户对应的role，动态根据role算出其对应有权限的路由，通过router.addRoutes动态挂载路由，由vuex管理动态路由