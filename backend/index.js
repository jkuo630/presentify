const express = require("express");
const app = express();
require('dotenv').config(); // Load environment variables from .env
const axios = require('axios'); // Import axios
const PORT = 8000;
const OpenAI = require("openai");
const openai = new OpenAI();

// Middleware to parse JSON request bodies
app.use(express.json());

// Simple GET route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Simple POST route
app.post("/echo", (req, res) => {
  const data = req.body;
  res.json({
    message: "Received data!",
    data,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


