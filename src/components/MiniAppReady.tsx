'use client'

import { useEffect } from 'react'

export function MiniAppReady() {
  useEffect(() => {
    import('@farcaster/frame-sdk')
      .then(({ sdk }) => {
        sdk.actions.ready().catch(() => {})
      })
      .catch(() => {})
  }, [])

  return null
}
