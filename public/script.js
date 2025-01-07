let currentUnit = "celsius";
let currentTemp = null;

function convertTemperature(celsius) {
  if (currentUnit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function getLocation() {
  // Show loading state immediately
  const weatherMain = document.querySelector(".weather-main");
  weatherMain.innerHTML = '<div class="spinner"></div>';
  weatherMain.classList.add("loading");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        getWeather(position.coords.latitude, position.coords.longitude),
      showError
    );
  } else {
    showError();
  }
}

async function getWeather(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/weather?lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError();
  }
}

function displayWeather(data) {
  const weatherMain = document.querySelector(".weather-main");
  weatherMain.classList.remove("loading");

  // Store the temperature in Celsius
  currentTemp = data.main.temp;

  weatherMain.innerHTML = `
    <img id="weather-icon" src="http://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="Weather icon" />
    <div class="temperature">
      <span id="temperature">${convertTemperature(
        currentTemp
      )}</span><span id="temp-unit">°${
    currentUnit === "celsius" ? "C" : "F"
  }</span>
    </div>
  `;

  document.getElementById("weather-info").classList.remove("hidden");
  document.getElementById("location").textContent = data.name;
  document.getElementById("description").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = Math.round(
    data.wind.speed * 3.6
  );
}

function showError(
  message = "Unable to fetch weather data. Please try again later."
) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("weather-info").classList.add("hidden");
  const errorElement = document.getElementById("error");
  errorElement.classList.remove("hidden");
  errorElement.textContent = message;
}

// Start the app
getLocation();

document.addEventListener("DOMContentLoaded", getLocation);

// Add event listeners for the toggle buttons
document.addEventListener("DOMContentLoaded", () => {
  const celsiusBtn = document.getElementById("celsius");
  const fahrenheitBtn = document.getElementById("fahrenheit");

  celsiusBtn.addEventListener("click", () => {
    if (currentUnit !== "celsius") {
      currentUnit = "celsius";
      celsiusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
      const tempDisplay = document.getElementById("temperature");
      const tempUnit = document.getElementById("temp-unit");
      if (tempDisplay && tempUnit) {
        tempDisplay.textContent = convertTemperature(currentTemp);
        tempUnit.textContent = "°C";
      }
    }
  });

  fahrenheitBtn.addEventListener("click", () => {
    if (currentUnit !== "fahrenheit") {
      currentUnit = "fahrenheit";
      fahrenheitBtn.classList.add("active");
      celsiusBtn.classList.remove("active");
      const tempDisplay = document.getElementById("temperature");
      const tempUnit = document.getElementById("temp-unit");
      if (tempDisplay && tempUnit) {
        tempDisplay.textContent = convertTemperature(currentTemp);
        tempUnit.textContent = "°F";
      }
    }
  });
});
