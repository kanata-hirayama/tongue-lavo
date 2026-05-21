export type ConstitutionType = 'kiko' | 'kekkyo' | 'insho' | 'shitsunetsu' | 'kistagnation' | 'oketsu'

export const CONSTITUTION_LABELS: Record<ConstitutionType, string> = {
  kiko: '気虚', kekkyo: '血虚', insho: '陰虚',
  shitsunetsu: '湿熱', kistagnation: '気滞', oketsu: '瘀血',
}

export const CONSTITUTION_DESCRIPTIONS: Record<ConstitutionType, string> = {
  kiko: 'エネルギー不足傾向。疲れやすく、消化機能が弱い。',
  kekkyo: '血液・栄養不足傾向。肌が乾燥しやすく、貧血気味。',
  insho: '潤い不足傾向。のぼせやすく、口が渇く。',
  shitsunetsu: '熱と湿気がこもる傾向。むくみやニキビが出やすい。',
  kistagnation: '気の流れが滞る傾向。イライラや胸の張りが出やすい。',
  oketsu: '血液の巡りが悪い傾向。肩こりや生理痛が出やすい。',
}

export interface DiagnosisResult {
  constitution_type: ConstitutionType
  score: number
  tongue_color: string
  tongue_coating: string
  tongue_shape: string
  advice: string
  confidence: number
}
