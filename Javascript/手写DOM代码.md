1. 如何实现点击元素外部关闭元素
2. 如何批量抓取文章
3. 获取页面所有img并且下载
4. 实现 当 ul 点击时 输出 子元素 li 的内容、
5. 点击table的td显示td内容
6. 两个同源tab之间的交互，数据同步
7. 代码实现连续点击3次每次间隔不超过1秒然后弹出页面（类似安卓的关于手机彩蛋）；
8. 长列表渲染(一个列表，假设有100000个数据，怎么办)
9. 页面搜索功能的实现
10. 图片预览功能
```javascript
    <input type="file" name="file" onchange="showPreview(this)" />
	< img id="portrait" src="" width="70" height="75">

	function showPreview(source) {
	  var file = source.files[0];
	  if(window.FileReader) {
      var fr = new FileReader();
      fr.onloadend = function(e) {
        document.getElementById("portrait").src = e.target.result;
      };
      fr.readAsDataURL(file);
	  }
	}
```
11. 文本信息文件下载
可以将文本或JS字符串信息借助Blob转换成二进制，然后作为< a >元素的 href 属性，配合 download 属性，实现下载。

希望在前端侧直接触发某些资源的下载，最方便快捷的方法就是使用HTML5原生的 download 属性，例如：
```html
<a href="large.jpg" download>下载</a>
```

```javascript
// content: 需要下载的文本或字符串内容; filename: 下载到系统中的文件名称
var download = function ( content, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'

  if(!(blob instangceof Blob)) {
    // 字符内容变成blob地址
    var blob = new Blob([content])
  }
  eleLink.href = URL.createObjectURL(blob)

  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()

  // 移除
  document.body.removeChild(eleLink)
}
```

在chrome中，模拟点击创建的< a >元素即使不append到页面中，也是可以触发下载的。但Firefox中不行，所以appendChild和removeChild的处理是为了兼容 Firefox。

对于非文本文件，也可以直接JS触发下载。如果要下载一张图片，可以将图片转成base64格式，然后下载。 将页面元素转换到canvas上，再转成base64格式下载。

```javascript
var funDownload = function(domImg, filename) {

// 创建隐藏的可下载链接

// 图片转base64地址
var canvas = doxument.createElement('canvas')
var context = canvas.getContext('2d')
var width = domImg.naturalWidth
var height = domImg,naturalHeight
context.drawImage(domImg,0,0)

// 如果是png图片，则canvas.toDataURL('image/png')
eleLink.href = canvas.toDataURL('image/jpeg')
// 触发点击
// 移除
}
......
```

第 63 题：如何设计实现无缝轮播

思路：多张图片从左至右依次排列，点击左右侧按钮切换图片的时候，让图片的父级容器的left偏移值增加或减少单张图片的宽度大小，同时配合CSS3 transition过渡或者手写一个动画函数，这样可以实现一个比较平滑的动画效果。对于无缝轮播，我当时的思路是再拷贝一个图片的父级容器出来，例如原来一个
<ul>
  <li></li>
  <li></li>
</ul>
对应两张图片，现在变为两个 ul对应4张图片，同时 ul的父容器监听自身的 scrollLeft，如果值已经大于等于一个 ul的宽度，则立即将自身的 scrollLeft值重置为0，这样就又可以从起点开始轮播，实现无缝的效果。

- 移动端如何设计一个比较友好的Header组件？

当时的思路是头部(Header)一般分为左、中、右三个部分，分为三个区域来设计，中间为主标题，每个页面的标题肯定不同，所以可以通过vue props的方式做成可配置对外进行暴露，左侧大部分页面可能都是回退按钮，但是样式和内容不尽相同，右侧一般都是具有功能性的操作按钮，所以左右两侧可以通过vue slot插槽的方式对外暴露以实现多样化，同时也可以提供default slot默认插槽来统一页面风格

- space-between和space-around的区别

按水平布局来说， space-between在左右两侧没有边距，而 space-around在左右两侧会留下边距，垂直布局同理

- React实现一个防抖的模糊查询输入框

```javascript
  // 防抖函数
function debounce(fn, wait, immediate) {
  let timer = null
  return function(...args) {
    let context = this
    if (immediate && !timer) {
      fn.apply(context, args)
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}


// <input @change="handleChange"/>

data () {
  return {
    value: ''
  }
},
methods: {
  // input的改变调用 handleChange
  handleChange (e) {
    this.value = e.target.value
    this.call()
  }，
  call () {
    let fn = this.debounce(this.callAjax, 500, true)
    fn()
  },
  callAjax () {
    // 调用异步请求函数
  }
}

```


文件上传如何做断点续传
搜索请求如何处理（防抖）
搜索请求中文如何请求

构建常见的 Web 应用程序的布局和交互，例如类似 Netflix 网站那样的。

实现小部件，如日期选择器、轮播或电子商务网站购物车。

2. 分割字符串；实际考察知识点：对「正则表达式」的了解
3. 富文本编辑器的实现；
4. 文件上传的实现；

- 往ul里面添加10个li，如果有十个元素要修改样式，怎么避免多次回流
```javascript
var oUl=document.getElementById("ul-test");
        for(var i=0;i<10;i++){
            var oLi=document.createElement('li');
            oLi.innerHTML=i;
            oUl.appendChild(oLi);
        }
```
问题：这里相当于操作了10次DOM，有什么方案，减少DOM的操作次数？可写代码简单说明。
考点就是利用innerHTML或者文档碎片的形式。

// innerHTML
```javascript
var oUl=document.getElementById("ul-test");
//定义临时变量
var _html='';
for(var i=0;i<10;i++){
    //保存临时变量
    _html+='<li>'+i+'</li>'
}
//添加元素
oUl.innerHTML=_html;
```
// 文档碎片-createDocumentFragment
```javascript
var oUl=document.getElementById("ul-test"),_frag = document.createDocumentFragment();
for(var i=0;i<10;i++){
    var oLi=document.createElement('li');
    oLi.innerHTML=i;
    //把元素添加进文档碎片
    _frag.appendChild(oLi);
}
//把文档碎片添加进元素
oUl.appendChild(_frag);
```

- 事件委托
一个简单的需求，比如想给ul下面的li加上点击事件，点击哪个li，就显示那个li的innerHTML
```javascript
var oUl=document.getElementById("ul-test");
var oLi=oUl.getElementsByTagName("li");
for(var i=0,len=oLi.length;i<len;i++){
    oLi[i].addEventListener("click",function(){
        alert(this.innerHTML)
    })
}
```
问题在于：
1.for循环，循环的是li，10个li就循环10次，绑定10次事件，100个就循环了100次，绑定100次事件！
2.如果li不是本来就在页面上的，是未来元素，是页面加载了，再通过js动态加载进来了，上面的写法是无效的，点击li是没有反应的！
解决办法：
事件委托，就是把事件绑在ul上面，之后的li就可以随便添加
```javascript
var oUl=document.getElementById("ul-test");
oUl.addEventListener("click",function(ev){
    var ev=ev||window.event;
    var target=ev.target||ev.srcElement;
    //如果点击的最底层是li元素
    if(target.tagName.toLowerCase()==='li'){
        alert(target.innerHTML)
    }
})
```

2. Javascript中事件处理如何运行
如下图所示，我们有三个 div 元素。每个div都有一个与之关联的点击处理程序。处理程序执行以下任务：

Outer div click处理程序将 hello outer打印到控制台。

Inner div click处理程序将 hello inner 打印到控制台。

Innermost div click 处理程序将 hello innermost 打印到控制台。

编写一段代码来分配这些任务，以便在单击innermost div 时始终打印以下序列？

hello inner → hello innermost → hello outer

提示：事件冒泡和事件捕获

CSS 实现圆环进度条效果
有一组图片，实现后一张图片必须等到上一张图片加载完毕，才能开始加载
CSS 实现一个宽度为浏览器1/2，宽高比为 2:1 的盒子

组件库的样式自定义是如何实现的

轮播图的实现，以及轮播图组件开发，轮播10000张图片过程