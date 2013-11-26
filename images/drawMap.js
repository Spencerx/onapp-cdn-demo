

var colours = [ "#925C3A", "#C8AB67", "#93644A", "#AA805A", "#8D725F", "#BE8045", "#8e5a37", "#966542", "#956549", "#9e6538", "#8f6f58", "#9a795b", "#ad7844", "#a77c52", "#b9793c", "#b68048", "#bf8241", "#ad895c", "#b48d55", "#c59b53", "#be9e5d", "#c8aa5f" ];

max = 0;
for( var i = 0; i < CDNdata.length; i++ ) {
    if( max < CDNdata[i].cached+CDNdata[i].direct ) max = CDNdata[i].cached+CDNdata[i].direct;
}

var images = [];
if( max > 0 ) {
    for( var i = 0; i < CDNdata.length; i++ ) {
        total = CDNdata[i].cached+CDNdata[i].direct+0.000001;

        p = ''+Math.floor((1-CDNdata[i].cached/total)*20+0.5);
        if( p.length < 2 ) p = '0'+p;

        var image = { 
            imageURL: "../images/pie"+p+".png",
            latitude: CDNdata[i].latitude,
            longitude: CDNdata[i].longitude,
            title: CDNdata[i].description,
            balloonText: CDNdata[i].pop + ": served " + Math.round(total*100)/100 + "Gb (" + Math.floor(CDNdata[i].cached/total*100+0.5) + "%)",
            width: Math.sqrt(total/max) * 80 + 5,
            height: Math.sqrt(total/max) * 80 + 5,
            zoomLevel: 5
        }
        images.push( image );
    }
}

images.sort(function(a,b){return b["width"]-a["width"]});

var map;
var worldDataProvider;

function mapGoTo( location ) {
    map.zoomToGroup( location );
}

AmCharts.ready(function() {
    // create AmMap object
    map = new AmCharts.AmMap();
    // set path to images
    map.pathToImages = "../images/ammap/images/";

    var mapData = AmCharts.maps.continentsLow;
    mapData.svg.g.path = mapData.svg.g.path.concat( AmCharts.maps.worldLow.svg.g.path );

    var areas = [];
    for( var i in AmCharts.maps.continentsLow.svg.g.path ) {
        // continents
        var area = { id: AmCharts.maps.continentsLow.svg.g.path[i].id };
        area.groupId = area.id;
        area.alpha = 0;
        area.color = '#9a795b';
        if( i == 3 || i == 5 ) area.color = "#b48d55";
        areas.push( area );
    }
    for( var i in AmCharts.maps.worldLow.svg.g.path ) {
        // countries
        var area = { id: AmCharts.maps.worldLow.svg.g.path[i].id };
        area.color = colours[Math.floor( Math.random()*colours.length)];
        area.selectedColor = area.color;
        area.passZoomValuesToTarget = true;
        areas.push( area );
    }
    worldDataProvider = {
        mapVar: mapData,
        images: images,
        areas: areas,
        getAreasFromMap: true,
    };

    map.areasSettings = {
        autoZoom: true,
        outlineColor: "#aaaaaa",
        rollOverOutlineColor: "#dddddd",
    };

    map.imagesSettings = {
        autoZoom: true,
        scale: 1,
        selectedScale: 1,
        centered: true,
        //descriptionWindowWidth: 217,
        // descriptionWindowHeight: 60,
        //descriptionWindowX: 230,
        //descriptionWindowY: 119
    };

    map.dataProvider = worldDataProvider;
    map.write("themap");
});