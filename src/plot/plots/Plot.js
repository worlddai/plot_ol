
export default class Plot {
    constructor(points) {
        this.setPoints(points);
    }
    isPlot() {
        return true;
    }
    setPoints(value) {
        this.points = value ? value : [];
        if (this.points.length >= 1)
            this.generate();
    }
    getPoints() {
        return this.points.slice(0);
    }
    getPointCount() {
        return this.points.length;
    }

    updatePoint(point, index) {
        if (index >= 0 && index < this.points.length) {
            this.points[index] = point;
            this.generate();
        }
    }
    updateLastPoint(point) {
        this.updatePoint(point, this.points.length - 1);
    }
    generate() {
    }
    finishDrawing() {

    }
}








