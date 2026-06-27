import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base Vault — Docs',
  description: 'How Base Vault works: the game, x402 payments, the AgentKit Vault Guardian, NFTs, and the smart contracts on Base.',
}

const CONTRACTS = [
  { name: 'VaultKey',        sub: 'Tier 2 NFT — access key',        addr: '0xAc9F3e3D0F2bb1AACb625C67c6eDFeBf397b4463' },
  { name: 'MasterKey',       sub: 'Tier 3 NFT — final descent',     addr: '0x647A6CF58ABaFBF04b14d7E83dDaAC476D8386eF' },
  { name: 'VaultLegend',     sub: 'Reward NFT — only 333',          addr: '0x01CC8dfb1B4eD8518fcb5e9A9049B846fdB5F0e8' },
  { name: 'VaultPoints',     sub: 'ERC-20 reward token (VP)',       addr: '0x5278030b62919bae34Fe26Aaa7CC6deb1e48A37C' },
  { name: 'VaultLeaderboard', sub: 'On-chain scores',               addr: '0xC5b7052331F90dD47aE74E79B61E00DDe3C2Cca5' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      <h2 className="crt text-green-400 text-xl tracking-widest mb-4 border-b border-green-900 pb-2">
        {title}
      </h2>
      <div className="text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function DocsPage() {
  return (
    <main className="scanlines min-h-screen bg-black font-mono">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border border-green-800 p-4">
          <div>
            <div className="crt text-2xl tracking-widest">BASE VAULT</div>
            <div className="text-green-700 text-xs tracking-widest mt-1">DOCUMENTATION // BASE CHAIN</div>
          </div>
          <a href="/" className="text-xs text-green-700 hover:text-green-400 border border-green-900 hover:border-green-700 px-3 py-1 transition-colors">
            ← App
          </a>
        </div>

        {/* TOC */}
        <nav className="border border-green-900 bg-green-950/10 p-4 mb-10 text-xs">
          <div className="text-green-600 tracking-widest mb-2">CONTENTS</div>
          <div className="grid grid-cols-2 gap-1 text-green-500">
            <a href="#overview"     className="hover:text-green-300">01 · Overview</a>
            <a href="#how-to-play"  className="hover:text-green-300">02 · How to Play</a>
            <a href="#rewards"      className="hover:text-green-300">03 · Rewards & NFTs</a>
            <a href="#vault-shop"   className="hover:text-green-300">04 · Vault Shop (x402)</a>
            <a href="#guardian"     className="hover:text-green-300">05 · Vault Guardian (AI)</a>
            <a href="#contracts"    className="hover:text-green-300">06 · Smart Contracts</a>
            <a href="#stack"        className="hover:text-green-300">07 · Tech Stack</a>
            <a href="#links"        className="hover:text-green-300">08 · Links</a>
          </div>
        </nav>

        <Section id="overview" title="01 · Overview">
          <p>
            <span className="text-green-400">Base Vault</span> is an on-chain mystery puzzle game built on
            Base. Players crack ciphers and answer cryptic challenges across escalating tiers to earn rare,
            non-purchasable NFTs. Everything — progression, payments, and rewards — is recorded on Base mainnet.
          </p>
          <p>
            The core idea: <span className="text-green-400">every reward is earned, not bought.</span> Only
            players who prove their skill across all three tiers can claim a Vault Legend.
          </p>
        </Section>

        <Section id="how-to-play" title="02 · How to Play">
          <p>A wallet on Base is required to play and track progress.</p>
          <ul className="list-none space-y-2">
            <li><span className="text-green-500">{'> TIER 1 '}</span>— Free. Solve 3 terminal ciphers (Caesar, binary, logic, crypto, math). 3 wrong answers locks the wallet for a short cooldown.</li>
            <li><span className="text-green-500">{'> TIER 2 '}</span>— Mint the <span className="text-green-400">Vault Key</span> NFT (33 USDC) to unlock the next chamber.</li>
            <li><span className="text-green-500">{'> TIER 3 '}</span>— Mint the <span className="text-green-400">Master Key</span> NFT (66 USDC) for the final descent.</li>
            <li><span className="text-green-500">{'> CLAIM  '}</span>— Complete all tiers, get allowlisted, and mint your <span className="text-amber-400">Vault Legend</span> (gas only).</li>
          </ul>
          <p className="text-gray-500 text-xs">The game UI is available in English, German, Arabic, Chinese and Japanese — puzzles and AI hints included.</p>
        </Section>

        <Section id="rewards" title="03 · Rewards & NFTs">
          <ul className="list-none space-y-2">
            <li>👑 <span className="text-amber-400">Vault Legend</span> — the grand prize. Only <span className="text-amber-400">333</span> will ever exist, across 3 phases: Early (1–33), Core (34–133), Final (134–333). Cannot be bought, traded for, or gifted into — only earned.</li>
            <li>🔑 <span className="text-green-400">Vault Key / Master Key</span> — tiered access NFTs that gate Tier 2 and Tier 3.</li>
            <li>💎 <span className="text-green-400">Vault Points (VP)</span> — an ERC-20 reward token earned on tier completion.</li>
            <li>📊 <span className="text-green-400">Vault Leaderboard</span> — completion scores recorded on-chain.</li>
          </ul>
        </Section>

        <Section id="vault-shop" title="04 · Vault Shop — x402 Payments">
          <p>
            Stuck on a cipher? The <span className="text-cyan-400">Vault Shop</span> sells premium hints for
            <span className="text-cyan-400"> 0.01 USDC</span>, paid instantly with the
            <span className="text-cyan-400"> x402 protocol</span> on Base — no checkout, no account.
          </p>
          <ul className="list-none space-y-2">
            <li><span className="text-cyan-600">{'1. '}</span>The client signs an EIP-3009 <span className="text-cyan-400">transferWithAuthorization</span> (gasless) — one wallet signature, no gas.</li>
            <li><span className="text-cyan-600">{'2. '}</span>The server returns <span className="text-cyan-400">HTTP 402</span> with payment requirements, then verifies and settles the payment.</li>
            <li><span className="text-cyan-600">{'3. '}</span>Settlement runs through the <span className="text-cyan-400">Coinbase CDP facilitator</span> for real USDC settlement on Base mainnet.</li>
            <li><span className="text-cyan-600">{'4. '}</span>The hint unlocks. A Builder Code attribution is declared on the resource server.</li>
          </ul>
        </Section>

        <Section id="guardian" title="05 · Vault Guardian — AgentKit AI">
          <p>
            The <span className="text-amber-400">Vault Guardian</span> is an
            <span className="text-amber-400"> AgentKit</span> agent (ViemWalletProvider on Base mainnet, with
            wallet + ERC-20 action providers) wired to Claude. It gives cryptic, adaptive hints that grow more
            helpful the more you struggle — without ever revealing the answer.
          </p>
          <p>The Guardian replies in the player&apos;s selected language, matching the rest of the UI.</p>
        </Section>

        <Section id="contracts" title="06 · Smart Contracts">
          <p className="mb-3">All deployed and verified on Base mainnet:</p>
          <div className="space-y-2">
            {CONTRACTS.map(c => (
              <a
                key={c.addr}
                href={`https://basescan.org/address/${c.addr}#code`}
                target="_blank"
                rel="noreferrer"
                className="block border border-green-900 hover:border-green-600 bg-green-950/10 p-3 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-green-400">{c.name}</span>
                  <span className="text-green-800 text-xs">↗ Basescan</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">{c.sub}</div>
                <div className="text-green-700 text-xs mt-1 break-all">{c.addr}</div>
              </a>
            ))}
          </div>
        </Section>

        <Section id="stack" title="07 · Tech Stack">
          <ul className="list-none space-y-1 text-gray-400">
            <li>· Next.js (App Router) · TypeScript · Tailwind</li>
            <li>· wagmi + viem + RainbowKit (multi-RPC fallback on Base)</li>
            <li>· Solidity (ERC-721 / ERC-20), verified on Basescan</li>
            <li>· x402 + @coinbase/x402 (CDP facilitator) for payments</li>
            <li>· @coinbase/agentkit + Claude for the Vault Guardian</li>
            <li>· Farcaster Mini App · IPFS (Pinata) for NFT metadata</li>
          </ul>
        </Section>

        <Section id="links" title="08 · Links">
          <ul className="list-none space-y-2">
            <li>🌐 App — <a href="https://www.vaultgame.online" className="text-green-400 hover:underline">vaultgame.online</a></li>
            <li>💻 GitHub — <a href="https://github.com/izzetcakmak/base-vault" target="_blank" rel="noreferrer" className="text-green-400 hover:underline">github.com/izzetcakmak/base-vault</a></li>
            <li>🔵 Base — <a href="https://www.base.org" target="_blank" rel="noreferrer" className="text-green-400 hover:underline">base.org</a></li>
          </ul>
        </Section>

        <div className="text-center text-xs text-green-900 border-t border-green-900 pt-6 mt-8">
          BASE VAULT // ON-CHAIN MYSTERY // BUILT ON BASE
        </div>
      </div>
    </main>
  )
}
