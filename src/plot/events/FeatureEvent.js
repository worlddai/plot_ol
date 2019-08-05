import Event from '../../ol/events/Event'

class FeatureEvent extends Event {

	/**
   * @classdesc 传递Feature的Event
   * 用来传递feature
   * @constructs
   * @extends {ol.Event}
   * @author daiyujie
   * @param {String} type 事件类型
   * @param {ol.Feature} feature 图元
   */
	constructor(type, feature) {
		super(type);
		this.feature = feature;
	}
}
/**
 * 当图元被激活时触发
 * @static
 */
FeatureEvent.ACTIVATE = 'activate_feature';
/**
 * 当图元被取消激活时触发
 * @static
 */
FeatureEvent.DEACTIVATE = 'deactivate_feature';
/**
 * 当绘制结束时触发
 * @static
 */
FeatureEvent.DRAW_END = 'draw_end';
/**
 * 绘制开始时触发
 * @static
 */
FeatureEvent.DRAW_START = 'draw_start'

export default FeatureEvent