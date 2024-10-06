import express from "express";
import dotenv from "dotenv"; // Import dotenv for environment variables
import { ImageDisplay } from "./main.mjs"; // Adjust the path to your file
import { generatePrompt, generateSummary } from "./chat.mjs";
import cors from "cors"; // Import cors for enabling CORS
import OpenAI from "openai"; // Import

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 8000;
//const openai = new OpenAI(); // Initialize OpenAI

let prevImage = "";
let bullet = [];
let totalBullets = [];
let transition = false;

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
  transition = true;
  res.send("OK");
});

app.post("/words", async (req, res) => {
  if (!transition) {
    try {
      // Recieve JSON from front-end
      const wordsAndBullets = req.body;
      const gptResponse = await generatePrompt(
        wordsAndBullets,
        bullet,
        prevImage
      );

      // Parse the JSON data that GPT gave
      const gpt = JSON.parse(gptResponse);

      // Update the bullet variables
      bullet = gpt.bullets;
      totalBullets = totalBullets.concat(bullet);
      console.log(gpt.image);

      if (gpt.image !== prevImage && gpt.image !== "previous image prompt") {
        const image = await ImageDisplay(gpt.image);
        gpt.image = image;
        prevImage = image;
      } else {
        gpt.image = "marcuskam";
      }

      // Send the json back
      res.json(gpt);
    } catch (error) {
      console.error("Error in /words route:", error);
      res.status(500).send(`Error fetching image: ${error.message}`); // Send an error response
    }
  } else {
    res.json({ image: null, bullets: [] });
    transition = false;
  }
});

// Summary feature
app.get("/summary", async (req, res) => {
  try {
    console.log("Received summary");

    // Assuming generateSummary(totalBullets) returns a stringified JSON
    const summary = JSON.parse(await generateSummary(totalBullets));

    // Send the summary with a 200 OK status
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error generating summary:", error);

    // Send an error response with a 500 Internal Server Error status
    res.status(500).json({ message: "Error generating summary" });
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
