'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [captured, setCaptured] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCaptured(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const diagnose = async () => {
    if (!captured) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: captured }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      sessionStorage.setItem('diagnosis_result', JSON.stringify(data.result))
      sessionStorage.setItem('diagnosis_image', captured)
      router.push('/result')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '診断に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>舌Lavo</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>舌を撮影して体質をチェック</p>

      <div style={{ background: '#f5f4f0', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
        {captured ? (
          <img src={captured} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>+</div>
            <p style={{ fontSize: 14 }}>下のボタンで舌を撮影してください</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {error && <div style={{ background: '#fcebeb', color: '#a32d2d', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {!captured && (
        <div style={{ background: '#f5f4f0', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#666' }}>
          <strong style={{ color: '#1a1a18' }}>撮影のコツ</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18, lineHeight: 2 }}>
            <li>明るい場所で撮影する</li>
            <li>舌を自然に出す</li>
            <li>食事の30分後は避ける</li>
          </ul>
        </div>
      )}

      {!captured && (
        <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: 14, borderRadius: 12, background: '#1a1a18', color: '#fff', fontWeight: 500, fontSize: 15, border: 'none', cursor: 'pointer' }}>
          カメラで撮影する
        </button>
      )}

      {captured && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setCaptured(null); fileRef.current?.click() }} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'transparent', border: '1px solid #ddd', fontSize: 14, cursor: 'pointer' }}>撮り直す</button>
          <button onClick={diagnose} disabled={loading} style={{ flex: 2, padding: 14, borderRadius: 12, background: '#1a1a18', color: '#fff', fontWeight: 500, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? '診断中...' : 'AIで診断する'}</button>
        </div>
      )}
    </main>
  )
}
