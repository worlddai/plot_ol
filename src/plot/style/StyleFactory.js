import MarkerStyle from './MarkerStyle'
import PloylineStyle from './PloyLineStyle'
import PloygonStyle from './PloygonStyle'

import PlotTypes from './../PlotTypes'

export default class StyleFactory {
    /**
     * @classdesc 样式工厂。根据图元类型生成样式对象
     * @author daiyujie
     * @constructs
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