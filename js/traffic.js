// Load the Visualization API with all available charts
google.load('visualization', '1.1', { packages:['corechart'] });

google.setOnLoadCallback(function() { // Setup the CDN traffic page
    $(function() { var CDNtraffic = new Traffic(); });
});

/**
 * Traffic() object contains graphing methods
 * https://developers.google.com/chart/interactive/docs/gallery/columnchart
 */
var Traffic = function () {
    this.drawChart(); // Draw the google chart
};

Traffic.chartObject; // The google chart object
Traffic.chartObjectLocation; // The location chart object
Traffic.chartObjectRegion; // Region-based chart object
Traffic.chartObjectCountry; // Country chart object
Traffic.chartObjectTime; // Time-based chart object

Traffic.chartData; // The data table for the chart
Traffic.chartDataLocation; // The location data for the location chart
Traffic.chartDataRegion; // Region-based data for the region chart
Traffic.chartDataCountry; // Country data for the country chart
Traffic.chartDataTime; // Time-based data for the usage chart

Traffic.chartOptions = { // google API chart options
    title: 'Overall Usage Summary',
    titlePosition: 'out',
    legend: {position: 'out'},
    width: 700, height: 220,
    colors: ['#365162', '#5c5c5c', '#000000', '#d0232a'], // Blue-Gray bars, Black-Red annotations
    backgroundColor: {fill: '#eeeeee'},
    chartArea: {left: 60, top: 20, width: '76%', height: '72%'},
    vAxis: {title: 'Total GB & Price', titleTextStyle: {color: '#5c5c5c'}, textPosition: 'out', gridlines: {color: '#777', count: 8}},
    hAxis: {title: 'CDN Resource', titleTextStyle: {color: '#5c5c5c'}},
    series: {2: {type: 'line', lineWidth: 0, visibleInLegend: false}, 3: {type: 'line', lineWidth: 0, visibleInLegend: false}},
    seriesType: 'bars',
};
Traffic.chartOptionsLocation = { // Location, region, and country chart options
    width: 950, height: 300,
    colors: ['#365162', '#5c5c5c', '#000000', '#d0232a'], // Blue-Gray bars, Black-Red annotations
    backgroundColor: {fill: '#eeeeee'},
    chartArea: {left: 60, top: 15, width: '80%', height: '80%'},
    vAxis: {title: 'Total GB & Price', titleTextStyle: {color: '#5c5c5c'}, textPosition: 'out', gridlines: {color: '#777', count: 8}},
    hAxis: {title: 'null', titleTextStyle: {color: '#5c5c5c'}, textPosition: 'out'},
    series: {2: {type: 'line', lineWidth: 0, visibleInLegend: false}, 3: {type: 'line', lineWidth: 0, visibleInLegend: false}},
    seriesType: 'bars',
};
Traffic.chartOptionsTime = { // Time-based line chart options
    width: 950, height: 300,
    colors: ['#365162', '#d0232a'],
    backgroundColor: {fill: '#eeeeee'},
    chartArea: {left: 60, top: 15, width: '80%', height: '80%'},
    vAxis: {title: 'Total GB & Price', titleTextStyle: {color: '#5c5c5c'}, textPosition: 'out', gridlines: {color: '#777', count: 8}},
    hAxis: {title: 'Days back', titleTextStyle: {color: '#5c5c5c'}, textPosition: 'out'},
};

// Core of the callback function to ultimately draw the chart with supplied data
// Instantiate and create charts only if data is available
// Using ComboChart for overlaying hidden line plots with annotations
Traffic.prototype.drawChart = function () {
    $resource = document.getElementById('jsonResource');
    if ($resource) {
        Traffic.chartData = new google.visualization.DataTable($resource.innerHTML);
        Traffic.chartObject = new google.visualization.ComboChart(document.getElementById('jsonResource_div'));
        Traffic.chartObject.draw(Traffic.chartData, Traffic.chartOptions);
    }
    $resource = document.getElementById('jsonLocation');
    if ($resource) {
        Traffic.chartDataLocation = new google.visualization.DataTable($resource.innerHTML);
        Traffic.chartObjectLocation = new google.visualization.ComboChart(document.getElementById('jsonLocation_div'));
        Traffic.chartOptionsLocation.hAxis.title = document.getElementById('jsonLocationLabel').innerHTML;
        Traffic.chartObjectLocation.draw(Traffic.chartDataLocation, Traffic.chartOptionsLocation);
    }
    $resource = document.getElementById('jsonRegion');
    if ($resource) {
        Traffic.chartDataRegion = new google.visualization.DataTable($resource.innerHTML);
        Traffic.chartObjectRegion = new google.visualization.ComboChart(document.getElementById('jsonRegion_div'));
        Traffic.chartOptionsLocation.hAxis.title = document.getElementById('jsonRegionLabel').innerHTML;
        Traffic.chartObjectRegion.draw(Traffic.chartDataRegion, Traffic.chartOptionsLocation);
    }
    $resource = document.getElementById('jsonCountry');
    if ($resource) {
        Traffic.chartDataCountry = new google.visualization.DataTable($resource.innerHTML);
        Traffic.chartObjectCountry = new google.visualization.ComboChart(document.getElementById('jsonCountry_div'));
        Traffic.chartOptionsLocation.hAxis.title = document.getElementById('jsonCountryLabel').innerHTML;
        Traffic.chartObjectCountry.draw(Traffic.chartDataCountry, Traffic.chartOptionsLocation);
    }
    $resource = document.getElementById('jsonTime');
    if ($resource) {
        Traffic.chartDataTime = new google.visualization.DataTable($resource.innerHTML);
        Traffic.chartObjectTime = new google.visualization.LineChart(document.getElementById('jsonTime_div'));
        Traffic.chartOptionsTime.hAxis.title = document.getElementById('jsonTimeLabel').innerHTML;
        Traffic.chartObjectTime.draw(Traffic.chartDataTime, Traffic.chartOptionsTime);
    }
};