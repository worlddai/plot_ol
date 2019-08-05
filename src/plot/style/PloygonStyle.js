import FTStyle from "./Style";
import Style from '../../ol/style/Style'
import Stroke from '../../ol/style/Stroke'
import Fill from '../../ol/style/Fill'
class PolygonStyle extends FTStyle {
    /**
    * @classdesc 多边形类样式
    * @author daiyujie
    * @extends {FTStyle}
    * @constructs
    */
    constructor() {
        super();
        this._style = {
            fill: { color: 'rgba(0,255,0,0.4)' },
            stroke: {
                color: '#FF0000',
                width: 2
            }
        }
    }
    parse() {
        let fill, stroke = null;
        if (this._style.fill) {
            fill = new Fill(this._style.fill)
        }
        if (this._style.stroke) {
            stroke = new Stroke(this._style.stroke)
        }
        return new Style({
            fill: fill,
            stroke: stroke
        });
    }


}
export default PolygonStyle