'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { selectPuzzles, getContent, isCorrect, type Puzzle, type Lang } from '@/data/puzzles'

// 3 wrong answers → wallet locked for this long
const BAN_MS = 1 * 60 * 1000

// ─── Localized UI strings ─────────────────────────────────────────────────────
type UI = {
  checking:    string
  walletTitle: string
  walletDesc:  string
  walletNote:  string
  banTitle:    string
  banDesc:     string
  banRemaining:string
  banWallet:   string
  banAuto:     string
  hours: string; mins: string; secs: string
  hintLabel:   string
  askButton:   string
  askThinking: string
  guardianTitle: string
  oracleErr:   string
  wrong:       (n: number) => string
  maxTitle:    string
  maxLine1:    string
  maxLine2:    string
  tierComplete:string[]
  unlocking:   string
  back:        string
  header:      string
  footerPuzzle:(i: number) => string
  footerChan:  string
  intro:       (addr: string | null) => string[]
}

const UISTR: Record<Lang, UI> = {
  EN: {
    checking: '> CHECKING ACCESS...',
    walletTitle: 'WALLET REQUIRED',
    walletDesc: 'You must connect your wallet before you can play.',
    walletNote: 'A wallet is required to earn a Vault Legend NFT.',
    banTitle: 'ACCESS DENIED',
    banDesc: 'You gave 3 wrong answers. This wallet is temporarily locked.',
    banRemaining: 'TIME REMAINING',
    banWallet: 'Wallet',
    banAuto: 'The page refreshes automatically when the timer ends.',
    hours: 'h', mins: 'm', secs: 's',
    hintLabel: 'HINT',
    askButton: '[ ASK THE VAULT GUARDIAN ]',
    askThinking: '[ ORACLE IS THINKING... ]',
    guardianTitle: 'VAULT GUARDIAN',
    oracleErr: '> ORACLE UNREACHABLE.',
    wrong: n => `> WRONG. (${n}/3)`,
    maxTitle: '> ⛔ MAXIMUM ATTEMPTS EXCEEDED',
    maxLine1: '> THIS WALLET IS LOCKED FOR 1 MINUTE',
    maxLine2: '> TRY AGAIN LATER.',
    tierComplete: ['> VAULT TIER 1 COMPLETE','> YOU HAVE PROVEN YOUR WORTH, AGENT','> THE VAULT AWAITS... UNLOCKING...'],
    unlocking: 'UNLOCKING NEXT TIER...',
    back: '← Home',
    header: 'BASE VAULT // TIER 1',
    footerPuzzle: i => `PUZZLE ${i}/3`,
    footerChan: 'BASE CHAIN // SECURE CHANNEL',
    intro: addr => [
      '> VAULT SYSTEM v0.333',
      '> BASE CHAIN — SIGNAL DETECTED',
      addr ? `> WALLET IDENTIFIED: ${addr}` : '> WALLET: ANONYMOUS',
      '',
      '> INITIATING TIER 1 ASSESSMENT...',
      '> 3 CIPHERS STAND BETWEEN YOU AND THE VAULT',
      '',
      '> FIRST CIPHER LOADING...',
      '',
    ],
  },
  DE: {
    checking: '> ZUGANG WIRD GEPRÜFT...',
    walletTitle: 'WALLET ERFORDERLICH',
    walletDesc: 'Du musst deine Wallet verbinden, bevor du spielen kannst.',
    walletNote: 'Eine Wallet wird benötigt, um ein Vault Legend NFT zu verdienen.',
    banTitle: 'ZUGANG VERWEIGERT',
    banDesc: 'Du hast 3 falsche Antworten gegeben. Diese Wallet ist vorübergehend gesperrt.',
    banRemaining: 'VERBLEIBENDE ZEIT',
    banWallet: 'Wallet',
    banAuto: 'Die Seite wird automatisch aktualisiert, wenn die Zeit abläuft.',
    hours: 'Std', mins: 'Min', secs: 'Sek',
    hintLabel: 'TIPP',
    askButton: '[ DEN VAULT GUARDIAN FRAGEN ]',
    askThinking: '[ ORAKEL DENKT NACH... ]',
    guardianTitle: 'VAULT GUARDIAN',
    oracleErr: '> ORAKEL NICHT ERREICHBAR.',
    wrong: n => `> FALSCH. (${n}/3)`,
    maxTitle: '> ⛔ MAXIMALE VERSUCHE ÜBERSCHRITTEN',
    maxLine1: '> DIESE WALLET IST 1 MINUTE GESPERRT',
    maxLine2: '> VERSUCHE ES SPÄTER ERNEUT.',
    tierComplete: ['> VAULT STUFE 1 ABGESCHLOSSEN','> DU HAST DICH BEWÄHRT, AGENT','> DER TRESOR WARTET... ENTSPERRE...'],
    unlocking: 'NÄCHSTE STUFE WIRD ENTSPERRT...',
    back: '← Startseite',
    header: 'BASE VAULT // STUFE 1',
    footerPuzzle: i => `RÄTSEL ${i}/3`,
    footerChan: 'BASE CHAIN // SICHERER KANAL',
    intro: addr => [
      '> VAULT SYSTEM v0.333',
      '> BASE CHAIN — SIGNAL ERKANNT',
      addr ? `> WALLET IDENTIFIZIERT: ${addr}` : '> WALLET: ANONYM',
      '',
      '> STARTE STUFE-1-PRÜFUNG...',
      '> 3 CHIFFREN TRENNEN DICH VOM TRESOR',
      '',
      '> ERSTE CHIFFRE WIRD GELADEN...',
      '',
    ],
  },
  AR: {
    checking: '> جارٍ التحقق من الوصول...',
    walletTitle: 'المحفظة مطلوبة',
    walletDesc: 'يجب ربط محفظتك قبل أن تتمكن من اللعب.',
    walletNote: 'المحفظة مطلوبة لكسب Vault Legend NFT.',
    banTitle: 'تم رفض الوصول',
    banDesc: 'قدّمت 3 إجابات خاطئة. هذه المحفظة مقفلة مؤقتاً.',
    banRemaining: 'الوقت المتبقي',
    banWallet: 'المحفظة',
    banAuto: 'تُحدَّث الصفحة تلقائياً عند انتهاء المؤقت.',
    hours: 'س', mins: 'د', secs: 'ث',
    hintLabel: 'تلميح',
    askButton: '[ اسأل حارس الخزنة ]',
    askThinking: '[ العرّاف يفكر... ]',
    guardianTitle: 'حارس الخزنة',
    oracleErr: '> تعذّر الوصول إلى العرّاف.',
    wrong: n => `> خطأ. (${n}/3)`,
    maxTitle: '> ⛔ تم تجاوز الحد الأقصى للمحاولات',
    maxLine1: '> هذه المحفظة مقفلة لمدة دقيقة واحدة',
    maxLine2: '> حاول مرة أخرى لاحقاً.',
    tierComplete: ['> اكتمل المستوى 1','> لقد أثبتّ جدارتك أيها العميل','> الخزنة في انتظارك... جارٍ الفتح...'],
    unlocking: 'جارٍ فتح المستوى التالي...',
    back: '← الرئيسية',
    header: 'BASE VAULT // المستوى 1',
    footerPuzzle: i => `اللغز ${i}/3`,
    footerChan: 'BASE CHAIN // قناة آمنة',
    intro: addr => [
      '> نظام الخزنة v0.333',
      '> BASE CHAIN — تم رصد إشارة',
      addr ? `> تم تحديد المحفظة: ${addr}` : '> المحفظة: مجهولة',
      '',
      '> بدء تقييم المستوى 1...',
      '> 3 شفرات تفصلك عن الخزنة',
      '',
      '> جارٍ تحميل الشيفرة الأولى...',
      '',
    ],
  },
  ZH: {
    checking: '> 正在验证访问权限...',
    walletTitle: '需要钱包',
    walletDesc: '游戏前必须先连接钱包。',
    walletNote: '获得 Vault Legend NFT 需要钱包。',
    banTitle: '访问被拒绝',
    banDesc: '你答错了3次。此钱包已被暂时锁定。',
    banRemaining: '剩余时间',
    banWallet: '钱包',
    banAuto: '倒计时结束后页面将自动刷新。',
    hours: '时', mins: '分', secs: '秒',
    hintLabel: '提示',
    askButton: '[ 询问保险库守护者 ]',
    askThinking: '[ 神谕思考中... ]',
    guardianTitle: '保险库守护者',
    oracleErr: '> 无法连接神谕。',
    wrong: n => `> 错误。(${n}/3)`,
    maxTitle: '> ⛔ 已超过最大尝试次数',
    maxLine1: '> 此钱包已被锁定1分钟',
    maxLine2: '> 请稍后再试。',
    tierComplete: ['> 第1关完成','> 你已证明了实力，特工','> 保险库在等待... 正在解锁...'],
    unlocking: '正在解锁下一关...',
    back: '← 首页',
    header: 'BASE VAULT // 第1关',
    footerPuzzle: i => `谜题 ${i}/3`,
    footerChan: 'BASE CHAIN // 安全通道',
    intro: addr => [
      '> 保险库系统 v0.333',
      '> BASE CHAIN — 检测到信号',
      addr ? `> 已识别钱包: ${addr}` : '> 钱包: 匿名',
      '',
      '> 正在启动第1关评估...',
      '> 3道密码横在你与保险库之间',
      '',
      '> 正在加载第一道密码...',
      '',
    ],
  },
  JA: {
    checking: '> アクセスを確認中...',
    walletTitle: 'ウォレットが必要',
    walletDesc: 'プレイする前にウォレットを接続してください。',
    walletNote: 'Vault Legend NFT の獲得にはウォレットが必要です。',
    banTitle: 'アクセス拒否',
    banDesc: '3回間違えました。このウォレットは一時的にロックされています。',
    banRemaining: '残り時間',
    banWallet: 'ウォレット',
    banAuto: 'タイマー終了時にページが自動的に更新されます。',
    hours: '時間', mins: '分', secs: '秒',
    hintLabel: 'ヒント',
    askButton: '[ ヴォルトガーディアンに聞く ]',
    askThinking: '[ オラクル思考中... ]',
    guardianTitle: 'ヴォルトガーディアン',
    oracleErr: '> オラクルに接続できません。',
    wrong: n => `> 不正解。(${n}/3)`,
    maxTitle: '> ⛔ 最大試行回数を超過',
    maxLine1: '> このウォレットは1分間ロックされました',
    maxLine2: '> あとでもう一度お試しください。',
    tierComplete: ['> ティア1完了','> 実力を証明したな、エージェント','> 金庫が待っている... 解錠中...'],
    unlocking: '次のティアを解錠中...',
    back: '← ホーム',
    header: 'BASE VAULT // ティア1',
    footerPuzzle: i => `パズル ${i}/3`,
    footerChan: 'BASE CHAIN // セキュアチャネル',
    intro: addr => [
      '> VAULT SYSTEM v0.333',
      '> BASE CHAIN — 信号検出',
      addr ? `> ウォレット識別: ${addr}` : '> ウォレット: 匿名',
      '',
      '> ティア1評価を開始...',
      '> 3つの暗号が金庫への道を阻む',
      '',
      '> 最初の暗号を読み込み中...',
      '',
    ],
  },
}

// ─── Line type ─────────────────────────────────────────────────────────────────
type Line = { text: string; color?: 'green' | 'red' | 'white' | 'amber' | 'cyan' }

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Terminal({
  onComplete,
  onBack,
  lang = 'EN',
}: {
  onComplete: () => void
  onBack?: () => void
  lang?: Lang
}) {
  const { address } = useAccount()
  const ui  = UISTR[lang] ?? UISTR.EN
  const rtl = lang === 'AR'

  // Pick 3 puzzles once per game
  const [puzzles] = useState<Puzzle[]>(() => selectPuzzles(3))

  const [lines,      setLines]      = useState<Line[]>([])
  const [input,      setInput]      = useState('')
  const [puzzleIdx,  setPuzzleIdx]  = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showHint,   setShowHint]   = useState(false)
  const [phase,      setPhase]      = useState<'typing' | 'waiting' | 'done'>('typing')

  const [aiLoading,  setAiLoading]  = useState(false)
  const [aiUsed,     setAiUsed]     = useState(false)

  // Ban state
  const [banExpiry,  setBanExpiry]  = useState<number | null>(null)
  const [banChecked, setBanChecked] = useState(false)
  const [timeLeft,   setTimeLeft]   = useState('')

  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Ban check on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (address) {
      const key    = `vault_ban_${address.toLowerCase()}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const expiry = Number(stored)
        if (Date.now() < expiry) setBanExpiry(expiry)
        else localStorage.removeItem(key)
      }
    }
    setBanChecked(true)
  }, [address])

  // ── Countdown on ban screen ───────────────────────────────────────────────
  useEffect(() => {
    if (!banExpiry || !address) return
    const key = `vault_ban_${address.toLowerCase()}`
    const tick = () => {
      const rem = banExpiry - Date.now()
      if (rem <= 0) {
        localStorage.removeItem(key)
        window.location.reload()
        return
      }
      const h = Math.floor(rem / 3600000)
      const m = Math.floor((rem % 3600000) / 60000)
      const s = Math.floor((rem % 60000) / 1000)
      setTimeLeft(`${h}${ui.hours} ${String(m).padStart(2, '0')}${ui.mins} ${String(s).padStart(2, '0')}${ui.secs}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [banExpiry, address, ui])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const typeLines = useCallback((texts: string[], color: Line['color'] = 'green', onDone?: () => void) => {
    let i = 0
    const next = () => {
      if (i >= texts.length) { onDone?.(); return }
      const text = texts[i++]
      setLines(prev => [...prev, { text, color }])
      setTimeout(next, text.length > 0 ? 60 : 120)
    }
    next()
  }, [])

  const addLines = useCallback((newLines: Line[], delay = 0) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setLines(prev => [...prev, ...newLines])
    }, delay)
  }, [])

  // ── Intro (after ban check) ───────────────────────────────────────────────
  useEffect(() => {
    if (!banChecked || banExpiry) return
    const addrStr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null
    typeLines(ui.intro(addrStr), 'green', () => {
      typeLines(getContent(puzzles[0], lang).lines, 'green', () => {
        setPhase('waiting')
        setTimeout(() => inputRef.current?.focus(), 100)
      })
    })
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banChecked])

  // ── Vault Guardian AI hint ────────────────────────────────────────────────
  const askVaultAI = useCallback(async () => {
    if (aiLoading || aiUsed) return
    setAiLoading(true)

    const c = getContent(puzzles[puzzleIdx], lang)
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: c.category,
          lines:    c.lines,
          prompt:   c.prompt,
          wrongCount,
          lastAttempt: input.trim() || undefined,
          lang,
        }),
      })
      const data = await res.json() as { hint: string; guardianActive?: boolean }
      setLines(prev => [
        ...prev,
        { text: '' },
        { text: `> ── ${ui.guardianTitle}${data.guardianActive ? ' [ONCHAIN]' : ''} ──`, color: 'amber' },
        { text: data.hint, color: 'amber' },
        { text: '> ──────────────────────────────', color: 'amber' },
      ])
      setAiUsed(true)
    } catch {
      setLines(prev => [...prev, { text: ui.oracleErr, color: 'red' }])
    } finally {
      setAiLoading(false)
      inputRef.current?.focus()
    }
  }, [aiLoading, aiUsed, puzzleIdx, wrongCount, input, puzzles, lang, ui])

  // ── Load next puzzle ──────────────────────────────────────────────────────
  const loadPuzzle = useCallback((idx: number) => {
    setPhase('typing')
    setInput('')
    setWrongCount(0)
    setShowHint(false)
    setAiUsed(false)

    addLines([{ text: '' }], 200)
    setTimeout(() => {
      typeLines(getContent(puzzles[idx], lang).lines, 'green', () => {
        setPhase('waiting')
        setTimeout(() => inputRef.current?.focus(), 100)
      })
    }, 300)
  }, [addLines, typeLines, puzzles, lang])

  // ── Scroll ────────────────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== 'waiting') return

    const puzzle  = puzzles[puzzleIdx]
    const content = getContent(puzzle, lang)

    setLines(prev => [...prev, { text: `> ${input}`, color: 'white' }])

    if (isCorrect(puzzle, input)) {
      setLines(prev => [...prev, { text: content.successMsg, color: 'green' }])
      setInput('')

      const next = puzzleIdx + 1
      if (next >= puzzles.length) {
        setPhase('done')
        setTimeout(() => {
          setLines(prev => [
            ...prev,
            { text: '' },
            { text: '████████████████████████████████████', color: 'green' },
            ...ui.tierComplete.map(t => ({ text: t, color: 'green' as const })),
            { text: '████████████████████████████████████', color: 'green' },
          ])
          setTimeout(onComplete, 2500)
        }, 600)
      } else {
        setPuzzleIdx(next)
        setTimeout(() => loadPuzzle(next), 800)
      }
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)

      if (newWrong >= 3) {
        setLines(prev => [...prev,
          { text: ui.wrong(newWrong), color: 'red' },
          { text: '' },
          { text: ui.maxTitle, color: 'red' },
          { text: ui.maxLine1, color: 'red' },
          { text: ui.maxLine2, color: 'red' },
        ])
        if (address) {
          const expiry = Date.now() + BAN_MS
          localStorage.setItem(`vault_ban_${address.toLowerCase()}`, String(expiry))
          setBanExpiry(expiry)
        }
        setPhase('done')
      } else {
        setLines(prev => [...prev, { text: ui.wrong(newWrong), color: 'red' }])
        if (newWrong >= 2) setShowHint(true)
      }
      setInput('')
    }
  }, [phase, puzzleIdx, input, wrongCount, onComplete, loadPuzzle, address, puzzles, lang, ui])

  const content = getContent(puzzles[puzzleIdx], lang)

  // ── Waiting for ban check ─────────────────────────────────────────────────
  if (!banChecked) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center" dir={rtl ? 'rtl' : 'ltr'}>
        <span className="text-green-400 font-mono text-sm animate-pulse">{ui.checking}</span>
      </div>
    )
  }

  // ── Wallet required ───────────────────────────────────────────────────────
  if (!address) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center p-4" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md border border-amber-800 bg-black/90 p-8 text-center font-mono">
          <div className="text-amber-400 text-4xl mb-4">🔒</div>
          <div className="text-amber-400 text-xl tracking-widest mb-2 crt">{ui.walletTitle}</div>
          <div className="text-gray-400 text-sm mb-6 leading-relaxed">{ui.walletDesc}</div>
          <div className="flex justify-center mb-4"><ConnectButton /></div>
          <div className="text-xs text-gray-700">{ui.walletNote}</div>
        </div>
      </div>
    )
  }

  // ── Ban screen ────────────────────────────────────────────────────────────
  if (banExpiry) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center p-4" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md border border-red-800 bg-black/90 p-8 text-center font-mono">
          <div className="text-5xl mb-4">⛔</div>
          <div className="text-red-400 text-xl tracking-widest mb-2 crt">{ui.banTitle}</div>
          <div className="text-red-300 text-sm mb-6 leading-relaxed">{ui.banDesc}</div>
          <div className="border border-red-900 bg-red-950/20 p-4 mb-6">
            <div className="text-xs text-gray-600 mb-2 tracking-widest">{ui.banRemaining}</div>
            <div className="text-amber-400 text-lg font-bold tracking-widest tabular-nums">{timeLeft || '...'}</div>
          </div>
          {address && (
            <div className="text-xs text-gray-700 mb-4">
              {ui.banWallet}: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
          <div className="text-gray-600 text-xs">{ui.banAuto}</div>
        </div>
      </div>
    )
  }

  // ── Normal game ───────────────────────────────────────────────────────────
  return (
    <div className="scanlines min-h-screen flex items-start justify-center p-4 pt-8" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-3xl">

        <div className="flex justify-between items-center mb-4 border border-green-800 p-3">
          <div className="flex items-center gap-3">
            <span className="crt text-xs tracking-widest">{ui.header}</span>
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs text-green-800 hover:text-green-500 border border-green-900 hover:border-green-700 px-2 py-0.5 transition-colors"
              >
                {ui.back}
              </button>
            )}
          </div>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </div>

        <div
          className="border border-green-800 bg-black/90 p-4 font-mono text-sm overflow-y-auto"
          style={{ minHeight: '70vh', maxHeight: '70vh' }}
          onClick={() => phase === 'waiting' && inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`leading-6 whitespace-pre-wrap ${
                line.color === 'red'   ? 'text-red-400'   :
                line.color === 'white' ? 'text-white/80'  :
                line.color === 'amber' ? 'text-amber-400' :
                line.color === 'cyan'  ? 'text-cyan-400'  :
                'text-green-400'
              }`}
            >
              {line.text || ' '}
            </div>
          ))}

          {showHint && phase === 'waiting' && (
            <div className="text-amber-400 mt-1">{`> ${ui.hintLabel}: ${content.hint}`}</div>
          )}

          {wrongCount >= 1 && phase === 'waiting' && !aiUsed && (
            <div className="mt-2">
              <button
                onClick={askVaultAI}
                disabled={aiLoading}
                className="text-cyan-500 hover:text-cyan-300 border border-cyan-900 hover:border-cyan-700 px-3 py-0.5 text-xs tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              >
                {aiLoading ? ui.askThinking : ui.askButton}
              </button>
            </div>
          )}

          {phase === 'waiting' && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2 gap-1">
              <span className="text-green-300 shrink-0">{content.prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white border-b border-green-700 caret-green-400 min-w-0"
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
            </form>
          )}

          {phase === 'done' && !banExpiry && (
            <div className="text-green-300 text-center mt-6 crt tracking-widest animate-pulse">
              {ui.unlocking}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex justify-between text-xs text-green-800 mt-2 px-1">
          <span>{ui.footerPuzzle(Math.min(puzzleIdx + 1, 3))}</span>
          <span>{ui.footerChan}</span>
        </div>
      </div>
    </div>
  )
}
