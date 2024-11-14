const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Add this
require('dotenv').config();

const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());

// Route to fetch weather data from OpenWeather API
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'London';
  const units = req.query.units || 'metric';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
