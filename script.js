const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const temperatureText = document.getElementById("temperature");
const locationText = document.getElementById("location-name");
const conditionText = document.getElementById("condition");

searchBtn.addEventListener("click", async function() {
    const typedCity = cityInput.value;
    
    if (typedCity === "") {
        alert("Please type a city name first!");
        return; 
    }
    
    // 🔍 STEP 1: Search the web to convert your typed text into real map coordinates
    const geoUrl = "https://open-meteo.com" + typedCity + "&count=1&language=en&format=json";
    
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    // 🚨 Safety Check: If the spelling is wrong or city doesn't exist, stop!
    if (!geoData.results || geoData.results.length === 0) {
        alert("City not found! Please check your spelling.");
        return;
    }
    
    // 🧲 Pull out the exact latitude, longitude, city name, and country name from the web response
    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;
    const countryName = geoData.results[0].country;

    // 🌤️ STEP 2: Pass those exact coordinates into the master live weather database
    const weatherUrl = "https://open-meteo.com" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m";
    
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    
    // 🧲 Grab the current temperature and humidity data points
    const liveTemp = Math.round(weatherData.current.temperature_2m);
    const liveHumidity = weatherData.current.relative_humidity_2m;
    
    
    locationText.textContent = cityName + ", " + countryName;
    temperatureText.textContent = liveTemp + "°C";
    conditionText.textContent = "HUMIDITY: " + liveHumidity + "%";
    
    
    cityInput.value = "";
});
