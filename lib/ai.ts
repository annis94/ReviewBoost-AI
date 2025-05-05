import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeReview(content: string) {
  const prompt = `
    Analyze the following customer review and provide:
    1. Sentiment (positive, neutral, negative) and score (0-1)
    2. Key topics and keywords mentioned
    3. A concise summary (max 2 sentences)
    
    Review: "${content}"
    
    Respond in JSON format with the following structure:
    {
      "sentiment": {
        "label": "positive|neutral|negative",
        "score": number
      },
      "keywords": string[],
      "summary": string
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    return analysis;
  } catch (error) {
    console.error('Error analyzing review:', error);
    throw error;
  }
} 