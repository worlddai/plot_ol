
class Plot {
    /**
    * @classdesc 所有图元的基类,用来实现绘制图元。
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
	 * 更新某个索引的点
     * @param {ol.Coordinate} point 点
     * @param {index} index 位置
	 */
    updatePoint(point, index) {
        if (index >= 0 && index < this.points.length) {
            this.points[index] = point;
            this.generate();
        }
    }
    /**
     * 更新最后一个点
     * @param {ol.Coordinate} point 
     */
    updateLastPoint(point) {
        this.updatePoint(point, this.points.length - 1);
    }
    /**
    * @override
    * 图元绘制逻辑.各个图元用来覆盖
    */
    generate() {
        //--TODO
    }
    /**
    * @override
    * 图元结束绘制回调
    */
    finishDrawing() {
        //--TODO
    }
}
export default Plot;







