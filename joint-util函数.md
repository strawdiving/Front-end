# joint-util函数

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `hashCode(str)`                                              | 从字符串返回一个简单的哈希码                                 |
| `getByPath(obj, path, delim)`                                | 根据path在obj对象中获取属性对象,delim为分隔符                |
| `setByPath(obj, path, value, delim)`                         | 根据path在obj对象中获取属性对象并进行赋value值，或添加属性值 |
| `unsetByPath (obj, path, delim)`                             | 根据path在obj对象中获取属性对象，删除对象的属性              |
| `flattenObject (obj, delim, stop)`                           | 结果只包含对象的自身属性，根据是否是object类型和stop值判断是否递归地查询属性 |
| `uuid`                                                       | 根据RFC4122版本4 ，返回规定格式的16进制的id xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx |
| `guid (obj)`                                                 | 为obj生成全局唯一id并将其存储为obj的属性     j_xxx           |
| `toKebabCase (string)`                                       | 短横线命名，全小写格式                                       |
| `normalizeEvent(evt)`                                        | 返回对象，包括evt.originalEvent.changedTouches[0]，   再加上拷贝输入事件中未在触摸事件上定义的所有属性（包括函数） |
| `nextFrame, cancelFrame`                                     |                                                              |
| `shapePerimeterConnectionPoint (linkView, view, magnet, reference)` | 用于link的形状外围的连接点                                   |
| `parseCssNumeric(strValue, restrictUnits)`                   | 解析数值对象，返回对象{value:xxx,unit:xxx}                   |
| `breakText (text, size, styles, opt)`                        | 将长文本拆成多行返回                                         |
| `imageToDataUri(url, callback)`                              | 将url处的图像转换成data url格式                              |
| `getElementBBox (el)`                                        | 返回el的size and position data对象                           |
| `sortElements(elements, comparator)`                         | 对元素按comparator排序   Highly inspired   by the jquery.sortElements plugin by Padolsey.   See   http://james.padolsey.com/javascript/sorting-elements-with-jquery/ |
| `setAttributesBySelector (element, attrs)`                   | 给给定的元素及其descendants based on the selector设置属性.   // `attrs`   object: { [SELECTOR1]: { attrs1 }, [SELECTOR2]: { attrs2}, ... } e.g. {   'input': { color : 'red' }} |
| `normalizeSides (box)`                                       | 返回一个新的object 包含4个边的信息(top, bottom, left and right).   每个边的值都取自给定的参数(number或object). 边的默认值为0 |
| `timing对象`                                                 | 包含一系列以t为参数的计算时间的函数，包括linear, quad, cubic, exponential等 |
| `interpolate对象`                                            | 包含一系列以a, b为参数的计算a, b之间插值的函数               |
| `filter对象`                                                 | SVG filters                                                  |
| `format对象`                                                 | // 通过Python Format Specification Mini-language格式化数字、字符串，转换显示方式（2/8/10/16等），round, precision, prefix（数量级符号，10的N次方） |
| `template (html)`                                            | 预编译HTML以用作模板，HTML模板渲染                           |
| `toggleFullScreen (el)`                                      | el Element,想要全屏显示的内容, 默认'window.top.document.body' |
| `addClassNamePrefix (className)`                             | add joint- prefix   to classNames，返回处理后的类名字符串    |
| `removeClassNamePrefix(className)`                           | remove joint-   prefix from classNames，返回处理后的类名字符串 |
| `wrapWith(object, methods, wrapper) `                        | 后面调用时，object为joint.dia.Graph.prototype, wrapper为'cells',methods为['resetCells','addCells','removeCells']，对每一个method执行cells对应的函数 |
|                                                              |                                                              |

### lodash 3 vs 4 incompatible

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| deepSupplement: _.defaultsDeep(object,[sources])             |                                                              |
| Same as`supplement()` but deep version，递归地拷贝属性       | 返回object对象                                               |
| deepMixin: _.mixin([object=lodash],source,[options={}])      |                                                              |
| 类似`mixin()`但是deep version，即 _.assignIn，拷贝自身和继承的属性<br/>添加source对象自身所有可枚举的函数属性到目标对象，如果object是函数，则函数方法将被添加到原型链上 |                                                              |
| supplement: _.defaults(object,[sources])                     |                                                              |
| 从后面的参数中拷贝所有属性到第一个参数中，一旦某个属性已设置，相同属性的其他值将被忽略.<br/>第一个参数中所有的函数属性将获得额外的属性base指向the extenders同名属性函数的call方法 |                                                              |
| mixin: _.assign(object,[sources])                            |                                                              |
| 从后面的参数中拷贝所有属性到第一个参数中，后面参数的同名属性会覆盖前面参数的属性,继承的属性被忽略 |                                                              |
| `sortedIndex`，`_.sortedIndex(array, value)`， _.sortedIndexBy(array, value,[iteratee=_.identify]) |                                                              |
| 返回value应插入到已排序数组array中的索引_.sortedIndex([30,50],40)-> 1      ，iteratee,每个元素调用迭代器来计算其sort ranking | var objs=[{x:4},{x:5}];
_sortedIndexBy(objs,{‘x’:4},function(o)
{return o.x;}); -> 0 |
| uniq： _.uniqBy(array, [iteratee=_.identify])  _.uniq(array) |                                                              |
| 创建一个数组的duplicate-free版本，只保留一个元素的第一次出现，顺序由他们在数组中的出现顺序决定_.uniq([2,1,2]) -> [2,1] |                                                              |
| `uniqueId`：`_.uniqueId[prefix=’ ’]`                         |                                                              |
| 生成一个唯一ID，如果给定前缀，ID添加到该前缀后面             | 返回: 生成的ID<br/>_.uniqId(‘contact_’)
-> ‘contact_104’      |
| `sortBy`                                                     | `_.sortBy(collection, [iteratee=_.identify])`                |
| 创建一个元素数组，按照每个迭代器运行集合中每个元素的结果，按升序排序。                                                                                                var users = [{‘user’:’fred’,’age’:48},{‘user’:’barney’,’age’:36},{‘user’:’fred’,’age’:40}];
_.sortBy(users,[function(o)
{return o.user;}];
返回[[‘barney’,36],[‘fred’,48],[‘fred’,40]] | 返回: 排序后的数组                                           |
| `isFunction`                                                 | `_.isFunction(value)`                                        |
| 检查value是否被归类为Function对象。返回：true/false          |                                                              |
| `result`                                                     | `_.result(object,path,[defaultValue])`                       |
| 获取object对象在path路径下的值。                                                                   path(Array/String)：要获取的属性的路径；defaultValue:遇到undefined值时返回的值 | 返回：resolved value解析值                                   |
| `union`                                                      | `_.union([arrays])`                                          |
| 从所有给定的arrays数组中，创建一个唯一值的数组。                                         _.union([2],[2,1])
-> [2,1] | 返回：新的组合值的数组                                       |
| `invoke`                                                     | `_.invokeMap(collection,path,[args] || _.invoke`             |
| 在collection的每个元素的path上调用该方法，任何额外的参数args都是提供给每个调用方法的;如果path是个函数，则它将被调用并绑定到集合中的每个元素 ；collection: Array/Object 要迭代的集合，path: Array/Function/String，要调用的方法的path,或每次迭代调用的函数，[args](…*)：要调用的函数的参数 | 返回：每个调用方法的结果数组Array                            |
| _.invokeMap([[5,1,7],[3,2,1]],’sort’)-> [[1,5,7],[1,2,3]]              _.invokeMap([123,456]],String.prototype.split,’,’)
-> [[‘1’,’2’,’3’],[‘4’,’5’,’6’]] |                                                              |
| `difference`                                                 | `_.difference(array,[values])`                               |
| 创建一个数组，其中的值未包含在其他给定的数组values中；结果值的顺序和引用由第一个数组array决定            
array：要检查的数组，[values]:(...Array)：要排除的值
_.difference([2,1],[2,3])
-> [1] | 返回：新的过滤值数组                                         |
| `intersection`                                               | `_.intersection([arrays])`                                   |
| 返回数组的交集（包含在所有给定数组arrays中的值）的数组，结果值的顺序和引用由第一个数组确定 |                                                              |
| `omit`                                                       | `_.omit(object,[paths])`                                     |
| 返回：去掉object对象中omit对象属性之后的对象。                和pick相反， paths：要omit忽略的属性路径 |                                                              |
| `pick`                                                       | `_.pick(object,[paths])`                                     |
| 创建object对象中的picked对象属性组成的对象 ,[paths](...(string | string[]))： 要pick的属性的路径返回：新的对象                |
| `has `                                                       | `_.has(object,path)`                                         |
| 检查path是否是object的直接属性，即继承原型的属性不算         | 返回：true/false                                             |
| `bindAll`                                                    | `_.bindAll(object, methodNames)`                             |
| 将object的方法绑定到object本身，覆盖现有的方法，完成绑定后，可以通过object调用绑定后的方法（改变this对象/上下文调用函数），object：将绑定的方法绑定并分配给该对象，methodNames(...(string string[])):要绑定的对象方法名称 | 返回 object                                                  |
| var view = {  'label': 'docs',  'click': function() {  console.log('clicked ' + this.label);  }};  _.bindAll(view, ['click']);  jQuery(element).on('click', view.click);// => Logs 'clicked docs' when clicked. |                                                              |
| `assign`                                                     | `_.assign(object,[sources])`                                 |
| 分配source object的own可枚举属性到目标object上，源对象从左到右应用，后续的sources会覆盖前面sources的属性assignments，该方法会改变object 忽略原型链上的属性 ，后面的值会覆盖前面的同名属性值 | 返回：object                         function Foo() {this.a=1;}     function Bar() {this.c=3;}   Foo.prototype.b = 2; Foo.pototype.d=4;   _.assign({‘a’:0},new Foo, new Bar); -> {‘a’:1,’c’:3} |
| `defaults`                                                   | `_.defaults(object,[sources])`                               |
| 将source对象的own和继承的可枚举keyed属性分配给目标object对象，仅设置目标属性解析为undefined的那些属性。源对象从左到右应用，一旦某个属性已设置，相同属性的其他值会被忽略`` | 返回：object                                                 |
| `defaultsDeep`                                               | `_.defaultsDeep `                                            |
| 类似default，但是会递归地分配默认属性                        | _.defaults({‘a’:1},{‘b’:2},{’c’:3}) -> {{‘a’:1},{‘b’:2}}   _.defaultsDeep({‘a’: {‘b’:2},{‘a’: {‘b’:1,’c’:3}} -> {{‘a’: {‘b’:2,’c’:3}} |
| `isPlainObject`                                              | `_.isPlainObject(value)`                                     |
| 检查value是否为plain object普通对象，即由Object构造函数构建的对象（即通过‘new Object’或{}创建的对象），或[[prototype]]为null的对象。 | 返回：true/false                                             |
| function Foo (){ this.a = 1;}       _.isPlainObject(new Foo); ->false,每个函数都有一个prototype属性，不为空 _.isPlainObject([1,2,3]); ->false，每个内置对象都有prototype属性;                                  _.isPlainObject({‘x’:0,’y’:0}) ->true        _.isPlainObject(Object.create(null)); ->true |                                                              |
| `isEmpty`                                                    | `_.isEmpty (value)`                                          |
| 检查value是否为空对象，集合，map或set。如果对象没有自己的enumerable string keyed properties即被认为是空的 Array-like值如arguments,数组，buffers,strings或jQuery-like collections的length为0，认为是空 map、set的size为0，认为是空 | _.isEmpty(null) ->true;                             _.isEmpty(true) ->true; ->Bool对象                                         _.isEmpty(1) ->true; ->Number对象                                _.isEmpty([1,2,3]) ->false; ->Array对象 _.isEmpty({‘a’:1}) ->false; ->对象 |
| `isEqual`                                                    | `_.isEqual`                                                  |
| 进行deep比较看是否相等，支持比较arrays,array buffers,Booleans,date对象，maps,numbers,objects,regexps,sets,strings,symbols,typed arrays ， object对象通过比较他们自己的（非继承的）enumerable properties Functions和DOM节点通过严格等于’ === ’来比较 | var object={‘a’:1}; var other={‘a’:1};  _.isEqual(object,other) -> true   object===other -> false |
| `noop`                                                       | `function() {}`                                              |
| `clone`                                                      | `_.clone(value)`                                             |
| 创建value的浅层shallow clone arguments参数对象的自身的enumerable属性被clone为plain objects error对象，functions, DOM nodes等不可复制的values返回空对象 | var objects=[{‘a’:1},{‘b’:2}];var shallow = _.clone(objects); shallow[0] === objects[0] -> true   var shallowDeep = _.cloneDeep(objects); shallow[0] === objects[0] -> false |
| `cloneDeep`                                                  | `_.cloneDeep(value)`                                         |
| 类似clone，但递归地clone value                               | **！！！****Javascript****的深拷贝与浅拷贝**                 |
| `toArray`                                                    | `_.toArray(value)`                                           |
| 将value转换为array``_.toArray({‘a’:1,’b’:2}) -> [1,2]           _.toArray(‘abc’) -> [a,b,c]``   _.toArray(1) -> []                             _.toArray(null) -> [] |                                                              |
| `flattenDeep`                                                | `_.flattenDeep(array)`                                       |
| 递归地展平数组``_.flatten(array),将数组展平1层 ``_.flattenDeep([1,[2,[3,[4]],5]]) -> [1,2,3,4,5];  _.flatten([1,[2,[3,[4]],5]]) -> [1, 2,[3,[4]],5] |                                                              |
| `camelCase`                                                  | `_.camelCase([string=’’])`                                   |
| 将string转为驼峰大小写 _.camelCase(‘FooBar’) -> fooBar       |                                                              |
| `groupBy`                                                    | `_.groupBy(collection, [iteratee=_.identify])`               |
| 创建一个对象，由key组成，key是iteratee遍历collection中每个元素返回的结果。分组值的顺序由他们出现在集合中的顺序确定。每个key对应的值，是负责生成key的元素组成的数组 | 返回：collection聚合的对象                       [iteratee=_.identify]：transform key的迭代器 |
| _.groupBy([6.1,4.2,6.3],Math.floor) -> {‘4’:[4.2],’6’:[6.1,6.3]} | _.groupBy([‘one’,’two’,’three’],’length’) -> {‘3’:[ ‘one’,’two’],’5’:[ ’three’]} |
| `forIn`                                                      | `_.forIn(object, [iteratee=_.identify])`                     |
| 使用iteratee遍历object的自身和继承的可枚举属性，iteratee会传入3个参数（value,key,object）,如果返回false,iteratee会提前退出遍历（无法保证遍历的顺序） | 返回：object                         [iteratee=_.identify]：每次遍历时调用的函数 |
| Function() { this.a=1;this.b=2;} Foo.prototype.c=3;          |                                                              |
| _.forIn(new Foo,function(value,key) { console.log(key);});   | -> 打印’a’,’b’,’c’                                           |
| `without`                                                    | `_.without(array,[values])`                                  |
| 给定一个数组array，提出所有给定值values                      | 返回：过滤值后的数组 _.without([2,1,2,3],2,3) -> [1]         |
| `debounce`                                                   | `_.debounce (func,[wait=0],[options={}])`                    |
| 创建一个防抖动debounced函数，会从上一次被调用后，延迟wait ms后调用func方法 |                                                              |
| _.merge(object,[sources]                                     |                                                              |
| 递归合并sources的自身和继承的可枚举属性到object，若目标存在，被解析为undefined的sources来源属性将被跳过。从左到右，后续的属性会覆盖前面的 | 返回：object                                                 |
| _.mergeWith(object,sources,customizer)                       |                                                              |
| customizer调用以产生target object和source object属性的合并值 | 返回object                                                   |
| isBoolean (value)、isObject (value)、isNumber (value)、isString (value) |                                                              |
| `merge`                                                      | `调用_.mergeWith或_.merge`                                   |
| `_.extend`                                                   | `同._assignIn(object,[sources])，类似assign，但遍历自己的和继承的源属性` |
