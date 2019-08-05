import PlottingLayer from './PlottingLayer'
import Feature from '../ol/Feature'
import PlotFactory from './PlotFactory'
import PlotTypes from './PlotTypes'
import Constants from './Constants'

import * as ol from '../ol.js';
class TrackingLayer extends PlottingLayer {

	/**
	 * @classdesc 用来做轨迹图层的图层类。包含对轨迹的一些列操作。目前一个图层只能支持一条轨迹。后续可以提供拓展
	 * @author daiyujie
	 * @constructs
	 * @extends {PlottingLayer}
	 * @param {ol.Map} map 地图对象
	 * @param {Object} opts 初始化选项
	* @example <caption>创建轨迹图层，进行轨迹记录</caption>
	* //创建TrackingLay的工作可以由SEOL完成。逻辑也可在SEOL中封装
	* const trackingLayer = new TrackingLayer(map);
	* //加载轨迹标绘
	* trackingLayer.loadFromService('1735');
	* //加载完之后，可以在这个图层进行标绘操作。也可以不进行，随业务逻辑控制
	* trackingLayer.addFeature('polygon')
	* //切换轨迹标绘
	* trackingLayer.loadFromService('1738');
	* //绘制一个轨迹（新建对象之后，不要调用loadFromService,直接调用绘制逻辑）
	* //--开始轨迹
	* trackingLayer.beginTrack(30,120);
	* //--更新轨迹
	* trackingLayer.updateTrack(31,121);
	* //--结束轨迹
	* trackingLayer.endTrack();
	* //--保存到服务器
	* trackingLayer.saveToService('1735');
	* //--销毁对象
	* trackingLayer.destory();
	*/
	constructor(map, opts) {
		super(map, opts);
		this.isTracking = false;
		this.track_coordinates = [];
	}
	/**
	 * 创建标注点
	 * @ignore
	 * @param {Number} lat 
	 * @param {Number} lng 
	 * @param {Boolean} isBegin 是否是开始标注
	 */
	_createMarkers(lat, lng, isBegin) {
		const plot = PlotFactory.createPlot(PlotTypes.MARKER, [[lng, lat]]);
		const feature = new Feature(plot);
		feature.set(Constants.SE_DISABLED, true, true);
		const fo = this._addFeature(feature, 1);
		fo.attrs = {};
		fo.setStyle({
			"image": {
				"icon": {
					"src": isBegin ? "./images/marker-begin.png" : './images/marker-current.png',
					"anchor": [0.5, 1],
				}
			}
		});
		return fo;
	}
	/**
	 * 创建标绘线
	 * @ignore
	 * @param {Array<Array<Number>>} coordinates 
	 */
	_createLine(coordinates) {
		const plot = PlotFactory.createPlot(PlotTypes.POLYLINE, coordinates);
		const feature = new Feature(plot);
		feature.set(Constants.SE_DISABLED, true, true);
		const fo = this._addFeature(feature, 1);
		fo.attrs = {};
		return fo;
	}
	/**
	 * 开始轨迹记录
	 * @param {Number} lat 
	 * @param {Number} lng 
	 */
	beginTrack(lat, lng) {
		if (this.isTracking)
			return;
		this.isTracking = true;
		this.fo_begin_points = this._createMarkers(lat, lng, true);
		this.track_coordinates.push([lng, lat]);
	}
	/**
	 * 更新记录点
	 * @param {Number} lat 
	 * @param {Number} lng 
	 */
	updateTrack(lat, lng) {
		this.track_coordinates.push([lng, lat]);
		if (this.track_coordinates.length < 2)
			return;

		if (!this.fo_end_points)
			this.fo_end_points = this._createMarkers(lat, lng);
		this.fo_end_points.setCoordinates([[lng, lat]]);

		if (!this.fo_polyline) {
			this.fo_polyline = this._createLine(this.track_coordinates);
		}
		this.fo_polyline.setCoordinates(this.track_coordinates);
	}
	/**
	 * 结束轨迹记录
	 * @param {Number} lat 
	 * @param {Number} lng 
	 */
	endTrack() {
		this.isTracking = false;
	}
	/**
	 * 设置轨迹图层的属性
	 * @param {String} key 
	 * @param {Object} value 
	 */
	setAttribute(key, value) {
		if (!this.fo_polyline)
			return
		this.fo_polyline.setAttribute(key, value);
		return true;
	}
	/**
	 * 获取轨迹属性
	 * @param {String} key 
	 */
	getAttribute(key) {
		if (!this.fo_polyline)
			return null;
		return this.fo_polyline.getAttribute(key)
	}
	/**
	 * @override
	 */
	destory() {
		super.destory();
		this.isTracking = false;
		this.track_coordinates = [];
	}
}

export default TrackingLayer;