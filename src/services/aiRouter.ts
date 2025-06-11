import { groq, deepinfra, xai } from '@ai-sdk/providers'
import { StatsigUser, initialize, getConfig, logEvent } from 'statsig-node-lite'

/**
 * Returns a text completion using the provider chosen by the Statsig flag.
 * @param prompt The text prompt
 * @param userId Identifier for the requesting user
 */
export async function getCompletion(prompt: string, userId: string): Promise<string> {
  await initialize(process.env.STATSIG_SERVER_API_KEY!, { environment: process.env.NODE_ENV })
  const statsigUser: StatsigUser = { userID: userId }
  const providerFlag = await getConfig(statsigUser, 'llm_provider')

  const providerMap = {
    groq: groq('mixtral-8x7b'),
    xai: xai('grok-2'),
    deepinfra: deepinfra('llama3-70b'),
  } as const

  const model = providerMap[providerFlag?.getValue() as keyof typeof providerMap] ?? providerMap.groq

  const start = Date.now()
  const res = await model.complete(prompt)
  const ms = Date.now() - start

  logEvent(statsigUser, 'ai_inference', { provider: providerFlag?.getValue(), ms })

  return res.text
}
