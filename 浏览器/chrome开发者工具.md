1. 打开方式：
fn + F12, Command + Option + I
页面上点击右键-->审查元素

2. 包含8大组工具
- Elements，看到chrome渲染页面所需的HTML,CSS和DOM对象，可以编辑内容更改页面显示效果
- Network，查看HTTP,WebSocket等
- Sources，调试js
- Timeline，加载页面花费时间的完整分析，所有事件，从下载资源到处理js，计算css样式等花费等时间都展示
- Profiles，分析Web应用或页面的执行时间及内存使用情况
- Resources: 对本地缓存（IndexedDB, Web SQL, Cookie, 应用程序缓存，Web Storage）中的数据进行确认及编辑
- Audits，分析页面加载的过程，进而提供减少页面加载时间，提升响应速度的方案
- Console，提供Shell用以和文档，开发者工具交互

### Elements
- HTML部分

Command + f , 搜索DOM树中指定的内容

选中DOM对象后，右键查看辅助功能：Attributes， Break On，Force Element State等

- Styles
主要有4小部分：
1. Styles：显示用户自定义样式，包含请求的default.css中的样式，通过js生成的样式，开发者工具添加的样式
2. Computed：显示开发者工具计算好的元素样式
3. Event Listeners：显示当前DOM节点及其祖先节点的所有JS事件监听器，这里的监听脚本可以来自Chrome的插件
4. DOM Breakpoints：所有DOM断点

以直观的图形展示了盒子模型的margin,border,padding部分；

可以Toggle Element State

### Network
优化网页，了解加载速度的瓶颈，可以用Network。

请求的每个资源在Network表格中显示为一行，每个资源有很多列的内容(可以按列排序)：
- Name/Path：资源名称及URL路径
- Status/Text：HTTP状态码/文字解释
- Type：请求资源的MIME类型
- Initiator：解释请求怎么发起
- Size/Content：Size是响应头部和响应体结合起来的大小，Content是请求内容解码后的大小
- Time：请求开始到接收到最后一个字节的总时长
- WaterFall：显示网络请求的可视化瀑布流，可以显示整个请求各部分花费的时间

可以在顶部表头部分右键，选择显示/隐藏更多列，如Cookie，Cache-Control等

其他小功能：
- Disable cache：不允许缓存，所有资源均重新加载
- Preserve Log：再次记录请求的信息时，不擦除之前的资源信息
- Record Network Log：红色表示正在记录资源请求信息 

可以查看网络请求的请求头，响应头，已经返回的内容等信息，资源的详细内容：
- request和response头
- Resource Preview：可实时进行资源预览
- response：未处理过的资源内容
- Cookie names和values：http请求以及返回中传输的所有Cookies
- WebSocket messages：通过WebSocket发送和接收到的信息
- Timing：资源加载过程中各阶段花费的时间