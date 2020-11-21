var favIcon = document.getElementById("favIcon");
var favouriteCity = JSON.parse(localStorage.getItem("FavCityList")) || [];

function storeCity() { // gets executed when INLINE (in html) onclick event is triggered for favicon
    let cityName = document.getElementById("placeName").innerHTML;
    if (isFavCity(cityName)) {
        removeFromLocalStorage(cityName)
    } else {
        addtoLocalStorage(cityName)
    }
    toggleIcon(cityName)
}

function isFavCity(cityName) {
    if (favouriteCity.indexOf(cityName) == -1) {
        return false;
    } else {
        return true;
    }
}

function addtoLocalStorage(cityName) {
    favouriteCity.push(cityName);
    // console.log(favouriteCity);
    localStorage.setItem("FavCityList", JSON.stringify(favouriteCity));
}

function removeFromLocalStorage(cityName) {
    let index = favouriteCity.indexOf(cityName);
    favouriteCity.splice(index, 1);
    // console.log(favouriteCity)
    localStorage.setItem("FavCityList", JSON.stringify(favouriteCity));
}

function toggleIcon(cityName) {
    // console.log(cityName)
    // console.log(favouriteCity)
    if (favouriteCity.indexOf(cityName) == -1) {
        // console.log("if statements works")
        favIcon.classList.add('fa-heart-o');
        favIcon.classList.remove('fa-heart');
    } else {
        // console.log("else statements works")
        favIcon.classList.add('fa-heart');
        favIcon.classList.remove('fa-heart-o');
    }
}
