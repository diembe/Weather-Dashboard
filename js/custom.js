
$(document).ready(function() {

    var requestedCity = "";
    
    $("#searchBtn").on("click", function() {
        requestedCity = $("#enterCity").val();
        console.log("this is the requested city: " + requestedCity)
        $("#currentConditions").empty();
        getWeather(requestedCity);
    });

    $("#previous-cities").on("click", "button", function() {
        requestedCity = $(this).text();
        console.log("this is the previous city: " + requestedCity)
        $("#currentConditions").empty();
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

            var today = moment().format('LL');

            // Transfer content to HTML
            $(".city").html("<h3>" + response.name + ' (' + today + ')' + "</h1>");
            $(".temp").text("Temperature: " + tempF.toFixed(1) + " °F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
            
            
            
            

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

                //$(".uvi").text("UV Index: " + weatherResponse.current.uvi);
                $(".uvi").html("<span id='uvindex'>UV Index: " + weatherResponse.current.uvi + "</span>");

                $(".uvi").addClass("uvisettings");

                if (weatherResponse.current.uvi < 3) {
                    $("#uvindex").addClass("favorable");
                } else if (weatherResponse.current.uvi > 3 && weatherResponse.current.uvi < 8) {
                    $("#uvindex").addClass("moderate");
                } else if (weatherResponse.current.uvi >= 8) {
                    $("#uvindex").addClass("severe");
                }

                var dailyWeather = weatherResponse.daily;
                var fiveDay = [0, 1, 2, 3, 4];

                $.each(fiveDay, function( value ) {
                    //console.log("this is the value: " + value);
                    var date = moment().add(value, 'days');;
                    //console.log("this is the date v1: " + date);
                    date = date.format('LL');
                    //console.log("this is the date v2: " + date);
                    var icon = dailyWeather[value].weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                    console.log("this is the icon url: " + iconurl);
                    var temp = dailyWeather[value].temp.max;
                    temp = (dailyWeather[value].temp.max - 273.15) * 1.80 + 32;
                    //console.log("this is the temp: " + temp);
                    var humidity = dailyWeather[value].humidity;
                    //console.log("this is the humidity: " + humidity);

                    $("#currentConditions").append("<div class='col-md-2'><div id=" + value + "></div></div>");
                    $("#" + value).addClass("five-day-div");
                    $("#" + value).append("<div class='dateFormatting'>" + date + "</div>")
                    $("#" + value).append("<div id='icon'><img id='wicon' src='' alt='Weather icon'></div>");
                    $('#wicon').attr('src', iconurl);

                });

            });
        });
    };
});