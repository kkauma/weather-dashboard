function getLocation() {
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

    if (!response.ok) throw new Error("Weather data not available");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError();
  }
}

function displayWeather(data) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("weather-info").classList.remove("hidden");

  document.getElementById("location").textContent = data.name;
  document.getElementById("temperature").textContent = Math.round(
    data.main.temp
  );
  document.getElementById("description").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = Math.round(
    data.wind.speed * 3.6
  ); // Convert m/s to km/h

  const iconCode = data.weather[0].icon;
  document.getElementById(
    "weather-icon"
  ).src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function showError() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("error").classList.remove("hidden");
}

// Start the app
getLocation();
