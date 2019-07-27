
import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import Point from '../../ol/geom/Point'
import mix from '../../util/mixin'
export default class Marker extends mix(Plot,Point) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.MARKER;
        this.fixPointCount = 1;
        this.setPoints(points);
    }
    generate() {
        var pnt = this.points[0];
        this.setCoordinates(pnt);
    }
}






