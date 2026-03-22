'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/store/useEditorStore'
import { gradients } from '@/utils/gradients'
import { useExportImage } from '@/hooks/useExportImage'
import type { Language, EditorTheme } from '@/store/useEditorStore'

const themes: { id: EditorTheme; name: string; preview: string }[] = [
  { id: 'github-dark', name: 'GitHub Dark', preview: '#0d1117' },
  { id: 'one-dark-pro', name: 'One Dark', preview: '#282c34' },
  { id: 'dracula', name: 'Dracula', preview: '#282a36' },
  { id: 'nord', name: 'Nord', preview: '#2e3440' },
  { id: 'monokai', name: 'Monokai', preview: '#272822' },
  { id: 'tokyo-night', name: 'Tokyo Night', preview: '#1a1b26' },
  { id: 'aura', name: 'Aura', preview: '#15141b' },
  { id: 'andromeda', name: 'Andromeda', preview: '#23262e' },
]

const languageGroups: { label: string; languages: { id: Language; name: string }[] }[] = [
  {
    label: 'General',
    languages: [
      { id: 'plaintext', name: 'Plaintext' },
      { id: 'diff',      name: 'Diff' },
      { id: 'markdown',  name: 'Markdown' },
    ],
  },
  {
    label: 'Web',
    languages: [
      { id: 'javascript', name: 'JavaScript' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'jsx',        name: 'JSX' },
      { id: 'tsx',        name: 'TSX' },
      { id: 'html',       name: 'HTML' },
      { id: 'css',        name: 'CSS' },
      { id: 'scss',       name: 'SCSS' },
      { id: 'less',       name: 'Less' },
      { id: 'vue',        name: 'Vue' },
      { id: 'angular',    name: 'Angular' },
      { id: 'svelte',     name: 'Svelte' },
      { id: 'astro',      name: 'Astro' },
      { id: 'liquid',     name: 'Liquid' },
      { id: 'graphql',    name: 'GraphQL' },
    ],
  },
  {
    label: 'Systems',
    languages: [
      { id: 'rust',  name: 'Rust' },
      { id: 'c',     name: 'C' },
      { id: 'cpp',   name: 'C++' },
      { id: 'go',    name: 'Go' },
      { id: 'zig',   name: 'Zig' },
      { id: 'wasm',  name: 'WebAssembly' },
      { id: 'move',  name: 'Move' },
      { id: 'v',     name: 'V' },
    ],
  },
  {
    label: 'JVM / Compiled',
    languages: [
      { id: 'java',       name: 'Java' },
      { id: 'kotlin',     name: 'Kotlin' },
      { id: 'scala',      name: 'Scala' },
      { id: 'csharp',     name: 'C#' },
      { id: 'dart',       name: 'Dart' },
      { id: 'swift',      name: 'Swift' },
      { id: 'objectivec', name: 'Objective-C' },
    ],
  },
  {
    label: 'Scripting',
    languages: [
      { id: 'python',     name: 'Python' },
      { id: 'ruby',       name: 'Ruby' },
      { id: 'php',        name: 'PHP' },
      { id: 'lua',        name: 'Lua' },
      { id: 'perl',       name: 'Perl' },
      { id: 'r',          name: 'R' },
      { id: 'matlab',     name: 'MATLAB' },
      { id: 'julia',      name: 'Julia' },
    ],
  },
  {
    label: 'Functional',
    languages: [
      { id: 'haskell', name: 'Haskell' },
      { id: 'ocaml',   name: 'OCaml' },
      { id: 'elixir',  name: 'Elixir' },
      { id: 'erlang',  name: 'Erlang' },
      { id: 'gleam',   name: 'Gleam' },
      { id: 'clojure', name: 'Clojure' },
      { id: 'lisp',    name: 'Lisp' },
      { id: 'elm',     name: 'Elm' },
      { id: 'crystal', name: 'Crystal' },
    ],
  },
  {
    label: 'Shell / Ops',
    languages: [
      { id: 'bash',       name: 'Bash' },
      { id: 'powershell', name: 'PowerShell' },
      { id: 'dockerfile', name: 'Dockerfile' },
      { id: 'hcl',        name: 'HCL' },
    ],
  },
  {
    label: 'Data / Config',
    languages: [
      { id: 'json',  name: 'JSON' },
      { id: 'yaml',  name: 'YAML' },
      { id: 'xml',   name: 'XML' },
      { id: 'toml',  name: 'TOML' },
      { id: 'sql',   name: 'SQL' },
      { id: 'latex', name: 'LaTeX' },
    ],
  },
  {
    label: 'Other',
    languages: [
      { id: 'solidity', name: 'Solidity' },
      { id: 'cypher',   name: 'Cypher' },
      { id: 'prisma',   name: 'Prisma' },
    ],
  },
]

const languages = languageGroups.flatMap(g => g.languages)

const PADDING_OPTIONS = [16, 32, 64, 128]

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        background: value ? '#3b82f6' : 'rgba(255,255,255,0.12)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        padding: 0,
        flexShrink: 0,
        transition: 'background 0.2s ease',
      }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
        animate={{ left: value ? '18px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </motion.button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      style={{
        width: '1px',
        height: '32px',
        background: 'rgba(255,255,255,0.07)',
        flexShrink: 0,
        margin: '0 4px',
      }}
    />
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 px-4">
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  )
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────
function ChevronUp({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M2 7L5 4L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Refresh icon ─────────────────────────────────────────────────────────────
function RefreshIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M10 6A4 4 0 1 1 6 2M6 2L8.5 4M6 2L8.5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── IconButton ───────────────────────────────────────────────────────────────
function IconButton({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center"
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        padding: 0,
      }}
      whileHover={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}

// ─── Popover wrapper ─────────────────────────────────────────────────────────
function Popover({
  open,
  onClose,
  children,
  anchorRef,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose, anchorRef])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            background: 'rgba(18, 18, 28, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            padding: '12px',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SIZE_OPTIONS = [1, 2, 4] as const
type PixelRatio = typeof SIZE_OPTIONS[number]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ControlPanel() {
  const [themeOpen, setThemeOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [pixelRatio, setPixelRatio] = useState<PixelRatio>(2)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const themeRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  const {
    theme, gradientId, padding, showBackground, showMacButtons, showLineNumbers, language, projectName,
    setTheme, setGradientId, setPadding, setShowBackground, setShowMacButtons, setShowLineNumbers, setLanguage, setProjectName,
  } = useEditorStore()
  const { savePng, saveSvg, copyImage, copyUrl } = useExportImage()

  const filename = projectName.trim() || 'syntaxshot'

  function showFeedback(msg: string) {
    setCopyFeedback(msg)
    setTimeout(() => setCopyFeedback(null), 2000)
  }

  const currentTheme = themes.find(t => t.id === theme) ?? themes[0]
  const currentLang = languages.find(l => l.id === language) ?? languages[0]

  function cycleTheme() {
    const idx = themes.findIndex(t => t.id === theme)
    const next = themes[(idx + 1) % themes.length]
    setTheme(next.id)
  }

  return (
    <motion.div
      className="relative w-full flex justify-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="flex items-center"
        style={{
          background: 'rgba(16, 16, 24, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          height: '64px',
          paddingRight: '12px',
        }}
      >

        {/* ── Theme ── */}
        <div ref={themeRef} className="relative">
          <Section label="Theme">
            <div className="flex items-center gap-1.5">
              <IconButton onClick={cycleTheme} title="Next theme">
                <RefreshIcon />
              </IconButton>
              <motion.button
                onClick={() => setThemeOpen(v => !v)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{
                  background: themeOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'inherit',
                  fontSize: '11px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  gap: '6px',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: currentTheme.preview, border: '1px solid rgba(255,255,255,0.15)' }}
                />
                {currentTheme.name}
                <motion.span
                  animate={{ rotate: themeOpen ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}
                >
                  <ChevronUp />
                </motion.span>
              </motion.button>
            </div>
          </Section>

          {/* Theme Popover */}
          <Popover open={themeOpen} onClose={() => setThemeOpen(false)} anchorRef={themeRef}>
            <div style={{ width: '280px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Editor Theme
              </p>
              <div className="grid grid-cols-2 gap-1.5" style={{ marginBottom: '14px' }}>
                {themes.map(t => (
                  <motion.button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setThemeOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-left"
                    style={{
                      background: theme === t.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: theme === t.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                    whileHover={{ background: 'rgba(255,255,255,0.07)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div
                      style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.preview, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: theme === t.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Background
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {gradients.map(g => (
                  <motion.button
                    key={g.id}
                    onClick={() => setGradientId(g.id)}
                    className="flex flex-col items-center gap-1"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '28px',
                        borderRadius: '6px',
                        background: g.value,
                        outline: gradientId === g.id ? '2px solid rgba(59,130,246,0.8)' : '2px solid transparent',
                        outlineOffset: '2px',
                        transition: 'outline 0.15s ease',
                      }}
                    />
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{g.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </Popover>
        </div>

        <Divider />

        {/* ── Background ── */}
        <Section label="Background">
          <Toggle value={showBackground} onChange={setShowBackground} />
        </Section>

        <Divider />

        {/* ── Mac Buttons ── */}
        <Section label="Mac Buttons">
          <Toggle value={showMacButtons} onChange={setShowMacButtons} />
        </Section>

        <Divider />

        {/* ── Line Numbers ── */}
        <Section label="Line Numbers">
          <Toggle value={showLineNumbers} onChange={setShowLineNumbers} />
        </Section>

        <Divider />

        {/* ── Padding ── */}
        <Section label="Padding">
          <div
            className="flex items-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {PADDING_OPTIONS.map((val, i) => (
              <motion.button
                key={val}
                onClick={() => setPadding(val)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  border: 'none',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderRadius: 0,
                  background: padding === val ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: padding === val ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                whileHover={{ background: padding === val ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.12 }}
              >
                {val}
              </motion.button>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── Language ── */}
        <div ref={langRef} className="relative">
          <Section label="Language">
            <motion.button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
              style={{
                background: langOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'inherit',
                fontSize: '11px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                minWidth: '90px',
                justifyContent: 'space-between',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              {currentLang.name}
              <motion.span
                animate={{ rotate: langOpen ? 0 : 180 }}
                transition={{ duration: 0.2 }}
                style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}
              >
                <ChevronUp />
              </motion.span>
            </motion.button>
          </Section>

          {/* Language Popover */}
          <Popover open={langOpen} onClose={() => setLangOpen(false)} anchorRef={langRef}>
            <div style={{ width: '220px', maxHeight: '380px', overflowY: 'auto' }}>
              {languageGroups.map((group, gi) => (
                <div key={group.label} style={{ marginBottom: gi < languageGroups.length - 1 ? '8px' : 0 }}>
                  <p style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 10px 2px',
                  }}>
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-0.5 px-1">
                    {group.languages.map(lang => (
                      <motion.button
                        key={lang.id}
                        onClick={() => { setLanguage(lang.id); setLangOpen(false) }}
                        className="flex items-center px-2.5 py-1.5 rounded-lg"
                        style={{
                          background: language === lang.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                          border: language === lang.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '11px',
                          fontWeight: language === lang.id ? 600 : 400,
                          color: language === lang.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                          textAlign: 'left',
                          transition: 'all 0.12s ease',
                        }}
                        whileHover={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.1 }}
                      >
                        {lang.name}
                      </motion.button>
                    ))}
                  </div>
                  {gi < languageGroups.length - 1 && (
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '6px 8px 0' }} />
                  )}
                </div>
              ))}

              {/* ── Other fallback ── */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 8px 6px' }} />
              <div className="px-1 pb-1">
                <motion.button
                  onClick={() => { setLanguage('other'); setLangOpen(false) }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg"
                  style={{
                    background: language === 'other' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: language === 'other' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '11px',
                    fontWeight: language === 'other' ? 600 : 400,
                    color: language === 'other' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.12s ease',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: 'rgba(255,255,255,0.3)' }}>
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Other / Not listed
                </motion.button>
              </div>
            </div>
          </Popover>
        </div>

        <Divider />

        {/* ── File Name ── */}
        <Section label="File Name">
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            className="outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: 'inherit',
              color: 'rgba(255,255,255,0.7)',
              width: '110px',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            spellCheck={false}
          />
        </Section>

        <Divider />

        {/* ── Export ── */}
        <div ref={exportRef} className="relative px-3">
          {/* Split button */}
          <div
            className="flex items-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(99,60,220,0.9))',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(139,92,246,0.3)',
            }}
          >
            {/* Main action — saves PNG immediately */}
            <motion.button
              onClick={() => { savePng('preview-container', pixelRatio, filename); setExportOpen(false) }}
              className="flex items-center gap-2 px-3 py-2"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
            >
              {/* Download icon */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 10h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export Image
            </motion.button>

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

            {/* Dropdown arrow */}
            <motion.button
              onClick={() => setExportOpen(v => !v)}
              className="flex items-center justify-center px-2"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.8)',
                height: '100%',
                minHeight: '32px',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.12 }}
            >
              <motion.span
                animate={{ rotate: exportOpen ? 0 : 180 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <ChevronUp size={9} />
              </motion.span>
            </motion.button>
          </div>

          {/* Export Popover */}
          <Popover open={exportOpen} onClose={() => { setExportOpen(false); setSizeOpen(false) }} anchorRef={exportRef}>
            <div style={{ width: '210px' }}>

              {/* Save PNG */}
              <ExportMenuItem
                icon={<PngIcon />}
                label="Save PNG"
                shortcut="⌘ S"
                onClick={() => { savePng('preview-container', pixelRatio, filename); setExportOpen(false) }}
              />

              {/* Save SVG */}
              <ExportMenuItem
                icon={<SvgIcon />}
                label="Save SVG"
                shortcut="⌘ ⇧ S"
                onClick={() => { saveSvg('preview-container', filename); setExportOpen(false) }}
              />

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

              {/* Copy Image */}
              <ExportMenuItem
                icon={<CopyImgIcon />}
                label={copyFeedback === 'image' ? 'Copied!' : 'Copy Image'}
                shortcut="⌘ C"
                onClick={async () => {
                  await copyImage('preview-container', pixelRatio)
                  showFeedback('image')
                  setExportOpen(false)
                }}
              />

              {/* Copy URL */}
              <ExportMenuItem
                icon={<LinkIcon />}
                label={copyFeedback === 'url' ? 'Copied!' : 'Copy URL'}
                shortcut="⌘ ⇧ C"
                onClick={() => { copyUrl(); showFeedback('url'); setExportOpen(false) }}
              />

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

              {/* Size */}
              <div className="relative">
                <ExportMenuItem
                  icon={<SizeIcon />}
                  label="Size"
                  rightContent={
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {pixelRatio}x
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  }
                  onClick={() => setSizeOpen(v => !v)}
                />
                <AnimatePresence>
                  {sizeOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 4 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        left: '-110px',
                        bottom: '0',
                        background: 'rgba(22, 22, 32, 0.98)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        padding: '6px',
                        width: '100px',
                        zIndex: 60,
                      }}
                    >
                      {SIZE_OPTIONS.map(s => (
                        <motion.button
                          key={s}
                          onClick={() => { setPixelRatio(s); setSizeOpen(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '13px',
                            fontWeight: pixelRatio === s ? 600 : 400,
                            color: pixelRatio === s ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                            textAlign: 'left',
                          }}
                          whileHover={{ background: 'rgba(255,255,255,0.07)' }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.1 }}
                        >
                          {pixelRatio === s && (
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>●</span>
                          )}
                          {pixelRatio !== s && <span style={{ width: '12px', display: 'inline-block' }} />}
                          {s}x
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Export Menu Item ─────────────────────────────────────────────────────────
function ExportMenuItem({
  icon, label, shortcut, onClick, rightContent,
}: {
  icon: React.ReactNode
  label: string
  shortcut?: string
  onClick: () => void
  rightContent?: React.ReactNode
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'left',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.95)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      <span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {rightContent ?? (
        shortcut && (
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'inherit', letterSpacing: '0.02em' }}>
            {shortcut}
          </span>
        )
      )}
    </motion.button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PngIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 8.5h6M4 6h6M4 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function SvgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CopyImgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3.5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1.5h7a1 1 0 0 1 1 1v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 8.5a3.5 3.5 0 0 0 4.95 0l1.06-1.06a3.5 3.5 0 0 0-4.95-4.95L5.5 3.55" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8.5 5.5a3.5 3.5 0 0 0-4.95 0L2.49 6.56a3.5 3.5 0 0 0 4.95 4.95l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function SizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 12l3.5-3.5M12 2L8.5 5.5M2 12h4M2 12v-4M12 2H8M12 2v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
