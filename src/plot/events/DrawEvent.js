import Event from '../../ol/events/Event'

class DrawEvent extends Event {

	/**
   * @classdesc 传递Feature的Event
   * 用来传递feature
   * @constructs
   * @author daiyujie
   * @param {String} type 事件类型
   * @param {ol.Feature} feature 图元
   */
	constructor(type, drawstate) {
		super(type);
		this.drawstate = drawstate;
	}
}
DrawEvent.ADD_CONTROL_POINT = 'add_control_point';
DrawEvent.ADDING_MOUSE_MOVE = 'adding_mouse_move';

export default DrawEvent