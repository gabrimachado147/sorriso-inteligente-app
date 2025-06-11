import { fal } from '@fal-ai/client'
import { ElevenLabsClient } from '@elevenlabs/client'
import { supabase } from '../integrations/supabase/client'

fal.config({ credentials: process.env.FAL_API_KEY as string })

const voiceId = process.env.ELEVENLABS_VOICE_ID || 'Rachel'

export async function generateVSL(script: string) {
  // Generate audio using ElevenLabs
  const eleven = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY as string })
  const audioRes = await eleven.generate({ text: script, voice: voiceId })
  const audioBuffer = Buffer.from(await audioRes.arrayBuffer())
  const audioName = `vsl/${Date.now()}.mp3`
  await supabase.storage.from('vsl_assets').upload(audioName, audioBuffer, { contentType: 'audio/mpeg' })
  const { data: audioUrlData } = supabase.storage.from('vsl_assets').getPublicUrl(audioName)

  // Generate images using fal
  const { images } = await fal.run('fal-ai/fast-turbo-diffusion', { prompt: script }) as { images: string[] }
  const imageUrls: string[] = []
  for (const [i, url] of images.entries()) {
    const res = await fetch(url)
    const imgBuffer = Buffer.from(await res.arrayBuffer())
    const name = `vsl/${Date.now()}_${i}.png`
    await supabase.storage.from('vsl_assets').upload(name, imgBuffer, { contentType: 'image/png' })
    const { data } = supabase.storage.from('vsl_assets').getPublicUrl(name)
    if (data?.publicUrl) imageUrls.push(data.publicUrl)
  }

  return { audioUrl: audioUrlData?.publicUrl, imageUrls }
}
