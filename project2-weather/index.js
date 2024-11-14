let units = "metric"; 
const apiKey = "8120b6745ecdb5d7c35188d47cdb611c"; 

const citySearchInput = document.getElementById("city-search");
const geoLocationButton = document.getElementById("geo-location-btn");
const unitToggle = document.getElementById("unit-toggle");

const cityNameElement = document.getElementById("city-name");
const weatherIconElement = document.getElementById("weather-icon");
const currentTempElement = document.getElementById("current-temp");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const weatherConditionElement = document.getElementById("weather-condition");

const forecastContainer = document.querySelector(".forecast-cards");

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error fetching weather data");
        }
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found or invalid API request.");
            return;
        }

        cityNameElement.textContent = data.name;
        weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        currentTempElement.textContent = `Temperature: ${data.main.temp}°`;
        humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} km/h`;
        weatherConditionElement.textContent = `Condition: ${data.weather[0].description}`;
    } catch (error) {
        console.error("Error in getWeatherData:", error);
        alert("Failed to fetch weather data. Please try again later.");
    }
}

async function get5DayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error fetching forecast data");
        }
        const data = await response.json();

        if (data.cod !== "200") {
            alert("Error fetching forecast data.");
            return;
        }

        forecastContainer.innerHTML = ''; 

        data.list.slice(0, 5).forEach(item => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");
            forecastCard.innerHTML = `
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="weather icon">
                <p>High: ${item.main.temp_max}° | Low: ${item.main.temp_min}°</p>
                <p>${item.weather[0].description}</p>
            `;
            forecastContainer.appendChild(forecastCard);
        });
    } catch (error) {
        console.error("Error in get5DayForecast:", error);
        alert("Failed to fetch 5-day forecast. Please try again later.");
    }
}

citySearchInput.addEventListener("input", () => {
    const city = citySearchInput.value;
    if (city.length > 2) {
        getWeatherData(city);
        get5DayForecast(city);
    }
});

geoLocationButton.addEventListener("click", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Error fetching weather data");
                }
                const data = await response.json();

                if (data.cod !== 200) {
                    alert("Error fetching weather data.");
                    return;
                }

                cityNameElement.textContent = data.name;
                weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                currentTempElement.textContent = `Temperature: ${data.main.temp}°`;
                humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
                windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} km/h`;
                weatherConditionElement.textContent = `Condition: ${data.weather[0].description}`;
            } catch (error) {
                console.error("Error in geolocation fetch:", error);
                alert("Failed to fetch weather data for your location.");
            }
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

unitToggle.addEventListener("change", () => {
    units = unitToggle.checked ? "imperial" : "metric"; 
    getWeatherData(citySearchInput.value);
    get5DayForecast(citySearchInput.value);
});
