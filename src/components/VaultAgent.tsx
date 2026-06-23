'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'agent'; text: string }

export default function VaultAgent() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: '> VAULT AGENT ONLINE. I am the guardian of secrets. Ask me anything about the Vault...' }
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const res  = await fetch('/api/agent', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'agent',
        text: data.reply || data.error || 'The agent is silent...',
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: '> CONNECTION LOST. TRY AGAIN.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black border border-green-700 text-green-400 flex items-center justify-center hover:border-green-400 transition-colors"
        title="Vault Agent"
      >
        <span className="text-lg">{open ? '✕' : '🤖'}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 border border-green-800 bg-black/95 font-mono text-xs flex flex-col"
          style={{ height: '360px' }}
        >
          {/* Header */}
          <div className="border-b border-green-900 px-3 py-2 text-green-500 tracking-widest text-xs flex justify-between items-center">
            <span>VAULT AGENT // AGENTKIT</span>
            <span className="text-green-900 text-xs">BASE CHAIN</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <span className={`inline-block text-left leading-5 ${
                  m.role === 'agent' ? 'text-green-400' : 'text-white/80'
                }`}>
                  {m.role === 'agent' ? '' : '> '}{m.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-green-700 animate-pulse">{'> ...'}</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); send() }}
            className="border-t border-green-900 flex items-center px-3 py-2 gap-2"
          >
            <span className="text-green-600 shrink-0">{'>'}</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask the agent..."
              className="flex-1 bg-transparent outline-none text-white/90 caret-green-400 placeholder-green-900 text-xs"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="text-green-700 hover:text-green-400 disabled:opacity-30 transition-colors"
            >
              ↵
            </button>
          </form>
        </div>
      )}
    </>
  )
}
