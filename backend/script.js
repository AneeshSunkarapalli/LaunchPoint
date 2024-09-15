// Import required modules
import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';  // Add Express for routing
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is stored securely in the .env file
});

// Initialize Express app
const app = express();
const port = 3000;

// Use CORS middleware to allow requests from the frontend
app.use(cors());
app.use(express.json());  // Middleware to parse JSON requests

// Function to get a chat completion from OpenAI using GPT-4
async function getChatCompletion(prompt, model = "gpt-4") {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    // Return the response
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch response from OpenAI");
  }
}

// Function to generate the prompt based on business type and location
function generatePrompt(businessType, city, state, cuisine = null) {
  let prompt = "";

  // If the business is a restaurant, use the cuisine type
  if (businessType === "restaurant") {
    prompt = `If I want to open up a location for a ${cuisine} restaurant in ${city}, ${state}, with the factors of competitive businesses in the area (restaurants of the same cuisine), popular establishments nearby, demographics of the city, and the socio-economic conditions of the area, all taken into account in the form of an algorithm weighing the factors proportionately but with competition particularly being slightly more important than the other factors, produce a score out of 100 indicating if the city is optimal for a small business owner to open a restaurant. Don't provide any explanations for this score. Following the score, however, give me a concise explanation for each factor as to why it affects the overall score in the context of opening a new business in that specific city.

If there’s an alternative city within 50 miles that would produce a better score based on the algorithm using the previous factors, then give me the best alternative city and provide an explanation of each factor like you did with the original city. Don’t be inclined to find an alternative if there truly isn’t one, only do it if there is an alternative city that actually is better from feature to feature and highlight why it would be better in the explanation. When explaining each factor of the city, or cities, try to utilize relevant and accurate statistics that might contribute to its explanation and the overall rating of that city. For the demographic explanation, end it off with the statistic for the population of the city. For the socio-economic explanation, end it off with the median household income of the city. Remove the sources for each of those 2 statistics.`;
  } else {
    // General business prompt with your updated instructions
    prompt = `If I want to open up a location for a ${businessType} business in ${city}, ${state}, with the factors of competitive businesses in the area (same types of businesses), popular establishments nearby, demographics of the city, and the socio-economic conditions of the area, all taken into account in the form of an algorithm weighing the factors proportionately but with competition particularly being slightly more important than the other factors, produce a score out of 100 indicating if the city is optimal for a small business owner to open their business there. Don't provide any explanations for this score. Following the score, however, give me a concise explanation for each factor as to why it affects the overall score in the context of opening a new business in that specific city.

If there’s an alternative city within 50 miles that would produce a better score based on the algorithm using the previous factors, then give me the best alternative city and provide an explanation of each factor like you did with the original city. Don’t be inclined to find an alternative if there truly isn’t one, only do it if there is an alternative city that actually is better from feature to feature and highlight why it would be better in the explanation. When explaining each factor of the city, or cities, try to utilize relevant and accurate statistics that might contribute to its explanation and the overall rating of that city. For the demographic explanation, end it off with the statistic for the population of the city. For the socio-economic explanation, end it off with the median household income of the city. Remove the sources for each of those 2 statistics.`;
  }

  return prompt;
}

// API route to handle POST request from the frontend
app.post('/api/generate-business-score', async (req, res) => {
  const { businessType, cuisine, city, state } = req.body;

  // Validate input
  if (!businessType || !city || !state) {
    return res.status(400).json({ error: "Please provide businessType, city, and state." });
  }

  try {
    // Generate the prompt based on user input
    const prompt = generatePrompt(businessType, city, state, cuisine);

    // Call OpenAI API with the generated prompt
    const response = await getChatCompletion(prompt);

    // Assuming the response contains a score and factors (you need to parse the response accordingly)
    const [score, ...factors] = response.split("\n"); // Modify this to fit your response structure

    // Return the response as an object
    res.json({ score: score.trim(), factors: factors.map(factor => factor.trim()) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});