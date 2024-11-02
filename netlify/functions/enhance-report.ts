import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Changed from VITE_OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'OpenAI API key is not configured' }),
    };
  }

  // Rest of the code remains exactly the same
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { initialReport, metrics } = JSON.parse(event.body || '{}');

    if (!initialReport || !metrics) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required data' }),
      };
    }

    const prompt = `As an experienced SaaS CFO and financial analyst, review and enhance the following financial report with strategic insights and actionable recommendations. Focus on identifying key opportunities, risks, and specific action items.

Current Report:
${initialReport.map(section => `
${section.title}:
${section.content}`).join('\n\n')}

Key Metrics:
- MRR: $${metrics.mrr}
- Subscribers: ${metrics.subscribers}
- Churn Rate: ${metrics.churnRate}%
- Growth Rate: ${metrics.growthRate}%

Provide enhanced analysis focusing on:
1. Strategic implications of the current metrics
2. Specific, actionable recommendations
3. Risk mitigation strategies
4. Growth opportunities
5. Operational improvements

For each section, add detailed insights and concrete action items that the business can implement.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SaaS CFO providing strategic analysis and recommendations. Focus on actionable insights and specific implementation steps."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Add GPT's strategic insights to the original sections
    const enhancedSections = initialReport.map((section: any) => {
      const gptInsights = extractInsightsForSection(completion.choices[0].message.content, section.title);
      return {
        ...section,
        content: section.content + '\n\nStrategic Insights:\n' + gptInsights
      };
    });

    // Add a new "Strategic Recommendations" section
    enhancedSections.push({
      title: "Strategic Recommendations",
      content: extractRecommendations(completion.choices[0].message.content)
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(enhancedSections)
    };
  } catch (error) {
    console.error('Error enhancing report:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to enhance report',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

function extractInsightsForSection(content: string, sectionTitle: string): string {
  const sectionRegex = new RegExp(`${sectionTitle}[:\\n]([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
  const match = content.match(sectionRegex);
  return match ? match[1].trim() : '';
}

function extractRecommendations(content: string): string {
  const recommendationsRegex = /recommendations?[:\\n]([\s\S]*?)(?=\n\n|$)/i;
  const match = content.match(recommendationsRegex);
  return match ? match[1].trim() : '';
}