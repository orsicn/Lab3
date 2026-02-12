var map = L.map('map').setView([40, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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

    
    


 //Add all scripts to the JS folder