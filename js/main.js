$.getJSON('https://api.openweathermap.org/data/2.5/weather?q=New Jersey&appid=c197256603d2483beeac8ea186d08c5e',function(data){
  console.log(data)
})
var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLatLon, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getLatLon(position) {
  // lat = position.coords.latitude;
  lat = 28.704; // for testing purposes
  lon = 77.1025; // for testing purposes
  // lon = position.coords.longitude;
  // console.log(lat,lon)
  // $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat  + '&lon=' + lon + '&units=metric&appid=c197256603d2483beeac8ea186d08c5e', function (data) {
  //   console.log(data);
  // });
  $.getJSON('https://api.openweathermap.org/data/2.5/onecall?lat=40.71281&lon=74.0060&units=metric&appid=c197256603d2483beeac8ea186d08c5e', function (data) {
    console.log(data);
  });
 
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}
getLocation();
let unix = 1603202400;
let date = new Date(unix*1000);

console.log(date);   