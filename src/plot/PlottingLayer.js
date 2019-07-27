
import Observable from '../ol/Observable.js';
import PlotDraw from './PlotDraw'
import PlotEdit from './PlotEdit'
import FeatureEvent from './events/FeatureEvent'
import FeatureOperatorEvent from './events/FeatureOperatorEvent'
import FeatureOperator from './core/FeatureOperator'

import * as ol from '../ol.js';
export default class PlottingLayer extends Observable {

	constructor(map) {
		super();
		this.map = map;
		// 设置标绘符号显示的默认样式
		this.showLayer = this._createShowLayer();
		this.plotEdit = new PlotEdit(map);
		this.plotDraw = new PlotDraw(map);
		this._bindListener();
	}
	_bindListener() {
		this.plotDraw.on(FeatureEvent.DRAW_END, (e) => {
			this._onDrawEnd(e)
		})
		this.plotEdit.on(FeatureEvent.ACTIVATE, (e) => {
			this.dispatchEvent(new FeatureOperatorEvent(FeatureOperatorEvent.ACTIVATE, this.getFeatureOperator(e.feature, this.showLayer)));
		})
		this.plotEdit.on(FeatureEvent.DEACTIVATE, (e) => {
			this.dispatchEvent(new FeatureOperatorEvent(FeatureOperatorEvent.DEACTIVATE, this.getFeatureOperator(e.feature, this.showLayer)));
		})
		this.map.on('click', (e) => {
			if (!this.plotDraw || this.plotDraw.isDrawing()) {
				return;
			}
			const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				return feature;
			});
			if (feature) {
				// 开始编辑
				this.plotEdit.activate(feature);

			} else {
				// 结束编辑
				this.plotEdit.deactivate();
			}
		})
	}
	_createShowLayer() {
		// 设置标绘符号显示的默认样式
		const stroke = new ol.style.Stroke({
			color: '#FF0000',
			width: 2
		});
		const fill = new ol.style.Fill({ color: 'rgba(0,255,0,0.4)' });
		const image = new ol.style.Circle({ fill: fill, stroke: stroke, radius: 8 });
		const drawStyle = new ol.style.Style({ image: image, fill: fill, stroke: stroke });

		// 绘制好的标绘符号，添加到FeatureOverlay显示。
		const showlayer = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		showlayer.setStyle(drawStyle);
		showlayer.setMap(this.map);
		return showlayer
	}
	_onDrawEnd(event) {
		const feature = event.feature;
		this.showLayer.getSource().addFeature(feature);
		// 开始编辑
		this.plotEdit.activate(feature);
		// activeDelBtn();
	}
	getFeatureOperator(feature, vectorlayer) {
		return new FeatureOperator(feature, vectorlayer);
	}

	loadFromService(service_id) {

	}
	saveToService(service_id) {

	}
	addPlot(type, params) {
		this.plotDraw.activate(type, params);
	}
	removeFeature(feature_operator) {
		this.showLayer.getSource().removeFeature(feature_operator.feature);
		this.plotEdit.deactivate();
	}
	setAttribute(poltid, attr) {

	}
}