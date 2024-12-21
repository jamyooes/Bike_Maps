var map = L.map('map').setView([40.7430, -73.95669], 12);
var markers = new L.MarkerClusterGroup();

/*
Creates a tile layer
*/
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*
Call API for citibike
*/
const citibikeAPI = "http://api.citybik.es/v2/networks/citi-bike-nyc";
fetch(citibikeAPI)
    .then(response => {
        if(!response.ok){
            throw new Error('Network response is not good - Messed up')
        }
        return response.json();
    })
    .then(data => {
        let station_list = data_to_dict(data);
        map_stations(station_list);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Parse raw data from API for needed data into a list
function data_to_dict(data){
    /*
    Function to store needed data into an object and stored in a list
    
    Storing the number of ebikes, empty slots, free bikes, latitude, 
    longitude, and name of the street into the list
    
    Input:
    data (object): raw data from the API

    Output:
    station_list (list): list of objects from stations
    */
    // console.log(Object.keys(stations))
    // console.log(data.network.stations)
    let station_data = data.network.stations
    let station_list = []
    for (i in station_data){
        let obj = station_data[i]
        const station = {
            ebikes: station_data[i].extra.ebikes,
            emptySlots: station_data[i].empty_slots,
            freeBikes: station_data[i].free_bikes,
            latitude: station_data[i].latitude,
            longitude: station_data[i].longitude,
            name: station_data[i].name
        }
        station_list[i] = station
        // console.log(station_data[i])
        // console.log(station_data[i].extra.ebikes)
    }
    console.log(station_list)
    return station_list
}

function map_stations(station_list){
    var marker_renderer = L.canvas({padding: 0.5});
    station_list.forEach(function (station, index) {
        var circleMarker = L.circleMarker([station.latitude, station.longitude],
            {renderer: marker_renderer, radius: 5, color: "red"}
        ).bindPopup("<p> street name: " + station.name + 
            "<br>" + "Number of empty slots: " + station.emptySlots + 
            "<br>" + "Number of free bikes: " + station.freeBikes +
            "<br>" + "Number of e-bikes: " + station.ebikes + "</p>"
        )
        // .addTo(map)
        markers.addLayer(circleMarker)
    });
    map.addLayer(markers)
}