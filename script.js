const apiKey = "f01adf506d2263521149f748d038fc4e";
const weatherForm = document.getElementById("weatherForm");
const locationInput = document.getElementById("locationInput");
const errorDiv = document.getElementById("error");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const location = locationInput.value.trim();
  if (!location) {
    showError("Please enter a location.");
    return;
  }
  clearError();
  clearWeather();

  try {
    const weatherData = await fetchWeather(location);
    displayWeather(weatherData);
  } catch (err) {
    showError(err.message);
  }
});

async function fetchWeather(location) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${apiKey}&units=metric`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Location not found. Please enter a valid city or location."
      );
    } else {
      throw new Error("Failed to fetch weather data. Please try again later.");
    }
  }
  const data = await response.json();
  return data;
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  weatherResult.classList.remove("hidden");
}

function showError(message) {
  errorDiv.textContent = message;
  weatherResult.classList.add("hidden");
}

function clearError() {
  errorDiv.textContent = "";
}

function clearWeather() {
  cityName.textContent = "";
  temperature.textContent = "";
  description.textContent = "";
  weatherIcon.src = "";
  weatherIcon.alt = "";
  weatherResult.classList.add("hidden");
}
