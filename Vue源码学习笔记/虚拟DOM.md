# 虚拟DOM
真正的DOM元素非常庞大，直接操作DOM来修改视图的话，很消耗性能。而Javascript很容易处理，可以用Javascript对象来表示DOM树上的结构、属性信息，进而可以用Javascript对象构成的抽象树来表示真实的DOM树。

Vue.js将DOM树抽象成一个以Javascript对象为节点的虚拟DOM树，用VNode节点模拟真实DOM。

Vitual DOM算法的步骤：
- 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
- 当状态变更的时候，重新构造一棵新的对象树/重新渲染这个Javascript的对象结构。对比并记录新旧虚拟DOM树的差异
- 所记录的差异应用到真正的DOM树上，对视图进行更新


Vue通过建立一个虚拟DOM来追踪自己要如何改变真实DOM。
```javascript
return createElement('h1',this.blogTitle)
```
createElement返回的其实不是一个实际的DOM元素，它更准确的名字可能是`createNodeDescription`，它所包含的信息会告诉Vue页面上需要渲染什么样的节点，包括及其子节点的描述信息。我们把这样的节点描述为“**虚拟节点(Virual node)**”,简写为“**VNode**”,而“**虚拟DOM**”是我们对由Vue组件树建立起来的整个VNode树的称呼。



虚拟DOM的内容在/src/core/vdom/文件夹中，包含：
- vnode.js，包括VNode类的定义，以及一些常见的构造VNode节点的方法
- create-component.js，创建一个组件节点
- create-element.js，创建一个虚拟节点
- create-functional-component.js
- patch.js
- modules/
  - directives.js
  - index.js
  - ref.js
- helpers/

## VNode
```javascript
export default class VNode {
  tag: string | void; 
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node

  asyncFactory: Function | void; // async component factory function
  ......


  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    ......
  }
}
```
- 参数：
  - { String } tag，当前节点的标签名
  - { VNodeData } data，当前节点对应的对象，包含了一些具体的数据信息
  - { Array< VNode> } children，当前节点的子节点
  - { String } text，当前节点的文本
  - { Node } elm，当前虚拟节点对应的真实DOM节点
  - { Component } context，当前节点的编译作用域，即当前节点在该组件的作用域内渲染
  - { VNodeComponentOptions } componentOptions，组件的options选项

- 示例：
```html
<div class="container">
  <span class="demo">hello,world</span>
</div>
```
对应的VNode树：
```javascript
{
    tag: 'div',
    data: {
        class: 'container',
    },
    children: [
        {
            tag: 'span',
            data: {
                class: 'container',
            },
            text: 'hello,world'
        }
    ]
}
```
- createEmptyVNode,创建一个空节点
```javascript
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```
- createTextVNode，创建一个文本节点
```javascript
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

## createElement
createElement函数中使用模板中的哪些功能。
### 接受的参数
- { String | Object | Class<Component> | Function } tag，必填项，一个HTML标签名，组件选项对象，或者resolve了上述任何一种的一个async函数
- { VNodeData } data，一个与模板中属性对应的数据对象，可选
- { String | Array } children，可选，子级虚拟节点（VNodes)，由'createElement()'构建而成，也可以使用字符串来生成"文本虚拟节点"
```javascript
createElement('h1','一则头条')
createElement(MyComponent,{
    props: {
        someProp: 'foobar'
    }
})
```