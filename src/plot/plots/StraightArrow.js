

import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import LineString from '../../ol/geom/LineString'
import mix from '../../util/mixin'
import * as PlotUtils from '../utils/plot_util'
import Constants from '../Constants'
//--fix dyj 目前mix函数只支持简单对象的拷贝，Plot必须放在复杂对象前面
export default class StraightArrow extends mix(Plot, LineString) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.STRAIGHT_ARROW;
        this.fixPointCount = 2;
        this.maxArrowLength = 3000000;
        this.arrowLengthScale = 5;
        this.setPoints(points);
    }
    generate() {
        if (this.getPointCount() < 2) {
            return;
        }
        var pnts = this.getPoints();
        var pnt1 = pnts[0];
        var pnt2 = pnts[1];
        var distance = PlotUtils.distance(pnt1, pnt2);
        var len = distance / this.arrowLengthScale;
        len = len > this.maxArrowLength ? this.maxArrowLength : len;
        var leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
        var rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
        this.setCoordinates([pnt1, pnt2, leftPnt, pnt2, rightPnt]);
    }


}

