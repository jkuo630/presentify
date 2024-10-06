import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key
const openai = new OpenAI({ apiKey: process.env.API_KEY });

async function generatePrompt() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the correct model name
            messages: [
                { role: "system", 
                    content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Write a haiku about recursion in programming.",
                },
            ],
        });

        // Output the generated message
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error generating haiku:", error);
    }
}

generatePrompt();
