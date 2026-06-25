/**
 * /api/unlock — x402 payment-gated premium hint endpoint
 *
 * Players pay 0.01 USDC (via x402 protocol — EIP-3009 on Base) to unlock
 * a premium, near-solution hint for the current Vault tier.
 * No payment header → HTTP 402 with payment requirements.
 *
 * This complements the free AI Guardian hints at /api/hint:
 *   /api/hint   → free cryptic AI hints (AgentKit + OpenAI)
 *   /api/unlock → paid premium hints (x402 micropayment)
 */
import { NextRequest, NextResponse } from 'next/server'
import { useFacilitator } from 'x402/verify'
import { decodePayment } from 'x402/schemes'

const TREASURY     = '0xD4F1254C803662c46D9c21f80F4F3c15FF57e2c9'
const USDC_BASE    = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const PRICE        = '10000' // 0.01 USDC (6 decimals)
const RESOURCE     = 'https://vaultgame.online/api/unlock'

// Base Builder Code — x402 ödemeleri bu koda attribute edilir.
// @x402/extensions paketi Vercel build'ini bozuyordu; çıktısı statik
// olduğu için elle gömüyoruz (declareBuilderCodeExtension('bc_6nhhetq2')).
const BUILDER_CODE      = 'builder-code'
const BUILDER_CODE_EXT  = { info: { a: 'bc_6nhhetq2' } }

const paymentRequirements = {
  scheme:            'exact' as const,
  network:           'base'  as const,
  maxAmountRequired: PRICE,
  resource:          RESOURCE,
  description:       'Unlock a premium Vault hint for 0.01 USDC',
  mimeType:          'application/json',
  payTo:             TREASURY,
  maxTimeoutSeconds: 300,
  asset:             USDC_BASE,
  extra: {
    name:    'USD Coin',
    version: '2',
  },
  // Builder Code attribution (seller / resource server)
  extensions: {
    [BUILDER_CODE]: BUILDER_CODE_EXT,
  },
}

// Premium hints per tier — sent only after on-chain payment is verified
const PREMIUM_HINTS: Record<string, string> = {
  '1': '> PREMIUM: İlk şifre insanlığın bildiği EN ESKİ şifrelemeyi kullanır. Romalı generalleri düşün — harfleri 13 pozisyon KAYDIR.',
  '2': '> PREMIUM: İkili sistem makinelerin dilidir. Her 0 ve 1 anlamlıdır. 8\'erli GRUPLA ve bilgisayarın ne dediğini dinle.',
  '3': '> PREMIUM: Hash tek yönlü bir yoldur ama cevap hep kısaydı. Vault SHA-256 kullanır — hash\'i 0000 ile başlayan, küçük harfli 5 harfli kelime hangisi?',
}

export async function GET(req: NextRequest) {
  const tier          = req.nextUrl.searchParams.get('tier') || '1'
  const paymentHeader = req.headers.get('X-PAYMENT')

  // ── No payment → return 402 with x402 requirements ───────────────────────
  if (!paymentHeader) {
    return NextResponse.json(
      {
        x402Version: 1,
        accepts:     [paymentRequirements],
        error:       'Payment required to unlock premium hint',
      },
      {
        status:  402,
        headers: {
          'X-PAYMENT-REQUIREMENTS':        JSON.stringify([paymentRequirements]),
          'Access-Control-Expose-Headers': 'X-PAYMENT-REQUIREMENTS',
        },
      },
    )
  }

  // ── Verify + settle payment via Coinbase x402 facilitator ─────────────────
  try {
    // X-PAYMENT base64 → decoded PaymentPayload
    const decoded = decodePayment(paymentHeader)

    // CDP key'leri varsa → Coinbase CDP facilitator (Base MAINNET settlement).
    // Yoksa → public facilitator (yalnız testnet/doğrulama için yeterli).
    let facilitatorConfig: unknown = { url: 'https://x402.org/facilitator' }
    const cdpId     = process.env.CDP_API_KEY_ID
    const cdpSecret = process.env.CDP_API_KEY_SECRET
    if (cdpId && cdpSecret) {
      try {
        const { createFacilitatorConfig } = await import('@coinbase/x402')
        facilitatorConfig = createFacilitatorConfig(cdpId, cdpSecret)
      } catch (e) {
        console.error('[x402] CDP facilitator yüklenemedi, public kullanılıyor:', e)
      }
    }

    const { verify, settle } = useFacilitator(facilitatorConfig as never)

    const result = await verify(decoded as never, paymentRequirements as never)
    if (!result.isValid) {
      return NextResponse.json(
        { error: 'Invalid payment', details: result.invalidReason },
        { status: 402 },
      )
    }

    // Settle on-chain (gerçek USDC transferi)
    const settlement = await settle(decoded as never, paymentRequirements as never)

    const hint = PREMIUM_HINTS[tier] || PREMIUM_HINTS['1']
    return NextResponse.json({
      tier,
      hint,
      paid:    true,
      payer:   result.payer,
      txHash:  (settlement as { transaction?: string })?.transaction ?? null,
    })
  } catch (err) {
    console.error('[x402 unlock]', err)
    const raw = err instanceof Error ? err.message : 'Payment verification failed'
    // Bilinen facilitator hatalarını kullanıcı dostu hale getir
    const friendly =
      /self_send/i.test(raw)        ? 'You cannot pay yourself — use a different wallet.' :
      /insufficient|balance/i.test(raw) ? 'Not enough USDC on Base.' :
      raw.slice(0, 140)
    return NextResponse.json({ error: friendly }, { status: 402 })
  }
}
