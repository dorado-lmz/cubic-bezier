### 设计思路
> [cubic-bezier](http://cubic-bezier.com/)采用canvas绘制bezier曲线，考虑到svg的path元素本身支持二次bezier曲线，所以本例子中采用svg作为绘制基础。

#### 结构设计
##### 需求
1.绘制曲线
左侧的coordinate-plane用来绘制曲线，使用svg大概是这个样子

```
<rect stroke-width="1" x="0" y="0" width="300" height="20" fill="#fff"></rect>
....
<line x1="20" y1="-200" x2="0" y2="0" stroke="#777" stroke-width="1"></line>
<line x1="200" y1="-20" x2="300" y2="-300" stroke="#777" stroke-width="1"></line>
<path d="M 0 0 C 20 -200 200 -20 300 -300" stroke="#222" stroke-width="3" fill="none"></path>
<circle cx="20" cy="-200" r="10" fill="#f08"></circle>
<circle cx="200" cy="-20" r="10" fill="#0ab"></circle>
```
> rect代表条纹  
> 两条line代表控制点与原点和目标点之间的连线  
> path代表bezier曲线  
> 两个circle代表控制点  

只要通过dom将上面的元素添加到coordinate-plane中即可。

2.移动control point  
在两个circle上绑定mousedown事件，事件处理中，再在document上绑定mousemove和mouseup事件，根据event的pageX和pageY，动态改变circle元素的cx和cy属性即可。
 
3.current跟着coordinate-plane变化  
**editor.js** 创建了一个cubic.editor对象  

 * 该对象封装了绘制贝塞尔曲线的API  
 * util 存放工具函数  
 * BezierEditor是bezier曲线绘制的构造函数

**BezierEditor是主角** 

  * bezier曲线绘制的构造函数
  * @param svg_container jquery包装的容器,里面必须存放一个svg元素,svg元素下面放一个id为grid的g元素
  * @param opt 配置参数对象  
  
  ```
   {
     show_grid:是否显示grid,如#svg_container
     hightlight:高对比度,stroke为白色
     viewbox_rec:viewbox设置
     x1,y1,x2,y2:设置两个控制点的坐标
     padding:距离边框的距离
     link:两个editor共享相同的bezier
   }
  ```
 使用如下： 
  
 ```
 //创建coordinate-plane editor
 var svg_container = $("#svg_container");
 var editor = new cubic.editor.BezierEditor(svg_container, {
				show_grid: true,
				viewbox_rec: [new vec2(0, -450)],
				interative: true,
  				link:[current],
  	});
 ```
 * 上面的editor调用update的时候，调用link属性指定的元素的update方法
 
  > 这个例子中的所有的bezier都是该对象创建的.  
 
4.Library  
**library.js** 创建了一个library对象  
该对象用于添加、删除和调用cubic.editor.BezierEditor进行渲染。

5.交互  
**interactive.js** 处理例子中按钮的点击事件
例如：保存，开始，导入，导出等
导出时利用js模板，填充数据后，将完整的css3动画代码输出。


