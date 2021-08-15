## BOM
- 浏览器的全局变量有哪些？BOM: navigator对象，location和history
- iframe有哪些缺点
1）iframe会阻塞主页面的Onload；
2）搜索引擎的检索程序无法解读这种页面，不利于SEO;
3）iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
4）使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，这样可以绕开以上两个问题。
