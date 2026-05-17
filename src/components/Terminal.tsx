'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ALL_PUZZLES, type Puzzle } from '@/data/puzzles'

// ─── Her oyunda 3 farklı soru seç ────────────────────────────────────────────
function selectPuzzles(): Puzzle[] {
  const pool = [...ALL_PUZZLES]
  let rng = Date.now()
  const rand = () => {
    rng ^= rng << 13
    rng ^= rng >> 17
    rng ^= rng << 5
    return Math.abs(rng) / 2147483648
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 3)
}

// Modül yüklendiğinde bir kez seç
const PUZZLES = selectPuzzles()

// ─── Satır tipi ──────────────────────────────────────────────────────────────
type Line = { text: string; color?: 'green' | 'red' | 'white' | 'amber' }

// ─── Ana bileşen ──────────────────────────────────────────────────────────────
export default function Terminal({ onComplete, onBack }: { onComplete: () => void; onBack?: () => void }) {
  const { address } = useAccount()

  const [lines,      setLines]      = useState<Line[]>([])
  const [input,      setInput]      = useState('')
  const [puzzleIdx,  setPuzzleIdx]  = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showHint,   setShowHint]   = useState(false)
  const [phase,      setPhase]      = useState<'typing' | 'waiting' | 'done'>('typing')

  // ── Ban durumu ────────────────────────────────────────────────────────────
  const [banExpiry,  setBanExpiry]  = useState<number | null>(null)
  const [banChecked, setBanChecked] = useState(false)
  const [timeLeft,   setTimeLeft]   = useState('')

  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Ban kontrolü (mount'ta çalışır) ──────────────────────────────────────
  useEffect(() => {
    if (address) {
      const key    = `vault_ban_${address.toLowerCase()}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const expiry = Number(stored)
        if (Date.now() < expiry) {
          setBanExpiry(expiry)
        } else {
          localStorage.removeItem(key) // Süresi dolmuş, temizle
        }
      }
    }
    setBanChecked(true)
  }, [address])

  // ── Geri sayım (ban ekranında günceller) ──────────────────────────────────
  useEffect(() => {
    if (!banExpiry || !address) return
    const key = `vault_ban_${address.toLowerCase()}`
    const tick = () => {
      const rem = banExpiry - Date.now()
      if (rem <= 0) {
        localStorage.removeItem(key)
        window.location.reload() // Ban bitti → sayfayı yenile
        return
      }
      const h = Math.floor(rem / 3600000)
      const m = Math.floor((rem % 3600000) / 60000)
      const s = Math.floor((rem % 60000) / 1000)
      setTimeLeft(`${h} saat  ${String(m).padStart(2, '0')} dakika  ${String(s).padStart(2, '0')} saniye`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [banExpiry, address])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const addLines = useCallback((newLines: Line[], delay = 0) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setLines(prev => [...prev, ...newLines])
    }, delay)
  }, [])

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

  // ── İntro — ban kontrolü bittikten sonra çalışır ──────────────────────────
  useEffect(() => {
    if (!banChecked || banExpiry) return // Ban varsa intro başlatma

    const addrStr = address
      ? `> WALLET IDENTIFIED: ${address.slice(0, 6)}...${address.slice(-4)}`
      : '> WALLET: ANONYMOUS — CONNECT FOR TRACKING'

    const intro = [
      '> VAULT SYSTEM v0.333',
      '> BASE CHAIN — SIGNAL DETECTED',
      addrStr,
      '',
      '> INITIATING TIER 1 ASSESSMENT...',
      '> 3 CIPHERS STAND BETWEEN YOU AND THE VAULT',
      '',
      '> FIRST CIPHER LOADING...',
      '',
    ]

    typeLines(intro, 'green', () => {
      typeLines(PUZZLES[0].lines, 'green', () => {
        setPhase('waiting')
        setTimeout(() => inputRef.current?.focus(), 100)
      })
    })

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banChecked]) // Sadece ban check tamamlanınca çalış

  // ── Puzzle yükle ─────────────────────────────────────────────────────────
  const loadPuzzle = useCallback((idx: number) => {
    setPhase('typing')
    setInput('')
    setWrongCount(0)
    setShowHint(false)

    addLines([{ text: '' }], 200)
    setTimeout(() => {
      typeLines(PUZZLES[idx].lines, 'green', () => {
        setPhase('waiting')
        setTimeout(() => inputRef.current?.focus(), 100)
      })
    }, 300)
  }, [addLines, typeLines])

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== 'waiting') return

    const puzzle  = PUZZLES[puzzleIdx]
    const trimmed = input.trim().toLowerCase()

    setLines(prev => [...prev, { text: `> ${input}`, color: 'white' }])

    if (trimmed === puzzle.answer.toLowerCase()) {
      // ✅ Doğru
      setLines(prev => [...prev, { text: puzzle.successMsg, color: 'green' }])
      setInput('')

      const next = puzzleIdx + 1
      if (next >= PUZZLES.length) {
        // Tüm puzzle'lar bitti
        setPhase('done')
        setTimeout(() => {
          setLines(prev => [
            ...prev,
            { text: '' },
            { text: '████████████████████████████████████', color: 'green' },
            { text: '> VAULT TIER 1 COMPLETE', color: 'green' },
            { text: '> YOU HAVE PROVEN YOUR WORTH, AGENT', color: 'green' },
            { text: '> THE VAULT AWAITS... UNLOCKING...', color: 'green' },
            { text: '████████████████████████████████████', color: 'green' },
          ])
          setTimeout(onComplete, 2500)
        }, 600)
      } else {
        setPuzzleIdx(next)
        setTimeout(() => loadPuzzle(next), 800)
      }

    } else {
      // ❌ Yanlış
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)

      if (newWrong >= 3) {
        // 3. yanlış → 24 saat ban
        setLines(prev => [...prev,
          { text: `> YANLIŞ. (${newWrong}/3)`, color: 'red' },
          { text: '' },
          { text: '> ⛔ MAKSIMUM DENEME AŞILDI', color: 'red' },
          { text: '> BU CÜZDAN 24 SAAT BOYUNCA KİLİTLENDİ', color: 'red' },
          { text: '> YARIN TEKRAR DENEYİN.', color: 'red' },
        ])
        if (address) {
          const expiry = Date.now() + 24 * 60 * 60 * 1000
          localStorage.setItem(`vault_ban_${address.toLowerCase()}`, String(expiry))
          setBanExpiry(expiry)
        }
        setPhase('done')
      } else {
        setLines(prev => [...prev, {
          text: `> YANLIŞ. (${newWrong}/3 hak)`,
          color: 'red',
        }])
        if (newWrong >= 2) setShowHint(true) // 2. yanlışta ipucu göster
      }
      setInput('')
    }
  }, [phase, puzzleIdx, input, wrongCount, onComplete, loadPuzzle, address])

  const puzzle = PUZZLES[puzzleIdx]

  // ── Ban kontrolü beklenirken ───────────────────────────────────────────────
  if (!banChecked) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center">
        <span className="text-green-400 font-mono text-sm animate-pulse">
          {'> CHECKING ACCESS...'}
        </span>
      </div>
    )
  }

  // ── Cüzdan bağlı değilse engelle ─────────────────────────────────────────
  if (!address) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-amber-800 bg-black/90 p-8 text-center font-mono">
          <div className="text-amber-400 text-4xl mb-4">🔒</div>
          <div className="text-amber-400 text-xl tracking-widest mb-2 crt">
            CÜZDAN GEREKLİ
          </div>
          <div className="text-gray-400 text-sm mb-6 leading-relaxed">
            Oyunu oynamak için önce cüzdanını bağlamalısın.
          </div>
          <div className="flex justify-center mb-4">
            <ConnectButton />
          </div>
          <div className="text-xs text-gray-700">
            Vault Legend NFT kazanmak için cüzdan zorunludur.
          </div>
        </div>
      </div>
    )
  }

  // ── Ban ekranı ────────────────────────────────────────────────────────────
  if (banExpiry) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-red-800 bg-black/90 p-8 text-center font-mono">
          <div className="text-5xl mb-4">⛔</div>
          <div className="text-red-400 text-xl tracking-widest mb-2 crt">
            ERİŞİM ENGELLENDİ
          </div>
          <div className="text-red-300 text-sm mb-6 leading-relaxed">
            3 yanlış cevap verdiniz.<br />
            Bu cüzdan{' '}
            <span className="text-amber-400 font-bold">24 saat</span>{' '}
            boyunca kilitlendi.
          </div>

          <div className="border border-red-900 bg-red-950/20 p-4 mb-6">
            <div className="text-xs text-gray-600 mb-2 tracking-widest">KALAN SÜRE</div>
            <div className="text-amber-400 text-lg font-bold tracking-widest tabular-nums">
              {timeLeft || '...'}
            </div>
          </div>

          {address && (
            <div className="text-xs text-gray-700 mb-4">
              Cüzdan: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}

          <div className="text-gray-600 text-xs">
            Süre dolduğunda sayfa otomatik olarak yenilenir.
          </div>
        </div>
      </div>
    )
  }

  // ── Normal oyun ───────────────────────────────────────────────────────────
  return (
    <div className="scanlines min-h-screen flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 border border-green-800 p-3">
          <div className="flex items-center gap-3">
            <span className="crt text-xs tracking-widest">BASE VAULT // TIER 1</span>
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs text-green-800 hover:text-green-500 border border-green-900 hover:border-green-700 px-2 py-0.5 transition-colors"
              >
                ← Ana Sayfa
              </button>
            )}
          </div>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </div>

        {/* Terminal */}
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
                'text-green-400'
              }`}
            >
              {line.text || ' '}
            </div>
          ))}

          {/* İpucu (2. yanlıştan sonra gösterilir) */}
          {showHint && phase === 'waiting' && (
            <div className="text-amber-400 mt-1">
              {`> İPUCU: ${puzzle.hint}`}
            </div>
          )}

          {/* Giriş alanı */}
          {phase === 'waiting' && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2 gap-1">
              <span className="text-green-300 shrink-0">{puzzle.prompt}</span>
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
              UNLOCKING NEXT TIER...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-green-800 mt-2 px-1">
          <span>PUZZLE {Math.min(puzzleIdx + 1, 3)}/3</span>
          <span>BASE CHAIN // SECURE CHANNEL</span>
        </div>
      </div>
    </div>
  )
}
