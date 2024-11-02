// netlify/functions/generateAnalysis.js

import { Configuration, OpenAIApi } from 'openai';

// Configure OpenAI with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API client
const openai = new OpenAIApi(configuration);

// Export the generateAnalysis function
export async function generateAnalysis(metrics: {
  mrr: number;
  subscribers: number;
  churnRate: number;
  growthRate: number;
}) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SaaS CFO providing strategic analysis and recommendations."
        },
        {
          role: "user",
          content: `Analyze these SaaS metrics and provide strategic insights:
            MRR: $${metrics.mrr}
            Subscribers: ${metrics.subscribers}
            Churn Rate: ${metrics.churnRate}%
            Growth Rate: ${metrics.growthRate}%
            
            Consider the following aspects in your analysis:
            1. Revenue growth trajectory
            2. Customer retention strategies
            3. Unit economics
            4. Market positioning
            5. Operational efficiency`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Return the generated analysis
    return completion.data.choices[0].message.content;
  } catch (error) {
    // Log the error for debugging
    console.error('Error generating analysis:', error.response ? error.response.data : error.message);
    // Throw a user-friendly error message
    throw new Error('Failed to generate analysis.');
  }
}
