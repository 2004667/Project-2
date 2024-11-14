require('dotenv').config();  // Load the .env file
const axios = require('axios');

const express = require('express');
const app = express();
const port = 3000;

app.get('/api/recipes', async (req, res) => {
  const API_KEY = process.env.API_KEY; // Access API key from environment variables
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
