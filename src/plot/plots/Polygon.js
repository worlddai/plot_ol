import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import PolygonOL from '../../ol/geom/Polygon'
import mix from '../../util/mixin'
export default class Polygon extends mix(Plot,PolygonOL) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.POLYGON;
        this.setPoints(points);
    }
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        this.setCoordinates([this.points]);
    }
    

}

