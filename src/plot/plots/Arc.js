



import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import LineString from '../../ol/geom/LineString'
import * as PlotUtils from '../utils/plot_util'
import mix from '../../util/mixin'
//--fix dyj 目前mix函数只支持简单对象的拷贝，Plot必须放在复杂对象前面
export default class Arc extends mix(Plot, LineString) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.ARC;
        this.fixPointCount = 3;
        this.setPoints(points);
    }
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        if (count == 2) {
            this.setCoordinates(this.points);
        } else {
            var pnt1 = this.points[0];
            var pnt2 = this.points[1];
            var pnt3 = this.points[2];
            var center = PlotUtils.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
            var radius = PlotUtils.distance(pnt1, center);

            var angle1 = PlotUtils.getAzimuth(pnt1, center);
            var angle2 = PlotUtils.getAzimuth(pnt2, center);
            if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
                var startAngle = angle2;
                var endAngle = angle1;
            }
            else {
                startAngle = angle1;
                endAngle = angle2;
            }
            this.setCoordinates(PlotUtils.getArcPoints(center, radius, startAngle, endAngle));
        }
    }

}





