import { NextRequest, NextResponse } from 'next/server'
import { analyzeTongue } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { image_base64 } = await req.json()
    if (!image_base64) return NextResponse.json({ error: '画像データが必要です' }, { status: 400 })
    const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '')
    
    // サイズチェック（5MB以上はエラー）
    const sizeInMB = (base64Data.length * 0.75) / (1024 * 1024)
    if (sizeInMB > 5) {
      return NextResponse.json({ error: '画像が大きすぎます。もう一度撮影してください。' }, { status: 413 })
    }
    
    const result = await analyzeTongue(base64Data)
    if (result.confidence < 0.3) {
      return NextResponse.json({ error: '画像が不鮮明です。明るい場所で撮り直してください。' }, { status: 422 })
    }
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Diagnose error:', error)
    const message = error instanceof Error ? error.message : '不明なエラー'
    return NextResponse.json({ error: `診断に失敗しました: ${message}` }, { status: 500 })
  }
}
