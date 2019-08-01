
import FTStyle from "./Style";
import Style from '../../ol/style/Style'
import Stroke from '../../ol/style/Stroke'
import Fill from '../../ol/style/Fill'
import Icon from '../../ol/style/Icon'
export default class MarkerStyle extends FTStyle {

    /**
    * @classdesc 点类样式
    * @author daiyujie
    * @constructs
    */
    constructor() {
        super();
        this._style = {
            image: {
                //--ol.Image 的全部属性
                icon: {
                    src: './images/marker-begin.png',
                    offset: [0, 0],
                    opacity: 1,
                    scale: 1
                }
            }

        }
    }
    parse() {
        let image = null;

        if (this._style.image) {
            if (this._style.image.icon) {
                image = new Icon(this._style.image.icon)
            }
        }

        return new Style({
            image: image
        });
    }
  

}