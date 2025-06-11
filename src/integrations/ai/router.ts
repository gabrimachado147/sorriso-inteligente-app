import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { deepinfra } from '@ai-sdk/deepinfra';
import { Statsig, type StatsigUser } from 'statsig-node';
import { generateText } from 'ai';

/**
 * Generate a text completion using the provider defined by Statsig.
 * The Statsig config `llm_provider` controls which provider is used.
 */
export async function getCompletion(prompt: string, userId: string) {
  await Statsig.initialize(process.env.STATSIG_SERVER_KEY!);

  const statsigUser: StatsigUser = { userID: userId };
  const config = Statsig.getConfig(statsigUser, 'llm_provider');
  const provider = config.getValue('provider', 'groq') as string;

  const providerMap = {
    groq: groq('mixtral-8x7b-32768'),
    xai: xai('grok-2'),
    deepinfra: deepinfra('llama3-70b')
  } as const;

  const key = (provider as keyof typeof providerMap) || 'groq';
  const model = providerMap[key];

  const start = Date.now();
  const { text } = await generateText({ model, prompt });
  const ms = Date.now() - start;

  Statsig.logEvent(statsigUser, 'ai_inference', ms, { provider: key });
  return text ?? '';
}
