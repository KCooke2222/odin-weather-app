import "./styles.css";

const iconMappings = {
  snow: "snow",
  "snow-showers-day": "day-snow",
  "snow-showers-night": "night-alt-snow",
  "thunder-rain": "thunderstorm",
  "thunder-showers-day": "day-thunderstorm",
  "thunder-showers-night": "night-alt-thunderstorm",
  rain: "rain",
  "showers-day": "day-showers",
  "showers-night": "night-showers",
  fog: "fog",
  wind: "strong-wind",
  cloudy: "cloudy",
  "partly-cloudy-day": "day-cloudy",
  "partly-cloudy-night": "night-alt-partly-cloudy",
  "clear-day": "day-sunny",
  "clear-night": "night-clear",
};

const iconSetIds = {
  icons1: new Set([
    "snow",
    "rain",
    "fog",
    "wind",
    "cloudy",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "clear-day",
    "clear-night",
  ]),
  icons2: new Set(Object.keys(iconMappings)),
};

async function getWeather(location) {
  const url = new URL(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}`,
  );
  url.searchParams.set("key", "GU4PUEMERHS7M6SJBWW7WEQZB");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getWeatherData(location) {
  data = await getWeather(location);

  return {
    conditions: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    icon: data.currentConditions.icon,
  };
}

function getDisplayIconId(iconId, iconSet = "icons1") {
  const validIds = iconSetIds[iconSet] || iconSetIds.icons1;

  if (validIds.has(iconId) && iconMappings[iconId]) return iconMappings[iconId];
  return iconMappings.cloudy;
}

// temperture: sliding color from blue to orange
// conditions: icon
function updateDisplay(weatherData) {
  conditions.textContent = weatherData.conditions;
  temp.textContent = weatherData.temp;

  icon.src = `./icons/wi-${getDisplayIconId(weatherData.icon, "icons2")}.svg`;
}

const search = document.querySelector("#search");
const display = document.querySelector(".display");

const icon = display.querySelector(".icon");
const conditions = display.querySelector(".conditions");
const temp = display.querySelector(".temp");

search.addEventListener("submit", async (e) => {
  e.preventDefault();
  const location = e.target.location.value;

  const weatherData = await getWeatherData(location);
  updateDisplay(weatherData);
});
