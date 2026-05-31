'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CONTRACTS, PRICES, BUILDER_CODE_SUFFIX } from '@/lib/wagmi'
import { parseAbi, formatUnits } from 'viem'

// ─── ABI'ler ─────────────────────────────────────────────────────────────────
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
])

const VAULT_KEY_ABI = parseAbi([
  'function mint() external',
  'function hasMinted(address) view returns (bool)',
  'function totalMinted() view returns (uint256)',
])

const MASTER_KEY_ABI = parseAbi([
  'function mint() external',
  'function hasMinted(address) view returns (bool)',
  'function totalMinted() view returns (uint256)',
])

type Tier = 2 | 3
type Step = 'idle' | 'approving' | 'approved' | 'minting' | 'done' | 'error'

export default function MintGate({ tier, onMinted }: { tier: Tier; onMinted: () => void }) {
  const { address, isConnected, chain } = useAccount()
  const publicClient = usePublicClient()

  const [step,    setStep]    = useState<Step>('idle')
  const [errMsg,  setErrMsg]  = useState('')
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>()
  const [mintTxHash,    setMintTxHash]    = useState<`0x${string}` | undefined>()

  const contractAddress = tier === 2 ? CONTRACTS.VAULT_KEY  : CONTRACTS.MASTER_KEY
  const abi             = tier === 2 ? VAULT_KEY_ABI         : MASTER_KEY_ABI
  const price           = tier === 2 ? PRICES.TIER2          : PRICES.TIER3
  const label           = tier === 2 ? 'Vault Key'           : 'Master Key'
  const usdcAmount      = tier === 2 ? '33'                  : '66'
  const maxSupply       = tier === 2 ? '3,333'               : '666'

  // Testnet'te MockUSDC kullan, mainnet'te gerçek USDC
  const usdcAddress = (CONTRACTS as any).MOCK_USDC || CONTRACTS.USDC

  // ── Reads ──────────────────────────────────────────────────────────────────
  const { data: alreadyMinted, refetch: refetchMinted } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!contractAddress },
  })

  const { data: totalMinted } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'totalMinted',
    query: { enabled: !!contractAddress },
  })

  const { data: usdcBalance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!usdcAddress },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: { enabled: !!address && !!contractAddress && !!usdcAddress },
  })

  // ── Write hooks ────────────────────────────────────────────────────────────
  const { writeContractAsync } = useWriteContract()

  // Approve TX takibi
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  // Mint TX takibi
  const { isSuccess: mintSuccess, isLoading: mintLoading } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  })

  // Approve onaylandı → approved adımına geç
  useEffect(() => {
    if (approveSuccess && step === 'approving') {
      refetchAllowance()
      setStep('approved')
    }
  }, [approveSuccess, step, refetchAllowance])

  // Mint onaylandı → done
  useEffect(() => {
    if (mintSuccess && step === 'minting') {
      setStep('done')
      refetchMinted()
      setTimeout(onMinted, 1500)
    }
  }, [mintSuccess, step, onMinted, refetchMinted])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    try {
      setStep('approving')
      setErrMsg('')
      const hash = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contractAddress, price],
        dataSuffix: BUILDER_CODE_SUFFIX,
      })
      setApproveTxHash(hash)
    } catch (e: any) {
      setErrMsg(e?.shortMessage || e?.message || 'Approve başarısız')
      setStep('idle')
    }
  }

  const handleMint = async () => {
    try {
      setStep('minting')
      setErrMsg('')
      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'mint',
        dataSuffix: BUILDER_CODE_SUFFIX,
      })
      setMintTxHash(hash)
    } catch (e: any) {
      setErrMsg(e?.shortMessage || e?.message || 'Mint başarısız')
      setStep('minting' === step ? 'approved' : 'idle')
    }
  }

  // ── Hesaplamalar ──────────────────────────────────────────────────────────
  const hasEnoughAllowance = allowance !== undefined && (allowance as bigint) >= price
  const usdcBal = usdcBalance ? Number(formatUnits(usdcBalance as bigint, 6)).toFixed(2) : '—'
  const hasEnoughUSDC = usdcBalance !== undefined && (usdcBalance as bigint) >= price
  const minted = totalMinted !== undefined ? Number(totalMinted).toString() : '—'
  const explorerBase = chain?.id === 84532
    ? 'https://sepolia.basescan.org/tx/'
    : 'https://basescan.org/tx/'

  // ── Render: bağlı değil ───────────────────────────────────────────────────
  if (!isConnected || !address) {
    return (
      <div className="border border-green-800 p-8 max-w-md mx-auto text-center space-y-4">
        <div className="crt text-lg tracking-widest">WALLET REQUIRED</div>
        <p className="text-green-600 text-sm">{'> Connect your wallet to mint'}</p>
        <ConnectButton />
      </div>
    )
  }

  // ── Render: zaten mint edilmiş ────────────────────────────────────────────
  if (alreadyMinted) {
    return (
      <div className="border border-green-700 p-6 max-w-md mx-auto text-center space-y-4">
        <div className="crt text-xl">✓ {label.toUpperCase()} OWNED</div>
        <p className="text-green-600 text-sm">{'> Key already in your wallet. Proceed.'}</p>
        <button
          onClick={onMinted}
          className="border border-green-500 px-8 py-3 text-sm hover:bg-green-500 hover:text-black transition-colors tracking-widest"
        >
          CONTINUE →
        </button>
      </div>
    )
  }

  // ── Render: mint UI ───────────────────────────────────────────────────────
  return (
    <div className="border border-green-800 p-6 space-y-5 max-w-md mx-auto">

      {/* Başlık */}
      <div>
        <div className="crt text-xl tracking-widest">{label.toUpperCase()} // TIER {tier}</div>
        <p className="text-green-700 text-xs mt-1">{'> Mint your access key to proceed'}</p>
      </div>

      {/* Info */}
      <div className="border border-green-900 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-green-600">PRICE</span>
          <span className="crt">{usdcAmount} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-600">MAX SUPPLY</span>
          <span>{maxSupply}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-600">MINTED</span>
          <span>{minted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-600">YOUR USDC</span>
          <span className={hasEnoughUSDC ? 'text-green-400' : 'text-red-400'}>{usdcBal}</span>
        </div>
        {tier === 3 && (
          <div className="flex justify-between border-t border-green-900 pt-2 mt-2">
            <span className="text-amber-600">REWARD</span>
            <span className="text-amber-400">FREE Vault Legend NFT</span>
          </div>
        )}
      </div>

      {/* USDC yetersiz uyarısı */}
      {!hasEnoughUSDC && (
        <div className="text-red-400 text-xs border border-red-900 p-2">
          {'> INSUFFICIENT USDC. Get test USDC from the faucet or check your balance.'}
        </div>
      )}

      {/* Adım 1: Approve */}
      <button
        onClick={handleApprove}
        disabled={!hasEnoughUSDC || hasEnoughAllowance || step === 'approving'}
        className={`w-full border px-4 py-3 text-sm transition-all tracking-wider ${
          hasEnoughAllowance
            ? 'border-green-900 text-green-800 cursor-not-allowed'
            : !hasEnoughUSDC
            ? 'border-green-900 text-green-900 cursor-not-allowed'
            : step === 'approving'
            ? 'border-green-600 text-green-400 animate-pulse'
            : 'border-green-500 hover:bg-green-500 hover:text-black cursor-pointer'
        }`}
      >
        {step === 'approving'
          ? '> APPROVING... (confirm in wallet)'
          : hasEnoughAllowance
          ? '✓ STEP 1: USDC APPROVED'
          : '1. APPROVE USDC'}
      </button>

      {/* Adım 2: Mint */}
      <button
        onClick={handleMint}
        disabled={!hasEnoughAllowance || step === 'minting' || step === 'done' || mintLoading}
        className={`w-full border px-4 py-3 text-sm transition-all tracking-wider ${
          !hasEnoughAllowance
            ? 'border-green-900 text-green-900 cursor-not-allowed'
            : step === 'minting' || mintLoading
            ? 'border-green-400 text-green-400 animate-pulse'
            : step === 'done'
            ? 'border-green-400 text-green-400'
            : 'border-green-400 hover:bg-green-400 hover:text-black cursor-pointer'
        }`}
      >
        {step === 'done'
          ? `✓ ${label.toUpperCase()} MINTED!`
          : step === 'minting' || mintLoading
          ? '> MINTING... (confirm in wallet)'
          : `2. MINT ${label.toUpperCase()}`}
      </button>

      {/* Hata */}
      {errMsg && (
        <div className="text-red-400 text-xs border border-red-900 p-2 break-all">
          {'> ERROR: '}{errMsg}
        </div>
      )}

      {/* TX linkler */}
      {approveTxHash && (
        <div className="text-xs text-green-800">
          Approve TX:{' '}
          <a href={explorerBase + approveTxHash} target="_blank" rel="noreferrer"
             className="underline hover:text-green-600">
            {approveTxHash.slice(0, 16)}...
          </a>
        </div>
      )}
      {mintTxHash && (
        <div className="text-xs text-green-800">
          Mint TX:{' '}
          <a href={explorerBase + mintTxHash} target="_blank" rel="noreferrer"
             className="underline hover:text-green-600">
            {mintTxHash.slice(0, 16)}...
          </a>
        </div>
      )}

      {/* Wallet */}
      <div className="pt-2 border-t border-green-900 flex justify-between items-center">
        <span className="text-xs text-green-800">{address.slice(0,6)}...{address.slice(-4)}</span>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>
    </div>
  )
}
