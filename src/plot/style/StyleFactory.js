import MarkerStyle from './MarkerStyle'
import PloylineStyle from './PloyLineStyle'
import PloygonStyle from './PloygonStyle'

import PlotTypes from './../PlotTypes'
    /**
     * @classdesc 样式工厂。根据图元类型生成样式对象
     * @author daiyujie
 */
class StyleFactory {
    /**
     * @param {PlotTypes} type 类型
     * @static
     */
    static createFTStyle(type) {
    
        switch (type) {
            case PlotTypes.MARKER:
                return new MarkerStyle();
            case PlotTypes.POLYLINE:
                return new PloylineStyle();
            case PlotTypes.POLYGON:
                return new PloygonStyle();
        }

        return new PloygonStyle();
    }
}

export default StyleFactory