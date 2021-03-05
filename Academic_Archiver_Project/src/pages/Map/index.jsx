import React, { useEffect, useState } from 'react'
//leaflet is an open source map module
import L from 'leaflet'
import { Link } from 'react-router-dom'

export default () => {
  const [center, setCenter] = useState([0, 0])
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        alert("location tracking is not allowed in this website!");
      }
    }

    function showPosition(position) {
      console.log(position);
      //get latitude position
      var lat = position.coords.latitude; 
      //get longitude position
      var lag = position.coords.longitude; 
      setCenter([lat, lag])
    }
    //error message for different condition
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("fail to find your location,please open the permission of location tracking!");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("fail to find your location,your location is unavailable!");
          break;
        case error.TIMEOUT:
          alert("time out to find your location");
          break;
        case error.UNKNOWN_ERROR:
          alert("fail to find your location, the location system is broken!");
          break;
      }
    }

    getLocation()
  }, [])
  //set the personal location label in map
  useEffect(() => {
    if (!center[0] && !center[0]) return
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('my test1')
      .openPopup();

    L.marker([51.5, -0.11]).addTo(map)
      .bindPopup('my test2')
      .openPopup();

    L.marker([51.53, -0.09]).addTo(map)
      .bindPopup('Gloria')
      .openPopup();
  }, [center])

  if (!center[0] && !center[0]) return null

  return (
    <div>
      <div className='map' id='map' style={{ height: '90vh', width: '90vw' }}>  { }
        
      </div>
      <u>
              <Link to="/mainpage">Back to main page</Link>
      </u>
    </div>
     
  )
}