const cityInput = document.querySelector(".city-Input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");

const API_KEY = "65f99981753c95b65c162afbbc6d3c2e"; //API Key for weather APP

// 3
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    //HTML For main Card
    return `        
        <div class="detail">
             <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
             <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
               2
             )} <sup>o</sup>C</h4>
              <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
              <h4>Humidity: ${weatherItem.main.humidity} %</h4>
           </div>
           <div class="icons">
           <img src="https://openweathermap.org/img/wn/${
             weatherItem.weather[0].icon
           }@4x.png" alt="weather icon" />
             <h5>${weatherItem.weather[0].description}</h5>
           </div>
        </div>
    `;
  } else {
    return `
        <li class="card">
          <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
          <img src="https://openweathermap.org/img/wn/${
            weatherItem.weather[0].icon
          }@2x.png" alt="weather icon" />
          <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(
            2
          )} <sup>o</sup>C</h4>
          <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
          <h4>Humidity: ${weatherItem.main.humidity} %</h4>
        </li>
    `;
  }
};

// 2)
const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      //   Filter the Forecast
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      //   Cleaning Previous Weather Data
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("An error occur while catching the 2coordinates!");
    });
};

// 1)
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); //Get user City and remove extra space
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}!`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occur while catching the coordinates!");
    });

  cityInput.value = "";
};

// Location
const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occur while catching the city!");
        });
    },
    (error) => {
      if (code.error === error.PERMISSION_DENIED) {
        alert("Geolocation request denied. Please reset location");
      }
    }
  );
};

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getCurrentLocation);
