function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLatLon, showError, {
            enableHighAccuracy: true
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        getApiData(undefined,undefined,'New Delhi')
        .then(() => console.log("promise resolved"))
        .catch(err => console.log(err.message))
        // will include a function here which will show the weather for New Delhi (default value)
    }
}

function getLatLon(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getApiData(lat, lon)
        .then(() => console.log("promise resolved"))
        .catch(err => console.log(err.message))
}

async function getApiData(lati, long,placeName) {
    try {
        // wrapper.style.display = 'none';
        wrapper.style.visibility = 0;
        wrapper.style.opacity = 0;
        loader.style.visibility = 1;
        loader.style.opacity = 1;
        var currentResponse;
        if (placeName == undefined){
            currentResponse = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lati + '&lon=' + long + '&units=metric&appid=c197256603d2483beeac8ea186d08c5e');
        }
        else {
            currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${placeName}&units=metric&appid=c197256603d2483beeac8ea186d08c5e`);
        }
        const currentData = await currentResponse.json();
        fillFirstRow(currentData, fillCurrentDetails);
        let latitude = currentData.coord.lat;
        let longitude = currentData.coord.lon;
        const forecastResponse = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&exclude=minutely&appid=c197256603d2483beeac8ea186d08c5e');
        const forecastData = await forecastResponse.json();
        fillChart(forecastData, fillForecastData);
        wrapper.style.visibility = 1;
        wrapper.style.opacity = 1;
        loader.style.visibility = 0;
        loader.style.opacity = 0;
    } catch (err) {
        console.log(err.message);
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            // will include a function here which will show the weather for New Delhi
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
        getApiData(undefined,undefined,'New Delhi')
        .then(() => console.log("promise resolved"))
        .catch(err => console.log(err.message))
}

var loader = document.getElementById("loader");
var wrapper = document.getElementsByClassName("contentWrapper")[0];
getLocation(); // first thing to be executed in this js file

// all the variables are declared here
var place = document.getElementById("placeName");
var feelsLike = document.getElementById("feelsLike");
var temperature = document.getElementById("temperature");
var weatherIcon = document.getElementById("iconWeather");
var weatherText = document.getElementById("weatherText");
var rowContentArray = document.getElementsByClassName("rowContent");
var rowContainer = document.getElementsByClassName("rowContainer")[0];
var input = document.getElementById("searchBox");
var searchResult = document.getElementsByClassName("searchResults")[0];
// variable declaration ends

// the only statements outside of functions apart from declaration
input.addEventListener("keyup", function (event) {
    if ("Enter" === event.key) { // new way of doing this
      event.preventDefault();
      searchCity(input.value); // well done himalaya
    }
});
function searchCity(value){
    searchedValue = value;
    input.value = '';
      if (searchedValue == ''){
         alert('Please enter a valid Keyword!!');
      }
      else{
        getApiData(undefined,undefined,searchedValue)
        .then(() => console.log("promise resolved"))
        .catch(err => console.log(err.message))
      }
    searchResult.innerHTML = '';
    searchResult.style.display = 'none';
}
function showFavCity(cities,searchText){
  var matches = cities.filter((favCity) => {
    const regex = new RegExp(`^${searchText}`,'gi');
    return favCity.match(regex)
  })
  if(searchText.length === 0){
    matches = [];
    searchResult.innerHTML = '';
  }
  outputHtml(matches);
}
function outputHtml(matches){
  if (matches.length > 0){
    searchResult.style.display = 'block'
     html = matches.map(match => `  <div class="favCityListItem" onclick="searchCity('${match}')">
    <h1>${match}</h1>
    <i class="fa fa-star"></i>
</div>`).join('');
searchResult.innerHTML = html;
  }
  else{
    searchResult.style.display = 'none';
  }
}
input.addEventListener('input', function(){
  showFavCity(favouriteCity,input.value)
})

function fillFirstRow(data, callback) {
    if (data.cod != 200){
        alert("Result Not Found, try searching a different City \n or search like (placeName, district, state) ");
        wrapper.style.visibility = 1;
        wrapper.style.opacity = 1;
        loader.style.visibility = 0;
        loader.style.opacity = 0;
    }
    else {
    temperature.innerHTML = Math.floor(data.main.temp) + `<sup
      style="font-size: 25px; position: absolute; top:11px;">&degC</sup>`;
    place.innerHTML = data.name + ", " + data.sys.country;
    toggleIcon(place.innerHTML)
    feelsLike.innerHTML = 'Feels like ' + Math.floor(data.main.feels_like) + '\xB0';
    weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + '@2x.png';
    weatherText.innerHTML = data.weather[0].main;

    callback(data);
    }
}
function fillChart(data, callback) {
    if (Window.myLineChart != undefined){
      Window.myLineChart.destroy();
      // console.log("chart instance destroyed")
    }
    let labelForGraph = [];
    let dataForGraph = [];
    // console.log(data);
    for (var i =0; i<24; i++){
        hour = extractTime(data.hourly[i].dt)
        hourlyTemp = Math.ceil(data.hourly[i].temp);
        labelForGraph.push(hour);
        dataForGraph.push(hourlyTemp);
    }
    // chart.js code starts here 
    var ctx = document.getElementById("myAreaChart");
    Window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labelForGraph,
          datasets: [{
            label: "Temperature",
            lineTension: 0.3,
            backgroundColor: "rgba(123, 15, 155, 0.2)",
            borderColor: "rgba(255, 255, 255, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(56, 54, 40,1)",
            pointBorderColor: "rgba(56, 54, 40,1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: dataForGraph,
          }],
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                callback: function(value, index, values) {
                  return   number_format(value);
                }
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }],
          },
          legend: {
            display: false
          },
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
              label: function(tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + '\xB0' + 'C';
              }
            }
          }
        }
      });
    // chart.js code ends here
    callback(data)
}

function fillCurrentDetails(data) {
    detailsSectionData = [data.wind.speed + ' m/s', data.main.humidity + '%', 1, data.main.pressure + 'hPa', data.clouds.all + '%', '0%', extractTime(data.sys.sunrise), extractTime(data.sys.sunset)];
    for (var i = 0; i < rowContentArray.length; i++) {
        let h5 = rowContentArray[i].getElementsByTagName("h5")[0];
        h5.innerHTML = detailsSectionData[i];
    }
}

function fillForecastData(data) {
    rowContainer.innerHTML = '';
    for (var i =1;i<8;i++){
        let obj = {
            day : extractDayAndMonth(data.daily[i].dt),
            minTemp : Math.floor(data.daily[i].temp.min),
            maxTemp : Math.floor(data.daily[i].temp.max),
            desc : data.daily[i].weather[0].description,
            icon : data.daily[i].weather[0].icon,
        }
        rowContainer.innerHTML += ` <div class="rowContent2 myBtn" id="${i}">
        <div class="dayAndMonth">
            <h5>${obj.day}</h5>
            <h6>${obj.desc}</h6>
        </div>
        <div class="weatherAndTemp" style="display: flex; align-items: center;">
            <img src="https://openweathermap.org/img/wn/${obj.icon}@2x.png" class="forecastWeatherIcon" alt="" width="50">
            <div class="minMax">
                <h6>${obj.maxTemp}&deg;</h6>
                <h6>${obj.minTemp}&deg;</h6>
            </div>
        </div>
    </div>` 
    }
    for (i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function (event) {
          clickedBtn = event.target;
          setModalElement(clickedBtn.id,data);
          modal.style.display = "block";
        })
      }
    document.getElementById('pop').innerHTML = data.daily[0].pop*100 + '%';
    document.getElementById('uv').innerHTML = data.current.uvi;
    // extractDayAndMonth(data.current.dt)
}

function extractTime(unixcode) {
    let date = new Date(unixcode * 1000);
    return date.toString().slice(16, 21);
}
function extractDayAndMonth(unixcode){
    let date = new Date(unixcode * 1000);
    date = date.toString();
    return date.slice(0,3) + ', ' + date.slice(8,10) + " " + date.slice(4,8);
}
function toStandardTime(militaryTime) {
    militaryTime = militaryTime.split(':');
    if (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) {
      return (militaryTime[0] - 12) + ':' + militaryTime[1] + ' P.M.';
    } else {
      return militaryTime.join(':') + ' A.M.';
    }
 }
 Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
 Chart.defaults.global.defaultFontColor = 'white';

 // function for chart.js
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

var modal = document.getElementById("myModal");
modalBody = modal.getElementsByClassName("modal-body")[0];
var btn = document.getElementsByClassName("myBtn");
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  function setModalElement(id, data){
  // console.log(id)
  modalBody.innerHTML = `
  <div class="modalDetail">
  <h5>Sunrise</h5>
  <h5>${extractTime(data.daily[id].sunrise)}</h5>
</div>
<div class="modalDetail">
<h5>Sunset</h5>
<h5>${extractTime(data.daily[id].sunset)}</h5>
</div>
<div class="modalDetail">
<h5>UVI</h5>
<h5>${data.daily[id].uvi}</h5>
</div>
<div class="modalDetail">
<h5>Precipitation</h5>
<h5>${data.daily[id].pop * 100}%</h5>
</div>
<div class="modalDetail">
<h5>Humidity</h5>
<h5>${data.daily[id].humidity}%</h5>
</div>
<div class="modalDetail">
<h5>Wind Speed</h5>
<h5>${data.daily[id].wind_speed} m/s</h5>
</div>
  `
}
