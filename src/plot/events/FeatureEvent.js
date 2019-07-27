import Event from '../../ol/events/Event'

class FeatureEvent extends Event {

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