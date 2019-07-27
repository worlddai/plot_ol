
import * as ol from '../ol';
import Constants from './Constants'
import * as DomUtils from '../util/dom_util';
import FeatureEvent from './events/FeatureEvent'
export default class PlotEdit extends ol.Observable {


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
					DomUtils.removeListener(element, 'mousemove', this.controlPointMouseMoveHandler2, this);
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
				element: element
			});
			this.controlPoints.push(pnt);
			this.map.addOverlay(pnt);
			DomUtils.addListener(element, 'mousedown', this.controlPointMouseDownHandler, this);
			DomUtils.addListener(element, 'mousemove', this.controlPointMouseMoveHandler2, this);

		}
	};

	controlPointMouseMoveHandler2(e) {
		e.stopImmediatePropagation();
	};

	controlPointMouseDownHandler(e) {
		var id = e.target.id;
		this.activeControlPointId = id;

		if (this._is_controlpoint_pointermove)
			this.map.un('pointermove',this._is_controlpoint_pointermove)

		this._is_controlpoint_pointermove = this.map.on('pointermove', (e) => {
			this.controlPointMouseMoveHandler(e);
		}).listener

		DomUtils.addListener(e.target, 'mouseup', this.controlPointMouseUpHandler, this);
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
		this.map.un('pointermove', this._is_controlpoint_pointermove)
		// this.map.un('pointerup', this._is_controlpoint_pointerup)

		DomUtils.removeListener(e.target, 'mouseup', this.controlPointMouseUpHandler, this);

	};

	activate(plot) {

		if (!plot || !(plot instanceof ol.Feature) || plot == this.activePlot) {
			return;
		}

		var geom = plot.getGeometry();
		if (!geom.isPlot()) {
			return;
		}

		this.deactivate();

		this.activePlot = plot;
		//
		this._ls_pointermove = this.map.on("pointermove", (e) => {
			this.plotMouseOverOutHandler(e)
		}).listener;

		this.initHelperDom();
		//
		this.initControlPoints();
		//--FIX dyj 这一贞无法拿到控制点元素的offsetWidth 和 offsetHeight。
		//--overLay刷新逻辑对于center-center布局有问题；
		//--故强制刷新一帧
		this.map.render();

		
		this.dispatchEvent(new FeatureEvent(FeatureEvent.ACTIVATE,this.activePlot));
	};

	getControlPoints() {
		if (!this.activePlot) {
			return [];
		}
		var geom = this.activePlot.getGeometry();
		return geom.getPoints();
	};

	plotMouseOverOutHandler(e) {
		var feature = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
			return feature;
		});
		if (feature && feature == this.activePlot) {
			if (!this.mouseOver) {
				this.mouseOver = true;
				this.map.getViewport().style.cursor = 'move';
				this._ls_pointerdown = this.map.on('pointerdown', (e) => {
					this.plotMouseDownHandler(e)
				}).listener;
			}
		} else {
			if (this.mouseOver) {
				this.mouseOver = false;
				this.map.getViewport().style.cursor = 'default';
				this.map.un('pointerdown', this._ls_pointerdown);
			}
		}
	};

	plotMouseDownHandler(e) {
		this.ghostControlPoints = this.getControlPoints();
		this.startPoint = e.coordinate;
		this.disableMapDragPan();
		this._ls_pointup = this.map.on('pointerup', (e) => {
			this.plotMouseUpHandler(e);
		}).listener;
		this._ls_pointdrag = this.map.on('pointerdrag', (e) => {
			this.plotMouseMoveHandler(e);
		}).listener;
	};

	plotMouseMoveHandler(e) {
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
		this.map.un('pointerup', this._ls_pointup);
		this.map.un('pointerdrag', this._ls_pointdrag);
	};

	disconnectEventHandlers() {
		this.map.un('pointermove', this._ls_pointermove);
		this.map.un('pointermove', this._is_controlpoint_pointermove)
		// this.map.un('pointerup', this._is_controlpoint_pointerup)
		this.map.un('pointerdown', this._ls_pointerdown);
		this.map.un('pointerup', this._ls_pointup);
		this.map.un('pointerdrag', this._ls_pointdrag);
	};

	deactivate() {
		let temp_plot =  null;
		if(this.activePlot)
		{
			temp_plot = this.activePlot;
		}
		this.activePlot = null;
		this.mouseOver = false;
		this.destroyHelperDom();
		this.disconnectEventHandlers();
		this.elementTable = {};
		this.activeControlPointId = null;
		this.startPoint = null;

		if(temp_plot)
			this.dispatchEvent(new FeatureEvent(FeatureEvent.DEACTIVATE,temp_plot));
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





