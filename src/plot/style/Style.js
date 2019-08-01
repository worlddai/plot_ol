import {deepcopy} from '../../util/core'
export default class FTStyle {
    /**
     * @classdesc 样式基类对象
     * @author daiyujie
     * @constructs
     */
    constructor() {
        this._style = {};
        this.isDestoryed = false;
    }
    parse() {
        return new Style();
    }
    serialize() {
        return deepcopy(this._style);
    }
    setStyle(json_style) {
        this._style = json_style;
    }
    destory() {
        this._style = {};
        this.isDestoryed = true;
    }

}