# 🚀 AI Provider Router

This document outlines the new **AI Provider Router** added to the project. The router selects a language model provider at runtime using Statsig and generates text via the Vercel AI SDK.

## File Overview

- `src/integrations/ai/router.ts` – Implements `getCompletion()` which
  - Initializes Statsig with `STATSIG_SERVER_KEY`.
  - Reads the `llm_provider` configuration to choose between **Groq**, **xAI** or **DeepInfra**.
  - Calls the selected model using `generateText` from the `ai` package.
  - Logs an `ai_inference` event in Statsig with the provider name and latency.
- `src/integrations/ai/index.ts` – Re-exports the router for easy imports.

## Usage Example

```ts
import { getCompletion } from '@/integrations/ai';

const text = await getCompletion('Hello world', 'user_123');
console.log(text);
```

The Statsig config should contain a JSON object like:

```json
{
  "provider": "groq"
}
```

Change the provider value in Statsig to switch models without redeploying.
