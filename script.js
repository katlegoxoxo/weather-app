const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),


    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UVValue = document.getElementById("UVValue"),
    PValue = document.getElementById("PValue"),
    Forcast = document.querySelector(".Forcast");


// Add keypress event to userLocation input
userLocation.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        findUserLocation();
    }
});

WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=781a520a555e19715c7c1c576386528b&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=781a520a555e19715c7c1c576386528b&exclude=minutely&units=metric&`;


function findUserLocation() {
    const forecast = document.querySelector(".forecast");

    forecast.innerHTML = "";
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod != '' && data.cod != 200) {
                alert(data.message);
                return;
            }
            console.log(data);
            city.innerHTML = data.name + " ," + data.sys.country;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`
            fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    temperature.innerHTML = temConverter(data.current.temp);
                    feelsLike.innerHTML = "Feels Like " + data.current.feels_like;
                    description.innerHTML = `<i class= "fa-brands fa-cloudversify"></i> &nbsp; ` + data.current.weather[0].description;

                    const options = {
                        weekday: "long", // e.g., "Monday"
                        month: "long",   // e.g., "January"
                        day: "numeric",  // e.g., "15"
                        hour: "numeric", // e.g., "14"
                        minute: "numeric", // e.g., "30"
                        hour12: false,   // 24-hour format
                    };

                    date.innerHTML = getLongFormateDateTime(data.current.dt, data.timezone_offset, options);

                    HValue.innerHTML = Math.round(data.current.humidity) + "<span>%</span>";
                    WValue.innerHTML = Math.round(data.current.wind_speed) + "<span>m/s</span>";

                    const options1 = {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                    };
                    SRValue.innerHTML = getLongFormateDateTime(data.current.sunrise, data.timezone_offset, options1);
                    SSValue.innerHTML = getLongFormateDateTime(data.current.sunset, data.timezone_offset, options1);

                    CValue.innerHTML = data.current.clouds + "<span>%</span>";
                    UVValue.innerHTML = data.current.uvi;
                    PValue.innerHTML = data.current.pressure + "<span>hPa</span>";

                    console.log(data.daily);

                    // Select the forecast container
                    const forecast = document.querySelector(".forecast");

                    // Iterate over the daily weather data
                    data.daily.forEach((weather) => {
                        let div = document.createElement("div");
                        const options5 = {
                            weekday: "long", // e.g., "Monday"
                            month: "long",   // e.g., "January"
                            day: "numeric",  // e.g., "15"

                        };

                        // Format the date
                        let daily = getLongFormateDateTime(weather.dt, 0, options5);

                        // Set the formatted date as the content of the div
                        div.innerHTML = daily;
                        div.innerHTML = getLongFormateDateTime(weather.dt, 0, options);
                        // Add the weather icon
                        div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description || 'Weather icon'}"/>`;

                        div.innerHTML += `<p class = "forecast-desc">${weather.weather[0].description}</p>`;
                        div.innerHTML += `<span><span>${temConverter(weather.temp.min)}
                        </span>&nbsp;&nbsp;<span>${temConverter(weather.temp.max)}`
                        // Append the div to the forecast container
                        forecast.append(div);
                    });



                });
        });
}


function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options }); // Use toLocaleTimeString for time
}

function getLongFormateDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

function temConverter(temp) {
    let tempValue = Math.round(temp);
    let message = "";

    if (converter.value === "°C") {
        // Celsius
        message = `${tempValue}<span>°C</span>`;
    } else {
        // Fahrenheit
        let ctof = Math.round((tempValue * 9) / 5 + 32);
        message = `${ctof}<span>°F</span>`;
    }
    return message;
}