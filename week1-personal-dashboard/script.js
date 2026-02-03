const clockElement = document.getElementById('clock')
const dateElement = document.getElementById('date')
const weatherElement = document.getElementById('weather')
const toggleButton = document.getElementById('temp-toggle')
// document.getElementById() - finds elements by their 'id' attribute
// Store in variables to avoid repeated DOM queries (optimise performance)


// Live Clock Widget

function updateClock() {
    const now = new Date() // Create an object with current date/time

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    // .getHours/Minutes/Seconds() - Extract Hours/Minutes/Seconds time components
    // .padStart() - Ensures 2-digit format. E.g. "09" instead of just "9"

    clockElement.textContent = `${hours}:${minutes}:${seconds}`
    // Template literal - build a formatted string (string with variable components in its structure)
}


// Date Widget
updateClock()
setInterval(updateClock, 1000) // Calls function every 1000ms (1s)

function updateDate() {
    const today = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    // Controls which date parts to include, and their format.

    const formattedDate = today.toLocaleDateString('en-GB', options)
    // Formats date based on locale options
    dateElement.textContent = formattedDate;
}

updateDate()


// Weather Widget

let currentWeatherData = null; // Stores weather info from API (null until loaded)
let isCelsius = true; // Tracks display unit (true = °C)

async function fetchWeather(city = 'London') {
    try {
        // Show loading state
        weatherElement.innerHTML = '<div class="loading">⌛ Loading weather...</div>'

        // API call to local server backend
        const response = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`)
        // await - pauses until network request completes (non-blocking)

        // Check HTTP status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response - pauses until JSON is parsed
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Weather service error')
        } // Check if our backend returned success.

        // Store data and update dispaly
        currentWeatherData = data;
        updateWeatherDisply()
    } catch (error) {
        // Handle all errors (network, parsing, API errors)
        console.error('Error fetching weather:', error);

        // Show user-friendly error UI
        weatherElement.innerHTML = `
            <div style="color: #e74c3c; text-align: center; padding: 1rem;">
                <div style="font-size: 2em;">🌧️</div>
                <div><strong>Weather Unavailable</strong></div>
                <div style="font-size: 0.9em; margin-top: 0.5rem;">${error.message}</div>
                <button onclick="fetchWeather('London')" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}