'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useEditorStore } from '@/store/useEditorStore'
import { gradients } from '@/utils/gradients'

const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), { ssr: false })

const MAC_BUTTONS = [
  { color: '#FF5F57', shadow: '#ff3b30' },
  { color: '#FFBD2E', shadow: '#ff9500' },
  { color: '#28C840', shadow: '#34c759' },
]

export default function PreviewWindow() {
  const {
    gradientId,
    padding,
    showBackground,
    showMacButtons,
    projectName,
    showWindowTitle,
    theme,
  } = useEditorStore()

  const currentGradient = gradients.find(g => g.id === gradientId) ?? gradients[0]
  const bgValue = showBackground ? currentGradient.value : '#0f0f17'

  return (
    <div
      id="preview-container"
      className="relative w-full"
    >
      <motion.div
        className="relative w-full"
        style={{ background: bgValue, padding: `${padding}px`, borderRadius: '16px' }}
        animate={{ background: bgValue, padding: `${padding}px` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Watermark — hidden in preview, revealed only during export */}
        <div
          data-watermark
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo.png"
            alt="SyntaxShot"
            width={14}
            height={14}
            style={{ borderRadius: '3px', display: 'block' }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.03em',
            }}
          >
            syntaxshot.app
          </span>
        </div>

        {/* Noise texture */}
        <div
          className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Mac Window */}
        <motion.div
          className="relative w-full"
          style={{
            background: 'rgba(22, 22, 30, 0.92)',
            borderRadius: '12px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
          layout
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
        >
          {/* Title Bar */}
          <div
            className="relative flex items-center px-4"
            style={{
              height: '44px',
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Mac Buttons */}
            <AnimatePresence>
              {showMacButtons && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.6, x: -6 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: -6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  {MAC_BUTTONS.map((btn, i) => (
                    <motion.div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: btn.color,
                        boxShadow: `0 0 6px ${btn.shadow}40`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        delay: i * 0.04,
                      }}
                      whileHover={{ scale: 1.25 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Window Title */}
            <AnimatePresence mode="wait">
              {showWindowTitle && (
                <motion.div
                  key={projectName}
                  className="absolute left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}
                  >
                    {projectName}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Editor — fades when theme changes */}
          <motion.div
            key={theme}
            className="p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <CodeEditor />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
