

import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import LineString from '../../ol/geom/LineString'
import mix from '../../util/mixin'
//--fix dyj 目前mix函数只支持简单对象的拷贝，Plot必须放在复杂对象前面
export default class Polyline extends mix(Plot, LineString) {

    constructor(points) {
        super(points);
        this.type = PlotTypes.POLYLINE;
        this.geo_type ='LineString'; 
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
