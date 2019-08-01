import Event from '../../ol/events/Event'

class FeatureEvent extends Event {

	/**
   * @classdesc 传递Feature的Event
   * 用来传递feature
   * @constructs
   * @author daiyujie
   * @param {String} type 事件类型
   * @param {ol.Feature} feature 图元
   */
	constructor(type, feature) {
		super(type);
		this.feature = feature;
	}
}
FeatureEvent.ACTIVATE = 'activate_feature';
FeatureEvent.DEACTIVATE = 'deactivate_feature';
FeatureEvent.DRAW_END = 'draw_end';
FeatureEvent.DRAW_START = 'draw_start'

export default FeatureEvent