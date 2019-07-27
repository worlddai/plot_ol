import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import PolygonOL from '../../ol/geom/Polygon'
import mix from '../../util/mixin'
import * as PlotUtils from '../utils/plot_util'
// import Constants from '../constants'
export default class Sector extends mix(Plot, PolygonOL) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.SECTOR;
        this.fixPointCount = 3;
        this.setPoints(points);
    }
    generate() {
        if (this.getPointCount() < 2)
            return;
        if (this.getPointCount() == 2)
            this.setCoordinates([this.points]);
        else {
            var pnts = this.getPoints();
            var center = pnts[0];
            var pnt2 = pnts[1];
            var pnt3 = pnts[2];
            var radius = PlotUtils.distance(pnt2, center);
            var startAngle = PlotUtils.getAzimuth(pnt2, center);
            var endAngle = PlotUtils.getAzimuth(pnt3, center);
            var pList = PlotUtils.getArcPoints(center, radius, startAngle, endAngle);
            pList.push(center, pList[0]);
            this.setCoordinates([pList]);
        }

    }
}

