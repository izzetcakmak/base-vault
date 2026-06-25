'use client'

import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { createPaymentHeader } from 'x402/client'
import type { Lang } from '@/data/puzzles'

// ─── Localized strings ─────────────────────────────────────────────────────────
type UI = {
  title: string; subtitle: string; intro: string
  walletReq: string; price: string
  tierLabel: (n: string) => string
  buy: string; signing: string; paying: string
  successTitle: string; txLabel: string
  errCancel: string; errNoUsdc: string; errGeneric: string
  back: string; chooseTier: string
}

const T: Record<Lang, UI> = {
  EN: {
    title: 'VAULT SHOP', subtitle: 'PAY-PER-HINT // x402 ON BASE',
    intro: 'Stuck on a cipher? Buy a premium, near-solution hint for 0.01 USDC. Paid instantly on Base with the x402 protocol — you sign once, no gas, no checkout.',
    walletReq: 'Connect your wallet to use the shop.', price: '0.01 USDC',
    tierLabel: n => `Tier ${n} premium hint`,
    buy: 'UNLOCK HINT — 0.01 USDC', signing: '> SIGN IN WALLET...', paying: '> SETTLING ON BASE...',
    successTitle: '> PREMIUM HINT UNLOCKED', txLabel: 'Payment TX',
    errCancel: 'Signature cancelled.', errNoUsdc: 'Not enough USDC on Base.', errGeneric: 'Payment failed.',
    back: '← Home', chooseTier: 'CHOOSE A TIER',
  },
  DE: {
    title: 'VAULT SHOP', subtitle: 'HINWEIS KAUFEN // x402 AUF BASE',
    intro: 'Bei einer Chiffre festgefahren? Kaufe einen Premium-Hinweis für 0,01 USDC. Sofort auf Base via x402 bezahlt — einmal signieren, kein Gas, kein Checkout.',
    walletReq: 'Verbinde deine Wallet, um den Shop zu nutzen.', price: '0,01 USDC',
    tierLabel: n => `Stufe ${n} Premium-Hinweis`,
    buy: 'HINWEIS FREISCHALTEN — 0,01 USDC', signing: '> IN WALLET SIGNIEREN...', paying: '> ABWICKLUNG AUF BASE...',
    successTitle: '> PREMIUM-HINWEIS FREIGESCHALTET', txLabel: 'Zahlungs-TX',
    errCancel: 'Signatur abgebrochen.', errNoUsdc: 'Nicht genug USDC auf Base.', errGeneric: 'Zahlung fehlgeschlagen.',
    back: '← Startseite', chooseTier: 'STUFE WÄHLEN',
  },
  AR: {
    title: 'متجر الخزنة', subtitle: 'ادفع مقابل التلميح // x402 على BASE',
    intro: 'عالق في شيفرة؟ اشترِ تلميحاً متميزاً مقابل 0.01 USDC. يُدفع فوراً على Base عبر بروتوكول x402 — توقّع مرة واحدة، بلا غاز، بلا دفع معقّد.',
    walletReq: 'اربط محفظتك لاستخدام المتجر.', price: '0.01 USDC',
    tierLabel: n => `تلميح متميز للمستوى ${n}`,
    buy: 'افتح التلميح — 0.01 USDC', signing: '> وقّع في المحفظة...', paying: '> جارٍ التسوية على Base...',
    successTitle: '> تم فتح التلميح المتميز', txLabel: 'معاملة الدفع',
    errCancel: 'أُلغي التوقيع.', errNoUsdc: 'لا يوجد USDC كافٍ على Base.', errGeneric: 'فشل الدفع.',
    back: '← الرئيسية', chooseTier: 'اختر مستوى',
  },
  ZH: {
    title: '保险库商店', subtitle: '按提示付费 // BASE 上的 x402',
    intro: '卡在密码上了？花 0.01 USDC 购买接近答案的高级提示。通过 x402 协议在 Base 上即时支付——签名一次，无需 Gas，无需结账。',
    walletReq: '连接钱包以使用商店。', price: '0.01 USDC',
    tierLabel: n => `第${n}关高级提示`,
    buy: '解锁提示 — 0.01 USDC', signing: '> 在钱包中签名...', paying: '> 正在 BASE 上结算...',
    successTitle: '> 高级提示已解锁', txLabel: '支付交易',
    errCancel: '已取消签名。', errNoUsdc: 'Base 上 USDC 不足。', errGeneric: '支付失败。',
    back: '← 首页', chooseTier: '选择关卡',
  },
  JA: {
    title: 'ヴォルトショップ', subtitle: 'ヒント課金 // BASE 上の x402',
    intro: '暗号で行き詰まった？0.01 USDC で答えに近いプレミアムヒントを購入。x402 プロトコルで Base 上で即時決済——署名1回、ガス不要、面倒な決済不要。',
    walletReq: 'ショップを使うにはウォレットを接続してください。', price: '0.01 USDC',
    tierLabel: n => `ティア${n} プレミアムヒント`,
    buy: 'ヒントを解放 — 0.01 USDC', signing: '> ウォレットで署名...', paying: '> BASE で決済中...',
    successTitle: '> プレミアムヒント解放', txLabel: '決済TX',
    errCancel: '署名がキャンセルされました。', errNoUsdc: 'Base 上の USDC が不足。', errGeneric: '決済に失敗しました。',
    back: '← ホーム', chooseTier: 'ティアを選択',
  },
}

export default function VaultShop({ onBack, lang = 'EN' }: { onBack?: () => void; lang?: Lang }) {
  const ui  = T[lang] ?? T.EN
  const rtl = lang === 'AR'
  const { address, isConnected } = useAccount()
  const { data: walletClient }   = useWalletClient()

  const [tier,    setTier]    = useState('1')
  const [loading, setLoading] = useState(false)
  const [phase,   setPhase]   = useState<'idle' | 'signing' | 'paying'>('idle')
  const [hint,    setHint]    = useState<string | null>(null)
  const [txHash,  setTxHash]  = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  const buy = async () => {
    if (!walletClient) return
    setLoading(true); setError(null); setHint(null); setTxHash(null)
    try {
      // 1) İlk istek → 402 + ödeme gereksinimleri
      const res1 = await fetch(`/api/unlock?tier=${tier}`)
      if (res1.status !== 402) {
        const d = await res1.json()
        setHint(d.hint ?? null)
        return
      }
      const body = await res1.json() as { accepts: unknown[] }
      const requirements = body.accepts[0]

      // 2) x402 ödeme header'ı oluştur (EIP-3009 imzası — gas yok)
      setPhase('signing')
      const header = await createPaymentHeader(walletClient as never, 1, requirements as never)

      // 3) Ödemeyle tekrar iste → doğrula + settle → ipucu
      setPhase('paying')
      const res2 = await fetch(`/api/unlock?tier=${tier}`, { headers: { 'X-PAYMENT': header } })
      const d2 = await res2.json() as { hint?: string; txHash?: string; error?: string }

      if (!res2.ok) { setError(d2.error || ui.errGeneric) }
      else { setHint(d2.hint ?? null); setTxHash(d2.txHash ?? null) }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(
        /rejected|denied|cancel/i.test(msg) ? ui.errCancel :
        /insufficient|balance|transfer amount exceeds/i.test(msg) ? ui.errNoUsdc :
        (msg.slice(0, 120) || ui.errGeneric),
      )
    } finally {
      setLoading(false); setPhase('idle')
    }
  }

  return (
    <div className="scanlines min-h-screen flex items-start justify-center p-4 pt-8" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 border border-cyan-800 p-3">
          <div className="flex items-center gap-3">
            <span className="crt text-xs tracking-widest text-cyan-400">{ui.title}</span>
            {onBack && (
              <button onClick={onBack}
                className="text-xs text-cyan-800 hover:text-cyan-500 border border-cyan-900 hover:border-cyan-700 px-2 py-0.5 transition-colors">
                {ui.back}
              </button>
            )}
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>

        {/* Intro */}
        <div className="border border-cyan-900 bg-cyan-950/10 p-5 mb-4">
          <div className="text-cyan-400 font-bold text-xs tracking-widest mb-2">{ui.subtitle}</div>
          <p className="text-gray-400 text-xs leading-relaxed">{ui.intro}</p>
        </div>

        {!isConnected || !address ? (
          <div className="border border-amber-800 bg-black/90 p-8 text-center">
            <div className="text-amber-400 text-3xl mb-3">🔒</div>
            <div className="text-gray-400 text-sm mb-4">{ui.walletReq}</div>
            <div className="flex justify-center"><ConnectButton /></div>
          </div>
        ) : (
          <div className="border border-cyan-800 bg-black/90 p-6 space-y-5">

            {/* Tier seçimi */}
            <div>
              <div className="text-cyan-600 text-xs tracking-widest mb-2">{ui.chooseTier}</div>
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3'].map(t => (
                  <button key={t} onClick={() => { setTier(t); setHint(null); setError(null) }}
                    className={`border py-3 text-sm tracking-widest transition-colors ${
                      tier === t
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                        : 'border-cyan-900 text-cyan-700 hover:border-cyan-700'
                    }`}>
                    TIER {t}
                  </button>
                ))}
              </div>
              <div className="text-gray-500 text-xs mt-2">{ui.tierLabel(tier)} · <span className="text-cyan-400">{ui.price}</span></div>
            </div>

            {/* Satın al butonu */}
            <button onClick={buy} disabled={loading}
              className={`w-full border py-4 text-sm tracking-widest transition-all ${
                loading
                  ? 'border-cyan-700 text-cyan-500 animate-pulse cursor-wait'
                  : 'border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black cursor-pointer'
              }`}>
              {phase === 'signing' ? ui.signing : phase === 'paying' ? ui.paying : ui.buy}
            </button>

            {/* Hata */}
            {error && (
              <div className="text-red-400 text-xs border border-red-900 p-3 break-words">{'> '}{error}</div>
            )}

            {/* Başarı — ipucu */}
            {hint && (
              <div className="border border-cyan-700 bg-cyan-950/20 p-4">
                <div className="text-cyan-400 text-xs tracking-widest mb-2">{ui.successTitle}</div>
                <p className="text-cyan-200 text-sm leading-relaxed whitespace-pre-wrap">{hint}</p>
                {txHash && (
                  <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer"
                    className="text-cyan-700 hover:text-cyan-500 text-xs underline mt-3 block">
                    {ui.txLabel}: {txHash.slice(0, 14)}... ↗
                  </a>
                )}
              </div>
            )}

            <div className="text-center text-xs text-cyan-900 pt-1">
              {address.slice(0, 6)}...{address.slice(-4)} · powered by x402 on Base
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
