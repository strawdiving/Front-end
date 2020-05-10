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