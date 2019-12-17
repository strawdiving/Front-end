# joint.mvc.View
joint.mvc.View

|                           |                             |
| ------------------------- | --------------------------- |
| `options`                 | `{ }`                       |
| `requireSetThemeOverride` | `false`                     |
| `theme`                   | `null`                      |
| `defaultTheme`            | `joint.config.defaultTheme` |
| `themeClassNamePrefix`    | `“joint-theme-”`            |

### Methods

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `constructor(options)`                                       | 覆盖构造函数，它允许替换成model的实际构造函数                |
| `initialize(options)`                                        | 如果你定义了一个初始化函数，它将在model创建时被调用          |
| `_ensureElement(attrs)`                                      | 重写Backbone`_ensureElement（）`方法以创建一个svg元素        |
| `_setAttributes (attrs)`                                     | 设置vel或el元素的attr属性                                    |
| `_createElement (tagName)`                                   | 创建一个tagName的元素/svgElement                             |
| `_setElement (el)`                                           | 替代的DOM操作API,通过添加元素引用this.vel，包装在Vectorizer  |
| `_ensureElClassName`                                         | 将className替换为prefixedClassName,加上前缀                  |
| `init、onRender、setTheme``onRemove、onSetTheme (oldTheme, newTheme)` | to be overriden                                              |
| `addThemeClassName (theme)``removeThemeClassName(theme)`     | 变成joint-theme-xxx，   或移除主题名xxx                      |
| `remove`                                                     | 移除该cid对应的view                                          |
| `getEventNamespace`                                          | `返回‘.joint-event-ns-’+ cid`                                |
|                                                              |                                                              |
| `extend`                                                     | 处理protoProps, staticProps参数后，this对象调用Backbone.View.extend方法，传递protoProps, staticProp参数 |
|                                                              |                                                              |


