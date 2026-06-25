'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// Client-only (SSR kapalı) — wagmi hooks için gerekli
const Terminal    = dynamic(() => import('@/components/Terminal'),    { ssr: false })
const MintGate    = dynamic(() => import('@/components/MintGate'),    { ssr: false })
const ClaimLegend = dynamic(() => import('@/components/ClaimLegend'), { ssr: false })
const Leaderboard = dynamic(() => import('@/components/Leaderboard'), { ssr: false })
const VaultShop   = dynamic(() => import('@/components/VaultShop'),   { ssr: false })

type Stage =
  | 'landing'
  | 'tier1'
  | 'tier2gate'
  | 'tier2play'
  | 'tier3gate'
  | 'tier3play'
  | 'claim'
  | 'board'
  | 'shop'

type Lang  = 'EN' | 'DE' | 'AR' | 'ZH' | 'JA'

// ── Çeviriler ─────────────────────────────────────────────────────────────────
const T = {
  EN: {
    subtitle:     'ON-CHAIN MYSTERY GAME // BASE CHAIN',
    what_title:   'WHAT IS BASE VAULT?',
    what_desc:    'An on-chain mystery game built on Base Chain. Crack ciphers, mint rare NFTs, and conquer 3 tiers of escalating challenges — all recorded on the blockchain forever.',
    reward_title: '🏆 THE GRAND PRIZE',
    reward_desc:  'Only 333 Vault Legend NFTs will ever exist. They cannot be bought, traded, or gifted — only earned. Complete all 3 tiers to claim yours. The first 33 winners receive the ultra-rare 👑 Early Legend badge.',
    t1: 'TIER 1', t1desc: 'FREE — Ciphers & Quizzes',
    t2: 'TIER 2', t2desc: '33 USDC — Vault Key NFT',
    t3: 'TIER 3', t3desc: '66 USDC — Master Key NFT',
    p1: '👑 Phase 1 — Early Legend (33 only)',
    p2: '⚡ Phase 2 — Core Legend (100)',
    p3: '🔮 Phase 3 — Final Legend (200)',
    enter:        'ENTER THE VAULT →',
    connect:      'CONNECT WALLET TO ENTER',
    connect_note: 'A wallet is required to play and track your progress.',
    claim_link:   'Claim Legend NFT',
    board_link:   'Leaderboard',
    shop_link:    'Vault Shop',
    video_note:   '🔇 Click the video to unmute',
  },
  DE: {
    subtitle:     'ON-CHAIN RÄTSELSPIEL // BASE CHAIN',
    what_title:   'WAS IST BASE VAULT?',
    what_desc:    'Ein On-Chain-Rätselspiel auf Base Chain. Knacke Chiffren, minze seltene NFTs und bezwinge 3 Stufen eskalierender Herausforderungen — alles für immer auf der Blockchain gespeichert.',
    reward_title: '🏆 DER HAUPTPREIS',
    reward_desc:  'Nur 333 Vault Legend NFTs existieren jemals. Sie können nicht gekauft, gehandelt oder verschenkt werden — nur verdient. Schließe alle 3 Stufen ab. Die ersten 33 Gewinner erhalten das ultra-seltene 👑 Early Legend Abzeichen.',
    t1: 'STUFE 1', t1desc: 'KOSTENLOS — Chiffren & Rätsel',
    t2: 'STUFE 2', t2desc: '33 USDC — Vault Key NFT',
    t3: 'STUFE 3', t3desc: '66 USDC — Master Key NFT',
    p1: '👑 Phase 1 — Early Legend (nur 33)',
    p2: '⚡ Phase 2 — Core Legend (100)',
    p3: '🔮 Phase 3 — Final Legend (200)',
    enter:        'TRESOR BETRETEN →',
    connect:      'WALLET VERBINDEN',
    connect_note: 'Eine Wallet wird benötigt, um zu spielen und den Fortschritt zu verfolgen.',
    claim_link:   'Legend NFT beanspruchen',
    board_link:   'Bestenliste',
    shop_link:    'Vault Shop',
    video_note:   '🔇 Klicke auf das Video für Ton',
  },
  AR: {
    subtitle:     'لعبة غموض على السلسلة // BASE CHAIN',
    what_title:   'ما هو BASE VAULT؟',
    what_desc:    'لعبة غموض على السلسلة مبنية على Base Chain. فكّ الشفرات، سكّ NFTs النادرة، وتغلّب على 3 مستويات من التحديات المتصاعدة — كل شيء مسجّل على البلوك تشين للأبد.',
    reward_title: '🏆 الجائزة الكبرى',
    reward_desc:  'يوجد فقط 333 Vault Legend NFT للأبد. لا يمكن شراؤها أو تداولها أو إهداؤها — فقط كسبها. أتمّ جميع المستويات الـ3 للحصول عليها. أول 33 فائز يحصل على شارة 👑 Early Legend النادرة.',
    t1: 'المستوى 1', t1desc: 'مجاني — شفرات وألغاز',
    t2: 'المستوى 2', t2desc: '33 USDC — Vault Key NFT',
    t3: 'المستوى 3', t3desc: '66 USDC — Master Key NFT',
    p1: '👑 المرحلة 1 — Early Legend (33 فقط)',
    p2: '⚡ المرحلة 2 — Core Legend (100)',
    p3: '🔮 المرحلة 3 — Final Legend (200)',
    enter:        '← ادخل الخزنة',
    connect:      'اربط محفظتك للدخول',
    connect_note: 'المحفظة مطلوبة للعب وتتبع تقدمك.',
    claim_link:   'استلام Legend NFT',
    board_link:   'لوحة المتصدرين',
    shop_link:    'متجر الخزنة',
    video_note:   '🔇 اضغط على الفيديو لتشغيل الصوت',
  },
  ZH: {
    subtitle:     '链上解谜游戏 // BASE CHAIN',
    what_title:   'BASE VAULT 是什么？',
    what_desc:    '一款基于 Base Chain 的链上解谜游戏。破解密码、铸造稀有 NFT，征服3个难度递增的关卡——一切永久记录在区块链上。',
    reward_title: '🏆 终极大奖',
    reward_desc:  '全球永久仅有 333 枚 Vault Legend NFT。不能购买、交易或赠予——只能通过完成全部3个关卡来赢得。前33名获胜者将获得超稀有 👑 Early Legend 徽章。',
    t1: '第1关', t1desc: '免费 — 解密码与谜题',
    t2: '第2关', t2desc: '33 USDC — Vault Key NFT',
    t3: '第3关', t3desc: '66 USDC — Master Key NFT',
    p1: '👑 阶段1 — Early Legend（仅33枚）',
    p2: '⚡ 阶段2 — Core Legend（100枚）',
    p3: '🔮 阶段3 — Final Legend（200枚）',
    enter:        '进入保险库 →',
    connect:      '连接钱包以进入',
    connect_note: '需要钱包才能游戏并追踪进度。',
    claim_link:   '领取 Legend NFT',
    board_link:   '排行榜',
    shop_link:    '保险库商店',
    video_note:   '🔇 点击视频取消静音',
  },
  JA: {
    subtitle:     'オンチェーン謎解きゲーム // BASE CHAIN',
    what_title:   'BASE VAULT とは？',
    what_desc:    'Base Chain 上のオンチェーン謎解きゲーム。暗号を解読し、レアNFTをミントし、難易度が増す3つのティアを制覇しよう。すべてブロックチェーンに永久記録される。',
    reward_title: '🏆 究極の報酬',
    reward_desc:  'Vault Legend NFT は世界で333枚のみ存在する——永久に。購入・取引・贈与は一切不可。全3ティアを完了した者だけが獲得できる。上位33名には超レア 👑 Early Legend バッジが贈られる。',
    t1: 'ティア1', t1desc: '無料 — 暗号＆クイズ',
    t2: 'ティア2', t2desc: '33 USDC — Vault Key NFT',
    t3: 'ティア3', t3desc: '66 USDC — Master Key NFT',
    p1: '👑 フェーズ1 — Early Legend（33枚限定）',
    p2: '⚡ フェーズ2 — Core Legend（100枚）',
    p3: '🔮 フェーズ3 — Final Legend（200枚）',
    enter:        'VAULT に入る →',
    connect:      'ウォレットを接続して入場',
    connect_note: 'プレイと進捗の追跡にはウォレットが必要です。',
    claim_link:   'Legend NFT を請求',
    board_link:   'リーダーボード',
    shop_link:    'ヴォルトショップ',
    video_note:   '🔇 動画をクリックして音を出す',
  },
} as const

const LANGS: { key: Lang; flag: string; label: string }[] = [
  { key: 'EN', flag: '🇺🇸', label: 'EN'   },
  { key: 'DE', flag: '🇩🇪', label: 'DE'   },
  { key: 'AR', flag: '🇸🇦', label: 'AR'   },
  { key: 'ZH', flag: '🇨🇳', label: '中文' },
  { key: 'JA', flag: '🇯🇵', label: '日本語' },
]

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export default function Home() {
  const [stage, setStage] = useState<Stage>('landing')
  const [lang,  setLang]  = useState<Lang>('EN')
  const { isConnected } = useAccount()

  const t     = T[lang]
  const isRtl = lang === 'AR'

  return (
    <main className="min-h-screen bg-black font-mono">

      {/* ── LANDING ──────────────────────────────────────────────────────── */}
      {stage === 'landing' && (
        <div
          className="scanlines min-h-screen flex flex-col items-center px-4 py-8"
          dir={isRtl ? 'rtl' : 'ltr'}
        >

          {/* Dil seçici */}
          <div className="w-full max-w-2xl flex justify-end gap-1 mb-6 flex-wrap">
            {LANGS.map(l => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-2 py-1 text-xs border transition-colors ${
                  lang === l.key
                    ? 'border-green-400 text-green-400 bg-green-950/40'
                    : 'border-green-900 text-green-800 hover:border-green-700 hover:text-green-600'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          {/* Başlık */}
          <div className="text-center mb-6">
            <div className="crt text-5xl md:text-7xl tracking-widest font-bold">
              BASE VAULT
            </div>
            <div className="text-green-700 text-xs tracking-widest mt-2">
              {t.subtitle}
            </div>
          </div>

          {/* YouTube — sessiz autoplay (masaüstü), mobilde tıkla oynat */}
          <div className="w-full max-w-2xl mb-8">
            <div
              className="relative w-full border border-green-900"
              style={{ paddingBottom: '56.25%' }}
            >
              <iframe
                src="https://www.youtube.com/embed/IKQOKbFQp_4?si=mesZO6i1desgg6P-&autoplay=1&mute=1&rel=0&playsinline=1"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                title="Base Vault"
              />
            </div>
            <div className="text-center text-xs text-green-900 mt-1">
              {t.video_note}
            </div>
          </div>

          {/* Oyun ve ödül açıklaması */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Oyun nedir */}
            <div className="border border-green-900 bg-green-950/10 p-5">
              <div className="text-green-400 font-bold text-xs tracking-widest mb-3">
                {t.what_title}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t.what_desc}
              </p>
            </div>
            {/* Büyük ödül */}
            <div className="border border-amber-900 bg-amber-950/10 p-5">
              <div className="text-amber-400 font-bold text-xs tracking-widest mb-3">
                {t.reward_title}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t.reward_desc}
              </p>
            </div>
          </div>

          {/* Tier tablosu */}
          <div className="border border-green-900 p-5 max-w-2xl w-full mb-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">{t.t1}</span>
              <span className="text-green-400">{t.t1desc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">{t.t2}</span>
              <span className="text-gray-400">{t.t2desc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">{t.t3}</span>
              <span className="text-gray-400">{t.t3desc}</span>
            </div>
            <div className="border-t border-green-900 pt-3 space-y-1 text-xs">
              <div className="text-amber-400">{t.p1}</div>
              <div className="text-cyan-400">{t.p2}</div>
              <div className="text-green-400">{t.p3}</div>
            </div>
          </div>

          {/* CTA — Cüzdan bağlı değilse bağla butonu göster */}
          <div className="w-full max-w-2xl mb-6">
            {isConnected ? (
              <button
                onClick={() => setStage('tier1')}
                className="w-full border border-green-400 px-10 py-4 text-green-400 hover:bg-green-400 hover:text-black transition-all tracking-widest crt text-sm"
              >
                {t.enter}
              </button>
            ) : (
              <div className="border border-amber-900 bg-amber-950/10 p-6 text-center space-y-4">
                <div className="text-amber-400 font-mono text-sm tracking-widest">
                  &gt; {t.connect}
                </div>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
                <div className="text-xs text-gray-700">
                  {t.connect_note}
                </div>
              </div>
            )}
          </div>

          {/* Alt linkler */}
          <div className="flex gap-6 text-xs pb-4">
            <button
              onClick={() => setStage('claim')}
              className="text-amber-800 hover:text-amber-500 underline"
            >
              {t.claim_link}
            </button>
            <button
              onClick={() => setStage('board')}
              className="text-green-800 hover:text-green-600 underline"
            >
              {t.board_link}
            </button>
            <button
              onClick={() => setStage('shop')}
              className="text-cyan-700 hover:text-cyan-400 underline"
            >
              {t.shop_link}
            </button>
          </div>

        </div>
      )}

      {/* ── TIER 1: Terminal Bulmacalar ──────────────────────────────────── */}
      {stage === 'tier1' && (
        <Terminal lang={lang} onComplete={() => setStage('tier2gate')} onBack={() => setStage('landing')} />
      )}

      {/* ── TIER 2 GATE: Mint VaultKey ───────────────────────────────────── */}
      {stage === 'tier2gate' && (
        <div className="scanlines min-h-screen flex flex-col items-center justify-center px-4 space-y-8">
          <div className="text-center space-y-2">
            <div className="crt text-3xl tracking-widest">TIER 1 COMPLETE</div>
            <p className="text-green-600 text-sm">
              {'> Vault door cracked. Acquire the Vault Key to proceed.'}
            </p>
          </div>
          <MintGate tier={2} onMinted={() => setStage('tier2play')} />
          <button
            onClick={() => setStage('landing')}
            className="text-xs text-green-900 hover:text-green-700 underline"
          >
            ← Back to Landing
          </button>
        </div>
      )}

      {/* ── TIER 2 PLAY ──────────────────────────────────────────────────── */}
      {stage === 'tier2play' && (
        <div className="scanlines min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
          <div className="crt text-3xl tracking-widest">VAULT KEY ACQUIRED</div>
          <div className="border border-green-800 p-6 max-w-sm text-sm space-y-4">
            <p className="text-green-500">{'> Chapter 1-3 unlocked.'}</p>
            <p className="text-green-500">{'> On-chain puzzles loading...'}</p>
            <p className="text-green-700 text-xs">(Full gameplay — coming in next update)</p>
          </div>
          <button
            onClick={() => setStage('tier3gate')}
            className="border border-green-500 px-8 py-3 text-sm hover:bg-green-500 hover:text-black transition-colors tracking-widest"
          >
            PROCEED TO TIER 3 →
          </button>
        </div>
      )}

      {/* ── TIER 3 GATE: Mint MasterKey ──────────────────────────────────── */}
      {stage === 'tier3gate' && (
        <div className="scanlines min-h-screen flex flex-col items-center justify-center px-4 space-y-8">
          <div className="text-center space-y-2">
            <div className="crt text-3xl tracking-widest">FINAL DESCENT</div>
            <p className="text-green-600 text-sm">
              {'> The Architect awaits. Mint the Master Key to face him.'}
            </p>
            <div className="flex gap-4 justify-center text-xs mt-2">
              <span className="text-amber-400">👑 Phase 1: 33 Early Legends</span>
              <span className="text-cyan-400">⚡ Phase 2: 100 Core Legends</span>
            </div>
          </div>
          <MintGate tier={3} onMinted={() => setStage('tier3play')} />
        </div>
      )}

      {/* ── TIER 3 PLAY ──────────────────────────────────────────────────── */}
      {stage === 'tier3play' && (
        <div className="scanlines min-h-screen flex flex-col items-center justify-center px-4 space-y-8 text-center">
          <div className="crt text-3xl tracking-widest glitch">MASTER KEY ACQUIRED</div>
          <div className="border border-amber-800 p-6 max-w-sm text-sm space-y-4">
            <p className="text-amber-400">{'> The Architect chapter loading...'}</p>
            <p className="text-green-500 text-xs mt-2">
              {"› Tier 3 onaylandı. Allowlist'e eklendikten sonra Legend mint edebilirsiniz."}
            </p>
            <p className="text-green-600 text-xs">(Final chapter — coming soon)</p>
          </div>
          <button
            onClick={() => setStage('claim')}
            className="border border-amber-500 px-8 py-3 text-amber-400 text-sm hover:bg-amber-500 hover:text-black transition-colors tracking-widest animate-pulse"
          >
            👑 CLAIM VAULT LEGEND →
          </button>
        </div>
      )}

      {/* ── CLAIM: VaultLegend Allowlist Mint ────────────────────────────── */}
      {stage === 'claim' && (
        <ClaimLegend onBack={() => setStage('landing')} />
      )}

      {/* ── VAULT SHOP: x402 premium hint satın al ───────────────────────── */}
      {stage === 'shop' && (
        <VaultShop lang={lang} onBack={() => setStage('landing')} />
      )}

      {/* ── LEADERBOARD ──────────────────────────────────────────────────── */}
      {stage === 'board' && (
        <div className="scanlines min-h-screen px-4 py-8">
          <button
            onClick={() => setStage('landing')}
            className="text-xs text-green-800 hover:text-green-600 underline mb-6 block"
          >
            ← Back
          </button>
          <Leaderboard />
        </div>
      )}

    </main>
  )
}
