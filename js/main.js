var map =  L.map('map').setView([15, -15], 2
); 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
console.log("Map1 initialized");


// Function to scale circle radius by magnitude
function getRadius(mag) {
  // Linear scaling with multiplier
  return (mag - 7.5) * 10; // subtract baseline 7.5 to exaggerate differences
  // Example: mag 8 → (8-7.5)*10 = 5
  //          mag 9 → (9-7.5)*10 = 15
}

// Load USGS GeoJSON
fetch("data/eqpacific.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: getRadius(feature.properties.mag),
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          fillOpacity: 0.7
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`
          <strong>${feature.properties.place}</strong><br>
          Magnitude: ${feature.properties.mag}<br>
          Depth: ${feature.geometry.coordinates[2]} km
        `);
      }
    }).addTo(map);
    
// Add legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML = "<strong>Magnitude</strong><br>";

  // Example magnitudes for legend circles
  var mags = [8, 8.5, 9, 9.5];
  var fillColor = "#ff7800"; // your circleMarker fill color

  mags.forEach(function(mag) {
    var radius = getRadius(mag);
    // Create a circle using inline <i> styled with width/height
    div.innerHTML +=
      '<i style="background:' + fillColor + 
      '; width:' + (radius*2) + 'px; height:' + (radius*2) + 'px; display: inline-block; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></i>' +
      mag + '<br>';
  });

  return div;
};

legend.addTo(map);
  })

  .catch(error => console.error("Error loading GeoJSON:", error));

// Map 2
var map2 = L.map('map2').setView([15, -15], 2);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map2);

Promise.all([
  fetch("data/tectonicbound.geojson").then(res => res.json()),
  fetch("data/eqpacific.geojson").then(res => res.json())
])
.then(([polygonsGeoJSON, earthquakesGeoJSON]) => {

  // Aggregate earthquake data per polygon
  polygonsGeoJSON.features.forEach(poly => {
    if (poly.geometry && (poly.geometry.type === "Polygon" || poly.geometry.type === "MultiPolygon")) {
      let ptsWithin = turf.pointsWithinPolygon(earthquakesGeoJSON, poly);
      poly.properties.count = ptsWithin.features.length;
      poly.properties.maxMag = ptsWithin.features.length
        ? Math.max(...ptsWithin.features.map(f => f.properties.mag))
        : 0;
    } else {
      poly.properties.count = 0;
      poly.properties.maxMag = 0;
    }
  
  });

  // Add choropleth layer
var choroplethLayer = L.geoJSON(polygonsGeoJSON, {
  style: function(feature) {
    let count = feature.properties.count;
    return {
      fillColor: count > 13 ? '#5c011c' :
                 count >= 8 ? '#d3173c' :
                 count >= 4 ? '#e15c04' :
                 count >= 1 ? '#f6d014' :
                              '#FFEDA0',
      weight: 1,
      color: 'black',
      fillOpacity: 0.7
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(`
      <strong>${feature.properties.PlateName || "Plate"}</strong><br>
      M8+ Earthquakes: ${feature.properties.count}<br>
      Max Magnitude: ${feature.properties.maxMag}
    `);
  }
}).addTo(map2);   


// Legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

    // Define thresholds to match choropleth
    var grades = [0, 1, 4, 8, 14]; 
    var colors = ['#FFEDA0', '#f6d014', '#e15c04', '#d3173c', '#5c011c'];

    // Build labels
    var labels = [];
    for (var i = 0; i < grades.length - 1; i++) {
        var from = grades[i];
        var to = grades[i + 1] - 1;
        labels.push(
            '<i style="background:' + colors[i] + '"></i> ' +
            from + '&ndash;' + to
        );
    }
    // Last grade (14+)
    labels.push('<i style="background:' + colors[colors.length-1] + '"></i> 14+');

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map2);

})
.catch(error => console.error("Error loading GeoJSON:", error));  
