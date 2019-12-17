# g- Geometry library
JointJS内置的另一个轻量级库。这个库实现了许多有用的几何操作。没有任何依赖关系，可以单独使用。

| `normalizeAngle(angle)`                                      | 角度值转换限定在[0,360]范围内                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `snapToGrid（value,gridSize）``gridSize * Math.round(value/ gridSize)` | 将值value捕捉到一个大小为gridSize的网格；   将value值调整为gridSize的倍数，返回调整后的value值 |
| `toDeg（rad）`                                               | 弧度rad转为角度                                              |
| `toRad(deg,over360)`                                         | 角度deg转为弧度，如果over360为真，则不要360度调制            |
|                                                              |                                                              |

### g.bezier**——贝塞尔曲线相关的图形方法**

| `curveThroughPoints(points)`                       | 返回定义经过points的三次贝塞尔曲线的SVG路径命令.   Cubic Bezier   curve path through points,返回作为数组的SVG Path命令.   此方法自动计算创建平滑曲线交叉点所需的三次贝塞尔控制点 |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `getCurveControlPoints(knots)`                     | Get open-ended   Bezier Spline Control Points   knots应该是Bezier spline点（至少两点！）。返回一个数组，其中第一个项目是第一个控制点的数组，第二个项目是第二个控制点的数组。 |
| `getCurveDivider(p0, p1, p2, p3)`                  | 在由值t∈<0,1>定义的点处将贝塞尔曲线分为两部分。使用deCasteljau算法。 |
| `getFirstControlPoints(rhs)`                       | 为第一个Bezier控制点的一个坐标（x或y）求解一个tridiagonal三对角线系统。rhs是右手向量。返回 solution向量 |
| `getInversionSolver(p0, p1, p2, p3)`               | 解决倒置问题，给定位于参数曲线x = x（t）/ w（t），y = y（t）/ w（t）上的点的（x，y）坐标，找到与该点对应的参数值t。返回接受一个点并返回t的函数。 |

### g.ellipse

|                                                    |                                                              |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `构造函数`                                         | function(c,a,b)                                              |
| `fromRect(rect)`                                   | 从rect新建一个ellipse                                        |
| prototype                                          |                                                              |
| `bbox`                                             | 返回边界矩形框                                               |
| `clone`                                            | 返回新的Ellipse实例，它是椭圆的克隆                          |
| `normalizedDistance（point）`                      | 返回从椭圆中心到点p的标准化距离。判断点相对于ellipse的位置，返回一个数字n（对于椭圆内部的点，n <1，椭圆边界上的点n = 1，椭圆外部的点n> 1） |
| `inflate（dx,dy）`                                 | 膨胀dx, dy。返回一个椭圆在x轴上膨胀2 * dx，在y轴上膨胀2 * dy。当使用单个参数时，生成的椭圆在x轴和y轴上均膨胀2 * dx。 |
| `containsPoint（point）`                           | 如果点p在椭圆内（包括），则返回true                          |
| `center`                                           | 返回中心点                                                   |
| `tangentTheta（point）`                            | 返回x轴与point的切线之间的角度   正切角,p为切点，在ellipse的边界上。仅适用于椭圆边界上的点 |
| `equals（ellipse）`                                | 判断两个ellipse是否相同，相同则返回true                      |
| `intersectionWithLineFromCenterToPoint（p,angle）` | 找到从ellipse的中心到点p的连线与ellipse的边界的交点；   如果指定了角度，则计算与旋转后的椭圆（椭圆绕其中心旋转angle角度）的交点 |
| `toString`                                         | 返回以字符串表示的椭圆。将ellipse的参数转化为字符串          |

### g.rect

|                                                    |                                                              |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `构造函数function(x, y, w, h)`                     | 由x,y坐标（左上角）和宽度、高度信息创建矩形。如果仅指定了x，则认为它是{x：[number]，y：[number]，width：[number]，height：[number]}形式的对象，在这种情况下，返回的是该矩形的副本 |
| `fromEllipse(e)`                                   | 从给定的椭圆中返回一个新的矩形对象                           |
| prototype                                          |                                                              |
| `bbox（angle）`                                    | 返回矩形的边框矩形，考虑其围绕中心的旋转指定的角度           |
| `clone, equals(p)`                                 |                                                              |
| `center`                                           | 矩形的中心点                                                 |
| `containsPoint(p)`                                 | p包含在矩形中时返回true                                      |
| `containsRect(r)`                                  | 矩形`r`包含在该矩形中返回true                                |
| `corner`                                           | 矩形右下角的点                                               |
| `intersect（r）`                                   | 无交叉时返回null，有交叉时返回交叉的矩形（两个矩形的交集）   |
| `intersectionWithLineFromCenterToPoint (p, angle)` | 找到从center到点p的线和边界的交点，如果指定了角度，则计算与围绕其中心旋转angle角度后矩形的交点 |
| `offset(dx, dy)`                                   | 调用Point的offset函数，以指定的大小（dx,dy）Offset点,即x+dx,y+dy |
| `moveAndExpand (r)`                                | 用r.x和r.y偏移，然后用r.width和r.height expand矩形。按r的x, y move，宽/高加上r的宽/高 |
| `inflate(dx, dy)`                                  | dx和dy膨胀，返回一个在x轴上膨胀2×dx和y轴上2×dy的矩形。当使用单个参数调用方法时，生成的矩形在x轴和y轴上均膨胀2 * dx。重新计算[x，y，w，h] |
| `normalize`                                        | 标准化矩形; 即使其具有非负的宽度和高度   如果宽度<0，则函数交换左右corner，如果高度<0，则交换top & bottom corners |

### g.scale
linear(domain, range, value)  

从domain间隔scale到range间隔的值，domain和range间隔都必须指定为数组，其中两个数字指定间隔的开始和结束。

### g.polyline

|                              |                                                              |
| ---------------------------- | ------------------------------------------------------------ |
| `构造函数``function(points)` | 用给定的points数组返回一个新的多段线对象，数组可以容纳Point构造函数可以理解的任何东西; 无法理解为点的数组元素被替换为0,0点 |
| prototype                    |                                                              |
| `pointAtLength(length)`      | 返回（沿着多段线的路径）距离起点指定长度的多段线上的点。   判断length在哪段折线上，再计算折线上的对应点 |
| `length`                     | 折线的长度                                                   |
| `closestPoint(point)`        | 返回距离给定点最近的折线上的点                               |
| `closestPointLength(point)`  | 返回折线和给定点之间垂直距离最小的长度                       |
| `toString`                   | 以x1 @ y1，x2 @ y2，...形式的字符串返回多段线                |

### g.line

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `构造函数 `function(p1,p2)   var l =   g.line(g.point(10, 20), g.point(50, 60)); | 两点创建line的start（p1）,end（p2）。p1和p2首先通过点构造函数，所以他们也可以通过字符串形式传递 var l = new g.line('10 20', '50 60');  var l = g.line('10@20', '50@60'); |
| prototype                                                    |                                                              |
| `bearing`                                                    | 返回线的主要方向,即 NE, E, SE等8个方向                       |
| `clone ,equals(l)`                                           |                                                              |
| `intersect(l)`                                               | 返回与line或rect的交点（1或多个）                            |
| `length`                                                     | 线的长度                                                     |
| `midpoint`                                                   | 线的中点                                                     |
| `pointAt（t）`                                               | 返回由浮点数t指定的线上的点，t 属于[0,1], 如果t等于0.5，该函数返回线的中点 |
| `pointOffset（p）`                                           | 返回直线和p点之间的垂直距离。+, p在线的右侧，- , 在左边，0, 在线上 |
| `vector`                                                     | 返回长度等于线长的线的矢量（点），返回该线的矩阵向量{point}  |
| `closestPoint（p）`                                          | 返回线上到p点最近的点                                        |
| `closestPointNormalizedLength（p）`                          | 线上距离点p最近的点到p点的Normalized归一化长度（距线起点的距离/总线长） |
| `squaredLength`                                              | 线长度的平方                                                 |
| `toString`                                                   | 返回表示为字符串的线                                         |

### g.point

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `构造函数`function(x,y)`                                     | 由x,y坐标创建点，如果x是一个字符串，则认为其格式为“[number] [number]”或“[number] @ [number]”，第一个数字是x坐标，第二个数字是y坐标 |
| `fromPolar(distance, angle, origin)`                         | 可选的构造函数，从极坐标创建点                               |
| `random(x1, x2, y1, y2)`                                     | 用落入`[x1，x2]`和`[y1，y2]`范围内的随机坐标创建一个点       |
| prototype                                                    |                                                              |
| `bearing（point）`                                           | 返回该点与point点的连线的bearing                             |
| `clone, equals(p)`                                           |                                                              |
| `difference（dx,dy）`                                        | 返回点，坐标是point和（dx,dy）点的差值。如果仅指定了dx并且是一个数字，则dy被认为是零。如果仅指定了dx并且是对象，则认为它是{x：[number]，y：[number]}形式的另一个点或对象 |
| `adhereToRect（r）`                                          | 如果点在矩形`r`之外，则调整该点以使其成为r边界上的最近点，否则返回点本身 |
| `changeInAngle（dx, dy, ref）`                               | 从点以前的位置（-dx，-dy）到点的新位置相对于ref点的角度变化. 移动是相对于ref点和X轴的 |
| `distance（p）`                                              | 点到p的距离                                                  |
| `squaredDistance(p)`                                         | 点和p距离的平方                                              |
| `magnitude`                                                  | 点向量的大小，即点到（0,0）的距离                            |
| `manhattanDistance（p）`                                     | 点和p之间的manhattan距离，\|p.x-x\|+\|p.y-y\|                |
| `move(ref, distance)`                                        | 将点在（从ref位置到该点的）连线上移动distance距离            |
| `normalize(length)`                                          | 标准化点向量并返回点本身。缩放x和y，使得点与原点（0,0）之间的距离等于给定长度。如果未指定len，则认为是1，在这种情况下计算单位向量 |
| `offset(dx, dy)`                                             | 以指定的大小（dx,dy）偏移该点（更改其x和y坐标）,即x+dx,y+dy。如果仅指定了dx并且是一个数字，则dy被认为是零。如果仅指定了dx并且是对象，则认为它是{x：[number]，y：[number]}形式的另一个点或对象 |
| `reflection（ref）`                                          | 以ref point为翻转中心，返回该点的反射点                      |
| `rotate(origin, angle)`                                      | 围绕origin旋转angle角度                                      |
| `round (precision)`                                          | 将点转化为给定的精度/将点的坐标按precision取整               |
| `scale (sx, sy, origin)`                                     | Scale point with   origin将点关于origin缩放sx,sy             |
| `snapToGrid (gx, gy)`                                        | 将点的坐标分别按gx, gy进行snapToGrid操作，返回点   将点（更改其x和y坐标）捕捉到大小为gridSize的网格（或对于非均匀网格为gridSize x gridSizeY）。 |
| `theta(p)`                                                   | 计算当前点和`p`的连线和x轴之间的角度                         |
| `angleBetween(p1, p2)`                                       | 计算通过点和p1的矢量，与通过点和p2的矢量之间的角度，并确保角度在[0,360]范围；   p1,p2的顺序很重要（p2—p1）：   角度逆时针，返回0到180之间的角度；   返回180到360之间的角度, 将顺时针角度转换为逆时针角度；   如果p1或p2与此点重合，返回NaN |
| `vectorAngle`                                                | 计算从0,0到me的矢量与从0,0到p的矢量之间的角度。角度为逆时针时，该函数返回0到180度之间的值，当角度为顺时针时，返回180到360度之间的值。如果从点（0,0）调用，或者如果p是（0,0），则该函数返回NaN。 |
| `toJSON`                                                     | 将该点作为简单的JSON对象返回。如：{“x”：0，“y”：0}。         |
| `toPolar（o）`                                               | 将（o与point连线为对角线的）矩形转换为极坐标，原点可以被指定，否则它是(0,0) |
| `update(x, y)`                                               | 用新值更新点x和y坐标并返回点本身                             |
| `dot（p）`                                                   | 返回该点和给定p点的点积：x0x1+y0y1                           |
| `cross(p1, p2)`` ``(p2.x - x) * (p1.y - y)) - ((p2.y - y) * (p1.x - x)` | 从point开始通过p1的矢量（矢量1），和从point开始通过p2的矢量（矢量2）的交叉积。使用左手坐标系（y轴指向下方）   注意点p1和p2的顺序！   结果为正，指示从第一个向量到第二个向量为顺时针（“右”）转向，负的表明为逆时针（‘左’）转向。 |
| `toString`                                                   | ‘ x @ y ’ 以x @ y字符串形式返回该点                          |

### g.rect

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `origin`                                                     | 返回点（x,y）,左上角                                         |
| `pointNearestToPoint (point)`                                | 返回矩形边界上最接近point的点                                |
| `round`                                                      | 将rect的4个参数按precision取整                               |
| `scale(sx, sy, origin)`                                      | 在给定origin周围通过sx，sy缩放矩形                           |
| `maxRectScaleToFit (rect, origin)`                           | 返回一个最大可能的scale对象， sx和sy给出可以应用于rect的最大缩放比例，以便它仍然适合rect（仍在rect内）。 |
| `maxRectUniformScaleToFit(rect, origin)`                     | 返回一个数字，它指定可以应用于两个坐标轴的最大缩放比例，以便它仍然适合rect。   即在maxRectScaleToFit基础上再选取scale.sx和sy的最小值 |
| `sideNearestToPoint (point)`                                 | 返回离点最近的边（字符串）"top", "left", "right"   or "bottom" |
| `snapToGrid (gx, gy)`                                        | 调整矩形的位置和尺寸，使其边缘位于x轴上的最近gx增量和y轴上的最近增量gy上。   its edges are on   the nearest increment of gx on the x-axis and gy on the y-axis   将矩形的origin和corner设为gridsize的倍数，再更新4个参数，使矩形和grid对齐. |
| `leftLine/ rightLine/ topline/ bottomLine`                   | 矩形左右上下的线                                             |
| `leftMiddle、rightMiddle、bottomLeft/ bottomMiddle、topMiddle/topRight` | 返回对应的点                                                 |
| `toJSON`                                                     | 返回参数对象的JSON格式                                       |
| `toString`                                                   | ‘origin corner’ 以字符串x @ y x @ y的形式返回矩形            |
| `union（rect）`                                              | 将两个矩形结合，返回合并后的矩形   选取origin的最小坐标，选择corner的最大坐标 |
|                                                              |                                                              |


