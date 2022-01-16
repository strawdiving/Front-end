# 虚拟DOM
真正的DOM元素非常庞大，直接操作DOM来修改视图的话，很消耗性能。而Javascript很容易处理，可以用Javascript对象来表示DOM树上的结构、属性信息，进而可以用Javascript对象构成的抽象树来表示真实的DOM树。虚拟DOM本质上是JavaScript对象,是对真实DOM的抽象。

预先通过JavaScript进行各种计算，把最终的DOM操作计算出来并优化，由于这个DOM操作属于预处理操作，并没有真实的操作DOM，所以叫做虚拟DOM。最后在计算完毕才真正将DOM操作提交，将DOM操作变化反映到DOM树上。

Vue.js将DOM树抽象成一个以Javascript对象为节点的虚拟DOM树，用VNode节点模拟真实DOM。

Vitual DOM算法的步骤：
- ① 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
- ② diff 算法：当状态变更的时候，重新构造一棵新的对象树/重新渲染这个Javascript的对象结构。对比并记录新旧虚拟DOM树的差异
- ③ pach 算法：所记录的差异应用到真正的DOM树上，对视图进行更新

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

## 虚拟DOM更新
**虚拟DOM的优势**
DOM引擎、JS引擎相互独立，又工作在同一个线程（主线程）
JS引擎调用DOM API必须挂起JS引擎，转换传入的参数数据，激活DOM引擎，DOM重绘后再转换可能有的返回值，最后激活JS引擎并继续执行，若有频繁的DOM API调用，且浏览器厂商不做“批量处理”优化，引擎切换的单位代价将迅速积累，若其中有强制重绘的DOM API调用，重新计算布局，重新绘制对象会引起更大的性能消耗。

虚拟DOM和真实DOM的区别和优化：

1. 虚拟DOM不会立马进行排版和重绘操作
2. 虚拟DOM进行**频繁修改，然后一次性比较并修改真实DOM中需要修改的部分**，最后在真实DOM中进行排版和重绘，减少过多DOM节点重排和重绘的性能消耗
3. 虚拟DOM有效降低大面积真实DOM的重绘和排版，因为**最终和真实DOM比较差异，可以只渲染局部**

1. 虚拟dom代码实现
为什么需要虚拟DOM进行diff检测差异
当vue初始化时，会对数据data进行依赖收集，一旦数据变化，响应式系统就会得到通知，通常一个绑定一个数据就需要一个watcher

2. 虚拟dom深度递归算法实现原理 diff 算法 , **vue diff 原理/diff算法，如果有个节点数据发生了变化，vue 是怎么迅速找到对应的节点的**
更新DOM树，将新老vnode节点进行对比，根据比较结果进行最小单位地修改视图（diff算法），而不是将整个视图根据新的vnode重绘。

当页面数据变化时，Diff算法只比较同一层级的树节点，而非对树进行逐层搜索遍历，时间复杂度为O(N)：
仅在同层级的vnode之间做diff，递归地进行同级vnode的diff，最终实现整个DOM树的更新。
- 如果新的vnode不存在，直接调用oldVNode的销毁钩子
- 如果新旧节点的节点类型不同，创建并插入新的节点，移除旧的节点
- **原地复用：尽可能复用DOM，不发生DOM的移动，判断前后指针是否指向同类节点，而非同一个节点；如果是同类节点，则直接复用DOM（调用patchVnode）**
- 如果节点类型相同sameVnode（key相同，tag相同，isComment，是否都有定义data(VNodedata类型)），调用patchVNode，重新设置该节点的属性，从而实现节点的更新
**patchVnode的过程：**
  - 两个节点相同，返回
  - 只有新节点存在子节点，清空老节点DOM的文本内容，为当前DOM节点加入子节点
  - 只有老节点存在子节点，移除老节点的所有子节点
  - 新老节点都没有子节点，只有oldVNode的text有定义，将其text清空；都有定义，就进行文本替换
  - 新老节点都有子节点，则对其子节点进行diff操作（updateChildren）

diff算法过程：
对新旧节点的变化的处理：
oldCh，newCh各有两个头尾变量startIndex，endIndex，它们的两个变量互相比较，一共有4种比较方式：新首旧首，新尾旧尾，新头旧尾，旧头新尾；如果都没有匹配，如果设置了key，就用key进行比较，判断是新增节点，还是移位了。

createKeyToOldIndex（children，beginIndex,endIndex），创建key-index的map，赋给oldKeyToIdx，快速找到对应key的节点。

1. 头部、尾部的同类型节点，优先处理；节点更新后位置没变，只移动标记指针，不用移动对应的DOM，只需将节点的变更更新到DOM（patchVNode）
2. 头尾（旧头=新尾），或尾头（旧尾=新头）的同类型节点，直接移动节点位置，头尾（节点右移）/尾头（节点左移）
3. 当有节点1、2无法匹配时，使用新节点的key和旧节点进行比对，找出差异，判断是新增的节点，还是移位了。
1） 节点在oldvdom中找不到时，说明是新增的，则创建一个新DOM节点，插入oldStartIndex指向的节点前面
2） 节点在oldvdom中找得到，但不在oldstart指针位置，说明该节点被移动了，需要在DOM树中移动该节点，该节点的变更更新到DOM（patchVNode）。同时在oldvdom中将该节点标记为已处理/undefined，说明是需要出现在新DOM中的节点，不需要删除。

比较的过程中，变量会向中间靠，一旦startIndex>endIndex，表明oldCh和newCh至少有一个已经遍历完了，就会结束比较，然后删除旧节点（不删除标记为undefined的节点）或者新增新节点。

对diff算法进行优化.

3. **列表diff中key的作用** key 的作用，如果用 index 做 key 有什么问题，为什么不推荐使用数组的index
key的特殊属性主要用在Vue的虚拟DOM算法，使用key给每一个节点做一个唯一标识，Diff算法就可以在新旧nodes对比时正确辨识VNodes，**key的作用主要是为了精准高效的更新虚拟DOM**。

如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用 key，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

有相同父元素的子元素必须有独特的 key。重复的 key 会造成渲染错误

- 准确：决定节点是否被复用。如果不使用key，vue会选择复用节点（尽可能的尝试就地修改/复用相同类型元素），导致之前节点的状态被保留下来，会产生一系列的bug。

为同一层级的同组节点添加一个唯一的key进行区分，可以唯一的确定一组节点。识别出每一组节点，通过比较key发现，节点是同类的，只是位置发生了变化，这样只用移动操作调整位置，而不需要做创建和删除的操作，效率大大提高。

比如： 三个input框，如果用index作为索引，如果删除了第2个，index从1 2 3变成1 2而不是1 3，Vue会认为把2变成了3，把3删除了。

比如key的取值可以是索引index吗？ 索引是按位置排序的，如果调换位置后，原来的A(key=1),B(key=2),C(key=3)，变成了C(key=1),B(key=2),A(key=3)，失去了key的功能，没有办法唯一确定一组节点了。

如果数组内删除了一个对象，则该元素后面的元素下标都前移了一位，之前key对应的数据和DOM就乱了，除非重新匹配key

而使用key时，它会基于key的变化重新排列元素顺序，且移除key不存在的元素。key和某个元素绑定在一起，如果那个key对应的数据发生变化，直接更新对应的dom就行，不用全部更新一遍

- 快速：key的唯一性可以被Map数据结构充分利用，首尾对比没找到复用节点时，通过key-index的map快速找到对应key的节点相对于遍历查找的时间复杂度O(N)，Map的时间复杂度为O(1)。

有相同父元素的子元素必须有**独特的key**，重复的key会造成渲染错误。

最常见的用例是结合v-for；

当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

为了给Vue一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，需要为每项提供一个唯一key属性。key属性的类型只能为string或number类型。

key的特殊属性主要用在Vue的虚拟DOM算法，在新旧nodes对比时辨识VNodes。如果不使用key，Vue会使用一种最大限度减少动态元素并尽可能的尝试修复/再利用相同类型元素的算法。使用key，它会基于key的变化重新排列元素顺序，并且会移除key不存在的元素。

它也可以用于强制替换组件/元素而不是重复使用它。当遇到以下场景时它可能会很有用：
- 完整触发组件的生命周期钩子
- 触发过渡，<transition><span :key='text'>{{text}}</span></transition>，当key发生变化时，span总是被替换而不是被修改，因此会触发过渡。
使用相同标签名元素的过渡切换时，也用到key，目的是让vue可以区分它们，否则vue只会替换其内部属性，不会触发transition过渡效果。


key是为Vue中的vnode标记的唯一id,通过这个key,我们的diff操作可以更准确、更快速

diff算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的key与旧节点进行比对,然后超出差异.

diff程可以概括为：Vue 的 diff 过程可以概括为：oldCh 和 newCh 各有两个头尾的变量 oldStartIndex、oldEndIndex 和 newStartIndex、newEndIndex，它们会新节点和旧节点会进行两两对比，即一共有4种比较方式：newStartIndex 和oldStartIndex 、newEndIndex 和 oldEndIndex 、newStartIndex 和 oldEndIndex 、newEndIndex 和 oldStartIndex，如果以上 4 种比较都没匹配，如果设置了key，就会用 key 再进行比较，在比较的过程中，遍历会往中间靠，一旦 StartIdx > EndIdx 表明 oldCh 和 newCh 至少有一个已经遍历完了，就会结束比较。这四种比较方式就是首、尾、旧尾新头、旧头新尾.

准确: 如果不加key,那么vue会选择复用节点(Vue的就地更新策略),导致之前节点的状态被保留下来,会产生一系列的bug. 如果加了key，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

快速: key的唯一性可以被Map数据结构充分利用,相比于遍历查找的时间复杂度O(n),Map的时间复杂度仅仅为O(1).利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

```javascript
function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```

Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

React 和 Vue 的 diff 时间复杂度从 O(n^3) 优化到 O(n) ，那么 O(n^3) 和 O(n) 是如何计算出来的？

## 既然Vue通过数据劫持可以精准探测数据变化,为什么还需要虚拟DOM进行diff检测差异?
考点: Vue的变化侦测原理

前置知识: 依赖收集、虚拟DOM、响应式系统

现代前端框架有两种方式侦测变化,一种是pull一种是push

pull: 其代表为React,我们可以回忆一下React是如何侦测到变化的,我们通常会用setStateAPI显式更新,然后React会进行一层层的Virtual Dom Diff操作找出差异,然后Patch到DOM上,React从一开始就不知道到底是哪发生了变化,只是知道「有变化了」,然后再进行比较暴力的Diff操作查找「哪发生变化了」，另外一个代表就是Angular的脏检查操作。

push: Vue的响应式系统则是push的代表,当Vue程序初始化的时候就会对数据data进行依赖的收集,一但数据发生变化,响应式系统就会立刻得知,因此Vue是一开始就知道是「在哪发生变化了」,但是这又会产生一个问题,如果你熟悉Vue的响应式系统就知道,通常一个绑定一个数据就需要一个Watcher,一但我们的绑定细粒度过高就会产生大量的Watcher,这会带来内存以及依赖追踪的开销,而细粒度过低会无法精准侦测变化,因此Vue的设计是选择中等细粒度的方案,在组件级别进行push侦测的方式,也就是那套响应式系统,通常我们会第一时间侦测到发生变化的组件,然后在组件内部进行Virtual Dom Diff获取更加具体的差异,而Virtual Dom Diff则是pull操作,Vue是push+pull结合的方式进行变化侦测的.

5. 介绍虚拟DOM（https://www.jianshu.com/p/616999666920）

虚拟DOM的优劣如何?
优点:

保证性能下限: 虚拟DOM可以经过diff找出最小差异,然后批量进行patch,这种操作虽然比不上手动优化,框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的DOM操作性能要好很多,因此虚拟DOM可以保证性能下限

无需手动操作DOM: 虚拟DOM的diff和patch都是在一次更新中自动进行的,我们无需手动操作DOM,极大提高开发效率,只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；

跨平台: 虚拟DOM本质上是JavaScript对象,而DOM与平台强相关,相比之下虚拟DOM可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等

缺点:

无法进行极致优化: 在一些性能要求极高的应用中虚拟DOM无法进行针对性的极致优化,比如VScode采用直接手动操作DOM的方式进行极端的性能优化

虚拟DOM实现原理? [面试官: 你对虚拟DOM原理的理解?](https://mp.weixin.qq.com/s?__biz=MzI3NjM1OTI3Mw==&mid=2247483738&idx=1&sn=3f38e3ad9dddfa9740c9f3f4eb8b412c&chksm=eb77f05cdc00794a8b87f46b5bef4d854227b800c0a3b71178f8cc1624ecafa049c8339981ae&scene=21#wechat_redirect)
