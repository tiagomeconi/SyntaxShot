'use client'
import { useCallback, useRef } from 'react'
import { toPng, toSvg, toBlob } from 'html-to-image'

function getElement(elementId: string) {
  return document.getElementById(elementId)
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

function showWatermark(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>('[data-watermark]').forEach(w => {
    w.style.opacity = '1'
  })
}

function hideWatermark(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>('[data-watermark]').forEach(w => {
    w.style.opacity = '0'
  })
}

export function useExportImage() {
  const busy = useRef(false)

  const savePng = useCallback(async (elementId: string, pixelRatio = 2, filename = 'syntaxshot') => {
    if (busy.current) return
    busy.current = true
    const el = getElement(elementId)
    if (!el) { busy.current = false; return }
    try {
      showWatermark(el)
      const url = await toPng(el, { quality: 1, pixelRatio, skipFonts: false })
      triggerDownload(url, `${filename}.png`)
    } catch (e) {
      console.error('PNG export failed', e)
    } finally {
      hideWatermark(el)
      busy.current = false
    }
  }, [])

  const saveSvg = useCallback(async (elementId: string, filename = 'syntaxshot') => {
    if (busy.current) return
    busy.current = true
    const el = getElement(elementId)
    if (!el) { busy.current = false; return }
    try {
      showWatermark(el)
      const url = await toSvg(el, { skipFonts: false })
      triggerDownload(url, `${filename}.svg`)
    } catch (e) {
      console.error('SVG export failed', e)
    } finally {
      hideWatermark(el)
      busy.current = false
    }
  }, [])

  const copyImage = useCallback(async (elementId: string, pixelRatio = 2) => {
    if (busy.current) return
    busy.current = true
    const el = getElement(elementId)
    if (!el) { busy.current = false; return }
    try {
      showWatermark(el)
      const blob = await toBlob(el, { quality: 1, pixelRatio, skipFonts: false })
      if (!blob) return
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
    } catch (e) {
      console.error('Copy image failed', e)
    } finally {
      hideWatermark(el)
      busy.current = false
    }
  }, [])

  const copyUrl = useCallback(() => {
    try {
      navigator.clipboard.writeText(window.location.href)
    } catch (e) {
      console.error('Copy URL failed', e)
    }
  }, [])

  return { savePng, saveSvg, copyImage, copyUrl }
}
