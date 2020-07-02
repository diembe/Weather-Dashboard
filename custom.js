
$(document).ready(function() {

    var requestedCity = "";
    
    $("#searchBtn").on("click", function() {
        requestedCity = $("#enterCity").val();
        console.log("this is the requested city: " + requestedCity)
        getWeather(requestedCity);
    });

    $("#previous-cities").on("click", "button", function() {
        requestedCity = $(this).text();
        console.log("this is the previous city: " + requestedCity)
        getWeather(requestedCity);
    });
    
    
    function getWeather(requestedCity) {
        // API key
        var APIKey = "279767c3d83ada8f50f22f23a0737573";

        // Lat/Lon URL
        var coordURL = "https://api.openweathermap.org/data/2.5/weather?q=" + requestedCity + "&appid=" + APIKey;

        // AJAX call to the OpenWeatherMap API
        $.ajax({
            url: coordURL,
            method: "GET"
        })
        .then(function(response) {
        
            var lat = response.coord.lat;
            var lon = response.coord.lon;

            console.log(lat);
            console.log(lon);
        
            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // Transfer content to HTML
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            $(".temp").text("Temperature: " + tempF.toFixed(1) + " °F");
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            
            
            

            // add temp content to html
            

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + tempF);



            // Weather URL
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey;


            // AJAX call to the OpenWeatherMap API
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function(weatherResponse) {

                // Log the resulting object
                console.log(weatherResponse);
                
            });
        });
    };
});