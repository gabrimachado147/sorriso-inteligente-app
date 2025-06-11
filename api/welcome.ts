import { get } from '@vercel/edge-config';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const greeting = await get('greeting');
  return new Response(JSON.stringify(greeting), {
    headers: { 'Content-Type': 'application/json' },
  });
}
