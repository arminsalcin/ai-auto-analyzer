import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

import { generatePrompt } from './generatePrompt.js';

export async function analyzeWithVision({ carData }) {
  try {
  

    const prompt = generatePrompt(carData);

    // Call OpenAI API for vision analysi
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      ...prompt,
    });

    return {
      analysis: response.choices[0]?.message?.content || 'No analysis available',
      totalTokens: response.usage?.total_tokens || 0
    } 
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Vision analysis failed: ${error.message}`);
    }
    throw new Error('Vision analysis failed');
  }
}