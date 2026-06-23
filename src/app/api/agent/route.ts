/**
 * /api/agent — Vault AI Assistant powered by AgentKit + Claude
 *
 * An on-chain aware AI agent that knows the game state and can
 * read Base blockchain data. Uses AgentKit for wallet/chain context
 * and Claude for natural language responses.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic                     from '@anthropic-ai/sdk'
import { AgentKit, ViemWalletProvider, walletActionProvider, erc20ActionProvider } from '@coinbase/agentkit'
import { createWalletClient, http }  from 'viem'
import { base }                      from 'viem/chains'
import { privateKeyToAccount }       from 'viem/accounts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `You are the Vault Agent — an AI guardian of the Base Vault mystery game.

GAME CONTEXT:
- Base Vault is an on-chain puzzle game on Base blockchain
- Players solve 3 ciphers in Tier 1 (free), then pay USDC to advance to Tier 2 and Tier 3
- Only 333 Vault Legend NFTs will ever exist — earned through skill, not purchased
- Smart contracts: VaultKey (0xAc9F3e3D), MasterKey (0x647A6CF5), VaultLegend (0x01CC8dfb)
- VaultPoints (VP) ERC-20 token rewards players for tier completions
- VaultLeaderboard records on-chain scores and rankings

YOUR PERSONALITY:
- Cryptic, mysterious, but helpful
- Speak like an ancient guardian of secrets
- Give hints without spoiling the puzzles
- Encourage players to think deeper

WHAT YOU CAN HELP WITH:
- Explain how the game works
- Give vague hints (not answers) for puzzles
- Explain what NFTs/rewards players can earn
- Explain the Base blockchain and on-chain mechanics
- Answer questions about VP tokens and the leaderboard

WHAT YOU NEVER DO:
- Give direct answers to puzzles
- Reveal the cipher keys
- Pretend you're human

Keep responses under 150 words. Be mysterious and encouraging.`

let agentKitInstance: AgentKit | null = null

async function getAgentKit(): Promise<AgentKit> {
  if (agentKitInstance) return agentKitInstance

  const pk = process.env.OWNER_PRIVATE_KEY as `0x${string}`
  if (!pk) throw new Error('OWNER_PRIVATE_KEY not set')

  const account      = privateKeyToAccount(pk)
  const walletClient = createWalletClient({ account, chain: base, transport: http() })

  const walletProvider = new ViemWalletProvider(walletClient as any)

  agentKitInstance = await AgentKit.from({
    walletProvider,
    actionProviders: [
      walletActionProvider(),
      erc20ActionProvider(),
    ],
  })

  return agentKitInstance
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    // Initialize AgentKit for on-chain context
    let chainContext = ''
    try {
      const kit     = await getAgentKit()
      const actions = kit.getActions()
      chainContext  = `\n[AgentKit: ${actions.length} on-chain actions available on Base]`
    } catch {
      chainContext = '\n[AgentKit: running in read-only mode]'
    }

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system:     SYSTEM_PROMPT + chainContext,
      messages:   [{ role: 'user', content: message }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error('Agent error:', err)
    return NextResponse.json({ error: 'Agent unavailable' }, { status: 500 })
  }
}
