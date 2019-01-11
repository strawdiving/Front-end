## SPA整体概念

SPA是一种Web开发方法。目标：让开发出的Web应用具有原生桌面应用那样的界面效果。将桌面应用的强大能力带到跨平台、瘦客户端的Web浏览环境中。

SPA，单页面Web应用程序，相对于Adobe Flash，Java Applet，Microsoft Silverlight等，不需要额外的浏览器插件，也不需要额外学习一门新的语言，仅仅借助JS, HTML, CSS即可实现。

AJAX的不唐突式数据请求，结合Javascript的动态更新DOM以及CSS实时改变页面样式的能力，使得AJAX成为现代Web开发中的前沿技术。

### SPA简述

在SPA应用里，整个应用作为单个Web页面运行。在这种方式下，应用的表现层从服务器端脱离出来，并在浏览器端管理。

传统的Web应用程序：

每个新视图（HTML页面）请求都会导致对服务器端的双向访问。当客户端需要新数据时，会向服务器端发送请求。在服务器端，请求由表现层的某个控制器对象拦截，该控制器通过服务层与模型层交互，服务层决定完成模型层任务所需的组件。通过数据访问对象（DAO）或服务代理获取数据之后，所有必要的数据更新都将由业务层的业务逻辑产生。

控制传回到表现层，在这里选择合适的视图。展示逻辑规定新获取数据在选中视图中如何展示。通常，（服务器端的HTML源文件）结果视图是一个包含占位符的源文件，数据（及其他可能的渲染指令）将插入到占位符中。

每当控制器将请求路由至视图时，该文件表现得就像某种类型的模板，以让视图设置好占位符的数据。

数据和视图整合好以后，视图返回给浏览器，浏览器接收新的HTML页面，并通过**界面刷新**，将包含请求数据的新视图展示给用户。即**每次导航请求都会得到一个新的静态页面**。

每个新视图（HTML页面）都在服务器端构建。

| SPA特点            | 详细描述                                                     |
| ------------------ | ------------------------------------------------------------ |
| 无需刷新浏览器     | 视图并非完整的HTML页面，它们仅仅是构成屏幕可视区域的DOM的一部分。初始页面加载以后，所有创建和显示视图所需的内容将下载并准备就绪。如果后续需要新的视图，视图将在浏览器本地生成，并通过Javascrip动态关联到DOM |
| 表现逻辑位于客户端 | 表现层解耦。表现逻辑主要集中在客户端，整合HTML与数据的任务移到了客户端。客户端模板是客户端（过插入数据或其他渲染指令）产生新视图的基本手段，但它不是完整页面的HTML模板，只针对视图呈现页面的一部分。 |
| 服务端事务处理     | 渲染在客户端完成，而在业务处理时发送和接收操作只涉及数据。**通过XHR API实现异步通信，常用的数据交换格式是JSON** |

**Javascript单页应用的优势**：

- Web浏览器是世界上最广泛使用的应用；

- 浏览器中的Javascript是世界上分布最广的执行环境之一；

- 部署Javascript应用很简单，只需要托管到HTTP服务器上后就能被Web用户使用；可以像网站一样即时地更新和发布，用户只需要重新加载浏览器即可

- Javascript对 **跨平台开发** 很有用，可以在各个平台上创建单页应用，也可以随时在所有的设备上使用

- Javascript的运行速度变得惊人的快并且有时能和编译型语言匹敌

- Javascript逐渐引入了高级功能，如JSON原生对象，更加一致的AJAX功能，以及使用成熟的库如Socket.IO推送消息

- HTML5、SVG、CSS3的标准和支持，Javascript可以利用浏览器技术完美地渲染像素级别的图形，生成速度和质量都很高

- 整个Web项目从头到尾都可以使用Javascript，Node.js服务器，MongoDB保存数据，JSON通信

- 台式机、笔记本、移动设备越来越强大，意味着过去在服务器上完成的处理工作，现在可以分给客户端的浏览器

#### 以Shell页面开始

**SPA应用中，应用加载之后就不会再有整页刷新。相反，展示逻辑预先加载，并有赖于内容Region中的视图切换来展示内容。**

SPA的单页面指的是初始HTML页面，或被称为Shell（外壳页面）。Shell模块是单页应用的形状和结构，它加载且仅加载一次，其充当应用程序其余部分的起始点。SPA应用中，这是唯一全页面加载的时机。应用后续部分的加载将动态并独立于Shell页面进行，无须全页面加载，不让用户感受到页面的刷新。

典型地，Shell页面在结构上保持最小化，并通常包含一个空< div>标签作为容器，容纳应用程序其它内容。

如果应用程序的可视化区域划分为几部分，则初始< div>容器标签可以包含子容器，通常被称为Region（区域），从视觉上将屏幕划分为几个逻辑区块。Region的< div>容器就是通知MV*框架插入动态内容的地方。React则是使用DOM修补（patching）的方式，而非替换特定Region。

Shell负责：

- 渲染和管理功能容器

Shell来渲染容器，而不是使用静态的HTML和CSS

- 管理应用状态
- 协调功能模块

#### 视图

SPA的页面不是传统概念上的页面（一个完整的HTML页面），当用户进行导航操作时，屏幕所呈现的貌似页面的部分，实际上是应用程序内容的独立部分（HTML代码片段），称为**视图**。

SPA中，一个完整的HTML文件包含占位符（`<div id="container"/>`），占位符对应存储在视图文件中的HTML代码片段。

1. 视图的产生

通常，作为用户导航的结果，SPA各个部分按需展示。其中每个部分的HTML骨骼构造被称为**模板（template)**，模板包含数据占位符。开发者通过Javascript的第三方库或框架（通常称为MV*框架）来绑定数据与模板（可以是一个或多个模板）。所有不在Shell页面中的屏幕内容都放入单独视图中。（**视图是数据与一个或多个模板的绑定结合体**）。

整个视图都与DOM关联。根据实际情况，作为用户导航的结果，视图要么直接位于初始< div>容器中，要么位于某个Region（初始< div>容器的子容器）中。

**通过Javascript程序创建视图**

有多种方式，其中一种方式是使用document.createElement()创建DOM元素，设置它们的内容并将它们追加至页面中。当需要重绘视图时，只需将视图清空并重复前面的过程。

```javascript
$("#views").empty();
var container = $("<div/>").attr({id:"user"});
var name = $("<span/>").text(data.name);
$("#views").append(container.append(name));
```

待渲染的视图内容不多的时候推荐用这种方法，可能只需创建几个元素即可。将视图元素放在控制器或者状态里，是一种妥协方法。

更好的方式，是采用**模板** 。

2. 实现无刷新的视图切换

所有的视图切换都不用刷新Shell页面。导航时，对于屏幕的特定部分，SPA视图通过DOM操作进行无缝切换，一个视图的内容仅仅只是被另一个视图的内容所替代，无须重新加载页面。

对用户而言，页面看起来发生了改变，而URL却未有变化。

在客户端创建及管理视图的任务是由MV*框架负责的。

3. 视图的更新

利用AJAX技术，SPA异步获取服务器端数据并动态插入到应用。在请求及获取服务器端数据时也不会重新加载页面，这也是原生应用的体验效果。

获取数据后，数据与HTML模板进行绑定，视图实时更新，而用户察觉不到丝毫闪烁。

| SPA优点                                  | 详细描述                                                     |
| ---------------------------------------- | ------------------------------------------------------------ |
| 桌面应用程序的呈现效果，却运行在浏览器中 | SPA应用能动态重绘屏幕的某个部分，并实时展现变化结果。SPA预先下载Web页面结构，就无需向服务器端发起破坏性的请求，体验与原生桌面应用类似。运行在浏览器环境，浏览器环境“瘦”，无处不在，标准化环境。 |
| 更少的用户等待时间                       | 更少的页面加载等待时间。SPA预先加载Shell页面及少量的支持文件，在用户导航时进行动态构建，应用启动速度很快。屏幕渲染更流畅、平滑，事务处理更轻量、快速，用户等待时间大大降低 |
| 表现层解耦                               | UI的呈现及行为处理代码（视图的创建与管理）在客户端而非服务器端。服务器端和客户端尽可能解耦。两端分别独立管理和更新 |
| 更快更轻量级的（服务端）事务处理         | 应用初始分发以后，客户端和服务器端的交互只有数据的发送和接收。异步、纯数据的事务处理使得SPA架构运行速度非常快。尽可能把（临时的）工作数据和处理过程转移到浏览器端，SPA在本地拥有大多数需要决策判断的数据和业务逻辑，由此把响应时间缩减至最小；只有数据验证、授权和持久存储必须要放在服务器端。 |
| 更好的代码维护性                         |                                                              |

## MV*框架

在浏览器端，实现关注分离：

HTML——应用程序的脚手架，主要关注提供内容占位符的元素，规划出UI结构，并提供用户可与之交互的控件

CSS——样式表，描述UI的设计，负责外观与格式

Javascript——负责应用表现层逻辑。该层通常实现Web应用的动态特性，提供其余两层之上的行为与编程控制。

### MV*概念

表示基于浏览器的一系列框架，用于构建应用程序的关注分离。将各部分按职责进行划分，将代码清晰地分割为若干部分，并保持良好的解耦，这样可以对各个部分进行独立开发、测试和维护。

- Model——模型代表应用数据。其包含了访问及管理数据所需的Property，处理逻辑与验证。常常还包含了业务逻辑。
- View——视图即用户所见及与之交互的界面，是模型的可视化呈现。有赖于框架其他部分（这些部分负责用户交互的更新和响应），其可以是一个简单结构；或者同样有赖于MV*实现，其也可以包含逻辑。
- 模板——模板是视图的可复用构件块，用来处理视图中的动态内容。其包含数据的占位符以及其他用于模板内容渲染的指令。SPA应用通常会用到一个或多个模板来创建视图。
- 绑定——描述模型数据与模板元素的关联处理。模型数据与可复用的模板相结合（绑定），以创建构成SPA UI的视图。
- *——第三部分，帮助管理模型与视图间的关系，以及模型、视图与用户间的关系。

#### MVC(模型-视图-控制器，Model-View-Controller)

 **控制器** ——是应用程序的入口点，接受来自UI控件的信号。还包含了处理用户输入的逻辑，以及基于接收到的输入，发送命令给模型以更新模型状态的处理逻辑。

它将应用划分为3个部分：数据（模型），展示层（视图），用户交互层（控制器），一个事件的发生是这样的过程：

1. 用户和应用产生交互

2. 控制器的事件处理器被触发
3. 控制器从模型中请求数据，并将其交给视图
4. 视图将数据呈现给用户

与控制器的交互引发一个事件链，最终产生视图更新。

![1546590545005](C:\Users\wurenji.ZKXS\AppData\Roaming\Typora\typora-user-images\1546590545005.png)

即：**控制器处理用户输入，并发送命令更新模型状态；视图观察模型，并在模型状态发生改变时获取新数据进行视图更新；模型通知视图状态发生改变。**

**模型** 用来存放应用的所有数据对象，只需包含数据及直接和这些数据相关的逻辑。例如，可能有一个User模型，用以存放用户列表、他们的属性及所有与模型有关的逻辑。

**视图层** 是呈现给用户的，用户与之产生交互。Javascript应用中，视图大都是由HTML、CSS、和Javascript模板组成的。除了模板中简单的条件语句之外，视图不应当包含任何其他逻辑。

**控制器** 是模型和视图之间的纽带。从视图获得事件和输入，对它们进行处理（可能包含模型），并相应地更新视图。当页面加载时，控制器会给视图添加事件监听，如监听表单提交或按钮点击。然后，当用户和你的应用发生交互时，控制器中的事件触发器就开始工作了。

#### MVP(模型-视图-表示器，Model-View-Presenter)

在MVP模式中，类似控制器的对象与视图一起表示用户界面或呈现（Presentation），模型继续表示数据管理，每个视图都由一个被称为表示器的组件来支持。

**表示器**——包含视图的展示逻辑。视图通过将职责委托给表示器，其仅仅用于响应用户交互。表示器直接访问模型以获取任何更新，并将数据更新回传给视图。**表示器在模型和视图之间扮演了中间人的角色。**

视图的详细信息抽象为接口（或基类）。 表示器与视图的抽象层交互。

![img](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546600458314&di=ba9c428e435a227d9aba47dba9fade33&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D3726858962%2C768254488%26fm%3D214%26gp%3D0.jpg)



即：**视图是交互的主要入口点，其将动作代理给表示器；表示器如同中间人，彻底解耦视图和模型；视图更新通过视图接口来完成**

#### MVVM(模型-视图-视图模型，Model-View-ViewModel)

视图是入口点，也有一个对象位于模型和视图之间，即视图模型。

**视图模型**——是视图的模型或展示代码，其还是模型和视图之间的中间人。所有定义及管理视图的代码都包含在视图模型中。其包含了数据Property及展示逻辑。在模型中，每个需要在视图里得以反映的数据点，都映射到视图模型的对应Property上。视图模型能够掌握视图与模型的变化，并**保持两者同步** 。

视图模型提供对视图模型化的Property及逻辑。其还保持模型和视图的同步。

这些模式实现的基本思想是：在开发者的个人逻辑之外，以框架或库来管理Javascript和HTML之间的关系。

MV*库和框架 **让SPA应用绑定服务器端请求数据与视图** ，允许开发者设计UI，以让业务数据（模型）与生成的HTML“页面”（视图，用户与之交互）之间可以相互通信，但代码却分开管理。Controller，ViewModel，Presenter则是一切机制的协调者。

#### 框架

**Backbone.js**

并不完全遵循传统设计模式。代码驱动，模型与视图通过扩展Backbone.js对象，以Javascript编程方式创建。通过扩展核心对象，应用就自动继承了内建的大量功能。但是Backbone.js并未提供SPA应用构建过程所需的所有功能，需要其他库或框架来补充。

**Knockout**

并不完全遵从原始MVVM定义，但比较接近。该框架中，模型代表任何的数据源，而非由框架定义的显式结构对象。视图及模板通过纯HTML代码实现。视图模型映射模型数据到UI元素，并把以Javascript编程方式创建的行为提供给视图，但大部分的其他功能，则通过声明方式（在HTML中添加定制属性）来实现。Knockout主要关注绑定过程的清晰与简单程度。

Knockout和Backbone.js这类精练型框架，非常适合“小而优”的方案，编写SPA应用时还需要寻求其他的补充功能

Knockout属于MVVM阵营，Bachbone.js更接近于MVC和/或MVP，AngularJS有点像MVVM，但保留了一些类MVC特性。

### 详解

#### 模型

每个模型代表现实中的某个对象，包含的不仅是数据，还有行为。

1. **隐式模型** （Knockout，AngularJS）

模型就是数据本身，而非框架规定的显式结构，其数据源可以是任意的，包括Plain Old Javascript Object以及UI表单控件。不像创建Javascript对象或者从服务器端获取JSON格式数据，而是直接从INPUT输入字段中获取数据。

AngularJS和Knockout都提供了一个定制属性，可以将其添加到HTML，以将条目表单作为模型的数据源

AngularJS添加一个ng-model定制属性到每个字段，从而可以从INPUT字段中获取数据

```javascript
<input id="firstname" type="text" ng-model="formEntry.firstname" required placeholder="First Name"/>
```

ng-model属性声明了模型数据来自放置了该属性的HTML表单元素，如果formEntry模型不存在，该属性会建立它，并赋予模型一个名为firstname的Property。之后ng-model会把formEntry.firstname绑定到INPUT字段。一旦建立好内在联系，模型就可以在Javascript代码中使用了。

Knockout也为每个INPUT字段添加定制属性data-bind，data-bind属性将INPUT字段绑定到视图模型对应的Property上。

```javascript
<input id="firstname" type="text" data-bind="hasFocus: isFocused,value:entry.firstname,valueUpdate:'afterkeydown'" placeholder="First Name"/>
```

data-bind后面跟的是：将在代码中定义的、视图模型中对应的Property。

2. **显式模型** （Backbone.js）

框架规定需要显式声明模型，模型作为Javascript对象来创建。

Backbone模型除了数据还可以带逻辑，如验证、缺省数据和定制函数。此外，模型还可以继承大量功能，只需通过扩展框架自身的模型来创建我们的模型，就自动获取了各种基本功能，模型创建能力异常强大和灵活。

分配Property给Backbone.js模型，只需要将Property值对传给对象的构造函数，或者使用模型内建的set方法

```javascript
var EmployeeRecord = Backbone.Model.extend({
    validate: function(attrs){
        ...
    },
    sync: function(method,model,options) {
        ...
    }
});
var employee = new EmployeeRecord({
    firstName: "Emmit"
});
```

#### 绑定（Binding）

指的是将视图的UI元素与代码相关部分（Javascript对象，通常是某个模型的数据）联系起来。则当应用的模型更新时视图也会自动渲染。

绑定，意味着当记录发生改变时你的控制器不必处理视图的更新，因为这些更新都是在后台自动完成的。

绑定内容并非仅限于数据。依赖于所选框架，绑定类型也不尽相同，样式、属性及如click这样的事件等都可以绑定到UI。

**绑定语法**

绑定语法有两个特性：

- 表达式（Expression），用来包装/限制绑定条目的特定字符。
- HTML属性（Attribute，AngularJS称为指令Directive，Knockout中称为绑定Binding）

有了这两个特性，绑定语法就可以自由混入模板的HTML代码。

| 框架/库       | 类型   | 示例                         |
| ------------- | ------ | ---------------------------- |
| Knockout      | 属性   | `data-bind="text:firstName"` |
| AngularJS1    | 属性   | `ng-bind="firstName"`        |
| AngularJS2    | 表达式 | `{{firstName}}`              |
| Underscore.js | 表达式 | `<%= firstName %>`           |

**定向绑定**

将代码相关部分绑定到视图的可视元素。方式可以是双向、单向或单次绑定。绑定的关系类型也是通过MV*框架来创建的。

- 双向绑定——双向的，始终保持数据和视图的同步
- 单向绑定——单路或单向，改变源状态将影响目标状态，反之则不然。只在模型改变时同步更新视图，但不会监控视图端
- 单次绑定——单路，由模型到视图，在渲染期间只发生一次

如果视图需要接受用户输入，且数据和视图始终需要保持同步，则选择双向绑定。如果UI元素是只读的，则选择单向绑定模式。

1. 双向绑定

Knockout，一方面用data-bind属性告知Knockout在UI里的某个元素准备绑定到视图模型中的某个Property上，双向绑定的另一路，通过将该Property的数据包装到Knockout观察对象中，我们通知Knockout希望其能够观察到Property的更新。

```html
<input data-bind="value: firstName"/>
```

```javascript
var myViewModelObject = {
    firstName: ko.observable("Emit")
};
```

AngularJS能自动化诸多双向设置，$scope对象自动监控模型的变化，还可以在代码中通过$scop对象引用Property。

```html
<input ng-model="firstName"/>
```

```javascript
$scope.firstName
```

2. 单向绑定

这种类型的绑定通常跟那些不需要用户输入的HTML元素有关，如DIV或SPAN之类的，一般只关心其文本而非值。在Javascript代码端的数据访问方式跟双向绑定一样，但在模板中需特别为单向文本绑定选择对应属性。

```html
<span data-bind="text: firstName"></span>
```

AngularJS中则是将属性ng-model改为ng-bind：

```html
<span ng-bind="firstName"></span>
```

3. 单次绑定

单次绑定中，当模板和数据一旦结合并以视图方式渲染出来，此次绑定就结束了。如果新的更新需要应用到视图，则整个处理会重新再来，之前的视图将被摧毁，新数据绑定到同一模板以重新生成视图。

Backbone.js渲染模板的典型方式是单次绑定，需要新数据时，视图（与绑定一道）被摧毁并重建。Backone.js并不具备内建的模板/绑定能力，但允许开发者选择外部库，支持的缺省模板库是Underscore.js。

#### 模板（Template）

模板是HTML片段，其作为视图如何渲染的方式。渲染方式可以额外包含多种绑定及其他指令，决定模板及其模型数据如何处理。可重用。

MV*框架中将模板和模型数据结合起来的那部分，通常被称为**模板引擎（Template Engine）**。

**模板渲染**

AngularJS：一旦应用启动，模板渲染就会自动触发。AngularJS搜索DOM中的定制属性，包括绑定模板的定制属性。

Knockout：需要在Javascript代码中为每个视图模型添加一行代码以激活绑定，调用applyBindings函数，其用视图模型提供的模型数据渲染模板。

```javascript
knockout.applyBindings(myViewModel,$("#someElement")[0]); //myViewModel，视图模型本身；第二个参数是DOM中的位置，是希望Knockout为所给视图模型查找绑定的起点
```

Backbone.js：渲染模板更多是手动过程，提供template和render作为所选外部模板引擎的钩子，要将模板渲染到屏幕上，必须通过编译和渲染处理来运行它。

```javascript
template: _.template(templateHTML),
    render: function() {
        var modelAsJSON = this.model.toJSON();//转换模型数据为JSON字符串
        var renderedHTML = this.template(modelAsJSON);//结合数据与HTML
        this.$el.html(renderedHTML);//用待渲染的HTML替代元素内容
        return this;
    }
```

**内嵌模板**

如果模板使用了表达式风格绑定语法，且并非按需下载，则需要将模板放置在< script>标签中

```html
<script type="text/template">
	Hello,<%= firstName %>,how are you?
</script>
```

**局部模板**

如果按需下载模板，则不需要script标签，模板引擎可以直接使用动态获取的模板。这些按需获取的模板有时作为局部代码或片段来引用，运行时从服务器端直接加载。

#### 视图

Knockout和AngularJS，在模板中使用声明式绑定，通常采用在HTML元素上添加特定属性的方式。模板和视图差不多是一类东西。

Backbone.js，代码驱动类型，采取编程方式创建视图。`Backbone.View.extend({...});` 允许我们为视图定义特质，诸如其CSS类名及其所具有的元素类型，还可以自定义视图生命周期中的关键阶段，如视图的渲染和移除阶段。

### 使用MV*框架的好处

| 好处         | 详解                                                         |
| ------------ | ------------------------------------------------------------ |
| 关注分离     | 松耦合。将Javascript对象划分为不同角色，代码每部分可以各司其职。模型专注于数据，视图专注于数据展现，*可以解耦模型和视图，并维持两者间的通信 |
| 简化日常任务 |                                                              |
| 提升生产率   | 可以将时间和精力放在业务逻辑处理上                           |
| 标准化       | 库和框架在使用上有必须遵循的明确约定，强制要求以更正式、标准的方式编写程序 |
| 可扩展性     | 因为关注分离，因此项目具有可扩展性                           |

## 模块化编程

与依赖全局变量和函数不同的是，SPA中的Javascript代码通过**模块（Module）**来组织。模块提供了状态和/或数据封装，还有助于代码解耦及维护。

在Javascript侧，由于要处理无刷新的单页面，因此针对变量和函数的简单全局作用域无法满足现实所需。我们得将代码划分为可行的数个单元，并在被称为**模块（Module）**的函数中安置这些代码，模块具有属于自己的作用域。这种方式可以绕开不得不在全局命名空间中创建所有变量和函数的局限。

模块是分组不同功能部分的一种方式，其隐藏一些内容的同时公开其他内容。模块能限制代码的作用域。每个模块中定义的变量和函数都有其所属的局部作用域。

**概念**

在特指Javascript代码模块时，模块就代表一个函数——一个通过模块模式创建的特定函数。

### 模块概念

#### 模块模式概念

- 命名空间——为一组相关成员提供具体作用域的方式。
- 匿名函数表达式——模块体包含在一个匿名函数表达式中。
- 对象字面量
- 闭包——即使模块模式的外层函数立即执行完毕，只要模块仍在使用，外层函数返回语句所引用作用域链之上的任何对象或值，都无法被垃圾回收。

#### 模块结构

模块使用一个函数作为封装其逻辑的容器，模块中局部声明变量及函数可以避免外部模块直接访问它们。模块内部功能的访问可以通过返回语句暴露的内容来控制。

```javascript
var numModule = (function() {
   var num1 = 2;
    function addNumsInternally(num2) { //私有函数，负责数值相加操作
        return num1+num2;
    }
    return {
        addTwoNumbers: function(num2) { //通过调用内部函数，弹出计算结果
            alert(addNumsInternally(num2));
        }
    };
})();
numModule.addTwoNumbers(2)；//调用模块的公有函数
```

模块结构遵循以下原则：

- 保持私有代码部分只能在模块中使用
- 创建公有API，以控制模块功能的访问

也可以分配单个命名空间给模块及其关联子模块，以减轻全局命名空间的污染。

#### 揭示模式

模块模式，在模块内部与公开功能之间划定了清晰的界限。一种改良版模块模式——揭示模式（revealing module pattern），即 **将任何API所需代码移到内部，将公有函数作为纯粹指向内部代码的指针，并只暴露该公有函数** 。API中，冒号左边是公有函数，右边是对模块内部私有对象的相关引用。

```javascript
var numModule = (function() {
   var num1 = 2;
    function addTwoNumbers(num2) { 
        alert(num1+num2);
    }
    return {
        addTwoNumbers: addTwoNumbers //公有函数addTwoNumbers是一个指向私有函数的指针
    };
})();
numModule.addTwoNumbers(2)；//使用模块的方式不变
```

#### 模块化编程的意义

- 避免命名冲突

当所有Javascript变量及函数都放到全局命名空间中时，容易有命名冲突问题，不会产生错误，但最后声明的变量或函数将覆盖前面的声明，这将导致不可预期的结果，并且很难被发现。

而模块模式可以让你按自己意愿命名变量或函数，而不用担心不同模块代码之间会产生命名冲突问题。

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="css/default.css">
    </head>
    <body>
        <div class="siteMain" id="container">
        </div>
    </body>
    <script src="js/thirdParty/jquery.min.js"></script>
    <script src="js/STGourmet.js"></script>
    <script src="js/customer.js"></script>
    <script src="js/welcomeMessage.js"></script>
    <script src="js/shoppingCart.js"></script> // 文件是同步加载的
    <script>
        STGourmet.init(); //通过调用STGourmet.init()启动应用程序
    </script>
</html>
```

**当模块通过< script>标签加载时，文件是同步加载的，因此其加载顺序非常重要！模块应该按照现实所需顺序加载。**

```javascript
//STGourmet.js
var STGourmet = (function($) { //STGourmet成为应用程序的命名空间
    function init() {
        $(document).ready(function() {
            STGourmet.shoppingCart.displayStatus(); //STGourmet的两个子模块：shoppingCart和welcomeMessage
            STGourmet.welcomeMessage.showGreeting();
        });
    }
    return {
        init: init //任何return中的内容都是公有的
    };
})(jQuery); //jQuery在尾部导入模块，并在顶部设置其别名为“$”
```

**子模块**

使用模块模式创建应用程序子模块的方式：**通过圆点记法将一个新Property添加给了之前定义的STGourmet函数对象，就创建了子模块**。

这种方式允许我们将代码分割进模块，而代码仍属于相同命名空间的一部分。

```javascript
// custom.js
STGourmet.customer = (function() { //将.customer添加给STGourmet以创建新的子模块，通过圆点记法而非var来声明一个子模块，即添加一个customer Property，该Property本身包含一个模块
    var customerLoggedIn = true; //不在返回语句中的代码都是私有的
    var customerName = "Emmit";
    function isLoggedIn() {
        retuen customerLoggedIn;
    },
    function getName() {
        return customerName;
    }      
    return {
        isLoggedIn: isLoggedIn,  //定义在返回语句中的都是公有的
        getName: getName
    }
})();
```

```javascript
// welcomeMessage.js
STGourmet.welcomeMessage = (function() {
    function getWelcomeMessage() {  },
    function showGreeting() {$("#content").html(getWelcomeMessage()); }
    return {
        showGreeting: showGreeting
    }
})();
```

加载库时，应该先加载主模块，再加载子模块，确保主模块的命名空间已经声明。

- 保护代码完整性

模块模式提供了一种管理内部代码访问性的方式。限制访问某部分模块代码的能力，将阻止其他代码直接改变其内部状态，维护模块内部正常运作，并避免模块数据遭到肆意修改。

- 隐藏复杂性

相较于通过大量全局函数实现具体功能的复杂逻辑，模块模式将复杂逻辑放至内部，并只通过公有接口暴露开发者所需功能，隐藏模块的复杂性，减少了混乱，并使得函数调用更加清晰起来，以正确使用应用功能。

- 降低代码改变带来的冲突

其他程序员只需针对公有接口编程，只要公有API行为保持不变，内部代码可以随意调整，减少系统其他部分的变化，降低代码维护成本。

- 代码组织

将代码从全局命名空间搬出来，并以一种更具意义的方法来组织这些代码。

#### 模块模式的不足

- 测试——无法对模块中的私有函数进行单元测试

- 扩展对象——模块外部无法访问模块内对象及非公有API部分，不能随意扩展对象

### 模块模式剖析

- 可访问性控制

Javascript只有两种作用域类型：局部和全局。我们无法明确标识变量或函数是公有还是私有的，只能依靠它们的作用域来实现访问限制。

Javascript构建私有性的唯一方式，就是在函数中声明局部变量和函数。模块模式中的外层函数为其内部的变量和函数创建了一个局部作用域，这使得模块能够构建内部代码的私有性。

- 创建公有API

1. 返回对象字面量

模块模式中将返回一个对象字面量，其中的函数可以访问模块内部的变量和函数。这使得调用代码可以管控模块功能的访问性。

2. 让函数立即返回——立即调用函数表达式（IIFE）

我们需要作为模块命名空间的变量指向返回的对象字面量，而非函数本身。所以要将立即调用函数表达式分配给变量，匿名函数将立即调用，并返回对象字面量给变量。

3. 闭包构造

为了构成模式的整个技术栈能够正常工作，所有返回对象字面量中引用的私有变量或函数都不能回收。否则，就可能在使用API时发生错误。

闭包能够让其引用的任何变量或函数（指IIFE中的变量或函数）存活下来，即使在IIFE执行完成之后，仍维系着内部功能的生存期。在闭包中，由于继续持有模块内部函数的引用，在外层函数执行结束时，内部函数仍可以安全工作，不会成为undefined。

- 允许全局导入

尾部括号提供了一种方式，能通过参数形式将你声明的内容传进匿名函数。将扩展对象带进内部供内部使用的过程被称为**导入**。

使用这个技巧可以将全局变量导入模块。该技巧允许我们在函数作用域范围给全局变量设置别名。如前面的jQuery，别名设置为"$"。

- 创建模块的命名空间

命名空间提供了调用模块公有API的方式，并能够帮助我们创建子模块。将IIFE分配给一个变量，不仅获得一个指向返回对象字面量的指针，还创建了模块名称，同时也定义了模块命名空间，子模块可以依附其上。

### 模块加载及依赖管理

模块文件用到的script标签会产生阻塞，脚本加载时应用程序将暂停。模块文件数越多，等待应用加载的时间就越长；大量的HTTP请求也将加重网络负担。

解决办法：1）将模块合并到尽可能少的文件中去，之后优化最终文件。但本质上仍需要< script>标签同步处理；2）第三方库以异步加载模块。

#### 脚本加载器

能够绕过< script>标签的阻塞状态，将极大缩减应用加载时间。

通过< script>的**defer** 和**async** 属性，HTML为为Javascript代码的加载和执行引入了原生的非阻塞支持。

**defer属性** ——表明脚本在页面完成解析后才执行

**async属性** ——只要脚本可用即异步执行

使用< script>标签时，开发者要确保脚本的正确顺序，以便依赖在需要的时候可用。

#### CommonJS

为了让代码更具可移植性，亟需引入一个标准解决方案，让所有的Javascript都按照这个标准来实现统一的模块管理系统，这样Javascript就可以运行在所有环境中了。

CommonJS包含很标准，包括IO接口，底层的套接字流（Socket stream），以及单元测试。

**模块的声明**

模块被分隔为不同的文件，通过exports对象添加内容来对外暴露模块的变量和方法，exports变量是在解释器中定义好的。

```javascript
// maths.js
exports.per = function(value,total) {
    return (value/total)*100;
}
// application.js
var Maths = require("./maths");
Maths.per(50,100);
```

要想使用在模块中定义的函数，只需require()这个文件即可，同时将运行结果保存在本地变量中。

这种代码可以在所有遵循CommonJS规范的Javascript解释器中运行，比如Node.js。

**在客户端JS中实现CommonJS**

”模块转换格式“，将CommonJS的模块包装在一个回调函数中，以便更好地处理客户端的异步加载。

```javascript
// maths.js
require.define("maths",function(require,exports) {
               exports.per = function(value,total) {
    return (value/total)*100;
  }；
})；
// application.js
require.define("application",function(require,exports) {
  var per = require("./maths").per;
  per(50,100);
}),["./maths"]); //给出它的依赖（maths.js)
```

这样可以通过在浏览器中引入模块加载器来管理并执行我们的模块了。

**AMD脚本加载器**

通过处理低级别样板代码来管理异步下载过程。其还允许指定模块所需的依赖给函数。如果依赖模块不存在，则框架将获取它们并确保在执行之前下载就绪。如RequireJS，LABjs等。

异步加载脚本提升了加载速度，但无法预知资源的可用性，无法精确知道哪个脚本将首先加载。如果在所有依赖准备就绪之前，某个文件就已下载并开始执行，会因为依赖尚未加载而失败。

脚本加载器会推迟脚本执行，直到模块所需的文件和所有依赖加载完毕。大多数脚本加载器也能缓存模块，因此无论请求多少次，模块都只需加载一次。

#### 异步模块定义——AMD

AMD规范定义了一个标准模块格式，同时定义了异步加载模块及其依赖的方式。AMD规范定义了两种结构：define和require。

**1. define**

```javascript
define('someID', //可选的模块名称/ID，如果省略，脚本加载器会内部生成一个ID，通过生成的ID对模块进行管理
       ['dependency1','dependency2'], //可选的字符串数组，代表模块依赖
       function(depArg1,depArg2) { //外层容器函数的参数，是对依赖的引用
    //私有变量和函数                 //模块内部代码
       return {                      //返回带有公有函数的对象字面量，作为模块公有API
    	//公有函数
       };
});
```

命名空间并未像模块模式中那样定义。使用AMD和脚本加载器的好处是，命名空间不需要了，模块由库来管理，同时也不必担心依赖的顺序，它们将在模块函数执行时加载并就绪。

**2. require**

require语法用来异步加载/获取指定模块。当请求模块获取到并准备就绪时执行回调函数。

```javascript
require(['module1','module2'],
        function(modArg1,modArg2) {
         // do something 
});
```

require结构是指令，不是模块声明。模块定义通常是一个个物理文件，require应该在需要之时使用。可以单独使用，也可以在模块中使用。

#### 通过RequireJS实践AMD

- data-main——该属性是加载了RequireJS的应用的入口。通常，主Javascript文件包含RequireJS配置及require指令以执行初始AMD模块

- requirejs.config()——该函数创建RequireJS配置项。其唯一参数是一个对象字面量，包含了所有配置项及其值

- baseUrl——相对于Web应用程序根目录的路径，配置对象中的任何其他路径都相对于该路径

- path——把模块的位置告知RequireJS，path映射（你所构建的）模块名称到Web服务器的路径上，相对于baseUrl

  通过配置baseUrl和path Property，以便RequireJS能够找到模块；通过包含来自paths选项中的模块名称，我们通知RequireJS要在回调中使用displayUtil模块。依赖列表中的每个模块名称字符串都有一个相应的函数参数。在回调函数中，通过该参数来引用模块。

  

  为了加载Javascript文件，只需将它们的路径传入require()函数即可。并指定一个回调函数，当依赖都加载完成后执行这个回调函数。

  ```javascript
  // main.js
  requirejs.config({
      baseUrl: "app/example", //baseUrl相对于Web应用程序根目录
      paths: {
          counter: "modules/counter",
          util: "modules/displayUtil"
      }
  });
  require(["util"], //使用模块名称将资源声明为依赖
          function(utilModule) { //函数参数接受对应依赖导出的对象，即依赖模块以回调参数的形式传入
              utilMode.displayNewCount();
  })
  ```

  ```javascript
  //displayUtil.js
  define(["counter"],
         function(counterModule) {
      function printCount() {
          counterModule.getCount();
          ...
      },
          function displayNewCount() {
              this.printCount();
          }
          return {
              printCount: printCount,
              displayNewCount: displayNewCount
          };
  });
  ```

默认是没有exports变量的，如果要从模块中暴露一些变量，只需将数据从函数中返回即可。

注：RequireJS的API无法兼容CommonJS的模块。