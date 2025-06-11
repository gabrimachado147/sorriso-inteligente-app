import OpenAI from 'openai';

const apiKey = import.meta.env.XAI_API_KEY;

export const xaiClient = new OpenAI({
  apiKey,
  baseURL: 'https://api.x.ai/v1',
});

export async function askGrok(prompt: string): Promise<string> {
  const completion = await xaiClient.chat.completions.create({
    model: 'grok-2-latest',
    messages: [
      {
        role: 'system',
        content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return completion.choices[0]?.message.content ?? '';
}
