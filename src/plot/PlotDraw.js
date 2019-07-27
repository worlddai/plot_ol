
import Observable from '../ol/Observable.js';
import * as ol from '../ol.js';
import PlotFactory from './PlotFactory'
import { distance } from './utils/plot_util'
import Constants from './Constants'
import FeatureEvent from './events/FeatureEvent'
export default class PlotDraw extends Observable {

	constructor(map) {
		super();
		this.points = null;
		this.plot = null;
		this.feature = null;
		this.plotType = null;
		this.plotParams = null;
		this.mapViewport = null;
		this.dblClickZoomInteraction = null;
		var stroke = new ol.style.Stroke({ color: '#FF0000', width: 2 });
		var fill = new ol.style.Fill({ color: 'rgba(0,255,0,0.4)' });
		this.style = new ol.style.Style({ fill: fill, stroke: stroke });
		this.featureSource = new ol.source.Vector();
		this.drawOverlay = new ol.layer.Vector({
			source: this.featureSource,
			// zIndex:999
		});
		this.drawOverlay.setStyle(this.style);
		this.setMap(map);
	}
	setMap(map) {
		this.map = map;
		this.mapViewport = this.map.getViewport();
	}
	activate(type, params) {
		this.deactivate();
		this.deactivateMapTools();
		this._ls_mapfirstclick = this.map.on("click", (e) => {
			this.mapFirstClickHandler(e);
		}).listener;
		this.plotType = type;
		this.plotParams = params;
		this.drawOverlay.setMap(this.map)
		// .addLayer();
	}
	deactivate() {
		this.disconnectEventHandlers();
		this.map.removeLayer(this.drawOverlay);
		this.featureSource.clear();
		this.points = [];
		this.plot = null;
		this.feature = null;
		this.plotType = null;
		this.plotParams = null;
		this.activateMapTools();
	}

	isDrawing() {
		return this.plotType != null;
	}
	mapFirstClickHandler(e) {
		this.points.push(e.coordinate);
		this.plot = PlotFactory.createPlot(this.plotType, this.points, this.plotParams);
		// this.plot = new LineString([[114.811935424807831,37.092847824096935],[120.811935424807831,45.092847824096935]])
		this.feature = new ol.Feature(this.plot);
		this.featureSource.addFeature(this.feature);
		this.map.un("click", this._ls_mapfirstclick);
		//
		if (this.plot.fixPointCount == this.plot.getPointCount()) {
			this.mapDoubleClickHandler(e);
			return;
		}
		//
		this._ls_mapNextClick = this.map.on("click", (e) => {
			this.mapNextClickHandler(e)
		}).listener;
		if (!this.plot.freehand) {
			this._ls_dbclick = this.map.on("dblclick", (e) => {
				this.mapDoubleClickHandler(e);
			}).listener;
		}
		this._ls_pointmove = this.map.on('pointermove', (e) => {
			this.mapMouseMoveHandler(e);
		}).listener;
		// goog.events.listen(this.mapViewport, P.Event.EventType.MOUSEMOVE,
		// 	this.mapMouseMoveHandler, false, this);
	}

	mapMouseMoveHandler(e) {
		var coordinate = e.coordinate;
		if (distance(coordinate, this.points[this.points.length - 1]) < Constants.ZERO_TOLERANCE)
			return;
		if (!this.plot.freehand) {
			var pnts = this.points.concat([coordinate]);
			this.plot.setPoints(pnts);
		} else {
			this.points.push(coordinate);
			this.plot.setPoints(this.points);
		}
	}

	mapNextClickHandler(e) {
		if (!this.plot.freehand) {
			if (distance(e.coordinate, this.points[this.points.length - 1]) < Constants.ZERO_TOLERANCE)
				return;
		}
		this.points.push(e.coordinate);
		this.plot.setPoints(this.points);
		if (this.plot.fixPointCount == this.plot.getPointCount()) {
			this.mapDoubleClickHandler(e);
			return;
		}
		if (this.plot && this.plot.freehand) {
			this.mapDoubleClickHandler(e);
		}
	}

	mapDoubleClickHandler(e) {
		this.disconnectEventHandlers();
		this.plot.finishDrawing();
		e.preventDefault();
		this.drawEnd();
	}

	disconnectEventHandlers() {
		this.map.un("click", this._ls_mapfirstclick);
		this.map.un("click", this._ls_mapNextClick);
		this.map.un('pointermove', this._ls_pointmove);
		// goog.events.unlisten(this.mapViewport, P.Event.EventType.MOUSEMOVE,
		// 	this.mapMouseMoveHandler, false, this);
		this.map.un("dblclick", this._ls_dbclick);
	}

	drawEnd(feature) {
		this.featureSource.removeFeature(this.feature);
		this.activateMapTools();
		this.disconnectEventHandlers();
		this.map.removeOverlay(this.drawOverlay);
		this.points = [];
		this.plot = null;
		this.plotType = null;
		this.plotParams = null;
		this.dispatchEvent(new FeatureEvent(FeatureEvent.DRAW_END, this.feature));
		this.feature = null;
	}

	deactivateMapTools() {
		var interactions = this.map.getInteractions();
		var length = interactions.getLength();
		for (var i = 0; i < length; i++) {
			var item = interactions.item(i);
			if (item instanceof ol.interaction.DoubleClickZoom) {
				this.dblClickZoomInteraction = item;
				interactions.remove(item);
				break;
			}
		}
	}

	activateMapTools() {
		if (this.dblClickZoomInteraction != null) {
			this.map.getInteractions().push(this.dblClickZoomInteraction);
			this.dblClickZoomInteraction = null;
		}
	}

}