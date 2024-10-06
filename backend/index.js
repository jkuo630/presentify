import express from 'express';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import { ImageDisplay } from './main.js'; // Adjust the path to your file
import { imagePrompt, bulletPrompt } from './chat.mjs';
import cors from 'cors'; // Import cors for enabling CORS
import OpenAI from 'openai'; // Import OpenAI

// Load environment variables from .env
dotenv.config(); 

const app = express();
const PORT = 8000;
//const openai = new OpenAI(); // Initialize OpenAI


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Simple GET route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/words", async (req, res) => {
  try {
    const wordsAndBullets = req.body;
    const gpt = json.parse(await generatePrompt(wordsAndBullets));
    const image = await ImageDisplay(gpt.image);
    gpt.image = image;

    res.json(gpt); // Send the json back
  } catch (error) {
    console.error('Error in /words route:', error);
    res.status(500).send('Error fetching image'); // Send an error response
  }
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