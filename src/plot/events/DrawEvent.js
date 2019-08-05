import Event from '../../ol/events/Event'

class DrawEvent extends Event {

	/**
   * @classdesc 传递Feature的Event
   * 用来传递feature
   * @constructs
   * @extends {ol.Event}
   * @author daiyujie
   * @param {String} type 事件类型
   * @param {ol.Feature} feature 图元
   */
	constructor(type, drawstate) {
		super(type);
		this.drawstate = drawstate;
	}
}
/**
 * 添加控制点时触发
 * @static
 */
DrawEvent.ADD_CONTROL_POINT = 'add_control_point';
/**
 * 绘制过程中的鼠标移动事件
 * @static
 */
DrawEvent.ADDING_MOUSE_MOVE = 'adding_mouse_move';

export default DrawEvent