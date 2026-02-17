var map = L.map('map').setView([40, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

console.log("Map1 initialized");

// Function to scale circle radius by magnitude
function getRadius(mag) {
  return mag ? mag * 4 : 1; // scale factor, adjust as needed
}

// Load USGS GeoJSON
fetch("data/earthquakes30.geojson")
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