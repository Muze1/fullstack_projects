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

