import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key
const openai = new OpenAI({ apiKey: process.env.API_KEY });
const systemPrompt = `
You will be given text with three inputs, one after “words:”, one after “bullets:” which is an array of 3 strings, and one after “previous image prompt:”
First, in the bullets array, if the strings are empty, convert the given phrase(s) into ONE concise bullet point. The bullet point should summarize the key ideas clearly and simply, ensuring the main message of the phrase is captured.
However, if all 3 strings in the array have text, modify the previous bullet points to add the additional information only if the new information is relevant. These three bullet points should summarize all the information holistically, with not too much emphasis on the latest given point, only adding what is relevant to the overall main message.
If there are 1 or 2 strings full but there are still some empty strings, first determine whether this is worth adding a new bullet point and if so make a new bullet using the instructions mentioned in the case where there are no strings, but if it is not worth making a new bullet point, modify the previous bullet points to add the additional information if it is relevant as previously mentioned in the 3 bullets case.
All bullet points should be less than 20 words.
Under no instance should more than one new bullet point be made at once, if there is one or two existing bullet points, you can make another new one, but not make two new ones.
Under no instances should there be 4 items in the array, in a case where there is additional information, find a way to combine it into the current bullet points.
If you do not believe that the given phrase is relevant for a bullet point remember it for context in the future, but do not make any changes to the array of bullets.
Format these in JSON with the short phrase labelled as 'image' and the array of the bullet points be labelled as 'bullets’. Your responses are always in JSON. Plain JSON text, no formatting, single lined, no back ticks, no extra text.

`

export async function generatePrompt(prompt, bullet, image) {
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
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating:", error);
    }
}

const systemPromptSummarizer = `
You are a summarizer that will return 3 short bullet points from a list of given bullet points.
Format these in JSON with the short phrase labelled as an array of the bullet points be labelled as 'bullets’.
Your responses are always in JSON. Plain JSON text, no formatting, single lined, no back ticks, no extra text.
`

export async function generateSummary(bullets) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the correct model name
            messages: [
                { role: "system", 
                    content: systemPromptSummarizer },
                {
                    role: "user",
                    content: bullets,
                },
            ],
        });

        // Output the generated message
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating:", error);
    }
}