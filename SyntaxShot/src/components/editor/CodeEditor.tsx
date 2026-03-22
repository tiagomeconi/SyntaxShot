'use client'
import React, { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
// ── Official lang packages ────────────────────────────────────────────────────
import { javascript } from '@codemirror/lang-javascript'
import { python }     from '@codemirror/lang-python'
import { rust }       from '@codemirror/lang-rust'
import { css }        from '@codemirror/lang-css'
import { html }       from '@codemirror/lang-html'
import { java }       from '@codemirror/lang-java'
import { cpp }        from '@codemirror/lang-cpp'
import { go }         from '@codemirror/lang-go'
import { php }        from '@codemirror/lang-php'
import { sql }        from '@codemirror/lang-sql'
import { json }       from '@codemirror/lang-json'
import { markdown }   from '@codemirror/lang-markdown'
import { xml }        from '@codemirror/lang-xml'
import { yaml }       from '@codemirror/lang-yaml'
import { sass }       from '@codemirror/lang-sass'
import { less }       from '@codemirror/lang-less'
import { vue }        from '@codemirror/lang-vue'
import { angular }    from '@codemirror/lang-angular'
import { wast }       from '@codemirror/lang-wast'
import { liquid }     from '@codemirror/lang-liquid'
// ── Community lang packages ───────────────────────────────────────────────────
import { elixir }   from 'codemirror-lang-elixir'
import { parser as solidityParser } from 'codemirror-lang-solidity'
import { graphqlLanguageSupport }   from 'cm6-graphql'
// ── Legacy modes (StreamLanguage wrappers) ────────────────────────────────────
import { StreamLanguage, LRLanguage, LanguageSupport } from '@codemirror/language'
import { shell }       from '@codemirror/legacy-modes/mode/shell'
import { ruby }        from '@codemirror/legacy-modes/mode/ruby'
import { lua }         from '@codemirror/legacy-modes/mode/lua'
import { haskell }     from '@codemirror/legacy-modes/mode/haskell'
import { erlang }      from '@codemirror/legacy-modes/mode/erlang'
import { julia }       from '@codemirror/legacy-modes/mode/julia'
import { diff }        from '@codemirror/legacy-modes/mode/diff'
import { dockerfile }  from '@codemirror/legacy-modes/mode/dockerfile'
import { clojure }     from '@codemirror/legacy-modes/mode/clojure'
import { commonLisp }  from '@codemirror/legacy-modes/mode/commonlisp'
import { crystal }     from '@codemirror/legacy-modes/mode/crystal'
import { elm }         from '@codemirror/legacy-modes/mode/elm'
import { cypher }      from '@codemirror/legacy-modes/mode/cypher'
import { toml }        from '@codemirror/legacy-modes/mode/toml'
import { powerShell }  from '@codemirror/legacy-modes/mode/powershell'
import { r }           from '@codemirror/legacy-modes/mode/r'
import { octave }      from '@codemirror/legacy-modes/mode/octave'
import { swift }       from '@codemirror/legacy-modes/mode/swift'
import { stex }        from '@codemirror/legacy-modes/mode/stex'
import { perl }        from '@codemirror/legacy-modes/mode/perl'
import { oCaml }       from '@codemirror/legacy-modes/mode/mllike'
import { csharp, kotlin, scala, dart, objectiveC } from '@codemirror/legacy-modes/mode/clike'
// ── Themes ────────────────────────────────────────────────────────────────────
import { oneDark }   from '@codemirror/theme-one-dark'
import { githubDark } from '@uiw/codemirror-theme-github'
import { dracula }    from '@uiw/codemirror-theme-dracula'
import { nord }       from '@uiw/codemirror-theme-nord'
import { monokai }    from '@uiw/codemirror-theme-monokai'
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night'
import { aura }       from '@uiw/codemirror-theme-aura'
import { andromeda }  from '@uiw/codemirror-theme-andromeda'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '@/store/useEditorStore'
import type { Language, EditorTheme } from '@/store/useEditorStore'

// ── Helpers ───────────────────────────────────────────────────────────────────
const legacy = (mode: object) => () => StreamLanguage.define(mode as Parameters<typeof StreamLanguage.define>[0])
const solidityLang = () => new LanguageSupport(LRLanguage.define({ parser: solidityParser }))

// ── Language map ──────────────────────────────────────────────────────────────
const languageExtensions: Record<Language, () => LanguageSupport | ReturnType<typeof javascript>> = {
  // ── Plaintext / no highlight
  plaintext:   () => new LanguageSupport(LRLanguage.define({ parser: solidityParser, languageData: {} }), []),

  // ── Web
  javascript:  () => javascript({ jsx: false }),
  typescript:  () => javascript({ typescript: true }),
  jsx:         () => javascript({ jsx: true }),
  tsx:         () => javascript({ jsx: true, typescript: true }),
  html:        () => html(),
  css:         () => css(),
  scss:        () => sass({ indented: false }),
  less:        () => less(),
  vue:         () => vue(),
  angular:     () => angular(),
  svelte:      () => html(),   // closest available
  astro:       () => html(),   // closest available
  liquid:      () => liquid(),

  // ── Systems
  rust:        () => rust(),
  cpp:         () => cpp(),
  c:           () => cpp(),    // @codemirror/lang-cpp covers C too
  go:          () => go(),
  wasm:        () => wast(),
  zig:         () => rust(),   // no CM6 package; rust is closest
  move:        () => rust(),   // no CM6 package; rust is closest

  // ── JVM / compiled
  java:        () => java(),
  kotlin:      legacy(kotlin),
  scala:       legacy(scala),
  csharp:      legacy(csharp),
  dart:        legacy(dart),
  swift:       legacy(swift),
  objectivec:  legacy(objectiveC),

  // ── Scripting / dynamic
  python:      () => python(),
  ruby:        legacy(ruby),
  php:         () => php(),
  lua:         legacy(lua),
  perl:        legacy(perl),
  r:           legacy(r),
  matlab:      legacy(octave),

  // ── Functional
  haskell:     legacy(haskell),
  ocaml:       legacy(oCaml),
  elixir:      () => elixir(),
  erlang:      legacy(erlang),
  gleam:       () => elixir(), // closest available
  clojure:     legacy(clojure),
  lisp:        legacy(commonLisp),
  elm:         legacy(elm),
  crystal:     legacy(crystal),
  julia:       legacy(julia),
  v:           () => go(),     // closest available

  // ── Shell / ops
  bash:        legacy(shell),
  powershell:  legacy(powerShell),
  dockerfile:  legacy(dockerfile),
  hcl:         legacy(toml),   // closest available

  // ── Data / config
  json:        () => json(),
  yaml:        () => yaml(),
  xml:         () => xml(),
  markdown:    () => markdown(),
  toml:        legacy(toml),
  diff:        legacy(diff),
  latex:       legacy(stex),

  // ── Query / graph
  sql:         () => sql(),
  graphql:     () => graphqlLanguageSupport(),
  cypher:      legacy(cypher),

  // ── Blockchain
  solidity:    solidityLang,

  // ── Other
  prisma:      () => javascript(), // closest available
  other:       () => new LanguageSupport(LRLanguage.define({ parser: solidityParser, languageData: {} }), []),
}

// ── Theme map ─────────────────────────────────────────────────────────────────
const themeMap: Record<EditorTheme, typeof oneDark> = {
  'github-dark':  githubDark,
  'one-dark-pro': oneDark,
  'dracula':      dracula,
  'nord':         nord,
  'monokai':      monokai,
  'tokyo-night':  tokyoNight,
  'aura':         aura,
  'andromeda':    andromeda,
}

// ── Transparent overlay theme ─────────────────────────────────────────────────
const transparentTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent !important' },
  '.cm-scroller': { overflow: 'visible !important', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
  '.cm-gutters': {
    backgroundColor: 'transparent !important',
    border: 'none',
    color: 'rgba(255,255,255,0.25)',
    paddingRight: '16px',
  },
  '.cm-activeLineGutter':               { backgroundColor: 'transparent !important' },
  '.cm-activeLine':                     { backgroundColor: 'rgba(255,255,255,0.03) !important' },
  '.cm-cursor':                         { borderLeftColor: 'rgba(255,255,255,0.7) !important' },
  '.cm-selectionBackground':            { backgroundColor: 'rgba(255,255,255,0.1) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(255,255,255,0.12) !important' },
})

// ── Component ─────────────────────────────────────────────────────────────────
export default function CodeEditor() {
  const { code, language, fontSize, showLineNumbers, theme, setCode } = useEditorStore()
  const onChange = useCallback((value: string) => setCode(value), [setCode])

  const langExt       = (languageExtensions[language] ?? languageExtensions.plaintext)()
  const selectedTheme = themeMap[theme] ?? githubDark

  return (
    <div
      style={{ fontSize: `${fontSize}px` }}
      className={`w-full editor-fade-in ${!showLineNumbers ? 'hide-line-numbers' : ''}`}
    >
      <CodeMirror
        value={code}
        onChange={onChange}
        extensions={[langExt, transparentTheme]}
        theme={selectedTheme}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: false,
          historyKeymap: true,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
        className="w-full"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  )
}
