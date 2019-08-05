
import Observable from '../ol/Observable.js';
import Feature from '../ol/Feature'
import Overlay from '../ol/Overlay'
import PlotDraw from './PlotDraw'
import PlotEdit from './PlotEdit'
import FeatureEvent from './events/FeatureEvent'
import FeatureOperatorEvent from './events/FeatureOperatorEvent'
import DrawEvent from './events/DrawEvent'
import FeatureOperator from './core/FeatureOperator'
import PlotFactory from './PlotFactory'
import Constants from './Constants'
import { combineOpts, deepcopy } from '../util/core'
import * as ArrTools from '../util/array'
import Ajax from '../util/seieajax';

import * as ol from '../ol.js';
class PlottingLayer extends Observable {

	/**
	 * @classdesc 标绘主图层封装。后续可以有多个对象。目前就中心而言应该就一个对象
	 * 与SEIE标绘服务进行对接，加载标绘服务，编辑标绘图元，保存标绘属性。是暴露出的唯一一个类。
	 * @author daiyujie
	 * @extends {ol.Observable}
	 * @constructs
	 * @param {ol.Map} map 地图对象
	 * @param {Object} opts 初始化选项
	 * @example <caption>加载标绘，绘制标绘，保存标绘</caption>
	* //创建TrackingLay的工作可以由SEOL完成。逻辑也可在SEOL中封装
	* const plottingLayer = new PlottingLayer(map);
	* //--从服务器加载标绘
	* plottingLayer.loadFromService('1735');
	* //--绘制标绘
	* plottingLayer.addFeature('polygon');
	* //--监听绘制事件，从中取到FeatureOperator对象。进行一些操作
	* plottingLayer.on('activate_feature', function (e) {
		*     window.fo = e.feature_operator;
		*     //--TODO
		* })
		* plottingLayer.on('deactivate_feature', function (e) {
		*     window.fo = null;
		*     //--TODO
		* })
	* //--设置选中图元样式
	* fo.setStyle({"fill":{"color":"rgba(0,255,0,0.4)"},"stroke":{"color":"#FF0000","width":2}})
	* //--设置属性
	* fo.setAttribute('hellow','i am free');
	* //--其余操作参考FeatureOperator类
	*
	* //--设置层级等关联操作通过PlottingLayer对象完成
	* //--上移图元
	* plottingLayer.moveDown(fo);
	* //--其余操作参照api
	* //--保存所有图元至服务器
	* plottingLayer.saveToService('1735');
	 */
	constructor(map, opts) {
		super();
		/**
         * map对象
         * @type {ol.Map}
         */
		this.map = map;

		/**
         * 默认配置
		 * @ignore
         * @type {Object}
         */
		this.defaults = {

		}
		/**
         * 合并配置
		 * @ignore
         * @type {Object}
         */
		this.opts = {};
		/**
         * 当前图层的所有图元操作对象
         * @type {Array<FeatureOperator>}
         */
		this.feature_operators = [];
		/**
         * 主显示图层
         * @type {ol.layer.SourceLayer}
         */
		this.showLayer = null;
		/**
         * 编辑工具类对象
         * @type {PlotEdit}
         */
		this.plotEdit = null;
		/**
         * 绘制工具类对象
         * @type {PlotDraw}
         */
		this.plotDraw = null;

		/**
         * 绘制提示图层
         * @type {ol.Overlay}
         */
		this.help_overlay = null;
		/**
         * 绘制提示图层元素。用以设置提示内容
         * @type {Element}
         */
		this.help_overlay_ele = null;

		/**
         * map绑定的事件钩子
		 * @ignore
         * @type {Function}
         */
		this._ls_mapclick = null;
		//--合并地图选项
		combineOpts(this.opts, this.defaults, opts)
		//--创建layer
		this.showLayer = this._createShowLayer();
		//--创建编辑对象
		this.plotEdit = new PlotEdit(map);
		//--创建绘制对象
		this.plotDraw = new PlotDraw(map);
		//--绑定地图事件
		this._bindListener();
	}
	/**
	 * @ignore
	 * 绑定地图事件
	 */
	_bindListener() {
		this.plotDraw.on(FeatureEvent.DRAW_END, (e) => {
			this._onDrawEnd(e)
		})
		//--试用移动端手势点击
		this.plotDraw.on(DrawEvent.ADD_CONTROL_POINT, (e) => {
			if (!this.help_overlay) {
				this._createHelpOverlay();
			}
			this._setHelpOverlayState(e.drawstate);
		})
		//--试用pc端
		this.plotDraw.on(DrawEvent.ADDING_MOUSE_MOVE, (e) => {
			if (!this.help_overlay) {
				this._createHelpOverlay();
			}
			this._setHelpOverlayState(e.drawstate);
		})
		this.plotEdit.on(FeatureEvent.ACTIVATE, (e) => {
			this.dispatchEvent(new FeatureOperatorEvent(FeatureOperatorEvent.ACTIVATE, this._getFeatureOperator(e.feature, this.showLayer)));
		})
		this.plotEdit.on(FeatureEvent.DEACTIVATE, (e) => {
			this.dispatchEvent(new FeatureOperatorEvent(FeatureOperatorEvent.DEACTIVATE, this._getFeatureOperator(e.feature, this.showLayer)));
		})
		this._ls_mapclick = this.map.on('click', (e) => {
			if (!this.plotDraw || this.plotDraw.isDrawing()) {
				return;
			}
			const feature = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				return feature;
			});


			if (feature && !feature.get(Constants.SE_DISABLED)) {
				// 开始编辑
				this.plotEdit.activate(feature);

			} else {
				// 结束编辑
				this.plotEdit.deactivate();
			}
		}).listener
	}
	/**
	 * @ignore
	 * 移除地图绑定事件
	 */
	_unbindListener() {
		this.plotDraw.un([DrawEvent.ADD_CONTROL_POINT, DrawEvent.ADDING_MOUSE_MOVE, FeatureEvent.DRAW_END])
		this.plotEdit.un([FeatureEvent.ACTIVATE, FeatureEvent.DEACTIVATE])
		if (this._ls_mapclick) {
			this.map.un('click', this._ls_mapclick)
			this._ls_mapclick = null;
		}

	}
	/**
	 * @ignore
	 * 创建绘制提示图层
	 */
	_createHelpOverlay() {
		if (this.help_overlay_ele) {
			this.help_overlay_ele.parentNode.removeChild(this.help_overlay_ele);
		}
		this.help_overlay_ele = document.createElement('div');
		this.help_overlay_ele.className = 'tooltip hidden se-tooltip';
		this.help_overlay = new Overlay({
			element: this.help_overlay_ele,
			offset: [15, 0],
			positioning: 'center-left'
		});
		this.map.addOverlay(this.help_overlay);
	}
	/**
	 * @ignore
	 * 移除绘制提示图层
	 */
	_removeHelpOverlay() {
		if (this.help_overlay_ele) {
			this.help_overlay_ele.parentNode.removeChild(this.help_overlay_ele);
			this.help_overlay_ele = null;
		}

		if (this.help_overlay) {
			this.map.removeOverlay(this.help_overlay);
			this.help_overlay = null;
		}
	}
	/**
	 * @ignore
	 * 创建layer
	 */
	_createShowLayer() {

		const showlayer = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		// showlayer.setStyle(drawStyle);
		showlayer.setMap(this.map);
		return showlayer
	}
	/**
	 * @ignore
	 */
	_onDrawEnd(event) {
		const feature = event.feature;

		this._removeHelpOverlay();

		this._addFeature(feature);
		// 开始编辑
		this.plotEdit.activate(feature);
	}
	_setHelpOverlayState(drawstate) {
		if (!this.help_overlay_ele)
			return;
		const freehandmsg = '当前随意绘制。单击结束';
		const msg1 = !drawstate.total ? '当前图元控制点无限制，' : `图元共${drawstate.total}个控制点，`
		const msg2 = `当前是第${drawstate.current}个,`;
		const msg3 = !drawstate.total ? '双击结束绘制' : '点击继续绘制。';
		this.help_overlay_ele.innerHTML = drawstate.freehand ? freehandmsg : msg1 + msg2 + msg3;
		this.help_overlay.setPosition(drawstate.position)
	}
	/**
	 * @ignore
	 * 添加图元
	 */
	_addFeature(feature, zindex) {
		const fo = this._getFeatureOperator(feature, this.showLayer, zindex || this.feature_operators.length + 1);
		this.feature_operators.push(fo)
		return fo;
	}
	/**
	 * @ignore
	 * 按照zindex排序图元操作对象数组
	 */
	_sortByZindex() {
		this.feature_operators.sort((a, b) => {
			return a.feature.getStyle().zIndex - b.feature.getStyle().zIndex;
		})
	}
	/**
	 * @ignore
	 * 获取某个人图元操作对象位置
	 */
	_getFeatureOperatorIndex(feature_operator) {
		for (let i = 0; i < this.feature_operators.length; i++) {
			if (feature_operator.guid == this.feature_operators[i].guid) {
				return i;
			}
		}
	}
	/**
	 * @ignore
	 * 重新计算图元index
	 */
	_resetZIndex() {
		this.feature_operators.map((f, i) => {
			const style = f.feature.getStyle().clone();
			style.setZIndex(i + 1);
			f.feature.setStyle(style);
		})
	}
	/**
	 * @ignore
	 * 获取已有图元操作对象或者新建一个
	 */
	_getFeatureOperator(feature, vectorlayer, zindex) {

		for (let i = 0; i < this.feature_operators.length; i++) {
			const fo = this.feature_operators[i];
			if (fo.feature == feature)
				return fo;
		}
		return new FeatureOperator(feature, vectorlayer, zindex);
	}
	/**
	 * @param {Number} service_id 需要加载的标绘服务id
	 * @param {Function} callback 加载成功的回调
	 * @param {Function} error 加载失败的回调
	 * 从服务器加载一个标绘服务 
	 */
	loadFromService(service_id, callback, error) {

		if (!service_id) {
			error();
			return;
		}
		//--清除所有图元
		// this.clearFeatures();

		// Ajax.getPlottingService(service_id, null, (res_service) => {
		// 	const query_params = {
		// 		service_id: service_id,
		// 		projection: res_service.projection
		// 	}
		// 	Ajax.queryPlottingData(query_params, (res) => {
		// 		if (!res.item_list || !res.item_list.length)
		// 			return;
		// 		res.item_list.map((item) => {
		// 			if (!item.config.cresda_flag) {
		// 				console.error('不支持非中心sdk标绘（openlayer）之外的标绘图元。')
		// 				return undefined;
		// 			}
		// 			const plot = PlotFactory.createPlot(item.plotting_type, item.geo_data.coordinates);
		// 			const feature = new Feature(plot);
		// 			const fo = this._addFeature(feature, item.config.z_index);
		// 			fo.attrs = deepcopy(item.ext_attr);
		// 			fo.setStyle(item.style);
		// 		})
		// 		if (callback && typeof callback == 'function')
		// 			callback();
		// 	}, error)
		// }, (e) => {
		// 	console.error('加载标绘服务失败！')
		// 	error();
		// })
	}
	/**
	 * @param {Number} service_id 需要保存的标绘服务id
	 * @param {Function} callback 保存成功的回调
	 * @param {Function} error 保存失败的回调
	 * 保存标绘服务到服务器
	 */
	saveToService(service_id, callback, error) {
		if (!service_id) {
			error();
			return;
		}
		// Ajax.clearPlottingServiceData(service_id, () => {
		// 	const promises = [];
		// 	this.feature_operators.map((fo) => {
		// 		const d = fo.serialize();
		// 		d.service_id = service_id;
		// 		promises.push(new Promise((resove, reject) => {
		// 			Ajax.createPlottingData(d, (r) => {
		// 				resove();
		// 			}, () => {
		// 				reject('保存图元' + fo.getName() + '失败！')
		// 			})
		// 		}))

		// 	})
		// 	Promise.all(promises).then(() => {
		// 		if (callback && typeof callback == 'function')
		// 			callback(service_id);
		// 	}).catch(e => {
		// 		if (error && typeof error == 'function')
		// 			error(e);
		// 	})
		// })
	}
	/**
	 * @param {Number} type 类型
	 * 添加一个标绘绘制图元
	 */
	addFeature(type) {
		this.plotDraw.activate(type);
	}
	/**
	 * @param {FeatureOperator} feature_operator 对象
	 * 移除一个图元操作对象
	 */
	removeFeature(feature_operator) {
		this.showLayer.getSource().removeFeature(feature_operator.feature);
		this.plotEdit.deactivate();
		const curIndex = this._getFeatureOperatorIndex(feature_operator);
		feature_operator.destory();
		this.feature_operators.splice(curIndex, 1);
		this._sortByZindex();
		this._resetZIndex();
	}
	/**
     * 清空图元
     */
	clearFeatures(callback) {
		this.plotEdit.deactivate();
		this.feature_operators.map((fo) => {
			this.showLayer.getSource().removeFeature(fo.feature);
			fo.destory();
		}, this)

		this.feature_operators.splice(0, this.feature_operators.length);
		return this;
	}

	/**
	 * @param {FeatureOperator} feature_operator 对象
	 * 上移一个图元
	 */
	moveUp(feature_operator) {
		this._sortByZindex();
		const curIndex = this._getFeatureOperatorIndex(feature_operator);
		ArrTools.moveUp(this.feature_operators, curIndex);
		this._resetZIndex();
	}
	/**
	 * @param {FeatureOperator} feature_operator 对象
	 * 下移一个图元
	 */
	moveDown(feature_operator) {
		this._sortByZindex();
		const curIndex = this._getFeatureOperatorIndex(feature_operator);
		ArrTools.moveDown(this.feature_operators, curIndex);
		this._resetZIndex();
	}
	/**
	 * @param {FeatureOperator} feature_operator 对象
	 * 置顶一个图元
	 */
	setToTop(feature_operator) {
		this._sortByZindex();
		const curIndex = this._getFeatureOperatorIndex(feature_operator);
		ArrTools.moveToTop(this.feature_operators, curIndex);
		this._resetZIndex();
	}
	/**
	 * @param {FeatureOperator} feature_operator 对象
	 * 置底一个图元
	 */
	setToBottom(feature_operator) {
		this._sortByZindex();
		const curIndex = this._getFeatureOperatorIndex(feature_operator);
		ArrTools.moveToBottom(this.feature_operators, curIndex);
		this._resetZIndex();
	}
	destory() {
		//--清空图元
		this.clearFeatures();
		//--移除map
		this.showLayer.setMap(null);
		this.showLayer = null;
		//--解绑事件
		this._unbindListener();
		//--移除编辑工具对象
		this.plotEdit.deactivate();
		this.plotEdit = null;
		//--移除绘制工具对象
		this.plotDraw.deactivate();
		this.plotEdit = null;
		//--移除帮助overlay
		this.map.removeOverlay(this.help_overlay);
		this.help_overlay = null;
		this.help_overlay_ele = null;
		this.map = null;
	}
}

export default PlottingLayer;