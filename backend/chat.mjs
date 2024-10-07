import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with the API key
const openai = new OpenAI({ apiKey: process.env.API_KEY });
const systemPrompt = `
You will be provided with text containing three inputs: one after "words:", one after "bullets:" (an array of 3 strings), and one after "previous image prompt:". Follow these steps:

1. **If the 3 bullet strings are empty:** Convert the given phrase(s) into **one** concise bullet point. Summarize the main ideas clearly and simply. The bullet should not exceed 20 words.

2. **If all 3 bullets have text:** Modify the existing bullet points by adding any **relevant** information from the new phrase(s). Ensure the summary remains holistic, without overemphasizing the new data. The final result should still contain exactly 3 bullet points, with all content integrated seamlessly.

3. **If 1 or 2 bullets are full, but some are empty:** First, assess if the new phrase(s) warrant creating **one** new bullet point. If necessary, add a bullet (following the rules from step 1). If no new bullet is needed, modify the existing ones, as per step 2. Do **not** exceed 3 bullets.

4. **No more than one new bullet point may be created at a time.** If one or two bullet points exist, you may add one more, but never more than one. Under no circumstance should there be more than 3 bullet points total.

5. **Irrelevant information:** If the given phrase isn’t relevant for a bullet point, save it for potential future context, but do not modify the bullets.

6. Use the newly generated bullet points to come up with the best keywords to generate an image, if it is similar to the “previous image prompt” or if the “previous image prompt” incapsulates the idea well, do not change it and simply pass the previous image prompt you were initially given as the “image” in the output

Return output in JSON format. Use this structure:
- "image": (the short phrase/keyword you generate based on the words),
- "bullets": (an array of up to 3 bullet points).

**Plain JSON only**—no formatting, no extra text.

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

generatePrompt("I like michael jordan, he is my favourite basketball player. I really think he is the best of all time", ["","",""], "");