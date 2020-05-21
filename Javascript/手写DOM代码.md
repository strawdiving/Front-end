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