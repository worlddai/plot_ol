import { guid } from '../../util/core'
import StyleFactory from '../style/StyleFactory'
import Constants from '../Constants'
class FeatureOperator{
    /**
    * @classdesc 标绘图元操作类
    * 提供对标绘图元的封装操作.所有的地图点击事件的回调函数中均有该对象，可以通过该对象实现图元的基本操作
    * @constructs
    * @author daiyujie
    * @param {ol.Feature} feature 图元
    * @param {ol.layer.SourceLayer} layer 放置的layer
    * @param {number} zindex 当前图元的zindex
    */
    constructor(feature, layer, zindex) {
        /**
         * 名称
         * @type {String}
         */
        this.name = "未命名";
        /**
         * feature对象
         * @type {ol.Feature}
         */
        this.feature = feature;
        /**
        * 图层对象
        * @type {ol.layer.SourceLayer}
        */
        this.layer = layer;
        /**
        * 是否被销毁
        * @type {Boolean}
        */
        this.isDestoryed = false;
        /**
        * 唯一区分值
        * @type {String}
        */
        this.guid = guid(true);
        /**
         * 属性列表
         * @type {Object}
         */
        this.attrs = {};
        //--初始化样式
        this._initStyle(zindex)
        //--添加到图层
        this._addToLayer();
    }
    /**
     * @ignore
     * 初始化样式
     */
    _initStyle(zindex) {
        const ft_style = StyleFactory.createFTStyle(this.getType());
        const style = ft_style.parse();
        style.setZIndex(zindex);
        this.feature.setStyle(style);
        this.ft_style = ft_style;
    }
    /**
     * @ignore
     */
    _addToLayer() {
        this.layer.getSource().addFeature(this.feature);
    }
    /**
     * 设置图元样式。不同图元提供不同的属性设置。可以通过getStyle获取图元默认样式
     * @param {JSON} json_style
     */
    setStyle(json_style) {
        if (!json_style)
            return;
        const zIndex = this.getZIndex();
        this.ft_style.setStyle(json_style)
        const style = this.ft_style.parse();
        style.setZIndex(zIndex);
        this.feature.setStyle(style);
    }
    /**
    * 获取图元当前样式
    * @return {JSON} json_style
    */
    getStyle() {
        return this.ft_style.serialize();
    }
    /**
    * 获取图元当前ZIndex
    * @return {Number} zindex
    */
    getZIndex() {
        return this.feature.getStyle().getZIndex();
    }
    /**
    * 获取图元类型。点，线，面等。
    * @return {String} 类型
    */
    getType() {
        return this.feature.values_.geometry.type;
    }
    /**
    * 设置图元的名称
    * @param {String} str_name 名称
    */
    setName(str_name) {
        this.name = str_name;
    }
    /**
    * 设置图元的名称
    * @return {String}  名称
    */
    getName() {
        return this.name
    }
    /**
    * 设置图元不可被点击
    * @return {String}  名称
    */
    disable() {
        this.feature.set(Constants.SE_DISABLED, true);
    }
    /**
    * 设置图元可以被点击
    * @return {String}  名称
    */
    enable() {
        this.feature.set(Constants.SE_DISABLED, false);
    }
    /**
    * 获取图元自定义属性
    * @param {String} key 
    * @return {Object} value
    */
    getAttribute(key) {
        return this.attrs[key];
    }
    /**
     * 设置图元属性。相同的属性键值会被覆盖
   * @param {String} key 
   * @param {Object} value
   */
    setAttribute(key, value) {
        this.attrs[key] = value;
    }
    /**
     * 删除图元属性
     * @param {String} key 
     * @return {Boolean} 是否操作成功 
     */
    removeAttribute(key) {
        if (this.attrs[key]) {
            delete this.attrs[key];
            return true;
        }
        return false;
    }
    /**
   * 迭代自定义属性
   * @param {Function} fn  回调函数
   * @param {Object} scope 回调函数this值 可选
   */
    iteratorAttribute(fn, scope) {
        for (let sKey in this.attrs) {
            if (fn && typeof fn == 'function')
                fn.call(scope, sKey)
        }
    }
    /**
    * 更新对象的控制点
    */
    setCoordinates(coordinates) {
        const plot = this.feature.values_.geometry;
        if (plot)
            plot.setPoints(coordinates)
    }
    /**
   * 销毁对象
   */
    destory() {
        this.isDestoryed = true;
        this.feature = null;
        this.layer = null;
        this.attrs = {};
        this.ft_style.destory();

    }
    /**
     * 序列化
     */
    serialize() {
        const plot = this.feature.values_.geometry;
        if (!plot)
            return {}

        return {
            config: {
                cresda_flag: true,
                z_index: this.getZIndex(),
                disabled:!!this.feature.get(Constants.SE_DISABLED)
            },
            name: this.getName(),
            ext_attr: this.attrs,
            plotting_type: plot.type,
            geo_type: plot.geo_type,
            geo_data: {
                coordinates: plot.getPoints(),
                type: plot.geo_type
            },

            style: this.getStyle()
        }
    }
}
export default FeatureOperator;