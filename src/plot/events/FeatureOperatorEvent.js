import Event from '../../ol/events/Event'

class FeatureOperatorEvent extends Event {

	constructor(type, feature_operator) {
		super(type);
		this.feature_operator = feature_operator;
	}
}
FeatureOperatorEvent.ACTIVATE = 'activate_feature';
FeatureOperatorEvent.DEACTIVATE = 'deactivate_feature';


export default FeatureOperatorEvent