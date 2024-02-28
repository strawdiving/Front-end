# XMLHttpRequest的数据类型
DOMString 和 Document 数据类型是XMLHttpRequest时就有的数据类型。
## DOMString
规范中，DOMString指的是UTF-16字符串，JS就是使用了这种编码的字符串。实际在JS中，DOMString就是String，因此，在Ajax中，DOMString就等同于JS中的普通字符串。
XMLHttpRequest中数据返回属性之 responseText，表明返回的数据是常规字符串。

## Document
实际上就是XMLHttpRequest中数据返回属性之 responseXML,也就是可以被解析为XML的数据。

# XMLHttpRequest2.0新增的数据类型
## FormData对象
利用FormData对象，可以通过JS用一些键值对来模拟一系列表单控件，还可以使用XMLHttpRequest的send()方法来异步提交这个“表单”。比起普通的ajax，使用FormData最大的优点，是可以上传一个二进制文件。
```javascript
new FormData([option] HTMLFormElement) 

document.querySelector("#formData").addEventListener("submit", function(event) {
    var myFormData = new FormData(this);
    var xhr = new XMLHttpRequest();
    xhr.open(this.method, this.action);
    xhr.onload = function(e) {
        if (xhr.status == 200 && xhr.responseText) {
            // 显示：'欢迎你，' + xhr.responseText;
            this.reset();
        }
    }.bind(this);
    // 发送FormData对象数据
    xhr.send(myFormData);
    // 阻止默认的表单提交
    event.preventDefault();
}, false);
```
- HTMLFormElement 表示 form 表单元素，表示我们要序列化，要提交的那个表单元素
- 返回：这个表单元素中所有键值对数据

1. FormData 提交格式的数据分为三部分：
- 第一部分，表示 “boundary”,可能类似二进制大文件分隔传输的时候用的分界线。webkit核心中，使用使用“——WebKitFormBoundary”加16位随机Base64位编码的字符串作为分隔边界。
作用比较单纯，就是把表单的字段作为独立数据流传输。
- 第二部分，表示内容配置"Content-Disposition"，这里都是统一的 "form-data"，紧接着是key值
- 第三部分，表示传输的value

2. FormData对象有个 append 方法
可以人为给当前FormData对象添加键值对。
```javascript
append(DOMString key, Blob值，[option] DOMString 文件名)
append(DOMString key, DOMString value)
```

3. FormData无法字符串化，因此，无法用作表单序列化。

## Blob(Binary large object)对象
Blob对象，表示二进制大对象。
Blob对象可以实现几乎任意文件的二进制传输。实际应用中，Blob更多是图片、文件二进制形式的上传和下载。
一个Blob对象就是一个包含有只读原始数据的类文件对象，Blob对象中的数据并不一定得是JS中的原生形式。File接口基于Blob，继承了Blob的功能，并且扩展支持了本地文件。

```javascript
const xhr = new XMLHttpRequest();
xhr.open('get', 'mm1.jpg', true);
xhr.responseType = 'blob';
xhr.onload = function() {
    if (this.status === 200) {
        const blob = this.response;
        const img = document.createElement('img');
        img.onload = function(e) {
            window.URL.revokeObjectURL(img.src);
        };
        img.src = window.URL.createObjectURL(blob);
        eleAppend.appendChild(img);
    }
}
xhr.send();
// img的src，是blob形式的：blob:http://xxxxxx
```
并不是所有图片都能以Blob形式请求，Ajax请求有跨域限制。

1. Blob的属性
- size,Blob对象中所包含数据的大小，单位为字节
- type,Blob对象所包含数据的MIME类型，如‘image/jpeg’。类型未知，则该值为空字符串

2. 创建Blob对象的方法：
- 调用Blob构造函数
- 使用已有Blob对象上的slice()方法切出另一个Blob对象
- 调用canvas对象上的toBlob方法

```javascript
Blob([option] Array parts, [option] BlobPropertyBag properties)

e.g. const myBlob = new Blob(arrayBuffer)
```
- parts: 一个数组，包含了将要添加到Blob对象中的数据。数组元素可以是任意多个的ArrayBuffer, ArrayBufferView(typed array), Blob, 或者DOMString对象。
- properties：一个对象，设置Blob对象的一些属性，如type，表示Blob的类型
- slice方法，类似字符串中的slice
    - start，开始索引
    - end，结束索引
    - contentType，新的Blob对象的MIME类型，这个值将成为新的Blob对象的type属性
    如果start参数的值比源Blob对象的size属性值还大，则返回的Blob对象的size值为0，也就是不包含任何数据
    
## File对象
文件，通常是使用file控件（<input type="file">）选择的fileList对象，或者是使用拖拽操作产生的DataTransfer对象。
File对象也是二进制对象，因此，从属于Blob对象，Blob对象的一些属性与方法，File对象同样适合，且推荐使用Blob对象的属性与方法。

File对象自身也有一些属性和方法，但是，有些已经过时——不推荐使用。
- File.lastModifiedDate, 最后修改时间
- File.name，只读，文件对象的名称
- File.fileName, 不推荐，建议使用File.name
- File.fileSize，不推荐，建议使用 Blob.size
方法：
- getAsBinary,getAsDataURL，getAsText(string encoding) 返回文件数据/data:URL编码字符串数据/文件数据解释后的文本
不推荐，建议使用FileReader对象的readAsBinaryString，readAsDataURL，readAsText方法代替

## ArrayBuffer对象
表示二进制数据的原始缓冲区，该缓冲区用于存储各种类型化数组的数据。
ArrayBuffer是二进制数据通用的固定长度容器。

装着二进制数据的对象。缓冲出来的固定内存空间的二进制对象？

ArrayBuffer的意义，就是作为数据源提前写入内存中，提前占据某个区域，且长度也固定。当我们处理这个ArrayBuffer中的二进制数据，这个数据都不会变化。

ArrayBuffer本身是不能读写的，需要借助类型化数组或DataView对象来解释原始数组。

### 类型化数组(Typed Arrays)
专为访问原始的二进制数据而生。
Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array，无符号/有符号,整数/浮点数
```javascript
const b = new ArrayBuffer(8); // 创建一个8字节的ArrayBuffer
const v1 = new Int32Array(b); // 创建一个指向b的视图v1,采用Int32类型，开始于默认的字节索引0，直到缓冲区的末尾
const v2 = new Uint8Array(b,2); // 创建一个指向b的视图v2,采用Uint8类型，开始于字节索引2，直到缓冲区的末尾
```
怎么存储，不太理解？

由于类型化数组直接访问固定内存，因此速度很快，比传统数组要快，因为普通JS数组使用的是Hash查找方式。同时，类型化数组天生处理二进制数据，这对XHR2,canvas,webGL等技术有着先天优势。

### DataView对象
可以在ArrayBuffer的任何位置读取和写入不同类型的二进制数据。
```javascript
const dataView = new DataView(buffer, [option]byteoffset, [option]byteLength)
```
- buffer表示ArrayBuffer
- byteOffset指缓冲开始处的偏移量（以字节为单位）
- byteLength指缓冲区部分的长度（以字节为单位）

使用XHR发送ArrayBuffer数据
```javascript
function sendArrayBuffer() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  var uInt8Array = new Uint8Array([1, 2, 3]); // 使用类型化数组

  xhr.send(uInt8Array.buffer); // 使用了类型化数组，发送的是类型化数组的buffer属性，也就是ArrayBuffer对象
}
```