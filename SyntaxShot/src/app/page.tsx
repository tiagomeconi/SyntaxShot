'use client'
import React from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ControlPanel from '@/components/controls/ControlPanel'

const PreviewWindow = dynamic(() => import('@/components/preview/PreviewWindow'), { ssr: false })

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080810' }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.png"
            alt="SyntaxShot"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span
            className="text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}
          >
            SyntaxShot
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: 'rgba(139,92,246,0.8)',
            }}
          >
            Beta
          </span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-8 gap-6">
        {/* Hero text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.03em' }}
          >
            Beautiful code screenshots
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Paste your code, customize the appearance, and export a stunning image.
          </p>
        </motion.div>

        {/* Preview Area */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <PreviewWindow />
        </motion.div>

        {/* Control Panel */}
        <div className="w-full flex justify-center">
          <ControlPanel />
        </div>
      </main>
    </div>
  )
}
