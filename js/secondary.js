var input = document.getElementById("searchBox");
input.addEventListener("keyup", function(event) {
  if ("Enter" === event.key) { // new way of doing this
    event.preventDefault();
    document.getElementById("searchIcon").click();
  }
});
// $.getJSON('../indian_cities.json',function(data){
//   console.log(data);
//   console.log(data.India[599]);
// })