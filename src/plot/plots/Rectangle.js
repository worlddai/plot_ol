import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import PolygonOL from '../../ol/geom/Polygon'
import mix from '../../util/mixin'
export default class Rectangle extends mix(Plot, PolygonOL) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.RECTANGLE;
        this.fixPointCount = 2;
        this.setPoints(points);
    }
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        } else {
            var pnt1 = this.points[0];
            var pnt2 = this.points[1];
            var xmin = Math.min(pnt1[0], pnt2[0]);
            var xmax = Math.max(pnt1[0], pnt2[0]);
            var ymin = Math.min(pnt1[1], pnt2[1]);
            var ymax = Math.max(pnt1[1], pnt2[1]);
            var tl = [xmin, ymax];
            var tr = [xmax, ymax];
            var br = [xmax, ymin];
            var bl = [xmin, ymin];
            this.setCoordinates([[tl, tr, br, bl]]);
        }
    }


}