

import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import LineString from '../../ol/geom/LineString'
import mix from '../../util/mixin'
import * as PlotUtils from '../utils/plot_util'

export default class Curve extends mix(Plot, LineString) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.CURVE;
        this.t = 0.3;
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
            this.setCoordinates(PlotUtils.getCurvePoints(this.t, this.points));
        }


    }
}