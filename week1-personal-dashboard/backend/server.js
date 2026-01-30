const express = require('express'); // Imports Express.js library
const fetch = require('node-fetch'); // Imports a library that allows the Node.js server to make HTTP requests to other servers (like OpenWeatherMap's API for example)
require('dotenv').config(); // Loads the environment variables from the .env file into the process.env object

const app = express(); // Creates an instance of an Express application which will be the server
const PORT = process.env.PORT || 3000; // Set the port number for the server. Defaults to 3000 if port not found in .env

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}) // By default, browsers block web pages from making requests to different origin for security. CORS middleware allows frontend to talk to backend: Access-Control-Allow-Origin tells browser it's okay to accept requests from any origin (*).

app.get('/api/weather', async (req, res) => {
// app.get - Defines a route that listens for HTTP GET requests.
// '/api/weather' - Define the path for frontend calls when the function runs.
// async ( , ) => {} - Route handler function. Async operations allow your program to start a potentially long-running task, and still respond to other events while that task is running.
// req - Request: Object containing details about the incoming request.
// res - Response: Object sued to send a response back to the frontend.
try {
    const city = req.query.city || 'London'; // Request data for the specified city.
    const apiKey = process.env.OPENWEATER_API_KEY; // Retrieve API key from .env file.

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Call OpenWeatherMap API by plugging in city and the API key retrieved above.

    const response = await fetch(apiUrl); // Pauses the function until the request to the API (above) is complete (asynchronous)
    if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`)
    } // Checks if the response status is not in 200d (404, 401, etc.). If so, throws an error to jump to the catch block.
    const weatherData = await response.json(); // Parses the JSON text response from OpenWeatherMap into a usable JS object (weatherData)

    res.json({
        // Send the final formatted data back to the frontend as JSON.

        success:true,
        city: weatherData.name,
        temparature: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        icon: weatherData.weather[0].icon
    });
} catch (error) {
    // Send a user-friendly error to the frontend
    res.status(500).json({
        success: false,
        error: 'Could not fetch weather data. Please check the city name or try again later.'
    });
}

// try... catch - This block wraps the process so that if anything fails, execution jumps to the catch.
// console.error() - Logs the detailed technical error to the terminal to make debugging easier.
// res.status(500).json() - Sends a simple user-friendly error message back to the frontend. if fetchWeather function is 'false' it will display this message.
});

app.listen(PORT, () => {
    console.log(`✅ Proxy server running: http://localhost:${PORT}`)
})
// app.listen(PORT, ...) - Command to start the server. Tells Express to begin listening for incoming requests on the specified PORT.
// Log success message to terminal once the server is ready.
