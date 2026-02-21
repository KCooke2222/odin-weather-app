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

// temperture: sliding color from blue to orange
// conditions: icon
function updateDisplay(weatherData) {
  conditions.textContent = weatherData.conditions;
  temp.textContent = weatherData.temp;
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
