// $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=New Jersey&appid=c197256603d2483beeac8ea186d08c5e',function(data){
//   console.log(data)
// })

var place = document.getElementById("placeName");
var feelsLike = document.getElementById("feelsLike");
var temperature = document.getElementById("temperature");
var weatherIcon = document.getElementById("iconWeather");
var weatherText = document.getElementById("weatherText")
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLatLon, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getLatLon(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  // console.log(lat,lon)
  $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + lat  + '&lon=' + lon + '&units=metric&appid=c197256603d2483beeac8ea186d08c5e', function (data) {
    console.log(data);
    temperature.innerHTML = Math.floor(data.main.temp) + `<sup
    style="font-size: 25px; position: absolute; top:11px;">&degC</sup>`;
    place.innerHTML = data.name + ", " + data.sys.country;
    feelsLike.innerHTML = 'Feels like ' + Math.floor(data.main.feels_like) + '\xB0';
    weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + '@2x.png';
    weatherText.innerHTML = data.weather[0].main;
    // $.getJSON('https://api.openweathermap.org/data/2.5/onecall?lat='+ lat  + '&lon=' + lon + '&units=metric&appid=c197256603d2483beeac8ea186d08c5e', function (secondDataSet) {
    //   console.log(secondDataSet);
    // });
   });
 
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
     alert("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.")
      break;
  }
}
getLocation();
let unix = 1604314800;
let date = new Date(unix * 1000);
console.log(date);

var modal = document.getElementById("myModal");
modalBody = modal.getElementsByClassName("modal-body")[0];
var btn = document.getElementsByClassName("myBtn");
var span = document.getElementsByClassName("close")[0];

var Humidity = [10,20,40,25,90,20,10]
var Sunrise = ["6:25AM","7:00AM","5:00AM","8:00AM","7:30AM","6:30AM","7:00AM"]
for (i = 0; i < btn.length; i++) {
  btn[i].addEventListener('click', function (event) {
    clickedBtn = event.target;
    setModalElement(clickedBtn.id);
    modal.style.display = "block";
  })
}
// function setModalElement(id){
//   console.log(id)
//   modalBody.innerHTML = `
//   <div class="modalDetail">
//   <h5>Sunrise</h5>
//   <h5>${Sunrise[id-1]}</h5>
// </div>
// <div class="modalDetail">
// <h5>Sunset</h5>
// <h5>7:25 PM</h5>
// </div>
// <div class="modalDetail">
// <h5>Humidity</h5>
// <h5>${Humidity[id-1]}</h5>
// </div>
// <div class="modalDetail">
// <h5>Wind Speed</h5>
// <h5>5.34Km/h</h5>
// </div>
//   `
// }

span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
