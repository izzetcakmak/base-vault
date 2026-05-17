'use client'

import { useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/wagmi'
import { parseAbi } from 'viem'

const ABI = parseAbi([
  'function totalMinted() view returns (uint256)',
])

const LEGEND_ABI = parseAbi([
  'function totalMinted() view returns (uint256)',
])

// Mock leaderboard — gerçek versiyon event indexer ile doldurulur
const MOCK_PLAYERS = [
  { addr: '0x1a2b...3c4d', tier: 4, time: '2h ago' },
  { addr: '0x5e6f...7g8h', tier: 3, time: '4h ago' },
  { addr: '0x9i0j...1k2l', tier: 3, time: '5h ago' },
  { addr: '0x3m4n...5o6p', tier: 2, time: '6h ago' },
  { addr: '0x7q8r...9s0t', tier: 2, time: '8h ago' },
]

const TIER_COLORS: Record<number, string> = {
  4: 'text-amber-400',
  3: 'text-green-300',
  2: 'text-green-500',
  1: 'text-green-800',
}

const TIER_LABELS: Record<number, string> = {
  4: '★ VAULT LEGEND',
  3: '◆ MASTER KEY',
  2: '◇ VAULT KEY',
  1: '· INITIATE',
}

export default function Leaderboard() {
  const { data: keysMinted }    = useReadContract({
    address: CONTRACTS.VAULT_KEY,
    abi: ABI,
    functionName: 'totalMinted',
  })

  const { data: mastersMinted } = useReadContract({
    address: CONTRACTS.MASTER_KEY,
    abi: ABI,
    functionName: 'totalMinted',
  })

  const { data: legendsMinted } = useReadContract({
    address: CONTRACTS.VAULT_LEGEND,
    abi: LEGEND_ABI,
    functionName: 'totalMinted',
  })

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Başlık */}
      <div className="text-center space-y-1">
        <div className="crt text-2xl tracking-widest">VAULT LEADERBOARD</div>
        <p className="text-green-700 text-xs">On-chain progress tracking</p>
      </div>

      {/* Genel istatistikler */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'VAULT KEYS',    value: keysMinted?.toString()    ?? '—', color: 'text-green-400' },
          { label: 'MASTER KEYS',   value: mastersMinted?.toString() ?? '—', color: 'text-green-300' },
          { label: 'VAULT LEGENDS', value: legendsMinted?.toString() ?? '—', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="border border-green-900 p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-green-700 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Oyuncu listesi */}
      <div className="border border-green-900">
        <div className="border-b border-green-900 p-3 grid grid-cols-3 text-xs text-green-700">
          <span>PLAYER</span>
          <span>TIER</span>
          <span className="text-right">TIME</span>
        </div>

        {MOCK_PLAYERS.map((p, i) => (
          <div
            key={i}
            className="p-3 grid grid-cols-3 text-sm border-b border-green-950 hover:bg-green-950/30 transition-colors"
          >
            <span className="text-green-500">{p.addr}</span>
            <span className={TIER_COLORS[p.tier]}>{TIER_LABELS[p.tier]}</span>
            <span className="text-right text-green-800 text-xs">{p.time}</span>
          </div>
        ))}

        <div className="p-3 text-center text-xs text-green-900">
          Full indexing via on-chain events — updating live
        </div>
      </div>

      {/* Supply bilgisi */}
      <div className="border border-green-900 p-4 text-xs space-y-2 text-green-700">
        <div className="flex justify-between">
          <span>Vault Key remaining</span>
          <span>{ keysMinted ? (3333n - (keysMinted as bigint)).toString() : '3,333' } / 3,333</span>
        </div>
        <div className="flex justify-between">
          <span>Master Key remaining</span>
          <span>{ mastersMinted ? (666n - (mastersMinted as bigint)).toString() : '666' } / 666</span>
        </div>
        <div className="flex justify-between text-amber-700">
          <span>Vault Legend remaining</span>
          <span>{ legendsMinted ? (333n - (legendsMinted as bigint)).toString() : '333' } / 333</span>
        </div>
      </div>
    </div>
  )
}
