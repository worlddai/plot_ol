import FTStyle from "./Style";
import Style from '../../ol/style/Style'
import Stroke from '../../ol/style/Stroke'
import Fill from '../../ol/style/Fill'

export default class PolyLineStyle extends FTStyle {

    /**
     * @classdesc 折线类样式
     * @author daiyujie
     * @constructs
     */
    constructor() {
        super();
        this._style = {
            //--ol.style.Stroke所有选项
            stroke: {
                color: '#FF0000',
                width: 3,
                lineDash: [10, 10, 10]
            }
        }
    }
    parse() {
        let stroke = null;
        if (this._style.stroke) {
            stroke = new Stroke(this._style.stroke)
        }
        return new Style({
            stroke: stroke
        });
    }
}