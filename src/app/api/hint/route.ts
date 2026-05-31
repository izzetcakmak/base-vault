/**
 * POST /api/hint
 *
 * Vault Guardian AI — Base AI Agents (AgentKit) ile güçlendirilmiş ipucu sistemi.
 *
 * AgentKit: Vault Guardian'a Base blockchain üzerinde onchain kimlik verir.
 * OpenAI:   Bulmacaya özel kriptik ipuçları üretir.
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getVaultGuardian } from '@/lib/vault-guardian'

const SYSTEM_PROMPT = `Sen BASE VAULT'un VAULT GUARDIAN'ısın — Base blockchain üzerindeki gizemli bir on-chain oyununun oracle'ı.
Görevin: Oyunculara bulmacayı doğrudan söylemeden kriptik ipuçları vermek.

Kurallar:
- Cevabı ASLA açıkça yazma veya söyleme
- Bulmaca Türkçeyse Türkçe, İngilizce ise İngilizce yanıt ver
- Oyuncunun yanlış cevabını kullanarak yönlendir (varsa)
- Maksimum 2 cümle
- Terminal estetiğine uy: "> " ile başla, ÖNEMLİ kelimeleri büyük yaz
- Yanlış sayısı arttıkça daha yardımcı ol (ama cevabı yine de söyleme)
- Base blockchain ve kripto dünyasına referans vermeyi sev`

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ hint: '> ORACLE SESSIZ. (OPENAI_API_KEY eksik)' }, { status: 503 })
  }

  // Client request zamanında başlatılıyor (build time'da değil)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const body = await req.json() as {
      category: string
      lines: string[]
      prompt: string
      wrongCount: number
      lastAttempt?: string
    }

    const { category, lines, prompt, wrongCount, lastAttempt } = body

    if (!category || !lines?.length) {
      return NextResponse.json({ hint: '> VERİ EKSİK.' }, { status: 400 })
    }

    // AgentKit bağlıysa Vault Guardian'ın onchain kimliğini al
    const guardian = await getVaultGuardian()
    const guardianCtx = guardian
      ? `\nVault Guardian onchain kimliği aktif. Base mainnet'te çalışıyor.`
      : ''

    const hintLevel =
      wrongCount <= 1 ? 'çok kriptik, minimal ipucu' :
      wrongCount === 2 ? 'biraz daha yardımcı' :
      'oldukça yardımcı ama cevabı söyleme'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + guardianCtx },
        {
          role: 'user',
          content: `Kategori: ${category}
Bulmaca: ${lines.join(' ')}
Giriş komutu: ${prompt}
Yanlış deneme: ${wrongCount}
Son yanlış cevap: ${lastAttempt ?? 'yok'}
İpucu seviyesi: ${hintLevel}

İpucunu ver.`,
        },
      ],
      max_tokens: 120,
      temperature: 0.85,
    })

    const hint = completion.choices[0]?.message?.content?.trim() ?? '> VAULT SESSIZ KALIYOR.'
    return NextResponse.json({ hint, guardianActive: !!guardian })

  } catch (err) {
    console.error('[hint API]', err)
    return NextResponse.json({ hint: '> ORACLE UYUYOR. TEKRAR DENEYİN.' })
  }
}
