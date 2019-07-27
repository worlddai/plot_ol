

import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import LineString from '../../ol/geom/LineString'
import mix from '../../util/mixin'

export default class FreehandLine extends mix(Plot, LineString) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.FREEHAND_LINE;
        this.freehand = true;
        this.setPoints(points);
    }
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        this.setCoordinates(this.points);
    }
}
