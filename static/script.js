// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Handle map clicks to fetch weather data
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    try {
        const response = await fetch(`/weather?lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        const weatherInfo = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        // Add a popup to the map
        L.popup()
            .setLatLng([lat, lng])
            .setContent(weatherInfo)
            .openOn(map);
    } catch (error) {
        alert(error.message);
    }
});

// Existing functionality for city-based weather search
document.getElementById("getWeather").addEventListener("click", async () => {
    const city = document.getElementById("city").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(`/weather?city=${city}`);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        const weatherResult = document.getElementById("weatherResult");
        weatherResult.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    } catch (error) {
        alert(error.message);
    }
});