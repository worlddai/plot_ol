import Event from '../../ol/events/Event'

class FeatureOperatorEvent extends Event {
	/**
	* @classdesc 传递FeatureOperator的Event
	* 用来传递feature
	* @constructs
	* @author daiyujie
	* @param {String} type 事件类型
	* @param {FeatureOperator} feature 图元操作类
	*/
	constructor(type, feature_operator) {
		super(type);
		this.feature_operator = feature_operator;
	}
}
FeatureOperatorEvent.ACTIVATE = 'activate_feature';
FeatureOperatorEvent.DEACTIVATE = 'deactivate_feature';


export default FeatureOperatorEvent