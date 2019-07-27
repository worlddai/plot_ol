/**
 * 动态标绘API PlotOL，基于OpenLayer6开发，旨在为基于开源GIS技术做项目开发提供标绘API。
 * 当前版本1.0，提供的功能：绘制基本标绘符号。
 * 具体用法请参考演示系统源码。
 * 
 * 参考作者博客：https://blog.csdn.net/gispace
 *
 * 开发者：@追逐丶
 * QQ号：576981389
 * 邮箱：576981389@qq.com
 * 博客：https://blog.csdn.net/qq_29722281 
 * */

var map;

var ol = POL.OL;

var center = ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857');

function init() {
    // 初始化地图，底图使用openstreetmap在线地图
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                //source: new ol.source.MapQuest({layer: 'sat'})
                source: new ol.source.Stamen({
                    layer: 'watercolor'
                })
            })
        ],
        view: new ol.View({
            center: center,
            zoom: 4
        })
    });

    document.getElementById('btn-delete').onclick = function () {
        g_pol_layer.removeFeature(window.g_op_feature);
    };

    window.g_pol_layer = new POL.PlottingLayer(map);

    g_pol_layer.on(POL.FeatureOperatorEvent.ACTIVATE, function (e) {
        window.g_op_feature = e.feature_operator;
        activeDelBtn();
    })
    g_pol_layer.on(POL.FeatureOperatorEvent.DEACTIVATE, function (e) {
        deactiveDelBtn();
    })
}



// 指定标绘类型，开始绘制。
function activate(type) {
    g_pol_layer.addPlot(type);
};

function showAbout() {
    document.getElementById("aboutContainer").style.visibility = "visible";
}

function hideAbout() {
    document.getElementById("aboutContainer").style.visibility = "hidden";
}

function get(domId){
    return document.getElementById(domId);
}


function activeDelBtn() {
    get('btn-delete').style.display = 'inline-block';
}

function deactiveDelBtn() {
    get('btn-delete').style.display = 'none';
}