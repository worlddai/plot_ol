import Event from '../../ol/events/Event'

class FeatureOperatorEvent extends Event {
	/**
	* @classdesc 传递FeatureOperator的Event
	* 用来传递feature
	* @constructs
    * @extends {ol.Event}
	* @author daiyujie
	* @param {String} type 事件类型
	* @param {FeatureOperator} feature 图元操作类
	*/
	constructor(type, feature_operator) {
		super(type);
		this.feature_operator = feature_operator;
	}
}
/**
 * 图元被激活时触发
 * @static
 */
FeatureOperatorEvent.ACTIVATE = 'activate_feature';
/**
 * 图元被取消激活时触发
 * @static
 */
FeatureOperatorEvent.DEACTIVATE = 'deactivate_feature';


export default FeatureOperatorEvent