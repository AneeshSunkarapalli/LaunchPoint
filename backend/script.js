// Import required modules
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is stored securely in the .env file
});

// Function to get a chat completion from OpenAI using GPT-4
async function getChatCompletion(prompt, model = "gpt-4") {
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

// Function to generate the prompt based on business type and location
function generatePrompt(businessType, city, state, cuisine = null) {
  let prompt = "";

  // If the business is a restaurant, use the cuisine type
  if (businessType === "restaurant") {
    prompt = `If I want to open up a location for a ${cuisine} restaurant in ${city}, ${state}, with the factors of competitive businesses in the area (restaurants of the same cuisine), popular establishments nearby, demographics of the city, and the socio-economic conditions of the area, all taken into account in the form of an algorithm weighing the factors proportionately but with competition particularly being slightly more important than the other factors, produce a score out of 100 indicating if the city is optimal for a small business owner to open a restaurant. Don't provide any explanations for this score. Following the score, however,  give me a concise explanation for each factor as to why it affects the overall score in the context of opening a new business in that specific city.`;
  } else {
    // General business prompt
    prompt = `If I want to open up a location for a ${businessType} business in ${city}, ${state}, with the factors of competitive businesses in the area (same types of businesses), popular establishments nearby, demographics of the city, and the socio-economic conditions of the area, all taken into account in the form of an algorithm weighing the factors proportionately but with competition particularly being slightly more important than the other factors, produce a score out of 100 indicating if the city is optimal for a small business owner to open their business there. Don't provide any explanations for this score. Following the score, however,  give me a concise explanation for each factor as to why it affects the overall score in the context of opening a new business in that specific city.`;
  }

  return prompt;
}

// Example usage (dynamic)
const businessType = "restaurant"; // This can be dynamic based on user input
const cuisine = "Italian"; // Optional, only if it's a restaurant
const city = "San Francisco";
const state = "CA";

// Generate the prompt based on the type of business
const prompt = generatePrompt(businessType, city, state, cuisine);

// Call OpenAI API with the generated prompt
getChatCompletion(prompt);
