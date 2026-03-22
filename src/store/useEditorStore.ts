import { create } from 'zustand'

export type Language =
  | 'plaintext' | 'bash' | 'diff' | 'dockerfile' | 'toml' | 'graphql' | 'liquid' | 'prisma'
  | 'javascript' | 'typescript' | 'jsx' | 'tsx' | 'html' | 'css' | 'scss' | 'less' | 'vue' | 'angular' | 'svelte' | 'astro'
  | 'rust' | 'cpp' | 'c' | 'go' | 'wasm' | 'zig' | 'move'
  | 'python' | 'java' | 'php' | 'sql' | 'elixir' | 'erlang' | 'gleam'
  | 'csharp' | 'kotlin' | 'scala' | 'swift' | 'dart' | 'objectivec' | 'ruby' | 'lua' | 'perl' | 'haskell' | 'ocaml' | 'clojure' | 'lisp' | 'crystal' | 'elm' | 'julia' | 'r' | 'matlab' | 'powershell' | 'latex' | 'v'
  | 'json' | 'yaml' | 'xml' | 'markdown'
  | 'solidity' | 'cypher' | 'hcl'
  | 'other'

export type EditorTheme = 'github-dark' | 'one-dark-pro' | 'dracula' | 'nord' | 'monokai' | 'tokyo-night' | 'aura' | 'andromeda'

export interface EditorState {
  code: string
  projectName: string
  language: Language
  theme: EditorTheme
  gradientId: string
  padding: number
  showBackground: boolean
  showMacButtons: boolean
  showLineNumbers: boolean
  fontSize: number
  windowTitle: string
  showWindowTitle: boolean
  setCode: (code: string) => void
  setProjectName: (name: string) => void
  setLanguage: (language: Language) => void
  setTheme: (theme: EditorTheme) => void
  setGradientId: (id: string) => void
  setPadding: (padding: number) => void
  setShowBackground: (show: boolean) => void
  setShowMacButtons: (show: boolean) => void
  setShowLineNumbers: (show: boolean) => void
  setFontSize: (size: number) => void
  setWindowTitle: (title: string) => void
  setShowWindowTitle: (show: boolean) => void
}

const DEFAULT_CODE = `// Welcome to SyntaxShot ✨
// Paste your code and create beautiful screenshots

function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const result = Array.from({ length: 10 }, (_, i) => fibonacci(i))
console.log('Fibonacci sequence:', result)

// Customize the appearance using the controls below`

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE,
  projectName: 'syntaxshot',
  language: 'typescript',
  theme: 'github-dark',
  gradientId: 'midnight',
  padding: 64,
  showBackground: true,
  showMacButtons: true,
  showLineNumbers: true,
  fontSize: 14,
  windowTitle: 'index.ts',
  showWindowTitle: true,
  setCode: (code) => set({ code }),
  setProjectName: (projectName) => set({ projectName }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setGradientId: (gradientId) => set({ gradientId }),
  setPadding: (padding) => set({ padding }),
  setShowBackground: (showBackground) => set({ showBackground }),
  setShowMacButtons: (showMacButtons) => set({ showMacButtons }),
  setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
  setFontSize: (fontSize) => set({ fontSize }),
  setWindowTitle: (windowTitle) => set({ windowTitle }),
  setShowWindowTitle: (showWindowTitle) => set({ showWindowTitle }),
}))
