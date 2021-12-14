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
