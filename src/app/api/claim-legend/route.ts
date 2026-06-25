/**
 * POST /api/claim-legend
 *
 * Tier 3 tamamlayan oyuncuyu VaultLegend allowlist'ine ekler.
 *
 * Akış:
 *  1. Player wallet'ı ile bir mesaj imzalar (proof of ownership)
 *  2. API imzayı doğrular → gerçekten bu cüzdan
 *  3. On-chain kontrol: MasterKey sahibi mi? Zaten mint etti mi?
 *  4. Tüm kontroller geçerse → addToAllowlist() çağrılır
 *  5. Oyuncu artık mint.tsx üzerinden mint edebilir
 *
 * Güvenlik:
 *  - İmza doğrulama: replay attack'e karşı timestamp içerir
 *  - On-chain double-check: kontrat seviyesinde tekrar korunma var
 *  - OWNER_PRIVATE_KEY sadece Vercel env'de, kaynak kodda YOK
 */

import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, createWalletClient, http, verifyMessage, getAddress } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

// ── Kontrat adresleri — build-safe (env bozuksa sabite düşer, hata fırlatmaz) ──
function safeAddr(value: string | undefined, fallback: string): `0x${string}` {
  if (value) {
    try { return getAddress(value.trim().toLowerCase()) } catch { /* fall through */ }
  }
  return fallback as `0x${string}`
}
const VAULT_LEGEND_ADDR = safeAddr(process.env.NEXT_PUBLIC_VAULT_LEGEND, '0x01CC8dfb1B4eD8518fcb5e9A9049B846fdB5F0e8')
const MASTER_KEY_ADDR   = safeAddr(process.env.NEXT_PUBLIC_MASTER_KEY,   '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF')

// ── ABI ───────────────────────────────────────────────────────────
const MASTER_KEY_ABI = [
  { name: 'hasMinted',       type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  { name: 'tier3Completed',  type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
] as const

const VAULT_LEGEND_ABI = [
  { name: 'hasMinted',    type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  { name: 'allowlisted',  type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  { name: 'totalMinted',  type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'addToAllowlist', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'wallets', type: 'address[]' }], outputs: [] },
] as const

// ── İmza mesajı (client ile aynı olmalı) ─────────────────────────
export function buildClaimMessage(wallet: string, timestamp: number): string {
  return `Base Vault: Claim Vault Legend\nWallet: ${wallet}\nTimestamp: ${timestamp}`
}

// ── Rate limit (basit in-memory, Vercel serverless'ta sıfırlanır) ─
const recentRequests = new Map<string, number>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { wallet, signature, timestamp } = body as {
      wallet:    string
      signature: string
      timestamp: number
    }

    // ── 1. Input doğrulama ────────────────────────────────────────
    if (!wallet || !signature || !timestamp) {
      return NextResponse.json({ error: 'wallet, signature, timestamp gerekli' }, { status: 400 })
    }

    const walletAddr = wallet.toLowerCase() as `0x${string}`

    // ── 2. Timestamp taze mi? (5 dakika) ─────────────────────────
    const now = Date.now()
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'İmza süresi dolmuş, yeniden dene' }, { status: 400 })
    }

    // ── 3. Rate limit (cüzdan başına 10 dak) ─────────────────────
    const lastReq = recentRequests.get(walletAddr)
    if (lastReq && now - lastReq < 10 * 60 * 1000) {
      return NextResponse.json({ error: 'Çok fazla istek, 10 dakika bekle' }, { status: 429 })
    }

    // ── 4. İmzayı doğrula ────────────────────────────────────────
    const message = buildClaimMessage(wallet, timestamp)
    const isValidSig = await verifyMessage({
      address:   wallet as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })
    if (!isValidSig) {
      return NextResponse.json({ error: 'Geçersiz imza' }, { status: 401 })
    }

    // ── 5. On-chain kontroller ────────────────────────────────────
    const publicClient = createPublicClient({
      chain:     base,
      transport: http('https://mainnet.base.org'),
    })

    const [hasMasterKey, alreadyLegend, alreadyAllowlisted, totalMinted] = await Promise.all([
      publicClient.readContract({ address: MASTER_KEY_ADDR,   abi: MASTER_KEY_ABI,   functionName: 'hasMinted',    args: [wallet as `0x${string}`] }),
      publicClient.readContract({ address: VAULT_LEGEND_ADDR, abi: VAULT_LEGEND_ABI, functionName: 'hasMinted',    args: [wallet as `0x${string}`] }),
      publicClient.readContract({ address: VAULT_LEGEND_ADDR, abi: VAULT_LEGEND_ABI, functionName: 'allowlisted',  args: [wallet as `0x${string}`] }),
      publicClient.readContract({ address: VAULT_LEGEND_ADDR, abi: VAULT_LEGEND_ABI, functionName: 'totalMinted' }),
    ])

    if (!hasMasterKey) {
      return NextResponse.json({ error: 'Master Key gerekli (Tier 3 mint)' }, { status: 403 })
    }
    if (alreadyLegend) {
      return NextResponse.json({ error: 'Zaten Vault Legend mint ettin' }, { status: 409 })
    }
    if (alreadyAllowlisted) {
      return NextResponse.json({ ok: true, message: 'Zaten allowlist\'tesin, mint edebilirsin!' }, { status: 200 })
    }
    if (Number(totalMinted) >= 333) {
      return NextResponse.json({ error: 'Tüm 333 Vault Legend mint edildi' }, { status: 410 })
    }

    // ── 6. Allowlist'e ekle ───────────────────────────────────────
    const ownerPrivKey = process.env.OWNER_PRIVATE_KEY
    if (!ownerPrivKey) {
      return NextResponse.json({ error: 'Sunucu yapılandırması eksik' }, { status: 500 })
    }

    const account = privateKeyToAccount(ownerPrivKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain:     base,
      transport: http('https://mainnet.base.org'),
    })

    const BUILDER_CODE_SUFFIX = '0x62635f366e6868657471320b0080218021802180218021802180218021' as `0x${string}`

    const txHash = await walletClient.writeContract({
      address:      VAULT_LEGEND_ADDR,
      abi:          VAULT_LEGEND_ABI,
      functionName: 'addToAllowlist',
      args:         [[wallet as `0x${string}`]],
      gas:          BigInt(80_000),
      dataSuffix:   BUILDER_CODE_SUFFIX,
    })

    // Rate limit kaydı
    recentRequests.set(walletAddr, now)

    return NextResponse.json({
      ok:      true,
      message: 'Allowlist\'e eklendi! Artık Vault Legend mint edebilirsin.',
      txHash,
    })

  } catch (err: unknown) {
    console.error('[claim-legend API]', err)
    const msg = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
