import "./styles.css";

const iconMappings = {
  snow: "wi-snow.svg",
  "snow-showers-day": "wi-day-snow.svg",
  "snow-showers-night": "wi-night-alt-snow.svg",
  "thunder-rain": "wi-thunderstorm.svg",
  "thunder-showers-day": "wi-day-thunderstorm.svg",
  "thunder-showers-night": "wi-night-alt-thunderstorm.svg",
  rain: "wi-rain.svg",
  "showers-day": "wi-day-showers.svg",
  "showers-night": "wi-night-showers.svg",
  fog: "wi-fog.svg",
  wind: "wi-strong-wind.svg",
  cloudy: "wi-cloudy.svg",
  "partly-cloudy-day": "wi-day-cloudy.svg",
  "partly-cloudy-night": "wi-night-alt-partly-cloudy.svg",
  "clear-day": "wi-day-sunny.svg",
  "clear-night": "wi-night-clear.svg",
};

async function getWeather(location) {
  const query = location.trim();
  if (!query) throw new Error("Please enter a location.");

  const url = new URL(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(query)}`,
  );
  url.searchParams.set("key", "GU4PUEMERHS7M6SJBWW7WEQZB");

  const response = await fetch(url);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`HTTP ${response.status}: ${details || "Request failed"}`);
  }
  return response.json();
}

async function getWeatherData(location) {
  const data = await getWeather(location);

  return {
    conditions: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    icon: data.currentConditions.icon,
  };
}

async function loadIcon(iconId) {
  const fileName = iconMappings[iconId] ?? iconMappings.cloudy;
  const { default: src } = await import(`./icons/${fileName}`);
  return src;
}

// temperture: sliding color from blue to orange
// conditions: icon
async function updateDisplay(weatherData) {
  conditions.textContent = weatherData.conditions;
  temp.textContent = `${weatherData.temp}° F`;

  icon.src = await loadIcon(weatherData.icon);
  icon.hidden = false;
}

const search = document.querySelector("#search");
const display = document.querySelector(".display");

const icon = display.querySelector(".icon");
const conditions = display.querySelector(".conditions");
const temp = display.querySelector(".temp");

search.addEventListener("submit", async (e) => {
  e.preventDefault();
  const location = e.target.location.value;

  try {
    const weatherData = await getWeatherData(location);
    await updateDisplay(weatherData);
  } catch (error) {
    conditions.textContent = error.message;
    temp.textContent = "";
    icon.removeAttribute("src");
  }
});
