$(document).ready(function(){
    var geo = new GeoAdmin.API();
    geo.createMap({
        div: 'map',
        easting: 720000,
        northing: 90000,
        zoom: 5
    });
});