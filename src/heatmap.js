console.log('hello world')

const data = [{
  type:"choroplethmapbox",
  geojson: "updated_geojson.json",
  locations:[
    "21402_caño-negro", // hospital
    "60105_paquera", // san rafael abajo
    "70201_guapiles" // legua
  ],
  z:[17, 1, 0]
}];

const layout = { 
  mapbox: {center: {lon: 0, lat: 0}, zoom: 3.5}
};

var config = {mapboxAccessToken: "pk.eyJ1Ijoicm9iaW4tbGVhbmRybyIsImEiOiJjbHJjbm4weGsxMXAzMmpxbnUxa2ZmYm0zIn0.8a2O5VT5l2J6JpVJEFEDLw"};

Plotly.newPlot("tester", data, layout, config);