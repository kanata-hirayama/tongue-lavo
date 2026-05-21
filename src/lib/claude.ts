import Anthropic from '@anthropic-ai/sdk'
import { DiagnosisResult } from '@/types'

const client = new Anthropic()

const SYSTEM_PROMPT = `あなたは東洋医学の舌診の専門家です。舌の画像を分析し、必ず以下のJSON形式のみで返してください。前置きや説明文は不要です。

{
  "constitution_type": "kiko|kekkyo|insho|shitsunetsu|kistagnation|oketsu のいずれか",
  "score": 0から100の整数,
  "tongue_color": "淡紅|紅|暗紅|淡白|青紫 のいずれか",
  "tongue_coating": "薄白|白厚|黄|無苔 のいずれか",
  "tongue_shape": "正常|歯痕あり|裂紋あり|腫大 のいずれか",
  "advice": "100字以内のアドバイス",
  "confidence": 0.0から1.0
}`

export async function analyzeTongue(base64Image: string): Promise<DiagnosisResult> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
        { type: 'text', text: 'この舌の画像を東洋医学的に診断してください。' }
      ]
    }]
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
