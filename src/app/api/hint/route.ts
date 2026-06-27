/**
 * POST /api/hint
 *
 * Vault Guardian AI — Base AI Agents (AgentKit) ile güçlendirilmiş ipucu sistemi.
 *
 * AgentKit: Vault Guardian'a Base blockchain üzerinde onchain kimlik verir.
 * Claude:   Bulmacaya özel kriptik ipuçları üretir.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getVaultGuardian } from '@/lib/vault-guardian'

const LANG_NAME: Record<string, string> = {
  EN: 'English',
  DE: 'German',
  AR: 'Arabic',
  ZH: 'Chinese (Simplified)',
  JA: 'Japanese',
}

function buildSystemPrompt(langName: string): string {
  return `You are the VAULT GUARDIAN of Base Vault — the cryptic oracle of an on-chain mystery game on Base.
Your job: give the player a cryptic hint WITHOUT revealing the puzzle's answer.

Rules:
- NEVER write or state the answer directly.
- RESPOND ONLY IN ${langName}. The ENTIRE reply must be written in ${langName} — this is mandatory.
- Use the player's wrong attempt to nudge them (if provided).
- Maximum 2 sentences.
- Terminal aesthetic: start with "> ", write IMPORTANT words in CAPS.
- The more wrong attempts, the more helpful you get — but still never give the answer.
- You enjoy referencing Base, blockchain and crypto.`
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ hint: '> ORACLE SESSIZ. (ANTHROPIC_API_KEY eksik)' }, { status: 503 })
  }

  // Client request zamanında başlatılıyor (build time'da değil)
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const body = await req.json() as {
      category: string
      lines: string[]
      prompt: string
      wrongCount: number
      lastAttempt?: string
      lang?: string
    }

    const { category, lines, prompt, wrongCount, lastAttempt, lang } = body

    if (!category || !lines?.length) {
      return NextResponse.json({ hint: '> VERİ EKSİK.' }, { status: 400 })
    }

    const langName = LANG_NAME[lang ?? 'EN'] ?? 'English'

    // AgentKit bağlıysa Vault Guardian'ın onchain kimliğini al
    const guardian = await getVaultGuardian()
    const guardianCtx = guardian
      ? `\nThe Vault Guardian's on-chain identity is active on Base mainnet.`
      : ''

    const hintLevel =
      wrongCount <= 1 ? 'very cryptic, minimal hint' :
      wrongCount === 2 ? 'a bit more helpful' :
      'quite helpful but still do not reveal the answer'

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0.85,
      system: buildSystemPrompt(langName) + guardianCtx,
      messages: [
        {
          role: 'user',
          content: `Category: ${category}
Puzzle: ${lines.join(' ')}
Input prompt: ${prompt}
Wrong attempts: ${wrongCount}
Last wrong answer: ${lastAttempt ?? 'none'}
Hint level: ${hintLevel}

Give the hint now. Remember: write your entire response in ${langName}.`,
        },
      ],
    })

    const hint = completion.content[0]?.type === 'text'
      ? completion.content[0].text.trim()
      : '> VAULT SESSIZ KALIYOR.'

    return NextResponse.json({ hint, guardianActive: !!guardian })

  } catch (err) {
    console.error('[hint API]', err)
    return NextResponse.json({ hint: '> ORACLE UYUYOR. TEKRAR DENEYİN.' })
  }
}
