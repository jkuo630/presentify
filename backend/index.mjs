import express from 'express';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import { ImageDisplay } from './main.mjs'; // Adjust the path to your file
import { generatePrompt } from './chat.mjs';
import cors from 'cors'; // Import cors for enabling CORS
import OpenAI from 'openai'; // Import 

// Save 

// Load environment variables from .env
dotenv.config(); 

const app = express();
const PORT = 8000;
//const openai = new OpenAI(); // Initialize OpenAI

let prevImage = "";
let bullet = [];
let totalBullets = [];

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Simple GET route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Simple GET route
app.get("/clear", (req, res) => {
  totalBullets = [...totalBullets, ...bullet];
  bullet = [];
  prevImage = "";
  res.send("OK");
});

app.post("/words", async (req, res) => {
  try {
    // Recieve JSON from front-end
    const wordsAndBullets = req.body;
    const gptResponse = await generatePrompt(wordsAndBullets, bullet, prevImage);

    // Parse the JSON data that GPT gave
    const gpt = JSON.parse(gptResponse);

    // Update the bullet variables
    bullet = gpt.bullets;
    totalBullets = totalBullets.concat(bullet);

    if (gpt.image !== prevImage) {
      const image = await ImageDisplay(gpt.image);
      gpt.image = image;
      prevImage = image;
    } else {
      gpt.image = "marcuskam";
    }
    
    // Send the json back
    res.json(gpt);

  } catch (error) {
    console.error('Error in /words route:', error);
    res.status(500).send(`Error fetching image: ${error.message}`); // Send an error response
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

// // Simple POST route
// app.post("/words", (req, res) => {
//   const data = req.body;
//   console.log(data.words)
//   res.json({data});
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});