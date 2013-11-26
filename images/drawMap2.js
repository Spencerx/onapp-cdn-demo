var map;

AmCharts.ready(function() {
    map = new AmCharts.AmMap();
    map.pathToImages = "http://www.ammap.com/lib/3/images/";
    //map.panEventsEnabled = true; // this line enables pinch-zooming and dragging on touch devices
    map.balloon.color = "#000000";

    var dataProvider = {
        mapVar: AmCharts.maps.worldLow,
        getAreasFromMap: true
    };

    map.dataProvider = dataProvider;

    map.areasSettings = {
        autoZoom: true,
        selectedColor: "#CC0000"
    };

    map.smallMap = new AmCharts.SmallMap();

    map.write("themap");

});