var map =  L.map('map').setView([15, -15], 2
); 
var Stadia_StamenTerrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});addTo(map);

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

//map 2
var map2 = L.map('map2').setView([37.8, -96], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map2);

// force Leaflet to recalc container size
setTimeout(() => {
  map2.invalidateSize();
}, 0);


// Define color function OUTSIDE
function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

// Define style function OUTSIDE
function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}


// Fetch GeoJSON properly
fetch("data/states.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: style
    }).addTo(map2);
  })
  .catch(error => console.error("Error loading states:", error));


   //Add all scripts to the JS folder