function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLatLon, showError, {
            enableHighAccuracy: true
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        getApiData(undefined,undefined,'New Delhi')
        .then((returnedPromise) => console.log("promise resolved"))
        .catch(err => console.log(err.message))
        // will include a function here which will show the weather for New Delhi (default value)
    }
}

function getLatLon(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getApiData(lat, lon)
        .then((returnedPromise) => console.log("promise resolved"))
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
        .then((returnedPromise) => console.log("promise resolved"))
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
// variable declaration ends

// the only statements outside of functions apart from declaration
input.addEventListener("keyup", function (event) {
    if ("Enter" === event.key) { // new way of doing this
      event.preventDefault();
      
    //   document.getElementById("searchIcon").click();
      searchedValue = input.value;
      if (searchedValue == ''){
         alert('Please enter a valid Keyword!!');
      }
      else{
        getApiData(undefined,undefined,searchedValue)
        .then((returnedPromise) => console.log("promise resolved"))
        .catch(err => console.log(err.message))
      }
    }
});

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
    feelsLike.innerHTML = 'Feels like ' + Math.floor(data.main.feels_like) + '\xB0';
    weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + '@2x.png';
    weatherText.innerHTML = data.weather[0].main;

    callback(data);
    }
}
function fillChart(data, callback) {
    console.log(data);
    // for (var i =0; i<24; i++){
    //     hour = extractTime(data.hourly[i].dt)
    //     hourlyTemp = Math.ceil(data.hourly[i].temp);
    //     labelForGraph.push(hour);
    //     dataForGraph.push(hourlyTemp);
    // }
    // console.log(labelForGraph)
    // console.log(dataForGraph)
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
        rowContainer.innerHTML += ` <div class="rowContent2 myBtn" id="">
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
    document.getElementById('pop').innerHTML = data.daily[0].pop + '%';
    document.getElementById('uv').innerHTML = data.current.uvi;
    // extractDayAndMonth(data.current.dt)
}

function extractTime(unixcode) {
    let date = new Date(unixcode * 1000);
    return toStandardTime(date.toString().slice(16, 21));
}
function extractDayAndMonth(unixcode){
    let date = new Date(unixcode * 1000);
    date = date.toString();
    return date.slice(0,3) + ', ' + date.slice(8,10) + " " + date.slice(4,8);
}
function toStandardTime(militaryTime) {
    militaryTime = militaryTime.split(':');
    return (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) ? (militaryTime[0] - 12) + ':' + militaryTime[1]  + ' PM' : militaryTime.join(':') + ' AM'
}
