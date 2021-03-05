
let mymap = L.map('mapid').setView([38.8283, -98.5795], 4.5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmVyZW5pY2UtZHMiLCJhIjoiY2trN2txN3YzMDJjZDJvbzdnNnQ1azd0OSJ9.R0DgOZ9y2CVzBHjau0grvw'
}).addTo(mymap);

//Load geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var geojson;

// Grab data with d3
d3.json(geoData, function(data) {

  // This function style data according to magnitud
  function styleInfo(feature) {
    return {
      
      fillColor: getColor(feature.properties.mag),
      color: "#F7FDFE",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
      opacity: 1,
      fillOpacity: 1
    };
  }

  // Function for marker's color depending on the magnitude
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#E02A0E";
      case magnitude > 4:
        return "#FF7038";
      case magnitude > 3:
        return "#FFBC38";
      case magnitude > 2:
          return "#FFEA38";
      case magnitude > 1:
        return "#EFF534";
      default:
        return "#DCDCDC";
    }
  }

  //Determining the circle radius and preventing errors with null values 
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 0.2;
    }
    return magnitude * 5;
  }

  //Adding our data to the map
  L.geoJson(data, {
  // Adding circle markers 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
  // Adding pop-up to provide more details about the earthquakes
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Place : " + feature.properties.place + "<br>Magnitude: "+feature.properties.mag);
    }
  }).addTo(mymap);})

  //Set up legend for the magnitude ranges
  let legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let magnitudes = [0, 1, 2, 3, 4, 5];
    let colors = ["#DCDCDC", "#EFF534", "#FFEA38", "#FFBC38", "#FF7038", "#E02A0E"];

    
    for (var x = 0; x < magnitudes.length; x++) {
      div.innerHTML +=
        "<li style=\"background-color: " + colors[x] + "\"></li> " +
        magnitudes[x] + (magnitudes[x + 1] ? "&ndash;" + magnitudes[x + 1] + "<br>" : "&ndash;");
    }
    return div;
  };
  legend.addTo(mymap);

