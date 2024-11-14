require('dotenv').config();  // Load environment variables from .env file
const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

app.get('/api/trending', async (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY; // Access the TMDb API key from environment variables
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data); // Send the API data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from TMDb API");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
