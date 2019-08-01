
import * as ol from '../ol';
import Constants from './Constants'
import * as DomUtils from '../util/dom_util';
import FeatureEvent from './events/FeatureEvent'
import { connectEvent, disconnectEvent } from '../util/core'
export default class PlotEdit extends ol.Observable {

	/**
	 * @classdesc 图元进行编辑的基类。用来创建控制点，绑定控制点事件，对feature的数据进行处理
	 * @author daiyujie
	 * @constructs
	 * @param {ol.Map} map 地图对象
	 */
	constructor(map) {
		if (!map) {
			return;
		}
		super();
		this.activePlot = null;
		this.startPoint = null;
		this.ghostControlPoints = null;
		this.controlPoints = null;
		this.map = map;
		this.mapViewport = this.map.getViewport();
		this.mouseOver = false;
		this.elementTable = {};
		this.activeControlPointId = null;
		this.mapDragPan = null;

		//--listener
		this._ls_pointermove = null;
		this._ls_pointdrag = null;
		this._ls_pointerdown = null;
		this._ls_pointup = null;
		//--这个比较特殊。绑定在map.mapBrowserEventHandler_上
		this._is_controlpoint_pointermove = null;

	}
	initHelperDom() {
		if (!this.map || !this.activePlot) {
			return;
		}
		var parent = this.getMapParentElement();
		if (!parent) {
			return;
		}
		var hiddenDiv = DomUtils.createHidden('div', parent, Constants.HELPER_HIDDEN_DIV);

		var cPnts = this.getControlPoints();
		for (var i = 0; i < cPnts.length; i++) {
			var id = Constants.HELPER_CONTROL_POINT_DIV + '-' + i;
			DomUtils.create('div', Constants.HELPER_CONTROL_POINT_DIV, hiddenDiv, id);
			this.elementTable[id] = i;
		}
	};

	getMapParentElement() {
		var mapElement = this.map.getTargetElement();
		if (!mapElement) {
			return;
		}
		return mapElement.parentNode;
	};

	destroyHelperDom() {
		//
		if (this.controlPoints) {
			for (var i = 0; i < this.controlPoints.length; i++) {
				this.map.removeOverlay(this.controlPoints[i]);
				var element = DomUtils.get(Constants.HELPER_CONTROL_POINT_DIV + '-' + i);
				if (element) {
					DomUtils.removeListener(element, 'mousedown', this.controlPointMouseDownHandler, this);
					// DomUtils.removeListener(element, 'mousemove', this.controlPointMouseMoveHandler2, this);
				}
			}
			this.controlPoints = null;
		}
		//
		var parent = this.getMapParentElement();
		var hiddenDiv = DomUtils.get(Constants.HELPER_HIDDEN_DIV);
		if (hiddenDiv && parent) {
			DomUtils.remove(hiddenDiv, parent);
		}
	};

	initControlPoints() {
		if (!this.map) {
			return;
		}
		this.controlPoints = [];
		var cPnts = this.getControlPoints();
		for (var i = 0; i < cPnts.length; i++) {
			var id = Constants.HELPER_CONTROL_POINT_DIV + '-' + i;
			var element = DomUtils.get(id);
			var pnt = new ol.Overlay({
				id: id,
				position: cPnts[i],
				positioning: 'center-center',
				element: element,
			});
			this.controlPoints.push(pnt);
			this.map.addOverlay(pnt);
			// debugger;
			DomUtils.addListener(element, 'mousedown', this.controlPointMouseDownHandler, this);
			//--mobile
			DomUtils.addListener(element, 'touchstart', this.controlPointMouseDownHandler, this);
		}
		//--fixdyj 赋值
		this._is_controlpoint_pointermove = (e) => {
			this.controlPointMouseMoveHandler(e);
		}
		//--fix dyj 在地图上无论怎么绑都无法触发。
		//--因为被map屏蔽了
		this.map.mapBrowserEventHandler_.addEventListener('pointermove', this._is_controlpoint_pointermove);

	};

	controlPointMouseDownHandler(e) {
		//--fix dyj屏蔽移动端上下滑动事件
		e.preventDefault();
		var id = e.target.id;
		this.activeControlPointId = id;
		DomUtils.addListener(e.target, 'mouseup', this.controlPointMouseUpHandler, this);
		DomUtils.addListener(e.target, 'touchend', this.controlPointMouseUpHandler, this);
	};

	controlPointMouseMoveHandler(e) {
		var coordinate = e.coordinate;
		if (this.activeControlPointId) {
			var plot = this.activePlot.getGeometry();
			var index = this.elementTable[this.activeControlPointId];
			plot.updatePoint(coordinate, index);
			var overlay = this.map.getOverlayById(this.activeControlPointId);
			overlay.setPosition(coordinate);
		}
	};

	controlPointMouseUpHandler(e) {
		this.activeControlPointId = null;
		DomUtils.removeListener(e.target, 'mouseup', this.controlPointMouseUpHandler, this);
		DomUtils.removeListener(e.target, 'touchend', this.controlPointMouseUpHandler, this);
	};

	activate(plot) {

		if (!plot || !(plot instanceof ol.Feature) || plot == this.activePlot) {
			return;
		}

		var geom = plot.getGeometry();
		if (!geom.isPlot || !geom.isPlot()) {
			return;
		}

		this.deactivate();

		this.activePlot = plot;
		//--fix dyj 开始既绑定feature的拖动事件
		this._ls_pointermove = connectEvent(this.map,"pointermove", this.plotMouseOverOutHandler,this);
		//--fix dyj 开始既绑定feature的拖动事件
		this._ls_pointerdown = connectEvent(this.map,'pointerdown',this.plotMouseDownHandler,this);

		this.initHelperDom();
		//
		this.initControlPoints();
		//--FIX dyj 这一贞无法拿到控制点元素的offsetWidth 和 offsetHeight。
		//--overLay刷新逻辑对于center-center布局有问题；
		//--故强制刷新一帧
		this.map.render();


		this.dispatchEvent(new FeatureEvent(FeatureEvent.ACTIVATE, this.activePlot));
	};

	getControlPoints() {
		if (!this.activePlot) {
			return [];
		}
		var geom = this.activePlot.getGeometry();
		return geom.getPoints();
	};
	/**
	 * @ignore
	 * pc端移动到feature上改变指针样式
	 */
	plotMouseOverOutHandler(e) {
		var feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
			return feature;
		});
		if (feature && feature == this.activePlot) {
			if (!this.mouseOver) {
				this.mouseOver = true;
				this.map.getViewport().style.cursor = 'move';
			}
		} else {
			if (this.mouseOver) {
				this.mouseOver = false;
				this.map.getViewport().style.cursor = 'default';
			}
		}
	};

	plotMouseDownHandler(e) {
		var feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
			return feature;
		});

		if (!feature || feature != this.activePlot)
			return;
		//--fix dyj 屏蔽浏览器上下滑动事件
		e.preventDefault();

		this.ghostControlPoints = this.getControlPoints();
		this.startPoint = e.coordinate;
		this.disableMapDragPan();
		this._ls_pointup = connectEvent(this.map,'pointerup', this.plotMouseUpHandler,this);
		this._ls_pointdrag = connectEvent(this.map,'pointerdrag', this.plotMouseMoveHandler,this);
	};

	plotMouseMoveHandler(e) {
		e.stopPropagation();
		e.preventDefault();
		var point = e.coordinate;
		var dx = point[0] - this.startPoint[0];
		var dy = point[1] - this.startPoint[1];
		var newPoints = [];
		for (var i = 0; i < this.ghostControlPoints.length; i++) {
			var p = this.ghostControlPoints[i];
			var coordinate = [p[0] + dx, p[1] + dy];
			newPoints.push(coordinate);
			var id = Constants.HELPER_CONTROL_POINT_DIV + '-' + i;
			var overlay = this.map.getOverlayById(id);
			overlay.setPosition(coordinate);
			overlay.setPositioning('center-center');
		}
		var plot = this.activePlot.getGeometry();
		plot.setPoints(newPoints);
	};

	plotMouseUpHandler(e) {
		this.enableMapDragPan();
		disconnectEvent(this.map,'pointerup', this._ls_pointup);
		disconnectEvent(this.map,'pointerdrag', this._ls_pointdrag);

		this._ls_pointup = null;
		this._ls_pointdrag = null;
	};

	disconnectEventHandlers() {
		disconnectEvent(this.map,'pointermove', this._ls_pointermove);
		disconnectEvent(this.map,'pointerdown', this._ls_pointerdown);
		disconnectEvent(this.map,'pointerup', this._ls_pointup);
		disconnectEvent(this.map,'pointerdrag', this._ls_pointdrag);
		this._ls_pointermove = null;
		this._ls_pointerdown = null;
		this._ls_pointup = null;
		this._ls_pointdrag = null;
		//--fix dyj;这个事件解绑比较特殊,必须判定。不然会移除所有的监听器。干坏map
		if(this._is_controlpoint_pointermove)
		{
		this.map.mapBrowserEventHandler_.removeEventListener('pointermove', this._is_controlpoint_pointermove);
			this._is_controlpoint_pointermove = null;
		}
	};

	deactivate() {
		let temp_plot = null;
		if (this.activePlot) {
			temp_plot = this.activePlot;
		}
		this.activePlot = null;
		this.mouseOver = false;
		this.destroyHelperDom();
		this.disconnectEventHandlers();
		this.elementTable = {};
		this.activeControlPointId = null;
		this.startPoint = null;

		if (temp_plot)
			this.dispatchEvent(new FeatureEvent(FeatureEvent.DEACTIVATE, temp_plot));
	};

	disableMapDragPan() {
		var interactions = this.map.getInteractions();
		var length = interactions.getLength();
		for (var i = 0; i < length; i++) {
			var item = interactions.item(i);
			if (item instanceof ol.interaction.DragPan) {
				this.mapDragPan = item;
				item.setActive(false);
				break;
			}
		}
	};

	enableMapDragPan() {
		if (this.mapDragPan != null) {
			this.mapDragPan.setActive(true);
			this.mapDragPan = null;
		}
	};
}