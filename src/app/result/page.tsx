'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DiagnosisResult, CONSTITUTION_LABELS, CONSTITUTION_DESCRIPTIONS } from '@/types'

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const raw = sessionStorage.getItem('diagnosis_result')
    const img = sessionStorage.getItem('diagnosis_image')
    if (!raw) { router.push('/scan'); return }
    setResult(JSON.parse(raw))
    setImage(img)
  }, [router])

  if (!result) return null

  const scoreColor = result.score >= 80 ? '#1D9E75' : result.score >= 60 ? '#BA7517' : '#A32D2D'

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <button onClick={() => router.push('/scan')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>診断結果</h1>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderRadius: '50%', border: `4px solid ${scoreColor}`, marginBottom: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 500, color: scoreColor }}>{result.score}</span>
          <span style={{ fontSize: 11, color: '#999' }}>/ 100</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>{CONSTITUTION_LABELS[result.constitution_type]}タイプ</div>
        <div style={{ fontSize: 13, color: '#666' }}>{CONSTITUTION_DESCRIPTIONS[result.constitution_type]}</div>
      </div>
      {image && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <img src={image} alt="診断した舌" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} />
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>舌の状態</div>
        {[
          { label: '色', value: result.tongue_color },
          { label: '苔', value: result.tongue_coating },
          { label: '形', value: result.tongue_shape },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f5f4f0', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: '#666' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ background: '#f5f4f0', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 14, lineHeight: 1.8, color: '#666' }}>
        <div style={{ fontWeight: 500, color: '#1a1a18', marginBottom: 6, fontSize: 13 }}>おすすめのケア</div>
        {result.advice}
      </div>
      <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ fontSize: 24 }}>💬</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>LINEで詳細レポートを受け取る</div>
          <div style={{ fontSize: 11, color: '#0F6E56' }}>体質別の食事・生活アドバイスをお届け</div>
        </div>
        <div style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500 }}>登録 →</div>
      </div>
      <button onClick={() => router.push('/scan')} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'transparent', border: '1px solid #ddd', fontSize: 14, cursor: 'pointer', color: '#666' }}>もう一度診断する</button>
    </main>
  )
}
