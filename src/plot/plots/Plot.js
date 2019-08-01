
export default class Plot {
    /**
    * @classdesc 集合对象定制基类。用来实现绘制图元。
    * @constructs
    * @author daiyujie
    * @param {ol.Coordinate} points 图元的点集
    */
    constructor(points) {
        this.setPoints(points);
        this.geo_type ='RootTest'; 
    }
    /**
	 * 是否为图元
	 */
    isPlot() {
        return true;
    }
    /**
	 * 设置点集
     * @param {ol.Coordinate} points 图元的点集
	 */
    setPoints(value) {
        this.points = value ? value : [];
        if (this.points.length >= 1)
            this.generate();
    }
    /**
	 * 获取当前图元的点集
     * @return {ol.Coordinate}  图元的点集
	 */
    getPoints() {
        return this.points.slice(0);
    }
    /**
	 * 获取当前图元的点集数量
     * @return {Number}  图元的点集的数量
	 */
    getPointCount() {
        return this.points.length;
    }
    /**
	 * 更新点集
     * @param {ol.Coordinate} point 点
     * @param {index} index 位置
	 */
    updatePoint(point, index) {
        if (index >= 0 && index < this.points.length) {
            this.points[index] = point;
            this.generate();
        }
    }
    updateLastPoint(point) {
        this.updatePoint(point, this.points.length - 1);
    }
    generate() {
        //--TODO
    }
    finishDrawing() {
        //--TODO
    }
}








