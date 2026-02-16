var map = L.map('map').setView([40, -95], 4);

var Stadia_StamenTerrainBackground = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

   //Function to scale circle radius by magnitude
function getRadius(mag) {
  return mag ? mag * 4 : 1;    //scale factor, adjust as needed
}

   //Load USGS GeoJSON
fetch("data/8EQPacific.geojson")
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
          <strong>${feature.properties.place}</strong></br>
          Magnitude: ${feature.properties.mag}<br>
          Depth: ${feature.geometry.coordinates[2]} km
        `);
      }
    }).addTo(map);
  })
  .catch(error => console.error("Error loading GeoJSON:", error));

    
    


   //Add all scripts to the JS folder