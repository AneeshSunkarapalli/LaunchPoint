// Import required modules
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is stored securely in the .env file
});

// Function to get a chat completion from OpenAI
async function getChatCompletion(prompt, model = "gpt-3.5-turbo") {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    // Output the response
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example usage
const prompt = "Translate into Spanish: As a beginner data scientist, I'm excited to learn about OpenAI API!";
getChatCompletion(prompt);
