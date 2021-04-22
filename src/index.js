//Date and time of current weather
function formatDate(timestamp) {
let date = new Date(timestamp);
let hours = date.getHours();
if (hours <10) {
    hours = `0${hours}`;
}

let minutes = date.getMinutes();

if (minutes <10) {
    minutes = `0${minutes}`;
}
let days = [
    "Sunday", 
    "Monday", 
    "Tuesday", 
    "Wednesday", 
    "Thursday", 
    "Friday", 
    "Saturday"
];
let day = days[date.getDay()];
return `${day} ${hours}:${minutes}`;
}
//FORECAST coordinates to get information
function getForecast(coordinates) {
    console.log(coordinates);
    let apiKey = "bded79ed1d2cea9265b0acc8da5369f4";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}

//CURRENT & FORECAST temperature
function displayTemperature(response) {
let temperatureElement = document.querySelector("#temperature");
let cityElement = document.querySelector("#city")
let descriptionElement = document.querySelector("#description");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let dateElement = document.querySelector("#date");
let iconElement = document.querySelector("#icon");

temperatureElement.innerHTML = Math.round(response.data.main.temp);
cityElement.innerHTML = response.data.name;
descriptionElement.innerHTML = response.data.weather[0].description;
humidityElement.innerHTML= response.data.main.humidity;
windElement.innerHTML = Math.round(response.data.wind.speed);
dateElement.innerHTML = formatDate(response.data.dt * 1000);

iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
iconElement.setAttribute("alt", response.data.weather[0].icon)
celsiusTemperature = response.data.main.temp;

getForecast(response.data.coord)
}

//API to search city
function search(city) {
let apiKey = "bded79ed1d2cea9265b0acc8da5369f4";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayTemperature);

}

//Value of submitted city by the user
function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

//Current Fahrenheit
function showFahrenheitTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
    //celsius remove active
    celsiusLink.classList.remove("active");
    //fahrenheit add active
    fahrenheitLink.classList.add("active");
}

//Current Celsius
function showCelsiusTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
    //add active celsius
    celsiusLink.classList.add("active");
    //remove active fahrenheit
    fahrenheitLink.classList.remove("active");
}

//FORECAST days
function formatDay(timestamp) {
let date = new Date(timestamp * 1000);
let day = date.getDay();
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

return days[day];
}

//FORECAST structure
function displayForecast(response) {
    let forecast  = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    
    let days = ["Mon", "Tue", "Wed", "Thu"];

    let forecastHTML = "";
    forecast.forEach(function(forecastDay, index) {
        if(index <5) {
    forecastHTML = forecastHTML + 
    `
        <li class="d-flex align-items-center weather-forecast-day-one">
          <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" ; alt="" ; class="float-left">
            <div class="float-left weather-forecast-date">
                ${formatDay(forecastDay.dt)}
                <div class="float-left weather-forecast-temperature">
                  <span class="weather-forecast-temperature-max">
                    ${Math.round(forecastDay.temp.max)}º |
                  </span>
                  <span class="weather-forecast-temperature-min">
                    ${Math.round(forecastDay.temp.min)}º
                  </span>
                </div>
            </div>
        </li>
    `;
    forecastElement.innerHTML = forecastHTML;
        }
    })
}


let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("New York");

