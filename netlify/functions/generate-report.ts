import { Handler } from '@netlify/functions';
import { openai } from './utils/openai';
import { createResponse, createErrorResponse } from './utils/response';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, '');
  }

  // Validate request method
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed');
  }

  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    return createErrorResponse(500, 'OpenAI API key is not configured');
  }

  try {
    const { reportData } = JSON.parse(event.body || '{}');

    if (!reportData) {
      return createErrorResponse(400, 'Missing report data');
    }

    const prompt = `As an expert SaaS financial analyst, analyze these metrics and provide strategic insights:
      
      Current Metrics:
      - MRR: $${reportData.mrr}
      - Subscribers: ${reportData.subscribers}
      - Churn Rate: ${reportData.churnRate}%
      - Growth Rate: ${reportData.growthRate}%
      
      Please provide:
      1. Executive Summary
      2. Key Performance Analysis
      3. Risk Factors
      4. Growth Opportunities
      5. Strategic Recommendations
      
      Format the response in clear sections with actionable insights.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SaaS CFO providing strategic analysis and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const analysisContent = completion.choices[0].message.content;

    // Parse the content into sections
    const sections = [
      {
        title: "Executive Summary",
        content: analysisContent.split("Key Performance Analysis")[0].trim()
      },
      {
        title: "Key Performance Analysis",
        content: analysisContent.split("Key Performance Analysis")[1].split("Risk Factors")[0].trim()
      },
      {
        title: "Risk Assessment",
        content: analysisContent.split("Risk Factors")[1].split("Growth Opportunities")[0].trim()
      },
      {
        title: "Growth Opportunities",
        content: analysisContent.split("Growth Opportunities")[1].split("Strategic Recommendations")[0].trim()
      },
      {
        title: "Strategic Recommendations",
        content: analysisContent.split("Strategic Recommendations")[1].trim()
      }
    ];

    const report = {
      title: "AI-Generated Strategic Analysis",
      date: new Date().toISOString(),
      summary: sections[0].content,
      sections: sections
    };

    return createResponse(200, report);

  } catch (error) {
    return createErrorResponse(500, 'Failed to generate report', error);
  }
};