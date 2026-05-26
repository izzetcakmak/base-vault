import { AgentKit } from '@coinbase/agentkit'

let cachedAgent: AgentKit | null = null

export async function getVaultGuardian(): Promise<AgentKit | null> {
  if (cachedAgent) return cachedAgent

  const keyId = process.env.CDP_API_KEY_ID
  const keySecret = process.env.CDP_API_KEY_SECRET

  if (!keyId || !keySecret) return null

  try {
    cachedAgent = await AgentKit.from({
      cdpApiKeyId: keyId,
      cdpApiKeySecret: keySecret,
    })
    return cachedAgent
  } catch (err) {
    console.error('[vault-guardian] AgentKit init failed:', err)
    return null
  }
}
