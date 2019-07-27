import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import PolygonOL from '../../ol/geom/Polygon'
import mix from '../../util/mixin'
import * as PlotUtils from '../utils/plot_util'
import Constants from '../Constants'
export default class Lune extends mix(Plot, PolygonOL) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.LUNE;
        this.fixPointCount = 3;
        this.setPoints(points);
    }
    generate() {
        if (this.getPointCount() < 2) {
            return;
        }
        var pnts = this.getPoints();
        if (this.getPointCount() == 2) {
            var mid = PlotUtils.mid(pnts[0], pnts[1]);
            var d = PlotUtils.distance(pnts[0], mid);
            var pnt = PlotUtils.getThirdPoint(pnts[0], mid, Constants.HALF_PI, d);
            pnts.push(pnt);
        }
        var pnt1 = pnts[0];
        var pnt2 = pnts[1];
        var pnt3 = pnts[2];
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
        var pnts = PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
        pnts.push(pnts[0]);
        this.setCoordinates([pnts]);


    }
}
