
$(document).ready(function() {

    var requestedCity = "";
    
    $("#searchBtn").on("click", function() {
        requestedCity = $("#enterCity").val();
        console.log("this is the requested city: " + requestedCity)
        $("#currentConditions").empty();
        getWeather(requestedCity);
        setLocalStorage(requestedCity);
        $("#previous-cities").empty;
        getLocalStorage();
    });

    $("#previous-cities").on("click", "button", function() {
        requestedCity = $(this).text();
        console.log("this is the previous city: " + requestedCity)
        $("#currentConditions").empty();
        getWeather(requestedCity);
        setLocalStorage(requestedCity);
        $("#previous-cities").empty;
        getLocalStorage();
    });


    

    function setLocalStorage(requestedCity) {
            
        localStorage.removeItem("4");
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


    function getLocalStorage() {

        storedCities = [0, 1, 2, 3, 4]

        for (i=0; i<storedCities.length; i++) {
            var i = localStorage.getItem(i);
            $("#previous-cities").append('<li class="list-group-item"><button type="button" class="btn btn-light">' + i + '</button></li>');
        }
    }


    
    
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
            $(".city").html("<h3>" + response.name + ' (' + today + ')' + "<span id='currentIcon'></span></h1>");
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

                var icon = weatherResponse.daily[0].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                $("#currentIcon").html("<img id='wicon' src='" + iconurl + "' alt='Weather icon'>");

                var dailyWeather = weatherResponse.daily;
                var fiveDay = [1, 2, 3, 4, 5];

                $.each(fiveDay, function( index, value ) {
                    console.log("this is the index: " + index);
                    console.log("this is the value: " + value);
                    var date = moment().add(value, 'days');;
                    //console.log("this is the date v1: " + date);
                    date = date.format('LL');
                    console.log("this is the date v2: " + date);
                    icon = dailyWeather[value].weather[0].icon;
                    iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                    console.log("this is the icon url: " + iconurl);
                    var temp = dailyWeather[value].temp.max;
                    temp = (dailyWeather[value].temp.max - 273.15) * 1.80 + 32;
                    //console.log("this is the temp: " + temp);
                    var humidity = dailyWeather[value].humidity;
                    //console.log("this is the humidity: " + humidity);

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