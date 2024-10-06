import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key
const openai = new OpenAI({ apiKey: process.env.API_KEY });
const systemPrompt = `
You will be given a JSON file with three inputs, one is a 'words’ which is a text input and one is a ‘bullet’ which is an array of bullet points.
You are to generate a JSON file with two outputs, one labeled as ‘image’ and one labeled as ‘bullet’.
For the ‘image’, you are to generate one concise, descriptive word or short phrase that best capture the visual concept of the given ‘sentence’. Focus on a keyword that could be used to find relevant stock images.
For the ‘bullet’, if there are no bullets in the given array, convert the given phrase(s) into ONE concise bullet point or combine it into one of the given bullet points. The bullet point should summarize the key ideas clearly and simply, ensuring the main message of the phrase is captured.
If there are 3 bullets in the given array, modify the previous bullet points to add the additional information only if the new information is relevant. These three bullet points should summarize all the information holistically, with not too much emphasis on the latest given point, only adding what is relevant to the overall main message.
If there are 1 or 2 bullets in the given array, first determine whether this is worth adding a new bullet point and if so make a new bullet using the instructions previously mentioned in the no bullets case, but if it is not worth making a new bullet point, modify the previous bullet points to add the additional information if it is relevant as previously mentioned in the 3 bullets case.
Format these in JSON with the short phrase labelled as 'image' and the bullet point be labelled as 'bullet'. Your responses are always in JSON. Plain JSON text, no formatting, single lined, no back ticks, no extra text.`

export async function generatePrompt(prompt, image, bullet) {
    console.log(prompt);
    const formattedPrompt = "words:\n" + prompt.words + "\nbullets:\n" + bullet + "\nprevious image prompt:\n" + image
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the correct model name
            messages: [
                { role: "system", 
                    content: systemPrompt },
                {
                    role: "user",
                    content: formattedPrompt,
                },
            ],
        });

        // Output the generated message
        console.log("arrived at gpt");
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating:", error);
    }
}