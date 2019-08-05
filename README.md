# PlotOL

### 说明

基于原作者cuifudong 博客地址https://blog.csdn.net/gispace OL3 改版。

基于OpenLayers6 (http://openlayers.org) 实现动态标绘API。

在线体验 http://61.155.169.52:8080/PlotOl/demo/index.html

版本V1.0，实现的功能包括：
- 标绘符号绘制；
- 标绘符号编辑；
- 实现的线状符号：弧线、曲线、折线、自由线；
- 实现的面状符号：圆、椭圆、弓形、扇形、曲线面、集结地、多边形、自由面；
- 实现的箭头符号：钳击、直箭头、细直箭头、突击方向、进攻方向、进攻方向（燕尾）、分队战斗行动、分队战斗行动（燕尾）；

当前版本V1.1，实现的功能包括：
- 全面支持移动端
- 图元层级编辑
- 图元样式，属性编辑
- 实现序列化，可以按照自己的服务器存储格式修改序列化代码，实现保存和加载。

### 演示截图
<img src="https://img-blog.csdnimg.cn/20190801185228982.png" width=1400 height=670>


<img src="https://img-blog.csdnimg.cn/20190801184933359.png" width=375 height=812>


### 编译
```
npm install  安装
```


```
npm run start  开发者模式
```


```
npm run build  发布
```