import { NextRequest, NextResponse } from 'next/server'
import { analyzeTongue } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { image_base64 } = await req.json()
    if (!image_base64) return NextResponse.json({ error: '画像データが必要です' }, { status: 400 })
    const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '')
    const result = await analyzeTongue(base64Data)
    if (result.confidence < 0.3) {
      return NextResponse.json({ error: '画像が不鮮明です。明るい場所で撮り直してください。' }, { status: 422 })
    }
    return NextResponse.json({ result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '診断に失敗しました。もう一度お試しください。' }, { status: 500 })
  }
}
