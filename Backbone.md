# Backbone
## Backbone.View
```javascript
Backbone.View.extend(properties[,classProperties])
```
通过创建自定义视图来开始视图，可以重写render函数，指定声明式事件，或其他View的根元素的属性。
```javascript
var customView = Backbone.View.extend({
    className:"custom",
    events: {
        "click .icon": "open",
        "click .button .edit": "openEditDialog"
    },
    initialize: function(){......},
    render: function(){......}
});
```
- el——View.el

  所有views始终有一个DOM元素（el属性），无论是否已插入到页面中。

  以这种方式，可以随时渲染视图，并一次性插入到DOM中，以获得尽可能少的回流和重新绘制的高性能UI渲染。

  this.el可以从DOM selector字符串或一个元素中解析出来，否则，它将从视图的tagName, className，id和attributes属性中创建。如果没有设置，this.el是一个空div。

  一个el引用也可以传递给view的构造函数。`new View({el: "#app"});`
- constructor/initialize——`new View([options])`

  ViewOptions有几个特殊选项：
  model，collection，el，id，className，tagName，attributes，events

  如果在options中传递了，则直接附加到view中。

  如果view定义了initialize函数，会在视图view第一次创建时被调用。

  自定义view的constructor函数，传入options（new View(options)）——>调用Backbone.View的constructor——>调用initialize，initialize一般会被自定义view重写。
- attributes——View.attributes

  将在view的el上设置为HTML DOM元素属性的散列，或返回这种散列的函数。
- template——view.template([data])

  虽然view的模板不是由Backbone直接提供的函数，但在views中定义一个template函数是个很好地惯例。
  ```javascript
  var customView = Backbone.View.extend({
      template:......
  });
  ```

- render——view.render()

  重写该函数，用模型数据渲染view的模板，用新的HTML更新this.el。渲染结束时返回this，以启用链式调用。
- events——view.events或view.events()

  events hash（或方法）可用于指定一组DOM事件，这些事件将通过delegateEvents事件代理绑定到view上的方法。Backbone会在实例化时自动附加事件侦听器，就在调用initialize之前。

- delegateEvents——delegateEvents([events])

  使用jQuery的on函数，为视图内的DOM事件提供声明式回调，如果未传递events参数，则使用this.events作为源。
  
  Events格式：`{“event selector": "callback"}`

  callback——可以是view上方法的名称，也可以是直接函数体

  selector——忽略selector，会将事件绑定到view的根元素（this.el）

  默认的，delegateEvents在view的构造函数中为你调用，如果有一个简单的events hash，你的所有DOM事件总是已被连接，不必自己调用。比使用jQuery，手动在渲染期间将事件绑定到子元素上提供了很多优点。

  （在交给jQuery之前）所有连接的callbacks都绑定到view上，当callbacks被调用时，this继续引用view对象。

  当再次运行delegateEvents时，可能使用不同的events hash，所有回调都将被删除并重新委托——对于需要在不同模式下行为不同的views很有用。

  重新绘制页面元素后，原有的事件需要重新触发绑定，可在render之后使用this.delegateEvents()。

## Backbone.Events

  Events是一个可以混入任何对象的模块，使对象具有bind和trigger，自定义命名events的能力。

- on——object.on(event,callback,[context])，Alias: bind

  将callback函数绑定到一个对象，回调将在事件被触发时被调用。如果页面上有大量不同的事件，约定用冒号命名空间：
```javascript
“poll:start"或"change:selection"
```
  事件字符串也可以是多个事件的以空格分隔的列表：
```javascript
book.on("change:title change:author",......)
```
  绑定到特殊的“all”事件时，任何事件发生，都会触发绑定的callback，并将事件的名称作为第一个参数传入
```javascript
proxy.on("all",function(evtName){obj.trigger(evtName);});
```
  还支持事件映射语法：
```javascript
book.on({"change:author": authorPane.update,
        "change:title":titleView.update
        });
```
  要在调用回调时为this提供上下文，传递可选的最后一个参数：
```javascript
model.on("change",this.render,this);
```
- off——object.off([event],[callback],[context]) Alias: unbind

  从对象中删除以前绑定的回调函数。

  如果没有指定context，则将删除具有不同上下文的回调的所有版本。

  如果没有指定callback，则event的所有callbacks都删除。

  如果没有指定event，则所有events的callbacks都删除。
- trigger——object.trigger(event,[*args])

  触发给定event或空格分隔的事件列表，后续的arguments将传递给事件传递函数。
- listenTo——object.listenTo(other,event,callback)

  告诉object监听other对象上的特定event，相比于other.on(event,callback,object)，listenTo允许object跟踪事件，并且可以在稍后一次性删除。callback始终以object作为上下文来调用。
  `view.listenTo(model,"change",view.render);`

- stopListening——object.stopListening([other],[event],[callback])

  告诉object停止监听事件。不带参数，则object移除所有已注册的回调。

### Backbone的built-in events

- add(model,collection,options)，一个model添加到一个collection中
- remove(model,collection,options)，一个model从一个collection中移除
- update(collection,options)，在collection中添加/删除任意数量的models后触发单个事件
- reset(collection,options)，collection的整个内容已被重置时触发
- sort(collection,options)，collection被重新排序时触发
- change(model,options)，model的attributes改变时触发
- change: [attribute ] (model,value,options)，一个特定attribute改变时触发
- destroy(model,collection,options)，当一个model被destroy时触发
- all，此特殊事件由任意触发事件触发，将event name作为第一个参数，之后是所有trigger参数

如果在调用发出事件的函数时，如果想阻止事件被触发，可将{silent: true}作为一个选项，但更好的方式，是在事件回调的选项中的特定flag来查看并选择忽略。

## Backbone.Model

model是核心，包含交互式数据及围绕它的大部分逻辑：validations,convertions,computed properties,access control

- extend——Backbone.Model.extend(properties,[classProperties])

  创建自己的model类，可以扩展Backbone.Model，并提供实例属性，以及可选的calssProperties，直接附加到constructor函数。

  extend正确地设置原型链，使用extend创建的子类可以进一步extend。

  如果想调用父对象的实现，或者重写一些core函数如set，save，则必须明确地调用它，如：
  ```javascript
  var Note = Backbone,Model.extend({
      set: function(attributes,options) {
          Backbone.Model.property.set.apply(this.arguments);
          }
        });
    ```
- constructor/initialize——new Model([attributes,[options]])

  创建model的实例时，可以传入attributes的初始值（用来设置model的attributes），如果定义了initialize函数，当model创建时被调用。

  可以重写constructor函数和initialize函数。

  如果传递{collection: ......}作为options，则model获得一个collection属性，用于指示这个model属于哪个collection，用于计算model的url。

  model.collection属性通常在你首次将model添加到collection时自动创建，但是，将该选项传给构造函数时，并不会自动将model添加到collection中。

- get(attribute)/set(attributes,[options])
  note.get("title");

  将attributes的hash（一个或多个）设置到model上，如果任何属性改变model的状态，model上将触发change事件。
- id——model.id

  id是一个任意字符串（整数id或UUID），如果在attributes hash中设置了id，它将作为直接属性复制到model中。
- cid——model.cid

  cid或client id是在首次创建时自动分配给所有models的唯一标识符。当model未保存到server时，cid很方便，且还没有最终的真实id，但已经需要在UI中可见。
- defaults——model.defults或defaults()

  defaults的hash函数可用来指定model的默认属性。在创建模型的实例时，任何未指定的属性都将设为其默认值。
  ```javascript
  var Meal =Backbone.Model.extend({
      defaults:{
          "desert": "cheesecake",
          "entree": "ravioli"
      }
  });
  ```
- toJSON——model.toJSON([options])

  为JSON字符串化返回model attributes的浅表shallow副本，而不是返回JSON字符串
- clone——model.clone()

  返回具有相同属性的模型的新实例。

## Backbone.Collection

models的有序集合，可以绑定“change”事件，以便collection中的任何model被修改时通知。集合中的model触发的任何事件也将直接在集合上触发，允许监听集合中任何model中特定属性的更改，`document.on("change:selected",...)`

- extend——Backbone.Collection.extend(properties,[classProperties])
- model——collection.model([attrs],[options])

  重写此属性，以指定集合包含的model类。
  可以传递原始属性对象（和数组）以及add，create和reset，并将这些属性转换为适当类型的model，也可以通过用返回一个模型的constructor函数来重写该属性，来包含多态模型。
  ```javascript
  var library = Backbone.Collection.extend({
      model: Book
      });
  
  var library1 = Backbone.Collection.extend({
      model: function(attrs,options) {
          if(condition) {
              return new PublicDoc(attrs,options);
          }
          else {
              return new PrivateDoc(attrs,options);
          }
      }
    });
  ```
- constructor/initialize——new Backbone.Collection([models],[options])

  创建集合时，可以选择传入models的初始数组，comparator可以作为option包含在内。Collection创建时initialize会被调用。

  model和comparator如果提供，会直接附加到collection
- toJSON([options])

  返回一个数组，包含集合中每个model的attributes hash（通过model.toJSON获得）。这可以用来序列化并维持整个集合。并不是返回JSON字符串。

- add(models,[option])

  向集合中添加一个model或model的数组，为每个model添加一个“add”事件，随后添加一个“update”事件

- remove(models,[option])

  从集合中移除一个model或model的数组，并返回它们。“models”参数的每个模型可以是一个model实例，一个id字符串或JS对象，每个model触发“remove”事件，以及一个单独的“update”事件。
- reset([models],[options])

  更改多个模型时，批量更新集合。
  可以用新的models列表（或属性hash）替换集合，在完成时触发单个“reset”事件，并且不触发任何model上的任何“add“/”remove”事件，返回新设置的models。
  如果没有参数，reset()即清空集合。
- comparator

  用于按排好序的顺序维护集合。models被添加时，会插入到models的正确index处。
