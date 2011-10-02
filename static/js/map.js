$(document).ready(function(){
    var api = new GeoAdmin.API({
        lang: 'en'
    });
    api.createMap({
        div: 'map_canvas',
        easting: 680000,
        northing: 210000,
        zoom: 5
    });
    api.map.addLayerByName('ch.swisstopo.vec25-wander', {
        visibility: false
    });
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
        renderTo: 'box_layers'
    });
    
    var layer_kml_url = 'api/kml_layer_get.php';
    var layer_kml = new OpenLayers.Layer.GML('Tracks from FusionTables', layer_kml_url, {
        projection: new OpenLayers.Projection('EPSG:4326'),
        format: OpenLayers.Format.KML,
        style: {
            strokeColor: "#ffff00",
            strokeWidth: 4,
            strokeOpacity: 0.75
        },
    });
    api.map.addLayer(layer_kml);
    
    OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '4';
    var tracks_layer = new OpenLayers.Layer.Vector('Track in progress');
    api.map.addLayer(tracks_layer);
    
    var tracks_digitize_control = new OpenLayers.Control.DrawFeature(tracks_layer, OpenLayers.Handler.Path);
    api.map.addControl(tracks_digitize_control);
    
    var tracks_modify_control = new OpenLayers.Control.ModifyFeature(tracks_layer);
    api.map.addControl(tracks_modify_control);
    
    var feature_geometry = null;
    
    $('#feature_add').click(function(){
        $(this).attr('disabled', 'disabled');
        $('#feature_save_block').removeClass('hidden');
        $('#feature_cancel').removeClass('hidden');
        tracks_digitize_control.activate();
    });
    
    function edit_reset(){
        tracks_layer.removeAllFeatures();
        feature_geometry = null;
        $('#feature_name').val('');
        $('#feature_cancel').addClass('hidden');
        $('#feature_save_block').addClass('hidden');
        $('#feature_add').removeAttr('disabled');
    }
    
    var proj_wgs84 = new OpenLayers.Projection('EPSG:4326');
    $('#feature_save').click(function(){
        if ($('#feature_name').val() === '') {
            alert('Please name the track !');
            return;
        }
        
        var vxs = feature_geometry.getVertices();
        var vxs_wgs84 = [];
        $.each(vxs, function(i, vx){
            var vx_wgs84 = vx.transform(api.map.getProjectionObject(), proj_wgs84);
            vxs_wgs84.push(vx_wgs84.x.toFixed(6) + ',' + vx_wgs84.y.toFixed(6));
        });
        
        $.post('api/kml_layer_save.php', { 
            name: $('#feature_name').val(),
            points: vxs_wgs84.join(' ')
        });

        edit_reset();
        
        // 5 seconds should be enough for saving to FT
        setTimeout(function(){
            // From http://gis.stackexchange.com/questions/12647/how-to-dynamically-update-a-kml-layer-in-openlayers-2-10
            layer_kml.loaded = true;
            layer_kml.setVisibility(true);
            layer_kml.setUrl(layer_kml_url + '?_salt=' + Math.random());
        }, 5000);
    });
    
    $('#feature_cancel').click(function(){
        if (confirm('Are you sure ?')) {
            edit_reset();
        }
    });
    
    tracks_layer.events.on({
        sketchcomplete: function(ev){
            $('#feature_save').removeAttr('disabled');
            tracks_digitize_control.deactivate();
            tracks_modify_control.activate();
            feature_geometry = ev.feature.geometry;
        }
    });
});