1. ant-design-vue表格设置单选，多选
```html
<a-table :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }">
</a-table>
)
```
主要设置rowSelection属性，多选/单选，type分别设为'checkbox'和'radio'

```javascript
const selectedRowKeys = ref<string[]>([])
const selectedRecord = ref(null)
const onSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys
  selectedRecord.value = tableData.value.find((item) => item.id === selectedRowKeys.value[0])
}
```

2. ant-design-vue框架下，引入element-plus的组件作为全局组件
在components/index.ts中引入：
```javascript
import { ElCascader, ElTimePicker, ElConfigProvider } from 'element-plus'
import type { App } from 'vue'
export default {
  install: function (app: App) {
    app.component(ElCascader.name, ElCascader)
    app.component(ElTimePicker.name, ElTimePicker)
    app.component(ElConfigProvider.name, ElConfigProvider))
  }
}
```

在main.ts中：
```javascript
import components from './components'
import App from './App.vue'

const app = createApp(App)
app.use(components)
```

在使用element-plus组件的组件中
```html
<el-time-picker v-model="form.consumeTimeRange"
  is-range
  clearable
  format="HH:mm"
  start-placeholder="开始时间"
  end-placeholder="结束时间"
  size="small">
</el-time-picker>
```
出现问题： placeholder是中文，但是下来弹出框dropdown中的提示文本还是英文

解决办法：用config-provider来配置多语言，导入element-plus库中的多语言配置，如zh-cn，配置给config-provider的locale属性。

```html
<el-config-provider :locale="zhCn">
  <el-time-picker v-model="form.consumeTimeRange"
    is-range
    clearable
    format="HH:mm"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    size="small">
  </el-time-picker>
</el-config-provider>
```
```javascript
import zhCn from 'element-plus/es/locale/lang/zh-cn'
```
参考：
[config-provider全局配置] (https://element-plus.org/zh-CN/component/config-provider.html)
[config-provider全局配置国际化] (https://element-plus.gitee.io/zh-CN/guide/i18n.html#configprovider)

2. Vue3动态设置img的src
-
`<img :src="srcUrl"/>`
- 导入图片路径，再赋值给变量
```html
<img :src="homeUrl"/>
```
```javascript
import home from './static/join.png'

export default {
  data() {
    return homeUrl: home
  }
}
```
4. Tree组件
```html
<a-tree
    :tree-data="categoryTreeData"
    :replace-fields="replaceFields"
    draggable
    @dragenter="onDragEnter"
    @drop="onDrop"
    v-model:expandedKeys="expandedKeys"
  >
    <template #custom="item">
      <a-row type="flex" justify="space-between">
        <a-col :span="7">
          <a-input class="edit-input"
            v-if="item._editable"
            v-model:value="item._name"
            @change="changeName(item)"
            size="small"
            :maxlength="50"
            style="width: 200px"
            v-scrollIntoView
          >
            <template #suffix>
              <span class="text-green-500 mr-2">
                <check-circle-outlined @click="saveEdit(item)"></check-circle-outlined>
              </span>
              <span class="text-red-500">
                <close-circle-outlined @click="quitEdit(item)"></close-circle-outlined>
          <div class="category-title truncate overflow-ellipsis" v-else> {{item.name}} </div>
        <a-col :span="16">
          <template v-if="item.level === 0">
            <a-cascader size="small" v-model:value="item.product" style="width: 300px" @change="changeProd(item)" :field-names="{ label: 'name', value: 'code' }" :options="options" placeholder="请选择关联产品"></a-cascader>
          <div class="space-x-2 float-right" style="right: 200" v-if="canOpt&&!item._editable">
            <icon class="icon-add" @click="addNewSubNode(item)"/>
            <icon class="icon-edit" @click="editNode(item)"/>
            <icon class="icon-delete" @click="delNode(item)"/>
            <icon class="icon-drag")
          </div>
          </template>
        </a-col>
          </a-input>
        </a-col>
      </a-row>
    </template>
</a-tree>
```
- 如何获取选中节点的数据
```javascript
function addNewSubNode(node) {
  console.log(node.dataRef) // dataRef中存的是该节点的数据
  node.dataRef.name = 'aaa' // 通过设置dataRef来修改节点的值
}
```

- tree列表根据需求需要进行筛选时，隐藏不必要的TreeNode可以筛选出不必要的数据，并且依然可以保持原数据的父子节点之间的关系

在设置checkable情况下：

{ display ? <TreeNode /> : null }
这样的话新生成的Tree节点间父子关系和原数据不同，
如果原来A节点下有BCD三个节点， 而筛选后假如只有BC两个节点， 这样当选中BC后A也会变成checked， 而按照原来的逻辑即使选中BC， A也应该是half-checked，D节点设置display：none后不会影响原来A和BCD的父子关系

5. TreeSelect

- 设置父节点不可选
需求：希望父节点只做展开和折叠子节点，不能被选中作为输入框的值

方法：treeData里遍历，对有子集的层级添加属性： `selectable = false`

6. Select组件下拉选项随页面滚动，与Select框分离的问题

Select Dropdown DatePicker TimePicker Popover Popconfirm 会跟随滚动条上下移动

需求：滚动的时候，下拉菜单也需要跟着滚动，一直悬浮在输入框下面

解决办法：
```html
<a-select :getPopupContainer="trigger => trigger.parentNode">
</a-select>
<a-date-picker :getCalendarContainer="trigger => trigger.parentNode">
</a-date-picker>
```
使用 getXxxxContainer 参数将组件渲染到滚动区域内。a-select用getPopupContainer，a-date-picker用getCalendarContainer。

a-select的getPopupContainer默认是`() => document.body`，即默认渲染到body上

`trigger => trigger.parentNode`，保证悬浮框在使用组件内部，即悬浮框的父节点;

`() => document.getElementById('#aaa')`，手动指定到对应的节点上；

因为悬浮框是绝对定位的，最好父节点设置为相对定位。如果不管用，再用一个div包住当前组件，并设置div为相对定位。

下拉组件的原理：

在不设置getPopupContainer属性时，默认当第一次触发下拉框组件时，会在body节点下，生成一个绝对定位的div（下拉框的父节点）；

当触发出现下拉框时，会根据triggerNode和body来计算top和left的值。

下拉框父节点一旦生成之后，即使收起下拉框，也不会卸载这个节点（性能原因），也即下拉框的父节点的位置就确定了，每次计算出的下拉框的位置值也就确定了。这时候，只要找到一个相对于select一起滚动的父组件（相对位置不变），将它作为下拉框组件的父组件即可。

例如：可以将下拉框组件放在select组件下，即`getPopupContainer={(triggerNode) => triggerNode.parentNode}`

- 全局设置getPopupContainer

不用对每个select进行设置，用configProvider进行全局配置。

```html
<ConfigProvider
  locale={zh_CN}
  :getPopupContainer="getPopupContainer"
</ConfigProvider>
```
```javascript
getPopupContainer(el, dialogContext) {
  return el?.parentNode
}
```
问题：全局配置后，在Modal中使用报错 `TypeError: Cannot read property 'parentNode' of undefined`

原因：全局设置 getPopupContainer 触发节点时，Modal的用法不存在 triggerNode 导致报错。

解决办法：在这种情况下，定位到document.body

```javascript
getPopupContainer(el, dialogContext) {
  return el?.parentNode ?? document.body
},
```

7. echarts超出容器宽度和自适应的问题
问题：echarts超出父盒子宽度
原因：echarts图形只绘制一次，且绘制时自动获取父级大小填写宽度

解决办法：让echarts延迟绘制，用setTimeout

```javascript
// 原来的
onMounted(() => {
  this.init()
})
// 改为
onMounted(() => {
  setTimeout(() => {
    ths.init()
  })
})
let myMap
function init() {
  myMap = echarts.init(document.getElementById('#id'))
  window.addEventListener('resize', instanceChart.resize)
}

// 记得销毁
onBeforeDestroy(() => {
  window.removeEventListener('resize', instance?.resize)
  myMap.dispose()
  myMap = undefined
})
```

8. js获取不到cookie
```javascript
import Cookie from 'js-cookie'

Cookie.get('name')
```
问题：浏览器Storage-Cookies中当前域名下存在cookie，前端却获取不到

原因：HttpOnly默认为true，禁止javascript操作cookie，导致获取不到。参与者中心为了防止CSRF攻击，将该字段设为了true