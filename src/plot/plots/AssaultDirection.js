
import PlotTypes from '../PlotTypes'
import FineArrow from './FineArrow'
export default class AssaultDirection extends FineArrow {

    constructor(points) {
        super(points);
        this.type = PlotTypes.ASSAULT_DIRECTION;
        this.tailWidthFactor = 0.2;
        this.neckWidthFactor = 0.25;
        this.headWidthFactor = 0.3;
        this.headAngle = Math.PI / 4;
        this.neckAngle = Math.PI * 0.17741;
        this.setPoints(points);
    }
}







