'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignMessage } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BUILDER_CODE_SUFFIX, CONTRACTS } from '@/lib/wagmi'

// İmza mesajı (API route ile aynı format)
function buildClaimMessage(wallet: string, timestamp: number): string {
  return `Base Vault: Claim Vault Legend\nWallet: ${wallet}\nTimestamp: ${timestamp}`
}

// ─── ABI ──────────────────────────────────────────────────────────────────────
const VAULT_LEGEND_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'allowlisted',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'hasMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'totalMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'currentPhase',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'phaseMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'p1', type: 'uint256' },
      { name: 'p2', type: 'uint256' },
      { name: 'p3', type: 'uint256' },
    ],
  },
] as const

// ─── Contract address (ortak sabit — checksum normalize edilmiş) ───────────────
const VAULT_LEGEND_ADDR = CONTRACTS.VAULT_LEGEND

// ─── Phase metadata ───────────────────────────────────────────────────────────
const PHASE_INFO = {
  1: {
    label: 'EARLY LEGEND',
    color: 'text-amber-300',
    border: 'border-amber-500',
    bg: 'bg-amber-950/30',
    glow: 'shadow-amber-500/40',
    max: 33,
    desc: 'İlk 33 kazanan — En nadir, en prestijli.',
    badge: '👑',
  },
  2: {
    label: 'CORE LEGEND',
    color: 'text-cyan-300',
    border: 'border-cyan-500',
    bg: 'bg-cyan-950/30',
    glow: 'shadow-cyan-500/40',
    max: 100,
    desc: 'Sonraki 100 kazanan.',
    badge: '⚡',
  },
  3: {
    label: 'FINAL LEGEND',
    color: 'text-green-300',
    border: 'border-green-500',
    bg: 'bg-green-950/30',
    glow: 'shadow-green-500/40',
    max: 200,
    desc: 'Kalan 200 kazanan.',
    badge: '🔮',
  },
} as const

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({
  label, minted, max, color, badge,
}: { label: string; minted: number; max: number; color: string; badge: string }) {
  const pct = Math.min((minted / max) * 100, 100)
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className={`font-bold ${color}`}>{badge} {label}</span>
        <span className="text-gray-400">{minted}/{max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            color.includes('amber') ? 'bg-amber-400' :
            color.includes('cyan')  ? 'bg-cyan-400' : 'bg-green-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────
export default function ClaimLegend({ onBack }: { onBack?: () => void }) {
  const { address, isConnected } = useAccount()
  const [mintSuccess, setMintSuccess] = useState(false)
  const [redirectIn,  setRedirectIn]  = useState(5)

  // ── Allowlist claim state ─────────────────────────────────────
  const [claiming, setClaiming]       = useState(false)
  const [claimError, setClaimError]   = useState<string | null>(null)
  const [claimDone, setClaimDone]     = useState(false)

  const { signMessageAsync } = useSignMessage()

  // ── Contract reads ────────────────────────────────────────────
  const { data: isAllowlisted, refetch: refetchAllowlisted } = useReadContract({
    address: VAULT_LEGEND_ADDR,
    abi: VAULT_LEGEND_ABI,
    functionName: 'allowlisted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: alreadyMinted, refetch: refetchMinted } = useReadContract({
    address: VAULT_LEGEND_ADDR,
    abi: VAULT_LEGEND_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: totalMinted } = useReadContract({
    address: VAULT_LEGEND_ADDR,
    abi: VAULT_LEGEND_ABI,
    functionName: 'totalMinted',
  })

  const { data: currentPhase } = useReadContract({
    address: VAULT_LEGEND_ADDR,
    abi: VAULT_LEGEND_ABI,
    functionName: 'currentPhase',
  })

  const { data: phases } = useReadContract({
    address: VAULT_LEGEND_ADDR,
    abi: VAULT_LEGEND_ABI,
    functionName: 'phaseMinted',
  })

  // ── Write ─────────────────────────────────────────────────────
  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error: writeError,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  useEffect(() => {
    if (isConfirmed) {
      setMintSuccess(true)
      refetchAllowlisted()
      refetchMinted()
    }
  }, [isConfirmed, refetchAllowlisted, refetchMinted])

  // Mint başarılı → 5 sn geri sayım sonra ana sayfaya dön
  useEffect(() => {
    if (!mintSuccess || !onBack) return
    setRedirectIn(5)
    const iv = setInterval(() => {
      setRedirectIn(n => {
        if (n <= 1) { clearInterval(iv); onBack(); return 0 }
        return n - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [mintSuccess, onBack])

  // ── Derived state ─────────────────────────────────────────────
  const phase     = (currentPhase as number) || 1
  const phaseInfo = PHASE_INFO[phase as 1 | 2 | 3]
  const total     = Number(totalMinted ?? 0n)
  const p1        = Number((phases as [bigint, bigint, bigint])?.[0] ?? 0n)
  const p2        = Number((phases as [bigint, bigint, bigint])?.[1] ?? 0n)
  const p3        = Number((phases as [bigint, bigint, bigint])?.[2] ?? 0n)

  const canMint   = isAllowlisted && !alreadyMinted && !mintSuccess
  const isMinting = isSending || isConfirming

  const handleMint = () => {
    writeContract({
      address: VAULT_LEGEND_ADDR,
      abi: VAULT_LEGEND_ABI,
      functionName: 'mint',
      dataSuffix: BUILDER_CODE_SUFFIX,
    })
  }

  const handleClaim = async () => {
    if (!address) return
    setClaiming(true)
    setClaimError(null)
    try {
      const timestamp = Date.now()
      const message   = buildClaimMessage(address, timestamp)
      const signature = await signMessageAsync({ message })

      const res = await fetch('/api/claim-legend', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ wallet: address, signature, timestamp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setClaimError(data.error ?? 'İstek başarısız')
      } else {
        setClaimDone(true)
        refetchAllowlisted()
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'İmzalama iptal edildi'
      setClaimError(msg.includes('rejected') ? 'İmzalama iptal edildi.' : msg.slice(0, 100))
    } finally {
      setClaiming(false)
    }
  }

  // ── Success ekranı ────────────────────────────────────────────
  if (mintSuccess || alreadyMinted) {
    return (
      <div className="scanlines min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-lg border ${phaseInfo.border} ${phaseInfo.bg} p-8 text-center`}
          style={{ boxShadow: `0 0 40px var(--tw-shadow-color)` }}>
          <div className="text-6xl mb-4">{phaseInfo.badge}</div>
          <div className={`text-2xl font-bold crt ${phaseInfo.color} mb-2`}>
            VAULT LEGEND KAZANILDI
          </div>
          <div className={`text-sm font-bold ${phaseInfo.color} mb-6 tracking-widest`}>
            {phaseInfo.label}
          </div>
          <div className="text-gray-400 text-sm mb-6">
            NFT'niz cüzdanınıza mint edildi.<br/>
            OpenSea profilinizde görünür.
          </div>
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 text-xs hover:underline block mb-4"
            >
              TX: {txHash.slice(0, 10)}...{txHash.slice(-6)} ↗
            </a>
          )}
          <a
            href={`https://opensea.io/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block border ${phaseInfo.border} ${phaseInfo.color} px-6 py-3 text-sm tracking-widest hover:${phaseInfo.bg} transition-colors`}
          >
            OpenSea'de Gör ↗
          </a>

          {onBack && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-200 text-sm tracking-widest underline"
              >
                ← Ana Sayfaya Dön
              </button>
              {mintSuccess && (
                <div className="text-xs text-gray-600 mt-2">
                  {redirectIn} saniye içinde otomatik dönülüyor...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="scanlines min-h-screen flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border border-green-800 p-3">
          <div>
            <span className="crt text-xs tracking-widest text-green-400">
              BASE VAULT // VAULT LEGEND
            </span>
            {onBack && (
              <button
                onClick={onBack}
                className="ml-4 text-xs text-gray-600 hover:text-gray-400"
              >
                ← geri
              </button>
            )}
          </div>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </div>

        {/* Phase durumu */}
        <div className={`border ${phaseInfo.border} ${phaseInfo.bg} p-6 mb-4 shadow-lg ${phaseInfo.glow}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-gray-500 tracking-widest mb-1">AKTİF PHASE</div>
              <div className={`text-xl font-bold ${phaseInfo.color} crt`}>
                {phaseInfo.badge} {phaseInfo.label}
              </div>
              <div className="text-gray-400 text-sm mt-1">{phaseInfo.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{333 - total}</div>
              <div className="text-xs text-gray-500">kalan</div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <ProgressBar label="EARLY LEGENDS"  minted={p1} max={33}  color="text-amber-300" badge="👑" />
            <ProgressBar label="CORE LEGENDS"   minted={p2} max={100} color="text-cyan-300"  badge="⚡" />
            <ProgressBar label="FINAL LEGENDS"  minted={p3} max={200} color="text-green-300" badge="🔮" />
          </div>

          <div className="text-center mt-2 text-xs text-gray-600">
            {total}/333 mint edildi
          </div>
        </div>

        {/* Mint paneli */}
        <div className="border border-green-800 bg-black/90 p-6">

          {!isConnected ? (
            <div className="text-center">
              <div className="text-green-400 mb-4 font-mono text-sm">
                &gt; CÜZDAN BAĞLANTI GEREKLİ
              </div>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : isAllowlisted ? (
            /* Allowlist'te → Mint butonu */
            <div className="text-center">
              <div className="text-green-400 font-mono text-sm mb-2">
                &gt; TESCİL ONAYLANDI
              </div>
              <div className={`text-sm ${phaseInfo.color} mb-6`}>
                Tier 3 tamamladınız. {phaseInfo.badge} {phaseInfo.label} için uygunsunuz.
              </div>

              {writeError && (
                <div className="text-red-400 text-xs mb-4 border border-red-800 p-2">
                  {writeError.message.slice(0, 120)}
                </div>
              )}

              <button
                onClick={handleMint}
                disabled={isMinting}
                className={`w-full border py-4 font-mono text-sm tracking-widest transition-all ${
                  isMinting
                    ? 'border-gray-700 text-gray-600 cursor-wait'
                    : `${phaseInfo.border} ${phaseInfo.color} hover:${phaseInfo.bg} cursor-pointer`
                }`}
              >
                {isSending    ? '> İMZALAYIN...'
                 : isConfirming ? '> ONAYLANIYOR...'
                 : `> VAULT LEGEND MINT ET (ÜCRETSİZ)`}
              </button>

              <div className="text-xs text-gray-600 mt-3">
                Sadece gas ücreti gereklidir (~$0.01)
              </div>
            </div>
          ) : claimDone ? (
            /* Claim başarılı, allowlist TX bekleniyor */
            <div className="text-center">
              <div className="text-green-400 font-mono text-sm mb-3 animate-pulse">
                &gt; ALLOWLIST TX GÖNDERİLDİ
              </div>
              <div className="text-gray-400 text-sm mb-2">
                İşlem onaylanıyor, birkaç saniye bekleyin…
              </div>
              <div className="text-xs text-gray-600">
                Onaylandıktan sonra mint butonu otomatik görünecek.
              </div>
              <button
                onClick={() => { refetchAllowlisted(); setClaimDone(false) }}
                className="mt-4 border border-green-800 text-green-400 px-6 py-2 text-xs tracking-widest hover:bg-green-950/30 transition-colors"
              >
                &gt; YENİLE
              </button>
            </div>
          ) : (
            /* Allowlist'te değil — claim butonu */
            <div className="text-center">
              <div className="text-amber-400 font-mono text-sm mb-3">
                &gt; ERİŞİM REDDEDİLDİ
              </div>
              <div className="text-gray-400 text-sm mb-4">
                VaultLegend almak için önce tüm Tier'ları tamamlayın.
              </div>
              <div className="font-mono text-xs text-gray-600 border border-gray-800 p-3 mb-4">
                <div>1. Tier 1 — Quiz'leri çözün (ücretsiz)</div>
                <div>2. Tier 2 — VaultKey mint edin (33 USDC)</div>
                <div>3. Tier 3 — MasterKey mint edin (66 USDC)</div>
                <div>4. Tier 3 oyununu tamamlayın</div>
                <div className={`mt-2 ${phaseInfo.color}`}>
                  5. Aşağıdaki butonla allowlist talep edin
                </div>
              </div>

              {claimError && (
                <div className="text-red-400 text-xs mb-3 border border-red-800 p-2">
                  {claimError}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={claiming}
                className={`w-full border py-3 font-mono text-sm tracking-widest transition-all ${
                  claiming
                    ? 'border-gray-700 text-gray-600 cursor-wait'
                    : `${phaseInfo.border} ${phaseInfo.color} hover:${phaseInfo.bg} cursor-pointer`
                }`}
              >
                {claiming ? '> KONTROL EDİLİYOR...' : '> ALLOWLIST TALEP ET'}
              </button>

              <div className="text-xs text-gray-600 mt-2">
                MasterKey sahibiyseniz cüzdanınızı imzalamanız yeterli.
              </div>

              {onBack && (
                <button
                  onClick={onBack}
                  className="mt-4 border border-green-800 text-green-400 px-6 py-2 text-sm tracking-widest hover:bg-green-950/30 transition-colors"
                >
                  &gt; OYUNA BAŞLA
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-green-800 mt-2 px-1">
          <span>VAULT LEGEND // PHASE {phase} AKTİF</span>
          <span>BASE CHAIN // SECURE</span>
        </div>

      </div>
    </div>
  )
}
