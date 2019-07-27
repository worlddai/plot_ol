

import Plot from './Plot'
import PlotTypes from '../PlotTypes'
import Polygon from '../../ol/geom/Polygon'
import {distance} from '../utils/plot_util'
import Constants from '../Constants'
import mix from '../../util/mixin'
export default class Circle extends mix(Plot,Polygon){

    constructor(points) {
        super(points);
        this.type = PlotTypes.CIRCLE;
        this.fixPointCount = 2;
        this.setPoints(points);
    }
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        var center = this.points[0];
        var radius = distance(center, this.points[1]);
        this.setCoordinates([this.generatePoints(center, radius)]);
    }
    generatePoints(center, radius) {
        var x, y, angle, points = [];
        for (var i = 0; i <= Constants.FITTING_COUNT; i++) {
            angle = Math.PI * 2 * i / Constants.FITTING_COUNT;
            x = center[0] + radius * Math.cos(angle);
            y = center[1] + radius * Math.sin(angle);
            points.push([x, y]);
        }
        return points;
    };


    

}









