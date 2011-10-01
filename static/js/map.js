$(document).ready(function(){
    var api = new GeoAdmin.API({
        lang: 'en'
    });
    api.createMap({
        div: 'map',
        easting: 680000,
        northing: 210000,
        zoom: 5
    });
    api.map.addLayerByName('ch.swisstopo.vec25-wander');
    api.createSwissSearchCombo({
       width: 500,
       renderTo: 'box_search',
       ref: 'geoadmin'
    });
    api.createBaseLayerTool({
        renderTo: 'box_baselayer',
        label: 'Orthophoto',
        slider: {
            width: 170
        },
        combo: {
            width: 242
        }
    });
    api.createLayerTree({
        renderTo: 'box_layers',
        width: 285
    });
    
    var layer_kml = new OpenLayers.Layer.Vector('Swisstrains tracks', {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: 'feed/fetch_kml.php',
            format: new OpenLayers.Format.KML(),
            
        }),
        style: {
            strokeColor: "#ffff00",
            strokeWidth: 4,
            strokeOpacity: 0.75
        },
        projection: new OpenLayers.Projection('EPSG:4326')
    });
    api.map.addLayer(layer_kml);
});