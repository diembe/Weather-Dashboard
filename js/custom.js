
$(document).ready(function() {

    // Bring up last city on load
    getLocalStorage();
    var requestedCity = localStorage.getItem("0");
    getWeather(requestedCity);

    // Update city if you click the search icon
    $("#searchBtn").on("click", function() {
        requestedCity = $("#enterCity").val();
        $("#enterCity").val('');
        console.log("this is the requested city: " + requestedCity)
        $("#currentConditions").empty();
        getWeather(requestedCity);
        setLocalStorage(requestedCity);
        $("#previous-cities").empty();
        getLocalStorage();
    });

    // Update city if you click a previous city
    $("#previous-cities").on("click", "button", function() {
        requestedCity = $(this).text();
        $("#enterCity").val('');
        console.log("this is the previous city: " + requestedCity)
        $("#currentConditions").empty();
        getWeather(requestedCity);
        setLocalStorage(requestedCity);
        $("#previous-cities").empty();
        getLocalStorage();
    });

    // Update city if you hit enter
    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            requestedCity = $("#enterCity").val();
            $("#enterCity").val('');
            console.log("this is the previous city: " + requestedCity)
            $("#currentConditions").empty();
            getWeather(requestedCity);
            setLocalStorage(requestedCity);
            $("#previous-cities").empty();
            getLocalStorage();
        }
    });
    
    // When a new city is submitted, remove the last one and shift the rest down.
    function setLocalStorage(requestedCity) {
            
        localStorage.removeItem("7");
        var move6 = localStorage.getItem("6");
        localStorage.setItem("7", move6);
        var move5 = localStorage.getItem("5");
        localStorage.setItem("6", move5);
        var move4 = localStorage.getItem("4");
        localStorage.setItem("5", move4);
        var move3 = localStorage.getItem("3");
        localStorage.setItem("4", move3);
        var move2 = localStorage.getItem("2");
        localStorage.setItem("3", move2);
        var move1 = localStorage.getItem("1");
        localStorage.setItem("2", move1);
        var move0 = localStorage.getItem("0");
        localStorage.setItem("1", move0);
        localStorage.setItem("0",requestedCity);
    }

    // Iterate through all saved cities and add them as buttons in a ul
    function getLocalStorage() {

        storedCities = ["0", "1", "2", "3", "4", "5", "6", "7"]

        console.log("storedCities length: " + storedCities.length);

        var i;
        for (i = 0; i < storedCities.length; i++) {
            var city = localStorage.getItem(storedCities[i]);
            console.log("this is i: " + i);
            $("#previous-cities").append('<li class="list-group-item"><button type="button" class="btn btn-light">' + city + '</button></li>');
        }
    }

    
    // The main weather function
    function getWeather(requestedCity) {
        // API key
        var APIKey = "279767c3d83ada8f50f22f23a0737573";

        // Need to first get lat/lon for searched city.

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

            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // Get current date from moment.js
            var today = moment().format('LL');

            // Transfer content to HTML
            $(".city").html("<h3>" + response.name + ' (' + today + ')' + "<span id='currentIcon'></span></h1>");
            $(".temp").text("Temperature: " + tempF.toFixed(1) + " °F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
        
            // Now that we have the lat/lon of the city, make a second api request to get the 5-day forcast info

            // Weather URL
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey;


            // AJAX call to the OpenWeatherMap API
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function(weatherResponse) {

                // Add UVI info to today's weather
                $(".uvi").html("<span id='uvindex'>UV Index: " + weatherResponse.current.uvi + "</span>");

                $(".uvi").addClass("uvisettings");

                // Color code UVI tag according to severity
                if (weatherResponse.current.uvi < 3) {
                    $("#uvindex").addClass("favorable");
                } else if (weatherResponse.current.uvi > 3 && weatherResponse.current.uvi < 8) {
                    $("#uvindex").addClass("moderate");
                } else if (weatherResponse.current.uvi >= 8) {
                    $("#uvindex").addClass("severe");
                }

                // Set icon for today's weather
                var icon = weatherResponse.daily[0].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                $("#currentIcon").html("<img id='wicon' src='" + iconurl + "' alt='Weather icon'>");

                var dailyWeather = weatherResponse.daily;
                var fiveDay = [1, 2, 3, 4, 5];

                // Iterate through the number of days specified in fiveDay
                $.each(fiveDay, function( index, value ) {
                    // Add days to current day
                    var date = moment().add(value, 'days');;
                    date = date.format('LL');
                    // Get weather icon & pull the png image url
                    icon = dailyWeather[value].weather[0].icon;
                    iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                    // Get temp and conver to fahrenheit
                    var temp = dailyWeather[value].temp.max;
                    temp = (dailyWeather[value].temp.max - 273.15) * 1.80 + 32;
                    var humidity = dailyWeather[value].humidity;

                    // Take all the weather for this iteration's day and create/append html.
                    $("#currentConditions").append("<div class='col-md-2'><div id=" + value + "></div></div>");
                    $("#" + value).addClass("five-day-div");
                    $("#" + value).append("<div class='dateFormatting'>" + date + "</div>")
                    $("#" + value).append("<div id='icon'><img id='wicon' src='" + iconurl + "' alt='Weather icon'></div>");
                    $("#" + value).append("<div id='temp'>" + temp.toFixed(1) + " °F</div>");
                    $("#" + value).append("<div id='humidity'>" + humidity + "%</div>");

                });

            });
        });
    };
});